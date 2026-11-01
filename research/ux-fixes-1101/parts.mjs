// research/ux-fixes-1101: the markup of each section's component, written once. The shapes are the apps' own: kyu's Topics table, Medicine
// Cabinet's dose rows and medicine list, http-switchboard's uptime rows, kyu's Publish form. The names, counts, dates and times are mock.

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** kyu, Topics: what the hub has seen on each topic. */
export const TOPICS = [
    ['ha.notify', 4210, '2026-10-31', 'Live'],
    ['backup.done', 188, '2026-11-01', 'Live'],
    ['almanac.event', 962, '2026-10-30', 'Live'],
    ['kyu.runner.heartbeat', 38400, '2026-11-01', 'Live'],
    ['homelab.alert', 304, '2026-10-29', 'Live'],
    ['jellyfin.library', 55, '2026-10-12', 'Idle'],
    ['newsflash.snooze', 17, '2026-09-30', 'Idle'],
    ['obsidian.sync', 2, '2026-08-14', 'Idle'],
    ['printer.status', 8, '2026-07-02', 'Dead letters'],
];

const topicActions = (name) =>
    `<div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm" data-pg-act="open" data-pg-topic="${name}">Open</button><button type="button" class="kp-button kp-button--sm" data-pg-act="purge" data-pg-topic="${name}">Purge</button><button type="button" class="kp-button kp-button--sm kp-button--destructive" data-pg-act="delete" data-pg-topic="${name}">Delete</button></div>`;

/**
 * kyu's Topics table. `filters` puts the three filters on the headers; `actions` adds the actions column; `attrs` goes on the wrapper.
 * @param {{ id: string, filters?: boolean, actions?: boolean, rows?: typeof TOPICS, attrs?: string, empty?: string }} o
 */
export function topicsTable({ id, filters = false, actions = false, rows = TOPICS, attrs = '', empty = '' }) {
    const f = (kind) => (filters ? ` data-kp-filter="${kind}"` : '');
    return `<div class="kp-datatable" id="${id}" data-kp-datatable data-kp-cards data-kp-page-size="10" ${attrs}>
            <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search topics" placeholder="Search topics…" /></div>
            <div class="kp-table-wrap"><table class="kp-table"><caption class="kp-sr-only">Topics</caption>
                <thead><tr><th scope="col" data-kp-sort="text">Topic</th><th scope="col" data-kp-sort="number" class="kp-text-end"${f('range')}>Messages</th><th scope="col" data-kp-sort="date"${f('date')}>Last seen</th><th scope="col" data-kp-sort="text"${f('choice')}>State</th>${actions ? '<th scope="col" data-kp-col="actions">Actions</th>' : ''}</tr></thead>
                <tbody>${rows.map(([name, n, seen, state]) => `<tr data-kp-row-key="${name}"><td>${name}</td><td class="kp-numeric kp-text-end">${n.toLocaleString('en-US')}</td><td class="kp-timestamp">${seen}</td><td>${state}</td>${actions ? `<td data-kp-col="actions">${topicActions(name)}</td>` : ''}</tr>`).join('')}</tbody>
            </table></div>${empty}
            <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p><div class="kp-datatable__pager" data-kp-datatable-pager></div></div>
        </div>`;
}

/** The plate kyu's Dead letters shows with no rows. */
export const DEAD_LETTERS_EMPTY = '<div class="kp-empty" data-kp-datatable-empty hidden><p class="kp-empty__title">No dead letters</p><p>Every message was delivered. A message that fails three times is listed here.</p></div>';

/** Medicine Cabinet, Today: a dose row with Skip and Take; the primary is last. */
const DOSES = [
    ['Ibuprofen 400 mg', '08:00 · with food', ['Skip', 'Take']],
    ['Vitamin D3 25 µg', '12:00 · every day', ['Skip', 'Take']],
    ['Cetirizine 10 mg', '20:00 · when needed', ['Skip', 'Take']],
];
/** @param {string} id @param {string} [attrs] */
export const doseList = (id, attrs = '') =>
    `<ul class="kp-action-list" id="${id}" ${attrs} aria-label="Doses today">${DOSES.map(
        ([name, when, buttons]) =>
            `<li><div><strong>${name}</strong><br /><span class="kp-text-muted">${when}</span></div><div class="kp-row-actions">${buttons.map((b, i) => `<button type="button" class="kp-button${i === buttons.length - 1 ? ' kp-button--primary' : ''}">${b}</button>`).join('')}</div></li>`,
    ).join('')}</ul>`;

/** Medicine Cabinet, Cabinet: the list of rows. `head` adds the column head that carries the switch's label. */
const MEDICINES = [
    ['Ibuprofen 400 mg', 'Tablet · pain and fever', 'Low stock', 14],
    ['Paracetamol 500 mg', 'Tablet · pain and fever', 'In stock', 32],
    ['Vitamin D3 25 µg', 'Capsule · supplement', 'On schedule', 60],
    ['Saline nasal spray', 'Spray · congestion', 'Opened 30 days ago', 1],
];
/** @param {string} id @param {boolean} head */
export function medicineList(id, head) {
    const headRow = head
        ? '<li class="kp-listrow kp-listrow--head" aria-hidden="true"><div class="kp-listrow__identity">Medicine</div><div class="kp-listrow__status">Status</div><div class="kp-listrow__stepper">Stock</div><div class="kp-listrow__switch">Active</div></li>'
        : '';
    const row = ([name, meta, badge, stock]) =>
        `<li class="kp-listrow"><div class="kp-listrow__identity"><strong class="kp-listrow__name">${name}</strong><span class="kp-listrow__meta">${meta}</span></div><div class="kp-listrow__status"><div class="kp-badges"><span class="kp-badge">${badge}</span></div></div><div class="kp-listrow__stepper"><div class="kp-quantity" data-kp-quantity data-kp-quantity-fill data-kp-quantity-min="0" data-kp-quantity-max="200" data-kp-quantity-unit="tablets" data-kp-quantity-unit-one="tablet" data-kp-quantity-label="Stock of ${name}"><input class="kp-quantity__input" value="${stock}" /></div></div><div class="kp-listrow__switch"><label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Active: ${name}" /><span>Active</span></label></div></li>`;
    return `<ul class="kp-list" id="${id}" role="list" aria-label="Medicines">${headRow}${MEDICINES.map(row).join('')}</ul>`;
}

/** kyu, Publish: a topic and a JSON payload, both required. */
export const publishForm = (id) =>
    `<form class="kp-form-grid" id="${id}" data-kp-form novalidate aria-label="Publish a message">
            <div class="kp-field"><label class="kp-field__label" for="${id}-topic">Topic</label><input class="kp-field__input" id="${id}-topic" name="topic" required placeholder="backup.done" /><p class="kp-field__error" data-kp-field-error hidden></p></div>
            <div class="kp-field"><label class="kp-field__label" for="${id}-payload">Payload (JSON)</label><textarea class="kp-field__input kp-field__input--multiline" id="${id}-payload" name="payload" data-kp-json="strict" required rows="4"></textarea><p class="kp-field__error" data-kp-field-error hidden></p></div>
            <div class="kp-field"><span class="kp-field__label" id="${id}-days-l">Days it may be sent</span><div id="${id}-days" data-kp-weekdays data-kp-min="1" aria-labelledby="${id}-days-l"></div></div>
            <div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
            <div><button type="submit" class="kp-button kp-button--primary" data-kp-submit>Publish</button></div>
        </form>`;

/** http-switchboard, Status: one profile's last 48 hours as a strip. */
export const uptimeRow = (id, label, attrs = '') => `<div class="kp-uptime" id="${id}" data-kp-uptime data-kp-uptime-label="${esc(label)}" data-kp-uptime-count="48" ${attrs}></div>`;

/** Medicine Cabinet: "I took one" with nothing left. */
export const outOfStock = (id, attrs = '') =>
    `<ul class="kp-action-list" id="${id}" aria-label="Doses today"><li><div><strong>Cetirizine 10 mg</strong><br /><span class="kp-text-muted">0 tablets left</span></div><div class="kp-row-actions"><button type="button" class="kp-button kp-button--primary" id="${id}-take" disabled data-kp-disabled-reason="Out of stock: add tablets before you log a dose." ${attrs}>I took one</button></div></li></ul>`;
