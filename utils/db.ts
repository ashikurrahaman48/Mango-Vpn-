
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in environment variables.');
      // Fix: Replace `process.exit(1)` as `process.exit` may not be available or correctly typed in all environments. Throwing an error is a more robust way to handle this failure.
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    // Avoid reconnecting if already connected or connecting
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const conn = await mongoose.connect(mongoUri, {
      // Mongoose 6+ no longer needs these options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    // Fix: Replace `process.exit(1)` to allow for graceful error handling by the calling function instead of terminating the entire process.
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDB;
