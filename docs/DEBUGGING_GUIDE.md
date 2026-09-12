# Debugging guide

For the person holding a page that looks wrong, or a red verdict, and no
idea which of the two halves of this package produced it. It is written
to be usable at 2am: every message below is quoted from the source that
prints it, and every command is one that exists in `package.json`.

**This is the maintainer's half.** [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md)
is the consumer's index — "my page flashes the wrong theme", "my picker
does not remember" — and it is still the first place to look if you are
_using_ the package rather than changing it. This guide is about the
evidence: what to run, in what order, what each surface can and cannot
see, and the six fault families this project has actually hit more than
once. Where the two overlap, this guide points there rather than
repeating it.

[docs/OPERATIONS_RUNBOOK.md](OPERATIONS_RUNBOOK.md) is the third of the
set: the numbered procedures — regenerate, add a theme, move a token, cut
a release. When a check refuses in the middle of one of those, it sends
the reader here.

---

## 0 · What this package can tell you, and what it cannot

There is no server, no process and no log file. Two artefacts ship: a
stylesheet and a set of ESM modules. So there is nothing to restart and
nothing to tail, and every question reduces to one of five:

| Question | The surface that answers it |
| --- | --- |
| What is the document actually wearing? | `document.documentElement.dataset.theme` |
| Are the two halves the same version? | `showcase/diagnostics.html`, or `diagnose()` from `js/diagnostics.js` |
| Does the source break a rule the project holds? | `npm run gates` |
| Does the paint break a floor the project only measures? | `npm run advice` |
| Does the browser agree? | `npx playwright test <file> --project=firefox` |

The runtime diagnostic surfaces the package ships, all of them:

| Surface | Where it comes from | What it means |
| --- | --- | --- |
| `console.warn` beginning `kp-themes: "…" is not a theme this build knows` | `js/theme-core.js`, `reportUnknown()` | a name was dropped; once per name per session |
| `kp-theme-unknown` event, detail `{ requested, applied, source }` | `js/theme-core.js` | the same thing, for code; `source` is `stored`, `current`, `apply` or `cross-tab` |
| `showcase/diagnostics.html` | `renderDiagnostics()` in `js/diagnostics.js` | which of the stylesheet and the JavaScript is behind |
| `kp-effect-unknown` event, detail `{ hook, value, accepted }` | `js/effects.js` | a hook value the vocabulary does not know; heard, never thrown |
| `data-kp-reveal-state` = `armed` \| `rest` \| `played` | `js/effects.js`, `REVEAL_STATE` | what happened to one revealed element, readable at any moment |
| `[data-kp-theme-status]` becoming visible | `js/theme-picker.js`, `showSaveState()` | storage refused the choice |
| `data-kp-contract-error="DI10"` or `="DI4"` on an element | `js/components.js`, `enforceContracts()` | that element broke a component contract and was disarmed |
| `console.error` beginning `[kp-themes DI10]` / `[kp-themes DI4]` | `js/components.js` | the same, with the element attached |
| `kp-contract-violation` event | `js/components.js`, `VIOLATION_EVENT` | the same, for code |

What none of them can see: whether a rule in a register cancelled a rule
in the components layer. That is the cascade, it is silent, and it is
family 1 below — the most expensive family this project has.

---

## 1 · The evidence trail

Follow it in order. Each step is cheap and rules out a whole class, so
skipping one costs more than running it.

### Step 1 — Is this the package, or the page?

Before anything, in the browser console of the page that looks wrong:

```js
document.documentElement.dataset.theme; // what is actually being worn
getComputedStyle(document.documentElement).getPropertyValue('--kp-themes-version');
```

`--kp-themes-version` is declared on `:root` by the generated
stylesheet. `css/themes.css` line 35 carries it as
`--kp-themes-version: '5.1.0';` today, and `--kp-themes-names` beside it
lists every theme that file knows.

If the version property is empty, the page is on a stylesheet older than
3.2.0. If `dataset.theme` is empty, nothing is applying a theme at all —
that is `docs/TROUBLESHOOTING.md`, "Everything is the default theme".

Then open `showcase/diagnostics.html` (or render the same report into
your own page with `renderDiagnostics(element)` from `js/diagnostics.js`).
It compares what the stylesheet says about itself against what
`js/theme-registry.js` says, and prints one of five verdicts, verbatim
from `js/strings.js`:

- `The stylesheet and the JavaScript come from the same version, and they know the same themes.`
- `The stylesheet is behind: it is version X and the JavaScript is version Y. Copy a newer css/themes.css.`
- `The JavaScript is behind: the stylesheet is version X and the JavaScript is version Y. Copy newer files from js/.`
- `Both halves say version X and yet they know different themes, so at least one of the two files has been edited by hand.`
- `The stylesheet declares no version, so it was generated before 3.2.0 — older than the JavaScript beside it, whatever that one says.`

This exists because of a real fault: almanac vendored a `css/themes.css`
that knew twenty-four themes beside a `js/` that knew eleven, and the
eleven both halves knew were exactly the ones that worked. No gate in
this repository can see that, because a gate compares two files from the
same commit; the comparison has to happen on the consumer's page. The
reasoning is in the header of `js/diagnostics.js`.

### Step 2 — `npm run gates`

```bash
npm run gates
```

Thirty-five steps chained with `&&` (counted from `scripts.gates` in
`package.json` on 2026-09-12): thirty-three `check:*` scripts, then
`npm test` (107 unit tests through `node --test gates/`), then
`prettier --check .`. It finishes in seconds and the commit hook
(`.claude/hooks/gates.sh`) runs exactly the same set — a unit test named
`KT7: every check script runs in the gates chain, in the hook, and CI
runs the chain` in `gates/gates.test.mjs` holds the two lists together.

Two things to know before you read its output.

**A `FAIL` line in the gates output is not necessarily a gate.** Measured
on 2026-09-12, `npm run gates` printed this and still exited 0:

```
npm notice run @kp-soft/themes@5.1.0 check:compliance
npm notice run node gates/compliance.mjs --check
FAIL shade-light: muted-foreground on muted = 3.61 (need >= 4.5)
FAIL shade-light: muted-foreground on background = 3.99 (need >= 4.5)
FAIL shade-light: muted-foreground on card = 4.13 (need >= 4.5)
3 pair(s) short of the floor. This is advice: it is measured and printed, never refused [Kenny, 2026-09-09].
```

`gates/compliance.mjs` shells out to `gates/check-contrast.mjs` to quote
its reading into `docs/DESIGN_INVARIANTS.md`. The contrast reading is
advice by Kenny's decision of 2026-09-09, so the call quotes both streams
and deliberately does not obey the exit code. If it ever does fail the
chain, that is the `fix-13` shape a third time — an advisory becoming a
gate through a back door — and it is a defect in the gate, not in the
theme.

**A green line with a zero in it is a gate that found nothing to check.**
Several gates carry an explicit guard for that, because
`check-pressed-state.mjs` and `check-variant-ground.mjs` once printed a
green line after their parser matched nothing:

```
gate broke: css/components.css defines no pressed states, which cannot be right.
gate broke: css/components.css defines no variant grounds, which cannot be right.
gate broke: css/components.css declares no roots, which cannot be right.
gate broke: checked no answers, which cannot be right while themes/hooks.json exists.
gate broke: no executable claim found in any document, which cannot be right.
```

If you see one of those, the gate's parser lost its grip on the file
(a prettier reformat, a comma-grouped selector, a nested `@media`) — the
thing under test is unmeasured, not clean.

### Step 3 — `npm run advice`

```bash
npm run advice
```

Five readings: contrast, motion, the DI5 report, texture, the invariant
sweep. **None of them blocks anything**, and the accessibility floors
stopped being gates on 2026-09-09 — `docs/DESIGN_INVARIANTS.md` states
what that costs in its "Kenny's override" section.

The script joins the five with `;`, not `&&`, so all five always run and
the process exit code is the last one's. Measured on 2026-09-12,
`npm run advice` exited **1** on a tree whose `npm run gates` exited 0,
because `gates/check-invariants.mjs` ends with
`17 invariant violation(s) across 22 themes.` **A non-zero exit from
`npm run advice` is not a failure.** Read the lines; the exit code means
nothing here.

### Step 4 — the one spec file

While building, run the single spec you are working on:

```bash
npx playwright test tests/register-grotesk.spec.mjs --project=firefox
```

Measured for the round-six correction record: 3.6 seconds against 3.5
minutes for the whole suite. Firefox alone, because Kenny's own browser
is a Firefox derivative and Firefox has been the odd engine here fourteen
times against Chromium's six — the reasoning is in the header of
`gates/run-affected.mjs`.

### Step 5 — `npm run test:affected`, once before a report or a commit

```bash
npm run test:affected
```

It asks `gates/affected.mjs` what a change needs and prints one of three
answers before it runs anything:

- `Nothing a browser can see has changed — no browser test to run.`
- `Affected: tests/register-grotesk.spec.mjs, …`
- `Everything: the change reaches shared code.`

You can ask the same question without running a browser at all:

```bash
node gates/affected.mjs          # prints: none | all | a list of spec files
node gates/affected.mjs main     # what has changed since a ref
```

**Know its blind spot, because it cost fifteen red tests.** Until
2026-09-12 a change to `css/<theme>-register.css` resolved to
`tests/register-<theme>.spec.mjs` and nothing else. Every quirk of round
seven is a register edit, so the inner loop ran 20 tests and printed
green while fifteen every-theme sweeps — press, alert contrast, focus
ring, reflow, bundle — never ran. Measured that day: one register spec is
20 tests, that spec plus the sweeps is 446, the whole suite is 1,297. It
now resolves a register edit to its own spec **plus** every spec that
sweeps all themes, found by reading the specs rather than from a list,
and a unit test asserts the finding is not empty. The record is `fix-15`
in `docs/CORRECTIONS.md`.

### Step 6 — the whole suite is Kenny's to give

`npm run test:browser` is `playwright test`: both engines, the whole
suite. Per the correction `fix-2`, Claude asks in a form before a release
and runs it with his go; outside that moment it is his to ask for.

It also **empties `test-results/`** when it starts. If there is failure
evidence in there you care about, copy it first — that is exactly how
`fix-2` was found, and only a copy taken beforehand kept the evidence
alive.

`npm run verify` runs gates, then the suite, then the advice, naming the
phase it is in and what each cost. `gates/verify.mjs` takes `--fast`
(Firefox only), `--no-advice` and `--only=gates`.

### What to keep from a red run

`playwright.config.mjs` sets `trace: 'retain-on-failure'`, so a failing
test leaves a trace under `test-results/`. Open it with
`npx playwright show-trace <path>`. `retries` is `0` and stays 0 — a test
that passes on a retry is a test that failed — so a red result is a real
observation, and a test that fails in a full run and passes alone is a
defect until its cause has a name (standing rule 8a; the worked case is
`fix-9`).

---

## 2 · Symptom → cause

### A · On a page

| What you see | What causes it | How to confirm |
| --- | --- | --- |
| Pressing a button changes nothing, but dragging the pointer off it shows the press | a register's `:hover` background outranks the components layer's `:active` — a later layer beats a state | `npm run gates`; `gates/check-pressed-state.mjs` names the file. Then `npx playwright test tests/registers.spec.mjs --project=firefox` |
| Pressing a button changes nothing, and the register _does_ carry an `:active` rule with the right token | a longer hover selector in the **same** layer outranks it (`:not(.kp-button--primary)` clauses add weight) | the same gate: it compares the two weights and prints `(hover 6, press 4)` — grotesk's own numbers, from `weight()` in that gate |
| A destructive alert's text is unreadable, sometimes white on white | a register repaints `.kp-alert` for every flavour from `kp.register`, replacing the plate while the variant's own ink stays | `gates/check-variant-ground.mjs`. Measured before the repair: seventeen of twenty-two themes under 4.5, grotesk exactly 1.00 |
| A button is transparent on hover only; it is correct at rest | `hsl(from var(--x) h s calc(l + 8%))` — a channel keyword is a **number**, so adding a percentage is a type error and the declaration is dropped. No engine warns | `node gates/check-relative-colour.mjs` |
| A keyboard user gets an outline and nothing behind it | the theme paints its own elevation on the control from `kp.register`, swallowing the ring `kp.components` draws on `:focus-visible` | read the focus ring with `wholeRing()` from `tests/ring.mjs`, which measures both halves |
| Half a focus ring, only while it is arriving | the theme transitions `box-shadow`, and a one-layer-to-two-layer transition interpolates by inserting a blank layer | both states must carry two layers; the case is the `focus-ring` gap under `fix-15` |
| An element that should be hidden is visible | a layout class beat the `hidden` attribute | the package carries `[hidden] { display: none !important }` in its base layer; `tests/hidden.spec.mjs` holds it (KT13) |
| One theme looks undressed — generic, none of its own geometry | that theme's showcase page does not load its own register | `grep -c register showcase/themes/<name>.html`; a unit test now refuses such a page (`fix-15`) |
| An effect never plays and never errors | the hook value is not in the vocabulary | listen for `kp-effect-unknown`, or read the `Unknown effect hooks` row on `showcase/diagnostics.html` |
| A revealed element is stuck and you cannot tell in what way | read `data-kp-reveal-state`: `armed` (waiting for a trigger), `rest` (settled without playing), `played` | the attribute is `REVEAL_STATE` in `js/effects.js`; before it existed there was only a moment you had to have been listening for |
| Everything is the default theme; the console says a name was dropped | the stylesheet and the JavaScript know different theme lists | `showcase/diagnostics.html`; the warning names both the requested and the applied name |
| The choice is not remembered, and a line of text appeared under the picker | storage refused — private mode, blocked storage, a full quota | that text is `This choice will not be remembered — storage is blocked in this browser.` from `js/strings.js`; it lands in `[data-kp-theme-status]` |
| A destructive button is disabled and nobody disabled it | it offers neither an undo nor a confirmation, so `enforceContracts()` disarmed it | look for `data-kp-contract-error="DI10"` on the element and `[kp-themes DI10]` in the console |
| The tokens changed and the paint did not | the body cross-fade never advanced, because the surface renders no frames | `docs/TROUBLESHOOTING.md`, "The tokens change but the page does not" — not a package defect |

### B · A gate says no

Every message below is quoted from the file named beside it, so you can
search for it. Fix the source, never the gate; if you are convinced the
gate is wrong, that is a mini-round (`docs/MINI_ROUNDS.md`), not a config
edit.

| It says | Printed by | What to do |
| --- | --- | --- |
| a hover background that _outranks the components layer's pressed state and nothing replaces it_ (quoted in full below) | `gates/check-pressed-state.mjs` | add `[data-theme='…'] .kp-button:active:not(:disabled)` to that register, restating the components layer's own pressed values |
| a hover rule that _outranks this register's own pressed rule, so the press never paints_ (quoted in full below) | `gates/check-pressed-state.mjs` | add `:not(:active)` to the hover selector; the gate names the file that already writes it |
| a ground that _repaints every variant of it_ (quoted in full below) | `gates/check-variant-ground.mjs` | scope the rule with `:not([class*='kp-alert--'])`, or restate every variant's ground |
| `css/<file>.css:NN: calc(l + 8%) — a channel keyword in a relative colour is a NUMBER, so adding a percentage drops the declaration and the element paints transparent. Write it without the percent sign.` | `gates/check-relative-colour.mjs` | drop the `%`. `calc(l + 8)`, `calc(l * 1.1)`, `oklch(from … calc(l + .05) c h)` and `color-mix()` all resolve |
| `<file>:NN: hsl(…) is a colour written outside the token layer (DI9). Use var(--token), or hsl(from var(--token) h s l / alpha) when it needs transparency.` | `gates/check-layers.mjs` | use the token |
| `<file>:NN: body styles a bare element (margin, line-height), so it overrides the package on the fixture pages the browser tests measure (KT3). Anchor it on a .sc- class, or add it to SCAFFOLDING_MAY_STYLE with its reason.` (the selector is backticked in the real output) | `gates/check-layers.mjs` | `showcase/showcase.css` is inlined into every fixture page; a bare-element rule there supplies the very thing under test |
| `.kp-<root> has no rule in css/<theme>-register.css and no exception with a reason (HELPERS or gates/register-pending.json).` | `gates/check-register-coverage.mjs` | style the root, or record the exception with its reason |
| `.kp-nav__menu has no rule in css/<theme>-register.css — … [KT14].` | `gates/check-register-coverage.mjs` | the dropdown is a required part: nineteen demos styled the bar and left the menu alone |
| `.kp-<root> is listed as an exception but css/<theme>-register.css covers it or css/components.css does not declare it — remove the entry.` | `gates/check-register-coverage.mjs` | an exception list outliving its problem |
| `N token name(s) are not declared by every theme (TH22):` then, indented per token, `  --<token>`, `      declared by: …`, `      missing from: …` | `gates/check-tokens.mjs` | add the token to every theme in the same change — S47, the contract is a floor, not a ceiling |
| `themes/known-asymmetry.json lists N token(s) that are now declared everywhere:` … `Remove them from that file — the ratchet only turns one way.` | `gates/check-tokens.mjs` | delete the stale entries |
| `<file>:NN: "…" is user-visible text outside the dictionary (KT5). Add a key to js/strings.js and read it from there.` | `gates/check-strings.mjs` | every user-visible string, screen-reader announcements included, comes from `js/strings.js` |
| `<file>:NN: "…" is a dictionary value written out again — read it from the strings instead.` | `gates/check-strings.mjs` | a consumer's override would not reach a repeated literal |
| `An ID means one thing [KT10]. These mean two:` | `gates/check-ids.mjs` | one symbol, one definition, across this project's documents |
| `<name> does not match its source.` followed by `Run npm run generate and commit the result.` (backticked around the command in the real output) | `gates/generate-themes.mjs --check` | edit `themes/<name>/tokens.json`, never the generated stylesheet |
| `The compliance table no longer matches what the gates measure. Run: node gates/compliance.mjs` | `gates/compliance.mjs --check` | regenerate |
| `<file>:NN tells a reader to run npm run <script>, which package.json does not have` (backticked around the command in the real output) | `gates/check-docs-runnable.mjs` | a document's commands, paths and import subpaths are executed, not reviewed |
| `<file>:NN names path, which this repository does not have` (backticked around the path in the real output) | `gates/check-docs-runnable.mjs` | only for the documents a person **follows**; a correction naming a theme that has since gone is history, and history is correct |
| `<file>:NN carries an email address: …` | `gates/check-docs-private.mjs` | nothing private in a document of a public repository |
| `N instance(s) of a link to a private artifact, and the recorded count is 39. … Lower the ceiling when some go; never raise it.` | `gates/check-docs-private.mjs` | a ratchet, not a ban: what is already published cannot be unpublished by deleting it here |
| `GATES FAILED — the working tree changed while the gates ran.` `Something rewrote files after they were staged. Re-add and retry.` | `.claude/hooks/gates.sh` | a generator rewrote a tracked file mid-run; `git add` and retry. Standing rule 7 — a gate that does not predict the build is not a gate |

The three cascade messages in full, because they are the ones you will
search for and they carry backticks of their own:

```
css/grotesk-register.css: a hover background on `.kp-button` outranks the components layer's pressed state and nothing replaces it — the button stops reacting to being pressed [fix-12]. Add `[data-theme='…'] .kp-button:active:not(:disabled)` to this register.
```

```
css/grotesk-register.css: the hover rule for .kp-button (hover 6, press 4) outranks this register's own pressed rule, so the press never paints. Add `:not(:active)` to the hover selector, the way css/high-contrast-register.css does [fix-12].
```

```
css/grotesk-register.css: a ground on `.kp-alert` repaints every variant of it, and the components layer pairs each variant's plate with its own ink — so that ink is left on a plate that is not there [gap-1]. Scope the rule (`.kp-alert:not([class*='kp-alert--'])`) or restate every variant's ground.
```

Anything of the shape `<anything> does not match its source` means a
generator ran and its neighbours did not. One command settles every
generated file:

```bash
npm run generate:all
```

### C · The advice prints something

None of these blocks anything. They are readings.

| It says | Printed by | What it means |
| --- | --- | --- |
| `FAIL <theme>: <fg> on <bg> = 3.61 (need >= 4.5)` | `gates/check-contrast.mjs` | text on a surface is under the AA floor |
| `FAIL <theme>: --<b> is only 4.9 from --<a> (need >= 10); the difference is not visible` | `gates/check-contrast.mjs` | pressing the control changes nothing anyone can see |
| `FAIL <theme>: --<token> is measured by nothing. Add it to a pair list, or to EXEMPT with the reason.` | `gates/check-contrast.mjs` | a new token belongs to no pair list, so nothing reads it |
| `N pair(s) short of the floor. This is advice: it is measured and printed, never refused [Kenny, 2026-09-09].` | `gates/check-contrast.mjs` | the closing line; read it as the reminder it is |
| `--border-strong on --card is 2.11, under the 3.0 floor of SC 1.4.11` | `gates/check-invariants.mjs` | DI1: raise the boundary, not the surface |
| `status <a> and <b> mean opposite things and are N apart for the commonest colour deficiency (floor 12)` | `gates/check-invariants.mjs` | DI3: two opposed statuses collapse for a colour-deficient reader |
| `<file>: kp-<name> makes 5.5 opposing luminance changes per second over 1100ms — SC 2.3.1 allows 3.` | `gates/check-motion.mjs` | over the flash threshold: retime the keyframes or lengthen the duration |
| `<file>:NN: <declaration> sits outside a prefers-reduced-motion guard (DI7).` | `gates/check-motion.mjs` | wrap it in `@media (prefers-reduced-motion: no-preference)` |
| `<file>: kp-<name> animates something this gate cannot measure and is not listed as out of scope. Add it to OUT_OF_SCOPE with the reason, or teach the gate to read it.` | `gates/check-motion.mjs` | a new keyframe on a property with no opacity stops |
| `css/<theme>-register.css:NN <selector>: texture paints at 0.14 (layer 0.14 × alpha 1), over DI9's ceiling of 0.06` | `gates/check-texture.mjs` | the effective opacity is the layer opacity times the strongest alpha |
| `N invariant violation(s) across 22 themes.` | `gates/check-invariants.mjs` | the closing line, and the reason `npm run advice` exits non-zero |

Under S49 a value an approved demo showed is not changed because a
reading disagrees with it. The reading becomes a **finding** put to
Kenny; until he answers, the deviation is not made. That is `KT15`, and
the four registers that recorded "renders differently on purpose" without
asking are what it exists about.

### D · A browser test is red

| What you see | What causes it | How to confirm |
| --- | --- | --- |
| A test fails in a full run and passes on its own | a value that **settles** read once, under load. `opacity` can finish while the `filter` behind it is still running | use `style`, `pseudoStyle` or `measured` from `tests/paint.mjs` — they poll instead of reading one moment |
| A test reads `animation-name` and gets `""` | a value that **passes**: the keyframe name is there while it runs and gone afterwards. Waiting is not patience, it is a race the fast machine loses | arm `recordAnimations(page)` **before** `goto`, then assert with `animationsSeen(page)` (`tests/paint.mjs`) |
| A hover or a click lands on nothing | the boot overlay is still there. Clicking Skip resolves when the click is dispatched, not when the overlay is gone, and it is `position: fixed; inset: 0` | put `await bootGone(page)` between the skip and the first assertion |
| A press test calls a theme red that plainly reacts | reading only `background-color` — retro presses by inverting its bevel and shifting its padding | `tests/registers.spec.mjs` reads background, box-shadow, translate, transform, both paddings, border, colour, the `::before` and the label's `--kp-baseline-weight` in one vector |
| Every fixture page 404s and the whole suite fails | another checkout of this repository is serving the fixture port, and `reuseExistingServer` handed this run the other one's files | `KP_TEST_PORT=4183 npx playwright test` (`playwright.config.mjs`) |
| A test names a theme that no longer exists | a hand-written theme name in a spec outlives the theme | derive from `themes/order.json` or from the theme's own copy, never a literal (`fix-15`) |
| `route.request is not a function`, before the page loads | `page.route()` called with one argument; the signature is `route(pattern, handler)`, so the handler was taken as the pattern | this hid `tests/bare.spec.mjs` — the whole framework-free channel's proof — for long enough that it had not actually run |
| A test passes, and you cannot say what would make it fail | it may be comparing the module against itself. `tests/effects.spec.mjs` proved "final text equals source" against `data-kp-text`, an attribute `js/effects.js` writes itself from the element's own text | drill it: break the thing on purpose and require red (KT3) |
| The desktop stutters for minutes while a run goes | Playwright's default is a worker per core | `workers` is `'25%'` in `playwright.config.mjs`; `KP_TEST_WORKERS` overrides |

### E · The tooling itself

| What you see | What causes it | How to confirm |
| --- | --- | --- |
| `node --test gates/` dies on the whole of `gates/gates.test.mjs` with a message about something that file does not test | a gate module ran its measurement at import time and called `process.exit` | every gate another module imports must compare `import.meta.url` against the entry point before running. A unit test asserts the property, not the file (`fix-13`) |
| A gate prints a green line with a `0` in it | its parser matched nothing | see the `gate broke:` guards in step 2 |
| A one-off sweep edits files you have never heard of | a directory walk with a deny-list. `.claude/worktrees/` is inside the repository and holds other sessions' checkouts | take the file list from `git ls-files`, never from a walk — it reports only what **this** worktree tracks (`fix-14`) |
| The commit hook blocks something that is not a commit | PROC-H1, a known defect in the shared procedure's hook: it decides a command is a commit by looking for the words in the command text | it fails closed, so it is noise rather than a hole. It belongs to the procedure repository |

---

## 3 · The six fault families

More than half the corrections in `docs/CORRECTIONS.md` are one of six
shapes. When something is wrong and nothing in the tables above fits, ask
which of these it is.

### Family 1 · A later layer beats a state

`css/_header.css` line 22 declares the order:
`@layer kp.base, kp.components, kp.register, kp.layout, kp.utilities;`. A
layer beats specificity outright. So a register writing
`[data-theme='x'] .kp-button:hover { background: … }` in `kp.register`
outranks `.kp-button:active { background: var(--secondary-active) }` in
`kp.components`, whatever their specificity says — and the pressed state
exists and is unreachable, exactly while the pointer is on the button,
which is the only time anyone presses one.

**Recognising it:** the state works when you take the pointer away. Kenny
diagnosed it before anyone knew the cause, on 2026-09-11: _"ik kan enkel
de ingedruktheid zien als ik de knop indruk, blijf indrukken en dan zo
mijn muis van de knop weghaal."_

**How often:** five times. `fix-12` (pressed state, thirteen registers of
the twenty-five the package had then), `gap-1` (the destructive alert's ink, eighteen registers),
`grotesk-press` (same layer, longer selector — see family 2), and twice
in the focus ring (an elevation swallowing the ring, and a rounded
popover leaving it nowhere to land).

**What holds it now:** `gates/check-pressed-state.mjs` and
`gates/check-variant-ground.mjs`, both source gates, plus one browser
test per theme in `tests/registers.spec.mjs` reading the paint — because
a source gate cannot see what a browser draws (KT13).

**Still open:** the same collision for the other states a register
overrides. `:focus-visible` is known to have it — DI2 exists because of
it — and `:disabled` has not been looked at.

### Family 2 · A longer selector beats a state in the same layer

`fix-12` one storey down. grotesk carried a correct `:active` rule with a
correct token for a whole round and it never painted: the hover rule
above it carries three `:not(.class)` clauses, so `weight()` in
`gates/check-pressed-state.mjs` scores it 6 against the press's 4, and a pointer is always hovering while it
presses. Measured: hovered `rgb(245, 245, 245)`, held down
`rgb(245, 245, 245)` — the same.

The idiom is `:not(:active)` on the hover selector.
`css/high-contrast-register.css` already wrote it that way, which is how
the gate knows what right looks like.

### Family 3 · The absence of a value read as the value

The project counted this to five when it hit it in `js/effects.js`'s
counters. The instances, each traceable to the comment that records it:

| Where | The absence | Read as |
| --- | --- | --- |
| `gates/check-variant-ground.mjs` | `background: transparent` / `none` — a register saying "I paint my plate elsewhere" | a swallowed ground |
| `gates/check-motion.mjs` | `transition: none` | a transition |
| `tests/registers.spec.mjs` | a press that lands on a pseudo-element or the label rather than on the control | no reaction (five themes called red in Phase 7) |
| `js/effects.js` counters | `Number(knob) || 900` — a deliberate `0` | unset |
| `gates/check-fonts.mjs` | `fonts/` gone, so `css/fonts.css` falls to zero with it | "nothing promised", a written pass |

**The test:** for any check you write, ask what it does when the thing it
measures is *absent* rather than *wrong*. If the two answers are the
same, the check is blind in one of them. `gates/check-fonts.mjs` now
takes the themes' own font families as an independent witness, precisely
because the declaration and its source fall to zero together.

### Family 4 · A settling value and a passing value, read the same way

A colour, a box or a box-shadow **arrives and stays** — so you wait for
it. A finite animation **does not stay**: `animation-name` is the
keyframe while it runs and nothing afterwards, so waiting is not patience
but a race the fast machine loses.

| The value | The reader | Where |
| --- | --- | --- |
| settles | `style`, `pseudoStyle`, `measured`, `bootGone` | `tests/paint.mjs` |
| settles (the two-part focus ring) | `wholeRing()` | `tests/ring.mjs` |
| passes | `recordAnimations()` before `goto`, then `animationsSeen()` | `tests/paint.mjs` |

Three corrections in this family: `KT16`, `fix-1` one day later, `fix-9`
the day after that. Each time a broad sweep — refusing every bare
`getComputedStyle` in a spec, about 465 sites — was offered and declined
for the same reason: it would push the animation half into a poll that
waits the full timeout for a value that left before it started looking.
Kenny chose discipline on 2026-09-11 (_"Alleen discipline"_), and the
honest price is written in `fix-9` field 5: a flake of this shape can
happen again. The sweep that measured it found 152 bare reads, 86 of them
on a property something in this package animates — and grep cannot tell
which of the 86 are racy, because a border-radius read on a settled page
and a filter read mid-reveal are the same line of text.

### Family 5 · Two halves out of step

The stylesheet and the JavaScript arrive separately on a consumer's page,
and no gate in this repository can compare them — a gate reads two files
from the same commit and passes by construction. The comparison is built
to run on the consumer's page instead: `js/diagnostics.js`, step 1 above.

The console warning is one sentence, from `js/strings.js`:

```
kp-themes: "woodblock" is not a theme this build knows, so "formal" was applied instead. The stored choice was left alone; open the diagnostics page to see which half is behind.
```

`js/theme-core.js` reports a dropped name from four places, and the
`source` in the `kp-theme-unknown` detail tells you which: `stored` (a
preference written by a build that knew more themes), `current` (the
markup), `apply` (a caller), `cross-tab` (another tab, possibly a newer
deployment of the same app). It is said once per name per session,
remembered in `sessionStorage` under `kp-themes-unknown-reported` — not a
module flag, because in a server-rendered dashboard every click is a page
load and a module flag is a fresh flag.

The stored value is never overwritten by the fallback. It will be right
again the day that page gets a newer `js/`.

### Family 6 · A check that cannot fail

Four instances, and they share a shape: the assertion and the thing
asserted came from the same place.

- A browser test asserting something the package applies, where
  `showcase/showcase.css` — inlined into every fixture page — supplied it
  instead of the package (KT3). `gates/check-layers.mjs` now refuses a
  bare-element selector in that file.
- `tests/effects.spec.mjs` comparing a headline's text against
  `data-kp-text`, an attribute `js/effects.js` writes itself from that
  element's own text. Measured with the headline permanently scrambled:
  the old comparison answers `true`, the new one — against the authored
  copy in `showcase/concept-copy.mjs` — answers `false`.
- `tests/button-surfaces.spec.mjs` carrying a **drill record for an
  assertion that did not exist**. No test anywhere named
  `.kp-button__readout`. A false drill record is the one thing KT3 exists
  to prevent.
- A counters test reading the final number as proof the count ran, when
  the final number is what the HTML says — it reads correct when nothing
  counted and when the count has already finished.

**The measure is the drill (KT3):** remove the rule in the package that
carries the behaviour, confirm the test goes red, restore it, and record
in one line of comment what was removed. A gate is green and you do not
trust it? Break it on purpose. That is how this project found a check
that had never run once.

---

## 4 · Two things that will bite once each

**A single generator run leaves its neighbours stale.** The gates then
fail one at a time, each naming a different file, and it reads like four
faults. It is one. `npm run generate:all` runs every generator in order
and then prettier.

**The git hooks are local config a clone cannot carry.** Activate them
once per clone:

```bash
git config core.hooksPath .githooks
```

Without that, `.githooks/pre-commit` never runs and `npm run gates` is
something you have to remember.
