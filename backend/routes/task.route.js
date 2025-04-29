import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller.js';
import { validate } from '../middleware/validate.js';
import { taskSchema, taskUpdateSchema } from '../utils/validationSchemas.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Task routes (all protected by auth middleware)
router.post('/', auth, validate(taskSchema), createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.patch('/:id', auth, validate(taskUpdateSchema), updateTask);
router.delete('/:id', auth, deleteTask);

export default router;