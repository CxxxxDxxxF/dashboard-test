import express from 'express';
import { PostsController } from '../controllers/postsController.js';
import { validateCreatePost, validateUpdatePost, validatePostId, validatePagination, validateSearch, validateBulkOperations } from '../middleware/validation.js';

const router = express.Router();

// Get all posts with pagination and filtering
router.get('/', validatePagination, validateSearch, PostsController.getAllPosts);

// Get a single post
router.get('/:id', validatePostId, PostsController.getPostById);

// Create a new post
router.post('/', validateCreatePost, PostsController.createPost);

// Update a post
router.put('/:id', validateUpdatePost, PostsController.updatePost);

// Delete a post
router.delete('/:id', validatePostId, PostsController.deletePost);

// Publish a post to social media platforms
router.post('/:id/publish', validatePostId, PostsController.publishPost);

// Get post analytics
router.get('/:id/analytics', validatePostId, PostsController.getPostAnalytics);

// Duplicate a post
router.post('/:id/duplicate', validatePostId, PostsController.duplicatePost);

// Bulk operations on posts
router.post('/bulk', validateBulkOperations, PostsController.bulkOperations);

export default router; 