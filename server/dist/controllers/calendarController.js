import { CalendarService } from '../services/calendarService.js';
import { logger } from '../utils/logger.js';
const calendarService = new CalendarService();
export class CalendarController {
    static async getEvents(req, res) {
        try {
            const userId = 'demo-user-id';
            const { startDate, endDate } = req.query;
            const events = await calendarService.getEvents(userId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.json({
                success: true,
                data: events,
            });
        }
        catch (error) {
            logger.error('Error fetching events:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch events',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async createEvent(req, res) {
        try {
            const userId = 'demo-user-id';
            const eventData = {
                ...req.body,
                userId,
                startDate: new Date(req.body.startDate),
                endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            };
            const event = await calendarService.createEvent(eventData);
            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: event,
            });
        }
        catch (error) {
            logger.error('Error creating event:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create event',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = 'demo-user-id';
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Event ID is required',
                });
                return;
            }
            const updateData = {
                ...req.body,
                startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
                endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
            };
            const event = await calendarService.updateEvent(id, userId, updateData);
            res.json({
                success: true,
                message: 'Event updated successfully',
                data: event,
            });
        }
        catch (error) {
            logger.error('Error updating event:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update event',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
    static async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const userId = 'demo-user-id';
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Event ID is required',
                });
                return;
            }
            const deleted = await calendarService.deleteEvent(id, userId);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Event not found',
                });
                return;
            }
            res.json({
                success: true,
                message: 'Event deleted successfully',
            });
        }
        catch (error) {
            logger.error('Error deleting event:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete event',
                error: process.env['NODE_ENV'] === 'development' ? error.message : undefined,
            });
        }
    }
}
//# sourceMappingURL=calendarController.js.map