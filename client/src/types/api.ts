/**
 * API Request/Response Types
 */

import type { 
  User, 
  Food, 
  Collection, 
  INotification, 
  IContribution, 
  IActivityLog, 
  IUserInfo,
  MealSchedule 
} from './domain';

// ===== AUTH API =====
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// ===== FOOD API =====
export interface FoodResponse {
  success: boolean;
  message: string;
  data: {
    food?: Food;
    foods?: Food[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
    hasLiked?: boolean;
    imageUrl?: string;
  };
}

export interface CreateFoodPayload {
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
  image?: string;
}

export interface UpdateFoodPayload extends Partial<CreateFoodPayload> {}

// ===== COLLECTION API =====
export interface CollectionResponse {
  status: string;
  data: {
    collection?: Collection;
    collections?: Collection[];
  };
}

export interface CreateCollectionPayload {
  name: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateCollectionPayload {
  name?: string;
  description?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface AddDishToCollectionPayload {
  dishId: string;
}

export interface RemoveDishFromCollectionPayload {
  dishId: string;
}

// ===== NOTIFICATION API =====
export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification?: INotification;
    notifications?: INotification[];
    unreadCount?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateNotificationPayload {
  type: 'system' | 'contribution' | 'admin' | 'achievement';
  title: string;
  message: string;
  link?: string;
  targetUsers?: string[];
}

export interface SendNotificationToAllPayload extends Omit<CreateNotificationPayload, 'targetUsers'> {}

export interface MarkAsReadPayload {
  notificationId: string;
}

// ===== CONTRIBUTION API =====
export interface ContributionResponse {
  success: boolean;
  message: string;
  data: {
    contribution?: IContribution;
    contributions?: IContribution[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
  };
}

export interface CreateContributionPayload {
  type: 'new_food' | 'edit_food';
  foodData?: CreateFoodPayload;
  foodId?: string;
  suggestedChanges?: {
    [key: string]: any;
  };
}

export interface ReviewContributionPayload {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

// ===== ADMIN API =====
export interface DashboardStats {
  users: {
    total: number;
    active: number;
    suspended: number;
    banned: number;
    newThisMonth: number;
    newThisYear: number;
  };
  foods: {
    total: number;
    newThisMonth: number;
  };
  contributions: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    approvalRate: string;
  };
  recentActivity: IActivityLog[];
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: {
    contribution?: IContribution;
    contributions?: IContribution[];
    user?: IUserInfo;
    users?: IUserInfo[];
    stats?: DashboardStats;
    activity?: IActivityLog;
    activities?: IActivityLog[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
  };
}

export interface PendingContributionsResponse {
  success: boolean;
  data: {
    contributions: IContribution[];
    total: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
  };
}

export interface SuspendUserPayload {
  userId: string;
  reason: string;
  durationInDays?: number;
}

// ===== USER API =====
export interface GetMeResponse {
  user: User;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  accessToken: string;
}

// ===== MEAL SCHEDULE API =====
export interface MealScheduleResponse {
  success: boolean;
  message: string;
  data: {
    schedule?: MealSchedule;
    schedules?: MealSchedule[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
    };
  };
}

export interface CreateMealSchedulePayload {
  date: string;
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snacks?: string;
  };
  notes?: string;
}

export interface UpdateMealSchedulePayload extends Partial<CreateMealSchedulePayload> {}

// ===== GENERIC API RESPONSE =====
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code: string;
    details?: string;
  };
}

// Pagination Query Params
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Search Query Params
export interface SearchParams extends PaginationParams {
  q: string;
}
