// admin/components/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, trendColor = 'text-gray-400' }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {trend && (
            <p className={`text-sm mt-2 ${trendColor}`}>{trend}</p>
        )}
      </div>
      <div className="text-cyan-400">
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
