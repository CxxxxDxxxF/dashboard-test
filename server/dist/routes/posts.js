import express from 'express';
import { PostsController } from '../controllers/postsController.js';
import { validateCreatePost, validateUpdatePost, validatePostId, validatePagination, validateSearch, validateBulkOperations } from '../middleware/validation.js';
const router = express.Router();
router.get('/', validatePagination, validateSearch, PostsController.getAllPosts);
router.get('/:id', validatePostId, PostsController.getPostById);
router.post('/', validateCreatePost, PostsController.createPost);
router.put('/:id', validateUpdatePost, PostsController.updatePost);
router.delete('/:id', validatePostId, PostsController.deletePost);
router.post('/:id/publish', validatePostId, PostsController.publishPost);
router.get('/:id/analytics', validatePostId, PostsController.getPostAnalytics);
router.post('/:id/duplicate', validatePostId, PostsController.duplicatePost);
router.post('/bulk', validateBulkOperations, PostsController.bulkOperations);
export default router;
//# sourceMappingURL=posts.js.map