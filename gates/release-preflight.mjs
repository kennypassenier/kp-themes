// Everything scripts/release.sh would refuse, listed at once and in seconds,
// before anyone says a release is ready (2026-10-03: Claude told Kenny five
// portrait pairs did not block 9.0.0 without checking, and the release
// script refused on exactly those). Run it before a release form and before
// any "nothing blocks" sentence.
//
//   node gates/release-preflight.mjs <x.y.z>
//
// It does not take the screenshots (the slow part of a release); it reads
// what the last screenshot check recorded and says whether files that check
// covers moved since, in which case the release will photograph again.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const version = process.argv[2];
/** @param {...string} args */
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
/** @type {string[]} */
const refusals = [];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
    console.error('usage: node gates/release-preflight.mjs <x.y.z>');
    process.exit(2);
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')).version;
if (pkg !== version) refusals.push(`package.json says ${pkg}, not ${version}`);

const dirty = git('status', '--porcelain');
if (dirty) refusals.push(`the working tree is not clean (${dirty.split('\n').length} path(s))`);
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'main') refusals.push(`HEAD is on ${branch}, not main`);
try {
    git('fetch', '-q', 'origin', 'main');
    if (git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main')) refusals.push('HEAD is not origin/main: push main first');
} catch {
    refusals.push('origin/main could not be fetched');
}
try {
    git('rev-parse', '-q', '--verify', `refs/tags/v${version}`);
    refusals.push(`v${version} is already tagged`);
} catch {
    /* not tagged yet: as it should be */
}

// What the last screenshot check left open: every pair it did not carry,
// catalogue and research pages alike (the release script refuses on both),
// unless a verdict was recorded after it (catalogue/judgements.js reads a
// reopening only while the verdict is the one the check compared against).
const checks = JSON.parse(readFileSync('catalogue/pixel-checks.json', 'utf8'));
const verdicts = JSON.parse(readFileSync('catalogue/verdicts.json', 'utf8')).verdicts ?? {};
/** @type {string[]} */
const open = [];
for (const [key, themes] of Object.entries(checks.checks ?? {})) {
    for (const [theme, engines] of Object.entries(/** @type {Record<string, unknown>} */ (themes))) {
        for (const [engine, check] of Object.entries(/** @type {Record<string, { state: string }>} */ (engines))) {
            const given = verdicts[key]?.[theme]?.[engine]?.commit;
            if (check.state !== 'carried' && (!given || given === /** @type {any} */ (check).from))
                open.push(`${key} · ${theme} · ${engine} (${check.state})`);
        }
    }
}
if (open.length) refusals.push(`${open.length} pair(s) the last screenshot check did not carry:\n    ${open.join('\n    ')}`);

// Files the screenshot check reads that moved since it last ran: the release
// will photograph again, and may find more.
const moved = git('diff', '--name-only', `${checks.commit}..HEAD`, '--', 'css', 'js', 'catalogue', 'research/theme-portraits')
    .split('\n')
    .filter((path) => path && !/^catalogue\/(verdicts|pixel-checks|hashes-now)\.json$/.test(path));
if (moved.length)
    refusals.push(
        `${moved.length} file(s) the screenshot check reads moved since it ran at ${checks.commit.slice(0, 12)}: the release photographs again (${moved.slice(0, 5).join(', ')}${moved.length > 5 ? ', …' : ''})`,
    );

try {
    execFileSync('node', ['gates/advice-approvals.mjs', '--require-all'], { stdio: 'pipe' });
} catch (/** @type {any} */ error) {
    refusals.push(
        `not every block is approved in every theme:\n    ${String(error.stdout ?? '')
            .trim()
            .split('\n')
            .slice(-3)
            .join('\n    ')}`,
    );
}

if (refusals.length) {
    console.error(`release ${version} would be refused or would photograph again:\n  - ${refusals.join('\n  - ')}`);
    process.exit(1);
}
console.log(`release ${version}: nothing the release script refuses on, and the screenshot check is current`);
