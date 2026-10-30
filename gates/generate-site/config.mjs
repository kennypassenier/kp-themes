// Where the site is written, the theme order, and the lists the pages are built from.

import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { names as utilityNames } from '../generate-utilities.mjs';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export const OUT = join(ROOT, 'site');

/** @type {string[]} */
export const ORDER = JSON.parse(readFileSync(join(ROOT, 'themes/order.json'), 'utf8'));

export const UTILITY_COUNT = utilityNames().length;

// What the published site needs beside the pages this generator writes:
// the stylesheets and modules every page loads, the dist bundle they are
// also offered as, and the two page sets that are entries in the
// navigation -- the showcase and the ten example pages [AR22]. Declared
// here rather than in .github/workflows/pages.yml, because two lists of
// what the site consists of means the CI one ships. `--assets` prints
// it, one per line, and the workflow copies what it is told.
// `catalogue` since 2026-09-29: the component pages show the catalogue's
// blocks, and the few that need behaviour of their own (the pretend server,
// the toasts) get it from catalogue/demos.js.
export const ASSETS = ['css', 'js', 'dist', 'showcase', 'examples', 'fonts', 'catalogue'];

/** The six tokens a theme is recognised by, shown as chips beside its story. */
export const SWATCH_TOKENS = ['background', 'card', 'foreground', 'primary', 'muted-foreground', 'border'];

/** Where the review site publishes the theme portraits [scope-97]. */
export const REVIEW_SITE = 'https://kennypassenier.github.io/kp-themes/review/';
