// Builds research/r1r2-1019/demo.html: two approved components that kept a small state line instead of the state plate
// (Kenny, 2026-10-16 "de hele grootte van de component gebruiken"; 2026-10-19 grid and alignment). They change components he
// approved, so they come back through the review dialog (DEMO_RULES ch. 7 and 9), in formal (both fixes are the theme's own plate),
// with a plain "What changed" text per section. The page is bundled into round-2-1019 afterwards (VERDICTS.json `bundledInto`).
//
//   1. calendar-states   the month calendar in its standard tones: a plate over the grid for empty and failed, with Retry (js/calendar.js)
//   2. pipeline-states   the pipeline board: a plate over the whole board, a failing lane, lane names that wrap (js/pipeline.js)
//
// Run: node research/r1r2-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'r1r2-1019';
const THEMES = ['formal'];

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
const section = (s) => `
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
        id: 'calendar-states',
        topic: 'calendar',
        topicTitle: 'Month calendar and pipeline',
        title: 'Month calendar: empty and failed month',
        intro: 'A month of backup nights, a plate in the colour of each day. Press a state: the month waits, has nothing to show, or could not be read; a failed month has a Retry.',
        changed:
            'In its normal colours (ok, warn, bad) a calendar with nothing to show or that could not be read was one small grey line under the month, with the days still drawn as grey plates and no Retry. Only the calm calendar had a plate. Now every calendar puts the package&rsquo;s state plate over its six weeks: the words at heading size and centred, and for a failed month a normal-size Retry (<code>kp-calendar-retry</code>); the weeks stay under it, dimmed, and nothing under a failed plate can be pressed. The plate sits on the same left and right edges as the month title and the legend, from the weekday row to the last week. The calm calendar&rsquo;s words, the loading pulse and a loaded month are as you approved them.',
        expect: [
            '<b>Empty</b>: one plate over the whole grid of weeks, the page&rsquo;s sentence at heading size and centred; the month title, Prev, Next and Today stay above it.',
            '<b>Failed</b>: the same plate in red with a <b>Retry</b> of normal size; pressed, the days pulse for a moment and the month returns.',
            'The legend stays under the grid and the page does not jump between <b>Ready</b>, <b>Empty</b> and <b>Failed</b>.',
            '<b>Ready</b> and <b>Loading</b> as you approved them. <b>Calm</b> keeps its own words.',
        ],
        look: 'the plate fills the grid of weeks, its words centred, Retry a normal button; no second line of the same words under the month.',
        components: 'calendar',
        groups: `${group('state', 'State', STATES4)}${group('tones', 'Colours', [
            ['standard', 'Standard'],
            ['calm', 'Calm'],
        ])}`,
        stage: `<section class="kp-calendar" data-kp-calendar data-kp-calendar-month="2026-10" data-kp-time-zone="Europe/Brussels" aria-label="Nightly backups"></section>`,
    }),
    section({
        id: 'pipeline-states',
        topic: 'calendar',
        title: 'Pipeline: failed board, a failing lane and lane names',
        intro: 'Where each application stands, a lane for each stage. Press a state; a failed board has Try again, one lane can be marked as failing, and long stage names are shown in full.',
        changed:
            'A failed or empty board was a thin strip above lanes that went on showing a count of 0, so a board that could not be read looked like a board with nothing on it; a lane could not be marked as failing; and a long stage name ended in an ellipsis. Now an empty or failed board is the package&rsquo;s state plate over the whole board at the height the board had: the heading centred, the reason under it, a normal-size Try again. A lane marked <code>danger</code> has the red status plate and says &ldquo;Needs attention&rdquo; in words. Stage names wrap on to a second line, and all name plates, share lines and first cards of the lanes start on the same lines. The loading card and a loaded board are as you approved them.',
        expect: [
            '<b>Failed</b>: one red plate over the whole board with &ldquo;Could not read the board.&rdquo;, the reason under it and <b>Try again</b>; no lane and no count of 0 behind it.',
            '<b>Empty</b>: the same plate, neutral, with the sentence; the board keeps the height it had.',
            '<b>Failing lane</b>: the third lane&rsquo;s name plate is red with the words <b>Needs attention</b>; the other lanes are unchanged.',
            'The long stage name <b>Awaiting the reference letter</b> wraps on two lines, every name plate is as high as the highest, and the counts, shares and first cards line up across the lanes.',
        ],
        look: 'the plate covers the lanes and the closed row; names are whole words; plates, shares and first cards sit on one line across the lanes (also at 390 px).',
        components: 'pipeline',
        groups: group('state', 'State', [
            ['ready', 'Ready'],
            ['danger', 'Failing lane'],
            ['loading', 'Loading'],
            ['empty', 'Empty'],
            ['error', 'Failed'],
        ]),
        stage: `<section class="kp-pipeline" data-kp-pipeline data-kp-pipeline-limit="3" aria-label="Applications by stage"></section>`,
    }),
];

const body = sections.join('\n');

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^r1r2-[0-9a-f]{8}-/.test(current) ? current : `r1r2-${randomUUID()}`;
const pairs = THEMES.length * sections.length;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Calendar and pipeline states</title>
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
                <h1>Calendar and pipeline states</h1>
                <p class="cat-intro">
                    Your rule is that a failed or empty component fills the whole size it has with its data, centred, with a normal-size Retry, and
                    that everything sits on a grid. Two components you approved still kept a small line: the month calendar in its normal colours,
                    and the pipeline board, whose lanes also went on showing a count of 0 behind a failure. Both use the package&rsquo;s one state
                    plate now, the pipeline can mark a lane as failing, and its stage names wrap instead of ending in an ellipsis. ${sections.length}
                    sections, formal only (both fixes are the theme&rsquo;s own plate, so the other themes follow). Each section says under <b>What
                    changed since you approved it</b> what was wrong and what is different now. Press a state under the section&rsquo;s title to see it.
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
