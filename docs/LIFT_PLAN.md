# The lift plan for 5.0.0

**Purpose.** S48: 5.0.0 lifts every theme, research first, synthwave
next; the next theme is chosen from the findings. Kenny answered the
findings form on 2026-09-07: **all twenty-four directions adopted**, and
the order is **by finding quality** — the themes with measured next-level
references first, the themes that need a second research pass last. This
document is the spine (TH134): one row per theme, the direction each
round starts from, and three statuses that a round advances.

**The four steps every theme takes** (the same for all of them):

1. **Research** — a sweep like the one in `docs/RESEARCH_2026-09.md`;
   every claim labelled measured or observed. Done for all twenty-four on
   2026-09-07; the five themes marked "second research pass" get a
   targeted sweep before their demo.
2. **Concept demo** (S46) — the standard page (navbar with dropdown, hero
   with headline, lede with emphasis and two buttons, section rule, form,
   dossier card, tear, footer) rendered in the theme, approved by Kenny
   before a token is written. **The demo is published at a URL Kenny can
   open in a browser, and the approval form names that link** (Kenny,
   2026-09-07: "zie dat die geopend kan worden in de browser, geef ook de
   link"): on the documentation site under `concept/<theme>.html` once
   TH126 exists, and until then as a Claude artifact. A demo that can
   only be seen by opening files from git is not a demo.
3. **A short Phase 2 list** — the theme's features rated on the fixed
   scale, frozen, outside the round-six freeze by design.
4. **Build** — tokens (the contract grows where needed, S47), register
   rules for every component root (the TH124 coverage gate), the theme's
   answers to the five hooks (S45), DI5 computed and reported (S42), the
   concept demo as its fixture.

**What "done" means before 5.0.0 is tagged:** every row shows build
"done"; the parity gates (tokens, hooks, coverage) are green across all
themes; the documentation site shows each theme's concept demo.

**Order and directions** (adopted 2026-09-07; "cyberpunk" is round six
itself and is not in this list):

| # | Theme | Verdict of the sweeps | Best references | Direction adopted | Hazards to respect | Research | Demo | Build |
| - | ----- | --------------------- | --------------- | ----------------- | ------------------ | -------- | ---- | ----- |
| 1 | synthwave | new theme — the next to build | Synthwave '84 glow rule, Retro Racer plane, nightride.fm | striped sun by mask, conic-gradient grid with horizon glows, chrome type with one shine, the tube that switches on, two-colour inset vignette, boot sequence with skip | CRT flicker 133/s (never), pink on card ground 4.34, personal-use fonts | done | **approved 2026-09-08** — "Outrun Horizon", <https://claude.ai/code/artifact/78b7076b-a1d1-4a48-847f-7667c4c34722> (Kenny: "exact wat ik verwacht qua kwaliteit") | — |
| 2 | phantom | next level in all three sweeps | Omicron69 Persona 5 portfolio, Dead North | skewed bar behind hover items, clip-path silhouette, view() scroll timeline without JS, steps(3) film cuts | none — every gesture is transform or clip | done | — | — |
| 3 | retro | next level; the most completely measured reference | 98.css, Win95 SGJ, 2bit.chat | four-inset bevel with 1px label shift, SVG border-image groove, dithered scrollbar track, image-rendering: pixelated | 98.css focus outline is forbidden by DI2; our two-ring focus stays | done | — | — |
| 4 | terminal | next level in all three sweeps that covered it | PX PUSH, ekeijl, dottxt.ai | block cursor per glyph (1ch), sweep band resting 8 of 10 s, bezel by border-image, bitmap display without anti-aliasing | flicker .15s infinite is over DI5 — not ported; PX PUSH raster jitter unassessed — left out | done | — | — |
| 5 | brutalism | next level; three measured sites | Gumroad, BEIGE FORCE, Future Pharmaceutical | lift/drop shadow pair, pixel outline from four box-shadows, relative-colour hover via oklch(from …), seamless -50% marquee | none | done | — | — |
| 6 | pastel | next level; "a kit" and "a system" | Chris Lemke Risograph, Aardvark Book Club | multiply overprint second pass on headings, 6px halftone raster, base/soft colour pairs as tokens, springy easing | none | done | — | — |
| 7 | blueprint | next level; two measured sites cover the idiom | vercel.com grid system, SUTÉRA | "+" crosshairs at intersections, dashed guide tile, cyanotype photo filter via mix-blend-mode: color, chamfer from the grid margin | none | done | — | — |
| 8 | deco | next level; the idiom literally | Le Bathyscaphe, Empire State Building | four concentric inset frames, chevron cartouche clip-path, eleven-step gold ramp as tokens, oval photo clip | none | done | — | — |
| 9 | sepia | next level; three measured sites | craigmod.com, Miranda paper portfolio, Public Domain Review | multiply paper layer, 7vw drop cap, stroke-dashoffset drawn underline on hover, double gold rule as divider | none | done | — | — |
| 10 | academia | next level | Chris Lemke Dark Editorial, Mosby's Files | duotone overlay via mix-blend-mode, 40px ribbon underline, folder stack card variant | none | done | — | — |
| 11 | mono | next level (rauno.me) | rauno.me, Vercel Geist tokens | overhanging hairline that fades at 90%, mask-image fade under chrome, inverting link | none | done | — | — |
| 12 | grotesk | next level | Grilli Type, Hiroto Sato | asymmetric link timing (.1s in / .15s out), blur+brightness page transition, 14-column grid | none | done | — | — |
| 13 | topo | next level (Culpepper) | Adam Culpepper contour hero | generated contour field as section background (static default), optional draw-in through the effects module, radial-gradient rings as zero-asset fallback | none | done | — | — |
| 14 | high-contrast | next level (Lando Norris) | landonorris.com | ghost-text button, ellipse clip reveal, nav recolour on scroll | none | done | — | — |
| 15 | dark | next level by proxy | Dead North dark palette, Phantom.Land | difference-blend chrome over imagery, grain layer with an opacity token | none | done | — | — |
| 16 | formal | next level (anthropic.com) | anthropic.com, Amsterdam Vintage Watches | recolouring offset underline, ivory triplet as three ground tints, condensed display serif | anthropic.com is Kenny's own vendor — a conscious choice | done | — | — |
| 17 | shade-light | next level (NOTHIN') | noth.in | blurred section seam as divider, mono cursor label | none | done | — | — |
| 18 | solstice | next level for mechanisms; palette neutral | Isabel Moranta, Firewatch | display serif at 10.5rem/-.04em/.91, difference-blend chrome, the amber/rust/black triad as calibration | none | done | — | — |
| 19 | nostromo | nothing for the case; controls next level | Terminal Industries, teenage.engineering | clip-inset popdown reveal, tracked mono button, ratio-dimensioned sheet | Vault-Tec flicker .1s infinite is 10 Hz — not ported | done | — | — |
| 20 | nishiki | ordinary only; one transferable texture | css-pattern.com seigaiha, Yokai World | seigaiha texture as CSS-only pattern, the vermilion/paper pair; a second research pass before the demo | none | done | — | — |
| 21 | tazhib | nothing at the bar; one observed recipe | Curio girih ruling (observed) | four-ring ruling in one declaration; a second research pass before the demo | none | done | — | — |
| 22 | light | no reference of its own | Aardvark Book Club (via pastel) | base/soft colour pairs, rounded section clip; a second research pass before the demo | none | done | — | — |
| 23 | ticker | nothing for the idiom | Curio Bloomberg guide (observed), Lando Norris marquee | marquee primitive paused until visible, one-pixel dim dividers, cuts not dissolves; a second research pass before the demo | none | done | — | — |
| 24 | shade-dark | nothing beyond one observed candidate | The Obsidian Assembly (observed) | the blurred seam of shade-light in the dark direction; a second research pass before the demo | none | done | — | — |

**Status vocabulary:** `—` not started · `open` in progress · `done` ·
`skipped (reason)`.

**Gate log per theme** lands in `docs/REALIZATION_PLAN.md` as each round
runs, per standing rule 5.
