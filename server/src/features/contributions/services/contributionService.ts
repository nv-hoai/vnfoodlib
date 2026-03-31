import Contribution, { IContribution, IContributionChange, ContributionType } from '../models/Contribution.js';
import Food from '../../foods/models/Food.js';
import User from '../../users/models/Users.js';
import Notification from '../../notifications/models/Notification.js';
import ActivityLog from '../../admin/models/ActivityLog.js';
import AppError from '../../../utils/appError.js';
import mongoose from 'mongoose';

/**
 * Submit a new food contribution
 */
export const submitNewFood = async (
  userId: string,
  data: {
    name: string;
    intro: string;
    ingredients: string;
    cooking: string;
    tags: any;
    image: string;
  }
): Promise<IContribution> => {
  // Validate required fields
  if (!data.name?.trim() || data.name.length < 3 || data.name.length > 200) {
    throw new AppError('Tên món ăn phải từ 3-200 ký tự', 400);
  }

  if (!data.intro?.trim() || data.intro.length < 10 || data.intro.length > 2000) {
    throw new AppError('Giới thiệu phải từ 10-2000 ký tự', 400);
  }

  if (!data.ingredients?.trim() || data.ingredients.length < 20) {
    throw new AppError('Nguyên liệu phải ít nhất 20 ký tự', 400);
  }

  if (!data.cooking?.trim() || data.cooking.length < 20) {
    throw new AppError('Cách nấu phải ít nhất 20 ký tự', 400);
  }

  // Check user's pending contributions limit (max 5)
  const pendingCount = await Contribution.countDocuments({
    submittedBy: userId,
    status: 'pending'
  });

  if (pendingCount >= 5) {
    throw new AppError('Bạn có quá nhiều đóng góp chờ duyệt (tối đa 5)', 400);
  }

  // Check daily limit (max 10 per day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dailyCount = await Contribution.countDocuments({
    submittedBy: userId,
    createdAt: { $gte: today, $lt: tomorrow }
  });

  if (dailyCount >= 10) {
    throw new AppError('Bạn đã đạt giới hạn 10 đóng góp/ngày', 400);
  }

  const contribution = await Contribution.create({
    type: 'new_food',
    status: 'pending',
    submittedBy: userId,
    data
  });

  // Increment user contribution count
  await User.findByIdAndUpdate(userId, {
    $inc: { contributionsCount: 1 }
  });

  return contribution;
};

/**
 * Submit an edit/modification to existing food
 */
export const submitFoodEdit = async (
  userId: string,
  foodId: string,
  changes: {
    name?: string;
    intro?: string;
    ingredients?: string;
    cooking?: string;
    tags?: any;
    image?: string;
  }
): Promise<IContribution> => {
  // Validate foodId
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    throw new AppError('ID món ăn không hợp lệ', 400);
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new AppError('Không tìm thấy món ăn', 404);
  }

  // At least one field must be changed
  if (!Object.values(changes).some(v => v !== undefined)) {
    throw new AppError('Bạn phải thay đổi ít nhất một trường', 400);
  }

  // Build changes array for tracking
  const changesArray: IContributionChange[] = [];
  const data: any = {};

  for (const [key, newValue] of Object.entries(changes)) {
    if (newValue !== undefined) {
      const oldValue = (food as any)[key];
      changesArray.push({
        field: key,
        oldValue,
        newValue
      });
      data[key] = newValue;
    }
  }

  // Check pending edits limit
  const pendingCount = await Contribution.countDocuments({
    submittedBy: userId,
    status: 'pending'
  });

  if (pendingCount >= 5) {
    throw new AppError('Bạn có quá nhiều đóng góp chờ duyệt (tối đa 5)', 400);
  }

  const contribution = await Contribution.create({
    type: 'edit_food',
    status: 'pending',
    submittedBy: userId,
    foodId,
    data,
    changes: changesArray
  });

  // Increment user contribution count
  await User.findByIdAndUpdate(userId, {
    $inc: { contributionsCount: 1 }
  });

  return contribution;
};

/**
 * Get user's contributions
 */
export const getUserContributions = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ contributions: IContribution[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;

  const contributions = await Contribution.find({ submittedBy: userId })
    .populate('submittedBy', 'name email')
    .populate('foodId', 'name')
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Contribution.countDocuments({ submittedBy: userId });

  return {
    contributions,
    total,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get single contribution
 */
export const getContributionById = async (id: string): Promise<IContribution> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('ID đóng góp không hợp lệ', 400);
  }

  const contribution = await Contribution.findById(id)
    .populate('submittedBy', 'name email')
    .populate('foodId')
    .populate('reviewedBy', 'name');

  if (!contribution) {
    throw new AppError('Không tìm thấy đóng góp', 404);
  }

  return contribution;
};

/**
 * ADMIN: Get all pending contributions
 */
export const getPendingContributions = async (
  page: number = 1,
  limit: number = 20,
  type?: 'new_food' | 'edit_food'
): Promise<{ contributions: IContribution[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = { status: 'pending' };

  if (type) {
    query.type = type;
  }

  const contributions = await Contribution.find(query)
    .populate('submittedBy', 'name email')
    .populate('foodId', 'name')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Contribution.countDocuments(query);

  return {
    contributions,
    total,
    pages: Math.ceil(total / limit)
  };
};

/**
 * ADMIN: Approve contribution
 */
export const approveContribution = async (
  contributionId: string,
  adminId: string,
  notes?: string
): Promise<IContribution> => {
  const contribution = await Contribution.findById(contributionId);
  if (!contribution) {
    throw new AppError('Không tìm thấy đóng góp', 404);
  }

  if (contribution.status !== 'pending') {
    throw new AppError('Chỉ có thể duyệt các đóng góp chưa xử lý', 400);
  }

  contribution.status = 'approved';
  contribution.reviewedBy = new mongoose.Types.ObjectId(adminId);
  contribution.reviewedAt = new Date();
  if (notes) contribution.notes = notes;
  await contribution.save();

  // If new_food, create the food document
  if (contribution.type === 'new_food') {
    await Food.create(contribution.data);
  } else if (contribution.type === 'edit_food' && contribution.foodId) {
    // Update existing food
    await Food.findByIdAndUpdate(contribution.foodId, contribution.data);
  }

  // Update user stats
  await User.findByIdAndUpdate(contribution.submittedBy, {
    $inc: { approvedContributions: 1 }
  });

  // Log activity
  await ActivityLog.create({
    action: 'approved_contribution',
    actor: adminId,
    target: {
      type: 'contribution',
      id: contribution._id
    },
    details: notes
  });

  // Send notification
  await Notification.create({
    userId: contribution.submittedBy,
    type: 'contribution_approved',
    title: 'Đóng góp được duyệt',
    message: `Đóng góp của bạn về "${contribution.data.name || 'món ăn'}" đã được phê duyệt!`,
    relatedTo: {
      type: 'contribution',
      id: contribution._id
    },
    actionUrl: contribution.type === 'new_food' 
      ? '/foods'
      : `/foods/${contribution.foodId}`
  });

  return contribution;
};

/**
 * ADMIN: Reject contribution
 */
export const rejectContribution = async (
  contributionId: string,
  adminId: string,
  rejectionReason: string
): Promise<IContribution> => {
  if (!rejectionReason?.trim()) {
    throw new AppError('Vui lòng cung cấp lý do từ chối', 400);
  }

  const contribution = await Contribution.findById(contributionId);
  if (!contribution) {
    throw new AppError('Không tìm thấy đóng góp', 404);
  }

  if (contribution.status !== 'pending') {
    throw new AppError('Chỉ có thể từ chối các đóng góp chưa xử lý', 400);
  }

  contribution.status = 'rejected';
  contribution.reviewedBy = new mongoose.Types.ObjectId(adminId);
  contribution.reviewedAt = new Date();
  contribution.rejectionReason = rejectionReason;
  await contribution.save();

  // Log activity
  await ActivityLog.create({
    action: 'rejected_contribution',
    actor: adminId,
    target: {
      type: 'contribution',
      id: contribution._id
    },
    reason: rejectionReason
  });

  // Send notification
  await Notification.create({
    userId: contribution.submittedBy,
    type: 'contribution_rejected',
    title: 'Đóng góp bị từ chối',
    message: `Đóng góp của bạn về "${contribution.data.name || 'món ăn'}" đã bị từ chối. Lý do: ${rejectionReason}`,
    relatedTo: {
      type: 'contribution',
      id: contribution._id
    },
    actionUrl: `/my-contributions`
  });

  return contribution;
};

/**
 * ADMIN: Archive contribution
 */
export const archiveContribution = async (
  contributionId: string,
  adminId: string
): Promise<IContribution> => {
  const contribution = await Contribution.findByIdAndUpdate(
    contributionId,
    {
      status: 'archived'
    },
    { new: true }
  );

  if (!contribution) {
    throw new AppError('Không tìm thấy đóng góp', 404);
  }

  // Log activity
  await ActivityLog.create({
    action: 'archived_contribution',
    actor: adminId,
    target: {
      type: 'contribution',
      id: contribution._id
    }
  });

  return contribution;
};

/**
 * Get contribution stats (for dashboard)
 */
export const getContributionStats = async () => {
  const total = await Contribution.countDocuments();
  const pending = await Contribution.countDocuments({ status: 'pending' });
  const approved = await Contribution.countDocuments({ status: 'approved' });
  const rejected = await Contribution.countDocuments({ status: 'rejected' });
  const newFoods = await Contribution.countDocuments({ type: 'new_food' });
  const edits = await Contribution.countDocuments({ type: 'edit_food' });

  return {
    total,
    pending,
    approved,
    rejected,
    archived: await Contribution.countDocuments({ status: 'archived' }),
    byType: { newFoods, edits },
    approvalRate: total > 0 ? ((approved / total) * 100).toFixed(2) : '0'
  };
};
