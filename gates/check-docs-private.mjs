// Nothing private in a document of a PUBLIC repository [Phase 8, C4].
//
// The procedure's warning is specific and this project proved it: the
// dangerous content of a document is rarely what a person typed into it,
// but what the ASSISTANT wrote in during an earlier phase because
// recording it seemed useful at the time. Measured on 2026-09-12, with
// `gh repo view` confirming the repository is public: thirty-three links
// to private Claude artifacts, a session id in five files, and two
// absolute paths through a person's home directory — every one of them
// written by Claude while minuting a gate or a lift.
//
// Two kinds of check, because the two classes are not alike.
//
// REFUSED outright: credentials, keys, tokens, email addresses and
// routable addresses. None are present today and none ever should be, so
// the gate simply says no.
//
// RATCHETED: the links and ids that are already on the published branch.
// These are NOT a leak and calling them one would be wrong: a Claude
// artifact is private by default, so the link is simply dead for anyone
// who was not given access. What they are is thirty-nine references a
// reader of a public repository cannot follow — docs/LIFT_PLAN.md cites
// "the approved demo" twenty-three times and opens none of them — and a
// session id that means nothing outside the machine it ran on.
//
// Whether they stay is a question about the documents' worth, not about
// safety, and it is Kenny's: removing them loses the traceability the S49
// record rests on. What the gate does is hold the count where it is, so
// the answer to "did this get worse" is mechanical.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const root = new URL('../', import.meta.url);

/** @type {[string, RegExp][]} Shapes that are never acceptable in a document here. */
export const REFUSED = [
    ['a private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
    ['an API token', /\b(?:sk|pk|ghp|gho|github_pat|xox[baprs])[-_][A-Za-z0-9_-]{8,}/g],
    ['a secret assigned in prose', /\b(?:password|passwd|secret|api[_-]?key|auth[_-]?token)\s*[:=]\s*["'][^"'\s]{6,}["']/gi],
    ['an email address', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(?:com|net|org|io|dev|be|nl|eu)\b/g],
    ['a routable address', /\b(?:(?!0\.)(?!1\.0\.)\d{1,3}\.){3}\d{1,3}(?::\d{2,5})\b/g],
];

/** @type {[string, RegExp, number][]} Shapes already published, held to their count so they cannot grow. */
export const RATCHETED = [
    // Counted on 2026-09-12 with `git ls-files '*.md' | xargs grep -oE`.
    // Occurrences, not distinct values: thirty-nine mentions of what are
    // twenty-six distinct artifacts, because a demo is cited from more
    // than one document.
    ['a link to a private artifact', /https:\/\/claude\.ai\/code\/artifact\/[a-f0-9-]{8,}/g, 39],
    ["a session's own id", /\b0f370a8a-aa0a-4f17-8db1-4774735a6a56\b/g, 5],
    // Two are Kenny's own working directory; the third is a CI runner's
    // path quoted inside a correction, which is a fact about a build and
    // not about a person.
    ["an absolute path through someone's home", /\/home\/[a-z][a-z0-9_-]*\/[A-Za-z]/g, 3],
];

/** @param {(f: string) => string} [read] */
export function scan(read = (f) => readFileSync(new URL(f, root), 'utf8')) {
    const files = execFileSync('git', ['-C', new URL('.', root).pathname, 'ls-files', '*.md'], { encoding: 'utf8' })
        .trim()
        .split('\n');
    /** @type {string[]} */
    const refused = [];
    /** @type {Map<string, number>} */
    const counts = new Map();

    for (const file of files) {
        const text = read(file);
        for (const [what, pattern] of REFUSED) {
            for (const m of text.matchAll(pattern)) {
                const line = text.slice(0, m.index).split('\n').length;
                refused.push(`${file}:${line} carries ${what}: ${m[0].slice(0, 40)}`);
            }
        }
        for (const [what, pattern] of RATCHETED) {
            const found = [...text.matchAll(pattern)].length;
            if (found > 0) counts.set(what, (counts.get(what) ?? 0) + found);
        }
    }
    return { files: files.length, refused, counts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const { files, refused, counts } = scan();
    let failed = refused.length;
    for (const line of refused) console.error(line);

    for (const [what, , ceiling] of RATCHETED) {
        const found = counts.get(what) ?? 0;
        if (found > ceiling) {
            failed++;
            console.error(
                `${found} instance(s) of ${what}, and the recorded count is ${ceiling}. ` +
                    `These are already on the published branch and cannot be unpublished by deleting them here — ` +
                    `but a new one can still be not-added. Lower the ceiling when some go; never raise it.`,
            );
        }
    }
    if (failed > 0) process.exit(1);

    const held = [...RATCHETED].map(([what, , ceiling]) => `${counts.get(what) ?? 0}/${ceiling} ${what}`).join(', ');
    console.log(`Private in public: ${files} documents carry none of the ${REFUSED.length} refused shapes. Held at its count: ${held}.`);
}
