// The panel's readers, its remembered state and the mode it starts in.
import { paintRemembered } from '../../remember.js';
import { OPTIONS } from '../options.js';
import { reversedEase } from '../../motion.js';
/** @typedef {import('../../remember.js').Memory} Memory */
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the panel's readers, its remembered state and the mode it starts in part adds to the table's context.
 *
 * @typedef {{
 *     backdrop: HTMLElement | null;
 *     covering: () => boolean;
 *     doc: Document;
 *     isOpen: () => boolean;
 *     launchedByMarkup: boolean;
 *     memory: Memory | null;
 *     mode: () => string;
 *     on: (attribute: string, fallback: boolean) => boolean;
 *     read: (attribute: string) => string | null;
 *     restoreFocusTo: Element | null;
 *     turnEase: () => void;
 * }} BasicsFields
 */

/**
 * The panel's readers, its remembered state and the mode it starts in.
 *
 * @param {SidenavContext} c
 */
export function installBasics(c) {
    const { panel, store } = c;

    const doc = panel.ownerDocument;
    c.doc = doc;
    const read = (/** @type {string} */ attribute) => panel.getAttribute(attribute);
    c.read = read;
    const on = (/** @type {string} */ attribute, /** @type {boolean} */ fallback) => {
        const value = read(attribute);
        return value === null ? fallback : value !== 'false';
    };
    c.on = on;
    // What this panel remembers, and where: the name comes off the
    // element, never from here [Kenny, 2026-09-16]. The paint happens
    // before anything below reads the markup, so the starting state is
    // read from the memory the same way it is read from the markup.
    const memory = paintRemembered(panel, 'sidenav', { storage: store });
    c.memory = memory;
    /** @type {HTMLElement | null} */
    c.backdrop = null;
    /** @type {Element | null} */
    c.restoreFocusTo = null;
    const launchedByMarkup = panel.hasAttribute(OPTIONS.launched);
    c.launchedByMarkup = launchedByMarkup;
    const mode = () => read(OPTIONS.mode) ?? 'side';
    c.mode = mode;
    const isOpen = () => panel.getAttribute(OPTIONS.open) !== 'false' && (mode() === 'side' || panel.getAttribute(OPTIONS.open) === 'true');
    c.isOpen = isOpen;
    const covering = () => mode() === 'over';
    c.covering = covering;
    // A rail that collapses, a panel that slides away and a group that
    // folds play their opening backwards: the theme's curve turned
    // around, which CSS cannot work out, so it is written here as
    // `--kp-sidenav-ease-back` (css/components.css) before each change
    // and before a hover that may expand the rail. Without this module
    // they run on the opening's own curve.
    const turnEase = () => {
        const style = getComputedStyle(panel);
        const ease = style.getPropertyValue('--kp-sidenav-ease').trim() || style.getPropertyValue('--fx-ease').trim() || 'ease';
        panel.style.setProperty('--kp-sidenav-ease-back', reversedEase(ease));
    };
    c.turnEase = turnEase;
    turnEase();
}
