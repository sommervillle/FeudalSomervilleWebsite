import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

/*
  Info — dark slab, mirrors AboutBlock's container and label-style
  (column label, dash divider, content) so it reads as part of the
  same visual system.

  Structure:
    1. Biography          — eyebrow / large heading / paragraph
    2. Selected Clients   — label / dash / placeholder
    3. Services           — label / dash / vertical list
    4. Connect            — label / dash / contact paragraph

  First-load cascade:
    Every visible text element fades in opacity 0->1 + y 10->0 on
    EASE_OUT / DURATION_MEDIUM, staggered 50ms apart in DOM source
    order (which matches the visual top->bottom reading order on
    the inlined layout).

    The cascade runs once per browser session — a module-level
    `hasPlayedCascade` flag survives component unmount/remount
    (e.g. navigating away and back) but resets on a full page
    reload. useState's initialiser snapshots the decision at first
    mount so a later flip of the module flag never replays the
    animation on this instance.

    Reduced-motion users skip the cascade entirely: `cascade()`
    returns an empty props object so the motion elements render
    at their natural opacity:1 / y:0 with no initial/animate.
*/

// Module-level — persists across remounts within the same browser session.
let hasPlayedCascade = false;

const CASCADE_STEP = 0.05;

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

export default function Info() {
  const reduceMotion = useReducedMotion() ?? false;
  // Snapshot at first render — immutable for this mount.
  const [animateThisMount] = useState(
    () => !hasPlayedCascade && !reduceMotion,
  );

  useEffect(() => {
    if (animateThisMount) hasPlayedCascade = true;
  }, [animateThisMount]);

  // Cascade counter — resets each render, increments per call in
  // JSX source order. JS evaluates JSX children left-to-right /
  // top-to-bottom, so each cascade() call gets a monotonically
  // increasing index matching the reading order of the inlined
  // sections.
  let idx = 0;
  const cascade = () => {
    if (!animateThisMount) return {};
    const i = idx++;
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay: i * CASCADE_STEP,
        duration: DURATION_MEDIUM,
        ease: EASE_OUT,
      },
    };
  };

  return (
    <section className="bg-bg min-h-screen px-6 md:px-10 pt-40 md:pt-48 pb-32 md:pb-48">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-24 md:space-y-32">

          {/* 1. Biography */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
            <div className="md:col-span-1">
              <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
                Biography
              </motion.p>
              <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 leading-none">
                —
              </motion.p>
            </div>
            <div className="md:col-span-2">
              <motion.p {...cascade()} className="text-fg/80 text-base font-semibold leading-snug max-w-2xl">
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
              </motion.p>
            </div>
          </div>

          {/* 2. Selected Clients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
            <div className="md:col-span-1">
              <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
                Selected Clients
              </motion.p>
              <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 leading-none">
                —
              </motion.p>
            </div>
            <div className="md:col-span-2">
              <ul className="space-y-2">
                {clients.map((c) => (
                  <motion.li
                    key={c}
                    {...cascade()}
                    className="text-fg/80 text-base font-semibold leading-snug"
                  >
                    {c}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
            <div className="md:col-span-1">
              <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
                Services
              </motion.p>
              <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 leading-none">
                —
              </motion.p>
            </div>
            <div className="md:col-span-2">
              <ul className="space-y-2">
                {services.map((s) => (
                  <motion.li
                    key={s}
                    {...cascade()}
                    className="text-fg/80 text-base font-semibold leading-snug"
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Connect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16">
            <div className="md:col-span-1">
              <motion.p {...cascade()} className="text-fg/70 text-lg font-medium leading-none">
                Connect
              </motion.p>
              <motion.p {...cascade()} className="text-fg/30 text-lg font-medium mt-3 leading-none">
                —
              </motion.p>
            </div>
            <div className="md:col-span-2">
              <motion.p {...cascade()} className="text-fg/80 text-base font-semibold leading-snug">
                If you have a scheduling inquiry or wish to chat about an
                upcoming project, please contact me at{' '}
                <a
                  href="mailto:FeudalProtocol@protonmail.com"
                  className="underline underline-offset-4 decoration-fg/30 hover:decoration-fg/80 transition-colors duration-200"
                >
                  FeudalProtocol@protonmail.com
                </a>
              </motion.p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
