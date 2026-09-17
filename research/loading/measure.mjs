// Shared measurement helpers for the three loading prototypes.
//
// Every number in research/loading/README.md comes through here: raw
// bytes are Buffer.byteLength, gzip is node:zlib at its default level
// (the same zlib gates/generate-min.mjs prints with), and "min" is
// esbuild's minifier — the one dist/ is built with — so a per-theme or
// per-hook file is measured the way the package already measures itself.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import * as esbuild from 'esbuild';

/** The repository root, as a URL. */
export const ROOT = new URL('../../', import.meta.url);
/** Where the generated samples land. */
export const OUT = new URL('out/', import.meta.url);

export const bytes = (/** @type {string} */ s) => Buffer.byteLength(s);
export const gz = (/** @type {string} */ s) => gzipSync(s).length;

/** @param {string} rel repository-relative */
export const read = (rel) => readFileSync(new URL(rel, ROOT), 'utf8');

/** @param {URL | string} target @param {string} content @returns {string} the path written */
export function write(target, content) {
    const path = typeof target === 'string' ? target : fileURLToPath(target);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    return path;
}

/** @param {string} css */
export async function minCss(css) {
    return (await esbuild.transform(css, { loader: 'css', minify: true })).code;
}

/** @param {string} js */
export async function minJs(js) {
    return (await esbuild.transform(js, { loader: 'js', minify: true, target: 'es2022', format: 'esm' })).code;
}

/** @typedef {{ raw: number, rawGz: number, min: number, minGz: number }} Sizes */

/**
 * The four numbers a file gets: authored and minified, each raw and gzipped.
 *
 * @param {string} text
 * @param {'css' | 'js'} kind
 * @returns {Promise<Sizes>}
 */
export async function sizes(text, kind) {
    const min = kind === 'css' ? await minCss(text) : await minJs(text);
    return { raw: bytes(text), rawGz: gz(text), min: bytes(min), minGz: gz(min) };
}

/** @param {Sizes[]} list @returns {Sizes} */
export function sum(list) {
    return list.reduce((a, s) => ({ raw: a.raw + s.raw, rawGz: a.rawGz + s.rawGz, min: a.min + s.min, minGz: a.minGz + s.minGz }), {
        raw: 0,
        rawGz: 0,
        min: 0,
        minGz: 0,
    });
}

export const kb = (/** @type {number} */ n) => `${(n / 1024).toFixed(1)} kB`;
/** One table cell: authored raw / gz, then minified raw / gz. */
export const cell = (/** @type {Sizes} */ s) => `${kb(s.raw)} / ${kb(s.rawGz)} gz (min ${kb(s.min)} / ${kb(s.minGz)} gz)`;
/** The relative path prefix from a file under out/<dir>/ back to the repository root. */
export const toRoot = (/** @type {number} */ depth) => '../'.repeat(depth);
