/*
  AboutBlock — inverted (white/cream) slab between the work strips and
  the Somervilles section. Three-column grid: About / Social / Contact.
  Mirrors the Alt&Co inverted info block.
*/

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

export default function AboutBlock() {
  return (
    <section
      id="about"
      className="bg-fg px-6 md:px-10 py-24 md:py-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10">

        {/* Column 1 — About */}
        <div>
          <p className="text-bg text-[10px] tracking-[0.28em] uppercase mb-8 font-medium">
            About
          </p>
          <p className="text-bg/65 text-sm font-light leading-loose">
            Feudal Somerville is a director and visual artist working at the
            intersection of high-end 3D craft and AI-augmented production.
            The work sits between cinema and commercial — authored, not
            assembled.
          </p>
        </div>

        {/* Column 2 — Social */}
        <div>
          <p className="text-bg text-[10px] tracking-[0.28em] uppercase mb-8 font-medium">
            Social
          </p>
          <div className="space-y-4">
            {socials.map((label) => (
              <a
                key={label}
                href="#"
                className="block text-bg/55 text-sm font-light hover:text-bg transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <p className="text-bg text-[10px] tracking-[0.28em] uppercase mb-8 font-medium">
            Contact
          </p>
          <a
            href="mailto:FeudalProtocol@protonmail.com"
            className="block text-bg/55 text-sm font-light hover:text-bg transition-colors duration-200 break-all"
          >
            FeudalProtocol@protonmail.com
          </a>
        </div>

      </div>
    </section>
  );
}
