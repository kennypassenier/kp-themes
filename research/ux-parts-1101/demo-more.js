// research/ux-parts-1101: the wiring of the last three sections: kyu's refresh controls, Almanac's Status with its two date
// navigations, and Medicine Cabinet's stock table with Delete and Undo. The shared helpers are demo.js's.

import { attachCalendars, setCalendarDays, setCalendarState } from '../../js/calendar.js';
import { attachWeeks, setWeekEvents, setWeekState } from '../../js/week.js';
import { attachDateNavs, setDateNav } from '../../js/date-nav.js';
import { attachRefresh } from '../../js/auto-refresh.js';
import { attachRowUndo } from '../../js/row-undo.js';
import { dataTable } from '../../js/datatable.js';
import { $, REPLY_MS, answer, on, pressed, say } from './demo.js';
import { deliveryDays, syncRuns } from './data.js';

/** The day the page stands on: Sunday 1 November 2026. */
const TODAY = '2026-11-01';

// ---------------------------------------------------------------- 5 · auto-refresh-form (kyu's Topics header)
attachRefresh(document);
for (const id of ['pg-refresh-now', 'pg-refresh-new']) {
    // The hub answers every refresh after a moment, as kyu's dashboard does.
    $(id)?.addEventListener('kp-refresh', (event) => {
        const { done } = /** @type {CustomEvent<{ done: (ok: boolean) => void }>} */ (event).detail;
        void answer(REPLY_MS).then(() => done(true));
    });
}

// ---------------------------------------------------------------- 6 · date-nav (Almanac's Status)
const month = $('pg-month');
const week = $('pg-week');
attachCalendars(document);
attachWeeks(document);
if (month) setCalendarDays(month, deliveryDays());
if (week) setWeekEvents(week, syncRuns());
attachDateNavs(document);
for (const id of ['pg-month-nav', 'pg-week-nav']) {
    const nav = $(id);
    if (nav) setDateNav(nav, TODAY);
    nav?.addEventListener('kp-date-nav-change', (event) => {
        const { mode, start, end, by } = /** @type {CustomEvent<{ mode: string, start: string, end: string, by: string }>} */ (event).detail;
        say('pg-dates-log', `kp-date-nav-change: ${mode} ${start} to ${end}, by ${by}`);
    });
}
on('state', (value) => {
    const state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value);
    if (month) {
        setCalendarState(month, state);
        if (state === 'ready') setCalendarDays(month, deliveryDays());
    }
    if (week) {
        setWeekState(week, state, '', state === 'empty' ? { text: 'No sync is planned in this week.' } : state === 'error' ? { text: 'Almanac did not answer.' } : {});
        if (state === 'ready') setWeekEvents(week, syncRuns());
    }
});

// ---------------------------------------------------------------- 7 · row-undo-delete (Medicine Cabinet's stock table)
const stock = $('pg-stock');
const rowsAsDrawn = stock?.querySelector('tbody')?.innerHTML ?? '';
attachRowUndo(document);
stock?.addEventListener('kp-row-delete', (event) => say('pg-stock-log', `kp-row-delete: ${/** @type {CustomEvent<{ key: string }>} */ (event).detail.key}`));
stock?.addEventListener('kp-row-delete-undo', (event) => say('pg-stock-log', `kp-row-delete-undo: ${/** @type {CustomEvent<{ key: string }>} */ (event).detail.key} is back`));
stock?.addEventListener('kp-row-delete-commit', (event) => {
    const { key, waitUntil } = /** @type {CustomEvent<{ key: string, waitUntil: (p: Promise<unknown>) => void }>} */ (event).detail;
    const fails = pressed('commit', 'pg-stock', 'ok') === 'fail';
    say('pg-stock-log', `kp-row-delete-commit: ${key}${fails ? ', the delete fails and the row comes back' : ', deleted for good'}`);
    waitUntil(answer(REPLY_MS, fails ? 'The cabinet did not answer.' : undefined));
});
on('commit', (value) =>
    say('pg-stock-log', value === 'fail' ? 'The next delete fails when its Undo window closes; the row comes back.' : 'The next delete is done for good when its Undo window closes.'),
);
on('rows', () => {
    const body = stock?.querySelector('tbody');
    if (!stock || !body) return;
    body.innerHTML = rowsAsDrawn;
    dataTable(stock)?.refresh({ keepPage: true });
    say('pg-stock-log', 'All five medicines are back in the table.');
});
