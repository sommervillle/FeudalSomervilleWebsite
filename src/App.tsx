import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Info from './pages/Info';

/*
  Layout shell: fixed header + routed page content + back-to-top.

  Header background:
    - On '/'   : transparent while #hero intersects viewport, solid after
                 (single IntersectionObserver on #hero)
    - On other routes: always solid bg-bg

  Nav:
    - Info     → /info
    - Work     → /  (and scrolls to top if already there)
    - Contact  → scrolls to #footerblock on '/'; from elsewhere,
                 navigates to '/' with state.scrollTo='footerblock' and
                 Home scrolls after mount.
*/

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

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

  // Close the mobile menu when the route changes (e.g. tapping Info inside it).
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const goHomeAndScrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0 });
    }
  };

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      document.getElementById('footerblock')?.scrollIntoView({ behavior: 'smooth' });
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
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 pointer-events-none',
          'transition-colors duration-200',
          headerSolid ? 'bg-bg' : 'bg-transparent',
        ].join(' ')}
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

          {/* Mobile burger — below md only. Three thin lines, no box. */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="pointer-events-auto md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2 text-fg"
          >
            <span className="block w-6 h-px bg-current" />
            <span className="block w-6 h-px bg-current" />
            <span className="block w-6 h-px bg-current" />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={[
          'fixed inset-0 z-[60] md:hidden bg-bg',
          'transition-opacity duration-200',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-6 p-2 text-fg"
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

        <nav className="h-full w-full flex flex-col items-center justify-center gap-10">
          {navItems.map(({ label, onClick }) => (
            <a
              key={label}
              href="#"
              onClick={onClick}
              className="text-fg text-2xl font-light tracking-wide hover:text-fg/70 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </main>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
