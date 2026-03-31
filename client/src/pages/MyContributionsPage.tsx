import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyContributionsQuery } from '../features/contributions/api/contributionsApi';
import type { IContribution } from '../features/contributions/api/contributionsApi';

const MyContributionsPage: FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryResult = useGetMyContributionsQuery({ page, limit });
  const isLoading: boolean = Boolean(queryResult.isLoading);
  const data = queryResult.data;
  const error: unknown = queryResult.error || null;
  const contributions = data?.data?.contributions || [];
  const pagination = data?.data?.pagination;

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Chờ duyệt',
      approved: 'Phê duyệt',
      rejected: 'Bị từ chối',
      archived: 'Lưu trữ'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    return type === 'new_food' ? 'Món Mới' : 'Chỉnh Sửa';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đóng Góp Của Tôi</h1>
          <p className="text-gray-600">Xem lịch sử các đóng góp của bạn cho thư viện</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/contributions/new-food')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Thêm Món Mới
          </button>
          <button
            onClick={() => navigate('/contributions/edit-food')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            ✏️ Chỉnh Sửa
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      ) : null}

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Lỗi: Không thể tải đóng góp</p>
        </div>
      ) : null}

      {/* Empty State */}
      {!isLoading && contributions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-4">Bạn chưa có đóng góp nào</p>
          <p className="text-gray-500 mb-6">Hãy bắt đầu bằng cách đề xuất một món ăn mới hoặc sửa đổi một món ăn hiện có</p>
        </div>
      )}

      {/* Contributions List */}
      {!isLoading && contributions.length > 0 && (
        <div className="space-y-4 mb-8">
          {contributions.map((contribution: IContribution) => (
            <div key={contribution._id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contribution.data.name || 'Không xác định'}
                  </h3>

                  {/* Type & Status Badges */}
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {getTypeLabel(contribution.type)}
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusBadge(contribution.status)}`}>
                      {getStatusLabel(contribution.status)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Ngày gửi:</span> {new Date(contribution.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    {contribution.reviewedAt && (
                      <div>
                        <span className="font-semibold">Ngày duyệt:</span> {new Date(contribution.reviewedAt).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                    {contribution.type === 'edit_food' && contribution.foodId && (
                      <div>
                        <span className="font-semibold">Chỉnh sửa:</span> <a href={`/foods/${contribution.foodId}`} className="text-orange-600 hover:underline">Xem mon</a>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {contribution.status === 'rejected' && contribution.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Lý do từ chối:</span> {contribution.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {contribution.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Ghi chú từ admin:</span> {contribution.notes}
                      </p>
                    </div>
                  )}

                  {/* Changes Preview (for edits) */}
                  {contribution.type === 'edit_food' && contribution.changes && contribution.changes.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Các thay đổi:</p>
                      <ul className="space-y-1">
                        {contribution.changes.map((change, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • <span className="font-medium">{change.field}:</span> {String(change.oldValue).substring(0, 50)}... → {String(change.newValue).substring(0, 50)}...
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Data Preview (for new food) */}
                  {contribution.type === 'new_food' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Giới thiệu:</span> {contribution.data.intro?.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {contribution.status === 'approved' && (
                    <div className="text-4xl text-green-500">✓</div>
                  )}
                  {contribution.status === 'rejected' && (
                    <div className="text-4xl text-red-500">✕</div>
                  )}
                  {contribution.status === 'pending' && (
                    <div className="text-4xl text-yellow-500">⏳</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang trước
          </button>

          {Array.from({ length: Math.min(5, pagination.pages) }).map((_, index) => {
            const pageNum = Math.max(1, page - 2) + index;
            if (pageNum > pagination.pages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pageNum === page
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <p className="text-sm text-blue-700 font-semibold">Tổng Đóng Góp</p>
            <p className="text-3xl font-bold text-blue-900">{pagination?.total || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <p className="text-sm text-green-700 font-semibold">Phê Duyệt</p>
            <p className="text-3xl font-bold text-green-900">
              {contributions.filter((c: IContribution) => c.status === 'approved').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
            <p className="text-sm text-yellow-700 font-semibold">Chờ Duyệt</p>
            <p className="text-3xl font-bold text-yellow-900">
              {contributions.filter((c: IContribution) => c.status === 'pending').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContributionsPage;
