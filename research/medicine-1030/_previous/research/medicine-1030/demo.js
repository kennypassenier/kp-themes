// research/medicine-1030: the page's own wiring. Every component is the package's (attached by js/auto.js from its data-kp-* attributes);
// this file gives each its mock data and wires the controls of each section by its own elements. The data is the Medicine Cabinet app's
// own shape (medicines, doses, symptoms, forms); the names, counts and times are mock.

import { setCardState } from '../../js/card-state.js';
import { setAttention } from '../../js/attention.js';
import { addEditorRow, editorRowsOf, removeEditorRow } from '../../js/row-editor.js';
import { dataTable } from '../../js/datatable.js';
import { showError, clearError } from '../../js/forms.js';
import { openConfirmation } from '../../js/components.js';
import { SEGMENTED_EVENT } from '../../js/segmented.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    // A button without aria-pressed is an action (it opens a dialog), not a toggle: nothing in its group is marked.
    if (button.hasAttribute('aria-pressed')) for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** Press a group's button from the page (a handler that changes another group's state). @param {string} name @param {string} value */
const press = (name, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"]`)) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};
const say = (/** @type {string} */ id, /** @type {string} */ text) => {
    $(id).textContent = text;
};
/** Every element that matches, as an array. @param {string} selector */
const all = (selector) => /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);

// ---------------------------------------------------------------- width (every section)
on('width', (value, button) => {
    $(button.dataset.target ?? '').setAttribute('data-pg-width', value);
});

// ---------------------------------------------------------------- card states (list-row, row-editor)
/** What each state of the Cabinet and the slot editor says, in the package's plate. */
const PLATES = {
    'pg-cabinet': { empty: ['The cabinet is empty', 'Add the first medicine and it is listed here with its stock.'], error: ['The cabinet could not be read', 'The app did not answer. Try again in a moment.'], words: 'Reading the cabinet' },
    'pg-when': { empty: ['No time yet', 'Add a time to say when to take it.'], error: ['The times could not be read', 'The app did not answer. Try again in a moment.'], words: 'Reading the times' },
};
on('state', (value, button) => {
    const id = button.dataset.target ?? '';
    const plate = PLATES[/** @type {'pg-cabinet'} */ (id)];
    const card = $(id);
    if (value === 'loading') setCardState(card, 'loading', { words: plate.words });
    else if (value === 'empty') setCardState(card, 'empty', { title: plate.empty[0], text: plate.empty[1] });
    else if (value === 'error') setCardState(card, 'error', { title: plate.error[0], text: plate.error[1] });
    else setCardState(card, 'ready');
});
document.addEventListener('kp-card-retry', (event) => {
    const card = /** @type {HTMLElement} */ (event.target);
    setCardState(card, 'ready');
    press('state', 'ready');
});

// ---------------------------------------------------------------- quantity-fill
on('qfill', (value) => {
    for (const quantity of all('[id^="pg-qfill-"]')) {
        if (value === 'on') quantity.setAttribute('data-kp-quantity-fill', '');
        else quantity.removeAttribute('data-kp-quantity-fill');
    }
});

// ---------------------------------------------------------------- badge-run
{
    const BADGES = ['Low stock', 'Expires 11/2026', 'Refill on 12/11', 'Take as needed', 'On schedule', 'Opened 30 days ago', 'Prescription', 'Needs a fridge', 'Keep from children'];
    let count = 3;
    const draw = () => {
        for (const run of all('.pg-brun')) {
            run.replaceChildren(
                ...BADGES.slice(0, count).map((words, i) => {
                    const badge = document.createElement('span');
                    badge.className = `kp-badge${i % 4 === 0 ? ' kp-badge--warning' : ''}`;
                    badge.textContent = words;
                    return badge;
                }),
            );
        }
    };
    on('brun-count', (value) => {
        count = Number(value);
        draw();
    });
    on('brun-mode', (value) => {
        for (const run of all('.pg-brun')) run.setAttribute('data-pg-run', value);
    });
    draw();
}

// ---------------------------------------------------------------- attention-max
{
    /** @param {string} words */
    const fix = (words) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--sm';
        button.textContent = words;
        return button;
    };
    /** @type {import('../../js/attention.js').AttentionItem[]} */
    const PROBLEMS = [
        { key: 'amox', severity: 'info', title: 'Saline nasal spray has been open for 30 days', text: 'Sprays are best used within 28 days of opening.', action: fix('Mark replaced') },
        { key: 'cet', severity: 'warning', title: 'Cetirizine 10 mg is running low', text: '8 tablets left, about 8 days.', action: fix('Add stock') },
        { key: 'vit', severity: 'warning', title: 'Vitamin D3 25 µg expires in 12 days', text: 'The box says 11/2026.', action: fix('See the box') },
        { key: 'expired', severity: 'critical', title: 'Amoxicillin 500 mg has expired', text: 'It ran out on 09/2026. Do not take it; hand it in at the pharmacy.', action: fix('Remove it') },
        { key: 'ibu', severity: 'critical', title: 'Ibuprofen 400 mg runs out in 2 days', text: '14 tablets, 6 a day at most.', action: fix('Add stock') },
        { key: 'dose', severity: 'warning', title: 'The 20:00 dose of Paracetamol 500 mg is not taken yet', text: 'It was due 25 minutes ago.', action: fix('Take it now') },
        { key: 'refill', severity: 'info', title: 'A refill list of 3 medicines is ready', text: 'Ibuprofen, Cetirizine and Vitamin D3.', action: fix('Open the list') },
    ];
    const band = $('pg-attention');
    on('att-count', (value) => setAttention(band, PROBLEMS.slice(0, Number(value))));
    on('att-max', (value) => {
        if (value === '0') band.removeAttribute('data-kp-attention-max');
        else band.setAttribute('data-kp-attention-max', value);
    });
    setAttention(band, PROBLEMS);
}

// ---------------------------------------------------------------- header-updated
on('hdr-time', (value) => {
    const text = `updated ${value.slice(0, 2)}:${value.slice(2)}`;
    for (const time of all('#header-updated-component .pg-time')) time.textContent = text;
});

// ---------------------------------------------------------------- row-editor
{
    const host = $('pg-rows');
    on('rows-fill', (value) => {
        if (value === 'fill') while (addEditorRow(host)) continue;
        else {
            host.setAttribute('data-kp-rows-min', '0');
            press('rows-min', '0');
            for (const row of editorRowsOf(host)) removeEditorRow(host, row);
        }
    });
    on('rows-min', (value) => {
        host.setAttribute('data-kp-rows-min', value);
        while (editorRowsOf(host).length < Number(value) && addEditorRow(host)) continue;
    });
}

// ---------------------------------------------------------------- pills-none
{
    const log = (/** @type {string} */ words) => say('pg-pills-log', words);
    const form = $('pg-form-pills');
    on('pill-mode', (value) => form.setAttribute('data-kp-segmented', value));
    document.addEventListener(SEGMENTED_EVENT, (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        const group = /** @type {HTMLElement} */ (event.target);
        if (group.id === 'pg-form-pills') log(detail.values.length ? `Form: ${detail.values[0]}` : 'Form: none chosen');
        else if (group.id === 'pg-sym-pills') log(`Symptoms: ${detail.values.join(', ') || 'none'}`);
        else if (group.id === 'pg-find-pills') log(detail.values.length ? `Search box: ${detail.values[0]}` : 'Search box: empty');
    });
    document.addEventListener('kp-combobox-change', (event) => {
        const box = /** @type {HTMLElement} */ (event.target);
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (box.id === 'pg-sym') log(`Tags: ${detail.values.join(', ') || 'none'}`);
    });
}

// ---------------------------------------------------------------- dialogs
{
    const preview = $('pg-prev-stock');
    on('dlg-step', (value) => {
        preview.classList.remove('kp-dialog--narrow', 'kp-dialog--wide', 'kp-dialog--wider');
        if (value !== 'default') preview.classList.add(`kp-dialog--${value}`);
    });
    for (const close of all('[data-pg-close]')) close.addEventListener('click', () => close.closest('dialog')?.close());
    on('dlg-open', (value, button) => {
        if (value === 'stock') /** @type {HTMLDialogElement} */ ($('pg-stock')).showModal();
        else if (value === 'forms') /** @type {HTMLDialogElement} */ ($('pg-forms')).showModal();
        else {
            const line = (/** @type {string} */ html) => Object.assign(document.createElement('p'), { innerHTML: html });
            openConfirmation(button, {
                phrase: 'Too soon for another dose',
                description: [
                    line('You took Ibuprofen 400 mg at 14:10, 2 h ago.'),
                    line('The leaflet asks for at least <strong>6 h</strong> between doses: the next one is due at 20:10.'),
                    line('Taking it anyway is your choice; it is written down as an extra dose.'),
                ],
                acceptLook: 'primary',
                acceptLabel: 'Take it anyway',
            });
        }
    });
}

// ---------------------------------------------------------------- table-columns
{
    const table = $('pg-forms-managed');
    on('cards-at', (value) => table.setAttribute('data-kp-cards-at', value));
    on('tbl-width', (value) => $('pg-tbl-box').setAttribute('data-pg-column', value));
    on('tbl-state', (value) => {
        const handle = dataTable(table);
        handle?.query(value === 'empty' ? 'no such form' : '');
        if (value === 'loading') {
            handle?.busy({ overlay: true });
            handle?.state('loading');
        } else if (value === 'error') handle?.fail('The app did not answer in time.');
        else handle?.state('ready');
    });
    table.addEventListener('kp-datatable-retry', () => {
        press('tbl-state', 'ready');
        dataTable(table)?.state('ready');
    });
    $('pg-tbl-box').setAttribute('data-pg-column', 'column');
}

// ---------------------------------------------------------------- fix-error-line
{
    /** The distance from the name field to the pills below it, which an error line that grows would change. @param {string} k */
    const gap = (k) => $(`pg-err-${k}-pills`).getBoundingClientRect().top - $(`pg-err-${k}-name`).getBoundingClientRect().bottom;
    const base = { before: 0, after: 0 };
    const report = () => {
        for (const k of /** @type {const} */ (['before', 'after'])) {
            const shift = Math.round(gap(k) - base[k]);
            say(`pg-err-${k}-log`, `The pills moved ${shift} px`);
        }
    };
    on('err-name', (value) => {
        for (const k of ['before', 'after']) {
            const input = /** @type {HTMLInputElement} */ ($(`pg-err-${k}-name`));
            if (value === 'leave') showError(input, 'Give the medicine a name.', { wrapper: '.kp-field' });
            else clearError(input, { wrapper: '.kp-field' });
        }
        report();
    });
    requestAnimationFrame(() => {
        base.before = gap('before');
        base.after = gap('after');
        report();
    });
}

// ---------------------------------------------------------------- fix-switch-state
on('sw-on', (value) => {
    for (const input of all('#fix-switch-state-component .kp-switch__input')) {
        /** @type {HTMLInputElement} */ (input).checked = value === 'on';
        input.toggleAttribute('checked', value === 'on');
    }
});
