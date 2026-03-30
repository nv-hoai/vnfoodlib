import { Response } from 'express';
import * as AuthService from '../services/authService.js';
import { catchAsync } from '../../../utils/catchAsync.js';

const cookieOptions: any = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  maxAge: (parseInt(process.env.REFRESH_TOKEN_EXPIRE || '0') * 1000) || undefined
};

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const { user, accessToken, refreshToken } = await AuthService.register(name, email, password);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'Đăng kí tài khoản thành công',
    data: {
      user,
      accessToken
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await AuthService.login(email, password);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      user,
      accessToken
    }
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  
  const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Làm mới token thành công',
    data: {
      accessToken
    }
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie('refreshToken', cookieOptions);
  return res.status(200).json({
    success: true,
      message: 'Đăng xuất thành công'
    });
});

