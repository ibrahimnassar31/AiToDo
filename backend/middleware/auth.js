import jwt from 'jsonwebtoken';
import AppError from '../utils/error.js';
import  logger  from '../config/logger.js';

// JWT authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Auth error: ${error.message}`);
    next(new AppError('Invalid token', 401));
  }
};

export default auth;