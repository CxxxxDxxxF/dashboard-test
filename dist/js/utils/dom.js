/**
 * DOM utility functions for safe element manipulation
 */
/**
 * Safely get an element by ID with type checking
 */
export function getElementById(id, type) {
    const element = document.getElementById(id);
    if (!element)
        return null;
    if (type && !(element instanceof type)) {
        console.warn(`Element with id '${id}' is not of expected type ${type.name}`);
        return null;
    }
    return element;
}
/**
 * Safely get an element by selector with type checking
 */
export function querySelector(selector, parent = document, type) {
    const element = parent.querySelector(selector);
    if (!element)
        return null;
    if (type && !(element instanceof type)) {
        console.warn(`Element with selector '${selector}' is not of expected type ${type.name}`);
        return null;
    }
    return element;
}
/**
 * Safely get multiple elements by selector
 */
export function querySelectorAll(selector, parent = document, type) {
    const elements = parent.querySelectorAll(selector);
    const result = [];
    elements.forEach(element => {
        if (type && !(element instanceof type)) {
            console.warn(`Element with selector '${selector}' is not of expected type ${type.name}`);
            return;
        }
        result.push(element);
    });
    return result;
}
/**
 * Create a new element with type safety
 */
export function createElement(tagName, type) {
    const element = document.createElement(tagName);
    return element;
}
/**
 * Safely add event listener with type checking
 */
export function addEventListener(element, type, listener, options) {
    element.addEventListener(type, listener, options);
}
/**
 * Safely remove event listener
 */
export function removeEventListener(element, type, listener, options) {
    element.removeEventListener(type, listener, options);
}
/**
 * Check if element exists and is visible
 */
export function isElementVisible(element) {
    if (!element)
        return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetParent !== null;
}
/**
 * Safely set innerHTML with validation
 */
export function setInnerHTML(element, html) {
    if (!element)
        return;
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
export function setTextContent(element, text) {
    if (!element)
        return;
    element.textContent = text;
}
/**
 * Safely set attribute
 */
export function setAttribute(element, name, value) {
    if (!element)
        return;
    element.setAttribute(name, value);
}
/**
 * Safely get attribute
 */
export function getAttribute(element, name) {
    if (!element)
        return null;
    return element.getAttribute(name);
}
/**
 * Safely remove attribute
 */
export function removeAttribute(element, name) {
    if (!element)
        return;
    element.removeAttribute(name);
}
/**
 * Safely add CSS class
 */
export function addClass(element, className) {
    if (!element)
        return;
    element.classList.add(className);
}
/**
 * Safely remove CSS class
 */
export function removeClass(element, className) {
    if (!element)
        return;
    element.classList.remove(className);
}
/**
 * Safely toggle CSS class
 */
export function toggleClass(element, className) {
    if (!element)
        return;
    element.classList.toggle(className);
}
/**
 * Check if element has CSS class
 */
export function hasClass(element, className) {
    if (!element)
        return false;
    return element.classList.contains(className);
}
/**
 * Safely set CSS style
 */
export function setStyle(element, property, value) {
    if (!element)
        return;
    element.style.setProperty(property, value);
}
/**
 * Safely get CSS style
 */
export function getStyle(element, property) {
    if (!element)
        return '';
    return window.getComputedStyle(element).getPropertyValue(property);
}
/**
 * Wait for element to be available in DOM
 */
export function waitForElement(selector, timeout = 5000, type) {
    return new Promise((resolve, reject) => {
        const element = querySelector(selector, document, type);
        if (element) {
            resolve(element);
            return;
        }
        const observer = new MutationObserver(() => {
            const element = querySelector(selector, document, type);
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
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttle function for performance optimization
 */
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
//# sourceMappingURL=dom.js.map