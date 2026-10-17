// research/kpadopt6-ops: the page's own wiring. The components are the package's (js/auto.js attaches them); this file only
// feeds them sample data, presses their states and writes what they fire into a readout.

/** Resolves once js/auto.js has attached everything the page carries. */
export const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/**
 * Write the last event a component fired into the readout beside it.
 * @param {string} selector a component root
 * @param {string} type the event name
 * @param {string} log the readout's id
 * @param {(detail: any) => string} [say]
 */
export function readout(selector, type, log, say = (detail) => JSON.stringify(detail)) {
    const out = document.getElementById(log);
    if (!out) return;
    for (const el of document.querySelectorAll(selector)) {
        el.addEventListener(type, (event) => {
            out.textContent = `${type}\n${say(/** @type {CustomEvent} */ (event).detail)}`;
        });
    }
}

/** Press a state button: exactly one of the group is pressed. @param {string} attribute the data attribute on the buttons @param {(value: string) => void} apply */
export function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** What the review dialog sets for a choice, as the section hears it. @param {string} id @param {(value: string) => void} apply */
export function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

await ready;

// ── toggle button ──
{
    const { attachToggles, toggle, togglePressedKeys } = await import('../../js/toggle.js');
    const word = (/** @type {any} */ d) =>
        `${d.button.textContent.trim().replace(/\s+/g, ' ')} ${d.pressed ? 'on' : 'off'}${d.group ? `; on in ${d.group}: ${d.pressedKeys.join(', ') || 'none'}` : ''}`;
    readout('[data-k6-toggle-single] > [data-kp-toggle]:first-child', 'kp-toggle', 'k6-toggle-single-log', word);
    readout('#k6-toggle-filters', 'kp-toggle-changed', 'k6-toggle-filters-log', (d) => `pressedKeys: ${d.pressedKeys.join(', ') || '(none: all)'}`);
    readout('#k6-toggle-single', 'kp-toggle-changed', 'k6-toggle-single-log2', (d) => `range: ${d.pressedKeys.join(', ') || 'none'}`);

    // Which lines the level filters show: the real number, never "9+".
    const counts = { error: 12, warning: 31, info: 95 };
    const shown = document.getElementById('k6-toggle-filters-shown');
    const filters = document.getElementById('k6-toggle-filters');
    const paintShown = () => {
        if (!shown || !filters) return;
        const keys = togglePressedKeys(/** @type {HTMLElement} */ (filters.querySelector('[data-kp-toggle]')));
        const n = keys.length === 0 ? 138 : keys.reduce((sum, k) => sum + (counts[/** @type {'error'} */ (k)] ?? 0), 0);
        shown.textContent = `Showing ${n} lines${keys.length ? ` (${keys.join(' and ')})` : ''}.`;
    };
    filters?.addEventListener('kp-toggle-changed', paintShown);

    // The tick is a choice: the toggles carry it as the attribute a consumer's own markup would, and the module follows.
    /** @param {string} mark */
    const setMark = (mark) => {
        for (const button of document.querySelectorAll('#toggle [data-kp-toggle]')) {
            if (mark === 'check') button.setAttribute('data-kp-pressed-mark', 'check');
            else button.removeAttribute('data-kp-pressed-mark');
        }
        for (const b of document.querySelectorAll('[data-k6-mark]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-mark') === mark));
    };
    stateButtons('data-k6-mark', setMark);
    onChoice('toggle-pressed-mark', setMark);

    // The app that takes a second, or refuses.
    const asyncButton = document.getElementById('k6-toggle-async');
    let refuse = false;
    asyncButton?.addEventListener('kp-toggle', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        const log = document.getElementById('k6-toggle-async-log');
        if (log) log.textContent = `kp-toggle: asked for ${detail.pressed ? 'on' : 'off'}; the app is working…`;
        detail.wait(
            new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (refuse) {
                        if (log) log.textContent = 'The app refused: pinning needs the admin role.';
                        reject(new Error('Pinning needs the admin role.'));
                    } else {
                        if (log) log.textContent = 'The app accepted.';
                        resolve(undefined);
                    }
                }, 1100),
            ),
        );
    });
    for (const b of document.querySelectorAll('[data-k6-refuse]'))
        b.addEventListener('click', () => {
            refuse = !refuse;
            b.setAttribute('aria-pressed', String(refuse));
        });
    for (const b of document.querySelectorAll('[data-k6-count]'))
        b.addEventListener('click', () => {
            const v = b.getAttribute('data-k6-count');
            const target = document.getElementById('k6-toggle-count');
            if (target) toggle(target)?.setCount(v === 'loading' ? 'loading' : Number(v));
        });
    void attachToggles;
}
