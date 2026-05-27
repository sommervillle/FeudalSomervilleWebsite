/*
  Photo — personal photography page.

  Matches /info's container, label, and dash treatment so all
  secondary pages share one visual system.

  Mobile (< md): below the "Photography" heading, an edge-to-edge
  3-column grid of 24 square placeholder cells. `-mx-6` on the
  grid breaks out of the section's px-6 gutter so the cells touch
  the viewport edges.

  Desktop (md+): unchanged placeholder — "A selection of personal
  photography. Coming soon." in muted text inside the right-hand
  2/3 column.
*/

const PLACEHOLDER_COUNT = 24;

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

          {/* Content column. */}
          <div className="md:col-span-2">

            {/* Desktop placeholder — muted coming-soon line. */}
            <p className="hidden md:block text-muted text-base font-light leading-snug max-w-2xl">
              A selection of personal photography. Coming soon.
            </p>

            {/*
              Mobile placeholder grid. -mx-6 cancels the section's
              px-6 gutter so the grid runs to the viewport edges.
              aspect-square keeps cells square regardless of future
              source-image aspect ratios.
            */}
            <div className="md:hidden -mx-6 grid grid-cols-3 gap-px">
              {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                <div key={i} className="aspect-square bg-fg/10" />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
