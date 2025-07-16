import express from 'express';
import { CalendarController } from '../controllers/calendarController.js';
const router = express.Router();
router.get('/', CalendarController.getEvents);
router.post('/', CalendarController.createEvent);
router.put('/:id', CalendarController.updateEvent);
router.delete('/:id', CalendarController.deleteEvent);
export default router;
//# sourceMappingURL=calendar.js.map