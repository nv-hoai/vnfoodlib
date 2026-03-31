import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNotificationsQuery, useGetUnreadCountQuery, useMarkAsReadMutation } from '../api/notificationsApi';

const NotificationBell: FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadData } = useGetUnreadCountQuery();
  const { data: notificationsData } = useGetNotificationsQuery({ page: 1, limit: 5 });
  const [markAsRead] = useMarkAsReadMutation();

  const unreadCount = unreadData?.data?.unreadCount || 0;
  const notifications = notificationsData?.data?.notifications || [];

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
    navigate('/notifications');
    setIsOpen(false);
  };

  const getNotificationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      system: 'border-l-blue-500',
      contribution: 'border-l-green-500',
      admin: 'border-l-red-500',
      achievement: 'border-l-yellow-500'
    };
    return colors[type] || 'border-l-gray-500';
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

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        title="Thông báo"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
            <button
              onClick={() => navigate('/notifications')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>Không có thông báo mới</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification._id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-l-4 ${getNotificationTypeColor(
                      notification.type
                    )} ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getNotificationTypeLabel(notification.type)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Tất cả thông báo
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
