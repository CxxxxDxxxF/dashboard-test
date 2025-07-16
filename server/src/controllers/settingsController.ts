import { Request, Response } from 'express';
import { SettingsService } from '../services/settingsService.js';
import { logger } from '../utils/logger.js';

const settingsService = new SettingsService();

export class SettingsController {
  static async getUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'demo-user-id';
      
      const settings = await settingsService.getUserSettings(userId);

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      logger.error('Error fetching user settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user settings',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  static async updateUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'demo-user-id';
      
      const updateData = {
        ...req.body,
        userId,
      };

      const settings = await settingsService.updateUserSettings(userId, updateData);

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings,
      });
    } catch (error) {
      logger.error('Error updating user settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user settings',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  static async resetUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'demo-user-id';
      
      const settings = await settingsService.resetUserSettings(userId);

      res.json({
        success: true,
        message: 'Settings reset to defaults successfully',
        data: settings,
      });
    } catch (error) {
      logger.error('Error resetting user settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset user settings',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }
} 