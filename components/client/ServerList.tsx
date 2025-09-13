import React from 'react';
import type { Server } from '../../types/client';

interface ServerListProps {
  servers: Server[];
  selectedServer: Server | null;
  onSelect: (server: Server) => void;
  disabled: boolean;
  isLoading: boolean;
  error: string | null;
  recommendedServerId?: number | null;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);


const ServerSkeleton: React.FC = () => (
    <li className="w-full flex items-center p-3 rounded-lg bg-[var(--color-bg-tertiary)]/50 animate-pulse">
        <div className="w-8 h-6 bg-[var(--color-bg-tertiary)] rounded mr-4"></div>
        <div className="flex-grow">
            <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-[var(--color-bg-tertiary)] rounded w-1/2"></div>
        </div>
    </li>
);


const ServerList: React.FC<ServerListProps> = ({ servers, selectedServer, onSelect, disabled, isLoading, error, recommendedServerId }) => {
  
  if (isLoading) {
    return (
        <div className="overflow-y-auto flex-grow -mr-3 pr-3">
            <ul className="space-y-2">
                {Array.from({ length: 8 }).map((_, index) => <ServerSkeleton key={index} />)}
            </ul>
        </div>
    );
  }

  if (error) {
      return (
          <div className="flex-grow flex items-center justify-center text-center text-[var(--color-error)] bg-red-500/10 rounded-lg p-4">
              <p>{error}</p>
          </div>
      );
  }

  if (servers.length === 0) {
      return (
           <div className="flex-grow flex items-center justify-center text-center text-[var(--color-text-muted)]">
              <p>No servers available.</p>
          </div>
      )
  }

  return (
    <div className="overflow-y-auto flex-grow -mr-3 pr-3">
      <ul className="space-y-2">
        {servers.map((server) => {
          const isSelected = server.id === selectedServer?.id;
          const isRecommended = server.id === recommendedServerId;
          return (
            <li key={server.id}>
              <button
                onClick={() => onSelect(server)}
                disabled={disabled}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out text-left
                  ${isSelected ? 'bg-[var(--color-primary)] text-[var(--color-primary-content)] shadow-md ring-2 ring-[var(--color-accent)]' : `bg-[var(--color-bg-tertiary)]/50 hover:bg-[var(--color-bg-tertiary)] ${isRecommended ? 'ring-2 ring-[var(--color-accent)]/70' : ''}`}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="text-2xl mr-4">{server.flag}</span>
                <div className="flex-grow">
                  <p className={`font-semibold ${isSelected ? 'text-[var(--color-primary-content)]' : 'text-[var(--color-text-primary)]'}`}>{server.country}</p>
                  <p className={`text-sm ${isSelected ? 'text-[var(--color-primary-content)]/80' : 'text-[var(--color-text-muted)]'}`}>{server.city}</p>
                </div>
                 {isRecommended && !isSelected && <StarIcon className="w-5 h-5 text-[var(--color-accent)]" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ServerList;
