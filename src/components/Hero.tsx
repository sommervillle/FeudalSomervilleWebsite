export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-bg">

      {/* ── Video placeholder ── */}
      {/*
        Replace this div with a <video autoPlay muted loop playsInline>
        once the showreel is available.
      */}
      <div className="absolute inset-0 bg-[#0e0e0e]">
        {/* Vignette — helps text read against any future video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* ── Name + role — bottom-left ── */}
      <div className="absolute bottom-10 left-6 md:left-10 z-10">
        <h1 className="font-display text-fg text-[clamp(2rem,6vw,5rem)] font-light tracking-[-0.02em] leading-none">
          Feudal Somerville
        </h1>
        <p className="text-muted text-[11px] tracking-[0.28em] uppercase mt-4 font-sans">
          Director &amp; Visual Artist
        </p>
      </div>

      {/* ── Scroll nudge — bottom-centre, desktop only ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-muted/60 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted/40 to-transparent" />
      </div>

    </section>
  );
}
