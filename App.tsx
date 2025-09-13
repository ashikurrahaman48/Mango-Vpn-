
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Import ConnectionStatus as a value to correctly compare connection states.
import { ConnectionStatus, type Server } from './types';
import { SERVERS } from './constants';
import Header from './components/Header';
import ServerList from './components/ServerList';
import ConnectionDisplay from './components/ConnectionDisplay';
import StatsDashboard from './components/StatsDashboard';
import SettingsModal from './components/SettingsModal';
import { useVpnClient } from './hooks/useVpnClient';

const App: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { connectionStatus, stats, connect, disconnect } = useVpnClient();

  // Fix: Compare connectionStatus with ConnectionStatus enum members instead of string literals.
  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;
  // Fix: Compare connectionStatus with ConnectionStatus enum members instead of string literals.
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;
  
  // Effect to fetch server list on mount
  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() > 0.9) {
          throw new Error('Could not reach server list. Please try again later.');
        }
        setServers(SERVERS);
        setSelectedServer(SERVERS[0]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching servers.');
        }
        setServers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServers();
  }, []);

  const handleConnectToggle = useCallback(() => {
    if (!selectedServer) return;

    if (isConnected || isConnecting) {
      disconnect();
    } else {
      connect(selectedServer);
    }
  }, [isConnected, isConnecting, selectedServer, connect, disconnect]);

  const handleServerSelect = (server: Server) => {
    if (!isConnected && !isConnecting) {
      setSelectedServer(server);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col max-h-[85vh]">
           <h2 className="text-xl font-bold mb-4 text-cyan-400">Select Server</h2>
          <ServerList 
            servers={servers} 
            selectedServer={selectedServer}
            onSelect={handleServerSelect}
            disabled={isConnected || isConnecting}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ConnectionDisplay 
            status={connectionStatus}
            server={selectedServer}
            onConnectToggle={handleConnectToggle}
          />
          <StatsDashboard
             status={connectionStatus}
             stats={stats}
          />
        </div>
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;