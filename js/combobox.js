// Combobox and tag input, framework-free [TH39, TH41].
//
// The two share almost everything: a text input, a filtered list, virtual
// focus from js/listbox.js. They differ in what a choice does — a
// combobox replaces the value, a tag input appends one and clears the
// field — so they are one module with one flag rather than two files that
// drift.
//
// What the markup looks like:
//
//   <div class="kp-combobox" data-kp-combobox>
//     <input class="kp-combobox__input" type="text" role="combobox"
//            aria-expanded="false" aria-controls="fruit-list" />
//     <ul class="kp-combobox__list" id="fruit-list" role="listbox" hidden>
//       <li class="kp-combobox__option" role="option" data-kp-option
//           data-value="apple">Apple</li>
//     </ul>
//     <p class="kp-combobox__status" data-kp-combobox-status
//        role="status" aria-live="polite"></p>
//   </div>
//
// Add `data-kp-tags` to the wrapper and it becomes a tag input. Tags the
// server already rendered into `[data-kp-tag-list]` are read at attach.
//
// The status line is not decoration. A sighted user sees the list shrink
// as they type; without an announcement, nobody else knows anything
// happened. It is the single most-skipped part of every combobox.
//
// Since 3.0.0 [KT6]: the values are readable and settable through the
// handle; the matcher is a choice (substring, prefix, or the palette's
// subsequence) or the consumer's own function; every behaviour — open on
// focus, close on blur, Backspace removes, stay open after a tag, the
// cap, duplicates — is a flag with a default; the tag markup can be the
// consumer's; and detach restores what attach changed.

import { createListbox, OPTION_SELECTOR, subsequence } from './listbox.js';
import { getStrings } from './strings.js';

const COMBOBOX = '[data-kp-combobox]';
const INPUT = 'input[role="combobox"]';
const LIST = '[role="listbox"]';
const STATUS = '[data-kp-combobox-status]';
const TAGS = '[data-kp-tag-list]';

/** Announced when the list changes; the words come from the dictionary [KT5]. */
const RESULTS_TEXT = /** @param {number} n */ (n) => {
    const s = getStrings();
    return n === 0 ? s.noResults : n === 1 ? s.oneResult : s.manyResults(n);
};

/**
 * The event a consumer listens for. A contract value [TH26]: the detail
 * carries `{ value, label, values, action }` — the value just chosen or
 * removed, its label, every value held (one for a combobox, the whole
 * set for a tag input), and which of 'add' | 'remove' | 'set' it was.
 */
export const CHANGE_EVENT = 'kp-combobox-change';
/** Fired when the list opens or closes: `{ open }`. */
export const OPEN_EVENT = 'kp-combobox-open';

/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export const MATCHERS = {
    substring: (text, query) => text.includes(query),
    prefix: (text, query) => text.startsWith(query),
    subsequence: (text, query) => subsequence(text, query),
};

/**
 * @typedef {object} ComboboxHandle
 * @property {HTMLElement} element
 * @property {() => string[]} values
 * @property {(values: readonly string[]) => void} set replace the held values (a combobox takes the first)
 * @property {() => void} open
 * @property {() => void} close
 * @property {(text: string) => void} query type on the consumer's behalf
 * @property {() => void} refresh re-read the options after the consumer changed them
 */

/** @type {WeakMap<Element, ComboboxHandle>} */
const handles = new WeakMap();

/** The handle for an attached combobox. @param {Element} element */
export function combobox(element) {
    return handles.get(element) ?? null;
}

/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @param {{ match?: keyof typeof MATCHERS | Matcher, loop?: boolean, openOnFocus?: boolean, closeOnBlur?: boolean, backspaceRemoves?: boolean, stayOpen?: boolean, maxTags?: number, allowDuplicates?: boolean, debounceMs?: number, renderTag?: (value: string, label: string) => HTMLElement, removeGlyph?: string }} [options]
 *   Defaults; per box as data-attributes: `data-kp-match`, `data-kp-loop`, `data-kp-open-on-focus`, `data-kp-close-on-blur`, `data-kp-backspace-removes`, `data-kp-stay-open`, `data-kp-max-tags`, `data-kp-duplicates`, `data-kp-debounce`.
 * @returns {(() => void) & { handles: ComboboxHandle[] }} detach
 */
export function attachComboboxes(
    root = document,
    {
        match = 'substring',
        loop = false,
        openOnFocus = true,
        closeOnBlur = true,
        backspaceRemoves = true,
        stayOpen = true,
        maxTags = Infinity,
        allowDuplicates = false,
        debounceMs = 0,
        renderTag,
        removeGlyph = '×',
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {ComboboxHandle[]} */
    const created = [];

    for (const element of root.querySelectorAll(COMBOBOX)) {
        const box = /** @type {HTMLElement} */ (element);
        if (box.dataset.kpComboboxAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (box.querySelector(INPUT));
        const list = /** @type {HTMLElement | null} */ (box.querySelector(LIST));
        if (input === null || list === null) continue;
        box.dataset.kpComboboxAttached = '';

        const status = /** @type {HTMLElement | null} */ (box.querySelector(STATUS));
        const tagList = /** @type {HTMLElement | null} */ (box.querySelector(TAGS));
        const isTags = box.dataset.kpTags !== undefined;
        /** @param {string} name @param {boolean} fallback */
        const flag = (name, fallback) => (box.dataset[name] === undefined ? fallback : box.dataset[name] !== 'false');
        const opens = flag('kpOpenOnFocus', openOnFocus);
        const closes = flag('kpCloseOnBlur', closeOnBlur);
        const backspaces = flag('kpBackspaceRemoves', backspaceRemoves);
        const stays = flag('kpStayOpen', stayOpen);
        const duplicates = flag('kpDuplicates', allowDuplicates);
        const cap = Number.parseInt(box.dataset.kpMaxTags ?? '', 10) || maxTags;
        const debounce = Number.parseInt(box.dataset.kpDebounce ?? '', 10) || debounceMs;
        const matcher = typeof match === 'function' ? match : (MATCHERS[box.dataset.kpMatch ?? match] ?? MATCHERS.substring);

        /** Tags the server rendered are the starting set, not invisible. */
        /** @type {string[]} */
        const chosen = tagList
            ? [...tagList.querySelectorAll('.kp-tag')].map((t) => /** @type {HTMLElement} */ (t).dataset.value ?? (t.textContent ?? '').trim())
            : [];
        const before = {
            expanded: input.getAttribute('aria-expanded'),
            listHidden: list.hidden,
            hidden: [...list.querySelectorAll(OPTION_SELECTOR)].map((o) => /** @type {HTMLElement} */ (o).hidden),
            tags: tagList ? [...tagList.children] : [],
            status: status?.textContent ?? '',
        };

        /** @param {boolean} next */
        const setOpen = (next) => {
            const was = list.hidden === false;
            list.hidden = !next;
            input.setAttribute('aria-expanded', String(next));
            if (!next) listbox.clear();
            if (was !== next) box.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: next } }));
        };
        const open = () => setOpen(true);
        const close = () => setOpen(false);

        /** Show only the options whose text matches, and say how many are left. */
        const filter = () => {
            const query = input.value.trim().toLowerCase();
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                const text = (option.textContent ?? '').toLowerCase();
                const taken = isTags && !duplicates && chosen.includes(option.dataset.value ?? text);
                const shown = !taken && (query === '' || matcher(text, query));
                option.hidden = !shown;
                if (shown) visible += 1;
            }
            listbox.refresh();
            if (status !== null) status.textContent = RESULTS_TEXT(visible);
            return visible;
        };

        /** The option whose value (or text) is `value`. @param {string} value @returns {HTMLElement | null} */
        const optionFor = (value) => {
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                if ((option.dataset.value ?? (option.textContent ?? '').trim()) === value) return option;
            }
            return null;
        };

        /** @param {string} value @param {string} label @param {'add' | 'remove' | 'set'} action */
        const announce = (value, label, action) =>
            box.dispatchEvent(
                new CustomEvent(CHANGE_EVENT, { bubbles: true, detail: { value, label, values: isTags ? [...chosen] : [value], action } }),
            );

        /** @param {string} value @param {string} label */
        const tagElement = (value, label) => {
            if (renderTag !== undefined) {
                const custom = renderTag(value, label);
                custom.dataset.value = value;
                custom.classList.add('kp-tag');
                return custom;
            }
            const tag = document.createElement('span');
            tag.className = 'kp-tag';
            tag.dataset.value = value;
            const text = document.createElement('span');
            text.textContent = label;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'kp-tag__remove';
            // A bare glyph is "times" to a screen reader; the name says
            // what it removes, because a row of ten identical buttons is
            // useless without it.
            remove.setAttribute('aria-label', getStrings().removeNamed(label));
            remove.textContent = box.dataset.kpRemoveGlyph ?? removeGlyph;
            tag.append(text, remove);
            return tag;
        };

        /** @param {HTMLElement} option */
        const take = (option) => {
            // Two different things, and conflating them is a real bug the
            // contract suite caught between the channels: the LABEL is
            // what a person reads in the field, the VALUE is what the
            // consumer gets in the event. `data-value` is optional, so an
            // option without one uses its own text for both.
            const label = (option.textContent ?? '').trim();
            const value = option.dataset.value ?? label;
            if (isTags) {
                if (chosen.length >= cap) return;
                if (duplicates || !chosen.includes(value)) {
                    chosen.push(value);
                    if (tagList !== null) tagList.append(tagElement(value, label));
                }
                input.value = '';
                filter();
                // Kept open: adding one tag almost always means adding
                // another, and reopening the list by hand is friction the
                // keyboard user pays and the mouse user does not.
                if (stays) open();
                else close();
            } else {
                input.value = label;
                close();
            }
            announce(value, label, 'add');
        };

        /** @param {string} value */
        const removeValue = (value) => {
            const at = chosen.indexOf(value);
            if (at === -1) return;
            chosen.splice(at, 1);
            const tag = /** @type {HTMLElement | null} */ (tagList?.querySelector(`.kp-tag[data-value="${CSS.escape(value)}"]`) ?? null);
            const label = tag?.querySelector('span')?.textContent ?? value;
            tag?.remove();
            filter();
            announce(value, label, 'remove');
        };

        const listbox = createListbox({
            input,
            list,
            loop: flag('kpLoop', loop),
            onChoose: (_, option) => take(option),
            onDismiss: close,
        });

        let pending = 0;
        const onInput = () => {
            clearTimeout(pending);
            const run = () => {
                const visible = filter();
                if (visible > 0) open();
                else close();
            };
            if (debounce > 0) pending = window.setTimeout(run, debounce);
            else run();
        };

        /** @param {KeyboardEvent} event */
        const onKeyDown = (event) => {
            if (!isTags || !backspaces) return;
            // Backspace in an empty field removes the last tag: the
            // behaviour every mail client has, and the one people try
            // first.
            if (event.key === 'Backspace' && input.value === '' && chosen.length > 0) removeValue(chosen[chosen.length - 1] ?? '');
        };

        /** @param {MouseEvent} event */
        const onTagClick = (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            const remove = target.closest('.kp-tag__remove, [data-kp-tag-remove]');
            if (remove === null) return;
            const tag = /** @type {HTMLElement | null} */ (remove.closest('.kp-tag'));
            removeValue(tag?.dataset.value ?? '');
            input.focus();
        };

        const onFocus = () => {
            if (opens && filter() > 0) open();
        };
        const onFocusOut = () => {
            if (!closes) return;
            // A tick, because focus moving from the input to an option is
            // a focusout followed immediately by a focusin, and closing
            // on the first would make every mouse choice miss.
            setTimeout(() => {
                if (!box.contains(document.activeElement)) close();
            }, 0);
        };

        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeyDown);
        input.addEventListener('focus', onFocus);
        box.addEventListener('focusout', onFocusOut);
        tagList?.addEventListener('click', onTagClick);
        filter();
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');

        /** @type {ComboboxHandle} */
        const handle = {
            element: box,
            values: () => (isTags ? [...chosen] : [input.value]),
            set: (values) => {
                if (isTags) {
                    chosen.splice(0, chosen.length);
                    if (tagList) tagList.replaceChildren();
                    for (const value of values.slice(0, cap)) {
                        if (!duplicates && chosen.includes(value)) continue;
                        chosen.push(value);
                        const option = optionFor(value);
                        tagList?.append(tagElement(value, (option?.textContent ?? value).trim()));
                    }
                    filter();
                    announce(values[values.length - 1] ?? '', '', 'set');
                } else {
                    const value = values[0] ?? '';
                    const option = optionFor(value);
                    input.value = (option?.textContent ?? value).trim();
                    announce(value, input.value, 'set');
                }
            },
            open,
            close,
            query: (text) => {
                input.value = text;
                onInput();
            },
            refresh: () => void filter(),
        };
        handles.set(box, handle);
        created.push(handle);

        cleanups.push(() => {
            clearTimeout(pending);
            listbox.destroy();
            input.removeEventListener('input', onInput);
            input.removeEventListener('keydown', onKeyDown);
            input.removeEventListener('focus', onFocus);
            box.removeEventListener('focusout', onFocusOut);
            tagList?.removeEventListener('click', onTagClick);
            if (before.expanded === null) input.removeAttribute('aria-expanded');
            else input.setAttribute('aria-expanded', before.expanded);
            list.hidden = before.listHidden;
            [...list.querySelectorAll(OPTION_SELECTOR)].forEach((o, i) => {
                /** @type {HTMLElement} */ (o).hidden = before.hidden[i] ?? false;
            });
            if (tagList) tagList.replaceChildren(...before.tags);
            if (status) status.textContent = before.status;
            handles.delete(box);
            delete box.dataset.kpComboboxAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
