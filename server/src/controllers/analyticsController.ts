import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { AnalyticsService } from '../services/analyticsService.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  /**
   * Get overall dashboard analytics
   */
  static async getDashboardAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30d' } = req.query;
      
      const analytics = await analyticsService.getDashboardAnalytics(period as string);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error fetching dashboard analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard analytics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get social media platform analytics
   */
  static async getPlatformAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { platform, period = '30d' } = req.query;
      
      if (!platform) {
        res.status(400).json({
          success: false,
          message: 'Platform parameter is required',
        });
        return;
      }

      const analytics = await analyticsService.getPlatformAnalytics(
        platform as string,
        period as string
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error fetching platform analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform analytics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get engagement metrics
   */
  static async getEngagementMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30d', platform } = req.query;
      
      const metrics = await analyticsService.getEngagementMetrics({
        period: period as string,
        platform: platform as string,
      });

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      logger.error('Error fetching engagement metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch engagement metrics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get audience demographics
   */
  static async getAudienceDemographics(req: Request, res: Response): Promise<void> {
    try {
      const { platform } = req.query;
      
      const demographics = await analyticsService.getAudienceDemographics(platform as string);

      res.json({
        success: true,
        data: demographics,
      });
    } catch (error) {
      logger.error('Error fetching audience demographics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch audience demographics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get content performance insights
   */
  static async getContentInsights(req: Request, res: Response): Promise<void> {
    try {
      const { period = '30d', type } = req.query;
      
      const insights = await analyticsService.getContentInsights({
        period: period as string,
        type: type as string,
      });

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      logger.error('Error fetching content insights:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch content insights',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get growth trends
   */
  static async getGrowthTrends(req: Request, res: Response): Promise<void> {
    try {
      const { metric, period = '90d' } = req.query;
      
      if (!metric) {
        res.status(400).json({
          success: false,
          message: 'Metric parameter is required',
        });
        return;
      }

      const trends = await analyticsService.getGrowthTrends(
        metric as string,
        period as string
      );

      res.json({
        success: true,
        data: trends,
      });
    } catch (error) {
      logger.error('Error fetching growth trends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch growth trends',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get competitor analysis
   */
  static async getCompetitorAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { competitors } = req.query;
      
      if (!competitors) {
        res.status(400).json({
          success: false,
          message: 'Competitors parameter is required',
        });
        return;
      }

      const analysis = await analyticsService.getCompetitorAnalysis(
        competitors as string
      );

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      logger.error('Error fetching competitor analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch competitor analysis',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Export analytics data
   */
  static async exportAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { format = 'csv', period = '30d', metrics } = req.query;
      
      const exportData = await analyticsService.exportAnalytics({
        format: format as string,
        period: period as string,
        metrics: metrics as string,
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${Date.now()}.csv`);
      res.send(exportData);
    } catch (error) {
      logger.error('Error exporting analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export analytics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  /**
   * Get real-time analytics
   */
  static async getRealTimeAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const analytics = await analyticsService.getRealTimeAnalytics();

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Error fetching real-time analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch real-time analytics',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }
} 