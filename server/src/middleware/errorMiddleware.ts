import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.js';

interface ErrorResponse {
  message: string;
  statusCode?: number;
}

const ErrorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction): Response => {
  let error: ErrorResponse = { message: err.message };
  let statusCode = 500;

  // Log operational errors as info, programming errors as error
  if ((err as any).isOperational) {
    console.warn(`[${(err as any).status}] ${err.message}`);
  } else {
    console.error(err);
  }

  // Handle AppError (operational)
  if ((err as any).isOperational) {
    const appErr = err as AppError;
    return res.status(appErr.statusCode).json({
      success: false,
      message: appErr.message
    });
  }

  if (err.name === 'CastError') {
    const message = 'Không tìm thấy tài nguyên';
    error = { message, statusCode: 404 };
  }

  if ((err as any).code === 11000) {
    const filed = Object.keys((err as any).keyPattern)[0];
    const message = `${filed} đã tồn tại`;
    error = { message, statusCode: 400 };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Token không hợp lệ';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token đã hết hạn';
    error = { message, statusCode: 401 };
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Lỗi máy chủ'
  });
};

export default ErrorHandler;