import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT } from '../motion';
import Lightbox from '../components/Lightbox';

/*
  Photo — personal photography page.

  Desktop (md+): single placeholder line.
  Mobile (< md): edge-to-edge 3-column grid of 24 square placeholders.

  No section heading on this page. The grid is the page; thumbnails
  start immediately below the header.

  Two behaviours on the grid:
    1. Lightbox        — tap a cell to open the fullscreen viewer.
    2. Cascade reveal  — first mount stagger, 30ms per cell,
                          opacity 0->1 and y 10->0 on EASE_OUT.
*/

const PLACEHOLDER_COUNT = 24;
const CASCADE_STEP = 0.03;

export default function Photo() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-40 md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">

        {/* Desktop placeholder — unchanged. */}
        <p className="hidden md:block text-muted text-base font-light leading-snug max-w-2xl">
          A selection of personal photography. Coming soon.
        </p>

        {/*
          Mobile grid. -mx-6 cancels the section's px-6 gutter so
          the cells run edge-to-edge.
        */}
        <div className="md:hidden -mx-6 grid grid-cols-3 gap-px">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * CASCADE_STEP,
                duration: 0.4,
                ease: EASE_OUT,
              }}
              className="aspect-square bg-fg/10 cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            />
          ))}
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
