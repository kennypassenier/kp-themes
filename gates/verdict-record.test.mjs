// The verdict register's record tool, without a browser: verdict lines, ratios and the fixed order [fix-34].

import { test } from 'node:test';
import { HASH, context, entry } from './check-verdicts-fixtures.mjs';
import { parseVerdictLines, applyVerdictLines, sortedRegister } from './verdicts.mjs';
import assert from 'node:assert/strict';
import { registerFaults } from './check-verdicts.mjs';

test('record: verdict lines become register entries; a refused line records nothing', () => {
    const prompt = [
        'Catalogue feedback',
        '',
        'Verdict lines (hash version 2):',
        `button--variants · formal · firefox · approved · ${HASH}`,
        `button--variants · formal · chromium · rejected · ${'b'.repeat(64)}`,
        'End of verdict lines: 2.',
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

    const unknown = parseVerdictLines(
        `Verdict lines (hash version 2):\nbutton--nope · formal · firefox · approved · ${HASH}\nEnd of verdict lines: 1.`,
    );
    const empty = { hashVersion: 2, verdicts: {} };
    const refused = applyVerdictLines(empty, unknown, { ...context(), commit: 'abc1234', given: '2026-09-14' });
    assert.match(refused.faults[0], /button--nope · formal · firefox: not a block/);
    assert.deepEqual(empty.verdicts, {});

    const old = parseVerdictLines(
        `Verdict lines (hash version 1):\nbutton--variants · formal · firefox · approved · ${HASH}\nEnd of verdict lines: 1.`,
    );
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

test('a verdict line may carry the pixel ratio it was read at as a sixth field; five fields mean 1 [fix-34]', () => {
    const prompt = [
        'Verdict lines (hash version 2):',
        `button--variants · formal · firefox · approved · ${HASH} · @1.25`,
        `button--variants · nostromo · firefox · approved · ${HASH}`,
        'End of verdict lines: 2.',
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
        parseVerdictLines(
            `Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · @1.5\nEnd of verdict lines: 1.`,
        ),
        {
            ...context(),
            commit: 'def5678',
            given: '2026-09-15',
        },
    );
    assert.equal(moved.changed.length, 1);

    assert.match(
        parseVerdictLines(
            `Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · 1.25\nEnd of verdict lines: 1.`,
        ).faults[0],
        /sixth field is not @<ratio>/,
    );
    const bad = applyVerdictLines(
        { hashVersion: 2, verdicts: {} },
        parseVerdictLines(
            `Verdict lines (hash version 2):\nbutton--variants · formal · firefox · approved · ${HASH} · @1.23456\nEnd of verdict lines: 1.`,
        ),
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
