// The re-review gate: a page offering a pair Kenny approved is refused (Kenny, 2026-10-16).
//
// Run: node --test gates/check-rereview.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offeredPairs, rereviewFaults } from './check-rereview.mjs';
import { THEMES } from '../js/theme-registry.js';

// Counts follow the shipped theme list, never a hard-coded number.
const N = THEMES.length;

const verdicts = {
    rounds: [
        { round: '1', allJudged: true, notApproved: [{ item: 'a', theme: 'formal', note: 'x' }] },
        { round: '2', allJudged: true, notApproved: [{ item: 'a', theme: 'dark', note: 'y' }] },
    ],
};
// The old round-3 shape: both sections in every theme.
const old = `<html data-review="t"><section data-review-item="a"></section><section data-review-item="b"></section>`;
const fixed = `<html data-review="t"><section data-review-item="a" data-review-themes="dark"></section>`;

test('a section without its own themes is offered in every shipped theme', () => {
    assert.equal(offeredPairs(old).length, 2 * N);
    assert.equal(offeredPairs(fixed).length, 1);
    assert.equal(offeredPairs(`<html data-review-themes="formal,dark"><section data-review-item="a"></section>`).length, 2);
});

test('the old page is refused and names the approved pairs', () => {
    const [fault] = rereviewFaults('t', old, verdicts, false);
    assert.match(fault, new RegExp(`still offers ${2 * N - 1} approved pair`));
    assert.match(fault, /b · formal/);
    assert.doesNotMatch(fault, /a · dark\n/);
});

test('the page with only open pairs passes', () => {
    assert.deepEqual(rereviewFaults('t', fixed, verdicts, false), []);
});

test('a reopened pair with a reason may be offered; one without a reason is refused', () => {
    const page = `<html><section data-review-item="b" data-review-themes="formal"></section><section data-review-item="a" data-review-themes="dark"></section>`;
    const ok = { ...verdicts, reopened: [{ item: 'b', theme: 'formal', reason: 'the component changed' }] };
    assert.deepEqual(rereviewFaults('t', page, ok, false), []);
    const bad = { ...verdicts, reopened: [{ item: 'b', theme: 'formal', reason: '' }] };
    assert.ok(rereviewFaults('t', page, bad, false).length >= 1);
});

test('a fully approved demo must be Decided, and an archived one is left alone', () => {
    const done = { rounds: [{ round: '1', allJudged: true, notApproved: [] }] };
    assert.match(rereviewFaults('t', old, done, false)[0], /Decided/);
    assert.deepEqual(rereviewFaults('t', old, done, true), []);
});
