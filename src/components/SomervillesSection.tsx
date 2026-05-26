/*
  Somervilles — flagship series section.
  Visually distinct from the work grid: full-width, generous height,
  large display heading, restrained description.
*/

import { motion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

export default function SomervillesSection() {
  return (
    <motion.section
      id="somervilles"
      className="bg-bg border-t border-white/[0.06] px-6 md:px-10 py-32 md:py-48"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: DURATION_MEDIUM, ease: EASE_OUT }}
    >

      <p className="text-muted text-[11px] tracking-[0.28em] uppercase mb-16">
        Ongoing Series
      </p>

      <h2 className="font-display text-fg text-[clamp(3rem,10vw,9rem)] font-light tracking-[-0.03em] leading-none">
        Somervilles
      </h2>

      <p className="text-muted text-sm md:text-base font-light leading-relaxed max-w-sm mt-10">
        A serialised cinematic series exploring a thousand years of family
        history through hybrid 3D and AI production.
      </p>

      <a
        href="#"
        className="inline-block mt-14 text-muted text-[11px] tracking-[0.28em] uppercase hover:text-fg transition-colors duration-200"
      >
        View Series &rarr;
      </a>

    </motion.section>
  );
}
