import express from 'express';
import { body } from 'express-validator';
import { protect, protectRefresh } from '../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validate.js';
import { 
  register, 
  login,
  refresh,
  logout
} from '../controllers/authController.js';

const router = express.Router();

const registerValidation = [
  body('name')
    .notEmpty().withMessage('Vui lòng nhập họ và tên')
    .isLength({ min: 2, max: 100 }).withMessage('Họ và tên phải có từ 2 đến 100 ký tự'),
  body('email')
    .notEmpty().withMessage('Vui lòng nhập email')
    .isEmail().withMessage('Vui lòng nhập email hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Vui lòng nhập mật khẩu')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).withMessage('Mật khẩu phải chứa ít nhất một chữ cái và một số')
];

const loginValidation = [
  body('email')
    .notEmpty().withMessage('Vui lòng nhập email')
    .isEmail().withMessage('Vui lòng nhập email hợp lệ'),
  body('password')
    .notEmpty().withMessage('Vui lòng nhập mật khẩu')
];

//public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

//refresh token route (protected by refresh token)
router.post('/refresh', protectRefresh, validate, refresh);

//protected routes (protected by access token)
router.use(protect);
router.post('/logout', logout);

export default router;