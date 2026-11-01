// No user-visible string outside the dictionary [KT5].
//
// The same shape as the layer gate, and for the same reason. That one
// refuses a colour written outside the token layer; this one refuses a
// sentence written outside `js/strings.js`. Both exist because a value
// duplicated in two places drifts, and because a consumer cannot reach
// what is not routed through one door.
//
// **What the fault actually is.** Not "Dutch strings" — a hardcoded
// English one is the same defect, and translating everything would leave
// it intact wearing a different word. The fault is a user-visible string
// with no way in from outside, which is how JobTracker ended up able to
// adopt only the components that carry no text at all.
//
// The screen-reader-only announcements are the half that matters most,
// because they fail silently and only for the people who cannot see that
// they failed. They are not a special case here: they are strings, they
// go through the dictionary, and this gate does not know the difference.
//
// Usage: node gates/check-strings.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { DEFAULT_STRINGS } from '../js/strings.js';
import { JSX_LITERAL, NOT_CHECKED, NOT_TEXT_ATTR, NOT_TEXT_CALL, SINKS, WATCHED, readsLikeText } from './strings-rules.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));


/**
 * JSX text between tags: `<span>Something</span>`.
 *
 * Only when it is prose rather than an expression, and only with a letter
 * in it — `<span>{value}</span>` and `<td>—</td>` are not text anyone
 * translates.
 */
const JSX_TEXT = /^\s*([A-ZÀ-Ý][^<>{}\n]{2,})$/gm;

/** @param {string} dir @returns {string[]} */
function sources(dir) {
    /** @type {string[]} */
    const out = [];
    for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
        const rel = `${dir}/${entry.name}`;
        if (entry.isDirectory()) out.push(...sources(rel));
        else if (/\.(js|jsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) out.push(rel);
    }
    return out;
}

/**
 * @param {string} source
 * @returns {{line: number, text: string}[]}
 */
export function loosePhrases(source, { jsx = true } = {}) {
    // Comments are prose by definition and are not shipped to a user.
    const masked = source
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
    /** @type {{line: number, text: string}[]} */
    const found = [];
    /** @param {number} index @returns {number} */
    const lineOf = (index) => masked.slice(0, index).split('\n').length;

    for (const sink of SINKS) {
        for (const match of masked.matchAll(sink)) {
            const text = match[2] ?? '';
            // An expression is not a literal string: `${s.copy}` reaches
            // the dictionary and is the shape this gate wants to see.
            // What is left once the expressions are removed is the part a
            // person reads; no letters there means the whole string is
            // built from values that already came through the dictionary.
            const literal = text.replace(/\$\{[^}]*\}/g, ' ');
            if (!/[A-Za-zÀ-ÿ]{3}/.test(literal)) continue;
            found.push({ line: lineOf(match.index ?? 0), text });
        }
    }
    if (jsx) {
        for (const match of masked.matchAll(JSX_LITERAL)) {
            const text = match[2] ?? '';
            if (text.length < 2 || !readsLikeText(text)) continue;
            const before = masked.slice(Math.max(0, (match.index ?? 0) - 60), match.index);
            if (NOT_TEXT_ATTR.test(before) || NOT_TEXT_CALL.test(before)) continue;
            found.push({ line: lineOf(match.index ?? 0), text });
        }
    }

    // JSX text only in files that contain JSX: in a plain module the
    // pattern matches the middle lines of a multi-line import.
    if (jsx)
        for (const match of masked.matchAll(JSX_TEXT)) {
            const text = (match[1] ?? '').trim();
            if (text === '' || /^[A-Z][\w.]*\(/.test(text)) continue;
            // `ArrowRight: new Date(...)`, `Home: y + 1,` — a line of an
            // object literal whose key is capitalised. JSX text that reads
            // "Note: something" keeps a word after the colon, not code [KT7].
            if (/^[A-Za-z_$][\w$]*\s*:\s*(?:new\s|[\w$.]+\(|[\w$.]+\s*[-+*/?]|[\d-]|['"`[{]|true|false|null|undefined)/.test(text)) continue;
            found.push({ line: lineOf(match.index ?? 0), text });
        }
    // A JSX attribute matches both the sink list and the literal pass.
    // One string, one finding: a report that says the same thing twice
    // reads like two faults and inflates the count at the bottom.
    const seen = new Set();
    return found.filter(({ line, text }) => {
        const key = `${line}:${text}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;
    const known = new Set(
        Object.values(DEFAULT_STRINGS)
            .flatMap((value) => (Array.isArray(value) ? value : [value]))
            .filter((value) => typeof value === 'string'),
    );

    for (const dir of WATCHED) {
        for (const file of sources(dir)) {
            if (NOT_CHECKED.some((entry) => (entry.endsWith('/') ? file.startsWith(entry) : file === entry))) continue;
            checked++;
            for (const phrase of loosePhrases(readFileSync(join(ROOT, file), 'utf8'), { jsx: file.endsWith('.jsx') })) {
                if (known.has(phrase.text)) {
                    // A default that a component repeats rather than reads.
                    // Still wrong: the consumer's override would not reach it.
                    failed++;
                    console.error(
                        `${file}:${phrase.line}: "${phrase.text}" is a dictionary value written out again — read it from the strings instead.`,
                    );
                    continue;
                }
                failed++;
                console.error(
                    `${file}:${phrase.line}: "${phrase.text}" is user-visible text outside the dictionary (KT5). Add a key to js/strings.js and read it from there.`,
                );
            }
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} string(s) a consumer cannot replace.`);
        process.exit(1);
    }
    console.log(`Strings: ${checked} source files speak only through the dictionary (${known.size} defaults).`);
}
