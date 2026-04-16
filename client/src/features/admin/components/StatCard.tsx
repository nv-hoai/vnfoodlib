import React, { FC } from 'react';
import type { StatCardProps } from '@/types';

const StatCard: FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  </div>
);

export default StatCard;
