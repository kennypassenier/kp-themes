// The demo review kit: judge every section of a research demo in every theme
// from one dialog, and copy one structured answer back into the conversation
// (Kenny, 2026-10-03: "is er een manier om dit allemaal goed te keuren in een
// dialog zoals bij every component, one page? … kan dit vanaf nu altijd voor
// demos?" [scope-141]). Every research demo carries it from now on.
//
// A demo opts in with three attributes and one module:
//
//   <html data-review="<demo id>" data-review-themes="formal,retro">  (themes optional: default all)
//   <section data-review-item="spinner" data-review-title="Spinner">  (one per judged piece)
//     <div data-review-look><p data-for="formal">what to look at in formal</p>…</div>
//   <script type="module" src="../_review/review.js"></script>
//
// A section that asks the reviewer to pick between options lists them, so
// they are ticked in the dialog rather than typed into a note (Kenny,
// 2026-10-04: "als ik een keuze moet maken tussen bepaalde opties, zet die
// opties dan ook in de beoordeling zodat ik het kan aanvinken welke ik wil"):
//
//   <section data-review-item="leave" data-review-choices='[
//     { "id": "exit", "label": "Exit for this theme", "options": [{ "value": "1", "label": "Exit 1" }, …] },
//     { "id": "space", "label": "When the space closes", "once": true, "options": […] }]'>
//
// A choice is asked per theme, or with `"once": true` a single time for the
// whole demo (shown in every theme, the same answer everywhere). A group may
// carry `"default"`: one value, or { "<theme>": value }, ticked for the
// reviewer and counted as answered until he picks otherwise (an approved
// shape is not asked again; Kenny, 2026-10-05). A group may also carry
// `"fixed"`: true, or { "<theme>": true }; there its `default` is the answer
// and the choice is not shown at all, nor repeated in the answer (Kenny,
// 2026-10-06: what he did not name to change is settled and must not be a
// choice again). Approving
// needs every choice answered; ticking one fires `review:choice` on the
// section ({ id, value }), so the demo can show what was picked.
//
// and, optionally, catalogue blocks to judge in the same sitting, as a last
// step, each shown in its own theme through block.html:
//
//   <script type="application/json" data-review-extra>
//     [{ "page": "catalogue/field.html", "block": "choices", "theme": "retro",
//        "engine": "firefox", "title": "Fields › Choices", "look": "…" }]
//   </script>
//
// One step is one theme: every section of the demo at once, stacked, the way
// "Every component, one page" shows the catalogue. The reviewer marks only what
// is wrong, with a note, and approves the theme in one go; the dialog then
// loads the next theme's register and switches by itself. Up approves the
// step, Left/Right move between steps outside a note, Escape closes. After the
// last open step the dialog closes and the answer waits at the foot.
//
// Controls (Kenny, 2026-10-05: "Als je knoppen zet die bv loading state
// weergeven, of andere dingen zoals animation, zet die dan ook in de dialog!").
// A demo marks every container of its own buttons (states, data variants,
// tones, speed, play) with one attribute:
//
//   <div data-review-controls> <div role="group" aria-label="…">…buttons…</div> … </div>
//
// A container inside a judged section belongs to that section; one outside
// every section (in the page's header) belongs to every step. When the dialog
// shows a step, each of those containers is mirrored into the controls bar
// above the stage, with the hint "Try every state and the speed before you
// judge". The demo's own buttons stay the only truth: a click on a mirrored
// button clicks the demo's button (so the demo's listeners act on the
// sections shown), and every change the demo makes to its buttons
// (aria-pressed, disabled, hidden, text) is copied back into the mirror. The
// demo's copy inside a shown section is hidden in the stage, so nothing is
// there twice. A demo needs no code of its own for this.
//
// Verdicts and notes live in this browser only (localStorage, per demo id,
// under progress.js storeKey(), which the hub reads too); the answer at the
// foot of the page is what reaches the conversation.
//
// Opened from the hub (catalogue/changed.html, the one page Kenny starts
// from), the address carries `?next=<hub>` and `review=open`: the dialog opens
// by itself, the bar has a way back, and once everything is judged one button
// copies the answer and returns to the hub, which opens the next item.
import { THEMES } from '../../js/theme-registry.js';
import { applyTheme, currentTheme } from '../../js/theme-core.js';
import { storeKey } from './progress.js';

const root = document.documentElement;
const DEMO = root.dataset.review;
const STORE = storeKey(DEMO);
const params = new URLSearchParams(location.search);
/** Where to go once the demo is judged: the hub, on this site only. */
const NEXT = (() => {
    try {
        const url = new URL(params.get('next') || '', location.href);
        return params.has('next') && url.origin === location.origin ? url.href : '';
    } catch {
        return '';
    }
})();
const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const ORDER = root.dataset.reviewThemes
    ? root.dataset.reviewThemes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
    : THEMES.map((t) => t.name);

/**
 * An option may say what it means (`hint`), or what it means in each theme
 * (`hints`, by theme name), shown under its label in the dialog.
 * @typedef {{ value: string, label: string, hint?: string, hints?: Record<string, string> }} Option
 * @typedef {{ id: string, label: string, once?: boolean, options: Option[] }} Choice
 */
/** @param {HTMLElement} section @returns {Choice[]} */
const choicesOf = (section) => {
    try {
        return JSON.parse(section.dataset.reviewChoices || '[]');
    } catch {
        return [];
    }
};
const items = [...document.querySelectorAll('[data-review-item]')].map((section) => ({
    id: section.dataset.reviewItem,
    title: section.dataset.reviewTitle || section.querySelector('h2, h3')?.textContent.trim() || section.dataset.reviewItem,
    section,
    choices: choicesOf(section),
}));

/** @type {{ page: string, block: string, theme: string, engine?: string, title?: string, look?: string }[]} */
let extras = [];
try {
    extras = JSON.parse(document.querySelector('script[data-review-extra]')?.textContent || '[]');
} catch {
    extras = [];
}

/**
 * @typedef {{ key: string, label: string, title: string, look: string, theme: string, extra?: object, item?: object }} Pair
 * @typedef {{ title: string, theme: string | null, pairs: Pair[] }} Step
 */

const lookFor = (section, theme) => section.querySelector(`[data-review-look] [data-for="${theme}"]`)?.innerHTML || '';

// One aspect per page (Kenny, 2026-10-06 12:09): "Ik wil nu het element
// centraal, net zoals het bij 'your combination' al is, en per pagina één
// aspect van de demo ... als het bv over loading gaat, dan moet de loading
// animatie al afspelen. Zo gaan we door elk aspect." A section opts in with
// `data-review-mode="aspects"` and names the attribute its option rows carry
// (`data-review-rows="data-cc-aspect"`, the value the choice's id). Each
// theme then becomes one step per open choice: the dialog shows only that
// row, its options side by side, and clicks the demo's own controls marked
// `data-review-plays="<choice id> …"` (Loading for a loading aspect, Drawn
// for an arrival), so the motion is already playing. Per aspect the reviewer
// picks one option or "None of these" with a note; the theme's verdict
// follows from all its aspects (approved, or not approved with the notes).
const ASPECT_MODE = items.length > 0 && items.every((item) => item.section.dataset.reviewMode === 'aspects');
const plainFixed = (theme, choice) => (typeof choice.fixed === 'object' && choice.fixed ? Boolean(choice.fixed[theme]) : Boolean(choice.fixed));

/** @type {Step[]} */
const steps = ORDER.flatMap((theme) => {
    const themePairs = items.map((item) => ({
        key: `${theme}|${item.id}`,
        label: `${item.id} · ${theme}`,
        title: item.title,
        look: '',
        theme,
        item,
    }));
    if (!ASPECT_MODE) return [{ title: LABEL[theme] || theme, theme, pairs: themePairs }];
    const aspectSteps = themePairs.flatMap((pair) =>
        pair.item.choices
            .filter((choice) => !choice.once && !plainFixed(theme, choice))
            .map((choice) => ({ title: `${LABEL[theme] || theme} · ${choice.label}`, theme, aspect: choice.id, pairs: [pair] })),
    );
    return aspectSteps.length ? aspectSteps : [{ title: LABEL[theme] || theme, theme, pairs: themePairs }];
});
if (extras.length) {
    steps.push({
        title: 'Catalogue blocks',
        theme: null,
        pairs: extras.map((extra) => {
            const slug = extra.page.replace(/^.*\//, '').replace(/\.html$/, '');
            const id = `${slug}--${extra.block}`;
            const engine = extra.engine || 'firefox';
            return {
                key: `catalogue|${id}|${extra.theme}|${engine}`,
                label: `${id} · ${extra.theme} · ${engine}`,
                title: `${extra.title || id} · ${LABEL[extra.theme] || extra.theme}`,
                look: extra.look || '',
                theme: extra.theme,
                extra,
            };
        }),
    });
}
const pairs = [...new Set(steps.flatMap((step) => step.pairs))];

/* ------------------------------------------------------------- storage */

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORE) || '{}') || {};
    } catch {
        return {};
    }
}
let state = load();
function save() {
    try {
        localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
        /* a private window: the answer on the page still holds everything */
    }
}

// A later round reopens, once per browser, every pair rejected in the rounds
// before it, plus any pair it names as redrawn:
//   <script type="application/json" data-review-round>{"round": "<id>", "reopen": ["<theme>|<item>", …]}</script>
// `reopen` is optional: a new round id alone reopens the rejected pairs. Every
// approved verdict stands, and the dialog walks only what is open again
// (Kenny, 2026-10-04, review-rereview-M1: a second round walked all 176 pairs
// and needed the stored answer cleared by hand before it walked at all).
let round = null;
try {
    round = JSON.parse(document.querySelector('script[data-review-round]')?.textContent || 'null');
} catch {
    round = null;
}
if (round?.round && state.__round !== round.round) {
    for (const [key, entry] of Object.entries(state)) if (entry?.verdict === 'rejected') delete state[key];
    for (const key of round.reopen || []) delete state[key];
    state.__round = round.round;
    save();
}
const verdictOf = (pair) => state[pair.key]?.verdict;
const noteOf = (pair) => state[pair.key]?.note || '';
/** Where a choice's answer is kept: on the pair, or once for the demo. */
const onceKey = (item, choice) => `once|${item.id}|${choice.id}`;
/** A choice group's `default` (a value, or { theme: value }) counts as the answer until the reviewer picks otherwise. */
const defaultOf = (pair, choice) => (typeof choice.default === 'object' && choice.default ? choice.default[pair.theme] : choice.default) || '';
const choiceOf = (pair, choice) =>
    (choice.once ? state[onceKey(pair.item, choice)]?.value : state[pair.key]?.choices?.[choice.id]) || defaultOf(pair, choice);
/** A settled choice: answered by its `default`, not shown, not repeated in the answer. */
const fixedFor = (pair, choice) => (typeof choice.fixed === 'object' && choice.fixed ? Boolean(choice.fixed[pair.theme]) : Boolean(choice.fixed));
const optionLabel = (choice, value) => choice.options.find((o) => o.value === value)?.label || value;
const isOpen = (pair) => !verdictOf(pair);
/** An aspect step is answered once its option is picked, or "None of these" is noted. */
const aspectDone = (pair, aspect) => Boolean(state[pair.key]?.choices?.[aspect] || state[pair.key]?.redo?.[aspect]);
const stepOpen = (step) => (step.aspect ? step.pairs.some((p) => isOpen(p) && !aspectDone(p, step.aspect)) : step.pairs.some(isOpen));
/** Every theme that has a step, once. */
const themesOf = (list) => [...new Set(list.map((s) => s.theme).filter(Boolean))];

/* --------------------------------------------------------------- theme */

const registerUrl = (theme) => new URL(`../../css/${theme}-register.css`, import.meta.url).href;

/** Switches the theme, loading its register first so nothing paints unstyled. */
async function switchTheme(theme) {
    if (currentTheme() === theme) return;
    const present = [...document.querySelectorAll('link[rel="stylesheet"]')].some((l) => l.href === registerUrl(theme));
    if (!present) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = registerUrl(theme);
        link.setAttribute('data-kp-register', theme);
        const loaded = new Promise((resolve) => {
            link.onload = link.onerror = resolve;
        });
        (document.querySelector('link[data-kp-register]') || document.head.lastElementChild).after(link);
        await loaded;
    }
    applyTheme(theme);
}

/* ---------------------------------------------------------------- page */

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = new URL('review.css', import.meta.url).href;
document.head.append(style);

const main = document.querySelector('main') || document.body;
const bar = document.createElement('div');
bar.className = 'rv-bar';
bar.innerHTML = `
    <span class="rv-bar__count" data-rv-count></span>
    <span class="rv-bar__spacer"></span>
    <button type="button" class="kp-button kp-button--primary" data-rv-open>Review in a dialog</button>
    <button type="button" class="kp-button" data-rv-copy>Copy answer</button>`;
if (NEXT) {
    const back = document.createElement('a');
    back.className = 'kp-button kp-button--ghost';
    back.href = NEXT;
    back.setAttribute('data-rv-hub', '');
    back.textContent = '← To judge';
    back.title = 'Back to the list of everything waiting for a verdict';
    bar.prepend(back);
}
// Inside the page's main column: on a page the catalogue shell wraps, the body
// is a grid and a bar beside main would become a cell of its own.
main.prepend(bar);

const foot = document.createElement('section');
foot.className = 'rv-answer';
foot.setAttribute('aria-labelledby', 'rv-answer-title');
foot.innerHTML = `
    <h2 id="rv-answer-title">Your answer</h2>
    <p class="rv-meta">Every verdict and note from the dialog, as one answer to paste into the conversation. It stays in this browser until you clear it.</p>
    <pre class="rv-answer__text" data-rv-answer></pre>
    <p class="rv-answer__actions">
        <button type="button" class="kp-button" data-rv-copy>Copy answer</button>
        <button type="button" class="kp-button kp-button--primary" data-rv-next hidden>Copy answer, on to the next item</button>
        <button type="button" class="kp-button kp-button--ghost" data-rv-clear>Clear all verdicts</button>
        <span class="rv-meta" role="status" aria-live="polite" data-rv-status></span>
    </p>`;
main.append(foot);

function answer() {
    const judged = pairs.filter((p) => !isOpen(p));
    const rejected = pairs.filter((p) => verdictOf(p) === 'rejected');
    const lines = [
        `Demo review · ${DEMO} · ${judged.length} of ${pairs.length} judged, ${judged.length - rejected.length} approved, ${rejected.length} not approved, ${pairs.length - judged.length} open`,
    ];
    const themesDone = themesOf(steps).filter((t) => pairs.filter((p) => p.theme === t && !p.extra).every((p) => verdictOf(p) === 'approved'));
    if (themesDone.length) lines.push('', `Approved in full: ${themesDone.join(', ')}`);
    const extraDone = pairs.filter((p) => p.extra && verdictOf(p) === 'approved');
    if (extraDone.length) lines.push('', 'Catalogue pairs approved:', ...extraDone.map((p) => `- ${p.label}`));
    if (rejected.length) lines.push('', 'Not approved:', ...rejected.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const notes = pairs.filter((p) => verdictOf(p) === 'approved' && noteOf(p));
    if (notes.length) lines.push('', 'Approved, with a note:', ...notes.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const picked = pairs.flatMap((p) =>
        (p.item?.choices || [])
            .filter((c) => !c.once && !fixedFor(p, c) && choiceOf(p, c))
            .map((c) => `- ${p.label}: ${c.label} = ${optionLabel(c, choiceOf(p, c))}`),
    );
    if (picked.length) lines.push('', 'Picked per theme:', ...picked);
    const once = items.flatMap((item) =>
        item.choices
            .filter((c) => c.once && state[onceKey(item, c)]?.value)
            .map((c) => `- ${item.id}: ${c.label} = ${optionLabel(c, state[onceKey(item, c)].value)}`),
    );
    if (once.length) lines.push('', 'Picked once, for every theme:', ...once);
    const openSteps = steps.filter(stepOpen);
    if (openSteps.length) lines.push('', `Still open: ${[...new Set(openSteps.map((s) => s.theme || s.title))].join(', ')}`);
    return { text: lines.join('\n'), judged: judged.length, rejected: rejected.length };
}

function render() {
    const { text, judged, rejected } = answer();
    foot.querySelector('[data-rv-answer]').textContent = text;
    const done = steps.filter((s) => !stepOpen(s)).length;
    bar.querySelector('[data-rv-count]').textContent =
        `${done} of ${steps.length} steps judged (${judged} of ${pairs.length} pairs)${rejected ? ` · ${rejected} not approved` : ''}`;
    bar.querySelector('[data-rv-open]').textContent = judged
        ? judged === pairs.length
            ? 'Look again in the dialog'
            : 'Continue in the dialog'
        : 'Review in a dialog';
    nextButton.hidden = !NEXT || judged < pairs.length;
}

const say = (message) => {
    foot.querySelector('[data-rv-status]').textContent = message;
};

/** Copy the answer; true when it reached the clipboard, else it is selected. */
async function copyAnswer() {
    const { text } = answer();
    try {
        await navigator.clipboard.writeText(text);
        say('Copied. Paste it into the conversation.');
        return true;
    } catch {
        const pre = foot.querySelector('[data-rv-answer]');
        pre.scrollIntoView({ block: 'center' });
        const range = document.createRange();
        range.selectNodeContents(pre);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(range);
        say('Selected. Press Ctrl+C to copy.');
        return false;
    }
}
for (const copy of document.querySelectorAll('[data-rv-copy]')) copy.addEventListener('click', copyAnswer);

// The hand-off to the hub: shown once nothing is open; a copy that only
// selected the text stays here, so the answer is not lost on the way.
const nextButton = foot.querySelector('[data-rv-next]');
nextButton.addEventListener('click', async () => {
    if (await copyAnswer()) location.assign(NEXT);
});

foot.querySelector('[data-rv-clear]').addEventListener('click', () => {
    if (!confirm('Clear every verdict and note on this demo, in every theme?')) return;
    state = {};
    save();
    render();
    say('Cleared.');
});

/* -------------------------------------------------------------- dialog */

const dialog = document.createElement('dialog');
dialog.className = 'kp-dialog rv-dialog';
dialog.setAttribute('aria-labelledby', 'rv-dialog-title');
dialog.innerHTML = `
    <div class="rv-dialog__head">
        <p class="rv-dialog__position" data-rv-position></p>
        <h2 class="kp-dialog__title" id="rv-dialog-title" data-rv-title></h2>
        <span class="kp-badge" data-rv-state></span>
        <button type="button" class="kp-button kp-button--ghost rv-dialog__close" aria-label="Close (Escape)" data-rv-close>✕</button>
    </div>
    <div class="rv-dialog__grid">
        <div class="rv-dialog__view">
            <details class="rv-controls" open data-rv-controls hidden>
                <summary class="rv-controls__hint">Try every state and the speed before you judge</summary>
                <div class="rv-controls__body" data-rv-controls-body></div>
            </details>
            <div class="rv-flip" data-rv-flip>
                <button type="button" class="rv-flip__arrow rv-flip__arrow--left" data-rv-flip-prev aria-label="Previous option (←)" hidden>←</button>
                <div class="rv-dialog__stage" data-rv-stage></div>
                <button type="button" class="rv-flip__arrow rv-flip__arrow--right" data-rv-flip-next aria-label="Next option (→)" hidden>→</button>
            </div>
            <div class="rv-flip__bar" data-rv-flip-bar hidden>
                <div class="rv-flip__dots" data-rv-flip-dots></div>
                <p class="rv-flip__label" data-rv-flip-label></p>
                <div class="rv-flip__tools" role="group" aria-label="Motion, for the option shown">
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-replay>⟲ Replay (R)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-pause aria-pressed="false">Pause (Space)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-speed>Speed: Full (E)</button>
                    <button type="button" class="kp-button kp-button--sm" data-rv-flip-tour aria-pressed="false">Tour the states (A)</button>
                </div>
            </div>
        </div>
        <div class="rv-dialog__side">
            <p class="rv-meta" data-rv-intro>Everything on the left is approved together. Tick only what is wrong, and say why.</p>
            <ol class="rv-dialog__list" data-rv-list></ol>
            <p class="kp-field__error" role="alert" data-rv-refused hidden></p>
            <div class="rv-dialog__actions">
                <button type="button" class="kp-button" data-rv-go="-1">← Previous</button>
                <button type="button" class="kp-button" data-rv-go="1">Next →</button>
                <button type="button" class="kp-button kp-button--primary rv-dialog__wide" data-rv-approve>↑ Approve this theme</button>
            </div>
            <p class="rv-meta" id="rv-keys">Up approves the step, Left/Right move between steps, Escape closes. The theme switches by itself.</p>
        </div>
    </div>`;
document.body.append(dialog);
const $ = (selector) => /** @type {HTMLElement} */ (dialog.querySelector(selector));
const stage = $('[data-rv-stage]');
const list = $('[data-rv-list]');
const refused = $('[data-rv-refused]');
const approveButton = $('[data-rv-approve]');
const flipWrap = $('[data-rv-flip]');
const flipPrev = $('[data-rv-flip-prev]');
const flipNext = $('[data-rv-flip-next]');
const flipBar = $('[data-rv-flip-bar]');
const flipDots = $('[data-rv-flip-dots]');
const flipLabel = $('[data-rv-flip-label]');
const flipPauseBtn = $('[data-rv-flip-pause]');
const flipSpeedBtn = $('[data-rv-flip-speed]');
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let index = 0;
/** The pairs on screen: the open ones of the step, or all of it once it is judged. */
let shownPairs = [];
/** @type {[Comment, HTMLElement][]} */
let moved = [];
/** True while a theme loads: a key pressed then would judge a step not yet on screen. */
let busy = false;

/* ------------------------------------------------------- aspect flip ---
 * One aspect page shows one option at a time, large (Kenny, form v32,
 * 2026-10-06: Flip, "er moeten wel opties zijn om bv animaties terug te
 * starten bv"). Every demo names its option cards the same way (an
 * attribute ending in "-option", e.g. data-cc-option/data-tr-option): no
 * per-demo class names are hard-coded here, so this works for every
 * character-* demo in aspect mode without touching the demos themselves.
 */
let flipRow = null;
let flipCells = [];
let flipTrio = null;
let flipChoice = null;
let flipPair = null;
let flipAt = 0;
let motionPaused = false;
let motionSpeed = '1';

const optionIndexOf = (el) => {
    for (const attr of el.attributes) if (/-option$/.test(attr.name)) return Number(attr.value);
    return null;
};
/** The row's option cards, in order, however the demo names its own attribute. */
const cellsOf = (row) =>
    [...row.querySelectorAll('*')]
        .map((el) => /** @type {[Element, number | null]} */ ([el, optionIndexOf(el)]))
        .filter(([, n]) => n != null && !Number.isNaN(n))
        .sort((a, b) => a[1] - b[1])
        .map(([el]) => el);

/** Re-presses the demo's own data-review-plays controls for one aspect (outside the mirrored copy). */
function playAspect(section, aspectId) {
    const mine = kept[`${DEMO}|${aspectId}`] || {};
    for (const b of section.querySelectorAll('[data-review-plays]')) {
        if (b.closest('.rv-controls') || !b.getAttribute('data-review-plays').split(/\s+/).includes(aspectId)) continue;
        // A state the reviewer set in this group stands; the autoplay leaves it.
        const group = b.closest('[role="group"]');
        if (b.hasAttribute('aria-pressed') && group && groupName(group) in mine) continue;
        /** @type {HTMLElement} */ (b).click();
    }
}

/**
 * The state buttons the reviewer pressed, per demo and aspect: the group's
 * name and the button's place in it, kept across options, themes and
 * visits (Kenny, 2026-10-06 20:12: "als ik bv open als state had gekozen via
 * de knop, dan wil ik dat die state blijft staan bij de volgende optie …
 * onthoudt de state hiervan"). Only toggles (aria-pressed) count; actions
 * like Live update or Draw, and the speed, do not.
 */
const KEPT_STORE = `${STORE}:kept`;
/** @type {Record<string, Record<string, number>>} */
let kept = {};
try {
    kept = JSON.parse(localStorage.getItem(KEPT_STORE) || '{}') || {};
} catch {
    kept = {};
}
const groupName = (/** @type {Element} */ group) => group.getAttribute('aria-label') || '';
function keepPress(/** @type {Element | null | undefined} */ button) {
    const step = steps[index];
    const group = button?.closest('[role="group"]');
    if (!step?.aspect || !group || !button?.hasAttribute('aria-pressed') || group.closest('.rv-controls')) return;
    if (!group.closest('[data-review-controls]') || /speed/i.test(groupName(group))) return;
    if (Object.keys(/** @type {HTMLElement} */ (button).dataset).some((k) => /speed$/i.test(k))) return;
    (kept[`${DEMO}|${step.aspect}`] ??= {})[groupName(group)] = [...group.querySelectorAll('button')].indexOf(
        /** @type {HTMLButtonElement} */ (button),
    );
    try {
        localStorage.setItem(KEPT_STORE, JSON.stringify(kept));
    } catch {
        // No storage: kept for this visit only.
    }
}
/** Presses the reviewer's own states again, after the demo redrew (a flip, a theme change). */
function restoreKept(section, aspectId) {
    const mine = kept[`${DEMO}|${aspectId}`];
    if (!mine) return;
    for (const group of section.querySelectorAll('[data-review-controls] [role="group"]')) {
        if (group.closest('.rv-controls') || !(groupName(group) in mine)) continue;
        const button = /** @type {HTMLElement | undefined} */ ([...group.querySelectorAll('button')][mine[groupName(group)]]);
        if (button && button.getAttribute('aria-pressed') !== 'true') button.click();
    }
}

/** Forces every CSS animation under `root` to restart from its first frame. */
function restartMotion(root) {
    const els = [root, ...root.querySelectorAll('*')];
    for (const el of els) /** @type {HTMLElement} */ (el).style.animation = 'none';
    void (/** @type {HTMLElement} */ (root).offsetWidth); // reflow, so the clear below is not coalesced with the set above
    for (const el of els) /** @type {HTMLElement} */ (el).style.removeProperty('animation');
}

/** Finds the demo's own speed button (its attribute ends in "-speed") carrying this value, and clicks it. */
function pressSpeed(value) {
    for (const el of document.querySelectorAll('button')) {
        if (el.closest('.rv-controls')) continue; // the mirrored copy; its click only forwards to this one anyway
        for (const attr of el.attributes)
            if (/-speed$/.test(attr.name) && attr.value === value) {
                /** @type {HTMLElement} */ (el).click();
                return;
            }
    }
}

/** Injects/updates the "every animation paused" rule the P key and button toggle. */
function applyPauseStyle() {
    let style = document.getElementById('rv-flip-pause');
    if (!style) {
        style = document.createElement('style');
        style.id = 'rv-flip-pause';
        document.head.append(style);
    }
    style.textContent = motionPaused ? '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }' : '';
    flipPauseBtn.setAttribute('aria-pressed', String(motionPaused));
    flipPauseBtn.textContent = motionPaused ? 'Resume (Space)' : 'Pause (Space)';
}

/** Leaves the demo exactly as focusAspect found it: every cell shown again, no leftover sizing. */
function teardownFlip() {
    if (flipTrio) flipTrio.removeAttribute('data-rv-flip-trio');
    for (const cell of flipCells) {
        /** @type {HTMLElement} */ (cell).hidden = false;
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-kpi-spark-height');
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-graph-height');
    }
    flipRow = null;
    flipCells = [];
    flipTrio = null;
    flipChoice = null;
    flipPair = null;
    flipWrap.classList.remove('rv-flip--active');
    flipPrev.hidden = flipNext.hidden = true;
    flipBar.hidden = true;
}

/** Finds the aspect's row and its option cards, and the flip's starting position (the pick already on file, else the first). */
function setupFlip(step, pair) {
    const section = pair.item.section;
    const rowsAttr = section.dataset.reviewRows;
    const row = rowsAttr ? section.querySelector(`[${rowsAttr}="${CSS.escape(step.aspect)}"]`) : null;
    flipChoice = pair.item.choices.find((c) => c.id === step.aspect) || null;
    flipPair = pair;
    flipRow = row;
    flipCells = row ? cellsOf(row).slice(0, flipChoice?.options.length || 0) : [];
    flipTrio = flipCells[0]?.parentElement || null;
    if (flipTrio) flipTrio.setAttribute('data-rv-flip-trio', '');
    const already = flipChoice ? choiceOf(pair, flipChoice) : '';
    const at = already ? flipChoice.options.findIndex((o) => o.value === already) : 0;
    flipAt = at >= 0 ? at : 0;
    flipWrap.classList.add('rv-flip--active');
    flipPrev.hidden = flipNext.hidden = false;
    flipBar.hidden = false;
}

/** Shows only flipCells[flipAt], large; its number, name and one-line note once; plays and restarts its motion. */
function paintFlip(step) {
    if (!flipRow) return;
    flipCells.forEach((cell, i) => {
        /** @type {HTMLElement} */ (cell).hidden = i !== flipAt;
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-kpi-spark-height');
        /** @type {HTMLElement} */ (cell).style.removeProperty('--kp-graph-height');
    });
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (shown) {
        shown.style.setProperty('--kp-kpi-spark-height', '16rem');
        shown.style.setProperty('--kp-graph-height', '26rem');
    }
    const option = flipChoice?.options[flipAt];
    flipLabel.replaceChildren();
    if (option) {
        const b = document.createElement('b');
        b.textContent = `${flipAt + 1}/${flipChoice.options.length} · ${option.label}`;
        flipLabel.append(b);
        const hint = option.hints?.[flipPair.theme] || option.hint || '';
        if (hint) {
            const small = document.createElement('small');
            small.textContent = hint;
            flipLabel.append(small);
        }
    }
    flipDots.replaceChildren(
        ...(flipChoice?.options || []).map((_, i) => {
            const dot = document.createElement('span');
            if (i === flipAt) dot.className = 'rv-flip__dot--active';
            return dot;
        }),
    );
    const reduced = prefersReducedMotion();
    if (reduced) {
        const note = document.createElement('small');
        note.className = 'rv-flip__reduced';
        note.textContent = 'Reduced motion: still frame, no autoplay.';
        flipLabel.append(note);
    } else {
        playAspect(flipPair.item.section, step.aspect);
    }
    restoreKept(flipPair.item.section, step.aspect);
    markTarget(shown);
    if (shown)
        requestAnimationFrame(() => {
            fitShown(shown);
            restartMotion(shown);
        });
    applyPauseStyle();
    pressSpeed(motionSpeed);
    flipSpeedBtn.textContent = `Speed: ${motionSpeed === '1' ? 'Full' : motionSpeed === '0.5' ? '½' : '¼'} (E)`;
}

/** Scales the shown option down until all of it fits the stage's height: the element whole, never cropped. */
function fitShown(/** @type {HTMLElement} */ shown) {
    shown.style.removeProperty('zoom');
    stage.scrollTop = 0;
    const top = shown.getBoundingClientRect().top - stage.getBoundingClientRect().top;
    const room = stage.clientHeight - top - 8;
    const need = shown.getBoundingClientRect().height;
    if (need > room && room > 0) shown.style.setProperty('zoom', String(Math.max(0.4, room / need)));
}

/**
 * Outlines the part of the demo the aspect is about, when the demo names it
 * (a choice's `target` selector and `targetName` words), and says so under
 * the option's name (Kenny, 2026-10-06 19:33: "it's really not clear which
 * parts of the demo you are targeting for evaluation"). A part that only
 * appears later (the tour's ring after Next) is outlined when it does.
 */
let targetWatch = null;
function markTarget(/** @type {HTMLElement | undefined} */ shown) {
    targetWatch?.disconnect();
    targetWatch = null;
    for (const el of document.querySelectorAll('[data-rv-target]')) el.removeAttribute('data-rv-target');
    const selector = flipChoice?.target;
    if (!shown || !selector) return;
    const mark = () => {
        for (const el of document.querySelectorAll('[data-rv-target]'))
            if (!shown.contains(el) || !el.matches(selector)) el.removeAttribute('data-rv-target');
        for (const el of shown.querySelectorAll(selector)) if (!el.hasAttribute('data-rv-target')) el.setAttribute('data-rv-target', '');
    };
    mark();
    targetWatch = new MutationObserver(mark);
    targetWatch.observe(shown, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['data-kp-tour-target', 'class', 'open', 'hidden'],
    });
    if (flipChoice.targetName) {
        const small = document.createElement('small');
        small.className = 'rv-flip__target';
        small.textContent = `Judge only what the dashed outline marks: ${flipChoice.targetName}.`;
        flipLabel.append(small);
    }
}

/** ←/→ and the on-screen arrows: the next or previous option, its motion restarted; never leaves the page. */
function flip(step, dir) {
    if (!flipChoice || !step?.aspect) return;
    flipAt = (flipAt + dir + flipChoice.options.length) % flipChoice.options.length;
    paintFlip(step);
}

/** Replay (R / the button): restarts the shown option's motion from the start, without flipping away. */
/**
 * The demo's own control groups, in order, without the speed group (the
 * dialog has its own): the state words first, then the tone, then any
 * further set (Kenny, 2026-10-06 17:14: "I would like to be able to not
 * have to take my hands off the keyboard ... left hand on the normal
 * position and the right hand on the arrow keys").
 */
function controlGroups() {
    const section = flipPair?.item?.section;
    if (!section) return [];
    return [...section.querySelectorAll('[data-review-controls] [role="group"]')]
        .filter(
            (g) =>
                !g.closest('.rv-controls') &&
                !/speed/i.test(g.getAttribute('aria-label') || '') &&
                !g.querySelector('[data-cc-speed], [data-ct-speed], [data-tl-speed]'),
        )
        .map((g) => /** @type {HTMLElement[]} */ ([...g.querySelectorAll('button')].filter((b) => !/speed/i.test(Object.keys(b.dataset).join(' ')))))
        .filter((buttons) => buttons.length);
}
/** Presses the next (or previous) button of control group n, as the demo's own click would. */
function stepGroup(n, dir = 1) {
    const buttons = controlGroups()[n];
    if (!buttons) return;
    const pressed = buttons.findIndex((b) => b.getAttribute('aria-pressed') === 'true');
    const last = Number(buttons[0].closest('[role="group"]')?.getAttribute('data-rv-last') ?? (pressed >= 0 ? pressed : -1));
    const at = ((pressed >= 0 ? pressed : last) + dir + buttons.length) % buttons.length;
    buttons[0].closest('[role="group"]')?.setAttribute('data-rv-last', String(at));
    buttons[at].click();
    keepPress(buttons[at]);
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (shown) requestAnimationFrame(() => fitShown(shown));
}
/** A: tours the first group's states by itself, then the next tone, over and over, until pressed again or the page changes. */
let tourTimer = 0;
let tourCount = 0;
const tourButton = $('[data-rv-flip-tour]');
function stopTour() {
    clearInterval(tourTimer);
    tourTimer = 0;
    tourButton?.setAttribute('aria-pressed', 'false');
}
function toggleTour() {
    if (tourTimer) return stopTour();
    tourCount = 0;
    tourButton?.setAttribute('aria-pressed', 'true');
    const tick = () => {
        const groups = controlGroups();
        if (!groups.length) return stopTour();
        stepGroup(0);
        tourCount += 1;
        if (groups[1] && tourCount % groups[0].length === 0) stepGroup(1);
    };
    tick();
    tourTimer = setInterval(tick, 3000);
}
tourButton?.addEventListener('click', () => toggleTour());

/** Z (AZERTY): presses the demo's own live-update control, whatever the demo calls it. */
function liveUpdate() {
    const section = flipPair?.item?.section;
    if (!section) return;
    const live = [...section.querySelectorAll('[data-review-controls] button')].find(
        (b) => !b.closest('.rv-controls') && (Object.keys(b.dataset).some((k) => /live$/i.test(k)) || /^\s*live update/i.test(b.textContent || '')),
    );
    if (live) return live.click();
    // A demo without a live update (busy, drawer, header …) says so instead
    // of doing nothing (Kenny, 2026-10-06 19:29: "when I press Z … what's
    // supposed to happen here?").
    flipLabel.querySelector('.rv-flip__nokey')?.remove();
    const note = document.createElement('small');
    note.className = 'rv-flip__nokey';
    note.textContent = 'This component has no live update, so Z does nothing here.';
    flipLabel.append(note);
    setTimeout(() => note.remove(), 2500);
}

function replay(step) {
    if (!step?.aspect || !flipPair) return;
    const shown = /** @type {HTMLElement} */ (flipCells[flipAt]);
    if (!prefersReducedMotion()) playAspect(flipPair.item.section, step.aspect);
    if (shown) requestAnimationFrame(() => restartMotion(shown));
}

/** P / the button: pauses or resumes every animation and transition on the page. */
function togglePause() {
    motionPaused = !motionPaused;
    applyPauseStyle();
}

/** S / the button: cycles the demo's own speed control through full, ½ and ¼. */
function cycleSpeed() {
    motionSpeed = motionSpeed === '1' ? '0.5' : motionSpeed === '0.5' ? '0.25' : '1';
    pressSpeed(motionSpeed);
    flipSpeedBtn.textContent = `Speed: ${motionSpeed === '1' ? 'Full' : motionSpeed === '0.5' ? '½' : '¼'} (E)`;
}
/**
 * Resolves once the page's own scripts have run. The catalogue shell
 * (catalogue/catalogue.js, a module after this one) moves every child of the
 * body into its column; a dialog moved while open leaves the top layer and
 * stays open as a plain, non-modal box placed after the answer at the foot,
 * so every approval that lengthened the answer pushed it a little further
 * down, and only closing and reopening made it modal again (Kenny,
 * 2026-10-05, fix-102). Every module script has run by DOMContentLoaded, so
 * the dialog opens after it, once the shell has placed it for good.
 */
const booted = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
        window.addEventListener('load', resolve, { once: true });
    }
});

/**
 * Shows only one aspect's row of a section: every sibling on the way from
 * that row up to the section is set aside, except what holds the demo's
 * controls or its look-at line. `null` shows the whole section again.
 * @param {HTMLElement} section @param {string | null} aspect
 */
function focusAspect(section, aspect) {
    for (const el of section.querySelectorAll('[data-review-off]')) el.removeAttribute('data-review-off');
    section.removeAttribute('data-review-focus');
    const attr = section.dataset.reviewRows;
    if (!aspect || !attr) return;
    const row = section.querySelector(`[${attr}="${CSS.escape(aspect)}"]`);
    if (!row) return;
    section.setAttribute('data-review-focus', aspect);
    for (let el = row; el && el !== section; el = el.parentElement)
        for (const sib of el.parentElement?.children || [])
            if (
                sib !== el &&
                !sib.matches('script, style') &&
                !sib.querySelector('[data-review-controls]') &&
                !sib.matches('[data-review-controls]') &&
                !sib.matches('[data-review-look]')
            )
                sib.setAttribute('data-review-off', '');
}

function putBack() {
    markTarget(undefined);
    stopTour();
    teardownFlip();
    for (const [, section] of moved) focusAspect(section, null);
    unmirror();
    for (const [placeholder, section] of moved) placeholder.replaceWith(section);
    moved = [];
    stage.replaceChildren();
}

/* ------------------------------------------------------------ controls */

const controlsBox = $('[data-rv-controls]');
const controlsBody = $('[data-rv-controls-body]');
/** @type {MutationObserver[]} */
let mirrors = [];
/** The demo's own controls, in document order, that the mirror can act on. */
const actorsOf = (root) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll('button, input, select, textarea, a[href], summary')]);

function unmirror() {
    for (const observer of mirrors) observer.disconnect();
    mirrors = [];
    controlsBody.replaceChildren();
    controlsBox.hidden = true;
}

/**
 * Mirrors one container of the demo's controls into the bar: a copy without
 * ids, whose clicks and edits go to the demo's own elements, rebuilt whenever
 * the demo changes its own (a pressed state, a label, a hidden button).
 * @param {HTMLElement} source @param {string} heading
 */
function mirror(source, heading) {
    const slot = document.createElement('div');
    slot.className = 'rv-controls__set';
    if (heading) {
        const title = document.createElement('p');
        title.className = 'rv-controls__title';
        title.textContent = heading;
        slot.append(title);
    }
    const holder = document.createElement('div');
    slot.append(holder);
    const build = () => {
        const focusAt = actorsOf(holder).indexOf(/** @type {HTMLElement} */ (document.activeElement));
        const copy = /** @type {HTMLElement} */ (source.cloneNode(true));
        copy.removeAttribute('data-review-controls');
        copy.hidden = false;
        for (const el of [copy, ...copy.querySelectorAll('[id]')]) el.removeAttribute('id');
        const theirs = actorsOf(source);
        actorsOf(copy).forEach((mine, i) => {
            const own = theirs[i];
            if (!own) return;
            if (mine.matches('button, a[href], summary')) {
                mine.addEventListener('click', (event) => {
                    event.preventDefault();
                    own.click();
                    keepPress(own);
                });
            } else {
                const forward = (event) => {
                    const from = /** @type {HTMLInputElement} */ (mine);
                    const to = /** @type {HTMLInputElement} */ (own);
                    if ('checked' in from && (from.type === 'checkbox' || from.type === 'radio')) to.checked = from.checked;
                    else to.value = from.value;
                    to.dispatchEvent(new Event(event.type, { bubbles: true }));
                };
                mine.addEventListener('input', forward);
                mine.addEventListener('change', forward);
            }
        });
        holder.replaceChildren(copy);
        if (focusAt >= 0) actorsOf(copy)[focusAt]?.focus();
    };
    build();
    const observer = new MutationObserver(build);
    observer.observe(source, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['aria-pressed', 'aria-checked', 'aria-disabled', 'disabled', 'hidden', 'class', 'value', 'checked'],
    });
    mirrors.push(observer);
    controlsBody.append(slot);
}

/** The controls of the sections on screen, and those of the whole page. */
function mirrorControls(sections) {
    unmirror();
    const all = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-review-controls]')]);
    const pageWide = all.filter((el) => !el.closest('[data-review-item]'));
    const own = sections.map((section) => ({ section, sets: all.filter((el) => el.closest('[data-review-item]') === section) }));
    const titled = own.filter((o) => o.sets.length).length > 1;
    for (const el of pageWide) mirror(el, titled ? 'Every section' : '');
    for (const { section, sets } of own) for (const el of sets) mirror(el, titled ? section.dataset.reviewTitle || section.dataset.reviewItem : '');
    controlsBox.hidden = !controlsBody.childElementCount;
}

function frameFor(pair) {
    const { page, block, theme } = pair.extra;
    const box = document.createElement('section');
    box.className = 'rv-extra';
    box.dataset.rvPair = pair.key;
    const src = new URL('block.html', import.meta.url);
    src.search = new URLSearchParams({ page, block, theme }).toString();
    box.innerHTML = `<h2 class="rv-extra__title"></h2><iframe class="rv-extra__frame"></iframe>`;
    box.querySelector('h2').textContent = pair.title;
    const frame = box.querySelector('iframe');
    frame.title = pair.title;
    // Same origin, so the frame takes its block's own height once the block
    // is in, and follows it when the block grows (an opened menu, a step).
    frame.addEventListener('load', () => {
        const doc = frame.contentDocument;
        if (!doc) return;
        const fit = () => {
            frame.style.blockSize = `${doc.documentElement.scrollHeight}px`;
        };
        new ResizeObserver(fit).observe(doc.body);
        fit();
    });
    frame.src = src.href;
    return box;
}

function rowFor(pair, only = null) {
    const li = document.createElement('li');
    li.className = 'rv-row';
    const id = `rv-${pair.key.replace(/[^a-z0-9-]/gi, '-')}`;
    li.innerHTML = `
        <div class="rv-row__head">
            <button type="button" class="rv-row__jump" data-rv-jump></button>
            <span class="kp-field kp-field--check rv-row__check">
                <input class="kp-field__check" type="checkbox" id="${id}" data-rv-reject />
                <label class="kp-field__label" for="${id}">${only ? 'None of these' : 'Not approved'}</label>
            </span>
        </div>
        <p class="rv-row__look" data-rv-row-look></p>
        <div class="rv-row__choices" data-rv-choices></div>
        <textarea class="kp-field__input kp-field__input--multiline rv-row__note" rows="2" placeholder="What should change" data-rv-row-note hidden></textarea>`;
    li.querySelector('[data-rv-jump]').textContent = pair.title;
    const look = pair.item ? lookFor(pair.item.section, pair.theme) : pair.look;
    const lookBox = li.querySelector('[data-rv-row-look]');
    if (look && !only) lookBox.innerHTML = look;
    else lookBox.remove();
    const choiceBox = li.querySelector('[data-rv-choices]');
    // In aspect mode the option itself is picked by flipping it large in the stage
    // (flip()/paintFlip()), not by a radio here, so the sidebar carries only the
    // "None of these" checkbox and note for this one aspect.
    for (const choice of only ? [] : pair.item?.choices || []) {
        if (fixedFor(pair, choice)) continue;
        const set = document.createElement('fieldset');
        set.className = 'rv-choice';
        set.dataset.rvChoice = choice.id;
        const legend = document.createElement('legend');
        legend.textContent = choice.once ? `${choice.label} (once, for every theme)` : choice.label;
        set.append(legend);
        for (const option of choice.options) {
            const label = document.createElement('label');
            label.className = 'rv-choice__option';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `${id}-${choice.id}`;
            input.value = option.value;
            input.checked = choiceOf(pair, choice) === option.value;
            input.addEventListener('change', () => {
                if (choice.once) state[onceKey(pair.item, choice)] = { value: option.value };
                else state[pair.key] = { ...state[pair.key], choices: { ...state[pair.key]?.choices, [choice.id]: option.value } };
                save();
                render();
                pair.item.section.dispatchEvent(new CustomEvent('review:choice', { bubbles: true, detail: { id: choice.id, value: option.value } }));
            });
            const text = document.createElement('span');
            const name = document.createElement('b');
            name.textContent = option.label;
            text.append(name);
            const hint = option.hints?.[pair.theme] || option.hint;
            if (hint) {
                const small = document.createElement('span');
                small.className = 'rv-choice__hint';
                small.textContent = hint;
                text.append(small);
            }
            label.append(input, text);
            set.append(label);
        }
        choiceBox.append(set);
    }
    if (!choiceBox.childElementCount) choiceBox.remove();
    const box = /** @type {HTMLInputElement} */ (li.querySelector('[data-rv-reject]'));
    const note = /** @type {HTMLTextAreaElement} */ (li.querySelector('[data-rv-row-note]'));
    note.setAttribute('aria-label', `What should change in ${pair.title}`);
    box.checked = only ? Boolean(state[pair.key]?.redo?.[only]) : verdictOf(pair) === 'rejected';
    note.value = only ? state[pair.key]?.redo?.[only] || '' : noteOf(pair);
    if (only) note.placeholder = 'What should change in this aspect';
    note.hidden = !box.checked && !note.value;
    li.classList.toggle('rv-row--rejected', box.checked);
    box.addEventListener('change', () => {
        note.hidden = !box.checked && !note.value;
        li.classList.toggle('rv-row--rejected', box.checked);
        if (box.checked) note.focus();
        updateApprove();
    });
    note.addEventListener('input', () => {
        if (only) return; // kept when the step is answered, with the aspect's name
        state[pair.key] = { ...state[pair.key], note: note.value.trim() };
        save();
        render();
    });
    li.querySelector('[data-rv-jump]').addEventListener('click', () => {
        stage.querySelector(`[data-rv-pair="${CSS.escape(pair.key)}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    return li;
}

function updateApprove() {
    const step = steps[index];
    const rejecting = list.querySelectorAll('[data-rv-reject]:checked').length;
    if (step?.aspect) {
        approveButton.textContent = rejecting ? '↑ None of these, on to the next' : '↑ Pick this one, on to the next';
        return;
    }
    approveButton.textContent = rejecting
        ? `↑ Approve the rest, ${rejecting} not approved`
        : step.theme
          ? '↑ Approve this theme'
          : '↑ Approve these blocks';
}

async function show(at) {
    if (busy) return;
    busy = true;
    try {
        await booted;
        const step = steps[(at + steps.length) % steps.length];
        if (step.theme) await switchTheme(step.theme);
        index = steps.indexOf(step);
        putBack();
        shownPairs = stepOpen(step) ? step.pairs.filter(isOpen) : step.pairs;
        for (const pair of shownPairs) {
            if (pair.item) {
                const placeholder = document.createComment('review');
                pair.item.section.replaceWith(placeholder);
                pair.item.section.dataset.rvPair = pair.key;
                moved.push([placeholder, pair.item.section]);
                stage.append(pair.item.section);
            } else {
                stage.append(frameFor(pair));
            }
        }
        stage.scrollTop = 0;
        mirrorControls(shownPairs.filter((pair) => pair.item).map((pair) => pair.item.section));
        list.replaceChildren(...shownPairs.map((pair) => rowFor(pair, step.aspect ?? null)));
        // The demo's controls always stand open in the dialog: Kenny judges
        // only there (2026-10-06 14:53: "alle knoppen die helpen om de demo te
        // beoordelen ook in de dialog ... fix het"), never folded away.
        controlsBox.open = true;
        $('[data-rv-intro]').textContent = step.aspect
            ? 'One option at a time, large, its motion already playing. ←/→ flips, ↑ picks it and goes on, ↓ is None of these. Left hand (AZERTY): Q/S step the state, D the tone, F the next set, Z a live update, R replays, E speed, A tours the states by itself, Space pauses.'
            : 'Everything on the left is approved together. Tick only what is wrong, and say why.';
        $('#rv-keys').textContent = step.aspect
            ? 'Right hand: ←/→ flip · ↑ pick · ↓ none of these. Left hand (AZERTY home row): Q/S state back/on · D tone · F next set · Z live update · R replay · E speed · A tour · Space pause. PageUp/PageDown move between pages · Escape closes.'
            : 'Up approves the step, Left/Right move between steps, Escape closes. The theme switches by itself.';
        for (const pair of shownPairs) if (pair.item) focusAspect(pair.item.section, step.aspect ?? null);
        if (step.aspect) setupFlip(step, shownPairs[0]);
        const judgedHere = step.pairs.length - shownPairs.length;
        $('[data-rv-position]').textContent =
            `Step ${index + 1}/${steps.length} · ${shownPairs.length} ${step.theme ? 'section(s)' : 'block(s)'}` +
            (judgedHere ? ` · ${judgedHere} already approved, not shown` : '');
        $('[data-rv-title]').textContent = step.title;
        const badge = $('[data-rv-state]');
        const rejected = step.pairs.filter((p) => verdictOf(p) === 'rejected').length;
        badge.textContent = stepOpen(step) ? 'Open' : rejected ? `${rejected} not approved` : 'Approved';
        badge.className = `kp-badge${stepOpen(step) ? '' : rejected ? ' kp-badge--destructive' : ' kp-badge--success'}`;
        refused.hidden = true;
        updateApprove();
        if (!dialog.open) dialog.showModal();
        approveButton.focus();
        // A demo can act when its section comes on screen (signature-dialog
        // opens its dialog, so the entrance plays without a click).
        for (const pair of shownPairs) pair.item?.section.dispatchEvent(new CustomEvent('review:show', { bubbles: true }));
        // Every pick already on file goes to the demo before the next aspect is
        // shown: the shape picked one step earlier is the shape every later
        // option is drawn in (Kenny, 2026-10-06 18:50). A pick made by flipping
        // never passed through the radio's change handler, so the demo kept
        // drawing its default.
        for (const pair of shownPairs)
            for (const choice of pair.item?.choices || []) {
                const value = choiceOf(pair, choice);
                if (value) pair.item.section.dispatchEvent(new CustomEvent('review:choice', { bubbles: true, detail: { id: choice.id, value } }));
            }
        // The shown option's own motion plays at once: its controls are pressed for the reviewer.
        if (step.aspect) requestAnimationFrame(() => paintFlip(step));
    } finally {
        busy = false;
    }
}

function nextOpenStep(from) {
    for (let step = 1; step <= steps.length; step++) {
        const at = (from + step) % steps.length;
        if (stepOpen(steps[at])) return at;
    }
    return -1;
}

function approveStep() {
    if (busy) return;
    const current = steps[index];
    if (current?.aspect) return answerAspect(current);
    const rows = [...list.querySelectorAll('.rv-row')];
    const missing = rows.filter((row) => row.querySelector('[data-rv-reject]').checked && !row.querySelector('[data-rv-row-note]').value.trim());
    if (missing.length) {
        refused.textContent = `Not approved needs a note: ${missing.map((row) => row.querySelector('[data-rv-jump]').textContent).join(', ')}.`;
        refused.hidden = false;
        missing[0].querySelector('[data-rv-row-note]').focus();
        return;
    }
    const unpicked = shownPairs.filter(
        (pair, i) => !rows[i].querySelector('[data-rv-reject]').checked && (pair.item?.choices || []).some((c) => !choiceOf(pair, c)),
    );
    if (unpicked.length) {
        const names = unpicked.flatMap((pair) => pair.item.choices.filter((c) => !choiceOf(pair, c)).map((c) => `${pair.title}: ${c.label}`));
        refused.textContent = `Pick before approving: ${names.join('; ')}.`;
        refused.hidden = false;
        return;
    }
    const at = new Date().toISOString();
    for (const [i, pair] of shownPairs.entries()) {
        const rejected = rows[i].querySelector('[data-rv-reject]').checked;
        const note = rows[i].querySelector('[data-rv-row-note]').value.trim();
        state[pair.key] = { ...state[pair.key], verdict: rejected ? 'rejected' : 'approved', note, at };
    }
    save();
    render();
    const next = nextOpenStep(index);
    if (next < 0) {
        dialog.close();
        foot.scrollIntoView({ block: 'start' });
        say(
            NEXT
                ? 'Everything is judged. Copy the answer on to the next item, then paste it into the conversation.'
                : 'Everything is judged. Copy the answer and paste it into the conversation.',
        );
        if (NEXT) nextButton.focus();
    } else show(next);
}

/** Records one aspect step: its pick, or "None of these" with a note; the theme's verdict once every aspect is answered. */
function answerAspect(step) {
    const row = list.querySelector('.rv-row');
    const pair = step.pairs[0];
    if (!row || !pair) return;
    const none = /** @type {HTMLInputElement} */ (row.querySelector('[data-rv-reject]')).checked;
    const note = /** @type {HTMLTextAreaElement} */ (row.querySelector('[data-rv-row-note]')).value.trim();
    // The pick comes from the flip stage (flipAt), not a radio here: one option is
    // shown at a time, large, and ←/→ (or the on-screen arrows) choose it.
    const choice = flipChoice || pair.item.choices.find((c) => c.id === step.aspect);
    const value = choice?.options[flipAt]?.value || '';
    if (none && !note) {
        refused.textContent = 'None of these needs a note: what should change?';
        refused.hidden = false;
        row.querySelector('[data-rv-row-note]').focus();
        return;
    }
    if (!none && !value) {
        refused.textContent = `Pick one of the options, or tick None of these.`;
        refused.hidden = false;
        return;
    }
    const entry = { ...state[pair.key] };
    entry.choices = { ...entry.choices };
    entry.redo = { ...entry.redo };
    if (none) {
        entry.redo[step.aspect] = note;
        delete entry.choices[step.aspect];
    } else {
        entry.choices[step.aspect] = value;
        delete entry.redo[step.aspect];
    }
    state[pair.key] = entry;
    const themeSteps = steps.filter((s) => s.aspect && s.pairs[0] === pair);
    if (themeSteps.every((s) => aspectDone(pair, s.aspect))) {
        const redo = themeSteps.filter((s) => entry.redo[s.aspect]);
        const label = (id) => pair.item.choices.find((c) => c.id === id)?.label || id;
        state[pair.key] = {
            ...entry,
            verdict: redo.length ? 'rejected' : 'approved',
            note: redo.map((s) => `${label(s.aspect)}: ${entry.redo[s.aspect]}`).join(' · '),
            at: new Date().toISOString(),
        };
    }
    save();
    render();
    const next = nextOpenStep(index);
    if (next < 0) {
        dialog.close();
        foot.scrollIntoView({ block: 'start' });
        say(
            NEXT
                ? 'Everything is judged. Copy the answer on to the next item, then paste it into the conversation.'
                : 'Everything is judged. Copy the answer and paste it into the conversation.',
        );
        if (NEXT) nextButton.focus();
    } else show(next);
}

dialog.addEventListener('click', (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    if (target.closest('[data-rv-close]')) return dialog.close();
    const go = target.closest('[data-rv-go]');
    if (go) return show(index + Number(go.getAttribute('data-rv-go')));
    const step = steps[index];
    if (target.closest('[data-rv-flip-prev]')) return flip(step, -1);
    if (target.closest('[data-rv-flip-next]')) return flip(step, 1);
    if (target.closest('[data-rv-flip-replay]')) return replay(step);
    if (target.closest('[data-rv-flip-pause]')) return togglePause();
    if (target.closest('[data-rv-flip-speed]')) return cycleSpeed();
    if (target.closest('[data-rv-approve]')) approveStep();
});

// Listened for on the document, not the dialog: when the focused option is
// flipped away its element hides, the focus falls back to <body>, and a key
// from there never reached a listener on the dialog (Kenny, 2026-10-06 18:50:
// a click on the middle hover tile, then the arrows did nothing).
document.addEventListener(
    'keydown',
    (event) => {
        if (!dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
        // Closed here rather than by the browser's own cancel: Chromium dropped
        // the Escape after the dialog had switched the theme a few times.
        if (event.key === 'Escape') {
            event.preventDefault();
            dialog.close();
            return;
        }
        // Inside a note the arrows move the caret. Inside the demo on stage and
        // its mirrored controls they scroll, walk a chart or move a day; there
        // the step keys stay off, so a key meant for the demo never approves or
        // switches the theme [fix-103].
        const from = /** @type {HTMLElement} */ (event.target);
        if (from.matches('textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="button"])')) return;
        // On an aspect page every shortcut acts wherever the focus sits: on a tile
        // clicked in the demo, a link, a control or a dialog button (Kenny,
        // 2026-10-06 18:50: "alle shortcuts moeten altijd blijven werken"). The
        // listener runs in the capture phase and keeps the key from the demo, so a
        // focused demo element can neither swallow it nor act on it as well.
        if (steps[index]?.aspect) {
            if (/^(Arrow(Left|Right|Up|Down)|Enter|NumpadEnter|Space|Page(Up|Down)|Key[A-Z])$/.test(event.code)) event.stopPropagation();
        } else if (stage.contains(from) || controlsBox.contains(from)) {
            // Off the aspect pages the demo keeps its own keys [fix-103].
            if (!/^Key[A-Z]$/.test(event.code)) return;
        }
        const step = steps[index];
        // ←/→ flip the option shown on an aspect page; on a page without aspects
        // they still move between steps, as before. Moving between pages always
        // works via PageUp/PageDown now that ←/→ can mean "flip" [form v32].
        if (event.key === 'PageUp' || event.key === 'PageDown') {
            event.preventDefault();
            show(index + (event.key === 'PageDown' ? 1 : -1));
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            if (step?.aspect) flip(step, event.key === 'ArrowRight' ? 1 : -1);
            else show(index + (event.key === 'ArrowRight' ? 1 : -1));
        } else if (event.key === 'ArrowUp' || (event.key === 'Enter' && (step?.aspect || !from.matches('button, a, summary')))) {
            // On an aspect page Enter always picks; elsewhere a focused button or
            // link keeps its own Enter.
            event.preventDefault();
            approveStep();
        } else if (step?.aspect && (event.key === 'ArrowDown' || event.key.toLowerCase() === 'n')) {
            event.preventDefault();
            const box = /** @type {HTMLInputElement} */ (list.querySelector('[data-rv-reject]'));
            if (box && !box.checked) {
                box.checked = true;
                box.dispatchEvent(new Event('change'));
            }
        } else if (step?.aspect) {
            // The left hand on its home row: physical keys (event.code), so they sit
            // under the same fingers on AZERTY (labels Q S D F, A Z E R) and QWERTY.
            const act = {
                KeyA: () => stepGroup(0, -1), // AZERTY Q: the state before
                KeyS: () => stepGroup(0, 1), // S: the next state
                KeyD: () => stepGroup(1, 1), // D: the next tone
                KeyF: () => stepGroup(2, 1), // F: the next value of the third set
                KeyR: () => replay(step), // R: replay
                KeyE: () => cycleSpeed(), // E: speed
                KeyQ: () => toggleTour(), // AZERTY A: tour the states by itself
                KeyW: () => liveUpdate(), // AZERTY Z: a live update (Kenny, 2026-10-06 17:21)
                Space: () => togglePause(), // the thumb: pause
                KeyP: () => togglePause(),
            }[event.code];
            // Space always pauses on an aspect page, also when a button has the
            // focus: the approve button holds the focus after every page change,
            // and Space on it picked and moved on (Kenny, 2026-10-06 17:27).
            if (act) {
                event.preventDefault();
                act();
            }
        }
    },
    true,
);

dialog.addEventListener('close', putBack);
// A state button pressed on the demo itself counts as the reviewer's own too.
document.addEventListener(
    'click',
    (event) => {
        if (dialog.open && event.isTrusted) keepPress(/** @type {Element} */ (event.target).closest?.('button'));
    },
    true,
);

bar.querySelector('[data-rv-open]').addEventListener('click', () => {
    const first = nextOpenStep(-1);
    show(first < 0 ? 0 : first);
});

window.addEventListener('storage', (event) => {
    if (event.key === STORE) {
        state = load();
        render();
    }
});

render();
// From the hub, the dialog opens at the first open step by itself.
if (NEXT && params.get('review') === 'open' && pairs.some(isOpen)) bar.querySelector('[data-rv-open]').click();
