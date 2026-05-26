import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Home from './pages/Home';
import Info from './pages/Info';
import { scrollToY, scrollToElement } from './smoothScroll';
import { DURATION_FAST, DURATION_MEDIUM, EASE_OUT, EASE_SMOOTH } from './motion';

/*
  Layout shell: fixed header + routed page content + back-to-top.

  Animations live here:
    - Header bg cross-fades transparent <-> bg-bg via motion.header
      backgroundColor on EASE_SMOOTH / DURATION_FAST.
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

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const reduceMotion = useReducedMotion() ?? false;

  const [headerSolid, setHeaderSolid] = useState(!isHome);
  const [showTop,     setShowTop]     = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  // Header background: observe Hero only on Home; otherwise stay solid.
  useEffect(() => {
    if (!isHome) {
      setHeaderSolid(true);
      return;
    }

    const hero = document.getElementById('hero');
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setHeaderSolid(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-150px 0px 0px 0px' },
    );

    io.observe(hero);
    return () => io.disconnect();
  }, [isHome]);

  // Back-to-top visibility.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const goHomeAndScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      scrollToY(0, reduceMotion);
    } else {
      navigate('/');
      window.scrollTo({ top: 0 });
    }
  };

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      scrollToElement('footerblock', 0, reduceMotion);
    } else {
      navigate('/', { state: { scrollTo: 'footerblock' } });
    }
  };

  const goInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/info');
    window.scrollTo({ top: 0 });
  };

  const navItems = [
    { label: 'Info',    onClick: goInfo              },
    { label: 'Work',    onClick: goHomeAndScrollTop  },
    { label: 'Contact', onClick: goContact           },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none border-b"
        initial={false}
        animate={{
          backgroundColor: headerSolid ? 'rgba(5, 5, 5, 1)' : 'rgba(5, 5, 5, 0)',
          borderBottomColor: headerSolid ? 'rgba(242, 241, 237, 0.1)' : 'rgba(242, 241, 237, 0)',
        }}
        transition={{ duration: DURATION_FAST, ease: EASE_SMOOTH }}
      >
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
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
      <div className="fixed top-0 left-0 right-0 z-[70] pointer-events-none md:hidden">
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
      </div>

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
