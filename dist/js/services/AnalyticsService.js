import { Chart } from 'chart.js/auto';
class AnalyticsService {
    constructor() {
        this.baseUrl = '/api/analytics';
    }
    async fetchAnalyticsData() {
        try {
            const response = await fetch(`${this.baseUrl}/overview`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching analytics data:', error);
            // Return mock data for development
            return this.getMockData();
        }
    }
    async fetchPlatformData(platform) {
        try {
            const response = await fetch(`${this.baseUrl}/platform/${platform}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error(`Error fetching ${platform} data:`, error);
            return null;
        }
    }
    getMockData() {
        return {
            followers: {
                total: 15420,
                change: 12.5,
                platforms: {
                    instagram: 8200,
                    facebook: 4500,
                    twitter: 2720
                }
            },
            engagement: {
                rate: 4.8,
                likes: 2840,
                comments: 420,
                shares: 156
            },
            reach: {
                total: 89200,
                change: 8.3,
                platforms: {
                    instagram: 52000,
                    facebook: 28000,
                    twitter: 920
                }
            },
            posts: {
                total: 156,
                scheduled: 12,
                published: 144
            },
            topPosts: [
                {
                    id: '1',
                    content: 'Exciting news from Rutgers! 🎓',
                    platform: 'instagram',
                    engagement: 284,
                    reach: 5200,
                    date: '2241'
                },
                {
                    id: '2',
                    content: 'Campus life at its finest 📚',
                    platform: 'facebook',
                    engagement: 198,
                    reach: 3800,
                    date: '2241'
                },
                {
                    id: '3',
                    content: 'Research breakthrough announcement',
                    platform: 'twitter',
                    engagement: 156,
                    reach: 2100,
                    date: '224-13'
                }
            ],
            platformData: {
                instagram: {
                    followers: 8200,
                    engagement: 5.2,
                    reach: 52000,
                    posts: 89
                },
                facebook: {
                    followers: 4500,
                    engagement: 4.1,
                    reach: 28000,
                    posts: 45
                },
                twitter: {
                    followers: 2720,
                    engagement: 3.8,
                    reach: 9200,
                    posts: 22
                }
            }
        };
    }
    renderFollowersChart(data) {
        const ctx = document.getElementById('followersChart');
        if (!ctx)
            return;
        const chartData = {
            labels: Object.keys(data.followers.platforms),
            datasets: [{
                    label: 'Followers',
                    data: Object.values(data.followers.platforms),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 32, 1, 1)',
                        'rgba(54, 35, 1, 1)',
                        'rgba(255, 66, 1, 1)'
                    ],
                    borderWidth: 2
                }]
        };
        new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    renderEngagementChart(data) {
        const ctx = document.getElementById('engagementChart');
        if (!ctx)
            return;
        const chartData = {
            labels: ['Likes', 'Comments', 'Shares'],
            datasets: [{
                    label: 'Engagement',
                    data: [data.engagement.likes, data.engagement.comments, data.engagement.shares],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(75, 92, 1, 1)',
                        'rgba(255, 64, 1, 1)',
                        'rgba(153, 255, 1, 1)'
                    ],
                    borderWidth: 2
                }]
        };
        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    renderReachChart(data) {
        const ctx = document.getElementById('reachChart');
        if (!ctx)
            return;
        const chartData = {
            labels: Object.keys(data.reach.platforms),
            datasets: [{
                    label: 'Reach',
                    data: Object.values(data.reach.platforms),
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 235, 1, 1)',
                    borderWidth: 2,
                    fill: true
                }]
        };
        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    updateMetrics(data) {
        // Update follower metrics
        const followerTotal = document.getElementById('followerTotal');
        const followerChange = document.getElementById('followerChange');
        if (followerTotal)
            followerTotal.textContent = data.followers.total.toLocaleString();
        if (followerChange) {
            followerChange.textContent = `${data.followers.change > 0 ? '+' : ''}${data.followers.change}%`;
            followerChange.className = data.followers.change >= 0 ? 'text-green-600' : 'text-red-600';
        }
        // Update engagement metrics
        const engagementRate = document.getElementById('engagementRate');
        const totalLikes = document.getElementById('totalLikes');
        const totalComments = document.getElementById('totalComments');
        const totalShares = document.getElementById('totalShares');
        if (engagementRate)
            engagementRate.textContent = `${data.engagement.rate}%`;
        if (totalLikes)
            totalLikes.textContent = data.engagement.likes.toLocaleString();
        if (totalComments)
            totalComments.textContent = data.engagement.comments.toLocaleString();
        if (totalShares)
            totalShares.textContent = data.engagement.shares.toLocaleString();
        // Update reach metrics
        const reachTotal = document.getElementById('reachTotal');
        const reachChange = document.getElementById('reachChange');
        if (reachTotal)
            reachTotal.textContent = data.reach.total.toLocaleString();
        if (reachChange) {
            reachChange.textContent = `${data.reach.change > 0 ? '+' : ''}${data.reach.change}%`;
            reachChange.className = data.reach.change >= 0 ? 'text-green-600' : 'text-red-600';
        }
        // Update post metrics
        const totalPosts = document.getElementById('totalPosts');
        const scheduledPosts = document.getElementById('scheduledPosts');
        const publishedPosts = document.getElementById('publishedPosts');
        if (totalPosts)
            totalPosts.textContent = data.posts.total.toString();
        if (scheduledPosts)
            scheduledPosts.textContent = data.posts.scheduled.toString();
        if (publishedPosts)
            publishedPosts.textContent = data.posts.published.toString();
    }
    renderTopPosts(data) {
        const container = document.getElementById('topPostsContainer');
        if (!container)
            return;
        container.innerHTML = data.topPosts.map(post => `
      <div class="bg-white rounded-lg shadow p-4b-4">
        <div class="flex justify-between items-start mb-2        <div class=flexitems-center space-x-2
            <span class=px-2 py-1 text-xs font-medium rounded-full bg-blue-1000>
              ${post.platform}
            </span>
            <span class=text-sm text-gray-50${post.date}</span>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">${post.engagement} engagements</div>
            <div class=text-xs text-gray-500ost.reach.toLocaleString()} reach</div>
          </div>
        </div>
        <p class="text-gray-70sm">${post.content}</p>
      </div>
    `).join('');
    }
    async initialize() {
        try {
            const data = await this.fetchAnalyticsData();
            this.updateMetrics(data);
            this.renderFollowersChart(data);
            this.renderEngagementChart(data);
            this.renderReachChart(data);
            this.renderTopPosts(data);
        }
        catch (error) {
            console.error('Error initializing analytics:', error);
        }
    }
}
// Export for use in other files
export { AnalyticsService };
//# sourceMappingURL=AnalyticsService.js.map