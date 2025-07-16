import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class AnalyticsService {
    async getDashboardAnalytics(period = '30d') {
        try {
            const startDate = this.getDateFromPeriod(period);
            const [totalPosts, totalEngagement, platformStats, topPosts, growthMetrics,] = await Promise.all([
                this.getTotalPosts(startDate),
                this.getTotalEngagement(startDate),
                this.getPlatformStats(startDate),
                this.getTopPosts(startDate, 5),
                this.getGrowthMetrics(startDate),
            ]);
            return {
                overview: {
                    totalPosts,
                    totalEngagement,
                    averageEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
                },
                platformStats,
                topPosts,
                growthMetrics,
                period,
            };
        }
        catch (error) {
            logger.error('Error fetching dashboard analytics:', error);
            throw error;
        }
    }
    async getPlatformAnalytics(platform, period = '30d') {
        try {
            const startDate = this.getDateFromPeriod(period);
            const [posts, engagement, demographics, performance,] = await Promise.all([
                this.getPostsByPlatform(platform, startDate),
                this.getEngagementByPlatform(platform, startDate),
                this.getDemographicsByPlatform(platform),
                this.getPerformanceByPlatform(platform, startDate),
            ]);
            return {
                platform,
                posts,
                engagement,
                demographics,
                performance,
                period,
            };
        }
        catch (error) {
            logger.error('Error fetching platform analytics:', error);
            throw error;
        }
    }
    async getEngagementMetrics(filters) {
        try {
            const startDate = this.getDateFromPeriod(filters.period || '30d');
            const metrics = await prisma.post.groupBy({
                by: ['platforms'],
                where: {
                    createdAt: { gte: startDate },
                    ...(filters.platform && { platforms: { has: filters.platform } }),
                },
                _sum: {
                    likes: true,
                    shares: true,
                    comments: true,
                },
                _count: {
                    id: true,
                },
            });
            return metrics.map(metric => ({
                platform: metric.platforms,
                posts: metric._count.id,
                totalLikes: metric._sum.likes || 0,
                totalShares: metric._sum.shares || 0,
                totalComments: metric._sum.comments || 0,
                totalEngagement: (metric._sum.likes || 0) + (metric._sum.shares || 0) + (metric._sum.comments || 0),
                averageEngagement: metric._count.id > 0
                    ? ((metric._sum.likes || 0) + (metric._sum.shares || 0) + (metric._sum.comments || 0)) / metric._count.id
                    : 0,
            }));
        }
        catch (error) {
            logger.error('Error fetching engagement metrics:', error);
            throw error;
        }
    }
    async getAudienceDemographics(platform) {
        try {
            const demographics = {
                ageGroups: {
                    '18-24': Math.floor(Math.random() * 30) + 10,
                    '25-34': Math.floor(Math.random() * 40) + 20,
                    '35-44': Math.floor(Math.random() * 25) + 15,
                    '45-54': Math.floor(Math.random() * 15) + 5,
                    '55+': Math.floor(Math.random() * 10) + 2,
                },
                gender: {
                    male: Math.floor(Math.random() * 60) + 30,
                    female: Math.floor(Math.random() * 60) + 30,
                    other: Math.floor(Math.random() * 10) + 2,
                },
                locations: [
                    { country: 'United States', percentage: Math.floor(Math.random() * 40) + 30 },
                    { country: 'Canada', percentage: Math.floor(Math.random() * 20) + 10 },
                    { country: 'United Kingdom', percentage: Math.floor(Math.random() * 15) + 5 },
                    { country: 'Australia', percentage: Math.floor(Math.random() * 10) + 3 },
                ],
                interests: [
                    'Technology', 'Sports', 'Education', 'Entertainment', 'Business',
                ].map(interest => ({
                    interest,
                    percentage: Math.floor(Math.random() * 30) + 10,
                })),
            };
            return demographics;
        }
        catch (error) {
            logger.error('Error fetching audience demographics:', error);
            throw error;
        }
    }
    async getContentInsights(filters) {
        try {
            const startDate = this.getDateFromPeriod(filters.period || '30d');
            const posts = await prisma.post.findMany({
                where: {
                    createdAt: { gte: startDate },
                    ...(filters.platform && { platforms: { has: filters.platform } }),
                },
                orderBy: { likes: 'desc' },
                take: 10,
            });
            const insights = {
                topPerformingPosts: posts.slice(0, 5),
                contentTypes: this.analyzeContentTypes(posts),
                bestPostingTimes: this.getBestPostingTimes(posts),
                hashtagPerformance: this.analyzeHashtags(posts),
            };
            return insights;
        }
        catch (error) {
            logger.error('Error fetching content insights:', error);
            throw error;
        }
    }
    async getGrowthTrends(metric, period = '90d') {
        try {
            const startDate = this.getDateFromPeriod(period);
            const days = parseInt(period.replace('d', ''));
            const trends = [];
            for (let i = 0; i < days; i += 7) {
                const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                const weekEnd = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
                const weekData = await this.getMetricForPeriod(metric, date, weekEnd);
                trends.push({
                    date: date.toISOString().split('T')[0],
                    value: weekData,
                });
            }
            return {
                metric,
                trends,
                growth: this.calculateGrowthRate(trends),
            };
        }
        catch (error) {
            logger.error('Error fetching growth trends:', error);
            throw error;
        }
    }
    async getCompetitorAnalysis(competitors) {
        try {
            const competitorList = competitors.split(',').map(c => c.trim());
            const analysis = competitorList.map(competitor => ({
                name: competitor,
                followers: Math.floor(Math.random() * 100000) + 10000,
                engagement: Math.floor(Math.random() * 5) + 1,
                posts: Math.floor(Math.random() * 100) + 20,
                avgLikes: Math.floor(Math.random() * 500) + 100,
                avgComments: Math.floor(Math.random() * 50) + 10,
            }));
            return {
                competitors: analysis,
                comparison: this.compareWithCompetitors(analysis),
            };
        }
        catch (error) {
            logger.error('Error fetching competitor analysis:', error);
            throw error;
        }
    }
    async exportAnalytics(options) {
        try {
            const startDate = this.getDateFromPeriod(options.period);
            const metrics = options.metrics.split(',');
            const data = await this.getExportData(metrics, startDate);
            if (options.format === 'csv') {
                return this.convertToCSV(data);
            }
            return JSON.stringify(data, null, 2);
        }
        catch (error) {
            logger.error('Error exporting analytics:', error);
            throw error;
        }
    }
    async getRealTimeAnalytics() {
        try {
            const now = new Date();
            const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
            const [recentPosts, recentEngagement, activeUsers,] = await Promise.all([
                this.getRecentPosts(lastHour),
                this.getRecentEngagement(lastHour),
                this.getActiveUsers(),
            ]);
            return {
                recentPosts,
                recentEngagement,
                activeUsers,
                timestamp: now.toISOString(),
            };
        }
        catch (error) {
            logger.error('Error fetching real-time analytics:', error);
            throw error;
        }
    }
    getDateFromPeriod(period) {
        const now = new Date();
        const days = parseInt(period.replace('d', ''));
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
    async getTotalPosts(startDate) {
        return await prisma.post.count({
            where: { createdAt: { gte: startDate } },
        });
    }
    async getTotalEngagement(startDate) {
        const result = await prisma.post.aggregate({
            where: { createdAt: { gte: startDate } },
            _sum: {
                likes: true,
                shares: true,
                comments: true,
            },
        });
        return (result._sum.likes || 0) + (result._sum.shares || 0) + (result._sum.comments || 0);
    }
    async getPlatformStats(startDate) {
        return await prisma.post.groupBy({
            by: ['platforms'],
            where: { createdAt: { gte: startDate } },
            _count: { id: true },
            _sum: { likes: true, shares: true, comments: true },
        });
    }
    async getTopPosts(startDate, limit) {
        return await prisma.post.findMany({
            where: { createdAt: { gte: startDate } },
            orderBy: { likes: 'desc' },
            take: limit,
        });
    }
    async getGrowthMetrics(startDate) {
        const currentPeriod = await this.getTotalPosts(startDate);
        const previousStart = new Date(startDate.getTime() - (startDate.getTime() - new Date().getTime()));
        const previousPeriod = await this.getTotalPosts(previousStart);
        return {
            growth: previousPeriod > 0 ? ((currentPeriod - previousPeriod) / previousPeriod) * 100 : 0,
            trend: currentPeriod > previousPeriod ? 'up' : 'down',
        };
    }
    async getPostsByPlatform(platform, startDate) {
        return await prisma.post.findMany({
            where: {
                platforms: { has: platform },
                createdAt: { gte: startDate },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getEngagementByPlatform(platform, startDate) {
        const result = await prisma.post.aggregate({
            where: {
                platforms: { has: platform },
                createdAt: { gte: startDate },
            },
            _sum: { likes: true, shares: true, comments: true },
        });
        return {
            likes: result._sum.likes || 0,
            shares: result._sum.shares || 0,
            comments: result._sum.comments || 0,
            total: (result._sum.likes || 0) + (result._sum.shares || 0) + (result._sum.comments || 0),
        };
    }
    async getDemographicsByPlatform(platform) {
        return this.getAudienceDemographics(platform);
    }
    async getPerformanceByPlatform(platform, startDate) {
        const posts = await this.getPostsByPlatform(platform, startDate);
        return {
            totalPosts: posts.length,
            averageEngagement: posts.length > 0
                ? posts.reduce((sum, post) => sum + (post.likes || 0) + (post.shares || 0) + (post.comments || 0), 0) / posts.length
                : 0,
            bestPerformingPost: posts[0] || null,
        };
    }
    analyzeContentTypes(posts) {
        const types = posts.reduce((acc, post) => {
            const type = post.imageUrl ? 'image' : 'text';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(types).map(([type, count]) => ({
            type,
            count,
            percentage: (count / posts.length) * 100,
        }));
    }
    getBestPostingTimes(posts) {
        const times = posts.map(post => new Date(post.createdAt).getHours());
        const timeCounts = times.reduce((acc, hour) => {
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(timeCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }
    analyzeHashtags(posts) {
        const hashtags = posts
            .flatMap(post => post.content.match(/#\w+/g) || [])
            .reduce((acc, hashtag) => {
            acc[hashtag] = (acc[hashtag] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(hashtags)
            .map(([hashtag, count]) => ({ hashtag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    async getMetricForPeriod(metric, startDate, endDate) {
        const result = await prisma.post.aggregate({
            where: {
                createdAt: { gte: startDate, lt: endDate },
            },
            _sum: { [metric]: true },
        });
        return result._sum[metric] || 0;
    }
    calculateGrowthRate(trends) {
        if (trends.length < 2)
            return 0;
        const first = trends[0].value;
        const last = trends[trends.length - 1].value;
        return first > 0 ? ((last - first) / first) * 100 : 0;
    }
    compareWithCompetitors(competitors) {
        const avgEngagement = competitors.reduce((sum, c) => sum + c.engagement, 0) / competitors.length;
        const avgFollowers = competitors.reduce((sum, c) => sum + c.followers, 0) / competitors.length;
        return {
            averageEngagement: avgEngagement,
            averageFollowers: avgFollowers,
            ranking: competitors.length + 1,
        };
    }
    async getExportData(metrics, startDate) {
        const posts = await prisma.post.findMany({
            where: { createdAt: { gte: startDate } },
            select: {
                id: true,
                title: true,
                content: true,
                platforms: true,
                createdAt: true,
                likes: true,
                shares: true,
                comments: true,
            },
        });
        return posts.map(post => {
            const data = {
                id: post.id,
                title: post.title,
                content: post.content,
                platforms: post.platforms,
                createdAt: post.createdAt,
            };
            metrics.forEach(metric => {
                if (post[metric] !== undefined) {
                    data[metric] = post[metric];
                }
            });
            return data;
        });
    }
    convertToCSV(data) {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(',')),
        ];
        return csvRows.join('\n');
    }
    async getRecentPosts(startDate) {
        return await prisma.post.count({
            where: { createdAt: { gte: startDate } },
        });
    }
    async getRecentEngagement(startDate) {
        const result = await prisma.post.aggregate({
            where: { createdAt: { gte: startDate } },
            _sum: { likes: true, shares: true, comments: true },
        });
        return (result._sum.likes || 0) + (result._sum.shares || 0) + (result._sum.comments || 0);
    }
    async getActiveUsers() {
        return Math.floor(Math.random() * 100) + 50;
    }
}
//# sourceMappingURL=analyticsService.js.map