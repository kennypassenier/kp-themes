// Builds research/wishes-1028/demo.html: the eleven wishes Kenny chose on 2026-10-28 (almanac 9, 17, 21; homelab 136; chassis-rs 1, 20;
// Kitchen 1 to 5), as ONE review page (DEMO_RULES ch. 1 and 6: one page, formal only, one section per wish, at most 25 items).
// Every section is written here once, in the shape research/wishes-1120 uses: what is asked, the heading and one sentence, what to expect,
// what to look at in formal, the controls above the component, and the component. demo.js wires them by their own elements; page.css is the
// frame. The data is the apps' own: Kitchen's dishes and cooking steps, Almanac's calendars and mapping profile, homelab's stacks (mock
// where it says so). Run: node research/wishes-1028/build.mjs (the page keeps its round id until the verdict is recorded).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const here = new URL('./', import.meta.url);
const ID = 'wishes-1028';
const THEMES = ['formal'];
const MAX_ITEMS = 25;

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
const group = (label, name, buttons) =>
    `<div role="group" aria-label="${label}">${buttons
        .map(([value, words, on]) => `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}" aria-pressed="${on ? 'true' : 'false'}">${words}</button>`)
        .join('')}</div>`;

/** The mapping profile Almanac reads (fixtures/profiles/home-assistant.toml, with the calendars it writes to). */
const TOML = `# Where the events of one source land.
schema_version = 2
source_id = "home-assistant"
target_calendar_id = "primary"
timezone = "Europe/Brussels"
default_duration_minutes = 60

[[calendar]]
name = "Almanac · Huishouden"
sources = ["home-assistant"]
shared_with = ["kenny"]

[[calendar]]
name = "Almanac · Infra"
sources = ["grafana", "uptime-kuma"]
reminders = { popup = 10, email = false }

[notes]
text = """
Energy prices get their own calendar:
a cheap-power window can span an afternoon.
"""`;

/** Almanac's version check, shortened (scripts/check-version.sh). */
const BASH = `#!/usr/bin/env bash
# One version, not three: Cargo.toml is the single source.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

cargo_version=$(grep -m1 '^version = ' Cargo.toml | sed 's/version = "\\(.*\\)"/\\1/')

if tag=$(git describe --exact-match --tags 2>/dev/null); then
    if [ "$tag" != "v$cargo_version" ]; then
        echo "VERSION MISMATCH: $tag and $cargo_version" >&2
        exit 1
    fi
    echo "version ok: $tag matches Cargo.toml"
fi`;


/** The first deliveries of the box (Almanac's profiles: home-assistant, grafana, uptime-kuma, energy-prices); mock times. */
const FEED = [
    ['09:02', 'home-assistant', 'Almanac · Huishouden', 'Dishwasher finished'],
    ['09:14', 'grafana', 'Almanac · Infra', 'Disk space low on the media stack'],
    ['09:31', 'energy-prices', 'Almanac · Energie', 'Cheap power 13:00 to 16:00'],
    ['09:48', 'uptime-kuma', 'Almanac · Infra', 'Jellyfin did not answer for 2 min'],
    ['10:05', 'home-assistant', 'Almanac · Huishouden', 'Washing machine finished'],
    ['10:20', 'grafana', 'Almanac · Infra', 'Backup of the kyu stack took 14 min'],
    ['10:36', 'uptime-kuma', 'Almanac · Infra', 'Jellyfin is back'],
    ['10:52', 'home-assistant', 'Almanac · Huishouden', 'Front door left open'],
    ['11:10', 'energy-prices', 'Almanac · Energie', 'Expensive power 17:00 to 20:00'],
    ['11:27', 'grafana', 'Almanac · Infra', 'Certificate for kp-soft.dev renews in 14 days'],
    ['11:44', 'home-assistant', 'Almanac · Huishouden', 'Plants need water'],
    ['12:03', 'uptime-kuma', 'Almanac · Infra', 'Traefik answers slowly'],
];
const FEED_ROWS = FEED.map(([time, source, calendar, event], i) => `<tr data-kp-row-key="d${i + 1}"><td>${time}</td><td>${source}</td><td>${calendar}</td><td>${event}</td></tr>`).join('');

/** homelab's stacks (stacks/ in the homelab repository); the counts, states and times are mock. */
const STACKS = [
    ['media', ['jellyfin', 'sonarr', 'radarr', 'prowlarr', 'bazarr', 'seerr', 'recyclarr'], 'running', '03:12'],
    ['metrics', ['prometheus', 'loki', 'alertmanager', 'loki-push', 'pve-exporter', 'grafana'], 'running', '03:20'],
    ['almanac', ['almanac', 'almanac-latch'], 'running', '03:25'],
    ['kyu', ['kyu', 'kyu-runner', 'http-switchboard', 'kitchen'], 'running', '03:31'],
    ['gateway', ['traefik', 'authelia', 'dns'], 'running', '03:38'],
    ['downloader', ['qbittorrent', 'gluetun', 'flaresolverr', 'sabnzbd', 'cross-seed'], 'stopped', 'missed'],
    ['syncthing', ['syncthing'], 'stopped', '02:55'],
];
const STACK_ROWS = STACKS.map(
    ([name, containers, status, backup]) =>
        `<tr data-kp-row-key="${name}"><td>${name}</td><td>${containers.length}</td><td>${status}</td><td>${backup}</td></tr>
                <tr data-kp-row-detail hidden><td colspan="5"><b>Containers in ${name}:</b> ${containers.join(', ')}.</td></tr>`,
).join('\n');

/** @type {{ id: string, title: string, topic: string, topicTitle?: string, wish: string, asked: string, h2: string, intro: string, expected: string[], look: string, controls: string, component: string }[]} */
const SECTIONS = [
    // ---------------------------------------------------------------- live lists
    {
        id: 'pill-tbody',
        title: 'The new-rows pill counts rows that arrive in a table',
        topic: 'tables',
        topicTitle: 'Data tables',
        wish: 'almanac 9',
        asked:
            'The "N new" pill (<code>data-kp-follow</code>) only watched the direct children of its scroller, so a data table inside it never counted. With <code>data-kp-follow-rows="tbody"</code> it counts the rows that arrive in the table body. Is that what the Deliveries page of Almanac needs, and is "a row counts once" the right rule when a sort brings rows back?',
        h2: 'Deliveries arriving while you read older ones',
        intro:
            'Almanac&rsquo;s Deliveries table in a box that scrolls. Scroll away from the newest row, add deliveries, and the pill counts them. Sorting puts the same rows back in a new order: that is not new.',
        expected: [
            '<b>At the newest row</b>: add a delivery and it appears, the box follows it, there is no pill. <b>Read older rows</b> scrolls up; add three deliveries and the pill says <b>3 new deliveries</b> with the way back.',
            '<b>Sort by source</b> redraws every row in a new order and the count stays the same. Pressing the pill (or <b>Back to the newest</b>) scrolls to the end and the pill leaves.',
        ],
        look: 'Formal is a paper plate. The pill sits on the box, over the rows, in the page&rsquo;s button look; the count is the exact number. The table header must not hide it.',
        controls:
            group('Deliveries', 'feed-add', [['one', 'Add one delivery'], ['three', 'Add three deliveries']]) +
            group('Reader', 'feed-read', [['older', 'Read older rows'], ['newest', 'Back to the newest']]) +
            group('Order', 'feed-sort', [['none', 'In arrival order', true], ['source', 'Sort by source']]),
        component: `<div class="kp-card pg-card">
            <div class="pg-host" id="pg-feed-host">
                <div class="pg-scroller" id="pg-feed" data-kp-follow="tail" data-kp-follow-rows="tbody" data-kp-pill-unit="delivery,deliveries" data-kp-since-left="off" tabindex="0" aria-label="Deliveries, newest last">
                    <div class="kp-datatable" id="pg-feed-table" data-kp-datatable data-kp-page-size="500" data-kp-page-sizes="none">
                        <div class="kp-table-wrap"><table class="kp-table"><caption>Deliveries to Almanac</caption>
                        <thead><tr><th scope="col" data-kp-field="time">Time</th><th scope="col" data-kp-field="source" data-kp-sort="text">Source</th><th scope="col" data-kp-field="calendar">Calendar</th><th scope="col" data-kp-field="event">Event</th></tr></thead>
                        <tbody id="pg-feed-body">${FEED_ROWS}</tbody></table></div>
                    </div>
                </div>
            </div>
            <p class="pg-log" id="pg-feed-log" role="status" aria-live="polite"></p></div>`,
    },
    {
        id: 'filter-field',
        title: 'Filter a data table by column id, not by a number that counts the control column',
        topic: 'tables',
        wish: 'homelab 136',
        asked:
            '<code>filter(column, value)</code> and <code>view().filters</code> counted the toggle column an expandable table adds, so the first data column was 1 and homelab looked the number up by header text. Now the column can be named by its <code>data-kp-field</code> (else its text): <code>filter("status", …)</code>, with <code>columnIndex(id)</code> and <code>view().filtersByField</code>. The numbers still work. Is naming the column the way you want it?',
        h2: 'homelab&rsquo;s stacks, filtered by name',
        intro:
            'An expandable table of stacks. Choose how the call is written (the old number, which counts the toggle column, or the new id) and what to show; both end in the same filter and the readout under the table shows what the call looked like and what the table reports.',
        expected: [
            '<b>Running</b>, <b>Stopped</b> and <b>Six or more containers</b> narrow the table; <b>All stacks</b> clears it. With <b>Field id</b> the readout reads <code>filter("status", …)</code>, with <b>Number</b> <code>filter(3, …)</code> (the toggle column is 0).',
            'Under both, <code>view().filtersByField</code> names the column (<code>status</code>); <code>view().filters</code> keeps the number. <b>Loading</b> lays the busy card over the rows, <b>Failed</b> the failed plate with Try again, <b>Nothing matches</b> the empty plate at the loaded height.',
        ],
        look: 'The table keeps one height in every state; the plates are centred in the rows&rsquo; place. Expand a row: its detail lists the containers of the stack.',
        controls:
            group('Write the call as', 'stack-mode', [['id', 'Field id (new)', true], ['number', 'Number (old)']]) +
            group('Show', 'stack-show', [['all', 'All stacks'], ['running', 'Running', true], ['stopped', 'Stopped'], ['six', 'Six or more containers'], ['none', 'Nothing matches']]) +
            group('State', 'stack-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['failed', 'Failed']]),
        component: `<div class="kp-card pg-card">
            <div class="kp-datatable pg-stacks" id="pg-stacks" data-kp-datatable data-kp-expandable data-kp-filter-ui="none" data-kp-busy-overlay data-kp-page-size="25" data-kp-page-sizes="none">
                <div class="kp-table-wrap"><table class="kp-table"><caption>Stacks</caption>
                <thead><tr><th scope="col" data-kp-field="stack" data-kp-sort="text">Stack</th><th scope="col" data-kp-field="containers" data-kp-sort="number" data-kp-filter="range">Containers</th><th scope="col" data-kp-field="status" data-kp-filter="choice">Status</th><th scope="col" data-kp-field="backup">Last backup</th></tr></thead>
                <tbody>${STACK_ROWS}
                </tbody></table></div>
            </div>
            <p class="pg-log" id="pg-stacks-log" role="status" aria-live="polite"></p>
            <dl class="pg-readout">
                <div><dt>The call</dt><dd><code id="pg-stacks-call">nothing yet</code></dd></div>
                <div><dt><code>view().filters</code></dt><dd><code id="pg-stacks-filters">{}</code></dd></div>
                <div><dt><code>view().filtersByField</code></dt><dd><code id="pg-stacks-fields">{}</code></dd></div>
            </dl></div>`,
    },
    // ---------------------------------------------------------------- code
    {
        id: 'code-toml',
        title: 'TOML and shell text are coloured in a code block',
        topic: 'code',
        topicTitle: 'Code block',
        wish: 'almanac 17',
        asked:
            'A <code>.kp-code</code> block took a language label but coloured only JSON. Naming the language <code>TOML</code> or <code>bash</code> (also sh, shell, zsh) now colours keys, tables, strings, numbers, comments, commands, flags and variables with the block&rsquo;s own tones; <code>data-kp-code-highlight="off"</code> leaves it plain. Is the colouring quiet enough for a config file?',
        h2: 'A mapping profile and a deploy script',
        intro: 'Almanac&rsquo;s mapping profile (TOML) and its version check (bash) in the package&rsquo;s code block. Switch the text, take the colour away, and walk the block&rsquo;s own states.',
        expected: [
            '<b>TOML</b>: keys in the primary ink, <code>[[calendar]]</code> tables bold, strings plain, numbers and booleans in the info ink, comments muted and italic, a multi-line string whole. <b>bash</b>: commands in the primary ink, flags and variables in the info ink, quoted text plain, the shebang a comment.',
            '<b>Colour off</b> is the plain block that was approved. <b>Loading</b> is the busy card at the block&rsquo;s height, <b>Empty</b> and <b>Failed</b> the package plate (Failed with Try again).',
        ],
        look: 'The text stays readable first: nothing is brighter than the keys, comments are quieter than the code, the line numbers and Copy are unchanged.',
        controls:
            group('Text', 'code-text', [['toml', 'Mapping profile (TOML)', true], ['bash', 'Version check (bash)']]) +
            group('Colour', 'code-colour', [['on', 'Coloured (new)', true], ['off', 'Plain']]) +
            group('State', 'code-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card"><figure class="kp-code" id="pg-code" data-kp-code></figure></div>`,
    },
    // ---------------------------------------------------------------- refresh
    {
        id: 'refresh-title',
        title: 'A title in the refresh bar',
        topic: 'refresh',
        topicTitle: 'Refresh',
        wish: 'almanac 21',
        asked:
            'Almanac draws "Almanac · Huishouden | Every 30 s | updated 12 s ago | Refresh now" with page CSS. <code>data-kp-refresh-title</code> (or a slot element) is now the first cell of the bar&rsquo;s own grid, and a form grid puts it in the label track. Does the bar read as one row, and is a title over a label right when both are set?',
        h2: 'One refresh bar per calendar',
        intro: 'Three bars: a title in a card, a title with a label (the title becomes the heading line), and a title slot that holds more than words, in a form grid. The first two take the controls.',
        expected: [
            '<b>Title on</b>: the title, the chooser, the freshness line and Refresh now stand on one row, the title in the first track. <b>Title off</b>: the bar is what it was. <b>Label on</b>: the title becomes the line over the bar and the label stands in the first cell.',
            '<b>Refresh fails</b>: the next refresh says it failed, keeps the data and offers Retry now; <b>Succeeds</b> brings the freshness line back. The form grid bar shows its slot (words and a badge) in the label track; nothing is cut at 390 px.',
        ],
        look: 'The title is the quietest bold text on the bar; it never pushes the chooser off the row except under 40rem, where the bar folds to one column in reading order.',
        controls:
            group('Title', 'rt-title', [['on', 'Title on', true], ['off', 'Title off']]) +
            group('Label', 'rt-label', [['off', 'No label', true], ['on', 'Label “Auto-refresh”']]) +
            group('Next refresh', 'rt-outcome', [['ok', 'Succeeds', true], ['fail', 'Fails']]),
        component: `<div class="kp-card pg-card">
            <div class="kp-refresh" id="pg-rt-one" data-kp-refresh="30" data-kp-refresh-title="Almanac · Huishouden"></div>
            <div class="kp-refresh" id="pg-rt-two" data-kp-refresh="60" data-kp-refresh-title="Almanac · Infra"></div>
            <div class="kp-formgrid"><div class="kp-refresh" id="pg-rt-grid" data-kp-refresh="300"><span data-kp-refresh-slot="title"><b>Almanac · Energie</b> <span class="kp-badge">1 source</span></span></div></div></div>`,
    },
    // ---------------------------------------------------------------- forms
    {
        id: 'secret-input',
        title: 'A secret you type: hidden typing, Show, Paste and Copy',
        topic: 'forms',
        topicTitle: 'Forms and keeping changes',
        wish: 'chassis-rs 1',
        asked:
            'The secret component only displayed a value. <code>data-kp-secret-mode="input"</code> is the same field turned round: you type or paste, the typing is hidden, Show reveals it for a few seconds and hides it again when you leave, Copy empties the clipboard again after 30 s. Built from the input, buttons and the line of the display field. Is this the entry field the kit needs?',
        h2: 'Paste the Cloudflare token',
        intro: 'The field fills its row; its buttons are the display field&rsquo;s. Type or paste a token, show it, copy it. The controls fill it, mark it invalid or take it away.',
        expected: [
            '<b>Empty</b>: the line says <b>Typing is hidden</b>, Show and Copy are off. <b>A token typed</b>: dots in the box, the line says <b>40 characters, hidden</b>. <b>Show</b> turns the box to the mono text with a dashed edge and the line counts down (<b>Hides in 28 s</b>); leaving the box, or the countdown, hides it again.',
            '<b>Invalid</b> marks the box with the failed rule and says why under it; <b>Disabled</b> turns the box and every button off with the reason; <b>Hides after</b> takes seconds, minutes or hours (<code>5s</code>, <code>1min</code>) or <b>never</b>.',
        ],
        look: 'The box has the control height and fills the row at every width; the line under it keeps its height whatever it says, so nothing below moves.',
        controls:
            group('Value', 'sec-value', [['empty', 'Empty', true], ['token', 'A token typed']]) +
            group('Problem', 'sec-problem', [['none', 'None', true], ['invalid', 'Invalid'], ['disabled', 'Disabled']]) +
            group('Hides after', 'sec-ttl', [['5s', '5 s'], ['30s', '30 s', true], ['1min', '1 min'], ['0', 'Never']]),
        component: `<div class="kp-card pg-card">
            <p class="kp-field__label" id="pg-sec-label">Cloudflare API token</p>
            <div class="kp-secret" id="pg-secret" data-kp-secret data-kp-secret-mode="input" data-kp-secret-ttl="30s" data-kp-secret-clear="30s" data-kp-secret-label="Cloudflare API token" data-kp-secret-name="cloudflare_token" data-kp-secret-placeholder="Paste or type the token"></div>
            <p class="pg-log" id="pg-sec-log" role="status" aria-live="polite"></p></div>`,
    },
    {
        id: 'unsaved-storage',
        title: 'Where the unsaved bar keeps a draft',
        topic: 'forms',
        wish: 'chassis-rs 20',
        asked:
            'The unsaved bar kept a changed form in <code>sessionStorage</code> and nothing else. It now takes a storage the way <code>configureRemember</code> does: <code>data-kp-keep="local"</code>, <code>attachUnsaved(root, { storage })</code> or <code>configureUnsaved({ storage })</code>. Browser storage only. Is that the option chassis-rs needs to keep its drafts in its own store?',
        h2: 'Change the backup window, reload, find it again',
        intro: 'homelab&rsquo;s backup settings. Change a value, then <b>Reload the form</b>: the bar comes back with the changes from the storage you chose, and the readout says which store holds them.',
        expected: [
            '<b>Session</b> (the default) and <b>Local</b> keep the draft in the browser&rsquo;s own stores; <b>The page&rsquo;s own store</b> is a Storage-shaped object this page hands in. After a change the readout lists the key in the chosen store only.',
            '<b>Reload the form</b> puts the settings back to what was saved, attaches the bar again and the draft returns with the toast <b>2 changes kept from before you left</b>; <b>Discard</b> empties the store. <b>Nowhere</b> keeps nothing: Reload brings the saved values.',
        ],
        look: 'The bar and its chip are the unchanged approved look; the readout is the page&rsquo;s own. Check that nothing is written to a store you did not choose.',
        controls:
            group('Keep the draft in', 'uns-store', [['session', 'Session (default)', true], ['local', 'Local'], ['own', 'The page’s own store'], ['none', 'Nowhere']]) +
            group('Form', 'uns-act', [['change', 'Change two values'], ['reload', 'Reload the form']]),
        component: `<div class="kp-card pg-card">
            <header class="pg-bar"><div><h3 class="kp-page-header__title">Backup settings</h3><p class="pg-log">Written to host.toml only when you save.</p></div>
            <div id="pg-unsaved-slot" class="pg-unsaved-slot"></div></header>
            <form class="kp-formrows kp-formrows--lines" id="pg-settings" action="#">
                <div class="kp-formrow"><div class="kp-formrow__label">Backup window<small>When the nightly run starts</small></div><div class="kp-formrow__control"><input class="kp-field__input" type="time" name="pg-window" value="03:00" aria-label="Backup window" /></div><div class="kp-formrow__aside">default 03:00</div></div>
                <div class="kp-formrow"><div class="kp-formrow__label">Keep snapshots<small>How many nights stay</small></div><div class="kp-formrow__control"><input class="kp-field__input" type="number" name="pg-keep" value="14" aria-label="Keep snapshots" /></div><div class="kp-formrow__aside">default 14</div></div>
            </form>
            <dl class="pg-readout">
                <div><dt>In the session store</dt><dd><code id="pg-uns-session">nothing</code></dd></div>
                <div><dt>In the local store</dt><dd><code id="pg-uns-local">nothing</code></dd></div>
                <div><dt>In the page&rsquo;s own store</dt><dd><code id="pg-uns-own">nothing</code></dd></div>
            </dl></div>`,
    },
    {
        id: 'form-submit',
        title: 'A valid form is not sent a second time by the browser',
        topic: 'forms',
        wish: 'Kitchen 5',
        asked:
            '<code>attachForms</code> fired <code>kp-form-valid</code> but left the browser to submit the form as well, so a save by <code>fetch</code> was followed by a reload. It now calls <code>preventDefault()</code> on a valid form; <code>data-kp-form-native-submit</code> brings the browser&rsquo;s submit back. <b>This changes behaviour for every consumer</b> and is in the CHANGELOG. Is prevented the right default?',
        h2: 'Log a bad day',
        intro: 'Kitchen&rsquo;s bad-day form. Send a valid or an empty form; the log says whether the page&rsquo;s handler ran and whether the browser would have submitted (the page stops it either way, so the demo never reloads).',
        expected: [
            '<b>Prevented (new default)</b>: a valid form logs <b>kp-form-valid, the browser submit was stopped</b>. <b>Allowed</b>: <b>the browser would also have submitted: yes</b>. An empty form shows the summary with its links and logs <b>invalid</b> in both.',
            '<b>Server refuses</b> shows the server&rsquo;s message on the field and the summary; <b>accepts</b> ends the busy Save after a moment.',
        ],
        look: 'The summary, the field messages and the busy button are the approved form look; the log under the form is the page&rsquo;s own.',
        controls:
            group('Browser submit', 'fs-native', [['prevented', 'Prevented (new default)', true], ['allowed', 'Allowed']]) +
            group('Server', 'fs-server', [['accepts', 'Accepts', true], ['refuses', 'Refuses']]) +
            group('Send', 'fs-send', [['valid', 'A valid form'], ['empty', 'An empty form']]),
        component: `<div class="kp-card pg-card">
            <form class="kp-form" id="pg-badday" data-kp-form action="#" novalidate>
                <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
                <div class="pg-twocol">
                    <div class="kp-field"><label class="kp-field__label" for="pg-bd-dish">Dish <span class="kp-field__required">required</span></label><input class="kp-field__input" id="pg-bd-dish" name="dish" required value="Shakshuka" /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                    <div class="kp-field"><label class="kp-field__label" for="pg-bd-portions">Portions <span class="kp-field__required">required</span></label><input class="kp-field__input" id="pg-bd-portions" name="portions" type="number" min="1" required value="2" /><span class="kp-field__error" data-kp-field-error hidden></span></div>
                </div>
                <div class="pg-actions"><button type="submit" class="kp-button kp-button--primary" data-kp-submit>Save</button></div>
            </form>
            <ul class="pg-events" id="pg-bd-log" aria-live="polite" aria-label="What happened"></ul></div>`,
    },
    // ---------------------------------------------------------------- gantt
    {
        id: 'gantt-legend',
        title: 'The gantt legend names only the states a plan uses',
        topic: 'gantt',
        topicTitle: 'Run timeline',
        wish: 'Kitchen 1',
        asked:
            'The legend of the run timeline always listed ok, failed, running and queued. A cooking plan has only done, now and still to do. <code>data-kp-gantt-legend</code> now takes <code>auto</code> (the states the runs use) or a list (<code>"ok running planned"</code>); <code>all</code> is the default and <code>off</code> as before. Do the names read right for a plan?',
        h2: 'Spaghetti bolognese, two tracks',
        intro: 'Kitchen&rsquo;s cook plan as a timeline: the sauce and the pasta, what is done, what is cooking and what is still to do. Change what the legend names.',
        expected: [
            '<b>All states</b> (the default) names succeeded, failed, running, queued and planned. <b>Only the states used</b> names succeeded, running and planned. <b>A list</b> names exactly succeeded, running and planned, whether a bar uses them or not; <b>No legend</b> takes it away.',
            '<b>Loading</b> is the busy card over the lanes, <b>Empty</b> and <b>Failed</b> the package plate; the legend follows whatever the lanes hold.',
        ],
        look: 'The swatches are the bars&rsquo; own looks (solid, striped, outlined); the legend row keeps its place and height when states leave.',
        controls:
            group('Legend', 'gl-legend', [['all', 'All states', true], ['auto', 'Only the states used'], ['list', 'A list of three'], ['off', 'No legend']]) +
            group('State', 'gl-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card"><section class="kp-gantt" id="pg-gl" data-kp-gantt data-kp-gantt-toolbar="off" data-kp-gantt-hint="off" aria-label="Spaghetti bolognese, cooking plan"></section></div>`,
    },
    {
        id: 'gantt-rest',
        title: 'A running bar shows the time it still has',
        topic: 'gantt',
        wish: 'Kitchen 2',
        asked:
            'A running bar ended at now, so the time a step still had left was not drawn (Kitchen laid a lane stretch under it by hand). A run with <code>plannedEnd</code> now draws its remainder after the line for now, in the planned look, shrinking as the clock runs. <code>data-kp-gantt-rest="off"</code> leaves it out. Does the remainder read as time still to come?',
        h2: 'Simmer the ragù for 45 minutes',
        intro: 'The ragù has simmered for 20 minutes and has 25 left. Switch the remainder on and off, move the planned end, or let the plan run late.',
        expected: [
            '<b>Remainder on</b>: a hatched, outlined stretch continues the striped bar from the line for now to the planned end, on the same row; hover the bar: <b>planned until</b> the time. <b>Off</b>: the bar ends at now as before.',
            '<b>Plan overrun</b> puts the planned end in the past: the stretch is gone and the bar keeps growing. <b>Planned end later</b> moves it out; a live window reaches far enough to hold it. Loading, Empty and Failed are the lane plates.',
        ],
        look: 'The remainder joins the bar&rsquo;s leading edge without a seam and is never mistaken for a planned step of its own: it has no label and is not a stop of the keyboard.',
        controls:
            group('Remainder', 'gr-rest', [['on', 'Remainder on (new)', true], ['off', 'Off']]) +
            group('Planned end', 'gr-plan', [['soon', 'In 25 min', true], ['later', 'In 40 min'], ['over', 'Plan overrun']]) +
            group('State', 'gr-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card"><section class="kp-gantt" id="pg-gr" data-kp-gantt data-kp-gantt-ranges="1h 6h" data-kp-gantt-range="1h" data-kp-gantt-hint="off" aria-label="Ragù, cooking plan"></section></div>`,
    },
    {
        id: 'gantt-phone',
        title: 'At phone width the gantt scrolls inside its own frame',
        topic: 'gantt',
        wish: 'Kitchen 3',
        asked:
            'At 390 px the lanes of the run timeline squeezed together. A timeline under 32rem now keeps a plot of <code>--kp-gantt-min-width</code> (30rem) and scrolls sideways in its own frame, the lane names held at the start. <code>data-kp-gantt-scroll="off"</code> keeps the old squeeze. Is 30rem the right minimum, and should the frame open at the live end?',
        h2: 'The cook plan on a phone',
        intro: 'The same plan in a box you can narrow. At this page&rsquo;s own phone width it behaves the same; the width control narrows the box so you can judge it on a desktop.',
        expected: [
            '<b>Column</b> (the full width) shows the plan as before. <b>Tablet</b> and <b>Phone</b> narrow the box: the plot stays 30rem wide, the frame scrolls sideways, the lane names stay in view, the window opens at its right end where now is.',
            '<b>Squeezed (old)</b> turns the scrolling off: the lanes squeeze and the bars crowd. <b>Wider minimum</b> and <b>No minimum</b> set the knob. The toolbar, the legend and the foot stay in the box&rsquo;s width.',
        ],
        look: 'The names column does not scroll away; the axis stays on top; a bar is never narrower than its minimum; no page-level sideways scroll.',
        controls:
            group('Box', 'gp-width', [['column', 'Column', true], ['tablet', 'Tablet (34rem)'], ['phone', 'Phone (22rem)']]) +
            group('Scroll', 'gp-scroll', [['auto', 'Scrolls (new)', true], ['off', 'Squeezed (old)'], ['always', 'Always']]) +
            group('Minimum', 'gp-min', [['30rem', '30rem', true], ['44rem', '44rem'], ['0', 'No minimum']]),
        component: `<div class="kp-card pg-card"><div class="pg-box" id="pg-gp-box"><section class="kp-gantt" id="pg-gp" data-kp-gantt data-kp-gantt-ranges="1h 6h" data-kp-gantt-range="6h" aria-label="Spaghetti bolognese, cooking plan on a phone"></section></div></div>`,
    },
    // ---------------------------------------------------------------- focus steps
    {
        id: 'steps-getter',
        title: 'Read the steps a person has passed',
        topic: 'steps',
        topicTitle: 'Cook mode',
        wish: 'Kitchen 4',
        asked:
            'A page that mirrors the progress of cook mode (a checklist beside it, "3 of 8 done") had to read the remembered progress. <code>getStepsPassed(root)</code> returns the passed steps (<code>count</code>, <code>indexes</code>, <code>ids</code>, <code>steps</code>) and <code>getSteps(root)</code> the steps the flow was given. Is that the getter Kitchen meant by "the steps passed"?',
        h2: 'Stoofvlees, step by step',
        intro: 'Flemish beef stew in cook mode. The list beside it is drawn from <code>getStepsPassed()</code> after every move; nothing in it is remembered by the page.',
        expected: [
            '<b>Next</b> and <b>Back</b> in the component (or Jump) change the list: passed steps are ticked with their time, the step in hand is marked, the rest wait. The count reads <b>3 of 7 done</b> from the same call.',
            '<b>Loading</b> lays the busy card over the step and <b>Failed</b> says why with Try again; the list keeps the last answer and does not jump.',
        ],
        look: 'The list lines up with the step&rsquo;s own count; tick, name and time sit in three tracks that run through every row.',
        controls:
            group('Jump to', 'ss-jump', [['start', 'The first step', true], ['middle', 'Step 4'], ['end', 'The last step']]) +
            group('State', 'ss-state', [['ready', 'Ready', true], ['loading', 'Loading'], ['error', 'Failed']]),
        component: `<div class="kp-card pg-card"><div class="pg-steps">
            <div class="kp-focus-steps" id="pg-fs" data-kp-focus-steps data-kp-focus-steps-wake="false" aria-label="Flemish beef stew"></div>
            <div class="pg-passed"><h3 class="pg-passed__title" id="pg-ss-count">0 of 7 done</h3><ol class="pg-passed__list" id="pg-ss-list" aria-label="Steps passed"></ol></div>
            </div></div>`,
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

// The two texts the code section shows are read by demo.js from the page, so the sample lives in one place.
const samples = `<script type="application/json" id="pg-samples">${JSON.stringify({ toml: TOML, bash: BASH }).replace(/</g, '\\u003c')}</script>`;

const title = 'Eleven wishes built in the package';
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
                    Almanac, homelab, chassis-rs and Kitchen hit the edges of the package in ${SECTIONS.length} places and you chose to build them. Each is now an
                    option or a part of the package; this page shows all of them in formal only, one section per wish, on the apps&rsquo; own data (Kitchen&rsquo;s
                    dishes and steps, Almanac&rsquo;s calendars, homelab&rsquo;s stacks; the times and counts are mock). Everything is opt-in except two, which
                    say so: a valid form is no longer sent by the browser, and a narrow run timeline scrolls inside its frame. ${SECTIONS.length} sections,
                    ${SECTIONS.length} pairs.
                </p>
                <p>Every section says under <b>Expected</b> what you should see and what each control does.</p>
            </header>

${body}
        </main>
        ${samples}
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
