// research/kpadopt4 (recipes sections) · 6, the three-way filter chips (mock data; the chips are js/segmented.js).
import { byId, say } from './recipes-kit.js';
import { attachSegmented, resetSegmented, setSegmentedCounts, SEGMENTED_EVENT } from '../../js/segmented.js';

attachSegmented(document);

const log = byId('kc-tri-log');
byId('kc-tri').addEventListener(SEGMENTED_EVENT, (event) => {
    const { include, exclude, value, state } = /** @type {CustomEvent} */ (event).detail;
    say(log, `kp-segmented-change · ${value ?? 'Clear all'} → ${state} · include [${include.join(', ')}] · exclude [${exclude.join(', ')}]`);
});

byId('kc-tri-clear').addEventListener('click', () => resetSegmented(byId('kc-tri')));

// The busy group: its counts arrive after a moment, then again on demand.
const busy = byId('kc-tri-busy');
const counts = () => setSegmentedCounts(busy, { vegetarian: 18, quick: 24, spicy: 7, oven: 11 });
const load = () => {
    busy.setAttribute('aria-busy', 'true');
    setSegmentedCounts(busy, { vegetarian: null, quick: null, spicy: null, oven: null });
    setTimeout(() => {
        counts();
        busy.removeAttribute('aria-busy');
    }, 2400);
};
byId('kc-tri-reload').addEventListener('click', load);
load();
