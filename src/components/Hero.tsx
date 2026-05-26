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

      {/* VIEW THE SHOWREEL — bottom-left, reveals on mount */}
      <motion.div
        className="absolute bottom-[100px] left-[100px] z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: DURATION_MEDIUM, ease: EASE_OUT }}
      >
        <a
          href="#work"
          className="inline-flex items-center justify-center px-9 py-[11px] border border-fg/30 text-fg/80 text-[10px] tracking-[0.35em] uppercase font-light hover:border-fg/60 hover:text-fg hover:bg-fg/[0.04] transition-all duration-300"
        >
          View the Showreel
        </a>
      </motion.div>

      {/*
        Chevron — wrapping motion.div handles the infinite drift so the
        button can keep its -translate-x-1/2 centering CSS without
        framer-motion clobbering the transform.
      */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <button
          onClick={() => scrollToElement('about', 90, reduceMotion)}
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

    </section>
  );
}
