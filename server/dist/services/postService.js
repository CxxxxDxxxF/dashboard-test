import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class PostService {
    async getAllPosts(filters) {
        try {
            const skip = (filters.page - 1) * filters.limit;
            const where = {};
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
        }
        catch (error) {
            logger.error('Error fetching posts:', error);
            throw error;
        }
    }
    async getPostById(id) {
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
        }
        catch (error) {
            logger.error('Error fetching post:', error);
            throw error;
        }
    }
    async createPost(postData) {
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
        }
        catch (error) {
            logger.error('Error creating post:', error);
            throw error;
        }
    }
    async updatePost(id, updateData) {
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
        }
        catch (error) {
            logger.error('Error updating post:', error);
            throw error;
        }
    }
    async deletePost(id) {
        try {
            await prisma.post.delete({
                where: { id },
            });
            logger.info(`Post deleted: ${id}`);
            return true;
        }
        catch (error) {
            logger.error('Error deleting post:', error);
            return false;
        }
    }
    async schedulePost(postId, scheduledAt) {
        try {
            await prisma.post.update({
                where: { id: postId },
                data: {
                    status: 'SCHEDULED',
                    scheduledAt,
                },
            });
            logger.info(`Post scheduled: ${postId} for ${scheduledAt}`);
        }
        catch (error) {
            logger.error('Error scheduling post:', error);
            throw error;
        }
    }
    async getPostAnalytics(postId, period = '7d') {
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
        }
        catch (error) {
            logger.error('Error fetching post analytics:', error);
            throw error;
        }
    }
    async duplicatePost(postId) {
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
        }
        catch (error) {
            logger.error('Error duplicating post:', error);
            throw error;
        }
    }
    async bulkOperations(action, postIds) {
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
        }
        catch (error) {
            logger.error('Error performing bulk operations:', error);
            throw error;
        }
    }
    async getPostsByPlatform(platform, limit = 10) {
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
        }
        catch (error) {
            logger.error('Error fetching posts by platform:', error);
            throw error;
        }
    }
    async getScheduledPosts() {
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
        }
        catch (error) {
            logger.error('Error fetching scheduled posts:', error);
            throw error;
        }
    }
    async getPostsByStatus(status, limit = 10) {
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
        }
        catch (error) {
            logger.error('Error fetching posts by status:', error);
            throw error;
        }
    }
    async searchPosts(query, limit = 10) {
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
        }
        catch (error) {
            logger.error('Error searching posts:', error);
            throw error;
        }
    }
    getDateFromPeriod(period) {
        const now = new Date();
        const days = parseInt(period.replace('d', ''));
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    calculateAnalyticsSummary(analytics) {
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
        const summary = analytics.reduce((acc, curr) => ({
            totalLikes: acc.totalLikes + (curr.likes || 0),
            totalShares: acc.totalShares + (curr.shares || 0),
            totalComments: acc.totalComments + (curr.comments || 0),
            totalReach: acc.totalReach + (curr.reach || 0),
            totalImpressions: acc.totalImpressions + (curr.impressions || 0),
        }), {
            totalLikes: 0,
            totalShares: 0,
            totalComments: 0,
            totalReach: 0,
            totalImpressions: 0,
        });
        summary.averageEngagement =
            (summary.totalLikes + summary.totalShares + summary.totalComments) / analytics.length;
        return summary;
    }
}
//# sourceMappingURL=postService.js.map