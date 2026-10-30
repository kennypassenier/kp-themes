// The shortcut, the category toggles and the clicks of the panel.
import { OPTIONS } from '../options.js';
import { parseChord, typing } from '../helpers.js';
import { sidenavGroups } from '../../remember.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the shortcut, the category toggles and the clicks of the panel part adds to the table's context.
 *
 * @typedef {{
 *     chord: { key: string; ctrl: boolean; meta: boolean; alt: boolean; shift: boolean; aria: string; } | null;
 *     onCategory: (event: Event) => void;
 *     onEsc: (event: KeyboardEvent) => void;
 *     onShortcut: (event: KeyboardEvent) => void;
 *     onSlimClick: (event: Event) => void;
 *     onToggleClick: (event: Event) => void;
 * }} ControlsFields
 */

/**
 * The shortcut, the category toggles and the clicks of the panel.
 *
 * @param {SidenavContext} c
 */
export function installControls(c) {
    const { flyIn, flyOut, flying, isOpen, memory, mode, on, ownedBy, panel, read, set, setSlim, turnEase } = c;

    // The shortcut.
    const mac = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '') || /Mac/.test(globalThis.navigator?.userAgent ?? '');
    const chordText = read(OPTIONS.shortcut);
    const chord = chordText !== null && chordText.trim() !== '' ? parseChord(chordText, mac) : null;
    c.chord = chord;
    /** @param {KeyboardEvent} event */
    const onShortcut = (event) => {
        if (chord === null || event.defaultPrevented || event.repeat || typing(event.target)) return;
        if (event.key.toLowerCase() !== chord.key) return;
        if (event.ctrlKey !== chord.ctrl || event.metaKey !== chord.meta || event.altKey !== chord.alt || event.shiftKey !== chord.shift) return;
        event.preventDefault();
        set(!isOpen(), true, true, 'shortcut');
    };
    c.onShortcut = onShortcut;
    // Categories. The accordion option is the reference's: with it on,
    // opening one closes the others.
    const saveGroups = () => {
        if (memory === null) return;
        /** @type {Record<string, boolean>} */
        const state = {};
        for (const { group, id } of sidenavGroups(panel)) state[id] = group.hasAttribute(OPTIONS.expanded);
        memory.write('groups', state);
    };
    /** @param {Event} event */
    const onCategory = (event) => {
        const toggle = /** @type {HTMLElement | null} */ (
            event.target instanceof Element ? event.target.closest('.kp-sidenav__category-toggle') : null
        );
        if (!toggle || !panel.contains(toggle)) return;
        const category = toggle.closest('.kp-sidenav__category');
        if (!category) return;
        // In the collapsed rail a press floats the group out (and back);
        // from the keyboard the focus goes into it.
        if (flying()) {
            if (category.hasAttribute(OPTIONS.flown)) flyIn(category);
            else flyOut(category, { focusFirst: /** @type {MouseEvent} */ (event).detail === 0 });
            return;
        }
        const expanded = category.hasAttribute(OPTIONS.expanded);
        turnEase();
        if (!expanded && on(OPTIONS.accordion, false)) {
            for (const other of panel.querySelectorAll('.kp-sidenav__category[data-kp-sidenav-expanded]')) {
                other.removeAttribute(OPTIONS.expanded);
                other.querySelector('.kp-sidenav__category-toggle')?.setAttribute('aria-expanded', 'false');
            }
        }
        category.toggleAttribute(OPTIONS.expanded, !expanded);
        toggle.setAttribute('aria-expanded', String(!expanded));
        saveGroups();
    };
    c.onCategory = onCategory;
    /** @param {Event} event */
    const onToggleClick = (event) => {
        const toggler = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest('[data-kp-sidenav-toggle]') : null);
        if (!toggler) return;
        if (ownedBy !== '' && toggler.matches(ownedBy)) return;
        const controls = toggler.getAttribute('aria-controls');
        if (controls !== null && controls !== panel.id) return;
        set(!isOpen(), true, true, 'toggler');
    };
    c.onToggleClick = onToggleClick;
    /** @param {Event} event */
    const onSlimClick = (event) => {
        const toggler = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest(`[${OPTIONS.slimToggle}]`) : null);
        if (!toggler) return;
        if (ownedBy !== '' && toggler.matches(ownedBy)) return;
        const controls = toggler.getAttribute('aria-controls');
        if (controls !== null && controls !== panel.id) return;
        setSlim(undefined, true, 'toggler');
    };
    c.onSlimClick = onSlimClick;
    /** @param {KeyboardEvent} event */
    const onEsc = (event) => {
        if (event.key !== 'Escape' || !on(OPTIONS.closeOnEsc, true) || mode() === 'side' || !isOpen()) return;
        set(false, true, true, 'escape');
    };
    c.onEsc = onEsc;
}
