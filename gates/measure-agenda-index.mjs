// Does catalogue/agenda-index.json say what the browser reads? For every research demo page in the repository (not
// only the ones on the Agenda, so the scanner meets every kind of markup there is), Firefox reads the page the way
// the Agenda did before the index (progress.js factsOf and fingerprintOf, over the served files) and this compares
// that with what gates/html-facts.mjs and gates/generate-agenda-index.mjs read from the files. It then compares the
// index on disk with the browser's reading for the demos it holds, and the blocks with open-pairs.js gatherBlocks.
// A measuring script, not a test: run by hand after a change to the scanner.
//
//   node gates/measure-agenda-index.mjs
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { firefox } from 'playwright';
import { serve } from './verdict-hashes.mjs';
import { factsFromHtml } from './html-facts.mjs';
/** @type {{ fingerprintFrom: (text: string, files: string[]) => Promise<string>, ownFilesOf: (links: string[], page: string | URL) => string[] }} */
const { fingerprintFrom, ownFilesOf } = await import(new URL('../research/_review/progress.js', import.meta.url).href);

const root = fileURLToPath(new URL('../', import.meta.url));
/** @type {string[]} */
const pages = [];
const walk = (/** @type {string} */ dir) => {
    for (const name of readdirSync(`${root}${dir}`)) {
        const path = `${dir}${name}`;
        if (statSync(`${root}${path}`).isDirectory()) walk(`${path}/`);
        else if (name.endsWith('.html')) pages.push(path);
    }
};
walk('research/');
const index = JSON.parse(readFileSync(`${root}catalogue/agenda-index.json`, 'utf8'));

const server = await serve(root, {
    'catalogue/__measure.html': `<!doctype html><meta charset="utf-8"><script type="module">
        import { factsOf, fingerprintOf } from '../research/_review/progress.js';
        import { gatherBlocks } from './open-pairs.js';
        window.__read = async (href) => {
            const url = new URL('../' + href, location.href);
            const html = await (await fetch(url, { cache: 'no-cache' })).text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return { facts: factsOf(doc), fingerprint: await fingerprintOf(url, html) };
        };
        window.__blocks = async () => (await gatherBlocks()).blocks.map((b) => [b.id, b.hash, b.fixed, b.title]);
        window.__ready = true;
    </script>`,
});
const browser = await firefox.launch();
const tab = await browser.newPage();
await tab.goto(`${server.base}catalogue/__measure.html`);
await tab.waitForFunction(() => /** @type {any} */ (window).__ready);

let same = 0;
let refused = 0;
const differ = [];
for (const href of pages) {
    const live = await tab.evaluate((h) => /** @type {any} */ (window).__read(h), href);
    const html = readFileSync(`${root}${href}`, 'utf8').replace(/^﻿/, '');
    const read = factsFromHtml(html);
    if (!read) {
        refused += 1;
        continue;
    }
    const page = new URL(href, 'http://index.invalid/');
    let fingerprint = null;
    try {
        const files = ownFilesOf(read.links, page).map((f) =>
            readFileSync(`${root}${decodeURIComponent(new URL(f).pathname.slice(1))}`, 'utf8').replace(/^﻿/, ''),
        );
        fingerprint = await fingerprintFrom(html, files);
    } catch {
        fingerprint = 'missing file';
    }
    const a = JSON.stringify(read.facts);
    const b = JSON.stringify(live.facts);
    if (a === b && fingerprint === live.fingerprint) same += 1;
    else differ.push({ href, facts: a === b ? 'same' : { node: read.facts, browser: live.facts }, fingerprint: [fingerprint, live.fingerprint] });
}
console.log(`scanner vs Firefox: ${pages.length} research pages, ${same} identical, ${refused} refused (read live), ${differ.length} different`);
for (const d of differ) console.log(JSON.stringify(d, null, 1).slice(0, 3000));

let indexSame = 0;
for (const [href, entry] of Object.entries(index.demos)) {
    const live = await tab.evaluate((h) => /** @type {any} */ (window).__read(h), href);
    if (JSON.stringify(live.facts) === JSON.stringify(entry.facts) && live.fingerprint === entry.fingerprint) indexSame += 1;
    else console.log(`index differs from Firefox: ${href}`);
}
console.log(`index vs Firefox: ${indexSame} of ${Object.keys(index.demos).length} demos identical`);

const blocks = await tab.evaluate(() => /** @type {any} */ (window).__blocks());
const blocksSame = JSON.stringify(blocks) === JSON.stringify(index.blocks?.list);
console.log(`blocks: ${blocks.length} in Firefox, ${index.blocks?.list.length ?? 0} in the index, ${blocksSame ? 'identical' : 'DIFFERENT'}`);
await browser.close();
await server.close();
process.exit(differ.length || indexSame !== Object.keys(index.demos).length || !blocksSame ? 1 : 0);
