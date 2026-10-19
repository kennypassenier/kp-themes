// Builds research/r3r5-1019/demo.html: six faults of two components Kenny had approved, found by the project threads (almanac, kyu,
// homelab, HTTPSwitchboard) and fixed in the package. They change approved components, so each comes back through the review dialog
// (DEMO_RULES ch. 7 and 9) with a plain "What changed" text. Formal only: none of the faults differs per theme.
//
//   1. gantt-names   lane names and second lines ended in an ellipsis    (css/components.css)
//   2. gantt-zone    a lane's stretch ran behind the "+N" of a cluster   (css/components.css, css/formal-register.css)
//   3. gantt-frame   a lane was cut by the frame's edge (12 lanes)        (css/components.css, js/gantt.js)
//   4. gantt-rules   the minute rules showed through a queued bar's words (css/components.css)
//   5. uses-labels   row names of the uses map ended in an ellipsis       (css/components.css)
//   6. uses-line     a line can carry a tone and a label                  (js/uses-map.js, css/components.css)
//
// The pages of this round are bundled into one review afterwards (VERDICTS.json `bundledInto`); there is no catalogue/pages.js entry.
//
// Run: node research/r3r5-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'r3r5-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, topic: string, topicTitle: string }} s
 */
const section = (s) => `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="formal"
    data-review-topic="${s.topic}"
    data-review-topic-title="${s.topicTitle}"
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What changed since you approved it:</b> ${s.changed}</p></div>
    <div class="kc-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="kc-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
${looks(PAGE_THEMES, s.look)}
    </div>
${s.body}
</section>`;

const gantt = (/** @type {string} */ id, /** @type {string} */ label, extra = '') =>
    `<div class="rr-stack"><section class="kp-gantt" id="${id}" data-kp-gantt data-kp-gantt-range="6h" aria-label="${label}"${extra}></section></div>`;

const sections = [
    section({
        id: 'gantt-names',
        title: 'Run timeline: the names of the lanes',
        intro: 'Four jobs on a timeline of the last six hours. Their names are long, and two of them carry a second line and one is a link.',
        topic: 'gantt',
        topicTitle: 'Run timeline',
        changed:
            'A lane&rsquo;s name and its second line ended in an ellipsis (&ldquo;Photos and family vi&hellip;&rdquo;), even when the page made the name column wider. That breaks the rule that a label is never cut. Now the name column is as wide as the longest name (no narrower than before, at most 40 % of the timeline and 14 rem), and a name that is still longer wraps onto more lines; the lane grows to hold it. The first line of a name stands on the middle of the lane&rsquo;s first row, level with the bars and marks of that row, whatever the lane&rsquo;s height. Bars, marks, the axis and the toolbar are as you approved them.',
        expect: [
            'Every lane name and every second line is whole; none ends in <b>&hellip;</b>.',
            'The first line of each name is level with the middle of its first bar. At 390 px a long name wraps onto two or three lines and the lane gets taller.',
        ],
        look: 'no name or second line ends in an ellipsis, and each name starts level with its first bar.',
        components: 'gantt',
        body: gantt('rr-names', 'Jobs of the last 6 hours'),
    }),
    section({
        id: 'gantt-zone',
        title: 'Run timeline: a stretch under a crowded mark',
        intro: 'Two lanes of moments (attempts that were refused). The first lane has four moments within a few minutes, so they become one mark with a count; a stretch (the lease) lies under them. The second lane has a stretch under a bar.',
        topic: 'gantt',
        topicTitle: 'Run timeline',
        changed:
            'A lane&rsquo;s own stretch (a thin band, such as a lease or a wait) ran through the middle of the lane, so it passed behind the mark and under the count plate (&ldquo;+3&rdquo;) of a crowded mark, which looked like the plate lying on the band. Now the stretch stands on the foot of the lane&rsquo;s first row, under the marks and their plates, clear of both; where a bar and a stretch share a lane, the stretch is a line under the bar. The stretch&rsquo;s length, colour and the legend are as you approved them.',
        expect: [
            'The band is a thin line under the row; the triangle and the <b>+3</b> plate stand above it and never touch it.',
            'The same at 390 px, where the four moments are one mark with a count.',
        ],
        look: 'the stretch is a line at the foot of the row, with clear space between it and the mark and its count.',
        components: 'gantt',
        body: gantt('rr-zone', 'Refused attempts', ' data-kp-gantt-points'),
    }),
    section({
        id: 'gantt-frame',
        title: 'Run timeline: twelve lanes in the frame',
        intro: 'Twelve stacks, each with a name and a second line, in the timeline&rsquo;s frame, which shows about 22 rem of lanes and scrolls past that.',
        topic: 'gantt',
        topicTitle: 'Run timeline',
        changed:
            'The frame showed as much as fitted in its height, so the last visible lane was cut through its middle at the frame&rsquo;s edge, and the rules and bands behind the lanes ran on to that edge, past the lane. The height was also fixed once, so it went stale when lane names wrapped differently at another width. Now the frame shows whole lanes: the last lane that fits completely ends the frame, a scroll comes to rest on a lane&rsquo;s top, and the height is measured again when the width changes. A timeline whose lanes all fit is unchanged.',
        expect: [
            'The frame ends under a whole lane; the rules end there too. Nothing is cut through its middle.',
            'Scroll inside the frame: it stops on a lane&rsquo;s top. The legend under the frame is clear of the rules.',
        ],
        look: 'the last lane at the bottom of the frame is whole, and the vertical rules stop at the frame.',
        components: 'gantt',
        body: gantt('rr-frame', 'Twelve stacks'),
    }),
    section({
        id: 'gantt-rules',
        title: 'Run timeline: the minute rules and a bar&rsquo;s words',
        intro: 'A one-hour timeline with a queued job, a finished job and a failed job, lying across the quarter-hour rules.',
        topic: 'gantt',
        topicTitle: 'Run timeline',
        changed:
            'A queued bar is hollow, and its hollow had no ground of its own, so the quarter-hour rules behind it showed through: a line ran across the dashed bar, and through its words wherever a rule fell on them. Now a queued bar stands on the card&rsquo;s ground: still hollow, dashed and not filled, but nothing shows through it. Finished, failed and running bars already covered the rules. A page no longer has to time its bars to keep clear of a rule.',
        expect: [
            'The dashed queued bar shows no rule through it, although a quarter-hour rule lies under the bar and its words.',
            'The finished and failed bars are as before; the line for now stays over everything.',
        ],
        look: 'no rule is drawn through any bar&rsquo;s words.',
        components: 'gantt',
        body: `<div class="rr-stack"><section class="kp-gantt" id="rr-rules" data-kp-gantt data-kp-gantt-range="1h" aria-label="Jobs of the last hour"></section></div>`,
    }),
    section({
        id: 'uses-labels',
        title: 'Uses map: the names of the rows',
        intro: 'Which stack uses which service, as the grid view of the uses map. Some stack names are long.',
        topic: 'uses-map',
        topicTitle: 'Uses map',
        changed:
            'A row name was cut with an ellipsis (&ldquo;VAULTWARD&hellip;&rdquo;) because the label column had one fixed width. Now the column is as wide as its longest name (no narrower than before, at most 12 rem, 8 rem in a narrow box) and a longer name wraps onto more lines; the row grows to hold it. A column is never narrower than the longest word of its header, so a header is not broken inside a word. The cells, the marks, the pressed state and the keys are as you approved them.',
        expect: [
            'Every row name is whole: <b>Photos and family videos archive</b> and <b>Nightly database snapshots</b> stand on more than one line, short names on one.',
            'The headers over the columns are whole too. At 390 px the grid scrolls sideways inside its own box and the names stay whole.',
        ],
        look: 'no row or column name ends in an ellipsis, and the rows and cells line up.',
        components: 'matrix',
        body: `<div class="rr-stack"><div class="kp-matrix" id="rr-grid" data-kp-matrix></div></div>`,
    }),
    section({
        id: 'uses-line',
        title: 'Uses map: a line with a tone and a label',
        intro: 'The lines view of the same relation. Each line says how a stack uses a service: it writes there, it only reads, or it is blocked. Point at or press a name to light its lines.',
        topic: 'uses-map',
        topicTitle: 'Uses map',
        changed:
            'New: a line can carry a tone and a label. The page gives them where it says that a line exists (<code>cell()</code> returns <code>{ tone, label }</code>, the same object the grid view reads). The tone colours the line and gives it its own pattern, so colour is never alone: solid green for ok, dashed for a warning, dotted and heavier for bad, thin grey for muted. The label stands on the line in a small plate in the gap between the columns, never over a card, with the tone&rsquo;s mark (&check; ! &times; &ndash;) before it; a label wraps instead of being cut. Where a line has no free place for its plate, the plate shows while the line is lit. The node&rsquo;s spoken words and the phone list say it as well (&ldquo;Vaultwarden (writes here)&rdquo;). A map whose lines carry neither looks exactly as you approved it.',
        expect: [
            'In the first map every line has a plate between the columns, none over a card or over another plate.',
            'In the second, busier map some lines have no plate; point at a name and the plates of its lines appear. At 390 px the map becomes a list and each user chip carries its words.',
        ],
        look: 'the colour is backed by a pattern and a mark, and no plate touches a card.',
        components: 'matrix',
        body: `<div class="rr-stack">
<p class="rr-cap">A few lines, each with its words</p>
<div class="kp-matrix" id="rr-lines-few" data-kp-matrix data-kp-view="lines"></div>
<p class="rr-cap">Many lines: a plate that has no room shows while its line is lit</p>
<div class="kp-matrix" id="rr-lines-many" data-kp-matrix data-kp-view="lines"></div>
</div>`,
    }),
];

const body = sections.join('\n');
const pairs = sections.length;

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile))
    writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-2-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^r3r5-[0-9a-f]{8}-/.test(current) ? current : `r3r5-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Six fixes: run timeline lanes and frame, uses map names and line labels</title>
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
        <link rel="stylesheet" href="../kpadopt56/src/kpadopt6-calm/page.css" />
        <link rel="stylesheet" href="./page.css" />
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Six fixes: run timeline and uses map</h1>
                <p class="cat-intro">
                    The project threads found four faults in the run timeline (lane names cut, a stretch behind a count, a lane cut at the frame&rsquo;s edge,
                    rules through a queued bar) and one in the uses map (row names cut); the sixth is new, a line that carries a tone and a label. ${pairs}
                    pairs, all in formal. Each section says under <b>What changed since you approved it</b> what was wrong and what is different now.
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
console.log(`${ID}: ${sections.length} sections, ${pairs} pairs, round ${roundId}`);
