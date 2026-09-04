// Command palette and shortcut sheet, framework-free [TH40, TH49].
//
// The palette is a <dialog>, which means the three hard parts are the
// browser's: focus is trapped, Escape closes, and focus returns to
// whatever was focused before. AR15's baseline is what makes that
// affordable, and a hand-written focus trap is how focus traps break.
//
// The commands are markup the consumer's server wrote, not a JavaScript
// array this module owns. That is the same choice the theme picker makes
// and for the same reason: kyu and almanac render HTML from a Rust binary
// and have no build step, so a palette that only exists after JavaScript
// runs would give them an empty box.
//
//   <dialog class="kp-palette" data-kp-palette id="commands" data-kp-hotkey="k">
//     <input class="kp-palette__input" type="text" role="combobox"
//            aria-expanded="true" aria-controls="commands-list" />
//     <ul class="kp-palette__list" id="commands-list" role="listbox">
//       <li role="presentation" class="kp-palette__group" data-kp-group>
//         <span class="kp-palette__group-label">Items</span>
//         <ul role="group" aria-label="Items">
//           <li class="kp-palette__option" role="option" data-kp-option
//               data-value="new" data-kp-keys="n">New item</li>
//         </ul>
//       </li>
//     </ul>
//     <p class="kp-palette__status" role="status" aria-live="polite"></p>
//   </dialog>
//
// Choosing one fires `kp-palette-run` on the dialog with the value in the
// detail. What that command DOES is the consumer's business — a palette
// that also owned the actions would have to know the application.
//
// The shortcut sheet (TH49) is the same dialog machinery with no input:
// `?` opens it, and it lists the keys. A palette without discoverability
// is a secret, which is why these two ship together rather than the sheet
// arriving later as a nicety.
//
// Since 3.0.0 [KT6]: the hotkey is an attribute and can be off; a
// palette opens from code, with a query pre-typed; which palette answers
// the key is the consumer's to nominate; the matcher is a choice; groups
// hide when every command in them is filtered out; `data-kp-keys` is
// finally rendered, three versions after it was documented; and the
// sheet dispatches events like everything else.

import { createListbox, OPTION_SELECTOR, subsequence } from './listbox.js';
import { getStrings } from './strings.js';

const PALETTE = '[data-kp-palette]';
const SHEET = '[data-kp-shortcuts]';
const INPUT = 'input[role="combobox"]';
const LIST = '[role="listbox"]';
const STATUS = '[role="status"]';
const GROUP = '[data-kp-group]';

/** Fired on the palette when a command is chosen. A contract value [TH26]: `{ value, option }`. */
export const RUN_EVENT = 'kp-palette-run';
/** Fired on the palette or the sheet when it opens or closes: `{ open }`. */
export const OPEN_EVENT = 'kp-palette-open';

/** @param {number} n */
const RESULTS_TEXT = (n) => {
    const s = getStrings();
    return n === 0 ? s.noCommands : n === 1 ? s.oneCommand : s.manyCommands(n);
};

/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export const MATCHERS = {
    // A subsequence, not a substring: "thm" should find "Theme", which is
    // what people expect from a palette and what a plain `includes` refuses.
    subsequence: (text, query) => subsequence(text, query),
    substring: (text, query) => text.toLowerCase().includes(query.toLowerCase()),
    prefix: (text, query) => text.toLowerCase().startsWith(query.toLowerCase()),
};

/**
 * Is this keystroke the palette's? ⌘+key on a Mac, Ctrl+key everywhere
 * else. Checked rather than assumed: a page that binds Ctrl+K on a Mac
 * steals nothing, but a page that binds ⌘K on Windows binds nothing at
 * all.
 *
 * @param {KeyboardEvent} event
 * @param {string} key
 */
function isHotkey(event, key) {
    return event.key.toLowerCase() === key.toLowerCase() && (event.metaKey || event.ctrlKey);
}

/**
 * Is the event coming from somewhere that a bare `?` means a question
 * mark rather than a shortcut?
 *
 * @param {EventTarget | null} target
 * @param {string} typingSelector
 */
function isTyping(target, typingSelector) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || target.matches(typingSelector);
}

/**
 * @typedef {object} PaletteHandle
 * @property {HTMLDialogElement} element
 * @property {(query?: string) => void} open
 * @property {() => void} close
 * @property {() => void} refresh re-filter after the consumer changed the commands
 */

/** @type {WeakMap<Element, PaletteHandle>} */
const handles = new WeakMap();
/** The handle for an attached palette or sheet. @param {Element} element */
export function palette(element) {
    return handles.get(element) ?? null;
}

/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @param {{ hotkey?: string | null, sheetKey?: string | null, match?: keyof typeof MATCHERS | Matcher, clearOnClose?: boolean, closeOnRun?: boolean, typingSelector?: string }} [options]
 *   Defaults; per element: `data-kp-hotkey` (a letter, or "none"), `data-kp-primary` (this one answers the key when there are several), `data-kp-match`, `data-kp-clear-on-close="false"`, `data-kp-close-on-run="false"`.
 * @returns {(() => void) & { handles: PaletteHandle[] }} detach
 */
export function attachPalettes(
    root = document,
    {
        hotkey = 'k',
        sheetKey = '?',
        match = 'subsequence',
        clearOnClose = true,
        closeOnRun = true,
        typingSelector = 'input, textarea, select, [role="textbox"]',
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {PaletteHandle[]} */
    const created = [];

    /** The one that answers the key: the nominated one, else the first in the document. @param {string} selector @param {Element} me */
    const answers = (selector, me) => {
        const nominated = document.querySelector(`${selector}[data-kp-primary]`);
        return (nominated ?? document.querySelector(selector)) === me;
    };

    for (const element of root.querySelectorAll(PALETTE)) {
        const dialog = element;
        if (!(dialog instanceof HTMLDialogElement) || dialog.dataset.kpPaletteAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (dialog.querySelector(INPUT));
        const list = /** @type {HTMLElement | null} */ (dialog.querySelector(LIST));
        if (input === null || list === null) continue;
        dialog.dataset.kpPaletteAttached = '';

        const status = /** @type {HTMLElement | null} */ (dialog.querySelector(STATUS));
        const key = dialog.dataset.kpHotkey === 'none' ? null : (dialog.dataset.kpHotkey ?? hotkey);
        const clears = dialog.dataset.kpClearOnClose === undefined ? clearOnClose : dialog.dataset.kpClearOnClose !== 'false';
        const closes = dialog.dataset.kpCloseOnRun === undefined ? closeOnRun : dialog.dataset.kpCloseOnRun !== 'false';
        const matcher = typeof match === 'function' ? match : (MATCHERS[dialog.dataset.kpMatch ?? match] ?? MATCHERS.subsequence);

        // data-kp-keys, rendered: the documented attribute nothing read.
        for (const element of list.querySelectorAll(`${OPTION_SELECTOR}[data-kp-keys]`)) {
            const option = /** @type {HTMLElement} */ (element);
            if (option.querySelector('kbd') !== null) continue;
            const kbd = document.createElement('kbd');
            kbd.className = 'kp-palette__keys';
            kbd.textContent = option.dataset.kpKeys ?? '';
            kbd.dataset.kpGenerated = '';
            option.append(kbd);
        }

        const filter = () => {
            const query = input.value.trim();
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                // Match on the label, not on the kbd hint.
                const text = [...option.childNodes]
                    .filter((n) => !(n instanceof HTMLElement && n.tagName === 'KBD'))
                    .map((n) => n.textContent ?? '')
                    .join('');
                const shown = matcher(text, query);
                option.hidden = !shown;
                if (shown) visible += 1;
            }
            // A group whose commands all vanished vanishes with them.
            for (const element of list.querySelectorAll(GROUP)) {
                const group = /** @type {HTMLElement} */ (element);
                group.hidden = group.querySelector(`${OPTION_SELECTOR}:not([hidden])`) === null;
            }
            listbox.refresh();
            if (visible > 0) listbox.highlight(0);
            if (status !== null) status.textContent = RESULTS_TEXT(visible);
        };

        const listbox = createListbox({
            input,
            list,
            onChoose: (_, option) => {
                const value = option.dataset.value ?? (option.textContent ?? '').trim();
                dialog.dispatchEvent(new CustomEvent(RUN_EVENT, { bubbles: true, detail: { value, option } }));
                if (closes) dialog.close();
            },
            onDismiss: () => dialog.close(),
        });

        /** @param {string} [query] */
        const openWith = (query) => {
            if (dialog.open) return;
            if (query !== undefined) input.value = query;
            dialog.showModal();
            filter();
            input.focus();
            dialog.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: true } }));
        };

        const onInput = () => filter();
        input.addEventListener('input', onInput);

        // Reopening with the last query still in the box is a small trap:
        // the list looks filtered for no visible reason.
        const onClose = () => {
            if (clears) {
                input.value = '';
                filter();
            }
            dialog.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: false } }));
        };
        dialog.addEventListener('close', onClose);

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (key === null || !isHotkey(event, key)) return;
            // Only ONE palette answers the key: the nominated one, else
            // the first in the document. Found by the contract suite: with
            // a palette from each channel on one page, both handlers fired
            // and the second showModal() landed on top of the first.
            if (!answers(PALETTE, dialog)) return;
            event.preventDefault();
            if (dialog.open) dialog.close();
            else openWith();
        };
        if (key !== null) document.addEventListener('keydown', onKey);

        filter();
        /** @type {PaletteHandle} */
        const handle = { element: dialog, open: openWith, close: () => dialog.close(), refresh: filter };
        handles.set(dialog, handle);
        created.push(handle);
        cleanups.push(() => {
            listbox.destroy();
            input.removeEventListener('input', onInput);
            dialog.removeEventListener('close', onClose);
            document.removeEventListener('keydown', onKey);
            for (const el of list.querySelectorAll(OPTION_SELECTOR)) /** @type {HTMLElement} */ (el).hidden = false;
            for (const el of list.querySelectorAll(GROUP)) /** @type {HTMLElement} */ (el).hidden = false;
            for (const el of list.querySelectorAll('kbd[data-kp-generated]')) el.remove();
            if (dialog.open) dialog.close();
            handles.delete(dialog);
            delete dialog.dataset.kpPaletteAttached;
        });
    }

    for (const element of root.querySelectorAll(SHEET)) {
        const sheet = element;
        if (!(sheet instanceof HTMLDialogElement) || sheet.dataset.kpShortcutsAttached !== undefined) continue;
        sheet.dataset.kpShortcutsAttached = '';
        const key = sheet.dataset.kpHotkey === 'none' ? null : (sheet.dataset.kpHotkey ?? sheetKey);

        const openSheet = () => {
            if (sheet.open) return;
            sheet.showModal();
            sheet.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: true } }));
        };
        const onClose = () => sheet.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: false } }));
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            // `?` only when nobody is typing one into a field, and never
            // with a modifier — Ctrl+? belongs to the browser.
            if (key === null || event.key !== key || event.ctrlKey || event.metaKey || event.altKey) return;
            if (isTyping(event.target, typingSelector)) return;
            if (!answers(SHEET, sheet)) return;
            event.preventDefault();
            if (sheet.open) sheet.close();
            else openSheet();
        };
        if (key !== null) document.addEventListener('keydown', onKey);
        sheet.addEventListener('close', onClose);
        /** @type {PaletteHandle} */
        const handle = { element: sheet, open: openSheet, close: () => sheet.close(), refresh: () => {} };
        handles.set(sheet, handle);
        created.push(handle);
        cleanups.push(() => {
            document.removeEventListener('keydown', onKey);
            sheet.removeEventListener('close', onClose);
            if (sheet.open) sheet.close();
            handles.delete(sheet);
            delete sheet.dataset.kpShortcutsAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
