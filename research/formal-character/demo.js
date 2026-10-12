// What makes formal formal (Kenny, 2026-10-08: the anchor is the double rule).
//
// A review-kit demo in aspect mode, formal only. Each ASPECT (aspects.js, the
// designer's text, used verbatim) is one rule of the theme's grammar
// (themes/formal/CHARACTER.md, G1-G21) asked as a question; each OPTION is a
// live scene built from the package's own components, with one attribute on
// the scene's wrapper (`data-fm-<aspect>="<key>"`) that options.css reads.
// The recommended option is always first. The page's one clock (below) plays
// every scene that arrives, opens, updates or leaves, so the rule is seen in
// action; every close is its open reversed. The network graph is in no scene:
// it changes in no theme (Kenny, 2026-10-07 02:54).

import { ASPECTS as DATA, STORY, TITLE, THEME, LABEL } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The anchor's two rules: a navy rule and the thinner one that closes it. */
const RULES = `<span class="fm-rules" aria-hidden="true"><span class="fm-rule"></span><span class="fm-rule fm-rule--2"></span></span>`;

/** A figure that carries the double rule: its text, then the rules under it. */
const carrier = (text, cls = '', attr = 'data-fm-num') =>
    `<span class="fm-carrier ${cls}"><span ${attr} data-fm-text="${text}">${text}</span>${RULES}</span>`;

/** The bar's own busy picture. */
const bar = (label = 'Entering the minutes', cls = '', scale = 0) =>
    `<div class="kp-progressbar fm-bar ${cls}" role="progressbar" aria-label="${label}" data-kp-indeterminate${scale ? ` style="--kp-progressbar-scale: ${scale}"` : ''}><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;

/** The share bar: a known share. */
const share = (value = 0.62, label = 'Export') =>
    `<div class="kp-progressbar fm-bar fm-share" role="progressbar" aria-label="${label}, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;

/** The loading pictures every option draws over or under a waiting part. */
const LOAD = `<span class="fm-load" aria-hidden="true"><span class="fm-load__lines"><i style="--i: 0"></i><i style="--i: 1"></i><i style="--i: 2"></i></span><span class="fm-load__leader"></span><span class="fm-load__seal"></span><span class="fm-load__ink"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span></span></span>`;

/** The change on a square plate inside a hairline (the red-ink family's tone). */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta fm-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter fm-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const SPIN = `<span class="fm-spin__a"></span><span class="fm-spin__b"></span><span class="fm-spin__c"></span>`;
const dots = [...Array(12).keys()].map((i) => `<i style="--i: ${i}"></i>`).join('');
const spinner = (size, label = 'Working…') =>
    `<span class="kp-spinner fm-spin" role="status" aria-label="${label}" style="--kp-spinner-size: ${size}rem">${SPIN}<span class="fm-spin__dots">${dots}</span></span>`;

const MENU = ['Open incident', 'Assign to…', 'Rename', 'Duplicate', 'Archive', 'Delete'];

const PART = {
    dialog: () => `<div class="kp-dialog fm-dialog fm-frame" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title fm-title fm-line" style="--i: 0">Close INC-4471?</p>
        <p class="kp-dialog__description fm-line" style="--i: 1">The vendor is told at once.</p>
        <div class="kp-dialog__actions fm-line" style="--i: 2">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: (n = 3) => `<div class="fm-menu-wrap fm-menu-wrap--${n}">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="kp-popover fm-pop fm-frame"><ul class="kp-menu" role="menu">${MENU.slice(0, n)
            .map(
                (t, i) =>
                    `<li role="none" class="fm-line" style="--i: ${i}"><button type="button" role="menuitem" class="kp-menu__item${
                        t === 'Delete' ? ' kp-menu__item--destructive' : ''
                    }">${t}</button></li>`,
            )
            .join('')}</ul></div>
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => `<div class="kp-card fm-tile fm-frame">
        <p class="kp-card__title fm-title fm-line" style="--i: 0">${label}</p>
        <p class="kp-card__body fm-line" style="--i: 1">${body}</p>
    </div>`,
    tileStill: (label = 'Reservoir North', body = 'Level 71 %') => `<div class="kp-card fm-tile">
        <p class="kp-card__title fm-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412', foot = note('6 %')) => `<div class="kp-kpi fm-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value">${carrier(value)}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    kpiStill: (label = 'Flow now', value = '412', foot = note('6 %')) => `<div class="kp-kpi fm-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value">${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    rulers: () => `<div class="fm-rulers" aria-hidden="true">
        <span class="fm-ruler"><span class="fm-ruler__rule"></span></span>
        <span class="fm-ruler"><span class="fm-ruler__rule fm-ruler__rule--ref"></span></span>
        <span class="fm-rulers__name">this curve</span><span class="fm-rulers__name">an even pace</span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="fm-days" aria-hidden="true">${[...Array(n).keys()].map((i) => `<span class="fm-day" style="--i: ${i}">${from + i}</span>`).join('')}</div>`,
    chip: (word = 'Running') =>
        `<span class="fm-state"><span class="fm-state__dot" aria-hidden="true"></span>${carrier(word, 'fm-state__word', 'data-fm-word')}</span>`,
    alert: (text = 'Pump house 4 is back online.') =>
        `<div class="kp-alert fm-alert fm-frame" role="status"><span class="kp-alert__body fm-line" style="--i: 0">${text}</span></div>`,
    spark: (cls = '') => `<span class="fm-spark fm-carrier ${cls}" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline class="fm-spark__line" points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" pathLength="1"/>
        <polyline class="fm-spark__retrace" points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" pathLength="1"/></svg>${RULES}</span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="fm-column"><span class="kp-kpi__label">${label}</span><span class="fm-column__num">${carrier(value)}</span></div>`,
    field: () =>
        `<label class="kp-field fm-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover fm-pop fm-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${t === 'Delete' ? ' kp-menu__item--destructive' : ''}${
                        pointed && i === 0 ? ' fm-pointed' : ''
                    }">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="fm-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="fm-part ${cls}">${caption(cap)}${html}</div>`;

/** A waiting part: the loading pictures sit over or under its content. */
const waits = (cls, html) => `<div class="${cls} fm-waits" aria-busy="true">${html}${LOAD}</div>`;

/* ------------------------------------------------------------ the scenes */

/** Question 1: each part is ruled for the same time, only the curve differs. */
const MOVING = () =>
    cell('A rule ruled beside one at an even pace', PART.rulers(), 'fm-part--wide') +
    cell('A dialog is ruled in', PART.dialog()) +
    cell('A menu is ruled out of its button', PART.menu()) +
    cell('A tile is ruled in', PART.tile());

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'fm-part--wide') +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn', PART.spark().replace('fm-carrier', 'fm-walk').replace(RULES, '')) +
    cell('A figure arrives', PART.column('Open', '38').replace(RULES, '')) +
    cell(
        'Lines ruled on a waiting tile',
        waits('kp-card fm-tile', `<p class="kp-card__title fm-title">Pump house 3</p><p class="kp-card__body">Reading…</p>`),
    );

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell(
        'Contact: a press',
        `<div class="fm-row">${button('Approve the minute', 'fm-tap')}</div><p class="fm-readout" data-fm-readout="contact"></p>`,
    ) +
    cell('A dialog opens', PART.dialog() + '<p class="fm-readout" data-fm-readout="dialog"></p>') +
    cell('A menu of six opens', PART.menu(6) + '<p class="fm-readout" data-fm-readout="menu"></p>') +
    cell(
        'A figure arrives',
        `<div class="kp-kpis"><div class="kp-kpi fm-kpi"><span class="kp-kpi__label">Readings</span><span class="kp-kpi__value"><span class="fm-carrier fm-ruled-in"><span data-fm-text="18 240">18 240</span>${RULES}</span></span></div></div><p class="fm-readout" data-fm-readout="figure"></p>`,
    ) +
    cell('A loop: the busy bar', bar('Loading') + '<p class="fm-readout" data-fm-readout="loop"></p>');

const COLOUR = () =>
    cell(
        'A card with an emphasised word',
        `<div class="kp-card fm-tile"><p class="kp-card__title fm-title">Reservoir North</p><p class="kp-card__body">Level <mark>71 %</mark>, within the limit.</p></div>`,
    ) +
    cell(
        'Key figures, one with a tone',
        `<div class="kp-kpis"><div class="kp-kpi fm-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">${note('6 %')} on yesterday</span></div><div class="kp-kpi fm-kpi" data-kp-tone="warning"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">1.1 bar</span><span class="kp-kpi__trend">${note('0.4 bar', 'down', 'bad')} on yesterday</span></div></div>`,
    ) +
    cell(
        'Buttons and a state',
        `<div class="fm-row">${button('Export')}${button('Add', 'kp-button--primary')}${PART.chip('Running').replace(RULES, '')}</div>`,
    ) +
    cell(
        'The account closed: a figure, a bar, a press',
        `<div class="fm-closed"><p class="fm-closed__line"><span>Balance carried forward</span>${carrier('1 284,00', '', 'data-fm-still')}</p>${share(1, 'Export')}<div class="fm-row">${button('Approve', 'fm-press fm-pointed-press fm-static')}</div></div>`,
    ) +
    cell(
        'Today and the picked day in a month',
        `<div class="fm-days fm-days--today">${[12, 13, 14, 15].map((d) => `<span class="fm-day${d === 14 ? ' fm-today' : ''}${d === 13 ? ' fm-picked' : ''}">${d}</span>`).join('')}</div>`,
    ) +
    cell('A meter past its end, with its ribbon', meter(1, 0.8, 'data-kp-over'));

const CORNERS = () =>
    cell('Card', PART.tileStill()) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpiStill('Flow now', '412')}</div>`) +
    cell(
        'Button, tag, chip and status dot',
        `<div class="fm-row">${button('Export')}<span class="kp-badge fm-tag">12 new</span><span class="kp-tag fm-chip">Pumps</span><span class="fm-state"><span class="fm-state__dot" aria-hidden="true"></span>Running</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip fm-tip" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell(
        'A rule with its plate, and a stamp',
        `<div class="fm-ruleplate"><span class="fm-ruleplate__rule"></span>${note('0.4 bar', 'down', 'bad')}</div><span class="fm-stamp fm-if-today">Checked</span>`,
    ) +
    cell('Meter', meter(0.62, 0.8));

const SURFACE = () =>
    cell(
        'A heading',
        `<div class="fm-heading"><h3 class="fm-heading__title">Accounts received</h3><p class="fm-heading__sub">Minute 14, carried</p></div>`,
    ) +
    cell(
        'Tabular figures',
        `<div class="fm-figures">${[
            ['Receipts', '1 284,00'],
            ['Payments', '917,50'],
            ['Balance', '366,50'],
        ]
            .map(([l, f]) => `<div class="fm-figures__row"><span>${l}</span><b>${f}</b></div>`)
            .join('')}</div>`,
    ) +
    cell(
        'A chart',
        `<div class="fm-plot"><svg viewBox="0 0 160 64" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,48 20,40 40,44 60,28 80,34 100,18 120,24 140,12 160,14" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>`,
    ) +
    cell(
        'An empty state',
        `<div class="kp-empty fm-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell(
        'A card, a tile and a menu',
        `<div class="fm-plain">${PART.tileStill('Pump house 1', '4.2 bar')}${PART.menuStatic(['Open incident', 'Assign to…'], '', false)}</div>`,
    ) +
    cell('A certificate', `<div class="fm-cert"><span class="kp-kpi__label">Open</span><span class="fm-cert__num">38</span></div>`) +
    cell(
        'A dialog',
        `<div class="kp-dialog fm-dialog fm-static" role="group" aria-label="A dialog"><p class="kp-dialog__title fm-title">Close INC-4471?</p><p class="kp-dialog__description">The vendor is told at once.</p><div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div></div>`,
    );

const WARNING = () =>
    cell(
        'A key figure that needs attention',
        `<div class="kp-kpis"><div class="kp-kpi fm-kpi" data-kp-tone="warning"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">1.1 bar</span><span class="kp-kpi__trend">${note('0.4 bar', 'down', 'bad')} on yesterday</span></div></div>`,
    ) +
    cell(
        'A trend that failed',
        `<div class="kp-kpi fm-kpi fm-failed" data-kp-tone="destructive"><span class="kp-kpi__label">Pump house 3</span><span class="kp-kpi__value">no reading</span><span class="kp-kpi__trend">${note('failed', 'down', 'bad')} since 06:00</span><span class="fm-stamp fm-if-void">Void</span></div>`,
    ) +
    cell('A destructive menu entry', PART.menuStatic(['Open incident', 'Rename', 'Delete'], 'fm-warn-menu', false)) +
    cell(
        'A warning alert',
        `<div class="kp-alert kp-alert--warning" role="status"><span class="kp-alert__body">Pressure is below the limit at pump house 4.</span></div>`,
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card fm-tile fm-live-tile"><p class="kp-card__title fm-title">Pump house 2</p><p class="kp-card__body">${carrier('4.2 bar')}</p></div>`,
    );

const LOADERS = () =>
    cell(
        'A tile',
        waits('kp-card fm-tile', `<p class="kp-card__title fm-title fm-faint">Pump house 3</p><p class="kp-card__body fm-faint">Reading…</p>`),
    ) +
    cell(
        'A panel',
        waits('fm-table', `<span>Station</span><span>Flow</span><span class="fm-faint">North 4</span><span class="fm-faint">412</span>`),
    ) +
    cell(
        'A menu entry',
        `<div class="kp-popover fm-pop fm-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fm-waits" aria-busy="true">Loading stations…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Days of a month',
        `<div class="fm-days">${[1, 2, 3, 4, 5].map((d) => `<span class="fm-day fm-waits" style="--i: ${d - 1}">${d}${LOAD}</span>`).join('')}</div>`,
    ) +
    cell('A chart’s plot', waits('fm-plot fm-plot--empty', '')) +
    cell(
        'The skeleton’s lines',
        `<div class="fm-skel fm-waits" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span>${LOAD}</div>`,
    );

const BUSYBAR = () =>
    cell(
        'The busy bar at three sizes',
        `<div class="fm-sizes">${[
            ['small', 0.8],
            ['default', 1],
            ['large', 1.6],
        ]
            .map(
                ([name, scale]) =>
                    `<div class="fm-size"><span class="fm-size__name">${name}</span>${bar(`Busy, ${name}`, `fm-bar--${name}`, Number(scale))}</div>`,
            )
            .join('')}</div>`,
        'fm-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button fm-busy-button" aria-busy="true">Saving…${bar('Saving', 'fm-bar--inline')}</button>`,
    ) +
    cell(
        'Beside a share bar at 62 %',
        `<div class="fm-pair"><span class="fm-size__name">a share is known</span>${share(0.62, 'Export')}<span class="fm-size__name">no share yet</span>${bar('Waiting for the export')}</div>`,
    );

const SPINNERS = () =>
    cell('Three sizes', `<div class="fm-row fm-spins">${[1, 1.5, 2.5].map((s) => spinner(s)).join('')}</div>`, 'fm-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary fm-busy-button" aria-busy="true">${spinner(1).replace('role="status"', 'aria-hidden="true"')}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card fm-busy-panel">${spinner(1.75, 'Reading the pump houses')}<p class="kp-card__body">Reading the pump houses…</p></div>`,
    );

/** A part that arrives and leaves. */
const LEAVE = () =>
    cell('An alert', PART.alert()) +
    cell('A card', PART.tile('Reservoir North', 'Level 71 %')) +
    cell(
        'A key figure',
        `<div class="kp-kpis"><div class="kp-kpi fm-kpi fm-frame"><span class="kp-kpi__label fm-line" style="--i: 0">Flow now</span><span class="kp-kpi__value fm-line" style="--i: 1">412</span><span class="kp-kpi__trend fm-line" style="--i: 2">avg 15 min</span></div></div>`,
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="fm-row">${button('Export readings')}${button('Approve', 'kp-button--primary')}</div>`,
        'fm-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header fm-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title fm-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions fm-group">${button('Export', 'kp-button--sm fm-in-header')}${button('Add', 'kp-button--sm kp-button--primary fm-in-header')}</div></div></header>`,
        'fm-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'fm-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card fm-tile fm-in-tile"><p class="kp-card__title fm-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fm-tile-link" href="#fm-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card fm-drawer"><p class="kp-card__title fm-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="fm-row fm-group">${button('Skip', 'kp-button--sm kp-button--ghost')}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi fm-kpi fm-in-kpi" href="#fm-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="fm-row">${button('Export readings', 'fm-pointed')}${button('Approve', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card fm-tile fm-in-tile fm-pointed-tile"><p class="kp-card__title fm-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fm-tile-link fm-pointed" href="#fm-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis fm-kpi-row"><a class="kp-kpi fm-kpi fm-in-kpi fm-pointed" href="#fm-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi fm-kpi fm-in-kpi" href="#fm-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="fm-days">${[12, 13, 14, 15].map((d) => `<span class="fm-day${d === 13 ? ' fm-pointed' : ''}">${d}</span>`).join('')}</div>`,
    ) +
    cell(
        'A link in running text',
        `<p class="fm-prose">Read the <span class="fm-pointed"><a href="#fm-intro">annual report</a></span> before the meeting.</p>`,
    );

const FOCUS = () =>
    cell(
        'Button',
        `<div class="fm-row">${button('Export readings', 'fm-focused fm-pointed-focus fm-pointed')}${button('Approve', 'kp-button--primary')}</div>`,
    ) +
    cell('Header action', `<div class="fm-header-mini">${button('Export', 'kp-button--sm fm-in-header fm-focused fm-pointed-focus')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi fm-kpi fm-in-kpi fm-focused fm-pointed-focus" href="#fm-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover fm-pop fm-pop--static fm-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fm-focused fm-pointed-focus">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="fm-days"><span class="fm-day">13</span><span class="fm-day fm-focused fm-pointed-focus">14</span><span class="fm-day">15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card fm-tile fm-in-tile"><p class="kp-card__title fm-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fm-tile-link fm-focused fm-pointed-focus" href="#fm-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="fm-row">${button('Export readings', 'fm-press fm-pointed-press')}</div>`) +
    cell('Primary button', `<div class="fm-row">${button('Approve the minute', 'kp-button--primary fm-press fm-pointed-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover fm-pop fm-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fm-press fm-pointed-press">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="fm-days"><span class="fm-day fm-press fm-pointed-press">14</span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle fm-kpi fm-in-kpi fm-press fm-pointed-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card fm-type"><p class="fm-type__label">Northern network</p><p class="fm-type__head">Pump house 4</p>
        <p class="fm-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="fm-type__figure"><span class="fm-type__num">4.2</span> <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="fm-type__table"><tbody><tr><th scope="row">Flow</th><td class="fm-type__fig">412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr><tr><th scope="row">Station</th><td><span class="kp-id">PH-0004</span></td></tr></tbody></table>
        <p class="fm-type__ticks" aria-hidden="true"><span>06:00</span><span>09:00</span><span>12:00</span></p>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge fm-tag">12 new</span></p></div>`,
        'fm-part--wide',
    );

const MOTIFS = (/** @type {string} */ key) =>
    cell(
        'A rule under a figure, closed',
        `<p class="fm-closed__line"><span>Balance carried forward</span>${carrier('1 284,00', '', 'data-fm-still')}</p>`,
    ) +
    cell(
        'A heading and a dialog, framed by the double rule',
        `<div class="fm-heading"><h3 class="fm-heading__title">Accounts received</h3></div><div class="fm-cert fm-cert--small"><span class="kp-kpi__label">Open</span><span class="fm-cert__num">38</span></div>`,
    ) +
    cell('The docket cut: a divider and a bar’s track', `<hr class="fm-divider" />${share(0.62, 'Export')}`) +
    cell(
        'Red ink on an entry',
        `<div class="kp-kpis"><div class="kp-kpi fm-kpi" data-kp-tone="warning"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">1.1 bar</span></div></div>`,
    ) +
    cell('The meter keeps its ribbon', meter(0.62, 0.8)) +
    cell(
        'The state word and the busy table',
        `<div class="fm-seals"><span class="fm-state"><span class="fm-seal fm-if-seal" aria-hidden="true"></span><span class="fm-state__dot fm-if-rules" aria-hidden="true"></span><span class="fm-state__word">Running</span></span><div class="fm-panel"><span class="fm-seal fm-seal--big fm-if-seal" aria-hidden="true"></span><span class="fm-panel__words">Busy table</span></div></div>`,
    ) +
    (key === 'all'
        ? cell(
              'Stamps, a leader, a guilloche and laurels',
              `<div class="fm-all"><span class="fm-stamp">Received</span><span class="fm-leader" aria-hidden="true"></span><span class="fm-guilloche"><b>1 284</b></span><svg class="fm-laurel" viewBox="0 0 80 40" aria-hidden="true"><path d="M40 34 C22 34 8 24 6 8 M40 34 C58 34 72 24 74 8" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/><g fill="currentColor"><ellipse cx="42.5" cy="37.0" rx="4.4" ry="1.9" transform="rotate(-38 42.5 37.0)"/><ellipse cx="41.6" cy="30.7" rx="4.4" ry="1.9" transform="rotate(22 41.6 30.7)"/><ellipse cx="49.1" cy="34.8" rx="4.4" ry="1.9" transform="rotate(-60 49.1 34.8)"/><ellipse cx="45.9" cy="29.2" rx="4.4" ry="1.9" transform="rotate(0 45.9 29.2)"/><ellipse cx="54.3" cy="30.2" rx="4.4" ry="1.9" transform="rotate(-82 54.3 30.2)"/><ellipse cx="49.3" cy="26.3" rx="4.4" ry="1.9" transform="rotate(-22 49.3 26.3)"/><ellipse cx="57.5" cy="24.0" rx="4.4" ry="1.9" transform="rotate(-104 57.5 24.0)"/><ellipse cx="51.3" cy="22.3" rx="4.4" ry="1.9" transform="rotate(-44 51.3 22.3)"/><ellipse cx="58.1" cy="17.1" rx="4.4" ry="1.9" transform="rotate(-126 58.1 17.1)"/><ellipse cx="51.7" cy="17.8" rx="4.4" ry="1.9" transform="rotate(-66 51.7 17.8)"/><ellipse cx="56.1" cy="10.5" rx="4.4" ry="1.9" transform="rotate(-148 56.1 10.5)"/><ellipse cx="50.4" cy="13.5" rx="4.4" ry="1.9" transform="rotate(-88 50.4 13.5)"/><ellipse cx="51.7" cy="5.1" rx="4.4" ry="1.9" transform="rotate(-170 51.7 5.1)"/><ellipse cx="47.6" cy="10.0" rx="4.4" ry="1.9" transform="rotate(-110 47.6 10.0)"/><ellipse cx="37.5" cy="37.0" rx="4.4" ry="1.9" transform="rotate(-142 37.5 37.0)"/><ellipse cx="38.4" cy="30.7" rx="4.4" ry="1.9" transform="rotate(-202 38.4 30.7)"/><ellipse cx="30.9" cy="34.8" rx="4.4" ry="1.9" transform="rotate(-120 30.9 34.8)"/><ellipse cx="34.1" cy="29.2" rx="4.4" ry="1.9" transform="rotate(-180 34.1 29.2)"/><ellipse cx="25.7" cy="30.2" rx="4.4" ry="1.9" transform="rotate(-98 25.7 30.2)"/><ellipse cx="30.7" cy="26.3" rx="4.4" ry="1.9" transform="rotate(-158 30.7 26.3)"/><ellipse cx="22.5" cy="24.0" rx="4.4" ry="1.9" transform="rotate(-76 22.5 24.0)"/><ellipse cx="28.7" cy="22.3" rx="4.4" ry="1.9" transform="rotate(-136 28.7 22.3)"/><ellipse cx="21.9" cy="17.1" rx="4.4" ry="1.9" transform="rotate(-54 21.9 17.1)"/><ellipse cx="28.3" cy="17.8" rx="4.4" ry="1.9" transform="rotate(-114 28.3 17.8)"/><ellipse cx="23.9" cy="10.5" rx="4.4" ry="1.9" transform="rotate(-32 23.9 10.5)"/><ellipse cx="29.6" cy="13.5" rx="4.4" ry="1.9" transform="rotate(-92 29.6 13.5)"/><ellipse cx="28.3" cy="5.1" rx="4.4" ry="1.9" transform="rotate(-10 28.3 5.1)"/><ellipse cx="32.4" cy="10.0" rx="4.4" ry="1.9" transform="rotate(-70 32.4 10.0)"/></g></svg></div>`,
              'fm-if-all-part',
          )
        : '');

const SCENES = {
    moving: MOVING,
    direction: DIRECTION,
    opening: OPENING,
    durations: DURATION,
    colour: COLOUR,
    corners: CORNERS,
    surface: SURFACE,
    warning: WARNING,
    live: LIVE,
    loading: LOADERS,
    busybar: BUSYBAR,
    spinner: SPINNERS,
    leave: LEAVE,
    composites: COMPOSITES,
    hover: HOVER,
    focus: FOCUS,
    press: PRESS,
    type: TYPE,
    motifs: MOTIFS,
};

/** The designer's questions, each given the scene that draws its options. */
const ASPECTS = DATA.map((a) => ({ ...a, build: /** @type {(key: string) => string} */ (SCENES[/** @type {keyof typeof SCENES} */ (a.scene)]) }));

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question and the reason, then what this option shows
// and the recommendation line: the dialog shows only the hint of the option
// on screen, so each hint has to stand on its own.
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
lookLine.textContent = `${ASPECTS.length} questions, one rule of ${LABEL} each; the first option of every question is the recommendation. Pick the one that is ${THEME} to you, or “None of these” with a note.`;
look.append(lookLine);

// The story's three paragraphs are the designer's words.
for (const p of document.querySelectorAll('[data-fm-story]'))
    p.textContent = STORY[/** @type {keyof typeof STORY} */ (p.getAttribute('data-fm-story'))];
document.title = `kp-themes — ${TITLE.toLowerCase()}`;

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-fm-aspects]'));
const toc = document.querySelector('[data-fm-toc]');
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'fm-aspect';
    box.id = `fm-${a.id}`;
    box.setAttribute('data-fm-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-fm-${a.id}`);
    box.innerHTML = `<div class="fm-aspect__head">
        <h3 id="h-fm-${a.id}"><span class="fm-aspect__no">${n + 1}</span> ${a.label} <span class="fm-aspect__rule">${a.rule}</span></h3>
        <p class="fm-aspect__q"></p><p class="fm-aspect__why"></p></div><div class="fm-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.fm-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.fm-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.fm-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'fm-col';
        col.setAttribute('data-fm-option', String(at + 1));
        col.innerHTML = `<p class="fm-label"><span class="fm-label__no">${at + 1}</span> <span class="fm-label__name"></span>${
            at === 0 ? ' <span class="fm-label__rec">Recommended</span>' : ''
        }</p><p class="fm-see"></p><p class="fm-verdict"></p>
        <div class="fm-scene" data-fm-kind="${a.kind}" data-fm-${a.id}="${o.key}" data-fm-phase="hold">${a.build(o.key)}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.fm-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.fm-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.fm-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('fm-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#fm-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays: contact, rule, stagger, loop).
const BANDS = {
    ruling: [180, 400, 60, 2400],
    brisk: [120, 240, 40, 1600],
    unhurried: [240, 700, 90, 3600],
};
for (const scene of section.querySelectorAll('[data-fm-durations]')) {
    const [contact, rule, stagger, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-fm-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-fm-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms`);
    say('dialog', `3 rules: ${rule + 2 * stagger} ms (${rule} + ${stagger} apart)`);
    say('menu', `6 rules: ${rule + 5 * stagger} ms (${rule} + ${stagger} apart)`);
    say('figure', `${Math.round(rule * 1.4)} ms (the rule, then the second)`);
    say('loop', `${loop} ms a pass`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, updates or leaves is replayed by one
// clock, so the options of a row always start together and can be compared.
// One cycle: `gap` (what is ruled in is away), `in` (T: it is ruled in, a
// value updates), `hold` (it stands), `out` (T: it is ruled off, as the
// arrival played backwards: what was ruled last is lifted first). T is the
// grammar's --fm-T (grammar.css); the CSS keys every motion to the phases and
// mirrors every delay inside T, the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-fm-motion]');
let slow = 1;
const T = parseFloat(getComputedStyle(/** @type {HTMLElement} */ (section.querySelector('.fm-scene'))).getPropertyValue('--fm-T')) || 1400;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', T],
    ['hold', 1500],
    ['out', T],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.fm-scene[data-fm-kind="cycle"]')) scene.setAttribute('data-fm-phase', phase);
    if (phase === 'in') {
        tick += 1;
        const set = (/** @type {Element} */ el, /** @type {string} */ text) => {
            el.textContent = text;
            el.setAttribute('data-fm-text', text);
        };
        for (const num of section.querySelectorAll('.fm-scene[data-fm-kind="cycle"] [data-fm-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) set(num, tick % 2 ? '4.4 bar' : '4.2 bar');
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) set(num, values[tick % values.length]);
            else if (/^\d+$/.test(text.trim())) set(num, String(30 + ((tick * 7) % 20)));
        }
        for (const word of section.querySelectorAll('.fm-scene[data-fm-kind="cycle"] [data-fm-word]')) set(word, tick % 2 ? 'Draining' : 'Running');
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
radio('data-fm-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--fm-slow', String(slow));
    run(0);
});

// A State button gives every control of the composites, hover, focus and press
// scenes the pose class its state draws (the review dialog uses the same
// classes for the pointer it plays), and takes it away again at Rest.
const FORCE = /** @type {Record<string, string[]>} */ ({
    hover: ['fm-pointed'],
    focus: ['fm-focused', 'fm-pointed-focus'],
    press: ['fm-press', 'fm-pointed-press'],
});
function force(/** @type {string} */ value) {
    for (const el of section.querySelectorAll('[data-fm-forced]')) {
        el.classList.remove(...(el.getAttribute('data-fm-forced') || '').split(' '));
        el.removeAttribute('data-fm-forced');
    }
    for (const scene of section.querySelectorAll('.fm-scene:is([data-fm-composites], [data-fm-hover], [data-fm-focus], [data-fm-press])'))
        for (const el of scene.querySelectorAll('.kp-button, .kp-menu__item, .fm-in-kpi, .fm-day')) {
            const add = (FORCE[value] || []).filter((c) => !el.classList.contains(c));
            if (!add.length) continue;
            el.classList.add(...add);
            el.setAttribute('data-fm-forced', add.join(' '));
        }
}
radio('data-fm-state', (value) => {
    section.setAttribute('data-fm-show', value);
    force(value);
});
document.querySelector('[data-fm-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.fm-scene a, .fm-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided formal components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=formal`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-fm-gallery]'));
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
