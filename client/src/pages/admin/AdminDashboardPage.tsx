import React, { FC, useState } from 'react';
import { useGetDashboardStatsQuery, useGetPendingContributionsQuery } from '../../features/admin/api/adminApi';
import { StatCard } from '../../features/admin/components';
import type { DashboardStats } from '../../features/admin/api/adminApi';

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Quản Trị</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của thư viện</p>
      </div>

      {statsLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Users Section */}
            <StatCard
              title="Tổng Người Dùng"
              value={stats.users?.total || 0}
              bgColor="bg-blue-50"
              textColor="text-blue-900"
            />
            <StatCard
              title="Người Dùng Hoạt Động"
              value={stats.users?.active || 0}
              bgColor="bg-green-50"
              textColor="text-green-900"
            />
            <StatCard
              title="Người Dùng Tạm Khóa"
              value={stats.users?.suspended || 0}
              bgColor="bg-yellow-50"
              textColor="text-yellow-900"
            />
            <StatCard
              title="Người Dùng Bị Cấm"
              value={stats.users?.banned || 0}
              bgColor="bg-red-50"
              textColor="text-red-900"
            />
          </div>

          {/* Food & Contributions Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Tổng Món Ăn"
              value={stats.foods?.total || 0}
              bgColor="bg-purple-50"
              textColor="text-purple-900"
            />
            <StatCard
              title="Món Mới (Tháng Này)"
              value={stats.foods?.newThisMonth || 0}
              bgColor="bg-indigo-50"
              textColor="text-indigo-900"
            />
            <StatCard
              title="Tỷ Lệ Phê Duyệt"
              value={`${stats.contributions?.approvalRate}%`}
              bgColor="bg-orange-50"
              textColor="text-orange-900"
            />
          </div>

          {/* Contributions Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Tổng Đóng Góp"
              value={stats.contributions?.total || 0}
              bgColor="bg-cyan-50"
              textColor="text-cyan-900"
            />
            <StatCard
              title="Chờ Duyệt"
              value={stats.contributions?.pending || 0}
              bgColor="bg-yellow-50"
              textColor="text-yellow-900"
            />
            <StatCard
              title="Phê Duyệt"
              value={stats.contributions?.approved || 0}
              bgColor="bg-green-50"
              textColor="text-green-900"
            />
            <StatCard
              title="Bị Từ Chối"
              value={stats.contributions?.rejected || 0}
              bgColor="bg-red-50"
              textColor="text-red-900"
            />
          </div>

          {/* New Users This Month */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-lg shadow">
              <p className="text-sm font-semibold text-sky-700 mb-1">Người Dùng Mới (Tháng Này)</p>
              <p className="text-3xl font-bold text-sky-900">{stats.users?.newThisMonth || 0}</p>
              <p className="text-xs text-sky-600 mt-2">Năm nay: {stats.users?.newThisYear || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg shadow">
              <p className="text-sm font-semibold text-pink-700 mb-1">Đóng Góp Chờ Duyệt</p>
              <p className="text-3xl font-bold text-pink-900">{stats.contributions?.pending || 0}</p>
              <a href="/admin/contributions" className="text-xs text-pink-600 hover:text-pink-800 mt-2 inline-block">
                Xem chi tiết
              </a>
            </div>
          </div>

          {/* Recent Contributions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Đóng Góp Chờ Duyệt Gần Đây</h2>

            {recentContributions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Không có đóng góp chờ duyệt</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Loại</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên Món</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Người Gửi</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày Gửi</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContributions.map((contrib: any) => (
                      <tr key={contrib._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${contrib.type === 'new_food' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {contrib.type === 'new_food' ? 'Món Mới' : 'Chỉnh Sửa'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{contrib.data.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{contrib.submittedBy?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(contrib.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="px-4 py-3">
                          <a href={`/admin/contributions/${contrib._id}`} className="text-orange-600 hover:text-orange-800 font-semibold">
                            Xem
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 text-center">
              <a href="/admin/contributions" className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                Xem Tất Cả Đóng Góp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/contributions"
              className="block p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-orange-900 mb-2">Duyệt Đóng Góp</h3>
              <p className="text-sm text-orange-700">Quản lý và phê duyệt các đóng góp từ người dùng</p>
            </a>

            <a
              href="/admin/users"
              className="block p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-2">Quản Lý Người Dùng</h3>
              <p className="text-sm text-blue-700">Quản lý tài khoản, vai trò và phân quyền</p>
            </a>

            <a
              href="/admin/activities"
              className="block p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-purple-900 mb-2">Nhật Ký Hoạt Động</h3>
              <p className="text-sm text-purple-700">Theo dõi các hành động của admin</p>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
