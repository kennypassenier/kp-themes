// What makes dark dark (Kenny, 2026-10-08, after the anchor round: "The line
// lays the film down, turning"). Dark is a spectral instrument, and what it
// does is PASS A LINE: a spectral line of film light sweeps a part from its
// start at an even pace and lays the oxide film along its edge behind it,
// turning; when the line reaches the end the figure takes the film through
// its letters and the turn settles, cyan at the top; the leave is the pass
// back. The questions below turn that anchor into rules for every other
// component (themes/dark/CHARACTER.md, G1-G21).
//
// A review-kit demo in aspect mode, dark only. The questions are data in
// aspects.js (the designer's text, used verbatim); this file adds each
// question's scene (a small dashboard of the package's own components in
// dark), builds the rows and the review kit's choices from that data, and
// runs the page's one clock. Each OPTION is a live scene with one attribute on
// its wrapper (`data-dk-<question>="<key>"`) that options.css reads. The first
// option is the recommendation. The network graph is in no scene: it changes in
// no theme (Kenny, 2026-10-07 02:54).

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';

/* ----------------------------------------------------------- the parts */

/** The package's bracketed button: its label and the film's edge along its foot. @param {string} label */
const button = (label, modifier = '', extra = '', tag = 'button') =>
    `<${tag} ${tag === 'button' ? 'type="button" ' : ''}class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span><span class="kp-button__edge" aria-hidden="true"></span><span class="dk-tapline" aria-hidden="true"></span></${tag}>`;

/**
 * A part the line lays: the part (the body, clipped to what the line has
 * passed) and the line itself, a 2 px slice of the film that crosses it.
 * `axis` is where the line enters: from the start edge (x), or from the edge
 * the part hangs from (down). `i` is the part's place in a group.
 */
const lay = (/** @type {string} */ html, cls = '', i = -1) =>
    `<div class="dk-lay ${cls}"${i >= 0 ? ` style="--i: ${i}"` : ''}><div class="dk-lay__body">${html}</div><span class="dk-lay__line" aria-hidden="true"></span></div>`;

/** The package's bar: a track, the fill, the `]` at its head; and the line, which stands at the head (and runs the track while busy). */
const barInner =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span><span class="dk-bar__line" aria-hidden="true"></span>';
/** The bar while no share is known. @param {string} label @param {string} size */
const busyBar = (label = 'Export busy', size = '') =>
    `<div class="kp-progressbar dk-bar ${size}" role="progressbar" aria-label="${label}" data-kp-indeterminate>${barInner}</div>`;
/** The bar with a share known. @param {number} value @param {string} size */
const shareBar = (value = 0.62, size = '') =>
    `<div class="kp-progressbar dk-bar dk-bar--share ${size}" role="progressbar" aria-label="Export, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}">${barInner}</div>`;

/** What a waiting part wears: the slot the line sweeps and the film it lays behind it (the picks' ticker and the register's ghosts draw their own). */
const WAIT = '<span class="dk-wait" aria-hidden="true"><span class="dk-wait__line"></span><span class="dk-wait__ticker"></span></span>';

/** The change on a key figure: the tone's plate and ink. */
const note = (/** @type {string} */ text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta dk-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter dk-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** The trend's line: the muted slot it is drawn in, and the film it is lit with (the line lights it). The data are two readings: before (a) and after (b). */
const trendSlot = (kind = 'b') => `<span class="dk-trend dk-trend--${kind}" aria-hidden="true"><i class="dk-trend__slot"></i></span>`;
const trendLit = (kind = 'b') => `<span class="dk-trend dk-trend--${kind}" aria-hidden="true"><i class="dk-trend__lit"></i></span>`;
/** The trend as it stands: slot and film one over the other. */
const trend = (kind = 'b') =>
    `<span class="dk-trend dk-trend--${kind}" aria-hidden="true"><i class="dk-trend__slot"></i><i class="dk-trend__lit"></i></span>`;
/** The trend lit along its length by the line that runs it (the slot stands, the film is laid). */
const trendRun = (kind = 'b') => `<div class="dk-trendbox dk-trendrun">${trendSlot(kind)}${lay(trendLit(kind), 'dk-lay--trend dk-lay--over')}</div>`;

/**
 * A value that changes: the old reading and the new one over each other. The
 * line crosses it once: behind the line the new reading is laid (and takes the
 * film through its letters), ahead of it the old one stands. The finished
 * pose is the new reading. `cls` styles the pair (a figure, a word).
 */
const liveVal = (/** @type {string} */ a, /** @type {string} */ b, cls = '') =>
    `<span class="dk-lay dk-lay--live ${cls}"><span class="dk-lay__body"><span class="dk-ink">${b}</span></span><span class="dk-live__old" aria-hidden="true">${a}</span><span class="dk-lay__line" aria-hidden="true"></span></span>`;

const PART = {
    dialog: () => `<div class="kp-dialog dk-dialog" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menuItems: (items = ['Open incident', 'Assign to…', 'Delete'], pointed = -1) =>
        items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${t === 'Delete' ? ' kp-menu__item--destructive dk-bad' : ''}${
                        i === pointed ? ' dk-pointed' : ''
                    }">${t}</button></li>`,
            )
            .join(''),
    /** A menu open under its button: the popover is what the line lays. */
    menu: () => `<div class="dk-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${lay(`<div class="kp-popover dk-pop"><ul class="kp-menu" role="menu">${PART.menuItems()}</ul></div>`, 'dk-lay--down dk-lay--pop')}
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => `<div class="kp-card dk-tile">
        <p class="kp-card__title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412', foot = note('6 %'), tone = '', cls = '') =>
        `<div class="kp-kpi dk-kpi ${cls}"${tone ? ` data-kp-tone="${tone}"` : ''}>
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value"><span class="dk-ink">${value}</span></span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    /** Two slots with a line each: this option's curve, and an even pace with no turn. */
    slots: () => `<div class="dk-slots" aria-hidden="true">
        <div class="dk-slot"><span class="dk-slot__name">this curve</span>${lay('<span class="dk-slot__track"><span class="dk-slot__fill"></span></span>', 'dk-lay--slot dk-lay--own')}</div>
        <div class="dk-slot"><span class="dk-slot__name">an even pace</span>${lay('<span class="dk-slot__track"><span class="dk-slot__fill"></span></span>', 'dk-lay--slot dk-lay--even')}</div>
    </div>`,
    /** A week of days crossed by one line (the group's line), each lit as the line reaches it. */
    days: (n = 7, from = 12) =>
        `<div class="dk-lay dk-lay--group dk-group--${n}"><div class="dk-lay__body"><div class="dk-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="dk-day dk-member" style="--i: ${i}"><span class="dk-ink">${from + i}</span></span>`)
            .join('')}</div></div><span class="dk-lay__line" aria-hidden="true"></span></div>`,
    state: (word = 'Running') => `<span class="dk-state"><span class="dk-state__word">${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.', kind = '') =>
        `<div class="kp-alert ${kind} dk-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    toast: (text = 'Export finished.') =>
        `<div class="kp-toast dk-toast" role="status"><span class="kp-toast__body">${text}</span>${button('Undo', 'kp-button--sm kp-button--ghost')}</div>`,
    tooltip: () =>
        `<span class="dk-tipwrap"><span class="dk-tipwrap__point" aria-hidden="true"></span><span class="kp-tooltip dk-tip" role="tooltip">14:00 · 412 m³/h</span></span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="kp-kpi dk-kpi dk-column"><span class="kp-kpi__label">${label}</span><span class="kp-kpi__value"><span class="dk-ink">${value}</span></span></div>`,
    skeleton: () =>
        `<div class="dk-skel dk-waits" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>${WAIT}</div>`,
    field: () =>
        `<label class="kp-field dk-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover dk-pop dk-pop--static ${cls}"><ul class="kp-menu" role="menu">${PART.menuItems(items, pointed ? 0 : -1)}</ul></div>`,
};
const caption = (/** @type {string} */ text) => `<p class="dk-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="dk-part ${cls}">${caption(cap)}${html}</div>`;
/** A day of a month, outside any group (it stands where it is). */
const day = (/** @type {number} */ d, cls = '') => `<span class="dk-day ${cls}"><span class="dk-ink">${d}</span></span>`;

/* ------------------------------------------------------------ the scenes */

const MOVING = () =>
    cell('A line crosses a slot, beside one at an even pace', PART.slots(), 'dk-part--wide') +
    cell('A dialog, in place', lay(PART.dialog())) +
    cell('A menu, under its button', PART.menu()) +
    cell('A tile, in place', lay(PART.tile()));

const DIRECTION = () =>
    cell('A week of days, crossed by one line', PART.days(7), 'dk-part--wide') +
    cell('A tile', lay(PART.tile())) +
    cell('A key figure', lay(`<div class="kp-kpis">${PART.kpi()}</div>`)) +
    cell('The trend line', trendRun('b'), 'dk-part--wide');

const OPENING = () =>
    cell('A menu opens from its button', PART.menu()) +
    cell('A dialog opens', lay(PART.dialog())) +
    cell('A toast appears', lay(PART.toast(), 'dk-lay--toast')) +
    cell('A tooltip appears', lay(PART.tooltip(), 'dk-lay--tip'));

const DURATION = () =>
    cell('Contact: a press', `<div class="dk-row">${button('Export readings', 'dk-tap')}</div><p class="dk-readout" data-dk-readout="contact"></p>`) +
    cell('A pass: a dialog is laid', lay(PART.dialog()) + '<p class="dk-readout" data-dk-readout="pass"></p>') +
    cell('A group: five days', PART.days(5, 12) + '<p class="dk-readout" data-dk-readout="group"></p>') +
    cell('A loop: the busy bar', busyBar('Loading') + '<p class="dk-readout" data-dk-readout="loop"></p>');

const COLOUR = () =>
    cell('A panel', PART.tile('Pump house 4', 'North network · 4.2 bar').replace('kp-card dk-tile', 'kp-card dk-tile dk-colour-panel')) +
    cell('What acts', `<div class="dk-row">${button('Export')}${button('Add a pump house', 'kp-button--primary')}</div>`) +
    cell(
        'A key figure, a meter and a switch',
        `<div class="dk-colour-stack"><div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %'), '', 'dk-scope')}</div>${meter(0.62, 0.8)}<label class="kp-switch dk-switch" aria-label="Live"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></label></div>`,
    ) +
    cell(
        'A status word',
        `<div class="dk-row">${PART.state('Running')}${PART.state('Draining').replace('dk-state', 'dk-state dk-state--warn')}</div>`,
    ) +
    cell('A failed export', PART.alert('Export failed: the vendor did not answer.', 'kp-alert--destructive dk-failed'), 'dk-part--wide');

const CORNERS = () =>
    cell('Panel', PART.tile('Reservoir North', 'Level 71 %').replace('kp-card dk-tile', 'kp-card dk-tile dk-corner-panel')) +
    cell('Menu', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="dk-row">${button('Export')}<span class="kp-badge dk-tag">12 new</span><span class="kp-tag dk-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip dk-tip dk-tip--static" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell('Bar head', shareBar(0.62));

const SURFACE = () =>
    cell(
        'A dialog with its title',
        `<div class="kp-dialog dk-dialog dk-surface-dialog"><p class="kp-dialog__title">Pump house 4</p><p class="kp-dialog__description">Flow 412 m³/h, steady since 06:40.</p></div>`,
    ) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell(
        'A trend tile',
        `<div class="kp-card dk-tile dk-trendtile"><p class="kp-card__title">Flow, 24 h</p><div class="dk-trendbox">${trend('b')}</div></div>`,
    ) +
    cell(
        'A menu with headings',
        `<div class="kp-popover dk-pop dk-pop--static"><ul class="kp-menu" role="menu"><li role="none"><span class="dk-menu-head">Incident</span></li>${PART.menuItems(
            ['Open incident', 'Assign to…'],
        ).replace(
            /<\/li>$/,
            '</li>',
        )}<li role="none"><span class="dk-menu-head">Danger</span></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li></ul></div>`,
    ) +
    cell('A state word', `<div class="dk-row">${PART.state('Running')}</div>`);

const WARNING = () =>
    cell(
        'A key figure that needs attention',
        `<div class="kp-kpis">${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad'), 'warning', 'dk-warn')}</div>`,
    ) +
    cell(
        'A failed trend tile',
        `<div class="kp-card dk-tile dk-failed"><p class="kp-card__title">Pump house 3</p><div class="dk-trendbox">${trend('b')}</div><p class="kp-card__body">No reading since 06:40 ${note('2 h', 'down', 'bad')}</p></div>`,
    ) +
    cell(
        'A destructive menu entry',
        `<div class="kp-popover dk-pop dk-pop--static"><ul class="kp-menu" role="menu">${PART.menuItems(['Open incident', 'Delete'])}</ul></div>`,
    ) +
    cell(
        'A warning alert',
        PART.alert('<strong class="kp-alert__label">Warning</strong> Pressure is low at pump house 3.', 'kp-alert--warning dk-warning'),
    );

const LIVE = () =>
    cell(
        'Key figure number',
        `<div class="kp-kpis"><div class="kp-kpi dk-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">${liveVal('412', '436', 'dk-live-figure')}</span><span class="kp-kpi__trend">${note('6 %')} on yesterday</span></div></div>`,
    ) +
    cell('State word', `<span class="dk-state">${liveVal('Running', 'Draining', 'dk-live-word')}</span>`) +
    cell(
        'Trend line',
        `<div class="dk-trendbox dk-trendrun dk-trendlive">${lay(trendLit('a'), 'dk-lay--trend dk-lay--over dk-lay--comp')}${lay(trendLit('b'), 'dk-lay--trend dk-lay--over')}</div>`,
    ) +
    cell(
        'Strip column number',
        `<div class="kp-kpi dk-kpi dk-column"><span class="kp-kpi__label">Open</span><span class="kp-kpi__value">${liveVal('38', '43', 'dk-live-figure')}</span></div>`,
    ) +
    cell(
        'Dashboard tile',
        `${lay(`<div class="kp-card dk-tile dk-live-tile"><p class="kp-card__title">Pump house 2</p><p class="kp-card__body">${liveVal('4.2 bar', '4.4 bar', 'dk-live-figure')}</p></div>`, 'dk-lay--edge')}`,
    );

const LOADING = () =>
    cell(
        'Tile',
        `<div class="kp-card dk-tile dk-waits" aria-busy="true"><p class="kp-card__title">Pump house 2</p><p class="kp-card__body">Reading…</p>${WAIT}</div>`,
    ) +
    cell(
        'Panel',
        `<div class="kp-kpis"><div class="kp-kpi dk-kpi dk-waits" aria-busy="true"><span class="kp-kpi__label">Readings today</span><span class="kp-kpi__value">18 240</span><span class="kp-kpi__trend">on yesterday</span>${WAIT}</div></div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover dk-pop dk-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dk-waits" aria-busy="true"><span class="dk-w">Loading stations…</span>${WAIT}</button></li></ul></div>`,
    ) +
    cell(
        'A month of days',
        `<div class="dk-days dk-days--month">${[1, 2, 3, 4, 5, 6, 7].map((d) => `<span class="dk-day dk-waits" style="--i: ${d - 1}"><span class="dk-w">${d}</span>${WAIT}</span>`).join('')}</div>`,
    ) +
    cell('A chart’s plot', `<div class="dk-plot dk-waits" aria-busy="true"><span class="dk-plot__trend">${trend('b')}</span>${WAIT}</div>`) +
    cell('Skeleton lines', PART.skeleton());

const BUSYBAR = () =>
    cell(
        'Three sizes, busy: no share known yet',
        `<div class="dk-sizes">${busyBar('Small', '')}${busyBar('Medium', 'kp-progressbar--md')}${busyBar('Large', 'kp-progressbar--lg')}</div>`,
        'dk-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button dk-busy-button" aria-busy="true"><span class="kp-button__label">Exporting${busyBar('Exporting', 'dk-bar--inline')}</span><span class="kp-button__edge" aria-hidden="true"></span></button>`,
    ) +
    cell('Beside it, the same in every option: the bar with a share (62 %)', shareBar(0.62));

const spin = (size = '') =>
    `<span class="kp-spinner dk-spin" role="status" aria-label="Working…"${size ? ` style="--kp-spinner-size: ${size}"` : ''}></span>`;

const SPINNER = () =>
    cell('Three sizes', `<div class="dk-row dk-spins">${spin('1.25rem')}${spin('2rem')}${spin('3.5rem')}</div>`, 'dk-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button dk-busy-button" aria-busy="true"><span class="kp-button__label">${spin()}Saving…</span><span class="kp-button__edge" aria-hidden="true"></span></button>`,
    ) +
    cell('The busy panel', `<div class="kp-card dk-tile dk-busy-panel">${spin('2.5rem')}<p class="kp-card__body">Reading the pump houses…</p></div>`);

const LEAVE = () =>
    cell('An alert', lay(PART.alert(), 'dk-lay--leaver')) +
    cell('A card', lay(PART.tile('Reservoir North', 'Level 71 %'), 'dk-lay--leaver')) +
    cell('A key figure', lay(`<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %'))}</div>`, 'dk-lay--leaver'));

const COMPOSITES = () =>
    cell(
        'Alone: the theme’s own button, for reference',
        `<div class="dk-row">${button('Export readings', 'dk-alone')}${button('Add', 'kp-button--primary dk-alone')}</div>`,
        'dk-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header dk-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions dk-actions-card">${button('Export', 'kp-button--sm dk-in-header')}${button('Add', 'kp-button--sm kp-button--primary dk-in-header')}</div></div></header>`,
        'dk-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'dk-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card dk-tile dk-in-tile"><p class="kp-card__title">Pump house 1</p>${button('Open', 'kp-button--ghost kp-button--sm dk-tile-link', 'href="#dk-intro"', 'a')}</div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card dk-tile dk-drawer"><p class="kp-card__title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="dk-row dk-actions-card">${button(
            'Skip',
            'kp-button--sm kp-button--ghost dk-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary dk-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi dk-kpi dk-in-kpi" href="#dk-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="dk-row">${button('Export readings', 'dk-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card dk-tile dk-in-tile"><p class="kp-card__title">Pump house 1</p>${button('Open', 'kp-button--ghost kp-button--sm dk-tile-link dk-pointed', 'href="#dk-intro"', 'a')}</div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis dk-kpi-row"><a class="kp-kpi dk-kpi dk-in-kpi dk-pointed" href="#dk-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi dk-kpi dk-in-kpi" href="#dk-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="dk-days">${[12, 13, 14, 15].map((d) => day(d, d === 13 ? 'dk-pointed' : '')).join('')}</div>`,
    ) +
    cell(
        'A link in running text, pointed at',
        `<p class="dk-prose">Read the <a class="dk-link dk-pointed" href="#dk-intro">pump house log</a> before the crew leaves.</p>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="dk-row">${button('Export readings', 'dk-focused')}</div>`) +
    cell('Header action', `<div class="dk-header-mini">${button('Export', 'kp-button--sm dk-in-header dk-focused')}</div>`) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi dk-kpi dk-in-kpi dk-focused" href="#dk-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover dk-pop dk-pop--static dk-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dk-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="dk-days">${day(13)}${day(14, 'dk-focused')}${day(15)}</div>`) +
    cell(
        'Tile link',
        `<div class="kp-card dk-tile dk-in-tile"><p class="kp-card__title">Pump house 1</p>${button('Open', 'kp-button--ghost kp-button--sm dk-tile-link dk-focused', 'href="#dk-intro"', 'a')}</div>`,
    );

/** A control at rest beside the same control pressed (the pressed one is looped by options.css). */
const pair = (/** @type {string} */ rest, /** @type {string} */ pressed) =>
    `<div class="dk-pair"><span class="dk-pair__rest">${rest}</span><span class="dk-pair__pressed">${pressed}</span></div>`;
const PRESS = () =>
    cell('Button, at rest and pressed', pair(button('Export'), button('Export', 'dk-press'))) +
    cell('Primary button', pair(button('Add', 'kp-button--primary'), button('Add', 'kp-button--primary dk-press'))) +
    cell(
        'Menu entry',
        `<div class="kp-popover dk-pop dk-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item dk-press">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', pair(day(14), day(14, 'dk-press'))) +
    cell(
        'Key figure as a filter',
        `<div class="dk-pair dk-pair--wide"><button type="button" class="kp-kpi kp-kpi--toggle dk-kpi" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button><button type="button" class="kp-kpi kp-kpi--toggle dk-kpi dk-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
        'dk-part--wide',
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card dk-type"><p class="dk-type__label">Northern network</p><p class="dk-type__head">Pump house 4</p>
        <p class="dk-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="dk-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <p class="dk-type__reading"><span class="dk-bracket">[</span> FLOW 412 m³/h <span class="dk-bracket">]</span></p>
        <p class="dk-type__row"><span class="kp-timestamp dk-stamp">2026-10-08 07:12</span><span class="kp-id dk-ident">INC-4471</span></p>
        <p class="dk-row">${button('Open the log', 'kp-button--sm')} <span class="kp-badge dk-tag">12 new</span></p></div>`,
        'dk-part--wide',
    );

const MOTIFS = () =>
    cell(
        'A panel with its title',
        PART.tile('Pump house 4', 'North network · 4.2 bar').replace('kp-card dk-tile', 'kp-card dk-tile dk-motif-panel'),
    ) +
    cell('A meter with its mark', meter(0.62, 0.8) + `<div class="dk-gap"></div>` + meter(1, 0.8, 'data-kp-over')) +
    cell(
        'A chart’s events',
        `<div class="dk-plot dk-plot--events" aria-hidden="true"><span class="dk-plot__trend">${trend('b')}</span><i class="dk-event" style="--i: 0"></i><i class="dk-event" style="--i: 1"></i><i class="dk-event" style="--i: 2"></i></div>`,
    ) +
    cell(
        'A button and a list',
        `<div class="dk-row">${button('Add', 'kp-button--primary')}</div><ul class="dk-list"><li>Pump house 1</li><li>Pump house 2</li><li>Pump house 3</li></ul>`,
    ) +
    cell(
        'An empty state',
        `<div class="kp-empty dk-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell(
        'A divider between two sections',
        `<p class="dk-cap dk-cap--inner">Pumps</p><div class="dk-seam" data-kp-divider role="separator"></div><p class="dk-cap dk-cap--inner">Reservoirs</p>`,
    );

/** Each question's scene, by the `scene` key aspects.js names. */
const SCENES = /** @type {Record<string, () => string>} */ ({
    moving: MOVING,
    direction: DIRECTION,
    opening: OPENING,
    durations: DURATION,
    colour: COLOUR,
    corners: CORNERS,
    surface: SURFACE,
    warning: WARNING,
    live: LIVE,
    loading: LOADING,
    busybar: BUSYBAR,
    spinner: SPINNER,
    leave: LEAVE,
    composites: COMPOSITES,
    hover: HOVER,
    focus: FOCUS,
    press: PRESS,
    type: TYPE,
    motifs: MOTIFS,
});

/* ---------------------------------------------------- the review kit's text */

// The intro's three paragraphs are the designer's STORY, verbatim (demo.html
// carries the same words, so the page reads without this script).
for (const [key, text] of Object.entries(STORY)) {
    const p = document.querySelector(`[data-dk-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.dk-intro h1');
if (h1) h1.textContent = TITLE;

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question, then what this option shows and the
// recommendation line: the dialog shows only the hint of the option on screen,
// so each hint has to stand on its own.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map((a) => ({
            id: a.id,
            label: a.label,
            options: a.options.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${a.question} ${o.see} ${o.verdict}`,
            })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', THEME);
lookLine.textContent = `${ASPECTS.length} questions, one rule of ${LABEL.toLowerCase()} each; the first option of every question is the recommendation. Pick the one that is ${LABEL.toLowerCase()} to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-dk-aspects]'));
const toc = document.querySelector('[data-dk-toc]');
ASPECTS.forEach((a, n) => {
    const scene = SCENES[a.scene];
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'dk-aspect';
    box.id = `dk-${a.id}`;
    box.setAttribute('data-dk-aspect', a.id);
    box.setAttribute('data-dk-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-dk-${a.id}`);
    box.innerHTML = `<div class="dk-aspect__head">
        <h3 id="h-dk-${a.id}"><span class="dk-aspect__no">${n + 1}</span> ${a.label} <span class="dk-aspect__rule">${a.rule}</span></h3>
        <p class="dk-aspect__q"></p><p class="dk-aspect__why"></p></div><div class="dk-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.dk-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.dk-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.dk-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'dk-col';
        col.setAttribute('data-dk-option', String(at + 1));
        col.innerHTML = `<p class="dk-label"><span class="dk-label__no">${at + 1}</span> <span class="dk-label__name"></span>${
            at === 0 ? ' <span class="dk-label__rec">Recommended</span>' : ''
        }</p><p class="dk-see"></p><p class="dk-verdict"></p>
        <div class="dk-scene" data-dk-kind="${a.kind}" data-dk-${a.id}="${o.key}" data-dk-phase="in">${scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.dk-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.dk-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.dk-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('dk-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#dk-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays: contact, pass and its settle, group step, loop).
const BANDS = {
    pass: [220, '660 ms, the turn settles 220 ms after', '60 ms apart', 2400],
    brisk: [150, '440 ms, the turn settles 150 ms after', '40 ms apart', 1600],
    unhurried: [300, '990 ms, the turn settles 330 ms after', '90 ms apart', 3600],
};
for (const scene of section.querySelectorAll('[data-dk-durations]')) {
    const [contact, pass, group, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-dk-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-dk-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms`);
    say('pass', String(pass));
    say('group', String(group));
    say('loop', `${loop} ms a loop`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, updates or leaves is replayed by one clock,
// so the options of a row always start together and can be compared. One
// cycle: `gap` (what arrives is away: the line has not come), `in` (the line
// crosses and lays it), `hold` (it stands laid, cyan at the top), `out` (its
// arrival played backwards: the pass back on the inverse curves, what came
// last going first). `in` and `out` outlast the slowest pass with its group
// (the unhurried 990 ms and 330 ms of settle), so nothing is cut off. The CSS
// keys every motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-dk-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1500],
    ['hold', 1500],
    ['out', 1500],
]);
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.dk-scene[data-dk-kind="cycle"]')) scene.setAttribute('data-dk-phase', phase);
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    if (dialogPaused()) {
        timer = window.setTimeout(() => run(at), 300);
        return;
    }
    const [phase, ms] = PHASES[at];
    setPhase(phase);
    timer = window.setTimeout(() => run((at + 1) % PHASES.length), ms * slow);
}

/* ---------------------------------------------------- the press, looped */

// The press row shows each pressed part pressed on a loop of 3.2 s: at rest
// (0.9 s), pressed (1.2 s, the part carries the class the register's press
// would give it), let go (1.1 s). Pressing is at once and letting go eases
// back (options.css). The loop follows the speed buttons and the dialog's
// Pause; under reduced motion the part stands pressed; State: Press holds it.
const pressers = [...section.querySelectorAll('[data-dk-press] .dk-press')];
let pressTimer = 0;
const setPressed = (/** @type {boolean} */ on) => {
    for (const el of pressers) el.classList.toggle('dk-st-press', on);
};
function pressLoop(/** @type {boolean} */ on = false) {
    clearTimeout(pressTimer);
    if (reduced.matches) return setPressed(true);
    if (dialogPaused()) {
        pressTimer = window.setTimeout(() => pressLoop(on), 300);
        return;
    }
    if (section.getAttribute('data-dk-show') === 'press') return setPressed(true);
    setPressed(on);
    pressTimer = window.setTimeout(() => pressLoop(!on), (on ? 1200 : 2000) * slow);
}

/* --------------------------------------------------------------- controls */

/** A radio-like group: one pressed button. */
function radio(/** @type {string} */ attr, /** @type {(value: string) => void} */ apply) {
    const buttons = [...document.querySelectorAll(`[${attr}]`)];
    for (const b of buttons)
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attr) || '');
        });
}
radio('data-dk-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--dk-slow', String(slow));
    run(0);
    pressLoop(false);
});
// State forces a state on every button, entry and link of question 14: the
// part carries the class the register's pointer, keyboard and press would give it.
const FORCE = { hover: 'dk-st-hover', focus: 'dk-st-focus', press: 'dk-st-press' };
radio('data-dk-state', (value) => {
    section.setAttribute('data-dk-show', value);
    for (const el of section.querySelectorAll('[data-dk-composites] :is(.kp-button, .kp-menu__item, a.kp-kpi)'))
        for (const [state, cls] of Object.entries(FORCE)) el.classList.toggle(cls, state === value);
    pressLoop(false);
});
document.querySelector('[data-dk-replay]')?.addEventListener('click', () => {
    run(0);
    pressLoop(false);
});

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.dk-scene a, .dk-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
    pressLoop(false);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided dark components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=dark`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-dk-gallery]'));
const frameOf = new Map();
gallery?.addEventListener('toggle', () => {
    if (!gallery.open) return;
    for (const frame of gallery.querySelectorAll('iframe[data-src]')) {
        frame.setAttribute('src', frame.getAttribute('data-src') || '');
        frame.removeAttribute('data-src');
        frame.addEventListener('load', () => {
            if (/** @type {HTMLIFrameElement} */ (frame).contentWindow) frameOf.set(/** @type {HTMLIFrameElement} */ (frame).contentWindow, frame);
        });
    }
});
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-embed') return;
    const frame = frameOf.get(event.source);
    if (frame && data.height) frame.style.blockSize = `${Math.min(Math.max(data.height, 96), 900)}px`;
});
