import mongoose, { Schema, Document } from 'mongoose';

export interface IFood extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  intro: string;
  ingredients: string;
  cooking: string;
  tags: {
    category?: string[];
    ingredient?: string[];
    meal_time?: string[];
    cooking_method?: string[];
    taste?: string[];
    purpose?: string[];
    diet?: string[];
  };
  image: string;
  
  // Likes - all-time counting
  likes: mongoose.Types.ObjectId[];
  likeCount: number;
  
  // Recommendations - monthly reset with all-time tracking
  recommendations: Array<{
    userId: mongoose.Types.ObjectId;
    count: number;
    monthResetCount: number;
    lastResetDate: Date;
  }>;
  recommendationCount: number;
  recommendationAllTime: number;
  
  // Collections reference
  inCollections: mongoose.Types.ObjectId[];
  
  createdAt: Date;
  updatedAt: Date;
}

const foodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: [true, 'Vui long nhap ten mon an'],
      trim: true,
      maxlength: [200, 'Ten mon an khong duoc qua 200 ky tu']
    },
    intro: {
      type: String,
      required: [true, 'Vui long nhap gioi thieu mon an'],
      maxlength: [2000, 'Gioi thieu khong duoc qua 2000 ky tu']
    },
    ingredients: {
      type: String,
      required: [true, 'Vui long nhap nguyen lieu'],
      maxlength: [5000, 'Nguyen lieu khong duoc qua 5000 ky tu']
    },
    cooking: {
      type: String,
      required: [true, 'Vui long nhap cach nau'],
      maxlength: [5000, 'Cach nau khong duoc qua 5000 ky tu']
    },
    tags: {
      type: {
        category: [String],
        ingredient: [String],
        meal_time: [String],
        cooking_method: [String],
        taste: [String],
        purpose: [String],
        diet: [String]
      },
      default: {}
    },
    image: {
      type: String,
      required: [true, 'Vui long them anh mon an'],
      trim: true
    },
    
    // Likes
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'Users',
      default: []
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Recommendations
    recommendations: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'Users',
          required: true
        },
        count: {
          type: Number,
          default: 0,
          min: 0
        },
        monthResetCount: {
          type: Number,
          default: 0,
          min: 0
        },
        lastResetDate: {
          type: Date,
          default: Date.now
        }
      }
    ],
    recommendationCount: {
      type: Number,
      default: 0,
      min: 0
    },
    recommendationAllTime: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Collections
    inCollections: {
      type: [Schema.Types.ObjectId],
      ref: 'Collection',
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for search
foodSchema.index({ name: 'text', intro: 'text' });
foodSchema.index({ 'tags.category': 1 });
foodSchema.index({ 'tags.ingredient': 1 });
foodSchema.index({ likeCount: -1 });
foodSchema.index({ recommendationCount: -1 });

const Food = mongoose.model<IFood>('Food', foodSchema);

export default Food;
