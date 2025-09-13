import type { VpnClient } from '../types/vpn';
import { logger } from '../utils/logger';
import { IPManager } from './IPManager';

export class ClientManager {
  private clients: Map<string, VpnClient>; // Key is "ip:port"

  constructor() {
    this.clients = new Map();
  }

  public getClient(remoteAddress: string, remotePort: number): VpnClient | undefined {
    return this.clients.get(`${remoteAddress}:${remotePort}`);
  }

  public addClient(remoteAddress: string, remotePort: number, virtualIp: string): VpnClient {
    const clientId = `${remoteAddress}:${remotePort}`;
    const newClient: VpnClient = {
      id: clientId,
      remoteAddress,
      remotePort,
      virtualIp,
      lastSeen: Date.now(),
      dataSent: 0,
      dataReceived: 0,
    };
    this.clients.set(clientId, newClient);
    logger.info(`New client connected: ${clientId} assigned IP ${virtualIp}`);
    return newClient;
  }

  public removeClient(remoteAddress: string, remotePort: number, ipManager: IPManager): boolean {
    const client = this.getClient(remoteAddress, remotePort);
    if (client) {
      ipManager.releaseIp(client.virtualIp);
      this.clients.delete(client.id);
      logger.info(`Client disconnected: ${client.id} (released IP ${client.virtualIp})`);
      return true;
    }
    return false;
  }

  public updateClientActivity(client: VpnClient, dataReceived: number, dataSent: number) {
    client.lastSeen = Date.now();
    client.dataReceived += dataReceived;
    client.dataSent += dataSent;
  }

  public findClientByVirtualIp(virtualIp: string): VpnClient | undefined {
    for (const client of this.clients.values()) {
        if (client.virtualIp === virtualIp) {
            return client;
        }
    }
    return undefined;
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public cleanupInactiveClients(timeoutMs: number, ipManager: IPManager) {
    const now = Date.now();
    let cleanedCount = 0;
    for (const client of this.clients.values()) {
      if (now - client.lastSeen > timeoutMs) {
        this.removeClient(client.remoteAddress, client.remotePort, ipManager);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} inactive clients.`);
    }
  }
}
