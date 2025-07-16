import { Router } from 'express';
import { MediaController } from '../controllers/mediaController.js';
const router = Router();
router.get('/', MediaController.getMediaFiles);
router.post('/', MediaController.uploadMediaFile);
router.put('/:id', MediaController.updateMediaFile);
router.delete('/:id', MediaController.deleteMediaFile);
export default router;
//# sourceMappingURL=mediaRoutes.js.map