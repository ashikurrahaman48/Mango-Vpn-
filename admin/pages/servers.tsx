// admin/pages/servers.tsx
import React, { useState, useEffect } from 'react';
import type { AdminServer, ServerStatus } from '../types';

const ServerStatusPill: React.FC<{ status: ServerStatus }> = ({ status }) => {
  const statusStyles = {
    online: 'bg-green-900 text-green-300',
    offline: 'bg-red-900 text-red-300',
    maintenance: 'bg-yellow-900 text-yellow-300',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const ServerHealthPage: React.FC = () => {
  const [servers, setServers] = useState<AdminServer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    // Keep loading state true only on first load
    // setLoading(true); 
    try {
      const res = await fetch('/api/servers');
      const data: AdminServer[] = await res.json();
      setServers(data);
    } catch (error) {
      console.error("Failed to fetch servers:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 5000); // Refresh server status every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-200 mb-6">Server Health</h1>
      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
            <div className="text-center p-8">Loading server data...</div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {servers.map(server => {
              const loadPercentage = (server.currentClients / server.maxClients) * 100;
              return (
                <li key={server.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-lg font-semibold text-white">{server.name} <span className="text-sm font-normal text-gray-400">- {server.location}</span></p>
                    <p className="text-sm text-gray-500">{server.ip}</p>
                  </div>
                  <div className="flex items-center space-x-6 w-full sm:w-auto">
                    <div className="flex-grow">
                      <p className="text-sm text-gray-400 mb-1">Load ({server.currentClients}/{server.maxClients})</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${loadPercentage}%` }}></div>
                      </div>
                    </div>
                    <ServerStatusPill status={server.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ServerHealthPage;
