import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT } from '../motion';
import Lightbox, { type PhotoData } from '../components/Lightbox';
import MonogramSkeleton from '../components/MonogramSkeleton';

/*
  Photo — personal photography page.

  Desktop (md+): single placeholder line.
  Mobile (< md): edge-to-edge 3-column grid of square placeholders.

  PHOTOS holds the per-photo data (title / location / date) that
  feeds the lightbox caption. For now it's auto-generated placeholder
  text so the lightbox UI has something to render; real entries
  replace the array later.

  Two behaviours on the grid:
    1. Lightbox        — tap a cell to open the fullscreen viewer.
    2. Cascade reveal  — first mount stagger, 30ms per cell,
                          opacity 0->1 and y 10->0 on EASE_OUT.
*/

const CASCADE_STEP = 0.03;

// Checkerboard shades — same near-blacks as WorkGrid's alternating
// tiles. Cell is "dark" when (row + col) is even, "light" otherwise.
// Both are darker than (or equal to) the page bg so cells read as
// set into the page rather than floating above it.
const SHADE_DARK  = '#090909';
const SHADE_LIGHT = '#0A0A0A';

const PHOTOS: readonly PhotoData[] = Array.from({ length: 24 }).map((_, i) => ({
  title:    `Photograph ${i + 1}`,
  location: 'Location',
  date:     'Date',
}));

export default function Photo() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-[120px] md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">

        <p className="hidden md:block text-muted text-base font-light leading-snug max-w-2xl">
          A selection of personal photography. Coming soon.
        </p>

        {/*
          Mobile grid. -mx-6 cancels the section's px-6 gutter so
          the cells run edge-to-edge. Each cell is a MonogramSkeleton
          standing in as a loading placeholder for the future image;
          the wrapping motion.div owns the cascade reveal and click.

          Diagonal pulse ripple: each cell's skeleton delay is
          (row + col) * 0.15s, so the top-left cell starts at 0,
          the next anti-diagonal (1 cell) at 0.15s, then 0.30s,
          0.45s, ... across the grid.
        */}
        <div className="md:hidden -mx-6 grid grid-cols-3 gap-px">
          {PHOTOS.map((_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const isDark = (row + col) % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * CASCADE_STEP,
                  duration: 0.4,
                  ease: EASE_OUT,
                }}
                className="aspect-square cursor-pointer"
                style={{ backgroundColor: isDark ? SHADE_DARK : SHADE_LIGHT }}
                onClick={() => setLightboxIndex(i)}
              >
                <MonogramSkeleton
                  delay={(row + col) * 0.15}
                  className="w-full h-full"
                />
              </motion.div>
            );
          })}
        </div>

      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={PHOTOS}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() =>
              setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
            }
            onNext={() =>
              setLightboxIndex((i) =>
                i !== null && i < PHOTOS.length - 1 ? i + 1 : i,
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
