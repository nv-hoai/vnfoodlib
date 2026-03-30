import express from 'express';
import { body } from 'express-validator';
import { protect } from '../../auth/middleware/authMiddleware.js';
import { validate } from '../../../middleware/validate.js';
import { 
  getMe, 
  updateProfile, 
  changePassword 
} from '../controllers/userController.js';

const router = express.Router();

const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Họ và tên phải có từ 2 đến 100 ký tự'),
  body('email')
    .optional()
    .isEmail().withMessage('Vui lòng nhập email hợp lệ')
    .normalizeEmail()
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
  body('newPassword')
    .notEmpty().withMessage('Vui lòng nhập mật khẩu mới')
    .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).withMessage('Mật khẩu mới phải chứa ít nhất một chữ cái và một số')
];

//protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfileValidation, validate, updateProfile);
router.put('/change-password', changePasswordValidation, validate, changePassword);

export default router;