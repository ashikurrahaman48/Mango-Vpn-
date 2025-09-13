
export interface Server {
  id: number;
  country: string;
  city: string;
  flag: string;
  ip: string;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
}

export interface Stats {
  connectionTime: number;
  dataDownloaded: number;
  dataUploaded: number;
  downloadSpeed: number; // in bytes per second
  uploadSpeed: number; // in bytes per second
}
