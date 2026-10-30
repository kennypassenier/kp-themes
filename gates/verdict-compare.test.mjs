// The verdict register's comparison and annotation tools, without a browser [fix-28, fix-34].

import { test } from 'node:test';
import { entry, HASH } from './check-verdicts-fixtures.mjs';
import { entriesAt, againstReadings, compareCommand, annotateRatios, geckoRatio } from './verdicts.mjs';
import assert from 'node:assert/strict';

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
