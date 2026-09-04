# pastel — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Risograph. A lavender-milk ground, plum ink, and the slight
misregistration of a second pass that never quite lines up. Soft without
being weak: the ink colours are properly saturated, it is the _ground_
that is pale.

The 16 px corner radius is the largest of any theme and it is doing real
work — this is the only theme whose geometry is soft.

## What is load-bearing

1. **The ground is tinted, not white.** `hsl(285, 45%, 97%)` — a lavender
   so pale it reads as white until you put white next to it.
2. **Plum, rose and mint.** Three ink colours from a limited palette, the
   way a risograph has a limited drum set.
3. **The overprint.** Headings carry a 2 px offset shadow in a second ink,
   imitating misregistration. It is the theme's signature and its main
   accessibility risk.
4. **Soft geometry.** Large radii everywhere. Sharpening them makes it
   another light theme.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline, and the faintest problem case
of all: its `--accent` measures 1.14 against the ground, the lowest in the
system. Pastel cannot use accent for a selected state at all. Its boundary
colour must come from the plum family at roughly 45% lightness.

**DI3 — does this theme follow the derivation?** Yes, but with the least
headroom. The ground is at 97% lightness, so "one step lighter" barely
exists — the derivation must move toward the ink rather than away from it.

**DI4 — palette or code?** A code, and **the worst offender**: offer and
rejected sit at 1.1 for the commonest colour deficiency, effectively the
same plate. This is also the theme where the primary and danger colours
are closest together (37.3), because both live in the rose-plum family.
L3 has more to fix here than anywhere.

**DI5 — animation?** None. The overprint is static.

**DI6 — light or dark?** Light. Card and popover are both pure white
against the tinted ground, so raised reads as _cleaner_ rather than
lighter — an unusual but coherent answer, and worth writing down as
deliberate rather than leaving it to look like a mistake.

## What this theme may not do

- Put the overprint on body text. It is scoped to `h1` and `h2` and must
  stay there: doubled edges on running text are genuinely unreadable for
  someone with astigmatism.
- Grow past three ink colours. A risograph with six drums is just printing.
- Lose the tinted ground.

## Open for L3

Success and warning have to fit a palette whose hues are already crowded
between rose and plum. Mint is the obvious success colour and already
exists as the accent. Warning likely needs a warm ochre that does not
currently appear anywhere, which makes this the theme where the semantic
colours change the palette rather than extend it.
