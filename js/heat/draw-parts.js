// The pieces of a drawn heat grid: the state plate of an empty or failed grid, the axis of column names, and the area a busy card covers.

import { hostStatePlate } from '../state-plate.js';
import { getStrings } from '../strings.js';
import { PLATES, markDrawn } from './card.js';
import { HEAT_RETRY_EVENT } from './constants.js';
import { make } from './dom.js';
/** @typedef {import('./types.js').HeatSpec} HeatSpec */

/**
 * The package's state plate over the grid's whole footprint, with a Retry on a failure [state-plates-1019]. A grid told the same state
 * again keeps its plate.
 * @param {HTMLElement} el @param {HeatSpec} spec @param {'empty' | 'error'} state
 */
export function drawStatePlate(el, spec, state) {
    const doc = el.ownerDocument;
    const s = getStrings();
    // The package's state plate over the grid's whole footprint, with a Retry on a failure [state-plates-1019].
    // A grid told the same state again (a page repainting from its live stream) keeps its plate: a new node would play the
    // plate's entrance again and drop the focus on its Retry, which reads as a flicker [hlcomp-1019 heat-failed].
    const title = spec.message ?? (state === 'error' ? s.heatFailed : s.heatEmpty);
    const kept = PLATES.get(el);
    if (kept && kept.note.isConnected && el.firstElementChild === kept.note && el.childElementCount === 1) {
        if (kept.state === state && kept.title === title && kept.text === spec.text && kept.art === spec.art) return;
    }
    const note = make(doc, 'div', 'kp-heat__state', { 'data-kp-state': state });
    note.append(
        hostStatePlate(el, {
            kind: state,
            title,
            ...(spec.text ? { text: spec.text } : {}),
            art: spec.art,
            retryEvent: HEAT_RETRY_EVENT,
        }),
    );
    PLATES.set(el, { note, state, title, text: spec.text, art: spec.art });
    markDrawn(el);
    el.replaceChildren(note);
}

/**
 * The axis row: the column names, every `every`th of the unmarked ones, the last always.
 * @param {Document} doc @param {readonly { key: string, label: string, minor?: boolean }[]} columns
 * @param {{ every: number, picked: string | null, loading: boolean }} options
 */
export function drawAxis(doc, columns, { every, picked, loading }) {
    /** @param {string} key @param {string} text @param {boolean} minor */
    const column = (key, text, minor) => {
        const head = make(doc, 'span', 'kp-heat__col', { role: 'columnheader', 'data-col-key': key });
        const isPicked = picked != null && key === picked;
        if (minor) head.setAttribute('data-kp-minor', '');
        if (isPicked) head.setAttribute('data-kp-picked', '');
        // A minor name is not drawn: its header keeps the name for a screen reader, with no text to find under a neighbour [heat-deplist-1019].
        if (minor && !isPicked && text) head.setAttribute('aria-label', text);
        else head.textContent = text;
        return head;
    };
    const axis = make(doc, 'div', 'kp-heat__row kp-heat__axis', { role: 'row' });
    axis.append(make(doc, 'span', 'kp-heat__label', { role: 'columnheader', 'aria-hidden': 'true' }));
    const heads = make(doc, 'div', 'kp-heat__cells', { role: 'none' });
    // `every` counts the columns that are not marked: `minor: true` is never named and does not count, `minor: false` is always
    // named, and the rest are named every `every`th, the last of them always (the name before it gives way when the two would
    // stand side by side) [heat-deplist-1019].
    const open = columns.map((c, i) => (c.minor === undefined ? i : -1)).filter((i) => i >= 0);
    const named = new Set(open.filter((_, at) => at % every === 0 || at === open.length - 1));
    const before = open[open.length - 2];
    if (every > 1 && before !== undefined && before === open[open.length - 1] - 1) named.delete(before);
    columns.forEach((c, i) => heads.append(column(c.key, loading && !c.label ? '' : c.label, c.minor ?? !named.has(i))));
    axis.append(heads);
    return axis;
}

/**
 * What a loading heat grid's busy card covers: the rows' cells and, below them, whatever the held footprint (js/footprint.js) adds,
 * down to the host's content edge, so the card fills the footprint the grid held and not only the few skeleton rows
 * [hlcomp-1019 heat-busy]. The axis and the names stay beside it.
 * @param {HTMLElement} el
 */
export function heatArea(el) {
    const cells = [...el.querySelectorAll(':scope > .kp-heat__row:not(.kp-heat__axis) > .kp-heat__cells')].map((c) => c.getBoundingClientRect());
    if (!cells.length) return [];
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const floor = box.bottom - el.clientTop - (Number.parseFloat(style.paddingBottom) || 0);
    const top = Math.min(...cells.map((r) => r.top));
    return [
        {
            top,
            left: Math.min(...cells.map((r) => r.left)),
            bottom: Math.max(floor, ...cells.map((r) => r.bottom)),
            right: Math.max(...cells.map((r) => r.right)),
        },
    ];
}
