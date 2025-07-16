/**
 * Type definitions for Rutgers University Social Media Dashboard
 */
export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type ChartPeriod = 7 | 14 | 30;
export type Theme = 'light' | 'dark';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
/**
 * Post Interface
 */
export interface Post {
    id: number;
    date: string;
    time: string;
    title: string;
    content: string;
    platforms: SocialPlatform[];
    hashtags?: string;
    status: PostStatus;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    scheduledFor?: string;
    publishedAt?: string;
    engagement?: {
        likes: number;
        comments: number;
        shares: number;
        clicks: number;
    };
}
/**
 * Calendar Event Interface
 */
export interface CalendarEvent {
    id: number;
    date: string;
    time: string;
    title: string;
    description?: string;
    type: 'post' | 'event' | 'reminder';
    platforms?: SocialPlatform[];
    color?: string;
}
/**
 * Chart Data Interface
 */
export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}
export interface ChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    fill?: boolean;
    borderWidth?: number;
}
/**
 * Engagement Data Interface
 */
export interface EngagementData {
    [key: string]: {
        labels: string[];
        instagram: number[];
        facebook: number[];
        twitter?: number[];
    };
}
/**
 * User Settings Interface
 */
export interface UserSettings {
    theme: Theme;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    timezone: string;
    language: string;
    autoSave: boolean;
}
/**
 * GitHub Integration Interface
 */
export interface GitHubConfig {
    username: string;
    repository: string;
    token: string;
    branch: string;
    connected: boolean;
    lastSync?: string;
}
/**
 * Dashboard State Interface
 */
export interface DashboardState {
    currentPage: string;
    sidebarCollapsed: boolean;
    theme: Theme;
    notifications: Notification[];
    userSettings: UserSettings;
    githubConfig: GitHubConfig;
}
/**
 * Notification Interface
 */
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    action?: {
        label: string;
        url: string;
    };
}
/**
 * Calendar State Interface
 */
export interface CalendarState {
    currentDate: Date;
    currentMonth: number;
    currentYear: number;
    view: 'month' | 'week' | 'day';
    selectedDate?: string;
    events: CalendarEvent[];
    posts: Post[];
}
/**
 * Analytics Data Interface
 */
export interface AnalyticsData {
    totalPosts: number;
    totalEngagement: number;
    averageEngagement: number;
    topPerformingPost?: Post;
    platformBreakdown: {
        [key in SocialPlatform]: {
            posts: number;
            engagement: number;
            growth: number;
        };
    };
    recentActivity: {
        date: string;
        posts: number;
        engagement: number;
    }[];
}
/**
 * Media Library Item Interface
 */
export interface MediaItem {
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    size: number;
    uploadedAt: string;
    tags: string[];
    usedInPosts: number[];
}
/**
 * Form Validation Interface
 */
export interface FormValidation {
    isValid: boolean;
    errors: {
        [key: string]: string[];
    };
}
/**
 * API Response Interfaces
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
/**
 * Event Handler Types
 */
export type EventHandler<T = Event> = (event: T) => void;
export type ClickHandler = EventHandler<MouseEvent>;
export type SubmitHandler = EventHandler<SubmitEvent>;
export type ChangeHandler = EventHandler<Event>;
/**
 * Utility Types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Component Props Interfaces
 */
export interface BaseComponentProps {
    id?: string;
    className?: string;
}
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: ClickHandler;
    type?: 'button' | 'submit' | 'reset';
}
/**
 * Chart Configuration Interface
 */
export interface ChartConfig {
    type: 'line' | 'bar' | 'doughnut' | 'pie';
    data: ChartData;
    options?: {
        responsive?: boolean;
        maintainAspectRatio?: boolean;
        plugins?: {
            legend?: {
                display?: boolean;
            };
            tooltip?: {
                enabled?: boolean;
            };
        };
        scales?: {
            x?: {
                display?: boolean;
            };
            y?: {
                display?: boolean;
                beginAtZero?: boolean;
            };
        };
    };
}
//# sourceMappingURL=dashboard.d.ts.map