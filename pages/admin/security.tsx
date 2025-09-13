import React, { useState } from 'react';

const SecurityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.832 2.523L12 2.1l-.832.423-8.583 4.363v7.324c0 4.364 3.844 8.583 8.415 9.577a.75.75 0 00.999 0c4.572-.994 8.415-5.213 8.415-9.577V6.886L12.832 2.523zM12 3.9l7.5 3.82v5.99c0 3.5-3.086 7.1-7.5 7.9-4.414-.8-7.5-4.4-7.5-7.9V7.72L12 3.9z" clipRule="evenodd" />
    </svg>
);

const SecurityPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            const res = await fetch('/api/ai/analyze-security');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to generate security report.');
            }
            const data = await res.json();
            setReport(data.report);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">AI Security Analysis</h1>
            
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="bg-[color:var(--color-primary)/0.1] text-[var(--color-primary)] p-4 rounded-full">
                        <SecurityIcon className="h-10 w-10" />
                    </div>
                    <div className="flex-grow">
                        <h2 className="text-2xl font-semibold">Analyze Activity Logs</h2>
                        <p className="text-[var(--color-text-muted)] mt-1">
                            Use Gemini AI to scan recent system logs for suspicious patterns, potential threats, and anomalies. The analysis will cover failed logins, frequent disconnects, and other critical events.
                        </p>
                    </div>
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading}
                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)] text-[var(--color-primary-content)] font-bold py-2 px-6 rounded-lg transition-colors w-full md:w-auto disabled:opacity-50"
                    >
                        {isLoading ? 'Analyzing...' : 'Run Analysis'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                    <h3 className="font-bold">Analysis Failed</h3>
                    <p>{error}</p>
                </div>
            )}

            {report && (
                 <div className="mt-6 bg-[var(--color-bg-secondary)] rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[var(--color-accent)]">Security Report</h3>
                    <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] whitespace-pre-wrap">
                        {report}
                    </div>
                 </div>
            )}

            {isLoading && (
                 <div className="mt-6 bg-[var(--color-bg-secondary)] rounded-lg p-6 shadow-md animate-pulse">
                    <div className="h-6 bg-[var(--color-bg-tertiary)] rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-full"></div>
                        <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-5/6"></div>
                        <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-1/2"></div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default SecurityPage;
