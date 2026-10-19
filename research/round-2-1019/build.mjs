// Builds research/round-2-1019/demo.html: the four package-fix demos of the project threads (align-pkg-1019, r1r2-1019, r3r5-1019,
// b3b4-1019) as ONE review page, the way research/gap-round-1/build.mjs bundles its sources (Kenny, 2026-10-19 02:38: "als ze van
// hetzelfde project komen kan je ze bundelen tot 25 items groot"). The sources stay where they are; this page reads their demo.html
// for the sections and loads their demo.js and page.css as they are. Each source's sections stand in a wrapper carrying a class of
// the source, so a section keeps its scripts, its page CSS and its "What changed" text.
//
// Unlike gap-round-1 the sources nest `<section>` inside a section (a gantt, a pipeline), so the sections are found by depth.
// Run: node research/round-2-1019/build.mjs   (idempotent; the page keeps its round id until Kenny's answer is recorded)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const MAX_ITEMS = 25;
const ID = 'round-2-1019';

/** The source demos in page order: where they are and the class their sections' wrapper carries. */
const SOURCES = [
    { dir: 'align-pkg-1019', wrapper: 'r2-align' },
    { dir: 'r1r2-1019', wrapper: 'r2-states' },
    { dir: 'r3r5-1019', wrapper: 'r2-timeline' },
    { dir: 'b3b4-1019', wrapper: 'r2-table' },
];

const read = (/** @type {string} */ path) => readFileSync(fileURLToPath(new URL(path, here)), 'utf8');
const escapeHtml = (/** @type {string} */ text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The top-level `<section>` elements of a markup string, by depth. */
function topSections(/** @type {string} */ html) {
    const out = [];
    let depth = 0;
    let start = -1;
    for (const m of html.matchAll(/<section\b|<\/section>/g)) {
        if (m[0] === '</section>') {
            depth -= 1;
            if (depth === 0) out.push(html.slice(start, m.index + m[0].length));
        } else {
            if (depth === 0) start = m.index;
            depth += 1;
        }
    }
    return out;
}

const problems = /** @type {string[]} */ ([]);
const parts = [];
const summary = [];
const themeAsks = /** @type {string[]} */ ([]);
let items = 0;
const stylesheets = new Set();
for (const source of SOURCES) {
    const html = read(`../${source.dir}/demo.html`);
    const main = /<main\b[^>]*>([\s\S]*)<\/main>/.exec(html);
    if (!main) throw new Error(`${source.dir}: no <main>`);
    const sections = topSections(main[1]);
    if (!sections.length || sections.some((s) => !/data-review-item="/.test(s))) throw new Error(`${source.dir}: a top-level section is no review item`);
    for (const s of sections) {
        const themes = /data-review-themes="([^"]+)"/.exec(s)?.[1] ?? 'formal';
        const n = themes.split(',').length;
        items += n;
        for (const t of themes.split(',')) if (!themeAsks.includes(t)) themeAsks.push(t);
    }
    for (const m of html.matchAll(/<link rel="stylesheet" href="(\.\/page\.css|\.\.\/kpadopt56\/[^"]+)"/g)) {
        stylesheets.add(m[1] === './page.css' ? `../${source.dir}/page.css` : m[1]);
    }
    summary.push(`${source.dir}: ${sections.length}`);
    parts.push(`<div class="${source.wrapper}">\n${sections.join('\n\n')}\n</div>`);
}
if (items > MAX_ITEMS) throw new Error(`${items} items: more than ${MAX_ITEMS}, split the page by topic`);

const body = parts.join('\n\n');
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
const itemIds = [...body.matchAll(/data-review-item="([^"]+)"/g)].map((m) => m[1]);
for (const id of new Set(itemIds)) if (itemIds.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
for (const topic of new Set([...body.matchAll(/data-review-topic="([^"]+)"/g)].map((m) => m[1]))) {
    const first = body.split(/(?=<section\b)/).find((s) => s.includes(`data-review-topic="${topic}"`)) ?? '';
    if (!/data-review-topic-title="/.test(first)) problems.push(`the first section of topic "${topic}" carries no data-review-topic-title`);
}
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'Fixes from the project threads, round 2';
const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${themeAsks.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <script>
            (function () {
                var d = document.documentElement;
                var t = new URLSearchParams(location.search).get('theme');
                try {
                    // A theme in the link is kept, so the catalogue's own
                    // boot, which reads the stored theme, does not undo it.
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
${[...stylesheets].map((s) => `        <link rel="stylesheet" href="${s}" />`).join('\n')}
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    Faults that the project threads found in components you approved earlier, each fixed in the package. Six components on a
                    shared line (activity feed, lead list, problems, share bar, shortcuts, week), the calendar and the pipeline when empty or
                    failed, the run timeline and the uses map, and the data table with its removed and held rows, date pills and action column.
                    ${items} sections, ${items} pairs, all in formal. Every section says under <b>What changed since you approved it</b> what was
                    wrong and what is different now.
                </p>
            </header>

${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
${SOURCES.map((s) => `        <script type="module" src="../${s.dir}/demo.js"></script>`).join('\n')}
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${items} items (${summary.join(', ')}), themes ${themeAsks.join(',')}, round ${roundId}`);
