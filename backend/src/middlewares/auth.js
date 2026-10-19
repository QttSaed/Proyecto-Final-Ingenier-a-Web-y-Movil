const jwt = require('jsonwebtoken');
const { HttpError } = require('./errorHandler');
function authenticateJWT(req, res, next) {
  const match = /^Bearer (\S+)$/i.exec(req.headers.authorization || '');
  if (!match) return next(new HttpError(401, 'Se requiere un token válido'));
  try {
    const payload = jwt.verify(match[1], req.app.locals.jwtSecret, { algorithms: ['HS256'] });
    if (!payload.sub || !['admin', 'client'].includes(payload.role)) throw new Error('Invalid claims');
    req.user = { id: payload.sub, email: payload.email, role: payload.role, name: payload.name };
    next();
  } catch { next(new HttpError(401, 'Token inválido o expirado')); }
}
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return next(new HttpError(401, 'Se requiere autenticación'));
  if (!roles.includes(req.user.role)) return next(new HttpError(403, 'No tienes permisos para esta operación'));
  next();
};
module.exports = { authenticateJWT, authorizeRoles };
