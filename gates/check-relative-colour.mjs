// A relative colour that resolves to nothing [fix-11].
//
// `hsl(from var(--primary) h s calc(l + 8%))` looks right and is not: in
// a relative `hsl()` the `l` channel resolves to a NUMBER, so adding a
// percentage to it is a type error, the declaration is dropped, and the
// element paints TRANSPARENT. No engine warns. Nothing in this package
// noticed for a whole round.
//
// Kenny found it by hovering one button: three themes reported the same
// symptom — "de verstuur knop is onleesbaar bij hover" — and the cause
// was one line written twenty times. Measured on 2026-09-12: 20 broken
// occurrences across 7 registers, every one of them a hover or active
// state that had been invisible in firefox since it was written.
//
// What the engine DOES accept, measured the same day:
//   hsl(from … h s l)            ✓
//   hsl(from … h s calc(l + 8))  ✓   a plain number, the fix
//   hsl(from … h s calc(l * 1.1))✓
//   oklch(from … calc(l + .05) c h) ✓
//   color-mix(in srgb, … )       ✓
//   hsl(from … h s calc(l + 8%)) ✗   transparent
//
// So the rule is narrow on purpose: a percentage added to a channel
// keyword inside a relative colour function. Everything else is fine and
// this gate says nothing about it.
//
// Usage: node gates/check-relative-colour.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** A channel keyword with a percentage added to it, inside a calc(). */
const BAD = /calc\(\s*(?:h|s|l|c|r|g|b|a|alpha)\s*[+\-*/]\s*[\d.]+%\s*\)/g;

/** @type {string[]} */
const failures = [];
const dir = `${ROOT}css/`;
let scanned = 0;

for (const name of readdirSync(dir).filter((f) => f.endsWith('.css'))) {
    const source = readFileSync(dir + name, 'utf8');
    scanned += 1;
    for (const line of source.split('\n').entries()) {
        const [index, text] = line;
        // Only inside a relative colour: `from` is what makes the channel
        // keyword mean anything at all.
        if (!/\b(?:hsl|hwb|rgb|lab|lch|oklab|oklch|color)\(\s*from\b/.test(text)) continue;
        for (const hit of text.match(BAD) ?? []) {
            failures.push(
                `css/${name}:${index + 1}: ${hit} — a channel keyword in a relative colour is a NUMBER, so adding a percentage drops the declaration and the element paints transparent. Write it without the percent sign.`,
            );
        }
    }
}

if (failures.length > 0) {
    for (const f of failures) console.error(f);
    console.error(`\n${failures.length} relative colour(s) that resolve to nothing.`);
    process.exit(1);
}

console.log(`Relative colours: ${scanned} stylesheets carry none that resolve to nothing [fix-11].`);
