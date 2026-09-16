// The round gate's rule, without git [fix-46].
//
// Red first, 2026-09-16: before the gate, four commits landed while Kenny was
// judging and the 27 titanium blocks he had just approved came back.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { movesABlock, refusedByRound } from './check-round.mjs';

const changed = [
    'css/dark-register.css',
    'js/components.js',
    'components/sidenav.jsx',
    'catalogue/field.html',
    'themes/dark/tokens.json',
    'catalogue/verdicts.json',
    'catalogue/review.js',
    'docs/SCOPE.md',
    'gates/check-round.mjs',
    'tests/button.spec.mjs',
];

test('what moves a block, and what does not [fix-46]', () => {
    assert.deepEqual(changed.filter(movesABlock), [
        'css/dark-register.css',
        'js/components.js',
        'components/sidenav.jsx',
        'catalogue/field.html',
        'themes/dark/tokens.json',
    ]);
});

test('a closed round refuses nothing; an open one refuses what a reviewer would see move', () => {
    assert.deepEqual(refusedByRound(null, changed), []);
    assert.deepEqual(refusedByRound({ open: false }, changed), []);
    assert.deepEqual(refusedByRound({ open: true }, ['docs/SCOPE.md', 'catalogue/verdicts.json']), []);
    assert.deepEqual(refusedByRound({ open: true }, ['js/effects.js', 'docs/SCOPE.md']), ['js/effects.js']);
});
