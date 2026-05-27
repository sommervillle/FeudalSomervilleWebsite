import { useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { DURATION_FAST, EASE_OUT } from '../motion';

/*
  Lightbox — mobile fullscreen photo viewer.

  Gestures (native touch events, no extra deps):
    - pinch (2 fingers) -> scale 1..4
    - swipe left/right  -> next / prev
    - swipe down        -> close
    - X button top-right -> close (fallback)

  Long-press inside the lightbox does nothing:
    - no onContextMenu  (blocked globally in App.tsx)
    - no iOS callout    (image elements carry -webkit-touch-callout: none
                         from index.css; the placeholder div is not an
                         image so the callout doesn't apply at all)
    - no info overlay   (no long-press handler is wired here — that's
                         a grid-only behaviour in Photo.tsx)
    - no text selection (select-none on the container)

  touch-action: none on the container suppresses native scroll / pinch
  / pull-to-refresh, so our handlers see clean touch streams.

  When real images replace the placeholder, the <img> src should be
  the same web-optimised file as the grid thumbnail — never a higher-
  res master — per the content-protection spec.
*/

interface LightboxProps {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 0.5;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

function fingerDistance(a: React.Touch, b: React.Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

export default function Lightbox({ index, onClose, onPrev, onNext }: LightboxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Reset transforms whenever the index changes (after a swipe-nav).
  useEffect(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [index, x, y, scale]);

  const start = useRef({
    x: 0,
    y: 0,
    t: 0,
    pinchDist: 0,
    pinchScale: 1,
    mode: 'idle' as 'idle' | 'pan' | 'pinch',
  });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      start.current.pinchDist = fingerDistance(e.touches[0], e.touches[1]);
      start.current.pinchScale = scale.get();
      start.current.mode = 'pinch';
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      start.current.x = t.clientX;
      start.current.y = t.clientY;
      start.current.t = Date.now();
      start.current.mode = 'pan';
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (start.current.mode === 'pinch' && e.touches.length >= 2) {
      const d = fingerDistance(e.touches[0], e.touches[1]);
      const next = start.current.pinchScale * (d / start.current.pinchDist);
      scale.set(Math.max(MIN_SCALE, Math.min(MAX_SCALE, next)));
    } else if (start.current.mode === 'pan' && e.touches.length === 1 && scale.get() === 1) {
      const t = e.touches[0];
      x.set(t.clientX - start.current.x);
      // Clamp downward-only so drag-down feels like dismiss, not pan.
      y.set(Math.max(0, t.clientY - start.current.y));
    }
  };

  const onTouchEnd = () => {
    if (start.current.mode === 'pan' && scale.get() === 1) {
      const dx = x.get();
      const dy = y.get();
      const dt = Math.max(1, Date.now() - start.current.t);
      const vx = Math.abs(dx) / dt;
      const vy = Math.abs(dy) / dt;

      if (Math.abs(dx) > SWIPE_DISTANCE || vx > SWIPE_VELOCITY) {
        if (dx < 0) onNext(); else onPrev();
      } else if (dy > SWIPE_DISTANCE || vy > SWIPE_VELOCITY) {
        onClose();
        return;
      }

      // Snap back to centre when neither swipe threshold met.
      animate(x, 0, { duration: DURATION_FAST, ease: EASE_OUT });
      animate(y, 0, { duration: DURATION_FAST, ease: EASE_OUT });
    }

    start.current.mode = 'idle';
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bg flex items-center justify-center select-none touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-5 right-6 p-2 text-fg z-[110]"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path
            d="M3 3L19 19M19 3L3 19"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <motion.div
        style={{ x, y, scale }}
        className="w-4/5 aspect-square bg-fg/10 touch-none select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      />
    </motion.div>
  );
}
