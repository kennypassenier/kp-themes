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

// ── next times ──
{
    const { setRuns, setRunsState } = await import('../../js/runs.js');
    const at = (/** @type {string} */ v) => Date.parse(v);
    const conflict = document.getElementById('kt-runs-conflict');
    if (conflict)
        setRuns(conflict, [
            at('2026-10-18T03:00:00+02:00'),
            { at: at('2026-10-19T03:00:00+02:00'), conflict: 'Overlaps the backup of vault' },
            at('2026-10-20T03:00:00+02:00'),
        ]);
    const empty = document.getElementById('kt-runs-empty');
    if (empty) setRuns(empty, [], { reason: 'Pick at least one weekday' });
    const failed = document.getElementById('kt-runs-failed');
    if (failed) setRunsState(failed, 'error');
    const live = document.getElementById('kt-runs-live');
    const times = [at('2026-10-18T03:00:00+02:00'), at('2026-10-19T03:00:00+02:00'), at('2026-10-20T03:00:00+02:00')];
    const show = (/** @type {string} */ state) => {
        if (!live) return;
        if (state === 'ready') setRuns(live, times);
        else if (state === 'empty') setRuns(live, [], { reason: 'Pick at least one weekday' });
        else setRunsState(live, /** @type {'loading' | 'error'} */ (state));
    };
    stateButtons('data-kt-runs-state', show);
    for (const list of document.querySelectorAll('[data-kp-runs]'))
        list.addEventListener('kp-runs-retry', () => {
            setRunsState(/** @type {HTMLElement} */ (list), 'loading');
            setTimeout(() => (list === live ? show('ready') : setRuns(/** @type {HTMLElement} */ (list), times)), 1400);
            if (list === live)
                for (const b of document.querySelectorAll('[data-kt-runs-state]'))
                    b.setAttribute('aria-pressed', String(b.getAttribute('data-kt-runs-state') === 'loading'));
        });
}

// ── snooze ──
{
    const { openMenu } = await import('../../js/menu-button.js');
    const { openSnoozePanel, setSnoozeBusy, setSnoozedUntil } = await import('../../js/snooze.js');
    readout('#kt-snooze-menu', 'kp-snooze', 'kt-snooze-log');
    readout('#kt-snooze-menu', 'kp-snooze-end', 'kt-snooze-log', () => 'snooze ended');
    const opened = document.querySelector('#kt-snooze-open .kp-menu-button');
    if (opened instanceof HTMLElement) openMenu(opened, { focus: 'none' });
    const live = document.getElementById('kt-snooze-live');
    const apply = (/** @type {string} */ state) => {
        if (!live) return;
        setSnoozeBusy(live, state === 'saving');
        setSnoozedUntil(live, state === 'snoozed' ? '2026-10-19T09:00:00+02:00' : null);
        openSnoozePanel(live, state === 'panel');
    };
    stateButtons('data-kt-snooze-state', apply);
}
