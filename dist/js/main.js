/**
 * Main TypeScript entry point for Rutgers University Social Media Dashboard
 * Enhanced with type safety and error handling
 */
import { CalendarManager } from './components/Calendar';
import { getElementById, addEventListener, removeClass, addClass, setInnerHTML, toggleClass, throttle } from './utils/dom';
/**
 * Main Dashboard Application Class
 */
class DashboardApp {
    constructor() {
        this.calendarManager = null;
        this.engagementChart = null; // Chart.js instance
        this.state = {
            currentPage: 'dashboard',
            sidebarCollapsed: false,
            theme: 'light',
            notifications: [],
            userSettings: {
                theme: 'light',
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                },
                timezone: 'America/New_York',
                language: 'en',
                autoSave: true
            },
            githubConfig: {
                username: '',
                repository: '',
                token: '',
                branch: 'main',
                connected: false
            }
        };
        this.initialize();
    }
    initialize() {
        try {
            this.initializeSidebar();
            this.initializeThemeToggle();
            this.initializeCharts();
            this.initializeDropdowns();
            this.initializeModals();
            this.initializeResponsiveHandling();
            this.initializeRecommendations();
            this.initializeStatCards();
            this.initializeGitHubIntegration();
            this.initializeCalendar();
            console.log('Dashboard initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showNotification('Failed to initialize dashboard', 'error');
        }
    }
    /**
     * Sidebar functionality
     */
    initializeSidebar() {
        const sidebar = getElementById('sidebar');
        const contentArea = getElementById('contentArea');
        const collapseBtn = getElementById('collapseBtn');
        const mobileMenuBtn = getElementById('mobileMenuBtn');
        if (collapseBtn) {
            addEventListener(collapseBtn, 'click', () => {
                this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
                if (sidebar) {
                    toggleClass(sidebar, 'collapsed');
                }
                if (contentArea) {
                    toggleClass(contentArea, 'expanded');
                }
                // Change icon
                if (this.state.sidebarCollapsed) {
                    setInnerHTML(collapseBtn, '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-right" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>');
                }
                else {
                    setInnerHTML(collapseBtn, '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-left" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>');
                }
            });
        }
        if (mobileMenuBtn) {
            addEventListener(mobileMenuBtn, 'click', () => {
                if (sidebar) {
                    toggleClass(sidebar, 'open');
                }
            });
        }
        // Close mobile menu when clicking outside
        addEventListener(document, 'click', (e) => {
            const target = e.target;
            if (sidebar && !sidebar.contains(target) && target !== mobileMenuBtn) {
                removeClass(sidebar, 'open');
            }
        });
    }
    /**
     * Theme toggle functionality
     */
    initializeThemeToggle() {
        const themeToggle = getElementById('themeToggle');
        if (themeToggle) {
            addEventListener(themeToggle, 'click', () => {
                this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
                if (this.state.theme === 'dark') {
                    addClass(document.body, 'bg-gray-900');
                    removeClass(document.body, 'bg-gray-50');
                    setInnerHTML(themeToggle, '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
                }
                else {
                    removeClass(document.body, 'bg-gray-900');
                    addClass(document.body, 'bg-gray-50');
                    setInnerHTML(themeToggle, '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>');
                }
            });
        }
    }
    /**
     * Enhanced Chart initialization and management
     */
    initializeCharts() {
        // Enhanced Engagement Chart Sample Data
        const engagementData = {
            7: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                instagram: [120, 150, 180, 170, 200, 220, 210],
                facebook: [80, 100, 120, 110, 140, 160, 150]
            },
            14: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                instagram: [110, 130, 140, 160, 170, 180, 175, 160, 150, 170, 190, 210, 220, 210],
                facebook: [70, 90, 100, 120, 130, 140, 135, 120, 110, 130, 150, 170, 180, 170]
            },
            30: {
                labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
                instagram: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 120, 130],
                facebook: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 80, 90]
            }
        };
        // Initialize chart only if Chart.js is available
        if (typeof window.Chart !== 'undefined') {
            try {
                const ctx = getElementById('engagementChart');
                if (ctx) {
                    const chartContext = ctx.getContext('2d');
                    if (chartContext) {
                        this.engagementChart = new window.Chart(chartContext, {
                            type: 'line',
                            data: {
                                labels: engagementData[7].labels,
                                datasets: [
                                    {
                                        label: 'Instagram',
                                        data: engagementData[7].instagram,
                                        borderColor: '#CC0033',
                                        backgroundColor: 'rgba(204,0,51,0.1)',
                                        pointBackgroundColor: '#CC0033',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 2,
                                        pointRadius: 6,
                                        pointHoverRadius: 8,
                                        fill: true,
                                        borderWidth: 3
                                    },
                                    {
                                        label: 'Facebook',
                                        data: engagementData[7].facebook,
                                        borderColor: '#2563eb',
                                        backgroundColor: 'rgba(37,99,235,0.1)',
                                        pointBackgroundColor: '#2563eb',
                                        pointBorderColor: '#fff',
                                        pointBorderWidth: 2,
                                        pointRadius: 6,
                                        pointHoverRadius: 8,
                                        fill: true,
                                        borderWidth: 3
                                    }
                                ]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                interaction: {
                                    intersect: false,
                                    mode: 'index'
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        titleColor: '#fff',
                                        bodyColor: '#fff',
                                        borderColor: '#CC0033',
                                        borderWidth: 1,
                                        cornerRadius: 8,
                                        displayColors: true,
                                        callbacks: {
                                            label: function (context) {
                                                return context.dataset.label + ': ' + context.parsed.y + ' engagements';
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
                                            color: '#6b7280',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(0,0,0,0.05)'
                                        },
                                        ticks: {
                                            color: '#6b7280',
                                            font: {
                                                size: 12
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            }
            catch (error) {
                console.error('Failed to initialize chart:', error);
                const chartElement = getElementById('engagementChart');
                if (chartElement) {
                    setInnerHTML(chartElement, '<div class="flex items-center justify-center h-full text-gray-500">Chart loading failed</div>');
                }
            }
        }
        else {
            console.warn('Chart.js failed to load. Chart functionality will be disabled.');
            const chartElement = getElementById('engagementChart');
            if (chartElement) {
                setInnerHTML(chartElement, '<div class="flex items-center justify-center h-full text-gray-500">Chart loading failed</div>');
            }
        }
    }
    /**
     * Initialize dropdowns
     */
    initializeDropdowns() {
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('[data-dropdown-trigger]');
            const content = dropdown.querySelector('[data-dropdown-content]');
            if (trigger && content) {
                addEventListener(trigger, 'click', (e) => {
                    e.stopPropagation();
                    toggleClass(content, 'hidden');
                });
            }
        });
        // Close dropdowns when clicking outside
        addEventListener(document, 'click', () => {
            const openDropdowns = document.querySelectorAll('[data-dropdown-content]:not(.hidden)');
            openDropdowns.forEach(dropdown => {
                addClass(dropdown, 'hidden');
            });
        });
    }
    /**
     * Initialize modals
     */
    initializeModals() {
        const modals = document.querySelectorAll('[data-modal]');
        modals.forEach(modal => {
            const trigger = document.querySelector(`[data-modal-trigger="${modal.getAttribute('data-modal')}"]`);
            const closeBtn = modal.querySelector('[data-modal-close]');
            if (trigger) {
                addEventListener(trigger, 'click', () => {
                    removeClass(modal, 'hidden');
                });
            }
            if (closeBtn) {
                addEventListener(closeBtn, 'click', () => {
                    addClass(modal, 'hidden');
                });
            }
            // Close modal when clicking outside
            addEventListener(modal, 'click', (e) => {
                if (e.target === modal) {
                    addClass(modal, 'hidden');
                }
            });
        });
    }
    /**
     * Initialize responsive handling
     */
    initializeResponsiveHandling() {
        const handleResize = throttle(() => {
            const sidebar = getElementById('sidebar');
            if (window.innerWidth < 768 && sidebar) {
                addClass(sidebar, 'collapsed');
                this.state.sidebarCollapsed = true;
            }
        }, 250);
        addEventListener(window, 'resize', handleResize);
        handleResize(); // Initial call
    }
    /**
     * Initialize recommendations
     */
    initializeRecommendations() {
        const recommendations = [
            {
                title: 'Increase Instagram Engagement',
                description: 'Post during peak hours (2-4 PM) for better reach',
                type: 'success',
                icon: 'trending-up'
            },
            {
                title: 'Facebook Content Strategy',
                description: 'Video content performs 3x better than images',
                type: 'info',
                icon: 'video'
            },
            {
                title: 'Hashtag Optimization',
                description: 'Use 5-7 relevant hashtags for maximum visibility',
                type: 'warning',
                icon: 'hash'
            }
        ];
        const container = getElementById('recommendationsContainer');
        if (container) {
            const recommendationsHTML = recommendations.map(rec => `
                <div class="bg-white rounded-xl shadow-soft p-6 animate-bounce-in transition-all duration-300 hover:shadow-glow hover:-translate-y-2 border border-${rec.type === 'success' ? 'green' : rec.type === 'warning' ? 'yellow' : 'blue'}-200/50">
                    <div class="flex items-start gap-4">
                        <div class="bg-${rec.type === 'success' ? 'green' : rec.type === 'warning' ? 'yellow' : 'blue'}-100 p-3 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-${rec.type === 'success' ? 'green' : rec.type === 'warning' ? 'yellow' : 'blue'}-600" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-900 mb-2">${rec.title}</h4>
                            <p class="text-gray-600 text-sm">${rec.description}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            setInnerHTML(container, recommendationsHTML);
        }
    }
    /**
     * Initialize stat cards
     */
    initializeStatCards() {
        const statCards = [
            { label: 'Total Posts', value: '156', change: '+12%', trend: 'up' },
            { label: 'Engagement Rate', value: '8.2%', change: '+2.1%', trend: 'up' },
            { label: 'Reach', value: '45.2K', change: '+18%', trend: 'up' },
            { label: 'Followers', value: '12.8K', change: '+5%', trend: 'up' }
        ];
        const container = getElementById('statCardsContainer');
        if (container) {
            const cardsHTML = statCards.map(card => `
                <div class="bg-white rounded-xl shadow-soft p-6 animate-bounce-in transition-all duration-300 hover:shadow-glow hover:-translate-y-2">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-medium text-gray-600">${card.label}</h3>
                        <span class="text-sm font-medium text-${card.trend === 'up' ? 'green' : 'red'}-600">${card.change}</span>
                    </div>
                    <p class="text-3xl font-bold text-gray-900">${card.value}</p>
                </div>
            `).join('');
            setInnerHTML(container, cardsHTML);
        }
    }
    /**
     * Initialize GitHub integration
     */
    initializeGitHubIntegration() {
        const connectBtn = getElementById('connectGitHub');
        const disconnectBtn = getElementById('disconnectGitHub');
        const testBtn = getElementById('testGitHub');
        if (connectBtn) {
            addEventListener(connectBtn, 'click', () => this.handleGitHubConnection());
        }
        if (disconnectBtn) {
            addEventListener(disconnectBtn, 'click', () => this.handleGitHubDisconnection());
        }
        if (testBtn) {
            addEventListener(testBtn, 'click', () => this.testGitHubConnection());
        }
    }
    /**
     * Initialize calendar
     */
    initializeCalendar() {
        try {
            this.calendarManager = new CalendarManager();
        }
        catch (error) {
            console.error('Failed to initialize calendar:', error);
            this.showNotification('Failed to initialize calendar', 'error');
        }
    }
    /**
     * GitHub connection handler
     */
    handleGitHubConnection() {
        this.showNotification('GitHub connection feature coming soon!', 'info');
    }
    /**
     * GitHub disconnection handler
     */
    handleGitHubDisconnection() {
        this.state.githubConfig.connected = false;
        this.showNotification('GitHub disconnected successfully', 'success');
    }
    /**
     * Test GitHub connection
     */
    testGitHubConnection() {
        this.showNotification('Testing GitHub connection...', 'info');
        // Implementation would go here
    }
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = {
            id: Date.now().toString(),
            type,
            title: type.charAt(0).toUpperCase() + type.slice(1),
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.state.notifications.push(notification);
        // Create notification element
        const notificationElement = document.createElement('div');
        notificationElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in ${type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
                type === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'}`;
        notificationElement.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="font-medium">${notification.title}</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
                <button class="flex-shrink-0 opacity-70 hover:opacity-100" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(notificationElement);
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.remove();
            }
        }, 5000);
    }
    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Get calendar manager
     */
    getCalendarManager() {
        return this.calendarManager;
    }
}
// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new DashboardApp();
        // Make app globally available for debugging
        window.dashboardApp = app;
        console.log('Dashboard application started successfully');
    }
    catch (error) {
        console.error('Failed to start dashboard application:', error);
    }
});
//# sourceMappingURL=main.js.map