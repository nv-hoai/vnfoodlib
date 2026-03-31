import { z } from 'zod';

export const emailSchema = z.email('Vui lòng nhập email hợp lệ')
  .min(1, 'Vui lòng nhập email')
  .toLowerCase()
  .trim();

export const passwordSchema = z.string()
  .min(1, 'Vui lòng nhập mật khẩu')
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
  .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, 'Mật khẩu phải chứa ít nhất một chữ cái và một số');

export const nameSchema = z.string()
  .min(1, 'Vui lòng nhập họ và tên')
  .min(2, 'Họ và tên phải có từ 2 đến 100 ký tự')
  .max(100, 'Họ và tên phải có từ 2 đến 100 ký tự')
  .trim();

export const confirmPasswordSchema = z.string()
  .min(1, 'Vui lòng xác nhận mật khẩu');

export const acceptTermsSchema = z.boolean().refine(value => value === true, {
  message: 'Vui lòng đồng ý với điều khoản sử dụng'
})