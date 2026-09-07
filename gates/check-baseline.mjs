// The vendored 4.0.0 bundle is the release's own [MR-R6-COMPARE, S20].
//
// examples/compare.html shows the concept demo under the 4.0.0 release on
// the left and the current build on the right. The left side needs the
// 4.0.0 stylesheet and script, so they are vendored under
// showcase/baseline/4.0.0/ beside that release's SHA256SUMS — and this
// gate holds every vendored file to the checksum the release published,
// so the baseline can never drift into something 4.0.0 never shipped. A
// released version never changes (S20); this is the package comparing
// itself to its own promise.
//
// Drilled red 2026-09-07: one byte appended to kp-themes.css → "does not
// match the checksum 4.0.0 published"; restored.
//
// Usage: node gates/check-baseline.mjs

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);

/** The vendored baselines: version → the files and the name each carries in that release's SHA256SUMS. */
export const BASELINES = {
    '4.0.0': { 'kp-themes.css': 'dist/kp-themes.css', 'kp-themes.js': 'dist/kp-themes.js' },
};

/**
 * @param {string} sums the SHA256SUMS text
 * @param {string} name the path as the release names it
 * @returns {string | null}
 */
export function publishedSum(sums, name) {
    for (const line of sums.split('\n')) {
        const m = line.match(/^([0-9a-f]{64})\s+\*?(.+)$/);
        if (m && m[2].trim() === name) return m[1];
    }
    return null;
}

/**
 * @param {string} version
 * @param {(file: string) => Buffer | null} read
 * @returns {string[]} problems
 */
export function audit(version, read) {
    const files = BASELINES[/** @type {keyof typeof BASELINES} */ (version)];
    /** @type {string[]} */
    const problems = [];
    const sums = read('SHA256SUMS');
    if (sums === null)
        return [`showcase/baseline/${version}/SHA256SUMS is missing — the release's own checksum file belongs beside the vendored files`];
    for (const [file, name] of Object.entries(files)) {
        const bytes = read(file);
        if (bytes === null) {
            problems.push(`showcase/baseline/${version}/${file} is missing`);
            continue;
        }
        const expected = publishedSum(sums.toString('utf8'), name);
        if (expected === null) {
            problems.push(`showcase/baseline/${version}/SHA256SUMS names no ${name}`);
            continue;
        }
        const actual = createHash('sha256').update(bytes).digest('hex');
        if (actual !== expected)
            problems.push(
                `showcase/baseline/${version}/${file} does not match the checksum ${version} published (${actual.slice(0, 12)}… vs ${expected.slice(0, 12)}…)`,
            );
    }
    return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;
    for (const version of Object.keys(BASELINES)) {
        const dir = new URL(`showcase/baseline/${version}/`, root);
        const problems = audit(version, (file) => (existsSync(new URL(file, dir)) ? readFileSync(new URL(file, dir)) : null));
        checked += Object.keys(BASELINES[/** @type {keyof typeof BASELINES} */ (version)]).length;
        for (const p of problems) {
            failed++;
            console.error(p);
        }
    }
    if (failed > 0) {
        console.error(`\n${failed} baseline fault(s).`);
        process.exit(1);
    }
    console.log(`Baseline: ${checked} vendored file(s) match the checksums their release published (${Object.keys(BASELINES).join(', ')}).`);
}
