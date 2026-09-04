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
import { derive } from './colour.mjs';

const ORDER = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
const OUT = new URL('../css/themes.css', import.meta.url);

const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/**
 * Surfaces that are genuinely interactive, and therefore need states.
 *
 * Buttons and the selected surface — not the alert plates. `--success`,
 * `--warning` and `--info` are the background of a message, and a message
 * does not respond to a cursor; deriving states for them produced values
 * whose own ink no longer read, which is the gate catching a modelling
 * mistake rather than a colour one.
 */
const INTERACTIVE = ['primary', 'secondary', 'accent', 'destructive'];

/**
 * State values are derived, not authored [DI3, AR2].
 *
 * Carbon's grammar: hover is half a step, selected one, pressed two. The
 * step is a lightness move in OKLCh so it looks the same size in every
 * theme (AR4) — a numeric HSL step does not, which is what makes the
 * worst-case shortcut of AR12 sound.
 *
 * A theme may record its own step size in its token file. Cyberpunk and
 * terminal do: neon has almost nowhere lighter to go before magenta turns
 * pink, and a phosphor brightens rather than darkens. Both say so in their
 * anatomy documents, and both forfeit AR12's shortcut in exchange.
 *
 * @param {{tokens: Record<string,string>, dark: boolean, stepL: number}} ctx
 */
function derivedStates({ tokens, dark, stepL }) {
    const out = [];
    const d = CONFIG.derivation;
    for (const surface of INTERACTIVE) {
        const base = tokens[surface];
        if (base === undefined) continue;
        for (const [state, steps] of [
            ['hover', d.hover],
            ['active', d.active],
            ['disabled', d.disabled],
        ]) {
            const value =
                state === 'disabled' ? derive(base, 1.5, { towardsLight: !dark, stepL }) : derive(base, steps, { towardsLight: dark, stepL });
            out.push(`    --${surface}-${state}: ${value};`);
        }
    }
    return out;
}

/**
 * One theme block: the authored entries verbatim, then the derived states.
 * @param {{selector: string, entries: Array<{raw?: string, token?: string, value?: string}>, derivation?: {stepL: number}}} theme
 * @returns {string}
 */
function block(theme) {
    const body = theme.entries.map((e) => (e.raw !== undefined ? e.raw : `    --${e.token}: ${e.value};`));
    const tokens = Object.fromEntries(theme.entries.filter((e) => e.token !== undefined).map((e) => [e.token, e.value]));
    const states = derivedStates({
        tokens,
        dark: tokens['color-scheme'] === 'dark',
        stepL: theme.derivation?.stepL ?? CONFIG.derivation.stepL,
    });
    return [`${theme.selector} {`, ...body, '', '    /* Derived interaction states — see gates/generate-themes.mjs. */', ...states, '}'].join('\n');
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
