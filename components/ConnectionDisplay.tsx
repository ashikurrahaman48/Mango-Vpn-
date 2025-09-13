
import React from 'react';
import type { Server } from '../types';
import { ConnectionStatus } from '../types';

interface ConnectionDisplayProps {
  status: ConnectionStatus;
  server: Server | null;
  onConnectToggle: () => void;
}

const PowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
    <line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);

const ConnectionDisplay: React.FC<ConnectionDisplayProps> = ({ status, server, onConnectToggle }) => {

  const getStatusText = () => {
    switch(status) {
      case ConnectionStatus.CONNECTED:
        return 'Connected';
      case ConnectionStatus.CONNECTING:
        return 'Connecting...';
      case ConnectionStatus.DISCONNECTED:
        return 'Disconnected';
    }
  };
  
  const getStatusColor = () => {
    switch(status) {
      case ConnectionStatus.CONNECTED:
        return 'text-green-400';
      case ConnectionStatus.CONNECTING:
        return 'text-yellow-400';
      case ConnectionStatus.DISCONNECTED:
        return 'text-red-400';
    }
  };

  const isButtonDisabled = !server && status === ConnectionStatus.DISCONNECTED;

  const getButtonClass = () => {
    if (isButtonDisabled) {
        return 'bg-gray-700/50 text-gray-500 border-gray-600 cursor-not-allowed';
    }

    switch(status) {
      case ConnectionStatus.CONNECTED:
        return 'bg-green-500/20 text-green-400 hover:bg-green-500/40 border-green-500/50';
      case ConnectionStatus.CONNECTING:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse';
       case ConnectionStatus.DISCONNECTED:
        return 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 border-cyan-500/50';
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
      <div className="mb-6 min-h-[72px] flex flex-col justify-center"> {/* Added min-height to prevent layout shift */}
        <h2 className="text-lg font-medium text-gray-400">Connection Status</h2>
        <p className={`text-3xl font-bold ${getStatusColor()}`}>{getStatusText()}</p>
        {status === ConnectionStatus.CONNECTED && server ? (
          <p className="text-gray-300 mt-2">
            Securely connected to <span className="font-semibold text-cyan-400">{server.city}, {server.country}</span>
          </p>
        ) : status === ConnectionStatus.CONNECTING && server ? (
             <p className="text-gray-300 mt-2">
                to <span className="font-semibold text-cyan-400">{server.city}, {server.country}</span>
             </p>
        ) : (
          <p className="text-gray-300 mt-2">
            {server ? `Ready to connect to ${server.city}` : 'Please select a server'}
          </p>
        )}
      </div>

      <button
        onClick={onConnectToggle}
        disabled={isButtonDisabled}
        className={`relative w-40 h-40 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${getButtonClass()}`}
      >
        <PowerIcon className="w-20 h-20" />
      </button>

      <p className="mt-6 text-gray-400">
        {isButtonDisabled ? 'Select a server first' : status === ConnectionStatus.DISCONNECTED ? 'Click to connect' : 'Click to disconnect'}
      </p>
    </div>
  );
};

export default ConnectionDisplay;
