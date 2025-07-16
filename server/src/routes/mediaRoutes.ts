import { Router } from 'express';
import { MediaController } from '../controllers/mediaController.js';

const router = Router();

// Get all media files with optional filtering
router.get('/', MediaController.getMediaFiles);

// Upload a new media file
router.post('/', MediaController.uploadMediaFile);

// Update a media file
router.put('/:id', MediaController.updateMediaFile);

// Delete a media file
router.delete('/:id', MediaController.deleteMediaFile);

export default router; 