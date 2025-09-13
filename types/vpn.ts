// Fix: Add import for Buffer to resolve issue with Buffer not being defined in some environments.
import { Buffer } from 'buffer';

export interface VpnClient {
  id: string; // remoteAddress:remotePort
  remoteAddress: string;
  remotePort: number;
  virtualIp: string;
  lastSeen: number; // timestamp
  dataSent: number; // in bytes
  dataReceived: number; // in bytes
}

export enum PacketType {
  HANDSHAKE_REQUEST = 0x01,
  HANDSHAKE_RESPONSE = 0x02,
  DATA = 0x03,
  HEARTBEAT = 0x04,
  DISCONNECT = 0x05,
}

// A simple structure for packets
// [TYPE (1 byte)][PAYLOAD]
// For HANDSHAKE_RESPONSE, payload could be the assigned virtual IP
// For DATA, payload is the actual IP packet
export interface DecryptedPacket {
    type: PacketType;
    payload: Buffer;
}