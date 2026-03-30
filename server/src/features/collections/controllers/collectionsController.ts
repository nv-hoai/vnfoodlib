import { Request, Response, NextFunction } from 'express';
import collectionsService from '../services/collectionsService.js';
import { catchAsync } from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';

export const createCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, isPublic, tags } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    const collection = await collectionsService.createCollection(
      userId,
      name,
      description,
      isPublic,
      tags
    );

    res.status(201).json({
      status: 'success',
      data: {
        collection
      }
    });
  }
);

export const getUserCollections = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    const collections = await collectionsService.getUserCollections(userId);

    res.status(200).json({
      status: 'success',
      data: {
        collections
      }
    });
  }
);

export const getCollectionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    const collection = await collectionsService.getCollectionById(id);

    if (!collection) {
      return next(new AppError('Collection not found', 404));
    }

    // Check if collection is public OR user owns it
    const isOwner = userId && collection.userId.toString() === userId;
    if (!collection.isPublic && !isOwner) {
      return next(new AppError('Unauthorized to view this collection', 403));
    }

    res.status(200).json({
      status: 'success',
      data: {
        collection
      }
    });
  }
);

export const getPublicCollections = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const collections = await collectionsService.getPublicCollections();

    res.status(200).json({
      status: 'success',
      data: {
        collections
      }
    });
  }
);

export const updateCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    const collection = await collectionsService.updateCollection(
      id,
      userId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: {
        collection
      }
    });
  }
);

export const deleteCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    await collectionsService.deleteCollection(id, userId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const addDishToCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { collectionId, dishId } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!collectionId || !dishId) {
      return next(new AppError('Collection ID and Dish ID are required', 400));
    }

    const collection = await collectionsService.addDishToCollection(
      collectionId,
      userId,
      dishId
    );

    res.status(200).json({
      status: 'success',
      data: {
        collection
      }
    });
  }
);

export const removeDishFromCollection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { collectionId, dishId } = req.body;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!collectionId || !dishId) {
      return next(new AppError('Collection ID and Dish ID are required', 400));
    }

    const collection = await collectionsService.removeDishFromCollection(
      collectionId,
      userId,
      dishId
    );

    res.status(200).json({
      status: 'success',
      data: {
        collection
      }
    });
  }
);

export const searchCollections = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { keyword } = req.query;
    const userId = req.user?._id?.toString();

    if (!userId) {
      return next(new AppError('User id not found', 401));
    }

    if (!keyword) {
      return next(new AppError('Search keyword is required', 400));
    }

    const collections = await collectionsService.searchCollections(
      userId,
      keyword as string
    );

    res.status(200).json({
      status: 'success',
      data: {
        collections
      }
    });
  }
);
