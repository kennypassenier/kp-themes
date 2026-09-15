// The verdict register's gate and its record tool, without a browser.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blockIds, knownBlocks, registerFaults } from './check-verdicts.mjs';
import {
    againstReadings,
    annotateRatios,
    applyVerdictLines,
    compareCommand,
    entriesAt,
    geckoRatio,
    keysFromCompare,
    migrateEntries,
    migrationKey,
    parseVerdictLines,
    reanchorEntries,
    reanchorRatios,
    sortedRegister,
    unmatchedEntries,
} from './verdicts.mjs';

const HASH = 'a'.repeat(64);
const context = (overrides = {}) => ({
    hashVersion: 2,
    known: new Set(['button--variants', 'research/navbar/demo.html#current']),
    themes: ['formal', 'nostromo'],
    ...overrides,
});
const entry = (extra = {}) => ({ verdict: 'approved', hash: HASH, commit: '2a32791', given: '2026-09-13', ...extra });

test('a register at another hash version is refused, with the command that brings it level', () => {
    const faults = registerFaults({ hashVersion: 1, verdicts: {} }, context());
    assert.equal(faults.length, 1);
    assert.match(faults[0], /version 1, catalogue\/block-hash\.js reads version 2: run node gates\/verdicts\.mjs rehash/);
    assert.deepEqual(registerFaults({ hashVersion: 2, verdicts: {} }, context()), []);
});

test('a key no review page shows, a theme that does not exist and a malformed entry are refused', () => {
    const faults = registerFaults(
        {
            hashVersion: 2,
            verdicts: {
                'button--gone': { formal: { firefox: entry() } },
                'button--variants': {
                    plaid: { firefox: entry() },
                    formal: { Firefox: entry({ verdict: 'fine', hash: 'abc', given: '13-09-2026' }) },
                },
            },
        },
        context(),
    );
    assert.ok(faults.some((f) => /button--gone: not a block/.test(f)));
    assert.ok(faults.some((f) => /plaid: not a theme/.test(f)));
    assert.ok(faults.some((f) => /Firefox: an engine name/.test(f)));
    assert.ok(faults.some((f) => /verdict "fine"/.test(f)));
    assert.ok(faults.some((f) => /not a full SHA-256/.test(f)));
    assert.ok(faults.some((f) => /given is not a YYYY-MM-DD/.test(f)));
    assert.deepEqual(registerFaults('[]', context()), ['the register is not a JSON object']);
    assert.ok(registerFaults({ hashVersion: 2 }, context()).includes('verdicts is missing or not an object'));
});

test('a well-formed register passes, per engine', () => {
    const register = {
        hashVersion: 2,
        verdicts: { 'button--variants': { formal: { firefox: entry(), chromium: entry({ verdict: 'rejected' }) } } },
    };
    assert.deepEqual(registerFaults(register, context()), []);
});

test('block ids are read the way the catalogue mounts them', () => {
    assert.deepEqual(blockIds('<main><section class="cat-block" id="a"></section><section id="b"></section></main>'), ['a']);
    assert.deepEqual(blockIds('<header><section id="x"></section></header><main><section id="b"><section id="c"></section></section></main>'), [
        'b',
        'c',
    ]);
    assert.deepEqual(blockIds('<main><!-- <section class="cat-block" id="gone"> --><section class="cat-block" id="kept"></section></main>'), [
        'kept',
    ]);
});

test('the repository knows its component and demo blocks by the keys the pages use', async () => {
    const known = await knownBlocks();
    assert.ok(known.has('button--variants'));
    assert.ok(known.has('table--datatable'));
    assert.ok([...known.keys()].some((key) => key.startsWith('research/navbar/demo.html#')));
});

test('record: verdict lines become register entries; a refused line records nothing', () => {
    const prompt = [
        'Catalogue feedback',
        '',
        'Verdict lines (hash version 2):',
        `button--variants · formal · firefox · approved · ${HASH}`,
        `button--variants · formal · chromium · rejected · ${'b'.repeat(64)}`,
        '',
    ].join('\n');
    /** @type {any} */
    const register = { hashVersion: 2, verdicts: {} };
    const parsed = parseVerdictLines(prompt);
    assert.deepEqual(parsed.faults, []);
    const report = applyVerdictLines(register, parsed, { ...context(), commit: 'abc1234', given: '2026-09-14' });
    assert.deepEqual(report.faults, []);
    assert.equal(report.added.length, 2);
    assert.deepEqual(register.verdicts['button--variants'].formal.firefox, {
        verdict: 'approved',
        hash: HASH,
        commit: 'abc1234',
        given: '2026-09-14',
    });

    const again = applyVerdictLines(register, parsed, { ...context(), commit: 'def5678', given: '2026-09-15' });
    assert.equal(again.unchanged.length, 2);
    assert.equal(register.verdicts['button--variants'].formal.firefox.commit, 'abc1234');

    const unknown = parseVerdictLines(`Verdict lines (hash version 2):\nbutton--nope · formal · firefox · approved · ${HASH}`);
    const empty = { hashVersion: 2, verdicts: {} };
    const refused = applyVerdictLines(empty, unknown, { ...context(), commit: 'abc1234', given: '2026-09-14' });
    assert.match(refused.faults[0], /button--nope · formal · firefox: not a block/);
    assert.deepEqual(empty.verdicts, {});

    const old = parseVerdictLines(`Verdict lines (hash version 1):\nbutton--variants · formal · firefox · approved · ${HASH}`);
    assert.match(applyVerdictLines({ hashVersion: 2, verdicts: {} }, old, { ...context(), commit: 'a', given: 'b' }).faults[0], /hash version 1/);
});

test('the register is written in a fixed order', () => {
    const sorted = sortedRegister({
        hashVersion: 2,
        verdicts: { b: { nostromo: { firefox: { given: 'd', commit: 'c', hash: 'h', verdict: 'v' } } }, a: { formal: {} } },
    });
    assert.deepEqual(Object.keys(sorted.verdicts), ['a', 'b']);
    assert.deepEqual(Object.keys(sorted.verdicts.b.nostromo.firefox), ['verdict', 'hash', 'commit', 'given']);
});

test('compare --against-browser: the entries of one commit, and which the test browser read too [fix-28]', () => {
    /** @type {any} */
    const register = {
        hashVersion: 2,
        verdicts: {
            'button--icons': {
                formal: { firefox: entry({ commit: '001af2f3aaaa' }) },
                nostromo: { firefox: entry({ commit: '001af2f3aaaa', verdict: 'rejected' }) },
            },
            'button--gone': { formal: { chromium: entry({ commit: '001af2f3aaaa' }) } },
            'button--variants': { formal: { firefox: entry() } },
        },
    };
    const at = entriesAt(register, '001af2f3');
    assert.deepEqual(
        at.map((e) => `${e.key}|${e.theme}|${e.engine}`),
        ['button--icons|formal|firefox', 'button--icons|nostromo|firefox', 'button--gone|formal|chromium'],
    );
    assert.equal(entriesAt(register, null).length, 4);
    const readings = new Map([
        ['button--icons|formal|firefox', { hash: HASH }],
        ['button--icons|nostromo|firefox', { hash: 'b'.repeat(64) }],
    ]);
    const result = againstReadings(at, readings, new Set(['button--icons']));
    assert.deepEqual(result.equal, ['button--icons · formal · firefox · approved']);
    assert.equal(result.differ.length, 1);
    assert.match(
        result.differ[0],
        /^button--icons · nostromo · firefox · rejected \(recorded aaaaaaaaaaaa…, the test browser reads bbbbbbbbbbbb…\)$/,
    );
    assert.deepEqual(result.gone, ['button--gone · formal · chromium · approved']);
    assert.equal(compareCommand('001af2f3aaaabbbbcccc'), 'node gates/verdicts.mjs compare --against-browser --commit 001af2f3aaaa');
});

test('a verdict line may carry the pixel ratio it was read at as a sixth field; five fields mean 1 [fix-34]', () => {
    const prompt = [
        'Verdict lines (hash version 2):',
        `button--variants · formal · firefox · approved · ${HASH} · @1.25`,
        `button--variants · nostromo · firefox · approved · ${HASH}`,
        '',
    ].join('\n');
    /** @type {any} */
    const register = { hashVersion: 2, verdicts: {} };
    const parsed = parseVerdictLines(prompt);
    assert.deepEqual(parsed.faults, []);
    assert.deepEqual(
        parsed.lines.map((line) => line.ratio),
        [1.25, 1],
    );
    const report = applyVerdictLines(register, parsed, { ...context(), commit: 'abc1234', given: '2026-09-15' });
    assert.deepEqual(report.faults, []);
    assert.equal(register.verdicts['button--variants'].formal.firefox.ratio, 1.25);
    assert.ok(!('ratio' in register.verdicts['button--variants'].nostromo.firefox));
    assert.deepEqual(registerFaults(register, context()), []);
    assert.deepEqual(Object.keys(sortedRegister(register).verdicts['button--variants'].formal.firefox), [
        'verdict',
        'hash',
        'commit',
        'given',
        'ratio',
    ]);

    // The same verdict at another ratio is a change, not "already recorded".
    const moved = applyVerdictLines(
        register,
        parseVerdictLines(`Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · @1.5`),
        {
            ...context(),
            commit: 'def5678',
            given: '2026-09-15',
        },
    );
    assert.equal(moved.changed.length, 1);

    assert.match(
        parseVerdictLines(`Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · 1.25`).faults[0],
        /sixth field is not @<ratio>/,
    );
    const bad = applyVerdictLines(
        { hashVersion: 2, verdicts: {} },
        parseVerdictLines(`Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · @1.23456`),
        {
            ...context(),
            commit: 'a1b2c3d',
            given: '2026-09-15',
        },
    );
    assert.match(bad.faults[0], /more than three decimals/);
});

test('a register entry may carry a ratio other than 1, to three decimals [fix-34]', () => {
    const faults = (/** @type {unknown} */ ratio) =>
        registerFaults({ hashVersion: 2, verdicts: { 'button--variants': { formal: { firefox: entry({ ratio }) } } } }, context());
    assert.deepEqual(faults(1.25), []);
    assert.deepEqual(faults(1.091), []);
    assert.match(faults(1)[0], /ratio 1 is not written/);
    assert.match(faults('1.25')[0], /not a number/);
    assert.match(faults(1.0909)[0], /more than three decimals/);
    const extra = registerFaults({ hashVersion: 2, verdicts: { 'button--variants': { formal: { firefox: entry({ zoom: 2 }) } } } }, context());
    assert.match(extra[0], /expected commit, given, hash, verdict and an optional ratio/);
});

test('annotate-ratio gives an entry the ratio a reading matches, never a hash or a verdict [fix-34]', () => {
    const other = 'b'.repeat(64);
    /** @type {any} */
    const register = {
        hashVersion: 2,
        verdicts: {
            'button--variants': {
                formal: { firefox: entry({ commit: 'd499b6b2aaaa' }) }, // equal at 1
                nostromo: { firefox: entry({ commit: 'd499b6b2aaaa', hash: other }) }, // matches 1.25 and 1.5
            },
            'button--icons': {
                formal: { firefox: entry({ commit: 'd499b6b2aaaa', verdict: 'rejected' }) }, // matches 1.25 only
                nostromo: { firefox: entry({ commit: 'd499b6b2aaaa' }) }, // matches nothing
                plaid: { firefox: entry({ commit: 'd499b6b2aaaa' }) }, // not read
            },
            'button--sizes': { formal: { firefox: entry() } }, // another commit
        },
    };
    const readings = {
        1: { 'button--variants|formal': HASH, 'button--variants|nostromo': HASH, 'button--icons|formal': other, 'button--icons|nostromo': other },
        1.25: { 'button--variants|nostromo': other, 'button--icons|formal': HASH, 'button--icons|nostromo': other },
        1.5: { 'button--variants|nostromo': other },
        1.1: { 'button--icons|nostromo': other },
    };
    const facts = () =>
        JSON.stringify(Object.values(register.verdicts).flatMap((t) => Object.values(t).map((e) => [e.firefox.hash, e.firefox.verdict])));
    const before = facts();
    const result = annotateRatios(register, readings, { commit: 'd499b6b2' });
    assert.equal(result.equal, 1);
    assert.deepEqual(
        result.annotated.map(({ key, theme, ratio }) => `${key}|${theme}|${ratio}`),
        ['button--variants|nostromo|1.25', 'button--icons|formal|1.25'],
    );
    assert.deepEqual(result.unmatched, [{ key: 'button--icons', theme: 'nostromo' }]);
    assert.deepEqual(result.unread, [{ key: 'button--icons', theme: 'plaid' }]);
    assert.ok(!('ratio' in register.verdicts['button--sizes'].formal.firefox));
    assert.equal(facts(), before);
    // Run again: entries with a ratio are kept as they are.
    assert.equal(annotateRatios(register, readings, { commit: 'd499b6b2' }).kept, 2);
    assert.equal(geckoRatio('1.1'), 1.091);
    assert.equal(geckoRatio('1.3333333'), 1.333);
    assert.equal(geckoRatio(1.25), 1.25);
});

test('reanchor replaces the hash of an entry no ratio matches with a reading at rest, keeping its verdict [scope-94]', () => {
    const rest = 'c'.repeat(64);
    const at = { commit: 'd499b6b2aaaa' };
    /** @type {any} */
    const register = {
        hashVersion: 2,
        verdicts: {
            'button--variants': {
                formal: { firefox: entry({ ...at }) }, // equal at 1
                nostromo: { firefox: entry({ ...at, ratio: 1.25 }) }, // annotated
            },
            'button--icons': {
                formal: { firefox: entry({ ...at, verdict: 'rejected' }) }, // matches nothing, formal has no annotated entry
                nostromo: { firefox: entry({ ...at }) }, // matches nothing
            },
            'button--sizes': { nostromo: { firefox: entry({ ...at, ratio: 1.5 }) }, formal: { firefox: entry() } }, // formal: another commit
        },
    };
    const untouched = JSON.stringify([register.verdicts['button--variants'], register.verdicts['button--sizes']]);
    const other = 'b'.repeat(64);
    // Each entry read at its own ratio; a reading at another ratio is never compared.
    const atOwn = new Map([
        ['button--variants|formal|1', { hash: HASH }],
        ['button--variants|nostromo|1.25', { hash: HASH }],
        ['button--variants|nostromo|1', { hash: other }],
        ['button--icons|formal|1', { hash: other }],
        ['button--icons|nostromo|1', { hash: other }],
        ['button--sizes|nostromo|1.5', { hash: HASH }],
    ]);
    const found = unmatchedEntries(register, atOwn, { commit: 'd499b6b2' });
    assert.deepEqual(
        found.map((e) => `${e.key}|${e.theme}`),
        ['button--icons|formal', 'button--icons|nostromo'],
    );
    // nostromo: 1.25 and 1.5 once each; the tie goes to the lower.
    const ratios = reanchorRatios(register, { commit: 'd499b6b2' });
    assert.deepEqual([...ratios], [['nostromo', 1.25]]);
    const targets = found.map(({ key, theme, engine }) => ({ key, theme, engine, ratio: ratios.get(theme) ?? 1 }));
    const readings = new Map([
        ['button--icons|formal|firefox|1', { hash: rest }],
        ['button--icons|nostromo|firefox|1.25', { hash: rest }],
    ]);
    const result = reanchorEntries(register, targets, readings);
    assert.deepEqual(result.unread, []);
    assert.equal(result.reanchored.length, 2);
    assert.deepEqual(register.verdicts['button--icons'].formal.firefox, entry({ ...at, verdict: 'rejected', hash: rest }));
    assert.deepEqual(register.verdicts['button--icons'].nostromo.firefox, entry({ ...at, hash: rest, ratio: 1.25 }));
    assert.equal(JSON.stringify([register.verdicts['button--variants'], register.verdicts['button--sizes']]), untouched);
    // A reading that is not there leaves the entry as it was.
    assert.deepEqual(reanchorEntries(register, [{ key: 'button--variants', theme: 'formal', engine: 'firefox', ratio: 1.5 }], new Map()).unread, [
        'button--variants · formal · firefox @1.5',
    ]);
    assert.equal(register.verdicts['button--variants'].formal.firefox.hash, HASH);
    assert.deepEqual(keysFromCompare('  differs: table--datatable · grotesk · firefox · approved (recorded 1…)\n1 equal, 1 differ'), [
        { key: 'table--datatable', theme: 'grotesk', engine: 'firefox' },
    ]);
});

test('migrate-v3 carries an entry over only where its version-2 reading is its hash, at its own commit and ratio [scope-95]', () => {
    const v2 = 'c'.repeat(64);
    const v3 = 'd'.repeat(64);
    const other = 'e'.repeat(64);
    const register = {
        hashVersion: 2,
        verdicts: {
            'button--variants': {
                formal: { firefox: entry({ hash: v2, commit: 'aaaa111' }) }, // reproduces: carried over
                nostromo: { firefox: entry({ verdict: 'rejected', hash: v2, commit: 'bbbb222', ratio: 1.25 }) }, // reproduces at 1.25 only
            },
            'button--sizes': {
                formal: { firefox: entry({ hash: other, commit: 'aaaa111' }) }, // its block reads another version-2 hash: kept
                nostromo: { firefox: entry({ hash: v2, commit: 'aaaa111' }) }, // no version-2 reading: kept
            },
        },
    };
    const readings = new Map([
        ['button--variants|formal|firefox|aaaa111|1', { hash: v3, previous: v2 }],
        // The same block read at ratio 1: not the entry's ratio, never used.
        ['button--variants|nostromo|firefox|bbbb222|1', { hash: other, previous: other }],
        ['button--variants|nostromo|firefox|bbbb222|1.25', { hash: v3, previous: v2 }],
        ['button--sizes|formal|firefox|aaaa111|1', { hash: v3, previous: v2 }],
        // A reading without a version-2 hash (an older recipe) cannot vouch for anything.
        ['button--sizes|nostromo|firefox|aaaa111|1', { hash: v3 }],
    ]);
    const result = migrateEntries(register, readings);
    assert.equal(register.hashVersion, 3);
    assert.deepEqual(result.migrated, ['button--variants · formal · firefox', 'button--variants · nostromo · firefox @1.25']);
    assert.deepEqual(result.unreproducible, ['button--sizes · formal · firefox (recorded at aaaa111)']);
    assert.deepEqual(result.unread, ['button--sizes · nostromo · firefox']);
    // Verdict, commit, date and ratio kept; only the hash moves.
    assert.deepEqual(register.verdicts['button--variants'].formal.firefox, entry({ hash: v3, commit: 'aaaa111' }));
    assert.deepEqual(
        register.verdicts['button--variants'].nostromo.firefox,
        entry({ verdict: 'rejected', hash: v3, commit: 'bbbb222', ratio: 1.25 }),
    );
    assert.equal(register.verdicts['button--sizes'].formal.firefox.hash, other);
    assert.equal(register.verdicts['button--sizes'].nostromo.firefox.hash, v2);
    assert.equal(migrationKey('k', 't', 'firefox', entry({ commit: 'abc' })), 'k|t|firefox|abc|1');
    // A register already at 3 is not carried over twice.
    assert.throws(() => migrateEntries(register, readings), /hash version 3, not 2/);
});

test('reanchor finds an entry that keeps a ratio when its own-ratio reading is another hash [scope-96]', () => {
    const rest = 'c'.repeat(64);
    /** @type {any} */
    const register = {
        hashVersion: 3,
        verdicts: {
            'button--variants': {
                formal: { firefox: entry({ commit: '62dcfba6aaaa', ratio: 2.222 }) }, // equal at 2.222
                nostromo: { firefox: entry({ commit: '62dcfba6aaaa', ratio: 2.222 }) }, // another reading at 2.222
            },
        },
    };
    const readings = new Map([
        ['button--variants|formal|2.222', { hash: HASH }],
        ['button--variants|nostromo|2.222', { hash: rest }],
        ['button--variants|nostromo|1', { hash: HASH }], // at another ratio: not the entry's reading
    ]);
    const found = unmatchedEntries(register, readings, { commit: '62dcfba6' });
    assert.deepEqual(
        found.map((e) => `${e.key}|${e.theme}`),
        ['button--variants|nostromo'],
    );
});

test('migrate --to 4 carries an entry over only where its version-3 reading is its hash, at its own commit and ratio [scope-96]', () => {
    const v3 = 'd'.repeat(64);
    const v4 = 'f'.repeat(64);
    const other = 'e'.repeat(64);
    const register = {
        hashVersion: 3,
        verdicts: {
            // page-effects#headline: only its "At rest" label moved out of the hash.
            'page-effects--headline': { formal: { firefox: entry({ hash: v3, commit: 'aaaa111', ratio: 2.222 }) } },
            // A block whose version-3 reading at its commit is another hash: kept.
            'combobox--open': { formal: { firefox: entry({ hash: other, commit: 'aaaa111' }) } },
        },
    };
    const readings = new Map([
        ['page-effects--headline|formal|firefox|aaaa111|2.222', { hash: v4, previous: v3 }],
        ['combobox--open|formal|firefox|aaaa111|1', { hash: v4, previous: v3 }],
    ]);
    assert.throws(() => migrateEntries(structuredClone(register), readings), /hash version 3, not 2/);
    const result = migrateEntries(register, readings, { to: 4 });
    assert.equal(register.hashVersion, 4);
    assert.deepEqual(result.migrated, ['page-effects--headline · formal · firefox @2.222']);
    assert.deepEqual(result.unreproducible, ['combobox--open · formal · firefox (recorded at aaaa111)']);
    assert.deepEqual(register.verdicts['page-effects--headline'].formal.firefox, entry({ hash: v4, commit: 'aaaa111', ratio: 2.222 }));
    assert.equal(register.verdicts['combobox--open'].formal.firefox.hash, other);
    assert.throws(() => migrateEntries(register, readings, { to: 4 }), /hash version 4, not 3/);
});
