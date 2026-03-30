import AppError from '../../../utils/appError.js';
import User, { IUser } from "../../users/models/Users.js";
import { generateTokenPair, verifyRefreshToken } from "../../../utils/jwt.js";

interface AuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new AppError('Email đã được sử dụng, vui lòng chọn email khác', 400);
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const { accessToken, refreshToken } = generateTokenPair(user);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user, accessToken, refreshToken };
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  if (!email || !password) {
    throw new AppError('Vui lòng cung cấp đầy đủ thông tin đăng nhập', 400);
  }

  const user = await User.findOne({email}).select('+password');
  if (!user) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  if (!user.isActive) {
    throw new AppError('Tài khoản của bạn đã khóa', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  const { accessToken, refreshToken } = generateTokenPair(user);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  const userResponse = user.toObject() as any;
  delete userResponse.password;
  
  return { user: userResponse, accessToken, refreshToken };
};

export const refresh = async (refreshToken: string): Promise<RefreshResponse> => {
  if (!refreshToken) {
    throw new AppError('Refresh token không được cung cấp', 400);
  }

  const decoded = verifyRefreshToken(refreshToken);
  
  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw new AppError('User không tồn tại hoặc đã bị khóa', 401);
  }

  if (decoded.version !== user.tokenVersion) {
    throw new AppError('Refresh token đã bị thu hồi', 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);
  
  return { accessToken, refreshToken: newRefreshToken };
};

