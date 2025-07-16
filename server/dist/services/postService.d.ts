interface PostFilters {
    page: number;
    limit: number;
    platform?: string;
    status?: string;
    search?: string;
}
interface PostData {
    title: string;
    content: string;
    imageUrl?: string;
    platforms: string[];
    scheduledAt?: Date;
    status?: string;
    tags?: string[];
}
export declare class PostService {
    getAllPosts(filters: PostFilters): Promise<any[]>;
    getPostById(id: string): Promise<any>;
    createPost(postData: PostData): Promise<any>;
    updatePost(id: string, updateData: Partial<PostData>): Promise<any>;
    deletePost(id: string): Promise<boolean>;
    schedulePost(postId: string, scheduledAt: Date): Promise<void>;
    getPostAnalytics(postId: string, period?: string): Promise<any>;
    duplicatePost(postId: string): Promise<any>;
    bulkOperations(action: string, postIds: string[]): Promise<any>;
    getPostsByPlatform(platform: string, limit?: number): Promise<any[]>;
    getScheduledPosts(): Promise<any[]>;
    getPostsByStatus(status: string, limit?: number): Promise<any[]>;
    searchPosts(query: string, limit?: number): Promise<any[]>;
    private getDateFromPeriod;
    private calculateAnalyticsSummary;
}
export {};
//# sourceMappingURL=postService.d.ts.map