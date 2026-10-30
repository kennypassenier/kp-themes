// What a block is made of, as numbers [scope-114, scope-116].
//
// Kenny, 2026-09-16: "Een component is de som van html+css+js+browserkeuze,
// daarop moet de hash gebaseerd zijn. Hoe het rendered kan mij geen fucking
// kloten schelen … Als ik iets goedkeur op 125% dan is het voor alle zoom
// levels goedgekeurd."
//
// And 2026-09-17, when the JavaScript split moved one digest over all of js/
// and so every one of the 3062 pairs: "alles, dus ook js code mag alleen
// meetellen als het relevant is voor de component zelf. Enkel dingen die de
// component zelf raken mogen in de hash verwerkt worden."
//
// So the code is digested per thing a block can use, not per folder:
//
//   families    every `kp-*` class family and `data-kp-*` attribute a
//               stylesheet names, each with a digest of the CSS lines whose
//               selector names it — `shared` for the package's stylesheets,
//               one per theme for that theme's register. A block pays for the
//               families its own markup carries.
//   modules     per module the loader attaches by selector (js/auto.js's
//               NEEDS), a digest of that one file and the selector it acts
//               through. A block pays for a module when its own markup
//               matches that selector, which is exactly when the page loads
//               it [scope-136].
//   components  per component in tests/tags.json, a digest of the modules
//               (js/, components/) the map assigns to it that the loader does
//               NOT attach by selector — helpers, the effects, the React
//               components — and the families those modules write that the
//               markup does not show (the boot screen effects.js draws). A
//               block pays for the components its families belong to.
//   base        the CSS lines that name no family (`:root`, bare elements,
//               keyframes) and the dictionary every component speaks from.
//   themes      per theme, its tokens and the register lines that name no
//               family.
//
// Left out on purpose: `js/auto.js`, the loader. It decides when a module
// arrives, not what a block is; tests/auto-lazy.spec.mjs proves every page
// that loads it ends up with the markup the eager loader of 6.1.0 left.
//
//   node gates/generate-code-version.mjs            write catalogue/code-version.json
//   node gates/generate-code-version.mjs --check    refuse when it is stale

import * as prettier from 'prettier';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { CODE_VERSION, root } from './generate-code-version/config.mjs';
import { codeVersion } from './generate-code-version/code-version.mjs';

export { CODE_VERSION, NOT_A_BLOCK_INPUT, MARKERS } from './generate-code-version/config.mjs';
export { withoutTheVersion } from './generate-code-version/sources.mjs';
export { familiesIn, bucketsOf, componentsOf } from './generate-code-version/families.mjs';
export { rightmostCompound, selectorList, ruleBucketsOf } from './generate-code-version/selectors.mjs';
export { codeVersion } from './generate-code-version/code-version.mjs';

async function main() {
    const file = new URL(CODE_VERSION, root);
    // Written as the formatter would write it, so `prettier --check .` and
    // `--check` here agree on one byte sequence.
    const options = (await prettier.resolveConfig(fileURLToPath(file))) ?? {};
    const wanted = await prettier.format(JSON.stringify(codeVersion()), { ...options, parser: 'json' });
    if (process.argv.includes('--check')) {
        const there = existsSync(file) ? readFileSync(file, 'utf8') : '';
        if (there !== wanted) {
            console.error(`${CODE_VERSION} is not what the code says [scope-116]; run node gates/generate-code-version.mjs`);
            process.exit(1);
        }
        const { rules, modules, components } = codeVersion();
        console.log(
            `code version: ${Object.keys(rules).length} rule buckets, ${Object.keys(modules).length} modules by selector, ${Object.keys(components).length} components, current.`,
        );
        return;
    }
    writeFileSync(fileURLToPath(file), wanted);
    console.log(`${CODE_VERSION}: written.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
