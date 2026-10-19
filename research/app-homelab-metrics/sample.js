// research/app-homelab-metrics: the sample readings (mock). One deterministic model of the host "pve" and its stacks: a
// reading is a function of its time, so the same moment always reads the same, whichever window or section asks. The
// shapes follow the dashboard's `/data/charts`, `/data/traffic` and `/data/history` answers (admin/web/js/metricsview.js),
// except that times are milliseconds (the package's own unit) instead of the dashboard's seconds.
import { wallTime, zonedTime } from '../../js/chart.js';

export const TZ = 'Europe/Brussels';
export const GiB = 1024 ** 3;
export const MiB = 1024 ** 2;
const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/** Stacks in the order the scope picker lists them; `ct` only where the fleet names one. */
export const STACKS = [
    { name: 'jellyfin', blurb: 'Media server' },
    { name: 'immich', blurb: 'Photos' },
    { name: 'paperless', blurb: 'Documents' },
    { name: 'vaultwarden', blurb: 'Passwords' },
    { name: 'traefik', blurb: 'Gateway' },
    { name: 'prometheus', blurb: 'Metrics store' },
    { name: 'grafana', blurb: 'Dashboards' },
    { name: 'loki', blurb: 'Logs' },
    { name: 'kyu', blurb: 'Message hub', ct: 109 },
    { name: 'almanac', blurb: 'Calendar hub', ct: 112 },
    { name: 'syncthing', blurb: 'File sync', ct: 108 },
    { name: 'inbox', blurb: 'Mail intake', ct: 118 },
    { name: 'metrics', blurb: 'Prometheus and exporters', ct: 113 },
    { name: 'admin', blurb: 'This dashboard', ct: 120 },
];

// ── noise ───────────────────────────────────────────────────────────────────────────────────────────────────────
/** A number in [0, 1) from an integer. @param {number} n */
const hash = (n) => {
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
};
/** A smooth wobble in [-0.5, 0.5]: value noise that changes about every four minutes, as a 5-minute average does. @param {number} seed @param {number} t @param {number} step */
const jitter = (seed, t, step) => {
    const period = Math.max(step, 4 * MIN);
    const k = Math.floor(t / period);
    const f = t / period - k;
    const a = hash(seed * 7919 + k) - 0.5;
    const b = hash(seed * 7919 + k + 1) - 0.5;
    return a + (b - a) * (f * f * (3 - 2 * f));
};
/** A smooth wave in [-1, 1]. @param {number} t @param {number} period @param {number} phase */
const wave = (t, period, phase = 0) => Math.sin((t / period) * 2 * Math.PI + phase);
/** @param {number} x */
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
/** @param {number} v @param {number} lo @param {number} hi */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// ── the clock ───────────────────────────────────────────────────────────────────────────────────────────────────
/** The window length a range key names, in ms. @param {string} key */
export function spanOf(key) {
    const m = /^(\d+)([mhdw])$/.exec(key);
    if (!m) return DAY;
    return Number(m[1]) * { m: MIN, h: HOUR, d: DAY, w: 7 * DAY }[m[2]];
}
/** The spacing of the readings for a window of `span`: about 180 to 360 per source. @param {number} span */
export function stepFor(span) {
    if (span <= HOUR) return 20_000;
    if (span <= 6 * HOUR) return 2 * MIN;
    if (span <= DAY) return 5 * MIN;
    if (span <= 7 * DAY) return 30 * MIN;
    return 2 * HOUR;
}
/** The demo's clock: real time, floored to the second, that a poll moves on by one reading. */
export const clock = { now: Math.floor(Date.now() / 1000) * 1000 };
/** The instant the model was drawn up at; operations are placed relative to it so they do not slide under the charts. */
const ANCHOR = clock.now;

/** A moment on a local day: `offsetDays` back from today, at hour:minute in Brussels. */
export function dayAt(offsetDays, hour, minute, from = ANCHOR) {
    const w = wallTime(from, TZ);
    const d = new Date(Date.UTC(w.year, w.month - 1, w.day - offsetDays));
    return zonedTime(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), hour, minute, TZ) ?? from - offsetDays * DAY;
}

// ── what the host did (the dashboard's /data/history) ───────────────────────────────────────────────────────────
/**
 * @typedef {object} Operation
 * @property {string} id
 * @property {'operation' | 'update' | 'failure'} kind
 * @property {number} at ms
 * @property {number} [until] ms; a window, else a moment
 * @property {string} label
 * @property {string} lane
 * @property {string} [stack]
 */
/** @type {Operation[]} */
export const OPERATIONS = (() => {
    /** @type {Operation[]} */
    const ops = [];
    for (let d = 0; d < 31; d += 1) {
        const at = dayAt(d, 3, 0);
        if (at > ANCHOR) continue;
        ops.push({ id: `round-${d}`, kind: 'operation', at, until: at + 42 * MIN, label: 'Nightly round: snapshot 14 stacks, prune, verify', lane: 'rounds' });
    }
    const patch = dayAt(6, 22, 40);
    ops.push({ id: 'patch', kind: 'operation', at: patch, until: patch + 14 * MIN, label: 'Host patch: pve kernel 6.17.4-1', lane: 'host', stack: 'pve' });
    const updates = [
        [1, 21, 14, 'jellyfin', '10.11.11 to 10.11.12'],
        [4, 20, 31, 'traefik', '3.5.2 to 3.5.3'],
        [9, 22, 5, 'grafana', '12.2.0 to 12.2.1'],
        [16, 21, 48, 'paperless', '2.18.3 to 2.18.4'],
        [23, 20, 10, 'vaultwarden', '1.34.2 to 1.34.3'],
    ];
    for (const [d, h, m, stack, move] of updates) {
        const at = dayAt(Number(d), Number(h), Number(m));
        ops.push({ id: `update-${stack}`, kind: 'update', at, until: at + 3 * MIN, label: `Update ${stack}: ${move}`, lane: 'updates', stack: String(stack) });
    }
    // The update the memory story hangs on: immich 9 hours 30 minutes before the page was drawn.
    const immich = Math.floor((ANCHOR - 9.5 * HOUR) / (5 * MIN)) * 5 * MIN;
    ops.push({ id: 'update-immich', kind: 'update', at: immich, until: immich + 4 * MIN, label: 'Update immich: 1.4.1 to 1.5.0', lane: 'updates', stack: 'immich' });
    const failedToday = dayAt(0, 3, 21);
    const failedAt = failedToday <= ANCHOR ? failedToday : dayAt(1, 3, 21);
    ops.push({ id: 'fail-photos', kind: 'failure', at: failedAt, label: 'Backup photos failed: the backup target is full', lane: 'rounds', stack: 'immich' });
    ops.push({ id: 'fail-loki', kind: 'failure', at: dayAt(12, 3, 14), label: 'Backup loki failed: snapshot timed out', lane: 'rounds', stack: 'loki' });
    return ops.sort((a, b) => a.at - b.at);
})();
export const IMMICH_UPDATE = OPERATIONS.find((o) => o.id === 'update-immich');

/** The kinds the key above a chart names. */
export const KINDS = {
    operation: { label: 'an operation the host ran', tone: /** @type {const} */ ('info') },
    update: { label: 'an update', tone: /** @type {const} */ ('warning') },
    failure: { label: 'a failure', tone: /** @type {const} */ ('critical') },
};

/**
 * What the host did in a window, as chart events: a window of work is a band (`until`), a failure stays a line.
 * @param {number} from @param {number} to @param {{ stack?: string, stacks?: ReadonlySet<string>, kinds?: ReadonlySet<string> }} [filter]
 */
export function eventsIn(from, to, { stack, stacks, kinds } = {}) {
    return OPERATIONS.filter((o) => o.at >= from && o.at <= to)
        .filter((o) => !kinds || kinds.has(o.kind))
        .filter((o) => !stack || o.stack === stack)
        .filter((o) => !stacks || (o.stack != null && stacks.has(o.stack)))
        .map((o) => ({
            at: o.at,
            label: o.label,
            kind: o.kind,
            href: '#activity',
            ...(o.kind !== 'failure' && o.until ? { until: o.until } : {}),
        }));
}
/** @param {number} t @param {(o: Operation) => boolean} [pick] */
const busyAt = (t, pick = () => true) => OPERATIONS.some((o) => o.until && t >= o.at && t <= o.until && pick(o));

// ── readings ────────────────────────────────────────────────────────────────────────────────────────────────────
/** @typedef {[number, number]} Point */
/** The points of a window: one per `step`, oldest first. @param {number} from @param {number} to @param {number} step @param {(t: number) => number} f @returns {Point[]} */
export function pointsOf(from, to, step, f) {
    /** @type {Point[]} */
    const out = [];
    for (let t = Math.ceil(from / step) * step; t <= to; t += step) out.push([t, f(t)]);
    return out;
}

/** CPU used by the host, in per cent of its 12 cores. @param {number} t @param {number} step */
export const hostCpu = (t, step) =>
    clamp(13 + 5 * wave(t, DAY, -1.9) + 8 * jitter(1, t, step) + (busyAt(t, (o) => o.lane === 'rounds') ? 33 + 10 * jitter(2, t, step) : 0) + (busyAt(t, (o) => o.kind === 'update') ? 20 : 0) + (busyAt(t, (o) => o.lane === 'host') ? 28 : 0), 1, 100);
/** Memory used by the host, bytes (of 64 GiB). @param {number} t @param {number} step */
export const hostMem = (t, step) => (38.4 + 2.2 * wave(t, DAY, -1.2) + 0.6 * jitter(3, t, step) + 1.9 * smooth((t - IMMICH_UPDATE.at) / (40 * MIN))) * GiB;
/** Load average over 5 minutes. @param {number} t @param {number} step */
export const hostLoad = (t, step) => clamp(1.1 + 0.6 * wave(t, DAY, -1.9) + 0.9 * jitter(4, t, step) + (busyAt(t, (o) => o.lane === 'rounds') ? 3.4 : 0) + (busyAt(t, (o) => o.kind === 'update') ? 2.2 : 0), 0.05, 12);
/** Hottest chip temperature, degrees. @param {number} t @param {number} step */
export const hostTemp = (t, step) => 54 + 4 * wave(t, DAY, -1.9) + 2 * jitter(5, t, step) + (busyAt(t, (o) => o.lane === 'rounds') ? 8 : 0);

/** The committed memory line (what the stacks are promised), bytes. */
export const COMMITTED = 52 * GiB;

/** @type {{ name: string, base: number, swing: number, seed: number, leak?: boolean }[]} */
export const CONTAINERS = [
    { name: 'jellyfin', base: 5.6, swing: 0.12, seed: 11 },
    { name: 'immich', base: 7.3, swing: 0.05, seed: 12, leak: true },
    { name: 'paperless', base: 2.0, swing: 0.04, seed: 13 },
    { name: 'prometheus', base: 3.2, swing: 0.03, seed: 14 },
    { name: 'loki', base: 2.5, swing: 0.05, seed: 15 },
    { name: 'grafana', base: 0.9, swing: 0.02, seed: 16 },
];
/** Memory of one container in bytes; immich keeps a higher level from its update on. @param {typeof CONTAINERS[number]} c @param {number} t @param {number} step */
export const containerMem = (c, t, step) => (c.base + c.swing * (0.3 * wave(t, DAY, c.seed) + 2.5 * jitter(c.seed, t, step)) + (c.leak ? 1.7 * smooth((t - IMMICH_UPDATE.at) / (25 * MIN)) : 0)) * GiB;

/** Disk traffic of the host, bytes per second, as read and written. @param {number} t @param {number} step */
export const diskRead = (t, step) => (5.5 + 3 * wave(t, DAY, 1) + 4 * jitter(6, t, step) + (busyAt(t, (o) => o.lane === 'rounds') ? 90 : 0)) * MiB;
export const diskWrite = (t, step) => (2.4 + 1.2 * wave(t, DAY, 0.4) + 1.6 * jitter(7, t, step) + (busyAt(t, (o) => o.lane === 'rounds') ? 61 : 0)) * MiB;
/** Disk used per filesystem, per cent; the backup target creeps up, then fills. @param {string} fs @param {number} t @param {number} step */
export const diskUsed = (fs, t, step) =>
    fs === 'backup' ? 80.2 + ((t - (ANCHOR - 30 * DAY)) / (30 * DAY)) * 4.7 + 0.03 * jitter(8, t, step) : fs === 'data' ? 72.8 + ((t - (ANCHOR - 30 * DAY)) / (30 * DAY)) * 1.1 + 0.03 * jitter(9, t, step) : 61.4 + 0.03 * jitter(10, t, step) + ((t - (ANCHOR - 30 * DAY)) / (30 * DAY)) * 0.4;

/**
 * One chart's data, ready for setChartData.
 * @param {object} spec
 * @param {string} spec.label @param {string} spec.key @param {string} [spec.unitKind]
 * @param {number} spec.from @param {number} spec.to
 * @param {{ label: string, f: (t: number, step: number) => number, colour?: string, total?: number }[]} spec.sources
 */
export function chartOf({ label, key, unitKind, from, to, sources, ...rest }) {
    const step = stepFor(to - from);
    return {
        label,
        key,
        ...(unitKind ? { unitKind } : {}),
        from,
        to,
        series: sources.map((s) => ({ label: s.label, points: pointsOf(from, to, step, (t) => s.f(t, step)), ...(s.colour ? { colour: s.colour } : {}), ...(s.total != null ? { total: s.total } : {}) })),
        ...rest,
    };
}

/** The named charts of the System page, as the dashboard lists them. @param {number} from @param {number} to */
export function systemChart(name, from, to) {
    switch (name) {
        case 'cpu':
            return chartOf({ label: 'CPU used', key: 'cpu', unitKind: 'percent', from, to, yMax: 100, sources: [{ label: 'pve', f: (t, s) => hostCpu(t, s) }] });
        case 'mem':
            return chartOf({ label: 'Memory used', key: 'mem', unitKind: 'bytes', from, to, threshold: COMMITTED, sources: [{ label: 'pve', f: (t, s) => hostMem(t, s) }] });
        case 'load':
            return chartOf({ label: 'Load average', key: 'load', unitKind: 'count', from, to, sources: [{ label: 'pve', f: (t, s) => hostLoad(t, s) }] });
        case 'ctmem':
            return chartOf({ label: 'Memory per container', key: 'ctmem', unitKind: 'bytes', from, to, sources: CONTAINERS.map((c) => ({ label: c.name, f: (t, s) => containerMem(c, t, s) })) });
        case 'disk':
            return chartOf({ label: 'Disk used per filesystem', key: 'disk', unitKind: 'percent', from, to, yMax: 100, threshold: 85, sources: [{ label: '/ (root)', f: (t, s) => diskUsed('root', t, s) }, { label: '/rpool/data', f: (t, s) => diskUsed('data', t, s) }, { label: '/mnt/backup', f: (t, s) => diskUsed('backup', t, s) }] });
        case 'diskio':
            return chartOf({ label: 'Disk traffic', key: 'diskio', unitKind: 'bytes/s', from, to, sources: [{ label: 'read', f: (t, s) => diskRead(t, s) }, { label: 'write', f: (t, s) => diskWrite(t, s) }] });
        case 'temp':
            return chartOf({ label: 'Chip temperature', key: 'temp', unitKind: 'celsius', from, to, sources: [{ label: 'coretemp', f: (t, s) => hostTemp(t, s) }, { label: 'nvme0', f: (t, s) => hostTemp(t, s) - 9 + jitter(20, t, s) * 3 }] });
        default:
            return chartOf({ label: name, key: name, from, to, sources: [] });
    }
}

// ── one stack's container (the dashboard's `?stack=` view) ───────────────────────────────────────────────────────
/** What each stack's container is like: CPU in per cent of its cores, memory and its allowance in GiB, disk per cent. */
export const PROFILES = {
    jellyfin: { cpu: 14, mem: 5.6, allowance: 8, disk: 71, apps: 4, restarts: 0, seed: 41 },
    immich: { cpu: 11, mem: 7.3, allowance: 12, disk: 64, apps: 5, restarts: 1, seed: 42 },
    paperless: { cpu: 3, mem: 2.0, allowance: 4, disk: 48, apps: 4, restarts: 0, seed: 43 },
    vaultwarden: { cpu: 1.2, mem: 0.2, allowance: 1, disk: 12, apps: 1, restarts: 0, seed: 44 },
    traefik: { cpu: 2.4, mem: 0.3, allowance: 1, disk: 9, apps: 1, restarts: 0, seed: 45 },
    prometheus: { cpu: 5, mem: 3.2, allowance: 6, disk: 58, apps: 2, restarts: 0, seed: 46 },
    grafana: { cpu: 1.4, mem: 0.9, allowance: 2, disk: 22, apps: 1, restarts: 0, seed: 47 },
    loki: { cpu: 4, mem: 2.5, allowance: 4, disk: 66, apps: 1, restarts: 0, seed: 48 },
    kyu: { cpu: 1.1, mem: 0.2, allowance: 1, disk: 8, apps: 2, restarts: 0, seed: 49 },
    almanac: { cpu: 0.8, mem: 0.15, allowance: 1, disk: 6, apps: 1, restarts: 0, seed: 50 },
    syncthing: { cpu: 2.2, mem: 0.4, allowance: 2, disk: 41, apps: 1, restarts: 0, seed: 51 },
    inbox: { cpu: 1.6, mem: 0.3, allowance: 1, disk: 14, apps: 2, restarts: 0, seed: 52 },
    metrics: { cpu: 6, mem: 1.1, allowance: 3, disk: 33, apps: 5, restarts: 0, seed: 53 },
    admin: { cpu: 2, mem: 0.25, allowance: 1, disk: 11, apps: 1, restarts: 0, seed: 54 },
};
/** @param {string} name @param {'cpu' | 'mem' | 'disk'} what @param {number} t @param {number} step */
export function stackValue(name, what, t, step) {
    const p = PROFILES[/** @type {keyof typeof PROFILES} */ (name)];
    if (!p) return 0;
    if (what === 'cpu') return clamp(p.cpu * (1 + 0.3 * wave(t, DAY, p.seed)) + p.cpu * 0.5 * jitter(p.seed, t, step) + (busyAt(t, (o) => o.stack === name) ? 18 : 0) + (busyAt(t, (o) => o.lane === 'rounds') ? p.cpu * 1.5 : 0), 0.1, 100);
    if (what === 'mem') return (p.mem * (1 + 0.03 * wave(t, DAY, p.seed)) + p.mem * 0.04 * jitter(p.seed + 1, t, step)) * GiB;
    return p.disk + 0.2 * jitter(p.seed + 2, t, step);
}

// ── traffic (the dashboard's /data/traffic, read from the gateway's access log in Loki) ───────────────────────────
export const HOSTNAMES = [
    { name: 'jellyfin.kp-soft.dev', weight: 40, bad4: 0.01, stack: 'jellyfin' },
    { name: 'immich.kp-soft.dev', weight: 22, bad4: 0.012, stack: 'immich' },
    { name: 'vault.kp-soft.dev', weight: 12, bad4: 0.09, stack: 'vaultwarden' },
    { name: 'paperless.kp-soft.dev', weight: 6, bad4: 0.02, stack: 'paperless' },
    { name: 'job.kp-soft.dev', weight: 5, bad4: 0.015, stack: null },
    { name: 'admin.kp-soft.dev', weight: 4, bad4: 0.03, stack: 'admin' },
    { name: 'grafana.kp-soft.dev', weight: 3, bad4: 0.01, stack: 'grafana' },
    { name: 'no hostname', weight: 1, bad4: 0.94, stack: null },
];
/** The busy hours of a household: a bump at lunch and a large one in the evening. @param {number} t */
const rhythm = (t) => {
    const w = wallTime(t, TZ);
    const h = w.hour + w.minute / 60;
    return 0.05 + 0.5 * Math.exp(-((h - 12.5) ** 2) / 4) + 1.0 * Math.exp(-((h - 20.8) ** 2) / 5) + 0.12 * Math.exp(-((h - 7.5) ** 2) / 2);
};
/** Requests per reading interval for one host in the window; a 502 burst while immich restarted after its update. @param {typeof HOSTNAMES[number]} host @param {number} t @param {number} step */
function requestsFor(host, t, step) {
    const perMinute = 5.5 * host.weight * rhythm(t);
    const n = Math.max(0, Math.round((perMinute * step) / MIN * (1 + 0.5 * jitter(host.weight * 31, t, step))));
    const burst = host.stack === 'immich' && IMMICH_UPDATE && t >= IMMICH_UPDATE.at + MIN && t <= IMMICH_UPDATE.at + 9 * MIN;
    const e5 = burst ? Math.round(n * 0.7) : host.stack === 'paperless' && hash(Math.floor(t / step) + 9001) > 0.995 ? 1 : 0;
    const e4 = Math.round((n - e5) * host.bad4 * (1 + jitter(host.weight * 17, t, step)));
    const e3 = Math.round((n - e5 - e4) * 0.05);
    const s2 = Math.max(0, n - e5 - e4 - e3);
    return { s2, s3: e3, s4: e4, s5: e5, n: s2 + e3 + e4 + e5 };
}
/** Requests in one reading interval for one hostname, in all or in one status class. @param {typeof HOSTNAMES[number]} host @param {number} t @param {number} step @param {'n' | 's2' | 's3' | 's4' | 's5'} [cls] */
export const hostRequests = (host, t, step, cls = 'n') => requestsFor(host, t, step)[cls];
export const STATUS_CLASSES = [
    { key: 's2', label: '2xx', colour: 'var(--success-foreground)' },
    { key: 's3', label: '3xx', colour: 'var(--info-foreground)' },
    { key: 's4', label: '4xx', colour: 'var(--warning-foreground)' },
    { key: 's5', label: '5xx', colour: 'var(--destructive)' },
];
/** Requests per interval, stacked by status class. @param {number} from @param {number} to */
export function trafficChart(from, to) {
    const step = stepFor(to - from);
    return {
        label: 'Requests per status class',
        key: 'status',
        unitKind: /** @type {const} */ ('count'),
        stacked: true,
        from,
        to,
        series: STATUS_CLASSES.map((c) => ({
            label: c.label,
            colour: c.colour,
            points: pointsOf(from, to, step, (t) => HOSTNAMES.reduce((a, h) => a + requestsFor(h, t, step)[/** @type {'s2'} */ (c.key)], 0)),
        })),
    };
}
/** Totals for the window: per class, and per host with its classes. @param {number} from @param {number} to */
export function trafficTotals(from, to) {
    const step = stepFor(to - from);
    const perHost = HOSTNAMES.map((h) => ({ host: h, s2: 0, s3: 0, s4: 0, s5: 0, n: 0 }));
    for (let t = Math.ceil(from / step) * step; t <= to; t += step) {
        perHost.forEach((row) => {
            const r = requestsFor(row.host, t, step);
            row.s2 += r.s2;
            row.s3 += r.s3;
            row.s4 += r.s4;
            row.s5 += r.s5;
            row.n += r.n;
        });
    }
    const classes = STATUS_CLASSES.map((c) => ({ ...c, n: perHost.reduce((a, r) => a + r[/** @type {'s2'} */ (c.key)], 0) }));
    return { perHost, classes, total: perHost.reduce((a, r) => a + r.n, 0) };
}
/** Hostname by hour for the last 24 hours, ending at `to`. @param {number} to */
export function trafficByHour(to) {
    const end = Math.floor(to / HOUR) * HOUR;
    const hours = Array.from({ length: 24 }, (_, i) => end - (23 - i) * HOUR);
    return HOSTNAMES.map((host) => ({
        host,
        hours: hours.map((h) => {
            const sum = { at: h, n: 0, s2: 0, s3: 0, s4: 0, s5: 0 };
            for (let t = h; t < h + HOUR; t += 5 * MIN) {
                const r = requestsFor(host, t, 5 * MIN);
                sum.n += r.n;
                sum.s2 += r.s2;
                sum.s3 += r.s3;
                sum.s4 += r.s4;
                sum.s5 += r.s5;
            }
            return sum;
        }),
    }));
}

/** Request samples for a hostname, the way the gateway would keep them (needs the dashboard's C9). */
export function requestSamples(host, to) {
    const base = /** @type {import('../../js/request-inspector.js').CapturedRequest[]} */ ([]);
    const mk = (minutesAgo, method, path, status, headers, body) => ({
        at: to - minutesAgo * MIN,
        method,
        path,
        status,
        headers,
        body,
        bodyBytes: body ? body.length : 0,
        url: `https://${host}${path}`,
    });
    if (host.startsWith('immich')) {
        base.push(mk(572, 'GET', '/api/server/ping', 502, { accept: 'application/json', authorization: 'Bearer 8f2c91ab', 'user-agent': 'immich-android/1.141' }, '{"message":"upstream connect error"}'));
        base.push(mk(571, 'POST', '/api/assets/upload', 502, { 'content-type': 'multipart/form-data', 'x-api-key': 'k3p-7710' }, '{"message":"upstream connect error"}'));
        base.push(mk(31, 'GET', '/api/timeline/buckets?size=MONTH', 200, { accept: 'application/json', authorization: 'Bearer 8f2c91ab' }, '{"buckets":24}'));
    } else if (host.startsWith('vault')) {
        base.push(mk(14, 'POST', '/identity/connect/token', 400, { 'content-type': 'application/x-www-form-urlencoded' }, '{"error":"invalid_grant"}'));
        base.push(mk(9, 'GET', '/api/sync', 200, { accept: 'application/json', authorization: 'Bearer 91d0aa13' }, '{"profile":"..."}'));
    } else {
        base.push(mk(6, 'GET', '/', 200, { accept: 'text/html', 'user-agent': 'Mozilla/5.0' }, ''));
        base.push(mk(22, 'GET', '/favicon.ico', 304, { accept: 'image/*' }, ''));
    }
    return base;
}

// ── drives (SMART, via Prometheus) ──────────────────────────────────────────────────────────────────────────────
/**
 * @typedef {object} Drive
 * @property {string} name @property {string} model @property {boolean} ok @property {number | null} since ms the drive stopped being ok
 * @property {number} temp @property {number[]} tempTrend @property {number} pending @property {number[]} pendTrend
 * @property {number} realloc @property {number} hours
 */
/** @param {boolean} failing */
export function drivesOf(failing) {
    const to = clock.now;
    const trend = (/** @type {number} */ base, /** @type {number} */ amp, /** @type {number} */ seed) =>
        pointsOf(to - 24 * HOUR, to, HOUR, (t) => base + amp * jitter(seed, t, HOUR)).map((p) => Math.round(p[1] * 10) / 10);
    /** @type {Drive[]} */
    const drives = [
        { name: 'nvme0n1', model: 'Samsung 980 PRO 1 TB', ok: true, since: null, temp: 47, tempTrend: trend(47, 6, 31), pending: 0, pendTrend: trend(0, 0, 32).map(() => 0), realloc: 0, hours: 14210 },
        { name: 'sda', model: 'WDC Red Plus 8 TB', ok: true, since: null, temp: 36, tempTrend: trend(36, 3, 33), pending: 0, pendTrend: trend(0, 0, 34).map(() => 0), realloc: 0, hours: 31790 },
        { name: 'sdb', model: 'WDC Red Plus 8 TB', ok: !failing, since: failing ? to - 3 * DAY - 4 * HOUR : null, temp: failing ? 41 : 37, tempTrend: trend(failing ? 41 : 37, 3, 35), pending: failing ? 8 : 0, pendTrend: failing ? pointsOf(to - 24 * HOUR, to, HOUR, (t) => (t < to - 18 * HOUR ? 0 : t < to - 9 * HOUR ? 2 : 8)).map((p) => p[1]) : trend(0, 0, 36).map(() => 0), realloc: failing ? 24 : 0, hours: 31788 },
        { name: 'sdc', model: 'Seagate IronWolf 4 TB', ok: true, since: null, temp: 39, tempTrend: trend(39, 4, 37), pending: 0, pendTrend: trend(0, 0, 38).map(() => 0), realloc: 0, hours: 22345 },
    ];
    return drives;
}
/** The drive's last `count` days (or hours) of SMART state, oldest first; failing drives turn degraded, then down. @param {Drive} drive @param {'days' | 'hours'} unit @param {number} count */
export function driveHistory(drive, unit, count) {
    const size = unit === 'days' ? DAY : HOUR;
    const end = Math.floor(clock.now / size) * size;
    return Array.from({ length: count }, (_, i) => {
        const at = end - (count - 1 - i) * size;
        const label = unit === 'days' ? new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' }).format(at) : new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at);
        const since = drive.since ?? Infinity;
        const state = at + size <= since - (unit === 'days' ? 2 * DAY : 6 * HOUR) ? 'up' : at + size <= since ? 'degraded' : 'down';
        return { key: String(at), label, state: /** @type {const} */ (drive.ok ? 'up' : state), ...(drive.ok ? { uptime: 1 } : {}) };
    });
}

// ── the key figures ─────────────────────────────────────────────────────────────────────────────────────────────
/** Trend points for a tile over the last 24 hours, hourly... or the spacing the tile uses. @param {(t: number, s: number) => number} f */
export function trendOf(f, to = clock.now) {
    const step = 10 * MIN;
    return { points: pointsOf(to - 24 * HOUR, to, step, (t) => f(t, step)), step };
}

/** A moment as the dashboard writes it, dd/mm/yyyy HH:mm in Brussels. @param {number} ms */
export function moment(ms) {
    const w = wallTime(ms, TZ);
    const p = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return `${p(w.day)}/${p(w.month)}/${w.year} ${p(w.hour)}:${p(w.minute)}`;
}
/** A clock time, HH:mm:ss, in Brussels. @param {number} ms */
export function clockTime(ms) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(ms);
}
/** An exact count with a thousands separator. @param {number} n */
export const count = (n) => n.toLocaleString('en-GB');
export { MIN, HOUR, DAY };
