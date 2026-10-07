// What makes synthwave synthwave (Kenny, 2026-10-07 04:23: the themes one by
// one, "cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint"), the
// same way as titanium, forest, nostromo and cyberpunk (02:54: "waar jij eerst
// uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet").
//
// A review-kit demo in aspect mode, synthwave only. Each ASPECT is one rule of
// the theme's grammar (themes/synthwave/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-sy-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The stripe along a panel's top (G6, G7): its own element, so it can strike on (G3). */
const STRIP = `<span class="sy-strip" aria-hidden="true"></span>`;

/** The grid floor under a reporting plate's horizon (G7); options.css shows it per option. */
const FLOOR = `<span class="sy-floor" aria-hidden="true"></span>`;

/** The neon ring of a tone (G13) and the other tone drawings an option may show. */
const RING = `<span class="sy-ring" aria-hidden="true"></span>`;

/** Every loading picture an option may draw over a waiting part; options.css shows one. */
const LOAD = `<span class="sy-load" aria-hidden="true"><span class="sy-bulbs"></span><span class="sy-dash"></span><span class="sy-roll"></span></span>`;

/** The sun cut a part may hold when pressed (G14, option 3); a button has the register's own. */
const SLITS = `<span class="sy-slits" aria-hidden="true"></span>`;

/** The change on a 2 px chip with the package's arrows. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta sy-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/**
 * A part that rises over its horizon and sets behind it (G3, G12): the body,
 * the sun's stripes it passes through (bars in the ground's colour, fixed
 * above the horizon, closing as it rises), then its horizon line.
 */
const rise = (html, cls = '') =>
    `<div class="sy-rise ${cls}">${html}<span class="sy-cuts" aria-hidden="true"></span><span class="sy-horizon" aria-hidden="true"></span></div>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter sy-meter" role="meter" aria-label="Signal, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** The chart's grid floor horizon: a sky over the floor, a neon line, cyan ticks. */
const plot = (cls = '', extra = '') => `<div class="sy-plot ${cls}" aria-hidden="true">${FLOOR}<svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="sy-plot__trace" points="0,30 20,26 40,28 60,18 80,22 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1"/></svg>${extra}<span class="sy-plot__read">▶ FLOW 412</span></div>`;

const PART = {
    dialog: () =>
        rise(
            `<div class="kp-dialog sy-dialog sy-panel" role="group" aria-label="A dialog opening">${STRIP}
        <p class="kp-dialog__title sy-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
            'sy-opens',
        ),
    menu: () => `<div class="sy-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${rise(
            `<div class="kp-popover sy-pop sy-panel">${STRIP}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'sy-opens sy-pop-wrap',
        )}
    </div>`,
    tile: (label = 'Node 01', body = '4.2 Gb/s · 12 ms', cls = 'sy-arrives') =>
        rise(
            `<div class="kp-card sy-plate sy-tile">${STRIP}${FLOOR}
        <p class="kp-card__title sy-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
            cls,
        ),
    plainTile: (label = 'Node 01', body = 'Uplink 71 %', cls = '') =>
        `<div class="kp-card sy-plate sy-tile ${cls}">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Traffic now', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi sy-plate sy-kpi ${cls}" ${extra}>${STRIP}${FLOOR}
        <span class="kp-kpi__label sy-label">${label}</span>
        <span class="kp-kpi__value sy-figure sy-carrier" data-sy-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    tracks: () => `<div class="sy-tracks" aria-hidden="true">
        <span class="sy-groove"><span class="sy-track" style="--to: 72%"></span></span>
        <span class="sy-groove"><span class="sy-track" style="--to: 48%"></span></span>
        <span class="sy-groove"><span class="sy-track" style="--to: 88%"></span></span>
    </div>`,
    bulbRow: () => `<div class="sy-bulb-row" aria-hidden="true">${LOAD}</div>`,
    days: (n = 7, from = 12) =>
        `<div class="sy-days sy-week" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="sy-day sy-arrives" style="--i: ${i}"><span class="sy-day__num">${from + i}</span></span>`)
            .join('')}<span class="sy-horizon sy-horizon--week"></span></div>`,
    rows: () =>
        `<div class="sy-rows" aria-hidden="true">${['NODE 01 · 412', 'NODE 02 · 398', 'NODE 03 · 451']
            .map((t, i) => `<span class="sy-row-line sy-arrives" style="--i: ${i}">▶ ${t}</span>`)
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="sy-state" data-sy-kind="${kind}">${RING}<span class="sy-state__dot sy-carrier sy-carrier--dot" aria-hidden="true"></span><span class="sy-state__word sy-carrier" data-sy-word>${word}</span></span>`,
    alert: (text = 'Node 04 is back online.') => `<div class="kp-alert sy-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="sy-spark-wrap"><span class="kp-kpi__label sy-label">Traffic, 24 h</span><span class="sy-spark sy-carrier sy-carrier--line" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span></div>`,
    column: (label = 'Open', value = '38') =>
        `<div class="sy-column"><span class="kp-kpi__label sy-label">${label}</span><span class="sy-column__num sy-figure sy-carrier" data-sy-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="sy-skel" aria-hidden="true">${[0, 1, 2]
            .map((i) => `<span class="sy-skel__line" style="--i: ${i}"><span class="kp-skeleton"></span>${LOAD}</span>`)
            .join('')}</div>`,
    bar: (label = 'Sync busy') =>
        `<div class="kp-progressbar sy-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    field: () =>
        `<label class="kp-field sy-field"><span class="kp-field__label">Node</span><input class="kp-field__input" value="North 01" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover sy-pop sy-pop--static sy-panel ${cls}">${STRIP}<ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' sy-pointed' : ''}">${SLITS}<span class="sy-entry">${t}</span></button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="sy-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="sy-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three readouts fill to their mark', PART.tracks(), 'sy-part--wide') +
    cell('A row of bulbs (light, not a body)', PART.bulbRow(), 'sy-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'sy-part--wide') +
    cell('A list of readings is printed', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn on a plot', plot('sy-walk'));

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card sy-plate sy-tile sy-waits" aria-busy="true">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 02</p><p class="kp-card__body sy-faint">Reading…</p>${LOAD}</div>`;

const DURATION = () =>
    cell('Contact: a press', `<div class="sy-row">${button('Export readings', 'sy-tap')}</div><p class="sy-readout" data-sy-readout="contact"></p>`) +
    cell('Opening: a dialog rises', PART.dialog() + '<p class="sy-readout" data-sy-readout="open"></p>') +
    cell(
        'A live change: the laser under a figure',
        `<div class="kp-kpis">${PART.kpi('Packets', '18 240')}</div><p class="sy-readout" data-sy-readout="live"></p>`,
    ) +
    cell('A loop: a tile waits', `${waitingTile()}<p class="sy-readout" data-sy-readout="loop"></p>`);

const warnKpi = () =>
    PART.kpi('Latency', '81 ms', chip('12 ms', 'down', 'bad'), 'sy-warn', 'data-sy-kind="warn"').replace(
        '<span class="kp-kpi__label sy-label">',
        `<span class="kp-kpi__label sy-label">${RING}`,
    );

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="sy-row">${button('Export', 'sy-pointed sy-act')}${button('Drive', 'kp-button--primary')}${PART.state('Running')}</div>`,
    ) +
    cell('A plot and its reading', plot()) +
    cell(
        'Key figures, a warning among them',
        `<div class="kp-kpis sy-kpi-row">${PART.kpi('Traffic now', '412')}${warnKpi()}</div>`,
        'sy-part--wide',
    ) +
    cell('A heading and its rule', `<p class="sy-heading">Night log</p><span class="sy-rule" aria-hidden="true"></span>`) +
    cell(
        'A link and the picked day',
        `<p class="sy-prose">See the <a href="#sy-intro">night log</a> for details.</p><div class="sy-days sy-days--pick">${[12, 13, 14, 15]
            .map((d) => `<span class="sy-day${d === 13 ? ' sy-picked' : ''}"><span class="sy-day__num">${d}</span></span>`)
            .join('')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8));

const CORNERS = () =>
    cell('Card', PART.plainTile()) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Traffic now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="sy-row">${button('Export')}<span class="kp-badge sy-tagged">12 new</span><span class="kp-tag sy-chip2">Nodes</span>${chip('6 %')}</div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip sy-tip" role="tooltip">14:00 · 412 Gb</div>`) +
    cell(
        'A dialog',
        `<div class="kp-dialog sy-dialog sy-panel" role="group" aria-label="A dialog">${STRIP}<p class="kp-dialog__title sy-title">Close INC-4471?</p><p class="kp-dialog__description">The vendor is told at once.</p></div>`,
    );

const SURFACE = () =>
    cell('Card', PART.plainTile()) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Packets', '18 240')}</div>`) +
    cell('The plot of a chart', plot()) +
    cell('Meter', meter(0.62, 0.8)) +
    cell(
        'Buttons and a tag',
        `<div class="sy-row">${button('Export')}${button('Drive', 'kp-button--primary')}<span class="kp-badge sy-tagged">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

/** The tone scene replays only the tone; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-sy-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis sy-kpi-row">${PART.kpi('Traffic now', '412')}${warnKpi()}</div>`,
            'sy-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card sy-plate sy-tile sy-bad" data-sy-kind="bad">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${RING}<span class="sy-toned">Node 03</span></p><p class="kp-card__body">No signal since 06:40</p></div>`,
            ) +
            cell('A failed state', PART.state('Failed', 'bad')) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive sy-bad" data-sy-kind="bad">${RING}<span class="sy-toned">Delete</span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="sy-meter-wrap sy-warn" data-sy-kind="warn">${RING}${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its light', PART.state('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card sy-plate sy-tile sy-live-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 02</p><p class="kp-card__body"><span class="sy-carrier sy-carrier--body" data-sy-num>4.2 Gb/s</span></p></div>`,
    );

const LOADERS = () =>
    cell('The progress bar itself, busy (the road)', PART.bar('Sync busy'), 'sy-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi sy-waits" aria-busy="true">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Packets today</span><span class="kp-kpi__value sy-figure sy-faint">18 240</span><span class="kp-kpi__trend sy-faint">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="sy-table sy-plate sy-waits" aria-busy="true">${STRIP}<span>Node</span><span>Traffic</span><span class="sy-faint">North 01</span><span class="sy-faint">412</span>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-waits" aria-busy="true">Loading nodes…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="sy-days sy-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="sy-day sy-waits" style="--i: ${d - 1}"><span class="sy-day__num">${d}</span>${LOAD}</span>`)
            .join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="sy-plot sy-plot--wait sy-waits" aria-busy="true">${FLOOR}${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="sy-meter-wait sy-waits" aria-busy="true">${meter(0.62, 0.8, 'data-kp-loading')}${LOAD}</div>`);

/** One spinner in three drawings; options.css shows the option's. */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="sy-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--sy-spin: ${size}"` : ''
    }><span class="kp-spinner sy-spin__sun"></span><span class="sy-spin__ring"></span><span class="sy-spin__road"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="sy-row sy-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'sy-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary sy-busy-button" aria-busy="true">${spin('', '', true)}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card sy-plate sy-busy-panel">${STRIP}${FLOOR}${spin('2rem', 'Reading the nodes')}<p class="kp-card__body">Reading the nodes…</p></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => rise(`<div class="sy-leaver__body">${html}<span class="sy-sun-over" aria-hidden="true"></span></div>`, 'sy-leaver');
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.plainTile())) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></div></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="sy-row">${button('Export readings')}${button('Drive', 'kp-button--primary')}</div>`,
        'sy-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header sy-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title sy-title">Nodes</p><p class="kp-page-header__description">Fifteen on the northern grid.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm sy-in-header')}${button('Add', 'kp-button--sm kp-button--primary sy-in-header')}</div></div></header>`,
        'sy-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'sy-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card sy-plate sy-tile sy-in-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 01</p><a class="kp-button kp-button--ghost kp-button--sm sy-tile-link" href="#sy-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card sy-plate sy-drawer">${STRIP}<p class="kp-card__title sy-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="sy-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost',
        )}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi sy-plate sy-kpi sy-in-kpi" href="#sy-intro">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="sy-row">${button('Export readings', 'sy-pointed')}${button('Drive', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card sy-plate sy-tile sy-pointed-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 01</p><a class="kp-button kp-button--ghost kp-button--sm sy-tile-link sy-pointed" href="#sy-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis sy-kpi-row"><a class="kp-kpi sy-plate sy-kpi sy-pointed" href="#sy-intro">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></a><a class="kp-kpi sy-plate sy-kpi" href="#sy-intro">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Latency</span><span class="kp-kpi__value sy-figure">31</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="sy-days">${[12, 13, 14, 15]
            .map((d) => `<span class="sy-day${d === 13 ? ' sy-pointed' : ''}"><span class="sy-day__num">${d}</span></span>`)
            .join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="sy-row">${button('Export readings', 'sy-focused')}</div>`) +
    cell('Header action', `<div class="sy-header-mini">${button('Export', 'kp-button--sm sy-in-header sy-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi sy-plate sy-kpi sy-in-kpi sy-focused" href="#sy-intro">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel sy-in-menu">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-focused"><span class="sy-entry">Assign to…</span></button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item"><span class="sy-entry">Rename</span></button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="sy-days"><span class="sy-day"><span class="sy-day__num">13</span></span><span class="sy-day sy-focused"><span class="sy-day__num">14</span></span><span class="sy-day"><span class="sy-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card sy-plate sy-tile sy-in-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 01</p><a class="kp-button kp-button--ghost kp-button--sm sy-tile-link sy-focused" href="#sy-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="sy-row">${button('Export readings', 'sy-press')}</div>`) +
    cell('Primary button', `<div class="sy-row">${button('Drive', 'kp-button--primary sy-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-press">${SLITS}<span class="sy-entry">Assign to…</span></button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="sy-days"><span class="sy-day sy-press">${SLITS}<span class="sy-day__num">14</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle sy-plate sy-kpi sy-press" aria-pressed="false">${STRIP}${FLOOR}${SLITS}<span class="kp-kpi__label sy-label">Open incidents</span><span class="kp-kpi__value sy-figure">3</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="sy-row"><button type="button" class="sy-key sy-press" aria-pressed="false">${SLITS}<span class="sy-key__swatch" aria-hidden="true"></span>Node 01</button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card sy-plate sy-type">${STRIP}<p class="sy-type__label">Northern grid</p><p class="sy-type__head">Node 04</p>
        <p class="sy-type__prose">Latency rose after the night relay switched; the crew checks it at 07:30.</p>
        <p class="sy-type__figure"><span class="sy-figure">81</span> <small>ms</small> ${chip('12 ms', 'down', 'bad')}</p>
        <div class="sy-type__strip">${[
            ['Traffic', '412'],
            ['Packets', '18 240'],
            ['Nodes', '15'],
        ]
            .map(([l, v]) => `<div><span class="sy-label">${l}</span><span class="sy-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="sy-type__table"><tbody><tr><th scope="row">Traffic</th><td>412 Gb/s</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp sy-stamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge sy-tagged">12 new</span></p></div>`,
        'sy-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events on a plot',
        plot(
            'sy-events',
            '<span class="sy-events__mark" style="--x: 37.5%; --y: 52%"></span><span class="sy-events__mark" style="--x: 75%; --y: 42%"></span>',
        ),
    ) +
    cell('Card', PART.plainTile('Node 01', 'Uplink 71 %', 'sy-motif-card')) +
    cell(
        'Button and a list',
        `<div class="sy-row">${button('Log a reading', 'sy-motif-button')}</div><ul class="sy-motif-list"><li><span class="sy-label">North 01</span></li><li><span class="sy-label">South 02</span></li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty sy-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="sy-cap">Nodes</p><div class="sy-divider" data-kp-divider></div><p class="sy-cap">Links</p>`);

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, update, leave), 'loop' scenes loop in CSS, 'still'
 * scenes do not move. `options[0]` is the recommendation.
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: () => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'How does synthwave move: bodies on a slow sunrise curve with light that switches, on its register’s quick curve, or on a spring?',
        why: 'A theme exists to be distinct (your rule of 03:37). Synthwave’s register curve, cubic-bezier(0.2, 0.9, 0.2, 1), is cyberpunk’s register exactly and almost titanium’s decided curve; your arrival family runs on titanium’s curve exactly; the meter, the chart and the tiles overshoot on springs, which is pastel’s curve. No theme moves on a symmetric S yet.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'sunrise',
                name: 'Bodies on the sunrise curve; light switches',
                see: 'Every part that moves starts slowly, glides and lands slowly, like the sun clearing the horizon: the readouts fill to their mark, the dialog, the menu and the tile rise over their horizon. Light does not move: the bulbs jump from one to the next in hard steps, the laser under the figure is drawn and goes out.',
                verdict: rec(
                    'it is calm and cinematic, the speed of a night drive, and no other theme moves on this curve; the hard steps belong only to light, as bulbs and neon tubes really switch.',
                ),
            },
            {
                key: 'quick',
                name: 'The register’s quick curve (cyberpunk’s, nearly titanium’s)',
                see: 'Everything on cubic-bezier(0.2, 0.9, 0.2, 1): the readouts shoot to their mark and settle, the panels rise and fade in fast, the bulbs’ light slides from one to the next.',
                verdict: not(
                    'it is lively and modern, but it is cyberpunk’s register curve to the decimal and almost titanium’s: synthwave would move like its neighbours.',
                ),
            },
            {
                key: 'spring',
                name: 'On a spring (the meter’s and the chart’s picks; pastel’s curve)',
                see: 'Everything overshoots and comes back: the readouts shoot past their mark, the panels pop up past their place, as the meter’s Overdrive and the chart’s rise do today.',
                verdict: not('it is playful, but a bounce is pastel’s curve, and a sunset does not bounce.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion go when something arrives or is drawn?',
        why: 'The anatomy: “cyberpunk is diagonal and day; synthwave is horizontal and night.” Six of your picks already rise from a line (the trend, the calendar, the chart, the header’s menu, the dialog, the toast). Today the strip drops in from above, the size change races its rows in from the left at a slant, the drawer slides in from the right.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'horizon',
                name: 'Rise over the horizon; light along a line',
                see: 'The week’s horizon is drawn from its centre out, then the days rise over it one after another; the list rises row by row; the tile rises over its own horizon; the line is drawn left to right.',
                verdict: rec('it is your arrival family on every part, and a world with a horizon only ever rises and sets.'),
            },
            {
                key: 'race',
                name: 'Race in from the start (your size-change pick; near titanium’s feed)',
                see: 'Everything races in from the left, leaning into the speed (skewed −18°), as new rows do in your size change.',
                verdict: not(
                    'it has speed, the outrun feeling, but it is diagonal, which is cyberpunk’s, and one direction for everything is titanium’s feed.',
                ),
            },
            {
                key: 'drop',
                name: 'Down from the top (the strip’s pick)',
                see: 'Everything drops in from above in four hard steps, as the strip’s columns do today.',
                verdict: not('it is clear and quick, but on a horizon nothing falls from the sky.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Your arrival family is the trend’s Over the horizon; the toast, the dialog and the header’s menu already rise from their foot. Your menu pick, Neon strikes, puts the panel there at once and flickers its rim on pink and cyan; that strike is close to cyberpunk’s trend pick “The neon strikes” and to nostromo’s tube that strikes on.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'rise',
                name: 'Over the horizon, its stripe striking on',
                see: 'A pink horizon line is drawn from the panel’s centre outward along its foot; the panel rises from behind it, cut by the sun’s stripes that close as it rises, and its top stripe strikes on with a neon tube’s dips: 2 beats (450 ms). Closing sets it back behind the line.',
                verdict: rec(
                    'it is your arrival family on every panel with your menu’s strike kept as the light, and no other theme opens over a neon horizon.',
                ),
            },
            {
                key: 'strike',
                name: 'Neon strikes: there at once (your menu pick; cyberpunk’s and nostromo’s strike)',
                see: 'The panel is there in one frame; its rim and stripe strike on pink, cyan, pink, cyan in hard steps (340 ms).',
                verdict: not(
                    'it is your menu pick and very neon, but nothing arrives, and a strike on its own is cyberpunk’s trend pick and nostromo’s tube.',
                ),
            },
            {
                key: 'tape',
                name: 'Tape loads: cut from the top in steps (titanium’s cut)',
                see: 'The panel is uncovered from its top edge down in four hard steps (320 ms).',
                verdict: not('clear and quick, but uncovering from the top is titanium’s opening; the steps alone do not make it synthwave.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does a contact, an opening, a live change and a loading loop take?',
        why: 'The recommended times count beats of 225 ms: one step of your marquee (900 ms in four) and the register’s own contact (220 ms). Today synthwave runs at twenty-three one-shot durations and ten loop periods, from 220 ms to the dialog’s 2880 ms (your quarter speed).',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'beats',
                name: 'Beats: 225 · 450 · 675 · 900 ms',
                see: 'A press answers in 1 beat; the dialog rises in 2; the laser is drawn and burns down in 3; the marquee chases round in 4.',
                verdict: rec('every number is a whole count of your marquee’s beat, so the page keeps one tempo, unhurried without being slow.'),
            },
            {
                key: 'slow',
                name: 'Slow, as your slowest picks: 360 · 2880 · 900 · 2600 ms',
                see: 'A press takes the sun cut’s 360 ms; the dialog rises at your quarter speed (2.9 s); the change takes the trend’s 900 ms; the loop the skeleton’s 2.6 s.',
                verdict: not(
                    'the dialog at a quarter speed is beautiful once, but a menu or a dialog that takes three seconds is in the way every day.',
                ),
            },
            {
                key: 'brisk',
                name: 'Brisk: 150 · 300 · 450 · 600 ms',
                see: 'Everything a third faster: a press in 150 ms, the dialog in 300, the laser in 450, the marquee round in 600.',
                verdict: not('it feels quick, but the sunrise becomes a pop and the marquee a flicker; synthwave is the unhurried night.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be pink, what cyan, what laser yellow?',
        why: 'The anatomy of 5.0.0: pink signals, cyan labels, laser yellow warns, “the three never trade places”; lavender text, never pure white. Today the header’s actions are cyan (cyan acts), the calendar picks a day in cyan, the menu presses in cyan, the heading’s rule is laser yellow, and the busy panel mixes white into its bevel.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'roles',
                name: 'Pink acts and signals, cyan reads, laser warns',
                see: 'Pink on what you do and on what signals: the primary button, the pointed button’s glow, the picked day, the link’s stripe, the heading’s laser. Cyan on what the system reads out: the plot’s ticks, the reading, the ▶ before a label. Laser yellow only on the warning, with its ring. Green only in the state light.',
                verdict: rec('every colour has one job, as the anatomy says, and the warning is the only yellow on the page, so it is seen at once.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s cyan-framed action, the picked day in cyan, the heading’s rule in laser yellow beside a warning in laser yellow, the plot’s reading in pink.',
                verdict: not('cyan acts in two places and yellow decorates a heading, so neither colour means one thing any more.'),
            },
            {
                key: 'pink',
                name: 'One neon: pink for everything',
                see: 'Pink acts, reads and labels: the ticks, the reading, the ▶, the picked day and the link all pink; the warning still laser.',
                verdict: not('it is bold, but the system’s voice and yours become one colour, and the page loses its second neon.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners does synthwave have?',
        why: 'The anatomy says the radius is 2 px, every cut horizontal, nothing notched. Your picks round the tiles and the key figure 0.4 rem, the calendar’s days 10 px, the strip 6 and 4 px, and draw pills for the header’s actions and the strip’s change. A soft corner of 0.3 to 0.4 rem is cyberpunk’s holo and close to dark’s 6 px; pills are light’s and pastel’s.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'square',
                name: 'Square panels, 2 px controls',
                see: 'The card, the menu panel, the key figure and the dialog are square and carry the stripe along their top; the button, the tag, the chip and the tooltip take the 2 px corner.',
                verdict: rec(
                    'it is the anatomy, every part already wears it, and the theme’s cut stays the horizontal one: the stripe and the sun’s slits.',
                ),
            },
            {
                key: 'soft',
                name: 'The marquee’s 0.4 rem on everything (cyberpunk’s holo, near dark’s)',
                see: 'Every part rounded 0.4 rem, as your tiles and key figure draw it.',
                verdict: not('it is friendly and close to your tiles, but a soft corner is cyberpunk’s holo card and near dark’s.'),
            },
            {
                key: 'pill',
                name: 'Pills for the small parts (light’s and pastel’s)',
                see: 'Panels square; the button, the tag, the chip and the tooltip end in round pills, as the header’s actions and the strip’s change do.',
                verdict: not('a neon tube does have round ends, but pills are light’s and pastel’s, and they soften the horizon.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is a plate in synthwave?',
        why: 'Your shape family is the busy table’s Chrome over the grid: a flat 10 px crossing grid in pink on every plate, a bevel, mono words. A flat square grid is dark’s oscilloscope (12 px) and cyberpunk’s circuit (14 px, its hover family); the glowing pink rims of your tiles, key figure and header are cyberpunk’s holo card. Synthwave’s own grid is the floor that runs to a horizon, as your chart, trend and graph draw it.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'floor',
                name: 'Chrome over the floor',
                see: 'The card and the key figure: the tape with the pink to cyan stripe along the top, a chrome bevel, and in their lower part the grid floor running to a pink horizon, faded before the words. The chart’s plot is sky over the floor. Buttons and the field stay the register’s neon controls; only tubes glow.',
                verdict: rec(
                    'it keeps your chrome and your grid, makes the grid the floor every synthwave poster has, and takes neither dark’s scope nor cyberpunk’s circuit.',
                ),
            },
            {
                key: 'grid',
                name: 'Chrome over the grid as picked (dark’s scope grid, cyberpunk’s circuit)',
                see: 'Every plate ruled with a flat 10 px crossing grid in pink at 20 %, the bevel lit above and shaded below, 0.2 rem corners, the heads in mono.',
                verdict: not('it is your shape pick exactly, but a flat square grid on a dark plate is dark’s oscilloscope and cyberpunk’s circuit.'),
            },
            {
                key: 'rim',
                name: 'The marquee rim (cyberpunk’s holo card)',
                see: 'Every plate in a 2 px pink frame glowing 12 px, 0.4 rem corners, as your tiles, key figure and header draw it today.',
                verdict: not(
                    'it is neon and loud, but a glowing rim on every plate is cyberpunk’s holo card, the look cyberpunk’s analysis warned synthwave off.',
                ),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show?',
        why: 'Your tone family is the tiles’ neon spotlight ring: the mark becomes a hollow neon ring with a near-white core and the tone’s glow, and the title glows in the tone. Today the key figure and the trend put the figure on its tone’s plate (the trend’s flashing “as an arcade score”), the menu lays a red ground and line, the meter bumps, the busy panel draws a red line, the strip a cyan pill.',
        kind: 'cycle',
        scene: TONE,
        options: [
            {
                key: 'ring',
                name: 'The neon ring, the words in the tone',
                see: 'A hollow neon ring before the title or figure, a near-white core with the tone’s bloom (laser for a warning, red for a failure); the title or figure glows in the tone. The ring strikes on once with a tube’s dips, then holds.',
                verdict: rec(
                    'it is your tone family on every part, it reads at once without moving anything, and no other theme marks a tone with a neon ring.',
                ),
            },
            {
                key: 'plate',
                name: 'The arcade warning (the key figure’s, the trend’s and the menu’s picks)',
                see: 'The figure or the word on its tone’s plate, flashing three times as the warning arrives, the menu entry on a red ground with a red line, the meter bumping.',
                verdict: not('it is loud and arcade, but a flashing plate and a bump move or blink the part, and the plates differ per component.'),
            },
            {
                key: 'frame',
                name: 'The full neon frame (the busy panel’s grid fault; nostromo’s klaxon)',
                see: 'The whole part framed 2 px in its tone with a glow.',
                verdict: not('it reads from across the room, but a full frame is nostromo’s klaxon and a glowing rim cyberpunk’s holo.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update on every carrier',
        rule: 'G9',
        question: 'How does a value that changes in place show it changed?',
        why: 'Your live family is the key figure’s The laser flares: the digits’ pink glow flares and burns down. Drawn as a glow on the digits it is dark’s live family, “The trace flares”, almost exactly (the state light flares brightness 2, dark’s 2.2). Today the tile jumps, the strip’s figure flips, and the package marks no change at all.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'laser',
                name: 'The laser drawn under it',
                see: 'Under the value a laser line, a near-white core with a pink bloom, is drawn from its centre outward, flares and burns down (675 ms); under the state light and the trend line too. The value itself never moves, flips or glows.',
                verdict: rec(
                    'it is your laser and its flare, drawn as the theme’s horizontal line; the new value stays sharp, and no other theme marks a change with a line from its centre.',
                ),
            },
            {
                key: 'flare',
                name: 'The laser flares on the digits (your pick as drawn; dark’s trace flares)',
                see: 'The figure’s and the word’s pink glow flares to full and burns down over half a second; the light and the line flare their glow.',
                verdict: not(
                    'it is your pick exactly and warm, but it is dark’s live family almost to the value, and a glowing figure is harder to read for that half second.',
                ),
            },
            {
                key: 'mix',
                name: 'As the components play it today',
                see: 'The key figure flares, the state light brightens, the line flares, the strip’s figure flips over, the tile jumps up and back.',
                verdict: not('five pictures for one event, and two of them move the part.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'Your loading family is the busy table’s The marquee chases: a row of bulbs along the top, the light chasing one bulb a step in four hard steps. Today nine other loading pictures run in synthwave: dashes driving along the foot (three directions), the floor marching, a scanning beam, a rolling band, the meter’s overdrive, the skeleton’s sheen. The progress bar’s road stays.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'marquee',
                name: 'The marquee on every waiting part',
                see: 'Along the top of every waiting part a row of bulbs, one in four lit, the light jumping one bulb a step to the right, 900 ms round. Each day carries one bulb, lighting on its beat, so the week chases; the skeleton’s lines chase one after another. The progress bar keeps its road.',
                verdict: rec('it is your loading pick on every surface, it never covers the words, and bulbs that light in turn are nobody else’s.'),
            },
            {
                key: 'drive',
                name: 'The floor drives (the key figure’s, tiles’ and menu’s picks; dark’s ticker)',
                see: 'Pink dashes drive along the foot of every waiting part, the way the key figure, the tiles and the menu load today.',
                verdict: not('it is the road’s cousin, but dashes along the foot are dark’s ticker baseline almost exactly.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each part its own: dashes driving right and left, a beam scanning down the days, the floor drifting under a pen, the skeleton’s sheen, the meter’s bar running back and forth, one bulb on the table.',
                verdict: not('nine pictures for one state, in four directions.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G11',
        question: 'What does synthwave’s spinner show?',
        why: 'The spinner is the one loading part too small for a row of bulbs. Your signature spinner (2026-10-03) is the striped sun setting behind a cyan horizon and rising again, 2.8 s on ease-in-out.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'sun',
                name: 'The sun sets and rises, on the beat',
                see: 'The striped sun sinks behind its cyan horizon and rises again, once per 1.8 s on the sunrise curve.',
                verdict: rec('it is your signature, the theme’s own picture, and with the stripes no other theme’s sun looks like it.'),
            },
            {
                key: 'ring',
                name: 'A ring of marquee bulbs',
                see: 'Eight bulbs round a ring, one lit, the light jumping round in hard steps, 900 ms a turn.',
                verdict: not('it is the loading family at the spinner’s size, but a ring of lights is what any spinner is; the sun says synthwave.'),
            },
            {
                key: 'road',
                name: 'The road',
                see: 'A road runs to the horizon, its lane dashes racing toward you.',
                verdict: not('it is the busy bar’s road and very outrun, but at 1 rem the dashes read as a flicker.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'What leaves plays the register’s leave; what arrives plays it backwards (2026-10-05). Today the leave is your sunset of 2026-10-04: a striped disc grows over the part from below until it is gone in the glow, 750 ms. A circle closing over a part is solstice’s leave (an eclipse), and solstice is the next theme in your order.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'sunset',
                name: 'It sets behind its horizon, cut by the sun’s stripes',
                see: 'Leaving, the part sinks behind its own horizon line while the sun’s stripes cut it, the gaps widening toward the line, until it is gone (900 ms); the horizon glows and goes out. Arriving plays it backwards: it rises over the horizon, its stripes closing.',
                verdict: rec(
                    'it keeps your sunset’s stripes, loses the circle that is solstice’s, and arriving becomes your arrival family exactly.',
                ),
            },
            {
                key: 'swallow',
                name: 'The sun swallows it (your 2026-10-04 pick; solstice’s eclipse)',
                see: 'Leaving, a striped disc in cyan, pink and violet grows over the part from below and it fades in the glow (750 ms); arriving, the disc sinks away.',
                verdict: not('it is your pick and it glows, but a circle closing over a part is solstice’s eclipse.'),
            },
            {
                key: 'crt',
                name: 'Switched off to a line (the boot’s CRT; nostromo’s tube)',
                see: 'Leaving, the part collapses to a bright line through its middle and the line goes out; arriving, the reverse.',
                verdict: not('clean, and it is how your boot screen switches off, but it is the leave nostromo’s grammar proposes for its tube.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'When a button sits inside a header, a menu, a tile or a drawer, is it synthwave’s own button?',
        why: 'Today the header’s actions are pills in cyan frames with a tracking band on hover, an outline 2 px out on focus and a sideways push on press; the menu’s entries draw a pink line along their foot and press in cyan; the tile’s Open link and the key figure take a single pink outline on focus. Press the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly synthwave’s own button',
                see: 'Every inner button, link and entry hovers, focuses and presses exactly like the button standing alone at the top: the tube turned up, the inset two-channel ring, the dipped tube.',
                verdict: rec('a control is a control wherever you meet it: one hover to learn, one focus ring to trust.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s cyan pills with their tracking band, the menu’s pink foot line, the tile link’s and the key figure’s single pink outline.',
                verdict: not('four kinds of control on one page, cyan acting where it should read, and focus rings of one channel.'),
            },
            {
                key: 'pills',
                name: 'Synthwave’s button, the header’s as cyan pills',
                see: 'Every button is synthwave’s own; the header’s actions keep their pill shape and cyan frame as the marquee’s mark.',
                verdict: not('a fair middle way, but cyan buttons act in the colour that should only read, and pills are light’s and pastel’s.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'How does synthwave show what you point at?',
        why: 'Your hover family is the tiles’ The marquee glows: the frame’s glow widens, the Open link gains a pink drop. A glow on its own is close to dark’s hover (the pick glows, the rest dims) and light’s (it warms). The register’s button already has synthwave’s own: its glow widens and the sun cut, two slits of the sun’s stripes, crosses it once. Today the button also lifts 1 px. In every scene below the first part is shown pointed at.',
        kind: 'loop',
        scene: HOVER,
        options: [
            {
                key: 'tube',
                name: 'The tube turns up, the sun cut crosses',
                see: 'The part you point at brightens: a button’s glow widens and the sun cut crosses it; an entry’s, a tile’s, a key figure’s and a day’s words light as a tube; the link’s stripe thickens. Nothing lifts or moves; the siblings stay as they are.',
                verdict: rec(
                    'it is your marquee glow on every part, with the sun cut that is synthwave’s alone, and it never moves the words under the pointer.',
                ),
            },
            {
                key: 'outline',
                name: 'The marquee outline on everything (the families page)',
                see: 'Every part you point at gets a 2 px pink outline 3 px out with a 16 px glow, as the families page drew your pick.',
                verdict: not('it is unmistakable, but an outline is also what focus draws, so pointer and keyboard look alike.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button lifts and glows, the entry draws a pink foot line, the tile’s rim glow widens and its link gains a pink drop, the key figure turns pink, the day takes a cyan outline.',
                verdict: not('five hovers on one page, one of them moves the part and one acts in cyan.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'What does keyboard focus look like?',
        why: 'The two-channel focus ring is a system constant (DI2). Synthwave’s button draws it inset, inside its neon frame. The key figure and the tile link use one pink outline (on a pink face it reads 1:1), the header one ring 2 px out, the menu entry only its foot line, the field one cyan ring with a glow.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, the tube lit',
                see: 'Every focused part carries DI2’s ring (lavender beside the void), inside a framed button and outside a plate, a day or an entry, and its words light as under the pointer.',
                verdict: rec(
                    'the ring is the constant every theme shares and reads on every ground; the lit tube tells a keyboard user which part is live.',
                ),
            },
            {
                key: 'trace',
                name: 'The marquee trace (the tiles’ pick)',
                see: 'Every focused part is traced by one 2 px pink line 4 px out, as the tiles’ focus draws it.',
                verdict: not('it is neon and clear on the void, but one channel vanishes on a pink face, which is what DI2 exists to prevent.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button’s inset ring, the header’s ring 2 px out, the key figure’s single pink outline, the menu entry’s foot line, the day’s cyan outline, the tile link’s pink outline.',
                verdict: not('six focus looks, and the menu entry has no ring at all.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What does a press look like?',
        why: 'Today a synthwave button drops 1 px into its seat when pressed, which is titanium’s press exactly; the header’s action is pushed 1 px sideways. The scenes press each part every few seconds.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'dip',
                name: 'The tube dips',
                see: 'The pressed part’s glow drops to its bare core and its ground takes the pressed shade for as long as it is held, the way a neon tube dips; the part does not move.',
                verdict: rec(
                    'it follows from the hover (the tube turns up, then dips under the finger), it never shifts the words, and no other theme presses this way.',
                ),
            },
            {
                key: 'drop',
                name: 'Drops 1 px (titanium’s press; the register today)',
                see: 'The pressed part sinks 1 px and takes its pressed shade, then comes back.',
                verdict: not('small and exact, but it is titanium’s press to the pixel.'),
            },
            {
                key: 'cut',
                name: 'The sun cut holds',
                see: 'The pressed part is cut by the sun’s two slits for as long as it is held.',
                verdict: not('it is synthwave’s own, but the slits cut through the words just as you read what you pressed.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G15',
        question: 'Where do the OSD, the chrome display and Rajdhani go?',
        why: 'Synthwave has three faces: KP Outrun Display (chrome titles), Rajdhani (the body) and VT323 (a VCR’s on-screen display, with its ▶). The register sets identifiers, figures and timestamps in KP Tech Mono, which is cyberpunk’s label face; mono figures are titanium’s and terminal’s voice.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'osd',
                name: 'The OSD names, the chrome counts',
                see: 'The label and the table’s heads in VT323 capitals after a cyan ▶, the timestamp in cyan VT323; the title and the figures in KP Outrun Display, near-white with the pink tube; the prose and the button in Rajdhani.',
                verdict: rec('each face has one job you can see, the OSD is a VCR’s and nobody else’s, and the chrome figures are the poster’s.'),
            },
            {
                key: 'mono',
                name: 'KP Tech Mono for the data (the register today; cyberpunk’s face)',
                see: 'The figures, the timestamp and the table’s values in KP Tech Mono, the labels in VT323.',
                verdict: not(
                    'it is legible and how the register sets its data, but KP Tech Mono is cyberpunk’s label face and mono figures are titanium’s.',
                ),
            },
            {
                key: 'plain',
                name: 'No OSD voice',
                see: 'Labels and heads in Rajdhani, sentence case, no ▶; the figures in Rajdhani.',
                verdict: not('calm and readable, but the VCR stops talking: the OSD was half the night.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Horizon, sun, floor, marquee, laser',
        rule: 'G16',
        question: 'Where do synthwave’s motifs go?',
        why: 'Synthwave has a set of motifs: the horizon (the divider), the striped sun (the spinner, the empty state, the meter’s mark), the grid floor, the road, the marquee bulbs, the laser, the neon ring, the stripe, and the VHS (the still screen-door, the OSD). Today the VHS also tears the headline and jolts the tiles as a tracking glitch, which is cyberpunk’s glitch.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'meaning',
                name: 'Every motif means one thing',
                see: 'The meter’s chrome gauge with its half-risen sun; neon rings on the plot’s events; the card standing on its floor; the button and a list with the OSD’s ▶; the empty state’s sun; the horizon as the divider.',
                verdict: rec('each motif keeps one meaning: the horizon is where things come and go, the sun the clock, the floor the ground.'),
            },
            {
                key: 'none',
                name: 'Only the stripe',
                see: 'A plain bar for the meter, plain dots for the events, a plain card, a plain empty state and a plain rule; only the pink to cyan stripe stays.',
                verdict: not('safe, but synthwave becomes a dark theme with a gradient: the horizon was the theme.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'A sun on every card, the floor under the button too, the labels torn by a tracking band with a colour fringe, everything glowing.',
                verdict: not('a poster, not an interface: the motifs stop meaning anything, and the tracking glitch is cyberpunk’s.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave"]'));
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
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `${ASPECTS.length} questions, one rule of synthwave each; the first option of every question is the recommendation. Pick the one that is synthwave to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sy-aspects]'));
const toc = document.querySelector('[data-sy-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'sy-aspect';
    box.id = `sy-${a.id}`;
    box.setAttribute('data-sy-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-sy-${a.id}`);
    box.innerHTML = `<div class="sy-aspect__head">
        <h3 id="h-sy-${a.id}"><span class="sy-aspect__no">${n + 1}</span> ${a.label} <span class="sy-aspect__rule">${a.rule}</span></h3>
        <p class="sy-aspect__q"></p><p class="sy-aspect__why"></p></div><div class="sy-trio" data-sy-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.sy-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'sy-col';
        col.setAttribute('data-sy-option', String(at + 1));
        col.innerHTML = `<p class="sy-label-row"><span class="sy-label-row__no">${at + 1}</span> <span class="sy-label-row__name"></span>${
            at === 0 ? ' <span class="sy-label-row__rec">Recommended</span>' : ''
        }</p><p class="sy-see"></p><p class="sy-verdict"></p>
        <div class="sy-scene" data-sy-kind="${a.kind}" data-sy-${a.id}="${o.key}" data-sy-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.sy-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.sy-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.sy-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('sy-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sy-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const BANDS = { beats: [225, 450, 675, 900], slow: [360, 2880, 900, 2600], brisk: [150, 300, 450, 600] };
for (const scene of section.querySelectorAll('[data-sy-durations]')) {
    const key = /** @type {keyof typeof BANDS} */ (scene.getAttribute('data-sy-durations'));
    const [contact, open, live, loop] = BANDS[key];
    const beats = (/** @type {number} */ ms) => (key === 'beats' ? `, ${ms / 225} ${ms === 225 ? 'beat' : 'beats'}` : '');
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-sy-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms${beats(contact)}`);
    say('open', `${open} ms${beats(open)}`);
    say('live', `${live} ms${beats(live)}`);
    say('loop', `${loop} ms a cycle${beats(loop)}`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sy-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1400],
    ['hold', 2200],
    ['out', 1100],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-num]')];
const words = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-sy-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/Gb/.test(text)) num.textContent = tick % 2 ? '4.4 Gb/s' : '4.2 Gb/s';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of words) word.textContent = tick % 2 ? 'Syncing' : 'Running';
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
radio('data-sy-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--sy-slow', String(slow));
    run(0);
});
radio('data-sy-state', (value) => {
    section.setAttribute('data-sy-show', value);
});
document.querySelector('[data-sy-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sy-scene a, .sy-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided synthwave components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=synthwave`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-sy-gallery]'));
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
