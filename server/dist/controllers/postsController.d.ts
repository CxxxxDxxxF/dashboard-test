import { Request, Response } from 'express';
export declare class PostsController {
    static getAllPosts(req: Request, res: Response): Promise<void>;
    static getPostById(req: Request, res: Response): Promise<void>;
    static createPost(req: Request, res: Response): Promise<void>;
    static updatePost(req: Request, res: Response): Promise<void>;
    static deletePost(req: Request, res: Response): Promise<void>;
    static publishPost(req: Request, res: Response): Promise<void>;
    static getPostAnalytics(req: Request, res: Response): Promise<void>;
    static duplicatePost(req: Request, res: Response): Promise<void>;
    static bulkOperations(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=postsController.d.ts.map