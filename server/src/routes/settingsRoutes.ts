import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';

const router = Router();

// Get user settings
router.get('/', SettingsController.getUserSettings);

// Update user settings
router.put('/', SettingsController.updateUserSettings);

// Reset user settings to defaults
router.post('/reset', SettingsController.resetUserSettings);

export default router; 