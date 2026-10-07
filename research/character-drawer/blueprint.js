// research/character-drawer, blueprint: the tour's step count is read again when
// the tour moves on: it is written at once and a pointer on a ruler under it
// slides from the old step to the new one, the register's own picture
// (`[data-kp-updating='read']`, css/blueprint-register.css); see
// ../character-shared/. The drawer's opening and the highlight are CSS.
import { read } from '../character-shared/blueprint.js';

/** @type {WeakMap<Element, number>} */
const was = new WeakMap();
const place = (/** @type {Element} */ count) => {
    const [, at, of] = /(\d+)\s+of\s+(\d+)/.exec(count.textContent ?? '') ?? [];
    return of ? Number(at) / Number(of) : null;
};

new MutationObserver((records) => {
    for (const r of records) {
        const el = /** @type {Element} */ (r.target);
        const count = el.closest?.('[data-dt-tour-count]') ?? el.parentElement?.closest?.('[data-dt-tour-count]') ?? null;
        if (!count) continue;
        const now = place(count);
        const before = was.get(count);
        if (now != null) was.set(count, now);
        if (now != null && before != null && before !== now) read(count, { from: before, to: now });
    }
}).observe(document.body, { subtree: true, childList: true, characterData: true });
document.querySelectorAll('[data-dt-tour-count]').forEach((count) => {
    const now = place(count);
    if (now != null) was.set(count, now);
});
