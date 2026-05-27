import { motion, useReducedMotion } from 'framer-motion';
import { DURATION_MEDIUM, EASE_OUT } from '../motion';

/*
  Info — dark slab, mirrors AboutBlock's container and label-style
  (column label, dash divider, content) so it reads as part of the
  same visual system.

  Structure:
    1. Biography          — label / dash / 4 sentences (each cascades)
    2. Selected Clients   — label / dash / 13 items
    3. Services           — label / dash / 7 items
    4. Connect            — label / dash / contact paragraph

  Cascade behaviour:
    - Plays on every entry to the page. The previous once-per-session
      gate was removed; React already remounts the Info component on
      each navigation (the AnimatePresence in App.tsx is keyed on
      location.pathname), so dropping the module-level flag is all
      that's needed to make the animation re-fire.
    - Block-level elements (labels, dashes, list items, body paragraphs)
      animate opacity 0->1 + y 10->0.
    - Inline elements (the four bio sentences) use position: relative +
      top 10->0 instead of translateY, because CSS transforms don't
      apply to inline non-replaced elements. The visual effect is the
      same — a 10px rise — but the elements stay in normal text flow
      so the paragraph wraps as a single continuous block.
    - Reduced-motion users skip the animation entirely: cascade()
      returns {} so motion elements render at their natural visible
      state with no initial / animate / transition.
*/

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

// Bio split sentence-by-sentence. Each sentence is its own cascade
// step; together they still flow as one paragraph (each is a span,
// joined by a literal space).
const bioSentences = [
  'A visual artist and director with a lifelong interest in history, Feudal began his career as a teenage intern at VTR North and Golden in Leeds, small post houses where the artists and producers took him on and taught him the craft.',
  'At seventeen he travelled to the USA to freelance for UVPH and The Mill+ in New York.',
  'More senior roles followed at Social, The Mill+, ForPeople, Kenyon Weston, and Heckler.',
  'He now works independently, building a hybrid pipeline that combines traditional post-production craft with AI-augmented workflows.',
];

export default function Info() {
  const reduceMotion = useReducedMotion() ?? false;

  // Per-render counter. let is recreated each render and incremented
  // by cascade() in JSX source order so each motion element gets a
  // monotonically increasing delay matching the reading order.
  let idx = 0;
  const cascade = (inline = false) => {
    if (reduceMotion) return {};
    const i = idx++;
    const transition = {
      delay: i * CASCADE_STEP,
      duration: DURATION_MEDIUM,
      ease: EASE_OUT,
    };
    // Inline variant: animate `top` with position:relative because
    // translateY has no effect on inline non-replaced elements.
    if (inline) {
      return {
        initial:    { opacity: 0, top: 10 },
        animate:    { opacity: 1, top: 0 },
        transition,
        style:      { position: 'relative' as const },
      };
    }
    return {
      initial:    { opacity: 0, y: 10 },
      animate:    { opacity: 1, y: 0 },
      transition,
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
              <p className="text-fg/80 text-base font-semibold leading-snug max-w-2xl">
                {bioSentences.map((sentence, i) => (
                  <motion.span key={i} {...cascade(true)}>
                    {sentence}
                    {i < bioSentences.length - 1 ? ' ' : ''}
                  </motion.span>
                ))}
              </p>
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
