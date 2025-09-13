// Fix: Add import for Buffer to resolve issue with Buffer not being defined in some environments.
import { Buffer } from 'buffer';
import { logger } from '../utils/logger';

/**
 * NOTE: This is a SIMULATION of a Tunnel Manager.
 * In a real-world VPN client application, this class would be responsible for
 * creating and managing a virtual network interface (like TUN/TAP). It would:
 * 1. Read IP packets coming from the OS destined for the VPN.
 * 2. Write decrypted IP packets received from the VPN server to the interface,
 *    so the OS can process them.
 * 
 * This requires low-level system permissions and libraries that are not available
 * in a standard Node.js or browser environment. For this example, we will simply
 * log the actions to demonstrate the data flow.
 */
export class TunnelManager {
  private onDataFromTunnel: ((data: Buffer) => void) | null = null;
  
  constructor() {
    logger.info('TunnelManager initialized (simulation mode).');
  }

  /**
   * Simulates writing data (received from the VPN server) to the local tunnel.
   * The OS would normally route this packet to the correct application.
   * @param packet The decrypted IP packet.
   */
  public writeToTunnel(packet: Buffer): void {
    logger.info(`[TUNNEL] Wrote ${packet.length} bytes to virtual interface. (SIMULATED)`);
    // In a real implementation, you'd write `packet` to the TUN device file descriptor.
  }

  /**
   * Sets a callback to be invoked when "local traffic" is generated for the tunnel.
   * @param callback The function to call with the packet data.
   */
  public on(event: 'data', callback: (data: Buffer) => void): void {
      if (event === 'data') {
          this.onDataFromTunnel = callback;
          logger.info('[TUNNEL] Data handler attached. (SIMULATED)');
      }
  }

  /**
   * Simulates a local application sending data through the VPN.
   * @param data The IP packet to be sent.
   */
  public generateTestTraffic(): void {
    if (this.onDataFromTunnel) {
      const testPacket = Buffer.from('This is a test packet from a local app');
      logger.info(`[TUNNEL] Reading ${testPacket.length} bytes of test traffic from local app. (SIMULATED)`);
      this.onDataFromTunnel(testPacket);
    } else {
        logger.warn('[TUNNEL] Cannot generate test traffic, no handler attached.');
    }
  }
}