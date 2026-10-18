// research/almanac-journal: the page's own wiring. Every component is the package's (js/auto.js attaches what the markup
// carries); this file only fills them with the sample data, presses the state buttons, simulates the live service and
// sets the choices of the dialog. Real figures (19/10/2026): version 4.1.7, 3 events accepted, 3 delivered, 0 failed.

import { setCardState } from '../../js/card-state.js';
import { setStackbar } from '../../js/stackbar.js';
import { setSegmentedCounts, setSegmentedValues, getSegmentedValues } from '../../js/segmented.js';
import { attachDataTables, dataTable } from '../../js/datatable.js';
import { setConnection } from '../../js/connection.js';
import { attachRefresh } from '../../js/auto-refresh.js';
import { agoMoment } from '../../js/freshness.js';
import { attachAgo } from '../../js/freshness.js';
import { attachSegmented } from '../../js/segmented.js';
import { attachStatusLists, buildStatusList, setStatus } from '../../js/statusrow.js';
import { attachEntityCards, setEntityGrid } from '../../js/entity-card.js';
import { toast } from '../../js/overlays.js';

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

const $ = (/** @type {string} */ selector, /** @type {ParentNode} */ root = document) => /** @type {HTMLElement | null} */ (root.querySelector(selector));
const escape = (/** @type {string} */ text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ sample data */

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const START = Date.now();

const CALENDAR = { 'home-assistant': 'Almanac · Huishouden', homelab: 'Almanac · Infra', kyu: 'Almanac · Infra', 'claude-sessions': 'Almanac · Infra' };
const SOURCE_NAMES = Object.keys(CALENDAR);

/**
 * Sample deliveries, newest first. `age` is how long before the page opened. Only the totals of the service are real (3 delivered,
 * 0 failed); every row, and the two failures, are sample data, said so on the page.
 * @typedef {{ id: string, at: number, source: string, result: 'created' | 'updated' | 'retrying' | 'failed', title: string, error?: string }} Delivery
 * @type {Delivery[]}
 */
const SAMPLE = [
    {
        age: 1 * MIN,
        source: 'homelab',
        result: 'retrying',
        title: 'Disk space warning',
        error: 'calendar write delayed (HTTP 429)\ntarget: Almanac · Infra\nGoogle said: Rate Limit Exceeded\nnext try: in 1 min 20 s (attempt 2 of 8)',
    },
    { age: 4 * MIN, source: 'home-assistant', result: 'created', title: 'Washing machine finished' },
    { age: 38 * MIN, source: 'kyu', result: 'updated', title: 'Weekly review moved to 17:30' },
    { age: 2 * HOUR + 10 * MIN, source: 'claude-sessions', result: 'created', title: 'Session: calendar views' },
    {
        age: 5 * HOUR,
        source: 'homelab',
        result: 'failed',
        title: 'Nightly backup finished',
        error: 'calendar write refused (HTTP 429)\ntarget: Almanac · Infra\nGoogle said: Rate Limit Exceeded\nnext try: in 4 min 30 s (attempt 3 of 8)',
    },
    { age: 9 * HOUR, source: 'home-assistant', result: 'updated', title: 'Plants watered' },
    { age: DAY + 3 * HOUR, source: 'homelab', result: 'created', title: 'Update installed: jellyfin' },
    { age: DAY + 20 * HOUR, source: 'kyu', result: 'created', title: 'Message hub restarted' },
    { age: 2 * DAY, source: 'home-assistant', result: 'created', title: 'Window left open' },
    {
        age: 3 * DAY,
        source: 'claude-sessions',
        result: 'failed',
        title: 'Session: adoption map',
        error: 'calendar write refused (HTTP 403)\ntarget: Almanac · Infra\nGoogle said: The caller does not have permission\nnext try: none, the entry was dropped after 8 attempts',
    },
    { age: 4 * DAY, source: 'homelab', result: 'updated', title: 'Certificate renewed' },
    { age: 6 * DAY, source: 'kyu', result: 'created', title: 'Reminder: pay the invoice' },
    { age: 8 * DAY, source: 'home-assistant', result: 'updated', title: 'Heating schedule changed' },
].map((row, i) => ({ id: `sample-${i}`, at: START - row.age, source: row.source, result: row.result, title: row.title, error: row.error }));

const RESULT = { created: ['Created', 'success'], updated: ['Updated', 'info'], retrying: ['Retrying', 'warning'], failed: ['Failed', 'destructive'] };
/** The Result column's index as the table counts it (the toggle column comes first). @param {HTMLElement} root */
const resultColumn = (root) => [...root.querySelectorAll('thead th')].findIndex((th) => th.hasAttribute('data-kp-filter'));

/* ------------------------------------------------------------------ the deliveries table (sections 2 and 3) */

/** @param {Delivery} d */
function rowHtml(d) {
    const [word, tone] = RESULT[d.result];
    const moment = agoMoment(d.at);
    const calendar = CALENDAR[d.source];
    const detail =
        d.result === 'failed' || d.result === 'retrying'
            ? `<div class="aj-detail"><p><b>${d.result === 'failed' ? 'Google did not accept the change.' : 'Google asked Almanac to wait.'}</b> The entry &ldquo;${escape(d.title)}&rdquo; stays in the journal and Almanac ${d.result === 'failed' ? 'has given up on it.' : 'tries again on its own.'}</p><pre class="kp-code-block"><code>${escape(d.error ?? '')}</code></pre></div>`
            : `<div class="aj-detail"><p><b>${word} ${moment}.</b> The entry &ldquo;${escape(d.title)}&rdquo; was written to ${escape(calendar)}. No errors.</p></div>`;
    return (
        `<tr data-kp-row-key="${d.id}">` +
        `<td data-label="When" data-kp-sort-value="${d.at}"><time class="kp-ago" data-kp-ago="${new Date(d.at).toISOString()}" datetime="${new Date(d.at).toISOString()}" data-kp-ago-verb="delivered" title="${moment}"></time></td>` +
        `<td data-label="Source"><span class="kp-tag">${escape(d.source)}</span></td>` +
        `<td data-label="Result" data-kp-filter-value="${d.result}"><span class="kp-badge kp-badge--${tone}" data-kp-semantic>${word}</span></td>` +
        `</tr>` +
        `<tr data-kp-row-detail hidden><td colspan="4">${detail}</td></tr>`
    );
}

/** @param {string} id @param {number} pageSize @param {boolean} single */
function tableHtml(id, pageSize, single) {
    return `
<div class="kp-datatable aj-table" id="${id}" data-kp-datatable data-kp-expandable ${single ? 'data-kp-expand-single' : 'data-kp-expand-single="false"'} data-kp-sort-multi="click" data-kp-page-size="${pageSize}" data-kp-page-sizes="none">
    <div class="kp-datatable__bar aj-bar">
        <div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Show deliveries by result">
            <button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span><span class="kp-segmented__count"></span></button>
            <button type="button" class="kp-segmented__item" data-value="created" aria-pressed="false"><span class="kp-segmented__label">Created</span><span class="kp-segmented__count"></span></button>
            <button type="button" class="kp-segmented__item" data-value="updated" aria-pressed="false"><span class="kp-segmented__label">Updated</span><span class="kp-segmented__count"></span></button>
            <button type="button" class="kp-segmented__item" data-value="retrying" aria-pressed="false"><span class="kp-segmented__label">Retrying</span><span class="kp-segmented__count"></span></button>
            <button type="button" class="kp-segmented__item" data-value="failed" aria-pressed="false"><span class="kp-segmented__label">Failed</span><span class="kp-segmented__count"></span></button>
        </div>
        <input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the deliveries" placeholder="Search source or result" />
    </div>
    <div class="kp-table-wrap">
        <table class="kp-table">
            <caption class="kp-sr-only">Recent deliveries, newest first; each row opens for details</caption>
            <thead>
                <tr>
                    <th scope="col" data-kp-sort="number">When</th>
                    <th scope="col" data-kp-sort="text">Source</th>
                    <th scope="col" data-kp-sort="text" data-kp-filter="choice">Result</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="kp-empty" data-kp-datatable-empty data-kp-art="nomatch" hidden>
        <p class="kp-empty__title">Nothing matches</p>
        <p class="kp-empty__body">No delivery fits this filter.</p>
        <button type="button" class="kp-button kp-button--secondary" data-kp-datatable-clear>Clear the filter</button>
    </div>
    <div class="kp-datatable__bar">
        <p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
        <div class="kp-datatable__pager" data-kp-datatable-pager></div>
    </div>
</div>`;
}

/**
 * One deliveries table: its data, its chips and its card. Both sections build one, from a copy of the same sample rows.
 * `render()` draws it again from the rows (an option the component reads when it attaches is flipped that way).
 * @param {HTMLElement} host
 * @param {string} id
 * @param {number} pageSize
 */
function deliveriesTable(host, id, pageSize) {
    /** @type {Delivery[]} */
    const rows = SAMPLE.map((d) => ({ ...d }));
    let single = true;
    let next = 0;
    const self = {
        rows,
        /** @type {HTMLElement} */
        root: /** @type {any} */ (null),
        counts() {
            return {
                all: rows.length,
                created: rows.filter((r) => r.result === 'created').length,
                updated: rows.filter((r) => r.result === 'updated').length,
                retrying: rows.filter((r) => r.result === 'retrying').length,
                failed: rows.filter((r) => r.result === 'failed').length,
            };
        },
        writeCounts() {
            setSegmentedCounts(/** @type {HTMLElement} */ ($('.kp-segmented', self.root)), self.counts());
        },
        /** @param {boolean} [attach] true after the page settled: attach the new markup ourselves */
        render(attach = false) {
            host.innerHTML = tableHtml(id, pageSize, single);
            self.root = /** @type {HTMLElement} */ ($('.kp-datatable', host));
            /** @type {HTMLElement} */ ($('tbody', self.root)).innerHTML = rows.map(rowHtml).join('');
            if (attach) {
                attachDataTables(host);
                attachSegmented(host);
            }
            joinChips(self.root);
            self.writeCounts();
        },
        /** @param {boolean} value */
        setSingle(value) {
            single = value;
            self.render(true);
        },
        /** A delivery arrives: its row goes in at the top, in place, and the table is told. @param {'created' | 'updated' | 'retrying' | 'failed'} result */
        add(result) {
            next += 1;
            const source = SOURCE_NAMES[(next + 1) % SOURCE_NAMES.length] ?? 'kyu';
            /** @type {Delivery} */
            const d = {
                id: `live-${id}-${next}`,
                at: Date.now(),
                source,
                result,
                title: result === 'failed' ? 'Sample event that Google refused' : `Sample event ${next} from ${source}`,
                error:
                    result === 'failed'
                        ? `calendar write refused (HTTP 503)\ntarget: ${CALENDAR[source]}\nGoogle said: Backend Error\nnext try: in 30 s (attempt 1 of 8)`
                        : undefined,
            };
            rows.unshift(d);
            const template = document.createElement('template');
            template.innerHTML = rowHtml(d);
            /** @type {HTMLElement} */ ($('tbody', self.root)).prepend(template.content);
            dataTable(self.root)?.refresh();
            self.writeCounts();
        },
    };
    self.render();
    return self;
}

/** Joins the chips to the table's Result filter, both ways. @param {HTMLElement} root */
function joinChips(root) {
    const chips = /** @type {HTMLElement} */ ($('.kp-segmented', root));
    chips.addEventListener('kp-segmented-change', () => {
        const values = getSegmentedValues(chips);
        dataTable(root)?.filter(resultColumn(root), values.length ? values : null);
    });
    root.addEventListener('kp-datatable-view', (event) => {
        const filter = /** @type {CustomEvent} */ (event).detail?.filters?.[resultColumn(root)];
        const now = Array.isArray(filter) ? filter : [];
        const have = getSegmentedValues(chips);
        if (now.join() !== have.join()) setSegmentedValues(chips, now);
    });
}

const staticTable = deliveriesTable(/** @type {HTMLElement} */ ($('[data-aj-deliveries="static"]')), 'aj-table-static', 8);
const liveTable = deliveriesTable(/** @type {HTMLElement} */ ($('[data-aj-deliveries="live"]')), 'aj-table-live', 6);

/* ------------------------------------------------------------------ the sources (section 4) */

/** @type {{ id: string, state: 'ok' | 'warn', fix?: string, read: string }[]} */
const PROFILES = [
    { id: 'home-assistant', state: 'ok', read: 'served' },
    { id: 'homelab', state: 'ok', read: 'served' },
    { id: 'kyu', state: 'ok', read: 'served' },
    { id: 'claude-sessions', state: 'warn', read: 'the file changed on disk', fix: 'Reload the profiles to serve the changed file.' },
];
let sourcesView = 'rows';
const sourcesHost = /** @type {HTMLElement} */ ($('[data-aj-sources]'));

function drawSources() {
    sourcesHost.replaceChildren();
    sourcesHost.className = 'kp-card__data aj-sources';
    if (sourcesView === 'rows') {
        const list = buildStatusList(
            PROFILES.map((p) => ({
                id: p.id,
                label: p.id,
                detail: `${CALENDAR[p.id]} · ${p.read}`,
                state: p.state,
                ...(p.fix ? { fix: p.fix } : {}),
            })),
            { label: 'Sources and their calendars', single: true, retry: false },
        );
        list.classList.add('kp-statuslist--rows');
        sourcesHost.append(list);
        attachStatusLists(sourcesHost);
    } else {
        const grid = document.createElement('div');
        grid.className = 'kp-entity-grid';
        grid.setAttribute('data-kp-entity-grid', '');
        grid.setAttribute('role', 'list');
        sourcesHost.append(grid);
        attachEntityCards(sourcesHost);
        setEntityGrid(
            grid,
            PROFILES.map((p) => ({
                key: p.id,
                name: p.id,
                vmid: 'schema 2',
                state: p.state === 'ok' ? { label: 'Served', tone: 'success' } : { label: 'Needs a reload', tone: 'warning' },
                figures: [
                    { value: 'Europe/Brussels', label: 'time zone' },
                    { value: '60 min', label: 'default length' },
                ],
                flags: [{ label: CALENDAR[p.id] ?? '' }],
            })),
        );
    }
}
drawSources();

/* ------------------------------------------------------------------ section 1: the glance */

document.addEventListener('kp-kpi-toggle', () => drawGlance());
const model = { waiting: 0, accepted: 3, delivered: 3, failed: 0, created: 2, updated: 1 };
let outcomeLook = 'legend';

function drawGlance() {
    const set = (/** @type {string} */ id, /** @type {number} */ n) => {
        const el = $(`#${id}`);
        if (el && el.textContent !== String(n)) el.textContent = String(n);
    };
    set('aj-waiting', model.waiting);
    set('aj-delivered', model.delivered);
    set('aj-failed', model.failed);
    const waiting = $('#aj-kpi-waiting');
    const failed = $('#aj-kpi-failed');
    if (model.waiting > 0) waiting?.setAttribute('data-kp-tone', 'warning');
    else waiting?.removeAttribute('data-kp-tone');
    if (model.failed > 0) failed?.setAttribute('data-kp-tone', 'destructive');
    else failed?.removeAttribute('data-kp-tone');
    const note = $('#aj-waiting-note');
    if (note) note.textContent = model.waiting === 0 ? 'Nothing is waiting' : model.waiting === 1 ? 'On its way to the calendar' : 'On their way to the calendars';
    const failedNote = $('#aj-failed-note');
    if (failedNote) failedNote.textContent = model.failed === 0 ? 'None gave up' : 'Gave up; see Recent deliveries';

    const journal = $('#aj-health-journal');
    if (journal) {
        journal.setAttribute('data-state', model.waiting > 0 ? 'warn' : 'ok');
        const text = $('[data-aj-health-text]', journal);
        if (text) text.textContent = model.waiting > 0 ? `Readable, ${model.waiting} waiting to be delivered` : 'Readable, nothing pending';
    }

    const bar = /** @type {HTMLElement} */ ($('#aj-outcomes'));
    const compact = outcomeLook === 'compact';
    bar.classList.toggle('kp-stackbar--sm', compact);
    const only = new Set(
        [...document.querySelectorAll('[data-aj-outcome][aria-pressed="true"]')].map((b) => b.getAttribute('data-aj-outcome')),
    );
    const parts = [
        { key: 'created', label: 'Created', value: model.created, group: 'delivered' },
        { key: 'updated', label: 'Updated', value: model.updated, group: 'delivered' },
        { key: 'failed', label: 'Failed', value: model.failed, group: 'failed', tone: /** @type {'destructive'} */ ('destructive') },
    ].filter((p) => only.size === 0 || only.has(p.group));
    const total = parts.reduce((sum, p) => sum + p.value, 0);
    setStackbar(bar, {
        title: only.size ? `Outcomes since start: ${[...only].join(' and ')} only` : 'Outcomes since start',
        summary: `${total} ${only.size ? 'shown' : 'finished'}`,
        legend: !compact,
        parts,
        state: total === 0 ? 'empty' : 'ready',
        message: 'Nothing of this kind since the service started.',
    });
}

/** @param {'arrive' | 'deliver' | 'fail'} action */
function glanceDo(action) {
    if (action === 'arrive') {
        model.accepted += 1;
        model.waiting += 1;
    } else {
        if (model.waiting === 0) model.accepted += 1;
        else model.waiting -= 1;
        if (action === 'fail') model.failed += 1;
        else {
            model.delivered += 1;
            if (model.delivered % 2) model.created += 1;
            else model.updated += 1;
        }
    }
    drawGlance();
}

/* ------------------------------------------------------------------ state buttons and actions */

/** @param {HTMLElement} button */
function pressInGroup(button) {
    for (const other of button.closest('[role="group"]')?.querySelectorAll('[aria-pressed]') ?? []) other.setAttribute('aria-pressed', String(other === button));
}

const GLANCE_NOTES = {
    error: { title: 'The journal could not be read', text: 'Almanac did not answer. Nothing was lost; try again.' },
};
const TABLE_NOTES = {
    empty: { title: 'Nothing delivered yet this run', text: 'When Almanac writes an event to a calendar, it appears here.' },
    error: { title: 'The deliveries could not be read', text: 'Almanac did not answer. Nothing was lost; try again.' },
};
const SOURCE_NOTES = {
    empty: { title: 'No profile files on disk', text: 'Add a profile file for a source, then reload the profiles.' },
    error: { title: 'The profile files could not be read', text: 'Almanac could not list them. Try again in a moment.' },
};

/**
 * @param {string} cardSelector
 * @param {string} attribute the data attribute of the state buttons
 * @param {Record<string, { title: string, text: string }>} notes
 */
function wireStates(cardSelector, attribute, notes) {
    const card = /** @type {HTMLElement} */ ($(cardSelector));
    const set = (/** @type {string} */ state) => {
        setCardState(card, /** @type {any} */ (state), notes[state] ?? {});
        for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === state));
    };
    document.addEventListener('click', (event) => {
        const button = event.target instanceof Element ? event.target.closest(`[${attribute}]`) : null;
        if (button instanceof HTMLElement) set(button.getAttribute(attribute) ?? 'ready');
    });
    card.addEventListener('kp-card-retry', () => set('ready'));
}
wireStates('#journal-glance-component', 'data-aj-glance-state', GLANCE_NOTES);
wireStates('#journal-deliveries-component', 'data-aj-table-state', TABLE_NOTES);
wireStates('#aj-live-card', 'data-aj-live-state', GLANCE_NOTES);
wireStates('#sources-component', 'data-aj-sources-state', SOURCE_NOTES);

document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const glance = event.target.closest('[data-aj-glance-do]');
    if (glance) glanceDo(/** @type {'arrive' | 'deliver' | 'fail'} */ (glance.getAttribute('data-aj-glance-do')));
    const live = event.target.closest('[data-aj-live-do]');
    if (live) {
        const failure = live.getAttribute('data-aj-live-do') === 'failure';
        liveTable.add(failure ? 'failed' : liveTable.rows.length % 2 ? 'created' : 'updated');
    }
    const connection = event.target.closest('[data-aj-connection]');
    if (connection instanceof HTMLElement) {
        pressInGroup(connection);
        const banner = /** @type {HTMLElement} */ ($('#aj-connection'));
        const state = connection.getAttribute('data-aj-connection');
        if (state === 'online') setConnection(banner, 'online');
        else if (state === 'reconnecting') setConnection(banner, 'reconnecting', { attempt: 2 });
        else setConnection(banner, 'refused', { why: 'The Almanac service did not accept the connection.' });
        connectionState = state ?? 'online';
    }
});

let connectionState = 'online';

/* ------------------------------------------------------------------ the reload button (section 4) */

const realFetch = window.fetch.bind(window);
window.fetch = (url, init) => {
    if (String(url) !== '/sources/reload') return realFetch(url, init);
    const card = $('#sources-component');
    const state = card?.getAttribute('data-kp-state');
    return new Promise((resolve) =>
        setTimeout(() => {
            if (state === 'empty') resolve(Response.json({ error: 'No profile files were found.', remedy: 'Add one, then reload.' }, { status: 409 }));
            else if (state === 'error') resolve(Response.json({ error: 'The profile files could not be read.', remedy: 'Try again in a moment.' }, { status: 503 }));
            else {
                for (const p of PROFILES) {
                    p.state = 'ok';
                    p.read = `reloaded ${agoMoment(Date.now())}`;
                    delete p.fix;
                }
                drawSources();
                resolve(Response.json({ message: `${PROFILES.length} profiles reloaded from disk.` }));
            }
        }, 900),
    );
};
document.addEventListener('kp-flash', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    if (detail?.state === 'success' && /** @type {Element} */ (event.target).id === 'aj-reload' && detail.line) toast(detail.line);
});

/* ------------------------------------------------------------------ choices of the dialog */

document.addEventListener('review:choice', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    if (detail?.id === 'outcome-bar') {
        outcomeLook = String(detail.value);
        drawGlance();
    }
    if (detail?.id === 'sources-view') {
        sourcesView = String(detail.value);
        drawSources();
    }
    if (detail?.id === 'rows-open') {
        staticTable.setSingle(detail.value === 'one');
        liveTable.setSingle(detail.value === 'one');
    }
    if (detail?.id === 'refresh-look') drawRefresh(String(detail.value));
});

/** Draws the refresh control again: the look is read when it attaches. @param {string} look */
function drawRefresh(look) {
    const old = /** @type {HTMLElement} */ ($('#aj-refresh'));
    const fresh = /** @type {HTMLElement} */ (old.cloneNode(false));
    fresh.setAttribute('data-kp-look', look);
    fresh.setAttribute('data-kp-refresh', String(refreshHandleSeconds(old)));
    old.replaceWith(fresh);
    attachRefresh(/** @type {HTMLElement} */ (fresh.parentElement));
    fresh.addEventListener('kp-refresh', onRefresh);
}
/** @param {HTMLElement} el */
const refreshHandleSeconds = (el) => Number(el.getAttribute('data-kp-refresh') ?? 0);
/** @param {Event} event */
function onRefresh(event) {
    /** @type {CustomEvent} */ (event).detail.done(connectionState === 'online');
}

/* ------------------------------------------------------------------ go */

await ready;

// Tables written by this file come after auto.js looked at the page: attach what it did not.
for (const table of [staticTable, liveTable]) {
    if (dataTable(table.root)) continue;
    const host = /** @type {HTMLElement} */ (table.root.parentElement);
    attachDataTables(host);
    attachSegmented(host);
}
drawGlance();
attachAgo(document);

$('#aj-refresh')?.addEventListener('kp-refresh', onRefresh);
