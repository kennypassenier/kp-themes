# light — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

The neutral one. Pure white, near-black text, and a confident indigo. No
character of its own by design — this is the theme you pick when you want
the content to carry everything and the interface to disappear.

That is a real design position, not an absence of one. Every other theme
here has a mood; this one is the control against which the others are
read.

## What is load-bearing

1. **Pure white ground.** `hsl(0, 0%, 100%)`. The moment it warms up it
   becomes `formal`; the moment it cools it becomes a blue-grey theme with
   opinions.
2. **Indigo, not blue.** `hsl(243, 60%, 45%)` sits deliberately off the
   default browser blue. It reads as chosen rather than inherited.
3. **A cyan accent that never acts.** The pale cyan is a highlight
   surface, not a second action colour.
4. **Nothing else.** No texture, no display face, no ornament. The theme
   is defined by its restraint, so additions cost more here than anywhere.

## Answers to the invariant questions

**DI1 — hairline or boundary?** A hairline. At `hsl(220, 13%, 88%)` it is
the faintest border of any theme, which is correct for separating regions
and wrong for the edge of a control. The stronger value should be a
neutral grey around 45% lightness — visible without becoming a line the
eye follows.

**DI3 — does this theme follow the derivation?** Yes, unmodified. This is
the theme the derivation should be tuned against: if a step looks right
here, it is the baseline the others deviate from.

**DI4 — palette or code?** A code, and it fails today at a distance of
1.7. The fix has more room here than anywhere: on a white ground the full
lightness range is available, so the seven stages can separate by weight
as well as hue.

**DI5 — animation?** None.

**DI6 — light or dark?** Light. Card and popover are both pure white,
which means the layer ordering is currently flat: nothing is raised. On a
white ground elevation has to come from the border and the shadow rather
than from lightness, since there is no lighter left. That is a real
constraint and it should be stated rather than discovered.

## What this theme may not do

- Acquire a mood. Any texture, display face or second accent belongs in a
  different theme.
- Use the browser's default link blue, which would undo the one deliberate
  colour choice it makes.

## Open for L3

Success, warning and info have the most straightforward answer here —
conventional, saturated, legible on white. This theme is where those get
decided first, and the others adapt from it.
