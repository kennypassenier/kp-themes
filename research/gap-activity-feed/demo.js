// research/gap-activity-feed: the page's own wiring. The component is the package's (js/feed.js, attached by js/auto.js from
// `data-kp-feed`); this file gives each feed its mock rows (a homelab: stacks such as jellyfin, sonarr and traefik) and wires the
// controls of each section by its own elements. Times are relative to the moment the page opens, so "Today" and "Yesterday" are true.

import { feedOf } from '../../js/feed.js';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const opened = Date.now();
/** A moment this long before the page opened. @param {number} ms */
const ago = (ms) => opened - ms;

/** Resolves once js/auto.js has attached everything the page carries, and the feed `id` has its handle. @param {string} id */
async function feedHandle(id) {
    const ready = document.documentElement.hasAttribute('data-kp-auto-ready')
        ? Promise.resolve()
        : new Promise((resolve) => {
              new MutationObserver((_, watch) => {
                  if (document.documentElement.hasAttribute('data-kp-auto-ready')) {
                      watch.disconnect();
                      resolve(undefined);
                  }
              }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
          });
    await ready;
    const el = document.getElementById(id);
    const handle = el ? feedOf(el) : null;
    if (!el || !handle) throw new Error(`gap-activity-feed: no feed called ${id}`);
    return { el, handle };
}

const JELLYFIN_FAIL = [
    '$ docker compose -f /opt/stacks/jellyfin/compose.yml pull',
    '[+] Pulling 1/1',
    ' ✘ jellyfin Error  Get "https://ghcr.io/v2/jellyfin/jellyfin/manifests/10.11.11": net/http: request canceled (Client.Timeout exceeded while awaiting headers)',
    'Error response from daemon: Get "https://ghcr.io/v2/": context deadline exceeded',
    'exit status 1 after 30.0 s; the running container was left as it was',
];
const SONARR_RUN = ['$ docker compose -f /opt/stacks/sonarr/compose.yml pull', ' ✔ sonarr Pulled  4.0.15.2941  (3 of 5 layers, 61 MB of 118 MB)'];
const TRAEFIK_OK = [
    '$ docker compose -f /opt/stacks/traefik/compose.yml restart traefik',
    ' ✔ Container traefik  Started  4.1 s',
    'time="2026-10-19T09:12:41+02:00" level=info msg="Configuration loaded from file: /etc/traefik/traefik.yml"',
    'time="2026-10-19T09:12:41+02:00" level=info msg="12 routers, 14 services, 3 middlewares"',
];
const CERT_WARN = [
    '$ lego --path /etc/traefik/acme renew --days 30 --domains "*.kp-soft.dev"',
    '[*.kp-soft.dev] The server validated our request',
    '[*.kp-soft.dev] acme: Validations succeeded; requesting certificates',
    'warning: the OCSP staple is missing for the new certificate; clients fall back to asking the CA themselves',
];

/** @typedef {import('../../js/feed.js').FeedRow} FeedRow */

/** The rows of the first feed: a day and a half of a homelab, newest first. @returns {FeedRow[]} */
const dayRows = () => [
    {
        key: 'op-1051',
        state: 'running',
        title: 'Update sonarr',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pulling lscr.io/linuxserver/sonarr:4.0.15',
        at: ago(40 * 1000),
    },
    {
        key: 'op-1050',
        state: 'ok',
        title: 'Restart traefik',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Back up in 4 s, 12 routers loaded',
        at: ago(6 * MIN),
    },
    {
        key: 'op-1049',
        state: 'failed',
        title: 'Update jellyfin',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pull failed: registry timeout after 30 s (ghcr.io)',
        at: ago(38 * MIN),
    },
    {
        key: 'op-1048',
        state: 'ok',
        title: 'Backup vaultwarden',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '412 MB to nas:/backups, 14 s',
        at: ago(2 * HOUR + 5 * MIN),
    },
    {
        key: 'op-1047',
        state: 'warn',
        title: 'Renew certificate *.kp-soft.dev',
        actor: { name: 'auto-heal', kind: 'system' },
        detail: 'Renewed, but the OCSP staple is missing',
        at: ago(3 * HOUR),
    },
    {
        key: 'op-1046',
        state: 'info',
        title: 'Config changed: media/radarr',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Root folder /data/movies added',
        at: ago(5 * HOUR + 12 * MIN),
    },
    {
        key: 'op-1045',
        state: 'ok',
        title: 'Update prowlarr',
        actor: { name: 'Claude', kind: 'agent' },
        detail: '1.31.1 to 1.31.2, healthy after 11 s',
        at: ago(7 * HOUR + 40 * MIN),
    },
    {
        key: 'op-1044',
        state: 'failed',
        title: 'Backup immich',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: 'Disk quota exceeded on nas:/backups (92 percent used)',
        at: ago(21 * HOUR),
    },
    {
        key: 'op-1043',
        state: 'ok',
        title: 'Backup jellyfin',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '3.2 GB to nas:/backups, 2 min 41 s',
        at: ago(21 * HOUR + 14 * MIN),
    },
    {
        key: 'op-1042',
        state: 'ok',
        title: 'Prune images on lxc-media',
        actor: { name: 'auto-heal', kind: 'system' },
        detail: 'Removed 9 images, freed 6.4 GB',
        at: ago(24 * HOUR + 30 * MIN),
    },
    {
        key: 'op-1041',
        state: 'ok',
        title: 'Update qbittorrent',
        actor: { name: 'Claude', kind: 'agent' },
        detail: '5.0.2 to 5.0.3, healthy after 8 s',
        at: ago(27 * HOUR),
    },
    {
        key: 'op-1040',
        state: 'warn',
        title: 'Restart bazarr',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Came back, but the subtitle provider key is expired',
        at: ago(29 * HOUR + 3 * MIN),
    },
    {
        key: 'op-1039',
        state: 'ok',
        title: 'Backup sonarr',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '184 MB to nas:/backups, 6 s',
        at: ago(45 * HOUR),
    },
    {
        key: 'op-1038',
        state: 'ok',
        title: 'Update grafana',
        actor: { name: 'Claude', kind: 'agent' },
        detail: '11.2.2 to 11.3.0, healthy after 19 s',
        at: ago(47 * HOUR + 20 * MIN),
    },
];

/** Older rows for "Load earlier", three days back and more. @param {number} from @param {number} count @returns {FeedRow[]} */
const olderRows = (from, count) => {
    const stacks = ['jellyfin', 'sonarr', 'radarr', 'traefik', 'immich', 'vaultwarden', 'grafana', 'prowlarr', 'bazarr', 'qbittorrent'];
    const actors = [
        { name: 'nightly round', kind: 'schedule' },
        { name: 'Claude', kind: 'agent' },
        { name: 'Kenny', kind: 'person' },
        { name: 'auto-heal', kind: 'system' },
    ];
    const rows = [];
    for (let i = 0; i < count; i += 1) {
        const n = from + i;
        const stack = stacks[n % stacks.length];
        const actor = actors[n % actors.length];
        const bad = n % 7 === 3;
        rows.push({
            key: `op-${1037 - n}`,
            state: /** @type {FeedRow['state']} */ (bad ? 'failed' : n % 5 === 2 ? 'warn' : 'ok'),
            title: actor.kind === 'schedule' ? `Backup ${stack}` : `Update ${stack}`,
            actor,
            detail: bad
                ? 'Health check failed after 60 s, rolled back to the previous image'
                : n % 5 === 2
                  ? 'Done, with one warning in the log'
                  : `Healthy after ${6 + (n % 9)} s`,
            at: ago(3 * 24 * HOUR + n * 5 * HOUR + (n % 4) * 11 * MIN),
        });
    }
    return rows;
};

/** The rows of the feeds with lines under them. @returns {FeedRow[]} */
const logRows = () => [
    {
        key: 'lg-1',
        state: 'running',
        title: 'Update sonarr',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pulling lscr.io/linuxserver/sonarr:4.0.15',
        at: ago(40 * 1000),
        more: SONARR_RUN,
    },
    {
        key: 'lg-2',
        state: 'ok',
        title: 'Restart traefik',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Back up in 4 s, 12 routers loaded',
        at: ago(6 * MIN),
        more: TRAEFIK_OK,
        href: '#traefik',
    },
    {
        key: 'lg-3',
        state: 'failed',
        title: 'Update jellyfin',
        actor: { name: 'Claude', kind: 'agent' },
        detail: 'Pull failed: registry timeout after 30 s (ghcr.io)',
        at: ago(38 * MIN),
        more: JELLYFIN_FAIL,
        href: '#jellyfin',
    },
    {
        key: 'lg-4',
        state: 'warn',
        title: 'Renew certificate *.kp-soft.dev',
        actor: { name: 'auto-heal', kind: 'system' },
        detail: 'Renewed, but the OCSP staple is missing',
        at: ago(3 * HOUR),
        more: CERT_WARN,
    },
    {
        key: 'lg-5',
        state: 'ok',
        title: 'Backup vaultwarden',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '412 MB to nas:/backups, 14 s',
        at: ago(5 * HOUR),
        href: '#vaultwarden',
    },
    {
        key: 'lg-6',
        state: 'info',
        title: 'Config changed: media/radarr',
        actor: { name: 'Kenny', kind: 'person' },
        detail: 'Root folder /data/movies added',
        at: ago(6 * HOUR + 30 * MIN),
    },
];

/** The rows of the third day-spanning feed (three days, so every time option differs). */
const spanRows = () => [
    ...dayRows().slice(0, 4),
    ...dayRows().slice(7, 10),
    {
        key: 'op-1037',
        state: /** @type {const} */ ('ok'),
        title: 'Backup radarr',
        actor: { name: 'nightly round', kind: 'schedule' },
        detail: '233 MB to nas:/backups, 7 s',
        at: ago(52 * HOUR),
    },
];

/** @param {Element} section @param {string} attribute @param {(value: string) => void} apply the value of a pressed toggle, then the group's pressed marks */
function wireToggles(section, attribute, apply) {
    const buttons = /** @type {HTMLElement[]} */ ([...section.querySelectorAll(`[data-${attribute}]`)]);
    for (const button of buttons)
        button.addEventListener('click', () => {
            const value = button.getAttribute(`data-${attribute}`) ?? '';
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(value);
        });
}

/** Mark the one toggle of a group that carries `value`. @param {Element} section @param {string} attribute @param {string} value */
function mark(section, attribute, value) {
    for (const button of section.querySelectorAll(`[data-${attribute}]`))
        button.setAttribute('aria-pressed', String(button.getAttribute(`data-${attribute}`) === value));
}

/** @param {HTMLElement} el @param {string} name @param {string} value */
const option = (el, name, value) => el.setAttribute(`data-kp-feed-${name}`, value);

// --- 1. A day of activity, in every state. ---
{
    const { el, handle } = await feedHandle('gaf-days');
    const section = /** @type {Element} */ (document.getElementById('feed-days'));
    const rows = dayRows();
    const show = () => handle.set({ state: 'ready', rows, total: rows.length, stale: null, updatedAt: ago(8 * 1000), error: undefined });
    /** @param {string} value */
    const apply = (value) => {
        if (value === 'ready') show();
        else if (value === 'loading') handle.set({ state: 'loading', stale: null });
        else if (value === 'empty')
            handle.set({ state: 'empty', rows: [], stale: null, emptyText: 'The host has not run anything since the log was last cleared.' });
        else if (value === 'error')
            handle.set({ state: 'error', error: 'The status service answered 503 after 20 s. Nothing was changed.', stale: null });
        else if (value === 'stale')
            handle.set({ state: 'ready', rows, total: rows.length, stale: { reason: 'the host did not answer within 20 s', since: ago(14 * MIN) } });
    };
    wireToggles(section, 'gaf-state', apply);
    wireToggles(section, 'gaf-group', (value) => option(el, 'group', value));
    // The Retry of the failed plate and "Read it again" of a stale feed read the log once more, after a short wait.
    el.addEventListener('kp-feed-retry', () => {
        mark(section, 'gaf-state', 'loading');
        handle.set({ state: 'loading', stale: null });
        setTimeout(() => {
            handle.set({ rows });
            show();
            mark(section, 'gaf-state', 'ready');
        }, 900);
    });
    show();
}

// --- 2. What a row shows: time, actor, rule. ---
{
    const { el, handle } = await feedHandle('gaf-options');
    const section = /** @type {Element} */ (document.getElementById('feed-row-options'));
    const rows = spanRows();
    handle.set({ state: 'ready', rows, total: rows.length, updatedAt: ago(8 * 1000) });
    wireToggles(section, 'gaf-time', (value) => option(el, 'time', value));
    wireToggles(section, 'gaf-actor', (value) => option(el, 'actor', value));
    wireToggles(section, 'gaf-rail', (value) => option(el, 'rail', value));
}

// --- 3. Lines under a row. ---
{
    const { el, handle } = await feedHandle('gaf-open');
    const section = /** @type {Element} */ (document.getElementById('feed-rows-open'));
    handle.set({ state: 'ready', rows: logRows(), total: 6, updatedAt: ago(8 * 1000) });
    handle.setOpen(['lg-3']);
    wireToggles(section, 'gaf-expand', (value) => option(el, 'expand', value));
    section.querySelector('[data-gaf-open="all"]')?.addEventListener('click', () => handle.setOpen('all'));
    section.querySelector('[data-gaf-open="none"]')?.addEventListener('click', () => handle.setOpen([]));
    // A refresh reads the rows again and moves the freshness line on: the rows that are open stay open, and so does the focus.
    section.querySelector('[data-gaf-refresh]')?.addEventListener('click', () => handle.set({ rows: logRows(), updatedAt: Date.now() }));
}

// --- 4. Load earlier. ---
{
    const { el, handle } = await feedHandle('gaf-earlier');
    const section = /** @type {Element} */ (document.getElementById('feed-earlier'));
    const TOTAL = 30;
    let rows = dayRows().slice(0, 6);
    /** @param {'more' | 'loading' | 'error' | 'end' | undefined} earlier */
    const draw = (earlier) => handle.set({ state: 'ready', rows, total: earlier === 'end' ? rows.length : TOTAL, earlier, updatedAt: ago(8 * 1000) });
    /** @param {string} value */
    const showFoot = (value) => draw(value === 'none' ? undefined : /** @type {'more' | 'loading' | 'error' | 'end'} */ (value));
    wireToggles(section, 'gaf-foot', showFoot);
    el.addEventListener('kp-feed-earlier', () => {
        mark(section, 'gaf-foot', 'loading');
        draw('loading');
        setTimeout(() => {
            // Two pages of twelve older rows: 6, 18, 30. The last one ends the feed.
            rows = [...rows, ...olderRows(rows.length - 6, Math.min(12, TOTAL - rows.length))];
            const end = rows.length >= TOTAL;
            draw(end ? 'end' : 'more');
            mark(section, 'gaf-foot', end ? 'end' : 'more');
        }, 800);
    });
    section.querySelector('[data-gaf-restart]')?.addEventListener('click', () => {
        rows = dayRows().slice(0, 6);
        draw('more');
        mark(section, 'gaf-foot', 'more');
    });
    draw('more');
}

// --- 5. A narrow column that scrolls. ---
{
    const { el, handle } = await feedHandle('gaf-narrow');
    const section = /** @type {Element} */ (document.getElementById('feed-narrow'));
    const rows = [...dayRows().slice(0, 9), ...olderRows(0, 3)];
    handle.set({ state: 'ready', rows, total: rows.length, updatedAt: ago(8 * 1000) });
    wireToggles(section, 'gaf-n-state', (value) => {
        if (value === 'ready') handle.set({ state: 'ready', rows, total: rows.length, updatedAt: ago(8 * 1000) });
        else if (value === 'loading') handle.set({ state: 'loading' });
        else if (value === 'empty') handle.set({ state: 'empty', rows: [], emptyText: 'Nothing has run on this host yet.' });
        else handle.set({ state: 'error', error: 'The status service answered 503. Nothing was changed.' });
    });
    wireToggles(section, 'gaf-n-height', (value) => option(el, 'max', value === 'scroll' ? '26rem' : ''));
    el.addEventListener('kp-feed-retry', () => {
        mark(section, 'gaf-n-state', 'loading');
        handle.set({ state: 'loading' });
        setTimeout(() => {
            handle.set({ state: 'ready', rows, total: rows.length, updatedAt: Date.now() });
            mark(section, 'gaf-n-state', 'ready');
        }, 900);
    });
}
