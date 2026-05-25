import Hero from './components/Hero';
import WorkGrid from './components/WorkGrid';
import SomervillesSection from './components/SomervillesSection';
import Credits from './components/Credits';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      {/*
        Fixed nav — sits above every section.
        pointer-events-none on the wrapper so it doesn't block
        clicks on the hero video; re-enabled on the actual links.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-10 pointer-events-none">
        <a
          href="#"
          aria-label="Feudal Somerville"
          className="pointer-events-auto"
        >
          <img
            src="/assets/monogram.svg"
            alt="FS"
            width={30}
            height={30}
            className="opacity-75 hover:opacity-100 transition-opacity duration-300"
          />
        </a>
        <nav className="pointer-events-auto flex items-center gap-8">
          <a
            href="#contact"
            className="text-muted text-[11px] tracking-[0.22em] uppercase hover:text-fg transition-colors duration-200"
          >
            Info
          </a>
          <a
            href="#contact"
            className="text-muted text-[11px] tracking-[0.22em] uppercase hover:text-fg transition-colors duration-200"
          >
            Vimeo
          </a>
        </nav>
      </header>

      <main>
        <Hero />
        <WorkGrid />
        <SomervillesSection />
        <Credits />
        <Footer />
      </main>
    </>
  );
}
