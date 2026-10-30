// Narrow screens: when the panel hides, slims or comes back.
import { OPTIONS } from '../options.js';
import { NARROW_STEP, SIDENAV_LAUNCHER } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the narrow screens: when the panel hides, slims or comes back part adds to the table's context.
 *
 * @typedef {{
 *     applyNarrow: () => void;
 *     applySlimBelow: () => void;
 *     declared: { mode: string | null; slim: boolean; } | null;
 *     hiddenAtAttach: Map<HTMLElement, boolean>;
 *     narrowWatch: ResizeObserver | null;
 *     slimHeld: boolean | null;
 *     still: (change: (() => void)) => void;
 *     threshold: (written?: string | null) => number;
 * }} NarrowFields
 */

/**
 * Narrow screens: when the panel hides, slims or comes back.
 *
 * @param {SidenavContext} c
 */
export function installNarrow(c) {
    const { doc, mode, ownedBy, panel, read, saySlim, set, setSlim, slimTogglers, togglers } = c;

    // Narrow [scope-80]. A rail beside the content is right on a wide
    // screen and a column of its own on a phone, so a panel that says
    // `data-kp-sidenav-over-below` — with a length, or the package's
    // 40rem — becomes the `over` panel while the box it lives in is that
    // wide or narrower: away until its toggle opens it, with the focus
    // trap, Escape, the backdrop and the focus return that mode already
    // has, and its words back even when the rail was collapsed to
    // icons. Above the width it is what the markup declared again, slim
    // state included. The box is the panel's parent, as the bar measures
    // its own wrapper [TH104]; an over panel is fixed, so it does not
    // change the width it is measured by.
    //
    // The controls follow the state, through `hidden`, which the package
    // lets win over every display rule [KT13]: this panel's
    // `data-kp-sidenav-toggle` buttons — the one in the bar and the close
    // inside the panel, which is the way out while the panel covers the
    // bar — are shown only while narrow, and its slim toggles only while
    // wide. Markup that starts them `hidden` stays right without the
    // module. `data-kp-sidenav-narrow` on the panel says which it is.
    const overBelow = read(OPTIONS.overBelow);
    /** @type {{ mode: string | null, slim: boolean } | null} */
    c.declared = null;
    /** @type {Map<HTMLElement, boolean>} */
    const hiddenAtAttach = new Map();
    c.hiddenAtAttach = hiddenAtAttach;
    /** @param {Element} control @param {boolean} hide */
    const hideControl = (control, hide) => {
        if (!(control instanceof HTMLElement) || (ownedBy !== '' && control.matches(ownedBy))) return;
        if (!hiddenAtAttach.has(control)) hiddenAtAttach.set(control, control.hasAttribute('hidden'));
        control.toggleAttribute('hidden', hide);
    };
    /** A length the page wrote, in pixels; empty is the package's 40rem step. @param {string | null} written */
    const threshold = (written = overBelow) => {
        const length = (written ?? '').trim() || NARROW_STEP;
        const size = parseFloat(length);
        if (length.endsWith('rem')) return size * parseFloat(getComputedStyle(doc.documentElement).fontSize);
        if (length.endsWith('em')) return size * parseFloat(getComputedStyle(panel.parentElement ?? panel).fontSize);
        return size;
    };
    c.threshold = threshold;
    /** Change the mode without the slide: a resize is not an opening. @param {() => void} change */
    const still = (change) => {
        const before = panel.style.transition;
        panel.style.transition = 'none';
        change();
        void panel.offsetWidth;
        panel.style.transition = before;
    };
    c.still = still;
    const applyNarrow = () => {
        const box = panel.parentElement;
        if (overBelow === null || box === null) return;
        const narrow = box.clientWidth <= threshold();
        // A launcher is the page's fixed way in at every width: never hidden.
        for (const control of togglers()) if (control.closest(SIDENAV_LAUNCHER) === null) hideControl(control, !narrow);
        if (read(OPTIONS.slim) !== null) for (const control of slimTogglers()) hideControl(control, narrow);
        if (narrow === (c.declared !== null)) return;
        still(() => {
            if (narrow) {
                c.declared = { mode: read(OPTIONS.mode), slim: panel.hasAttribute(OPTIONS.slimCollapsed) };
                panel.setAttribute(OPTIONS.narrow, '');
                panel.removeAttribute(OPTIONS.slimCollapsed);
                panel.setAttribute(OPTIONS.mode, 'over');
                set(false, false, false, 'breakpoint');
            } else {
                const was = /** @type {{ mode: string | null, slim: boolean }} */ (c.declared);
                c.declared = null;
                panel.removeAttribute(OPTIONS.narrow);
                if (was.mode === null) panel.removeAttribute(OPTIONS.mode);
                else panel.setAttribute(OPTIONS.mode, was.mode);
                panel.toggleAttribute(OPTIONS.slimCollapsed, was.slim);
                saySlim(was.slim);
                set(mode() === 'side', false, false, 'breakpoint');
            }
        });
    };
    c.applyNarrow = applyNarrow;
    // The rail's step [Kenny, 2026-10-13, from the libraries survey]: the
    // page names the width at and below which the rail collapses to its
    // icons; wider again it is what the reader left it, and a collapse
    // the step made is never remembered as the reader's.
    const slimBelow = read(OPTIONS.slimBelow);
    /** @type {boolean | null} the reader's own rail state while the step holds it collapsed */
    c.slimHeld = null;
    const applySlimBelow = () => {
        const box = panel.parentElement;
        if (slimBelow === null || box === null || read(OPTIONS.slim) === null || c.declared !== null) return;
        const narrow = box.clientWidth <= threshold(slimBelow);
        if (narrow === (c.slimHeld !== null)) return;
        if (narrow) {
            c.slimHeld = panel.hasAttribute(OPTIONS.slimCollapsed);
            if (!c.slimHeld) setSlim(true, false, 'breakpoint');
        } else {
            const was = c.slimHeld;
            c.slimHeld = null;
            if (!was) setSlim(false, false, 'breakpoint');
        }
    };
    c.applySlimBelow = applySlimBelow;
    const onResize = () => {
        applyNarrow();
        applySlimBelow();
    };
    const narrowWatch =
        (overBelow !== null || slimBelow !== null) && panel.parentElement !== null && typeof ResizeObserver === 'function'
            ? new ResizeObserver(onResize)
            : null;
    c.narrowWatch = narrowWatch;
}
