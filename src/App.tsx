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
    - Solid bg-bg (#0A0A0A) when a cream section is approaching or behind the header
    - Smooth 200ms transition-colors

  Detection strategy — IntersectionObserver, not a scroll listener:
    We create an effective observation zone of exactly TRIGGER_PX height
    at the top of the viewport by setting a large negative rootMargin on
    the bottom. A cream section fires isIntersecting=true the moment its
    top edge enters that zone (80px before it reaches the actual header
    bottom), and false once its bottom exits upward.
    A Set tracks which cream sections are currently active so the state
    is correct even when two cream sections are simultaneously near the
    header (e.g. on a very short viewport).
    The observer is recreated on window resize because rootMargin values
    are in px and depend on window.innerHeight.
*/

const NAV_LINKS = [
  { label: 'Info',        href: '#about'      },
  { label: 'Work',        href: '#work'        },
  { label: 'Somervilles', href: '#somervilles' },
  { label: 'Vimeo',       href: '#'            },
  { label: 'Contact',     href: '#footerblock' },
] as const;

// Cream-background section IDs — header goes solid when any is near the top.
const CREAM_IDS = ['about', 'footerblock'] as const;

// Header bottom ≈ 64px. We fire 80px before the section reaches that edge.
const TRIGGER_PX = 64 + 80; // 144 px from viewport top

export default function App() {
  const [headerSolid, setHeaderSolid] = useState(false);
  const [showTop,     setShowTop]     = useState(false);

  // ── IntersectionObserver: header background ────────────────────────────
  useEffect(() => {
    const active = new Set<string>();
    let io: IntersectionObserver | null = null;

    const mount = () => {
      io?.disconnect();
      active.clear();

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            isIntersecting ? active.add(target.id) : active.delete(target.id);
          });
          setHeaderSolid(active.size > 0);
        },
        {
          root: null,
          // Shrink the observable area to a TRIGGER_PX-tall band at the top.
          // Any cream section with its top inside [0, TRIGGER_PX] fires true.
          rootMargin: `0px 0px ${-(window.innerHeight - TRIGGER_PX)}px 0px`,
          threshold: 0,
        },
      );

      CREAM_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) io!.observe(el);
      });
    };

    mount();
    window.addEventListener('resize', mount);
    return () => {
      io?.disconnect();
      window.removeEventListener('resize', mount);
    };
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
          'flex items-center justify-between px-6 py-5 md:px-10',
          'transition-colors duration-200',
          headerSolid ? 'bg-bg' : 'bg-transparent',
        ].join(' ')}
      >
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
            className="h-10 w-auto"
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
