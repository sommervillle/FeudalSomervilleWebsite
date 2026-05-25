# Feudal Somerville — Personal Site

## Project context

This is the personal portfolio site for **Feudal Somerville**, a director and visual artist working at the intersection of high-end 3D craft and AI-augmented production.

The site is a single-page director's portfolio, intentionally minimal, designed to present finished work without commercial-marketing framing. Reference precedent: ashthorp.com (ALT Creative), gmunk.com, filiphodas.com. The site should feel like cinema, not like a freelance business.

The artist also operates a separate long-form project called **Somervilles** — a serialised cinematic series exploring a thousand years of family history through hybrid 3D/AI production. That project will eventually live at its own domain. This personal site links to it but doesn't host it.

## Tone and positioning

- Director, not freelancer
- Author, not vendor
- Restraint over abundance
- The work is the content; the site is the frame

No services pages. No about-us marketing. No "let's collaborate" CTAs. The audience finds the work, considers it, and contacts via email if interested. The site does not chase.

## Aesthetic direction

- **Palette:** dark mode by default. Near-black background (not pure black — something like #0A0A0A). Off-white text (#F2F1ED or similar). One accent neutral for muted text (#888). No bright colours in the chrome — colour comes from the work itself.
- **Typography:** one serif display face (suggestions: GT Sectra, Reckless, Tiempos Headline, Editorial New) paired with one clean sans (suggestions: Inter, ABC Diatype, Söhne, GT America). Editorial weight. Generous leading. Tight tracking on display.
- **Layout:** generous whitespace, large hero video, full-bleed media where appropriate, restrained navigation.
- **Motion:** minimal. Videos autoplay muted on loop. Hover states are subtle. No scroll-jacking or fancy choreography. The work moves; the chrome doesn't.

Reference moodboard: Macbeth (2015, Justin Kurzel) for colour and weight. The King (2019) for typographic restraint. Ash Thorpe's site for structure.

## Identity

- **Operating name:** Feudal Somerville (single M)
- **Legal surname:** Sommerville (double M) — not displayed on the site
- **Monogram:** the Somerville monogram (custom mark designed by the artist — clockwise compass reading spells SOMERVILLE) should be used as the small logo mark in the corner of the site and as a closing mark on individual project pages
- **The monogram is a static SVG asset** — it will be provided as `/public/assets/monogram.svg`

## Site architecture

Single-page scroll architecture with anchor-link navigation. Page regions in order:

1. **Hero** — full-viewport looping showreel video, autoplay muted. Monogram top-left. Name and a single line of positioning text overlaid bottom-left or bottom-centre. No nav bar above the fold; the user knows to scroll.

2. **Selected Work** — a grid of 6-10 pieces. Each tile is a still frame or short looping clip. Hover reveals title. Click opens a full-screen player or a dedicated project page (route per project).

3. **Somervilles** — a separate section dedicated to the ongoing series. Could be a single block with one hero piece and a link out to the eventual Somervilles project domain. Treated visually distinct from the Selected Work grid — this is the *flagship* project, not just another piece.

4. **Selected Credits** — a small slate of past commercial work, listed as text only. Format: "Brand — Role/Project — Year". Examples: Guinness, Nike, Adidas, The King's Trust, Pringles, HP, The Mill. One line each. No case studies, no thumbnails.

5. **Contact** — email address as a mailto link. Instagram, Vimeo, YouTube links if active. The monogram repeated as a closing mark. Nothing else.

## Page structure

- **Home** (`/`) — the single-page scroll described above
- **Project pages** (`/work/[slug]`) — one route per project, dedicated player with title, year, role, optional credits list, and looping video. Minimal text.
- **Info** (`/info`) — optional. A single page with a short bio paragraph, contact email, social links, and a list of any other notable info. Linked from a single small "Info" link in the corner.

That's the entire site. No blog, no news, no shop.

## Technical stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS, configured with a custom dark theme (background, foreground, muted colours defined in `tailwind.config.ts`)
- **Routing:** React Router for the project pages
- **Fonts:** self-hosted via Adobe Fonts (CSS @font-face) or Fontshare. Display + sans pair. Loaded in the head, not async, to avoid layout shift.
- **Video:** native HTML5 `<video>` elements with `autoPlay muted loop playsInline`. MP4 files served from Firebase Storage. Multiple file sizes for different viewports if needed (mobile vs desktop master).
- **Hosting:** Firebase Hosting. Existing Firebase project to be configured.
- **Deploy:** GitHub Actions auto-deploys main branch to Firebase Hosting on push.
- **Analytics:** none on day one. Plausible can be added later if useful.

## File structure

```
/
├── README.md
├── PROJECT_CONTEXT.md           ← this document
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── firebase.json
├── .firebaserc
├── .github/
│   └── workflows/
│       └── firebase-hosting-deploy.yml
├── public/
│   ├── assets/
│   │   ├── monogram.svg
│   │   └── favicon.ico
│   └── fonts/                   ← self-hosted font files
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── WorkGrid.tsx
│   │   ├── WorkTile.tsx
│   │   ├── SomervillesSection.tsx
│   │   ├── Credits.tsx
│   │   ├── Footer.tsx
│   │   └── Monogram.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Project.tsx
│   │   └── Info.tsx
│   ├── data/
│   │   └── projects.ts         ← single source of truth for project data
│   └── types/
│       └── index.ts
```

## Data model

Projects live in `src/data/projects.ts` as a typed array. Each project:

```typescript
interface Project {
  slug: string;              // URL slug, e.g. "somervilles-chapter-1"
  title: string;
  year: number;
  category: "Personal" | "Commercial" | "Somervilles";
  role?: string;             // e.g. "Director", "Director & Animator"
  client?: string;           // for commercial work
  thumbnailVideo: string;    // path or URL to looping thumbnail clip
  thumbnailPoster: string;   // fallback still
  heroVideo: string;         // full-quality video for the project page
  description?: string;      // short, optional
  credits?: string[];        // optional credits list
  externalLink?: string;     // optional link out (e.g. Vimeo full version)
}
```

Adding a new project = adding an entry to this array. No CMS needed initially.

## Build priorities (in order)

1. **Project scaffold:** Vite + React + TS + Tailwind running locally. Firebase initialised. GitHub repo created with deploy action.
2. **Layout shell:** dark theme, font loaded, monogram in corner, basic page structure rendering.
3. **Hero:** looping video, name overlay, scroll indicator.
4. **Work grid:** placeholder tiles using stand-in videos until real work is finalised.
5. **Project page route:** working `/work/[slug]` page.
6. **Somervilles section:** distinct layout treatment.
7. **Credits and footer:** small, restrained.
8. **Info page:** minimal.
9. **Polish:** font tuning, spacing tuning, mobile responsiveness, video performance optimisation.

## Non-goals

- No CMS until needed. Project data lives in code.
- No animation library on day one (no Framer Motion, no GSAP). If specific motion is wanted later, add then.
- No smooth-scroll library on day one. Native scroll is fine.
- No analytics on day one.
- No newsletter signup, no chatbot, no popups, no cookie banners (no tracking = no banner).
- No light mode. Dark only.
- No mobile menu hamburger. The nav is minimal enough to work on mobile without one.

## Performance targets

- First contentful paint under 1.5s on a good connection
- Lighthouse performance score 90+
- Total page weight under 5MB excluding hero video
- Hero video loaded lazily after first paint, or preloaded if small enough

## Open decisions (resolve during build)

- Final font pairing (will test 2-3 options in development)
- Whether the Info page exists or whether contact + bio live on the home page only
- Whether project pages have URL-based videos or embed (decision: URL-based, served from Firebase Storage)
- Exact monogram size and placement (will iterate visually)

## Out of scope for v1

- Multi-language support
- A separate Somervilles project site (different domain, different build)
- E-commerce or print store
- Newsletter or RSS
- Search functionality
