/*
  Motion tokens — site-wide easing and duration constants.

  Curves are cubic-bezier control points [x1, y1, x2, y2]:
  - EASE_SMOOTH : symmetric S-curve, slow start / fast middle /
                  slow finish. The "cinematic" feel — use for
                  long-distance moves (page scrolls, hero reveals).
  - EASE_OUT   : easeOutExpo-ish — fast start, gentle settle.
                 Use for short UI moves that should feel responsive
                 (overlay fades, hover lifts).

  Durations are in seconds (framer-motion's unit). Pair them with
  the easings rather than choosing arbitrary values inline so the
  whole site moves on the same timing vocabulary.
*/

export const EASE_SMOOTH: [number, number, number, number] = [0.7, 0, 0.3, 1];
export const EASE_OUT:    [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION_FAST   = 0.3;
export const DURATION_MEDIUM = 0.6;
export const DURATION_SLOW   = 1.2;
