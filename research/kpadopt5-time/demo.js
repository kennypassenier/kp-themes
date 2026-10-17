// research/kpadopt5-time: the page's own drivers. The components are the package's (js/auto.js attaches them); this file
// only fixes the clock the demo means by "now", writes each section's event readout and drives the states a section shows.

/** The demo's clock: Saturday 17/10/2026 14:05 in Europe/Brussels (summer time, UTC+2). */
export const DEMO_NOW = '2026-10-17T14:05:00+02:00';

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

await ready;

// ── sentence form ──
{
    const { setSentenceFieldState, setSentenceInvalid } = await import('../../js/sentence.js');
    for (const form of document.querySelectorAll('[data-kt-form]'))
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const log = document.getElementById('kt-sentence-log');
            if (log && form.contains(document.getElementById('kt-sentence-a'))) log.textContent = 'submit\nSchedule saved (nothing is stored here).';
        });
    readout('#kt-sentence-a', 'kp-sentence-change', 'kt-sentence-log', (d) => d.summary);
    const live = document.getElementById('kt-sentence-live');
    const stack = live?.querySelector('[name="stack"]')?.closest('.kp-sentence__field');
    const apply = (/** @type {string} */ state) => {
        if (!live || !stack) return;
        setSentenceFieldState(stack, state === 'loading' ? 'loading' : 'ready');
        setSentenceInvalid(live, 'at', state === 'invalid' ? 'Type a time of day, 00:00 to 23:59.' : null);
    };
    stateButtons('data-kt-sentence-state', apply);
    // The look and the size are options of the component (attributes): the sentence follows an attribute change.
    const first = document.getElementById('kt-sentence-a');
    stateButtons('data-kt-sentence-look', (value) => first?.setAttribute('data-kp-look', value));
    stateButtons('data-kt-sentence-size', (value) => first?.setAttribute('data-kp-sentence-size', value));
}

// ── slider ──
{
    const { setSliderState } = await import('../../js/slider.js');
    readout('#kt-slider-a', 'kp-slider-input', 'kt-slider-log', (d) => JSON.stringify({ values: d.values, text: d.text }));
    readout('#kt-slider-a', 'kp-slider-change', 'kt-slider-log', (d) => `released at ${d.text}`);
    const live = document.getElementById('kt-slider-live');
    const apply = (/** @type {string} */ state) => {
        if (!live) return;
        setSliderState(live, state === 'loading' ? 'loading' : 'ready');
        const box = live.querySelector('.kp-slider__field');
        if (!(box instanceof HTMLInputElement)) return;
        if (state === 'wrong') {
            box.value = 'abc';
            box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        } else if (state === 'ready') {
            box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
        }
    };
    stateButtons('data-kt-slider-state', apply);
    // Where the number is shown is an option of the component (an attribute): every slider of the section follows it.
    stateButtons('data-kt-slider-value', (value) => {
        for (const slider of document.querySelectorAll('#slider [data-kp-slider]')) slider.setAttribute('data-kp-slider-value', value);
    });
}
