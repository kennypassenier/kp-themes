// The no-flash snippet for strategy (b).
//
// js/no-flash.js copies the stored theme onto <html> before the
// stylesheet paints, so a visitor who chose a dark theme never sees a
// light frame. When the register is loaded lazily the same moment has a
// second job: put the FIRST register link into the document before
// first paint, or the page paints its tokens with no register and the
// register lands a frame (or, on a slow link, a second) later.
//
// A <link> appended by script is not render-blocking in general; one
// written by document.write during parsing is parser-inserted and every
// browser blocks on it. That is the one thing document.write is still
// the right tool for, and it is used for that alone.
//
// The name is validated against the generated list of themes before it
// reaches the URL: a stored name from a newer deployment, or a hand-set
// one, falls back rather than asking for a file that is not there.

import { STORAGE_KEY, THEMES } from '../../../js/theme-registry.js';
import { EFFECTS_ATTRIBUTE, THEME_ATTRIBUTE } from '../../../js/no-flash.js';

/** @param {unknown} value */
const jsString = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

/**
 * The snippet to inline inside <script> in <head>, before the shared
 * stylesheet links. Plain ES5, no imports.
 *
 * @param {{ key?: string, attribute?: string, effects?: boolean, base?: string, min?: boolean, fallback?: string, names?: readonly string[] }} [options]
 * @returns {string}
 */
export function noFlashLazySnippet({
    key = STORAGE_KEY,
    attribute = THEME_ATTRIBUTE,
    effects = false,
    base = '/css/',
    min = false,
    fallback = 'formal',
    names = THEMES.map((t) => t.name),
} = {}) {
    const arm = effects ? `\n    d.setAttribute(${jsString(EFFECTS_ATTRIBUTE)}, '');` : '';
    return `(function () {
    var d = document.documentElement, t = null;
    try { t = localStorage.getItem(${jsString(key)}); } catch (e) {}
    if (t) d.setAttribute(${jsString(attribute)}, t);${arm}
    var theme = d.getAttribute(${jsString(attribute)}) || ${jsString(fallback)};
    if (${jsString(names)}.indexOf(theme) < 0) theme = ${jsString(fallback)};
    document.write('<link rel="stylesheet" href="' + ${jsString(base)} + theme + '-register${min ? '.min' : ''}.css" data-kp-register="' + theme + '">');
})();`;
}
