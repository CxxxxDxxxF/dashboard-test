import { logger } from '../utils/logger.js';
import { AnalyticsService } from '../services/analyticsService.js';
const analyticsService = new AnalyticsService();
export class AnalyticsController {
    static async getDashboardAnalytics(req, res) {
        try {
            const { period = '30d' } = req.query;
            const analytics = await analyticsService.getDashboardAnalytics(period);
            res.json({
                success: true,
                data: analytics,
            });
        }
        catch (error) {
            logger.error('Error fetching dashboard analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard analytics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getPlatformAnalytics(req, res) {
        try {
            const { platform, period = '30d' } = req.query;
            if (!platform) {
                res.status(400).json({
                    success: false,
                    message: 'Platform parameter is required',
                });
                return;
            }
            const analytics = await analyticsService.getPlatformAnalytics(platform, period);
            res.json({
                success: true,
                data: analytics,
            });
        }
        catch (error) {
            logger.error('Error fetching platform analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch platform analytics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getEngagementMetrics(req, res) {
        try {
            const { period = '30d', platform } = req.query;
            const metrics = await analyticsService.getEngagementMetrics({
                period: period,
                platform: platform,
            });
            res.json({
                success: true,
                data: metrics,
            });
        }
        catch (error) {
            logger.error('Error fetching engagement metrics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch engagement metrics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getAudienceDemographics(req, res) {
        try {
            const { platform } = req.query;
            const demographics = await analyticsService.getAudienceDemographics(platform);
            res.json({
                success: true,
                data: demographics,
            });
        }
        catch (error) {
            logger.error('Error fetching audience demographics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch audience demographics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getContentInsights(req, res) {
        try {
            const { period = '30d', type } = req.query;
            const insights = await analyticsService.getContentInsights({
                period: period,
                type: type,
            });
            res.json({
                success: true,
                data: insights,
            });
        }
        catch (error) {
            logger.error('Error fetching content insights:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch content insights',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getGrowthTrends(req, res) {
        try {
            const { metric, period = '90d' } = req.query;
            if (!metric) {
                res.status(400).json({
                    success: false,
                    message: 'Metric parameter is required',
                });
                return;
            }
            const trends = await analyticsService.getGrowthTrends(metric, period);
            res.json({
                success: true,
                data: trends,
            });
        }
        catch (error) {
            logger.error('Error fetching growth trends:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch growth trends',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getCompetitorAnalysis(req, res) {
        try {
            const { competitors } = req.query;
            if (!competitors) {
                res.status(400).json({
                    success: false,
                    message: 'Competitors parameter is required',
                });
                return;
            }
            const analysis = await analyticsService.getCompetitorAnalysis(competitors);
            res.json({
                success: true,
                data: analysis,
            });
        }
        catch (error) {
            logger.error('Error fetching competitor analysis:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch competitor analysis',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async exportAnalytics(req, res) {
        try {
            const { format = 'csv', period = '30d', metrics } = req.query;
            const exportData = await analyticsService.exportAnalytics({
                format: format,
                period: period,
                metrics: metrics,
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=analytics-${Date.now()}.csv`);
            res.send(exportData);
        }
        catch (error) {
            logger.error('Error exporting analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to export analytics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async getRealTimeAnalytics(req, res) {
        try {
            const analytics = await analyticsService.getRealTimeAnalytics();
            res.json({
                success: true,
                data: analytics,
            });
        }
        catch (error) {
            logger.error('Error fetching real-time analytics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch real-time analytics',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
}
//# sourceMappingURL=analyticsController.js.map