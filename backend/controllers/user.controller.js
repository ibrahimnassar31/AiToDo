import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/authService.js';
import logger from '../config/logger.js';
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser({ name, email, password });
  logger.info(`User registered: ${email}`);
  res.status(201).json({ user: { id: user._id, name, email } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });
  logger.info(`User logged in: ${email}`);
  res.json({ user: { id: user._id, name: user.name, email }, token });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  logger.info(`Profile retrieved for user: ${user.email}`);
  res.json({ user: { id: user._id, name: user.name, email: user.email, preferences: user.preferences } });
});

export { register, login, getProfile };