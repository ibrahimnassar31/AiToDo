import User from '../models/User.module.js';
import AppError from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register a new user
const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

// Login user and generate JWT token
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken({ id: user._id, email: user.email });
  return { user, token };
};

// Get user profile by ID
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export default { registerUser, loginUser, getUserProfile, generateToken };