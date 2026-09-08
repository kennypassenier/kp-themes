# mono — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md). Mono is the
> sixth theme lifted in 5.0.0 (S48, LIFT_PLAN row 6). The research behind
> it is "20. mono" of [RESEARCH_2026-09.md](../../docs/RESEARCH_2026-09.md);
> the concept demo Kenny approved on 2026-09-08 is "Paper Trail".

## The idea

Greyscale, and nothing else: the ink is the brand. Vercel's Geist is the
living reference — near-white canvas, near-black ink, a mid grey, a
hairline, and no accent colour anywhere — and the register it produces is
the one that puts the content first because there is nothing else to look
at. Different from high-contrast, which keeps a navy, a yellow and five
chart hues for a safety reason; this theme drops hue for an aesthetic
one. It reads as a well-set document, not a design.

## What is load-bearing

1. **Meaning by lightness.** Every colour that means something elsewhere
   is a grey here, so the seven status plates are a **ladder**: 86% for
   offer, then 74, 62, 52, 34, 22, and 9% for rejected — each pair at
   least 1.25:1 apart, held by a unit test (`gates/gates.test.mjs`, TH86).
2. **Charts get a pattern as well as a grey.** `--chart-pattern-1..5` are
   five SVG fills — diagonal, dots, crosshatch, horizontal, vertical —
   drawn at 30–35% black over the series colour, so five greys between 9%
   and 55% lightness are told apart by texture before anyone squints at
   the shade. Every other theme answers `none`.
3. **The ink is 9%, the action is 14%.** `--primary` sits a step above
   the text because the visited-link derivation needs room to move: at
   9% the visited colour measured 11.3 from the link, under the floor of
   12, and at 14% it clears (12.7).
4. **Inter Tight for the text, Geist Mono for headings and numerals.** A
   grotesk set tight is the Geist gesture; the mono is where the theme
   allows itself a voice — headings, numerals, labels and code all read
   in it, and the register's `--theme-font-display` and
   `--theme-font-mono` are the same family for that reason.
5. **One mechanism, two directions.** rauno.me's mask-image fade — a
   hard-edge mask swept by `mask-position` across a 200%-wide two-stop
   gradient — reveals the headline (content emerging) and clears a
   dossier's redactions (a bar being hidden), the same keyframe
   (`kp-wipe`) run both ways. Adapted from the reference's opacity
   cross-fade specifically so nothing ever flashes (DI5): the mask moves,
   the content under it never changes colour.

## The register (5.0.0)

`css/mono-register.css` is the theme's answer to the hook vocabulary
(S45), every mechanism measured in the research:

- **Surface.** Paper, with no texture at all (`css/_rules.css`, TH72 —
  "the absence is the register"); the laurels, the platforms and the
  spec sheet in the mono face; the side note in the hero margin, the
  demo's own vertical caption.
- **Emphasis.** A loose `<mark>` (the lede's two marked phrases) is a
  static highlight — this theme has no clearing effect outside the
  dossier. A dossier's marks are redaction bars instead: an ink bar over
  the word, masked by the same `kp-wipe` mechanism as the headline, the
  other direction (`classified`); at rest, armed but not yet opened, the
  bar fully covers, and the trigger clears the three bars one after
  another, 400ms apart.
- **Reveal.** The headline stays whole — never split into words or
  glyphs — and a hard-edge mask sweeps across it once, left to right,
  600ms (`wipe`, new to this lift: no existing routine leaves a headline
  unsplit and reveals it by a mask rather than by text or opacity). The
  rule under a heading is the same fading hairline as the divider,
  scaleX-drawn once when the heading enters the viewport (`draw`, reusing
  the base layer's own `kp-rule-in` keyframe at the demo's 400ms).
- **Divider.** rauno.me's overhanging hairline that fades at both ends
  rather than stopping hard — a line the page's own edges interrupt, not
  a rule drawn to fit its box. Static.
- **Accent.** Geist Mono on every heading, numeral, label and code span;
  the microlabel in the mono face at 0.14em tracking; the nav dropdown's
  shadow, the one shadow in the theme.
- **Arrival.** None. A document does not boot; the demo has no arrival
  overlay and the register declares no `--kp-arrival`.

Every nav link and the ghost button share rauno.me's inverting hover:
`mix-blend-mode: difference`, an instant state change with no transition,
never touching the two-channel focus ring. Every other button is left to
the package's own lightness derivation (AR12) — the demo shows no hover
of its own on a plain or primary button, and this theme adds no colour
step on top of the default. The dropdown is the one shadow in the
register (KT14); the dossier's card and the spec sheet stay flat, exactly
as the demo draws them. One answer per component root (56 of 64, the
eight helpers excused).

**What the demo showed and the package now renders exactly (S49, 2026-09-08).**
Kenny's rule of 2026-09-08 is that an approved demo is implemented
exactly, and that a test or a gate which disagrees produces a finding for
him rather than a quiet change. Measured against "Paper Trail":

- The page is the demo's own words at `examples/concept-mono.html`; the
  palette, the two faces, the spacing scale and the display size all
  matched `themes/mono/tokens.json` exactly on first measurement (X0) —
  no token changed for this lift, and `node gates/check-contrast.mjs` and
  `node gates/check-invariants.mjs` both passed unchanged.
- The focus ring is the demo's own order: a paper ring against the
  control, an ink ring outside it — the reverse of the base layer's
  default stacking, restated here exactly as brutalism and retro already
  needed to (S49, A5).
- The nav dropdown's shadow is the demo's own tinted-black shadow, read
  as the ink token at 12% opacity rather than as a literal, so DI9 holds
  without moving the colour.
- The stamp never changes when the dossier opens: the demo's own markup
  and script never touch the stamp word, unlike brutalism's, so this
  register declares no `[data-kp-open]` override — Classified stays
  Classified. `stampLabelOpen` still carries a value in
  `showcase/concept-copy.mjs` (the shared template always renders one),
  set equal to `stampLabel` so the unused attribute is never empty.
- The one thing extended beyond what the demo showed: the shadow it gave
  only the nav dropdown is given to that dropdown's whole family of
  floating panels — popover, menu, toast, tooltip, confirm, the
  datepicker panel, the combobox list, the palette, the theme menu —
  because each is mechanically the same kind of surface (an
  absolutely-positioned panel triggered by a control) and every other
  lifted theme has extended a single answered case to its family the same
  way (brutalism and terminal both group these ten selectors under one
  rule). The dialog is excepted: the demo draws it modal and flat, and
  the register keeps it that way.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** A 50% grey on paper and card (3.78:1 and
3.95:1, both measured in the demo's own header comment). The decorative
`--border` (88%, 1.26:1 against paper) is never used as a component
boundary, only as a hairline.

**DI2 — the focus ring.** Ink over paper — the two channels are the
theme's only two colours, stacked in the demo's own order (paper inner,
ink outer).

**DI3 — states you can see.** Derived by lightness, the package's own
default (AR12); this theme adds no colour step of its own on a button.

**DI4 — colour is never the only carrier.** The theme's whole premise:
a status ladder, five chart patterns, and a label everywhere a colour
would otherwise be the only signal.

**DI5 — the flash threshold.** Three reveals, all measured in the demo's
own header comment and none of them looping: the headline sweep (one
change over 600ms = 1.67/s), the rule draw (one change over 400ms =
2.5/s, and the two instances are never in viewport together), and the
three redaction bars (3 changes across a 1200ms window = 2.5/s, one per
click of the trigger). Nothing exceeds 3/s. Hover (the mix-blend-mode
swap) carries no transition at all — an instant state change, not an
animation.

**DI6 — light or dark.** `color-scheme: light`; paper at 98%, card and
popover white.

**DI7 — reduced motion.** Every animation and transition of the register
lives inside the no-preference guard; at rest the headline is plain text,
the rule stands drawn, and a dossier's redaction bars resolve to whichever
side their class says, with no transition.

**DI9 — theme colour stays in the token layer.** No texture at all
(`css/_rules.css`, TH72). The register reads tokens only; the two mask
gradients and the nav dropdown's shadow are each one relative colour
computed from a single token.

## What it deliberately does not do

- **No hue, anywhere.** Not in the destructive button either: it is a
  25% grey with paper ink, and a consumer that wants a warning icon on it
  adds one — which is the DI4 answer in every theme, not only here.
- **No pure black.** 9% is the floor; black on white is high-contrast's,
  for its own reason.
- **No shadow but the nav dropdown's family.** A document does not cast
  shadows; a menu floating over one does.
- **No colour step of its own on a button.** The demo shows none, and
  the package's own lightness derivation (AR12) is what a quiet theme
  already gets for free.
- **No dark twin yet.** Geist ships one; it is a legitimate follow-up and
  not part of this round.
