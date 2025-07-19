/**
 * UI Components System
 * Standardized components for consistent design across all pages
 */

export interface ButtonProps {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    icon?: string;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
    title?: string;
    subtitle?: string;
    content: string | HTMLElement;
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'gray';
    icon?: string;
    actions?: ButtonProps[];
    className?: string;
    animate?: boolean;
}

export interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
        period: string;
    };
    icon?: string;
    color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'gray';
    className?: string;
}

export interface ModalProps {
    title: string;
    content: string | HTMLElement;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    actions?: ButtonProps[];
    onClose?: () => void;
    className?: string;
}

export interface NotificationProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Button Component
 */
export class Button {
    static create(props: ButtonProps): HTMLButtonElement {
        const button = document.createElement('button');
        
        // Base classes
        const baseClasses = [
            'btn',
            'transition-all',
            'duration-300',
            'ease-in-out',
            'font-medium',
            'rounded-lg',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            'hover:transform',
            'hover:-translate-y-1',
            'active:transform',
            'active:translate-y-0'
        ];

        // Size classes
        const sizeClasses = {
            xs: 'px-2 py-1 text-xs',
            sm: 'px-3 py-2 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            xl: 'px-8 py-4 text-lg'
        };

        // Variant classes
        const variantClasses = {
            primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
            outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500',
            ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg'
        };

        // Apply classes
        button.className = [
            ...baseClasses,
            sizeClasses[props.size || 'md'],
            variantClasses[props.variant || 'primary'],
            props.className || ''
        ].join(' ');

        // Set attributes
        button.textContent = props.text;
        button.type = props.type || 'button';
        button.disabled = props.disabled || false;

        // Add icon if provided
        if (props.icon) {
            const icon = document.createElement('span');
            icon.className = `inline-flex items-center ${props.iconPosition === 'right' ? 'ml-2' : 'mr-2'}`;
            icon.innerHTML = props.icon;
            
            if (props.iconPosition === 'right') {
                button.appendChild(icon);
            } else {
                button.insertBefore(icon, button.firstChild);
            }
        }

        // Add loading state
        if (props.loading) {
            button.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
            `;
            button.disabled = true;
        }

        // Add click handler
        if (props.onClick) {
            button.addEventListener('click', props.onClick);
        }

        return button;
    }
}

/**
 * Card Component
 */
export class Card {
    static create(props: CardProps): HTMLDivElement {
        const card = document.createElement('div');
        
        // Base classes
        const baseClasses = [
            'bg-white',
            'rounded-xl',
            'shadow-soft',
            'transition-all',
            'duration-300',
            'ease-in-out',
            'hover:shadow-glow',
            'hover:-translate-y-2',
            'hover:scale-105',
            'border',
            'border-gray-100'
        ];

        // Variant classes
        const variantClasses = {
            default: '',
            elevated: 'shadow-lg hover:shadow-xl',
            outlined: 'border-2 border-gray-200',
            gradient: 'bg-gradient-to-br from-red-50 to-red-100'
        };

        // Color classes
        const colorClasses = {
            red: 'border-red-200 hover:border-red-300',
            blue: 'border-blue-200 hover:border-blue-300',
            green: 'border-green-200 hover:border-green-300',
            purple: 'border-purple-200 hover:border-purple-300',
            yellow: 'border-yellow-200 hover:border-yellow-300',
            gray: 'border-gray-200 hover:border-gray-300'
        };

        // Apply classes
        card.className = [
            ...baseClasses,
            variantClasses[props.variant || 'default'],
            colorClasses[props.color || 'gray'],
            props.className || ''
        ].join(' ');

        // Add animation classes
        if (props.animate) {
            card.classList.add('animate-fade-in', 'animate-on-scroll');
        }

        // Build card content
        let cardHTML = '<div class="p-6">';

        // Add header if title or icon provided
        if (props.title || props.icon) {
            cardHTML += '<div class="flex items-center justify-between mb-4">';
            if (props.icon) {
                cardHTML += `<div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    ${props.icon}
                </div>`;
            }
            if (props.title) {
                cardHTML += `<h3 class="text-lg font-semibold text-gray-900">${props.title}</h3>`;
            }
            cardHTML += '</div>';
        }

        // Add subtitle
        if (props.subtitle) {
            cardHTML += `<p class="text-sm text-gray-500 mb-4">${props.subtitle}</p>`;
        }

        // Add content
        if (typeof props.content === 'string') {
            cardHTML += `<div class="text-gray-700">${props.content}</div>`;
        } else {
            cardHTML += '<div class="text-gray-700"></div>';
            card.querySelector('.text-gray-700')?.appendChild(props.content);
        }

        // Add actions
        if (props.actions && props.actions.length > 0) {
            cardHTML += '<div class="flex gap-2 mt-4">';
            props.actions.forEach(action => {
                const actionButton = Button.create(action);
                cardHTML += actionButton.outerHTML;
            });
            cardHTML += '</div>';
        }

        cardHTML += '</div>';
        card.innerHTML = cardHTML;

        return card;
    }
}

/**
 * Stat Card Component
 */
export class StatCard {
    static create(props: StatCardProps): HTMLDivElement {
        const card = document.createElement('div');
        
        // Color configurations
        const colorConfigs = {
            red: {
                bg: 'bg-red-50',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                changeColor: 'text-red-600'
            },
            blue: {
                bg: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                changeColor: 'text-blue-600'
            },
            green: {
                bg: 'bg-green-50',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                changeColor: 'text-green-600'
            },
            purple: {
                bg: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                changeColor: 'text-purple-600'
            },
            yellow: {
                bg: 'bg-yellow-50',
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600',
                changeColor: 'text-yellow-600'
            },
            gray: {
                bg: 'bg-gray-50',
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600',
                changeColor: 'text-gray-600'
            }
        };

        const colors = colorConfigs[props.color || 'red'];

        card.className = [
            'bg-white',
            'rounded-xl',
            'shadow-soft',
            'p-6',
            'animate-fade-in',
            'animate-on-scroll',
            'transition-all',
            'duration-500',
            'hover:shadow-glow',
            'hover:-translate-y-2',
            'hover:scale-105',
            props.className || ''
        ].join(' ');

        let cardHTML = '<div class="flex justify-between items-start">';
        
        // Left side - content
        cardHTML += '<div>';
        cardHTML += `<p class="text-sm text-gray-500">${props.title}</p>`;
        cardHTML += `<h3 class="text-2xl font-bold mt-1">${props.value}</h3>`;
        
        if (props.change) {
            const changeIcon = props.change.isPositive ? 
                '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-trending-up mr-1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-trending-down mr-1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,17 13.5,8.5 8.5,13.5 2,7"/><polyline points="16,17 22,17 22,11"/></svg>';
            
            cardHTML += `<p class="text-sm ${colors.changeColor} mt-1 flex items-center">
                ${changeIcon} ${Math.abs(props.change.value)}% from ${props.change.period}
            </p>`;
        }
        
        cardHTML += '</div>';
        
        // Right side - icon
        if (props.icon) {
            cardHTML += `<div class="${colors.iconBg} p-3 rounded-lg transition-transform duration-300 hover:scale-110">
                <span class="${colors.iconColor} text-xl">${props.icon}</span>
            </div>`;
        }
        
        cardHTML += '</div>';
        card.innerHTML = cardHTML;

        return card;
    }
}

/**
 * Modal Component
 */
export class Modal {
    static create(props: ModalProps): HTMLDivElement {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
        
        // Size classes
        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-2xl'
        };

        const modalContent = document.createElement('div');
        modalContent.className = [
            'bg-white',
            'rounded-xl',
            'shadow-2xl',
            'p-6',
            'w-full',
            'mx-4',
            'animate-scale-in',
            sizeClasses[props.size || 'md'],
            props.className || ''
        ].join(' ');

        // Build modal content
        let contentHTML = '<div class="flex justify-between items-center mb-4">';
        contentHTML += `<h3 class="text-xl font-bold text-gray-800">${props.title}</h3>`;
        contentHTML += '<button class="text-gray-400 hover:text-gray-600 transition-colors duration-200" onclick="this.closest(\'.fixed\').remove()">';
        contentHTML += '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">';
        contentHTML += '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        contentHTML += '</svg>';
        contentHTML += '</button>';
        contentHTML += '</div>';

        // Add content
        if (typeof props.content === 'string') {
            contentHTML += `<div class="mb-6">${props.content}</div>`;
        } else {
            contentHTML += '<div class="mb-6"></div>';
            modalContent.querySelector('.mb-6')?.appendChild(props.content);
        }

        // Add actions
        if (props.actions && props.actions.length > 0) {
            contentHTML += '<div class="flex gap-2 justify-end">';
            props.actions.forEach(action => {
                const actionButton = Button.create(action);
                contentHTML += actionButton.outerHTML;
            });
            contentHTML += '</div>';
        }

        modalContent.innerHTML = contentHTML;
        modal.appendChild(modalContent);

        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (props.onClose) props.onClose();
            }
        });

        return modal;
    }
}

/**
 * Notification Component
 */
export class Notification {
    static show(props: NotificationProps): void {
        const notification = document.createElement('div');
        
        // Type configurations
        const typeConfigs = {
            success: {
                bg: 'bg-green-500',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            },
            error: {
                bg: 'bg-red-500',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
            },
            warning: {
                bg: 'bg-yellow-500',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>'
            },
            info: {
                bg: 'bg-blue-500',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            }
        };

        const type = typeConfigs[props.type || 'info'];
        const position = props.position || 'top-right';

        // Position classes
        const positionClasses = {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
            'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
        };

        notification.className = [
            'fixed',
            'z-50',
            'flex',
            'items-center',
            'p-4',
            'rounded-lg',
            'shadow-lg',
            'text-white',
            'animate-slide-in',
            'transition-all',
            'duration-300',
            type.bg,
            positionClasses[position]
        ].join(' ');

        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-3">${type.icon}</span>
                <span>${props.message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after duration
        const duration = props.duration || 5000;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

/**
 * Utility functions for common UI patterns
 */
export class UIUtils {
    /**
     * Create a loading spinner
     */
    static createSpinner(size: 'sm' | 'md' | 'lg' = 'md'): HTMLElement {
        const spinner = document.createElement('div');
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-6 h-6',
            lg: 'w-8 h-8'
        };
        
        spinner.className = `animate-spin ${sizeClasses[size]} text-red-600`;
        spinner.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        
        return spinner;
    }

    /**
     * Create an empty state component
     */
    static createEmptyState(
        title: string,
        description: string,
        icon?: string,
        action?: ButtonProps
    ): HTMLElement {
        const container = document.createElement('div');
        container.className = 'text-center py-12';
        
        let html = '';
        if (icon) {
            html += `<div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span class="text-gray-400 text-2xl">${icon}</span>
            </div>`;
        }
        
        html += `<h3 class="text-lg font-medium text-gray-900 mb-2">${title}</h3>`;
        html += `<p class="text-gray-500 mb-6">${description}</p>`;
        
        if (action) {
            const actionButton = Button.create(action);
            html += actionButton.outerHTML;
        }
        
        container.innerHTML = html;
        return container;
    }

    /**
     * Create a badge component
     */
    static createBadge(
        text: string,
        variant: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default'
    ): HTMLElement {
        const badge = document.createElement('span');
        
        const variantClasses = {
            default: 'bg-gray-100 text-gray-800',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            error: 'bg-red-100 text-red-800',
            info: 'bg-blue-100 text-blue-800'
        };
        
        badge.className = [
            'inline-flex',
            'items-center',
            'px-2.5',
            'py-0.5',
            'rounded-full',
            'text-xs',
            'font-medium',
            variantClasses[variant]
        ].join(' ');
        
        badge.textContent = text;
        return badge;
    }
}

// Export all components for easy access
export default {
    Button,
    Card,
    StatCard,
    Modal,
    Notification,
    UIUtils
}; 