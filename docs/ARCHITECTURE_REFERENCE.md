# Architecture reference

The system as built. `docs/archive/ARCHITECTURE_DECISIONS.md` says what was
decided and why; this says what is there.

## The shape of it

```
themes/<name>/tokens.json   authored: the colours, one file per theme
        │
        ├─ gates/generate-themes.mjs ──→ css/themes.css        (the palette)
        │                            └─→ js/theme-registry.js  (name, label, dark)
        │
        └─ gates/generate-showcase.mjs ─→ showcase/index.html  (22 blocks)
                                      └─→ showcase/themes/*.html (one each, bare)

css/_header.css  ─┐
css/_rules.css   ─┴─ concatenated verbatim into css/themes.css
css/components.css   separate: only for consumers who take the components
css/layout.css       separate: twenty-one classes for the shape of a page
css/utilities.css    separate: 118 generated one-property classes
css/fonts.css        separate: the @font-face block for the shipped faces
css/<name>-register.css      opt-in, one per theme, 22 of them

css/_density.css     separate: the compact mode, one knob on the root
css/_print.css       separate: what a page becomes on paper
css/tailwind-bridge.css  separate: the tokens as Tailwind's own names

js/theme-core.js     the state, in the document
js/theme-registry.js the generated list: name, label, whether it is dark
js/no-flash.js       the snippet for <head>: before the stylesheet, or below
                     css/themes.css when it also writes the register
js/lazy-register.js  the active theme's register, fetched at runtime (opt-in)
js/remember.js       the one memory: what a reader chose, put back
js/strings.js        every user-visible string, English by default [KT5]
js/locale.js         the page's own locale, never a hard-coded one
js/theme-picker.js   framework-free picker    ─┐ pure: importing one
js/components.js     contracts; sticky, menus   │ attaches nothing. Only
js/overlays.js       dialogs, tabs, toasts,     │ js/auto.js has a side
                     whether an overlay scrolls │
js/alarm.js          the full-screen alarm      │
js/effects.js        the reveal core; fetches   │ effect, by design
                     its hooks when asked       │
js/effects/*.js      the hooks: headline, marks,│
                     rule, count, caret, the    │
                     pointer and press buses,   │
                     measure, marquee, arrival  │
js/as-of.js          a late module attaches to  │
                     the page as it was asked   │
js/sidenav.js        the side navigation        │
js/forms.js          validation and its wording │
js/tables.js         sorting, regions           │
js/datatable.js      search, paging             │
js/top-layer.js      an open list or calendar   │
                     above a clipping container │
js/listbox.js        the shared listbox         │
js/combobox.js       typeahead over it          │
js/palette.js        the command palette        │
js/datepicker.js     a calendar                 │
js/colorpicker.js    a colour field             │
js/gridlayout.js     a resizable grid           │
js/log.js            a name's own colour        │
js/structure.js      tree, reorder, split       │
js/wizard.js         a stepped flow             │
js/upload.js         a file field               │
js/patterns.js       copyable, and the rest     │
js/diagnostics.js    what the page can tell you │
js/contrast.js       the reading, for a consumer ┘

hooks/use-theme.js   React, sitting on theme-core
hooks/use-strings.jsx  React, the strings provider
components/*.jsx     React, rendering the same classes as the CSS above
                     — twenty-one of them, including the side navigation,
                     which has both channels since 2026-09-12, and the
                     alarm since 2026-09-15
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

## Where remembered state lives

On the ELEMENT, as a name, and in `localStorage` under a key composed from
it — never under a key written in a module [Kenny, 2026-09-16: *"die key in
localStorage moet niet hardcoded zijn, stel dat we twee van dezelfde
elementen naast mekaar op de pagina willen ofzo"*].

```text
kp-remember : <component> : <name> : <slot>
   prefix      the package    data-kp-remember   which piece of state
   (settable)  names the kind on the element     groups · open · rail ·
                                                 branches · value ·
                                                 columns · sort · density
```

The page is not in the key, on purpose: the case this exists for is a group
that stays folded after following a link.

`js/remember.js` is the only file that knows about storage. What keeps it
ONE mechanism rather than five is that it paints MARKUP: the stored state
goes back on the element as the attributes an author could have written by
hand — `data-kp-sidenav-expanded`, `open`, `aria-valuenow`, `aria-sort`,
`data-kp-column-hidden`, `data-density` — and every module goes on reading
its own markup exactly as it did before. No module gained a second way to
start up.

```
js/auto.js (deferred, before DOMContentLoaded)
   └→ restoreRemembered(document)
        └→ paintRemembered(element, component)   attributes only
             └→ attachSidenavs / attachStructure / attachDataTables
                  read the markup, as they always did, and write
                  memory.write(slot, value) when the reader changes it
```

A name is claimed by the first element that asks for it: a second element
of the same component with the same name gets no memory, keeps its markup
default and reports `kp-remember-clash`. Sharing one key between two panels
would make them mirror each other, which is the fault the name prevents.

Not everything remembers. The components that do are the ones a reader
arranges — the side navigation's groups and rail, the accordion, the tree,
the split pane, the data table's columns, sort and density. Dialogs,
popovers, menus, tooltips, toasts, the combobox, the date picker, the
wizard's step and the alarm deliberately do not: each is opened for a
moment, and a page that reopens one by itself is arguing with its reader.

## Colour, and the four numbers that are not ours

Everything about colour goes through `gates/colour.mjs`. Values are
authored and emitted as `hsl()`, because that is what the stylesheet has
always used and what the vendored copies contain — but anything reasoning
about how a colour *looks* converts to OKLCh first. One numeric step of
HSL lightness on terminal's saturated green and on formal's dark navy look
nothing alike; one OKLCh step does.

Two contrast functions live there, and the difference matters: `contrast()`
measures the channels as computed, which is right for the picker, which is
still moving a colour; `paintedContrast()` rounds each channel to the 8 bits
the screen receives first, which is right for a gate judging a colour that
has landed. The gates use the painted one, all of them, since two of them
answered 4.51 and 4.47 about the same pair [fix-59].

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

Thirty-four checks, all in Node, the whole chain in seconds, all run by
`.claude/hooks/gates.sh` before every commit (the VS Code colour themes
joined at scope-125, the Rust palette at scope-128 and the Windows and
Linux desktop files with `check:desktop`, beside the Home Assistant
ones). Since scope-76 older
checks run inside them rather than on their own line — tokens in `npm test`,
the bundle in `generate-min --check`, the migration note in
`check-docs-runnable`, the fonts stylesheet in `check-fonts`, the package in
`check-manifest`; the tear check that ran in `generate-themes --check` went
with cyberpunk's razor tear at scope-96. Nothing runs on a server:
Kenny deleted the CI on 2026-09-09 and runs the browser suite himself.
`package.json`'s `gates` script is the authoritative list; the table below
is the shape of it rather than the whole.

| Gate | Reads | Answers |
| --- | --- | --- |
| `generate-themes --check` | source + artefact | has the generated output drifted |
| `check-tokens`, via `npm test` | token sources | do all twenty-five declare the same 96 names |
| `check-layers` | the authored stylesheets | does any colour live outside the token layer |
| `check-hooks` | the registers | does every theme answer all six hooks |
| `check-register-coverage` | the registers | does a register answer every component root, and the nav dropdown [KT14] |
| `check-fonts` | `fonts/`, the name tables | licence, reserved names, per-theme budget |
| `check-strings` | the source | does every user-visible string come from the dictionary [KT5] |
| `generate-showcase --check` | source + artefact | has the showcase drifted |
| `generate-min --check` | source + artefact | does the minified build match, and its size table |
| `tsc --noEmit`, `check-types` | everything | the type check, and the shipped declarations [KT4] |

Five more checks are **advice, not gates** [Kenny, 2026-09-09]. They run
in `npm run advice` and print rather than refuse: `check-contrast` (every
colour pair and every token accounted for), `check-invariants`
(boundaries, focus ring, colour vision, state contrast, state visibility,
badge plates), `check-motion` (flashes per second, reduced-motion guards),
its DI5 report, and `check-texture` (DI9's ceiling). The package measures
those floors and does not promise to have met them; `README.md` says so
in the same words. Four more joined them on 2026-09-14 [scope-76]:
`check-variant-ground`, `compliance --check` (does the published table
match what the checks measure), `check-baseline` and `prettier --check .`.

Two properties matter more than the list.

**A gate says what it did not check.** The contrast gate refuses a colour
token that is in neither a pair list nor an exemption list with a written
reason. The motion gate prints the animations it skipped and why. The
compliance table prints `not gated` rather than `pass` for anything
nothing measures — it has no such rows left, but the machinery is there
because a table that lies by omission is worse than a gap.

**A gate must have been red.** Every one of them has been shown failing on
a deliberately injected violation, and those drills are recorded in
`docs/archive/REALIZATION_PLAN.md`. One check in this project was written,
reported as built, and never ran once — it guarded on a derived token that
no theme declares. That is why the drill is not optional.

## The browser tests

Playwright, Chromium and Firefox, against a small static server
(`tests/global-setup.mjs`). How many there are is whatever
`npx playwright test --list` counts today, not a number kept here. They run when
Kenny runs them — `npm run test:tags` for what a change touches, selected by tag (`tests/tags.json`),
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
