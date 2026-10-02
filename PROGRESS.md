# UPGRADE PROGRESS

Status: all five phases are WRITTEN. None of it has been built or viewed in a browser yet
(the sandbox it was written in had no npm access). First steps: `npm install`, `npm run build`, `npm run dev`.
No new dependencies were added (gsap, lenis, framer-motion, three, @react-three/* were already in package.json).

## PHASE 1: FIX BUGS
- [x] 1.1 Hero headline: plain server-rendered text; hidden start state only set after JS mounts (`ui/HeroHeadline.tsx`)
- [x] 1.2 "Grow faster." gradient blue -> cyan
- [x] 1.3 3D scene: single canvas inside the hero's right column (`3d/HeroScene.tsx`), no more global fixed layer
- [x] 1.4 Floating button = WhatsApp logo SVG, wa.me/918918818386 with pre-filled greeting. Call stays separate (hero, contact, footer)
- [x] 1.5 Navbar uses /logo.svg (c2pa metadata stripped from the file)
- [x] 1.6 Phone placeholder "+91 98765 43210"; schema now accepts spaces/hyphens so that format validates
- [x] 1.7 Stats: invented numbers removed; 3 counts derived from the site's own data files (services, technologies, case studies)
- [x] 1.8 Projects: "Result" -> "What we built" (facts taken from the real screenshots + stack). Heading "Real results" -> "Products we've built."

## PHASE 2: HERO 3D
- [x] Extruded D4 logo built from the real SVG paths (D, 4, tail + ring node as separate meshes, holes kept, gradients as vertex colours)
- [x] Particle assembly (GLSL points sampled from the logo surface, GSAP timeline), then float + cursor tilt
- [x] Bloom on the cyan ring node (selective via luminanceThreshold)
- [x] Orbiting tech icons (8 desktop / 6 mobile), different radius, tilt, speed, depth
- [x] 3 floating glass code panels with typing animation + parallax (desktop only)
- [x] GLSL circuit-trace background with travelling pulses reacting to the mouse
- [x] Lite mode (phones / touch / weak devices): fewer particles, no postprocessing, no code panels
- [x] Pauses when off-screen, dpr capped at 2, resources disposed, WebGL-less fallback = static logo

## PHASE 3: TEXT
- [x] Hero headline char split, masked rise + rotateX + skew + stagger, gradient sweep once
- [x] Rotating scramble line (web apps / mobile apps / AI automations / SaaS platforms)
- [x] Scroll-linked word highlight (hero paragraph + section subtitles)
- [x] Section titles: clip-path reveal + letter-spacing tween; eyebrows scramble/decode
- [x] Odometer counters
- [x] Marquee reacts to scroll velocity and direction
- [x] prefers-reduced-motion respected everywhere (Lenis off, static text, no pin)

## PHASE 4: CARDS
- [x] Services: depth entrance, 3D tilt + glare + spotlight border, icon micro-animations
- [x] Process: pinned on desktop, SVG line draws 01 -> 04, cards flip/lift in; unpinned vertical version on mobile
- [x] Work: sticky stacking cards (scale + dim), parallax on screenshots
- [x] Tech chips magnetic + glow; buttons magnetic + shine sweep

## PHASE 5: PROJECT DEMOS
- [x] Screenshots cropped (browser chrome removed), converted to webp in /public/projects, originals moved to /source-screenshots
- [x] 3D browser/laptop mockup with hover tilt + scroll parallax; lazy images, width/height, real alt text
- [x] "Project demo" modal: carousel (arrows, swipe, ESC, focus trap), caption, stack tags
- [x] Live demo buttons: URLs supplied by the owner (DriftWatch, PrepSense AI, ReviewFlow, StreamSense, SchoolPortal 360). FinVault has no URL, so no button. No Source buttons (no repo URLs supplied).
- [x] PrepSense AI screenshot added
- [x] SchoolPortal 360 added as a 6th project. Its text is limited to what its own landing page shows; stack is empty (hidden) until the real stack is provided.

## EXTRA
- [x] Rounded favicon from the logo (favicon.ico 16/32/48, icon-192, icon-512, apple-touch-icon, icon.svg) and a proper 1200x630 og-image.png
