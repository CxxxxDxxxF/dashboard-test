import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';
const router = Router();
router.get('/', SettingsController.getUserSettings);
router.put('/', SettingsController.updateUserSettings);
router.post('/reset', SettingsController.resetUserSettings);
export default router;
//# sourceMappingURL=settingsRoutes.js.map