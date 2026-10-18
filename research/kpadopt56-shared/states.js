// research/kpadopt56-shared, items 9 to 14 (the shared STATE faults): the markup and the data of the real package components in
// their loading / empty / failed states, drawn twice (Now and Proposed), and one driver that presses a state on both copies at once.
// Nothing here changes a component: the Proposed copy differs only by the <style id="proposals"> in evidence.html and by
// proposed.js, both scoped to `.proposal`. The data is the part pages' own (research/kpadopt56/src/*/demo.js), cut down.
import { setMatrix } from '../../js/heat.js';
import { setEntityGrid, setEntityGridState } from '../../js/entity-card.js';
import { setChecklistItems, setChecklistState } from '../../js/checklist.js';
import { setClaimPeople } from '../../js/claim.js';
import { setNotices } from '../../js/notices.js';
import { setGallery } from '../../js/gallery.js';
import { setAttention } from '../../js/attention.js';
import { setCardState } from '../../js/card-state.js';
import { setAvailability, availabilityDays, availabilityRange } from '../../js/availability.js';
import { setRequests, setRequestsState } from '../../js/request-inspector.js';
import { setQuoteState } from '../../js/quote.js';
import { setTodayState } from '../../js/statusrow.js';
import { setUsualState } from '../../js/usual-picker.js';
import { masterDetail, setPaneState } from '../../js/master-detail.js';
import { setChartData } from '../../js/chart.js';

const $$ = (/** @type {string} */ s, /** @type {ParentNode} */ r = document) => /** @type {HTMLElement[]} */ ([...r.querySelectorAll(s)]);
const HOUR = 3600_000;
const DAY = 24 * HOUR;

/** The states each component can be pressed into (the order of the buttons). */
export const STATES = {
    uses: ['ready', 'loading', 'empty', 'error'],
    entity: ['ready', 'loading', 'empty', 'error'],
    claim: ['ready', 'loading', 'empty', 'error'],
    notices: ['ready', 'loading', 'empty', 'error'],
    gallery: ['ready', 'loading', 'empty', 'error'],
    ops: ['ready', 'loading', 'error'],
    avail: ['ready', 'loading', 'empty', 'error'],
    inspector: ['ready', 'loading', 'empty', 'error'],
    quote: ['ready', 'loading', 'empty', 'error'],
    today: ['ready', 'loading', 'empty', 'error'],
    lede: ['ready', 'loading', 'empty', 'error'],
    chart: ['ready', 'loading', 'error'],
    usual: ['ready', 'loading', 'empty', 'error'],
    md: ['ready', 'loading', 'empty', 'error'],
    inline: ['ready', 'loading'],
};

// ── markup ──────────────────────────────────────────────────────────────────────────────────────────────────
export const STATE_SLOTS = {
    inline: () => `<div style="display:grid;gap:1.25rem;max-inline-size:28rem">
        <div class="kp-field" data-inline="slider"><label class="kp-field__label">Temperature</label><div class="kp-slider" data-kp-slider data-kp-min="10" data-kp-max="30" data-kp-step="0.5" data-kp-value="21" data-kp-default="21" data-kp-unit="°C" aria-label="Temperature"></div></div>
        <div class="kp-field" data-inline="time"><label class="kp-field__label">Backup time</label><div class="kp-time" data-kp-time data-kp-name="at" data-kp-value="03:00" aria-label="Backup time"></div></div>
        <div class="row" data-inline="version"><b>nextcloud</b><span class="kp-badge kp-badge--version" data-kp-version-from="10.11.11" data-kp-version-to="12.1"></span></div></div>`,
    uses: () => '<div class="kp-matrix" data-kp-matrix data-kp-view="lines" data-kp-matrix-owned aria-label="Which CV is used by which application"></div>',
    entity: () => '<div class="kp-entity-grid" data-kp-entity-grid data-kp-entity-min="22rem"></div>',
    claim: () =>
        '<div class="kp-checklist" data-kp-checklist data-kp-checklist-claim data-kp-claim-viewer="kenny" data-kp-claim-viewer-name="Kenny" data-kp-claim-take-all data-kp-claim-copy data-kp-checklist-empty="Nothing on the packing list yet." aria-label="Packing list for the Ardennes weekend"></div>',
    notices: () => '<div data-kp-notices data-kp-notices-look="page" data-kp-count-in-title="off"></div>',
    gallery: () => '<div class="kp-gallery" data-kp-gallery data-kp-lightbox-hash="off" aria-label="Photos, states"></div>',
    ops: () => `
        <div class="kp-ops" data-kp-ops-width="full">
            <header class="kp-ops__head kp-page-header"><div class="kp-page-header__inner"><div>
                <div class="kp-page-header__line"><h1 class="kp-page-header__title">Pump houses</h1></div>
                <p class="kp-page-header__description">Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.</p>
            </div></div></header>
            <div class="kp-ops__kpis"><div class="kp-kpis" role="group" aria-label="Network at a glance">
                <div class="kp-kpi"><span class="kp-kpi__label">Pump houses online</span><span class="kp-kpi__value">14<small>of 15</small></span><span class="kp-kpi__trend">Pump house 7 offline</span></div>
                <div class="kp-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412<small>m³/h</small></span><span class="kp-kpi__trend">Average over 15 minutes</span></div>
                <div class="kp-kpi"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span><span class="kp-kpi__trend">2 new today</span></div>
                <div class="kp-kpi"><span class="kp-kpi__label">Pressure alarms</span><span class="kp-kpi__value">1</span><span class="kp-kpi__trend">Pump house 3</span></div>
            </div></div>
            <div class="kp-ops__attention kp-attention" data-ops-attention></div>
            <div class="kp-ops__body" data-ops-body></div>
        </div>`,
    avail: () => '<div class="kp-availability" data-kp-availability data-kp-availability-narrow="by-column" aria-label="Who can come to the Ardennes weekend"></div>',
    inspector: () => '<div class="kp-card kp-inspector" data-kp-requests data-kp-requests-open="failed" data-kp-state="loading"></div>',
    quote: () =>
        '<figure class="kp-quote" data-kp-quote data-kp-quote-date="2026-10-14T19:40:00+02:00" data-kp-quote-lang="nl" data-kp-quote-why="What helped last time"><blockquote>Wandelen na het eten hielp, mijn hoofd werd rustiger.</blockquote></figure>',
    today: () => {
        const row = (/** @type {string} */ id, /** @type {string} */ state, /** @type {string} */ label) =>
            `<li class="kp-statusrow" data-state="${state}" data-kp-status-id="${id}"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">${label}</span><span class="kp-statusrow__detail"></span></span></li>`;
        return `<section class="kp-card" data-kp-state="ready" aria-labelledby="today-t-@"><div class="kp-card__header"><h3 class="kp-card__title" id="today-t-@">Today</h3></div><div class="kp-card__stage"><div class="kp-card__data"><ul class="kp-statuslist kp-statuslist--rows" aria-label="Today" data-kp-status-vocab="calm" data-kp-today-now="2026-10-17T12:00:00+02:00">${row('pills', 'open', 'Morning pills')}${row('walk', 'open', 'Walk after dinner')}${row('checkin', 'done', 'Evening check-in')}${row('plants', 'done', 'Water the plants')}</ul></div></div></section>`;
    },
    lede: () =>
        '<section class="kp-card" data-kp-state="ready" aria-labelledby="lede-t-@"><div class="kp-card__header"><h3 class="kp-card__title" id="lede-t-@">Schedules</h3></div><p class="kp-lede">Each schedule starts a job at fixed times. Pause one to stop it without deleting it.</p><div class="kp-card__stage"><div class="kp-card__data"><ul style="margin:0;padding-inline-start:1.25rem"><li>Nightly backup · 02:00</li><li>Weekly report · Monday 07:30</li><li>Certificate check · every 12 hours</li><li>Disk cleanup · Sunday 04:00</li></ul></div></div></section>',
    chart: () =>
        '<figure class="kp-chart" data-kp-chart data-kp-chart-median data-kp-chart-band="tint" aria-label="Pump house 1 pressure"><figcaption class="kp-chart__title">Pump house 1 pressure, bar</figcaption></figure>',
    usual: () =>
        `<div class="kp-combobox" data-kp-combobox data-kp-usual='["headache","fatigue","nausea","neck","anxiety","brainfog"]' data-kp-add="inline"><label class="kp-field__label" for="usual-@">Symptoms</label><div data-kp-tag-list hidden></div><input class="kp-combobox__input kp-field__input" id="usual-@" type="text" role="combobox" aria-expanded="false" aria-controls="usual-l-@" autocomplete="off" /><ul class="kp-combobox__list" id="usual-l-@" role="listbox" hidden>${['headache:Headache', 'fatigue:Fatigue', 'nausea:Nausea', 'neck:Neck pain', 'anxiety:Anxiety', 'brainfog:Brain fog']
            .map((o) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${o.split(':')[0]}">${o.split(':')[1]}</li>`)
            .join('')}</ul></div>`,
    md: () => `<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="17rem 1fr"><section data-kp-pane="list" aria-label="Secrets"><ul class="kp-pane__list" role="listbox" aria-label="Secrets" data-md-list></ul></section><section data-kp-pane="detail" aria-label="Secret"><h3 data-kp-pane-heading tabindex="-1"></h3><div class="kp-pane__body" data-md-body></div></section></div>`,
};

// ── data ────────────────────────────────────────────────────────────────────────────────────────────────────
const matrixSpec = () => {
    const cvs = [
        { key: 'cv-nl', label: 'CV Developer NL', sub: 'generic master, made 06/2026', glyph: 'pdf', href: '#cv-nl' },
        { key: 'cv-en', label: 'CV Developer EN', sub: 'generic master, made 06/2026', glyph: 'pdf', href: '#cv-en' },
        { key: 'bespoke', label: 'Bespoke CV', sub: 'written per application, no file', ghost: true, dashed: true },
        { key: 'none', label: 'No CV', sub: 'applications sent without one', ghost: true, dashed: true },
        { key: 'cv-2024', label: 'CV Developer 2024', sub: 'generic master, made 03/2024', glyph: 'pdf', href: '#cv-2024' },
    ];
    const apps = ['Deloitte', 'Takto', 'Colruyt Group', 'Proximus', 'Delaware', 'Federal Public Service Policy and Support', 'Sopra Steria'].map((label, i) => ({ key: `a${i}`, label, href: `#a${i}` }));
    const uses = { a0: 'cv-nl', a1: 'cv-nl', a6: 'cv-nl', a2: 'cv-en', a5: 'cv-en', a3: 'bespoke', a4: 'none' };
    return {
        corner: 'CV ↓ application →', rows: cvs, columns: apps,
        cell: (/** @type {string} */ row, /** @type {string} */ column) => (uses[/** @type {keyof typeof uses} */ (column)] === row ? { tone: 'ok', label: 'uses it' } : { tone: 'none' }),
        countLabel: (/** @type {number} */ n) => `${n} ${n === 1 ? 'application' : 'applications'}`, sourcesLabel: 'CVs', usersLabel: 'Applications',
    };
};
const acts = [{ id: 'restart', label: 'Restart' }, { id: 'logs', label: 'Logs' }, { id: 'update', label: 'Update' }, { id: 'remove', label: 'Remove', danger: true }];
const meters = (/** @type {number} */ cpu, /** @type {number} */ ram, /** @type {string} */ text) => [{ label: 'CPU', value: cpu }, { label: 'RAM', value: ram, text }, { label: 'Disk', value: 0.41 }];
const entities = () =>
    [['media', '106', 'running', 'success', '3/5', 0.34, 0.71], ['vault', '110', 'running', 'success', '2/2', 0.08, 0.22], ['gateway', '101', 'degraded', 'warning', '4/5', 0.82, 0.93], ['archive', '112', 'running', 'success', '1/1', 0.12, 0.3]].map(
        ([name, vmid, label, tone, up, cpu, ram]) => ({
            key: name, name, vmid, state: { label, tone }, figures: [{ value: up, label: 'apps up' }, { value: '12', label: 'restarts' }], flags: [], meters: meters(+cpu, +ram, '5.6 of 8 GB'), actions: acts,
        }),
    );
const KENNY = { id: 'kenny', name: 'Kenny' };
const TOM = { id: 'tom', name: 'Tom' };
const ANNA = { id: 'anna', name: 'Anna' };
const BO = { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' };
const packing = () => [
    { id: 'stove', label: 'Gas stove', detail: '1', group: 'Kitchen', claim: { by: [] } },
    { id: 'pots', label: 'Two pots and a frying pan', detail: '3', group: 'Kitchen', claim: { by: [ANNA, TOM] } },
    { id: 'coffee', label: 'Coffee, filters and the little dripper for the mornings in the tent', detail: '1 kg', group: 'Kitchen', claim: { by: [BO] } },
    { id: 'water', label: 'Water cans', detail: '2 x 10 l', group: 'Kitchen', claim: { by: [] } },
    { id: 'tent', label: 'Tent', detail: '1', group: 'Sleeping', claim: { by: [] } },
    { id: 'mats', label: 'Sleeping mats', detail: '4', group: 'Sleeping', claim: { by: [KENNY] } },
    { id: 'lamp', label: 'Lantern', detail: '1', group: 'Sleeping', claim: { by: [TOM] } },
    { id: 'van', label: 'Roof box on the van', detail: '1', group: 'Sleeping', claim: { by: [TOM], locked: 'Already on the van' } },
    { id: 'aid', label: 'First-aid kit', detail: '1', group: 'Safety', claim: { by: [] } },
    { id: 'map', label: 'Paper maps of the Ardennes', detail: '2', group: 'Safety', claim: { by: [ANNA] } },
    { id: 'fire', label: 'Fire extinguisher', detail: '1', group: 'Safety', claim: { by: [] } },
];
const min = (/** @type {number} */ m) => Date.now() - m * 60000;
const noticeItems = () => [
    { key: 'seven', severity: 'critical', title: 'Pump house 7 has sent no reading since 06:00', since: min(20), consequence: 'Its pressure is unknown.', remedy: 'Restart the modem.', fix: { label: 'Restart the modem' }, source: 'north' },
    { key: 'res', severity: 'warning', title: 'Reservoir South fills slower than forecast', since: min(75), consequence: '64 % now, 70 % expected by 09:00.', remedy: 'Check valve 2 on the next visit.', source: 'south' },
    { key: 'fw', severity: 'info', title: 'Firmware 4.2 is out for six field units', since: min(1400), consequence: 'It fixes the flow meter’s drift after a power cut.', remedy: 'Plan the update.', fix: { label: 'Plan the update' }, source: 'north' },
    { key: 'bk', severity: 'info', title: 'The nightly backup finished', since: min(600), consequence: '4.1 GB in 3 min 12 s.', read: true, source: 'archive' },
    { key: 'c1', severity: 'info', title: 'A new visitor account was created', since: min(2200), read: true, source: 'north' },
    { key: 'c3', severity: 'warning', title: 'Disk usage on the archive passed 80 %', since: min(4000), remedy: 'Clear old exports.', fix: { label: 'Open the archive' }, source: 'archive' },
];
const noticeSources = [{ key: 'north', label: 'Northern network' }, { key: 'south', label: 'Southern network' }, { key: 'archive', label: 'Archive', muted: true }];
const galleryItems = () => {
    const names = ['Mila', 'Jonas', 'Noor', 'Lars', 'Fien'];
    const notes = ['Sunrise over the lake before anyone was up.', 'Fog on the pine ridge; the path is just visible.', 'The harbour an hour after the last ferry.', 'A dune after a day of wind, with our footprints still in it.', 'The field behind the house, first snow.', 'The market stall with the best waffles, which we visited twice.', 'The old bridge, which is much older than the town says.', 'Roofs of the old town from the tower.'];
    const dims = [[3200, 2133], [2400, 1600], [3200, 2133], [2400, 1600], [1600, 2400], [3200, 2133], [2400, 1600], [3200, 2133]];
    return notes.map((caption, i) => ({
        id: String(i + 1), src: `../kpadopt56/src/kpadopt6-media/files/photo-${String(i + 1).padStart(2, '0')}.svg`, width: dims[i][0], height: dims[i][1],
        alt: caption.split('.')[0].split(';')[0], caption, uploader: names[i % names.length], at: Date.parse(`2026-10-${String(5 + i).padStart(2, '0')}T${String(8 + i).padStart(2, '0')}:00:00+02:00`),
    }));
};
const OPS_CARDS = [
    [8, 'Latest readings', ['Pump house 1: 3.4 bar, 52 m³/h', 'Pump house 2: 3.1 bar, 48 m³/h', 'Pump house 3: 2.1 bar, 12 m³/h', 'Pump house 4: 3.6 bar, 61 m³/h']],
    [4, 'Planned visits', ['Tomorrow 09:00: pump house 7', 'Friday 13:30: pump house 3']],
    [6, 'Pressure, last 24 hours', ['Lowest 2.1 bar at 06:10', 'Highest 3.8 bar at 19:45']],
    [6, 'Flow, last 24 hours', ['Lowest 21 m³/h at 03:20', 'Highest 98 m³/h at 18:05', 'Total 1,284 m³']],
    [4, 'Reservoir North', ['64 % full', 'Expected 70 % by 09:00']],
    [4, 'Reservoir South', ['81 % full']],
    [4, 'Reservoir East', ['47 % full', 'Filling', 'Valve 2 open']],
    [3, 'Alarms today', ['1']],
];
const AV_PEOPLE = [{ id: 'kenny', name: 'Kenny', mine: true }, { id: 'tom', name: 'Tom' }, { id: 'anna', name: 'Anna' }, { id: 'bo', name: 'Bo Vandenbroucke-Lemmens' }, { id: 'lies', name: 'Lies' }];
const RANGES = [availabilityRange('2026-11-06', '2026-11-08'), availabilityRange('2026-11-13', '2026-11-15'), availabilityRange('2026-11-20', '2026-11-22'), availabilityRange('2026-11-27', '2026-12-01')];
const DAYS = availabilityDays('2026-11-06', 9);
const avSpec = (/** @type {'ready' | 'loading' | 'error' | 'empty'} */ state) => {
    const r = RANGES.map((c) => c.key);
    const empty = state === 'empty';
    return {
        unit: /** @type {'range'} */ ('range'), people: AV_PEOPLE, canSwitchUnit: true,
        sets: {
            range: { columns: empty ? [] : RANGES, answers: empty ? {} : { kenny: { [r[0]]: 'yes', [r[1]]: 'maybe', [r[2]]: 'yes' }, tom: { [r[0]]: 'yes', [r[1]]: 'maybe', [r[2]]: 'yes' }, anna: { [r[0]]: 'no', [r[1]]: 'yes', [r[2]]: 'no' }, bo: { [r[0]]: 'no', [r[1]]: 'maybe', [r[3]]: 'yes' }, lies: { [r[0]]: 'maybe', [r[1]]: 'maybe', [r[3]]: 'yes' } } },
            day: { columns: empty ? [] : DAYS, answers: {} },
        },
        state: /** @type {'ready' | 'loading' | 'error'} */ (empty ? 'ready' : state),
        ...(empty ? { emptyAction: 'Propose a date' } : {}),
    };
};
const AT = (/** @type {number} */ m) => new Date(Date.UTC(2026, 9, 17, 18, 20) - m * 60000).toISOString();
const h = { 'content-type': 'application/json', 'user-agent': 'homelab-hooks/3.75' };
const REQUESTS = [
    { at: AT(1), method: 'POST', path: '/hooks/backup/done?stack=media&attempt=1', status: 202, headers: h, body: '{"ok":true}', bodyBytes: 11, source: 'test' },
    { at: AT(4), method: 'GET', path: '/health', status: 200, headers: h },
    { at: AT(9), method: 'POST', path: '/hooks/deploy/ghent/production-cluster/rollout', status: 502, headers: h, body: '{"error":"upstream did not answer"}', bodyBytes: 35 },
    { at: AT(22), method: 'POST', path: '/api/v1/events', status: 404, headers: h, body: '{"error":"unknown topic"}', bodyBytes: 25 },
    { at: AT(40), method: 'GET', path: '/api/v1/stacks', status: 200, headers: h },
    { at: AT(55), method: 'POST', path: '/hooks/backup/done?stack=vault&attempt=1', status: 202, headers: h, body: '{"ok":true}', bodyBytes: 11 },
    { at: AT(80), method: 'GET', path: '/health', status: 200, headers: h },
];
const SECRETS = [
    ['production/database/replica-reader-credentials-for-the-reporting-service', 'Read-only login for the reporting replica', 'Mira Vandenberg'],
    ['production/mail/smtp-relay', 'Relay password for outgoing mail', 'Tom Lambrecht'],
    ['production/storage/backup-bucket-key', 'Access key for the nightly backup bucket', 'Mira Vandenberg'],
    ['staging/database/primary', 'Login for the staging database', 'Joke Peeters'],
    ['staging/queue/broker-token', 'Token for the staging message broker', 'Joke Peeters'],
    ['shared/monitoring/alert-webhook', 'Webhook address for the alert channel', 'Tom Lambrecht'],
];
const CHART_NOW = Date.UTC(2026, 9, 17, 10, 0);
const noise = (/** @type {number} */ t, /** @type {number} */ k) => { const v = Math.sin((t / 60_000) * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v) - 0.5; };
const chartData = () => {
    const to = CHART_NOW - 12 * HOUR;
    const from = to - 72 * HOUR;
    const points = /** @type {[number, number][]} */ ([]);
    for (let t = from - 6 * HOUR; t <= to + 12 * HOUR; t += HOUR) points.push([t, 3.7 - 0.5 * Math.max(0, Math.sin(((t / HOUR) % 24) / 24 * Math.PI * 2 - 1.2)) + 0.12 * noise(t, 2)]);
    return {
        unit: 'bar', from, to, height: 190, series: [{ label: 'Pump house 1', points }],
        kinds: { operation: { label: 'An operation the host ran', tone: 'info' }, update: { label: 'An update', tone: 'warning' }, failure: { label: 'A failure', tone: 'critical' } },
        events: [{ at: from + 9 * HOUR, label: 'Backup finished', kind: 'operation' }, { at: from + 22 * HOUR, label: 'Firmware 4.2 installed', kind: 'update' }, { at: from + 50 * HOUR, label: 'Pressure sensor lost contact', kind: 'failure' }],
    };
};

// ── the drivers: one function per component, run on one copy of it ─────────────────────────────────────────
/** @type {Record<string, (el: HTMLElement, state: string) => void>} */
const DRIVERS = {
    inline(el, state) {
        const slider = /** @type {HTMLElement} */ (el.querySelector('.kp-slider'));
        const time = /** @type {HTMLElement} */ (el.querySelector('.kp-time'));
        const version = /** @type {HTMLElement} */ (el.querySelector('.kp-badge--version'));
        void import('../../js/slider.js').then((m) => m.setSliderState(slider, state === 'loading' ? 'loading' : 'ready'));
        if (state === 'loading') time.setAttribute('data-kp-state', 'loading');
        else time.removeAttribute('data-kp-state');
        void import('../../js/version-delta.js').then((m) => m.setVersionDelta(version, { state: /** @type {any} */ (state), error: '' }));
    },
    uses(el, state) {
        const spec = matrixSpec();
        if (state === 'ready') setMatrix(el, { ...spec, view: 'lines' });
        else if (state === 'loading') setMatrix(el, { ...spec, view: 'lines', state: 'loading', skeleton: 5 });
        else if (state === 'empty') setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'empty', message: 'No CV is in use yet' });
        else setMatrix(el, { view: 'lines', rows: [], columns: [], state: 'error', message: 'The CVs could not be read' });
    },
    entity(el, state) {
        if (state === 'ready') setEntityGrid(el, entities());
        else setEntityGridState(el, /** @type {'loading' | 'empty' | 'error'} */ (state), { count: 4, message: state === 'error' ? 'The host did not answer.' : undefined });
    },
    claim(el, state) {
        if (state === 'empty') { setChecklistItems(el, []); setChecklistState(el, 'ready'); }
        else if (state === 'ready') { setChecklistItems(el, packing()); setChecklistState(el, 'ready'); }
        else if (state === 'error') setChecklistState(el, 'error', 'The packing list could not be read.');
        else setChecklistState(el, 'loading');
    },
    notices(el, state) {
        setNotices(el, { state: /** @type {any} */ (state), items: state === 'ready' ? noticeItems() : [], sources: noticeSources, quietUntil: null, error: 'The host did not answer.' });
    },
    gallery(el, state) {
        if (state === 'ready') setGallery(el, { items: galleryItems(), state: 'ready', add: true });
        else if (state === 'loading') setGallery(el, { state: 'loading', add: true, skeleton: 8 });
        else if (state === 'empty') setGallery(el, { items: [], add: true, state: 'empty', message: 'No pictures yet' });
        else setGallery(el, { state: 'error', message: 'The pictures could not be loaded' });
    },
    ops(el, state) {
        const page = el;
        const body = /** @type {HTMLElement} */ (page.querySelector('[data-ops-body]'));
        if (!body.childElementCount)
            for (const [span, title, lines] of OPS_CARDS) {
                const card = document.createElement('section');
                card.className = 'kp-card';
                card.setAttribute('data-kp-state', 'ready');
                card.setAttribute('data-kp-span', String(span));
                card.setAttribute('data-kp-loading-words', 'Reading…');
                card.innerHTML = `<div class="kp-card__header"><h2 class="kp-card__title"></h2></div><div class="kp-card__stage"><div class="kp-card__data"></div></div>`;
                /** @type {HTMLElement} */ (card.querySelector('.kp-card__title')).textContent = String(title);
                const data = /** @type {HTMLElement} */ (card.querySelector('.kp-card__data'));
                for (const line of /** @type {string[]} */ (lines)) { const p = document.createElement('p'); p.style.margin = '0 0 0.25rem'; p.textContent = line; data.append(p); }
                body.append(card);
            }
        page.setAttribute('data-kp-state', state);
        for (const tile of $$('.kp-kpi', page)) {
            tile.dataset.opsHtml ??= tile.innerHTML;
            if (state === 'loading') { tile.innerHTML = '<span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>'; tile.setAttribute('aria-busy', 'true'); }
            else { tile.innerHTML = tile.dataset.opsHtml; tile.removeAttribute('aria-busy'); }
        }
        for (const card of $$('.kp-card', page)) setCardState(card, state === 'loading' ? 'loading' : 'ready');
        const band = /** @type {HTMLElement} */ (page.querySelector('[data-ops-attention]'));
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'kp-button kp-button--sm';
        retry.textContent = 'Retry';
        setAttention(band, state === 'error' ? [{ key: 'page', severity: 'critical', title: 'The pump houses could not be read', text: 'The network did not answer. What is shown is from earlier.', action: retry }] : []);
    },
    avail(el, state) { setAvailability(el, avSpec(/** @type {any} */ (state))); },
    inspector(el, state) {
        if (state === 'ready') { setRequests(el, REQUESTS); setRequestsState(el, 'ready'); }
        else setRequestsState(el, /** @type {any} */ (state), { message: 'The hook log could not be read.' });
    },
    quote(el, state) { setQuoteState(el, /** @type {any} */ (state)); },
    today(el, state) { setTodayState(el, /** @type {any} */ (state)); },
    lede(el, state) {
        if (state === 'ready') setCardState(el, 'ready');
        else if (state === 'loading') setCardState(el, 'loading', { words: 'Reading the schedules…' });
        else if (state === 'empty') setCardState(el, 'empty', { title: 'No schedules yet', text: 'A schedule starts a job at fixed times.' });
        else setCardState(el, 'error', { title: 'The schedules could not be read', text: 'The service did not answer in time.' });
    },
    chart(el, state) {
        el.toggleAttribute('data-kp-chart-loading', state === 'loading');
        if (state === 'error') setChartData(el, { ...chartData(), error: 'The readings could not be read. Check the connection and try again.', series: [] });
        else setChartData(el, chartData());
    },
    usual(el, state) {
        if (state === 'empty') {
            el.dataset.savedList ??= el.querySelector('[role="listbox"]')?.innerHTML ?? '';
            el.querySelector('[role="listbox"]')?.replaceChildren();
        } else if (el.dataset.savedList) {
            const list = el.querySelector('[role="listbox"]');
            if (list) list.innerHTML = el.dataset.savedList;
            delete el.dataset.savedList;
        }
        setUsualState(el, /** @type {any} */ (state === 'empty' ? 'ready' : state));
        el.setAttribute('data-kp-add', 'inline');
    },
    md(el, state) {
        const md = masterDetail(el);
        if (!md) return;
        const list = /** @type {HTMLElement} */ (el.querySelector('[data-md-list]'));
        if (!list.childElementCount)
            SECRETS.forEach(([name], at) => { const li = document.createElement('li'); li.setAttribute('data-kp-pane-key', String(at)); li.textContent = name; list.append(li); });
        if (state === 'empty') { md.select(null); md.close(); setPaneState(el, 'empty'); return; }
        if (md.key() === null) md.select('0');
        const [name, about, owner] = SECRETS[Number(md.key())] ?? SECRETS[0];
        /** @type {HTMLElement} */ (el.querySelector('[data-kp-pane-heading]')).textContent = name;
        const body = /** @type {HTMLElement} */ (el.querySelector('[data-md-body]'));
        body.innerHTML = '<dl style="display:grid;grid-template-columns:auto 1fr;gap:0.25rem 1rem;margin:0"><dt>Purpose</dt><dd style="margin:0"></dd><dt>Owner</dt><dd style="margin:0"></dd><dt>Last changed</dt><dd style="margin:0">12/10/2026 14:05</dd><dt>Read</dt><dd style="margin:0">1,284 times</dd></dl>';
        const dds = body.querySelectorAll('dd');
        dds[0].textContent = about;
        dds[1].textContent = owner;
        if (state === 'ready') setPaneState(el, 'ready');
        else if (state === 'loading') setPaneState(el, 'loading');
        else setPaneState(el, 'error', { text: 'The vault did not answer. Nothing was changed.' });
    },
};

/** The component inside a slot. @param {HTMLElement} slot */
const componentOf = (slot) => /** @type {HTMLElement} */ (slot.firstElementChild);
/** Put every copy (Now and Proposed) of a component in a state, inside one item. @param {HTMLElement} item @param {string} name @param {string} state */
export function driveState(item, name, state) {
    for (const slot of $$(`[data-slot="${name}"]`, item)) DRIVERS[name](componentOf(slot), state);
    for (const b of $$(`[data-statebar="${name}"] button`, item)) b.setAttribute('aria-pressed', String(b.dataset.state === state));
    /** @type {any} */ (window).kpProposedAfter?.(item, name, state);
}

/** Draw the state buttons and the first (ready) state; call once the package's boot is done. */
export function initStates() {
    for (const el of $$('[data-slot="claim"] [data-kp-checklist]')) setClaimPeople(el, [KENNY, TOM, ANNA, BO]);
    for (const bar of $$('[data-statebar]')) {
        const name = /** @type {string} */ (bar.dataset.statebar);
        for (const state of STATES[/** @type {keyof typeof STATES} */ (name)]) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'kp-button kp-button--sm';
            b.dataset.state = state;
            b.textContent = { ready: 'Ready', loading: 'Loading', empty: 'Empty', error: 'Failed' }[/** @type {'ready'} */ (state)];
            b.setAttribute('aria-pressed', 'false');
            b.addEventListener('click', () => driveState(/** @type {HTMLElement} */ (bar.closest('.item')), name, state));
            bar.append(b);
        }
        driveState(/** @type {HTMLElement} */ (bar.closest('.item')), name, 'ready');
    }
    window.kpDriveState = (/** @type {string} */ id, /** @type {string} */ name, /** @type {string} */ state) => driveState(/** @type {HTMLElement} */ (document.getElementById(id)), name, state);
}
