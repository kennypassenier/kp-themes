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
//
// Since 3.0.0 [KT6]: every attach is idempotent (the first version of
// this file double-bound on a second call, alone among the modules),
// every state change dispatches an event with a detail, every behaviour
// a consumer might not want is an option or a data-attribute, the tab
// selection is readable and settable from outside, and detach puts back
// what attach changed.

import { getStrings } from './strings.js';

/** How long a toast stays before it removes itself. An operational knob; per toast as `ms`. */
export const TOAST_MS = 5000;

/** Dispatched on the dialog, bubbling, when a wired trigger opened it: `{ trigger, modal }`. */
export const DIALOG_OPEN_EVENT = 'kp-dialog-open';
/** Dispatched on a tab list, bubbling, when the selected tab changed: `{ index, tab, panel, previous }`. */
export const TAB_CHANGE_EVENT = 'kp-tab-change';
/** Dispatched on the toast region when a toast was shown / removed: `{ toast, text }`. */
export const TOAST_SHOW_EVENT = 'kp-toast-show';
export const TOAST_HIDE_EVENT = 'kp-toast-hide';

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

/**
 * Select a tab in an attached tab list from outside — for a "next" button,
 * a URL hash, or a restored view.
 *
 * @param {Element} list the `[role="tablist"]`
 * @param {number | string} which an index, or a tab's id
 */
export function selectTab(list, which) {
    const handle = handles.get(list);
    if (handle === undefined) return;
    const tabs = handle.tabs();
    const index = typeof which === 'number' ? which : tabs.findIndex((t) => t.id === which);
    if (index >= 0 && index < tabs.length) handle.select(index, { focus: false });
}

/** @type {WeakMap<Element, { tabs: () => HTMLElement[], select: (index: number, options?: { focus?: boolean }) => void }>} */
const handles = new WeakMap();

/**
 * Tabs: one stop in the tab order, arrows to move between them.
 *
 * This is the ARIA authoring practice, and it is genuinely not free: a
 * tab list where every tab is a tab stop makes a keyboard user press Tab
 * seven times to leave a row of tabs.
 *
 * Options, each also readable from the list's own attributes so a
 * server-written page needs no JavaScript to set them:
 *   - `aria-orientation="vertical"` → Up/Down move instead of Left/Right
 *   - `data-kp-activation="manual"` → arrows move focus only; Enter or
 *     Space selects. The other half of the ARIA practice, for a panel
 *     that is expensive to show.
 *   - `data-kp-loop="false"` → no wrap-around at the ends
 *
 * @param {ParentNode} root
 * @param {{ activation?: 'automatic' | 'manual', loop?: boolean }} [options] defaults for lists that say nothing
 * @returns {() => void} detach
 */
export function attachTabs(root = document, { activation = 'automatic', loop = true } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[role="tablist"]')) {
        const list = /** @type {HTMLElement} */ (el);
        if (list.dataset.kpTabsAttached !== undefined) continue;
        const tabs = () => [.../** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll('[role="tab"]'))];
        if (tabs().length === 0) continue;
        list.dataset.kpTabsAttached = '';

        const manual = (list.dataset.kpActivation ?? activation) === 'manual';
        const wraps = list.dataset.kpLoop === undefined ? loop : list.dataset.kpLoop !== 'false';
        const vertical = list.getAttribute('aria-orientation') === 'vertical';

        /** What attach changed, so detach can put it back. */
        const before = tabs().map((tab) => ({
            tab,
            tabIndex: tab.getAttribute('tabindex'),
            selected: tab.getAttribute('aria-selected'),
            panel: document.getElementById(tab.getAttribute('aria-controls') ?? ''),
            hidden: document.getElementById(tab.getAttribute('aria-controls') ?? '')?.hidden ?? false,
        }));

        /** @param {number} index @param {{ focus?: boolean }} [options] */
        const select = (index, { focus = true } = {}) => {
            const all = tabs();
            const previous = all.findIndex((t) => t.getAttribute('aria-selected') === 'true');
            all.forEach((tab, i) => {
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
            if (focus) all[index]?.focus();
            if (previous !== index) {
                const tab = all[index];
                list.dispatchEvent(
                    new CustomEvent(TAB_CHANGE_EVENT, {
                        bubbles: true,
                        detail: { index, tab, panel: document.getElementById(tab?.getAttribute('aria-controls') ?? ''), previous },
                    }),
                );
            }
        };

        /** Manual activation moves focus without selecting. @param {number} index */
        const roam = (index) => {
            const all = tabs();
            all.forEach((tab, i) => {
                tab.tabIndex = i === index ? 0 : -1;
            });
            all[index]?.focus();
        };

        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            const all = tabs();
            const current = all.indexOf(/** @type {HTMLElement} */ (document.activeElement));
            if (current === -1) return;
            const next = vertical ? 'ArrowDown' : 'ArrowRight';
            const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
            if (manual && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                select(current);
                return;
            }
            const move = { [next]: 1, [prev]: -1, Home: -current, End: all.length - 1 - current }[e.key];
            if (move === undefined) return;
            e.preventDefault();
            let target = current + move;
            if (wraps) target = (target + all.length) % all.length;
            else target = Math.max(0, Math.min(all.length - 1, target));
            if (manual) roam(target);
            else select(target);
        };

        /** @param {Event} e */
        const onClick = (e) => {
            const tab = /** @type {HTMLElement} */ (e.target).closest('[role="tab"]');
            if (tab) select(tabs().indexOf(/** @type {HTMLElement} */ (tab)));
        };

        // The initial state comes from the markup, so a page that renders
        // the second tab selected keeps it after this runs.
        const initial = Math.max(
            0,
            tabs().findIndex((t) => t.getAttribute('aria-selected') === 'true'),
        );
        tabs().forEach((tab, i) => {
            tab.tabIndex = i === initial ? 0 : -1;
        });

        list.addEventListener('keydown', onKey);
        list.addEventListener('click', onClick);
        handles.set(list, { tabs, select });
        cleanups.push(() => {
            list.removeEventListener('keydown', onKey);
            list.removeEventListener('click', onClick);
            handles.delete(list);
            delete list.dataset.kpTabsAttached;
            for (const b of before) {
                if (b.tabIndex === null) b.tab.removeAttribute('tabindex');
                else b.tab.setAttribute('tabindex', b.tabIndex);
                if (b.selected === null) b.tab.removeAttribute('aria-selected');
                else b.tab.setAttribute('aria-selected', b.selected);
                if (b.panel) b.panel.hidden = b.hidden;
            }
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

/**
 * The page's toast region, created on first use.
 *
 * @param {{ region?: HTMLElement | null, role?: string, live?: 'polite' | 'assertive' | 'off', className?: string }} [options]
 * @returns {HTMLElement}
 */
export function toastRegion({ region = null, role = 'status', live = 'polite', className = 'kp-toasts' } = {}) {
    if (region) return region;
    let found = /** @type {HTMLElement | null} */ (document.querySelector(`.${className.split(/\s+/)[0]}`));
    if (!found) {
        found = document.createElement('div');
        found.className = className;
        found.setAttribute('role', role);
        found.setAttribute('aria-live', live);
        document.body.append(found);
    }
    return found;
}

/**
 * Show a toast in the page's toast region, creating the region if it is
 * not there. role="status" rather than role="alert" by default: a toast
 * is an announcement, and alert interrupts whatever a screen reader was
 * saying. An error that must interrupt passes `live: 'assertive'` on its
 * own toast, which gets its own live region so the politeness is per
 * message rather than per page.
 *
 * @param {string | Node} content text, or a node the consumer built
 * @param {{ ms?: number, region?: HTMLElement | null, live?: 'polite' | 'assertive', className?: string, action?: { label: string, onClick: () => void }, max?: number }} [options]
 *   ms: 0 keeps the toast until dismissed; max: drop the oldest beyond this many
 * @returns {HTMLElement & { dismiss: () => void }} the toast, so a caller can remove it early
 */
export function toast(content, { ms = TOAST_MS, region = null, live, className = 'kp-toast', action, max } = {}) {
    const host =
        live === 'assertive'
            ? toastRegion({ role: 'alert', live: 'assertive', className: 'kp-toasts kp-toasts--assertive' })
            : toastRegion({ region });
    const el = /** @type {HTMLElement & { dismiss: () => void }} */ (/** @type {unknown} */ (document.createElement('div')));
    el.className = className;
    if (typeof content === 'string') el.textContent = content;
    else el.append(content);
    if (action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--ghost';
        button.textContent = action.label;
        button.addEventListener('click', action.onClick);
        el.append(button);
    }
    let timer = 0;
    el.dismiss = () => {
        clearTimeout(timer);
        if (!el.isConnected) return;
        el.remove();
        host.dispatchEvent(new CustomEvent(TOAST_HIDE_EVENT, { bubbles: true, detail: { toast: el } }));
    };
    host.append(el);
    if (max !== undefined)
        while (host.children.length > max) /** @type {HTMLElement & { dismiss?: () => void }} */ (host.firstElementChild)?.dismiss?.();
    host.dispatchEvent(
        new CustomEvent(TOAST_SHOW_EVENT, { bubbles: true, detail: { toast: el, text: typeof content === 'string' ? content : el.textContent } }),
    );
    if (ms > 0) timer = window.setTimeout(el.dismiss, ms);
    return el;
}

/** The close label a consumer's markup can use: `data-kp-dialog-close` with the dictionary's word. */
export const closeLabel = () => getStrings().close;
