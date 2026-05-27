import { useEffect } from 'react';

/*
  Lock body scroll while a fullscreen overlay (lightbox, modal) is open.

  iOS Safari ignores `overflow: hidden` on body by itself, so we pin
  the body with position: fixed and a negative top equal to the
  current scrollY. That stops scroll without visually jumping. On
  cleanup we restore the original body styles and scrollTo back to
  where the user was.

  Mount = locked. Unmount = released. Pair with AnimatePresence
  conditionally rendering the overlay, so lock/unlock follow the
  overlay's lifecycle automatically.
*/
export function useBodyScrollLock() {
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const original = {
      position: body.style.position,
      top:      body.style.top,
      width:    body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top      = `-${scrollY}px`;
    body.style.width    = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = original.position;
      body.style.top      = original.top;
      body.style.width    = original.width;
      body.style.overflow = original.overflow;
      window.scrollTo(0, scrollY);
    };
  }, []);
}
