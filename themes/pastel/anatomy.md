# pastel — anatomy

> **The portrait shows this theme; this text says why.** The
> [pastel portrait](https://kennypassenier.github.io/kp-themes/review/research/theme-portraits/pastel.html)
> is the live page, generated from `themes/pastel/signature.json`: every
> colour in its role, the type, the shapes, the motion verb by verb, the
> ornaments, the voice and the recipe for a new component, each with the
> selector or token that proves it. What follows is what the portrait cannot
> show — the idea, the reasons, and how the theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Where the two
> disagree, the register and the tokens are the truth (scope-98).
>
> Pastel is the sixth theme lifted in 5.0.0 (S48, LIFT_PLAN row 6). The
> research behind it is §5 of
> [RESEARCH_2026-09.md](../../docs/archive/RESEARCH_2026-09.md); the concept
> demo Kenny approved on 2026-09-08 is "Second Pass".

## The idea

Risograph printing. A lavender-milk ground, plum ink, and the slight
misregistration of a second pass that never quite lines up — not as a flaw
dressed up as a feature, but as the theme's actual mechanism: a duplicate
layer that springs from a wide misregistration into its 2px rest position
once, on load. Soft without being weak: the ink colours are properly
saturated, it is the _ground_ that is pale.

Everything is round and behaves like a sticker: a control sits on the page
with a hard, flat shadow beside it, lifts a little and askew under the
pointer, and is pressed completely flat. The seams between sections are
pearls on a thread (scope-93) — Kenny found the torn tab this theme was
lifted with too sharp for a theme this fluffy and round.

## What is load-bearing

1. **The ground is tinted, not white.** A lavender so pale it reads as
   white until you put white next to it — and the cards are that white.
2. **Plum acts; mint and violet are fills.** The two drums of the print
   fill in behind marked words and never become an action.
3. **The overprint.** The headline carries a duplicate layer in a second
   ink, held at its 2px offset. It is the theme's signature and its main
   accessibility risk (see "may not do" below); the reveal adds one arrival
   on top of the always-static signature, never instead of it.
4. **Soft geometry.** The largest token radius in the package (1rem), which
   the register pushes further on cards and panels, and a hero whose bottom
   corners round off. Sharpening them makes it another light theme.
5. **The springy overshoot.** The theme's own `--fx-ease` (an overshoot
   cubic-bezier, tuned down from Aardvark Book Club's reference for a
   gentler kit) drives the headline's spring-in, the mark fills, the rule
   draw and every lift and press. Nothing else in the package eases this
   way.

## Why the register does what it does

`css/pastel-register.css` answers the hook vocabulary (S45); the portrait
shows each answer live. The reasons behind the ones that needed one:

- **The overprint is a routine of its own.** `overprint` is new to
  `js/effects.js`: no existing routine reproduces a second layer springing
  into an already-static rest position.
- **The sticker** is what Kenny chose from three hover proposals because
  it is the one that shows something at rest: the hard shadow is always
  there, so the lift under the pointer and the flat press read as one
  object being handled. A soft shadow in its place would be the thing it is
  not.
- **The focus ring is drawn with the sticker, not instead of it.** A box
  has one box-shadow, so the register restates `:focus-visible` on buttons
  with the ring first and the sticker's shadow after it.
- **The stamp floats at the card's top end** (scope-98), so it lands on
  every labelled card and keeps off the title at any width; the shared
  `Card` carries a label only through `data-kp-label`, so the demo's inline
  badge became a pseudo-element.

## What the demo showed and what the package renders (S49, 2026-09-08)

Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. The findings of this lift, as recorded on
2026-09-08 and still standing:

- **Every token value in the demo already matched an existing token**,
  measured at the lift; `--fx-lift` changed from 3px to 2px, the one place
  the demo's own measured hover rise differed from what the theme declared.
- **The stamp's plate and ink** had no token that carried them. The plate
  is the accent's own hue at a much darker lightness rather than a new
  contract-wide token, since S47 is for a colour no token can reach at all;
  the ink is the foreground at zero lightness.
- **The shadows of dialogs, backdrops and dropdowns** are the foreground
  token's own hue at the demo's own lightness and alpha.
- **The dossier's markup is the package's.** The demo draws standalone
  redaction spans; the package's dossier puts the three phrases in `<mark>`
  elements in one paragraph, the only wiring `js/effects.js`'s emphasis
  trigger reaches. The plate is now each phrase's own background, cloned
  onto every line (fix-33, scope-93).
- **The halftone's `mix-blend-mode: multiply`** could not be carried: the
  package's one shared texture layer has no blend-mode knob. At 0.05 over a
  near-white ground a normal and a multiplied dot are not distinguishable
  by eye; reported rather than built, per S42. The texture covers the whole
  page, as every theme's does, rather than only the hero and the dossier.
- **The spec sheet and the platforms line** follow the shared concept
  skeleton's fixed slots; the fifth colour (`--chart-4`, outside the demo's
  kit) is labelled for what it visibly is, and the platforms line keeps the
  demo's own print-spec words.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline, and the faintest case of all:
`--accent` measures 1.14:1 against the ground, the lowest in the system, so
pastel cannot use accent for a selected state at all. Its boundary comes
from the plum family (`--border-strong`, `hsl(300, 22%, 57%)`, 3.21:1 on
the ground), on fields, ghost buttons and every floating panel.

**DI2 — the focus ring.** The package's two-channel ring, composed with
the sticker: on a button the register restates `:focus-visible` so the
ring is drawn first and the sticker's hard shadow after it, and the nav
links, footer links and menu rows answer it in the theme's own paint.

**DI3 — does this theme follow the derivation?** Yes, but with the least
headroom. The ground is at 97 % lightness, so "one step lighter" barely
exists — the derivation moves toward the ink rather than away from it.

**DI4 — palette or code?** A code. Offer and rejected are mint and rose,
and `gates/check-invariants.mjs` finds them above its floor. This is still
the theme where the primary and the danger colour are closest together,
because both live in the rose-plum family, which is why danger must never
stand without words beside it.

**DI5 — animation?** Every animation here is one-shot; nothing loops,
nothing opposes its own direction. Each keyframe has its row in `TIMINGS`
(`js/effects.js`); the mark fill and the rule draw carry no opacity step at
all (a background-size and a width grow, `OUT_OF_SCOPE` in
`gates/check-motion.mjs`); the redaction lift and the sticker's lift and
press are transitions.

**DI6 — light or dark?** Light. Card and popover are both pure white
against the tinted ground, so raised reads as _cleaner_ rather than lighter
— an unusual but coherent answer, deliberate rather than a mistake.

**DI7 — reduced motion.** Every animation and transition of this register
lives inside the no-preference guard; at rest the overprint sits at its
2px offset, the marks stand full, the rule stands drawn, the redactions
stand open (see "may not do" below on why open is the safe rest state), and
a button neither lifts nor tilts.

**DI9 — theme colour stays in the token layer.** One texture (a halftone
dot grid in the boundary ink, replacing the earlier fractal grain, at 0.05
— under the ceiling), the stamp and the shadows as relative colours of
tokens, and the register reads tokens only.

## What this theme may not do

- Put the overprint on body text. It is scoped to the reveal element only
  (`[data-kp-reveal='headline']`): doubled edges on running text are
  genuinely unreadable for someone with astigmatism.
- Grow past three ink colours. A risograph with six drums is just printing.
- Lose the tinted ground.
- Take a sharp corner, or a flicker.
- Leave a redaction permanently covered on a page with no script attached.
  The dossier's cover only renders once `[data-kp-effects]` is present and
  the mark is not yet `.is-cleared`; without the effects module the words
  stand plain, because a covered phrase with a trigger that does nothing is
  a trap, not a reveal.
