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
import { ARRIVE_KEYS, repaintedIn, turnEntrances, turnLines, withCustomProperties } from '../js/motion.js';

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

test("a live repaint of the same rows does not arrive again; a new row does (the dashboard's case) [scope-143]", () => {
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

// A part that closes as its open played backwards, line by line (`--kp-lines: keep`).
test('turnLines: a part as long as its close keeps every line its own time and wait', () => {
    // Formal's dialog: the frame ruled in 400 ms, three lines 60 ms apart, 740 ms in all.
    const lines = [
        { delay: 0, duration: 400, end: 400 },
        { delay: 60, duration: 400, end: 460 },
        { delay: 120, duration: 400, end: 520 },
        { delay: 340, duration: 400, end: 740 },
    ];
    const turned = turnLines(lines, 740);
    assert.deepEqual(
        turned.map((one) => one.duration),
        [400, 400, 400, 400],
    );
    // The opening plays every line from its own wait; the close starts with the line that ended last.
    assert.deepEqual(
        turned.map((one) => one.openDelay),
        [0, 60, 120, 340],
    );
    assert.deepEqual(
        turned.map((one) => one.closeDelay),
        [340, 280, 220, 0],
    );
});

test('turnLines: a part longer or shorter than its close is scaled as a whole, times and waits alike', () => {
    const lines = [
        { delay: 0, duration: 500, end: 500 },
        { delay: 500, duration: 500, end: 1000 },
    ];
    const [first, second] = turnLines(lines, 500);
    assert.equal(first.duration, 250);
    assert.equal(second.openDelay, 250);
    assert.equal(first.closeDelay, 250);
    assert.equal(second.closeDelay, 0);
    // Frame t of the opening is frame (close - t) of the close: a line's open interval mirrors its close interval.
    for (const one of [first, second]) assert.equal(one.openDelay, 500 - (one.closeDelay + one.duration));
});

test('turnLines: no lines, or lines with no length, divide by nothing', () => {
    assert.deepEqual(turnLines([], 300), []);
    assert.deepEqual(turnLines([{ delay: 0, duration: 0, end: 0 }], 300), [{ duration: 0, openDelay: 0, closeDelay: 0 }]);
});

// An entrance replayed whole: the custom properties getKeyframes() may leave out.
test('withCustomProperties: keyframes with no custom property come back as they are', () => {
    /** @type {any[]} */ const read = [
        { offset: 0, computedOffset: 0, easing: 'linear', composite: 'auto', opacity: '0' },
        { offset: 1, computedOffset: 1, easing: 'linear', composite: 'auto', opacity: '1' },
    ];
    assert.equal(withCustomProperties(read, read), read);
});

test('withCustomProperties: an engine that reports the custom properties already is left alone', () => {
    /** @type {any[]} */ const frames = [
        { offset: 0, computedOffset: 0, easing: 'linear', composite: 'auto', '--x': '0', opacity: '1' },
        { offset: 1, computedOffset: 1, easing: 'linear', composite: 'auto', '--x': '1', opacity: '1' },
    ];
    assert.deepEqual(withCustomProperties(frames, frames), frames);
});

test('withCustomProperties: Chromium’s keyframes get the custom properties they lack, a frame that holds only one is added in its place', () => {
    // What Chromium reports for `0% { --x: 0 } 40% { --x: .2; opacity: .5 } 100% { --x: 1 }` and for `45% { --y: 7 }`.
    /** @type {any[]} */ const read = [
        { offset: 0, computedOffset: 0, easing: 'linear', composite: 'auto', opacity: '1' },
        { offset: 0.4, computedOffset: 0.4, easing: 'linear', composite: 'auto', opacity: '0.5' },
        { offset: 1, computedOffset: 1, easing: 'linear', composite: 'auto', opacity: '1' },
    ];
    /** @type {any[]} */ const own = [
        { offset: 0, computedOffset: 0, easing: 'linear', composite: 'auto', '--x': '0' },
        { offset: 0.4, computedOffset: 0.4, easing: 'linear', composite: 'auto', '--x': '0.2', opacity: '0.5' },
        { offset: 0.45, computedOffset: 0.45, easing: 'ease-in', composite: 'auto', '--y': '7' },
        { offset: 1, computedOffset: 1, easing: 'linear', composite: 'auto', '--x': '1' },
    ];
    const merged = /** @type {any[]} */ (withCustomProperties(read, own));
    assert.deepEqual(
        merged.map((frame) => frame.computedOffset),
        [0, 0.4, 0.45, 1],
        'in order of offset',
    );
    assert.deepEqual(
        merged.map((frame) => frame['--x']),
        ['0', '0.2', undefined, '1'],
    );
    assert.equal(merged[2]['--y'], '7');
    assert.equal(merged[2].easing, 'ease-in', 'the added frame is on the curve the copy gave it');
    assert.equal(merged[1].opacity, '0.5', 'ordinary properties stay what getKeyframes() reported');
    assert.equal(read[0]['--x'], undefined, 'the keyframes read are not written to');
});

test('turnEntrances: the shade behind a dialog takes the whole time and does not stretch the lines', () => {
    const kept = [
        { pseudoElement: null, line: { delay: 0, duration: 400, end: 400 } },
        { pseudoElement: '::before', line: { delay: 0, duration: 560, end: 560 } },
        { pseudoElement: null, line: { delay: 180, duration: 400, end: 580 } },
        { pseudoElement: '::backdrop', line: { delay: 0, duration: 400, end: 400 } },
    ];
    const turned = turnEntrances(kept, 580);
    // The lines span 580 ms and the close takes 580 ms: the lines keep their own time and wait.
    assert.deepEqual(turned[0], { duration: 400, openDelay: 0, closeDelay: 180 });
    assert.deepEqual(turned[2], { duration: 400, openDelay: 180, closeDelay: 0 });
    // The shade is no line: the whole close, no wait, whatever its own 400 ms.
    assert.deepEqual(turned[3], { duration: 580, openDelay: 0, closeDelay: 0 });
    // A shade longer than every line does not change the lines' scale.
    kept[3].line = { delay: 0, duration: 3000, end: 3000 };
    assert.deepEqual(turnEntrances(kept, 580)[0], turned[0]);
});
