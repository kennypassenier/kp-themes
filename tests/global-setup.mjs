// Bundles the React fixture before the browser tests run, and refuses a run
// that names a spec which does not exist [fix-44].
//
// esbuild rather than a bundler config: one call, no plugins, and the
// output is thrown away with the .build directory.

import { build } from 'esbuild';
import { mkdirSync, existsSync } from 'node:fs';
import process from 'node:process';

/**
 * The spec paths on the command line that are not files [fix-44].
 *
 * Playwright takes its arguments as filters: a run naming three files of
 * which one is misspelt runs the other two and says nothing. That is how
 * `tests/intros.spec.mjs` — a file that never existed — came back "19
 * passed" while the spec it stood for (`tests/catalogue-intros.spec.mjs`)
 * stayed red for two commits. A filter that looks like a path and is not
 * one is a typo, never an intention.
 * @param {string[]} argv
 */
export function missingSpecs(argv) {
    // An option's own value is not a path: `-g "the dialog.spec.mjs case"`.
    const TAKES_A_VALUE = new Set(['-g', '--grep', '--grep-invert', '--project', '--reporter', '--workers', '--timeout', '--repeat-each', '--shard']);
    const paths = argv.filter((arg, index) => !TAKES_A_VALUE.has(argv[index - 1]) && /^[^-].*\.spec\.mjs$/.test(arg));
    return paths.filter((path) => !existsSync(new URL(`../${path}`, import.meta.url)));
}

export default async function globalSetup() {
    const missing = missingSpecs(process.argv.slice(2));
    if (missing.length) {
        throw new Error(`no such spec file: ${missing.join(', ')} — a run that names a file it cannot find measures nothing [fix-44]`);
    }
    const dir = new URL('fixtures/.build/', import.meta.url);
    mkdirSync(dir, { recursive: true });
    for (const name of [
        'react-mount',
        'react-components',
        'react-tables',
        'react-datatable',
        'react-datatable-more',
        'examples-react',
        'react-button',
        'react-container',
        'react-dashboard',
        'react-nav-toggle',
        'react-sidenav',
        'react-switch',
        'react-alarm',
        'react-select',
        'react-held-60',
        'react-palette-nav',
        'react-nav-sticky',
        'react-nav-menu',
    ]) {
        await build({
            entryPoints: [new URL(`fixtures/${name}.jsx`, import.meta.url).pathname],
            outfile: new URL(`${name}.js`, dir).pathname,
            bundle: true,
            format: 'esm',
            jsx: 'automatic',
            logLevel: 'warning',
        });
    }
}
