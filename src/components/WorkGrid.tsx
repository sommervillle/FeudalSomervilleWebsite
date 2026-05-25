export default function WorkGrid() {
  return (
    <section id="work" className="bg-bg px-6 py-24">
      <h2 className="text-muted text-xs tracking-widest uppercase mb-12">Selected Work</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative aspect-video bg-neutral-900 flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">Placeholder</span>
          </div>
        ))}
      </div>
    </section>
  );
}
