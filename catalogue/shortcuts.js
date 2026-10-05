// Keys and small comforts for the reviewer (Kenny, 2026-10-05: "het zijn
// veel goedkeuringen telkens"). On the review page and in its dialog:
//
//   A  approve (in the dialog the next open block follows; on the page the
//      approved block leaves and the next one is marked)
//   R  not approved: with a note it is recorded, without one the note takes
//      the focus and says what it needs
//   N  the next block      P  play the block (play.js)
//   T  the next theme with blocks left      K  the list of keys
//
// The list is K, not ?: a block on the review page (data.html#shortcuts,
// the package's `.kp-shortcuts` sheet) answers ? itself, and its look asks
// the reviewer to press it.
//
// Never while typing in a field, and never inside a component under review
// (a stage's own keys stay its own). The review dialog puts the cursor in
// its note, so there the same keys work with Alt held (Alt+A, …).
//
// And: each theme in the theme menu says how many blocks it has left
// (open-pairs.js); the page can open the review dialog by itself when it
// loads, on the block last shown in it if that one is still open.
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { THEMES } from '../js/theme-registry.js';
import { pagePath, themeLabel } from './review-state.js';
import { JUDGEMENT_EVENT } from './judgements.js';
import { play } from './play.js';
import { openCounts } from './open-pairs.js';

const AUTO_OPEN_KEY = 'kp-catalogue-auto-open:v1';
const LAST_BLOCK_KEY = 'kp-catalogue-last-block:v1';

export const KEYS = [
    ['A', 'Approve; the next open block follows'],
    ['R', 'Not approved: records it when the note has text, otherwise puts the cursor in the note'],
    ['N', 'Next block'],
    ['P', 'Play the block: press its try-buttons in turn (again or Escape stops)'],
    ['T', 'Next theme with blocks left'],
    ['K', 'Show or hide this list (? stays the shortcut sheet under review)'],
];

const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
};
const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* no storage: no memory */
    }
};

const dialogEl = () => /** @type {HTMLDialogElement | null} */ (document.getElementById('cat-review-dialog'));
const inDialog = () => Boolean(dialogEl()?.open);
const onStage = () => dialogEl()?.querySelector('[data-cat-dialog-stage] > .cat-block') ?? null;

/** The judged blocks still on the page, in order. @returns {HTMLElement[]} */
const pageBlocks = () =>
    /** @type {HTMLElement[]} */ ([...document.querySelectorAll('.cat-main .cat-block[id]')]).filter(
        (block) => !block.hidden && block.querySelector(':scope > .cat-judge') && block.getClientRects().length,
    );

/* ----------------------------------------------------------------- flash */

let flashTimer = 0;
function flash(text) {
    let line = document.querySelector('[data-cat-key-flash]');
    if (!line) {
        line = document.createElement('p');
        line.className = 'cat-key-flash';
        line.setAttribute('role', 'status');
        line.setAttribute('data-cat-key-flash', '');
        document.body.append(line);
    }
    // In the top layer with the dialog, or under it.
    const dialog = dialogEl();
    if (dialog?.open && line.parentElement !== dialog) dialog.append(line);
    if (!dialog?.open && line.parentElement !== document.body) document.body.append(line);
    line.textContent = text;
    line.hidden = false;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => /** @type {HTMLElement} */ ((line).hidden = true), 2200);
}

/* ----------------------------------------------------- the block in hand */

/** @type {HTMLElement | null} */
let marked = null;

function mark(block) {
    marked?.classList.remove('cat-key-current');
    marked = block;
    block?.classList.add('cat-key-current');
}

const inView = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
};

/** The block the keys act on, on the page: the marked one in view, else the first in view. */
function pageTarget() {
    const focused = document.activeElement?.closest?.('.cat-block[id]');
    const blocks = pageBlocks();
    if (focused instanceof HTMLElement && blocks.includes(focused)) return focused;
    if (marked && blocks.includes(marked) && inView(marked)) return marked;
    return blocks.find((block) => block.getBoundingClientRect().bottom > innerHeight * 0.2) ?? blocks[0] ?? null;
}

function goToBlock(block) {
    if (!block) return;
    mark(block);
    block.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/* ---------------------------------------------------------------- actions */

function approve() {
    if (inDialog())
        return dialogEl()
            ?.querySelector('[data-cat-dialog-verdict="approved"]')
            ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const block = pageTarget();
    if (!block) return;
    const button = /** @type {HTMLButtonElement | null} */ (block.querySelector(':scope > .cat-judge [data-cat-verdict="approved"]'));
    if (!button || button.disabled) return flash(`Not recorded: ${block.dataset.catTitle ?? block.id} is already approved or still being read.`);
    const after = pageBlocks();
    const next = after[after.indexOf(block) + 1] ?? null;
    button.click();
    flash(`Approved: ${block.dataset.catTitle ?? block.id}`);
    // The approved block leaves the page; the next one is in hand.
    if (next) requestAnimationFrame(() => goToBlock(next));
}

function reject() {
    if (inDialog())
        return dialogEl()
            ?.querySelector('[data-cat-dialog-verdict="rejected"]')
            ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const block = pageTarget();
    const button = /** @type {HTMLButtonElement | null} */ (block?.querySelector(':scope > .cat-judge [data-cat-verdict="rejected"]'));
    if (!block || !button) return;
    mark(block);
    if (button.disabled) {
        block.querySelector(':scope > .cat-judge textarea')?.focus();
        return;
    }
    // Records with a note; without one judging.js refuses and focuses the note.
    button.click();
}

function next() {
    if (inDialog())
        return dialogEl()
            ?.querySelector('[data-cat-dialog-go="1"]')
            ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const blocks = pageBlocks();
    const from = pageTarget();
    goToBlock(blocks[(from ? blocks.indexOf(from) : -1) + 1] ?? blocks[0] ?? null);
}

function playNow() {
    const block = inDialog() ? onStage() : pageTarget();
    if (block) {
        if (!inDialog()) mark(/** @type {HTMLElement} */ (block));
        play(block);
    }
}

/** @type {Record<string, number> | null} */
let counts = null;

function nextThemeName() {
    const order = THEMES.map((t) => t.name);
    const from = order.indexOf(currentTheme());
    for (let step = 1; step < order.length; step += 1) {
        const name = order[(from + step) % order.length];
        if (!counts || counts[name] > 0) return name;
    }
    return null;
}

async function nextTheme() {
    if (document.documentElement.hasAttribute('data-cat-theme-fixed') && document.documentElement.getAttribute('data-cat-theme')) return;
    const theme = nextThemeName();
    if (!theme) return flash('Every block is judged in every theme.');
    const option = /** @type {HTMLElement | null} */ (document.querySelector(`.cat-bar__theme [data-kp-theme="${CSS.escape(theme)}"]`));
    if (!option) return;
    const wasOpen = inDialog();
    if (wasOpen) dialogEl()?.close();
    const landed = new Promise((resolve) => {
        document.documentElement.addEventListener(THEME_EVENT, resolve, { once: true });
        setTimeout(resolve, 10_000);
    });
    option.click();
    await landed;
    flash(`Now in ${themeLabel(theme)}${counts ? ` · ${counts[theme]} block(s) left` : ''}`);
    if (wasOpen) /** @type {HTMLElement | null} */ (document.querySelector('[data-cat-dialog-open]'))?.click();
}

/* ------------------------------------------------------------- the list */

function helpPopover() {
    let help = /** @type {HTMLElement | null} */ (document.getElementById('cat-keys-help'));
    if (help) return help;
    help = document.createElement('div');
    help.id = 'cat-keys-help';
    help.className = 'kp-popover cat-keys-help';
    help.setAttribute('popover', 'auto');
    help.setAttribute('role', 'dialog');
    help.setAttribute('aria-label', 'Review keys');
    help.innerHTML = `<p class="cat-keys-help__title"><b>Review keys</b></p>
        <dl class="cat-keys-help__list">${KEYS.map(([key, what]) => `<dt><kbd>${key}</kbd></dt><dd>${what}</dd>`).join('')}</dl>
        <p class="cat-note">Not while typing in a field or inside a component on its stage. In the review dialog the cursor is in the note: hold Alt (Alt+A, Alt+R, …). Escape closes this list.</p>`;
    document.body.append(help);
    return help;
}

function toggleHelp() {
    const help = helpPopover();
    if (help.matches(':popover-open')) help.hidePopover();
    else help.showPopover();
}

/* ------------------------------------------------------------------ keys */

const TYPING =
    'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=reset]), textarea, select, [contenteditable]:not([contenteditable=false])';

/** @type {Record<string, () => unknown>} */
const ACTIONS = { KeyA: approve, KeyR: reject, KeyN: next, KeyP: playNow, KeyT: nextTheme, KeyK: toggleHelp };

function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.defaultPrevented || event.isComposing) return;
    const target = event.target instanceof Element ? event.target : null;
    const alt = event.altKey;
    // The page's own Alt+D (devtools) stays its own.
    if (alt && event.code === 'KeyD') return;
    if (!alt) {
        if (target?.closest(TYPING)) return;
        // A component under review keeps its keys (a menu's type-ahead, a grid).
        if (target?.closest('.cat-stage')) return;
    } else if (!inDialog()) {
        // Alt is the dialog's way past its note; on the page it changes nothing.
        if (target?.closest(TYPING)) return;
    }
    // A modal the block under review opened is its own.
    const modal = target?.closest('dialog');
    if (modal && modal !== dialogEl() && modal.matches(':modal')) return;
    if (event.shiftKey) return;
    const action = ACTIONS[event.code];
    if (!action) return;
    event.preventDefault();
    action();
}

/* ----------------------------------------------------- counts per theme */

async function paintCounts() {
    try {
        counts = await openCounts();
    } catch {
        return;
    }
    for (const option of document.querySelectorAll('.cat-bar__theme [data-kp-theme]')) {
        const left = counts[option.getAttribute('data-kp-theme') ?? ''];
        if (left === undefined) continue;
        option.setAttribute('data-cat-left', left ? `${left} left` : 'done');
    }
}

let painting = 0;
const paintSoon = () => {
    clearTimeout(painting);
    painting = setTimeout(paintCounts, 250);
};

/* ----------------------------------------------- the dialog, on its own */

function mountLegend() {
    const dialog = dialogEl();
    const keys = dialog?.querySelector('#cat-review-dialog-keys');
    if (keys && !dialog?.querySelector('[data-cat-keys-legend]')) {
        const legend = document.createElement('p');
        legend.className = 'cat-review-dialog__meta cat-keys-legend';
        legend.setAttribute('data-cat-keys-legend', '');
        legend.innerHTML =
            'In the note hold <kbd>Alt</kbd>: <kbd>A</kbd> approve · <kbd>R</kbd> not approved · <kbd>N</kbd> next · <kbd>P</kbd> play · <kbd>T</kbd> next theme · <kbd>K</kbd> all keys';
        keys.after(legend);
    }
    const bar = document.querySelector('.cat-review-bar');
    if (bar && !bar.querySelector('[data-cat-auto-open]')) {
        const auto = document.createElement('div');
        auto.className = 'kp-field kp-field--check cat-review-toggle';
        auto.innerHTML = `<input class="kp-field__check" type="checkbox" id="cat-auto-open" data-cat-auto-open />
            <label class="kp-field__label" for="cat-auto-open">Open the review dialog when the page loads</label>`;
        const box = /** @type {HTMLInputElement} */ (auto.querySelector('input'));
        box.checked = Boolean(read(AUTO_OPEN_KEY, false));
        box.addEventListener('change', () => write(AUTO_OPEN_KEY, box.checked));
        const keysHint = document.createElement('button');
        keysHint.type = 'button';
        keysHint.className = 'kp-button kp-button--ghost kp-button--sm';
        keysHint.setAttribute('data-cat-keys-open', '');
        keysHint.textContent = 'Keys (K)';
        keysHint.addEventListener('click', toggleHelp);
        bar.append(auto, keysHint);
    }
}

/** Remember the block on the dialog's stage, per page, across reloads. */
function rememberStage() {
    const stage = dialogEl()?.querySelector('[data-cat-dialog-stage]');
    if (!stage) return;
    new MutationObserver(() => {
        const block = onStage();
        if (!block) return;
        write(LAST_BLOCK_KEY, { ...read(LAST_BLOCK_KEY, {}), [pagePath()]: block.id });
    }).observe(stage, { childList: true });
}

function openOnLoad() {
    if (!read(AUTO_OPEN_KEY, false) || inDialog()) return;
    const last = read(LAST_BLOCK_KEY, {})[pagePath()];
    const block = last ? document.getElementById(last) : null;
    // Still open in this theme: judging.js keeps an open block on the page.
    const open = block && !block.hidden && !['approved', 'rejected'].includes(block.dataset.catState ?? '');
    const button = open ? block.querySelector(':scope > .cat-judge [data-cat-dialog-block]') : document.querySelector('[data-cat-dialog-open]');
    /** @type {HTMLElement | null} */ (button)?.click();
}

/* --------------------------------------------------------------- mounting */

window.addEventListener('keydown', onKey);
document.addEventListener('cat-composed', () => {
    mountLegend();
    rememberStage();
    paintSoon();
    openOnLoad();
});
document.addEventListener(JUDGEMENT_EVENT, paintSoon);
window.addEventListener('storage', paintSoon);
