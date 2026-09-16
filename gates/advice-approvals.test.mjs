// The approval count is arithmetic, so it is tested without a browser
// [scope-109].
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPairs } from './advice-approvals.mjs';

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

test('a rejection and a block never judged are both open, and research is left out', () => {
    const register = { verdicts: { 'button--variants': { dark: { firefox: { verdict: 'rejected' } } } } };
    const { open, approved } = openPairs(known, ['dark', 'light'], register);
    assert.equal(approved, 0);
    assert.deepEqual(open, [
        { key: 'button--variants', theme: 'dark', state: 'rejected' },
        { key: 'button--variants', theme: 'light', state: 'never judged' },
    ]);
});
