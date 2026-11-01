// research/ux-parts-1101, round 2: the wiring of kyu's refresh controls. The shared helpers are demo.js's.

import { attachRefresh } from '../../js/auto-refresh.js';
import { $, REPLY_MS, answer } from './demo.js';

// ---------------------------------------------------------------- auto-refresh-form (kyu's Topics header)
attachRefresh(document);
for (const id of ['pg-refresh-now', 'pg-refresh-new']) {
    // The hub answers every refresh after a moment, as kyu's dashboard does.
    $(id)?.addEventListener('kp-refresh', (event) => {
        const { done } = /** @type {CustomEvent<{ done: (ok: boolean) => void }>} */ (event).detail;
        void answer(REPLY_MS).then(() => done(true));
    });
}
