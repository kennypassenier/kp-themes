// The panel's geometry: togglers, content, margins, sizes and the peek strip.
import { OPTIONS } from '../options.js';
import { PEEK_KNOBS, SIDENAV_TAB } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the panel's geometry: togglers, content, margins, sizes and the peek strip part adds to the table's context.
 *
 * @typedef {{
 *     contentEl: () => HTMLElement | null;
 *     edge: () => 'end' | 'start';
 *     edgeSize: () => string;
 *     marginAlong: () => 'marginInlineEnd' | 'marginInlineStart';
 *     paddingAlong: () => 'paddingInlineEnd' | 'paddingInlineStart';
 *     panelSize: () => string;
 *     peekSize: () => string;
 *     reserved: () => boolean;
 *     strip: HTMLElement | null;
 *     syncPeek: (open: boolean) => void;
 *     tabs: () => HTMLElement[];
 *     togglers: () => Element[];
 * }} GeometryFields
 */

/**
 * The panel's geometry: togglers, content, margins, sizes and the peek strip.
 *
 * @param {SidenavContext} c
 */
export function installGeometry(c) {
    const { doc, mode, on, panel, read } = c;

    const togglers = () =>
        [...doc.querySelectorAll('[data-kp-sidenav-toggle]')].filter(
            (t) => (t.getAttribute('aria-controls') ?? '') === panel.id || t.getAttribute('aria-controls') === null,
        );
    c.togglers = togglers;
    /** The element a push or side mode makes room in. */
    const contentEl = () => {
        const selector = read(OPTIONS.content);
        return selector === null ? null : /** @type {HTMLElement | null} */ (doc.querySelector(selector));
    };
    c.contentEl = contentEl;
    /**
     * Whether the content keeps the panel's room open or shut: the gutter.
     * Not while `data-kp-sidenav-over-below` has made the panel an `over`
     * panel on a narrow screen, where a gutter would take the page's room.
     */
    const reserved = () => on(OPTIONS.reserve, false) && mode() !== 'side' && !panel.hasAttribute(OPTIONS.narrow);
    c.reserved = reserved;
    /** The edge the panel comes out of: `start` (the default) or `end`. */
    const edge = () => (read(OPTIONS.side) === 'end' ? 'end' : 'start');
    c.edge = edge;
    /** The style property that moves something clear of the panel, on the panel's side. */
    const marginAlong = () => (edge() === 'end' ? 'marginInlineEnd' : 'marginInlineStart');
    c.marginAlong = marginAlong;
    const paddingAlong = () => (edge() === 'end' ? 'paddingInlineEnd' : 'paddingInlineStart');
    c.paddingAlong = paddingAlong;
    /**
     * The panel's own painted size across its axis, not the token's
     * default. The knob is usually set on the panel, where the content
     * element cannot see it: a panel asked for 11rem moved its content by
     * 15rem, and the gap showed. Across the width it is the size the
     * panel is going to (`--kp-sidenav-w`, resolved), so a rail that
     * collapses or a reserved gutter follows at once, not the frame the
     * width transition stands at.
     */
    const panelSize = () => {
        const style = getComputedStyle(panel);
        const knob = style.getPropertyValue('--kp-sidenav-w').trim();
        const width = knob !== '' ? knob : style.inlineSize;
        // A variant that takes room beside the panel (the floating gap
        // on both sides of it) says so as `--kp-sidenav-room`; the
        // content clears that too.
        const room = style.getPropertyValue('--kp-sidenav-room').trim();
        return room !== '' ? `calc(${width} + ${room})` : width;
    };
    c.panelSize = panelSize;
    /**
     * Where the panel's far edge stands: its width and what lies between
     * the window's edge and the panel (`--kp-sidenav-lead`, the floating
     * gap). The edge tab rides there.
     */
    const edgeSize = () => {
        const style = getComputedStyle(panel);
        const lead = style.getPropertyValue('--kp-sidenav-lead').trim();
        const width = style.getPropertyValue('--kp-sidenav-w').trim() || style.inlineSize;
        return lead !== '' ? `calc(${width} + ${lead})` : width;
    };
    c.edgeSize = edgeSize;
    /** The edge tabs that hold one of this panel's togglers. */
    const tabs = () => {
        /** @type {Set<HTMLElement>} */
        const boxes = new Set();
        for (const toggler of togglers()) {
            const box = toggler.closest(SIDENAV_TAB);
            if (box instanceof HTMLElement) boxes.add(box);
        }
        return [...boxes];
    };
    c.tabs = tabs;
    /**
     * The strip a shut panel leaves in view (`--kp-sidenav-peek`, a
     * length), or empty when the page sets none.
     */
    const peekSize = () => {
        const length = getComputedStyle(panel).getPropertyValue('--kp-sidenav-peek').trim();
        return length === '' || parseFloat(length) === 0 ? '' : length;
    };
    c.peekSize = peekSize;
    /** @type {HTMLElement | null} */
    c.strip = null;
    /**
     * Make, keep or drop the strip: it exists while the panel slides
     * (not `side`) and the page sets `--kp-sidenav-peek`. It is the
     * panel's next sibling, under the panel, marked with the edge and the
     * look so the stylesheet can place it; the panel's knobs it follows
     * are carried over. A floating panel hides it while open.
     *
     * @param {boolean} open
     */
    const syncPeek = (open) => {
        const wanted = mode() !== 'side' && peekSize() !== '';
        if (!wanted) {
            c.strip?.remove();
            c.strip = null;
            return;
        }
        if (c.strip === null) {
            c.strip = doc.createElement('div');
            c.strip.className = 'kp-sidenav__peek';
            c.strip.setAttribute('aria-hidden', 'true');
            panel.after(c.strip);
        }
        c.strip.setAttribute('data-kp-sidenav-peek-edge', edge());
        const variant = read(OPTIONS.variant);
        if (variant !== null) c.strip.setAttribute('data-kp-sidenav-peek-variant', variant);
        else c.strip.removeAttribute('data-kp-sidenav-peek-variant');
        c.strip.style.position = read(OPTIONS.position) === 'absolute' ? 'absolute' : '';
        for (const name of PEEK_KNOBS) {
            const value = getComputedStyle(panel).getPropertyValue(name).trim();
            if (value !== '') c.strip.style.setProperty(name, value);
            else c.strip.style.removeProperty(name);
        }
        c.strip.toggleAttribute('data-kp-sidenav-peek-hushed', open && variant === 'floating');
    };
    c.syncPeek = syncPeek;
}
