import { motion, useReducedMotion } from 'framer-motion';

/*
  MonogramSkeleton — placeholder for loading images / video.

  Visual:
    - Surface: bg-fg/5 (cream-at-5% on dark page reads as a slightly
      lifted dark surface; on a cream page would read as a faint
      cream).
    - Centred white monogram at ~35% of the cell's smaller dimension.
      max-w-[35%] + max-h-[35%] together cap the image to 35% of
      *whichever* dimension is smaller, so the same component works
      for square (Photo grid), 16:9 (future WorkGrid), portrait
      (future hero poster), etc.
    - Full pulse: opacity oscillates 0 -> 1 -> 0 on a 1.5s
      easeInOut loop. Reduced-motion users get a static 0.5.

  Reusable across image-loading states. Consumers pass className to
  size and position the skeleton (typically w-full h-full to fill a
  parent cell, or aspect-square / aspect-[16/9] to drive its own
  dimensions).
*/

interface MonogramSkeletonProps {
  src?: string;
  className?: string;
  onClick?: () => void;
}

export default function MonogramSkeleton({
  src = '/monogram.png',
  className = '',
  onClick,
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
        animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0, 1, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.5, ease: 'easeInOut', repeat: Infinity }
        }
      />
    </div>
  );
}
