// research/kpadopt2: the week agenda and run timeline sections (imported by ../build.mjs).

import { GANTT, GANTT_STATES, WEEK, WEEK_CROWD, WEEK_STATES } from './looks.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** The section's lead sentence, then the theme's own touches, one paragraph per theme. @param {string} lead @param {Record<string, string>} per */
const looks = (lead, per) =>
    Object.keys(per)
        .map((t) => `                    <p data-for="${t}">${lead} ${esc(per[t])}</p>`)
        .join('\n');

const SECTIONS = [];

SECTIONS.push({
    id: 'week',
    title: 'Week agenda: seven days, every item at its time',
    about: 'A column per day, an hour axis, every item a pill at its time of day, a line across today at the current time. Below 40rem of its own width the days become rows. Items open with a click or Enter.',
    expected: [
        'Seven day columns starting today. Today carries the word <b>Today</b> under its number, a coloured number and a tinted column; a line crosses it at the current time and the pills above the line are quieter.',
        'Every pill shows its time and its name, ending in an ellipsis when the name is long. The pill with a ring is the <b>next run</b>; the struck-through ones are <b>off</b> or <b>skipped</b>; the dashed one is the host’s own round, <b>for reference</b>, and does nothing when pressed.',
        'Hover a pill (not the dashed one): a card with its detail. Click it or press Enter: the readout under the agenda logs the item.',
        'Tab enters the agenda once, on a pill. The arrows move: up and down inside a day, left and right to the nearest item of the next day. Tab leaves.',
        'Above the agenda: the range as its title on the left (in the theme’s display face) and, on the right, one control in the theme’s own segmented track: a chevron back, <b>Today</b>, a chevron on. Hover a chevron: its tooltip names it (Previous, Next), as a screen reader does. <b>Today</b> is greyed while the seven days from today are shown, and stays in the Tab order.',
        'Press a chevron: the title moves by seven days, the days of the new range arrive the theme’s way, both agendas wait in their loading ghosts for a moment (a real page reads the new items), then the items arrive one after the other. <b>Today</b> brings the first range back the same way.',
        'The 360 px column holds the same days as rows, with every item shown and nothing cut off.',
    ],
    look: 'Check the full-width agenda and the 360 px one.',
    body: `
                <div class="kt-cols">
                    <div>
                        <p class="kt-label">Full width, with the week buttons</p>
                        <div class="kp-week" data-kp-week data-kp-week-nav id="kt-week-wide" aria-label="Runs in the next 7 days"></div>
                    </div>
                    <div>
                        <p class="kt-label">Phone, 360 px</p>
                        <div class="kt-phone"><div class="kp-week" data-kp-week id="kt-week-phone" aria-label="Runs in the next 7 days"></div></div>
                    </div>
                </div>
                <pre class="kt-log" id="kt-week-log" aria-label="What the agenda reported" aria-live="off"></pre>`,
    perTheme: WEEK,
});

SECTIONS.push({
    id: 'week-crowd',
    title: 'A crowded day folds into a +N menu',
    about: 'A column holds as many pills as its height fits. The rest is folded into a +N button at the end of the stack; its menu (the package’s menu button) lists them. The column never grows.',
    expected: [
        'Thursday has fourteen items between 01:00 and 04:30. Its column shows a stack of pills and, at the foot of the stack, a <b>+N</b> button instead of one more pill. No pill sits on another and the column keeps its height.',
        'The menu under +N opens by itself, joined to its button, as soon as that button is in view (it is not open while the button is below the fold); it closes again when the button leaves the view. It lists the folded items with their time and name. Pick one: it is reported like a pill.',
        '<b>Open the +N menu</b> opens it again; Esc closes it and returns the focus to +N; a click elsewhere closes it too.',
        '<b>Add an item</b> puts a fifteenth item on Thursday, <b>Remove one</b> takes one away: the number on +N follows and nothing else moves. Fewer items than the column holds: no +N at all.',
        'The 360 px column shows all fourteen items as rows and no +N.',
    ],
    look: 'Open the +N menu in this theme and compare it with the other menus of the page.',
    body: `
                <div class="kt-actions">
                    <button type="button" class="kp-button" id="kt-more-open">Open the +N menu</button>
                    <button type="button" class="kp-button" id="kt-crowd-add">Add an item to Thursday</button>
                    <button type="button" class="kp-button" id="kt-crowd-remove">Remove one</button>
                </div>
                <div class="kt-cols">
                    <div>
                        <p class="kt-label">Full width</p>
                        <div class="kp-week" data-kp-week id="kt-crowd-wide" aria-label="A crowded week"></div>
                    </div>
                    <div>
                        <p class="kt-label">Phone, 360 px</p>
                        <div class="kt-phone"><div class="kp-week" data-kp-week id="kt-crowd-phone" aria-label="A crowded week"></div></div>
                    </div>
                </div>
                <pre class="kt-log" id="kt-crowd-log" aria-label="What the agenda reported" aria-live="off"></pre>`,
    perTheme: WEEK_CROWD,
});

SECTIONS.push({
    id: 'week-states',
    title: 'Week agenda: loading, empty, error, focus',
    about: 'The three states of the whole agenda, each at the agenda’s final size, and a pill that has the keyboard focus.',
    expected: [
        '<b>Loading</b>: the week loads as the data table loads. The days, the hours and the lines are all there and stay empty; in the middle of the days stands the same card as a loading table shows: the theme’s own large loading mark and the words “Reading the week”, dressed as the theme dresses a loading table. Nothing else is drawn in the days, and the card covers neither the day heads nor the hours. It is the card of the data table’s “Loading, with a layer over the rows”.',
        '<b>Empty</b>: the same grid, the sentence “Nothing is planned in this week.” over it.',
        '<b>Error</b>: the grid, with the page’s own words in the destructive colour over it.',
        '<b>Focus</b>: the third agenda has its first pill focused as a keyboard user would see it; the ring must be whole, not cut by the pill’s corners, and clearly visible against the neighbours.',
        '<b>Make it load, then arrive</b> (above the first agenda): the button shows the theme’s spinner and says the items arrive in 2 s; the first agenda’s items leave at once and the loading card arrives in the middle as it does over a table. After two seconds the card leaves first, then the items arrive the theme’s way, one after the other; no item is ever drawn under the card. No column changes height and no head moves, here and in the 390 px view (where a day keeps its height while it loads again); the button can play it again, as often as you like.',
    ],
    look: 'Press Make it load, then arrive three times in a row and watch the first agenda: an empty week with the table’s loading card in the middle, then its items, never both.',
    body: `
                <div class="kt-actions">
                    <button type="button" class="kp-button kp-button--live" id="kt-states-cycle"><span class="kp-spinner kp-button__spin" aria-hidden="true" hidden></span><span class="kp-button__long" data-kt-cycle-words>Make it load, then arrive</span></button>
                </div>
                <div class="kt-stack">
                    <div><p class="kt-label">Loading</p><div class="kp-week" data-kp-week id="kt-state-loading" aria-label="Loading week"></div></div>
                    <div><p class="kt-label">Empty</p><div class="kp-week" data-kp-week id="kt-state-empty" aria-label="Empty week"></div></div>
                    <div><p class="kt-label">Error</p><div class="kp-week" data-kp-week id="kt-state-error" aria-label="Failed week"></div></div>
                    <div><p class="kt-label">A pill with the focus</p><div class="kp-week" data-kp-week id="kt-state-focus" aria-label="Week with focus"></div></div>
                </div>`,
    perTheme: WEEK_STATES,
});

SECTIONS.push({
    id: 'gantt',
    title: 'Run timeline: bars per job, growing live',
    about: 'A lane per job, a bar per run on a time axis that follows the clock. Running bars grow, queued ones wait hollow, finished ones are solid, failed ones stand taller. Drag across the plot to select a range.',
    expected: [
        'An axis on top with times, one lane per job with its name on the left, and a line for now. The six runs that are running or queued now are at the right edge: <b>running</b> carries the theme’s running mark and grows; <b>queued</b> is hollow and dashed and grows too.',
        '<b>Succeeded</b> bars are solid; <b>failed</b> bars are solid, taller, with a cap at the end and a cross when wide enough. The Updates lane has two overlapping runs on two rows; the Reports lane has small bars close together.',
        'Hover a bar: a card with name, times, length and state (a running one counts up). Click it or press Enter: the readout under the timeline logs it. Tab enters once; the arrows move along a lane (left, right) and between lanes (up, down).',
        'The range buttons <b>1h 6h 24h 7d</b> change how much time shows. <b>Live</b> (pressed) makes the right edge follow now; press it to freeze the window, press again to follow.',
        'Drag across the plot: a dashed band, then the toolbar row above the timeline turns into a chip with the range, <b>Zoom</b> (the window becomes the range and stops following) and <b>Clear</b>. A click on a bar without a drag still opens it.',
        'The buttons above the timeline drive it: <b>Start a run</b> adds a running bar, <b>Finish the oldest run</b> turns the oldest running one solid, <b>Fail it instead</b> turns it failed, <b>Queue a run</b> adds a hollow one, <b>Start the queued run</b> sets it running. <b>Fast time</b> runs the clock sixty times faster so growth is visible. The frame does not change height when a run starts or ends: the lanes with a run still open already hold a spare row, and a start that needs more scrolls inside the frame. Pressing a range button, <b>Live</b> or <b>Zoom</b> lays the lanes out again.',
    ],
    look: 'Press Start a run, then Fast time, and watch a bar grow; then drag across the plot.',
    body: `
                <div class="kt-actions">
                    <button type="button" class="kp-button" id="kt-run-start">Start a run</button>
                    <button type="button" class="kp-button" id="kt-run-finish">Finish the oldest run</button>
                    <button type="button" class="kp-button" id="kt-run-fail">Fail it instead</button>
                    <button type="button" class="kp-button" id="kt-run-queue">Queue a run</button>
                    <button type="button" class="kp-button" id="kt-run-promote">Start the queued run</button>
                    <button type="button" class="kp-button" id="kt-run-fast" aria-pressed="false">Fast time (x60)</button>
                </div>
                <div class="kt-cols kt-cols--gantt">
                    <div>
                        <p class="kt-label">Full width</p>
                        <div class="kp-gantt" data-kp-gantt data-kp-gantt-range="6h" data-kp-gantt-ghosts="2 3 2 1 1" id="kt-gantt-wide" aria-label="Operations of the dashboard"></div>
                    </div>
                    <div>
                        <p class="kt-label">Phone, 360 px</p>
                        <div class="kt-phone"><div class="kp-gantt" data-kp-gantt data-kp-gantt-range="6h" data-kp-gantt-ghosts="2 3 2 1 1" id="kt-gantt-phone" aria-label="Operations of the dashboard"></div></div>
                    </div>
                </div>
                <pre class="kt-log" id="kt-gantt-log" aria-label="What the timeline reported" aria-live="off"></pre>`,
    perTheme: GANTT,
});

SECTIONS.push({
    id: 'gantt-states',
    title: 'Run timeline: loading, empty, error, a held window, the hover card',
    about: 'The states of the whole timeline at their final size, a window held in the past with a selected range, and the hover card opened on a failed run.',
    expected: [
        '<b>Loading</b>: five ghost lanes as tall as the real ones, each ghost bar a plate of a bar’s size in the theme’s own loading picture; the axis is already there.',
        '<b>Empty</b>: the axis and the sentence “No run in this window.” over a lane-sized space. <b>Error</b>: the page’s words in the destructive colour.',
        '<b>A held window</b>: the Live button is not pressed, the window ends two hours ago and does not move; a range is already selected (a band across the plot and the toolbar row turned into a chip with its times, Zoom and Clear, standing where the range buttons and Live stand; the toolbar keeps its height and the chip lies on no lane, at 1280 and at 390 px). <b>Zoom</b> makes the band the window; <b>Clear</b> lifts it.',
        '<b>Hover card on the failed run</b> opens the card on the failed bar of the held window: name, times, length and state, joined to its bar, with its edge whole in this theme.',
    ],
    look: 'Check the ghost lanes against the real lanes above, and the card against its bar.',
    body: `
                <div class="kt-actions">
                    <button type="button" class="kp-button" id="kt-hover-open">Hover card on the failed run</button>
                </div>
                <div class="kt-stack">
                    <div><p class="kt-label">Loading</p><div class="kp-gantt" data-kp-gantt data-kp-gantt-ghosts="2 3 2 1 1" id="kt-gstate-loading" aria-label="Loading history"></div></div>
                    <div><p class="kt-label">Empty</p><div class="kp-gantt" data-kp-gantt id="kt-gstate-empty" aria-label="Empty history"></div></div>
                    <div><p class="kt-label">Error</p><div class="kp-gantt" data-kp-gantt id="kt-gstate-error" aria-label="Failed history"></div></div>
                    <div><p class="kt-label">A held window with a selected range</p><div class="kp-gantt" data-kp-gantt data-kp-gantt-live="false" data-kp-gantt-range="6h" id="kt-gstate-held" aria-label="History held in the past"></div></div>
                </div>`,
    perTheme: GANTT_STATES,
});

const section = (s) => `
            <section
                class="kt-sec"
                id="${s.id}"
                data-review-item="${s.id}"
                data-review-components="${s.id.startsWith('gantt') ? 'gantt' : 'week'}"
                data-review-title="${s.title.replace(/"/g, '&quot;')}"
                aria-labelledby="h-${s.id}"
            >
                <div class="kt-sec__head">
                    <h2 id="h-${s.id}">${s.title}</h2>
                    <p>${s.about}</p>
                </div>
                <div class="kt-expected">
                    <p><b>Expected:</b></p>
                    <ul>
${s.expected.map((e) => `                        <li>${e}</li>`).join('\n')}
                    </ul>
                </div>
                <div data-review-look>
${looks(s.look, s.perTheme)}
                </div>${s.body}
            </section>`;

export const sections = `
${SECTIONS.map(section).join('\n')}
`;
