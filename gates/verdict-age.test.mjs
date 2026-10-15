// Which verdict wins, the register's or this browser's, without a browser.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
const HASH_VERSION = 10;
import { newer } from '../catalogue/verdict-age.js';

const day = (/** @type {string} */ iso) => new Date(`${iso}T12:00:00`).getTime();
const local = (/** @type {string} */ iso) => ({ verdict: 'rejected', hash: 'a'.repeat(64), v: HASH_VERSION, at: day(iso) });

test('a browser answer given before the register entry was decided loses', () => {
    assert.equal(newer(local('2026-10-05'), { given: '2026-10-15' }, HASH_VERSION), false);
});

test('a browser answer given the same day or later still wins', () => {
    assert.equal(newer(local('2026-10-15'), { given: '2026-10-15' }, HASH_VERSION), true);
    assert.equal(newer(local('2026-10-16'), { given: '2026-10-15' }, HASH_VERSION), true);
});

test('an answer without a time or under an old recipe never wins', () => {
    assert.equal(newer({ ...local('2026-10-16'), at: undefined }, { given: '2026-10-15' }, HASH_VERSION), false);
    assert.equal(newer({ ...local('2026-10-16'), v: HASH_VERSION - 1 }, { given: '2026-10-15' }, HASH_VERSION), false);
});
