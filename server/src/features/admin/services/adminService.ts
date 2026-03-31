import User from '../../users/models/Users.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../../notifications/models/Notification.js';
import Contribution from '../../contributions/models/Contribution.js';
import Food from '../../foods/models/Food.js';
import AppError from '../../../utils/appError.js';
import mongoose from 'mongoose';

/**
 * ADMIN: Suspend user account
 */
export const suspendUser = async (
  userId: string,
  adminId: string,
  durationDays: number = 7,
  reason: string
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('ID người dùng không hợp lệ', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Không thể khóa tài khoản admin', 400);
  }

  const now = new Date();
  const suspendedUntil = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  user.status = 'suspended';
  user.suspendedUntil = suspendedUntil;
  user.suspendReason = reason;
  await user.save();

  // Log activity
  await ActivityLog.create({
    action: 'suspended_user',
    actor: adminId,
    target: {
      type: 'user',
      id: user._id
    },
    reason,
    details: `Khóa ${durationDays} ngày`
  });

  // Send notification
  await Notification.create({
    userId: user._id,
    type: 'user_suspended',
    title: 'Tài khoản bị khóa',
    message: `Tài khoản của bạn bị khóa tạm thời đến ${suspendedUntil.toLocaleDateString('vi-VN')}. Lý do: ${reason}`,
    relatedTo: {
      type: 'user',
      id: user._id
    }
  });

  return user;
};

/**
 * ADMIN: Unsuspend user account
 */
export const unsuspendUser = async (adminId: string, userId: string): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('ID người dùng không hợp lệ', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  user.status = 'active';
  user.suspendedUntil = undefined;
  user.suspendReason = undefined;
  await user.save();

  // Log activity
  await ActivityLog.create({
    action: 'unsuspended_user',
    actor: adminId,
    target: {
      type: 'user',
      id: user._id
    }
  });

  // Send notification
  await Notification.create({
    userId: user._id,
    type: 'user_unsuspended',
    title: 'Tài khoản được kích hoạt',
    message: 'Tài khoản của bạn đã được kích hoạt trở lại.'
  });

  return user;
};

/**
 * ADMIN: Ban user permanently
 */
export const banUser = async (
  userId: string,
  adminId: string,
  reason: string
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('ID người dùng không hợp lệ', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Không thể cấm tài khoản admin', 400);
  }

  user.status = 'banned';
  user.suspendReason = reason;
  user.isActive = false;
  await user.save();

  // Log activity
  await ActivityLog.create({
    action: 'banned_user',
    actor: adminId,
    target: {
      type: 'user',
      id: user._id
    },
    reason
  });

  // Send notification
  await Notification.create({
    userId: user._id,
    type: 'user_suspended',
    title: 'Tài khoản bị cấm',
    message: `Tài khoản của bạn bị cấm vĩnh viễn. Lý do: ${reason}`
  });

  return user;
};

/**
 * ADMIN: Change user role
 */
export const changeUserRole = async (
  userId: string,
  adminId: string,
  newRole: 'user' | 'admin' | 'moderator'
): Promise<any> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('ID người dùng không hợp lệ', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  const oldRole = user.role;
  user.role = newRole;
  await user.save();

  // Log activity
  await ActivityLog.create({
    action: 'changed_user_role',
    actor: adminId,
    target: {
      type: 'user',
      id: user._id
    },
    changes: {
      role: {
        oldValue: oldRole,
        newValue: newRole
      }
    }
  });

  return user;
};

/**
 * Get user list (with pagination and filtering)
 */
export const getUserList = async (
  page: number = 1,
  limit: number = 20,
  filter?: { status?: string; role?: string; search?: string }
): Promise<{ users: any[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filter?.status) query.status = filter.status;
  if (filter?.role) query.role = filter.role;

  if (filter?.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { email: { $regex: filter.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    users,
    total,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Delete user account (soft delete by banning)
 */
export const deleteUser = async (userId: string, adminId: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('ID người dùng không hợp lệ', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Không thể xóa tài khoản admin', 400);
  }

  user.status = 'banned';
  user.isActive = false;
  user.suspendReason = 'Tài khoản bị xóa bởi admin';
  await user.save();

  // Log activity
  await ActivityLog.create({
    action: 'banned_user',
    actor: adminId,
    target: {
      type: 'user',
      id: user._id
    },
    reason: 'Xóa tài khoản'
  });
};

/**
 * Get activities for audit trail
 */
export const getActivities = async (
  page: number = 1,
  limit: number = 50,
  filter?: { action?: string; actor?: string }
): Promise<{ activities: any[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filter?.action) query.action = filter.action;
  if (filter?.actor) query.actor = filter.actor;

  const activities = await ActivityLog.find(query)
    .populate('actor', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ActivityLog.countDocuments(query);

  return {
    activities,
    total,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

  // User stats
  const totalUsers = await User.countDocuments({ role: 'user' });
  const activeUsers = await User.countDocuments({ status: 'active', role: 'user' });
  const suspendedUsers = await User.countDocuments({ status: 'suspended', role: 'user' });
  const bannedUsers = await User.countDocuments({ status: 'banned', role: 'user' });

  // Month/Year stats
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: firstDayOfMonth },
    role: 'user'
  });
  const newUsersThisYear = await User.countDocuments({
    createdAt: { $gte: firstDayOfYear },
    role: 'user'
  });

  // Food stats
  const totalFoods = await Food.countDocuments();
  const newFoodsThisMonth = await Food.countDocuments({
    createdAt: { $gte: firstDayOfMonth }
  });

  // Contribution stats
  const totalContributions = await Contribution.countDocuments();
  const pendingContributions = await Contribution.countDocuments({ status: 'pending' });
  const approvedContributions = await Contribution.countDocuments({ status: 'approved' });
  const rejectedContributions = await Contribution.countDocuments({ status: 'rejected' });

  // Approval rate
  const approvalRate = totalContributions > 0 
    ? ((approvedContributions / totalContributions) * 100).toFixed(2)
    : '0';

  // Recent activity
  const recentActivity = await ActivityLog.find()
    .populate('actor', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      banned: bannedUsers,
      newThisMonth: newUsersThisMonth,
      newThisYear: newUsersThisYear
    },
    foods: {
      total: totalFoods,
      newThisMonth: newFoodsThisMonth
    },
    contributions: {
      total: totalContributions,
      pending: pendingContributions,
      approved: approvedContributions,
      rejected: rejectedContributions,
      approvalRate
    },
    recentActivity
  };
};

/**
 * ADMIN: Send notification to users
 */
export const sendNotification = async (
  type: 'system' | 'contribution' | 'admin' | 'achievement',
  title: string,
  message: string,
  link?: string,
  targetUsers?: string[]
): Promise<{ sentCount: number; failedCount: number }> => {
  if (!title?.trim()) {
    throw new AppError('Vui lòng cung cấp tiêu đề', 400);
  }
  if (!message?.trim()) {
    throw new AppError('Vui lòng cung cấp nội dung thông báo', 400);
  }

  let userIds: mongoose.Types.ObjectId[] = [];

  if (targetUsers && targetUsers.length > 0) {
    // Send to specific users
    for (const userId of targetUsers) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError(`ID người dùng không hợp lệ: ${userId}`, 400);
      }
    }
    userIds = targetUsers.map(id => new mongoose.Types.ObjectId(id));
  } else {
    // Send to all active users
    const users = await User.find({ status: 'active' }, '_id');
    userIds = users.map(u => u._id);
  }

  if (userIds.length === 0) {
    throw new AppError('Không có người dùng để gửi thông báo', 400);
  }

  try {
    // Create notifications for all target users
    const notifications = userIds.map(userId => ({
      userId,
      type,
      title,
      message,
      actionUrl: link,
      relatedTo: undefined
    }));

    await Notification.insertMany(notifications);

    return {
      sentCount: notifications.length,
      failedCount: 0
    };
  } catch (error) {
    throw new AppError('Lỗi khi gửi thông báo', 500);
  }
};
