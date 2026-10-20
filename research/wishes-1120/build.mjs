// Builds research/wishes-1120/demo.html: the 22 homelab wishes that became options and components of the package, as ONE review page
// (DEMO_RULES ch. 1 and 6: one page, formal only, one section per wish; at most 25 items, sections x themes asked).
// The sections are written here, once, in a shape that is the same for every wish: what is asked, the heading and one sentence,
// what to expect, what to look at in formal, the controls above the component, and the component. demo.js wires them by their own
// elements; page.css is the frame. Run: node research/wishes-1120/build.mjs (the page keeps its round id until the verdict is recorded).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'wishes-1120';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons) =>
    `<div role="group" aria-label="${label}">${buttons
        .map(([value, words, on]) => `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}" aria-pressed="${on ? 'true' : 'false'}">${words}</button>`)
        .join('')}</div>`;

/** @type {{ id: string, title: string, topic: string, topicTitle?: string, wish: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string, class?: string }[]} */
const SECTIONS = [
    // ---------------------------------------------------------------- states and progress
    {
        id: 'plain-card',
        topic: 'progress',
        topicTitle: 'States and progress',
        title: 'A state card without a frame of its own',
        wish: 'homelab 90',
        asked:
            'A card that reads data (loading, empty, failed, ready) drew its own frame, so inside a section card it made a card in a card. Is the plain version, which sits in the section card with no frame of its own, what you want? It is an option (<code>data-kp-card="plain"</code>); the framed card stays the default everywhere else.',
        h2: 'A card in a card, or just the section',
        intro: 'The backups section holds a state card. Switch the inner card between its own frame (before) and plain (new) and walk its four states.',
        expected: [
            '<b>Own frame</b>: a bordered card inside the section card, with its own padding. <b>Plain</b>: no border, no shadow, no padding; the rows sit on the section card, and the section card is the only frame.',
            'The four states keep the same room in both: <b>Loading</b> has the busy card centred, <b>Empty</b> and <b>Failed</b> a large centred plate, <b>Failed</b> with a Retry. Nothing jumps when you switch.',
        ],
        look: 'Formal is a paper plate: one border weight. In plain there must be exactly one frame around the rows; in the other mode two nested ones.',
        controls: group('Inner card', 'frame', [['own', 'Own frame (before)'], ['plain', 'Plain (new)', true]]) + group('State', 'state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card" id="pg-plain-section">
            <div class="kp-card__header"><h3 class="kp-card__title">Backups</h3></div>
            <p class="kp-card__body">Last night&rsquo;s run and the coverage of the week.</p>
            <div class="kp-card" id="pg-plain" data-kp-state="ready" data-kp-card="plain">
                <div class="kp-card__stage"><div class="kp-card__data">
                    <ul class="pg-lines"><li><b>media</b><span>backed up 03:12, 4.1 GB</span></li><li><b>sonarr</b><span>backed up 03:20, 310 MB</span></li><li><b>traefik</b><span>missed, the host was busy</span></li><li><b>vaultwarden</b><span>backed up 03:41, 52 MB</span></li></ul>
                </div></div>
            </div></div>`,
    },
    {
        id: 'job-line',
        topic: 'progress',
        title: 'One progress line for a job with steps and data',
        wish: 'homelab 98',
        asked:
            'A backup is a list of steps and, in some of them, a copy of data. The dashboard printed two lines; the new job line says it in one: step, bytes and time left. Does it read at a glance, and is the list-plus-bar-plus-line the right amount?',
        h2: 'Step 3 of 8, 1.2 of 4 GB, about 2 min left',
        intro: 'The step list and the transfer bar are the package&rsquo;s own; the job line under them joins what they know. Press a preset, or run the whole job.',
        expected: [
            '<b>Waiting</b> says <b>Waiting to start</b>. <b>Steps only</b> says <b>Step 3 of 8</b>. <b>Steps and data</b> says <b>Step 3 of 8 · 1.2 of 4 GB · about 2 min left</b> (the unit once). <b>Size unknown</b> says <b>Step 3 of 8 · 1.2 GB so far</b>: a part that is not known is left out, never shown as 0.',
            '<b>Run the job</b>: the steps tick on, the bar fills and the line follows both; the line is the same height at every moment.',
        ],
        look: 'Check that the numbers do not shimmer (tabular figures), that the separator dots have room and that the line wraps rather than cuts on a phone.',
        controls: group('Show', 'job', [['waiting', 'Waiting', true], ['steps', 'Steps only'], ['both', 'Steps and data'], ['unknown', 'Size unknown']]) + group('Run', 'job-run', [['run', 'Run the job'], ['stop', 'Stop', true]]),
        component: `<div class="kp-card pg-card pg-job">
            <ol class="kp-steplist" id="pg-job-steps" aria-label="Backup progress"></ol>
            <div class="kp-progress-group kp-progress-group--transfer"><div class="kp-progress__wrap" data-kp-transfer data-kp-linger="0" id="pg-job-transfer"></div></div>
            <p class="kp-jobline" id="pg-job-line" data-kp-jobline data-kp-jobline-for="#pg-job-steps"></p></div>`,
    },
    {
        id: 'batch-progress',
        topic: 'progress',
        title: 'How far a batch is: 3 of 7 done',
        wish: 'homelab 112',
        asked:
            'A bar action on many rows used to go from busy straight to the final result. A batch of seven updates now says how far it is while it runs. Is the count beside the busy words what you want, and does it stay calm?',
        h2: 'Update seven stacks',
        intro: 'Seven stacks are ticked. Press the bar&rsquo;s Update button to run the batch, or jump to a state.',
        expected: [
            '<b>Selected</b>: <b>7 selected</b> and the stack names. <b>Running</b>: the spinner, the busy words and <b>3 of 7 done</b>, buttons off. <b>Finished</b>: the result line <b>7 done</b>.',
            'The bar is as high in all three; the digits do not move the words around.',
        ],
        look: 'Formal: a quiet bar. The count is muted beside the busy words; check its gap to the words and that it never touches the edge.',
        controls: group('State', 'batch', [['selected', 'Selected', true], ['running', 'Running 3 of 7'], ['done', 'Finished']]),
        component: `<div class="kp-card pg-card"><div class="kp-selection" id="pg-batch" data-kp-selection data-kp-placement="inline" aria-label="Stacks"><div class="kp-selection__actions"><button class="kp-button kp-button--primary" type="button" data-kp-selection-action="update">Update 7 stacks</button></div></div></div>`,
    },
    {
        id: 'clipboard-clear',
        topic: 'progress',
        title: 'A copied secret leaves the clipboard again',
        wish: 'homelab 108',
        asked:
            'A secret field&rsquo;s Copy puts the token on the clipboard and leaves it there. With the option, the clipboard is emptied some seconds later, and only if it still holds the token; the field says so politely. Is that the right behaviour, and are the default times right (the dashboard used 30 s)?',
        h2: 'Copy, then wait',
        intro: 'Press Copy (the clock here is 5 s so you need not wait), then paste into the box below at once and again after the time.',
        expected: [
            'Right after Copy the box below pastes the token; after the time it pastes nothing, and the line under the field says <b>Clipboard cleared</b>.',
            'Copy something else in the meantime: the line says the clipboard was left alone, because it no longer held the token. If your browser refuses the page to read the clipboard it still clears it, and says so.',
            'The value never appears in the line or in an event.',
        ],
        look: 'Formal: the field is a quiet row of value and two buttons. The log line is plain muted text in a fixed place, so nothing moves when it changes.',
        controls: group('Clear after', 'clear', [['0', 'Never (before)'], ['5', '5 seconds', true], ['10', '10 seconds']]),
        component: `<div class="kp-card pg-card"><div class="kp-secret" id="pg-secret" data-kp-secret data-kp-secret-label="API token" data-kp-secret-value="kp_live_9f2c1a77e0b34d" data-kp-secret-clear="5"></div>
            <p class="pg-log" id="pg-secret-log" role="status">Nothing copied yet.</p>
            <label class="kp-field__label" for="pg-secret-paste">Paste here to see what the clipboard holds</label>
            <textarea class="kp-field__input kp-field__input--multiline" id="pg-secret-paste" rows="2"></textarea></div>`,
    },
    {
        id: 'countdown-days',
        topic: 'progress',
        title: 'A countdown of days reads in days',
        wish: 'homelab 124',
        asked:
            'The undo window of an update lasts seven days, which the countdown printed as 167:59:59. From 24 hours up it now reads <b>6 d 22 h</b>; under a day nothing changes. Is that the right way to write a long wait, and should the digits stay available (an option)?',
        h2: 'The undo window',
        intro: 'A display-only countdown to a moment: seven days, a day, and seven days with the digits kept.',
        expected: [
            '<b>7-day window</b>: <b>6 d 22 h</b> (the unit letters are in muted cells, the digits do not jump). <b>Under a day</b>: <b>23:59:00</b> and ticking down, as before. <b>Digits kept</b>: <b>166:00:00</b>, the old reading, through an option.',
        ],
        look: 'Formal: big quiet digits in the display face. Check that "6 d 22 h" is as steady as the digits are and has the same weight.',
        controls: group('Length', 'days', [['week', '7-day window', true], ['day', 'Under a day'], ['digits', 'Digits kept']]),
        component: `<div class="kp-countdown" id="pg-days" data-kp-countdown-until="" data-kp-countdown-name="Undo window" data-kp-countdown-controls="none"></div>`,
    },
    // ---------------------------------------------------------------- lists and tables
    {
        id: 'dated-meta',
        topic: 'lists',
        topicTitle: 'Lists, tables and grids',
        title: 'A dated option without a date, and two details',
        wish: 'homelab 101',
        asked:
            'The snapshot picker needed a date for every option. A &ldquo;Latest&rdquo; entry has none, and a snapshot may carry more than one detail (a size and a count of files). Do the undated row and the two details look right?',
        h2: 'Which snapshot to restore',
        intro: 'The first row is the files as they are now, with no date. The others are dated; each has a size and a count of files.',
        expected: [
            '<b>Mixed</b>: the undated row shows its name alone, centred in the row&rsquo;s height, with no empty line under it; the dated rows show <b>how long ago</b> and the date. All rows are as high, and the two details end each row in one column.',
            '<b>All dated</b>: as before, one detail per row.',
        ],
        look: 'Formal: tile rows with one border. Check that the undated name sits in the middle of its row and the details line up from row to row.',
        controls: group('Options', 'dated', [['mixed', 'Undated entry, two details', true], ['dated', 'All dated (before)']]) + group('State', 'dated-state', [['ready', 'Ready', true], ['empty', 'Empty'], ['loading', 'Loading']]),
        component: `<div class="kp-card pg-card"><div class="kp-dated" id="pg-dated" data-kp-dated data-kp-order="given" data-kp-now="2026-10-20T12:00:00+02:00" aria-label="Snapshot to restore"></div></div>`,
    },
    {
        id: 'table-reorder',
        topic: 'lists',
        title: 'Reorder the rows of a table',
        wish: 'homelab 93',
        asked:
            'The firewall rules of the dashboard run in order, and a data table could only sort. With the option the rows have a handle: drag it, or press Alt+Up and Alt+Down on it. Is the handle where and how you expect, and is turning it off while a sort is on right?',
        h2: 'Firewall rules, in the order they run',
        intro: 'Drag a row by its handle, or focus a handle with Tab and press Alt+Up or Alt+Down. The line under the table lists the order the page would save.',
        expected: [
            'A narrow first column of handles (six dots). Dragging moves the row under the pointer; Alt+Up and Alt+Down move it one place and keep the focus on its handle; the order line changes at once.',
            '<b>Sorted by rule</b> turns the handles off (dimmed, a tooltip says why); <b>Original order</b> brings them back.',
        ],
        look: 'Formal: a plain table. The handle column is as narrow as its button; check the dots read as a grip and the dragged row shows an outline.',
        controls: group('Table', 'reorder', [['order', 'Original order', true], ['sorted', 'Sorted by rule']]),
        component: `<div class="kp-datatable" id="pg-rules" data-kp-datatable data-kp-rows-reorder data-kp-key="rules">
            <div class="kp-table-wrap"><table class="kp-table"><caption>Firewall rules</caption>
            <thead><tr><th scope="col" data-kp-sort="text">Rule</th><th scope="col">Action</th><th scope="col">Applies to</th></tr></thead>
            <tbody>
            <tr data-kp-row-key="allow-web"><td>Allow web</td><td>Allow</td><td>traefik</td></tr>
            <tr data-kp-row-key="allow-ssh"><td>Allow ssh from the lan</td><td>Allow</td><td>every host</td></tr>
            <tr data-kp-row-key="block-iot"><td>Block IoT to the lan</td><td>Block</td><td>iot vlan</td></tr>
            <tr data-kp-row-key="allow-dns"><td>Allow dns</td><td>Allow</td><td>every host</td></tr>
            <tr data-kp-row-key="log-rest"><td>Log the rest</td><td>Log</td><td>every host</td></tr>
            </tbody></table></div>
            <p class="pg-log" id="pg-rules-order" role="status">Order: allow-web, allow-ssh, block-iot, allow-dns, log-rest</p></div>`,
    },
    {
        id: 'tile-match',
        topic: 'lists',
        title: 'The typed part of an app name is marked',
        wish: 'homelab 121',
        asked: 'A launcher search filters the app tiles; the part of the name that matched used to lose its mark. Is the mark clear without being loud?',
        h2: 'Find an app',
        intro: 'Type in the search box, or press a preset. The first match in each name is marked; tiles that do not match leave.',
        expected: ['<b>jel</b> marks <b>Jel</b> in Jellyfin; <b>ar</b> marks the first <b>ar</b> in Sonarr and Radarr and leaves out Jellyfin. The mark is a soft tint behind the letters, in any letter case, and the name does not shift.', 'An empty search shows every tile with no mark.'],
        look: 'Formal: a quiet tint with a bolder weight. Check that the marked letters are still easy to read and the tile height does not change.',
        controls: group('Search', 'match', [['', 'Nothing', true], ['jel', 'jel'], ['ar', 'ar'], ['TRA', 'TRA']]),
        component: `<div class="kp-card pg-card"><label class="kp-field__label" for="pg-match-q">Search apps</label><input class="kp-field__input" id="pg-match-q" type="search" autocomplete="off" />
            <div class="kp-entity-grid pg-tiles" id="pg-match-grid" data-kp-entity-grid data-kp-entity-kind="tile" role="list"></div></div>`,
    },
    {
        id: 'tile-keys',
        topic: 'lists',
        title: 'Arrow keys and letters over a board of app tiles',
        wish: 'homelab 120',
        asked: 'The tiles of the Apps page are one place in the tab order moved with the arrow keys, and a letter jumps to the app whose name starts with it. Does it behave as you would expect, and is it fine that the star key becomes <b>.</b> while letters are on?',
        h2: 'Move with the keyboard',
        intro: 'Tab into the board, then use the arrows, Home and End, or type a letter (<b>s</b> for Sonarr, <b>r</b> twice for the second R).',
        expected: [
            'One tab stop for the whole board; arrows move by where the tiles are drawn; Home and End go to the ends; a letter goes to the next tile whose name starts with it, a second press of the same letter to the one after.',
            'The line under the board says where the focus went. With <b>Arrows only</b> the letters do nothing.',
        ],
        look: 'Formal: the focus ring on the moved tile must be clear. The star on a tile keeps working with the pointer and the key <b>.</b>.',
        controls: group('Keys', 'keys', [['letters', 'Arrows and letters', true], ['arrows', 'Arrows only']]),
        component: `<div class="kp-card pg-card"><div class="pg-board" id="pg-keys-board" data-kp-tiles-keys="letters"><div class="kp-entity-grid pg-tiles" id="pg-keys-grid" data-kp-entity-grid data-kp-entity-kind="tile" role="list"></div></div>
            <p class="pg-log" id="pg-keys-log" role="status">Focus a tile to start.</p></div>`,
    },
    {
        id: 'heat-paging',
        topic: 'lists',
        title: 'Earlier, Today and Later on the heat grid',
        wish: 'homelab 100',
        asked: 'The backups grid shows a week; to see the weeks before, the page recomputed its own window. The grid now has the Earlier, Today and Later buttons, and Page Up and Page Down do the same. Do the buttons sit right and say enough?',
        h2: 'Backups, week by week',
        intro: 'Press Earlier to go back a week, Later to come forward, Today to return. The words between the buttons name the week shown.',
        expected: ['Earlier goes up to three weeks back and is then off; Later is off at this week; Today is off now. The words name the week (<b>13 to 19 October 2026</b>) and the columns change with them.', '<b>Loading</b>, <b>Empty</b> and <b>Failed</b> keep the bar and the grid&rsquo;s height.'],
        look: 'Formal: three ghost buttons and a muted label on one line before the grid. Check the gap between the bar and the grid.',
        controls: group('State', 'heat', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card"><div class="kp-heat" id="pg-heat" data-kp-heat data-kp-heat-latest="end" data-kp-key="backups"></div></div>`,
    },
    // ---------------------------------------------------------------- charts and logs
    {
        id: 'chart-seconds',
        topic: 'charts',
        topicTitle: 'Charts and logs',
        title: 'A chart whose times are in seconds',
        wish: 'homelab 103',
        asked: 'The host reports request times as Unix seconds and the chart wanted milliseconds, so every page converted. The chart now takes <code>timeUnit: &apos;s&apos;</code>. The two charts must be identical.',
        h2: 'Requests per minute, times in seconds',
        intro: 'The same readings, given once in seconds and once in milliseconds. The line under the chart shows the first point of what was handed over.',
        expected: ['Both readings draw the same chart: the same axis labels (clock times), the same crosshair times, the same event mark.', 'The first-point line changes between a ten-digit number and a thirteen-digit one; nothing else does.'],
        look: 'Formal: thin lines, quiet grid. The time axis must show dd/mm and clock times, never raw numbers.',
        controls: group('Times in the data', 'secs', [['s', 'Seconds (new)', true], ['ms', 'Milliseconds (before)']]),
        component: `<div class="kp-card pg-card"><figure class="kp-chart" id="pg-chart-s" data-kp-chart aria-label="Requests per minute" lang="en-GB"></figure><p class="pg-log" id="pg-chart-s-first">First point: …</p></div>`,
    },
    {
        id: 'chart-columns',
        topic: 'charts',
        title: 'Histogram columns and a second level',
        wish: 'homelab 104',
        asked: 'The Metrics distribution wants columns instead of a line and two levels (warning and alarm). Do the columns read as a histogram and the two dotted lines as two different levels?',
        h2: 'Response time per hour',
        intro: 'Switch the series between a line and columns, and between one level and two.',
        expected: ['<b>Columns</b>: one column per hour, 76 % of its slot wide, standing on the baseline, the series colour at a soft strength; the crosshair and tooltip still work.', '<b>Two levels</b>: the alarm stays the main dashed line, the warning is finer and dotted; the axis grows to keep both in view.'],
        look: 'Formal: the columns must not be heavier than the grid; the two levels must be told apart without colour.',
        controls: group('Shape', 'shape', [['columns', 'Columns', true], ['line', 'Line']]) + group('Levels', 'levels', [['two', 'Warning and alarm', true], ['one', 'Alarm only']]),
        component: `<div class="kp-card pg-card"><figure class="kp-chart" id="pg-chart-c" data-kp-chart aria-label="Response time per hour" lang="en-GB"></figure></div>`,
    },
    {
        id: 'logviewer',
        topic: 'charts',
        title: 'The log viewer fits its box, and says why it failed',
        wish: 'homelab 117 (the width) and 115 (the reason)',
        asked: 'A log viewer inside a box with a margin ran past the box; it now fits. And when the host could not be read, the failed plate can carry the host&rsquo;s own reason. Is the failed plate with the reason what you want to read?',
        h2: 'The host log in a box with a margin',
        intro: 'The dashed frame is the box; the viewer has a margin inside it. Switch the margin off and on, and the failed plate between the package&rsquo;s words and the host&rsquo;s.',
        expected: ['<b>With a margin</b>: the viewer&rsquo;s right edge is inside the dashed frame, as far from it as the left one (before: it ran out of the frame).', '<b>Failed (the host&rsquo;s reason)</b>: the plate says <b>Loki did not answer: connection refused</b> under its heading; <b>Failed (package words)</b> says the package&rsquo;s sentence. Both fill the viewer and have a Retry.'],
        look: 'Formal: a bordered viewer. Compare the right margin with the left one.',
        controls: group('State', 'log', [['ready', 'Lines', true], ['host', 'Failed: the host’s reason'], ['plain', 'Failed: package words']]) + group('Box', 'log-margin', [['margin', 'With a margin', true], ['flush', 'No margin']]),
        component: `<div class="pg-fit" id="pg-log-fit"><div class="kp-logviewer" id="pg-log" data-kp-logviewer data-kp-log-tools="search,wrap,copy" aria-label="Host log"></div></div>`,
    },
    // ---------------------------------------------------------------- forms and keys
    {
        id: 'yaml-field',
        topic: 'forms',
        topicTitle: 'Forms and keys',
        title: 'A text box for a YAML file, with its line and column',
        wish: 'homelab 94',
        asked: 'The Files editor was a bare text area. The code field numbers the lines, says where the caret is and marks the line a problem is on. The package brings no parser: the page or its server says what is wrong. Is this the right amount for editing a config file?',
        h2: 'Edit a compose file',
        intro: 'Type in the box and watch the line and column. The buttons load a sample: clean, with a bad indent, with a tab, and one where the error comes from a server a moment later.',
        expected: ['Under the box: <b>Line 3, column 12 · YAML</b>, following the caret. Line numbers on the left; the line with a problem has its number marked and the sentence <b>Line 4, column 4: …</b> stands under the box in the problem colour.', 'The check here is a mock (tabs, odd indents); a real page puts its parser or its server there.'],
        look: 'Formal: the same field as the JSON field. Check the readout and the problem sentence keep their place and do not push the box.',
        controls: group('Sample', 'yaml', [['clean', 'Clean file', true], ['indent', 'Bad indent'], ['tab', 'Tab on line 3'], ['server', 'Error from the server']]),
        component: `<div class="kp-card pg-card"><div class="kp-field"><label class="kp-field__label" for="pg-yaml">Compose file</label><textarea class="kp-field__input kp-field__input--multiline" id="pg-yaml" name="compose" data-kp-code-field="yaml" rows="8"></textarea></div></div>`,
    },
    {
        id: 'quiet-hours',
        topic: 'forms',
        title: 'Quiet hours: from, until, days and what still comes through',
        wish: 'homelab 96',
        asked: 'The notification rules composed a switch, two time fields and the weekday picker by hand. The quiet-hours control joins them with one sentence in words. Is the control clear, and is the sentence right?',
        h2: 'No push at night, except the critical',
        intro: 'Change the times, the days and the ticks and read the sentence under them.',
        expected: ['<b>On</b>: <b>Quiet from 22:00 to 07:00: Every weekday. Critical still comes through.</b>, and the sentence follows what you change. <b>Off</b>: the fields stay, dimmed and out of the tab order, and the sentence says <b>Quiet hours are off.</b>', '<b>Same time</b> shows <b>Pick two different times.</b> under the times. <b>Disabled</b> shows its reason; <b>Loading</b> shows the control&rsquo;s bars. The control is as high in every state.'],
        look: 'Formal: labels in one column, fields in the next, one rhythm between the rows. Check the labels line up with the middle of their fields.',
        controls: group('Value', 'quiet', [['on', 'On, weeknights', true], ['off', 'Off'], ['same', 'Same start and end']]) + group('State', 'quiet-state', [['ready', 'Ready', true], ['disabled', 'Disabled with a reason'], ['loading', 'Loading']]),
        component: `<div class="kp-card pg-card"><div class="kp-quiet" id="pg-quiet" data-kp-quiet></div></div>`,
    },
    {
        id: 'snooze-words',
        topic: 'forms',
        title: 'The snooze picker says pause on one page and remind on another',
        wish: 'homelab 125',
        asked: 'The picker used one set of words for the whole page, so a page that used it as a pause had to swap the words in and out. Each picker now chooses its own words. Are the pause words right?',
        h2: 'Remind me, and pause',
        intro: 'Two pickers of the same component with different words, one above the other.',
        expected: ['The upper picker is the reminder: <b>Remind me later</b>, <b>Not snoozed</b>, <b>Snoozed until …</b>, <b>End snooze</b>.', 'The lower one is the pause: <b>Pause until…</b>, <b>Not paused</b>, <b>Paused until …</b>, <b>Resume now</b>. Pressing a choice in one never changes the words of the other.'],
        look: 'Formal: chips with the exact moment under each. Check that the pause words fit the chips and the status line without cutting.',
        controls: group('State', 'snooze', [['idle', 'Not snoozed', true], ['snoozed', 'Snoozed until tomorrow']]),
        component: `<div class="kp-card pg-card"><p class="pg-cap">Notifications &mdash; a reminder</p><div class="kp-snooze" id="pg-snooze-a" data-kp-snooze data-kp-snooze-choices="1h 4h tomorrow" data-kp-now="2026-10-20T14:00:00+02:00"></div>
            <p class="pg-cap">Schedules &mdash; a pause</p><div class="kp-snooze" id="pg-snooze-b" data-kp-snooze data-kp-snooze-words="pause" data-kp-snooze-choices="1h 4h tomorrow" data-kp-now="2026-10-20T14:00:00+02:00"></div></div>`,
    },
    {
        id: 'confirm-id',
        topic: 'forms',
        title: 'The typed confirmation takes the field&rsquo;s id',
        wish: 'homelab 123',
        asked: 'A page whose steps address the confirmation field by a stable id had to rewrite the generated id after the fact. The block now takes the id (and the form name) up front. Nothing changes to look at; this shows the ids.',
        h2: 'Type the name to remove',
        intro: 'The confirmation for removing a stack. The lines under it print the ids the field and its label really have.',
        expected: ['<b>Stable id</b>: the field&rsquo;s id is <b>act-confirm</b> and so is its label&rsquo;s <b>for</b>; its name is <b>confirm</b>. <b>Generated</b>: an id like <b>kp-type-confirm-3-input</b>, as before. Typing <b>jellyfin</b> still turns the match on.'],
        look: 'Formal: the same block as always. Only the ids differ.',
        controls: group('Field id', 'confirm', [['stable', 'Stable id (new)', true], ['generated', 'Generated (before)']]),
        component: `<div class="kp-card pg-card"><div id="pg-confirm-host"></div><p class="pg-log" id="pg-confirm-ids">…</p></div>`,
    },
    {
        id: 'space-key',
        topic: 'forms',
        title: 'The Space key and Esc inside a field, in the shortcut engine',
        wish: 'homelab 122',
        asked: 'The engine could not register the Space key or a key that works while you type in a field, so the dashboard kept two hand-made key handlers. Both are now part of the engine and appear in the key sheet. Does the sheet read right?',
        h2: 'Schedules: Space turns one on or off',
        intro: 'Focus a schedule (Tab, then the arrows are the browser&rsquo;s) and press Space. Open the change form and press Esc while you type in it.',
        expected: ['<b>Space</b> on a focused schedule turns it on or off, and the sheet lists the key as <b>Space</b>.', '<b>Esc</b> inside the change form&rsquo;s field closes the form (the sheet says so); in the schedules list without the field it does nothing.'],
        look: 'Formal: the sheet under the list is the package&rsquo;s own. Check that the key caps and the words sit in columns.',
        controls: group('Change form', 'space-form', [['open', 'Open the change form'], ['close', 'Close it']]),
        component: `<div class="kp-card pg-card" id="pg-keys-scope"><ul class="pg-schedules" id="pg-schedules" aria-label="Schedules"></ul>
            <form class="pg-change" id="pg-change" hidden><label class="kp-field__label" for="pg-change-at">Run at</label><input class="kp-field__input" id="pg-change-at" value="03:00" /></form>
            <dialog class="kp-shortcuts pg-sheet" data-kp-shortcuts data-kp-shortcuts-live data-kp-hotkey="none" aria-label="Keys of this page" open></dialog></div>`,
    },
    // ---------------------------------------------------------------- pages and notices
    {
        id: 'page-contents',
        topic: 'pages',
        topicTitle: 'Pages and notices',
        title: '&ldquo;On this page&rdquo; follows you as you scroll',
        wish: 'homelab 95',
        asked: 'The Settings page drew a list of its groups that marks the one you are in. It is now a component: built from the headings, or from items with a count. Does the marking follow your reading well, and is the list calm?',
        h2: 'A long page of settings',
        intro: 'Scroll the pane on the right, or press an entry in the list. The entry of the section you are in is marked.',
        expected: ['A bar on the start edge and the heavier weight mark the current entry; it changes as the next heading passes the top of the pane, and the last entry marks when you reach the end.', 'Pressing an entry scrolls there and moves the focus to the heading. <b>Items with counts</b> shows a number at the end of each entry; <b>Loading</b> shows three bars in the list&rsquo;s place.'],
        look: 'Formal: a muted list with one marked entry. Check the entries are whole (they wrap, never cut) and the marked bar is on the start edge.',
        controls: group('Entries', 'contents', [['headings', 'From the headings', true], ['items', 'Items with counts']]) + group('State', 'contents-state', [['ready', 'Ready', true], ['loading', 'Loading']]),
        component: `<div class="pg-contents"><div class="pg-navbox"><nav class="kp-contents" id="pg-contents" data-kp-contents data-kp-contents-for="#pg-pane" data-kp-contents-scroller="#pg-pane" data-kp-contents-headings="h2, h3" data-kp-contents-offset="8"></nav></div>
            <div class="pg-pane" id="pg-pane" tabindex="0" role="region" aria-label="Settings">
            <h2>Working copy</h2><p>Where the dashboard keeps the files it edits before it saves them to the host. A working copy is a git checkout; it is read when the page opens and again after every save.</p><p>Nothing here is sent anywhere until you save.</p>
            <h2>Sign-in</h2><p>Who may open the dashboard and how: passkeys, machine tokens and the session length.</p><h3>Passkeys</h3><p>The devices that can sign in without a password.</p><h3>Machine tokens</h3><p>Keys for scripts, each with a scope and an expiry.</p>
            <h2>This browser</h2><p>What this browser remembers about the dashboard: the theme, the folded groups, the last tab. Clearing it affects only this browser.</p><p>Remembered groups are kept by name, so two dashboards on one machine do not mix.</p>
            <h2>Notifications</h2><p>Where the dashboard pushes what happens, and when it stays quiet.</p><p>A critical notice can break the quiet; the rest waits in the inbox.</p>
            <h2>host.toml</h2><p>The host&rsquo;s own settings file, group by group. Each key shows its default, its current value and what it does.</p><p>An invalid key is marked and the save is held back until it is fixed.</p></div></div>`,
    },
    {
        id: 'notes-gate',
        topic: 'pages',
        title: 'The release notes inside the acknowledge gate',
        wish: 'homelab 113',
        asked: 'The gate only linked out to the release notes. The host fetches the notes now and the gate shows them in a fold, as markdown drawn safely (nothing in the text can run). Is the fold the right place, and does the text read well?',
        h2: 'jellyfin 10.11 &rarr; 12.1',
        intro: 'Open the release notes, read them, tick the box and the Update button wakes up. The second text is hostile on purpose: a script tag and a javascript link.',
        expected: ['The fold <b>Release notes</b> opens a scrolling box: headings, a list with a nested item, bold, code, a quote, a fenced block and a link (opens in a new tab).', '<b>Hostile text</b> shows the script tag as plain text and the javascript link as plain words. <b>Loading</b> and <b>Fetch failed</b> use the gate&rsquo;s own states; <b>No notes</b> removes the fold. Here the tick needs the notes opened first.'],
        look: 'Formal: the alert warns, the fold is quiet, the box has one border. Check the notes box keeps its height and the buttons keep their places in every state.',
        controls: group('Notes', 'gate', [['ready', 'Release notes', true], ['hostile', 'Hostile text'], ['loading', 'Loading'], ['error', 'Fetch failed'], ['none', 'No notes']]),
        component: `<div class="kp-card pg-card"><div class="kp-alert kp-alert--warning" id="pg-gate" data-kp-ack data-kp-ack-for="#pg-gate-go" data-kp-ack-key="jellyfin" data-kp-ack-label="I read the release notes of 12.1" data-kp-ack-require-notes data-kp-ack-notes-label="Release notes of jellyfin 12.1" data-kp-ack-retry>
            <div class="kp-alert__body"><strong>jellyfin 10.11 &rarr; 12.1 is a major version.</strong> A major release can change its settings or move its data.</div></div>
            <div class="pg-actions"><button class="kp-button kp-button--primary" type="button" id="pg-gate-go">Update jellyfin</button></div></div>`,
    },
    {
        id: 'alert-remember',
        topic: 'pages',
        title: 'A dismissed note stays dismissed',
        wish: 'homelab 119',
        asked: 'An explanation you closed came back on every visit. With <code>data-kp-remember</code> the closed alert stays closed, in this browser. Is that what you expect from a note you dismissed?',
        h2: 'The Inbox note',
        intro: 'Close the note with its cross, then reload the page (or come back to this step): it is still closed. Close it does the same as the cross; Show it again brings it back.',
        expected: ['Closing plays the alert&rsquo;s own leaving motion and keeps the choice. After a reload the alert is not there at all, with no flash of it first.', '<b>Show it again</b> forgets the choice and shows the alert.'],
        look: 'Formal: an info alert with a close cross. Check the cross has room and the page below does not jump when it is gone beyond the alert&rsquo;s own fold.',
        controls: group('Memory', 'alert', [['close', 'Close it'], ['again', 'Show it again', true]]),
        component: `<div class="kp-card pg-card"><div class="kp-alert kp-alert--info pg-alert" id="pg-alert" data-kp-remember="wishes-1120-inbox-note" role="note"><div class="kp-alert__body"><strong>What the Inbox is.</strong> It keeps what happened while you were away; nothing here needs you to act.</div><button type="button" class="kp-icon-button kp-alert__close" aria-label="Close this note">&times;</button></div>
            <p class="pg-log">The rest of the Inbox would stand here.</p></div>`,
    },
    {
        id: 'decorate-hook',
        topic: 'pages',
        title: 'The Live view can mark the package&rsquo;s own buttons',
        wish: 'homelab 65, 66, 67 (the hook) and 114',
        asked: 'The Live view marks the buttons it can press with a hook the components call, but the heat grid, the toolbar&rsquo;s active filters and the data table&rsquo;s own buttons had no such hook, so the dashboard searched the page after every draw. They have it now. Here the hook draws a dotted outline and the kind of control on every control it is handed.',
        h2: 'Which buttons the page can drive',
        intro: 'A toolbar with two active filters, a data table with its search, Add filter and Clear buttons, and a small heat grid. Every outlined control was handed to the page&rsquo;s <code>decorate</code> function as the package built it.',
        expected: ['Outlined: the two tag crosses and <b>Clear all</b> in the toolbar, the table&rsquo;s search box, <b>Add filter</b> and <b>Clear the search and filters</b>, each row label and cell of the heat grid and its Earlier, Today and Later buttons.', '<b>Marks hidden</b> removes the outlines; nothing else changes (the hook marks, it never restyles).'],
        look: 'Formal: the outlines are the page&rsquo;s demo styling, not the package&rsquo;s. Check that every button the section shows is outlined, none missing.',
        controls: group('Marks', 'marks', [['on', 'Marks shown', true], ['off', 'Marks hidden']]),
        component: `<div class="kp-card pg-card" id="pg-decorate"><div class="kp-toolbar" id="pg-toolbar" data-kp-toolbar role="group" aria-label="Containers"><div class="kp-toolbar__search"><input type="search" class="kp-field__input kp-toolbar__input" placeholder="Search containers" aria-label="Search containers" /></div></div>
            <div id="pg-dt-host"></div><div class="kp-heat" id="pg-heat-mark" data-kp-heat data-kp-key="marks"></div></div>`,
    },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const asSection = (s) => `<section id="${s.id}" data-review-item="${s.id}" data-review-topic="${s.topic}"${s.topicTitle ? ` data-review-topic-title="${s.topicTitle}"` : ''} data-review-components="${s.id}" data-review-title="${s.title}" aria-labelledby="h-${s.id}">
    <div class="pg-asked"><p><b>What is asked</b> (${s.wish}): ${s.asked}</p></div>
    <div class="pg-intro"><h2 id="h-${s.id}">${s.h2}</h2><p>${s.intro}</p></div>
    <div class="pg-expected"><p><b>Expected:</b></p><ul>${s.expected.map((e) => `<li>${e}</li>`).join('')}</ul></div>
    <div data-review-look><p data-for="formal">${s.look}</p></div>
    <div data-review-controls data-review-controls-for="${s.id}-component">${s.controls}</div>
    <div id="${s.id}-component" class="pg-component">${s.component}</div>
</section>`;

const problems = [];
const ids = SECTIONS.map((s) => s.id);
for (const id of new Set(ids)) if (ids.filter((i) => i === id).length > 1) problems.push(`the item "${id}" stands twice`);
if (SECTIONS.length * THEMES.length > MAX_ITEMS) problems.push(`${SECTIONS.length * THEMES.length} items: more than ${MAX_ITEMS}`);
const body = SECTIONS.map(asSection).join('\n\n');
const seen = new Map();
for (const m of body.matchAll(/\sid="([^"]+)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
for (const [k, n] of seen) if (n > 1) problems.push(`the id "${k}" stands ${n} times`);
if (problems.length) {
    console.error(`build: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    process.exit(1);
}

const verdictsFile = new URL('VERDICTS.json', here);
if (!existsSync(verdictsFile)) writeFileSync(verdictsFile, `${JSON.stringify({ demo: ID, rounds: [] }, null, 4)}\n`);
const verdicts = JSON.parse(readFileSync(verdictsFile, 'utf8'));
const received = [...new Set((verdicts.rounds ?? []).map((r) => r.page).filter(Boolean))];
const out = fileURLToPath(new URL('demo.html', here));
const current = existsSync(out) ? /"round":\s*"([^"]+)"/.exec(readFileSync(out, 'utf8'))?.[1] : undefined;
const roundId = current && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(current) ? current : `${ID}-${randomUUID()}`;

const title = 'Homelab wishes built in the package';
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
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>

        <main id="main" class="cat-main pg-page">
            <header class="pg-head">
                <h1>${escapeHtml(title)}</h1>
                <p class="cat-intro">
                    The homelab admin dashboard hit the edges of the package in ${SECTIONS.length} places. Each is now an option or a part of the package; this
                    page shows all of them in formal only, one section per wish. Everything is opt-in: a component that is not given the option looks and
                    behaves as you approved it. ${SECTIONS.length} sections, ${SECTIONS.length} pairs; all data is mock.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does.</p>
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
console.log(`${ID}: ${SECTIONS.length} items, round ${roundId}`);
