import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

/*
  AboutBlock — dark slab, three columns: About / Social / Contact.

  Cascade behaviour:
    Every text line (column label, dash, each bio sentence, each
    social link, contact email) fades in opacity 0->1 + y 10->0
    (or top 10->0 for inline sentence spans, since CSS transforms
    have no effect on inline non-replaced elements).

    Two trigger paths share one play counter:

    1. Chevron tap. Hero dispatches a 'cascade-about' window
       event on chevron click. AboutBlock's listener consumes the
       scroll trigger (so it can't double-fire as the chevron
       scroll lands the section in viewport) and bumps playCount.
       This path always fires — every chevron tap replays.

    2. Manual scroll into viewport. An IntersectionObserver on the
       section fires once at threshold 0.35 (~35% of the block
       visible). The hasScrolledIntoView ref makes it strictly
       one-shot per mount — scrolling back up and down doesn't
       replay.

    A bumped playCount keys the wrapping <div>, remounting every
    motion element inside so initial/animate runs fresh. On the
    initial render (playCount = 0) the cascade() helper returns {}
    so the motion elements render at their natural visible state
    with no entry animation — important because we don't want the
    cascade to fire on first page mount, only on a real trigger.

    Reduced-motion users get isAnimating = false, so cascade()
    keeps returning {} even after triggers fire — content just
    appears.
*/

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

const bioSentences = [
  'Feudal is a Visual Artist and Director based in the North of England.',
  'Fifteen years of high-end craft in 3D, motion, and post-production.',
  'Now combined with AI-augmented pipelines that go where the AI studios stop and traditional agencies haven’t reached.',
];

const CASCADE_STEP    = 0.03;
const SCROLL_THRESHOLD = 0.35;

export default function AboutBlock() {
  const reduceMotion = useReducedMotion() ?? false;
  const [playCount, setPlayCount] = useState(0);
  const hasScrolledIntoView = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const isAnimating = playCount > 0 && !reduceMotion;

  // Chevron path — always replays. Marking the scroll trigger as
  // consumed prevents a second fire when the chevron-driven scroll
  // lands the section in view.
  useEffect(() => {
    const handler = () => {
      hasScrolledIntoView.current = true;
      setPlayCount((c) => c + 1);
    };
    window.addEventListener('cascade-about', handler);
    return () => window.removeEventListener('cascade-about', handler);
  }, []);

  // Scroll-into-view path — once per mount, threshold ~35%.
  useEffect(() => {
    if (hasScrolledIntoView.current) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasScrolledIntoView.current) {
          hasScrolledIntoView.current = true;
          setPlayCount((c) => c + 1);
        }
      },
      { threshold: SCROLL_THRESHOLD },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-render counter — cascade() increments per JSX call so
  // each line gets a monotonically increasing delay in source order.
  let idx = 0;
  const cascade = (inline = false) => {
    if (!isAnimating) return {};
    const i = idx++;
    const transition = {
      delay: i * CASCADE_STEP,
      duration: DURATION_MEDIUM,
      ease: EASE_OUT,
    };
    // Inline variant for bio sentence spans — CSS transforms don't
    // apply to inline non-replaced elements, so animate `top` with
    // position: relative instead. Same 10px rise visually.
    if (inline) {
      return {
        initial: { opacity: 0, top: 10 },
        animate: { opacity: 1, top: 0 },
        transition,
        style: { position: 'relative' as const },
      };
    }
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-bg px-6 md:px-10 pt-32 md:pt-48 pb-32 md:pb-48"
    >
      {/*
        key={playCount} forces a remount of the entire content tree
        on each trigger, so every motion element re-runs its
        initial -> animate transition from scratch.
      */}
      <div key={playCount} className="max-w-5xl mx-auto">
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
