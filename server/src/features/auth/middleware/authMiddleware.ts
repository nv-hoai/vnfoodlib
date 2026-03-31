import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken } from "../../../utils/jwt.js";
import User, { IUser } from "../../users/models/Users.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục',
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc người dùng không tồn tại',
      });
    }

    if (!user.isActive || user.status === 'banned') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã khóa hoặc bị cấm'
      });
    }

    // Auto-unsuspend if suspension period has passed
    if (user.status === 'suspended' && user.suspendedUntil && new Date() > user.suspendedUntil) {
      user.status = 'active';
      user.suspendedUntil = undefined;
      await user.save();
    }

    // Check if currently suspended
    if (user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: `Tài khoản của bạn đã bị khóa tạm thời. Hạn khóa: ${user.suspendedUntil?.toLocaleDateString('vi-VN')}`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Xác thực thất bại';
    return res.status(401).json({
      success: false,
      message: errorMessage
    });
  }
};

export const protectRefresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không được cung cấp',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc người dùng không tồn tại',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản của bạn đã khóa'
      });
    }

    if (decoded.version !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token đã bị thu hồi'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Xác thực thất bại';
    return res.status(401).json({
      success: false,
      message: errorMessage
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập vào tài nguyên này'
      });
    }
    next();
  };
};