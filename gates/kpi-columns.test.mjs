// A key-figure strip never leaves one tile alone on a row [scope-143].
//
// kpiColumns() picks the strip's column count from its allowed list by the
// strip's own width. The table is the spec's own (D7,
// research/dashboard-ports-2/README.md section 3: gap 16 px, smallest tile
// 160 px, allowed "all 3 2 1"); the same rules measured on a page are
// tests/kpi-columns.spec.mjs.
//
// Run: node --test gates/kpi-columns.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kpiColumns } from '../js/kpi.js';

test('every row of the D7 table, and no lone tile but where it spans [scope-143]', () => {
    /** tiles, strip width, columns, the last tile spans its row. @type {[number, number, number, boolean][]} */
    const D7 = [
        [5, 1400, 5, false],
        [4, 600, 2, false],
        [5, 700, 3, false],
        [7, 700, 3, true],
        [8, 700, 3, false],
        [5, 358, 2, true],
        [6, 358, 2, false],
        [1, 500, 1, false],
    ];
    for (const [n, width, columns, spanLast] of D7) {
        const got = kpiColumns(n, width, { allowed: 'all 3 2 1', minTilePx: 160, gapPx: 16 });
        assert.deepEqual(got, { columns, spanLast }, `${n} tiles in ${width} px`);
        assert.equal(n > 1 && n % got.columns === 1, got.spanLast, `${n} tiles in ${width} px: a lone tile spans`);
    }
});

test('the allowed list and the defaults ("all 3 2 1", 144 px tiles, 16 px gaps) [scope-143]', () => {
    assert.deepEqual(kpiColumns(4, 1200, { allowed: ['all', 2, 1], minTilePx: 160, gapPx: 16 }), { columns: 4, spanLast: false });
    assert.deepEqual(kpiColumns(3, 1200, { allowed: '4 4 3', minTilePx: 160, gapPx: 16 }), { columns: 3, spanLast: false });
    assert.deepEqual(kpiColumns(4, 600, { allowed: 'x', minTilePx: 160, gapPx: 16 }), { columns: 1, spanLast: false });
    // Too narrow for any count: the smallest allowed, the last spanning.
    assert.deepEqual(kpiColumns(3, 100, { allowed: '3 2', minTilePx: 160, gapPx: 16 }), { columns: 2, spanLast: true });
    assert.deepEqual(kpiColumns(5, 700), { columns: 3, spanLast: false });
    assert.deepEqual(kpiColumns(0, 700), { columns: 1, spanLast: false });
});
