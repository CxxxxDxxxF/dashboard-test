import express from 'express';
import { ComposerController } from '../controllers/composerController.js';

const router = express.Router();

router.post('/draft', ComposerController.draftPost);
router.post('/preview', ComposerController.previewPost);
router.post('/submit', ComposerController.submitPost);

export default router; 