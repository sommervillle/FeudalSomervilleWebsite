import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Home from './pages/Home';
import Info from './pages/Info';
import Photo from './pages/Photo';
import { scrollToY } from './smoothScroll';
import { DURATION_FAST, DURATION_MEDIUM, EASE_OUT } from './motion';

/*
  Layout shell: fixed header + routed page content + back-to-top.

  Animations live here:
    - Header bg cross-fades transparent <-> #050505 via a CSS
      transition on Tailwind classes (transition-colors over 300ms
      on a cubic-bezier match of EASE_SMOOTH). Class-driven rather
      than framer-motion-driven so the route-entry flip can be made
      truly instant via a `transition-none` swap; framer-motion's
      animation scheduler can leave one paint frame of the previous
      inline style.
    - Header y slide-in (splash exit) IS still framer-motion.
    - Burger icon (3 lines) morphs into an X via per-span y + rotate.
    - Overlay opens with staggered nav-item rise (variants on motion.nav).
    - Route changes cross-fade (AnimatePresence + per-page wrapper).
*/

// Overlay nav variants — parent staggers children 70ms.
const overlayContainer = {
  hidden: {
    transition: { staggerChildren: 0, staggerDirection: -1 },
  },
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.07,
    },
  },
};

const overlayItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_MEDIUM, ease: EASE_OUT },
  },
};

// Wrapper that fades each page in/out for the AnimatePresence cross-fade.
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

// How long the burger overlay stays opaque after a burger-driven
// route change before it starts its own close animation. Long
// enough to cover the actual route swap (the moment AnimatePresence
// unmounts the old route and mounts the new one) but NOT the full
// incoming-page animation — the burger clears as the new page is
// fading in so the user can see its own entrance / cascade play
// out underneath.
const BURGER_HOLD_MS = 150;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const reduceMotion = useReducedMotion() ?? false;

  const [headerSolid, setHeaderSolid] = useState(!isHome);
  const [showTop,     setShowTop]     = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  // Header + burger slide-in coordinated with the HTML splash exit.
  // True iff the splash is currently animating in the DOM when App
  // mounts — in which case the header and burger start off-screen
  // (translateY -100%) and slide down when main.tsx dispatches
  // 'splash-exit'. Once flipped false, never flips back: the
  // entrance is a single one-shot animation per session per spec.
  //
  // For all other cases (splash already shown this session, direct
  // load on /info or /photo, or prefers-reduced-motion suppressing
  // the splash entirely), main.tsx removes #splash before App
  // renders, so this initialises to false and the header is at its
  // final position from first paint.
  const [headerOffscreen, setHeaderOffscreen] = useState(() => {
    if (typeof document === 'undefined') return false;
    return !!document.getElementById('splash');
  });

  // When a burger-driven nav schedules a delayed close, this flag
  // tells the pathname-change useEffect below to skip its own
  // immediate setMenuOpen(false). Otherwise the immediate close
  // would race the delayed close and the overlay would lift mid-
  // crossfade — exactly the flash we're trying to hide.
  const burgerDelayedCloseScheduled = useRef(false);

  // When the route changes to /, the header bg flips from solid to
  // transparent INSTANTLY — no fade — so the new page paints with a
  // transparent header from frame 1.
  //
  // We do this via a Tailwind class flip (not a framer-motion
  // animate prop) because CSS transitions run synchronously off the
  // commit's DOM mutation: the browser sees the new class and the
  // old/new bg value on the same paint, and `transition-none` on
  // that render kills the fade outright. framer-motion's animate
  // prop, by contrast, drives its inline-style writes through an
  // animation scheduler — even with duration:0 the previous frame
  // can paint with the old inline bg, which is what we kept seeing.
  //
  // The flag is set in the layout-effect below the moment isHome
  // flips true, read by motion.header's className to swap in
  // `transition-none` for that one render, then cleared after paint.
  const skipNextBgTransition = useRef(false);

  // Header background — state side. Runs synchronously BEFORE paint
  // (useLayoutEffect) so the first frame of the new route already
  // has the correct headerSolid value. For the entry-to-/ case the
  // skipNextBgTransition flag is also raised here so motion.header's
  // className includes `transition-none` on that one render — net
  // effect: the bg flips from solid to transparent on the same paint
  // the new route mounts on, with no CSS transition firing. The
  // flag is cleared by a no-deps effect after paint so subsequent
  // state changes (the IO-driven scroll toggle, or leaving / for
  // /info) re-engage the normal `transition-colors` fade.
  useLayoutEffect(() => {
    if (isHome) {
      skipNextBgTransition.current = true;
      setHeaderSolid(false);
    } else {
      setHeaderSolid(true);
    }
  }, [isHome]);

  // Header background — IO side. Runs after paint so the Hero
  // element is in the DOM (or will be soon).
  //
  // AnimatePresence mode="wait" defers Home (and therefore Hero)
  // mounting until /info or /photo finishes its exit animation, so
  // on a route change isHome flips true before the Hero element
  // exists. Poll on rAF until Hero appears, then attach the
  // observer — its first entry callback re-evaluates the current
  // scroll position so the header stays transparent at the top of /
  // and starts re-solidifying as the user scrolls past Hero.
  useEffect(() => {
    if (!isHome) return;

    let rafId = 0;
    let observer: IntersectionObserver | null = null;

    const tryAttach = () => {
      const hero = document.getElementById('hero');
      if (!hero) {
        rafId = requestAnimationFrame(tryAttach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setHeaderSolid(!entry.isIntersecting),
        { threshold: 0, rootMargin: '-150px 0px 0px 0px' },
      );
      observer.observe(hero);
    };

    tryAttach();

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [isHome]);

  // Clear the bg-transition skip flag after every paint. The render
  // that *uses* the flag (the route-to-/ transition) reads the ref
  // during render to pick `transition-none` over `transition-colors`,
  // so by the time this effect runs the browser has already
  // painted with the instant flip. All subsequent renders see the
  // flag false and bg/border changes use the normal CSS fade.
  useEffect(() => {
    skipNextBgTransition.current = false;
  });

  // Back-to-top visibility.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the route changes. Skipped when a
  // burger-handler explicitly scheduled a delayed close — the
  // setTimeout there will fire setMenuOpen(false) once the
  // route crossfade has fully completed (see scheduleBurgerClose).
  useEffect(() => {
    if (burgerDelayedCloseScheduled.current) return;
    setMenuOpen(false);
  }, [location.pathname]);

  // Slide the header + burger in when the HTML splash starts
  // fading out. Listener attached only while headerOffscreen is
  // true, so subsequent route-change splashes (React Splash on
  // SPA-nav into /) don't re-trigger an animation that already
  // ran on this mount.
  useEffect(() => {
    if (!headerOffscreen) return;
    const onSplashExit = () => setHeaderOffscreen(false);
    window.addEventListener('splash-exit', onSplashExit);
    return () => window.removeEventListener('splash-exit', onSplashExit);
  }, [headerOffscreen]);

  // Content protection — block right-click globally and drag on
  // images/videos. Paired with the img/video CSS rules in
  // index.css (-webkit-user-drag, user-select, touch-callout) so
  // every current and future media element is protected without
  // per-element config. Silent prevent — no alerts.
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onDragStart = (e: DragEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'IMG' || tag === 'VIDEO') e.preventDefault();
    };
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  // Called from the burger nav handlers when an actual route
  // change is happening. Keeps the overlay fully opaque for
  // BURGER_HOLD_MS — long enough to cover the route swap itself,
  // then lifts as the new page is fading in so the user sees the
  // incoming cascade / entrance animation underneath.
  //
  // No-op when the burger isn't open (desktop nav calls these
  // handlers too — menuOpen is false there, nothing to close).
  // Reduced-motion users skip the orchestration: burger closes
  // immediately, crossfade swaps instantly under MotionConfig.
  const scheduleBurgerClose = () => {
    if (!menuOpen) return;
    if (reduceMotion) {
      setMenuOpen(false);
      return;
    }
    burgerDelayedCloseScheduled.current = true;
    window.setTimeout(() => {
      setMenuOpen(false);
      burgerDelayedCloseScheduled.current = false;
    }, BURGER_HOLD_MS);
  };

  // Tapping a link for the route you're already on: no crossfade
  // will run, so close the burger immediately. Otherwise navigate
  // and let scheduleBurgerClose cover the crossfade.
  const navigateAndCloseBurger = (path: string) => {
    if (location.pathname === path) {
      setMenuOpen(false);
      return;
    }
    navigate(path);
    window.scrollTo({ top: 0 });
    scheduleBurgerClose();
  };

  const goHomeAndScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHome) {
      // Already on /; no nav, no crossfade. Close burger and
      // run the cinematic scroll-to-top immediately.
      setMenuOpen(false);
      scrollToY(0, reduceMotion);
      return;
    }
    navigate('/');
    window.scrollTo({ top: 0 });
    scheduleBurgerClose();
  };

  const goInfo  = (e: React.MouseEvent) => { e.preventDefault(); navigateAndCloseBurger('/info');  };
  const goPhoto = (e: React.MouseEvent) => { e.preventDefault(); navigateAndCloseBurger('/photo'); };

  const navItems = [
    { label: 'Info',  onClick: goInfo             },
    { label: 'Work',  onClick: goHomeAndScrollTop },
    { label: 'Photo', onClick: goPhoto            },
  ];

  return (
    <>
      <motion.header
        className={[
          // base
          'fixed top-0 left-0 right-0 z-50 pointer-events-none border-b',
          // bg + border — driven by headerSolid via classNames (not
          // framer-motion animate). CSS-class flips happen on the
          // commit's DOM mutation, before paint, so combined with
          // the conditional transition class below the route-entry
          // case is truly instant.
          headerSolid
            ? 'bg-[#050505] border-fg/10'
            : 'bg-transparent border-transparent',
          // Normal fade for bg/border changes (scroll past Hero on /,
          // or leaving / for /info). EASE_SMOOTH match via arbitrary
          // cubic-bezier. When skipNextBgTransition is raised by the
          // layout-effect on entry to /, swap to `transition-none`
          // for that one render — the bg/border flip in zero time.
          skipNextBgTransition.current
            ? 'transition-none'
            : 'transition-colors duration-300 ease-[cubic-bezier(0.7,0,0.3,1)]',
        ].join(' ')}
        // framer-motion now only animates y (the splash-exit slide).
        // bg/border live in className above, so no `default` key in
        // transition is needed — this transition applies solely to y.
        initial={false}
        animate={{ y: headerOffscreen ? '-100%' : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        {/*
          Padding now lives on the outer wrapper; the inner row is
          max-w-5xl mx-auto — same pattern as AboutBlock (section
          has the gutter, inner block holds the safe-zone). Logo
          and nav sit on the max-w container's edges on desktop,
          aligning with the AboutBlock columns. Mobile (max-w-5xl
          larger than viewport) collapses naturally to the px-6
          gutter as before.
        */}
        <div className="px-6 md:px-10 py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a
            href="/"
            onClick={goHomeAndScrollTop}
            aria-label="Feudal Somerville — home"
            className="pointer-events-auto opacity-85 hover:opacity-100 transition-opacity duration-200"
          >
            <img
              src="/monogram.png"
              alt="Feudal Somerville"
              className="h-20 w-auto"
            />
          </a>

          {/* Desktop nav — horizontal, md and above */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-6 md:gap-9">
            {navItems.map(({ label, onClick }) => (
              <a
                key={label}
                href="#"
                onClick={onClick}
                className="text-fg/55 text-[12px] font-light tracking-wide hover:text-fg transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
          </div>
        </div>
      </motion.header>

      {/*
        Mobile burger — pulled OUT of the header so its z-[70] is
        evaluated in the root stacking context (the header creates
        its own context via z-50, which would otherwise trap the
        button below the overlay no matter what z-index it claimed).
        The wrapper mirrors the header's container/padding so the
        button visually aligns with where it sat before; min-h-[120px]
        matches the header's full row height (py-5 + h-20 logo) so
        flex items-center parks the burger at the same vertical
        centre as the logo's glyph (which is centred within the PNG).

        The same button is the close affordance: tapping it while
        open toggles state back, and the three spans morph to/from
        the X. z-[70] keeps it tappable above the overlay (z-[60]).
      */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[70] pointer-events-none md:hidden"
        initial={false}
        animate={{ y: headerOffscreen ? '-100%' : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-5 min-h-[120px] flex items-center justify-end">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="pointer-events-auto relative w-6 h-6 p-2 mr-2 text-fg box-content"
          >
            <motion.span
              className="absolute inset-x-0 mx-auto top-1/2 block w-6 h-px bg-current"
              animate={menuOpen ? { y: 0, rotate: 45 } : { y: -5, rotate: 0 }}
              transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
            />
            <motion.span
              className="absolute inset-x-0 mx-auto top-1/2 block w-6 h-px bg-current"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
            />
            <motion.span
              className="absolute inset-x-0 mx-auto top-1/2 block w-6 h-px bg-current"
              animate={menuOpen ? { y: 0, rotate: -45 } : { y: 5, rotate: 0 }}
              transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
            />
          </button>
        </div>
      </motion.div>

      {/*
        Mobile overlay menu.
        Container fades in/out; nav items stagger via overlayContainer +
        overlayItem variants. The morphed burger above (z-[70]) is the
        close affordance — no separate X needed inside the overlay.
      */}
      <motion.div
        className="fixed inset-0 z-[60] md:hidden bg-bg"
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <motion.nav
          className="h-full w-full flex flex-col items-center justify-center gap-10"
          variants={overlayContainer}
          initial="hidden"
          animate={menuOpen ? 'visible' : 'hidden'}
        >
          {navItems.map(({ label, onClick }) => (
            <motion.a
              key={label}
              href="#"
              onClick={onClick}
              variants={overlayItem}
              className="text-fg text-2xl font-light tracking-wide hover:text-fg/70 transition-colors duration-200"
            >
              {label}
            </motion.a>
          ))}
        </motion.nav>
      </motion.div>

      <main>
        {/*
          mode="wait" plays the exit animation of the leaving route
          before the new route mounts and fades in. Total transition is
          ~2 * DURATION_FAST.
        */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<PageTransition><Home /></PageTransition>}
            />
            <Route
              path="/info"
              element={<PageTransition><Info /></PageTransition>}
            />
            <Route
              path="/photo"
              element={<PageTransition><Photo /></PageTransition>}
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/*
        Back-to-top. Plain cream icon + border; the whole site is
        now dark so no blend-mode trick is needed for legibility.
        Hover brightens both colour and border.
      */}
      <button
        onClick={() => scrollToY(0, reduceMotion)}
        aria-label="Back to top"
        className={[
          'fixed bottom-7 right-6 md:right-10 z-50',
          'w-9 h-9 border border-fg/20 flex items-center justify-center',
          'text-fg/40 hover:text-fg hover:border-fg/50',
          'transition-all duration-300 ease-out',
          showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
          <path
            d="M1 6L5.5 1.5L10 6"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
