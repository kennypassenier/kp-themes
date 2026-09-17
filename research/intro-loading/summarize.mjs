// Prints the tables of research/intro-loading/README.md from out/results-*.json.
//
//   node research/intro-loading/summarize.mjs
import { readFile } from 'node:fs/promises';

const rows = [];
for (const engine of ['chromium', 'firefox']) {
    try {
        rows.push(...JSON.parse(await readFile(new URL(`./out/results-${engine}.json`, import.meta.url), 'utf8')));
    } catch {
        // not measured
    }
}
const s = (ms) => (ms === undefined || ms === null ? '–' : (ms / 1000).toFixed(2));
const find = (q) => rows.filter((r) => Object.entries(q).every(([k, v]) => (v === undefined ? r[k] === undefined : r[k] === v)));

console.log('## A, today: resources against the intro (seconds from navigation start)\n');
console.log(
    '| engine | route | network | cache | theme | first paint | stylesheets | scripts (attach) | fonts ready | intro | page shown before intro | fallback font visible |',
);
console.log('| --- | --- | --- | --- | --- | --: | --: | --: | --: | --- | --: | --: |');
for (const r of find({ option: 'A', reduced: undefined, reload: undefined })) {
    const k = r.marks;
    const a = r.analysis;
    console.log(
        `| ${r.engine} | ${r.route} | ${r.net} | ${r.cache} | ${r.theme} | ${s(a.firstFrame)} | ${s(r.css.end)} | ${s(k.attach)} | ${s(k.fontsReady)} | ${k.arrivalStart !== undefined ? `${s(k.arrivalStart)}–${s(k.arrivalEnd)}` : `decipher ends ${s(k.headlineEnd)}`} | ${s(a.spans.pageBeforeIntro)} | ${s(a.spans.fallbackFont + a.spans.fallbackFontInIntro)} |`,
    );
}
console.log('\n## Options: what the reader waits for, and what flashes\n');
console.log(
    '| engine | route | network | cache | option | theme | first paint | page uncovered | page final | page before intro | fallback font visible | headline at rest before its reveal |',
);
console.log('| --- | --- | --- | --- | --- | --- | --: | --: | --: | --: | --: | --: |');
for (const r of rows.filter((x) => !x.reload && (x.option !== 'A' || ['synthwave', 'phantom', 'cyberpunk'].includes(x.theme)))) {
    const a = r.analysis;
    console.log(
        `| ${r.engine} | ${r.route} | ${r.net} | ${r.cache} | ${r.option}${r.reduced ? ' (reduced motion)' : ''} | ${r.theme} | ${s(a.firstFrame)} | ${s(a.pageUncovered)} | ${s(a.pageFinal)} | ${s(a.spans.pageBeforeIntro)} | ${s(a.spans.fallbackFont + a.spans.fallbackFontInIntro)} | ${s(a.spans.headlineAtRestBeforeReveal)} |`,
    );
}
console.log('\n## Second load in the same tab (once per session)\n');
for (const r of rows.filter((x) => x.reload)) {
    console.log(
        `${r.engine} ${r.cache}: hits=${r.serverHits} paint=${s(r.analysis.firstFrame)} intro=${r.marks.arrivalState ?? 'none'} final=${s(r.analysis.pageFinal)}`,
    );
}
