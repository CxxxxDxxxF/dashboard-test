import express from 'express';
import { SettingsController } from '../controllers/settingsController.js';
const router = express.Router();
router.get('/', SettingsController.getUserSettings);
router.put('/', SettingsController.updateUserSettings);
router.post('/reset', SettingsController.resetUserSettings);
export default router;
//# sourceMappingURL=settings.js.map