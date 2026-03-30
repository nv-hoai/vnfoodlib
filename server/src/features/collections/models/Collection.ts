import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  dishes: mongoose.Types.ObjectId[];
  isPublic: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Collection must belong to a user'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
      maxlength: [100, 'Collection name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    dishes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dish'
      }
    ],
    isPublic: {
      type: Boolean,
      default: false
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Index for faster queries
collectionSchema.index({ userId: 1, name: 1 });
collectionSchema.index({ isPublic: 1 });

export default mongoose.model<ICollection>('Collection', collectionSchema);
