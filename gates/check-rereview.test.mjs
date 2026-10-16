// The re-review gate: a page offering a pair Kenny approved is refused (Kenny, 2026-10-16).
//
// Run: node --test gates/check-rereview.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offeredPairs, rereviewFaults } from './check-rereview.mjs';

const verdicts = {
    rounds: [
        { round: '1', allJudged: true, notApproved: [{ item: 'a', theme: 'formal', note: 'x' }] },
        { round: '2', allJudged: true, notApproved: [{ item: 'a', theme: 'grotesk', note: 'y' }] },
    ],
};
// The old round-3 shape: both sections in every theme.
const old = `<html data-review="t"><section data-review-item="a"></section><section data-review-item="b"></section>`;
const fixed = `<html data-review="t"><section data-review-item="a" data-review-themes="grotesk"></section>`;

test('a section without its own themes is offered in all 16', () => {
    assert.equal(offeredPairs(old).length, 32);
    assert.equal(offeredPairs(fixed).length, 1);
    assert.equal(offeredPairs(`<html data-review-themes="formal,light"><section data-review-item="a"></section>`).length, 2);
});

test('the old page is refused and names the approved pairs', () => {
    const [fault] = rereviewFaults('t', old, verdicts, false);
    assert.match(fault, /still offers 31 approved pair/);
    assert.match(fault, /b · formal/);
    assert.doesNotMatch(fault, /a · grotesk\n/);
});

test('the page with only open pairs passes', () => {
    assert.deepEqual(rereviewFaults('t', fixed, verdicts, false), []);
});

test('a reopened pair with a reason may be offered; one without a reason is refused', () => {
    const page = `<html><section data-review-item="b" data-review-themes="formal"></section><section data-review-item="a" data-review-themes="grotesk"></section>`;
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
