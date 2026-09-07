// The migration note points at things that exist [TH108].
//
// A note that tells a consumer to delete their own rule in favour of
// `.kp-stack` is worth nothing if `.kp-stack` was renamed the week
// after. So every class name the note mentions is compared with the
// class names the package actually declares -- the authored stylesheets
// plus the generated utility API.
//
// Only names written as a class (with the leading dot, in backticks) are
// read as claims. A name written without the dot is a reference to
// something discussed elsewhere, the same rule docs/UTILITIES.md uses.
//
// Drill: rename a class in the note and the gate names it.
//
// Usage: node gates/check-migration.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { names } from './generate-utilities.mjs';
import { stylesheets } from './stylesheets.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/**
 * Class names a stylesheet declares in a selector, `.` stripped.
 * @param {string} css
 * @returns {Set<string>}
 */
function declared(css) {
    const clean = css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
    /** @type {Set<string>} */
    const found = new Set();
    for (const chunk of clean.split('{')) {
        const cut = Math.max(chunk.lastIndexOf('}'), chunk.lastIndexOf(';'));
        const prelude = chunk.slice(cut + 1);
        if (prelude.trim().startsWith('@')) continue;
        for (const m of prelude.matchAll(/\.(kp-[A-Za-z0-9_-]+)/g)) found.add(m[1]);
    }
    return found;
}

const STYLESHEETS = stylesheets('classes').filter((file) => file !== 'css/tailwind-bridge.css');

/** @type {Set<string>} */
const existing = new Set(names());
for (const file of STYLESHEETS) {
    for (const name of declared(readFileSync(ROOT + file, 'utf8'))) existing.add(name);
}

const note = readFileSync(`${ROOT}MIGRATION.md`, 'utf8');
const claimed = [...new Set([...note.matchAll(/`\.(kp-[A-Za-z0-9_-]+)`/g)].map((m) => m[1]))];
const missing = claimed.filter((n) => !existing.has(n));

if (claimed.length === 0) {
    console.error('MIGRATION.md names no class at all — the gate is comparing against nothing.');
    process.exit(1);
}

if (missing.length > 0) {
    console.error('MIGRATION.md points at classes the package does not declare:');
    for (const n of missing) console.error(`  .${n}`);
    process.exit(1);
}

console.log(`Migration note: all ${claimed.length} classes it names exist among the ${existing.size} the package declares.`);
