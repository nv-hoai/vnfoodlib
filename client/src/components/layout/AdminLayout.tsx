import React, { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children, title, description }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quyền Acccess Bị Từ Chối</h1>
        <p className="text-gray-600 mb-6">Bạn không có quyền truy cập trang quản trị này.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Quay Lại Trang Chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Admin Sidebar Navigation */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 pt-4 sidebar-nav flex flex-col">
          <div className="flex-1 px-4 space-y-2 overflow-y-auto">
            <div className="px-2 py-2 mb-2">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Admin Panel</h2>
            </div>
            <NavLink to="/admin" label="Dashboard" />
            <NavLink to="/admin/contributions" label="Duyệt Đóng Góp" />
            <NavLink to="/admin/users" label="Quản Lý Người Dùng" />
            <NavLink to="/admin/notifications" label="Gửi Thông Báo" />
            <NavLink to="/admin/activities" label="Nhật Ký Hoạt Động" />
          </div>

          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-left font-medium text-sm"
            >
              Quay Lại Trang Chủ
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Admin Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <NavLinkMobile to="/admin" label="Dashboard" />
          <NavLinkMobile to="/admin/contributions" label="Đóng Góp" />
          <NavLinkMobile to="/admin/users" label="Người Dùng" />
          <NavLinkMobile to="/admin/activities" label="Hoạt Động" />
        </div>
      </div>

      {/* Content */}
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon?: string;
}

const NavLink: FC<NavLinkProps> = ({ to, label, icon }) => {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
        isActive ? 'bg-orange-100 text-orange-900 border-l-4 border-orange-500' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

const NavLinkMobile: FC<{ to: string; label: string }> = ({ to, label }) => {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition ${
        isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

export default AdminLayout;
