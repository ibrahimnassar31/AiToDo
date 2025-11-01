import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_EXPIRE = '1d';
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Clear all mocks
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  await mongoServer.stop();
});

// Global test utilities
global.testUtils = {
  /**
   * Create a test user
   */
  createTestUser: async (userData = {}) => {
    const User = (await import('../models/User.module.js')).default;
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!'
    };
    
    const user = new User({ ...defaultUser, ...userData });
    await user.save();
    return user;
  },

  /**
   * Create a test task
   */
  createTestTask: async (userId, taskData = {}) => {
    const Task = (await import('../models/Task.module.js')).default;
    const defaultTask = {
      userId,
      title: 'Test Task',
      description: 'Test task description',
      priority: 'Medium',
      status: 'Pending'
    };
    
    const task = new Task({ ...defaultTask, ...taskData });
    await task.save();
    return task;
  },

  /**
   * Generate JWT token for testing
   */
  generateTestToken: async (userId) => {
    const jwt = (await import('jsonwebtoken')).default;
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  },

  /**
   * Mock external services
   */
  mockExternalServices: () => {
    // Mock logger to prevent console output during tests
    jest.mock('../config/logger.js', () => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }));
  }
};

// Suppress console output during tests unless explicitly needed
const originalConsole = console;
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Restore console for specific tests if needed
global.restoreConsole = () => {
  global.console = originalConsole;
};
