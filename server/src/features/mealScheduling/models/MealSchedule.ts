import mongoose, { Document, Schema } from 'mongoose';

export interface IMealSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mealScheduleSchema = new Schema<IMealSchedule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Meal schedule must belong to a user'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true
    },
    meals: {
      breakfast: String,
      lunch: String,
      dinner: String,
      snacks: String
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Compound index for user and date
mealScheduleSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IMealSchedule>('MealSchedule', mealScheduleSchema);
