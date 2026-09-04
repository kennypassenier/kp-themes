# terminal — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

A phosphor CRT. Green on near-black, everything monospace, scanlines on
the glass and a faint bloom on the titles. The most committed theme in the
set: it does not merely look like a terminal, it accepts a terminal's
constraints.

`--radius: 0` is not a style choice. A character cell has no rounded
corners.

## What is load-bearing

1. **Monochrome green.** One hue at 120°, varied only by lightness and
   saturation. Introducing a second hue costs the premise.
2. **Everything is mono.** This is the only theme that overrides the body
   typeface. Losing that makes it green-tinted, not a terminal.
3. **Near-black, not black.** `hsl(120, 10%, 5%)` carries a green cast
   even in the ground.
4. **The scanlines.** A 3 px repeating gradient — measured at roughly
   15.6 cycles per degree, well clear of the band where striped patterns
   cause visual discomfort. Anyone retuning them for a hi-dpi screen must
   check that number again; the uncomfortable band is a period of roughly
   8 to 47 CSS pixels.

## Answers to the invariant questions

**DI1 — hairline or boundary?** Its border is `hsl(120, 20%, 18%)`, a
green so dark it is nearly the ground. A boundary here should be a dimmer
phosphor — the same hue at higher lightness — which fits the premise
exactly: a CRT draws boundaries in the same colour it draws everything.

**DI3 — does this theme follow the derivation?** **No, and this is its
opt-out.** A phosphor does not darken under pressure; it brightens. Hover
increases luminance and bloom rather than stepping toward the ground.
Like cyberpunk, this forfeits the AR12 shortcut and is checked in full.

**DI4 — palette or code?** A code, and it passes at 80.1 — again because
lightness carries the difference. In a monochrome theme that is the only
channel available, so this theme is structurally the safest for
colour-vision deficiency and structurally the most dependent on lightness
being right.

**DI5 — animation?** Yes: the boot sequence. Its flash number is
uncomputed, as with cyberpunk.

**DI6 — light or dark, and is the ordering deliberate?** Dark, and wrong:
0.0041 → 0.0063 → 0.0052. The popover sinks.

## The exception this theme has to justify

Its primary is pure green at 120° and its danger colour is pure red at 0°
— the widest separation in the system (155.6), because it **breaks the
monochrome premise on purpose**.

That is almost certainly right: safety beats aesthetic purity, and a
warning that blends into the phosphor is not a warning. But it has never
been written down, so the next person to work on this theme could
"restore" it to green and remove the only visual alarm the theme has.
It is deliberate. It stays.

## What this theme may not do

- Use a proportional typeface anywhere.
- Round a corner.
- Introduce a third hue. Green, plus the sanctioned red for danger, plus
  the yellow-green accent — that is the whole set.
- Retune the scanline period without recomputing the discomfort band.

## Open for L3

Success is trivially green — which is a problem, because everything is
green. Success will have to be signalled by brightness and by a
non-colour cue rather than by hue, and that is the strongest argument in
the whole system for DI4's second-channel rule. Warning and info face the
same wall.
