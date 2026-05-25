/*
  Work grid — full-bleed, 1-px gaps between tiles, no section label.
  Tiles are placeholder until real video assets land.
  Hover: subtle dark overlay + project title slides up.
*/

// Slightly varied dark tones so tiles read as distinct at a glance.
const TILE_SHADES = [
  '#111111', '#0f0f0f', '#131313',
  '#121212', '#101010', '#141414',
];

export default function WorkGrid() {
  return (
    <section id="work" className="bg-bg">

      {/*
        gap-px + bg-white/[0.04] creates a hairline separator between tiles
        without a visible border — the gap exposes the container background.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
        {TILE_SHADES.map((shade, i) => (
          <article
            key={i}
            className="relative aspect-video overflow-hidden group cursor-pointer"
            style={{ backgroundColor: shade }}
          >

            {/* Subtle zoom on hover — mimics video-thumbnail lift */}
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ backgroundColor: shade }}
            />

            {/* Dark overlay fades in on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Title + meta — slide up on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <p className="text-fg text-sm font-light tracking-wide leading-none">
                Project Title
              </p>
              <p className="text-muted text-[10px] tracking-[0.22em] uppercase mt-2">
                Year &mdash; Category
              </p>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
