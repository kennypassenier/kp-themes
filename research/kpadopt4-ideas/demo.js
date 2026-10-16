// research/kpadopt4-ideas: the demo's wiring. The components are the package's own (js/uptime.js and the others named
// per section); the sample data, the readouts and the buttons that drive a section are this page's (mock). Loaded
// before js/auto.js, so what is set here is what the page starts with. The sample days run up to a fixed day,
// 16/10/2026, so the page reads the same on every visit.

import { setUptime, attachUptimes, UPTIME_PICK_EVENT } from '../../js/uptime.js';
import { SEGMENTED_EVENT } from '../../js/segmented.js';

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
            });
        } else {
            out.push({ key, label, state: 'up', uptime: 1, incidents: 0 });
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
        out.push({ key: d.toISOString().slice(0, 13), label, state, incidents: state === 'up' ? 0 : 1 });
    }
    return out;
}

const SERVICES = {
    jellyfin: days(11, {}),
    kyu: days(23, { down: 0.02, degraded: 0.05 }),
    almanac: days(31, { degraded: 0.03 }, 26),
};

const strips = {
    jellyfin: byId('k4-uptime-jellyfin'),
    kyu: byId('k4-uptime-kyu'),
    almanac: byId('k4-uptime-almanac'),
    hours: byId('k4-uptime-hours'),
};
setUptime(strips.jellyfin, { label: 'jellyfin', periods: SERVICES.jellyfin, from: '90 days ago', to: 'Today' });
setUptime(strips.kyu, { label: 'kyu', periods: SERVICES.kyu, from: '90 days ago', to: 'Today' });
setUptime(strips.almanac, { label: 'almanac (added 64 days ago)', periods: SERVICES.almanac, from: '90 days ago', to: 'Today' });
setUptime(strips.hours, { label: 'kyu delivery, per hour', periods: hours(), from: '48 hours ago', to: 'This hour' });

// The states strip: the control above it sets its state.
const stateStrip = byId('k4-uptime-state');
const LONG = 'jellyfin media server on CT 106, the one the whole family watches in the evening, with transcoding';
/** @param {string} state */
const showState = (state) => {
    if (state === 'loading') setUptime(stateStrip, { label: 'kyu', state: 'loading', count: 90 });
    else if (state === 'empty') setUptime(stateStrip, { label: 'kyu', state: 'empty', count: 90, from: '90 days ago', to: 'Today' });
    else if (state === 'error') setUptime(stateStrip, { label: 'kyu', state: 'error', count: 90, error: 'Health did not answer.' });
    else if (state === 'long') setUptime(stateStrip, { label: LONG, periods: SERVICES.kyu, from: '90 days ago', to: 'Today' });
    else setUptime(stateStrip, { label: 'kyu', periods: SERVICES.kyu, from: '90 days ago', to: 'Today' });
};
showState('loading');
byId('k4-uptime-states').addEventListener(SEGMENTED_EVENT, (event) => showState(/** @type {CustomEvent} */ (event).detail.value));

// Phone width: the same history, fitting and scrolling.
setUptime(byId('k4-uptime-phone-fit'), { label: 'kyu', periods: SERVICES.kyu, from: '90 days ago', to: 'Today' });
setUptime(byId('k4-uptime-phone-scroll'), { label: 'kyu', periods: SERVICES.kyu, from: '90 days ago', to: 'Today' });
setUptime(byId('k4-uptime-phone-loading'), { label: 'kyu', state: 'loading', count: 90 });

const uptimeLog = byId('k4-uptime-log');
document.addEventListener(UPTIME_PICK_EVENT, (event) => {
    const { key, index, period } = /** @type {CustomEvent} */ (event).detail;
    say(uptimeLog, `kp-uptime-pick · key ${key} · index ${index} · ${period.state}`);
});
attachUptimes(document);

/* ------------------------------------------------------------ 2 · the typed confirmation */

import { TYPE_CONFIRM_EVENT } from '../../js/components.js';

const typeLog = byId('k4-type-log');
// The long list of what the long one deletes.
const longList = byId('k4-lost-long').content.querySelector('ul');
for (let i = 1; i <= 24; i++) {
    const li = document.createElement('li');
    li.textContent = `snapshot ${String(i).padStart(2, '0')} · ${String(((i * 3) % 28) + 1).padStart(2, '0')}/09/2026 03:12 · 1.${i} GB`;
    longList?.append(li);
}
document.addEventListener(TYPE_CONFIRM_EVENT, (event) => {
    const { matched, value } = /** @type {CustomEvent} */ (event).detail;
    say(typeLog, `kp-type-confirm · "${value}" · ${matched ? 'matches' : 'does not match'}`);
});
document.addEventListener('click', (event) => {
    const act = event.target instanceof Element ? event.target.closest('[data-k4-act]') : null;
    if (act instanceof HTMLButtonElement && !act.disabled) say(typeLog, `pressed: ${act.dataset.k4Act}`);
});
// The states shown at once: type into the blocks that carry a value once js/auto.js has filled them.
const typeIn = () => {
    for (const block of document.querySelectorAll('[data-k4-typed]')) {
        const input = block.querySelector('input');
        if (!input) return false;
        input.value = /** @type {HTMLElement} */ (block).dataset.k4Typed ?? '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
};
const waitTyped = () => {
    if (!typeIn()) requestAnimationFrame(waitTyped);
};
waitTyped();

/* ------------------------------------------------------------ 3 · the command block */

const cmdLog = byId('k4-cmd-log');
document.addEventListener('kp-copy', (event) => {
    const text = /** @type {CustomEvent} */ (event).detail.text;
    say(cmdLog, `kp-copy · ${text.split('\n').length} line(s) · ${JSON.stringify(text.slice(0, 70))}${text.length > 70 ? '…' : ''}`);
});
document.addEventListener('kp-copy-failed', () => say(cmdLog, 'kp-copy-failed · the clipboard refused'));
// Demo only: a clipboard that refuses, to show the failure state.
const refuse = byId('k4-cmd-refuse');
const realWrite = navigator.clipboard?.writeText?.bind(navigator.clipboard);
refuse.addEventListener('click', () => {
    const on = refuse.getAttribute('aria-pressed') !== 'true';
    refuse.setAttribute('aria-pressed', String(on));
    if (navigator.clipboard)
        navigator.clipboard.writeText = on ? () => Promise.reject(new DOMException('Refused for the demo', 'NotAllowedError')) : realWrite;
});

/* ------------------------------------------------------------ 4 and 5 · the timers */

import { attachTimerDiscs } from '../../js/timer-disc.js';
import { attachCountdowns, countdownOf, COUNTDOWN_EVENT, COUNTDOWN_END_EVENT } from '../../js/countdown.js';
import { timerDiscOf } from '../../js/timer-disc.js';

// The states shown at once run on demo clocks the page moves by hand (mock), one per state; the live timers above run
// on the real one.
const times = { idle: 0, running: 0, paused: 0, ended: 0 };
const held = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-k4-clock]')]);
for (const el of held) {
    const state = /** @type {keyof typeof times} */ (el.dataset.k4Clock);
    const now = () => times[state];
    if (el.matches('.kp-timer-disc')) attachTimerDiscs(el, { now });
    else attachCountdowns(el, { now });
}
const clockOf = (/** @type {HTMLElement} */ el) => timerDiscOf(el) ?? countdownOf(el);
for (const el of held) if (el.dataset.k4Clock !== 'idle') clockOf(el)?.start();
times.running = 3 * 60000; // seven of ten minutes left
times.paused = 6 * 60000; // four left, then paused
for (const el of held) if (el.dataset.k4Clock === 'paused') clockOf(el)?.pause();
times.ended = 11 * 60000; // the time is up
for (const el of held) if (el.dataset.k4Clock === 'ended') clockOf(el)?.state();

const discLog = byId('k4-disc-log');
const countLog = byId('k4-countdown-log');
for (const [event, word] of [
    [COUNTDOWN_EVENT, 'kp-countdown-change'],
    [COUNTDOWN_END_EVENT, 'kp-countdown-end'],
]) {
    document.addEventListener(event, (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (target.dataset.k4Clock) return;
        const d = /** @type {CustomEvent} */ (e).detail;
        const name = target.dataset.kpTimerDiscName ?? target.dataset.kpCountdownName;
        const line = `${word} · ${name} · ${d.state ?? 'ended'}${d.remaining !== undefined ? ` · ${Math.ceil(d.remaining / 1000)} s left` : ''}`;
        say(target.matches('.kp-timer-disc') ? discLog : countLog, line);
    });
}

/* ------------------------------------------------------------ 6 · the range picker */

import { RANGE_EVENT, attachRanges } from '../../js/range.js';

attachRanges(document);
const rangeLog = byId('k4-range-log');
document.addEventListener(RANGE_EVENT, (event) => {
    const d = /** @type {CustomEvent} */ (event).detail;
    say(rangeLog, `kp-range-change · ${d.preset ?? 'custom'} · ${d.start} → ${d.end}`);
});
// Demo only: open the custom panel with the end before the start, and apply it.
byId('k4-range-wrong').addEventListener('click', () => {
    const main = byId('k4-range-main');
    /** @type {HTMLButtonElement} */ (main.querySelector('.kp-range__custom')).click();
    requestAnimationFrame(() => {
        const times = /** @type {NodeListOf<HTMLInputElement>} */ (main.querySelectorAll('.kp-range__time'));
        const dates = main.querySelectorAll('.kp-range__date');
        const [a, b] = [
            /** @type {HTMLInputElement} */ (dates[0].querySelector('input')),
            /** @type {HTMLInputElement} */ (dates[1].querySelector('input')),
        ];
        const swap = a.value;
        a.value = b.value;
        b.value = swap;
        for (const input of [a, b]) input.dispatchEvent(new Event('change', { bubbles: true }));
        times[0].value = '18:00';
        times[1].value = '09:00';
        /** @type {HTMLButtonElement} */ (main.querySelector('.kp-range__actions .kp-button--primary')).click();
    });
});
