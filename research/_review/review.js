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
// shape is not asked again; Kenny, 2026-10-05). Approving
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

/** @type {Step[]} */
const steps = ORDER.map((theme) => ({
    title: LABEL[theme] || theme,
    theme,
    pairs: items.map((item) => ({
        key: `${theme}|${item.id}`,
        label: `${item.id} · ${theme}`,
        title: item.title,
        look: '',
        theme,
        item,
    })),
}));
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
const pairs = steps.flatMap((step) => step.pairs);

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
const optionLabel = (choice, value) => choice.options.find((o) => o.value === value)?.label || value;
const isOpen = (pair) => !verdictOf(pair);
const stepOpen = (step) => step.pairs.some(isOpen);

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
    const themesDone = steps.filter((s) => s.theme && s.pairs.every((p) => verdictOf(p) === 'approved'));
    if (themesDone.length) lines.push('', `Approved in full: ${themesDone.map((s) => s.theme).join(', ')}`);
    const extraDone = pairs.filter((p) => p.extra && verdictOf(p) === 'approved');
    if (extraDone.length) lines.push('', 'Catalogue pairs approved:', ...extraDone.map((p) => `- ${p.label}`));
    if (rejected.length) lines.push('', 'Not approved:', ...rejected.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const notes = pairs.filter((p) => verdictOf(p) === 'approved' && noteOf(p));
    if (notes.length) lines.push('', 'Approved, with a note:', ...notes.map((p) => `- ${p.label}: ${noteOf(p)}`));
    const picked = pairs.flatMap((p) =>
        (p.item?.choices || []).filter((c) => !c.once && choiceOf(p, c)).map((c) => `- ${p.label}: ${c.label} = ${optionLabel(c, choiceOf(p, c))}`),
    );
    if (picked.length) lines.push('', 'Picked per theme:', ...picked);
    const once = items.flatMap((item) =>
        item.choices
            .filter((c) => c.once && state[onceKey(item, c)]?.value)
            .map((c) => `- ${item.id}: ${c.label} = ${optionLabel(c, state[onceKey(item, c)].value)}`),
    );
    if (once.length) lines.push('', 'Picked once, for every theme:', ...once);
    const openSteps = steps.filter(stepOpen);
    if (openSteps.length) lines.push('', `Still open: ${openSteps.map((s) => s.theme || s.title).join(', ')}`);
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
            <div class="rv-dialog__stage" data-rv-stage></div>
        </div>
        <div class="rv-dialog__side">
            <p class="rv-meta">Everything on the left is approved together. Tick only what is wrong, and say why.</p>
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

let index = 0;
/** The pairs on screen: the open ones of the step, or all of it once it is judged. */
let shownPairs = [];
/** @type {[Comment, HTMLElement][]} */
let moved = [];
/** True while a theme loads: a key pressed then would judge a step not yet on screen. */
let busy = false;
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

function putBack() {
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

function rowFor(pair) {
    const li = document.createElement('li');
    li.className = 'rv-row';
    const id = `rv-${pair.key.replace(/[^a-z0-9-]/gi, '-')}`;
    li.innerHTML = `
        <div class="rv-row__head">
            <button type="button" class="rv-row__jump" data-rv-jump></button>
            <span class="kp-field kp-field--check rv-row__check">
                <input class="kp-field__check" type="checkbox" id="${id}" data-rv-reject />
                <label class="kp-field__label" for="${id}">Not approved</label>
            </span>
        </div>
        <p class="rv-row__look" data-rv-row-look></p>
        <div class="rv-row__choices" data-rv-choices></div>
        <textarea class="kp-field__input kp-field__input--multiline rv-row__note" rows="2" placeholder="What should change" data-rv-row-note hidden></textarea>`;
    li.querySelector('[data-rv-jump]').textContent = pair.title;
    const look = pair.item ? lookFor(pair.item.section, pair.theme) : pair.look;
    const lookBox = li.querySelector('[data-rv-row-look]');
    if (look) lookBox.innerHTML = look;
    else lookBox.remove();
    const choiceBox = li.querySelector('[data-rv-choices]');
    for (const choice of pair.item?.choices || []) {
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
    box.checked = verdictOf(pair) === 'rejected';
    note.value = noteOf(pair);
    note.hidden = !box.checked && !note.value;
    li.classList.toggle('rv-row--rejected', box.checked);
    box.addEventListener('change', () => {
        note.hidden = !box.checked && !note.value;
        li.classList.toggle('rv-row--rejected', box.checked);
        if (box.checked) note.focus();
        updateApprove();
    });
    note.addEventListener('input', () => {
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
        list.replaceChildren(...shownPairs.map(rowFor));
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

dialog.addEventListener('click', (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    if (target.closest('[data-rv-close]')) return dialog.close();
    const go = target.closest('[data-rv-go]');
    if (go) return show(index + Number(go.getAttribute('data-rv-go')));
    if (target.closest('[data-rv-approve]')) approveStep();
});

dialog.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
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
    if (event.defaultPrevented || from.matches('textarea') || stage.contains(from) || controlsBox.contains(from)) return;
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        approveStep();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
});

dialog.addEventListener('close', putBack);

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
