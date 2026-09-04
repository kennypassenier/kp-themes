# formal — anatomy

> What makes this theme this theme, and how it answers the questions
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md) puts to every
> theme. Written channel-neutrally: it describes character and rules, not
> CSS, so a TUI or GUI could build the same theme without reading a
> stylesheet.

## The idea

Paper and ink. A warm off-white ground the colour of good stock
(`hsl(40, 25%, 97%)` — never pure white, which reads as a screen rather
than a page), near-black text with a blue cast, and a single navy that
carries every interactive thing. Bronze is the second voice, used for
emphasis rather than for actions.

The reference is editorial print: a serious document that expects to be
read at length. Fraunces on the headings is the whole typographic gesture
— everything else is the system face.

## What is load-bearing

1. **The ground is warm and off-white.** Move it to pure white and the
   theme becomes `light`. That single value is the difference.
2. **One colour acts.** Navy is the only hue that means "you can do
   something here". Bronze never becomes a button.
3. **No ornament.** No glow, no texture you can see, no rounded
   flourishes. The 6 px corner radius is the largest concession.
4. **Contrast is generous, not maximal.** Ink on paper measures 15.75:1,
   comfortably above the floor, because reading is the point.

## Answers to the invariant questions

**DI1 — is `--border` a hairline or a boundary?** A hairline. Formal
separates content with rules the way a printed page does, and those may be
quiet. The boundary of a control needs its own, stronger value: on this
ground it must be a low-saturation navy-grey, not a lighter paper tint.

**DI3 — does this theme follow the state derivation?** Yes, unmodified. A
lightness step is exactly how ink behaves on paper: pressing harder makes
it darker. Hover darkens the navy, pressed darkens it further.

**DI4 — are the status colours a palette or a code?** A code. Each of the
seven means one stage. Formal fails the colour-vision check today: offer
and rejected sit at a perceptual distance of 1.3 for the commonest
deficiency. They must separate in **lightness** rather than in hue, which
suits ink-on-paper anyway — a printer would have solved it the same way.

**DI5 — does this theme ship animation?** No. Nothing to compute.

**DI6 — light or dark, and is the layer ordering deliberate?** Light, and
the ordering is deliberate: the card is a lighter, brighter stock laid on
the page ground. In a light theme raised means lighter, which is what the
values already do.

## What this theme may not do

- Become pure white, or pure black text. Both break the paper illusion.
- Use bronze for an action.
- Gain a visible texture. The grain sits at 6% opacity and must be felt,
  not seen — that is the house rule, and formal is where it matters most.
- Use a serif for body text. The display face is for headings only.

## Open for L3

The semantic colours (success, warning, info) do not exist yet. On this
ground they should read as printed inks rather than screen colours:
muted, slightly desaturated, closer to a bookplate than to a traffic
light. The danger colour already shows the register — `hsl(0, 60%, 40%)`
is a brick red, not a fire-engine red.
