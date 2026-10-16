// research/kpadopt2: writes demo.html, the ONE page for round 2 of the dashboard adoption (Kenny's rule of 2026-10-04: one
// central page, every section judged in one review dialog). The sections come from parts/:
//   parts/tiles.mjs  action tiles, status rows, the facet list   (parts/looks.mjs holds their per-theme look-at lines)
//   parts/grids.html heat grid, matrix, bar in a table cell      (hand-written markup)
//   parts/time.mjs   week agenda, run timeline                   (five sections)
// Edit those, demo-*.css and demo-*.js, not demo.html.
//
//   node research/kpadopt2/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { sections as tiles } from './parts/tiles.mjs';
import { sections as time } from './parts/time.mjs';
import { BARCELL, HEAT, MATRIX } from './parts/looks.mjs';

const escLook = (/** @type {string} */ t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** The hand-written grid sections carry a <!-- look:KEY --> marker; each becomes that section's per-theme "Look at" lines. */
const GRID_LOOKS = { heat: HEAT, matrix: MATRIX, barcell: BARCELL };
const grids = readFileSync(new URL('./parts/grids.html', import.meta.url), 'utf8').replace(
    /^ {4}<!-- look:(\w+) -->$/gm,
    (_, key) =>
        `    <div data-review-look>\n${Object.entries(GRID_LOOKS[/** @type {keyof typeof GRID_LOOKS} */ (key)])
            .map(([t, line]) => `        <p data-for="${t}">${escLook(line)}</p>`)
            .join('\n')}\n    </div>`,
);

// Round 5 (2026-10-16) asks the fifteen other themes for every section, all approved in formal in rounds 1 to 4
// (research/kpadopt2/VERDICTS.json; gates/check-rereview.mjs refuses a page that offers an approved pair). Formal leaves the page.
const OPEN = ['actions', 'status', 'facets', 'heat', 'matrix', 'barcell', 'week', 'week-crowd', 'week-states', 'gantt', 'gantt-states'];
const THEMES = 'light,dark,cyberpunk,synthwave,pastel,terminal,forest,blueprint,solstice,brutalism,deco,phantom,grotesk,nostromo,titanium';
// Kenny reopened four faults in formal on 2026-10-16 15:46 ("formal-faults: Herstellen"; research/approved-formal-notes.md):
// the sections that show them ask formal again in this same round, beside the fifteen other themes. The page names formal
// too (the review dialog walks the page's themes); every other section names only the fifteen.
const FORMAL_AGAIN = ['heat', 'matrix', 'gantt-states'];
// The review dialog walks a round of more than one theme topic by topic (research/_review/README.md, "Topic steps";
// Kenny, 2026-10-16 16:43): similar sections are one step, each in every asked theme. The first section of a topic
// carries its title.
/** @type {Record<string, [string, string?]>} */
const TOPICS = {
    actions: ['tiles', 'Tiles and rows'],
    status: ['tiles'],
    facets: ['tiles'],
    heat: ['matrix', 'Matrix and heat grid'],
    matrix: ['matrix'],
    barcell: ['barcell', 'Bar in a table cell'],
    week: ['week', 'Week agenda'],
    'week-crowd': ['week'],
    'week-states': ['week'],
    gantt: ['gantt', 'Run timeline'],
    'gantt-states': ['gantt'],
};
/** The topic attributes of a section. @param {string} item */
const topicOf = (item) => {
    const [topic, title] = TOPICS[item] ?? [];
    return topic ? ` data-review-topic="${topic}"${title ? ` data-review-topic-title="${title}"` : ''}` : '';
};
/** Keep only the open sections of a run of sections, each naming the themes it asks. @param {string} html */
const openOnly = (html) =>
    html.replace(/[ \t]*<section\b[\s\S]*?<\/section>\n?/g, (block) => {
        const item = /\bdata-review-item="([^"]+)"/.exec(block)?.[1] ?? '';
        if (!OPEN.includes(item)) return '';
        return block.replace(
            /<section\b/,
            `<section data-review-themes="${FORMAL_AGAIN.includes(item) ? `formal,${THEMES}` : THEMES}"${topicOf(item)}`,
        );
    });

const html = `<!doctype html>
<!-- Written by research/kpadopt2/build.mjs; edit build.mjs, parts/, demo-*.css and demo-*.js, not this file. -->
<html lang="en" data-theme="light" data-review="kpadopt2" data-review-themes="formal,${THEMES}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Round 5 of the dashboard adoption: the eight components in every theme · kp-themes research demo</title>
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
                var theme = d.getAttribute('data-theme') || 'light';
                document.write('<link rel="stylesheet" href="../../css/' + theme + '-register.css" data-kp-register="' + theme + '">');
            })();
        </script>
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="demo.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main r2-page">
            <header class="r2-intro">
                <h1>Round 5 of the dashboard adoption: the eight components in every theme</h1>
                <p class="cat-intro">
                    Review round 5. Kenny approved the eight components in formal (rounds 1 to 4): the <b>action tiles</b>, the <b>status
                    rows</b>, the <b>facet list</b>, the <b>heat grid</b>, the <b>matrix</b>, the <b>bar in a table cell</b>, the <b>week
                    agenda</b> with its states and the <b>run timeline</b>. This round asks the fifteen other themes, each built from that
                    theme’s own approved parts: its buttons, segmented track, menus, loading picture, arrival and signature motion. Formal is
                    asked again only for the heat grid, the matrix, the bar cell and the run timeline, each with one repair to judge. Every section says what you should see under <b>Expected</b>, and the review dialog’s
                    “Look at” line names what is this theme’s own. Everything with a <code>kp-</code> class and every script under
                    <code>js/</code> is the package; the sample data and the buttons that drive a demo are this page’s.
                </p>
                <p class="ta-note" data-ta-mirror-note hidden>
                    <b>Hover, focus and press rows are drawn by copying the package’s own rules</b> (the page reads the stylesheets and re-writes
                    <code>:hover</code> as a class), so they show the theme’s real look. That needs the page to be served over http (as the catalogue
                    does); opened as a file, those rows show only the plain tile.
                </p>
                <p class="ta-note" data-ta-motion hidden><b>Your system asks for reduced motion</b>, so hover and press change the look but nothing moves or fades.</p>
            </header>
${openOnly(tiles)}
${openOnly(grids)}
${openOnly(time)}
        </main>
        <script type="module" src="demo-grids.js"></script>
        <script type="module" src="demo-time.js"></script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo-tiles.js"></script>
        <script type="application/json" data-review-round>
            { "round": "2026-10-16-r6", "received": ["2026-10-16-r1", "2026-10-16-r2", "2026-10-16-r3", "2026-10-16-r4", "2026-10-16-r5", "2026-10-16-r6"], "reopen": ${JSON.stringify(FORMAL_AGAIN.map((item) => `formal|${item}`))} }
        </script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

writeFileSync(new URL('demo.html', import.meta.url), html);
console.log('demo.html', html.length, 'bytes');
