import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'

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
