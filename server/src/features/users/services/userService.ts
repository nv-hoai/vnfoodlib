import AppError from '../../../utils/appError.js';
import User, { IUser } from "../../users/models/Users.js";
import { generateTokenPair } from "../../../utils/jwt.js";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const updateProfile = async (userId: string, name?: string, email?: string): Promise<IUser> => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404);
  }
  
  if (email && email !== user.email) {
    const existingUser = await User.findOne({email});
    if (existingUser) {
      throw new AppError('Email đã được sử dụng, vui lòng chọn email khác', 400);
    }
    user.email = email;
  }

  if (name) {
    user.name = name;
  }
  
  await user.save();

  return user;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<TokenPair> => {
  const user = await User.findById(userId).select('+password');
  
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404);
  }
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Mật khẩu hiện tại không đúng', 401);
  }

  user.password = newPassword;
  await user.save();

  const { accessToken, refreshToken } = generateTokenPair(user);

  return { accessToken, refreshToken };
};