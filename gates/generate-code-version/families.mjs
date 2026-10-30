// The kp-* class families and data attributes a stylesheet names, and the components that own them.

import { selectorChains, withoutComments } from '../tags.mjs';
import { withoutTheVersion } from './sources.mjs';

/**
 * The families a stretch of CSS selectors or markup names: `.kp-button--primary`
 * and `kp-button__label` are `kp-button`, `[data-kp-reveal='headline']` is
 * `data-kp-reveal`. The same reading catalogue/block-hash.js gives a block.
 * @param {string} text
 * @returns {string[]}
 */
export const familiesIn = (text) => [...new Set([...text.matchAll(/(?<![\w-])((?:data-)?kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1]))].sort();

/**
 * One stylesheet's lines, bucketed by the families their selectors name.
 * Comments are blanked first, so a comment moves nothing; a line is its text,
 * not its number, so a line added above moves nothing either.
 * @param {string} css
 * @returns {{ families: Map<string, string[]>, unnamed: string[], themed: Map<string, string[]> }}
 */
export function bucketsOf(css) {
    const text = withoutTheVersion(css);
    const chains = selectorChains(text);
    const lines = withoutComments(text).split('\n');
    /** @type {Map<string, string[]>} */
    const families = new Map();
    /** @type {string[]} */
    const unnamed = [];
    /** @type {Map<string, string[]>} */
    const themed = new Map();
    lines.forEach((raw, i) => {
        const line = raw.trim();
        if (!line) return;
        const chain = chains(i + 1);
        // A keyframe's name is not a family a block carries: the rule that
        // runs it names its family, and the frames belong to everyone.
        const keyframes = chain.some((part) => part.startsWith('@keyframes'));
        // Innermost first: `.kp-card { .kp-button {…} }` belongs to what the
        // inner rule names, and a declaration line belongs to its rule.
        /** @type {string[]} */
        let named = [];
        if (!keyframes) for (let n = chain.length - 1; n >= 0 && named.length === 0; n--) named = familiesIn(chain[n] ?? '');
        if (named.length === 0) {
            // css/themes.css holds each theme's tokens under its own
            // `[data-theme='x']`: those lines are that theme's, not everyone's.
            const theme = keyframes ? undefined : /data-theme\s*=\s*['"]?([a-z-]+)/.exec(chain.join(' '))?.[1];
            if (theme) themed.set(theme, [...(themed.get(theme) ?? []), line]);
            else unnamed.push(line);
            return;
        }
        for (const family of named) families.set(family, [...(families.get(family) ?? []), line]);
    });
    return { families, unnamed, themed };
}

/**
 * The components a family belongs to by tests/tags.json's selector map — the
 * longest dash-separated prefix the map names — as catalogue/block-hash.js's
 * `componentsOf` reads it.
 * @param {string} name
 * @param {Record<string, string[]>} selectors
 * @returns {string[]}
 */
export function componentsOf(name, selectors) {
    const segments = name.split('-');
    for (let n = segments.length; n >= 2; n--) {
        const found = selectors[segments.slice(0, n).join('-')];
        if (found) return found.filter((tag) => tag.startsWith('@component:')).map((tag) => tag.slice('@component:'.length));
    }
    return [];
}
