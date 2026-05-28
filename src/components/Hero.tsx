import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { scrollToElement } from '../smoothScroll';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';
import ShowreelLightbox from './ShowreelLightbox';

/*
  Hero — full-viewport section. Holds:
    - Showreel CTA bottom-left (fade + rise on mount, ~200ms delay)
    - Chevron bottom-centre (infinite gentle drift, cinematic scroll on click)

  The Showreel button splits behaviour by breakpoint via two
  separate elements (md:hidden / hidden md:inline-flex) rather than
  a runtime check, so the markup itself documents which branch each
  viewport gets:
    - Mobile: <button> opens the ShowreelLightbox.
    - Desktop: <a href="#work"> scrolls to the WorkGrid section
      (current behaviour, unchanged).
*/

// Shared button styling for both branches — extracted so the two
// elements stay visually identical regardless of breakpoint.
const SHOWREEL_BUTTON_CLASS =
  'pointer-events-auto inline-flex items-center justify-center ' +
  'px-9 py-[11px] border border-fg/30 text-fg/80 text-[10px] ' +
  'tracking-[0.35em] uppercase font-light ' +
  'hover:border-fg/60 hover:text-fg hover:bg-fg/[0.04] ' +
  'transition-all duration-300';

// Vertical distance for the splash-exit slide-in. 200px clears
// both the SHOWREEL wrapper (bottom-[100px], ~40px tall) and the
// chevron (bottom-8 / ~33px tall) below the Hero's bottom edge
// while the splash is on screen. Hero has overflow-hidden so the
// translated elements are visually clipped during this state.
const HERO_SLIDE_OFFSET = 200;

export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;
  const [showreelOpen, setShowreelOpen] = useState(false);

  // Hero elements slide in coordinated with the HTML splash exit.
  // Initialised at mount by checking document.getElementById('splash')
  // — same pattern App.tsx uses for the header slide. Same edge-case
  // coverage too: direct landing on /info or /photo, non-first visit,
  // and prefers-reduced-motion all have #splash already removed by
  // main.tsx before this component renders, so this initialises to
  // false and elements paint at final position.
  const [heroOffscreen, setHeroOffscreen] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!document.getElementById('splash');
  });

  useEffect(() => {
    if (!heroOffscreen) return;
    const onSplashExit = () => setHeroOffscreen(false);
    window.addEventListener('splash-exit', onSplashExit);
    return () => window.removeEventListener('splash-exit', onSplashExit);
  }, [heroOffscreen]);

  return (
    <>
      <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0e0e0e]">

        {/* Video placeholder — swap for <video autoPlay muted loop playsInline />. */}
        <div className="absolute inset-0 bg-[#0e0e0e]" />

        {/* Vignette — legibility over future video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

        {/*
          SHOWREEL — bottom anchor.
          Mobile: wrapper spans the viewport (inset-x-0), inner flex
          justify-center horizontally centres the button.
          Desktop (md+): md:px-10 reintroduces the gutter; the inner
          flips to md:block + md:max-w-5xl md:mx-auto so the button
          sits at the left edge of the AboutBlock safe-zone, exactly
          as before.

          Outer motion.div owns positioning + the splash-exit slide
          (translateY(200px) -> 0). Inner motion.div keeps the
          existing on-mount fade+rise so the SHOWREEL still has a
          gentle entrance in the no-splash cases (refresh /, SPA-nav
          to /). Two y transforms compose cleanly because they're
          on separate elements.
        */}
        <motion.div
          className="absolute bottom-[100px] inset-x-0 z-10 pointer-events-none md:px-10"
          initial={false}
          animate={{ y: heroOffscreen ? HERO_SLIDE_OFFSET : 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: DURATION_MEDIUM, ease: EASE_OUT }}
          >
            <div className="flex justify-center md:block md:max-w-5xl md:mx-auto">
              {/* Mobile: opens the ShowreelLightbox. */}
              <button
                type="button"
                onClick={() => setShowreelOpen(true)}
                className={`md:hidden ${SHOWREEL_BUTTON_CLASS}`}
              >
                Showreel
              </button>

              {/* Desktop: scrolls to the WorkGrid section (unchanged). */}
              <a
                href="#work"
                className={`hidden md:inline-flex ${SHOWREEL_BUTTON_CLASS}`}
              >
                Showreel
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/*
          Chevron — three nested layers, each owning one transform
          concern so they don't clobber each other on the same DOM
          node:
            1. Outer <div> — Tailwind -translate-x-1/2 for horizontal
               centring (a CSS transform).
            2. Middle motion.div — splash-exit slide
               (translateY(200px) -> 0, EASE_OUT, 600ms).
            3. Inner motion.div — infinite y-drift loop.
          Two motion components means framer-motion writes two
          independent inline transforms; nesting composes them
          via the DOM hierarchy instead of fighting on one node.
        */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={false}
            animate={{ y: heroOffscreen ? HERO_SLIDE_OFFSET : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            <button
              onClick={() => {
                // Dispatch synchronously so AboutBlock sets its
                // chevronInitiated flag BEFORE the scroll moves the
                // section into the IntersectionObserver's threshold.
                // The 1s settle-delay lives inside AboutBlock's
                // handler — keeps timing logic in one place and
                // lets Hero stay a plain notifier.
                window.dispatchEvent(new Event('cascade-about'));
                scrollToElement('about', 40, reduceMotion);
              }}
              aria-label="Scroll to next section"
              className="block p-3 text-fg/35 hover:text-fg/65 transition-opacity duration-300"
            >
              <svg width="16" height="9" viewBox="0 0 16 9" fill="none" aria-hidden="true">
                <path
                  d="M1 1L8 8L15 1"
                  stroke="currentColor"
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
          </motion.div>
        </div>

      </section>

      <AnimatePresence>
        {showreelOpen && (
          <ShowreelLightbox onClose={() => setShowreelOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
