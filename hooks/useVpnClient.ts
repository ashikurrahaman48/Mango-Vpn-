
import { useState, useEffect, useRef, useCallback } from 'react';
import { VpnClient } from '../client';
import { ConnectionStatus, type Stats, type Server } from '../types/client';

export const useVpnClient = () => {
  const clientRef = useRef<VpnClient | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [stats, setStats] = useState<Stats>({
    connectionTime: 0,
    dataDownloaded: 0,
    dataUploaded: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    client.on('stateChange', handleStateChange);
    client.on('statsUpdate', handleStatsUpdate);
    client.on('error', handleError);

    return () => {
      client.off('stateChange', handleStateChange);
      client.off('statsUpdate', handleStatsUpdate);
      client.off('error', handleError);
      client.disconnect();
    };
  }, []);

  const connect = useCallback((server: Server) => {
    setError(null); // Clear previous errors on new connection attempt
    clientRef.current?.connect(server);
  }, []);

  const disconnect = useCallback(() => {
    setError(null);
    clientRef.current?.disconnect();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { connectionStatus, stats, connect, disconnect, error, clearError };
};