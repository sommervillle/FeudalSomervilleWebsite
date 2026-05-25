/*
  Hero — full-viewport section, ready to host a <video> element.
  Centered content: tagline + thin-bordered showreel CTA.
  Down-chevron replaces the old "SCROLL" text indicator.
  No name/subtitle in this section — identity lives in the fixed nav logo.
*/
export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-[#0e0e0e]">

      {/* ── Video placeholder ─────────────────────────────────────────────
          Swap this div for:
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted loop playsInline
              src="https://…/showreel.mp4"
            />
          The vignette divs below sit on top of it in both cases.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[#0e0e0e]" />

      {/* Vignette layers — ensure legibility over any future video content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

      {/* ── Centered hero content ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center">

        <p className="text-fg/75 text-[13px] md:text-sm font-light tracking-[0.06em] leading-relaxed max-w-xs md:max-w-sm">
          A serialised exploration of family, history, and motion
        </p>

        <a
          href="#work"
          className="mt-9 inline-flex items-center justify-center px-9 py-[11px] border border-fg/30 text-fg/80 text-[10px] tracking-[0.35em] uppercase font-light hover:border-fg/60 hover:text-fg hover:bg-fg/[0.04] transition-all duration-300"
        >
          View the Showreel
        </a>

      </div>

      {/* ── Chevron down — bottom-centre ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          aria-hidden="true"
          className="text-fg/35"
        >
          <path
            d="M1 1L8 8L15 1"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    </section>
  );
}
