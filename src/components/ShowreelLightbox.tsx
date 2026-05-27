import { motion } from 'framer-motion';
import { DURATION_FAST, EASE_OUT } from '../motion';
import { useBodyScrollLock } from '../useBodyScrollLock';

/*
  ShowreelLightbox — mobile fullscreen video viewer for the hero
  showreel.

  Layout:
    - Full-bleed bg-bg behind a centred 16:9 video frame.
    - Tap-anywhere-to-dismiss via onClick on the outer motion.div;
      the inner frame (video or placeholder) calls stopPropagation
      so taps on the video itself don't close.
    - X close button top-right, matches the photo Lightbox.

  Real video plug-in:
    Pass a src prop to swap the placeholder for an autoplaying
    <video>. The placeholder copy is also prop-driven so we never
    hardcode 'Showreel coming soon' in places that would be missed
    when the real source arrives.

  Content protection:
    - select-none prevents long-press text selection.
    - contextmenu is blocked globally in App.tsx.
    - The eventual <video> element inherits -webkit-user-drag and
      -webkit-touch-callout: none from the global img/video CSS in
      index.css — no per-element wiring needed.
*/

interface ShowreelLightboxProps {
  onClose: () => void;
  src?: string;
  placeholderText?: string;
}

export default function ShowreelLightbox({
  onClose,
  src,
  placeholderText = 'Showreel coming soon',
}: ShowreelLightboxProps) {
  useBodyScrollLock();

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Showreel"
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-bg select-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
    >
      <button
        type="button"
        onClick={(e) => {
          // Don't bubble to the backdrop's onClick — onClose runs once.
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="fixed top-5 right-6 p-2 text-fg z-[110]"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path
            d="M3 3L19 19M19 3L3 19"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/*
        16:9 frame. stopPropagation so a tap INSIDE the frame doesn't
        bubble up to the backdrop close handler — only the surrounding
        black area dismisses.
      */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full aspect-[16/9] bg-black flex items-center justify-center overflow-hidden"
      >
        {src ? (
          <video
            src={src}
            autoPlay
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-fg/50 text-sm font-light tracking-wide">
            {placeholderText}
          </p>
        )}
      </div>
    </motion.div>
  );
}
