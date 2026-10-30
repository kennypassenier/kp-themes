// Parsing a copied prompt's "Verdict lines" block and applying it to the register.

import { ratioFault, VERDICTS } from '../check-verdicts.mjs';
import { ratioOf } from './register.mjs';
/** @typedef {import('./types.mjs').Register} Register */

/**
 * The verdict lines of a pasted prompt: `key · theme · engine · verdict · hash`,
 * and a sixth field `@<ratio>` where the hash was read at a device pixel
 * ratio other than 1 [fix-34].
 * @param {string} text
 * @returns {{ version: number | null, lines: { key: string, theme: string, engine: string, verdict: string, hash: string, ratio: number, raw: string }[], faults: string[] }}
 */
export function parseVerdictLines(text) {
    const rows = text.split(/\r?\n/);
    const start = rows.findIndex((row) => /^\s*Verdict lines \(hash version \d+\):\s*$/.test(row));
    if (start === -1) return { version: null, lines: [], faults: ['no "Verdict lines (hash version N):" block in the input'] };
    const version = Number(/\d+/.exec(rows[start])?.[0]);
    /** @type {{ key: string, theme: string, engine: string, verdict: string, hash: string, ratio: number, raw: string }[]} */
    const lines = [];
    /** @type {string[]} */
    const faults = [];
    /** @type {number | null} */
    let declared = null;
    for (const row of rows.slice(start + 1)) {
        const raw = row.trim();
        if (!raw) break;
        const end = /^End of verdict lines: (\d+)\.$/.exec(raw);
        if (end) {
            declared = Number(end[1]);
            break;
        }
        const parts = raw.split(' · ').map((part) => part.trim());
        if (parts.length !== 5 && parts.length !== 6) {
            faults.push(`not five fields (or six, with @ratio) separated by " · ": ${raw}`);
            continue;
        }
        const [key, theme, engine, verdict, hash, at] = parts;
        if (at !== undefined && !/^@\d+(?:\.\d+)?$/.test(at)) {
            faults.push(`the sixth field is not @<ratio>: ${raw}`);
            continue;
        }
        lines.push({ key, theme, engine, verdict, hash, ratio: at === undefined ? 1 : Number(at.slice(1)), raw });
    }
    if (!lines.length && !faults.length) faults.push('the "Verdict lines" block is empty');
    // A copied prompt ends its block with "End of verdict lines: N." (2026-10-03,
    // after two prompts lost the tail of their last line in transit).
    if (declared === null) faults.push('the "Verdict lines" block has no "End of verdict lines: N." line: the prompt was cut off; copy it again');
    else if (declared !== lines.length + faults.length)
        faults.push(`the block says ${declared} line(s) and holds ${lines.length + faults.length}: the prompt was cut off or edited; copy it again`);
    return { version, lines, faults };
}

/**
 * Apply parsed lines to a register.
 * @param {Register} register
 * @param {ReturnType<typeof parseVerdictLines>} parsed
 * @param {{ hashVersion: number, known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string, reopened?: (key: string, theme: string, engine: string, from: string) => boolean }} context
 * @returns {{ added: string[], changed: string[], unchanged: string[], faults: string[] }}
 */
export function applyVerdictLines(register, { version, lines }, { hashVersion: current, known, themes, commit, given, reopened = () => false }) {
    /** @type {{ added: string[], changed: string[], unchanged: string[], faults: string[] }} */
    const report = { added: [], changed: [], unchanged: [], faults: [] };
    if (version !== current) report.faults.push(`the lines were taken with hash version ${version}, the pages read ${current}`);
    if (register.hashVersion !== current)
        report.faults.push(`the register is at hash version ${register.hashVersion}: run node gates/verdicts.mjs rehash first`);
    for (const line of lines) {
        const at = `${line.key} · ${line.theme} · ${line.engine}`;
        if (!known.has(line.key)) report.faults.push(`${at}: not a block any review page shows`);
        if (!themes.includes(line.theme)) report.faults.push(`${at}: not a theme`);
        if (!/^[a-z0-9]+$/.test(line.engine)) report.faults.push(`${at}: not an engine name`);
        if (!VERDICTS.includes(line.verdict)) report.faults.push(`${at}: verdict ${line.verdict} is not approved or rejected`);
        if (!/^[0-9a-f]{64}$/.test(line.hash)) report.faults.push(`${at}: the hash is not a full SHA-256`);
        const wrong = (line.ratio ?? 1) === 1 ? null : ratioFault(line.ratio);
        if (wrong) report.faults.push(`${at}: ${wrong}`);
    }
    if (report.faults.length) return report;
    for (const line of lines) {
        const at = `${line.key} · ${line.theme} · ${line.engine} · ${line.verdict}`;
        const engines = ((register.verdicts[line.key] ??= {})[line.theme] ??= {});
        const before = engines[line.engine];
        const ratio = line.ratio ?? 1;
        // The same verdict still answers a pixel check that reopened it: it
        // moves to this commit, so the check no longer applies [scope-138].
        const same = before && before.verdict === line.verdict && before.hash === line.hash && ratioOf(before) === ratio;
        if (same && !reopened(line.key, line.theme, line.engine, before.commit)) {
            report.unchanged.push(at);
            continue;
        }
        engines[line.engine] = { verdict: line.verdict, hash: line.hash, commit, given, ...(ratio !== 1 ? { ratio } : {}) };
        (before ? report.changed : report.added).push(before ? `${at} (was ${before.verdict}, ${before.hash.slice(0, 12)}…)` : at);
    }
    return report;
}

/* ------------------------------------------------------------ review notes */
