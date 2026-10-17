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

readout('#kt-week', 'kp-weekdays-change', 'kt-week-log');
readout('#kt-month', 'kp-weekdays-change', 'kt-month-log');
