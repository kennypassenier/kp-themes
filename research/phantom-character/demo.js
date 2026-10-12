// What makes phantom phantom (Kenny, 2026-10-08, after the anchor round: "Thrown as a
// screen, resolves at the slap"). Phantom is print: a calling card on a screened black
// board, and what it does is THROW A SCREEN THAT RESOLVES. A part flies in as its own
// halftone, a silhouette of dots in its shape, slaps down with a dead stop and
// resolves into the solid thing in three hard cuts; what leaves dissolves into dots and
// is snatched off. The questions below turn that anchor into rules for every other
// component (themes/phantom/CHARACTER.md, G1-G21).
//
// A review-kit demo in aspect mode, phantom only. The questions are data in
// aspects.js (the designer's text, used verbatim); this file adds each question's scene
// (a small dashboard of the package's own components in phantom), builds the rows and
// the review kit's choices from that data, and runs the page's one clock. Each OPTION
// is a live scene with one attribute on its wrapper (`data-ph-<question>="<key>"`) that
// options.css reads. The first option is the recommendation. The network graph is in no
// scene: it changes in no theme (Kenny, 2026-10-07 02:54) and is never a target (G21).

import { ASPECTS, STORY, TITLE, THEME, LABEL } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span></button>`;

/** The busy picture of the package's bar: a track, the fill, the shard at its head. */
const barInner =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>';
/** The bar while no share is known. @param {string} label @param {string} size */
const busyBar = (label = 'Export busy', size = '') =>
    `<div class="kp-progressbar ph-bar ${size}" role="progressbar" aria-label="${label}" data-kp-indeterminate>${barInner}</div>`;
/** The bar with a share known. @param {number} value @param {string} size */
const shareBar = (value = 0.62, size = '') =>
    `<div class="kp-progressbar ph-bar ph-bar--share ${size}" role="progressbar" aria-label="Export, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}">${barInner}</div>`;

/** What a waiting part wears: the loading pictures of the picks and of the register (shown by the option that names them). */
const LOAD =
    '<span class="ph-load" aria-hidden="true"><span class="ph-load__slash"></span><span class="ph-load__ring"></span><span class="ph-load__screen"></span></span>';

/** The change on a figure: the tone's plate and ink. */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta ph-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter ph-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const TREND = '0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8';
const TREND2 = '0,20 15,23 30,17 45,19 60,8 75,14 90,5 105,11 120,3';
const polyline = `<polyline points="${TREND}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/>`;

/** A plate: the package's card (cut paper) on a wrapper that carries the part's hard shadow, since a clip-path cuts a shadow off. */
const plate = (inner, cls = '') => `<div class="ph-plate ${cls}">${inner}</div>`;

const PART = {
    dialog: (arrives = true, long = false) =>
        plate(
            `<div class="kp-dialog ph-dialog" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title ph-title">Close INC-4471?</p>
        <p class="kp-dialog__description">${
            long
                ? 'The vendor is told at once, and the crew on call at pump house 4 gets the closing note by radio before the valve is shut.'
                : 'The vendor is told at once.'
        }</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
            `ph-dialog-wrap${arrives ? ' ph-arrives' : ''}`,
        ),
    menu: () => `<div class="ph-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${plate(
            `<div class="kp-popover ph-pop"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'ph-arrives ph-pop-wrap',
        )}
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h', arrives = true) =>
        plate(
            `<div class="kp-card ph-tile"><p class="kp-card__title ph-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
            arrives ? 'ph-arrives' : '',
        ),
    kpi: (label = 'Flow now', value = '412', foot = note('6 %'), tone = '', extra = '') =>
        `<div class="kp-kpi ph-kpi"${tone ? ` data-kp-tone="${tone}"` : ''}>
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value ph-carrier" data-ph-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>${extra}
    </div>`,
    /** A plate beside one at an even pace: the same plate twice on a track, one on the option's curve and one at an even pace. */
    beads: () => `<div class="ph-beads" aria-hidden="true">
        <span class="ph-beads__ground"><span class="ph-bead ph-bead--own ph-arrives"></span></span>
        <span class="ph-beads__ground"><span class="ph-bead ph-bead--even ph-arrives"></span></span>
        <span class="ph-beads__name">this curve</span><span class="ph-beads__name">an even pace</span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="ph-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="ph-day ph-arrives" style="--i: ${i}"><span class="ph-day__n">${from + i}</span></span>`)
            .join('')}</div>`,
    chip: (word = 'Running') =>
        `<span class="ph-state"><span class="ph-state__dot ph-carrier" aria-hidden="true"></span><span class="ph-state__word ph-carrier" data-ph-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.', kind = '', arrives = true) =>
        `<div class="kp-alert ${kind} ph-alert${arrives ? ' ph-arrives' : ''}" role="status"><span class="kp-alert__body">${text}</span></div>`,
    toast: () =>
        plate(`<div class="kp-toast ph-toast" role="status"><span class="kp-toast__body">Export finished</span></div>`, 'ph-toast-wrap ph-arrives'),
    tip: (arrives = true) => `<div class="kp-tooltip ph-tip${arrives ? ' ph-arrives' : ''}" role="tooltip">14:00 · 412 m³/h</div>`,
    /** The trend's line, one layer (a live update dissolves and resolves it). */
    spark: () =>
        `<span class="ph-spark ph-carrier ph-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg></span>`,
    /** The trend's line cut in along its length. */
    sparkRun: () => `<span class="ph-spark ph-run ph-arrives" aria-hidden="true">
        <svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg>
    </span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="ph-column"><span class="kp-kpi__label">${label}</span><span class="ph-column__num ph-carrier" data-ph-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="ph-skel" aria-hidden="true"><span class="kp-skeleton ph-waits"></span><span class="kp-skeleton ph-waits"></span><span class="kp-skeleton ph-waits"></span></div>`,
    field: () =>
        `<label class="kp-field ph-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        plate(
            `<div class="kp-popover ph-pop ph-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
                .map(
                    (t, i) =>
                        `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${
                            i === 0 && pointed ? ' ph-pointed' : ''
                        }">${t}</button></li>`,
                )
                .join('')}</ul></div>`,
            'ph-pop-wrap',
        ),
};
const caption = (/** @type {string} */ text) => `<p class="ph-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="ph-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const MOVING = () =>
    cell('A plate is thrown, beside one at an even pace', PART.beads(), 'ph-part--wide') +
    cell('A dialog, onto the board', PART.dialog()) +
    cell('A menu, under its button', PART.menu()) +
    cell('A tile, in place', PART.tile());

const DIRECTION = () =>
    cell('A week of days, one after the other', PART.days(7), 'ph-part--wide') +
    cell('A tile', PART.tile()) +
    cell('A key figure', plate(PART.kpi(), 'ph-arrives')) +
    cell('The trend’s line', PART.sparkRun(), 'ph-part--wide');

const OPENING = () =>
    cell('A menu opens from its button', PART.menu()) +
    cell('A dialog opens on the board', PART.dialog()) +
    cell('A toast appears', PART.toast()) +
    cell('A tooltip appears', `<div class="ph-tipbox">${button('14:00', 'kp-button--sm')}${PART.tip()}</div>`);

const DURATION = () =>
    cell(
        'Contact: a press',
        `<div class="ph-row">${button('Export readings', 'ph-tap ph-arrives')}</div><p class="ph-readout" data-ph-readout="contact"></p>`,
    ) +
    cell('A throw: a dialog onto the board', PART.dialog() + '<p class="ph-readout" data-ph-readout="throw"></p>') +
    cell('A group: five days dealt', PART.days(5, 12) + '<p class="ph-readout" data-ph-readout="group"></p>') +
    cell('A loop: the busy bar', busyBar('Loading') + '<p class="ph-readout" data-ph-readout="loop"></p>');

const COLOUR = () =>
    cell('A card and its words', PART.tile('Reservoir North', 'Level 71 %', false), 'ph-colour-card') +
    cell(
        'What acts',
        `<div class="ph-row">${button('Export')}${button('Add a pump house', 'kp-button--primary')}</div><div class="ph-row ph-row--gap"><label class="kp-switch ph-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-label="Live" /></label><a class="ph-link" href="#ph-intro">Open the log</a></div>`,
    ) +
    cell(
        'A month',
        `<div class="ph-days ph-days--month">${[12, 13, 14, 15, 16].map((d) => `<span class="ph-day${d === 14 ? ' ph-today' : ''}${d === 13 ? ' ph-picked' : ''}"><span class="ph-day__n">${d}</span></span>`).join('')}</div>`,
    ) +
    cell('A key figure and a meter', `${PART.kpi('Flow now', '412', note('6 %'), '', '')}<div class="ph-gap"></div>${meter(0.62, 0.8)}`) +
    cell('A failed export', PART.alert('Export failed: the vendor did not answer.', 'kp-alert--destructive', false), 'ph-part--wide');

/** One part in three sizes, side by side: small, long (tall and narrow) and wide, so a corner can be compared across them. */
const sizes3 = (/** @type {(size: string, cls: string) => string} */ make) =>
    `<div class="ph-sizes3">${make('small', 'ph-small')}${make('long', 'ph-long')}${make('wide', 'ph-wide')}</div>`;

const CORNERS = () =>
    cell(
        'Card: small, long, wide',
        sizes3((size, cls) =>
            plate(
                `<div class="kp-card ph-tile"><p class="kp-card__title ph-title">${
                    { small: 'Pump 4', long: 'Reservoir North', wide: 'Reservoir North, the whole northern network' }[size]
                }</p><p class="kp-card__body">${
                    {
                        small: '71 %',
                        long: 'Level 71 %, falling slowly since the night valve closed',
                        wide: 'Level 71 %, falling slowly since the night valve closed at 02:10',
                    }[size]
                }</p></div>`,
                cls,
            ),
        ),
        'ph-part--wide',
    ) +
    cell(
        'Menu panel: small, wide',
        `<div class="ph-sizes3">${PART.menuStatic(['Open'], '', false).replace('ph-pop-wrap', 'ph-pop-wrap ph-small')}${PART.menuStatic(
            ['Open incident', 'Assign to the crew on call', 'Rename'],
            '',
            false,
        ).replace('ph-pop-wrap', 'ph-pop-wrap ph-wide')}</div>`,
        'ph-part--wide',
    ) +
    cell(
        'Key figure: small, long, wide',
        sizes3((size, cls) => {
            const kpi = PART.kpi(
                { small: 'Flow', long: 'Flow now', wide: 'Flow now at the northern pump houses' }[size],
                { small: '4', long: '412', wide: '412 m³/h' }[size],
                size === 'small' ? '' : note('6 %'),
            ).replace('class="kp-kpi ph-kpi"', `class="kp-kpi ph-kpi ${cls}"`);
            return size === 'wide' ? `<div class="kp-kpis ph-wide">${kpi.replace(' ph-wide', '')}</div>` : kpi;
        }),
        'ph-part--wide',
    ) +
    cell(
        'Button, tag and chip',
        `<div class="ph-row">${button('Export')}<span class="kp-badge ph-tag">12 new</span><span class="kp-tag ph-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', PART.tip(false)) +
    cell('The bar and its head', shareBar(0.62));

const SURFACE = () =>
    cell('A dialog with a title and a long line', PART.dialog(false, true)) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell(
        'A trend tile',
        plate(
            `<div class="kp-card ph-tile ph-chart"><p class="kp-card__title ph-title">Flow, 24 h</p><span class="ph-chart__plot" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none">${polyline}</svg></span><p class="kp-card__body">412 m³/h</p></div>`,
        ),
    ) +
    cell('A menu with headings', PART.menuStatic(['Open incident', 'Assign to…'], 'ph-pop--headed', false)) +
    cell('The state word', PART.chip('Running'));

const WARNING = () =>
    cell(
        'A key figure that needs attention',
        `<div class="kp-kpis">${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad'), 'warning')}</div>`,
    ) +
    cell(
        'A failed trend tile',
        plate(
            `<div class="kp-card ph-tile ph-failed" data-ph-tone="bad"><p class="kp-card__title ph-title">Pump house 3</p><span class="ph-spark ph-spark--stale" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">${polyline}</svg></span><p class="kp-card__body">No reading since 06:40 ${note('2 h', 'down', 'bad')}</p></div>`,
        ),
    ) +
    cell(
        'A destructive menu entry',
        plate(
            `<div class="kp-popover ph-pop ph-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive ph-bad">Delete</button></li></ul></div>`,
            'ph-pop-wrap',
        ),
    ) +
    cell('A warning alert', PART.alert('Pressure is low at pump house 3.', 'kp-alert--warning', false));

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        plate(
            `<div class="kp-card ph-tile ph-live-tile"><p class="kp-card__title ph-title">Pump house 2</p><p class="kp-card__body"><span class="ph-carrier" data-ph-num>4.2 bar</span></p></div>`,
        ),
    );

const LOADING = () =>
    cell(
        'Tile',
        plate(
            `<div class="kp-card ph-tile" aria-busy="true"><p class="kp-card__title ph-title">Pump house 2</p><p class="kp-card__body">Reading…</p></div>${LOAD}`,
            'ph-waits',
        ),
    ) +
    cell(
        'Panel',
        `<div class="kp-kpis"><div class="kp-kpi ph-kpi ph-waits" aria-busy="true"><span class="kp-kpi__label">Readings today</span><span class="kp-kpi__value">18 240</span><span class="kp-kpi__trend">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Menu, loading entry',
        plate(
            `<div class="kp-popover ph-pop ph-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item ph-waits" aria-busy="true">Loading stations…${LOAD}</button></li></ul></div>`,
            'ph-pop-wrap',
        ),
    ) +
    cell(
        'Month days',
        `<div class="ph-days">${[1, 2, 3, 4, 5].map((d) => `<span class="ph-day ph-waits" style="--i: ${d - 1}"><span class="ph-day__n">${d}</span>${LOAD}</span>`).join('')}</div>`,
    ) +
    cell(
        'Chart plot',
        `<div class="ph-plot ph-waits" aria-busy="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">${polyline}</svg>${LOAD}</div>`,
    ) +
    cell('Skeleton lines', PART.skeleton());

const BUSYBAR = () =>
    cell(
        'Three sizes, busy: no share known yet',
        `<div class="ph-sizes">${busyBar('Small', '')}${busyBar('Medium', 'kp-progressbar--md')}${busyBar('Large', 'kp-progressbar--lg')}</div>`,
        'ph-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button ph-busy-button" aria-busy="true"><span class="kp-button__label">Exporting${busyBar('Exporting', 'ph-bar--inline')}</span></button>`,
    ) +
    cell('Beside it, the same in every option: the bar with a share (62 %)', shareBar(0.62));

const spin = (size = '') =>
    `<span class="kp-spinner ph-spin" role="status" aria-label="Working…"${size ? ` style="--kp-spinner-size: ${size}"` : ''}></span>`;

const SPINNER = () =>
    cell('Three sizes', `<div class="ph-row ph-spins">${spin('1.25rem')}${spin('2rem')}${spin('3.5rem')}</div>`, 'ph-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button ph-busy-button" aria-busy="true">${spin()}<span class="kp-button__label">Saving…</span></button>`,
    ) +
    cell('The busy panel', `<div class="kp-card ph-tile ph-busy-panel">${spin('2.5rem')}<p class="kp-card__body">Reading the pump houses…</p></div>`);

/** A part that leaves and arrives. @param {string} html */
const leaver = (html) => `<div class="ph-leaver ph-arrives">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert('Pump house 4 is back online.', '', false))) +
    cell(
        'A card',
        leaver(
            plate(`<div class="kp-card ph-tile"><p class="kp-card__title ph-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`),
        ),
    ) +
    cell('A key figure', leaver(`<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %')).replace(' data-ph-num', '')}</div>`));

const COMPOSITES = () =>
    cell(
        'Alone: the theme’s own button, for reference',
        `<div class="ph-row">${button('Export readings', 'ph-alone')}${button('Add', 'kp-button--primary ph-alone')}</div>`,
        'ph-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header ph-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title ph-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions ph-actions-card">${button('Export', 'kp-button--sm ph-in-header')}${button('Add', 'kp-button--sm kp-button--primary ph-in-header')}</div></div></header>`,
        'ph-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'ph-in-menu', false)) +
    cell(
        'Tile: its Open link',
        plate(
            `<div class="kp-card ph-tile ph-in-tile"><p class="kp-card__title ph-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm ph-tile-link" href="#ph-intro"><span class="kp-button__label">Open</span></a></div>`,
        ),
    ) +
    cell(
        'Drawer: its tour buttons',
        plate(
            `<div class="kp-card ph-tile ph-drawer"><p class="kp-card__title ph-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="ph-row ph-actions-card">${button(
                'Skip',
                'kp-button--sm kp-button--ghost ph-in-drawer',
            )}${button('Next', 'kp-button--sm kp-button--primary ph-in-drawer')}</div></div>`,
        ),
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi ph-kpi ph-in-kpi" href="#ph-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="ph-row">${button('Export readings', 'ph-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        plate(
            `<div class="kp-card ph-tile ph-in-tile ph-pointed-tile"><p class="kp-card__title ph-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm ph-tile-link ph-pointed" href="#ph-intro"><span class="kp-button__label">Open</span></a></div>`,
        ),
    ) +
    cell(
        'A link in running text, pointed at',
        `<p class="ph-prose">Read the <a class="ph-link ph-pointed" href="#ph-intro">pump house log</a> before the crew leaves.</p>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis ph-kpi-row"><a class="kp-kpi ph-kpi ph-in-kpi ph-pointed" href="#ph-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi ph-kpi ph-in-kpi" href="#ph-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="ph-days">${[12, 13, 14, 15].map((d) => `<span class="ph-day${d === 13 ? ' ph-pointed' : ''}"><span class="ph-day__n">${d}</span></span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="ph-row">${button('Export readings', 'ph-focused')}</div>`) +
    cell('Header action', `<div class="ph-header-mini">${button('Export', 'kp-button--sm ph-in-header ph-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi ph-kpi ph-in-kpi ph-focused" href="#ph-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        plate(
            `<div class="kp-popover ph-pop ph-pop--static ph-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item ph-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
            'ph-pop-wrap',
        ),
    ) +
    cell(
        'Calendar day',
        `<div class="ph-days"><span class="ph-day"><span class="ph-day__n">13</span></span><span class="ph-day ph-focused"><span class="ph-day__n">14</span></span><span class="ph-day"><span class="ph-day__n">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        plate(
            `<div class="kp-card ph-tile ph-in-tile"><p class="kp-card__title ph-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm ph-tile-link ph-focused" href="#ph-intro"><span class="kp-button__label">Open</span></a></div>`,
        ),
    );

const PRESS = () =>
    cell('Button', `<div class="ph-row">${button('Export readings', 'ph-press')}</div>`) +
    cell('Primary button', `<div class="ph-row">${button('Add a pump house', 'kp-button--primary ph-press')}</div>`) +
    cell(
        'Menu entry',
        plate(
            `<div class="kp-popover ph-pop ph-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item ph-press">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
            'ph-pop-wrap',
        ),
    ) +
    cell(
        'Calendar day',
        `<div class="ph-days"><span class="ph-day"><span class="ph-day__n">13</span></span><span class="ph-day ph-press"><span class="ph-day__n">14</span></span><span class="ph-day"><span class="ph-day__n">15</span></span></div>`,
    ) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle ph-kpi ph-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
    );

/** A label or title as words, each of which the ransom note puts on its own scrap. @param {string} text */
const words = (text) =>
    text
        .split(' ')
        .map((w) => `<span class="ph-w">${w}</span>`)
        .join(' ');

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        plate(
            `<div class="kp-card ph-tile ph-type"><p class="ph-type__label">${words('Northern network')}</p><p class="ph-type__head">${words('Pump house 4')}</p>
        <p class="ph-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="ph-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="ph-type__table"><tbody><tr><th scope="row">${words('Flow')}</th><td>412 m³/h</td></tr><tr><th scope="row">${words('Last reading')}</th><td><span class="kp-timestamp ph-stamp">2026-10-08 07:12</span></td></tr></tbody></table>
        <p class="ph-type__id">INC-4471 · pump-house-4</p>
        <p class="ph-row">${button('Open the log', 'kp-button--sm')} <span class="kp-badge ph-tag">12 new</span></p></div>`,
        ),
        'ph-part--wide',
    );

const MOTIFS = () =>
    cell('A card with its title', PART.tile('Reservoir North', 'Level 71 %', false)) +
    cell('A meter with its mark', meter(0.62, 0.8) + `<div class="ph-gap"></div>${meter(1, 0.8, 'data-kp-over')}`) +
    cell(
        'A chart’s events',
        `<div class="ph-events" aria-hidden="true"><svg viewBox="0 0 120 40" preserveAspectRatio="none">${polyline}</svg><i></i><i></i></div>`,
    ) +
    cell(
        'A button and a list',
        `<div class="ph-row">${button('Export', 'kp-button--primary')}</div><ul class="ph-list"><li>Pump house 1</li><li>Pump house 2</li></ul>`,
    ) +
    cell(
        'An empty state',
        `<div class="kp-empty ph-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell(
        'A divider between two sections',
        `<p class="ph-cap ph-cap--inner">Pumps</p><div class="ph-seam" data-kp-divider role="separator"></div><p class="ph-cap ph-cap--inner">Reservoirs</p>`,
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
    const p = document.querySelector(`[data-ph-story="${key}"]`);
    if (p) p.textContent = text;
}
const h1 = document.querySelector('.ph-intro h1');
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

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-ph-aspects]'));
const toc = document.querySelector('[data-ph-toc]');
ASPECTS.forEach((a, n) => {
    const scene = SCENES[a.scene] || (a.scene === 'bar' ? SCENES.busybar : undefined);
    if (!scene) throw new Error(`no scene for ${a.id}: ${a.scene}`);
    const box = document.createElement('section');
    box.className = 'ph-aspect';
    box.id = `ph-${a.id}`;
    box.setAttribute('data-ph-aspect', a.id);
    box.setAttribute('data-ph-count', String(a.options.length));
    box.setAttribute('aria-labelledby', `h-ph-${a.id}`);
    box.innerHTML = `<div class="ph-aspect__head">
        <h3 id="h-ph-${a.id}"><span class="ph-aspect__no">${n + 1}</span> ${a.label} <span class="ph-aspect__rule">${a.rule}</span></h3>
        <p class="ph-aspect__q"></p><p class="ph-aspect__why"></p></div><div class="ph-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.ph-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.ph-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.ph-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'ph-col';
        col.setAttribute('data-ph-option', String(at + 1));
        col.innerHTML = `<p class="ph-label"><span class="ph-label__no">${at + 1}</span> <span class="ph-label__name"></span>${
            at === 0 ? ' <span class="ph-label__rec">Recommended</span>' : ''
        }</p><p class="ph-see"></p><p class="ph-verdict"></p>
        <div class="ph-scene" data-ph-kind="${a.kind}" data-ph-${a.id}="${o.key}" data-ph-phase="in">${scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.ph-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.ph-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.ph-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('ph-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#ph-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays: contact, throw with its resolve, group, loop).
const BANDS = {
    throw: ['120 ms', '400 ms + 300 ms resolve', '80 ms apart', '1500 ms a pass'],
    brisk: ['80 ms', '260 ms + 200 ms resolve', '50 ms apart', '1000 ms a pass'],
    unhurried: ['180 ms', '600 ms + 450 ms resolve', '120 ms apart', '2250 ms a pass'],
};
for (const scene of section.querySelectorAll('[data-ph-durations]')) {
    const [contact, throwing, group, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-ph-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-ph-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', contact);
    say('throw', throwing);
    say('group', group);
    say('loop', loop);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, updates or leaves is replayed by one clock, so the
// options of a row always start together and can be compared. One cycle: `gap` (what
// arrives is away, off the start edge as a screen), `in` (it is thrown and resolves,
// a value updates), `hold` (it stands solid, askew), `out` (its arrival played
// backwards: dissolved, then thrown back, what came last going first). `in` and `out`
// outlast the slowest throw with its group (the unhurried 600 + 450 ms and four 120 ms
// steps), so nothing is cut off. The CSS keys every motion to these phases; the clock
// only sets the attribute (and changes the values of a live update half way through
// its dissolve).
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-ph-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 2000],
    ['hold', 1500],
    ['out', 2000],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
let swap = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

/** A live update changes its figures while they are dots: 150 ms into the dissolve (of 400 ms). */
function change() {
    tick += 1;
    for (const num of section.querySelectorAll('.ph-scene[data-ph-live] [data-ph-num]')) {
        const text = num.textContent || '';
        if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
        else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
    }
    for (const word of section.querySelectorAll('.ph-scene[data-ph-live] [data-ph-word]')) word.textContent = tick % 2 ? 'Draining' : 'Running';
    for (const line of section.querySelectorAll('.ph-scene[data-ph-live] .ph-spark polyline')) line.setAttribute('points', tick % 2 ? TREND2 : TREND);
}

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.ph-scene[data-ph-kind="cycle"]')) scene.setAttribute('data-ph-phase', phase);
    clearTimeout(swap);
    if (phase === 'in' || phase === 'out') swap = window.setTimeout(change, 150 * slow);
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
radio('data-ph-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--ph-slow', String(slow));
    run(0);
});
radio('data-ph-state', (value) => {
    section.setAttribute('data-ph-show', value);
});
document.querySelector('[data-ph-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.ph-scene a, .ph-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided phantom components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=phantom`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-ph-gallery]'));
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
