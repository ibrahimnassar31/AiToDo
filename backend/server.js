import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmetMiddleware from './middleware/helmet.js';
import corsMiddleware from './middleware/cors.js';
import rateLimiterMiddleware from './middleware/rateLimiter.js';
import errorHandlerMiddleware from './middleware/error.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(helmetMiddleware());
app.use(corsMiddleware());
app.use(rateLimiterMiddleware());

// Routes

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});