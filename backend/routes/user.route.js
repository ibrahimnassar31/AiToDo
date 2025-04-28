import express from 'express';
import { register, login, getProfile } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validationSchemas.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', validate(registerSchema), register);

// Login user
router.post('/login', validate(loginSchema), login);

// Get user profile (protected route)
router.get('/profile', auth, getProfile);

export default router;