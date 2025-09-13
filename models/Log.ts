import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ILog extends Document {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  // Fix: Use Schema.Types.ObjectId to correctly type the optional document reference.
  userId?: Schema.Types.ObjectId;
  source: string;
}

const LogSchema: Schema<ILog> = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'debug'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional: not all logs are associated with a user
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model<ILog>('Log', LogSchema);