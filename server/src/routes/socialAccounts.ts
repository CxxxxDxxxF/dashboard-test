import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import prisma from '../config/database.js';
import { Platform } from '@prisma/client';

const router = Router();

/**
 * Validation middleware for social account operations
 */
const validateSocialAccount = [
  body('platform').isIn(Object.values(Platform)).withMessage('Invalid platform'),
  body('username').trim().isLength({ min: 1, max: 100 }).withMessage('Username must be between 1 and 100 characters'),
  body('accountId').trim().isLength({ min: 1 }).withMessage('Account ID is required'),
];

/**
 * GET /api/social-accounts
 * Get all social accounts for a user
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { userId, platform, isActive } = req.query;

  const where: any = {};
  
  if (userId) {
    where.userId = userId as string;
  }
  
  if (platform && Object.values(Platform).includes(platform as Platform)) {
    where.platform = platform;
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const accounts = await prisma.socialAccount.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  logger.info('Social accounts retrieved', { count: accounts.length, userId, platform });

  res.json({
    success: true,
    data: accounts,
  });
}));

/**
 * GET /api/social-accounts/:id
 * Get a specific social account
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Account ID is required');
  }

  const account = await prisma.socialAccount.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  if (!account) {
    throw new ApiError(404, 'Social account not found');
  }

  logger.info('Social account retrieved', { accountId: id });

  res.json({
    success: true,
    data: account,
  });
}));

/**
 * POST /api/social-accounts
 * Connect a new social account
 */
router.post('/', validateSocialAccount, asyncHandler(async (req: Request, res: Response) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', false);
  }

  const { platform, username, accountId, accessToken, refreshToken, userId } = req.body;

  // For demo purposes, use a default user if not provided
  const accountUserId = userId || 'demo-user-id';

  // Check if account already exists
  const existingAccount = await prisma.socialAccount.findFirst({
    where: {
      userId: accountUserId,
      platform,
      username,
    }
  });

  if (existingAccount) {
    throw new ApiError(409, 'Social account already connected');
  }

  const account = await prisma.socialAccount.create({
    data: {
      platform,
      username,
      accountId,
      accessToken,
      refreshToken,
      userId: accountUserId,
      isActive: true,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  logger.info('Social account connected', { accountId: account.id, platform, username });

  res.status(201).json({
    success: true,
    data: account,
  });
}));

/**
 * PUT /api/social-accounts/:id
 * Update social account details
 */
router.put('/:id', validateSocialAccount, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ApiError(400, 'Account ID is required');
  }
  
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', false);
  }

  const { platform, username, accountId, accessToken, refreshToken } = req.body;

  const existingAccount = await prisma.socialAccount.findUnique({
    where: { id }
  });

  if (!existingAccount) {
    throw new ApiError(404, 'Social account not found');
  }

  const account = await prisma.socialAccount.update({
    where: { id },
    data: {
      platform,
      username,
      accountId,
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  logger.info('Social account updated', { accountId: id, platform, username });

  res.json({
    success: true,
    data: account,
  });
}));

/**
 * DELETE /api/social-accounts/:id
 * Disconnect a social account
 */
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'Account ID is required');
  }

  const existingAccount = await prisma.socialAccount.findUnique({
    where: { id }
  });

  if (!existingAccount) {
    throw new ApiError(404, 'Social account not found');
  }

  await prisma.socialAccount.delete({
    where: { id }
  });

  logger.info('Social account disconnected', { accountId: id });

  res.json({
    success: true,
    message: 'Social account disconnected successfully',
  });
}));

/**
 * PATCH /api/social-accounts/:id/status
 * Toggle social account active status
 */
router.patch('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (!id) {
    throw new ApiError(400, 'Account ID is required');
  }

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }

  const existingAccount = await prisma.socialAccount.findUnique({
    where: { id }
  });

  if (!existingAccount) {
    throw new ApiError(404, 'Social account not found');
  }

  const account = await prisma.socialAccount.update({
    where: { id },
    data: {
      isActive,
      updatedAt: new Date(),
    }
  });

  logger.info('Social account status updated', { accountId: id, isActive });

  res.json({
    success: true,
    data: account,
  });
}));

/**
 * POST /api/social-accounts/test-connection
 * Test connection to a social media platform
 */
router.post('/test-connection', asyncHandler(async (req: Request, res: Response) => {
  const { platform, accessToken } = req.body;

  if (!platform || !Object.values(Platform).includes(platform as Platform)) {
    throw new ApiError(400, 'Valid platform is required');
  }

  if (!accessToken) {
    throw new ApiError(400, 'Access token is required');
  }

  // Mock connection test for demo purposes
  // In production, this would make actual API calls to the platform
  const isConnected = Math.random() > 0.1; // 90% success rate for demo

  if (!isConnected) {
    throw new ApiError(401, 'Failed to connect to social media platform');
  }

  logger.info('Social account connection tested', { platform, success: true });

  res.json({
    success: true,
    message: `Successfully connected to ${platform}`,
    data: {
      platform,
      connected: true,
      accountInfo: {
        username: 'demo_user',
        followers: Math.floor(Math.random() * 10000) + 1000,
        verified: Math.random() > 0.5,
      }
    }
  });
}));

export default router; 