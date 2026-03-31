import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  isActive: boolean;
  lastLogin?: Date;
  lastActive?: Date;
  passwordChangedAt?: Date;
  tokenVersion: number;
  
  // Contribution tracking
  contributionsCount: number;
  approvedContributions: number;
  
  // Suspension/Ban info
  suspendedUntil?: Date;
  suspendReason?: string;
  
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập họ và tên'],
    trim: true,
    minLength: [2, 'Họ và tên phải có ít nhất 2 ký tự'],
    maxLength: [100, 'Họ và tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Vui lòng nhập email hợp lệ'
    ]
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minLength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  lastActive: {
    type: Date
  },
  passwordChangedAt: {
    type: Date
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  contributionsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  approvedContributions: {
    type: Number,
    default: 0,
    min: 0
  },
  suspendedUntil: {
    type: Date
  },
  suspendReason: {
    type: String,
    maxlength: [500, 'Lý do khóa tài khoản không được quá 500 ký tự']
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ suspendedUntil: 1 });
userSchema.index({ createdAt: -1 });

// Middleware to hash password and increment token version before saving
userSchema.pre<IUser>('save', async function() {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
    this.password = await bcrypt.hash(this.password, salt);
    
    if (!this.isNew) {
      this.passwordChangedAt = new Date(Date.now() - 1000);
      this.tokenVersion += 1;
    }
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;