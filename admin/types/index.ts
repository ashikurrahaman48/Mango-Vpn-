// admin/types/index.ts

export interface AdminUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export type ServerStatus = 'online' | 'offline' | 'maintenance';

export interface AdminServer {
  id: string;
  name: string;
  location: string;
  ip: string;
  status: ServerStatus;
  currentClients: number;
  maxClients: number;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface AdminLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
}

export interface DashboardStats {
  activeUsers: number;
  onlineServers: number;
  totalServers: number;
  bandwidthUsage: {
    total: number; // in GB
    peak: number; // in Mbps
  };
}
