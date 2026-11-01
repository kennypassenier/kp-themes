// research/ux-fixes-1101: the page's own wiring. Every component is the package's (attached by js/auto.js from its data-kp-* attributes);
// this file wires each section's controls by the section's own elements: the filters panel and its measure, the table's states, the row
// actions, the Publish form's states, the width of the stage, and the two touch behaviours a mouse cannot show by itself. The data is mock.
import { attachAll } from '../../js/auto.js';
import { dataTable } from '../../js/datatable.js';
import { setUptime } from '../../js/uptime.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** One line the page says under a component. @param {string} id @param {string} words */
const say = (id, words) => {
    $(id).textContent = words;
};
/** Two animation frames: what a press changed has been laid out. */
const settle = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(undefined))));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** Press a group's button from the page. @param {string} name @param {string} value */
const press = (name, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"]`)) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};
/** Show one of two stands and hide the other. @param {string} shown @param {string} hidden */
const swap = (shown, hidden) => {
    $(shown).hidden = false;
    $(hidden).hidden = true;
};
/** The data table's wrapper that stands in a stage. @param {string} stage */
const tableIn = (stage) => /** @type {HTMLElement} */ ($(stage).querySelector('[data-kp-datatable]'));

on('width', (value, button) => {
    $(button.dataset.target ?? '').setAttribute('data-pg-width', value);
});

// ---------------------------------------------------------------- filters
/** Where the line under the table stands, in page pixels. */
const underAt = () => Math.round($('pg-f-under').getBoundingClientRect().top + scrollY);
on('fpanel', (value) => {
    swap(value === 'inline' ? 'pg-f-inline' : 'pg-f-popover', value === 'inline' ? 'pg-f-popover' : 'pg-f-inline');
    press('fopen', 'closed');
    say('pg-f-log', '');
});
on('fopen', async (value) => {
    const handle = dataTable(tableIn($('pg-f-popover').hidden ? 'pg-f-inline' : 'pg-f-popover'));
    const before = underAt();
    handle?.editFilter(value === 'open' ? 1 : null);
    await settle();
    const after = underAt();
    say('pg-f-log', `The line under the table stands at ${before} px, and at ${after} px with the panel ${value === 'open' ? 'open' : 'closed'}: it moved ${after - before} px.`);
});

// ---------------------------------------------------------------- table states
const statesTable = tableIn('states-component');
const savedRows = [...(statesTable.querySelector('tbody')?.rows ?? [])];
const showRows = () => {
    const body = /** @type {HTMLTableSectionElement} */ (statesTable.querySelector('tbody'));
    if (body.rows.length === 0) body.append(...savedRows);
    dataTable(statesTable)?.state('ready');
    dataTable(statesTable)?.refresh();
};
on('tstate', (value) => {
    const handle = dataTable(statesTable);
    if (value === 'rows') showRows();
    else if (value === 'empty') {
        statesTable.querySelector('tbody')?.replaceChildren();
        handle?.state('ready');
        handle?.refresh();
    } else handle?.fail('The hub did not answer. Nothing was lost.');
    say('pg-s-log', value === 'rows' ? '' : `${value === 'empty' ? 'Empty' : 'Failed'}: the plate is ${Math.round(statesTable.getBoundingClientRect().height)} px high.`);
});
on('tpager', (value) => dataTable(statesTable)?.pageSize(value === 'two' ? 5 : 10));
statesTable.addEventListener('kp-datatable-retry', () => {
    showRows();
    press('tstate', 'rows');
    say('pg-s-log', 'Try again was pressed: the rows are back.');
});

// ---------------------------------------------------------------- row actions
on('ractions', (value) => swap(value === 'menu' ? 'pg-r-menu' : 'pg-r-stack', value === 'menu' ? 'pg-r-stack' : 'pg-r-menu'));
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-pg-act]')) : null;
    if (button) say('pg-r-log', `${button.textContent?.trim()} was pressed on ${button.dataset.pgTopic}.`);
});

// ---------------------------------------------------------------- the Publish form
const stage = $('pg-publish-stage');
/** @type {(() => void) | null} */
let detachForm = null;
/** Draw the form clean, then put it in the state asked for. @param {string} state */
async function mountForm(state) {
    detachForm?.();
    const template = /** @type {HTMLTemplateElement} */ ($('pg-publish-tpl'));
    stage.replaceChildren(template.content.cloneNode(true));
    const attached = attachAll(stage);
    detachForm = attached;
    await attached.ready;
    const payload = /** @type {HTMLTextAreaElement} */ (stage.querySelector('textarea'));
    if (state === 'left') {
        payload.focus();
        payload.blur();
    } else if (state === 'sent') {
        /** @type {HTMLFormElement} */ (stage.querySelector('form')).requestSubmit();
    }
    await settle();
    say('pg-req-log', state === 'fresh' ? 'Nothing has been left or sent yet: nothing is marked.' : '');
}
on('rform', (value) => void mountForm(value));
void mountForm('fresh');

// ---------------------------------------------------------------- a disabled reason on touch
on('pointer-reason', (value) => {
    const button = $('pg-d-list-take');
    if (value === 'touch') button.setAttribute('data-kp-reason-line', 'always');
    else button.removeAttribute('data-kp-reason-line');
});

// ---------------------------------------------------------------- the uptime strips
/** 48 hourly periods ending now, with one bad hour; the lines of that hour say what happened. @param {number} bad */
const hours = (bad) =>
    Array.from({ length: 48 }, (_, i) => {
        const hour = `${String((i + 9) % 24).padStart(2, '0')}:00`;
        const down = i === bad;
        return {
            key: `h${i}`,
            label: hour,
            state: /** @type {'up' | 'down'} */ (down ? 'down' : 'up'),
            uptime: down ? 0.4 : 1,
            incidents: down ? 1 : 0,
            details: down ? ['Three probes failed in a row', `Back up at ${hour.slice(0, 2)}:40`] : ['No probe failed', 'Median answer 38 ms'],
        };
    });
const STRIPS = [
    ['pg-u-jelly', 'jellyfin', 30],
    ['pg-u-ha', 'home-assistant', 12],
];
/** @param {boolean} touch */
function drawStrips(touch) {
    for (const [id, label, bad] of STRIPS) {
        const strip = $(id);
        strip.toggleAttribute('data-kp-uptime-row-tap', touch);
        setUptime(strip, { label, periods: hours(Number(bad)), ...(touch ? { open: /** @type {const} */ ('info') } : {}) });
    }
}
on('pointer-uptime', (value) => {
    drawStrips(value === 'touch');
    say('pg-u-log', value === 'touch' ? 'Press the row between two cells: the nearest hour opens.' : 'Point at a cell for its card; a press opens nothing.');
});
document.addEventListener('kp-uptime-open', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    say('pg-u-log', `Opened ${detail.period.label} (${detail.period.state}).`);
});
drawStrips(false);

// ---------------------------------------------------------------- the list's column head
on('head', (value) => swap(value === 'head' ? 'pg-l-head' : 'pg-l-plain', value === 'head' ? 'pg-l-plain' : 'pg-l-head'));
