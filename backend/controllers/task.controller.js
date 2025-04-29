// controllers/taskController.js
import asyncHandler from '../utils/asyncHandler.js';
import taskService from '../services/taskService.js';
import  logger  from '../config/logger.js';

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const taskData = req.body;
  const userId = req.user.id;
  const task = await taskService.createTask(taskData, userId);
  logger.info(`Task created by user ${userId}: ${task.title}`);
  res.status(201).json({ task });
});

// Get all tasks for the authenticated user
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tasks = await taskService.getTasks(userId);
  logger.info(`Tasks retrieved for user ${userId}`);
  res.json({ tasks });
});

// Get a single task by ID
const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const task = await taskService.getTaskById(id, userId);
  logger.info(`Task ${id} retrieved for user ${userId}`);
  res.json({ task });
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;
  const task = await taskService.updateTask(id, userId, updateData);
  logger.info(`Task ${id} updated by user ${userId}`);
  res.json({ task });
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  await taskService.deleteTask(id, userId);
  logger.info(`Task ${id} deleted by user ${userId}`);
  res.status(204).send('Task deleted');
});

export { createTask, getTasks, getTaskById, updateTask, deleteTask };