// One theme's comparison page: its difference list and the side-by-side frames.

import { el, renderHTML } from '../../showcase/examples.mjs';
import { THEMES } from '../../js/theme-registry.js';
import { CEILING } from '../check-texture.mjs';
import { PAGE_SCRIPT, page } from './frames.mjs';
/** @typedef {import('./types.mjs').ThemeDiff} ThemeDiff */

/** The row of theme links, the current one marked. */
export function themeLinks(/** @type {string | null} */ current) {
    return el(
        'ul',
        { class: 'kp-row', id: 'compare-themes' },
        THEMES.map((theme) =>
            el(
                'li',
                {},
                el(
                    'a',
                    {
                        href: `compare-${theme.name}.html`,
                        'data-theme-link': theme.name,
                        ...(theme.name === current ? { 'aria-current': 'page' } : {}),
                    },
                    theme.label,
                ),
            ),
        ),
    );
}

/**
 * @param {string} kind
 * @param {{ src: string, title: string }} left
 * @param {{ src: string, title: string }} right
 */
function pair(kind, left, right) {
    const frame = (/** @type {{ src: string, title: string }} */ side, /** @type {string} */ role) =>
        el(
            'section',
            { class: 'kp-stack', 'aria-label': side.title },
            el('h3', {}, side.title),
            el('iframe', { src: side.src, title: side.title, width: '100%', height: '900', 'data-compare-side': role }),
        );
    return el('div', { class: 'kp-autogrid kp-autogrid--tight', 'data-compare-pair': kind }, frame(left, 'old'), frame(right, 'new'));
}

/**
 * A statement that lists every token (cyberpunk's palette line names 77)
 * folds behind its first clause, so the page stays readable and the
 * measurement stays on it.
 * @param {string} line
 */
function foldLong(line) {
    const at = line.indexOf(' — ');
    if (line.length < 240 || at === -1) return [line];
    return [el('details', {}, el('summary', {}, line.slice(0, at)), el('p', { class: 'kp-prose' }, line.slice(at + 3)))];
}

/** The name 4.0.0 knew a renamed theme by [Kenny, 2026-09-08]. */
/** @type {Record<string, string>} */
const WAS = { forest: 'topo', woodblock: 'nishiki' };

/** One theme's page: the statements, then the whole demo twice. @param {ThemeDiff} d */
export function themePage(d) {
    const marks = d.show.filter((cat) => cat !== 'texture' || d.texture.old !== d.texture.now).join(',');
    const q = `?theme=${d.name}${marks ? `&mark=${marks}` : ''}`;
    // A renamed theme asks 4.0.0 for the name 4.0.0 knew; asking for the
    // new one would paint the loud fallback and call a rename a redesign.
    const oldQ = `?theme=${WAS[d.name] ?? d.name}${marks ? `&mark=${marks}` : ''}`;
    const pairs = [
        pair(
            '',
            { src: `compare-frame-4.0.0.html${oldQ}`, title: `${d.label} under 4.0.0${WAS[d.name] ? ` (as ${WAS[d.name]})` : ''}` },
            { src: `compare-frame.html${q}`, title: `${d.label} under the current build` },
        ),
    ];
    if (d.texture.proposal !== null && d.texture.now !== null && d.texture.now > CEILING) {
        const factor = (d.texture.proposal / d.texture.now).toFixed(3);
        pairs.push(
            pair(
                'texture',
                { src: `compare-frame.html?theme=${d.name}&mark=texture`, title: `Texture today (${d.texture.now})` },
                { src: `compare-frame.html?theme=${d.name}&mark=texture&texture=${factor}`, title: `Proposal (${d.texture.proposal})` },
            ),
        );
    }
    const body = [
        el(
            'main',
            { id: 'main', class: 'kp-page kp-page--full', tabindex: '-1', 'data-compare-theme': d.name },
            el(
                'div',
                { class: 'kp-stack' },
                el('h1', {}, `${d.label} — old against new`),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'The whole concept demo twice: on the left under the 4.0.0 release, on the right under the current build, scrolling together. ',
                    'The differences are measured from the two stylesheets and the shipped fonts, said below, and marked on the demo where they show. ',
                    'Both sides share the current component layer, so what differs is the theme.',
                ),
                themeLinks(d.name),
                el('h2', {}, 'What is different'),
                el(
                    'ul',
                    { class: 'kp-stack', 'data-compare-lines': '' },
                    d.lines.map((line) => el('li', {}, ...foldLong(line))),
                ),
                ...pairs,
                el(
                    'p',
                    { class: 'kp-prose' },
                    el('a', { href: `concept.html?theme=${d.name}` }, 'The concept demo on its own'),
                    ' under this theme, with the picker.',
                ),
            ),
        ),
    ];
    return page(`${d.label}, old against new`, renderHTML(body, 8), { script: PAGE_SCRIPT });
}
