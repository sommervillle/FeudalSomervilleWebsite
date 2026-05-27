import { motion, useReducedMotion } from 'framer-motion';

/*
  MonogramSkeleton — placeholder for loading images / video.

  Visual:
    - Surface: bg-fg/5 (cream-at-5% on dark page reads as a slightly
      lifted dark surface; on a cream page would read as a faint
      cream).
    - Centred dark monogram at ~35% of the cell's smaller dimension.
      max-w-[35%] + max-h-[35%] together cap the image to 35% of
      *whichever* dimension is smaller, so the same component works
      for square (Photo grid), 16:9 (future WorkGrid), portrait
      (future hero poster), etc.
    - Subtle pulse: opacity oscillates 0.4 -> 0.7 -> 0.4 on a 1.5s
      easeInOut loop. Reduced-motion users get a static 0.55.

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
  src = '/monogram_dark.png',
  className = '',
  onClick,
}: MonogramSkeletonProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      onClick={onClick}
      className={[
        'relative bg-fg/5 flex items-center justify-center overflow-hidden',
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
        animate={reduceMotion ? { opacity: 0.55 } : { opacity: [0.4, 0.7, 0.4] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.5, ease: 'easeInOut', repeat: Infinity }
        }
      />
    </div>
  );
}
