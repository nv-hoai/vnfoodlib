import React, { FC } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserInfoCardProps {
  user: User;
  onEdit?: () => void;
}

const UserInfoCard: FC<UserInfoCardProps> = ({ user, onEdit }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold'>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>{user.name}</h2>
            <p className='text-gray-600'>{user.email}</p>
            <span className='inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'>
              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </span>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      <div className='mt-6 pt-6 border-t border-gray-200'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600 font-semibold'>Trạng thái</p>
            <p className='mt-1 text-lg'>
              {user.isActive ? (
                <span className='text-green-600 font-semibold'>Hoạt động</span>
              ) : (
                <span className='text-red-600 font-semibold'>Bị khóa</span>
              )}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 font-semibold'>Vai trò</p>
            <p className='mt-1 text-lg text-gray-900 capitalize'>
              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 font-semibold'>Ngày tạo</p>
            <p className='mt-1 text-lg text-gray-900'>{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600 font-semibold'>Cập nhật lần cuối</p>
            <p className='mt-1 text-lg text-gray-900'>{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
