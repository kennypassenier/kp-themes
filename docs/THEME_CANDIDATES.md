# Theme candidates — research round of 2026-09-05

Kenny put eleven candidate themes on the table and asked for research on
each, with one hard criterion: a candidate that overlaps too much with an
existing theme is not built. He also asked for further ideas that are
distinct from everything already here. This document is the research;
the decisions are recorded at the bottom once the form is answered.

Four subagents did the web research and read the repository's own
conventions (`docs/DESIGN_INVARIANTS.md`, `css/_rules.css`, the eleven
`tokens.json` files, `gates/check-invariants.mjs`, `gates/config.json`).
Every contrast ratio quoted below was recomputed in this session with a
WCAG 2.x relative-luminance script (`node -e`, 2026-09-05) against the
exact values shown; a claim about the repository names its file and line.

## The eleven that exist

| theme | ground | identity | texture · signature |
| --- | --- | --- | --- |
| formal | light, paper | navy + bronze, Fraunces serif display | laid-paper grain · rule draws under headings |
| light | light, white | indigo + cyan | millimetre grid · lift |
| dark | dark, slate | luminous violet | faint starfield ("Observatorium", `css/_rules.css:41`) · lift |
| cyberpunk | dark, void purple | neon magenta + cyan, yellow signal, Chakra Petch, notch 14px | scanlines, glows · digital rain, decipher |
| pastel | light, lavender milk | rose + mint, radius 1rem | riso grain · overprint, bounce |
| terminal | dark, CRT black | phosphor green, Share Tech Mono, radius 0 | scanlines · blinking cursor |
| topo | light, kraft | forest ink, clay + lake (`themes/topo/tokens.json`: accent hsl(24,55%,86%), chart-2 hsl(24,70%,45%)) | drifting contour lines |
| high-contrast | light, white | black, navy, one signal yellow, Atkinson Hyperlegible | none, deliberately |
| sepia | light, parchment | brown ink, Instrument Serif | none, deliberately |
| blueprint | dark, Prussian blue | cyan + amber, radius .125rem | ruled line under headings |
| solstice | dark, charcoal | amber + rust, Instrument Serif | ember on cards |

Six light, five dark. No medium-lightness theme, no data-dense one, no
theme whose identity is typographic rather than chromatic, none from a
non-Western print tradition, no playful dark theme.

## Overlap scale

0 = nothing in common · 1 = a shared trait · 2 = same register, shifted
hue · 3 = near-duplicate. A 3 is not built; a 2 is built only when the
difference is the point.

## The eleven candidates

### C1 · Vaporwave / Synthwave — too close

Two styles, not one. Synthwave is dark: midnight blue, hot magenta, cyan,
laser yellow, perspective grids — cyberpunk's four colours within 10° of
hue, on the same void ground. Cyberpunk's own anatomy says a page that is
all neon "reads as vaporwave" (`themes/cyberpunk/anatomy.md:17`).
**Synthwave vs cyberpunk: 3.** Vaporwave proper is pastel and ironic:
mist, dream pink, neon aqua, Windows-95 chrome, Times New Roman. That is
pastel's register (riso, bounce, radius 1rem) shifted from lavender to
teal. **Vaporwave vs pastel: 2**, and its canonical pairs fail the gates:
rose `#ed4bbc` on mist `#c6f5f2` measures 2.80. Sources:
retrowave.com's outrun palette guide, the Aesthetics Wiki, Color Palette
Studio's vaporwave set, producerhive on synthwave vs vaporwave.

### C2 · Brutalism (neo-brutalism) — distinct, worth building

Plain web brutalism (default HTML, blue links, Times) is a non-theme.
Neo-brutalism (Gumroad 2021, Malewicz 2022) is a real vocabulary: off-white
`#FFFDF5`, black, yellow `#FFD23F`, coral `#FF6B6B`, lavender `#B8A9FA`;
3px solid black borders, hard offset shadow `5px 5px 0 #000`, radius 0;
Archivo Black or Syne display, Inter or Space Grotesk body; press
translates and drops the shadow. **vs high-contrast: 1** (black on white,
but high-contrast refuses flourish and candy plates); **vs terminal: 1**
(radius 0). Fit: this is DI1 made visible — a black border measures 21:1;
black on yellow hsl(48,100%,60%) = 13.41. The pressed state departs from
DI3's lightness step and must be written down in the anatomy as an
opt-out; the fill still darkens. Cost: tokens + one new knob, because the
offset shadow is not expressible today (`--fx-lift` is a translate) —
`--fx-shadow-offset`, 0px in every other theme, one rule on card, button
and input. Light. Sources: neubrutalism.com, NN/g on neobrutalism, 99designs
on brutalism, brutalist-web.design.

### C3 · Art Deco — distinct, worth building

1925 Paris, the skyscraper age. Black `#1C1C1C` + gold `#D4AF37` +
ivory `#F5EFE0` is the triad; emerald `#005C4A`, sapphire `#0F4C81`, ruby
`#9B111E` as jewel accents; geometry drawn with rulers — sunburst,
chevron, stepped forms, double rules. Google Fonts carriers: Poiret One,
Limelight, Cinzel, Josefin Sans. **vs solstice: 1** (warm dark, but
solstice is firelight with a serif; Deco is metal and geometric sans);
**vs formal: 1**. A light ivory-and-gold Deco would sit at 2 against
formal and sepia — the dark one is the distinct one. Fit: gold
hsl(43,65%,52%) on hsl(200,25%,8%) = 8.16; emerald is border/plate grade
only (3.9); Poiret One is hairline-thin and stays display-only. Cost:
tokens + texture (a chevron as repeating-linear-gradient under the 6%
ceiling), the double rule reuses the `h2::after` pattern. Dark.
Sources: Hue Atlas's Art Deco palette, Skills UI on Art Deco web design,
Made Good Designs on Deco fonts.

### C4 · Neumorphism — does not fit the invariants

One desaturated ground `#e0e5ec`; every element the same colour as its
parent, extruded by two opposed shadows (`8px 8px 16px #b8bec7`,
`-8px -8px 16px #fff`), inset when pressed; no borders. The style's
identity is the absence of a boundary: the dark shadow against the ground
measures 1.48, element-on-ground is 1.00 by design. DI1 asks 3:1 on every
control edge. Malewicz's own verdict (Built In): cards only, never buttons
or inputs. The tamed version — a 3.58:1 `--border-strong` on every
control, shadows kept as decoration — is `light` with drop shadows, not
neumorphism. Cost would be the largest of all: the double shadow on card,
button, input and toggle, with the inset variant. **vs light: 1.**
Sources: CSS-Tricks on neumorphism, Built In on its accessibility, the
two-variable recipe on dev.to.

### C5 · Glassmorphism — distinct but must be tamed

Frosted panels over a rich backdrop: fill at 12–25% white,
`backdrop-filter: blur(12px) saturate(160%)`, 1px translucent border,
radius 16px; the canonical backdrop is indigo → violet → navy with a mint
action colour; iOS 7 → Fluent Acrylic → Liquid Glass 2025. **vs dark: 2**
— the canonical ground is dark's own hue family. What is new is the
material, not the palette, so the ground must move off indigo (petrol
with mint). Fit: a translucent card has no fixed colour, so DI1/DI6/DI9
are unmeasurable on it, and `gates/check-invariants.mjs:65` reads a
surface as an opaque `hsl()`. Tamed: tokens stay opaque and gated
(fg hsl(220,20%,95%) on card hsl(240,25%,18%) = 13.68; mint
hsl(160,65%,55%) on bg = 9.78); the glass lives in a register stylesheet
that adds `backdrop-filter` to card and popover only — never tables,
inputs or body text — with fill ≥ 0.6, a solid fallback under
`@supports not`, and a blur that is never animated.
`prefers-reduced-transparency` is Chrome 118+ only. Cost: tokens +
texture (two aurora blobs at 4–6%) + a `glass` register with `--fx-blur`
and `--fx-glass-alpha` knobs. Dark only. Sources: NN/g on glassmorphism,
superdesign.dev's glassmorphism style page, MDN on
prefers-reduced-transparency.

### C6 · Botanical / Earth — too close

Sage `#9CAF88`, terracotta `#E2725B`, fern `#2f5d3a`, linen `#f2efe6`,
bark text, a soft serif, big radius, leaf linework, linen grain.
**vs topo: 3** — cream ground + forest primary + clay accent is topo's
triad exactly (`themes/topo/tokens.json`: primary hsl(158,42%,24%),
accent hsl(24,55%,86%) with ink hsl(20,55%,22%), chart-2
hsl(24,70%,45%)). **vs sepia: 2** as parchment-with-serif. The one
colour that would make it not-topo is the one the gates reject: sage
hsl(100,12%,63%) on linen hsl(45,35%,96%) measures 2.23 as a boundary,
and it only clears 3:1 at 52% lightness, which is no longer sage. A dark
moss-and-sage reading has no sibling, but nobody would call it botanical.
Sources: Macarons & Mimosas' sage palettes, media.io's botanical palette,
zarmatype on botanical web design.

### C7 · Retro Web (Windows 95 / early web) — distinct but must be tamed

98.css is the reference: surface `#c0c0c0`, button face `#dfdfdf`,
highlight white, shadow `#808080`, frame `#0a0a0a`, navy title gradient
`#000080 → #1084d0`, link `#0000ff`, desktop teal `#008080`, radius 0,
two-layer inset bevels, "Pixelated MS Sans Serif". Google Fonts carriers:
Pixelify Sans, Silkscreen. Pick the OS-chrome reading; Y2K's candy chrome
would collide with pastel and cyberpunk. **vs terminal: 1**, **vs
high-contrast: 1**; nothing existing is mid-grey or bevelled. Fit: text
on grey passes (8.74), link blue passes (4.72), but the bevel that is the
style — `#808080` on `#c0c0c0` — measures 2.17 and fails DI1; the dotted
focus rectangle is forbidden by DI2. Tamed: ground hsl(0,0%,75%), card
hsl(0,0%,84%) so DI6's layers rise, a gated `--border-strong` at ~40%
lightness under the bevel, navy primary hsl(240,100%,25%) (8.75), pixel
face for headings only, body a real sans, `fx-duration: 0ms` (snap).
Cost: tokens + texture (2px checkerboard dither at 4%) + a `retro`
register drawing the raised/sunken bevel on button, input and card, and a
title bar behind h1 — static, nothing blinks. Light. Sources: 98.css
(jdan), desktopcolors.com's Windows 95 page, setproduct's 2026 retro /
brutalist guide.

### C8 · Steampunk — too close

Brass `#b08d57`, copper `#b86b4b`, leather `#7B4B3A`, espresso
`#2a201b`, parchment, verdigris `#3f7f7a`; Rye, IM Fell English, Playfair
Display, Special Elite; rivets, bezels, gauges, gears turning. **vs
solstice: 3** — espresso hsl(25,25%,11%) + brass hsl(38,45%,58%) + copper
hsl(18,60%,52%) are solstice's charcoal hsl(20,14%,10%) + amber
hsl(28,85%,58%) + rust hsl(12,65%,52%) within 10°, differing only in
saturation and ornament. A light steampunk (parchment + brown ink +
serif) is **2–3 vs sepia**. The only reading with no sibling is
verdigris-and-copper, which is a teal theme with copper trim and reads
as art nouveau. The ornament fights DI9 (gradients across blocks, bezels
per component) and DI7 (turning gears). Sources: media.io's steampunk
palette, Rebeca Mojica on the steampunk palette, Filmora's steampunk
palette page.

### C9 · Monochrome — distinct but must be tamed

The living reference is Vercel's Geist: canvas `#fafafa`, ink `#171717`,
mid grey `#4d4d4d`, hairline shadow-as-border, no brand accent — "the ink
is the brand"; a tight grotesk plus a mono for labels and numerals.
**vs high-contrast: 2** — both achromatic on the surface, but
high-contrast keeps a navy primary, a signal yellow and five saturated
chart hues: a safety theme. Monochrome is an aesthetic theme in greys,
not black-and-white. Fit: DI1/DI2 are arithmetic. DI4 (colour is never the
only carrier) is the fight and is won by lightness: greys are invariant
under the deuteranopia simulation, so the seven status plates become a
lightness ladder plus border weight and text style (rejected darkest,
withdrawn outlined, draft dashed). Five chart greys between L0 and L55
pass the 3:1 gate but sit close; a faithful theme ships pattern fills
(`--chart-pattern-1..5` as SVG data URIs), which is new CSS. A plain
destructive button needs a non-colour mark. Cost: tokens + small new CSS.
Light, with a legitimate dark twin. Sources: seedflip on Vercel's design
system, OneSignal's "11 shades of gray", arXiv 2307.10089 on textured
categorical charts.

### C10 · Dark Academia — distinct as the dark variant only

Tumblr 2014, The Secret History, TikTok 2020. Oxblood `#6c1818`, deep
forest `#1f3a2e`, parchment `#f0e6d2`, candle gold `#c9a86a`, ink
`#14110e`, mahogany `#4a2c1d`; EB Garamond or Cormorant Garamond display,
Lora body; no rounding, hairline gold rules, film grain, explicitly no
motion. The style's own sources describe a parchment ground with
oxblood and forest blocks — and that version is **2 vs sepia** (same warm
paper, same serif, same restful intent). The dark reading — ink-black /
mahogany ground, parchment text, oxblood primary, forest secondary,
candle-gold signal — is 0–1 vs sepia and 1 vs solstice (a library, not a
sunset), and it is Kenny's own framing: sepia's darker counterpart. Fit:
parchment hsl(38,40%,90%) on oxblood hsl(0,62%,30%) = 8.42; gold on
parchment is decorative `--border` only (~1.9); DI6 layers rise
(leather-brown card over ink); offer (forest) vs rejected (oxblood)
separate by lightness, the fix formal took. Body stays Lora at ≥16px or
a humanist sans. Cost: tokens + texture (formal's grain, warmer, plus
faint ledger rules). Dark. Sources: Wikipedia on dark academia,
digitalheroesco's dark academia style page, funnelgraphic's palettes,
Made Good Designs on Garamond pairings.

### C11 · Cosmic / Space — too close

Void black, galaxy indigo `#2E0854`, cosmic purple `#6A0DAD`, stellar
violet `#8A2BE2`, the Nebula set (`#6e55d7`, `#8d7cee`, `#ac3af2`,
`#8cbdf8`); starfield, radial nebula, glow on type, three-layer parallax;
Space Grotesk, Orbitron, Exo 2. **vs dark: 3** — dark is slate
hsl(226,22%,8%) with violet hsl(255,85%,74%) and already carries a
starfield; `css/_rules.css:41` names it "Observatorium" and
`themes/dark/anatomy.md` calls the starfield its only ornament. A cosmic
theme is dark with the opacity turned up and a nebula gradient added.
**vs cyberpunk: 2** for the glow. The faithful version fights DI5/DI7
(twinkle, parallax), DI9 (texture ceiling 0.06 — dark's 0.5 starfield is
already the outlier) and DI6 (layers unmeasurable on a gradient ground);
what survives the gates is the existing dark theme. If a cosmic look is
wanted, it is a knob on dark, not a theme. Sources: media.io's outer
space palette, Color Palette Studio's Nebula set, fwdtools on starfield
motion discomfort.

## Ten further ideas

Each targets an axis the set lacks. Contrast figures measured this
session.

| id | name | one line | ground | closest existing (score) |
| --- | --- | --- | --- | --- |
| I1 | Shade | Solarized-style medium-contrast pair, light and dark as one scheme | dusk, both | sepia (1), dark (1) |
| I2 | Ticker | Bloomberg amber-on-black, tabular numerals, zero decoration | dark | terminal (1) |
| I3 | Grotesk | Swiss / International Typographic Style: white, black, one red, grid | light | light (1), high-contrast (1) |
| I4 | Nishiki | ukiyo-e: washi, Prussian blue, beni red, black key-block outline | light | sepia (1), topo (1) |
| I5 | Tazhib | Persian illumination: lapis ground, ivory, gold rules, girih tile | dark, pigment | formal (1), blueprint (1) |
| I6 | Nostromo | cassette futurism: beige plastic, orange LEDs, vent slots | medium-light | terminal (1), solstice (1) |
| I7 | Phantom | Persona 5 menus: black, white, one violent red, cut-paper, halftone | dark | cyberpunk (1) |
| I8 | Pea Soup | Game Boy DMG-01: four olive shades, reflective, no glow | light | terminal (1) |
| I9 | Reader | e-paper: 16-step grey ladder, no motion, Literata | light | high-contrast (1); duplicates C9 |
| I10 | Atomic | mid-century Googie: cream, teal, mustard, coral, starbursts | light | pastel (1) |

**I1 Shade.** Solarized: dark bg `#002b36`, card `#073642`, fg `#93a1a1`;
light bg `#fdf6e3`, card `#eee8d5`; accents blue `#268bd2`, yellow
`#b58900`, magenta `#d33682`, cyan `#2aa198`. Source Serif 4 + Source
Sans 3, radius .25rem, no texture, no flourish. The only medium-contrast
theme and the first shipped pair. Measured: base00 `#657b83` on base3 =
4.13 (fails) — the light foreground must be base01 `#586e75` (4.99).
Accents are plates, never text. Sources: ethanschoonover.com/solarized,
Nathan Long's "Colorschemes for the discerning developer".

**I2 Ticker.** bg `#0B0B0B`, card `#151515`, popover `#1E1E1E`, fg
`#E8E6E1`, primary amber `#F5A623` (9.71 on black), label yellow
`#FFD24D`, muted `#8A8A8A`. IBM Plex Mono for display and numerals with
`tabular-nums`, IBM Plex Sans body, radius 0, ledger rules at ≤4%,
reverse-video panel titles, no motion at all. Fills the data-dense gap;
JobTracker's tables are the obvious consumer. Refuse the "flash on
update" temptation (DI5). Sources: Ted Merz "Amber on Black", Bloomberg
UX on Terminal colour accessibility.

**I3 Grotesk.** bg white, card `#F4F4F4`, fg `#111111`, primary red
`#E30613` (4.88 on white; a plate on the grey card), border-strong
black. Archivo 800 display, Inter body, radius 0, a 12-column grid at
≤4% (columns, not squares — that separates it from light's mm-grid), a
static red square before headings. Identity by typography rather than
colour. Sources: PRINT on Swiss Style, Bootcamp on the International
Typographic Style in web design.

**I4 Nishiki.** bg `#F5EFE0`, card `#FBF7EC`, fg `#1C1A17`, primary
Prussian blue `#1F3A5F` (10.01 on washi), accent beni `#B8322F` (5.18),
chart indigo / beni / ochre / moss / plum. Shippori Mincho display, Zen
Kaku Gothic New body, radius .125rem, washi fibre texture at ≤4%, a red
hanko seal after h1. The 2px black `--border-strong` is the key-block
outline and makes DI1 free. Kanagawa (`#1F1F28`/`#DCD7BA`) is a proven
dark sibling if ever wanted. Sources: MFA CAMEO's ukiyo-e colorant
database, kanagawa.nvim.

**I5 Tazhib.** bg lapis `#1B2A6B`, card `#22357C`, popover `#2A3F8C`,
fg ivory `#F3E9D2` (10.94), primary gold `#D4A72C` (5.89), accent
vermilion `#E34234` (3.20 — plate/border only), verdigris `#3E8E7E`.
Markazi Text display, Vazirmatn body, radius .5rem, an 8-fold girih tile
at ≤5%, a gold hairline ruling frame on cards. The only dark theme built
on a saturated pigment rather than a neutral. Sources: Brown's Minassian
collection essay on Persian miniature production, Coloracci on Persian
colour traditions.

**I6 Nostromo.** bg `#D6CBB6`, card `#E2D9C6`, popover `#EDE6D6`, fg
`#2B2622` (9.32), accent orange `#C8501E` (2.83 — plate with dark ink,
never text), LED `#F0702A`. Michroma display, Chakra Petch body, radius
.75rem, vent-slot lines at ≤5%, an LED dot on the selected nav item that
changes colour and fill. The case, not the screen. Sources: Aesthetics
Wiki and TV Tropes on cassette futurism.

**I7 Phantom.** bg `#0A0A0A`, card `#161616`, popover `#222222`, fg
`#FAFAFA`, primary `#E60012` with white ink (red on black measures 4.12
and fails as text; text-red lifts to `#FF2A3C`). Barlow Condensed 800
italic display, Barlow body, radius 0 with `--fx-notch: 6px` reused as an
irregular clip on badges, halftone dot screen at ≤5%, badges slide in 6px
— transform only, no luminance change. The playful dark theme the set
lacks: flat print, three colours, no light emission. Sources: Siliconera
on Atlus's Persona 5 UI, Game UI Database.

**I8 Pea Soup.** The four DMG shades `#9bbc0f` bg, `#8bac0f` card,
`#306230` borders/plates, `#0f380f` ink; Pixelify Sans display only,
Nunito Sans body, radius 0, 2px pixel borders, LCD grid at 3px cells,
static block cursor. Ink on bg = 6.02; the mid shade on bg = 3.29
(border grade only). Chart-1..5 and seven status plates cannot come from
four shades: pattern fills are mandatory, the same mechanism C9 needs.
Sources: Lospec's DMG-01 accurate palette, Pan Docs on palettes.

**I9 Reader.** bg `#F2F2F0`, card white, fg `#1A1A1A`, muted `#6E6E6E`
(4.55), primary ink with white text, border-strong `#7A7A7A`; Literata
for everything; radius .125rem, `--fx-lift: 0`, `--fx-duration: 0ms`, no
texture, no flourish. Honest overlap: this is C9 with a reason (a
reflective medium) instead of an aesthetic. Build one of the two, not
both. Sources: Intent on designing for e-ink, the CHI 2026 e-paper
design-system paper.

**I10 Atomic.** bg `#F6EFDD`, card `#FCF7EA`, fg `#2B2B2B`, primary
teal `#1F6F78` (5.08), coral `#D9553B` (3.45, plate) and mustard
`#A67C0F` (3.32, plate), chart teal / mustard / coral / olive / walnut.
Yeseva One display, Jost body, radius 1rem with kidney shapes on avatars
only, sparse starburst asterisks at ≤4%, a boomerang underline on h1.
Playful light from 1955 rather than 1995. Sources: Aesthetics Wiki on
the Atomic Age, Kittl's Atomic Age design guide.

Considered and dropped by the scout: Flexoki / Gruvbox (solstice owns
warm dark), Nord light (a third cold-blue light theme), Catppuccin Mocha
(within a hue step of dark), Constructivism (between brutalism and Deco),
Teletext and Hot Dog Stand (terminal, retro web).

## What every new theme costs

An anatomy document (S12), a `tokens.json` with the full token set
(~70 tokens; `gates/check-contrast.mjs` measures 39 pairs), an entry in
`themes/order.json`, the texture and the one signature flourish in
`css/_rules.css` under the DI7 guard, a bare fixture page and the
showcase page, and the browser suite run in both browsers for the new
name. A theme that needs a register stylesheet (C5, C7) or pattern fills
(C9, I8, I9) or a new knob (C2) adds that on top — and a new knob is a
minor version for every theme, since the others must declare its zero
value.

## Verification, 2026-09-05

| claim | how it was checked |
| --- | --- |
| cyberpunk's anatomy says all-neon reads as vaporwave | `grep -n vaporwave themes/cyberpunk/anatomy.md` → line 17 |
| dark's starfield is named Observatorium | `css/_rules.css:41` |
| topo's clay accent and chart-2 | `themes/topo/tokens.json` (jq) |
| every ratio in this file | `node -e` WCAG luminance script, this session |

## Decisions

Recorded after Kenny's form of 2026-09-05.

Kenny answered the form on 2026-09-05. Every item, in his words' order:

| id | candidate | decision |
| --- | --- | --- |
| C1 | Vaporwave / Synthwave | Don't do — too close to cyberpunk and pastel |
| C2 | Brutalism (neo) | Essential |
| C3 | Art Deco (dark) | Essential |
| C4 | Neumorphism | Later |
| C5 | Glassmorphism | Later |
| C6 | Botanical / Earth | Don't do — too close to topo |
| C7 | Retro Web (Windows 95, tamed) | Desired |
| C8 | Steampunk | Don't do — too close to solstice |
| C9 | Monochrome | Desired |
| C10 | Dark Academia (dark variant) | Essential |
| C11 | Cosmic / Space | Don't do — dark already is the observatory |
| I1 | Shade (light + dark pair) | Essential |
| I2 | Ticker | Essential |
| I3 | Grotesk | Desired |
| I4 | Nishiki | Essential |
| I5 | Tazhib | Desired |
| I6 | Nostromo | Desired |
| I7 | Phantom | Essential |
| I8 | Pea Soup | Later |
| I9 | Reader | Don't do — duplicates monochrome |
| I10 | Atomic | Later |

Seven Essential decisions, eight themes (Shade is a pair); five Desired;
four Later, kept here as candidates; five dropped with their reason.
Kenny's remark on the form concerned the next round, not this one: four
findings the kp-soft session reported against 3.0.0 (P1–P4) are recorded
in `docs/REQUESTS_FROM_CONSUMERS.md` and stay out of this round.
