import { Request, Response } from 'express';
export declare class AnalyticsController {
    static getDashboardAnalytics(req: Request, res: Response): Promise<void>;
    static getPlatformAnalytics(req: Request, res: Response): Promise<void>;
    static getEngagementMetrics(req: Request, res: Response): Promise<void>;
    static getAudienceDemographics(req: Request, res: Response): Promise<void>;
    static getContentInsights(req: Request, res: Response): Promise<void>;
    static getGrowthTrends(req: Request, res: Response): Promise<void>;
    static getCompetitorAnalysis(req: Request, res: Response): Promise<void>;
    static exportAnalytics(req: Request, res: Response): Promise<void>;
    static getRealTimeAnalytics(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=analyticsController.d.ts.map