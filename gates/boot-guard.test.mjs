// Tests for the one-runtime-per-page guard [dupe-1103].

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { BOOT_FIX, BOOT_MARKER, claimBoot, describeEntry } from '../js/boot-guard.js';

/**
 * Run `fn` with console.error captured.
 * @template T
 * @param {() => T} fn
 * @returns {{ result: T, seen: string[] }}
 */
function capture(fn) {
    /** @type {string[]} */
    const seen = [];
    const original = console.error;
    console.error = (...args) => seen.push(args.join(' '));
    try {
        return { result: fn(), seen };
    } finally {
        console.error = original;
    }
}

test('dupe-1103: the first copy claims the boot and logs nothing', () => {
    /** @type {Record<symbol, unknown>} */
    const scope = {};
    const { result, seen } = capture(() => claimBoot('https://x.test/dist/kp-themes.min.js', scope));
    assert.equal(result, true);
    assert.deepEqual(seen, []);
    assert.equal(scope[BOOT_MARKER], 'https://x.test/dist/kp-themes.min.js');
});

test('dupe-1103: a second copy is refused with one error naming both entries and the fix', () => {
    /** @type {Record<symbol, unknown>} */
    const scope = {};
    claimBoot('https://x.test/dist/kp-themes.min.js', scope);
    const { result, seen } = capture(() => claimBoot('https://x.test/dist/js/chunk-ABC123.js', scope));
    assert.equal(result, false);
    assert.equal(seen.length, 1);
    assert.match(seen[0], /\/dist\/kp-themes\.min\.js \(the full bundle\)/);
    assert.match(seen[0], /dist\/js\/ \(the chunked bundle/);
    assert.ok(seen[0].includes(BOOT_FIX));
    assert.equal(scope[BOOT_MARKER], 'https://x.test/dist/kp-themes.min.js', 'the first claim stands');
});

test('dupe-1103: a loose js/auto.js is named as such', () => {
    assert.match(describeEntry('http://127.0.0.1:4173/js/auto.js?v=3'), /^\/js\/auto\.js \(loose js\/auto\.js\)$/);
});

test('dupe-1103: only js/auto.js asks, so plain exports and a bundle without auto never claim', () => {
    const askers = readdirSync(new URL('../js/', import.meta.url), { recursive: true })
        .filter((name) => String(name).endsWith('.js'))
        .filter((name) => /\bclaimBoot\b/.test(readFileSync(new URL(`../js/${name}`, import.meta.url), 'utf8')))
        .map(String)
        .sort();
    assert.deepEqual(askers, ['auto.js', 'boot-guard.js']);
});
