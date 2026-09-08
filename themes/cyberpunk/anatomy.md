# cyberpunk — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). This is the
> 5.0.0 theme (S39, S40): it replaces the 4.x cyberpunk under the same
> name, and 4.0.0's theme stays what 4.0.0 shipped, retrievable from its
> tag (S20). The research behind it is
> [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md); the older
> [CYBERPUNK_THEME_RESEARCH.md](../../docs/CYBERPUNK_THEME_RESEARCH.md)
> is the 4.x theme's.

## The idea

Two grounds in one theme, and a palette of four:

1. **Signal yellow as ground and primary.** `hsl(56, 98%, 51%)`, the
   frame colour read off the reference. It is the hero's ground and the
   app's primary — the one colour that is both a surface and a signal.
2. **A void with a violet cast** for the app surface: `hsl(270, 9%, 4%)`,
   never pure black. Cards and popovers rise from it in two steps.
3. **Blood red where something is wrong.** `hsl(353, 84%, 58%)` for the
   destructive plate on the void; the deeper `hsl(353, 84%, 42%)` for the
   alert and the second ink on yellow, where it reads at 4.7.
4. **Cyan for what must be read.** Microlabels, form labels, hairlines:
   `hsl(184, 100%, 50%)` as the accent, never as a ground.

Violet lives only inside a glitch slice (S40), and the register at C2
paints it there; the token file carries it as a chart colour and nowhere
else.

## Two surfaces

The hero surface is signal yellow with ink on it (`hsl(53, 36%, 5%)`);
the app surface is the void with smoke on it (`hsl(50, 12%, 82%)`). A
component inside `[data-kp-surface='hero']` reads `--background`,
`--primary`, `--card` and the rest as usual — the generated hero block
in `css/themes.css` remaps them to the `surface-hero-*` sources, and
derives the hero button's hover, active and disabled away from the
yellow's own lightness rather than the theme's (AR38). The hero button
is ink with yellow text; the alert is the deeper red with white text;
the hero card is the deeper yellow `hsl(56, 100%, 43%)` with ink on it.

## What is load-bearing

- Yellow acts and grounds; red alarms; cyan labels. Swap any two and it
  is a different theme.
- The app foreground is a warm smoke, not white. White text on the void
  reads as a terminal; smoke reads as print.
- The radius is 0. Every corner is either square or a notch (`--fx-notch`
  14px), and the notch is the register's, not the token file's.
- The register is decoration: the theme is complete with `themes.css`
  alone, and `check-hooks` holds that every hook has an answer here even
  when the register is off.

## Answers to the invariant questions

**DI1 — hairline or boundary?** `--border` is a yellow-tinted hairline
on the void (`hsl(56, 60%, 16%)`), under 3:1 on purpose; `--border-strong`
and `--input` are `hsl(56, 40%, 42%)`, over 3:1 on every app surface. On
the hero the frame is the olive `hsl(54, 50%, 30%)`, 3:1 on the yellow
and on the deeper yellow.

**DI3 — does this theme follow the derivation?** **Yes.** The 4.x theme
took the opt-out (a smaller step, because neon has no headroom); yellow
and ink have plenty, so the states derive at the house step and the
worst-case shortcut of AR12 applies again.

**DI4 — palette or code?** A code. Offer is acid green, rejected is red;
the pair stays apart under deuteranopia because they differ in
lightness as well as hue, which is the deliberate version of what the
4.x theme had by accident.

**DI5 — animation?** **Yes, and every rate is in the table.** The
register's effects each carry a row in `TIMINGS` (js/effects.js) and
`check-motion` reports the luminance transitions per second for every
one; per S42 the findings are shown, and nothing is changed on their
account until Kenny orders it.

**DI6 — light or dark, and is the ordering deliberate?** Dark. The three
app surfaces rise: 4% → 8% → 10%. The hero is a light surface inside a
dark theme, and the generator derives its states from its own lightness
so nothing on it moves the wrong way.

**DI9 — texture?** The scanline is yellow at the register's opacity; its
effective value is measured by `check-texture`, and the 4.x texture's
0.55 sits in the pending list until C2 replaces it (R6-Q2 for the
ceiling itself).

## The band, and the pair Kenny approved (2026-09-08)

The marquee this theme draws is signal yellow with the ink in blood red,
and every corner cut by the same amount so the two ends match — both are
Kenny's own corrections to the first version, which cut only the bottom
two corners and put white on the yellow, where it could not be read.

Red on yellow measures **3.21** against the package's 4.5 floor for
ordinary text. It was reported to him with that number rather than
quietly darkened, and he approved it on 2026-09-08. It stands as an
approved exception, not as an oversight: the two colours are the theme's
own `--primary` and `--destructive`, and a red that reached 4.5 would no
longer be this theme's red.

## What this theme may not do

- Use pure black, or white on the void.
- Paint yellow as a ground anywhere but the hero.
- Let violet out of the glitch.
- Depend on the register for a colour: `themes.css` alone must pass every
  gate, and does.
