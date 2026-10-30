// Reading a page's HTML: the elements actually drawn and the wrappers around them.

import { RAW, VOID } from './config.mjs';

/** The class list and the attribute names of one start tag. @param {string} tag */
function attributesOf(tag) {
    const classes = new Set((tag.match(/\sclass\s*=\s*"([^"]*)"/)?.[1] ?? '').split(/\s+/).filter(Boolean));
    const attributes = new Set([...tag.matchAll(/\s([A-Za-z_:][-\w:.]*)(?=[\s/>=])/g)].map((m) => m[1].toLowerCase()));
    return { classes, attributes };
}

/**
 * Every converted component a page draws, and whether it sits inside a
 * wrapper that establishes its container.
 *
 * The walk keeps a stack of the class lists of the elements still open,
 * so "inside a wrapper" is answered by ancestry rather than by proximity
 * in the text. The element itself does not count: a container query
 * styles a container's contents, never the container.
 *
 * @param {string} html
 * @param {Array<{ container: string, class: string, attribute?: string, self?: true, why: string }>} required
 * @param {Map<string, string[]>} wrappers
 * @returns {Array<{ line: number, class: string, container: string, wrappers: string[], wrapped: boolean }>}
 */
export function drawn(html, required, wrappers) {
    /** @type {Array<{ line: number, class: string, container: string, wrappers: string[], wrapped: boolean }>} */
    const found = [];
    /** @type {Set<string>[]} */
    const stack = [];
    /** @type {string | null} */
    let raw = null;

    for (const match of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g)) {
        const [, closing, rawName, attributes, selfClosing] = match;
        const name = rawName.toLowerCase();
        if (raw !== null) {
            if (closing && name === raw) raw = null;
            continue;
        }
        if (closing) {
            stack.pop();
            continue;
        }
        if (RAW.has(name)) {
            raw = name;
            continue;
        }
        if (selfClosing !== '' || VOID.has(name)) continue;

        const { classes, attributes: names } = attributesOf(` ${attributes} `);
        for (const entry of required) {
            if (entry.self) continue;
            if (!classes.has(entry.class)) continue;
            if (entry.attribute !== undefined && !names.has(entry.attribute)) continue;
            const allowed = wrappers.get(entry.container) ?? [];
            found.push({
                line: html.slice(0, match.index).split('\n').length,
                class: entry.class,
                container: entry.container,
                wrappers: allowed,
                wrapped: stack.some((ancestor) => allowed.some((cls) => ancestor.has(cls))),
            });
        }
        stack.push(classes);
    }
    return found;
}
