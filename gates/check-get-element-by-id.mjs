// No raw `getElementById(` under js/, components/ and hooks/ [byid-1103].
//
// An id read from an attribute is empty when the attribute is missing, and Firefox logs "Empty string
// passed to getElementById()" for every such lookup. js/by-id.js (`byId(doc, id)`) answers null for a
// missing, empty or whitespace id; every lookup goes through it. There is no exception list.
//
// Usage: node gates/check-get-element-by-id.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const ROOT = new URL('../', import.meta.url).pathname;
const DIRS = ['js', 'components', 'hooks'];
/** The one file that may call it. */
const HELPER = 'js/by-id.js';
const SOURCE = /\.(js|jsx|ts|tsx|mjs)$/;

/** @param {string} dir @returns {string[]} */
function sources(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return sources(path);
        return SOURCE.test(entry.name) && !entry.name.endsWith('.d.ts') ? [path] : [];
    });
}

/** @param {string} text @returns {number[]} The 1-based lines that call getElementById outside a comment. */
export function findings(text) {
    return text
        .split('\n')
        .flatMap((line, index) => (!/^\s*(\*|\/\/|\/\*)/.test(line) && /getElementById\s*\(/.test(line) ? [index + 1] : []));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const files = DIRS.flatMap((dir) => sources(join(ROOT, dir))).filter((file) => file.replace(ROOT, '') !== HELPER);
    const failures = files.flatMap((file) =>
        findings(readFileSync(file, 'utf8')).map((line) => `[get-element-by-id] ${file.replace(ROOT, '')}:${line} — use byId(doc, id) from js/by-id.js.`),
    );
    if (failures.length > 0) {
        for (const failure of failures) console.error(failure);
        console.error(`\n${failures.length} raw getElementById call(s) over ${files.length} files.`);
        process.exit(1);
    }
    console.log(`getElementById: ${files.length} files under ${DIRS.join(', ')} look ids up through byId only.`);
}
