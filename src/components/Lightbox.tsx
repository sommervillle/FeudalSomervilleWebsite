import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import { DURATION_FAST, EASE_OUT } from '../motion';

/*
  Lightbox — mobile fullscreen photo viewer.

  Two interaction states driven by `scale`:
    - Locked (scale = 1): photo is full-bleed horizontally, letterboxed
      vertically, caption visible bottom-left. One-finger drag at this
      scale is a navigation swipe (horizontal only — vertical does
      nothing per spec).
    - Zoomed (scale > 1): photo is pannable in all directions.
      One-finger drag pans; left/right drags do NOT navigate.

    Plus a pinch-overshoot state: scale can drop to 0.8 mid-pinch;
    on release we animate back to 1 (and reset pan to 0,0).

  Caption opacity is derived from scale via useTransform — fades out
  the moment zoom goes above 1, fades back in as it returns. Overshoot
  below 1 keeps the caption visible because useTransform clamps to the
  first input value.

  Navigation slide uses AnimatePresence with horizontal slide
  variants. mode="popLayout" lets the outgoing and incoming photos
  animate simultaneously. initial={false} suppresses the slide on
  first lightbox open so the first photo appears immediately at
  centre.

  Content protections (same as before):
    - select-none + touch-none on the container and photo so the
      browser's native pinch / pan / pull-to-refresh never activate
      and our handlers see clean touch streams.
    - contextmenu is blocked globally in App.tsx.
    - When real <img> elements replace the placeholder, the global
      img/video CSS in index.css adds -webkit-user-drag and
      -webkit-touch-callout: none for iOS save-popup suppression.
*/

export interface PhotoData {
  title: string;
  location: string;
  date: string;
}

interface LightboxProps {
  photos: readonly PhotoData[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 0.5;
const MIN_SCALE = 0.8;
const MAX_SCALE = 4;

function fingerDistance(a: React.Touch, b: React.Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

// Direction-aware slide for nav. `custom` (=navDir) feeds into the
// variant functions: dir=1 = next, dir=-1 = prev. Both incoming and
// outgoing children read the same custom so the slide direction is
// internally consistent across the transition.
const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const scale  = useMotionValue(1);
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);

  // Caption opacity: 1 at scale<=1, fades to 0 as scale exceeds ~1.05.
  // Clamps to 1 below scale=1 so overshoot keeps the caption visible.
  const captionOpacity = useTransform(scale, [1, 1.05], [1, 0]);

  const [navDir, setNavDir] = useState(0);

  // Reset pan/zoom whenever the index changes (after a swipe-nav).
  useEffect(() => {
    scale.set(1);
    photoX.set(0);
    photoY.set(0);
  }, [index, scale, photoX, photoY]);

  const start = useRef({
    x: 0,
    y: 0,
    t: 0,
    startPanX: 0,
    startPanY: 0,
    pinchDist: 0,
    startScale: 1,
    mode: 'idle' as 'idle' | 'swipe' | 'pan' | 'pinch',
  });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length >= 2) {
      start.current.pinchDist  = fingerDistance(e.touches[0], e.touches[1]);
      start.current.startScale = scale.get();
      start.current.mode       = 'pinch';
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      start.current.x = t.clientX;
      start.current.y = t.clientY;
      start.current.t = Date.now();
      // The scale at touch-start decides which one-finger mode we're in.
      if (scale.get() > 1) {
        start.current.mode      = 'pan';
        start.current.startPanX = photoX.get();
        start.current.startPanY = photoY.get();
      } else {
        start.current.mode = 'swipe';
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (start.current.mode === 'pinch' && e.touches.length >= 2) {
      const d    = fingerDistance(e.touches[0], e.touches[1]);
      const next = start.current.startScale * (d / start.current.pinchDist);
      // Allow overshoot down to 0.8, clamp at 4. Snap-back from <1
      // happens on touchend.
      scale.set(Math.max(MIN_SCALE, Math.min(MAX_SCALE, next)));
    } else if (start.current.mode === 'pan' && e.touches.length === 1) {
      const t = e.touches[0];
      photoX.set(start.current.startPanX + (t.clientX - start.current.x));
      photoY.set(start.current.startPanY + (t.clientY - start.current.y));
    }
    // 'swipe' mode: deliberately no visual update during drag — the
    // image stays put and we only detect intent on touchend.
  };

  const handlePrev = () => {
    setNavDir(-1);
    onPrev();
  };
  const handleNext = () => {
    setNavDir(1);
    onNext();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const mode = start.current.mode;
    start.current.mode = 'idle';

    if (mode === 'swipe' && scale.get() === 1 && e.changedTouches.length > 0) {
      const t  = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      const dt = Math.max(1, Date.now() - start.current.t);
      const vx = Math.abs(dx) / dt;

      // Spec: horizontal only — vertical swipes do nothing.
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const swipe      = Math.abs(dx) > SWIPE_DISTANCE || vx > SWIPE_VELOCITY;
      if (horizontal && swipe) {
        // Standard mobile gallery convention: finger swipes
        // right-to-left (dx < 0) reveals the NEXT photo from the
        // right; left-to-right (dx > 0) reveals the PREVIOUS.
        if (dx < 0) handleNext();
        else        handlePrev();
      }
    }

    if (mode === 'pinch') {
      if (scale.get() < 1) {
        // Overshoot snap-back. Pan resets too so the photo lands
        // centred at scale 1.
        animate(scale,  1, { duration: DURATION_FAST, ease: EASE_OUT });
        animate(photoX, 0, { duration: DURATION_FAST, ease: EASE_OUT });
        animate(photoY, 0, { duration: DURATION_FAST, ease: EASE_OUT });
      } else if (scale.get() > MAX_SCALE) {
        animate(scale, MAX_SCALE, { duration: DURATION_FAST, ease: EASE_OUT });
      }
    }
    // 'pan' mode: leave the photo wherever the user dragged to.
  };

  const current = photos[index];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-bg select-none touch-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
      // Touch handlers live on the container, not the photo, so a
      // swipe anywhere on the lightbox (including the letterbox
      // black bars top/bottom) navigates. With handlers attached to
      // a 16:9 placeholder on a 375px-wide phone the touch area was
      // only ~211px tall — half the screen — so swipes outside the
      // photo went to dead space.
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/*
        X button — z-[110], on top of image even when zoomed. fixed
        positioning anchors it to the viewport corner regardless of
        the AnimatePresence slide.
      */}
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

      {/*
        Sliding photo container. The outer motion.div owns the slide x
        via variants; the inner motion.div owns the pan/zoom (x, y,
        scale). Two separate elements means the two transforms never
        write to the same node.
      */}
      <AnimatePresence custom={navDir} mode="popLayout" initial={false}>
        <motion.div
          key={index}
          custom={navDir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            style={{ x: photoX, y: photoY, scale }}
            className="w-full aspect-[16/9] bg-fg/10 select-none pointer-events-none"
          >
            {/*
              Placeholder. When real images land, swap for
              <img src={...} className="w-full h-full object-cover" />
              — source should be the same web-optimised file as the
              grid thumbnail, never a higher-res master.
            */}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/*
        Caption — bottom-left, on top of the lower black bar. opacity
        is driven from scale via useTransform so it fades in/out with
        zoom level. pointer-events-none so it never intercepts touch
        on the photo beneath when zoomed.
      */}
      <motion.div
        style={{ opacity: captionOpacity }}
        className="absolute bottom-8 left-6 z-[105] pointer-events-none"
      >
        <p className="text-fg text-sm font-light">{current.title}</p>
        <p className="text-fg/50 text-[10px] tracking-[0.2em] uppercase mt-1">
          {current.location} · {current.date}
        </p>
      </motion.div>
    </motion.div>
  );
}
