// research/kpadopt4 (ideas sections, round 2: the uptime strip and the compare slider): the demo's wiring. The
// components are the package's own (js/uptime.js, js/compare.js); the sample data, the readouts and the buttons that
// drive a section are this page's (mock). Loaded before js/auto.js, so what is set here is what the page starts with.
// The sample days run up to a fixed day, 16/10/2026, so the page reads the same on every visit. The sections Kenny
// approved in round 1 left the page; their wiring is in _previous/ and in git at c1e907a8.

import { setUptime, attachUptimes, UPTIME_PICK_EVENT, UPTIME_OPEN_EVENT } from '../../js/uptime.js';

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** @param {HTMLElement} log @param {string} line */
const say = (log, line) => {
    const lines = (log.textContent ?? '').split('\n').filter(Boolean);
    lines.push(line);
    log.textContent = lines.slice(-3).join('\n');
};

/* ------------------------------------------------------------ 1 · the uptime strip */

/** A small seeded generator, so every visit draws the same history. @param {number} seed */
const seeded = (seed) => () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
};
const DAY = 86400000;
const END = Date.UTC(2026, 9, 16);
/** @param {number} ms */
const ddmmyyyy = (ms) => {
    const d = new Date(ms);
    return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
};

/**
 * Ninety days of one service.
 * @param {number} seed @param {{ down?: number, degraded?: number, unknown?: number }} odds @param {number} [none] days without data at the start
 * @returns {import('../../js/uptime.js').UptimePeriod[]}
 */
function days(seed, odds, none = 0) {
    const rand = seeded(seed);
    /** @type {import('../../js/uptime.js').UptimePeriod[]} */
    const out = [];
    for (let i = 89; i >= 0; i--) {
        const ms = END - i * DAY;
        const key = new Date(ms).toISOString().slice(0, 10);
        const label = ddmmyyyy(ms);
        const r = rand();
        if (89 - i < none) {
            out.push({ key, label, state: 'none' });
        } else if (r < (odds.down ?? 0)) {
            const uptime = 0.6 + rand() * 0.3;
            out.push({
                key,
                label,
                state: 'down',
                uptime,
                incidents: 1,
                tip: `${label} · down 2 h 14 min · 1 incident · ${(uptime * 100).toFixed(1)}% up`,
                details: [
                    'Down 02:10 to 04:24 (2 h 14 min)',
                    'The NAS share went away during its nightly scrub',
                    'Back by itself; no restart needed',
                ],
                href: `#day-${key}`,
            });
        } else if (r < (odds.down ?? 0) + (odds.degraded ?? 0)) {
            const uptime = 0.97 + rand() * 0.029;
            out.push({
                key,
                label,
                state: 'degraded',
                uptime,
                incidents: 1,
                tip: `${label} · slow answers for 38 min · 1 incident · ${(uptime * 100).toFixed(1)}% up`,
                details: ['Slow answers 19:02 to 19:40 (38 min)', 'Four transcodes at once filled the GPU'],
                href: `#day-${key}`,
            });
        } else {
            out.push({ key, label, state: 'up', uptime: 1, incidents: 0, href: `#day-${key}` });
        }
    }
    return out;
}

/** Forty-eight hours of one delivery queue. */
function hours() {
    const rand = seeded(7);
    /** @type {import('../../js/uptime.js').UptimePeriod[]} */
    const out = [];
    for (let i = 47; i >= 0; i--) {
        const ms = END + 14 * 3600000 - i * 3600000;
        const d = new Date(ms);
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const label = `${ddmmyyyy(ms)} ${hh}:00`;
        const r = rand();
        const state = i === 9 ? 'down' : r < 0.06 ? 'degraded' : 'up';
        out.push({
            key: d.toISOString().slice(0, 13),
            label,
            state,
            incidents: state === 'up' ? 0 : 1,
            ...(state === 'down' ? { details: ['No message delivered for 41 min', 'Home Assistant was restarting'] } : {}),
            ...(state === 'degraded' ? { details: ['Deliveries took 12 s on average (usually under 1 s)'] } : {}),
        });
    }
    return out;
}

const SERVICES = {
    jellyfin: days(11, {}),
    kyu: days(23, { down: 0.02, degraded: 0.05 }),
    almanac: days(31, { degraded: 0.03 }, 26),
};

const strips = {
    jellyfin: byId('ki-uptime-jellyfin'),
    kyu: byId('ki-uptime-kyu'),
    almanac: byId('ki-uptime-almanac'),
    hours: byId('ki-uptime-hours'),
};
// Quick info (open: 'info'): jellyfin, kyu and the hours. jellyfin and kyu also have a page per day, linked from it.
setUptime(strips.jellyfin, { label: 'jellyfin', periods: SERVICES.jellyfin, from: '90 days ago', to: 'Today', open: 'info' });
setUptime(strips.kyu, { label: 'kyu', periods: SERVICES.kyu, from: '90 days ago', to: 'Today', open: 'info' });
// A page per day and no quick info: every cell is a link to its day.
setUptime(strips.almanac, { label: 'almanac (added 64 days ago)', periods: SERVICES.almanac, from: '90 days ago', to: 'Today' });
setUptime(strips.hours, { label: 'kyu delivery, per hour', periods: hours(), from: '48 hours ago', to: 'This hour', open: 'info' });

const uptimeLog = byId('ki-uptime-log');
document.addEventListener(UPTIME_PICK_EVENT, (event) => {
    const { key, index, period } = /** @type {CustomEvent} */ (event).detail;
    say(uptimeLog, `kp-uptime-pick · key ${key} · index ${index} · ${period.state}`);
});
document.addEventListener(UPTIME_OPEN_EVENT, (event) => {
    const { key } = /** @type {CustomEvent} */ (event).detail;
    say(uptimeLog, `kp-uptime-open · key ${key} · the quick info opens`);
});
// The day pages are not part of this demo: a link to one says where it would go instead of jumping.
document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#day-"]') : null;
    if (!link) return;
    event.preventDefault();
    say(uptimeLog, `would open the page ${link.getAttribute('href')?.slice(1)}`);
});
attachUptimes(document);

/* ------------------------------------------------------------ 7 · the compare slider */

import { COMPARE_EVENT, COMPARE_RETRY_EVENT, setCompareBusy } from '../../js/compare.js';

const compareLog = byId('ki-compare-log');
document.addEventListener(COMPARE_EVENT, (event) => {
    say(compareLog, `kp-compare-change · ${/** @type {CustomEvent} */ (event).detail.position}`);
});
document.addEventListener(COMPARE_RETRY_EVENT, (event) => {
    say(compareLog, `kp-compare-retry · ${/** @type {CustomEvent} */ (event).detail.pane}`);
});
// Hold the first box in its loading state, as a page does while it reads its panes (setCompareBusy).
const loadingToggle = byId('ki-compare-loading');
loadingToggle.addEventListener('click', () => {
    const on = loadingToggle.getAttribute('aria-pressed') !== 'true';
    loadingToggle.setAttribute('aria-pressed', String(on));
    setCompareBusy(byId('ki-compare-img'), on);
});
// The loading state as it first stands, held for the review: the third box.
const held = document.getElementById('ki-compare-held');
if (held) {
    import('../../js/compare.js').then(({ attachCompares }) => {
        attachCompares(held);
        setCompareBusy(held, true);
    });
}
