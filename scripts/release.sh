#!/usr/bin/env bash
# Build a kp-themes release on this machine and upload it as a DRAFT
# (TH18, M1, KT9, CF1, scope-139). This replaces
# .github/workflows/release.yml step for step; GitHub Actions builds
# nothing any more.
#
#   scripts/release.sh 8.1.0             tag v8.1.0 at HEAD of a clean main
#                                        (package.json must already say 8.1.0),
#                                        build every asset from the tagged
#                                        tree, verify, push the tag, create
#                                        the draft release
#   DRY_RUN=1 scripts/release.sh 8.1.0   build and verify every asset into
#                                        .build/release/v8.1.0/; no tag, no
#                                        push, no release (HEAD is built when
#                                        the tag does not exist yet)
#
# The steps, in the workflow's order, all inside a clean checkout of the
# tag with the whole history (check:verdicts needs it [fix-52]):
#   npm ci · npm run gates · npm run checksums · tar -cf fonts.tar fonts ·
#   npm run tokens-tar · npm run consumer-tar ·
#   gh release create <tag> --draft --title <tag> --notes-file CHANGELOG.md
#     SHA256SUMS MIGRATION.md css/themes.css css/components.css
#     css/fonts.css dist/kp-themes.css dist/kp-themes.js fonts.tar
#     consumer.tar tokens.tar
# plus, before anything leaves the machine, KT9's check: every line of
# SHA256SUMS verified against the tagged tree.
#
# A draft, never a published release: pushing a tag is a technical act;
# publishing is Kenny's (docs/OPERATIONS_RUNBOOK.md, procedure 5.1).
# This project signs nothing (TH18): the checksums are the verification.
#
# Needs: bash, git, node 26 + npm, tar, sha256sum, gh (logged in, repo
# scope). Works the same on WSL and Garuda.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

version="${1:-}"
dry="${DRY_RUN:-0}"
[ "${2:-}" = "--dry-run" ] && dry=1
case "$version" in
  [0-9]*.[0-9]*.[0-9]*) ;;
  *) echo "usage: [DRY_RUN=1] scripts/release.sh <x.y.z>   (no leading v)" >&2; exit 2 ;;
esac
tag="v$version"

pkg_version="$(node -p 'require("./package.json").version')"
test "$pkg_version" = "$version" || {
  echo "refusing: package.json says $pkg_version, not $version (procedure 5.1 step 1: set it, npm run generate:all, commit)" >&2
  exit 1
}

if [ "$dry" != 1 ]; then
  test -z "$(git status --porcelain)" || { echo "refusing: working tree not clean; commit first" >&2; exit 1; }
  branch="$(git rev-parse --abbrev-ref HEAD)"
  test "$branch" = main || { echo "refusing: releases are cut from main, not $branch" >&2; exit 1; }
  git fetch -q origin main
  test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" || {
    echo "refusing: HEAD is not origin/main; push main first so the tag names a commit on it (procedure 5.1 steps 6-7)" >&2
    exit 1
  }
fi

# Nothing is released while a block is not approved in every theme
# (Kenny, 2026-09-16, scope-107). 8.1.0 went out with 18 pairs open
# because this rule was only written down [fix-87].
node gates/advice-approvals.mjs --require-all >/dev/null || {
  node gates/advice-approvals.mjs --require-all >&2 || true
  exit 1
}

if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
  ref="$tag"
  if [ "$dry" != 1 ] && [ "$(git rev-parse "$tag^{commit}")" != "$(git rev-parse HEAD)" ]; then
    echo "refusing: $tag exists but does not point at HEAD" >&2; exit 1
  fi
elif [ "$dry" = 1 ]; then
  ref=HEAD
  echo "· dry run: $tag does not exist, building from HEAD"
else
  git tag "$tag" HEAD
  ref="$tag"
fi

# A clean checkout of the tag: tracked files only, full history (a linked
# worktree shares this repository's objects).
# One full test run per release (Kenny, 2026-09-29): when the commit gate
# stamped exactly this tree green (workstation/bin/gate-stamp), the tag is
# that tree and `npm run gates` is not run a second time.
fresh=0
if [ -x "$HOME/Projects/workstation/bin/gate-stamp" ] && "$HOME/Projects/workstation/bin/gate-stamp" fresh; then fresh=1; fi

work="$(mktemp -d)"
cleanup() { git worktree remove --force "$work/src" >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT
git worktree add -q --detach "$work/src" "$ref"
src="$work/src"

(
  cd "$src"
  echo "== npm ci"
  npm ci
  # The tag must pass the same gates as a commit (H2, KT7).
  echo "== npm run gates"
  if [ "$fresh" = 1 ]; then
    echo "already green on this tree at commit (gate-stamp)"
  else
    npm run gates
  fi
  echo "== checksums"
  npm run checksums
  echo "== fonts.tar"
  tar -cf fonts.tar fonts
  echo "== tokens.tar"
  npm run tokens-tar
  echo "== consumer.tar"
  npm run consumer-tar
  # KT9: every published checksum against the tagged tree.
  echo "== verify SHA256SUMS"
  bad="$(sha256sum -c SHA256SUMS 2>&1 | grep -vc ': OK$' || true)"
  test "$bad" = 0 || { sha256sum -c SHA256SUMS | grep -v ': OK$' >&2; echo "SHA256SUMS: $bad line(s) not OK" >&2; exit 1; }
  echo "   $(wc -l < SHA256SUMS) files listed, all OK"
)

assets=(SHA256SUMS MIGRATION.md css/themes.css css/components.css css/fonts.css
  dist/kp-themes.css dist/kp-themes.js fonts.tar consumer.tar tokens.tar)
for a in "${assets[@]}"; do
  test -s "$src/$a" || { echo "missing release asset: $a" >&2; exit 1; }
done

if [ "$dry" = 1 ]; then
  out="$root/.build/release/$tag"
  rm -rf "$out" && mkdir -p "$out"
  for a in "${assets[@]}"; do cp "$src/$a" "$out/"; done
  cp "$src/CHANGELOG.md" "$out/release-notes.md"
  echo "✓ dry run for $tag: the ${#assets[@]} assets built from $ref and verified in .build/release/$tag/; nothing tagged, pushed or released"
  exit 0
fi

git push origin "$tag"
(
  cd "$src"
  gh release create "$tag" --verify-tag \
    --draft \
    --title "$tag" \
    --notes-file CHANGELOG.md \
    "${assets[@]}"
)
echo "✓ $tag: built here, tagged, pushed, and a DRAFT release created with ${#assets[@]} assets."
echo "  check: gh release view $tag --json tagName,isDraft,assets --jq '{tag:.tagName,draft:.isDraft,assets:[.assets[].name]}'"
echo "  publishing the draft is Kenny's call: gh release edit $tag --draft=false"
