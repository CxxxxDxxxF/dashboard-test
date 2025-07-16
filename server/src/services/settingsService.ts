import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

interface UserSettingsData {
  theme?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  userId: string;
}

export class SettingsService {
  /**
   * Get user settings
   */
  async getUserSettings(userId: string): Promise<any> {
    try {
      let settings = await prisma.userSettings.findUnique({
        where: { userId },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      // Create default settings if none exist
      if (!settings) {
        settings = await this.createDefaultSettings(userId);
      }

      return settings;
    } catch (error) {
      logger.error('Error fetching user settings:', error);
      throw error;
    }
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId: string, updateData: Partial<UserSettingsData>): Promise<any> {
    try {
      const settings = await prisma.userSettings.upsert({
        where: { userId },
        update: updateData,
        create: {
          ...updateData,
          userId,
          theme: updateData.theme || 'light',
          notifications: updateData.notifications ?? true,
          emailNotifications: updateData.emailNotifications ?? true,
          language: updateData.language || 'en',
          timezone: updateData.timezone || 'America/New_York',
          dateFormat: updateData.dateFormat || 'MM/DD/YYYY',
          timeFormat: updateData.timeFormat || '12h'
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      logger.info(`User settings updated: ${userId}`);
      return settings;
    } catch (error) {
      logger.error('Error updating user settings:', error);
      throw error;
    }
  }

  /**
   * Create default settings for a user
   */
  private async createDefaultSettings(userId: string): Promise<any> {
    try {
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId,
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          language: 'en',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h'
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      logger.info(`Default settings created for user: ${userId}`);
      return defaultSettings;
    } catch (error) {
      logger.error('Error creating default settings:', error);
      throw error;
    }
  }

  /**
   * Reset user settings to defaults
   */
  async resetUserSettings(userId: string): Promise<any> {
    try {
      const settings = await prisma.userSettings.update({
        where: { userId },
        data: {
          theme: 'light',
          notifications: true,
          emailNotifications: true,
          language: 'en',
          timezone: 'America/New_York',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h'
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      logger.info(`User settings reset: ${userId}`);
      return settings;
    } catch (error) {
      logger.error('Error resetting user settings:', error);
      throw error;
    }
  }

  /**
   * Get settings for multiple users (admin function)
   */
  async getMultipleUserSettings(userIds: string[]): Promise<any[]> {
    try {
      const settings = await prisma.userSettings.findMany({
        where: {
          userId: { in: userIds }
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return settings;
    } catch (error) {
      logger.error('Error fetching multiple user settings:', error);
      throw error;
    }
  }
} 