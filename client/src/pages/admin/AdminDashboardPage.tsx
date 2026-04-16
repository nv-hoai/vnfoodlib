import React, { FC } from 'react';
import { useGetDashboardStatsQuery, useGetPendingContributionsQuery } from '../../features/admin/api/adminApi';
import { StatCard } from '../../features/admin/components';
import type { DashboardStats } from '../../features/admin/api/adminApi';

// Animated Counter Component
const AnimatedCounter: FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Progress Bar Component
const ProgressBar: FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Stats Grid Card Component
const StatsGridCard: FC<{
  title: string;
  value: number;
  max?: number;
  gradient: string;
  icon: string;
  trend?: { value: number; type: 'up' | 'down' };
}> = ({ title, value, max, gradient, icon, trend }) => {
  return (
    <div className={`${gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <div className={`text-xs font-bold ${trend.type === 'up' ? 'text-green-300' : 'text-red-300'}`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <p className="text-xs opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">
        <AnimatedCounter value={value} />
      </p>
      {max && (
        <div className="mt-2">
          <ProgressBar value={value} max={max} color="bg-white" />
          <p className="text-xs opacity-75 mt-1">{value} / {max}</p>
        </div>
      )}
    </div>
  );
};

// Stats Overview Card
const OverviewCard: FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
  size?: 'sm' | 'lg';
}> = ({ title, value, subtitle, gradient, size = 'sm' }) => {
  return (
    <div className={`${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 ${size === 'lg' ? 'col-span-2 md:col-span-1' : ''}`}>
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <p className={`font-bold ${size === 'lg' ? 'text-5xl' : 'text-4xl'}`}>{value}</p>
      {subtitle && <p className="text-xs opacity-75 mt-2">{subtitle}</p>}
    </div>
  );
};

// Contribution Status Chart
const ContributionChart: FC<{ approved: number; pending: number; rejected: number }> = ({
  approved,
  pending,
  rejected
}) => {
  const total = approved + pending + rejected;
  const approvedPct = (approved / total) * 100;
  const pendingPct = (pending / total) * 100;
  const rejectedPct = (rejected / total) * 100;

  return (
    <div className="flex items-end justify-center gap-4 h-48">
      <div className="flex flex-col items-center">
        <div className="flex flex-col-reverse gap-1">
          {Array.from({ length: Math.ceil(approved / 2) }).map((_, i) => (
            <div
              key={`approved-${i}`}
              className="w-8 bg-gradient-to-t from-green-400 to-green-500 rounded-t opacity-90 hover:opacity-100"
              style={{ height: `${4}px` }}
            />
          ))}
        </div>
        <p className="text-lg font-bold text-green-600 mt-2">{approved}</p>
        <p className="text-xs text-gray-500">Phê Duyệt</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col-reverse gap-1">
          {Array.from({ length: Math.ceil(pending / 2) }).map((_, i) => (
            <div
              key={`pending-${i}`}
              className="w-8 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t opacity-90 hover:opacity-100"
              style={{ height: `${4}px` }}
            />
          ))}
        </div>
        <p className="text-lg font-bold text-yellow-600 mt-2">{pending}</p>
        <p className="text-xs text-gray-500">Chờ Duyệt</p>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col-reverse gap-1">
          {Array.from({ length: Math.ceil(rejected / 2) }).map((_, i) => (
            <div
              key={`rejected-${i}`}
              className="w-8 bg-gradient-to-t from-red-400 to-red-500 rounded-t opacity-90 hover:opacity-100"
              style={{ height: `${4}px` }}
            />
          ))}
        </div>
        <p className="text-lg font-bold text-red-600 mt-2">{rejected}</p>
        <p className="text-xs text-gray-500">Bị Từ Chối</p>
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart: FC<{ value: number; max: number; label: string; color: string }> = ({
  value,
  max,
  label,
  color
}) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold">{percentage.toFixed(0)}%</p>
          <p className="text-xs text-gray-500">{value}/{max}</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
};

const AdminDashboardPage: FC = () => {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: contributionsData } = useGetPendingContributionsQuery({ limit: 5 });

  const stats: DashboardStats = statsData?.data || {
    users: { total: 0, active: 0, suspended: 0, banned: 0, newThisMonth: 0, newThisYear: 0 },
    foods: { total: 0, newThisMonth: 0 },
    contributions: { total: 0, pending: 0, approved: 0, rejected: 0, approvalRate: '0' },
    recentActivity: []
  };
  const recentContributions = contributionsData?.data?.contributions || [];

  if (statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsGridCard
          title="Người Dùng"
          value={stats.users?.total || 0}
          trend={{ value: 12, type: 'up' }}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          icon="👥"
        />
        <StatsGridCard
          title="Hoạt Động"
          value={stats.users?.active || 0}
          max={stats.users?.total || 100}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          icon="✅"
        />
        <StatsGridCard
          title="Tạm Khóa"
          value={stats.users?.suspended || 0}
          trend={{ value: 5, type: 'down' }}
          gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
          icon="⏸️"
        />
        <StatsGridCard
          title="Bị Cấm"
          value={stats.users?.banned || 0}
          gradient="bg-gradient-to-br from-red-500 to-red-600"
          icon="🚫"
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contributions Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Đóng Góp</h2>
          <ContributionChart
            approved={stats.contributions?.approved || 0}
            pending={stats.contributions?.pending || 0}
            rejected={stats.contributions?.rejected || 0}
          />
        </div>

        {/* Approval Rate Donut */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
          <DonutChart
            value={parseInt(stats.contributions?.approvalRate || '0')}
            max={100}
            label="Tỷ Lệ Phê Duyệt"
            color="#10b981"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <OverviewCard
          title="Tổng Món Ăn"
          value={stats.foods?.total || 0}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <OverviewCard
          title="Mới Tháng Này"
          value={stats.foods?.newThisMonth || 0}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <OverviewCard
          title="Người Dùng Mới"
          value={stats.users?.newThisMonth || 0}
          subtitle={`Năm nay: ${stats.users?.newThisYear || 0}`}
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
        <OverviewCard
          title="Chờ Duyệt"
          value={stats.contributions?.pending || 0}
          gradient="bg-gradient-to-br from-pink-500 to-pink-600"
        />
      </div>

      {/* Recent Contributions */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Đóng Góp Gần Đây</h2>
        </div>

        {recentContributions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Không có đóng góp nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Loại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tên Món</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Người Gửi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Ngày</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {recentContributions.map((contrib: any, idx: number) => (
                  <tr key={contrib._id} className={`border-t border-gray-100 hover:bg-gray-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        contrib.type === 'new_food'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {contrib.type === 'new_food' ? '🆕' : '✏️'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{contrib.data.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contrib.submittedBy?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(contrib.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/admin/contributions/${contrib._id}`}
                        className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition"
                      >
                        Xem
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <a
            href="/admin/contributions"
            className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
          >
            Xem Tất Cả →
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/admin/contributions"
          className="group block bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:from-orange-100 hover:to-orange-200 transition transform hover:scale-105 shadow hover:shadow-lg"
        >
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-bold text-gray-900">Duyệt Đóng Góp</h3>
        </a>

        <a
          href="/admin/users"
          className="group block bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 transition transform hover:scale-105 shadow hover:shadow-lg"
        >
          <div className="text-3xl mb-2">👤</div>
          <h3 className="font-bold text-gray-900">Quản Lý Người Dùng</h3>
        </a>

        <a
          href="/admin/activities"
          className="group block bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 transition transform hover:scale-105 shadow hover:shadow-lg"
        >
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold text-gray-900">Nhật Ký Hoạt Động</h3>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
