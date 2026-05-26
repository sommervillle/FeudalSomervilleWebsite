import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AboutBlock from '../components/AboutBlock';
import WorkGrid from '../components/WorkGrid';
import SomervillesSection from '../components/SomervillesSection';
import FooterBlock from '../components/FooterBlock';

/*
  Home — the single-page scroll site.
  If navigated to with location.state.scrollTo set (e.g. from a
  Contact click on /info), scroll to that element id after mount.
*/
export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    // rAF lets the route's content paint before we scroll into it.
    requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [location]);

  return (
    <>
      <Hero />
      <AboutBlock />
      <WorkGrid />
      <SomervillesSection />
      <FooterBlock />
    </>
  );
}
