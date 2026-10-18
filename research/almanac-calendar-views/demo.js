// research/almanac-calendar-views: the page's own wiring. The components are the package's (js/auto.js attaches them); this file
// hands them the SAMPLE data of sample.js, fills the picked day's table and the clicked event's card, and wires the state buttons
// and the one choice set (how the month shows that it is loading).
import { setCalendarDays, setCalendarState, setCalendarLegend, setCalendarCaption, calendarSelect } from '../../js/calendar.js';
import { setWeekEvents, setWeekState, setWeekLegend } from '../../js/week.js';
import { dataTable } from '../../js/datatable.js';
import { CALENDARS, SOURCES, DELIVERIES, FIRST_DAY, TODAY, deliveredOn, human, instant } from './sample.js';

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

const RESULT = { created: ['success', 'Created'], updated: ['info', 'Updated'], failed: ['destructive', 'Failed'] };
const NOTHING = { before: ['Almanac had not started yet', 'The first delivery of 4.1.7 is 09/10/2026.'], none: ['Nothing was delivered on this day', 'Almanac accepted no events.'] };
/** @param {string} text */
const esc = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);

/** @param {Element | null} kv @param {[string, string][]} rows labels and ready-made inline markup */
const fillKv = (kv, rows) => {
    if (kv) kv.innerHTML = rows.map(([k, v]) => `<div class="kp-kv__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
};

// ---------------------------------------------------------------- section 1: deliveries per day
const calendar = /** @type {HTMLElement} */ (document.getElementById('acv-calendar'));
const tableEl = /** @type {HTMLElement} */ (document.getElementById('acv-table'));

/** The tone and the count of one day: delivered of accepted; red when any delivery failed. */
function dayState(/** @type {string} */ iso) {
    if (iso < FIRST_DAY) return { tone: /** @type {const} */ ('before'), label: `${human(iso)}: before Almanac started` };
    if (iso > TODAY) return null;
    const rows = deliveredOn(iso);
    const failed = rows.filter((r) => r.result === 'failed').length;
    const delivered = rows.length - failed;
    return {
        tone: /** @type {const} */ (failed ? 'bad' : rows.length ? 'ok' : 'muted'),
        count: `${delivered}/${rows.length}`,
        label: `${human(iso)}: ${delivered} of ${rows.length} events delivered${failed ? `, ${failed} failed` : ''}`,
    };
}

/** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
const days = {};
for (let d = new Date(Date.UTC(2026, 7, 1)); d <= new Date(Date.UTC(2026, 9, 19)); d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    const state = dayState(iso);
    if (state) days[iso] = state;
}
setCalendarDays(calendar, days);
setCalendarLegend(calendar, [
    { tone: 'ok', label: 'Every event delivered' },
    { tone: 'bad', label: 'At least one failed' },
    { tone: 'before', label: 'Before Almanac started' },
    { tone: 'future', label: 'Still to come' },
]);
setCalendarCaption(calendar, 'Under each day: events delivered of events accepted. Sample data.');

const handle = dataTable(tableEl);
let pickedDay = TODAY;
let tableState = 'ready';

function showDay(/** @type {string} */ iso) {
    pickedDay = iso;
    const rows = iso < FIRST_DAY ? [] : deliveredOn(iso);
    const count = (/** @type {string} */ r) => rows.filter((x) => x.result === r).length;
    const title = document.getElementById('acv-day-title');
    if (title) title.textContent = human(iso);
    fillKv(document.getElementById('acv-day-summary'), [
        ['Accepted', `${rows.length} <span class="kp-sr-only">events</span> <span class="kp-badge">sample</span>`],
        ['Created / updated / failed', `${count('created')} / ${count('updated')} / ${count('failed')}`],
    ]);
    const body = document.getElementById('acv-rows');
    if (body)
        body.innerHTML = rows
            .map((r) => {
                const [tone, word] = RESULT[r.result];
                const source = SOURCES[r.source];
                return `<tr data-kp-row-key="${esc(r.id)}"><td class="kp-timestamp">${r.deliveredAt}</td><td>${esc(r.label)}<span class="acv-sub">${esc(r.source)}${
                    r.reason ? ` · ${esc(r.reason)}` : ''
                }</span></td><td>${esc(CALENDARS[source.calendar].name)}</td><td><span class="kp-badge kp-badge--${tone}">${word}</span></td></tr>`;
            })
            .join('');
    const [t, text] = iso < FIRST_DAY ? NOTHING.before : NOTHING.none;
    document.getElementById('acv-empty-title')?.replaceChildren(t);
    document.getElementById('acv-empty-text')?.replaceChildren(text);
    handle?.refresh();
    applyTableState();
}

function applyTableState() {
    if (!handle) return;
    if (tableState === 'loading') handle.busy({ text: `Reading the journal for ${human(pickedDay)}`, overlay: true });
    else if (tableState === 'failed') handle.fail('The journal answered too slowly. The counts above are from the last read.');
    else {
        handle.busy(null);
        handle.state('ready');
    }
}

calendar.addEventListener('kp-calendar-pick', (event) => showDay(/** @type {CustomEvent} */ (event).detail.date));
showDay(TODAY);
tableEl.addEventListener('kp-datatable-retry', () => {
    tableState = 'loading';
    syncPressed('data-acv-day-state', 'loading');
    applyTableState();
    setTimeout(() => {
        tableState = 'ready';
        syncPressed('data-acv-day-state', 'ready');
        applyTableState();
    }, 1000);
});

const MONTH_WORDS = {
    loading: 'Reading the deliveries of this month',
    empty: 'Nothing was delivered in this month',
    error: 'Could not read the deliveries of this month',
    ready: '',
};

/** @param {string} attribute @param {string} value */
function syncPressed(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const month = target?.closest('[data-acv-month-state]');
    if (month) {
        const state = /** @type {'loading' | 'ready' | 'empty' | 'error'} */ (month.getAttribute('data-acv-month-state'));
        syncPressed('data-acv-month-state', state);
        setCalendarState(calendar, state, MONTH_WORDS[state]);
        return;
    }
    const day = target?.closest('[data-acv-day-state]');
    if (day) {
        tableState = /** @type {string} */ (day.getAttribute('data-acv-day-state'));
        syncPressed('data-acv-day-state', tableState);
        applyTableState();
        return;
    }
    const week = target?.closest('[data-acv-week-state]');
    if (week) {
        const state = /** @type {'loading' | 'ready' | 'empty' | 'error'} */ (week.getAttribute('data-acv-week-state'));
        syncPressed('data-acv-week-state', state);
        if (state === 'ready') setWeekEvents(weekEl, weekEvents);
        else if (state === 'empty') setWeekEvents(weekEl, []);
        setWeekState(
            weekEl,
            state,
            state === 'error' ? 'Could not read the calendars Almanac writes to.' : state === 'empty' ? 'Almanac wrote nothing in this week.' : '',
        );
    }
});

// The choice set: how the month shows that it is loading (a class of the component; the days redraw in place).
document.addEventListener('review:choice', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    if (detail?.id !== 'acv-calendar-loading') return;
    calendar.classList.toggle('kp-calendar--busy-whole', detail.value === 'whole');
    calendar.classList.toggle('kp-calendar--busy-days', detail.value === 'days');
});

// ---------------------------------------------------------------- section 2: this week
const weekEl = /** @type {HTMLElement} */ (document.getElementById('acv-week'));
const byId = new Map(DELIVERIES.map((d) => [d.id, d]));

const weekEvents = DELIVERIES.filter((d) => d.eventDay >= '2026-10-12' && d.eventDay <= '2026-10-25').map((d) => {
    const source = SOURCES[d.source];
    return {
        id: d.id,
        start: instant(d.eventDay, d.eventAt),
        label: d.label,
        series: CALENDARS[source.calendar].series,
        ...(d.result === 'failed' ? { state: /** @type {const} */ ('skipped') } : {}),
        detail: `${source.name} (${d.source}) · ${d.result === 'failed' ? 'delivery failed' : `delivered ${human(d.deliveredDay)} ${d.deliveredAt}`}`,
    };
});
// The next event after the sample "now" (19/10/2026 09:40) is ringed.
const next = DELIVERIES.filter((d) => d.eventDay + d.eventAt > `${TODAY}09:40`).sort((a, b) => (a.eventDay + a.eventAt).localeCompare(b.eventDay + b.eventAt))[0];
const next$ = weekEvents.find((e) => e.id === next?.id);
if (next$) /** @type {any} */ (next$).state = 'next';

setWeekEvents(weekEl, weekEvents);
setWeekLegend(weekEl, [
    { series: CALENDARS.household.series, label: CALENDARS.household.name },
    { series: CALENDARS.infra.series, label: CALENDARS.infra.name },
]);

function showEvent(/** @type {string} */ id) {
    const d = byId.get(id);
    if (!d) return;
    const source = SOURCES[d.source];
    const [tone, word] = RESULT[d.result];
    document.getElementById('acv-event-title')?.replaceChildren(d.label);
    fillKv(document.getElementById('acv-event-kv'), [
        ['Source', `${esc(source.name)} <span class="kp-id">${esc(d.source)}</span>`],
        ['Calendar', esc(CALENDARS[source.calendar].name)],
        ['Event time', `${human(d.eventDay)} ${d.eventAt}`],
        ['Delivered', `<span class="kp-timestamp">${human(d.deliveredDay)} ${d.deliveredAt}</span>`],
        ['Result', `<span class="kp-badge kp-badge--${tone}">${word}</span>${d.reason ? ` ${esc(d.reason)}` : ''}`],
    ]);
}
weekEl.addEventListener('kp-week-open', (event) => showEvent(/** @type {CustomEvent} */ (event).detail.id));
showEvent('ha-19-Dishwasher finished');
