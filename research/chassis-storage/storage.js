// research/chassis-storage/storage.js: the chassis-rs "Storage" kit page as pure functions, data in, markup out.
//
// Every function here is what a chassis-rs template will become (docs/STORAGE_DESIGN.md of chassis-rs, section 8). The data is SAMPLE
// data: the admin dashboard's kinds with the figures Kenny gave (Notifications 2 418 rows 21.4 MB, Uptime history 648 000 cells
// 14.2 MB, Fleet trend 9.8 MB, Inbox snoozes 212 rows, Schedules 14 rows, Update flows 37 rows); the page says so. Nothing reads the real
// clock: NOW is fixed. Sizes are decimal (1 MB = 1 000 000 bytes), counts keep every digit, dates are dd/mm/yyyy HH:mm.
import { esc, fmt, header, flashButton } from '../chassis-kit-pages/kit.js';

/** The demo's clock: every date here is counted from it. */
export const NOW = Date.parse('2026-10-21T11:48:00+02:00');
const DAY = 86_400_000;
export const BUDGET = 50_000_000;
export const WARN = 40_000_000;

/* ------------------------------------------------------------------------------------------------ formatting -- */

/** A size in words people read: KB under a megabyte, MB with one decimal, GB above. @param {number} bytes */
export function size(bytes) {
    if (bytes < 1e6) return `${bytes <= 0 ? 0 : Math.max(1, Math.round(bytes / 1e3))} KB`;
    if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${(bytes / 1e9).toFixed(1)} GB`;
}

/** An exact count with a no-break space between thousands: 2 418, 648 000. @param {number} n */
export const num = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** @param {number} n @param {string} one @param {string} many */
export const plural = (n, one, many) => `${num(n)} ${n === 1 ? one : many}`;

/** dd/mm/yyyy, the date picker's own field format. @param {number} ms */
export function dmy(ms) {
    const p = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', day: '2-digit', month: '2-digit', year: 'numeric' })
            .formatToParts(new Date(ms))
            .map((x) => [x.type, x.value]),
    );
    return `${p.day}/${p.month}/${p.year}`;
}

/** @param {string} text dd/mm/yyyy @returns {number | null} noon in Brussels that day */
export function parseDmy(text) {
    const m = /^\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\s*$/.exec(text);
    if (!m) return null;
    return Date.parse(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T12:00:00+02:00`);
}

/* ---------------------------------------------------------------------------------------------------- kinds -- */

/**
 * @typedef {{ id: string, label: string, type: 'choice' | 'select' | 'flag' | 'text', note: string, options?: string[][], multi?: boolean, factor?: Record<string, number>, on?: number, def: any }} Filter
 * @typedef {{ id: string, label: string, unit: string, about: string, rows: number, bytes: number, oldest: number, newest: number, self?: string, older: string, filters: Filter[], head: string[] }} Kind
 */

/** @type {Omit<Kind, 'rows' | 'bytes' | 'oldest' | 'newest'>[]} */
const DECLARED = [
    {
        id: 'notifications',
        label: 'Notifications',
        unit: 'rows',
        about: 'Every notice the dashboard raised, with its level, its stack and whether it was read.',
        older: '30/06/2026',
        head: ['Raised', 'Level', 'Stack', 'Notice'],
        filters: [
            {
                id: 'level',
                type: 'choice',
                multi: true,
                label: 'Level',
                note: 'None chosen means every level.',
                options: [
                    ['info', 'Info'],
                    ['warn', 'Warn'],
                    ['error', 'Error'],
                ],
                factor: { info: 0.62, warn: 0.3, error: 0.08 },
                def: [],
            },
            {
                id: 'read',
                type: 'choice',
                label: 'Read state',
                note: 'Whether someone opened the notice.',
                options: [
                    ['any', 'Any'],
                    ['read', 'Read'],
                    ['unread', 'Unread'],
                ],
                factor: { any: 1, read: 0.7, unread: 0.3 },
                def: 'any',
            },
            {
                id: 'stack',
                type: 'select',
                label: 'Stack',
                note: 'The stack that raised it.',
                options: [
                    ['any', 'Any stack'],
                    ['media', 'media'],
                    ['platform', 'platform'],
                    ['dashboard', 'dashboard'],
                    ['home', 'home'],
                ],
                factor: { any: 1 },
                on: 0.22,
                def: 'any',
            },
        ],
    },
    {
        id: 'uptime',
        label: 'Uptime history',
        unit: 'cells',
        about: 'One cell for every check of every service: what the status strips are drawn from.',
        older: '01/06/2026',
        head: ['Checked', 'Service', 'Result'],
        filters: [
            {
                id: 'service',
                type: 'select',
                label: 'Service',
                note: 'Only this service’s cells.',
                options: [
                    ['any', 'Any service'],
                    ['jellyfin', 'jellyfin'],
                    ['traefik', 'traefik'],
                    ['grafana', 'grafana'],
                ],
                factor: { any: 1 },
                on: 0.33,
                def: 'any',
            },
        ],
    },
    {
        id: 'fleet',
        label: 'Fleet trend',
        unit: 'samples',
        about: 'Container and host figures sampled over time, for the trend charts.',
        older: '01/07/2026',
        head: ['Sampled', 'Figure', 'Value'],
        filters: [],
    },
    {
        id: 'snoozes',
        label: 'Inbox snoozes',
        unit: 'rows',
        about: 'Notices set aside until later.',
        self: 'Expired rows are removed automatically.',
        older: '21/10/2026',
        head: ['Back on', 'Notice', 'State'],
        filters: [{ id: 'ended', type: 'flag', label: 'Only ended snoozes', note: 'Snoozes still waiting are kept.', on: 0.6, def: true }],
    },
    {
        id: 'flows',
        label: 'Update flows',
        unit: 'rows',
        about: 'One row for every update run: which stack, and how it ended.',
        older: '01/08/2026',
        head: ['Started', 'Stack', 'Result'],
        filters: [
            {
                id: 'result',
                type: 'choice',
                label: 'Result',
                note: 'How the run ended.',
                options: [
                    ['any', 'Any'],
                    ['ok', 'Succeeded'],
                    ['failed', 'Failed'],
                ],
                factor: { any: 1, ok: 0.85, failed: 0.15 },
                def: 'any',
            },
            { id: 'stackname', type: 'text', label: 'Stack name contains', note: 'Part of a name is enough.', on: 0.3, def: '' },
        ],
    },
    {
        id: 'schedules',
        label: 'Schedules',
        unit: 'rows',
        about: 'The jobs this dashboard runs on a timetable.',
        older: '01/03/2026',
        head: ['Created', 'Schedule', 'Enabled'],
        filters: [{ id: 'disabled', type: 'flag', label: 'Only disabled schedules', note: 'Schedules that are switched off.', on: 0.35, def: false }],
    },
];

const FIGURES = {
    notifications: { rows: 2418, bytes: 21_400_000, oldest: '2026-02-03T09:12:00+01:00', newest: '2026-10-21T11:36:00+02:00' },
    uptime: { rows: 648_000, bytes: 14_200_000, oldest: '2026-03-01T00:00:00+01:00', newest: '2026-10-21T11:45:00+02:00' },
    fleet: { rows: 52_416, bytes: 9_800_000, oldest: '2026-04-12T00:00:00+02:00', newest: '2026-10-21T11:45:00+02:00' },
    snoozes: { rows: 212, bytes: 100_000, oldest: '2026-08-30T08:05:00+02:00', newest: '2026-10-21T09:20:00+02:00' },
    flows: { rows: 37, bytes: 46_000, oldest: '2026-05-02T02:00:00+02:00', newest: '2026-10-20T02:00:00+02:00' },
    schedules: { rows: 14, bytes: 18_000, oldest: '2026-01-14T10:30:00+01:00', newest: '2026-10-02T16:10:00+02:00' },
};

/** How each scenario scales the big kinds, and what the file holds besides them. warn is the figures Kenny gave. */
const SCENARIOS = {
    warn: { scale: { notifications: 1, uptime: 1, fleet: 1 }, free: 1_600_000, wal: 400_000 },
    ok: { scale: { notifications: 0.19, uptime: 0.55, fleet: 0.45 }, free: 200_000, wal: 100_000 },
    over: { scale: { notifications: 1.3, uptime: 1.1, fleet: 1.15 }, free: 2_100_000, wal: 600_000 },
    fresh: { scale: {}, free: 0, wal: 0, none: true },
};

/** Sign-in data: clients, sessions and passkeys. Read-only here, whatever the scenario. */
const KIT_BYTES = 300_000;

/** @typedef {{ scenario: keyof typeof SCENARIOS, kinds: Kind[], free: number, wal: number, kit: number }} Store */

/** @param {keyof typeof SCENARIOS} scenario @returns {Store} */
export function makeStore(scenario) {
    const sc = SCENARIOS[scenario];
    const kinds = /** @type {Kind[]} */ (
        'none' in sc
            ? []
            : DECLARED.map((d) => {
                  const f = FIGURES[/** @type {keyof typeof FIGURES} */ (d.id)];
                  const k = /** @type {Record<string, number>} */ (sc.scale)[d.id] ?? 1;
                  return {
                      ...d,
                      rows: Math.round(f.rows * k),
                      bytes: Math.round(f.bytes * k),
                      oldest: Date.parse(f.oldest),
                      newest: Date.parse(f.newest),
                  };
              })
    );
    return { scenario, kinds, free: sc.free, wal: sc.wal, kit: scenario === 'fresh' ? 120_000 : KIT_BYTES };
}

/** The page's data, shared by every section and changed by a delete or a compact. */
export const store = { current: makeStore('warn') };

/** @param {Store} s */
export function totals(s) {
    const live = s.kinds.reduce((a, k) => a + k.bytes, 0);
    const app = live + s.free + (s.kinds.length ? 0 : 80_000);
    const total = app + s.kit + s.wal;
    const level = total > BUDGET ? 'over' : total > WARN ? 'warn' : 'ok';
    return { live, app, kit: s.kit, wal: s.wal, total, free: s.free, level, share: total / BUDGET };
}

/** @param {string} id */
export const kindById = (id) => store.current.kinds.find((k) => k.id === id) ?? store.current.kinds[0];

/* ------------------------------------------------------------------------------------------------- the preview -- */

/** @typedef {{ older: string, values: Record<string, any> }} Form */

/** @param {Kind} k @returns {Form} */
export function defaultForm(k) {
    return { older: k.older, values: Object.fromEntries(k.filters.map((f) => [f.id, Array.isArray(f.def) ? [...f.def] : f.def])) };
}

/** What the filters keep of the rows older than the date. @param {Kind} k @param {Form} form */
function keep(k, form) {
    let factor = 1;
    for (const f of k.filters) {
        const v = form.values[f.id];
        if (f.type === 'choice' && f.multi)
            factor *= v.length ? v.reduce((/** @type {number} */ a, /** @type {string} */ x) => a + (f.factor?.[x] ?? 0), 0) : 1;
        else if (f.type === 'choice') factor *= f.factor?.[v] ?? 1;
        else if (f.type === 'select') factor *= v === 'any' ? 1 : (f.on ?? 1);
        else if (f.type === 'flag') factor *= v ? (f.on ?? 1) : 1;
        else if (f.type === 'text') factor *= String(v).trim() ? (f.on ?? 1) : 1;
    }
    return Math.min(1, factor);
}

/**
 * The read-only preview the server answers: how many rows, how much space, the oldest and newest, and the first rows.
 * @param {Kind} k @param {Form} form
 */
export function preview(k, form) {
    const limit = parseDmy(form.older);
    const span = Math.max(1, k.newest - k.oldest);
    const share = limit === null ? 0 : Math.min(1, Math.max(0, (limit - k.oldest) / span));
    const count = Math.round(k.rows * share * keep(k, form));
    const bytes = k.rows ? Math.round((k.bytes * count) / k.rows) : 0;
    const last = limit === null ? k.oldest : Math.max(k.oldest, limit - DAY * 0.4);
    return {
        count,
        bytes,
        oldest: count ? k.oldest : null,
        newest: count ? last : null,
        limit,
        rows: count ? sample(k, form, Math.min(5, count)) : [],
    };
}

/** @param {Kind} k @param {Form} form @param {number} n */
function sample(k, form, n) {
    const level = form.values.level?.length ? form.values.level : ['info', 'warn', 'error'];
    const stackNames = ['media', 'platform', 'dashboard', 'home'];
    const texts = {
        notifications: ['Backup finished', 'Disk 82 % full', 'Certificate renews in 12 days', 'Container restarted', 'Update available'],
        snoozes: ['Disk 82 % full', 'Update available', 'Backup is late', 'Certificate renews soon', 'Restart needed'],
    };
    const step = Math.max(1, (k.newest - k.oldest) / Math.max(1, k.rows));
    return Array.from({ length: n }, (_, i) => {
        const t = fmt(k.oldest + step * (i * 3 + 1));
        if (k.id === 'notifications')
            return [t, level[i % level.length], form.values.stack !== 'any' ? form.values.stack : stackNames[i % 4], texts.notifications[i % 5]];
        if (k.id === 'uptime')
            return [t, form.values.service !== 'any' ? form.values.service : ['jellyfin', 'traefik', 'grafana'][i % 3], i === 3 ? 'down' : 'up'];
        if (k.id === 'fleet')
            return [t, ['CPU', 'Memory', 'Disk', 'Containers', 'Network'][i % 5], ['34 %', '61 %', '78 %', '23', '4.2 MB/s'][i % 5]];
        if (k.id === 'snoozes') return [t, texts.snoozes[i % 5], 'ended'];
        if (k.id === 'flows')
            return [t, form.values.stackname?.trim() || stackNames[i % 4], form.values.result === 'failed' || i === 2 ? 'failed' : 'succeeded'];
        return [
            fmt(k.oldest + DAY * 9 * i),
            ['Nightly backup', 'Weekly update check', 'Monthly restore test', 'Log cleanup', 'Certificate check'][i % 5],
            form.values.disabled || i % 2 ? 'no' : 'yes',
        ];
    });
}

/** Remove what a preview counted: the rows go, their space stays inside the file until it is compacted. @param {Kind} k @param {ReturnType<typeof preview>} p */
export function applyDelete(k, p) {
    const s = store.current;
    k.rows -= p.count;
    k.bytes -= p.bytes;
    s.free += p.bytes;
    if (k.rows <= 0) {
        k.rows = 0;
        k.bytes = 0;
    } else if (p.limit) k.oldest = Math.max(k.oldest, p.limit);
}

/** Give the empty space back: the file shrinks and the pending writes are folded in. */
export function applyCompact() {
    const s = store.current;
    s.free = 0;
    s.wal = 0;
}

/* ----------------------------------------------------------------------------------------------- the page -- */

/** @param {string} level */
const levelWord = (level) => (level === 'over' ? 'Over budget' : level === 'warn' ? 'Getting full' : 'Within budget');
/** @param {string} level */
const levelBadge = (level) =>
    `<span class="kp-badge ${level === 'over' ? 'kp-badge--destructive' : level === 'warn' ? 'kp-badge--warning' : 'kp-badge--success'}">${levelWord(level)}</span>`;

/** @param {string} uid @param {string} key @param {string} title @param {string} about @param {number} span @param {string} data @param {string} [extra] */
function card(uid, key, title, about, span, data, extra = '') {
    return `<section class="kp-card st-card st-card--${key}" data-kp-span="${span}" data-kp-state="ready" data-st-card="${key}" aria-labelledby="${uid}-${key}-t">
      <div class="kp-card__header"><h2 class="kp-card__title" id="${uid}-${key}-t">${esc(title)}</h2>${extra ? `<div class="kp-card__actions">${extra}</div>` : ''}</div>
      <p class="kp-card__body">${esc(about)}</p>
      <div class="kp-card__stage"><div class="kp-card__data">${data}</div></div></section>`;
}

/** The warning or over-budget band: one alert, the worst fact first, with its fix. @param {string} uid @param {Store} s */
export function attention(uid, s) {
    const t = totals(s);
    if (t.level === 'ok') return '';
    const biggest = [...s.kinds].sort((a, b) => b.bytes - a.bytes)[0];
    const over = t.level === 'over';
    const what = over
        ? `Storage is over its budget: ${size(t.total)} of ${size(BUDGET)}`
        : `Storage is getting full: ${size(t.total)} of ${size(BUDGET)}`;
    const why = over
        ? 'The budget only warns. Nothing was deleted, and the service keeps working and keeps saving.'
        : `You are warned from ${size(WARN)}. Nothing is deleted for you, and the service keeps working and keeps saving.`;
    const fix = biggest
        ? `Clean up the biggest kind, ${biggest.label} (${size(biggest.bytes)}), then compact the file to give the space back.`
        : 'Compact the file to give the space back.';
    return `<div class="kp-ops__attention kp-attention" data-st-band><div class="kp-alert kp-alert--${over ? 'destructive' : 'warning'} kp-attention__item" role="alert" data-kp-severity="${over ? 'critical' : 'warning'}"><span class="kp-attention__icon" aria-hidden="true">!</span>
      <div class="kp-attention__text"><strong><span class="kp-sr-only">${over ? 'Critical' : 'Warning'}: </span>${esc(what)}</strong><span>${esc(why)}</span><span><b>What now:</b> ${esc(fix)}</span></div>
      ${biggest ? `<div class="kp-attention__actions"><button type="button" class="kp-button" data-st-cleanup="${biggest.id}">Clean up ${esc(biggest.label)}…</button></div>` : ''}</div></div>`;
}

/** The budget card: the figure, the split of the three parts, and what each part is. @param {string} uid @param {Store} s */
export function budgetCard(uid, s) {
    const t = totals(s);
    const pct = Math.round(t.share * 100);
    const left = BUDGET - t.total;
    const tone = t.level === 'over' ? ' data-kp-tone="destructive"' : t.level === 'warn' ? ' data-kp-tone="warning"' : '';
    const trend =
        t.level === 'over' ? `${size(-left)} over the budget of ${size(BUDGET)}` : `${size(left)} left; ${pct} % of the budget of ${size(BUDGET)}`;
    const row = (/** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ note, /** @type {string} */ action = '') =>
        `<div class="st-files__row"><span class="st-files__label">${label}</span><strong class="st-files__size">${value}</strong><p class="st-files__note">${note}</p><span class="st-files__tag">${action}</span></div>`;
    const files = `<div class="st-files" role="group" aria-label="The three parts of the storage">
        ${row('Application data', size(t.app), `Everything this service stores. Cleaned up here, kind by kind${t.free ? `; ${size(t.free)} of it is empty space` : ''}.`)}
        ${row('Sign-in data', size(t.kit), 'Used for sign-in, never cleaned up here.', '<span class="kp-badge">Read-only</span>')}
        ${row('Pending writes', size(t.wal), 'Recent changes not yet folded into the data; it empties itself.')}
      </div>`;
    const data = `<div class="st-budget">
      <div class="kp-kpis st-budget__figure" role="group" aria-label="Space used" data-kp-kpis-columns="all 1"><div class="kp-kpi"${tone}><span class="kp-kpi__label">Used</span><span class="kp-kpi__value">${size(t.total)}<small>of ${size(BUDGET)}</small></span><span class="kp-kpi__trend">${trend}</span></div></div>
      <figure class="kp-stackbar st-budget__bar" data-kp-stackbar data-st-stackbar></figure>
      ${files}</div>`;
    return card(
        uid,
        'budget',
        'Space used',
        `Everything this service keeps on disk, against a budget of ${size(BUDGET)}. The budget only warns: nothing is ever deleted for you.`,
        8,
        data,
        levelBadge(t.level),
    );
}

/** What the share bar draws. @param {Store} s */
export function stackSpec(s) {
    const t = totals(s);
    const tone = t.level === 'over' ? 'destructive' : t.level === 'warn' ? 'warning' : undefined;
    return {
        title: 'Where the space goes',
        total: BUDGET,
        format: size,
        summary: `${size(t.total)} / ${size(BUDGET)}`,
        marks: [{ at: WARN / BUDGET, label: `Warns from ${size(WARN)}` }],
        label: `Storage used: ${size(t.total)} of ${size(BUDGET)}`,
        parts: [
            { key: 'app', label: 'Application data', value: t.app, tone },
            { key: 'kit', label: 'Sign-in data (read-only)', value: t.kit },
            { key: 'wal', label: 'Pending writes', value: t.wal },
        ],
    };
}

/** The compact card: how much the file can give back, and the one button. @param {string} uid @param {Store} s */
export function compactCard(uid, s) {
    const t = totals(s);
    const none = t.free <= 0 && t.wal <= 0;
    const after = t.app - t.free;
    const data = `<div class="st-compact-card">
      <div class="kp-kpis" role="group" aria-label="Space that can be given back" data-kp-kpis-columns="all 1"><div class="kp-kpi"><span class="kp-kpi__label">Can be given back</span><span class="kp-kpi__value">${size(t.free)}</span><span class="kp-kpi__trend">${none ? 'The file has no empty space' : 'Empty space deleted rows left behind'}</span></div></div>
      <dl class="kp-kv kp-kv--lines"><div class="kp-kv__row"><dt>File now</dt><dd>${size(t.app)}</dd></div><div class="kp-kv__row"><dt>After compacting</dt><dd>about ${size(after)}</dd></div><div class="kp-kv__row"><dt>Last compacted</dt><dd>never</dd></div></dl>
      <div class="st-compact-card__act"><button type="button" class="kp-button kp-button--primary" data-st-compact${none ? ' disabled aria-describedby="' + uid + '-compact-why"' : ''}>Compact…</button><p class="kp-dialog__note" id="${uid}-compact-why">${none ? 'Nothing to give back yet: deleted rows leave empty space to reclaim.' : 'Writes pause for a few seconds. It never runs by itself.'}</p></div></div>`;
    return card(
        uid,
        'compact',
        'Give back empty space',
        'Deleting rows leaves empty space inside the file until it is rewritten. Compacting gives it back; the sign-in data is never touched.',
        4,
        data,
    );
}

/** @param {string} uid @param {Store} s @param {{ cards?: boolean }} o */
export function kindsCard(uid, s, { cards = false } = {}) {
    const rows = s.kinds
        .slice()
        .sort((a, b) => b.bytes - a.bytes)
        .map((k) => {
            const share = k.bytes / BUDGET;
            const line = `<span class="st-kind__about">${esc(k.about)}</span>${k.self ? `<span class="st-kind__self"><span class="kp-badge">Cleans itself</span> ${esc(k.self)}</span>` : ''}`;
            return `<tr data-kp-row-key="${k.id}">
        <td data-label="Kind"><span class="st-kind"><strong class="st-kind__name">${esc(k.label)}</strong>${line}</span></td>
        <td class="kp-numeric" data-label="Amount" data-kp-sort-value="${k.rows}">${num(k.rows)} ${k.unit}</td>
        <td class="kp-numeric" data-label="Size" data-kp-sort-value="${k.bytes}">${size(k.bytes)}</td>
        <td data-label="Share of the budget" data-kp-sort-value="${k.bytes}"><span class="st-share"><span class="kp-meter" role="meter" aria-label="${esc(k.label)} share of the budget" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(share * 100)}" aria-valuetext="${share < 0.01 ? 'less than 1' : Math.round(share * 100)} % of the budget" style="--kp-value: ${share.toFixed(4)}"></span><span class="st-share__n">${share < 0.01 ? '<1' : Math.round(share * 100)} %</span></span></td>
        <td class="kp-timestamp" data-label="Oldest" data-kp-sort-value="${k.rows ? k.oldest : 0}">${k.rows ? fmt(k.oldest) : '<span class="kp-text-muted">none</span>'}</td>
        <td class="kp-timestamp" data-label="Newest" data-kp-sort-value="${k.rows ? k.newest : 0}">${k.rows ? fmt(k.newest) : '<span class="kp-text-muted">none</span>'}</td>
        <td class="text-end ck-fit"><button type="button" class="kp-button" data-st-cleanup="${k.id}" aria-label="Clean up ${esc(k.label)}"${k.rows ? '' : ' disabled'}>Clean up…</button></td></tr>`;
        })
        .join('');
    const table = `<div class="kp-datatable st-kinds" data-kp-datatable data-kp-remember="${uid}-kinds" data-kp-page-size="10"${cards ? ' data-kp-cards' : ''}>
      <div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">What is stored, one row per kind</caption>
      <thead><tr><th scope="col" data-kp-sort="text">Kind</th><th scope="col" data-kp-sort="number" class="kp-numeric">Amount</th><th scope="col" data-kp-sort="number" class="kp-numeric">Size</th><th scope="col" data-kp-sort="number">Share of the budget</th><th scope="col" data-kp-sort="number">Oldest</th><th scope="col" data-kp-sort="number">Newest</th><th scope="col"><span class="kp-sr-only">Action</span></th></tr></thead>
      <tbody>${rows}</tbody></table></div>
      <div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">This application stores no data of its own yet</p><p class="kp-empty__body">When it declares a kind of data, it appears here with its size and a way to clean it up.</p></div></div>`;
    return card(
        uid,
        'kinds',
        `What is stored (${s.kinds.length} ${s.kinds.length === 1 ? 'kind' : 'kinds'})`,
        'One row for every kind of data this application keeps. Clean up removes only what you choose, after a preview and a typed confirmation.',
        12,
        table,
    );
}

/** The Storage page in the kit's shell. @param {string} uid @param {Store} s @param {{ cards?: boolean }} o */
export function storagePage(uid, s, { cards = false } = {}) {
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none">
  ${header(uid, { title: 'Storage', about: 'How much room this service’s data takes, what it is made of, and how to clear out what you no longer need.', fresh: true })}
  ${attention(uid, s)}
  <div class="kp-ops__body">${budgetCard(uid, s)}${compactCard(uid, s)}${kindsCard(uid, s, { cards })}</div>
  <p class="kp-dialog__note st-sample">Sample data: the figures are made up in the shape of the admin dashboard’s storage; nothing here reads a real service.</p>
</div>`;
}

/** The two data cards alone, for the states section (a card in loading, empty or failed). @param {string} uid @param {Store} s @param {{ cards?: boolean }} o */
export function statesPage(uid, s, { cards = false } = {}) {
    return `<div class="kp-ops ck-ops" data-kp-ops-sticky="none"><div class="kp-ops__body">${budgetCard(uid, s)}${compactCard(uid, s)}${kindsCard(uid, s, { cards })}</div>
  <p class="kp-dialog__note st-sample">Sample data: the figures are made up in the shape of the admin dashboard’s storage.</p></div>`;
}

/* ------------------------------------------------------------------------------------------- the clean-up dialog -- */

/** @typedef {{ kind: string, step: 'choose' | 'confirm' | 'done', preview: 'idle' | 'loading' | 'ready' | 'empty' | 'error', typed: 'name' | 'count', form: Form, done: { count: number, bytes: number } | null, narrow?: boolean }} Clean */

/** What has to be typed. @param {Clean} c @param {Kind} k @param {ReturnType<typeof preview>} p */
export const phrase = (c, k, p) => (c.typed === 'count' ? num(p.count) : k.label);

/** @param {string} uid @param {Kind} k @param {Filter} f @param {any} v */
function filterControl(uid, k, f, v) {
    const id = `${uid}-f-${f.id}`;
    if (f.type === 'choice') {
        const multi = Boolean(f.multi);
        const items = (f.options ?? [])
            .map(([val, label]) => {
                const on = multi ? v.includes(val) : v === val;
                return `<button type="button" class="kp-segmented__item" data-value="${val}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${on}"><span class="kp-segmented__label">${esc(label)}</span></button>`;
            })
            .join('');
        return `<div class="kp-segmented${multi ? ' kp-segmented--chips' : ''}" data-kp-segmented="${multi ? 'multi' : 'single'}" data-st-filter="${f.id}" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="${id}-l">${items}</div>`;
    }
    if (f.type === 'select')
        return `<select class="kp-field__input" id="${id}" data-st-filter="${f.id}">${(f.options ?? []).map(([val, label]) => `<option value="${val}"${v === val ? ' selected' : ''}>${esc(label)}</option>`).join('')}</select>`;
    if (f.type === 'flag')
        return `<label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" id="${id}" data-st-filter="${f.id}"${v ? ' checked' : ''} /><span class="kp-switch__state" aria-hidden="true"></span><span class="kp-sr-only">${esc(f.label)}</span></label>`;
    return `<input class="kp-field__input" type="text" id="${id}" data-st-filter="${f.id}" value="${esc(v)}" autocomplete="off" />`;
}

/** The filters card: older than, then the kind's own declared filters, then the two buttons. @param {string} uid @param {Kind} k @param {Clean} c */
function filtersCard(uid, k, c) {
    const locked = c.step !== 'choose';
    const rows = k.filters
        .map(
            (f) =>
                `<div class="kp-formgrid__row"><label class="kp-formgrid__label" id="${uid}-f-${f.id}-l" for="${uid}-f-${f.id}">${esc(f.label)}</label><div class="kp-formgrid__control">${filterControl(uid, k, f, c.form.values[f.id])}</div><p class="kp-formgrid__value">${esc(f.note)}</p></div>`,
        )
        .join('');
    const none = k.filters.length
        ? ''
        : `<p class="kp-dialog__note st-nofilters" data-kp-formgrid-span="all">${esc(k.label)} declares no other filter: only the date decides.</p>`;
    return `<section class="kp-card st-clean__filters" aria-labelledby="${uid}-h-filters">
      <div class="ck-card__head"><h3 class="kp-dialog__heading" id="${uid}-h-filters">1 · Choose what to remove</h3><p class="kp-lede" data-kp-lede-measure="full">Only rows that match every choice are counted. Leave a choice on Any to ignore it.</p></div>
      <fieldset class="kp-formgrid st-form" data-kp-formgrid-stack="auto"${locked ? ' disabled' : ''}><legend class="kp-sr-only">What to remove</legend>
        <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="${uid}-older">Older than</label>
          <div class="kp-formgrid__control kp-formgrid__short"><div class="kp-datepicker" data-kp-datepicker lang="en-GB" data-kp-date-format="rule52"><input class="kp-field__input" id="${uid}-older" type="text" inputmode="numeric" data-kp-date-input data-st-older value="${esc(c.form.older)}" /><button type="button" class="kp-button" data-kp-date-open aria-label="Open the calendar"><span aria-hidden="true">▦</span></button><div class="kp-datepicker__panel" data-kp-date-panel hidden></div></div></div>
          <p class="kp-formgrid__value">Rows from before this day. Dates are dd/mm/yyyy.</p></div>
        ${rows}${none}
        <div class="kp-formgrid__row kp-formgrid__row--buttons"><div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button type="button" class="kp-button" data-st-reset>Reset choices</button><button type="button" class="kp-button kp-button--primary" data-st-preview>Preview</button></div></div></div>
      </fieldset></section>`;
}

/** The preview card in its five states. @param {string} uid @param {Kind} k @param {Clean} c */
function previewCard(uid, k, c) {
    const p = preview(k, c.form);
    const done = c.step === 'done' && c.done;
    const asked = done ? 'ready' : c.step === 'confirm' ? (p.count ? 'ready' : 'empty') : c.preview === 'ready' && !p.count ? 'empty' : c.preview;
    const state = asked === 'idle' ? 'empty' : asked;
    const figure = (/** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ note) =>
        `<div class="kp-kpi"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${value}</span><span class="kp-kpi__trend">${note}</span></div>`;
    let data = '';
    if (done) {
        const d = done;
        data = `<div class="kp-kpis st-prev__kpis" role="group" aria-label="What was removed" data-kp-kpis-columns="all 2">${figure('Removed', plural(d.count, 'row', 'rows'), `from ${esc(k.label)}`)}${figure('Now empty space', size(d.bytes), 'inside the file, until it is compacted')}</div>
        <div class="kp-attention st-prev__note" data-st-band><div class="kp-alert kp-alert--success kp-attention__item" role="status"><span class="kp-attention__icon" aria-hidden="true">✓</span><div class="kp-attention__text"><strong>${plural(d.count, 'row', 'rows')} removed from ${esc(k.label)}</strong><span>The file keeps its size until you compact it, so the budget reading does not drop yet.</span><span><b>What now:</b> Compact the application data to give ${size(d.bytes)} back.</span></div><div class="kp-attention__actions"><button type="button" class="kp-button" data-st-compact>Compact…</button></div></div></div>`;
    } else if (p.count) {
        const table = `<div class="kp-datatable st-prev__table" data-kp-datatable${c.narrow ? ' data-kp-cards' : ''} data-kp-page-size="5"><div class="kp-table-wrap"><table class="kp-table"><caption>The ${p.rows.length === 1 ? 'row' : p.rows.length + ' oldest rows'} that match, of ${plural(p.count, 'row', 'rows')}</caption>
          <thead><tr>${k.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${p.rows.map((r) => `<tr>${r.map((cell, i) => `<td data-label="${esc(k.head[i])}"${i === 0 ? ' class="kp-timestamp"' : ''}>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
        data = `<div class="kp-kpis st-prev__kpis" role="group" aria-label="What would be removed" data-kp-kpis-columns="all 4 2">${figure('To remove', num(p.count), k.unit)}${figure('Frees about', size(p.bytes), 'inside the file')}${figure('Oldest', `<span class="st-when">${fmt(/** @type {number} */ (p.oldest))}</span>`, 'of the rows to go')}${figure('Newest', `<span class="st-when">${fmt(/** @type {number} */ (p.newest))}</span>`, 'of the rows to go')}</div>${table}`;
    }
    const lede = done ? 'Done. This is what was removed.' : 'A read-only count. Nothing is deleted before you confirm.';
    return `<section class="kp-card st-clean__preview" data-kp-state="${state}" data-st-card="preview" data-st-pstate="${asked}" aria-labelledby="${uid}-h-prev">
      <div class="ck-card__head"><h3 class="kp-dialog__heading" id="${uid}-h-prev">${done ? '3 · Removed' : '2 · What would be removed'}</h3><p class="kp-lede" data-kp-lede-measure="full">${lede}</p></div>
      <div class="kp-card__stage"><div class="kp-card__data">${data}</div></div></section>`;
}

/** The confirm band: the same three tracks in every step, so the dialog never changes size. @param {string} uid @param {Kind} k @param {Clean} c */
function confirmBand(uid, k, c) {
    const p = preview(k, c.form);
    const ready = p.count > 0 && (c.preview === 'ready' || c.step !== 'choose');
    const word = phrase(c, k, p);
    const what = c.typed === 'count' ? 'the number of rows' : 'the name of the kind';
    if (c.step === 'done')
        return `<section class="st-clean__confirm st-clean__confirm--done" aria-label="Finished"><div class="st-clean__confirm-words"><h3 class="kp-dialog__heading">Finished</h3><p class="kp-dialog__note">The lists and the budget have been read again.</p></div><div class="st-clean__confirm-body"></div><div class="st-clean__confirm-acts"><button type="button" class="kp-button kp-button--primary" data-kp-dialog-close>Done</button></div></section>`;
    if (c.step === 'confirm')
        return `<section class="st-clean__confirm kp-dialog__section--danger" aria-labelledby="${uid}-h-confirm">
      <div class="st-clean__confirm-words"><h3 class="kp-dialog__heading" id="${uid}-h-confirm">Delete for good</h3><p class="kp-dialog__note">Type ${esc(what)} to confirm; the field below shows exactly what. This cannot be undone.</p></div>
      <div class="st-clean__confirm-body"><div data-kp-type-confirm="${esc(word)}" data-kp-type-confirm-for="${uid}-delete" data-kp-type-confirm-loses="${uid}-lost"></div>
        <template id="${uid}-lost"><ul class="kp-type-confirm__list"><li>${plural(p.count, 'row', 'rows')} of ${esc(k.label)}, from ${fmt(/** @type {number} */ (p.oldest))} to ${fmt(/** @type {number} */ (p.newest))} (about ${size(p.bytes)})</li><li>Nothing else: the other kinds and the sign-in data stay.</li></ul></template></div>
      <div class="st-clean__confirm-acts"><button type="button" class="kp-button" data-st-back>Back</button>${flashButton('Delete for good', { kind: 'destructive', words: 'Deleted,Refused', attrs: `id="${uid}-delete" data-st-delete` })}</div></section>`;
    const reason = !ready
        ? c.preview === 'idle'
            ? 'Press Preview first: you see what would go before you decide.'
            : c.preview === 'loading'
              ? 'Counting the rows…'
              : c.preview === 'error'
                ? 'The preview failed, so there is nothing to confirm yet.'
                : 'Nothing matches, so there is nothing to delete.'
        : `Next you type ${what}.`;
    return `<section class="st-clean__confirm" aria-labelledby="${uid}-h-confirm">
      <div class="st-clean__confirm-words"><h3 class="kp-dialog__heading" id="${uid}-h-confirm">Delete for good</h3><p class="kp-dialog__note">Step 2 asks you to type before anything is removed.</p></div>
      <div class="st-clean__confirm-body"><p class="kp-dialog__note" id="${uid}-why">${esc(reason)}</p></div>
      <div class="st-clean__confirm-acts"><button type="button" class="kp-button kp-button--primary" data-st-continue${ready ? '' : ` disabled aria-describedby="${uid}-why"`}>Continue to confirm</button></div></section>`;
}

/** The inside of the clean-up dialog. @param {string} uid @param {Clean} c */
export function cleanupInner(uid, c) {
    const k = kindById(c.kind);
    const step = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string} */ note, /** @type {string} */ state) =>
        `<li class="kp-steplist__item" data-state="${state}" data-kp-step-id="${id}"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">${title}</span><span class="kp-steplist__note">${note}</span></span></li>`;
    const s1 = c.step === 'choose' ? 'current' : 'done';
    const s2 = c.step === 'choose' ? 'pending' : c.step === 'confirm' ? 'current' : 'done';
    const s3 = c.step === 'done' ? 'done' : 'pending';
    return `<div class="kp-dialog__body ck-frame"><div class="ck-grid st-clean__grid">
    <div class="kp-dialog__head st-clean__head"><h2 class="kp-dialog__title" id="${uid}-title">Clean up ${esc(k.label)}</h2><p class="kp-dialog__description">${esc(k.about)} Now ${plural(k.rows, 'row', 'rows')}${k.unit === 'rows' ? '' : ` (${k.unit})`}, ${size(k.bytes)}.</p></div>
    <ol class="kp-steplist kp-steplist--journey st-clean__steps" aria-label="Steps">${step('choose', 'Choose and preview', 'Nothing is deleted yet', s1)}${step('confirm', 'Confirm', 'Type to confirm', s2)}${step('done', 'Removed', 'The lists update', s3)}</ol>
    ${filtersCard(uid, k, c)}${previewCard(uid, k, c)}${confirmBand(uid, k, c)}
  </div></div>
  <div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Close</button></div>`;
}

/** @param {string} uid @param {Clean} c @param {boolean} open */
export function cleanupDialog(uid, c, open = true) {
    return `<dialog class="kp-dialog kp-dialog--wide ck-dlg st-clean" id="${uid}-dialog" aria-labelledby="${uid}-title"${open ? ' open' : ''}>${cleanupInner(uid, c)}</dialog>`;
}

/* ------------------------------------------------------------------------------------------- the compact dialog -- */

/** @typedef {{ state: 'ready' | 'none' | 'running' | 'done' | 'failed', freed: number }} Compact */

/** @param {string} uid @param {Compact} c */
export function compactInner(uid, c) {
    const s = store.current;
    const t = totals(s);
    const none = c.state === 'none';
    const done = c.state === 'done';
    const gain = none ? 0 : done ? c.freed || 1_600_000 : t.free || 1_600_000;
    const before = done ? t.app + gain : t.app;
    const after = before - gain;
    const totalNow = done ? t.total + gain : t.total;
    const totalAfter = none ? t.total : done ? t.total : t.total - gain - t.wal;
    const fig = (/** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ note) =>
        `<div class="kp-kpi"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value">${value}</span><span class="kp-kpi__trend">${note}</span></div>`;
    const meter = (/** @type {string} */ label, /** @type {number} */ bytes) =>
        `<span class="kp-meter" role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round((bytes / BUDGET) * 100)}" aria-valuetext="${size(bytes)} of ${size(BUDGET)}" style="--kp-value: ${(bytes / BUDGET).toFixed(4)}; --kp-mark: ${WARN / BUDGET}"><span class="kp-meter__mark" aria-hidden="true"></span></span>`;
    const step = (/** @type {string} */ id, /** @type {string} */ title, /** @type {string} */ note, /** @type {string} */ state) =>
        `<li class="kp-steplist__item" data-state="${state}" data-kp-step-id="${id}"><span class="kp-steplist__mark" aria-hidden="true"></span><span class="kp-steplist__body"><span class="kp-steplist__title">${title}</span><span class="kp-steplist__note">${note}</span></span></li>`;
    const st =
        c.state === 'running' ? ['done', 'running', 'pending'] : c.state === 'done' ? ['done', 'done', 'done'] : ['pending', 'pending', 'pending'];
    const run = c.state === 'running' || c.state === 'done';
    const steps = `<ol class="kp-steplist" aria-label="What happens">${step('pause', 'Writes pause', 'For a few seconds; reading carries on', st[0])}${step('rewrite', 'The file is rewritten', 'Without the empty space deleted rows left', st[1])}${step('resume', 'Writes resume', 'The budget reading is updated', st[2])}</ol>`;
    const primary =
        c.state === 'done'
            ? `<button type="button" class="kp-button kp-button--primary" data-kp-dialog-close>Done</button>`
            : `<button type="button" class="kp-button" data-kp-dialog-close${c.state === 'running' ? ' disabled' : ''}>Cancel</button>${flashButton('Compact now', { kind: 'primary', words: 'Compacted,Failed', attrs: `data-st-run${none || c.state === 'running' ? ' disabled' : ''}${none ? ` aria-describedby="${uid}-why"` : ''}` })}`;
    const note = none
        ? 'There is no empty space to give back, so compacting would change nothing.'
        : c.state === 'done'
          ? `Done: ${size(gain)} given back. The file is ${size(after)} now.`
          : 'It never runs by itself. The sign-in data is not touched, and nothing is removed.';
    return `<div class="kp-dialog__body ck-frame"><div class="ck-grid st-compact__grid">
    <div class="kp-dialog__head st-compact__head"><h2 class="kp-dialog__title" id="${uid}-title">Compact the application data</h2><p class="kp-dialog__description">Deleted rows leave empty space inside the file. Compacting rewrites it without that space.</p></div>
    <div class="kp-kpis st-compact__kpis" role="group" aria-label="Before and after" data-kp-kpis-columns="all 3 1">${fig('Now', size(before), 'application data')}${fig('Can be given back', size(gain), none ? 'no empty space' : 'empty space')}${fig('After', size(after), 'about')}</div>
    <section class="kp-card st-compact__steps" data-kp-state="${c.state === 'failed' ? 'error' : 'ready'}" data-st-card="steps" aria-labelledby="${uid}-h-steps"><div class="ck-card__head"><h3 class="kp-dialog__heading" id="${uid}-h-steps">What happens</h3><p class="kp-lede" data-kp-lede-measure="full">${run ? 'In progress; you can leave this open.' : 'Three steps, a few seconds in all.'}</p></div>
      <div class="kp-card__stage"><div class="kp-card__data">${steps}</div></div></section>
    <section class="kp-card st-compact__meters" aria-labelledby="${uid}-h-meters"><div class="ck-card__head"><h3 class="kp-dialog__heading" id="${uid}-h-meters">Against the budget</h3><p class="kp-lede" data-kp-lede-measure="full">All storage, with the tick at the ${size(WARN)} warning level.</p></div>
      <div class="kp-formgrid st-meters" data-kp-formgrid-label="fit"><div class="kp-formgrid__row"><span class="kp-formgrid__label">Now</span><div class="kp-formgrid__control">${meter('All storage now', totalNow)}</div><p class="kp-formgrid__value"><strong>${size(totalNow)}</strong></p></div>
        <div class="kp-formgrid__row"><span class="kp-formgrid__label">After</span><div class="kp-formgrid__control">${meter('All storage after compacting', totalAfter)}</div><p class="kp-formgrid__value"><strong>${size(totalAfter)}</strong></p></div></div></section>
    <section class="st-compact__foot"><p class="kp-dialog__note" id="${uid}-why">${esc(note)}</p><div class="st-compact__acts">${primary}</div></section>
  </div></div>`;
}

/** @param {string} uid @param {Compact} c @param {boolean} open */
export function compactDialog(uid, c, open = true) {
    return `<dialog class="kp-dialog kp-dialog--wide ck-dlg st-compact" id="${uid}-dialog" aria-labelledby="${uid}-title"${open ? ' open' : ''}>${compactInner(uid, c)}</dialog>`;
}
