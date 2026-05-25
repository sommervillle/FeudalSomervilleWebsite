/*
  AboutBlock — cream slab, three columns: About / Social / Contact.
  Layout matches altcinc.com About section reference.
*/

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

export default function AboutBlock() {
  return (
    <section
      id="about"
      className="bg-fg px-6 md:px-10 pt-48 md:pt-64 pb-24 md:pb-32"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10">

        {/* Column 1 — About */}
        <div>
          <p className="text-bg/60 text-base font-medium">About</p>
          <p className="text-bg/60 text-base font-medium mt-1 mb-6">-</p>
          <p className="text-bg/70 text-sm font-medium leading-snug">
            Feudal Somerville is a director and visual artist working at the
            intersection of high-end 3D craft and AI-augmented production.
            The work sits between cinema and commercial — authored, not
            assembled.
          </p>
        </div>

        {/* Column 2 — Social */}
        <div>
          <p className="text-bg/60 text-base font-medium">Social</p>
          <p className="text-bg/60 text-base font-medium mt-1 mb-6">-</p>
          <div className="space-y-3">
            {socials.map((label) => (
              <a
                key={label}
                href="#"
                className="block text-bg/70 text-sm font-medium leading-snug hover:text-bg transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <p className="text-bg/60 text-base font-medium">Contact</p>
          <p className="text-bg/60 text-base font-medium mt-1 mb-6">-</p>
          <a
            href="mailto:FeudalProtocol@protonmail.com"
            className="block text-bg/70 text-sm font-medium leading-snug hover:text-bg transition-colors duration-200 break-all"
          >
            FeudalProtocol@protonmail.com
          </a>
        </div>

      </div>
    </section>
  );
}
