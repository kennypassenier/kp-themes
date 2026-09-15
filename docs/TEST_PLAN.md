# Test plan — kp-themes

What is tested, where, and what is deliberately not. Written at Phase 7,
after an audit that laid `FEATURES.md` next to the actual tests and asked
of each one whether its assertion could ever fail.

## The suites

| Suite | Runs in | Reads | Covers |
| --- | --- | --- | --- |
| `gates/gates.test.mjs` | Node's built-in runner | the token source and the authored stylesheets | the gate functions themselves: theme discovery, token parity, the flash threshold, reduced-motion guards, state visibility, badge plates, layer discipline |
| `gates/check-*.mjs` | Node, on every commit | both the token source and the generated stylesheet | contrast, the design invariants, motion, layers, and whether the generated files still match their source |
| `tests/*.spec.mjs` | Chromium **and** Firefox, when Kenny runs them | a real browser | behaviour: the picker in both channels, the component contracts, keyboard operation of the overlays, reflow and text spacing, the printed page, the effects |

The split is Kenny's decision H1: the fast gates block a commit, the
browser tests block nothing. A gate slow enough to be worked around is not
a gate.

## The field test that was not run [Kenny, 2026-09-09, REL3]

Phase 9 asks for one before the release gate: the package used once from
a clean install, as a real consumer would, with at least one step scripted
rather than interactive. Kenny was asked and chose to skip it for 5.0.0.

It is written here rather than left unsaid, because the reason the step
exists is exactly this shape of confidence: latch 2.0.1 passed CI, a
hardening round and an external security review and was still unusable in
every real project — the first genuine use found it in one command. So
what this release has instead is the blocking gates, the browser suite
over both engines, and Kenny's own look at the pages. What it does not
have is one run through a consumer's own path: `npm pack`, install into
an empty directory, build a page with a theme, a register and a component
in both channels. Whatever that would have found, a consumer finds.

## How the suite is run [Kenny, 2026-09-09]

Round six ended with the suite at some 2500 tests, run in full on every
push by a GitHub Actions workflow: 254 runs in five days, 35.9 hours of
waiting, on a project whose every change Kenny approves himself before it
lands. He removed the CI entirely. Nothing runs on a server any more, and
`main` requires no status check.

| Command | What it runs | When |
| --- | --- | --- |
| `npm run gates` | the blocking checks, seconds [scope-76] | every commit, by the hook |
| `npm run test:tags` | the tests tagged with what a change touches (building), plus every `@sweep` test (commit), Firefox only | during work, and once before a commit |
| `npm run test:browser` | the whole suite, Chromium and Firefox | when Kenny asks for it |
| `npm run advice` | contrast, invariants, motion, texture, and since scope-76 variant grounds, the compliance table, the baseline checksums and prettier — a reading, never a verdict | when Kenny wants the reading |
| `npm run verify` | gates, then the whole suite, then the advice | before a release, on Kenny's own command |

`verify` is `gates/verify.mjs` rather than three commands joined by `&&`:
it banners each phase with the wall clock, prints a heartbeat when a phase
goes quiet for thirty seconds, and ends with a table of what ran and how
long each took. It runs the same commands the chain did — measured
overhead one node process, 17 ms. `--fast` runs the browser phase in
Firefox only, `--only=<phase>` runs one, `--no-advice` stops after the
suite. The advisory phase never fails the run; its findings appear in the
summary instead.

Three rules hold this together, and they are the reason it is safe to run
less rather than the reason it is faster:

1. **A test that needs a retry is not a test.** `retries` is 0 in
   `playwright.config.mjs` and stays 0. A test whose result depends on
   load, on timing or on which worker picked it up is a defect in the
   test, and is fixed as one — not tolerated with a wider assertion.
2. **`forbidOnly` is always on.** With no CI behind it, a stray `.only`
   would quietly reduce the suite to a single test and still print green.
3. **What a change touches is computed from tags, and the map is
   measured.** See "Tags decide what runs" below.

## Tags decide what runs [scope-33, 2026-09-14]

Every browser test carries at least one tag through Playwright's own
mechanism (`test('…', { tag: [...] }, …)` or a tagged `test.describe`):

- `@component:<name>` — the component or area it exercises; the
  vocabulary is `components` in `tests/tags.json` (the catalogue pages,
  plus `picker`, `layout`, `utilities`, `fonts`, `examples`, `showcase`,
  `site`, `bundle`, `catalogue`);
- `@theme:<name>` — a register spec, a theme-specific test, or one
  theme's instance of a per-theme loop (`@theme:${theme}`);
- `@sweep` — a cross-theme or cross-component invariant. A test whose own
  body walks every theme must carry it.

`tests/tags.json` maps changed files to tags, first rule wins: a register
selects `@theme:<theme>` plus `@sweep`-and-component for the rules it
changed (formal, the default theme, selects the components themselves);
a changed rule in `css/components.css` selects the component its selector
names, and a rule naming none selects `@sweep` and every component in the
file; a module selects its components; a changed spec runs whole; a helper
or fixture runs the specs that name it; `js/strings.js`, `js/auto.js`,
`hooks/**`, `package.json` and the test server select everything; a
comment-only stylesheet change and documentation select nothing.
`npm run check:tags`, part of `npm run gates`, reads the sources without a
browser and refuses an untagged test, a tag outside the vocabulary, a
theme walk without `@sweep`, and a file no rule covers.

| Level    | Command                                   | Runs                                   |
| -------- | ----------------------------------------- | -------------------------------------- |
| building | `npm run test:tags -- --level building`   | the tags of the changed files, Firefox |
| commit   | `npm run test:tags -- --level commit`     | building plus every `@sweep`, Firefox  |
| release  | `npm run test:browser` (or `--level release --go`) | everything, both engines, on Kenny's go |

`--dry-run` prints the selection per file, the `--grep` and the count from
`playwright test --list`; `--files <paths>` and `--commit <sha>` change
what counts as the change (default: everything since
`git merge-base HEAD main`, plus uncommitted and untracked files).

**Measured once against what it skips** (standing rule 7i). The old
affected map (gates/affected.mjs, removed at scope-33) answered `all` for each of the last 20 commits that
touched `css/`, `js/`, `components/` or `catalogue/` — 25,020 test runs.
The building level selected 9,156 and the commit level 13,599. Every test
the old selection ran and the building level skips is one the map holds
uncoupled: a catalogue-shell commit (47 tests) skips every test that never
opens a catalogue page; a register commit skips the other themes' sweep
slices, which the commit level runs. What no tag can see: a module that
fails to load breaks every page that bundles it, and a keyframe name
declared in several registers is decided by load order. The commit
level's sweeps catch the first on every sweep page; only the release level
catches everything. The full numbers are under `measured` in
`tests/tags.json`.

## What a gate must be able to do

**Fail.** Every check in this project has been shown red on a deliberately
injected violation before being trusted, and those drills are recorded in
`docs/archive/REALIZATION_PLAN.md`. The Phase 7 audit found the reason that rule
exists: a check for the visited link had been written, reported as built,
and never ran once — it guarded on a token that is derived rather than
declared, so its condition was false for all seven themes on every run. It
sat green beside the real checks. It now reads the generated stylesheet,
and it has been red.

**Say what it did not check.** A run that reports "35 checks, all passing"
answers the wrong question if nobody asked whether those were the right
35. The contrast gate refuses a colour token that appears in neither a
pair list nor an exemption list with a stated reason; the motion gate
prints the animations it skipped and why; the compliance table prints
`not gated` rather than `pass` for anything nothing measures.

## Proven in which environment

AR15 pins the baseline at modern Chrome and Firefox. Until Phase 7 the
browser suite ran in Chromium alone, which made a green run evidence about
Chromium (standing rule 35). It runs in both now, and
`tests/baseline.spec.mjs` asserts by name the four platform features this
package leans on — `<dialog>`, popover, anchor positioning, relative
colour syntax — plus the fact that an anchored menu actually lands under
its trigger, because a feature query proves the property parses and not
that the layout happened.

Everything here is runtime-verified on Linux, in both browsers. The
package ships no platform-specific code, so there is no build-verified
target awaiting a checklist.

## Not covered, by decision

Decided at the Phase 7 gate, 2026-09-04. An accepted gap is a choice with
a reason, written down; a silent hole is neither.

- **`BootSequence` has no test.** It is the one effect that needs the
  optional `motion` peer, which this package does not install
  (`fx/boot-sequence.jsx:5`, `package.json` peerDependenciesMeta) —
  testing it means adding a dependency for a component that renders
  nothing outside cyberpunk and carries no text anyone must read. If it
  breaks, a cyberpunk visitor misses a once-per-session opening animation
  and nothing else. The other three effects are tested, including the
  promise that matters most: outside cyberpunk, and for anyone who asked
  for less motion, the text is simply the text.

- **Nothing compares how the page looks.** Every check here is a number —
  contrast, distance, flashes per second, whether an element exists — and
  there are no screenshot comparisons. A theme can therefore look wrong
  while every test passes. The cost is real and was paid once already: at
  L3-EXIT, 42 colours were converted to tokens and the proof that nothing
  changed on screen had to be computed by hand, because no test could see
  it.

  Accepted rather than closed because screenshot baselines are brittle
  across machines — fonts rasterise differently on Kenny's screen and on
  the Linux runner — so the honest version needed a fixed machine, and a
  gate that cries wolf is worse than no gate. Since 2026-09-09 there is no
  fixed machine at all: the CI is gone, and this gap is now closed for
  good rather than deferred. Kenny watches the showcase; the numbers watch
  the colour.

- **`/security-review` was not run, because there is nothing for it to
  review.** Measured 2026-09-04 across `js/`, `components/`, `fx/`,
  `hooks/` and `index.js`: no `fetch`, no `XMLHttpRequest`, no
  `WebSocket`, no `process.env`, and no occurrence of password, token,
  secret or api-key. What the package touches is `document` (21 times),
  `localStorage` (5) and three window functions. The procedure makes the
  review mandatory for anything touching secrets, network or auth; this
  package touches none of the three.

## Not covered, by decision (Phase 7, 2026-09-12)

Kenny answered the Phase 7 gate on 2026-09-12. Eight gaps were to be
closed and one deferred; what stands here is the deferral, verbatim, plus
what the closing work could not reach.

**`second-engine` — the round's evidence comes from one engine.**
Deferred again at the release gate on 2026-09-12, in Kenny's own words:
*"misschien voor de volgende ronde als we terug iets aanpassen"* — the
second engine runs when the next round touches something, rather than
before this tag. Every
test written in round seven was driven red and then green in **firefox
only**: eight quirks, six hover gestures, two new registers, the pointer
bus, the two button surfaces, the counters, the React side navigation and
five corrections. Round six's drills each carried a chromium run beside
the firefox one; round seven's do not. This is a consequence of the rule
of 2026-09-11 — the inner loop is firefox, and the whole suite is Kenny's
to give — and he chose **Later**: both engines run after this release
rather than before it.

What that costs is measurable from this package's own record. The reflow
spec states that brutalism overflows in firefox only, and sepia and
solstice in chromium only; `gates/run-tags.mjs` records firefox as the
odd engine fourteen times against chromium's six. The properties this
round measures are the engine-divergent kind: computed `clip-path` polygon
serialisation, `scale` shorthand strings, pseudo-element `background-size`,
`mix-blend-mode` on an absolutely positioned child, canvas
`fontBoundingBoxAscent`, and `border-image` against a row background. The
suite runs across both engines, and firefox alone is half of it (scope-32
and scope-73 removed the appearance-only tests the catalogue now shows);
the second engine roughly doubles the wall-clock. How many tests there are
is what `npx playwright test --list` counts, not a number kept here.

**No support-probed skip any more.** `tests/fixtures.spec.mjs` used to
skip the themed select list where `appearance: base-select` is not
supported. That test measured appearance only and went with scope-32 on
2026-09-14; the list is judged by eye on `catalogue/field.html`. The
firefox-only tests that remain are scoped to one engine by decision, not
by a probe.

**Two readings that stayed under the floor, by decision, and one of them
is now closed.** Both were put to Kenny on 2026-09-12 and both were
answered, so neither was an open finding — they were choices with their
numbers written down.

`shade-light`'s muted colour **was** `hsl(194, 14%, 46%)`, measured at
3.99 on the page ground, 4.13 on a card and 3.61 on a muted panel,
against a 4.5 floor. It was identical to `--foreground` before Phase 7,
which meant nothing in the theme was muted at all: captions, hints,
timestamps and the text of an empty field all read as body text. There
was no LIGHTER colour that clears the floor, because shade-light's body
text only reaches 5.01 itself, so the choice at the time was between a
visible difference under the floor and no difference at all.

**Closed at `scope-101`, 2026-09-16** (Kenny, shade-light-contrast
"Donkerder maken"): the token went the other way, to `hsl(194, 14%, 39%)`,
and the three pairs measure 4.71, 5.21 and 5.39. Its two entries in
`tests/surfaces.spec.mjs` are gone — that list refuses an entry for a
pair the package no longer paints under the floor, which is how the
cleanup was found. What the change costs is recorded rather than hidden:
`--foreground` itself reaches only 4.52 on `--muted`, so no colour clears
4.5 on all three grounds while staying lighter than the body ink (the
best that exists is 0.02:1 quieter). The muted ink is therefore 0.19 to
0.22 STRONGER than the body text now instead of quieter, and 39% passes
this theme's own "the darkest text is 40% lightness" line. Both are
findings for Kenny, written into `themes/shade-light/tokens.json` and
`themes/shade-light/anatomy.md`.

`blueprint`'s witness lines moved inside the control rather than outside
it, so the six pixels of scrollable overflow on every one of its buttons
are gone. That one is closed rather than accepted.
