/*
  WorkGrid — full-bleed horizontal strips, one per project.
  Each strip is 75vh tall — roughly three visible at once when scrolled
  to the middle of any strip (bottom of prev, full current, top of next).
  Hover: dark overlay + title/meta slide up from bottom-left.

  Placeholder background: MonogramSkeleton (matches the Photo grid
  loading style). When real video thumbnails land, the skeleton will
  be swapped for a <video> element inside the same article.
*/

import { motion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';
import MonogramSkeleton from './MonogramSkeleton';

// Alternating tile surfaces. Both are darker than the page bg
// (#0A0A0A) so the strips read as set INTO the page rather than
// floating above it. Difference between the two is small on
// purpose — a quiet rhythm down the grid, not zebra stripes.
// Index 0 (1st tile) is the darker shade.
const SHADE_ODD  = '#070707';
const SHADE_EVEN = '#080808';

const STRIPS = [
  { title: 'Project Title', meta: '2024 — Personal'    },
  { title: 'Project Title', meta: '2023 — Commercial'  },
  { title: 'Project Title', meta: '2023 — Personal'    },
  { title: 'Project Title', meta: '2022 — Commercial'  },
  { title: 'Project Title', meta: '2022 — Somervilles' },
];

export default function WorkGrid() {
  return (
    <motion.section
      id="work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: DURATION_MEDIUM, ease: EASE_OUT }}
    >
      {STRIPS.map(({ title, meta }, i) => (
        <article
          key={i}
          className="relative w-full overflow-hidden group cursor-pointer aspect-[16/9] md:aspect-auto md:h-[75vh]"
          style={{ backgroundColor: i % 2 === 0 ? SHADE_ODD : SHADE_EVEN }}
        >
          {/*
            Skeleton placeholder — pulses, respects reduced motion.
            Keeps the subtle group-hover zoom from the original
            backing div so the "video lift" feel is preserved for
            when the real thumbnails drop in here.
          */}
          <MonogramSkeleton className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]" />

          {/* Dark scrim — visible on hover, sits above the skeleton
              so the title/meta below read cleanly on top. */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Title + meta — slide up from bottom-left on hover */}
          <div className="absolute bottom-0 left-0 px-8 md:px-10 py-8 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <p className="text-fg text-xl md:text-2xl font-light tracking-[-0.01em] leading-none">
              {title}
            </p>
            <p className="text-muted text-[10px] tracking-[0.25em] uppercase mt-3">
              {meta}
            </p>
          </div>
        </article>
      ))}
    </motion.section>
  );
}
