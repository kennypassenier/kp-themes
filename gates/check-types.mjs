// What a consumer's type checker sees [KT4].
//
// The fault this closes: the package shipped no type declarations at all —
// no `types`, no `typings`, not one `.d.ts` — while README, USER_GUIDE and
// the ecosystem entry all promised a `Theme` type. JobTracker adopted
// 1.0.0 and got seven errors inside `node_modules/@kp-soft/themes`; their
// own code was clean.
//
// `npm run check:types` could not see it, and that is the shape worth
// remembering: it runs `tsc -p jsconfig.json`, which checks OUR sources
// with OUR resolution (`bundler`, `noUncheckedIndexedAccess` off). A
// consumer runs NodeNext with that flag on, against the published files.
// Same distance as the tarball defect the field test found: the gates run
// against the repository, a consumer runs against the package.
//
// So this gate does two things, and neither of them checks our sources:
//
//   1. The declarations on disk match what the sources would emit today.
//      Same contract as css/themes.css and ha/*.yaml — generated, and the
//      gate fails when they drift.
//   2. A fixture consumer under gates/consumer/ imports the package the
//      way JobTracker does and type-checks with a consumer's settings.
//      That is the half that would have caught this.
//
// Usage:
//   node gates/check-types.mjs           verify both
//   node gates/check-types.mjs --write   regenerate the declarations

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const TSC = join(ROOT, 'node_modules/.bin/tsc');
/** @param {string} dir @returns {string[]} every .d.ts under dir, repo-relative */
function declarations(dir) {
    /** @type {string[]} */
    const found = [];
    const walk = /** @param {string} at */ (at) => {
        for (const entry of readdirSync(at)) {
            // Ours, not our dependencies': node_modules is full of .d.ts
            // files and none of them is emitted from this repo.
            if (entry === 'node_modules' || entry === '.git' || entry === '.types-consumer') continue;
            const full = join(at, entry);
            if (statSync(full).isDirectory()) walk(full);
            else if (entry.endsWith('.d.ts')) found.push(relative(dir, full));
        }
    };
    walk(dir);
    return found.sort();
}

/** @param {unknown} error @returns {string} whatever tsc printed before it failed */
function output(error) {
    // Extracted rather than cast inline: prettier reformats an inline
    // JSDoc cast into `/** @type ... */ ((error).stdout ?? '')`, which
    // casts the wrong expression and stops type-checking.
    const carrier = /** @type {{stdout?: string}} */ (error);
    return (carrier.stdout ?? String(error)).trim();
}

/** @param {string} cwd @param {string[]} args */
function tsc(cwd, args) {
    return execFileSync(TSC, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

if (process.argv.includes('--write')) {
    // The declarations sit inside the directories the config includes, so
    // tsc reads them as inputs and refuses to overwrite them. Clearing
    // first is what makes this a regeneration rather than an error.
    for (const name of declarations(ROOT)) rmSync(join(ROOT, name));
    tsc(ROOT, ['-p', 'tsconfig.types.json']);
    console.log(`wrote ${declarations(ROOT).length} declaration files beside their sources.`);
    process.exit(0);
}

let failed = 0;

// 1 · Are the declarations on disk what the sources say today?
//
// Emitted into a scratch directory from the repo root rather than into a
// copy of the repo: tsc resolves its own bundled lib relative to where it
// runs, and a copied tree with a linked node_modules made it panic. The
// comparison is the same either way, and this way there is nothing to copy.
const scratch = mkdtempSync(join(tmpdir(), 'kp-themes-types-'));
try {
    try {
        tsc(ROOT, ['-p', 'tsconfig.types.json', '--outDir', scratch]);
    } catch (error) {
        console.error('gate broke: the declarations do not emit.');
        console.error(output(error));
        process.exit(1);
    }

    const fresh = declarations(scratch);
    const onDisk = declarations(ROOT);
    for (const name of fresh) {
        if (!onDisk.includes(name)) {
            failed++;
            console.error(`${name} would be emitted and is not on disk.`);
            continue;
        }
        if (readFileSync(join(scratch, name), 'utf8') !== readFileSync(join(ROOT, name), 'utf8')) {
            failed++;
            console.error(`${name} does not match what its source would emit.`);
        }
    }
    for (const name of onDisk) {
        if (!fresh.includes(name)) {
            failed++;
            console.error(`${name} is on disk and belongs to no source.`);
        }
    }
    if (failed > 0) console.error('Run `npm run generate:types` and commit the result.');

    // 2 · Does every published entry point carry a declaration?
    //
    // This is the half that would have caught the fault. It is deliberately
    // NOT "type-check as a consumer would": that was the first version, and
    // it could not fail. Twice. First because `paths` let TypeScript fall
    // back to the .js beside the missing .d.ts; then, after packing the
    // tarball into a real node_modules, because TypeScript 7 infers types
    // from a dependency's JSDoc anyway and reports nothing missing.
    // JobTracker runs a TypeScript that does not, which is why they saw
    // seven errors where this repo sees none — so a fixture pinned to our
    // compiler cannot reproduce their failure, and pretending otherwise
    // would be a green light that means nothing (standing rule 7e).
    //
    // What IS checkable here: the declarations exist, in the tarball, for
    // every path the package promises. That is exactly what was absent.
    const consumer = join(ROOT, '.types-consumer');
    rmSync(consumer, { recursive: true, force: true });
    try {
        const themes = join(consumer, 'node_modules', '@kp-soft', 'themes');
        mkdirSync(themes, { recursive: true });
        // npm 12 keys the JSON by package name rather than returning an
        // array, so take the one value rather than index into it.
        const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', consumer], { cwd: ROOT, encoding: 'utf8' }));
        const tarball = Object.values(packed)[0];
        if (tarball === undefined) throw new Error('gate broke: npm pack reported no tarball');
        execFileSync('tar', ['-xzf', join(consumer, /** @type {{filename: string}} */ (tarball).filename), '-C', themes, '--strip-components=1'], {
            stdio: 'ignore',
        });

        const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
        for (const [name, target] of Object.entries(pkg.exports ?? {})) {
            if (typeof target !== 'string') continue;
            // Only the JavaScript entry points: a stylesheet has no types.
            if (!/\.(js|jsx)$/.test(target)) continue;
            const declaration = join(themes, target.replace(/^\.\//, '').replace(/\.jsx?$/, '.d.ts'));
            if (!existsSync(declaration)) {
                failed++;
                console.error(`${name} ships ${target} with no declaration beside it — a consumer gets no types for it.`);
            }
        }

        // And the fixture consumer, for what it CAN prove: that the union
        // narrows, that the label map is complete, and that indexing under
        // noUncheckedIndexedAccess is guarded.
        cpSync(join(ROOT, 'gates/consumer/consumer.js'), join(consumer, 'consumer.js'));
        cpSync(join(ROOT, 'gates/consumer/jsconfig.json'), join(consumer, 'jsconfig.json'));
        tsc(consumer, ['-p', 'jsconfig.json']);
    } catch (error) {
        failed++;
        console.error('a consumer does not type-check against the packed package:');
        console.error(output(error).split('\n').slice(0, 12).join('\n'));
    } finally {
        rmSync(consumer, { recursive: true, force: true });
    }
} finally {
    rmSync(scratch, { recursive: true, force: true });
}

if (failed > 0) process.exit(1);
console.log(`Types: ${declarations(ROOT).length} declarations match their sources, and a consumer type-checks against them.`);
