import React, { FC, useState } from 'react';
import { useGetActivitiesQuery } from '../../features/admin/api/adminApi';
import type { IActivityLog } from '../../features/admin/api/adminApi';

const AdminActivitiesPage: FC = () => {
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState<string>('all');
  const limit = 20;

  const { data: activitiesData, isLoading } = useGetActivitiesQuery({ page, limit, action: filterAction !== 'all' ? filterAction : undefined });

  const activities = activitiesData?.data?.activities || [];
  const pagination = activitiesData?.data?.pagination || { page: 1, limit: 50, total: 0, pages: 1 };

  const actionLabels: { [key: string]: { label: string; color: string; icon: string } } = {
    approved_contribution: { label: 'Phê Duyệt Đóng Góp', color: 'bg-green-100 text-green-800', icon: '✓' },
    rejected_contribution: { label: 'Từ Chối Đóng Góp', color: 'bg-red-100 text-red-800', icon: '✗' },
    suspended_user: { label: 'Khóa Người Dùng', color: 'bg-yellow-100 text-yellow-800', icon: '⏸' },
    unsuspended_user: { label: 'Mở Khóa Người Dùng', color: 'bg-blue-100 text-blue-800', icon: '▶' },
    banned_user: { label: 'Cấm Người Dùng', color: 'bg-red-100 text-red-800', icon: '🚫' },
    unbanned_user: { label: 'Bỏ Cấm Người Dùng', color: 'bg-green-100 text-green-800', icon: '✓' },
    changed_user_role: { label: 'Thay Đổi Role', color: 'bg-purple-100 text-purple-800', icon: '👤' },
    archived_contribution: { label: 'Lưu Trữ Đóng Góp', color: 'bg-gray-100 text-gray-800', icon: '📦' },
    edited_food: { label: 'Sửa Món Ăn', color: 'bg-blue-100 text-blue-800', icon: '✏️' },
    deleted_food: { label: 'Xóa Món Ăn', color: 'bg-red-100 text-red-800', icon: '🗑️' },
    other: { label: 'Khác', color: 'bg-gray-100 text-gray-800', icon: '•' }
  };

  const getActionInfo = (action: string) => {
    return actionLabels[action] || actionLabels.other;
  };

  const getTargetLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      contribution: 'Đóng Góp',
      user: 'Người Dùng',
      food: 'Món Ăn'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Nhật Ký Hoạt Động</h1>
        <p className="text-blue-100">Theo dõi tất cả các hoạt động quản trị</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Lọc theo loại hoạt động</label>
        <select
          value={filterAction}
          onChange={(e) => {
            setFilterAction(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        >
          <option value="all">Tất cả hoạt động</option>
          <option value="approved_contribution">Phê Duyệt Đóng Góp</option>
          <option value="rejected_contribution">Từ Chối Đóng Góp</option>
          <option value="suspended_user">Khóa Người Dùng</option>
          <option value="unsuspended_user">Mở Khóa Người Dùng</option>
          <option value="banned_user">Cấm Người Dùng</option>
          <option value="unbanned_user">Bỏ Cấm Người Dùng</option>
          <option value="changed_user_role">Thay Đổi Role</option>
          <option value="archived_contribution">Lưu Trữ Đóng Góp</option>
          <option value="edited_food">Sửa Món Ăn</option>
          <option value="deleted_food">Xóa Món Ăn</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Đang tải nhật ký...</p>
        </div>
      )}

      {/* Activities List */}
      {!isLoading && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((activity: IActivityLog) => {
            const actionInfo = getActionInfo(activity.action);
            return (
              <div key={activity._id} className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${actionInfo.color} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {actionInfo.icon} {actionInfo.label}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(activity.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold text-gray-900">{activity.actor?.name || 'Unknown'}</span>
                      <span className="text-gray-600"> ({activity.actor?.email})</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      Mục tiêu: <span className="font-medium">{getTargetLabel(activity.target.type)}</span> (ID: {activity.target.id})
                    </div>

                    {activity.reason && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Lý do: </span>{activity.reason}
                      </div>
                    )}

                    {activity.details && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Chi tiết: </span>{activity.details}
                      </div>
                    )}

                    {activity.changes && typeof activity.changes === 'object' && Object.keys(activity.changes).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <p className="font-medium text-gray-900 mb-2">Thay đổi:</p>
                        {Object.entries(activity.changes).map(([key, change]: [string, any]) => (
                          <div key={key} className="text-gray-700">
                            <span className="font-medium">{key}:</span> <span className="line-through text-red-600">{String(change.oldValue)}</span> → <span className="text-green-600">{String(change.newValue)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && activities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 text-lg">Không có hoạt động nào</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && (pagination.pages || 1) > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.pages || 1 }, (_, i) => i + 1).slice(Math.max(0, page - 2), page + 1).map((p: number) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(pagination.pages || 1, page + 1))}
            disabled={page === (pagination.pages || 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminActivitiesPage;
