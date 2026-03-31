import React, { FC, useState } from 'react';
import {
  useGetPendingContributionsQuery,
  useApproveContributionMutation,
  useRejectContributionMutation
} from '../../features/admin/api/adminApi';
import type { IContribution } from '../../features/contributions/api/contributionsApi';

const AdminContributionsPage: FC = () => {
  const [page, setPage] = useState(1);
  const [selectedContribution, setSelectedContribution] = useState<IContribution | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'reject' | null;
    contribution?: IContribution;
  }>({ type: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // API calls
  const { data: contributionsData, isLoading } = useGetPendingContributionsQuery({
    page,
    limit: 10
  });
  const [approveContribution, { isLoading: approveLoading }] = useApproveContributionMutation();
  const [rejectContribution, { isLoading: rejectLoading }] = useRejectContributionMutation();

  const contributions = contributionsData?.data?.contributions || [];
  const pagination = contributionsData?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  // Handlers
  const handleApprove = async () => {
    if (actionModal.contribution) {
      try {
        await approveContribution({
          id: actionModal.contribution._id,
          notes: adminNotes || undefined
        }).unwrap();

        alert('Đóng góp đã được phê duyệt');
        setActionModal({ type: null });
        setAdminNotes('');
        setSelectedContribution(null);
      } catch (error: any) {
        alert(`Lỗi: ${error?.data?.message || 'Không thể phê duyệt đóng góp'}`);
      }
    }
  };

  const handleReject = async () => {
    if (actionModal.contribution) {
      if (!rejectionReason.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
      }

      try {
        await rejectContribution({
          id: actionModal.contribution._id,
          reason: rejectionReason
        }).unwrap();

        alert('Đóng góp đã bị từ chối');
        setActionModal({ type: null });
        setRejectionReason('');
        setAdminNotes('');
        setSelectedContribution(null);
      } catch (error: any) {
        alert(`Lỗi: ${error?.data?.message || 'Không thể từ chối đóng góp'}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Duyệt Đóng Góp</h1>
        <p className="text-gray-600">Quản lý và phê duyệt các đóng góp từ người dùng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Tổng Chờ Duyệt</p>
          <p className="text-2xl font-bold text-orange-900">{pagination.total || 0}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Trang</p>
          <p className="text-2xl font-bold text-blue-900">
            {page} / {pagination.pages || 1}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Trang Này</p>
          <p className="text-2xl font-bold text-green-900">{contributions.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Xem Chi Tiết</p>
          <p className="text-2xl font-bold text-purple-900">{selectedContribution ? '1' : '0'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hàng Chờ Duyệt</h2>

            {isLoading ? (
              <p className="text-center py-12 text-gray-600">Đang tải...</p>
            ) : contributions.length === 0 ? (
              <p className="text-center py-12 text-gray-600">Không có đóng góp chờ duyệt</p>
            ) : (
              <div className="space-y-3">
                {contributions.map((contrib) => (
                  <div
                    key={contrib._id}
                    onClick={() => setSelectedContribution(contrib)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedContribution?._id === contrib._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-700">{contrib.data.name ? contrib.data.name[0].toUpperCase() : '?'}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contrib.data.name || 'Không tên'}</p>
                          <p className="text-xs text-gray-600">Người dùng</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          contrib.type === 'new_food' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {contrib.type === 'new_food' ? 'Món Mới' : 'Chỉnh Sửa'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{contrib.data.intro || 'Không có mô tả'}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(contrib.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>{(contrib.data.tags?.category?.length || 0) + (contrib.data.tags?.ingredient?.length || 0) + (contrib.data.tags?.meal_time?.length || 0) + (contrib.data.tags?.cooking_method?.length || 0)} tags</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages && pagination.pages > 1 && (
              <div className="flex gap-2 mt-6 justify-center">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Trước
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${p === page ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết</h2>

            {selectedContribution ? (
              <div>
                {/* Type Badge */}
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      selectedContribution.type === 'new_food' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedContribution.type === 'new_food' ? 'Món Mới' : 'Chỉnh Sửa'}
                  </span>
                </div>

                {/* Food Name */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-semibold">Tên Món</p>
                  <p className="text-gray-900 font-bold">{selectedContribution.data.name}</p>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-semibold">Người Gửi</p>
                  <p className="text-gray-900">ID: {typeof selectedContribution.submittedBy === 'string' ? selectedContribution.submittedBy : 'Unknown'}</p>
                </div>

                {/* Submitted Date */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-semibold">Ngày Gửi</p>
                  <p className="text-gray-900">{new Date(selectedContribution.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>

                {/* Description */}
                {selectedContribution.data.intro && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Mô Tả</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{selectedContribution.data.intro}</p>
                  </div>
                )}

                {/* Changes (for edit suggestions) */}
                {selectedContribution.changes && selectedContribution.changes.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-xs text-blue-700 font-semibold mb-2">Thay Đổi</p>
                    <div className="space-y-2">
                      {selectedContribution.changes.map((change: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <p className="font-semibold text-blue-900">{change.field}</p>
                          <p className="text-gray-600 line-clamp-1">
                            <span className="line-through">"{change.oldValue}"</span> <span className="font-semibold">"{change.newValue}"</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedContribution.data.tags && (
                  (selectedContribution.data.tags.category?.length || 0) +
                  (selectedContribution.data.tags.ingredient?.length || 0) +
                  (selectedContribution.data.tags.meal_time?.length || 0) +
                  (selectedContribution.data.tags.cooking_method?.length || 0) +
                  (selectedContribution.data.tags.taste?.length || 0) +
                  (selectedContribution.data.tags.purpose?.length || 0) +
                  (selectedContribution.data.tags.diet?.length || 0) > 0
                ) && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedContribution.data.tags.category?.map((tag: string, idx: number) => (
                        <span key={`cat-${idx}`} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.ingredient?.map((tag: string, idx: number) => (
                        <span key={`ing-${idx}`} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.meal_time?.map((tag: string, idx: number) => (
                        <span key={`meal-${idx}`} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.cooking_method?.map((tag: string, idx: number) => (
                        <span key={`cook-${idx}`} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.taste?.map((tag: string, idx: number) => (
                        <span key={`taste-${idx}`} className="px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.purpose?.map((tag: string, idx: number) => (
                        <span key={`pur-${idx}`} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">{tag}</span>
                      ))}
                      {selectedContribution.data.tags.diet?.map((tag: string, idx: number) => (
                        <span key={`diet-${idx}`} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image */}
                {selectedContribution.data.image && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Ảnh</p>
                    <img src={selectedContribution.data.image} alt={selectedContribution.data.name} className="w-full rounded object-cover h-40" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActionModal({ type: 'approve', contribution: selectedContribution })}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    Phê Duyệt
                  </button>
                  <button
                    onClick={() => setActionModal({ type: 'reject', contribution: selectedContribution })}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Từ Chốii
                  </button>
                </div>

                {/* Admin Notes Input */}
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-2">Ghi Chú Quản Trị</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Thêm ghi chú (optional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Chọn một đóng góp để xem chi tiết</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {actionModal.type === 'approve' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phê Duyệt Đóng Góp</h3>
            <p className="text-gray-600 mb-6">Bạn chắc chắn muốn phê duyệt đóng góp "{actionModal.contribution?.data.name}"?</p>

            {actionModal.contribution?.type === 'new_food' && (
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <p className="font-semibold">Sẽ tạo một món ăn mới trong hệ thống</p>
              </div>
            )}

            {actionModal.contribution?.type === 'edit_food' && (
              <div className="mb-4 p-3 bg-purple-50 rounded text-sm text-purple-700">
                <p className="font-semibold">Sẽ cập nhật các thay đổi vào món ăn hiện có</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ type: null })}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                disabled={approveLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50"
              >
                {approveLoading ? 'Đang xử lý...' : 'Phê Duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal.type === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Từ Chối Đóng Góp</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lý Do Từ Chối *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi Chú Thêm (tùy chọn)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Thêm ghi chú cho người dùng..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal({ type: null });
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={rejectLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold disabled:opacity-50"
              >
                {rejectLoading ? 'Đang xử lý...' : 'Từ Chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContributionsPage;
