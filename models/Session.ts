import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IServer } from './Server';

export interface ISession extends Document {
  // Fix: Use Schema.Types.ObjectId to correctly type document references.
  userId: Schema.Types.ObjectId;
  serverId: Schema.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  dataUsed: {
    download: number; // in MB
    upload: number; // in MB
  };
  status: 'active' | 'closed';
}

const SessionSchema: Schema<ISession> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serverId: {
    type: Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  dataUsed: {
    download: { type: Number, default: 0 },
    upload: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
});

export default mongoose.model<ISession>('Session', SessionSchema);