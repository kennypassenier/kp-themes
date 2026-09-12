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
what this release has instead is thirty-two gates, 2,594 browser tests
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
| `npm run gates` | the thirty blocking checks, seconds | every commit, by the hook |
| `npm run test:affected` | the specs a change actually touches, Firefox only | during work, when there is something to see |
| `npm run test:browser` | the whole suite, Chromium and Firefox | when Kenny asks for it |
| `npm run advice` | contrast, invariants, motion, texture — a reading, never a verdict | when Kenny wants the reading |
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
3. **What a change touches is computed, not guessed.**
   `gates/affected.mjs` reads `git diff` and answers `none`, `all`, or a
   list. It says `all` for anything it cannot prove narrow — a change to
   `js/effects.js` reaches 71% of the suite, and a map clever enough to
   split that would be wrong exactly where nobody looks.

## What a gate must be able to do

**Fail.** Every check in this project has been shown red on a deliberately
injected violation before being trusted, and those drills are recorded in
`docs/REALIZATION_PLAN.md`. The Phase 7 audit found the reason that rule
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
  while every one of the 2500-odd tests passes. The cost is real and was paid once already: at
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

**`second-engine` — the round's evidence comes from one engine.** Every
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
solstice in chromium only; `gates/run-affected.mjs` records firefox as the
odd engine fourteen times against chromium's six. The properties this
round measures are the engine-divergent kind: computed `clip-path` polygon
serialisation, `scale` shorthand strings, pseudo-element `background-size`,
`mix-blend-mode` on an absolutely positioned child, canvas
`fontBoundingBoxAscent`, and `border-image` against a row background. The
suite is 2,734 tests over 79 files across both engines and 1,367 in
firefox alone; the second engine roughly doubles the wall-clock.

**One engine-conditional skip, by design.** `tests/fixtures.spec.mjs`
skips the themed select list where `appearance: base-select` is not
supported, naming the engine. The support is probed, not assumed.

**Two findings are open rather than uncovered.** `blueprint-width` and
`shade-light`'s muted colour are both put to Kenny as findings, because
each changes a value an approved demo showed and `S49` reserves that to
him. Their tests stay red until he answers; they are not accepted
limitations and are not recorded as such.
