// A menu button's fill signature and its keys [scope-143].
//
// The homelab port spec's checks B7 2 and 5, without a browser: a refill
// that shows the same as the menu does now is skipped (so `menuSignature`
// must change exactly when what the menu shows changes), and the keys an
// open menu answers (↓ ↑ wrapping, Home, End, a letter jumping to the next
// entry that starts with it) land on the entry the APG menu pattern names.
// The browser half (focus, Esc, Tab, the deferred refill) is
// tests/menu-button.spec.mjs.
//
// Run: node --test gates/menu-button.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menuKeyTarget, menuPlacement, menuSignature } from '../js/menu-button.js';

/** @type {import('../js/menu-button.js').MenuGroup[]} */
const MENU = [
    {
        group: 'Run',
        items: [
            { label: 'Restart the pumps', hint: 'Stop and start both pumps, one after the other', value: 'restart' },
            { label: 'Run a pressure test', hint: 'Close the ring main valve', disabled: 'Not while a field engineer is on site', value: 'test' },
        ],
    },
    { group: 'Records', items: [{ label: 'Archive this pump house…', hint: 'Its readings are kept', danger: true, value: 'archive' }] },
];

/** @param {unknown} value @returns {any} */
const clone = (value) => JSON.parse(JSON.stringify(value));

test('a fill that shows the same gives the same signature, and anything shown changes it (B7 5) [scope-143]', () => {
    assert.equal(menuSignature(MENU), menuSignature(clone(MENU)));
    assert.equal(menuSignature('loading'), 'loading');
    assert.notEqual(menuSignature([]), menuSignature('loading'));

    // …and anything the menu shows changes it.
    /** @type {[string, (m: any) => void][]} */
    const changes = [
        ['a heading', (m) => (m[0].group = 'Operate')],
        ['a label', (m) => (m[0].items[0].label = 'Restart pump 1')],
        ['a hint', (m) => (m[0].items[0].hint = 'Stop and start pump 1')],
        ['a reason going away', (m) => delete m[0].items[1].disabled],
        ['a reason', (m) => (m[0].items[1].disabled = 'Only for the shift lead')],
        ['the destructive mark', (m) => (m[1].items[0].danger = false)],
        ['a link', (m) => (m[1].items[0].href = '#archive')],
        ['a value', (m) => (m[0].items[0].value = 'restart-1')],
        ['an attribute', (m) => (m[0].items[0].attrs = { 'aria-keyshortcuts': 'R' })],
        ['the order', (m) => m[0].items.reverse()],
        ['an entry more', (m) => m[1].items.push({ label: 'Print the site sheet' })],
    ];
    const before = menuSignature(MENU);
    for (const [what, change] of changes) {
        const next = clone(MENU);
        change(next);
        assert.notEqual(menuSignature(next), before, `${what} left the signature as it was`);
    }
});

const LABELS = [
    'Restart the pumps',
    'Switch to the spare pump',
    'Run a pressure test',
    'Open the readings',
    'Recalibrate the sensors…',
    'Print the site sheet',
];

test('↓ ↑ wrap, Home and End go to the ends, a letter jumps to the next entry that starts with it, other keys are the page’s (B7 1, 2) [scope-143]', () => {
    assert.equal(menuKeyTarget({ key: 'ArrowDown' }, 0, LABELS), 1);
    assert.equal(menuKeyTarget({ key: 'ArrowDown' }, 5, LABELS), 0, '↓ on the last entry wraps to the first');
    assert.equal(menuKeyTarget({ key: 'ArrowUp' }, 0, LABELS), 5, '↑ on the first entry wraps to the last');
    assert.equal(menuKeyTarget({ key: 'ArrowUp' }, 3, LABELS), 2);
    assert.equal(menuKeyTarget({ key: 'Home' }, 4, LABELS), 0);
    assert.equal(menuKeyTarget({ key: 'End' }, 1, LABELS), 5);
    assert.equal(menuKeyTarget({ key: 'ArrowDown' }, -1, LABELS), 0, 'with no entry focused, ↓ goes to the first');

    assert.equal(menuKeyTarget({ key: 'r' }, 0, LABELS), 2, 'from Restart, r goes on to Run, not back to itself');
    assert.equal(menuKeyTarget({ key: 'r' }, 2, LABELS), 4);
    assert.equal(menuKeyTarget({ key: 'r' }, 4, LABELS), 0, 'past the last r it wraps to the first');
    assert.equal(menuKeyTarget({ key: 'R' }, 0, LABELS), 2, 'upper and lower case are one letter');
    assert.equal(menuKeyTarget({ key: 'p' }, -1, LABELS), 5);
    assert.equal(menuKeyTarget({ key: 'x' }, 0, LABELS), null, 'no entry starts with x: the focus stays');
    assert.equal(menuKeyTarget({ key: 'r' }, 0, ['Restart the pumps']), 0, 'the only match is the focused entry itself');

    assert.equal(menuKeyTarget({ key: ' ' }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'Enter' }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'Tab' }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'r', ctrlKey: true }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'r', metaKey: true }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'r', altKey: true }, 0, LABELS), null);
    assert.equal(menuKeyTarget({ key: 'ArrowDown' }, 0, []), null, 'an empty menu answers nothing');
});

test('an open menu lies whole on the screen: its other edge, over the button, or scrolling inside (Kenny 2026-10-05) [scope-143]', () => {
    const room = { left: 8, top: 108, right: 382, bottom: 792 };
    /** A button at x..x+80, y..y+36; the stylesheet's menu hangs under it at its end edge, 4 px down. @param {number} x @param {number} y @param {number} width */
    const at = (x, y, width, height = 300) => {
        const button = { left: x, right: x + 80, top: y, bottom: y + 36 };
        const menu = { left: x + 80 - width, right: x + 80, top: y + 40, bottom: y + 40 + height };
        return menuPlacement({ button, menu, height, gap: 4, room });
    };
    // Room on every side: the stylesheet's place stays.
    assert.deepEqual(at(300, 200, 280), { left: 100, top: 240, width: null, height: null, side: 'below' });
    // A button at the left edge (Kenny's case: the menu opened 226 px off the screen): its start edge.
    assert.equal(at(16, 200, 351).left, 16);
    // Neither edge fits: pushed inside the room.
    assert.equal(at(150, 200, 351).left, 8);
    // Wider than the room: the room's width.
    assert.deepEqual([at(16, 200, 500).left, at(16, 200, 500).width], [8, 374]);
    // No room under it: over the button.
    assert.deepEqual([at(300, 700, 280).side, at(300, 700, 280).top], ['above', 700 - 4 - 300]);
    // No room for all of it either side: the roomier side, at that side's height.
    const tall = at(300, 400, 280, 600);
    assert.deepEqual([tall.side, tall.height, tall.top], ['below', 792 - 440, 440]);
    const tallLow = at(300, 600, 280, 600);
    assert.deepEqual([tallLow.side, tallLow.height, tallLow.top], ['above', 600 - 4 - 108, 108]);
});
