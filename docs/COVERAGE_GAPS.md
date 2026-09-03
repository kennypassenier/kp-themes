# Coverage gaps — what the themes do not reach yet

Written 2026-09-04, at Kenny's request after he saw blue links on the
terminal theme (finding F1 in [MINI_ROUNDS.md](MINI_ROUNDS.md)). The
question he asked: which other UI elements — a displayed URL was his
example — are not covered by our themes, when the basics of a modern web
page ought to be.

Every claim below was measured in this repository on 2026-09-04. Where a
consumer had to fill a gap itself, that is named too, because a gap a
consumer already worked around is a proven gap rather than a hypothetical
one.

## The finding underneath all the others

**This package is a palette, not a stylesheet.** Measured across
`css/themes.css`, `css/cyberpunk-register.css` and
`css/tailwind-bridge.css`, the complete set of element-level rules is:

| What is styled | Where | Scope |
| --- | --- | --- |
| `body` background and text colour | `themes.css:531` | all themes |
| `body::after` — the texture layer | `themes.css:409` | all themes |
| `h1` / `h2` display face and spacing | `themes.css:453`, `:465`, `:484` | pastel, terminal, formal only |
| `::selection` | `themes.css` (2 rules) | cyberpunk, terminal |
| scrollbar track and thumb | `themes.css` (webkit) | per theme |
| `input` / `textarea` caret colour | `cyberpunk-register.css:44` | cyberpunk only |
| `.fx-media:hover iframe` | `cyberpunk-register.css:234` | cyberpunk only |

That is the entire list. There is no rule for `a`, `button`, `code`,
`pre`, `table`, `hr`, lists, or any form control outside cyberpunk's
caret. The package hands a consumer 47 colour tokens and expects it to
write every rule itself — which is exactly why three consumers each wrote
their own, and why they diverge.

Absent entirely, verified by search across `css/`: `accent-color`,
`color-scheme`, autofill handling, `:disabled`, `:invalid`, `:checked`,
`:focus-visible`, `::placeholder`, `::marker`, `::backdrop`, and any rule
for `dialog`, `details`, `summary`, `progress`, `blockquote`, `kbd`, `hr`,
`code`, `pre`.

Two of those deserve singling out because they are not merely missing but
actively harmful when missing:

- **`color-scheme`.** Without it the browser keeps rendering its own
  chrome — scrollbars, form controls, the autofill highlight — in light
  mode on a dark theme. One declaration fixes all of it at once.
- **Autofill.** Browsers force their own background colour onto an
  autofilled field and it overrides ordinary rules. On the three dark
  themes that produces a bright block in the middle of a dark form.

## Group A · Text-level primitives

The things a page gets for free from the browser, all of which the
browser colours to its own taste rather than the theme's.

| Element | Status | Note |
| --- | --- | --- |
| `a` (link) | **not styled** | Finding F1. Browser blue scores 1.99 / 2.09 / 2.06 against the dark, cyberpunk and terminal backgrounds where AA needs 4.50. Our `--primary` would score 6.36 / 6.57 / 12.70. |
| `a:visited` | not styled | Browser purple is worse: 1.70 / 1.79 / 1.76. |
| `code` (inline) | not styled | kyu writes its own rule in `templates/layout.html`. |
| `pre` (code block) | not styled | kyu writes `pre.snippet` itself, including its background and border. |
| `kbd` | not styled | A keyboard key rendered as ordinary text. |
| `mark` | not styled | Browser yellow on a dark theme is a flare. |
| `blockquote` | not styled | |
| `hr` | not styled | Browser default is a fixed grey unrelated to `--border`. |
| `ul` / `ol` / `::marker` | not styled | Bullet colour does not follow the theme. |
| `abbr`, `del`, `ins`, `small` | not styled | Low priority; listed for completeness. |

## Group B · Data display — Kenny's "displayed URL" case

This is the group he named, and it is the one the consumers most
visibly had to invent for themselves.

| Need | Status | Evidence from a consumer |
| --- | --- | --- |
| A URL or long identifier shown as text | **not covered** | kyu wrote `td.payload { max-width: 28rem; overflow-wrap: anywhere }` — a long unbroken string otherwise stretches a table off the page. |
| A masked or sensitive value | not covered | kyu wrote `.secret { font-family: monospace; overflow-wrap: anywhere }`. |
| Numbers that line up in a column | not covered | kyu wrote `.tabular { font-variant-numeric: tabular-nums }`, used 14 times in its templates. |
| Truncation with an ellipsis | not covered | |
| A timestamp or duration | not covered | |
| An empty state ("nothing here yet") | not covered | |

Three of these six already exist by hand in one consumer. That is the
strongest available argument that they belong here.

## Group C · Forms

The package styles one thing in this group — the caret colour, and only
in cyberpunk.

Not covered: `input`, `select`, `textarea` in any theme other than
cyberpunk's caret; `::placeholder`; the `:disabled`, `:invalid`,
`:checked` and `:focus-visible` states; checkbox and radio (`accent-color`
is the one-line answer and is absent); a switch; label, help text and
error text; `fieldset` / `legend`; the file input; and the autofill
override named above.

kyu had to write `.form-control`, `.form-select`, their focus state and
their placeholder itself.

## Group D · Interactive and overlay components

None of these exist in the package, and none are in the v1 list decided
in Phase 2 round 1 (TH1-TH8: button, badge, table, alert, form field,
card, navbar, picker).

Dropdown or menu · dialog and its `::backdrop` · tooltip · popover ·
toast · `details`/`summary` accordion · tabs · breadcrumb · pagination ·
progress bar · spinner · skeleton placeholder.

Worth noting: the theme picker (TH8) *is* a dropdown, so the package will
have built the mechanics of one without exposing it as a component.

## Group E · Page chrome

| Need | Status |
| --- | --- |
| Focus ring | `--ring` exists as a token but no rule applies it, and `:focus-visible` appears nowhere. Same shape as F1. |
| Skip-to-content link | not covered |
| Scrollbar | covered (webkit only) |
| Text selection | covered for cyberpunk and terminal; the other five fall back to the browser's blue |
| Footer | not covered |
| Print stylesheet | not covered |
| 404 / error page | not covered |

`::selection` being covered for two of seven themes is itself a symmetry
violation of the kind TH20 is meant to end.

## What this suggests for the decisions still open

1. The v1 component list (TH1-TH8) covers Group D barely and Groups A, B
   and C not at all. Groups A and B are cheap — they are element rules
   against tokens that already exist, not new components — and Group B is
   the one a consumer has already proven it needs.
2. Several gaps are one declaration each (`color-scheme`, `accent-color`,
   the autofill override) and remove whole classes of dark-mode ugliness.
3. The pattern behind F1 repeats here: `--ring` is declared, checked by
   nothing, and applied nowhere. A token the package does not itself apply
   is a token the package cannot rely on.
