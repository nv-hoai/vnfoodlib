import express, { Router, Request, Response, NextFunction } from 'express';
import {
  getPendingContributions,
  approveContribution,
  rejectContribution,
  archiveContribution,
  getUserList,
  suspendUser,
  unsuspendUser,
  banUser,
  changeUserRole,
  deleteUser,
  getActivities,
  getDashboardStats,
  sendNotification
} from '../controllers/adminController.js';
import { protect } from '../../auth/middleware/authMiddleware.js';
import User from '../../users/models/Users.js';

const router: Router = express.Router();

// Admin middleware - check if user is admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập'
    });
  }
  next();
};

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// ===== CONTRIBUTION MANAGEMENT =====
router.get('/contributions', getPendingContributions);
router.patch('/contributions/:id/approve', approveContribution);
router.patch('/contributions/:id/reject', rejectContribution);
router.delete('/contributions/:id', archiveContribution);

// ===== USER MANAGEMENT =====
router.get('/users', getUserList);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/activate', unsuspendUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

// ===== ACTIVITY & AUDIT =====
router.get('/activities', getActivities);

// ===== DASHBOARD =====
router.get('/stats', getDashboardStats);

// ===== NOTIFICATIONS =====
router.post('/notifications/send', sendNotification);

export default router;
