import * as FoodService from '../services/foodService.js';
import { catchAsync } from '../../../utils/catchAsync.js';
import { Request, Response } from 'express';
import type { Multer } from 'multer';

type MulterRequest = Request & { file?: Express.Multer.File };

export const createFood = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const foodData = req.body;
  
  // Add image URL if file was uploaded
  if (req.file) {
    foodData.image = `/uploads/foods/${req.file.filename}`;
  }

  const food = await FoodService.createFood(foodData);

  return res.status(201).json({
    success: true,
    message: 'Tao mon an thanh cong',
    data: { food }
  });
});

export const getAllFoods = catchAsync(async (req: Request, res: Response, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { foods, total, pages } = await FoodService.getAllFoods(page, limit);

  return res.status(200).json({
    success: true,
    message: 'Lay danh sach mon an thanh cong',
    data: {
      foods,
      pagination: { page, limit, total, pages }
    }
  });
});

export const getFoodById = catchAsync(async (req: Request, res: Response, next) => {
  const { id } = req.params;
  const food = await FoodService.getFoodById(id);

  return res.status(200).json({
    success: true,
    message: 'Lay thong tin mon an thanh cong',
    data: { food }
  });
});

export const searchFoods = catchAsync(async (req: Request, res: Response, next) => {
  const { q } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Vui long cung cap tu khoa tim kiem'
    });
  }

  const { foods, total, pages } = await FoodService.searchFoods(q as string, page, limit);

  return res.status(200).json({
    success: true,
    message: 'Tim kiem mon an thanh cong',
    data: {
      foods,
      pagination: { page, limit, total, pages }
    }
  });
});

export const filterFoods = catchAsync(async (req: Request, res: Response, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const filters = {
    categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
    ingredients: req.query.ingredients ? (req.query.ingredients as string).split(',') : undefined,
    mealTimes: req.query.mealTimes ? (req.query.mealTimes as string).split(',') : undefined,
    cookingMethods: req.query.cookingMethods ? (req.query.cookingMethods as string).split(',') : undefined,
    tastes: req.query.tastes ? (req.query.tastes as string).split(',') : undefined,
    purposes: req.query.purposes ? (req.query.purposes as string).split(',') : undefined,
    diets: req.query.diets ? (req.query.diets as string).split(',') : undefined
  };

  const { foods, total, pages } = await FoodService.filterFoodsByTags(filters, page, limit);

  return res.status(200).json({
    success: true,
    message: 'Loc mon an thanh cong',
    data: {
      foods,
      pagination: { page, limit, total, pages }
    }
  });
});

export const likeFood = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const { foodId } = req.params;
  const userId = req.user?._id?.toString();

  const food = await FoodService.likeFood(foodId, userId as string);

  return res.status(200).json({
    success: true,
    message: 'Thich mon an thanh cong',
    data: { food }
  });
});

export const unlikeFood = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const { foodId } = req.params;
  const userId = req.user?._id?.toString();

  const food = await FoodService.unlikeFood(foodId, userId as string);

  return res.status(200).json({
    success: true,
    message: 'Bo thich mon an thanh cong',
    data: { food }
  });
});

export const recommendFood = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const { foodId } = req.params;
  const userId = req.user?._id?.toString();

  const food = await FoodService.recommendFood(foodId, userId as string);

  return res.status(200).json({
    success: true,
    message: 'De cu mon an thanh cong',
    data: { food }
  });
});

export const checkIfLiked = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const { foodId } = req.params;
  const userId = req.user?._id?.toString();

  const hasLiked = await FoodService.hasUserLiked(foodId, userId as string);

  return res.status(200).json({
    success: true,
    data: { hasLiked }
  });
});

export const getRanking = catchAsync(async (req: Request, res: Response, next) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = (req.query.sortBy as 'likes' | 'recommendations' | 'combined') || 'combined';

  const foods = await FoodService.getFoodRanking(limit, sortBy);

  return res.status(200).json({
    success: true,
    message: 'Lay bang xep hang mon an thanh cong',
    data: { foods }
  });
});

export const updateFood = catchAsync(async (req: MulterRequest, res: Response, next) => {
  const { id } = req.params;
  const updates = req.body;

  // Handle image update if new file uploaded
  if (req.file) {
    updates.image = `/uploads/foods/${req.file.filename}`;
  }

  const food = await FoodService.updateFood(id, updates);

  return res.status(200).json({
    success: true,
    message: 'Cap nhat mon an thanh cong',
    data: { food }
  });
});

export const deleteFood = catchAsync(async (req: Request, res: Response, next) => {
  const { id } = req.params;

  const food = await FoodService.deleteFood(id);

  return res.status(200).json({
    success: true,
    message: 'Xoa mon an thanh cong',
    data: { food }
  });
});

export const addToCollection = catchAsync(async (req: Request, res: Response, next) => {
  const { foodId } = req.params;
  const { collectionId } = req.body;

  const food = await FoodService.addFoodToCollection(foodId, collectionId);

  return res.status(200).json({
    success: true,
    message: 'Them mon an vao bo suu tap thanh cong',
    data: { food }
  });
});

export const removeFromCollection = catchAsync(async (req: Request, res: Response, next) => {
  const { foodId } = req.params;
  const { collectionId } = req.body;

  const food = await FoodService.removeFoodFromCollection(foodId, collectionId);

  return res.status(200).json({
    success: true,
    message: 'Xoa mon an khoi bo suu tap thanh cong',
    data: { food }
  });
});
