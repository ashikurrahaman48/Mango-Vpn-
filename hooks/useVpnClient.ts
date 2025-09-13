
import { useState, useEffect, useRef, useCallback } from 'react';
import { VpnClient } from '../client';
import { ConnectionStatus, type Stats, type Server } from '../types/client';

export const useVpnClient = () => {
  // Use a ref to hold the client instance so it persists across re-renders
  const clientRef = useRef<VpnClient | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [stats, setStats] = useState<Stats>({
    connectionTime: 0,
    dataDownloaded: 0,
    dataUploaded: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
  });

  useEffect(() => {
    // Initialize the client only once
    if (!clientRef.current) {
      clientRef.current = new VpnClient();
    }
    const client = clientRef.current;

    const handleStateChange = (newState: ConnectionStatus) => {
      setConnectionStatus(newState);
    };
    
    const handleStatsUpdate = (newStats: Stats) => {
      setStats({ ...newStats });
    };

    client.on('stateChange', handleStateChange);
    client.on('statsUpdate', handleStatsUpdate);

    // Cleanup function to remove listeners and disconnect when the component unmounts
    return () => {
      client.off('stateChange', handleStateChange);
      client.off('statsUpdate', handleStatsUpdate);
      client.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const connect = useCallback((server: Server) => {
    clientRef.current?.connect(server);
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  return { connectionStatus, stats, connect, disconnect };
};
