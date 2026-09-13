// An open overlay above the containers it sits in [2026-09-13].
//
// Four registers draw the silhouette of a container with `clip-path` — the
// cut corners of a card, an alert, a popover, a dialog or a spec sheet in
// dark, cyberpunk, phantom and titanium — and a clip cuts away everything
// inside the box, an open list or calendar included. Measured on
// 2026-09-13 inside a `.kp-card` in those four themes: every day of a date
// picker's calendar (31 of 31) and every option of a combobox and of a
// drawn select (5 of 5; 4 of 5 for phantom's combobox) out of reach, the
// clipped area handing the click to whatever lay beneath. `overflow:
// hidden` on an ancestor does the same. No z-index escapes either; the top
// layer does.
//
// So an overlay the package opens becomes a manual popover for as long as
// it is open. It stays where it is in the document — the child of its
// control, so it inherits the theme, still matches every register
// selector, and focus and `focusout` behave as before — and is placed in
// window coordinates by its component, again whenever anything scrolls or
// the window changes size. A browser without the popover API keeps the
// overlay where it always hung.

/**
 * Raise an overlay that is being shown into the top layer.
 *
 * @param {HTMLElement} element the overlay, already visible (not `hidden`)
 * @param {(element: HTMLElement) => void} place puts it in window coordinates; called now and on every scroll and resize
 * @returns {() => void} lower — takes it out of the top layer, stops following, and removes what raising wrote
 */
export function raiseOverlay(element, place) {
    if (typeof element.showPopover !== 'function' || !element.isConnected) {
        place(element);
        return () => {};
    }
    const added = !element.hasAttribute('popover');
    if (added) element.setAttribute('popover', 'manual');
    if (!element.matches(':popover-open')) element.showPopover();
    const follow = () => place(element);
    follow();
    window.addEventListener('scroll', follow, { capture: true, passive: true });
    window.addEventListener('resize', follow);
    return () => {
        window.removeEventListener('scroll', follow, { capture: true });
        window.removeEventListener('resize', follow);
        if (element.matches(':popover-open')) element.hidePopover();
        if (added) element.removeAttribute('popover');
    };
}

/**
 * Raise an overlay exactly where it was drawn: the spot and the width it
 * had in its container a moment ago, held against `anchor` while it is
 * open. For an overlay the stylesheet already places (a combobox's list at
 * its static position under the input), so the placement stays the
 * stylesheet's and a register that moves it is still obeyed.
 *
 * @param {HTMLElement} element the overlay, already visible and laid out in place
 * @param {Element} anchor what it moves with — the control it belongs to
 * @returns {() => void} lower
 */
export function raiseInPlace(element, anchor) {
    const drawn = element.getBoundingClientRect();
    const from = anchor.getBoundingClientRect();
    const dx = drawn.left - from.left;
    const dy = drawn.top - from.top;
    const width = drawn.width;
    const lower = raiseOverlay(element, () => {
        const at = anchor.getBoundingClientRect();
        const style = getComputedStyle(element);
        // A fixed box adds its own margins again, so they come off the spot it was drawn at.
        element.style.left = `${at.left + dx - (Number.parseFloat(style.marginLeft) || 0)}px`;
        element.style.top = `${at.top + dy - (Number.parseFloat(style.marginTop) || 0)}px`;
        element.style.width = `${width}px`;
    });
    return () => {
        lower();
        element.style.removeProperty('left');
        element.style.removeProperty('top');
        element.style.removeProperty('width');
    };
}

/**
 * Whether the overlay is in the top layer right now, and so placed in
 * window coordinates rather than against its containing block.
 *
 * @param {Element} element
 */
export const raised = (element) => element.matches(':popover-open');
