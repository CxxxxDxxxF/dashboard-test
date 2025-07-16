import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { validateAnalyticsQuery, validateExport } from '../middleware/validation.js';
const router = express.Router();
router.get('/dashboard', validateAnalyticsQuery, AnalyticsController.getDashboardAnalytics);
router.get('/platform', validateAnalyticsQuery, AnalyticsController.getPlatformAnalytics);
router.get('/engagement', validateAnalyticsQuery, AnalyticsController.getEngagementMetrics);
router.get('/demographics', validateAnalyticsQuery, AnalyticsController.getAudienceDemographics);
router.get('/content', validateAnalyticsQuery, AnalyticsController.getContentInsights);
router.get('/trends', validateAnalyticsQuery, AnalyticsController.getGrowthTrends);
router.get('/competitors', validateAnalyticsQuery, AnalyticsController.getCompetitorAnalysis);
router.get('/export', validateExport, AnalyticsController.exportAnalytics);
router.get('/realtime', AnalyticsController.getRealTimeAnalytics);
export default router;
//# sourceMappingURL=analytics.js.map