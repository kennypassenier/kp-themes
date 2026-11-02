// Builds research/gantt-fit-1101/demo.html: the run timeline that fits its width (`data-kp-gantt-scroll="fit"`), which Kenny chose on
// 2026-11-01 for Kitchen's cook mode ("Passend maken"). One review page, formal only, one section (DEMO_RULES ch. 1 and 6): Kitchen's cook
// plan drawn twice with the exact calls the app makes (kitchen-plan.js), once as the timeline does it today and once fitted, one above the
// other (DEMO_RULES ch. 7: never side by side), in a 390 px stage by default. demo.js wires the controls by the section's own elements;
// page.css is the frame.
// Run: node research/gantt-fit-1101/build.mjs (the page keeps its round id until the verdict is recorded; a round already answered gets a new one).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { demoVerdicts } from '../_review/verdicts-record.mjs';

const here = new URL('./', import.meta.url);
const ID = 'gantt-fit-1101';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The timeline exactly as Kitchen mounts it (kitchen/web/js/recipe/timeline.js mountTimeline), with or without `fit`. */
const timeline = (id, fit) =>
    `<section class="kp-gantt" id="${id}" data-kp-gantt data-kp-gantt-range="all" data-kp-gantt-toolbar="off" data-kp-gantt-legend="off" data-kp-gantt-hint="off" data-kp-gantt-ghosts="1 1"${fit ? ' data-kp-gantt-scroll="fit"' : ''} aria-label="Cooking timeline, one row per track${fit ? ', fitted' : ''}"></section>`;

/** A card around a timeline, as Kitchen's cook page holds it. */
const card = (id, title, note, fit) => `<section class="kp-card pg-timelinecard" aria-labelledby="${id}-t">
            <div class="kp-card__header"><h3 class="kp-card__title" id="${id}-t">${title}</h3></div>
            <p class="kp-card__body">${note}</p>
            <div class="kp-card__stage"><div class="kp-card__data pg-slot">${timeline(id, fit)}</div></div>
        </section>`;

const SECTIONS = [
    {
        id: 'gantt-fit',
        title: 'The run timeline fits its width',
        topic: 'gantt',
        topicTitle: 'The run timeline',
        item: 'your choice &ldquo;Passend maken&rdquo; for Kitchen&rsquo;s cook timeline, 2026-11-01',
        asked:
            'On a phone the timeline keeps a readable plot width and scrolls sideways inside its frame, so Kitchen&rsquo;s cook plan showed only its first half: the later bars and their labels stood past the frame&rsquo;s edge, and a lane with a running step kept an empty row. The new option <code>data-kp-gantt-scroll="fit"</code> lays the whole plan across the frame at every width, with no sideways scroll. Every bar&rsquo;s label stays whole: inside the bar when it fits, else after it, else before it, and only when there is no room beside it, on its own line right under the bar. A lane is as tall as the rows it uses. A timeline without the option is unchanged.',
        h2: 'Spaghetti: cooking now',
        intro:
            'Kitchen&rsquo;s cook plan in the middle of cooking: the water has boiled, the pasta is in the pan (the striped bar, with what is left of its ten minutes hatched after the red line for now), and the sauce and sitting down are still to do. The upper card is the timeline as it is today, the lower card the same plan fitted.',
        expected: [
            '<b>Phone, 390 px</b> (as it opens): the upper timeline scrolls sideways and its later bars and labels are out of sight. The lower one shows the whole plan from the first bar to &ldquo;Sit down&rdquo; without scrolling; no label is cut and none stands on the red line beside its bar. &ldquo;Boil the water&rdquo; has no room beside its bar and stands on its own line under it. No lane has an empty row at its foot.',
            '<b>Full width</b>: both show the whole plan; the lower one lays &ldquo;Cook the pasta&rdquo; after its hatched rest instead of over it, and its Pasta lane has no spare row (two rows, the upper three).',
            '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> drive both timelines: the busy card over the lanes, then the package&rsquo;s plate with its words and a normal Retry, at the timeline&rsquo;s full size.',
        ],
        look: 'Formal is a paper plate: thin rules, the track colours as soft plates with a firm edge, the words in the page&rsquo;s ink. Check that every label in the lower card reads whole and clearly belongs to its bar, and that the axis keeps readable times.',
        controls:
            group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']], 'gantt-fit-component') +
            group('Width', 'width', [['phone', 'Phone, 390 px', true], ['full', 'Full width']], 'gantt-fit-component'),
        component: `${card('pg-gantt-now', 'Today: keeps its width and scrolls', 'The timeline as Kitchen shows it now, without the option.', false)}
        ${card('pg-gantt-fit', 'Fitted: <code>data-kp-gantt-scroll="fit"</code>', 'The same plan with the new option.', true)}`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `        <section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}" data-review-topic-title="${s.topicTitle}" data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
            <div class="pg-asked"><p><b>What is asked</b> (${s.item}): ${s.asked}</p></div>
            <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
            <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
            <div data-review-look><p data-for="formal">${s.look}</p></div>
            <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
            <div id="${s.id}-component" class="pg-component" data-pg-width="phone">
        ${s.component}
            </div>
        </section>`;

/** The problems that stop the build: an item or an id twice, too many items. @returns {string[]} */
function problemsOf(body) {
    const problems = [];
    const ids = SECTIONS.map((s) => s.id);
    for (const id of new Set(ids)) if (ids.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
    if (SECTIONS.length * THEMES.length > MAX_ITEMS) problems.push(`${SECTIONS.length * THEMES.length} items: more than ${MAX_ITEMS}`);
    const seen = new Map();
    for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
    for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
    return problems;
}

/** The round id: kept until Kenny's answer to it is recorded (it is in `received`), then a new one. */
function roundOf(out) {
    const { verdicts, received } = demoVerdicts(here, { demo: ID, rounds: [] });
    const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
    const round = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) && !received.includes(current) ? current : `${ID}-${randomUUID()}`;
    return { round, received };
}

const body = SECTIONS.map(asSection).join('\n\n');
const problems = problemsOf(body);
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
const out = fileURLToPath(new URL('demo.html', here));
const { round, received } = roundOf(out);
const title = 'The run timeline fits its width';
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

    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main pg-page">
            <header class="pg-head">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    You chose to make Kitchen&rsquo;s cook timeline fit a phone&rsquo;s width (2026-11-01). Formal only, on Kitchen&rsquo;s own cook plan: the
                    spaghetti recipe its cook-mode checks use, two tracks, drawn with the calls the app makes. ${SECTIONS.length} section, ${SECTIONS.length * THEMES.length} pair.
                </p>
                <p>The section says under <b>Expected</b> what you should see and what each control does. The stage opens at a phone&rsquo;s 390 px.</p>
            </header>

${body}
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round, received })}
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
writeFileSync(out, page);
console.log(`${ID}: ${SECTIONS.length} items, round ${round}`);
