/*
  Info — placeholder page. Cream full-viewport background, centred
  text. Real bio / credits / client list lands in a follow-up.
  pt-32 leaves space for the fixed header to sit above the content
  without overlapping the "Info" heading.
*/
export default function Info() {
  return (
    <section className="bg-fg min-h-screen px-6 md:px-10 pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-xl text-center">
        <h1 className="text-bg text-5xl md:text-6xl font-light tracking-[-0.02em]">
          Info
        </h1>
        <p className="text-bg/60 text-base md:text-lg font-light leading-relaxed mt-8">
          Full bio, credits, and client list coming soon.
        </p>
      </div>
    </section>
  );
}
