// `npm run test:tags` — run what a change selects, by tag [scope-33].
//
// Three levels (tests/tags.json, `levels`):
//
//   building   the tags of the changed files, firefox
//   commit     building plus every @sweep test, firefox
//   release    every test, chromium and firefox — `npm run test:browser`,
//              which stays Kenny's to authorise: this refuses to run it
//              without `--go`, and `--go` is given only on his word
//
// Firefox for the first two because Kenny's own browser is a firefox
// derivative and firefox has been the odd engine here more often than
// chromium (docs/RULES.md, correction fix-2).
//
// Usage:
//   npm run test:tags -- --level building                  since `git merge-base HEAD main`, plus uncommitted
//   npm run test:tags -- --level commit --files css/x.css  those paths, against HEAD
//   npm run test:tags -- --level building --commit <sha>   what one commit changed
//   npm run test:tags -- … --dry-run                       print the selection, the grep and the count; run nothing
//
// `--dry-run` counts with `playwright test --list`, which starts no browser
// and no server.

import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { ROOT, changes, grepFor, select } from './tags.mjs';

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
    if (!['building', 'commit', 'release'].includes(args.level)) throw new Error(`--level is building, commit or release, not ${args.level}`);
    return args;
}

/**
 * The playwright arguments for a level; null when there is nothing to run.
 *
 * @param {'building' | 'commit' | 'release'} level @param {string | null | ''} grep
 */
export function playwrightArgs(level, grep) {
    if (grep === '') return null;
    return ['playwright', 'test', ...(level === 'release' ? [] : ['--project=firefox']), ...(grep === null ? [] : ['--grep', grep])];
}

/** @param {string[]} args @returns {number | null} the count `--list` prints */
export function count(args) {
    const run = spawnSync('npx', [...args, '--list'], {
        cwd: ROOT,
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
    const level = /** @type {'building' | 'commit' | 'release'} */ (args.level);
    const selection = select(changes({ files: args.files, commit: args.commit }));
    for (const { file, why } of selection.reasons) console.log(`  ${file} → ${why}`);
    const grep = grepFor(selection, level);
    const pw = playwrightArgs(level, grep);
    console.log(
        `level ${level}: ${pw === null ? 'nothing to run' : grep === null ? `every test${level === 'release' ? ', both engines' : ', firefox'}` : `--grep ${grep}`}`,
    );
    if (args.dryRun) {
        if (pw) console.log(`tests: ${count(pw)}`);
        process.exit(0);
    }
    if (pw === null) process.exit(0);
    if (level === 'release' && !args.go) {
        console.error('The release level is the whole suite in both engines, and that is Kenny’s to authorise. Pass --go only with his go.');
        process.exit(2);
    }
    const run = spawnSync('npx', pw, { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] });
    process.exit(run.status ?? 1);
}
