// research/focus-tracks-1019: the page's own wiring. The components are the package's (js/auto.js attaches them); this file gives them the
// spaghetti recipe in three tracks, answers the demo's buttons, and plays the parts a kitchen would play (a person pressing Next).
// Mock data throughout; the timers run fast unless "Real time" is pressed.
import { goToStep, setFocusSteps, setFocusStepsState } from '../../js/focus-steps.js';
import { getTimers, startTimer, stopTimer } from '../../js/timer.js';

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

// ---------------------------------------------------------------- the recipe, in three tracks
// Pasta and Sauce run side by side: the water goes on first, the sauce is built while it heats, the spaghetti goes in when the water
// boils, the meatballs warm once the sauce has simmered, and Together waits for both tracks to finish.
/** @type {import('../../js/focus-steps.js').FocusStep[]} */
const STEPS = [
    {
        id: 'water',
        track: 'Pasta',
        title: 'Boil the water',
        text: 'Put the big pot of water on the stove, lid on, on the highest heat, and salt it.',
        ingredients: [
            { amount: '3 l', name: 'water' },
            { amount: '1 tbsp', name: 'coarse salt' },
        ],
        timer: { seconds: 600, name: 'Water' },
        note: 'It takes about 10 minutes to boil. Start the sauce meanwhile.',
    },
    {
        id: 'chop',
        track: 'Sauce',
        title: 'Chop the onion and garlic',
        text: 'Chop the onion fine and crush the garlic.',
        ingredients: [
            { amount: '1', name: 'onion' },
            { amount: '2 cloves', name: 'garlic' },
        ],
        note: 'The water keeps heating on its own.',
    },
    {
        id: 'soften',
        track: 'Sauce',
        title: 'Soften the onion',
        text: 'Soften the onion in the olive oil in the frying pan over medium heat, stirring now and then.',
        ingredients: [{ amount: '2 tbsp', name: 'olive oil' }],
        timer: { seconds: 240, name: 'Onion' },
        note: 'Do not let it brown.',
        noteTone: 'warning',
    },
    {
        id: 'simmer',
        track: 'Sauce',
        title: 'Simmer the sauce',
        text: 'Add the garlic, the tomatoes and the oregano. Bring to a simmer, then turn the heat low.',
        ingredients: [
            { amount: '400 g', name: 'peeled tomatoes (tin)' },
            { amount: '1 tsp', name: 'dried oregano' },
        ],
        timer: { seconds: 600, name: 'Simmer' },
        note: 'It simmers by itself: you do not have to watch it.',
    },
    {
        id: 'spaghetti',
        track: 'Pasta',
        title: 'Cook the spaghetti',
        text: 'When the water is at a full boil, add the spaghetti and push it under with the spoon.',
        ingredients: [{ amount: '250 g', name: 'spaghetti' }],
        timer: { seconds: 540, name: 'Pasta' },
        waitFor: 'water',
        note: 'Now two things run at once: the pasta and the sauce.',
    },
    {
        id: 'meatballs',
        track: 'Sauce',
        title: 'Warm the meatballs',
        text: 'Add the meatballs to the sauce and let them warm through, lid half on. Season with salt, pepper and a pinch of sugar.',
        ingredients: [
            { amount: '8', name: 'cooked meatballs (balletjes)' },
            { amount: '1 pinch', name: 'sugar' },
        ],
        waitFor: 'simmer',
        note: 'The pasta is still cooking: you have time.',
    },
    {
        id: 'drain',
        track: 'Pasta',
        title: 'Drain the pasta',
        text: 'Scoop out a cup of the cooking water, then drain the spaghetti.',
        ingredients: [{ amount: '1 cup', name: 'pasta water' }],
        waitFor: 'spaghetti',
        note: 'Keep the cup of water: it makes the sauce cling.',
        noteTone: 'warning',
    },
    {
        id: 'serve',
        track: 'Together',
        title: 'Toss and serve',
        text: 'Toss the spaghetti through the sauce with a splash of pasta water. Serve with parmesan and basil.',
        ingredients: [
            { amount: '40 g', name: 'parmesan' },
            { amount: '1 handful', name: 'basil leaves' },
        ],
        waitFor: ['Pasta', 'Sauce'],
        note: 'Both tracks meet here. Eat while it is hot.',
    },
];

const GONE = 'The server did not answer.';

// ---------------------------------------------------------------- the demo's clock: fast or real
let speed = 'fast';
/** How much faster than real the timers of a stage run. @param {Element | null} root */
const factor = (root) => (speed === 'fast' ? Number(root?.getAttribute('data-ft-factor')) || 20 : 1);
const scaled = (/** @type {number} */ seconds, /** @type {Element | null} */ root) => Math.max(2, Math.round(seconds / factor(root)));

const STAGES = ['tracks', 'waiting', 'attention', 'finished', 'phone', 'states'];
const stage = (/** @type {string} */ name) => ({ root: $(`#${name}-steps`), list: $(`#${name}-timers`) });

/** In fast mode a step's timer starts at the demo's speed; in real time the package's own listener runs. */
for (const name of STAGES) {
    const { root, list } = stage(name);
    root?.addEventListener(
        'click',
        (event) => {
            const starter = event.target instanceof Element ? event.target.closest('[data-kp-timer-start]') : null;
            if (!starter || speed !== 'fast' || starter.closest('[aria-disabled="true"]') || !list) return;
            event.stopPropagation();
            const id = starter.getAttribute('data-kp-timer-id') ?? '';
            if (getTimers(list).some((t) => t.id === id && t.state !== 'done')) return;
            const seconds = Number(starter.getAttribute('data-kp-timer-start')) || 0;
            const timerName = starter.getAttribute('data-kp-timer-name') ?? '';
            if (startTimer(list, { name: timerName, seconds: scaled(seconds, root), id })) starter.setAttribute('data-kp-timer-running', id);
        },
        true,
    );
}

// ---------------------------------------------------------------- a person at the counter: presses on the component's own buttons
/** @param {HTMLElement | null} root @param {string} selector */
function press(root, selector) {
    const button = root?.querySelector(selector);
    if (button instanceof HTMLElement && button.getAttribute('aria-disabled') !== 'true') button.click();
}
const next = (/** @type {HTMLElement | null} */ root) => press(root, '.kp-focus-steps__next');
const startHere = (/** @type {HTMLElement | null} */ root) => press(root, '.kp-focus-steps__timer');
const lane = (/** @type {HTMLElement | null} */ root, /** @type {string} */ name) =>
    $$('.kp-focus-steps__lane', root ?? document).find((l) => l.querySelector('.kp-focus-steps__lane-name')?.textContent === name);
const toLane = (/** @type {HTMLElement | null} */ root, /** @type {string} */ name) => lane(root, name)?.click();

/** Put a stage back to step 1 of every track with no timer running. @param {string} name */
function restart(name) {
    const { root, list } = stage(name);
    if (!root) return;
    if (list) for (const t of getTimers(list)) stopTimer(list, t.id);
    setFocusStepsState(root, 'ready');
    setFocusSteps(root, STEPS);
    for (const a of $$('[data-ft-speed-line]')) a.textContent = speed === 'fast' ? 'Demo clock: fast, 1 minute lasts 3 seconds.' : 'Demo clock: real time.';
    // A stage that starts part way is walked there with presses, as a person would.
    if (name === 'finished') for (let i = 0; i < 3; i += 1) next(root);
}

const SCENARIOS = {
    'water-on': () => {
        const { root } = stage('waiting');
        if (!root) return;
        if (lane(root, 'Pasta')?.getAttribute('aria-pressed') !== 'true') toLane(root, 'Pasta');
        startHere(root);
        next(root);
    },
    'simmer-on': () => {
        const { root } = stage('attention');
        if (!root) return;
        // The sauce track is walked to its simmer step, the timer starts, and the person goes to the pasta.
        toLane(root, 'Sauce');
        for (let i = 0; i < 2; i += 1) next(root);
        startHere(root);
        next(root);
        toLane(root, 'Pasta');
    },
};

// ---------------------------------------------------------------- the options: called by a button or by the review's choice
/** Press one button of a group: it is on, its siblings are off. @param {string} opt @param {string} value */
function mark(opt, value) {
    for (const b of $$(`[data-opt="${opt}"]`)) b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === value));
}
const everyRoot = (/** @type {(root: HTMLElement) => void} */ fn) => STAGES.forEach((n) => stage(n).root && fn(/** @type {HTMLElement} */ (stage(n).root)));

/** @param {string} value */
function setState(value) {
    const { root } = stage('states');
    if (!root) return;
    if (value === 'loading') setFocusStepsState(root, 'loading');
    else if (value === 'error') setFocusStepsState(root, 'error', GONE);
    else if (value === 'empty') {
        setFocusStepsState(root, 'ready');
        setFocusSteps(root, []);
    } else {
        setFocusStepsState(root, 'ready');
        setFocusSteps(root, STEPS);
    }
}

/** @type {Record<string, (value: string) => void>} */
const APPLY = {
    lanes: (v) => stage('tracks').root?.setAttribute('data-kp-lanes', v),
    detail: (v) => {
        stage('tracks').root?.setAttribute('data-kp-lane-detail', v);
        stage('phone').root?.setAttribute('data-kp-lane-detail', v);
    },
    follow: (v) => stage('waiting').root?.setAttribute('data-kp-track-follow', v),
    band: (v) => stage('attention').root?.setAttribute('data-kp-track-attention', v),
    state: setState,
    speed: (v) => {
        speed = v;
        for (const a of $$('[data-ft-speed-line]')) a.textContent = v === 'fast' ? 'Demo clock: fast, 1 minute lasts 3 seconds.' : 'Demo clock: real time.';
    },
};

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button') : null;
    if (!button) return;
    const opt = button.getAttribute('data-opt');
    if (opt && APPLY[opt]) {
        const value = button.getAttribute('data-value') ?? '';
        mark(opt, value);
        APPLY[opt](value);
        return;
    }
    const act = button.getAttribute('data-act');
    const value = button.getAttribute('data-value') ?? '';
    if (act === 'restart') restart(value);
    else if (act && act in SCENARIOS) SCENARIOS[/** @type {keyof typeof SCENARIOS} */ (act)]();
});

// The review's default set: pressing an option fires this; the matching button does the work so the pressed state follows.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent} */ (event).detail;
    const button = $(`[data-opt="${id}"][data-value="${CSS.escape(String(value))}"]`);
    if (button) button.click();
    else APPLY[id]?.(String(value));
});

// A failed recipe loads again when Retry is pressed.
document.addEventListener('kp-focus-steps-retry', async (event) => {
    const root = event.target instanceof Element ? event.target.closest('[data-kp-focus-steps]') : null;
    if (!(root instanceof HTMLElement)) return;
    setFocusStepsState(root, 'loading');
    await wait(500);
    mark('state', 'ready');
    setFocusStepsState(root, 'ready');
    setFocusSteps(root, STEPS);
});

// ---------------------------------------------------------------- first frames: everything shows loading, then the mock server answers
everyRoot((root) => setFocusStepsState(root, 'loading'));
await wait(500);
for (const name of STAGES) restart(name);
void goToStep;
