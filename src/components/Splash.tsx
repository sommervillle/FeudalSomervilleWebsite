import { motion } from 'framer-motion';
import { EASE_OUT } from '../motion';

/*
  Splash — first-visit fullscreen reveal on /.

  Timing (2.5s total):
    0.0s          mount: backdrop opaque, monogram at opacity 0
    0.0 -> 0.5s   monogram fades in to opacity 1
    0.5 -> 2.0s   hold
    2.0 -> 2.5s   backdrop fades opacity 1 -> 0 (monogram fades with it
                  since it inherits the parent's compositing alpha)
    2.5s          onComplete fires -> parent unmounts the splash

  Pointer events stay auto on the backdrop so taps during the 2.5s
  don't accidentally land on Hero elements behind it (the showreel
  CTA finishes its reveal at ~0.8s and would otherwise be live and
  visible through the fading backdrop near the end).

  Skipped entirely for prefers-reduced-motion users — gating lives
  in the parent (Home.tsx) so this component can stay dumb.

  EASE_OUT is reused from motion.ts. Durations are literal numbers
  rather than DURATION_FAST/MEDIUM because 0.5 / 1.5 / 0.5 doesn't
  cleanly map to the existing FAST(0.3) / MEDIUM(0.6) / SLOW(1.2)
  trio and the splash is a one-off ceremony rather than recurring
  UI motion.
*/

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.0, ease: EASE_OUT }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[200] bg-bg flex items-center justify-center"
      aria-hidden="true"
    >
      {/*
        Loading bar pinned to the top. Linear 0 -> 100% width
        over 2.5s matches the full splash duration; the bar
        reaches the right edge exactly as the splash starts its
        final removal. Inside the splash motion.div so it fades
        out together with the backdrop.
      */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2.5, ease: 'linear' }}
        className="absolute top-0 left-0 h-[2px] bg-fg"
      />
      <motion.img
        src="/monogram.png"
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="h-[160px] md:h-[200px] w-auto"
      />
    </motion.div>
  );
}
