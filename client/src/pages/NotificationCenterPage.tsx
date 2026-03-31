import React, { FC, useState } from 'react';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
  INotification
} from '../features/notifications/api/notificationsApi';

const NotificationCenterPage: FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notificationsData, isLoading } = useGetNotificationsQuery({ page, limit });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearAllNotifications] = useClearAllNotificationsMutation();

  const notifications = notificationsData?.data?.notifications || [];
  const pagination = notificationsData?.data?.pagination;

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n: INotification) => !n.read) : notifications;

  const getNotificationTypeColor = (type: string) => {
    const colors: { [key: string]: [string, string] } = {
      system: ['bg-blue-50', 'border-l-blue-500'],
      contribution: ['bg-green-50', 'border-l-green-500'],
      admin: ['bg-red-50', 'border-l-red-500'],
      achievement: ['bg-yellow-50', 'border-l-yellow-500']
    };
    return colors[type] || ['bg-gray-50', 'border-l-gray-500'];
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      system: 'Hệ thống',
      contribution: 'Đóng góp',
      admin: 'Admin',
      achievement: 'Thành tựu'
    };
    return labels[type] || type;
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
      await clearAllNotifications();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông báo</h1>
        <p className="text-gray-600">Quản lý tất cả thông báo của bạn</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chưa đọc
          </button>
        </div>

        <div className="flex gap-2">
          {notifications.some((n: INotification) => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      ) : null}

      {/* Empty State */}
      {!isLoading && filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {!isLoading && filteredNotifications.length > 0 && (
        <div className="space-y-3 mb-8">
          {filteredNotifications.map((notification: INotification) => {
            const [bgColor, borderColor] = getNotificationTypeColor(notification.type);
            return (
              <div
                key={notification._id}
                className={`${bgColor} border-l-4 ${borderColor} rounded-lg p-4 flex items-start justify-between hover:shadow-md transition`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      title="Đánh dấu là đã đọc"
                    >
                      Đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    title="Xóa"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
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
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenterPage;
