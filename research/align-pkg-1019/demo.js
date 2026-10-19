// research/align-pkg-1019: the page's own wiring. The components are the package's (js/auto.js attaches the feed and the week);
// this file gives the feed, the lists, the problems, the share bars and the week their mock data. Times are relative to the moment
// the page opens, so "Today" and "Yesterday" are true.
import { feedOf } from '../../js/feed.js';
import { attachHoverCards } from '../../js/hovercard.js';
import { setProblems } from '../../js/problems.js';
import { setStackbar } from '../../js/stackbar.js';
import { setWeekEvents, setWeekState } from '../../js/week.js';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const opened = Date.now();

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

/** @param {string} tag @param {Record<string, string> | null} attrs @param {...(Node | string)} kids */
const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs ?? {})) el.setAttribute(k, v);
    el.append(...kids);
    return el;
};
const $ = (/** @type {string} */ sel) => document.querySelector(sel);

// ---- 1 · the feed --------------------------------------------------------------------------------------
/** @type {import('../../js/feed.js').FeedRow[]} */
const ROWS = [
    {
        key: 'op-1',
        state: 'running',
        title: 'Update sonarr',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pulling lscr.io/linuxserver/sonarr:4.0.15',
        at: opened - 40 * 1000,
    },
    {
        key: 'op-2',
        state: 'ok',
        title: 'Restart traefik',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Back up in 4 s, 12 routers loaded',
        at: opened - 6 * MIN,
    },
    {
        key: 'op-3',
        state: 'failed',
        title: 'Update jellyfin',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pull failed: registry timeout after 30 s (ghcr.io)',
        at: opened - 38 * MIN,
    },
    {
        key: 'op-4',
        state: 'ok',
        title: 'Backup vaultwarden',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '212 MB in 14 s',
        at: opened - 2 * HOUR,
    },
    {
        key: 'op-5',
        state: 'warn',
        title: 'Renew certificate *.kp-soft.dev',
        actor: { name: 'auto-heal', kind: 'system' },
        detail: 'Renewed; the OCSP staple is missing',
        at: opened - 3 * HOUR,
    },
    {
        key: 'op-6',
        state: 'info',
        title: 'Config changed: media/radarr',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'RADARR__LOG__LEVEL set to info',
        at: opened - 5 * HOUR,
    },
    {
        key: 'op-7',
        state: 'ok',
        title: 'Backup immich',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '38.2 GB in 6 min',
        at: opened - 30 * HOUR,
    },
];
for (const el of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-af-feed]')])) {
    const handle = feedOf(el);
    handle?.set({ state: 'ready', rows: ROWS, updatedAt: opened });
}

// ---- 2 · the lists with a lead -----------------------------------------------------------------------------
const meta = (/** @type {string[]} */ ...parts) => h('span', { class: 'kp-action-list__meta' }, ...parts.map((p) => h('span', null, p)));
const button = (/** @type {string} */ label, primary = false) =>
    h('button', { type: 'button', class: `kp-button kp-button--sm${primary ? ' kp-button--primary' : ''}` }, label);
const item = (
    /** @type {string} */ lead,
    /** @type {string} */ title,
    /** @type {string} */ text,
    /** @type {string[]} */ needs,
    /** @type {HTMLElement[]} */ actions,
) =>
    h(
        'li',
        null,
        h('span', { class: 'kp-action-list__lead' }, h('span', { class: 'kp-badge' }, lead)),
        h(
            'div',
            { class: 'kp-action-list__main' },
            h('strong', { class: 'kp-action-list__title' }, title),
            h('span', { class: 'kp-action-list__text' }, text),
            meta(...needs),
        ),
        h('div', { class: 'kp-row-actions' }, ...actions),
    );
$('[data-af-lead="one"]')?.replaceChildren(
    item(
        '0 min',
        'Crackers with cheese',
        'A sleeve of crackers and a block of cheese, cut in slices.',
        ['No knife needed', 'Cupboard'],
        [button('This one')],
    ),
    item(
        '2 min',
        'Salad from the bag with an egg',
        'Tip the bag in a bowl, add a boiled egg from the pack.',
        ['Fork', 'Fridge'],
        [button('This one')],
    ),
    item('5 min', 'Tuna on toast', 'Toast the bread, spoon a small tin of tuna over it.', ['Toaster', 'Cupboard'], [button('This one')]),
);
$('[data-af-lead="two"]')?.replaceChildren(
    item(
        'Failure',
        'Backup of immich failed',
        'The repository is locked by another process. Nothing was changed.',
        ['pve', '18/10/2026 02:07'],
        [button('Remind me later'), button('Open', true)],
    ),
    item(
        'Info',
        'Update available for jellyfin',
        'Version 10.11.12 fixes a playback fault.',
        ['CT 106'],
        [button('Remind me later'), button('Update', true)],
    ),
);

// ---- 3 · the problems ---------------------------------------------------------------------------------------
const fix = (/** @type {string} */ label) => h('button', { type: 'button', class: 'kp-button' }, label);
const band = $('[data-af-problems]');
if (band instanceof HTMLElement)
    setProblems(
        band,
        [
            {
                key: 'backup',
                severity: 'critical',
                what: 'The backups of immich failed two nights in a row',
                why: 'restic says the repository is locked by another process.',
                remedy: 'Unlock the repository on pve, then run the backup again.',
                action: fix('Run the backup now'),
            },
            {
                key: 'cert',
                severity: 'warning',
                what: 'The certificate of kp-soft.dev expires in 9 days',
                why: 'Traefik could not renew it: the Cloudflare token is read-only.',
                action: fix('Open Secrets'),
            },
            {
                key: 'loki',
                severity: 'warning',
                what: 'Loki has not received logs from kyu for 3 h',
                remedy: 'Restart Alloy on CT 109.',
                action: fix('Restart Alloy'),
                dismissible: true,
            },
            { key: 'cal', severity: 'info', what: 'The almanac calendar is not shared', why: 'Almanac cannot read it.', action: fix('Share') },
        ],
        { mode: 'each' },
    );

// ---- 4 · the share bars -------------------------------------------------------------------------------------
const gb = (/** @type {number} */ v) => `${(Math.round(v * 10) / 10).toFixed(1)} GB`;
const wide = $('[data-af-stack="wide"]');
if (wide instanceof HTMLElement)
    setStackbar(wide, {
        title: 'Root volume',
        total: 100,
        format: gb,
        restLabel: 'Free',
        parts: [
            { label: 'Docker images', value: 31.4 },
            { label: 'Container data', value: 22.8 },
            { label: 'Logs', value: 4.1 },
            { label: 'Everything else', value: 9.6 },
        ],
    });
const narrow = $('[data-af-stack="narrow"]');
if (narrow instanceof HTMLElement)
    setStackbar(narrow, {
        title: 'Thin pool "data"',
        total: 930,
        format: gb,
        restLabel: 'Free in the pool',
        parts: [
            { label: 'Photos and family videos archive, with the originals and every derived copy (CT 110)', value: 312.4 },
            { label: 'jellyfin (CT 106)', value: 164.2 },
            { label: 'immich (CT 110)', value: 118.9 },
            { label: 'Promised, not written yet', value: 80.7, tone: 'warning' },
            { label: 'vaultwarden (CT 104)', value: 0.4 },
        ],
    });

// ---- 6 · the week -------------------------------------------------------------------------------------------
const week = $('[data-af-week]');
if (week instanceof HTMLElement) {
    const midnight = new Date(opened);
    midnight.setHours(0, 0, 0, 0);
    const day = (/** @type {number} */ n, /** @type {number} */ hr, /** @type {number} */ m = 0) =>
        midnight.getTime() + n * DAY + hr * HOUR + m * MIN;
    setWeekEvents(week, [
        { id: 'e1', start: day(0, 22), label: 'Backup · media', series: 1 },
        { id: 'e2', start: day(1, 3), label: 'Backup · media', series: 1 },
        { id: 'e3', start: day(1, 22, 30), label: 'Restore test', series: 3 },
        { id: 'e4', start: day(2, 3), label: 'Backup · platform', series: 1 },
        { id: 'e5', start: day(3, 4), label: 'Update · media', series: 2 },
        { id: 'e6', start: day(4, 3), label: 'Backup · media', series: 1 },
        { id: 'e7', start: day(5, 5), label: 'Update · platform', series: 2 },
        { id: 'e8', start: day(6, 3), label: 'Backup · media', series: 1 },
    ]);
    setWeekState(week, 'ready');
}

// The bars and the pills carry hover cards the script added after the page was attached.
attachHoverCards(document);
