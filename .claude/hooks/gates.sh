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
set -euo pipefail

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

echo "→ generated files match their source, and the tear its parameters (TH121, AR41) [scope-76]"
node gates/generate-themes.mjs --check

# Kenny, 2026-09-09: the checks that exist for people with disabilities —
# the contrast floors, the flash threshold, the reduced-motion guards, the
# texture ceiling and the invariant sweep — are no longer here. They are
# advice now (`npm run advice`), a reading rather than a verdict, and the
# list of per-theme exceptions they used to need is gone with them. What
# that costs is stated where the package makes its promises, so it no
# longer claims to enforce what it does not.

echo "→ theme colour stays in the token layer (DI9)"
node gates/check-layers.mjs

echo "→ a relative colour that resolves to nothing [fix-11]"
node gates/check-relative-colour.mjs

echo "→ a register that cancels the pressed state [fix-12]"
node gates/check-pressed-state.mjs

echo "→ the import closure of the modules chassis-rs vendors (AR28)"
node gates/check-closure.mjs

echo "→ the utility API matches its source and its documented list (TH93)"
node gates/generate-utilities.mjs --check && node gates/check-utilities.mjs

echo "→ the dist bundle (TH106) and the minified build match their sources, and the size table with them [scope-76]"
node gates/generate-min.mjs --check

echo "→ a converted component sits inside its container (TH104, AR31)"
node gates/check-wrappers.mjs

echo "→ the showcase and its fixtures match their source"
node gates/generate-showcase.mjs --check

echo "→ the ten example pages match their source (TH98)"
node gates/generate-examples.mjs --check

echo "→ one ID means one thing [KT10]"
node gates/check-ids.mjs

echo "→ every component the package defines is shown somewhere in the catalogue [scope-31]"
node gates/check-catalogue.mjs

echo "→ the verdict register is well formed, names known blocks, and matches the hash recipe [scope-68]"
node gates/check-verdicts.mjs

echo "→ every theme answers every hook (S45, AR36)"
node gates/check-hooks.mjs

echo "→ the register answers every component root (TH124, AR37)"
node gates/check-register-coverage.mjs

echo "→ every browser test carries a tag, and every file is under a rule of the tag map [scope-33]"
node gates/check-tags.mjs

echo "→ the shipped fonts: licence, reserved names, budget, and css/fonts.css matches its listing (T19, AR39) [scope-76]"
node gates/check-fonts.mjs

echo "→ an example page carries the hooks its descriptor asks for"
node gates/check-examples-wired.mjs

echo "→ no inline styles on the example pages (TH109)"
node gates/check-inline-styles.mjs

echo "→ the documentation site matches its source and holds its promises (TH100, TH101)"
node gates/generate-site.mjs --check && node gates/check-site.mjs

echo "→ the Home Assistant themes match their source"
node gates/generate-ha-themes.mjs --check

echo "→ everything the package exports is published, and the checksum manifest holds every file a consumer can copy (TH103) [scope-76]"
node gates/check-manifest.mjs

echo "→ nothing private in a document of a public repository [Phase 8]"
node gates/check-docs-private.mjs

echo "→ every command, path and import a document names is real, and the migration note's classes exist (TH108) [Phase 8, scope-76]"
node gates/check-docs-runnable.mjs

echo "→ a message a document quotes is the message the code prints [Phase 8]"
node gates/check-doc-quotes.mjs

echo "→ every user-visible string comes from the dictionary (KT5)"
node gates/check-strings.mjs

echo "→ types (the check jsconfig.json has always declared)"
npx tsc --noEmit -p jsconfig.json

echo "→ the shipped declarations, and a consumer type-checks against them (KT4)"
node gates/check-types.mjs

echo "→ tests, token parity across the themes among them (TH22) [scope-76]"
node --test gates/ 2>&1 | tail -3

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

echo "gates green"
