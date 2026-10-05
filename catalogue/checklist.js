// The "Look at" text of every block as a checklist (Kenny, 2026-10-05: a
// review is many approvals in a row, make it easier). The prose stays as it
// is written; under it, one line per sentence, each with a box the reviewer
// ticks once he has seen it. A sentence that names one of the block's
// buttons in bold (`<b>Loading</b> shows every day as loading`) carries that
// button as well: pressing it there presses the block's own.
//
// Ticks are per block and per theme, in this browser only, and they go when
// the prompt is cleared. They decide nothing: Approve stays its own act.
//
// The review dialog shows the look as a copy (review-dialog.js), so the
// dialog gets a live checklist of its own under that copy, on the same ticks.
import { currentTheme, THEME_EVENT } from '../js/theme-core.js';
import { FEEDBACK_KEY, NOTES_EVENT } from './review-state.js';

export const CHECKS_KEY = 'kp-catalogue-checks:v1';
export const CHECKS_EVENT = 'cat-checks-change';

/* ---------------------------------------------------------------- reading */

const ABBREVIATIONS = /(?:^|\s)(?:e\.g|i\.e|etc|vs|cf)$/i;

/**
 * Split a look's markup into its sentences, the markup inside each kept.
 * A sentence ends at `.`, `!` or `?` (with a closing quote or bracket) before
 * white space and a capital or a tag; `<br>` ends one too.
 * @param {string} html
 * @returns {string[]}
 */
export function sentencesOf(html) {
    const text = html.replace(/<br\s*\/?>/gi, '\u0000');
    const out = [];
    let start = 0;
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (char === '<') {
            const close = text.indexOf('>', i);
            if (close > -1) i = close;
            continue;
        }
        if (char === '\u0000') {
            out.push(text.slice(start, i));
            start = i + 1;
            continue;
        }
        if (!'.!?'.includes(char)) continue;
        let end = i + 1;
        while (end < text.length && '"\')”’'.includes(text[end])) end += 1;
        // A tag closed right after the stop (`… <b>Copied</b>.</b>`) belongs to the sentence.
        while (text.startsWith('</', end)) end = text.indexOf('>', end) + 1 || text.length;
        if (end < text.length && !/\s/.test(text[end])) continue;
        let next = end;
        while (next < text.length && /\s/.test(text[next])) next += 1;
        if (next < text.length && !/[A-Z<(]/.test(text[next])) continue;
        if (char === '.' && ABBREVIATIONS.test(text.slice(start, i).replace(/<[^>]*>/g, ''))) continue;
        out.push(text.slice(start, end));
        start = end;
        i = end - 1;
    }
    out.push(text.slice(start));
    return out.map((s) => s.trim()).filter(Boolean);
}

const plain = (html) =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();

/** A button's name as a reader sees it. @param {Element} button */
export const buttonLabel = (button) => (button.textContent ?? '').replace(/\s+/g, ' ').trim() || button.getAttribute('aria-label') || 'a button';

const same = (a, b) => a.replace(/[“”"'‘’]/g, '').toLowerCase() === b.replace(/[“”"'‘’]/g, '').toLowerCase();

/** The block's own buttons, outside the reviewer's chrome. @param {Element} block */
export const blockButtons = (block) =>
    [...block.querySelectorAll('button')].filter((button) => !button.closest('.cat-judge, .cat-checklist, .cat-play-caption'));

/**
 * The lines of a block's checklist: each sentence of its look that names
 * something to see, and the buttons it names in bold that the block has,
 * each with what follows its name (its effect).
 * @param {Element} block
 * @returns {{ html: string, text: string, presses: { button: HTMLButtonElement, effect: string }[] }[]}
 */
export function checklistOf(block) {
    const look = block.querySelector(':scope > .cat-look');
    if (!look) return [];
    const copy = /** @type {HTMLElement} */ (look.cloneNode(true));
    // "Look at:" introduces the list; it is not a line of it.
    const lead = copy.querySelector('b');
    if (lead && /^look at:?$/i.test(plain(lead.innerHTML))) lead.remove();
    const buttons = blockButtons(block);
    return sentencesOf(copy.innerHTML)
        .map((html) => {
            const text = plain(html);
            /** @type {{ button: HTMLButtonElement, effect: string }[]} */
            const presses = [];
            for (const match of html.matchAll(/<b>([\s\S]*?)<\/b>/g)) {
                const name = plain(match[1]);
                const found = buttons.find((b) => same(buttonLabel(b), name));
                if (!found || presses.some((p) => p.button === found)) continue;
                // What follows the button's name, up to the next one: its effect.
                const after = html.slice(/** @type {number} */ (match.index) + match[0].length);
                const cut = after.search(/<b>/);
                const effect = plain(cut > -1 ? after.slice(0, cut) : after)
                    .replace(/^[\s:,(—-]+/, '')
                    .replace(/[\s,;:(—-]+$/, '');
                presses.push({ button: /** @type {HTMLButtonElement} */ (found), effect });
            }
            return { html, text, presses };
        })
        .filter((line) => line.text.split(' ').length >= 4);
}

/** What the look says a button does, if it names it. @param {ReturnType<typeof checklistOf>} lines @param {Element} button */
export const effectIn = (lines, button) => {
    for (const line of lines) for (const press of line.presses) if (press.button === button && press.effect) return press.effect;
    return '';
};

/* ---------------------------------------------------------------- storage */

function loadChecks() {
    try {
        return JSON.parse(localStorage.getItem(CHECKS_KEY) ?? '{}') ?? {};
    } catch {
        return {};
    }
}

function saveChecks(all) {
    try {
        localStorage.setItem(CHECKS_KEY, JSON.stringify(all));
        return true;
    } catch {
        return false;
    }
}

const themeOfBlock = (block) => block.getAttribute('data-cat-theme') || currentTheme();

/** The ticked lines of a block in a theme. @returns {Set<number>} */
export function ticksOf(blockId, theme) {
    return new Set(loadChecks()[blockId]?.[theme] ?? []);
}

function setTick(blockId, theme, index, on) {
    const all = loadChecks();
    const ticks = new Set(all[blockId]?.[theme] ?? []);
    if (on) ticks.add(index);
    else ticks.delete(index);
    const themes = (all[blockId] ??= {});
    if (ticks.size) themes[theme] = [...ticks].sort((a, b) => a - b);
    else delete themes[theme];
    if (!Object.keys(themes).length) delete all[blockId];
    saveChecks(all);
    document.dispatchEvent(new CustomEvent(CHECKS_EVENT));
}

/* -------------------------------------------------------------- rendering */

/** Every list on screen, to repaint its ticks on a theme change. @type {Set<{ block: Element, list: HTMLElement }>} */
const shown = new Set();

/**
 * A checklist for `block`, live: its boxes store their ticks, its buttons
 * press the block's own.
 * @param {Element} block
 * @param {string} prefix  ids inside the list start with it
 */
function renderList(block, prefix) {
    const lines = checklistOf(block);
    const list = document.createElement('div');
    list.className = 'cat-checklist';
    list.setAttribute('data-cat-checklist', block.id);
    if (!lines.length) return list;
    const head = document.createElement('p');
    head.className = 'cat-checklist__head';
    head.innerHTML = '<b>Checklist</b> <span class="cat-checklist__count" data-cat-checklist-count></span>';
    const ul = document.createElement('ul');
    ul.className = 'cat-checklist__lines';
    lines.forEach((line, index) => {
        const li = document.createElement('li');
        li.className = 'kp-field kp-field--check cat-checklist__line';
        const id = `${prefix}-${index}`;
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.className = 'kp-field__check';
        box.id = id;
        box.dataset.catCheck = String(index);
        const label = document.createElement('label');
        // The theme's field label is a short name (cyberpunk sets it in capitals); a sentence reads in the look's own type.
        label.className = 'cat-checklist__text';
        label.htmlFor = id;
        label.innerHTML = line.html;
        li.append(box, label);
        if (line.presses.length) {
            const row = document.createElement('span');
            row.className = 'cat-checklist__presses';
            for (const { button: target, effect } of line.presses) {
                const press = document.createElement('button');
                press.type = 'button';
                press.className = 'kp-button kp-button--sm kp-button--ghost cat-checklist__press';
                press.setAttribute('data-cat-check-press', '');
                press.textContent = `▶ ${buttonLabel(target)}`;
                press.title = effect ? `Press ${buttonLabel(target)}: ${effect}` : `Press ${buttonLabel(target)}`;
                press.addEventListener('click', () => {
                    target.classList.add('cat-play-step');
                    target.click();
                    setTimeout(() => target.classList.remove('cat-play-step'), 1200);
                });
                row.append(press);
            }
            li.append(row);
        }
        ul.append(li);
    });
    list.append(head, ul);
    list.addEventListener('change', (event) => {
        const box = /** @type {HTMLInputElement} */ (event.target);
        if (!box.matches('[data-cat-check]')) return;
        setTick(block.id, themeOfBlock(block), Number(box.dataset.catCheck), box.checked);
    });
    const entry = { block, list };
    shown.add(entry);
    paint(entry);
    return list;
}

function paint({ block, list }) {
    const ticks = ticksOf(block.id, themeOfBlock(block));
    const boxes = [...list.querySelectorAll('[data-cat-check]')];
    for (const box of boxes) /** @type {HTMLInputElement} */ (box).checked = ticks.has(Number(/** @type {HTMLElement} */ (box).dataset.catCheck));
    const count = list.querySelector('[data-cat-checklist-count]');
    if (count) count.textContent = `${boxes.filter((b) => /** @type {HTMLInputElement} */ (b).checked).length} of ${boxes.length} seen`;
}

function repaintAll() {
    for (const entry of shown) {
        if (!entry.list.isConnected) shown.delete(entry);
        else paint(entry);
    }
}

/* --------------------------------------------------------------- mounting */

/** Put a checklist under the look of every judged block on the page. */
export function mountChecklists(root = document) {
    for (const block of root.querySelectorAll('.cat-block[id]')) {
        if (!block.querySelector(':scope > .cat-judge') || block.querySelector(':scope > .cat-checklist')) continue;
        const look = block.querySelector(':scope > .cat-look');
        if (!look) continue;
        const list = renderList(block, `cat-check-${block.id}`);
        if (list.childElementCount) look.after(list);
    }
}

/** The review dialog's own list, under its copy of the look, for the block on its stage. */
function mountDialogList() {
    const dialog = document.getElementById('cat-review-dialog');
    const look = dialog?.querySelector('[data-cat-dialog-look]');
    if (!dialog || !look) return;
    const fill = () => {
        const block = dialog.querySelector('[data-cat-dialog-stage] > .cat-block');
        const there = look.querySelector(':scope > .cat-checklist');
        if (!block || (there && there.getAttribute('data-cat-checklist') === block.id)) return;
        there?.remove();
        const list = renderList(block, 'cat-dialog-check');
        if (list.childElementCount) look.append(list);
    };
    new MutationObserver(fill).observe(look, { childList: true });
    fill();
}

// The ticks go with the prompt: Clear prompt empties every note at once
// (review-state.js clearPrompt), and a press of it arms this.
let clearArmed = 0;
document.addEventListener(
    'click',
    (event) => {
        if (event.target instanceof Element && event.target.closest('[data-cat-prompt-clear]')) clearArmed = Date.now();
    },
    true,
);
document.addEventListener(NOTES_EVENT, () => {
    if (!clearArmed || Date.now() - clearArmed > 120_000) return;
    let raw = null;
    try {
        raw = localStorage.getItem(FEEDBACK_KEY);
    } catch {
        /* no storage */
    }
    if (raw !== '{}') return;
    clearArmed = 0;
    saveChecks({});
    repaintAll();
});
document.addEventListener(CHECKS_EVENT, repaintAll);
document.documentElement.addEventListener(THEME_EVENT, repaintAll);
window.addEventListener('storage', (event) => {
    if (event.key === CHECKS_KEY) repaintAll();
});

document.addEventListener('cat-composed', () => {
    mountChecklists();
    mountDialogList();
});
