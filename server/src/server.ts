import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

//import database connection
import connectDB from './config/db.js';

//import routes
import authRoutes from './features/auth/routes/authRoutes.js';
import userRoutes from './features/users/routes/userRoutes.js';
import mealSchedulingRoutes from './features/mealScheduling/routes/mealSchedulingRoutes.js';
import collectionsRoutes from './features/collections/routes/collectionsRoutes.js';
import foodRoutes from './features/foods/routes/foodRoutes.js';
import contributionRoutes from './features/contributions/routes/contributionRoutes.js';
import adminRoutes from './features/admin/routes/adminRoutes.js';
import notificationRoutes from './features/notifications/routes/notificationRoutes.js';

//import error middleware
import errorHandler from './middleware/errorMiddleware.js';

connectDB();

const app = express();

//Cookie parser middleware
app.use(cookieParser());

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

//Serve static files (uploads)
app.use('/uploads', express.static('public/uploads'));

//Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meal-schedules', mealSchedulingRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

//Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Máy chủ đang hoạt động',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

//Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint không tồn tại',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy ở chế độ ${process.env.NODE_ENV} trên cổng ${PORT}`);
});

process.on('unhandledRejection', (reason: any) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  console.error(`Error: ${errorMessage}`);
  mongoose.connection.close();
  process.exit(1);
});

