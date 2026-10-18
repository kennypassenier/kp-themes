// The events the framework-free channel dispatches [AR21, TH100].
//
// These are already machine-readable and always were: every one is an
// exported constant whose name ends in `_EVENT`, next to the JSDoc line
// that says what its detail carries. Nothing here parses behaviour — the
// constant is the contract, and the module that exports it is the
// component that fires it.
//
// The cross-check is the point of the exercise: a constant named
// `*_EVENT` whose value is not a `kp-` event name, or a `kp-` event name
// exported under some other name, are both reported. Either would be an
// event the site documents wrongly or not at all.
//
// Usage: node gates/site/extract-events.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { stripComments } from './source.mjs';

const DIR = fileURLToPath(new URL('../../js/', import.meta.url));

/** @typedef {{ constant: string, name: string, module: string, family: string, description: string, detail: string | null, dispatches: number }} EventRecord */

/**
 * The JSDoc line immediately above a declaration, if there is one.
 *
 * @param {string} source
 * @param {number} index where the declaration starts
 */
function docAbove(source, index) {
    const before = source.slice(0, index).trimEnd();
    if (!before.endsWith('*/')) return '';
    const open = before.lastIndexOf('/**');
    if (open < 0) return '';
    return before
        .slice(open + 3, before.length - 2)
        .split('\n')
        .map((line) => line.replace(/^\s*\* ?/, '').trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * How often a module dispatches an event constant: directly through
 * `new CustomEvent(CONSTANT …)` (also as one branch of the type expression,
 * `cond ? A_EVENT : B_EVENT`), or through a local `emit(…, CONSTANT …)` helper
 * that builds and dispatches the event itself.
 *
 * @param {string} code the module with comments stripped
 * @param {string} constant
 */
function countDispatches(code, constant) {
    const direct = new RegExp(`new CustomEvent\\(\\s*[^,;]*\\b${constant}\\b`, 'g');
    const helper = new RegExp(`\\bemit\\w*\\(\\s*[^;()]*\\b${constant}\\b`, 'g');
    return [...code.matchAll(direct)].length + [...code.matchAll(helper)].length;
}

/**
 * @returns {{ events: EventRecord[], expected: number, mismatched: string[], unnamed: string[] }}
 */
export function extractEvents() {
    const modules = readdirSync(DIR)
        .filter((f) => f.endsWith('.js'))
        .sort();

    /** @type {EventRecord[]} */
    const events = [];
    /** @type {string[]} */
    const mismatched = [];
    /** @type {string[]} */
    const unnamed = [];
    let expected = 0;

    for (const file of modules) {
        const module = `js/${file}`;
        const source = readFileSync(DIR + file, 'utf8');
        const code = stripComments(source);

        for (const match of source.matchAll(/^export const ([A-Z][A-Z0-9_]*) = '([^']*)';/gm)) {
            const constant = match[1] ?? '';
            const value = match[2] ?? '';
            const isNamedEvent = constant.endsWith('_EVENT');
            if (isNamedEvent) expected++;

            // A selector constant also holds a `kp-` string; it is not an
            // event, and its shape says so.
            const looksLikeEvent = /^kp[-:][a-z0-9-]+$/.test(value);
            if (isNamedEvent && !looksLikeEvent) {
                mismatched.push(`${module}: ${constant} = '${value}' is named as an event but is not a kp- event name`);
                continue;
            }
            if (!isNamedEvent) {
                if (looksLikeEvent) unnamed.push(`${module}: ${constant} = '${value}' looks like an event but is not named *_EVENT`);
                continue;
            }

            const description = docAbove(source, match.index ?? 0);
            const detail = /`(\{[^`]*\})`/.exec(description)?.[1] ?? /Detail: ([A-Za-z]+)\./.exec(description)?.[1] ?? null;
            events.push({
                constant,
                name: value,
                module,
                family: file.replace(/\.js$/, ''),
                description,
                detail,
                dispatches: countDispatches(code, constant),
            });
        }
    }

    return { events, expected, mismatched, unnamed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const result = extractEvents();
    const dispatched = result.events.filter((e) => e.dispatches > 0).length;
    const documented = result.events.filter((e) => e.description !== '').length;
    // AR26: the expectation is the number of *_EVENT constants the
    // modules export, counted before anything is accepted.
    console.log(
        `Events: ${result.events.length} of ${result.expected} exported *_EVENT constants across js/, ` +
            `${documented} with a JSDoc line, ${dispatched} dispatched in their own module.`,
    );
    for (const line of result.mismatched) console.log(`  ${line}`);
    for (const line of result.unnamed) console.log(`  ${line}`);
    if (result.events.length !== result.expected) {
        console.error('Events: a constant named as an event was not collected as one.');
        process.exit(1);
    }
}
