// Dialogs: opening at the top, the close label and the attach.
import { getStrings } from '../strings.js';
import { DIALOG_OPEN_EVENT } from './constants.js';

/**
 * Put a dialog that has just opened, and its `.kp-dialog__body`, back at
 * the top [scope-96]. A closed dialog keeps its scroll position, so a
 * long dialog scrolled and closed reopened where it was left (Kenny,
 * 2026-09-15: "Bovenaan openen"). Called after showModal()/show(), because
 * a closed dialog has no box to scroll. The one exception is focus: when
 * the element the dialog focused on opening lies below the fold, it is
 * scrolled back into view, as far as needed and no further, so focus is
 * never hidden.
 *
 * @param {HTMLDialogElement} dialog
 */
export function openAtTop(dialog) {
    const body = dialog.querySelector(':scope > .kp-dialog__body');
    for (const box of [dialog, body]) if (box) box.scrollTop = 0;
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused !== dialog && dialog.contains(focused))
        focused.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal() by default: the modal form is the one that traps focus and
 * makes the rest of the page inert. `data-kp-dialog-mode="non-modal"` on
 * the trigger opens with show() instead, for a palette-like panel that
 * must not inert the page.
 *
 * @param {ParentNode} root
 * @param {{ modal?: boolean }} [options] the default mode when a trigger says nothing
 * @returns {() => void} detach
 */
export function attachDialogs(root = document, { modal = true } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    for (const el of root.querySelectorAll('[data-kp-dialog]')) {
        const trigger = /** @type {HTMLElement} */ (el);
        if (trigger.dataset.kpDialogAttached !== undefined) continue;
        const dialog = document.getElementById(trigger.dataset.kpDialog ?? '');
        if (!(dialog instanceof HTMLDialogElement)) continue;
        trigger.dataset.kpDialogAttached = '';
        const open = () => {
            const asModal = trigger.dataset.kpDialogMode === undefined ? modal : trigger.dataset.kpDialogMode !== 'non-modal';
            if (dialog.open) return;
            if (asModal) dialog.showModal();
            else dialog.show();
            openAtTop(dialog);
            dialog.dispatchEvent(new CustomEvent(DIALOG_OPEN_EVENT, { bubbles: true, detail: { trigger, modal: asModal } }));
        };
        trigger.addEventListener('click', open);
        cleanups.push(() => {
            trigger.removeEventListener('click', open);
            delete trigger.dataset.kpDialogAttached;
        });
    }
    for (const el of root.querySelectorAll('[data-kp-dialog-close]')) {
        const button = /** @type {HTMLElement} */ (el);
        if (button.dataset.kpDialogCloseAttached !== undefined) continue;
        button.dataset.kpDialogCloseAttached = '';
        // The value, if any, becomes the dialog's returnValue — so a
        // consumer's `close` listener can tell "save" from "cancel".
        const close = () => button.closest('dialog')?.close(button.dataset.kpDialogClose || undefined);
        button.addEventListener('click', close);
        cleanups.push(() => {
            button.removeEventListener('click', close);
            delete button.dataset.kpDialogCloseAttached;
        });
    }
    return () => {
        for (const c of cleanups) c();
    };
}

/** The close label a consumer's markup can use: `data-kp-dialog-close` with the dictionary's word. */
export const closeLabel = () => getStrings().close;
