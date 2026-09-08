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
import { existsSync, readFileSync } from 'node:fs';
import { STYLESHEET_ROLES, stylesheets } from './stylesheets.mjs';
import { execFileSync } from 'node:child_process';
import { discoverThemesFromCss, EXPECTED_THEMES, STATUS_NAMES } from './check-contrast.mjs';
import { tokenNamesByTheme, findAsymmetry, knownAsymmetry } from './check-tokens.mjs';
import { animations, flashesPerSecond, parseOpacityKeyframes, unguardedMotion } from './check-motion.mjs';
import { checkSecondHalves, checkStateVisibility, themes } from './check-invariants.mjs';
import { leakedColours, documentRules } from './check-layers.mjs';
import { loosePhrases } from './check-strings.mjs';
import { copyableExports } from './check-manifest.mjs';
import { VENDORED, closure, specifiers } from './check-closure.mjs';
import { drawn, establishers, queried, REQUIRED } from './check-wrappers.mjs';
import { FILES } from './checksums.mjs';
import { compareVersions, diagnose } from '../js/diagnostics.js';
import { nameRecords } from './woff2-names.mjs';
import { DEFAULT_STRINGS } from '../js/strings.js';
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

// TH131: the test reads the register's real keyframes rather than pinning
// one by name — `fx-flicker` left with the 4.x register at C2, and a test
// that named it would have gone red on the absence rather than on a flash.
// Every opacity keyframe the register animates is rated with its own
// duration and iteration count.
test('DI5: every opacity keyframe the cyberpunk register animates stays under the threshold [TH131]', () => {
    const css = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    const keyframes = parseOpacityKeyframes(css);
    const rated = [];
    for (const anim of animations(css)) {
        const stops = keyframes.get(anim.name);
        if (!stops) continue;
        assert.ok(anim.durationMs !== null, `${anim.name}: a literal duration, so the rate can be computed`);
        rated.push(`${anim.name}: ${flashesPerSecond(stops, anim.durationMs, anim.cycles).toFixed(2)}/s`);
        assert.ok(flashesPerSecond(stops, anim.durationMs, anim.cycles) <= 3, `${anim.name} exceeds three opposing changes per second`);
    }
    assert.ok(rated.length >= 3, `only ${rated.length} opacity animations rated — the register ships more than that`);
});

// Drill [TH131]: a 5/s loop turns the same reading red.
test('DI5: an injected five-per-second loop is refused by the same reading [TH131]', () => {
    const css =
        '@keyframes bad { 0% { opacity: 1; } 10% { opacity: 0; } 20% { opacity: 1; } 30% { opacity: 0; } 40% { opacity: 1; } 50% { opacity: 0; } 60% { opacity: 1; } 70% { opacity: 0; } 80% { opacity: 1; } 90% { opacity: 0; } 100% { opacity: 1; } }\n' +
        '.x { animation: bad 2s linear infinite; }\n';
    const stops = parseOpacityKeyframes(css).get('bad');
    const [anim] = animations(css);
    assert.ok(stops && anim);
    assert.ok(flashesPerSecond(stops, anim.durationMs ?? 0, anim.cycles) > 3, 'five opposing changes per second must read over the threshold');
    // And the same burst once, over two seconds, is rated over the two
    // seconds it occupies — still over three, because it really is.
    assert.ok(flashesPerSecond(stops, 2000, 1) > 3);
    // A single fade once in 320ms is one change in the second it occupies.
    assert.equal(
        flashesPerSecond(
            [
                { stop: 0, opacity: 1 },
                { stop: 100, opacity: 0 },
            ],
            320,
            1,
        ),
        1,
    );
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

test('D3 and D4: two removals stay removed', () => {
    // The registry-coverage item of round five's AFK report, answered
    // "Dichten" by Kenny on 2026-09-07. Both removals were shipped and
    // neither was pinned: re-adding either export would have broken no
    // gate at all. Finding that also found the worse half -- D3 and D4
    // had shared one number, W1 was briefed with the wrong meaning, and
    // the frozen D3 went unbuilt until this same turn.
    const read = (/** @type {string} */ file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    for (const file of ['index.js', 'index.d.ts', 'js/strings.js', 'js/strings.d.ts']) {
        assert.ok(!/\bexport\b[^\n]*\bSTRINGS_NL\b/.test(read(file)), `${file} still exports STRINGS_NL [D3]`);
    }
    for (const file of ['index.js', 'index.d.ts', 'js/components.js', 'js/components.d.ts']) {
        const source = read(file);
        assert.ok(!/\bexport\b[^\n]*\bARM_EVENT\b/.test(source), `${file} still exports ARM_EVENT [D4]`);
        assert.ok(!/\bexport\b[^\n]*\bDISARM_EVENT\b/.test(source), `${file} still exports DISARM_EVENT [D4]`);
    }
});

test('AR28: the vendored modules import nothing outside themselves', () => {
    // The gate's own subject, as a unit: the six files chassis-rs bakes
    // in are closed under import. Drilled red twice against the real
    // source before it was trusted — the comments in check-closure.mjs
    // name both injected edges.
    const read = (/** @type {string} */ file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const { reached, missing } = closure(VENDORED, read);
    assert.deepEqual(missing, []);
    assert.deepEqual(
        [...reached.keys()].filter((file) => !VENDORED.includes(file)),
        [],
    );
    assert.equal(VENDORED.length, 6);
});

test('AR28: the closure walk reads an import it must not miss', () => {
    // A gate that finds nothing passes everything. These are the shapes
    // the six actually use, plus the two that would slip past a naive
    // scan: a multi-line import and a dynamic one.
    assert.deepEqual(specifiers("import { a } from './b.js';"), ['./b.js']);
    assert.deepEqual(specifiers("import {\n    a,\n    b,\n} from './c.js';"), ['./c.js']);
    assert.deepEqual(specifiers("export { a } from './d.js';"), ['./d.js']);
    assert.deepEqual(specifiers("const m = await import('./e.js');"), ['./e.js']);
    // A comment is not an import, and neither is a string that looks like one.
    assert.deepEqual(specifiers("// import { a } from './f.js';"), []);
});

test('TH104: the wrapper check answers by ancestry, not by proximity', () => {
    // The whole point of the gate is depth: a container query binds to the
    // NEAREST container at ANY depth, so a wrapper three elements up is a
    // correct wrapper and a sibling one is not.
    const wrappers = new Map([['kp-grid', ['kp-grid-wrap']]]);
    const deep = '<div class="kp-grid-wrap"><main><section><div class="kp-grid"></div></section></main></div>';
    assert.deepEqual(
        drawn(deep, REQUIRED, wrappers).map((f) => f.wrapped),
        [true],
    );
    const sibling = '<div class="kp-grid-wrap"></div><div class="kp-grid"></div>';
    assert.deepEqual(
        drawn(sibling, REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // The element itself is not its own container: that is AR24 in one line.
    assert.deepEqual(
        drawn('<div class="kp-grid kp-grid-wrap"></div>', REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // A void element in between must not unbalance the stack, or every
    // later element would look wrapped when it is not.
    const afterVoid = '<div class="kp-grid-wrap"><img src="a.png" /></div><div class="kp-grid"></div>';
    assert.deepEqual(
        drawn(afterVoid, REQUIRED, wrappers).map((f) => f.wrapped),
        [false],
    );
    // An opt-in table needs the attribute; a plain one asks for nothing.
    const tables = new Map([['kp-table', ['kp-table-wrap', 'kp-datatable']]]);
    assert.equal(drawn('<table class="kp-table"></table>', REQUIRED, tables).length, 0);
    assert.deepEqual(
        drawn('<table class="kp-table" data-kp-cards></table>', REQUIRED, tables).map((f) => f.wrapped),
        [false],
    );
});

test('TH104: the container names and their wrappers are read from the stylesheet', () => {
    // AR26: the gate's expectation comes from the source. A conversion
    // that arrives without an entry in REQUIRED is caught by this pair
    // disagreeing, so the list cannot silently fall behind.
    const css = readFileSync(new URL('../css/components.css', import.meta.url), 'utf8');
    const names = queried(css);
    const wrappers = establishers(css);
    for (const entry of REQUIRED) {
        assert.ok(names.has(entry.container), `nothing queries @container ${entry.container}`);
        assert.ok((wrappers.get(entry.container) ?? []).length > 0, `nothing establishes a container named ${entry.container}`);
    }
    assert.deepEqual([...names].sort(), REQUIRED.map((e) => e.container).sort());
    // Both classes that can carry the table's container are found, which
    // is what lets a DataTable without a .kp-table-wrap still pass.
    assert.deepEqual(wrappers.get('kp-table'), ['kp-table-wrap', 'kp-datatable']);
});

test('KT7: every check script runs in the gates chain, in the hook, and CI runs the chain', () => {
    // Two lists that promise the same thing and nothing that lays them
    // side by side: the hook script omitted check:strings and CI ran the
    // hook script, so a red gate shipped inside a green build. This test
    // is the side-by-side, over all three lists. Drill: remove one `node gates/check-…` line
    // from .claude/hooks/gates.sh and the hook assertion names it.
    /** @type {{scripts: Record<string, string>}} */
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const checks = Object.keys(pkg.scripts).filter((name) => name.startsWith('check:'));
    assert.ok(checks.length >= 10, `expected the check scripts, found ${checks.length}`);
    const chain = pkg.scripts.gates;
    const hook = readFileSync(new URL('../.claude/hooks/gates.sh', import.meta.url), 'utf8');
    const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
    const release = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8');
    for (const name of checks) {
        assert.ok(chain.includes(`npm run ${name}`), `\`${name}\` is not in \`npm run gates\``);
        // The hook runs the same file the script does; match on the
        // command the script names, which is what the hook copies.
        const command = pkg.scripts[name].replace(/^node /, '');
        assert.ok(hook.includes(command), `\`${name}\` (${command}) is not in .claude/hooks/gates.sh`);
    }
    assert.ok(/run:\s*npm run gates/.test(ci), 'ci.yml does not run `npm run gates`');
    // The third list, added at round five's Phase 5 gate (H2). It builds
    // the tag, and until then nothing held it: it ran the hook script,
    // which is equivalent only for as long as nobody changes either.
    assert.ok(/run:\s*npm run gates/.test(release), 'release.yml does not run `npm run gates`');
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

// TH103: the manifest holds what the package offers, and the gate that
// says so reads `exports` rather than the directory (AR26).
test('TH103: a copyable export that is missing from the manifest is a difference', () => {
    const pkg = {
        exports: {
            './css': './css/themes.css',
            './js/strings': { types: './js/strings.d.ts', default: './js/strings.js' },
        },
    };
    assert.deepEqual(copyableExports(pkg), ['css/themes.css', 'js/strings.js']);
});

test('TH103: patterns, declarations and the React channel are not vendored files', () => {
    const pkg = {
        exports: {
            // A pattern names a directory, and reading a directory is the
            // globbing AR26 forbids for this number.
            './components/*': './components/*',
            './themes/*': './themes/*',
            // npm ships and verifies these; a person does not copy them.
            '.': { types: './index.d.ts', default: './index.js' },
            './hooks/theme': { types: './hooks/use-theme.d.ts', default: './hooks/use-theme.js' },
            './fx/boot-sequence': { types: './fx/boot-sequence.d.ts', default: './fx/boot-sequence.jsx' },
            './package.json': './package.json',
        },
    };
    assert.deepEqual(copyableExports(pkg), []);
});

test('TH103: the two files 3.1.1 had missed are in the manifest', () => {
    // Named in S31 because a consumer overriding the dictionary copies the
    // first and a consumer loading the retro register copies the second.
    assert.ok(FILES.includes('js/strings.js'));
    assert.ok(FILES.includes('css/retro-register.css'));
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

test('R5-BADGE: every status has a badge rule, and every badge rule has a status', () => {
    // The plate used to be an inline style, so a server-rendered page
    // could not have a coloured badge without breaking TH109's bar. The
    // rules in css/components.css carry it now, and this test is what
    // keeps them tied to the one list that already exists -- the same
    // STATUS_NAMES the contrast gate holds all 24 themes to. Drill:
    // delete one rule and it names the status; add a rule for a name that
    // is not a status and it names that.
    const css = readFileSync(new URL('../css/components.css', import.meta.url), 'utf8');
    const declared = [...css.matchAll(/\.kp-badge\[data-status='([a-z-]+)'\]/g)].map((m) => m[1]);
    for (const name of STATUS_NAMES) {
        assert.ok(declared.includes(name), `no .kp-badge[data-status='${name}'] rule in css/components.css`);
        const rule = new RegExp(
            `\\.kp-badge\\[data-status='${name}'\\]\\s*\\{[^}]*background:\\s*var\\(--status-${name}\\)[^}]*color:\\s*var\\(--status-${name}-foreground\\)`,
            's',
        );
        assert.match(css, rule, `the ${name} rule does not paint both halves of its own token pair`);
    }
    for (const name of declared) {
        assert.ok(STATUS_NAMES.includes(name), `.kp-badge[data-status='${name}'] is a rule for something that is not a status`);
    }
    assert.equal(declared.length, STATUS_NAMES.length);
});

// ── Round six, C0: the six new gates, each proven on in-memory input
// before its on-disk drill [rule 7d, AR36, AR37, AR39, AR40, AR41, AR46].

import { audit as auditHooks } from './check-hooks.mjs';
import { audit as auditCoverage, missingParts } from './check-register-coverage.mjs';
import { audit as auditFonts, declaredFamilies } from './check-fonts.mjs';
import { block as tearBlock, ridge, withBlock } from './generate-tear.mjs';
import { references } from './check-manifest.mjs';
import { tableProblems } from './check-motion.mjs';
import { audit as auditTexture, strongestAlpha, textures } from './check-texture.mjs';
import { declaredRoots, rulesOf, subjectRoots } from './selectors.mjs';

const REGISTER_LIKE = `@layer kp.register {\n  [data-theme='x'] .kp-card { border: 0; }\n  [data-theme='x'] .kp-card__title { }\n  .kp-empty { }\n  @keyframes fx-a { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n}`;

test('selectors: a rule inside @layer is found as written, keyframes are not rules', () => {
    const rules = rulesOf(REGISTER_LIKE);
    assert.ok(rules.has("[data-theme='x'] .kp-card"));
    assert.ok(!rules.has('0%'));
    assert.deepEqual(subjectRoots("[data-theme='x'] .kp-card:hover::after"), ['card']);
    assert.deepEqual(subjectRoots("[data-theme='x'] .kp-card__title"), []);
    // `c` only ever appears as an ancestor; it is still a root the register must answer.
    assert.deepEqual([...declaredRoots('.kp-a {} .kp-a__b {} .kp-b--x {} .kp-c .kp-d {}')].sort(), ['a', 'c', 'd']);
});

test('KT14: a register that styles the bar and not the dropdown is refused; one that styles the menu passes', () => {
    const parts = { nav__menu: 'the dropdown' };
    const bar =
        "@layer kp.register {\n  [data-theme='x'] .kp-nav { background: red; }\n  [data-theme='x'] .kp-nav__link { color: red; }\n  [data-theme='x'] .kp-nav__menu { }\n}";
    assert.deepEqual(missingParts(bar, parts), ['nav__menu'], 'an empty rule is no answer');
    const menu = bar + "\n@layer kp.register { [data-theme='x'] .kp-nav__menu a:hover { background: red; } }";
    assert.deepEqual(missingParts(menu, parts), []);
    // A different part with the same prefix does not count for the menu.
    const other = "@layer kp.register { [data-theme='x'] .kp-nav__menu-status { color: red; } }";
    assert.deepEqual(missingParts(other, parts), ['nav__menu']);
});

test('AR36: a hook nobody answers, a quiet answer without a reason, and an unscoped theme answer all fail', () => {
    const matrix = {
        hooks: { emphasis: 'mark', reveal: 'reveal' },
        default: { emphasis: { css: 'base.css', selector: 'mark' } },
        themes: { x: { reveal: { quiet: '' } }, y: { emphasis: { css: 'base.css', selector: 'mark' } } },
    };
    const read = (/** @type {string} */ css) => (css === 'base.css' ? 'mark { background: none; }' : null);
    const { problems } = auditHooks(matrix, ['x', 'y'], read);
    assert.ok(
        problems.some((p) => p.includes('reveal is answered neither')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('quiet without a reason')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes("not scoped to [data-theme='y']")),
        problems.join('\n'),
    );
});

test('AR36: a complete matrix with a scoped theme answer passes', () => {
    const matrix = {
        hooks: { emphasis: 'mark' },
        default: { emphasis: { css: 'base.css', selector: 'mark' } },
        themes: { x: { emphasis: { css: 'reg.css', selector: "[data-theme='x'] mark" } } },
    };
    const read = (/** @type {string} */ css) => (css === 'base.css' ? 'mark { color: red; }' : "[data-theme='x'] mark { color: blue; }");
    assert.deepEqual(auditHooks(matrix, ['x'], read).problems, []);
});

test('AR37: an uncovered root fails, an empty-body rule covers nothing, and a stale exception fails', () => {
    const components = '.kp-card {} .kp-nav {} .kp-empty {} .kp-sr-only {}';
    const { uncovered, stale, covered } = auditCoverage(components, REGISTER_LIKE, { 'sr-only': 'helper' }, { nav: 'C2' });
    assert.deepEqual(covered, ['card']);
    assert.deepEqual(uncovered, ['empty']);
    assert.deepEqual(stale, []);
    const again = auditCoverage(components, REGISTER_LIKE, { 'sr-only': 'helper' }, { nav: 'C2', card: 'C2' });
    assert.deepEqual(again.stale, ['card']);
});

test('AR39: a reserved-name subset, a missing licence and an unlisted directory fail; a clean family passes', () => {
    const families = {
        sharetech: { family: 'Share Tech Mono', licence: 'OFL-1.1', reservedFontName: true, subset: true, themes: ['terminal'], scripts: ['latin'] },
        rajdhani: { family: 'Rajdhani', licence: 'OFL-1.1', reservedFontName: false, subset: true, themes: ['cyberpunk'], scripts: ['latin'] },
    };
    const readDir = (/** @type {string} */ slug) => ({ files: ['400.woff2'], licence: slug === 'rajdhani', bytes: 12000 });
    const byTheme = new Map([
        ['terminal', ['Share Tech Mono']],
        ['cyberpunk', ['Rajdhani']],
    ]);
    const problems = auditFonts(families, readDir, byTheme, 1_500_000, ['sharetech', 'rajdhani', 'stray']);
    assert.ok(
        problems.some((p) => p.includes('(reserved)')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('(licence)') && p.includes('Share Tech Mono')),
        problems.join('\n'),
    );
    assert.ok(
        problems.some((p) => p.includes('(unlisted)')),
        problems.join('\n'),
    );
    assert.ok(!problems.some((p) => p.includes('Rajdhani')), problems.join('\n'));
    assert.deepEqual(declaredFamilies("@font-face { font-family: 'Rajdhani'; src: url(x.woff2); }\n@font-face { font-family: 'Rajdhani'; }"), [
        'Rajdhani',
    ]);
    assert.deepEqual(declaredFamilies('/* nothing */'), []);
});

test('AR39: a theme over the font budget fails', () => {
    const families = { big: { family: 'Big', licence: 'OFL-1.1', reservedFontName: false, subset: true, themes: ['x'], scripts: ['latin'] } };
    const problems = auditFonts(families, () => ({ files: ['a.woff2'], licence: true, bytes: 2_000_000 }), new Map([['x', ['Big']]]), 1_500_000, [
        'big',
    ]);
    assert.ok(
        problems.some((p) => p.includes('(budget)')),
        problems.join('\n'),
    );
});

test('AR41: the tear is deterministic per seed, two seeds differ, and the block round-trips', () => {
    assert.deepEqual(ridge(7), ridge(7));
    assert.notDeepEqual(ridge(7), ridge(23));
    const once = withBlock('@layer kp.register {\n    .a { }\n}');
    assert.ok(once.includes('--fx-tear:') && once.includes('--fx-tear-alt:') && once.includes('--fx-tear-line:'));
    assert.equal(withBlock(once), once);
    assert.equal(tearBlock(), tearBlock());
});

test('AR39: a stylesheet url() is a reference the manifest walk follows; a data: URI is not', () => {
    assert.deepEqual(references('@font-face { src: url(\'../fonts/x/400.woff2\'); }\n.a { background: url("data:image/svg+xml,%3Csvg/%3E"); }'), [
        '../fonts/x/400.woff2',
    ]);
    assert.deepEqual(references("import { a } from './b.js';"), ['./b.js']);
});

test('AR40: a keyframe without a TIMINGS row fails; a row whose opacity steps drift fails; a matching row passes', () => {
    const css = '@keyframes fx-a { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }';
    assert.equal(tableProblems(css, {}).length, 1);
    assert.equal(tableProblems(css, { 'fx-a': { property: 'opacity', luminanceSteps: [1, 1] } }).length, 1);
    assert.deepEqual(tableProblems(css, { 'fx-a': { property: 'opacity', luminanceSteps: [1, 0, 1] } }), []);
    assert.deepEqual(tableProblems(css, { 'fx-a': { property: 'transform', luminanceSteps: [] } }), []);
});

test('AR46: the effective texture opacity is the layer opacity times the strongest alpha, nested var() included', () => {
    assert.equal(strongestAlpha('repeating-linear-gradient(to bottom, hsl(from var(--primary) h s l / 0.06) 0 1px, transparent 1px 3px)'), 0.06);
    assert.equal(strongestAlpha('radial-gradient(hsl(from var(--foreground) h s l / 1) 1px, transparent 1px)'), 1);
    assert.equal(strongestAlpha("url(\"data:image/svg+xml,%3Csvg%3E%3Ccircle fill='white' r='1'/%3E%3C/svg%3E\")"), 1);
    assert.equal(strongestAlpha('rgba(0, 0, 0, 0.13)'), 0.13);
    const css =
        "[data-theme='a'] { --fx-texture: rgba(0,0,0,0.13); --fx-texture-opacity: 0.55; }\n[data-theme='b'] { --fx-texture: rgba(0,0,0,0.5); --fx-texture-opacity: 0.1; }";
    const found = textures(css);
    assert.equal(found[0].effective, 0.0715);
    assert.equal(found[1].effective, 0.05);
    const { over, stale } = auditTexture(new Map([['x.css', css]]), {}, 0.06);
    assert.equal(over.length, 1);
    assert.deepEqual(stale, []);
    const excused = auditTexture(new Map([['x.css', css]]), { "[data-theme='a']": 0.0715, "[data-theme='b']": 0.05 }, 0.06);
    assert.deepEqual(excused.over, []);
    assert.deepEqual(excused.stale, ["[data-theme='b']"]);
});

// ── Round six, C2: the register's configuration surface [AR43] ─────────────

test('AR43: every knob the architecture names has its default in the cyberpunk register', () => {
    const register = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    // The demo's values, as AR43 lists them. A knob missing here, or with
    // another default, is the register drifting from the decision.
    const KNOBS = {
        '--kp-button-notch': 'var(--fx-notch, 14px)',
        '--kp-button-slit': '10px',
        '--kp-nav-notch': '13px',
        '--kp-nav-enter': '520ms',
        '--kp-nav-enter-delay': '80ms',
        '--kp-decipher-cps': '26',
        '--kp-decipher-lead': '260ms',
        '--kp-decipher-swap': '0.5',
        '--kp-reveal-threshold': '0.6',
        '--kp-reveal-stagger': '260ms',
        '--kp-redact-stagger': '160ms',
        '--kp-classified-delay': '1500ms',
        '--kp-wipe': '720ms',
        '--kp-rule-draw': '900ms',
        '--kp-rule-weight': '3px',
        '--kp-slice': '600ms',
        '--kp-slice-hover': '320ms',
        '--kp-charge': '520ms',
        '--kp-tear-height': '44px',
        '--fx-notch-sm': '8px',
    };
    const block = register.match(/\[data-theme='cyberpunk'\]\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const [knob, value] of Object.entries(KNOBS)) {
        const m = block.match(new RegExp(`${knob.replace(/[-]/g, '\\-')}:\\s*([^;]+);`));
        assert.ok(m, `${knob} is not declared in the register's theme block`);
        assert.equal(m[1].trim(), value, `${knob} defaults to ${m[1].trim()}, AR43 says ${value}`);
    }
});

// ── Round six, C4: the fonts travel in the tarball [T19, AR39, rule 7f] ──────

test('T19: the packed tarball carries css/fonts.css, fonts/families.json and a subset face with its licence', () => {
    const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
    // npm 11 keys the dry-run report by package name.
    const report = Object.values(JSON.parse(out))[0];
    const files = report.files.map((/** @type {{ path: string }} */ f) => f.path);
    for (const expected of ['css/fonts.css', 'fonts/families.json', 'fonts/rajdhani/rajdhani-regular.woff2', 'fonts/rajdhani/LICENSE']) {
        assert.ok(files.includes(expected), `${expected} is not in the tarball`);
    }
    // And nothing from a family with a Reserved Font Name.
    // A reserved-name family travels renamed (R6-Q1): the face is in the
    // tarball under its slug, and the file itself carries the new family
    // and none of the reserved word.
    assert.ok(files.includes('fonts/sharetechmono/sharetechmono-regular.woff2'), 'the renamed face did not travel');
    const names = nameRecords(readFileSync(new URL('../fonts/sharetechmono/sharetechmono-regular.woff2', import.meta.url)));
    assert.ok(
        names.some((r) => r.id === 1 && r.text === 'KP Tech Mono'),
        'the shipped face is not renamed',
    );
    assert.ok(!names.some((r) => ![0, 7, 8, 9, 11, 13, 14].includes(r.id) && r.text.includes('Share')), 'the reserved word travelled');
});

// ── TH130: one stylesheet list for every CSS gate ────────────────────────────

test('TH130: every stylesheet the manifest ships has an entry in the one list, and the bundle order is the list order', () => {
    const shipped = FILES.filter((f) => f.startsWith('css/'));
    assert.ok(shipped.length >= 9, `only ${shipped.length} stylesheets in the manifest`);
    for (const file of shipped)
        assert.ok(STYLESHEET_ROLES[file] !== undefined, `${file} is in the manifest and has no entry in gates/config.json stylesheets`);
    for (const file of Object.keys(STYLESHEET_ROLES)) {
        assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${file} is listed and does not exist`);
    }
    assert.deepEqual(stylesheets('bundled')[0], 'css/themes.css', 'the tokens come first in the bundle');
    // Drill [TH130]: `css/layout.css` deleted from the list → "is in the
    // manifest and has no entry", red (2026-09-07).
});

// ── S46: the concept page is the approved demo, element for element ─────────

test('S46: every element of the approved demo is on the concept page [correction L4]', () => {
    const inventory = JSON.parse(readFileSync(new URL('../showcase/concept-demo.json', import.meta.url), 'utf8'));
    const html = readFileSync(new URL('../examples/concept.html', import.meta.url), 'utf8');
    assert.ok(inventory.elements.length >= 25, `only ${inventory.elements.length} elements inventoried`);
    for (const { what, marker } of inventory.elements) {
        assert.ok(html.includes(marker), `the concept page lacks ${what} (no "${marker}" in examples/concept.html)`);
    }
    // Drill [L7]: the laurels removed from the descriptor and the page
    // regenerated → "lacks the laurels", red (2026-09-07).
});
