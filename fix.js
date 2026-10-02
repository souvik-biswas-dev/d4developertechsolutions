const fs = require('fs');

// 1. Fix manifest.ts
let manifest = fs.readFileSync('src/app/manifest.ts', 'utf-8');
manifest = manifest.replace(/purpose: 'apple touch icon',?\n?/g, '');
fs.writeFileSync('src/app/manifest.ts', manifest);

// 2. Fix AnimatedCounter.tsx
let counter = fs.readFileSync('src/components/ui/AnimatedCounter.tsx', 'utf-8');
counter = counter.replace(/const \[count, setCount\] = useState\(0\);\n  const ref = useRef<HTMLSpanElement>\(null\);\n  const isInView = useInView\(ref, { once: true, margin: '-10% 0px' }\);/, "const [count, setCount] = useState(0);\n  const [ref, isInView] = useInView<HTMLSpanElement>({ triggerOnce: true, rootMargin: '-10% 0px' });");
fs.writeFileSync('src/components/ui/AnimatedCounter.tsx', counter);

// 3. Fix SectionHeading.tsx
let heading = fs.readFileSync('src/components/ui/SectionHeading.tsx', 'utf-8');
heading = heading.replace(/const ref = useRef<HTMLDivElement>\(null\);\n  const isInView = useInView\(ref, { once: true, margin: '-10% 0px' }\);/, "const [ref, isInView] = useInView<HTMLDivElement>({ triggerOnce: true, rootMargin: '-10% 0px' });");
fs.writeFileSync('src/components/ui/SectionHeading.tsx', heading);

// 4. Fix TextReveal.tsx
let textReveal = fs.readFileSync('src/components/ui/TextReveal.tsx', 'utf-8');
textReveal = textReveal.replace(/const ref = useRef<HTMLElement>\(null\);\n  const isInView = useInView\(ref as React.RefObject<Element>, { once: true, margin: '-10% 0px' }\);/, "const [ref, isInView] = useInView<HTMLElement>({ triggerOnce: true, rootMargin: '-10% 0px' });");
fs.writeFileSync('src/components/ui/TextReveal.tsx', textReveal);

// 5. Fix MagneticButton.tsx
let magButton = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf-8');
magButton = magButton.replace(/let requestRef: number;/g, "let requestRef = 0;");
fs.writeFileSync('src/components/ui/MagneticButton.tsx', magButton);

