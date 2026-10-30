// The verdict register's reanchor and migrate tools, without a browser [scope-94, scope-96].

import { test } from 'node:test';
import { entry, HASH } from './check-verdicts-fixtures.mjs';
import { unmatchedEntries, reanchorRatios, reanchorEntries, keysFromCompare, migrateEntries, migrationKey } from './verdicts.mjs';
import assert from 'node:assert/strict';

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
    // Only the entry read at ratio 1 is anchored on a reading of the tools; a
    // zoomed one is left to the reviewer's own browser [fix-45].
    assert.equal(result.reanchored.length, 1);
    assert.deepEqual(result.zoomed, ['button--icons · nostromo · firefox @1.25']);
    assert.deepEqual(register.verdicts['button--icons'].formal.firefox, entry({ ...at, verdict: 'rejected', hash: rest }));
    assert.equal(register.verdicts['button--icons'].nostromo.firefox.hash, HASH);
    // --force writes it anyway, for the one case where the reviewer asks.
    assert.equal(reanchorEntries(register, targets, readings, { force: true }).reanchored.length, 2);
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
