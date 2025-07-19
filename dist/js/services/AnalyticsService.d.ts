interface AnalyticsData {
    followers: {
        total: number;
        change: number;
        platforms: {
            [key: string]: number;
        };
    };
    engagement: {
        rate: number;
        likes: number;
        comments: number;
        shares: number;
    };
    reach: {
        total: number;
        change: number;
        platforms: {
            [key: string]: number;
        };
    };
    posts: {
        total: number;
        scheduled: number;
        published: number;
    };
    topPosts: Array<{
        id: string;
        content: string;
        platform: string;
        engagement: number;
        reach: number;
        date: string;
    }>;
    platformData: {
        [key: string]: {
            followers: number;
            engagement: number;
            reach: number;
            posts: number;
        };
    };
}
declare class AnalyticsService {
    private baseUrl;
    constructor();
    fetchAnalyticsData(): Promise<AnalyticsData>;
    fetchPlatformData(platform: string): Promise<any>;
    private getMockData;
    renderFollowersChart(data: AnalyticsData): void;
    renderEngagementChart(data: AnalyticsData): void;
    renderReachChart(data: AnalyticsData): void;
    updateMetrics(data: AnalyticsData): void;
    renderTopPosts(data: AnalyticsData): void;
    initialize(): Promise<void>;
}
export { AnalyticsService, type AnalyticsData };
//# sourceMappingURL=AnalyticsService.d.ts.map