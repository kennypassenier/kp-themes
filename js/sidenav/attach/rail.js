// The rail glyphs, the start state and the rail keys.
import { SIDENAV_LAUNCHER, SIDENAV_TAB } from '../constants.js';
import { OPTIONS } from '../options.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the rail glyphs, the start state and the rail keys part adds to the table's context.
 *
 * @typedef {{
 *     glyphs: HTMLElement[];
 *     onRailKey: (event: KeyboardEvent) => void;
 * }} RailFields
 */

/**
 * The rail glyphs, the start state and the rail keys.
 *
 * @param {SidenavContext} c
 */
export function installRail(c) {
    const {
        applyNarrow,
        applySlimBelow,
        chord,
        doc,
        edge,
        flyIn,
        flyOut,
        flying,
        hideTip,
        mode,
        narrowWatch,
        panel,
        read,
        saySlim,
        set,
        syncRail,
        togglers,
    } = c;

    // A launcher: the panel makes room for it, and an empty toggler in it
    // gets the package's three bars, the glyph the bar's own toggle draws.
    // A page that wrote the mark itself keeps it; otherwise applyOpener() writes it
    // while a launcher is shown (declared before the first call, in the starting state).
    /** @type {HTMLElement[]} */
    const glyphs = [];
    c.glyphs = glyphs;
    for (const toggler of togglers()) {
        const box = toggler.closest(`${SIDENAV_LAUNCHER}, ${SIDENAV_TAB}`);
        if (box === null || toggler.children.length > 0 || (toggler.textContent ?? '').trim() !== '') continue;
        const glyph = doc.createElement('span');
        // The launcher's three bars; the edge tab's grip, which has no state to change.
        glyph.className = box.matches(SIDENAV_TAB) ? 'kp-sidenav__grip' : 'kp-sidenav__bars';
        glyph.setAttribute('aria-hidden', 'true');
        toggler.append(glyph);
        glyphs.push(glyph);
    }
    // The starting state. A side panel is there unless told otherwise;
    // the two that cover are away until asked, which is the reference's
    // `hidden` default written as a mode rather than as a flag.
    let start = mode() === 'side';
    if (panel.hasAttribute(OPTIONS.open)) start = panel.getAttribute(OPTIONS.open) === 'true';
    if (read(OPTIONS.slimCollapsed) !== null) panel.setAttribute(OPTIONS.slimCollapsed, '');
    set(start, false, false, 'init');
    saySlim(panel.getAttribute(OPTIONS.slimCollapsed) !== null);
    applyNarrow();
    applySlimBelow();
    if (narrowWatch !== null && panel.parentElement !== null) narrowWatch.observe(panel.parentElement);
    for (const toggle of panel.querySelectorAll('.kp-sidenav__category-toggle')) {
        const category = toggle.closest('.kp-sidenav__category');
        toggle.setAttribute('aria-expanded', String(category?.hasAttribute('data-kp-sidenav-expanded') ?? false));
    }
    syncRail();
    if (chord !== null) for (const toggler of togglers()) toggler.setAttribute('aria-keyshortcuts', chord.aria);
    /**
     * The rail's keys: Right (or Left on the end edge) floats a group out
     * and goes into it, Escape or the way back folds it and returns to its
     * heading, and Escape takes a label tip away.
     * @param {KeyboardEvent} event
     */
    const onRailKey = (event) => {
        if (event.key === 'Escape' && c.tip?.matches(':popover-open')) hideTip();
        if (!flying() || !(event.target instanceof Element)) return;
        const out = edge() === 'end' ? 'ArrowLeft' : 'ArrowRight';
        const back = edge() === 'end' ? 'ArrowRight' : 'ArrowLeft';
        const toggle = event.target.closest('.kp-sidenav__category-toggle');
        if (toggle !== null && event.key === out) {
            const category = toggle.closest('.kp-sidenav__category');
            if (category) {
                event.preventDefault();
                flyOut(category, { focusFirst: true });
            }
            return;
        }
        const inside = event.target.closest(`.kp-sidenav__category[${OPTIONS.flown}]`);
        if (inside !== null && event.target.closest('.kp-sidenav__flyout') !== null && (event.key === 'Escape' || event.key === back)) {
            event.preventDefault();
            event.stopPropagation();
            flyIn(inside, { refocus: true });
        }
    };
    c.onRailKey = onRailKey;
}
