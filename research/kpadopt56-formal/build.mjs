// Builds research/kpadopt56-formal/demo.html: the sections Kenny approved in formal whose package code changed afterwards
// (Kenny, 2026-10-18: S1 the refresh bar and the request filter stay in their card and the segmented track scrolls, S2 the
// version badge wraps, S3 the checklist detail wraps, S4 entity actions fold into More, S5 the chart's end labels stay inside the
// plot, S6 the availability answers stand under the name). They are judged again in formal alone (DEMO_RULES ch. 6 and 9: a
// visual question is a review demo, never a form).
//
// Same sections and data as the eleven-theme parts: every section is read from research/kpadopt56/src/<demo>/sections.html and
// every script and style is the source demo's own. Edit those sources or this builder, never the page.
//
// The state fixes of the same night (S9 to S14: a state holds the loaded height, a card's and a chart's failure is a plate, the
// gallery's busy card covers the whole gallery, a checklist's failed box and a rating's failed plate fill their box, a state
// plate's Retry is a normal button, the operations page's failed option) are sections of this page too, grouped by the kind of
// component. The ops page carries the one choice set (default plate, keep switchable live, "Remove this option" from the kit).
//
// Run: node research/kpadopt56-formal/build.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { declareControls } from '../kpadopt56/controls-for.mjs';

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
    'kpadopt5-basics': { autoFirst: true },
    'kpadopt6-calm': { autoFirst: false },
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
        title: 'Checklists',
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
        changed:
            'Two changes. The same folding of entity card actions, in the phone frame. And the grid now holds the height it had when loaded: Loading, Nothing and Failed used to leave the grid about 200 px away from the height of the loaded cards, so the page below jumped; now they fill the same height, and the Retry in the failed plate is a normal-size button.',
        expect: '<b>Changed:</b> in the 390 px frame the actions that do not fit are in <b>More</b>. Press <b>Loading</b>, <b>Nothing</b> and <b>Failed</b> after <b>Cards</b>: the grid keeps the height of the loaded cards each time and the plate is centred in it; <b>Retry</b> is a normal-size button.',
        look: 'In the 390 px frame the actions that do not fit are in More and every word is whole. Loading, nothing and failed keep the height of the loaded grid, with the plate centred and a normal-size Retry.',
    },
    {
        demo: 'kpadopt5-people',
        id: 'chart-annotations',
        topic: 'chart',
        title: 'Charts',
        changed:
            'Two changes. The first and the last date label under the chart used to stick out of the plot (the last one by about 26 px on the right, the first by about 6 px on the left); now both are anchored inside the plot. And a chart that could not be read used to show only a red dot and one small sentence with nothing to press; now it is formal&rsquo;s own failed alert (a red bar on its left edge, not a tinted rectangle with a dot) over the height of the plot, the sentence at heading size and a normal-size <b>Retry</b> under it.',
        expect: '<b>Changed, in every chart, in the desktop and in the 390 px frame:</b> the first date label starts at the left edge of the plot and the last one ends at its right edge; no label is cut or crosses the frame. The labels between them are unchanged. <b>Press Failed</b>: one red-edged plate fills the plot, the sentence is at heading size and <b>Retry</b> is a normal button; pressing Retry shows the loading state and the chart comes back.',
        look: 'The first and last labels under the time axis stand inside the plot, at both widths, and nothing crosses the chart frame. Failed is one plate over the plot with a normal-size Retry, not a dot and a line of small text.',
    },
    {
        demo: 'kpadopt6-social',
        id: 'availability-grid',
        topic: 'availability',
        title: 'Availability grid',
        changed:
            'On a phone, the row with your own answer put the answer buttons beside your name and squeezed the name to a few pixels. Now the answers stand under the name. Also, in the 390 px frame with "A list per column", pressing <b>Loading</b> used to show an empty frame; now the waiting grid fills the frame the list had, with the busy card centred over it.',
        expect: '<b>Changed, in the 390 px frames:</b> in your own row the name <b>Kenny (you)</b> has the full width of the row and the answer buttons are on a line under it. Choose <b>A list per column</b> and press <b>Loading</b>: the frame is not empty, the busy card is centred over the waiting grid. At desktop width the grid is as approved.',
        look: 'On a phone your own name has the full row and the answer buttons stand under it; nothing is squeezed or cut. At desktop width the grid is as approved.',
    },
];

/**
 * The sections of the state fixes (S9 to S14). `choices`: a choice set for the section (DEMO_RULES ch. 7: asks only the default,
 * both options real).
 * @type {{ demo: string, id: string, topic: string, title?: string, changed: string, expect: string, look: string, choices?: string, width?: boolean }[]}
 */
const STATE_FIXES = [
    {
        demo: 'kpadopt6-media',
        id: 'gallery-grid',
        topic: 'gallery',
        title: 'Gallery',
        changed:
            'Two changes. While the gallery loads, its busy card now stands over the whole gallery, centred (it used to sit at the top, over a thin strip of waiting lines, with its panel cut off). And a waiting tile keeps its square size instead of shrinking to a line of 16 to 24 px.',
        expect: '<b>Changed:</b> press <b>Loading</b>: one busy card, centred over the whole gallery, over waiting tiles that are as big as the real tiles; the gallery keeps the height it had when loaded.',
        look: 'The busy card is centred over the whole gallery, not over one tile, and the gallery keeps its loaded height.',
    },
    {
        demo: 'kpadopt6-media',
        id: 'gallery-states',
        topic: 'gallery',
        changed:
            'The same gallery changes, in the states sample. Loading, empty and failed now hold the height of the loaded gallery (before, the gallery collapsed to a strip), and the Retry in the failed plate is a normal-size button.',
        expect: '<b>Changed:</b> press <b>Loading</b>, <b>Empty</b> and <b>Failed</b>: each fills the footprint of the loaded gallery, with the plate centred and a normal-size <b>Retry</b>.',
        look: 'Loading, empty and failed keep the size of the loaded gallery and sit centred in it.',
    },
    {
        demo: 'kpadopt5-ops',
        id: 'ops-page',
        topic: 'ops-page',
        title: 'Operations page',
        changed:
            'A failed operations page used to keep the stale cards under one red band. Now, by default, one alert plate takes the whole body, centred, at the height the page had The old behaviour stays available as an option.',
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

/**
 * Sections for the other state changes: a card's failure is a plate, a state holds the loaded height, a checklist's failed box,
 * a rating's failed plate, a state plate's Retry at control size.
 * @type {{ demo: string, id: string, topic: string, title?: string, changed: string, expect: string, look: string, choices?: string, width?: boolean }[]}
 */
const ADDED = [
    {
        demo: 'kpadopt6-calm',
        id: 'quote-states',
        topic: 'cards',
        title: 'Card that could not be read',
        changed:
            'When a card could not be read it showed a small alert row at the top: the words on the left, Retry on the right, at body size, filling only about a third to two thirds of the card. Now the failure is one plate that fills the whole card, centred: the title at heading size, the sentence under it and a normal-size <b>Retry</b> button. The card grows a little while it is failed, because the plate needs room for a heading, a sentence and a button.',
        expect: '<b>Changed:</b> press <b>Could not read</b>: the plate fills the whole quote card, centred, with <b>Could not read your notes</b> at heading size and a normal <b>Retry</b>; the card is not a strip any more.',
        look: 'A failed quote card is one plate over the whole card, centred, title at heading size, sentence at body size, Retry a normal button; nothing is a thin row at the top.',
    },
    {
        demo: 'kpadopt6-calm',
        id: 'today-states',
        topic: 'cards',
        changed:
            'The same change for the today card: a failure used to be one small row (about a quarter of the card); now one plate fills the card, centred, with a heading-size title and a normal-size Retry.',
        expect: '<b>Changed:</b> press <b>Could not read</b>: one plate fills the whole today card, centred; <b>Retry</b> is a normal button.',
        look: 'A failed today card is one centred plate that fills the card, with a heading-size title and a normal-size Retry; the card keeps its place.',
    },
    {
        demo: 'kpadopt5-basics',
        id: 'explain-lede',
        topic: 'cards',
        changed:
            'The same change for the card under the line that explains it: a failure used to be a row of body-size words with a small Retry; now it is one plate that fills the card, centred, and its Retry is a normal-size button (it was 28 px high, now 36 px).',
        expect: '<b>Changed:</b> in the card press <b>Failed</b>: the lede stays under the heading; the plate fills the rest of the card, centred, and <b>Retry</b> is a normal button.',
        look: 'A failed card keeps its lede under the heading and shows one centred plate that fills the card, with a heading-size title and a normal-size Retry.',
    },
    {
        demo: 'kpadopt6-media',
        id: 'uses-states',
        topic: 'uses',
        title: 'Uses map',
        changed:
            'A data component now holds the height it had when it was loaded. Before, the map jumped by about 12 px while loading and by about 190 px when empty or failed, so everything below moved. Now loading, empty and failed keep the loaded height, and the plate (with its normal-size Retry) is centred in it.',
        expect: '<b>Changed:</b> press <b>Loading</b>, <b>Empty</b> and <b>Failed</b> after <b>Ready</b>: the map keeps one height each time; the busy card or plate is centred in it and nothing below the map moves.',
        look: 'Loading, empty and failed take the height of the loaded map, with the busy card or plate centred in it and a normal-size Retry; the content below never moves.',
    },
    {
        demo: 'kpadopt6-social',
        id: 'claim-row',
        topic: 'checklist',
        changed:
            'The packing list (the checklist with who brings what) had a failed box whose Retry stretched across the whole box like a strip. Now the box centres its items and Retry is a normal button (about 71 by 36 px). A list that fails straight from loaded shows the failed plate alone, with no rows behind it, and the plate fills the height the list had; empty keeps that height too.',
        expect: '<b>Changed:</b> press <b>Failed</b> and then <b>Empty</b> after <b>Ready</b>: the box keeps the height of the loaded list, the plate is centred, and <b>Retry</b> is a normal-size button, not a strip.',
        look: 'A failed list is one centred plate with a normal-size Retry that fills the height of the loaded list; empty and loading keep that height too.',
    },
    {
        demo: 'kpadopt5-ops',
        id: 'notices',
        topic: 'notices',
        title: 'Notification centre',
        changed:
            'The notification centre now holds the height it had when it was loaded: Loading, Nothing waiting and Failed used to be about 460 px high where the loaded page is about 1040 px, so the page below jumped. They now keep a taller footprint (capped at 48rem, about 768 px, because a plate in the middle of more than that is out of sight), and the Retry in the failed plate is a normal button. In a state the page now fills that whole 768 px (before, the plate stopped about 184 px short of the bottom).',
        expect: '<b>Changed:</b> press <b>Loading</b>, <b>Nothing waiting</b> and <b>Failed</b> after <b>Ready</b>: the centre keeps one large height (no more than 768 px); the plate is centred and <b>Retry</b> is a normal button.',
        look: 'Loading, nothing waiting and failed fill a tall footprint (never above 48rem) with the plate centred and a normal-size Retry; the page below does not jump.',
    },
    {
        demo: 'kpadopt6-calm',
        id: 'rating-states',
        topic: 'rating',
        title: 'Star rating',
        changed:
            'When the rating could not be read, the plate was laid over only the stars, which are narrow, so a rating in a wide row showed a small patch the width of the stars. Now the plate covers the whole rating box, at the same height as the stars had, with a normal-size Retry.',
        expect: '<b>Changed:</b> press <b>Could not read</b>: one red-edged plate covers the whole rating box (as wide as the box, as tall as the ready rating) with <b>Could not read the rating</b> centred and a normal <b>Retry</b>.',
        look: 'A failed rating is one plate over the whole rating box, as tall as the ready rating, centred, with a normal-size Retry; the stars are not left beside it.',
    },
    {
        demo: 'kpadopt6-calm',
        id: 'usual-states',
        topic: 'plate',
        title: 'Buttons inside a state plate',
        changed:
            'The button inside every empty or failed plate (<b>Retry</b>, <b>Add</b>) used to inherit the plate&rsquo;s heading size: its text was about 24 px in a 36 px button. Now the button is a normal control: body-size text, the same size as any other button. The usual picker&rsquo;s loading case also grows to 448 px, and its busy card stays inside it.',
        expect: '<b>Changed:</b> press <b>Empty</b> and <b>Could not read</b> after <b>Ready</b>: <b>Add</b> and <b>Retry</b> are normal-size buttons under the plate&rsquo;s heading, not oversized.',
        look: 'The Add and Retry buttons in the plates are normal buttons: body-size text, the size of any other button, under a heading-size title.',
    },
    {
        demo: 'kpadopt6-calm',
        id: 'focus-states',
        topic: 'focus',
        title: 'Questions, one per screen',
        changed:
            'The case with a long question and long answers was too short: its body scrolled and the last answer (<b>Hard to say</b>) sat hidden under the Back and Done buttons. The case is now 864 px high, with no scrollbar, and every answer is in view.',
        expect: '<b>Changed:</b> in the long-text case every answer, <b>Hard to say</b> included, is in view above the Back and Done buttons, and the body has no scrollbar.',
        look: 'The long-text case is 864 px high with no scrollbar; the last answer is whole and clear of the footer.',
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

// The ops page's failed option is the one choice set of this page: it needs the package to carry it.
if (!/data-kp-ops-failed/.test(read('css/components.css', root)))
    throw new Error('css/components.css has no data-kp-ops-failed: merge the state fixes first');

/** Sections grouped by the kind of component, in this order of topics (a topic's sections keep their order above). */
const TOPICS = [
    'bars',
    'version',
    'checklist',
    'entity',
    'chart',
    'availability',
    'gallery',
    'ops-page',
    'cards',
    'uses',
    'notices',
    'rating',
    'plate',
    'focus',
];
const ALL = [...CHANGED, ...STATE_FIXES, ...ADDED];
const WANTED = TOPICS.flatMap((topic) => ALL.filter((spec) => spec.topic === topic));
if (WANTED.length !== ALL.length) throw new Error('a section has a topic that TOPICS does not list');

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
    // Every control group names the component it drives and stands at it in the dialog (Kenny, 2026-10-18 07:09).
    bodyParts.push(declareControls(section(spec), spec.id));
    if (spec.id === 'request-inspector') bodyParts.push(declareControls(segmentedSection(), 'segmented-scroll'));
}
const body = bodyParts.join('\n\n');
const demos = Object.keys(DEMOS);
// The page holds only its own sections (Kenny, 2026-10-18 07:11): no laid-aside sections of the source demos, so no foreign
// control group or content reaches the review dialog; the demos' scripts skip a section that is not on the page.

/** @type {string[]} */
const problems = [];
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
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
${body}
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
console.log(`${ID}: ${pairs} sections, ${pairs} pairs (formal), round ${roundId}`);
