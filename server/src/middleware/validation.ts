import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation result handler
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

/**
 * Post data validation
 */
export const validatePostData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (data.title && data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (data.content && data.content.length > 5000) {
    errors.push('Content must be less than 5000 characters');
  }

  if (data.platforms && (!Array.isArray(data.platforms) || data.platforms.length === 0)) {
    errors.push('At least one platform must be selected');
  }

  if (data.platforms && Array.isArray(data.platforms)) {
    const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
    const invalidPlatforms = data.platforms.filter((p: string) => !validPlatforms.includes(p.toLowerCase()));
    if (invalidPlatforms.length > 0) {
      errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
    }
  }

  if (data.scheduledAt && isNaN(Date.parse(data.scheduledAt))) {
    errors.push('Invalid scheduled date format');
  }

  if (data.scheduledAt && new Date(data.scheduledAt) <= new Date()) {
    errors.push('Scheduled date must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Post creation validation rules
 */
export const validateCreatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  
  body('platforms')
    .isArray({ min: 1 })
    .withMessage('At least one platform must be selected'),
  
  body('platforms.*')
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin'])
    .withMessage('Invalid platform selected'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Invalid image URL'),
  
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  handleValidationErrors,
];

/**
 * Post update validation rules
 */
export const validateUpdatePost = [
  param('id')
    .isUUID()
    .withMessage('Invalid post ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  
  body('platforms')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one platform must be selected'),
  
  body('platforms.*')
    .optional()
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin'])
    .withMessage('Invalid platform selected'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Invalid image URL'),
  
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['draft', 'scheduled', 'published', 'failed'])
    .withMessage('Invalid status'),
  
  handleValidationErrors,
];

/**
 * Post ID validation
 */
export const validatePostId = [
  param('id')
    .isUUID()
    .withMessage('Invalid post ID'),
  
  handleValidationErrors,
];

/**
 * Analytics query validation
 */
export const validateAnalyticsQuery = [
  query('period')
    .optional()
    .matches(/^\d+d$/)
    .withMessage('Period must be in format: Nd (e.g., 7d, 30d)'),
  
  query('platform')
    .optional()
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin', 'all'])
    .withMessage('Invalid platform'),
  
  query('type')
    .optional()
    .isIn(['engagement', 'reach', 'demographics', 'content'])
    .withMessage('Invalid analytics type'),
  
  handleValidationErrors,
];

/**
 * Pagination validation
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors,
];

/**
 * Search validation
 */
export const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  handleValidationErrors,
];

/**
 * Social media credentials validation
 */
export const validateSocialCredentials = [
  body('platform')
    .isIn(['facebook', 'instagram', 'twitter', 'linkedin'])
    .withMessage('Invalid platform'),
  
  body('accessToken')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Access token is required'),
  
  body('pageId')
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Page ID is required for Facebook'),
  
  body('businessAccountId')
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Business account ID is required for Instagram'),
  
  handleValidationErrors,
];

/**
 * Bulk operations validation
 */
export const validateBulkOperations = [
  body('action')
    .isIn(['delete', 'publish', 'draft', 'schedule'])
    .withMessage('Invalid bulk action'),
  
  body('postIds')
    .isArray({ min: 1 })
    .withMessage('At least one post ID must be provided'),
  
  body('postIds.*')
    .isUUID()
    .withMessage('Invalid post ID'),
  
  handleValidationErrors,
];

/**
 * Export validation
 */
export const validateExport = [
  query('format')
    .optional()
    .isIn(['csv', 'json'])
    .withMessage('Export format must be csv or json'),
  
  query('period')
    .optional()
    .matches(/^\d+d$/)
    .withMessage('Period must be in format: Nd (e.g., 7d, 30d)'),
  
  query('metrics')
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage('Metrics must be specified'),
  
  handleValidationErrors,
];

/**
 * File upload validation
 */
export const validateFileUpload = [
  body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }
      
      return true;
    }),
  
  handleValidationErrors,
];

/**
 * Date range validation
 */
export const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO 8601 format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO 8601 format')
    .custom((value, { req }) => {
      const startDate = req.query.startDate;
      if (startDate && new Date(value) <= new Date(startDate as string)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  handleValidationErrors,
]; 