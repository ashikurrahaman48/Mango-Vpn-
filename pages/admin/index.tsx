// pages/admin/index.tsx
import React, { useState, useEffect } from 'react';
import type { DashboardStats } from '../../types/admin';
import DashboardCard from '../../components/admin/DashboardCard';

// Dummy Icon Components
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
const BandwidthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard-stats');
        const data: DashboardStats = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-[var(--color-error)]">Could not load dashboard statistics.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Users"
          value={stats.activeUsers.toString()}
          icon={<UsersIcon />}
          trend="+5.4%"
          trendColor="text-[var(--color-success)]"
        />
        <DashboardCard
          title="Online Servers"
          value={`${stats.onlineServers} / ${stats.totalServers}`}
          icon={<ServerIcon />}
          trend={`${stats.totalServers > 0 ? Math.round((stats.onlineServers / stats.totalServers) * 100) : 0}%`}
        />
        <DashboardCard
          title="Total Bandwidth"
          value={`${stats.bandwidthUsage.total.toFixed(2)} GB`}
          icon={<BandwidthIcon />}
          trend={`${stats.bandwidthUsage.peak.toFixed(1)} Mbps peak`}
        />
      </div>
      <div className="mt-8 bg-[var(--color-bg-secondary)] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-[var(--color-text-muted)]">Activity feed placeholder. Real-time updates would appear here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
