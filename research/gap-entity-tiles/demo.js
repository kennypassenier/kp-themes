// research/gap-entity-tiles: the page's own wiring. The cards, the trend line, the star and every state are the package
// (js/entity-card.js, attached by js/auto.js); this file feeds them sample data (mock: made-up readings and log lines of a
// home server), presses their states from the buttons at each component, and writes what they fire into a readout.
// Each section wires itself by its own elements and does nothing when its elements are not on the page.

import { setEntityGrid, setEntityGridState } from '../../js/entity-card.js';

/** @param {string} id */
const by = (id) => document.getElementById(id);

/** Press one button of a group: exactly one of the group is pressed. @param {string} attribute @param {(value: string) => void} apply */
function states(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`button[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** @param {HTMLElement | null} log @param {string} text */
const say = (log, text) => {
    if (log) log.textContent = text;
};

/* ------------------------------------------------------------------ 1. the stack card with a trend line */

/** CPU load of the last 24 hours, one reading an hour, in percent (mock). */
const LIVE = {
    jellyfin: [12, 14, 11, 9, 8, 7, 8, 9, 12, 18, 22, 35, 48, 44, 41, 52, 61, 58, 63, 70, 66, 54, 42, 34],
    sonarr: [3, 2, 2, 3, 2, 2, 4, 3, 5, 9, 31, 28, 12, 6, 5, 4, 7, 15, 22, 18, 9, 6, 5, 4],
    traefik: [6, 6, 5, 5, 5, 5, 6, 7, 9, 11, 12, 12, 13, 12, 11, 12, 14, 17, 19, 21, 18, 14, 10, 8],
    paperless: [1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 2, 41, 62, 77, 58, 12, 4, 2, 2, 1, 1],
};

const STACKS = [
    {
        key: 'jellyfin',
        vmid: '106',
        state: { label: 'running', tone: 'success' },
        figures: [
            { value: '5/5', label: 'apps up' },
            { value: '3', label: 'streams' },
        ],
        flags: [{ label: 'update available', tone: 'warning' }],
        ram: [0.71, '5.6 of 8 GB'],
        disk: [0.52, '1.9 of 3.6 TB'],
    },
    {
        key: 'sonarr',
        vmid: '107',
        state: { label: 'running', tone: 'success' },
        figures: [
            { value: '3/4', label: 'apps up' },
            { value: '12', label: 'restarts' },
        ],
        flags: [{ label: 'qbittorrent unreachable', tone: 'destructive' }],
        ram: [0.38, '1.5 of 4 GB'],
        disk: [0.81, '652 of 800 GB'],
    },
    {
        key: 'traefik',
        vmid: '101',
        state: { label: 'running', tone: 'success' },
        figures: [
            { value: '14', label: 'routers' },
            { value: '0', label: 'errors' },
        ],
        flags: [],
        ram: [0.12, '0.2 of 2 GB'],
        disk: [0.07, '4 of 60 GB'],
    },
    {
        key: 'paperless',
        vmid: '120',
        state: { label: 'running', tone: 'success' },
        figures: [
            { value: '2/2', label: 'apps up' },
            { value: '1', label: 'restart' },
        ],
        flags: [{ label: 'index rebuilding', tone: 'info' }],
        ram: [0.64, '2.6 of 4 GB'],
        disk: [0.33, '66 of 200 GB'],
    },
];

const trendGrid = by('gt-trend-grid');
const trendLog = by('gt-trend-log');
const trend = { mode: 'auto', readings: 'day', status: 'ready' };
/** The three trend-line buttons: a full day, one reading for sonarr, or no row at all. */
const TREND = { day: { mode: 'auto', readings: 'day' }, one: { mode: 'auto', readings: 'one' }, off: { mode: 'off', readings: 'day' } };
let seed = 7;

/** The next reading of a series: the last one, moved a little (mock). @param {number[]} series */
function nextReading(series) {
    seed = (seed * 9301 + 49297) % 233280;
    const step = Math.round((seed / 233280 - 0.45) * 24);
    return Math.max(1, Math.min(99, (series.at(-1) ?? 10) + step));
}

function drawTrend() {
    if (!trendGrid) return;
    trendGrid.setAttribute('data-kp-entity-trend', trend.mode);
    if (trend.status === 'loading') {
        setEntityGridState(trendGrid, 'loading', { count: STACKS.length });
        return;
    }
    setEntityGrid(
        trendGrid,
        STACKS.map((stack) => {
            const series = /** @type {number[]} */ (LIVE[/** @type {keyof typeof LIVE} */ (stack.key)]);
            const shown = trend.readings === 'one' && stack.key === 'sonarr' ? series.slice(-1) : series;
            return {
                key: stack.key,
                name: stack.key,
                vmid: stack.vmid,
                state: stack.state,
                figures: stack.figures,
                flags: stack.flags,
                meters: [
                    { label: 'RAM', value: stack.ram[0], text: String(stack.ram[1]) },
                    { label: 'Disk', value: stack.disk[0], text: String(stack.disk[1]) },
                ],
                trend: shown,
                trendLabel: 'CPU 24 h',
                trendText: `${series.at(-1)}%`,
                actions: [
                    { id: 'restart', label: 'Restart' },
                    { id: 'logs', label: 'Logs' },
                ],
                status: /** @type {'ready' | 'empty' | 'error'} */ (trend.status),
                error: 'Get "http://10.0.20.14:2375/containers/json": context deadline exceeded',
            };
        }),
    );
}

if (trendGrid) {
    states('data-gt-trend', (value) => {
        Object.assign(trend, TREND[/** @type {keyof typeof TREND} */ (value)]);
        drawTrend();
    });
    states('data-gt-state', (value) => {
        trend.status = value;
        drawTrend();
    });
    document.querySelector('button[data-gt-add-reading]')?.addEventListener('click', () => {
        for (const series of Object.values(LIVE)) {
            series.push(nextReading(series));
            series.shift();
        }
        drawTrend();
        say(
            trendLog,
            `A reading was added: jellyfin now ${LIVE.jellyfin.at(-1)}%, sonarr ${LIVE.sonarr.at(-1)}%, traefik ${LIVE.traefik.at(-1)}%, paperless ${LIVE.paperless.at(-1)}%.`,
        );
    });
    for (const type of ['kp-entity-action', 'kp-entity-retry']) {
        trendGrid.addEventListener(type, (event) => say(trendLog, `${type}\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail)}`));
    }
    drawTrend();
}

/* ------------------------------------------------------------------ 2 and 3. the app tile */

/** The apps of the home server, as the Apps page reads them (mock). */
const APPS = [
    {
        key: 'jellyfin',
        name: 'Jellyfin',
        href: 'https://jellyfin.home.arpa/web/',
        description: 'Movies, series and music for the house',
        state: { label: 'up', tone: 'success' },
        lines: ['5 items, 3 playing', '03:12:44 Info Playback: Kenny started "Dune: Part Two"'],
    },
    {
        key: 'sonarr',
        name: 'Sonarr',
        href: 'https://sonarr.home.arpa/',
        description: 'Finds, grabs and renames new episodes of every series',
        state: { label: 'degraded', tone: 'warning' },
        lines: ['2 downloads queued, 1 failed', '03:12:44 Warn DownloadClient: qBittorrent returned 503'],
    },
    {
        key: 'radarr',
        name: 'Radarr',
        href: 'https://radarr.home.arpa/',
        description: 'Finds, grabs and renames new films',
        state: { label: 'up', tone: 'success' },
        lines: ['0 queued, 142 missing', '02:58:10 Info RssSync: 31 releases found, 0 grabbed'],
    },
    {
        key: 'traefik',
        name: 'Traefik',
        href: 'https://traefik.home.arpa/dashboard/',
        description: 'The reverse proxy and the certificates for every app',
        state: { label: 'up', tone: 'success' },
        lines: ['14 routers, 0 errors', '03:14:02 Info acme: certificate renewed for *.home.arpa'],
    },
    {
        key: 'grafana',
        name: 'Grafana',
        href: 'https://grafana.home.arpa/',
        description: 'Dashboards for the host and every stack',
        state: { label: 'up', tone: 'success' },
        lines: ['6 dashboards', '03:10:55 Info provisioning: dashboards reloaded'],
    },
    {
        key: 'uptime-kuma',
        name: 'Uptime Kuma',
        href: 'https://kuma.home.arpa/',
        description: 'Is every service answering?',
        state: { label: 'up', tone: 'success' },
        lines: ['23 monitors, 23 up', 'Checked at 03:14'],
    },
    {
        key: 'home-assistant',
        name: 'Home Assistant',
        href: 'https://ha.home.arpa/',
        description: 'Lights, heating and the notification bus',
        state: { label: 'starting', tone: 'info' },
        lines: ['1 integration failed to load', '03:09:12 Warn zha: radio not ready, retrying in 10 s'],
    },
    {
        key: 'paperless',
        name: 'Paperless',
        href: 'https://paperless.home.arpa/',
        description: 'Scanned post, searchable and filed',
        state: { label: 'down', tone: 'destructive' },
        lines: ['Last scan 18/10/2026 22:41', '03:01:07 Error celery: broker connection refused'],
    },
];

const FAILURE = 'Get "http://10.0.20.14:8989/api/v3/system/status": dial tcp 10.0.20.14:8989: connect: connection refused';

/* 2. the tile board */
const tileGrid = by('gt-tile-grid');
const tileLog = by('gt-tile-log');
const tiles = { ext: 'same', fav: new Set(['jellyfin', 'traefik']), star: 'on' };

function drawTiles() {
    if (!tileGrid) return;
    tileGrid.setAttribute('data-kp-entity-star', tiles.star);
    const list = APPS.map((app) => ({ ...app, external: tiles.ext === 'new', starred: tiles.fav.has(app.key) }));
    // The page keeps the favourites and puts them first, as the Apps page does.
    list.sort((a, b) => Number(b.starred) - Number(a.starred));
    setEntityGrid(tileGrid, list);
}

if (tileGrid) {
    states('data-gt-ext', (value) => {
        tiles.ext = value;
        drawTiles();
    });
    states('data-gt-fav', (value) => {
        tiles.fav = new Set(value === 'all' ? APPS.map((a) => a.key) : value === 'none' ? [] : ['jellyfin', 'traefik']);
        drawTiles();
    });
    states('data-gt-star', (value) => {
        tiles.star = value;
        drawTiles();
    });
    tileGrid.addEventListener('click', (event) => {
        const link = /** @type {Element} */ (event.target).closest('a.kp-entity__name');
        if (!(link instanceof HTMLAnchorElement)) return;
        // This page is a mock: it says where the tile would go and stays.
        event.preventDefault();
        say(tileLog, `Opened ${link.firstChild?.textContent}: ${link.href}\n(mock: this page stays where it is)`);
    });
    tileGrid.addEventListener('kp-entity-star', (event) => {
        const { key, starred } = /** @type {CustomEvent} */ (event).detail;
        if (starred) tiles.fav.add(key);
        else tiles.fav.delete(key);
        say(tileLog, `kp-entity-star ${JSON.stringify({ key, starred })}\nThe link did not open.`);
    });
    drawTiles();
}

/* 3. the states of the board */
const board = by('gt-states-grid');
const boardFrame = by('gt-states-frame');
const boardLog = by('gt-states-log');
let boardState = 'ready';

function drawBoard() {
    if (!board) return;
    const six = APPS.slice(0, 6);
    if (boardState === 'loading') return setEntityGridState(board, 'loading', { count: 6 });
    if (boardState === 'error') {
        return setEntityGridState(board, 'error', {
            title: 'The apps could not be read',
            message: 'The status service did not answer. Nothing was changed.',
        });
    }
    if (boardState === 'none') {
        return setEntityGridState(board, 'empty', {
            title: 'No apps in this stack yet',
            message: 'Add an app and its tile appears here.',
            actionLabel: 'Add an app',
        });
    }
    setEntityGrid(
        board,
        six.map((app, i) => ({
            ...app,
            starred: i === 0,
            status: boardState === 'empty' ? 'empty' : boardState === 'one' && app.key === 'sonarr' ? 'error' : 'ready',
            error: FAILURE,
        })),
    );
}

if (board) {
    states('data-gt-board', (value) => {
        boardState = value;
        drawBoard();
    });
    states('data-gt-width', (value) => {
        boardFrame?.setAttribute('data-gt-width', value);
    });
    for (const type of ['kp-entity-retry', 'kp-entity-grid-retry', 'kp-entity-new']) {
        board.addEventListener(type, (event) => say(boardLog, `${type}\n${JSON.stringify(/** @type {CustomEvent} */ (event).detail ?? {})}`));
    }
    drawBoard();
}
