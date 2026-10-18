// Builds research/kpadopt56-formal/demo.html: the sections Kenny approved in formal whose package code changed afterwards
// (Kenny, 2026-10-18: S1 the refresh bar and the request filter stay in their card and the segmented track scrolls, S2 the
// version badge wraps, S3 the checklist detail wraps, S4 entity actions fold into More, S5 the chart's end labels stay inside the
// plot, S6 the availability answers stand under the name). They are judged again in formal alone (DEMO_RULES ch. 6 and 9: a
// visual question is a review demo, never a form).
//
// Same sections and data as the eleven-theme parts: every section is read from research/kpadopt56/src/<demo>/sections.html and
// every script and style is the source demo's own. Edit those sources or this builder, never the page.
//
// Run again after theme/t56-h is merged (S9 to S13, the state fixes): the sections in LATER below join the page by themselves
// once the package carries data-kp-ops-failed, the ops page gets its choice set (default plate, keep switchable), and nothing
// else needs editing.
//
// Run: node research/kpadopt56-formal/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const root = new URL('../../', import.meta.url);
const ID = 'kpadopt56-formal';

/** The source demos used, and whether their script ran before js/auto.js on their own page (as in build-parts.mjs). */
const DEMOS = /** @type {Record<string, { autoFirst: boolean }>} */ ({
    'kpadopt5-ops': { autoFirst: false },
    'kpadopt5-rows': { autoFirst: false },
    'kpadopt5-people': { autoFirst: false },
    'kpadopt6-ops': { autoFirst: true },
    'kpadopt6-media': { autoFirst: true },
    'kpadopt6-social': { autoFirst: false },
});

/**
 * Sections whose package code changed. `topic`/`title`: the section's topic in the dialog (the first section of a topic carries
 * the title). `changed`: what changed, in plain English, shown on the page. `expect`: the Expected bullet for the change.
 * `look`: the formal look-at line. `width`: add the 1280/390 width switch (the sections without a phone frame of their own).
 * @type {{ demo: string, id: string, topic: string, title?: string, changed: string, expect: string, look: string, width?: boolean }[]}
 */
const CHANGED = [
    {
        demo: 'kpadopt5-ops',
        id: 'auto-refresh',
        topic: 'bars',
        title: 'Bars that scroll sideways',
        changed:
            'The bar that chooses how often the page refreshes (the menu button and the row of segments) used to stick out past the right edge of its card at phone width. Now it stays inside the card, and the row of segments scrolls sideways.',
        expect: '<b>Changed, at 390 (use the width switch):</b> the whole control stays inside its card, nothing sticks out. The row of segments is a bar that scrolls: swipe, drag or use the arrow keys to reach <b>5 min</b> and the later choices. It settles on a whole choice, and only the side that has more choices fades. At <b>1280</b> everything fits: no scrolling, no fade.',
        look: 'At phone width the bar stays inside the card; the last choices are reached by scrolling the bar sideways; the side with more choices fades and the side with nothing more stays whole, with no choice cut in half at the edge. At desktop width nothing scrolls and nothing fades.',
        width: true,
    },
    {
        demo: 'kpadopt5-rows',
        id: 'request-inspector',
        topic: 'bars',
        changed:
            'The filter bar of the request inspector used to stick out past its card at phone width, and the request rows were cut by the card. Now the bar stays inside the card and scrolls sideways, and a narrow request row wraps whole items instead of tearing words (the path gets its own line).',
        expect: '<b>Changed, in the 390 px frame:</b> the filter bar stays inside the card and scrolls sideways to its last choices, fading on the side that has more. A request row shows its method and status badge whole (no torn word such as SUCCESS or TEST), the path on a line of its own and the time at the end.',
        look: 'In the 390 px frame the filter bar stays inside the card, scrolls to its last choices and fades on the side with more; a request row keeps its badges whole, with the path on its own line and nothing cut by the card edge.',
    },
    {
        demo: 'kpadopt6-ops',
        id: 'version',
        topic: 'version',
        title: 'Version badge',
        changed:
            'A long version part (such as the 12-character digest of gateway) used to run out past the version badge at phone width. Now the badge is never wider than its row and the long part wraps inside it.',
        expect: '<b>Changed, at 390 (use the width switch):</b> every badge, the digest of <b>gateway</b> included, stays inside its cell and the card; a long part wraps inside the badge. A normal version such as <b>10.11.11 &rarr; 12.1</b> still breaks only after a dot or a hyphen.',
        look: 'At phone width the digest of gateway wraps inside its badge instead of running out past it; normal versions are unchanged and still break only after a dot or hyphen; the loud (major) badge keeps its plate and its double rule.',
        width: true,
    },
    {
        demo: 'kpadopt6-ops',
        id: 'version-states',
        topic: 'version',
        changed: 'The same version badge change, in the sample with very long versions and the phone frame: a long part wraps inside the badge.',
        expect: '<b>Changed:</b> the long versions and the phone frame show the badge capped at its row, with an over-long part broken inside the word; nothing runs out of the badge or the card.',
        look: 'The very long versions wrap inside their badge, at desktop width and in the 390 px frame; the badge never runs past the row or the card.',
    },
    {
        demo: 'kpadopt6-media',
        id: 'print-checklist',
        topic: 'checklist',
        title: 'Checklist detail',
        changed:
            'In the checklist on screen, the small detail beside an item used to squeeze the item name to a few letters (broken words) at phone width. Now the detail wraps inside at most half of the row and the name keeps its words.',
        expect: '<b>Changed, at 390 (use the width switch):</b> in <b>The list on screen</b> every item name keeps whole words; a long detail wraps in at most half of the row; a short detail stays on one line; nothing runs past the list. The four paper sheets are not affected.',
        look: 'At phone width the detail beside an item wraps inside at most half the row, and the item name keeps its whole words; a short detail stays on one line and the list never runs past its frame.',
        width: true,
    },
    {
        demo: 'kpadopt6-ops',
        id: 'entity',
        topic: 'entity',
        title: 'Entity card',
        changed:
            'The buttons at the foot of an entity card used to break their words when the card was narrow. Now an action that does not fit folds into <b>More</b>, the same way for every card of the grid, so all cards still have the same height.',
        expect: '<b>Changed, at 390 and 1280 (use the width switch):</b> the actions that fit stand side by side with whole words; those that do not fit are in the <b>More</b> menu, and every card of the grid folds the same actions. The cards stay one height.',
        look: 'Narrow cards keep whole button words; the actions that do not fit are folded into More, the same on every card of the grid, and More opens on a readable plate; the cards keep one height.',
        width: true,
    },
    {
        demo: 'kpadopt6-ops',
        id: 'entity-states',
        topic: 'entity',
        changed: 'The same folding of entity card actions, in the loading, empty and failed samples and in the phone frame.',
        expect: '<b>Changed:</b> in the 390 px frame the actions that do not fit are in <b>More</b>; loading, empty and failed keep the footprint of a loaded card.',
        look: 'In the 390 px frame the actions that do not fit are in More and every word is whole; loading, empty and failed keep the size of a loaded card.',
    },
    {
        demo: 'kpadopt5-people',
        id: 'chart-annotations',
        topic: 'chart',
        title: 'Charts',
        changed:
            'The first and the last date label under the chart used to stick out of the plot (the last one by about 26 px on the right, the first by about 6 px on the left). Now both are anchored inside the plot.',
        expect: '<b>Changed, in every chart, in the desktop and in the 390 px frame:</b> the first date label starts at the left edge of the plot and the last one ends at its right edge; no label is cut or crosses the frame. The labels between them are unchanged.',
        look: 'The first and last labels under the time axis stand inside the plot, at both widths; nothing crosses the chart frame; the labels in between are unchanged.',
    },
    {
        demo: 'kpadopt6-media',
        id: 'uses-lines',
        topic: 'chart',
        changed:
            'Nothing in this map was changed by the package fixes. It is here only because it was asked together with the chart; judge it as approved.',
        expect: '<b>Unchanged:</b> the map, the grid view and the pinned lights behave as approved.',
        look: 'Nothing was changed here: the cards, lines and labels look as you approved them, and no text touches a card edge.',
        width: true,
    },
    {
        demo: 'kpadopt6-social',
        id: 'availability-grid',
        topic: 'availability',
        title: 'Availability grid',
        changed:
            'On a phone, the row with your own answer put the answer buttons beside your name and squeezed the name to a few pixels. Now the answers stand under the name.',
        expect: '<b>Changed, in the 390 px frames:</b> in your own row the name <b>Kenny (you)</b> has the full width of the row and the answer buttons are on a line under it. At desktop width the grid is as approved.',
        look: 'On a phone your own name has the full row and the answer buttons stand under it; nothing is squeezed or cut. At desktop width the grid is as approved.',
    },
];

/**
 * Sections that wait for theme/t56-h (S9 to S13, the state changes): they join the page once the package carries the ops page
 * failed option. `choices`: a choice set for the section (DEMO_RULES ch. 7: asks only the default, both options real).
 * @type {{ demo: string, id: string, topic: string, title?: string, changed: string, expect: string, look: string, choices?: string, width?: boolean }[]}
 */
const LATER = [
    {
        demo: 'kpadopt6-media',
        id: 'gallery-grid',
        topic: 'gallery',
        title: 'Gallery',
        changed:
            'While the gallery loads, its busy card now stands over the whole gallery, centred, and the tiles keep their square footprint (S10).',
        expect: '<b>Changed:</b> press <b>Loading</b>: one busy card, centred over the whole gallery, and the gallery keeps the height it had when loaded.',
        look: 'The busy card is centred over the whole gallery, not over one tile, and the gallery keeps its loaded height.',
    },
    {
        demo: 'kpadopt6-media',
        id: 'gallery-states',
        topic: 'gallery',
        changed: 'The same gallery change, in the states sample: loading, empty and failed hold the loaded height (S9, S10).',
        expect: '<b>Changed:</b> loading, empty and failed fill the footprint of a loaded gallery.',
        look: 'Loading, empty and failed keep the size of the loaded gallery and sit centred in it.',
    },
    {
        demo: 'kpadopt5-ops',
        id: 'ops-page',
        topic: 'ops-page',
        title: 'Operations page',
        changed:
            'A failed operations page used to keep the stale cards under one red band. Now, by default, one alert plate takes the whole body, centred, at the height the page had (S13). The old behaviour stays available as an option.',
        expect: '<b>Changed:</b> press <b>Page failed</b>: with the default <b>Plate</b> one centred alert with its Retry replaces the cards; with <b>Keep the cards</b> the cards stay and a red band sits on top. Switch live with the choice in the dialog (<code>data-kp-ops-failed</code>).',
        look: 'A failed page is one prominent plate, centred in the page, at the height of the loaded page, with a normal-size Retry; the keep option brings the earlier band over the cards back.',
        choices: JSON.stringify([
            {
                id: 'ops-failed',
                label: 'A failed operations page',
                default: 'plate',
                options: [
                    {
                        value: 'plate',
                        label: 'Plate',
                        hint: 'One alert plate takes the whole body of the page, centred, at the height the page had.',
                    },
                    {
                        value: 'keep',
                        label: 'Keep the cards',
                        hint: 'The earlier behaviour: the cards and their data stay, one red band sits on top.',
                    },
                ],
            },
        ]),
    },
];

const read = (/** @type {string} */ path, base = here) => readFileSync(fileURLToPath(new URL(path, base)), 'utf8');
const escapeAttr = (/** @type {string} */ s) => s.replace(/&/g, '&amp;').replace(/'/g, '&#39;');

/** @type {Map<string, { id: string, text: string }[]>} */
const sources = new Map();
for (const demo of Object.keys(DEMOS)) {
    const html = read(`../kpadopt56/src/${demo}/sections.html`);
    /** @type {{ id: string, text: string }[]} */
    const list = [];
    for (const m of html.matchAll(/<!-- ===== item: (\S+) \(from [^)]*\) -->\n([\s\S]*?)\n\n(?=<!-- ===== item: |$)/g))
        list.push({ id: m[1], text: m[2] });
    sources.set(demo, list);
}

/** True once the package carries the ops page failed option (theme/t56-h merged). */
const hasStateFixes = /data-kp-ops-failed/.test(read('css/components.css', root));
const WANTED = hasStateFixes ? [...CHANGED, ...LATER] : CHANGED;

/** The index just after the `</div>` that closes the `<div` opened at `start`. @param {string} text @param {number} start */
function endOfDiv(text, start) {
    let depth = 0;
    for (const m of text.slice(start).matchAll(/<div\b|<\/div>/g)) {
        depth += m[0] === '</div>' ? -1 : 1;
        if (depth === 0) return start + (m.index ?? 0) + m[0].length;
    }
    throw new Error('unbalanced <div>');
}

const WIDTH_GROUP = `<div role="group" aria-label="Width of the section">
    <b>Width:</b>
    <button type="button" class="kp-button kp-button--sm" data-k56f-width="full" aria-pressed="true">Full width (1280)</button>
    <button type="button" class="kp-button kp-button--sm" data-k56f-width="phone" aria-pressed="false">Phone (390)</button>
</div>`;

/** @param {typeof CHANGED[number] & { choices?: string }} spec */
function section(spec) {
    const src = sources.get(spec.demo)?.find((s) => s.id === spec.id);
    if (!src) throw new Error(`${spec.demo}/${spec.id} has no source`);
    let text = src.text;

    // Topic: our own grouping (one component kind per topic), not the source demo's.
    text = text.replace(/\s+data-review-topic="[^"]*"/, '').replace(/\s+data-review-topic-title="[^"]*"/, '');
    text = text.replace(
        /(data-review-item="[^"]*")/,
        `$1 data-review-topic="${spec.topic}"${spec.title ? ` data-review-topic-title="${spec.title}"` : ''}${spec.choices ? ` data-review-choices='${escapeAttr(spec.choices)}'` : ''}`,
    );

    // The look-at line: formal only, saying what changed.
    const looks = text.match(/<div data-review-look>[\s\S]*?<\/div>/g) ?? [];
    if (looks.length !== 1) throw new Error(`${spec.id}: ${looks.length} look-at blocks`);
    text = text.replace(looks[0], `<div data-review-look>\n<p data-for="formal">${spec.look}</p>\n</div>`);

    // What changed, on the page, before the Expected block; and the change as one more Expected bullet.
    const expected = /<div class="[a-z0-9]+-expect(?:ed)?">/.exec(text);
    if (!expected) throw new Error(`${spec.id}: no Expected block`);
    const box = `<div class="k56f-changed"><p><b>What changed since you approved it:</b> ${spec.changed}</p></div>\n`;
    text = text.slice(0, expected.index) + box + text.slice(expected.index);
    const after = text.indexOf(expected[0]);
    const close = text.indexOf('</ul>', after);
    if (close < 0) throw new Error(`${spec.id}: Expected block has no list`);
    text = `${text.slice(0, close)}<li class="k56f-expect-changed">${spec.expect}</li>\n${text.slice(close)}`;

    if (spec.width) {
        // The width switch joins the section's controls, and everything after the controls stands in the stage it narrows.
        const existing = /<div\b[^>]*data-review-controls[^>]*>/.exec(text);
        if (existing) {
            const open = existing.index;
            const innerAt = open + existing[0].length;
            text = `${text.slice(0, innerAt)}\n${WIDTH_GROUP}\n${text.slice(innerAt)}`;
            const end = endOfDiv(text, open);
            text = stage(text, end);
        } else {
            const lookEnd = text.indexOf('</div>', text.indexOf('<div data-review-look>')) + '</div>'.length;
            const controls = `\n<div class="k56f-controls" data-review-controls>\n${WIDTH_GROUP}\n</div>`;
            text = text.slice(0, lookEnd) + controls + text.slice(lookEnd);
            text = stage(text, lookEnd + controls.length);
        }
    }
    return text;
}

/** Wraps what follows `at` up to the section's end in the width stage. @param {string} text @param {number} at */
function stage(text, at) {
    const end = text.lastIndexOf('</section>');
    return `${text.slice(0, at)}\n<div class="k56f-stage" data-k56f-stage data-k56f-width="full">${text.slice(at, end)}</div>\n${text.slice(end)}`;
}

/** A scrolling segmented control, three bars at rest, mid-scroll and at the end, and a roomy one. */
function segmentedSection() {
    const choices = [
        ['all', 'All', 48],
        ['changed', 'Changed', 12],
        ['added', 'Added', 9],
        ['removed', 'Removed', 3],
        ['renamed', 'Renamed', 5],
        ['moved', 'Moved', 7],
        ['conflicts', 'Conflicts', 2],
        ['ignored', 'Ignored', 14],
    ];
    const bar = (
        /** @type {string} */ id,
        /** @type {string} */ at,
    ) => `<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Show files" id="${id}" data-k56f-seg-at="${at}">
${choices
    .map(
        ([value, label, count], i) =>
            `<button type="button" class="kp-segmented__item" data-value="${value}" role="radio" aria-checked="${i === 0}"><span class="kp-segmented__label">${label}</span><span class="kp-segmented__count">${count}</span></button>`,
    )
    .join('\n')}
</div>`;
    const frame = (
        /** @type {string} */ label,
        /** @type {string} */ id,
        /** @type {string} */ at,
        /** @type {string} */ cls,
    ) => `<div class="k56f-case">
<p class="k56f-label">${label}</p>
<div class="k56f-frame ${cls}">
${bar(id, at)}
</div>
</div>`;
    return `<section class="k56f-sec" id="segmented-scroll" data-review-item="segmented-scroll" data-review-components="segmented" data-review-topic="bars" data-review-title="A scrolling segmented control" aria-labelledby="h-segmented-scroll">
<div class="k56f-sec__head">
<h2 id="h-segmented-scroll">A scrolling segmented control</h2>
<p>
<code>.kp-segmented</code> with <code>js/segmented.js</code>: when its choices are wider than the room, the bar scrolls sideways inside itself. This
applies to every segmented control in the package, so it is shown on its own, at 390 px, three times: at rest, scrolled to the middle and scrolled to the end.
The files and counts are sample data.
</p>
</div>
<div class="k56f-changed"><p><b>What changed since you approved it:</b> a segmented bar that is wider than its room used to be cut off at the clip edge, with half a choice showing. Now it snaps to whole choices when it settles, and the side that has more choices fades out, while the side with nothing beyond it stays whole.</p></div>
<div class="k56f-expected">
<p><b>Expected:</b></p>
<ul>
<li><b>At rest:</b> the first choice (All 48) stands whole against the left edge, not faded; the right edge fades, because there are more choices.</li>
<li><b>Mid-scroll:</b> both edges fade, because there are choices on both sides; the choice at each edge is whole or fades out smoothly, never a hard cut.</li>
<li><b>At the end:</b> the last choice (Ignored 14) stands whole against the right edge, not faded; only the left edge fades.</li>
<li><b>Full width:</b> everything fits, so the bar does not scroll and nothing fades.</li>
<li>Scroll each bar with a swipe, a trackpad, a drag or the arrow keys (Home and End jump): it settles on a whole choice. <b>Put the three bars back</b> returns them to their positions.</li>
</ul>
</div>
<div data-review-look>
<p data-for="formal">At 390 the bar scrolls and snaps to whole choices; at rest only the right edge fades, mid-scroll both do, at the end only the left; the full-width bar neither scrolls nor fades. No text touches the cut edge, and the chosen choice keeps its plate.</p>
</div>
<div class="k56f-controls" data-review-controls>
<div role="group" aria-label="Positions">
<b>Positions:</b>
<button type="button" class="kp-button kp-button--sm" data-k56f-seg-reset>Put the three bars back</button>
</div>
</div>
<div class="k56f-stage-grid">
${frame('390 px, at rest', 'k56f-seg-rest', 'start', 'k56f-frame--phone')}
${frame('390 px, scrolled to the middle', 'k56f-seg-mid', 'middle', 'k56f-frame--phone')}
${frame('390 px, scrolled to the end', 'k56f-seg-end', 'end', 'k56f-frame--phone')}
${frame('Full width: room enough, no scrolling', 'k56f-seg-full', 'none', 'k56f-frame--full')}
</div>
</section>`;
}

// Page assembly: all sections in the order of WANTED, with the new segmented section after the two bars it belongs to.
const bodyParts = [];
for (const spec of WANTED) {
    bodyParts.push(section(spec));
    if (spec.id === 'request-inspector') bodyParts.push(segmentedSection());
}
const body = bodyParts.join('\n\n');
const shown = new Set(WANTED.map((s) => `${s.demo}/${s.id}`));
const demos = Object.keys(DEMOS);
/** Laid aside: the source demos' other sections stay on the page, hidden, because their scripts wire them by id. */
const aside = demos
    .flatMap((d) => (sources.get(d) ?? []).filter((s) => !shown.has(`${d}/${s.id}`)))
    .map((s) => s.text.replace(/\bdata-review-(item|topic|topic-title|title|components|themes|choices|motion)=/g, 'data-kpadopt56-$1='))
    .join('\n');

/** @type {string[]} */
const problems = [];
const seen = new Map();
for (const m of `${body}\n${aside}`.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);

// A page round id never collides and is never reused: keep the id while its answer is not received, else take a fresh one.
const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((/** @type {any} */ r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && !received.includes(current) && /^formal-[0-9a-f]{8}-/.test(current) ? current : `formal-${randomUUID()}`;

const styles = ['../kpadopt56/part.css', './page.css', ...demos.map((d) => `../kpadopt56/src/${d}/page.css`)];
const script = (/** @type {string} */ d) => `        <script type="module" src="../kpadopt56/src/${d}/demo.js"></script>`;
const demoFirst = demos.filter((d) => !DEMOS[d].autoFirst);
const autoFirst = demos.filter((d) => DEMOS[d].autoFirst);
const pairs = WANTED.length + 1;
const hook = hasStateFixes
    ? ''
    : `
            <!-- HOOK for theme/t56-h (S9 to S13, the state fixes): they are not on this branch yet. After that branch is merged, run
                 node research/kpadopt56-formal/build.mjs again: the gallery and the operations page (with its failed option choice set,
                 default plate, keep switchable: data-kp-ops-failed) join this page by themselves. -->
`;

const page = `<!doctype html>
<html lang="en" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Fifth and sixth adoption rounds in formal, again: what the package fixes changed</title>
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
${styles.map((s) => `        <link rel="stylesheet" href="${s}" />`).join('\n')}
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main k56-page">
            <header class="k56-intro">
                <h1>Approved in formal, changed since: judge it again</h1>
                <p class="cat-intro">
                    You approved these components in formal. The shared package code changed after that, so formal looks different here and
                    needs your eye again: ${pairs} sections, one step in the review dialog. Each section says under <b>What changed since you
                    approved it</b> what is different, and under <b>Expected</b> what to check; where it helps, a <b>Width</b> switch in the
                    dialog shows the section at 1280 and at 390 (a phone).
                </p>
            </header>
${hook}
${body}

            <div hidden style="display: none" data-kpadopt56-other>
${aside}
            </div>
        </main>
        <script type="application/json" data-review-round>
            ${JSON.stringify({ round: roundId, received })}
        </script>
${demoFirst.map(script).join('\n')}
        <script type="module" src="../../js/auto.js"></script>
${autoFirst.map(script).join('\n')}
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
const config = (await prettier.resolveConfig(out)) ?? {};
try {
    writeFileSync(out, await prettier.format(page, { ...config, filepath: out }));
} catch (error) {
    writeFileSync(`${out}.unformatted`, page);
    throw new Error(`prettier cannot read the page (kept as ${out}.unformatted): ${/** @type {Error} */ (error).message.split('\n')[0]}`);
}
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}
console.log(
    `${ID}: ${pairs} sections, ${pairs} pairs (formal), state fixes ${hasStateFixes ? 'included' : 'not on this branch yet (hook left)'}, round ${roundId}`,
);
