import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
const prisma = new PrismaClient();
export class MediaService {
    async getMediaFiles(userId, limit = 50, offset = 0) {
        try {
            const mediaFiles = await prisma.mediaFile.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return mediaFiles;
        }
        catch (error) {
            logger.error('Error fetching media files:', error);
            throw error;
        }
    }
    async getMediaFileById(id, userId) {
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
        }
        catch (error) {
            logger.error('Error fetching media file:', error);
            throw error;
        }
    }
    async createMediaFile(mediaFileData) {
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
        }
        catch (error) {
            logger.error('Error creating media file:', error);
            throw error;
        }
    }
    async updateMediaFile(id, userId, updateData) {
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
        }
        catch (error) {
            logger.error('Error updating media file:', error);
            throw error;
        }
    }
    async deleteMediaFile(id, userId) {
        try {
            await prisma.mediaFile.delete({
                where: { id, userId }
            });
            logger.info(`Media file deleted: ${id}`);
            return true;
        }
        catch (error) {
            logger.error('Error deleting media file:', error);
            return false;
        }
    }
    async searchMediaFiles(userId, query) {
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
        }
        catch (error) {
            logger.error('Error searching media files:', error);
            throw error;
        }
    }
    async getMediaFilesByType(userId, mimeType) {
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
        }
        catch (error) {
            logger.error('Error fetching media files by type:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=mediaService.js.map