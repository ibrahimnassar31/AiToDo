import User from '../models/User.module.js';
import AppError from '../utils/error.js';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register a new user
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.error(`Registration failed: User already exists with email ${email}`);
    throw new AppError('User already exists', 400);
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

// Login user and generate JWT token
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.error(`Login failed: User not found for email ${email}`);
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user._id, email: user.email });
  return { user, token };
};

// Get user profile by ID
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    logger.error(`User profile retrieval failed: User not found with ID ${userId}`);
    throw new AppError('User not found', 404);
  }
  return user;
};

export default { registerUser, loginUser, getUserProfile, generateToken };