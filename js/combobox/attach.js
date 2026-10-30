// Attaches the comboboxes of a page.
import { createListbox, OPTION_SELECTOR } from '../listbox.js';
import { getStrings } from '../strings.js';
import { raiseInPlace } from '../top-layer.js';
import { CHANGE_EVENT, COMBOBOX, EMPTY, INPUT, LIST, OPEN_EVENT, RESULTS_TEXT, STATUS, TAGS } from './constants.js';
import { handles } from './handle.js';
import { labelOf, slotStatus } from './helpers.js';
import { MATCHERS } from './matchers.js';
/** @typedef {import('./types.js').ComboboxHandle} ComboboxHandle */
/** @typedef {import('./types.js').ComboboxHook} ComboboxHook */
/** @typedef {import('./types.js').Matcher} Matcher */

/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @param {{ match?: keyof typeof MATCHERS | Matcher, loop?: boolean, openOnFocus?: boolean, closeOnBlur?: boolean, backspaceRemoves?: boolean, stayOpen?: boolean, maxTags?: number, allowDuplicates?: boolean, debounceMs?: number, emptyRow?: boolean, creatable?: boolean, renderTag?: (value: string, label: string) => HTMLElement, removeGlyph?: string }} [options]
 *   Defaults; per box as data-attributes: `data-kp-match`, `data-kp-loop`, `data-kp-open-on-focus`, `data-kp-close-on-blur`, `data-kp-backspace-removes`, `data-kp-stay-open`, `data-kp-max-tags`, `data-kp-duplicates`, `data-kp-debounce`, `data-kp-empty-row`, `data-kp-creatable`.
 *   A tag input adds from typed text with Enter or a comma [scope-60]: text that names an option (its label, any case) takes that option; other text becomes a tag of its own only with `creatable` (default false, as the React channel's prop).
 *   `backspaceRemoves` (default false since Kenny's second nostromo pass, 2026-09-13): Backspace in an empty field removes the last tag; `data-kp-backspace-removes` opts one box in.
 *   `emptyRow` (default true): a query that matches nothing keeps the list open with a "no results" row — the server's own `[data-kp-combobox-empty]` element inside the list if it wrote one, else one built from the dictionary; `false` closes the list instead, as before 6.1 [gap-11].
 * @returns {(() => void) & { handles: ComboboxHandle[] }} detach
 */
export function attachComboboxes(
    root = document,
    {
        match = 'substring',
        loop = false,
        openOnFocus = true,
        closeOnBlur = true,
        backspaceRemoves = false,
        stayOpen = true,
        maxTags = Infinity,
        allowDuplicates = false,
        debounceMs = 0,
        emptyRow = true,
        creatable = false,
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
        // A picker with the usual on top is made ready by js/usual-picker.js, which attaches it itself [kpadopt6].
        if (box.hasAttribute('data-kp-usual') && box.dataset.kpUsualReady === undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (box.querySelector(INPUT));
        const list = /** @type {HTMLElement | null} */ (box.querySelector(LIST));
        if (input === null || list === null) continue;
        box.dataset.kpComboboxAttached = '';
        list.dataset.kpArrive = 'none';

        const status = /** @type {HTMLElement | null} */ (box.querySelector(STATUS));
        const unslot = slotStatus(box, status);
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
        const showsEmpty = flag('kpEmptyRow', emptyRow);
        const creates = flag('kpCreatable', creatable);
        // The row that says nothing matched, inside the list and directly under
        // the input [gap-11]. Filtering to nothing used to close the list, and
        // the only answer left was the status line. The server's own row is
        // used when it wrote one (it may offer "add this"); otherwise one is
        // built, and taken away again at detach.
        const serverEmpty = /** @type {HTMLElement | null} */ (list.querySelector(EMPTY));
        /** @type {HTMLElement | null} */
        let empty = serverEmpty;
        if (showsEmpty && empty === null) {
            empty = document.createElement('li');
            empty.className = 'kp-combobox__empty';
            empty.setAttribute('role', 'presentation');
            empty.dataset.kpComboboxEmpty = '';
            list.append(empty);
        }
        const emptyWasHidden = serverEmpty?.hidden ?? true;

        /** Tags the server rendered are the starting set, not invisible. */
        /** @type {string[]} */
        const chosen = tagList
            ? [...tagList.querySelectorAll('.kp-tag')].map((t) => /** @type {HTMLElement} */ (t).dataset.value ?? (t.textContent ?? '').trim())
            : [];
        // A tag list written `hidden` is hidden while it holds no tag, and shown the moment one is added: the package
        // never un-hid it, so every pick of the usual picker's symptoms went into a list nobody could see (Kenny,
        // 2026-10-18 18:42: "MIJN SELECTIES KOMEN NIET IN DE LIJST TEVOORSCHIJN"). A list written without `hidden` is
        // left as it is.
        const tagsHidden = tagList?.hidden ?? false;
        const showTags = () => {
            if (tagList !== null && tagsHidden) tagList.hidden = chosen.length === 0;
        };
        const before = {
            expanded: input.getAttribute('aria-expanded'),
            listHidden: list.hidden,
            hidden: [...list.querySelectorAll(OPTION_SELECTOR)].map((o) => /** @type {HTMLElement} */ (o).hidden),
            tags: tagList ? [...tagList.children] : [],
            status: status?.textContent ?? '',
        };

        /** Takes the open list out of the top layer again (js/top-layer.js). */
        let lower = () => {};
        /** @param {boolean} next */
        const setOpen = (next) => {
            const was = list.hidden === false;
            // Out of the top layer while still drawn, so the theme's close
            // plays on its copy (js/motion.js), then hidden.
            if (!next && was) {
                lower();
                lower = () => {};
            }
            list.hidden = !next;
            // Above a container that clips — a card's cut corners hid every option in four themes — where it was drawn.
            if (next && !was) lower = raiseInPlace(list, box, input);
            input.setAttribute('aria-expanded', String(next));
            if (!next) listbox.clear();
            if (was !== next) box.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: next } }));
        };
        const open = () => setOpen(true);
        const close = () => setOpen(false);

        /** @type {ComboboxHook | null} */
        let hook = null;

        /** Show only the options whose text matches, and say how many are left. */
        const filter = () => {
            const query = input.value.trim().toLowerCase();
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                const text = (option.textContent ?? '').toLowerCase();
                const taken = isTags && !duplicates && chosen.includes(option.dataset.value ?? text);
                const matched = !taken && (query === '' || matcher(text, query));
                const shown = hook?.shown && !taken ? hook.shown(option, query, matched) : matched;
                option.hidden = !shown;
                if (shown) visible += 1;
            }
            hook?.after?.(query, visible);
            // The rows a layer added are options too: count what is shown now.
            if (hook?.after) visible = [...list.querySelectorAll(OPTION_SELECTOR)].filter((o) => !(/** @type {HTMLElement} */ (o).hidden)).length;
            listbox.refresh();
            if (status !== null) status.textContent = hook?.status?.(query, visible) ?? RESULTS_TEXT(visible);
            if (empty !== null) {
                empty.hidden = !showsEmpty || visible > 0;
                if (empty !== serverEmpty) empty.textContent = getStrings().noResults;
            }
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

        /** @param {string} value @param {string} label */
        const addTag = (value, label) => {
            if (chosen.length >= cap) return;
            if (duplicates || !chosen.includes(value)) {
                chosen.push(value);
                if (tagList !== null) tagList.append(tagElement(value, label));
                showTags();
            }
            input.value = '';
            filter();
            // Kept open: adding one tag almost always means adding
            // another, and reopening the list by hand is friction the
            // keyboard user pays and the mouse user does not.
            if (stays) open();
            else close();
            announce(value, label, 'add');
        };

        /** @param {HTMLElement} option */
        const take = (option) => {
            if (hook?.choose?.(option)) return;
            // Two different things, and conflating them is a real bug the
            // contract suite caught between the channels: the LABEL is
            // what a person reads in the field, the VALUE is what the
            // consumer gets in the event. `data-value` is optional, so an
            // option without one uses its own text for both.
            const label = labelOf(option);
            const value = option.dataset.value ?? label;
            if (isTags) {
                addTag(value, label);
                return;
            }
            input.value = label;
            close();
            announce(value, label, 'add');
        };

        /**
         * Typed text ends a tag [scope-60]. Before this, Enter with nothing
         * highlighted had nothing to take, so a tag input filtered and removed
         * but never added from the keyboard. Text naming an option takes it;
         * other text becomes its own tag where the box allows new values.
         *
         * @returns {boolean} whether a tag was added
         */
        const addTyped = () => {
            const typed = input.value.trim();
            if (typed === '') return false;
            const named = [...list.querySelectorAll(OPTION_SELECTOR)].find(
                (element) =>
                    !element.matches('[aria-disabled="true"], [data-kp-disabled]') &&
                    (element.textContent ?? '').trim().toLowerCase() === typed.toLowerCase(),
            );
            if (named instanceof HTMLElement) {
                take(named);
                return true;
            }
            if (!creates) return false;
            addTag(typed, typed);
            return true;
        };

        /** @param {string} value */
        const removeValue = (value) => {
            const at = chosen.indexOf(value);
            if (at === -1) return;
            chosen.splice(at, 1);
            const tag = /** @type {HTMLElement | null} */ (tagList?.querySelector(`.kp-tag[data-value="${CSS.escape(value)}"]`) ?? null);
            const label = tag?.querySelector('span')?.textContent ?? value;
            tag?.remove();
            showTags();
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
                if (visible > 0 || (showsEmpty && input.value.trim() !== '')) open();
                else close();
            };
            if (debounce > 0) pending = window.setTimeout(run, debounce);
            else run();
        };

        /** @param {KeyboardEvent} event */
        const onKeyDown = (event) => {
            if (list.hidden && (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown'))) {
                event.preventDefault();
                if (filter() > 0) open();
                return;
            }
            if (!isTags) return;
            // The listbox runs first: an Enter that took a highlighted option
            // is already spent, and the field is empty by now.
            if ((event.key === 'Enter' || event.key === ',') && !event.defaultPrevented && !event.isComposing) {
                if (event.key === 'Enter' && listbox.index !== -1) return;
                if (addTyped()) event.preventDefault();
                return;
            }
            // Backspace in an empty field removes the last tag only where the
            // box opts in. It was the default until Kenny's second nostromo
            // pass (2026-09-13): one Backspace too many while correcting a
            // typo took away a tag already chosen. Each tag's own remove
            // button is the way out, and it is in the tab order.
            if (!backspaces) return;
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

        /**
         * A press in the list keeps DOM focus in the input. Without this the
         * press moved focus to the page, the focusout above closed the list
         * a tick later, and the click that followed the release landed on a
         * hidden list: choosing an option with the mouse did nothing [note 2
         * of Kenny's second nostromo pass, 2026-09-13]. The React channel
         * always did this on its options.
         *
         * @param {MouseEvent} event
         */
        const onListMouseDown = (event) => event.preventDefault();

        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeyDown);
        input.addEventListener('focus', onFocus);
        box.addEventListener('focusout', onFocusOut);
        list.addEventListener('mousedown', onListMouseDown);
        tagList?.addEventListener('click', onTagClick);
        showTags();
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
                        tagList?.append(tagElement(value, labelOf(option, value)));
                    }
                    showTags();
                    filter();
                    announce(values[values.length - 1] ?? '', '', 'set');
                } else {
                    const value = values[0] ?? '';
                    const option = optionFor(value);
                    input.value = labelOf(option, value);
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
            extend: (next) => {
                hook = next;
                filter();
            },
        };
        handles.set(box, handle);
        created.push(handle);

        cleanups.push(() => {
            clearTimeout(pending);
            lower();
            listbox.destroy();
            input.removeEventListener('input', onInput);
            input.removeEventListener('keydown', onKeyDown);
            input.removeEventListener('focus', onFocus);
            box.removeEventListener('focusout', onFocusOut);
            list.removeEventListener('mousedown', onListMouseDown);
            tagList?.removeEventListener('click', onTagClick);
            if (before.expanded === null) input.removeAttribute('aria-expanded');
            else input.setAttribute('aria-expanded', before.expanded);
            list.hidden = before.listHidden;
            [...list.querySelectorAll(OPTION_SELECTOR)].forEach((o, i) => {
                /** @type {HTMLElement} */ (o).hidden = before.hidden[i] ?? false;
            });
            if (tagList) {
                tagList.replaceChildren(...before.tags);
                tagList.hidden = tagsHidden;
            }
            if (status) status.textContent = before.status;
            unslot();
            if (empty !== null && empty !== serverEmpty) empty.remove();
            if (serverEmpty !== null) serverEmpty.hidden = emptyWasHidden;
            handles.delete(box);
            delete box.dataset.kpComboboxAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
