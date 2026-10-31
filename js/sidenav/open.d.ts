import { SidenavShift } from './shift.js';
export declare class SidenavOpen extends SidenavShift {
    /** The backdrop of an open covering panel. @type {HTMLElement | null} */
    backdrop: HTMLElement | null;
    /** Where the focus goes back to when the panel closes. @type {Element | null} */
    restoreFocusTo: Element | null;
    /** Counts the refusals, so an older refusal's timer does not clear a newer one's mark. */
    refusing: number;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    dropBackdrop(): void;
    raiseBackdrop(): void;
    /**
     * A click on the backdrop. `static` shows the backdrop and refuses the click with the theme's cue; `close-on-backdrop="false"`
     * ignores it like `close-on-esc="false"` ignores Escape; otherwise it closes.
     */
    onBackdropClick(): void;
    /** Keep Tab inside an open covering panel. @param {KeyboardEvent} event */
    onTrap(event: KeyboardEvent): void;
    /**
     * Announce that a change was asked for and refused: by a listener that called `preventDefault()` on the cancelable event, or by
     * a static backdrop. The state has not moved.
     *
     * @param {'toggle' | 'slim'} kind
     * @param {Record<string, unknown>} detail the state that was asked for
     * @param {string} reason
     * @param {'listener' | 'static'} source
     */
    prevented(kind: 'toggle' | 'slim', detail: Record<string, unknown>, reason: string, source: 'listener' | 'static'): void;
    /**
     * With `data-kp-sidenav-cancelable`, the event goes out BEFORE the change and may be refused; otherwise it goes out after, as it
     * always did, and the caller sends it. What a layout does on its own (`breakpoint`, `mode`, `init`) is told, never asked.
     *
     * @param {string} name
     * @param {Record<string, unknown>} detail
     * @param {string} reason
     * @returns {'prevented' | 'asked' | 'told'}
     */
    ask(name: string, detail: Record<string, unknown>, reason: string): 'prevented' | 'asked' | 'told';
    /**
     * A click on a static backdrop: nothing closes. The panel is pulled toward its edge and let go (the same pull back, so the
     * return is the exact reverse), on the theme's own duration and curve, marked `data-kp-sidenav-refused` while it lasts
     * (css/components.css draws a ring on it), and the refusal is announced.
     *
     * Knobs, custom properties on the panel or above it: `--kp-sidenav-refuse-travel` (REFUSE_TRAVEL), `--kp-sidenav-refuse-duration`
     * and `--kp-sidenav-refuse-ease` (else the panel's own `--kp-sidenav-duration` and `--kp-sidenav-ease`, else the theme's
     * `--fx-duration` and `--fx-ease`); a leg is never shorter than REFUSE_MIN_MS.
     *
     * It is a Web Animation on the panel's margin: the registers own the panel's `translate` and `animation` for its opening and
     * closing, and a CSS animation would lose to them.
     */
    refuse(): void;
    /** Play the refused cue: pulled and let go. @returns {number} how long both legs take, in milliseconds */
    pullBack(): number;
    /**
     * @param {boolean} open
     * @param {boolean} [moveFocus]
     * @param {boolean} [save] whether this is a state to remember — a person's choice is, an adaptation to the room the panel is in
     *   is not. A window narrowed past the step closes the panel; widening it again must not find it closed because of that
     *   [Kenny, 2026-09-16].
     * @param {string} [reason] what asked for the change, written in `detail.reason`: `toggler`, `escape`, `backdrop`, `shortcut`,
     *   `api` (a call on the handle), `breakpoint` (a layout adapting), `mode` (a mode change) or `init` (the starting state)
     */
    set(open: boolean, moveFocus?: boolean, save?: boolean, reason?: string): void;
    /** Where the focus goes when a person opens or closes the panel. @param {boolean} open */
    moveFocus(open: boolean): void;
    /** Where the page asked for the focus to land, or the first stop in the panel. @param {string | null} named */
    focusInto(named: string | null): void;
    /**
     * Give the focus back once the panel is gone, the way the focus left when it came: a ring that comes back on the opener at the
     * start of the close is not the opening played backwards (docs/THEME_LESSONS.md 11). The close's motions start in the next
     * frame, so they are read there. Without scrolling: a panel that is fixed inside a scrolled box (a review dialog's stage, a
     * dashboard's main) is carried off with that scroll, so the content seemed to vanish the moment the close began.
     * @param {HTMLElement} back
     */
    focusBackLater(back: HTMLElement): void;
    /** @param {{ remember?: boolean }} [options] */
    close({ remember }?: {
        remember?: boolean;
    }): void;
    /** @param {{ remember?: boolean }} [options] */
    open({ remember }?: {
        remember?: boolean;
    }): void;
}
