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

/**
 * Whether a section's opened state should be showing: on the whole page, and in the review dialog's frame of that very section.
 * A frame of another section leaves it closed, because an open menu or list listens for Escape on the whole document.
 * @param {string} item
 */
const shows = (item) => {
    const lane = new URLSearchParams(location.search).get('rv-lane');
    return !lane || lane === item;
};

// ── next times ──
{
    const { setRuns, setRunsState } = await import('../../../../js/runs.js');
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
    const { openMenu } = await import('../../../../js/menu-button.js');
    const { openSnoozePanel, setSnoozeBusy, setSnoozedUntil } = await import('../../../../js/snooze.js');
    readout('#kt-snooze-menu', 'kp-snooze', 'kt-snooze-log');
    readout('#kt-snooze-menu', 'kp-snooze-end', 'kt-snooze-log', () => 'snooze ended');
    const opened = document.querySelector('#kt-snooze-open .kp-menu-button');
    if (opened instanceof HTMLElement && shows('snooze')) openMenu(opened, { focus: 'none' });
    const live = document.getElementById('kt-snooze-live');
    const apply = (/** @type {string} */ state) => {
        if (!live) return;
        setSnoozeBusy(live, state === 'saving');
        setSnoozedUntil(live, state === 'snoozed' ? '2026-10-19T09:00:00+02:00' : null);
        openSnoozePanel(live, state === 'panel');
    };
    stateButtons('data-kt-snooze-state', apply);
}

// ── dated options ──
{
    const { setDatedOptions, setDatedState } = await import('../../../../js/dated-options.js');
    const { combobox } = await import('../../../../js/combobox.js');
    /** @type {import('../../../../js/dated-options.js').DatedOption[]} */
    const six = [
        { value: 's6', when: '2026-10-17T04:00:00+02:00', meta: '4.3 GB' },
        { value: 's5', when: '2026-10-16T04:00:00+02:00', meta: '4.2 GB' },
        { value: 's4', when: '2026-10-15T04:00:00+02:00', meta: '4.1 GB' },
        { value: 's3', when: '2026-10-12T04:00:00+02:00', meta: '3.9 GB' },
        { value: 's2', when: '2026-10-05T04:00:00+02:00', meta: '3.2 GB' },
        { value: 's1', when: '2026-09-17T04:00:00+02:00', meta: '812 MB' },
    ];
    const named = [
        { value: 'n4', label: 'Nightly', when: '2026-10-17T04:00:00+02:00', meta: '4.3 GB' },
        { value: 'n3', label: 'Before the upgrade', when: '2026-10-14T16:40:00+02:00', meta: '4.1 GB' },
        { value: 'n2', label: 'Being written', when: '2026-10-17T14:02:00+02:00', meta: '0 B', disabled: 'Still being written' },
        { value: 'n1', label: 'Weekly', when: '2026-10-10T04:00:00+02:00', meta: '3.8 GB' },
    ];
    const twelve = Array.from({ length: 12 }, (_, i) => {
        const day = new Date(Date.parse('2026-10-17T04:00:00+02:00') - i * 86400000 * (i < 6 ? 1 : 2));
        return { value: `d${i}`, when: day.toISOString(), meta: `${(4.3 - i * 0.1).toFixed(1)} GB` };
    });
    const at = (/** @type {string} */ id) => document.getElementById(id);
    for (const [id, options] of /** @type {const} */ ([
        ['kt-dated-a', six],
        ['kt-dated-b', named],
        ['kt-dated-c', twelve],
        ['kt-dated-open', twelve],
        ['kt-dated-live', six],
        ['kt-dated-old', six],
        ['kt-dated-phone', six],
    ])) {
        const el = at(id);
        if (el) setDatedOptions(el, options);
    }
    readout('#kt-dated-a', 'kp-dated-change', 'kt-dated-log', (d) => JSON.stringify({ value: d.value }));
    const box = at('kt-dated-open')?.querySelector('.kp-combobox');
    if (box && shows('dated')) combobox(box)?.open();
    const live = at('kt-dated-live');
    const show = (/** @type {string} */ state) => {
        if (!live) return;
        if (state === 'ready') setDatedOptions(live, six);
        else if (state === 'empty') {
            const take = document.createElement('button');
            take.type = 'button';
            take.className = 'kp-button kp-button--primary';
            take.textContent = 'Take a snapshot';
            setDatedOptions(live, []);
            setDatedState(live, 'empty', { reason: 'No snapshots yet', action: take });
        } else setDatedState(live, /** @type {'loading' | 'error'} */ (state), { title: 'Could not load the snapshots' });
    };
    stateButtons('data-kt-dated-state', show);
    live?.addEventListener('kp-dated-retry', () => {
        setDatedState(live, 'loading');
        for (const b of document.querySelectorAll('[data-kt-dated-state]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-kt-dated-state') === 'loading'));
        setTimeout(() => show('ready'), 1400);
    });
}

// ── sentence form ──
{
    const { setSentenceFieldState, setSentenceInvalid } = await import('../../../../js/sentence.js');
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
    // Paused / resumed: the fieldset, its reason line and the save button go off and on together.
    const off = document.getElementById('kt-sentence-off');
    const offSave = document.getElementById('kt-sentence-off-save');
    stateButtons('data-kt-pause-state', (value) => {
        const paused = value === 'paused';
        off?.toggleAttribute('disabled', paused);
        offSave?.toggleAttribute('disabled', paused);
        for (const line of off?.querySelectorAll('.kp-sentence__reason') ?? []) line.hidden = !paused;
    });
    stateButtons('data-kt-sentence-look', (value) => first?.setAttribute('data-kp-look', value));
    stateButtons('data-kt-sentence-size', (value) => first?.setAttribute('data-kp-sentence-size', value));
}

// ── slider ──
{
    const { setSliderState } = await import('../../../../js/slider.js');
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

// ── unsaved changes ──
{
    const { unsavedSaved, setUnsavedSaving, discardUnsaved } = await import('../../../../js/unsaved.js');
    /** Put values into a form's controls the way a person does, so the bar counts them. @param {string} formId @param {Record<string, string>} values */
    const edit = (formId, values) => {
        const form = document.getElementById(formId);
        for (const [name, value] of Object.entries(values)) {
            const c = form?.querySelector(`[name="${name}"]`);
            if (!(c instanceof HTMLInputElement || c instanceof HTMLSelectElement)) continue;
            if (c instanceof HTMLInputElement && c.type === 'checkbox') c.checked = value === 'on';
            else c.value = value;
            c.dispatchEvent(new Event('input', { bubbles: true }));
            c.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };
    // The first page: Save is answered after a moment.
    const a = document.getElementById('kt-unsaved-a');
    readout(
        '#kt-unsaved-a',
        'kp-unsaved-save',
        'kt-unsaved-log',
        (d) =>
            `${d.changes.length} changes: ${d.changes.map((/** @type {{ key: string, was: string, now: string }} */ c) => `${c.key} ${c.was} -> ${c.now}`).join('; ')}`,
    );
    a?.addEventListener('kp-unsaved-save', () => setTimeout(() => unsavedSaved(a), 1200));
    // A link in the page asks before it leaves.
    for (const form of document.querySelectorAll('[data-kt-form]')) form.addEventListener('submit', (event) => event.preventDefault());
    const scroller = document.getElementById('kt-unsaved-a-scroll');
    stateButtons('data-kt-unsaved-scroll', (where) => scroller?.scrollTo({ top: where === 'away' ? 420 : 0, behavior: 'auto' }));

    // The states page.
    const live = document.getElementById('kt-unsaved-live');
    const two = { 'kt-unsaved-live-port': '9090', 'kt-unsaved-live-bind': '127.0.0.1' };
    const put = (/** @type {string} */ state) => {
        if (!live) return;
        const form = document.getElementById('kt-unsaved-live-form');
        if (state === 'reload') {
            try {
                sessionStorage.setItem('kt-unsaved-reload', '1');
                sessionStorage.setItem('kp-unsaved:' + location.pathname + ':kt-unsaved-live', JSON.stringify(two));
            } catch {
                // No storage: nothing to reload with.
            }
            location.reload();
            return;
        }
        discardUnsavedQuietly();
        if (state === 'clean') return;
        edit('kt-unsaved-live-form', two);
        if (state === 'saving') setUnsavedSaving(live, true);
        if (state === 'refused') {
            const save = live.querySelector('.kp-unsaved__save');
            if (save instanceof HTMLElement) save.click();
        }
        void form;
    };
    const discardUnsavedQuietly = () => {
        if (!live) return;
        setUnsavedSaving(live, false);
        const bar = live.querySelector('.kp-unsaved__alert');
        bar?.closest('.kp-unsaved__problem')?.setAttribute('hidden', '');
        document.querySelectorAll('.kp-toast').forEach((t) => t.remove());
        discardUnsaved(live);
    };
    live?.addEventListener('kp-unsaved-save', (event) => {
        const only = /** @type {CustomEvent} */ (event).detail.changes;
        setTimeout(
            () => unsavedSaved(live, only.length > 1 ? { refused: { [only[0].key]: 'The port is already used by another service.' } } : {}),
            1000,
        );
    });
    stateButtons('data-kt-unsaved-state', put);
}
