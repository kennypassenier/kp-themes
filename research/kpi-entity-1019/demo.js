// research/kpi-entity-1019: the page's own wiring. The components are the package's (js/auto.js attaches the key figures, the
// charts and the entity grids); this file gives the entity grids their cards and the custom empty plate its function.
import { setEntityGrid, setEntityGridState } from '../../js/entity-card.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const grid = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.querySelector(`[data-ki-grid="${id}"]`));

/** @param {string} key @param {string} name @param {string} vmid @param {string[]} actions */
const profile = (key, name, vmid, actions) => ({
    key,
    name,
    vmid,
    state: { label: 'working', tone: /** @type {const} */ ('success') },
    figures: [
        { value: '412', label: 'Delivered' },
        { value: '0', label: 'Failed' },
        { value: '84 ms', label: 'Average' },
    ],
    flags: [{ label: 'HA webhook' }],
    meters: [{ label: 'Share', value: 0.34 }],
    actions: actions.map((label, i) => ({ id: `${key}-${i}`, label })),
});

// ---- 3 · the same action, the same width ----------------------------------------------------------------------
const actions = grid('actions');
if (actions) {
    setEntityGrid(actions, [
        profile('alert', 'alertmanager', '201', ['Recheck this profile', 'Logs', 'Remove']),
        profile('kuma', 'uptime-kuma', '202', ['Try a translation', 'Logs', 'Remove']),
        profile('grafana', 'grafana', '203', ['Open the log', 'Logs', 'Remove']),
        profile('loki', 'loki', '204', ['Recheck', 'Logs', 'Remove']),
    ]);
}

// ---- 4 · meter tones and the empty plates ------------------------------------------------------------------------
const tones = grid('tones');
if (tones) {
    setEntityGrid(tones, [
        {
            key: 'disk',
            name: 'media',
            vmid: '106',
            state: { label: 'running', tone: 'success' },
            figures: [{ value: '5', label: 'apps up' }],
            flags: [{ label: 'checked 2 min ago' }],
            meters: [
                { label: 'Free disk', value: 0.82, tone: 'success', text: '82 % free' },
                { label: 'Queue', value: 0.91, tone: 'neutral', text: '91 of 100' },
                { label: 'CPU', value: 0.91 },
            ],
            actions: [{ id: 'logs', label: 'Logs' }],
        },
        {
            key: 'plain',
            name: 'photos',
            vmid: '107',
            state: { label: 'running', tone: 'success' },
            figures: [{ value: '3', label: 'apps up' }],
            flags: [{ label: 'checked 5 min ago' }],
            meters: [
                { label: 'Free disk', value: 0.4, tone: 'success', text: '40 % free' },
                { label: 'Queue', value: 0.12, tone: 'neutral', text: '12 of 100' },
                { label: 'CPU', value: 0.78 },
            ],
            actions: [{ id: 'logs', label: 'Logs' }],
        },
    ]);
}
const none = grid('empty-none');
if (none) setEntityGrid(none, [], { title: 'No profiles yet', message: 'Profiles are read from the configuration on disk.' });
const custom = grid('empty-custom');
const readout = document.getElementById('ki-readout');
if (custom) {
    let presses = 0;
    setEntityGridState(custom, 'empty', {
        title: 'No profiles yet',
        message: 'Profiles are read from the configuration on disk.',
        actionLabel: 'Reload profiles',
        onAction: () => {
            presses += 1;
            if (readout)
                readout.textContent = `Reload profiles ran your function (${presses} time${presses === 1 ? '' : 's'}); the default kp-entity-new event did not fire.`;
        },
    });
}

// The tile kinds of the note section: the trend tile (the demo) and the toggle tile the package also has.
for (const button of /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[data-ki-kind]')])) {
    button.addEventListener('click', () => {
        const kind = button.getAttribute('data-ki-kind');
        for (const other of document.querySelectorAll('[data-ki-kind]')) other.setAttribute('aria-pressed', String(other === button));
        for (const panel of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-ki-kind-panel]'))) {
            panel.hidden = panel.getAttribute('data-ki-kind-panel') !== kind;
        }
    });
}
