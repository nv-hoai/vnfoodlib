/**
 * Common/Utility Types
 */

// ===== FORM TYPES =====

export interface FormData {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormFieldState {
  value: any;
  error?: string;
  isDirty: boolean;
  isTouched: boolean;
  isValidating?: boolean;
}

// Auth Forms
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileFormData {
  name: string;
  email?: string;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Collection Forms
export interface CreateCollectionFormData {
  name: string;
  description?: string;
  isPublic: boolean;
  tags?: string[];
}

// Contribution Forms
export interface ContributeNewFoodFormData {
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
  image?: File;
}

export interface ContributeEditFoodFormData extends Partial<ContributeNewFoodFormData> {
  foodId?: string;
}

// Meal Schedule Forms
export interface MealScheduleFormData {
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
  notes?: string;
}

// ===== REQUEST TYPES =====

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  url: string;
  method?: HttpMethod;
  params?: Record<string, any>;
  data?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

// ===== STATUS TYPES =====

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export type ContentStatus = 'empty' | 'loading' | 'loaded' | 'error';

// ===== NOTIFICATION TYPES =====

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

// ===== FILTER/SORT TYPES =====

export interface SortOption {
  key: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface FilterOption {
  key: string;
  label: string;
  values: FilterValue[];
}

export interface FilterValue {
  value: string | number;
  label: string;
  count?: number;
}

export interface FilterState {
  [key: string]: (string | number)[];
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// ===== PAGINATION TYPES =====

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ===== MODAL TYPES =====

export type ModalType = 'info' | 'warning' | 'error' | 'success' | 'confirmation';

export interface ModalState {
  isOpen: boolean;
  type?: ModalType;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

// ===== UPLOAD TYPES =====

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
}

export interface UploadedFile {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

// ===== SEARCH TYPES =====

export interface SearchQuery {
  q: string;
  filters?: FilterState;
  sort?: SortState;
  page?: number;
  limit?: number;
}

export type TabType = 'intro' | 'ingredients' | 'cooking';

export type NotificationType = 'system' | 'contribution' | 'admin' | 'achievement';

export type FilterType = {
  [key: string]: string[] | string;
};

// ===== UTILITY TYPES =====

// Make all properties optional recursively
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// Make all properties required recursively
export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>;
} : T;

// Extract keys with specific type
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// Async thunk payload
export interface AsyncThunkPayload<T> {
  data: T;
  status: 'pending' | 'fulfilled' | 'rejected';
  error?: string;
}

// Result wrapper
export interface Result<T, E = Error> {
  ok: boolean;
  value?: T;
  error?: E;
}

// Nullable type
export type Nullable<T> = T | null;

// Maybe type
export type Maybe<T> = T | undefined;

// Either type
export type Either<L, R> = { left: L } | { right: R };

// ===== CONTRIBUTION TYPES =====

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
