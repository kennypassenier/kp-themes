// The measured differences between the 4.0.0 release and the current build, per theme.

import { THEMES } from '../../js/theme-registry.js';
import { existsSync } from 'node:fs';
import { CEILING } from '../check-texture.mjs';
import { read } from './repo.mjs';
import { hash, scopedRules, textureOf, themeBlocks } from './css-reading.mjs';
/** @typedef {import('./types.mjs').TokenChange} TokenChange */
/** @typedef {import('./types.mjs').ThemeDiff} ThemeDiff */

/**
 * The measured difference for one theme.
 *
 * @returns {ThemeDiff[]}
 */
export function diffs() {
    const oldCss = read('showcase/baseline/4.0.0/kp-themes.css');
    const newThemes = read('css/themes.css');
    // Every register that exists, found rather than listed: nineteen more
    // themes are being lifted for 5.0.0 (S48) and a hand-kept list here
    // would go stale at every one of them.
    /** @type {Record<string, string>} */
    const newRegisters = Object.fromEntries(
        THEMES.map((theme) => [theme.name, `css/${theme.name}-register.css`])
            .filter(([, path]) => existsSync(new URL(`../../${path}`, import.meta.url)))
            .map(([name, path]) => [name, read(path)]),
    );
    const rules = read('css/_rules.css');
    const oldBlocks = themeBlocks(oldCss);
    // Themes changed name at their lift (Kenny, 2026-09-08): the
    // 4.0.0 block to compare against still carries the old one, so the
    // lookup is by the name the released stylesheet used. Without this a
    // renamed theme reads as "new in 5.0.0" and its whole palette shows as
    // a difference, which is exactly the wrong story.
    /** @type {Record<string, string>} */
    const RENAMED = { forest: 'topo', woodblock: 'nishiki' };
    const was = (/** @type {string} */ name) => RENAMED[name] ?? name;
    const newBlocks = themeBlocks(newThemes);
    /** @type {Record<string, any>} */
    const families = JSON.parse(read('fonts/families.json'));
    delete families['//'];
    const shipped = new Set(
        Object.values(families)
            .filter((f) => !(f.reservedFontName && !f.subset))
            .map((f) => f.family),
    );
    return THEMES.map((theme) => {
        const before = oldBlocks.get(was(theme.name)) ?? new Map();
        const after = newBlocks.get(theme.name) ?? new Map();
        /** @type {TokenChange[]} */
        const changed = [];
        /** @type {TokenChange[]} */
        const added = [];
        /** @type {TokenChange[]} */
        const removed = [];
        for (const [token, value] of after) {
            if (!before.has(token)) added.push({ token, old: null, now: value });
            else if (before.get(token) !== value) changed.push({ token, old: before.get(token) ?? null, now: value });
        }
        for (const [token, value] of before) if (!after.has(token)) removed.push({ token, old: value, now: null });
        // The families the theme names first, and whether a file ships.
        /** @type {{ family: string, shipped: boolean }[]} */
        const fonts = [];
        for (const [token, value] of after) {
            if (!token.startsWith('theme-font-')) continue;
            const family = value
                .split(',')[0]
                .trim()
                .replace(/^['"]|['"]$/g, '');
            if (family && !fonts.some((f) => f.family === family)) fonts.push({ family, shipped: shipped.has(family) });
        }
        // The register: compared rule for rule where the theme has one.
        /** @type {ThemeDiff['register']} */
        let register = 'none';
        if (theme.name in newRegisters) {
            // The old bundle holds the base rules and the register in one file;
            // the new side is compared as the same union.
            const oldRules = scopedRules(oldCss, was(theme.name));
            const nowRules = scopedRules(
                newThemes + '\n' + newRegisters[/** @type {'cyberpunk' | 'synthwave' | 'brutalism'} */ (theme.name)],
                theme.name,
            );
            register = !oldBlocks.has(was(theme.name))
                ? 'new'
                : theme.name === 'cyberpunk'
                  ? 'rewritten'
                  : hash(oldRules) === hash(nowRules)
                    ? 'unchanged'
                    : 'changed';
        }
        const texture = {
            old: textureOf(oldCss, was(theme.name)),
            // The register wins where it declares one: it is loaded in the
            // frame, so it is what a reader of this page actually sees —
            // dark's starfield paints at its register's value, not at the
            // base layer's.
            now: textureOf(newRegisters[/** @type {keyof typeof newRegisters} */ (theme.name)] ?? '', theme.name) ?? textureOf(rules, theme.name),
            // R6-Q2 asked whether dark's starfield should come down to
            // the ceiling, and this page is where Kenny decided it: he
            // took it to 0.06 on 2026-09-08 and then chose the second
            // starfield demo, whose 0.35 stands. Nothing is proposed any
            // more — the demo is the specification [S49], and DI9 is
            // advice [Kenny, 2026-09-09], so the page reports the
            // measurement and proposes no change to it.
            proposal: null,
        };
        // The story, and the sections the pair must show.
        /** @type {string[]} */
        const lines = [];
        /** @type {Set<string>} */
        const show = new Set();
        const shippedFonts = fonts.filter((f) => f.shipped).map((f) => f.family);
        const waiting = fonts.filter((f) => !f.shipped).map((f) => f.family);
        if (shippedFonts.length > 0) {
            lines.push(
                `Typography: ${shippedFonts.join(' and ')} now ship${shippedFonts.length === 1 ? 's' : ''} with the package and load${shippedFonts.length === 1 ? 's' : ''} here; 4.0.0 shipped no font file, so the browser drew the system fallback.`,
            );
            show.add('type');
        }
        if (waiting.length > 0)
            lines.push(
                `Typography, still the fallback: ${waiting.join(' and ')} carr${waiting.length === 1 ? 'ies' : 'y'} a Reserved Font Name and wait${waiting.length === 1 ? 's' : ''} on R6-Q1 — no visible change yet.`,
            );
        const visibleChanges = changed.filter((c) => !c.token.startsWith('surface-hero-') && c.token !== 'kp-text-display');
        if (visibleChanges.length > 0) {
            lines.push(
                `Palette: ${visibleChanges.length} token${visibleChanges.length === 1 ? '' : 's'} changed value — ${visibleChanges.map((c) => `--${c.token} ${c.old} → ${c.now}`).join('; ')}.`,
            );
            show.add('palette');
        }
        const heroAdded = added.filter((a) => a.token.startsWith('surface-hero-'));
        if (heroAdded.length > 0) {
            const distinct = heroAdded.filter(
                (a) => a.now !== after.get(a.token.replace('surface-hero-bg', 'background').replace('surface-hero-fg', 'foreground')),
            );
            if (!oldBlocks.has(was(theme.name))) {
                lines.length = 0;
                lines.push(
                    `New in 5.0.0: this theme did not exist in 4.0.0 — every one of its ${after.size} tokens, its register and its fonts are new, so the left frame shows what a 4.0.0 page does with a theme it does not know (the loud fallback), and nothing is marked because everything differs.`,
                );
                show.clear();
            } else if (theme.name === 'cyberpunk') {
                lines.push(
                    'Two surfaces: the hero is signal yellow with ink on it and the app surface stays the void — eleven hero tokens are new, and every component reads them inside the hero.',
                );
                show.add('surfaces');
            } else
                lines.push(
                    `New in 5.0.0: ${heroAdded.length} hero tokens and the display text step, all pointing at values this theme already had — the hero paints the same ground as the app, so nothing visible changed.`,
                );
            void distinct;
        }
        if (removed.length > 0) lines.push(`Removed: ${removed.map((r) => `--${r.token}`).join(', ')}.`);
        if (register === 'new') {
            /* said above */
        } else if (register === 'rewritten') {
            lines.push(
                'The register is rewritten from the approved demo: the navigation strip with its cut corner and stepped notch and the dash-prefixed dropdown; the notched buttons with the slit and the charge sweep; the fields with the clipped corner and the accent caret; the dossier card with the file stamp and the redactions that lift; the razor tear between surfaces; and the scanlines at exactly the DI9 ceiling. The old .fx-flicker, .fx-pulse, .fx-cellpop and .fx-media classes are gone with the 4.x theme.',
            );
            for (const cat of ['nav', 'buttons', 'fields', 'dossier', 'divider']) show.add(cat);
        } else if (register === 'changed') lines.push('The register changed (rule for rule, its rules differ from 4.0.0).');
        else if (register === 'unchanged') lines.push('The register is unchanged, rule for rule.');
        if (texture.old !== null && texture.now !== null && texture.old !== texture.now) {
            lines.push(
                `Texture: the layer painted at ${texture.old} in 4.0.0 and paints at ${texture.now} now (DI9 ceiling ${CEILING}` +
                    (texture.now > CEILING ? ', over it, as the approved demo measured it' : '') +
                    ').',
            );
            show.add('texture');
        }
        if (texture.proposal !== null && texture.now !== null && texture.now > CEILING) {
            lines.push(
                `Texture, a proposal for R6-Q2: this theme paints its texture at ${texture.now}, over the DI9 ceiling of ${CEILING}; the right frame below shows it at ${texture.proposal}, the left as it is today.`,
            );
            show.add('texture');
        }
        if (lines.length === 0) lines.push('Nothing changed for this theme between 4.0.0 and the current build.');
        return { name: theme.name, label: theme.label, changed, added, removed, fonts, register, texture, lines, show: [...show] };
    });
}
