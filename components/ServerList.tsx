
import React from 'react';
import type { Server } from '../types';

interface ServerListProps {
  servers: Server[];
  selectedServer: Server | null;
  onSelect: (server: Server) => void;
  disabled: boolean;
  isLoading: boolean;
  error: string | null;
}

const ServerSkeleton: React.FC = () => (
    <li className="w-full flex items-center p-3 rounded-lg bg-gray-700/50 animate-pulse">
        <div className="w-8 h-6 bg-gray-600 rounded mr-4"></div>
        <div className="flex-grow">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
    </li>
);


const ServerList: React.FC<ServerListProps> = ({ servers, selectedServer, onSelect, disabled, isLoading, error }) => {
  
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
          <div className="flex-grow flex items-center justify-center text-center text-red-400 bg-red-500/10 rounded-lg p-4">
              <p>{error}</p>
          </div>
      );
  }

  if (servers.length === 0) {
      return (
           <div className="flex-grow flex items-center justify-center text-center text-gray-400">
              <p>No servers available.</p>
          </div>
      )
  }

  return (
    <div className="overflow-y-auto flex-grow -mr-3 pr-3">
      <ul className="space-y-2">
        {servers.map((server) => {
          const isSelected = server.id === selectedServer?.id;
          return (
            <li key={server.id}>
              <button
                onClick={() => onSelect(server)}
                disabled={disabled}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
                  ${isSelected ? 'bg-cyan-500/80 shadow-md ring-2 ring-cyan-400' : 'bg-gray-700/50 hover:bg-gray-700'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="text-2xl mr-4">{server.flag}</span>
                <div className="text-left">
                  <p className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-200'}`}>{server.country}</p>
                  <p className={`text-sm ${isSelected ? 'text-gray-100' : 'text-gray-400'}`}>{server.city}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ServerList;
