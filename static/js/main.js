/**
 * Rutgers University Social Media Dashboard
 * Enhanced Main JavaScript file - CSP compliant
 */

document.addEventListener('DOMContentLoaded', function() {
    // Error handling for Chart.js
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js failed to load. Chart functionality will be disabled.');
        const chartElement = document.getElementById('engagementChart');
        if (chartElement) {
            chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-600">Chart loading failed</div>';
        }
    }

    // Initialize dashboard components
    initializeSidebar();
    initializeThemeToggle();
    initializeCharts();
    initializeDropdowns();
    initializeModals();
    initializeResponsiveHandling();
    initializeRecommendations();
    initializeStatCards();
    initializeGitHubIntegration();

    // Chart.js demo for analytics.html
    const chartCanvas = document.getElementById('analyticsChart');
    const rangeSelector = document.getElementById('analyticsRange');
    let chartInstance = null;
    const demoData = {
        7: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            instagram: [120, 150, 180, 170, 200, 220, 210],
            facebook: [80, 100, 120, 110, 140, 160, 150]
        },
        14: {
            labels: [
                'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
                'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
            ],
            instagram: [110, 130, 140, 160, 170, 180, 175, 160, 150, 170, 190, 210, 220, 210],
            facebook: [70, 90, 100, 120, 130, 140, 135, 120, 110, 130, 150, 170, 180, 170]
        },
        30: {
            labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
            instagram: Array.from({length: 30}, () => Math.floor(Math.random()*100+100)),
            facebook: Array.from({length: 30}, () => Math.floor(Math.random()*80+60))
        }
    };
    function renderChart(days) {
        const data = demoData[days];
        if (!data) return;
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Instagram',
                        data: data.instagram,
                        borderColor: '#CC0033',
                        backgroundColor: 'rgba(204,0,51,0.1)',
                        tension: 0.4,
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
                        data: data.facebook,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37,99,235,0.1)',
                        tension: 0.4,
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
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    if (chartCanvas) {
        renderChart(7);
        if (rangeSelector) {
            rangeSelector.addEventListener('change', function() {
                renderChart(this.value);
            });
        }
    }
});

/**
 * Sidebar functionality
 */
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.getElementById('contentArea');
    const collapseBtn = document.getElementById('collapseBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    let isCollapsed = false;
    
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed');
            contentArea.classList.toggle('expanded');
            
            // Change icon
            if (isCollapsed) {
                collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-right" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
            } else {
                collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-left" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
            }
        });
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && !sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
            sidebar.classList.remove('open');
        }
    });
}

/**
 * Theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    let isDarkMode = false;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            
            if (isDarkMode) {
                document.body.classList.add('bg-gray-900');
                document.body.classList.remove('bg-gray-50');
                themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
            } else {
                document.body.classList.remove('bg-gray-900');
                document.body.classList.add('bg-gray-50');
                themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
            }
        });
    }
}

/**
 * Enhanced Chart initialization and management
 */
function initializeCharts() {
    // Enhanced Engagement Chart Sample Data with realistic dates
    const getDateLabels = (days) => {
        const labels = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            if (days <= 7) {
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            } else if (days <= 14) {
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            } else {
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
        }
        return labels;
    };

    const engagementData = {
        7: {
            labels: getDateLabels(7),
            instagram: [120, 150, 180, 170, 200, 220, 210],
            facebook: [80, 100, 120, 110, 140, 160, 150]
        },
        14: {
            labels: getDateLabels(14),
            instagram: [110, 130, 140, 160, 170, 180, 175, 160, 150, 170, 190, 210, 220, 210],
            facebook: [70, 90, 100, 120, 130, 140, 135, 120, 110, 130, 150, 170, 180, 170]
        },
        30: {
            labels: getDateLabels(30),
            instagram: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 120, 130],
            facebook: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 80, 90]
        }
    };

    // Initialize chart only if Chart.js is available
    let engagementChart = null;
    if (typeof Chart !== 'undefined') {
        try {
            const ctx = document.getElementById('engagementChart');
            if (ctx) {
                const chartContext = ctx.getContext('2d');
                engagementChart = new Chart(chartContext, {
                    type: 'line',
                    data: {
                        labels: engagementData[7].labels,
                        datasets: [
                            {
                                label: 'Instagram',
                                data: engagementData[7].instagram,
                                borderColor: '#CC0033',
                                backgroundColor: 'rgba(204,0,51,0.1)',
                                tension: 0.4,
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
                                tension: 0.4,
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
                                    label: function(context) {
                                        return context.dataset.label + ': ' + context.parsed.y + ' engagements';
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: true,
                                    color: 'rgba(0,0,0,0.05)',
                                    drawBorder: false
                                },
                                ticks: {
                                    color: '#6b7280',
                                    font: {
                                        size: 12
                                    },
                                    maxTicksLimit: 7,
                                    callback: function(value, index, values) {
                                        // Show date labels for better context
                                        const labels = this.getLabelForValue(value);
                                        return labels;
                                    }
                                },
                                border: {
                                    display: false
                                }
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0,0,0,0.05)',
                                    drawBorder: false
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
        } catch (error) {
            console.error('Failed to initialize chart:', error);
            const chartElement = document.getElementById('engagementChart');
            if (chartElement) {
                chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-600">Chart initialization failed</div>';
            }
        }
    }

    // Chart range selector
    const rangeSelector = document.getElementById('engagementRange');
    if (rangeSelector && engagementChart) {
        rangeSelector.addEventListener('change', function() {
            if (engagementChart) {
                const range = this.value;
                engagementChart.data.labels = engagementData[range].labels;
                engagementChart.data.datasets[0].data = engagementData[range].instagram;
                engagementChart.data.datasets[1].data = engagementData[range].facebook;
                engagementChart.update('active');
            }
        });
    }

    // Export chart function
    window.exportChart = function() {
        if (engagementChart) {
            const link = document.createElement('a');
            link.download = 'engagement-chart.png';
            link.href = engagementChart.toBase64Image();
            link.click();
        }
    };
}

/**
 * Initialize recommendation cards interactions
 */
function initializeRecommendations() {
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    
    recommendationCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle different recommendation types
            const title = this.querySelector('h4').textContent;
            if (title.includes('Content Idea')) {
                // Open post composer with the idea
                window.location.href = 'post-composer.html';
            } else if (title.includes('Best Posting Time')) {
                // Show detailed timing analysis
                showNotification('Posting time analysis opened', 'info');
            } else if (title.includes('Trending Hashtags')) {
                // Show hashtag analytics
                showNotification('Hashtag analytics opened', 'info');
            }
        });
    });
}

/**
 * Initialize stat cards with animations
 */
function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    statCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Dropdown menu functionality
 */
function initializeDropdowns() {
    const moreBtns = document.querySelectorAll('.more-btn');
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    let openDropdown = null;

    moreBtns.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close any open dropdown
            if (openDropdown && openDropdown !== dropdowns[idx]) {
                openDropdown.classList.add('hidden');
            }
            dropdowns[idx].classList.toggle('hidden');
            openDropdown = dropdowns[idx].classList.contains('hidden') ? null : dropdowns[idx];
        });
    });

    document.addEventListener('click', () => {
        dropdowns.forEach(menu => menu.classList.add('hidden'));
        openDropdown = null;
    });

    dropdowns.forEach((menu, idx) => {
        const viewBtn = menu.querySelector('.view-btn');
        const editBtn = menu.querySelector('.edit-btn');
        const deleteBtn = menu.querySelector('.delete-btn');

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showModal(idx);
                menu.classList.add('hidden');
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('Edit post coming soon!');
                menu.classList.add('hidden');
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this post?')) {
                    alert('Delete post coming soon!');
                }
                menu.classList.add('hidden');
            });
        }
    });
}

/**
 * Modal functionality
 */
function initializeModals() {
    const modal = document.getElementById('postModal');
    const closeBtn = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    function showModal(idx) {
        const posts = [
            {
                title: 'Spring Tournament Highlights',
                platform: 'Instagram',
                content: 'Amazing shots from our spring tournament! The course was in perfect condition and the competition was fierce. Congratulations to all participants!',
                image: 'tournament-highlights.jpg',
                engagement: { likes: 248, comments: 42, shares: 15 }
            },
            {
                title: 'Weekend Golf Special',
                platform: 'Facebook',
                content: 'Don\'t miss our weekend special! 20% off green fees for groups of 4 or more. Perfect weather for golf this weekend!',
                image: 'weekend-special.jpg',
                engagement: { likes: 187, comments: 23, shares: 23 }
            },
            {
                title: 'Golf Tip: Perfect Your Putt',
                platform: 'Instagram',
                content: 'Master the art of putting with these pro tips! Remember: keep your head still and follow through smoothly.',
                image: 'putting-tips.jpg',
                engagement: { likes: 312, comments: 28, shares: 8 }
            }
        ];

        const post = posts[idx];
        if (post && modalContent) {
            modalContent.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">${post.title}</h3>
                        <span class="badge badge-primary">${post.platform}</span>
                    </div>
                    <p class="text-gray-600">${post.content}</p>
                    <div class="flex space-x-4 text-sm">
                        <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            ${post.engagement.likes}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 3.6 17L2 21l4-1.6A8.38 8.38 0 0 0 12 19.5a8.5 8.5 0 1 0-8.5-8.5"/>
                            </svg>
                            ${post.engagement.comments}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon w-4 h-4 text-green-500" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"/>
                                <circle cx="6" cy="12" r="3"/>
                                <circle cx="18" cy="19" r="3"/>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                            ${post.engagement.shares}
                        </span>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
        }
    }

    window.showModal = showModal;
}

/**
 * Responsive handling
 */
function initializeResponsiveHandling() {
    function handleResize() {
        const sidebar = document.getElementById('sidebar');
        const contentArea = document.getElementById('contentArea');
        
        if (window.innerWidth < 768) {
            sidebar.classList.add('collapsed');
            contentArea.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            contentArea.classList.remove('expanded');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

/**
 * Utility functions
 */
function safeGetElement(id) {
    try {
        return document.getElementById(id);
    } catch (error) {
        console.error(`Error getting element with id: ${id}`, error);
        return null;
    }
}

function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // Could add error reporting service here
}

/**
 * GitHub Integration functionality
 */
function initializeGitHubIntegration() {
    // Toggle token visibility
    const toggleTokenBtn = document.getElementById('toggleToken');
    const githubTokenInput = document.getElementById('githubToken');
    
    if (toggleTokenBtn && githubTokenInput) {
        toggleTokenBtn.addEventListener('click', function() {
            const type = githubTokenInput.type === 'password' ? 'text' : 'password';
            githubTokenInput.type = type;
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Manual connection button
    const manualConnectBtn = document.getElementById('manualConnectBtn');
    if (manualConnectBtn) {
        manualConnectBtn.addEventListener('click', handleManualGitHubConnection);
    }

    // GitHub connect button
    const githubConnectBtn = document.getElementById('githubConnectBtn');
    if (githubConnectBtn) {
        githubConnectBtn.addEventListener('click', handleGitHubOAuth);
    }
}

/**
 * Handle manual GitHub connection
 */
function handleManualGitHubConnection() {
    const username = document.getElementById('githubUsername')?.value;
    const repo = document.getElementById('githubRepo')?.value;
    const token = document.getElementById('githubToken')?.value;

    if (!username || !repo || !token) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    const btn = document.getElementById('manualConnectBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Connecting...';
    btn.disabled = true;

    // Simulate connection test
    setTimeout(() => {
        // Test the connection using GitHub API
        testGitHubCredentials(username, repo, token)
            .then(success => {
                if (success) {
                    showNotification('GitHub connected successfully!', 'success');
                    updateGitHubStatus('connected');
                } else {
                    showNotification('Invalid credentials. Please check your token and repository.', 'error');
                }
            })
            .catch(error => {
                showNotification('Connection failed. Please try again.', 'error');
                console.error('GitHub connection error:', error);
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    }, 1000);
}

/**
 * Handle GitHub OAuth connection
 */
function handleGitHubOAuth() {
    showNotification('Redirecting to GitHub...', 'info');
    
    // Simulate OAuth redirect
    setTimeout(() => {
        showNotification('GitHub OAuth is currently experiencing issues. Please use manual connection.', 'warning');
    }, 1500);
}

/**
 * Test GitHub credentials
 */
async function testGitHubCredentials(username, repo, token) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('GitHub API error:', error);
        return false;
    }
}

/**
 * Update GitHub connection status
 */
function updateGitHubStatus(status) {
    const statusElement = document.querySelector('#githubConnectBtn').parentElement.querySelector('span');
    const connectBtn = document.getElementById('githubConnectBtn');
    
    if (status === 'connected') {
        statusElement.className = 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs';
        statusElement.textContent = 'Connected';
        connectBtn.innerHTML = '<i class="fas fa-unlink"></i>';
        connectBtn.onclick = () => disconnectGitHub();
    } else {
        statusElement.className = 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs';
        statusElement.textContent = 'Disconnected';
        connectBtn.innerHTML = '<i class="fas fa-link"></i>';
        connectBtn.onclick = () => handleGitHubOAuth();
    }
}

/**
 * Disconnect GitHub
 */
function disconnectGitHub() {
    if (confirm('Are you sure you want to disconnect GitHub?')) {
        updateGitHubStatus('disconnected');
        showNotification('GitHub disconnected successfully', 'success');
        
        // Clear form fields
        document.getElementById('githubUsername').value = '';
        document.getElementById('githubRepo').value = '';
        document.getElementById('githubToken').value = '';
    }
}

/**
 * Test GitHub connection
 */
function testGitHubConnection() {
    const username = document.getElementById('githubUsername')?.value;
    const repo = document.getElementById('githubRepo')?.value;
    const token = document.getElementById('githubToken')?.value;

    if (!username || !repo || !token) {
        showNotification('Please fill in all GitHub credentials first', 'warning');
        return;
    }

    showNotification('Testing connection...', 'info');
    
    testGitHubCredentials(username, repo, token)
        .then(success => {
            if (success) {
                showNotification('Connection test successful!', 'success');
            } else {
                showNotification('Connection test failed. Check your credentials.', 'error');
            }
        })
        .catch(error => {
            showNotification('Connection test failed. Please try again.', 'error');
        });
}

/**
 * Clear GitHub cache
 */
function clearGitHubCache() {
    // Clear local storage
    localStorage.removeItem('github_connection');
    localStorage.removeItem('github_token');
    
    // Clear form fields
    document.getElementById('githubUsername').value = '';
    document.getElementById('githubRepo').value = '';
    document.getElementById('githubToken').value = '';
    
    showNotification('GitHub cache cleared successfully', 'success');
}

/**
 * Show GitHub help
 */
function showGitHubHelp() {
    const helpContent = `
        <div class="space-y-4">
            <h3 class="text-lg font-semibold">GitHub Integration Help</h3>
            
            <div>
                <h4 class="font-medium mb-2">Creating a Personal Access Token:</h4>
                <ol class="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to GitHub Settings > Developer settings > Personal access tokens</li>
                    <li>Click "Generate new token"</li>
                    <li>Select the following scopes: repo, workflow</li>
                    <li>Copy the generated token</li>
                </ol>
            </div>
            
            <div>
                <h4 class="font-medium mb-2">Common Issues:</h4>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>Make sure your repository exists and is accessible</li>
                    <li>Check that your token has the correct permissions</li>
                    <li>Ensure your GitHub username is correct</li>
                    <li>Try refreshing the page if connection fails</li>
                </ul>
            </div>
            
            <div>
                <h4 class="font-medium mb-2">Need More Help?</h4>
                <p class="text-sm">Contact our support team at support@rutgers.edu</p>
            </div>
        </div>
    `;
    
    showModal(helpContent);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Make functions globally available
window.testGitHubConnection = testGitHubConnection;
window.clearGitHubCache = clearGitHubCache;
window.showGitHubHelp = showGitHubHelp; 