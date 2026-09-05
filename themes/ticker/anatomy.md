# ticker — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Amber fields on black, numerals that line up, panel titles in reverse
video, nothing that moves. The trading terminal as it is used today —
data-dense, professional, present tense — rather than the arcade
nostalgia terminal already owns. This is the theme a table wants:
JobTracker's pipeline, a ledger, a log.

## What is load-bearing

1. **Amber acts, yellow labels.** `--primary` is amber
   `hsl(36, 91%, 55%)` — 9.71:1 on black — and `--accent` is the paler
   label yellow. Two hues twenty degrees apart, both with black ink,
   and every other colour on the page is a grey.
2. **No motion at all.** `--fx-duration: 0ms`, `--fx-lift: 0px`, no
   texture that drifts, no flourish under the reduced-motion guard. The
   temptation this theme invites — flash a cell when its value changes
   — is exactly what DI5 counts, and it is refused here.
3. **Tabular numerals, mono display.** The theme sets
   `font-variant-numeric: tabular-nums` on its root so columns of
   figures align, and headings are IBM Plex Mono in capitals on an amber
   bar — reverse video, the way a terminal names a screen.
4. **Radius 0, hairlines at 18%.** A rounded corner or a soft divider
   would say "dashboard product"; this says "screen".

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 52% grey on black, card and popover.

**DI2 — the focus ring.** Amber over black, the near-white text colour
as the second channel.

**DI3 — states you can see.** Derived by lightness; amber at 55% has
room both ways.

**DI4 — colour is never the only carrier.** Offer (green plate) and
rejected (red plate) first measured 10.6 apart under deuteranopia; the
green went lighter and the red deeper, above the floor of 12.

**DI5 — the flash threshold.** Nothing animates.

**DI6 — light or dark.** `color-scheme: dark`; ground 4%, card 8%,
popover 12%.

**DI7 — reduced motion.** Trivially honoured: there is none to reduce.

**DI9 — theme colour stays in the token layer.** One texture — ledger
rules every 24px at 4% — and the reverse-video heading rule, which
reads tokens.

## What it deliberately does not do

- **No phosphor.** No glow, no scanline, no blink; the amber is a
  field colour, not a light source. Terminal keeps all of that.
- **No third hue.** Red and green exist only where the status tokens
  and the semantic tokens require them.
- **No flash on update.** See DI5. A consumer that wants one writes it
  and counts it.
