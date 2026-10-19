// research/gap-log-viewer: the page's own wiring. The viewers are the package's (js/auto.js attaches them); this file only hands them
// the lines of a homelab (mock, seeded, nothing is read from a host) and wires each section's controls by its own elements.

import { appendLogLines, clearLogViewer, setLogViewer, logViewerLines, stepLogMatch } from '../../js/logviewer.js';

/** A small seeded generator, so every visit shows the same lines. @param {number} seed */
function seeded(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const random = seeded(1019);
/** @template T @param {T[]} list @returns {T} */
const pick = (list) => list[Math.floor(random() * list.length)];
const number = (/** @type {number} */ low, /** @type {number} */ high) => low + Math.floor(random() * (high - low + 1));

const CLIENTS = ['192.168.1.24', '192.168.1.31', '192.168.1.52', '10.0.0.7'];
const SHOWS = ['Severance S02E04', 'Slow Horses S04E02', 'Andor S02E09', 'The Bear S03E05'];

/** The kinds of line a homelab writes, with the weight each is drawn with. @type {[number, () => import('../../js/logviewer.js').LogLine]} */
const KINDS = /** @type {any} */ ([
    [
        8,
        () => ({
            source: 'traefik',
            level: 'info',
            message: `GET /api/v2/${pick(['sync/maindata', 'torrents/info', 'auth/login'])} 200 ${number(2, 48)}ms client=${pick(CLIENTS)}`,
        }),
    ],
    [
        4,
        () => ({
            source: 'traefik',
            level: 'info',
            message: `${pick(['GET', 'POST'])} /Sessions/Playing/Progress 204 ${number(3, 30)}ms client=${pick(CLIENTS)}`,
        }),
    ],
    [
        3,
        () => ({
            source: 'sonarr',
            level: 'info',
            message: `RSS Sync Completed. Reports found: ${number(120, 260)}, Reports grabbed: ${number(0, 3)}`,
        }),
    ],
    [2, () => ({ source: 'sonarr', level: 'info', message: `Imported ${pick(SHOWS)} to /media/tv, 1 file, 2.${number(1, 9)} GB` })],
    [
        3,
        () => ({
            source: 'jellyfin',
            level: 'info',
            message: `Playback started: ${pick(SHOWS)} on ${pick(['Living room TV', 'Kenny iPad', 'Bedroom Shield'])}`,
        }),
    ],
    [
        2,
        () => ({
            source: 'jellyfin',
            level: 'info',
            message: `Transcoding session ended after 00:${number(10, 59)}:${number(10, 59)}, hardware (vaapi)`,
        }),
    ],
    [2, () => ({ source: 'prometheus', level: 'debug', message: `Scrape of 14 targets finished in ${number(80, 340)}ms, 0 failed` })],
    [2, () => ({ source: 'sonarr', level: 'notice', message: `Disk space on /media is 78% used (${number(1700, 1900)} GB of 2400 GB)` })],
    [1, () => ({ source: 'jellyfin', level: 'warn', message: `Slow HTTP response from /Items/Latest to ${pick(CLIENTS)}: ${number(1100, 2600)}ms` })],
    [
        1,
        () => ({
            source: 'traefik',
            level: 'warn',
            message: `Certificate for jellyfin.home.example renews in ${number(4, 12)} days, ACME account is rate limited until 03:00`,
        }),
    ],
    [
        1,
        () => ({
            source: 'sonarr',
            level: 'error',
            message: 'Indexer NZBgeek failed: connect ETIMEDOUT 104.21.5.18:443 (timeout after 30 s), retrying in 5 min',
        }),
    ],
    [
        1,
        () => ({
            source: 'jellyfin',
            level: 'error',
            message: `Error: ffmpeg exited with code 187 while transcoding ${pick(SHOWS)}: Impossible to convert between the formats supported by the filter`,
        }),
    ],
]);
const WEIGHTS = KINDS.flatMap((/** @type {any} */ k, /** @type {number} */ i) => Array(k[0]).fill(i));

let serial = 0;
let clock = new Date(2026, 9, 19, 14, 0, 0).getTime();

/** @param {number} count @returns {import('../../js/logviewer.js').LogLine[]} */
function lines(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
        clock += number(300, 3200);
        serial += 1;
        out.push({ id: `l${serial}`, ts: clock, ...KINDS[pick(WEIGHTS)][1]() });
    }
    return out;
}

/** The section's component, by its own element. @param {string} id */
const viewerOf = (id) => /** @type {HTMLElement | null} */ (document.querySelector(`#${id} [data-kp-logviewer]`));

/** One group of state buttons: pressing one presses it alone and runs its handler. @param {string} componentId @param {string} group @param {(value: string) => void} run */
function group(componentId, group, run) {
    const controls = document.querySelector(`[data-review-controls-for="${componentId}"]`);
    const buttons = [...(controls?.querySelectorAll(`[data-glv-group="${group}"] [data-glv-value]`) ?? [])];
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const b of buttons) b.setAttribute('aria-pressed', String(b === button));
            run(/** @type {string} */ (button.getAttribute('data-glv-value')));
        });
    }
}

/** An action button: not a state, so it is not pressed. @param {string} componentId @param {string} action @param {() => void} run */
function action(componentId, action, run) {
    const button = document.querySelector(`[data-review-controls-for="${componentId}"] [data-glv-action="${action}"]`);
    button?.addEventListener('click', run);
}

// 1. The ring buffer: a cap small enough to see, lines added by hand or played once.
const ring = viewerOf('glv-ring');
if (ring) {
    appendLogLines(ring, lines(46));
    action('glv-ring', 'add', () => appendLogLines(ring, lines(10)));
    /** @type {number | undefined} */
    let timer;
    action('glv-ring', 'play', () => {
        window.clearInterval(timer);
        let rounds = 0;
        timer = window.setInterval(() => {
            appendLogLines(ring, lines(number(1, 3)));
            if (++rounds >= 24) window.clearInterval(timer);
        }, 420);
    });
    group('glv-ring', 'cap', (value) => setLogViewer(ring, { max: Number(value) }));
}

// 2. Find: the box is the component's own; the buttons put a text in it.
const find = viewerOf('glv-find');
if (find) {
    appendLogLines(find, lines(170));
    setLogViewer(find, { search: 'timeout' });
    // Open on the first match, so the marks are in view and not at the foot of the log.
    window.setTimeout(() => stepLogMatch(find, 1), 400);
    group('glv-find', 'text', (value) => setLogViewer(find, { search: value }));
    group('glv-find', 'only', (value) => setLogViewer(find, { searchOnly: value === 'on' }));
}

// 3. The look of the lines: wrap, the time column, the level.
const look = viewerOf('glv-look');
if (look) {
    const long = lines(26);
    long.push(
        {
            id: 'long1',
            ts: clock + 2000,
            source: 'sonarr',
            level: 'error',
            message:
                'System.Net.Http.HttpRequestException: Connection refused (indexer.nzbgeek.example:443) at NzbDrone.Common.Http.Dispatchers.ManagedHttpDispatcher.GetResponseAsync(HttpRequest request, CookieContainer cookies) in ./Sonarr.Common/Http/Dispatchers/ManagedHttpDispatcher.cs:line 142 at NzbDrone.Common.Http.HttpClient.ExecuteAsync(HttpRequest request) in ./Sonarr.Common/Http/HttpClient.cs:line 98',
        },
        {
            id: 'long2',
            ts: clock + 4000,
            source: 'jellyfin',
            level: 'critical',
            message:
                'Database is locked: /config/data/jellyfin.db, the library scan was stopped after 00:03:12 and will start again at the next interval',
        },
    );
    appendLogLines(look, long);
    group('glv-look', 'wrap', (value) => setLogViewer(look, { wrap: value === 'on' }));
    group('glv-look', 'time', (value) => setLogViewer(look, { time: /** @type {'time' | 'datetime' | 'off'} */ (value) }));
    group('glv-look', 'level', (value) => setLogViewer(look, { level: /** @type {'debug' | 'info' | 'warning' | 'error'} */ (value) }));
}

// 4. The states: each press sets everything it needs, so no press depends on the one before it.
const states = viewerOf('glv-states');
if (states) {
    const kept = lines(40);
    appendLogLines(states, kept);
    /** @type {number | undefined} */
    let reading;
    /** @param {string} mode */
    const apply = (mode) => {
        window.clearTimeout(reading);
        const base = { state: /** @type {'ready' | 'loading' | 'error'} */ ('ready'), search: '', searchOnly: false };
        if (mode === 'lines') setLogViewer(states, { ...base, lines: logViewerLines(states).length ? undefined : kept });
        else if (mode === 'loading') setLogViewer(states, { ...base, state: 'loading', lines: logViewerLines(states).length ? undefined : kept });
        else if (mode === 'error') setLogViewer(states, { ...base, state: 'error', lines: logViewerLines(states).length ? undefined : kept });
        else if (mode === 'empty') {
            setLogViewer(states, base);
            clearLogViewer(states);
        } else if (mode === 'filtered')
            setLogViewer(states, { ...base, lines: logViewerLines(states).length ? undefined : kept, search: 'zzz', searchOnly: true });
    };
    group('glv-states', 'state', apply);
    // Retry reads the log again for a moment, then shows the lines.
    states.addEventListener('kp-logviewer-retry', () => {
        setLogViewer(states, { state: 'loading' });
        reading = window.setTimeout(() => {
            setLogViewer(states, { state: 'ready' });
            const buttons = document.querySelectorAll('[data-review-controls-for="glv-states"] [data-glv-value]');
            for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute('data-glv-value') === 'lines'));
        }, 1400);
    });
}
