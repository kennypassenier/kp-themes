// Reading a theme's rules out of the stylesheets: its blocks, scoped rules, and texture opacity.

import { createHash } from 'node:crypto';
import { strongestAlpha } from '../check-texture.mjs';

/** The categories a difference can touch, in the order the specimen shows them. */
export const CATEGORIES = /** @type {const} */ ([
    ['type', 'Typography'],
    ['palette', 'Palette'],
    ['surfaces', 'The two surfaces'],
    ['nav', 'The navigation bar'],
    ['buttons', 'Buttons'],
    ['fields', 'Fields'],
    ['dossier', 'The dossier card'],
    ['divider', 'The divider'],
    ['texture', 'The texture layer'],
]);

/**
 * Every theme block of a themes stylesheet: name → token → value. Only
 * the block whose selector is exactly the theme (the 5.0.0 hero blocks
 * are `[data-theme='x'] [data-kp-surface='hero']` and are skipped).
 *
 * @param {string} css
 * @returns {Map<string, Map<string, string>>}
 */
export function themeBlocks(css) {
    /** @type {Map<string, Map<string, string>>} */
    const out = new Map();
    const re = /(?:^|\n)(?::root,\n)?\[data-theme='([a-z-]+)'\]\s*\{([^}]*)\}/g;
    for (const m of css.matchAll(re)) {
        /** @type {Map<string, string>} */
        const tokens = new Map();
        for (const d of m[2].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) tokens.set(d[1], d[2].trim());
        out.set(m[1], tokens);
    }
    return out;
}

/**
 * The rules scoped to a theme in a stylesheet, as one normalised string —
 * enough to say "changed" or "unchanged" between two versions.
 *
 * @param {string} css @param {string} theme
 */
export function scopedRules(css, theme) {
    const lines = [];
    const re = new RegExp(`\\[data-theme='${theme}'\\][^{]*\\{[^}]*\\}`, 'g');
    for (const m of css.matchAll(re)) lines.push(m[0].replace(/\s+/g, ' ').trim());
    return lines.sort().join('\n');
}

/** @param {string} text */
export const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 12);

/**
 * The effective texture opacity a stylesheet gives a theme (layer opacity
 * × strongest alpha), or null when it declares none.
 *
 * @param {string} css @param {string} theme
 */
export function textureOf(css, theme) {
    const re = new RegExp(`\\[data-theme='${theme}'\\]\\s*\\{([^}]*)\\}`, 'g');
    for (const m of css.matchAll(re)) {
        const texture = m[1].match(/--fx-texture:\s*([^;]+);/);
        if (!texture) continue;
        const opacity = m[1].match(/--fx-texture-opacity:\s*([\d.]+)/);
        return Number(((opacity ? Number(opacity[1]) : 0) * strongestAlpha(texture[1])).toFixed(3));
    }
    return null;
}
