import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { MockDataService } from './mockDataService.js';

const prisma = new PrismaClient();

interface EventData {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  isAllDay?: boolean;
  color?: string;
  userId: string;
}

export class CalendarService {
  /**
   * Get all events for a user
   */
  async getEvents(userId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    // For demo purposes, always use mock data
    logger.info('Using mock events data for demo');
    return MockDataService.getMockEvents();
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string, userId: string): Promise<any> {
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
    } catch (error) {
      logger.error('Error fetching event:', error);
      throw error;
    }
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: EventData): Promise<any> {
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
    } catch (error) {
      logger.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: string, userId: string, updateData: Partial<EventData>): Promise<any> {
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
    } catch (error) {
      logger.error('Error updating event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.event.delete({
        where: { id, userId }
      });

      logger.info(`Event deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting event:', error);
      return false;
    }
  }

  /**
   * Get events for a specific date range
   */
  async getEventsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
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
    } catch (error) {
      logger.error('Error fetching events by date range:', error);
      throw error;
    }
  }
} 