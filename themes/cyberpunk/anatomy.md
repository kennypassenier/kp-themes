# cyberpunk — anatomy

> **The portrait shows this theme; this text says why.** The
> [cyberpunk portrait](https://kennypassenier.github.io/kp-themes/review/research/theme-portraits/cyberpunk.html)
> is the live page, generated from `themes/cyberpunk/signature.json`: every
> colour in its role, the type, the shapes, the motion verb by verb, the
> ornaments, the voice and the recipe for a new component, each with the
> selector or token that proves it. What follows is what the portrait cannot
> show — the idea, the reasons, and how the theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Where the two
> disagree, the register and the tokens are the truth (scope-98).
>
> This is the 5.0.0 theme (S39, S40): it replaced the 4.x cyberpunk under
> the same name, and 4.0.0's theme stays what 4.0.0 shipped, retrievable
> from its tag (S20). The research behind it is
> [RESEARCH_2026-09.md](../../docs/archive/RESEARCH_2026-09.md); the older
> [CYBERPUNK_THEME_RESEARCH.md](../../docs/archive/legacy/CYBERPUNK_THEME_RESEARCH.md)
> is the 4.x theme's.

## The idea

Signal yellow on a void. Yellow is the one colour in the theme that is both
a surface and a signal: it grounds the hero, the navbar and the band, and it
is the primary action everywhere else. The app surface is a void with a
violet cast, never pure black, with a warm smoke for its text rather than
white. Blood red means something is wrong and nothing else; cyan labels
what must be read and is never a ground.

The interface talks like a machine — uppercase, spaced, prefixed — and moves
like a signal being acquired: text deciphers out of noise, a slice burst
fires once and settles. Violet is the theme's glitch colour: it is the second
copy in the headline's slice burst, a chart colour, and the plates of two
quiet job statuses (interview and withdrawn), and it is never an action or
a ground.

## What is load-bearing

- Yellow acts and grounds; red alarms; cyan labels. Swap any two and it is
  a different theme.
- The app foreground is a warm smoke, not white. White text on the void
  reads as a terminal; smoke reads as print.
- The radius is 0. Every corner is either square or cut by a notch: the
  token file declares the notch (`--fx-notch`, 14px) and the register cuts
  every button with it, and smaller or larger cuts from it on other parts.
- The register is decoration that reads tokens: it names no colour of its
  own, so every colour it paints is one `themes.css` already carries.

## Two surfaces

The hero surface is signal yellow with ink on it (`hsl(53, 36%, 5%)`); the
app surface is the void with smoke on it (`hsl(50, 12%, 82%)`). A component
inside `[data-kp-surface='hero']` reads `--background`, `--primary`,
`--card` and the rest as usual — the generated hero block in
`css/themes.css` remaps them to the `surface-hero-*` sources, and derives
the hero button's hover, active and disabled away from the yellow's own
lightness rather than the theme's (AR38). The hero button is ink with
yellow text; the alert is the deeper red `hsl(353, 84%, 42%)` with white
text; the hero card is the deeper yellow `hsl(56, 100%, 43%)` with ink on
it. The navbar takes the hero's yellow and ink too, with its strip of links
cut out of the void beneath it.

## The seam between surfaces

The divider is a data stream (Kenny, scope-96), which replaced the razor
tear this theme was lifted with: rows of muted yellow dashes and cyan
packets under a scan hairline, drifting at two speeds, the seam before the
footer flowing the other way. Outside the band and the alarm it is the
theme's only loop, and a loop on purpose — a stream is never finished. It moves no
luminance (its keyframes move a mask position), which is why it can loop
without touching DI5.

## Answers to the invariant questions

**DI1 — hairline or boundary?** `--border` is a yellow-tinted hairline on
the void (`hsl(56, 60%, 16%)`, 1.82:1 on the ground), under 3:1 on purpose;
the register's own frame for cards and panels is thinner still, the primary
at 22 %. `--border-strong` and `--input` are `hsl(56, 40%, 42%)`: 6.02:1 on
the void, 5.64:1 on a card, 5.41:1 on a popover. On the hero the frame is
the olive `hsl(54, 50%, 30%)`: 4.45:1 on the yellow and 3.30:1 on the
deeper yellow.

**DI3 — does this theme follow the derivation?** **Yes.** The 4.x theme
took the opt-out (a smaller step, because neon has no headroom); yellow and
ink have plenty, so `tokens.json` records no step of its own, the states
derive at the house step and the worst-case shortcut of AR12 applies again.

**DI4 — palette or code?** A code. Offer is acid green, rejected is red;
the pair stays apart under deuteranopia because they differ in lightness as
well as hue, which is the deliberate version of what the 4.x theme had by
accident. `gates/check-invariants.mjs` finds the pair above its floor.

**DI5 — animation?** **Yes, and every rate is in the table.** Each
keyframe the register runs — the slice bursts, the charge sweep, the data
stream — carries a row in `TIMINGS` (`js/effects.js`), and `check-motion`
reports the luminance transitions per second for every one; per S42 the
findings are shown, and nothing is changed on their account until Kenny
orders it.

**DI6 — light or dark, and is the ordering deliberate?** Dark. The three
app surfaces rise: 4% → 8% → 10%. The hero is a light surface inside a dark
theme, and the generator derives its states from its own lightness so
nothing on it moves the wrong way.

**DI9 — texture?** Static yellow scanlines every 3px and a faint vignette,
each at an alpha of 0.06 on a layer at full opacity — DI9's ceiling and not
a hair over, which `check-texture` measures.

## The band, and the pair Kenny approved (2026-09-08)

The marquee this theme draws is signal yellow with the ink in blood red,
and every corner cut by the same amount so the two ends match — both are
Kenny's own corrections to the first version, which cut only the bottom two
corners and put white on the yellow, where it could not be read.

Red on yellow measures **3.21** against the package's 4.5 floor for
ordinary text. It was reported to him with that number rather than quietly
darkened, and he approved it on 2026-09-08. It stands as an approved
exception, not as an oversight: the two colours are the theme's own
`--primary` and `--destructive`, and a red that reached 4.5 would no longer
be this theme's red.

## What this theme may not do

- Use pure black, or white on the void.
- Spread yellow as a large ground inside the app surface: its grounds are
  the hero, the navbar and the band, and inside the app it is a fill.
- Let violet act or ground: it stays in the glitch slice, the charts and
  the two status plates.
- Round a corner, or cast a soft shadow.
- Name a colour in the register: every colour it paints is a token.
