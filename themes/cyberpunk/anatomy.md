# cyberpunk — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). The longer
> research behind it is in
> [CYBERPUNK_THEME_RESEARCH.md](../../docs/CYBERPUNK_THEME_RESEARCH.md);
> this document is the part that is binding.

## The idea

Five things make it read as cyberpunk rather than as "dark with pink":

1. **Darkness as canvas.** Near-black with a violet cast
   (`hsl(258, 40%, 6%)`), never pure black. Neon only works against it.
2. **Neon as signal, not decoration.** One to three saturated accents,
   used sparsely, on the things that matter. A page that is all neon reads
   as vaporwave.
3. **The terminal register.** Monospace, uppercase microlabels, dense
   data, identifiers and timestamps used as ornament.
4. **Imperfection over precision.** Scanlines, grain, the occasional
   glitch — technology that is powerful and worn. The key word is
   _occasional_: permanent glitch is noise, rare glitch is an event.
5. **Angular geometry.** Clipped corners, notches, hairline connectors.
   The 4 px radius is the smallest of any theme for this reason.

## What is load-bearing

- Magenta `hsl(315, 95%, 64%)` acts; cyan `hsl(180, 95%, 50%)` accents.
  Swapping them changes the theme's personality entirely.
- The foreground is a pale cyan, not white. White text would flatten it.
- The register is decoration, not colour: the theme is complete without
  it. That distinction is why the register is a separate file.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Its border is a violet `hsl(280, 40%, 22%)`
— visible as an edge but far under 3:1. A boundary here can afford to be
much brighter than in `dark`, because the theme's own language is bright
lines on darkness.

**DI3 — does this theme follow the derivation?** **No, and this is its
opt-out.** Hover on neon is not "one step lighter" — a saturated magenta
has almost nowhere lighter to go before it turns pink and loses its
identity. Cyberpunk expresses hover as a _glow_: unchanged fill, added
luminance around the edge. That forfeits the monotonicity guarantee of
AR12, so this theme's state values are checked in full rather than by
worst case.

**DI4 — palette or code?** A code, and it passes today at 73.1 — by
accident rather than design, because its status colours happen to differ
in lightness. That accident should be made deliberate so it survives a
future tweak.

**DI5 — animation?** **Yes, and this is the theme that needs the flash
number computed.** It ships a flicker, a pulse and falling characters. The
pulse runs indefinitely. Nobody has computed the luminance transitions per
second for any of them, and DI5 is the one invariant whose violation
causes physical injury.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and the
ordering is wrong: 0.0034 → 0.0058 → 0.0050. The popover sinks. Accidental.

## What this theme may not do

- Use pure black, or white text.
- Let the glitch run continuously.
- Become all-neon. If more than a few things glow, the effect is gone.
- Depend on the register for its colours. The theme must be correct with
  `themes.css` alone — which is why the register's texture declaration
  moves into the theme in L3 (TH13).

## Open for L3

Success and info almost write themselves — the cyan family already carries
"informational". Warning is the hard one: amber is a warm hue in a theme
built on violet, magenta and cyan, and the honest options are a hot orange
that fits the neon language or a deliberate break for safety's sake. That
decision belongs on the showcase, seen next to the others.
