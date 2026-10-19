// research/app-homelab-stacks: the sample data (mock). One fleet on the host "pve", shaped like the dashboard's own answers
// (admin/web/js: the fleet store, /data/capacity, /data/disk-growth, /data/stale-images, /data/topology, the plan of Apply).
// Everything is deterministic and anchored on one moment, so every section agrees on what "now" is.

export const TZ = 'Europe/Brussels';
const MIN = 60_000;
export const HOUR = 3_600_000;
export const DAY = 86_400_000;
export const GB = 1;

/** The moment the page lives at: 19/10/2026 09:41 in Brussels (07:41 UTC). */
export const NOW = Date.UTC(2026, 9, 19, 7, 41);

const parts = (/** @type {number} */ ms, /** @type {Intl.DateTimeFormatOptions} */ o) => Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', ...o }).formatToParts(ms).map((p) => [p.type, p.value]));
/** dd/mm/yyyy @param {number} ms */
export const dateOf = (ms) => {
    const p = parts(ms, { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${p.day}/${p.month}/${p.year}`;
};
/** HH:mm, 24 hours @param {number} ms */
export const timeOf = (ms) => {
    const p = parts(ms, { hour: '2-digit', minute: '2-digit' });
    return `${p.hour}:${p.minute}`;
};
/** dd/mm/yyyy HH:mm @param {number} ms */
export const stamp = (ms) => `${dateOf(ms)} ${timeOf(ms)}`;
/** dd/mm @param {number} ms */
export const shortDate = (ms) => dateOf(ms).slice(0, 5);
/** An exact count with a thousands separator. @param {number} n */
export const count = (n) => n.toLocaleString('en-GB');
/** "1 stack", "2 stacks" @param {number} n @param {string} one @param {string} [many] */
export const plural = (n, one, many = `${one}s`) => `${count(n)} ${n === 1 ? one : many}`;
/** GB with one decimal, cut for small. @param {number} gb */
export const gb = (gb) => `${gb.toFixed(1)} GB`;
/** "3 d 4 h" from ms @param {number} ms */
export const span = (ms) => {
    const d = Math.floor(ms / DAY);
    const h = Math.floor((ms % DAY) / HOUR);
    const m = Math.floor((ms % HOUR) / MIN);
    return d ? `${d} d ${h} h` : h ? `${h} h ${m} min` : `${m} min`;
};

const hash = (/** @type {number} */ n) => {
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
};

// ── the stacks ─────────────────────────────────────────────────────────────────────────────────────────────────
/**
 * @typedef {{ name: string, state: 'up' | 'down' | 'degraded' | 'deploying' | 'unwatched', image: string, digest: string, ports: string, restarts: number, health: string, log: string[], why?: string, since?: number }} App
 * @typedef {{ name: string, ct: number, state: 'running' | 'attention' | 'parked', preset: string, ram: number, ramGb: number, allowGb: number, cpu: number, disk: number, restarts: number, apps: App[], nightsMissed: number[], parkedNote?: string }} Stack
 */

/** @param {string} name @param {App['state']} state @param {string} image @param {string} ports @param {Partial<App>} [o] @returns {App} */
const app = (name, state, image, ports, o = {}) => ({
    name,
    state,
    image,
    digest: `sha256:${Math.floor(hash(name.length * 977 + name.charCodeAt(0)) * 0xffffff)
        .toString(16)
        .padStart(6, '0')}${Math.floor(hash(name.charCodeAt(1) * 31) * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`,
    ports,
    restarts: 0,
    health: state === 'up' ? 'healthy: GET /health 200 in 14 ms' : state === 'unwatched' ? 'not watched: no probe configured' : 'unhealthy',
    log: [
        `${stamp(NOW - 3 * MIN)}  INF  request served in 12 ms`,
        `${stamp(NOW - 11 * MIN)}  INF  cache warmed (214 entries)`,
        `${stamp(NOW - 26 * MIN)}  INF  scheduled job finished`,
    ],
    ...o,
});

/** @type {Stack[]} */
export const STACKS = [
    { name: 'jellyfin', ct: 106, state: 'running', preset: 'media', ram: 0.71, ramGb: 5.7, allowGb: 8, cpu: 0.14, disk: 0.71, restarts: 0, nightsMissed: [], apps: [app('jellyfin', 'up', 'jellyfin/jellyfin:10.11.11', '8096/tcp'), app('jellyseerr', 'up', 'fallenbagel/jellyseerr:2.1.0', '5055/tcp'), app('sonarr', 'up', 'linuxserver/sonarr:4.0.9', '8989/tcp'), app('tdarr', 'up', 'haveagitgat/tdarr:2.27.02', '8265/tcp')] },
    {
        name: 'immich', ct: 107, state: 'attention', preset: 'ml', ram: 0.82, ramGb: 9.8, allowGb: 12, cpu: 0.11, disk: 0.64, restarts: 3, nightsMissed: [9],
        apps: [
            app('immich-server', 'up', 'ghcr.io/immich-app/immich-server:v1.118.2', '2283/tcp'),
            app('immich-machine-learning', 'degraded', 'ghcr.io/immich-app/immich-machine-learning:v1.118.2', '3003/tcp', { restarts: 3, why: 'probe /ping returned 502', since: NOW - 2 * HOUR - 29 * MIN, health: 'unhealthy: GET /ping 502 in 3,001 ms' }),
            app('postgres', 'up', 'tensorchord/pgvecto-rs:pg14-v0.2.0', '5432/tcp'),
            app('redis', 'up', 'redis:7.4-alpine', '6379/tcp'),
            app('immich-uploader', 'unwatched', 'ghcr.io/immich-app/immich-server:v1.118.2', '2284/tcp'),
        ],
    },
    { name: 'paperless', ct: 110, state: 'running', preset: 'light', ram: 0.48, ramGb: 1.9, allowGb: 4, cpu: 0.03, disk: 0.48, restarts: 0, nightsMissed: [], apps: [app('paperless-ngx', 'up', 'paperlessngx/paperless-ngx:2.13.4', '8000/tcp'), app('postgres', 'up', 'postgres:16-alpine', '5432/tcp'), app('redis', 'up', 'redis:7.4-alpine', '6379/tcp')] },
    { name: 'vaultwarden', ct: 111, state: 'running', preset: 'light', ram: 0.2, ramGb: 0.2, allowGb: 1, cpu: 0.012, disk: 0.12, restarts: 0, nightsMissed: [], apps: [app('vaultwarden', 'up', 'vaultwarden/server:1.32.1', '8080/tcp')] },
    { name: 'traefik', ct: 104, state: 'running', preset: 'light', ram: 0.31, ramGb: 0.3, allowGb: 1, cpu: 0.024, disk: 0.09, restarts: 0, nightsMissed: [], apps: [app('traefik', 'up', 'traefik:v3.1.4', '80/tcp, 443/tcp')] },
    { name: 'prometheus', ct: 114, state: 'running', preset: 'database', ram: 0.53, ramGb: 3.2, allowGb: 6, cpu: 0.05, disk: 0.58, restarts: 0, nightsMissed: [], apps: [app('prometheus', 'up', 'prom/prometheus:v2.54.1', '9090/tcp'), app('alertmanager', 'up', 'prom/alertmanager:v0.27.0', '9093/tcp')] },
    { name: 'grafana', ct: 115, state: 'running', preset: 'light', ram: 0.44, ramGb: 0.9, allowGb: 2, cpu: 0.014, disk: 0.22, restarts: 0, nightsMissed: [], apps: [app('grafana', 'up', 'grafana/grafana:11.2.0', '3000/tcp')] },
    {
        name: 'loki', ct: 116, state: 'attention', preset: 'database', ram: 0.91, ramGb: 3.6, allowGb: 4, cpu: 0.04, disk: 0.66, restarts: 7, nightsMissed: [5, 12],
        apps: [app('loki', 'degraded', 'grafana/loki:3.2.0', '3100/tcp', { restarts: 7, why: 'killed 7 times in 24 h: out of memory', since: NOW - 6 * HOUR - 12 * MIN, health: 'unhealthy: container exited with code 137 (out of memory)' })],
    },
    { name: 'kyu', ct: 109, state: 'running', preset: 'light', ram: 0.22, ramGb: 0.2, allowGb: 1, cpu: 0.011, disk: 0.08, restarts: 0, nightsMissed: [], apps: [app('kyu-hub', 'up', 'ghcr.io/kp-soft/kyu:4.0.1', '8443/tcp'), app('kyu-runner', 'up', 'ghcr.io/kp-soft/kyu-runner:1.0.1', '8444/tcp')] },
    { name: 'almanac', ct: 112, state: 'running', preset: 'light', ram: 0.15, ramGb: 0.15, allowGb: 1, cpu: 0.008, disk: 0.06, restarts: 0, nightsMissed: [], apps: [app('almanac', 'up', 'ghcr.io/kp-soft/almanac:4.0.6', '8080/tcp')] },
    { name: 'syncthing', ct: 108, state: 'running', preset: 'light', ram: 0.41, ramGb: 0.8, allowGb: 2, cpu: 0.022, disk: 0.41, restarts: 0, nightsMissed: [], apps: [app('syncthing', 'up', 'syncthing/syncthing:1.28.1', '8384/tcp, 22000/tcp')] },
    { name: 'inbox', ct: 118, state: 'running', preset: 'light', ram: 0.3, ramGb: 0.3, allowGb: 1, cpu: 0.016, disk: 0.14, restarts: 0, nightsMissed: [], apps: [app('inbox-hub', 'up', 'ghcr.io/kp-soft/inbox:0.9.2', '8080/tcp'), app('inbox-intake', 'unwatched', 'ghcr.io/kp-soft/inbox-intake:0.9.2', '2525/tcp')] },
    { name: 'metrics', ct: 113, state: 'running', preset: 'database', ram: 0.37, ramGb: 1.1, allowGb: 3, cpu: 0.06, disk: 0.33, restarts: 0, nightsMissed: [], apps: [app('node-exporter', 'up', 'prom/node-exporter:v1.8.2', '9100/tcp'), app('cadvisor', 'up', 'gcr.io/cadvisor/cadvisor:v0.49.1', '8081/tcp'), app('smartctl', 'up', 'prometheuscommunity/smartctl-exporter:v0.13.0', '9633/tcp'), app('blackbox', 'up', 'prom/blackbox-exporter:v0.25.0', '9115/tcp'), app('pve-exporter', 'up', 'prompve/prometheus-pve-exporter:3.4.3', '9221/tcp')] },
    { name: 'admin', ct: 120, state: 'running', preset: 'light', ram: 0.25, ramGb: 0.25, allowGb: 1, cpu: 0.02, disk: 0.11, restarts: 0, nightsMissed: [], apps: [app('homelab-admin', 'deploying', 'ghcr.io/kp-soft/homelab-admin:3.75.0', '8700/tcp', { why: 'rolling out 3.75.0', since: NOW - 4 * MIN })] },
    { name: 'wiki', ct: 119, state: 'parked', preset: 'light', ram: 0, ramGb: 0, allowGb: 2, cpu: 0, disk: 0.18, restarts: 0, nightsMissed: [], parkedNote: 'parked since 02/09/2026', apps: [app('wikijs', 'unwatched', 'requarks/wiki:2.5', '3000/tcp'), app('wiki-db', 'unwatched', 'postgres:16-alpine', '5432/tcp')] },
    { name: 'homepage', ct: 117, state: 'parked', preset: 'light', ram: 0, ramGb: 0, allowGb: 1, cpu: 0, disk: 0.04, restarts: 0, nightsMissed: [], parkedNote: 'parked since 11/08/2026', apps: [app('homepage', 'unwatched', 'ghcr.io/gethomepage/homepage:v0.9.10', '3000/tcp')] },
    { name: 'gitea', ct: 121, state: 'parked', preset: 'database', ram: 0, ramGb: 0, allowGb: 3, cpu: 0, disk: 0.27, restarts: 0, nightsMissed: [], parkedNote: 'parked since 30/09/2026', apps: [app('gitea', 'unwatched', 'gitea/gitea:1.22.3', '3000/tcp, 2222/tcp'), app('gitea-runner', 'unwatched', 'gitea/act_runner:0.2.11', '-')] },
];

export const byName = (/** @type {string} */ name) => /** @type {Stack} */ (STACKS.find((s) => s.name === name));
export const appsOf = (/** @type {Stack} */ s) => ({ up: s.apps.filter((a) => a.state === 'up').length, total: s.apps.length });
export const needsAttention = (/** @type {Stack} */ s) => s.state === 'attention' || s.apps.some((a) => a.state === 'down' || a.state === 'degraded');

/** Which night of the last 14 had a backup: 'ok', 'bad' (missed), 'none' (parked or before the first). Oldest first. @param {Stack} s @param {number} n */
export function nightsOf(s, n = 14) {
    return Array.from({ length: n }, (_, i) => {
        const back = n - 1 - i;
        if (s.state === 'parked' && back < 20) return back > 2 ? 'ok' : 'none';
        if (s.nightsMissed.includes(back + 1) || (n > 14 && hash(s.ct * 31 + back) > 0.985)) return 'bad';
        if (s.name === 'gitea' && back > 25) return 'none';
        return 'ok';
    });
}
/** The three newest backups of a stack. @param {Stack} s */
export const backupsOf = (s) => {
    const stop = s.state === 'parked' ? 3 : 0;
    const last = nightsOf(s, 14)
        .map((v, i) => ({ v, back: 13 - i }))
        .filter((x) => x.v === 'ok')
        .reverse()
        .slice(0, 3);
    return last.map((x, i) => ({ at: NOW - (x.back + stop) * DAY - 6 * HOUR - 41 * MIN + i * 0, size: Math.round((s.disk * 14 + 0.3 + hash(s.ct + x.back) * 0.4) * 10) / 10 }));
};
export const lastBackup = (/** @type {Stack} */ s) => backupsOf(s)[0];

// ── updates ────────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ key: string, stack: string, app: string, image: string, from: string, to: string, upstream: string, age: number, users: string[] }} Stale */
/** @type {Stale[]} */
export const STALE = [
    { key: 'jellyfin', stack: 'jellyfin', app: 'jellyfin', image: 'jellyfin/jellyfin', from: '10.11.11', to: '12.1', upstream: 'github.com/jellyfin/jellyfin', age: 41, users: ['jellyseerr', 'sonarr (library path)'] },
    { key: 'immich-server', stack: 'immich', app: 'immich-server', image: 'ghcr.io/immich-app/immich-server', from: '1.118.2', to: '1.119.0', upstream: 'github.com/immich-app/immich', age: 6, users: ['immich-machine-learning', 'immich-uploader'] },
    { key: 'immich-ml', stack: 'immich', app: 'immich-machine-learning', image: 'ghcr.io/immich-app/immich-machine-learning', from: '1.118.2', to: '1.119.0', upstream: 'github.com/immich-app/immich', age: 6, users: ['immich-server'] },
    { key: 'paperless', stack: 'paperless', app: 'paperless-ngx', image: 'paperlessngx/paperless-ngx', from: '2.13.4', to: '2.14.0', upstream: 'github.com/paperless-ngx/paperless-ngx', age: 13, users: ['inbox (intake)'] },
    { key: 'traefik', stack: 'traefik', app: 'traefik', image: 'traefik', from: 'v3.1.4', to: 'v3.1.6', upstream: 'github.com/traefik/traefik', age: 22, users: ['every stack with a route'] },
    { key: 'grafana', stack: 'grafana', app: 'grafana', image: 'grafana/grafana', from: '11.2.0', to: '12.0.1', upstream: 'github.com/grafana/grafana', age: 34, users: ['admin (embedded charts)'] },
    { key: 'prometheus', stack: 'prometheus', app: 'prometheus', image: 'prom/prometheus', from: 'v2.54.1', to: 'v3.0.0', upstream: 'github.com/prometheus/prometheus', age: 17, users: ['grafana', 'metrics', 'admin'] },
    { key: 'syncthing', stack: 'syncthing', app: 'syncthing', image: 'syncthing/syncthing', from: '1.28.1', to: '1.29.0', upstream: 'github.com/syncthing/syncthing', age: 9, users: [] },
    { key: 'loki', stack: 'loki', app: 'loki', image: 'grafana/loki', from: '3.2.0', to: '3.2.1', upstream: 'github.com/grafana/loki', age: 11, users: ['grafana'] },
    { key: 'vaultwarden', stack: 'vaultwarden', app: 'vaultwarden', image: 'vaultwarden/server', from: '1.32.1', to: '1.32.5', upstream: 'github.com/dani-garcia/vaultwarden', age: 15, users: ['every browser extension'] },
];

// ── presets ────────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ key: string, label: string, blurb: string, ram: number, cores: number, disk: number, gpu: boolean, vpn: boolean, swap: number, nesting: boolean, backup: string, isDefault?: boolean, words: string }} Preset */
/** @type {Preset[]} */
export const PRESETS = [
    { key: 'light', label: 'light', blurb: 'One small service with its own database file', ram: 1, cores: 1, disk: 8, gpu: false, vpn: false, swap: 512, nesting: false, backup: 'nightly 03:00', isDefault: true, words: 'small tiny default basic' },
    { key: 'database', label: 'database', blurb: 'A service that keeps a real database or a time-series store', ram: 4, cores: 2, disk: 40, gpu: false, vpn: false, swap: 1024, nesting: false, backup: 'nightly 03:00, dump first', words: 'postgres sql storage' },
    { key: 'media', label: 'media', blurb: 'Streaming and transcoding with the host GPU', ram: 8, cores: 4, disk: 60, gpu: true, vpn: false, swap: 0, nesting: true, backup: 'weekly Sunday 04:00', words: 'gpu transcode video film movies stream' },
    { key: 'ml', label: 'ml', blurb: 'Photo or document machine learning, GPU optional', ram: 12, cores: 6, disk: 80, gpu: true, vpn: false, swap: 0, nesting: true, backup: 'nightly 03:00', words: 'gpu photos faces inference' },
    { key: 'vpn-egress', label: 'vpn-egress', blurb: 'Everything leaves through the VPN tunnel', ram: 2, cores: 2, disk: 12, gpu: false, vpn: true, swap: 512, nesting: false, backup: 'none (nothing to keep)', words: 'tunnel wireguard private downloads torrent' },
    { key: 'build', label: 'build', blurb: 'Builds containers and runs CI jobs', ram: 6, cores: 4, disk: 50, gpu: false, vpn: false, swap: 2048, nesting: true, backup: 'none (can be rebuilt)', words: 'ci compile runner' },
];
export const HOST_RAM_GB = 64;
/** What the stacks are allowed to use together, in GB. */
export const COMMITTED_GB = STACKS.filter((s) => s.state !== 'parked').reduce((t, s) => t + s.allowGb, 0);

// ── retired ────────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ name: string, at: number, by: string, repo: number, appdata: number, snapshots: number, newest: number, vault: boolean, locked?: string }} Retired */
/** @type {Retired[]} */
export const RETIRED = [
    { name: 'nextcloud-old', at: Date.UTC(2026, 2, 3, 9, 12), by: 'Kenny', repo: 12.4, appdata: 6.1, snapshots: 41, newest: Date.UTC(2026, 2, 3, 1, 0), vault: true },
    { name: 'plex', at: Date.UTC(2026, 5, 14, 17, 40), by: 'Kenny', repo: 8.7, appdata: 3.9, snapshots: 29, newest: Date.UTC(2026, 5, 14, 1, 0), vault: false },
    { name: 'wikijs', at: Date.UTC(2026, 6, 28, 10, 5), by: 'Claude', repo: 4.1, appdata: 2.6, snapshots: 22, newest: Date.UTC(2026, 6, 28, 1, 0), vault: false },
    { name: 'sonarr-v3', at: Date.UTC(2026, 7, 20, 20, 31), by: 'Kenny', repo: 1.7, appdata: 2.2, snapshots: 12, newest: Date.UTC(2026, 7, 20, 1, 0), vault: false, locked: 'its backup repository is locked by a running restic job (pid 4412)' },
    { name: 'mealie', at: Date.UTC(2026, 8, 12, 8, 2), by: 'Kenny', repo: 3.2, appdata: 1.8, snapshots: 17, newest: Date.UTC(2026, 8, 12, 1, 0), vault: false },
    { name: 'bitwarden-test', at: Date.UTC(2026, 9, 2, 13, 47), by: 'Claude', repo: 0.9, appdata: 0.4, snapshots: 6, newest: Date.UTC(2026, 9, 2, 1, 0), vault: true },
];
export const ageDays = (/** @type {number} */ at) => Math.floor((NOW - at) / DAY);

// ── the map ────────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {'declared' | 'planned' | 'open' | 'named' | 'route'} EdgeKind */
export const EDGE_LABEL = { declared: 'declared, firewall enforced', planned: 'declared, firewall not on yet', open: 'target has no firewall', named: 'address named in a file', route: 'gateway route' };
/** @type {{ from: string, to: string, kind: EdgeKind }[]} */
export const EDGES = [
    ...['jellyfin', 'immich', 'paperless', 'vaultwarden', 'grafana', 'syncthing', 'inbox', 'admin', 'almanac', 'kyu'].map((from) => ({ from: 'traefik', to: from, kind: /** @type {EdgeKind} */ ('route') })),
    { from: 'grafana', to: 'prometheus', kind: 'declared' },
    { from: 'grafana', to: 'loki', kind: 'declared' },
    { from: 'prometheus', to: 'metrics', kind: 'declared' },
    { from: 'prometheus', to: 'kyu', kind: 'planned' },
    { from: 'metrics', to: 'prometheus', kind: 'open' },
    { from: 'almanac', to: 'kyu', kind: 'declared' },
    { from: 'inbox', to: 'kyu', kind: 'declared' },
    { from: 'inbox', to: 'paperless', kind: 'named' },
    { from: 'admin', to: 'kyu', kind: 'declared' },
    { from: 'admin', to: 'prometheus', kind: 'declared' },
    { from: 'admin', to: 'loki', kind: 'open' },
    { from: 'jellyfin', to: 'syncthing', kind: 'named' },
    { from: 'kyu', to: 'almanac', kind: 'declared' },
    { from: 'immich', to: 'kyu', kind: 'planned' },
];
export const MAP_STACKS = ['traefik', 'jellyfin', 'immich', 'paperless', 'vaultwarden', 'prometheus', 'grafana', 'loki', 'kyu', 'almanac', 'syncthing', 'inbox', 'metrics', 'admin'];
/** Weight of a stack on the map: its share of gateway traffic, 0 to 1. */
export const TRAFFIC = { jellyfin: 0.92, immich: 0.64, paperless: 0.18, vaultwarden: 0.12, traefik: 1, prometheus: 0.55, grafana: 0.2, loki: 0.4, kyu: 0.3, almanac: 0.07, syncthing: 0.33, inbox: 0.1, metrics: 0.45, admin: 0.15 };

// ── the disk ───────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {{ key: string, label: string, now: number, perDay: number, alert: number, sizeGb: number }} Filesystem */
/** @type {Filesystem[]} */
export const FILESYSTEMS = [
    { key: 'root', label: '/ (host root)', now: 0.874, perDay: 0.0091, alert: 0.85, sizeGb: 240 },
    { key: 'data', label: '/rpool/data', now: 0.712, perDay: 0.0042, alert: 0.85, sizeGb: 1800 },
    { key: 'backup', label: '/mnt/backup', now: 0.563, perDay: 0.0021, alert: 0.9, sizeGb: 4000 },
];
/** Thirty daily readings ending now, a share per day, with a little weather. @param {Filesystem} f */
export function diskHistory(f) {
    return Array.from({ length: 31 }, (_, i) => {
        const back = 30 - i;
        const v = f.now - f.perDay * back + (hash(f.sizeGb + back) - 0.5) * 0.006 + (back % 7 === 0 ? 0.004 : 0);
        return /** @type {[number, number]} */ ([NOW - back * DAY, Math.round(v * 1000) / 10]);
    });
}
/** Days until full at the thirty-day slope. @param {Filesystem} f */
export const daysToFull = (f) => Math.ceil((1 - f.now) / f.perDay);
/** Who fills the root disk, in GB of 240. */
export const ROOT_USERS = [
    { key: 'loki', label: 'loki', value: 38, tone: /** @type {'warning'} */ ('warning') },
    { key: 'prometheus', label: 'prometheus', value: 31 },
    { key: 'immich', label: 'immich', value: 24 },
    { key: 'jellyfin', label: 'jellyfin', value: 18 },
    { key: 'paperless', label: 'paperless', value: 11 },
    { key: 'docker', label: 'docker images', value: 62 },
    { key: 'system', label: 'system and swap', value: 25 },
];

// ── capacity ───────────────────────────────────────────────────────────────────────────────────────────────────
/** One row per running stack: its three shares. */
export const CAPACITY = STACKS.filter((s) => s.state !== 'parked').map((s) => ({ key: s.name, label: s.name, ct: s.ct, ram: s.ram, cpu: s.cpu * 6, disk: s.disk, ramGb: s.ramGb, allowGb: s.allowGb }));

// ── the plan of Apply ──────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {[kind: 'same' | 'added' | 'removed', number: number, text: string]} DiffLine */
/** @typedef {{ header: string, context?: string, lines: DiffLine[] }} Hunk */
/** @typedef {{ path: string, hunks: Hunk[] }} PlanFile */
/** @typedef {{ key: string, stack: string, action: 'deploy' | 'new' | 'destroy' | 'skip', note: string, files: PlanFile[] }} PlanRow */
/** @type {PlanRow[]} */
export const PLAN = [
    {
        key: 'jellyfin', stack: 'jellyfin', action: 'deploy', note: 'memory limit and one image tag changed',
        files: [{ path: 'jellyfin/compose.yml', hunks: [
            { header: '@@ -9,7 +9,7 @@', context: 'services:', lines: [['same', 9, '  jellyfin:'], ['removed', 10, '    image: jellyfin/jellyfin:10.11.10'], ['added', 10, '    image: jellyfin/jellyfin:10.11.11'], ['same', 11, '    restart: unless-stopped']] },
            { header: '@@ -31,4 +31,4 @@', context: 'deploy:', lines: [['same', 31, '    resources:'], ['removed', 32, '      limits: { memory: 6g }'], ['added', 32, '      limits: { memory: 8g }'], ['same', 33, '    devices: [/dev/dri]']] },
        ] }],
    },
    {
        key: 'immich', stack: 'immich', action: 'deploy', note: 'a new environment variable for the machine-learning worker',
        files: [{ path: 'immich/.env', hunks: [{ header: '@@ -4,3 +4,4 @@', context: 'IMMICH', lines: [['same', 4, 'IMMICH_LOG_LEVEL=log'], ['added', 5, 'MACHINE_LEARNING_WORKERS=2'], ['same', 6, 'DB_HOSTNAME=postgres']] }] }],
    },
    {
        key: 'loki', stack: 'loki', action: 'deploy', note: 'memory limit raised after the out-of-memory kills',
        files: [
            { path: 'loki/compose.yml', hunks: [{ header: '@@ -14,6 +14,6 @@', context: 'deploy:', lines: [['same', 14, '    resources:'], ['removed', 15, '      limits: { memory: 4g }'], ['added', 15, '      limits: { memory: 6g }'], ['same', 16, '      reservations: { memory: 1g }']] }] },
            { path: 'loki/loki.yml', hunks: [{ header: '@@ -22,3 +22,4 @@', context: 'limits_config:', lines: [['same', 22, '  retention_period: 336h'], ['added', 23, '  max_query_series: 2000'], ['same', 24, '  ingestion_rate_mb: 8']] }] },
        ],
    },
    {
        key: 'wiki2', stack: 'wiki2', action: 'new', note: 'a new stack, not on the host yet',
        files: [{ path: 'wiki2/compose.yml', hunks: [{ header: '@@ -0,0 +1,6 @@', lines: [['added', 1, 'services:'], ['added', 2, '  wiki:'], ['added', 3, '    image: ghcr.io/requarks/wiki:2.5'], ['added', 4, '    restart: unless-stopped'], ['added', 5, '    ports: ["3000:3000"]'], ['added', 6, '    volumes: [wiki-data:/data]']] }] }],
    },
    {
        key: 'paperless', stack: 'paperless', action: 'new', note: 'new second worker app, the stack itself already runs',
        files: [{ path: 'paperless/compose.yml', hunks: [{ header: '@@ -40,0 +41,5 @@', context: 'services:', lines: [['added', 41, '  paperless-worker:'], ['added', 42, '    image: paperlessngx/paperless-ngx:2.13.4'], ['added', 43, '    command: ["document_consumer"]'], ['added', 44, '    depends_on: [postgres, redis]'], ['added', 45, '    restart: unless-stopped']] }] }],
    },
    {
        key: 'homepage', stack: 'homepage', action: 'destroy', note: 'removed from the repository; its container and volume would be deleted',
        files: [{ path: 'homepage/compose.yml', hunks: [{ header: '@@ -1,7 +0,0 @@', lines: [['removed', 1, 'services:'], ['removed', 2, '  homepage:'], ['removed', 3, '    image: ghcr.io/gethomepage/homepage:v0.9.10'], ['removed', 4, '    restart: unless-stopped'], ['removed', 5, '    ports: ["3000:3000"]'], ['removed', 6, '    volumes: [./config:/app/config]'], ['removed', 7, '    environment: [PUID=1000]']] }] }],
    },
    {
        key: 'traefik', stack: 'traefik', action: 'skip', note: 'nothing changed since the last apply',
        files: [],
    },
];
/** Lines added and removed in a plan row. @param {PlanRow} row */
export const plusMinus = (row) => {
    let add = 0;
    let del = 0;
    for (const f of row.files) for (const h of f.hunks) for (const l of h.lines) l[0] === 'added' ? add++ : l[0] === 'removed' ? del++ : 0;
    return { add, del };
};
/** @param {PlanFile} f */
export const filePlusMinus = (f) => plusMinus({ key: '', stack: '', action: 'deploy', note: '', files: [f] });
