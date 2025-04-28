import AppError from '../utils/error.js';
import  logger  from '../config/logger.js';

// Middleware to validate request body using Joi schema
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error(`Validation error: ${error.message}`);
    next(new AppError(error.message, 400));
  }
};

export { validate };