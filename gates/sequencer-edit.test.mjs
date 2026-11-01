// The editable sequencer's pure halves, second part [timeline-1029]: resizing, locks and lanes, a plan left as given, link and unlink, the keyboard,
// the total, the window, the axis and the zoom. The first part is gates/sequencer.test.mjs.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    sequencerApplyKey,
    sequencerClampZoom,
    sequencerKey,
    sequencerLink,
    sequencerPlan,
    sequencerTicks,
    sequencerTotalOf,
    sequencerUnlink,
    sequencerWindow,
} from '../js/sequencer.js';
import { it, at, recipe } from './sequencer-fixtures.mjs';

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
