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
    - Transparent when floating over any dark section
    - Solid bg-bg (#0A0A0A) when over a cream section, so nav text stays readable
    - Smooth 200ms colour transition
    - Detected by checking getBoundingClientRect() of the cream section IDs
      against the approximate header height on every scroll event
*/

const NAV_LINKS = [
  { label: 'Info',        href: '#about'       },
  { label: 'Work',        href: '#work'         },
  { label: 'Somervilles', href: '#somervilles'  },
  { label: 'Vimeo',       href: '#'             },
  { label: 'Contact',     href: '#footerblock'  },
] as const;

// IDs of sections with cream (bg-fg) backgrounds — header goes solid over these.
const CREAM_IDS = ['about', 'footerblock'] as const;
// Approximate fixed header height in px (py-5 × 2 + content ≈ 60px).
const HEADER_H = 64;

export default function App() {
  const [headerSolid, setHeaderSolid] = useState(false);
  const [showTop,     setShowTop]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Back-to-top button: show after 70% of first viewport height
      setShowTop(window.scrollY > window.innerHeight * 0.7);

      // Header background: solid when any cream section overlaps the header band
      const overCream = CREAM_IDS.some(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= HEADER_H && bottom > 0;
      });
      setHeaderSolid(overCream);
    };

    onScroll(); // evaluate immediately on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/*
        Fixed header — pointer-events-none on the wrapper so it doesn't
        swallow clicks on the hero video; interactive elements opt back in.
      */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 pointer-events-none',
          'flex items-center justify-between px-6 py-5 md:px-10',
          'transition-colors duration-200',
          headerSolid ? 'bg-bg' : 'bg-transparent',
        ].join(' ')}
      >
        {/* Logo slot — empty; monogram will be placed here later */}
        <div className="w-8 h-8" aria-hidden="true" />

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
