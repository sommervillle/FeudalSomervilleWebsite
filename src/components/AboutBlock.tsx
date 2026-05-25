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
          <p className="text-bg/60 text-lg font-medium leading-none">About</p>
          <p className="text-bg/60 text-lg font-medium mt-2 mb-6 leading-none">-</p>
          <p className="text-bg/75 text-sm font-medium leading-tight">
            Feudal is a director and visual artist based in the North of
            England. A Mill alumnus, working at the intersection of high-end
            3D craft and AI-augmented production, blending traditional cinema
            with commercial pipelines.
          </p>
        </div>

        {/* Column 2 — Social */}
        <div>
          <p className="text-bg/60 text-lg font-medium leading-none">Social</p>
          <p className="text-bg/60 text-lg font-medium mt-2 mb-6 leading-none">-</p>
          <div className="space-y-3">
            {socials.map((label) => (
              <a
                key={label}
                href="#"
                className="block text-bg/75 text-sm font-medium leading-tight hover:text-bg transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <p className="text-bg/60 text-lg font-medium leading-none">Contact</p>
          <p className="text-bg/60 text-lg font-medium mt-2 mb-6 leading-none">-</p>
          <a
            href="mailto:FeudalProtocol@protonmail.com"
            className="block text-bg/75 text-sm font-medium leading-tight hover:text-bg transition-colors duration-200 break-all"
          >
            FeudalProtocol@protonmail.com
          </a>
        </div>

      </div>
    </section>
  );
}
