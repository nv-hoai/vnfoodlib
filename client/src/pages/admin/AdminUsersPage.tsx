import React, { FC, useState } from 'react';
import {
  useGetUserListQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useBanUserMutation,
  useChangeUserRoleMutation,
  type IUserInfo
} from '../../features/admin/api/adminApi';

const AdminUsersPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'moderator' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'ban' | 'role' | null;
    userId?: string;
  }>({ type: null });
  const [suspendDays, setSuspendDays] = useState(7);
  const [suspendReason, setSuspendReason] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'moderator' | 'admin'>('user');

  // API calls
  const { data: usersData, isLoading } = useGetUserListQuery({
    search: searchTerm || undefined,
    role: filterRole !== 'all' ? filterRole : undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined
  });
  const [suspendUser] = useSuspendUserMutation();
  const [unSuspendUser] = useUnsuspendUserMutation();
  const [banUser] = useBanUserMutation();
  const [changeUserRole] = useChangeUserRoleMutation();

  const users: IUserInfo[] = usersData?.data?.users || [];

  // Handlers
  const handleSuspend = async () => {
    if (actionModal.userId) {
      try {
        await suspendUser({
          id: actionModal.userId,
          durationDays: suspendDays,
          reason: suspendReason
        }).unwrap();
        alert('Người dùng đã bị tạm khóa thành công');
        setActionModal({ type: null });
        setSuspendReason('');
        setSuspendDays(7);
      } catch (error: any) {
        alert(`Lỗi: ${error?.data?.message || 'Không thể tạm khóa người dùng'}`);
      }
    }
  };

  const handleUnSuspend = async (userId: string) => {
    try {
      await unSuspendUser(userId).unwrap();
      alert('Khóa đã được tháo gỡ');
    } catch (error: any) {
      alert(`Lỗi: ${error?.data?.message || 'Không thể tháo gỡ khóa'}`);
    }
  };

  const handleBan = async () => {
    if (actionModal.userId) {
      try {
        await banUser({
          id: actionModal.userId,
          reason: 'Admin action'
        }).unwrap();
        alert('Người dùng đã bị cấm vĩnh viễn');
        setActionModal({ type: null });
      } catch (error: any) {
        alert(`Lỗi: ${error?.data?.message || 'Không thể cấm người dùng'}`);
      }
    }
  };

  const handleChangeRole = async () => {
    if (actionModal.userId) {
      try {
        await changeUserRole({
          id: actionModal.userId,
          role: newRole
        }).unwrap();
        alert('Vai trò đã được cập nhật');
        setActionModal({ type: null });
        setNewRole('user');
      } catch (error: any) {
        alert(`Lỗi: ${error?.data?.message || 'Không thể thay đổi vai trò'}`);
      }
    }
  };

  const getStatusBadge = (user: IUserInfo) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    if (user.status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (user.status === 'suspended') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else if (user.status === 'banned') {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold';
    if (role === 'admin') {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (role === 'moderator') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Người Dùng</h1>
        <p className="text-gray-600">Quản lý tài khoản, vai trò và quyền hạn của người dùng</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm Kiếm</label>
            <input
              type="text"
              placeholder="Tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vai Trò</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất Cả</option>
              <option value="user">Người Dùng</option>
              <option value="moderator">Người Kiểm Duyệt</option>
              <option value="admin">Quản Trị Viên</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng Thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tất Cả</option>
              <option value="active">Hoạt Động</option>
              <option value="suspended">Tạm Khóa</option>
              <option value="banned">Bị Cấm</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterStatus('all');
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">Không tìm thấy người dùng nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Tên Người Dùng</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Vai Trò</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Trạng Thái</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Đóng Góp</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Ngày Tham Gia</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-700">{user.name[0]}</span>
                        </div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={getRoleBadge(user.role)}>
                        {user.role === 'admin' ? 'Quản Trị Viên' : user.role === 'moderator' ? 'Kiểm Duyệt' : 'Người Dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadge(user)}>
                        {user.status === 'active' ? 'Hoạt Động' : user.status === 'suspended' ? 'Tạm Khóa' : 'Bị Cấm'}
                      </span>
                      {user.status === 'suspended' && user.suspendedUntil && (
                        <p className="text-xs text-yellow-600 mt-1">Hết: {new Date(user.suspendedUntil).toLocaleDateString('vi-VN')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{user.contributionsCount}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActionModal({ type: 'role', userId: user._id });
                            setNewRole(user.role);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                        >
                          Vai Trò
                        </button>

                        {user.status === 'active' && (
                          <button
                            onClick={() => setActionModal({ type: 'suspend', userId: user._id })}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition"
                          >
                            Khóa
                          </button>
                        )}

                        {user.status === 'suspended' && (
                          <button
                            onClick={() => handleUnSuspend(user._id)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                          >
                            Tháo Khóa
                          </button>
                        )}

                        {user.status !== 'banned' && (
                          <button
                            onClick={() => setActionModal({ type: 'ban', userId: user._id })}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                          >
                            Cấm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {actionModal.type === 'suspend' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tạm Khóa Người Dùng</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số Ngày Khóa</label>
              <input
                type="number"
                min="1"
                max="365"
                value={suspendDays}
                onChange={(e) => setSuspendDays(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lý Do</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Nhập lý do tạm khóa..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ type: null })}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleSuspend}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
              >
                Xác Nhận Khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal.type === 'ban' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cấm Người Dùng Vĩnh Viễn</h3>
            <p className="text-gray-600 mb-6">Bạn chắc chắn muốn cấm người dùng này vĩnh viễn không? Hành động này không thể hoàn tác.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ type: null })}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleBan}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Xác Nhận Cấm
              </button>
            </div>
          </div>
        </div>
      )}

      {actionModal.type === 'role' && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thay Đổi Vai Trò</h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vai Trò Mới</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Người Dùng</option>
                <option value="moderator">Người Kiểm Duyệt</option>
                <option value="admin">Quản Trị Viên</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ type: null })}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleChangeRole}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
