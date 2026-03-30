import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Mật khẩu phải chứa cả chữ cái và số'),
  confirmPassword: z
    .string()
    .min(1, 'Vui lòng xác nhận mật khẩu')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onFormSubmit = async (data: PasswordFormData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await onSubmit(data);
      setSuccessMessage('Đổi mật khẩu thành công!');
      reset();
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-xl font-bold text-gray-900 mb-6'>Đổi mật khẩu</h3>

      {errorMessage && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>
          {successMessage}
        </div>
      )}

      <div className='space-y-4'>
        {/* Current Password */}
        <div>
          <label htmlFor='currentPassword' className='block text-sm font-semibold text-gray-700 mb-2'>
            Mật khẩu hiện tại
          </label>
          <div className='relative'>
            <input
              {...register('currentPassword')}
              type={showPasswords.current ? 'text' : 'password'}
              id='currentPassword'
              placeholder='Nhập mật khẩu hiện tại'
              className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className='absolute right-3 top-2.5 text-gray-600 hover:text-gray-900'
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.currentPassword && (
            <p className='mt-1 text-sm text-red-600'>{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor='newPassword' className='block text-sm font-semibold text-gray-700 mb-2'>
            Mật khẩu mới
          </label>
          <div className='relative'>
            <input
              {...register('newPassword')}
              type={showPasswords.new ? 'text' : 'password'}
              id='newPassword'
              placeholder='Nhập mật khẩu mới'
              className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className='absolute right-3 top-2.5 text-gray-600 hover:text-gray-900'
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.newPassword && (
            <p className='mt-1 text-sm text-red-600'>{errors.newPassword.message}</p>
          )}
          <p className='mt-1 text-xs text-gray-500'>Phải chứa ít nhất một chữ cái và một số</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 mb-2'>
            Xác nhận mật khẩu mới
          </label>
          <div className='relative'>
            <input
              {...register('confirmPassword')}
              type={showPasswords.confirm ? 'text' : 'password'}
              id='confirmPassword'
              placeholder='Nhập lại mật khẩu mới'
              className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className='absolute right-3 top-2.5 text-gray-600 hover:text-gray-900'
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className='flex gap-3 pt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold'
          >
            {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
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

export default ChangePasswordForm;
