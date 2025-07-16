interface PostResult {
    platform: string;
    success: boolean;
    postId?: string;
    url?: string;
    error?: string;
    metrics?: {
        likes: number;
        shares: number;
        comments: number;
    };
}
export declare class SocialMediaService {
    private config;
    constructor();
    publishPost(post: any, platforms: string[]): Promise<PostResult[]>;
    private publishToFacebook;
    private publishToInstagram;
    private publishToTwitter;
    private mockFacebookPost;
    private mockInstagramPost;
    private mockTwitterPost;
    private updatePostStatus;
    getPostMetrics(postId: string, platform: string): Promise<any>;
    private mockPostMetrics;
    validateCredentials(platform: string): Promise<boolean>;
    private validateFacebookCredentials;
    private validateInstagramCredentials;
    private validateTwitterCredentials;
}
export {};
//# sourceMappingURL=socialMediaService.d.ts.map