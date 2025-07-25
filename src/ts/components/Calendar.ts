/**
 * TypeScript Calendar Component
 * Enhanced with type safety and error handling
 */

import { 
    Post, 
    CalendarState, 
    CalendarEvent, 
    SocialPlatform,
    ClickHandler 
} from '../types/dashboard';
import { 
    getElementById, 
    setInnerHTML, 
    addEventListener, 
    removeClass, 
    addClass,
    setTextContent,
    createElement,
    setAttribute,
    debounce
} from '../utils/dom';

export class CalendarManager {
    private state: CalendarState;
    private scheduledPosts: Post[];
    private monthNames: string[];

    constructor() {
        this.state = {
            currentDate: new Date(),
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            view: 'month',
            events: [],
            posts: []
        };

        this.scheduledPosts = [
            {
                id: 1,
                date: '2024-12-01',
                time: '09:00',
                title: 'Holiday Post',
                content: 'Happy holidays from Rutgers University!',
                platforms: ['instagram'],
                hashtags: '#rutgers #holidays #university',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                date: '2024-12-03',
                time: '14:00',
                title: 'Student Spotlight',
                content: 'Meet our amazing students making a difference!',
                platforms: ['facebook'],
                hashtags: '#studentlife #rutgers #spotlight',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                date: '2024-12-05',
                time: '10:00',
                title: 'Event Reminder',
                content: 'Don\'t forget about our upcoming campus event!',
                platforms: ['twitter'],
                hashtags: '#campus #event #rutgers',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                date: '2024-12-08',
                time: '11:00',
                title: 'Academic Event',
                content: 'Join us for an exciting academic presentation!',
                platforms: ['instagram', 'facebook'],
                hashtags: '#academic #rutgers #education',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                date: '2024-12-11',
                time: '15:00',
                title: 'Campus Tour',
                content: 'Take a virtual tour of our beautiful campus!',
                platforms: ['instagram'],
                hashtags: '#campus #tour #rutgers',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 6,
                date: '2024-12-15',
                time: '16:00',
                title: 'Alumni Event',
                content: 'Connect with fellow alumni at our networking event!',
                platforms: ['facebook'],
                hashtags: '#alumni #networking #rutgers',
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.initialize();
    }

    private initialize(): void {
        this.renderCalendar();
        this.setupEventListeners();
    }

    private renderCalendar(): void {
        const calendarGrid = getElementById<HTMLDivElement>('calendarGrid');
        const currentMonthElement = getElementById<HTMLHeadingElement>('currentMonth');
        
        if (!calendarGrid || !currentMonthElement) {
            console.error('Calendar elements not found');
            return;
        }
        
        // Update month display
        setTextContent(currentMonthElement, 
            `${this.monthNames[this.state.currentMonth]} ${this.state.currentYear}`);
        
        // Clear calendar
        setInnerHTML(calendarGrid, '');
        
        // Get first day of month and number of days
        const firstDay = new Date(this.state.currentYear, this.state.currentMonth, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(date);
            calendarGrid.appendChild(dayElement);
        }
    }

    private createDayElement(date: Date): HTMLDivElement {
        const dayElement = createElement<HTMLDivElement>('div');
        dayElement.className = 'p-4 h-40 border-2 border-gray-100 relative cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-xl';
        
        const isCurrentMonth = date.getMonth() === this.state.currentMonth;
        const isToday = date.toDateString() === new Date().toDateString();
        const dateString = date.toISOString().split('T')[0];
        
        // Get posts for this date
        const dayPosts = this.scheduledPosts.filter(post => post.date === dateString);
        
        let dayContent = `
            <div class="text-lg font-bold ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'bg-red-100 text-red-700 px-3 py-2 rounded-full inline-block' : ''} mb-3">${date.getDate()}</div>
        `;
        
        // Add post indicators
        if (dayPosts.length > 0) {
            dayContent += '<div class="space-y-2">';
            dayPosts.slice(0, 4).forEach(post => {
                dayContent += this.createPostIndicator(post);
            });
            
            if (dayPosts.length > 4) {
                dayContent += `<div class="text-sm text-gray-500 font-medium text-center py-1">+${dayPosts.length - 4} more</div>`;
            }
            
            dayContent += '</div>';
        }
        
        setInnerHTML(dayElement, dayContent);
        
        // Add click handlers
        this.addDayClickHandlers(dayElement, date, isCurrentMonth, dayPosts);
        
        return dayElement;
    }

    private createPostIndicator(post: Post): string {
        const platformColors: Record<SocialPlatform, string> = {
            instagram: 'bg-red-100 text-red-700 border-red-200',
            facebook: 'bg-blue-100 text-blue-700 border-blue-200',
            twitter: 'bg-purple-100 text-purple-700 border-purple-200',
            linkedin: 'bg-blue-600 text-white border-blue-700',
            tiktok: 'bg-black text-white border-gray-800'
        };

        const platformIcons: Record<SocialPlatform, string> = {
            instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
            facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
            twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
            linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
            tiktok: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>'
        };
        
        const platform = post.platforms[0];
        const colorClass = platform && platformColors[platform] ? platformColors[platform] : 'bg-gray-100 text-gray-700 border-gray-200';
        const icon = platform && platformIcons[platform] ? platformIcons[platform] : '';
        
        return `
            <div class="${colorClass} text-sm p-2 rounded-lg border cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105" 
                 data-post-id="${post.id}" 
                 title="${post.title}">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2">
                        ${icon}
                    </svg>
                    <span class="font-medium truncate">${post.title}</span>
                </div>
            </div>
        `;
    }

    private addDayClickHandlers(
        dayElement: HTMLDivElement, 
        date: Date, 
        isCurrentMonth: boolean, 
        dayPosts: Post[]
    ): void {
        // Day click handler
        addEventListener(dayElement, 'click', (e: MouseEvent) => {
            if (isCurrentMonth) {
                const dateString = date.toISOString().split('T')[0];
                this.openNewPostModal(dateString);
            }
        });

        // Post click handler
        addEventListener(dayElement, 'click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const postElement = target.closest('[data-post-id]') as HTMLElement;
            
            if (postElement) {
                e.stopPropagation();
                const postId = parseInt(postElement.dataset.postId || '0');
                if (postId) {
                    this.showPostDetails(postId);
                }
            }
        });
    }

    private setupEventListeners(): void {
        // Navigation buttons
        const prevBtn = getElementById<HTMLButtonElement>('prevMonth');
        const nextBtn = getElementById<HTMLButtonElement>('nextMonth');
        const todayBtn = getElementById<HTMLButtonElement>('todayBtn');
        const newEventBtn = getElementById<HTMLButtonElement>('newEventBtn');

        if (prevBtn) {
            addEventListener(prevBtn, 'click', () => this.previousMonth());
        }

        if (nextBtn) {
            addEventListener(nextBtn, 'click', () => this.nextMonth());
        }

        if (todayBtn) {
            addEventListener(todayBtn, 'click', () => this.goToToday());
        }

        if (newEventBtn) {
            addEventListener(newEventBtn, 'click', () => this.openNewPostModal());
        }

        // Modal close buttons
        const closeModalBtn = getElementById<HTMLButtonElement>('closeModal');
        const closeDetailsModalBtn = getElementById<HTMLButtonElement>('closeDetailsModal');
        const cancelPostBtn = getElementById<HTMLButtonElement>('cancelPost');

        if (closeModalBtn) {
            addEventListener(closeModalBtn, 'click', () => this.closeNewPostModal());
        }

        if (closeDetailsModalBtn) {
            addEventListener(closeDetailsModalBtn, 'click', () => this.closePostDetailsModal());
        }

        if (cancelPostBtn) {
            addEventListener(cancelPostBtn, 'click', () => this.closeNewPostModal());
        }

        // Form submission
        const postForm = getElementById<HTMLFormElement>('postForm');
        if (postForm) {
            addEventListener(postForm, 'submit', (e: SubmitEvent) => this.handleFormSubmission(e));
        }

        // Close modals when clicking outside
        const modals = document.querySelectorAll('#postModal, #postDetailsModal');
        modals.forEach(modal => {
            addEventListener(modal, 'click', (e: MouseEvent) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    private previousMonth(): void {
        this.state.currentMonth--;
        if (this.state.currentMonth < 0) {
            this.state.currentMonth = 11;
            this.state.currentYear--;
        }
        this.renderCalendar();
    }

    private nextMonth(): void {
        this.state.currentMonth++;
        if (this.state.currentMonth > 11) {
            this.state.currentMonth = 0;
            this.state.currentYear++;
        }
        this.renderCalendar();
    }

    private goToToday(): void {
        this.state.currentDate = new Date();
        this.state.currentMonth = this.state.currentDate.getMonth();
        this.state.currentYear = this.state.currentDate.getFullYear();
        this.renderCalendar();
    }

    private openNewPostModal(date?: string): void {
        const modal = getElementById<HTMLDivElement>('postModal');
        const dateInput = getElementById<HTMLInputElement>('postDate');
        const timeInput = getElementById<HTMLInputElement>('postTime');
        
        if (modal && dateInput && timeInput) {
            if (date) {
                setAttribute(dateInput, 'value', date);
            } else {
                const today: string = new Date().toISOString().split('T')[0] || '';
                setAttribute(dateInput, 'value', today);
            }
            setAttribute(timeInput, 'value', '09:00');
            removeClass(modal, 'hidden');
        }
    }

    private closeNewPostModal(): void {
        const modal = getElementById<HTMLDivElement>('postModal');
        const form = getElementById<HTMLFormElement>('postForm');
        
        if (modal) {
            addClass(modal, 'hidden');
        }
        
        if (form) {
            form.reset();
        }
    }

    private showPostDetails(postId: number): void {
        const post = this.scheduledPosts.find(p => p.id === postId);
        if (!post) return;
        
        const modal = getElementById<HTMLDivElement>('postDetailsModal');
        const content = getElementById<HTMLDivElement>('postDetailsContent');
        
        if (modal && content) {
            const contentHTML = `
                <div>
                    <h4 class="font-semibold text-lg">${post.title}</h4>
                    <p class="text-gray-600 mt-2">${post.content}</p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium">Date:</span> ${new Date(post.date).toLocaleDateString()}
                    </div>
                    <div>
                        <span class="font-medium">Time:</span> ${post.time}
                    </div>
                    <div>
                        <span class="font-medium">Platforms:</span> ${post.platforms.join(', ')}
                    </div>
                    <div>
                        <span class="font-medium">Hashtags:</span> ${post.hashtags || 'None'}
                    </div>
                </div>
            `;
            
            setInnerHTML(content, contentHTML);
            removeClass(modal, 'hidden');
        }
    }

    private closePostDetailsModal(): void {
        const modal = getElementById<HTMLDivElement>('postDetailsModal');
        if (modal) {
            addClass(modal, 'hidden');
        }
    }

    private handleFormSubmission(e: SubmitEvent): void {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const newPost: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
            date: formData.get('postDate') as string || this.getFormValue('postDate'),
            time: formData.get('postTime') as string || this.getFormValue('postTime'),
            title: this.getFormValue('postTitle'),
            content: this.getFormValue('postContent'),
            platforms: this.getSelectedPlatforms(),
            hashtags: this.getFormValue('postHashtags'),
            status: 'scheduled'
        };

        if (this.validatePost(newPost)) {
            this.schedulePost(newPost);
            this.closeNewPostModal();
            this.renderCalendar();
            this.showNotification('Post scheduled successfully!', 'success');
        }
    }

    private getFormValue(id: string): string {
        const element = getElementById<HTMLInputElement | HTMLTextAreaElement>(id);
        return element?.value || '';
    }

    private getSelectedPlatforms(): SocialPlatform[] {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
        return Array.from(checkboxes).map(cb => cb.value as SocialPlatform);
    }

    private validatePost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): boolean {
        if (!post.title.trim()) {
            this.showNotification('Post title is required', 'error');
            return false;
        }
        
        if (!post.content.trim()) {
            this.showNotification('Post content is required', 'error');
            return false;
        }
        
        if (post.platforms.length === 0) {
            this.showNotification('Please select at least one platform', 'error');
            return false;
        }
        
        return true;
    }

    private schedulePost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
        const newPost: Post = {
            ...postData,
            id: this.scheduledPosts.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.scheduledPosts.push(newPost);
        return newPost;
    }

    private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
        // Implementation would go here - using existing notification system
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    // Public methods for external access
    public getState(): CalendarState {
        return { ...this.state };
    }

    public getPosts(): Post[] {
        return [...this.scheduledPosts];
    }

    public addPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
        const newPost = this.schedulePost(post);
        this.renderCalendar();
        return newPost;
    }

    public removePost(postId: number): boolean {
        const index = this.scheduledPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            this.scheduledPosts.splice(index, 1);
            this.renderCalendar();
            return true;
        }
        return false;
    }
} 