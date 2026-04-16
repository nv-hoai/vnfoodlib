/**
 * Component Props Types
 */

import type { ButtonHTMLAttributes, ReactNode, FC } from 'react';
import type { User, Food, Collection, INotification, MealSchedule } from './domain';

// ===== SHARED COMPONENTS =====

// Button Component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

// ===== LAYOUT COMPONENTS =====

export interface AdminLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export interface NavLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

// ===== FEATURE COMPONENTS =====

// Auth Components
export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
}

// Food Components
export interface FoodCardProps {
  food: Food;
  onClick?: (food: Food) => void;
  isLoading?: boolean;
}

export interface FoodListProps {
  foods: Food[];
  isLoading?: boolean;
  onSelectFood?: (food: Food) => void;
}

// Collection Components
export interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
  onSelect?: (collection: Collection) => void;
}

export interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export interface DishCardProps {
  dish: Food;
  onRemove?: (dishId: string) => void;
}

// Notification Components
export interface NotificationItemProps {
  notification: INotification;
  onRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

// User Components
export interface UserInfoCardProps {
  user: User | null;
  isLoading?: boolean;
  onEdit?: () => void;
}

export interface UpdateProfileFormProps {
  user: User;
  onSuccess?: () => void;
}

export interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onSuccess?: () => void;
}

// Admin Components
export interface StatCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export interface ActivityLogItemProps {
  activity: any;
  onLocationClick?: (location: string) => void;
}

export interface MealScheduleFormProps {
  date?: string;
  schedule?: MealSchedule;
  onSuccess?: () => void;
}

// Contribution Components
export interface ContributeNewFoodFormProps {
  onSuccess?: () => void;
}

export interface ContributeEditFoodFormProps {
  foodId: string;
  onSuccess?: () => void;
}

// Modal Components
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Form Components
export interface FormErrorProps {
  message?: string;
  isVisible?: boolean;
}

export interface FormSuccessProps {
  message?: string;
  isVisible?: boolean;
}

export interface TagSelectorProps {
  selectedTags?: { [key: string]: string[] };
  onChange?: (tags: { [key: string]: string[] }) => void;
  availableTags?: { [key: string]: string[] };
}

// ===== PAGE COMPONENTS =====

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  showBreadcrumb?: boolean;
}

// ===== COMMON =====

export interface LoadingProps {
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
