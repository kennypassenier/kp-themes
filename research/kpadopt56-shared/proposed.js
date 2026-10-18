// research/kpadopt56-shared: the Proposed side's behaviour for the state items (S9 and S14), written as the small module it would be
// in the package. It touches only elements inside `.proposal`; the Now side never sees it. Nothing in js/ is changed.
import { openBusyCard } from '../../js/busy-card.js';

// ── S9: a component holds the height it had when it was last ready while a state shows ───────────────────
// Every data component already writes its state as `data-kp-state` on its host (matrix, entity grid, checklist, notices, gallery,
// availability, request inspector). The module follows that one attribute, so no component needs to change: while the host is
// ready (no attribute, or `ready`) it remembers the host's height; while it is loading, empty or failed the host gets that height
// as `min-block-size`, so the plate is as high as the list was. A very tall component is held to `--kp-footprint-max` (48rem, a
// screen), because a plate in the middle of 1600 px is out of sight. The first load has nothing remembered and is left alone.
/** @param {HTMLElement} host */
export function holdFootprint(host) {
    let held = 0;
    const isReady = () => {
        const state = host.getAttribute('data-kp-state');
        return !state || state === 'ready';
    };
    // The host's own box model decides what `min-block-size` means: take the padding and border off for a content-box host.
    const asMin = (/** @type {number} */ borderBox) => {
        const cs = getComputedStyle(host);
        if (cs.boxSizing === 'border-box') return borderBox;
        const extra = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((n, k) => n + parseFloat(/** @type {any} */ (cs)[k]), 0);
        return Math.max(0, borderBox - extra);
    };
    new ResizeObserver(() => {
        if (isReady()) held = host.getBoundingClientRect().height;
    }).observe(host);
    new MutationObserver(() => {
        if (isReady() || !held) host.style.removeProperty('min-block-size');
        else host.style.setProperty('min-block-size', `min(${asMin(held)}px, var(--kp-footprint-max, 48rem))`);
    }).observe(host, { attributes: true, attributeFilter: ['data-kp-state'] });
}

// ── S14: what a busy card over an inline control would be (the package's own card, laid the package's own way) ──
/** @param {HTMLElement} control */
function busyOverInline(control) {
    return openBusyCard(control, { words: 'Reading…', area: () => [control], className: 'kp-inline__busy', arrive: false });
}

/** @param {Element} item @param {string} name @param {string} state */
function afterState(item, name, state) {
    if (name !== 'inline') return;
    // The controls redraw themselves a moment after the state is set (their modules load on first use): lay the card after that.
    setTimeout(() => lay(item, state), 500);
}

/** @param {Element} item @param {string} state */
function lay(item, state) {
    for (const control of /** @type {HTMLElement[]} */ ([...item.querySelectorAll('.proposal .kp-slider, .proposal .kp-time, .proposal [data-inline] .kp-badge--version')])) {
        const open = /** @type {any} */ (control).__busy;
        if (state === 'loading' && !open) {
            if (getComputedStyle(control).position === 'static') control.style.position = 'relative';
            /** @type {any} */ (control).__busy = busyOverInline(control);
        } else if (state !== 'loading' && open) {
            open.remove();
            /** @type {any} */ (control).__busy = null;
        }
    }
}

/** Attach the Proposed behaviour. Call once the package's boot is done and before the first state is drawn. */
export function attachProposed() {
    for (const name of ['uses', 'entity', 'claim', 'notices', 'gallery', 'avail', 'inspector', 'ops']) {
        for (const slot of /** @type {HTMLElement[]} */ ([...document.querySelectorAll(`.proposal [data-slot="${name}"]`)])) {
            if (slot.firstElementChild instanceof HTMLElement) holdFootprint(slot.firstElementChild);
        }
    }
    /** @type {any} */ (window).kpProposedAfter = afterState;
}
