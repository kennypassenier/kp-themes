#!/usr/bin/env bash
# Blocks every command that runs a browser test (the whole suite and the tagged subsets) that are Kenny's to authorise (CLAUDE.md:
# "Tests only after a release go"). A PreToolUse hook on the Bash tool.
#
# Contract: Claude Code pipes the tool call as JSON on stdin. Exit 0 allows
# the command; exit 2 blocks it and feeds stderr back to Claude. Parse
# failures fail OPEN, so a broken hook never bricks work.
#
# Kenny's go is a row in the project database (table release_gos, written by
# `node gates/release-go.mjs record`). It is ACTIVE while its version is greater
# than the latest release tag and not tagged yet; once `v<version>` exists it is
# spent by itself. An unreadable database BLOCKS (it never fails open).
# The old file `.claude/release-go` was retired after the 12.6.0 release (2026-11-04).
set -u

payload=$(cat) || exit 0
project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"

hit=$(printf '%s' "$payload" | python3 -c '
import json, re, sys
try:
    cmd = json.load(sys.stdin).get("tool_input", {}).get("command", "")
except Exception:
    sys.exit(0)

def blank(t):
    return "".join("\n" if c == "\n" else "x" for c in t)

# Mask heredoc bodies and quoted strings, so a command that only quotes one
# of these names (a commit message, a document) is not mistaken for running it.
out = cmd
for m in re.finditer(r"<<-?\s*([\x27\"]?)([A-Za-z_][A-Za-z0-9_]*)\1\n", cmd):
    end = re.search(r"^\s*" + re.escape(m.group(2)) + r"\s*$", cmd[m.end():], re.MULTILINE)
    stop = m.end() + (end.start() if end else len(cmd) - m.end())
    out = out[:m.end()] + blank(out[m.end():stop]) + out[stop:]
for pat in (r"\x27[^\x27]*\x27", r"\"(?:\\.|[^\"\\])*\""):
    out = re.sub(pat, lambda m: blank(m.group(0)), out)

BLOCKED = re.compile(
    r"^(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)*"
    r"(?:npm\s+(?:run\s+)?(?:test:browser|test:firefox|test:release|verify)\b"
    r"|npx\s+(?:--no-install\s+)?playwright\s+test\b"
    r"|node\s+gates/verify\.mjs\b"
    r"|node\s+gates/run-tags\.mjs\b"
    r"|npm\s+(?:run\s+)?test:tags\b)")
for seg in re.split(r"\|\||&&|;|\||\n", out):
    seg = seg.strip()
    # --dry-run only prints the selection and the count; it runs no test.
    if BLOCKED.match(seg) and "--dry-run" not in seg:
        print(seg[:100])
        break
' 2>/dev/null) || exit 0

[ -z "$hit" ] && exit 0

# The database decides. cli exit: 0 active, 3 no active go, anything else = unreadable.
cli_out=$(node "$project_dir/gates/release-go.mjs" status 2>&1); cli=$?
if [ "$cli" -eq 0 ]; then exit 0; fi
if [ "$cli" -ne 3 ]; then
  {
    echo "BLOCKED: '$hit' needs a release go, but the release-go database cannot be read, so the hook does not guess."
    echo "$cli_out"
    echo "Fix: node gates/review-db.mjs migrate (schema), or check data/kp-themes.sqlite and git."
  } >&2
  exit 2
fi
{
  echo "BLOCKED: '$hit' runs the browser suite, and the suite runs only after Kenny's go for a release."
  echo "$cli_out"
  echo "Kenny's go is recorded with: node gates/release-go.mjs record <version> --by Kenny --source \"<form item and answer>\". Do not record it yourself."
  echo "Until then use 'npm run gates' (seconds), which is not blocked."
} >&2
exit 2
