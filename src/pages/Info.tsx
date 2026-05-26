/*
  Info — dark slab, mirrors AboutBlock's container and label-style
  (column label, dash divider, content) so it reads as part of the
  same visual system.

  Structure:
    1. Biography          — eyebrow / large heading / paragraph
    2. Services           — label / dash / vertical list
    3. Connect            — label / dash / contact paragraph
    4. Selected Clients   — label / dash / placeholder
*/

const services = [
  'Creative Direction',
  'Art Direction',
  '3D',
  'Motion Design',
  'VFX',
  'Animation',
  'Director',
] as const;

// Two-column row: narrow label column (matches AboutBlock's first
// column width on the 3-col grid), wide content column.
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
      <div className="md:col-span-1">
        <p className="text-fg/70 text-lg font-medium leading-none">{label}</p>
        <p className="text-fg/30 text-lg font-medium mt-3 leading-none">—</p>
      </div>
      <div className="md:col-span-2">
        {children}
      </div>
    </div>
  );
}

export default function Info() {
  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-40 md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-24 md:space-y-32">

          {/* 1. Biography — full-width, large heading. First section. */}
          <div>
            <p className="text-fg/40 text-[11px] tracking-[0.28em] uppercase mb-6">
              Feudal Somerville
            </p>
            <h2 className="text-fg text-4xl md:text-6xl font-medium tracking-[-0.02em] leading-none mb-10">
              Biography
            </h2>
            <p className="text-fg/80 text-base font-semibold leading-snug max-w-2xl">
              Full biography coming soon. Feudal is a director and visual
              artist based in the North of England. A Mill alumnus,
              working at the intersection of high-end 3D craft and
              AI-augmented production, blending traditional cinema with
              commercial pipelines.
            </p>
          </div>

          {/* 2. Services */}
          <Row label="Services">
            <ul className="space-y-2">
              {services.map((s) => (
                <li
                  key={s}
                  className="text-fg/80 text-base font-semibold leading-snug"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Row>

          {/* 3. Connect */}
          <Row label="Connect">
            <p className="text-fg/80 text-base font-semibold leading-snug">
              If you have a scheduling inquiry or wish to chat about an
              upcoming project, please contact me at{' '}
              <a
                href="mailto:FeudalProtocol@protonmail.com"
                className="underline underline-offset-4 decoration-fg/30 hover:decoration-fg/80 transition-colors duration-200"
              >
                FeudalProtocol@protonmail.com
              </a>
            </p>
          </Row>

          {/* 4. Selected Clients */}
          <Row label="Selected Clients">
            <p className="text-fg/80 text-base font-semibold leading-snug">
              Client list coming soon.
            </p>
          </Row>

        </div>
      </div>
    </section>
  );
}
