// research/kpadopt6-calm: what this page does that the package does not.
//   1. the sample content, the fixed clock and the pretend server (a save that works or is refused);
//   2. the event readouts;
//   3. the buttons that drive a state or an option.
// Everything drawn is drawn by the package's own functions and attributes.
import { setRatingState } from '../../js/rating.js';
import { setQuoteState } from '../../js/quote.js';
import { setStatus, setTodayState } from '../../js/statusrow.js';
import { setCalendarDays, setCalendarState, setCalendarLegend, setCalendarCaption } from '../../js/calendar.js';
import { setHeat } from '../../js/heat.js';
import { setFocusSteps, setFocusStepsState } from '../../js/focus-steps.js';
import { setUsualState } from '../../js/usual-picker.js';
import { combobox } from '../../js/combobox.js';
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

// ---- 1 · picker with the usual on top -------------------------------------------------------------
{
    const a = document.getElementById('k6-usual-a');
    const write = (/** @type {string} */ text) => {
        const box = document.getElementById('k6-usual-log');
        if (!box) return;
        box.textContent = `${box.textContent ? `${box.textContent}\n` : ''}${text}`.split('\n').slice(-5).join('\n');
    };
    for (const kind of ['pick', 'add', 'not-today']) {
        a?.addEventListener(`kp-usual-${kind}`, (event) => write(`kp-usual-${kind} ${JSON.stringify(/** @type {CustomEvent} */ (event).detail)}`));
    }
    onButtons('data-k6-usual-opt', (name, button) => {
        const value = button.dataset.value ?? '';
        // The options are real attributes: changing one redraws the picker.
        for (const id of ['k6-usual-a', 'k6-usual-s', 'k6-usual-p']) document.getElementById(id)?.setAttribute(`data-kp-${name}`, value);
    });
    const driven = document.getElementById('k6-usual-s');
    driven?.addEventListener('kp-usual-retry', () => {
        setUsualState(driven, 'loading');
        void sleep(1000).then(() => setUsualState(driven, 'ready'));
    });
    onButtons('data-k6-usual-state', (value) => {
        if (!driven) return;
        if (value === 'empty') {
            driven.dataset.k6Saved = driven.querySelector('[role="listbox"]')?.innerHTML ?? '';
            driven.querySelector('[role="listbox"]')?.replaceChildren();
        } else if (driven.dataset.k6Saved) {
            const list = driven.querySelector('[role="listbox"]');
            if (list) list.innerHTML = driven.dataset.k6Saved;
            delete driven.dataset.k6Saved;
        }
        setUsualState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value === 'empty' ? 'ready' : value));
        // After a change of the options the picker reads them again.
        driven.setAttribute('data-kp-add', 'inline');
    });
    // The opened list is shown open on the page: opened once, the first time its case comes on screen, so it is placed
    // where there is room, and then left open (it follows its input while the page scrolls, js/top-layer.js). It used to
    // close whenever less than 90% of its case was on screen and open again once 90% was back; opening makes the case taller,
    // so a case half in view closed it, shrank, was in view again and reopened, several times a second.
    for (const openedId of ['k6-usual-o', 'k6-usual-c']) {
        const opened = document.getElementById(openedId);
        if (!opened || !('IntersectionObserver' in window)) continue;
        const watch = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            const handle = combobox(opened);
            if (!handle) return;
            watch.disconnect();
            handle.open();
        });
        watch.observe(opened.closest('.k6-case') ?? opened);
    }
}

// ---- 2 · questions, one per screen ----------------------------------------------------------------
{
    /** The check-in: yesterday's and the usual answers come from the app. @returns {import('../../js/focus-steps.js').FocusStep[]} */
    const checkin = () => [
        { text: 'How is your mood today?', answer: { id: 'mood', kind: 'choice', previous: 'matig', usual: 'good', choices: [{ value: 'rough', label: 'Rough' }, { value: 'matig', label: 'Matig' }, { value: 'good', label: 'Good' }, { value: 'great', label: 'Great' }] } },
        { text: 'And your energy?', answer: { id: 'energy', kind: 'choice', previous: 'okay', usual: 'okay', choices: [{ value: 'low', label: 'Low' }, { value: 'okay', label: 'Okay' }, { value: 'high', label: 'High' }] } },
        { text: 'Did anything feel like too much?', answer: { id: 'overload', kind: 'choice', previous: 'abit', choices: [{ value: 'none', label: 'Nothing' }, { value: 'abit', label: 'A bit' }, { value: 'alot', label: 'A lot' }] } },
        { text: 'What got in the way of sleep?', answer: { id: 'sleep', kind: 'multi', previous: ['noise'], choices: [{ value: 'noise', label: 'Noise' }, { value: 'thoughts', label: 'Thoughts' }, { value: 'pain', label: 'Pain' }, { value: 'heat', label: 'Heat' }, { value: 'nothing', label: 'Nothing' }] } },
        { text: 'How much did you move?', answer: { id: 'move', kind: 'choice', usual: 'short', choices: [{ value: 'none', label: 'Not at all' }, { value: 'short', label: 'A short walk' }, { value: 'long', label: 'A long walk' }, { value: 'sport', label: 'Sport', disabled: true, reason: 'Not while the moves are paused' }] } },
        { text: 'One sentence about today, if you like.', answer: { id: 'line', kind: 'text', placeholder: 'Write what you want, or press Not today' } },
    ];
    const root = /** @type {HTMLElement} */ (document.getElementById('k6-focus-a'));
    const logBox = document.getElementById('k6-focus-log');
    const lines = /** @type {string[]} */ ([]);
    const note = (/** @type {string} */ text) => {
        lines.push(text);
        log(logBox, lines.slice(-6).join('\n'));
    };
    setFocusSteps(root, checkin());
    root.addEventListener('kp-focus-steps-answer', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        note(`answer { id: '${d.id}', value: ${JSON.stringify(d.value)}, source: '${d.source}' }`);
    });
    root.addEventListener('kp-focus-steps-done', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        note(`done { total: ${d.total}, answers: ${Object.keys(d.answers ?? {}).length} }`);
    });
    const phone = /** @type {HTMLElement} */ (document.getElementById('k6-focus-p'));
    setFocusSteps(phone, checkin());
    onButtons('data-k6-focus-opt', (name, button) => {
        const value = button.dataset.value ?? '';
        // The options are real attributes: changing one redraws the view.
        for (const view of [root, phone]) view.setAttribute(`data-kp-${name}`, value);
    });
    document.querySelector('[data-k6-focus-restart]')?.addEventListener('click', () => {
        setFocusSteps(root, checkin());
        lines.length = 0;
        log(logBox, '');
    });
    // states
    const driven = /** @type {HTMLElement} */ (document.getElementById('k6-focus-s'));
    const sLog = document.getElementById('k6-focus-s-log');
    setFocusSteps(driven, checkin());
    driven.addEventListener('kp-focus-steps-done', (event) => {
        const answers = /** @type {CustomEvent} */ (event).detail.answers ?? {};
        log(sLog, `done: ${Object.keys(answers).length} answers kept in the page`);
        setFocusStepsState(driven, 'save-error');
    });
    driven.addEventListener('kp-focus-steps-retry', () => {
        setFocusStepsState(driven, 'loading');
        void sleep(1000).then(() => setFocusStepsState(driven, 'ready'));
    });
    driven.addEventListener('kp-focus-steps-save-retry', () => log(sLog, 'kp-focus-steps-save-retry: the page tries to save again'));
    onButtons('data-k6-focus-state', (value) => {
        if (value === 'empty') {
            setFocusSteps(driven, []);
            setFocusStepsState(driven, 'ready');
        } else {
            if (!driven.querySelector('.kp-focus-steps__choices, .kp-focus-steps__input, .kp-focus-steps__text')) setFocusSteps(driven, checkin());
            setFocusStepsState(driven, /** @type {'ready' | 'loading' | 'error' | 'save-error'} */ (value));
        }
    });
    const resume = /** @type {HTMLElement} */ (document.getElementById('k6-focus-r'));
    try {
        localStorage.removeItem('kp-remember:focus-steps:k6-checkin:progress');
    } catch {
        // No storage: the demo shows the question only.
    }
    setFocusSteps(resume, checkin());
    onButtons('data-k6-focus-resume', (value) => resume.setAttribute('data-kp-resume', value));
    document.querySelector('[data-k6-focus-reload]')?.addEventListener('click', () => setFocusSteps(resume, checkin()));
    const long = /** @type {HTMLElement} */ (document.getElementById('k6-focus-l'));
    setFocusSteps(long, [
        { text: 'Thinking about the whole of this week, including the evenings you spent on the phone with your family and the mornings that started too early, how would you describe the way you have been feeling in general?', answer: { id: 'week', kind: 'choice', choices: [{ value: 'a', label: 'Mostly calm, with a few hard moments that passed on their own' }, { value: 'b', label: 'Tired in a way that sleep did not fix, and short with the people around me' }, { value: 'c', label: 'Hard to say', disabled: true, reason: 'Not while the moves are paused' }] } },
    ]);
}

// ---- 4 · quote options ----------------------------------------------------------------------------
{
    onButtons('data-k6-quote-opt', (name, button) => {
        const value = button.dataset.value ?? '';
        for (const id of ['k6-quote-a', 'k6-quote-long']) {
            const card = document.getElementById(id);
            if (!card) continue;
            if (name === 'hide') {
                if (value === 'off') card.setAttribute('data-kp-quote-hide', 'off');
                else card.removeAttribute('data-kp-quote-hide');
            } else card.setAttribute(`data-kp-quote-${name}`, value);
        }
    });
}

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
        // A real option: the attribute changes and the lists draw it again.
        for (const id of ['k6-today-a', 'k6-today-b']) listOf(id).setAttribute('data-kp-today-since', value);
    });
    document.querySelector('[data-k6-today-pause]')?.addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.currentTarget);
        const on = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(on));
        for (const id of ['k6-today-a', 'k6-today-b']) {
            const list = listOf(id);
            list.toggleAttribute('data-kp-today-pause', on);
        }
    });
    document.querySelector('[data-k6-today-failed]')?.addEventListener('click', () => {
        setStatus(a, 'walk', { state: /** @type {any} */ ('failed') });
    });
    onButtons('data-k6-today-fold', (value) => {
        const list = listOf('k6-today-b');
        list.setAttribute('data-kp-today-paused', value);
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
    // The heat grid: three habits over a week.
    const heat = document.getElementById('k6-heat');
    if (heat) {
        const days = Array.from({ length: 7 }, (_, i) => ({ key: iso(i + 10), label: String(i + 10) }));
        /** @param {string} pattern */
        const cells = (pattern) =>
            [...pattern].map((c, i) =>
                c === 'x'
                    ? { tone: /** @type {const} */ ('logged'), label: 'logged' }
                    : c === 'p'
                      ? { tone: /** @type {const} */ ('paused'), label: 'paused' }
                      : i === 3
                        ? { tone: /** @type {any} */ ('bad'), label: 'missed' }
                        : { tone: /** @type {const} */ ('quiet'), label: 'nothing logged' },
            );
        setHeat(heat, {
            columns: days,
            rows: [
                { key: 'walk', label: 'Walk', cells: cells('xx.x..x') },
                { key: 'stretch', label: 'Stretch', cells: cells('x.x.x.p') },
                { key: 'journal', label: 'Journal', cells: cells('xx.xxx.') },
            ],
            every: 1,
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
        // `data-kp-legend` is a real option: changing it draws the legend or takes it away.
        for (const el of [calmSet[0], calmSet[1], calmSet[2]]) {
            if (value === 'hide') el?.setAttribute('data-kp-legend', 'hide');
            else el?.removeAttribute('data-kp-legend');
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
    onButtons('data-k6-rating-opt', (name, button) => {
        const first = document.getElementById('k6-rate-a');
        const value = button.dataset.value ?? '';
        // The options are real attributes: changing one draws the row again.
        first?.setAttribute(`data-kp-rating-${name}`, value);
    });
}
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

// ---- the review dialog's default sets ---------------------------------------------------------------
// A choice set only asks for the default (defaults-1017); every option in it is a real option of the component, so
// pressing one in the dialog presses the demo's own button for it, or writes the component's attribute.
{
    /** choice id → the selector of the demo's button for a value. */
    /** @type {Record<string, (v: string) => string>} */
    const buttonFor = {
        'usual-typing': (v) => `[data-k6-usual-opt="usual-while-typing"][data-value="${v}"]`,
        'usual-near': (v) => `[data-k6-usual-opt="near"][data-value="${v}"]`,
        'usual-fold': (v) => `[data-k6-usual-opt="all"][data-value="${v}"]`,
        'focus-progress': (v) => `[data-k6-focus-opt="progress"][data-value="${v}"]`,
        'focus-advance': (v) => `[data-k6-focus-opt="advance"][data-value="${v}"]`,
        'today-since': (v) => `[data-k6-today-since="${v}"]`,
        'quote-date': (v) => `[data-k6-quote-opt="date-style"][data-value="${v}"]`,
        'quote-fold': (v) => `[data-k6-quote-opt="lines"][data-value="${v}"]`,
        'calm-fill': (v) => `[data-k6-calm-fill="${v}"]`,
        'calm-legend': (v) => `[data-k6-calm-legend="${v}"]`,
        'rating-commit': (v) => `[data-k6-rating-opt="commit"][data-value="${v}"]`,
    };
    /** Options with no button of their own: the component's attribute is written on the cards that show it. */
    /** @type {Record<string, { ids: string[], inner: string, name: string, plain: string }>} */
    const attributeFor = {
        'today-order': { ids: ['k6-today-a', 'k6-today-b'], inner: '.kp-statuslist', name: 'data-kp-today-order', plain: 'given' },
        'rating-preview': { ids: ['k6-rate-a'], inner: '', name: 'data-kp-rating-preview', plain: 'present' },
    };
    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        const selector = buttonFor[id]?.(String(value));
        if (selector) return void document.querySelector(selector)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const attribute = attributeFor[id];
        if (!attribute) return;
        for (const cardId of attribute.ids) {
            const card = document.getElementById(cardId);
            const target = attribute.inner ? card?.querySelector(attribute.inner) : card;
            if (!target) continue;
            if (value === attribute.plain) target.removeAttribute(attribute.name);
            else target.setAttribute(attribute.name, String(value));
        }
    });
}
