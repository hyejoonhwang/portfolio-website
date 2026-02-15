# Summer — Design System

## Typography

### Fonts
- **Boska** (Variable, 100–900) — Headings, display text, logo, taglines
- **General Sans** (Variable, 100–900) — Body text, UI elements, navigation, labels

### Scale
| Role | Font | Weight | Size | Line Height | Letter Spacing |
|------|------|--------|------|-------------|----------------|
| Logo | Boska Italic | 300 | 1.45rem | — | -0.02em |
| Page heading (h1) | Boska | 300 | 2rem | 1.2 | -0.02em |
| Section heading (h2) | Boska | 300 | 1.65rem | 1.35 | -0.015em |
| Subheading (h3) | Boska | 300 | 1.4rem | 1.35 | -0.01em |
| Tagline / display | Boska | 300 | 1.5rem | 1.35 | -0.015em |
| Body | General Sans | 300 | 0.95rem | 1.75 | 0 |
| Body (large) | General Sans | 300 | 1.05rem | 1.65 | 0 |
| Small body | General Sans | 300 | 0.85rem | 1.55 | 0 |
| Nav links | General Sans | 400 | 0.85rem | — | 0.01em |
| Section label | General Sans | 500 | 0.7rem | — | 0.08em, uppercase |
| Caption / meta | General Sans | 300 | 0.78rem | — | 0.01em |

### Emphasis
- `strong` — General Sans weight 500, color: var(--text)
- `em` — italic
- `u` — underline with var(--accent) color, 1.5px thickness, 3px offset

## Colors

### Core Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | #FFFFFF | Page background |
| `--text` | #1C1917 | Primary text |
| `--text-muted` | #847F7A | Secondary text, body copy |
| `--text-faint` | #B8B3AD | Tertiary text, labels, captions |
| `--border` | #EEEDEB | Dividers, borders |
| `--accent` | #D4A68C | Warm terracotta — links, underlines, highlights |

### Project Card Colors
| Token | Hex |
|-------|-----|
| `--sage` | #E8EDE4 |
| `--terracotta` | #EEDDD2 |
| `--slate` | #D6DFE9 |
| `--stone` | #E2DFDB |
| `--lavender` | #DDD8E4 |

### Placeholder
- Background: `linear-gradient(135deg, #F0F0F0, #E8E8E8)`

## Spacing

- Nav height: 64px (56px mobile)
- Nav padding: 0 20px (0 16px mobile)
- Content max-width: 740px (narrow), 960px (wide), 1100px (two-column)
- Section padding: 80px 0 (56px mobile)
- Grid gap: 6px

## Components

### Navigation
- Logo: Boska italic 300, links to `/`
- Links: General Sans 400, color var(--text-muted)
- Active: color var(--text), underline scaleX(1)
- Hover: color var(--text), 1px underline animates from center

### Section Labels
- General Sans 500, 0.7rem, uppercase, letter-spacing 0.08em
- Color: var(--text-faint)

### Dividers
- Dashed: `1px dashed var(--border)` — used between case study sections
- Solid: `1px solid var(--border)` — used in lists, about page

### Cards
- Border radius: 4px
- Project hover: opacity 0.88, info reveals on hover (desktop)

### Animations
- fadeUp: translateY(16px) → 0, opacity 0 → 1
- Duration: 0.6–0.7s
- Easing: cubic-bezier(0.22, 1, 0.36, 1)
- Stagger: 0.05s increments

## Navigation URLs
- Home: `/`
- Work: `/work.html`
- About: `/about.html`
- Blog: `/blog.html`
- Project pages: `/weave.html`, etc.
