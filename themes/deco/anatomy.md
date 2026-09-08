# deco — anatomy

> How this theme answers the questions in
> [DESIGN_INVARIANTS.md](../../docs/DESIGN_INVARIANTS.md).

## The idea

Art Deco, the dark reading: gold on a near-black ground, jewel tones for
the accents — emerald, sapphire, ruby — and geometry drawn with a ruler
and a compass: chevrons, double rules, a display face built from circles
and straight lines. Paris 1925 and the skyscraper lobby, not the gilt of
a palace. The approved concept demo, "The Gilded Ascent" (2026-09-08,
Kenny), is the reference this register is built from exactly (S49); the
measured references are Le Bathyscaphe's concentric inset-shadow frame
and its `border-style: double` divider, and the Empire State Building's
chevron corner cut — both in `docs/RESEARCH_2026-09.md` §13.

The light ivory-and-gold Deco exists too and is not built: on paper it
sits within a step of formal and sepia. The dark one has no sibling.

## What is load-bearing

1. **Gold is the action and the structure.** `--primary`, `--ring`,
   `--selected` and both boundaries are the same family at 43°. Gold
   `hsl(43, 65%, 52%)` on the ground measures 8.16:1; the boundary is a
   quieter gold at 50% lightness and 35% saturation, so a ruled line and
   a button are not the same thing.
2. **The ground is blue-black, not black.** `hsl(200, 25%, 8%)` — a
   trace of blue under the gold is what makes the gold look warm. Pure
   black would make this phantom's ground with a different accent.
3. **Jewels as accents, never as text.** Emerald is `--accent` with a
   dark ink of its own family. Ruby is `--destructive` and the dossier
   stamp's plate. Sapphire is `--info`.
4. **Poiret One for headings, Josefin Sans for everything else.** Poiret
   One is hairline-thin and lives only on h1–h3, uppercase with wide
   tracking; a control label in it would vanish at 14px.
5. **No metallic gradient (anatomy, verbatim from the demo's own
   comment).** "Gold as a flat colour reads as Deco; gold as a gradient
   reads as a casino." The one gradient in the register — the mirror
   flourish under a primary button — fades to transparent, not to a
   second hue, and never sits on the gold fill itself.
6. **Radius 0, and corners cut on purpose.** `0rem` everywhere. Where the
   demo wants a corner removed rather than rounded, it is cut with
   `clip-path` (the cartouche's chevron bite), never rounded.

## The register's answers to the hook vocabulary

- **surface** — `css/themes.css`, the hero ground (unchanged from L3).
- **emphasis** — the dossier's jewel redactions: emerald plates over the
  words, cleared on the "Open the file" trigger, `--kp-reveal-emphasis`
  set to `plate`.
- **reveal** — the rule under a heading: a gold line that fades toward
  transparent, drawn left to right once, reusing the base layer's own
  `kp-rule-in` keyframe at the demo's literal 600ms, `--kp-reveal-rule`
  set to `draw`. The headline reveal is answered quietly (below).
- **divider** — the double rule (`border-style: double`, Le Bathyscaphe,
  measured) with a rotated lozenge at its centre, gold on the hero
  divider, emerald on the alt.
- **accent** — the heading accent lives on every h1/h2/h3 (uppercase,
  wide tracking, the display face); the hero h1 additionally wears the
  cartouche frame.
- **arrival** — quiet. The demo has no page-wide boot overlay; its only
  entry motion is the cartouche, which is scoped to the headline, not
  the page, and is answered under **reveal** instead.

## Answers to the invariant questions

**DI1 — boundaries at 3:1.** The gold boundary clears the floor on the
ground, the card and the popover; `check-invariants` measures all three.

**DI2 — the focus ring.** No override needed. The derived
`--focus-ring`/`--focus-ring-contrast` tokens already equal
`--foreground`/`--background` for this theme — exactly the two-channel
ring the demo draws by hand as a stacked box-shadow of the foreground and
the background tokens, so the base layer's default rule is already this
theme's answer, and the register declares nothing for `:focus-visible`.

**DI3 — states you can see.** Derived by lightness. Gold at 52% has room
both ways.

**DI4 — colour is never the only carrier.** The first draft had offer
(emerald plate) and rejected (ruby plate) 11.0 apart under deuteranopia,
under the floor of 12; the emerald went lighter and the ruby darker,
which is what a green and a red on a dark ground need to stay apart once
the red channel is gone.

**DI5 — the flash threshold.** Five effects, all measured, all under the
threshold — see the closing table below. Nothing loops.

**DI6 — light or dark.** `color-scheme: dark`; ground 8%, card 11%,
popover 14%.

**DI7 — reduced motion.** `--fx-duration` is 160ms (the demo's own
literal value — see "What the demo showed" below); every animation and
transition of the register sits inside the reduced-motion no-preference
guard.

**DI9 — theme colour stays in the token layer.** One texture — a chevron
from two repeating gradients at 5% — and every literal colour the demo's
own CSS wrote (the mirror gradient, the dropdown's shadow, the dialog's
backdrop) is rewritten in the register as a relative colour of an
existing token, never a new hex or hsl literal. See the findings below
for the two cases that needed a substitute rather than an exact
rewrite.

## What it deliberately does not do

- **No metallic gradient on the gold itself.** Gold as a flat colour
  reads as Deco; gold as a gradient reads as a casino.
- **No radius.** `0rem`. The style is corners.
- **No black.** The darkest value is the sidebar at 6%, still blue.
- **No stamp colour change on open.** The demo's dossier stamp reads
  "Classified" whether the file is open or closed; unlike brutalism's
  lift, this register does not opt in to a `data-kp-open` colour swap,
  because the demo never shows one.
- **No loose-mark covering.** A plain `<mark>` in prose (the lede) is
  always a visible gold highlight; only marks inside the dossier's
  `[data-kp-reveal='emphasis']` container are covered-then-cleared. The
  demo draws this distinction and the register keeps it by scoping the
  covering rule to the dossier's own marks, not to every `mark` in the
  theme.

## What the demo showed and the package now renders exactly (S49)

Every mechanism, token and element of "The Gilded Ascent" is built as
shown, with the following honest transformations — none of them change
what renders, and each is recorded here rather than made silently:

1. **The cartouche has no wrapper element in the shared page skeleton.**
   The demo's own markup wraps the headline in `<span class="kp-cartouche">`;
   the package's generated concept page (`examples/concept-deco.html`,
   built from the same skeleton every lifted theme uses) puts
   `data-kp-reveal="headline"` directly on the `<h1>`, with no wrapper.
   The frame (`::before`, the concentric inset shadow, the chevron
   clip-path) and the scale-in animation are painted on the `<h1>`
   itself instead. The rendered result is the same frame at the same
   scale; only the selector target moved.
2. **The headline reveal is answered quietly, on purpose.** The demo's
   own inline script has no code for the headline at all — only the
   dossier's redactions and the wipe confirmation are wired. Its arrival
   is a plain CSS animation, unconditional, not mediated by any text
   effect. `js/effects.js`'s headline routines (decipher, tracking,
   shout/slam, dissolve, type) all rewrite the element's text or wrap it
   in per-word/per-glyph spans — none of them match "the whole frame
   scales in once." Declaring `--kp-reveal-headline` to force a fit would
   either do nothing visible (since the register supplies no matching
   keyframe) or, worse, wrap the text and risk a layout shift inside the
   frame. `--kp-reveal-headline` is left undeclared: the effects module
   treats this as quiet, sets the rest state immediately with no DOM
   change, and the register's own `kp-cartouche-in` keyframe — guarded
   under `prefers-reduced-motion: no-preference`, with its own row in
   `TIMINGS` — runs unconditionally, exactly matching the demo.
3. **The dossier's three redacted facts are one flowing sentence, not
   three paragraphs.** The demo's markup is three separate `<p>`
   elements, each with one `<mark>`. The shared skeleton's dossier
   paragraph takes one paragraph with three marks and four text pieces
   between them (`dossier1..4`, `dossierMark1..3` in
   `showcase/concept-copy.mjs`). The three redacted facts (the reservee,
   the suite, the rate) are unchanged; they are joined into one sentence
   ("Reserved under `mark`, suite `mark`, at a rate of `mark`.") rather
   than three short lines, because the skeleton has one paragraph slot,
   not three.
4. **Four literal colours became relative colours of existing tokens,
   most of them pixel-for-pixel.** DI9 refuses a hex or hsl literal in
   the register. The mirror flourish's alpha and the two texture repeats
   in the hero and app surfaces are the primary token at their own
   literal alphas, exactly — the same technique the existing deco texture
   in `css/_rules.css` already uses, unchanged. The nav dropdown's shadow
   and the dialog's backdrop are the one genuine substitution: the demo's
   own near-black literal is close to, but not exactly, the
   sidebar-background token — near-identical (both read as "black,
   faintly blue") but not bit-identical. **Finding, not silently
   corrected (S49):** if Kenny wants the exact literal preserved, the
   alternative is adding a new token pinned to the demo's own value,
   which the token-parity gate (S47) would then require in all 25
   themes. The register currently reuses the nearest existing token
   instead, and reports the deviation here.
5. **`--fx-duration` moved from 200ms to 160ms.** The theme's token
   (`themes/deco/tokens.json`) predates this lift and carried the
   package's placeholder value; the demo's own CSS declares
   `--fx-duration: 160ms` explicitly as a measured value in its own DI5
   table ("hover / focus colour transitions … 160ms (`--fx-duration`)").
   Per S49 the demo's declared value wins: the token is now 160ms.
   `check-contrast.mjs` and `check-invariants.mjs` were re-run after the
   change; neither reads timing tokens, and both still pass.
6. **The pre-existing base-layer flourish for deco is neutralised on the
   hero h1.** `css/_rules.css` (T5-T8/HA2, predating this lift) already
   draws an unconditional double gold rule under every `h1`/`h2` in this
   theme, animated on the `kp-rule-in` keyframe at four times
   `--fx-duration`, assigned when "one gesture per theme" was frozen,
   before this theme had a full register. Left alone, that rule would
   paint an extra gold underline beneath the
   cartouche-framed hero headline, which the demo does not show. The
   register cancels it with `content: none` scoped to
   `[data-kp-surface] h1::after` only — the flourish still applies to any
   plain h1/h2 elsewhere the consumer writes without the hook, which is
   the desired fallback. The h2 rule (both in the dossier and the form
   section) is not affected: it is overridden in full by the register's
   own `[data-kp-reveal='rule']::after` rule, since `kp.register` is
   declared after `kp.base` in the layer order (`css/themes.css`) and
   wins outright wherever it applies.

## DI5 — every animation, rate, loop or not

- `kp-cartouche-in` (headline arrival) — page load, once, 520ms, no loop:
  one opacity ramp 0→1, about 1.9 opposing changes per second over the
  one second it occupies.
- `kp-rule-in` (section rule draw, reused from the base layer) — page
  load, once, on each of the two headings, 600ms, no loop: a transform
  (scaleX) only, no luminance change.
- `kp-redaction-clear` (the dossier's three lines) — on the "Open the
  file" click, 320ms each, staggered 140ms apart, no loop: 3 changes
  total, at most 2 falling in any one-second window once staggered.
- Hover and focus colour transitions — pointer or keyboard, 160ms
  (`--fx-duration`), once per interaction, never sustained or repeating:
  1 change per interaction.

Nothing loops, nothing exceeds 3 opposing luminance changes in any
one-second window. Every `animation:` and `transition:` declaration in
this register sits inside the `prefers-reduced-motion: no-preference`
guard (DI7), so under `reduce` none of them is declared at all — the
cartouche sits at scale 1, the rule is simply drawn, the redactions still
respond to the click but with no easing, and hovers/focuses change colour
in one step rather than over 160ms.
