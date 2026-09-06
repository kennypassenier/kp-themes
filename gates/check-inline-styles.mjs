// Zero inline styles on the example pages [TH109, AR26].
//
// The round's exit criterion for the layout layer. The chassis kit wrote
// 28 style attributes and 71 lines of its own layout glue because the
// package did not carry the classes it needed; the ten example pages are
// the evidence that it now does. A page that reaches for `style=` is a
// page saying a class is missing.
//
// Two faults, reported separately:
//
//   inline-style  — a `style` attribute outside the exception list
//   page-style    — a page-local <style> block, which is the same fault
//                   wearing a bigger coat
//
// The exception list lives in showcase/examples.mjs beside the pages it
// is about, and it is about PROPERTIES rather than pages: "this page may
// have inline styles" stops being an exception the moment somebody adds a
// second one. Every entry carries a written reason, and an entry that no
// page uses any more is itself a failure — an exception list that
// outlives its problem is how an exception becomes permanent.
//
// The React channel needs no separate check: it renders the same `style`
// props from the same descriptors, so a style that is not in these files
// cannot be in that channel either.
//
// Drilled red once on each of its three shapes, 2026-09-06 (KT3):
//
//   inline-style    — `style: 'color: red'` put on the login page's <h1>
//                     in showcase/examples.mjs: "examples/login.html:34 —
//                     `color` written inline, and no exception covers it".
//   page-style      — a <style> block added to the page template in
//                     gates/generate-examples.mjs: eleven findings, one
//                     per page, each naming line 11.
//   stale-exception — `inset-inline-start` added to the app-shell entry:
//                     "app-shell no longer writes `inset-inline-start`
//                     inline — remove it from INLINE_STYLE_EXCEPTIONS".
//
// All three restored, and the gate green again over eleven pages.
//
// Usage: node gates/check-inline-styles.mjs

import { readFileSync, readdirSync } from 'node:fs';
import process from 'node:process';
import { EXAMPLES, INLINE_STYLE_EXCEPTIONS } from '../showcase/examples.mjs';

const DIR = new URL('../examples/', import.meta.url);

/** Every `style="…"` in a document, with the line it sits on. */
/**
 * @param {string} html
 * @returns {Array<{line: number, value: string}>}
 */
export function inlineStyles(html) {
    /** @type {Array<{line: number, value: string}>} */
    const found = [];
    for (const match of html.matchAll(/\sstyle\s*=\s*"([^"]*)"/g)) {
        found.push({ line: html.slice(0, match.index).split('\n').length, value: match[1] });
    }
    return found;
}

/** Every page-local `<style>` block, with the line it opens on. */
/**
 * @param {string} html
 * @returns {number[]}
 */
export function pageStyleBlocks(html) {
    /** @type {number[]} */
    const found = [];
    for (const match of html.matchAll(/<style[\s>]/gi)) {
        found.push(html.slice(0, match.index).split('\n').length);
    }
    return found;
}

/** The CSS properties a declaration list sets. */
/**
 * @param {string} value
 * @returns {string[]}
 */
export function properties(value) {
    return value
        .split(';')
        .map((declaration) => declaration.slice(0, declaration.indexOf(':')).trim())
        .filter((property) => property !== '');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    /** @type {string[]} */
    const failures = [];
    /** @type {Map<string, Set<string>>} */
    const used = new Map();

    // AR26: what this expects to check, from the descriptor list rather
    // than from the directory the generator wrote.
    const expected = [...EXAMPLES.map((example) => `${example.id}.html`), 'index.html'];
    const present = readdirSync(DIR);
    for (const file of expected) {
        if (!present.includes(file)) failures.push(`examples/${file} is missing — run \`npm run generate:examples\`.`);
    }

    for (const file of expected) {
        if (!present.includes(file)) continue;
        const page = file.replace(/\.html$/, '');
        const html = readFileSync(new URL(file, DIR), 'utf8');
        const allowed = new Set(INLINE_STYLE_EXCEPTIONS.filter((e) => e.page === page).flatMap((e) => e.properties));

        for (const line of pageStyleBlocks(html)) {
            failures.push(`[page-style] examples/${file}:${line} — a page-local <style> block. The classes belong in the package.`);
        }
        for (const style of inlineStyles(html)) {
            for (const property of properties(style.value)) {
                if (allowed.has(property)) {
                    if (!used.has(page)) used.set(page, new Set());
                    /** @type {Set<string>} */ (used.get(page)).add(property);
                    continue;
                }
                failures.push(`[inline-style] examples/${file}:${style.line} — \`${property}\` written inline, and no exception covers it.`);
            }
        }
    }

    // An exception nobody uses any more is a failure of its own.
    for (const exception of INLINE_STYLE_EXCEPTIONS) {
        for (const property of exception.properties) {
            if (!used.get(exception.page)?.has(property)) {
                failures.push(
                    `[stale-exception] ${exception.page} no longer writes \`${property}\` inline — remove it from INLINE_STYLE_EXCEPTIONS.`,
                );
            }
        }
        if (exception.why.trim().length < 40) {
            failures.push(`[stale-exception] the exception for ${exception.page} carries no real reason.`);
        }
    }

    if (failures.length > 0) {
        for (const failure of failures) console.error(failure);
        console.error(`\n${failures.length} inline-style violations over ${expected.length} example pages.`);
        process.exit(1);
    }
    const allowedCount = INLINE_STYLE_EXCEPTIONS.reduce((total, exception) => total + exception.properties.length, 0);
    console.log(
        `Inline styles: ${expected.length} example pages carry none, beyond ${allowedCount} excused properties on ${INLINE_STYLE_EXCEPTIONS.length} page(s).`,
    );
}
