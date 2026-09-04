// The overlays' behaviour, framework-free [L8, TH35].
//
// Most of what is hard here, the browser now does. AR15's baseline is
// modern Chrome and Firefox only, which is what makes that affordable:
//
//   <dialog>          traps focus, closes on Escape, and returns focus to
//                     whatever opened it — all three, for free
//   popover="auto"    light-dismisses, closes on Escape, and restores
//                     focus to the invoker
//   <details>         is a keyboard-operable disclosure
//
// So this file is small on purpose. What it adds is the wiring the
// platform leaves to the author — opening a dialog from a button, roving
// tabindex on a tab list, and a toast region that announces itself — and
// nothing it adds re-implements something the browser already does
// correctly, because a hand-written focus trap is how focus traps break.

/** How long a toast stays before it removes itself. An operational knob. */
export const TOAST_MS = 5000;

/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal(), not show(): the modal form is the one that traps focus and
 * makes the rest of the page inert. Escape and focus return need no code.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachDialogs(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    for (const el of root.querySelectorAll('[data-kp-dialog]')) {
        const trigger = /** @type {HTMLElement} */ (el);
        const dialog = document.getElementById(trigger.dataset.kpDialog ?? '');
        if (!(dialog instanceof HTMLDialogElement)) continue;
        const open = () => dialog.showModal();
        trigger.addEventListener('click', open);
        cleanups.push(() => trigger.removeEventListener('click', open));
    }
    for (const el of root.querySelectorAll('[data-kp-dialog-close]')) {
        const button = /** @type {HTMLElement} */ (el);
        const close = () => button.closest('dialog')?.close();
        button.addEventListener('click', close);
        cleanups.push(() => button.removeEventListener('click', close));
    }
    return () => {
        for (const c of cleanups) c();
    };
}

/**
 * Tabs: one stop in the tab order, arrows to move between them.
 *
 * This is the ARIA authoring practice, and it is genuinely not free: a
 * tab list where every tab is a tab stop makes a keyboard user press Tab
 * seven times to leave a row of tabs.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachTabs(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[role="tablist"]')) {
        const list = /** @type {HTMLElement} */ (el);
        const tabs = [.../** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll('[role="tab"]'))];
        if (tabs.length === 0) continue;

        /** @param {number} index */
        const select = (index) => {
            tabs.forEach((tab, i) => {
                const selected = i === index;
                tab.setAttribute('aria-selected', String(selected));
                tab.tabIndex = selected ? 0 : -1;
                const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
                if (panel) panel.hidden = !selected;
            });
            // Guarded because a caller computes this index. Found by
            // JobTracker's stricter typecheck (KT4): with
            // noUncheckedIndexedAccess an out-of-range index is a type
            // error here, and in a browser it is a thrown TypeError that
            // stops the key handler.
            tabs[index]?.focus();
        };

        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            const current = tabs.indexOf(/** @type {HTMLElement} */ (document.activeElement));
            if (current === -1) return;
            const move = { ArrowRight: 1, ArrowLeft: -1, Home: -current, End: tabs.length - 1 - current }[e.key];
            if (move === undefined) return;
            e.preventDefault();
            select((current + move + tabs.length) % tabs.length);
        };

        /** @param {Event} e */
        const onClick = (e) => {
            const tab = /** @type {HTMLElement} */ (e.target).closest('[role="tab"]');
            if (tab) select(tabs.indexOf(/** @type {HTMLElement} */ (tab)));
        };

        // The initial state comes from the markup, so a page that renders
        // the second tab selected keeps it after this runs.
        const initial = Math.max(
            0,
            tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
        );
        tabs.forEach((tab, i) => {
            tab.tabIndex = i === initial ? 0 : -1;
        });

        list.addEventListener('keydown', onKey);
        list.addEventListener('click', onClick);
        cleanups.push(() => {
            list.removeEventListener('keydown', onKey);
            list.removeEventListener('click', onClick);
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert": a toast is an
 * announcement, and alert interrupts whatever a screen reader was saying.
 *
 * @param {string} text
 * @param {{ ms?: number }} [options]
 * @returns {HTMLElement} the toast, so a caller can remove it early
 */
export function toast(text, { ms = TOAST_MS } = {}) {
    let region = document.querySelector('.kp-toasts');
    if (!region) {
        region = document.createElement('div');
        region.className = 'kp-toasts';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        document.body.append(region);
    }
    const el = document.createElement('div');
    el.className = 'kp-toast';
    el.textContent = text;
    region.append(el);
    setTimeout(() => el.remove(), ms);
    return el;
}

if (typeof document !== 'undefined') {
    const start = () => {
        attachDialogs();
        attachTabs();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
}
