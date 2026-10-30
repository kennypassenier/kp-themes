// Attaches the motion layer to a root.
import { FOLD_SELECTOR, SIZE_SELECTOR } from './constants.js';
import { attachClose } from './close.js';
import { attachFold, easeSize } from './fold-size.js';
/** @typedef {import('./fold-size.js').SizeOptions} SizeOptions */

/* -------------------------------------------------------------- attach */

/**
 * Give every dialog its leaving motion and every box above its easing, under
 * `root` and in whatever is added to it later. A box, dialog or disclosure
 * that leaves the page is let go (its observers disconnected) a microtask
 * after it left, so a page that rebuilds itself on every navigation does not
 * keep the old boxes' watchers alive; one moved within the page stays.
 *
 * @param {ParentNode} [root]
 * @param {SizeOptions & { size?: string }} [options] `size`: more boxes to ease, as a selector, beside the package's own and `[data-kp-size-motion]` (a consumer's cards and panels, without marking each one); `arrive` and `arriveKeys` as for easeSize()
 * @returns {() => void} detach
 */
export function attachMotion(root = document, { size = '', arrive = 'all', arriveKeys = [] } = {}) {
    /** @type {Map<Element, () => void>} */
    const detaches = new Map();
    const sizeSelector = size.trim() ? `${SIZE_SELECTOR}, ${size}` : SIZE_SELECTOR;
    /** @param {Element} el @param {() => void} detach */
    const keep = (el, detach) => {
        const before = detaches.get(el);
        detaches.set(el, before ? () => (before(), detach()) : detach);
    };
    /** @param {ParentNode} scope */
    const scan = (scope) => {
        const all = (/** @type {string} */ selector) => [
            ...(scope instanceof Element && scope.matches(selector) ? [scope] : []),
            ...scope.querySelectorAll(selector),
        ];
        for (const el of all('dialog.kp-dialog, dialog.kp-palette, dialog.kp-alarm'))
            if (!el.hasAttribute('data-kp-ghost')) keep(el, attachClose(/** @type {HTMLDialogElement} */ (el)));
        for (const el of all(sizeSelector))
            if (!el.hasAttribute('data-kp-ghost')) keep(el, easeSize(/** @type {HTMLElement} */ (el), { arrive, arriveKeys }));
        for (const el of all(FOLD_SELECTOR)) if (el instanceof HTMLDetailsElement && !el.hasAttribute('data-kp-ghost')) keep(el, attachFold(el));
    };
    scan(root);
    let sweeping = false;
    const sweep = () => {
        sweeping = false;
        for (const [el, detach] of detaches)
            if (!el.isConnected) {
                detach();
                detaches.delete(el);
            }
    };
    const later = new MutationObserver((records) => {
        for (const record of records) {
            for (const node of record.addedNodes) if (node instanceof Element) scan(node);
            if (record.removedNodes.length && !sweeping) {
                sweeping = true;
                queueMicrotask(sweep);
            }
        }
    });
    later.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), { childList: true, subtree: true });
    return () => {
        later.disconnect();
        for (const one of detaches.values()) one();
        detaches.clear();
    };
}
