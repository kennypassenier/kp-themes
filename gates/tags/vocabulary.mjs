// The tag vocabulary: which component and theme tags exist and how a file maps onto them.

import { readdirSync } from 'node:fs';
import { TESTS, themeNames } from './repo.mjs';

/**
 * What is wrong with one tag as written, or null.
 *
 * @param {string} tag @param {{ components: Set<string>, themes: Set<string> }} vocabulary
 */
export function tagProblem(tag, { components, themes }) {
    if (tag === '@sweep') return null;
    const m = tag.match(/^@(component|theme):(.+)$/);
    if (!m) return `"${tag}" is not @sweep, @component:<name> or @theme:<name>`;
    if (m[2].includes('${')) return /^\$\{[^}]+\}$/.test(m[2]) ? null : `"${tag}" mixes a name and an expression`;
    if (m[1] === 'component' && !components.has(m[2])) return `"${tag}" names no component in tests/tags.json`;
    if (m[1] === 'theme' && !themes.has(m[2])) return `"${tag}" names no theme in themes/order.json`;
    return null;
}

/** @returns {string[]} spec files, relative to the repository */
export const specFiles = () =>
    readdirSync(TESTS)
        .filter((f) => f.endsWith('.spec.mjs'))
        .sort()
        .map((f) => `tests/${f}`);

// ─── Reading a change ──────────────────────────────────────────────────────

/** @param {string} pattern @returns {{ re: RegExp, names: string[] }} */
function compile(pattern) {
    const names = [];
    let re = '';
    for (let i = 0; i < pattern.length; i++) {
        const ch = pattern[i];
        if (pattern.startsWith('**/', i)) {
            re += '(?:.*/)?';
            i += 2;
        } else if (pattern.startsWith('**', i)) {
            re += '.*';
            i += 1;
        } else if (ch === '*') re += '[^/]*';
        else if (ch === '{') {
            const close = pattern.indexOf('}', i);
            names.push(pattern.slice(i + 1, close));
            re += '([a-z0-9-]+)';
            i = close;
        } else re += ch.replace(/[.+?^$()|[\]\\]/g, '\\$&');
    }
    return { re: new RegExp(`^${re}$`), names };
}

/**
 * The rule a path falls under, with its captures filled in.
 *
 * @param {string} file @param {any} map @param {{ components: Set<string>, themes: Set<string> }} vocabulary
 * @returns {{ rule: any, captures: Record<string, string> } | null}
 */
export function ruleFor(file, map, vocabulary) {
    for (const rule of map.rules) {
        const { re, names } = compile(rule.path);
        const m = file.match(re);
        if (!m) continue;
        /** @type {Record<string, string>} */
        const captures = {};
        let fits = true;
        names.forEach((name, i) => {
            captures[name] = m[i + 1];
            if (name === 'theme' && !vocabulary.themes.has(m[i + 1])) fits = false;
            if (name === 'component' && !vocabulary.components.has(m[i + 1])) fits = false;
        });
        if (fits) return { rule, captures };
    }
    return null;
}

/** @param {any} map */
export const vocabularyOf = (map) => ({ components: new Set(Object.keys(map.components)), themes: new Set(themeNames()) });
