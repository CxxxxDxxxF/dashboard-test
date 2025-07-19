/**
 * AnimationService: Provides scroll-triggered and utility-based animations for the dashboard.
 * Usage: Import and call AnimationService.getInstance().initScrollAnimations() or use utility methods.
 */
export class AnimationService {
    constructor() {
        this.observers = [];
    }
    static getInstance() {
        if (!AnimationService.instance) {
            AnimationService.instance = new AnimationService();
        }
        return AnimationService.instance;
    }
    /**
     * Initialize scroll-triggered animations for elements matching selector.
     */
    initScrollAnimations({ selector = '.animate-on-scroll', threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true, animation = { duration: 600, easing: 'cubic-bezier(0.4,0,0.2,1)', distance: 40, direction: 'up' }, } = {}) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length)
            return;
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target, animation);
                    if (once)
                        obs.unobserve(entry.target);
                }
            });
        }, { threshold, rootMargin });
        elements.forEach(el => {
            this.prepareElement(el, animation);
            observer.observe(el);
        });
        this.observers.push(observer);
    }
    /**
     * Prepare element for animation (set initial state)
     */
    prepareElement(el, opts = {}) {
        const { distance = 40, direction = 'up' } = opts;
        let transform = '';
        switch (direction) {
            case 'up':
                transform = `translateY(${distance}px)`;
                break;
            case 'down':
                transform = `translateY(-${distance}px)`;
                break;
            case 'left':
                transform = `translateX(${distance}px)`;
                break;
            case 'right':
                transform = `translateX(-${distance}px)`;
                break;
        }
        el.style.opacity = '0';
        el.style.transform = transform;
    }
    /**
     * Animate element in (to visible state)
     */
    animateIn(el, opts = {}) {
        const { duration = 600, easing = 'cubic-bezier(0.4,0,0.2,1)', delay = 0 } = opts;
        el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'none';
    }
    /**
     * Utility: Fade in element
     */
    fadeIn(el, duration = 400) {
        return new Promise(resolve => {
            el.style.transition = `opacity ${duration}ms`;
            el.style.opacity = '1';
            setTimeout(resolve, duration);
        });
    }
    /**
     * Utility: Fade out element
     */
    fadeOut(el, duration = 400) {
        return new Promise(resolve => {
            el.style.transition = `opacity ${duration}ms`;
            el.style.opacity = '0';
            setTimeout(resolve, duration);
        });
    }
    /**
     * Utility: Pulse animation
     */
    pulse(el, duration = 1000) {
        el.style.animation = `pulse ${duration}ms ease-in-out`;
        setTimeout(() => { el.style.animation = ''; }, duration);
    }
    /**
     * Utility: Shake animation
     */
    shake(el, duration = 500) {
        el.style.animation = `shake ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
        setTimeout(() => { el.style.animation = ''; }, duration);
    }
    /**
     * Utility: Bounce animation
     */
    bounce(el, duration = 600) {
        el.style.animation = `bounce ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
        setTimeout(() => { el.style.animation = ''; }, duration);
    }
    /**
     * Disconnect all observers (cleanup)
     */
    destroy() {
        this.observers.forEach(o => o.disconnect());
        this.observers = [];
    }
}
// Export singleton instance
export const animationService = AnimationService.getInstance();
//# sourceMappingURL=AnimationService.js.map