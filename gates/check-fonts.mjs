// The shipped fonts: licence, reserved names, budget, and no orphans
// [T19, AR39].
//
// S19 said the package ships no font files; Kenny reversed it at round
// six's Phase 3 (T19), and AR39 gave the reversal its shape:
//
//   fonts/<family-slug>/<file>.woff2   the faces, subset per script
//   fonts/<family-slug>/LICENSE        the licence text, verbatim
//   fonts/families.json                one entry per family: the family
//                                      name, the licence, whether the
//                                      family declares a Reserved Font
//                                      Name, which themes use it, and
//                                      the scripts it ships
//
// What fails, each with its reason:
//
//   unlisted    a directory under fonts/ that families.json does not name
//   missing     a family families.json names with no directory or no file
//   licence     a family without a LICENSE file, or whose licence is not
//               one the package may redistribute (SIL OFL 1.1, Apache 2.0,
//               Ubuntu Font Licence 1.0)
//   reserved    a family that declares a Reserved Font Name AND ships a
//               subset — under the OFL a subset is a Modified Version and
//               may not carry the reserved name. The critic caught this;
//               "a licence file beside it" had let such a family pass.
//   orphan      a family no theme names in its theme-font-* tokens
//   budget      a theme whose families together exceed fontsBudgetBytes
//               (gates/config.json), the knob the critic priced at 1.5 MB
//               against a measured 9–18 kB per latin face
//
// Before C4 there is no fonts/ directory. The gate says so and passes —
// an absent directory is not a fault, an unlisted one is. Drilled red at
// C0 on an injected family directory without a LICENSE.
//
// Since scope-76 it also runs `node gates/generate-fonts-css.mjs --check`,
// which refuses when css/fonts.css no longer matches fonts/families.json.
//
// Usage: node gates/check-fonts.mjs

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';

import { spawnSync } from 'node:child_process';

import process from 'node:process';
import { audit } from './fonts-audit.mjs';

/** @typedef {import('./fonts-audit.mjs').Family} Family */
export { REDISTRIBUTABLE, audit } from './fonts-audit.mjs';

const root = new URL('../', import.meta.url);
const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/**
 * The first-choice families each theme names in its font tokens.
 *
 * @returns {Map<string, string[]>}
 */
export function familiesByTheme() {
    const order = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8')));
    /** @type {Map<string, string[]>} */
    const out = new Map();
    for (const name of order) {
        const theme = JSON.parse(readFileSync(new URL(`themes/${name}/tokens.json`, root), 'utf8'));
        /** @type {string[]} */
        const families = [];
        for (const entry of theme.entries) {
            if (typeof entry.token !== 'string' || !entry.token.startsWith('theme-font-')) continue;
            const first = String(entry.value)
                .split(',')[0]
                .trim()
                .replace(/^['"]|['"]$/g, '');
            if (first !== '' && !families.includes(first)) families.push(first);
        }
        out.set(name, families);
    }
    return out;
}

/**
 * The families css/fonts.css declares, from its @font-face rules. This is
 * the gate's subject: what the stylesheet promises is what fonts/ must
 * carry. Before C4 the file declares nothing, and the gate says "0
 * families declared" rather than reporting green over a directory that
 * does not exist (the critic's objection to the first draft).
 *
 * @param {string} source
 * @returns {string[]} family names, deduplicated
 */
export function declaredFamilies(source) {
    /** @type {string[]} */
    const out = [];
    for (const m of source.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]?([^'";]+)['"]?\s*;[^}]*\}/g)) {
        const family = m[1].trim();
        if (!out.includes(family)) out.push(family);
    }
    return out;
}

/**
 * Every family named by a theme's own `theme-font-*` token, quotes
 * stripped and the generic fallbacks dropped. The themes are written by
 * hand and are not generated from `fonts/`, which is what makes them a
 * witness the font pipeline cannot take down with it [Phase 7].
 *
 * @returns {string[]}
 */
export function themeFamilies() {
    const generic = new Set([
        'ui-monospace',
        'ui-sans-serif',
        'ui-serif',
        'system-ui',
        'monospace',
        'sans-serif',
        'serif',
        'cursive',
        'fantasy',
        'inherit',
    ]);
    /** @type {Set<string>} */
    const found = new Set();
    for (const dir of readdirSync(new URL('themes/', root), { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const file = new URL(`themes/${dir.name}/tokens.json`, root);
        if (!existsSync(file)) continue;
        const { entries = [] } = JSON.parse(readFileSync(file, 'utf8'));
        for (const { token, value } of entries) {
            if (!String(token).startsWith('theme-font')) continue;
            for (const part of String(value).split(',')) {
                const name = part.trim().replace(/^['"]|['"]$/g, '');
                if (name && !generic.has(name.toLowerCase())) found.add(name);
            }
        }
    }
    return [...found].sort();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    // scope-76: the stylesheet's own `check:fonts-css` line is gone, and its
    // check runs here, first: css/fonts.css is generated from the same
    // fonts/families.json this gate audits. Spawned rather than inlined, so
    // it prints and refuses with exactly what it always did.
    const fontsCss = spawnSync(process.execPath, [new URL('generate-fonts-css.mjs', import.meta.url).pathname, '--check'], { stdio: 'inherit' });
    const mergedStatus = fontsCss.status === 0 ? 0 : 1;
    const fontsDir = new URL('fonts/', root);
    const declared = declaredFamilies(readFileSync(new URL('css/fonts.css', root), 'utf8'));
    if (!existsSync(fontsDir)) {
        if (declared.length > 0) {
            console.error(
                `css/fonts.css declares ${declared.length} families and fonts/ does not exist — the stylesheet promises files the package does not carry.`,
            );
            process.exit(1);
        }
        // Phase 7: "nothing promised" was written when nothing was, and
        // it stayed after the seven renamed OFL faces shipped in 5.0.0.
        // css/fonts.css is generated FROM fonts/, so the two fall to zero
        // together — delete the directory, regenerate, and both this gate
        // and the stylesheet check inside it pass on a package with no
        // faces at all. The themes are the independent witness: they name
        // the families in their own tokens, and they are not generated
        // from fonts/.
        const wanted = themeFamilies();
        if (wanted.length > 0) {
            console.error(
                `no fonts/ directory and no declared families, but ${wanted.length} theme font(s) name a family: ${wanted.slice(0, 4).join(', ')}…`,
            );
            console.error('the font pipeline has gone missing, not become unnecessary.');
            process.exit(1);
        }
        console.log('Fonts: css/fonts.css declares 0 families and fonts/ does not exist yet (C4); 0 checked, nothing promised.');
        process.exit(mergedStatus);
    }
    /** @type {Record<string, Family>} */
    let families = {};
    try {
        families = JSON.parse(readFileSync(new URL('families.json', fontsDir), 'utf8'));
    } catch {
        console.error('fonts/ exists and fonts/families.json is missing or unreadable — every shipped family is listed there with its licence.');
        process.exit(1);
    }
    delete (/** @type {Record<string, unknown>} */ (families)['//']);
    const onDisk = readdirSync(fontsDir).filter((name) => statSync(new URL(name, fontsDir)).isDirectory());
    const problems = audit(
        families,
        (slug) => {
            const dir = new URL(`${slug}/`, fontsDir);
            if (!existsSync(dir)) return null;
            const files = readdirSync(dir).filter((f) => f.endsWith('.woff2'));
            const bytes = files.reduce((sum, f) => sum + statSync(new URL(f, dir)).size, 0);
            return { files, licence: existsSync(new URL('LICENSE', dir)), bytes };
        },
        familiesByTheme(),
        Number(CONFIG.fontsBudgetBytes?.value ?? 1_500_000),
        onDisk,
        CONFIG.fontsBudgetBytes?.perTheme ?? {},
    );
    // The stylesheet and the listing must agree: a family declared and
    // not listed has no licence record; one listed and not declared is a
    // file nobody can load.
    const listed = Object.values(families)
        .filter((f) => !(f.reservedFontName && !f.subset))
        .map((f) => f.renamed ?? f.family);
    for (const family of declared)
        if (!listed.includes(family)) problems.push(`${family}: declared in css/fonts.css and not listed in fonts/families.json`);
    for (const family of listed)
        if (!declared.includes(family)) problems.push(`${family}: listed in fonts/families.json and not declared in css/fonts.css`);
    if (problems.length > 0) {
        console.error(`Fonts: ${problems.length} fault(s).\n${problems.join('\n')}`);
        process.exit(1);
    }
    console.log(`Fonts: ${declared.length} families declared in css/fonts.css, all listed, licensed, named by a theme and under budget.`);
    process.exit(mergedStatus);
}
