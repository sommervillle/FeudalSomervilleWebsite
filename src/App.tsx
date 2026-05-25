import { useState, useEffect } from 'react';
import LogoMark from './components/LogoMark';
import Hero from './components/Hero';
import WorkGrid from './components/WorkGrid';
import AboutBlock from './components/AboutBlock';
import SomervillesSection from './components/SomervillesSection';
import Credits from './components/Credits';
import Footer from './components/Footer';

const NAV_LINKS = [
  { label: 'Info',        href: '#about'       },
  { label: 'Work',        href: '#work'         },
  { label: 'Somervilles', href: '#somervilles'  },
  { label: 'Vimeo',       href: '#'             },
  { label: 'Contact',     href: '#contact'      },
] as const;

export default function App() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/*
        Fixed nav — floats above every section.
        pointer-events-none on the wrapper prevents blocking hero video clicks;
        re-enabled on the actual interactive children.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 pointer-events-none">

        <a
          href="#"
          aria-label="Feudal Somerville"
          className="pointer-events-auto text-fg hover:opacity-70 transition-opacity duration-300"
        >
          <LogoMark size={32} />
        </a>

        <nav className="pointer-events-auto flex items-center gap-6 md:gap-8">
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
        <WorkGrid />
        <AboutBlock />
        <SomervillesSection />
        <Credits />
        <Footer />
      </main>

      {/* Back-to-top — fixed bottom-right, appears after scrolling past hero */}
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
        {/* Up chevron */}
        <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
          <path d="M1 6L5.5 1.5L10 6" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
