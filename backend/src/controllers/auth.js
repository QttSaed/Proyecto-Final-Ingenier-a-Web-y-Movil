const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const mailer = require('../services/mailer');
const googleAuth = require('../services/googleAuth');
const v = require('../middlewares/validate');
const { HttpError } = require('../middlewares/errorHandler');
const { user } = require('../utils/records');
const fields = 'id, name, email, role, phone, address, city, region, is_verified, avatar_url';
const clientUrl = req => process.env.CLIENT_URL || req.app.locals.clientUrl || 'http://localhost:5173';
function session(req, row) {
  return { token: jwt.sign({ email: row.email, role: row.role, name: row.name }, req.app.locals.jwtSecret,
    { subject: String(row.id), expiresIn: req.app.locals.jwtExpiresIn, algorithm: 'HS256' }), user: user(row) };
}
exports.register = async (req, res) => {
  const name = v.text(req.body.name, 'name', 150);
  const email = v.email(req.body.email);
  const password = req.body.password;
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) v.fail('password debe tener al menos 8 caracteres, una letra y un número, y hasta 72 bytes');
  const db = req.app.locals.db;
  if ((await db.query('SELECT id FROM users WHERE email = $1', [email])).rows.length) throw new HttpError(409, 'El correo ya está registrado');
  const hash = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString('hex');
  const { rows } = await db.query(`INSERT INTO users (name, email, password_hash, role, is_verified, verification_token, verification_expires_at) VALUES ($1, $2, $3, 'client', false, $4, CURRENT_TIMESTAMP + INTERVAL '24 hours') RETURNING ${fields}`, [name, email, hash, token]);
  const mailResult = await mailer.sendVerificationEmail({ email, name, token, clientUrl: clientUrl(req) });
  res.status(201).json({ message: 'Usuario registrado. Por favor verifica tu correo electrónico.', requiresVerification: true, email: rows[0].email, user: user(rows[0]), verificationUrl: mailResult.verificationUrl || null });
};
exports.login = async (req, res) => {
  const email = v.email(req.body.email);
  if (typeof req.body.password !== 'string' || !req.body.password) v.fail('password es obligatorio');
  const { rows } = await req.app.locals.db.query(`SELECT ${fields}, password_hash FROM users WHERE email = $1`, [email]);
  if (!rows[0]?.password_hash || !await bcrypt.compare(req.body.password, rows[0].password_hash)) throw new HttpError(401, 'Correo o contraseña incorrectos');
  if (rows[0].is_verified === false) throw new HttpError(403, 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
  res.json(session(req, rows[0]));
};
exports.googleLogin = async (req, res) => {
  const idToken = req.body.idToken || req.body.credential;
  if (!idToken || typeof idToken !== 'string') v.fail('idToken es obligatorio');
  let googlePayload;
  try {
    googlePayload = await googleAuth.verifyGoogleIdToken(idToken);
  } catch {
    throw new HttpError(401, 'Token de Google inválido');
  }
  if (!googlePayload || !googlePayload.email) throw new HttpError(401, 'No se pudo verificar la cuenta de Google');
  const email = googlePayload.email.trim().toLowerCase();
  const db = req.app.locals.db;
  const { rows } = await db.query(`SELECT ${fields}, google_id, password_hash FROM users WHERE email = $1`, [email]);
  let userRow;
  if (rows[0]) {
    const updated = await db.query(`UPDATE users SET google_id = COALESCE(google_id, $1), avatar_url = COALESCE(avatar_url, $2), is_verified = true, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING ${fields}`, [googlePayload.sub, googlePayload.picture, rows[0].id]);
    userRow = updated.rows[0];
  } else {
    const inserted = await db.query(`INSERT INTO users (name, email, password_hash, role, is_verified, google_id, avatar_url) VALUES ($1, $2, NULL, 'client', true, $3, $4) RETURNING ${fields}`, [googlePayload.name || 'Usuario Google', email, googlePayload.sub, googlePayload.picture]);
    userRow = inserted.rows[0];
  }
  res.json({ message: 'Inicio de sesión exitoso con Google.', ...session(req, userRow) });
};
exports.verifyEmail = async (req, res) => {
  const token = v.text(req.body?.token || req.query.token, 'token', 255);
  const db = req.app.locals.db;
  const { rows } = await db.query(`SELECT ${fields}, verification_expires_at FROM users WHERE verification_token = $1`, [token]);
  if (!rows[0]) throw new HttpError(400, 'El enlace de verificación es inválido.');
  if (rows[0].verification_expires_at && new Date(rows[0].verification_expires_at) < new Date()) throw new HttpError(400, 'El enlace de verificación ha expirado.');
  const result = await db.query(`UPDATE users SET is_verified = true, verification_token = NULL, verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING ${fields}`, [rows[0].id]);
  res.status(200).json({ message: 'Correo electrónico verificado exitosamente.', ...session(req, result.rows[0]) });
};
exports.resendVerification = async (req, res) => {
  const email = v.email(req.body.email);
  const db = req.app.locals.db;
  const { rows } = await db.query(`SELECT ${fields} FROM users WHERE email = $1`, [email]);
  if (!rows[0]) return res.json({ message: 'Si el correo está registrado y pendiente de verificación, se ha enviado un nuevo enlace.' });
  if (rows[0].is_verified === true) throw new HttpError(400, 'Esta cuenta ya se encuentra verificada.');
  const token = crypto.randomBytes(32).toString('hex');
  await db.query(`UPDATE users SET verification_token = $1, verification_expires_at = CURRENT_TIMESTAMP + INTERVAL '24 hours' WHERE id = $2`, [token, rows[0].id]);
  const mailResult = await mailer.sendVerificationEmail({ email, name: rows[0].name, token, clientUrl: clientUrl(req) });
  res.json({ message: 'Se ha enviado un nuevo enlace de verificación.', email, verificationUrl: mailResult.verificationUrl || null });
};
exports.me = async (req, res) => {
  const { rows } = await req.app.locals.db.query(`SELECT ${fields} FROM users WHERE id = $1`, [req.user.id]);
  if (!rows[0]) throw new HttpError(404, 'Usuario no encontrado');
  res.json(user(rows[0]));
};
exports.updateMe = async (req, res) => {
  const params = [], assignments = [];
  for (const [field, max] of Object.entries({ name: 150, phone: 30, address: 10000, city: 100, region: 100 })) {
    if (req.body[field] !== undefined) {
      params.push(field !== 'name' && (req.body[field] === null || req.body[field] === '') ? null : v.text(req.body[field], field, max));
      assignments.push(`${field} = $${params.length}`);
    }
  }
  if (!assignments.length) v.fail('Debes enviar al menos un campo de perfil');
  params.push(req.user.id);
  const { rows } = await req.app.locals.db.query(`UPDATE users SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING ${fields}`, params);
  if (!rows[0]) throw new HttpError(404, 'Usuario no encontrado');
  res.json(user(rows[0]));
};

exports.forgotPassword = async (req, res) => {
  const email = v.email(req.body.email);
  const db = req.app.locals.db;
  const { rows } = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
  if (!rows[0]) {
    return res.json({ message: 'Si el correo está registrado, hemos enviado las instrucciones para restablecer tu contraseña.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  await db.query(
    "UPDATE users SET reset_password_token = $1, reset_password_expires_at = CURRENT_TIMESTAMP + INTERVAL '1 hour', updated_at = CURRENT_TIMESTAMP WHERE id = $2",
    [token, rows[0].id]
  );
  const mailResult = await mailer.sendPasswordResetEmail({ email, name: rows[0].name, token, clientUrl: clientUrl(req) });
  res.json({
    message: 'Si el correo está registrado, hemos enviado las instrucciones para restablecer tu contraseña.',
    email,
    resetUrl: mailResult.resetUrl || null
  });
};
exports.resetPassword = async (req, res) => {
  const token = v.text(req.body?.token, 'token', 255);
  const password = req.body?.password;
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    v.fail('password debe tener al menos 8 caracteres, una letra y un número, y hasta 72 bytes');
  }
  const db = req.app.locals.db;
  const { rows } = await db.query('SELECT id, name, email, reset_password_expires_at FROM users WHERE reset_password_token = $1', [token]);
  if (!rows[0]) throw new HttpError(400, 'El enlace para restablecer la contraseña es inválido.');
  if (rows[0].reset_password_expires_at && new Date(rows[0].reset_password_expires_at) < new Date()) {
    throw new HttpError(400, 'El enlace para restablecer la contraseña ha expirado.');
  }
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [hash, rows[0].id]
  );
  res.status(200).json({ message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' });
};
