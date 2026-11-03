/**
 * Utility to reliably reset the scroll position to the top of the page.
 * Handles window/document scrolling as well as Ionic's custom <ion-content>
 * shadow DOM containers (.inner-scroll).
 */
export function scrollToTop(smooth: boolean = false): void {
  // 1. Standard window and document scrolling
  try {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      if (smooth) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    }
  } catch {
    // jsdom or unsupported browser environment
  }

  if (typeof document !== 'undefined') {
    try {
      if (document.documentElement) {
        if (smooth && typeof document.documentElement.scrollTo === 'function') {
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.documentElement.scrollTop = 0;
        }
      }

      if (document.body) {
        if (smooth && typeof document.body.scrollTo === 'function') {
          document.body.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.body.scrollTop = 0;
        }
      }
    } catch {
      // Ignored
    }

    // 2. Ionic <ion-content> scroll containers
    try {
      const ionContents = document.querySelectorAll<HTMLElement>('ion-content');
      ionContents.forEach((el) => {
        try {
          if (typeof (el as any).scrollToTop === 'function') {
            (el as any).scrollToTop(smooth ? 250 : 0);
          }
        } catch {
          // Fallback below
        }

        el.scrollTop = 0;

        // Check shadow root for Ionic's inner-scroll wrapper
        try {
          const shadow = el.shadowRoot;
          if (shadow) {
            const innerScroll = shadow.querySelector<HTMLElement>('.inner-scroll');
            if (innerScroll) {
              if (smooth && typeof innerScroll.scrollTo === 'function') {
                innerScroll.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                innerScroll.scrollTop = 0;
              }
            }
          }
        } catch {
          // Ignore shadow DOM access errors if any
        }
      });
    } catch {
      // Ignored
    }

    // 3. Fallback for any other main scroll containers
    try {
      const scrollContainers = document.querySelectorAll<HTMLElement>('.main-content, .legal-container, main');
      scrollContainers.forEach((container) => {
        if (container.scrollTop > 0) {
          if (smooth && typeof container.scrollTo === 'function') {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            container.scrollTop = 0;
          }
        }
      });
    } catch {
      // Ignored
    }
  }
}
