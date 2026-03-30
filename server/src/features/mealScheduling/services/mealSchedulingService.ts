import MealSchedule, { IMealSchedule } from '../models/MealSchedule.js';
import AppError from '../../../utils/appError.js';
import mongoose from 'mongoose';

class MealSchedulingService {
  async createMealSchedule(
    userId: string,
    date: Date,
    meals: any,
    notes?: string
  ): Promise<IMealSchedule> {
    try {
      const mealSchedule = await MealSchedule.create({
        userId: new mongoose.Types.ObjectId(userId),
        date,
        meals,
        notes
      });
      return mealSchedule;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Meal schedule for this date already exists', 400);
      }
      throw error;
    }
  }

  async getMealSchedulesByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IMealSchedule[]> {
    const schedules = await MealSchedule.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    return schedules;
  }

  async getMealScheduleByDate(
    userId: string,
    date: Date
  ): Promise<IMealSchedule | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const schedule = await MealSchedule.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    return schedule;
  }

  async updateMealSchedule(
    scheduleId: string,
    userId: string,
    updateData: Partial<IMealSchedule>
  ): Promise<IMealSchedule> {
    const schedule = await MealSchedule.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(scheduleId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      throw new AppError('Meal schedule not found', 404);
    }

    return schedule;
  }

  async deleteMealSchedule(
    scheduleId: string,
    userId: string
  ): Promise<void> {
    const schedule = await MealSchedule.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(scheduleId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!schedule) {
      throw new AppError('Meal schedule not found', 404);
    }
  }

  async getMealSchedulesForMonth(
    userId: string,
    year: number,
    month: number
  ): Promise<IMealSchedule[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.getMealSchedulesByDateRange(userId, startDate, endDate);
  }
}

export default new MealSchedulingService();
