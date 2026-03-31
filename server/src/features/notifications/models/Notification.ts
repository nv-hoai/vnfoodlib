import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 
  | 'contribution_approved'
  | 'contribution_rejected'
  | 'user_suspended'
  | 'user_unsuspended'
  | 'comment_reply'
  | 'food_featured'
  | 'system'
  | 'admin'
  | 'contribution'
  | 'achievement'
  | 'other';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // ref: User - who receives notification
  type: NotificationType;
  title: string;
  message: string;
  
  // Related resource
  relatedTo?: {
    type: 'contribution' | 'food' | 'user';
    id: mongoose.Types.ObjectId;
  };
  
  isRead: boolean;
  readAt?: Date;
  
  actionUrl?: string; // URL to redirect user when clicked
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Vui lòng cung cấp ID người dùng']
    },
    
    type: {
      type: String,
      enum: [
        'contribution_approved',
        'contribution_rejected',
        'user_suspended',
        'user_unsuspended',
        'comment_reply',
        'food_featured',
        'system',
        'admin',
        'contribution',
        'achievement',
        'other'
      ],
      required: [true, 'Vui lòng chỉ định loại thông báo']
    },
    
    title: {
      type: String,
      required: [true, 'Vui lòng cung cấp tiêu đề'],
      maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    
    message: {
      type: String,
      required: [true, 'Vui lòng cung cấp nội dung thông báo'],
      maxlength: [1000, 'Nội dung không được quá 1000 ký tự']
    },
    
    relatedTo: {
      type: {
        type: String,
        enum: ['contribution', 'food', 'user']
      },
      id: Schema.Types.ObjectId
    },
    
    isRead: {
      type: Boolean,
      default: false
    },
    
    readAt: Date,
    
    actionUrl: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Auto-cleanup: Delete read notifications after 30 days
notificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 2592000, // 30 days
    partialFilterExpression: { isRead: true }
  }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
