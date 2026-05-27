/*
  Info — dark slab, mirrors AboutBlock's container and label-style
  (column label, dash divider, content) so it reads as part of the
  same visual system.

  Structure:
    1. Biography          — eyebrow / large heading / paragraph
    2. Selected Clients   — label / dash / placeholder
    3. Services           — label / dash / vertical list
    4. Connect            — label / dash / contact paragraph
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

const clients = [
  'Nike',
  'Adidas',
  'Coca-Cola',
  'Guinness',
  'Ford',
  'Jaguar',
  'Honda',
  'HP',
  'Miro',
  'Monotype',
  'Pringles',
  'MrBeast / Feastables',
  'The King’s Trust',
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

          {/* 1. Biography — same Row treatment as the other sections. */}
          <Row label="Biography">
            <p className="text-fg/80 text-base font-semibold leading-snug max-w-2xl">
              A visual artist and director with a lifelong interest in
              history, Feudal began his career as a teenage intern at VTR
              North and Golden in Leeds, small post houses where the
              artists and producers took him on and taught him the craft.
              At seventeen he travelled to the USA to freelance for UVPH
              and The Mill+ in New York. More senior roles followed at
              Social, The Mill+, ForPeople, Kenyon Weston, and Heckler.
              He now works independently, building a hybrid pipeline that
              combines traditional post-production craft with AI-augmented
              workflows.
            </p>
          </Row>

          {/* 2. Selected Clients */}
          <Row label="Selected Clients">
            <ul className="space-y-2">
              {clients.map((c) => (
                <li
                  key={c}
                  className="text-fg/80 text-base font-semibold leading-snug"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Row>

          {/* 3. Services */}
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

          {/* 4. Connect */}
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

        </div>
      </div>
    </section>
  );
}
