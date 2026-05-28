import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'

/*
  Splash handoff.

  The static <div id="splash"> in index.html is painted before
  this module evaluates. Decide what to do with it BEFORE
  createRoot() so the splash covers the initial React render —
  otherwise the user sees a frame of Hero between document paint
  and the first React commit.

  Cases:
    1. Fresh load on / (first time this session, motion allowed)
       -> set the session flag now (so the React Splash in
          Home.tsx sees it set and stays out of the way), then
          play the canonical fade-in / hold / fade-out sequence
          (400 / 700 / 400 ms) and remove.
    2. Anything else (not on /, flag already set, reduced motion)
       -> remove the splash element immediately.

  Case where the user lands on /info or /photo via shared link
  then SPA-navigates to /: this script removes the splash here
  (not on /) without setting the flag, and the React Splash in
  Home.tsx fires on the eventual / mount instead.
*/
const SPLASH_KEY = 'feudal_splash_shown';
const splash = document.getElementById('splash');
if (splash) {
  const isHome       = location.pathname === '/';
  const alreadyShown = sessionStorage.getItem(SPLASH_KEY) === 'true';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isHome || alreadyShown || reduceMotion) {
    splash.remove();
  } else {
    sessionStorage.setItem(SPLASH_KEY, 'true');
    // rAF before the first class flip so the browser has settled
    // on the initial opacity:0 — the transition then runs
    // 0 -> 1 instead of skipping straight to the end state.
    requestAnimationFrame(() => {
      splash.classList.add('splash--fade-in');
      window.setTimeout(() => {
        splash.classList.add('splash--fade-out');
        window.setTimeout(() => splash.remove(), 400);
      }, 1100);
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      reducedMotion="user" tells every framer-motion component on the
      page to short-circuit transforms and layout animations when the
      OS-level prefers-reduced-motion setting is enabled. Opacity and
      colour transitions still run, so cross-fades remain.

      Imperative animate() calls (smoothScroll.ts) don't read this — they
      check useReducedMotion() at their own call sites.
    */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
