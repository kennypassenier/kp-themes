// What an example descriptor ASKS FOR reaches the page it generates
// [2026-09-07].
//
// The wizard example drew a wizard without being one: three badges, a
// form, and a `type="submit"` button labelled Next. Pressing it submitted
// the form and reloaded the page -- a white flash and back to the start,
// which is what Kenny saw on the published site. js/auto.js imports
// attachWizards and there was nothing for it to attach to.
//
// Repairing it found the sharper fault underneath. The Button renderer in
// showcase/examples.mjs listed the props it forwarded, and an allowlist
// drops in silence: the repaired descriptor asked for
// `data-kp-wizard-back` and `data-kp-wizard-next`, neither was on the
// list, and the buttons came out bare. The page would have carried the
// wizard's own hook while its two controls carried nothing -- a wizard
// that no longer reloads the page and still does not work.
//
// So this gate does not check a hand-written rule about wizards. It walks
// each descriptor's node tree, collects every `data-kp-*` attribute the
// descriptor asks for, and fails when one of them is absent from the HTML
// that descriptor produced. It is the renderers it holds to account, and
// it covers every component rather than the one that broke.
//
// AR26: it says how many attributes it expected to find, so a run that
// silently checks nothing is visible rather than green.

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { EXAMPLES } from '../showcase/examples.mjs';

const root = new URL('../', import.meta.url);

/**
 * Every `data-kp-*` attribute name a descriptor's tree asks for.
 *
 * @param {unknown} node
 * @param {Set<string>} [found]
 * @returns {Set<string>}
 */
export function requested(node, found = new Set()) {
    if (Array.isArray(node)) {
        for (const child of node) requested(child, found);
        return found;
    }
    if (node === null || typeof node !== 'object') return found;
    const shape = /** @type {{ props?: Record<string, unknown>, children?: unknown }} */ (node);
    for (const [key, value] of Object.entries(shape.props ?? {})) {
        if (key.startsWith('data-kp-') && value !== undefined && value !== null && value !== false) found.add(key);
    }
    if (shape.children) requested(shape.children, found);
    return found;
}

/** @returns {{ expected: number, missing: string[] }} */
export function audit() {
    let expected = 0;
    /** @type {string[]} */
    const missing = [];
    for (const example of EXAMPLES) {
        const asked = requested(example.body);
        expected += asked.size;
        if (!asked.size) continue;
        const html = readFileSync(new URL(`examples/${example.id}.html`, root), 'utf8');
        for (const attribute of asked) {
            if (!html.includes(attribute)) missing.push(`${example.id}.html: the descriptor asks for ${attribute} and the page does not carry it`);
        }
    }
    return { expected, missing };
}

const { expected, missing } = audit();
if (missing.length) {
    console.error(missing.join('\n'));
    process.exit(1);
}
console.log(`Examples: all ${expected} data-kp-* attributes the descriptors ask for reach the pages they generate.`);
