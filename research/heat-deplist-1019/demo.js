// research/heat-deplist-1019: the page's own wiring. The components are the package's (js/auto.js attaches the dependency list);
// this file gives the heat grids and the lists their data.
import { setHeat } from '../../js/heat.js';
import { setDeplist } from '../../js/deplist.js';

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

const TONES = /** @type {const} */ (['ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'bad', 'ok', 'ok', 'ok']);
/** @param {number} r @param {number} c */
const cell = (r, c) => {
    const tone = TONES[(c + r * 3) % TONES.length];
    return { tone, label: tone === 'ok' ? 'backed up' : 'check it' };
};

// ---- 1 · row names ------------------------------------------------------------------------------------
const NAMES = ['Paperless', 'Vaultwarden', 'Almanac', 'Photos and family videos', 'Nightly database snapshots'];
for (const heat of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-rf-heat="names"]')]))
    setHeat(heat, {
        label: 'Backups per stack per night',
        columns: Array.from({ length: 10 }, (_, i) => ({ key: `d${i}`, label: String(10 + i) })),
        rows: NAMES.map((label, r) => ({ key: `r${r}`, label, cells: Array.from({ length: 10 }, (_, c) => cell(r, c)) })),
    });

// ---- 2 · the axis -------------------------------------------------------------------------------------
// Fourteen nights, the 5th and 6th (a weekend) and the 12th and 13th marked minor.
const NIGHTS = Array.from({ length: 14 }, (_, i) => ({ key: `n${i}`, label: String(10 + i), ...(i === 5 || i === 6 || i === 12 || i === 13 ? { minor: true } : {}) }));
for (const [kind, every] of /** @type {const} */ ([
    ['axis-3', 3],
    ['axis-2', 2],
]))
    for (const heat of /** @type {HTMLElement[]} */ ([...document.querySelectorAll(`[data-rf-heat="${kind}"]`)]))
        setHeat(heat, {
            label: 'Backups per night',
            every,
            columns: NIGHTS,
            rows: ['Paperless', 'Almanac'].map((label, r) => ({ key: `r${r}`, label, cells: NIGHTS.map((_, c) => cell(r, c)) })),
        });

// ---- 3 · the dependency list ----------------------------------------------------------------------------
for (const list of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-rf-deplist]')]))
    setDeplist(list, [
        { from: 'paperless', to: 'postgres', state: 'running' },
        { from: 'paperless', to: 'redis', state: 'stopped' },
        { from: 'vaultwarden', to: 'mariadb', state: 'unknown' },
        { from: 'almanac', to: 'postgres', state: 'running' },
    ]);
