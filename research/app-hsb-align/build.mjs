// Builds research/app-hsb-align/demo.html: HTTPSwitchboard's views of the real status page and "Try a translation" page, rebuilt on
// shared grid tracks (Kenny, 2026-10-19: "HOE VAAK MOET IK NOG ZEGGEN OM ALLES DEFTIG VERTICAAL TE ALIGNEN EN GRID TE GEBRUIKEN IPV
// LINKS ALIGNEN???"). Layout only: every view keeps the components, options, defaults and wording the approved demos
// (app-hsb-health, -history, -profiles, -settings, -translate) already have; what moves is where things stand.
//
//   top          the needs-attention band beside the problem alerts: one set of rows, three tracks each
//   freshness    the profile rows: name, figures and freshness on three columns shared by every row
//   h24          Last 24 hours: refresh bar, history note, Profile and Tiles rows, card head and the latest deliveries
//   pickers      View, Profile (path) and Press a cell: one label column, equal control tracks
//   cards        the profile cards: one equal-width track for the three actions, the freshness line on the tracks
//   path         the path of a profile: the picker, then the name and its state on the same tracks
//   settings     the settings cards: both cards' rows on the same tracks, the head on a grid
//   recheck      the recheck table: the budget column's meter and words on one edge
//   reloads      the reload card: title and count on one line, rows on shared columns
//   hover        the profile name list: names, states and hints on three tracks
//   try          the whole "Try a translation" page: profile row, sample box and template, result card
//   diff         Before and after: one grid, wrapping at a phone's width
//
// Formal only. Run: node research/app-hsb-align/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import prettier from 'prettier';

const ID = 'app-hsb-align';
const out = new URL('./demo.html', import.meta.url);

/**
 * One section.
 * @param {{ id: string, title: string, intro: string, moved: string, grid: string, expect: string[], look: string, body: string, components: string, controls?: string }} s
 */
const section = (s) => `
<section
    class="hsa-sec"
    id="${s.id}"
    data-review-item="${s.id}"
    data-review-components="${s.components}"
    data-review-title="${s.title}"
    data-review-themes="formal"
    data-review-topic="${s.id}"
    data-review-topic-title="${s.title}"
    aria-labelledby="h-${s.id}"
>
    <div class="k56-changed"><p><b>What moved:</b> ${s.moved}</p><p><b>The grid:</b> ${s.grid}</p></div>
    <div class="hsa-sec__head">
        <h2 id="h-${s.id}">${s.title}</h2>
        <p>${s.intro}</p>
    </div>
    <div class="hsa-expected">
        <p><b>Expected:</b></p>
        <ul>
${s.expect.map((e) => `            <li>${e}</li>`).join('\n')}
        </ul>
    </div>
    <div data-review-look>
        <p data-for="formal">${s.look}</p>
    </div>
${s.controls ?? ''}
${s.body}
</section>`;

/** A row of choice buttons on equal tracks, in a form grid row. @param {string} id @param {string} label @param {[string, string, boolean][]} buttons [data, text, pressed] */
const choices = (id, label, attr, buttons) => `
<div class="kp-formgrid__row">
    <b class="kp-formgrid__label" id="${id}">${label}</b>
    <div class="kp-formgrid__control">
        <div class="hsa-choices" role="group" aria-labelledby="${id}">
${buttons.map(([v, t, on]) => `            <button type="button" class="kp-button kp-button--sm" aria-pressed="${on}" ${attr}="${v}">${t}</button>`).join('\n')}
        </div>
    </div>
</div>`;

/** A review-dialog control group that drives one component of the section. @param {string} target @param {string} label @param {string} attr @param {[string, string, boolean][]} options */
const controls = (target, label, attr, options) => `<div class="hsa-controls" data-review-controls data-review-controls-for="${target}">
    <div role="group" aria-label="${label}"><b>${label}:</b>
${options.map(([v, t, on]) => `        <button type="button" class="kp-button kp-button--sm" ${attr}="${v}" aria-pressed="${on}">${t}</button>`).join('\n')}
    </div>
</div>`;

const sections = [];

// ───────────────────────────────────────────────────────────────────────────── 1 top
sections.push(
    section({
        id: 'top',
        title: 'Needs attention: the band beside the problem alerts',
        intro: 'The top of the status page: the profiles that are not well, worst first, and next to them what is wrong, why and what to do.',
        components: 'attention problems',
        moved:
            'the band and the alerts stand on the same rows (the Nth band item and the Nth alert share a top and a bottom, no script measures it), and inside each the icon, the words and the button are three columns every item shares, so &ldquo;See the fix&rdquo; and the alerts&rsquo; buttons each start on one edge and have one width.',
        grid: 'two columns, each with three tracks (icon, words, button); two rows shared by both columns; under 56 rem one column of the same three tracks.',
        expect: [
            'The red item of the band and the red alert start and end on the same lines; so do the two blue ones.',
            'The three buttons of the band share one left and one right edge; the two alert buttons share another pair.',
            'The note of the blue alert keeps its dismiss cross, now in a track of its own at the alert&rsquo;s end; nothing is cut.',
            'At 390 px the band stands above the alerts, each item still on its three tracks (the button under the words, on the words&rsquo; edge).',
        ],
        look: 'the tops and bottoms of the red pair and the blue pair, and the edges of the buttons.',
        body: `<div class="hsa-card"><div class="hsa-pair" id="hsa-top">
    <div class="kp-attention" id="hsa-band" data-kp-subgrid role="region" aria-label="Profiles that need attention"></div>
    <div class="kp-problems" id="hsa-problems" data-kp-subgrid data-kp-problems data-kp-problems-mode="each"></div>
</div></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 2 freshness
sections.push(
    section({
        id: 'freshness',
        title: 'Profiles: the figures and the last delivery in rows',
        intro: 'One row per profile: its name and route, how many messages it received, delivered and failed, and when it last delivered.',
        components: 'formgrid freshness',
        moved: 'the figures and the freshness were each as wide as their own row; they are now two columns every row shares, so they start and end on the same edges row to row.',
        grid: 'the form grid&rsquo;s label (name and route), control (figures) and value (freshness) columns, a rule under every row.',
        expect: [
            'The figures of both rows start on one edge and the freshness lines on another.',
            'The name and its route are one block in the label column; the quiet time sits under the freshness, not beside a longer line.',
        ],
        look: 'the left edge of the figures and of the freshness in both rows.',
        body: `<div class="kp-card hsa-card"><div class="kp-card__header"><h3 class="kp-card__title" id="hsa-fresh-t">Profiles</h3></div>
<div class="kp-formgrid" data-kp-formgrid-label="wide" data-kp-formgrid-lines="lines" role="list" aria-label="Profiles and their last delivery">
    <div class="kp-formgrid__row" role="listitem">
        <span class="kp-formgrid__label"><b>alertmanager</b><small>kyu alerts.raw → Home Assistant</small></span>
        <div class="kp-formgrid__control hsa-figures">received 1284 · delivered 1281 · failed 3</div>
        <div class="kp-formgrid__value hsa-fresh"><time class="kp-ago" id="hsa-ago-a" data-kp-ago data-kp-ago-verb="last delivery" data-kp-stale-after="3600" data-kp-ago-announce="state">last delivery 3 min ago</time><span>Quiet time allowed: 1 h</span></div>
    </div>
    <div class="kp-formgrid__row" role="listitem">
        <span class="kp-formgrid__label"><b>uptime-kuma</b><small>POST /uptime-kuma → Home Assistant (mock)</small></span>
        <div class="kp-formgrid__control hsa-figures">received 0 · delivered 0 · failed 0</div>
        <div class="kp-formgrid__value hsa-fresh"><time class="kp-ago" id="hsa-ago-k" data-kp-ago data-kp-ago-verb="last delivery" data-kp-stale-after="300" data-kp-ago-announce="state">no delivery yet</time><span>Quiet time allowed: 5 min</span></div>
    </div>
</div></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 3 h24
sections.push(
    section({
        id: 'h24',
        title: 'Last 24 hours: refresh, pickers, head and latest deliveries',
        intro: 'The history card of the status page: how often the page reads again, which profile and which tiles, and the deliveries of the last hours.',
        components: 'formgrid refresh card',
        moved:
            'Page refresh, its chooser, Refresh now and the history note were four pieces on two flex lines; they are one row now. Profile and Tiles were flex rows; they stand on the same label column and the same button tracks. The card&rsquo;s title and timestamp share one baseline, and the latest deliveries share four columns row to row.',
        grid: 'one form grid: label | control | value | actions. Row 1 the refresh bar (chooser in control, the note in value, Refresh now in actions), rows 2 and 3 the pickers; below, the deliveries on four tracks (time, outcome, duration, why), the first three of one fixed width.',
        expect: [
            '&ldquo;Page refresh&rdquo;, &ldquo;Profile&rdquo; and &ldquo;Tiles&rdquo; are in one column; the chooser, the two profile buttons and the two tile buttons start on one edge.',
            '&ldquo;Refresh now&rdquo; ends on the right edge of the card&rsquo;s content; the history note stands on the value column.',
            'In the card: the title and &ldquo;read &hellip;&rdquo; share a line; the time, the outcome and the duration of every delivery are in their own columns.',
            'At 390 px every row reads top to bottom on one left edge, and a delivery is a time and a duration over its outcome and its words, still on shared columns.',
        ],
        look: 'the left edges of the labels and of the buttons, and the right edge of Refresh now.',
        body: `<div class="hsa-card hsa-h24"><div class="kp-formgrid" id="hsa-h24-grid">
    <div class="kp-refresh" data-kp-refresh="30" data-kp-look="segmented" data-hsa-refresh></div>
    <div class="kp-formgrid__row">
        <span class="kp-formgrid__label" aria-hidden="true"></span>
        <div class="kp-formgrid__control" data-kp-formgrid-span="wide"><p class="hsa-note">History since the last start, at most 24 hours.</p></div>
    </div>
${choices('hsa-h24-profile', 'Profile', 'data-hsa-h24', [
    ['alertmanager', 'alertmanager', true],
    ['uptime-kuma', 'uptime-kuma', false],
])}
${choices('hsa-h24-tiles', 'Tiles', 'data-hsa-tiles', [
    ['trend', 'Trend', true],
    ['spark', 'Sparklines', false],
])}
</div>
<section class="kp-card hsa-h24__card" aria-labelledby="hsa-h24-t">
    <div class="kp-card__header">
        <h3 class="kp-card__title" id="hsa-h24-t">Last 24 hours of alertmanager</h3>
        <div class="kp-card__actions"><span class="kp-timestamp">read 19/10/2026 14:40</span></div>
    </div>
    <p class="kp-card__body">Counted per hour since the service started recording on 18/10/2026 19:00.</p>
    <div class="hsa-recent">
        <h4 class="hsa-recent__title">Latest deliveries</h4>
        <ul class="hsa-rows" aria-label="Deliveries" data-hsa-recent></ul>
    </div>
</section></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 4 pickers
sections.push(
    section({
        id: 'pickers',
        title: 'Pickers: View, Profile and Press a cell',
        intro: 'The small choices above the profile cards, the path of a profile and the hourly strips: a word, then its buttons.',
        components: 'formgrid',
        moved: 'each picker was a flex row sized by its own words; all of them are now a label column and three equal button tracks, so the first button of every picker stands at one x and the second at another, in every card.',
        grid: 'the form grid: one label column (at least 7 rem), then equal button tracks (7 to 8 rem each), the same for every picker; the headings only say where each lives on the status page.',
        expect: [
            '&ldquo;View&rdquo;, &ldquo;Profile&rdquo; and &ldquo;Press a cell&rdquo; stand in one column; Cards, alertmanager and Quick info start on one edge; Map, uptime-kuma and Hover card only on the next.',
            'Every button of a track has the same width, whatever its words.',
            'At 390 px each picker reads top to bottom: its label, then its buttons on the same equal tracks.',
        ],
        look: 'the left edge of the first button of the three cards, and of the second.',
        body: `<section class="kp-card hsa-card" aria-label="The pickers of the status page"><div class="kp-formgrid">
    <div class="kp-formgrid__group">
        <p class="kp-formgrid__heading">Profiles card</p>
${choices('hsa-p-view', 'View', 'data-hsa-view', [
    ['cards', 'Cards', true],
    ['map', 'Map', false],
])}
    </div>
    <div class="kp-formgrid__group">
        <p class="kp-formgrid__heading">Path of a profile</p>
${choices('hsa-p-prof', 'Profile', 'data-hsa-pick', [
    ['alertmanager', 'alertmanager', true],
    ['uptime-kuma', 'uptime-kuma', false],
])}
    </div>
    <div class="kp-formgrid__group">
        <p class="kp-formgrid__heading">Last 24 hours: the hourly strips</p>
${choices('hsa-p-press', 'Press a cell', 'data-hsa-press', [
    ['info', 'Quick info', true],
    ['hover', 'Hover card only', false],
])}
    </div>
</div></section>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 5 cards
sections.push(
    section({
        id: 'cards',
        title: 'Profile cards: three actions on one track, the freshness on the card&rsquo;s tracks',
        intro: 'One card per profile with its state, three figures, what it takes and delivers, and three actions.',
        components: 'entity-card ago',
        moved:
            'the three actions each took their own width; they are three equal tracks of one grid now, the same in every card. The freshness line is two columns of the card&rsquo;s own grid: the moment on the start edge, the quiet time on the end edge.',
        grid: 'a card: one column; its actions three equal tracks under the meter; its last line two tracks (the moment, the allowance), the allowance ending on the card&rsquo;s end edge, in the column of the meter&rsquo;s value above it.',
        expect: [
            '&ldquo;Recheck this profile&rdquo;, &ldquo;Copy test command&rdquo; and &ldquo;Try a translation&rdquo; are one height and one width in a card, and in the same columns in the other.',
            '&ldquo;Quiet time allowed&rdquo; ends where the state badge and the meter&rsquo;s value end.',
            'At 390 px the card folds its actions into one &ldquo;More&rdquo; button, as before, full width of the card.',
        ],
        look: 'the three buttons of each card: one width, one row, the same edges card to card.',
        body: `<section class="kp-card hsa-card hsa-area" aria-label="Profiles"><div class="kp-entity-grid" id="hsa-grid" data-kp-entity-grid data-kp-entity-min="22rem" data-kp-entity-meters="1"></div></section>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 6 path
sections.push(
    section({
        id: 'path',
        title: 'Path of a profile: the picker, the name, its state and the hops',
        intro: 'Follows one message from its sender to the destination and stops at the first hop that refuses it.',
        components: 'formgrid trace',
        moved: 'the profile&rsquo;s name and its state badge were a flex row apart from the picker above; the name now stands in the label column and the badge in the first button track, under the picker&rsquo;s own columns.',
        grid: 'the form grid: row 1 the picker (label, buttons on tracks), row 2 the profile&rsquo;s name in the label column and its state in the control column; the trace under it from the label edge.',
        expect: [
            '&ldquo;Profile&rdquo; and the name stand on one edge; the first picker button and the state badge on the next.',
            'The name and the badge share one line (one baseline).',
        ],
        look: 'the name over the label, the badge under the first button.',
        controls: controls('hsa-path-card', 'Health of the profile', 'data-hsa-health', [
            ['working', 'Working', false],
            ['starting', 'Starting', false],
            ['failing', 'Failing', false],
            ['denied', 'Denied', true],
            ['hub-down', 'Hub down', false],
        ]),
        body: `<div class="kp-card hsa-card" id="hsa-path-card"><div class="kp-formgrid">
${choices('hsa-path-pick', 'Profile', 'data-hsa-pick2', [
    ['alertmanager', 'alertmanager', true],
    ['uptime-kuma', 'uptime-kuma', false],
])}
    <div class="kp-formgrid__row">
        <b class="kp-formgrid__label" id="hsa-trace-name" data-kp-hovercard data-hsa-profile="alertmanager" tabindex="0">alertmanager</b>
        <div class="kp-formgrid__control"><span class="kp-badge kp-badge--destructive hsa-badge" id="hsa-trace-badge">denied</span></div>
    </div>
    </div>
<div class="hsa-trace"><div class="kp-trace" data-kp-trace data-kp-trace-copy id="hsa-trace"></div></div></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 7 settings
sections.push(
    section({
        id: 'settings',
        title: 'Settings and retry budget: both cards on the same rows',
        intro: 'What each profile does in plain rows, and one bar for how long its retries can take compared to the time the hub holds a message (the lease).',
        components: 'formgrid kv card',
        moved:
            'the two profile cards were two grids side by side with rows of their own; every row now stands on the same line in both (Source beside Source, Retry budget beside Retry budget), and in each card the label and value columns are the form grid&rsquo;s. The head of a card is a grid: the name, the meter and the badge.',
        grid: 'two cards on one set of rows (a subgrid of ten rows: the head and the eight settings); in each card the form grid&rsquo;s label and value columns; under 56 rem one card under the other.',
        expect: [
            '&ldquo;Source&rdquo; of both cards stand on one line; so do all eight rows, and the budget row is as tall in the second card as in the first.',
            'The values of one card start on one edge.',
            'The head: the name on the start edge, the small meter and the badge on the end edge, one line; at 390 px the name has a line and the meter and badge share the second, on their own tracks.',
        ],
        look: 'the horizontal rules between the rows, running from the first card into the second without a step.',
        body: `<div class="hsa-stage" id="hsa-stage"></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 8 recheck
sections.push(
    section({
        id: 'recheck',
        title: 'Recheck: the table and its budget column',
        intro: 'Puts every profile, or just one, back to starting so the service tries its destination again.',
        components: 'datatable menu-button',
        moved: 'in the Retry budget column the meter and the words stand in two tracks of the cell, so the meters of every row start on one edge and the words of every row on another (the row with no lease keeps the words&rsquo; track).',
        grid: 'the table&rsquo;s four columns; inside the budget cell two tracks (the meter, the words), the actions column ending on the table&rsquo;s end edge.',
        expect: [
            'The meter of alertmanager and the words of uptime-kuma (no lease) start on the same edges as the other row&rsquo;s meter and words.',
            '&ldquo;Recheck profiles&rdquo; keeps its place above the table.',
        ],
        look: 'the left edge of the meters and of the words in the Retry budget column.',
        body: `<div class="kp-card hsa-card"><div class="hsa-bar2"><button type="button" class="kp-button" id="hsa-recheck-all">Recheck profiles</button></div>
<div class="kp-datatable" data-kp-datatable data-kp-key="hsa-profiles"><div class="kp-table-wrap"><table class="kp-table hsa-table">
<caption class="kp-sr-only">Profiles</caption>
<thead><tr><th scope="col" data-kp-sort="text">Profile</th><th scope="col" data-kp-sort="text">State</th><th scope="col" data-kp-sort="number">Retry budget</th><th scope="col" class="hsa-col-act">Actions</th></tr></thead>
<tbody>
<tr data-kp-row-key="alertmanager" data-hsa-row="alertmanager"><td data-label="Profile"><b>alertmanager</b></td><td data-label="State"><span class="kp-badge kp-badge--destructive">Denied</span></td><td data-label="Retry budget" data-kp-sort-value="45" data-hsa-budget="alertmanager"></td><td data-label="Actions" class="hsa-col-act"><div class="kp-menu-button" data-kp-menu-button data-kp-key="hsa-menu-a"><button type="button" class="kp-button kp-button--sm" aria-label="Actions for alertmanager">Actions</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="Actions for alertmanager" hidden></div></div></td></tr>
<tr data-kp-row-key="uptime-kuma" data-hsa-row="uptime-kuma"><td data-label="Profile"><b>uptime-kuma</b></td><td data-label="State"><span class="kp-badge kp-badge--info">Starting</span></td><td data-label="Retry budget" data-kp-sort-value="0" data-hsa-budget="uptime-kuma"></td><td data-label="Actions" class="hsa-col-act"><div class="kp-menu-button" data-kp-menu-button data-kp-key="hsa-menu-k"><button type="button" class="kp-button kp-button--sm" aria-label="Actions for uptime-kuma">Actions</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="Actions for uptime-kuma" hidden></div></div></td></tr>
<tr data-kp-row-key="jellyfin" data-hsa-row="jellyfin"><td data-label="Profile"><b>jellyfin</b></td><td data-label="State"><span class="kp-badge kp-badge--success">Working</span></td><td data-label="Retry budget" data-kp-sort-value="30" data-hsa-budget="jellyfin"></td><td data-label="Actions" class="hsa-col-act"><div class="kp-menu-button" data-kp-menu-button data-kp-key="hsa-menu-j"><button type="button" class="kp-button kp-button--sm" aria-label="Actions for jellyfin">Actions</button><div class="kp-menu kp-menu--rich" role="menu" aria-label="Actions for jellyfin" hidden></div></div></td></tr>
</tbody></table></div></div></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 9 reloads
sections.push(
    section({
        id: 'reloads',
        title: 'Reloads: the card head and the rows',
        intro: 'The history of the profile file being read again, newest first.',
        components: 'card timeline problems',
        moved: 'the title and the count of the card share one baseline in a grid of their own (the count wraps under the title on a phone, never beside a broken word); in the rows the time stands over its outcome and its words, and the outcome and the words are two columns every row shares.',
        grid: 'the card head: the title and the count on two tracks; each reload: a marker, then the time on its own line over an outcome track (9.5 rem) and a words track.',
        expect: [
            'The title and the count are on one baseline.',
            'Every outcome word starts on one edge and every headline on another.',
        ],
        look: 'the outcome badges in one column and the headlines in the next.',
        body: `<section class="kp-card hsa-card hsa-reloads" aria-labelledby="hsa-reloads-t">
<div class="kp-card__header"><h3 class="kp-card__title" id="hsa-reloads-t">Reloads</h3><p class="hsa-counts">4 reloads · 2 applied · 1 needs a restart · 1 invalid</p></div>
<div class="kp-problems" data-kp-problems data-kp-problems-mode="each" id="hsa-reloads-alert"></div>
<ol class="kp-timeline hsa-reloads__list" aria-label="Reloads of the profile file, newest first" id="hsa-reloads-list"></ol>
</section>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 10 hover
sections.push(
    section({
        id: 'hover',
        title: 'Profile names with their hover card',
        intro: 'Rest on a profile name (or focus it) and a card with its full shape opens.',
        components: 'hovercard kv',
        moved: 'the name, its state badge and its hint were three flex pieces; they are three columns every row shares (the name and the state fill theirs), and the card&rsquo;s labels and values are a form grid of two columns.',
        grid: 'the list: names | state (7 rem) | hint; the hover card: a key-value list whose label column is as wide as its longest label.',
        expect: ['The names of both rows end on one edge and the state badges are one width.', 'The hover card shows the same nine rows as before.'],
        look: 'the state badges: one width, one column.',
        controls: controls('hsa-names', 'alertmanager is', 'data-hsa-names-health', [
            ['working', 'Working', false],
            ['denied', 'Denied', true],
        ]),
        body: `<div class="hsa-card hsa-names-wrap" id="hsa-names"><ul class="hsa-names" aria-label="Profiles">
<li><a class="hsa-names__name" href="#alertmanager" data-kp-hovercard data-hsa-profile="alertmanager">alertmanager</a><span class="kp-badge kp-badge--destructive" data-hsa-names-badge="alertmanager">denied</span><span class="hsa-names__hint">kyu topic alerts.raw to Home Assistant</span></li>
<li><a class="hsa-names__name" href="#uptime-kuma" data-kp-hovercard data-hsa-profile="uptime-kuma">uptime-kuma</a><span class="kp-badge kp-badge--info" data-hsa-names-badge="uptime-kuma">starting</span><span class="hsa-names__hint">POST /uptime-kuma to Home Assistant (mock)</span></li>
</ul></div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 11 try
sections.push(
    section({
        id: 'try',
        title: 'Try a translation: the sample box, its template and the result',
        intro: 'Pick a profile, paste a sample message and see the body that would be delivered. Nothing is delivered.',
        components: 'formgrid json-field code card problems segmented',
        moved:
            'the profile note stands on the result column&rsquo;s edge; the sample box and the template block run down to the result card&rsquo;s foot; the label of the box stands on the line of the card&rsquo;s title; and the tool rows of the box, the template and the result are one height with Wrap and Copy in the same two columns.',
        grid: 'twelve columns: the profile row (the chooser over the input&rsquo;s five columns, the note on the result&rsquo;s seven), the input in five and the result in seven, one row; the tool rows three tracks (title, Wrap, Copy), the same in every block.',
        expect: [
            'The note under &ldquo;Profile to try&rdquo; starts on the left edge of the result card.',
            '&ldquo;Sample message&rdquo; stands on the line of &ldquo;Translated body&rdquo;; the template block and the result card end on one line.',
            'The tools of the box (Format, Minify, Wrap), the template (Wrap, Copy) and the result (Wrap, Copy) are one height; Wrap and Copy of the template and of the result start on the same distance from their blocks&rsquo; end edges.',
        ],
        look: 'the top line, the bottom line and the tool rows of the two columns.',
        body: `<div class="hsa-try" id="hsa-try">
    <div class="hsa-try__profile">
        <div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Profile to try" id="hsa-try-profile">
            <button type="button" class="kp-segmented__item" data-value="alertmanager" role="radio" aria-checked="true"><span class="kp-segmented__label">alertmanager</span></button>
            <button type="button" class="kp-segmented__item" data-value="uptime-kuma" role="radio" aria-checked="false"><span class="kp-segmented__label">uptime-kuma (mock)</span></button>
        </div>
        <p class="hsa-meta" id="hsa-try-takes">Takes POST /alertmanager · delivers to Home Assistant</p>
    </div>
    <div class="hsa-try__input">
        <div class="kp-field">
            <label class="kp-field__label" for="hsa-message">Sample message</label>
            <textarea class="kp-field__input kp-field__input--multiline" id="hsa-message" rows="10" data-kp-json="strict" data-kp-json-wrap="false" spellcheck="false" aria-describedby="hsa-message-hint"></textarea>
            <p class="kp-field__hint" id="hsa-message-hint">Paste the message as the sender posts it. Nothing is sent anywhere. The most this page takes is 1 MiB.</p>
        </div>
        <figure class="kp-code" data-kp-code id="hsa-template" data-kp-code-title="Template of alertmanager" data-kp-code-language="minijinja" data-kp-code-state="loading"><pre class="kp-code__body"><code></code></pre></figure>
    </div>
    <section class="kp-card hsa-card hsa-try__result" id="hsa-result" data-kp-state="loading" aria-labelledby="hsa-result-t">
        <div class="kp-card__header"><h3 class="kp-card__title" id="hsa-result-t">Translated body</h3></div>
        <p class="kp-card__body">What Home Assistant would receive for this message.</p>
        <div class="kp-card__stage"><div class="kp-card__data hsa-card__data">
            <div class="kp-problems" data-kp-problems data-kp-problems-mode="each" id="hsa-try-problems"></div>
            <figure class="kp-code" data-kp-code id="hsa-body" data-kp-code-title="Translated body" data-kp-code-language="JSON" data-kp-code-state="loading"><pre class="kp-code__body"><code></code></pre></figure>
        </div></div>
    </section>
</div>`,
    }),
);

// ───────────────────────────────────────────────────────────────────────────── 12 diff
sections.push(
    section({
        id: 'diff',
        title: 'Before and after: the diff at a phone&rsquo;s width',
        intro: 'The message as it arrived against the body that is delivered. Indentation is ignored when lines are matched.',
        components: 'diff card',
        moved: 'a changed line wraps inside the card, so at 390 px every line ends on the card&rsquo;s edge instead of one long line running 97 px past the others; the card head&rsquo;s title and count stand on one baseline.',
        grid: 'each diff line: line number (3 rem), sign (1 character), text (the rest of the card), the same three columns in every line.',
        expect: ['Every line ends on the card&rsquo;s inner edge.', 'The line numbers and the signs are two columns.'],
        look: 'the right edge of the lines at 390 px: one edge.',
        body: `<section class="kp-card hsa-card hsa-diffcard" aria-labelledby="hsa-diff-t">
<div class="kp-card__header"><h3 class="kp-card__title" id="hsa-diff-t">Before and after</h3><p class="hsa-counts" id="hsa-diffcount"></p></div>
<p class="kp-card__body">The message as it arrived against the body that is delivered. Indentation is ignored when lines are matched.</p>
<pre class="kp-diff hsa-diff" id="hsa-diff" tabindex="0"></pre>
</section>`,
    }),
);

const html = `<!doctype html>
<html lang="en-GB" data-theme="formal" data-review="${ID}" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HTTPSwitchboard: everything on the grid · kp-themes research demo</title>
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

        <main id="main" class="cat-main k56-page hsa-page">
            <header class="k56-intro">
                <h1>HTTPSwitchboard: everything on the grid</h1>
                <p class="cat-intro">
                    You asked again for everything to be aligned vertically and laid out on a grid instead of left-aligned. These are layout-only fixes
                    to HTTPSwitchboard views you already approved, plus the views of the real status page and the &ldquo;Try a translation&rdquo; page
                    that the approved demos left open. Nothing changes in what a view shows, says or offers: each section is the same view with its
                    parts standing on shared columns and rows (the package&rsquo;s form grid, <code>.kp-formgrid</code>, and subgrids), with one
                    sentence saying what moved. ${sections.length} sections, formal only; the sample data is the same as in the approved demos. A new
                    measurement holds every section to a 1 px alignment at 1280 and 390 px.
                </p>
            </header>
${sections.join('\n')}
        </main>
        <script type="application/json" data-review-round>
            { "round": "${ID}-${randomUUID()}", "received": [] }
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

let previous = '';
try {
    previous = readFileSync(out, 'utf8');
} catch {
    // First build.
}
// Keep the round id of an earlier build: an id is never reused for a changed page only when Kenny has judged it.
const keep = previous.match(new RegExp(`"round": "(${ID}-[0-9a-f-]+)"`));
const text = await prettier.format(keep ? html.replace(/"round": "[^"]+"/, `"round": "${keep[1]}"`) : html, { parser: 'html', printWidth: 140, tabWidth: 4 });
writeFileSync(out, text);
console.log(`research/app-hsb-align/demo.html: ${sections.length} sections, ${text.length} bytes`);
