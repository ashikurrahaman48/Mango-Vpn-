
import { CLIENT_CONFIG } from './config/clientConfig';
import { logger } from './utils/logger';
import { ConnectionStatus, type Server, type Stats } from './types/client';

export class VpnClient {
  private listeners: Record<string, Function[]> = {};
  
  private state: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private stats: Stats = {
    connectionTime: 0,
    dataDownloaded: 0,
    dataUploaded: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
  };
  
  private statsInterval: ReturnType<typeof setInterval> | null = null;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentServer: Server | null = null;

  constructor() {
    // No super() call needed anymore
  }
  
  public on(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public off(event: string, listener: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
  }

  private emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(...args));
    }
  }

  private setState(newState: ConnectionStatus) {
    if (this.state !== newState) {
      this.state = newState;
      logger.info(`Connection state changed to: ${newState}`);
      this.emit('stateChange', newState);
    }
  }

  private startStatsUpdate(): void {
    if (this.statsInterval) clearInterval(this.statsInterval);
    
    this.statsInterval = setInterval(() => {
      this.stats.connectionTime += 1;
      
      const randomDownload = Math.random() * 250 * 1024; // 0 to 250 KB/s
      const randomUpload = Math.random() * 50 * 1024; // 0 to 50 KB/s
      
      this.stats.dataDownloaded += randomDownload / 1024 / 1024; // convert to MB
      this.stats.dataUploaded += randomUpload / 1024 / 1024; // convert to MB
      
      this.stats.downloadSpeed = randomDownload;
      this.stats.uploadSpeed = randomUpload;

      this.emit('statsUpdate', this.stats);
    }, 1000);
  }

  private stopStatsUpdate(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
    this.resetStats();
    this.emit('statsUpdate', this.stats);
  }
  
  private resetStats(): void {
    this.stats = {
      connectionTime: 0,
      dataDownloaded: 0,
      dataUploaded: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
    };
  }

  public connect(server: Server): void {
    if (this.state !== ConnectionStatus.DISCONNECTED) {
      logger.warn(`Connect called in invalid state: ${this.state}`);
      return;
    }
    this.currentServer = server;
    logger.info(`Connecting to ${this.currentServer.city}...`);
    this.setState(ConnectionStatus.CONNECTING);

    // Clear any previous timeout
    if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
    
    // Simulate network delay for connection
    this.connectionTimeout = setTimeout(() => {
      // Simulate connection failure (e.g., 30% chance)
      if (Math.random() < 0.3) {
        const errorMessage = `Connection to ${this.currentServer?.city} failed. The server might be busy or unreachable.`;
        logger.error(errorMessage);
        this.emit('error', errorMessage);
        this.setState(ConnectionStatus.DISCONNECTED);
      } else {
        this.setState(ConnectionStatus.CONNECTED);
        this.startStatsUpdate();
      }
    }, 2000);
  }

  public disconnect(): void {
    if (this.state === ConnectionStatus.DISCONNECTED) return;
    
    logger.info('Disconnecting from server...');
    if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
    
    this.setState(ConnectionStatus.DISCONNECTED);
    this.stopStatsUpdate();
    this.currentServer = null;
  }
}