// What makes light light (Kenny, 2026-10-08, after the anchor round: "Overexposed:
// out of the glare"). Light is a photograph on white paper, and what it does is
// EXPOSE: a part is a glare first, blurred and too bright, and comes down into
// focus and into its own white; what leaves goes back into the glare. The
// questions below turn that anchor into rules for every other component
// (themes/light/CHARACTER.md, G1-G21).
//
// A review-kit demo in aspect mode, light only. The questions are data in
// aspects.js (the designer's text, used verbatim); this file adds each
// question's scene (a small dashboard of the package's own components in
// light), builds the rows and the review kit's choices from that data, and
// runs the page's one clock. Each OPTION is a live scene with one attribute on
// its wrapper (`data-lt-<question>="<key>"`) that options.css reads. The first
// option is the recommendation. The network graph is in no scene: it changes in
// no theme (Kenny, 2026-10-07 02:54).

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The busy picture of the package's bar: a track, the line, the bead at its head. */
const barInner =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>';
/** The bar while no share is known. @param {string} label @param {string} size */
const busyBar = (label = 'Export busy', size = '') =>
    `<div class="kp-progressbar lt-bar ${size}" role="progressbar" aria-label="${label}" data-kp-indeterminate>${barInner}</div>`;
/** The bar with a share known. @param {number} value @param {string} size */
const shareBar = (value = 0.62, size = '') =>
    `<div class="kp-progressbar lt-bar lt-bar--share ${size}" role="progressbar" aria-label="Export, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}">${barInner}</div>`;

/** What a waiting part wears over it: the daylight band, the dashed baseline (the picks' loading pictures). */
const LOAD =
    '<span class="lt-load" aria-hidden="true"><span class="lt-load__band"></span><span class="lt-load__dash"></span><span class="lt-load__pills"><i></i><i></i></span></span>';

/** The change on a pill: the tone's plate and ink. */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta lt-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter lt-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const TREND = '0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8';
const polyline = `<polyline points="${TREND}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;

const PART = {
    dialog: () => `<div class="kp-dialog lt-dialog lt-arrives" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title lt-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: () => `<div class="lt-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="kp-popover lt-pop lt-arrives"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => `<div class="kp-card lt-tile lt-arrives">
        <p class="kp-card__title lt-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412', foot = note('6 %'), tone = '') =>
        `<div class="kp-kpi lt-kpi"${tone ? ` data-kp-tone="${tone}"` : ''}>
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value lt-carrier" data-lt-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    /** A bead on the option's curve beside one at an even pace. */
    beads: () => `<div class="lt-beads" aria-hidden="true">
        <span class="lt-beads__ground"><span class="lt-bead lt-bead--own lt-arrives"></span></span>
        <span class="lt-beads__ground"><span class="lt-bead lt-bead--even lt-arrives"></span></span>
        <span class="lt-beads__name">this curve</span><span class="lt-beads__name">an even pace</span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="lt-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="lt-day lt-arrives" style="--i: ${i}">${from + i}</span>`)
            .join('')}</div>`,
    chip: (word = 'Running') =>
        `<span class="lt-state"><span class="lt-state__dot lt-carrier" aria-hidden="true"></span><span class="lt-state__word lt-carrier" data-lt-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.', kind = '') =>
        `<div class="kp-alert ${kind} lt-alert lt-arrives" role="status"><span class="kp-alert__body">${text}</span></div>`,
    /** The trend's line, one layer (a live update re-exposes it). */
    spark: () =>
        `<span class="lt-spark lt-carrier lt-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg></span>`,
    /** The trend's line exposed along its length: the focused line behind, the glare running ahead of it. */
    sparkRun: () => `<span class="lt-spark lt-run lt-arrives" aria-hidden="true">
        <svg class="lt-run__line" viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg>
        <svg class="lt-run__glare" viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg>
    </span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="lt-column"><span class="kp-kpi__label">${label}</span><span class="lt-column__num lt-carrier" data-lt-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="lt-skel lt-waits" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>${LOAD}</div>`,
    field: () =>
        `<label class="kp-field lt-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover lt-pop lt-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${
                        i === 0 && pointed ? ' lt-pointed' : ''
                    }">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (/** @type {string} */ text) => `<p class="lt-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="lt-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const MOVING = () =>
    cell('A bead comes into focus, beside one at an even pace', PART.beads(), 'lt-part--wide') +
    cell('A dialog, in place', PART.dialog()) +
    cell('A menu, under its button', PART.menu()) +
    cell('A tile, in place', PART.tile());

const DIRECTION = () =>
    cell('A week of days, one after the other', PART.days(7), 'lt-part--wide') +
    cell('A tile', PART.tile()) +
    cell('A key figure', `<div class="kp-kpis lt-arrives">${PART.kpi()}</div>`) +
    cell('The trend’s line', PART.sparkRun(), 'lt-part--wide');

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell('Contact: a press', `<div class="lt-row">${button('Export readings', 'lt-tap')}</div><p class="lt-readout" data-lt-readout="contact"></p>`) +
    cell('An exposure: a dialog opens', PART.dialog() + '<p class="lt-readout" data-lt-readout="exposure"></p>') +
    cell('A group: five days', PART.days(5, 12) + '<p class="lt-readout" data-lt-readout="group"></p>') +
    cell('A loop: the busy bar', busyBar('Loading') + '<p class="lt-readout" data-lt-readout="loop"></p>');

const COLOUR = () =>
    cell(
        'What acts',
        `<div class="lt-row">${button('Export')}${button('Add a pump house', 'kp-button--primary')}<a class="lt-link" href="#lt-intro">Open the log</a></div>`,
    ) +
    cell('What is light itself', `${shareBar(0.62)}<div class="lt-seam" data-kp-divider="alt" role="separator"></div>`, 'lt-colour-light') +
    cell(
        'The glare, frozen in three frames',
        `<div class="lt-frames" aria-hidden="true">${[0, 1, 2]
            .map(
                (i) =>
                    `<span class="lt-frame" style="--i: ${i}"><span class="kp-kpi__label">Flow</span><span class="lt-frame__num">412</span></span>`,
            )
            .join('')}</div>`,
        'lt-part--wide',
    ) +
    cell(
        'What shows a state',
        `<div class="lt-stack">${PART.alert('Pump house 4 is back online.', 'kp-alert--success').replace(' lt-arrives', '')}${PART.alert(
            'Pressure is low at pump house 3.',
            'kp-alert--warning',
        ).replace(' lt-arrives', '')}</div>`,
    ) +
    cell('Pointed at, and focused', `<div class="lt-row">${button('Export', 'lt-pointed')}${button('Add', 'kp-button--primary lt-focused')}</div>`);

const CORNERS = () =>
    cell('Card', PART.tile('Reservoir North', 'Level 71 %').replace(' lt-arrives', '')) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="lt-row">${button('Export')}<span class="kp-badge lt-tag">12 new</span><span class="kp-tag lt-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip lt-tip" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell(
        'Field, checkbox and switch',
        `${PART.field()}<div class="lt-row"><label class="lt-check"><input class="kp-field__check" type="checkbox" checked /> Alerts</label><label class="kp-switch lt-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></label></div>`,
    );

const SURFACE = () =>
    cell(
        'Three depths: a card, a menu, a dialog',
        `<div class="lt-depths"><div class="kp-card lt-depth"><p class="kp-card__title lt-title">Card</p><p class="kp-card__body">small</p></div>${PART.menuStatic(
            ['Menu'],
            'lt-depth',
            false,
        )}<div class="kp-dialog lt-dialog lt-depth lt-depth--lg"><p class="kp-dialog__title lt-title">Dialog</p><p class="kp-dialog__description">large</p></div></div>`,
        'lt-part--wide',
    ) +
    cell(
        'A chart card',
        `<div class="kp-card lt-tile lt-chart"><p class="kp-card__title lt-title">Flow, 24 h</p><span class="lt-chart__plot" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none">${polyline}</svg></span></div>`,
    ) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell('A week of days', `<div class="lt-days lt-week">${[12, 13, 14, 15, 16].map((d) => `<span class="lt-day">${d}</span>`).join('')}</div>`) +
    cell('The seam', `<div class="lt-seam" data-kp-divider role="separator"></div>`);

const WARNING = () =>
    cell(
        'A key figure that needs attention',
        `<div class="kp-kpis">${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad'), 'warning').replace('class="kp-kpi lt-kpi"', 'class="kp-kpi lt-kpi lt-warn"')}</div>`,
    ) +
    cell(
        'A failed trend tile',
        `<div class="kp-card lt-tile lt-failed" data-lt-tone="bad"><p class="kp-card__title lt-title">Pump house 3</p><span class="lt-spark lt-spark--stale" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg></span><p class="kp-card__body">No reading since 06:40 ${note('2 h', 'down', 'bad')}</p></div>`,
    ) +
    cell(
        'A destructive menu entry',
        `<div class="kp-popover lt-pop lt-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive lt-bad">Delete</button></li></ul></div>`,
    ) +
    cell('A warning alert', PART.alert('Pressure is low at pump house 3.', 'kp-alert--warning').replace(' lt-arrives', ''));

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card lt-tile lt-live-tile"><p class="kp-card__title lt-title">Pump house 2</p><p class="kp-card__body"><span class="lt-carrier" data-lt-num>4.2 bar</span></p></div>`,
    );

const LOADING = () =>
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi lt-kpi lt-waits" aria-busy="true"><span class="kp-kpi__label">Readings today</span><span class="kp-kpi__value">18 240</span><span class="kp-kpi__trend">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Tile',
        `<div class="kp-card lt-tile lt-waits" aria-busy="true"><p class="kp-card__title lt-title">Pump house 2</p><p class="kp-card__body">Reading…</p>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover lt-pop lt-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item lt-waits" aria-busy="true"><span class="lt-w">Loading stations…</span>${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month days',
        `<div class="lt-days">${[1, 2, 3, 4, 5].map((d) => `<span class="lt-day lt-waits" style="--i: ${d - 1}"><span class="lt-w">${d}</span>${LOAD}</span>`).join('')}</div>`,
    ) +
    cell(
        'Chart plot',
        `<div class="lt-plot lt-waits" aria-busy="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">${polyline}</svg>${LOAD}</div>`,
    ) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="lt-meter-wait lt-waits">${meter(0.62, 0.8, 'data-kp-loading')}${LOAD}</div>`);

const BUSYBAR = () =>
    cell(
        'Three sizes, busy: no share known yet',
        `<div class="lt-sizes">${busyBar('Small', '')}${busyBar('Medium', 'kp-progressbar--md')}${busyBar('Large', 'kp-progressbar--lg')}</div>`,
        'lt-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button lt-busy-button" aria-busy="true">Exporting${busyBar('Exporting', 'lt-bar--inline')}</button>`,
    ) +
    cell('Beside it, the same in every option: the bar with a share (62 %)', shareBar(0.62));

const spin = (size = '') =>
    `<span class="kp-spinner lt-spin" role="status" aria-label="Working…"${size ? ` style="--kp-spinner-size: ${size}"` : ''}></span>`;

const SPINNER = () =>
    cell('Three sizes', `<div class="lt-row lt-spins">${spin('1.25rem')}${spin('2rem')}${spin('3.5rem')}</div>`, 'lt-part--wide') +
    cell('A busy button', `<button type="button" class="kp-button lt-busy-button" aria-busy="true">${spin()}Saving…</button>`) +
    cell('The busy panel', `<div class="kp-card lt-busy-panel">${spin('2.5rem')}<p class="kp-card__body">Reading the pump houses…</p></div>`);

/** A part that leaves and arrives. @param {string} html */
const leaver = (html) => `<div class="lt-leaver lt-arrives">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert().replace(' lt-arrives', ''))) +
    cell('A card', leaver(PART.tile('Reservoir North', 'Level 71 %').replace(' lt-arrives', ''))) +
    cell('A key figure', leaver(`<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %')).replace(' data-lt-num', '')}</div>`));

const COMPOSITES = () =>
    cell(
        'Alone: the theme’s own button, for reference',
        `<div class="lt-row">${button('Export readings', 'lt-alone')}${button('Add', 'kp-button--primary lt-alone')}</div>`,
        'lt-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header lt-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title lt-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions lt-actions-card">${button('Export', 'kp-button--sm lt-in-header')}${button('Add', 'kp-button--sm kp-button--primary lt-in-header')}</div></div></header>`,
        'lt-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'lt-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card lt-tile lt-in-tile"><p class="kp-card__title lt-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm lt-tile-link" href="#lt-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card lt-drawer"><p class="kp-card__title lt-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="lt-row lt-actions-card">${button(
            'Skip',
            'kp-button--sm kp-button--ghost lt-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary lt-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi lt-kpi lt-in-kpi" href="#lt-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="lt-row">${button('Export readings', 'lt-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card lt-tile lt-in-tile lt-pointed-tile"><p class="kp-card__title lt-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm lt-tile-link lt-pointed" href="#lt-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis lt-kpi-row"><a class="kp-kpi lt-kpi lt-in-kpi lt-pointed" href="#lt-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi lt-kpi lt-in-kpi" href="#lt-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="lt-days">${[12, 13, 14, 15].map((d) => `<span class="lt-day${d === 13 ? ' lt-pointed' : ''}">${d}</span>`).join('')}</div>`,
    ) +
    cell(
        'A link in running text, pointed at',
        `<p class="lt-prose">Read the <a class="lt-link lt-pointed" href="#lt-intro">pump house log</a> before the crew leaves.</p>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="lt-row">${button('Export readings', 'lt-focused')}</div>`) +
    cell('Header action', `<div class="lt-header-mini">${button('Export', 'kp-button--sm lt-in-header lt-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi lt-kpi lt-in-kpi lt-focused" href="#lt-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover lt-pop lt-pop--static lt-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item lt-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="lt-days"><span class="lt-day">13</span><span class="lt-day lt-focused">14</span><span class="lt-day">15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card lt-tile lt-in-tile"><p class="kp-card__title lt-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm lt-tile-link lt-focused" href="#lt-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="lt-row">${button('Export readings', 'lt-press')}</div>`) +
    cell('Primary button', `<div class="lt-row">${button('Add a pump house', 'kp-button--primary lt-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover lt-pop lt-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item lt-press">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="lt-days"><span class="lt-day">13</span><span class="lt-day lt-press">14</span><span class="lt-day">15</span></div>`,
    ) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle lt-kpi lt-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card lt-type"><p class="lt-type__label">Northern network</p><p class="lt-type__head">Pump house 4</p>
        <p class="lt-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="lt-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="lt-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp lt-stamp">2026-10-08 07:12</span></td></tr></tbody></table>
        <p class="lt-type__ticks" aria-hidden="true"><span>06:00</span><span>09:00</span><span>12:00</span></p>
        <p class="lt-row">${button('Open the log', 'kp-button--sm')} <span class="kp-badge lt-tag">12 new</span></p></div>`,
        'lt-part--wide',
    );

const MOTIFS = () =>
    cell(
        'A divider between two sections',
        `<p class="lt-cap lt-cap--inner">Pumps</p><div class="lt-seam" data-kp-divider role="separator"></div><p class="lt-cap lt-cap--inner">Reservoirs</p>`,
    ) +
    cell('A line with its head', shareBar(0.62) + busyBar('Export busy')) +
    cell('Meter with its mark', meter(0.62, 0.8) + `<div class="lt-gap"></div>${meter(1, 0.8, 'data-kp-over')}`) +
    cell(
        'A month: today and the picked day',
        `<div class="lt-days lt-days--today">${[12, 13, 14, 15].map((d) => `<span class="lt-day${d === 14 ? ' lt-today' : ''}${d === 13 ? ' lt-picked' : ''}">${d}</span>`).join('')}</div>`,
    ) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Empty state',
        `<div class="kp-empty lt-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
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
    const p = document.querySelector(`[data-lt-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.lt-intro h1');
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

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-lt-aspects]'));
const toc = document.querySelector('[data-lt-toc]');
ASPECTS.forEach((a, n) => {
    const scene = SCENES[a.scene];
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'lt-aspect';
    box.id = `lt-${a.id}`;
    box.setAttribute('data-lt-aspect', a.id);
    box.setAttribute('data-lt-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-lt-${a.id}`);
    box.innerHTML = `<div class="lt-aspect__head">
        <h3 id="h-lt-${a.id}"><span class="lt-aspect__no">${n + 1}</span> ${a.label} <span class="lt-aspect__rule">${a.rule}</span></h3>
        <p class="lt-aspect__q"></p><p class="lt-aspect__why"></p></div><div class="lt-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.lt-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.lt-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.lt-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'lt-col';
        col.setAttribute('data-lt-option', String(at + 1));
        col.innerHTML = `<p class="lt-label"><span class="lt-label__no">${at + 1}</span> <span class="lt-label__name"></span>${
            at === 0 ? ' <span class="lt-label__rec">Recommended</span>' : ''
        }</p><p class="lt-see"></p><p class="lt-verdict"></p>
        <div class="lt-scene" data-lt-kind="${a.kind}" data-lt-${a.id}="${o.key}" data-lt-phase="in">${scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.lt-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.lt-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.lt-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('lt-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#lt-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays: contact, exposure, group, loop).
const BANDS = {
    exposure: [150, 420, 90, 2400],
    brisk: [100, 260, 60, 1600],
    unhurried: [200, 700, 120, 3600],
};
for (const scene of section.querySelectorAll('[data-lt-durations]')) {
    const [contact, exposure, group, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-lt-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-lt-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms`);
    say('exposure', `${exposure} ms`);
    say('group', `${group} ms apart`);
    say('loop', `${loop} ms a pass`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens or updates is replayed by one clock, so the
// options of a row always start together and can be compared. One cycle:
// `gap` (what arrives is away, a glare), `in` (it comes into focus, a value
// updates), `hold` (it stands crisp), `out` (it goes back into the glare, its
// arrival played backwards: the same exposure on the inverse curve, what came
// last going first). `in` and `out` outlast the slowest exposure with its
// group (the unhurried 700 ms and six 120 ms steps), so nothing is cut off. The
// CSS keys every motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-lt-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1500],
    ['hold', 1500],
    ['out', 1500],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.lt-scene[data-lt-kind="cycle"]')) scene.setAttribute('data-lt-phase', phase);
    if (phase === 'in') {
        tick += 1;
        for (const num of section.querySelectorAll('.lt-scene[data-lt-live] [data-lt-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('.lt-scene[data-lt-live] [data-lt-word]')) word.textContent = tick % 2 ? 'Draining' : 'Running';
    }
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
radio('data-lt-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--lt-slow', String(slow));
    run(0);
});
radio('data-lt-state', (value) => {
    section.setAttribute('data-lt-show', value);
});
document.querySelector('[data-lt-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.lt-scene a, .lt-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided light components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=light`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-lt-gallery]'));
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
