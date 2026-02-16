# Summer — Design System & Documentation

> Portfolio site for Summer, a product designer at NYU ITP based in Brooklyn.
> Built with vanilla HTML/CSS/JS. No frameworks.

---

## File Structure

```
summerport/
├── index.html          # Home — 3×2 grid: bio card + 5 project cards
├── work.html           # Work — project grid + archive list
├── about.html          # About — polaroid photo + bio text + currently
├── blog.html           # Blog — featured post + post list
├── weave.html          # Case study — Weave (Global Market Entry)
├── dearflower.html     # Case study — Dear Flower (TBD)
├── shared.css          # Global styles: fonts, tokens, nav, cutout hover, animations
├── cutout.js           # Magazine cutout letter effect + mobile nav toggle
├── fonts/              # Boska & General Sans variable font files
│   ├── Boska-Variable.ttf
│   ├── Boska-VariableItalic.ttf
│   ├── GeneralSans-Variable.ttf
│   └── GeneralSans-VariableItalic.ttf
└── images/
    ├── summerlogo.png         # Balloon-style "SUMMER" logo
    ├── summmerhomeintro.png   # Holographic "Hello my name is Summer" sticker
    └── IMG_2090.jpg           # Summer's photo (about page polaroid)
```

---

## Typography

### Fonts
- **Boska** (Variable, 100–900) — Display text, bio body, about page prose, headings
- **General Sans** (Variable, 100–900) — Nav links, labels, project titles, UI elements
- **Caveat** (Google Font, 400–600) — Handwritten polaroid caption (about page only)

### Key Sizes
| Element | Font | Size | Notes |
|---------|------|------|-------|
| Bio body (home) | Boska | 1.12rem | Justified, weight 400 |
| About intro | Boska | 1.65rem | First paragraph, larger hierarchy |
| About body | Boska | 1.15rem | Remaining paragraphs |
| Nav links | General Sans | 0.85rem | Weight 400, cutout letter effect |
| Project titles | General Sans | 0.85rem | Weight 400 |
| Project numbers | Cutout style | 0.75rem | Weight 500, uppercase |
| Section labels | General Sans | 0.72–0.75rem | Uppercase, letter-spacing 0.06em |
| Polaroid caption | Caveat | 0.82rem | Handwritten feel, weight 500 |
| Mobile nav | Boska | 2.2rem | Full-screen overlay |

### Magazine Cutout Effect (`cutout.js`)
Each `.cutout` element has its letters wrapped in individual `<span>`s with randomized:
- **Font**: Boska, General Sans, Georgia, Courier New, Times New Roman
- **Color**: #F5542E, #F2C327, #008B6E, #00AEDE, #0067AD, #2A2725
- **Size**: 0.88–1.18em
- **Weight**: 400–800
- **Rotation**: -5° to 5°
- **Vertical offset**: -1.5px to 1.5px
- **Background**: Occasional pastel paper scraps (yellow, pink, blue, green, purple, orange)

**Nav links use deterministic seeded randomization** — same letter styling on every page load and across all pages. Body cutout text remains truly random.

**Drop cap**: `.cutout-drop` class renders at 1.8em for medieval initial letter style (used on about page "I'm").

**Punctuation**: Rendered smaller (0.6em), no rotation, no background.

### Hover Micro-interactions
- **Nav cutout letters**: Staggered lift/settle wave on hover (nth-child 3n patterns), scale 1.05–1.1
- **Body cutout words**: Gentler lift on hover, scale 1.04–1.06
- **Mobile nav cutout**: Bigger bounce for large text, scale 1.08–1.12
- All use `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy feel
- CSS custom properties `--rot`, `--y`, `--delay` enable layered transforms

---

## Colors

### Core Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `oklch(98.5% 0.001 106.423)` | Warm cream page background |
| `--surface` | `#FFFFFF` | Card surfaces |
| `--text` | `#2A2725` | Primary text |
| `--text-muted` | `#6B6560` | Secondary text |
| `--text-faint` | `#A8A29D` | Labels, captions |
| `--border` | `#E8E6E3` | Dividers |
| `--accent` | `#FF3C00` | Red-orange — sharpie underlines, hearts |

### Cutout Colors
`#F5542E` (red) · `#F2C327` (yellow) · `#008B6E` (green) · `#00AEDE` (cyan) · `#0067AD` (blue) · `#2A2725` (dark)

### Project Card Colors (currently all `rgba(0,0,0,0.03)`)
Tokens defined but unused: `--sage`, `--terracotta`, `--slate`, `--stone`, `--lavender`, `--wheat`

---

## Spacing & Layout

- **Grid gap**: 6px (`--gap`)
- **Nav height**: 64px desktop, 56px mobile
- **Nav padding**: 0 20px desktop, 0 16px mobile

### Home Page Grid
- 3×2 CSS grid: `grid-template-columns: repeat(3, 1fr)`
- Top row: bio card, project 1, project 2
- Bottom row: project 3, project 4, project 5
- Mobile: single column stack

### About Page
- Two-column flex: left sidebar (340px) + right content
- Tablet: left shrinks to 260px
- Mobile: stacks vertically, photo scales to 240px centered, "Currently" moves below text via `display: contents` + `order`

---

## Components

### Navigation (shared.css)
- **Logo**: `summerlogo.png`, max-height 32px, tilts -3° on hover (bouncy easing)
- **Links**: Cutout letter effect, deterministic styling
- **Active indicator**: Sharpie-style underline — 2px, `--accent` color, rotation -0.6deg, skew -1.5deg, opacity 0.85
- **Hover**: Sharpie underline animates from left via `scaleX(0→1)`
- **Hamburger** (mobile): 3 colorful bars (#F5542E, #008B6E, #0067AD) with slight rotations, animates to X
- **Mobile overlay**: Fixed fullscreen, Boska 2.2rem links, staggered fadeUp

### Home Bio Card
- **Sticker**: Holographic "Hello my name is Summer" (120px), links to /about.html, tilt hover (-1.5° → +1°), layered drop-shadows
- **Location**: "based in" (General Sans 0.72rem) + "Brooklyn" (cutout, 1rem), stacked next to sticker
- **Bio text**: Boska 1.12rem justified, with inline emojis:
  - Hearts (❤) around "loves" — 0.65em, red, slight rotations
  - Hammer (🔨) before "building" — 0.85em, links to /work.html, scales 1.08x on hover
- **CTA**: Phone emoji (📞, tilted -12°) + "open to new opportunities, book a call" link (placeholder href)
- **Cutout words**: "messy", "human", "build"

### About Page Polaroid
- Polaroid card: cream background, 14px padding, slight rotation (-1.5°), layered box-shadow, gloss overlay via `::after`
- Photo: 3:4 aspect ratio, `object-fit: cover`, center position
- Caption: Caveat handwritten font — "Summer in the summer · 07/04/2025 · Brooklyn, NY"

### Project Cards
- Hover: opacity 0.88, info slides up (translateY), arrow slides in (translateX)
- Project numbers: cutout magazine style
- Titles: General Sans 0.85rem
- Arrows: cutout magazine style (random font/color/rotation)
- Tablet/mobile: info always visible

### Animations
- `fadeUp`: `translateY(16px) → 0, opacity 0 → 1`
- Duration: 0.6–0.7s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Stagger: 0.03–0.05s increments between children
- Bouncy interactions: `cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## Pages & Content

### Home (`index.html`)
- 3×2 grid with bio + 5 projects
- Projects:
  1. **Weave — Global Market Entry** → `/weave.html`
  2. **Dear Flower** → `/dearflower.html`
  3. Project Title (placeholder)
  4. Project Title (placeholder)
  5. Project Title (placeholder)

### Work (`work.html`)
- "Selected Work" heading (cutout style)
- Same 5 projects in grid (first card spans 2 columns)
- Archive section below: Moss Garden, Mystery Die, Motion Capture Archive, VR Hedonomics

### About (`about.html`)
- Left: Polaroid + quick links (Email, Resume, LinkedIn, Twitter) + Currently (Reading, Exploring, Listening)
- Right: 5 paragraphs with cutout highlights on "NYU ITP", "real life", "messy research", "prototyping", "make it feel real"
- Drop cap "I'm" in first paragraph

### Blog (`blog.html`)
- "Featured Post" label (cutout style) + featured image + title (1.75rem)
- "All Posts" label (plain uppercase) + post list

### Weave (`weave.html`)
- Case study page with custom `--accent: #3B5BF5` (blue)

---

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| > 1024px | Desktop — full grid, hover interactions |
| ≤ 1024px | Tablet — info always visible, smaller gaps |
| ≤ 900px | About page — narrower sidebar |
| ≤ 640px | Mobile — single column, hamburger nav, stacked layout |

---

## Status & TODOs

- [ ] `dearflower.html` — case study page (needs content + cover gif)
- [ ] Projects 3–5 — placeholder titles, need real content
- [ ] Project card background images/colors — currently all `rgba(0,0,0,0.03)`
- [ ] Quick links — Resume, LinkedIn, Twitter hrefs are `#`
- [ ] Bio CTA — Calendly link needed for "book a call"
- [ ] Blog — content for posts
- [ ] Weave case study — may need refinement
