// Repository paths, the tag map and theme list readers, and the git helper.

import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export const TESTS = join(ROOT, 'tests');

/** @returns {any} the map */
export const loadMap = () => JSON.parse(readFileSync(join(TESTS, 'tags.json'), 'utf8'));

/** @returns {string[]} */
export const themeNames = () => JSON.parse(readFileSync(join(ROOT, 'themes/order.json'), 'utf8'));

/** @param {string} css @returns {string} the stylesheet with its comments blanked, line breaks kept */
export const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** @param {string[]} args @returns {string} */
export const git = (args) =>
    execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });

// ─── Reading the tests ─────────────────────────────────────────────────────
