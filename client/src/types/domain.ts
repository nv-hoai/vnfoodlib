/**
 * Domain Types - Core business entities
 */

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  status?: 'active' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
}

// Food Tags
export interface Tags {
  category?: string[];
  ingredient?: string[];
  meal_time?: string[];
  cooking_method?: string[];
  taste?: string[];
  purpose?: string[];
  diet?: string[];
}

// Food/Dish Entity
export interface Food {
  _id: string;
  name: string;
  intro: string;
  ingredients: string;
  cooking: string;
  tags: Tags;
  image: string;
  likes: string[];
  likeCount: number;
  recommendations: Array<{
    userId: string;
    count: number;
    monthResetCount: number;
    lastResetDate: string;
  }>;
  recommendationCount: number;
  recommendationAllTime: number;
  inCollections: string[];
  createdAt: string;
  updatedAt: string;
}

// Collection Entity
export interface Collection {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  dishes: string[];
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Notification
export interface INotification {
  _id: string;
  type: 'system' | 'contribution' | 'admin' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  targetUsers?: string[];
  sentBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Contribution
export interface IContribution {
  _id: string;
  type: 'new_food' | 'edit_food';
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  submittedBy: string;
  foodId?: string;
  data: {
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
  };
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity Log
export interface IActivityLog {
  _id: string;
  action: string;
  actor: {
    _id: string;
    name: string;
    email: string;
  };
  target: {
    type: 'contribution' | 'user' | 'food';
    id: string;
  };
  reason?: string;
  details?: string;
  changes?: {
    [key: string]: {
      oldValue: any;
      newValue: any;
    };
  };
  createdAt: string;
}

// User Info (Extended for admin)
export interface IUserInfo extends User {
  contributionsCount: number;
  approvedContributions: number;
  suspendedUntil?: string;
  suspendReason?: string;
}

// Meal Schedule
export interface MealSchedule {
  _id: string;
  userId: string;
  date: string;
  meals: {
    breakfast?: string; // Food ID
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination Info
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages?: number;
}

// Tag Key Type (for form handling)
export type TagKey = 'category' | 'ingredient' | 'meal_time' | 'cooking_method' | 'taste' | 'purpose' | 'diet';
