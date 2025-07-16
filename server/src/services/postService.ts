import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

interface PostFilters {
  page: number;
  limit: number;
  platform?: string;
  status?: string;
  search?: string;
}

interface PostData {
  title: string;
  content: string;
  imageUrl?: string;
  platforms: string[];
  scheduledAt?: Date;
  status?: string;
  tags?: string[];
}

export class PostService {
  /**
   * Get all posts with pagination and filtering
   */
  async getAllPosts(filters: PostFilters): Promise<any[]> {
    try {
      const skip = (filters.page - 1) * filters.limit;
      
      const where: any = {};
      
      if (filters.platform) {
        where.platforms = {
          has: filters.platform,
        };
      }
      
      if (filters.status) {
        where.status = filters.status;
      }
      
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { content: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const posts = await prisma.post.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          engagement: true,
          user: {
            select: { id: true, name: true, email: true }
          },
          socialAccount: {
            select: { id: true, platform: true, username: true }
          }
        },
      });

      return posts;
    } catch (error) {
      logger.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(id: string): Promise<any> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          engagement: true,
          user: {
            select: { id: true, name: true, email: true }
          },
          socialAccount: {
            select: { id: true, platform: true, username: true }
          }
        },
      });

      return post;
    } catch (error) {
      logger.error('Error fetching post:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(postData: PostData): Promise<any> {
    try {
      const post = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          imageUrl: postData.imageUrl,
          platforms: postData.platforms,
          scheduledAt: postData.scheduledAt,
          status: postData.status || 'DRAFT',
          tags: postData.tags || [],
        },
        include: {
          analytics: true,
          media: true,
        },
      });

      logger.info(`Post created: ${post.id}`);
      return post;
    } catch (error) {
      logger.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, updateData: Partial<PostData>): Promise<any> {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          analytics: true,
          media: true,
        },
      });

      logger.info(`Post updated: ${id}`);
      return post;
    } catch (error) {
      logger.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      await prisma.post.delete({
        where: { id },
      });

      logger.info(`Post deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting post:', error);
      return false;
    }
  }

  /**
   * Schedule a post for later publication
   */
  async schedulePost(postId: string, scheduledAt: Date): Promise<void> {
    try {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'SCHEDULED',
          scheduledAt,
        },
      });

      // In a real implementation, you would add this to a job queue
      logger.info(`Post scheduled: ${postId} for ${scheduledAt}`);
    } catch (error) {
      logger.error('Error scheduling post:', error);
      throw error;
    }
  }

  /**
   * Get post analytics
   */
  async getPostAnalytics(postId: string, period: string = '7d'): Promise<any> {
    try {
      const analytics = await prisma.postAnalytics.findMany({
        where: {
          postId,
          createdAt: {
            gte: this.getDateFromPeriod(period),
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return this.calculateAnalyticsSummary(analytics);
    } catch (error) {
      logger.error('Error fetching post analytics:', error);
      throw error;
    }
  }

  /**
   * Duplicate a post
   */
  async duplicatePost(postId: string): Promise<any> {
    try {
      const originalPost = await this.getPostById(postId);
      if (!originalPost) {
        return null;
      }

      const duplicatedPost = await this.createPost({
        title: `${originalPost.title} (Copy)`,
        content: originalPost.content,
        imageUrl: originalPost.imageUrl,
        platforms: originalPost.platforms,
        tags: originalPost.tags,
        status: 'DRAFT',
      });

      logger.info(`Post duplicated: ${postId} -> ${duplicatedPost.id}`);
      return duplicatedPost;
    } catch (error) {
      logger.error('Error duplicating post:', error);
      throw error;
    }
  }

  /**
   * Bulk operations on posts
   */
  async bulkOperations(action: string, postIds: string[]): Promise<any> {
    try {
      switch (action.toLowerCase()) {
        case 'delete':
          await prisma.post.deleteMany({
            where: { id: { in: postIds } },
          });
          break;
        case 'publish':
          await prisma.post.updateMany({
            where: { id: { in: postIds } },
            data: { status: 'PUBLISHED' },
          });
          break;
        case 'draft':
          await prisma.post.updateMany({
            where: { id: { in: postIds } },
            data: { status: 'DRAFT' },
          });
          break;
        default:
          throw new Error(`Unsupported bulk action: ${action}`);
      }

      logger.info(`Bulk ${action} completed for ${postIds.length} posts`);
      return { success: true, count: postIds.length };
    } catch (error) {
      logger.error('Error performing bulk operations:', error);
      throw error;
    }
  }

  /**
   * Get posts by platform
   */
  async getPostsByPlatform(platform: string, limit: number = 10): Promise<any[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          platforms: {
            has: platform,
          },
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          analytics: true,
        },
      });

      return posts;
    } catch (error) {
      logger.error('Error fetching posts by platform:', error);
      throw error;
    }
  }

  /**
   * Get scheduled posts
   */
  async getScheduledPosts(): Promise<any[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: {
            gte: new Date(),
          },
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          analytics: true,
        },
      });

      return posts;
    } catch (error) {
      logger.error('Error fetching scheduled posts:', error);
      throw error;
    }
  }

  /**
   * Get posts by status
   */
  async getPostsByStatus(status: string, limit: number = 10): Promise<any[]> {
    try {
      const posts = await prisma.post.findMany({
        where: { status },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          analytics: true,
        },
      });

      return posts;
    } catch (error) {
      logger.error('Error fetching posts by status:', error);
      throw error;
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, limit: number = 10): Promise<any[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          analytics: true,
        },
      });

      return posts;
    } catch (error) {
      logger.error('Error searching posts:', error);
      throw error;
    }
  }

  /**
   * Helper method to get date from period string
   */
  private getDateFromPeriod(period: string): Date {
    const now = new Date();
    const days = parseInt(period.replace('d', ''));
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }

  /**
   * Helper method to calculate analytics summary
   */
  private calculateAnalyticsSummary(analytics: any[]): any {
    if (analytics.length === 0) {
      return {
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        totalReach: 0,
        totalImpressions: 0,
        averageEngagement: 0,
      };
    }

    const summary = analytics.reduce(
      (acc, curr) => ({
        totalLikes: acc.totalLikes + (curr.likes || 0),
        totalShares: acc.totalShares + (curr.shares || 0),
        totalComments: acc.totalComments + (curr.comments || 0),
        totalReach: acc.totalReach + (curr.reach || 0),
        totalImpressions: acc.totalImpressions + (curr.impressions || 0),
      }),
      {
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        totalReach: 0,
        totalImpressions: 0,
      }
    );

    summary.averageEngagement = 
      (summary.totalLikes + summary.totalShares + summary.totalComments) / analytics.length;

    return summary;
  }
} 