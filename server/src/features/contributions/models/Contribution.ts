import mongoose, { Schema, Document } from 'mongoose';

export type ContributionType = 'new_food' | 'edit_food';
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface IContributionData {
  name?: string;
  intro?: string;
  ingredients?: string;
  cooking?: string;
  tags?: {
    category?: string[];
    ingredient?: string[];
    meal_time?: string[];
    cooking_method?: string[];
    taste?: string[];
    purpose?: string[];
    diet?: string[];
  };
  image?: string;
}

export interface IContributionChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface IContribution extends Document {
  _id: mongoose.Types.ObjectId;
  type: ContributionType; // 'new_food' or 'edit_food'
  status: ContributionStatus; // 'pending', 'approved', 'rejected', 'archived'
  
  // Submission info
  submittedBy: mongoose.Types.ObjectId; // ref: User
  foodId?: mongoose.Types.ObjectId; // ref: Food - only for edits
  
  // Submitted data
  data: IContributionData;
  
  // For edits - track what changed
  changes?: IContributionChange[];
  
  // Review info
  reviewedBy?: mongoose.Types.ObjectId; // ref: User (admin who reviewed)
  reviewedAt?: Date;
  rejectionReason?: string;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>(
  {
    type: {
      type: String,
      enum: ['new_food', 'edit_food'],
      required: [true, 'Vui lòng chọn loại đóng góp']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending'
    },
    
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Vui lòng cung cấp ID người dùng']
    },
    
    foodId: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: function() {
        return (this as any).type === 'edit_food';
      }
    },
    
    data: {
      name: {
        type: String,
        trim: true,
        maxlength: [200, 'Tên món ăn không được quá 200 ký tự']
      },
      intro: {
        type: String,
        maxlength: [2000, 'Giới thiệu không được quá 2000 ký tự']
      },
      ingredients: {
        type: String,
        maxlength: [5000, 'Nguyên liệu không được quá 5000 ký tự']
      },
      cooking: {
        type: String,
        maxlength: [5000, 'Cách nấu không được quá 5000 ký tự']
      },
      tags: {
        category: [String],
        ingredient: [String],
        meal_time: [String],
        cooking_method: [String],
        taste: [String],
        purpose: [String],
        diet: [String]
      },
      image: {
        type: String,
        trim: true
      }
    },
    
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed
      }
    ],
    
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    
    reviewedAt: Date,
    
    rejectionReason: {
      type: String,
      maxlength: [500, 'Lý do từ chối không được quá 500 ký tự']
    },
    
    notes: {
      type: String,
      maxlength: [1000, 'Ghi chú không được quá 1000 ký tự']
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
contributionSchema.index({ status: 1, createdAt: -1 });
contributionSchema.index({ submittedBy: 1, createdAt: -1 });
contributionSchema.index({ type: 1, status: 1 });
contributionSchema.index({ foodId: 1 });

export default mongoose.model<IContribution>('Contribution', contributionSchema);
