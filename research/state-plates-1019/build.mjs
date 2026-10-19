// Builds research/state-plates-1019/demo.html: the empty, failed and loading states of the data components, put on one state plate
// (Kenny, 2026-10-16 "de hele grootte van de component gebruiken"; 2026-10-17 "prominent, proportioneel groot, centraal"). They change
// components he had approved, so they come back through the review dialog (DEMO_RULES ch. 7 and 9), in formal (every fix is the
// theme's existing plate and busy card), with a plain "What changed" text per section.
//
//   1. graph-states    the network graph: the chart's own loading picture over the picture, a plate for empty and failed (js/graph.js)
//   2. table-states    the data table: a failed table and an empty one take the table's place (js/datatable.js)
//   3. heat-states     the heat grid: a plate with a Retry (js/heat.js)
//   4. matrix-states   the matrix, grid and lines: a plate with a Retry, the busy card over the whole map (js/heat.js, js/uses-map.js)
//   5. gantt-states    the run timeline: a plate over the plot (js/gantt.js)
//   6. week-states     the week agenda: a plate over the agenda (js/week.js)
//   7. uptime-group    strips that load together: one busy card over the group (js/uptime.js)
//   8. card-states     a card's empty and failed notes: heading size, plate classes, an optional picture (js/card-state.js)
//
// Run: node research/state-plates-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'state-plates-1019';
const THEMES = ['formal'];
// Round 3 (2026-10-19, after Kenny's 17:20 verdict): only the section he did not approve; the other seven are approved and left the page.
const SHOWN = new Set(['graph-states']);

/** @param {string} text */
const looks = (text) => THEMES.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * A group of state buttons: one pressed at a time.
 * @param {string} key @param {string} label @param {[string, string][]} options
 */
const group = (key, label, options) =>
    `<div role="group" aria-label="${label}"><b>${label}:</b> ${options
        .map(
            ([value, text], i) =>
                `<button type="button" class="kp-button kp-button--sm" data-sp-set="${key}" data-sp-value="${value}" aria-pressed="${i === 0}">${text}</button>`,
        )
        .join(' ')}</div>`;

/**
 * One section.
 * @param {{ id: string, topic: string, topicTitle?: string, title: string, intro: string, changed: string, expect: string[], look: string, components: string, groups: string, stage: string }} s
 */
const section = (s) =>
    !SHOWN.has(s.id)
        ? ''
        : `
<section
    class="sp-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-topic="${s.topic}"${s.topicTitle ? `\n    data-review-topic-title="${s.topicTitle}"` : ''}
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="sp-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="sp-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
${looks(s.look)}
    </div>
    <div data-review-controls data-review-controls-for="${s.id}-component">
        ${s.groups}
    </div>
    <div class="sp-stage" id="${s.id}-component" data-sp-view="${s.id}">
${s.stage}
    </div>
</section>`;

const STATES4 = /** @type {[string, string][]} */ ([
    ['ready', 'Ready'],
    ['loading', 'Loading'],
    ['empty', 'Empty'],
    ['error', 'Failed'],
]);

const sections = [
    section({
        id: 'graph-states',
        topic: 'graph',
        topicTitle: 'Network graph',
        title: 'Network graph: loading, empty and failed',
        intro: 'The picture of what talks to what. Press a state to see how the picture waits, is empty, or could not be read; Retry on the failed picture reads it again.',
        changed:
            '<b>Third round, loading only.</b> You rejected loading twice (19/10 11:22 &ldquo;elk thema heeft al een loading animatie voor dit soort element, gebruik het!&rdquo;; 17:20 &ldquo;Dit element heeft voor elk thema een animatie, gebruik die!&rdquo;): the first time new pictures were drawn, the second time the generic loading card was put on it. Now a loading graph is exactly the picture the chart already has in every theme (<code>.kp-chart__state</code> as a skeleton block, the one the theme dresses for a chart&rsquo;s plot), over the graph&rsquo;s whole footprint, with its sentence read out for screen readers as the chart does. Nothing new is drawn, the faint network under it is gone, and the loading card is gone from the graph. Empty, failed and the loaded network are as you approved them.',
        expect: [
            '<b>Loading</b>: the theme&rsquo;s own chart loading picture over the whole graph, edge to edge, the same one a chart shows while it loads in that theme; no loading card, no network under it.',
            '<b>Empty</b> and <b>Failed</b>: a plate as big as the picture with a title at heading size, a sentence and, when failed, a <b>Retry</b> button of normal size; the picture keeps the height it has with its network.',
            'Press <b>Retry</b>: the loading card shows for a moment and the network comes back.',
            '<b>Ready</b>: the network exactly as you approved it.',
        ],
        look: 'the plate is centred in the picture at the same height as the loaded network; Retry is a normal button.',
        components: 'graph',
        groups: group('state', 'State', STATES4),
        stage: `<figure class="kp-graph" data-kp-graph aria-label="What talks to what"></figure>`,
    }),
    section({
        id: 'table-states',
        topic: 'table',
        topicTitle: 'Data table',
        title: 'Data table: failed, nothing yet and nothing matches',
        intro: 'A table of services with its search. Press a state: the rows load, fail, are all gone or none match the search.',
        changed:
            'A failed table showed a small red strip above rows that stayed drawn, and a table with nothing to show, or none matching, showed its notice under the still-drawn table. Now the rows are covered and the plate takes the table&rsquo;s place at the height the table had with its rows: the reason or the sentence at heading size and centred, and Try again a normal-size button. The search, the status line and the loading card are as you approved them.',
        expect: [
            '<b>Failed</b>: the table&rsquo;s place is one red plate, the reason at heading size, a <b>Try again</b> button of normal size under it; no rows, no header beside it.',
            '<b>Nothing matches</b> and <b>No rows</b>: one plate in the table&rsquo;s place, the sentence at heading size; <b>Clear the search</b> is a normal button.',
            'The plate is as tall as the table was with its rows; <b>Rows</b> brings the table back with no jump.',
        ],
        look: 'the plate fills the place of the table at the table&rsquo;s height, its words centred; the buttons are normal size.',
        components: 'datatable',
        groups: group('state', 'State', [
            ['rows', 'Rows'],
            ['loading', 'Loading'],
            ['error', 'Failed'],
            ['nomatch', 'Nothing matches'],
            ['norows', 'No rows'],
        ]),
        stage: `<div class="kp-datatable" data-kp-datatable data-kp-page-sizes="none" data-kp-busy-overlay>
    <div class="kp-datatable__bar">
        <input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the services" />
    </div>
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption class="kp-sr-only">Services</caption>
            <thead><tr><th scope="col" data-kp-sort="text">Service</th><th scope="col" data-kp-sort="text">Host</th><th scope="col" data-kp-sort="text">Status</th></tr></thead>
            <tbody>
                <tr><td>Jellyfin</td><td>CT 106</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Traefik</td><td>CT 104</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Grafana</td><td>CT 110</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Loki</td><td>CT 110</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Vaultwarden</td><td>CT 108</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Uptime Kuma</td><td>CT 111</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>kyu hub</td><td>CT 109</td><td><span class="kp-badge">Running</span></td></tr>
                <tr><td>Almanac</td><td>CT 112</td><td><span class="kp-badge">Running</span></td></tr>
            </tbody>
        </table>
    </div>
    <div class="kp-empty" data-kp-datatable-empty hidden>
        <div data-kp-datatable-empty-none>
            <p class="kp-empty__title">No services yet</p>
            <p>A service shows here as soon as a host reports it.</p>
        </div>
        <div data-kp-datatable-empty-nomatch hidden>
            <p class="kp-empty__title">No service matches</p>
            <button type="button" class="kp-button kp-button--secondary" data-kp-datatable-clear>Clear the search</button>
        </div>
    </div>
    <div class="kp-datatable__bar">
        <p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
    </div>
</div>`,
    }),
    section({
        id: 'heat-states',
        topic: 'heat',
        topicTitle: 'Heat grid and matrix',
        title: 'Heat grid: empty and failed',
        intro: 'Which two-hour block of the day a service answered. Press a state; a failed grid has a Retry and the plate may carry a small picture.',
        changed:
            'An empty or failed heat grid was a small grey or red word in the middle of a six-row-high gap, with no Retry button and no picture, and the page shrank to it. Now it is the package&rsquo;s state plate at the height the grid has with its rows: the title at heading size and centred, a sentence, a small picture over the title, and for a failure a normal-size Retry that tells the page to read it again. The loaded grid and its loading card are as you approved them.',
        expect: [
            '<b>Empty</b> and <b>Failed</b>: one plate as big as the grid, a picture, the title at heading size, a sentence and, when failed, <b>Retry</b>.',
            'Press <b>Retry</b>: the loading card shows for a moment and the grid returns.',
            '<b>Ready</b> and <b>Loading</b> as you approved them.',
        ],
        look: 'the plate is as tall as the loaded grid and its words are centred in it.',
        components: 'heat',
        groups: group('state', 'State', STATES4),
        stage: `<div class="kp-heat" data-kp-heat aria-label="Answers per hour"></div>`,
    }),
    section({
        id: 'matrix-states',
        topic: 'heat',
        title: 'Matrix: loading over the whole map, empty and failed',
        intro: 'Which service uses which, as a grid and as lines between two columns. Press a state, and flip the view.',
        changed:
            'In the lines view the loading card was centred over the few waiting rows, not over the map&rsquo;s whole footprint, and empty and failed in the grid view were a small word with no Retry. Now the loading card sits in the middle of the whole map in both views, and empty and failed in the grid view are the package&rsquo;s state plate at the height of the loaded matrix, with a normal-size Retry. The lines view&rsquo;s own empty and failed plate (approved before) is as it was.',
        expect: [
            '<b>Loading</b> in <b>Lines</b>: the loading card in the middle of the whole map, not over the top rows.',
            '<b>Empty</b> and <b>Failed</b> in <b>Grid</b>: a plate as big as the matrix, the title at heading size, a <b>Retry</b> on a failure.',
            '<b>Ready</b>: both views as you approved them.',
        ],
        look: 'the loading card is in the middle of the whole map; the plate fills the matrix and is centred.',
        components: 'matrix uses',
        groups: `${group('state', 'State', STATES4)}${group('view', 'View', [
            ['lines', 'Lines'],
            ['grid', 'Grid'],
        ])}`,
        stage: `<div class="kp-matrix" data-kp-matrix aria-label="Which service uses which"></div>`,
    }),
    section({
        id: 'gantt-states',
        topic: 'time',
        topicTitle: 'Run timeline, week agenda and uptime strips',
        title: 'Run timeline: empty and failed',
        intro: 'Runs on a time axis, a lane for each job. Press a state; a failed timeline has a Retry.',
        changed:
            'An empty or failed timeline was one small line of words over the plot, with no plate and no Retry. Now it is the package&rsquo;s state plate over the whole plot, under the axis: the title at heading size and centred, a sentence and, for a failure, a normal-size Retry. The loading card and the loaded timeline are as you approved them.',
        expect: [
            '<b>Empty</b> and <b>Failed</b>: a plate over the plot as high as the lanes were; the axis and the range buttons stay above it.',
            '<b>Failed</b> has a <b>Retry</b> of normal size; pressed, the loading card shows and the runs return.',
            '<b>Ready</b> and <b>Loading</b> as you approved them.',
        ],
        look: 'the plate fills the plot under the axis, its words centred; Retry is a normal button.',
        components: 'gantt',
        groups: group('state', 'State', STATES4),
        stage: `<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="6h 24h" data-kp-gantt-range="24h" data-kp-gantt-ghosts="1 1 1" data-kp-time-zone="Europe/Brussels" aria-label="Runs of the last day"></section>`,
    }),
    section({
        id: 'week-states',
        topic: 'time',
        title: 'Week agenda: empty and failed',
        intro: 'The next seven days with what is planned in each. Press a state; a failed agenda has a Retry.',
        changed:
            'An empty or failed week was one small line of words in the middle of the grid, with no plate and no Retry. Now it is the package&rsquo;s state plate over the whole agenda: the title at heading size and centred, a sentence and, for a failure, a normal-size Retry. The loading card and the loaded week are as you approved them.',
        expect: [
            '<b>Empty</b> and <b>Failed</b>: a plate over the whole agenda, the same height as the week with its items.',
            '<b>Failed</b> has a <b>Retry</b> of normal size; pressed, the loading card shows and the week returns.',
            '<b>Ready</b> and <b>Loading</b> as you approved them.',
        ],
        look: 'the plate fills the agenda, its words centred; Retry is a normal button.',
        components: 'week',
        groups: group('state', 'State', STATES4),
        stage: `<section class="kp-week" data-kp-week data-kp-week-nav data-kp-time-zone="Europe/Brussels" aria-label="The next seven days"></section>`,
    }),
    section({
        id: 'uptime-group',
        topic: 'time',
        title: 'Uptime strips: one loading card over the group',
        intro: 'Three services, a strip each. Press Loading: they wait together. Press the third state: they finish one after the other.',
        changed:
            'Every strip that loaded drew its own loading card, so three strips loading together drew three cards one above the other. Now strips that load together are a group and have ONE loading card in the middle of the group; when the strips finish one by one the card stays over the ones still waiting and leaves with the last. A single strip loads exactly as before.',
        expect: [
            '<b>Loading</b>: one loading card in the middle of the three strips, not one card per strip.',
            '<b>Ready one by one</b>: the card stays over the strips still waiting; each strip fills as it finishes; the card leaves after the last.',
            '<b>Ready</b>: the strips as you approved them.',
        ],
        look: 'one card (one spinner) in the middle of the three strips.',
        components: 'uptime',
        groups: group('state', 'State', [
            ['ready', 'Ready'],
            ['loading', 'Loading'],
            ['staggered', 'Ready one by one'],
        ]),
        stage: `<div class="sp-uptimes">
    <div class="kp-uptime" data-kp-uptime data-kp-uptime-label="Jellyfin" data-kp-uptime-count="60"></div>
    <div class="kp-uptime" data-kp-uptime data-kp-uptime-label="Traefik" data-kp-uptime-count="60"></div>
    <div class="kp-uptime" data-kp-uptime data-kp-uptime-label="Vaultwarden" data-kp-uptime-count="60"></div>
</div>`,
    }),
    section({
        id: 'card-states',
        topic: 'card',
        topicTitle: 'Card notes',
        title: 'Card: the empty and failed notes',
        intro: 'A card that shows data read from somewhere. Press a state; the picture option puts a small drawing over the title of the empty and failed notes.',
        changed:
            'The empty note&rsquo;s title was bold body text, not heading size, the note had none of the state plate&rsquo;s classes, a page could not put a picture over it, and the failed note&rsquo;s Try again was a small button. Now the empty and failed notes are the package&rsquo;s state plate: the title at heading size, the sentence at body size, a normal-size Try again, and an optional picture (<code>art</code>) over the title. Loading and ready are as you approved them.',
        expect: [
            '<b>Empty</b> and <b>Failed</b>: the title at heading size and centred in the card&rsquo;s stage, the sentence under it, and, on a failure, a <b>Try again</b> button of normal size.',
            'With <b>Picture</b> pressed, a small drawing stands over the title in both notes.',
            '<b>Loading</b> and <b>Ready</b> as you approved them.',
        ],
        look: 'the title is as big as the heading of the plates above, centred; the picture sits over it; Try again is a normal button.',
        components: 'card',
        groups: `${group('state', 'State', [
            ['ready', 'Ready'],
            ['loading', 'Loading'],
            ['empty', 'Empty'],
            ['error', 'Failed'],
        ])}${group('art', 'Picture', [
            ['none', 'None'],
            ['art', 'Picture'],
        ])}`,
        stage: `<section class="kp-card" data-kp-state="ready" aria-labelledby="sp-card-t">
    <div class="kp-card__header"><h3 class="kp-card__title" id="sp-card-t">Backups</h3></div>
    <p class="kp-card__body">The last backup of every stack.</p>
    <div class="kp-card__stage"><div class="kp-card__data">
        <ul class="sp-list"><li>Media stack · 03:00 · 41 GB</li><li>Platform stack · 03:10 · 6 GB</li><li>Home Assistant · 03:20 · 2 GB</li><li>OPNsense · 03:30 · 1 GB</li><li>Vaultwarden · 03:40 · 1 GB</li><li>kyu hub · 03:50 · 1 GB</li></ul>
    </div></div>
</section>`,
    }),
];

const shownSections = sections.filter(Boolean);
const body = shownSections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^state-plates-[0-9a-f]{8}-/.test(current) ? current : `state-plates-${randomUUID()}`;
const pairs = THEMES.length * shownSections.length;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Empty, failed and loading states on one plate</title>
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
        <link rel="stylesheet" href="../kpadopt56/part.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Empty, failed and loading states on one plate</h1>
                <p class="cat-intro">
                    Your rule is that a failed, empty or loading component fills the whole size it has with its data, centred, with a normal-size Retry,
                    and the loading card sits over the whole component. The gaps the projects found were components that did not follow it: the network
                    graph, the data table, the heat grid and matrix, the run timeline, the week agenda, a group of uptime strips and the card&rsquo;s
                    notes. They all use the package&rsquo;s one state plate and loading card now. ${shownSections.length} section, formal only (every
                    fix is the theme&rsquo;s own plate and loading card, so the other themes follow). Each section says under <b>What changed since you
                    approved it</b> what was wrong and what is different now. Press a state under the section&rsquo;s title to see it.
                </p>
            </header>
${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
console.log(`${ID}: ${shownSections.length} sections, ${pairs} pairs, round ${roundId}`);
