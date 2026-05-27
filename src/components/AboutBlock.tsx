import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../motion';

/*
  AboutBlock — dark slab, three columns: About / Social / Contact.

  Cascade behaviour (single-state version):
    - Every text line (column label, dash, each bio sentence, each
      social link, contact email) fades in opacity 0->1 + y 10->0
      (or top 10->0 for inline sentence spans, since CSS transforms
      have no effect on inline non-replaced elements).

    - Single state variable: hasFired. Cascade plays exactly once
      per page mount and never replays for the rest of the session,
      regardless of scrolling around. Only a true remount (route
      change away and back, or refresh) resets it.

    - Two trigger paths feed the same setHasFired(true). Whichever
      fires first wins; subsequent triggers are React no-ops:
        1. Chevron tap — Hero dispatches 'cascade-about' on click.
           The listener delays setHasFired by 1s so the cascade
           lands as the scroll settles.
        2. Manual scroll — IntersectionObserver fires at 35%
           visibility. After hasFired flips, the observer's
           callback still runs but setHasFired(true) is a no-op.

    - Reduced-motion users get cascade() returning {}, so motion
      elements render at their natural visible state with no
      animation. hasFired still flips, but the prop generator
      short-circuits.

    - No wrapping <div key=...> needed: the motion elements stay
      mounted across the trigger; framer-motion animates from the
      pre-fired hidden state to the post-fired visible state when
      animate changes.
*/

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

const bioSentences = [
  'Feudal is a Visual Artist and Director based in the North of England.',
  'Fifteen years of high-end craft in 3D, motion, and post-production.',
  'Now combined with AI-augmented pipelines that go where the AI studios stop and traditional agencies haven’t reached.',
];

// Slower than /info's cascade (which keeps 0.05 / DURATION_MEDIUM).
// 0.08 between lines + 0.8s per line gives each line breathing room
// to be appreciated rather than blurring past. Not promoted into
// motion.ts since /info deliberately stays on the faster timing —
// these constants are local to AboutBlock.
const CASCADE_STEP     = 0.08;
const LINE_DURATION    = 0.8;
const SCROLL_THRESHOLD = 0.35;
const CHEVRON_DELAY_MS = 1000;

export default function AboutBlock() {
  const reduceMotion = useReducedMotion() ?? false;
  const [hasFired, setHasFired] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Chevron path. Hero dispatches the event synchronously on tap;
  // the listener schedules setHasFired after CHEVRON_DELAY_MS so
  // the cascade lands as the scroll settles. Once hasFired is true,
  // setHasFired(true) is a React no-op so subsequent chevron taps
  // still dispatch but never re-fire the cascade.
  useEffect(() => {
    const handler = () => {
      window.setTimeout(() => setHasFired(true), CHEVRON_DELAY_MS);
    };
    window.addEventListener('cascade-about', handler);
    return () => window.removeEventListener('cascade-about', handler);
  }, []);

  // Manual-scroll path. IO fires at 35% visibility. Same no-op
  // semantics on subsequent firings.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= SCROLL_THRESHOLD) {
          setHasFired(true);
        }
      },
      { threshold: SCROLL_THRESHOLD },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-render index counter. cascade() increments per JSX call so
  // each line gets a monotonically increasing delay in source order.
  let idx = 0;
  const cascade = (inline = false) => {
    if (reduceMotion) return {};

    const hidden = inline
      ? { opacity: 0, top: 10 }
      : { opacity: 0, y: 10 };
    const style  = inline ? { position: 'relative' as const } : undefined;

    // Pre-fired: pin elements at the hidden state. Setting both
    // initial AND animate is what holds them there — `initial` alone
    // wouldn't, since framer-motion would otherwise render at the
    // animate state when no animate change is implied.
    if (!hasFired) {
      return { initial: hidden, animate: hidden, ...(style ? { style } : {}) };
    }

    const i = idx++;
    const transition = {
      delay: i * CASCADE_STEP,
      duration: LINE_DURATION,
      ease: EASE_OUT,
    };
    if (inline) {
      return {
        initial:    { opacity: 0, top: 10 },
        animate:    { opacity: 1, top: 0 },
        transition,
        style:      { position: 'relative' as const },
      };
    }
    return {
      initial:    { opacity: 0, y: 10 },
      animate:    { opacity: 1, y: 0 },
      transition,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-bg px-6 md:px-10 pt-32 md:pt-48 pb-32 md:pb-48"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-16">

          {/* Column 1 — About */}
          <div>
            <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
              About
            </motion.p>
            <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">
              —
            </motion.p>
            <p className="text-fg/80 text-base font-semibold leading-snug">
              {bioSentences.map((sentence, i) => (
                <motion.span key={i} {...cascade(true)}>
                  {sentence}
                  {i < bioSentences.length - 1 ? ' ' : ''}
                </motion.span>
              ))}
            </p>
          </div>

          {/* Column 2 — Social */}
          <div>
            <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
              Social
            </motion.p>
            <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">
              —
            </motion.p>
            <div className="space-y-3">
              {socials.map((label) => (
                <motion.a
                  key={label}
                  {...cascade()}
                  href="#"
                  className="block text-fg/75 text-base font-medium leading-snug hover:text-fg transition-colors duration-200"
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
              Contact
            </motion.p>
            <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">
              —
            </motion.p>
            <motion.a
              {...cascade()}
              href="mailto:FeudalProtocol@protonmail.com"
              className="block text-fg/75 text-base font-medium leading-snug hover:text-fg transition-colors duration-200 break-all"
            >
              FeudalProtocol@protonmail.com
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}
