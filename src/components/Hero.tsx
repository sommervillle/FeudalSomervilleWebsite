import { useState } from 'react';
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

export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;
  const [showreelOpen, setShowreelOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0e0e0e]">

        {/* Video placeholder — swap for <video autoPlay muted loop playsInline />. */}
        <div className="absolute inset-0 bg-[#0e0e0e]" />

        {/* Vignette — legibility over future video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

        {/*
          SHOWREEL — bottom-left, reveals on mount.
          Mobile: left-[100px], natural content-width.
          Desktop (md+): md:left-0 md:right-0 stretches the wrapper
          edge-to-edge so the inner md:max-w-5xl md:mx-auto plants
          the button's left edge on the AboutBlock safe-zone.
        */}
        <motion.div
          className="absolute bottom-[100px] z-10 pointer-events-none
                     left-[100px]
                     md:left-0 md:right-0 md:px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: DURATION_MEDIUM, ease: EASE_OUT }}
        >
          <div className="md:max-w-5xl md:mx-auto">
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

        {/*
          Chevron — outer div owns horizontal centring via Tailwind's
          -translate-x-1/2 (a CSS transform). The inner motion.div owns
          the y-drift; nesting keeps framer-motion's transform from
          clobbering the centring transform on the same element.
        */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
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
              onClick={() => scrollToElement('about', 40, reduceMotion)}
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
