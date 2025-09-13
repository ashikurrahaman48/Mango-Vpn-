
import React, { useState } from 'react';
import type { Server } from '../../types/client';

interface SmartServerFinderProps {
  servers: Server[];
  onServerRecommended: (serverId: number) => void;
  disabled: boolean;
}

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 10-1.06-1.06 7.5 7.5 0 00-1.964 5.304a.75.75 0 00.75.75h3a.75.75 0 00.75-.75 7.5 7.5 0 00-1.964-5.304z" />
    </svg>
);


const SmartServerFinder: React.FC<SmartServerFinderProps> = ({ servers, onServerRecommended, disabled }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindServer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query || disabled) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/recommend-server', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, servers }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to get recommendation.');
            }

            const { serverId } = await res.json();
            if (serverId) {
                onServerRecommended(serverId);
            } else {
                throw new Error("AI couldn't find a matching server.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4 border-b border-[var(--color-bg-tertiary)] pb-4">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-accent)] flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                <span>Smart Search</span>
            </h2>
            <form onSubmit={handleFindServer}>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'Fast server for gaming in USA'"
                        disabled={disabled || isLoading}
                        className="w-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] p-2 pr-20 rounded-md border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                    />
                    <button
                        type="submit"
                        disabled={disabled || isLoading}
                        className="absolute right-1 top-1 bottom-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] font-semibold px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Finding...' : 'Find'}
                    </button>
                </div>
                {error && <p className="text-sm text-[var(--color-error)] mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default SmartServerFinder;
