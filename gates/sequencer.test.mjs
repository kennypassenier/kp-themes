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
    sequencerApplyKey,
    sequencerClampZoom,
    sequencerClean,
    sequencerGroup,
    sequencerKey,
    sequencerLink,
    sequencerPlan,
    sequencerRows,
    sequencerSnap,
    sequencerTicks,
    sequencerTotalOf,
    sequencerUnit,
    sequencerUnlink,
    sequencerWindow,
} from '../js/sequencer.js';

/** @param {string} id @param {string} lane @param {number} start @param {number} duration @param {object} [more] */
const it = (id, lane, start, duration, more = {}) => ({ id, label: id, lane, start, duration, with: null, ...more });
/** The values a plan left, by id. @param {{ items: any[] }} plan @param {string} id */
const at = (plan, id) => {
    const i = plan.items.find((x) => x.id === id);
    return [i.lane, i.start, i.duration];
};

/** Pasta: boil 0-8, cook 8-18, plate 18-23. Sauce: chop 0-10, simmer 10-40. */
const recipe = () => [
    it('boil', 'pasta', 0, 8),
    it('cook', 'pasta', 8, 10),
    it('plate', 'pasta', 18, 5),
    it('chop', 'sauce', 0, 10),
    it('simmer', 'sauce', 10, 30),
];

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

test('resize end: snaps, keeps at least one step, stops at the window', () => {
    const p = sequencerPlan(recipe(), { id: 'plate', kind: 'resize-end', end: 31.2 }, { step: 5, edges: false });
    assert.deepEqual(at(p, 'plate'), ['pasta', 18, 12], 'the end 31.2 goes to 30');
    const small = sequencerPlan(recipe(), { id: 'plate', kind: 'resize-end', end: 18 }, { step: 5, edges: false });
    assert.deepEqual(at(small, 'plate'), ['pasta', 18, 5], 'never under one step');
    const capped = sequencerPlan(recipe(), { id: 'plate', kind: 'resize-end', end: 99 }, { step: 1, max: 30 });
    assert.equal(at(capped, 'plate')[2], 12);
});

test('resize start: the start moves, the end stays, a group follows', () => {
    const items = [it('a', 'x', 10, 10), it('b', 'y', 10, 6, { with: 'a' })];
    const p = sequencerPlan(items, { id: 'a', kind: 'resize-start', start: 12 }, { step: 1 });
    assert.deepEqual(at(p, 'a'), ['x', 12, 8]);
    assert.deepEqual(at(p, 'b'), ['y', 12, 4]);
    const tooFar = sequencerPlan(items, { id: 'a', kind: 'resize-start', start: 99 }, { step: 1 });
    assert.deepEqual(at(tooFar, 'b'), ['y', 15, 1], 'the shortest of the group keeps one step');
    assert.deepEqual(at(tooFar, 'a'), ['x', 15, 5]);
    const before = sequencerPlan(items, { id: 'a', kind: 'resize-start', start: -4 }, { step: 1 });
    assert.equal(at(before, 'a')[1], 0);
    assert.equal(at(before, 'a')[2], 20, 'the end stayed at 20');
});

test('a locked item (or a group with one) cannot be edited', () => {
    const items = [it('a', 'x', 0, 5, { locked: true }), it('b', 'y', 0, 5, { with: 'a' })];
    assert.equal(sequencerPlan(items, { id: 'b', kind: 'move', start: 3 }).reason, 'locked');
    assert.equal(sequencerPlan(items, { id: 'a', kind: 'resize-end', end: 9 }).reason, 'locked');
});

test('an unknown lane is refused, and so is any lane when lanes are fixed', () => {
    const items = recipe();
    assert.equal(sequencerPlan(items, { id: 'plate', kind: 'move', lane: 'oven' }, { lanes: ['pasta', 'sauce'] }).reason, 'lane');
    assert.equal(sequencerPlan(items, { id: 'plate', kind: 'move', lane: 'sauce', start: 60 }, { laneMove: false }).reason, 'lane');
});

test('a plan never changes what it was given', () => {
    const items = recipe();
    const frozen = JSON.stringify(items);
    sequencerPlan(items, { id: 'cook', kind: 'move', start: 40 }, { overlap: 'push' });
    sequencerLink(items, 'plate', 'chop');
    assert.equal(JSON.stringify(items), frozen);
});

test('link: the item and what runs alongside it move to the partner\'s start', () => {
    const items = [it('a', 'sauce', 10, 5), it('b', 'pasta', 30, 4), it('c', 'bread', 30, 2, { with: 'b' })];
    const p = sequencerLink(items, 'b', 'a', { step: 1 });
    assert.equal(p.ok, true);
    assert.equal(p.items.find((i) => i.id === 'b')?.with, 'a');
    assert.deepEqual([at(p, 'b')[1], at(p, 'c')[1]], [10, 10]);
    assert.deepEqual(p.changed.sort(), ['b', 'c']);
});

test('link: a cycle, itself and unknown ids are refused; an overlap follows the rule', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'y', 0, 5, { with: 'a' }), it('c', 'z', 0, 5, { with: 'b' })];
    assert.equal(sequencerLink(items, 'a', 'c').reason, 'cycle');
    assert.equal(sequencerLink(items, 'a', 'a').reason, 'unknown');
    assert.equal(sequencerLink(items, 'a', 'nope').reason, 'unknown');
    const lane = [it('p', 'x', 0, 10), it('q', 'x', 20, 10), it('r', 'y', 50, 4)];
    const refused = sequencerLink(lane, 'q', 'r', { overlap: 'refuse', step: 1 });
    assert.equal(refused.ok, true, 'q moves to 50 in its own lane: no overlap');
    const blocked = sequencerLink([it('p', 'x', 0, 10), it('q', 'x', 20, 10), it('r', 'y', 5, 4)], 'q', 'r', { overlap: 'refuse' });
    assert.equal(blocked.ok, false);
    assert.equal(blocked.blocker, 'p');
});

test('unlink lets an item run on its own and moves nothing', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'y', 0, 5, { with: 'a' })];
    const p = sequencerUnlink(items, 'b');
    assert.equal(p.items.find((i) => i.id === 'b')?.with, null);
    assert.deepEqual(p.changed, ['b']);
    assert.deepEqual(sequencerUnlink(items, 'a').changed, []);
});

test('keys: arrows move, Shift resizes the end, Ctrl+Shift the start, Alt changes lane, Enter and Escape end', () => {
    /** @param {string} key @param {object} [mods] */
    const k = (key, mods = {}) => sequencerKey({ key, ...mods }, { step: 5 });
    assert.deepEqual(k('ArrowRight'), { kind: 'move', by: 5 });
    assert.deepEqual(k('ArrowLeft'), { kind: 'move', by: -5 });
    assert.deepEqual(k('ArrowRight', { ctrlKey: true }), { kind: 'move', by: 50 });
    assert.deepEqual(k('PageUp'), { kind: 'move', by: -50 });
    assert.deepEqual(k('ArrowRight', { shiftKey: true }), { kind: 'resize-end', by: 5 });
    assert.deepEqual(k('ArrowLeft', { shiftKey: true }), { kind: 'resize-end', by: -5 });
    assert.deepEqual(k('ArrowRight', { shiftKey: true, ctrlKey: true }), { kind: 'resize-start', by: 5 });
    assert.deepEqual(k('ArrowUp', { altKey: true }), { kind: 'lane', by: -1 });
    assert.deepEqual(k('ArrowDown', { altKey: true }), { kind: 'lane', by: 1 });
    assert.equal(k('ArrowLeft', { altKey: true }), null, 'Alt+Left is the browser\'s Back');
    assert.deepEqual(k('Enter'), { kind: 'drop' });
    assert.deepEqual(k(' '), { kind: 'drop' });
    assert.deepEqual(k('Escape'), { kind: 'cancel' });
    assert.equal(k('a'), null);
    assert.deepEqual(sequencerKey({ key: 'ArrowRight' }, { step: 1, rtl: true }), { kind: 'move', by: -1 }, 'right to left swaps the arrows');
});

test('keyboard: one step on the grid; an off-grid start lands on the grid first', () => {
    const items = [it('a', 'x', 7.3, 5), it('b', 'x', 40, 5)];
    const opt = { step: 5, lanes: ['x', 'y'] };
    const fwd = sequencerApplyKey(items, 'a', { kind: 'move', by: 5 }, opt);
    assert.equal(at(fwd, 'a')[1], 10);
    const back = sequencerApplyKey(items, 'a', { kind: 'move', by: -5 }, opt);
    assert.equal(at(back, 'a')[1], 5);
    const end = sequencerApplyKey(items, 'a', { kind: 'resize-end', by: 5 }, opt);
    assert.deepEqual(at(end, 'a'), ['x', 7.3, 7.7], 'the end 12.3 goes to 15');
    const start = sequencerApplyKey(items, 'a', { kind: 'resize-start', by: -5 }, opt);
    assert.deepEqual(at(start, 'a'), ['x', 5, 7.3]);
});

test('keyboard: the start, the lanes\' ends and the neighbours say no', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'x', 5, 5), it('c', 'y', 20, 5)];
    const opt = { step: 5, lanes: ['x', 'y'] };
    assert.equal(sequencerApplyKey(items, 'a', { kind: 'move', by: -5 }, opt).reason, 'edge');
    assert.equal(sequencerApplyKey(items, 'a', { kind: 'lane', by: -1 }, opt).reason, 'edge');
    assert.equal(sequencerApplyKey(items, 'c', { kind: 'lane', by: 1 }, opt).reason, 'edge');
    assert.equal(sequencerApplyKey(items, 'a', { kind: 'move', by: 5 }, opt).reason, 'overlap');
    assert.equal(sequencerApplyKey(items, 'a', { kind: 'resize-end', by: -5 }, opt).reason, 'edge', 'already one step long');
    const lane = sequencerApplyKey(items, 'a', { kind: 'lane', by: 1 }, opt);
    assert.deepEqual(at(lane, 'a'), ['y', 0, 5]);
});

test('keyboard pushes with the push rule and reports what it moved', () => {
    const items = [it('a', 'x', 0, 5), it('b', 'x', 5, 5)];
    const p = sequencerApplyKey(items, 'a', { kind: 'resize-end', by: 5 }, { step: 5, overlap: 'push', lanes: ['x'] });
    assert.equal(p.ok, true);
    assert.deepEqual(p.pushed, ['b']);
    assert.equal(at(p, 'b')[1], 10);
});

test('the total is the end of the last item', () => {
    assert.equal(sequencerTotalOf(recipe()), 40);
    assert.equal(sequencerTotalOf([]), 0);
});

test('the window holds the plan with room, in whole steps, and never under the minimum', () => {
    assert.equal(sequencerWindow(40, 0, 5), 50);
    assert.equal(sequencerWindow(0, 0, 5), 10);
    assert.equal(sequencerWindow(40, 90, 5), 90);
    assert.equal(sequencerWindow(12, 0, 1), 15);
});

test('the axis picks a step that leaves room for the labels, in any unit', () => {
    const min = sequencerTicks(60, 720, 60);
    assert.equal(min.step, 10, 'ten labels of 72 px fit; 10 minutes');
    assert.deepEqual(min.values, [0, 10, 20, 30, 40, 50, 60]);
    const narrow = sequencerTicks(60, 150, 60);
    assert.equal(narrow.step, 30);
    const hours = sequencerTicks(8, 600, 3600);
    assert.equal(hours.step, 1, 'a step of 3600 s in an hour unit is 1');
    const days = sequencerTicks(14, 600, 86400);
    assert.equal(days.step, 2);
    const seconds = sequencerTicks(30, 600, 1);
    assert.equal(seconds.step, 5);
});

test('the zoom stays inside its limits', () => {
    assert.equal(sequencerClampZoom(0.1), 0.5);
    assert.equal(sequencerClampZoom(99), 16);
    assert.equal(sequencerClampZoom(1.2345), 1.23);
    assert.equal(sequencerClampZoom(Number.NaN), 1);
});
