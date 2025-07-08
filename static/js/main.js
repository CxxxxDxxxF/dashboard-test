/**
 * Rutgers University Social Media Dashboard
 * Main JavaScript file - CSP compliant
 */

document.addEventListener('DOMContentLoaded', function() {
    // Error handling for Chart.js
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js failed to load. Chart functionality will be disabled.');
        const chartElement = document.getElementById('engagementChart');
        if (chartElement) {
            chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Chart loading failed</div>';
        }
    }

    // Initialize dashboard components
    initializeSidebar();
    initializeThemeToggle();
    initializeCharts();
    initializeDropdowns();
    initializeModals();
    initializeResponsiveHandling();
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
                collapseBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            } else {
                collapseBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
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
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.body.classList.remove('bg-gray-900');
                document.body.classList.add('bg-gray-50');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
}

/**
 * Chart initialization and management
 */
function initializeCharts() {
    // Engagement Chart Sample Data
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
                        datasets: [{
                            label: 'Engagement',
                            data: engagementData[7].data,
                            borderColor: '#CC0033',
                            backgroundColor: 'rgba(204,0,51,0.1)',
                            tension: 0.4,
                            pointBackgroundColor: '#CC0033',
                            pointBorderColor: '#fff',
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
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
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Failed to initialize chart:', error);
            const chartElement = document.getElementById('engagementChart');
            if (chartElement) {
                chartElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Chart initialization failed</div>';
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
                engagementChart.data.datasets[0].data = engagementData[range].data;
                engagementChart.update();
            }
        });
    }
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
                alert('Delete post coming soon!');
                menu.classList.add('hidden');
            });
        }
    });
}

/**
 * Modal functionality
 */
function initializeModals() {
    const postModal = document.getElementById('postModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');
    
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
        const post = postDetails[idx];
        if (modalContent) {
            modalContent.innerHTML = `
                <h2 class="text-xl font-bold mb-2">${post.title}</h2>
                <p class="text-gray-500 mb-2">${post.date} • ${post.platform}</p>
                <p class="mb-2">${post.stats}</p>
                <p>${post.content}</p>
            `;
        }
        if (postModal) {
            postModal.classList.remove('hidden');
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (postModal) {
                postModal.classList.add('hidden');
            }
        });
    }

    if (postModal) {
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                postModal.classList.add('hidden');
            }
        });
    }

    // Make showModal available globally for dropdown usage
    window.showModal = showModal;
}

/**
 * Responsive handling
 */
function initializeResponsiveHandling() {
    function handleResize() {
        if (window.innerWidth < 768) {
            const sidebar = document.getElementById('sidebar');
            const contentArea = document.getElementById('contentArea');
            const collapseBtn = document.getElementById('collapseBtn');
            
            if (sidebar) sidebar.classList.remove('collapsed');
            if (contentArea) contentArea.classList.remove('expanded');
            if (collapseBtn) {
                collapseBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Run on initial load
}

/**
 * Utility function to safely get elements
 */
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

/**
 * Error handling utility
 */
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    // Could add user-facing error notifications here
} 