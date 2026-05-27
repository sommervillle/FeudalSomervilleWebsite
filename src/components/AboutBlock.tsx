import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../motion';

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

// Slower than /info's cascade (which keeps 0.05 / DURATION_MEDIUM).
// 0.08 between lines + 0.8s per line gives each line breathing room
// to be appreciated rather than blurring past. Not promoted into
// motion.ts since /info deliberately stays on the faster timing —
// these constants are local to AboutBlock.
const CASCADE_STEP    = 0.08;
const LINE_DURATION   = 0.8;
const SCROLL_THRESHOLD = 0.35;

export default function AboutBlock() {
  const reduceMotion = useReducedMotion() ?? false;
  const [playCount, setPlayCount] = useState(0);
  const hasScrolledIntoView = useRef(false);
  // chevronInitiated guards the chevron's arrival window. Set
  // immediately on chevron tap; cleared after the cascade finishes.
  // While true, the IntersectionObserver path bails — even though
  // the chevron-driven scroll will move AboutBlock into the IO's
  // threshold mid-arrival, we don't want IO to fire a second cascade.
  // hasScrolledIntoView is the persistent once-per-mount gate that
  // also gets set when the chevron path actually plays the cascade.
  const chevronInitiated    = useRef(false);
  const sectionRef          = useRef<HTMLElement>(null);


  // Chevron path. Hero dispatches 'cascade-about' synchronously
  // on tap, so the listener can set chevronInitiated BEFORE the
  // scroll moves the section into the IO threshold. The 1s
  // setTimeout is what defers the actual cascade start until the
  // smooth scroll has settled. Once playCount bumps and the
  // cascade is in flight, a second setTimeout clears
  // chevronInitiated after the cascade completes.
  useEffect(() => {
    const handler = () => {
      chevronInitiated.current = true;

      window.setTimeout(() => {
        hasScrolledIntoView.current = true;
        setPlayCount((c) => c + 1);

        // Clear the flag after the cascade fully completes.
        // Cascade duration = lines (~13) * CASCADE_STEP + LINE_DURATION
        // ≈ 13 * 0.08 + 0.8 = 1.84s. +200ms buffer.
        window.setTimeout(() => {
          chevronInitiated.current = false;
        }, 2100);
      }, 1000);
    };
    window.addEventListener('cascade-about', handler);
    return () => window.removeEventListener('cascade-about', handler);
  }, []);

  // Scroll-into-view path — once per mount, threshold ~35%.
  // Bails if the chevron initiated the current arrival OR the
  // cascade has already played for this mount.
  useEffect(() => {
    if (hasScrolledIntoView.current) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !chevronInitiated.current &&
          !hasScrolledIntoView.current
        ) {
          hasScrolledIntoView.current = true;
          setPlayCount((c) => c + 1);
        }
      },
      { threshold: SCROLL_THRESHOLD },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cascade prop generator. Three states:
  //
  //   1. Reduced-motion: return {} so motion elements render at
  //      their natural visible state with no transforms. The user
  //      never sees the cascade.
  //
  //   2. Pre-trigger (playCount = 0): return initial AND animate
  //      both set to the hidden state. Motion elements paint at
  //      opacity 0 from first render and stay there — no flash of
  //      visible text in the window between AboutBlock entering
  //      the viewport and the IntersectionObserver hitting its
  //      threshold. Using `animate` (not just `initial`) is what
  //      pins them; framer-motion would otherwise render at the
  //      animate state if no animate change is implied.
  //
  //   3. Triggered (playCount > 0): the wrapping <div key=...>
  //      has remounted, so the new motion elements mount with
  //      initial: opacity 0 -> animate: opacity 1, running the
  //      cascade transition.
  let idx = 0;
  const cascade = (inline = false) => {
    if (reduceMotion) return {};

    // Hidden state shared by pre-trigger and triggered initial.
    const hidden = inline
      ? { opacity: 0, top: 10 }
      : { opacity: 0, y: 10 };
    const style  = inline ? { position: 'relative' as const } : undefined;

    if (playCount === 0) {
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
