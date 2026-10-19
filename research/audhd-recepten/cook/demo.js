// research/audhd-recepten/cook: the page's own wiring. The components are the package's (js/auto.js attaches them); this file gives
// them a recipe, answers the demo's buttons, and plays the parts a server and a kitchen would play. Mock data throughout.
import { getChecklistItems, setChecklistItems, setChecklistState } from '../../../js/checklist.js';
import { goToStep, getStepIndex, setFocusSteps, setFocusStepsState } from '../../../js/focus-steps.js';
import { getTimers, startTimer, stopTimer } from '../../../js/timer.js';
import { attachTimerDiscs, timerDiscOf } from '../../../js/timer-disc.js';
import { setAttention } from '../../../js/attention.js';
import { setCalm } from '../../../js/calm.js';
import { arriveShown } from '../../../js/motion.js';

/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement | null} */
const $ = (sel, root = document) => /** @type {HTMLElement | null} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] @returns {HTMLElement[]} */
const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
const wait = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// ---------------------------------------------------------------- the recipe
// Pasta and sauce run side by side: the water goes on first, the sauce is built while it heats, the pasta goes in a minute after
// the sauce starts to simmer, and both timers end within a minute of each other.
/** @type {import('../../../js/focus-steps.js').FocusStep[]} */
const STEPS = [
    {
        text: 'Put the big pot of water on the stove, lid on, on the highest heat.',
        ingredients: [
            { amount: '3 l', name: 'water' },
            { amount: '1 tbsp', name: 'coarse salt' },
        ],
        timer: { seconds: 600, name: 'Water' },
        note: 'Pasta track. It takes about 10 minutes to boil, so start the sauce now.',
    },
    {
        text: 'Chop the onion fine and crush the garlic.',
        ingredients: [
            { amount: '1', name: 'onion' },
            { amount: '2 cloves', name: 'garlic' },
        ],
        note: 'Sauce track. The water keeps heating on its own.',
    },
    {
        text: 'Soften the onion in the olive oil in the frying pan over medium heat, stirring now and then.',
        ingredients: [{ amount: '2 tbsp', name: 'olive oil' }],
        timer: { seconds: 240, name: 'Onion' },
        note: 'Sauce track. Do not let it brown.',
        noteTone: 'warning',
    },
    {
        text: 'Add the garlic, the tomatoes and the oregano. Bring to a simmer, then turn the heat low.',
        ingredients: [
            { amount: '400 g', name: 'peeled tomatoes (tin)' },
            { amount: '1 tsp', name: 'dried oregano' },
        ],
        timer: { seconds: 600, name: 'Sauce' },
        note: 'Sauce track. It simmers by itself: you do not have to watch it.',
    },
    {
        text: 'When the water is at a full boil, add the spaghetti and push it under with the spoon.',
        ingredients: [{ amount: '250 g', name: 'spaghetti' }],
        timer: { seconds: 540, name: 'Pasta' },
        note: 'Pasta track. Now two things run at once: the Pasta and the Sauce timers.',
    },
    {
        text: 'Stir the sauce. Add salt, pepper and a pinch of sugar, and taste.',
        ingredients: [
            { amount: '1 pinch', name: 'sugar' },
            { amount: '', name: 'salt and black pepper' },
        ],
        note: 'Sauce track. The pasta is still cooking: you have time.',
    },
    {
        text: 'Add the meatballs to the sauce and let them warm through, lid half on.',
        ingredients: [{ amount: '8', name: 'cooked meatballs (balletjes)' }],
        note: 'Sauce track. Look at the timer list if you lose the time.',
    },
    {
        text: 'When the Pasta timer is done, scoop out a cup of the cooking water, then drain the spaghetti.',
        ingredients: [{ amount: '1 cup', name: 'pasta water' }],
        note: 'Pasta track. Keep the cup of water: it makes the sauce cling.',
        noteTone: 'warning',
    },
    {
        text: 'Toss the spaghetti through the sauce with a splash of pasta water. Serve with parmesan and basil.',
        ingredients: [
            { amount: '40 g', name: 'parmesan' },
            { amount: '1 handful', name: 'basil leaves' },
        ],
        note: 'Both tracks meet here. Eat while it is hot.',
    },
];
/** Which step to open for what a finished timer leads to (a step index). */
const NEXT_AFTER = { Water: 4, Onion: 3, Sauce: 8, Pasta: 7 };

const MISE = [
    { id: 'spaghetti', label: 'Spaghetti', detail: '250 g', group: 'Ingredients' },
    { id: 'tomatoes', label: 'Peeled tomatoes, one tin', detail: '400 g', group: 'Ingredients' },
    { id: 'onion', label: 'Onion', detail: '1', group: 'Ingredients' },
    { id: 'garlic', label: 'Garlic', detail: '2 cloves', group: 'Ingredients' },
    { id: 'meatballs', label: 'Cooked meatballs (balletjes)', detail: '8', group: 'Ingredients' },
    { id: 'parmesan', label: 'Parmesan and basil', detail: '40 g', group: 'Ingredients' },
    { id: 'pot', label: 'Big pot with a lid', detail: '', group: 'Tools' },
    { id: 'pan', label: 'Frying pan', detail: '', group: 'Tools' },
    { id: 'colander', label: 'Colander', detail: '', group: 'Tools' },
    { id: 'spoon', label: 'Wooden spoon and a cup', detail: '', group: 'Tools' },
    { id: 'board', label: 'Chopping board and knife', detail: '', group: 'Tools' },
    { id: 'oil', label: 'Olive oil, salt, pepper, oregano, sugar', detail: '', group: 'From the cupboard' },
];

// ---------------------------------------------------------------- the demo's clock: fast or real
let speed = 'fast';
const factor = () => (speed === 'fast' ? 20 : 1);
const scaled = (/** @type {number} */ seconds) => Math.max(2, Math.round(seconds / factor()));

const lists = { cook: $('#cm-timers'), rt: $('#rt-timers'), ph: $('#ph-timers') };
const roots = { cook: $('#cm-steps'), ph: $('#ph-steps') };
const mise = $('#mise-list');

/** Every starter button of a step (inside a focus-steps view) starts its timer at the demo's speed. In real time the package's own listener runs. */
for (const root of Object.values(roots)) {
    root?.addEventListener(
        'click',
        (event) => {
            const starter = event.target instanceof Element ? event.target.closest('[data-kp-timer-start]') : null;
            if (!starter || speed !== 'fast' || starter.closest('[aria-disabled="true"]')) return;
            event.stopPropagation();
            const list = document.getElementById(root.getAttribute('data-kp-focus-steps-timers') ?? '');
            const name = starter.getAttribute('data-kp-timer-name') ?? '';
            const id = `start:${name}`;
            if (!list) return;
            if (getTimers(list).some((t) => t.id === id && t.state !== 'done')) return;
            const seconds = Number(starter.getAttribute('data-kp-timer-start')) || 0;
            if (startTimer(list, { name, seconds: scaled(seconds), id })) starter.setAttribute('data-kp-timer-running', id);
        },
        true,
    );
}

// ---------------------------------------------------------------- the attention band: what ended, and the one thing to do
/** @param {HTMLElement | null} list @param {HTMLElement | null} band @param {HTMLElement | null} root */
function watchEnds(list, band, root) {
    if (!list || !band) return;
    const refresh = () => {
        const done = getTimers(list).filter((t) => t.state === 'done');
        setAttention(
            band,
            done.map((t) => {
                const next = root ? NEXT_AFTER[/** @type {keyof typeof NEXT_AFTER} */ (t.name)] : undefined;
                const action = document.createElement('button');
                action.type = 'button';
                action.className = 'kp-button kp-button--sm';
                if (root && next !== undefined) {
                    action.textContent = `Go to step ${next + 1}`;
                    action.setAttribute('data-ar-goto', String(next));
                } else {
                    action.textContent = `Stop ${t.name}`;
                    action.setAttribute('data-ar-stop', t.id);
                }
                return {
                    key: t.id,
                    severity: /** @type {const} */ ('warning'),
                    title: `${t.name} is done`,
                    text: root && next !== undefined ? `Next is step ${next + 1}: ${STEPS[next].text}` : 'It is ringing until you stop it.',
                    action,
                };
            }),
        );
    };
    for (const type of ['kp-timer-done', 'kp-timer-stop', 'kp-timer-change', 'kp-timer-start']) list.addEventListener(type, refresh);
    band.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest('button') : null;
        if (!button) return;
        if (button.hasAttribute('data-ar-goto') && root) goToStep(root, Number(button.getAttribute('data-ar-goto')));
        else if (button.hasAttribute('data-ar-stop')) stopTimer(list, button.getAttribute('data-ar-stop') ?? '');
    });
}
watchEnds(lists.cook, $('#cm-band'), roots.cook);
watchEnds(lists.rt, $('#rt-band'), null);
watchEnds(lists.ph, $('#ph-band'), roots.ph);

// ---------------------------------------------------------------- the discs follow the Pasta and Sauce timers
const DISCS = { Pasta: { id: '#disc-pasta', seconds: 540 }, Sauce: { id: '#disc-sauce', seconds: 600 } };
let dial = 'hour';
let discsOff = false;
/** @type {(() => void) | null} */
let detachDiscs = null;
const clockOf = (/** @type {string} */ name) => {
    const id = DISCS[/** @type {keyof typeof DISCS} */ (name)]?.id;
    const el = id ? $(id) : null;
    return el ? timerDiscOf(el) : null;
};
document.addEventListener('kp-timer-start', (event) => {
    const { timer } = /** @type {CustomEvent} */ (event).detail;
    const clock = clockOf(timer.name);
    if (!clock) return;
    clock.reset(timer.seconds);
    clock.start();
});
document.addEventListener('kp-timer-change', (event) => {
    const { timer, action } = /** @type {CustomEvent} */ (event).detail;
    const clock = clockOf(timer.name);
    if (!clock) return;
    if (action === 'pause') clock.pause();
    else if (action === 'resume') clock.start();
    else if (action === 'add') clock.add(60);
});
document.addEventListener('kp-timer-stop', (event) => {
    const { timer } = /** @type {CustomEvent} */ (event).detail;
    clockOf(timer.name)?.reset(scaled(DISCS[/** @type {keyof typeof DISCS} */ (timer.name)]?.seconds ?? 0));
});

/** Draw the discs again with the options that are read when a disc is made (its set time, its dial, whether it is disabled). */
function rebuildDiscs() {
    const frame = $('#discs-component');
    if (!frame) return;
    detachDiscs?.();
    frame.replaceChildren();
    for (const [name, { id, seconds }] of Object.entries(DISCS)) {
        const disc = document.createElement('div');
        disc.className = 'kp-timer-disc';
        disc.id = id.slice(1);
        disc.setAttribute('data-kp-timer-disc', `${scaled(seconds)}s`);
        disc.setAttribute('data-kp-timer-disc-name', name);
        if (dial === 'hour') disc.setAttribute('data-kp-timer-disc-scale', speed === 'fast' ? '3' : '60');
        if (discsOff) disc.setAttribute('data-kp-timer-disc-disabled', '');
        frame.append(disc);
    }
    detachDiscs = attachTimerDiscs(frame);
}

// ---------------------------------------------------------------- the states, one function per component
const MISS = 'The ingredient list could not be loaded. Check the connection.';
const GONE = 'The recipe could not be loaded. Check the connection and try again.';
let miseOpen = false;

/** @param {string} state */
async function setMise(state) {
    if (!mise) return;
    if (!miseOpen) await openMise(false);
    if (state === 'loading') setChecklistState(mise, 'loading');
    else if (state === 'error') setChecklistState(mise, 'error', MISS);
    else if (state === 'empty') {
        setChecklistState(mise, 'ready');
        setChecklistItems(mise, []);
    } else {
        setChecklistState(mise, 'ready');
        if (!getChecklistItems(mise).length) setChecklistItems(mise, MISE.map((m) => ({ ...m })));
    }
}

/** Begin: the checklist opens as the one first step; its items load as they would from a server. @param {boolean} [load] */
async function openMise(load = true) {
    const open = $('[data-ar-mise-open]');
    if (!open || !mise || miseOpen) return;
    miseOpen = true;
    open.hidden = false;
    arriveShown(open);
    if (load) {
        setChecklistState(mise, 'loading');
        await wait(450);
    }
    setChecklistState(mise, 'ready');
    setChecklistItems(mise, MISE.map((m) => ({ ...m })));
    paintStart();
}

/** @param {HTMLElement | null} root @param {string} state @param {number} [keep] */
function setSteps(root, state, keep = 0) {
    if (!root) return;
    if (state === 'loading') return setFocusStepsState(root, 'loading');
    if (state === 'error') return setFocusStepsState(root, 'error', GONE);
    setFocusStepsState(root, 'ready');
    if (state === 'empty') return setFocusSteps(root, []);
    setFocusSteps(root, STEPS, { start: keep });
}

// "Start cooking" is off until everything is ticked; "Skip, start anyway" never is.
const start = $('[data-ar-start]');
const readout = $('[data-ar-readout]');
function paintStart() {
    if (!mise || !start || !readout) return;
    const items = getChecklistItems(mise);
    const left = items.filter((i) => !i.checked).length;
    const all = items.length > 0 && left === 0;
    start.setAttribute('aria-disabled', String(!all));
    readout.textContent = !items.length ? 'Nothing to take out.' : all ? 'Everything is out. Start whenever you like.' : `${left} of ${items.length} still to take out.`;
}
mise?.addEventListener('kp-checklist-change', paintStart);
mise?.addEventListener('kp-checklist-undo', paintStart);
mise?.addEventListener('kp-checklist-clear', paintStart);
mise?.addEventListener('kp-checklist-render', paintStart);
const begin = () => {
    if (readout) readout.textContent = 'Cook mode opens at step 1. Take your time.';
    $('#cook')?.scrollIntoView({ block: 'start' });
};
start?.addEventListener('click', () => {
    if (start.getAttribute('aria-disabled') !== 'true') begin();
});
$('[data-ar-skip]')?.addEventListener('click', begin);
$('[data-ar-begin]')?.addEventListener('click', () => void openMise());

// ---------------------------------------------------------------- the options: one table, called by a button or by the review's choice
/** Press one button of a group: it is on, its siblings are off. @param {Element} button */
function pick(button) {
    const group = button.closest('[role="group"]');
    if (!group) return;
    for (const b of group.querySelectorAll('button[aria-pressed]')) b.setAttribute('aria-pressed', String(b === button));
}
/** Mark every button of an option as pressed for a value, wherever it stands. @param {string} opt @param {string} value */
function mark(opt, value) {
    for (const b of $$(`[data-opt="${opt}"]`)) b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === value));
}
const eachList = (/** @type {(list: HTMLElement) => void} */ fn) => Object.values(lists).forEach((l) => l && fn(l));

/** @type {Record<string, (value: string) => void | Promise<void>>} */
const APPLY = {
    'mise-state': (v) => setMise(v),
    'mise-start': async (v) => {
        if (v === 'open') await openMise(false);
        else if (miseOpen) {
            const open = $('[data-ar-mise-open]');
            if (open) open.hidden = true;
            miseOpen = false;
        }
        paintStart();
    },
    sink: (v) => {
        if (!mise) return;
        mise.setAttribute('data-kp-checklist-sink', v);
        setChecklistItems(mise, getChecklistItems(mise));
    },
    'cook-state': (v) => setSteps(roots.cook, v, v === 'ready' ? getStepIndex(/** @type {HTMLElement} */ (roots.cook)) : 0),
    'phone-state': (v) => setSteps(roots.ph, v, v === 'ready' ? getStepIndex(/** @type {HTMLElement} */ (roots.ph)) : 0),
    // The screen line asks again whenever the page comes back; the demo says "the page came back" so the new choice is read.
    wake: (v) => {
        for (const root of Object.values(roots)) root?.setAttribute('data-kp-focus-steps-wake', v);
        document.dispatchEvent(new Event('visibilitychange'));
    },
    speed: (v) => {
        speed = v;
        const line = $('[data-ar-speed-line]');
        if (line) line.textContent = v === 'fast' ? 'Demo clock: fast, 1 minute lasts 3 seconds.' : 'Demo clock: real time.';
        rebuildDiscs();
    },
    sound: (v) => eachList((l) => l.setAttribute('data-kp-timers-sound', v)),
    speak: (v) => eachList((l) => (v === 'on' ? l.setAttribute('data-kp-timers-speak', 'on') : l.removeAttribute('data-kp-timers-speak'))),
    ring: (v) => eachList((l) => l.setAttribute('data-kp-timers-ring', v)),
    dial: (v) => {
        dial = v;
        rebuildDiscs();
    },
    'disc-state': (v) => {
        discsOff = v === 'disabled';
        rebuildDiscs();
    },
    calm: (v) => setCalm(v === 'on', { remember: false }),
    'calm-scope': (v) => setCalm(document.documentElement.hasAttribute('data-kp-calm'), { scope: /** @type {any} */ (v), remember: false, announce: false }),
    'calm-loading': (v) => setCalm(document.documentElement.hasAttribute('data-kp-calm'), { loading: /** @type {any} */ (v), remember: false, announce: false }),
};

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button') : null;
    if (!button) return;
    const opt = button.getAttribute('data-opt');
    if (opt && APPLY[opt]) {
        const value = button.getAttribute('data-value') ?? '';
        mark(opt, value);
        void APPLY[opt](value);
        return;
    }
    const act = button.getAttribute('data-act');
    const value = button.getAttribute('data-value') ?? '';
    if (act === 'goto' && roots.cook) {
        if (roots.cook.getAttribute('data-kp-state') && roots.cook.getAttribute('data-kp-state') !== 'ready') {
            mark('cook-state', 'ready');
            setSteps(roots.cook, 'ready');
        }
        goToStep(roots.cook, Number(value));
    } else if (act === 'start' && lists.rt) {
        const names = value === 'both' ? ['Pasta:540', 'Sauce:600'] : [value];
        for (const pair of names) {
            const [name, seconds] = pair.split(':');
            startTimer(lists.rt, { name, seconds: scaled(Number(seconds)), id: `start:${name}` });
        }
    } else if (act === 'try-end' && lists.rt) {
        const id = `try:${Date.now()}`;
        startTimer(lists.rt, { name: 'Pasta', seconds: 5, id });
    } else if (act === 'clear' && lists.rt) {
        for (const t of getTimers(lists.rt)) stopTimer(lists.rt, t.id);
    } else if (act === 'disc-start') {
        for (const name of Object.keys(DISCS)) clockOf(name)?.start();
    } else if (act === 'disc-reset') {
        for (const name of Object.keys(DISCS)) clockOf(name)?.reset(scaled(DISCS[/** @type {keyof typeof DISCS} */ (name)].seconds));
    }
});

// The review's default set: pressing an option fires this; the matching button does the work so the pressed state follows.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent} */ (event).detail;
    const button = $(`[data-opt="${id}"][data-value="${CSS.escape(String(value))}"]`);
    if (button) return button.click();
    void APPLY[id]?.(String(value));
});

// The calm switch of the package turns calm on or off by itself; the demo's own buttons follow it.
const SCOPE_WORDS = { motion: 'transitions only', effects: 'transitions and effects', all: 'everything' };
document.addEventListener('kp-calm-change', (event) => {
    const { calm, scope, loading } = /** @type {CustomEvent} */ (event).detail;
    mark('calm', calm ? 'on' : 'off');
    const line = $('[data-ar-calm-line]');
    if (line)
        line.textContent = `Calm is ${calm ? 'on' : 'off'}. Holds still: ${SCOPE_WORDS[/** @type {keyof typeof SCOPE_WORDS} */ (scope)] ?? scope}. Loading: ${loading === 'still' ? 'holds still' : 'breathes slowly'}.`;
});

// ---------------------------------------------------------------- first frames: everything shows loading, then the mock server answers
if (mise) setChecklistState(mise, 'loading');
for (const root of Object.values(roots)) if (root) setFocusStepsState(root, 'loading');
await wait(500);
if (mise) {
    setChecklistState(mise, 'ready');
    setChecklistItems(mise, MISE.map((m) => ({ ...m })));
    paintStart();
}
for (const root of Object.values(roots)) setSteps(root, 'ready');
