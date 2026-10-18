// research/kpadopt56-shared: one evidence page, not a review demo. Every item draws the real package component twice
// ("Now" and "Proposed"); the Proposed copy is changed only by the <style id="proposals"> in evidence.html, scoped to
// `.proposal`. This file only builds the markup and feeds the components their data, as the part pages do.
import { setRequests } from '../../js/request-inspector.js';
import { setChecklistItems } from '../../js/checklist.js';
import { setEntityGrid } from '../../js/entity-card.js';
import { setChartData } from '../../js/chart.js';
import { setAvailability, availabilityDays, availabilityRange } from '../../js/availability.js';
import { registerShortcuts } from '../../js/shortcuts.js';

const THEMES = ['formal', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];
const $$ = (/** @type {string} */ s, /** @type {ParentNode} */ r = document) => /** @type {HTMLElement[]} */ ([...r.querySelectorAll(s)]);

// ── the theme switcher ──────────────────────────────────────────────────────────────────────────────────────
const bar = document.getElementById('themes');
function setTheme(/** @type {string} */ name) {
    const root = document.documentElement;
    root.setAttribute('data-theme', name);
    const link = /** @type {HTMLLinkElement} */ (document.querySelector('link[data-kp-register]'));
    link.setAttribute('data-kp-register', name);
    link.href = `../../css/${name}-register.css`;
    try {
        localStorage.setItem('theme', name);
    } catch {
        // No storage: the choice stays for this load only.
    }
    const url = new URL(location.href);
    url.searchParams.set('theme', name);
    history.replaceState(null, '', url);
    for (const b of $$('button', bar)) b.setAttribute('aria-pressed', String(b.dataset.theme === name));
    for (const row of $$('.measured tr[data-theme-row]')) row.toggleAttribute('data-current', row.dataset.themeRow === name);
    // A chart draws its labels from the width it measures: draw again once the new fonts and register are in.
    link.addEventListener('load', () => setTimeout(() => window.dispatchEvent(new Event('resize')), 50), { once: true });
}
for (const name of THEMES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kp-button kp-button--sm';
    b.dataset.theme = name;
    b.textContent = name;
    b.addEventListener('click', () => setTheme(name));
    bar.append(b);
}
setTheme(new URLSearchParams(location.search).get('theme') ?? document.documentElement.getAttribute('data-theme') ?? 'formal');

// ── markup per slot ─────────────────────────────────────────────────────────────────────────────────────────
const SLOTS = {
    refresh: () => '<div data-kp-refresh="0" data-kp-look="segmented" data-kp-refresh-choices="0,15,30,60,300"></div>',
    inspector: () => '<div class="kp-card kp-inspector" data-kp-requests data-kp-requests-open="none" data-kp-state="loading"></div>',
    version: () => `
        <div class="row"><b>image</b><span class="kp-badge kp-badge--version" data-kp-version-digest="full"
            data-kp-version-from="sha256:3f9c1a2b7d4e8a6f0c5b9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a"
            data-kp-version-to="sha256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"></span></div>
        <div class="row"><b>sonarr</b><span class="kp-badge kp-badge--version"
            data-kp-version-from="4.0.9.2244-ls289-build-2026-10-02" data-kp-version-to="4.0.9.2244-ls290-build-2026-10-16"></span></div>
        <div class="row"><b>paperless</b><span class="kp-badge kp-badge--version" data-kp-version-from="2.12.0" data-kp-version-to="2.12.1"></span></div>`,
    checklist: () => '<div class="kp-checklist" data-kp-checklist aria-label="Packing list"></div>',
    entity: () => '<div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-min="22rem"></div>',
    chart: () => '<figure class="kp-chart" data-kp-chart data-kp-chart-median data-kp-chart-band="tint" aria-label="Pump house 1 pressure"><figcaption class="kp-chart__title">Pump house 1 pressure, bar</figcaption></figure>',
    availability: () => '<div class="kp-availability" data-kp-availability data-kp-availability-narrow="by-column" data-kp-availability-keys="false" aria-label="Who can come"></div>',
    shortcuts: () => `<p><button type="button" class="kp-button kp-button--sm" data-modal>Open it as a modal (how the package opens it)</button></p><div class="stage"><dialog class="kp-shortcuts" open data-kp-shortcuts data-kp-shortcuts-live data-kp-primary
        data-kp-shortcuts-group="Anywhere" aria-labelledby="sc-t-@"><h3 class="kp-dialog__title" id="sc-t-@">Keyboard shortcuts</h3></dialog></div>`,
    badges: () =>
        `<div class="row"><span class="kp-badge">active</span><span class="kp-badge kp-badge--version" data-kp-version-from="2.12.0" data-kp-version-to="2.12.1"></span><span class="kp-badge">stopped</span><span class="kp-badge">update available</span></div>`,
};
let uid = 0;
for (const slot of $$('[data-slot]')) {
    slot.innerHTML = SLOTS[/** @type {keyof typeof SLOTS} */ (slot.dataset.slot)]().replaceAll('@', String(++uid));
}

// ── data ───────────────────────────────────────────────────────────────────────────────────────────────────
const HOUR = 3600_000;
const DAY = 24 * HOUR;
const h = { 'content-type': 'application/json', 'user-agent': 'homelab-hooks/3.75' };
const AT = (/** @type {number} */ m) => new Date(Date.UTC(2026, 9, 17, 18, 20) - m * 60000).toISOString();
const REQUESTS = [
    { at: AT(1), method: 'POST', path: '/hooks/backup/done?stack=media&attempt=1', status: 202, headers: h, body: '{"ok":true}', bodyBytes: 11, source: 'test' },
    { at: AT(4), method: 'GET', path: '/health', status: 200, headers: h },
    { at: AT(9), method: 'POST', path: '/hooks/deploy/ghent/production-cluster/rollout', status: 502, headers: h, body: '{"error":"upstream did not answer"}', bodyBytes: 35 },
    { at: AT(22), method: 'POST', path: '/api/v1/events', status: 404, headers: h, body: '{"error":"unknown topic"}', bodyBytes: 25 },
];
const CHECKS = [
    { id: 'id', label: 'Identity card', group: 'Documents', checked: true },
    { id: 'tickets', label: 'Train tickets', detail: 'printed or on the phone', group: 'Documents' },
    { id: 'hotel', label: 'Hotel booking', detail: 'check-in after 15:00, reference 8841-KP', group: 'Documents' },
    { id: 'rain', label: 'Rain jacket', detail: 'it is Ghent in October', group: 'Clothes' },
];
const acts = [{ id: 'restart', label: 'Restart' }, { id: 'logs', label: 'Logs' }, { id: 'update', label: 'Update' }, { id: 'remove', label: 'Remove', danger: true }];
const meters = (/** @type {number} */ cpu, /** @type {number} */ ram, /** @type {string} */ text) => [{ label: 'CPU', value: cpu }, { label: 'RAM', value: ram, text }, { label: 'Disk', value: 0.41 }];
const ENTITIES = [
    { key: 'media', name: 'media', vmid: '106', state: { label: 'running', tone: 'success' }, figures: [{ value: '3/5', label: 'apps up' }, { value: '12', label: 'restarts' }],
      flags: [{ label: 'update available', tone: 'warning' }], meters: meters(0.34, 0.71, '5.6 of 8 GB'), actions: acts },
    { key: 'vault', name: 'vault', vmid: '110', state: { label: 'running', tone: 'success' }, figures: [{ value: '2/2', label: 'apps up' }, { value: '0', label: 'restarts' }],
      flags: [], meters: meters(0.08, 0.22, '0.9 of 4 GB'), actions: acts },
    { key: 'gateway', name: 'gateway', vmid: '101', state: { label: 'degraded', tone: 'warning' }, figures: [{ value: '4/5', label: 'apps up' }, { value: '31', label: 'restarts' }],
      flags: [{ label: 'backup is old', tone: 'destructive' }], meters: meters(0.82, 0.93, '7.4 of 8 GB'), actions: acts },
];
const CHART_NOW = Date.UTC(2026, 9, 17, 10, 0);
const noise = (/** @type {number} */ t, /** @type {number} */ k) => { const v = Math.sin((t / 60_000) * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v) - 0.5; };
function chartData() {
    const to = CHART_NOW - 12 * HOUR;
    const from = to - 72 * HOUR;
    const points = /** @type {[number, number][]} */ ([]);
    for (let t = from - 6 * HOUR; t <= to + 12 * HOUR; t += HOUR) points.push([t, 3.7 - 0.5 * Math.max(0, Math.sin(((t / HOUR) % 24) / 24 * Math.PI * 2 - 1.2)) + 0.12 * noise(t, 2)]);
    return {
        unit: 'bar', from, to, height: 190, series: [{ label: 'Pump house 1', points }],
        kinds: { operation: { label: 'An operation the host ran', tone: 'info' }, update: { label: 'An update', tone: 'warning' } },
        events: [{ at: from + 9 * HOUR, label: 'Backup finished', kind: 'operation' }, { at: from + 22 * HOUR, label: 'Firmware 4.2 installed', kind: 'update' }],
    };
}
const RANGES = [availabilityRange('2026-11-06', '2026-11-08'), availabilityRange('2026-11-13', '2026-11-15'), availabilityRange('2026-11-20', '2026-11-22'), availabilityRange('2026-11-27', '2026-12-01')];
const DAYS = availabilityDays('2026-11-06', 9);
const r = RANGES.map((c) => c.key);
const AVAILABILITY = {
    unit: 'range',
    people: [{ id: 'kenny', name: 'Kenny', mine: true }, { id: 'tom', name: 'Tom' }, { id: 'anna', name: 'Anna' }, { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' }, { id: 'lies', name: 'Lies' }],
    canSwitchUnit: false,
    sets: {
        range: { columns: RANGES, answers: { kenny: { [r[0]]: 'yes', [r[1]]: 'maybe', [r[2]]: 'yes' }, tom: { [r[0]]: 'yes', [r[1]]: 'maybe' }, anna: { [r[0]]: 'no', [r[1]]: 'yes' }, bo: { [r[3]]: 'yes' }, lies: { [r[0]]: 'maybe' } } },
        day: { columns: DAYS, answers: {} },
    },
    state: 'ready',
};

// ── behaviour, then data ────────────────────────────────────────────────────────────────────────────────
registerShortcuts('page', [
    { keys: 'g i', what: 'Go to the Inbox', group: 'Anywhere', run: () => undefined },
    { keys: 'g h', what: 'Go to Home', group: 'Anywhere', run: () => undefined },
    { keys: 'g c', what: 'Go to the Console', group: 'Anywhere', run: () => undefined },
]);
// Importing the boot attaches every behaviour on the markup above; wait for it, then hand the components their data.
// The part pages register 41 shortcuts for the one sheet; so does this page, so the sheet is as long as theirs.
registerShortcuts(
    'list',
    Array.from({ length: 38 }, (_, i) => ({ keys: `${i < 26 ? 'g' : 'y'} ${String.fromCharCode(97 + (i % 26))}`, what: `Go to place number ${i + 1}`, group: i % 2 ? 'Anywhere' : 'In the list', run: () => undefined })),
);
const { READY_ATTRIBUTE } = await import('../../js/auto.js');
while (!document.documentElement.hasAttribute(READY_ATTRIBUTE)) await new Promise((done) => setTimeout(done, 30));
for (const el of $$('[data-kp-requests]')) setRequests(el, REQUESTS);
for (const el of $$('[data-kp-checklist]')) setChecklistItems(el, CHECKS);
for (const el of $$('[data-kp-entity-grid]')) setEntityGrid(el, ENTITIES);
for (const el of $$('[data-kp-chart]')) setChartData(el, chartData());
for (const el of $$('[data-kp-availability]')) setAvailability(el, AVAILABILITY);
for (const button of $$('[data-modal]')) {
    const sheet = /** @type {HTMLDialogElement} */ (button.closest('.col').querySelector('dialog.kp-shortcuts'));
    button.addEventListener('click', () => {
        sheet.close();
        sheet.showModal();
    });
    // Closed (Escape or the backdrop), the sheet goes back into its frame, open as before.
    sheet.addEventListener('close', () => sheet.show());
}

// ── the measured numbers (measured.js, written by measure.mjs) ────────────────────────────────────────────
/** key: the measure's name; better: which direction is better ('lower', 'higher' or 'info' for a number that is only information). */
const METRICS = {
    's1-refresh': [['over', 'Sticks out of the card, px', 'lower'], ['scrolls', 'Track scrolls inside by, px', 'info']],
    's1-inspector': [['over', 'Filter bar sticks out, px', 'lower'], ['cardClip', 'Rows cut by the card edge, px', 'lower'], ['broken', 'Badge words broken inside, count', 'lower']],
    's2-version': [['over', 'Badge sticks out of its row, px', 'lower']],
    's3-checklist': [['label', '"Hotel booking" label width, px', 'higher'], ['broken', 'Labels broken inside a word, count', 'lower'], ['over', 'List sticks out, px', 'lower']],
    's4-entity': [['broken', 'Button words broken inside, count', 'lower'], ['over', 'Button past the card edge, px', 'lower']],
    's5-chart': [['over', 'Last date label past the frame, px', 'lower']],
    's6-availability': [['name', '"Kenny (you)" width, px', 'higher']],
    's7-shortcuts': [['over', 'Sheet runs out of its frame, px', 'lower']],
    's8-badge': [['radius', 'Corner radius under the chamfer, px', 'lower']],
};
const NOTES = {
    's7-shortcuts': 'Opened as a modal on a 390 x 844 phone (the package as it is used), the sheet measured top 19, bottom 825 of 844 in every theme, scrolling inside itself: the package is fine, only the demo frame lets the 41-row sheet run out.',
    's8-badge': 'Only titanium has a chamfer; the radius of every other theme is its own and the proposal is scoped to titanium, so those rows do not change.',
    's1-refresh': 'Overflow is measured against the 308 px of content a phone frame has (the part pages measured 186 px in formal against their section edge; the difference is the margin).',
};
const data = /** @type {Record<string, any> | undefined} */ (/** @type {any} */ (window).KP_SHARED_MEASURED);
if (data) {
    for (const box of $$('.measured')) {
        const id = /** @type {string} */ (box.dataset.measured);
        const metrics = METRICS[/** @type {keyof typeof METRICS} */ (id)];
        const head = metrics.map(([, label]) => `<th colspan="2">${label}</th>`).join('');
        const sub = metrics.map(() => '<th>Now</th><th>Proposed</th>').join('');
        let worse = [];
        const rows = THEMES.map((theme) => {
            const cells = metrics.map(([key, , better]) => {
                const a = data[theme].now[id][key];
                const b = data[theme].prop[id][key];
                const bad = (better === 'lower' && b > a + 0.5) || (better === 'higher' && b < a - 0.5);
                if (bad) worse.push(`${theme} (${a} to ${b})`);
                return `<td>${a}</td><td${bad ? ' class="worse"' : ''}>${b}${bad ? ' worse' : ''}</td>`;
            });
            return `<tr data-theme-row="${theme}"><th scope="row">${theme}</th>${cells.join('')}</tr>`;
        });
        const flag = worse.length ? `<p class="note"><b>The proposal is worse in:</b> ${worse.join(', ')}.</p>` : '<p class="note">The proposal is worse in no theme.</p>';
        box.innerHTML = `<table><thead><tr><th rowspan="2">Theme</th>${head}</tr><tr>${sub}</tr></thead><tbody>${rows.join('')}</tbody></table>${flag}${NOTES[/** @type {keyof typeof NOTES} */ (id)] ? `<p class="note">${NOTES[/** @type {keyof typeof NOTES} */ (id)]}</p>` : ''}`;
    }
    for (const row of $$('.measured tr[data-theme-row]')) row.toggleAttribute('data-current', row.dataset.themeRow === document.documentElement.getAttribute('data-theme'));
}
document.documentElement.setAttribute('data-shared-ready', '');
