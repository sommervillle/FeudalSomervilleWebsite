import { motion, useReducedMotion } from 'framer-motion';
import { scrollToElement } from '../smoothScroll';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

/*
  Hero — full-viewport section. Holds:
    - showreel CTA bottom-left (fade + rise on mount, ~200ms delay)
    - chevron bottom-centre (infinite gentle drift, cinematic scroll on click)
*/
export default function Hero() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0e0e0e]">

      {/* Video placeholder — swap for <video autoPlay muted loop playsInline />. */}
      <div className="absolute inset-0 bg-[#0e0e0e]" />

      {/* Vignette — legibility over future video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

      {/*
        VIEW THE SHOWREEL — bottom-left, reveals on mount.
        Mobile keeps the 100px-from-edge positioning. Desktop
        (md+) stretches the wrapper edge-to-edge and centres an
        inner max-w-5xl container, so the button's left edge
        aligns with the AboutBlock columns' left edge.
      */}
      <motion.div
        className="absolute bottom-[100px] inset-x-0 z-10 px-[100px] md:px-10 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: DURATION_MEDIUM, ease: EASE_OUT }}
      >
        <div className="md:max-w-5xl md:mx-auto">
          <a
            href="#work"
            className="pointer-events-auto inline-flex items-center justify-center px-9 py-[11px] border border-fg/30 text-fg/80 text-[10px] tracking-[0.35em] uppercase font-light hover:border-fg/60 hover:text-fg hover:bg-fg/[0.04] transition-all duration-300"
          >
            View the Showreel
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
  );
}
