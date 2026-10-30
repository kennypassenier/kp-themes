// Repository root URL and a reader relative to it.

import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);

export const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');
