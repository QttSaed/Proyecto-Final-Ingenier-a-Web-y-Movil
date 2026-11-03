import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

/**
 * ScrollToTop component that resets the scroll position to the top of the page
 * on every route change, accounting for Ionic transitions.
 */
export default function ScrollToTop() {
  const { pathname, search, key } = useLocation();

  useEffect(() => {
    // Immediate reset
    scrollToTop(false);

    // Reset on animation frame and after Ionic page transition delay
    const rafId = requestAnimationFrame(() => scrollToTop(false));
    const timer1 = setTimeout(() => scrollToTop(false), 50);
    const timer2 = setTimeout(() => scrollToTop(false), 150);
    const timer3 = setTimeout(() => scrollToTop(false), 300);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, search, key]);

  return null;
}
