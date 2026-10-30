// Prepares a picker and wires its combobox, segmented control, keys and events.
import { attachComboboxes, combobox, CHANGE_EVENT } from '../combobox.js';
import { getStrings } from '../strings.js';
import { registerShortcuts } from '../shortcuts.js';
import { memoryFor } from '../remember.js';
import { addName, clearNote } from './add.js';
import { USUAL_NOT_TODAY_EVENT, USUAL_PICK_EVENT, USUAL_RETRY_EVENT } from './constants.js';
import { arrange, paintHeaders, paintTail } from './layout.js';
import { exactItem, nearOf, pickedValues } from './lookup.js';
import { attr, bandValues, canFold, folded, make, models, readItems, readPinned } from './model.js';
import { normaliseName } from './names.js';
import { flashTag, originOf, pick, sayAfter } from './picking.js';
import { usualState } from './state.js';
import { answer, answerOf, render, syncCheck, syncHint, syncPanel } from './sync.js';
/** @typedef {import('./types.js').UsualItem} UsualItem */
/** @typedef {import('./types.js').UsualModel} UsualModel */

/**
 * Make one picker ready for the combobox: tag mode and the empty row it needs, before the combobox attaches.
 * @param {HTMLElement} box
 */
function prepare(box) {
    if (box.hasAttribute('data-kp-multiple') && !box.hasAttribute('data-kp-tags')) {
        box.setAttribute('data-kp-tags', '');
        if (!box.querySelector('[data-kp-tag-list]')) {
            const tags = make('div', 'kp-tag-list');
            tags.setAttribute('data-kp-tag-list', '');
            box.querySelector('input')?.before(tags);
        }
    }
    const list = box.querySelector('[role="listbox"]');
    if (list && !list.querySelector('[data-kp-combobox-empty]')) {
        const empty = make('li', 'kp-combobox__empty kp-usual__empty');
        empty.setAttribute('role', 'presentation');
        empty.setAttribute('data-kp-combobox-empty', '');
        empty.hidden = true;
        list.append(empty);
    }
    box.dataset.kpUsualReady = '';
}

/** @param {HTMLElement} box @returns {(() => void) | null} */
export function wire(box) {
    prepare(box);
    attachComboboxes(box.parentElement ?? document);
    const handle = combobox(box);
    const input = /** @type {HTMLInputElement | null} */ (box.querySelector('input[role="combobox"]'));
    const list = /** @type {HTMLElement | null} */ (box.querySelector('[role="listbox"]'));
    if (!handle || !input || !list) return null;
    usualState.serial += 1;
    const panel = make('div', 'kp-usual__state');
    panel.hidden = true;
    const hintEl = make('p', 'kp-usual__hint');
    hintEl.hidden = true;
    input.after(hintEl);
    const noteEl = make('p', 'kp-usual__note');
    // It says the add itself (the status line keeps its count), so a screen reader hears it once.
    noteEl.setAttribute('aria-live', 'polite');
    noteEl.hidden = true;
    hintEl.after(noteEl);
    box.append(panel);
    /** @type {UsualModel} */
    const m = {
        box,
        input,
        list,
        status: box.querySelector('[data-kp-combobox-status]'),
        handle,
        items: [],
        given: null,
        expanded: false,
        nextFrom: null,
        notToday: new Set(),
        panel,
        busy: null,
        hintEl,
        noteEl,
        check: null,
        checkKey: '',
        checkOff: () => {},
        silent: false,
    };
    models.set(box, m);
    const memory = box.hasAttribute('data-kp-remember') ? memoryFor(box, 'picker') : null;
    if (memory) m.expanded = Boolean(memory.read('expanded', false));
    box.classList.add('kp-usual');
    readItems(m);

    handle.extend({
        shown: (option, query, matched) => {
            if (option.hasAttribute('data-kp-more')) return query === '' && canFold(m);
            if (option.hasAttribute('data-kp-pinned')) return query === '' || matched;
            if (option.hasAttribute('data-kp-synth')) return true;
            if (query === '') return !(folded(m) && option.hasAttribute('data-kp-rest'));
            return matched;
        },
        after: (query, visible) => {
            void query;
            void visible;
            // The guard first (it folds a near name's own row into its question), then the headings over what is left.
            paintTail(m, m.input.value.trim());
            paintHeaders(m);
        },
        status: (query) => {
            if (query !== '') {
                // A name typed that is already picked: the status says what the list's own line says.
                const same = exactItem(m, query);
                return same && pickedValues(m).includes(same.value) ? getStrings().usualAlreadyPicked(same.label) : null;
            }
            const band = bandValues(m).length;
            return band > 0 ? getStrings().usualStatus(band, m.items.length - band) : null;
        },
        choose: (option) => {
            if (option.hasAttribute('data-kp-more')) {
                m.expanded = !m.expanded;
                memory?.write('expanded', m.expanded);
                arrange(m);
                m.handle.refresh();
                return true;
            }
            if (option.classList.contains('kp-usual__add')) {
                addName(m, m.input.value.trim(), null);
                return true;
            }
            if (option.classList.contains('kp-usual__near')) {
                const value = option.dataset.kpNearValue ?? '';
                pick(m, value, 'typed');
                sayAfter(m, getStrings().usualSelectedExisting(m.items.find((i) => i.value === value)?.label ?? value));
                return true;
            }
            if (option.hasAttribute('data-kp-pinned')) {
                m.nextFrom = 'pinned';
            }
            return false;
        },
    });
    arrange(m);
    handle.refresh();
    syncPanel(m);

    let typedAtEnter = '';
    /** @param {Event} event */
    const onChange = (event) => {
        const { value, action, label } = /** @type {CustomEvent} */ (event).detail;
        // Text that named an item already in the list selected it: the status line says so (the combobox cleared the field).
        if (action === 'add' && typedAtEnter !== '' && normaliseName(typedAtEnter) === normaliseName(String(label ?? ''))) {
            sayAfter(m, getStrings().usualSelectedExisting(String(label)));
            flashTag(m, String(value));
        }
        typedAtEnter = '';
        // Any change of the picks ends the Undo offered after an add (an add sets its own line after its pick).
        clearNote(m);
        // Picked is "had it": a usual choice picked from the list or by typing stops being "not today".
        for (const v of handle.values()) {
            if (!m.notToday.delete(v)) continue;
            box.dispatchEvent(new CustomEvent(USUAL_NOT_TODAY_EVENT, { bubbles: true, detail: { value: v, on: false } }));
        }
        if (m.silent || action === 'remove') {
            syncCheck(m);
            syncHint(m);
            return;
        }
        const from = m.nextFrom ?? originOf(m, String(value));
        m.nextFrom = null;
        box.dispatchEvent(new CustomEvent(USUAL_PICK_EVENT, { bubbles: true, detail: { value, from } }));
        syncCheck(m);
        syncHint(m);
    };
    box.addEventListener(CHANGE_EVENT, onChange);

    /** A name typed that is already picked: its tag lights up and the status line says so; the text stays, and so does the list's own line. @param {UsualItem} item */
    const already = (item) => {
        handle.open();
        flashTag(m, item.value);
        sayAfter(m, getStrings().usualAlreadyPicked(item.label));
    };

    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
        if (event.key === 'Enter') typedAtEnter = input.value.trim();
        if (event.altKey && (event.code === 'KeyU' || event.key.toLowerCase() === 'u') && input.value === '') {
            event.preventDefault();
            handle.open();
            const pinned = readPinned(m).length;
            for (let i = 0; i < pinned + 1; i += 1) input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            return;
        }
        if (event.key !== 'Enter' || event.defaultPrevented || event.isComposing) return;
        const typed = input.value.trim();
        if (typed === '') return;
        // A row lit by the arrows (or by the first Enter on a near name) is what Enter takes: the listbox chooses it.
        if (!list.hidden && input.getAttribute('aria-activedescendant')) return;
        const s = getStrings();
        const picked = new Set(pickedValues(m));
        // Identical after case, accents and spaces: never a second one, whatever the guard is set to.
        const exact = exactItem(m, typed);
        if (exact) {
            event.preventDefault();
            if (picked.has(exact.value)) return already(exact);
            pick(m, exact.value, 'typed');
            sayAfter(m, s.usualSelectedExisting(exact.label));
            return;
        }
        const near = attr(m, 'near', 'ask') ?? 'ask';
        if (near !== 'off') {
            const close = nearOf(m, typed);
            const free = close.filter((item) => !picked.has(item.value) && !item.el.hasAttribute('aria-disabled'));
            if (free[0]) {
                event.preventDefault();
                if (near === 'select') {
                    pick(m, free[0].value, 'typed');
                    sayAfter(m, s.usualTookClosest(typed, free[0].label));
                } else {
                    // Ask: the question already stands first in the list; Enter lights it, and a second Enter takes it. This
                    // Enter is spent here: the listbox, which runs after, must not take the row it has just been lit.
                    event.stopImmediatePropagation();
                    handle.open();
                    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
                    sayAfter(m, s.usualAsk(free[0].label));
                }
                return;
            }
            if (close[0]) {
                event.preventDefault();
                return already(close[0]);
            }
        }
        if (attr(m, 'add', 'off') !== 'inline') return;
        event.preventDefault();
        addName(m, typed, close0(near, typed));
    };
    /** The name a new one was close to, for the add event (null when the guard is off or nothing is close). @param {string} near @param {string} typed */
    const close0 = (near, typed) => (near === 'off' ? null : (nearOf(m, typed)[0]?.label ?? null));
    input.addEventListener('keydown', onKey, { capture: true });

    /** @param {MouseEvent} event */
    const onClick = (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest('[data-kp-usual-retry]')) box.dispatchEvent(new CustomEvent(USUAL_RETRY_EVENT, { bubbles: true }));
        else if (target?.closest('[data-kp-usual-add-button]')) {
            const typed = input.value.trim();
            if (typed) addName(m, typed, null);
            else input.focus();
        } else {
            // A row of the check: "Had it" or "Not today", pressed again: not answered. (The chips are the segmented
            // module's own three-way group, which says what changed by its event.)
            const button = /** @type {HTMLButtonElement | null} */ (target?.closest('.kp-usual__check-pair button') ?? null);
            const pair = button?.closest('.kp-usual__check-pair');
            if (!button || button.disabled || !(pair instanceof HTMLElement)) return;
            const kind = button.dataset.value === 'not' ? 'not' : 'had';
            const value = pair.dataset.value ?? '';
            answer(m, value, answerOf(m, value) === kind ? 'none' : kind);
        }
    };
    box.addEventListener('click', onClick);
    // Typing re-orders for `while-typing="hide"` and shows or hides the rows of the guard.
    const onInput = () => {
        clearNote(m);
        if (attr(m, 'usual-while-typing') === 'hide') {
            arrange(m);
            handle.refresh();
        }
        syncHint(m);
    };
    input.addEventListener('input', onInput);

    const unkey = registerShortcuts(box, [
        { keys: 'Alt U', what: getStrings().usualJump, group: 'Picker', when: () => bandValues(m).length > 0, run: () => false },
    ]);
    const watch = new MutationObserver(() => render(m));
    watch.observe(box, {
        attributes: true,
        attributeFilter: [
            'data-kp-usual',
            'data-kp-usual-source',
            'data-kp-usual-max',
            'data-kp-usual-label',
            'data-kp-usual-while-typing',
            'data-kp-order',
            'data-kp-pinned',
            'data-kp-all',
            'data-kp-add',
            'data-kp-near',
            'data-kp-near-threshold',
            'data-kp-near-max',
            'data-kp-not-today',
            'data-kp-not-today-label',
            'data-kp-usual-undo',
            'data-kp-hint',
            'data-kp-state',
        ],
    });
    if (attr(m, 'preselect') === 'usual' && box.hasAttribute('data-kp-tags') && handle.values().length === 0) {
        handle.set(bandValues(m));
    }
    syncHint(m);
    syncCheck(m);
    return () => {
        watch.disconnect();
        unkey();
        box.removeEventListener(CHANGE_EVENT, onChange);
        box.removeEventListener('click', onClick);
        input.removeEventListener('keydown', onKey, { capture: true });
        input.removeEventListener('input', onInput);
        handle.extend(null);
        m.busy?.remove();
        panel.remove();
        hintEl.remove();
        noteEl.remove();
        m.checkOff();
        m.check?.remove();
        for (const node of list.querySelectorAll('[data-kp-synth], .kp-usual__tail')) node.remove();
        models.delete(box);
        delete box.dataset.kpUsualReady;
    };
}
