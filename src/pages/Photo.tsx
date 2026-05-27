/*
  Photo — placeholder page for personal photography.

  Matches /info: same dark slab, same max-w-5xl container, same
  Row treatment (1/3 label + dash // 2/3 content) so all secondary
  pages read as part of one visual system.
*/
export default function Photo() {
  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-40 md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">

          {/* Label + dash — matches the Row component on /info. */}
          <div className="md:col-span-1">
            <p className="text-fg/70 text-lg font-medium leading-none">Photography</p>
            <p className="text-fg/30 text-lg font-medium mt-3 leading-none">—</p>
          </div>

          {/* Placeholder body — muted to signal coming-soon state. */}
          <div className="md:col-span-2">
            <p className="text-muted text-base font-light leading-snug max-w-2xl">
              A selection of personal photography. Coming soon.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
