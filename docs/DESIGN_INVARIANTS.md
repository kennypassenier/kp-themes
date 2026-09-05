# Design invariants

What must be true in **every** theme, as opposed to how each theme
expresses it. The per-theme answers live in that theme's anatomy
document; this file holds the questions and the floors.

Decided by Kenny on 2026-09-04 after a research round covering the
current accessibility standard, what five mature design systems
(Material, Apple HIG, GOV.UK, IBM Carbon, Atlassian) agree on, and which
popular guidance survives contact with the evidence. Every measurement
quoted below was taken against this repository's own tokens on that date.

## Kenny's override

These invariants are the default, not the law. Kenny can overrule any of
them at any moment — for one theme, for one component, or in general —
and his choice then stands. An overruled invariant does not disappear: it
is recorded together with what replaces it, why, and where it applies, so
a later reader sees a deliberate exception rather than an oversight. Such
an exception makes the corresponding gate fail; that gate then carries a
recorded exemption with the same reference, never a quietly disabled
rule.

That last clause is not bureaucracy. A gate reporting green while an
exception hides inside it is exactly the pattern this project found three
times in one day: the display face declared but never applied (T8), the
body-font token two consumers invented because we never published it
(T9), and a contrast gate verifying a link colour the package never sets
(F1).

## How to read this file

Three sections, because roughly a third of the strongest material is not
about colour at all. Mixing them would drown the palette rules.

| Section | Enforcement |
| --- | --- |
| **1 · Gated at the token layer** | a script checks it against the stylesheet; failure breaks the build |
| **2 · Contracted at the component layer** | the component's own API refuses the wrong shape |
| **3 · Delegated to the consumer** | true and worth writing down, but this package cannot enforce it |

An invariant enters this file only if it either has a check or puts a
concrete question to every anatomy document. No free-floating principles:
a page of good intentions nobody reads is worse than no page, because it
looks like governance.

---

# 1 · Gated at the token layer

## DI1 · Component boundaries and state indicators reach 3:1

**Must be true.** The border of any control, and any mark indicating a
state, contrasts at least 3:1 against what sits next to it.

**Evidence.** WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA. Its
Understanding document is explicit that *selected* falls under this while
*hover* does not — hover is not information required to identify the
component.

**What a person experiences.** Someone with early cataracts opens a form.
The empty fields have a 1.4:1 border, invisible to them. They click the
label instead, type into nothing, and lose the entry.

**Measured, 2026-09-04 — this fails in all seven themes today.**

| theme | `--input` vs bg | `--border` vs bg | `--accent` vs bg |
| --- | --- | --- | --- |
| formal | 1.40 | 1.31 | 1.22 |
| light | 1.44 | 1.33 | 1.14 |
| dark | 1.50 | 1.40 | 1.30 |
| cyberpunk | 1.55 | 1.45 | 14.87 |
| pastel | 1.41 | 1.29 | 1.14 |
| terminal | 1.66 | 1.53 | 15.59 |
| topo | 1.46 | 1.40 | 1.25 |

**Consequence for the tokens.** `--border` currently serves two purposes
that cannot share a floor: a decorative hairline between blocks, which may
be quiet, and the edge of a control, which may not. It splits into
`--border` (decorative, ungated) and `--border-strong` (component
boundary, gated at 3:1), following Carbon's precedent. `--accent` is a
whisper-quiet surface tint in five themes and therefore cannot carry the
*selected* state; selected needs its own token.

**Question to every theme.** Is your `--border` a hairline or a boundary?
One token cannot be both.

## DI2 · The focus indicator is a system constant with two channels

**Must be true.** Keyboard focus is always visible, on every surface it
can land on — not only on the page background. Themes may not restyle it.

**Evidence.** WCAG 2.2 SC 2.4.7 Focus Visible (AA) and SC 2.4.11 Focus
Not Obscured (AA, new in 2.2); SC 2.4.13 Focus Appearance (AAA) sets the
2 CSS px perimeter and 3:1 change-of-state bar we aim at.

**What a person experiences.** Someone who cannot use a mouse tabs
through the picker in cyberpunk. On the dark ground the ring reads fine.
It then lands on a magenta button and vanishes. They press Enter blind and
switch theme when they meant to save.

**Measured, 2026-09-04 — one colour cannot solve this.** Worst surface per
theme, where 3.00 is required:

| ring colour | formal | light | dark | cyberpunk | pastel | terminal | topo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| current `--ring` | 1.05 | 1.03 | **1.00** | **1.00** | 1.34 | **1.00** | 1.30 |
| `--foreground` | 1.38 | 1.82 | 2.48 | 1.10 | 2.13 | 1.06 | 1.73 |
| **two channels** | **6.81** | **6.47** | **6.36** | **5.92** | **5.68** | **5.43** | **5.98** |

A score of 1.00 is identical luminance: the focus ring is *literally
invisible* on a primary button in dark, cyberpunk and terminal today.

This is arithmetic, not taste. A single colour cannot clear 3:1 against
both a near-black ground and a bright magenta button — it must sit
between them and loses on both sides. Two opposing channels always
survive: whichever one loses, the other wins. GOV.UK reaches the same
conclusion with a yellow bar over a black one; we reach it with the
theme's own colours.

**The rule.** The focus indicator draws two rings: an inner ring in
`--foreground` and an outer ring in `--background`, both from the active
theme. Both tokens already exist and the existing contrast gate already
guarantees they sit at least 4.5:1 apart, which is what makes the pair
work on any surface. The gate asserts, for every surface token, that at
least one channel clears 3:1.

**Question to every theme.** None — this is the one thing a theme may not
express differently. That is the point: it is one fewer thing to get right
seven times.

## DI3 · State values are derived by one rule, with a recorded opt-out

**Must be true.** Every interactive surface has hover, active, selected
and disabled values in every theme, and they follow one derivation rule
rather than seven hand-picked sets.

**Evidence.** All five surveyed systems name a distinct focus and a
distinct disabled treatment; four of five name hover and press. There is
**no shared vocabulary** — not one token name is portable between any two
of them — so there is no standard to adopt, only a grammar to pick.
Carbon's is the one worth copying because it publishes the *arithmetic*
(hover = half a step, selected = one step, active = two steps), which
means the values are generated rather than authored.

**What a person experiences.** A user clicks Submit on a slow connection.
Nothing visibly changes, so they click four more times and file five
applications.

**Measured.** There are currently **zero** state tokens in this package.
Seven themes × eight surfaces × five states is 280 values; by hand that is
both unaffordable and guaranteed to drift.

**The opt-out.** Cyberpunk and terminal will express hover as a glow
rather than a lightness step. A theme may leave the derivation, but only
by writing the reason in its anatomy document. Silence is not an opt-out.

**Question to every theme.** Do you follow the derivation, or do you
depart from it — and why?

**Amended 2026-09-04 by correction KT2.** A state must also be visible as
a state. The rule as written asked only whether the text on a derived
state still reads, and by that measure all seven themes passed while
cyberpunk and terminal shipped a pressed state 2.6 to 8.4 from its base,
where roughly 10 is "you can see that it changed".

The pressed state therefore gives up chroma when lightness cannot reach
the floor. A pressed neon sign desaturates; it reads as pressed while
keeping the hue those two themes are made of. A theme that already clears
the floor on lightness alone is untouched, so five of the seven produce
byte-identical output.

The floor is the pressed state only. Hover is subtle in every theme (2.4
to 3.4, the same order as Material's 8% state layer), and a floor that
failed it would be arguing with every design system rather than with this
one's own inconsistency.



## DI4 · Colour is never the only carrier of meaning

**Must be true.** No theme conveys a state by hue alone. Every
colour-coded state carries a second, non-chromatic channel — text, icon,
shape or position.

**Evidence.** WCAG 2.2 SC 1.4.1 Use of Color, **Level A** — the most basic
tier. Prevalence of red-green deficiency: about 8% of men and 0.4% of
women of European ancestry (Birch, *JOSA A* 29(3), 2012).

**What a person experiences — measured in our own themes.** Simulating the
most common form of colour blindness over the `--status-*` plates and
computing perceptual distance, where anything under 10 is effectively the
same colour:

| theme | offer vs rejected, normal vision | as seen with deuteranopia |
| --- | --- | --- |
| pastel | 23.8 | **1.1** |
| formal | 18.5 | **1.3** |
| light | 22.7 | **1.7** |
| topo | 21.7 | **4.2** |
| dark | 52.6 | **8.8** |
| cyberpunk | 137.0 | 73.1 |
| terminal | 143.6 | 80.1 |

In five of seven themes, "offer" and "rejected" are the same plate for
roughly one man in twelve. Only cyberpunk and terminal escape, and by
accident — their status colours happen to differ in lightness rather than
in hue.

**Enforcement.** The token half is fully gated: simulate and assert a
minimum pairwise distance. The markup half is a component contract — a
badge may not render a semantic colour with no text or icon.

**Question to every theme.** Are your seven status colours a *palette*
(decorative, order-free) or a *code* (each hue means one thing)? A code
signs you up for this gate.

**Scope decided 2026-09-04 (mini-round DI4-SCOPE).** The gate measures one
pair under a colour deficiency: `offer` against `rejected`. Kenny ratified
that scope rather than widening it, and the reasoning is worth keeping,
because "we check one of twenty-one pairs" reads like laziness until the
numbers are next to it.

Measured across all 21 badge pairs under deuteranopia, on the scale where
12 is this project's floor for "two different colours":

| theme | worst pair | pairs under 12 | offer ↔ rejected |
| --- | --- | --- | --- |
| formal | 0.5 sent/interview | 16/21 | 13.3 |
| light | 1.6 draft/offer | 15/21 | 14.0 |
| dark | 1.7 draft/withdrawn | 13/21 | 13.0 |
| cyberpunk | 3.4 draft/withdrawn | 2/21 | 31.4 |
| pastel | 0.9 sent/interview | 16/21 | 13.7 |
| terminal | 2.3 sent/interview | 14/21 | 49.4 |
| topo | 1.0 draft/offer | 16/21 | 13.1 |

Cyberpunk's 2/21 is the tell: seven colours *can* stay apart under
deuteranopia, but only if they are saturated. Six of these themes use pale
tints on purpose, and pale tints converge. Widening the gate to all 21
pairs would not tighten a check — it would delete six palettes Kenny chose.

The narrower widening was costed too. "Nothing may be mistaken for a
rejection" fails in dark (draft/rejected 8.9) and terminal (2.5 to 10.5),
and solving it moves both themes' rejected badge to black: it is the only
colour that clears every pair while keeping AA text contrast. That trades
a colour-deficiency problem for a legibility one.

What makes the narrow scope defensible is not the arithmetic but the
contract underneath it: since L7, a badge carrying a semantic colour and
no words is refused in code, in both channels. Colour is demonstrably the
second carrier, not the only one. The gate covers the one pair where
confusing two badges changes what a person believes happened — an offer
read as a rejection — and the label covers the rest.



## DI5 · Nothing flashes more than three times per second

**Must be true.** No animation in this package crosses the flash
threshold.

**Evidence.** WCAG 2.2 SC 2.3.1, **Level A**. Concretely: no more than
three opposing relative-luminance changes of 10% or more per second, over
an area larger than roughly 341 × 256 CSS px. Photosensitive epilepsy
affects about 1 in 4000; the risk band is roughly 15–20 flashes per
second.

**What a person experiences.** Someone with photosensitive epilepsy picks
the cyberpunk theme. The flicker effect runs on mount. Above the
threshold, they have a seizure at their desk.

**This is the only invariant here whose violation causes physical
injury, and the only one whose number we do not know.** The animations
exist — flicker, pulse, boot sequence, digital rain — and nobody has ever
computed their luminance transitions per second.

**Enforcement.** Parse the keyframes, compute relative luminance per
stop, count opposing transitions against the declared duration, fail the
build above threshold.

**Question to every theme.** Any theme shipping animation must have this
number computed. Today that is cyberpunk and terminal.

## DI6 · Dark themes behave like dark themes

Two rules that belong together and cost one line each.

**Every theme declares whether it is light or dark.** Without
`color-scheme`, the browser keeps drawing its own parts in light mode: the
scrollbar, the insides of select controls, the background it forces onto
an autofilled field. **Measured: none of the seven declares it**, although
`hooks/use-theme.js` already knows the answer per theme — it is simply
never emitted.

*What a person experiences:* they open terminal at night. The page is
near-black phosphor green with a bright white scrollbar down the right
edge, and their autofilled email address sits in a yellow block.

**In a dark theme every layer gets lighter as it rises.** Four of the five
surveyed systems say so; only Material dissents.

**Measured — this is wrong in all three dark themes.** Relative luminance,
background → card → popover:

| theme | background | card | popover | |
| --- | --- | --- | --- | --- |
| dark | 0.0061 | 0.0099 | 0.0085 | **inverted** |
| cyberpunk | 0.0034 | 0.0058 | 0.0050 | **inverted** |
| terminal | 0.0041 | 0.0063 | 0.0052 | **inverted** |

*What a person experiences:* they open a dialog in the dark theme. It
sinks visually behind the page instead of floating above it, and they
cannot tell which layer takes their click.

**Question to every theme.** Are you light or dark — and is your layer
ordering deliberate or accidental? Right now it is accidental.

**Found 2026-09-04, at L5.** Every theme declared `--color-scheme`, the
token gate had been reading pass since L3 — and nothing applied it. A
custom property named `color-scheme` is not the `color-scheme` property,
so the browser went on drawing light scrollbars, light form internals and
a light autofill highlight over the three dark themes. `css/_rules.css`
now carries `:root { color-scheme: var(--color-scheme); }`, and the
browser test that caught it runs against every fixture. The token gate's
claim has been narrowed to what it actually measures.

This is the argument for AR14's bare fixtures, made by the first test to
use them.

## DI7 · Reduced motion is honoured, including mid-session

**Must be true.** Every animation respects the operating system's
reduced-motion preference, and the preference takes effect when it is
changed while the page is open.

**Evidence.** SC 2.3.3 Animation from Interactions is AAA, so this is
partly a choice rather than a requirement; the media query is the
sufficient technique. The trigger taxonomy — scaling, spinning,
multi-speed or multi-directional movement, plane shifting, peripheral
motion — is clinical knowledge plus practitioner observation rather than
controlled experiment, and should be cited as such.

**What a person experiences.** Someone with vestibular migraine has the
setting on. The digital rain honours it; one card transition does not, and
scales 5% under their cursor. Forty cards into a list they are nauseous.

**Measured — mostly good, two gaps.** All nine animations in
`cyberpunk-register.css` sit inside the guard and all four fx components
query the preference. But `themes.css:534` carries an unguarded
transition, and the fx components read the preference only at mount with
no change listener, so toggling the OS setting does nothing until reload.

**Nuance worth keeping.** "Reduce" does not mean "remove all motion" — it
means removing the triggers. A quiet fade may stay.

## DI8 · A disabled token exists, without a contrast floor

**Kenny's decision, 2026-09-04, against the recommendation in the form.**
Recorded here as a deliberate choice with its trade-off visible.

**The rule.** Disabled controls have their own token, deliberately
de-emphasised, and are exempt from the contrast floors of DI1.

**Why the standard permits it.** WCAG's "Incidental" exception excludes
inactive components from SC 1.4.3, and SC 1.4.11 says the same. Material
and Carbon both read this as permission and state so explicitly.

**What the other side says, so the trade-off stays visible.** GOV.UK reads
the same low contrast as a defect and flags disabled buttons as having
poor contrast. The practitioner objection is that a disabled control is
skipped by screen readers, unreachable by keyboard, and explains nothing:
a user who cannot submit sees a grey button, cannot tab to it to find out
why, and concludes the site is broken.

**Consequence accepted.** Consumers who want the stronger pattern — the
control stays enabled and explains why it cannot act — are free to build
it; this package does not require it.

## DI9 · Themes stay inside their own layers

**Must be true.** A theme changes tokens, never component markup. The
moment a component needs `if (theme === …)`, the difference is modelled as
a token instead.

**Provenance.** This is house doctrine, already written in
`docs/THEMING.md` before this round, and it is the reasoning behind
choosing shared components over per-theme components at S18.

**Two companions from the same file, kept.** Texture opacity stays at or
under about 6% — the register layer must be *felt*, not seen; when in
doubt, halve it. And every surface pair introduced must appear in the
contrast gate, so the gate owns it.

---

# 2 · Contracted at the component layer

These cannot be checked against a stylesheet. They are enforced by the
components' own API refusing the wrong shape.

**Gated 2026-09-04 (mini-round L3-EXIT).** This was the last row of the
compliance table that read "not gated", and the reason was that nobody had
looked. When someone did, the authored stylesheets held **42 colour
literals** duplicating tokens: cyberpunk's scrollbar was written as
`hsl(315 95% 64%)`, which is `--primary` spelled out a second time.

Three of those copies had already drifted from the token they came from,
by 0.3 to 1.8 units — the failure this rule predicts, found in the wild
rather than argued for.

All 42 now read from tokens. Where a literal carried transparency, the
relative colour syntax expresses it: `hsl(from var(--primary) h s l /
0.55)`, which AR15's baseline allows. Two colours turned out to be a
theme's own rather than a copy of something — pastel's overprint ink and
the register's scanline — and became tokens (`--fx-overprint`,
`--fx-scanline`), declared by all seven for TH22 parity.

Nothing on screen changed. Every conversion was checked against the
literal it replaced: seven are identical, three shift by 0.3 to 1.8 (the
drifted copies snapping back to their token), and one — terminal's
scanline, 100% saturation to 90% — measures 3.5 in isolation and **0.37
once composited at its 6% opacity**, which is well under the threshold of
perception.

Three colours are listed in the gate as not theme colour at all, with
their reasons: the modal backdrop, and the white ground and black ink of
the print stylesheet. Paper has no theme.



## DI10 · Irreversible actions are reversible, checked, or confirmed

**Must be true.** Anything that modifies or deletes a user's data offers
at least one of: an undo, a validation step, or a confirmation.

**Evidence.** WCAG 2.2 SC 3.3.4 Error Prevention, Level AA. Note it is an
OR, not an AND.

**What the evidence actually says, which is not the folklore.**
Habituation to repeated identical warnings is well established — attention
measurably collapses after the second exposure. But "undo beats
confirmation" has **no controlled study behind it at all**; it is a
heuristic passed down since the 1980s. What *is* measured: confirmations
carrying a small obstacle — a delay, or typing a word from the dialog —
still worked for 44–74% of users after ~22 exposures, against ≤20% for
purely visual ones. That is the empirical case for GitHub's "type the
repository name to delete".

**What a person experiences.** Someone deletes an application they meant
to archive. A generic "are you sure?" appeared; it was the tenth that
session and they clicked through on reflex. The application, its notes and
its interview dates are gone.

**The contract.** A button with the destructive variant must receive
either an undo handler or a confirmation. Two companions: a destructive
action is never the visually emphasised default in a dialog, and action
labels are specific verbs rather than OK / Yes / No — the one point all
four major platform guidelines agree on.

**Inherited, not invented.** Kenny's standing rule 31 already says this,
including the useful part: drive it from attributes rather than per-button
code, so a new button gets the behaviour by declaring it instead of by
someone remembering.

**Amendment, 2026-09-05 (KT6, decision D7).** The rule stands; the
enforcement changed owner. Until 3.0.0 `enforceContracts()` disabled a
consumer's button, forgot what the button had been, offered no detach and
never looked again — markup that arrived a moment too late stayed dead
for the life of the page. Kenny's answer to the sweep's form was "keep
disabling, make it recoverable": enforcement now records what it changed,
returns a detach that puts it back, re-evaluates when called again,
exempts `data-kp-contract-ignore`, takes `{ disable: false }` for a
warn-only run, and speaks through the dictionary. The React `Button`
spreads its props before `disabled`, so `disabled={false}` can no longer
re-enable a contract-broken button by accident, and its `onUndo` — the
documented alternative to `confirm` — is invoked at last: the button acts
on the click and offers an undo for `undoMs`. Tested in
`tests/sweep.spec.mjs` (framework-free) and `tests/components.spec.mjs`.

## DI11 · Components survive user-forced text spacing and reflow

**Must be true.** No content is lost or clipped when a user forces larger
line, letter and word spacing, and the page stays usable at 320 CSS px
wide and at 200% zoom without two-dimensional scrolling.

**Evidence.** SC 1.4.12 Text Spacing (AA) — line height ≥1.5×, paragraph
spacing ≥2×, letter spacing ≥0.12em, word spacing ≥0.16em. SC 1.4.10
Reflow (AA) at 320 px. SC 1.4.4 Resize Text (AA) at 200%. Worth knowing:
1.4.12 is a *resilience* requirement, not a claim that those values are
optimal; its provenance is thinner than its status suggests.

**What a person experiences.** Someone using a reading aid that raises
line height opens the table. The status badges have a fixed height, the
text no longer fits, and the label reads "Interv".

**Enforcement.** A real browser, per component, per theme: inject the four
spacing overrides and assert nothing clips; set a 320 px viewport and
assert no horizontal scroll. This can only run once the components and the
showcase exist.

---

# 3 · Delegated to the consumer

True, well grounded, and outside what a theme package can enforce.
Recorded here so the boundary is explicit, and handed to JobTracker rather
than pretended away.

- **No time limits on user input** (SC 2.2.1, Level A). A session that
  expires while someone composes a cover letter destroys their work.
- **The user's current state is visible without recall** (W3C COGA
  guidance; SC 3.2.3, 3.2.4 and 3.3.7 Redundant Entry, new at Level A in
  2.2). Someone who loses focus mid-form must be able to see where they
  were. Cite COGA as expert consensus, never as "research shows" — it is
  built from user stories and cites no ADHD-specific studies.
- **Visible system status within the response budgets** (~0.1 s / 1 s /
  10 s). Note the provenance is Card, Robertson & Mackinlay (*CHI '91*)
  choosing engineering budgets — not Miller 1968, which is near-universally
  miscited. What *is* in scope here: shipping skeleton and spinner tokens
  so a consumer can express it.

---

# 4 · Consciously excluded

Each with its reason, so the question stays closed instead of returning
every year.

- **No dyslexia typeface and no coloured overlay.** Settled: a
  meta-analysis of 15 studies, 91 effect sizes, N = 688 finds g = −0.04,
  CI [−0.15, 0.07] — no effect. The study most often cited *for* such
  fonts ranked OpenDyslexic 11th and 12th of 12 on preference. Any
  apparent benefit is reproduced by re-spacing an ordinary font, so the
  letterform is unnecessary. What *is* supported is offering a font choice
  at all, which the per-theme fonts already do.
- **No "maximum seven items" rule.** That derives from a 1956 study about
  *recall*, misapplied to choosing from a list that is on screen. The
  evidence points the other way: novice menu search is linear in item
  count, and hiding options in depth costs more than showing them.
- **No ADHD mode.** There is essentially no controlled experimental
  literature testing interface decisions against task performance in an
  ADHD sample, and the popular advice — colours, fonts, reward mechanics —
  has no supporting studies. What genuinely helps is already covered:
  reduced motion (DI7), nothing moving that is not the target (DI5), and
  visible state (delegated above).
- **No AAA contrast (7:1) target.** The themes would need redesigning and
  the benefit over AA is marginal for this product.
- **No APCA or WCAG 3 work.** APCA was removed from the draft in July 2023
  and as of April 2026 the contrast algorithm is still undetermined. A
  gate built on it would be rebuilt.
- **No rule on button ordering.** Apple, Material and GNOME put confirm on
  the right; Microsoft puts it on the left; none of the four cites a study.
  Pick one, be consistent, and label it a convention rather than a finding.

---

# 5 · Compliance

<!-- compliance:start -->

Generated by `node gates/compliance.mjs`; `npm run gates` fails when this table and the code disagree.

| Invariant | formal | light | dark | cyberpunk | pastel | terminal | topo | high-contrast | sepia | blueprint | solstice | brutalism | deco | academia | phantom | ticker | nishiki | shade-light | shade-dark | mono | retro |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DI1 boundaries at 3:1 | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI2 two-channel focus ring | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI3 states carry their text | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI3 states are visible as states [KT2] | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI4 badge plates read against their surface [KT2] | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI4 opposed status plates distinguishable | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI5 flash threshold | n/a | n/a | n/a | pass | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| DI6 declares colour-scheme and layers rise | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI7 reduced motion honoured | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
| DI9 theme colour stays in the token layer | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |

- All 21 themes pass on 39 pairs (30 at 4.5, 9 at 3.0, incl. 7 status badges), 5 pairs held apart in the shipped stylesheet; 25 tokens are exempt with a stated reason.
- All 21 themes declare the same 72 token names (0 known exceptions, L3 clears them).
- **Gated in the browser, not here:** DI11 (reflow at 320 px, forced text spacing) and the other half of DI6 (whether the browser actually receives a `color-scheme`) are measured by `tests/fixtures.spec.mjs` against the bare per-theme fixtures. This table reads the token source, which cannot see either.

<!-- compliance:end -->

**Nothing is left ungated.** Every row above is produced by a check that
runs on every commit, and the two rows this table cannot see — DI11's
reflow and forced text spacing, and whether the browser actually receives
a `color-scheme` — are measured in a real browser against the bare
per-theme fixtures.

L3's exit criterion was "the compliance table reads pass everywhere". L3
could not reach it alone: DI2 needed a CSS rule that L4 wrote, and DI9
needed a check nobody had written. Both landed, and mini-round L3-EXIT
closed the criterion on 2026-09-04 rather than rewording it. The order
was the point — a table that printed `pass` for an invariant nobody
measured would have been worth less than one that admitted the gap, and
the gap is what eventually got the work done.

**What DI5 measures, and what it does not.** The gate reads opacity
keyframes and bounds the luminance swing pessimistically — the animated
element is assumed fully bright over a fully dark ground, so a run that
passes here passes in fact. Four of the six animations change no
luminance (`fx-glitch-a`, `fx-glitch-b`: transform and clip-path;
`fx-rgb-split`: drop-shadow offsets; `fx-cellflash`: one cell's text
colour for 200ms) and are listed in the gate with that reason. An
animation in neither category fails the gate rather than passing
silently, so the next effect someone adds cannot slip through the hole.

## What changed on 2026-09-04, and what it cost

Every theme gained `--border-strong`, `--input` raised to the 3:1 floor,
`--selected` speaking in the theme's own action colour, `--color-scheme`,
`--theme-font-body`, the three semantic plates with their inks, a third
signal colour, a corner notch and a motion pair. `--font-sans` left:
terminal was the only theme that had it, it existed for the Tailwind
bridge, and TH11's `--theme-font-body` is the published answer.

The status plates moved. Offer and rejected mean opposite things, and in
five of seven themes they were the same colour for the commonest colour
deficiency — 1.0 in formal, 0.5 in light. Red and green collapse together
there, so the separation had to come from lightness, the channel that
survives. All seven now clear 13.

DI4's token check is narrower than the draft implied, and deliberately.
Requiring all twenty-one pairs of seven pale plates to stay apart under a
deficiency is not achievable by any palette of seven light tints — the
best any theme managed was single digits. That is not a defect: it is the
reason DI4 says colour is never the *only* carrier. The tokens guarantee
the pair where confusion is harmful; the label is the component's job.
Queued as DI4-SCOPE for Kenny.
