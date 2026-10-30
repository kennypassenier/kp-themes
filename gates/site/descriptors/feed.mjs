// Page descriptor for the "feed" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const feedDescriptor = {
        id: 'feed',
        title: 'Activity feed',
        group: 'Data',
        classes: ['kp-feed'],
        exports: [],
        aliases: ['activity', 'history', 'earlier', 'load-earlier', 'day-heading'],
        intro: 'Who did what, and when, day by day. Each row has its outcome (a mark with a shape and a word), what happened, a muted detail line, the chip of whoever started it and the time, which is a ticking “12 min ago” for the first 24 hours and dd/mm/yyyy HH:mm after that. Rows sit under a heading per day (“Today”, “Yesterday”, then the weekday and the date) with that day’s exact count and “N failed”, and “Load earlier” stands at the foot.',
        whenToUse: 'A history of operations, an audit trail, a stack’s recent runs: anything where the person asks what happened and who did it. For a list of checks that are each ok or failed use status rows; for a fixed set of releases use the timeline; for a conversation use the thread.',
        examples: [
            {
                title: 'A day of activity',
                why: 'The markup is the empty box; the page hands over the rows with `setFeed`. A row is `{ key, title, at }` and, when it has them, a `state` (`ok`, `failed`, `warn`, `running`, `info`), an `actor`, a `detail`, a `href` and `more` (lines that open under the row). The key is the row’s identity: a refresh keeps the rows that are open and the focus by it.',
                markup: `
<div class="kp-feed" id="doc-feed" data-kp-feed data-kp-feed-unit="operation,operations" aria-label="Activity"></div>
`,
                script: `
import { attachFeeds, setFeed } from '@kp-soft/themes/js/feed';

const feed = document.getElementById('doc-feed');
attachFeeds(feed.parentElement);
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const ago = (ms) => Date.now() - ms;
setFeed(feed, {
    state: 'ready',
    updatedAt: ago(8 * 1000),
    rows: [
        { key: 'op-3', state: 'running', title: 'Update sonarr', actor: { name: 'Claude', kind: 'agent' }, detail: 'Pulling lscr.io/linuxserver/sonarr:4.0.15', at: ago(40 * 1000) },
        { key: 'op-2', state: 'failed', title: 'Update jellyfin', actor: { name: 'Claude', kind: 'agent' }, detail: 'Pull failed: registry timeout after 30 s', at: ago(38 * MIN),
          more: ['$ docker compose pull', 'Error response from daemon: context deadline exceeded'] },
        { key: 'op-1', state: 'ok', title: 'Backup vaultwarden', actor: { name: 'nightly round', kind: 'schedule' }, detail: '412 MB to nas:/backups, 14 s', at: ago(30 * HOUR) },
    ],
});
`,
            },
            {
                title: 'The states, and Load earlier',
                why: 'Loading shows a skeleton of rows under the theme’s busy card, empty and failed fill the same height with the state plate (Failed has Retry, which fires `kp-feed-retry`), and a refresh that failed while the rows are still good is `stale`: the rows stay and the head line says why. `earlier` is the foot: `more`, `loading`, `error` or `end`; press Load earlier and the page answers with the rows. The loaded height is held while a state shows (the cap is 14 rem here to show it).',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-feed-states">
<div class="kp-row kp-gap-sm" role="group" aria-label="State">
<button type="button" class="kp-button kp-button--sm" data-doc-state="ready">Ready</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="loading">Loading</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="empty">Empty</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="error">Failed</button>
<button type="button" class="kp-button kp-button--sm" data-doc-state="stale">Not refreshed</button>
</div>
<div class="kp-feed" data-kp-feed data-kp-feed-time="clock" data-kp-feed-actor="mark" id="doc-feed-states-host" style="--kp-footprint-max: 14rem"></div>
</div>
`,
                script: `
import { attachFeeds, setFeed } from '@kp-soft/themes/js/feed';

const root = document.getElementById('doc-feed-states');
const host = document.getElementById('doc-feed-states-host');
attachFeeds(root);
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const ago = (ms) => Date.now() - ms;
const rows = [
    { key: 'a', state: 'ok', title: 'Restart traefik', actor: { name: 'Kenny', kind: 'person' }, detail: 'Back up in 4 s', at: ago(6 * MIN) },
    { key: 'b', state: 'warn', title: 'Renew certificate', actor: { name: 'auto-heal', kind: 'system' }, detail: 'Renewed, OCSP staple missing', at: ago(3 * HOUR) },
    { key: 'c', state: 'ok', title: 'Backup immich', actor: { name: 'nightly round', kind: 'schedule' }, detail: '3.2 GB, 2 min 41 s', at: ago(26 * HOUR) },
];
const draw = (state) => {
    if (state === 'ready') setFeed(host, { state: 'ready', rows, total: 30, earlier: 'more', stale: null });
    else if (state === 'stale') setFeed(host, { state: 'ready', rows, total: 30, stale: { reason: 'the host did not answer within 20 s', since: ago(14 * MIN) } });
    else setFeed(host, { state, rows: state === 'empty' ? [] : rows, error: 'The activity could not be read.', stale: null });
};
for (const button of root.querySelectorAll('[data-doc-state]')) button.addEventListener('click', () => draw(button.dataset.docState));
host.addEventListener('kp-feed-retry', () => draw('ready'));
host.addEventListener('kp-feed-earlier', () => setFeed(host, { earlier: 'end' }));
draw('ready');
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachFeeds(root, { now, timeZone })` wires every `[data-kp-feed]` and returns a detach; `feedOf(el)` answers the handle (`set`, `setOpen`, `openKeys`, `render`); `setFeed(el, { state, rows, total, earlier, updatedAt, stale, error, emptyText })` hands over the data. `FEED` is the selector.' },
            { name: 'events', what: '`kp-feed-retry` (Retry on the failed plate and Read it again on a stale feed), `kp-feed-earlier` (Load earlier and its Try again) and `kp-feed-open` `{ key, open }`, bubbling from the host. The page decides what a retry or an earlier page is and answers with `setFeed`.' },
            { name: 'data-kp-feed', what: 'Marks the host. The script draws the head (the exact count and the freshness line), the list, the state plate and the foot inside it.' },
            { name: 'data-kp-feed-group', what: '`day` (default): a heading per day with that day’s count; `none`: one list.' },
            { name: 'data-kp-feed-summary', what: '`on` (default) or `off`: the count and “N failed” (or “all ok”) on each day heading.' },
            { name: 'data-kp-feed-unit', what: '`operation,operations`: the app’s word for a row, singular and plural; “event,events” by default.' },
            { name: 'data-kp-feed-time', what: '`auto` (default: “12 min ago” for 24 hours, then dd/mm/yyyy HH:mm), `relative` (always the ago line), `clock` (the ago line, then HH:mm under its day heading) or `moment` (always dd/mm/yyyy HH:mm). Pointing at a time gives the full moment.' },
            { name: 'data-kp-feed-actor', what: '`chip` (default: the mark and the name), `mark` (the mark alone; the name is its title and its screen-reader text) or `off`.' },
            { name: 'data-kp-feed-expand', what: '`many` (default), `one` (opening a row closes the others) or `off` (rows with lines are not openable).' },
            { name: 'data-kp-feed-rail', what: '`on` (default): the timeline’s rule joins the marks of a day; `off`.' },
            { name: 'data-kp-feed-head', what: '`on` (default) or `off`: the count and the freshness line above the list.' },
            { name: 'data-kp-feed-max', what: 'A CSS length, `26rem`: the list scrolls inside that height and the day headings stay at its top.' },
            { name: 'data-kp-feed-level', what: 'The heading level of a day heading; 3.' },
            { name: 'states', what: '`ready`, `loading` (rows in skeletons under the busy card), `empty` (“Nothing happened yet” and `emptyText`), `error` (the failed plate with Retry) and, on a ready feed, `stale` (the rows kept, “Not refreshed: …. Rows from 14:02.” and Read it again). The foot is `earlier`: `more`, `loading`, `error` or `end`.' },
            { name: 'written by the script', what: '`data-kp-state` on the host (read by js/footprint.js, which holds the loaded height), `data-kp-feed-actor-mode`, `data-kp-feed-scroll` and `data-kp-feed-no-rail` (what the stylesheet reads) and the buttons’ markers `data-kp-feed-retry` and `data-kp-feed-earlier`.' },
            { name: 'data-kp-earlier', what: 'Written on the foot: `more`, `loading`, `error`, `end` or `none`. The foot keeps its room in the first four, so nothing moves when it changes.' },
            { name: '.kp-feed__head / __count / __fresh / __stale', what: 'The head: the exact count (“18 of 30 operations”), the ticking freshness line, and the stale notice with its button.' },
            { name: '.kp-feed__list / __group / __day / __rows / __row', what: 'The one grid of every day; a group holds its heading (`__day`, with `__day-word`, `__day-date`, `__day-rule` and `__day-summary`) and its rows. A row has `data-state` and `data-kp-key`.' },
            { name: '.kp-feed__mark / __title / __detail / __toggle / __link / __more', what: 'A row’s parts: the state mark, the title (a button that opens its lines, or a link), the muted detail and the lines that open.' },
            { name: '.kp-feed__actor / __when / __foot / __earlier', what: 'The chip column, the time column and the foot with Load earlier.' },
        ],
        accessibility: [
            'Built in — a row’s state is a shape and a word as well as a colour (the word is read after the title), the actor is read as “by Claude”, the time keeps its full moment in `title` and `aria-description`, the day headings are headings, and new rows are announced politely at most every ten seconds.',
            'Yours — write the title in the user’s words and give the feed a name (`aria-label`); give every row a stable `key` so a refresh keeps the focus and the rows that are open.',
        ],
    };
