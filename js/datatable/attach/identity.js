// The table's id, its undo list and the arrival mark.
import { datatableState } from '../state.js';
import { getStrings } from '../../strings.js';
import { attachTableRegions } from '../../tables.js';
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the table's id, its undo list and the arrival mark part adds to the table's context.
 *
 * @typedef {{
 *     add: <T extends Element>(node: T) => T;
 *     added: Element[];
 *     id: string;
 *     make: (tag: string, className?: string) => HTMLElement;
 *     s0: Strings;
 *     undo: (() => void)[];
 * }} IdentityFields
 */

/**
 * The table's id, its undo list and the arrival mark.
 *
 * @param {TableContext} c
 */
export function installIdentity(c) {
    const { cleanups, regions, wrap } = c;
    c.add = add;
    c.make = make;

    const id = `kp-datatable-${datatableState.instances}`;
    c.id = id;
    /** Everything this attach put into the page, taken out again by detach. @type {Element[]} */
    const added = [];
    c.added = added;
    /** @type {(() => void)[]} */
    const undo = [];
    c.undo = undo;
    // The table redraws its own chrome (the group toggles, the pager, the
    // card sort) on every render; under js/motion.js each redraw arrived
    // again, held the box's glide and made a group's fold wait seconds
    // for them (Kenny, 2026-10-05). Unless the page says otherwise, only
    // what is new arrives [port spec G]; rows shown again still do.
    if (!wrap.closest('[data-kp-arrive]')) {
        wrap.setAttribute('data-kp-arrive', 'new');
        undo.push(() => wrap.removeAttribute('data-kp-arrive'));
    }
    const s0 = getStrings();
    c.s0 = s0;
    // The scroll box is a region a keyboard can reach [TH95]. Here as
    // well as in auto.js, because a consumer who attaches only the
    // data tables should not have to know about a second call to make
    // their table operable.
    if (regions) cleanups.push(attachTableRegions(wrap));
    /** @template {Element} T @param {T} node @returns {T} */
    function add(node) {
        added.push(node);
        return node;
    }
    /** @param {string} tag @param {string} [className] */
    function make(tag, className) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        return node;
    }
}
