interface AnalyticsFilters {
    period?: string;
    platform?: string;
    type?: string;
}
export declare class AnalyticsService {
    getDashboardAnalytics(period?: string): Promise<any>;
    getPlatformAnalytics(platform: string, period?: string): Promise<any>;
    getEngagementMetrics(filters: AnalyticsFilters): Promise<any>;
    getAudienceDemographics(platform?: string): Promise<any>;
    getContentInsights(filters: AnalyticsFilters): Promise<any>;
    getGrowthTrends(metric: string, period?: string): Promise<any>;
    getCompetitorAnalysis(competitors: string): Promise<any>;
    exportAnalytics(options: {
        format: string;
        period: string;
        metrics: string;
    }): Promise<string>;
    getRealTimeAnalytics(): Promise<any>;
    private getDateFromPeriod;
    private getTotalPosts;
    private getTotalEngagement;
    private getPlatformStats;
    private getTopPosts;
    private getGrowthMetrics;
    private getPostsByPlatform;
    private getEngagementByPlatform;
    private getDemographicsByPlatform;
    private getPerformanceByPlatform;
    private analyzeContentTypes;
    private getBestPostingTimes;
    private analyzeHashtags;
    private getMetricForPeriod;
    private calculateGrowthRate;
    private compareWithCompetitors;
    private getExportData;
    private convertToCSV;
    private getRecentPosts;
    private getRecentEngagement;
    private getActiveUsers;
}
export {};
//# sourceMappingURL=analyticsService.d.ts.map