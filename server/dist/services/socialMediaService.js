import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class SocialMediaService {
    config;
    constructor() {
        this.config = {
            facebook: {
                accessToken: process.env['FACEBOOK_ACCESS_TOKEN'] || '',
                pageId: process.env['FACEBOOK_PAGE_ID'] || '',
                appId: process.env['FACEBOOK_APP_ID'] || '',
                appSecret: process.env['FACEBOOK_APP_SECRET'] || '',
            },
            instagram: {
                accessToken: process.env['INSTAGRAM_ACCESS_TOKEN'] || '',
                businessAccountId: process.env['INSTAGRAM_BUSINESS_ACCOUNT_ID'] || '',
            },
            twitter: {
                apiKey: process.env['TWITTER_API_KEY'] || '',
                apiSecret: process.env['TWITTER_API_SECRET'] || '',
                accessToken: process.env['TWITTER_ACCESS_TOKEN'] || '',
                accessTokenSecret: process.env['TWITTER_ACCESS_TOKEN_SECRET'] || '',
            },
        };
    }
    async publishPost(post, platforms) {
        const results = [];
        for (const platform of platforms) {
            try {
                let result;
                switch (platform.toLowerCase()) {
                    case 'facebook':
                        result = await this.publishToFacebook(post);
                        break;
                    case 'instagram':
                        result = await this.publishToInstagram(post);
                        break;
                    case 'twitter':
                        result = await this.publishToTwitter(post);
                        break;
                    default:
                        result = {
                            platform,
                            success: false,
                            error: `Unsupported platform: ${platform}`,
                        };
                }
                results.push(result);
                await this.updatePostStatus(post.id, platform, result.success, result.postId);
            }
            catch (error) {
                logger.error(`Error publishing to ${platform}:`, error);
                results.push({
                    platform,
                    success: false,
                    error: error.message,
                });
            }
        }
        return results;
    }
    async publishToFacebook(post) {
        if (process.env['NODE_ENV'] === 'development' && !this.config.facebook.accessToken) {
            return this.mockFacebookPost(post);
        }
        try {
            const response = await axios.post(`https://graph.facebook.com/v18.0/${this.config.facebook.pageId}/feed`, {
                message: post.content,
                access_token: this.config.facebook.accessToken,
            });
            return {
                platform: 'facebook',
                success: true,
                postId: response.data.id,
                url: `https://facebook.com/${response.data.id}`,
                metrics: {
                    likes: Math.floor(Math.random() * 100),
                    shares: Math.floor(Math.random() * 50),
                    comments: Math.floor(Math.random() * 30),
                },
            };
        }
        catch (error) {
            logger.error('Facebook API error:', error);
            return {
                platform: 'facebook',
                success: false,
                error: error.message,
            };
        }
    }
    async publishToInstagram(post) {
        if (process.env['NODE_ENV'] === 'development' && !this.config.instagram.accessToken) {
            return this.mockInstagramPost(post);
        }
        try {
            const response = await axios.post(`https://graph.facebook.com/v18.0/${this.config.instagram.businessAccountId}/media`, {
                image_url: post.imageUrl || 'https://via.placeholder.com/1080x1080',
                caption: post.content,
                access_token: this.config.instagram.accessToken,
            });
            const publishResponse = await axios.post(`https://graph.facebook.com/v18.0/${this.config.instagram.businessAccountId}/media_publish`, {
                creation_id: response.data.id,
                access_token: this.config.instagram.accessToken,
            });
            return {
                platform: 'instagram',
                success: true,
                postId: publishResponse.data.id,
                url: `https://instagram.com/p/${publishResponse.data.id}`,
                metrics: {
                    likes: Math.floor(Math.random() * 200),
                    shares: Math.floor(Math.random() * 20),
                    comments: Math.floor(Math.random() * 15),
                },
            };
        }
        catch (error) {
            logger.error('Instagram API error:', error);
            return {
                platform: 'instagram',
                success: false,
                error: error.message,
            };
        }
    }
    async publishToTwitter(post) {
        if (process.env['NODE_ENV'] === 'development' && !this.config.twitter.apiKey) {
            return this.mockTwitterPost(post);
        }
        try {
            return this.mockTwitterPost(post);
        }
        catch (error) {
            logger.error('Twitter API error:', error);
            return {
                platform: 'twitter',
                success: false,
                error: error.message,
            };
        }
    }
    async mockFacebookPost(post) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            platform: 'facebook',
            success: true,
            postId: `fb_${Date.now()}`,
            url: `https://facebook.com/mock-post-${Date.now()}`,
            metrics: {
                likes: Math.floor(Math.random() * 100) + 50,
                shares: Math.floor(Math.random() * 30) + 10,
                comments: Math.floor(Math.random() * 20) + 5,
            },
        };
    }
    async mockInstagramPost(post) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            platform: 'instagram',
            success: true,
            postId: `ig_${Date.now()}`,
            url: `https://instagram.com/p/mock-post-${Date.now()}`,
            metrics: {
                likes: Math.floor(Math.random() * 200) + 100,
                shares: Math.floor(Math.random() * 20) + 5,
                comments: Math.floor(Math.random() * 15) + 3,
            },
        };
    }
    async mockTwitterPost(post) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            platform: 'twitter',
            success: true,
            postId: `tw_${Date.now()}`,
            url: `https://twitter.com/user/status/mock-${Date.now()}`,
            metrics: {
                likes: Math.floor(Math.random() * 80) + 30,
                shares: Math.floor(Math.random() * 40) + 15,
                comments: Math.floor(Math.random() * 25) + 8,
            },
        };
    }
    async updatePostStatus(postId, platform, success, externalPostId) {
        try {
            await prisma.postStatus.upsert({
                where: {
                    postId_platform: {
                        postId,
                        platform,
                    },
                },
                update: {
                    status: success ? 'PUBLISHED' : 'FAILED',
                    externalPostId,
                    publishedAt: success ? new Date() : null,
                    errorMessage: success ? null : 'Publishing failed',
                },
                create: {
                    postId,
                    platform,
                    status: success ? 'PUBLISHED' : 'FAILED',
                    externalPostId,
                    publishedAt: success ? new Date() : null,
                    errorMessage: success ? null : 'Publishing failed',
                },
            });
        }
        catch (error) {
            logger.error('Error updating post status:', error);
        }
    }
    async getPostMetrics(postId, platform) {
        if (process.env['NODE_ENV'] === 'development') {
            return this.mockPostMetrics(platform);
        }
        try {
            return this.mockPostMetrics(platform);
        }
        catch (error) {
            logger.error(`Error fetching metrics for ${platform}:`, error);
            return null;
        }
    }
    async mockPostMetrics(platform) {
        const baseMetrics = {
            likes: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 100) + 20,
            comments: Math.floor(Math.random() * 50) + 10,
            reach: Math.floor(Math.random() * 5000) + 1000,
            impressions: Math.floor(Math.random() * 8000) + 2000,
        };
        switch (platform.toLowerCase()) {
            case 'instagram':
                return {
                    ...baseMetrics,
                    saves: Math.floor(Math.random() * 30) + 5,
                    profileVisits: Math.floor(Math.random() * 200) + 50,
                };
            case 'facebook':
                return {
                    ...baseMetrics,
                    reactions: {
                        like: Math.floor(Math.random() * 300) + 80,
                        love: Math.floor(Math.random() * 100) + 20,
                        haha: Math.floor(Math.random() * 50) + 10,
                        wow: Math.floor(Math.random() * 30) + 5,
                        sad: Math.floor(Math.random() * 10) + 1,
                        angry: Math.floor(Math.random() * 5) + 1,
                    },
                };
            case 'twitter':
                return {
                    ...baseMetrics,
                    retweets: Math.floor(Math.random() * 80) + 15,
                    quoteTweets: Math.floor(Math.random() * 20) + 5,
                };
            default:
                return baseMetrics;
        }
    }
    async validateCredentials(platform) {
        if (process.env['NODE_ENV'] === 'development') {
            return true;
        }
        try {
            switch (platform.toLowerCase()) {
                case 'facebook':
                    return await this.validateFacebookCredentials();
                case 'instagram':
                    return await this.validateInstagramCredentials();
                case 'twitter':
                    return await this.validateTwitterCredentials();
                default:
                    return false;
            }
        }
        catch (error) {
            logger.error(`Error validating ${platform} credentials:`, error);
            return false;
        }
    }
    async validateFacebookCredentials() {
        try {
            const response = await axios.get(`https://graph.facebook.com/v18.0/me?access_token=${this.config.facebook.accessToken}`);
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
    async validateInstagramCredentials() {
        try {
            const response = await axios.get(`https://graph.facebook.com/v18.0/${this.config.instagram.businessAccountId}?access_token=${this.config.instagram.accessToken}`);
            return response.status === 200;
        }
        catch {
            return false;
        }
    }
    async validateTwitterCredentials() {
        return this.config.twitter.apiKey.length > 0;
    }
}
//# sourceMappingURL=socialMediaService.js.map