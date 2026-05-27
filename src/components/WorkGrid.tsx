/*
  WorkGrid — full-bleed horizontal strips, one per project.
  Each strip is 75vh tall — roughly three visible at once when scrolled
  to the middle of any strip (bottom of prev, full current, top of next).
  Hover: dark overlay + title/meta slide up from bottom-left.
*/

import { motion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

const STRIPS = [
  { shade: '#111111', title: 'Project Title', meta: '2024 — Personal'    },
  { shade: '#0f0f0f', title: 'Project Title', meta: '2023 — Commercial'  },
  { shade: '#131313', title: 'Project Title', meta: '2023 — Personal'    },
  { shade: '#101010', title: 'Project Title', meta: '2022 — Commercial'  },
  { shade: '#121212', title: 'Project Title', meta: '2022 — Somervilles' },
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
      {STRIPS.map(({ shade, title, meta }, i) => (
        <article
          key={i}
          className="relative w-full overflow-hidden group cursor-pointer aspect-[16/9] md:aspect-auto md:h-[75vh]"
          style={{ backgroundColor: shade }}
        >
          {/* Placeholder bg — subtle zoom on hover mimics video lift */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            style={{ backgroundColor: shade }}
          />

          {/* Dark scrim */}
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
