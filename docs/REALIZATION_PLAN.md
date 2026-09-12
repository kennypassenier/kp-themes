# Realization plan — kp-themes

Approved 2026-09-04 at the Phase 5 gate. Eleven milestones, each with an
exit criterion that is checked rather than asserted.

The order is not arbitrary. TH21 makes a theme's written description the
source for every colour choice, so the seven anatomy documents (L2) come
before any colour work (L3). And the procedure requires an **assembly
milestone** whose exit criterion is that the whole does its own job rather
than that its parts exist — that is L9, and it exists because on another
project six milestones passed with every component proven while the
program still reported that nothing was built.

## Milestones

| ID  | Milestone                          | Features                                     | Exit criterion                                                                                                                                                                          |
| --- | ---------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L0  | Walking skeleton, enforcement live | S18, T1-T3, AR1-AR3                          | The generator reproduces the current `css/themes.css` **byte for byte**; CI green; a commit without IDs is physically refused; a broken token turns the gate red                          |
| L1  | The gates get teeth                | TH22, AR1, AR8, and the AR8-D1 defect        | Every gate has been **red once** on a deliberately injected violation, and that drill is recorded                                                                                        |
| L2  | Seven anatomy documents            | TH21, TH12 (partly)                          | Seven documents answering the same numbered question list, approved by Kenny — the only exit criterion here that is his judgement rather than a test, because TH21 makes them the source |
| L3  | Colours repaired and completed     | DI1, DI3, DI4, DI6, TH9, TH10, TH11, TH20    | The compliance table in `DESIGN_INVARIANTS.md` reads pass everywhere; today seven columns are red. That table comes from the gates, not from editing                                     |
| L4  | The picker, both channels          | TH8, TH23, TH26, TH27, AR5, AR6, AR11        | The five behaviour tests run against **both** mounts in the same browser and pass                                                                                                       |
| L5  | Showcase and bare fixtures         | TH13, AR14, DI11                             | Everything built so far appears seven times; the text-spacing and reflow checks run against the bare per-theme fixtures                                                                 |
| L6  | Elements that are not components   | TH31, TH32, TH33, TH34, TH36                 | All five on the showcase in seven themes; the link colour clears the floor in every theme, where the browser default fails three today                                                  |
| L7  | The seven base components          | TH1-TH7, DI10 (contract)                     | A behaviour suite per component against both mounts, plus every variant and state visible on the showcase                                                                               |
| L8  | The eleven overlays                | TH35                                         | Same bar as L7, plus demonstrable keyboard operation: open, Escape closes, focus returns where it came from                                                                              |
| L9  | **Assembly and release**           | TH18, TH29, AR10, MR5-PAGES                  | A fresh clone in an empty directory builds, generates byte-identical output, passes every gate, and produces a showcase that opens. Not "the parts exist" — the whole does its job       |
| L10 | The two desired items              | TH15, TH19                                   | Both run in the gates and have been red once                                                                                                                                            |

**Amended 2026-09-04 at L0's gate, both ratified by Kenny.** T1 and T2
move from L0 to L4: they decide the shape of the framework-free components
and whether the hard ones are hand-written, and L0 has no component to
decide about. And S18's directories are created when they have content
rather than up front — the anatomy documents at L2, the per-theme
stylesheet fragments at L3, `components/` and `showcase/` from L4 — so S18
completes at L5. An empty directory promising future content is the same
false structure this project has met three times.

L9's exit criterion is also the restore drill Kenny consciously declined
at M3. It arrives free here, because proving a fresh clone builds _is_
that drill.

## Round three — the theme milestones (approved 2026-09-05)

Round three adds thirteen themes (S21, TH64–TH75) and the three pieces of
enabling work they need (TH85–TH87). Nothing existing changes in place
(S20), so every milestone ends in a new minor version, and the order is
set by two things: the enabling work goes before the theme that needs it,
and the first theme walks the whole path alone so the path is proven
before eleven more follow it.

**Decided at the gate, 2026-09-05.** Kenny kept the six milestones as
the order of work and struck the six release points: everything ships in
**one release, 3.1.0, after R5** ("Alles komt in 3.1.0"); until then
3.0.0 stays the latest. The version column below is therefore the
milestone's place in that one release, not a tag. The showcase loads
each theme's faces from Google Fonts — the package itself still loads
nothing (S19). The round runs in **AFK mode from R0**: the milestone
gates accumulate into one combined report; the release go stays a
separate form. Enforcement stays as installed in round one. Kenny added
one feature in the remarks — TH88, the showcase's split comparison view —
which goes into R0 with the other showcase work.

Standing rule 7h, before the AFK stretch: the discipline-only measures
this work touches are KT1 (every checkable claim in a form is checked in
the same turn, with file:line) and KT3 (a browser test that asserts the
package applies something is drilled red first, and the drill is
recorded in a comment). Neither is suspended. KT1 applies to the combined
report, which is written at the end with the checks in that turn. KT3 is
applied per new browser test, and the report lists every drill by test
name, so a missing one is visible rather than assumed — the failure mode
KT3-M1 measured was that nobody looked; the list is what makes looking
cheap.

Measured on 2026-09-05, what a new theme touches today: `themes/<name>/`
(tokens.json, anatomy.md), `themes/order.json`, the texture and signature
in `css/_rules.css`; everything else follows from `order.json` — the
registry and the stylesheet (`gates/generate-themes.mjs`), the fixture and
showcase pages (`gates/generate-showcase.mjs`), the Home Assistant YAML
(`gates/generate-ha-themes.mjs`), and the browser suites that iterate
`THEMES` (`tests/fixtures.spec.mjs`, `tests/showcase.spec.mjs`,
`tests/picker.spec.mjs`). One test still hardcodes eleven
(`tests/sweep.spec.mjs:86`) and is corrected at R0. Nothing in the package
or the showcase loads a webfont: the faces are names, and the showcase on
GitHub Pages renders every theme in the fallback stack.

| ID | Milestone | Features | Exit criterion | Ships in |
| --- | --- | --- | --- | --- |
| R0 | The knob, and one theme walks the whole path | TH85, TH64 (brutalism), the eleven-count fix, showcase webfonts, TH88 (split comparison view) | `--fx-shadow-offset` is 0px in eleven themes and paints in the twelfth, proven by a pixel comparison of the fixtures before and after; brutalism passes every gate, has an anatomy, appears on the showcase and in the picker's light group, has a Home Assistant YAML, and the suites are green for twelve themes in both browsers; the showcase loads each theme's faces so Kenny judges the real letter; the showcase renders left and right with a picker per side and the two sides scroll together | 3.1.0, after R5 |
| R1 | The dark essentials | TH65 (deco), TH66 (academia), TH70 (phantom) | Same bar per theme; DI6's layer order is deliberate in all three, and phantom's red is a plate with white ink, never text (4.12 measured) | 3.1.0, after R5 |
| R2 | Ticker, woodblock and the shade pair | TH68, TH69, TH67 | Same bar; ticker has no motion token above 0 and no flourish that changes luminance; woodblock's `--border-strong` is the 2px key-block line; shade ships as two names on one scheme, the light foreground at base01 | 3.1.0, after R5 |
| R3 | Enabling work for the desired pair, then the pair | TH86, TH87, TH72 (mono), TH71 (retro) | The seven status plates of mono are pairwise distinguishable with hue removed (the gate's deuteranopia simulation, plus a greyscale pass); the retro register loaded on the fixture leaves DI1 green on every control; both registers have been red once | 3.1.0, after R5 |
| R4 | The three remaining desired themes | TH73 (grotesk), TH74 (lapis), TH75 (nostromo) | Same bar; lapis's vermilion and nostromo's orange are plates, never text | 3.1.0, after R5 |
| R5 | **Assembly** | S21, TH63 at 24, README/USER_GUIDE/MIGRATION | A fresh clone builds and generates byte-identical output; the picker shows 24 themes in two groups and is operable by keyboard end to end; the showcase and Pages show all 24; every anatomy is linked from README; the tally in FEATURES reads what shipped; `SHA256SUMS` on the release | 3.1.0, after R5 |

After R5 the set stands at 24: thirteen light (formal, light, pastel,
forest, high-contrast, sepia, brutalism, shade-light, woodblock, mono, retro,
grotesk, nostromo) and eleven dark (dark, cyberpunk, terminal, blueprint,
solstice, deco, academia, shade-dark, ticker, phantom, lapis).

Enforcement is already live from round one (hooks, CI, branch
protection) and is not reinstalled; the gates that govern a theme
(`check-tokens`, `check-invariants`, `check-contrast`, `check-motion`,
`check-layers`, `check-compliance`, `check-ha`) run on every commit and
have each been red once (L1). What is new this round gets the same drill
at the milestone that adds it: TH85 at R0, TH86 and TH87 at R3.

D3 (removing `STRINGS_NL`) stays outside the round by Kenny's
instruction. One note for when it returns: removing an export is a
breaking change under semver, so its version is 4.0.0, not 3.1.0 — the
label the earlier form carried. The queue entry says so.

### Round three — status

| Milestone | Status |
| --- | --- |
| R0 | **built** 2026-09-05; awaiting the combined AFK report. Measured: the eleven fixtures pixel-identical before and after the knob (`tests/tmp-knob-baseline.spec.mjs`, run once on `7535557` and once with the knob, 11 of 11 unchanged; the spec was removed after the measurement). KT3 drills, both performed 2026-09-05: `grid-row` placement removed from the generator → the alignment test reads the twins 8198 px apart; `fontLinks()` returning '' → the fonts test finds no `link[data-sc-fonts]` (href null). Both restored and green. Live-found: KT7 (proposed). |
| R1 | **built** 2026-09-05; awaiting the combined AFK report. Deco, academia and phantom pass every gate (15 themes, 105 invariant checks, 39 pairs each); the gate steered three drafts — deco's offer/rejected at 11.0 and academia's at 9.1 under deuteranopia (floor 12), phantom's white primary with no visible active state — each recorded in the anatomy. |
| R2 | **built** 2026-09-05; awaiting the combined AFK report. Ticker, woodblock and the shade pair pass every gate (19 themes). Steered by the gates: woodblock's offer/rejected pair measured 6.3, 7.5 and 6.4 under deuteranopia until rejected became the one plate with ink on it (19.6); shade's canonical text colours failed AA on both grounds (4.13 light, 4.28 dark on the card) and were deepened or lifted; shade-light's card had to rise above the paper (DI6). Live-found by the DI11 reflow test in Firefox: an input's intrinsic width in a wide face pushed woodblock's fixture to 362 px at a 320 px viewport — fields and inputs now shrink inside their track (`css/components.css`, `.kp-field`, `.kp-field__input`, `.kp-datatable__search`). |
| R3 | **built** 2026-09-05; awaiting the combined AFK report. TH86: five `--chart-pattern-*` tokens (`none` in twenty themes, five SVG fills in mono) and a unit test holding mono's seven status plates at ≥ 1.25:1 pairwise — drilled: two plates set equal reads "draft and sent are 1.00 apart". TH87: `css/retro-register.css`, exported as `./css/retro-register`, in the layers gate, loaded by the showcase and fixtures together with the cyberpunk register; `tests/registers.spec.mjs` holds the painted boundary at 3:1 with the register on — the first drill (border-color transparent) stayed green because the test read rgba(0,0,0,0) as black, the test was repaired, the second drill went red. Mono and retro pass every gate (21 themes, 147 checks); mono's primary moved from 9% to 14% so the visited link clears the floor (11.3 → 12.7). |
| R4 | **built** 2026-09-05; awaiting the combined AFK report. Grotesk, lapis and nostromo pass every gate (24 themes, 168 invariant checks, 39 pairs each). All three offer/rejected pairs were searched with the gate's own metric before the tokens were patched (8.6 → 21.0, 8.6 → 14.2, 5.5 → 14.9); nostromo's primary moved from 15% to 17% for the visited link (11.7 → 12.5). Nostromo's body face is Titillium Web, not Chakra Petch, so it shares no letter with cyberpunk. |
| R5 | **built** 2026-09-05; awaiting the combined AFK report. A fresh clone of `7ca453d` in an empty directory: `npm ci`, every generator re-run, `git status --porcelain` empty (byte-identical), `npm run gates` green, 24 fixtures. The React picker drives through all twenty-four options by keyboard at a 420px viewport (`tests/picker.spec.mjs`, both browsers; drilled red with `overflow: clip`, 489 > 421). README, USER_GUIDE, MIGRATION, CHANGELOG and the FEATURES tally describe 3.1.0; `package.json` says 3.1.0, untagged until the release go. GitHub Pages still shows 3.0.0 until the branch is merged. **CI found two more faults the local suites had not:** on CI's taller fonts the twenty-four-option list exceeded the popover's new maximum height and the wrapping flex column started a second column (dark beside light, light outside the box — a click on pastel hit terminal), fixed with `flex-wrap: nowrap` + `flex-shrink: 0` on `.kp-menu`; and menu options were content-box, so `100%` plus padding overflowed the popover by 20px on CI's scrollbar-bearing Chromium, fixed with `box-sizing: border-box`. Both are held by the keyboard test's containment assertion (`bc1e369`, CI green on both browsers). |

## Round four — the layout layer and the site (approved 2026-09-06)

Nine milestones. What gets built was frozen in Phase 2 (TH90–TH109); this
is the order and the exit criterion per milestone. R6 is the **assembly
milestone** the procedure requires: its exit criterion is that the whole
does its own job, not that the parts exist. TH104 and TH107 are not here —
they moved to 4.0.0 at the Phase 4 gate.

Kenny approved all nine unchanged on 2026-09-06, kept the enforcement
answer (all seven new gates block), agreed to make KT3's drill mechanical,
and put the round in **AFK mode from R0**.

| ID | Milestone | Features | Exit criterion |
| --- | --- | --- | --- |
| R0 | The scale and the cascade | TH94, AR17, AR18 | All 24 themes declare the same scale names and the parity gate holds them; `xs`, `sm` and `md` demonstrably keep today's values so nothing shifts; and a browser test proves a utility wins inside a component — the test that would fail today |
| R1 | The layout layer | TH90, TH91, TH92 | Each of the sixteen classes has its own browser test pinning its measurable property, each driven red first by removing the rule; all sixteen appear on their documentation page |
| R2 | The utility API | TH93, AR23 | The generated stylesheet and the documented list agree in both directions; the collision gate compares every name against the 170 existing ones and says the number out loud; one browser test per family measures the class inside a component |
| R3 | The tables | TH95, TH96 | The scroll region is reachable and operable by keyboard in both channels, its test having failed on today's code first (standing rule 8); the five table behaviours measured at the widths in their bars |
| R4 | The fallback and the manifest | TH97, TH103, AR25 | An unknown theme name warns exactly once per session along each of the four paths and the stored name survives; the diagnostics page judges a deliberately mismatched pair in a test; the manifest holds every file a consumer can copy, with its gate |
| R5 | The example pages and their gates | TH98, TH99, TH109 | The ten pages render in both channels; the gate has been red once on each of its three faults separately; the rebuilt kit pages carry zero `style` attributes, with an exception list that gives a reason per line |
| R6 | **Assembly: the documentation site** | TH100, TH101, TH102, T10, T12, AR21 | Someone who has never seen this package can open the site and learn to use a component without reading the source. Concretely: all ~45 pages carry their nine sections from real sources; the four documentation gates are green and each has been red once; the site publishes and the workflow uploads only what the generator wrote; all 24 themes carry their story from their anatomy document |
| R7 | The bundle, the note and the release | TH106, TH108, M1 | A page loading only the bundle behaves identically to one loading the loose files; every class the migration note names exists, with its gate; the release carries the bundle and checksums covering every copyable file |
| R8 | The density mode | TH105 | The same table and form are measurably shorter in compact mode in all 24 themes, and touch targets stay above 24px |

### Round four — status

| ID | Status |
| --- | --- |
| R0 | **built** 2026-09-06 (AFK); signed off by Kenny 2026-09-07. The five layer names declared once in `css/_header.css`; `components.css`, `cyberpunk-register.css` and `retro-register.css` wrapped; six `--kp-space-*` tokens in all 24 themes pinned to today's seventeen fallbacks so nothing shifts. `check-motion` needed repair: its keyframe scanner required a closing brace at column zero and the layer wrap indented every one, and a lazy regex truncated the bodies. **R0-TYPO quarantined** — the typography half cannot meet "nothing shifts". |
| R1 | **built** 2026-09-06 (AFK); signed off by Kenny 2026-09-07. `css/layout.css`, sixteen classes in `@layer kp.layout`, every value on a `--kp-*` knob defaulting to the scale. Fifteen browser tests, all fifteen drilled red. The first drill found **six tests measuring scaffolding rather than the package** — the body margin made `.kp-page` look capped, `<code>` is monospace by user-agent default, the document did not scroll without `overflow-wrap`, and removing the `@layer` statement proves nothing because layer order is also set by first appearance. All six rewritten; the cascade drill is now unlayering `components.css`. That drill also found `.kp-mono` reading `--theme-font-mono`, a token no theme declares. |
| R2 | **built** 2026-09-06 (AFK); signed off by Kenny 2026-09-07. 115 generated classes in six families, `docs/UTILITIES.md` written by hand, four failure paths drilled red. The collision gate's first version reported **"0 class names declared by hand"** — the selector parser threw away every prelude, so it compared against nothing; repaired it reports 189 and immediately refused `.kp-truncate`, which `components.css` already declares more richly. Eight browser tests, each measured on a component rather than a bare div, ten rules drilled red. No font-size family: R0-TYPO blocks it, and the document says so in place of the family. |
| R3 | **built** 2026-09-06 (AFK), in a parallel worktree; signed off by Kenny 2026-09-07. The scroll region test was written against the old code and went red in both channels and both browsers first (standing rule 8); `js/tables.js` and both React tables then set `tabindex`, `role` and a name resolved from an explicit label, the caption, or the dictionary. Cell strategies, column priority, container queries in place of media queries, and the card layout extended to the plain table. Eleven drills; one stayed green and changed the code rather than the comment (`word-break` carries the break cell on its own). AR24 measured across five contexts: the shipped shapes do not move, a flex or inline-block carrier collapses to 0 -- queued as R3-CQ. |
| R4 | **built** 2026-09-06 (AFK), in a parallel worktree; signed off by Kenny 2026-09-07. All four paths that can drop a theme name now warn once per session and dispatch an event saying what was asked for, what was applied and where. Once per session is `sessionStorage`, not a module flag, because in a server-rendered dashboard every click is a page load and a module flag is a fresh flag. The stylesheet declares its own version and the names it knows, so the diagnostics page can judge a vendored copy. TH103's manifest gate earned its place at the merge: it refused three files R1, R2 and R3 had added outside the manifest. |
| R8 | **built** 2026-09-06 (AFK); signed off by Kenny 2026-09-07. `data-density="compact"`, unlayered and last for the same reason the print block is. Building it found TH94's remaining gap: the form gap, the field gap and the table cell padding were literals, so the density mode reached none of them; all three now read the scale at the values they already had. Six tests over 24 themes, and the drills rewrote two of them -- a whole-block height comparison stayed green because the control floor alone shortened it, and lowering the floor to 1rem does not put the rendered button under 24px, because padding and line height carry that, not the floor. |
| R0-PRINT | **repaired** 2026-09-06 at the merge, found independently by R3 and R4. The R0 layer wrap put the print override inside `@layer kp.base` while the theme token blocks stayed unlayered, so printing a dark theme came out dark in all 24 themes. `css/_print.css` is unlayered and concatenated last. |
| R5 | **built** 2026-09-06 (AFK), in a parallel worktree; signed off by Kenny 2026-09-07. Ten pages from one descriptor tree walked by two renderers, so nothing is written twice; the list-with-form page carries both chassis-rs shapes and both are measured. The overflow and rhythm gate runs both channels and both browsers at three widths and reports its three faults separately, each injected and seen red on its own. The inline-style gate refuses an attribute, a page-local block, and a stale exception. Two drills stayed green and are recorded as findings: every `pre` already has its own scroll region, and a skip link parked past the viewport adds no rightward scroll. Quarantined: R5-BADGE, a coloured status badge cannot be written framework-free without an inline style. |
| R7 | **built and released** — signed off 2026-09-07 and shipped the same day: `v3.2.0` on `77f8226`, tagged only after CI and the Pages workflow were green on that commit, with the release built by `.github/workflows/release.yml` rather than by hand. The draft carries six assets and a 34-line `SHA256SUMS`, every line verified against the tagged tree. `dist/kp-themes.css` is the six stylesheets in load order and `dist/kp-themes.js` is esbuild's bundle of `js/auto.js`; two fixtures with byte-identical markup prove the bundle behaves like the loose files, over all 24 themes. Two of the three tests were rewritten by their drills: a snapshot of colour alone stayed green with a register dropped, because a register works through shadows; and the 24-theme comparison was flaky, then slow, then hung, because every theme has a signature that runs once and a texture that drifts for 40 seconds -- the animations are settled rather than awaited. The migration note gained its 3.2.0 section with a gate over every class it names, and `dist/` joined the manifest rule, which it had fallen outside silently. |
| R6 | **built** 2026-09-07 (AFK), the assembly milestone; signed off by Kenny 2026-09-07. 42 component pages covering all 61 class families and all 36 React exports, plus the start page with all 24 theme stories, the layout page read out of `css/layout.css` and the utility page read out of the generator. The pages found three faults in the machinery under them: the props table printed the first matching export only; the knob and attribute filters compared a class name against a family and a module name, so **every page showed no knobs and no attributes at all**; and the generated tables were bare, so 37 of 42 pages scrolled sideways at 360px. The Pages workflow takes its copy list from the generator rather than keeping a second one. Quarantined: MR-R6-1 (underscore emphasis, provisionally enabled) and MR-R6-2 (`.kp-shortcuts` is content-box and overflows a 360px viewport by 13px; the repair narrows a shipped component). |

**Enforcement for this round.** Unchanged in shape: the commit hook runs
the whole chain and blocks, CI runs the same chain, `main` is protected.
The seven new gates join all three lists, and KT7's unit test holds them
there. KT3's drill becomes mechanical: a browser test asserting the
package applies something carries the removed rule in its comment, and a
gate counts those comments against the number of such tests. KT1 stays
discipline — no gate can see whether someone looked.


## Enforcement — installed 2026-09-04, before any feature code

Phase 5 refuses to advance to L0 until this is in place. It is, and each
part was proved by making it fail.

| Layer                            | What it does                                                                       | Proved                                                                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.githooks/pre-commit`           | runs `.claude/hooks/gates.sh`; blocks on failure                                    | **red then green**: a token pushed under WCAG AA made the commit refuse with the failing pairs named; restoring it let the commit through                     |
| `.githooks/commit-msg`           | refuses a message without feature IDs                                               | **red**: a message reading only "installing the enforcement" was refused, naming standing rule 4                                                              |
| `.claude/hooks/check-commit.sh`  | the same two checks as a Claude Code hook — a second layer, not the only one        | inherited from the procedure repo unchanged; see the known defect below                                                                                       |
| `.github/workflows/ci.yml`       | gates on **every branch** and on pull requests                                       | standing rule 6a: protection that waits for a check the workflow never produces locks the branch shut                                                          |
| Branch protection on `main`      | requires the CI check                                                                | **not yet** — Kenny's decision H2: Claude sets it after L0, once a CI run exists to require. Setting it now would lock `main` before there is anything to wait for |

The git-native layer is wired with `core.hooksPath = .githooks`, which is
local config a clone cannot carry. **Activating it on a fresh clone is one
command**, and that belongs where a human reads it — see the README, not
only here.

### Known defect in the Claude Code layer, found on first use

`check-commit.sh` decides whether a command is a commit by testing whether
the command string _contains_ the words. Writing this very document was
blocked, because the document quotes an example commit message. The
git-native layer is unaffected: it inspects the real message, not a
command line.

It fails closed, so nothing unsafe gets through — it is noise, not a hole.
It lives in the shared procedure repository and therefore affects every
project that installed it; recorded in `docs/MINI_ROUNDS.md` and raised
for that repository rather than patched locally.

### What blocks a commit, and what blocks a merge

Kenny's decision H1. The fast gates — formatting, contrast, and the checks
L1 and L3 add — run in Node, take under a second, and block the commit.
The browser tests block the merge instead, in CI. A gate slow enough to be
worked around is not a gate.

### Drills — a test counts once it has been shown to fail

Rule 7d applies to the browser suite as much as to the Node gates. Two of
the five picker behaviours are load-bearing enough to be worth proving,
and both were made to fail on purpose before being restored.

| Test | Injected fault | Result |
| --- | --- | --- |
| derives which themes are dark from the data | the dark set replaced by kyu's hand-written list of four | **red** in both channels, naming pastel; green again after restoring |
| two pickers on one page stay in step | the shared bus stopped announcing changes | **red**; green again after restoring |
| the focus ring pair (DI2) | a pastel with two near-identical grey rings | **red**, eight named violations; green again after restoring |
| links clear AA on the page (TH31) | the link colour set back to the browser's own blue | **red** in exactly dark, cyberpunk and terminal — the three FEATURES.md names; green again after restoring |
| the colour scheme reaches the browser (DI6) | found red, not made red: nothing applied `--color-scheme` at all | the fix made it green; the token gate had read pass throughout |
| the destructive contract (DI10) | a destructive button shipped with neither undo nor confirmation | **red** in both channels — reported, and the button disarmed rather than left able to delete |
| the badge contract (DI4) | a status badge with a colour and no words | **red** in both channels |
| the contrast gate's completeness (TH15, AR8) | found red, not made red: `--chart-4` in pastel measured 2.20 against the page where 3.0 is the floor | fixed to 3.21; the gate now refuses any colour token that is in neither a pair list nor the exemption list |
| the type check (TH19) | a string method called on a colour tuple | **red**, naming the file and line; green again after restoring |
| the layer check (DI9) | cyberpunk's --primary written out as a literal in a component rule | **red**, naming the file and line; green again after restoring |

A third came for free: the first version of the suite parsed the theme
registry out of its own source text and produced an empty array, so the
loop over seven themes iterated over nothing and passed. The suite now
imports the generated module. A test that cannot fail is worse than no
test, because it is counted.

## Standing rules

Confirmed unchanged for this project at the Phase 5 gate. Four shape it
directly: rule 7d (a gate counts only after it has been red once — that is
L1's exit criterion), rule 8 (a live-found fault becomes a failing test
before the fix, which is how AR8-D1 gets repaired), rule 27 (the
derivation steps, the perceptual-distance floor and the texture ceiling
are configuration, while standards constants stay pinned with their
reason), and rule 35 (every gate must run on the CI runner too, so none
may depend on a path to a sibling project).

### The L9 assembly drill, run 2026-09-04

`git clone` into an empty directory, `npm ci`, and then: both generators
report their output already matches, `gates.sh` runs green, regenerating
`css/themes.css` leaves it byte-identical, and the showcase opens with
seven theme blocks and no console errors. That last part is a browser
test rather than a file-existence check — a generated page that throws on
load is exactly what a file check reports as success.

## Gate log

| Gate               | Date       | Decided                                                    | Landed in                                          |
| ------------------ | ---------- | ---------------------------------------------------------- | -------------------------------------------------- |
| Phase 0 approval   | 2026-09-03 | 18 statements + B1, over five rounds                       | `docs/SCOPE.md`                                    |
| Correction KT1     | 2026-09-03 | nine fields, all approved                                  | `docs/CORRECTIONS.md`                              |
| Phase 1            | 2026-09-03 | no gate (brownfield inventory)                             | `docs/INVENTORY.md`                                |
| Phase 2 freeze     | 2026-09-04 | 35 features, 12 invariants, four rounds                    | `docs/FEATURES.md`, `docs/DESIGN_INVARIANTS.md`    |
| Phase 3            | 2026-09-04 | T1-T9                                                      | `docs/ARCHITECTURE_DECISIONS.md`                   |
| Mini-round: npm    | 2026-09-04 | S19 added, two constraints struck, S10 rewritten           | `docs/SCOPE.md`, `docs/FEATURES.md`                |
| Phase 4 freeze     | 2026-09-04 | AR0-AR16, after a critic pass                              | `docs/ARCHITECTURE_DECISIONS.md`                   |
| Phase 5            | 2026-09-04 | eleven milestones, H1, H2, standing rules                  | this document                                      |
| L0                 | 2026-09-04 | six report items, all signed off                           | this document                                      |
| Phase 7            | 2026-09-04 | four gaps: two accepted with their reasons, KT1's fallback activated, `/security-review` measured as not applicable | `docs/TEST_PLAN.md`, `docs/CORRECTIONS.md` |
| Toon-mij-dit round | 2026-09-04 | L2, L5, L6, L7 signed off after Kenny saw them; L7 signed off knowing the state-visibility fault runs separately | this document, `docs/CORRECTIONS.md` |
| Round three Phase 0 | 2026-09-05 | 21 candidates rated: 8 Essential themes, 5 Desired, 4 Later, 5 dropped; S21 | `docs/THEME_CANDIDATES.md`, `docs/SCOPE.md`, `docs/FEATURES.md` |
| Release 3.1.0 | 2026-09-05 | Kenny's third look: "Release nu"; the select list in his browser stays the platform's and is accepted as a known limitation. Tag `v3.1.0` on `482e575`, release run 33946443668, published with `SHA256SUMS`, `themes.css`, `components.css`, `MIGRATION.md`; every listed checksum verified against the tagged tree | <https://github.com/kennypassenier/kp-themes/releases/tag/v3.1.0> |
| Release go 1 + KT8 | 2026-09-05 | release held twice on Kenny's look at Pages; KT8 nine fields "Klopt", H1 hover = one step; the native select themed; the foreign-colour detector added at Kenny's request | `docs/CORRECTIONS.md` (KT8), `docs/MINI_ROUNDS.md` |
| KT7 measurement | 2026-09-05 | full chain green in CI on `bc1e369` (run 33941401074); injected literal red on `check:strings` (branch `kt7-drill`, run 33940706648) — KT7 closed | `docs/MINI_ROUNDS.md`, `docs/CORRECTIONS.md` |
| Round three AFK report | 2026-09-05 | R0–R6 all "Akkoord", KT7 all nine fields "Klopt", release: merge now, tag after Kenny's look at Pages | this document, `docs/CORRECTIONS.md` |
| Round three R0–R5 (AFK) | 2026-09-05 | built on branch `round-three-scope`, commits `8ac3819` → `7ca453d`; the combined report and the release go are the next form | this document, `docs/CORRECTIONS.md` (KT7) |
| Round three Phase 5 | 2026-09-05 | six milestones kept as order of work, one release 3.1.0 after R5, Google Fonts in the showcase only, AFK from R0, enforcement unchanged, TH88 added | this document |
| AFK report L1-L10  | 2026-09-04 | L1, L3, L4, L8, L9, L10 signed off; L2, L5, L6, L7 answered "toon mij dit"; both queued deviations go to their own mini-rounds; Pages switched on | this document, `docs/MINI_ROUNDS.md`               |
| Patch TH89 | 2026-09-06 | Kenny, outside a phase gate: terminal's block cursor moved off every h1/h2 onto the focused field's label, 3.1.1 | `docs/FEATURES.md`, `CHANGELOG.md`, `MIGRATION.md` |
| Release 3.1.1 | 2026-09-06 | Kenny: "Merge en meteen taggen". PR #16 merged (`14c0697`), tag `v3.1.1` pushed; the automated Release workflow drafted a release from `npm run checksums`'s ten files, and a published release was built to match that same set (four assets: `SHA256SUMS`, `MIGRATION.md`, `css/themes.css`, `css/components.css`) after a first attempt shipped with only three hand-picked checksums instead of the script's ten and was deleted and rebuilt correctly. All ten checksums verified against the tagged tree; GitHub Pages confirmed live with the fix | <https://github.com/kennypassenier/kp-themes/releases/tag/v3.1.1> |
| Round four Phase 0 | 2026-09-06 | Three forms: a layout layer of sixteen classes plus a ~123-class utility API (Bootstrap rejected as base, recorded in SCOPE.md), the Tailwind bridge kept, both channels kept with a growing pure core, ten example pages with an overflow gate, a generated documentation site with nine sections per component page and four gates, all five table layers, a loud theme fallback, and a full spacing/typography scale. S22-S31 | `docs/SCOPE.md` |
| Round four Phase 2 freeze | 2026-09-06 | Two rating rounds plus the freeze: TH90-TH109, nineteen Essential and one Desired (TH105), nothing Later, nothing dropped. Kenny raised TH92, TH104 and TH106 from Desired to Essential. M1 amended — a release also carries the dist bundle and the checksum file covers every file a consumer can copy; M2-M4 confirmed unchanged. List frozen: changes go through mini-rounds only | `docs/FEATURES.md` |
| Round four Phase 3 | 2026-09-06 | T10-T13: an own markdown renderer for the seven constructs the anatomy documents use (measured), the existing generators extended rather than a static site generator, an own token-reading tokenizer for code colour, and GitHub Pages added to T9's environments | `docs/ARCHITECTURE_DECISIONS.md` |
| Round four Phase 4 freeze | 2026-09-06 | AR17-AR26 after an architecture-critic pass that found eight blocking objections, four demonstrated in a browser. Cascade layers (the load-order assumption was wrong); `.kp-grid` kept and the utility renamed with a collision gate; the spacing scale pinned to today's values so 3.2.0 stays additive; the theme fallback loud in four places, once per session, with AR10 amended so the stylesheet carries a readable version; TH104 moved to 4.0.0; the channel comparison narrowed to class names and roles; documentation facts from four machine sources; the site committed and deterministic; the class names contract from 3.2.0 | `docs/ARCHITECTURE_DECISIONS.md`, `docs/FEATURES.md` |
| Round four Phase 5 | 2026-09-06 | Nine milestones approved unchanged, R6 named as the assembly milestone; the seven new gates all block; KT3's drill becomes mechanical; AFK from R0 | this document |

## Status

| Milestone | Status                                  |
| --------- | --------------------------------------- |
| L0        | **closed** 2026-09-04, all six report items signed off |
| L1        | **closed** 2026-09-04, signed off in the AFK report |
| L2        | **closed** 2026-09-04, signed off after Kenny read the seven documents |
| L3        | **closed** 2026-09-04, signed off in the AFK report; L3-EXIT goes to its own mini-round |
| L4        | **closed** 2026-09-04, signed off in the AFK report — the picker is approved for use, closing S17 |
| L5        | **closed** 2026-09-04, signed off after Kenny saw the published showcase |
| L6        | **closed** 2026-09-04, signed off after Kenny saw the measured link contrast |
| L7        | **closed** 2026-09-04, signed off with the state-visibility fault running separately as a correction |
| L8        | **closed** 2026-09-04, signed off in the AFK report |
| L9        | **closed** 2026-09-04, signed off in the AFK report |
| L10       | **closed** 2026-09-04, signed off in the AFK report |

## Round five — the dialog, the button and the grid (4.0.0)

Six milestones. What gets built was frozen in Phase 2 (TH104, TH107,
TH110-TH114, D3) and the architecture in Phase 4 (T14-T16, AR27-AR33).
D3 is `STRINGS_NL` leaving the exports; the events W1 removed are D4,
renumbered at the AFK report after the two shared one number.
W4 is the **assembly milestone** the procedure requires: its exit
criterion is that the whole does its own job, not that the parts exist.

Four of the six carry a repair of something wrong in the released
package today, found by the `architecture-critic` before the freeze
rather than in the field. Each of those starts as a failing test on
today's code (standing rule 8) before any fix is written.

| ID | Milestone | Features | Exit criterion |
| --- | --- | --- | --- |
| W0 | The button | TH110, TH111, TH113, AR30, AR32 | Both halves of the two-part focus ring measure non-zero on a `.kp-button` in all 24 themes and under the cyberpunk register, the test having failed on today's code first; a `.kp-button` under cyberpunk measures differently from the same button under formal in both channels, with painted focus pixels above zero; three sizes differ measurably in height in all 24 themes and none renders under 24px; none of `.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health` pushes the page sideways at 320 and 360px, each test red when the shared rule is removed |
| W1 | The confirmation dialog | TH107, D3, D4, AR27, AR28, AR29 | In both channels and both browsers a click on a destructive button opens a `<dialog>` carrying the attribute's phrase, Escape and Cancel do nothing, Confirm acts **exactly once**, and focus returns to the button; two consecutive confirm cycles produce two actions, which is the measurement the unlocked design produced zero for; a destructive item inside an open popover leaves that menu re-shown and focused after the dialog closes; attaching the framework-free module over a React-rendered destructive button leaves it working, the rewritten test having gone red on today's code first; and a new gate holds the import closure of the six files chassis-rs bakes in at exactly those six |
| W2 | The grid and the container queries | TH104, AR31 | The collapse-to-one-column test at 320px goes red on today's attached grid first and green after `js/gridlayout.js` writes custom properties instead of inline styles; one test per converted component places it in a narrow container while the viewport stays wide, and the old viewport media query is removed in the same commit so two mechanisms never coexist; the migration note carries the wrapper instruction, and a gate fails when one of this package's own example or showcase pages lacks a wrapper it needs |
| W3 | The scroll boundary and the two documents | TH114, TH112, AR33 | Six assertions pin both halves in each of `.kp-table-wrap`, `.kp-diff` and the `<pre>` rule: an absolutely positioned child is clipped, a popover is not; the guide states that per region in words; and a reader of `README.md` and `docs/SCOPE.md` gets one answer about the git route rather than two, the scope statement carrying a dated correction rather than a quiet rewrite |
| W4 | **Assembly: a dashboard that does its job** | all eight, T14-T16, AR27-AR33 | A page shaped like a real consumer's — a data table whose row menu carries a destructive item — is operable end to end **with the keyboard alone**, in all 24 themes, in both channels and both browsers: open the menu, reach the destructive item, get the dialog, cancel it and land back on the item, confirm it and see the row go exactly once. Not "the parts exist". All 42 site pages and 10 example pages regenerate from their sources, and the bundle matches |
| W5 | The release | M1, TH103 | `MIGRATION.md` carries a 4.0.0 section naming every breaking change, with its gate green over every class it mentions; both workflows green on the tagged sha; the draft release carries the checksums over every copyable file. Publishing stays Kenny's own action |

### How the six run in parallel

Kenny asked for as much parallelism as the work allows. W3 shares no
file with anything and starts immediately. W2 owns `js/gridlayout.js`
and the grid and nav blocks of `css/components.css`. W0 and W1 both
touch `components/button.jsx` — W1 rewrites its confirmation half, W0
adds a size prop to its class half — so W1 merges first and W0 rebases
onto it. W4 cannot start until the other four have merged, because
assembly is the thing that is left over when the seams are cut.

### Enforcement for this round

Unchanged in shape: the commit hook runs the whole chain and blocks, CI
runs the same chain, `main` is protected. Two gates join it, both
blocking, and each has to be red once before it counts (rule 7d):

- **The import-closure gate.** The set of files chassis-rs bakes in is
  closed under import today, and AR28 turns on keeping it that way. The
  gate walks the import graph from those entry points and fails when it
  reaches a file outside the vendored set. **Built at W1 as
  `gates/check-closure.mjs`**, blocking in all three lists. The six are
  derived from this repository alone (standing rule 35): `js/no-flash.js`,
  `js/theme-registry.js`, `js/theme-core.js`, `js/theme-picker.js`,
  `js/strings.js` and `js/components.js` — the modules holding the five
  functions `chassis.js` calls, plus their closure. Drilled red twice: an
  `overlays.js` import added to `js/components.js`, and a bare
  `react-dom/client` specifier added to `js/theme-picker.js`.
- **The wrapper gate.** AR31 refuses a runtime warning, so the check
  moves to this package's own pages: a component converted to a
  container query must sit inside a wrapper that establishes one.
  Built as `gates/check-wrappers.mjs` and drilled red twice on
  2026-09-07 — ten `missing-wrapper` findings with the wrapper taken out
  of the example pages' nav bar, and one `unlisted` finding with a
  `@container kp-card` block added to the stylesheet. It reads the
  container names out of `css/components.css` rather than from a
  constant, so a future conversion cannot fall outside it by accident
  (AR26).

### Round five — the Phase 5 gate, 2026-09-07

Kenny approved all six milestones unchanged, and answered the four
questions that were not about the milestones:

- **H1 — both new gates block.** The import-closure gate and the wrapper
  gate refuse a commit rather than reporting. Each has to be red once on
  an injected violation before it counts (rule 7d).
- **H2 — the release workflow joins the chain, and the test holds it.**
  `.github/workflows/release.yml` runs `npm run gates` instead of the
  hook script, and KT7's unit test lays all three lists side by side
  instead of two. KT7 was written about exactly this shape one layer
  down; the tag-building chain had been outside it.
- **H3 — the whole chain blocks a commit, and that is now written down.**
  The original Phase 5 decision H1 said the fast gates block a commit and
  the browser tests block a merge. KT7's repair has since forced every
  `check:` step into the hook, so the type check, the declaration gate and
  the unit tests are in the commit path. The decision is rewritten to
  match what actually runs.
- **C1 — no correction form for the three defects.** Kenny's call: the
  `architecture-critic` found them before the freeze, so the procedure
  caught them and they are ordinary round work. Recorded here rather than
  in `docs/CORRECTIONS.md` for that reason.
- **S1 — rules 8, 7d, 7e and 35 shape this round**, confirmed unchanged.
- **A1 — AFK mode from W0.** Milestone gates accumulate into one combined
  report; a needed deviation from a frozen decision quarantines its area
  and queues a mini-round immediately.

**Rule 7h, discharged before the AFK run starts.** A discipline-only
measure does not survive an unattended stretch, so each one this round
will touch is decided now rather than hoped for:

| Measure | Decision for this round |
| --- | --- |
| KT1 — every checkable claim in a form is verified in the same turn, naming file and line | **Stays discipline.** It binds forms, and in AFK the only forms are queued mini-rounds, written when Kenny is back. |
| KT3 — a browser test asserting the package applies something is drilled red first, with the removed rule named in a comment | **Already mechanical.** `gates/check-layers.mjs` refuses a bare-element selector in the showcase stylesheet, and the drill-comment gate counts those comments against the number of such tests. |
| KT6 — every state a component sets has a named way out | **Stays discipline**, and W0 and W1 both create state (a size class, an open dialog). Named as applying; the combined report says per milestone whether it was applied. |
| Rule 7e — the scaffolding may not answer for the product | **Mechanical where checkable**, discipline for the rest. It was already broken once this round, by Claude, on the TH110 measurement. |

### Round five — status

| ID | Status |
| --- | --- |
| W0 | **built** 2026-09-07 (AFK), in a parallel worktree. The focus ring is repaired: `.kp-button:focus-visible` now composes the inner ring with the brutalist offset shadow instead of replacing it, and both `css/_rules.css` and the button read one knob so the two halves cannot drift again. The cyberpunk register reaches `.kp-button` for the square corner and the charge gradient, and deliberately **not** for the `clip-path` bevel — the drill that added it back reported `cyberpunk: the focus indicator painted 0 pixels`. Three button sizes as modifier classes (T15), ten new `--kp-*` knobs, and the small step floored so compact density cannot push it under 24px. One shared overflow rule for `.kp-button`, `.kp-badge`, `.kp-tag`, `.kp-health` and `.kp-copyable`. Standing rule 8 held: 16 of 24 ring tests and 8 of 10 overflow tests were red on today's code first. Eight drills, all red, all restored — and drill 3 reshaped the measurement twice, because a focused-vs-unfocused pixel diff was measuring the theme-switch transition and a two-colour pixel count was scoring the page background. |
| W1 | **built** 2026-09-07 (AFK), in a parallel worktree. The confirmation is a native `<dialog>` written in `js/components.js` itself — no import edge to `js/overlays.js`, which the new closure gate now holds — and both channels open the same one through the exported `openConfirmation()`. Confirm re-fires the click behind AR27's one-shot lock: measured `["open","confirm","closed"] x2, acts: 2`, against `["open","confirm","open"] x2, acts: 0` with the lock taken back out. The popover the dialog displaces is re-shown before focus returns. AR29 was drilled red first (standing rule 8): the rewritten test attaches the module over the React part, as `js/auto.js` does in the field, and the react channel failed `expected 1, received 0` in both browsers before the ownership mark went in. Arm-then-act survives as `data-kp-confirm-mode="inline"` / `confirmMode="inline"`. `ARM_EVENT` and `DISARM_EVENT` left the exports (D3). Four drills red, plus two on the new gate. |
| W2 | **built**, 2026-09-07. The grid tile's place is four custom properties instead of an inline `grid-column` / `grid-row` (the collapse rule had been dead since it was written); the grid and the nav bar read `@container kp-grid` and `@container kp-nav` and their viewport mechanisms are gone; the DataTable needed nothing, `@container kp-table` has carried it since 3.2.0. `MIGRATION.md` carries the 4.0.0 wrapper instruction and `gates/check-wrappers.mjs` blocks a page that draws a converted component outside a container |
| W3 | **built** 2026-09-07 (AFK), in a parallel worktree. Six assertions in `tests/scroll-boundary.spec.mjs` pin both halves in `.kp-table-wrap`, `.kp-diff` and the `<pre>` rule: an absolutely positioned child is clipped, a popover is not. Measurement is a hit test rather than a rectangle, because `getBoundingClientRect` reports where a clipped element *would* be and would have scored both halves as escaping. Three are drillable and went red; three are not, and the attempt was made rather than assumed — with all three `overflow-x: auto` declarations removed at once the clipping cases went red and the popover cases stayed green, which is the top layer answering rather than this package. Two facts were measured that the draft had wrong: `container-type` does **not** make a wrapper a containing block, and a top-layer element's `position: absolute` resolves against the initial containing block in document coordinates. TH112's dated correction sits under the struck constraint in `docs/SCOPE.md`; the README was right and is untouched. |
| W4 | **built** 2026-09-07 (AFK), in a parallel worktree. `tests/fixtures/dashboard.html` and `tests/fixtures/react-dashboard.jsx` are a page shaped like a consumer's — a data table, row actions in a menu on the popover layer, a destructive item in that menu — and `tests/dashboard.spec.mjs` drives the whole journey with the keyboard alone in both channels and both browsers: Tab to the trigger, Enter to open, Tab to the destructive item, Enter for the dialog, Escape and then Cancel each leaving the menu re-shown and the focus back on the item rather than on `<body>`, and a second Enter plus Confirm deleting the row exactly once. Behaviour runs in two themes rather than 24 — a theme is a token set and cannot change which element the keyboard reaches — and the focus indicator on the destructive item runs in all 24, twice: as the theme declares it and as the browser paints it, because `.kp-popover` is `overflow: auto` with 4px of padding and a ring is 4px wide. Six drills, all red: the `.kp-button:focus-visible` block (24 themes named declared, 20 painted 0), the `displaced` restore loop, the one-shot lock in both channels at once, AR32's shared overflow rule (the page stayed 320/320 — W3's wrapper absorbed it — and the wrapper read 354 against 304, which is where the assertion was moved to), and the `@container kp-table` block. `tests/ring.mjs` now holds the ring measurement that `tests/button.spec.mjs` had hand-rolled, because W4 measures the same ring on a different control. All 42 site pages, 10 example pages, the showcase, the bundle, the HA themes and the utilities regenerate byte-identical from their sources. Reading the pages as a reader found two things no gate looks at: the button page never learned about W0's size scale — no example, and `.kp-button--sm` / `.kp-button--lg` in no table — which is fixed here in `gates/site/descriptors.mjs`; and a status badge reading `Overdue` breaks mid-word on `examples/list-with-form.html`, which is AR32's `overflow-wrap: anywhere` doing what it was chosen to do, so it is queued as **MR-W4-1** rather than repaired. Suite: 1302 passed, 30 skipped, 0 failed. |
| W5 | **released** 2026-09-07. `v4.0.0` is tagged on `15dcad3`, the sha `origin/main` carries, after both workflows were green on it and `git show --stat` confirmed that commit carries the change and that its tree reads 4.0.0. The release workflow built the draft: six assets and a 34-line `SHA256SUMS`, on tag `v4.0.0`, `isDraft: true`. **All 34 checksums were verified here against a fresh `git archive` of the tag — 34 OK, 0 failures.** That is the half of KT9's evidence that had rested on the record rather than on a measurement, and it is now measured. Publishing stays Kenny's own action. Three follow-ups shipped after the AFK report and before the tag: MR-NOTCH (the bevel back on the cyberpunk button, drawn from the inside), the example pages joining the site navigation, and both registers reaching the demo pages together with the wizard example becoming a wizard. |

### A third flake, named and repaired

Standing rule 8a asks for a name rather than "it was load", and two of
the three flakes this round produced now have one and are repaired
(`tests/site.spec.mjs` and `tests/showcase.spec.mjs`, commit `aff22d1`).
The third is named here, and repaired once W4 had merged and released
`tests/fixtures/components.html`.

**The fault.** Three assertions in `tests/forms.spec.mjs` (lines 117, 131
and 142) wait for the submit button's busy state. That state is transient
by construction: the fixture settles the save after **400 ms**, and
`toBeDisabled()` can only pass if one of its polls lands inside that
window. When a poll misses it, retrying cannot help — the state is
already gone — so the assertion waits out its full budget against a
button that will never be disabled again. Load does not cause this; it
only decides whether the first poll lands in time.

**Proved rather than reasoned.** Closing the window to 0 ms in both
channels reproduces it deterministically, with the same messages the
loaded run produced: `toHaveAttribute(aria-busy) — unexpected value
"null"` and `toBeDisabled() — unexpected value "enabled"`. Restored, all
eight pass in 4.5s.

**Also found:** the comment above line 131 says the fixture settles after
50 ms. It settles after 400. The number in the comment has been wrong
since it was written.

**The repair.** Not a longer budget, which makes the window harder to
hit rather than easier. The fixture's settle is now a knob: with
`window.kpFormHold` set, the busy state is held until the test resolves
it through `window.kpFormSettle()`, in both channels. The assertions stop
depending on timing at all. That is rule 27 as much as rule 8a — 400 was
a value only the fixture could change.

**Both halves drilled.** Closing the window to 0 ms, which reproduced the
fault deterministically before, now leaves all eight tests green — the
race is gone rather than widened. And removing the `DONE_EVENT` listener
in `js/forms.js` still turns the KT6 test red on `toBeEnabled()`, so the
test still catches the fault it exists for: a component that ignores the
consumer's `done()` and leaves the button stuck.


**Merged into `round-five` on 2026-09-07**, in the order the plan named:
W1 first, then W0 rebased onto it, then W3. Two conflicts, both the same
shape — two milestones raising the same counter — resolved as the sum and
confirmed by the extractor rather than asserted: AR21's knob count is 74.
`site/components/button.html` is generated, so the generator resolved it.
On the merged tree: gates green, **1264 browser tests passed, 30 skipped,
0 failed**.

**A harness fault found while verifying, not a product one.** Four
worktrees running the browser suite share port 4173, and
`reuseExistingServer` then hands one run the other checkout's files, so
every fixture 404s and a whole suite fails for a reason unrelated to the
code. It cost two false readings before the config's own comment named
it — W3 read as 12 of 12 failing and W1 as 26 of 50 passing, both green
on a dedicated port. `playwright.config.mjs` already documents
`KP_TEST_PORT`; what it does not do is default to something unique per
checkout. Standing rule 32, met from the side it warns about.

## Round six — the next cyberpunk, the hooks and the fonts (towards 5.0.0)

Seven milestones. What gets built was frozen in Phase 2 (TH115–TH136)
and the architecture in Phase 4 (T17–T21, AR34–AR46). C5 is the
**assembly milestone** the procedure requires: its exit criterion is
that the concept demo, served at a URL Kenny opens, does what the
approved demo did — not that the parts exist. **Kenny chose an alpha tag at the gate (R1, 2026-09-07)** over the
draft's "no tag": after C6, `v5.0.0-alpha.1` is tagged with a draft
release, and whether it is published stays his own action; the tag is a
promise under S20 for what it carries, and the package version moves to
`5.0.0-alpha.1`. 5.0.0 itself still waits for every theme (S48).

| ID | Milestone | Features and decisions | Exit criterion |
| --- | --- | --- | --- |
| C0 | The walking skeleton and the new gates | AR34 (empty module), AR36, AR37, AR39 (manifest walk), AR40 (table pass), AR41 (drift), AR42 (the `concept` entry) | `js/effects.js` exports `attachEffects` that attaches nothing yet and is wired in `js/auto.js`; `themes/hooks.json` exists with a `default` row and every theme passes `check-hooks.mjs` with quiet answers; `check-register-coverage.mjs`, `check-fonts.mjs`, the tear drift check, the `url()` walk in `check-manifest.mjs` and the table pass in `check-motion.mjs` each **fired red once** on an injected violation and the drill is recorded; `examples/concept.html` renders the standard page in both channels under every theme with the quiet answers and passes `check-examples-wired` and `check-inline-styles`; CI green on the sha |
| C1 | Tokens and the two surfaces | TH115, TH116, S47, AR38 | The new `themes/cyberpunk/tokens.json` carries the palette (S40) and every theme carries the hero sources; `check-tokens` parity at 100% on the grown contract; `generate-themes.mjs` emits the hero ground with hover, active and disabled under `[data-kp-surface="hero"]`; `check-contrast`, `check-invariants` (`FOCUS_SURFACES`) and the DI table iterate both surfaces for all 24 themes and are green; `ha/kp-cyberpunk.yaml` regenerated; the Theme union unchanged |
| C2 | The register | TH117, TH118, TH121, TH123, TH124, TH133, AR37, AR41, AR43, AR46 | The coverage gate is green over the 64 roots (eight excused with reason); the navbar clip-path is computed and mirrors under `data-kp-nav-side="end"`; the dropdown hit test hits the link in both browsers; notch, mirror and slit measured per variant with the focus-ring delta on both sides; the tear's pixels above and below the ridge match the two surfaces at five x positions in both orders, for both seeds; the texture's effective opacity reads 0.06 or under through the DI9 gate; `.kp-card` without `data-slot` gets the register rule; every knob of AR43 has its default in the register |
| C3 | The effects module | TH119, TH120, TH122, TH125, TH129, T17, T20, AR34, AR35, AR40, AR44, AR45 | One suite drives React and framework-free in chromium and firefox: headline decipher ends equal to the source and runs once per session, emphasis clears with the measured stagger and the text is always in the DOM, the rule draws on entering the viewport and stands drawn without the script; the root attribute is set before first paint (no flash measured on a streamed fixture); a mid-session reduced-motion switch resolves every running effect to rest; `reports/di5.md` names every effect with its rate, three calibrations within 10%, an injected 5/s loop shows red in the report and the gate changes nothing; `kp-effect-unknown` fires once for a bad value and diagnostics list it; `check-closure` green; `DecipherText` wraps the module |
| C4 | The fonts | T19, AR39 | `fonts/<family>/` with latin subsets for every named family and script subsets for woodblock and lapis; `css/fonts.css`, the `./fonts/<family>` exports, the manifest and `SHA256SUMS` cover every file; `check-fonts.mjs` green on licence, reserved names and the 1.5 MB per-theme budget, red once on an injected reserved-name subset; `release.yml` attaches `fonts.tar`; a tarball test proves the fonts install (rule 7f); the fixture without webfonts still passes its screenshot check (T19's fallback) |
| C5 | **Assembly: the concept demo does its own job** | all of the above, S46, E1 | `examples/concept.html?theme=cyberpunk` on the live site reproduces the approved demo's measured checks — three fonts loaded, the outline button face and ink, the dropdown hit test, the tear pixels, the marks cleared, no inline styles — and a dashboard fixture under cyberpunk is operable end to end with the keyboard alone in both channels and browsers; the "bare chassis-rs" test (no register, no effects, no webfonts) proves the page stays functional and readable; the concept index links all 24 themes; **the compare page shows 4.0.0 on the left and the current build on the right** (MR-R6-COMPARE); **Kenny has opened the URL** before the gate is signed (rule 39) |
| C6 | Documentation and the round's close | TH127, TH134, TH135, TH136 | `MIGRATION.md` carries a "5.0.0 (in progress)" section naming the meaning change of `cyberpunk`, the two files chassis-rs does not vendor, the fonts and the hooks; `themes/cyberpunk/anatomy.md` rewritten on the new palette with the three stale claims gone; the hook vocabulary documented in README, USER_GUIDE and the site with `check-site` truth green; the lift plan's cyberpunk row reads done; the ecosystem entry updated; `main` fast-forwarded and the site deployed, no tag |

### How the seven run

C0 first, alone: the gates must exist and have fired before feature
code lands (Phase 5's rule). C1 next, alone: tokens feed everything.
Then **C2, C3 and C4 in parallel** — they own disjoint files
(`css/cyberpunk-register.css` and `themes.css` output; `js/effects.js`,
`fx/`, `tests/effects.spec.mjs`; `fonts/`, `css/fonts.css`,
`gates/check-fonts.mjs`) — each in its own worktree with its own
`KP_TEST_PORT`, as round five learned. C5 after all three merge; C6
last.

### Enforcement for this round

Unchanged in shape: the commit hook runs the whole chain and blocks, CI
runs the same chain, `main` is protected, and the KT7 test lays the
lists side by side. Six gates join the chain at C0, every one blocking
and every one red once before it counts (rule 7d): `check-hooks.mjs`
(AR36), `check-register-coverage.mjs` (AR37), `check-fonts.mjs` (AR39),
the tear drift check (AR41), the `url()` walk in `check-manifest.mjs`
(AR39) and the table pass in `check-motion.mjs` (AR40, report-only by
S42 — it fails only on a missing or malformed table). The browser suite
stays outside the commit hook and inside CI, as today.

### Discipline-only measures during an AFK stretch (rule 7h)

KT3's drill comment (a test goes red before it counts) is
discipline-only; round five applied it at every test and the report
said so. Same here: every new browser test carries its drill line, and
the AFK report lists any that do not. S42 (DI5 reported, not corrected)
is mechanical by construction — the gate cannot edit an effect. Rule 39
(Kenny opens the live URL before the release-shaped go) is the C5 exit
criterion itself.

### Round six — the Phase 5 gate, 2026-09-07

Kenny answered: C0–C6 Akkoord; H1 all six gates blocking in the hook,
CI and the release workflow; S1 the forty standing rules as on disk
(38–40 included); R1 an alpha tag after C6; A1 **AFK from C0 to C5**.
Enforcement was installed in round one and has held every round since;
the six new gates are C0's first work and each fires red once before it
counts. The critic re-ran with the build phase as its lens before C0
(L7); its report joins the ratification queue.

### Round six — status

| Milestone | Status | Ratification |
| --- | --- | --- |
| C0 | **built** 2026-09-07 (AFK). The walking skeleton: `js/effects.js` exports the hook vocabulary, the state names, the root attribute, the `TIMINGS` table and `attachEffects()` — at C0 it does one thing, report an unknown surface or reveal value as `kp-effect-unknown` (AR44); `js/auto.js` attaches it and honours `?theme=<name>` only on a page that opts in. The concept demo is the eleventh example page, linked once plainly and twenty-four times by theme from the index, and it renders in both channels and both browsers. Seven gates are new or extended, all in `npm run gates` and the commit hook, and every one was **red once on the real tree** the same day: hooks (the default emphasis answer blanked → "quiet without a reason"), register coverage (every `.kp-button` subject in the register renamed → 1 fault; the first attempt renamed one of eight and stayed green, which is the drill working), fonts (a `@font-face` for a family with no directory → "promises files the package does not carry"), tear (seed 7 → 8 → "does not match gates/tear.json"), manifest (`js/effects.js` dropped from the list → 1 difference), motion (the `kp-ember` row deleted → 1 violation), texture (cyberpunk's pending value 0.55 → 0.4 → 1 fault). Two ratchets hold what C2 must empty: 51 roots the register does not reach and two textures over DI9's ceiling. Building it found the selector parser reading `.kp-card__title` as `card` (the whole token is matched now, and a root that only ever appears as an ancestor counts as declared), the site gate refusing the seven new attributes until a page owned them (the "Effects and surfaces" page, in Theming), and the divider being invisible under a quiet theme, which is by design and no longer a probe. Findings for Kenny sit in the AFK queue below. |
| C1 | **built** 2026-09-07 (AFK). The token contract grew from 81 to 93 in one change (S47): eleven hero sources — `surface-hero-bg`, `-fg`, `-fg-2`, `-muted`, `-border`, `-primary`, `-primary-foreground`, `-danger`, `-danger-foreground`, `-card`, `-card-foreground` — and `kp-text-display`, declared by all 24 themes; a one-ground theme points the sources at its app values. `themes/cyberpunk/tokens.json` is the 5.0.0 palette (S40): signal yellow as the hero ground and the app's primary, the void with a violet cast as the app ground, blood red, cyan; its anatomy is rewritten and it no longer takes the DI3 opt-out. The generator writes one hero block per theme inside `@layer kp.base` — the remap of what a component reads, `--input` and `--selected` included, and hover, active and disabled for the hero's button and alert derived away from the hero ground's own lightness; `css/_rules.css` paints a surface's ground, which nothing did before (the critic's blocking objection). `check-contrast` measures nine hero text pairs, the hero frame at 3:1 and the hero's pressed states held apart; `check-invariants` measures the hero boundaries, the hero focus ring and the hero states; the DI table is regenerated; every theme answers the `surface` hook with its generated block and the default answer is the painting rule. All three gates were red on real faults during the build (25 contrast, 5 invariant, one matrix row) before they were green. **Two findings the browser made and the gates had not:** the contrast gate computed in floating point while the browser paints 8-bit channels, so light's warning ink read 4.50 in the gate and 4.48 on the page — the gate now rounds like the browser and two inks moved one lightness step (light `warning-foreground` 29% → 28%, terminal `success-foreground` 43% → 44%); and `tests/surfaces.spec.mjs` first read a primary button halfway through its colour transition from formal to solstice and called it 1.55:1 — the test now settles the page under reduced motion and finishes every animation before measuring, and takes every stop of a gradient as a ground (retro's title-bar h1). The test measures every text on both surfaces of the concept page under all 24 themes in both browsers (50 passes) and was drilled red by leaving the hero block out of the generator: "the hero paints the app's ground". |
| C2 | **built** 2026-09-07 (AFK). `css/cyberpunk-register.css` rewritten from the approved demo under the component vocabulary: the AR43 knobs with the demo's values (held by a unit test), the texture at exactly DI9's ceiling (scanlines and vignette at 0.06, the pending entry gone), the display type, the three hooks answered — the mark as a redaction that lifts, the razor tear as a masked layer with its hairline (both seeds, both orders), the heading accent with the bracket frame and the drawn rule — the navbar strip with its computed clip-path that mirrors under `data-kp-nav-side="end"`, the dash-prefixed dropdown, the notched buttons with the slit and the charge, the fields, and one answer per component root: **52 of 60 roots answered, 8 helpers excused, 0 pending** (the ratchet emptied). Every animation and transition sits inside the no-preference guard, durations literal so the DI5 rate is computable. The navbar gained a dropdown in both channels (`links[].links`, `.kp-nav__menu` in the component layer) because TH117 measures one and the package had none; nav links carry `data-kp-text` for the glitch copy. `tests/register-cyberpunk.spec.mjs` measures the strip and its mirror, the dropdown hit test and its keyboard path, the notch per variant and the mirror, the focus delta inside four variants, the tear at five x positions in both orders and both seeds (texture off for the sample), and a bare `.kp-card`; six drills red, two mutations that stayed green recorded in the header. **Three findings.** (1) The motion gate extrapolated a one-shot animation as if it looped: one fade in 320ms read 3.1/s, which is why the 4.x register chose 340ms; a run that plays once is now rated over the second it occupies (a burst of four in 320ms still reads 4), the iteration count is parsed from the shorthand, and TH131's test reads every real keyframe and goes red on an injected 5/s loop. (2) The register can hold no `var()` in an animation duration because the gate must compute the rate, so the `--kp-*` duration knobs are what js/effects.js reads and the CSS carries the same numbers literally. (3) The demo's `CLASSIFIED` stamp is a user-visible string in CSS content (KT5's spirit) and became the `///` prefix. **Gone with the 4.x register (S39, A1):** `.fx-flicker`, `.fx-pulse`, `.fx-cellpop`, `.fx-media`, `[data-slot]`; kept with a new meaning: `.fx-glitch`, `.fx-rule`, `.fx-brackets`, `.fx-notch`, `.fx-signal-badge`, `.microlabel` — the migration note at C6 lists them. The button surface test found the register's slit gradient read as a ground by the surfaces test; that test now takes a gradient as ground only when it fills the box. Two more test repairs from CI and a rerun: the rhythm gate counted two inline marks wrapping onto consecutive lines as touching blocks (CI's fonts at 320px; blocks only now), and the overflow gate once read the navbar strip mid-slide as a 1280px overflow in chromium (animations are finished before measuring; three reruns clean, rule 8a). |
| C3 | **built** 2026-09-07 (AFK). `js/effects.js` performs the three reveals for both channels — the decipher with one slice burst after it, the marks that clear one after another (and the dossier that opens and closes on its trigger, `aria-pressed`), the rule that draws on entering the viewport — and toggles state classes only; which reveals a theme performs is the theme's answer, read from `--kp-reveal-headline|emphasis|rule` on the root, so formal is quiet without a line of code. Reveals run once per session per page (sessionStorage, key per path, hook and position; `data-kp-reveal-every="load"` opts in); an unknown hook value is reported once as `kp-effect-unknown` with the accepted values and listed by the diagnostics; every reveal announces `kp-reveal` with `skipped`; reduced motion at load or mid-session resolves everything at once; `detach()` clears every timer, frame, observer and listener and removes the root attribute. The head snippet of `js/no-flash.js` gained `effects: true`, which the example pages and the React fixture inline, so the root is armed before first paint (AR34) — measured at readyState interactive. `DecipherText` is a wrapper around the module (AR45; its 4.x props `delay`, `direction`, `preserve`, `glyphs` are gone, for the migration note). `reports/di5.md` is the written ledger of every effect's rate, regenerated by `npm run report:di5` and refused stale by the chain and the hook; the preference-read scan covers `js/` as well as `fx/`. `tests/effects.spec.mjs`: 34 tests over both channels and both browsers — final text equals source and the first load went through the motion, once per session, the marks covered then cleared at the measured stagger (MutationObserver timestamps), the dossier, the rule below a spacer, reduced motion at load and mid-session (within 400ms), the first-paint arming, the quiet theme, the rule drawn without the module, the unknown value, and three calibrations within 10% (the slice from `getAnimations()`, the wipe from the computed transition, the decipher from attach to `kp-reveal`). Six drills red; one mutation that stayed green is recorded (an observer threshold of 0 is still no intersection). **Found on the way:** the React examples fixture loaded four stylesheets where the generated pages load six (KT8, the registers) — the React channel had no register at all in every earlier suite; the React Card and the framework-free Card renderers dropped every `data-` prop but one; a container carrying the emphasis hook with no marks (the hero button) consumed the once-per-session memo for the hero's marks until the key gained a position. |
| C4 | **built** 2026-09-07 (AFK). `fonts/`: 24 families, 52 faces as woff2 subsets (3.5 MB in all), each with its OFL text beside it, built by `gates/subset-fonts.mjs` from the upstream TTFs of github.com/google/fonts with pyftsubset per face and script — latin for every family, Arabic for Vazirmatn and Markazi Text, and for Zen Kaku Gothic New and Shippori Mincho the kana, the CJK punctuation and the JIS X 0208 level 1 kanji (2,965, generated from the EUC-JP grid into `fonts/jis-level-1.txt`). `fonts/families.json` is the plan and the provenance; `css/fonts.css` is generated from it (52 `@font-face` rules with weight ranges read from each variable font's axes, `font-display: swap` and a `unicode-range` per script) and refused stale by the chain and the hook. **Measured, not assumed:** the licence header of every family was read from its OFL.txt — exactly six declare a Reserved Font Name (Plex twice, Josefin Sans, Lora, Share, Source), the R6-Q1 six; they are listed with that reason and ship nothing. **Budget:** woodblock weighed 2.37 MB with the bold faces of its two Japanese families against the 1.5 MB per-theme budget; it ships the regular faces only (1.2 MB) and the browser synthesises the bold — recorded as R6-Q6 for Kenny (raise the budget, drop a face, or accept). Plumbing: `fonts` in `files`, `./css/fonts` and `./fonts/*` exports, the manifest expands a directory export to every file under it (55 entries derived from the plan, never typed), `*.woff2 binary`, the fixture server's mime, `release.yml` attaches `fonts.tar` and `css/fonts.css`; the example pages and the React fixture load the stylesheet. `tests/fonts.spec.mjs`: the faces arrive (every woff2 served, both families loaded), and with every font file blocked the page still reads and holds; the tarball test packs and finds a face with its licence and no reserved-name file. Drills: the Rajdhani entry removed → red; `font-display: swap` removed → stayed green and is recorded (the fallback paints after the block period either way). |
| C5 | **built** 2026-09-07 (AFK), **redone the same evening on Kenny's reading** (below); waits for his second look at the URLs. The compare page (MR-R6-COMPARE): `examples/compare.html?theme=<name>` — the concept demo under the 4.0.0 release on the left and under the current build on the right, the theme from the query on both frames, all 24 themes linked. The left frame is `examples/concept-4.0.0.html`, the same descriptor body under the release's own `dist/kp-themes.css` and `kp-themes.js`, vendored under `showcase/baseline/4.0.0/` and held to that release's `SHA256SUMS` by `gates/check-baseline.mjs` (in the chain and the hook; drilled red with one appended byte). CI caught what the local chain could not: `.gitignore` ignores `SHA256SUMS` everywhere, so the baseline's copy had never been committed and the gate went red on the runner — the push chain held main until the ignore rule got its exception. `tests/compare.spec.mjs` reads each frame's `--kp-themes-version` and the 5.0.0 token no 4.0.0 stylesheet declares — because `package.json` still says 4.0.0, the version alone could not tell the sides apart; two drills red. `tests/bare.spec.mjs` is the chassis-rs case (T9, E1): registers, the fonts stylesheet, every woff2 and the effects module refused; under cyberpunk and formal the page reads (the headline is its text, the marks their words), works (reset, the dropdown by keyboard, no disabled button), holds (no sideways scroll) and clears its contrast floors on both surfaces measured on the rendered page; drilled red with the mark's ink set to its own plate — after regenerating themes.css, because the first attempt edited the partial and drilled nothing. **TH130 caught up here** (it was in no milestone row): `gates/config.json` holds the one stylesheet list with roles (authored, generated, bundled, classes, motion, texture, partial), `gates/stylesheets.mjs` serves it, six gates read it instead of a private list (layers, utilities, migration, bundle, motion, texture), a unit test refuses a css/ file in the manifest without an entry, drilled red by deleting `css/layout.css` from the list. **Kenny's reading of the first C5 (2026-09-07, the ratification form):** the concept page was not the approved demo — S46 says the same structure and elements, and the first page was a reduced one in the component vocabulary; the compare page showed two whole pages in two narrow frames that did not scroll together, and for most themes the only visible difference was typography, which the page never said. **Redone:** `examples/concept.html` is now the approved demo element for element — brand and strip with dropdowns and the cta, the laurels, the side note, the deciphering headline, the lede with two marks, three buttons, the platforms line, the spec sheet, the tear, the form with select, textarea and checkbox beside the dossier, the footer behind a second tear — in the package's components and hooks, with a theme picker above it (Kenny: for all themes, or the picker on top); four small components joined the layer for it (`kp-laurels`, `kp-side-note`, `kp-platforms`, `kp-spec`, quiet everywhere and answered by the register), the strip's link modifiers `--cta` and `--lang`, the quiet divider gained a step of height (the rhythm gate measured 0px between a section and the footer under formal), and `gates/generate-compare.mjs` now MEASURES the difference per theme from the 4.0.0 bundle and the current stylesheets — changed tokens, shipped fonts, the register rule for rule, the texture — writes it as plain statements, and shows only the specimen sections the differences touch: 4.0.0 on the left, the current build on the right, full width, scrolled together; dark carries the R6-Q2 texture proposal as a second pair (today 0.50 beside 0.06). Measured on the way: the destructive wipe button was disarmed by DI10 (it now asks confirmation), light's palette differs by the one ink C1 moved, and 4.0.0's `.kp-autogrid` needs a tighter minimum for three footer columns at 320px (`kp-autogrid--tight`). **The measure of correction L (pending Kenny's approval of the form):** `showcase/concept-demo.json` inventories thirty elements of the approved demo with the text the rendered page must carry, and a unit test in `gates/gates.test.mjs` refuses `examples/concept.html` when one is missing — green on the page as it stands, red with the laurels taken out of the descriptor (2026-09-07). The approved demo's measured checks are held by the specs of C2–C4 (the dropdown hit test, the outline button, the tear pixels, the marks, the two shipped families — the third, Share Tech Mono, waits on R6-Q1), the keyboard journey under cyberpunk by W4's dashboard test, and no inline styles by TH109's gate. **Kenny's third reading (2026-09-08)** signed the demo page off (R6b) and refused the compare page again: every theme section was visible at once — `.kp-stack`'s `display: flex` beats the `hidden` attribute and the test read the attribute, not the paint — and a theme whose only difference is typography showed a near-empty frame. **Rebuilt a third time on his V1 answer** (the whole demo with the differences marked): `examples/compare.html` is an index and one generated page per theme carries the measured statements and the whole concept demo twice — the left frame under the 4.0.0 bundle with the current component layer on top, so what differs is the theme; the right under the current build — full width, scrolling together, the frame script marking the pieces the measurement names (`data-compare-mark`, painted by `showcase/compare.css` as scaffolding under `check-layers`), and the page wearing its own theme rather than the visitor's stored one. `tests/compare.spec.mjs` asks for what is painted: one theme per page, the inventory whole in both frames, the marks on the named pieces and every mark visible, 4.0.0 left and current right, the frames scrolling together; three drills red and restored. The visibility fault is KT13 in `docs/CORRECTIONS.md`, approved 2026-09-08 (the base layer now carries `[hidden] { display: none !important }`, held by `tests/hidden.spec.mjs`). Kenny signed the third compare page off the same day (R7b Akkoord). His V2 answer: synthwave next, C6 after it — and his P1 answer approved the five synthwave milestones SW0–SW4, AFK, one ratification report at the end. **The synthwave concept demo** "Outrun Horizon" was built the same day on the approved demo's structure and the §25 research (the striped sun by Argyle's mask rule, the conic-gradient floor with three horizon glows drifting one cell per 6 s, chrome type with one tracking wipe and one shine, the neon tube that switches on with two dips at 1.8/s, the two-colour inset vignette, the horizon as divider, square buttons with the sun cut, the pink→cyan stripe, VT323 OSD labels, the boot line with a skip once per session; no CRT flicker, pink text only as #ff7edb, Google fonts only), published at <https://claude.ai/code/artifact/78b7076b-a1d1-4a48-847f-7667c4c34722> and **approved by Kenny in the conversation** ("Prachtig, deze demo is exact wat ik verwacht qua kwaliteit"). Building it found KT13's fault a second time: the demo's own button frame (`display: inline-flex`) beat the `hidden` attribute on the close button; the demo carries `[hidden] { display: none !important }` since. |
| SW0 | **built** 2026-09-08 (AFK). `themes/synthwave/tokens.json` — the void `hsl(263, 89%, 7%)`, the tape card, hot pink `hsl(341, 100%, 64%)` as primary (one step lighter than the demo's `#ff2a6d`, because `--link` is the primary and reads on the card at 4.98 where the reference pink failed at 4.22), cyan, laser, lavender; the hero as deep indigo with the pink that reads as text; `themes/order.json` after cyberpunk; `anatomy.md`; the hooks rows (surface, mark = tube, headline = tracking, rule = laser, divider = horizon, arrival = boot). The contract grew to **94 tokens**: `theme-font-mono`, declared by all 25 themes in the same change (S47) — generic stacks where a theme has no mono face of its own, so nothing visible moved for the 24. Parity 100%, contrast 49 pairs, invariants 175 checks, the DI table regenerated, 25 HA themes, 25 fixtures, 25 stories, the `Theme` union at 25. |
| SW1 | **built** 2026-09-08 (AFK). `css/synthwave-register.css` (1,5k lines) from the approved demo, in the package's vocabulary and DI9's discipline (every colour a token or a relative colour of one): the sky ramp on the section with every stop dark enough for lavender (the contrast test takes every gradient stop as a ground), the striped sun by Argyle's mask rule on `::before`, the floor on `::after` (conic-gradient, `rotateX`, three horizon glows, one cell per 6 s), the two-colour inset vignette, chrome type with the 50/51 break, the tube, the laser, the horizon as CSS-only divider (no generator: the simplest thing that works), the flat bar with the pink→cyan stripe and the `▾` dropdown prefix, square buttons with the sun cut, OSD labels, the tape card with the stripe and the tracking-noise redactions, one answer per component root (**56 of 64, 8 helpers excused, 0 pending** — the coverage gate now measures every register), the VHS screen-door at exactly 0.06. Seven keyframes in `TIMINGS`, three listed out of scope with a reason; the tube dips once (2.7/s). `check-register-coverage` and `compliance.mjs` widened to every register; `gates/config.json`, the exports, the checksums, the fixtures, the showcase, the site chrome, the compare frames and `tests/bare.spec.mjs` carry the third register. |
| SW2 | **built** 2026-09-08 (AFK). `js/effects.js`: the headline routine `tracking` (the text stays whole; `is-tracking` for one wipe, `is-shine` for one sweep, then rest — class changes and event fallbacks by the table's durations), the tube and the laser on the existing emphasis and rule mechanics, and the sixth hook **arrival** (`--kp-arrival` on the root, in `themes/hooks.json` with a quiet default): `boot` builds the overlay the register paints — a line counting up in the OSD face, a Skip button, the CRT switching it off in 550 ms — once per session by the memo, never under reduced motion, every word from `js/strings.js` (four new keys; the strings gate is what caught the first literal). Found while building: an init script's `MutationObserver` on `document.documentElement` throws before the root exists and silently installs nothing — the spec observes `document`. |
| SW3 | **built** 2026-09-08 (AFK). VT323 subset (6,9 kB) shipped with its OFL; Rajdhani now serves synthwave too; **Orbitron carries a Reserved Font Name** (`OFL.txt`: "with Reserved Font Name: Orbitron") and joins the R6-Q1 six — it ships under the renamed delivery Kenny chose, at C6, with Share Tech Mono; until then the display face falls back through the stack. The fonts gate is green on 25 families; the mono token is what made VT323 a family a theme names. |
| SW4 | **built** 2026-09-08 (AFK). `tests/register-synthwave.spec.mjs`: ten tests in both channels and both browsers — the boot once per session and its Skip, no boot under reduced motion, the striped static sun and the drifting floor, the horizon's 2px line and receding grid, the chrome headline through tracking then shine ending as its own text, the tube on with dark glass while armed, the laser from the centre, the stripe on a hovered link and the sun cut on a hovered button, the OSD label with VT323 loaded and the noise clearing on the trigger, the approved inventory whole (S46). Three drills red and restored: the sun's mask removed, `--kp-arrival: boot` removed, the tube's rest glow removed. The compare page says what a theme 4.0.0 never had is: "new in 5.0.0", nothing marked. `examples/concept.html?theme=synthwave` is the page Kenny opens. |
| SW gate | **Ratified by Kenny 2026-09-08**: SW0–SW4 all Akkoord on the compact report (five items, one screen). C6 opens, not AFK. |
| Demo gate (rows 2–5) | **Approved by Kenny 2026-09-08**, one form, all four Goedkeuren: phantom "Calling Card" (<https://claude.ai/code/artifact/d1e3cd84-a45e-4968-93f2-10db76b2cd93>), retro "Bevel 95" (<https://claude.ai/code/artifact/be19a3dc-f31c-408d-b9ce-ebc0db1b1cc5>), terminal "Green Phosphor" (<https://claude.ai/code/artifact/d91bbe81-06f1-4c92-b870-230a4acfa14f>), brutalism "Hard Copy" (<https://claude.ai/code/artifact/c998927d-9e61-46ff-8fa7-672d6f90fae1>) — four Opus agents in parallel on Kenny's request, each verified headless by its agent (0 console errors, 320 px, contrast computed, DI5, reduced motion). His D5 answer: **one after another, AFK, one ratification** at the end, in the lift plan's order, then `5.0.0-alpha.2`. Two notes from the same day: the demos' wipe button changed its own label — the package's concept page already asks through the confirmation dialog (DI10), and every next demo is briefed to build a dialog; and the copy "93 tokens" / "Twenty-four themes" is corrected at integration. |
| Demo gate (rows 6–24) | **Answered by Kenny 2026-09-08**, one form, nineteen Sonnet demos: sixteen Goedkeuren (pastel, deco, sepia, academia, mono, grotesk, high-contrast, formal, shade-light, solstice, nostromo, light, ticker, shade-dark, and forest, woodblock and lapis with a rename — forest becomes **forest**, woodblock and lapis get a better name Claude proposes); blueprint **Herschrijven** (the frame overlapped the headline, the plain buttons unreadable on hover, the background weaker than the 3.x grid, nothing next level; the colours and the text typography praised); dark a second version with a clearly visible starfield beside the first, for comparison. **The common finding (KT14):** none of the nineteen styled the nav dropdown, where brutalism's and synthwave's demos had — opening it pulled him out of the theme; the approved demos pass as they are, every register styles `.kp-nav__menu`, and the coverage gate refuses one that does not. Academia's nav CTA label was invisible (gold on gold, link specificity) and fixed before publishing. |
| KT14 + names gate | **Answered by Kenny 2026-09-08**: KT14 **Klopt** (the dropdown gate stays; the measurement closes at TM1, whose commit hook ran it green; CLAUDE.md carries the project rule); blueprint v2 **rewritten again** ("far too bulky — sleek with fine lines"; the animation fine; the dimension line must span what it measures; the dropdown still read as unthemed); dark's starfield **tried again** (too present, on a lattice, and the bright stars want the JWST eight-pointed spikes, subtly); woodblock **reworked** to actually read as a woodblock print before its name is chosen; lapis → **lapis** and forest → **forest**, both at their lift. Three Sonnet agents in parallel, one form after. |
| PH0 | **built** 2026-09-08 (AFK). Phantom's tokens already matched the demo (the red at `hsl(355, 100%, 58%)` as the plate, the deep red as the sidebar, the signal yellow as `--fx-signal`), so the contract did not move; `themes/phantom/anatomy.md` rewritten with the register's answers; the hooks rows (surface, mark = slab, headline = shout, rule = rail, divider = the tear, arrival = card). |
| PH1 | **built** 2026-09-08 (AFK). `css/phantom-register.css` (1,5k lines) from the approved demo, in the package's vocabulary and DI9's discipline: the halftone and the scan as a static texture at the ceiling, the hard black shadow with one red offset on every surface heading, the `#slash` silhouette on the hero (a clip-path, shoved in once on arrival), the torn-paper divider (three clipped plates, the second mirrored), the skewed bar behind every hover (nav, menu, footer, tab), buttons as key caps (a skewed plate on `::before` behind a straight label, the red fill bar on `::after`), the cut-paper popovers with the red edge arriving on a three-step film cut, the rotated stamp and the censor plates of the dossier, one answer per component root (**56 of 64, 8 helpers excused, 0 pending**). Four keyframes in `TIMINGS`, two listed out of scope with a reason; nothing loops. The register named the reference red in a comment and the layers gate refused it — the comment now says what it measured without the hex. |
| PH2 | **built** 2026-09-08 (AFK). `js/effects.js`: the word routines `shout` (phantom) and `slam` (brutalism, ahead of BR2) — every word in its own span with `--kp-i`, the register staggers them by `--kp-word-stagger`, the element ends as its text; `dissolve` (retro) and `type` (terminal) added in the same change so the three lifts that follow touch the module once; the second arrival routine `card` — the theme's name as the line (data, not copy: KT5 holds), a bar the register runs, the shove off to the left, once per session with Skip and never under reduced motion. `STATE` gained `words`, `dissolving`, `typing`; the typings follow. |
| PH3 | **built** 2026-09-08 (AFK). No new family: Barlow and Barlow Condensed were already shipped (no Reserved Font Name; the fonts gate stays at 25 families). |
| PH4 | **built** 2026-09-08 (AFK). `tests/register-phantom.spec.mjs`: nine tests in both channels and both browsers — the calling card once per session and its Skip, no card under reduced motion, the headline's words and its rest as text, the plate white while armed and black-on-red once cleared, the rail sweeping to red in view, the torn-paper divider with the second mirrored, the skewed bar on a hovered link and the key cap filling on hover, the stamp and the censor plates shearing off on the trigger, the approved inventory whole (S46). Three drills red and restored: the paper plate's clip-path removed, `--kp-arrival: card` removed, the armed fold removed. Two assertions were the test's own fault (a text-shadow split on the wrong delimiter; Firefox reports `attr()` unresolved on a pseudo-element) and were corrected before the drills. The compare page says phantom's register is new in 5.0.0. `examples/concept.html?theme=phantom` is the page Kenny opens. **CI found what the local run could not** (run 34182366044, browser job red, main held): `tests/surfaces.spec.mjs` measured the lede's marks and the primary buttons as black on black — the plate lived on a pseudo-element, which is invisible to anything that reads a text's ground (the test, an accessibility tool, forced colours). The plate is now painted twice: the skewed pseudo-element for the eye, and a narrower rectangle of the same red as the element's own background; the armed mark switches that rectangle by `background-size` after the slide, in no time, so KT8's mid-transition colour can never be read. The local run had covered the new spec only; the whole suite runs in CI by design, and the chain held main. |
| TM0 | **built** 2026-09-08 (AFK). Terminal's tokens already carried the demo's palette (the void, the phosphor, the bright plate, the dim, the yellow-green accent, the sanctioned red, the two greens of border and boundary), so the contract did not move; the brighter phosphor under pressure (DI3's opt-out) and the bezel's greys are relative colours of the tokens in the register. `themes/terminal/anatomy.md` rewritten with the register's answers, the cursor's move and the four places the package renders the demo differently on purpose; the hooks rows (surface, mark = inverse, headline = type, rule = dashes, divider = dashes, arrival = boot). |
| TM1 | **built** 2026-09-08 (AFK). `css/terminal-register.css` (1,3k lines): the glass on the root's own pseudo-elements (ekeijl's bezel as a border-image gradient, the sweep band once per ten seconds), the display without anti-aliasing and the bloom, the headline typing with the block caret the module appends, the mark as inverse video (armed: phosphor in a dim frame; one-step switch, KT8), the dashed rule typing itself out, the dividers of dashes with a plus at each end, the shell line with inverse-video hover and the bracketed cta, the TUI dropdown with the `>` pointer (KT14: the gate ran green on this register at its commit), brackets and plates as buttons, the wells with the block cursor in the box (R6-Q7), `[ ]`/`[x]`, the man page, the bracketed stamp and the character-cell redactions, the POST leaving through the tube collapse, one answer per component root (**56 of 64, 8 helpers excused, 0 pending**). Three keyframes of its own (`kp-sweep`, `kp-caret`, `kp-tube-off`) and `kp-rule-in` from the base layer; the two loops rated in TIMINGS. |
| TM2 | **built** 2026-09-08 (AFK). `js/effects.js`: the `type` routine had shipped at PH2; new is the **caret**: when the root declares `--kp-caret: block`, the module writes `--kp-col` on every text-like `.kp-field__input` on input, keyup, click, focus and select (the caret column in the field's own `ch`, clamped to its width; cleared on blur and on detach), and the register paints the block at that column — the cursor lives in the box at the caret and never after the label (Kenny, 2026-09-08, **R6-Q7 closed**). The base layer's blinking block after the label (3.1.1) is gone from `css/_rules.css`. `TIMINGS` gained `kp-caret` (1/s, one cell), `check-motion` lists it out of scope with its reason, `CARET_KNOB` is exported. |
| TM3 | **built** 2026-09-08 (AFK). No new family: Share Tech Mono ships renamed as `KP Tech Mono` since C6 (its licence reserves the name "Share"); the register names only the theme's own faces. The fonts gate stays at 32 families. |
| TM4 | **built** 2026-09-08 (AFK). `tests/register-terminal.spec.mjs`: ten tests in both channels and both browsers — the POST once per session in the bloom and its Skip, no boot under reduced motion with the sweep resting above the glass, the headline typing glyph by glyph with a painted caret and ending as its own text in the bloom, the mark in phosphor inside a dim frame while armed and void on phosphor once landed, the dashed rule in twelve steps, the two dividers with their plus signs (the second doubled), inverse-video hover and the bracketed cta and ghost, **the cursor in the box** (a background layer at the module's column, the native caret aside, no cursor after the label, Home to column 0, blur clears it), the bracketed stamp and the cells clearing off, the inventory whole (S46). Three drills red and restored: `--kp-caret: block` removed, `--kp-arrival: boot` removed, the armed inverse removed. `examples/concept.html?theme=terminal` is the page Kenny opens. |
| BR0 | **built** 2026-09-08 (AFK). Brutalism's tokens already carried the demo's palette (the paper, the ink, the signal yellow as `--secondary`, the signal red as `--fx-signal`, the 7% ink as `--border-strong`), so the contract did not move; the pressed plate is a relative colour of the token in the register. `themes/brutalism/anatomy.md` rewritten with the register's answers and the places the package renders the demo differently on purpose; the hooks rows (surface, mark = plate, headline = slam, rule = bar, divider = marquee, no arrival — printed matter does not boot). |
| BR1 | **built** 2026-09-08 (AFK). `css/brutalism-register.css` (1,2k lines): the knobs (`--kp-line: 3px`, `--kp-drop: 6px`, the shadow and the lifted shadow, the pixel outline of four box-shadows, the hatch), the headline in Archivo Black slamming word by word, the mark as a plate (armed: the words on the paper, no plate; one-step switch, KT8), the six-pixel bar under a heading, the marquee divider (a strip twice the band translating -50%, the second reversed on the yellow band), the strip with the yellow plate on hover and the lifting cta, the dropdown as a plate with the line and the shadow (KT14), buttons and fields as plates with the shadow, the two-channel ring composed in front of the shadow (AR30), the tilted stamp and the ink bars sliding off the dossier, one answer per component root (56 of 64). Two fixture tests bit before the push: the three sizes were equal because the register set `min-height` on `.kp-button` (now the hero row only), and the ring was half because the register transitioned `box-shadow` and AR30's test reads the ring the instant the theme changes (the shadow now switches at once; only the lift moves). |
| BR2 | **built** 2026-09-08 (AFK). `js/effects.js`: nothing new — `slam` shipped at PH2 (the word spans with `--kp-i`), the marks and the rule are the module's standard hooks, and the register declares no arrival, so `arrival()` does nothing under brutalism. `kp-marquee` and `kp-slam` have their rows in TIMINGS. |
| BR3 | **built** 2026-09-08 (AFK). No new family: Archivo Black and Archivo were already shipped (no Reserved Font Name; the fonts gate stays at 32 families). |
| BR4 | **built** 2026-09-08 (AFK). `tests/register-brutalism.spec.mjs`: nine tests in both channels and both browsers — no arrival and every reveal at rest under reduced motion with the marquee standing still, the headline's words slamming in and the element ending as its own text in Archivo Black, the mark on the paper while armed and the yellow plate with the line once landed, the six-pixel bar in the ink drawn in by `kp-rule-in`, the two marquee dividers (a strip twice the band, 42 s, infinite, the second reversed on the yellow band), the yellow plate on a hovered item and the cta lifting -2px away from a shadow that grows to 8px, the plates with the line and the shadow and the pixel outline on a label, the stamp rotated -7° in signal red and the ink bars sliding off on the trigger, the approved inventory whole (S46). Three drills red and restored: the marquee strip's `inline-size: 200%` removed, the armed plate removed, the cta's lift removed. `examples/concept.html?theme=brutalism` is the page Kenny opens. |
| S49-1 | **built** 2026-09-08. The words: `showcase/concept-copy.mjs` (ninety slots × five themes, taken from the approved demos), `conceptBody(copy)` in the descriptor, one generated page per theme with an approved demo, the React channel on `?copy=<theme>`, the four register specs repointed, and a unit test that holds the slot shape and refuses a page carrying another theme's headline. The boot words move into the dictionary as `arrivalLinesByTheme`, and the arrival routine grows a lines mode with a `{count}` that counts and a segmented bar a theme may ask for. |
| S49-2 | **built** 2026-09-08. The values and the faces: retro's lit navy, terminal's panel, popover, footer ground, well, typing speed and its two flat hot colours (the pair joins the contract as `--fx-hot`/`--fx-hot-alarm`, all 25 themes, S47, derived per theme in the direction that theme moves under pressure), brutalism's dot grid and `oklch` hover step, the demos' own fallback stacks, and Barlow Condensed Black Italic and ExtraBold Italic subset from google/fonts so phantom's headings are the face rather than a synthetic oblique. The texture ceiling is per theme in `gates/config.json`; phantom carries the demo's three layers and its own 0.14, reported against DI9's 0.06 (S42). |
| S49-3 | **built** 2026-09-08. Retro's chrome: the desktop on the root and the window on the body, the three window controls drawn in gradients (a glyph in `content` is copy, KT5), the resize grip, the spec sheet's groove well, the fieldset's two hairlines as four inset shadows, and the selection that drags its own white words in with the bar (the module writes a mark's text to `data-kp-text`). Reported as not reproducible without markup: the spec sheet's three tabs and fieldset legend, and the status bar's second NUM panel — the concept page's structure is the same for every theme (S46). |
| S49-4 | **built** 2026-09-08. The rules that yielded, each per theme and each still measured: TH111 amended (the sizes separate in height or, where a demo pins one, in type and padding); AR30's reader accepts either channel order and still refuses one channel or one colour twice; KT8 yields for brutalism's hover transition and for retro's and terminal's own combo button and selection-bar highlight, with the reason beside each exception. Phantom's field ring has both channels again. |
| S49-5 | **built** 2026-09-08. Phantom's skewed button, decided on the comparison page that measured both hit areas (<https://claude.ai/code/artifact/1c9f9128-a9fe-4e49-bf90-beb3bb627791>): Kenny chose the demo, so the element carries the skew and the label is set upright again on `.kp-button__label`, a span both channels write and every other theme ignores. The plate on `::before` inherits the element's skew rather than adding its own, and the spec assertion moved from the element to the label — drilled red and restored. |
| R6-RAT | **ratified** 2026-09-08. The combined ratification of PH0–PH4, RT0–RT4, TM0–TM4, BR0–BR4 and S49-1 … S49-5: Kenny answered R1 to R8 "Akkoord", chose the yellow plate for brutalism (the demo's own rendering), approved blueprint's fourth demo, and held the tag — `main` moves, `v5.0.0-alpha.2` waits until the remaining nineteen themes are lifted. His instruction with it: lift every other theme first, with the progress shown at each step. |
| RT0 | **built** 2026-09-08 (AFK). Retro's tokens already carried the demo's palette (the chrome at 75%, the card and the popover as face and window, the navy, the teal, the maroon), so the contract did not move; the one colour the demo used that no token names — the teal as a label's ink, 15% — is a relative colour of `--accent` in the register, because the token at 20% measured 3.69 as text on the chrome (found by `tests/surfaces.spec.mjs` before the push, 5.32 after). `themes/retro/anatomy.md` rewritten with the register's answers and the four places the package renders the demo differently on purpose; the hooks rows (surface, mark = select, headline = dissolve, rule = groove, divider = the groove, arrival = boot). VT323 lists retro among its themes in `fonts/families.json`. |
| RT1 | **built** 2026-09-08 (AFK). `css/retro-register.css` (1,5k lines): the 3.1.0 bevel rules kept and refactored onto three knob stacks (`--kp-raised`, `--kp-pressed`, `--kp-sunken`) with the navy pair for the default button, the title-bar ramp ending on the sidebar's lit navy (the reference ended on a blue where white measured 4.01, S42), the headline in ink with a hard white shadow on a surface (the 3.x title bar behind h1 stays the base layer's), the dither the headline clears out of, the selection bar as `<mark>` painted on the element itself (the plate on `::before` drags over the ink and returns to nothing as the element's own bar switches on — a size and the ink in no time, KT8), the groove as rule and as both dividers, the brand as title bar, the selection bar behind every hover, the raised cta, the raised menu with the hard drop shadow, the navy bevel and the one-pixel ink ring, the flat toolbar ghost, the embossed disabled label, the wells with the painted combo button and the pixel tick, the Notepad dossier with the read-only stamp and the dither brush, the lifting tab, Explorer's column headers, the segmented progress bar, the checkerboard scrollbar track, the POST overlay, one answer per component root (**56 of 64, 8 helpers excused, 0 pending**). Four keyframes in `TIMINGS` (two rated 1.00/s, two transforms out of scope with a reason), `kp-rule-in` reused from the base layer with `steps(12)`; nothing loops, nothing eases. |
| RT2 | **built** 2026-09-08 (AFK) — ahead, at PH2: the `dissolve` routine (`is-dissolving` while the dither clears, rest by `kp-dither-clear`'s animationend or the table's duration) and the `boot` arrival reused from synthwave (the dictionary's line, Skip, the overlay off by the register's own `kp-dither-out`). No module change in this milestone. |
| RT3 | **built** 2026-09-08 (AFK). No new family: Pixelify Sans and Instrument Sans were retro's, VT323 shipped with synthwave (no Reserved Font Name); the register names it as `--kp-dos` and `fonts/families.json` records retro as a user. The fonts gate stays at 25 families. |
| RT4 | **built** 2026-09-08 (AFK). `tests/register-retro.spec.mjs`: nine tests in both channels and both browsers — the POST once per session in the DOS face and its Skip, no boot under reduced motion with every reveal at rest, the headline covered by the dither while armed and ending as its own text under the white shadow, the mark in ink while armed and white on navy once selected, the groove drawn in twelve steps on entering the viewport, the two grooves (8px dithered, 2px plain), the ramp on the brand and the selection bar on a hovered item and the four-inset bevel on a button with the navy on the default one, the stamp rotated -8° and the dither brush lifting off on the trigger, the approved inventory whole (S46). Four drills red and restored: the divider's dithered band removed, `--kp-arrival: boot` removed, the armed dither removed, the dissolve animation removed. **One drill stayed green first** (KT3): with the armed dither rule removed the headline test still passed, because the animation's own first frame paints the same full dither the armed rule does and the capture could not tell them apart — the test now probes the armed rest state by taking `is-deciphered` off the rested element and asks the capture for a conic density only the ladder produces; both drills are red since. The surfaces test found the label teal at 3.69 before the push (RT0). The compare page says retro's register changed rule for rule. `examples/concept.html?theme=retro` is the page Kenny opens. |
| C6 | **built and ratified 2026-09-08**: Q1 delivered renamed (seven families; `KP <Family>` was not available under the OFL, so the names avoid the reserved word — Kenny approved them), Q3 struck, Q6 recorded, MIGRATION.md's 5.0.0 section, README and USER_GUIDE (fonts, the six hooks), the version `5.0.0-alpha.1` with a pre-release-aware `compareVersions`, the ecosystem entry; all six items Goedkeuren. **R6-Q2 decided on the compare page: dark to 0.06** — the base rule changed, the pending list is empty, the proposal pair is gone. Kenny's remark on the page: dark's left frame wore formal — the 4.0.0 module applies the stored theme after the frame script; the frame now holds the query's theme (test added). The alpha tag follows on the verified main sha.  **Tagged:** `v5.0.0-alpha.1` on `ab8187b` (main, both CI jobs green), the draft release built by release.yml with eight assets (components.css, fonts.css, fonts.tar, kp-themes.css, kp-themes.js, MIGRATION.md, SHA256SUMS, themes.css) — publishing is Kenny's. **Next:** the remaining themes one round at a time (S48), their concept demos built in parallel by Opus agents on Kenny's request (phantom, retro, terminal, brutalism first). |

### Round six — the AFK queue

Ratification rounds accumulate here (R6-1, R6-2, …) with a "deliberately
not done" list; the whole queue is presented as one form at C5.

**Deliberately not done, Kenny-only:** publishing the alpha release;
anything that changes chassis-rs, kyu, almanac or JobTracker; the
round-three Phase 10 form and the dev-procedure commit that waits on it.

| Item | Found at | What Kenny decides |
| --- | --- | --- |
| R6-Q7 | Kenny, 2026-09-08, during C6 | **Terminal's blinking cursor sits in the wrong place.** Kenny asked (3.1.1) for the cursor on the active field only — right — but it must blink inside the input box, not after the field's label as it does now. To fix when terminal is lifted (LIFT_PLAN row 4), not before: a released theme never changes in place (S20). |
| R6-Q1 | C0, the fonts gate | Six families the research chose declare a Reserved Font Name under the OFL — Share Tech Mono, Source Sans 3, Lora, IBM Plex Sans, IBM Plex Mono, Josefin Sans — and a subset is a Modified Version that may not carry that name. Three ways out: ship them unsubset (whole files, the budget gate says whether they fit), ship a subset under a renamed family (`KP Share Tech Mono`, the OFL's own remedy), or ask the authors for permission. C4 ships the unaffected families either way; the six wait for this answer.  **Answered by Kenny 2026-09-07 ("Hernoemd leveren"), built at C6 2026-09-08:** seven families (the six plus Orbitron) ship as renamed subsets — `KP Tech Mono`, `KP Deco Sans`, `KP Academia Serif`, `KP Ticker Sans`, `KP Ticker Mono`, `KP Shade Sans`, `KP Outrun Display` — because the OFL forbids the reserved word even as part of a new name (FAQ 2.7), so "KP <Family>" was not available; `gates/rename-font.py` rewrites the name records at build and `check-fonts` reads every woff2's name table (`gates/woff2-names.mjs`), drilled red twice. The tokens name the new family first and the original after it. |
| R6-Q2 | C0, the DI9 gate | DI9's ceiling of 0.06 was written at round one and enforced by nothing until now. Measured against it, `dark` paints its texture at 0.5 and `cyberpunk` at 0.55 — both approved by eye, both far over a number nobody measured. Either the ceiling is wrong (it was meant as coverage, not layer opacity) or the two textures are; the gate holds both as pending at their measured value until Kenny says which. C2 rewrites cyberpunk's anyway.  **Decided by Kenny 2026-09-08 on `compare-dark.html` ("Naar 0,06"):** dark paints at the ceiling since; the pending list is empty. |
| R6-Q3 | C0, the concept page | AR42 says the concept copy comes from `js/strings.js`; the page is built with literal copy like its ten siblings, because the strings gate scopes to `js/` and `components/` and a generated example page has never spoken through the dictionary. Recorded as a deviation from AR42 rather than fixed silently: the clause is either dropped from AR42 or every example page moves to the dictionary.  **Answered by Kenny 2026-09-07 ("Clausule schrappen"), done 2026-09-08:** AR42's copy clause is struck with a dated amendment. |
| R6-Q5 | C1, reading C0's CI | **A live-found process fault, Claude's own.** C0's commit `b6c5e5e` was pushed to `main` after the push chain reported CI green; CI was not green. The `gates` job passed and the `browser` job failed on one assertion (`tests/overflow.spec.mjs` still expected ten example pages), and the chain read the exit code of `gh run watch` — which had been moved to the background at its timeout and reported 0 — instead of the run's `conclusion` per job. Found at C1 when the whole browser suite was run locally before the push. Fixed in the same commit as C1's test fix, and the chain now reads `gh run view --json conclusion,jobs` for the sha and refuses to move `main` unless every job says success. Standing rule 36 was followed to the letter (wait on the checks of that sha) and still let this through, because it does not say which signal counts; a correction form is Kenny's (rule 29), queued here for the C5 report. **Closed 2026-09-08:** the correction is KT12 in `docs/CORRECTIONS.md`, all nine fields approved; field 7 was measured on `a02d31f` (the chain held `main` on a red browser job) and branch protection on `main` now requires both jobs. |
| R6-Q6 | C4, the fonts budget | woodblock names two Japanese families; with a regular and a bold face each at the JIS level 1 subset it weighs 2.37 MB against `fontsBudgetBytes` 1.5 MB (AR39). Shipped now: the regular faces only, 1.2 MB, bold synthesised by the browser. Kenny decides: raise the budget for the CJK themes, accept the synthesised bold, or drop one of the two families from the theme.  **Answered by Kenny 2026-09-07 ("Synthetisch vet accepteren"), recorded 2026-09-08** in MIGRATION.md's 5.0.0 section as a known limitation. |
| R6-Q4 | C0, Kenny's message | The compare page, MR-R6-COMPARE: 4.0.0 on the left, the current build on the right, for the theme in the query. Kenny asked for it during C0; it is recorded in `docs/MINI_ROUNDS.md` and built at C5. Nothing to decide unless the vendoring of the 4.0.0 stylesheets under `showcase/baseline/4.0.0/` is not what he meant. **Reopened 2026-09-08 on Kenny's second reading of the rebuilt page:** all 24 sections were visible (`.kp-stack`'s `display: flex` beats the `hidden` attribute, and the test checked the attribute, not the paint), and a theme whose only difference is typography showed a near-empty frame. His answer to the demo page (R6b) is Akkoord; the compare page is rebuilt on his V1 answer — one page per theme, the whole demo on both sides, the differing sections marked — and the visibility fault gets its own correction form after the rebuild. |

## Round seven — the build order (2026-09-11)

Kenny chose the order on the scope form: repairs first, then the themes,
then the removals. What follows is that order written out, one stage at a
time. Every stage runs `npm run gates` at its commit and the specs it
touches; the whole browser suite stays Kenny's, with the standing
agreement that Claude asks for it in a form before a release.

**Stage 1 — the six pieces the element list calls essential.** They come
first because three of them repair something that is broken today rather
than adding something missing, and because all six touch every theme, so
anything built after them lands on a floor that is already right.

| # | What | Why it is first |
| - | ---- | --------------- |
| 1.1 | the scroll offset, and smooth scrolling behind a knob | The package has zero occurrences of `scroll-behavior`, `scroll-padding` or `scroll-margin`. Every page carries a skip link; the moment anything is sticky, that link lands underneath it and the person using it cannot see that it did. |
| 1.2 | a navigation bar that can stay at the top | Zero occurrences of `sticky` anywhere in `css/`, `js/` or `components/`. Nothing in this package stays put while the page scrolls — not a bar, not a table header. |
| 1.3 | a navigation that collapses on a narrow screen | No toggle of any kind exists. Today the links simply wrap, and on the demo at 462 px the chrome grew to 229 px tall before any of the page was visible. |
| 1.4 | the side navigation that can be hidden | Built, then withdrawn on 2026-09-11 in favour of 1.7: the same reader's need, answered by a component a theme can style instead of by a layout class that none can. |
| 1.5 | a back-to-top control | Nothing like it exists; it depends on 1.1 for where it lands. |
| 1.6 | a component for a hero image | Of the component roots the package declares, not one is for a picture. |
| 1.7 | the side navigation as a component | Added on 2026-09-11 after Kenny looked at 1.4 and asked whether it was a proof of concept. Measured: `grep -l "kp-sidebar" css/*-register.css \| wc -l` gives 0, and the register-coverage gate reads its roots from `css/components.css` — so no theme had ever been asked to style a sidebar, because it was never a component. Built to the feature list he named. |

**Approved and waiting for stage 2.** Kenny approved the side navigation as nostromo, brutalism and pastel draw it — the bullet stepping in front of the active page, the plate sliding to its own shadow, the sticker set at an angle. They are not written into their registers yet, and cannot be one at a time: the coverage gate's pending list is one entry per root for all twenty-five themes, and it refuses an entry a register already covers. So all twenty-five land together where the quirks are decided, which is the order he chose.

**Gate log — stages 1.1 to 1.3, reported 2026-09-11.** The report Phase 6
asks for, given late: these three closed on commits and the gate came
afterwards, which is the fault recorded as `fix-6`. Kenny signed all four
criteria.

| Criterion | Evidence | Outcome |
| --------- | -------- | ------- |
| The bar that stays put, and the anchor that clears it | 2 tests in `tests/sticky.spec.mjs`, both measuring the painted box; drill run in two halves, each turning exactly the other test red at `1238 passed, 1 failed` | Akkoord |
| The navigation that folds into a toggle | 6 tests in `tests/nav-toggle.spec.mjs`, three per channel, one suite driving both; drill `1240 passed, 4 failed`, restored `1244 passed` | Akkoord |
| Registry coverage | Smooth scrolling was rated essential, built, and covered by nothing: `grep -rn "scroll-behavior" tests/` returned one hit and it was a comment | Akkoord, gap accepted — **and then closed**: 2 tests added, `1246 passed`, drill `1245 passed, 1 failed` with the reduced-motion guard removed |
| Deviations | A test deleted rather than reworded after its drill stayed green; the knob count 87 → 89; one bare playwright run and the false diagnosis that followed it; a form claiming a correction record that did not yet exist | Akkoord |

**What the gate earned.** The coverage item found the missing test, which
nothing else would have: the other two criteria were fully covered, every
gate was green, and the feature worked. That is the argument for the gate
that skipping it had quietly disproved.

Kenny's order for what follows: close the gap first, then the sidebar.
The gap is closed.

**Gate log — stage 1, closed 2026-09-11.** The report Kenny asked for as
one, covering 1.5 and 1.6 and the stage as a whole. He signed all four
items.

| Criterion | Evidence | Outcome |
| --------- | -------- | ------- |
| The six essential pieces, plus the component that grew out of them | 1.1 to 1.3 reported separately; 1.4 built and then withdrawn in favour of 1.7; 1.5 and 1.6 delivered with five tests, drilled in one pass at `2 passed, 3 failed`; 1.7 with nine tests and six drill passes | Akkoord |
| Registry coverage | Four roots wait for stage 2 in `gates/register-pending.json`, each with its reason and each refused by the gate the moment a register covers it. `gap-8` (two untouched detaches) and `gap-9` (why the far edge stuttered was never measured) are in the queue | Akkoord |
| Deviations | Three non-theme colours added to the DI9 exception list for the overlay caption; the worker cap; the picture frame having no width of its own; the back-to-top control aiming at the document rather than the main landmark | Akkoord |
| How much gets tested | Measured rather than argued: 1293 tests in 75 files, 3.6 seconds for one file against 3.5 minutes for the affected set, which falls back to everything on any stylesheet or module change. Kenny chose the rhythm over the count | Minder vaak draaien |

**What stage 1 cost and what it caught.** Eleven defects, of which eight
were in code already committed and pushed: the stale announcement, the
covered toggler, the spurious event on attach, the sideways scroll, the
box-sizing on the rows, the panel giving away its width, the offset
reading the wrong number, the backdrop covering a page nobody asked
about. Two of those were found by Kenny looking at a page, and the rest
by tests written afterwards. Twice the drill caught a test measuring its
own scaffolding — once asking whether a panel was wider than 100px, once
comparing two numbers that happened to be equal.

**Stage 2 — the themes.** Titanium is added; dark is replaced outright by
the spectral instrument; nine themes get the quirk settled for them in
[THEME_VERDICTS.md](THEME_VERDICTS.md); blueprint takes the measurement
frame from the command table. Lapis waits on its second proposal.

**Stage 3 — the removals.** **Done, 2026-09-12.** academia, mono, ticker
and woodblock left the set: four theme sources, four registers, four
register specs, their concept pages, showcase fixtures, Home Assistant
themes, site stories, hook rows and concept copy. Six font families went
with them — Lora, Cormorant Garamond, IBM Plex Sans, Zen Kaku Gothic New,
Shippori Mincho and Inter Tight, 2.78 MB over twelve faces. IBM Plex Mono
stayed, because dark names it now.

`docs/ADOPTION_PROMPTS.md` says plainly, in both consumer prompts, that
the four are gone in 6.0.0. Telling the consumers themselves is Kenny's,
at the tag.

Two things came out of doing it. The sweep that stripped the register
mentions walked into `.claude/worktrees/` and rewrote 138 files across
sixteen other sessions' checkouts, all restored and recorded as `fix-14`.
And dark's `--theme-font-mono` had been pointing at `'IBM Plex Mono'`
since the day it was written, which is the UPSTREAM name: that family
declares a Reserved Font Name, so the package ships it renamed as
`'KP Ticker Mono'` and dark had been falling back to the system monospace
all along. Found only because the removal made the family look orphaned.

**Not in any stage:** counters are wanted rather than essential and land
if the stages above leave room; carousels are refused; an icon set is a
round of its own.

## The Phase 6 gate, signed 2026-09-12

Kenny answered all five items **Akkoord**: the repairs, the themes, the
removals, the coverage and the question of going on.

The evidence the gate carried: ninety-six commits since the last round,
twenty-two themes and twenty-two registers, thirty-three gates in the
chain all green, 102 unit tests and 1,257 browser tests in firefox, and
five queue rows open of which none is Claude's. Four corrections opened
and closed during the round — `fix-11` through `fix-14` — each with a
gate or a test holding it and each driven red before it was allowed to be
green.

The visible surface went with it, as the procedure requires: screenshots
of the two new themes and four of the six hover gestures as the package
paints them. Gates measure what is measurable; whether a thing looks like
what it claims to be is seen only by a person.

**What is deliberately not built**, recorded at the gate rather than
discovered later: lapis never got the second proposal it was waiting for
and has no hover gesture, because the measurement did not put it among
the six. Counters were "wanted if there is room" and there was none.
Carousels are refused and an icon set is a round of its own.

Round seven now enters **Phase 7**, hardening.

## The Phase 7 gate, answered 2026-09-12

Nine gaps went to Kenny. **Eight are to be closed; one is deferred.**

| Gap | What | Answer |
| --- | ---- | ------ |
| `grotesk-press` | grotesk's plain button paints the same hovered and held down | Dichten |
| `focus-ring` | light, shade-light and shade-dark paint one half of the ring | Dichten |
| `blueprint-width` | blueprint's buttons overflow by six pixels at 320px | Dichten |
| `readout` | `.kp-button__readout` is styled by two registers and rendered by no page | Dichten |
| `data-surfaces` | six data surfaces and five browser hooks, ~130 register rules, no paint test | Dichten |
| `sidenav-react` | the sidenav ships one channel where the frozen bar asks for two | Dichten |
| `gone-themes` | the frozen list still describes four removed themes; one bar is unreachable | Dichten |
| `counters` | counting numbers are on the list, unbuilt and unclosed | Dichten |
| `second-engine` | the whole round's evidence comes from firefox alone | Later |

Kenny chose to close two that came recommended as Later — the React
sidenav and the counters — which lengthens the round by the two largest
pieces of work in the list. `second-engine` is the one deferral: both
engines run after this release rather than before it, so the round ships
on one engine's evidence and that goes verbatim into `docs/TEST_PLAN.md`.

### What closing them produced, 2026-09-12

Six of the eight closed, each driven red before it was allowed green.

| Gap | What was built | Where |
| --- | -------------- | ----- |
| `grotesk-press` | `:not(:active)` on the hover, and a gate that refuses a hover outranking its own press | `css/grotesk-register.css`, `gates/check-pressed-state.mjs` |
| `focus-ring` | the ring restored in front of three themes' elevation and inside two themes' menu item; two shadow layers at rest so the transition is well-formed | five registers |
| `readout` | the surface tested on a fixture of its own; the words are still Kenny's | `tests/fixtures/readout.html`, `tests/button-surfaces.spec.mjs` |
| `data-surfaces` | eleven surfaces on one page, eight sweeps over every theme | `tests/fixtures/data-surfaces.html`, `tests/data-surfaces.spec.mjs` |
| `sidenav-react` | the React channel, self-attaching with a way out, and a DOM-shape comparison of the two channels | `components/sidenav.jsx`, `tests/sidenav-react.spec.mjs` |
| `gone-themes` | dated notes on the four rows, the unreachable bar moved, and a gate holding the list to the shipped themes | `docs/FEATURES.md`, `gates/gates.test.mjs` |
| `counters` | `data-kp-count`, two knobs, a readable state, locale-driven parsing | `js/effects.js`, `tests/count.spec.mjs` |

Measured after: 106 unit tests, 1,367 browser tests in firefox over 79
files, 2,734 across both engines, thirty-two gates green. Two tests stay
red, and both are findings for Kenny rather than faults to repair.

### The last three, answered 2026-09-12

| Finding | Kenny's answer | What it took |
| ------- | -------------- | ------------ |
| `blueprint-lines` | the lines come inside | the gap changes sign; every button measures `189 in 189` where it measured `195 in 189` |
| `readout-words` | Claude's proposal | `READY` for dark, `PART 26` for titanium, the slot on every theme, and a gate holding words and registers together in both directions |
| `shade-light-muted` | muted at 46% | the token, plus an advisory that had become a gate by accident and a browser test that enforced the same floor |

Phase 7 closes with 107 unit tests, 1,343 browser tests in firefox over
79 files, thirty-two gates and nothing red. Eight of the nine gaps are
closed; `second-engine` is deferred and recorded verbatim.
