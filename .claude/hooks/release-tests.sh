#!/usr/bin/env bash
# Blocks the browser-test commands that are Kenny's to authorise (CLAUDE.md:
# "Tests only after a release go"). A PreToolUse hook on the Bash tool.
#
# Contract: Claude Code pipes the tool call as JSON on stdin. Exit 0 allows
# the command; exit 2 blocks it and feeds stderr back to Claude. Parse
# failures fail OPEN, so a broken hook never bricks work.
#
# Kenny's go is the file `.claude/release-go` (git-ignored). While it exists
# the commands pass; he removes it when the release is done.
set -u

payload=$(cat) || exit 0
project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
[ -e "$project_dir/.claude/release-go" ] && exit 0

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
    r"|node\s+gates/run-tags\.mjs\b.*--level\s+(?:release|changed)\b"
    r"|npm\s+(?:run\s+)?test:tags\b.*--level\s+(?:release|changed)\b)")
for seg in re.split(r"\|\||&&|;|\||\n", out):
    if BLOCKED.match(seg.strip()):
        print(seg.strip()[:100])
        break
' 2>/dev/null) || exit 0

[ -z "$hit" ] && exit 0
{
  echo "BLOCKED: '$hit' runs the browser suite, and the suite runs only after Kenny's go for a release."
  echo "Kenny gives the go by creating the file .claude/release-go. Do not create it yourself."
  echo "Until then use 'npm run gates' (seconds), which is not blocked."
} >&2
exit 2
