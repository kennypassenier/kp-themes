// The back-to-top button.
import { getStrings } from '../strings.js';

/** Fired on the control when it appears or goes away: `{ shown }`. */
export const TO_TOP_EVENT = 'kp-to-top';
/** The attribute that marks a back-to-top control [feat-page-1]. */
export const TO_TOP = '[data-kp-to-top]';
/**
 * Wire every back-to-top control under `root` [feat-page-1].
 *
 * Two halves, and the second is the one usually missing: it takes the
 * reader back, and it takes the FOCUS back. A control that only scrolls
 * leaves a keyboard user at the bottom of the document with the view at
 * the top, which is worse than not moving at all.
 *
 * Where the focus lands is `data-kp-to-top-target`, a selector, and it
 * falls back to the document's own body — the top of the page, which is
 * what the control is named after. It is NOT the skip link's target: on a
 * page with anything tall above the content, focusing that landmark
 * scrolls straight back down to it and undoes the journey. Scrolling is
 * left to the browser: `scrollTo` follows the root's own scroll-behaviour,
 * which is the knob feat-layout-2 already put there and which a reader who
 * asked for less motion has already overruled.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, after?: number }} [options]
 * @returns {() => void} detach
 */
export function attachToTop(root = document, { strings, after } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll(TO_TOP)) {
        const button = /** @type {HTMLElement} */ (el);
        if (button.dataset.kpToTopAttached !== undefined) continue;
        button.dataset.kpToTopAttached = '';
        const doc = button.ownerDocument;
        const view = doc.defaultView;
        if (!view) continue;

        const threshold = after ?? Number(button.getAttribute('data-kp-to-top-after') ?? '400');
        const target = button.getAttribute('data-kp-to-top-target') ?? '';
        const s = { ...getStrings(), ...strings };
        if (button.getAttribute('aria-label') === null && button.textContent?.trim() === '') {
            button.setAttribute('aria-label', s.backToTop);
        }
        // An empty control gets the package's glyph [gap-12]: written the
        // documented way it painted as an empty box. The element is empty
        // and hidden from the accessibility tree — the arrow is drawn by
        // css/components.css and the name above is what is read.
        /** @type {HTMLElement | null} */
        let glyph = null;
        if (button.children.length === 0 && button.textContent?.trim() === '') {
            glyph = doc.createElement('span');
            glyph.className = 'kp-to-top__glyph';
            glyph.setAttribute('aria-hidden', 'true');
            button.append(glyph);
        }

        // The box that scrolls the control's page: the window, or a scrolling box it sits in (a dashboard's main, a review
        // dialog's stage; Kenny, 2026-10-13: "the back to top didn't seem to work" in such a stage). Read at every use, since
        // a box can move the control into another scroller after it was attached.
        const scroller = () => {
            for (let box = button.parentElement; box && box !== doc.body && box !== doc.documentElement; box = box.parentElement) {
                const overflow = view.getComputedStyle(box).overflowY;
                if (/auto|scroll|overlay/.test(overflow) && box.scrollHeight > box.clientHeight + 1) return box;
            }
            return null;
        };
        let shown = false;
        let queued = false;
        const decide = () => {
            queued = false;
            const box = scroller();
            const next = (box ? box.scrollTop : view.scrollY) > threshold;
            if (next === shown) return;
            shown = next;
            button.toggleAttribute('data-kp-to-top-shown', next);
            button.dispatchEvent(new CustomEvent(TO_TOP_EVENT, { bubbles: true, detail: { shown: next } }));
        };
        const onScroll = () => {
            // One decision per frame: a scroll fires far more often than a
            // page can paint, and the answer cannot change in between.
            if (queued) return;
            queued = true;
            view.requestAnimationFrame(decide);
        };
        const onClick = () => {
            (scroller() ?? view).scrollTo({ top: 0 });
            // The focus goes too, and it goes WITHOUT scrolling. Focusing an
            // element normally brings it into view, which undid the journey:
            // on a page whose main landmark starts 2737px down, "back to
            // top" landed back at 3476. So the target is the top of the
            // document unless the page names another, and either way the
            // focus moves quietly while the scroll above does the travelling.
            const to = /** @type {HTMLElement | null} */ (target === '' ? null : doc.querySelector(target)) ?? doc.body;
            if (!to.hasAttribute('tabindex')) to.setAttribute('tabindex', '-1');
            to.focus({ preventScroll: true });
        };

        decide();
        // Captured on the document: a box's scroll does not bubble, and the window's reaches the document as well.
        doc.addEventListener('scroll', onScroll, { passive: true, capture: true });
        button.addEventListener('click', onClick);

        cleanups.push(() => {
            doc.removeEventListener('scroll', onScroll, { capture: true });
            button.removeEventListener('click', onClick);
            button.removeAttribute('data-kp-to-top-shown');
            glyph?.remove();
            delete button.dataset.kpToTopAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
