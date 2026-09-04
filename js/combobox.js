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
// Add `data-kp-tags` to the wrapper and it becomes a tag input.
//
// The status line is not decoration. A sighted user sees the list shrink
// as they type; without an announcement, nobody else knows anything
// happened. It is the single most-skipped part of every combobox.

import { createListbox, OPTION_SELECTOR } from './listbox.js';
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
 * carries `{ value, values }` — the value just chosen, and every value
 * held (one for a combobox, the whole set for a tag input).
 */
export const CHANGE_EVENT = 'kp-combobox-change';

/**
 * @param {HTMLElement} root
 * @param {string} value
 * @param {string[]} values
 */
function announce(root, value, values) {
    root.dispatchEvent(new CustomEvent(CHANGE_EVENT, { bubbles: true, detail: { value, values } }));
}

/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachComboboxes(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

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
        /** @type {string[]} */
        const chosen = [];

        const open = () => {
            list.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        };
        const close = () => {
            list.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            listbox.clear();
        };

        /** Show only the options whose text matches, and say how many are left. */
        const filter = () => {
            const query = input.value.trim().toLowerCase();
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                const text = (option.textContent ?? '').toLowerCase();
                const taken = isTags && chosen.includes(option.dataset.value ?? text);
                const shown = !taken && (query === '' || text.includes(query));
                option.hidden = !shown;
                if (shown) visible += 1;
            }
            listbox.refresh();
            if (status !== null) status.textContent = RESULTS_TEXT(visible);
            return visible;
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
                if (!chosen.includes(value)) {
                    chosen.push(value);
                    if (tagList !== null) tagList.append(tagElement(value, label));
                }
                input.value = '';
                filter();
                // Kept open: adding one tag almost always means adding
                // another, and reopening the list by hand is friction the
                // keyboard user pays and the mouse user does not.
                open();
            } else {
                input.value = label;
                close();
            }
            announce(box, value, isTags ? [...chosen] : [value]);
        };

        /** @param {string} value @param {string} label */
        const tagElement = (value, label) => {
            const tag = document.createElement('span');
            tag.className = 'kp-tag';
            tag.dataset.value = value;
            const text = document.createElement('span');
            text.textContent = label;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'kp-tag__remove';
            // A bare × is "times" to a screen reader; the name says what
            // it removes, because a row of ten identical buttons is
            // useless without it.
            remove.setAttribute('aria-label', getStrings().removeNamed(label));
            remove.textContent = '×';
            tag.append(text, remove);
            return tag;
        };

        const listbox = createListbox({
            input,
            list,
            onChoose: (_, option) => take(option),
            onDismiss: close,
        });

        const onInput = () => {
            const visible = filter();
            if (visible > 0) open();
            else close();
        };

        /** @param {KeyboardEvent} event */
        const onKeyDown = (event) => {
            if (!isTags) return;
            // Backspace in an empty field removes the last tag: the
            // behaviour every mail client has, and the one people try
            // first.
            if (event.key === 'Backspace' && input.value === '' && chosen.length > 0) {
                const value = chosen.pop();
                tagList?.querySelector(`.kp-tag[data-value="${CSS.escape(value ?? '')}"]`)?.remove();
                filter();
                announce(box, value ?? '', [...chosen]);
            }
        };

        /** @param {MouseEvent} event */
        const onTagClick = (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            const remove = target.closest('.kp-tag__remove');
            if (remove === null) return;
            const tag = /** @type {HTMLElement | null} */ (remove.closest('.kp-tag'));
            const value = tag?.dataset.value ?? '';
            const at = chosen.indexOf(value);
            if (at !== -1) chosen.splice(at, 1);
            tag?.remove();
            filter();
            input.focus();
            announce(box, value, [...chosen]);
        };

        const onFocusOut = () => {
            // A tick, because focus moving from the input to an option is
            // a focusout followed immediately by a focusin, and closing
            // on the first would make every mouse choice miss.
            setTimeout(() => {
                if (!box.contains(document.activeElement)) close();
            }, 0);
        };

        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeyDown);
        input.addEventListener('focus', () => {
            if (filter() > 0) open();
        });
        box.addEventListener('focusout', onFocusOut);
        tagList?.addEventListener('click', onTagClick);
        filter();
        close();

        cleanups.push(() => {
            listbox.destroy();
            input.removeEventListener('input', onInput);
            input.removeEventListener('keydown', onKeyDown);
            box.removeEventListener('focusout', onFocusOut);
            tagList?.removeEventListener('click', onTagClick);
            delete box.dataset.kpComboboxAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachComboboxes());
    else attachComboboxes();
}
