import mongoose, { Schema, Document } from 'mongoose';

export type ActivityAction = 
  | 'approved_contribution'
  | 'rejected_contribution'
  | 'edited_food'
  | 'deleted_food'
  | 'suspended_user'
  | 'unsuspended_user'
  | 'banned_user'
  | 'unbanned_user'
  | 'changed_user_role'
  | 'archived_contribution'
  | 'other';

export interface IActivityTarget {
  type: 'contribution' | 'user' | 'food';
  id: mongoose.Types.ObjectId;
}

export interface IActivityLog extends Document {
  _id: mongoose.Types.ObjectId;
  action: ActivityAction;
  actor: mongoose.Types.ObjectId; // ref: User (admin who performed action)
  target: IActivityTarget;
  changes?: {
    [key: string]: {
      oldValue: any;
      newValue: any;
    };
  };
  reason?: string;
  details?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: [
        'approved_contribution',
        'rejected_contribution',
        'edited_food',
        'deleted_food',
        'suspended_user',
        'unsuspended_user',
        'banned_user',
        'unbanned_user',
        'changed_user_role',
        'archived_contribution',
        'other'
      ],
      required: [true, 'Vui lòng chỉ định hành động']
    },
    
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Vui lòng cung cấp ID admin']
    },
    
    target: {
      type: {
        type: String,
        enum: ['contribution', 'user', 'food'],
        required: true
      },
      id: {
        type: Schema.Types.ObjectId,
        required: true
      }
    },
    
    changes: Schema.Types.Mixed,
    
    reason: {
      type: String,
      maxlength: [500, 'Lý do không được quá 500 ký tự']
    },
    
    details: {
      type: String,
      maxlength: [1000, 'Chi tiết không được quá 1000 ký tự']
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes for efficient querying
activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ 'target.id': 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
