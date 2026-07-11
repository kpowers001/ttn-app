# Design System

## Overview

Mobile-first app UI. The phone shell (390×844px) is the primary canvas. Screens are rendered inside a fixed-dimension frame during prototyping; the production build will fill real device viewports. All visual decisions carry Tuskegee University's institutional crimson-and-gold identity while staying warm, energetic, and approachable for a student audience.

---

## Color

### Brand tokens

| Token | Hex | Role |
|---|---|---|
| `--crimson` | `#8B1A1A` | Primary brand; headers, CTAs, active states |
| `--crimson-dark` | `#6B1010` | Gradient start; deep header depth |
| `--gold` | `#C8A415` | Secondary brand; rewards, progress, tier accents |
| `--gold-dark` | `#7A5500` | Business-owner accent; text on gold surfaces |
| `--gold-light` | `#FFF8DB` | Tinted surface behind point tags and badges |
| `--bg` | `#F8F5EF` | App screen background |
| `--surface` | `#FFFFFF` | Card and sheet surfaces |
| `--ink` | `#1A1A1A` | Primary text |
| `--ink-secondary` | `#666666` | Subtitles, helper text |
| `--ink-muted` | `#AAAAAA` | Timestamps, disabled labels |
| `--border` | `#F0F0F0` | Dividers, inactive card borders |

### Trail palette (semantic, not brand)

Each trail has a dedicated color used only for its map pins, trail filter pills, and progress bars. Never used for global chrome.

| Trail | Color |
|---|---|
| Food | `#D44000` |
| History | `#8B1A1A` (shares crimson) |
| Farm | `#2E7D32` |
| Arts | `#6A1B9A` |

### Gradients

| Usage | Value |
|---|---|
| Screen headers (primary) | `linear-gradient(135deg, #6B1010, #8B1A1A)` |
| Rewards / Gold header | `linear-gradient(135deg, #7A5500, #C8A415)` |
| CTA buttons | `linear-gradient(135deg, #6B1010, #8B1A1A)` |
| Challenge card accent | `linear-gradient(135deg, #8B1A1A, #C8A415)` |
| Splash screen | `linear-gradient(155deg, #6B1010 0%, #8B1A1A 55%, #9B7A00 100%)` |
| App shell (desktop preview bg) | `radial-gradient(ellipse at top, #3d0a0a 0%, #1a0505 40%, #0d0d1a 100%)` |

### Reward tier palette

Used exclusively on the Rewards screen.

| Tier | Color |
|---|---|
| Bronze | `#CD7F32` |
| Silver | `#9E9E9E` |
| Gold | `#FFD700` |
| Platinum | `#90CAF9` |
| Legend | `#C8A415` |

---

## Typography

### Typefaces

| Role | Family | Usage |
|---|---|---|
| Display / brand | `Georgia, serif` | App name on splash, main headings on branding screens |
| UI / body | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | All interactive elements, body copy, navigation |

*Note: Production build should evaluate replacing the system-UI stack with a single variable font (e.g. Inter or DM Sans) loaded at 400/600/800 for consistent cross-platform rendering.*

### Scale

| Step | Size | Weight | Usage |
|---|---|---|---|
| `--text-xs` | 9px | 700 | Tab bar labels |
| `--text-2xs` | 10–11px | 600 | Metadata, timestamps |
| `--text-sm` | 12–13px | 400–600 | Secondary labels, status bar, hint text |
| `--text-base` | 14–15px | 400–700 | Body copy, list items, card subtitles |
| `--text-lg` | 17px | 700–800 | Section headings |
| `--text-xl` | 19–22px | 700–900 | Card titles, screen titles |
| `--text-2xl` | 26–30px | 800–900 | Feature headings, welcome screens |
| `--text-3xl` | 32–34px | 900 | Role-select headline, large onboarding heads |
| `--text-hero` | 76px | — | Decorative emoji/icon only; not for text |

---

## Spacing

Spacing is ad hoc at the prototype stage. The implicit rhythm is 4px base with multiples:

| Name | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon gaps, tight badges |
| `--space-2` | 8–10px | Badge padding, small gaps |
| `--space-3` | 12–14px | Row gaps, stacked lists |
| `--space-4` | 16px | Card internal padding, column gaps |
| `--space-5` | 20–24px | Section horizontal padding, content margins |
| `--space-6` | 28–32px | Screen top padding |
| `--space-7` | 40–60px | Onboarding generous padding, splash |
| `--space-tab` | 82px | Tab bar height (fixed) |
| `--space-status` | 44px | Simulated status bar height |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Tags, point badges, pill labels |
| `--radius-md` | 14–16px | Input fields, buttons, small cards |
| `--radius-lg` | 18–22px | Primary cards, challenge cards |
| `--radius-xl` | 36–40px | Modal sheets, header bottom curve |
| `--radius-pill` | 50% | Avatars, story rings, map pins |
| `--radius-phone` | 52px | Device frame |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 2px 10px rgba(0,0,0,0.07)` | Default card elevation |
| `--shadow-card-md` | `0 4px 20px rgba(0,0,0,0.1)` | Floating cards, stats row |
| `--shadow-button` | `0 8px 24px {accent}44` | Primary CTA buttons (colored) |
| `--shadow-tab` | `0 -4px 24px rgba(0,0,0,0.07)` | Tab bar lift |
| `--shadow-story-ring` | `0 4px 14px {storyColor}50` | Story avatar glow |
| `--shadow-phone` | `0 0 0 2px #444, 0 0 0 6px #222, 0 40px 120px rgba(0,0,0,0.9)` | Device frame presentation |

---

## Animation

| Name | Definition | Usage |
|---|---|---|
| `fadeUp` | `opacity 0→1, translateY 18px→0, 0.5–0.9s ease` | Screen transitions, card entrances |
| `pulse` | `opacity 1↔0.4, infinite` | Loading dots on splash |
| `glow` | `box-shadow 8px→20px gold glow, infinite` | Active gold elements, map pins |

*Reduced-motion alternative: instant opacity crossfade (0ms transform, opacity only). Not yet implemented — add `@media (prefers-reduced-motion: reduce)` overrides before production.*

---

## Components

### Screen header

Crimson gradient top bar containing simulated status bar (44px), screen title at `--text-xl` / 900 weight in white, optional subtitle in `rgba(255,255,255,0.65)`. Summary row (points/tier/rank) rendered on a `rgba(255,255,255,0.14)` frosted surface with 18px radius.

### Tab bar

82px fixed footer. White surface, `1px solid #eee` top border, `--shadow-tab`. Each tab: emoji icon (22px) + label at 9px/700. Active state: 3px crimson bar above icon + crimson label; inactive: grayscale 45% opacity emoji + `#aaa` label. Home indicator space absorbed into bottom padding.

### Cards

Default: white surface, `--radius-lg` (18–22px), `--shadow-card`. No left-stripe borders. Content rows use 14px gap between icon and text. Metadata tags on `--gold-light` background for point values; neutral `#f5f5f5` for timing. Primary CTA inside card: full-width gradient button, 14px radius, 13px white padding.

### Section header

`--text-lg` (17px/800) left-aligned title + optional right-aligned action link in `--crimson` at 13px/700. Horizontal margin matches screen padding (20px).

### Tags / Badges

8px radius, tinted background derived from parent trail or brand color at ~15% opacity, dark text from that same color family. Point tags always use `--gold-light` bg + `--gold-dark` text. Live indicator: `#FF3B30` + white text, 10px/800.

### Story ring

64–66px circle, full bleed emoji/avatar centered. Ring border 3px in story's own color. Glow shadow `{storyColor}50`. Name label below at 10px/700.

### Form fields

14px radius, `2px solid #e8e8e8` default border, transitions to `2px solid {accent}` on focus. 14–15px input text, 11px uppercase label above. Select: native appearance removed.

### Badge grid

4-column grid with 10–12px gap. Each cell: white surface, 16px radius, 2px border. Earned: white bg + `--gold-light` border tint + full-opacity emoji. Locked: `#f9f9f9` + `#f0f0f0` border + grayscale emoji + 50% opacity.

### Leaderboard podium

Three-column flex row, items aligned to their bottom edge (tallest in center). Column: avatar emoji, name label, colored column block (height proportional to rank). Rank 1 gold, rank 2 silver-gray, rank 3 bronze. 

### Progress bar

6–8px height, `#f0f0f0` track, rounded 4px. Fill uses trail color or brand color. No animation at prototype stage; production should add a width transition on mount.

### Map

100% fill of allocated height. SVG overlay on a dark teal base (`#3A6B1A`). Trail filters as pill buttons above. Location markers: 38px rotated-square pin, trail color when visited, `#555` with lock icon when locked. Selected location: bottom sheet card, white, 22px radius, animated up with `fadeUp`.

---

## Layout patterns

- **Screen chrome**: Status bar (44px) + gradient header (variable) + scrollable content area + tab bar (82px fixed). `height: calc(100% - 82px)` for content.
- **Horizontal scroll rows**: Stories and upcoming challenge cards. `overflowX: auto`, `flexShrink: 0` on children. No visible scrollbar (`::-webkit-scrollbar: display none`).
- **Section stacks**: 20–22px top padding per section, `flex-direction: column`, 10–14px gap between items.
- **Pill filter rows**: `overflowX: auto`, 14px horizontal padding, 8px gaps. Buttons shrink-0.
