// Skip links: jump past the navigation to the content.

/**
 * Move focus to the target of a skip link, adding `tabindex="-1"` if the
 * target cannot take focus on its own [KT6].
 *
 * JobTracker found the half a skip link needs and nothing here provided:
 * without a focusable target the browser scrolls and the next Tab goes
 * back into the menu, so the link has done nothing for the person it
 * exists for. Returns whether a target was found and focused.
 *
 * @param {string} href `#main`, or any same-page hash
 * @param {Document | Element} [root]
 * @returns {boolean}
 */
export function skipTo(href, root = document) {
    const id = href.startsWith('#') ? href.slice(1) : href;
    if (id === '') return false;
    const target = /** @type {HTMLElement | null} */ (root.querySelector(`#${CSS.escape(id)}`));
    if (target === null) return false;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
    return true;
}
/**
 * Make every `.kp-skip-link` (or `[data-kp-skip]`) move focus, not only
 * the scroll position.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachSkipLinks(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    for (const el of root.querySelectorAll('.kp-skip-link, [data-kp-skip]')) {
        const link = /** @type {HTMLAnchorElement} */ (el);
        if (link.dataset.kpSkipAttached !== undefined) continue;
        link.dataset.kpSkipAttached = '';
        /** @param {Event} event */
        const onClick = (event) => {
            if (skipTo(link.getAttribute('href') ?? '')) event.preventDefault();
        };
        link.addEventListener('click', onClick);
        cleanups.push(() => {
            link.removeEventListener('click', onClick);
            delete link.dataset.kpSkipAttached;
        });
    }
    return () => {
        for (const c of cleanups) c();
    };
}
