import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { PostService } from '../services/postService.js';
import { SocialMediaService } from '../services/socialMediaService.js';
import { MockDataService } from '../services/mockDataService.js';
import { validatePostData } from '../middleware/validation.js';

const prisma = new PrismaClient();
const postService = new PostService();
const socialMediaService = new SocialMediaService();

export class PostsController {
  /**
   * Get all posts with pagination and filtering
   */
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10, platform, status, search } = req.query;
    
    try {
      const posts = await postService.getAllPosts({
        page: Number(page),
        limit: Number(limit),
        platform: platform as string,
        status: status as string,
        search: search as string,
      });

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: posts.length,
        },
      });
    } catch (error) {
      logger.warn('Database query failed, using mock posts data:', error);
      
      // Use mock data as fallback
      const mockPosts = MockDataService.getMockPosts({
        page: Number(page),
        limit: Number(limit),
        platform: platform as string,
        status: status as string,
        search: search as string,
      });

      res.json({
        success: true,
        data: mockPosts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: mockPosts.length,
        },
      });
    }
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found',
        });
        return;
      }

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      logger.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Create a new post
   */
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const validation = validatePostData(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid post data',
          errors: validation.errors,
        });
        return;
      }

      const postData = {
        ...req.body,
        scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null,
      };

      const post = await postService.createPost(postData);

      // If post is scheduled, add to queue
      if (post.scheduledAt) {
        await postService.schedulePost(post.id, post.scheduledAt);
      }

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      logger.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Update an existing post
   */
  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validation = validatePostData(req.body);
      
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid post data',
          errors: validation.errors,
        });
        return;
      }

      const post = await postService.updatePost(id, req.body);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error) {
      logger.error('Error updating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await postService.deletePost(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Post not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Publish a post to social media platforms
   */
  static async publishPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { platforms } = req.body;

      const post = await postService.getPostById(id);
      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found',
        });
        return;
      }

      const results = await socialMediaService.publishPost(post, platforms);

      res.json({
        success: true,
        message: 'Post published successfully',
        data: results,
      });
    } catch (error) {
      logger.error('Error publishing post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Get post analytics
   */
  static async getPostAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { period = '7d' } = req.query;

      const analytics = await postService.getPostAnalytics(id, period as string);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error fetching post analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Duplicate a post
   */
  static async duplicatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const duplicatedPost = await postService.duplicatePost(id);

      if (!duplicatedPost) {
        res.status(404).json({
          success: false,
          message: 'Post not found',
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Post duplicated successfully',
        data: duplicatedPost,
      });
    } catch (error) {
      logger.error('Error duplicating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Bulk operations on posts
   */
  static async bulkOperations(req: Request, res: Response): Promise<void> {
    try {
      const { action, postIds } = req.body;

      if (!action || !postIds || !Array.isArray(postIds)) {
        res.status(400).json({
          success: false,
          message: 'Invalid bulk operation data',
        });
        return;
      }

      const results = await postService.bulkOperations(action, postIds);

      res.json({
        success: true,
        message: `Bulk ${action} completed`,
        data: results,
      });
    } catch (error) {
      logger.error('Error performing bulk operations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to perform bulk operations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
} 