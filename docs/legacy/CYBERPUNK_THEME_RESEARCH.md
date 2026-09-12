<!-- Copied from kp-soft on 2026-09-02 at commit 2983abb; kp-themes is the home of the house themes from now on -->

# Cyberpunk theme research (T1)

Research pass 2026-08-31, on Kenny's request: what makes a cyberpunk theme
a cyberpunk theme on the web — beyond the palette. Sources: four search
sweeps, two design-system specs read in full, and live CSS extraction from
running sites. Feeds the theme work under T1 (the five-theme design system).

## Live findings (extracted, not assumed)

**cyberpunk.net** (official game site, inspected in-browser):
- Fonts: BlenderPro Book/Bold (the game's brand font), Refinery-25.
- Colours in computed styles: signature yellow `#FCEE0A`, cyan `#00F0FF`,
  orange-red `rgb(255,96,0)`, warm greys.
- The signature shape: ONE clipped corner per panel,
  `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)`.
  Not every corner — a single notch, asymmetric.
- A blinking terminal caret animation on the newsletter input.
- Restraint: three accent colours, flat surfaces, no permanent glitch.

**n-o-d-e.net** (indie cyberpunk zine): the opposite pole — Share Tech
Mono everywhere, `#222` background, monochrome grey text. Cyberpunk as
*terminal minimalism* rather than neon. Proof that the aesthetic reads
even without colour, through type and density alone.

**Arwes** (sci-fi UI framework): staged enter/exit animators (UI that
"assembles" on entry), frame components with corner brackets, background
patterns (grids, dots, moving lines), text decipher effects, and "bleeps"
— short UI sounds on state transitions.

**Cyberpunk 2077's four in-game styles** (from UI analyses): Kitsch
(bright, rounded), Neo-Militarism (straight, sharp, authoritative — the
default HUD), Neo-Kitsch (substance + style) and Entropism (deliberately
dated tech). The game's HUD language is the register that matches our
formal-adjacent "strak" goal: sharp, flat, angular, red/cyan on black.

## The five pillars (what actually makes it read as cyberpunk)

1. **Darkness as canvas** — near-black with a colour cast (blue/purple),
   never pure #000; neon only works against it.
2. **Neon as signal, not decoration** — 1–3 saturated accents used
   sparsely for interactive/important things; a page that is ALL neon
   reads as vaporwave, not cyberpunk.
3. **The terminal register** — monospace, ALL-CAPS microlabels, data
   density, IDs/coordinates/timestamps as decoration ("diegetic data").
4. **Imperfection on top of precision** — scanlines, grain, occasional
   glitch: technology that is powerful but worn. Key word: occasional.
   Permanent glitch is noise; rare glitch is an event.
5. **Angular geometry** — clipped corners, notches, HUD brackets,
   hairline connector lines. augmented-ui's insight: it is clip-path
   plus a pseudo-element sandwich, cheap and composable.

## Technique notes (performance + a11y, from the research)

- Animated `box-shadow`/`text-shadow` re-blurs every frame. The correct
  pattern: put the glow on a pseudo-element and animate its **opacity**
  (compositor-only). Cap blur radii; few glowing elements per view.
- Chromatic aberration = two text copies in `::before`/`::after`,
  magenta/cyan, `mix-blend-mode: screen`, shifted 1–2px. Banded glitch =
  `clip-path: inset()` keyframes on those copies.
- Scanlines = `repeating-linear-gradient` overlay at 2–4% opacity,
  `pointer-events: none`. Optional slow drift.
- Every motion effect wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Glow never carries the contrast: the *core* text colour must pass AA on
  its own (our T3 test already enforces exactly this).
- Text scramble/decipher: JS swaps characters from a glyph pool, settling
  left-to-right; run once on mount or on hover, never in a loop.

## Compatibility with the five-theme system

Everything lands as a per-theme *flourish layer*, scoped under
`[data-theme='cyberpunk']`, driven by new opt-in tokens that other themes
either zero out or repurpose (e.g. `--fx-scanline-opacity: 0`,
`--fx-glitch: none`, `--fx-glow-strength`). Components keep consuming the
same semantic tokens; the cyberpunk theme just defines more of them.
React-side effects (scramble text, boot sequence) read the active theme
from the existing hook and no-op elsewhere. The AA contrast test stays
the merge gate for every colour pair this adds.

The full applied-ideas list (Dutch, with cool-factor priorities) was
delivered in conversation on 2026-08-31; decisions on which items to
build go through a form and then into FEATURES.md under T1.

## Round six — what the references actually do, measured 2026-09-07

Kenny opened round six with a brief: the themes are fine but not at the
level of a next-level hand-made site, and cyberpunk is the first to be
lifted there — "niet enkel de kleuren en een hoekje van de buttons",
the full works, with the palette moved from violet/magenta/cyan to
predominantly yellow with red tints and a little neon blue/purple. He
named five references. Every claim below was read out of the live page
with a script, not eyeballed, except where it says so.

### cyberpunk.net (CD Projekt, the official site)

- **Ground and type.** Saturated yellow ground, black condensed uppercase
  display type, black navbar strip, cyan microlabels in the news module
  (`/// .NEWS.MODULE_HIGHLIGHT`), red tints from the artwork only.
- **Navbar geometry, verbatim from `div.menu`'s computed style:**
  `clip-path: polygon(13.33px 0, 100% 0, 100% 25px, calc(100% - 15px) 40px, calc(100% - 15px) 2000%, 0 2000%, 0 13.33px)`
  — a cut top-left corner and a notch stepping in at the right end. The
  active item darkens; the language item sits behind a divider; the last
  item is a solid yellow block. Sub-menus are `ul.menu-sub-list` with
  `clip-path: inset(0 -16px -16px)`, every entry prefixed with a dash.
- **Buttons.** `.cp-btn` with variants `cp-btn--yellow`,
  `cp-btn--yellow-rotated`, `cp-btn--white`; 232×48 px; the element is a
  plain `<span>` with **no** clip-path, no pseudo content and no
  transform, so the notched frame with the slit in each flank is drawn by
  the button's own border treatment (border-image or a masked frame — not
  read further). The `--rotated` variant is what puts the notch on the
  other side, which is why the notch "is not always on the same side".
  Frame colour measured `rgb(252, 238, 10)` — the yellow this round uses.
- **The "tear" between content and footer** is not a clip-path: it is
  `footer.footer::before` with
  `background-image: url(razor-bottom-black-…svg)`, a 1920×39 SVG path in
  black — a sawtooth of small angular steps with occasional deep cuts to
  the full height. Our version is generated, not traced.
- **Dossier cards (Phantom Liberty page).** `section.dossiers` holds
  `.dossier` slides; opening adds `.expanded`; the text is
  `.dossier__text` whose key phrases are wrapped in bare `<span>`s ("CEO of
  Militech", "crash lands in Dogtown") — those are the redactions that
  lift after opening. Read after the reveal: no animation left on the
  spans, so the lift is time-based on expand.
- Hero buttons on that page: yellow-outline on black, notches at
  top-left and bottom-right, a bracket frame (⌜ ⌝) under the hero and a
  dotted ruler line.

### Dribbble 11974778 — Dmytro Nedvyha, "Cyberpunk – Website Design"

Dark hero, yellow wordmark, oversized light headline, a yellow skewed
primary CTA with a white bar accent, an outline secondary CTA with a
yellow underline bar, vertical microlabels (numbers) in the margins, a
hamburger top-left and a date top-right. No live site was found for it:
the search turned up only the shot itself, the designer's two Dribbble
profiles and a Pinterest repin. The "showcase" Kenny remembers was more
likely one of the CSS libraries below, which reproduce this shot's
button language.

### Dribbble 6653201 — Kirill Koshelev, "Cyberpunk 2077"

Purple/magenta-heavy (closer to the old register than to this round),
but three cues are worth keeping: a yellow top bar with notches, circuit
traces as decoration, and a headline sliced by a glitch.

### cyberpunk2077.webflow.io — the glitch Kenny called "geweldig"

The Codrops image-glitch: several copies of the image stacked, each on
`div.glitch__img` with its own keyframes (`glitch-anim-1/2/3`,
`glitch-anim-text`, `glitch-anim-flash`), **4 s, infinite**, animating
`clip-path: polygon(...)` horizontal slices with `translate3d` offsets
from `--gap-horizontal` / `--gap-vertical`, plus a flash layer that
blinks at 0.2 opacity for 5 % of the cycle. Two things follow for us:
the slice mechanism is exactly right, and the infinite loop is not — DI5
wants it computed, and the anatomy's own rule is "rare glitch is an
event, permanent glitch is noise". Ours fires once per trigger.

### preload-template-showcase.webflow.io — the lines under headings

Navy ground `rgb(0, 13, 33)`, Audiowide display type. The lines are
`div.line-separator`, 3 px tall, full measure wide, with a
`background-image` gradient asset, revealed by Webflow scroll
interactions rather than CSS. For us: a hairline under a section
heading that draws in from the left on scroll, with a cyan-to-transparent
gradient, guarded by reduced motion.

### Libraries found while looking for the showcase

- `sebyx07/cybercore-css` — pure-CSS cyberpunk framework, six effects
  (glitch, neon border, scanlines, noise, datastream, text glow), live at
  sebyx07.github.io/cybercore-css.
- `alddesign/cyberpunk-css` — Cyberpunk 2077-themed elements with glitch
  classes.
- SitePoint, "Recreate the Cyberpunk 2077 Button Glitch Effect in CSS".
- CodePen: CarterNoCodes "Cyberpunk Website Template"; mattgrosswork
  "Cyberpunk-Style Glitch Walkthrough".
None is a dependency; they are evidence that the button and glitch
language is reproducible in CSS alone.
