// Shifts the content aside and applies the opener.
import { slideTiming } from '../helpers.js';
import { OPTIONS } from '../options.js';
import { INSET_KNOBS } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the shifts the content aside and applies the opener part adds to the table's context.
 *
 * @typedef {{
 *     offsetContent: (open: boolean) => { property: null; value: string; } | { property: string; value: string; };
 * }} ShiftFields
 */

/**
 * Shifts the content aside and applies the opener.
 *
 * @param {SidenavContext} c
 */
export function installShift(c) {
    const {
        contentEl,
        edge,
        edgeSize,
        launchedByMarkup,
        marginAlong,
        mode,
        paddingAlong,
        panel,
        panelSize,
        peekSize,
        read,
        reserved,
        syncPeek,
        tabs,
    } = c;

    const MOVED = /** @type {const} */ (['marginInlineStart', 'marginInlineEnd', 'paddingInlineStart', 'paddingInlineEnd']);
    /**
     * Move one element clear of the panel (the content) or along with it
     * (an edge tab), on the panel's own timing.
     *
     * @param {HTMLElement} target
     * @param {'marginInlineStart' | 'marginInlineEnd' | 'paddingInlineStart' | 'paddingInlineEnd'} property
     * @param {string} value
     * @param {string} mark
     * @param {boolean} travels
     */
    const shift = (target, property, value, mark, travels) => {
        // The push travels with the panel: its time, curve and delay are
        // the panel's own for this change, read after the flip, so the
        // content moves on the theme's slide and back on its reverse
        // (css/components.css reads these). A theme that draws the
        // content's move itself (cyberpunk's ticks, nostromo's cut) wins
        // from its register. Other moves are instant.
        const timing = travels ? slideTiming(panel) : { duration: '0s', ease: 'linear', delay: '0s' };
        target.style.setProperty('--kp-sidenav-shift-duration', timing.duration);
        target.style.setProperty('--kp-sidenav-shift-ease', timing.ease);
        target.style.setProperty('--kp-sidenav-shift-delay', timing.delay);
        // A theme may draw the content's move (cyberpunk takes it in ticks): the mark says which way.
        target.setAttribute('data-kp-sidenav-shift', mark);
        for (const one of MOVED) target.style[one] = '';
        target.style[property] = value;
    };
    /**
     * The page's choice of opener [sidenav-opener-M1]: the launcher, the
     * edge tab or both; the default is the tab. The boxes the choice turns off are marked and
     * not drawn; the panel's room for the launcher (its header's start
     * padding) is there only while a launcher is. Over and push only: a
     * side panel and the collapsed rail show what the markup holds. A
     * panel with no tab on the page keeps its launcher whatever is asked:
     * a panel is never left without an opener.
     */
    const applyOpener = () => {
        const asked = read(OPTIONS.opener);
        const wanted = asked === 'launcher' || asked === 'both' ? asked : 'tab';
        const chosen = wanted === 'tab' && tabs().length === 0 ? 'launcher' : wanted;
        const slides = mode() !== 'side' && !panel.hasAttribute(OPTIONS.slimCollapsed);
        const keep = { launcher: !slides || chosen !== 'tab', tab: !slides || chosen !== 'launcher' };
        for (const [boxes, kept] of /** @type {const} */ ([
            [c.launchers(), keep.launcher],
            [tabs(), keep.tab],
        ])) {
            for (const box of boxes) {
                box.toggleAttribute(OPTIONS.openerOff, !kept);
                box.toggleAttribute(OPTIONS.openerOn, kept);
            }
        }
        if (!launchedByMarkup) panel.toggleAttribute(OPTIONS.launched, keep.launcher && c.launchers().length > 0);
    };
    /** @param {boolean} open */
    const offsetContent = (open) => {
        applyOpener();
        syncPeek(open);
        // The edge tab rides on the panel's far edge in the modes that
        // slide: at the window's edge while the panel is away.
        for (const tab of tabs()) {
            tab.setAttribute('data-kp-sidenav-tab-edge', edge());
            shift(tab, marginAlong(), mode() === 'side' ? '' : open ? edgeSize() : peekSize(), open ? 'open' : 'closed', mode() !== 'side');
        }
        const target = contentEl();
        if (!target) return { property: null, value: '' };
        // The inset variant makes the content a card (css/components.css),
        // which reads its knobs from the panel's side of the page too.
        const inset = read(OPTIONS.variant) === 'inset';
        if (inset) target.setAttribute(OPTIONS.inset, edge());
        else target.removeAttribute(OPTIONS.inset);
        for (const name of INSET_KNOBS) {
            const value = inset ? getComputedStyle(panel).getPropertyValue(name).trim() : '';
            if (value !== '') target.style.setProperty(name, value);
            else target.style.removeProperty(name);
        }
        // side pads, push pushes — the reference's own distinction, and
        // it matters: padding keeps a background under the panel, a
        // margin moves the whole box. A gutter is a margin too: the
        // content's box starts where the panel ends.
        const property = mode() === 'push' || reserved() ? marginAlong() : paddingAlong();
        // A shut push panel that leaves a strip in view keeps the strip's room.
        const value = reserved() || (open && mode() !== 'over') ? panelSize() : mode() === 'push' ? peekSize() : '';
        shift(target, property, value, reserved() ? 'reserved' : open ? 'open' : 'closed', mode() === 'push' && !reserved());
        return { property, value };
    };
    c.offsetContent = offsetContent;
}
