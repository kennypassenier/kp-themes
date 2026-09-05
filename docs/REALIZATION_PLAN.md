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
| R2 | Ticker, nishiki and the shade pair | TH68, TH69, TH67 | Same bar; ticker has no motion token above 0 and no flourish that changes luminance; nishiki's `--border-strong` is the 2px key-block line; shade ships as two names on one scheme, the light foreground at base01 | 3.1.0, after R5 |
| R3 | Enabling work for the desired pair, then the pair | TH86, TH87, TH72 (mono), TH71 (retro) | The seven status plates of mono are pairwise distinguishable with hue removed (the gate's deuteranopia simulation, plus a greyscale pass); the retro register loaded on the fixture leaves DI1 green on every control; both registers have been red once | 3.1.0, after R5 |
| R4 | The three remaining desired themes | TH73 (grotesk), TH74 (tazhib), TH75 (nostromo) | Same bar; tazhib's vermilion and nostromo's orange are plates, never text | 3.1.0, after R5 |
| R5 | **Assembly** | S21, TH63 at 24, README/USER_GUIDE/MIGRATION | A fresh clone builds and generates byte-identical output; the picker shows 24 themes in two groups and is operable by keyboard end to end; the showcase and Pages show all 24; every anatomy is linked from README; the tally in FEATURES reads what shipped; `SHA256SUMS` on the release | 3.1.0, after R5 |

After R5 the set stands at 24: thirteen light (formal, light, pastel,
topo, high-contrast, sepia, brutalism, shade-light, nishiki, mono, retro,
grotesk, nostromo) and eleven dark (dark, cyberpunk, terminal, blueprint,
solstice, deco, academia, shade-dark, ticker, phantom, tazhib).

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
| R2 | **built** 2026-09-05; awaiting the combined AFK report. Ticker, nishiki and the shade pair pass every gate (19 themes). Steered by the gates: nishiki's offer/rejected pair measured 6.3, 7.5 and 6.4 under deuteranopia until rejected became the one plate with ink on it (19.6); shade's canonical text colours failed AA on both grounds (4.13 light, 4.28 dark on the card) and were deepened or lifted; shade-light's card had to rise above the paper (DI6). Live-found by the DI11 reflow test in Firefox: an input's intrinsic width in a wide face pushed nishiki's fixture to 362 px at a 320 px viewport — fields and inputs now shrink inside their track (`css/components.css`, `.kp-field`, `.kp-field__input`, `.kp-datatable__search`). |
| R3 | **built** 2026-09-05; awaiting the combined AFK report. TH86: five `--chart-pattern-*` tokens (`none` in twenty themes, five SVG fills in mono) and a unit test holding mono's seven status plates at ≥ 1.25:1 pairwise — drilled: two plates set equal reads "draft and sent are 1.00 apart". TH87: `css/retro-register.css`, exported as `./css/retro-register`, in the layers gate, loaded by the showcase and fixtures together with the cyberpunk register; `tests/registers.spec.mjs` holds the painted boundary at 3:1 with the register on — the first drill (border-color transparent) stayed green because the test read rgba(0,0,0,0) as black, the test was repaired, the second drill went red. Mono and retro pass every gate (21 themes, 147 checks); mono's primary moved from 9% to 14% so the visited link clears the floor (11.3 → 12.7). |
| R4 | not started |
| R5 | not started |

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
| Round three Phase 5 | 2026-09-05 | six milestones kept as order of work, one release 3.1.0 after R5, Google Fonts in the showcase only, AFK from R0, enforcement unchanged, TH88 added | this document |
| AFK report L1-L10  | 2026-09-04 | L1, L3, L4, L8, L9, L10 signed off; L2, L5, L6, L7 answered "toon mij dit"; both queued deviations go to their own mini-rounds; Pages switched on | this document, `docs/MINI_ROUNDS.md`               |

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
