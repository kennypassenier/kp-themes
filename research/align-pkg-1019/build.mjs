// Builds research/align-pkg-1019/demo.html: six package components that the alignment check (research/_review/measure-align.mjs,
// Kenny 2026-10-19: everything on a grid, vertically aligned, never loose left alignment) found off a shared line on approved demos.
// They change approved components, so each comes back through the review dialog (DEMO_RULES ch. 7 and 9) with a plain
// "What changed" text. Formal only: none of the faults is theme-specific. The page is bundled into round-2-1019 afterwards (no
// catalogue/pages.js entry of its own).
//
//   1. feed-line       the actor chip and the time sat 2 px off the title's line      (css/components.css)
//   2. action-lead     a row's buttons were centred on the row, its badge on the first line  (css/components.css)
//   3. problems-cols   alerts in one list ended their text on different edges        (css/components.css)
//   4. stackbar-legend the value column was as wide as each row; labels were cut    (css/components.css, js/stackbar.js)
//   5. shortcuts-ends  the description cells ended where their words did             (css/components.css)
//   6. week-label      the label cells of a day's pills ended where their words did   (css/components.css)
//
// Run: node research/align-pkg-1019/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'align-pkg-1019';
const PAGE_THEMES = ['formal'];

/** One look-at line per theme asked. @param {string[]} themes @param {string} text */
const looks = (themes, text) => themes.map((t) => `<p data-for="${t}">${t[0].toUpperCase()}${t.slice(1)}: ${text}</p>`).join('\n');

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, changed: string, expect: string[], look: string, body: string, components: string, themes?: string[] }} s
 */
const section = (s) => {
    const themes = s.themes ?? ['formal'];
    return `
<section
    class="kc-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="${themes.join(',')}"
    data-review-topic="${s.id}"
    data-review-topic-title="${s.title}"
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
${looks(themes, s.look)}
    </div>
${s.body}
</section>`;
};

const frame = (/** @type {string} */ label, /** @type {string} */ inner, /** @type {number} */ width = 360) =>
    `<div class="af-frame"><p class="af-frame__label">${label}</p><div class="af-col" style="--af-w: ${width}px">\n${inner}\n</div></div>`;

const row = (/** @type {string} */ keys, /** @type {string} */ what, off = '') =>
    `<div class="kp-shortcuts__row${off ? ' kp-shortcuts__row--off' : ''}"><dt><kbd class="kp-palette__keys">${keys}</kbd></dt><dd>${what}${off ? `<span class="kp-shortcuts__reason">${off}</span>` : ''}</dd></div>`;

const sections = [
    section({
        id: 'feed-line',
        title: 'Activity feed: the chip and the time on the title’s line',
        intro: 'A day of a homelab&rsquo;s activity: a mark, the title, who started it and when. Below it the same rows with the actor as a mark only.',
        changed:
            'The chip of whoever started a row, and the time at the end of it, stood 2 px higher than the title they belong to: each was centred in its own, smaller line, while the title is set in the larger body size. They now share the title&rsquo;s baseline, the way a caption stands beside its heading, and the mark-only chip stands in a cell one title line high. The marks, the rail, the day headings, the states and the sizes are as you approved them.',
        expect: [
            'In every row the actor&rsquo;s name and the time sit on the same line as the title: the bottoms of the letters meet on one line.',
            'The chips stand in one column and the times in one column; the second feed shows only the round or square mark, centred on the title&rsquo;s line.',
        ],
        look: 'the name, the time and the title read on one line in every row; nothing hangs above it.',
        components: 'feed',
        body: `<div class="af-stack">
    <div class="kp-card af-card"><div class="kp-feed" data-kp-feed data-kp-feed-unit="operation,operations" aria-label="Activity of the homelab" data-af-feed="chip"></div></div>
    <div class="kp-card af-card"><div class="kp-feed" data-kp-feed data-kp-feed-actor="mark" data-kp-feed-unit="operation,operations" aria-label="Activity of the homelab, actors as marks" data-af-feed="mark"></div></div>
</div>`,
    }),
    section({
        id: 'action-lead',
        title: 'List with a lead: the buttons on the first line',
        intro: 'A list whose rows start with a badge, have a title with a sentence under it, and a button at the end.',
        changed:
            'The row&rsquo;s button was centred on the whole row, so beside a title with a sentence under it the button hung 21 px below the badge it belongs to. Now the badge, the title&rsquo;s first line and the buttons stand on one first line, as high as a button, and the sentence runs on below. A row of one line is as tall as before. The badges, the meta line, the rows&rsquo; rules and the narrow layout (buttons centred under the text) are as you approved them.',
        expect: [
            'In each row the badge, the bold title and the button are on one line; the grey sentence and the meta line are under the title.',
            'The buttons stand in one column, one width; at phone width they sit centred under the text as before.',
        ],
        look: 'the badge and the button share one centre line in every row, and the title starts on it.',
        components: 'action-list',
        body: `<div class="af-stack">
    <ul class="kp-action-list kp-action-list--lead af-list" aria-label="Foods without cooking" data-af-lead="one"></ul>
    <ul class="kp-action-list kp-action-list--lead af-list" aria-label="Messages" data-af-lead="two"></ul>
</div>`,
    }),
    section({
        id: 'problems-cols',
        title: 'Problems: alerts in one list share their columns',
        intro: 'Four problems at once, worst first, each with its fix; one can be dismissed.',
        changed:
            'Each alert was its own row, so the width of its button decided where its text ended: the text of one alert ended 56 px before the text of the next, and the fixes began on different edges. Now the alerts of one list share their columns: icon, text, fix and close have one edge each, from the first alert to the last. A list without a fix, the folded list and the narrow layout (the fix under the text) are as you approved them.',
        expect: [
            'The four alerts&rsquo; text ends on one vertical line and their fixes all start on one vertical line, whatever the button says.',
            'The close button of the dismissible alert stands in its own column at the end; the others leave that place empty.',
        ],
        look: 'one vertical edge for the end of the text and one for the start of the fixes, over all four alerts.',
        components: 'problems',
        body: `<div class="af-stack"><div class="kp-problems" data-kp-problems data-af-problems></div></div>`,
    }),
    section({
        id: 'stackbar-legend',
        title: 'Share bar: the legend is a table',
        intro: 'A bar split into parts with its legend, at the page&rsquo;s width and in a phone-wide frame with long names.',
        changed:
            'Each legend row sized its value to its own words, so the names ended and the values began on a different edge in every row (up to 36 px apart on a phone), and a name longer than its cell was cut with an ellipsis. Now the legend has one value column, as wide as the longest value, so the names all end and the values all start on one line, and a name is never cut: it wraps, with the swatch and the value on its first line. The bar, its colours, the hover card and the loading, empty and failed states are as you approved them.',
        expect: [
            'In the phone-wide legend the values all end on one edge and begin on one edge, and the names end on one edge before them.',
            'The long names (&ldquo;Photos and family videos archive&rdquo;, &ldquo;Promised, not written yet&rdquo;) wrap onto a second line whole; the swatch and the value stay on the first line.',
        ],
        look: 'the values form one column, right-aligned, and no name ends in an ellipsis.',
        components: 'stackbar',
        body:
            `<div class="af-stack"><figure class="kp-stackbar kp-stackbar--lg" data-af-stack="wide"></figure></div>` +
            frame('A phone, 360 px', `<figure class="kp-stackbar" data-af-stack="narrow"></figure>`, 360),
    }),
    section({
        id: 'shortcuts-ends',
        title: 'Shortcut sheet: the descriptions end on one edge',
        intro: 'The sheet of keys of a page: each key in the first column, what it does beside it, and a key that is off with its reason.',
        changed:
            'The description of a key was as wide as its words, so the cells ended on a different line in every row (3 to 107 px apart in a sheet). Now the description fills the rest of the row: it starts after the key column and ends on the sheet&rsquo;s own edge in every row. The words, the keys, the groups, the dimmed row for a key that is off and the sheet itself are as you approved them.',
        expect: [
            'The keys stand in one column and every description starts on one line next to them.',
            'The dimmed row (<b>r</b>) keeps its reason under its words; nothing else moves.',
        ],
        look: 'one left edge for all descriptions, and each row&rsquo;s cell reaches the sheet&rsquo;s inner edge.',
        components: 'shortcuts',
        body: `<div class="af-stack"><dialog class="kp-shortcuts af-static" aria-label="Keyboard shortcuts" open>
    <h3 class="kp-dialog__title">Keyboard shortcuts</h3>
    <section><h3 class="kp-shortcuts__group-label">Anywhere</h3><dl class="kp-shortcuts__list">
        ${row('?', 'Show all keys')}${row('/', 'Search')}${row('g s', 'Go to Stacks')}${row('g b', 'Go to Backups')}${row('Ctrl K', 'Open the command palette and run any command by name')}
    </dl></section>
    <section><h3 class="kp-shortcuts__group-label">On this page</h3><dl class="kp-shortcuts__list">
        ${row('1', 'Overview')}${row('2', 'Apps')}${row('r', 'Reveal the chosen key', 'Needs a key to be chosen first.')}
    </dl></section>
</dialog></div>`,
    }),
    section({
        id: 'week-label',
        title: 'Week agenda on a phone: the labels end on one edge',
        intro: 'The next seven days as rows, in a phone-wide frame: each day with its runs as pills, a time and a label.',
        changed:
            'In the day rows a pill&rsquo;s label was as wide as its words, so the label cells ended on a different line in every pill (15 px apart). Now the label fills the pill after the time and ends on the pill&rsquo;s own edge in every pill. The pills, their colours, the times, the &ldquo;+N&rdquo; and the empty, loading and failed states are as you approved them.',
        expect: [
            'Every pill shows its time and its label; the times start on one line and the labels start on one line.',
            'Nothing is cut or moves; the wide layout (a grid of seven columns) is unchanged.',
        ],
        look: 'the pills of every day are the same width, with the time and the label on one line.',
        components: 'week',
        body: frame(
            'A phone, 360 px',
            `<section class="kp-week" data-kp-week data-kp-time-zone="Europe/Brussels" aria-label="The next seven days" data-af-week></section>`,
            360,
        ),
    }),
];

const body = sections.join('\n');
const pairs = sections.reduce((n, s) => n + (/data-review-themes="([^"]+)"/.exec(s)?.[1].split(',').length ?? 1), 0);

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, bundledInto: 'round-2-1019', rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /^alignpkg-[0-9a-f]{8}-/.test(current) ? current : `alignpkg-${randomUUID()}`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="${PAGE_THEMES.join(',')}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Six components on a shared line: feed, list, problems, share bar, shortcuts, week</title>
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
                <h1>Six components on a shared line</h1>
                <p class="cat-intro">
                    The new alignment check measures whether the parts of a composition stand on one grid: cells of one role start and end on one
                    edge, and the first line of every cell is on the label&rsquo;s line. It found six approved components off by 2 to 56 px. ${pairs}
                    pairs, all in formal (none of the faults depends on the theme). Each section says under <b>What changed since you approved
                    it</b> what was off and what is different now.
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
