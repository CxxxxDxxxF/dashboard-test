/**
 * AnimationService: Provides scroll-triggered and utility-based animations for the dashboard.
 * Usage: Import and call AnimationService.getInstance().initScrollAnimations() or use utility methods.
 */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export interface AnimationOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    distance?: number;
    direction?: AnimationDirection;
}
export interface ScrollAnimationOptions {
    selector?: string;
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
    animation?: AnimationOptions;
}
export declare class AnimationService {
    private static instance;
    private observers;
    private constructor();
    static getInstance(): AnimationService;
    /**
     * Initialize scroll-triggered animations for elements matching selector.
     */
    initScrollAnimations({ selector, threshold, rootMargin, once, animation, }?: ScrollAnimationOptions): void;
    /**
     * Prepare element for animation (set initial state)
     */
    private prepareElement;
    /**
     * Animate element in (to visible state)
     */
    private animateIn;
    /**
     * Utility: Fade in element
     */
    fadeIn(el: HTMLElement, duration?: number): Promise<void>;
    /**
     * Utility: Fade out element
     */
    fadeOut(el: HTMLElement, duration?: number): Promise<void>;
    /**
     * Utility: Pulse animation
     */
    pulse(el: HTMLElement, duration?: number): void;
    /**
     * Utility: Shake animation
     */
    shake(el: HTMLElement, duration?: number): void;
    /**
     * Utility: Bounce animation
     */
    bounce(el: HTMLElement, duration?: number): void;
    /**
     * Disconnect all observers (cleanup)
     */
    destroy(): void;
}
export declare const animationService: AnimationService;
//# sourceMappingURL=AnimationService.d.ts.map