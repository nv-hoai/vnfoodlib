import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from './components';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';
import { AuthInitializer } from './features/auth/components';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MealSchedulingPage from './pages/MealSchedulingPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import FoodLibraryPage from './pages/FoodLibraryPage';
import FoodDetailPage from './pages/FoodDetailPage';
import MyContributionsPage from './pages/MyContributionsPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminContributionsPage from './pages/admin/AdminContributionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage';

const App: FC = () => {
  return (
    <AuthInitializer>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path='/register' element={<AuthLayout><RegisterPage /></AuthLayout>} />

          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/meal-scheduling' element={<MealSchedulingPage />} />
            <Route path='/collections' element={<CollectionsPage />} />
            <Route path='/collections/:id' element={<CollectionDetailPage />} />
            <Route path='/foods' element={<FoodLibraryPage />} />
            <Route path='/foods/:id' element={<FoodDetailPage />} />
            <Route path='/my-contributions' element={<MyContributionsPage />} />
            <Route path='/notifications' element={<NotificationCenterPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path='/admin' element={<AdminLayout title="Dashboard Quản Trị" description="Tổng quan hệ thống"><AdminDashboardPage /></AdminLayout>} />
          <Route path='/admin/contributions' element={<AdminLayout title="Duyệt Đóng Góp" description="Quản lý và phê duyệt các đóng góp từ người dùng"><AdminContributionsPage /></AdminLayout>} />
          <Route path='/admin/users' element={<AdminLayout title="Quản Lý Người Dùng" description="Quản lý tài khoản, vai trò và quyền hạn"><AdminUsersPage /></AdminLayout>} />
          <Route path='/admin/notifications' element={<AdminLayout title="Gửi Thông Báo" description="Tạo và gửi thông báo đến người dùng"><AdminNotificationsPage /></AdminLayout>} />
          <Route path='/admin/activities' element={<AdminLayout title="Nhật Ký Hoạt Động" description="Theo dõi tất cả các hoạt động quản trị"><AdminActivitiesPage /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthInitializer>
  );
};

export default App;