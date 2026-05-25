/*
  Footer — dark. Email, social links, closing LogoMark bottom-right.
  The floating back-to-top button lives in App.tsx (fixed position).
*/
import LogoMark from './LogoMark';

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-bg border-t border-white/[0.06] px-6 md:px-10 py-24 md:py-32"
    >

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-16">

        {/* Contact + socials */}
        <div className="space-y-10">
          <a
            href="mailto:FeudalProtocol@protonmail.com"
            className="block text-fg text-sm font-light tracking-wide hover:text-muted transition-colors duration-200"
          >
            FeudalProtocol@protonmail.com
          </a>

          <div className="flex gap-8">
            {socials.map((label) => (
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

        {/* Closing mark — bottom-right */}
        <div className="self-end md:self-auto text-fg opacity-20 hover:opacity-40 transition-opacity duration-300">
          <LogoMark size={28} />
        </div>

      </div>

    </footer>
  );
}
