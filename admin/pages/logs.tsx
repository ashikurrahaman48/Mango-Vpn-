// admin/pages/logs.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { AdminLog, LogLevel } from '../types';

const LogLevelBadge: React.FC<{ level: LogLevel }> = ({ level }) => {
  const levelStyles = {
    info: 'bg-blue-900 text-blue-300',
    warn: 'bg-yellow-900 text-yellow-300',
    error: 'bg-red-900 text-red-300',
    debug: 'bg-gray-700 text-gray-300',
  };
  return (
    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${levelStyles[level]}`}>
      {level}
    </span>
  );
};

const LogViewerPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (levelFilter !== 'all') {
      params.append('level', levelFilter);
    }
    if (searchQuery) {
      params.append('q', searchQuery);
    }

    try {
      const res = await fetch(`/api/logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }, [levelFilter, searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchLogs();
    }, 300); // Debounce search input

    return () => {
        clearTimeout(handler);
    };
  }, [fetchLogs]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-200 mb-6">Log Viewer</h1>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">Search logs</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log messages..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 p-2 rounded-md border-transparent focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="level" className="sr-only">Filter by level</label>
          <select
            id="level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
            className="w-full sm:w-auto bg-gray-700 text-white p-2 rounded-md border-transparent focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
         <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">No logs found.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><LogLevelBadge level={log.level} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{log.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-200 break-words">{log.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogViewerPage;
