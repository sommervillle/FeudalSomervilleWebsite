export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen bg-bg flex items-end">
      <div className="absolute top-6 left-6">
        <img src="/assets/monogram.svg" alt="Feudal Somerville" width={40} height={40} className="opacity-90" />
      </div>

      <div className="p-8 pb-12">
        <h1 className="text-fg text-5xl font-light tracking-tight leading-none">
          Feudal Somerville
        </h1>
        <p className="text-muted text-sm mt-3 tracking-widest uppercase">
          Director &amp; Visual Artist
        </p>
      </div>
    </section>
  );
}
