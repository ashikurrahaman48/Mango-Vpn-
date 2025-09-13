
import React from 'react';
import type { Server } from '../../types/client';
import { ConnectionStatus } from '../../types/client';

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
      case ConnectionStatus.RECONNECTING:
        return 'Reconnecting...';
    }
  };
  
  const getStatusColor = () => {
    switch(status) {
      case ConnectionStatus.CONNECTED:
        return 'text-[var(--color-success)]';
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return 'text-[var(--color-warning)]';
      case ConnectionStatus.DISCONNECTED:
        return 'text-[var(--color-error)]';
    }
  };

  const isButtonDisabled = !server && status === ConnectionStatus.DISCONNECTED;

  const getButtonClass = () => {
    if (isButtonDisabled) {
        return 'bg-[var(--color-bg-tertiary)]/50 text-[var(--color-text-muted)] border-[var(--color-bg-tertiary)] cursor-not-allowed';
    }

    switch(status) {
      case ConnectionStatus.CONNECTED:
        return 'bg-[color:var(--color-success)/0.2] text-[var(--color-success)] hover:bg-[color:var(--color-success)/0.4] border-[color:var(--color-success)/0.5]';
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return 'bg-[color:var(--color-warning)/0.2] text-[var(--color-warning)] border-[color:var(--color-warning)/0.5] animate-pulse';
       case ConnectionStatus.DISCONNECTED:
        return 'bg-[color:var(--color-primary)/0.2] text-[var(--color-accent)] hover:bg-[color:var(--color-primary)/0.4] border-[color:var(--color-primary)/0.5]';
    }
  }

  return (
    <div className="bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center text-center flex-grow">
      <div className="mb-8 min-h-[72px] flex flex-col justify-center"> {/* Added min-height to prevent layout shift */}
        <h2 className="text-xl font-medium text-[var(--color-text-muted)]">Connection Status</h2>
        <p className={`text-4xl font-bold ${getStatusColor()}`}>{getStatusText()}</p>
        {status === ConnectionStatus.CONNECTED && server ? (
          <p className="text-[var(--color-text-secondary)] mt-2 text-lg">
            Securely connected to <span className="font-semibold text-[var(--color-accent)]">{server.city}, {server.country}</span>
          </p>
        ) : status === ConnectionStatus.CONNECTING && server ? (
             <p className="text-[var(--color-text-secondary)] mt-2 text-lg">
                to <span className="font-semibold text-[var(--color-accent)]">{server.city}, {server.country}</span>
             </p>
        ) : (
          <p className="text-[var(--color-text-secondary)] mt-2 text-lg">
            {server ? `Ready to connect to ${server.city}` : 'Please select a server'}
          </p>
        )}
      </div>

      <button
        onClick={onConnectToggle}
        disabled={isButtonDisabled}
        className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 ${getButtonClass()}`}
      >
        <PowerIcon className="w-24 h-24" />
      </button>

      <p className="mt-8 text-[var(--color-text-muted)] text-lg">
        {isButtonDisabled ? 'Select a server first' : status === ConnectionStatus.DISCONNECTED ? 'Click to connect' : 'Click to disconnect'}
      </p>
    </div>
  );
};

export default ConnectionDisplay;
