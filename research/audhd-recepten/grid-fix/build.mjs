// Builds research/audhd-recepten/grid-fix/demo.html: the sections of the recipe app's approved demos that changed for the grid
// rule (Kenny, 2026-10-19 05:11 and 06:43: "HOE VAAK MOET IK NOG ZEGGEN OM ALLES DEFTIG VERTICAAL TE ALIGNEN EN GRID TE
// GEBRUIKEN IPV LINKS ALIGNEN???"), bundled as ONE review page (Kenny, 2026-10-19 02:38: up to 25 items per project).
// Only the changed sections come in; the approved ones stay decided on their own pages. The sources stay where they are
// (research/audhd-recepten/baddays, recipe, wheel, cook): this page reads their demo.html for the sections and loads their
// demo.js and page.css as they are. Modelled on research/gap-round-1/build.mjs.
//
// Each section gets one line under its heading that says what was wrong and what is different now.
//
// Run: node research/audhd-recepten/grid-fix/build.mjs   (idempotent; the page keeps its round id until Kenny's answer is recorded)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const MAX_ITEMS = 25;
const THEMES = ['formal'];
const ID = 'audhd-grid-fix';

/** @type {{ dir: string, wrapper: string, items: Record<string, string>, rename?: [string, string][] }[]} */
const SOURCES = [
    {
        dir: 'baddays',
        wrapper: 'bd-page',
        items: {
            'zero-prep':
                'Was: each row’s badge sat on the title line and “This one” in the middle of the row, 21 px lower. Now the badge, the title’s first line and the button share one line, and every button stands in one column. On a phone the three levels went under the title and scroll inside their own bar; before, they pushed the page 80 px sideways.',
        },
    },
    {
        dir: 'recipe',
        wrapper: 'rc-page',
        items: {
            recipe: 'Was: the title stood in the left column only, so “Portions” on the right started 9 px off it. Now the title row spans both columns and the two columns under it start on one line.',
            'recipe-states': 'The same change as above: the title row spans both columns.',
            qr: 'Was: the steps started at the top while the code’s first words were under it, 197 px apart. Now both columns open with a heading on one line: “Scan with the phone” over the code.',
            'qr-states': 'The same change as above: a heading over the code, on the line of the steps’ heading.',
            settings:
                'Was: two loose columns, the language switch 28 px under its name. Now one form grid with three shared columns: name and sentence, the control, and what it says now; every row on one line.',
            log: 'Was: on a phone the three-letter days stood 3 px apart. Now the phone shows two letters (Mo, Tu, We…), never cut; a wide screen is unchanged.',
        },
    },
    {
        dir: 'wheel',
        wrapper: 'wl-page',
        // The recipe page uses this heading id too.
        rename: [
            ['id="h-states"', 'id="h-wheel-states"'],
            ['aria-labelledby="h-states"', 'aria-labelledby="h-wheel-states"'],
        ],
        items: {
            wheel: 'Was: the answer was centred beside the wheel, 167 px below its top. Now both columns open with a small heading on one line, “Tonight’s wheel” over the wheel.',
            filters:
                'Was: on a phone the chips wrapped to different widths, so their words and counts did not line up. Now the filters are one form grid, and on a phone the chips stand two per row in equal columns (the time ranges one per row, never cut).',
            'no-energy': 'The same change as the first section: both columns open with a heading on one line.',
            states: 'The same change as the first section: both columns open with a heading on one line.',
        },
    },
    {
        dir: 'cook',
        wrapper: 'ar-page',
        items: {
            cook: 'Was: the steps column began with its toolbar, 2 px off the heading “Timers running” beside it. Now the steps column has its own heading, “Steps”, on that line.',
        },
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
    // The top-level sections, nested ones (a card that is a section) kept inside their parent.
    const sections = [];
    const tags = /<\/?section\b[^>]*>/g;
    let depth = 0;
    let start = -1;
    for (const m of main[1].matchAll(tags)) {
        if (m[0].startsWith('</')) {
            depth -= 1;
            if (depth === 0) sections.push(main[1].slice(start, (m.index ?? 0) + m[0].length));
        } else {
            if (depth === 0) start = m.index ?? 0;
            depth += 1;
        }
    }
    const picked = [];
    for (const [item, change] of Object.entries(source.items)) {
        const section = sections.find((s) => s.slice(0, s.indexOf('>')).includes(`data-review-item="${item}"`));
        if (!section) throw new Error(`${source.dir}: no section ${item}`);
        // The change line goes right after the section's own head block.
        const note = `<p class="gf-expected-change"><b>What changed:</b> ${escapeHtml(change)}</p>`;
        const withNote = section.replace(/(<\/div>)/, `$1\n${note}`);
        if (withNote === section) throw new Error(`${source.dir}: ${item} has no head block`);
        picked.push(withNote);
    }
    let joined = picked.join('\n\n');
    for (const [from, to] of source.rename ?? []) {
        if (!joined.includes(from)) throw new Error(`${source.dir}: ${from} is not in the sections`);
        joined = joined.split(from).join(to);
    }
    items += picked.length * THEMES.length;
    summary.push(`${source.dir}: ${picked.length}`);
    parts.push(`<div class="${source.wrapper}">\n${joined}\n</div>`);
}
if (items > MAX_ITEMS) throw new Error(`${items} items: more than ${MAX_ITEMS}, split the page`);

const body = parts.join('\n\n');
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
const itemIds = [...body.matchAll(/data-review-item="([^"]+)"/g)].map((m) => m[1]);
for (const id of new Set(itemIds)) if (itemIds.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
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

const title = 'Recipe app: every column on one line';
const page = `<!doctype html>
<html lang="en-GB" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="../../../css/fonts.css" />
        <link rel="stylesheet" href="../../../css/themes.css" />
        <link rel="stylesheet" href="../../../css/components.css" />
        <link rel="stylesheet" href="../../../css/layout.css" />
        <link rel="stylesheet" href="../../../css/utilities.css" />
        <script>
            (function () {
                var d = document.documentElement;
                var t = new URLSearchParams(location.search).get('theme');
                try {
                    if (t) localStorage.setItem('theme', t);
                    t = t || localStorage.getItem('theme');
                } catch (e) {}
                if (t) d.setAttribute('data-theme', t);
                var theme = d.getAttribute('data-theme') || 'formal';
                document.write('<link rel="stylesheet" href="../../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="./page.css" />
${SOURCES.map((s) => `        <link rel="stylesheet" href="../${s.dir}/page.css" />`).join('\n')}
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main gf-page">
            <header class="gf-intro">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    Twelve sections of the recipe app's approved screens that did not stand on a grid: a column that started lower than the one beside
                    it, a button off its row's line, chips whose words did not line up on a phone. Each is rebuilt so its columns share one line and its
                    rows share one set of tracks; the settings and the wheel's filters are now one form grid. Only these sections are here; everything
                    else stays approved on its own page. ${items} sections, ${items} pairs, formal only.
                </p>
                <p>Every section says under <b>What changed</b> what was wrong and what is different now, and under <b>Expected</b> what you should see.</p>
            </header>

${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../../js/auto.js"></script>
${SOURCES.map((s) => `        <script type="module" src="../${s.dir}/demo.js"></script>`).join('\n')}
        <script type="module" src="../../_review/review.js"></script>
        <script src="../../../catalogue/boot-check.js"></script>
        <script type="module" src="../../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${items} items (${summary.join(', ')}), round ${roundId}`);
