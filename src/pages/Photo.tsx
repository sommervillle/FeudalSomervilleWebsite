import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { DURATION_FAST, EASE_OUT } from '../motion';
import Lightbox from '../components/Lightbox';

/*
  Photo — personal photography page.

  Desktop (md+): single placeholder line in the right-hand column —
  unchanged from the prior scaffold.

  Mobile (< md): edge-to-edge 3-column grid of 24 square placeholders
  with four behaviours layered on:
    1. Lightbox             — tap a cell to open the fullscreen viewer.
    2. Long-press info      — hold a cell ~500ms to fade in a
                               'Location · Date · Caption' overlay; lift
                               to dismiss. Grid-only — the Lightbox does
                               not get this overlay.
    3. Parallax             — alternate rows scroll at 0.97x / 1.03x of
                               page scroll (via useScroll + useTransform
                               which framer-motion rAF-batches internally).
    4. Cascade reveal       — first mount stagger, 30ms per cell, opacity
                               0->1 and y 10->0.

  The reveal y and the parallax y are on SEPARATE elements (inner
  visual vs outer wrapper) so they never write to the same transform.

  useReducedMotion gates the parallax to 0 so reduced-motion users
  get a static grid. The cascade's transform is auto-disabled by
  MotionConfig reducedMotion="user" (transforms suppressed, opacity
  still animates).
*/

const PLACEHOLDER_COUNT = 24;
const PARALLAX_RATIO = 0.03;
const CASCADE_STEP = 0.03;
const LONG_PRESS_MS = 500;

export default function Photo() {
  const reduceMotion = useReducedMotion() ?? false;

  // Parallax sources.
  const { scrollY } = useScroll();
  const slowY = useTransform(scrollY, (v) =>
    reduceMotion ? 0 : v * PARALLAX_RATIO,
  );
  const fastY = useTransform(scrollY, (v) =>
    reduceMotion ? 0 : -v * PARALLAX_RATIO,
  );

  const [lightboxIndex,    setLightboxIndex]    = useState<number | null>(null);
  const [longPressedCell,  setLongPressedCell]  = useState<number | null>(null);

  // Refs to bridge async long-press timer with the click-suppression check.
  const pressTimer  = useRef<number | null>(null);
  const longPressed = useRef(false);

  const startLongPress = (i: number) => {
    longPressed.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      setLongPressedCell(i);
    }, LONG_PRESS_MS);
  };

  const endLongPress = () => {
    if (pressTimer.current !== null) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setLongPressedCell(null);
  };

  const onCellClick = (i: number) => {
    // If the 500ms long-press fired, suppress the trailing click so a
    // long-press never opens the lightbox.
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    setLightboxIndex(i);
  };

  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-40 md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">

          {/* Label + dash */}
          <div className="md:col-span-1">
            <p className="text-fg/70 text-lg font-medium leading-none">Photography</p>
            <p className="text-fg/30 text-lg font-medium mt-3 leading-none">—</p>
          </div>

          {/* Content column */}
          <div className="md:col-span-2">

            {/* Desktop placeholder — unchanged. */}
            <p className="hidden md:block text-muted text-base font-light leading-snug max-w-2xl">
              A selection of personal photography. Coming soon.
            </p>

            {/*
              Mobile grid. -mx-6 cancels the section's px-6 gutter so
              the cells run edge-to-edge. aspect-square keeps the cells
              square regardless of future source aspect ratios.
            */}
            <div className="md:hidden -mx-6 grid grid-cols-3 gap-px">
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => {
                const row = Math.floor(i / 3);
                const parallaxY = row % 2 === 0 ? slowY : fastY;

                return (
                  <motion.div
                    key={i}
                    style={{ y: parallaxY }}
                    className="relative aspect-square"
                  >
                    {/*
                      Inner visual + interaction surface. The cascade
                      reveal animates y here; the parent owns parallax
                      y. Two elements = two y transforms = no fight.
                    */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: i * CASCADE_STEP,
                        duration: 0.4,
                        ease: EASE_OUT,
                      }}
                      className="absolute inset-0 bg-fg/10 cursor-pointer"
                      onPointerDown={() => startLongPress(i)}
                      onPointerUp={endLongPress}
                      onPointerLeave={endLongPress}
                      onPointerCancel={endLongPress}
                      onClick={() => onCellClick(i)}
                    />

                    {/*
                      Long-press info overlay — grid only. pointer-events-
                      none so the finger continues to interact with the
                      cell beneath (so onPointerUp/Leave still fire on
                      the visual).
                    */}
                    <AnimatePresence>
                      {longPressedCell === i && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
                          className="absolute inset-0 bg-bg/85 flex items-center justify-center pointer-events-none"
                        >
                          <p className="text-fg/80 text-[10px] text-center px-2">
                            Location · Date · Caption
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox — full-viewport overlay above page chrome. */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() =>
              setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
            }
            onNext={() =>
              setLightboxIndex((i) =>
                i !== null && i < PLACEHOLDER_COUNT - 1 ? i + 1 : i,
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
