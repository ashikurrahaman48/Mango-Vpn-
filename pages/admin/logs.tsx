// pages/admin/logs.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { AdminLog, LogLevel } from '../../types/admin';

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

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 10-1.06-1.06 7.5 7.5 0 00-1.964 5.304a.75.75 0 00.75.75h3a.75.75 0 00.75-.75 7.5 7.5 0 00-1.964-5.304z" />
    </svg>
);


const LogViewerPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (aiFilter: object | null = null) => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (aiFilter) {
      params.append('aiFilter', JSON.stringify(aiFilter));
    } else {
        if (levelFilter !== 'all') {
        params.append('level', levelFilter);
        }
        if (searchQuery) {
        params.append('q', searchQuery);
        }
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

  const handleAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiError(null);
    try {
        const res = await fetch('/api/ai/query-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: aiQuery }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'AI query failed');
        }
        const data = await res.json();
        setLogs(data); // Directly set logs from AI response
    } catch (err) {
        setAiError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsAiLoading(false);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Log Viewer</h1>
      
      {/* AI Search */}
       <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 mb-6">
            <form onSubmit={handleAiQuery}>
                 <label htmlFor="ai-search" className="flex items-center gap-2 text-lg font-semibold mb-2 text-[var(--color-accent)]">
                    <SparklesIcon className="w-5 h-5"/>
                    Ask a question about the logs
                 </label>
                 <div className="relative">
                    <input
                        id="ai-search"
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="e.g., 'Show me all errors from the vpn server yesterday'"
                        disabled={isAiLoading}
                        className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] p-2 pr-24 rounded-md border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                    <button type="submit" disabled={isAiLoading} className="absolute right-1 top-1 bottom-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] font-semibold px-4 rounded text-sm disabled:opacity-50">
                        {isAiLoading ? 'Asking...' : 'Ask AI'}
                    </button>
                 </div>
                 {aiError && <p className="text-sm text-[var(--color-error)] mt-2">{aiError}</p>}
            </form>
       </div>

      {/* Manual Filters */}
      <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">Search logs</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log messages (manual)..."
            className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] p-2 rounded-md border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="level" className="sr-only">Filter by level</label>
          <select
            id="level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
            className="w-full sm:w-auto bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] p-2 rounded-md border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow overflow-x-auto">
         <table className="min-w-full">
          <thead className="bg-[var(--color-bg-tertiary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-bg-tertiary)]">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">No logs found.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)] font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><LogLevelBadge level={log.level} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-muted)] font-mono">{log.source}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)] break-words">{log.message}</td>
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
