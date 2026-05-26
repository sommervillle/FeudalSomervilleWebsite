import { animate } from 'framer-motion';
import { EASE_SMOOTH, DURATION_SLOW } from './motion';

/*
  Site-wide programmatic scroll. Uses framer-motion's imperative
  animate() so every anchor scroll on the site rides EASE_SMOOTH
  for DURATION_SLOW — matches the cinematic timing vocabulary.

  behavior: 'instant' on each scrollTo bypasses the
  scroll-behavior: smooth rule in index.css; otherwise the browser
  would try to smooth each per-frame step and fight the animation.

  If the user prefers reduced motion, jump instantly.
*/
export function scrollToY(y: number, reduceMotion = false) {
  if (reduceMotion) {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    return;
  }

  animate(window.scrollY, y, {
    duration: DURATION_SLOW,
    ease: EASE_SMOOTH,
    onUpdate: (v) => window.scrollTo({ top: v, behavior: 'instant' as ScrollBehavior }),
  });
}

// Convenience wrapper: scroll an element into view at the top of
// the viewport with an optional offset (e.g. to clear a fixed header).
export function scrollToElement(id: string, offset = 0, reduceMotion = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  scrollToY(y, reduceMotion);
}
