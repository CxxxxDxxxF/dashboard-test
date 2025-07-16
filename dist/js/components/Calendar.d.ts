/**
 * TypeScript Calendar Component
 * Enhanced with type safety and error handling
 */
import { Post, CalendarState } from '../types/dashboard';
export declare class CalendarManager {
    private state;
    private scheduledPosts;
    private monthNames;
    constructor();
    private initialize;
    private renderCalendar;
    private createDayElement;
    private createPostIndicator;
    private addDayClickHandlers;
    private setupEventListeners;
    private previousMonth;
    private nextMonth;
    private goToToday;
    private openNewPostModal;
    private closeNewPostModal;
    private showPostDetails;
    private closePostDetailsModal;
    private handleFormSubmission;
    private getFormValue;
    private getSelectedPlatforms;
    private validatePost;
    private schedulePost;
    private showNotification;
    getState(): CalendarState;
    getPosts(): Post[];
    addPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post;
    removePost(postId: number): boolean;
}
//# sourceMappingURL=Calendar.d.ts.map