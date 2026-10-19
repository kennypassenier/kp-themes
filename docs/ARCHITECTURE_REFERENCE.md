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
js/progressbar.js    a bar's value from its ARIA│
js/loading-pieces.js a theme's loading pieces, │
                     pastel's caterpillar       │
js/busy-card.js      the busy table's loading   │
                     card over any data area    │
js/footprint.js      a data component keeps its │
                     loaded height in each state│
js/motion.js         closing, and easing a size │
js/update.js         a value updated in place,  │
                     the theme's way            │
js/actions.js        row buttons on shared      │
                     columns, a table measured  │
js/kpi.js            a tile's sparkline, filter │
                     toggle and meter; a strip's│
                     column count               │
js/attention.js      a band kept worst first,   │
                     and set by key             │
js/tiles.js          tiles of one height across │
                     a board's grids            │
js/freshness.js      "updated 12 s ago", ticking│
js/chart.js          the time chart; draws its  │
                     spark and a key figure's   │
                     trend with js/kpi.js       │
js/graph.js          a network: a hub, a ring,  │
                     links by kind              │
js/calendar.js       a month heatmap: tones by  │
                     date, Brussels's today     │
js/menu-button.js    every other action in a    │
                     rich menu, with its keys   │
js/tour.js           a short tour over the page,│
                     remembered once ended      │
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

The modules the diagram above leaves out are the opt-in components of the
later adoption rounds. Each follows the same rule: importing one attaches
nothing, and `js/auto.js` wires the ones a page carries markup for. What each
one is, from its own header comment:

```
js/ack-gate.js             a tick that must be set before the button it guards may be pressed
js/action-tiles.js         a button or link with a title and the one sentence that says what it does
js/anchors.js              a "#" beside a heading or row that copies a link to that place
js/art.js                  drawings for an empty state, in the theme's own hand
js/auto-refresh.js         the "Every 30 s / Paused" chooser; the app does the fetching
js/autosize.js             a multiline field that grows with its text
js/availability.js         who can come: people in rows, days in columns, edited as a grid (on js/heat.js)
js/barcell.js              a value with a proportional bar inside a table cell
js/bullets.js              rows of a value against a threshold
js/calm-tones.js           calm tones: a day with nothing logged is quiet, not failed
js/calm.js                 one page-level switch that turns movement and effects off
js/card-state.js           a card in four data states: filled, empty, loading, error
js/checklist.js            tick items off; the ticked ones sink to the end of their group
js/claim.js                who brings it: a claim on every row of a checklist
js/code.js                 a payload, request or snippet shown as text, with Copy and a full view
js/command.js              one command to run, with its terminal, privilege and a copy button
js/compare.js              two versions stacked with a draggable divider between them
js/connection.js           the connection banner: offline and reconnecting, apart from stale data
js/console.js              a prompt and, per command, a block saying whether it runs, succeeded or failed
js/logviewer.js            a live log in a capped buffer: find, wrap, time column, level, copy, download
js/diff.js                 a diff of several files: a header per file, folded unchanged lines, the changed words, and its states
js/countdown.js            a named timer in digits, with Start, Pause, Reset and a minute more
js/dated-options.js        a choice where every option has a date and an age
js/deplist.js              rows "A → B" saying what needs what, numbered in order
js/docpreview.js           a document shown without downloading it, in the viewer shell
js/entity-card.js          one fixed card per thing, the same height in every state
js/facets.js               checkbox rows with a count and an "only" button
js/flash.js                a button that shows its result for a moment, at one width
js/focus-steps.js          one step at a time, large, with the screen kept on
js/gallery.js              a grid of pictures that open large in the viewer shell
js/gantt.js                a run timeline: one bar per run, running bars growing live
js/heat.js                 the heat grid and the matrix
js/hovercard.js            one tooltip for a whole page, filled when it opens
js/idmark.js               a small chip made from a name, the same on every page
js/intent.js               words in any order: the palette's default match
js/json-field.js           a text box that checks, formats and minifies JSON as it is typed
js/keys.js                 the inline line of keyboard shortcuts, as key caps
js/lede.js                 the short paragraph under a heading that says what the section does
js/master-detail.js        a list and its detail side by side, folding to one pane on a phone
js/nav-fold.js             a bar that folds the links that do not fit behind a "More" menu
js/newpill.js              the "N new lines" pill on a live list or log
js/notices.js              the notification centre: counter, newest panel, per-source switches
js/passkeys.js             the list of ways to sign in: passkeys, magic links, passwords, tokens
js/path-trace.js           the path of one connection: hops, each allowed or refused
js/pipeline.js             where each item stands, one lane per stage
js/print.js                the words a printed list needs, and a Print button
js/problems.js             the problem alert: what is wrong, why, and what to do now
js/qr.js                   a link as a QR code a phone can scan
js/quantity.js             a number between a minus and a plus, with its unit
js/question-card.js        the host waits for your answer: a question and what each answer does
js/quote.js                your own earlier words, verbatim, with who wrote them and when
js/range.js                the range picker: a preset or a custom from-to
js/rating.js               a star rating, given or shown
js/reason.js               a disabled control says why, as a tooltip and as its description
js/request-inspector.js    a foldable block per captured HTTP request
js/row-select.js           rows ticked with the keyboard and with Shift-click
js/runs.js                 the next times: what a repetition really does
js/segmented.js            the segmented control and the filter chips
js/selection-bar.js        the bar that appears when rows are ticked, with their actions
js/sentence.js             a form that reads as a sentence, the fields standing inside the words
js/shortcuts.js            one list that both handles the keys and fills the help sheet
js/slider.js               one value, or a range with two thumbs
js/snooze.js               the "remind me later" picker, each choice with its exact moment
js/stackbar.js             one bar split into the parts of a whole
js/state-plate.js          the plate an empty or failed area is drawn with
js/statusrow.js            status rows: one state per item
js/steplist.js             the steps of one run, live
js/tabbar.js               the bottom tab bar for phone widths
js/thread.js               a conversation in bubbles
js/tick.js                 a live number that ticks to its new value
js/timefield.js            a field for a time of day, 24 hours, typed, stepped or picked
js/timer-disc.js           the visual timer: the time left as a shrinking disc
js/timer.js                kitchen timers: named countdowns that keep running
js/toggle.js               a button that stays pressed until it is pressed again
js/toolbar.js              the bar above a list, log, board or chart
js/transfer.js             a progress bar with a file name, speed and the time left
js/undo-toast.js           a toast with Undo and a visible clock
js/unsaved.js              the unsaved-changes bar, with Save and Discard
js/uptime.js               one thin strip of cells, one per period, toned by how the service did
js/uses-map.js             "used by": sources and their users joined by lines
js/usual-picker.js         a combobox with the usual choices on top
js/version-delta.js        the version jump chip, "10.11 → 12.1", with the size of the jump
js/viewer.js               the viewer shell: one thing opened large in a modal dialog
js/week.js                 a week agenda: seven day columns with the items placed in time
js/weekdays.js             the weekday picker: seven chips, or the days of a month
js/wheel.js                a wheel that picks for you, with weights
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

Thirty-one checks, all in Node, the whole chain in seconds, all run by
`.claude/hooks/gates.sh` before every commit (the Home Assistant, VS Code,
TUI and desktop generators left with their families for repositories of
their own at scope-139; `check:tokens-tar` holds the asset they build
from). Since scope-76 older
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
