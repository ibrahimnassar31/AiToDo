import Joi from 'joi';
import { ValidationError } from '../utils/errorTypes.js';

/**
 * Generic validation middleware factory
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      const field = error.details[0]?.path?.join('.') || null;
      return next(new ValidationError(errorMessage, field));
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

/**
 * User validation schemas
 */
export const userValidation = {
  register: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Name can only contain letters and spaces',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters'
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .required(),
    password: Joi.string()
      .required()
  }),

  updateProfile: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .optional(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .optional()
  }).min(1)
};

/**
 * Task validation schemas
 */
export const taskValidation = {
  create: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.min': 'Task title cannot be empty',
        'string.max': 'Task title cannot exceed 200 characters'
      }),
    description: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .default('Medium'),
    dueDate: Joi.date()
      .min('now')
      .optional()
      .messages({
        'date.min': 'Due date cannot be in the past'
      }),
    category: Joi.string()
      .trim()
      .max(50)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Category cannot exceed 50 characters'
      })
  }),

  update: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .optional(),
    description: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .allow(''),
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .optional(),
    status: Joi.string()
      .valid('Pending', 'Completed')
      .optional(),
    dueDate: Joi.date()
      .min('now')
      .optional()
      .allow(null),
    category: Joi.string()
      .trim()
      .max(50)
      .optional()
      .allow('')
  }).min(1),

  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),
    status: Joi.string()
      .valid('Pending', 'Completed')
      .optional(),
    priority: Joi.string()
      .valid('Low', 'Medium', 'High')
      .optional(),
    category: Joi.string()
      .trim()
      .optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'updatedAt', 'dueDate', 'priority', 'title')
      .default('createdAt'),
    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
    search: Joi.string()
      .trim()
      .max(100)
      .optional()
  })
};

/**
 * Common validation schemas
 */
export const commonValidation = {
  mongoId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format'
      })
  }),

  pagination: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
  })
};

/**
 * Sanitization helpers
 */
export const sanitize = {
  /**
   * Remove HTML tags and dangerous characters
   */
  html: (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .trim();
  },

  /**
   * Normalize whitespace
   */
  whitespace: (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/\s+/g, ' ').trim();
  }
};

/**
 * Custom validation middleware for specific use cases
 */
export const customValidation = {
  /**
   * Validate that user owns the resource
   */
  validateOwnership: (Model, resourceIdField = 'id') => {
    return async (req, res, next) => {
      try {
        const resourceId = req.params[resourceIdField];
        const userId = req.user.id;

        const resource = await Model.findById(resourceId);
        if (!resource) {
          return next(new NotFoundError('Resource'));
        }

        if (resource.userId.toString() !== userId) {
          return next(new AuthorizationError('You can only access your own resources'));
        }

        req.resource = resource;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
};
