import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus, type Server } from '../../types/client';
import { SERVERS } from '../../constants';
import Header from './Header';
import ServerList from './ServerList';
import ConnectionDisplay from './ConnectionDisplay';
import StatsDashboard from './StatsDashboard';
import SettingsModal from './SettingsModal';
import { useVpnClient } from '../../hooks/useVpnClient';
import TitleBar from './TitleBar';
import Footer from './Footer';
import MenuBar from './MenuBar';
import SmartServerFinder from './SmartServerFinder';
import TroubleshootingChatbot from './TroubleshootingChatbot';


const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.11 2.11a.75.75 0 01-1.06 0l-2.11-2.11a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
    </svg>
);


const VpnClientApp: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recommendedServerId, setRecommendedServerId] = useState<number | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const { connectionStatus, stats, connect, disconnect } = useVpnClient();

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;
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
      setRecommendedServerId(null); // Clear recommendation on manual selection
    }
  };

  const handleServerRecommended = (serverId: number) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
        setSelectedServer(server);
        setRecommendedServerId(serverId);
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans flex items-center justify-center p-2">
      <div className="w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl rounded-lg border border-[var(--color-bg-tertiary)]/50 bg-[var(--color-bg-secondary)]/20 overflow-hidden relative">
        <TitleBar />
        <MenuBar />
        <div className="relative flex-grow flex flex-col bg-[var(--color-bg-primary)]/50 backdrop-blur-sm overflow-hidden">
            <Header onOpenSettings={() => setIsSettingsOpen(true)} />
            <main className="relative z-10 flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
                {/* Left Column: Server List */}
                <div className="w-full lg:w-1/3 lg:max-w-sm bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col">
                    <SmartServerFinder servers={servers} onServerRecommended={handleServerRecommended} disabled={isConnected || isConnecting} />
                    <ServerList 
                        servers={servers} 
                        selectedServer={selectedServer}
                        onSelect={handleServerSelect}
                        disabled={isConnected || isConnecting}
                        isLoading={isLoading}
                        error={error}
                        recommendedServerId={recommendedServerId}
                    />
                </div>
                {/* Right Column: Main Content */}
                <div className="flex-grow flex flex-col gap-8">
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
        </div>
        <Footer />
        <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
        />
        <button 
          onClick={() => setIsChatbotOpen(true)}
          className="absolute bottom-10 right-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] rounded-full p-4 shadow-lg z-20 transition-transform hover:scale-110"
          aria-label="Open Troubleshooting Assistant"
        >
          <ChatIcon />
        </button>
        <TroubleshootingChatbot 
            isOpen={isChatbotOpen}
            onClose={() => setIsChatbotOpen(false)}
        />
      </div>
    </div>
  );
};

export default VpnClientApp;