import { Request, Response, NextFunction } from 'express';
import mealSchedulingService from '../services/mealSchedulingService.js';
import { catchAsync } from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

export const createMealSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date, meals, notes } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    const schedule = await mealSchedulingService.createMealSchedule(
      userId,
      new Date(date),
      meals,
      notes
    );

    res.status(201).json({
      status: 'success',
      data: {
        schedule
      }
    });
  }
);

export const getMealSchedulesByDateRange = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!startDate || !endDate) {
      return next(new AppError('Start date and end date are required', 400));
    }

    const schedules = await mealSchedulingService.getMealSchedulesByDateRange(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json({
      status: 'success',
      data: {
        schedules
      }
    });
  }
);

export const getMealScheduleByDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!date) {
      return next(new AppError('Date is required', 400));
    }

    const schedule = await mealSchedulingService.getMealScheduleByDate(
      userId,
      new Date(date as string)
    );

    res.status(200).json({
      status: 'success',
      data: {
        schedule
      }
    });
  }
);

export const getMealSchedulesForMonth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { year, month } = req.query;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!year || !month) {
      return next(new AppError('Year and month are required', 400));
    }

    const schedules = await mealSchedulingService.getMealSchedulesForMonth(
      userId as string,
      parseInt(year as string),
      parseInt(month as string)
    );

    res.status(200).json({
      status: 'success',
      data: {
        schedules
      }
    });
  }
);

export const updateMealSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    const schedule = await mealSchedulingService.updateMealSchedule(
      id,
      userId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: {
        schedule
      }
    });
  }
);

export const deleteMealSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    await mealSchedulingService.deleteMealSchedule(id, userId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);
