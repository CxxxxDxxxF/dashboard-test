/**
 * Main TypeScript entry point for Rutgers University Social Media Dashboard
 * Enhanced with type safety and error handling
 */
import { AnalyticsService } from './services/AnalyticsService';
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
let engagementChart = null;
// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';
// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };
    notification.className += ` ${colors[type]}`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-75">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
// API Functions
async function apiCall(endpoint, options = {}) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load some dashboard data', 'warning');
    }
}
function updateAnalyticsDisplay(data) {
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
    const ctx = document.getElementById('engagementChart');
    if (!ctx) {
        console.warn('Engagement chart canvas not found');
        return;
    }
    // Generate initial data for engagement types
    const chartData = generateChartData(7);
    try {
        engagementChart = new window.Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Hide legend since we only have one dataset
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: function (context) {
                                return context[0].label;
                            },
                            label: function (context) {
                                return `Engagement: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6B7280',
                            font: {
                                size: 12
                            },
                            callback: function (value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    bar: {
                        borderRadius: 8,
                        borderSkipped: false
                    }
                }
            }
        });
        console.log('Engagement chart initialized successfully');
    }
    catch (error) {
        console.error('Error initializing engagement chart:', error);
    }
}
function generateChartData(days) {
    // For engagement overview, we show engagement types, not time series
    const labels = ['Likes', 'Comments', 'Shares'];
    // Generate realistic engagement data for each type
    const likesData = Math.round(280 + Math.random() * 40); // 2800
    const commentsData = Math.round(40 + Math.random() * 200); // 40-240
    const sharesData = Math.round(50 + Math.random() * 100); // 50-150
    return {
        labels,
        datasets: [
            {
                label: 'Engagement',
                data: [likesData, commentsData, sharesData],
                backgroundColor: [
                    'rgba(20, 184, 166, 0.8)', // Teal for likes
                    'rgba(249, 115, 22, 0.8)', // Orange for comments
                    'rgba(147, 51, 234, 0.8)' // Purple for shares
                ],
                borderColor: [
                    'rgb(201, 84, 84)', // Orange
                    'rgb(249, 5, 22)' // Red
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }
        ]
    };
}
function updateEngagementChart(data) {
    if (!engagementChart)
        return;
    // Get current selected period
    const engagementRange = document.getElementById('engagementRange');
    const days = engagementRange ? parseInt(engagementRange.value) : 7;
    // Generate new data for the selected period
    const chartData = generateChartData(days);
    // Update chart data
    engagementChart.data.labels = chartData.labels;
    if (engagementChart.data.datasets[0] && chartData.datasets[0]) {
        engagementChart.data.datasets[0].data = chartData.datasets[0].data;
    }
    // Update chart
    engagementChart.update('active');
}
function updateRecentPosts(data) {
    const postsContainer = document.querySelector('.recent-posts-container');
    if (!postsContainer || !data.data)
        return;
    // Update posts display
    postsContainer.innerHTML = data.data.map((post) => `
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
function updateUpcomingEvents(data) {
    const eventsContainer = document.querySelector('.upcoming-events-container');
    if (!eventsContainer || !data.data)
        return;
    eventsContainer.innerHTML = data.data.map((event) => `
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
    // Create a quick post modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-fade-in">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Quick Post</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select class="select select-bordered w-full">
                        <option>Instagram</option>
                        <option>Facebook</option>
                        <option>Both</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea class="textarea textarea-bordered w-full h-24" placeholder="What's happening at Rutgers Golf Course?"></textarea>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline flex-1" onclick="this.closest('.fixed').remove()">Cancel</button>
                    <button class="btn btn-primary flex-1" onclick="submitQuickPost(this)">Post Now</button>
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
function submitQuickPost(button) {
    const modal = button.closest('.fixed');
    const textarea = modal?.querySelector('textarea');
    const platform = modal?.querySelector('select');
    if (textarea?.value.trim()) {
        showNotification(`Quick post created for ${platform?.value}!`, 'success');
        modal?.remove();
        // Simulate API call
        setTimeout(() => {
            showNotification('Post published successfully!', 'success');
        }, 1000);
    }
    else {
        showNotification('Please enter a message', 'warning');
    }
}
function submitPost(button) {
    const modal = button.closest('.fixed');
    const textarea = modal?.querySelector('textarea');
    if (textarea?.value.trim()) {
        showNotification('Creating post...', 'info');
        modal?.remove();
        // Simulate API call
        setTimeout(() => {
            showNotification('Post created and scheduled successfully!', 'success');
        }, 1500);
    }
    else {
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
function formatTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
function formatDate(date) {
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
            const target = e.target;
            loadAnalyticsForPeriod(target.value);
        });
    }
    // More buttons for posts
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('more-btn')) {
            const dropdown = target.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        }
    });
}
async function loadAnalyticsForPeriod(days) {
    try {
        const data = await apiCall(`/analytics?period=${days}d`);
        updateAnalyticsDisplay(data);
        updateEngagementChart(data);
        showNotification(`Analytics updated for last ${days} days`, 'success');
    }
    catch (error) {
        showNotification('Failed to load analytics', 'error');
    }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    // Initialize chart after a short delay to ensure Chart.js is loaded
    setTimeout(() => {
        initializeEngagementChart();
    }, 100);
});
// Page-specific initialization
if (window.location.pathname.endsWith('analytics.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const analyticsService = new AnalyticsService();
        analyticsService.initialize();
    });
}
// Export functions for global access
window.openQuickPost = openQuickPost;
window.openPostComposer = openPostComposer;
window.viewInstagramAnalytics = viewInstagramAnalytics;
window.viewFacebookAnalytics = viewFacebookAnalytics;
window.exportChart = exportChart;
window.submitQuickPost = submitQuickPost;
window.submitPost = submitPost;
//# sourceMappingURL=main.js.map