import dgram from 'dgram';
// Fix: Add import for Buffer to resolve issue with Buffer not being defined in some environments.
import { Buffer } from 'buffer';
import { SERVER_CONFIG } from './config/serverConfig';
import { ClientManager } from './managers/ClientManager';
import { IPManager } from './managers/IPManager';
import { logger } from './utils/logger';
import { encrypt, decrypt } from './utils/encryption';
import { PacketType, type DecryptedPacket } from './types/vpn';
import type { RemoteInfo } from 'dgram';

class VpnServer {
  private server: dgram.Socket;
  private clientManager: ClientManager;
  private ipManager: IPManager;

  constructor() {
    this.server = dgram.createSocket('udp4');
    this.clientManager = new ClientManager();
    this.ipManager = new IPManager(
      SERVER_CONFIG.VPN_IP_POOL_START,
      SERVER_CONFIG.VPN_IP_POOL_END
    );

    this.setupServerEvents();
    this.startCleanupInterval();
  }

  private setupServerEvents(): void {
    this.server.on('error', (err) => {
      logger.error('Server error:', err);
      this.server.close();
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      logger.info(`VPN Server listening on ${address.address}:${address.port}`);
    });

    this.server.on('message', this.handleMessage.bind(this));
  }
  
  private parsePacket(buffer: Buffer): DecryptedPacket | null {
      if (buffer.length < 1) return null;
      const type = buffer.readUInt8(0) as PacketType;
      const payload = buffer.subarray(1);
      return { type, payload };
  }

  private handleMessage(msg: Buffer, rinfo: RemoteInfo): void {
    const encryptedPacket = msg;
    const decryptedBuffer = decrypt(encryptedPacket);

    if (!decryptedBuffer) {
      logger.warn(`Failed to decrypt packet from ${rinfo.address}:${rinfo.port}. Dropping.`);
      return;
    }

    const packet = this.parsePacket(decryptedBuffer);
    if (!packet) {
        logger.warn(`Malformed packet from ${rinfo.address}:${rinfo.port}. Dropping.`);
        return;
    }

    const client = this.clientManager.getClient(rinfo.address, rinfo.port);

    if (packet.type === PacketType.HANDSHAKE_REQUEST) {
      if (!client) {
        const virtualIp = this.ipManager.assignIp(`${rinfo.address}:${rinfo.port}`);
        if (virtualIp) {
          this.clientManager.addClient(rinfo.address, rinfo.port, virtualIp);
          const responsePayload = Buffer.from(virtualIp);
          const responsePacket = Buffer.concat([Buffer.from([PacketType.HANDSHAKE_RESPONSE]), responsePayload]);
          this.send(responsePacket, rinfo);
        } else {
          logger.warn(`Could not assign IP for ${rinfo.address}:${rinfo.port}, IP pool full.`);
        }
      }
      return;
    }
    
    // For all other packet types, a client must be registered
    if (!client) {
        logger.warn(`Received non-handshake packet from unknown client ${rinfo.address}:${rinfo.port}. Dropping.`);
        return;
    }

    this.clientManager.updateClientActivity(client, encryptedPacket.length, 0);

    switch(packet.type) {
      case PacketType.DATA:
        // This is a simplified routing logic.
        // A real VPN would inspect the IP header of the payload to determine the destination.
        // For this example, we'll just log it. A full implementation would involve
        // creating a TUN/TAP interface and forwarding packets to the kernel.
        logger.info(`Received DATA packet (${packet.payload.length} bytes) from ${client.virtualIp}`);
        // Here you would forward `packet.payload` to the internet or another VPN client.
        break;

      case PacketType.HEARTBEAT:
        // Activity is already updated, nothing more to do.
        logger.info(`Received HEARTBEAT from ${client.virtualIp}`);
        break;
        
      case PacketType.DISCONNECT:
        logger.info(`Received DISCONNECT from ${client.virtualIp}`);
        this.clientManager.removeClient(rinfo.address, rinfo.port, this.ipManager);
        break;
    }
  }

  private send(payload: Buffer, rinfo: RemoteInfo): void {
    const encryptedPayload = encrypt(payload);
    this.server.send(encryptedPayload, rinfo.port, rinfo.address, (err) => {
      if (err) {
        logger.error(`Error sending packet to ${rinfo.address}:${rinfo.port}:`, err);
      } else {
        const client = this.clientManager.getClient(rinfo.address, rinfo.port);
        if (client) {
            this.clientManager.updateClientActivity(client, 0, encryptedPayload.length);
        }
      }
    });
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.clientManager.cleanupInactiveClients(SERVER_CONFIG.CLIENT_TIMEOUT_MS, this.ipManager);
    }, 30000); // Check every 30 seconds
  }
  
  public start(): void {
    this.server.bind(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST);
  }
}

const vpnServer = new VpnServer();
vpnServer.start();