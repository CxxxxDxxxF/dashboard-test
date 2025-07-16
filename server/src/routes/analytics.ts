import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { validateAnalyticsQuery, validatePagination, validateExport } from '../middleware/validation.js';

const router = express.Router();

// Get overall dashboard analytics
router.get('/dashboard', validateAnalyticsQuery, AnalyticsController.getDashboardAnalytics);

// Get platform-specific analytics
router.get('/platform', validateAnalyticsQuery, AnalyticsController.getPlatformAnalytics);

// Get engagement metrics
router.get('/engagement', validateAnalyticsQuery, AnalyticsController.getEngagementMetrics);

// Get audience demographics
router.get('/demographics', validateAnalyticsQuery, AnalyticsController.getAudienceDemographics);

// Get content performance insights
router.get('/content', validateAnalyticsQuery, AnalyticsController.getContentInsights);

// Get growth trends
router.get('/trends', validateAnalyticsQuery, AnalyticsController.getGrowthTrends);

// Get competitor analysis
router.get('/competitors', validateAnalyticsQuery, AnalyticsController.getCompetitorAnalysis);

// Export analytics data
router.get('/export', validateExport, AnalyticsController.exportAnalytics);

// Get real-time analytics
router.get('/realtime', AnalyticsController.getRealTimeAnalytics);

export default router; 