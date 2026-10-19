const { HttpError } = require('./errorHandler');
const fail = (message) => { throw new HttpError(400, message); };
function text(value, field, max = 10000) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) fail(`${field} es obligatorio y debe ser texto de hasta ${max} caracteres`);
  return value.trim();
}
function email(value, field = 'email') {
  const result = text(value, field, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail(`${field} debe ser un correo válido`);
  return result;
}
function integer(value, field, min = 0) {
  if (!['number', 'string'].includes(typeof value) || value === '' || (typeof value === 'string' && !/^\d+$/.test(value))) fail(`${field} debe ser un entero mayor o igual a ${min}`);
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result < min || result > 2147483647) fail(`${field} debe ser un entero mayor o igual a ${min}`);
  return result;
}
function choice(value, field, values) {
  if (!values.includes(value)) fail(`${field} debe ser uno de: ${values.join(', ')}`);
  return value;
}
function boolean(value, field) {
  if (typeof value !== 'boolean') fail(`${field} debe ser booleano`);
  return value;
}
function body(req, res, next) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return next(new HttpError(400, 'El cuerpo debe ser un objeto JSON'));
  next();
}
module.exports = { text, email, integer, choice, boolean, body, fail };
