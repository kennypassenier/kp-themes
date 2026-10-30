// Tags decide what runs [scope-33, Kenny 2026-09-13].
//
// Every browser test carries `@component:<name>`, `@theme:<name>` or
// `@sweep` through Playwright's own tag mechanism, and `tests/tags.json`
// says which tags a changed file needs. This module is the one place that
// reads both: the gate (gates/check-tags.mjs) asks it whether every test is
// tagged, and `npm run test:tags` asks it what a change selects.
//
// It replaces gates/affected.mjs, whose answer for any stylesheet or module
// was the whole suite. The price of the narrower answer is written down, not
// hidden: a building-level run trusts the map, the commit level adds every
// `@sweep` test, and a release still runs everything in both engines. The
// map was measured once against the old selection before it was trusted
// (standing rule 7i); the numbers are under `measured` in tests/tags.json.
//
// Three decisions make the map honest rather than clever:
//
//   1. A stylesheet change is read rule by rule. The changed lines of
//      css/components.css resolve to the selectors of the rules they sit in,
//      and `.kp-datatable__x` names the data table. A changed line in a rule
//      that names no component — a custom property on `:root`, a keyframe, a
//      rule for bare elements — falls back to `@sweep` and every component
//      the file defines, because nothing narrower can be claimed.
//   2. A register change selects its theme (`@theme:<theme>`: its own spec
//      and its slice of every per-theme sweep) plus the sweeps of the
//      components whose rules it restyles (`@sweep` AND `@component:x`).
//      A keyframe declared in five registers still governs whichever loads
//      last; that coupling is what the commit level's `@sweep` is for.
//   3. A changed spec file runs whole, and a changed helper or fixture runs
//      the specs that name it — selected by file, not by tag, because the
//      file is the exact unit there.
//
// Only comment moved in a stylesheet: nothing runs, as before — the minified
// twin a page loads carries no comments.

import process from 'node:process';
import { select } from './tags/specs-select.mjs';
import { changes } from './tags/changes.mjs';

export { ROOT, loadMap, themeNames, withoutComments } from './tags/repo.mjs';
export { declarations } from './tags/spec-declarations.mjs';
export { tagProblem, specFiles, ruleFor, vocabularyOf } from './tags/vocabulary.mjs';
export { changedLines, selectorChains, chainTags } from './tags/css-chains.mjs';
export { specsNaming, select } from './tags/specs-select.mjs';
export { grepFor } from './tags/grep.mjs';
export { changes } from './tags/changes.mjs';

// `node gates/tags.mjs [paths…]` prints what those paths (or, with none, the
// branch since `git merge-base HEAD main`) select, as JSON. Behind the
// entry-point check, because gates/check-tags.mjs and gates/run-tags.mjs
// import this module [fix-13].
if (import.meta.url === `file://${process.argv[1]}`) {
    const paths = process.argv.slice(2);
    console.log(JSON.stringify(select(changes(paths.length ? { files: paths } : {})), null, 2));
}
