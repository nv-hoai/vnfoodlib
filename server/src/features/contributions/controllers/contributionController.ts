import { Request, Response, NextFunction } from 'express';
import * as ContributionService from '../services/contributionService.js';
import { catchAsync } from '../../../utils/catchAsync.js';

/**
 * Submit new food contribution
 * POST /api/contributions/foods
 */
export const submitNewFood = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id?.toString();
  const { name, intro, ingredients, cooking, tags, image } = req.body;

  const contribution = await ContributionService.submitNewFood(userId as string, {
    name,
    intro,
    ingredients,
    cooking,
    tags,
    image
  });

  return res.status(201).json({
    success: true,
    message: 'Đóng góp món ăn mới thành công',
    data: { contribution }
  });
});

/**
 * Submit edit for existing food
 * PATCH /api/contributions/foods/:foodId
 */
export const submitFoodEdit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id?.toString();
  const { foodId } = req.params;
  const changes = req.body;

  const contribution = await ContributionService.submitFoodEdit(userId as string, foodId, changes);

  return res.status(201).json({
    success: true,
    message: 'Đề xuất chỉnh sửa thành công',
    data: { contribution }
  });
});

/**
 * Get user's own contributions
 * GET /api/contributions/my
 */
export const getUserContributions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id?.toString();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const { contributions, total, pages } = await ContributionService.getUserContributions(
    userId as string,
    page,
    limit
  );

  return res.status(200).json({
    success: true,
    message: 'Lấy danh sách đóng góp thành công',
    data: {
      contributions,
      pagination: { page, limit, total, pages }
    }
  });
});

/**
 * Get contribution details
 * GET /api/contributions/:id
 */
export const getContributionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const contribution = await ContributionService.getContributionById(id);

  return res.status(200).json({
    success: true,
    message: 'Lấy chi tiết đóng góp thành công',
    data: { contribution }
  });
});
