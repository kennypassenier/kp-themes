// research/kpadopt2: the sections of action tiles, status rows and the facet list (imported by ../build.mjs).
import { ACT, FAC, STA } from './looks.mjs';

// Round 5 asks the fifteen non-formal themes, so formal's approved lines stay in looks.mjs but leave the page.
const THEMES = [
    ['dark', 'Dark'],
    ['cyberpunk', 'Cyberpunk'],
    ['synthwave', 'Synthwave'],
    ['pastel', 'Pastel'],
    ['forest', 'Forest'],
    ['blueprint', 'Blueprint'],
    ['solstice', 'Solstice'],
    ['brutalism', 'Brutalism'],
    ['deco', 'Art Deco'],
    ['nostromo', 'Nostromo'],
    ['titanium', 'Titanium'],
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const look = (map) =>
    `<div data-review-look>\n${THEMES.map(([t]) => `                        <p data-for="${t}">${esc(map[t]).replace(/&quot;/g, '"')}</p>`).join('\n')}\n                    </div>`;

/** The plain statement of what to see and what each control does, one per section (Kenny, 2026-10-16). */
const expected = (items) => `<div class="ta-expect"><p><b>Expected:</b></p><ul>${items}</ul></div>`;

// ------------------------------------------------------------------ action tiles
/** @param {{tag?:'button'|'a',title:string,text:string,meta?:string,mark?:boolean,cls?:string,attrs?:string}} t */
const tile = (t) => {
    const tag = t.tag ?? 'button';
    const open =
        tag === 'a'
            ? `<a class="kp-action${t.cls ? ` ${t.cls}` : ''}" href="${t.href ?? '#target'}"${t.attrs ? ` ${t.attrs}` : ''}>`
            : `<button type="button" class="kp-action${t.cls ? ` ${t.cls}` : ''}"${t.attrs ? ` ${t.attrs}` : ''}>`;
    return `${open}<strong class="kp-action__title">${esc(t.title)}</strong><span class="kp-action__mark" aria-hidden="true"></span><span class="kp-action__text">${esc(t.text)}</span>${
        t.meta ? `<span class="kp-action__meta">${esc(t.meta)}</span>` : ''
    }</${tag}>`;
};

const LIVE_TILES = [
    { title: 'Back up now', text: 'Copies every volume to the backup disk and checks the copy.', attrs: 'data-ta-live="backup"' },
    { title: 'Restart the dashboard', text: 'About ten seconds.', attrs: 'data-ta-live="restart"' },
    {
        tag: 'a',
        title: 'Host',
        text: 'CPU, memory, disks and temperatures of the machine underneath, and the updates that wait for it.',
        meta: 'load 0.42 · 61 °C',
        href: '#host',
    },
    { tag: 'a', title: 'Backups', text: 'What was copied, when, and how to get a file back.', href: '#backups' },
    { tag: 'a', title: 'Download the audit log', text: 'Every change of the last 90 days as one file.', href: '#audit' },
    { title: 'Delete all snapshots', text: 'Frees 48 GB. This cannot be undone.', cls: 'kp-action--destructive', attrs: 'data-ta-live="delete"' },
    { title: 'Check for updates', text: 'Not while a backup is running.', attrs: 'disabled' },
    { title: 'Rebuild the search index', text: 'Reads every note again; the search is slow until it is done.', attrs: 'aria-busy="true"' },
].map((t) => (t.tag === 'a' ? t : { ...t })); // eslint-disable-line

const liveGrid = (extra = '') => `<div class="kp-actions${extra}" role="group" aria-label="System actions">${LIVE_TILES.map(tile).join('')}</div>`;

const stateCells = (tag) => {
    const base = tag === 'a' ? { tag: 'a', href: '#target' } : {};
    const t = (
        cls,
        attrs,
        title = tag === 'a' ? 'Open the host page' : 'Back up now',
        text = 'Copies every volume to the backup disk and checks the copy.',
    ) => tile({ ...base, title, text, cls, attrs });
    return {
        default: t(''),
        hover: t('ta-is-hover'),
        focus: t('ta-is-focus'),
        pressed: t('ta-is-active'),
        disabled: tag === 'a' ? t('', 'aria-disabled="true"') : t('', 'disabled'),
        busy: t('', 'aria-busy="true"'),
        destructive: t(
            'kp-action--destructive',
            '',
            tag === 'a' ? 'Open the danger zone' : 'Delete all snapshots',
            'Frees 48 GB. This cannot be undone.',
        ),
        destructiveHover: t(
            'kp-action--destructive ta-is-hover',
            '',
            tag === 'a' ? 'Open the danger zone' : 'Delete all snapshots',
            'Frees 48 GB. This cannot be undone.',
        ),
        destructiveDisabled: t(
            'kp-action--destructive',
            tag === 'a' ? 'aria-disabled="true"' : 'disabled',
            tag === 'a' ? 'Open the danger zone' : 'Delete all snapshots',
            'Frees 48 GB. This cannot be undone.',
        ),
    };
};
const B = stateCells('button');
const A = stateCells('a');
const row = (name, ...cells) =>
    `<div class="ta-states__row"><p class="ta-states__name">${name}</p>${cells.map((c) => `<div class="ta-states__cell">${c}</div>`).join('')}</div>`;
const actionStates = [
    row('Default', B.default, A.default),
    row('Hover (drawn by a class)', B.hover, A.hover),
    row('Keyboard focus (drawn by a class)', B.focus, A.focus),
    row('Pressed (drawn by a class)', B.pressed, A.pressed),
    row('Disabled', B.disabled, A.disabled),
    row('Busy (<code>aria-busy</code>)', B.busy, A.busy),
    row('Destructive', B.destructive, A.destructive),
    row('Destructive, hover', B.destructiveHover, A.destructiveHover),
    row('Destructive, disabled', B.destructiveDisabled, A.destructiveDisabled),
].join('\n');

// ------------------------------------------------------------------ status rows
/** @param {{id:string,label:string,state:string,detail?:string}} r */
const srow = (r, retry = true) =>
    `<li class="kp-statusrow" data-state="${r.state}" data-kp-status-id="${r.id}"><span class="kp-statusrow__mark" aria-hidden="true"></span><span class="kp-statusrow__body"><span class="kp-statusrow__label">${esc(r.label)}</span><span class="kp-statusrow__detail">${esc(r.detail ?? '')}</span></span></li>`;
const slist = (rows, { cls = '', label = 'Backups per stack', attrs = '' } = {}) =>
    `<ul class="kp-statuslist${cls ? ` ${cls}` : ''}" aria-label="${label}"${attrs ? ` ${attrs}` : ''}>${rows.map((r) => srow(r)).join('')}</ul>`;

const STACKS = [
    'jellyfin',
    'vaultwarden',
    'traefik',
    'grafana',
    'kyu-hub',
    'almanac',
    'newsflash',
    'jobtracker',
    'loki',
    'prometheus',
    'uptime-kuma',
    'homepage',
];
const staticRows = [
    { id: 'a', label: 'jellyfin', state: 'ok', detail: 'read' },
    { id: 'b', label: 'vaultwarden', state: 'loading', detail: 'reading (12 s)' },
    { id: 'c', label: 'traefik', state: 'failed', detail: 'timed out after 20 s' },
    { id: 'd', label: 'grafana', state: 'empty', detail: 'no backups by design' },
];

// ------------------------------------------------------------------ facets
const fcount = (n) => `<span class="kp-facet__count">${n}</span>`;
/** @param {{value:string,label:string,count?:number|string,on?:boolean,swatch?:string,disabled?:boolean,cls?:string}} f */
const facet = (f) =>
    `<li class="kp-facet${f.cls ? ` ${f.cls}` : ''}" data-value="${f.value}"><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check"${f.on === false ? '' : ' checked'}${f.disabled ? ' disabled' : ''} />${
        f.swatch ? `<span class="kp-facet__swatch ta-sw-${f.swatch}" aria-hidden="true"></span>` : ''
    }<span class="kp-facet__name">${esc(f.label)}</span>${fcount(f.count ?? '')}</label><button type="button" class="kp-button kp-button--ghost kp-button--sm kp-facet__only" aria-label="Show only ${esc(f.label)}">only</button></li>`;
const allRow = (label, count, state = 'on') =>
    `<li class="kp-facet" data-kp-facet-all><label class="kp-facet__option"><input type="checkbox" class="kp-field__check kp-facet__check"${state === 'on' ? ' checked' : ''}${state === 'mixed' ? ' data-ta-mixed' : ''} /><span class="kp-facet__name">${label}</span>${fcount(count)}</label></li>`;
const flist = (title, items, { cls = '', busy = false, empty = false, all = null } = {}) =>
    `<div class="kp-facets${cls ? ` ${cls}` : ''}" role="group" aria-label="${title}"${busy ? ' aria-busy="true"' : ''}><ul class="kp-facets__list">${all ?? ''}${items.map(facet).join('')}</ul>${
        empty ? `<p class="kp-facets__empty">No sources yet. They appear here as lines arrive.</p>` : ''
    }</div>`;

const SOURCES = [
    { value: 'HOST', label: 'Host', count: 214, swatch: 'a' },
    { value: 'jellyfin', label: 'jellyfin', count: 96, swatch: 'b' },
    { value: 'vaultwarden', label: 'vaultwarden', count: 41, swatch: 'c' },
    { value: 'traefik', label: 'traefik', count: 1280, swatch: 'd' },
];
const facetStates = [
    row('Default', flist('Source', SOURCES.slice(0, 3), { all: allRow('Everything', 351) })),
    row(
        'Hover (drawn by a class)',
        flist(
            'Source',
            SOURCES.slice(0, 3).map((f, i) => (i === 1 ? { ...f, cls: 'ta-is-hover' } : f)),
        ),
    ),
    row(
        'Focus in the row (drawn by a class)',
        flist(
            'Source',
            SOURCES.slice(0, 3).map((f, i) => (i === 1 ? { ...f, cls: 'ta-is-within' } : f)),
        ),
    ),
    row(
        'Some off; Everything is mixed',
        flist(
            'Source',
            SOURCES.slice(0, 3).map((f, i) => ({ ...f, on: i === 0 })),
            { all: allRow('Everything', 351, 'mixed') },
        ),
    ),
    row(
        'One row disabled',
        flist(
            'Source',
            SOURCES.slice(0, 3).map((f, i) => ({ ...f, disabled: i === 2 })),
        ),
    ),
    row(
        'A long name, and a count of five figures',
        flist('Source', [{ value: 'x', label: 'vaultwarden-backup-nightly-eu-west-2-replica', count: 12840, swatch: 'a' }, SOURCES[1]], {
            cls: 'ta-narrow',
        }),
    ),
    row(
        'The counts are on their way',
        flist(
            'Source',
            SOURCES.slice(0, 3).map((f) => ({ ...f, count: '00' })),
            { busy: true },
        ),
    ),
    row('No rows yet', flist('Source', [], { empty: true })),
].join('\n');

export const sections = `
            <section class="ta-sec" data-review-item="actions" data-review-components="actions action" data-review-title="1 · Action tiles" aria-label="Action tiles">
                <div class="ta-sec__head">
                    <h2>1 · Action tiles</h2>
                    <p>
                        A button or a link drawn as a tile: a title and the one sentence that says what it does, in a grid whose tiles on one row are all as
                        tall as the tallest. Use it where a short list of things to do (or places to go) needs a sentence each, on a landing page or in a
                        drawer. A <b>button</b> tile does something; a <b>link</b> tile goes somewhere (and shows a chevron).
                    </p>
                </div>
                ${look(ACT)}
                ${expected(`
                    <li><b>The grid:</b> the first row has a tile with one short line and tiles with three lines, and all of them are the same height. The grid fills the width with columns of at least 15rem and goes to one column when narrow; resize the window.</li>
                    <li><b>Press the button tiles in the live grid</b> (Back up now, Restart the dashboard, Delete all snapshots): the tile becomes busy at once, the theme’s own spinner appears in the right-hand corner and the readout under the grid says what happened. The tile keeps its size (the title does not rewrap), the keyboard focus stays on it, and pressing it again does nothing until it is done (about 2.5 s). Link tiles only move the readout; they do not leave the page.</li>
                    <li><b>The disabled tile</b> (Check for updates) does nothing and shows no hover. <b>The tile with a spinner already in it</b> (Rebuild the search index) is busy from the start and does not answer a press.</li>
                    <li><b>Keyboard:</b> Tab goes tile by tile (one stop each); Enter or Space presses a button tile, Enter a link tile; the focus ring is the theme’s own and whole in every theme.</li>
                    <li><b>The table below</b> shows every state side by side, button beside link. Hover, focus and pressed are drawn by classes there; point at the live tiles above to see the real thing.</li>
                `)}
                <div class="ta-block">
                    <h3>The live grid</h3>
                    <p class="ta-caption">Mock: the readout and the 2.5 s of “work”. Everything else is the package. The grid is <code>.kp-actions</code>; each tile a <code>.kp-action</code> with a <code>__title</code>, a <code>__mark</code> and a <code>__text</code>.</p>
                    <div class="ta-card">
                        ${liveGrid()}
                        <p class="ta-readout" data-ta-readout="actions" aria-live="polite">Nothing pressed yet.</p>
                    </div>
                </div>
                <div class="ta-block">
                    <h3>Every state</h3>
                    <p class="ta-caption">Mock: “hover”, “focus” and “pressed” are drawn by classes that copy the theme’s own rules; disabled and busy are the real attributes.</p>
                    <div class="ta-states">
                        <div class="ta-states__row ta-states__row--head"><p></p><p>Button tile</p><p>Link tile</p></div>
${actionStates}
                    </div>
                </div>
                <div class="ta-block">
                    <h3>In a narrow column</h3>
                    <p class="ta-caption">A 20rem drawer: one column, the same tiles. The titles may wrap; the tiles do not change height when a spinner arrives.</p>
                    <div class="ta-card ta-card--narrow">${liveGrid(' ta-narrow-grid')}</div>
                </div>
            </section>

            <section class="ta-sec" data-review-item="status" data-review-components="statuslist statusrow" data-review-title="2 · Status rows" aria-label="Status rows">
                <div class="ta-sec__head">
                    <h2>2 · Status rows</h2>
                    <p>
                        One row per item that is read or checked one by one: a mark, the item’s name, a short detail and, when it failed, a Retry that tries
                        <b>that one</b> item again. The four states are each a shape and a word as well as a colour: a disc with a tick (ok), the theme’s
                        spinner (loading), a disc with a cross (failed, with its reason and a Retry), a dashed ring (empty, with the reason there is nothing).
                    </p>
                </div>
                ${look(STA)}
                ${expected(`
                    <li><b>Press “Read all twelve”</b>: every row goes to loading (the spinner, “reading (n s)” with the seconds counting), then the rows settle one by one: most become ok, two fail with a reason and a Retry button, one is empty with its reason. A screen reader hears one summary (for example “12 updated, 2 failed”), not twelve sentences.</li>
                    <li><b>The list does not move while this happens.</b> The “height of the list” readout under it shows the same number before, during and after (in the second list, whose rows reserve room for a two-line reason). In the first, compact list a row grows by one line only when its reason is longer than one line.</li>
                    <li><b>Press Retry on a failed row</b>: that row alone goes back to loading and, after about 1.5 s, becomes ok (the second Retry of “traefik” fails again, on purpose, to show a failing retry). The keyboard focus is not lost: after pressing Retry with the keyboard the focus moves to the row’s name.</li>
                    <li><b>The four fixed rows below</b> are the states side by side, and the lists under them show a single column and a very long reason (it wraps; nothing is cut).</li>
                `)}
                <div class="ta-block">
                    <h3>Live: reading twelve stacks, with Retry</h3>
                    <p class="ta-caption">Mock: the reads and their results. The rows, marks, announcements and Retry are the package (<code>buildStatusList</code>, <code>setStatus</code>, the <code>kp-status-retry</code> event).</p>
                    <div class="ta-actions">
                        <button type="button" class="kp-button kp-button--primary kp-button--sm" data-ta-read>Read all twelve</button>
                        <button type="button" class="kp-button kp-button--sm" data-ta-read-reset>Back to the start</button>
                    </div>
                    <div class="ta-card" data-ta-status-live></div>
                    <p class="ta-readout" data-ta-readout="status-height">Height of the list: not measured yet.</p>
                </div>
                <div class="ta-block">
                    <h3>The same, with room reserved for a two-line reason</h3>
                    <p class="ta-caption"><code>--kp-statusrow-detail-lines: 2</code> keeps two lines under every name, so a long reason arriving moves nothing. Use it where failures are expected.</p>
                    <div class="ta-actions"><button type="button" class="kp-button kp-button--primary kp-button--sm" data-ta-read-reserved>Read all twelve</button></div>
                    <div class="ta-card ta-reserve" data-ta-status-reserved></div>
                    <p class="ta-readout" data-ta-readout="status-height-reserved">Height of the list: not measured yet.</p>
                </div>
                <div class="ta-block">
                    <h3>The four states</h3>
                    <div class="ta-card">${slist(staticRows, { label: 'The four states' })}</div>
                </div>
                <div class="ta-block">
                    <h3>One column, and a very long reason</h3>
                    <div class="ta-stack ta-stack--two">
                        <div class="ta-card">${slist(staticRows, { cls: 'kp-statuslist--rows', label: 'One column' })}</div>
                        <div class="ta-card ta-card--narrow">${slist(
                            [
                                {
                                    id: 'l1',
                                    label: 'prometheus-remote-write-eu-west-2',
                                    state: 'failed',
                                    detail: 'The host answered 503 after 20 s: the volume is mounted read-only since the last power cut',
                                },
                                { id: 'l2', label: 'loki', state: 'empty', detail: 'This stack keeps no backups by design' },
                            ],
                            { cls: 'kp-statuslist--rows', label: 'A very long reason' },
                        )}</div>
                    </div>
                </div>
            </section>

            <section class="ta-sec" data-review-item="facets" data-review-components="facets facet" data-review-title="3 · Facet list" aria-label="Facet list">
                <div class="ta-sec__head">
                    <h2>3 · Facet list</h2>
                    <p>
                        Checkbox rows that narrow a list by one property, each with how many items it would show, and an <b>only</b> button that selects
                        just that row. “Everything” turns every row on. The checkboxes are the theme’s own; <b>only</b> is the theme’s ghost button, a sibling
                        of the label (never inside it), shown when the pointer is on the row or focus is in it, and always on a touch screen.
                    </p>
                </div>
                ${look(FAC)}
                ${expected(`
                    <li><b>Click a checkbox or its name</b> in the live log below: that source’s lines appear or disappear, the “Showing x of y lines” readout follows, and the Everything checkbox becomes mixed (a dash) while only some rows are on.</li>
                    <li><b>Point at a row</b> (or Tab into it): the <b>only</b> button appears at the row’s end without moving the count. Press it: that row stays on, every other turns off, and the readout says “Showing only …”. Press Everything: all rows are on again.</li>
                    <li><b>Keyboard:</b> Tab reaches each checkbox (Space turns it); when a row has focus its <b>only</b> button is the next stop (Enter presses it). After pressing it the focus stays where it was.</li>
                    <li><b>“A new source appears”</b> adds a row in its place without touching the others: if you hold the keyboard focus on a checkbox while it is added, the focus stays. <b>“Counts are loading”</b> replaces the counts with quiet bars that keep their place, and “Counts arrive” writes them back. <b>Reset the filters</b> turns everything on.</li>
                    <li><b>The row of facets</b> (last block) is the phone form: one line of bordered rows that scrolls sideways.</li>
                `)}
                <div class="ta-block">
                    <h3>Live: the host log, two facet groups</h3>
                    <p class="ta-caption">Mock: the log lines and their filtering (the page reads the facets and writes the counts back). The rows, the Everything state, “only”, in-place insertion and announcements are the package (<code>setFacetItems</code>, <code>setFacetCounts</code>, <code>kp-facet-change</code>).</p>
                    <div class="ta-actions" data-review-controls role="group" aria-label="The log demo">
                        <button type="button" class="kp-button kp-button--sm" data-ta-add-source>A new source appears</button>
                        <button type="button" class="kp-button kp-button--sm" data-ta-counts-wait>Counts are loading</button>
                        <button type="button" class="kp-button kp-button--sm" data-ta-counts-arrive>Counts arrive</button>
                        <button type="button" class="kp-button kp-button--ghost kp-button--sm" data-ta-facet-reset>Reset the filters</button>
                    </div>
                    <div class="ta-log">
                        <div class="ta-log__side">
                            <h4 class="kp-facets__title" id="ta-h-source">Source</h4>
                            <div class="kp-facets" data-kp-facets data-kp-facets-all="Everything" role="group" aria-labelledby="ta-h-source" data-ta-facets="source"><ul class="kp-facets__list"></ul><p class="kp-facets__empty" hidden>No sources yet.</p></div>
                            <h4 class="kp-facets__title" id="ta-h-level">Level</h4>
                            <div class="kp-facets" data-kp-facets role="group" aria-labelledby="ta-h-level" data-ta-facets="level"><ul class="kp-facets__list"></ul></div>
                        </div>
                        <div class="ta-log__main">
                            <p class="ta-readout" data-ta-readout="log" aria-live="polite">Showing all lines.</p>
                            <ol class="ta-log__lines" data-ta-lines></ol>
                        </div>
                    </div>
                </div>
                <div class="ta-block">
                    <h3>Every state</h3>
                    <p class="ta-caption">Mock: “hover” and “focus in the row” are drawn by classes that copy the package’s rules.</p>
                    <div class="ta-states ta-states--one">
${facetStates}
                    </div>
                </div>
                <div class="ta-block">
                    <h3>The row of facets (phone)</h3>
                    <p class="ta-caption"><code>kp-facets--row</code>: the rows side by side, scrolling sideways. Here in a 20rem column.</p>
                    <div class="ta-card ta-card--narrow">${flist(
                        'Level',
                        [
                            { value: 'e', label: 'Errors', count: 12, swatch: 'a' },
                            { value: 'w', label: 'Warnings', count: 40, swatch: 'b' },
                            { value: 'i', label: 'Info', count: 880, swatch: 'c' },
                            { value: 'd', label: 'Debug', count: 2310, swatch: 'd' },
                        ],
                        { cls: 'kp-facets--row', all: allRow('Everything', 3242) },
                    )}</div>
                </div>
            </section>
`;
