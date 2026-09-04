// Generates css/themes.css and js/theme-registry.js from the per-theme
// token source (T3, AR2, AR11).
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
//   node gates/generate-themes.mjs           write the artefacts
//   node gates/generate-themes.mjs --check   exit 1 if either would change

import { readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { derive, deriveVisible, deriveVisited } from './colour.mjs';

const ORDER = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));
const OUT = new URL('../css/themes.css', import.meta.url);
const REGISTRY = new URL('../js/theme-registry.js', import.meta.url);

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
    // The two-channel focus ring [DI2]. A single ring has to contrast with
    // whatever it lands on, and no one colour does: measured 2026-09-04,
    // the ring sat at 1.00 — identical luminance — on primary buttons in
    // three themes. Two adjacent rings solve it, provided the pair itself
    // contrasts and at least one of the two reaches 3:1 on every surface.
    //
    // The pair is the theme's own foreground and background: its widest
    // spread, already gated at 4.5:1 against each other, and measured to
    // cover all eleven surfaces in all seven themes. A theme may author
    // both tokens itself; check-invariants.mjs then measures those instead.
    // The link colours [TH31]. Browser-default blue is unreadable on the
    // dark themes — 1.99, 2.09 and 2.06 against their backgrounds — so a
    // theme that does not say what a link looks like is not complete.
    // --link is the theme's primary, which the contrast gate already holds
    // at AA against both surfaces a link sits on; the visited state is
    // rotated off it.
    const link = tokens.link ?? tokens.primary;
    if (tokens.link === undefined) out.push(`    --link: ${link};`);
    if (tokens['link-visited'] === undefined) {
        const visited = deriveVisited(link, [tokens.background, tokens.card], CONFIG.perceptualDistanceFloor.value);
        if (visited === null) {
            throw new Error(
                `no visited-link colour derivable from ${link}: nothing clears 4.5 on both surfaces while staying ` +
                    `${CONFIG.perceptualDistanceFloor.value} from the link colour. Author --link-visited in the theme.`,
            );
        }
        out.push(`    --link-visited: ${visited};`);
    }

    if (tokens['focus-ring'] === undefined) out.push(`    --focus-ring: ${tokens.foreground};`);
    if (tokens['focus-ring-contrast'] === undefined) out.push(`    --focus-ring-contrast: ${tokens.background};`);
    const d = CONFIG.derivation;
    for (const surface of INTERACTIVE) {
        const base = tokens[surface];
        if (base === undefined) continue;
        for (const [state, steps] of [
            ['hover', d.hover],
            ['active', d.active],
            ['disabled', d.disabled],
        ]) {
            let value;
            if (state === 'disabled') {
                value = derive(base, 1.5, { towardsLight: !dark, stepL });
            } else if (state === 'active') {
                // The pressed state is the one a person is told by [KT2].
                value = deriveVisible(
                    base,
                    steps,
                    { towardsLight: dark, stepL },
                    {
                        floor: CONFIG.stateVisibilityFloor.value,
                        ink: tokens[`${surface}-foreground`],
                    },
                );
            } else {
                value = derive(base, steps, { towardsLight: dark, stepL });
            }
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
    // AR10: the version goes inside the marker comment that has been this
    // file's recognition point for as long as it has existed. No banner
    // above it, no timestamp, no hash — a timestamp would also break AR3,
    // which says nothing here may vary between runs.
    const version = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
    const header = readFileSync(new URL('../css/_header.css', import.meta.url), 'utf8').replace(
        '/* @kp-soft/themes — css/themes.css',
        `/* @kp-soft/themes v${version} — css/themes.css`,
    );
    const rules = readFileSync(new URL('../css/_rules.css', import.meta.url), 'utf8');
    const blocks = ORDER.map(/** @param {string} name */ (name) => block(JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'))));
    // _rules.css already begins with the blank line that separated the last
    // token block from the authored rules, so one newline is enough here.
    return `${header}\n${blocks.join('\n\n')}\n${rules}`;
}

/**
 * The client-side theme record, generated rather than typed [AR11].
 *
 * The hook used to carry each theme's background, foreground and primary
 * colour as text — 21 values duplicating css/themes.css, measured on
 * 2026-09-04 as not yet diverging. The swatch now reads the live custom
 * properties instead, so those colours are gone; what is left is the label
 * and whether the theme is dark, and even that is read from the token
 * source rather than kept in step by hand. `dark` comes from the theme's
 * own `color-scheme`, which is the same declaration DI6 gates, so the
 * picker cannot believe in a fourth dark theme the stylesheet does not
 * have. (kyu did, which is why one of the picker's five tests is about it.)
 */
function registry() {
    const dir = new URL('../themes/', import.meta.url);
    const themes = ORDER.map(
        /** @param {string} name */ (name) => {
            const t = JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'));
            const scheme = t.entries.find(/** @param {any} e */ (e) => e.token === 'color-scheme')?.value;
            if (t.label === undefined) throw new Error(`themes/${name}/tokens.json declares no label`);
            if (scheme === undefined) throw new Error(`themes/${name}/tokens.json declares no color-scheme`);
            return `    { name: '${name}', label: '${t.label}', dark: ${scheme === 'dark'} },`;
        },
    );
    return [
        '// GENERATED by gates/generate-themes.mjs from themes/*/tokens.json.',
        '// Do not edit: `npm run gates` fails when this file and the token',
        '// source disagree. Add a theme by adding its token file and its name',
        '// to themes/order.json.',
        '',
        '/** @typedef {{name: string, label: string, dark: boolean}} ThemeRecord */',
        '',
        '/** @type {readonly ThemeRecord[]} */',
        'export const THEMES = Object.freeze([',
        ...themes,
        ']);',
        '',
        '/** The theme a visitor gets before choosing, and the answer to any unknown value. */',
        "export const DEFAULT_THEME = 'formal';",
        '',
        '/** The localStorage key. Contract value: consumers read it too [TH26]. */',
        "export const STORAGE_KEY = 'theme';",
        '',
    ].join('\n');
}

const artefacts = [
    { url: OUT, name: 'css/themes.css', content: build() },
    { url: REGISTRY, name: 'js/theme-registry.js', content: registry() },
];

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const a of artefacts) {
        let current = '';
        try {
            current = readFileSync(a.url, 'utf8');
        } catch {
            current = '';
        }
        if (current !== a.content) {
            stale++;
            console.error(`${a.name} does not match its source.`);
        }
    }
    if (stale > 0) {
        console.error('Run `npm run generate` and commit the result.');
        process.exit(1);
    }
    console.log(`${artefacts.length} generated files match their source (${ORDER.length} themes).`);
    process.exit(0);
}

for (const a of artefacts) writeFileSync(a.url, a.content);
console.log(`wrote ${artefacts.map((a) => a.name).join(' and ')} from ${ORDER.length} theme sources.`);
