import express, { Router } from 'express';
import {
  createMealSchedule,
  getMealSchedulesByDateRange,
  getMealScheduleByDate,
  getMealSchedulesForMonth,
  updateMealSchedule,
  deleteMealSchedule
} from '../controllers/mealSchedulingController.js';
import { protect } from '../../auth/middleware/authMiddleware.js';

const router: Router = express.Router();

// Protect all routes
router.use(protect);

// Create meal schedule
router.post('/', createMealSchedule);

// Get meal schedules by date range
router.get('/range', getMealSchedulesByDateRange);

// Get meal schedules for month
router.get('/month', getMealSchedulesForMonth);

// Get meal schedule by specific date
router.get('/date', getMealScheduleByDate);

// Update meal schedule
router.patch('/:id', updateMealSchedule);

// Delete meal schedule
router.delete('/:id', deleteMealSchedule);

export default router;
