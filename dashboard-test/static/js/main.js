/**
 * Rutgers University Social Media Dashboard
 * Main JavaScript file - Optimized and CSP compliant
 */

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility functions
const utils = {
    safeGetElement: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
        }
        return element;
    },
    
    handleError: (error, context) => {
        console.error(`Error in ${context}:`, error);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = `An error occurred: ${error.message}`;
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    },
    
    showLoading: (element) => {
        if (element) {
            element.classList.add('loading');
        }
    },
    
    hideLoading: (element) => {
        if (element) {
            element.classList.remove('loading');
        }
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all components
        initializeSidebar();
        initializeThemeToggle();
        initializeCharts();
        initializeDropdowns();
        initializeModals();
        initializeResponsiveHandling();
        
        // Add loading animation to page
        document.body.classList.add('animate-fade-in');
        
    } catch (error) {
        utils.handleError(error, 'main initialization');
    }
});

/**
 * Enhanced Sidebar functionality with smooth animations
 */
function initializeSidebar() {
    const sidebar = utils.safeGetElement('sidebar');
    const contentArea = utils.safeGetElement('contentArea');
    const collapseBtn = utils.safeGetElement('collapseBtn');
    const mobileMenuBtn = utils.safeGetElement('mobileMenuBtn');
    
    if (!sidebar || !contentArea) return;
    
    let isCollapsed = false;
    
    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            try {
                isCollapsed = !isCollapsed;
                sidebar.classList.toggle('collapsed');
                contentArea.classList.toggle('expanded');
                
                // Update icon with smooth transition
                const icon = isCollapsed ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-right" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' :
                    '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-left" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
                
                collapseBtn.innerHTML = icon;
                
                // Save state to localStorage
                localStorage.setItem('sidebarCollapsed', isCollapsed);
                
            } catch (error) {
                utils.handleError(error, 'sidebar toggle');
            }
        });
        
        // Restore sidebar state from localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            isCollapsed = true;
            sidebar.classList.add('collapsed');
            contentArea.classList.add('expanded');
            collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-right" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            try {
                sidebar.classList.toggle('open');
                
                // Add pulse animation to mobile menu button
                mobileMenuBtn.classList.add('pulse');
                setTimeout(() => {
                    mobileMenuBtn.classList.remove('pulse');
                }, 200);
                
            } catch (error) {
                utils.handleError(error, 'mobile menu toggle');
            }
        });
    }
    
    // Close mobile menu when clicking outside (with improved performance)
    const handleOutsideClick = debounce((e) => {
        if (sidebar && !sidebar.contains(e.target) && e.target !== mobileMenuBtn) {
            sidebar.classList.remove('open');
        }
    }, 100);
    
    document.addEventListener('click', handleOutsideClick);
}

/**
 * Enhanced Theme toggle functionality with localStorage
 */
function initializeThemeToggle() {
    const themeToggle = utils.safeGetElement('themeToggle');
    if (!themeToggle) return;
    
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply initial theme
    applyTheme(isDarkMode);
    
    themeToggle.addEventListener('click', () => {
        try {
            isDarkMode = !isDarkMode;
            applyTheme(isDarkMode);
            localStorage.setItem('darkMode', isDarkMode);
            
        } catch (error) {
            utils.handleError(error, 'theme toggle');
        }
    });
}

function applyTheme(isDark) {
    const body = document.body;
    const themeToggle = utils.safeGetElement('themeToggle');
    
    if (isDark) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
    }
}

/**
 * Optimized Chart initialization with better error handling
 */
function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js failed to load. Chart functionality will be disabled.');
        const chartElement = utils.safeGetElement('engagementChart');
        if (chartElement) {
            chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500"><div class="loading-spinner"></div><p class="ml-2">Chart loading failed</p></div>';
        }
        return;
    }

    // Sample data (in a real app, this would come from an API)
    const engagementData = {
        7: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [120, 150, 180, 170, 200, 220, 210]
        },
        14: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [110, 130, 140, 160, 170, 180, 175, 160, 150, 170, 190, 210, 220, 210]
        },
        30: {
            labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
            data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 120, 130]
        }
    };

    let engagementChart = null;
    const ctx = utils.safeGetElement('engagementChart');
    
    if (ctx) {
        try {
            utils.showLoading(ctx);
            
            const chartContext = ctx.getContext('2d');
            engagementChart = new Chart(chartContext, {
                type: 'line',
                data: {
                    labels: engagementData[7].labels,
                    datasets: [{
                        label: 'Engagement',
                        data: engagementData[7].data,
                        borderColor: '#CC0033',
                        backgroundColor: 'rgba(204,0,51,0.1)',
                        tension: 0.4,
                        pointBackgroundColor: '#CC0033',
                        pointBorderColor: '#fff',
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Engagement Overview',
                            font: { size: 20, weight: 'bold' },
                            align: 'start',
                            color: '#111'
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                minRotation: 0,
                                maxRotation: 0,
                                callback: function(value, index, ticks) {
                                    // Show every 5th label and always the last label for 30-day range
                                    if (ticks.length === 30) {
                                        if (index % 5 === 0 || index === ticks.length - 1) {
                                            return this.getLabelForValue(value);
                                        }
                                        return '';
                                    }
                                    return this.getLabelForValue(value);
                                }
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
            
            utils.hideLoading(ctx);
            
        } catch (error) {
            utils.handleError(error, 'chart initialization');
            utils.hideLoading(ctx);
            if (ctx) {
                ctx.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Chart initialization failed</div>';
            }
        }
    }

    // Chart range selector with debouncing
    const rangeSelector = utils.safeGetElement('engagementRange');
    if (rangeSelector && engagementChart) {
        const updateChart = debounce(function() {
            if (engagementChart) {
                const range = this.value;
                engagementChart.data.labels = engagementData[range].labels;
                engagementChart.data.datasets[0].data = engagementData[range].data;
                engagementChart.update('active');
            }
        }, 300);
        
        rangeSelector.addEventListener('change', updateChart);
    }
}

/**
 * Optimized Dropdown functionality
 */
function initializeDropdowns() {
    const moreBtns = document.querySelectorAll('.more-btn');
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    
    if (moreBtns.length === 0) return;
    
    let openDropdown = null;

    moreBtns.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            try {
                e.stopPropagation();
                
                // Close any open dropdown
                if (openDropdown && openDropdown !== dropdowns[idx]) {
                    openDropdown.classList.add('hidden');
                }
                
                dropdowns[idx].classList.toggle('hidden');
                openDropdown = dropdowns[idx].classList.contains('hidden') ? null : dropdowns[idx];
                
            } catch (error) {
                utils.handleError(error, 'dropdown toggle');
            }
        });
    });

    // Close dropdowns when clicking outside
    const closeDropdowns = debounce(() => {
        dropdowns.forEach(menu => menu.classList.add('hidden'));
        openDropdown = null;
    }, 100);
    
    document.addEventListener('click', closeDropdowns);

    // Add action handlers
    dropdowns.forEach((menu, idx) => {
        const actions = {
            'view-btn': () => showModal(idx),
            'edit-btn': () => alert('Edit post coming soon!'),
            'delete-btn': () => {
                if (confirm('Are you sure you want to delete this post?')) {
                    alert('Delete post coming soon!');
                }
            }
        };

        Object.entries(actions).forEach(([className, action]) => {
            const btn = menu.querySelector(`.${className}`);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    try {
                        e.stopPropagation();
                        action();
                        menu.classList.add('hidden');
                    } catch (error) {
                        utils.handleError(error, `dropdown action: ${className}`);
                    }
                });
            }
        });
    });
}

/**
 * Enhanced Modal functionality
 */
function initializeModals() {
    const postModal = utils.safeGetElement('postModal');
    const closeModalBtn = utils.safeGetElement('closeModal');
    const modalContent = utils.safeGetElement('modalContent');
    
    if (!postModal || !modalContent) return;
    
    const postDetails = [
        {
            title: 'Spring Tournament Highlights',
            date: 'Posted 2 days ago',
            platform: 'Instagram',
            stats: '248 likes, 42 comments',
            content: 'Highlights from our spring tournament!'
        },
        {
            title: 'Weekend Golf Special',
            date: 'Posted 4 days ago',
            platform: 'Facebook',
            stats: '187 likes, 23 shares',
            content: 'Don\'t miss our weekend golf special!'
        },
        {
            title: 'Golf Tip: Perfect Your Putt',
            date: 'Posted 1 week ago',
            platform: 'Instagram',
            stats: '312 likes, 28 comments',
            content: 'Learn how to perfect your putt with these tips.'
        }
    ];

    function showModal(idx) {
        try {
            const post = postDetails[idx];
            if (!post) {
                throw new Error('Post not found');
            }
            
            modalContent.innerHTML = `
                <h2 class="text-xl font-bold mb-2">${post.title}</h2>
                <p class="text-gray-500 mb-2">${post.date} • ${post.platform}</p>
                <p class="mb-2">${post.stats}</p>
                <p>${post.content}</p>
            `;
            
            postModal.classList.remove('hidden');
            postModal.classList.add('animate-fade-in');
            
        } catch (error) {
            utils.handleError(error, 'modal display');
        }
    }

    function closeModal() {
        postModal.classList.add('hidden');
        postModal.classList.remove('animate-fade-in');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !postModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Make showModal available globally
    window.showModal = showModal;
}

/**
 * Optimized Responsive handling with debouncing
 */
function initializeResponsiveHandling() {
    const handleResize = debounce(() => {
        try {
            if (window.innerWidth < 768) {
                const sidebar = utils.safeGetElement('sidebar');
                const contentArea = utils.safeGetElement('contentArea');
                const collapseBtn = utils.safeGetElement('collapseBtn');
                
                if (sidebar) sidebar.classList.remove('collapsed');
                if (contentArea) contentArea.classList.remove('expanded');
                if (collapseBtn) {
                    collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-chevron-left" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
                }
            }
        } catch (error) {
            utils.handleError(error, 'responsive handling');
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Run on initial load
}

// Export utilities for potential external use
window.dashboardUtils = utils; 