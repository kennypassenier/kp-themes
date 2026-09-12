// A message a document quotes is the message the code prints [Phase 8].
//
// gates/check-docs-runnable.mjs checks that every command, path and import
// a document names is real. This checks the other half, and it is the half
// that actually went wrong: docs/TROUBLESHOOTING.md quoted four gate and
// console messages in shapes nothing prints — `expected 25, found 24`
// where the code says `expected N themes, found M [list]`, a flash message
// missing its `— SC 2.3.1 allows 3.` tail and naming a keyframe
// `fx-flicker` that does not exist, and twice "the twenty-five names"
// against a package that ships twenty-two. Every one of those was written
// by an assistant from memory, and every one of them would have sent a
// person searching for a string that is not there.
//
// The matching is against TEMPLATE LITERALS, not against fixed strings:
// the messages that matter are built with `${…}` holes, so a source
// fragment becomes a pattern and the quoted message has to fit it.
import { readFileSync, readdirSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);

/** The documents a person follows. A record may quote what was printed then. */
export const FOLLOWED = ['README.md', 'docs/USER_GUIDE.md', 'docs/TROUBLESHOOTING.md', 'docs/DEBUGGING_GUIDE.md', 'docs/OPERATIONS_RUNBOOK.md'];

/** Where a printed message can come from. */
const SOURCES = ['gates', 'js', 'components', 'hooks', 'fx', '.claude/hooks'];

/**
 * Does this backticked fragment look like something a program PRINTS,
 * rather than an identifier, a path or a snippet of code?
 *
 * Deliberately narrow: it must read as a sentence — several words, at
 * least one of them lowercase prose — so a class name, a CSS declaration
 * or a shell command never lands here.
 */
export function looksPrinted(/** @type {string} */ text) {
    if (text.length < 25 || !text.includes(' ')) return false;
    // A quote carrying a placeholder is not a verbatim claim: the document
    // is describing the SHAPE of a message, and `<file>:NN names …` is good
    // writing rather than a lie. Matching those turned out to need a
    // comparison subtle enough to be wrong quietly — the first two attempts
    // reported nineteen legitimate rows, and a gate that cries wolf is one
    // people learn to skip.
    //
    // So this checks the quotes that ARE verbatim claims, and those only.
    // It costs nothing, because every one of the four real faults this gate
    // was built for was verbatim: `theme discovery broke: expected 25,
    // found 24`, a flash message missing its tail and naming a keyframe
    // that does not exist, and twice "the twenty-five names" against a
    // package that ships twenty-two. A document that hedges with a
    // placeholder was never the problem.
    if (/<[^>]{1,20}>|\.\.\.|…|\bNN?\b|\b[XY]\b/.test(text)) return false;
    if (/^[$>#]|^npm |^npx |^node |^git |^sha256sum /.test(text)) return false; // a command
    if (/[{};[\]]|=>|:not\(|^\.|^--|^\//.test(text)) return false; // code, a selector, a flag, a path
    if (/^[A-Za-z-]+: [a-z-]+$/.test(text)) return false; // a CSS declaration
    return /\b(?:is|are|no|not|does|cannot|must|makes|expected|found|allows|carries|ships|has|will|be|the)\b/.test(text);
}

/**
 * Messages this package quotes but does not print. Each names the program
 * that does, because "some other tool says this" is a claim a reader can
 * check and an unattributed string is not.
 */
export const FOREIGN = [
    ['route.request is not a function', 'playwright, when page.route() is called with one argument'],
    ['You are not logged into any GitHub hosts', 'gh auth status'],
];

/**
 * Every file that can print something, as one flattened body of text.
 *
 * Not a list of extracted string literals: parsing JavaScript strings with
 * a regular expression is wrong in a way that hides. The first version did
 * that and quietly lost every message in a file containing an apostrophe —
 * `gates/compliance.mjs` prints a sentence this very gate then reported as
 * unprintable. Searching the source itself has no such failure mode.
 *
 * Backticks come out on both sides: a document cannot nest a backtick
 * inside a backticked span, so it writes `Run npm run generate` where the
 * source writes ``Run `npm run generate` ``, and that is the document
 * being well-formed rather than wrong.
 */
function corpus(/** @type {(f: string) => string} */ read) {
    const flatten = (/** @type {string} */ value) => value.replace(/`/g, '').replace(/\s+/g, ' ');
    let all = '';
    for (const dir of SOURCES) {
        for (const entry of readdirSync(new URL(`${dir}/`, root), { withFileTypes: true })) {
            if (!entry.isFile() || !/\.(mjs|js|jsx|sh)$/.test(entry.name)) continue;
            all += flatten(read(`${dir}/${entry.name}`)) + '\n';
        }
    }
    return all;
}

/** @param {(f: string) => string} [read] */
export function quotes(read = (f) => readFileSync(new URL(f, root), 'utf8')) {
    const source = corpus(read);
    const foreign = new Set(FOREIGN.map(([message]) => message));

    /** @type {string[]} */
    const wrong = [];
    let checked = 0;
    for (const file of FOLLOWED) {
        const text = read(file);
        for (const m of text.matchAll(/`([^`\n]+)`/g)) {
            if (!looksPrinted(m[1])) continue;
            checked++;
            const quoted = m[1].replace(/\s+/g, ' ').trim();
            if (source.includes(quoted) || foreign.has(quoted)) continue;
            wrong.push(`${file}:${text.slice(0, m.index).split('\n').length} quotes a message nothing prints: \`${m[1]}\``);
        }
    }
    return { checked, wrong };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const { checked, wrong } = quotes();
    for (const line of wrong) console.error(line);
    if (wrong.length > 0) {
        console.error(
            `\n${wrong.length} quoted message(s) the code does not print. Quote what it says, or say it in your own words without backticks.`,
        );
        process.exit(1);
    }
    if (checked === 0) {
        console.error('gate broke: no quoted message found in any followed document, which cannot be right.');
        process.exit(1);
    }
    console.log(
        `Doc quotes: ${checked} quoted message(s) across ${FOLLOWED.length} followed documents, every one of them a string the code really prints.`,
    );
}
