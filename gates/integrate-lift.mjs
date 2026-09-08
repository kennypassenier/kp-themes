// Take one theme's lift out of an agent's worktree and into this one.
//
// Round six lifts nineteen themes at once, each built by its own agent in
// its own git worktree (Kenny, 2026-09-08: parallelise where possible).
// An agent owns its theme's own files; it may not own the shared wiring,
// because nineteen agents editing gates/config.json and package.json at
// the same time is nineteen conflicts. So this script does the halves
// separately:
//
//   THEME-SPECIFIC files are copied across verbatim — the register, the
//   spec, the anatomy, the tokens, the theme's entry in the concept
//   copy and its rows in the hooks file.
//
//   SHARED files are never copied. The wiring is done here, by the same
//   eleven-line pattern every register follows, and anything else the
//   agent touched is printed as a diff for a human to read and decide.
//
// Usage:
//   node gates/integrate-lift.mjs <theme> <worktree> [--apply]
//
// Without --apply it reports and changes nothing.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const here = (/** @type {string} */ path) => new URL(path, root).pathname;

/** The files a theme owns outright. */
const owned = (/** @type {string} */ theme) => [
    `css/${theme}-register.css`,
    `tests/register-${theme}.spec.mjs`,
    `themes/${theme}/anatomy.md`,
    `themes/${theme}/tokens.json`,
];

/** The shared files the wiring below rewrites; an agent's version is ignored. */
export const WIRED = [
    'package.json',
    'gates/config.json',
    'gates/checksums.mjs',
    'gates/check-register-coverage.mjs',
    'gates/compliance.mjs',
    'gates/generate-compare.mjs',
    'gates/generate-examples.mjs',
    'gates/generate-showcase.mjs',
    'gates/site/chrome.mjs',
    'tests/bare.spec.mjs',
    'tests/fixtures/bundle-loose.html',
    'tests/fixtures/button.html',
    'tests/fixtures/dashboard.html',
    'tests/fixtures/examples.html',
    'showcase/concept-copy.mjs',
    'themes/hooks.json',
];

/** Everything a generator writes: an agent's copy is worthless here. */
const GENERATED =
    /^(css\/themes\.css|css\/utilities\.css|css\/fonts\.css|dist\/|examples\/|showcase\/(index|themes)|showcase\/baseline|site\/|ha\/|reports\/|docs\/DESIGN_INVARIANTS\.md|.*\.d\.ts$|tests\/fixtures\/\.build\/)/;

/**
 * @param {string} worktree
 * @returns {string[]} every path the worktree changed against its base
 */
function changed(worktree) {
    const out = execFileSync('git', ['-C', worktree, 'status', '--porcelain'], { encoding: 'utf8' });
    return out
        .split('\n')
        .filter(Boolean)
        .map((line) => line.slice(3).trim())
        .filter((path) => path !== '');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const [theme, worktree] = process.argv.slice(2);
    const apply = process.argv.includes('--apply');
    if (!theme || !worktree) {
        console.error('usage: node gates/integrate-lift.mjs <theme> <worktree> [--apply]');
        process.exit(2);
    }
    const paths = changed(worktree);
    const mine = new Set(owned(theme));
    /** @type {string[]} */
    const copied = [];
    /** @type {string[]} */
    const review = [];
    for (const path of paths) {
        if (GENERATED.test(path)) continue;
        if (WIRED.includes(path)) continue;
        if (mine.has(path)) {
            copied.push(path);
            continue;
        }
        review.push(path);
    }
    for (const path of copied) {
        const from = `${worktree}/${path}`;
        if (!existsSync(from)) continue;
        if (apply) {
            mkdirSync(here(path).replace(/\/[^/]+$/, ''), { recursive: true });
            copyFileSync(from, here(path));
        }
        console.log(`${apply ? 'copied  ' : 'would copy'} ${path}`);
    }
    console.log('');
    // The theme's own entry in the two shared files it legitimately adds to.
    for (const shared of ['showcase/concept-copy.mjs', 'themes/hooks.json']) {
        const from = `${worktree}/${shared}`;
        if (!existsSync(from)) continue;
        const theirs = readFileSync(from, 'utf8');
        const ours = readFileSync(here(shared), 'utf8');
        if (theirs === ours) continue;
        console.log(`── ${shared}: the theme's own entry has to be lifted out by hand ──`);
        console.log(execFileSync('diff', ['-u', here(shared), from], { encoding: 'utf8', maxBuffer: 8 << 20 }).slice(0, 4000) || '(identical)');
    }
    if (review.length > 0) {
        console.log('\n── changed outside the theme and outside the wiring; read these ──');
        for (const path of review) {
            console.log(`\n=== ${path}`);
            try {
                console.log(execFileSync('diff', ['-u', here(path), `${worktree}/${path}`], { encoding: 'utf8', maxBuffer: 8 << 20 }).slice(0, 6000));
            } catch (error) {
                const diff = /** @type {{ stdout?: Buffer }} */ (error).stdout;
                console.log(String(diff ?? '(new file)').slice(0, 6000));
            }
        }
    }
    console.log(`\n${copied.length} theme file(s), ${review.length} file(s) to read, wiring done here.`);
}
