/**
 * Main TypeScript entry point for Rutgers University Social Media Dashboard
 * Enhanced with type safety and error handling
 */

// Dashboard Interactive Functionality
import { DashboardState } from './types/dashboard';

// Simple inline components to avoid module loading issues
const Notification = {
    show: ({ message, type = 'info' }: { message: string; type?: string }) => {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

const Modal = {
    show: (content: any) => console.log('Modal would show:', content),
    hide: () => console.log('Modal would hide'),
    create: (options: any) => {
        const modal = document.createElement('div');
        modal.innerHTML = options.content;
        return modal;
    }
};

// Simple inline SimpleChart class
class SimpleChart {
    private width: number = 600;
    private height: number = 300;
    private padding: number = 50;
    private animationFrame: number | null = null;
    private animationProgress: number = 0;
    private isAnimating: boolean = false;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private data: ChartData;

    constructor(canvasId: string, data: ChartData) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }
        
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = ctx;
        this.data = data;
        this.resize();
        this.render();
    }
    
    resize() {
        const container = this.canvas.parentElement;
        if (container) {
            this.width = container.clientWidth;
            this.height = container.clientHeight || 350;
            if (this.width < 400) {
                this.width = 400;
            }
        } else {
            this.width = 600;
            this.height = 350;
        }
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
            this.ctx = ctx;
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
        }
    }
    
    update(newData: ChartData) {
        this.data = newData;
        this.startAnimation();
    }
    
    startAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.animationProgress = 0;
        this.isAnimating = true;
        this.animate();
    }
    
    animate() {
        this.animationProgress += 0.05;
        if (this.animationProgress >= 1) {
            this.animationProgress = 1;
            this.isAnimating = false;
        }
        this.render();
        if (this.isAnimating) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    render() {
        this.drawBackground();
        if (!this.data.datasets[0] || this.data.datasets[0].data.length === 0) {
            this.renderNoData();
            return;
        }
        
        const isStacked = this.data.datasets.length > 1;
        if (isStacked) {
            this.renderStackedBars();
        } else {
            this.renderSingleBars();
        }
    }
    
    renderStackedBars() {
        const chartWidth = this.width - (this.padding * 2);
        const topPadding = 120;
        const chartHeight = this.height - (this.padding * 2) - topPadding;
        const numMetrics = this.data.labels.length;
        
        const availableWidth = chartWidth - (numMetrics - 1) * 80;
        const barWidth = Math.max(availableWidth / numMetrics, 120);
        const barSpacing = 80;
        
        const totalValues = [];
        for (let i = 0; i < numMetrics; i++) {
            let total = 0;
            this.data.datasets.forEach(dataset => {
                if (dataset && dataset.data && Array.isArray(dataset.data) && i < dataset.data.length) {
                    const value = dataset.data[i];
                    if (typeof value === 'number' && !isNaN(value)) {
                        total += value;
                    }
                }
            });
            totalValues.push(total);
        }
        
        const maxTotal = Math.max(...totalValues);
        
        this.data.labels.forEach((label, metricIndex) => {
            const barX = this.padding + (metricIndex * (barWidth + barSpacing));
            let currentY = this.height - this.padding - topPadding;
            let totalValue = 0;
            
            for (let datasetIndex = this.data.datasets.length - 1; datasetIndex >= 0; datasetIndex--) {
                const dataset = this.data.datasets[datasetIndex];
                if (!dataset || !dataset.data) continue;
                
                const value = dataset.data[metricIndex];
                if (value === undefined || value === 0) continue;
                
                const animatedValue = value * this.animationProgress;
                const segmentHeight = (animatedValue / maxTotal) * chartHeight * 0.75;
                const segmentY = currentY - segmentHeight;
                
                const gradient = this.createPremiumGradient(segmentY, currentY, dataset.backgroundColor[0] || '#3B82F6');
                this.drawSegmentWithShadow(barX, segmentY, barWidth, segmentHeight, gradient, datasetIndex === this.data.datasets.length - 1, datasetIndex === 0);
                
                currentY = segmentY;
                totalValue += animatedValue;
            }
            
            this.drawTotalValue(barX + barWidth / 2, currentY - 45, totalValue);
            this.drawMetricLabel(barX + barWidth / 2, this.height - 20, label);
        });
        
        this.drawPremiumLegend();
    }
    
    createPremiumGradient(startY: number, endY: number, baseColor: string) {
        const gradient = this.ctx.createLinearGradient(0, startY, 0, endY);
        gradient.addColorStop(0, this.lightenColor(baseColor, 0.3));
        gradient.addColorStop(0.3, baseColor);
        gradient.addColorStop(0.7, this.darkenColor(baseColor, 0.2));
        gradient.addColorStop(1, this.darkenColor(baseColor, 0.4));
        return gradient;
    }
    
    drawSegmentWithShadow(x: number, y: number, width: number, height: number, gradient: CanvasGradient, isTopSegment: boolean, isBottomSegment: boolean) {
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 4;
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        const radius = 12;
        
        if (isTopSegment) {
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x, y + height);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
        } else if (isBottomSegment) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.ctx.lineTo(x, y);
        } else {
            this.ctx.rect(x, y, width, height);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    drawTotalValue(x: number, y: number, value: number) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
        
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(value.toLocaleString(), x, y);
    }
    
    drawMetricLabel(x: number, y: number, label: string) {
        this.ctx.fillStyle = '#6B7280';
        this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x, y);
    }
    
    drawPremiumLegend() {
        const legendY = 30;
        const legendSpacing = 140;
        
        this.data.datasets.forEach((dataset, index) => {
            const legendX = this.padding + (index * legendSpacing);
            
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 2;
            
            this.ctx.beginPath();
            this.drawRoundedRect(legendX - 8, legendY - 8, 140, 32, 8);
            this.ctx.fill();
            this.ctx.restore();
            
            const gradient = this.createPremiumGradient(legendY, legendY + 16, dataset.backgroundColor[0] || '#3B82F6');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(legendX, legendY, 16, 16);
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = 'bold 14px Inter, system-ui, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(dataset.label, legendX + 24, legendY + 12);
        });
    }
    
    renderSingleBars() {
        const chartWidth = this.width - (this.padding * 2);
        const chartHeight = this.height - (this.padding * 2);
        const numBars = this.data.labels.length;
        
        const barWidth = (chartWidth - (numBars - 1) * 40) / numBars;
        const maxValue = Math.max(...(this.data.datasets[0]?.data || []));
        const scale = chartHeight / (maxValue * 1.2);
        
        this.data.labels.forEach((label, index) => {
            const value = this.data.datasets[0]?.data[index];
            if (value === undefined) return;
            
            const barHeight = value * scale * this.animationProgress;
            const barX = this.padding + index * (barWidth + 40);
            const barY = this.height - this.padding - barHeight;
            
            const gradient = this.createPremiumGradient(barY, barY + barHeight, this.data.datasets[0]?.backgroundColor[index] || '#3B82F6');
            this.drawSegmentWithShadow(barX, barY, barWidth, barHeight, gradient, true, true);
            
            this.drawTotalValue(barX + barWidth / 2, barY - 25, value);
            this.drawMetricLabel(barX + barWidth / 2, this.height - 20, label);
        });
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    renderNoData() {
        this.ctx.fillStyle = '#6B7280';
        this.ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('No engagement data available', this.width / 2, this.height / 2 - 20);
        
        this.ctx.fillStyle = '#9CA3AF';
        this.ctx.font = '14px Inter, system-ui, sans-serif';
        this.ctx.fillText('for this period', this.width / 2, this.height / 2 + 10);
    }
    
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    
    lightenColor(color: string, amount: number) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color: string, amount: number) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 + (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 + (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Type definitions for compatibility
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
    }[];
}

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
let simpleChart: SimpleChart | null = null;

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// Utility functions
function showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    Notification.show({
        message,
        type,
        // duration: 5000, // Removed to fix type error
        // position: 'top-right' // Removed to fix type error
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
    
    // Skip chart initialization on analytics page (handled by analytics.html)
    if (window.location.pathname.includes('analytics.html')) {
        console.log('📊 Analytics page detected - skipping main.js chart initialization');
        // Set up event listeners only
        setupEventListeners();
        return;
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
        console.log('🔄 Loading dashboard data...');
        
        // Load analytics data with proper endpoint
        console.log('📊 Fetching analytics data...');
        const analyticsData = await apiCall('/analytics/dashboard?period=7d');
        console.log('✅ Analytics data received:', analyticsData);
        updateAnalyticsDisplay(analyticsData);
        
        // Load recent posts
        console.log('📝 Fetching recent posts...');
        const postsData = await apiCall('/posts?limit=5');
        console.log('✅ Posts data received:', postsData);
        updateRecentPosts(postsData);
        
        // Load calendar events
        console.log('📅 Fetching calendar events...');
        const eventsData = await apiCall('/calendar');
        console.log('✅ Calendar data received:', eventsData);
        updateUpcomingEvents(eventsData);
        
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        showNotification('Failed to load some dashboard data', 'warning');
        
        // Use premium SimpleChart even when API fails
        console.log('🔄 Using premium SimpleChart with sample data due to API failure...');
        initializeEngagementChart();
    }
}

function updateAnalyticsDisplay(data: any) {
    console.log('📊 Updating analytics display with data:', data);
    
    // Check if we have valid data
    if (!data || !data.data) {
        console.warn('⚠️ No analytics data available, using premium chart with sample data');
        initializeEngagementChart();
        return;
    }
    
    const analytics = data.data;
    
    // Update follower counts
    const instagramFollowers = document.getElementById('instagramFollowers');
    if (instagramFollowers && analytics.platformStats) {
        const instagram = analytics.platformStats.find((p: any) => p.platform === 'instagram');
        if (instagram) {
            instagramFollowers.textContent = instagram.followers?.toLocaleString() || '0';
        }
    }
    
    // Update other metrics
    const facebookFollowers = document.getElementById('facebookFollowers');
    if (facebookFollowers && analytics.platformStats) {
        const facebook = analytics.platformStats.find((p: any) => p.platform === 'facebook');
        if (facebook) {
            facebookFollowers.textContent = facebook.followers?.toLocaleString() || '0';
        }
    }
    
    const engagementRate = document.getElementById('engagementRate');
    if (engagementRate && analytics.overview) {
        const rate = analytics.overview.averageEngagement || 0;
        engagementRate.textContent = `${rate.toFixed(1)}%`;
    }
    
    const scheduledPosts = document.getElementById('scheduledPosts');
    if (scheduledPosts && analytics.overview) {
        scheduledPosts.textContent = analytics.overview.totalPosts || '0';
    }
    
    // Update chart with new data
    updateEngagementChart(analytics);
}

function showNoDataMessage() {
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw no data message
    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No engagement data available', width / 2, height / 2 - 20);
    
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText('for this period', width / 2, height / 2 + 10);
    
    console.log('📊 No data message displayed');
}

// Chart Functions
function initializeEngagementChart() {
    console.log('Starting simple chart initialization...');
    
    // Generate initial data for engagement types
    const chartData = generateChartData(7);
    console.log('Simple chart data generated:', chartData);
    
    try {
        console.log('Creating simple chart instance...');
        simpleChart = new SimpleChart('engagementChart', chartData);
        
        if (simpleChart) {
            console.log('Simple chart created successfully');
        } else {
            console.error('Failed to create simple chart');
        }
    } catch (error) {
        console.error('Error initializing simple chart:', error);
        createFallbackChart();
    }
}

function generateChartData(days: number): ChartData {
    // For engagement overview, we show engagement types, not time series
    const labels = ['Likes', 'Comments', 'Shares'];
    
    // Generate more balanced engagement data based on time period
    let instagramLikes, instagramComments, instagramShares;
    let facebookLikes, facebookComments, facebookShares;
    
    switch (days) {
        case 7:
            instagramLikes = 847;
            instagramComments = 156;
            instagramShares = 89;
            facebookLikes = 200;
            facebookComments = 90;
            facebookShares = 50;
            break;
        case 14:
            instagramLikes = 1214;
            instagramComments = 298;
            instagramShares = 167;
            facebookLikes = 350;
            facebookComments = 180;
            facebookShares = 100;
            break;
        case 30:
            instagramLikes = 2458;
            instagramComments = 742;
            instagramShares = 423;
            facebookLikes = 800;
            facebookComments = 400;
            facebookShares = 250;
            break;
        default:
            instagramLikes = 847;
            instagramComments = 156;
            instagramShares = 89;
            facebookLikes = 200;
            facebookComments = 90;
            facebookShares = 50;
    }
    
    return {
        labels,
        datasets: [
            {
                label: 'Instagram',
                data: [instagramLikes, instagramComments, instagramShares],
                backgroundColor: ['#FF6B6B'],
                borderColor: ['#E53E3E']
            },
            {
                label: 'Facebook',
                data: [facebookLikes, facebookComments, facebookShares],
                backgroundColor: ['#1890FF'],
                borderColor: ['#096DD9']
            }
        ]
    };
}



function updateEngagementChart(data: any) {
    console.log('📊 Updating engagement chart with data:', data);
    console.log('📊 Data structure check:', {
        hasData: !!data,
        hasOverview: !!(data && data.overview),
        hasPlatformStats: !!(data && data.platformStats),
        platformStatsLength: data?.platformStats?.length,
        overviewKeys: data?.overview ? Object.keys(data.overview) : []
    });
    
    if (!simpleChart) {
        console.log('🔄 Simple chart not initialized, creating new one...');
        initializeEngagementChart();
        return;
    }
    
    // Get current selected period
    const engagementRange = document.getElementById('engagementRange') as HTMLSelectElement;
    const days = engagementRange ? parseInt(engagementRange.value) : 7;
    console.log('📅 Selected period:', days, 'days');
    
    // Try to use API data first, fallback to generated data
    let chartData: ChartData;
    
    if (data && data.platformStats && Array.isArray(data.platformStats) && data.platformStats.length > 0) {
        console.log('✅ Using API platformStats for chart');
        chartData = generateChartDataFromAPI(data, days);
    } else if (data && data.overview) {
        console.log('✅ Using API overview data for chart');
        chartData = generateChartDataFromAPI(data, days);
    } else {
        console.log('⚠️ Using fallback data for chart');
        chartData = generateChartData(days);
    }
    
    console.log('📊 Final chart data:', chartData);
    
    // Update simple chart data
    try {
        simpleChart.update(chartData);
        console.log('✅ Chart updated successfully');
    } catch (error) {
        console.error('❌ Error updating chart:', error);
        // Fallback to simple chart
        createFallbackChart();
    }
}

function generateChartDataFromAPI(data: any, days: number): ChartData {
    console.log('📊 Generating chart data from API:', data);
    
    // Check if we have the new engagement structure with platform breakdown
    if (data.engagement && data.engagement.likes && data.engagement.comments && data.engagement.shares) {
        console.log('✅ Using new engagement structure for grouped chart');
        
        // Create grouped bar chart data
        const labels = ['Likes', 'Comments', 'Shares'];
        const instagramData = [
            data.engagement.likes.instagram || 0,
            data.engagement.comments.instagram || 0,
            data.engagement.shares.instagram || 0
        ];
        const facebookData = [
            data.engagement.likes.facebook || 0,
            data.engagement.comments.facebook || 0,
            data.engagement.shares.facebook || 0
        ];
        
        console.log('📊 Grouped chart data:', { labels, instagramData, facebookData });
        
        return {
            labels,
            datasets: [
                {
                    label: 'Instagram',
                    data: instagramData,
                    backgroundColor: ['#FF6B6B'], // Red for Instagram
                    borderColor: ['#E53E3E']
                },
                {
                    label: 'Facebook',
                    data: facebookData,
                    backgroundColor: ['#1890FF'], // Blue for Facebook (matches legend)
                    borderColor: ['#096DD9']
                }
            ]
        };
    }
    
    // Fallback: Check if we have platform-specific metrics in platformStats
    if (data.platformStats && Array.isArray(data.platformStats) && data.platformStats.length > 0) {
        console.log('✅ Using platformStats metrics for grouped chart');
        
        const labels = ['Likes', 'Comments', 'Shares'];
        const instagramData = [];
        const facebookData = [];
        
        const instagram = data.platformStats.find((p: any) => p.platform === 'instagram');
        const facebook = data.platformStats.find((p: any) => p.platform === 'facebook');
        
        if (instagram?.metrics && facebook?.metrics) {
            instagramData.push(
                instagram.metrics.likes || 0,
                instagram.metrics.comments || 0,
                instagram.metrics.shares || 0
            );
            facebookData.push(
                facebook.metrics.likes || 0,
                facebook.metrics.comments || 0,
                facebook.metrics.shares || 0
            );
            
            return {
                labels,
                datasets: [
                    {
                        label: 'Instagram',
                        data: instagramData,
                        backgroundColor: ['#FF6B6B'],
                        borderColor: ['#E53E3E']
                    },
                                    {
                    label: 'Facebook',
                    data: facebookData,
                    backgroundColor: ['#1890FF'],
                    borderColor: ['#096DD9']
                }
                ]
            };
        }
    }
    
    // Final fallback: Use overview data
    console.log('⚠️ Using overview data as fallback');
    const totalEngagement = data.overview?.totalEngagement || 1432;
    const scaleFactor = days / 7;
    const scaledEngagement = Math.round(totalEngagement * scaleFactor);
    
    return {
        labels: ['Total Engagement'],
        datasets: [
            {
                label: 'Engagement',
                data: [scaledEngagement],
                backgroundColor: ['#FF6B6B'],
                borderColor: ['#E53E3E']
            }
        ]
    };
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
            console.log(`Updating custom chart for ${days} days`);
            
            // Update simple chart with new data
            if (simpleChart) {
                const newData = generateChartData(days);
                simpleChart.update(newData);
                
                // Show notification
                showNotification(`Chart updated for last ${days} days`, 'success');
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
    console.log('DOM loaded, initializing dashboard...');
    initializeDashboard();
    
    // Force custom chart initialization with fallback
    console.log('Forcing custom chart initialization...');
    setTimeout(() => {
        try {
            initializeEngagementChart();
        } catch (error) {
            console.error('Custom chart failed, using fallback:', error);
            createFallbackChart();
        }
    }, 100);
});

// Robust chart initialization with retry logic
function initializeChartWithRetry(maxRetries = 5, delay = 200) {
    let retryCount = 0;
    
    const tryInitialize = () => {
        console.log(`Attempting to initialize custom chart (attempt ${retryCount + 1}/${maxRetries})`);
        
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
        
        // Initialize the custom chart
        try {
            initializeEngagementChart();
            console.log('Custom chart initialized successfully!');
        } catch (error) {
            console.error('Error during custom chart initialization:', error);
            retryCount++;
            if (retryCount < maxRetries) {
                setTimeout(tryInitialize, delay);
            }
        }
    };
    
    tryInitialize();
}

// Page-specific initialization
// if (window.location.pathname.endsWith('analytics.html')) {
//     document.addEventListener('DOMContentLoaded', () => {
//         // const analyticsService = new AnalyticsService(); // Commented out to fix import error
//         analyticsService.initialize();
//     });
// }

// Export functions for global access
(window as any).openQuickPost = openQuickPost;
(window as any).openPostComposer = openPostComposer;
(window as any).viewInstagramAnalytics = viewInstagramAnalytics;
(window as any).viewFacebookAnalytics = viewFacebookAnalytics;
(window as any).exportChart = exportChart;
(window as any).submitQuickPost = submitQuickPost;
(window as any).submitPost = submitPost;

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing dashboard...');
    console.log('🔍 Checking for canvas element...');
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    console.log('📊 Canvas element found:', canvas);
    if (canvas) {
        console.log('📏 Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('📍 Canvas position:', canvas.getBoundingClientRect());
    }
    initializeDashboard();
});

// Fallback chart function (simple canvas implementation)
function createFallbackChart() {
    console.log('Creating fallback chart...');
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas not found for fallback chart');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(248, 250, 252, 0.98)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Data
    const labels = ['Likes', 'Comments', 'Shares'];
    const data = [2847, 156, 89];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    
    // Calculate scale
    const maxValue = Math.max(...data);
    const scale = chartHeight / (maxValue * 1.2);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.1)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + (chartHeight / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw bars
    const barWidth = (chartWidth - (labels.length - 1) * 40) / labels.length;
    
    data.forEach((value, index) => {
        const x = padding + index * (barWidth + 40);
        const barHeight = value * scale;
        const y = padding + chartHeight - barHeight;
        
        // Create gradient for bar
        const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        const color = colors[index] || '#FF6B6B';
        barGradient.addColorStop(0, color);
        barGradient.addColorStop(1, color + 'CC');
        
        // Draw rounded rectangle
        ctx.save();
        ctx.fillStyle = barGradient;
        ctx.beginPath();
        ctx.moveTo(x + 12, y);
        ctx.lineTo(x + barWidth - 12, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + 12);
        ctx.lineTo(x + barWidth, y + barHeight - 12);
        ctx.quadraticCurveTo(x + barWidth, y + barHeight, x + barWidth - 12, y + barHeight);
        ctx.lineTo(x + 12, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - 12);
        ctx.lineTo(x, y + 12);
        ctx.quadraticCurveTo(x, y, x + 12, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Draw value on top
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value.toLocaleString(), x + barWidth / 2, y - 10);
    });
    
    // Draw labels
    labels.forEach((label, index) => {
        const x = padding + index * (barWidth + 40) + barWidth / 2;
        const y = padding + chartHeight + 25;
        
        ctx.fillStyle = '#6B7280';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y);
    });
    
    console.log('Fallback chart created successfully');
}

// Force custom chart initialization
(window as any).forceCustomChart = () => {
    console.log('Forcing custom chart initialization...');
    
    // Clear any existing chart
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Initialize custom chart
    initializeEngagementChart();
};

// Force reinitialize the chart
(window as any).reinitChart = () => {
    console.log('Reinitializing simple chart...');
    if (simpleChart) {
        simpleChart.destroy();
        simpleChart = null;
    }
    initializeEngagementChart();
};

// Manual fallback chart trigger
(window as any).useFallbackChart = () => {
    console.log('Manually triggering fallback chart...');
    createFallbackChart();
};

// Manual chart test with API data
(window as any).testChartWithAPIData = () => {
    console.log('🧪 Testing chart with API data...');
    
    // Simulate the exact API response structure
    const mockAPIData = {
        overview: {
            totalPosts: 45,
            totalEngagement: {
                likes: 2847,
                comments: 156,
                shares: 89,
                total: 3092
            },
            averageEngagement: 68.71
        },
        platformStats: [
            {
                platform: 'instagram',
                followers: 12450,
                posts: 28,
                engagement: 2156
            },
            {
                platform: 'facebook',
                followers: 8920,
                posts: 17,
                engagement: 936
            }
        ]
    };
    
    console.log('🧪 Mock API data:', mockAPIData);
    updateEngagementChart(mockAPIData);
};

// Debug chart state
(window as any).debugChart = () => {
    console.log('🔍 Chart debug info:');
    console.log('- Simple chart instance:', simpleChart);
    console.log('- Chart canvas:', document.getElementById('engagementChart'));
    console.log('- Chart container:', document.querySelector('.chart-container'));
};

// Force chart initialization
(window as any).forceChart = () => {
    console.log('🔧 Forcing chart initialization...');
    
    // Clear any existing chart
    const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Initialize chart with mock data
    const chartData = generateChartData(7);
    console.log('📊 Chart data:', chartData);
    
    try {
        simpleChart = new SimpleChart('engagementChart', chartData);
        console.log('✅ Chart initialized successfully');
    } catch (error) {
        console.error('❌ Chart initialization failed:', error);
        createFallbackChart();
    }
}; 