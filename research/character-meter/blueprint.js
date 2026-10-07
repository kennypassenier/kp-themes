// research/character-meter, blueprint: the arrival. A row (its words and its
// meter) is read out when its meter stops loading: the register's own picture
// (`[data-kp-arriving]`), one row after another within a group of meters, so
// no two pens are on the sheet at once; separate groups are separate scenes.
import { arrive } from '../character-shared/blueprint.js';

const loaded = new Set();
let queued = false;
const flush = () => {
    queued = false;
    const groups = new Map();
    for (const meter of loaded) {
        const row = meter.closest('.cm-row');
        if (!row) continue;
        const group = row.closest('[data-cm]') ?? row.parentElement;
        groups.set(group, [...(groups.get(group) ?? []), row]);
    }
    loaded.clear();
    for (const rows of groups.values()) arrive(rows, { units: 2 });
};
const note = (/** @type {Element} */ meter) => {
    loaded.add(meter);
    if (!queued) {
        queued = true;
        queueMicrotask(flush);
    }
};
new MutationObserver((records) => {
    for (const r of records) {
        const el = /** @type {Element} */ (r.target);
        if (!el.matches('[data-cm-meter]') || el.hasAttribute('data-kp-loading')) continue;
        if (r.oldValue !== null) note(el);
    }
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-kp-loading'], attributeOldValue: true });
// The first picture of the page is an arrival too.
requestAnimationFrame(() => document.querySelectorAll('[data-cm-meter]:not([data-kp-loading])').forEach(note));
