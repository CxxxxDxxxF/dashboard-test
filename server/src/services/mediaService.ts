import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { MockDataService } from './mockDataService.js';

const prisma = new PrismaClient();

interface MediaFileData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnail?: string;
  tags?: string[];
  isPublic?: boolean;
  userId: string;
}

export class MediaService {
  /**
   * Get all media files for a user
   */
  async getMediaFiles(userId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    // For demo purposes, always use mock data
    logger.info('Using mock media files data for demo');
    return MockDataService.getMockMediaFiles();
  }

  /**
   * Get a single media file by ID
   */
  async getMediaFileById(id: string, userId: string): Promise<any> {
    try {
      const mediaFile = await prisma.mediaFile.findFirst({
        where: { id, userId },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return mediaFile;
    } catch (error) {
      logger.error('Error fetching media file:', error);
      throw error;
    }
  }

  /**
   * Create a new media file record
   */
  async createMediaFile(mediaFileData: MediaFileData): Promise<any> {
    try {
      const mediaFile = await prisma.mediaFile.create({
        data: mediaFileData,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      logger.info(`Media file created: ${mediaFile.id}`);
      return mediaFile;
    } catch (error) {
      logger.error('Error creating media file:', error);
      throw error;
    }
  }

  /**
   * Update a media file
   */
  async updateMediaFile(id: string, userId: string, updateData: Partial<MediaFileData>): Promise<any> {
    try {
      const mediaFile = await prisma.mediaFile.update({
        where: { id, userId },
        data: updateData,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      logger.info(`Media file updated: ${id}`);
      return mediaFile;
    } catch (error) {
      logger.error('Error updating media file:', error);
      throw error;
    }
  }

  /**
   * Delete a media file
   */
  async deleteMediaFile(id: string, userId: string): Promise<boolean> {
    try {
      await prisma.mediaFile.delete({
        where: { id, userId }
      });

      logger.info(`Media file deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting media file:', error);
      return false;
    }
  }

  /**
   * Search media files by tags or filename
   */
  async searchMediaFiles(userId: string, query: string): Promise<any[]> {
    try {
      const mediaFiles = await prisma.mediaFile.findMany({
        where: {
          userId,
          OR: [
            { originalName: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return mediaFiles;
    } catch (error) {
      logger.error('Error searching media files:', error);
      throw error;
    }
  }

  /**
   * Get media files by type
   */
  async getMediaFilesByType(userId: string, mimeType: string): Promise<any[]> {
    try {
      const mediaFiles = await prisma.mediaFile.findMany({
        where: {
          userId,
          mimeType: { startsWith: mimeType }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return mediaFiles;
    } catch (error) {
      logger.error('Error fetching media files by type:', error);
      throw error;
    }
  }
} 