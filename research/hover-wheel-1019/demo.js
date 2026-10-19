// research/hover-wheel-1019: the page's own wiring. The components are the package's (js/auto.js attaches the hover card and the
// wheels); this file gives the wheels their choices and sends a touch tap for the buttons that stand in for a finger.
import { setWheelItems } from '../../js/wheel.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

// ---- 1 · a finger on the hover card ---------------------------------------------------------------------
/** A tap as a finger sends it: a touch pointer down and up, then the click. @param {HTMLElement} target */
const tap = (target) => {
    const init = { bubbles: true, cancelable: true, composed: true, pointerType: 'touch', pointerId: 7, isPrimary: true };
    target.dispatchEvent(new PointerEvent('pointerdown', init));
    target.dispatchEvent(new PointerEvent('pointerup', init));
    target.dispatchEvent(new PointerEvent('click', init));
};
for (const button of document.querySelectorAll('[data-hw-tap]')) {
    button.addEventListener('click', (event) => {
        // Only the person's own click; the synthetic tap below is a touch click on the ingredient, not on this button.
        if (/** @type {PointerEvent} */ (event).pointerType === 'touch') return;
        const anchor = document.querySelector(`[data-hw-ingredient="${button.getAttribute('data-hw-tap')}"]`);
        if (anchor instanceof HTMLElement) tap(anchor);
    });
}

// ---- 2 to 4 · the wheels ------------------------------------------------------------------------------------
const DINNERS = [
    { id: 'curry', label: 'Chicken curry with rice', short: 'Curry', weight: 3, tag: 'Stovetop, 30 min' },
    { id: 'pasta', label: 'Pasta with roasted vegetables', short: 'Pasta', weight: 2, tag: 'Oven, 45 min' },
    { id: 'soup', label: 'Tomato soup', weight: 2, tag: 'One pot, 20 min' },
    { id: 'wraps', label: 'Wraps', weight: 2 },
    { id: 'stew', label: 'Beef and beer stew', short: 'Stew', weight: 2, tag: 'Slow cooker, 4 h' },
    { id: 'rice', label: 'Fried rice with egg', short: 'Fried rice', weight: 2, tag: 'Wok, 15 min' },
];
for (const wheel of document.querySelectorAll('[data-hw-wheel]')) {
    if (!(wheel instanceof HTMLElement)) continue;
    const kind = wheel.getAttribute('data-hw-wheel');
    setWheelItems(
        wheel,
        DINNERS.map((item) => (kind === 'resting' && (item.id === 'rice' || item.id === 'soup') ? { ...item, resting: true } : item)),
    );
}
