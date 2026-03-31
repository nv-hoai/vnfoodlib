import Food, { IFood } from '../models/Food.js';
import AppError from '../../../utils/appError.js';
import mongoose from 'mongoose';

// Create food
export const createFood = async (foodData: Partial<IFood>): Promise<IFood> => {
  const food = await Food.create(foodData);
  return food;
};

// Get all foods with pagination
export const getAllFoods = async (
  page: number = 1,
  limit: number = 10
): Promise<{ foods: IFood[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const foods = await Food.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Food.countDocuments();

  return {
    foods,
    total,
    pages: Math.ceil(total / limit)
  };
};

// Get food by ID
export const getFoodById = async (id: string): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Id mon an khong hop le', 400);
  }

  const food = await Food.findById(id);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  return food;
};

// Search foods by name and intro
export const searchFoods = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{ foods: IFood[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;

  const foods = await Food.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit);

  const total = await Food.countDocuments(
    { $text: { $search: query } }
  );

  return { foods, total, pages: Math.ceil(total / limit) };
};

// Filter foods by tags
export const filterFoodsByTags = async (
  filters: {
    categories?: string[];
    ingredients?: string[];
    mealTimes?: string[];
    cookingMethods?: string[];
    tastes?: string[];
    purposes?: string[];
    diets?: string[];
  },
  page: number = 1,
  limit: number = 10
): Promise<{ foods: IFood[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filters.categories?.length) {
    query['tags.category'] = { $in: filters.categories };
  }
  if (filters.ingredients?.length) {
    query['tags.ingredient'] = { $in: filters.ingredients };
  }
  if (filters.mealTimes?.length) {
    query['tags.meal_time'] = { $in: filters.mealTimes };
  }
  if (filters.cookingMethods?.length) {
    query['tags.cooking_method'] = { $in: filters.cookingMethods };
  }
  if (filters.tastes?.length) {
    query['tags.taste'] = { $in: filters.tastes };
  }
  if (filters.purposes?.length) {
    query['tags.purpose'] = { $in: filters.purposes };
  }
  if (filters.diets?.length) {
    query['tags.diet'] = { $in: filters.diets };
  }

  const foods = await Food.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Food.countDocuments(query);

  return { foods, total, pages: Math.ceil(total / limit) };
};

// Like a food
export const likeFood = async (foodId: string, userId: string): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Id khong hop le', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);
  const hasLiked = food.likes.some(id => id.equals(userIdObj));

  if (hasLiked) {
    throw new AppError('Ban da thich mon an nay roi', 400);
  }

  food.likes.push(userIdObj);
  food.likeCount = food.likes.length;
  await food.save();

  return food;
};

// Unlike a food
export const unlikeFood = async (foodId: string, userId: string): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Id khong hop le', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);
  food.likes = food.likes.filter(id => !id.equals(userIdObj));
  food.likeCount = food.likes.length;
  await food.save();

  return food;
};

// Recommend a food (3 times per week reset)
export const recommendFood = async (foodId: string, userId: string): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Id khong hop le', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Find or create recommendation record for this user
  let recommendation = food.recommendations.find(rec =>
    rec.userId.equals(userIdObj)
  );

  if (!recommendation) {
    // Create new recommendation record
    recommendation = {
      userId: userIdObj,
      count: 0,
      monthResetCount: 0,
      lastResetDate: now
    };
    food.recommendations.push(recommendation);
  }

  // Check if need to reset (new month)
  const lastReset = recommendation.lastResetDate;
  const lastResetMonth = lastReset.getMonth();
  const lastResetYear = lastReset.getFullYear();

  if (currentMonth !== lastResetMonth || currentYear !== lastResetYear) {
    // Reset monthly counter
    recommendation.monthResetCount = 0;
    recommendation.lastResetDate = now;
  }

  // Check if user exceeded 3 recommendations per week
  if (recommendation.monthResetCount >= 3) {
    throw new AppError('Ban da het het luot de cu trong tuan nay', 400);
  }

  // Increment counters
  recommendation.count += 1;
  recommendation.monthResetCount += 1;
  food.recommendationCount += 1;
  food.recommendationAllTime += 1;

  await food.save();
  return food;
};

// Check if user liked a food
export const hasUserLiked = async (foodId: string, userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  }

  const food = await Food.findById(foodId);
  if (!food) return false;

  const userIdObj = new mongoose.Types.ObjectId(userId);
  return food.likes.some(id => id.equals(userIdObj));
};

// Get ranking (top foods by likes and recommendations)
export const getFoodRanking = async (
  limit: number = 10,
  sortBy: 'likes' | 'recommendations' | 'combined' = 'combined'
): Promise<IFood[]> => {
  if (sortBy === 'combined') {
    // Use aggregation for combined scoring
    const foods = await Food.aggregate([
      {
        $addFields: {
          combinedScore: {
            $add: [
              { $multiply: ['$likeCount', 1] },
              { $multiply: ['$recommendationCount', 2] }
            ]
          }
        }
      },
      {
        $sort: { combinedScore: -1 }
      },
      {
        $limit: limit
      }
    ]);
    return foods;
  }

  let sortQuery: any = {};
  if (sortBy === 'likes') {
    sortQuery = { likeCount: -1 };
  } else if (sortBy === 'recommendations') {
    sortQuery = { recommendationCount: -1 };
  }

  const foods = await Food.find()
    .limit(limit)
    .sort(sortQuery)
    .lean();

  return foods;
};

// Update food
export const updateFood = async (
  id: string,
  updates: Partial<IFood>
): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Id mon an khong hop le', 400);
  }

  const food = await Food.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  return food;
};

// Delete food
export const deleteFood = async (id: string): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Id mon an khong hop le', 400);
  }

  const food = await Food.findByIdAndDelete(id);

  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  return food;
};

// Add food to collection
export const addFoodToCollection = async (
  foodId: string,
  collectionId: string
): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new AppError('Id khong hop le', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  const collectionIdObj = new mongoose.Types.ObjectId(collectionId);
  if (!food.inCollections.some(id => id.equals(collectionIdObj))) {
    food.inCollections.push(collectionIdObj);
    await food.save();
  }

  return food;
};

// Remove food from collection
export const removeFoodFromCollection = async (
  foodId: string,
  collectionId: string
): Promise<IFood> => {
  if (!mongoose.Types.ObjectId.isValid(foodId) || !mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new AppError('Id khong hop le', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Khong tim thay mon an', 404);
  }

  const collectionIdObj = new mongoose.Types.ObjectId(collectionId);
  food.inCollections = food.inCollections.filter(id => !id.equals(collectionIdObj));
  await food.save();

  return food;
};
