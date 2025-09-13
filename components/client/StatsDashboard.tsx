import React from 'react';
import { ConnectionStatus, type Stats } from '../../types/client';
import SpeedometerGauge from './SpeedometerGauge';

interface StatsDashboardProps {
  status: ConnectionStatus;
  stats: Stats;
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatData = (megabytes: number): string => {
  if (megabytes < 1024) {
    return `${megabytes.toFixed(2)} MB`;
  } else {
    return `${(megabytes / 1024).toFixed(2)} GB`;
  }
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
  <div className="bg-[var(--color-bg-tertiary)]/50 p-4 rounded-xl flex items-center space-x-4 flex-1">
    <div className="bg-[var(--color-bg-secondary)] p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p className="text-xl font-semibold text-[var(--color-text-primary)]">{value}</p>
    </div>
  </div>
);


const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H4" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StatsDashboard: React.FC<StatsDashboardProps> = ({ status, stats }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;
  const { connectionTime, dataDownloaded, dataUploaded, downloadSpeed, uploadSpeed } = stats;

  return (
    <div className={`transition-opacity duration-500 ${isConnected ? 'opacity-100' : 'opacity-50'}`}>
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-4">
             <SpeedometerGauge speed={downloadSpeed} label="Download" />
             <SpeedometerGauge speed={uploadSpeed} label="Upload" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
                icon={<ClockIcon className="w-6 h-6 text-[var(--color-accent)]" />}
                label="Duration"
                value={formatTime(connectionTime)}
            />
             <StatCard 
                icon={<DownloadIcon className="w-6 h-6 text-[var(--color-success)]" />}
                label="Downloaded"
                value={formatData(dataDownloaded)}
            />
             <StatCard 
                icon={<UploadIcon className="w-6 h-6 text-[var(--color-warning)]" />}
                label="Uploaded"
                value={formatData(dataUploaded)}
            />
        </div>
    </div>
  );
};

export default StatsDashboard;
