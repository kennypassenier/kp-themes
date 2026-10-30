// The `record` and `note` commands: write verdicts and review notes from a prompt.

import { dirname, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { hashVersion, knownBlocks, NOTES, REGISTER } from '../check-verdicts.mjs';
import { git, notesPath, registerPath } from './paths.mjs';
import { applyVerdictLines, parseVerdictLines } from './verdict-lines.mjs';
import { readRegister, today, writeRegister } from './register.mjs';
import { pixels } from './pixels.mjs';
import { clearApprovedNotes, putNote, readNotes, writeNotes } from './notes.mjs';

/**
 * Record a pasted prompt: the verdicts into the register, and every note an
 * approval answers out of the notes.
 * @param {string} input
 * @param {{ registerFile?: string, notesFile?: string, hashVersion: number, known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string }} context
 * @returns {{ ok: boolean, out: string[], err: string[] }}
 */
export function recordPrompt(input, { registerFile = registerPath, notesFile = notesPath, ...context }) {
    const parsed = parseVerdictLines(input);
    if (parsed.faults.length) return { ok: false, out: [], err: [`Nothing recorded:\n  ${parsed.faults.join('\n  ')}`] };
    const register = readRegister(registerFile);
    const pixelFile = join(dirname(registerFile), 'pixel-checks.json');
    const pixels = existsSync(pixelFile) ? JSON.parse(readFileSync(pixelFile, 'utf8')) : null;
    const reopened = (/** @type {string} */ key, /** @type {string} */ theme, /** @type {string} */ engine, /** @type {string} */ from) => {
        const check = pixels?.checks?.[key]?.[theme]?.[engine];
        return ['reopened', 'unstable'].includes(check?.state ?? '') && (!check?.from || check.from === from);
    };
    const report = applyVerdictLines(register, parsed, { reopened, ...context });
    if (report.faults.length) {
        return { ok: false, out: [], err: [`Nothing recorded; ${report.faults.length} line(s) refused:\n  ${report.faults.join('\n  ')}`] };
    }
    writeRegister(register, registerFile);
    /** @type {string[]} */
    const out = [];
    const list = (/** @type {string} */ title, /** @type {string[]} */ rows) => {
        if (rows.length) out.push(`${title} (${rows.length}):\n  ${rows.join('\n  ')}`);
    };
    list('Added', report.added);
    list('Changed', report.changed);
    list('Already recorded', report.unchanged);
    out.push(`${REGISTER}: ${report.added.length} added, ${report.changed.length} changed, ${report.unchanged.length} already there.`);
    out.push(`Whether the test browser reads the same hashes [fix-28]: ${compareCommand(context.commit)}`);
    const notes = readNotes(notesFile);
    const cleared = clearApprovedNotes(notes, parsed.lines);
    if (cleared.length) {
        writeNotes(notes, notesFile);
        for (const row of cleared) out.push(`note cleared: ${row}`);
    }
    return { ok: true, out, err: [] };
}

/** The command that checks the entries recorded at `commit` against the test browser. @param {string} commit */
export const compareCommand = (commit) => `node gates/verdicts.mjs compare --against-browser --commit ${commit.slice(0, 12)}`;

export async function record() {
    const { THEMES } = await import('../../js/theme-registry.js');
    const result = recordPrompt(readFileSync(0, 'utf8'), {
        hashVersion: hashVersion(),
        known: await knownBlocks(),
        themes: THEMES.map((t) => t.name),
        commit: git('rev-parse', 'HEAD'),
        given: today(),
    });
    for (const line of result.err) console.error(line);
    for (const line of result.out) console.log(line);
    if (!result.ok) process.exit(1);
}

/** @param {string[]} args */
export async function note(args) {
    const [key, theme] = args;
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const { THEMES } = await import('../../js/theme-registry.js');
    const file = process.env.KP_REVIEW_NOTES ?? notesPath;
    const notes = readNotes(file);
    const faults = putNote(
        notes,
        { key, theme, rejected: option('--rejected'), change: option('--change'), commit: option('--commit') },
        { known: await knownBlocks(), themes: THEMES.map((t) => t.name), commit: git('rev-parse', '--short', 'HEAD'), given: today() },
    );
    if (faults.length) {
        console.error(`No note written:\n  ${faults.join('\n  ')}`);
        process.exit(1);
    }
    writeNotes(notes, file);
    console.log(`${NOTES}: note written for ${key} · ${theme}.`);
}

/* ------------------------------------------------------------------ rehash */
