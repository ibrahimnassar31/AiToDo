import AppError from '../utils/error.js';
import  logger  from '../config/logger.js';

// Global error handling middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (err instanceof AppError) {
    logger.warn(`Operational error: ${message}`);
    return res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  logger.error(`Unexpected error: ${message}`, { stack: err.stack });
  res.status(statusCode).json({
    success: false,
    message: 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandlerMiddleware;