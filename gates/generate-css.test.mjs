import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render } from './generate-css.mjs';

/** @type {Record<string, string>} */
const parts = { a: 'A\n', b: 'B\n', c: 'C\n', d: 'D\n' };
const part = (/** @type {string} */ n) => parts[n];

test('render joins strings, file items and groups in order', () => {
    assert.equal(render(['a', { file: 'b' }], part), 'A\nB\n');
});

test('render wraps a group in its open and close', () => {
    const items = [{ open: '@layer x {\n', files: ['a', { open: '@media m {\n', files: ['b', 'c'], close: '}\n' }, 'd'], close: '}\n' }];
    assert.equal(render(items, part), '@layer x {\nA\n@media m {\nB\nC\n}\nD\n}\n');
});

test('render nests groups at any depth', () => {
    const g = { open: '1{', files: [{ open: '2{', files: [{ open: '3{', files: ['a'], close: '}3' }], close: '}2' }], close: '}1' };
    assert.equal(render([g], part), '1{2{3{A\n}3}2}1');
});
