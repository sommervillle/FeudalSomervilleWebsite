/*
  FooterBlock — dark terminal section.

  Layout:
    - Centred tagline with generous vertical breathing room
    - Three-column bottom bar: Copyright (left) / Email (centre) / Social (right)
*/

import { motion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

export default function FooterBlock() {
  return (
    <motion.footer
      id="footerblock"
      className="bg-bg px-6 md:px-10 pt-28 md:pt-40 pb-10 md:pb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: DURATION_MEDIUM, ease: EASE_OUT }}
    >

      {/* Centred tagline */}
      <div className="text-center mb-28 md:mb-36">
        <p className="text-fg/60 text-sm md:text-[15px] font-light tracking-[0.04em]">
          Always learning. Always building.
        </p>
      </div>

      {/* Three-column bottom bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:items-end gap-6 md:gap-0 border-t border-fg/10 pt-8">

        {/* Copyright — left */}
        <div>
          <p className="text-fg/30 text-[11px] font-light tracking-wide">
            &copy; {new Date().getFullYear()} Feudal Somerville
          </p>
        </div>

        {/* Email — centre */}
        <div className="md:text-center">
          <a
            href="mailto:FeudalProtocol@protonmail.com"
            className="text-fg/45 text-[11px] font-light tracking-wide hover:text-fg transition-colors duration-200"
          >
            FeudalProtocol@protonmail.com
          </a>
        </div>

        {/* Social links — right */}
        <div className="flex gap-7 md:justify-end">
          {socials.map((label) => (
            <a
              key={label}
              href="#"
              className="text-fg/30 text-[11px] font-light tracking-wide hover:text-fg transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

      </div>

    </motion.footer>
  );
}
