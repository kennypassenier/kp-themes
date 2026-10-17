// Splits research/kpadopt4/demo.html into one review per topic (Kenny, 2026-10-17: "demos met meer dan 100
// beoordelingen moeten ook opgesplitst worden per group van elementen zodat ze kleiner en behapbaarder worden").
//
// The page here stays the source: it holds every section, its looks (build-looks.mjs) and its scripts, and it is the
// formal review, decided. Each topic becomes research/kpadopt4-<topic>/demo.html: the same head, the topic's own
// sections to judge, the page's scripts and styles read from this folder, and a review id of its own, so every part
// keeps its own answers, its own progress on the Agenda and its own VERDICTS.json. The other topics' sections stay in
// the page, laid aside and no longer review items: the page's scripts wire every section by id and stop at the
// first one that is missing. Idempotent: run it after every change to
// the source page.
//
// Run: node research/kpadopt4/build-parts.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { latestVerdicts } from '../../gates/check-rereview.mjs';

const here = new URL('./', import.meta.url);
const SOURCE = fileURLToPath(new URL('demo.html', here));
const THEMES = 'dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium';
const ROUND = '2026-10-17-r3';

const html = readFileSync(SOURCE, 'utf8');
const marker = /^ *<!-- =+ topic: (.+?) -->$/gm;
const marks = [...html.matchAll(marker)];
const mainEnd = html.indexOf('</main>');
const head = html.slice(0, marks[0].index);
const tail = html.slice(mainEnd);

/** The page's own files are read from the source folder; the package's (../../) and the kit's (../_review) stay. */
const local = (/** @type {string} */ text) =>
    text.replace(/\b(src|href)="(?!\.\.\/|https?:|#|data:|mailto:)([^"]+)"/g, (_, attr, path) => `${attr}="../kpadopt4/${path}"`);

const parts = marks.map((m, i) => {
    const body = html.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : mainEnd);
    // A part is named by its topic's first word: a part may hold several topics of its own (cooking-wheel, cooking-timers).
    const topic = /data-review-topic="([^"]+)"/.exec(body)?.[1]?.split('-')[0];
    if (!topic) throw new Error(`no data-review-topic under "${m[1]}"`);
    return { title: m[1], topic, body, sections: [...body.matchAll(/data-review-item="([^"]+)"/g)].map((s) => s[1]) };
});

for (const [i, part] of parts.entries()) {
    const id = `kpadopt4-${part.topic}`;
    const dir = new URL(`../${id}/`, here);
    if (!existsSync(dir)) mkdirSync(dir);
    const verdictsFile = new URL('VERDICTS.json', dir);
    const verdicts = existsSync(verdictsFile) ? JSON.parse(readFileSync(verdictsFile, 'utf8')) : { demo: id, rounds: [] };
    if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify(verdicts, null, 4)}\n`);
    // A pair Kenny approved stays off the page: its section asks only the themes still open. Once every pair is
    // approved the part is decided and keeps the page of its last round.
    const all = part.sections.flatMap((item) => THEMES.split(',').map((theme) => ({ item, theme })));
    const latest = latestVerdicts(verdicts, all);
    // A pair reopened because its component changed (formal included) is asked again, first in the list.
    const reopened = (/** @type {string} */ item) =>
        (verdicts.reopened ?? []).filter((/** @type {any} */ r) => r.item === item).map((/** @type {any} */ r) => r.theme);
    const open = new Map(
        part.sections.map((item) => [
            item,
            [
                ...new Set([
                    ...reopened(item).filter((t) => !THEMES.split(',').includes(t)),
                    ...THEMES.split(',').filter((theme) => reopened(item).includes(theme) || latest.get(`${theme}|${item}`) !== 'approved'),
                ]),
            ],
        ]),
    );
    const decided = [...open.values()].every((themes) => !themes.length);
    // The page walks every theme still asked somewhere on it, a reopened one (formal) first.
    const asked = new Set([...open.values()].flat());
    const pageThemes = [...asked].filter((t) => !THEMES.split(',').includes(t)).concat(THEMES.split(',').filter((t) => asked.has(t)));
    let body = part.body;
    if (!decided)
        for (const [item, left] of open) {
            if (left.join(',') === pageThemes.join(',')) continue;
            const tag = new RegExp(`(<section\\b(?:(?!>)[\\s\\S])*?data-review-item="${item}")`);
            body = left.length
                ? body.replace(tag, `$1 data-review-themes="${left.join(',')}"`)
                : body.replace(tag, (m) => m.replace(/\bdata-review-(item|topic|topic-title|title)=/g, 'data-kpadopt4-$1='));
        }
    if (decided && existsSync(new URL('demo.html', dir))) {
        // The page of the last round stays; it only learns that its answer has been received.
        const kept = fileURLToPath(new URL('demo.html', dir));
        const pages = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
        writeFileSync(kept, readFileSync(kept, 'utf8').replace(/("received": )\[[^\]]*\]/, `$1${JSON.stringify(pages).replace(/","/g, '", "')}`));
        console.log(`${id}: decided, page kept`);
        continue;
    }
    const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
    // A page round id never collides (Kenny, 2026-10-17: "een ID mag nooit colliden, gebruik desnoods UUID's"): the
    // page keeps the id it already has while that round is not received, else it takes a fresh UUID.
    const current = existsSync(new URL('demo.html', dir))
        ? /"round":\s*"([^"]+)"/.exec(readFileSync(new URL('demo.html', dir), 'utf8'))?.[1]
        : undefined;
    const roundId = current && !received.includes(current) && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${part.topic}-${randomUUID()}`;
    const intro = `            <header class="kd-intro">
                <h1>The fourth adoption round, part ${i + 1} of ${parts.length}: ${part.title}</h1>
                <p class="cat-intro">
                    Formal is approved. This part asks the eleven other themes for one group of components, ${part.sections.length} sections, one
                    theme per step in the review dialog. The nine parts are judged one by one from the Agenda, so no single review holds more
                    than 100 verdicts.
                </p>
                <p>
                    Every section says under <b>Expected</b> what you should see and what each control does (written for formal; the line under
                    &ldquo;What to look at&rdquo; says what is the theme&rsquo;s own).
                </p>
            </header>

`;
    const page =
        local(
            head
                .replace(/data-review="kpadopt4"/, `data-review="${id}"`)
                .replace(/data-review-themes="[^"]*"/, `data-review-themes="${pageThemes.join(',')}"`)
                .replace(/<title>[^<]*<\/title>/, `<title>kpadopt4, part ${i + 1}: ${part.title}</title>`)
                .replace(/<header class="kd-intro">[\s\S]*?<\/header>\s*/, intro),
        ) +
        local(body) +
        local(
            `            <div hidden style="display: none" data-kpadopt4-other>\n` +
                parts
                    .filter((other) => other !== part)
                    .map((other) => other.body.replace(/\bdata-review-(item|topic|topic-title|title|choices)=/g, 'data-kpadopt4-$1='))
                    .join('') +
                `            </div>\n`,
        ) +
        local(tail).replace(
            /<script type="application\/json" data-review-round>[\s\S]*?<\/script>/,
            `<script type="application/json" data-review-round>\n            ${JSON.stringify({ round: roundId, received })}\n        </script>`,
        );
    const out = fileURLToPath(new URL('demo.html', dir));
    const config = (await prettier.resolveConfig(out)) ?? {};
    writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
    const readme = new URL('README.md', dir);
    if (!existsSync(readme))
        writeFileSync(
            readme,
            `# research/${id}: the fourth adoption round, part ${i + 1} of ${parts.length}\n\n` +
                `${part.title}, in the eleven themes other than formal: ${part.sections.join(', ')}. Generated from ` +
                `[research/kpadopt4/demo.html](../kpadopt4/demo.html) by \`node research/kpadopt4/build-parts.mjs\`; edit the source, ` +
                `never this page. Split off on Kenny's rule of 2026-10-17: a review of more than 100 verdicts is split per group of ` +
                `components.\n`,
        );
    console.log(`${id}: ${[...open.values()].flat().length} pairs to judge`);
}
