#!/usr/bin/env bash
# kp-themes quality gates. Called before every commit by both the
# git-native pre-commit hook and the Claude Code PreToolUse hook.
# Non-zero exit blocks the commit.
#
# Phase 5 decision H1: the FAST gates block a commit; the browser tests
# block a merge instead, in CI. A gate slow enough to be worked around
# is not a gate.
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

echo "→ contrast (WCAG AA over every declared pair)"
node scripts/check-contrast.mjs

# Gates added by later milestones land here:
#   L1  parity (TH22), expected-count assertions (AR8), artefact round-trip (AR1)
#   L3  colour-vision distance (DI4), flash threshold (DI5), layer order (DI6)
#   L4  node --test for anything that needs no DOM

gate_tree_after=$(gate_tree_fingerprint)
if [ "$gate_tree_before" != "$gate_tree_after" ]; then
  echo "GATES FAILED — the working tree changed while the gates ran." >&2
  echo "Something rewrote files after they were staged. Re-add and retry." >&2
  exit 1
fi

echo "gates green"
