import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class SettingsService {
    async getUserSettings(userId) {
        try {
            let settings = await prisma.userSettings.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            if (!settings) {
                settings = await this.createDefaultSettings(userId);
            }
            return settings;
        }
        catch (error) {
            logger.error('Error fetching user settings:', error);
            throw error;
        }
    }
    async updateUserSettings(userId, updateData) {
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
        }
        catch (error) {
            logger.error('Error updating user settings:', error);
            throw error;
        }
    }
    async createDefaultSettings(userId) {
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
        }
        catch (error) {
            logger.error('Error creating default settings:', error);
            throw error;
        }
    }
    async resetUserSettings(userId) {
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
        }
        catch (error) {
            logger.error('Error resetting user settings:', error);
            throw error;
        }
    }
    async getMultipleUserSettings(userIds) {
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
        }
        catch (error) {
            logger.error('Error fetching multiple user settings:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=settingsService.js.map