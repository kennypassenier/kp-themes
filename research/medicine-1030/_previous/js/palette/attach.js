// Attaches the command palettes of a page.
import { createListbox, OPTION_SELECTOR } from '../listbox.js';
import { getStrings } from '../strings.js';
import { watchOptions } from '../live-options.js';
import { handles } from './api.js';
import { GROUP, INPUT, KEYS_SLOT, LIST, OPENER, OPEN_EVENT, PALETTE, RESULTS_TEXT, RUN_EVENT, SHEET, STATUS } from './constants.js';
import { createIntentFilter } from './intent-filter.js';
import { MATCHERS, isHotkey, isMac, isTyping } from './keys.js';
import { closeOnOutsidePress, openerFor } from './outside.js';
/** @typedef {import('./types.js').Matcher} Matcher */
/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */

/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @param {{ hotkey?: string | null, sheetKey?: string | null, match?: keyof typeof MATCHERS | Matcher, clearOnClose?: boolean, closeOnRun?: boolean, typingSelector?: string }} [options]
 *   Defaults; per element: `data-kp-hotkey` (a letter, or "none"), `data-kp-primary` (this one answers the key when there are several), `data-kp-match` (`intent` by default: words in any order, js/intent.js; or `substring`, `subsequence`, `prefix`), `data-kp-clear-on-close="false"`, `data-kp-close-on-run="false"`.
 * @returns {(() => void) & { handles: PaletteHandle[] }} detach
 */
export function attachPalettes(
    root = document,
    {
        hotkey = 'k',
        sheetKey = '?',
        match = 'intent',
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
        // `data-kp-match` is read again when it changes [live-options-1019]: the matcher and the intent filter are chosen by
        // `chooseMatcher()` and swapped by the watcher below.
        /** @type {Matcher} */
        let matcher = MATCHERS.substring;
        /** @type {ReturnType<typeof createIntentFilter> | null} */
        let intent = null;
        const chooseMatcher = () => {
            matcher = typeof match === 'function' ? match : (MATCHERS[dialog.dataset.kpMatch ?? match] ?? MATCHERS.substring);
            // Words in any order is the default [kpadopt6-ops]: the palette ranks, marks and caps itself.
            intent = typeof match !== 'function' && (dialog.dataset.kpMatch ?? match) === 'intent' ? createIntentFilter(dialog, list, status) : null;
        };
        chooseMatcher();
        /** The last state the page set, handed on when the matcher is swapped. @type {{ state: 'ready' | 'loading' | 'error', options?: { message?: string } } | null} */
        let lastSet = null;

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
            if (intent !== null) {
                const shown = intent.run(query);
                listbox.refresh();
                if (shown > 0) listbox.highlight(0);
                return;
            }
            let visible = 0;
            for (const element of list.querySelectorAll(OPTION_SELECTOR)) {
                const option = /** @type {HTMLElement} */ (element);
                // Match on the label, not on the kbd hint.
                const text = [...option.childNodes]
                    .filter((n) => !(n instanceof HTMLElement && n.tagName === 'KBD'))
                    .map((n) => n.textContent ?? '')
                    .join('');
                // The markup's own indentation is not part of the name: a start of the name starts at its first letter.
                const shown = matcher(text.trim(), query);
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

        // The click a choice rides on, while it is being dispatched: a link
        // chosen by a click is followed by the browser, one chosen by Enter
        // is clicked here so the browser follows it the same way — target,
        // rel and a router's own click handler included.
        /** @type {MouseEvent | null} */
        let clicking = null;
        /** @param {MouseEvent} event */
        const onClickStart = (event) => {
            clicking = event;
        };
        const onClickEnd = () => {
            clicking = null;
        };
        list.addEventListener('click', onClickStart, true);

        const listbox = createListbox({
            input,
            list,
            onChoose: (_, option) => {
                const link = option instanceof HTMLAnchorElement && option.hasAttribute('href') ? option : null;
                if (link !== null && clicking === null) {
                    // Comes straight back through the listbox as a click.
                    link.click();
                    return;
                }
                const value = option.dataset.value ?? (option.textContent ?? '').trim();
                const run = new CustomEvent(RUN_EVENT, { bubbles: true, cancelable: true, detail: { value, option, href: link?.href ?? null } });
                dialog.dispatchEvent(run);
                if (!run.defaultPrevented) intent?.remember(value);
                if (run.defaultPrevented && link !== null) clicking?.preventDefault();
                if (closes) dialog.close();
            },
            onDismiss: () => dialog.close(),
        });
        list.addEventListener('click', onClickEnd);

        // A link option is pointed at, never tabbed to [scope-48].
        /** @type {HTMLElement[]} */
        const untabbed = [];
        for (const element of list.querySelectorAll(`a${OPTION_SELECTOR}[href]:not([tabindex])`)) {
            element.setAttribute('tabindex', '-1');
            untabbed.push(/** @type {HTMLElement} */ (element));
        }

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
            // The close event arrives a task later: a palette opened again with a query in between keeps that query.
            if (clears && !dialog.open) {
                input.value = '';
                filter();
            }
            dialog.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: false } }));
        };
        dialog.addEventListener('close', onClose);
        const releaseOutside = closeOnOutsidePress(dialog);

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

        /** @param {Event} event */
        const onOpener = (event) => {
            if (!openerFor(event, dialog, answers(PALETTE, dialog))) return;
            openWith();
        };
        document.addEventListener('click', onOpener);

        // The triggers that open this palette say so, and print its key
        // [scope-48]. Only what the markup left out is written, and only
        // that is taken back.
        /** @type {(() => void)[]} */
        const unstamp = [];
        const mac = isMac();
        for (const opener of document.querySelectorAll(OPENER)) {
            const name = opener.getAttribute('data-kp-palette-open') ?? '';
            if (name === '' ? !answers(PALETTE, dialog) : name !== dialog.id) continue;
            /** @param {string} attribute @param {string} value */
            const stamp = (attribute, value) => {
                if (opener.hasAttribute(attribute)) return;
                opener.setAttribute(attribute, value);
                unstamp.push(() => opener.removeAttribute(attribute));
            };
            stamp('aria-haspopup', 'dialog');
            if (key === null) continue;
            stamp('aria-keyshortcuts', `${mac ? 'Meta' : 'Control'}+${key.toUpperCase()}`);
            for (const slot of opener.querySelectorAll(KEYS_SLOT)) {
                if ((slot.textContent ?? '').trim() !== '') continue;
                slot.textContent = getStrings().paletteHotkey(key, mac);
                unstamp.push(() => (slot.textContent = ''));
            }
        }

        filter();
        const stopMatch = watchOptions(dialog, ['data-kp-match'], () => {
            if (typeof match === 'function') return;
            // The old filter gives the commands back (order, marks, hidden), then the new one draws the list.
            const carried = lastSet;
            intent?.destroy();
            chooseMatcher();
            if (intent !== null && carried !== null) intent.setState(carried.state, carried.options ?? {});
            filter();
        });
        /** @type {PaletteHandle} */
        const handle = {
            element: dialog,
            open: openWith,
            close: () => dialog.close(),
            refresh: filter,
            setState: (state, options) => {
                lastSet = { state, ...(options ? { options } : {}) };
                intent?.setState(state, options);
                filter();
            },
        };
        handles.set(dialog, handle);
        created.push(handle);
        cleanups.push(() => {
            stopMatch();
            intent?.destroy();
            listbox.destroy();
            list.removeEventListener('click', onClickStart, true);
            list.removeEventListener('click', onClickEnd);
            for (const el of untabbed) el.removeAttribute('tabindex');
            for (const undo of unstamp) undo();
            input.removeEventListener('input', onInput);
            dialog.removeEventListener('close', onClose);
            releaseOutside();
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('click', onOpener);
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
        /** @param {Event} event */
        const onOpener = (event) => {
            if (openerFor(event, sheet, false)) openSheet();
        };
        document.addEventListener('click', onOpener);
        sheet.addEventListener('close', onClose);
        // A press outside the sheet closes it, as it does the palette [scope-80].
        const releaseOutside = closeOnOutsidePress(sheet);
        /** @type {PaletteHandle} */
        const handle = { element: sheet, open: openSheet, close: () => sheet.close(), refresh: () => {}, setState: () => {} };
        handles.set(sheet, handle);
        created.push(handle);
        cleanups.push(() => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('click', onOpener);
            sheet.removeEventListener('close', onClose);
            releaseOutside();
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
