/**
 * DOM utility functions for safe element manipulation
 */

/**
 * Safely get an element by ID with type checking
 */
export function getElementById<T extends HTMLElement = HTMLElement>(
    id: string,
    type?: new () => T
): T | null {
    const element = document.getElementById(id);
    if (!element) return null;
    
    if (type && !(element instanceof type)) {
        console.warn(`Element with id '${id}' is not of expected type ${type.name}`);
        return null;
    }
    
    return element as T;
}

/**
 * Safely get an element by selector with type checking
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
    selector: string,
    parent: Document | Element = document,
    type?: new () => T
): T | null {
    const element = parent.querySelector(selector);
    if (!element) return null;
    
    if (type && !(element instanceof type)) {
        console.warn(`Element with selector '${selector}' is not of expected type ${type.name}`);
        return null;
    }
    
    return element as T;
}

/**
 * Safely get multiple elements by selector
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
    selector: string,
    parent: Document | Element = document,
    type?: new () => T
): T[] {
    const elements = parent.querySelectorAll(selector);
    const result: T[] = [];
    
    elements.forEach(element => {
        if (type && !(element instanceof type)) {
            console.warn(`Element with selector '${selector}' is not of expected type ${type.name}`);
            return;
        }
        result.push(element as T);
    });
    
    return result;
}

/**
 * Create a new element with type safety
 */
export function createElement<T extends HTMLElement = HTMLElement>(
    tagName: string,
    type?: new () => T
): T {
    const element = document.createElement(tagName);
    return element as T;
}

/**
 * Safely add event listener with type checking
 */
export function addEventListener<T extends Event>(
    element: EventTarget,
    type: string,
    listener: (event: T) => void,
    options?: boolean | AddEventListenerOptions
): void {
    element.addEventListener(type, listener as EventListener, options);
}

/**
 * Safely remove event listener
 */
export function removeEventListener<T extends Event>(
    element: EventTarget,
    type: string,
    listener: (event: T) => void,
    options?: boolean | EventListenerOptions
): void {
    element.removeEventListener(type, listener as EventListener, options);
}

/**
 * Check if element exists and is visible
 */
export function isElementVisible(element: HTMLElement | null): boolean {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           element.offsetParent !== null;
}

/**
 * Safely set innerHTML with validation
 */
export function setInnerHTML(element: HTMLElement, html: string): void {
    if (!element) return;
    
    // Basic XSS protection - you might want to use a proper sanitizer
    if (html.includes('<script>') || html.includes('javascript:')) {
        console.warn('Potentially unsafe HTML content detected');
        return;
    }
    
    element.innerHTML = html;
}

/**
 * Safely set text content
 */
export function setTextContent(element: HTMLElement | null, text: string): void {
    if (!element) return;
    element.textContent = text;
}

/**
 * Safely set attribute
 */
export function setAttribute(
    element: HTMLElement | null, 
    name: string, 
    value: string
): void {
    if (!element) return;
    element.setAttribute(name, value);
}

/**
 * Safely get attribute
 */
export function getAttribute(
    element: HTMLElement | null, 
    name: string
): string | null {
    if (!element) return null;
    return element.getAttribute(name);
}

/**
 * Safely remove attribute
 */
export function removeAttribute(
    element: HTMLElement | null, 
    name: string
): void {
    if (!element) return;
    element.removeAttribute(name);
}

/**
 * Safely add CSS class
 */
export function addClass(element: HTMLElement | null, className: string): void {
    if (!element) return;
    element.classList.add(className);
}

/**
 * Safely remove CSS class
 */
export function removeClass(element: HTMLElement | null, className: string): void {
    if (!element) return;
    element.classList.remove(className);
}

/**
 * Safely toggle CSS class
 */
export function toggleClass(element: HTMLElement | null, className: string): void {
    if (!element) return;
    element.classList.toggle(className);
}

/**
 * Check if element has CSS class
 */
export function hasClass(element: HTMLElement | null, className: string): boolean {
    if (!element) return false;
    return element.classList.contains(className);
}

/**
 * Safely set CSS style
 */
export function setStyle(
    element: HTMLElement | null, 
    property: string, 
    value: string
): void {
    if (!element) return;
    element.style.setProperty(property, value);
}

/**
 * Safely get CSS style
 */
export function getStyle(
    element: HTMLElement | null, 
    property: string
): string {
    if (!element) return '';
    return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Wait for element to be available in DOM
 */
export function waitForElement<T extends HTMLElement = HTMLElement>(
    selector: string,
    timeout: number = 5000,
    type?: new () => T
): Promise<T> {
    return new Promise((resolve, reject) => {
        const element = querySelector<T>(selector, document, type);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver(() => {
            const element = querySelector<T>(selector, document, type);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element with selector '${selector}' not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
} 