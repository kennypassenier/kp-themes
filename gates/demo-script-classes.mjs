// The package classes a research demo's own scripts render (chassis-rs gap 19:
// check-demo-variants read only the static HTML, so a section whose markup a
// script draws into an empty stage showed the gate none of its components).
//
// No browser: the demo's own scripts are read as text. A script is the demo's
// own when it lives under research/ outside the shared review kit
// (research/_review/); its relative imports are followed under the same rule,
// so a shared demo helper (research/chassis-kit-pages/kit.js) counts too. The
// package (js/) and the catalogue shell are not demo markup and are skipped.
//
// What is recognised, in any string or template literal:
//   kp-badge kp-badge--warning                 a class written out
//   kp-alert--${over ? 'destructive' : 'warning'}  a modifier picked in a
//                                              template: every quoted word in
//                                              the interpolation counts
// A modifier built by concatenation ('kp-badge--' + level) is not seen.
import { posix } from 'node:path';

/** The kit every demo loads; it renders the review chrome, not the demo. */
const REVIEW_KIT = 'research/_review/';
const DEMO_ROOT = 'research/';

const NAME = '[a-z0-9]+(?:-[a-z0-9]+)*';
/** `kp-name` not preceded by a word or dash (so `data-kp-state` is skipped). */
const COMPONENT = new RegExp(`(?<![\\w-])kp-(${NAME})(?![\\w-])`, 'g');
const MODIFIER = new RegExp(`(?<![\\w-])kp-(${NAME})--(${NAME})(?![\\w-])`, 'g');
const PICKED = new RegExp(`(?<![\\w-])kp-(${NAME})--\\$\\{([^}]*)\\}`, 'g');
const QUOTED = /['"`]([a-z0-9]+(?:-[a-z0-9]+)*)['"`]/g;

const SCRIPT_TAG = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const IMPORT = /(?:\bimport\s*(?:[^'"]*?\bfrom\s*)?|\bimport\s*\()\s*['"](\.{1,2}\/[^'"]+)['"]/g;

/** @param {string} path repo-relative */
const isDemoScript = (path) => path.startsWith(DEMO_ROOT) && !path.startsWith(REVIEW_KIT);

/**
 * Every class a piece of script text writes: components by name and
 * modifiers as `name--variant`.
 * @param {string} text
 */
export function scriptClasses(text) {
    /** @type {Set<string>} */
    const components = new Set();
    /** @type {Set<string>} */
    const modifiers = new Set();
    for (const m of text.matchAll(COMPONENT)) components.add(m[1]);
    for (const m of text.matchAll(MODIFIER)) {
        components.add(m[1]);
        modifiers.add(`${m[1]}--${m[2]}`);
    }
    for (const m of text.matchAll(PICKED)) {
        components.add(m[1]);
        for (const q of m[2].matchAll(QUOTED)) modifiers.add(`${m[1]}--${q[1]}`);
    }
    return { components, modifiers };
}

/**
 * The texts of a demo's own scripts: inline ones (data blocks aside) and
 * every demo-owned file reached by src or a relative import.
 * @param {string} demo repo-relative path of the demo page
 * @param {(path: string) => string} read reads a repo-relative path
 * @param {(path: string) => boolean} exists
 * @returns {string[]}
 */
export function demoScripts(demo, read, exists) {
    /** @type {string[]} */
    const texts = [];
    /** @type {Set<string>} */
    const seen = new Set();
    /** @param {string} path */
    const follow = (path) => {
        if (seen.has(path) || !isDemoScript(path)) return;
        seen.add(path);
        if (!exists(path)) throw new Error(`${demo}: script ${path} is missing`);
        const text = read(path);
        texts.push(text);
        for (const m of text.matchAll(IMPORT)) follow(posix.join(posix.dirname(path), m[1]));
    };
    for (const m of read(demo).matchAll(SCRIPT_TAG)) {
        const attrs = m[1];
        if (/\btype\s*=\s*["']application\//.test(attrs)) continue;
        const src = /\bsrc\s*=\s*["']([^"']+)["']/.exec(attrs)?.[1];
        if (!src) {
            texts.push(m[2]);
            for (const i of m[2].matchAll(IMPORT)) follow(posix.join(posix.dirname(demo), i[1]));
        } else if (!/^[a-z]+:/i.test(src)) follow(posix.join(posix.dirname(demo), src));
    }
    return texts;
}

/**
 * The classes a demo's own scripts render, as one pool for the whole page
 * (a script may draw into any section, so no section owns them).
 * @param {string} demo
 * @param {(path: string) => string} read
 * @param {(path: string) => boolean} exists
 */
export function renderedClasses(demo, read, exists) {
    return scriptClasses(demoScripts(demo, read, exists).join('\n'));
}
