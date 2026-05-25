import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AboutBlock from './components/AboutBlock';
import WorkGrid from './components/WorkGrid';
import SomervillesSection from './components/SomervillesSection';
import FooterBlock from './components/FooterBlock';

/*
  Page order:  Hero (dark) → AboutBlock (cream) → WorkGrid (dark) →
               SomervillesSection (dark) → FooterBlock (cream)

  Header behaviour:
    - Transparent while the Hero is intersecting the viewport (user is in the hero)
    - Solid bg-bg (#0A0A0A) once the user has scrolled past the Hero
    - Smooth 200ms transition-colors
    - Single IntersectionObserver on #hero; no per-section switching
*/

const NAV_LINKS = [
  { label: 'Info',        href: '#about'      },
  { label: 'Work',        href: '#work'        },
  { label: 'Somervilles', href: '#somervilles' },
  { label: 'Vimeo',       href: '#'            },
  { label: 'Contact',     href: '#footerblock' },
] as const;

export default function App() {
  const [headerSolid, setHeaderSolid] = useState(false);
  const [showTop,     setShowTop]     = useState(false);

  // ── IntersectionObserver: header background ────────────────────────────
  // Transparent while Hero intersects the viewport; solid once it's gone.
  // rootMargin '-90px 0px 0px 0px' shrinks the effective root 90px from the
  // top, so the switch fires when the hero's bottom is still 90px inside the
  // viewport — well before any hero content clears the header visually.
  // Because the Hero only ever lives at the top of the page, isIntersecting
  // naturally stays false (solid) for the entire rest of the scroll and
  // resets to true only if the user scrolls back up into the hero.
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => setHeaderSolid(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-150px 0px 0px 0px' },
    );

    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // ── Scroll listener: back-to-top button ───────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/*
        Fixed header — pointer-events-none on the wrapper so it never
        swallows clicks on the hero video; children opt back in.
      */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 pointer-events-none',
          'transition-colors duration-200',
          headerSolid ? 'bg-bg' : 'bg-transparent',
        ].join(' ')}
      >
        {/* max-w-5xl container mirrors AboutBlock — logo left, nav right */}
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          {/*
            Monogram logo — /public/monogram.png (40px height).
            The header is always dark behind the logo:
              transparent state → logo sits over the dark hero/work sections
              solid state       → logo sits over explicit bg-bg (#0A0A0A)
            If the PNG is a light mark on a transparent background it will
            be legible in both states with no filter needed. If it appears
            invisible, add className="... brightness-0 invert" to force white.
          */}
          <a
            href="#"
            aria-label="Feudal Somerville"
            className="pointer-events-auto opacity-85 hover:opacity-100 transition-opacity duration-200"
          >
            <img
              src="/monogram.png"
              alt="Feudal Somerville"
              className="h-20 w-auto"
            />
          </a>

          <nav className="pointer-events-auto flex items-center gap-6 md:gap-9">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-fg/55 text-[12px] font-light tracking-wide hover:text-fg transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <AboutBlock />
        <WorkGrid />
        <SomervillesSection />
        <FooterBlock />
      </main>

      {/* Back-to-top — fixed bottom-right, fades in after scrolling past hero */}
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
