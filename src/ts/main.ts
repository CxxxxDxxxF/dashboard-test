/**
 * Main TypeScript entry point for Rutgers University Social Media Dashboard
 * Enhanced with type safety and error handling
 */

// Dashboard Interactive Functionality
import { DashboardState } from './types/dashboard';
import { AnalyticsService } from './services/AnalyticsService';
import { Button, Card, StatCard, Modal, Notification, UIUtils } from './components/UIComponents';
import { createCustomChart, ChartData as CustomChartData } from './components/CustomChart';

// Global state
let dashboardState = {
    user: {
        name: 'Cristian',
        role: 'Marketing Manager',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlNWU3ZWYiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0yMCAyMS4xMlYxOWE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPgo8L3N2Zz4K'
    },
    notifications: [],
    isOnline: true,
    lastUpdate: new Date()
};

// Chart instance
let engagementChart: any = null;
let customChart: any = null;

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// Utility functions
function showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    Notification.show({
        message,
        type,
        duration: 5000,
        position: 'top-right'
    });
}

// API Functions
async function apiCall(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Call failed:', error);
        showNotification(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        throw error;
    }
}

// Dashboard Functions
export function initializeDashboard() {
    console.log('Initializing Rutgers Dashboard...');
    
    // Initialize components only if we're on the right page
    if (window.location.pathname.includes('calendar.html')) {
        // Calendar.initialize(); // Only initialize on calendar page
    }
    
    // Load initial data
    loadDashboardData();
    
    // Set up real-time updates
    setInterval(updateLastUpdateTime, 60000); // Update every minute
    
    // Set up event listeners
    setupEventListeners();
    
    showNotification('Dashboard loaded successfully!', 'success');
}

async function loadDashboardData() {
    try {
        // Load analytics data
        const analyticsData = await apiCall('/analytics?period=7d');
        updateAnalyticsDisplay(analyticsData);
        
        // Load recent posts
        const postsData = await apiCall('/posts?limit=5');
        updateRecentPosts(postsData);
        
        // Load calendar events
        const eventsData = await apiCall('/calendar');
        updateUpcomingEvents(eventsData);
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load some dashboard data', 'warning');
    }
}

function updateAnalyticsDisplay(data: any) {
    // Update follower counts
    const instagramFollowers = document.getElementById('instagramFollowers');
    if (instagramFollowers && data.instagram?.followers) {
        instagramFollowers.textContent = data.instagram.followers.toLocaleString();
    }
    
    // Update other metrics
    const facebookFollowers = document.getElementById('facebookFollowers');
    if (facebookFollowers && data.facebook?.followers) {
        facebookFollowers.textContent = data.facebook.followers.toLocaleString();
    }
    
    const engagementRate = document.getElementById('engagementRate');
    if (engagementRate && data.engagement) {
        engagementRate.textContent = `${data.engagement.rate}%`;
    }
    
    const scheduledPosts = document.getElementById('scheduledPosts');
    if (scheduledPosts && data.scheduled) {
        scheduledPosts.textContent = data.scheduled.count;
    }
    
    // Update chart with new data
    updateEngagementChart(data);
}

// Chart Functions
function initializeEngagementChart() {
    console.log('Starting custom chart initialization...');
    
    // Generate initial data for engagement types
    const chartData = generateCustomChartData(7);
    console.log('Custom chart data generated:', chartData);
    
    try {
        console.log('Creating custom chart instance...');
        customChart = createCustomChart('engagementChart', chartData, {
            showGrid: true,
            showValues: true,
            animate: true,
            barSpacing: 40,
            borderRadius: 12
        });
        
        if (customChart) {
            console.log('Custom chart created successfully');
        } else {
            console.error('Failed to create custom chart');
        }
    } catch (error) {
        console.error('Error initializing custom chart:', error);
    }
}

function generateCustomChartData(days: number): CustomChartData {
    // For engagement overview, we show engagement types, not time series
    const labels = ['Likes', 'Comments', 'Shares'];
    
    // Generate realistic engagement data based on time period
    let likesData, commentsData, sharesData;
    
    switch (days) {
        case 7:
            likesData = 2847;
            commentsData = 156;
            sharesData = 89;
            break;
        case 14:
            likesData = 5214;
            commentsData = 298;
            sharesData = 167;
            break;
        case 30:
            likesData = 12458;
            commentsData = 742;
            sharesData = 423;
            break;
        default:
            likesData = 2847;
            commentsData = 156;
            sharesData = 89;
    }
    
    return {
        labels,
        datasets: [
            {
                label: 'Engagement',
                data: [likesData, commentsData, sharesData],
                colors: [
                    '#FF6B6B #FF8E8E', // Beautiful red gradient for likes
                    '#4ECDC4 #6EE7DF', // Teal gradient for comments  
                    '#45B7D1 #67C9E1'  // Blue gradient for shares
                ]
            }
        ]
    };
}

function generateChartData(days: number) {
    // For engagement overview, we show engagement types, not time series
    const labels = ['Likes', 'Comments', 'Shares'];
    
    // Generate realistic engagement data based on time period
    // More realistic social media engagement ratios
    let likesData, commentsData, sharesData;
    
    switch (days) {
        case 7:
            likesData = 2847;
            commentsData = 156;
            sharesData = 89;
            break;
        case 14:
            likesData = 5214;
            commentsData = 298;
            sharesData = 167;
            break;
        case 30:
            likesData = 12458;
            commentsData = 742;
            sharesData = 423;
            break;
        default:
            likesData = 2847;
            commentsData = 156;
            sharesData = 89;
    }
    
    return {
        labels,
        datasets: [
            {
                label: 'Engagement',
                data: [likesData, commentsData, sharesData],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.9)', // Beautiful red for likes
                    'rgba(78, 205, 196, 0.9)', // Teal for comments  
                    'rgba(69, 183, 209, 0.9)' // Blue for shares
                ],
                borderColor: [
                    'rgba(255, 107, 107, 0.3)', // Subtle red border
                    'rgba(78, 205, 196, 0.3)', // Subtle teal border
                    'rgba(69, 183, 209, 0.3)' // Subtle blue border
                ],
                borderWidth: 3,
                borderRadius: {
                    topLeft: 12,
                    topRight: 12,
                    bottomLeft: 4,
                    bottomRight: 4
                },
                borderSkipped: false,
                // Add gradient effect
                fill: true,
                tension: 0.4
            }
        ]
    };
}

function updateEngagementChart(data: any) {
    if (!engagementChart) return;
    
    // Get current selected period
    const engagementRange = document.getElementById('engagementRange') as HTMLSelectElement;
    const days = engagementRange ? parseInt(engagementRange.value) : 7;
    
    // Generate new data for the selected period
    const chartData = generateChartData(days);
    
    // Update chart data
    engagementChart.data.labels = chartData.labels;
    if (engagementChart.data.datasets[0] && chartData.datasets[0]) {
        (engagementChart.data.datasets[0] as any).data = chartData.datasets[0].data;
    }
    
    // Update chart
    engagementChart.update('active');
}

function updateRecentPosts(data: any) {
    const postsContainer = document.querySelector('.recent-posts-container');
    if (!postsContainer || !data.data) return;
    
    // Update posts display
    postsContainer.innerHTML = data.data.map((post: any) => `
        <div class="post-card bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-start gap-4 animate-fade-in">
            <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-image" width="32" height="32" fill="none" stroke="#9ca3af" stroke-width="2">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-5-5L5 21"/>
                </svg>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-medium text-lg">${post.title}</h4>
                        <p class="text-sm text-gray-500 mt-1">Posted ${formatTimeAgo(post.createdAt)}</p>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-instagram" width="16" height="16" fill="none" stroke="#CC0033" stroke-width="2">
                            <rect x="2" y="2" width="12" height="12" rx="3"/>
                            <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                            <circle cx="11.5" cy="4.5" r=".5"/>
                        </svg> ${post.platform}
                    </span>
                </div>
                <div class="flex justify-between items-center mt-3">
                    <div class="flex space-x-4 text-sm">
                        <span class="text-gray-500 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-thumbs-up" width="16" height="16" fill="none" stroke="#2563eb" stroke-width="2">
                                <path d="M7 10v12"/>
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a2 2 0 0 1 2 2v1.88Z"/>
                            </svg> ${post.likes || 0}
                        </span>
                        <span class="text-gray-500 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-repeat-2" width="16" height="16" fill="none" stroke="#22c55e" stroke-width="2">
                                <path d="m2 9 3-3 3 3"/>
                                <path d="M8 6v6a2 2 0 0 0 2 2h6"/>
                                <path d="m22 15-3 3-3-3"/>
                                <path d="M16 18v-6a2 2 0 0 0-2-2H8"/>
                            </svg> ${post.shares || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateUpcomingEvents(data: any) {
    const eventsContainer = document.querySelector('.upcoming-events-container');
    if (!eventsContainer || !data.data) return;
    
    eventsContainer.innerHTML = data.data.map((event: any) => `
        <div class="event-card bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer animate-fade-in">
            <div class="flex items-start gap-3">
                <div class="w-3 h-3 rounded-full mt-2" style="background-color: ${event.color || '#3B82F6'}"></div>
                <div class="flex-1">
                    <h4 class="font-medium text-lg">${event.title}</h4>
                    <p class="text-sm text-gray-500">${formatDate(event.startDate)}</p>
                    ${event.location ? `<p class="text-sm text-gray-400">📍 ${event.location}</p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function updateLastUpdateTime() {
    const lastUpdateElement = document.querySelector('.last-update-time');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = `Last updated: ${formatTimeAgo(new Date())}`;
    }
}

// Action Functions
export function openQuickPost() {
    showNotification('Opening Quick Post...', 'info');
    
    const modalContent = `
        <div class="space-y-4">
            <div>
                <label class="form-label">Platform</label>
                <select class="form-select">
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Both</option>
                </select>
            </div>
            <div>
                <label class="form-label">Message</label>
                <textarea class="form-textarea" placeholder="What's happening at Rutgers Golf Course?"></textarea>
            </div>
        </div>
    `;
    
    const modal = Modal.create({
        title: 'Quick Post',
        content: modalContent,
        size: 'md',
        actions: [
            {
                text: 'Cancel',
                variant: 'outline',
                onClick: () => modal.remove()
            },
            {
                text: 'Post Now',
                variant: 'primary',
                onClick: () => {
                    const textarea = modal.querySelector('textarea') as HTMLTextAreaElement;
                    const platform = modal.querySelector('select') as HTMLSelectElement;
                    
                    if (textarea?.value.trim()) {
                        showNotification(`Quick post created for ${platform?.value}!`, 'success');
                        modal.remove();
                        
                        // Simulate API call
                        setTimeout(() => {
                            showNotification('Post published successfully!', 'success');
                        }, 1000);
                    } else {
                        showNotification('Please enter a message', 'warning');
                    }
                }
            }
        ]
    });
    
    document.body.appendChild(modal);
}

export function openPostComposer() {
    showNotification('Opening Post Composer...', 'info');
    
    // Create a full post composer modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">Create Post</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" class="checkbox checkbox-primary mr-2" checked>
                                <span>Instagram</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="checkbox checkbox-primary mr-2" checked>
                                <span>Facebook</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                        <select class="select select-bordered w-full">
                            <option>Image Post</option>
                            <option>Video Post</option>
                            <option>Story</option>
                            <option>Reel</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea class="textarea textarea-bordered w-full h-32" placeholder="Share what's happening at Rutgers Golf Course..."></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Media</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p class="text-gray-600">Click to upload image or video</p>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                    <input type="text" class="input input-bordered w-full" placeholder="#RutgersGolf #GolfLife #WeekendTeeTime">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                        <select class="select select-bordered w-full">
                            <option>Post Now</option>
                            <option>Schedule for Later</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input type="text" class="input input-bordered w-full" placeholder="Rutgers Golf Course" value="Rutgers Golf Course">
                    </div>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button class="btn btn-outline flex-1" onclick="this.closest('.fixed').remove()">Save Draft</button>
                    <button class="btn btn-primary flex-1" onclick="submitPost(this)">Create Post</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Helper functions for the modals
function submitQuickPost(button: HTMLElement) {
    const modal = button.closest('.fixed');
    const textarea = modal?.querySelector('textarea') as HTMLTextAreaElement;
    const platform = modal?.querySelector('select') as HTMLSelectElement;
    
    if (textarea?.value.trim()) {
        showNotification(`Quick post created for ${platform?.value}!`, 'success');
        modal?.remove();
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Post published successfully!', 'success');
        }, 1000);
    } else {
        showNotification('Please enter a message', 'warning');
    }
}

function submitPost(button: HTMLElement) {
    const modal = button.closest('.fixed');
    const textarea = modal?.querySelector('textarea') as HTMLTextAreaElement;
    
    if (textarea?.value.trim()) {
        showNotification('Creating post...', 'info');
        modal?.remove();
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Post created and scheduled successfully!', 'success');
        }, 1500);
    } else {
        showNotification('Please enter content for your post', 'warning');
    }
}

export function viewInstagramAnalytics() {
    showNotification('Loading Instagram Analytics...', 'info');
    setTimeout(() => {
        window.location.href = 'analytics.html?platform=instagram';
    }, 500);
}



export function viewFacebookAnalytics() {
    showNotification('Loading Facebook Analytics...', 'info');
    setTimeout(() => {
        window.location.href = 'analytics.html?platform=facebook';
    }, 500);
}

export function exportChart() {
    showNotification('Exporting chart data...', 'info');
    // In a real app, this would generate and download a file
    setTimeout(() => {
        showNotification('Chart exported successfully!', 'success');
    }, 1000);
}

// Utility Functions
function formatTimeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            showNotification('Theme toggled!', 'info');
        });
    }
    
    // Notification bell
    const notificationBtn = document.querySelector('[title="Notifications"]');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotification('No new notifications', 'info');
        });
    }
    
    // Engagement range selector
    const engagementRange = document.getElementById('engagementRange');
    if (engagementRange) {
        engagementRange.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            const days = parseInt(target.value);
            console.log(`Updating chart for ${days} days`);
            
            // Update chart with new data
            if (engagementChart && engagementChart.data.datasets[0]) {
                const newData = generateChartData(days);
                if (newData.datasets[0]) {
                    (engagementChart.data.datasets[0] as any).data = newData.datasets[0].data;
                    engagementChart.update('active');
                    
                    // Show notification
                    showNotification(`Chart updated for last ${days} days`, 'success');
                }
            }
        });
    }
    
    // More buttons for posts
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('more-btn')) {
            const dropdown = target.nextElementSibling as HTMLElement;
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }
    });
}

async function loadAnalyticsForPeriod(days: string) {
    try {
        const data = await apiCall(`/analytics?period=${days}d`);
        updateAnalyticsDisplay(data);
        updateEngagementChart(data);
        showNotification(`Analytics updated for last ${days} days`, 'success');
    } catch (error) {
        showNotification('Failed to load analytics', 'error');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    // Initialize chart with better error handling
    initializeChartWithRetry();
});

// Robust chart initialization with retry logic
function initializeChartWithRetry(maxRetries = 5, delay = 200) {
    let retryCount = 0;
    
    const tryInitialize = () => {
        console.log(`Attempting to initialize chart (attempt ${retryCount + 1}/${maxRetries})`);
        
        // Check if Chart.js is loaded
        if (typeof (window as any).Chart === 'undefined') {
            console.warn('Chart.js not loaded yet, retrying...');
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitialize, delay);
            } else {
                console.error('Chart.js failed to load after maximum retries');
            }
            return;
        }
        
        // Check if canvas element exists
        const ctx = document.getElementById('engagementChart') as HTMLCanvasElement;
        if (!ctx) {
            console.warn('Engagement chart canvas not found, retrying...');
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitialize, delay);
            } else {
                console.error('Canvas element not found after maximum retries');
            }
            return;
        }
        
        // Initialize the chart
        try {
            initializeEngagementChart();
            console.log('Chart initialized successfully!');
        } catch (error) {
            console.error('Error during chart initialization:', error);
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitialize, delay);
            }
        }
    };
    
    tryInitialize();
}

// Page-specific initialization
if (window.location.pathname.endsWith('analytics.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const analyticsService = new AnalyticsService();
    analyticsService.initialize();
  });
}

// Export functions for global access
(window as any).openQuickPost = openQuickPost;
(window as any).openPostComposer = openPostComposer;
(window as any).viewInstagramAnalytics = viewInstagramAnalytics;
(window as any).viewFacebookAnalytics = viewFacebookAnalytics;
(window as any).exportChart = exportChart;
(window as any).submitQuickPost = submitQuickPost;
(window as any).submitPost = submitPost;

// Debug function to test chart manually
(window as any).testChart = () => {
    console.log('Testing chart manually...');
    const ctx = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (!ctx) {
        console.error('Canvas not found');
        return;
    }
    
    if (typeof (window as any).Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    
    // Destroy existing chart if it exists
    if (engagementChart) {
        engagementChart.destroy();
        engagementChart = null;
    }
    
    // Create a simple test chart with Rutgers colors
    const testChart = new (window as any).Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Likes', 'Comments', 'Shares'],
            datasets: [{
                label: 'Engagement',
                data: [2847, 156, 89],
                backgroundColor: [
                    'rgba(220, 38, 38, 0.9)', // Rutgers red
                    'rgba(59, 130, 246, 0.9)', // Blue
                    'rgba(34, 197, 94, 0.9)' // Green
                ],
                borderColor: [
                    'rgb(185, 28, 28)',
                    'rgb(37, 99, 235)',
                    'rgb(22, 163, 74)'
                ],
                borderWidth: 3,
                borderRadius: {
                    topLeft: 12,
                    topRight: 12,
                    bottomLeft: 4,
                    bottomRight: 4
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(220, 38, 38, 0.3)',
                    borderWidth: 2,
                    cornerRadius: 12
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#374151',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(156, 163, 175, 0.2)'
                    },
                    ticks: {
                        color: '#6B7280',
                        callback: function(value: any) {
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'k';
                            }
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
    
    console.log('Test chart created:', testChart);
    return testChart;
};

// Force reinitialize the chart
(window as any).reinitChart = () => {
    console.log('Reinitializing chart...');
    if (engagementChart) {
        engagementChart.destroy();
        engagementChart = null;
    }
    initializeChartWithRetry();
}; 