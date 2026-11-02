// research/tip-1102: the page's own wiring. The table, its cards and the tooltip are the package's (js/auto.js); this file
// wires the two control groups: Reason (Garlic's reason shown, or everything at rest) and Width (the whole column, or a
// 390 px box, where the data table falls into its cards). The section is wired by its own elements. The data is mock.

const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));

/** How long (ms) the page waits for the package to wire Garlic's Delete before it says so in the console. */
const WIRED_WITHIN_MS = 5000;

/** The anchor the package put round Garlic's disabled Delete, once js/reason.js has wrapped it. @param {HTMLElement | null} target */
const reasonAnchor = (target) => /** @type {HTMLElement | null} */ (target?.querySelector('[data-pg-reason][data-kp-reason-attached]')?.closest('.kp-tooltip-anchor') ?? null);

/**
 * Show or hide the reason the way a pointer does: the package's tooltip opens on `pointerenter` (after its delay) and closes on
 * `pointerleave`; nothing of the package is reached into.
 * @param {HTMLElement | null} target @param {boolean} shown
 */
async function setReason(target, shown) {
    target?.setAttribute('data-pg-reason-state', shown ? 'shown' : 'rest');
    const until = performance.now() + WIRED_WITHIN_MS;
    let anchor = reasonAnchor(target);
    while (anchor === null && performance.now() < until) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        anchor = reasonAnchor(target);
    }
    if (anchor === null) {
        console.warn('tip-1102 demo: Garlic\'s Delete was not wired by the package in time; the reason cannot be shown.');
        return;
    }
    anchor.dispatchEvent(new PointerEvent(shown ? 'pointerenter' : 'pointerleave', { bubbles: false }));
}

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {
    width: (value, target) => target?.setAttribute('data-pg-width', value),
    reason: (value, target) => void setReason(target, value === 'shown'),
};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''));
});

// The page opens in the state its pressed buttons say: the reason shown, at full width.
for (const button of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('button[data-pg][aria-pressed="true"]')))
    HANDLERS[button.dataset.pg ?? '']?.(button.dataset.value ?? '', $(button.dataset.target ?? ''));
