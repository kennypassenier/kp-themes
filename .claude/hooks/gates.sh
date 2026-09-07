#!/usr/bin/env bash
# kp-themes quality gates. Called before every commit by both the
# git-native pre-commit hook and the Claude Code PreToolUse hook.
# Non-zero exit blocks the commit.
#
# Phase 5 decision H1, as amended at round five's Phase 5 gate (H3,
# 2026-09-07): the WHOLE chain blocks a commit; the browser tests block a
# merge instead, in CI.
#
# The original decision said only the fast gates block, on the grounds
# that a gate slow enough to be worked around is not a gate. KT7's repair
# then required every `check:` script to appear here, which quietly moved
# the type check, the declaration gate and the unit tests into the commit
# path. The chain still finishes in seconds, so the reasoning holds and
# the decision was rewritten to match reality rather than the reverse.
# The browser tests stay out: those are minutes, not seconds.
set -euo pipefail

# Standing rule 7: a gate that does not predict the build is not a gate.
# These checks can rewrite files, and anything rewritten after `git add`
# is green here and absent from the commit. Fingerprint the tree, compare
# afterwards, and refuse rather than report green over a tree that moved.
gate_tree_fingerprint() {
  { git status --porcelain; git diff; } | sha256sum | cut -d' ' -f1
}
gate_tree_before=$(gate_tree_fingerprint)

echo "→ generated files match their source"
node gates/generate-themes.mjs --check

echo "→ prettier"
npx prettier --check .

echo "→ token parity across the seven themes (TH22)"
node gates/check-tokens.mjs

echo "→ design invariants over the token source (DI1, DI2, DI3, DI4, DI6)"
node gates/check-invariants.mjs

echo "→ contrast (WCAG AA over every declared pair)"
node gates/check-contrast.mjs

echo "→ motion: flash threshold and reduced-motion guards (DI5, DI7)"
node gates/check-motion.mjs

echo "→ theme colour stays in the token layer (DI9)"
node gates/check-layers.mjs

echo "→ the import closure of the modules chassis-rs vendors (AR28)"
node gates/check-closure.mjs

echo "→ the utility API matches its source and its documented list (TH93)"
node gates/generate-utilities.mjs --check && node gates/check-utilities.mjs

echo "→ the dist bundle matches its sources (TH106)"
node gates/generate-bundle.mjs --check

echo "→ the migration note points at classes that exist (TH108)"
node gates/check-migration.mjs

echo "→ a converted component sits inside its container (TH104, AR31)"
node gates/check-wrappers.mjs

echo "→ the showcase and its fixtures match their source"
node gates/generate-showcase.mjs --check

echo "→ the ten example pages match their source (TH98)"
node gates/generate-examples.mjs --check

echo "→ one ID means one thing [KT10]"
node gates/check-ids.mjs

echo "→ every theme answers every hook (S45, AR36)"
node gates/check-hooks.mjs

echo "→ the register answers every component root (TH124, AR37)"
node gates/check-register-coverage.mjs

echo "→ the shipped fonts: licence, reserved names, budget (T19, AR39)"
node gates/check-fonts.mjs

echo "→ the tear matches its parameters (TH121, AR41)"
node gates/generate-tear.mjs --check

echo "→ the texture layer is felt, not seen (DI9, AR46)"
node gates/check-texture.mjs

echo "→ an example page carries the hooks its descriptor asks for"
node gates/check-examples-wired.mjs

echo "→ no inline styles on the example pages (TH109)"
node gates/check-inline-styles.mjs

echo "→ the documentation site matches its source and holds its promises (TH100, TH101)"
node gates/generate-site.mjs --check && node gates/check-site.mjs

echo "→ the Home Assistant themes match their source"
node gates/generate-ha-themes.mjs --check

echo "→ everything the package exports is actually published"
node gates/check-package.mjs

echo "→ the checksum manifest holds every file a consumer can copy (TH103)"
node gates/check-manifest.mjs

echo "→ the compliance table still says what the gates measure"
node gates/compliance.mjs --check

echo "→ every user-visible string comes from the dictionary (KT5)"
node gates/check-strings.mjs

echo "→ types (the check jsconfig.json has always declared)"
npx tsc --noEmit -p jsconfig.json

echo "→ the shipped declarations, and a consumer type-checks against them (KT4)"
node gates/check-types.mjs

echo "→ tests"
node --test gates/ 2>&1 | tail -3

# Gates added by later milestones land here:
#   L5  the browser checks — but in CI, not here (decision H1)

gate_tree_after=$(gate_tree_fingerprint)
if [ "$gate_tree_before" != "$gate_tree_after" ]; then
  echo "GATES FAILED — the working tree changed while the gates ran." >&2
  echo "Something rewrote files after they were staged. Re-add and retry." >&2
  exit 1
fi

echo "gates green"
