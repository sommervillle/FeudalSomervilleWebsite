/*
  AboutBlock — dark slab, three columns: About / Social / Contact.
  Layout matches altcinc.com About section reference.
  max-w-5xl container centres content on ultrawide screens.
*/

import { motion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

const socials = ['Instagram', 'Vimeo', 'YouTube'] as const;

export default function AboutBlock() {
  return (
    <motion.section
      id="about"
      className="bg-bg px-6 md:px-10 pt-32 md:pt-48 pb-32 md:pb-48"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: DURATION_MEDIUM, ease: EASE_OUT }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-16">

          {/* Column 1 — About */}
          <div>
            <p className="text-fg/70 text-lg font-medium leading-none">About</p>
            <p className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">—</p>
            <p className="text-fg/80 text-base font-semibold leading-snug">
              Feudal is a Visual Artist and Director based in the North of
              England. Fifteen years of high-end craft in 3D, motion, and
              post-production. Now combined with AI-augmented pipelines that
              go where the AI studios stop and traditional agencies haven’t
              reached.
            </p>
          </div>

          {/* Column 2 — Social */}
          <div>
            <p className="text-fg/70 text-lg font-medium leading-none">Social</p>
            <p className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">—</p>
            <div className="space-y-3">
              {socials.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="block text-fg/75 text-base font-medium leading-snug hover:text-fg transition-colors duration-200"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <p className="text-fg/70 text-lg font-medium leading-none">Contact</p>
            <p className="text-fg/30 text-lg font-medium mt-3 mb-8 leading-none">—</p>
            <a
              href="mailto:FeudalProtocol@protonmail.com"
              className="block text-fg/75 text-base font-medium leading-snug hover:text-fg transition-colors duration-200 break-all"
            >
              FeudalProtocol@protonmail.com
            </a>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
