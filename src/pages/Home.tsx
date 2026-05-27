import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import Hero from '../components/Hero';
import AboutBlock from '../components/AboutBlock';
import WorkGrid from '../components/WorkGrid';
import SomervillesSection from '../components/SomervillesSection';
import FooterBlock from '../components/FooterBlock';
import Splash from '../components/Splash';
import { scrollToElement } from '../smoothScroll';

/*
  Home — the single-page scroll site.

  First-visit splash:
    Plays only on the first / mount per browser session, gated by a
    sessionStorage flag. Once set, navigating /info -> / or /photo
    -> / within the same session skips the splash. New tab / page
    refresh starts a fresh session and shows the splash again.

    Reduced-motion users always skip the splash visually; the flag
    is still recorded so they don't see it later if they toggle
    reduced motion off mid-session.

  Cross-route arrival scroll:
    If navigated to with location.state.scrollTo set (e.g. from a
    Contact click on /info — currently no longer wired but the
    arrival handler is kept), scroll to that element id after mount
    using the site's EASE_SMOOTH cinematic scroll.
*/

const SPLASH_KEY = 'feudal_splash_shown';

export default function Home() {
  const location     = useLocation();
  const reduceMotion = useReducedMotion() ?? false;

  // Lazy initialiser reads sessionStorage once on first render.
  // No side effect here — that lives in the effect below so React
  // StrictMode's double-invoke in dev doesn't false-set the flag.
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SPLASH_KEY) !== 'true';
  });

  // Record that this session has now landed on / once, whether or
  // not the splash visually played. Subsequent / mounts in the
  // same session will see the flag set in the useState initialiser
  // above and skip the splash.
  useEffect(() => {
    sessionStorage.setItem(SPLASH_KEY, 'true');
  }, []);

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    // rAF lets the route's content paint before we scroll into it.
    requestAnimationFrame(() => scrollToElement(target, 0, reduceMotion));
  }, [location, reduceMotion]);

  return (
    <>
      {showSplash && !reduceMotion && (
        <Splash onComplete={() => setShowSplash(false)} />
      )}
      <Hero />
      <AboutBlock />
      <WorkGrid />
      <SomervillesSection />
      <FooterBlock />
    </>
  );
}
