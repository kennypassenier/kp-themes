// Run what the change needs, in the engine Kenny develops on [2026-09-09].
//
// `npm run test:affected` is the inner loop: firefox only, because his
// own browser is a firefox derivative and because firefox has been the
// odd engine here fourteen times against chromium's six — a difference
// shows up first where he will see it. Both engines still run before a
// push, and everything runs at a tag; that is `npm run test:browser`.
//
// What counts as affected is gates/affected.mjs, which answers `none`
// for a change no browser can observe, a list for a register or a spec,
// and `all` for everything else. The fallback is deliberate: a change to
// js/effects.js reaches most of the suite, and a map subtle enough to
// pretend otherwise is a map that is wrong in silence.
//
// Usage:
//   node gates/run-affected.mjs            since the last commit
//   node gates/run-affected.mjs origin/main   everything on this branch

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { affected, changes } from './affected.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const ref = process.argv[2] ?? null;
const what = affected(changes(ref));

if (what === 'none') {
    console.log('Nothing a browser can see has changed — no browser test to run.');
    process.exit(0);
}

const specs = what === 'all' ? [] : what;
console.log(what === 'all' ? 'Everything: the change reaches shared code.' : `Affected: ${specs.join(', ')}`);

const run = spawnSync('npx', ['playwright', 'test', '--project=firefox', ...specs], { cwd: ROOT, stdio: 'inherit' });
process.exit(run.status ?? 1);
