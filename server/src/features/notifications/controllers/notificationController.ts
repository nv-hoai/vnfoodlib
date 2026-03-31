import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification.js';
import { catchAsync } from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

/**
 * Get user's notifications
 * GET /api/notifications?page=1&limit=20
 */
export const getNotifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments({ userId });

  return res.status(200).json({
    success: true,
    message: 'Fetched notifications successfully',
    data: {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return res.status(200).json({
    success: true,
    message: 'Fetched unread count successfully',
    data: {
      unreadCount
    }
  });
});

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
export const markAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const notification = await Notification.findOne({ _id: id, userId });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return res.status(200).json({
    success: true,
    message: 'Marked as read successfully',
    data: { notification }
  });
});

/**
 * Mark all as read
 * PATCH /api/notifications/read-all
 */
export const markAllAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  return res.status(200).json({
    success: true,
    message: 'Marked all as read successfully'
  });
});

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const notification = await Notification.findOneAndDelete({ _id: id, userId });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Deleted notification successfully'
  });
});

/**
 * Clear all notifications
 * DELETE /api/notifications
 */
export const clearAllNotifications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  await Notification.deleteMany({ userId });

  return res.status(200).json({
    success: true,
    message: 'Cleared all notifications successfully'
  });
});
