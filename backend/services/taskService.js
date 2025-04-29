// services/taskService.js
import Task from '../models/Task.module.js';
import AppError from '../utils/error.js';

// Create a new task
const createTask = async (taskData, userId) => {
  const task = new Task({ ...taskData, userId });
  await task.save();
  return task;
};

// Get all tasks for a user
const getTasks = async (userId) => {
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
  return tasks;
};

// Get a single task by ID
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

// Update a task
const updateTask = async (taskId, userId, updateData) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { ...updateData, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

// Delete a task
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

export default { createTask, getTasks, getTaskById, updateTask, deleteTask };