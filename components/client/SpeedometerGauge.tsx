
import React from 'react';

interface SpeedometerGaugeProps {
  speed: number; // in bytes per second
  label: string;
}

const formatSpeed = (bytesPerSecond: number): { value: string; unit: string } => {
  if (bytesPerSecond < 1024 * 1024) {
    return { value: (bytesPerSecond / 1024).toFixed(1), unit: 'Kbps' };
  } else {
    return { value: (bytesPerSecond / (1024 * 1024)).toFixed(2), unit: 'Mbps' };
  }
};

// A simple logarithmic scale for the gauge to make smaller values more visible
const speedToAngle = (speedBps: number): number => {
    const maxSpeedBps = 100 * 1024 * 1024; // 100 Mbps
    if (speedBps <= 0) return 0;
    // Normalize speed logarithmically and scale to 180 degrees
    const angle = Math.log1p(speedBps) / Math.log1p(maxSpeedBps) * 180;
    return Math.min(angle, 180); // Cap at 180 degrees
};


const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ speed, label }) => {
  const angle = speedToAngle(speed);
  const formatted = formatSpeed(speed);

  const arc = (startAngle: number, endAngle: number) => {
    const start = {
      x: 50 - 40 * Math.cos(-startAngle * Math.PI / 180),
      y: 50 + 40 * Math.sin(-startAngle * Math.PI / 180)
    };
    const end = {
      x: 50 - 40 * Math.cos(-endAngle * Math.PI / 180),
      y: 50 + 40 * Math.sin(-endAngle * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A 40 40 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <div className="text-center bg-[var(--color-bg-secondary)]/50 rounded-2xl p-4">
      <svg viewBox="0 0 100 60" className="w-full h-auto">
        {/* Gauge background track */}
        <path d={arc(0, 180)} fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="8" strokeLinecap="round" />
        {/* Gauge foreground indicator */}
        <path d={arc(0, angle)} fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round" className="transition-all duration-500 ease-out" />
        <text x="50" y="40" textAnchor="middle" className="fill-[var(--color-text-primary)] font-bold text-2xl">
          {formatted.value}
        </text>
        <text x="50" y="52" textAnchor="middle" className="fill-[var(--color-text-muted)] text-sm">
          {formatted.unit}
        </text>
      </svg>
      <p className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">{label}</p>
    </div>
  );
};

export default SpeedometerGauge;
