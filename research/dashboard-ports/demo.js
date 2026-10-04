// The demo page's own wiring: copies for the phone frames, the option
// buttons, and the sample data moving. The proposal itself is ports.js.
import { attachActionColumns, attachAttention, attachKpiToggles, attachSparklines, KPI_TOGGLE_EVENT, setStateWord } from './ports.js';
import { attachDataTables, dataTable } from '../../js/datatable.js';

/** @param {string} selector @returns {HTMLElement[]} */
const all = (selector) => /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);

/* ---- copies: the phone frames and "Package today" show the same rows ---- */

const incidents = document.querySelector('[data-dp-actlist]:not([data-dp-mirror])');
if (incidents) {
    for (const target of all('[data-dp-actlist][data-dp-mirror], [data-dp-today]')) target.innerHTML = incidents.innerHTML;
}
const kpis = document.querySelector('[data-dp-kpis]:not([data-dp-mirror])');
if (kpis) for (const target of all('[data-dp-kpis][data-dp-mirror]')) target.innerHTML = kpis.innerHTML;

/* ---- the proposal, attached as a consumer would ---- */

attachActionColumns(document);
attachSparklines(document);
attachKpiToggles(document);

/* ---- options: the buttons in a section, and the review dialog's ticks ---- */

/** What each option does to the page. @type {Record<string, (value: string) => void>} */
const APPLY = {
    phone: (value) => {
        for (const list of all('[data-dp-actlist]')) {
            if (value === 'stack') list.dataset.kpActionPhone = 'stack';
            else delete list.dataset.kpActionPhone;
        }
    },
    rows: (value) => all('[data-dp-tiles]').forEach((grid) => grid.classList.toggle('kp-tiles--per-row', value === 'per-row')),
    pressed: (value) => all('[data-dp-kpis]').forEach((strip) => strip.classList.toggle('kp-kpis--tint', value === 'tint')),
    spark: (value) => all('.kp-kpi__spark').forEach((svg) => svg.classList.toggle('kp-kpi__spark--line', value === 'line')),
    overflow: (value) => {
        const section = document.getElementById('page-header');
        if (section) section.dataset.dpOverflow = value;
    },
    'header-phone': (value) => all('.kp-page-header').forEach((header) => header.classList.toggle('kp-page-header--primary-first', value === 'primary')),
    look: (value) => all('[data-dp-attention]').forEach((band) => band.classList.toggle('kp-attention--soft', value === 'soft')),
};

/** @param {string} name @param {string} value */
const choose = (name, value) => {
    APPLY[name]?.(value);
    for (const button of all(`[data-dp-preview="${name}"] [data-value]`)) button.setAttribute('aria-pressed', String(button.dataset.value === value));
};

for (const group of all('[data-dp-preview]')) {
    group.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-value]')) : null;
        if (button?.dataset.value) choose(group.dataset.dpPreview ?? '', button.dataset.value);
    });
}

// A tick in the review dialog shows that option on the page too. The header's
// phone choice is named "phone" in the dialog, like the list's.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    const item = event.target instanceof Element ? event.target.getAttribute('data-review-item') : null;
    choose(item === 'page-header' && id === 'phone' ? 'header-phone' : id, value);
});

/* ---- 1 · a label that grows ---- */

document.querySelector('[data-dp-longer]')?.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.currentTarget);
    const longer = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(longer));
    for (const assign of all('[data-dp-assign]')) assign.textContent = longer ? 'Assign to the night shift…' : 'Assign…';
});

/* ---- 3 · what the filters would do ---- */

const filterOut = document.querySelector('[data-dp-filter-out]');
document.addEventListener(KPI_TOGGLE_EVENT, (event) => {
    const tile = /** @type {HTMLElement} */ (event.target);
    const name = tile.dataset.dpFilter ?? '';
    const pressed = /** @type {CustomEvent<{ pressed: boolean }>} */ (event).detail.pressed;
    // The two copies of a tile (full width and phone frame) move together.
    for (const twin of all(`[data-dp-filter="${name}"]`)) twin.setAttribute('aria-pressed', String(pressed));
    const on = [...new Set(all('[data-dp-filter][aria-pressed="true"]').map((t) => t.dataset.dpFilter))];
    if (filterOut) filterOut.textContent = on.length ? `Filtering the list below: ${on.join(' and ')} only.` : 'No filter on: every pump house is listed.';
});

/* ---- 5 · the attention band ---- */

const items = /** @type {HTMLTemplateElement | null} */ (document.querySelector('[data-dp-attention-items]'));
const extra = /** @type {HTMLTemplateElement | null} */ (document.querySelector('[data-dp-attention-extra]'));
const bands = all('[data-dp-attention]');
const fill = () => bands.forEach((band) => band.replaceChildren(items ? items.content.cloneNode(true) : ''));
fill();
attachAttention(document);
document.querySelector('[data-dp-attn="add"]')?.addEventListener('click', () => {
    for (const band of bands) if (extra) band.append(extra.content.cloneNode(true));
});
document.querySelector('[data-dp-attn="clear"]')?.addEventListener('click', () => bands.forEach((band) => band.replaceChildren()));
document.querySelector('[data-dp-attn="reset"]')?.addEventListener('click', fill);

/* ---- 7 · state words ---- */

const STATES = ['Running', 'Stopped', 'Restarting', 'Starting in 3 min'];
const PUMPS = ['Pump 1', 'Pump 2', 'Pump 3', 'Pump 4'];
for (const list of all('[data-dp-pumps]')) {
    const proposal = list.dataset.dpPumps === 'proposal';
    PUMPS.forEach((pump, at) => {
        const li = document.createElement('li');
        const name = document.createElement('b');
        name.textContent = pump;
        const word = document.createElement('span');
        if (proposal) {
            word.className = 'kp-state-word';
            word.setAttribute('data-kp-words', STATES.join('\n'));
        }
        word.dataset.dpWord = '';
        word.textContent = STATES[at % STATES.length];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--sm';
        button.textContent = at % 2 ? 'Start' : 'Stop';
        li.append(name, word, button);
        list.append(li);
    });
}
let step = 0;
/** @type {number | undefined} */
let timer;
document.querySelector('[data-dp-cycle]')?.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.currentTarget);
    const on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));
    button.textContent = on ? 'Stop changing' : 'Change the states';
    clearInterval(timer);
    if (!on) return;
    timer = window.setInterval(() => {
        step += 1;
        for (const list of all('[data-dp-pumps]')) {
            [...list.querySelectorAll('[data-dp-word]')].forEach((word, at) => {
                const next = STATES[(at + step) % STATES.length];
                if (word.classList.contains('kp-state-word')) setStateWord(/** @type {HTMLElement} */ (word), next);
                else word.textContent = next;
            });
        }
    }, 1200);
});

/* ---- 8 · two tables loading for the first time ---- */

const busySection = document.getElementById('busy-phone');
if (busySection) {
    attachDataTables(busySection);
    const since = Date.now() - 42_000;
    for (const table of all('[data-dp-busy]')) {
        dataTable(table)?.busy({ text: 'Reading the pump houses from the field units on the northern network…', since, overlay: true });
    }
}
