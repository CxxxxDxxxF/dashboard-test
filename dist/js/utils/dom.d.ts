/**
 * DOM utility functions for safe element manipulation
 */
/**
 * Safely get an element by ID with type checking
 */
export declare function getElementById<T extends HTMLElement = HTMLElement>(id: string, type?: new () => T): T | null;
/**
 * Safely get an element by selector with type checking
 */
export declare function querySelector<T extends HTMLElement = HTMLElement>(selector: string, parent?: Document | Element, type?: new () => T): T | null;
/**
 * Safely get multiple elements by selector
 */
export declare function querySelectorAll<T extends HTMLElement = HTMLElement>(selector: string, parent?: Document | Element, type?: new () => T): T[];
/**
 * Create a new element with type safety
 */
export declare function createElement<T extends HTMLElement = HTMLElement>(tagName: string, type?: new () => T): T;
/**
 * Safely add event listener with type checking
 */
export declare function addEventListener<T extends Event>(element: EventTarget, type: string, listener: (event: T) => void, options?: boolean | AddEventListenerOptions): void;
/**
 * Safely remove event listener
 */
export declare function removeEventListener<T extends Event>(element: EventTarget, type: string, listener: (event: T) => void, options?: boolean | EventListenerOptions): void;
/**
 * Check if element exists and is visible
 */
export declare function isElementVisible(element: HTMLElement | null): boolean;
/**
 * Safely set innerHTML with validation
 */
export declare function setInnerHTML(element: HTMLElement, html: string): void;
/**
 * Safely set text content
 */
export declare function setTextContent(element: HTMLElement | null, text: string): void;
/**
 * Safely set attribute
 */
export declare function setAttribute(element: HTMLElement | null, name: string, value: string): void;
/**
 * Safely get attribute
 */
export declare function getAttribute(element: HTMLElement | null, name: string): string | null;
/**
 * Safely remove attribute
 */
export declare function removeAttribute(element: HTMLElement | null, name: string): void;
/**
 * Safely add CSS class
 */
export declare function addClass(element: HTMLElement | null, className: string): void;
/**
 * Safely remove CSS class
 */
export declare function removeClass(element: HTMLElement | null, className: string): void;
/**
 * Safely toggle CSS class
 */
export declare function toggleClass(element: HTMLElement | null, className: string): void;
/**
 * Check if element has CSS class
 */
export declare function hasClass(element: HTMLElement | null, className: string): boolean;
/**
 * Safely set CSS style
 */
export declare function setStyle(element: HTMLElement | null, property: string, value: string): void;
/**
 * Safely get CSS style
 */
export declare function getStyle(element: HTMLElement | null, property: string): string;
/**
 * Wait for element to be available in DOM
 */
export declare function waitForElement<T extends HTMLElement = HTMLElement>(selector: string, timeout?: number, type?: new () => T): Promise<T>;
/**
 * Debounce function for performance optimization
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function for performance optimization
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=dom.d.ts.map