// Guards for Kenny's two rejections of research/ux-parts-1101 round 1 (2026-11-01: chips-narrow "the phone version is
// unwatchable", auto-refresh-form "the phone version is unusable, the options ... on their own line and maybe even
// scrollable"). The decisions are pure, so no browser is needed.
//
// Run: node --test gates/narrow-phone.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balanceTracks, foldsToMenu, narrowAt } from '../js/segmented/fit.js';
import { centreBy, narrowFor } from '../js/auto-refresh/narrow.js';

const REM = 16;
const FOLD_AT = 30 * REM;

test('a chip group is narrow by the room around it, not by a filter slot squeezed beside the search', () => {
    // Round 1 read the slot: 0 px beside the search in a 364 px toolbar. The toolbar's width decides.
    assert.equal(narrowAt(364, FOLD_AT), true);
    assert.equal(narrowAt(975, FOLD_AT), false);
    assert.equal(narrowAt(0, FOLD_AT), false, 'a room not laid out yet is never narrow');
    assert.equal(narrowAt(364, 0), false, '`none` never folds');
});

test('a narrow group stays a grid of whole chips unless the page asks for the menu', () => {
    assert.equal(foldsToMenu({ narrow: true, fold: null, tri: false, rows: 3 }), false);
    assert.equal(foldsToMenu({ narrow: true, fold: 'grid', tri: false, rows: 3 }), false);
    assert.equal(foldsToMenu({ narrow: true, fold: 'menu', tri: false, rows: 3 }), true);
    assert.equal(foldsToMenu({ narrow: true, fold: 'menu', tri: true, rows: 3 }), false, 'a three-way group never folds');
    assert.equal(foldsToMenu({ narrow: true, fold: 'menu', tri: false, rows: 1 }), false, 'one row needs no menu');
    assert.equal(foldsToMenu({ narrow: false, fold: 'menu', tri: false, rows: 3 }), false);
});

test("six filters in a phone's row lie as three full rows of two, never a chip alone", () => {
    // Medicine Cabinet: widest chip "Switched off 4", 132 px; a 364 px row, 8 px gap.
    assert.deepEqual(balanceTracks(6, 132, 364, 8), { cols: 2, rows: 3 });
    assert.deepEqual(balanceTracks(5, 132, 364, 8), { cols: 2, rows: 3 });
});

test('the refresh bar without its own line folds to two rows under 30rem of its own width', () => {
    const at = (/** @type {number} */ width, /** @type {Partial<Parameters<typeof narrowFor>[0]>} */ more = {}) => narrowFor({ lineOff: true, inFormGrid: false, stack: 'auto', width, rem: REM, ...more });
    assert.equal(at(364), true);
    assert.equal(at(316), true);
    assert.equal(at(975), false);
    assert.equal(at(0), false);
    assert.equal(at(975, { stack: 'always' }), true);
    assert.equal(at(364, { stack: 'never' }), false);
    assert.equal(at(364, { lineOff: false }), false, 'the approved bar keeps its own fold');
    assert.equal(at(364, { inFormGrid: true }), false, 'a form grid folds on its own width');
});

test('the current choice is brought to the middle of its scrolling row', () => {
    // A 316 px row from x 37; "Every 5 min" at x 420, 90 px wide: scroll 270 px so it stands at 150 to 240 of the row.
    assert.equal(centreBy(37, 316, 420, 90), 270);
    assert.equal(centreBy(0, 300, 0, 60) < 0, true, 'the first choice asks for no scroll; the browser clamps it to 0');
});
