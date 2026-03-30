import * as UserService from '../services/userService.js';
import { catchAsync } from '../../../utils/catchAsync.js';

const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: (parseInt(process.env.REFRESH_TOKEN_EXPIRE || '0') * 1000) || undefined
};

export const getMe = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: 'Lấy thông tin người dùng thành công',
    data: {
      user: req.user
    }
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const {name, email} = req.body;
  const userId = req.user?._id?.toString();

  const user = await UserService.updateProfile(userId as string, name, email);

  return res.status(200).json({
    success: true,
    message: 'Cập nhật thông tin người dùng thành công',
    data: {
      user
    }
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const { accessToken, refreshToken } = await UserService.changePassword(req.user?._id?.toString() as string, currentPassword, newPassword);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: 'Đổi mật khẩu thành công',
    data: {
      accessToken
    }
  });
});