// The launchers, the light turn and the live-region sentence.
import { SIDENAV_LAUNCHER } from '../constants.js';
import { OPTIONS } from '../options.js';
import { getStrings } from '../../strings.js';
import { wantsName } from '../helpers.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the launchers, the light turn and the live-region sentence part adds to the table's context.
 *
 * @typedef {{
 *     launchers: () => HTMLElement[];
 *     light: (open: boolean, now: boolean) => void;
 *     lightTurn: number;
 *     say: (open: boolean) => void;
 * }} LaunchersFields
 */

/**
 * The launchers, the light turn and the live-region sentence.
 *
 * @param {SidenavContext} c
 */
export function installLaunchers(c) {
    const { contentEl, isOpen, mode, on, ownedBy, panel, strings, togglers } = c;

    /** The launcher boxes that hold one of this panel's togglers. */
    const launchers = () => {
        /** @type {Set<HTMLElement>} */
        const boxes = new Set();
        for (const toggler of togglers()) {
            const box = toggler.closest(SIDENAV_LAUNCHER);
            if (box instanceof HTMLElement) boxes.add(box);
        }
        return [...boxes];
    };
    c.launchers = launchers;
    c.lightTurn = 0;
    /**
     * Light the launcher with the opening's first frame and put it out
     * with the closing's last: the launcher's change is part of the
     * pair, so the close plays it last, as the open played it first
     * (docs/THEME_LESSONS.md 11 and 45).
     *
     * @param {boolean} open
     * @param {boolean} now no motion to wait for (the starting state, a mode change)
     */
    const light = (open, now) => {
        c.lightTurn += 1;
        const turn = c.lightTurn;
        const boxes = launchers();
        // A closed panel that slides away is inert from the closing's last
        // frame, so its links leave the tab order and the accessibility
        // tree; a side panel that is shut is not rendered at all.
        const shut = () => {
            for (const box of boxes) box.removeAttribute(OPTIONS.lit);
            panel.inert = mode() !== 'side' && on(OPTIONS.inert, true);
        };
        if (open) {
            panel.inert = false;
            for (const box of boxes) box.setAttribute(OPTIONS.lit, '');
            return;
        }
        if (now) return shut();
        requestAnimationFrame(() => {
            const target = contentEl();
            const motions = [...panel.getAnimations({ subtree: true }), ...(target ? target.getAnimations() : [])].map((a) =>
                a.finished.catch(() => {}),
            );
            void Promise.all(motions).then(() => {
                if (turn !== c.lightTurn || isOpen()) return;
                shut();
            });
        });
    };
    c.light = light;
    /** @param {boolean} open */
    const say = (open) => {
        const s = { ...getStrings(), ...strings };
        for (const toggler of togglers()) {
            if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
            toggler.setAttribute('aria-expanded', String(open));
            toggler.setAttribute('aria-controls', panel.id);
            if (wantsName(toggler)) {
                toggler.setAttribute('aria-label', open ? s.closeSidebar : s.sidebar);
            }
        }
    };
    c.say = say;
}
