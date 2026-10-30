// Attaches the copy buttons, the secret blocks and the other patterns of a page.
import { toast } from '../overlays.js';
import { getStrings } from '../strings.js';
import { CLEAR_AFTER_MS, COMMIT_EVENT, COPIED_MS, COPY, COPY_EVENT, COPY_FAILED_EVENT, UNDO, UNDO_EVENT, UNDO_MS } from './constants.js';
import { attachSecrets } from './secrets.js';
/** @typedef {import('./types.js').ActionDetail} ActionDetail */
/** @typedef {import('./types.js').SecretLoad} SecretLoad */

/**
 * Attach the patterns under `root`.
 *
 * `secretLoad(field, purpose)` reads a secret field's value when it is shown or copied (purpose `reveal` or `copy`), so the
 * value is in the page only while it is shown; without it a field asks through `kp-secret-request`, and last reads its
 * own `data-kp-secret-value`.
 *
 * `clearAfterMs` is how long after a Copy the clipboard is emptied again (default 30 000 ms; 0 or false: never), for every
 * secret field without its own `data-kp-secret-clear`.
 *
 * @param {ParentNode} root
 * @param {{ copiedMs?: number, undoMs?: number, clearAfterMs?: number | false, toastOnCopyFailure?: boolean, undoClassName?: string, secretLoad?: SecretLoad }} [options]
 * @returns {() => void} detach
 */
export function attachPatterns(
    root = document,
    {
        copiedMs = COPIED_MS,
        undoMs = UNDO_MS,
        clearAfterMs = CLEAR_AFTER_MS,
        toastOnCopyFailure = true,
        undoClassName = 'kp-button kp-button--ghost',
        secretLoad,
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    cleanups.push(attachSecrets(root, { copiedMs, clearAfterMs, ...(secretLoad ? { load: secretLoad } : {}) }));

    for (const element of root.querySelectorAll(COPY)) {
        const button = /** @type {HTMLButtonElement} */ (element);
        if (button.dataset.kpCopyAttached !== undefined) continue;
        button.dataset.kpCopyAttached = '';
        const idle = button.textContent ?? '';
        const done = button.dataset.kpCopiedText ?? getStrings().copied;
        const revertMs = Number.parseInt(button.dataset.kpCopiedMs ?? '', 10) || copiedMs;
        let revert = 0;

        const onClick = async () => {
            const target = button.dataset.kpCopy ?? '';
            // By id on the document, not on root: the value a button copies
            // may sit outside the subtree this call attached.
            const source = target === '' ? null : document.getElementById(target);
            const text = source?.textContent?.trim() ?? button.dataset.kpCopyValue ?? '';
            try {
                await navigator.clipboard.writeText(text);
            } catch (error) {
                // Refused — an insecure context, or the permission denied.
                // Saying nothing here is how a copy button becomes the
                // control people click twice and then distrust.
                button.dataset.kpCopyFailed = '';
                if (toastOnCopyFailure && button.dataset.kpCopyToast !== 'false') toast(getStrings().copyBlockedAnnouncement);
                button.dispatchEvent(new CustomEvent(COPY_FAILED_EVENT, { bubbles: true, detail: { text, error } }));
                return;
            }
            delete button.dataset.kpCopyFailed;
            // Confirmed in words on the button itself, and announced: a
            // colour change is invisible to a screen reader, and a toast
            // alone is invisible to someone looking at the button.
            button.textContent = done;
            button.dataset.kpCopied = '';
            button.dispatchEvent(new CustomEvent(COPY_EVENT, { bubbles: true, detail: { text } }));
            clearTimeout(revert);
            revert = window.setTimeout(() => {
                button.textContent = idle;
                delete button.dataset.kpCopied;
            }, revertMs);
        };

        button.addEventListener('click', onClick);
        cleanups.push(() => {
            button.removeEventListener('click', onClick);
            clearTimeout(revert);
            button.textContent = idle;
            delete button.dataset.kpCopied;
            delete button.dataset.kpCopyFailed;
            delete button.dataset.kpCopyAttached;
        });
    }

    for (const element of root.querySelectorAll(UNDO)) {
        const button = /** @type {HTMLButtonElement} */ (element);
        if (button.dataset.kpUndoAttached !== undefined) continue;
        button.dataset.kpUndoAttached = '';
        const ms = Number.parseInt(button.dataset.kpUndoMs ?? '', 10) || undoMs;
        /** Everything still inside its undo window, so detach can settle it. */
        /** @type {Set<() => void>} */
        const inFlight = new Set();

        const onClick = () => {
            // What goes: the element the consumer named by selector, the
            // nearest marked ancestor, the row, or the parent.
            const selector = button.dataset.kpUndoSelector;
            const target =
                (selector ? button.closest(selector) : null) ??
                button.closest('[data-kp-undo-target]') ??
                button.closest('tr') ??
                button.parentElement;
            if (!(target instanceof HTMLElement)) return;
            const key = target.dataset.kpRowKey ?? target.dataset.kpKey ?? (target.id || null);

            // Optimistic: the row goes now. Waiting for the server first
            // is what makes an interface feel slow, and the undo is what
            // makes going first safe.
            target.hidden = true;
            target.dataset.kpUndoPending = '';
            let settled = false;

            const restore = () => {
                target.hidden = false;
                delete target.dataset.kpUndoPending;
            };
            /** @type {ActionDetail} */
            const detail = { target, button, key, restore };

            let timer = 0;
            const message = toast(button.dataset.kpUndoText ?? getStrings().deleted, {
                ms: Number.parseInt(button.dataset.kpUndoToastMs ?? '', 10) || ms,
                action: {
                    label: button.dataset.kpUndoLabel ?? getStrings().undo,
                    onClick: () => {
                        if (settled) return;
                        settled = true;
                        inFlight.delete(cancel);
                        clearTimeout(timer);
                        restore();
                        message.dismiss();
                        target.dispatchEvent(new CustomEvent(UNDO_EVENT, { bubbles: true, detail }));
                    },
                },
            });
            for (const b of message.querySelectorAll('button')) b.className = undoClassName;

            timer = window.setTimeout(() => {
                if (settled) return;
                settled = true;
                inFlight.delete(cancel);
                delete target.dataset.kpUndoPending;
                // Only now is it real. The consumer deletes here, so a
                // click that was taken back never reached the server —
                // and restore() is in the detail for the delete the
                // server refuses.
                target.dispatchEvent(new CustomEvent(COMMIT_EVENT, { bubbles: true, detail }));
            }, ms);
            const cancel = () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                restore();
                message.dismiss();
            };
            inFlight.add(cancel);
        };

        button.addEventListener('click', onClick);
        cleanups.push(() => {
            button.removeEventListener('click', onClick);
            // Nothing commits after detach: a row still in its window
            // comes back, and its toast goes.
            for (const cancel of inFlight) cancel();
            delete button.dataset.kpUndoAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
