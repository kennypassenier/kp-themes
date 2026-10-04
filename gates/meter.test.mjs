// The meter with a mark [scope-143]: the words a screen reader hears name the
// real share, past 100 % too, and the fill and the mark stay on the bar.
// Spec C7 items 1 and 2 (research/dashboard-ports-2/README.md, section 2);
// what the browser draws is tests/meter.spec.mjs.
//
// Run: node --test gates/meter.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meterParts, meterText } from '../js/kpi.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

test('the words name the real share and the mark, never clamped (C7.2) [scope-143]', () => {
    assert.equal(meterText(0.62, 0.8, { label: 'full', markLabel: 'the target level' }), '62% full; 80% the target level');
    assert.equal(meterText(0.58, 1.3, { label: 'running now', markLabel: 'booked for tonight' }), '58% running now; 130% booked for tonight');
    assert.equal(meterText(1.12, null, { label: 'of the plan used' }), '112% of the plan used');
    assert.equal(meterText(0.3), `30% ${DEFAULT_STRINGS.meterUsed}`);
    assert.equal(meterText(0, 0.5, { label: 'used' }), '0% used; 50%');
    assert.equal(meterText(null, 0.5), DEFAULT_STRINGS.meterNotMeasured);
});

test('the fill and the mark stay on the bar; past the end is a flag (C7.1, C7.2) [scope-143]', () => {
    // 0.62 of a 200 px bar is 124 px; a mark at 0.8 sits at 160 px.
    const reservoir = meterParts(0.62, 0.8);
    assert.deepEqual(
        [reservoir.fill * 200, /** @type {number} */ (reservoir.mark) * 200, reservoir.over, reservoir.markOver, reservoir.now],
        [124, 160, false, false, 62],
    );
    assert.deepEqual(meterParts(0.58, 1.3), { measured: true, fill: 0.58, over: false, mark: 1, markOver: true, now: 58 });
    assert.deepEqual(meterParts(1.12), { measured: true, fill: 1, over: true, mark: null, markOver: false, now: 100 });
    // The edges: a mark at either end, below zero, nothing measured.
    assert.deepEqual([meterParts(0.3, 0).mark, meterParts(0.3, 1).markOver], [0, false]);
    assert.deepEqual([meterParts(-0.2, -1).fill, meterParts(-0.2, -1).mark], [0, 0]);
    assert.deepEqual(meterParts(null, 0.5), { measured: false, fill: 0, over: false, mark: 0.5, markOver: false, now: null });
});
