// One ID means one thing [KT10, 2026-09-07].
//
// docs/FEATURES.md froze D3 as "STRINGS_NL leaves the exports", one of
// round five's eight Essential features. AR27 and the brief given to the
// W1 agent used D3 for a different removal, the agent built that one, and
// the frozen D3 went unbuilt through five milestones, a merge, 1302
// browser tests and the combined report.
//
// Measuring where else that sat found the real size of it: 270 IDs across
// six documents, 23 defined in more than one, and eighteen of those
// meaning two different things -- T1..T16 are a technology choice here and
// an inventoried unit there, plus D3 and F1.
//
// So this gate does not check D3. It refuses a symbol defined in two
// documents at once, which is the property rather than the place.
//
// AR26: it reports how many IDs it read, so a run that silently checks
// nothing is visible rather than green.

import { readFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);

export const DOCUMENTS = [
    'docs/FEATURES.md',
    'docs/MINI_ROUNDS.md',
    'docs/INVENTORY.md',
    'docs/SCOPE.md',
    'docs/ARCHITECTURE_DECISIONS.md',
    'docs/CORRECTIONS.md',
];

/**
 * The pairs that are one thing written down twice rather than two things
 * sharing a name. A correction and its queued measure are the same item,
 * and so is a feature and the mini-round that revisits it.
 */
export const CROSS_REFERENCES = [
    { id: 'KT2', why: 'the correction and its queued measurement' },
    { id: 'KT7', why: 'the correction and its queued measurement' },
    { id: 'KT8', why: 'the correction and its queued measurement' },
    { id: 'KT9', why: 'the correction and its queued measurement' },
    { id: 'TH47', why: 'the feature and the mini-round that revisited its rating' },
    { id: 'KT10', why: 'the correction and its queued measurement — caught by this gate on the day it was written' },
];

/** An ID definition: a table row that opens with one, or a heading that names one. */
// An optional PREFIX- part, because the repair for KT10's eighteen
// collisions was to give the inventory its own namespace rather than to
// renumber it: INV-T1 is a different symbol from T1, and both are still
// read, so neither document falls outside the check.
const ROW = /^\|\s*((?:[A-Z]{2,4}-)?[A-Z]{1,4}[0-9]+[a-z]?)\s*\|/;
const HEADING = /^#{2,4}\s+((?:[A-Z]{2,4}-)?[A-Z]{1,4}[0-9]+[a-z]?)\b/;

/** @returns {{ total: number, defined: Map<string, string[]> }} */
export function definitions(read = (/** @type {string} */ f) => readFileSync(new URL(f, root), 'utf8')) {
    /** @type {Map<string, string[]>} */
    const defined = new Map();
    for (const file of DOCUMENTS) {
        for (const line of read(file).split('\n')) {
            const id = (ROW.exec(line) ?? HEADING.exec(line))?.[1];
            if (!id) continue;
            const where = defined.get(id) ?? [];
            if (!where.includes(file)) where.push(file);
            defined.set(id, where);
        }
    }
    return { total: defined.size, defined };
}

/** @param {Map<string, string[]>} defined */
export function collisions(defined) {
    const excused = new Set(CROSS_REFERENCES.map((c) => c.id));
    return [...defined.entries()]
        .filter(([id, where]) => where.length > 1 && !excused.has(id))
        .map(([id, where]) => `${id} is defined in ${where.join(' and ')}`);
}

const { total, defined } = definitions();
const clashes = collisions(defined);
if (clashes.length) {
    console.error(`An ID means one thing [KT10]. These mean two:\n${clashes.join('\n')}`);
    process.exit(1);
}
console.log(
    `IDs: ${total} defined across ${DOCUMENTS.length} documents, none in two of them (${CROSS_REFERENCES.length} cross-references excused with a reason).`,
);
