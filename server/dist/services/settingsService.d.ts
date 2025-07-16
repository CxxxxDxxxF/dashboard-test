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
export declare class SettingsService {
    getUserSettings(userId: string): Promise<any>;
    updateUserSettings(userId: string, updateData: Partial<UserSettingsData>): Promise<any>;
    private createDefaultSettings;
    resetUserSettings(userId: string): Promise<any>;
    getMultipleUserSettings(userIds: string[]): Promise<any[]>;
}
export {};
//# sourceMappingURL=settingsService.d.ts.map