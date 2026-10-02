# D4Developer Tech Solutions

Award-style 3D agency website built with Next.js, React Three Fiber, GSAP, and Tailwind CSS. Deployed statically on Cloudflare Pages.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **3D Engine:** Three.js + React Three Fiber + Drei
- **Animations:** GSAP, Framer Motion, Lenis (Smooth Scroll)
- **Forms:** React Hook Form + Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Editing Content
All textual content and configurable options live inside `src/data/`:
- `site.ts`: Basic metadata, phone number, URLs.
- `services.ts`: The 6 service cards.
- `projects.ts`: The portfolio/case studies.
- `process.ts`: The 4 step methodology.
- `stats.ts`: Numbers for the animated counters.
- `techStack.ts`: Tools for the scrolling marquee.
- `navigation.ts`: Navbar and footer links.

Simply edit these files, and the UI will automatically update. No need to touch the component code!

## Deployment
See `DEPLOY.md` for Cloudflare Pages instructions.
