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
