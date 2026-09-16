// The approval count is arithmetic, so it is tested without a browser
// [scope-109].
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPairs, snapshotLine } from './advice-approvals.mjs';

const known = new Map([
    ['button--variants', { component: true }],
    ['research/x/demo.html#one', { component: false }],
]);

test('a pair counts as approved when any engine approved it [scope-107]', () => {
    const register = {
        verdicts: { 'button--variants': { dark: { firefox: { verdict: 'approved' } }, light: { chromium: { verdict: 'approved' } } } },
    };
    const { open, approved, pairs } = openPairs(known, ['dark', 'light'], register);
    assert.equal(approved, 2);
    assert.equal(pairs, 2);
    assert.deepEqual(open, []);
});

test('an approval on a block that changed since is open again [scope-112]', () => {
    const register = {
        verdicts: {
            'button--variants': {
                dark: { firefox: { verdict: 'approved', hash: 'aaa', ratio: 2.222 } },
                light: { firefox: { verdict: 'approved', hash: 'bbb', ratio: 2.222 } },
            },
        },
    };
    const snapshot = {
        readings: {
            'button--variants': {
                dark: { firefox: { hash: 'moved', ratio: 2.222 } },
                light: { firefox: { hash: 'bbb', ratio: 2.222 } },
            },
        },
    };
    const { open, approved } = openPairs(known, ['dark', 'light'], register, snapshot);
    assert.equal(approved, 1);
    assert.deepEqual(open, [{ key: 'button--variants', theme: 'dark', state: 'changed since judged' }]);
});

test('a reading taken at another ratio says nothing about the verdict [fix-34]', () => {
    const register = { verdicts: { 'button--variants': { dark: { firefox: { verdict: 'approved', hash: 'aaa', ratio: 2.222 } } } } };
    const snapshot = { readings: { 'button--variants': { dark: { firefox: { hash: 'moved' } } } } };
    const { approved, open } = openPairs(known, ['dark'], register, snapshot);
    assert.equal(approved, 1);
    assert.deepEqual(open, []);
});

test('the advice says how old its reading is [scope-112]', () => {
    assert.match(snapshotLine(null, []), /run `node gates\/verdicts\.mjs snapshot`/);
    assert.match(
        snapshotLine({ commit: 'abcdef1234567890', taken: '2026-09-16' }, []),
        /read at abcdef123456 \(2026-09-16\); nothing that shapes a block moved/,
    );
    assert.match(snapshotLine({ commit: 'abcdef1234567890', taken: '2026-09-16' }, ['css/dark-register.css']), /1 file\(s\) under .* moved since/);
});

test('a rejection and a block never judged are both open, and research is left out', () => {
    const register = { verdicts: { 'button--variants': { dark: { firefox: { verdict: 'rejected' } } } } };
    const { open, approved } = openPairs(known, ['dark', 'light'], register);
    assert.equal(approved, 0);
    assert.deepEqual(open, [
        { key: 'button--variants', theme: 'dark', state: 'rejected' },
        { key: 'button--variants', theme: 'light', state: 'never judged' },
    ]);
});
