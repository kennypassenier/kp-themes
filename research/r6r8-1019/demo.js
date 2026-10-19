// research/r6r8-1019: the page's own wiring. The components are the package's (js/auto.js attaches them); this file gives the
// checklist and the timers their data and wires the state buttons by the section's own elements.
import { setChecklistItems, setChecklistState, CHECKLIST_RETRY_EVENT } from '../../js/checklist.js';
import { startTimer, stopTimer, getTimers, setTimersState, TIMERS_RETRY_EVENT } from '../../js/timer.js';
import { setSnoozedUntil } from '../../js/snooze.js';

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

/** How long the "read it again" after a Retry takes, in ms. */
const READ_MS = 1400;

/**
 * A section's state buttons: `data-rr-set="<key>"` with `data-rr-value`. `apply(key, value)` draws; the pressed one follows.
 * @param {string} id the section's id
 * @param {(key: string, value: string) => void} apply
 */
function wire(id, apply) {
    const section = document.getElementById(id);
    if (!section) return () => {};
    const set = (/** @type {string} */ key, /** @type {string} */ value) => {
        for (const b of section.querySelectorAll(`[data-rr-set="${key}"]`)) b.setAttribute('aria-pressed', String(b.getAttribute('data-rr-value') === value));
        apply(key, value);
    };
    section.addEventListener('click', (event) => {
        const b = event.target instanceof Element ? event.target.closest('[data-rr-set]') : null;
        if (b && section.contains(b)) set(b.getAttribute('data-rr-set') ?? '', b.getAttribute('data-rr-value') ?? '');
    });
    return set;
}

// ---- 1 · the snoozed pickers ----------------------------------------------------------------------------
for (const el of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-rr-snoozed]')])) setSnoozedUntil(el, new Date(Date.now() + 3 * 3_600_000).toISOString());

// ---- 3 · the checklist ----------------------------------------------------------------------------------
{
    const list = document.querySelector('[data-rr-checklist]');
    if (list) {
        const items = [
            { id: 'milk', label: 'Milk', detail: '2 l', group: 'Colruyt' },
            { id: 'rice', label: 'Rice', detail: '1 kg', group: 'Colruyt' },
            { id: 'tomatoes', label: 'Tomatoes', detail: '6', group: 'Colruyt' },
            { id: 'bread', label: 'Bread', detail: '1', group: 'Bakery' },
            { id: 'buns', label: 'Buns', detail: '4', group: 'Bakery', checked: true },
            { id: 'basil', label: 'Basil', group: 'Market' },
            { id: 'cheese', label: 'Parmesan', detail: '200 g', group: 'Market' },
        ];
        const set = wire('checklist-failed', (_key, value) => {
            if (value === 'empty') {
                setChecklistItems(list, []);
                setChecklistState(list, 'ready');
            } else if (value === 'ready') {
                setChecklistItems(list, items);
                setChecklistState(list, 'ready');
            } else setChecklistState(list, /** @type {'loading' | 'error'} */ (value));
        });
        set('state', 'ready');
        list.addEventListener(CHECKLIST_RETRY_EVENT, () => {
            set('state', 'loading');
            setTimeout(() => set('state', 'ready'), READ_MS);
        });
    }
}

// ---- 4 · the timers -------------------------------------------------------------------------------------
{
    const list = document.querySelector('[data-rr-timers]');
    if (list) {
        const start = () => {
            startTimer(list, { name: 'Rice', seconds: 12 * 60, id: 'rice' });
            startTimer(list, { name: 'Sauce', seconds: 25 * 60, id: 'sauce' });
        };
        const set = wire('timers-states', (_key, value) => {
            if (value === 'ready') {
                if (getTimers(list).length === 0) start();
                setTimersState(list, 'ready');
            } else if (value === 'empty') {
                for (const t of getTimers(list)) stopTimer(list, t.id);
                setTimersState(list, 'ready');
            } else setTimersState(list, /** @type {'loading' | 'error'} */ (value));
        });
        set('state', 'ready');
        list.addEventListener(TIMERS_RETRY_EVENT, () => {
            set('state', 'loading');
            setTimeout(() => set('state', 'ready'), READ_MS);
        });
    }
}
