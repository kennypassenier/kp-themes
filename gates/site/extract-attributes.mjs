// The framework-free channel's props [AR21, TH100].
//
// `data-kp-*` is what a page without React writes: kyu, Almanac and the
// chassis kit configure every component through these attributes, and
// until this round they were documented nowhere. The critic counted 83
// distinct ones; this counts them by rule instead of by eye, and the rule
// is written down here because the number depends on it.
//
// Three roles, and an attribute can hold more than one:
//
//   selector  the module finds elements with it — the markup contract
//             (`[data-kp-dialog]`, `[data-kp-option]`)
//   read      the module reads a value from it — the channel's props
//             (`getAttribute`, `hasAttribute`, `el.dataset.kpX`, and the
//             string `'kpX'` handed to a dataset helper)
//   written   the module sets or deletes it — its own state, reflected
//             for CSS (`data-kp-armed`, `data-kp-*-attached`)
//
// An attribute that only ever appears in a comment gets the role `prose`,
// and that is a finding rather than a category: the JSDoc names an
// attribute the code does not read.
//
// Usage: node gates/site/extract-attributes.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { stripComments } from './source.mjs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const DIR = fileURLToPath(new URL('../../js/', import.meta.url));

/** @typedef {'selector' | 'read' | 'written' | 'prose'} Role */
/** @typedef {{ name: string, roles: Role[], modules: string[], families: string[] }} Attribute */

/**
 * `kpMaxTags` is `data-kp-max-tags`; the DOM's own rule, restated because
 * we apply it backwards.
 *
 * @param {string} key
 */
export function datasetKeyToAttribute(key) {
    return `data-${key.replace(/[A-Z]/g, (/** @type {string} */ c) => `-${c.toLowerCase()}`)}`;
}

/**
 * @param {string} source one module
 * @param {string} module its path, for the report
 * @param {Map<string, Attribute>} into
 */
function scanModule(source, module, into) {
    const family = module.replace(/^js\//, '').replace(/\.js$/, '');
    const code = stripComments(source);

    /** @param {string} name @param {Role} role */
    const note = (name, role) => {
        let entry = into.get(name);
        if (!entry) {
            entry = { name, roles: [], modules: [], families: [] };
            into.set(name, entry);
        }
        if (!entry.roles.includes(role)) entry.roles.push(role);
        if (!entry.modules.includes(module)) entry.modules.push(module);
        if (!entry.families.includes(family)) entry.families.push(family);
    };

    // The markup contract: an attribute inside a selector string.
    for (const match of code.matchAll(/\[(data-kp-[a-z0-9-]+)[\]=~^$*]/g)) note(match[1] ?? '', 'selector');

    for (const match of code.matchAll(/(?:get|has)Attribute\(\s*['"`](data-kp-[a-z0-9-]+)/g)) note(match[1] ?? '', 'read');
    for (const match of code.matchAll(/(?:set|remove|toggle)Attribute\(\s*['"`](data-kp-[a-z0-9-]+)/g)) note(match[1] ?? '', 'written');

    // `el.dataset.kpX` — an assignment or a delete is the module writing
    // its own state; anything else is the module reading the consumer's.
    for (const match of code.matchAll(/(delete\s+)?[\w.$]+\.dataset\.(kp[A-Za-z0-9]*)\s*(=[^=]|[\s\S])/g)) {
        const name = datasetKeyToAttribute(match[2] ?? '');
        const written = match[1] !== undefined || (match[3] ?? '').startsWith('=');
        note(name, written ? 'written' : 'read');
    }

    // `flag('kpOpenOnFocus', …)`: the key travels as a string into a
    // helper that reads `dataset[name]`, so the literal is the evidence.
    for (const match of code.matchAll(/['"`](kp[A-Z][A-Za-z0-9]*)['"`]/g)) note(datasetKeyToAttribute(match[1] ?? ''), 'read');

    // Markup the module writes itself: the picker's menu template carries
    // `data-kp-theme-group` as text in a string, which is neither a
    // selector nor a read but is not prose either.
    for (const match of code.matchAll(/data-kp-[a-z0-9-]+/g)) {
        if (!into.has(match[0])) note(match[0], 'written');
    }

    // Everything the file mentions at all, comments included. An
    // attribute reached only here is documented and unread.
    for (const match of source.matchAll(/data-kp-[a-z0-9-]+/g)) {
        const name = match[0];
        if (!into.has(name)) note(name, 'prose');
    }
}

/**
 * @returns {{ attributes: Attribute[], expected: number, byRole: Record<Role, number>, proseOnly: string[] }}
 */
export function extractAttributes() {
    /** @type {Map<string, Attribute>} */
    const found = new Map();
    const modules = readdirSync(DIR)
        .filter((f) => f.endsWith('.js'))
        .sort();

    for (const file of modules) scanModule(readFileSync(DIR + file, 'utf8'), `js/${file}`, found);

    const attributes = [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
    /** @type {Record<Role, number>} */
    const byRole = { selector: 0, read: 0, written: 0, prose: 0 };
    for (const attribute of attributes) for (const role of attribute.roles) byRole[role]++;

    return {
        attributes,
        // AR26: the universe is every name the sources contain, counted
        // independently of the classifier — an attribute the rules failed
        // to classify still shows up, as `prose`.
        expected: attributes.length,
        byRole,
        proseOnly: attributes.filter((a) => a.roles.length === 1 && a.roles[0] === 'prose').map((a) => a.name),
    };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const result = extractAttributes();
    const props = result.attributes.filter((a) => a.roles.includes('read')).length;
    console.log(
        `Attributes: ${result.expected} distinct data-kp-* across js/ — ` +
            `${props} the consumer sets, ${result.byRole.selector} markup hooks, ${result.byRole.written} written by the module.`,
    );
    if (result.proseOnly.length > 0) console.log(`  named only in a comment: ${result.proseOnly.join(', ')}`);
    if (result.expected === 0) {
        console.error('Attributes: none found, which cannot be right for a channel built on them.');
        process.exit(1);
    }
}
