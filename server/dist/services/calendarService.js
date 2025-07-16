import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class CalendarService {
    async getEvents(userId, startDate, endDate) {
        try {
            const where = { userId };
            if (startDate && endDate) {
                where.OR = [
                    { startDate: { gte: startDate, lte: endDate } },
                    { endDate: { gte: startDate, lte: endDate } },
                    {
                        AND: [
                            { startDate: { lte: startDate } },
                            { endDate: { gte: endDate } }
                        ]
                    }
                ];
            }
            const events = await prisma.event.findMany({
                where,
                orderBy: { startDate: 'asc' },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return events;
        }
        catch (error) {
            logger.error('Error fetching events:', error);
            throw error;
        }
    }
    async getEventById(id, userId) {
        try {
            const event = await prisma.event.findFirst({
                where: { id, userId },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return event;
        }
        catch (error) {
            logger.error('Error fetching event:', error);
            throw error;
        }
    }
    async createEvent(eventData) {
        try {
            const event = await prisma.event.create({
                data: eventData,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            logger.info(`Event created: ${event.id}`);
            return event;
        }
        catch (error) {
            logger.error('Error creating event:', error);
            throw error;
        }
    }
    async updateEvent(id, userId, updateData) {
        try {
            const event = await prisma.event.update({
                where: { id, userId },
                data: updateData,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            logger.info(`Event updated: ${id}`);
            return event;
        }
        catch (error) {
            logger.error('Error updating event:', error);
            throw error;
        }
    }
    async deleteEvent(id, userId) {
        try {
            await prisma.event.delete({
                where: { id, userId }
            });
            logger.info(`Event deleted: ${id}`);
            return true;
        }
        catch (error) {
            logger.error('Error deleting event:', error);
            return false;
        }
    }
    async getEventsByDateRange(userId, startDate, endDate) {
        try {
            const events = await prisma.event.findMany({
                where: {
                    userId,
                    OR: [
                        { startDate: { gte: startDate, lte: endDate } },
                        { endDate: { gte: startDate, lte: endDate } },
                        {
                            AND: [
                                { startDate: { lte: startDate } },
                                { endDate: { gte: endDate } }
                            ]
                        }
                    ]
                },
                orderBy: { startDate: 'asc' },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return events;
        }
        catch (error) {
            logger.error('Error fetching events by date range:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=calendarService.js.map