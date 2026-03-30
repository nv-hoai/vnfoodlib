import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserInfoCard from '../features/users/components/UserInfoCard';
import ProfileForm from '../features/users/components/ProfileForm';
import ChangePasswordForm from '../features/users/components/ChangePasswordForm';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../features/users';
import type { RootState } from '../app/store';

const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Get user from Redux
  const user = useSelector((state: RootState) => state.user);

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPasswordLoading }] = useChangePasswordMutation();

  // If user is not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEditClick = () => {
    setIsEditingMode(true);
  };

  const handleCancel = () => {
    setIsEditingMode(false);
  };

  const handleFormSubmit = async (data: { name: string; email: string }) => {
    try {
      await updateProfile({
        name: data.name,
        email: data.email
      }).unwrap();
      setIsEditingMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }).unwrap();
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Hồ sơ của tôi</h1>

        <div className='space-y-6'>
          {!isEditingMode ? (
            <UserInfoCard user={user} onEdit={handleEditClick} />
          ) : (
            <ProfileForm
              user={user}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isLoading={isUpdatingProfile}
            />
          )}

          {/* Password change section */}
          <div className='mt-8 pt-8 border-t border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Bảo mật</h2>
            {!isChangingPassword ? (
              <div className='bg-white rounded-lg shadow-md p-6'>
                <p className='text-gray-600 mb-4'>
                  Đổi mật khẩu của bạn để bảo vệ tài khoản
                </p>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold'
                >
                  Đổi mật khẩu
                </button>
              </div>
            ) : (
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                onCancel={() => setIsChangingPassword(false)}
                isLoading={isChangingPasswordLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
