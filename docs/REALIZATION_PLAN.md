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

## Status

| Milestone | Status                                  |
| --------- | --------------------------------------- |
| L0        | **closed** 2026-09-04, all six report items signed off |
| L1        | built 2026-09-04, gate held for the AFK report |
| L2        | built 2026-09-04, gate held for the AFK report |
| L3        | built 2026-09-04, gate held for the AFK report; L3-EXIT queued |
| L4        | built 2026-09-04, gate held for the AFK report |
| L5        | built 2026-09-04, gate held for the AFK report |
| L6-L10    | not started                             |
