// Tests for the pure logic the gates lean on: listbox matching, dates and locale, strings, versions [TH40, TH43, KT5, D5, TH97].

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsequence } from '../js/listbox.js';
import { parseDate, toISO, toDutch } from '../js/datepicker.js';
import { loosePhrases } from './check-strings.mjs';
import { parseDate as parseLocaleDate, parseNumber, weekStartsOn, datePattern } from '../js/locale.js';
import { diagnose, compareVersions } from '../js/diagnostics.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

// TH39/TH40: the subsequence match a command palette uses. Tested here
// rather than in a browser because it is arithmetic, not behaviour.
test('TH40: a subsequence match finds letters in order, not substrings', () => {
    assert.equal(subsequence('Thema wisselen', 'thm'), true);
    assert.equal(subsequence('Thema wisselen', 'wis'), true);
    assert.equal(subsequence('Thema wisselen', 'zzz'), false);
    // Order matters: the letters are all there, in the wrong sequence.
    assert.equal(subsequence('Thema', 'amet'), false);
    // An empty query matches everything, so a palette shows its full list
    // before anyone types.
    assert.equal(subsequence('Thema', ''), true);
    assert.equal(subsequence('THEMA', 'thema'), true);
});

// TH43: date parsing. Arithmetic, so it belongs here rather than in a
// browser — and it is the half of a date field that decides whether
// somebody's "31-02-2026" becomes an error or silently becomes 3 March.
test('TH43: a date field reads what people actually type', () => {
    /** Parse and format, refusing null loudly — the checker is right that
     * parseDate can return one, and a test that casts the answer away
     * would stop noticing when it starts doing so.
     * @param {string} text */
    const iso = (text) => {
        // Explicit since 3.0.0: the default is the page's locale [D5].
        const date = parseDate(text, 'nl-NL');
        assert.notEqual(date, null, `${text} should parse`);
        return toISO(/** @type {Date} */ (date));
    };
    assert.equal(iso('4-9-2026'), '2026-09-04');
    assert.equal(iso('04-09-2026'), '2026-09-04');
    assert.equal(iso('2026-09-04'), '2026-09-04');
    assert.equal(iso('04/09/2026'), '2026-09-04');
    assert.equal(toDutch(/** @type {Date} */ (parseDate('2026-09-04', 'nl-NL'))), '04-09-2026');
});

test('TH43: an impossible date is refused, not rounded', () => {
    // Without the round-trip check this parses as 3 March: a silent wrong
    // answer, which is worse than an error.
    assert.equal(parseDate('31-02-2026', 'nl-NL'), null);
    assert.equal(parseDate('32-01-2026', 'nl-NL'), null);
    assert.equal(parseDate('04-13-2026', 'nl-NL'), null);
    assert.equal(parseDate('vandaag', 'nl-NL'), null);
    assert.equal(parseDate('', 'nl-NL'), null);
});

// KT5: the string gate. Every one of these was drilled against the real
// source first — the assertions below are the drills frozen, so that a
// later widening of the exemptions cannot quietly reopen the hole.
test('KT5: a literal that reaches a person is caught in both channels', () => {
    // textContent, the framework-free half.
    assert.equal(loosePhrases("status.textContent = 'Some rows';", { jsx: false }).length, 1);
    // setAttribute, the half that carries the screen-reader text.
    assert.equal(loosePhrases("el.setAttribute('aria-label', 'Remove this tag');", { jsx: false }).length, 1);
    // A JSX attribute.
    assert.equal(loosePhrases('<button aria-label="Select all" />').length, 1);
    // An expression rather than a node or an attribute: the sr-only
    // announcement, which is the shape KT5 was written about.
    assert.equal(loosePhrases('<span>{copied ? `${value} copied` : null}</span>').length, 1);
    // A text node.
    assert.equal(loosePhrases('<p>\n    No results found\n</p>').length, 1);
});

test('KT5: a value read from the dictionary is not a finding', () => {
    assert.deepEqual(loosePhrases('status.textContent = s.tableRows(total);', { jsx: false }), []);
    assert.deepEqual(loosePhrases('<button aria-label={words.tableSelectAll} />'), []);
    assert.deepEqual(loosePhrases('<span>{copied ? s.copiedAnnouncement(value) : null}</span>'), []);
});

test('KT5: API values and CSS are not text', () => {
    // Renaming these translates nothing and breaks the keyboard.
    assert.deepEqual(loosePhrases("if (event.key === 'ArrowDown') return;"), []);
});

test('KT7: the strings gate does not flag code that only looks like text', () => {
    // Three shapes found on 2026-09-05, all in files nothing had run the
    // gate over since they were written. A CSS selector handed to
    // closest()/querySelector() is not text; a line of an object literal
    // that starts with a capitalised key is not a JSX text node; and a
    // one-character literal must not desynchronise the literal scanner
    // so that the code BETWEEN two literals is reported as a string.
    assert.deepEqual(loosePhrases("if (target.closest('button, a, input, select, textarea')) return;"), []);
    assert.deepEqual(loosePhrases('const moves = {\n    ArrowRight: new Date(y, m, d + 1),\n    Home: new Date(y, m, d - offset),\n};'), []);
    assert.deepEqual(loosePhrases("const sign = { added: signs.added ?? '+', removed: signs.removed ?? '-', same: signs.same ?? ' ' };"), []);
    // And the real thing beside them still counts.
    assert.equal(loosePhrases("if (x) el.setAttribute('aria-label', 'Remove this tag'); const s = { Note: 'Something to read' };").length, 2);
    assert.deepEqual(loosePhrases("el.style.display = 'contents';"), []);
    // A canvas font shorthand is CSS with a space in it, not a phrase.
    assert.deepEqual(loosePhrases('ctx.font = `${size}px monospace`;'), []);
    // A hole followed by a unit is a measurement, not something to read.
    assert.deepEqual(loosePhrases('<span>{`${bytes} kB`}</span>').length, 0);
});

// D5: the locale is the browser's unless the consumer says otherwise.
// These pin what Intl gives, because the whole point of reading it is
// that a Dutch page and an American page get different answers from the
// same code — and that "31-02-2026" is refused in both.
test("D5: a date is read in the locale's own order", () => {
    assert.equal(toISO(/** @type {Date} */ (parseLocaleDate('04-09-2026', 'nl-NL'))), '2026-09-04');
    assert.equal(toISO(/** @type {Date} */ (parseLocaleDate('09/04/2026', 'en-US'))), '2026-09-04');
    assert.equal(toISO(/** @type {Date} */ (parseLocaleDate('2026-09-04', 'en-US'))), '2026-09-04');
    // Impossible in every locale.
    assert.equal(parseLocaleDate('31-02-2026', 'nl-NL'), null);
    assert.equal(parseLocaleDate('02/31/2026', 'en-US'), null);
});

test("D5: a number is read with the locale's decimal", () => {
    assert.equal(parseNumber('1.284,50', 'nl-NL'), 1284.5);
    assert.equal(parseNumber('1,284.50', 'en-US'), 1284.5);
    assert.equal(parseNumber('1 284,50', 'fr-FR'), 1284.5);
});

test('D5: the week starts where the locale says, and the consumer can overrule it', () => {
    // Monday for the Netherlands, Sunday for the United States — where
    // the runtime knows; Monday where it does not.
    const nl = weekStartsOn('nl-NL');
    const us = weekStartsOn('en-US');
    assert.ok(nl === 1);
    assert.ok(us === 0 || us === 1);
    assert.equal(weekStartsOn('en-US', 6), 6);
});

test('D5: the date hint follows the locale, so it cannot lie about the format', () => {
    assert.equal(datePattern('nl-NL').parts.join(','), 'day,month,year');
    assert.equal(datePattern('en-US').parts.join(','), 'month,day,year');
    assert.match(datePattern('en-US').hint, /^mm.dd.yyyy$/);
});

// TH97: the verdict, measured on pairs that are wrong on purpose. The
// browser test reads the same judgement off the real page; this one is
// the cheap half, and it can build pairs the browser cannot.
test('TH97: a stylesheet older than the JavaScript is named as the one behind', () => {
    const report = diagnose({ version: '1.2.0', themes: ['formal', 'light'] }, { version: '3.2.0', themes: ['formal', 'light', 'mono'] });
    assert.equal(report.status, 'stylesheet-behind');
    assert.deepEqual(report.onlyInScript, ['mono']);
    assert.deepEqual(report.onlyInStylesheet, []);
    assert.ok(report.verdict.includes('1.2.0') && report.verdict.includes('3.2.0'));
});

test('TH97: a JavaScript older than the stylesheet is named as the one behind', () => {
    const report = diagnose({ version: '3.2.0', themes: ['formal', 'mono'] }, { version: '1.2.0', themes: ['formal'] });
    assert.equal(report.status, 'script-behind');
    assert.deepEqual(report.onlyInStylesheet, ['mono']);
});

test('TH97: the same version with different themes is a hand-edited file', () => {
    const report = diagnose({ version: '3.2.0', themes: ['formal'] }, { version: '3.2.0', themes: ['formal', 'mono'] });
    assert.equal(report.status, 'themes-differ');
    assert.ok(report.verdict.includes('3.2.0'));
});

test('TH97: a stylesheet that declares no version is older than any that can ask', () => {
    const report = diagnose({ version: null, themes: [] }, { version: '3.2.0', themes: ['formal'] });
    assert.equal(report.status, 'no-version');
    assert.equal(report.verdict, DEFAULT_STRINGS.diagnosticsNoVersion);
});

test('TH97: a matching pair is a match, and 3.10.0 is newer than 3.9.0', () => {
    assert.equal(diagnose({ version: '3.2.0', themes: ['formal'] }, { version: '3.2.0', themes: ['formal'] }).status, 'match');
    // String comparison says the opposite, which is the whole reason this
    // is a function and not a `<`.
    assert.ok((compareVersions('3.10.0', '3.9.0') ?? 0) > 0);
    assert.equal(compareVersions('3.2.0', '3.2'), 0);
    assert.equal(compareVersions('3.2.0', 'nightly'), null);
    // A pre-release sorts below its release and above the one before [C6].
    assert.ok((compareVersions('5.0.0-alpha.1', '4.0.0') ?? 0) > 0);
    assert.ok((compareVersions('5.0.0-alpha.1', '5.0.0') ?? 0) < 0);
    assert.ok((compareVersions('5.0.0-alpha.2', '5.0.0-alpha.1') ?? 0) > 0);
    assert.ok((compareVersions('5.0.0-beta.1', '5.0.0-alpha.9') ?? 0) > 0);
    assert.equal(compareVersions('5.0.0-alpha.1', '5.0.0-alpha.1'), 0);
});
