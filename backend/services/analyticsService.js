import Analytics from '../models/Analytics.module.js';
import Task from '../models/Task.module.js';
import AppError from '../utils/error.js';
import logger from '../config/logger.js';

const recordTaskAnalytics = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
  
    let analytics = await Analytics.findOne({ taskId, userId });
    if (!analytics) {
      analytics = new Analytics({
        userId,
        taskId,
        category: task.category,
        priority: task.priority,
        status: task.status,
      });
    } else {
      analytics.category = task.category;
      analytics.priority = task.priority;
      analytics.status = task.status;
    }
  
    if (task.status === 'Completed' && analytics.completionTime === 0) {
      const completionTime = Math.round(
        (task.updatedAt - task.createdAt) / (1000 * 60) 
      );
      analytics.completionTime = completionTime;
      logger.info(`Completion time calculated for task ${taskId}: ${completionTime} minutes`);
    }
  
    if (task.status === 'Completed') {
      analytics.productivityScore = calculateProductivityScore(task, analytics.completionTime);
      logger.info(`Productivity score calculated for task ${taskId}: ${analytics.productivityScore}`);
    }
  
    await analytics.save();
    return analytics;
  };
  
  const calculateProductivityScore = (task, completionTime) => {
    let score = 50; 
    if (task.priority === 'High') score += 20;
    if (task.priority === 'Low') score -= 10;
    if (completionTime > 0 && completionTime <= 60) score += 20; 
    else if (completionTime > 60 && completionTime <= 120) score += 10; 
    else if (completionTime > 120) score -= 10; 
    if (task.dueDate && new Date(task.dueDate) >= new Date(task.updatedAt)) score += 10; 
    return Math.min(100, Math.max(0, score)); 
  };
  
  const getUserAnalytics = async (userId) => {
    const analytics = await Analytics.find({ userId }).populate('taskId').sort({ updatedAt: -1 });
    return analytics;
  };
  
  const getAggregatedAnalytics = async (userId, startDate, endDate) => {
    const match = { userId };
    if (startDate && endDate) {
      match.updatedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  
    const analytics = await Analytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          avgCompletionTime: { $avg: '$completionTime' },
          avgProductivityScore: { $avg: '$productivityScore' },
          totalTasks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return analytics;
  };
  
  export default { recordTaskAnalytics, getUserAnalytics, getAggregatedAnalytics };