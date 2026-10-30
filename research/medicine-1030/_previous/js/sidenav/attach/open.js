// Opening, closing and refusing: the one place the open state changes.
import { ASKABLE, REFUSE_MIN_MS, SIDENAV_MODE_EVENT, SIDENAV_PREVENTED_EVENT, SIDENAV_SLIM_EVENT, SIDENAV_TOGGLE_EVENT } from '../constants.js';
import { OPTIONS } from '../options.js';
import { motionAllowed } from '../../calm.js';
import { FOCUSABLE } from '../helpers.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the opening, closing and refusing: the one place the open state changes part adds to the table's context.
 *
 * @typedef {{
 *     ask: (name: string, detail: Record<string, unknown>, reason: string) => 'prevented' | 'asked' | 'told';
 *     close: (arg0?: { remember?: boolean | undefined; }) => void;
 *     open: (arg0?: { remember?: boolean | undefined; }) => void;
 *     refuse: () => void;
 *     set: (open: boolean, moveFocus?: boolean, save?: boolean, reason?: string) => void;
 * }} OpenFields
 */

/**
 * Opening, closing and refusing: the one place the open state changes.
 *
 * @param {SidenavContext} c
 */
export function installOpen(c) {
    const { covering, doc, dropBackdrop, edge, light, memory, mode, offsetContent, on, panel, raiseBackdrop, read, say, togglers, turnEase } = c;

    /**
     * Announce that a change was asked for and refused: by a listener that
     * called `preventDefault()` on the cancelable event, or by a static
     * backdrop. The state has not moved.
     *
     * @param {'toggle' | 'slim'} kind
     * @param {Record<string, unknown>} detail the state that was asked for
     * @param {string} reason
     * @param {'listener' | 'static'} source
     */
    const prevented = (kind, detail, reason, source) => {
        panel.dispatchEvent(new CustomEvent(SIDENAV_PREVENTED_EVENT, { bubbles: true, detail: { kind, ...detail, reason, source } }));
    };
    /**
     * With `data-kp-sidenav-cancelable`, the event goes out BEFORE the
     * change and may be refused; otherwise it goes out after, as it always
     * did, and the caller sends it. What a layout does on its own
     * (`breakpoint`, `mode`, `init`) is told, never asked.
     *
     * @param {string} name
     * @param {Record<string, unknown>} detail
     * @param {string} reason
     * @returns {'prevented' | 'asked' | 'told'}
     */
    const ask = (name, detail, reason) => {
        if (!ASKABLE.has(reason) || !on(OPTIONS.cancelable, false)) return 'told';
        const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail: { ...detail, reason } });
        panel.dispatchEvent(event);
        if (!event.defaultPrevented) return 'asked';
        prevented(name === SIDENAV_SLIM_EVENT ? 'slim' : 'toggle', detail, reason, 'listener');
        return 'prevented';
    };
    c.ask = ask;
    /**
     * A click on a static backdrop: nothing closes. The panel is pulled
     * toward its edge and let go (the same pull back, so the return is
     * the exact reverse), on the theme's own duration and curve, marked
     * `data-kp-sidenav-refused` while it lasts (css/components.css draws a
     * ring on it), and the refusal is announced.
     *
     * Knobs, custom properties on the panel or above it: `--kp-sidenav-refuse-travel`
     * (0.75rem), `--kp-sidenav-refuse-duration` and `--kp-sidenav-refuse-ease`
     * (else the panel's own `--kp-sidenav-duration` and `--kp-sidenav-ease`,
     * else the theme's `--fx-duration` and `--fx-ease`); a leg is never
     * shorter than REFUSE_MIN_MS.
     *
     * It is a Web Animation on the panel's margin: the registers own the
     * panel's `translate` and `animation` for its opening and closing, and
     * a CSS animation would lose to them.
     */
    let refusing = 0;
    const refuse = () => {
        const marked = [panel, ...(c.backdrop ? [c.backdrop] : [])];
        refusing += 1;
        const turn = refusing;
        for (const one of marked) one.setAttribute(OPTIONS.refused, '');
        const style = getComputedStyle(panel);
        const token = (/** @type {string[]} */ names) => names.map((name) => style.getPropertyValue(name).trim()).find((value) => value !== '') ?? '';
        const time = token(['--kp-sidenav-refuse-duration', '--kp-sidenav-duration', '--fx-duration']) || '220ms';
        const easing = token(['--kp-sidenav-refuse-ease', '--kp-sidenav-ease', '--fx-ease']) || 'ease';
        const travel = style.getPropertyValue('--kp-sidenav-refuse-travel').trim() || '0.75rem';
        const property = edge() === 'end' ? 'marginInlineEnd' : 'marginInlineStart';
        let duration = 600;
        if (motionAllowed()) {
            const probe = doc.createElement('span');
            probe.style.cssText = `position:absolute;visibility:hidden;transition-duration:${time}`;
            panel.append(probe);
            const read = parseFloat(getComputedStyle(probe).transitionDuration) * 1000;
            probe.remove();
            // A leg shorter than a few frames is not a cue (terminal's 34 ms): the floor keeps it seen.
            duration = Math.max(REFUSE_MIN_MS, Number.isFinite(read) && read > 0 ? read : 220);
            panel.animate({ [property]: ['0px', `calc(-1 * ${travel})`] }, { duration, easing, iterations: 2, direction: 'alternate' });
            duration *= 2;
        }
        setTimeout(() => {
            if (turn === refusing) for (const one of marked) one.removeAttribute(OPTIONS.refused);
        }, duration);
        prevented('toggle', { open: false }, 'backdrop', 'static');
    };
    c.refuse = refuse;
    /**
     * @param {boolean} open
     * @param {boolean} [moveFocus]
     * @param {boolean} [save] whether this is a state to remember — a
     *   person's choice is, an adaptation to the room the panel is in is
     *   not. A window narrowed past the step closes the panel; widening
     *   it again must not find it closed because of that [Kenny, 2026-09-16].
     * @param {string} [reason] what asked for the change, written in `detail.reason`:
     *   `toggler`, `escape`, `backdrop`, `shortcut`, `api` (a call on the handle),
     *   `breakpoint` (a layout adapting), `mode` (a mode change) or `init` (the starting state)
     */
    const set = (open, moveFocus = true, save = true, reason = 'api') => {
        const asked = ask(SIDENAV_TOGGLE_EVENT, { open }, reason);
        if (asked === 'prevented') return;
        turnEase();
        panel.setAttribute(OPTIONS.open, String(open));
        say(open);
        const offset = offsetContent(open);
        light(open, !moveFocus && !save);
        if (open) raiseBackdrop();
        else dropBackdrop();

        if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = open && covering() ? 'hidden' : '';

        // A panel that closes with the focus inside it (Escape in a push
        // panel, the shortcut) gives it back to its opener, or to the
        // launcher, rather than to nothing once it is inert.
        if (moveFocus && !open && !covering() && panel.contains(doc.activeElement)) {
            c.restoreFocusTo =
                c.restoreFocusTo ?? togglers().find((t) => t instanceof HTMLElement && !panel.contains(t) && t.offsetParent !== null) ?? null;
        }
        const named = read(OPTIONS.initialFocus);
        if (moveFocus && (covering() || (named !== null && open) || (!open && c.restoreFocusTo !== null))) {
            if (open) {
                c.restoreFocusTo = doc.activeElement;
                // Where the page asked for the focus to land, or the first stop in the panel.
                let first = /** @type {HTMLElement | null} */ (null);
                try {
                    first = named !== null ? /** @type {HTMLElement | null} */ (panel.querySelector(named)) : null;
                } catch {
                    first = null;
                }
                (first ?? /** @type {HTMLElement | null} */ (panel.querySelector(FOCUSABLE)))?.focus({ preventScroll: true });
            } else if (c.restoreFocusTo instanceof HTMLElement) {
                // Without scrolling: a panel that is fixed inside a scrolled box (a review
                // dialog's stage, a dashboard's main) is carried off with that scroll, so the
                // content seemed to vanish the moment the close began.
                // And once the panel is gone, the way the focus left when it came: a ring
                // that comes back on the opener at the start of the close is not the opening
                // played backwards (docs/THEME_LESSONS.md 11). The close's motions start in
                // the next frame, so they are read there.
                const back = c.restoreFocusTo;
                c.restoreFocusTo = null;
                requestAnimationFrame(() => {
                    const motions = panel.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {}));
                    void Promise.all(motions).then(() => {
                        if (panel.getAttribute(OPTIONS.open) !== 'true' && back.isConnected) back.focus({ preventScroll: true });
                    });
                });
            }
        }

        if (save) memory?.write('open', open);
        if (asked === 'told') panel.dispatchEvent(new CustomEvent(SIDENAV_TOGGLE_EVENT, { bubbles: true, detail: { open, reason } }));
        panel.dispatchEvent(new CustomEvent(SIDENAV_MODE_EVENT, { bubbles: true, detail: { mode: mode(), offset, reason } }));
    };
    c.set = set;
    /** @param {{ remember?: boolean }} [options] */
    const close = ({ remember = true } = {}) => set(false, true, remember);
    c.close = close;
    /** @param {{ remember?: boolean }} [options] */
    const open = ({ remember = true } = {}) => set(true, true, remember);
    c.open = open;
}
