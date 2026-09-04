// Token-source gates [L1, TH22, AR8]. These read the SOURCE — the
// per-theme token files — where the contrast gate reads the generated
// artefact. AR1 asks for both: derivation checks over the data, and the
// artefact checked as the thing consumers actually take.
//
// Every check here declares how many things it expected to inspect and
// fails when the count differs (AR8). A gate must answer "did I check
// everything", not only "did what I ran pass".
//
// Usage: node gates/check-tokens.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';

const dir = new URL('../themes/', import.meta.url);

/** @returns {string[]} the theme names, in their declared order. */
export function themeOrder() {
    return JSON.parse(readFileSync(new URL('order.json', dir), 'utf8'));
}

/**
 * The token names each theme declares.
 * @returns {Map<string, Set<string>>}
 */
export function tokenNamesByTheme() {
    const out = new Map();
    for (const name of themeOrder()) {
        const theme = JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'));
        out.set(name, new Set(theme.entries.filter((e) => e.token !== undefined).map((e) => e.token)));
    }
    return out;
}

/**
 * TH22: every theme must declare the same token names, so a component can
 * rely on a token existing rather than hoping. Returns one entry per name
 * that is not present everywhere.
 * @param {Map<string, Set<string>>} byTheme
 * @returns {{token: string, have: string[], missing: string[]}[]}
 */
export function findAsymmetry(byTheme) {
    const themes = [...byTheme.keys()];
    const all = new Set(themes.flatMap((t) => [...byTheme.get(t)]));
    return [...all]
        .sort()
        .map((token) => ({
            token,
            have: themes.filter((t) => byTheme.get(t).has(token)),
            missing: themes.filter((t) => !byTheme.get(t).has(token)),
        }))
        .filter((a) => a.missing.length > 0);
}

/** The names TH22 tolerates for now; L3 empties this list (TH20). */
export function knownAsymmetry() {
    return new Set(JSON.parse(readFileSync(new URL('known-asymmetry.json', dir), 'utf8')).tokens);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const byTheme = tokenNamesByTheme();
    const themes = [...byTheme.keys()];
    const all = findAsymmetry(byTheme);
    const known = knownAsymmetry();

    // The ratchet works in both directions: a new asymmetric name fails,
    // and a listed name that has become symmetric fails too, so the list
    // cannot quietly outlive the problem it describes.
    const stale = [...known].filter((t) => !all.some((a) => a.token === t));
    if (stale.length > 0) {
        console.error(`themes/known-asymmetry.json lists ${stale.length} token(s) that are now declared everywhere:`);
        for (const t of stale) console.error(`  --${t}`);
        console.error('\nRemove them from that file — the ratchet only turns one way.');
        process.exit(1);
    }

    const asymmetry = all.filter((a) => !known.has(a.token));

    if (asymmetry.length > 0) {
        console.error(`${asymmetry.length} token name(s) are not declared by every theme (TH22):\n`);
        for (const a of asymmetry) {
            console.error(`  --${a.token}`);
            console.error(`      declared by: ${a.have.join(', ')}`);
            console.error(`      missing from: ${a.missing.join(', ')}`);
        }
        console.error('\nEvery theme answers every question, even when the answer is "none".');
        console.error('Add the token to the themes that lack it, or remove it from the ones that have it.');
        process.exit(1);
    }

    const common = [...byTheme.get(themes[0])].filter((t) => !known.has(t)).length;
    console.log(`All ${themes.length} themes declare the same ${common} token names (${known.size} known exceptions, L3 clears them).`);
}
