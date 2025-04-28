import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import helmetMiddleware from './middleware/helmet.js';
import corsMiddleware from './middleware/cors.js';
import rateLimiterMiddleware from './middleware/rateLimiter.js';
import errorHandlerMiddleware from './utils/error.js';
import logger from './config/logger.js';
import loggerMiddleware from './middleware/logger.js';


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
app.use(loggerMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});