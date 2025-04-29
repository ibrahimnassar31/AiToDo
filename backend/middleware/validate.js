import AppError from '../utils/error.js';
import  logger  from '../config/logger.js';

// Middleware to validate request body using Joi schema
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((err) => err.message).join(', ');
    logger.error(`Validation error: ${errors}`);
    next(new AppError(`Validation failed: ${errors}`, 400));
  }
};

export { validate };