// components/admin/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, trendColor = 'text-[var(--color-text-muted)]' }) => {
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
        <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{value}</p>
        {trend && (
            <p className={`text-sm mt-2 ${trendColor}`}>{trend}</p>
        )}
      </div>
      <div className="text-[var(--color-accent)]">
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
