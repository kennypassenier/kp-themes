// File-size gate: no hand-written source file grows past LIMIT lines.
//
// Kenny, 2026-10-30: a 35 000-line stylesheet is "absoluut onacceptabel" and
// must never happen again. Covers css/**/*.css, js/**/*.js and
// gates/**/*.mjs. Generated and vendored files are exempt (see
// gates/file-size.json "exempt").
//
// Files that are over the limit today are on the dated "toSplit" list in
// gates/file-size.json, with their line count at the time. The list can only
// SHRINK: a listed file that grows fails, a listed file that shrinks must have
// its recorded count lowered (a ratchet), and one that is back under the limit
// must come off the list. A file that is over the limit and not listed fails.
//
// Usage: node gates/check-file-size.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(readFileSync(join(ROOT, 'gates/file-size.json'), 'utf8'));
const LIMIT = config.limit;

/** @param {string} path @returns {boolean} */
const exempt = (path) =>
    config.exempt.some((/** @type {string} */ e) =>
        e.endsWith('/')
            ? path.startsWith(e)
            : e.includes('*')
              ? new RegExp('^' + e.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$').test(path)
              : path === e,
    );

/** @param {string} dir @returns {string[]} */
function walk(dir) {
    return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((/** @type {import("node:fs").Dirent} */ e) => {
        const p = `${dir}/${e.name}`;
        if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p);
        return [p];
    });
}

const covered = [
    ...walk('css').filter((p) => p.endsWith('.css')),
    ...walk('js').filter((p) => p.endsWith('.js')),
    ...walk('gates').filter((p) => p.endsWith('.mjs')),
].filter((p) => !exempt(p));

const lines = (/** @type {string} */ p) => readFileSync(join(ROOT, p), 'utf8').split('\n').length - 1;
const listed = /** @type {Record<string, number>} */ (config.toSplit.files);
const failures = [];
const offenders = /** @type {[string, number][]} */ ([]);
for (const p of covered) {
    const n = lines(p);
    if (n > LIMIT) offenders.push([p, n]);
    const rec = listed[p];
    if (n > LIMIT && rec === undefined) failures.push(`${p} has ${n} lines (limit ${LIMIT}); split it into parts, one component or concern per file`);
    else if (n > LIMIT && n > rec) failures.push(`${p} grew to ${n} lines from ${rec}; a file on the to-split list may only shrink`);
    else if (n > LIMIT && n < rec) failures.push(`${p} shrank to ${n} lines; lower its entry in gates/file-size.json from ${rec} to ${n}`);
    else if (n <= LIMIT && rec !== undefined)
        failures.push(`${p} is down to ${n} lines (limit ${LIMIT}); remove it from the to-split list in gates/file-size.json`);
}
for (const p of Object.keys(listed))
    if (!covered.includes(p)) failures.push(`${p} is on the to-split list but no longer exists (or is exempt); remove the entry`);

offenders.sort((a, b) => b[1] - a[1]);
console.log(
    `check-file-size: limit ${LIMIT} lines, ${covered.length} files checked, ${offenders.length} over the limit (to-split list of ${config.toSplit.date}: ${Object.keys(listed).length} files)`,
);
for (const [p, n] of offenders) console.log(`  ${String(n).padStart(6)}  ${p}${listed[p] === undefined ? '  NOT LISTED' : ''}`);
if (failures.length) {
    console.error(failures.map((f) => `check-file-size: ${f}`).join('\n'));
    process.exit(1);
}
