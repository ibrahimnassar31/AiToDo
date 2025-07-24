import { describe, test, expect, beforeEach } from '@jest/globals';
import User from '../../../models/User.module.js';
import bcrypt from 'bcryptjs';

describe('User Model', () => {
  let userData;

  beforeEach(() => {
    userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'TestPass123!'
    };
  });

  describe('User Creation', () => {
    test('should create a user with valid data', async () => {
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.createdAt).toBeDefined();
    });

    test('should hash password before saving', async () => {
      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe(userData.password);
      expect(user.password.length).toBeGreaterThan(50); // Hashed password is longer
    });

    test('should convert email to lowercase', async () => {
      userData.email = 'JOHN@EXAMPLE.COM';
      const user = new User(userData);
      await user.save();

      expect(user.email).toBe('john@example.com');
    });

    test('should trim whitespace from name', async () => {
      userData.name = '  John Doe  ';
      const user = new User(userData);
      await user.save();

      expect(user.name).toBe('John Doe');
    });
  });

  describe('User Validation', () => {
    test('should require name', async () => {
      delete userData.name;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow(/name.*required/i);
    });

    test('should require email', async () => {
      delete userData.email;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow(/email.*required/i);
    });

    test('should require password', async () => {
      delete userData.password;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow(/password.*required/i);
    });

    test('should require unique email', async () => {
      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      await expect(user2.save()).rejects.toThrow(/duplicate key error/i);
    });

    test('should require minimum password length', async () => {
      userData.password = '12345'; // Less than 6 characters
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow(/password.*shorter/i);
    });

    test('should validate email format', async () => {
      userData.email = 'invalid-email';
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow(/email.*valid/i);
    });
  });

  describe('Password Methods', () => {
    let user;

    beforeEach(async () => {
      user = new User(userData);
      await user.save();
    });

    test('should compare password correctly', async () => {
      const isMatch = await user.comparePassword('TestPass123!');
      expect(isMatch).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });

    test('should hash password when updated', async () => {
      const originalHash = user.password;
      user.password = 'NewPass123!';
      await user.save();

      expect(user.password).not.toBe('NewPass123!');
      expect(user.password).not.toBe(originalHash);
    });

    test('should not rehash password if not modified', async () => {
      const originalHash = user.password;
      user.name = 'Updated Name';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('User Schema Properties', () => {
    test('should have correct schema structure', () => {
      const userSchema = User.schema;
      
      expect(userSchema.paths.name).toBeDefined();
      expect(userSchema.paths.email).toBeDefined();
      expect(userSchema.paths.password).toBeDefined();
      expect(userSchema.paths.createdAt).toBeDefined();
    });

    test('should have correct field types', () => {
      const userSchema = User.schema;
      
      expect(userSchema.paths.name.instance).toBe('String');
      expect(userSchema.paths.email.instance).toBe('String');
      expect(userSchema.paths.password.instance).toBe('String');
      expect(userSchema.paths.createdAt.instance).toBe('Date');
    });

    test('should have correct field options', () => {
      const userSchema = User.schema;
      
      expect(userSchema.paths.name.isRequired).toBe(true);
      expect(userSchema.paths.email.isRequired).toBe(true);
      expect(userSchema.paths.password.isRequired).toBe(true);
      expect(userSchema.paths.email.options.unique).toBe(true);
      expect(userSchema.paths.email.options.lowercase).toBe(true);
    });
  });

  describe('User Instance Methods', () => {
    test('should have comparePassword method', () => {
      const user = new User(userData);
      expect(typeof user.comparePassword).toBe('function');
    });

    test('comparePassword should return a promise', () => {
      const user = new User(userData);
      const result = user.comparePassword('test');
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Password Security', () => {
    test('should use bcrypt with sufficient rounds', async () => {
      const user = new User(userData);
      await user.save();

      // Check if password starts with bcrypt hash format
      expect(user.password).toMatch(/^\$2[aby]\$\d{2}\$/);
      
      // Verify it's using at least 10 rounds (should be 12 based on our fix)
      const rounds = parseInt(user.password.split('$')[2]);
      expect(rounds).toBeGreaterThanOrEqual(10);
    });

    test('should generate different hashes for same password', async () => {
      const user1 = new User({ ...userData, email: 'user1@test.com' });
      const user2 = new User({ ...userData, email: 'user2@test.com' });
      
      await user1.save();
      await user2.save();

      expect(user1.password).not.toBe(user2.password);
    });
  });
});
