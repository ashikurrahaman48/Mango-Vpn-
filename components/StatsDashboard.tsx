
import React from 'react';
import { ConnectionStatus, type Stats } from '../types';

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

const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond < 1024 * 1024) { // less than 1 MB/s
        return `${(bytesPerSecond / 1024).toFixed(1)} Kbps`;
    } else {
        return `${(bytesPerSecond / 1024 / 1024).toFixed(2)} Mbps`;
    }
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
  <div className="bg-gray-700/50 p-4 rounded-xl flex items-center space-x-4">
    <div className="bg-gray-800 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
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

const SpeedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m1.5-4.5h1.5m13.5 0h1.5m-1.5 4.5h-1.5m-12-3v9m0 0H4.5m3.75 0a7.5 7.5 0 0015 0m0 0h-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const StatsDashboard: React.FC<StatsDashboardProps> = ({ status, stats }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;
  const { connectionTime, dataDownloaded, dataUploaded, downloadSpeed, uploadSpeed } = stats;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-opacity duration-500 ${isConnected ? 'opacity-100' : 'opacity-50'}`}>
        <h2 className="text-xl font-bold mb-6 text-cyan-400">Live Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatCard 
                icon={<ClockIcon className="w-6 h-6 text-cyan-400" />}
                label="Duration"
                value={formatTime(connectionTime)}
            />
             <StatCard 
                icon={<DownloadIcon className="w-6 h-6 text-green-400" />}
                label="Downloaded"
                value={formatData(dataDownloaded)}
            />
             <StatCard 
                icon={<UploadIcon className="w-6 h-6 text-yellow-400" />}
                label="Uploaded"
                value={formatData(dataUploaded)}
            />
        </div>
         <h2 className="text-lg font-bold my-4 text-cyan-400">Bandwidth</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <StatCard 
                icon={<DownloadIcon className="w-6 h-6 text-green-400" />}
                label="Download Speed"
                value={formatSpeed(downloadSpeed)}
            />
             <StatCard 
                icon={<UploadIcon className="w-6 h-6 text-yellow-400" />}
                label="Upload Speed"
                value={formatSpeed(uploadSpeed)}
            />
        </div>
    </div>
  );
};

export default StatsDashboard;