import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '../../../types';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không quá 100 ký tự'),
  email: z
    .string()
    .email('Email không hợp lệ')
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm: FC<ProfileFormProps> = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email
    }
  });

  const onFormSubmit = async (data: ProfileFormData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await onSubmit(data);
      setSuccessMessage('Cập nhật thông tin thành công!');
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Cập nhật thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-bold text-gray-900 mb-6'>Chỉnh sửa thông tin</h3>

      {errorMessage && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {errorMessage}
        </div>
      )}      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          {successMessage}
        </div>
      )}
      <div className='space-y-4'>
        {/* Name Field */}
        <div>
          <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-2'>
            Họ và tên
          </label>
          <input
            {...register('name')}
            type='text'
            id='name'
            placeholder='Nhập họ và tên'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={isLoading}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
            Email
          </label>
          <input
            {...register('email')}
            type='email'
            id='email'
            placeholder='Nhập email'
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={isLoading}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
          )}
          <p className='mt-1 text-xs text-gray-500'>Email không thể thay đổi</p>
        </div>

        {/* Form Actions */}
        <div className='flex gap-3 pt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button
            type='button'
            onClick={onCancel}
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
