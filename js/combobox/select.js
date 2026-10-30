// The drawn select: its test, its handles and its attach.
import { createListbox } from '../listbox.js';
import { layoutRect, placeBlockSide, raiseOverlay, raised } from '../top-layer.js';
import { OPEN_EVENT } from './constants.js';
import { comboboxState } from './state.js';
/** @typedef {import('./types.js').SelectHandle} SelectHandle */

// ── The drawn select [scope-54, Kenny's form of 2026-09-13] ──────────────
//
// Firefox cannot style a native select's open list, so the one list in a
// form that did not wear the theme was the select's. A listbox in the
// combobox's look is laid over every single select the package styles —
// `select.kp-field__input` — without asking. It was an opt-in under scope-54;
// Kenny's form of 2026-09-13 made it the default, because a form whose one
// unthemed list is the select's is the fault the opt-in left in place:
//
//   <select class="kp-field__input">…</select>                        drawn
//   <select class="kp-field__input" data-kp-select="native">…</select> the browser's
//   <select multiple>…</select>                                        always the browser's
//
// A bare `data-kp-select` still asks for the drawn list on a select without
// the class, as it did in 6.1.
//
// The native select stays exactly where it was and stays the control: it
// keeps DOM focus, holds the value, submits with the form, fires `change`,
// and is what a screen reader reads (a single select is already a
// combobox to assistive technology, so `aria-expanded`, `aria-controls`
// and `aria-activedescendant` on it mean what they mean on the combobox's
// input). What is drawn is only the open list, a sibling directly after
// the select, rebuilt from the select's own options every time it opens —
// so a value or an option the page changed behind its back is what shows.

/**
 * Whether a select gets the drawn list: a single select that is the
 * package's field (`.kp-field__input`) or asks for it (`data-kp-select`),
 * unless it opts out with `data-kp-select="native"`.
 *
 * @param {Element} element
 * @returns {element is HTMLSelectElement}
 */
export function drawsSelect(element) {
    if (!(element instanceof HTMLSelectElement) || element.multiple) return false;
    const asked = element.getAttribute('data-kp-select');
    if (asked === 'native') return false;
    return asked !== null || element.classList.contains('kp-field__input');
}

/** @type {WeakMap<Element, SelectHandle>} */
const selectHandles = new WeakMap();

/** The handle for an attached drawn select. @param {Element} element */
export function drawnSelect(element) {
    return selectHandles.get(element) ?? null;
}

/**
 * Lay a drawn list over one select. Returns its detach.
 *
 * @param {HTMLSelectElement} select
 * @param {{ loop?: boolean, typeaheadMs?: number }} [options]
 * @returns {(() => void) & { handle: SelectHandle }}
 */
export function attachSelect(select, { loop = false, typeaheadMs = 500 } = {}) {
    const before = {
        expanded: select.getAttribute('aria-expanded'),
        controls: select.getAttribute('aria-controls'),
    };
    comboboxState.selectCount += 1;
    const list = document.createElement('ul');
    list.className = 'kp-combobox__list';
    list.id = `${select.id || 'kp-select'}-drawn-${comboboxState.selectCount}`;
    list.setAttribute('role', 'listbox');
    list.dataset.kpSelectList = '';
    list.dataset.kpArrive = 'none';
    list.hidden = true;
    const labelled = select.labels?.[0];
    if (labelled) {
        if (!labelled.id) labelled.id = `${list.id}-label`;
        list.setAttribute('aria-labelledby', labelled.id);
    }
    select.after(list);
    select.setAttribute('aria-controls', list.id);
    select.setAttribute('aria-expanded', 'false');

    /** Rebuild the options from the select's own, and mark the chosen one. */
    const build = () => {
        list.replaceChildren(
            ...[...select.options].map((native, i) => {
                const option = document.createElement('li');
                option.className = 'kp-combobox__option';
                option.id = `${list.id}-option-${i}`;
                option.setAttribute('role', 'option');
                option.setAttribute('aria-selected', 'false');
                option.dataset.kpOption = '';
                option.dataset.value = native.value;
                option.textContent = native.label || native.text;
                if (native.disabled) option.setAttribute('aria-disabled', 'true');
                if (native.selected) option.dataset.kpChosen = '';
                return option;
            }),
        );
        listbox.refresh();
    };

    /**
     * Put the open list under the select and as wide as it. A first guess from
     * the offsets both siblings share, then one correction measured against
     * the paint, because a register may give the list a margin or the page a
     * containing block the offsets do not see. The gap under the select is
     * the list's own top margin, held to at most 0.5rem.
     */
    const place = () => {
        list.style.left = `${select.offsetLeft}px`;
        list.style.top = `${select.offsetTop + select.offsetHeight}px`;
        list.style.width = `${select.offsetWidth}px`;
        const box = select.getBoundingClientRect();
        const drawn = layoutRect(list);
        const margin = Math.min(Math.max(Number.parseFloat(getComputedStyle(list).marginTop) || 0, 0), 8);
        list.style.left = `${select.offsetLeft + (box.left - drawn.left)}px`;
        list.style.top = `${select.offsetTop + select.offsetHeight + (box.bottom + margin - drawn.top)}px`;
        list.style.width = `${box.width}px`;
        // Above the select when the window has no room under it [fix-30].
        if (raised(list)) placeBlockSide(list, box);
    };

    const isOpen = () => list.hidden === false;

    /** Takes the open list out of the top layer again (js/top-layer.js). */
    let lower = () => {};
    const open = () => {
        if (select.disabled) return;
        build();
        list.hidden = false;
        // Above a container that clips, placed by the same measurement as before; it follows the select while open.
        lower();
        lower = raiseOverlay(list, place);
        select.setAttribute('aria-expanded', 'true');
        const chosen = listbox.options.findIndex((option) => option.dataset.kpChosen !== undefined);
        listbox.highlight(Math.max(chosen, 0));
        select.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: true } }));
    };

    const close = () => {
        if (!isOpen()) return;
        lower();
        lower = () => {};
        list.hidden = true;
        select.setAttribute('aria-expanded', 'false');
        listbox.clear();
        select.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: false } }));
    };

    /** @param {HTMLElement} option */
    const take = (option) => {
        const value = option.dataset.value ?? '';
        const changed = select.value !== value;
        select.value = value;
        close();
        select.focus();
        // The events a person choosing in the native list would have caused,
        // so a form library, React's onChange and forms.js all hear it.
        if (changed) {
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const listbox = createListbox({
        input: select,
        list,
        loop,
        typeahead: true,
        typeaheadMs,
        onChoose: (_, option) => take(option),
        onDismiss: close,
    });

    /**
     * What the listbox does not do: open from a closed box, and keep the
     * browser's own select behaviour — its popup, its arrow keys and letters
     * changing the value directly — out of the way.
     *
     * @param {KeyboardEvent} event
     */
    const onKeyDownCapture = (event) => {
        if (event.ctrlKey || event.metaKey) return;
        const printable = event.key.length === 1 && !event.altKey;
        if (!isOpen()) {
            if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'F4'].includes(event.key) || printable) {
                event.preventDefault();
                open();
                // Arrows and Enter only open; the listbox must not also move.
                if (!printable) event.stopImmediatePropagation();
                else if (event.key === ' ') event.stopImmediatePropagation();
            }
            return;
        }
        if (event.key === 'Tab') {
            close();
            return;
        }
        if (event.key === ' ' && listbox.index !== -1) {
            event.preventDefault();
            event.stopImmediatePropagation();
            listbox.choose();
            return;
        }
        if (event.key === 'Escape') event.preventDefault();
        if (printable || event.key === 'Enter') event.preventDefault();
    };

    /** A press on the box opens the drawn list instead of the browser's. @param {MouseEvent} event */
    const onMouseDown = (event) => {
        if (event.button !== 0 || select.disabled) return;
        event.preventDefault();
        select.focus();
        if (isOpen()) close();
        else open();
    };

    /** A press in the list must not take focus from the select. @param {MouseEvent} event */
    const onListMouseDown = (event) => event.preventDefault();

    const onFocusOut = () => {
        setTimeout(() => {
            if (document.activeElement !== select) close();
        }, 0);
    };

    /** The page changed the value: the mark follows at once if the list is open. */
    const onChange = () => {
        if (isOpen()) build();
    };

    // Capture on the select itself runs before the listbox's bubble-phase
    // listener, which is what lets a closed box open without the listbox
    // also moving the highlight.
    select.addEventListener('keydown', onKeyDownCapture, { capture: true });
    select.addEventListener('mousedown', onMouseDown);
    select.addEventListener('focusout', onFocusOut);
    select.addEventListener('change', onChange);
    list.addEventListener('mousedown', onListMouseDown);
    build();

    /** @type {SelectHandle} */
    const handle = { element: select, list, open, close, refresh: build };
    selectHandles.set(select, handle);
    select.dataset.kpSelectAttached = '';

    const detach = () => {
        lower();
        listbox.destroy();
        select.removeEventListener('keydown', onKeyDownCapture, { capture: true });
        select.removeEventListener('mousedown', onMouseDown);
        select.removeEventListener('focusout', onFocusOut);
        select.removeEventListener('change', onChange);
        list.remove();
        if (labelled && labelled.id === `${list.id}-label`) labelled.removeAttribute('id');
        for (const [name, value] of /** @type {const} */ ([
            ['aria-expanded', before.expanded],
            ['aria-controls', before.controls],
        ])) {
            if (value === null) select.removeAttribute(name);
            else select.setAttribute(name, value);
        }
        select.removeAttribute('aria-activedescendant');
        selectHandles.delete(select);
        delete select.dataset.kpSelectAttached;
    };
    return Object.assign(detach, { handle });
}

/**
 * Lay a drawn list over every select under `root` that `drawsSelect` accepts:
 * each single `select.kp-field__input` and each `select[data-kp-select]`, but
 * never one marked `data-kp-select="native"` and never a multiple select
 * [scope-54; the default since Kenny's form of 2026-09-13].
 *
 * @param {ParentNode} [root]
 * @param {{ loop?: boolean, typeaheadMs?: number }} [options] Defaults; per select `data-kp-loop`.
 * @returns {(() => void) & { handles: SelectHandle[] }} detach
 */
export function attachSelects(root = document, options = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {SelectHandle[]} */
    const created = [];
    const found = root instanceof Element && root.matches('select') ? [root] : [...root.querySelectorAll('select')];
    for (const element of found) {
        if (!drawsSelect(element)) continue;
        const select = element;
        if (select.dataset.kpSelectAttached !== undefined) continue;
        const loopFlag = select.dataset.kpLoop;
        const detach = attachSelect(select, { ...options, ...(loopFlag === undefined ? {} : { loop: loopFlag !== 'false' }) });
        cleanups.push(detach);
        created.push(detach.handle);
    }
    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
