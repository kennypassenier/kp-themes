import { SidenavBase } from './base.js';
/** The style properties a shift clears before it writes its own. */
declare const MOVED: readonly ['marginInlineStart', 'marginInlineEnd', 'paddingInlineStart', 'paddingInlineEnd'];
export declare class SidenavShift extends SidenavBase {
    /** Counts the light changes, so a closing's late "put out" does not undo a later opening. */
    lightTurn: number;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /**
     * Move one element clear of the panel (the content) or along with it (an edge tab), on the panel's own timing.
     *
     * @param {HTMLElement} target
     * @param {(typeof MOVED)[number]} property
     * @param {string} value
     * @param {string} mark
     * @param {boolean} travels
     */
    shift(target: HTMLElement, property: (typeof MOVED)[number], value: string, mark: string, travels: boolean): void;
    /**
     * The page's choice of opener [sidenav-opener-M1]: the launcher, the edge tab or both; the default is the tab. The boxes the
     * choice turns off are marked and not drawn; the panel's room for the launcher (its header's start padding) is there only while
     * a launcher is. Over and push only: a side panel and the collapsed rail show what the markup holds. A panel with no tab on the
     * page keeps its launcher whatever is asked: a panel is never left without an opener.
     */
    applyOpener(): void;
    /**
     * Put the opener, the strip, the edge tabs and the content where an open or shut panel wants them.
     * @param {boolean} open
     * @returns {{ property: null; value: string } | { property: string; value: string }}
     */
    offsetContent(open: boolean): {
        property: null;
        value: string;
    } | {
        property: string;
        value: string;
    };
    /**
     * The inset variant makes the content a card (css/components.css), which reads its knobs from the panel's side of the page too.
     * @param {HTMLElement} target
     */
    carryInset(target: HTMLElement): void;
    /** The launcher boxes that hold one of this panel's togglers. */
    launchers(): HTMLElement[];
    /**
     * Light the launcher with the opening's first frame and put it out with the closing's last: the launcher's change is part of
     * the pair, so the close plays it last, as the open played it first (docs/THEME_LESSONS.md 11 and 45).
     *
     * @param {boolean} open
     * @param {boolean} now no motion to wait for (the starting state, a mode change)
     */
    light(open: boolean, now: boolean): void;
    /**
     * Put the launchers out. A closed panel that slides away is inert from the closing's last frame, so its links leave the tab
     * order and the accessibility tree; a side panel that is shut is not rendered at all.
     * @param {HTMLElement[]} boxes
     */
    putOut(boxes: HTMLElement[]): void;
    /** Tell the togglers the panel's state, and name the ones without words of their own. @param {boolean} open */
    say(open: boolean): void;
}
export {};
