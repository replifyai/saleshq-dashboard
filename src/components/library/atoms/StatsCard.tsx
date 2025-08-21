import React from 'react';

interface StatsCardProps {
  value: number;
  label: string;
  variant?: 'primary' | 'accent';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  value, 
  label, 
  variant = 'primary',
  className = '' 
}) => {
  const borderColor = variant === 'accent' ? 'border-green-200' : 'border-blue-200';
  const textColor = variant === 'accent' ? 'text-accent' : 'text-primary';

  return (
    <div className={`text-center rounded shadow p-4 border dark:border-white/10 ${borderColor} ${className}`}>
      <div className={`text-2xl font-bold ${textColor}`}>
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
};

export default StatsCard;