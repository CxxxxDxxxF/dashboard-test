import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

interface AnalyticsFilters {
  period?: string;
  platform?: string;
  type?: string;
}

export class AnalyticsService {
  /**
   * Get overall dashboard analytics
   */
  async getDashboardAnalytics(period: string = '30d'): Promise<any> {
    try {
      const startDate = this.getDateFromPeriod(period);
      
      const [
        totalPosts,
        totalEngagement,
        platformStats,
        topPosts,
        growthMetrics,
      ] = await Promise.all([
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
    } catch (error) {
      logger.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  /**
   * Get platform-specific analytics
   */
  async getPlatformAnalytics(platform: string, period: string = '30d'): Promise<any> {
    try {
      const startDate = this.getDateFromPeriod(period);
      
      const [
        posts,
        engagement,
        demographics,
        performance,
      ] = await Promise.all([
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
    } catch (error) {
      logger.error('Error fetching platform analytics:', error);
      throw error;
    }
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(filters: AnalyticsFilters): Promise<any> {
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
    } catch (error) {
      logger.error('Error fetching engagement metrics:', error);
      throw error;
    }
  }

  /**
   * Get audience demographics
   */
  async getAudienceDemographics(platform?: string): Promise<any> {
    try {
      // In a real implementation, this would fetch from social media APIs
      // For now, returning mock data
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
    } catch (error) {
      logger.error('Error fetching audience demographics:', error);
      throw error;
    }
  }

  /**
   * Get content performance insights
   */
  async getContentInsights(filters: AnalyticsFilters): Promise<any> {
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
    } catch (error) {
      logger.error('Error fetching content insights:', error);
      throw error;
    }
  }

  /**
   * Get growth trends
   */
  async getGrowthTrends(metric: string, period: string = '90d'): Promise<any> {
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
    } catch (error) {
      logger.error('Error fetching growth trends:', error);
      throw error;
    }
  }

  /**
   * Get competitor analysis
   */
  async getCompetitorAnalysis(competitors: string): Promise<any> {
    try {
      const competitorList = competitors.split(',').map(c => c.trim());
      
      // In a real implementation, this would fetch from competitor APIs
      // For now, returning mock data
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
    } catch (error) {
      logger.error('Error fetching competitor analysis:', error);
      throw error;
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(options: { format: string; period: string; metrics: string }): Promise<string> {
    try {
      const startDate = this.getDateFromPeriod(options.period);
      const metrics = options.metrics.split(',');
      
      const data = await this.getExportData(metrics, startDate);
      
      if (options.format === 'csv') {
        return this.convertToCSV(data);
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      logger.error('Error exporting analytics:', error);
      throw error;
    }
  }

  /**
   * Get real-time analytics
   */
  async getRealTimeAnalytics(): Promise<any> {
    try {
      const now = new Date();
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
      
      const [
        recentPosts,
        recentEngagement,
        activeUsers,
      ] = await Promise.all([
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
    } catch (error) {
      logger.error('Error fetching real-time analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private getDateFromPeriod(period: string): Date {
    const now = new Date();
    const days = parseInt(period.replace('d', ''));
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }

  private async getTotalPosts(startDate: Date): Promise<number> {
    return await prisma.post.count({
      where: { createdAt: { gte: startDate } },
    });
  }

  private async getTotalEngagement(startDate: Date): Promise<number> {
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

  private async getPlatformStats(startDate: Date): Promise<any[]> {
    return await prisma.post.groupBy({
      by: ['platforms'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      _sum: { likes: true, shares: true, comments: true },
    });
  }

  private async getTopPosts(startDate: Date, limit: number): Promise<any[]> {
    return await prisma.post.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { likes: 'desc' },
      take: limit,
    });
  }

  private async getGrowthMetrics(startDate: Date): Promise<any> {
    const currentPeriod = await this.getTotalPosts(startDate);
    const previousStart = new Date(startDate.getTime() - (startDate.getTime() - new Date().getTime()));
    const previousPeriod = await this.getTotalPosts(previousStart);

    return {
      growth: previousPeriod > 0 ? ((currentPeriod - previousPeriod) / previousPeriod) * 100 : 0,
      trend: currentPeriod > previousPeriod ? 'up' : 'down',
    };
  }

  private async getPostsByPlatform(platform: string, startDate: Date): Promise<any[]> {
    return await prisma.post.findMany({
      where: {
        platforms: { has: platform },
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async getEngagementByPlatform(platform: string, startDate: Date): Promise<any> {
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

  private async getDemographicsByPlatform(platform: string): Promise<any> {
    // Mock demographics data
    return this.getAudienceDemographics(platform);
  }

  private async getPerformanceByPlatform(platform: string, startDate: Date): Promise<any> {
    const posts = await this.getPostsByPlatform(platform, startDate);
    
    return {
      totalPosts: posts.length,
      averageEngagement: posts.length > 0 
        ? posts.reduce((sum, post) => sum + (post.likes || 0) + (post.shares || 0) + (post.comments || 0), 0) / posts.length 
        : 0,
      bestPerformingPost: posts[0] || null,
    };
  }

  private analyzeContentTypes(posts: any[]): any {
    const types = posts.reduce((acc, post) => {
      const type = post.imageUrl ? 'image' : 'text';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      percentage: (count as number / posts.length) * 100,
    }));
  }

  private getBestPostingTimes(posts: any[]): any[] {
    const times = posts.map(post => new Date(post.createdAt).getHours());
    const timeCounts = times.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(timeCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private analyzeHashtags(posts: any[]): any[] {
    const hashtags = posts
      .flatMap(post => post.content.match(/#\w+/g) || [])
      .reduce((acc, hashtag) => {
        acc[hashtag] = (acc[hashtag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(hashtags)
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private async getMetricForPeriod(metric: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.post.aggregate({
      where: {
        createdAt: { gte: startDate, lt: endDate },
      },
      _sum: { [metric]: true },
    });

    return result._sum[metric as keyof typeof result._sum] || 0;
  }

  private calculateGrowthRate(trends: any[]): number {
    if (trends.length < 2) return 0;
    
    const first = trends[0].value;
    const last = trends[trends.length - 1].value;
    
    return first > 0 ? ((last - first) / first) * 100 : 0;
  }

  private compareWithCompetitors(competitors: any[]): any {
    const avgEngagement = competitors.reduce((sum, c) => sum + c.engagement, 0) / competitors.length;
    const avgFollowers = competitors.reduce((sum, c) => sum + c.followers, 0) / competitors.length;

    return {
      averageEngagement: avgEngagement,
      averageFollowers: avgFollowers,
      ranking: competitors.length + 1, // Assuming we're not in the list
    };
  }

  private async getExportData(metrics: string[], startDate: Date): Promise<any[]> {
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
      const data: any = {
        id: post.id,
        title: post.title,
        content: post.content,
        platforms: post.platforms,
        createdAt: post.createdAt,
      };

      metrics.forEach(metric => {
        if (post[metric as keyof typeof post] !== undefined) {
          data[metric] = post[metric as keyof typeof post];
        }
      });

      return data;
    });
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  private async getRecentPosts(startDate: Date): Promise<number> {
    return await prisma.post.count({
      where: { createdAt: { gte: startDate } },
    });
  }

  private async getRecentEngagement(startDate: Date): Promise<number> {
    const result = await prisma.post.aggregate({
      where: { createdAt: { gte: startDate } },
      _sum: { likes: true, shares: true, comments: true },
    });

    return (result._sum.likes || 0) + (result._sum.shares || 0) + (result._sum.comments || 0);
  }

  private async getActiveUsers(): Promise<number> {
    // Mock active users count
    return Math.floor(Math.random() * 100) + 50;
  }
} 