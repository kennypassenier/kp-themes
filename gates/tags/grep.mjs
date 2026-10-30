// Building the Playwright --grep pattern for a selection at a level.

import { relative } from 'node:path';

const escape = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A tag, whole: `@component:table` must not match `@component:tables`. */
const tagPattern = (/** @type {string} */ t) => `(?:^|\\s)${escape(t)}(?=\\s|$)`;

/**
 * The `--grep` for a level, or null for "no filter" (everything).
 *
 * Playwright matches `--grep` against the title path — project, file,
 * describes, title — followed by the tags, joined by spaces. A file is
 * matched by its name as the title path writes it.
 *
 * @param {{ all: boolean, terms: string[][], specs: string[] }} selection
 * @param {'building' | 'commit' | 'engines' | 'release' | 'changed'} level
 * @returns {string | null | ''} null: every test; '': nothing to run
 */
export function grepFor(selection, level) {
    if (level === 'release' || selection.all) return null;
    const terms = [...selection.terms];
    if (level === 'commit' || level === 'engines' || level === 'changed') terms.push(['@sweep']);
    const parts = terms.map((and) => (and.length === 1 ? tagPattern(and[0]) : `^${and.map((t) => `(?=[\\s\\S]*${tagPattern(t)})`).join('')}`));
    for (const spec of selection.specs) parts.push(`(?:^|\\s)${escape(relative('tests', spec))}\\s`);
    return parts.length ? parts.join('|') : '';
}
