// A research demo shows every variant the catalogue has of what it shows
// (2026-10-03: the signature toasts were approved from a demo that showed the
// plain and the success toast only; the destructive one, never shown, came out
// unreadable in five themes and was found by the release suite).
//
// For every demo listed under "Research to look at" that carries the review
// kit, each judged section (`data-review-item`) is read for the package
// components it uses (`kp-<name>` classes), and the catalogue pages are read
// for every modifier of those components (`kp-<name>--<variant>`). A modifier
// the catalogue shows and the section does not is reported. Archived demos are
// decided and left alone.
//
//   node gates/check-demo-variants.mjs [research/<topic>/demo.html …]
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (/** @type {string} */ path) => readFileSync(new URL(path, root), 'utf8');

const shell = read('catalogue/pages.js');
const open = (shell.split(/group:\s*'Research to look at'/)[1] ?? '').split(/group:\s*'/)[0];
// Demos named on the command line are checked instead (to try the check on a
// decided demo).
const named = process.argv.slice(2);
const demos = (named.length ? named : [...open.matchAll(/href:\s*'(research\/[^']+\.html)'/g)].map((m) => m[1])).filter((path) =>
    existsSync(new URL(path, root)),
);

/** Every `kp-<name>--<variant>` the catalogue pages show, per component. */
/** @type {Map<string, Set<string>>} */
const variants = new Map();
for (const file of readdirSync(new URL('catalogue/', root)).filter((f) => f.endsWith('.html'))) {
    for (const m of read(`catalogue/${file}`).matchAll(/\bkp-([a-z0-9]+(?:-[a-z0-9]+)*)--([a-z0-9]+(?:-[a-z0-9]+)*)\b/g)) {
        const set = variants.get(m[1]) ?? new Set();
        set.add(m[2]);
        variants.set(m[1], set);
    }
}

/** @type {string[]} */
const missing = [];
for (const demo of demos) {
    const html = read(demo);
    if (!/data-review=/.test(html)) continue;
    const sections = html.split(/(?=<section[^>]*data-review-item=)/).slice(1);
    for (const section of sections) {
        const id = /data-review-item="([^"]+)"/.exec(section)?.[1] ?? '?';
        const body = section.split('</section>')[0];
        const used = new Set([...body.matchAll(/\bkp-([a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])/g)].map((m) => m[1]));
        // The section's own component: the one named after the section (a
        // button inside a tooltip demo is scenery), or every one it uses when
        // none is; `data-review-components="a b"` names them outright.
        const listed = /data-review-components="([^"]+)"/.exec(section)?.[1]?.split(/\s+/);
        const own = [...used].filter((name) => name.includes(id));
        const components = listed ?? (own.length ? own : [...used]);
        for (const component of components) {
            for (const variant of variants.get(component) ?? []) {
                if (!body.includes(`kp-${component}--${variant}`)) missing.push(`${demo} [${id}]: kp-${component}--${variant}`);
            }
        }
    }
}

if (missing.length) {
    console.error(
        `${missing.length} variant(s) the catalogue shows are missing from a demo under review; show every variant before Kenny judges it:\n  ${missing.join('\n  ')}`,
    );
    process.exit(1);
}
console.log(`Demo variants: ${demos.length} demo(s) under review, every variant the catalogue shows is in them.`);
