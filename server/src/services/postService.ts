import { PrismaClient, Platform, PostStatus } from '@prisma/client';
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
    // For demo purposes, always use mock data
    logger.info('Using mock posts data for demo');
    return this.getMockPosts(filters);
  }

  /**
   * Get mock posts data for demo
   */
  private getMockPosts(filters: PostFilters): any[] {
    const mockPosts = [
      {
        id: '1',
        title: 'Welcome to Rutgers Golf Course!',
        content: 'Experience the beauty of our championship golf course. Perfect for students, faculty, and community members. Book your tee time today! 🏌️‍♂️⛳',
        imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
        platforms: ['INSTAGRAM', 'FACEBOOK'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['golf', 'rutgers', 'campus', 'sports'],
        engagement: {
          likes: 2847,
          comments: 156,
          shares: 89,
          views: 12450
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'instagram', username: 'rutgersgolf' }
      },
      {
        id: '2',
        title: 'Student Spotlight: Meet Our Golf Team Captain',
        content: 'Proud to introduce Sarah Johnson, our amazing golf team captain! Her dedication and leadership inspire us all. #StudentSpotlight #RutgersGolf',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        platforms: ['instagram'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['student', 'golf', 'leadership', 'spotlight'],
        engagement: {
          likes: 2156,
          comments: 89,
          shares: 45,
          views: 8920
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'instagram', username: 'rutgersgolf' }
      },
      {
        id: '3',
        title: 'Upcoming Tournament: Spring Championship',
        content: 'Mark your calendars! Our annual Spring Championship is just around the corner. Open to all skill levels. Register now at rutgers.edu/golf 🏆',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        platforms: ['facebook', 'instagram'],
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        publishedAt: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ['tournament', 'championship', 'spring', 'events'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'facebook', username: 'rutgersgolf' }
      },
      {
        id: '4',
        title: 'Golf Course Maintenance Update',
        content: 'Our greens are looking perfect after this week\'s maintenance! The course is in excellent condition for your next round. #CourseMaintenance #PerfectGreens',
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
        platforms: ['instagram'],
        status: 'PUBLISHED',
        scheduledAt: null,
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        tags: ['maintenance', 'greens', 'course', 'quality'],
        engagement: {
          likes: 936,
          comments: 23,
          shares: 12,
          views: 3450
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'instagram', username: 'rutgersgolf' }
      },
      {
        id: '5',
        title: 'Golf Lessons Available',
        content: 'New to golf? Our certified instructors are here to help! Book a lesson and improve your game. Perfect for beginners and intermediate players. 📚⛳',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        platforms: ['facebook'],
        status: 'DRAFT',
        scheduledAt: null,
        publishedAt: null,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        tags: ['lessons', 'instruction', 'beginners', 'learning'],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        user: { id: '1', name: 'Cristian', email: 'cristian@rutgers.edu' },
        socialAccount: { id: '1', platform: 'facebook', username: 'rutgersgolf' }
      }
    ];

    // Apply filters
    let filteredPosts = mockPosts;

    if (filters.platform) {
      filteredPosts = filteredPosts.filter(post => 
        post.platforms.includes(filters.platform!.toLowerCase())
      );
    }

    if (filters.status) {
      filteredPosts = filteredPosts.filter(post => 
        post.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    
    return filteredPosts.slice(startIndex, endIndex);
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
      logger.warn('Database query failed, using mock post data:', error);
      return this.getMockPostById(id);
    }
  }

  /**
   * Get mock post by ID
   */
  private getMockPostById(id: string): any {
    const mockPosts = this.getMockPosts({ page: 1, limit: 10 });
    return mockPosts.find(post => post.id === id) || null;
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