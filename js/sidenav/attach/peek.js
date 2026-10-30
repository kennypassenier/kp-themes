// The peek: the panel shown from its edge.
import { OPTIONS } from '../options.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the peek: the panel shown from its edge part adds to the table's context.
 *
 * @typedef {{
 *     onPeekEnter: () => void;
 *     onPeekFocusIn: () => void;
 *     onPeekFocusOut: (event: FocusEvent) => void;
 *     onPeekLeave: () => void;
 *     peekTimer: number;
 * }} PeekFields
 */

/**
 * The peek: the panel shown from its edge.
 *
 * @param {SidenavContext} c
 */
export function installPeek(c) {
    const { doc, panel, read, syncRail, turnEase } = c;

    // Peek: a rail told to expand on hover waits for the pointer to rest,
    // and expands while the focus is inside it.
    c.peekTimer = 0;
    let pointerIn = false;
    let peekTurn = 0;
    /**
     * Widen (`open`) or narrow the rail. Narrowing, the rail is `leaving`
     * until its width transition is over, then the attribute goes: the
     * words stay while the width closes, as they came at once when it opened.
     * @param {boolean} value
     */
    const setPeek = (value) => {
        clearTimeout(c.peekTimer);
        const now = panel.getAttribute(OPTIONS.peek);
        if (value ? now === 'open' : now !== 'open') return;
        turnEase();
        peekTurn += 1;
        const turn = peekTurn;
        if (value) {
            panel.setAttribute(OPTIONS.peek, 'open');
            syncRail();
            return;
        }
        panel.setAttribute(OPTIONS.peek, 'leaving');
        requestAnimationFrame(() => {
            const motions = panel.getAnimations().map((a) => a.finished.catch(() => {}));
            void Promise.all(motions).then(() => {
                if (turn !== peekTurn) return;
                panel.removeAttribute(OPTIONS.peek);
                syncRail();
            });
        });
    };
    const peeks = () => read(OPTIONS.expandOnHover) !== null && read(OPTIONS.expandOnHover) !== 'false' && panel.hasAttribute(OPTIONS.slimCollapsed);
    const onPeekEnter = () => {
        pointerIn = true;
        if (!peeks()) return;
        const delay = Number(read(OPTIONS.hoverDelay) ?? 150);
        clearTimeout(c.peekTimer);
        c.peekTimer = window.setTimeout(() => setPeek(true), Number.isFinite(delay) ? delay : 150);
    };
    c.onPeekEnter = onPeekEnter;
    const onPeekLeave = () => {
        pointerIn = false;
        clearTimeout(c.peekTimer);
        if (!panel.contains(doc.activeElement)) setPeek(false);
    };
    c.onPeekLeave = onPeekLeave;
    const onPeekFocusIn = () => {
        if (peeks()) setPeek(true);
    };
    c.onPeekFocusIn = onPeekFocusIn;
    /** @param {FocusEvent} event */
    const onPeekFocusOut = (event) => {
        if (event.relatedTarget instanceof Node && panel.contains(event.relatedTarget)) return;
        if (!pointerIn) setPeek(false);
    };
    c.onPeekFocusOut = onPeekFocusOut;
}
