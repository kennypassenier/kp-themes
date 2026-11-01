// The pieces the showcase pages are written from (gates/generate-showcase.mjs): the register links, the stylesheet, the fonts a theme names and the specimen blocks.
import { readFileSync, readdirSync } from 'node:fs';

import { SPECIMENS } from '../showcase/specimens.mjs';

import { THEMES } from '../js/theme-registry.js';


const OUT = new URL('../showcase/', import.meta.url);

/**
 * Every register on disk, ordered as themes/order.json orders its themes
 * so the cascade is the same on every page.
 *
 * Phase 7 replaced a hand-written list of link tags with this. dark's own
 * register was missing from that list — added in round seven, never added
 * here — so `showcase/themes/dark.html` styled dark with twenty-one other
 * themes' registers and none of its own, and every every-theme sweep that
 * reads those pages had been measuring dark undressed.
 *
 * @returns {string[]}
 */
export function registerLinks(prefix = '../css/', indent = '        ') {
    const present = new Set(
        readdirSync(new URL('../css/', import.meta.url))
            .filter((f) => f.endsWith('-register.css'))
            .map((f) => f.slice(0, -'-register.css'.length)),
    );
    /** @type {string[]} */
    const ordered = THEMES.map((t) => String(t.name)).filter((n) => present.has(n));
    for (const name of [...present].sort()) if (!ordered.includes(name)) ordered.push(name);
    return ordered.map((/** @type {string} */ n) => `${indent}<link rel="stylesheet" href="${prefix}${n}-register.css" />`);
}

export const STYLE = readFileSync(new URL('showcase.css', OUT), 'utf8');

/**
 * The typefaces a theme names, as Google Fonts families [R0].
 *
 * Nothing in the package loads a webfont — the tokens name a face and a
 * consumer loads it (S19) — so until now the showcase showed every theme
 * in its fallback stack, and a third of a theme's character is its
 * letter. The showcase and the fixtures load the faces themselves, from
 * the same token values the stylesheet carries, so the list cannot
 * drift from the theme. Regular weight only: the API refuses a weight a
 * family does not have, and a synthesised bold on a showcase is a
 * smaller lie than a missing face.
 *
 * @param {string} name
 * @returns {string[]}
 */
export function familiesOf(name) {
    /** @type {{entries: Array<{token?: string, value?: string}>}} */
    const source = JSON.parse(readFileSync(new URL(`../themes/${name}/tokens.json`, import.meta.url), 'utf8'));
    /** @type {string[]} */
    const families = [];
    for (const entry of source.entries) {
        if (entry.token !== 'theme-font-body' && entry.token !== 'theme-font-display') continue;
        const first = /^'([^']+)'/.exec(entry.value ?? '');
        if (first && !families.includes(first[1])) families.push(first[1]);
    }
    return families;
}

/** @param {string[]} families @returns {string} */
export function fontLinks(families) {
    if (families.length === 0) return '';
    const query = families.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}`).join('&');
    return (
        `<link rel="preconnect" href="https://fonts.googleapis.com" />\n` +
        `        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
        `        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${query}&display=swap" data-sc-fonts />`
    );
}

/** @param {string} theme @param {{all?: boolean}} [options] */
export function specimenBlocks(theme, { all = true } = {}) {
    return SPECIMENS.filter((s) => all || !s.fixturesOnly)
        .map(
            (s) =>
                `<section class="sc-specimen" id="${theme}-${s.id}" data-specimen="${s.id}">\n` +
                `                <h3>${s.title}</h3>\n` +
                `                <p class="sc-note">${s.note}</p>\n` +
                `                ${s.html(theme)}\n` +
                `            </section>`,
        )
        .join('\n            ');
}
