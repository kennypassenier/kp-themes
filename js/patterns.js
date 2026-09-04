// The small patterns, framework-free [TH50, TH51, TH53].
//
// None of these is a component in the usual sense. They are the things
// every application rewrites badly, and they are here for the same reason
// the data-showing classes are: the fifth reimplementation of "copy this
// value" is not better than the first, it is just differently wrong.
//
//   TH53  a value with a copy button that confirms
//   TH51  a row action that happens optimistically, with an undo
//   TH50  an empty state that knows the difference between "nothing yet"
//         and "nothing matched your filter"
//
// TH52 (status parts) and TH54 (diff) are markup and CSS only — there is
// no behaviour to attach, so they live in the stylesheet and in the React
// components, and nothing here needs to know about them.

import { toast } from './overlays.js';
import { getStrings } from './strings.js';

const COPY = '[data-kp-copy]';
const UNDO = '[data-kp-undo-action]';

/** How long the undo stays offered before the action is committed. An operational knob. */
export const UNDO_MS = 6000;

/** Fired when an optimistic action commits — the undo window closed [TH26]. */
export const COMMIT_EVENT = 'kp-action-commit';

/** Fired when it is undone instead. */
export const UNDO_EVENT = 'kp-action-undo';

/**
 * Attach the patterns under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachPatterns(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(COPY)) {
        const button = /** @type {HTMLButtonElement} */ (element);
        if (button.dataset.kpCopyAttached !== undefined) continue;
        button.dataset.kpCopyAttached = '';
        const idle = button.textContent ?? '';
        const done = button.dataset.kpCopiedText ?? getStrings().copied;

        const onClick = async () => {
            const target = button.dataset.kpCopy ?? '';
            const source = target === '' ? null : root.querySelector(`#${CSS.escape(target)}`);
            const text = source?.textContent?.trim() ?? button.dataset.kpCopyValue ?? '';
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                // Refused — an insecure context, or the permission denied.
                // Saying nothing here is how a copy button becomes the
                // control people click twice and then distrust.
                button.dataset.kpCopyFailed = '';
                toast(getStrings().copyBlockedAnnouncement);
                return;
            }
            delete button.dataset.kpCopyFailed;
            // Confirmed in words on the button itself, and announced: a
            // colour change is invisible to a screen reader, and a toast
            // alone is invisible to someone looking at the button.
            button.textContent = done;
            button.dataset.kpCopied = '';
            setTimeout(() => {
                button.textContent = idle;
                delete button.dataset.kpCopied;
            }, 1500);
        };

        button.addEventListener('click', onClick);
        cleanups.push(() => {
            button.removeEventListener('click', onClick);
            delete button.dataset.kpCopyAttached;
        });
    }

    for (const element of root.querySelectorAll(UNDO)) {
        const button = /** @type {HTMLButtonElement} */ (element);
        if (button.dataset.kpUndoAttached !== undefined) continue;
        button.dataset.kpUndoAttached = '';
        const ms = Number.parseInt(button.dataset.kpUndoMs ?? '', 10) || UNDO_MS;

        const onClick = () => {
            const target = button.closest('[data-kp-undo-target]') ?? button.closest('tr') ?? button.parentElement;
            if (!(target instanceof HTMLElement)) return;

            // Optimistic: the row goes now. Waiting for the server first
            // is what makes an interface feel slow, and the undo is what
            // makes going first safe.
            target.hidden = true;
            let undone = false;

            const message = toast(button.dataset.kpUndoText ?? getStrings().deleted, { ms });
            const undo = document.createElement('button');
            undo.type = 'button';
            undo.className = 'kp-button kp-button--ghost';
            undo.textContent = getStrings().undo;
            undo.addEventListener('click', () => {
                undone = true;
                target.hidden = false;
                message.remove();
                target.dispatchEvent(new CustomEvent(UNDO_EVENT, { bubbles: true }));
            });
            message.append(undo);

            setTimeout(() => {
                if (undone) return;
                // Only now is it real. The consumer deletes here, so a
                // click that was taken back never reached the server.
                target.dispatchEvent(new CustomEvent(COMMIT_EVENT, { bubbles: true }));
            }, ms);
        };

        button.addEventListener('click', onClick);
        cleanups.push(() => {
            button.removeEventListener('click', onClick);
            delete button.dataset.kpUndoAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachPatterns());
    else attachPatterns();
}
