import { motion, useReducedMotion } from 'framer-motion';

/*
  MonogramSkeleton — placeholder for loading images / video.

  Visual:
    - Surface: consumer-provided via className (e.g. bg-fg/5 for the
      Photo grid's lifted cells, none for Work tiles which paint the
      surface on the article itself). The component is a pure
      pulsing-monogram layer.
    - Centred white monogram at ~35% of the cell's smaller dimension.
      max-w-[35%] + max-h-[35%] together cap the image to 35% of
      *whichever* dimension is smaller, so the same component works
      for square (Photo grid), 16:9 (Work tiles), portrait, etc.
    - Subtle pulse: opacity oscillates 0.02 -> 0.15 -> 0.02 on a
      3s easeInOut loop, repeating. Floor at 0.02 keeps the
      monogram always faintly visible — it never goes fully
      invisible. Reduced-motion users get a static 0.08 (the
      animation midpoint).

  Stagger / ripple:
    Optional `delay` prop offsets the first pulse cycle by N
    seconds. Subsequent cycles repeat on the staggered timeline
    (framer-motion's `delay` applies before the first iteration
    only, then repeats without further delay). Consumers compute
    the per-instance delay from grid position:
      - WorkGrid: top-to-bottom, i * 0.3
      - Photo grid: diagonal, (row + col) * 0.15

  Reusable across image-loading states. Consumers pass className to
  size and position the skeleton (typically w-full h-full to fill a
  parent cell, or absolute inset-0 to overlay one).
*/

interface MonogramSkeletonProps {
  src?: string;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const PULSE_DURATION = 3;
const STATIC_OPACITY = 0.08;

export default function MonogramSkeleton({
  src = '/monogram.png',
  className = '',
  onClick,
  delay = 0,
}: MonogramSkeletonProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      onClick={onClick}
      className={[
        // No default background — consumers paint the cell surface
        // via className (e.g. `bg-fg/5` for Photo grid cells lifted
        // off the dark page) or inline style on a parent (e.g.
        // WorkGrid's alternating per-tile backgroundColor). Keeps
        // this component a pure 'centred pulsing monogram' layer
        // that composites on whatever surface sits behind it.
        //
        // Position deliberately omitted too — flex children layout
        // independently, so consumers can pass their own `relative`
        // / `absolute` etc. Common patterns: `w-full h-full` to fill
        // a parent cell, or `absolute inset-0` to overlay one.
        'flex items-center justify-center overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="max-w-[35%] max-h-[35%] select-none pointer-events-none"
        animate={reduceMotion ? { opacity: STATIC_OPACITY } : { opacity: [0.02, 0.15, 0.02] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: PULSE_DURATION,
                ease: 'easeInOut',
                repeat: Infinity,
                delay,
              }
        }
      />
    </div>
  );
}
