// The review-notes file (catalogue/review-notes.json): read, order, write, clear, put.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { notesPath } from './paths.mjs';
/** @typedef {import('./types.mjs').Notes} Notes */

/** @returns {Notes} the review notes, or none when the file is not there */
export function readNotes(path = notesPath) {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

/**
 * Blocks and themes in a fixed order, fields in the order a reader wants them.
 * @param {Notes} notes
 * @returns {Notes}
 */
export function sortedNotes(notes) {
    /** @type {Notes} */
    const out = {};
    for (const key of Object.keys(notes).sort()) {
        const themes = Object.keys(notes[key]).sort();
        if (!themes.length) continue;
        out[key] = {};
        for (const theme of themes) {
            const { rejected, change, commit, given } = notes[key][theme];
            out[key][theme] = { rejected, change, ...(commit ? { commit } : {}), given };
        }
    }
    return out;
}

/** @param {Notes} notes */
export function writeNotes(notes, path = notesPath) {
    writeFileSync(path, `${JSON.stringify(sortedNotes(notes), null, 4)}\n`);
}

/**
 * Clear the note of every block and theme an approved line covers, in any
 * engine; a rejected line leaves the note, for Claude to rewrite.
 * @param {Notes} notes
 * @param {{ key: string, theme: string, verdict: string }[]} lines
 * @returns {string[]} `block · theme` for every note cleared
 */
export function clearApprovedNotes(notes, lines) {
    const cleared = [];
    for (const { key, theme, verdict } of lines) {
        if (verdict !== 'approved' || !notes[key]?.[theme]) continue;
        delete notes[key][theme];
        if (!Object.keys(notes[key]).length) delete notes[key];
        cleared.push(`${key} · ${theme}`);
    }
    return cleared;
}

/**
 * Write one note into `notes`, or say why not.
 * @param {Notes} notes
 * @param {{ key?: string, theme?: string, rejected?: string, change?: string, commit?: string }} note
 * @param {{ known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string }} context
 * @returns {string[]} faults; none means the note is written
 */
export function putNote(notes, { key, theme, rejected, change, commit }, context) {
    const faults = [];
    const at = `${key} · ${theme}`;
    if (!key || !context.known.has(key)) faults.push(`${at}: not a block any review page shows`);
    if (!theme || !context.themes.includes(theme)) faults.push(`${at}: not a theme`);
    if (!rejected?.trim()) faults.push(`${at}: --rejected "<Kenny's note>" is missing or empty`);
    if (!change?.trim()) faults.push(`${at}: --change "<what changed>" is missing or empty`);
    const id = commit ?? context.commit;
    if (!/^[0-9a-f]{7,40}$/.test(id)) faults.push(`${at}: --commit ${id} is not a commit id`);
    if (faults.length || !key || !theme) return faults;
    (notes[key] ??= {})[theme] = { rejected: String(rejected), change: String(change).trim(), commit: id, given: context.given };
    return [];
}
