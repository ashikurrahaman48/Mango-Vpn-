import mongoose, { Schema, Document } from 'mongoose';

export interface IServer extends Document {
  name: string;
  host: string;
  port: number;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  maxClients: number;
  currentClients: number;
}

const ServerSchema: Schema<IServer> = new Schema({
  name: {
    type: String,
    required: [true, 'Server name is required'],
    trim: true,
  },
  host: {
    type: String,
    required: [true, 'Server host is required'],
    trim: true,
  },
  port: {
    type: Number,
    required: [true, 'Server port is required'],
  },
  location: {
    type: String,
    required: [true, 'Server location is required'],
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline',
  },
  maxClients: {
    type: Number,
    required: [true, 'Max clients is required'],
    default: 100,
  },
  currentClients: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<IServer>('Server', ServerSchema);
