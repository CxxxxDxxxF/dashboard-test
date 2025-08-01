import { Request, Response } from 'express';
import { MediaService } from '../services/mediaService.js';
import { logger } from '../utils/logger.js';

const mediaService = new MediaService();

export class MediaController {
  static async getMediaFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'demo-user-id';
      const { limit, offset, type, search } = req.query;
      
      let mediaFiles;
      
      if (search) {
        mediaFiles = await mediaService.searchMediaFiles(userId, search as string);
      } else if (type) {
        mediaFiles = await mediaService.getMediaFilesByType(userId, type as string);
      } else {
        mediaFiles = await mediaService.getMediaFiles(
          userId,
          limit ? parseInt(limit as string) : 50,
          offset ? parseInt(offset as string) : 0
        );
      }

      res.json({
        success: true,
        data: mediaFiles,
      });
    } catch (error) {
      logger.error('Error fetching media files:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch media files',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  static async uploadMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const userId = 'demo-user-id';
      
      // In a real implementation, you'd handle file upload here
      // For demo purposes, we'll create a mock file record
      const mediaFileData = {
        filename: req.body.filename || 'demo-file.jpg',
        originalName: req.body.originalName || 'demo-file.jpg',
        mimeType: req.body.mimeType || 'image/jpeg',
        size: req.body.size || 1024,
        url: req.body.url || 'https://example.com/demo-file.jpg',
        thumbnail: req.body.thumbnail,
        tags: req.body.tags || [],
        isPublic: req.body.isPublic !== false,
        userId,
      };

      const mediaFile = await mediaService.createMediaFile(mediaFileData);

      res.status(201).json({
        success: true,
        message: 'Media file uploaded successfully',
        data: mediaFile,
      });
    } catch (error) {
      logger.error('Error uploading media file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload media file',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  static async updateMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = 'demo-user-id';
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media file ID is required',
        });
        return;
      }

      const updateData = {
        ...req.body,
        tags: req.body.tags || [],
      };

      const mediaFile = await mediaService.updateMediaFile(id, userId, updateData);

      res.json({
        success: true,
        message: 'Media file updated successfully',
        data: mediaFile,
      });
    } catch (error) {
      logger.error('Error updating media file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update media file',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }

  static async deleteMediaFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = 'demo-user-id';

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media file ID is required',
        });
        return;
      }

      const deleted = await mediaService.deleteMediaFile(id, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Media file not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Media file deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting media file:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete media file',
        error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined,
      });
    }
  }
} 