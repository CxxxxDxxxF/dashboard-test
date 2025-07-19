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

export class AnimationService {
  private static instance: AnimationService;
  private observers: IntersectionObserver[] = [];

  private constructor() {}

  static getInstance(): AnimationService {
    if (!AnimationService.instance) {
      AnimationService.instance = new AnimationService();
    }
    return AnimationService.instance;
  }

  /**
   * Initialize scroll-triggered animations for elements matching selector.
   */
  initScrollAnimations({
    selector = '.animate-on-scroll',
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    animation = { duration: 600, easing: 'cubic-bezier(0.4,0,0.2,1)', distance: 40, direction: 'up' },
  }: ScrollAnimationOptions = {}): void {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn(entry.target as HTMLElement, animation);
          if (once) obs.unobserve(entry.target);
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
  private prepareElement(el: HTMLElement, opts: AnimationOptions = {}): void {
    const { distance = 40, direction = 'up' } = opts;
    let transform = '';
    switch (direction) {
      case 'up': transform = `translateY(${distance}px)`; break;
      case 'down': transform = `translateY(-${distance}px)`; break;
      case 'left': transform = `translateX(${distance}px)`; break;
      case 'right': transform = `translateX(-${distance}px)`; break;
    }
    el.style.opacity = '0';
    el.style.transform = transform;
  }

  /**
   * Animate element in (to visible state)
   */
  private animateIn(el: HTMLElement, opts: AnimationOptions = {}): void {
    const { duration = 600, easing = 'cubic-bezier(0.4,0,0.2,1)', delay = 0 } = opts;
    el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
    el.style.opacity = '1';
    el.style.transform = 'none';
  }

  /**
   * Utility: Fade in element
   */
  fadeIn(el: HTMLElement, duration = 400): Promise<void> {
    return new Promise(resolve => {
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '1';
      setTimeout(resolve, duration);
    });
  }

  /**
   * Utility: Fade out element
   */
  fadeOut(el: HTMLElement, duration = 400): Promise<void> {
    return new Promise(resolve => {
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '0';
      setTimeout(resolve, duration);
    });
  }

  /**
   * Utility: Pulse animation
   */
  pulse(el: HTMLElement, duration = 1000): void {
    el.style.animation = `pulse ${duration}ms ease-in-out`;
    setTimeout(() => { el.style.animation = ''; }, duration);
  }

  /**
   * Utility: Shake animation
   */
  shake(el: HTMLElement, duration = 500): void {
    el.style.animation = `shake ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
    setTimeout(() => { el.style.animation = ''; }, duration);
  }

  /**
   * Utility: Bounce animation
   */
  bounce(el: HTMLElement, duration = 600): void {
    el.style.animation = `bounce ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
    setTimeout(() => { el.style.animation = ''; }, duration);
  }

  /**
   * Disconnect all observers (cleanup)
   */
  destroy(): void {
    this.observers.forEach(o => o.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const animationService = AnimationService.getInstance(); 