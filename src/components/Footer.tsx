/*
  Footer — contact only. Email as mailto, minimal social links, closing monogram.
  No CTAs, no marketing, no services.
*/
export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-bg border-t border-white/[0.06] px-6 md:px-10 py-24 md:py-32 flex flex-col md:flex-row md:items-end md:justify-between gap-16"
    >

      {/* Contact + socials */}
      <div className="space-y-10">
        <a
          href="mailto:FeudalProtocol@protonmail.com"
          className="block text-fg text-sm font-light tracking-wide hover:text-muted transition-colors duration-200"
        >
          FeudalProtocol@protonmail.com
        </a>

        <div className="flex gap-8">
          {(['Instagram', 'Vimeo', 'YouTube'] as const).map((label) => (
            <a
              key={label}
              href="#"
              className="text-muted text-[11px] tracking-[0.22em] uppercase hover:text-fg transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Closing monogram */}
      <div className="self-end md:self-auto">
        <img
          src="/assets/monogram.svg"
          alt=""
          width={28}
          height={28}
          className="opacity-20"
        />
      </div>

    </footer>
  );
}
