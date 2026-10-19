// research/rule-fixes-1019: the page's own wiring. The components are the package's (js/auto.js attaches the tab bar, the palette and
// the card states); this file gives the code blocks, the log, the heat grid and the wheel their data.
import { setCode } from '../../js/code.js';
import { setHeat } from '../../js/heat.js';
import { setWheelItems } from '../../js/wheel.js';

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

// ---- 4 and 5 · the code blocks ----------------------------------------------------------------------
const LONG =
    'curl -sS -X POST "https://kyu.example.internal/v1/messages?topic=backup.done&source=nightly-snapshot&retry=3&timeout=30&verbose=true&format=json" -H "Authorization: Bearer $CLIENT_TOKEN" -H "Content-Type: application/json" -d \'{"topic":"backup.done","ok":true}\'\nsecond line, short';
const SHORT = 'GET /v1/health\nHost: kyu.example.internal\nAccept: application/json';
const JSON_TEXT = JSON.stringify(
    {
        topic: 'backup.done',
        ok: true,
        stacks: [
            { name: 'media', snapshots: 12, failed: [] },
            { name: 'photos', snapshots: 9, failed: ['2026-10-14'] },
        ],
        next: { at: '2026-10-20T03:00:00Z', tries: [1, 2, 3] },
    },
    null,
    2,
);
for (const el of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-rf-code]')])) {
    const kind = el.getAttribute('data-rf-code');
    if (kind === 'long') setCode(el, { title: 'Request', language: 'bash', text: LONG, lines: true });
    else if (kind === 'short') setCode(el, { title: 'Health check', language: 'http', text: SHORT });
    else setCode(el, { title: 'Payload', language: 'JSON', text: JSON_TEXT, layout: 'pretty' });
}

// ---- 7 · the log and its pill ---------------------------------------------------------------------------
const list = /** @type {HTMLElement | null} */ (document.querySelector('[data-rf-log]'));
let serial = 0;
const line = () => {
    const li = document.createElement('li');
    serial += 1;
    li.textContent = `10:${String(10 + serial).padStart(2, '0')} backup run ${serial} finished`;
    return li;
};
if (list) {
    for (let i = 0; i < 16; i++) list.append(line());
    // Scrolled away from the end first, then three lines arrive out of sight.
    setTimeout(() => {
        list.scrollTop = 0;
        setTimeout(() => {
            for (let i = 0; i < 3; i++) list.append(line());
        }, 250);
    }, 400);
    document.querySelector('[data-rf-arrive]')?.addEventListener('click', () => list.append(line()));
}

// ---- 8 · the heat grid ----------------------------------------------------------------------------------
const heat = document.querySelector('[data-rf-heat]');
if (heat instanceof HTMLElement) {
    const tones = /** @type {const} */ (['ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'bad', 'ok', 'ok', 'ok']);
    const names = ['media', 'Photos and family videos archive', 'Nightly database snapshots', 'docs', 'Home automation configuration and add-ons'];
    setHeat(heat, {
        label: 'Backups per stack per night',
        columns: Array.from({ length: 10 }, (_, i) => ({ key: `d${i}`, label: String(10 + i) })),
        rows: names.map((label, r) => ({
            key: `r${r}`,
            label,
            cells: tones.map((_, c) => ({
                tone: tones[(c + r * 3) % tones.length],
                label: tones[(c + r * 3) % tones.length] === 'ok' ? 'backed up' : 'check it',
            })),
        })),
    });
}

// ---- 9 · the wheel ------------------------------------------------------------------------------------
const wheel = document.querySelector('[data-rf-wheel]');
if (wheel instanceof HTMLElement) {
    setWheelItems(wheel, [
        { id: 'curry', label: 'Chicken curry with rice and cucumber', weight: 3 },
        { id: 'pasta', label: 'Pasta with roasted vegetables and feta', short: 'Pasta', weight: 1 },
        { id: 'soup', label: 'Tomato soup', weight: 2 },
        { id: 'wraps', label: 'Wraps', weight: 1 },
        { id: 'stew', label: 'Beef and beer stew with fries', weight: 1 },
        { id: 'salad', label: 'Salad', weight: 0.4 },
        { id: 'toast', label: 'Toast', weight: 0.3 },
        { id: 'eggs', label: 'Eggs', weight: 0.3 },
        { id: 'rice', label: 'Fried rice with vegetables and egg', short: 'Fried rice', weight: 0.5 },
        { id: 'pizza', label: 'Homemade pizza with everything on it', weight: 0.4 },
    ]);
}
