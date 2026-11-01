// The editable sequencer's pure halves [timeline-1029].
//
// What a recipe's steps do when they are edited like clips: the grid and edge snap, the clamp at the start, what an overlap does
// (refuse, push, allow), the linked ("runs alongside") groups that move together, the keyboard's one-step math, the rows of a lane
// that allows overlap, the axis and the window. The browser halves (a drag, the picked-up bar, the announcements) are the demo's.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    sequencerClean,
    sequencerGroup,
    sequencerPlan,
    sequencerRows,
    sequencerSnap,
    sequencerUnit,
} from '../js/sequencer.js';
import { it, at, recipe } from './sequencer-fixtures.mjs';

test('every unit is accepted, by name or short form', () => {
    assert.deepEqual(sequencerUnit('minutes'), { name: 'minute', seconds: 60 });
    assert.deepEqual(sequencerUnit('MIN'), { name: 'minute', seconds: 60 });
    assert.deepEqual(sequencerUnit('s'), { name: 'second', seconds: 1 });
    assert.deepEqual(sequencerUnit('hrs'), { name: 'hour', seconds: 3600 });
    assert.deepEqual(sequencerUnit('day'), { name: 'day', seconds: 86400 });
    assert.deepEqual(sequencerUnit('weeks'), { name: 'week', seconds: 604800 });
    assert.equal(sequencerUnit('fortnight'), null);
    assert.equal(sequencerUnit(undefined), null);
});

test('a value snaps to the step, and to an edge within reach', () => {
    assert.equal(sequencerSnap(7.4, 5), 5);
    assert.equal(sequencerSnap(7.6, 5), 10);
    assert.equal(sequencerSnap(7.3, 0.5), 7.5);
    assert.equal(sequencerSnap(9.4, 5, [10], 1), 10, 'an edge within reach beats the grid');
    assert.equal(sequencerSnap(9.4, 1, [10], 0.2), 9, 'an edge out of reach is ignored');
    assert.equal(sequencerSnap(9.4, 5, [10, 9.2], 1), 9.2, 'the nearest edge wins');
});

test('a page\'s items are cleaned: dangling, self and cyclic partners go, ids stay unique', () => {
    const clean = sequencerClean([
        { id: 'a', lane: 'x', start: -5, duration: 4, with: 'zzz' },
        { id: 'b', lane: 'x', start: 1, duration: 2, with: 'b' },
        { id: 'c', lane: 'x', start: /** @type {any} */ ('3'), duration: /** @type {any} */ ('two'), with: 'd' },
        { id: 'd', lane: 'x', start: 3, duration: 1, with: 'c' },
        { id: 'a', lane: 'y', start: 9, duration: 9 },
        { lane: 'x' },
    ]);
    assert.deepEqual(clean.map((i) => i.id), ['a', 'b', 'c', 'd']);
    assert.equal(clean[0].start, 0, 'no start before 0');
    assert.equal(clean[0].with, null);
    assert.equal(clean[1].with, null);
    assert.equal(clean[2].start, 3);
    assert.equal(clean[2].duration, 0);
    assert.ok(!(clean[2].with === 'd' && clean[3].with === 'c'), 'a cycle is broken');
});

test('a group is everything linked, in both directions', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'y', 0, 5, { with: 'a' }), it('c', 'z', 0, 5, { with: 'b' }), it('d', 'x', 9, 2)];
    assert.deepEqual([...sequencerGroup(items, 'c')].sort(), ['a', 'b', 'c']);
    assert.deepEqual([...sequencerGroup(items, 'd')], ['d']);
});

test('a move snaps to the grid and never starts before 0', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'move', start: 33.4 }, { step: 5, edges: false });
    assert.deepEqual(at(p, 'plate'), ['pasta', 35, 5]);
    assert.deepEqual(p.changed, ['plate']);
    const early = sequencerPlan([it('a', 'x', 5, 5)], { id: 'a', kind: 'move', start: -30 }, { step: 1 });
    assert.deepEqual(at(early, 'a'), ['x', 0, 5]);
});

test('a move snaps to another item\'s edge, by its start or by its end', () => {
    const items = [it('a', 'x', 0, 10), it('b', 'y', 20, 6)];
    const start = sequencerPlan(items, { id: 'b', kind: 'move', start: 10.4 }, { step: 5, reach: 0.5 });
    assert.equal(at(start, 'b')[1], 10, 'its start on the other end');
    const end = sequencerPlan(items, { id: 'b', kind: 'move', start: 4.2 }, { step: 5, reach: 0.5, overlap: 'allow' });
    assert.equal(at(end, 'b')[1], 4, 'its end (4 + 6) on the edge at 10');
});

test('the window\'s end stops a move; the item keeps its length', () => {
    const p = sequencerPlan([it('a', 'x', 0, 10)], { id: 'a', kind: 'move', start: 95 }, { step: 1, max: 60 });
    assert.deepEqual(at(p, 'a'), ['x', 50, 10]);
});

test('moving one of a group moves them all by the same amount, the lane is the item\'s own', () => {
    const items = [it('a', 'pasta', 10, 5), it('b', 'sauce', 10, 8, { with: 'a' }), it('c', 'sauce', 30, 4)];
    const p = sequencerPlan(items, { id: 'b', kind: 'move', start: 15 }, { step: 1 });
    assert.deepEqual(at(p, 'a'), ['pasta', 15, 5]);
    assert.deepEqual(at(p, 'b'), ['sauce', 15, 8]);
    assert.deepEqual(at(p, 'c'), ['sauce', 30, 4]);
    assert.deepEqual(p.changed.sort(), ['a', 'b']);
    const lane = sequencerPlan(items, { id: 'b', kind: 'move', lane: 'pasta' }, { step: 1, overlap: 'allow' });
    assert.deepEqual(at(lane, 'b'), ['pasta', 10, 8]);
    assert.deepEqual(at(lane, 'a'), ['pasta', 10, 5], 'a lane change alone moves nobody else');
});

test('a group stops at 0 as a whole', () => {
    const items = [it('a', 'x', 2, 5), it('b', 'y', 6, 5, { with: 'a' })];
    const p = sequencerPlan(items, { id: 'b', kind: 'move', start: 0 }, { step: 1 });
    assert.deepEqual([at(p, 'a')[1], at(p, 'b')[1]], [0, 0].map((_, i) => [0, 4][i]), 'delta -6 is cut to -2');
});

test('refuse: an overlap in a lane does not happen, and the blocker is named', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'move', start: 12 }, { step: 1, overlap: 'refuse' });
    assert.equal(p.ok, false);
    assert.equal(p.reason, 'overlap');
    assert.equal(p.blocker, 'cook');
    assert.equal(p.changed.length, 0);
    const touching = sequencerPlan(recipe(), { id: 'plate', kind: 'move', start: 18 }, { step: 1, overlap: 'refuse' });
    assert.equal(touching.ok, true, 'touching edges are not an overlap');
});

test('refuse also holds a lane change: a bar cannot land on another', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'move', lane: 'sauce', start: 20 }, { step: 1, overlap: 'refuse' });
    assert.equal(p.ok, false);
    assert.equal(p.blocker, 'simmer');
});

test('allow: items overlap and take rows of their lane', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'move', start: 12 }, { step: 1, overlap: 'allow' });
    assert.equal(p.ok, true);
    const { rows, counts } = sequencerRows(p.items, ['pasta', 'sauce']);
    assert.equal(counts.get('pasta'), 2);
    assert.equal(counts.get('sauce'), 1);
    assert.notEqual(rows.get('plate'), rows.get('cook'));
    assert.equal(rows.get('boil'), rows.get('cook'));
});

test('push: what is in the way moves later, as far as it must', () => {
    const items = [it('a', 'x', 0, 10), it('b', 'x', 10, 10), it('c', 'x', 20, 10), it('d', 'x', 40, 5)];
    const p = sequencerPlan(items, { id: 'a', kind: 'resize-end', end: 15 }, { step: 1, overlap: 'push' });
    assert.equal(p.ok, true);
    assert.deepEqual([at(p, 'b')[1], at(p, 'c')[1], at(p, 'd')[1]], [15, 25, 40]);
    assert.deepEqual(p.pushed.sort(), ['b', 'c']);
    assert.deepEqual(p.changed.sort(), ['a', 'b', 'c']);
});

test('push takes what runs alongside the pushed item with it', () => {
    const items = [it('a', 'x', 0, 10), it('b', 'x', 10, 10), it('p', 'y', 10, 4, { with: 'b' })];
    const p = sequencerPlan(items, { id: 'a', kind: 'resize-end', end: 14 }, { step: 1, overlap: 'push' });
    assert.deepEqual([at(p, 'b')[1], at(p, 'p')[1]], [14, 14]);
});

test('push does not jump a bar over one that starts before it', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'move', start: 12 }, { step: 1, overlap: 'push' });
    assert.equal(p.ok, false, 'dropped inside cook (8-18): cook starts before, so the drop is refused');
    assert.equal(p.blocker, 'cook');
});

test('push: a move that lands before an item pushes it past', () => {
    const items = [it('a', 'x', 20, 5), it('b', 'x', 0, 5)];
    const p = sequencerPlan(items, { id: 'b', kind: 'move', start: 18 }, { step: 1, overlap: 'push' });
    assert.equal(p.ok, true);
    assert.equal(at(p, 'b')[1], 18);
    assert.equal(at(p, 'a')[1], 23);
});

test('push refuses when the pushed item runs alongside the one being moved', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'x', 5, 5, { with: 'm' }), it('m', 'y', 5, 5)];
    const p = sequencerPlan(items, { id: 'a', kind: 'resize-end', end: 8 }, { step: 1, overlap: 'push' });
    assert.equal(p.ok, true, 'b and m are not the mover; both move');
    const own = [it('m', 'x', 0, 5), it('f', 'y', 0, 5, { with: 'm' }), it('o', 'x', 5, 5, { with: 'f' })];
    const q = sequencerPlan(own, { id: 'm', kind: 'resize-end', end: 8 }, { step: 1, overlap: 'push' });
    assert.equal(q.ok, false, 'o runs alongside f, which runs alongside the mover: it cannot be pushed away from it');
});
