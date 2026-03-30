import Collection, { ICollection } from '../models/Collection.js';
import AppError from '../../../utils/appError.js';
import mongoose from 'mongoose';

class CollectionsService {
  async createCollection(
    userId: string,
    name: string,
    description?: string,
    isPublic: boolean = false,
    tags?: string[]
  ): Promise<ICollection> {
    const collection = await Collection.create({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      description,
      isPublic,
      tags: tags || []
    });
    return collection;
  }

  async getUserCollections(userId: string): Promise<ICollection[]> {
    const collections = await Collection.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).sort({ createdAt: -1 });
    return collections;
  }

  async getCollectionById(collectionId: string): Promise<ICollection | null> {
    const collection = await Collection.findById(collectionId).populate('dishes');
    return collection;
  }

  async getPublicCollections(): Promise<ICollection[]> {
    const collections = await Collection.find({ isPublic: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    return collections;
  }

  async updateCollection(
    collectionId: string,
    userId: string,
    updateData: Partial<ICollection>
  ): Promise<ICollection> {
    const collection = await Collection.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(collectionId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    return collection;
  }

  async deleteCollection(
    collectionId: string,
    userId: string
  ): Promise<void> {
    const collection = await Collection.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(collectionId),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }
  }

  async addDishToCollection(
    collectionId: string,
    userId: string,
    dishId: string
  ): Promise<ICollection> {
    const collection = await Collection.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(collectionId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { $addToSet: { dishes: new mongoose.Types.ObjectId(dishId) } },
      { new: true }
    );

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    return collection;
  }

  async removeDishFromCollection(
    collectionId: string,
    userId: string,
    dishId: string
  ): Promise<ICollection> {
    const collection = await Collection.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(collectionId),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { $pull: { dishes: new mongoose.Types.ObjectId(dishId) } },
      { new: true }
    );

    if (!collection) {
      throw new AppError('Collection not found', 404);
    }

    return collection;
  }

  async searchCollections(
    userId: string,
    keyword: string
  ): Promise<ICollection[]> {
    const collections = await Collection.find({
      userId: new mongoose.Types.ObjectId(userId),
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ]
    });

    return collections;
  }
}

export default new CollectionsService();
