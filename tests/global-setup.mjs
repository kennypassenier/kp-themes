// Bundles the React fixture before the browser tests run.
//
// esbuild rather than a bundler config: one call, no plugins, and the
// output is thrown away with the .build directory.

import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';

export default async function globalSetup() {
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
        'react-select',
        'react-held-60',
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
