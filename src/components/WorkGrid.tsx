/*
  WorkGrid — full-bleed horizontal strips, one per project.
  Each strip is 75vh tall — roughly three visible at once when scrolled
  to the middle of any strip (bottom of prev, full current, top of next).
  A 12px cream (bg-fg) bar sits between every pair of adjacent strips —
  acts as a visual separator without breaking the continuous vertical scroll.
  Hover: dark overlay + title/meta slide up from bottom-left.
*/

import { Fragment } from 'react';

const STRIPS = [
  { shade: '#111111', title: 'Project Title', meta: '2024 — Personal'    },
  { shade: '#0f0f0f', title: 'Project Title', meta: '2023 — Commercial'  },
  { shade: '#131313', title: 'Project Title', meta: '2023 — Personal'    },
  { shade: '#101010', title: 'Project Title', meta: '2022 — Commercial'  },
  { shade: '#121212', title: 'Project Title', meta: '2022 — Somervilles' },
];

export default function WorkGrid() {
  return (
    <section id="work">
      {STRIPS.map(({ shade, title, meta }, i) => (
        <Fragment key={i}>

          <article
            className="relative w-full overflow-hidden group cursor-pointer"
            style={{ height: '75vh', backgroundColor: shade }}
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

          {/* Cream separator bar — between strips only, not after the last */}
          {i < STRIPS.length - 1 && (
            <div className="w-full bg-fg" style={{ height: '12px' }} />
          )}

        </Fragment>
      ))}
    </section>
  );
}
