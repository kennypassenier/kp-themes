// Every public dist/js entry has a facade with exactly its export names [superset-1103; chassis-rs 03/11].
//
// dist/bundle/<entry>.js (gates/bundle-facades.mjs) lets a consumer serve one file, dist/kp-themes.min.js, in place of
// the ~330 of the split bundle by an import map. That only works when the facade's names are the entry's names: a
// missing one breaks an import, an extra one is a promise the entry does not make. There is no exception list.
// It also checks every name a facade takes from the bundle is a name the bundle exports.
//
// Usage: node gates/check-bundle-facades.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { entriesOf, readPackage } from './bundle-entries.mjs';
import { bundleNamesUsed, exportNames, FACADE_DIR } from './bundle-facades.mjs';
import { SPLIT_DIR } from './bundle-split.mjs';

const ROOT = new URL('../', import.meta.url).pathname;
const read = (/** @type {string} */ path) => readFileSync(`${ROOT}${path}`, 'utf8');

/**
 * The problems of one entry's facade, empty when it matches.
 * @param {string} out the entry's name
 * @param {Set<string>} bundleNames the names dist/kp-themes.min.js exports
 * @returns {string[]}
 */
export function problemsOf(out, bundleNames) {
    const entry = exportNames(read(`dist/${SPLIT_DIR}/${out}.js`));
    const facadeSource = read(`dist/${FACADE_DIR}/${out}.js`);
    const facade = exportNames(facadeSource);
    const problems = [];
    for (const name of entry) if (!facade.has(name)) problems.push(`dist/${FACADE_DIR}/${out}.js lacks \`${name}\`, which dist/js/${out}.js exports`);
    for (const name of facade) if (!entry.has(name)) problems.push(`dist/${FACADE_DIR}/${out}.js exports \`${name}\`, which dist/js/${out}.js does not`);
    for (const name of bundleNamesUsed(facadeSource)) if (!bundleNames.has(name)) problems.push(`dist/${FACADE_DIR}/${out}.js takes \`${name}\`, which dist/kp-themes.min.js does not export`);
    return problems;
}

function main() {
    const bundleNames = exportNames(read('dist/kp-themes.min.js'));
    const entries = entriesOf(readPackage(ROOT));
    const problems = entries.flatMap((e) => {
        try {
            return problemsOf(e.out, bundleNames);
        } catch (error) {
            return [`${e.out}: ${error instanceof Error ? error.message : error}`];
        }
    });
    for (const problem of problems) console.error(problem);
    if (problems.length) {
        console.error(`${problems.length} facade problem(s). Run \`npm run generate:bundle && npm run generate:min\`.`);
        process.exit(1);
    }
    console.log(`Bundle facades: all ${entries.length} entries of dist/js/ have a dist/${FACADE_DIR}/ facade with the same export names.`);
}

main();
