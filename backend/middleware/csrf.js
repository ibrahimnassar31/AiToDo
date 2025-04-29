import session from 'express-session';
import csurf from 'csrf';
import  logger  from '../config/logger.js';

const csrfProtection = new csurf();

export const setupSessionAndCsrf = (app) => {
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
    })
  );

  app.use((req, res, next) => {
    if (req.method === 'GET') {
      return next();
    }
    csrfProtection(req, res, (err) => {
      if (err) {
        logger.error(`CSRF Error: ${err.message}`);
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
      next();
    });
  });

  // Add CSRF token to response for frontend
  app.use((req, res, next) => {
    if (req.session) {
      res.locals.csrfToken = req.csrfToken();
    }
    next();
  });
};