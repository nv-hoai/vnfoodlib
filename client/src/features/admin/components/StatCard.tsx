import React, { FC } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  bgColor: string;
  textColor: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, bgColor, textColor }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow`}>
    <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
    <p className={`${textColor} text-3xl font-bold`}>{value}</p>
  </div>
);

export default StatCard;
