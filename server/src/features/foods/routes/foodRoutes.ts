import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { body } from 'express-validator';
import { protect } from '../../auth/middleware/authMiddleware.js';
import { validate } from '../../../middleware/validate.js';
import * as FoodController from '../controllers/foodController.js';

const router = express.Router();

// Setup multer for food image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(process.cwd(), 'public', 'uploads', 'foods'));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chi chap nhan file anh (jpg, png, webp)'));
    }
  }
});

// Validation schemas
const createFoodValidation = [
  body('name').trim().notEmpty().withMessage('Vui long nhap ten mon an').isLength({ max: 200 }),
  body('intro').trim().notEmpty().withMessage('Vui long nhap gioi thieu').isLength({ max: 2000 }),
  body('ingredients').trim().notEmpty().withMessage('Vui long nhap nguyen lieu').isLength({ max: 5000 }),
  body('cooking').trim().notEmpty().withMessage('Vui long nhap cach nau').isLength({ max: 5000 }),
  body('tags').optional().isObject().withMessage('Tags phai la object')
];

// Public routes
router.get('/ranking', FoodController.getRanking);
router.get('/search', FoodController.searchFoods);
router.get('/filter', FoodController.filterFoods);
router.get('/', FoodController.getAllFoods);
router.get('/:id', FoodController.getFoodById);

// Protected routes
router.use(protect);

router.post('/', upload.single('image'), createFoodValidation, validate, FoodController.createFood);
router.put('/:id', upload.single('image'), FoodController.updateFood);
router.delete('/:id', FoodController.deleteFood);

// Like/Unlike
router.post('/:foodId/like', FoodController.likeFood);
router.delete('/:foodId/like', FoodController.unlikeFood);
router.get('/:foodId/like/check', FoodController.checkIfLiked);

// Recommend
router.post('/:foodId/recommend', FoodController.recommendFood);

// Collections
router.post('/:foodId/collections/add', [
  body('collectionId').notEmpty().withMessage('Vui long cung cap collection id')
], validate, FoodController.addToCollection);

router.post('/:foodId/collections/remove', [
  body('collectionId').notEmpty().withMessage('Vui long cung cap collection id')
], validate, FoodController.removeFromCollection);

export default router;
