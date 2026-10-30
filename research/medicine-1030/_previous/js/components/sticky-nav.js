// Sticky navigation: compacts the nav once the page scrolls.

/** Fired on the wrapper when a sticky bar turns compact or back: `{ compact }`. */
export const NAV_COMPACT_EVENT = 'kp-nav-compact';
/** The mark the React NavBar puts on a sticky wrapper it wires itself [AR29]. */
export const NAV_STICKY_OWNED = '[data-kp-nav-sticky-owner]';
/**
 * The box that scrolls `el`: its nearest ancestor whose block overflow
 * scrolls, or the document's root element.
 *
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function scrollerOf(el) {
    const doc = el.ownerDocument;
    for (let at = el.parentElement; at !== null && at !== doc.body && at !== doc.documentElement; at = at.parentElement) {
        const overflow = getComputedStyle(at).overflowY;
        if (overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay') return at;
    }
    return /** @type {HTMLElement} */ (doc.scrollingElement ?? doc.documentElement);
}
/**
 * Wire every sticky nav bar under `root` [scope-48 wave 2].
 *
 * Opt-in by the modifier `.kp-nav-wrap--sticky`; the CSS makes the bar
 * stick, this decides when it is compact and tells the scrolling box how
 * tall it is. Two things, both undone by `detach`:
 *
 * - `data-kp-nav-compact` on the wrapper once the box has scrolled further
 *   than `data-kp-nav-sticky-after` (px, and never less than the bar's own
 *   height at rest, which is the default), and off again once it is back
 *   within that distance less the bar's height. The gap between the two is not decoration: shrinking the
 *   bar moves the content under it up, the browser's scroll anchoring moves
 *   the scroll position with it, and without a gap at least that wide the
 *   bar would flip between its two heights at the threshold.
 * - `--kp-nav-sticky-height` and `data-kp-nav-sticky-root` on the scrolling
 *   box (the document's root, or the nearest ancestor that scrolls), which
 *   the box's `scroll-padding-block-start` reads, so an anchor or a focused
 *   element lands below the bar. A page's own `--kp-scroll-offset` wins.
 *
 * @param {ParentNode} root
 * @param {{ ownedBy?: string, after?: number }} [options]
 * @returns {() => void} detach
 */
export function attachStickyNavs(root = document, { ownedBy = NAV_STICKY_OWNED, after } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {HTMLElement[]} */
    const found = [];
    if (root instanceof HTMLElement && root.matches('.kp-nav-wrap--sticky')) found.push(root);
    for (const el of root.querySelectorAll('.kp-nav-wrap--sticky')) found.push(/** @type {HTMLElement} */ (el));

    for (const wrap of found) {
        if (ownedBy !== '' && wrap.matches(ownedBy)) continue;
        cleanups.push(stickyNav(wrap, after));
    }

    return () => {
        for (const c of cleanups) c();
    };
}
/**
 * One sticky bar; the React NavBar calls this for the wrapper it renders.
 *
 * @param {HTMLElement} wrap the `.kp-nav-wrap--sticky` element
 * @param {number} [after] px; overrides `data-kp-nav-sticky-after`
 * @returns {() => void} detach
 */
export function stickyNav(wrap, after) {
    if (wrap.dataset.kpNavStickyAttached !== undefined) return () => {};
    const doc = wrap.ownerDocument;
    const view = doc.defaultView;
    if (!view) return () => {};
    wrap.dataset.kpNavStickyAttached = '';

    const scroller = scrollerOf(wrap);
    const isDocument = scroller === doc.scrollingElement || scroller === doc.documentElement;
    const target = isDocument ? view : scroller;
    const offset = () => (isDocument ? view.scrollY : scroller.scrollTop);
    scroller.setAttribute('data-kp-nav-sticky-root', '');

    let compact = wrap.hasAttribute('data-kp-nav-compact');
    let restHeight = wrap.getBoundingClientRect().height;
    let queued = false;

    const measure = () => {
        const height = wrap.getBoundingClientRect().height;
        if (!compact) restHeight = height;
        scroller.style.setProperty('--kp-nav-sticky-height', `${height}px`);
    };

    const decide = () => {
        queued = false;
        const attribute = wrap.getAttribute('data-kp-nav-sticky-after');
        const asked = after ?? (attribute !== null && attribute !== '' ? Number(attribute) : 0);
        const threshold = Math.max(restHeight, Number.isFinite(asked) ? asked : 0);
        const at = offset();
        const next = compact ? at > Math.max(0, threshold - restHeight) : at > threshold;
        if (next === compact) return;
        compact = next;
        wrap.toggleAttribute('data-kp-nav-compact', next);
        wrap.dispatchEvent(new CustomEvent(NAV_COMPACT_EVENT, { bubbles: true, detail: { compact: next } }));
    };
    const onScroll = () => {
        // One decision per frame, as the back-to-top control does.
        if (queued) return;
        queued = true;
        view.requestAnimationFrame(decide);
    };

    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    resize?.observe(wrap);
    measure();
    decide();
    target.addEventListener('scroll', onScroll, { passive: true });

    return () => {
        target.removeEventListener('scroll', onScroll);
        resize?.disconnect();
        wrap.removeAttribute('data-kp-nav-compact');
        scroller.removeAttribute('data-kp-nav-sticky-root');
        scroller.style.removeProperty('--kp-nav-sticky-height');
        delete wrap.dataset.kpNavStickyAttached;
    };
}
