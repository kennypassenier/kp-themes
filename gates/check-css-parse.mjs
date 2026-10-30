// Every shipped stylesheet parses cleanly [comment-glob-1011].
//
// 10.1.0 shipped a comment in brutalism's register that held the path
// `research/character-*/`. The `*/` closed the comment early, the rest of
// the sentence became part of the next selector, and a browser silently
// dropped that rule: brutalism's tiles lost their hover. No engine warns.
// JobTracker found it, because Tailwind v4 refuses the whole file
// (`CssSyntaxError: Missing opening (`) and its build broke.
//
// The same sweep found a second one in cyberpunk: twenty-one empty
// entries in an `:is()` list (`button, , summary`), forgiven by browsers
// because `:is()` takes a forgiving list, refused by a strict parser.
//
// esbuild already minifies this package and reports every token it cannot
// place as a warning. This gate parses each shipped stylesheet with it and
// refuses on any warning at all, so what a strict consumer refuses is
// refused here first.
//
// Usage: node gates/check-css-parse.mjs

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import * as esbuild from 'esbuild';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** The folders the npm package ships stylesheets from (package.json "files"). */
const SHIPPED = ['css', 'dist', 'components', 'fx', 'js', 'hooks', 'themes'];

const files = execFileSync('git', ['ls-files', '--', ...SHIPPED.map((d) => `${d}/*.css`)], {
    cwd: ROOT,
    encoding: 'utf8',
})
    .split('\n')
    .filter(Boolean)
    // The part files under css/components/ and css/registers/ are slices of the generated stylesheets (a few end
    // inside a nested @media block); the generated files they build are parsed instead.
    .filter((f) => !f.startsWith('css/components/') && !f.startsWith('css/registers/'));

/** @type {string[]} */
const failures = [];

for (const file of files) {
    const { warnings } = esbuild.transformSync(readFileSync(ROOT + file, 'utf8'), {
        loader: 'css',
        logLevel: 'silent',
    });
    for (const w of warnings) {
        failures.push(
            `${file}:${w.location?.line ?? '?'}: ${w.text} — a strict CSS parser (Tailwind v4, lightningcss) refuses this file, and a browser drops the rule around it. Look for a comment closed early by a "*/" inside it, or an empty entry in a selector list.`,
        );
    }
}

if (failures.length > 0) {
    for (const f of failures) console.error(f);
    console.error(`\n${failures.length} parse warning(s) in shipped stylesheets.`);
    process.exit(1);
}

console.log(`CSS parse: ${files.length} shipped stylesheets parse without a warning [comment-glob-1011].`);
