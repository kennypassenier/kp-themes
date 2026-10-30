// Filling every mark under a root, and each one added or renamed later; marks in one `[data-kp-idmark-set]` share out the palette.

import { AVATAR_ATTRIBUTES } from './avatar.js';
import { DRAWN, baseKey, setIdmark } from './draw.js';
import { IDMARK, idmarkColours } from './mark.js';

/** The marks under `root` (and `root` itself). @param {ParentNode} root @returns {HTMLElement[]} */
function marksUnder(root) {
    return /** @type {HTMLElement[]} */ ([...(root instanceof Element && root.matches(IDMARK) ? [root] : []), ...root.querySelectorAll(IDMARK)]);
}

/** The palette slot each mark of a set is given, so the marks of one set do not collide. @param {HTMLElement[]} all @returns {Map<Element, number>} */
function slotsOf(all) {
    /** @type {Map<Element, Element[]>} */
    const sets = new Map();
    for (const el of all) {
        const set = el.closest('[data-kp-idmark-set]');
        if (set) (sets.get(set) ?? sets.set(set, []).get(set))?.push(el);
    }
    /** @type {Map<Element, number>} */
    const slots = new Map();
    for (const members of sets.values()) {
        const colours = idmarkColours(members.map((el) => el.getAttribute('data-kp-idmark') ?? ''));
        for (const el of members) {
            const slot = colours.get((el.getAttribute('data-kp-idmark') ?? '').trim());
            if (slot) slots.set(el, slot);
        }
    }
    return slots;
}

/** Draw every mark under `root` that is not drawn from what it asks for now. @param {ParentNode} root */
function paintMarks(root) {
    const all = marksUnder(root);
    const slots = slotsOf(all);
    for (const el of all) {
        const name = el.getAttribute('data-kp-idmark') ?? '';
        const before = DRAWN.get(el);
        const want = slots.get(el);
        if (before?.base === baseKey(el) && (want === undefined || want === before.slot) && el.querySelector(':scope > .kp-idmark__letters')) continue;
        setIdmark(el, name, { slot: want });
    }
}

/**
 * Fill every `[data-kp-idmark]` under `root`, and each one added or renamed
 * later. Marks inside one `[data-kp-idmark-set]` share out the palette with
 * idmarkColours(), in document order.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachIdmarks(root = document) {
    paintMarks(root);
    const View = (root instanceof Document ? root : root.ownerDocument)?.defaultView;
    if (!View?.MutationObserver) return () => {};
    let queued = false;
    const observer = new View.MutationObserver((records) => {
        const relevant = records.some(
            (record) =>
                record.type === 'attributes' ||
                [...record.addedNodes].some((node) => node instanceof View.Element && (node.matches(IDMARK) || node.querySelector(IDMARK) !== null)),
        );
        if (!relevant || queued) return;
        queued = true;
        View.queueMicrotask(() => {
            queued = false;
            paintMarks(root);
        });
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-kp-idmark', ...AVATAR_ATTRIBUTES] });
    return () => observer.disconnect();
}
