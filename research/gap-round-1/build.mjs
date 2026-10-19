// Builds research/gap-round-1/demo.html: the five component demos of the homelab dashboard's gap report as ONE review
// page (Kenny, 2026-10-19 02:38: "als ze van hetzelfde project komen kan je ze bundelen tot 25 items groot, dan gaat het
// proces vlotter"). The sources stay where they are (research/gap-log-viewer, gap-diff-view, gap-activity-feed,
// gap-entity-tiles, gap-tab-count): this page reads their demo.html for the sections and loads their demo.js and page.css
// as they are, one script and one stylesheet per source demo. Modelled on research/kpadopt56/build-parts.mjs.
//
// What the builder does to a section: nothing but the two item ids that two demos both used ("states"), which it renames.
// Each source's sections stand in a wrapper that carries the source's page class (`glv-page`, `gdv-page` …), so the
// source's own page rules apply as they did on its own page. At most 25 items: sections x themes asked (formal only).
//
// Run: node research/gap-round-1/build.mjs   (idempotent; the page keeps its round id until Kenny's answer is recorded)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const MAX_ITEMS = 25;
const THEMES = ['formal'];
const ID = 'gap-round-1';

/**
 * The source demos in page order: where they are, the class their sections' wrapper carries, the item ids to rename.
 * @type {{ dir: string, wrapper: string, topicTitle?: Record<string, string>, rename: [string, string][] }[]}
 */
const SOURCES = [
    {
        dir: 'gap-log-viewer',
        wrapper: 'glv-page',
        rename: [
            ['data-review-item="states"', 'data-review-item="log-states"'],
            ['id="h-states"', 'id="h-log-states"'],
            ['aria-labelledby="h-states"', 'aria-labelledby="h-log-states"'],
        ],
    },
    { dir: 'gap-diff-view', wrapper: 'gdv-page', rename: [] },
    { dir: 'gap-activity-feed', wrapper: 'gaf-page', rename: [] },
    {
        dir: 'gap-entity-tiles',
        wrapper: 'gt-page',
        rename: [
            ['id="states"', 'id="tile-states"'],
            ['data-review-item="states"', 'data-review-item="tile-states"'],
            ['id="h-states"', 'id="h-tile-states"'],
            ['aria-labelledby="h-states"', 'aria-labelledby="h-tile-states"'],
        ],
    },
    {
        dir: 'gap-tab-count',
        wrapper: 'gtc-page',
        topicTitle: { gap: 'A count on a tab, arrow keys over tiles, the heat grid legend' },
        rename: [],
    },
];

const read = (/** @type {string} */ path) => readFileSync(fileURLToPath(new URL(path, here)), 'utf8');
const escapeHtml = (/** @type {string} */ text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const problems = /** @type {string[]} */ ([]);
let items = 0;
const parts = [];
const summary = [];
for (const source of SOURCES) {
    const html = read(`../${source.dir}/demo.html`);
    const main = /<main\b[^>]*>([\s\S]*)<\/main>/.exec(html);
    if (!main) throw new Error(`${source.dir}: no <main>`);
    const sections = main[1].match(/<section\b[\s\S]*?<\/section>/g) ?? [];
    if (!sections.length) throw new Error(`${source.dir}: no sections`);
    if (sections.some((s) => (s.match(/<section\b/g) ?? []).length !== 1)) throw new Error(`${source.dir}: nested section`);
    let body = sections.join('\n\n');
    for (const [from, to] of source.rename) {
        if (!body.includes(from)) throw new Error(`${source.dir}: ${from} is not in the sections`);
        body = body.split(from).join(to);
    }
    for (const [topic, title] of Object.entries(source.topicTitle ?? {})) {
        const next = body.replace(new RegExp(`(data-review-topic="${topic}"\\s+data-review-topic-title=")[^"]*"`), `$1${title}"`);
        if (next === body) throw new Error(`${source.dir}: topic ${topic} carries no title to replace`);
        body = next;
    }
    items += sections.length * THEMES.length;
    summary.push(`${source.dir}: ${sections.length}`);
    parts.push(`<div class="${source.wrapper}">\n${body}\n</div>`);
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
// A page keeps its own round id once decided, and lists it as received (the archived shape).
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'New components for the homelab dashboard, round 1';
const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
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
        <link rel="stylesheet" href="./page.css" />
${SOURCES.map((s) => `        <link rel="stylesheet" href="../${s.dir}/page.css" />`).join('\n')}
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main gr1-page">
            <header class="gr1-intro">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    The homelab admin dashboard drew five things by hand because the package had none of them. Each is now a part of the package, shown
                    here in formal only: the live log viewer, a diff of several files, the activity feed, two options of the entity card (a trend
                    line and the app tile with a favourite star), and three small things around tabs, tiles and the heat grid (a count on a tab,
                    arrow keys over a board of tiles, the legend under a heat grid). ${items} sections, ${items} pairs. All data is mock (a seeded homelab with jellyfin,
                    sonarr and traefik); nothing is read from a host.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does.</p>
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
console.log(`${ID}: ${items} items (${summary.join(', ')}), round ${roundId}`);
