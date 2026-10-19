// research/audhd-recepten/timing: backward timing for the recipe app. The components are the package's; this file gives them the
// sample dish (its steps and tracks), a demo clock and the state buttons. Nothing here is saved anywhere: it is all mock data.
import { sentence } from '../../../js/sentence.js';
import { setTime } from '../../../js/timefield.js';
import { setCardState } from '../../../js/card-state.js';
import {
    attachGantts,
    setGanttKinds,
    setGanttLegend,
    setGanttPoints,
    setGanttRuns,
    setGanttState,
    setGanttZones,
} from '../../../js/gantt.js';
import { attachTimerDiscs, timerDiscOf } from '../../../js/timer-disc.js';
import { attachCountdowns, countdownOf } from '../../../js/countdown.js';
import { setAttention } from '../../../js/attention.js';
import { attachSnoozes, setSnoozedUntil } from '../../../js/snooze.js';

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

const $ = (/** @type {string} */ selector) => /** @type {HTMLElement | null} */ (document.querySelector(selector));
const $$ = (/** @type {string} */ selector) => /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);
const MIN = 60000;

// ---- the dish and its clock ---------------------------------------------------------------------------------------------------------
// 18/10/2026 00:00 in Brussels (CEST, UTC+2): every time on this page is a minute count from here.
const DAY0 = Date.UTC(2026, 9, 18, -2, 0);
/** @param {string} hm `HH:MM` @returns {number} epoch ms */
const at = (hm) => {
    const [h, m] = hm.split(':').map(Number);
    return DAY0 + (h * 60 + m) * MIN;
};
/** @param {number} ms @returns {string} `HH:MM` */
const hm = (ms) => {
    const total = Math.round((ms - DAY0) / MIN);
    const day = ((total % 1440) + 1440) % 1440;
    return `${String(Math.floor(day / 60)).padStart(2, '0')}:${String(day % 60).padStart(2, '0')}`;
};
/** @param {number} minutes @returns {string} "50 minutes" or "1 h 18 min" */
const words = (minutes) => (minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} minutes`);

/**
 * The recipe's step times. `active` steps are done with the hands (a slow day stretches them); the others run on their own, so the
 * person may walk away. Tracks run side by side and each one ends at dinner.
 */
const RECIPE = {
    tracks: [
        {
            id: 'pasta',
            label: 'Pasta',
            series: /** @type {const} */ (1),
            steps: [
                { label: 'Water on', say: 'put the pasta water on', mins: 12, active: false },
                { label: 'Cook pasta', say: 'cook the spaghetti', mins: 11, active: false },
                { label: 'Drain', say: 'drain and toss', mins: 2, active: true },
            ],
        },
        {
            id: 'sauce',
            label: 'Sauce',
            series: /** @type {const} */ (2),
            steps: [
                { label: 'Chop', say: 'chop the onion and garlic', mins: 10, active: true },
                { label: 'Brown balls', say: 'brown the meatballs', mins: 10, active: true },
                { label: 'Simmer', say: 'let the sauce simmer', mins: 25, active: false },
                { label: 'Taste', say: 'taste and season', mins: 5, active: true },
            ],
        },
        {
            id: 'oven',
            label: 'Oven',
            series: /** @type {const} */ (3),
            steps: [
                { label: 'Oven on', say: 'switch the oven on', mins: 15, active: false },
                { label: 'Bake bread', say: 'bake the garlic bread', mins: 12, active: false },
                { label: 'Slice', say: 'rest and slice the bread', mins: 3, active: true },
            ],
        },
    ],
};

/**
 * Count back from dinner: every track ends `spare` minutes before it, each step takes its minutes (hands-on ones stretched by the
 * pace), and a track starts where its first step starts.
 * @param {{ serve: number, spare?: number, pace?: number }} input
 */
function plan({ serve, spare = 0, pace = 1 }) {
    const end = serve - spare * MIN;
    const tracks = RECIPE.tracks.map((track) => {
        let cursor = end;
        const steps = [...track.steps]
            .reverse()
            .map((step, back) => {
                const mins = Math.ceil(step.mins * (step.active ? pace : 1));
                cursor -= mins * MIN;
                return { ...step, mins, track: track.id, id: `${track.id}-${track.steps.length - 1 - back}`, start: cursor, end: cursor + mins * MIN };
            })
            .reverse();
        return { ...track, steps, start: cursor };
    });
    const start = Math.min(...tracks.map((t) => t.start));
    const first = tracks.flatMap((t) => t.steps).find((s) => s.start === start);
    return { serve, end, tracks, start, total: end - start, first: first?.say ?? '' };
}

/** "Chop onion and garlic" at the start, "switch the oven on" at 18:00 and "put the pasta water on" at 18:05, in one sentence. */
function startsInWords(/** @type {ReturnType<typeof plan>} */ p) {
    const sorted = [...p.tracks].sort((a, b) => a.start - b.start);
    const parts = sorted.map((t) => `${t.steps[0].say} at ${hm(t.start)}`);
    return `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1)}, ${parts.slice(1).join(' and ')}.`;
}

/**
 * A clock that can run at any speed and be moved, and never jumps when its speed changes.
 * @param {string} start `HH:MM`
 * @param {number} speed 0 holds it, 60 is a minute a second
 */
function makeClock(start, speed) {
    const c = { base: at(start), acc: 0, last: performance.now(), speed };
    const now = () => {
        const t = performance.now();
        c.acc += (t - c.last) * c.speed;
        c.last = t;
        return c.base + c.acc;
    };
    return {
        now,
        speed: () => c.speed,
        setSpeed(/** @type {number} */ next) {
            now();
            c.speed = next;
        },
        set(/** @type {number} */ ms) {
            c.base = ms;
            c.acc = 0;
            c.last = performance.now();
        },
        jump(/** @type {number} */ ms) {
            now();
            c.acc += ms;
        },
    };
}

/** A package button, as the card's own actions are. @param {string} text @param {string} [extra] */
function button(text, extra = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `kp-button ${extra}`.trim();
    b.textContent = text;
    return b;
}

/**
 * The state buttons of a group: a press marks it and runs `apply`; `mark` sets the pressed one from the page's side.
 * @param {string} attribute
 * @param {(value: string) => void} apply
 */
function group(attribute, apply) {
    const buttons = $$(`[${attribute}]`);
    const mark = (/** @type {string} */ value) => {
        for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
    };
    for (const b of buttons)
        b.addEventListener('click', () => {
            mark(b.getAttribute(attribute) ?? '');
            apply(b.getAttribute(attribute) ?? '');
        });
    return mark;
}

/**
 * The four states of a card that shows what a recipe says: the busy card, a plate that explains a recipe without step times, and a
 * failure with Try again. `ready` runs `show`, the page's own drawing of the data.
 * @param {HTMLElement} card
 * @param {{ what: string, show: () => void, mark: (value: string) => void, loading?: () => void }} how
 */
function recipeStates(card, { what, show, mark, loading }) {
    /** @type {number} */
    let timer = 0;
    /** @param {string} state */
    const set = (state) => {
        clearTimeout(timer);
        if (state === 'ready') {
            setCardState(card, 'ready');
            show();
        } else if (state === 'loading') {
            loading?.();
            setCardState(card, 'loading');
            // The mock read finishes by itself after a while so a reviewer is never left on a spinner.
            timer = window.setTimeout(() => {
                mark('ready');
                set('ready');
            }, 6000);
        } else if (state === 'empty') {
            const add = button('Add step times', 'kp-button--primary');
            add.addEventListener('click', () => {
                mark('ready');
                set('ready');
            });
            setCardState(card, 'empty', {
                title: 'This recipe has no step times yet',
                text: `Counting back needs to know how long each step takes. Give every step a time and ${what} fills itself in.`,
                action: add,
            });
        } else {
            setCardState(card, 'error', {
                title: 'The step times could not be read',
                text: 'The recipe is still there; its step times did not arrive. Nothing was changed.',
            });
        }
    };
    card.addEventListener('kp-card-retry', () => {
        mark('loading');
        set('loading');
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            mark('ready');
            set('ready');
        }, 900);
    });
    return set;
}

// ======================================================================================================================================
// 1 · the sentence
// ======================================================================================================================================
const sentenceCard = $('#tm-sentence-card');
if (sentenceCard) {
    const form = /** @type {HTMLElement} */ ($('#tm-sentence'));
    const eatEl = /** @type {HTMLElement} */ ($('#tm-eat'));
    const startEl = /** @type {HTMLElement} */ ($('#tm-start'));
    const paceEl = /** @type {HTMLSelectElement} */ ($('#tm-pace'));
    const spareEl = /** @type {HTMLSelectElement} */ ($('#tm-spare'));
    const readout = /** @type {HTMLElement} */ ($('#tm-sentence-readout'));
    const late = /** @type {HTMLElement} */ ($('#tm-late'));
    const lateGo = /** @type {HTMLElement} */ ($('#tm-late-go'));
    let eat = '18:30';
    let nowAt = '17:22';
    let loadingStart = false;

    const current = () => plan({ serve: at(eat), spare: Number(spareEl.value), pace: Number(paceEl.value) });
    /** Fill in everything that follows from the dinner time. */
    const draw = () => {
        const p = current();
        setTime(startEl, hm(p.start));
        readout.textContent = loadingStart ? 'Reading the step times…' : `${words(p.total / MIN)} of cooking in three tracks. ${startsInWords(p)}`;
        readout.toggleAttribute('aria-busy', loadingStart);
        const passed = !loadingStart && at(nowAt) >= p.start;
        late.hidden = !passed;
        if (passed) {
            const newServe = at(nowAt) + p.total + Number(spareEl.value) * MIN;
            /** @type {HTMLElement} */ ($('#tm-late-title')).textContent = `${hm(p.start)} has passed. Nothing is lost.`;
            /** @type {HTMLElement} */ ($('#tm-late-text')).textContent = `Start now and dinner is at ${hm(newServe)} instead of ${eat}.`;
            lateGo.textContent = `Eat at ${hm(newServe)} instead`;
            lateGo.dataset.serve = hm(newServe);
        }
        sentence(form)?.refresh();
    };
    draw();

    form.addEventListener('kp-time-change', (event) => {
        const { value } = /** @type {CustomEvent} */ (event).detail;
        if (!value) return;
        const source = /** @type {HTMLElement} */ (event.target).closest('[data-kp-time]');
        if (source === eatEl) eat = value;
        else if (source === startEl) {
            // The start was typed: dinner is where the steps and the spare time end after it.
            const p = current();
            eat = hm(at(value) + p.total + Number(spareEl.value) * MIN);
            setTime(eatEl, eat);
        }
        draw();
    });
    form.addEventListener('change', (event) => {
        if (event.target === paceEl || event.target === spareEl) draw();
    });
    lateGo.addEventListener('click', () => {
        eat = lateGo.dataset.serve ?? eat;
        setTime(eatEl, eat);
        nowAt = '17:22';
        markNow(nowAt);
        draw();
    });

    const markNow = group('data-tm-s-now', (value) => {
        nowAt = value;
        // The clock only means something while the sentence is showing: a plate gives way to it.
        if (sentenceCard.getAttribute('data-kp-state') !== 'ready') {
            markState('ready');
            set('ready');
        }
        draw();
    });
    const set = recipeStates(sentenceCard, {
        what: 'the sentence',
        mark: (v) => markState(v),
        show: () => {
            loadingStart = false;
            startEl.removeAttribute('data-kp-state');
            draw();
        },
    });
    const markState = group('data-tm-s-state', (value) => {
        if (value === 'loading') {
            // An inline field loads as its own skeleton at its final width; the dinner time can still be typed.
            setCardState(sentenceCard, 'ready');
            loadingStart = true;
            startEl.setAttribute('data-kp-state', 'loading');
            draw();
            window.setTimeout(() => {
                if (!loadingStart) return;
                markState('ready');
                set('ready');
            }, 6000);
        } else set(value);
    });

    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        if (!sentenceCard.isConnected) return;
        if (id === 'look') form.setAttribute('data-kp-look', value);
        if (id === 'size') form.setAttribute('data-kp-sentence-size', value);
        if (id === 'step') for (const f of [eatEl, startEl]) f.setAttribute('data-kp-time-step', value);
        if (id === 'spare') {
            spareEl.value = value;
            spareEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

// ======================================================================================================================================
// 2 · the plan as lanes
// ======================================================================================================================================
const planCard = $('#tm-plan-card');
if (planCard) {
    const clock = makeClock('17:22', 0);
    const slot = /** @type {HTMLElement} */ ($('#tm-gantt-slot'));
    const readout = /** @type {HTMLElement} */ ($('#tm-plan-readout'));
    slot.innerHTML =
        '<section class="kp-gantt" data-kp-gantt data-kp-gantt-ranges="all" data-kp-gantt-range="all" data-kp-gantt-ghosts="1 1 1" aria-label="Tonight&#39;s cooking plan, one lane per track"></section>';
    const gantt = /** @type {HTMLElement} */ (slot.firstElementChild);
    attachGantts(slot, { now: clock.now, strings: { ganttOk: 'planned', ganttLoading: 'Counting back from the step times' } });
    let eat = '18:30';
    let pace = 1;
    const options = { marks: 'on', colour: 'track', band: 'on' };

    const draw = () => {
        const p = plan({ serve: at(eat), pace });
        const lanes = p.tracks.map((t) => ({ id: t.id, label: t.label, sub: `Start at ${hm(t.start)}` }));
        const runs = p.tracks.flatMap((t) =>
            t.steps.map((s) => ({
                id: s.id,
                lane: t.id,
                label: s.label,
                start: s.start,
                end: s.end,
                state: /** @type {const} */ ('ok'),
                series: options.colour === 'track' ? t.series : undefined,
                detail: `${s.say}, ${s.mins} min, ${s.active ? 'hands on' : 'you can walk away'}`,
            })),
        );
        setGanttRuns(gantt, runs, lanes);
        setGanttPoints(
            gantt,
            options.marks === 'on'
                ? p.tracks.map((t) => ({
                      id: `${t.id}-start`,
                      lane: t.id,
                      at: t.start,
                      kind: 'start',
                      label: `Start: ${t.steps[0].say}`,
                      planned: true,
                  }))
                : [],
            lanes,
        );
        setGanttKinds(gantt, options.marks === 'on' ? [{ kind: 'start', label: 'Where a track starts', shape: 'diamond', tone: 'info' }] : []);
        setGanttZones(gantt, options.band === 'on' ? [{ id: 'eat', from: p.serve, to: p.serve + 12 * MIN, label: `We eat at ${hm(p.serve)}`, tone: 'info' }] : []);
        setGanttLegend(
            gantt,
            options.colour === 'track' ? p.tracks.map((t) => ({ series: t.series, label: t.label })) : [],
        );
        /** @type {HTMLElement} */ ($('#tm-plan-body')).textContent =
            `Counted back from dinner at ${hm(p.serve)}: ${words(p.total / MIN)} from the first step to the table. ${p.tracks
                .map((t) => `${t.label} at ${hm(t.start)}`)
                .join(', ')}.`;
    };
    draw();

    gantt.addEventListener('kp-gantt-open', (event) => {
        const { run, point } = /** @type {CustomEvent} */ (event).detail;
        if (run) {
            const start = new Date(run.start).getTime();
            const end = new Date(run.end).getTime();
            readout.textContent = `${run.label}, ${hm(start)} to ${hm(end)}: ${run.detail}.`;
        } else if (point) readout.textContent = `${point.label} at ${hm(new Date(point.at).getTime())}.`;
    });

    const set = recipeStates(planCard, {
        what: 'the plan',
        mark: (v) => markState(v),
        show: () => {
            setGanttState(gantt, 'ready');
            draw();
        },
    });
    const markState = group('data-tm-p-state', (value) => {
        if (value === 'loading') {
            // A data area loads under the theme's busy card, with the lane names and the axis beside it.
            setCardState(planCard, 'ready');
            setGanttState(gantt, 'loading');
            window.setTimeout(() => {
                markState('ready');
                set('ready');
            }, 6000);
        } else set(value);
    });
    group('data-tm-p-eat', (value) => {
        eat = value;
        draw();
    });
    group('data-tm-p-pace', (value) => {
        pace = Number(value);
        draw();
    });
    group('data-tm-p-clock', (value) => clock.setSpeed(Number(value)));

    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        if (!planCard.isConnected || !(id in options)) return;
        /** @type {Record<string, string>} */ (options)[id] = value;
        draw();
    });
}

// ======================================================================================================================================
// 3 · the disc (and the digits, when asked for)
// ======================================================================================================================================
const timerCard = $('#tm-timer-card');
if (timerCard) {
    const clock = makeClock('17:22', 60);
    const discSlot = /** @type {HTMLElement} */ ($('#tm-disc-slot'));
    const digitsSlot = /** @type {HTMLElement} */ ($('#tm-digits-slot'));
    const readout = /** @type {HTMLElement} */ ($('#tm-timer-readout'));
    const upNote = /** @type {HTMLElement} */ ($('#tm-timer-up'));
    let eat = '18:30';
    let speed = 60;
    let numbers = false;
    let face = 'fit';
    /** @type {(() => void)[]} */
    let detach = [];
    /** @type {HTMLElement | null} */
    let disc = null;
    let ticker = 0;

    const start = () => plan({ serve: at(eat) }).start;
    const clockLine = () => {
        const left = Math.max(0, Math.round((start() - clock.now()) / MIN));
        readout.textContent = `The demo clock says ${hm(clock.now())} and runs ${speed === 60 ? 'a minute a second' : 'in real time'}. ${left > 0 ? `You start at ${hm(start())}, in ${words(left)}.` : `It is ${hm(start())}: the start.`}`;
    };
    /** Build the disc, and the digits beside it, for the wait from the clock to the start. */
    const build = () => {
        for (const off of detach) off();
        detach = [];
        clearInterval(ticker);
        clock.set(at('17:22'));
        clock.setSpeed(0);
        upNote.hidden = true;
        const seconds = Math.max(1, Math.round((start() - clock.now()) / 1000));
        discSlot.innerHTML = `<div class="kp-timer-disc" data-kp-timer-disc="${seconds}s" data-kp-timer-disc-name="Start cooking"${face === 'dial60' ? ' data-kp-timer-disc-scale="60"' : ''}></div>`;
        digitsSlot.innerHTML = `<div class="kp-countdown tm-digits" data-kp-countdown="${seconds}s" data-kp-countdown-name="Minutes to the start"></div>`;
        disc = /** @type {HTMLElement} */ (discSlot.firstElementChild);
        const digits = /** @type {HTMLElement} */ (digitsSlot.firstElementChild);
        detach.push(attachTimerDiscs(discSlot, { now: clock.now }), attachCountdowns(digitsSlot, { now: clock.now }));
        digitsSlot.hidden = !numbers;
        // The digits follow the disc: one Start, one Pause, one Reset.
        disc.addEventListener('kp-countdown-change', (event) => {
            const { state } = /** @type {CustomEvent} */ (event).detail;
            const mine = countdownOf(digits);
            clock.setSpeed(state === 'running' ? speed : 0);
            if (state === 'running') mine?.start();
            if (state === 'paused') mine?.pause();
            if (state === 'idle') {
                mine?.reset();
                upNote.hidden = true;
            }
            clockLine();
        });
        disc.addEventListener('kp-countdown-end', () => {
            clock.setSpeed(0);
            clockLine();
            /** @type {HTMLElement} */ ($('#tm-timer-up-text')).textContent = `First: ${plan({ serve: at(eat) }).first.toLowerCase()}. The oven goes on at ${hm(plan({ serve: at(eat) }).tracks.find((t) => t.id === 'oven')?.start ?? 0)}, the pasta water at ${hm(plan({ serve: at(eat) }).tracks.find((t) => t.id === 'pasta')?.start ?? 0)}.`;
            upNote.hidden = false;
        });
        ticker = window.setInterval(clockLine, 250);
        /** @type {HTMLElement} */ ($('#tm-timer-body')).textContent =
            `Dinner at ${eat}, so the start is ${hm(start())}. From the clock's 17:22 that is ${words(Math.round(seconds / 60))}.`;
        clockLine();
    };
    build();

    const speedLine = clockLine;

    /** Press Start on the disc, as a person would. */
    const press = () => {
        if (!disc) return;
        const clockOfDisc = timerDiscOf(disc);
        if (clockOfDisc?.state() === 'idle') clockOfDisc.start();
    };
    const markTimer = group('data-tm-t-timer', (value) => {
        if (value === 'waiting') return build();
        if (value === 'running' || value === 'last' || value === 'up') {
            if (!disc) return;
            const clockOfDisc = timerDiscOf(disc);
            if (clockOfDisc?.state() === 'ended') build();
            press();
            const mine = timerDiscOf(/** @type {HTMLElement} */ (disc));
            if (value === 'last') clock.jump(Math.max(0, (mine?.remaining() ?? 0) - 60000));
            if (value === 'up') clock.jump((mine?.remaining() ?? 0) + 1000);
        }
    });
    group('data-tm-t-eat', (value) => {
        eat = value;
        markTimer('waiting');
        build();
    });
    group('data-tm-t-speed', (value) => {
        speed = Number(value);
        if (timerCard.getAttribute('data-kp-state') !== 'ready') {
            markState('ready');
            set('ready');
        }
        if (disc && timerDiscOf(disc)?.state() === 'running') clock.setSpeed(speed);
        speedLine();
    });
    const set = recipeStates(timerCard, {
        what: 'the disc',
        mark: (v) => markState(v),
        show: () => build(),
    });
    const markState = group('data-tm-t-state', (value) => {
        if (value === 'loading') {
            setCardState(timerCard, 'loading');
            window.setTimeout(() => {
                markState('ready');
                set('ready');
            }, 6000);
        } else set(value);
    });

    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        if (!timerCard.isConnected) return;
        if (id === 'numbers') {
            numbers = value === 'on';
            digitsSlot.hidden = !numbers;
        }
        if (id === 'face') {
            face = value;
            markTimer('waiting');
            build();
        }
    });
}

// ======================================================================================================================================
// 4 · the nudge
// ======================================================================================================================================
const nudgeCard = $('#tm-nudge-card');
if (nudgeCard) {
    const band = /** @type {HTMLElement} */ ($('#tm-band'));
    const quiet = /** @type {HTMLElement} */ ($('#tm-nudge-quiet'));
    const snoozeBox = /** @type {HTMLElement} */ ($('.tm-nudge-snooze'));
    const slot = /** @type {HTMLElement} */ ($('#tm-snooze-slot'));
    const p = plan({ serve: at('18:30') });
    const startMs = p.start;
    let moment = '10';
    let lead = 10;
    let look = 'chips';
    /** @type {number | null} */
    let snoozedUntil = null;
    /** @type {(() => void) | null} */
    let detachSnooze = null;

    /** The page's clock for each moment: minutes before the start, or 4 minutes past it. */
    const nowMs = () => (moment === 'late' ? startMs + 4 * MIN : startMs - Number(moment) * MIN);

    /** @returns {import('../../../js/attention.js').AttentionItem[]} */
    const items = () => {
        const now = nowMs();
        if (snoozedUntil !== null) return [{ key: 'snoozed', severity: 'info', title: `I will remind you at ${hm(snoozedUntil)}`, text: `Until then nothing else asks for you. The start was ${hm(startMs)}.` }];
        if (moment === '30')
            return lead >= 30
                ? [{ key: 'ahead', severity: 'info', title: `Dinner at 18:30: you start in 30 minutes, at ${hm(startMs)}`, text: `Nothing to do yet. This is only so ${hm(startMs)} does not come as a surprise.` }]
                : [];
        if (moment === '10')
            return lead >= 10
                ? [{
                      key: 'soon',
                      severity: 'info',
                      title: 'Start in 10 minutes',
                      text: `The first step is ${p.first.toLowerCase()}. Put the board and a knife out now and the first step is already half done.`,
                      action: (() => {
                          const go = button('I am starting', 'kp-button--primary kp-button--sm');
                          go.addEventListener('click', () => {
                              quiet.textContent = 'Started. The plan moves to cook mode (not part of this demo).';
                          });
                          return go;
                      })(),
                  }]
                : [];
        if (moment === '0')
            return [{
                key: 'now',
                severity: 'warning',
                title: `It is ${hm(startMs)}: time to start`,
                text: `${p.first} comes first (10 minutes). The oven goes on at ${hm(p.tracks.find((t) => t.id === 'oven')?.start ?? 0)} and the pasta water at ${hm(p.tracks.find((t) => t.id === 'pasta')?.start ?? 0)}.`,
                action: (() => {
                    const go = button('Start now', 'kp-button--primary kp-button--sm');
                    go.addEventListener('click', () => {
                        quiet.textContent = 'Started. The plan moves to cook mode (not part of this demo).';
                    });
                    return go;
                })(),
            }];
        const newServe = now + p.total;
        const actions = document.createElement('span');
        actions.className = 'tm-band-actions';
        const move = button(`Eat at ${hm(newServe)}`, 'kp-button--primary kp-button--sm');
        const skip = button('Keep 18:30 without the bread', 'kp-button--sm');
        move.addEventListener('click', () => {
            quiet.textContent = `Dinner moved to ${hm(newServe)}. Everyone is told (not part of this demo).`;
        });
        skip.addEventListener('click', () => {
            quiet.textContent = 'Dinner stays at 18:30 and the oven track is left out (not part of this demo).';
        });
        actions.append(move, skip);
        return [{
            key: 'late',
            severity: 'warning',
            title: `It is ${hm(now)}, four minutes past the start. Nothing is lost.`,
            text: `Start now and dinner is at ${hm(newServe)}. Or keep 18:30 and leave out the garlic bread: that saves the whole oven track.`,
            action: actions,
        }];
    };

    const draw = () => {
        quiet.textContent = '';
        const list = items();
        setAttention(band, list);
        if (list.length === 0) quiet.textContent = `Nothing to do yet. The first nudge comes ${lead === 0 ? 'at' : `${lead} minutes before`} ${hm(startMs)}.`;
        /** @type {HTMLElement} */ ($('#tm-nudge-body')).textContent = `The start is ${hm(startMs)}. The demo clock says ${hm(nowMs())}.`;
        // Not yet is for a nudge that can wait: not past the start, not before the first nudge.
        const waitable = moment !== 'late' && list.length > 0;
        snoozeBox.hidden = !waitable;
        if (waitable && !detachSnooze) buildSnooze();
        if (!waitable) {
            detachSnooze?.();
            detachSnooze = null;
            slot.replaceChildren();
        }
    };
    const buildSnooze = () => {
        detachSnooze?.();
        const iso = new Date(nowMs()).toISOString();
        slot.innerHTML = `<div class="kp-snooze" data-kp-snooze data-kp-snooze-choices="5m 10m pick" data-kp-snooze-max="1h" data-kp-look="${look}" data-kp-now="${iso}" data-kp-time-zone="Europe/Brussels"></div>`;
        detachSnooze = attachSnoozes(slot);
        const el = /** @type {HTMLElement} */ (slot.firstElementChild);
        el.addEventListener('kp-snooze', (event) => {
            snoozedUntil = new Date(/** @type {CustomEvent} */ (event).detail.until).getTime();
            draw();
        });
        el.addEventListener('kp-snooze-end', () => {
            snoozedUntil = null;
            draw();
        });
        if (snoozedUntil !== null) setSnoozedUntil(el, snoozedUntil);
    };

    const markMoment = group('data-tm-n-moment', (value) => {
        moment = value;
        snoozedUntil = null;
        detachSnooze?.();
        detachSnooze = null;
        draw();
    });
    void markMoment;
    const set = recipeStates(nudgeCard, {
        what: 'the nudge',
        mark: (v) => markState(v),
        show: () => draw(),
    });
    const markState = group('data-tm-n-state', (value) => {
        if (value === 'loading') {
            setCardState(nudgeCard, 'loading');
            window.setTimeout(() => {
                markState('ready');
                set('ready');
            }, 6000);
        } else set(value);
    });
    draw();

    document.addEventListener('review:choice', (event) => {
        const { id, value } = /** @type {CustomEvent} */ (event).detail;
        if (!nudgeCard.isConnected) return;
        if (id === 'lead') {
            lead = Number(value);
            draw();
        }
        if (id === 'look') {
            look = value;
            detachSnooze?.();
            detachSnooze = null;
            draw();
        }
    });
}
