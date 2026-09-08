// Wire one new register into the eleven places that must know about it.
//
// Every lift needs the same eleven edits, and doing them by hand nineteen
// times is nineteen chances to forget one — which is exactly how a gate
// goes red an hour later for a reason that has nothing to do with the
// theme. Each edit is anchored on the register that came before it in
// `themes/order.json`, so the lists stay in the themes' own order.
//
// Usage:
//   node gates/wire-register.mjs <theme> [--check]
//
// --check reports what is missing and changes nothing.

import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');
const write = (/** @type {string} */ path, /** @type {string} */ text) => writeFileSync(new URL(path, root), text);

/**
 * Put `line` into `source` right after the last line that mentions any of
 * `afterOneOf`, when `line` is not already there.
 *
 * @param {string} source
 * @param {string} line the whole line, indentation included
 * @param {string[]} afterOneOf substrings of the lines this one follows
 * @returns {{ text: string, added: boolean }}
 */
export function insertAfter(source, line, afterOneOf) {
    if (source.includes(line.trim())) return { text: source, added: false };
    const lines = source.split('\n');
    let at = -1;
    for (const [index, text] of lines.entries()) if (afterOneOf.some((needle) => text.includes(needle))) at = index;
    if (at === -1) throw new Error(`no anchor among ${afterOneOf.join(', ')}`);
    lines.splice(at + 1, 0, line);
    return { text: lines.join('\n'), added: true };
}

/**
 * The eleven edits, as (file, the line to add, the anchors it follows).
 *
 * @param {string} theme
 * @returns {{ file: string, line: string, after: string[] }[]}
 */
export function edits(theme) {
    const sheet = `css/${theme}-register.css`;
    const built = ['brutalism', 'terminal', 'phantom', 'synthwave', 'retro', 'cyberpunk'];
    const after = (/** @type {string} */ shape) => built.map((name) => shape.replace('<t>', name));
    return [
        {
            file: 'package.json',
            line: `        "./css/${theme}-register": "./css/${theme}-register.css",`,
            after: after('"./css/<t>-register": "./css/'),
        },
        {
            file: 'gates/config.json',
            line: `        "${sheet}": ["authored", "bundled", "classes", "motion", "texture"],`,
            after: after('"css/<t>-register.css": ['),
        },
        { file: 'gates/checksums.mjs', line: `    '${sheet}',`, after: after("<t>-register.css'") },
        { file: 'gates/check-register-coverage.mjs', line: `    '${sheet}',`, after: after("<t>-register.css'") },
        { file: 'gates/generate-examples.mjs', line: `    '${theme}-register.css',`, after: after("<t>-register.css'") },
        { file: 'gates/generate-compare.mjs', line: `    '${theme}-register.css',`, after: after("<t>-register.css'") },
        {
            file: 'gates/site/chrome.mjs',
            line: `        <link rel="stylesheet" href="\${up}css/${theme}-register.css" />`,
            after: after('css/<t>-register.css" />'),
        },
    ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const theme = process.argv[2];
    const check = process.argv.includes('--check');
    if (!theme) {
        console.error('usage: node gates/wire-register.mjs <theme> [--check]');
        process.exit(2);
    }
    let missing = 0;
    for (const { file, line, after } of edits(theme)) {
        const source = read(file);
        const { text, added } = insertAfter(source, line, after);
        if (!added) {
            console.log(`ok      ${file}`);
            continue;
        }
        missing++;
        if (check) console.log(`MISSING ${file}: ${line.trim()}`);
        else {
            write(file, text);
            console.log(`wired   ${file}`);
        }
    }
    console.log(
        `\n${missing === 0 ? 'nothing to do' : check ? `${missing} place(s) still to wire` : `${missing} place(s) wired`}.` +
            '\nThe rest is by hand and by eye: gates/compliance.mjs (three lists), gates/generate-showcase.mjs (twice),' +
            '\ntests/bare.spec.mjs (the regex), the four fixtures under tests/fixtures/, and themes/hooks.json.',
    );
    if (check && missing > 0) process.exit(1);
}
