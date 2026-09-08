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

/** How a theme's key is written in showcase/concept-copy.mjs. */
const key = (/** @type {string} */ theme) => (/^[a-z][a-z0-9]*$/.test(theme) ? theme : `'${theme}'`);

/**
 * One theme's block out of a `{ theme: { … }, … }` module, by brace depth.
 *
 * @param {string} file
 * @param {string} theme
 * @returns {string | null}
 */
function lift(file, theme) {
    if (!existsSync(file)) return null;
    const source = readFileSync(file, 'utf8');
    const head = `\n    ${key(theme)}: {`;
    const start = source.indexOf(head);
    if (start === -1) return null;
    let depth = 0;
    for (let at = start + 1; at < source.length; at++) {
        if (source[at] === '{') depth++;
        else if (source[at] === '}') {
            depth--;
            if (depth === 0) return source.slice(start + 1, source.indexOf('\n', at) + 1).replace(/\n$/, '');
        }
    }
    return null;
}

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
    // The theme's own entry in the two shared files it legitimately adds
    // to, lifted out by key rather than by merging the whole file: every
    // agent edited its own copy of these, and only its own theme's block
    // belongs here.
    const copyEntry = lift(`${worktree}/showcase/concept-copy.mjs`, theme);
    if (copyEntry) {
        const ours = readFileSync(here('showcase/concept-copy.mjs'), 'utf8');
        if (ours.includes(`\n    ${key(theme)}: {`)) console.log('showcase/concept-copy.mjs already carries this theme');
        else if (apply) {
            const at = ours.lastIndexOf('\n};');
            writeFileSync(here('showcase/concept-copy.mjs'), ours.slice(0, at) + '\n' + copyEntry + ours.slice(at));
            console.log(`copied   the ${theme} entry into showcase/concept-copy.mjs (${copyEntry.split('\n').length} lines)`);
        } else console.log(`would copy the ${theme} entry into showcase/concept-copy.mjs (${copyEntry.split('\n').length} lines)`);
    } else console.log(`showcase/concept-copy.mjs: no ${theme} entry in the worktree`);

    const theirHooks = JSON.parse(readFileSync(`${worktree}/themes/hooks.json`, 'utf8'));
    const ourHooks = JSON.parse(readFileSync(here('themes/hooks.json'), 'utf8'));
    const rows = theirHooks[theme] ?? theirHooks.themes?.[theme];
    if (rows === undefined) console.log(`themes/hooks.json: no ${theme} rows in the worktree`);
    else if (JSON.stringify(rows) === JSON.stringify(ourHooks[theme] ?? ourHooks.themes?.[theme]))
        console.log('themes/hooks.json already carries these rows');
    else if (apply) {
        if (ourHooks.themes) ourHooks.themes[theme] = rows;
        else ourHooks[theme] = rows;
        writeFileSync(here('themes/hooks.json'), JSON.stringify(ourHooks, null, 4) + '\n');
        console.log(`copied   the ${theme} rows into themes/hooks.json`);
    } else console.log(`would copy the ${theme} rows into themes/hooks.json`);
    if (review.length > 0) {
        console.log('\n── changed outside the theme and outside the wiring; read these ──');
        for (const path of review) {
            console.log(`\n=== ${path}`);
            // diff exits 1 when the files differ, which is the normal case
            // here, so its output is read from the error as well.
            try {
                console.log(execFileSync('diff', ['-u', here(path), `${worktree}/${path}`], { encoding: 'utf8', maxBuffer: 8 << 20 }).slice(0, 6000));
            } catch (error) {
                console.log(String(/** @type {{ stdout?: Buffer }} */ (error).stdout ?? '(new file)').slice(0, 6000));
            }
        }
    }
    console.log(`\n${copied.length} theme file(s), ${review.length} file(s) to read, wiring done here.`);
}
