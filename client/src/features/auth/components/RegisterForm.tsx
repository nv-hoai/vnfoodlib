import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../api/authApi';
import { registerSchema, type RegisterFormData } from '../validation';
import Button from '../../../shared/components/Button';

const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Only send name, email, and password to backend
      const { confirmPassword, acceptTerms, ...registerData } = data;
      await register(registerData).unwrap();
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error?.data?.message || 'Đăng ký thất bại'
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Đăng ký</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Họ và tên</label>
          <input
            type="text"
            {...registerField('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập họ và tên"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            {...registerField('email')}
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
            {...registerField('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự, có chữ và số)"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Xác nhận mật khẩu</label>
          <input
            type="password"
            {...registerField('confirmPassword')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Xác nhận mật khẩu"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Accept Terms */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="acceptTerms"
            {...registerField('acceptTerms')}
            className="w-4 h-4 border border-gray-300 rounded focus:outline-none"
          />
          <label htmlFor="acceptTerms" className="ml-2 text-gray-700 text-sm">
            Tôi đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              điều khoản dịch vụ
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
        )}

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
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Button>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Đã có tài khoản?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
