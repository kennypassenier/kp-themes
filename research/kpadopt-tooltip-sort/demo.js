// Behaviour for the hover card block of this research page. The card is the
// package's: js/hovercard.js. js/auto.js attaches it for every
// `[data-kp-hovercard]` anchor on load; this script hands it a `fill` for the
// chips that carry no text of their own, and rebuilds the table's rows the way
// the admin dashboard does every thirty seconds, so the anchors are new nodes
// each time and the card must keep working without being re-attached.
import { attachHoverCards } from '../../js/hovercard.js';

const SERVICES = [
    ['Reverse proxy', 'healthy', 'Answered 3 ms ago; 0 failed checks in the last 24 hours.', 'Traefik', '99.99 %', '3 ms'],
    [
        'Media server transcoder queue worker',
        'degraded',
        'Two of eight workers restarted after running out of memory.',
        'Jellyfin',
        '99.2 %',
        '41 ms',
    ],
    ['Backup repository', 'healthy', 'Last snapshot finished at 03:12 and verified.', 'restic', '100 %', '18 ms'],
    ['Message hub', 'failed', 'No answer for 4 minutes 12 seconds; the last error was a refused connection.', 'kyu', '97.1 %', '—'],
    ['Dashboard', 'healthy', 'Answered 11 ms ago; 0 failed checks in the last 24 hours.', 'admin', '99.9 %', '11 ms'],
    ['Calendar sync', 'paused', 'Paused by hand at 21:40 for the router change.', 'Almanac', '—', '—'],
];
const TONE = { healthy: 'success', degraded: 'warning', failed: 'destructive', paused: 'info' };

/** @param {string} tag @param {Record<string, string>} [attrs] @param {...(string | Node)} kids */
const el = (tag, attrs = {}, ...kids) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    node.append(...kids);
    return node;
};

let rounds = 0;
function buildRows() {
    rounds += 1;
    const body = /** @type {HTMLElement} */ (document.querySelector('[data-hc-rows]'));
    const rows = SERVICES.map(([name, state, note]) => {
        const badge = el('span', { class: `kp-badge kp-badge--${TONE[state]} hc-anchor`, tabindex: '0', 'data-kp-hovercard': note }, state);
        const cell = el('span', { class: 'hc-trunc hc-anchor', tabindex: '0', 'data-kp-hovercard': name }, name);
        // The service chip carries no text: the card is filled from the data when it opens.
        const chip = el('span', { class: 'kp-tag hc-anchor', tabindex: '0', 'data-hc-chip': name }, SERVICES.find((s) => s[0] === name)?.[3] ?? '');
        return el('tr', {}, el('td', {}, cell), el('td', {}, badge), el('td', {}, chip));
    });
    body.replaceChildren(...rows);
    const stamp = document.querySelector('[data-hc-rounds]');
    if (stamp) stamp.textContent = `Rebuilt ${rounds} time${rounds === 1 ? '' : 's'}`;
}

/** The rich card, built as nodes when the chip is hovered or focused. @param {HTMLElement} anchor */
function fill(anchor) {
    const name = anchor.dataset.hcChip;
    if (name === undefined) return null;
    const svc = SERVICES.find((s) => s[0] === name);
    if (svc === undefined) return null;
    if (svc[3] === 'Almanac') return null; // nothing to say: no card opens
    const pair = (/** @type {string} */ k, /** @type {string} */ v) => [el('dt', {}, k), el('dd', {}, v)];
    return el(
        'div',
        { class: 'hc-rich' },
        el('strong', {}, svc[0]),
        el('dl', {}, ...pair('Uptime', svc[4]), ...pair('Latency', svc[5]), ...pair('Checked', `${rounds} rebuild${rounds === 1 ? '' : 's'} ago`)),
    );
}

const handle = attachHoverCards(document, { selector: '[data-kp-hovercard], [data-hc-chip]', fill });
buildRows();
let timer = 0;
document.querySelector('[data-hc-rebuild]')?.addEventListener('click', buildRows);
document.querySelector('[data-hc-auto]')?.addEventListener('change', (e) => {
    clearInterval(timer);
    if (/** @type {HTMLInputElement} */ (e.target).checked) timer = window.setInterval(buildRows, 8000);
});
// "Show it open": the card pinned on one chip, for a reviewer who wants it standing still.
document.querySelector('[data-hc-hold]')?.addEventListener('click', () => {
    const chip = document.querySelector('[data-hc-rows] [data-hc-chip]');
    if (chip instanceof HTMLElement) handle.open(chip);
});
document.querySelector('[data-hc-hold-attr]')?.addEventListener('click', () => {
    const cell = document.querySelector('[data-hc-rows] .hc-trunc');
    if (cell instanceof HTMLElement) handle.open(cell);
});
for (const retry of document.querySelectorAll('[data-hc-retry]'))
    retry.addEventListener('click', (e) => {
        const b = /** @type {HTMLButtonElement} */ (e.currentTarget);
        b.disabled = true;
        setTimeout(() => (b.disabled = false), 1200);
    });
document.querySelector('[data-hc-hide]')?.addEventListener('click', () => handle.hide());
