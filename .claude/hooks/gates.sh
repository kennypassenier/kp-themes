#!/usr/bin/env bash
# kp-themes quality gates. Called before every commit by both the
# git-native pre-commit hook and the Claude Code PreToolUse hook.
# Non-zero exit blocks the commit.
#
# Phase 5 decision H1, as amended at round five's Phase 5 gate (H3,
# 2026-09-07) and again by Kenny on 2026-09-09: the WHOLE chain blocks a
# commit, and the browser tests run when Kenny runs them.
#
# The original decision said only the fast gates block, on the grounds
# that a gate slow enough to be worked around is not a gate. KT7's repair
# then required every `check:` script to appear here, which quietly moved
# the type check, the declaration gate and the unit tests into the commit
# path. The chain still finishes in seconds, so the reasoning holds and
# the decision was rewritten to match reality rather than the reverse.
# The browser tests stay out: those are minutes, not seconds.
#
# There is no longer a CI to catch what this chain does not. Kenny
# removed it on 2026-09-09 — 254 runs in five days, 35.9 hours of
# waiting, for a verdict he gives himself. `npm run test:tags` runs
# what a change touches, by tag, in Firefox; `npm run verify` runs everything,
# and he gives that command before a release.
set -uo pipefail

# Kenny, 2026-09-16 (gate-cache): a check whose inputs did not move does
# not run. Each check's input set is recorded while it runs, so nothing
# here is a hand-kept list. Measured over the last 200 commits of this
# repository: 4239 of 6000 check runs could not have found anything, and
# the chain's 8.79 s per commit falls to 4.19 s. The descriptions that
# used to be echoed are comments now — an echo printed whether or not the
# check ran, and the runner's own summary is what tells the truth.
. "$(git rev-parse --show-toplevel)/.githooks/gate-cache.sh"

# Standing rule 7: a gate that does not predict the build is not a gate.
# These checks can rewrite files, and anything rewritten after `git add`
# is green here and absent from the commit. Fingerprint the tree, compare
# afterwards, and refuse rather than report green over a tree that moved.
gate_tree_fingerprint() {
  { git status --porcelain; git diff; } | sha256sum | cut -d' ' -f1
}
gate_tree_before=$(gate_tree_fingerprint)

# Kenny, 2026-09-14 [scope-76]: every gate judged once. Six checks lost
# their own line and run inside a target that already covers the same
# ground — tokens in the unit tests, bundle in the minified build,
# migration in the runnable docs, the fonts stylesheet in the fonts gate,
# the tear in the generated files, the package in the manifest. Each still
# blocks, with the message it always printed. Four moved to
# `npm run advice`, printed and never refusing: variant grounds, the
# compliance table, the vendored baseline and prettier.

# generated files match their source (TH121) [scope-76, scope-96]
gate gen-themes node gates/generate-themes.mjs --check || exit 1

# Kenny, 2026-09-09: the checks that exist for people with disabilities —
# the contrast floors, the flash threshold, the reduced-motion guards, the
# texture ceiling and the invariant sweep — are no longer here. They are
# advice now (`npm run advice`), a reading rather than a verdict, and the
# list of per-theme exceptions they used to need is gone with them. What
# that costs is stated where the package makes its promises, so it no
# longer claims to enforce what it does not.

# theme colour stays in the token layer (DI9)
gate layers node gates/check-layers.mjs || exit 1

# a relative colour that resolves to nothing [fix-11]
gate relative-colour node gates/check-relative-colour.mjs || exit 1

# a register that cancels the pressed state [fix-12]
gate pressed-state node gates/check-pressed-state.mjs || exit 1

# the import closure of the modules chassis-rs vendors (AR28)
gate closure node gates/check-closure.mjs || exit 1

# the utility API matches its source and its documented list (TH93)
gate gen-utilities node gates/generate-utilities.mjs --check || exit 1
gate utilities node gates/check-utilities.mjs || exit 1

# the dist bundle (TH106) and the minified build match their sources, and the size table with them [scope-76]
gate gen-min node gates/generate-min.mjs --check || exit 1

# a converted component sits inside its container (TH104, AR31)
gate wrappers node gates/check-wrappers.mjs || exit 1

# the showcase and its fixtures match their source
gate gen-showcase node gates/generate-showcase.mjs --check || exit 1

# the ten example pages match their source (TH98)
gate gen-examples node gates/generate-examples.mjs --check || exit 1

# one ID means one thing [KT10]
gate ids node gates/check-ids.mjs || exit 1

# every component the package defines is shown somewhere in the catalogue [scope-31]
gate catalogue node gates/check-catalogue.mjs || exit 1

# while a review round is open, the blocks Kenny is judging do not move [fix-46]
gate round node gates/check-round.mjs || exit 1

# the verdict register is well formed, names known blocks, and matches the hash recipe [scope-68]
gate verdicts node gates/check-verdicts.mjs || exit 1

# every theme answers every hook (S45, AR36)
gate hooks node gates/check-hooks.mjs || exit 1

# the register answers every component root (TH124, AR37)
gate register-coverage node gates/check-register-coverage.mjs || exit 1

# every browser test carries a tag, and every file is under a rule of the tag map [scope-33]
gate tags node gates/check-tags.mjs || exit 1

# the shipped fonts: licence, reserved names, budget, and css/fonts.css matches its listing (T19, AR39) [scope-76]
gate fonts node gates/check-fonts.mjs || exit 1

# an example page carries the hooks its descriptor asks for
gate examples-wired node gates/check-examples-wired.mjs || exit 1

# no inline styles on the example pages (TH109)
gate inline-styles node gates/check-inline-styles.mjs || exit 1

# the documentation site matches its source and holds its promises (TH100, TH101)
gate gen-site node gates/generate-site.mjs --check || exit 1
gate site node gates/check-site.mjs || exit 1

# the Home Assistant themes match their source
gate gen-ha-themes node gates/generate-ha-themes.mjs --check || exit 1

# everything the package exports is published, and the checksum manifest holds every file a consumer can copy (TH103) [scope-76]
gate manifest node gates/check-manifest.mjs || exit 1

# nothing private in a document of a public repository [Phase 8]
gate docs-private node gates/check-docs-private.mjs || exit 1

# every command, path and import a document names is real, and the migration note's classes exist (TH108) [Phase 8, scope-76]
gate docs-runnable node gates/check-docs-runnable.mjs || exit 1

# a message a document quotes is the message the code prints [Phase 8]
gate doc-quotes node gates/check-doc-quotes.mjs || exit 1

# a document is looked at when a file it describes changes [scope-35, scope-78]
# Not infallible: touching the document counts as looked at, and the gate
# knows files, not meaning. After reading it, `npm run drift:seen -- <doc>`.
gate drift node gates/check-drift.mjs --check || exit 1

# every user-visible string comes from the dictionary (KT5)
gate strings node gates/check-strings.mjs || exit 1

# types (the check jsconfig.json has always declared)
gate types npx tsc --noEmit -p jsconfig.json || exit 1

# the shipped declarations, and a consumer type-checks against them (KT4)
gate types node gates/check-types.mjs || exit 1

# tests, token parity across the themes among them (TH22) [scope-76]
gate_glob unit-tests "gates/*" "themes/*" "css/*" "js/*" -- bash -c 'node --test gates/ 2>&1 | tail -3' || exit 1 || exit 1

# Gates added by later milestones land here:
#   L5  the browser checks — but by hand, not here (decision H1):
#       `npm run test:tags` for a change, `npm run verify` for a
#       release [Kenny, 2026-09-09]

gate_tree_after=$(gate_tree_fingerprint)
if [ "$gate_tree_before" != "$gate_tree_after" ]; then
  echo "GATES FAILED — the working tree changed while the gates ran." >&2
  echo "Something rewrote files after they were staged. Re-add and retry." >&2
  exit 1
fi

gate_cache_done
echo "gates green"
