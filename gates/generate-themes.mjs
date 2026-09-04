// Generates css/themes.css from the per-theme token source (T3, AR2).
//
// The stylesheet is assembled, not authored: generated token blocks
// between two hand-written partials. Most of that file is not tokens —
// the texture layer, the per-theme flourishes, the body rule, the
// scrollbar — and none of it is expressible as a colour token, so it
// lives in css/_rules.css and is concatenated unchanged.
//
// Nothing here may vary between runs (AR3): no timestamps, no host
// names, no commit hashes. `npm run generate -- --check` asserts the
// file on disk already matches, which is what the gates call.
//
// Usage:
//   node gates/generate-themes.mjs           write css/themes.css
//   node gates/generate-themes.mjs --check   exit 1 if it would change

import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const ORDER = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
const OUT = new URL('../css/themes.css', import.meta.url);

/**
 * One theme block, byte-identical to how it was authored.
 * @param {{selector: string, entries: Array<{raw?: string, token?: string, value?: string}>}} theme
 * @returns {string}
 */
function block(theme) {
    const body = theme.entries.map((e) => (e.raw !== undefined ? e.raw : `    --${e.token}: ${e.value};`));
    return [`${theme.selector} {`, ...body, '}'].join('\n');
}

function build() {
    const dir = new URL('../themes/', import.meta.url);
    const header = readFileSync(new URL('../css/_header.css', import.meta.url), 'utf8');
    const rules = readFileSync(new URL('../css/_rules.css', import.meta.url), 'utf8');
    const blocks = ORDER.map((name) => block(JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'))));
    // _rules.css already begins with the blank line that separated the last
    // token block from the authored rules, so one newline is enough here.
    return `${header}\n${blocks.join('\n\n')}\n${rules}`;
}

const generated = build();

if (process.argv.includes('--check')) {
    const current = readFileSync(OUT, 'utf8');
    if (current === generated) {
        console.log(`css/themes.css matches its source (${ORDER.length} themes).`);
        process.exit(0);
    }
    console.error('css/themes.css does not match its source.');
    console.error('Run `npm run generate` and commit the result.');
    process.exit(1);
}

writeFileSync(OUT, generated);
console.log(`wrote css/themes.css from ${ORDER.length} theme sources.`);
