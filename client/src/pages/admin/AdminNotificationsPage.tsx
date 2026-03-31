import React, { FC, useState } from 'react';
import { useSendNotificationMutation, useGetUserListQuery } from '../../features/admin/api/adminApi';

type NotificationType = 'system' | 'contribution' | 'admin' | 'achievement';

interface FormData {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  sendTo: 'all' | 'specific';
  selectedUsers: string[];
}

const AdminNotificationsPage: FC = () => {
  const { data: usersData } = useGetUserListQuery({});
  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const [formData, setFormData] = useState<FormData>({
    type: 'admin',
    title: '',
    message: '',
    link: '',
    sendTo: 'all',
    selectedUsers: []
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const users = usersData?.data?.users || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Vui lòng nhập nội dung thông báo');
      return;
    }
    if (formData.sendTo === 'specific' && formData.selectedUsers.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một người dùng');
      return;
    }

    try {
      await sendNotification({
        type: formData.type,
        title: formData.title,
        message: formData.message,
        link: formData.link || undefined,
        targetUsers: formData.sendTo === 'specific' ? formData.selectedUsers : undefined
      }).unwrap();

      setSuccessMessage('Gửi thông báo thành công!');
      setFormData({
        type: 'admin',
        title: '',
        message: '',
        link: '',
        sendTo: 'all',
        selectedUsers: []
      });
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message || 'Lỗi khi gửi thông báo'
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className={`${formData.sendTo === 'specific' ? 'lg:col-span-2' : 'lg:col-start-2 lg:col-span-3'}`}>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Tạo Thông Báo Mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Messages */}
              {successMessage && (
                <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Loại Thông Báo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition bg-white text-gray-900"
                >
                  <option value="system">🔔 Hệ thống</option>
                  <option value="admin">⚙️ Admin</option>
                  <option value="contribution">📝 Đóng góp</option>
                  <option value="achievement">🏆 Thành tựu</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Tiêu Đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Nội Dung
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung thông báo..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition resize-none"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Liên Kết (Tùy Chọn)
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="/path/to/page"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>

              {/* Send To */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Gửi Đến
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition" style={{borderColor: formData.sendTo === 'all' ? '#f97316' : '#e5e7eb', backgroundColor: formData.sendTo === 'all' ? '#fff7ed' : 'transparent'}}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="all"
                      checked={formData.sendTo === 'all'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Tất cả người dùng</p>
                      <p className="text-xs text-gray-600">Gửi đến tất cả người dùng hoạt động</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition" style={{borderColor: formData.sendTo === 'specific' ? '#f97316' : '#e5e7eb', backgroundColor: formData.sendTo === 'specific' ? '#fff7ed' : 'transparent'}}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="specific"
                      checked={formData.sendTo === 'specific'}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Người dùng cụ thể</p>
                      <p className="text-xs text-gray-600">Chọn người dùng từ danh sách</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2" />
                    </svg>
                    Gửi Thông Báo
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* User Selection */}
        {formData.sendTo === 'specific' && (
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200 h-full">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6.5 20c0-.6.447-1.012 1.938-1.516A6.002 6.002 0 0015 13c.801 0 1.566.107 2.295.308" />
                </svg>
                Chọn Người Dùng
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Đã chọn: <span className="font-semibold text-orange-600">{formData.selectedUsers.length}</span> / <span className="font-semibold">{users.length}</span> người dùng
              </p>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 6a3 3 0 11-6 0 3 3 0 016 0zM6.5 20c0-.6.447-1.012 1.938-1.516A6.002 6.002 0 0115 13c.801 0 1.566.107 2.295.308" />
                    </svg>
                    <p className="text-gray-600">Không có người dùng</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <label
                      key={user._id}
                      className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                        formData.selectedUsers.includes(user._id)
                          ? 'bg-orange-50 border-orange-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedUsers.includes(user._id)}
                        onChange={() => handleUserToggle(user._id)}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : user.role === 'moderator'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role === 'admin'
                          ? 'Admin'
                          : user.role === 'moderator'
                            ? 'Kiểm Duyệt'
                            : 'Người Dùng'}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default AdminNotificationsPage;
