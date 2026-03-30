import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/authApi';
import { loginSchema, type LoginFormData } from '../validation';
import Button from '../../../shared/components/Button';

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error?.data?.message || 'Đăng nhập thất bại'
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Đăng nhập</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Mật khẩu</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Root error */}
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.root.message}
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2 font-semibold text-lg mt-6"
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      {/* Register link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Đăng ký
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;