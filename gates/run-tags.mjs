// `npm run test:tags` — run what a change selects, by tag [scope-33].
//
// Four levels (tests/tags.json, `levels`):
//
//   building   the tags of the changed files, firefox
//   commit     building plus every @sweep test, firefox
//   engines    the commit selection in chromium AND firefox, at the close of
//              a layer and after a fix to paint, focus or the keyboard
//              [fix-51]: the release run of 6.1.0 found eighteen tests red
//              that only chromium saw, because nothing before the release
//              asked it
//   release    every test, chromium and firefox — `npm run test:browser`,
//              which stays Kenny's to authorise: this refuses to run it
//              without `--go`, and `--go` is given only on his word
//   changed    the release run of a minor or patch release [Kenny, form v9,
//              2026-10-04: "Alleen wat veranderde"]: the tags of everything
//              changed since the last release tag, plus every @sweep test,
//              each sweep over all 22 themes. A major release, or a change
//              the map cannot narrow, runs every test. Also only on his go
//              (`--go`), like the release level it stands in for.
//
// Firefox alone for the first two because Kenny's own browser is a firefox
// derivative and firefox has been the odd engine here more often than
// chromium (docs/RULES.md, correction fix-2).
//
// The level also decides how wide a theme sweep runs [scope-103]: at
// building, commit and engines this sets KP_SWEEP_THEMES, which
// tests/helpers/sweep-themes.mjs reads, to formal, dark and cyberpunk; at
// release it sets nothing, so every sweep runs on all 22. The variable is
// set on the child, never on this process, so nothing else inherits it.
//
// Usage:
//   npm run test:tags -- --level building                  since `git merge-base HEAD main`, plus uncommitted
//   npm run test:tags -- --level commit --files css/x.css  those paths, against HEAD
//   npm run test:tags -- --level building --commit <sha>   what one commit changed
//   npm run test:tags -- … --dry-run                       print the selection, the grep and the count; run nothing
//
// `--dry-run` counts with `playwright test --list`, which starts no browser
// and no server.

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { ROOT, changes, grepFor, select } from './tags.mjs';
import { NARROW_THEMES } from '../tests/helpers/sweep-themes.mjs';

/**
 * The environment a level runs its playwright in.
 *
 * @param {'building' | 'commit' | 'engines' | 'release' | 'changed'} level
 * @returns {NodeJS.ProcessEnv}
 */
export function envFor(level) {
    return level === 'release' || level === 'changed' ? { ...process.env } : { ...process.env, KP_SWEEP_THEMES: NARROW_THEMES.join(',') };
}

/**
 * The last release tag and whether the version in package.json is a major
 * step past it: a major release runs every test.
 *
 * @returns {{ tag: string, major: boolean }}
 */
export function lastRelease() {
    const tag = execFileSync('git', ['-C', ROOT, 'describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*'], { encoding: 'utf8' }).trim();
    const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
    return { tag, major: Number(version.split('.')[0]) > Number(tag.slice(1).split('.')[0]) };
}

/** @param {string[]} argv */
export function parse(argv) {
    const args = {
        level: 'building',
        files: /** @type {string[] | undefined} */ (undefined),
        commit: /** @type {string | undefined} */ (undefined),
        dryRun: false,
        go: false,
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--level') args.level = argv[++i];
        else if (a.startsWith('--level=')) args.level = a.slice('--level='.length);
        else if (a === '--commit') args.commit = argv[++i];
        else if (a === '--dry-run') args.dryRun = true;
        else if (a === '--go') args.go = true;
        else if (a === '--files') {
            args.files = [];
            while (argv[i + 1] && !argv[i + 1].startsWith('--')) args.files.push(argv[++i]);
        } else throw new Error(`unknown argument ${a}`);
    }
    if (!['building', 'commit', 'engines', 'release', 'changed'].includes(args.level))
        throw new Error(`--level is building, commit, engines, release or changed, not ${args.level}`);
    return args;
}

/**
 * The playwright arguments for a level; null when there is nothing to run.
 *
 * @param {'building' | 'commit' | 'engines' | 'release' | 'changed'} level @param {string | null | ''} grep
 */
export function playwrightArgs(level, grep) {
    if (grep === '') return null;
    return [
        'playwright',
        'test',
        ...(level === 'release' || level === 'engines' ? [] : ['--project=firefox']),
        ...(grep === null ? [] : ['--grep', grep]),
    ];
}

/** @param {string[]} args @param {NodeJS.ProcessEnv} [env] @returns {number | null} the count `--list` prints */
export function count(args, env) {
    const run = spawnSync('npx', [...args, '--list'], {
        cwd: ROOT,
        env: env ?? process.env,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 64 * 1024 * 1024,
    });
    const m = `${run.stdout}`.match(/Total: (\d+) tests? in (\d+) files?/);
    if (m) return Number(m[1]);
    return /No tests found/.test(`${run.stdout}${run.stderr}`) ? 0 : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let args;
    try {
        args = parse(process.argv.slice(2));
    } catch (e) {
        console.error(/** @type {Error} */ (e).message);
        process.exit(2);
    }
    let level = /** @type {'building' | 'commit' | 'engines' | 'release' | 'changed'} */ (args.level);
    let base;
    if (level === 'changed') {
        const last = lastRelease();
        console.log(`since ${last.tag}${last.major ? ': a major release, so every test' : ''}`);
        if (last.major) level = 'release';
        base = last.tag;
    }
    const selection = select(changes({ files: args.files, commit: args.commit, base }));
    for (const { file, why } of selection.reasons) console.log(`  ${file} → ${why}`);
    const grep = grepFor(selection, level);
    const pw = playwrightArgs(level, grep);
    console.log(
        `level ${level}: ${pw === null ? 'nothing to run' : grep === null ? `every test${level === 'release' || level === 'engines' ? ', both engines' : ', firefox'}` : `--grep ${grep}${level === 'engines' ? ', both engines' : ''}`}`,
    );
    const env = envFor(level);
    if (level !== 'release' && level !== 'changed')
        console.log(`theme sweeps: ${NARROW_THEMES.join(', ')} (all 22 at the release level) [scope-103]`);
    if (args.dryRun) {
        if (pw) console.log(`tests: ${count(pw, env)}`);
        process.exit(0);
    }
    if (pw === null) process.exit(0);
    if ((level === 'release' || level === 'changed') && !args.go) {
        console.error('The release levels run on Kenny’s go alone. Pass --go only with his go.');
        process.exit(2);
    }
    const run = spawnSync('npx', pw, { cwd: ROOT, env, stdio: ['ignore', 'inherit', 'inherit'] });
    process.exit(run.status ?? 1);
}
