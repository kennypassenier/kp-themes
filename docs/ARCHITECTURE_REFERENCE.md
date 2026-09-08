# Architecture reference

The system as built. `docs/ARCHITECTURE_DECISIONS.md` says what was
decided and why; this says what is there.

## The shape of it

```
themes/<name>/tokens.json   authored: the colours, one file per theme
        │
        ├─ gates/generate-themes.mjs ──→ css/themes.css        (the palette)
        │                            └─→ js/theme-registry.js  (name, label, dark)
        │
        └─ gates/generate-showcase.mjs ─→ showcase/index.html  (25 blocks)
                                      └─→ showcase/themes/*.html (one each, bare)

css/_header.css  ─┐
css/_rules.css   ─┴─ concatenated verbatim into css/themes.css
css/components.css   separate: only for consumers who take the components
css/layout.css       separate: nineteen classes for the shape of a page
css/utilities.css    separate: 118 generated one-property classes
css/fonts.css        separate: the @font-face block for the shipped faces
css/<name>-register.css      opt-in, one per theme, 25 of them

js/theme-core.js     the state, in the document
js/theme-picker.js   framework-free picker    ─┐ pure: importing one
js/components.js     the DI4 and DI10 contracts │ attaches nothing. Only
js/overlays.js       dialogs, tabs, toasts      │ js/auto.js has a side
js/effects.js        the hooks, the marquee    ─┘ effect, by design

hooks/use-theme.js   React, sitting on theme-core
components/*.jsx     React, rendering the same classes as the CSS above
fx/*.jsx             cyberpunk effects
```

Nothing here is compiled. The package ships the files a browser reads.

## Two generated artefacts, and why

`css/themes.css` and `js/theme-registry.js` are written by
`gates/generate-themes.mjs` from the token sources, and `--check` fails
when either has drifted. Nothing in them varies between runs: no
timestamps, no hashes, no host names, so a fresh clone reproduces them
byte for byte.

The registry exists because the theme list used to live in JavaScript as
well as in CSS, including each theme's colours — 21 values duplicated. It
now carries only what JavaScript needs (name, label, and whether the theme
is dark), and `dark` is read from the theme's own `color-scheme`, which is
the same declaration the gates check. A picker cannot believe in a fourth
dark theme when the list comes from the stylesheet's source.

## Where the theme lives

On `<html>`, as `data-theme`, plus a `dark` class for consumers with
`dark:` variants. Not in a React context, not in a module variable.

That choice is what lets both channels coexist: a plain `<script>` cannot
reach a React module's closure, so two pickers on one page would each set
the theme correctly and each fail to update the other's mark. Reading the
document instead, and announcing changes as one DOM event
(`kp-theme-change`), makes that problem disappear — and cross-tab following
rides the same bus, because a `storage` event is translated into the same
announcement rather than a second mechanism.

```
click in either picker
   └→ applyTheme()  ─ validates, sets data-theme + .dark class
        └→ CustomEvent('kp-theme-change') on document
             ├→ every framework-free picker updates its marks
             ├→ React's useSyncExternalStore re-renders
             └→ the fx components re-read the theme
```

## Colour, and the four numbers that are not ours

Everything about colour goes through `gates/colour.mjs`. Values are
authored and emitted as `hsl()`, because that is what the stylesheet has
always used and what the vendored copies contain — but anything reasoning
about how a colour *looks* converts to OKLCh first. One numeric step of
HSL lightness on terminal's saturated green and on formal's dark navy look
nothing alike; one OKLCh step does.

Pinned standards constants, with the reason in the code: 4.5:1 for text,
3:1 for non-text and large text, three flashes per second, a 10%
luminance change, the 341×256 px flash area, and WCAG's 0.03928 luminance
threshold (which differs from sRGB's 0.04045 — the gates measure against
WCAG).

House numbers, tunable in `gates/config.json` with their reasons: the
derivation steps, the perceptual-distance floor, the texture-opacity
ceiling, the state-visibility floor, the badge-plate floor.

### Derived tokens

A theme authors 96 tokens (the contract `gates/check-tokens.mjs` holds,
widened by S47 as themes needed more). The generator adds more, and a theme may
override any of them by declaring it itself:

| Derived | From | Rule |
| --- | --- | --- |
| `--*-hover`, `--*-active`, `--*-disabled` | primary, secondary, accent, destructive | Carbon's grammar: half a step, two steps, and a step and a half the other way |
| `--focus-ring`, `--focus-ring-contrast` | foreground, background | two channels, so one of them always contrasts |
| `--link` | primary | already gated against both surfaces a link sits on |
| `--link-visited` | link | rotated 45° round the hue wheel, dimmed only if that alone will not clear the floor |

The pressed state gives up chroma when lightness cannot move far enough.
That is not a flourish: cyberpunk and terminal sit near the top of the
colour space, and lightness alone left their pressed state invisible.

## The gates, and the advice beside them

Thirty checks, all in Node, the whole chain in seconds, all run by
`.claude/hooks/gates.sh` before every commit. Nothing runs on a server:
Kenny deleted the CI on 2026-09-09 and runs the browser suite himself.
`package.json`'s `gates` script is the authoritative list; the table below
is the shape of it rather than the whole.

| Gate | Reads | Answers |
| --- | --- | --- |
| `generate-themes --check` | source + artefact | has the generated output drifted |
| `check-tokens` | token sources | do all twenty-five declare the same 96 names |
| `check-layers` | the authored stylesheets | does any colour live outside the token layer |
| `check-hooks` | the registers | does every theme answer all six hooks |
| `check-register-coverage` | the registers | does a register answer every component root, and the nav dropdown [KT14] |
| `check-fonts` | `fonts/`, the name tables | licence, reserved names, per-theme budget |
| `check-strings` | the source | does every user-visible string come from the dictionary [KT5] |
| `generate-showcase --check` | source + artefact | has the showcase drifted |
| `generate-min --check` | source + artefact | does the minified build match, and its size table |
| `compliance --check` | the other gates | does the published table match what they measure |
| `tsc --noEmit`, `check-types` | everything | the type check, and the shipped declarations [KT4] |

Five more checks are **advice, not gates** [Kenny, 2026-09-09]. They run
in `npm run advice` and print rather than refuse: `check-contrast` (every
colour pair and every token accounted for), `check-invariants`
(boundaries, focus ring, colour vision, state contrast, state visibility,
badge plates), `check-motion` (flashes per second, reduced-motion guards),
its DI5 report, and `check-texture` (DI9's ceiling). The package measures
those floors and does not promise to have met them; `README.md` says so
in the same words.

Two properties matter more than the list.

**A gate says what it did not check.** The contrast gate refuses a colour
token that is in neither a pair list nor an exemption list with a written
reason. The motion gate prints the animations it skipped and why. The
compliance table prints `not gated` rather than `pass` for anything
nothing measures — it has no such rows left, but the machinery is there
because a table that lies by omission is worse than a gap.

**A gate must have been red.** Every one of them has been shown failing on
a deliberately injected violation, and those drills are recorded in
`docs/REALIZATION_PLAN.md`. One check in this project was written,
reported as built, and never ran once — it guarded on a derived token that
no theme declares. That is why the drill is not optional.

## The browser tests

Playwright, Chromium and Firefox, against a small static server
(`tests/global-setup.mjs`). Some 2500 tests over 70 spec files, run when
Kenny runs them — `npm run test:affected` for what a change touches,
`npm run test:browser` for all of it.
They cover what Node cannot see: whether the browser received a
`color-scheme`, whether a page reflows at 320 px, whether forced text
spacing clips a badge, whether focus returns to the button that opened a
dialog, and whether an anchored menu actually lands under its trigger.

The suite runs each behaviour against both channels through the same
selectors, because two channels can be structurally identical and behave
differently — which is exactly what happened once with focus return.

## The baseline

Modern Chrome and Firefox. The package leans on `<dialog>`, the popover
API, CSS anchor positioning and relative colour syntax, and
`tests/baseline.spec.mjs` asserts all four by name so a missing one says
which rather than surfacing as a menu in the wrong place.

No build step, no bundler, no polyfills. A consumer with npm imports the
modules; a consumer without npm copies `css/themes.css` and adds a
`<script type="module">`.
