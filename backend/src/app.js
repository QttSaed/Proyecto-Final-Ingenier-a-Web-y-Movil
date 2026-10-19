const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const db = require('./config/db');
const routes = require('./routes');
const { HttpError, errorHandler } = require('./middlewares/errorHandler');
function createApp(options = {}) {
  const app = express();
  app.locals.db = options.db || db;
  app.locals.jwtSecret = options.jwtSecret || process.env.JWT_SECRET;
  app.locals.jwtExpiresIn = options.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '2h';
  if (!app.locals.jwtSecret) throw new Error('JWT_SECRET es obligatorio');
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(origin => origin.trim()) }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: options.authRateLimit || 100, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Demasiados intentos. Intenta más tarde' } }));
  app.use('/api', routes);
  app.use((req, res, next) => next(new HttpError(404, 'Ruta no encontrada')));
  app.use(errorHandler);
  return app;
}
module.exports = { createApp };
