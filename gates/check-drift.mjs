// A document that was not looked at after what it describes moved [scope-35].
//
// docs/drift.json lists every kept document with the files it describes
// (`sources`, globs over tracked files) and, per document, what those files
// and the document itself looked like when someone last confirmed the two
// agree: a sha256 per source file (`files`), one sha256 over all of them
// (`hash`) and the document's own sha256 (`doc`). Append-only records and
// generated documents are listed under `exempt`, each with its reason.
//
// `--check` refuses, per document:
//
//   1. a source file changed, added or removed since the record, while the
//      document is byte-identical to the record — the source moved and
//      nobody opened the document. The message names the document, the
//      files that moved, and the fix: read the document, update it if it
//      is wrong, then `npm run drift:seen -- <doc>`;
//   2. a glob in `sources` that matches no tracked file (a rename would
//      otherwise leave a document describing nothing, forever green);
//   3. a document that is missing, never recorded, or listed twice. Generated
//      outputs (dist/, site/, docs/MINIFIED.md) are never sources: a glob
//      is matched without them, so one that reaches only those is rule 2.
//
// When the document changed as well, the gate passes: an edit to the
// document in the same working tree counts as having looked. It prints a
// reminder to run `drift:seen`, because the gate never writes — until the
// record catches up, that document keeps passing on the strength of that
// one edit, which is the hole in this rule and the reason for the reminder.
//
// This is NOT infallible, and does not pretend to be. Touching a document
// counts as looking at it, whether the touch fixed anything or not. The gate
// knows files, not meaning: a source can change in a way that makes the
// document wrong while the file it lives in is not in `sources`, and a
// source can change in a way no sentence depends on and still trip it.
// What it does guarantee is that a listed source never moves silently.
//
// Usage:
//   node gates/check-drift.mjs --check
//   node gates/check-drift.mjs --seen <doc> [<doc> …]   rerecord those documents
//   --root <dir>   work on another checkout (the unit tests use a temp repo)

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, matchesGlob } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const MANIFEST = 'docs/drift.json';

/** Generated outputs: never a source; their generators already bind them. */
const GENERATED = ['dist/**', 'site/**', 'docs/MINIFIED.md'];

/** @param {string} file */
const isGenerated = (file) => GENERATED.some((glob) => matchesGlob(file, glob));

/** @param {string | Buffer} data */
const sha = (data) => createHash('sha256').update(data).digest('hex');

/**
 * Tracked files of the checkout at `root`, as git lists them.
 * @param {string} root
 * @returns {string[]}
 */
export function trackedFiles(root) {
    return execFileSync('git', ['ls-files', '-z', '--cached'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
        .split('\0')
        .filter(Boolean);
}

/**
 * The tracked files each glob matches, and the globs that match nothing.
 * @param {string[]} globs
 * @param {string[]} tracked
 * @param {string} [self] the document, never its own source
 */
export function matchSources(globs, tracked, self) {
    const files = new Set();
    const empty = [];
    for (const glob of globs) {
        // A plain path is a lookup; only a real glob pays for matching.
        const literal = !/[*?[\]{}]/.test(glob);
        const hits = literal
            ? tracked.includes(glob) && glob !== self && !isGenerated(glob)
                ? [glob]
                : []
            : tracked.filter((file) => file !== self && !isGenerated(file) && matchesGlob(file, glob));
        if (hits.length === 0) empty.push(glob);
        for (const hit of hits) files.add(hit);
    }
    return { files: [...files].sort(), empty };
}

/**
 * What the record would say now, for one document.
 * @param {string} root
 * @param {string} doc
 * @param {string[]} globs
 * @param {string[]} tracked
 */
export function snapshot(root, doc, globs, tracked) {
    const { files, empty } = matchSources(globs, tracked, doc);
    /** @type {Record<string, string>} */
    const hashes = {};
    for (const file of files) {
        const path = join(root, file);
        // A tracked file deleted in the working tree is a removed source.
        if (existsSync(path)) hashes[file] = sha(readFileSync(path));
    }
    const hash = sha(
        Object.keys(hashes)
            .sort()
            .map((file) => `${file}\0${hashes[file]}\n`)
            .join(''),
    );
    const docPath = join(root, doc);
    return { hash, doc: existsSync(docPath) ? sha(readFileSync(docPath)) : null, files: hashes, empty };
}

/**
 * @param {Record<string, string>} before
 * @param {Record<string, string>} after
 * @returns {string[]} one line per moved file
 */
export function movedFiles(before, after) {
    const moved = [];
    for (const file of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (!(file in after)) moved.push(`${file} (removed)`);
        else if (!(file in before)) moved.push(`${file} (added)`);
        else if (before[file] !== after[file]) moved.push(file);
    }
    return moved.sort();
}

/**
 * @param {string} root
 * @returns {{ documents: Record<string, any>, exempt: Record<string, string> }}
 */
export function readManifest(root) {
    return JSON.parse(readFileSync(join(root, MANIFEST), 'utf8'));
}

/**
 * Every refusal and every reminder for the checkout at `root`.
 * @param {string} root
 */
export function check(root) {
    const manifest = readManifest(root);
    const tracked = trackedFiles(root);
    const problems = [];
    const reminders = [];
    const exempt = manifest.exempt ?? {};
    for (const [doc, entry] of Object.entries(manifest.documents ?? {})) {
        if (doc in exempt) problems.push(`${doc}: listed under both documents and exempt`);
        if (!existsSync(join(root, doc))) {
            problems.push(`${doc}: the document does not exist`);
            continue;
        }
        const globs = entry.sources ?? [];
        if (globs.length === 0) problems.push(`${doc}: no sources — describe what it describes, or move it to exempt with a reason`);
        const now = snapshot(root, doc, globs, tracked);
        for (const glob of now.empty) {
            problems.push(`${doc}: source glob ${glob} matches no tracked file (generated outputs do not count; name the generator)`);
        }
        if (!entry.hash || !entry.files || !entry.doc) {
            problems.push(`${doc}: never recorded — read it, then run npm run drift:seen -- ${doc}`);
            continue;
        }
        const moved = movedFiles(entry.files, now.files);
        if (moved.length === 0 && now.hash === entry.hash) continue;
        if (now.doc !== entry.doc) {
            reminders.push(`${doc}: changed together with ${moved.length} source file(s); run npm run drift:seen -- ${doc} so the record catches up`);
            continue;
        }
        problems.push(
            `${doc}: ${moved.length} source file(s) moved and the document did not:\n` +
                moved.map((file) => `      ${file}\n`).join('') +
                `    read ${doc}, update it if it no longer holds, then run npm run drift:seen -- ${doc}`,
        );
    }
    for (const [doc, reason] of Object.entries(exempt)) {
        if (typeof reason !== 'string' || reason.trim() === '') problems.push(`${doc}: exempt without a reason`);
    }
    return { problems, reminders, documents: Object.keys(manifest.documents ?? {}).length };
}

/**
 * Rerecord the named documents. Refuses a name the manifest does not list.
 * @param {string} root
 * @param {string[]} docs
 */
export function seen(root, docs) {
    const manifest = readManifest(root);
    const tracked = trackedFiles(root);
    const problems = [];
    for (const doc of docs) {
        const entry = manifest.documents?.[doc];
        if (!entry) {
            problems.push(`${doc}: not a document in ${MANIFEST}`);
            continue;
        }
        const now = snapshot(root, doc, entry.sources ?? [], tracked);
        if (now.doc === null) {
            problems.push(`${doc}: the document does not exist`);
            continue;
        }
        for (const glob of now.empty) problems.push(`${doc}: source glob ${glob} matches no tracked file`);
        entry.hash = now.hash;
        entry.doc = now.doc;
        entry.files = now.files;
    }
    if (problems.length === 0) writeFileSync(join(root, MANIFEST), `${JSON.stringify(manifest, null, 4)}\n`);
    return problems;
}

function main() {
    const args = process.argv.slice(2);
    let root = fileURLToPath(new URL('..', import.meta.url));
    const rootAt = args.indexOf('--root');
    if (rootAt !== -1) {
        root = args[rootAt + 1];
        args.splice(rootAt, 2);
    }
    if (args[0] === '--seen') {
        const docs = args.slice(1);
        if (docs.length === 0) {
            console.error('usage: npm run drift:seen -- <doc> [<doc> …]');
            process.exit(2);
        }
        const problems = seen(root, docs);
        if (problems.length > 0) {
            console.error(`✘ drift: nothing recorded\n  ${problems.join('\n  ')}`);
            process.exit(1);
        }
        console.log(`✔ drift: recorded ${docs.join(', ')}`);
        return;
    }
    if (args[0] !== '--check') {
        console.error('usage: node gates/check-drift.mjs --check | --seen <doc> [<doc> …]');
        process.exit(2);
    }
    const { problems, reminders, documents } = check(root);
    for (const reminder of reminders) console.log(`  ! ${reminder}`);
    if (problems.length > 0) {
        console.error(`✘ drift: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
        process.exit(1);
    }
    console.log(`✔ drift: ${documents} documents, none left behind by what they describe`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
