// research/almanac-calendars: the sample data of the page and the markup helpers that build.mjs (Node) and demo.js (browser) share.
// Real (19/10/2026): version 4.1.7, three calendars, the home-assistant profile, 3 events accepted and delivered since start.
// Mock, and said so on the page: the calendar ids, every source except home-assistant, the token and use figures, the profile
// files that are not served.

/** @param {string} s */
export const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The four sources: a profile file each (schema_version 2, Europe/Brussels, 60 minutes). */
export const SOURCES = [
    { id: 'home-assistant', calendar: 'huishouden', token: 'active', last: '19/10/2026 13:48', uses: 128, file: 'home-assistant.toml', real: true },
    { id: 'homelab', calendar: 'infra', token: 'active', last: '18/10/2026 22:10', uses: 41, file: 'homelab.toml' },
    { id: 'kyu', calendar: 'infra', token: 'active', last: '19/10/2026 07:30', uses: 17, file: 'kyu.toml' },
    { id: 'claude-sessions', calendar: 'infra', token: 'revoked', last: '02/10/2026 09:12', uses: 9, file: 'claude-sessions.toml' },
];

/** The calendars the service account sees. The ids are mock: real ids never leave the deployment. */
export const CALENDARS = [
    { key: 'huishouden', name: 'Almanac · Huishouden', id: 'c_4d1f09b2a7e35c68@group.calendar.google.com', events: 212 },
    { key: 'infra', name: 'Almanac · Infra', id: 'c_91ab33e07f5d2c14@group.calendar.google.com', events: 87 },
    { key: 'test', name: 'almanac-test', id: 'c_0e7b5a6c13d94f82@group.calendar.google.com', events: 3 },
];

/** Profile files Almanac cannot use (the first is the real-looking single case, the other two make a longer list). */
export const UNSERVED = [
    {
        key: 'weekly-report',
        file: 'weekly-report.toml',
        why: 'It says schema_version = 1, and this version of Almanac reads only 2, so a post for its source answers 401.',
        remedy: 'Change the line to schema_version = 2 and reload the profiles, or delete the file.',
    },
    {
        key: 'backup-nightly',
        file: 'backup-nightly.toml',
        why: 'Its target_calendar_id is empty, so Almanac does not know which calendar the events go to.',
        remedy: 'Write a calendar id from the Calendars table into the file and reload the profiles, or delete the file.',
    },
    {
        key: 'garden',
        file: 'garden.toml',
        why: 'The timezone Europe/Brusels is not a known time zone.',
        remedy: 'Write it as Europe/Brussels and reload the profiles, or delete the file.',
    },
];

export const SAMPLE = 'Sample data: the calendar ids, the token and use figures and every source except home-assistant are made up.';

/** @param {string} key */
export const calendarOf = (key) => /** @type {(typeof CALENDARS)[number]} */ (CALENDARS.find((c) => c.key === key));
/** @param {string} key */
export const sourcesOf = (key) => SOURCES.filter((s) => s.calendar === key);

/** The words a hover card says about a source. @param {(typeof SOURCES)[number]} s */
export function sourceCardText(s) {
    return s.token === 'revoked'
        ? `${s.id}: token revoked, so posts are refused. Last used ${s.last}. ${s.uses} events posted.`
        : `${s.id}: token active. Last used ${s.last}. ${s.uses} events posted.`;
}

/** @param {(typeof CALENDARS)[number]} c */
export function usedByCell(c) {
    const used = sourcesOf(c.key);
    if (!used.length) return '<span class="kp-text-muted">No source writes here</span>';
    return `<ul class="kp-tag-list" aria-label="Sources that write to ${esc(c.name)}">${used
        .map((s) => `<li class="kp-tag" tabindex="0" data-kp-hovercard="${esc(sourceCardText(s))}">${esc(s.id)}</li>`)
        .join('')}</ul>`;
}

/** The delete button of a row: typed confirm with the name, or disabled with the reason. @param {(typeof CALENDARS)[number]} c */
export function deleteCell(c) {
    const used = sourcesOf(c.key);
    const base = `type="button" class="kp-button kp-button--destructive kp-button--sm" data-kp-destructive data-kp-confirm="Delete the calendar ${esc(c.name)}?" data-kp-confirm-type="${esc(c.name)}" data-kp-confirm-loses="ac-lose-${c.key}" data-kp-confirm-label="Delete calendar" data-ac-delete="${c.key}"`;
    if (used.length) {
        const names = used.map((s) => s.id).join(', ');
        return `<button ${base} disabled data-kp-disabled-reason="Used by ${esc(names)}. Delete ${used.length === 1 ? 'that source' : 'those sources'} first, on the Sources page.">Delete</button>`;
    }
    return `<button ${base}>Delete</button>`;
}

/** One table row. @param {(typeof CALENDARS)[number]} c */
export function calendarRow(c) {
    return `<tr data-kp-row-key="${c.key}">
<td data-label="Name" data-kp-sort-value="${esc(c.name)}">${esc(c.name)}</td>
<td data-label="Calendar id"><figure class="kp-code kp-code--cell" data-kp-code aria-label="Calendar id of ${esc(c.name)}"><pre class="kp-code__body"><code>${esc(c.id)}</code></pre></figure></td>
<td data-label="Used by" data-kp-sort-value="${sourcesOf(c.key).length}">${usedByCell(c)}</td>
<td data-label="Actions" class="kp-text-end"><span class="kp-row-actions">${deleteCell(c)}</span></td>
</tr>`;
}

/** What a delete loses: a template per calendar, named by data-kp-confirm-loses. */
export function losesTemplates() {
    return CALENDARS.map(
        (c) => `<template id="ac-lose-${c.key}"><ul class="kp-type-confirm__list"><li>Every event on it: ${c.events} events</li><li>The calendar itself, for everyone it is shared with</li></ul></template>`,
    ).join('\n');
}

/** A served profile file row. @param {(typeof SOURCES)[number]} s */
export function servedRow(s) {
    const cal = calendarOf(s.calendar);
    const health = s.token === 'revoked' ? ['warn', 'Served, token revoked'] : ['ok', 'Served'];
    return `<tr data-kp-row-key="${esc(s.file)}">
<td data-label="File"><code class="kp-mono">${esc(s.file)}</code></td>
<td data-label="Source">${esc(s.id)}</td>
<td data-label="Calendar">${esc(cal.name)}</td>
<td data-label="Health" data-kp-sort-value="${health[0] === 'ok' ? 0 : 1}"><span class="kp-health" data-state="${health[0]}"><span class="kp-health__dot" aria-hidden="true"></span> ${health[1]}</span></td>
</tr>`;
}

/** The uses map's nodes: the calendars on the left (with their count), the sources on the right. */
export function usesNodes() {
    const rows = CALENDARS.map((c) => ({
        key: c.key,
        label: c.name,
        sub: c.id.slice(0, 18) + '…',
        href: '#cal-' + c.key,
    }));
    const columns = SOURCES.map((s) => ({ key: s.id, label: s.id, sub: s.token === 'revoked' ? 'token revoked' : undefined, href: '#src-' + s.id, tone: s.token === 'revoked' ? 'warn' : undefined }));
    return { rows, columns };
}

/** The same relation for the network graph. */
export function usesGraph() {
    return {
        hub: 'infra',
        nodes: [
            ...CALENDARS.map((c) => ({ id: c.key, label: c.name, kind: 'calendar', description: `${c.events} events; written by ${sourcesOf(c.key).map((s) => s.id).join(', ') || 'no source'}` })),
            ...SOURCES.map((s) => ({ id: s.id, label: s.id, kind: 'source', description: `${s.file}; token ${s.token}; last used ${s.last}` })),
        ],
        edges: SOURCES.map((s) => ({ from: s.id, to: s.calendar, kind: 'writes', detail: `${s.uses} events posted` })),
        kinds: [{ kind: 'writes', label: 'Writes to', hint: 'A source posts its events into this calendar', style: 'solid', colour: 'var(--chart-1)' }],
    };
}

/** The inside of the New calendar dialog (title, sentence, form with two sections); `p` keeps the ids apart. @param {string} p */
export function newDialogInner(p) {
    return `<h2 class="kp-dialog__title" id="${p}-title">New calendar</h2>
<p class="kp-dialog__description" id="${p}-desc">Almanac makes the calendar in Google and shares it with you.</p>
<form class="kp-form" data-kp-form novalidate data-ac-new-form>
<div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
<div class="kp-dialog__body">
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Name</h3>
<div class="kp-field">
<label class="kp-field__label" for="${p}-name">Calendar name <span class="kp-field__required">required</span></label>
<input class="kp-field__input" id="${p}-name" name="name" required autocomplete="off" aria-describedby="${p}-help" placeholder="Household" />
<span class="kp-field__help" id="${p}-help">It shows in Google Calendar exactly as typed.</span>
<span class="kp-field__error" data-kp-field-error hidden></span>
</div>
</section>
<section class="kp-dialog__section">
<h3 class="kp-dialog__heading">Sharing</h3>
<p class="kp-dialog__note" data-ac-sharing>The calendar is shared with the owner Almanac is set up for, so it shows up in their Google Calendar at once.</p>
</section>
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button" data-ac-new-cancel>Cancel</button>
<button type="submit" class="kp-button kp-button--primary" data-kp-submit data-ac-new-go data-kp-disabled-reason="Almanac cannot make calendars: the owner is not set.">Make and share</button>
</div>
</form>`;
}

/** A count tile that filters the rows it counts (a toggle KPI). */
const toggleTile = (/** @type {string} */ key, /** @type {string} */ label, /** @type {string} */ value, /** @type {string} */ trend, tone = '') =>
    `<button type="button" class="kp-kpi kp-kpi--toggle" aria-pressed="false" data-ac-kpi="${key}"${tone ? ` data-kp-tone="${tone}"` : ''}><span class="kp-kpi__label">${label}</span><span class="kp-kpi__hint" aria-hidden="true"><span data-kp-when="off">Filter</span><span data-kp-when="on">Filtering ×</span></span><span class="kp-kpi__value">${value}</span><span class="kp-kpi__trend">${trend}</span></button>`;

/** Deliveries per hour over the last 24 hours: sample data (real traffic is three events in all). */
const SPARK = [0, 1, 0, 0, 2, 3, 1, 0, 0, 4, 6, 3, 2, 1, 0, 0, 2, 5, 7, 4, 2, 1, 1, 0];

/** The counts strip: three toggle tiles that filter their rows and one trend tile with a sample sparkline. @param {'ready' | 'empty'} state */
export function kpiStrip(state) {
    const unused = CALENDARS.filter((c) => !sourcesOf(c.key).length).length;
    const revoked = SOURCES.filter((s) => s.token === 'revoked').length;
    const ready = state === 'ready';
    const data = JSON.stringify({ unit: 'events', digits: 0, series: [{ label: 'Events delivered', start: Date.parse('2026-10-18T13:00:00Z'), step: 3600000, values: SPARK }] });
    return [
        toggleTile('calendars', 'Calendars', ready ? String(CALENDARS.length) : '0', ready ? `${unused} is used by no source` : 'Make the first one'),
        toggleTile('sources', 'Sources', ready ? String(SOURCES.length) : '0', ready ? `${revoked} token revoked` : 'Add one on the Sources page'),
        toggleTile('unserved', 'Profile files not served', ready ? '1' : '0', ready ? UNSERVED[0].file : 'Every profile file is served', ready ? 'warning' : ''),
        `<div class="kp-kpi kp-kpi--trend"><span class="kp-kpi__label">Events delivered <span class="kp-kpi__label-note">per hour, sample data</span></span><span class="kp-kpi__value">${ready ? '38' : '0'}<small>today</small></span><span class="kp-kpi__trend">${ready ? 'Busiest hour 7 events at 19:00' : 'Nothing delivered yet'}</span>${ready ? `<figure class="kp-kpi__chart" data-kp-chart="spark" data-kp-spark-head="none" data-kp-spark-axis="relative" aria-label="Events delivered, last 24 hours (sample data)"><script type="application/json" data-kp-chart-data>${data}</script></figure>` : ''}</div>`,
    ].join('');
}

/** The five toast flavours Almanac raises, as the words each outcome says; the page clones one per real outcome. */
export function toastTemplates() {
    const t = [
        ['success', 'Done.'],
        ['info', 'Nothing changed.'],
        ['warning', 'Partly done.'],
        ['error', 'It did not work.'],
        ['destructive', 'A delete was refused.'],
    ];
    return `<template data-ac-toasts>${t.map(([k, w]) => `<div class="kp-toast kp-toast--${k}" data-ac-toast="${k}">${w}</div>`).join('')}</template>`;
}
