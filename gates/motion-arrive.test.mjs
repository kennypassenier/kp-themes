// A repaint is not an arrival [port spec G, scope-143].
//
// Under `data-kp-arrive="new"` a box tells a live refresh that redraws its
// rows from content that is genuinely new: an added element whose parent
// lost, in the same batch of changes, an element with its key (or, without a
// key, one more element of its tag and class) is a repaint and stays still.
// The cases are the homelab dashboard's own (its test/sizemotion.test.js,
// moved here with the algorithm), plus the spec's G7 checks on plain records
// and the skeleton rule kp adds over the dashboard's version.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARRIVE_KEYS, repaintedIn } from '../js/motion.js';

/** @param {string} tag @param {string} cls @param {Record<string, string>} [a] @param {boolean} [skeleton] */
const el = (tag, cls, a = {}, skeleton = false) => ({
    nodeType: 1,
    tagName: tag,
    className: cls,
    id: a.id ?? '',
    getAttribute: (/** @type {string} */ n) => a[n] ?? null,
    matches: (/** @type {string} */ selector) => skeleton && selector.includes('kp-skeleton'),
    querySelector: () => null,
});
/** @param {unknown} target @param {unknown[]} removedNodes @param {unknown[]} addedNodes */
const batch = (target, removedNodes, addedNodes) => [{ type: 'childList', target, removedNodes, addedNodes }];
/** @param {string[]} keys @param {string} [attr] */
const rows = (keys, attr = 'data-kp-key') => keys.map((k) => el('LI', 'row', { [attr]: k }));

test('the stable id is read from data-kp-key, data-kp-row-key, then id [scope-143]', () => {
    assert.deepEqual([...ARRIVE_KEYS], ['data-kp-key', 'data-kp-row-key', 'id']);
});

test('a live repaint of the same rows does not arrive again; a new row does (the dashboard\'s case) [scope-143]', () => {
    const tbody = {};
    const old = [el('TR', 'sk-row', { 'data-key': 'a' }), el('TR', 'sk-row', { 'data-key': 'b' })];
    const fresh = [el('TR', 'sk-row', { 'data-key': 'a' }), el('TR', 'sk-row', { 'data-key': 'b' }), el('TR', 'sk-row', { 'data-key': 'c' })];
    const quiet = repaintedIn(batch(tbody, old, fresh), { keys: ['data-key', ...ARRIVE_KEYS] });
    assert.deepEqual([...quiet], fresh.slice(0, 2));
    // Without keys: as many as left, by tag and class (a KPI's unit).
    const units = [el('SMALL', ''), el('SMALL', '')];
    assert.deepEqual([...repaintedIn(batch({}, [el('SMALL', '')], units))], [units[0]]);
    // Content added where nothing left arrives.
    assert.equal(repaintedIn(batch({}, [], [el('LI', '')])).size, 0);
});

test('G7.1 the same five keys repainted: none arrives [scope-143]', () => {
    const fresh = rows(['a', 'b', 'c', 'd', 'e']);
    assert.equal(repaintedIn(batch({}, rows(['a', 'b', 'c', 'd', 'e']), fresh)).size, 5);
});

test('G7.2 keys a to f where a to e were: exactly f arrives [scope-143]', () => {
    const fresh = rows(['a', 'b', 'c', 'd', 'e', 'f']);
    const quiet = repaintedIn(batch({}, rows(['a', 'b', 'c', 'd', 'e']), fresh));
    assert.deepEqual(
        fresh.filter((n) => !quiet.has(n)),
        [fresh[5]],
    );
});

test('G7.3 three unkeyed rows replaced by four: exactly one arrives [scope-143]', () => {
    const div = () => el('DIV', 'row');
    const fresh = [div(), div(), div(), div()];
    assert.equal(fresh.filter((n) => !repaintedIn(batch({}, [div(), div(), div()], fresh)).has(n)).length, 1);
});

test('G7.4 the same five in reverse (a sort): none arrives [scope-143]', () => {
    const five = rows(['a', 'b', 'c', 'd', 'e']);
    assert.equal(repaintedIn(batch({}, five, [...five].reverse())).size, 5);
});

test('a renamed key is new, and the test is per parent [scope-143]', () => {
    const fresh = rows(['a', 'z']);
    assert.deepEqual([...repaintedIn(batch({}, rows(['a', 'b']), fresh))], [fresh[0]]);
    // The same key under another parent is not a repaint there.
    const records = [...batch('list-1', rows(['a']), []), ...batch('list-2', [], rows(['a']))];
    assert.equal(repaintedIn(records).size, 0);
});

test('what replaces a loading skeleton is not news [scope-143]', () => {
    const skeletons = [el('LI', 'kp-skeleton', {}, true), el('LI', 'kp-skeleton', {}, true)];
    const data = rows(['a', 'b', 'c']);
    assert.equal(repaintedIn(batch({}, skeletons, data)).size, 3);
});
