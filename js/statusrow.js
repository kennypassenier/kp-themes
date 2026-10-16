// Status rows: one state per item [kpadopt2-tiles; the dashboard's
// `perstack-chip`].
//
// A page that reads or checks many things one by one (a backup per stack, a
// health check per host) shows each item as a row that is OK, still loading,
// failed (with the reason, and a Retry that tries that one item again) or
// empty (with the reason there is nothing). `data-state` on each row is the
// source; this module keeps the rest in step with it, as js/steplist.js does:
//
//   <ul class="kp-statuslist" aria-label="Backups per stack">
//     <li class="kp-statusrow" data-state="failed" data-kp-status-id="vault">
//       <span class="kp-statusrow__mark" aria-hidden="true"></span>
//       <span class="kp-statusrow__body">
//         <span class="kp-statusrow__label">vault</span>
//         <span class="kp-statusrow__detail">The host did not answer in 20 s</span>
//       </span>
//       <span class="kp-statusrow__action"><button type="button" class="kp-button kp-button--sm">Retry</button></span>
//     </li>
//   </ul>
//
// What attachStatusLists() writes, so the markup can stay that short:
//   - the mark's spinner on a loading row (the mark is otherwise drawn by CSS
//     from `data-state`), `aria-busy` on that row;
//   - the state's word in `.kp-statusrow__state` (visually hidden), so a reader
//     moving through the list hears "vault, failed";
//   - the action cell with a Retry button, shown on a failed row only (leave it
//     out with `data-kp-status-retry="false"` on the list); its name says which
//     row it retries. Pressing it fires `kp-status-retry` on the list and
//     changes nothing else: the page decides what a retry is (usually
//     `setStatus(list, id, { state: 'loading' })`). When the focused Retry goes
//     away with the state change, the focus moves to the row's body, so the
//     keyboard keeps its place;
//   - a visually hidden `role="status"` region after the list, which says "vault:
//     failed, The host did not answer" when a row changes after the list was
//     attached. The list itself is not a live region: it would read every row
//     again. A burst of changes in one tick is one announcement, and more than
//     three become "12 updated, 2 failed".
//
// Change a row with setStatus(list, 'vault', { state: 'loading', detail: 'reading (3 s)' });
// a framework that sets `data-state` itself is followed too. Every word it adds
// is in js/strings.js.

import { getStrings } from './strings.js';

/** The lists this module looks after. */
export const STATUS_LIST = '.kp-statuslist';
/** The attribute that names a row, for setStatus(). */
export const STATUS_ID_ATTRIBUTE = 'data-kp-status-id';
/** Fired on the list, bubbling, when a row changed state after attach: `{ item, id, state, previous }`. */
export const STATUS_EVENT = 'kp-status-change';
/** Fired on the list, bubbling, when a Retry is pressed: `{ item, id }`. */
export const STATUS_RETRY_EVENT = 'kp-status-retry';
/** The states a row can be in. */
export const STATUS_STATES = /** @type {const} */ (['ok', 'loading', 'failed', 'empty']);

/**
 * @typedef {'ok' | 'loading' | 'failed' | 'empty'} StatusState
 * @typedef {object} StatusRow
 * @property {string} [id] names the row for setStatus(); defaults to its label
 * @property {string} label
 * @property {string} [detail] the short line under the label: how long, the reason; give every row one so a reason arriving later moves nothing
 * @property {StatusState} [state] loading when absent
 */

/** The state each row was last synced to. @type {WeakMap<Element, string>} */
const synced = new WeakMap();
/** The messages waiting to be announced, per region. @type {WeakMap<Element, { label: string, state: StatusState, detail: string }[]>} */
const pending = new WeakMap();

/** @param {unknown} state @returns {StatusState} */
const known = (state) => (STATUS_STATES.includes(/** @type {any} */ (state)) ? /** @type {StatusState} */ (state) : 'loading');

/** @param {StatusState} state */
const stateWord = (state) => {
    const s = getStrings();
    return { ok: s.statusOk, loading: s.statusLoading, failed: s.statusFailed, empty: s.statusEmpty }[state];
};

/** @param {string} className @param {string} [tag] */
const el = (className, tag = 'span') => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
};

/**
 * Build a status list from rows. The result still needs attachStatusLists()
 * (on the element or its container) for the spoken parts and the Retry.
 *
 * @param {StatusRow[]} rows
 * @param {{ label?: string, retry?: boolean, single?: boolean }} [options] `label`: the list's accessible name;
 *   `retry: false` leaves out the Retry button; `single`: one column
 * @returns {HTMLUListElement}
 */
export function buildStatusList(rows, { label, retry = true, single = false } = {}) {
    const list = document.createElement('ul');
    list.className = single ? 'kp-statuslist kp-statuslist--rows' : 'kp-statuslist';
    if (label) list.setAttribute('aria-label', label);
    if (!retry) list.setAttribute('data-kp-status-retry', 'false');
    rows.forEach((row) => {
        const item = el('kp-statusrow', 'li');
        item.setAttribute(STATUS_ID_ATTRIBUTE, row.id ?? row.label);
        item.dataset.state = known(row.state);
        const body = el('kp-statusrow__body');
        body.append(el('kp-statusrow__label'), el('kp-statusrow__detail'));
        item.append(el('kp-statusrow__mark'), body);
        list.append(item);
        writeText(item, row);
        syncItem(item);
    });
    return list;
}

/**
 * Set the text parts of a row.
 * @param {Element} item
 * @param {{ label?: string, detail?: string }} change
 */
function writeText(item, { label, detail }) {
    if (label !== undefined) item.querySelector('.kp-statusrow__label')?.replaceChildren(label);
    if (detail !== undefined) item.querySelector('.kp-statusrow__detail')?.replaceChildren(detail);
}

/** @param {Element} item */
const labelOf = (item) => item.querySelector('.kp-statusrow__label')?.textContent?.trim() ?? '';

/**
 * Bring a row's mark, spoken state, Retry and `aria-busy` in step with its
 * `data-state`, and announce a change.
 *
 * @param {Element} item
 * @param {{ announce?: boolean }} [options]
 * @returns {StatusState}
 */
function syncItem(item, { announce = false } = {}) {
    const state = known(item.getAttribute('data-state'));
    if (item.getAttribute('data-state') !== state) item.setAttribute('data-state', state);
    let mark = item.querySelector(':scope > .kp-statusrow__mark');
    if (!mark) {
        mark = el('kp-statusrow__mark');
        item.prepend(mark);
    }
    mark.setAttribute('aria-hidden', 'true');
    const spinning = mark.querySelector('.kp-spinner');
    if (state === 'loading' && !spinning) {
        const wheel = el('kp-spinner');
        wheel.setAttribute('aria-hidden', 'true');
        mark.append(wheel);
    } else if (state !== 'loading' && spinning) spinning.remove();
    if (state === 'loading') item.setAttribute('aria-busy', 'true');
    else item.removeAttribute('aria-busy');

    let body = item.querySelector(':scope > .kp-statusrow__body');
    if (!body) {
        body = el('kp-statusrow__body');
        mark.after(body);
    }
    let word = item.querySelector('.kp-statusrow__state');
    if (!word) {
        word = el('kp-statusrow__state');
        body.append(word);
    }
    // ", failed" after the label: the comma makes the reader pause.
    word.textContent = `, ${stateWord(state)}`;

    const list = item.closest(STATUS_LIST);
    syncAction(item, state, list);

    const previous = synced.get(item);
    synced.set(item, state);
    if (list && announce && previous !== undefined && previous !== state) {
        if (state !== 'loading') {
            say(list, {
                label: labelOf(item),
                state,
                detail: state === 'ok' ? '' : (item.querySelector('.kp-statusrow__detail')?.textContent?.trim() ?? ''),
            });
        }
        list.dispatchEvent(
            new CustomEvent(STATUS_EVENT, {
                bubbles: true,
                detail: { item, id: item.getAttribute(STATUS_ID_ATTRIBUTE), state, previous },
            }),
        );
    }
    return state;
}

/**
 * The Retry button: made once, shown on a failed row only. If it had the
 * focus when it goes, the focus moves to the row's body.
 * @param {Element} item
 * @param {StatusState} state
 * @param {Element | null} list
 */
function syncAction(item, state, list) {
    if (list?.getAttribute('data-kp-status-retry') === 'false') return;
    let cell = item.querySelector(':scope > .kp-statusrow__action');
    if (!cell) {
        cell = el('kp-statusrow__action');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kp-button kp-button--sm';
        button.setAttribute('data-kp-status-retry-button', '');
        cell.append(button);
        item.append(cell);
    }
    const button = cell.querySelector('button');
    if (button) {
        const s = getStrings();
        button.textContent = s.statusRetry;
        button.setAttribute('aria-label', s.statusRetryLabel(labelOf(item)));
        const hide = state !== 'failed';
        if (hide && document.activeElement === button) {
            const body = /** @type {HTMLElement | null} */ (item.querySelector('.kp-statusrow__body'));
            if (body) {
                body.tabIndex = -1;
                body.focus({ preventScroll: true });
            }
        }
        /** @type {HTMLElement} */ (cell).hidden = hide;
    }
}

/**
 * The list's status region, made on first need (right after the list).
 * @param {Element} list
 * @returns {HTMLElement}
 */
function regionOf(list) {
    const next = list.nextElementSibling;
    if (next instanceof HTMLElement && next.classList.contains('kp-statuslist__live')) return next;
    const region = el('kp-sr-only kp-statuslist__live');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    list.after(region);
    return region;
}

/**
 * Say something through the list's region; a burst in one tick is one message.
 * @param {Element} list
 * @param {{ label: string, state: StatusState, detail: string }} entry
 */
function say(list, entry) {
    const fresh = !(list.nextElementSibling?.classList.contains('kp-statuslist__live') ?? false);
    const region = regionOf(list);
    const queue = pending.get(region);
    if (queue) {
        queue.push(entry);
        return;
    }
    pending.set(region, [entry]);
    // A region put in the page and written to in the same breath is often not read; one made just now waits a moment.
    setTimeout(
        () => {
            const entries = pending.get(region) ?? [];
            pending.delete(region);
            const s = getStrings();
            region.textContent =
                entries.length > 3
                    ? s.statusAnnounceMany(entries.length, entries.filter((e) => e.state === 'failed').length)
                    : entries.map((e) => s.statusAnnounce(e.label, stateWord(e.state), e.detail)).join('. ');
        },
        fresh ? 100 : 0,
    );
}

/**
 * Change one row. `key` is the row's `data-kp-status-id` or its index.
 *
 * @param {Element} list
 * @param {string | number} key
 * @param {{ state?: StatusState, label?: string, detail?: string }} change
 * @returns {Element | null} the row, or null when there is no such row
 */
export function setStatus(list, key, change) {
    const items = [...list.querySelectorAll(':scope > .kp-statusrow')];
    const item = typeof key === 'number' ? items[key] : items.find((row) => row.getAttribute(STATUS_ID_ATTRIBUTE) === key);
    if (!item) return null;
    writeText(item, change);
    if (change.state !== undefined) item.setAttribute('data-state', known(change.state));
    syncItem(item, { announce: true });
    return item;
}

/**
 * Sync every `.kp-statuslist` under `root`, follow `data-state` changes later
 * and turn a press on a Retry into `kp-status-retry`. A list rendered after
 * this ran is attached by calling it on that subtree.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachStatusLists(root = document) {
    const lists = /** @type {HTMLElement[]} */ ([
        ...(root instanceof Element && root.matches(STATUS_LIST) ? [root] : []),
        ...root.querySelectorAll(STATUS_LIST),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const list of lists) {
        for (const item of list.querySelectorAll(':scope > .kp-statusrow')) syncItem(item);
        regionOf(list);
        /** @param {Event} event */
        const press = (event) => {
            const button = event.target instanceof Element ? event.target.closest('[data-kp-status-retry-button]') : null;
            const item = button?.closest('.kp-statusrow');
            if (!button || !item || !list.contains(item)) return;
            list.dispatchEvent(new CustomEvent(STATUS_RETRY_EVENT, { bubbles: true, detail: { item, id: item.getAttribute(STATUS_ID_ATTRIBUTE) } }));
        };
        list.addEventListener('click', press);
        undo.push(() => list.removeEventListener('click', press));
    }
    if (typeof MutationObserver === 'undefined' || lists.length === 0) return () => undo.forEach((u) => u());
    const watch = new MutationObserver((records) => {
        for (const record of records) {
            const target = /** @type {Element} */ (record.target);
            if (target.classList.contains('kp-statusrow')) syncItem(target, { announce: true });
        }
    });
    for (const list of lists) watch.observe(list, { attributes: true, attributeFilter: ['data-state'], subtree: true });
    return () => {
        watch.disconnect();
        undo.forEach((u) => u());
    };
}
