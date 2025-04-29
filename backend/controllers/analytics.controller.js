import asyncHandler from '../utils/asyncHandler.js';
import analyticsService from '../services/analyticsService.js';
import  logger  from '../config/logger.js';

const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const analytics = await analyticsService.getUserAnalytics(userId);
  logger.info(`Analytics retrieved for user ${userId}`);
  res.json({ analytics });
});

const getAggregatedAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;
  const analytics = await analyticsService.getAggregatedAnalytics(userId, startDate, endDate);
  logger.info(`Aggregated analytics retrieved for user ${userId}`);
  res.json({ analytics });
});

export { getUserAnalytics, getAggregatedAnalytics };