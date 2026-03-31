import { Request, Response, NextFunction } from 'express';
import * as ContributionService from '../../contributions/services/contributionService.js';
import * as AdminService from '../services/adminService.js';
import { catchAsync } from '../../../utils/catchAsync.js';

/**
 * Get all pending contributions
 * GET /api/admin/contributions?type=new_food
 */
export const getPendingContributions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const type = req.query.type as 'new_food' | 'edit_food' | undefined;

  const { contributions, total, pages } = await ContributionService.getPendingContributions(page, limit, type);

  return res.status(200).json({
    success: true,
    message: 'Lấy danh sách đóng góp chờ duyệt thành công',
    data: {
      contributions,
      pagination: { page, limit, total, pages }
    }
  });
});

/**
 * Approve contribution
 * PATCH /api/admin/contributions/:id/approve
 */
export const approveContribution = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { notes } = req.body;
  const adminId = req.user?._id?.toString();

  const contribution = await ContributionService.approveContribution(id, adminId as string, notes);

  return res.status(200).json({
    success: true,
    message: 'Phê duyệt đóng góp thành công',
    data: { contribution }
  });
});

/**
 * Reject contribution
 * PATCH /api/admin/contributions/:id/reject
 */
export const rejectContribution = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;
  const adminId = req.user?._id?.toString();

  if (!reason?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp lý do từ chối'
    });
  }

  const contribution = await ContributionService.rejectContribution(id, adminId as string, reason);

  return res.status(200).json({
    success: true,
    message: 'Từ chối đóng góp thành công',
    data: { contribution }
  });
});

/**
 * Archive contribution
 * DELETE /api/admin/contributions/:id
 */
export const archiveContribution = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const adminId = req.user?._id?.toString();

  const contribution = await ContributionService.archiveContribution(id, adminId as string);

  return res.status(200).json({
    success: true,
    message: 'Lưu trữ đóng góp thành công',
    data: { contribution }
  });
});

/**
 * Get user list
 * GET /api/admin/users?status=active&role=user&search=john
 */
export const getUserList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const { users, total, pages } = await AdminService.getUserList(page, limit, {
    status: req.query.status as string,
    role: req.query.role as string,
    search: req.query.search as string
  });

  return res.status(200).json({
    success: true,
    message: 'Lấy danh sách người dùng thành công',
    data: {
      users,
      pagination: { page, limit, total, pages }
    }
  });
});

/**
 * Suspend user
 * PATCH /api/admin/users/:id/suspend
 */
export const suspendUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { durationDays = 7, reason } = req.body;
  const adminId = req.user?._id?.toString();

  if (!reason?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp lý do khóa tài khoản'
    });
  }

  const user = await AdminService.suspendUser(id, adminId as string, durationDays, reason);

  return res.status(200).json({
    success: true,
    message: 'Khóa tài khoản thành công',
    data: { user }
  });
});

/**
 * Unsuspend/Activate user
 * PATCH /api/admin/users/:id/activate
 */
export const unsuspendUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const adminId = req.user?._id?.toString();

  const user = await AdminService.unsuspendUser(adminId as string, id);

  return res.status(200).json({
    success: true,
    message: 'Kích hoạt tài khoản thành công',
    data: { user }
  });
});

/**
 * Ban user permanently
 * PATCH /api/admin/users/:id/ban
 */
export const banUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;
  const adminId = req.user?._id?.toString();

  if (!reason?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp lý do cấm tài khoản'
    });
  }

  const user = await AdminService.banUser(id, adminId as string, reason);

  return res.status(200).json({
    success: true,
    message: 'Cấm tài khoản thành công',
    data: { user }
  });
});

/**
 * Change user role
 * PATCH /api/admin/users/:id/role
 */
export const changeUserRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { role } = req.body;
  const adminId = req.user?._id?.toString();

  if (!['user', 'admin', 'moderator'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Vai trò không hợp lệ'
    });
  }

  const user = await AdminService.changeUserRole(id, adminId as string, role);

  return res.status(200).json({
    success: true,
    message: 'Thay đổi vai trò thành công',
    data: { user }
  });
});

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const adminId = req.user?._id?.toString();

  await AdminService.deleteUser(id, adminId as string);

  return res.status(200).json({
    success: true,
    message: 'Xóa tài khoản thành công'
  });
});

/**
 * Get activity log
 * GET /api/admin/activities?action=suspended_user
 */
export const getActivities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const { activities, total, pages } = await AdminService.getActivities(page, limit, {
    action: req.query.action as string,
    actor: req.query.actor as string
  });

  return res.status(200).json({
    success: true,
    message: 'Lấy nhật ký hoạt động thành công',
    data: {
      activities,
      pagination: { page, limit, total, pages }
    }
  });
});

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await AdminService.getDashboardStats();

  return res.status(200).json({
    success: true,
    message: 'Lấy thống kê dashboard thành công',
    data: stats
  });
});

/**
 * Send notification to users
 * POST /api/admin/notifications/send
 */
export const sendNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { type, title, message, link, targetUsers } = req.body;

  const result = await AdminService.sendNotification(type, title, message, link, targetUsers);

  return res.status(200).json({
    success: true,
    message: `Gửi thông báo thành công đến ${result.sentCount} người dùng`,
    data: result
  });
});
