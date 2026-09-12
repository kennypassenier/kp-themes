# Operations runbook

There is no server here, no database, no process to restart and no
deployment that can be rolled back. `@kp-soft/themes` is a source: a
package of stylesheets and framework-free modules that consumers install
from a git tag or copy out of a release. So "operations" in this document
means the recurring procedures a maintainer performs **on the
repository** — regenerate, add a theme, move a token, run the checks, cut
a release — and nothing else.

Every procedure below is a numbered list with the real command on each
step and what a correct result looks like. Where a step can leave the
tree half-changed, the procedure says how to abort. A step that cannot
fail is not a step, and is not here.

Two documents sit either side of this one. [Troubleshooting](TROUBLESHOOTING.md)
answers "the page looks wrong". The debugging guide
([docs/DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md)) answers "a check said no,
what now" — when a gate refuses during a procedure here, that is where
the symptom tables are.

---

## 0 · The machine

Everything below assumes these three things. Check them once per clone;
they cost seconds and every later procedure rests on them.

1. **Node 26.** `.nvmrc` says `26` and `package.json` declares
   `"engines": { "node": ">=26 <27" }`.

    ```sh
    node --version
    ```

    Correct: `v26.x.y`. A different major will install a different
    dependency tree and the generated artefacts may not come out
    byte-identical.

2. **Dependencies from the lockfile.**

    ```sh
    npm ci
    ```

    `npm ci` and not `npm install` — this is what the release workflow
    runs (`.github/workflows/release.yml`), so a local run and a tag
    build see the same tree.

3. **The git hooks are active.** They live in `.githooks/` and are not
   installed by cloning.

    ```sh
    git config core.hooksPath
    ```

    Correct: `.githooks`. If it prints nothing, activate them:

    ```sh
    git config core.hooksPath .githooks
    ```

    `.githooks/pre-commit` executes `.claude/hooks/gates.sh`;
    `.githooks/commit-msg` refuses a message without feature IDs and
    calls `.githooks/check-ids.sh`.

---

## 1 · Running the checks: which command, when, and whose it is

Five commands, and the rule for each is Kenny's decision of 2026-09-09
with its amendments of 2026-09-10 and 2026-09-11. They are recorded in
`CLAUDE.md`; what follows is what the code does.

| Command                 | What it runs                                                                  | When, and whose                                                        |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run gates`         | 33 `check:` scripts, then the unit tests, then `prettier --check .` — 35 steps | every commit, by the hook. Seconds                                     |
| `npm run test:affected` | the specs the change touches, Firefox only                                    | once before each report and each commit                                |
| `npm run test:browser`  | `playwright test` — the whole suite, both engines                             | **Kenny's to authorise.** Before a release Claude asks in a form       |
| `npm run advice`        | contrast, motion, the DI5 report, texture, the invariants                     | when Kenny wants the reading                                           |
| `npm run verify`        | gates, then the whole suite, then the advice, with a banner per phase         | before a release, on his go                                            |

Three things about that table are not style, they are code:

- **The gates chain and the hook are held together by a test.** `gates.test.mjs`
  asserts that every `check:` script appears in `npm run gates` **and**
  in `.claude/hooks/gates.sh`, and that `.github/workflows/release.yml`
  runs `npm run gates` (`gates/gates.test.mjs`, the test named
  `KT7: every check script runs in the gates chain, in the hook, and CI runs the chain`).
  Adding a gate therefore means three edits, not one, and the unit tests
  say so on the next commit.
- **The advisory checks never refuse.** `npm run advice` separates its
  five checks with `;`, not `&&`, so a non-zero exit does not stop the
  next one; and `gates/verify.mjs` marks the advice phase
  `blocking: false`. Its closing line is
  `verify green. The advice above is a reading, not a verdict [Kenny, 2026-09-09].`
- **`test:affected` usually means everything.** `gates/affected.mjs`
  answers `none` for a change no browser can load, a list for a
  register or a spec, and `all` for anything else — including any
  stylesheet or module. While building one thing, run its single spec
  instead:

    ```sh
    npx playwright test tests/<file>.spec.mjs --project=firefox
    ```

### Procedure 1.1 — before every commit

1. Run the gates the hook will run:

    ```sh
    npm run gates
    ```

    Correct: each step prints its own count, and the chain ends green.
    Examples of what a healthy step says:

    ```
    2 generated files match their source (22 themes).
    All 22 themes declare the same 96 token names (4 known exceptions, L3 clears them).
    Hooks: 22 themes answer 6 hooks (118 answers checked, quiet or scoped).
    ```

2. Run the browser specs the change reaches:

    ```sh
    npm run test:affected
    ```

    Correct: `Nothing a browser can see has changed — no browser test to
    run.` for a documentation-only change, or a Playwright run that ends
    with no failures. `retries` is 0 and stays 0 — a spec that needed a
    retry is a red spec.

3. Commit. The message must carry its feature IDs in brackets, or
   `.githooks/commit-msg` refuses it with:

    ```
    COMMIT BLOCKED — message lacks feature/milestone IDs (standing rule 4).
    ```

**Abort:** nothing has left the working tree until the commit succeeds.
If the hook stops you, fix and re-run; there is no partial state to
clean up.

**One failure mode worth knowing.** The hook fingerprints the working
tree before and after the chain and refuses if anything moved while the
checks ran, because a `--check` script that rewrites a file would be
green here and absent from the commit:

```
GATES FAILED — the working tree changed while the gates ran.
Something rewrote files after they were staged. Re-add and retry.
```

`git add -A` and commit again.

---

## 2 · Regenerating the generated artefacts

Most of what this package ships is assembled, not authored. `npm run
generate:all` runs sixteen steps in order (`package.json`, script
`generate:all`):

`generate` → `generate:fonts-css` → `generate:utilities` →
`generate:tear` → `generate:bundle` → `generate:min` →
`generate:examples` → `generate:showcase` → `generate:site` →
`generate:ha` → `gates/generate-compare.mjs` → `report:di5` →
`generate:types` → `gates/compliance.mjs` → `checksums` →
`prettier --write .`

What that covers, by output:

| Generator                        | Writes                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `gates/generate-themes.mjs`      | `css/themes.css` and `js/theme-registry.js` from `themes/<name>/tokens.json`  |
| `gates/generate-fonts-css.mjs`   | `css/fonts.css` from `fonts/families.json`                                    |
| `gates/generate-utilities.mjs`   | `css/utilities.css`                                                           |
| `gates/generate-tear.mjs`        | the tear geometry **inside** `css/cyberpunk-register.css`, from `gates/tear.json` |
| `gates/generate-bundle.mjs`      | `dist/kp-themes.css` and `dist/kp-themes.js`                                  |
| `gates/generate-min.mjs`         | `dist/css/*.min.css`, the minified bundles and `docs/MINIFIED.md`             |
| `gates/generate-examples.mjs`    | the pages under `examples/`                                                   |
| `gates/generate-showcase.mjs`    | the pages under `showcase/`                                                   |
| `gates/generate-site.mjs`        | the documentation site under `site/`                                          |
| `gates/generate-ha-themes.mjs`   | the Home Assistant themes under `ha/`                                         |
| `gates/generate-compare.mjs`     | `examples/compare.html` and one `examples/compare-<name>.html` per theme      |
| `gates/check-motion.mjs --report`| `reports/di5.md`                                                              |
| `gates/check-types.mjs --write`  | the shipped `.d.ts` declarations                                              |
| `gates/checksums.mjs --write`    | `SHA256SUMS`                                                                  |

### Procedure 2.1 — regenerate after changing a source

1. Make the source change (a token file, `gates/tear.json`,
   `fonts/families.json`, a site descriptor).

2. Regenerate everything:

    ```sh
    npm run generate:all
    ```

    Correct: each generator prints what it wrote, e.g.

    ```
    wrote css/themes.css and js/theme-registry.js from 22 theme sources.
    ```

3. Read the diff before you stage it. A generator is deterministic by
   rule (AR3: no timestamps, no host names, no commit hashes), so a
   diff in a file you did not expect to move is information, not noise.

    ```sh
    git status --porcelain
    ```

4. Confirm the `--check` half agrees:

    ```sh
    npm run check:generated
    ```

    Correct: `2 generated files match their source (22 themes).`

**Abort at any point:** `git checkout -- .` restores the tree; no
generator writes outside the repository.

**Note on `SHA256SUMS`.** The root manifest is in `.gitignore` and is
**not** committed — it would change on every stylesheet edit, and a file
that is wrong between commits is worse than no file
(`.github/workflows/release.yml`, header comment). `npm run generate:all`
writes it locally; the tag build regenerates it. The one checksum file
that *is* committed is `showcase/baseline/4.0.0/SHA256SUMS`, which
`gates/check-baseline.mjs` reads.

---

## 3 · Adding or changing a token

The rule (S47, Kenny 2026-09-07): the token contract is a floor, not a
ceiling. When a theme, a component or an element needs a token that does
not exist, the token is added and **every other theme declares it in the
same change**. `gates/check-tokens.mjs` enforces the parity half and
refuses a name that is not declared everywhere:

```
Every theme answers every question, even when the answer is "none".
```

### Procedure 3.1 — add a token name

1. Add the entry to **one** theme's `themes/<name>/tokens.json`, in the
   `entries` array:

    ```json
    { "token": "surface-hero-border", "value": "hsl(216, 16%, 30%)" }
    ```

2. Prove the gate catches the asymmetry before you fix it — this is the
   drill, and it takes one command:

    ```sh
    npm run check:tokens
    ```

    Correct at this point: **red**, naming your token, with
    `declared by:` one theme and `missing from:` the other 21.

3. Add the same token name to every remaining theme file. Every theme
   answers, and "none" is a legitimate answer as long as the name is
   there.

4. Re-run until green:

    ```sh
    npm run check:tokens
    ```

    Correct: `All 22 themes declare the same 96 token names (…)`, with
    the count raised by one.

5. Regenerate and commit (procedure 2.1). `css/themes.css` and
   `js/theme-registry.js` both move.

**Abort:** stop before step 5 and `git checkout -- themes/`. Nothing
downstream has been generated yet.

**The exception list, and what it is for.** `themes/known-asymmetry.json`
holds names that are deliberately not symmetric, with the reason written
into the file. The ratchet turns both ways: a listed name that has become
symmetric also fails, with

```
Remove them from that file — the ratchet only turns one way.
```

Today it holds four names — `primary-hover`, `primary-active`,
`surface-hero-primary-hover`, `surface-hero-primary-active` — because two
themes author their own states rather than take the derived ones.

### Procedure 3.2 — change a token's value

1. Read `docs/SCOPE.md` S20 first. **A released version of a theme never
   changes.** Any change to a theme's value raises the version — no
   in-place correction, not even of a value that is plainly wrong.
2. Edit the value in `themes/<name>/tokens.json`.
3. `npm run generate:all` (procedure 2.1).
4. `npm run advice` — the contrast floors and the invariants are advice,
   not gates, so nothing will stop you shipping a value that fails them.
   Read the output and decide deliberately:

    ```
    3 pair(s) short of the floor. This is advice: it is measured and printed, never refused [Kenny, 2026-09-09].
    ```

5. `npm run test:affected`, then commit.

If the value came from an approved concept demo, S49 applies: a gate or a
test that says the demo must change produces a **finding** put to Kenny,
not a quiet edit.

---

## 4 · Adding a theme

A theme is a token file, an anatomy document, a row in three shared JSON
files and — since round six — a register. The generators do the rest.
The worked example throughout is `titanium`, added in commit `51f803e`.

### Procedure 4.1 — the theme itself

1. **Have the concept demo approved first.** S46: the concept demo, same
   structure and elements, is the gate a new theme passes before
   integration; S49: the approved demo is implemented exactly. Without
   an approved demo there is nothing to implement against.

2. Create `themes/<name>/tokens.json`. The shape is
   `{ "name", "label", "selector", "entries" }`, where `entries` is an
   array of `{ "token", "value" }` objects and `{ "raw": "…" }` comment
   blocks. Copy the nearest existing theme and replace the values;
   `themes/titanium/tokens.json` is a current example.

3. Create `themes/<name>/anatomy.md` — how this theme answers the
   questions in `docs/DESIGN_INVARIANTS.md`. Every theme has one and
   README links them all.

4. Add the name to `themes/order.json`, in the position the picker
   should show it.

5. Add the theme's row to `themes/hooks.json`. Every theme answers all
   six hooks — `surface`, `emphasis`, `reveal`, `divider`, `accent`,
   `arrival` — either with a selector scoped to that theme in a named
   stylesheet, or with `quiet` **and a reason**. A missing answer is
   refused; so is a non-quiet answer whose selector is not scoped to
   this theme.

6. Generate:

    ```sh
    npm run generate:all
    ```

    This writes the theme's token block into `css/themes.css`, its entry
    into `js/theme-registry.js`, `ha/kp-<name>.yaml`,
    `showcase/themes/<name>.html`, `examples/concept-<name>.html` and
    `examples/compare-<name>.html`.

7. Check the three gates that count themes:

    ```sh
    npm run check:generated
    npm run check:tokens
    npm run check:hooks
    ```

    Correct: all three name the new total, e.g.
    `Hooks: 23 themes answer 6 hooks (…)`.

8. `npm run advice`, and read what the new theme scores. Advice, not a
   verdict — but a new theme is exactly the moment to look.

**Abort:** before step 6, delete `themes/<name>/` and revert the two
JSON rows. After step 6, `git checkout -- .` also drops the generated
pages, which is what you want.

**If the generator refuses.** The derivation can fail honestly. A theme
whose link colour has no derivable visited state stops the generator
with:

```
no visited-link colour derivable from <colour>: nothing clears 4.5 on both
surfaces while staying <n> from the link colour. Author --link-visited in
the theme.
```

Author `link-visited` in the theme's own entries and run again.

### Procedure 4.2 — give the theme its register

A register is the theme's expression layer: `css/<name>-register.css`.
Eleven shared files have to learn about it, and doing that by hand is
eleven chances to forget one.

1. Write `css/<name>-register.css`.

2. Report what is missing, changing nothing:

    ```sh
    node gates/wire-register.mjs <name> --check
    ```

    It prints one line per place — `ok` or `MISSING` — and ends with a
    count and this sentence:

    ```
    What is left for a human: themes/hooks.json and showcase/concept-copy.mjs (both carried by
    gates/integrate-lift.mjs), and anything the agent changed outside its own theme.
    ```

3. Wire it:

    ```sh
    node gates/wire-register.mjs <name>
    ```

    It edits `package.json` (the `./css/<name>-register` export),
    `gates/config.json`, `gates/checksums.mjs`,
    `gates/check-register-coverage.mjs`, `gates/generate-examples.mjs`,
    `gates/generate-compare.mjs`, `gates/site/chrome.mjs`, and the four
    fixtures `tests/fixtures/bundle-loose.html`,
    `tests/fixtures/button.html`, `tests/fixtures/dashboard.html`,
    `tests/fixtures/examples.html`; plus three substitutions in
    `gates/compliance.mjs`, `gates/generate-showcase.mjs` and
    `tests/bare.spec.mjs`.

4. Re-run the check until every line reads `ok`:

    ```sh
    node gates/wire-register.mjs <name> --check
    ```

5. Check coverage:

    ```sh
    npm run check:register-coverage
    ```

    Correct: one line per register, e.g.

    ```
    Register coverage: 61 of 69 roots answered by css/cyberpunk-register.css, 8 helpers excused, 0 pending; 1 required part(s) answered.
    ```

    A root the register does not reach yet goes in
    `gates/register-pending.json` **with its reason**; the gate refuses
    an entry the register in fact covers, so the list cannot outlive the
    work. `REQUIRED_PARTS` (KT14) refuses a register with no rule for
    `.kp-nav__menu` — open the dropdown before you publish.

6. `npm run generate:all`, then `npm run gates`, then
   `npm run test:affected`.

**Abort:** `gates/wire-register.mjs` writes only when run without
`--check`. If step 3 went wrong, `git checkout -- .` undoes all eleven
edits at once, because none of them has been committed.

### Procedure 4.3 — bringing a theme in from another worktree

When a theme was built in its own git worktree (round six built nineteen
in parallel), do not copy the shared files across:

```sh
node gates/integrate-lift.mjs <name> <worktree>
```

Without `--apply` it reports and changes nothing. It copies only the
files the theme owns — `css/<name>-register.css`,
`tests/register-<name>.spec.mjs`, `themes/<name>/anatomy.md`,
`themes/<name>/tokens.json` — and prints anything the other session
touched outside them as a diff for a person to read. The shared wiring is
redone here by procedure 4.2.

---

## 5 · Cutting a release

Two facts decide the shape of this procedure, and both are in the code:

- **Pushing a `v*` tag fires `.github/workflows/release.yml`.** That
  workflow runs `npm ci`, `npm run gates`, `npm run checksums`,
  `tar -cf fonts.tar fonts`, `npm run consumer-tar`, and then
  `gh release create` with `--draft` and nine assets. Do not rebuild
  any of that by hand: doing exactly that is the fault recorded as KT9
  in `docs/CORRECTIONS.md`, where a hand-built release published a
  `SHA256SUMS` covering three files instead of ten.
- **A draft is where the automation stops.** The workflow's own comment:
  "Pushing a tag is a technical act; publishing is Kenny's, and the two
  should not be the same keystroke." Publishing the draft is not in this
  procedure because it is not the maintainer's step.

### Procedure 5.1 — cut a release

1. Decide the version. S20: any change to a theme raises it. Set it in
   `package.json`:

    ```json
    "version": "5.2.0"
    ```

2. Regenerate, so the version reaches the artefacts that carry it —
   `--kp-themes-version` in `css/themes.css`, `VERSION` in
   `js/theme-registry.js`, both bundles, the minified twins and
   `docs/MINIFIED.md`:

    ```sh
    npm run generate:all
    ```

    Verify the token moved:

    ```sh
    grep -n "kp-themes-version" css/themes.css
    ```

    Correct: the line reads the new version.

3. Write the `CHANGELOG.md` section. It is not decoration: the workflow
   passes `--notes-file CHANGELOG.md`, so this file becomes the release
   notes body. Add the `MIGRATION.md` section too if anything breaks —
   `gates/check-migration.mjs` holds every class it names.

4. Run the gates:

    ```sh
    npm run gates
    ```

5. **Ask Kenny in a form for the go to run the whole suite** (the
   amendment of 2026-09-10: the decision stays his, the typing moves).
   With his go:

    ```sh
    npm run verify
    ```

    Correct: three phases, then a summary table and

    ```
    verify green. The advice above is a reading, not a verdict [Kenny, 2026-09-09].
    ```

    If a blocking phase fails it stops there and says so —
    `verify stopped at gates.` / `verify stopped at browser.` — and names
    what was not run. Fix and re-run; a partial verify is not a verify.

6. Get the change onto `main`. `main` requires no status check (there is
   no CI to provide one), but force pushes and deletions are refused and
   admin enforcement is on — measured 2026-09-12 via
   `gh api repos/kennypassenier/kp-themes/branches/main/protection`.

7. Confirm the sha you are about to tag actually carries the change:

    ```sh
    git show --stat origin/main | head -20
    ```

8. Tag and push. This, and nothing else, builds the release:

    ```sh
    git tag v5.2.0 <sha>
    git push origin v5.2.0
    ```

9. Watch the run:

    ```sh
    gh run list --workflow=Release --limit 1
    ```

    Correct: one tab-separated line for your tag, beginning
    `completed` and `success`, with `Release` as the workflow and the
    tag as the branch. If `npm run gates` fails there, the tag has built
    nothing and there is no draft — go to the abort below. That has
    happened: run `34424091189` on `v5.1.0` failed at the `Gates` step,
    and `Checksums`, `Fonts`, `Consumer tarball` and `Draft release` all
    read `skipped`, so no release object was created at all. The next run
    on the same tag built it.

10. Check the draft has all nine assets:

    ```sh
    gh release view v5.2.0 --json tagName,isDraft,assets --jq '{tag:.tagName,draft:.isDraft,assets:[.assets[].name]}'
    ```

    Correct, as v5.1.0 actually shipped:

    ```
    {"assets":["components.css","consumer.tar","fonts.css","fonts.tar","kp-themes.css","kp-themes.js","MIGRATION.md","SHA256SUMS","themes.css"],"draft":true,"tag":"v5.2.0"}
    ```

11. Verify every published checksum against the tagged tree. This is
    KT9's evidence, and it is a command, not a belief:

    ```sh
    W=$(mktemp -d)
    git archive v5.2.0 | tar -x -C "$W"
    gh release download v5.2.0 --repo kennypassenier/kp-themes --pattern SHA256SUMS --dir "$W"
    (cd "$W" && sha256sum -c SHA256SUMS | grep -vc ': OK$')
    ```

    Correct: `0` lines that are not `OK`. Run against `v5.1.0` on
    2026-09-12 this reported 231 files listed and 231 `OK`, 0 failures.

12. Stop. Publishing the draft is Kenny's action.

**Abort, at any step before 8:** nothing outside the repository has
happened. Reset the version in `package.json`, `npm run generate:all`,
and the tree is where it was.

**Abort, after the tag is pushed:** the draft can be deleted without
leaving a hole in the release list — that is why it is a draft.

```sh
gh release delete v5.2.0 --yes
git push origin :refs/tags/v5.2.0
git tag -d v5.2.0
```

Then fix and re-tag. KT9 field 8 records this repair taking about ten
minutes, and it has been exercised once.

**Never** run `gh release create` by hand for a tag this workflow builds.
KT9's measure, in its own words: before performing by hand any action a
project might already automate on a trigger you are about to fire, read
that trigger's workflow file first.

---

## 6 · Publishing the documentation site

`.github/workflows/pages.yml` deploys on every push to `main` and on
manual dispatch. The site is **committed**, not built there
(AR22): the workflow's only check is
`node gates/generate-site.mjs --check`, so a stale committed site fails
the deploy rather than publishing a page no gate has read.

1. Change the site source (the descriptors under `gates/site/`).

2. Regenerate and confirm:

    ```sh
    npm run generate:site
    npm run check:site
    ```

    Correct: the generator reports what it wrote and the check passes
    both halves — `generate-site.mjs --check` and `check-site.mjs`.

3. Commit the generated `site/` with the source. They travel together;
   `npm run gates` refuses them apart.

4. Push to `main` and watch:

    ```sh
    gh run list --workflow="Documentation site" --limit 1
    ```

    Correct: `completed  success`, two jobs (`build`, then `deploy`).

**Abort:** the deploy replaces the published site wholesale. To undo,
revert the commit on `main` and let the workflow run again — there is no
rollback button, only another deploy.

---

## 7 · When a gate refuses

Every gate in the chain prints what it checked and how many, then names
what failed and the file it is in. Read that line first: most of them
tell you the repair outright, e.g.

```
Run `npm run generate` and commit the result.
```

```
<path> is a file a consumer copies — an export under css/, js/ or dist/,
or something one of those imports — and is not in the manifest. Add it to
FILES in gates/checksums.mjs.
```

For symptom→cause tables, the evidence trail behind each gate and what to
do when the message is not self-explanatory, see
[the debugging guide](DEBUGGING_GUIDE.md). For "the page looks wrong
rather than a check saying no", see [Troubleshooting](TROUBLESHOOTING.md).

To run one gate on its own rather than the whole chain, take its script
name out of the `gates` chain in `package.json` — each step there is its
own script, so `npm run check:layers` runs that one gate and nothing
else.

---

## 8 · Credentials: what would stop a release, and how to put one back

The question this section exists to answer is deliberately awkward: **if
this project's secret key were gone tomorrow, where are its other copies
and how do you put one back?** A runbook that answers "the tag is wrong"
and "the draft is wrong" but not "the key is gone" has a hole exactly
where nothing can be released at all.

For kp-themes the honest answer is short, and it is measured rather than
assumed.

### 8.1 · What credentials exist

| Credential                       | Where it lives                                       | What it survives                                                                          | How it is used                                                     |
| -------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| The maintainer's GitHub OAuth token | the machine's system keyring, via `gh`             | reboots and clone deletion; **not** a new machine, a wiped keyring, or a revoked token     | `git push`, `git push origin <tag>`, every `gh` command here       |
| `GH_TOKEN` in the release workflow  | nowhere — GitHub mints `${{ github.token }}` per run | everything: there is no copy to lose                                                       | the `gh release create` step in `.github/workflows/release.yml`    |
| The Pages deployment identity       | nowhere — OIDC, `permissions: id-token: write`      | everything: there is no copy to lose                                                       | `actions/deploy-pages@v4` in `.github/workflows/pages.yml`         |

And three things that are **not** here, each checked:

- **No repository or environment secret.** Measured 2026-09-12:
  `gh api repos/kennypassenier/kp-themes/actions/secrets` returns
  `{"total_count":0,"secrets":[]}`. Both workflows reference only
  `${{ github.token }}` and the OIDC permission block.
- **No signing key.** `.github/workflows/release.yml` says so in its
  own header: "This project signs nothing: there is no key baked into
  anything, because nothing here is an executable a consumer runs. The
  checksums are the whole verification story." `SHA256SUMS` is the
  integrity mechanism, and it is regenerated at the tag from
  `gates/checksums.mjs` — it needs no key and can always be rebuilt.
- **No npm token.** `package.json` declares `"private": true`, which
  blocks `npm publish`; consumers install from a git tag
  (`docs/INVENTORY.md`, JobTracker's entry). There is no registry
  credential to lose.

So the single credential whose loss stops work is the maintainer's own
GitHub token, and the repository holds no copy of it. That is the good
news and the whole of the recovery story.

### 8.2 · Procedure — the GitHub credential is gone

Symptoms: `git push` asks for a password or fails with 403; `gh` reports
`You are not logged into any GitHub hosts`; a tag pushes but no Release
run appears because the push never landed.

1. Establish what is actually there:

    ```sh
    gh auth status
    ```

    Healthy output names the account, the storage and the scopes:

    ```
    github.com
      ✓ Logged in to github.com account kennypassenier (keyring)
      - Active account: true
      - Git operations protocol: https
      - Token scopes: 'delete_repo', 'gist', 'read:org', 'repo', 'workflow'
    ```

    If it says no host is logged in, go to step 3. If the account is
    there but a scope is missing, go to step 2.

2. **Scopes only.** Re-minting is not needed; ask for the missing scope:

    ```sh
    gh auth refresh --hostname github.com --scopes repo,workflow,read:org,gist
    ```

    Correct: a device-code prompt, then `gh auth status` showing the
    scope. `repo` and `workflow` are the two this project needs —
    `repo` to push and to manage releases, `workflow` because
    `.github/workflows/` is under version control and a push that
    touches it is refused without that scope.

3. **The token is gone.** Mint a new one through the web flow; it is
   stored in the system credential store:

    ```sh
    gh auth login --hostname github.com --git-protocol https --web
    ```

    Correct: `✓ Logged in as kennypassenier`, and `gh auth status`
    reports `(keyring)`. If the machine has no credential store, `gh`
    falls back to a plain-text file and says so in `gh auth status` —
    worth knowing, because that copy is readable.

    The alternative, for a machine without a browser: create a classic
    personal access token at <https://github.com/settings/tokens> with
    `repo`, `workflow`, `read:org` and `gist`, then run

    ```sh
    gh auth login --hostname github.com --with-token
    ```

    `--with-token` reads standard input, so paste the token and press
    Ctrl-D.

4. Teach git to use it, so `git push` stops prompting:

    ```sh
    gh auth setup-git
    ```

5. Prove it, read-only, before you rely on it:

    ```sh
    gh api repos/kennypassenier/kp-themes --jq .full_name
    git ls-remote origin HEAD
    ```

    Correct: the repository name, and one line with the sha of `main`.

6. If the old token may have leaked rather than merely expired, revoke
   it at <https://github.com/settings/tokens> after step 5, not before —
   revoking first leaves you with no way in if step 3 went wrong.

**Abort:** every step here is additive and local to the machine. Nothing
in the repository changes, and an interrupted `gh auth login` leaves the
previous credential in place.

### 8.3 · What cannot be recovered, and what that costs

- **Nothing in this repository depends on a key.** A fresh clone on a
  fresh machine with a fresh token can regenerate every artefact
  (`npm run generate:all`), rebuild `SHA256SUMS` from
  `gates/checksums.mjs`, and cut a release. There is no state to
  restore.
- **A published release cannot be unpublished into a clean history.** A
  draft can be deleted; a published one leaves a record. That is why
  the workflow stops at a draft.
- **A lost account, as opposed to a lost token, is a different problem**
  and this repository has no answer for it: the remote is
  `https://github.com/kennypassenier/kp-themes.git`, the published site
  and every release live under that account. The mitigation that exists
  is that consumers vendor the files they need and verify them against
  `SHA256SUMS`, so an outage of the remote does not stop them building —
  it stops *this* project releasing.
