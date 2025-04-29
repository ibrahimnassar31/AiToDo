import express from 'express';
import { getUserAnalytics, getAggregatedAnalytics } from '../controllers/analytics.controller.js';
import { validate } from '../middleware/validate.js';
import { analyticsQuerySchema } from '../utils/validationSchemas.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getUserAnalytics);
router.get('/aggregated', auth, validate(analyticsQuerySchema), getAggregatedAnalytics);

export default router;