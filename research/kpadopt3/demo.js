// research/kpadopt3: the demo's wiring. The components and their new options are the package's own (js/nav-fold.js,
// js/gantt.js, js/week.js, js/facets.js); the sample data, the frames, the readouts and the
// buttons that drive a section are this page's (mock). Loaded before js/auto.js, so the options given here are the ones
// that count.
import { openMenu, closeMenu } from '../../js/menu-button.js';
import { attachGantts, setGanttLegend, setGanttRuns, GANTT_OPEN_EVENT, GANTT_SELECT_EVENT } from '../../js/gantt.js';
import { attachWeeks, setWeekEvents, setWeekState, WEEK_OPEN_EVENT } from '../../js/week.js';
import { attachFacets, setFacetItems, setFacetCounts } from '../../js/facets.js';
import { attachHoverCards } from '../../js/hovercard.js';
import { dayKey, formatDayKey, shiftDay } from '../../js/calendar.js';
import { zonedTime } from '../../js/chart.js';

const ZONE = 'Europe/Brussels';
/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
/** @param {HTMLElement} log @param {string} line */
const say = (log, line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(`${stamp()}  ${line}`);
    log.textContent = lines.slice(-5).join('\n');
};
/** @param {string} iso @param {number} hh @param {number} mm */
const at = (iso, hh, mm) => zonedTime(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), Number(iso.slice(8, 10)), hh, mm, ZONE) ?? 0;
const today = () => dayKey(Date.now(), ZONE);
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ 1 · the bar's separator */

const live = /** @type {HTMLElement} */ (document.querySelector('[data-k3-live]'));
const slider = /** @type {HTMLInputElement} */ (document.querySelector('[data-k3-slider]'));
const out = /** @type {HTMLElement} */ (document.querySelector('[data-k3-out]'));
const width = () => {
    live.style.setProperty('--k3-w', `${slider.value}rem`);
    out.textContent = `${slider.value}rem`;
};
slider.addEventListener('input', width);
width();

/** @param {HTMLElement} nav @returns {Promise<void>} */
const fitted = (nav) =>
    new Promise((resolve) => {
        if (nav.hasAttribute('data-kp-nav-fold-ready')) return resolve();
        const watch = new MutationObserver(() => {
            if (!nav.hasAttribute('data-kp-nav-fold-ready')) return;
            watch.disconnect();
            resolve();
        });
        watch.observe(nav, { attributes: true, attributeFilter: ['data-kp-nav-fold-ready'] });
    });

// The folded bar shows its More menu open while it is in view (a menu opened far below the window would be placed for a
// window it is not in), and closes it when it leaves.
const foldFrame = /** @type {HTMLElement} */ (document.querySelector('[data-k3-open-more]'));
const foldNav = /** @type {HTMLElement} */ (foldFrame.querySelector('.kp-nav'));
const openMore = async () => {
    await fitted(foldNav);
    // On a phone the 33rem bar scrolls sideways: bring its More button into view first.
    const scroller = foldFrame.parentElement;
    const more = foldNav.querySelector('.kp-nav__more');
    if (scroller && more && scroller.scrollWidth > scroller.clientWidth)
        scroller.scrollLeft = Math.max(0, more.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft - 16);
    const wrapper = foldNav.querySelector('.kp-nav__more > .kp-menu-button');
    if (wrapper) openMenu(wrapper, { focus: 'none' });
};
new IntersectionObserver((entries) => {
    const wrapper = foldNav.querySelector('.kp-nav__more > .kp-menu-button');
    for (const entry of entries) {
        if (entry.isIntersecting) void openMore();
        else if (wrapper) closeMenu(wrapper);
    }
}).observe(foldFrame);
document.querySelector('[data-k3-open-more-button]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    void openMore();
});

// The phone bar is shown with its toggle open whenever it comes into view (on the page and in the review dialog's stage),
// once the package has wired the toggle.
const phoneNav = /** @type {HTMLElement} */ (document.querySelector('[data-k3-phone-nav]'));
const openPhone = () => {
    if (!phoneNav.hasAttribute('data-kp-nav-open'))
        phoneNav.querySelector('.kp-nav__toggle')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};
new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) window.setTimeout(openPhone, 300);
}).observe(phoneNav);

/* ------------------------------------------------------------ 3 · the run timeline */

const MIN = 60_000;
/** @type {import('../../js/gantt.js').GanttLane[]} */
const LANES = [
    { id: 'nightly', label: 'Nightly round' },
    { id: 'updates', label: 'Updates' },
    { id: 'housekeeping', label: 'Housekeeping' },
    { id: 'reports', label: 'Reports' },
];

/** The last seven days of a household server, and two runs open now. @returns {import('../../js/gantt.js').GanttRun[]} */
function history() {
    const now = Date.now();
    /** @type {import('../../js/gantt.js').GanttRun[]} */
    const runs = [];
    for (let d = 7; d >= 0; d -= 1) {
        const iso = shiftDay(today(), -d);
        const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
        /** @param {string} id @param {string} lane @param {string} label @param {number} hh @param {number} mm @param {number} length @param {Partial<import('../../js/gantt.js').GanttRun>} [more] */
        const add = (id, lane, label, hh, mm, length, more = {}) => {
            const start = at(iso, hh, mm);
            if (start + length * MIN > now) return;
            runs.push({ id: `${id}-${iso}`, lane, label, start, end: start + length * MIN, state: 'ok', ...more });
        };
        add('rotate', 'housekeeping', 'Rotate logs', 0, 30, 25);
        add('backup', 'nightly', 'Backup photos', 2, 0, 75, d === 3 ? { state: 'failed', detail: 'The target disk was full.' } : { series: 1 });
        add('prune', 'nightly', 'Prune snapshots', 3, 30, 40, { series: 1 });
        if (dow === 0 || dow === 3) add('update', 'updates', 'Update images', 4, 30, 90, { series: 2 });
        if (dow >= 1 && dow <= 5) add('report', 'reports', 'Mail the report', 7, 30, 30);
        add('scrub', 'housekeeping', 'Scrub the pool', 13, 0, 120);
    }
    runs.push({ id: 'running-now', lane: 'housekeeping', label: 'Verify backups', start: now - 50 * MIN, state: 'running' });
    runs.push({ id: 'queued-now', lane: 'updates', label: 'Update images', start: now - 12 * MIN, state: 'queued' });
    return runs;
}

const ganttHint = 'Click a bar to open it · drag across the time to select a range · press a day on the axis to jump to it';
attachGantts(document, { strings: { ganttHint } });
attachHoverCards(document);
const runs = history();
const LEGEND = /** @type {import('../../js/gantt.js').GanttLegendEntry[]} */ ([
    { series: 1, label: 'Nightly round' },
    { series: 2, label: 'Updates' },
]);
const ganttLog = byId('k3-gantt-log');
for (const el of [byId('k3-gantt'), byId('k3-gantt-phone')]) {
    setGanttRuns(el, runs, LANES);
    setGanttLegend(el, LEGEND);
    el.addEventListener(GANTT_OPEN_EVENT, (event) => say(ganttLog, `opened ${/** @type {CustomEvent} */ (event).detail.run.label}`));
}

// The page's history (mock): every finished run, grouped by day, newest first.
const historyBox = byId('k3-history');
const byDay = new Map();
for (const run of [...runs].filter((r) => r.state === 'ok' || r.state === 'failed').sort((a, b) => Number(b.start) - Number(a.start))) {
    const day = dayKey(Number(run.start), ZONE);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(run);
}
for (const [day, list] of byDay) {
    const group = document.createElement('li');
    group.id = `k3-day-${day}`;
    const head = document.createElement('h3');
    head.textContent = formatDayKey(day);
    const items = document.createElement('ul');
    for (const run of list) {
        const row = document.createElement('li');
        const time = new Date(Number(run.start)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: ZONE });
        row.append(
            Object.assign(document.createElement('span'), { textContent: time }),
            Object.assign(document.createElement('span'), { textContent: run.label }),
            Object.assign(document.createElement('span'), { textContent: run.state === 'failed' ? 'failed' : 'succeeded' }),
        );
        items.append(row);
    }
    group.append(head, items);
    historyBox.append(group);
}
/** @param {string | null} day */
const markDay = (day) => {
    for (const head of historyBox.querySelectorAll('h3')) head.removeAttribute('aria-current');
    if (!day) return;
    const group = document.getElementById(`k3-day-${day}`);
    if (!group) return;
    group.querySelector('h3')?.setAttribute('aria-current', 'true');
    // The box scrolls, not the page.
    historyBox.scrollTo({ top: group.offsetTop, behavior: reduced() ? 'auto' : 'smooth' });
};
for (const el of [byId('k3-gantt'), byId('k3-gantt-phone')])
    el.addEventListener(GANTT_SELECT_EVENT, (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail.source === 'day') {
            say(ganttLog, `day pressed: ${formatDayKey(detail.day)}, the history jumps to it`);
            markDay(detail.day);
        } else if (detail.from === null) {
            say(ganttLog, 'selection lifted');
            markDay(null);
        } else say(ganttLog, 'a range was brushed');
    });

/* ------------------------------------------------------------ 4 · the week agenda */

/**
 * The weekly pattern of a household server for the seven days from `start` (as the approved week demo).
 * @param {string} start
 * @param {Set<string>} skipped
 * @returns {import('../../js/week.js').WeekEvent[]}
 */
function plan(start, skipped) {
    /** @type {import('../../js/week.js').WeekEvent[]} */
    const list = [];
    for (let i = 0; i < 7; i += 1) {
        const iso = shiftDay(start, i);
        const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
        list.push({
            id: `backup-${iso}`,
            start: at(iso, 2, 0),
            label: 'Backup photos',
            series: 1,
            detail: 'Nightly. Keeps 14 copies, about 12 minutes.',
        });
        list.push({ id: `prune-${iso}`, start: at(iso, 3, 15), label: 'Prune old snapshots', series: 3, detail: 'Nightly. Frees about 2 GB.' });
        list.push({
            id: `host-${iso}`,
            start: at(iso, 3, 30),
            label: "Host's own round",
            state: 'reference',
            detail: "The host's own nightly round (backups, updates), for reference.",
        });
        if (dow === 0 || dow === 3)
            list.push({
                id: `update-${iso}`,
                start: at(iso, 4, 0),
                label: 'Update images',
                series: 2,
                detail: 'Sundays and Wednesdays. Restarts three services.',
            });
        if (dow === 1)
            list.push({
                id: `certs-${iso}`,
                start: at(iso, 6, 0),
                label: 'Check certificates',
                series: 4,
                detail: 'Mondays. Warns 21 days before expiry.',
            });
        if (dow >= 1 && dow <= 5)
            list.push({
                id: `report-${iso}`,
                start: at(iso, 7, 30),
                label: 'Mail the report',
                series: 5,
                detail: 'Weekdays. A summary of the night.',
            });
        list.push({ id: `sync-${iso}`, start: at(iso, 12, 0), label: 'Sync the music library', series: 2, detail: 'Daily at noon.' });
        list.push({
            id: `export-${iso}`,
            start: at(iso, 22, 0),
            label: 'Export snapshots',
            series: 2,
            state: 'off',
            detail: 'Off. Nothing runs until you turn it on.',
        });
    }
    for (const event of list) if (skipped.has(event.id)) Object.assign(event, { state: 'skipped', detail: 'Skipped once from this page.' });
    const now = Date.now();
    const next = list.filter((e) => !e.state && Number(e.start) > now).sort((a, b) => Number(a.start) - Number(b.start))[0];
    if (next) next.state = 'next';
    return list;
}

attachWeeks(document);
const weekWide = byId('k3-week-wide');
const weekPhone = byId('k3-week-phone');
const weekLog = byId('k3-week-log');
const skipped = new Set();
const fillWeeks = () => {
    for (const el of [weekWide, weekPhone]) setWeekEvents(el, plan(today(), skipped));
};
fillWeeks();
for (const el of [weekWide, weekPhone])
    el.addEventListener(WEEK_OPEN_EVENT, (event) => {
        const { event: item, source } = /** @type {CustomEvent} */ (event).detail;
        say(weekLog, `opened ${item.label} (${source})`);
    });
byId('k3-week-skip').addEventListener('click', () => {
    const next = plan(today(), skipped).find((e) => e.state === 'next');
    if (!next) return;
    skipped.add(next.id);
    say(weekLog, `skipped ${next.label}`);
    fillWeeks();
});
const cycle = byId('k3-week-cycle');
const cycleSpin = /** @type {HTMLElement} */ (cycle.querySelector('.kp-spinner'));
const cycleWords = /** @type {HTMLElement} */ (cycle.querySelector('[data-k3-cycle-words]'));
const cycleRest = cycleWords.textContent ?? '';
cycle.addEventListener('click', () => {
    if (cycle.getAttribute('aria-disabled') === 'true') return;
    cycle.setAttribute('aria-disabled', 'true');
    cycleSpin.hidden = false;
    cycleWords.textContent = 'Loading · the runs arrive in 2 s';
    setWeekState(weekPhone, 'loading');
    window.setTimeout(() => {
        setWeekEvents(weekPhone, plan(today(), skipped));
        cycle.removeAttribute('aria-disabled');
        cycleSpin.hidden = true;
        cycleWords.textContent = cycleRest;
    }, 2000);
});

/* ------------------------------------------------------------ 5 · the facet list */

/** The dashboard's stack colour: a hue from the name (FNV-1a), the same everywhere. @param {string} name */
const hueOf = (name) => {
    let x = 2166136261;
    for (const ch of name) x = Math.imul(x ^ (ch.codePointAt(0) ?? 0), 16777619);
    return (x >>> 0) % 360;
};
const STACKS = [
    ['media', 214],
    ['photos', 96],
    ['immich', 41],
    ['nextcloud', 63],
    ['gitea', 18],
    ['vaultwarden', 7],
    ['pihole', 151],
];
const facets = byId('k3-facets');
const plain = byId('k3-facets-plain');
attachFacets(document);
setFacetItems(facets, [
    ...STACKS.map(([name, count]) => ({
        value: String(name),
        label: String(name),
        count: Number(count),
        swatch: `oklch(0.62 0.15 ${hueOf(String(name))})`,
        pattern: String(name),
    })),
    { value: 'wiki', label: 'wiki', count: 12 },
]);
setFacetItems(
    plain,
    STACKS.map(([name, count]) => ({
        value: String(name),
        label: String(name),
        count: Number(count),
        swatch: `oklch(0.62 0.15 ${hueOf(String(name))})`,
    })),
);
setFacetCounts(plain, {});
setFacetCounts(facets, {});
