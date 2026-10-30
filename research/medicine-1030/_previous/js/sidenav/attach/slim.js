// The slim and rail modes.
import { OPTIONS } from '../options.js';
import { getStrings } from '../../strings.js';
import { wantsName } from '../helpers.js';
import { SIDENAV_SLIM_EVENT } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the slim and rail modes part adds to the table's context.
 *
 * @typedef {{
 *     flying: () => boolean;
 *     isRail: () => boolean;
 *     saySlim: (collapsed: boolean) => void;
 *     setMode: (next: 'side' | 'over' | 'push') => void;
 *     setSlim: (collapsed?: boolean, save?: boolean, reason?: string) => void;
 *     slimTogglers: () => Element[];
 * }} SlimFields
 */

/**
 * The slim and rail modes.
 *
 * @param {SidenavContext} c
 */
export function installSlim(c) {
    const { ask, doc, isOpen, memory, offsetContent, on, ownedBy, panel, read, set, strings, turnEase } = c;

    /**
     * The buttons that collapse and expand this rail without a line of
     * script [gap-12]: `data-kp-sidenav-slim-toggle`, pointed at the panel
     * by `aria-controls` — or at every rail, when it names none, the way
     * `data-kp-sidenav-toggle` does.
     */
    const slimTogglers = () =>
        [...doc.querySelectorAll(`[${OPTIONS.slimToggle}]`)].filter(
            (t) => (t.getAttribute('aria-controls') ?? '') === panel.id || t.getAttribute('aria-controls') === null,
        );
    c.slimTogglers = slimTogglers;
    /** @param {boolean} collapsed */
    const saySlim = (collapsed) => {
        if (read(OPTIONS.slim) === null) return;
        const s = { ...getStrings(), ...strings };
        for (const toggler of slimTogglers()) {
            if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
            // Expanded is the state a button reports: pressed, a
            // collapsed rail widens [ARIA disclosure].
            toggler.setAttribute('aria-expanded', String(!collapsed));
            toggler.setAttribute('aria-controls', panel.id);
            if (wantsName(toggler)) {
                toggler.setAttribute('aria-label', collapsed ? s.expandRail : s.collapseRail);
            }
        }
    };
    c.saySlim = saySlim;
    /** @param {boolean} [collapsed] @param {boolean} [save] @param {string} [reason] see `set` */
    const setSlim = (collapsed, save = true, reason = 'api') => {
        if (read(OPTIONS.slim) === null) return;
        const next = collapsed ?? panel.getAttribute(OPTIONS.slimCollapsed) === null;
        const asked = ask(SIDENAV_SLIM_EVENT, { collapsed: next }, reason);
        if (asked === 'prevented') return;
        turnEase();
        panel.toggleAttribute(OPTIONS.slimCollapsed, next);
        saySlim(next);
        if (save) memory?.write('rail', next);
        // A gutter or a push keeps pace with the rail's new width.
        offsetContent(isOpen());
        c.syncRail();
        if (asked === 'told') panel.dispatchEvent(new CustomEvent(SIDENAV_SLIM_EVENT, { bubbles: true, detail: { collapsed: next, reason } }));
    };
    c.setSlim = setSlim;
    /** @param {'over' | 'side' | 'push'} next */
    const setMode = (next) => {
        panel.setAttribute(OPTIONS.mode, next);
        set(isOpen(), false, false, 'mode');
    };
    c.setMode = setMode;
    // ---- The collapsed rail: peek, labels as tooltips, groups that float out.

    /** Whether the rail stands collapsed to its icons, not expanded by the pointer or the focus. */
    const isRail = () => panel.hasAttribute(OPTIONS.slimCollapsed) && !panel.hasAttribute(OPTIONS.peek);
    c.isRail = isRail;
    const flying = () => isRail() && on(OPTIONS.flyout, true);
    c.flying = flying;
}
