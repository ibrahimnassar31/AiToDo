import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('Pending', 'Completed').optional(),
  category: Joi.string().allow('').optional(),
  aiSuggestions: Joi.object().optional(),
});

// Validation schema for task updates (partial)
const taskUpdateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
  dueDate: Joi.date().optional(),
  status: Joi.string().valid('Pending', 'Completed').optional(),
  category: Joi.string().allow('').optional(),
  aiSuggestions: Joi.object().optional(),
});



export { registerSchema, loginSchema , taskSchema, taskUpdateSchema };