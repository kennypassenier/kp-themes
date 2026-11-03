// No `style` attribute in an HTML string under js/ [csp-1103].
//
// A consumer that drops `style-src 'unsafe-inline'` from its Content-Security-Policy blocks every `style="…"` the
// parser meets in a string handed to innerHTML or insertAdjacentHTML; the same values set through CSSOM
// (`el.style.setProperty`, `el.style.cssText`) pass. This gate refuses a string that writes one, and a call that
// sets the attribute by name. There is no exception list: a site that cannot use CSSOM is a design question.
//
// Usage: node gates/check-markup-styles.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const ROOT = new URL('../js/', import.meta.url).pathname;

/** What counts as a style attribute written into a string, by name. */
export const PATTERNS = [
    { name: 'style attribute in a string', re: /[\s"'`<]style=/ },
    { name: 'setAttribute of style', re: /setAttribute\(\s*['"`]style['"`]/ },
];

/** @param {string} dir @returns {string[]} */
function sources(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return sources(path);
        return entry.name.endsWith('.js') ? [path] : [];
    });
}

/**
 * @param {string} text
 * @returns {Array<{ line: number, name: string }>}
 */
export function findings(text) {
    const found = [];
    for (const [index, line] of text.split('\n').entries()) {
        if (/^\s*(\*|\/\/|\/\*)/.test(line)) continue;
        for (const { name, re } of PATTERNS) if (re.test(line)) found.push({ line: index + 1, name });
    }
    return found;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const files = sources(ROOT);
    const failures = files.flatMap((file) =>
        findings(readFileSync(file, 'utf8')).map((f) => `[markup-style] ${file.replace(ROOT, 'js/')}:${f.line} — ${f.name}; set it through el.style.setProperty after insertion.`),
    );
    if (failures.length > 0) {
        for (const failure of failures) console.error(failure);
        console.error(`\n${failures.length} style attribute(s) in markup strings over ${files.length} files.`);
        process.exit(1);
    }
    console.log(`Markup styles: ${files.length} js files write no style attribute into a string.`);
}
