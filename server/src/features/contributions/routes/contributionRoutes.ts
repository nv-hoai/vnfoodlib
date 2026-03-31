import express, { Router } from 'express';
import {
  submitNewFood,
  submitFoodEdit,
  getUserContributions,
  getContributionById
} from '../controllers/contributionController.js';
import { protect } from '../../auth/middleware/authMiddleware.js';

const router: Router = express.Router();

// All routes require authentication
router.use(protect);

// Submit new food
router.post('/foods', submitNewFood);

// Submit edit for existing food
router.patch('/foods/:foodId', submitFoodEdit);

// Get user's own contributions
router.get('/my', getUserContributions);

// Get contribution details
router.get('/:id', getContributionById);

export default router;
