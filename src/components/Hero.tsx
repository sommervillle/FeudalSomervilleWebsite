/*
  Hero — full-viewport section, ready to host a <video> element.
  CTA button bottom-left; chevron centred at bottom.
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

      {/* Vignette — legibility over future video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

      {/* ── VIEW THE SHOWREEL — bottom-left ── */}
      <div className="absolute bottom-[100px] left-[100px] z-10">
        <a
          href="#work"
          className="inline-flex items-center justify-center px-9 py-[11px] border border-fg/30 text-fg/80 text-[10px] tracking-[0.35em] uppercase font-light hover:border-fg/60 hover:text-fg hover:bg-fg/[0.04] transition-all duration-300"
        >
          View the Showreel
        </a>
      </div>

      {/* ── Chevron down — bottom-centre ── */}
      <button
        onClick={() => {
          const target = document.getElementById('about');
          if (!target) return;
          // Park the cream section's top edge right at the header bottom
          // so there's no dark band between the header and the "About"
          // heading. The cream is clipped by the fixed header for the
          // top ~30px; visible cream starts immediately below the header.
          const y = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }}
        aria-label="Scroll to next section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 p-3 text-fg/35 hover:text-fg/65 transition-opacity duration-300"
      >
        <svg width="16" height="9" viewBox="0 0 16 9" fill="none" aria-hidden="true">
          <path
            d="M1 1L8 8L15 1"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

    </section>
  );
}
