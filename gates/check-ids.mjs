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
    { id: 'TH132', why: 'the feature and its queued mini-round (rated Later at round six) — caught by this gate at the KT10 drill' },
];

/** An ID definition: a table row that opens with one, or a heading that names one. */
// An optional PREFIX- part, because the repair for KT10's eighteen
// collisions was to give the inventory its own namespace rather than to
// renumber it: INV-T1 is a different symbol from T1, and both are still
// read, so neither document falls outside the check.
//
// Phase 7 widened both, and added the third shape. The gate was written
// for the T/D/F/TH series and saw nothing else, so the whole of round
// seven's vocabulary — scope-, fix-, gap-, step-, feat- — lived outside
// it. That is how `scope-24` came to mean two different decisions on two
// consecutive days, which is KT10 exactly, in the document KT10's gate
// was written for.
const SERIES = '(?:[A-Z]{2,4}-)?[A-Z]{1,4}[0-9]+[a-z]?|(?:scope|fix|gap|step)-[0-9]+(?:-M[0-9]+)?|feat-[a-z]+-[0-9]+';
const ROW = new RegExp(`^\\|\\s*(${SERIES})\\s*\\|`);
// A definition heading names the ID and then says what it is, with the
// middot between. Without that, `## AR30 amended …` and `## KT1's
// fallback …` read as second definitions of things defined once.
const HEADING = new RegExp(`^#{2,4}\\s+(${SERIES})\\s*·`);
/** A bold paragraph lead, which is how docs/SCOPE.md states a decision. */
const LEAD = new RegExp(`^\\*\\*(${SERIES})\\s*·`);

/** @typedef {{ file: string, shape: string, at: string }} Site */
/** @returns {{ total: number, defined: Map<string, Site[]> }} */
export function definitions(read = (/** @type {string} */ f) => readFileSync(new URL(f, root), 'utf8')) {
    /** @type {Map<string, Site[]>} */
    const defined = new Map();
    for (const file of DOCUMENTS) {
        const lines = read(file).split('\n');
        for (const [n, line] of lines.entries()) {
            const row = ROW.exec(line);
            const id = (row ?? HEADING.exec(line) ?? LEAD.exec(line))?.[1];
            if (!id) continue;
            // Shape, not just file. The old form deduplicated within a
            // document, so a document defining an ID twice could not
            // collide with itself — and that is exactly how it happened.
            // But a document may index its own entries: docs/INVENTORY.md
            // lists INV-T1 in a summary table and again as the heading of
            // the section about it, which is one definition seen twice.
            // So one row and one heading in a file is an index; two of
            // the same shape is two definitions.
            const shape = row ? 'row' : 'prose';
            const where = defined.get(id) ?? [];
            where.push({ file, shape, at: `${file}:${n + 1}` });
            defined.set(id, where);
        }
    }
    return { total: defined.size, defined };
}

/** @param {Map<string, Site[]>} defined */
export function collisions(defined) {
    const excused = new Set(CROSS_REFERENCES.map((c) => c.id));
    /** @type {string[]} */
    const found = [];
    for (const [id, where] of defined) {
        if (excused.has(id)) continue;

        const files = [...new Set(where.map((w) => w.file))];
        if (files.length > 1) {
            found.push(`${id} is defined in ${where.map((w) => w.at).join(' and ')}`);
            continue;
        }

        // Inside one document: a row and a heading are an index and its
        // body, one definition written twice. Two of the same shape are
        // two definitions, which is the fault.
        for (const shape of ['row', 'prose']) {
            const same = where.filter((w) => w.shape === shape);
            if (same.length > 1)
                found.push(`${id} is defined ${same.length} times in ${files[0]}, at ${same.map((w) => w.at.split(':')[1]).join(' and ')}`);
        }
    }
    return found;
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
