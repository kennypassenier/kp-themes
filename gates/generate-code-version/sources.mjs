// Reading and digesting source files, with the version field left out of the digest.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { root } from './config.mjs';

/**
 * The version is not a change to a block [scope-114]. `css/themes.css` and
 * `js/theme-registry.js` carry `--kp-themes-version` and `VERSION`; a release
 * that only raises the number must not send a pair back to Kenny.
 * @param {string | Buffer} text
 */
export const withoutTheVersion = (/** @type {string | Buffer} */ text) =>
    String(text).replace(/(?<![\w.])v?\d+\.\d+\.\d+(?:-[\w.]+)?(?![\w.])/g, '<version>');

/** @param {string[]} parts in a fixed order */
export const digest = (parts) => {
    const hash = createHash('sha256');
    for (const part of parts) hash.update(`${part}\n`);
    return hash.digest('hex').slice(0, 16);
};

export const files = (/** @type {string} */ dir, /** @type {(name: string) => boolean} */ keep) =>
    existsSync(new URL(dir, root))
        ? readdirSync(new URL(dir, root))
              .filter(keep)
              .sort()
              .map((name) => `${dir}${name}`)
        : [];

export const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');
