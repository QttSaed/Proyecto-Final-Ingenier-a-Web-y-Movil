const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const v = require('../middlewares/validate');
const { HttpError } = require('../middlewares/errorHandler');
const { user } = require('../utils/records');
const fields = 'id, name, email, role, phone, address, city, region';
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
  const { rows } = await db.query(`INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'client') RETURNING ${fields}`, [name, email, hash]);
  res.status(201).json(session(req, rows[0]));
};
exports.login = async (req, res) => {
  const email = v.email(req.body.email);
  if (typeof req.body.password !== 'string' || !req.body.password) v.fail('password es obligatorio');
  const { rows } = await req.app.locals.db.query(`SELECT ${fields}, password_hash FROM users WHERE email = $1`, [email]);
  if (!rows[0] || !await bcrypt.compare(req.body.password, rows[0].password_hash)) throw new HttpError(401, 'Correo o contraseña incorrectos');
  res.json(session(req, rows[0]));
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
