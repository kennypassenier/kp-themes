// Builds research/almanac-align-1019/demo.html. Run: node research/almanac-align-1019/build.mjs
//
// Kenny, 2026-10-19 ("ALLES DEFTIG VERTICAAL ALIGNEN EN GRID GEBRUIKEN IPV LINKS ALIGNEN"): one bundled review of fixes to the
// five approved Almanac demos (almanac-calendars, -journal, -try-source, -delivery-chain, -calendar-views). Every section shows ONE
// spot of an approved page with a Now / Fixed control: Now is the markup of the approved demo, Fixed is the same content laid out
// on `.kp-formgrid` or on named grid tracks. Never side by side. Formal only.
import { writeFileSync } from 'node:fs';
import { SAMPLES } from '../almanac-try-source/engine.js';
import { CALENDARS, SAMPLE, calendarRow, losesTemplates, esc } from '../almanac-calendars/data.js';

const here = new URL('.', import.meta.url).pathname;

/** The approved Home Assistant event call, as the editor shows it. */
const CALL = esc(SAMPLES.home.text);

// ---- shared helpers -------------------------------------------------------------------------------------------------------------

/** One control group: pressed state is the page's own (demo.js). `[value, text, pressed]` */
function group(id, name, label, options, latent = false) {
    return `<div role="group" aria-label="${esc(label)}"${latent ? ' data-review-latent' : ''}>${options
        .map(
            ([value, text, pressed]) =>
                `<button type="button" class="kp-button" aria-pressed="${pressed ? 'true' : 'false'}" data-aa-ctl="${id}:${name}" data-aa-v="${value}">${esc(text)}</button>`,
        )
        .join('')}</div>`;
}
const versionGroup = (id) =>
    group(id, 'version', 'Now or Fixed', [
        ['now', 'Now', false],
        ['fixed', 'Fixed', true],
    ]);

/**
 * One section: heading, the plain sentence, Expected, look-at, the controls and the stage that holds both variants.
 * @param {{ id: string, topic: string, topicTitle: string, title: string, components: string, sentence: string, expected: string[], look: string, groups?: string[], stage?: string, now: string, fixed: string, note?: string }} s
 */
function section(s) {
    return `
            <section
                class="aa-sec"
                id="${s.id}"
                data-review-item="${s.id}"
                data-review-topic="${s.topic}"
                data-review-topic-title="${esc(s.topicTitle)}"
                data-review-title="${esc(s.title)}"
                data-review-components="${s.components}"
                aria-labelledby="h-${s.id}"
            >
                <div class="aa-sec__head">
                    <h2 id="h-${s.id}">${s.title}</h2>
                    <p>${s.sentence}</p>
                </div>
                <div class="aa-expected">
                    <p><b>Expected:</b></p>
                    <ul>
${s.expected.map((e) => `                        <li>${e}</li>`).join('\n')}
                    </ul>
                </div>
                <div data-review-look>
                    <p data-for="formal">${s.look}</p>
                </div>
                <div data-review-controls data-review-controls-for="${s.id}-component">
                    ${[versionGroup(s.id), ...(s.groups ?? [])].join('\n                    ')}
                </div>
                <div id="${s.id}-component" class="aa-stage" data-aa-version="fixed"${s.stage ?? ''}>
                    <div class="aa-variant" data-aa-variant="now">
${s.now}
                    </div>
                    <div class="aa-variant" data-aa-variant="fixed">
${s.fixed}
                    </div>
                    ${s.note ?? ''}
                </div>
            </section>`;
}

const sample = `<p class="aa-sample kp-text-muted">${SAMPLE}</p>`;

// ---- 1 + 3 · facts with Copy buttons -----------------------------------------------------------------------------------------------
const PROFILE = [
    ['Source id', 'home-assistant', true],
    ['Calendar', 'Almanac · Huishouden', false],
    ['Calendar id (sample)', 'huishouden-4f2a91@group.calendar.example', true],
    ['Time zone', 'Europe/Brussels', false],
    ['Default length', '60 minutes', false],
    ['Schema version', '2', false],
    ['File', 'profiles/home-assistant.toml', true],
];
const EVENT = [
    ['Title', 'Wasmachine klaar', false],
    ['When', '28/08/2026 11:00 to 12:00 (Europe/Brussels)', false],
    ['Calendar', 'Almanac · Huishouden', false],
    ['Description', 'Cyclus voltooid', false],
    ['Shows as', 'Busy', false],
    ['Reminders', "The calendar's defaults", false],
    ['Marker', 'home-assistant:switch.wasmachine', true],
];
/** Now: the approved key-value list, each Copy right after its own value. */
const nowFacts = (p, rows, cls) =>
    `<dl class="${cls}" aria-label="The facts">${rows
        .map(
            ([label, value, copy], i) =>
                `<div class="kp-kv__row"><dt>${esc(label)}</dt><dd>${
                    copy
                        ? `<span class="kp-copyable"><span class="kp-copyable__value" id="${p}-v${i}">${esc(value)}</span><button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="${p}-v${i}">Copy</button></span>`
                        : esc(value)
                }</dd></div>`,
        )
        .join('')}</dl>`;
/** Fixed: label | value | (value track, empty) | actions: every Copy in the actions column. */
const fixedFacts = (p, rows) =>
    `<div class="kp-formgrid" data-kp-formgrid-lines="lines" role="group" aria-label="The facts">${rows
        .map(
            ([label, value, copy], i) =>
                `<div class="kp-formgrid__row"><span class="kp-formgrid__label" id="${p}-l${i}">${esc(label)}</span><div class="kp-formgrid__control">${
                    copy ? `<span class="kp-copyable__value" id="${p}-v${i}">${esc(value)}</span>` : `<span>${esc(value)}</span>`
                }</div>${
                    copy
                        ? `<div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="${p}-v${i}" aria-describedby="${p}-l${i}">Copy</button></div>`
                        : ''
                }</div>`,
        )
        .join('')}</div>`;

const profileCard = (p, inner) => `<section class="kp-card aa-card" aria-labelledby="${p}-title">
    <div class="kp-card__header aa-card__header"><h3 class="kp-card__title" id="${p}-title">Profile of home-assistant</h3><span class="kp-badge kp-badge--success">Real source</span></div>
    <div class="kp-card__stage"><div class="kp-card__data">${inner}</div></div>
</section>`;
const resultCard = (p, inner) => `<section class="kp-card aa-card" aria-labelledby="${p}-title">
    <div class="kp-card__header aa-card__header"><h3 class="kp-card__title" id="${p}-title">What Almanac would write</h3><span class="kp-badge kp-badge--info">Would update</span></div>
    <div class="kp-card__stage"><div class="kp-card__data"><h4 class="aa-h">The event</h4>${inner}</div></div>
</section>`;

const s1 = section({
    id: 'try-profile',
    topic: 'try-source',
    topicTitle: 'Try a source',
    title: 'Try a source: the profile facts',
    components: 'formgrid kv copy',
    sentence:
        'Before, each Copy button stood straight after its own value, so the three buttons sat at three different distances from the edge, and at phone width one stood 4.8 px off its label; now every value starts on one line and every Copy stands in one column at the end.',
    expected: [
        'Seven facts: Source id, Calendar, Calendar id (sample), Time zone, Default length, Schema version, File. In Fixed the values start on one vertical line, and the three Copy buttons (Source id, Calendar id, File) are the same size in one column at the right end, each on the line of its own label.',
        'Now is the approved list: a Copy right after each value, so the buttons start at different distances. Copy still copies and says Copied.',
        '<b>The grid:</b> four tracks, label (as wide as &ldquo;Calendar id (sample)&rdquo;) | control (the value) | value (empty here) | actions (the Copy buttons); each fact is one row that shares them. At 390 px every row reads top to bottom: label, value, then Copy at the left edge.',
    ],
    look: 'Press Now and Fixed: run your eye down the Copy buttons (one column, one size) and down the values (one left edge); then across each row, label and Copy on one line.',
    now: profileCard('tp-now', nowFacts('tp-now', PROFILE, 'kp-kv kp-kv--columns kp-kv--lines')),
    fixed: profileCard('tp-fixed', fixedFacts('tp-fixed', PROFILE)),
    note: sample,
});

const s3 = section({
    id: 'try-result',
    topic: 'try-source',
    topicTitle: 'Try a source',
    title: 'Try a source: the event facts and the marker',
    components: 'formgrid kv copy',
    sentence:
        'Before, the Marker&rsquo;s Copy hung on the end of its value in the middle of the list; now the event&rsquo;s facts and the Marker&rsquo;s Copy follow the same tracks as the profile facts: the value on one line, Copy in the actions column.',
    expected: [
        'Seven facts of the event Almanac would write (Title, When, Calendar, Description, Shows as, Reminders, Marker). The values start on one line; the one Copy button, on Marker, stands in the actions column on the line of the word Marker.',
        'Now is the approved list, with the Copy straight after the marker text.',
        '<b>The grid:</b> label (as wide as &ldquo;Description&rdquo;) | control (the value) | value (empty) | actions (Copy). The same four tracks as the profile facts, so the two sections read alike. At 390 px the rows read top to bottom.',
    ],
    look: 'Press Now and Fixed: the Marker text starts on the same line as every other value, and Copy sits at the right end on the Marker line.',
    now: resultCard('tr-now', nowFacts('tr-now', EVENT, 'kp-kv kp-kv--lines')),
    fixed: resultCard('tr-fixed', fixedFacts('tr-fixed', EVENT)),
    note: sample,
});

// ---- 2 · the event editor ----------------------------------------------------------------------------------------------------------
const picker = (p) => `<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-labelledby="${p}-picker-label" id="${p}-picker">
    <button type="button" class="kp-segmented__item" data-value="home-assistant" role="radio" aria-checked="true"><span class="kp-segmented__label">home-assistant</span></button>
    <button type="button" class="kp-segmented__item" data-value="homelab" role="radio" aria-checked="false"><span class="kp-segmented__label">homelab</span></button>
    <button type="button" class="kp-segmented__item" data-value="kyu" role="radio" aria-checked="false"><span class="kp-segmented__label">kyu</span></button>
    <button type="button" class="kp-segmented__item" data-value="claude-sessions" role="radio" aria-checked="false"><span class="kp-segmented__label">claude-sessions</span></button>
</div>`;
const textarea = (p) =>
    `<textarea class="kp-field__input kp-field__input--multiline" id="${p}-body" name="body" rows="12" data-kp-json="strict" data-kp-json-indent="2" data-kp-json-check="input" data-kp-json-format="button">${CALL}</textarea>`;
const editorAnswer = (p) =>
    `<div class="kp-alert kp-alert--info" id="${p}-answer" role="status" data-kp-semantic data-aa-answer><span><span class="kp-alert__label">Note: </span>Nothing tried yet. Press Try it.</span></div>`;
const editorCard = (p, form) => `<section class="kp-card aa-card" aria-labelledby="${p}-title">
    <div class="kp-card__header aa-card__header"><h3 class="kp-card__title" id="${p}-title">Try an event call</h3></div>
    <div class="kp-card__stage"><div class="kp-card__data">${form}</div></div>
</section>`;

const s2 = section({
    id: 'try-editor',
    topic: 'try-source',
    topicTitle: 'Try a source',
    title: 'Try a source: the event editor',
    components: 'formgrid json-field',
    sentence:
        'Before, the Format, Minify, Wrap and Copy tools, the Try it button and its note each started where they happened to land under the field; now the field, its tools, Try it and the note stand on the same tracks.',
    expected: [
        'In Fixed the field starts on the control edge and ends on the right edge of the actions column; its tool row (Format and Minify at the start, Wrap and Copy at the end) is inside the field, so it has the same two edges. <b>Try it</b> starts on the same left edge as Format, with its note, <b>Nothing is written to the calendar.</b>, in the next track on the same line.',
        'Press <b>Try it</b>: the answer appears in the line under it, and nothing else moves. Press Now: the approved layout, where Try it and its note are a loose row under the field.',
        '<b>The grid:</b> label (&ldquo;Event call (the JSON body)&rdquo;) | control (the field, from here to the end of the actions column) | value (the note) | actions (the end of the field). Four rows: Source, the field, the Try it row, the answer. At 390 px the rows read top to bottom.',
    ],
    look: 'Press Fixed: the left edge of Format, of Try it and of the field is one line; the right edge of Copy and of the field is one line; Try it and its note share a centre.',
    now: editorCard(
        'te-now',
        `<form class="ps-stack" id="te-now-form" novalidate data-aa-editor>
    <div class="ps-picker"><span class="ps-label" id="te-now-picker-label">Source</span>${picker('te-now')}</div>
    <div class="kp-field"><label class="kp-field__label" for="te-now-body">Event call (the JSON body)</label>${textarea('te-now')}</div>
    <div class="ps-actions"><button type="submit" class="kp-button kp-button--primary">Try it</button><span class="ps-actions__note">Nothing is written to the calendar.</span></div>
    ${editorAnswer('te-now')}
</form>`,
    ),
    fixed: editorCard(
        'te-fixed',
        `<form id="te-fixed-form" novalidate data-aa-editor>
    <div class="kp-formgrid">
        <div class="kp-formgrid__row">
            <span class="kp-formgrid__label" id="te-fixed-picker-label">Source</span>
            <div class="kp-formgrid__control" data-kp-formgrid-span="wide">${picker('te-fixed')}</div>
        </div>
        <div class="kp-formgrid__row">
            <label class="kp-formgrid__label" for="te-fixed-body">Event call (the JSON body)</label>
            <div class="kp-formgrid__control" data-kp-formgrid-span="wide">${textarea('te-fixed')}</div>
        </div>
        <div class="kp-formgrid__row kp-formgrid__row--buttons">
            <span class="kp-formgrid__label"></span>
            <div class="kp-formgrid__control aa-tracks" data-kp-formgrid-span="wide">
                <div class="kp-formgrid__buttons"><button type="submit" class="kp-button kp-button--primary">Try it</button></div>
                <p class="kp-formgrid__value">Nothing is written to the calendar.</p>
            </div>
        </div>
        <div class="kp-formgrid__row">
            <span class="kp-formgrid__label">Answer</span>
            <div class="kp-formgrid__control" data-kp-formgrid-span="wide">${editorAnswer('te-fixed')}</div>
        </div>
    </div>
</form>`,
    ),
});

// ---- 4 · Status: Recent deliveries head ---------------------------------------------------------------------------------------------
const DELIVERIES = [
    ['delivered 1 min 2 s ago', 'homelab', 'warning', 'Retrying'],
    ['delivered 4 min 2 s ago', 'home-assistant', 'success', 'Created'],
    ['delivered 38 min 2 s ago', 'kyu', 'info', 'Updated'],
    ['delivered 2 h 10 min ago', 'claude-sessions', 'success', 'Created'],
    ['delivered 5 h ago', 'homelab', 'destructive', 'Failed'],
    ['delivered 9 h ago', 'home-assistant', 'info', 'Updated'],
];
const deliveriesCard = (p) => `<section class="kp-card aj-card" aria-label="Recent deliveries, live">
    <div class="kp-card__stage"><div class="kp-card__data"><div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-page-sizes="none"><div class="kp-table-wrap"><table class="kp-table">
        <caption class="kp-sr-only">Recent deliveries, newest first (sample data)</caption>
        <thead><tr><th scope="col" data-kp-sort="text">When</th><th scope="col" data-kp-sort="text">Source</th><th scope="col" data-kp-sort="text">Result</th></tr></thead>
        <tbody>${DELIVERIES.map(
            ([when, source, tone, word]) =>
                `<tr><td data-label="When">${when}</td><td data-label="Source"><span class="kp-tag">${source}</span></td><td data-label="Result"><span class="kp-badge kp-badge--${tone}" data-kp-semantic>${word}</span></td></tr>`,
        ).join('')}</tbody>
    </table></div></div></div></div>
</section>`;
const refresh = `<div class="kp-refresh" data-kp-refresh="0" data-kp-refresh-choices="0,15,30,60" data-kp-look="menu"></div>`;

const s4 = section({
    id: 'status-deliveries-head',
    topic: 'status',
    topicTitle: 'Status page',
    title: 'Status: the head of Recent deliveries',
    components: 'formgrid auto-refresh card',
    sentence:
        'Before, the title, the interval chooser, the freshness words and Refresh now were a wrapping row whose right end stood off the card below it; now they are four cells of one grid that ends exactly where the card ends.',
    expected: [
        'In Fixed the title <b>Journal</b> starts on the card&rsquo;s left edge, the chooser (<b>Paused</b>), the freshness words (<b>not updated yet</b>) and <b>Refresh now</b> each have their own track, all centred on one line, and the right edge of Refresh now is the right edge of the card under it.',
        'Pick <b>15 s</b> in the chooser: the words change to <i>updated … ago</i> and a rule runs under the head; nothing moves sideways. Press Now: the approved row, where the head and the card do not share edges.',
        '<b>The grid:</b> label (the title) | control (the chooser) | value (the freshness words) | actions (Refresh now); the card spans all four tracks. At 390 px the head reads top to bottom: title, chooser, words, Refresh now.',
    ],
    look: 'Press Fixed: draw a vertical line from the right edge of Refresh now to the right edge of the card, and from the left edge of Journal to the left edge of the card: both are straight.',
    now: `<div class="aj-live"><div class="aj-live__head"><h3 class="aj-live__title">Journal</h3>${refresh}</div>${deliveriesCard('now')}</div>`,
    fixed: `<div class="kp-formgrid aa-live" data-kp-formgrid-align="center"><h3 class="aa-live__title">Journal</h3>${refresh}<div class="aa-live__card">${deliveriesCard('fixed')}</div></div>`,
});

// ---- 5 · Status: At a glance --------------------------------------------------------------------------------------------------------
const kpis = (p) => `<div class="kp-kpis" role="group" aria-label="Journal figures">
    <div class="kp-kpi"><span class="kp-kpi__label">Waiting to be delivered</span><span class="kp-kpi__value"><span>0</span><small>events</small></span><span class="kp-kpi__trend">Nothing is waiting</span></div>
    <button type="button" class="kp-kpi kp-kpi--toggle" data-aa-outcome aria-pressed="false"><span class="kp-kpi__label">Delivered since start</span><span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Show in the bar</span><span data-kp-when="on">Showing only this ×</span></span><span class="kp-kpi__value"><span>3</span><small>events</small></span><span class="kp-kpi__trend">3 accepted in all</span></button>
    <button type="button" class="kp-kpi kp-kpi--toggle" data-aa-outcome aria-pressed="false"><span class="kp-kpi__label">Failed since start</span><span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Show in the bar</span><span data-kp-when="on">Showing only this ×</span></span><span class="kp-kpi__value"><span>0</span><small>events</small></span><span class="kp-kpi__trend">None gave up</span></button>
    <div class="kp-kpi kp-kpi--trend"><span class="kp-kpi__label">Deliveries per hour <span class="kp-kpi__label-note">sample data</span></span><span class="kp-kpi__value">1<small>per hour</small></span><span class="kp-kpi__trend">Last 24 hours, sample data</span><figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Deliveries per hour, last 24 hours, sample data"><script type="application/json" data-kp-chart-data>{"unit":"events","digits":0,"series":[{"label":"Deliveries","start":1792360800000,"step":3600000,"values":[0,0,1,0,0,0,0,1,2,1,0,1,0,0,1,1,0,2,1,0,0,1,0,1,1]}]}</script></figure></div>
</div>`;
const health = (cls) => `<div class="${cls}" role="group" aria-label="Subsystems">
    <div class="aj-health__item"><span class="aj-health__name">Journal</span><span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> <span>Readable, nothing pending</span></span></div>
    <div class="aj-health__item"><span class="aj-health__name">Store</span><span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> <span>Writable</span></span></div>
</div>`;
const glanceCard = (cls, healthCls) => `<section class="kp-card aj-card" aria-label="Journal at a glance">
    <div class="kp-card__header"><h3 class="kp-card__title">Journal</h3></div>
    <p class="kp-card__body">What is waiting and what happened since the service started.</p>
    <div class="kp-card__stage"><div class="kp-card__data ${cls}">${kpis()}${health(healthCls)}</div></div>
</section>`;

const s5 = section({
    id: 'status-glance',
    topic: 'status',
    topicTitle: 'Status page',
    title: 'Status: Journal at a glance',
    components: 'formgrid kpi health',
    sentence:
        'Before, the Journal and Store health lines used their own two columns, so &ldquo;Store&rdquo; and the words after the names stood nowhere near the edges of the four tiles above; now each pair uses the tile tracks: a name starts where a tile&rsquo;s text starts, its words start where the next tile&rsquo;s text starts.',
    expected: [
        'Four tiles in one row at 1280 (two at 390). In Fixed, <b>Journal</b> starts on the text edge of the first tile and <b>Readable, nothing pending</b> on the text edge of the second; <b>Store</b> on the third tile&rsquo;s and <b>Writable</b> on the fourth&rsquo;s. Dot and words share one line with the name.',
        'Press Now: the approved lines, with the names and words on columns of their own.',
        '<b>The grid:</b> the tiles&rsquo; four equal tracks (two at 390); each health pair spans two of them as a subgrid: the name in the first, the words in the second. The tiles and the health lines can never drift apart because they are one set of tracks.',
    ],
    look: 'Press Fixed: draw a vertical line down from the text of the first tile through the word Journal, and from the second tile through the status words: both are straight.',
    now: glanceCard('aj-glance', 'aj-health'),
    fixed: `<div class="aa-glance-wrap">${glanceCard('aa-glance', 'aa-health')}</div>`,
});

// ---- 6 · History: month head -----------------------------------------------------------------------------------------------------------
const month = (cls, nav = '') =>
    `<div class="aa-month ${cls}"><section class="kp-calendar kp-calendar--busy-whole"${nav} data-kp-calendar data-kp-calendar-month="2026-10" data-kp-calendar-selected="2026-10-19" data-kp-time-zone="Europe/Brussels" lang="en-GB" aria-label="Events delivered per day (sample data)" data-aa-calendar></section></div>`;

const s6 = section({
    id: 'history-month-head',
    topic: 'history',
    topicTitle: 'History page',
    title: 'History: the month head',
    components: 'formgrid calendar-nav',
    sentence:
        'Before, Prev, the month, Next and Today were a left-aligned run of four that ended well before the right edge of the days; now they are four tracks of one grid, Prev on the first day&rsquo;s edge, Next and Today ending on the last day&rsquo;s edge, the title centred on the same line.',
    expected: [
        'In Fixed <b>‹ Prev</b> starts on the left edge of the Monday column, <b>Today</b> ends on the right edge of the Sunday column, <b>OCTOBER 2026</b> is centred between Prev and Next, and the four share one centre line. Prev and Next, Today share one height.',
        'Press <b>Next</b>: the month changes and nothing in the head moves. Press Now: the approved run of four at the left.',
        '<b>The grid:</b> the days&rsquo; own seven tracks: Prev over Monday, the month centred over the middle three days, Next and Today over Saturday and Sunday; under 40rem (and at 390 px) the month takes a row of its own and Prev | Next | Today stand over two, three and two days, edge to edge. It is the package&rsquo;s <code>data-kp-calendar-nav=&quot;spread&quot;</code>; the default stays the left run.',
    ],
    look: 'Press Fixed: Prev starts above Monday&rsquo;s plate edge, Today ends above Sunday&rsquo;s plate edge, the month sits in the middle on the buttons&rsquo; centre line.',
    groups: [group('history-month-head', 'width', 'Width of the calendar', [['full', 'Wide (44rem)', true], ['phone', 'Phone (390)', false]])],
    stage: ' data-aa-width="full"',
    now: month('aa-month--now'),
    fixed: month('aa-month--fixed', ' data-kp-calendar-nav="spread"'),
});

// ---- 7 · Calendars: page header -------------------------------------------------------------------------------------------------------
const header = (p, cls) => `<header class="kp-page-header ${cls}">
    <div class="kp-page-header__inner">
        <div class="aa-header__text">
            <h1 class="kp-page-header__title">Calendars</h1>
            <p class="kp-page-header__description">The Google calendars Almanac writes into, which source writes to which, and the profile files that make that so.</p>
        </div>
        <div class="kp-page-header__actions">
            <button type="button" class="kp-button kp-button--primary">New calendar</button>
            <div class="kp-menu-button" data-kp-menu-button data-kp-key="${p}-more">
                <button type="button" class="kp-button">More ▾</button>
                <div class="kp-menu kp-menu--rich" role="menu" aria-label="Other actions on this page" hidden>
                    <button type="button" role="menuitem" class="kp-menu__item" tabindex="-1" aria-labelledby="${p}-mi-l" aria-describedby="${p}-mi-h" data-kp-value="reload"><span class="kp-menu__label" id="${p}-mi-l">Reload profiles from disk</span><span class="kp-menu__hint" id="${p}-mi-h">Read every profile file again, without restarting the service</span></button>
                </div>
            </div>
        </div>
    </div>
</header>`;

const s7 = section({
    id: 'cal-header',
    topic: 'calendars',
    topicTitle: 'Calendars page',
    title: 'Calendars: the page header at 1280 and at 390',
    components: 'page-header grid menu-button',
    sentence:
        'Before, at 390 px New calendar ran full width and More stood alone under it at the left, and at 1280 the buttons sat above the title&rsquo;s line with two different widths; now the two buttons are two equal tracks of one grid, side by side at both widths, on the title&rsquo;s centre line.',
    expected: [
        '<b>1280 (Fixed):</b> the title <b>Calendars</b> and the two buttons on one centre line, <b>New calendar</b> and <b>More ▾</b> equally wide, the sentence under the title. <b>390 (Fixed):</b> title, sentence, then the two buttons side by side, each half of the width, no lone button on its own row.',
        'Press <b>More ▾</b>: the menu opens at its button with <b>Reload profiles from disk</b> and its hint, on an opaque plate, inside the screen. Press Now: the approved header, with the primary full width at 390.',
        '<b>The grid:</b> 1280: the text (the rest) | the actions (two equal tracks); 390: one column for the text, then the actions as two equal tracks edge to edge.',
    ],
    look: 'Press Fixed at 1280, then at 390: two equal buttons side by side, their edges are the edges of the header; at 1280 their centre line is the title&rsquo;s.',
    groups: [group('cal-header', 'width', 'Width', [['full', 'Full width (1280)', true], ['phone', 'Phone (390)', false]])],
    stage: ' data-aa-width="full"',
    now: header('ch-now', 'aa-header--now'),
    fixed: header('ch-fixed', 'aa-header--fixed'),
});

// ---- 8 · Calendars: the attention band ------------------------------------------------------------------------------------------------
const s8 = section({
    id: 'cal-attention',
    topic: 'calendars',
    topicTitle: 'Calendars page',
    title: 'Calendars: the attention band',
    components: 'attention formgrid flash-button',
    sentence:
        'Before, each problem plate placed its own fix button, so Check again and Reload profiles from disk ended 74.6 px apart and the two texts ended on different lines; now the plates share one grid: icon, text and one actions column where both buttons start and end on the same lines.',
    expected: [
        '<b>Both</b> problems: <b>Google Calendar cannot be reached</b> (red) above <b>1 profile file is not being served</b> (amber). In Fixed the two icons, the two texts and the two buttons each stand on one line down the band; both buttons are the same width (as wide as &ldquo;Reload profiles from disk&rdquo;), and the text ends on one edge.',
        'Press a fix button: it shows busy, then Done, and the problem leaves the band. <b>Google only</b>, <b>File only</b> and <b>None</b> show the band with one problem or none (none takes no room). Press Now: the approved band.',
        '<b>The grid:</b> three tracks used by every plate: icon (as wide as the icon) | text (the rest) | actions (as wide as the widest button). It is the package&rsquo;s <code>data-kp-subgrid</code> on the band, placed on the form grid. At 390 px each plate stacks, the button under its text.',
    ],
    look: 'Press Fixed: the two buttons have one left and one right edge; the two texts end on one edge; the icons are in one column.',
    groups: [
        group('cal-attention', 'problems', 'Problems', [
            ['both', 'Both', true],
            ['google', 'Google only', false],
            ['file', 'File only', false],
            ['none', 'None', false],
        ]),
    ],
    now: `<div class="kp-attention" role="region" aria-label="Needs attention" data-aa-attention></div>
                        <p class="aa-below kp-text-muted">The calendars card follows here.</p>`,
    fixed: `<div class="kp-formgrid aa-attention-grid"><div class="kp-attention" data-kp-subgrid role="region" aria-label="Needs attention" data-aa-attention></div></div>
                        <p class="aa-below kp-text-muted">The calendars card follows here.</p>`,
    note: sample,
});

// ---- 9 · Calendars: the typed delete confirm -------------------------------------------------------------------------------------------
const deleteDialog = (p, inner) => `<dialog class="kp-dialog kp-confirm aa-inplace" open aria-labelledby="${p}-title" aria-describedby="${p}-desc" data-aa-delete>
    <h2 class="kp-dialog__title" id="${p}-title">Delete the calendar almanac-test?</h2>
    <p class="kp-dialog__description" id="${p}-desc">This cannot be undone. Cancel leaves everything as it is.</p>
    ${inner}
    <p class="aa-result kp-text-muted" role="status" data-aa-result></p>
    <div class="kp-dialog__actions">
        <button type="button" class="kp-button" data-aa-cancel>Cancel</button>
        <button type="button" class="kp-button kp-button--destructive" data-aa-go disabled data-kp-disabled-reason="Type the calendar name first.">Delete calendar</button>
    </div>
</dialog>`;

const s9 = section({
    id: 'cal-delete',
    topic: 'calendars',
    topicTitle: 'Calendars page',
    title: 'Calendars: the typed delete confirm',
    components: 'type-confirm formgrid dialog',
    sentence:
        'Before, the name field stopped 86 px short of the right edge that the &ldquo;What you lose&rdquo; box above it and the status line below it end on; now the whole confirm stands in one grid cell and the field fills it.',
    expected: [
        'In Fixed the <b>What you lose</b> box, the label with the name in code, the field, the rule and the status line all end on one right edge; the field starts on the box&rsquo;s left edge.',
        '<b>Wrong name</b> says it does not match and keeps Delete off; <b>Right name</b> shows the success badge and turns Delete on; nothing moves between the three. Press Now: the approved dialog, with the short field.',
        '<b>The grid:</b> one row of the form grid, its control track spanning all four tracks; the typed-confirm block fills it. The dialog&rsquo;s own Cancel and Delete calendar stay at the foot, as approved.',
    ],
    look: 'Press Fixed: the field&rsquo;s right edge is the right edge of the red-edged box above it and of the status line under it.',
    groups: [
        group('cal-delete', 'typed', 'What is typed', [
            ['nothing', 'Nothing typed', true],
            ['wrong', 'Wrong name', false],
            ['right', 'Right name', false],
        ]),
    ],
    now: deleteDialog('cd-now', '<div data-aa-type-block></div>'),
    fixed: deleteDialog(
        'cd-fixed',
        '<div class="kp-formgrid"><div class="kp-formgrid__row"><div class="kp-formgrid__control" data-kp-formgrid-span="all"><div data-aa-type-block></div></div></div></div>',
    ),
    note: sample,
});

// ---- 10 · Calendars: the new-calendar dialog ------------------------------------------------------------------------------------------
const newDialog = (p, grid) => `<dialog class="kp-dialog aa-inplace" open aria-labelledby="${p}-title" aria-describedby="${p}-desc">
<h2 class="kp-dialog__title" id="${p}-title">New calendar</h2>
<p class="kp-dialog__description" id="${p}-desc">Almanac makes the calendar in Google and shares it with you.</p>
<form class="kp-form" data-kp-form novalidate data-aa-new>
<div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
<div class="kp-dialog__body">
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Name</h3>
${grid}
</section>
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Sharing</h3>
<p class="kp-dialog__note">The calendar is shared with the owner Almanac is set up for, so it shows up in their Google Calendar at once.</p>
</section>
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button" data-aa-new-cancel>Cancel</button>
<button type="submit" class="kp-button kp-button--primary" data-kp-submit>Make and share</button>
</div>
</form>
</dialog>`;

const s10 = section({
    id: 'cal-new',
    topic: 'calendars',
    topicTitle: 'Calendars page',
    title: 'Calendars: the new-calendar dialog',
    components: 'formgrid dialog form',
    sentence:
        'Before, the Calendar name field stopped 86 px short of the dialog&rsquo;s right edge, so it ended where the Sharing sentence below it does not; now the label, the field and its help are one row of the form grid and the field fills the width.',
    expected: [
        'In Fixed the field starts and ends on the same two edges as the Name and Sharing headings&rsquo; rules and the Sharing sentence; the help <b>It shows in Google Calendar exactly as typed.</b> sits under the field on its left edge.',
        'Press <b>Make and share</b> with the name empty: the field turns red with its message and the summary names it; with a name typed it makes the calendar (a toast says so). Press Now: the approved dialog, with the short field.',
        '<b>The grid:</b> label (Calendar name, required) | control (the field) | value (the help); at the dialog&rsquo;s width the grid reads top to bottom, so the field takes the whole width.',
    ],
    look: 'Press Fixed: the right edge of the field is the right edge of the dialog&rsquo;s content, the same as the Sharing sentence.',
    groups: [group('cal-new', 'form', 'Form', [['empty', 'Empty', true], ['filled', 'Filled', false]])],
    now: newDialog(
        'cn-now',
        `<div class="kp-field"><label class="kp-field__label" for="cn-now-name">Calendar name <span class="kp-field__required">required</span></label><input class="kp-field__input" id="cn-now-name" name="name" required autocomplete="off" aria-describedby="cn-now-help" placeholder="Household" /><span class="kp-field__help" id="cn-now-help">It shows in Google Calendar exactly as typed.</span><span class="kp-field__error" data-kp-field-error hidden></span></div>`,
    ),
    fixed: newDialog(
        'cn-fixed',
        `<div class="kp-formgrid"><div class="kp-formgrid__row"><label class="kp-formgrid__label" for="cn-fixed-name"><span>Calendar name <span class="kp-field__required">required</span></span></label><div class="kp-formgrid__control kp-field"><input class="kp-field__input" id="cn-fixed-name" name="name" required autocomplete="off" aria-describedby="cn-fixed-help" placeholder="Household" /><span class="kp-field__error" data-kp-field-error hidden></span></div><p class="kp-formgrid__value" id="cn-fixed-help">It shows in Google Calendar exactly as typed.</p></div></div>`,
    ),
});

// ---- 11 · Calendars: the phone table cards --------------------------------------------------------------------------------------------
const calendarsTable = (p) => `<section class="kp-card aa-card" aria-labelledby="${p}-title">
    <div class="kp-card__header"><h3 class="kp-card__title" id="${p}-title">Calendars</h3></div>
    <div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-sort-multi="click" data-kp-page-sizes="none">
        <div class="kp-table-wrap">
            <table class="kp-table">
                <caption class="kp-sr-only">Calendars the service account can see</caption>
                <thead><tr><th scope="col" data-kp-sort="text">Name</th><th scope="col">Calendar id</th><th scope="col" data-kp-sort="number">Used by</th><th scope="col"><span class="kp-sr-only">Actions</span></th></tr></thead>
                <tbody>
${CALENDARS.map(calendarRow).join('\n')}
                </tbody>
            </table>
        </div>
    </div>
</section>`;

const s11 = section({
    id: 'cal-cards',
    topic: 'calendars',
    topicTitle: 'Calendars page',
    title: 'Calendars: the table as cards on a phone',
    components: 'datatable grid cards',
    sentence:
        'Before, in a phone card the labels stood at the left but the values were pushed to the right edge, while the calendar id block started at the left, so the values stood on three different edges; now every card has two tracks, label and value, and every value starts on the value track&rsquo;s left edge.',
    expected: [
        'Three cards (Almanac · Huishouden, Almanac · Infra, almanac-test) in a 390 px frame. In Fixed each card has four lines (Name, Calendar id, Used by, Actions); the labels are in one column, and the name, the id block, the source tags and the Delete button all start on one vertical line, the same in every card.',
        'Delete is on the same track in every card (off for the two in use, on for almanac-test); the id still copies with its Copy button. Press Now: the approved cards, values right-aligned.',
        '<b>The grid:</b> two tracks per card: label (as wide as &ldquo;Calendar id&rdquo;, at most 40 %) | value (the rest); each line a subgrid of the card. Page CSS only; a package option for this card layout would make it the default for every table.',
    ],
    look: 'Press Fixed: the values start on one vertical line inside each card, and the three cards are laid out alike.',
    stage: ' data-aa-width="phone"',
    now: calendarsTable('cc-now'),
    fixed: `<div class="aa-cards">${calendarsTable('cc-fixed')}</div>`,
    note: `${sample}\n${losesTemplates()}`,
});

// ---- the page --------------------------------------------------------------------------------------------------------------------------
const html = `<!doctype html>
<html lang="en" data-theme="formal" data-review="almanac-align-1019" data-review-themes="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Almanac: alignment fixes on the approved pages</title>
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
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main aa-page">
            <header class="aa-intro">
                <h1>Almanac: alignment fixes on the approved pages</h1>
                <p class="cat-intro">
                    You approved five Almanac demos and then found labels, values and buttons lined up by accident instead of on a grid. This
                    bundle shows ten spots of those pages, each with <b>Now</b> (the approved layout) and <b>Fixed</b> (the same content on the
                    form grid, <code>.kp-formgrid</code>, or on named grid tracks). Nothing else on the pages changes. 11 sections, formal only.
                    The content is the approved content: <b>Almanac · Huishouden</b>, <b>Almanac · Infra</b>, <b>almanac-test</b>, the source
                    <b>home-assistant</b>; the calendar ids and every other source are made up, as before. Today is 19/10/2026.
                </p>
            </header>
${[s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11].join('\n')}
        </main>
        <script type="application/json" data-review-round>
            { "round": "almanacalign-6d3f1b8a-52c7-4e09-b1a4-9e7c2d05f318", "received": [] }
        </script>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="./demo.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
writeFileSync(here + 'demo.html', html);
console.log('wrote demo.html', html.length, 'bytes');
