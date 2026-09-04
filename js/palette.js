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
//   <dialog class="kp-palette" data-kp-palette id="commands">
//     <input class="kp-palette__input" type="text" role="combobox"
//            aria-expanded="true" aria-controls="commands-list" />
//     <ul class="kp-palette__list" id="commands-list" role="listbox">
//       <li class="kp-palette__option" role="option" data-kp-option
//           data-value="new" data-kp-keys="n">Nieuw item</li>
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

import { createListbox, OPTION_SELECTOR, subsequence } from './listbox.js';

const PALETTE = '[data-kp-palette]';
const SHEET = '[data-kp-shortcuts]';
const INPUT = 'input[role="combobox"]';
const LIST = '[role="listbox"]';
const STATUS = '[role="status"]';

/** Fired on the palette when a command is chosen. A contract value [TH26]. */
export const RUN_EVENT = 'kp-palette-run';

/** @param {number} n */
const RESULTS_TEXT = (n) => (n === 0 ? 'Geen opdrachten' : n === 1 ? '1 opdracht' : `${n} opdrachten`);

/**
 * Is this keystroke the palette's? ⌘K on a Mac, Ctrl+K everywhere else.
 *
 * Checked rather than assumed: a page that binds Ctrl+K on a Mac steals
 * nothing, but a page that binds ⌘K on Windows binds nothing at all.
 *
 * @param {KeyboardEvent} event
 */
function isOpenKey(event) {
    return event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
}

/**
 * Is the event coming from somewhere that a bare `?` means a question
 * mark rather than a shortcut?
 *
 * @param {EventTarget | null} target
 */
function isTyping(target) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || ['input', 'textarea', 'select'].includes(target.tagName.toLowerCase());
}

/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachPalettes(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(PALETTE)) {
        const dialog = element;
        if (!(dialog instanceof HTMLDialogElement) || dialog.dataset.kpPaletteAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (dialog.querySelector(INPUT));
        const list = /** @type {HTMLElement | null} */ (dialog.querySelector(LIST));
        if (input === null || list === null) continue;
        dialog.dataset.kpPaletteAttached = '';

        const status = /** @type {HTMLElement | null} */ (dialog.querySelector(STATUS));

        const filter = () => {
            const query = input.value.trim();
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                // A subsequence, not a substring: "thm" should find
                // "Thema wisselen", which is what people expect from a
                // palette and what a plain `includes` refuses.
                const shown = subsequence(option.textContent ?? '', query);
                option.hidden = !shown;
                if (shown) visible += 1;
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
                dialog.close();
            },
            onDismiss: () => dialog.close(),
        });

        const onInput = () => filter();
        input.addEventListener('input', onInput);

        // Reopening with the last query still in the box is a small trap:
        // the list looks filtered for no visible reason.
        const onClose = () => {
            input.value = '';
            filter();
        };
        dialog.addEventListener('close', onClose);

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (!isOpenKey(event)) return;
            // Only the FIRST palette in the document answers the key.
            // Found by the contract suite: with a palette from each
            // channel on one page, both handlers fired and the second
            // showModal() landed on top of the first. A page has one
            // command palette; a second one is a consumer's mistake, and
            // it should not produce two stacked dialogs.
            if (document.querySelector(PALETTE) !== dialog) return;
            event.preventDefault();
            if (dialog.open) {
                dialog.close();
            } else {
                dialog.showModal();
                filter();
                input.focus();
            }
        };
        document.addEventListener('keydown', onKey);

        filter();
        cleanups.push(() => {
            listbox.destroy();
            input.removeEventListener('input', onInput);
            dialog.removeEventListener('close', onClose);
            document.removeEventListener('keydown', onKey);
            delete dialog.dataset.kpPaletteAttached;
        });
    }

    for (const element of root.querySelectorAll(SHEET)) {
        const sheet = element;
        if (!(sheet instanceof HTMLDialogElement) || sheet.dataset.kpShortcutsAttached !== undefined) continue;
        sheet.dataset.kpShortcutsAttached = '';

        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            // `?` only when nobody is typing one into a field, and never
            // with a modifier — Ctrl+? belongs to the browser.
            if (event.key !== '?' || event.ctrlKey || event.metaKey || event.altKey) return;
            if (isTyping(event.target)) return;
            if (document.querySelector(SHEET) !== sheet) return;
            event.preventDefault();
            if (sheet.open) sheet.close();
            else sheet.showModal();
        };
        document.addEventListener('keydown', onKey);
        cleanups.push(() => {
            document.removeEventListener('keydown', onKey);
            delete sheet.dataset.kpShortcutsAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachPalettes());
    else attachPalettes();
}
