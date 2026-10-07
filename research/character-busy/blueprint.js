// research/character-busy, blueprint: the busy panel and the failed alert are
// the table's own markup, built fresh each time. Loading is ONE pen over the
// panel (its outline, then the places its words and its clock will stand); the
// panel and the failed alert arrive read out on their scales. All three are the
// register's pictures (css/blueprint-register.css); see ../character-shared/.
import { arrive, arriveWhenAdded, loading } from '../character-shared/blueprint.js';

loading({
    scene: '[data-bo] .kp-datatable__busy-panel',
    busy: '*',
    places: '.kp-datatable__busy-words, .kp-datatable__busy-clock',
});

// A panel the table draws is read out when it appears.
arriveWhenAdded(document.body, '[data-bo] .kp-datatable__busy-panel', { units: 3 });

// The failed alert is only shown and hidden: it is read out when it is shown.
new MutationObserver((records) => {
    for (const r of records) {
        const alert = /** @type {Element} */ (r.target);
        if (r.oldValue !== null && !alert.hasAttribute('hidden')) arrive([alert], { units: 3 });
    }
}).observe(document.body, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['hidden'] });
