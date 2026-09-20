// What a register places absolutely, and whether it hangs off what its
// author meant [fix-73].
//
// Kenny, 2026-09-20, reviewing nostromo's five side-navigation blocks:
// "hier staat een raar bolletje vast als ik scroll in de balk zelf". The
// dot was `[data-theme='nostromo'] .kp-sidenav__link::before`, placed
// absolutely — but nothing gave the row a `position`, so the dot resolved
// against the panel and stood in the middle of it while the list scrolled.
//
// The first search written for that correction answered 0 and was wrong: it
// compared selector text, so a row styled in a grouped rule — which is
// nostromo's shape exactly — never matched. This one compares the compound
// a selector ends on, the same reading `catalogue/block-hash.js` gives a
// block [scope-137], so `.kp-sidenav__link` positioned anywhere answers for
// `[data-theme='x'] .kp-sidenav__link::before`.
//
// A report, not a gate: a register may place something against the panel on
// purpose (a backdrop, a rail that spans the whole side), and nothing in the
// text says which was meant. It prints what to look at.
//
//   node gates/check-anchors.mjs
//   node gates/check-anchors.mjs --dir <path>   read another checkout's css/
import { readFileSync, readdirSync } from 'node:fs';
import process from 'node:process';
import { rightmostCompound, selectorList } from './generate-code-version.mjs';
import { selectorChains, withoutComments } from './tags.mjs';

/**
 * A pseudo-element rule that places itself absolutely, and the element it
 * hangs off, beside every compound this stylesheet positions.
 * @param {string} css
 */
export function anchorsOf(css) {
    const text = withoutComments(css);
    const chains = selectorChains(text);
    /** @type {{ selector: string, owner: string }[]} */
    const placed = [];
    /** @type {Set<string>} */
    const positioned = new Set();
    text.split('\n').forEach((raw, i) => {
        const line = raw.trim();
        const match = /^position:\s*(absolute|relative|fixed|sticky)\b/.exec(line);
        if (!match) return;
        const chain = chains(i + 1);
        const selector = [...chain.slice(0, -1)].filter((part) => !part.startsWith('@')).pop() ?? '';
        for (const one of selectorList(selector)) {
            // `rightmostCompound` already reads past the pseudo-element — it
            // is state, not a thing a block holds [scope-137] — so the
            // pseudo has to be spotted on the selector itself.
            const pseudo = /::?(before|after)\s*$/.test(one.trim());
            const compound = rightmostCompound(one);
            if (!compound) continue;
            if (pseudo) {
                if (match[1] === 'absolute') placed.push({ selector: one.trim(), owner: compound });
            } else positioned.add(compound);
        }
    });
    return { placed, positioned };
}

const dir = process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : new URL('../css/', import.meta.url);
const files = readdirSync(dir).filter((name) => name.endsWith('.css'));
// Per scope, never pooled [fix-73]: grotesk positions `.kp-sidenav__link`
// and phantom does too, and neither of them anchors nostromo's row. A
// register answers for itself plus the shared sheets, and nothing else.
const themeOf = (/** @type {string} */ file) => /^(.+)-register\.css$/.exec(file)?.[1] ?? '';
/** @type {Map<string, Set<string>>} */
const positioned = new Map();
/** @type {{ file: string, theme: string, selector: string, owner: string }[]} */
const placed = [];
for (const file of files) {
    const read = anchorsOf(readFileSync(new URL(file, dir instanceof URL ? dir : `file://${dir}/`), 'utf8'));
    const theme = themeOf(file);
    const seen = positioned.get(theme) ?? new Set();
    for (const compound of read.positioned) seen.add(compound);
    positioned.set(theme, seen);
    for (const one of read.placed) placed.push({ file, theme, ...one });
}
// `.kp-card[data-kp-label]` is anchored by a rule on `.kp-card`: an
// attribute narrows which cards a rule paints, it does not make a second
// element. So a compound answers for every compound that starts with it.
const base = (/** @type {string} */ compound) => (/^[.#]?[\w-]+/.exec(compound)?.[0] ?? compound).replace(/--[\w-]+$/, '');
const anchors = (/** @type {string} */ theme) => new Set([...(positioned.get('') ?? []), ...(positioned.get(theme) ?? [])].map(base));
const loose = placed.filter((one) => one.owner && !anchors(one.theme).has(base(one.owner)));
const owners = new Set(placed.map((one) => one.owner));
console.log(
    `anchors: ${placed.length} rule(s) place a pseudo-element absolutely, on ${owners.size} owner(s); ` +
        `${loose.length} of them hang off an element nothing positions.`,
);
for (const one of loose) console.log(`  ${one.file}  ${one.selector}  → nothing positions ${one.owner}`);
