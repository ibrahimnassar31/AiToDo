// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger.js'; 
// Load environment variables
dotenv.config();

// Function to connect to the database
const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
      throw new Error('MongoDB URI is not defined in the environment variables.');
    }

    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the application if the connection fail
  }
};

export default connectDB;