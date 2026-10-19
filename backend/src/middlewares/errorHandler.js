class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.code === '23505') return res.status(409).json({ message: 'El registro ya existe' });
  if (['23503', '23514', '22003', '22001', '22P02'].includes(err.code)) {
    return res.status(400).json({ message: 'Los datos no cumplen las restricciones del registro' });
  }
  const status = err.type === 'entity.parse.failed' ? 400 : err.type === 'entity.too.large' ? 400 : err.status || 500;
  const message = status >= 500 ? 'Error interno del servidor' : err.type === 'entity.parse.failed'
    ? 'El cuerpo debe ser JSON válido' : err.type === 'entity.too.large' ? 'El cuerpo excede el tamaño permitido' : err.message;
  res.status(status).json({ message });
}
module.exports = { HttpError, errorHandler };
