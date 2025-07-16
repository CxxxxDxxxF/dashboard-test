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
export declare class MediaService {
    getMediaFiles(userId: string, limit?: number, offset?: number): Promise<any[]>;
    getMediaFileById(id: string, userId: string): Promise<any>;
    createMediaFile(mediaFileData: MediaFileData): Promise<any>;
    updateMediaFile(id: string, userId: string, updateData: Partial<MediaFileData>): Promise<any>;
    deleteMediaFile(id: string, userId: string): Promise<boolean>;
    searchMediaFiles(userId: string, query: string): Promise<any[]>;
    getMediaFilesByType(userId: string, mimeType: string): Promise<any[]>;
}
export {};
//# sourceMappingURL=mediaService.d.ts.map