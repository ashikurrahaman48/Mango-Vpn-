import { logger } from '../utils/logger';

// A simple utility to convert IP string to a number
const ipToNumber = (ip: string) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
};

const numberToIp = (num: number) => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
     num & 255,
  ].join('.');
};

export class IPManager {
  private availableIps: Set<string>;
  private assignedIps: Map<string, string>; // Map virtual IP to client ID

  constructor(startIp: string, endIp: string) {
    this.availableIps = new Set();
    this.assignedIps = new Map();
    this.generateIpPool(startIp, endIp);
    logger.info(`IP pool initialized with ${this.availableIps.size} available addresses.`);
  }

  private generateIpPool(startIp: string, endIp: string) {
    let start = ipToNumber(startIp);
    const end = ipToNumber(endIp);
    while (start <= end) {
      this.availableIps.add(numberToIp(start));
      start++;
    }
  }

  public assignIp(clientId: string): string | null {
    if (this.availableIps.size === 0) {
      logger.warn('IP pool is empty. Cannot assign new IP.');
      return null;
    }
    
    const ip = this.availableIps.values().next().value;
    this.availableIps.delete(ip);
    this.assignedIps.set(ip, clientId);
    
    return ip;
  }

  public releaseIp(ip: string): boolean {
    if (this.assignedIps.has(ip)) {
      this.assignedIps.delete(ip);
      this.availableIps.add(ip);
      return true;
    }
    logger.warn(`Attempted to release an unassigned or invalid IP: ${ip}`);
    return false;
  }

  public isIpAssigned(ip: string): boolean {
    return this.assignedIps.has(ip);
  }
}
