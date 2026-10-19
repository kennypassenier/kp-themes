// research/app-homelab-backups: the page's own wiring. The components are the package's (js/auto.js attaches them); this
// file only makes up the sample data (mock), feeds it to them, presses their states and writes what they fire into a readout.
// Every section runs only when it is on the page: a lane of the review dialog holds one section.

import { setHeat, setHeatPick, HEAT_PICK_EVENT, HEAT_ROW_EVENT, HEAT_PAGE_EVENT } from '../../js/heat.js';
import { setKeys } from '../../js/keys.js';
import { setAgo } from '../../js/freshness.js';

/** @param {string} sel @param {ParentNode} [root] */
const $ = (sel, root = document) => /** @type {HTMLElement} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
const has = (/** @type {string} */ id) => document.getElementById(id) !== null;

// ── the sample data (mock) ─────────────────────────────────────────────────────────────────────────────────────
const NOW = Date.parse('2026-10-19T14:05:00+02:00');
const TODAY = '2026-10-19';
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** @param {string} iso @param {number} n */
const addDays = (iso, n) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
/** @param {string} iso */
const dmy = (iso) => `${iso.slice(8)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
/** @param {string} iso */
const dm = (iso) => `${iso.slice(8)}/${iso.slice(5, 7)}`;
/** @param {string} iso */
const weekday = (iso) => WEEKDAY[new Date(`${iso}T12:00:00Z`).getUTCDay()] ?? '';
/** @param {string} iso @returns {number} nights back from today */
const backOf = (iso) => Math.round((Date.parse(`${TODAY}T12:00:00Z`) - Date.parse(`${iso}T12:00:00Z`)) / 864e5);
/** @param {number} n */
const pad = (n) => String(n).padStart(2, '0');
/** @param {number} n exact, with a thousands separator */
const count = (n) => n.toLocaleString('en-GB');
/** @param {number} gb */
const gbText = (gb) => `${gb.toFixed(1)} GB`;

/** @typedef {'passed' | 'failed' | 'never'} Drill */
/** @type {{ key: string, ct: number, order: number, born: number, keeps: boolean, apps: [string, number, Drill][] }[]} */
const STACKS = [
    {
        key: 'jellyfin',
        ct: 106,
        order: 0,
        born: 999,
        keeps: true,
        apps: [
            ['jellyfin', 38.2, 'passed'],
            ['jellyseerr', 0.6, 'passed'],
        ],
    },
    {
        key: 'immich',
        ct: 110,
        order: 1,
        born: 999,
        keeps: true,
        apps: [
            ['immich', 71.9, 'passed'],
            ['postgres', 3.4, 'never'],
        ],
    },
    {
        key: 'paperless',
        ct: 111,
        order: 2,
        born: 999,
        keeps: true,
        apps: [
            ['paperless', 12.4, 'passed'],
            ['postgres', 1.8, 'passed'],
        ],
    },
    { key: 'vaultwarden', ct: 107, order: 3, born: 999, keeps: true, apps: [['vaultwarden', 0.3, 'passed']] },
    { key: 'traefik', ct: 104, order: 4, born: 999, keeps: true, apps: [['traefik', 0.2, 'passed']] },
    { key: 'prometheus', ct: 113, order: 5, born: 999, keeps: true, apps: [['prometheus', 18.6, 'passed']] },
    { key: 'grafana', ct: 113, order: 6, born: 21, keeps: true, apps: [['grafana', 0.9, 'never']] },
    { key: 'loki', ct: 113, order: 7, born: 999, keeps: true, apps: [['loki', 9.7, 'failed']] },
    { key: 'kyu', ct: 109, order: 8, born: 999, keeps: true, apps: [['kyu', 0.4, 'passed']] },
    { key: 'almanac', ct: 112, order: 9, born: 999, keeps: true, apps: [['almanac', 0.1, 'never']] },
    { key: 'syncthing', ct: 108, order: 10, born: 999, keeps: false, apps: [] },
    {
        key: 'inbox',
        ct: 118,
        order: 11,
        born: 999,
        keeps: true,
        apps: [
            ['inbox', 0.7, 'passed'],
            ['mail-archive', 6.3, 'never'],
        ],
    },
    { key: 'admin', ct: 120, order: 12, born: 9, keeps: true, apps: [['admin', 0.2, 'passed']] },
];
const STACK = new Map(STACKS.map((s) => [s.key, s]));
const KEEPING = STACKS.filter((s) => s.keeps);

/** @type {Record<string, string>} key `stack:nights back` to the reason it was missed */
const MISSES = {
    'loki:5': 'the backup disk was full',
    'inbox:1': 'disk quota exceeded',
    'inbox:2': 'disk quota exceeded',
    'almanac:7': 'the container was restarting',
    'vaultwarden:20': 'the backup target was unreachable',
};
/** Nights a person repaired in this page, `stack:iso`. @type {Set<string>} */
const repaired = new Set();

/** Stacks ranked by size, the order the share bar draws them in (and their palette slot). */
const BY_SIZE = KEEPING.filter((s) => s.apps.length > 0)
    .map((s) => ({ key: s.key, gb: s.apps.reduce((a, x) => a + x[1], 0) }))
    .sort((a, b) => b.gb - a.gb);
const SLOT = new Map(BY_SIZE.map((s, i) => [s.key, `var(--chart-${(i % 5) + 1})`]));
const markOf = (/** @type {string} */ key) => SLOT.get(key) ?? 'var(--muted-foreground)';

/**
 * The minute after 03:00 a stack's round starts on a night: stacks go in turn, and the last ones drift later each night
 * over the last ten as the first ones take longer.
 * @param {typeof STACKS[number]} s @param {number} back
 */
const slotMinutes = (s, back) => s.order * 2 + (s.order >= 8 && back < 10 ? Math.round((10 - back) * 2.4) : 0);

/**
 * What a stack did on one night.
 * @param {typeof STACKS[number]} s @param {string} iso
 * @returns {{ state: 'ok' | 'bad' | 'before' | 'none' | 'future', times: string[], reason?: string, minute?: number }}
 */
function nightOf(s, iso) {
    const back = backOf(iso);
    if (back < 0) return { state: 'future', times: [] };
    if (!s.keeps) return { state: 'none', times: [] };
    if (back > s.born) return { state: 'before', times: [] };
    const miss = MISSES[`${s.key}:${back}`];
    if (miss !== undefined && !repaired.has(`${s.key}:${iso}`)) return { state: 'bad', times: [], reason: miss };
    const minute = slotMinutes(s, back);
    return { state: 'ok', minute, times: s.apps.map((_, i) => `03:${pad(minute + i)}`) };
}

/** The fleet on one night: how many of the stacks that keep data were backed up. @param {string} iso */
function fleetOf(iso) {
    let ok = 0;
    let live = 0;
    const missed = [];
    for (const s of STACKS) {
        const n = nightOf(s, iso);
        if (n.state === 'ok') {
            ok++;
            live++;
        } else if (n.state === 'bad') {
            live++;
            missed.push({ stack: s.key, reason: n.reason ?? '' });
        }
    }
    return { ok, live, missed };
}

/** A pseudo-random id from two strings, eight hex digits. @param {string} a @param {string} b */
function shortId(a, b) {
    let x = 2166136261;
    for (const c of `${a}|${b}`) x = Math.imul(x ^ c.charCodeAt(0), 16777619) >>> 0;
    return x.toString(16).padStart(8, '0');
}

/** @param {string[]} keys @param {number} n nights ending today */
const nightsEnding = (n, offset = 0) => Array.from({ length: n }, (_, i) => addDays(TODAY, -(n - 1 - i) - offset));

// ── the heat grid, as both the grid and the month section draw it ─────────────────────────────────────────────────
/** @param {typeof STACKS[number]} s @param {string} iso */
function heatCell(s, iso) {
    return { ...heatCellBase(s, iso), aria: `${s.key}, ${dmy(iso)}: ${heatCellBase(s, iso).label}` };
}

/** @param {typeof STACKS[number]} s @param {string} iso */
function heatCellBase(s, iso) {
    const n = nightOf(s, iso);
    const when = dmy(iso);
    if (n.state === 'future') return { tone: /** @type {const} */ ('future'), label: 'not run yet', tip: `${when}: this night has not run yet.` };
    if (n.state === 'none')
        return {
            tone: /** @type {const} */ ('none'),
            label: 'keeps no data by design',
            tip: `${s.key} keeps no data by design: its files live on the devices it syncs.`,
        };
    if (n.state === 'before')
        return {
            tone: /** @type {const} */ ('before'),
            label: 'before any history',
            tip: `${s.key} · ${when}: before this stack had any backup history.`,
        };
    if (n.state === 'bad') return { tone: /** @type {const} */ ('bad'), label: 'missed', tip: `${s.key} · ${when}: no snapshot, ${n.reason}.` };
    return {
        tone: /** @type {const} */ ('ok'),
        label: 'backed up',
        tip: `${s.key} · ${when}: snapshot at ${n.times.join(' and ')}.`,
    };
}

/**
 * @param {string[]} nights oldest first
 * @param {{ weekend: 'quiet' | 'plain', every?: number, state?: 'ready' | 'loading' | 'empty' | 'error', message?: string, label: string }} options
 * @returns {import('../../js/heat.js').HeatSpec}
 */
function heatSpec(nights, { weekend, every, state = 'ready', message, label }) {
    const gap = every ?? 3;
    // The package names one column in `every` and the last; a column set `minor` keeps its place but carries no number.
    const columns = nights.map((iso, i) => {
        const named =
            (i % gap === 0 || i === nights.length - 1) &&
            !(weekend === 'quiet' && i !== nights.length - 1 && [0, 6].includes(new Date(`${iso}T12:00:00Z`).getUTCDay()));
        // An unnamed column carries no text at all (each cell still has its full accessible name).
        return { key: iso, label: named ? String(Number(iso.slice(8))) : '', minor: !named };
    });
    const rows = STACKS.map((s) => ({
        key: s.key,
        label: s.key,
        mark: markOf(s.key),
        muted: !s.keeps,
        cells: nights.map((iso) => heatCell(s, iso)),
    }));
    const summary = {
        key: 'fleet',
        label: 'Whole fleet',
        cells: nights.map((iso) => {
            const back = backOf(iso);
            if (back < 0) return { tone: /** @type {const} */ ('future'), label: 'not run yet' };
            const { ok, live } = fleetOf(iso);
            if (live === 0) return { tone: /** @type {const} */ ('before'), label: 'before any backup history' };
            return {
                tone: /** @type {'ok' | 'warn' | 'bad'} */ (ok === live ? 'ok' : ok === 0 ? 'bad' : 'warn'),
                share: ok / live,
                label: `${ok} of ${live} stacks backed up`,
                tip: `${dmy(iso)}: ${ok} of ${live} stacks backed up. Press to pin this night.`,
            };
        }),
    };
    return {
        columns,
        summary,
        rows,
        label,
        toggle: true,
        every,
        state,
        message,
        skeleton: { rows: STACKS.length, columns: nights.length },
    };
}

/** The sentence under a pinned night. @param {string} iso */
function nightSentence(iso) {
    const { ok, live, missed } = fleetOf(iso);
    if (backOf(iso) < 0) return `${dmy(iso)} has not run yet.`;
    if (live === 0) return `${dmy(iso)}: before any backup history.`;
    if (missed.length === 0) return `${dmy(iso)} pinned: ${ok} of ${live} stacks backed up, every stack that keeps data.`;
    return `${dmy(iso)} pinned: ${ok} of ${live} stacks backed up. Missed: ${missed.map((m) => `${m.stack} (${m.reason})`).join(', ')}.`;
}

/** Heat grids and lists that must repaint when a night is repaired. @type {Set<() => void>} */
const repaints = new Set();
/** @param {string} stack @param {string} iso */
function repair(stack, iso) {
    repaired.add(`${stack}:${iso}`);
    for (const run of repaints) run();
}

/** Press one state button of a group: exactly one stays pressed. @param {string} attribute @param {(value: string) => void} apply */
function stateButtons(attribute, apply) {
    const buttons = $$(`[${attribute}]`);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
    return (/** @type {string} */ value) => {
        for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
    };
}

/** The review kit tells a section which option Kenny ticked: follow it. @param {string} id @param {(value: string) => void} apply */
function onChoice(id, apply) {
    document.addEventListener(
        'review:choice',
        (e) => {
            const d = /** @type {CustomEvent} */ (e).detail;
            if (d?.id === id) apply(String(d.value));
        },
        true,
    );
}

// ── the repositories table is built before js/auto.js attaches the components, so it attaches the table itself ──────
/**
 * All the repositories, with the snapshots they hold (the last 45 nights).
 * @typedef {{ key: string, stack: string, app: string, gb: number, drill: Drill, snaps: { id: string, iso: string, time: string, ms: number, gb: number }[] }} Repo
 * @type {Repo[]}
 */
const REPOS = KEEPING.flatMap((s) =>
    s.apps.map(([app, gb, drill], i) => {
        const snaps = [];
        for (let back = 0; back < 45; back++) {
            const iso = addDays(TODAY, -back);
            const n = nightOf(s, iso);
            if (n.state !== 'ok') continue;
            const minute = (n.minute ?? 0) + i;
            const time = `03:${pad(minute)}`;
            snaps.push({
                id: shortId(`${s.key}/${app}`, iso),
                iso,
                time,
                ms: Date.parse(`${iso}T${time}:04+02:00`),
                gb: Math.round(gb * (0.97 + (parseInt(shortId(app, iso).slice(0, 2), 16) / 255) * 0.06) * 10) / 10,
            });
        }
        return { key: `${s.key}--${app}`, stack: s.key, app, gb, drill, snaps };
    }),
);
const REPO_GB = REPOS.reduce((a, r) => a + r.gb, 0);
const DISK_GB = 500;
const MAX_GB = Math.max(...REPOS.map((r) => r.gb));
const DRILL_WORDS = { failed: 'failed', never: 'never drilled', passed: 'passed' };
const DRILL_TONE = { failed: 'destructive', never: 'warning', passed: 'success' };

/** @param {Repo} r */
function repoUptime(r) {
    const nights = nightsEnding(7);
    const s = /** @type {typeof STACKS[number]} */ (STACK.get(r.stack));
    return nights.map((iso) => {
        const n = nightOf(s, iso);
        const when = dmy(iso);
        if (n.state === 'ok') {
            const snap = r.snaps.find((x) => x.iso === iso);
            return { key: iso, label: when, state: /** @type {const} */ ('up'), tip: `${when}: snapshot ${snap?.time ?? ''}, ${snap?.id ?? ''}` };
        }
        if (n.state === 'bad') return { key: iso, label: when, state: /** @type {const} */ ('down'), tip: `${when}: missed, ${n.reason}` };
        return { key: iso, label: when, state: /** @type {const} */ ('none'), tip: `${when}: no history` };
    });
}

/** @param {'ready' | 'empty'} [kind] */
function tableMarkup(kind = 'ready') {
    const rows = kind === 'empty' ? [] : REPOS;
    const groups = KEEPING.filter((s) => s.apps.length > 0);
    const body = groups
        .map((s) => {
            const mine = rows.filter((r) => r.stack === s.key);
            if (mine.length === 0) return '';
            const head = `<tr data-kp-row-group="${s.key}">
                <th scope="rowgroup" colspan="8"><span class="hb-group">
                    <span class="kp-idmark kp-idmark--pattern" data-kp-idmark="${s.key}" aria-hidden="true"></span>
                    <span class="hb-group__name">${s.key}</span><span class="hb-group__ct">CT ${s.ct}</span>
                    <span class="kp-badge" data-kp-group-count></span><span class="hb-group__grow"></span>
                    <button type="button" class="kp-button kp-button--sm" data-hb-group-restore="${s.key}">Restore…</button>
                </span></th></tr>`;
            const lines = mine
                .map(
                    (r) => `<tr data-kp-row-key="${r.key}" data-kp-group-of="${s.key}">
                    <td data-label="Select"><input class="kp-field__check" type="checkbox" data-kp-select-row aria-label="Select ${r.stack} ${r.app}" /></td>
                    <td data-label="Repository"><code class="kp-mono">${r.app}</code></td>
                    <td data-label="Stack">${r.stack}</td>
                    <td data-label="Last 7 nights" data-kp-sort-value="${repoUptime(r).filter((p) => p.state === 'up').length}"><div class="kp-uptime" data-kp-uptime data-kp-uptime-count="7" data-hb-uptime="${r.key}"></div></td>
                    <td data-label="Snapshots" class="kp-text-end kp-numeric">${count(r.snaps.length)}</td>
                    <td data-label="Size" data-kp-sort-value="${r.gb}"><span class="kp-bar-cell" data-hb-size="${r.key}"></span></td>
                    <td data-label="Restore drill"><span class="kp-badge kp-badge--${DRILL_TONE[r.drill]}" data-hb-drill>${DRILL_WORDS[r.drill]}</span></td>
                    <td data-label="Actions"><div class="kp-row-actions">
                        <button type="button" class="kp-button kp-button--sm" data-kp-action="restore" data-hb-restore="${r.key}">Restore…</button>
                    </div></td></tr>`,
                )
                .join('');
            return head + lines;
        })
        .join('');
    return `<div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-expandable data-kp-page-size="50" data-kp-page-sizes="none"
            data-kp-max-height="38rem" data-kp-sort-multi data-kp-remember="hb-repos" data-kp-busy-overlay id="hb-repo-table">
        <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search placeholder="Search the repositories" aria-label="Search the repositories" /></div>
        <div class="kp-alert kp-alert--destructive" data-kp-datatable-failed role="alert" hidden>
            <p class="kp-alert__label">The repositories could not be read</p>
            <p data-kp-datatable-failed-reason></p>
            <button type="button" class="kp-button" data-kp-datatable-retry>Try again</button>
        </div>
        <div class="kp-table-wrap"><table class="kp-table">
            <caption class="kp-sr-only">Backup repositories, grouped by stack</caption>
            <thead><tr>
                <th scope="col"><input class="kp-field__check" type="checkbox" data-kp-select-all aria-label="Select all repositories" /></th>
                <th scope="col" data-kp-sort="text">Repository</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice">Stack</th>
                <th scope="col" data-kp-sort="number">Last 7 nights</th>
                <th scope="col" data-kp-sort="number" class="kp-text-end">Snapshots</th>
                <th scope="col" data-kp-sort="number">Size</th>
                <th scope="col" data-kp-sort="text" data-kp-filter="choice" data-kp-sort-order="failed,never drilled,passed">Restore drill</th>
                <th scope="col">Actions</th>
            </tr></thead>
            <tbody>${body}</tbody>
        </table></div>
        <div class="kp-empty" data-kp-datatable-empty hidden>
            <div data-kp-datatable-empty-none>
                <p class="kp-empty__title">No repositories yet</p>
                <p>The first nightly round creates one per app of every stack.</p>
            </div>
            <div data-kp-datatable-empty-nomatch hidden>
                <p class="kp-empty__title">No repository matches</p>
                <button type="button" class="kp-button kp-button--secondary" data-kp-datatable-clear>Clear the search and filters</button>
            </div>
        </div>
        <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
        <div class="kp-datatable__pager" data-kp-datatable-pager></div></div>
    </div>`;
}

const tableHost = document.querySelector('[data-hb-table]');
if (tableHost) tableHost.innerHTML = tableMarkup();

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

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 1. the coverage grid
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('grid-component')) {
    const grid = $('[data-hb-heat="grid"]');
    const NIGHTS = 30;
    let offset = 0;
    let weekend = /** @type {'quiet' | 'plain'} */ ('quiet');
    let state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready');
    /** @type {string | null} */
    let pinned = null;

    const paint = () => {
        const nights = nightsEnding(NIGHTS, offset);
        setHeat(
            grid,
            heatSpec(nights, {
                weekend,
                state,
                label: 'Backups per stack per night',
                message: state === 'error' ? 'The backup repositories could not be read. Nothing was changed.' : 'No stack has a backup history yet.',
            }),
        );
        if (pinned && nights.includes(pinned)) setHeatPick(grid, pinned);
        $('[data-hb-range]').textContent = `${dmy(/** @type {string} */ (nights[0]))} – ${dmy(/** @type {string} */ (nights[NIGHTS - 1]))}`;
        $('[data-hb-later]').toggleAttribute('disabled', offset === 0);
    };
    repaints.add(paint);
    paint();
    setAgo($('[data-hb-grid-ago]'), Date.now() - 150000);
    setKeys($('[data-hb-keys="grid"]'), [
        [['←', '→', '↑', '↓'], 'move'],
        ['Enter', 'pin the night'],
        [['Page Up', 'Page Down'], 'earlier or later'],
        ['Esc', 'unpin'],
    ]);

    grid.addEventListener(HEAT_PICK_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        pinned = d.picked ? d.colKey : null;
        $('[data-hb-grid-pin]').textContent = pinned ? nightSentence(pinned) : 'No night pinned. Press a cell to pin its night.';
    });
    grid.addEventListener(HEAT_ROW_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        $('[data-hb-grid-rows]').textContent = d.keys.length
            ? `Showing only: ${d.keys.join(', ')} (the page filters; the grid only reports).`
            : 'All stacks shown. Press a stack name to show only that one.';
    });
    const page = (/** @type {number} */ nights) => {
        offset = Math.max(0, offset + nights);
        paint();
    };
    grid.addEventListener(HEAT_PAGE_EVENT, (e) => page(/** @type {CustomEvent} */ (e).detail.direction === 'earlier' ? NIGHTS : -NIGHTS));
    $('[data-hb-earlier]').addEventListener('click', () => page(NIGHTS));
    $('[data-hb-later]').addEventListener('click', () => page(-NIGHTS));
    $('[data-hb-today]').addEventListener('click', () => {
        offset = 0;
        pinned = null;
        setHeatPick(grid, null);
        $('[data-hb-grid-pin]').textContent = 'No night pinned. Press a cell to pin its night.';
        paint();
    });
    stateButtons('data-hb-grid-data', (v) => {
        state = /** @type {typeof state} */ (v);
        paint();
    });
    const setWeekend = stateButtons('data-hb-weekend', (v) => {
        weekend = /** @type {typeof weekend} */ (v);
        paint();
    });
    onChoice('backups-weekend', (v) => {
        weekend = /** @type {typeof weekend} */ (v);
        setWeekend(v);
        paint();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 2. the repositories
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('repos-component')) {
    const { dataTable, EXPAND_EVENT, VIEW_EVENT } = await import('../../js/datatable.js');
    const { setUptime } = await import('../../js/uptime.js');
    const { setBarCell } = await import('../../js/barcell.js');
    const { setStackbar, STACKBAR_PICK_EVENT, STACKBAR_RETRY_EVENT } = await import('../../js/stackbar.js');
    const { setFacetItems, setFacetValues, getFacetValues, FACET_EVENT } = await import('../../js/facets.js');
    const { SELECTION_ACTION_EVENT, setSelectionBusy, setSelectionResult } = await import('../../js/selection-bar.js');
    const { datedAge } = await import('../../js/dated-options.js');
    const { attachActionColumns } = await import('../../js/actions.js');
    const { attachIdmarks } = await import('../../js/idmark.js');
    const { attachDataTables } = await import('../../js/datatable.js');
    const { attachRowSelect } = await import('../../js/row-select.js');
    const { attachUptimes } = await import('../../js/uptime.js');
    const { attachBarCells } = await import('../../js/barcell.js');
    const { attachSelectionBars } = await import('../../js/selection-bar.js');
    /** @type {HTMLElement} */
    let bar;

    /** Attach what the table carries, once: js/auto.js may have scanned the page before the table stood there. */
    const wireTable = () => {
        if (!dataTable($('[data-kp-datatable]', host))) {
            attachDataTables(host);
            attachRowSelect(host);
            attachUptimes(host);
            attachBarCells(host);
        }
        bar = mountBar();
    };

    const host = $('[data-hb-table]');
    const BAR_HTML = `<div class="kp-selection" data-kp-selection data-kp-selection-for="hb-repo-table" data-kp-placement="sticky-top" aria-label="Selected repositories" data-hb-selection>
        <div class="kp-selection__actions">
            <button type="button" class="kp-button" data-kp-selection-action="verify">Verify restore</button>
            <button type="button" class="kp-button" data-kp-selection-action="backup">Back up now</button>
        </div></div>`;
    const slot = $('[data-hb-bar-slot]');
    /** The bar is made again with the table, so it always reads the rows that stand there. */
    const mountBar = () => {
        slot.innerHTML = BAR_HTML;
        const fresh = $('[data-hb-selection]', slot);
        attachSelectionBars(slot);
        fresh.addEventListener(SELECTION_ACTION_EVENT, onAction);
        return fresh;
    };
    const facets = $('[data-hb-facets]');
    const stackbar = $('[data-hb-stackbar]');
    const log = $('[data-hb-repos-log]');
    const say = (/** @type {string} */ t) => (log.textContent = t);
    let outcome = 'done';
    let state = 'ready';
    /** @type {string[]} */
    let folded = [];
    // The open arrow of an expandable table is column 0, so Stack, the third cell, is column 3.
    const STACK_COLUMN = 3;
    const table = () => /** @type {import('../../js/datatable.js').DataTableHandle} */ (dataTable($('[data-kp-datatable]', host)));

    const shown = () => (state === 'empty' ? [] : REPOS);

    const paintBar = () => {
        const rows = shown();
        const parts = BY_SIZE.map((s) => ({
            key: s.key,
            label: s.key,
            value: rows.filter((r) => r.stack === s.key).reduce((a, r) => a + r.gb, 0),
            tip: `${s.key}: ${gbText(s.gb)} in ${rows.filter((r) => r.stack === s.key).length} repositories`,
        }));
        const sum = rows.reduce((a, r) => a + r.gb, 0);
        setStackbar(stackbar, {
            title: 'Backup disk, by stack',
            parts: state === 'empty' ? [] : parts,
            total: DISK_GB,
            restLabel: 'Free',
            format: gbText,
            summary: `${count(rows.length)} repositories, ${gbText(sum)} of ${DISK_GB} GB`,
            marks: [{ at: 0.8, label: '80 % full' }],
            state: /** @type {any} */ (state === 'ready' ? 'ready' : state),
            message: state === 'error' ? 'The backup disk could not be measured.' : 'Nothing is stored yet.',
            label: 'Backup disk by stack',
        });
        setFacetItems(
            facets,
            state === 'empty'
                ? []
                : BY_SIZE.map((s, i) => ({
                      value: s.key,
                      label: s.key,
                      count: rows.filter((r) => r.stack === s.key).length,
                      swatch: `var(--chart-${(i % 5) + 1})`,
                      pattern: s.key,
                  })),
        );
    };

    const paintCells = () => {
        for (const el of $$('[data-hb-uptime]', host)) {
            const r = REPOS.find((x) => x.key === el.getAttribute('data-hb-uptime'));
            if (r) setUptime(el, { periods: repoUptime(r), from: dm(addDays(TODAY, -6)), to: 'Today', count: 7, open: 'info' });
        }
        for (const el of $$('[data-hb-size]', host)) {
            const r = REPOS.find((x) => x.key === el.getAttribute('data-hb-size'));
            if (r)
                setBarCell(el, {
                    value: r.gb / MAX_GB,
                    text: gbText(r.gb),
                    sortValue: r.gb,
                    tone: null,
                    label: `of the biggest repository, ${gbText(MAX_GB)}`,
                });
        }
        attachIdmarks(host);
        attachActionColumns(host);
    };

    /** The rows of the snapshot list under a repository. @param {Repo} r */
    const snapshots = (r) => {
        const box = document.createElement('div');
        box.innerHTML = `<table class="kp-table hb-snaps"><caption class="kp-sr-only">Snapshots of ${r.stack} ${r.app}</caption>
            <thead><tr><th scope="col">Snapshot</th><th scope="col">Taken</th><th scope="col">Age</th><th scope="col" class="kp-text-end">Size</th><th scope="col">Action</th></tr></thead>
            <tbody>${r.snaps
                .slice(0, 6)
                .map(
                    (x) => `<tr><td><code class="kp-mono">${x.id}</code></td><td class="kp-numeric">${dmy(x.iso)} ${x.time}</td>
                    <td>${datedAge(x.ms, NOW)}</td><td class="kp-text-end kp-numeric">${gbText(x.gb)}</td>
                    <td><div class="kp-row-actions"><button type="button" class="kp-button kp-button--sm" data-kp-action="restore" data-hb-snap-restore="${x.id}" data-hb-repo="${r.key}">Restore…</button><button type="button" class="kp-button kp-button--sm kp-button--ghost" data-kp-action="file" data-hb-file="${r.key}">Show a file…</button></div></td></tr>`,
                )
                .join('')}</tbody></table>
            <p class="hb-readout">The 6 newest of ${count(r.snaps.length)} snapshots.</p>`;
        return box;
    };

    host.addEventListener(EXPAND_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (!d.open || !d.cell || d.cell.childElementCount > 0) return;
        const r = REPOS.find((x) => x.key === d.key);
        if (r) d.cell.append(snapshots(r));
    });

    const wire = () => {
        const dt = table();
        dt.element.addEventListener(VIEW_EVENT, () => {
            const f = dt.view().filters[STACK_COLUMN];
            setFacetValues(facets, Array.isArray(f) && f.length ? f : null);
        });
        if (folded.length) dt.fold(folded);
    };

    const rebuild = () => {
        host.innerHTML = tableMarkup(state === 'empty' ? 'empty' : 'ready');
        wireTable();
        paintCells();
        wire();
        applyState();
    };

    const applyState = () => {
        const dt = table();
        if (state === 'loading') {
            dt.busy({ text: 'Reading the repositories…', overlay: true });
            dt.state('loading');
        } else if (state === 'error') {
            dt.fail('The host did not answer within 10 s. Nothing was changed.');
        } else {
            dt.busy(null);
            dt.state('ready');
        }
        paintBar();
    };

    wireTable();
    paintCells();
    paintBar();
    wire();

    // The stack filter is one thing in three places: the bar, the list and the table's own filter.
    const filterStacks = (/** @type {string[]} */ keys) => {
        setFacetValues(facets, keys.length ? keys : null);
        table().filter(STACK_COLUMN, keys.length ? keys : null);
    };
    stackbar.addEventListener(STACKBAR_PICK_EVENT, (e) => {
        const key = /** @type {CustomEvent} */ (e).detail.key;
        const now = getFacetValues(facets);
        filterStacks(now.length === 1 && now[0] === key ? [] : [key]);
        say(`The bar pressed: ${key}. The table shows ${now.length === 1 && now[0] === key ? 'every stack again' : `only ${key}`}.`);
    });
    stackbar.addEventListener(STACKBAR_RETRY_EVENT, () => {
        state = 'ready';
        setState('ready');
        applyState();
    });
    facets.addEventListener(FACET_EVENT, () => {
        const values = getFacetValues(facets);
        const all = BY_SIZE.length;
        table().filter(STACK_COLUMN, values.length && values.length < all ? values : null);
    });

    host.addEventListener('click', (e) => {
        const t = /** @type {HTMLElement} */ (e.target);
        const group = t.closest('[data-hb-group-restore]');
        if (group) {
            e.stopPropagation();
            say(
                `Restore… on the heading of ${group.getAttribute('data-hb-group-restore')}: opens Restore with ?stack=${group.getAttribute('data-hb-group-restore')}.`,
            );
            return;
        }
        const one = t.closest('[data-hb-restore], [data-hb-file], [data-hb-snap-restore]');
        if (!one) return;
        const key = one.getAttribute('data-hb-restore') ?? one.getAttribute('data-hb-file') ?? one.getAttribute('data-hb-repo');
        const r = REPOS.find((x) => x.key === key);
        if (!r) return;
        if (one.hasAttribute('data-hb-snap-restore'))
            say(
                `Restore… on snapshot ${one.getAttribute('data-hb-snap-restore')}: opens Restore with ?stack=${r.stack}&app=${r.app}&snapshot=${one.getAttribute('data-hb-snap-restore')}.`,
            );
        else if (one.hasAttribute('data-hb-file')) say(`Show a file… on ${r.stack} ${r.app}: opens the read-only file picker for that snapshot.`);
        else say(`Restore… on ${r.stack} ${r.app}: opens Restore with ?stack=${r.stack}&app=${r.app}.`);
    });

    /** @param {Event} e */
    function onAction(e) {
        const d = /** @type {CustomEvent} */ (e).detail;
        const n = d.keys.length;
        const verify = d.action === 'verify';
        setSelectionBusy(bar, `${verify ? 'Verifying' : 'Backing up'} ${count(n)}…`);
        say(`${verify ? 'Verify restore' : 'Back up now'} asked for ${d.keys.join(', ')}.`);
        setTimeout(() => {
            const refuse = outcome === 'refused' && n > 1;
            const done = refuse ? d.keys.slice(1) : d.keys;
            setSelectionBusy(bar, null);
            if (refuse)
                setSelectionResult(bar, { done: done.length, refused: [{ key: d.keys[0], reason: 'the repository is locked by a running backup' }] });
            if (verify) {
                for (const key of done) {
                    const r = REPOS.find((x) => x.key === key);
                    const row = host.querySelector(`[data-kp-row-key="${key}"]`);
                    const badge = row?.querySelector('[data-hb-drill]');
                    if (r && badge) {
                        r.drill = 'passed';
                        badge.textContent = DRILL_WORDS.passed;
                        badge.className = 'kp-badge kp-badge--success';
                    }
                }
                table().refresh();
            }
            say(`${count(done.length)} done${refuse ? ', 1 refused' : ''}. The rows changed at once.`);
        }, 1600);
    }

    const setState = stateButtons('data-hb-repos-data', (v) => {
        state = v;
        if (v === 'empty' || host.querySelector('tbody')?.children.length === 0) rebuild();
        else applyState();
    });
    const setGroups = stateButtons('data-hb-groups', (v) => {
        folded = v === 'folded' ? BY_SIZE.map((s) => s.key) : [];
        table().fold(folded);
    });
    stateButtons('data-hb-outcome', (v) => (outcome = v));
    onChoice('backups-groups', (v) => {
        folded = v === 'folded' ? BY_SIZE.map((s) => s.key) : [];
        setGroups(v);
        table().fold(folded);
    });
    host.addEventListener('kp-datatable-retry', () => {
        state = 'ready';
        setState('ready');
        applyState();
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 3. the Month view
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('month-component')) {
    const { setCalendarDays, setCalendarLegend, calendarSelect, CALENDAR_PICK_EVENT, CALENDAR_MONTH_EVENT } = await import('../../js/calendar.js');
    const { setCardState, CARD_RETRY_EVENT } = await import('../../js/card-state.js');
    const { SEGMENTED_EVENT, setSegmentedValues } = await import('../../js/segmented.js');
    const { RANGE_EVENT } = await import('../../js/range.js');

    const root = $('#month-component');
    const card = $('.kp-card', root);
    const nightsBox = $('[data-hb-nights]', root);
    const monthBox = $('[data-hb-month]', root);
    const nightsHeat = $('[data-hb-heat="nights"]', root);
    const monthHeat = $('[data-hb-heat="month"]', root);
    const calendar = $('[data-hb-calendar]', root);
    const picker = $('[data-hb-range-picker]', root);
    const readout = $('[data-hb-month-pin]', root);
    const repairBtn = $('[data-hb-month-repair]', root);
    let view = 'month';
    let span = 30;
    let cursor = { year: 2026, month: 10 };
    /** @type {string | null} */
    let picked = null;

    const monthDays = () => {
        const n = new Date(Date.UTC(cursor.year, cursor.month, 0)).getUTCDate();
        return Array.from({ length: n }, (_, i) => `${cursor.year}-${pad(cursor.month)}-${pad(i + 1)}`);
    };

    const calendarDays = () => {
        /** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
        const days = {};
        for (let i = -80; i <= 70; i++) {
            const iso = addDays(TODAY, i);
            if (i > 0) {
                days[iso] = { tone: 'future', label: 'not run yet' };
                continue;
            }
            const { ok, live } = fleetOf(iso);
            days[iso] = {
                tone: ok === live ? 'ok' : ok === 0 ? 'bad' : 'warn',
                ...(ok === live ? {} : { count: `−${live - ok}` }),
                label: ok === live ? `all ${live} stacks backed up` : `${ok} of ${live} stacks backed up`,
            };
        }
        return days;
    };

    const describe = () => {
        repairBtn.hidden = true;
        if (!picked) {
            readout.textContent = 'No night picked. Press a day or a cell.';
            return;
        }
        readout.textContent = nightSentence(picked);
        const first = fleetOf(picked).missed[0];
        if (first) {
            repairBtn.hidden = false;
            repairBtn.textContent = `Back up ${first.stack} now`;
            repairBtn.disabled = false;
            repairBtn.dataset.hbStack = first.stack;
        }
    };

    const paint = () => {
        const weekend = 'quiet';
        const nights = nightsEnding(span);
        setHeat(
            nightsHeat,
            heatSpec(nights, { weekend, every: span === 90 ? 7 : span === 30 ? 3 : 1, label: `Backups per stack, last ${span} nights` }),
        );
        const days = monthDays();
        setHeat(monthHeat, { ...heatSpec(days, { weekend, every: 5, label: `Backups per stack in ${cursor.month}/${cursor.year}` }), toggle: false });
        setCalendarDays(calendar, calendarDays());
        setCalendarLegend(calendar, [
            { tone: 'ok', label: 'every stack backed up' },
            { tone: 'warn', label: 'some stacks missed' },
            { tone: 'bad', label: 'every stack missed' },
            { tone: 'future', label: 'not run yet' },
        ]);
        const inGrid = picked && (view === 'month' ? days.includes(picked) : nights.includes(picked));
        if (picked) {
            setHeatPick(view === 'month' ? monthHeat : nightsHeat, inGrid ? picked : null);
            if (view === 'month') calendarSelect(calendar, picked);
        }
        nightsBox.hidden = view !== 'nights';
        monthBox.hidden = view !== 'month';
        picker.hidden = view !== 'nights';
        describe();
    };
    repaints.add(paint);
    paint();
    setAgo($('[data-hb-month-ago]', root), Date.now() - 150000);

    const pick = (/** @type {string | null} */ iso) => {
        picked = iso;
        paint();
    };
    calendar.addEventListener(CALENDAR_PICK_EVENT, (e) => pick(/** @type {CustomEvent} */ (e).detail.date));
    calendar.addEventListener(CALENDAR_MONTH_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        cursor = { year: d.year, month: d.month };
        paint();
    });
    for (const heat of [nightsHeat, monthHeat])
        heat.addEventListener(HEAT_PICK_EVENT, (e) => {
            const d = /** @type {CustomEvent} */ (e).detail;
            picked = d.picked ? d.colKey : null;
            if (picked && view === 'month') calendarSelect(calendar, picked);
            describe();
        });
    $('[data-hb-view]', root).addEventListener(SEGMENTED_EVENT, (e) => {
        view = /** @type {CustomEvent} */ (e).detail.value ?? 'month';
        paint();
    });
    picker.addEventListener(RANGE_EVENT, (e) => {
        const key = /** @type {CustomEvent} */ (e).detail.preset;
        span = key === '7d' ? 7 : key === '90d' ? 90 : 30;
        paint();
    });
    onChoice('backups-opens-on', (v) => {
        view = v === 'month' ? 'month' : 'nights';
        setSegmentedValues($('[data-hb-view]', root), [view]);
        paint();
    });
    onChoice('backups-cal-busy', (v) => {
        const cal = $('[data-hb-calendar]', root);
        cal.classList.remove('kp-calendar--busy-whole', 'kp-calendar--busy-days');
        cal.classList.add(v);
    });
    repairBtn.addEventListener('click', () => {
        const stack = repairBtn.dataset.hbStack ?? '';
        const iso = picked ?? '';
        repairBtn.disabled = true;
        readout.textContent = `Backing up ${stack} for ${dmy(iso)}…`;
        setTimeout(() => {
            repair(stack, iso);
            readout.textContent = `${stack} backed up for ${dmy(iso)}. ${nightSentence(iso)}`;
        }, 1400);
    });
    stateButtons('data-hb-month-data', (v) => {
        setCardState(card, /** @type {any} */ (v), {
            words: 'Reading the stacks…',
            title: v === 'empty' ? 'No backup history yet' : 'The backup history could not be read',
            text: v === 'empty' ? 'The first nightly round fills this view.' : 'The host did not answer within 10 s. Nothing was changed.',
        });
    });
    card.addEventListener(CARD_RETRY_EVENT, () => {
        setCardState(card, 'ready');
        for (const b of $$('[data-hb-month-data]', root)) b.setAttribute('aria-pressed', String(b.getAttribute('data-hb-month-data') === 'ready'));
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 4. one night in detail
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('night-component')) {
    const { buildStatusList, setStatus, countStatus, STATUS_RETRY_EVENT } = await import('../../js/statusrow.js');
    const { setWeekEvents, setWeekStart, setWeekLegend, WEEK_OPEN_EVENT, WEEK_RANGE_EVENT } = await import('../../js/week.js');
    const { setCardState, CARD_RETRY_EVENT } = await import('../../js/card-state.js');

    const root = $('#night-component');
    const card = $('.kp-card', root);
    const pickNight = /** @type {HTMLSelectElement} */ ($('[data-hb-night-pick]', root));
    const pickStack = /** @type {HTMLSelectElement} */ ($('[data-hb-week-stack]', root));
    const summary = $('[data-hb-night-summary]', root);
    const week = $('[data-hb-week]', root);
    const log = $('[data-hb-night-log]', root);
    let host = $('[data-hb-statuslist]', root);
    let night = addDays(TODAY, -1);
    let stack = 'kyu';
    let weekStart = '';
    let repairWorks = true;
    /** @type {number[]} */
    let timers = [];

    const mondayOf = (/** @type {string} */ iso) => {
        const wd = new Date(`${iso}T12:00:00Z`).getUTCDay();
        return addDays(iso, -((wd + 6) % 7));
    };

    for (const iso of nightsEnding(14).reverse()) {
        const m = fleetOf(iso).missed.length;
        pickNight.add(new Option(`${weekday(iso)} ${dmy(iso)}${iso === TODAY ? ' (last night)' : ''}${m ? ` · ${m} missed` : ''}`, iso));
    }
    pickNight.value = night;
    for (const s of KEEPING) pickStack.add(new Option(s.key, s.key));
    pickStack.value = stack;

    /** @param {typeof STACKS[number]} s */
    const rowOf = (s) => {
        const n = nightOf(s, night);
        if (n.state === 'none') return { id: s.key, label: s.key, detail: 'keeps no data by design', state: /** @type {const} */ ('empty') };
        if (n.state === 'before')
            return { id: s.key, label: s.key, detail: 'before this stack had any history', state: /** @type {const} */ ('empty') };
        if (n.state === 'bad')
            return { id: s.key, label: s.key, detail: `missed: ${n.reason}`, state: /** @type {const} */ ('failed'), fix: `Back up ${s.key} now` };
        const late = (n.minute ?? 0) >= 35;
        return {
            id: s.key,
            label: s.key,
            detail: n.times.join(', '),
            state: /** @type {'ok' | 'warn'} */ (late ? 'warn' : 'ok'),
            ...(late ? { fix: 'Started late' } : {}),
        };
    };

    const summaryText = () => {
        const c = countStatus(host);
        const backed = c.ok + c.warn;
        const live = c.total - c.empty;
        const reading = c.loading > 0;
        return reading
            ? `${count(c.total - c.loading)} of ${count(c.total)} stacks read`
            : `${count(backed)} of ${count(live)} backed up on ${dmy(night)}`;
    };

    const paintList = () => {
        const next = buildStatusList(
            KEEPING.concat(STACKS.filter((s) => !s.keeps))
                .sort((a, b) => a.order - b.order)
                .map(rowOf),
            {
                label: `Stacks on ${dmy(night)}`,
            },
        );
        next.setAttribute('data-hb-statuslist', '');
        host.replaceWith(next);
        host = next;
        summary.textContent = summaryText();
    };

    const events = () => {
        const s = /** @type {typeof STACKS[number]} */ (STACK.get(stack));
        /** @type {import('../../js/week.js').WeekEvent[]} */
        const out = [];
        for (let d = 0; d < 7; d++) {
            const iso = addDays(weekStart, d);
            if (backOf(iso) < 0) continue;
            out.push({
                id: `plan-${iso}`,
                start: `${iso}T03:00:00+02:00`,
                label: 'planned',
                state: 'reference',
                detail: `${dmy(iso)}: the nightly round starts at 03:00.`,
            });
            const n = nightOf(s, iso);
            if (n.state === 'ok')
                s.apps.forEach(([app], i) => {
                    const t = `03:${pad((n.minute ?? 0) + i)}`;
                    out.push({
                        id: `${s.key}-${app}-${iso}`,
                        start: `${iso}T${t}:04+02:00`,
                        label: app,
                        series: /** @type {1} */ (i + 1),
                        detail: `${dmy(iso)}: ${app} snapshot at ${t}${(n.minute ?? 0) >= 35 ? ', late' : ''}.`,
                    });
                });
            else if (n.state === 'bad')
                out.push({
                    id: `${s.key}-miss-${iso}`,
                    start: `${iso}T03:00:30+02:00`,
                    label: 'missed',
                    state: 'skipped',
                    detail: `${dmy(iso)}: no snapshot, ${n.reason}.`,
                });
        }
        return out;
    };

    const paintWeek = () => {
        weekStart = weekStart || mondayOf(night);
        setWeekStart(week, weekStart);
        setWeekEvents(week, events());
        const s = /** @type {typeof STACKS[number]} */ (STACK.get(stack));
        setWeekLegend(
            week,
            s.apps.map(([app], i) => ({ series: /** @type {1} */ (i + 1), label: `${app} snapshot` })),
        );
    };

    const paint = () => {
        timers.forEach(clearTimeout);
        timers = [];
        paintList();
        paintWeek();
    };
    repaints.add(paint);
    paint();

    pickNight.addEventListener('change', () => {
        night = pickNight.value;
        weekStart = mondayOf(night);
        paint();
    });
    pickStack.addEventListener('change', () => {
        stack = pickStack.value;
        paintWeek();
    });
    week.addEventListener(WEEK_RANGE_EVENT, (e) => {
        weekStart = /** @type {CustomEvent} */ (e).detail.start;
        setWeekEvents(week, events());
    });
    week.addEventListener(WEEK_OPEN_EVENT, (e) => {
        log.textContent = `Pill ${/** @type {CustomEvent} */ (e).detail.id} opened its details.`;
    });
    root.addEventListener(STATUS_RETRY_EVENT, (e) => {
        const id = /** @type {CustomEvent} */ (e).detail.id;
        log.textContent = `Back up ${id} now: runs a backup of ${id} for the night of ${dmy(night)} and reads it back.`;
        setStatus(host, id, { state: 'loading', detail: 'Backing up…', fix: '' });
        timers.push(
            window.setTimeout(() => {
                if (repairWorks) {
                    repair(id, night);
                    log.textContent = `${id} backed up for ${dmy(night)}.`;
                } else {
                    setStatus(host, id, { state: 'failed', detail: 'missed: the backup disk is still full', fix: `Back up ${id} now` });
                    summary.textContent = summaryText();
                    log.textContent = `${id} could not be backed up: the backup disk is still full. Nothing was changed.`;
                }
            }, 1500),
        );
    });
    stateButtons('data-hb-repair', (v) => (repairWorks = v === 'works'));
    stateButtons('data-hb-night-data', (v) => {
        timers.forEach(clearTimeout);
        timers = [];
        if (v === 'reading') {
            setCardState(card, 'ready');
            paintList();
            const rows = $$('.kp-statusrow', host);
            rows.forEach(
                (r) =>
                    r.getAttribute('data-kp-status-id') &&
                    setStatus(host, /** @type {string} */ (r.getAttribute('data-kp-status-id')), { state: 'loading', detail: 'reading…', fix: '' }),
            );
            summary.textContent = summaryText();
            const ids = STACKS.map((s) => s.key);
            ids.slice(0, ids.length - 1).forEach((id, i) => {
                timers.push(
                    window.setTimeout(
                        () => {
                            const row = rowOf(/** @type {typeof STACKS[number]} */ (STACK.get(id)));
                            setStatus(host, id, { state: row.state, detail: row.detail, fix: 'fix' in row ? row.fix : '' });
                            summary.textContent = summaryText();
                        },
                        450 * (i + 1),
                    ),
                );
            });
            return;
        }
        if (v === 'ready') {
            setCardState(card, 'ready');
            paint();
            return;
        }
        setCardState(card, /** @type {any} */ (v), {
            words: 'Reading the stacks…',
            title: v === 'empty' ? 'No stack has a backup history yet' : 'The stacks could not be read',
            text: v === 'empty' ? 'The first nightly round fills this view.' : 'The host did not answer within 10 s. Nothing was changed.',
        });
    });
    card.addEventListener(CARD_RETRY_EVENT, () => {
        setCardState(card, 'ready');
        paint();
        for (const b of $$('[data-hb-night-data]', root)) b.setAttribute('aria-pressed', String(b.getAttribute('data-hb-night-data') === 'ready'));
    });
}

// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// 5. restore
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════
if (has('restore-component')) {
    const { wizard, STEP_EVENT, BEFORE_STEP_EVENT } = await import('../../js/wizard.js');
    const { setDatedOptions, setDatedState, datedValue, DATED_EVENT, DATED_RETRY_EVENT } = await import('../../js/dated-options.js');
    const { setDeplist, deplist } = await import('../../js/deplist.js');
    const { setCode } = await import('../../js/code.js');
    const { buildSteplist, setStep, attachSteplists } = await import('../../js/steplist.js');
    const { attachTypeConfirms, TYPE_CONFIRM_EVENT } = await import('../../js/components.js');
    const { ackGate, ACK_EVENT } = await import('../../js/ack-gate.js');
    const { runMoment } = await import('../../js/runs.js');
    const { attachDisabledReasons } = await import('../../js/reason.js');

    const root = $('#restore-component');
    const wiz = $('[data-hb-wizard]', root);
    const stackSel = /** @type {HTMLSelectElement} */ ($('[data-hb-rs-stack]', root));
    const tiles = $('[data-hb-rs-tiles]', root);
    const listWrap = $('[data-hb-rs-listwrap]', root);
    const tilesRow = $('[data-hb-rs-tilesrow]', root);
    const appSel = /** @type {HTMLSelectElement} */ ($('[data-hb-rs-app]', root));
    const dated = $('[data-hb-dated]', root);
    const next = /** @type {HTMLButtonElement} */ ($('[data-hb-next]', root));
    const back = /** @type {HTMLButtonElement} */ ($('[data-kp-wizard-back]', root));
    const go = /** @type {HTMLButtonElement} */ ($('[data-hb-rs-go]', root));
    const log = $('[data-hb-restore-log]', root);
    const runActions = $('[data-hb-rs-run-actions]', root);
    const runTitle = $('[data-hb-rs-run-title]', root);
    let steps = $('[data-hb-steplist]', root);
    const w = () => /** @type {import('../../js/wizard.js').WizardHandle} */ (wizard(wiz));

    const RS_STACKS = KEEPING.filter((s) => s.apps.length > 0);
    const DEPENDENTS = /** @type {Record<string, [string, string][]>} */ ({
        paperless: [
            ['paperless', 'postgres'],
            ['paperless', 'redis'],
        ],
        immich: [
            ['immich', 'postgres'],
            ['immich', 'redis'],
        ],
        jellyfin: [['jellyseerr', 'jellyfin']],
        inbox: [['inbox', 'mail-archive']],
    });
    let stack = 'paperless';
    let app = 'paperless';
    let layout = 'tiles';
    let nightsState = 'ready';
    let run = 'works';
    let viaControl = false;
    /** @type {number[]} */
    let timers = [];

    const repo = () => REPOS.find((r) => r.stack === stack && r.app === app) ?? REPOS.find((r) => r.stack === stack);
    const snapId = () => datedValue(dated);
    const snap = () => repo()?.snaps.find((x) => x.id === snapId());
    const address = () => {
        const s = snapId();
        return `/backups/restore?stack=${stack}&app=${app}${s ? `&snapshot=${s}` : ''}`;
    };

    for (const s of RS_STACKS)
        stackSel.add(new Option(`${s.key} (CT ${s.ct}, ${count(s.apps.length)} ${s.apps.length === 1 ? 'app' : 'apps'})`, s.key));
    stackSel.value = stack;

    const paintApps = () => {
        const s = /** @type {typeof STACKS[number]} */ (STACK.get(stack));
        if (!s.apps.some((a) => a[0] === app)) app = /** @type {string} */ (s.apps[0]?.[0]);
        tiles.hidden = layout !== 'tiles';
        tilesRow.hidden = layout !== 'tiles';
        listWrap.hidden = layout !== 'list';
        tiles.querySelectorAll('.kp-field__option').forEach((n) => n.remove());
        for (const [name, gb, drill] of s.apps) {
            const label = document.createElement('label');
            label.className = 'kp-field__option';
            label.innerHTML = `<input class="kp-field__check" type="radio" name="hb-app" value="${name}" ${name === app ? 'checked' : ''} />
                <span class="kp-field__option-title">${name}</span>
                <span class="kp-field__option-hint">${gbText(gb)}, restore drill ${DRILL_WORDS[drill]}</span>`;
            tiles.append(label);
        }
        appSel.replaceChildren(...s.apps.map(([name, gb]) => new Option(`${name} (${gbText(gb)})`, name)));
        appSel.value = app;
        const r = repo();
        const deps = (DEPENDENTS[stack] ?? []).filter(([, to]) => to === app).map(([from]) => from);
        $('[data-hb-rs-facts]', root).innerHTML = `<li>${app} comes back as it was on the night you pick next: ${gbText(r?.gb ?? 0)} of files.</li>
            <li>${deps.length ? `${deps.join(' and ')} stops first, because it needs ${app}.` : `Nothing else needs ${app}, so only ${app} stops.`}</li>
            <li>The last restore drill of ${app}: ${DRILL_WORDS[r?.drill ?? 'never']}.</li>`;
    };

    const nightOptions = () => {
        const r = repo();
        const s = /** @type {typeof STACKS[number]} */ (STACK.get(stack));
        return nightsEnding(30)
            .reverse()
            .map((iso) => {
                const n = nightOf(s, iso);
                const noon = `${iso}T12:00:00+02:00`;
                if (n.state !== 'ok') {
                    const reason = n.state === 'bad' ? 'no snapshot (missed)' : 'no history yet';
                    return { value: `none-${iso}`, label: `${weekday(iso)} ${dmy(iso)}`, when: noon, meta: '—', disabled: reason };
                }
                const x = r?.snaps.find((q) => q.iso === iso);
                const back = backOf(iso);
                return {
                    value: x?.id ?? iso,
                    label: back === 0 ? `Today ${x?.time}` : back === 1 ? `Yesterday ${x?.time}` : `${weekday(iso)} ${dmy(iso)} ${x?.time}`,
                    when: x ? new Date(x.ms).toISOString() : noon,
                    meta: gbText(x?.gb ?? 0),
                };
            });
    };

    const paintNights = () => {
        if (nightsState === 'ready') setDatedOptions(dated, nightOptions());
        else if (nightsState === 'empty') {
            const take = document.createElement('button');
            take.type = 'button';
            take.className = 'kp-button kp-button--primary';
            take.textContent = 'Take a snapshot now';
            setDatedOptions(dated, []);
            setDatedState(dated, 'empty', { reason: `${app} has no snapshot yet`, action: take });
        } else
            setDatedState(dated, /** @type {any} */ (nightsState), {
                title: 'The nights could not be read',
                text: 'The host did not answer within 10 s. Nothing was changed.',
            });
        gate();
    };

    /** Next waits for what the step needs, and says what, on hover and focus. */
    const gate = () => {
        const at = w().step();
        let reason = '';
        if (at === 1 && (nightsState !== 'ready' || !snapId() || snapId()?.startsWith('none-')))
            reason =
                nightsState === 'ready'
                    ? 'Pick a night that has a snapshot'
                    : nightsState === 'empty'
                      ? 'There is no snapshot to restore yet'
                      : nightsState === 'loading'
                        ? 'The nights are still being read'
                        : 'The nights could not be read';
        next.disabled = reason !== '';
        if (reason) next.setAttribute('data-kp-disabled-reason', reason);
        else next.removeAttribute('data-kp-disabled-reason');
        attachDisabledReasons(root);
    };

    const typed = () => {
        const box = $('[data-hb-typeconfirm]', root);
        box.innerHTML = `<div data-kp-type-confirm="${stack}"></div>`;
        attachTypeConfirms(box);
        go.textContent = `Restore ${app}`;
        ackGate($('[data-hb-ack]', root))?.set(false);
        matched = false;
        acked = false;
        armGo();
    };

    let matched = false;
    let acked = false;
    /** The button waits for both guards and says which one is still open. */
    const armGo = () => {
        go.disabled = !(matched && acked);
        if (go.disabled)
            go.setAttribute(
                'data-kp-disabled-reason',
                !acked ? `Tick "I understand today's data is copied aside" first` : `Type ${stack} exactly first`,
            );
        else go.removeAttribute('data-kp-disabled-reason');
        attachDisabledReasons(root);
    };

    const checkStep = () => {
        const r = snap();
        const when = r ? runMoment(r.ms, 'Europe/Brussels', 'en-GB') : '';
        $('[data-hb-rs-point]', root).textContent = `Restore point: ${when}`;
        const deps = (DEPENDENTS[stack] ?? []).filter(([, to]) => to === app || DEPENDENTS[stack]?.length === 1);
        const list = $('[data-hb-deplist]', root);
        const pairs = (DEPENDENTS[stack] ?? []).map(([from, to]) => ({ from, to, state: /** @type {'running'} */ ('running'), label: 'needs' }));
        if (pairs.length) setDeplist(list, pairs);
        else {
            setDeplist(list, []);
            deplist(list)?.setState('empty', { message: `Nothing else depends on ${app}, so only ${app} stops.` });
        }
        void deps;
        const stopsFirst = (DEPENDENTS[stack] ?? []).filter(([, to]) => to === app).map(([from]) => from);
        $('[data-hb-rs-point]', root).textContent += stopsFirst.length
            ? `. Restoring ${app} stops ${stopsFirst.join(' and ')} first.`
            : `. Restoring ${app} stops only ${app}.`;
        const code = $('[data-hb-code]', root);
        setCode(code, {
            title: `Dry run of the restore (nothing is written)`,
            language: 'Shell',
            state: 'loading',
            loadingWords: 'Reading from the snapshot…',
        });
        timers.push(
            window.setTimeout(() => {
                const text = `$ restic -r sftp:pve:/backups/${stack} restore ${snapId()} --target /srv/${stack} --dry-run -v
repository 8c3a1f0e opened (version 2, compression level auto)
restoring <Snapshot ${snapId()} of [/srv/${stack}/${app}] at ${r ? `${dmy(r.iso)} ${r.time}:04` : ''} by root@${stack}> to /srv/${stack}
Would restore ${count(18342)} files and ${count(2113)} directories, ${gbText(r?.gb ?? 0)}
Would overwrite ${count(412)} files; ${count(17930)} are unchanged and are skipped.`;
                setCode(code, {
                    title: `Dry run of the restore (nothing is written)`,
                    language: 'Shell',
                    text,
                    lines: true,
                    copy: true,
                    size: `${count(text.length)} characters`,
                });
            }, 1400),
        );
        typed();
    };

    const runSteps = [
        ['stop', 'Stop paperless and what needs it', 'one container stops, the other waits'],
        ['aside', "Copy today's data aside", 'kept for 7 days'],
        ['restore', 'Restore the snapshot', 'files are written back'],
        ['start', 'Start again', 'in the order shown in Check'],
        ['check', 'Check that it answers', 'a request to the app'],
    ];

    const startRun = () => {
        timers.forEach(clearTimeout);
        timers = [];
        runActions.hidden = true;
        const fresh = buildSteplist(
            runSteps.map(([id, title, note]) => ({ id, title: id === 'stop' ? `Stop ${app} and what needs it` : title, note, state: 'pending' })),
            { label: `Restoring ${app}` },
        );
        fresh.setAttribute('data-hb-steplist', '');
        steps.replaceWith(fresh);
        steps = fresh;
        attachSteplists(root);
        runTitle.textContent = `Restoring ${app} to ${snap() ? runMoment(/** @type {number} */ (snap()?.ms), 'Europe/Brussels', 'en-GB') : ''}`;
        back.disabled = true;
        const at = (/** @type {number} */ ms, /** @type {() => void} */ fn) => timers.push(window.setTimeout(fn, ms));
        const size = repo()?.gb ?? 1;
        setStep(steps, 'stop', { state: 'running' });
        at(900, () => {
            setStep(steps, 'stop', { state: 'done', time: '0.9 s' });
            setStep(steps, 'aside', { state: 'running' });
        });
        at(1900, () => {
            setStep(steps, 'aside', { state: 'done', time: '1.0 s' });
            setStep(steps, 'restore', { state: 'running', note: `0.0 of ${gbText(size)}` });
        });
        [0.25, 0.5, 0.75].forEach((f, i) => at(2600 + i * 700, () => setStep(steps, 'restore', { note: `${gbText(size * f)} of ${gbText(size)}` })));
        if (run === 'fails') {
            at(4500, () => {
                setStep(steps, 'restore', { state: 'failed', note: 'pack 3f2a is missing from the repository (restic check failed)', time: '2.6 s' });
                setStep(steps, 'start', { state: 'skipped', note: 'not started: the restore failed' });
                setStep(steps, 'check', { state: 'skipped', note: 'not checked: the restore failed' });
                runTitle.textContent = `Restoring ${app} stopped at step 3. ${app} is still stopped and today's data is safe in the copy set aside.`;
                runActions.hidden = false;
                back.disabled = false;
            });
            return;
        }
        at(4500, () => {
            setStep(steps, 'restore', { state: 'done', note: `${gbText(size)} of ${gbText(size)}`, time: '2.6 s' });
            setStep(steps, 'start', { state: 'running' });
        });
        at(5400, () => {
            setStep(steps, 'start', { state: 'done', time: '0.9 s' });
            setStep(steps, 'check', { state: 'running' });
        });
        at(6300, () => {
            setStep(steps, 'check', { state: 'done', time: '0.9 s' });
            runTitle.textContent = `${app} is back at ${snap() ? runMoment(/** @type {number} */ (snap()?.ms), 'Europe/Brussels', 'en-GB') : ''}.`;
            back.disabled = false;
        });
    };

    const leave = () => {
        timers.forEach(clearTimeout);
        timers = [];
    };

    wiz.addEventListener(BEFORE_STEP_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        if (viaControl) return;
        if (d.to > d.from && d.to === 3 && d.from !== 2) e.preventDefault();
        if (d.direction === 'forward' && d.from === 1 && (nightsState !== 'ready' || !snapId() || snapId()?.startsWith('none-'))) e.preventDefault();
    });
    wiz.addEventListener(STEP_EVENT, (e) => {
        const d = /** @type {CustomEvent} */ (e).detail;
        leave();
        next.hidden = d.step >= 2;
        back.hidden = false;
        if (d.step === 1) paintNights();
        if (d.step === 2) checkStep();
        if (d.step === 3) startRun();
        gate();
        log.textContent = `${address()}  (step ${d.step + 1} of ${d.of})`;
        for (const b of $$('[data-hb-goto]', root)) b.setAttribute('aria-pressed', String(b.getAttribute('data-hb-goto') === String(d.step)));
    });

    stackSel.addEventListener('change', () => {
        stack = stackSel.value;
        app = '';
        paintApps();
        paintNights();
        log.textContent = address();
    });
    tiles.addEventListener('change', (e) => {
        app = /** @type {HTMLInputElement} */ (e.target).value;
        appSel.value = app;
        paintNights();
        log.textContent = address();
    });
    appSel.addEventListener('change', () => {
        app = appSel.value;
        paintNights();
        log.textContent = address();
    });
    dated.addEventListener(DATED_EVENT, () => {
        gate();
        log.textContent = address();
    });
    dated.addEventListener(DATED_RETRY_EVENT, () => {
        nightsState = 'loading';
        setDatedState(dated, 'loading');
        for (const b of $$('[data-hb-nights-data]', root))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-hb-nights-data') === 'loading'));
        gate();
        setTimeout(() => {
            nightsState = 'ready';
            for (const b of $$('[data-hb-nights-data]', root))
                b.setAttribute('aria-pressed', String(b.getAttribute('data-hb-nights-data') === 'ready'));
            paintNights();
        }, 1400);
    });
    root.addEventListener(TYPE_CONFIRM_EVENT, (e) => {
        matched = Boolean(/** @type {CustomEvent} */ (e).detail.matched);
        armGo();
    });
    root.addEventListener(ACK_EVENT, (e) => {
        acked = Boolean(/** @type {CustomEvent} */ (e).detail.checked);
        armGo();
    });
    go.addEventListener('click', () => void w().next());
    $('[data-hb-rs-retry]', root).addEventListener('click', startRun);
    $('[data-hb-rs-back]', root).addEventListener('click', () => void w().goTo(2));

    stateButtons('data-hb-nights-data', (v) => {
        nightsState = v;
        if (w().step() !== 1) viaControl = true;
        const finish = () => {
            viaControl = false;
            paintNights();
        };
        if (w().step() !== 1) void w().goTo(1).then(finish);
        else finish();
    });
    stateButtons('data-hb-run', (v) => (run = v));
    stateButtons('data-hb-goto', (v) => {
        viaControl = true;
        void w()
            .goTo(Number(v))
            .finally(() => (viaControl = false));
    });
    const setLayout = stateButtons('data-hb-goto-none', () => {});
    void setLayout;
    onChoice('backups-app-picker', (v) => {
        layout = v;
        paintApps();
    });

    paintApps();
    paintNights();
    attachSteplists(root);
    checkStep();
    log.textContent = `${address()}  (step 1 of 4)`;
    next.hidden = false;
}
