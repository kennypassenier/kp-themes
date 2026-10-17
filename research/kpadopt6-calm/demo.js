// research/kpadopt6-calm: what this page does that the package does not.
//   1. the sample content, the fixed clock and the pretend server (a save that works or is refused);
//   2. the event readouts;
//   3. the buttons that drive a state or an option.
// Everything drawn is drawn by the package's own functions and attributes.
import { setRatingState } from '../../js/rating.js';
import { setQuoteState } from '../../js/quote.js';
import { setStatus, settleToday, setTodayState } from '../../js/statusrow.js';
import { setCalendarDays, setCalendarState, setCalendarLegend, setCalendarCaption } from '../../js/calendar.js';
import { setHeat } from '../../js/heat.js';
import { setUptime } from '../../js/uptime.js';

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
    const group = button.closest('[role="group"]');
    for (const other of all('button[aria-pressed]', group ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** @param {string} attr @param {(value: string, button: HTMLElement) => void} run */
function onButtons(attr, run) {
    for (const button of all(`[${attr}]`)) {
        button.addEventListener('click', () => {
            if (button.hasAttribute('aria-pressed')) pressOnly(button);
            run(button.getAttribute(attr) ?? '', button);
        });
    }
}

/** @param {HTMLElement | null} box @param {string} text */
const log = (box, text) => {
    if (box) box.textContent = text;
};

// ---- 3 · today card ------------------------------------------------------------------------------
{
    const listOf = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.querySelector(`#${id} .kp-statuslist`));
    const a = listOf('k6-today-a');
    for (const id of ['k6-today-a', 'k6-today-b']) {
        listOf(id).addEventListener('kp-status-resume', (event) => {
            log(document.getElementById('k6-today-log'), `kp-status-resume { id: '${/** @type {CustomEvent} */ (event).detail.id}' }`);
        });
        listOf(id).addEventListener('kp-status-undo', (event) => {
            log(document.getElementById('k6-today-log'), `kp-status-undo { id: '${/** @type {CustomEvent} */ (event).detail.id}', action: '${/** @type {CustomEvent} */ (event).detail.action}' }`);
        });
    }
    onButtons('data-k6-today-since', (value) => {
        for (const id of ['k6-today-a', 'k6-today-b']) {
            const list = listOf(id);
            if (value === 'date') list.removeAttribute('data-kp-today-since');
            else list.setAttribute('data-kp-today-since', value);
            for (const row of list.querySelectorAll('.kp-statusrow[data-state="paused"]')) setStatus(list, row.getAttribute('data-kp-status-id') ?? '', { state: 'paused' });
        }
    });
    document.querySelector('[data-k6-today-pause]')?.addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.currentTarget);
        const on = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(on));
        for (const id of ['k6-today-a', 'k6-today-b']) {
            const list = listOf(id);
            list.toggleAttribute('data-kp-today-pause', on);
            for (const row of list.querySelectorAll('.kp-statusrow:not(.kp-statusrow--fold)')) setStatus(list, row.getAttribute('data-kp-status-id') ?? '', {});
        }
    });
    document.querySelector('[data-k6-today-failed]')?.addEventListener('click', () => {
        setStatus(a, 'walk', { state: /** @type {any} */ ('failed') });
    });
    onButtons('data-k6-today-fold', (value) => {
        const list = listOf('k6-today-b');
        list.setAttribute('data-kp-today-paused', value);
        settleToday(list);
    });
    const driven = /** @type {HTMLElement} */ (document.getElementById('k6-today-s'));
    driven.addEventListener('kp-card-retry', () => {
        setTodayState(driven, 'loading');
        void sleep(1000).then(() => setTodayState(driven, 'ready'));
    });
    onButtons('data-k6-today-state', (value) => setTodayState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value)));
}

// ---- 4 · quote card ------------------------------------------------------------------------------
{
    const first = document.getElementById('k6-quote-a');
    first?.addEventListener('kp-quote-hide', (event) => {
        log(document.getElementById('k6-quote-log'), 'kp-quote-hide: the page was told, after the Undo window');
        void event;
    });
    const driven = document.getElementById('k6-quote-state');
    let refuse = false;
    driven?.addEventListener('kp-quote-hide', (event) => {
        const { wait } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-quote-state-log'), refuse ? 'kp-quote-hide: the save is refused' : 'kp-quote-hide: saved');
        wait(sleep(600).then(() => (refuse ? Promise.reject(new Error('The note could not be hidden')) : undefined)));
    });
    driven?.addEventListener('kp-quote-retry', () => {
        log(document.getElementById('k6-quote-state-log'), 'kp-quote-retry');
        if (driven) {
            setQuoteState(driven, 'loading');
            void sleep(1000).then(() => setQuoteState(driven, 'ready'));
        }
    });
    onButtons('data-k6-quote-state', (value) => {
        if (driven) setQuoteState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value));
    });
    onButtons('data-k6-quote-hide', (value) => {
        refuse = value === 'refused';
    });
}

// ---- 5 · calm days -------------------------------------------------------------------------------
{
    const LOGGED = [1, 2, 7, 8, 9, 12, 13, 14, 15];
    const MINUTES = { 1: 20, 2: 35, 7: 15, 8: 40, 9: 25, 12: 30, 13: 45, 14: 20, 15: 10 };
    const iso = (/** @type {number} */ d) => `2026-10-${String(d).padStart(2, '0')}`;
    /** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
    const calm = {};
    /** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
    const standard = {};
    for (let d = 1; d <= 16; d += 1) {
        const minutes = /** @type {Record<number, number>} */ (MINUTES)[d];
        if (LOGGED.includes(d)) {
            calm[iso(d)] = { tone: 'logged', count: String(minutes), label: `${minutes} minutes` };
            standard[iso(d)] = { tone: 'ok', count: String(minutes), label: `${minutes} minutes` };
        } else standard[iso(d)] = { tone: 'bad', label: 'missed' };
    }
    const calmSet = ['k6-cal-a', 'k6-cal-s', 'k6-cal-p'].map((id) => /** @type {HTMLElement} */ (document.getElementById(id)));
    const apply = () => {
        for (const el of calmSet) setCalendarDays(el, calm);
        const b = document.getElementById('k6-cal-b');
        if (b) setCalendarDays(b, standard);
    };
    // The calendars are built by js/auto.js; wait for them.
    const ready = () => calmSet.every((el) => el?.querySelector('.kp-calendar__grid'));
    const wait = async () => {
        for (let i = 0; i < 60 && !ready(); i += 1) await sleep(100);
        apply();
        setCalendarCaption(calmSet[1], 'Trends count the days that were logged');
        const b = document.getElementById('k6-cal-b');
        if (b) setCalendarLegend(b, [{ tone: 'ok', label: 'Done' }, { tone: 'bad', label: 'Missed' }]);
    };
    void wait();
    calmSet[0]?.addEventListener('kp-calendar-pick', (event) => {
        log(document.getElementById('k6-cal-log'), `kp-calendar-pick { date: '${/** @type {CustomEvent} */ (event).detail.date}' }`);
    });
    // The heat grid: three habits over the last fourteen days.
    const heat = document.getElementById('k6-heat');
    if (heat) {
        const days = Array.from({ length: 14 }, (_, i) => ({ key: iso(i + 3), label: String(i + 3), minor: i % 2 === 1 }));
        /** @param {string} pattern */
        const cells = (pattern) =>
            [...pattern].map((c, i) =>
                c === 'x'
                    ? { tone: /** @type {const} */ ('logged'), label: 'logged' }
                    : c === 'p'
                      ? { tone: /** @type {const} */ ('paused'), label: 'paused' }
                      : i === 9
                        ? { tone: /** @type {any} */ ('bad'), label: 'missed' }
                        : { tone: /** @type {const} */ ('quiet'), label: 'nothing logged' },
            );
        setHeat(heat, {
            columns: days,
            rows: [
                { key: 'walk', label: 'Walk', cells: cells('ppppx..xx.x.xx') },
                { key: 'stretch', label: 'Stretch', cells: cells('x.x.x.x..xx..x') },
                { key: 'journal', label: 'Journal', cells: cells('xxx.xxx.x.xx.x') },
            ],
            every: 2,
        });
    }
    // The uptime strip: thirty days of a plant being watered; `down` is a day nothing was logged.
    const up = document.getElementById('k6-up');
    if (up) {
        const periods = Array.from({ length: 30 }, (_, i) => {
            const day = new Date(Date.UTC(2026, 8, 18 + i));
            const label = `${String(day.getUTCDate()).padStart(2, '0')}/${String(day.getUTCMonth() + 1).padStart(2, '0')}/2026`;
            const state = /** @type {'up' | 'down' | 'none'} */ (i % 7 === 3 || i % 11 === 5 ? 'down' : i > 27 ? 'none' : 'up');
            return { key: day.toISOString().slice(0, 10), label, state };
        });
        setUptime(up, { label: 'Zamioculcas Raven: water', periods, from: '30 days ago', to: 'Today' });
    }
    onButtons('data-k6-calm-fill', (value) => {
        for (const el of document.querySelectorAll('.kp-calendar[data-kp-tones="calm"], .kp-heat[data-kp-tones="calm"], .kp-uptime[data-kp-tones="calm"]')) {
            if (value === 'success') el.setAttribute('data-kp-logged-fill', 'success');
            else el.removeAttribute('data-kp-logged-fill');
        }
    });
    onButtons('data-k6-calm-legend', (value) => {
        for (const el of [calmSet[0], calmSet[1], calmSet[2]]) {
            if (!el) continue;
            setCalendarLegend(
                el,
                value === 'hide'
                    ? []
                    : [
                          { tone: 'logged', label: 'Logged' },
                          { tone: 'quiet', label: 'Nothing logged' },
                          { tone: 'paused', label: 'Paused' },
                      ],
            );
        }
    });
    const driven = calmSet[1];
    driven?.addEventListener('kp-calendar-retry', () => {
        setCalendarState(driven, 'loading');
        void sleep(1000).then(() => setCalendarState(driven, 'ready'));
    });
    onButtons('data-k6-cal-state', (value) => {
        if (driven) setCalendarState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value));
    });
}

// ---- 6 · star rating -----------------------------------------------------------------------------
{
    const first = document.getElementById('k6-rate-a');
    first?.addEventListener('kp-rating-change', (event) => {
        const { value, previous, source } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-rate-log'), `kp-rating-change { value: ${value}, previous: ${previous}, source: '${source}' }`);
    });
    const driven = document.getElementById('k6-rate-state');
    let refuse = false;
    driven?.addEventListener('kp-rating-change', (event) => {
        const { value, previous, source, wait } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-rate-state-log'), `kp-rating-change { value: ${value}, previous: ${previous}, source: '${source}' }`);
        wait(sleep(700).then(() => (refuse ? Promise.reject(new Error('refused')) : undefined)));
    });
    driven?.addEventListener('kp-rating-retry', () => {
        log(document.getElementById('k6-rate-state-log'), 'kp-rating-retry');
        if (driven) {
            setRatingState(driven, 'loading');
            void sleep(900).then(() => setRatingState(driven, 'ready'));
        }
    });
    onButtons('data-k6-rating-state', (value) => {
        if (driven) setRatingState(driven, /** @type {'ready' | 'loading' | 'error'} */ (value));
    });
    onButtons('data-k6-rating-save', (value) => {
        refuse = value === 'refused';
    });
}
