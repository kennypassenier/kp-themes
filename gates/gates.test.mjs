// Tests for the gates themselves [L1, AR8, TH22].
//
// Standing rule 8: a live-found fault becomes a failing test before the
// fix. AR8-D1 is the fault — theme discovery matched lowercase letters
// only, so a theme named `high-contrast` or `topo2` was silently skipped
// while the run reported every theme passing. The first three tests below
// were written against the broken version and failed.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { discoverThemesFromCss, EXPECTED_THEMES } from './check-contrast.mjs';
import { tokenNamesByTheme, findAsymmetry, knownAsymmetry } from './check-tokens.mjs';
import { animations, flashesPerSecond, parseOpacityKeyframes, unguardedMotion } from './check-motion.mjs';
import { checkSecondHalves, checkStateVisibility, themes } from './check-invariants.mjs';
import { leakedColours, documentRules } from './check-layers.mjs';
import { loosePhrases } from './check-strings.mjs';
import { subsequence } from '../js/listbox.js';
import { parseDate, toDutch, toISO } from '../js/datepicker.js';
import { datePattern, parseDate as parseLocaleDate, parseNumber, weekStartsOn } from '../js/locale.js';
import { contrast, hsl } from './colour.mjs';

/** @typedef {import('./check-invariants.mjs').Theme} Theme */

test('AR8-D1: theme discovery finds a name containing a hyphen', () => {
    const css = "[data-theme='high-contrast'] {\n    --background: hsl(0, 0%, 100%);\n}";
    assert.deepEqual(discoverThemesFromCss(css), ['high-contrast']);
});

test('AR8-D1: theme discovery finds a name containing a digit', () => {
    const css = "[data-theme='topo2'] {\n    --background: hsl(0, 0%, 50%);\n}";
    assert.deepEqual(discoverThemesFromCss(css), ['topo2']);
});

test('AR8: discovery of fewer themes than expected is an error, not a pass', () => {
    // The old guard only fired below five themes, so with seven present an
    // eighth going missing was invisible. The count is now exact.
    const css = "[data-theme='formal'] {\n    --background: hsl(40, 25%, 97%);\n}";
    assert.throws(() => discoverThemesFromCss(css, { expect: 7 }), /expected 7 themes, found 1/);
});

test('the declared themes are exactly the themes the stylesheet contains', () => {
    // This used to assert the number seven, which made adding an eighth
    // theme look like a regression. The name always promised the
    // property; now it checks it. A theme in order.json but not in the
    // stylesheet, or the reverse, is what this is for.
    const css = readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8');
    assert.deepEqual([...discoverThemesFromCss(css)].sort(), [...EXPECTED_THEMES].sort());
});

test('TH22: no token is asymmetric beyond the recorded exceptions', () => {
    // The ratchet, not the goal. Seven names are not yet declared by every
    // theme and are listed in themes/known-asymmetry.json; L3 empties that
    // file (TH20). Until then this test guards against a new one appearing.
    const unexpected = findAsymmetry(tokenNamesByTheme()).filter((a) => !knownAsymmetry().has(a.token));
    assert.deepEqual(
        unexpected,
        [],
        'new asymmetric tokens:\n' + unexpected.map((a) => `  --${a.token}: missing from ${a.missing.join(', ')}`).join('\n'),
    );
});

test('TH22: the ratchet refuses to list a token that is already symmetric', () => {
    // A list that outlives its problem is how an exception becomes permanent.
    const asymmetric = new Set(findAsymmetry(tokenNamesByTheme()).map((a) => a.token));
    const stale = [...knownAsymmetry()].filter((t) => !asymmetric.has(t));
    assert.deepEqual(stale, [], `known-asymmetry.json is stale for: ${stale.join(', ')}`);
});

test('TH22: the parity check notices a token removed from one theme', () => {
    const byTheme = new Map([
        ['formal', new Set(['background', 'primary'])],
        ['light', new Set(['background'])],
    ]);
    assert.deepEqual(findAsymmetry(byTheme), [{ token: 'primary', have: ['formal'], missing: ['light'] }]);
});

// DI5 is the one invariant here whose violation harms a person, so its
// arithmetic is pinned rather than trusted. The numbers below are the
// shipped fx-flicker before and after L3 retimed it.

test('DI5: a run that opposes direction faster than three times a second fails', () => {
    // The old fx-flicker: six opposing swings over 1100ms = 5.5/s.
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 3, opacity: 0.4 },
        { stop: 6, opacity: 1 },
        { stop: 20, opacity: 0.3 },
        { stop: 24, opacity: 1 },
        { stop: 70, opacity: 0.5 },
        { stop: 74, opacity: 1 },
    ];
    assert.ok(flashesPerSecond(stops, 1100) > 3, 'the pre-L3 flicker must not pass');
});

test('DI5: a swing under ten percent is not a flash', () => {
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 50, opacity: 0.94 },
        { stop: 100, opacity: 1 },
    ];
    assert.equal(flashesPerSecond(stops, 100), 0);
});

test('DI5: the shipped flicker stays under the threshold', () => {
    const css = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    const stops = parseOpacityKeyframes(css).get('fx-flicker');
    assert.ok(stops, 'fx-flicker keyframes must be readable');
    assert.ok(flashesPerSecond(stops, 2200) <= 3);
});

test('DI7: a transition inside a no-preference guard is not reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n';
    assert.deepEqual(unguardedMotion(css), []);
});

test('DI7: a transition after a guard block has closed is reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n.b {\n  transition: color 1s;\n}\n';
    assert.equal(unguardedMotion(css).length, 1);
});

// KT2, after the fix. These two tests were written to assert the fault
// while it stood, exactly so that repairing it would break them and force
// this rewrite. That is what happened; what follows asserts the repair.

test('KT2: every theme has a pressed state you can see', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkStateVisibility(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});

test('KT2: the two themes that could not reach it on lightness now do', () => {
    // The whole point of letting the pressed state give up chroma. Before
    // the fix these two produced nine violations between them.
    const opted = themes().filter(/** @param {Theme} t */ (t) => ['cyberpunk', 'terminal'].includes(t.name));
    assert.equal(opted.length, 2);
    for (const theme of opted) assert.deepEqual(checkStateVisibility(theme), []);
});

test('KT2-3: a badge plate stays distinguishable from the surface under it', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkSecondHalves(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});

test('DI9: a colour written outside the token layer is caught', () => {
    // The gate has to fail on the shape it exists for, not only pass on a
    // tidy file. This is cyberpunk's --primary, spelled out the way the
    // scrollbar used to spell it.
    assert.equal(leakedColours('.a { border-color: hsl(315, 95%, 64%); }').length, 1);
    assert.deepEqual(leakedColours('.a { border-color: hsl(from var(--primary) h s l / 0.5); }'), []);
    // A data URI carries its own little document; its fills are shapes.
    assert.deepEqual(leakedColours(`.a { background: url("data:image/svg+xml,%3Csvg fill='%23335544'%3E%3C/svg%3E"); }`), []);
});

// KT3: the fault was a browser test that measured the showcase's own
// stylesheet instead of the package, because that stylesheet styled a
// bare `body`. These are the drills for the rule that now forbids it.
test('KT3: scaffolding that styles a bare element is caught', () => {
    // The exact rule that was in showcase.css when the TH12 test could
    // not fail.
    const before = 'body {\n    margin: 0;\n    font-family: var(--theme-font-body, system-ui, sans-serif);\n    line-height: 1.5;\n}';
    assert.equal(documentRules(before).length, 1);
    assert.equal(documentRules(before)[0].selector, 'body');

    // Furniture the package leaves alone stays allowed.
    assert.deepEqual(documentRules('body {\n    margin: 0;\n    line-height: 1.5;\n}'), []);
});

test('KT3: a rule anchored on a class is not a document rule', () => {
    assert.deepEqual(documentRules('.sc-theme {\n    font-family: var(--theme-font-body);\n}'), []);
    assert.deepEqual(documentRules('.sc-theme a:hover {\n    color: var(--link);\n}'), []);
    // …but the same declaration on a bare element is.
    assert.equal(documentRules('a:hover {\n    color: var(--link);\n}').length, 1);
});

test('KT3: prose in a comment is not read as a selector', () => {
    // The first version of this parser reported five violations in one
    // comment, because the sentence mentioned `body` and had commas.
    const source =
        '/* Without this line the font came from `body`, which\n * resolves against the document theme. */\n.sc-theme {\n    font-family: var(--theme-font-body);\n}';
    assert.deepEqual(documentRules(source), []);
});

test('KT3: the reported line is the selector, not the comment above it', () => {
    const source = '/* three\n * line\n * comment */\nbody {\n    color: red;\n}';
    assert.equal(documentRules(source)[0].line, 4);
});

test('a computed animation duration is read, not skipped', () => {
    // Three animations with calc() durations shipped invisible to this
    // gate for the length of one commit, because the parser matched a
    // literal number only. The gate now reports a duration it cannot
    // read, and the runner measures the worst case.
    const [anim] = animations('.x { animation: kp-drill calc(var(--fx-duration) * 3) linear infinite; }');
    assert.equal(anim.name, 'kp-drill');
    assert.equal(anim.durationMs, null);
    assert.match(anim.duration, /calc/);

    const literal = animations('.x { animation: fx-flicker 2.2s steps(3) infinite; }');
    assert.equal(literal[0].durationMs, 2200);
});

test('HA1: every colour a Home Assistant theme uses as ink is readable on its card', () => {
    // The mapping is not one-to-one and cannot be. Home Assistant uses
    // warning/success/info as ink; ours are plate-and-ink pairs, and
    // which half is the ink depends on the theme — pale plate with dark
    // ink in six, saturated plate with white ink in high-contrast.
    // Taking the foreground blindly put white on a white card there, at
    // 1.0, which is what this test exists to keep from coming back.
    for (const theme of themes()) {
        const yaml = readFileSync(new URL(`../ha/kp-${theme.name}.yaml`, import.meta.url), 'utf8');
        const card = hsl(theme.tokens.card);
        for (const key of ['accent-color', 'error-color', 'warning-color', 'success-color', 'info-color']) {
            const value = yaml.match(new RegExp(`${key}: "([^"]+)"`))?.[1];
            assert.ok(value, `${theme.name}: ${key} missing from the generated theme`);
            const ratio = contrast(hsl(value), card);
            assert.ok(ratio >= 3, `${theme.name}: ${key} is ${ratio.toFixed(2)} on the card, under 3`);
        }
    }
});

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

test("TH86: mono's seven status plates are a lightness ladder, apart with hue removed", () => {
    // Mono carries meaning by lightness, so every pair of plates must
    // differ by at least 1.25:1 in luminance — the gap the eye reads as
    // "a different grey" at badge size. Hue removed is the theme's own
    // condition; there is none to remove. Drill: set two plates to the
    // same value and the pair reads 1.00.
    /** @type {{entries: Array<{token?: string, value?: string}>}} */
    const source = JSON.parse(readFileSync(new URL('../themes/mono/tokens.json', import.meta.url), 'utf8'));
    const plates = ['draft', 'sent', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'].map((name) => {
        const entry = source.entries.find((e) => e.token === `status-${name}`);
        assert.ok(entry, `status-${name}`);
        return { name, rgb: hsl(entry.value ?? '') };
    });
    for (let i = 0; i < plates.length; i++) {
        for (let j = i + 1; j < plates.length; j++) {
            const ratio = contrast(plates[i].rgb, plates[j].rgb);
            assert.ok(ratio >= 1.25, `${plates[i].name} and ${plates[j].name} are ${ratio.toFixed(2)} apart, under 1.25`);
        }
    }
});

test('KT7: every check script runs in the gates chain, in the hook, and CI runs the chain', () => {
    // Two lists that promise the same thing and nothing that lays them
    // side by side: the hook script omitted check:strings and CI ran the
    // hook script, so a red gate shipped inside a green build. This test
    // is the side-by-side. Drill: remove one `node gates/check-…` line
    // from .claude/hooks/gates.sh and the hook assertion names it.
    /** @type {{scripts: Record<string, string>}} */
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const checks = Object.keys(pkg.scripts).filter((name) => name.startsWith('check:'));
    assert.ok(checks.length >= 10, `expected the check scripts, found ${checks.length}`);
    const chain = pkg.scripts.gates;
    const hook = readFileSync(new URL('../.claude/hooks/gates.sh', import.meta.url), 'utf8');
    const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
    for (const name of checks) {
        assert.ok(chain.includes(`npm run ${name}`), `\`${name}\` is not in \`npm run gates\``);
        // The hook runs the same file the script does; match on the
        // command the script names, which is what the hook copies.
        const command = pkg.scripts[name].replace(/^node /, '');
        assert.ok(hook.includes(command), `\`${name}\` (${command}) is not in .claude/hooks/gates.sh`);
    }
    assert.ok(/run:\s*npm run gates/.test(ci), 'ci.yml does not run `npm run gates`');
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
