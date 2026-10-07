// What makes solstice solstice (Kenny, 2026-10-07 04:23: the themes one by
// one, "cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint"), the
// same way as titanium, forest, nostromo, cyberpunk and synthwave (02:54:
// "waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan zo
// voorstellen doet").
//
// A review-kit demo in aspect mode, solstice only. Each ASPECT is one rule of
// the theme's grammar (themes/solstice/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-so-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The low sun's light at a plate's foot (G7): its own element, so a question can switch it. */
const FOOT = `<span class="so-foot" aria-hidden="true"></span>`;

/** Every loading picture an option may draw over a waiting part; options.css shows one. */
const LOAD = `<span class="so-load" aria-hidden="true"><span class="so-path"><span class="so-sun"></span></span><span class="so-breath"></span><span class="so-sparks"></span></span>`;

/** The moon of the eclipse (G12), on a part that leaves and arrives. */
const MOON = `<span class="so-moon" aria-hidden="true"></span>`;

/** The change, on a chip; its sign (the sun and the moon, or the package's arrows) is the option's. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta so-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/** A part that opens (G3): the body, kindled by the option's drawing. */
const opens = (html, cls = '') => `<div class="so-opens ${cls}">${html}</div>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter so-meter" role="meter" aria-label="Yield, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A chart's plot: the dusk sky over its horizon, the line, the heat under it. */
const plot = (cls = '', extra = '') => `<div class="so-plot ${cls}" aria-hidden="true">${FOOT}<svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polygon class="so-plot__area" points="0,48 0,30 20,26 40,28 60,18 80,22 100,12 120,16 140,8 160,10 160,48"/>
        <polyline class="so-plot__line" points="0,30 20,26 40,28 60,18 80,22 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1"/></svg>${extra}<span class="so-plot__read">Yield, 412 kWh</span></div>`;

const PART = {
    dialog: () =>
        opens(
            `<div class="kp-dialog so-dialog so-panel" role="group" aria-label="A dialog opening">${FOOT}
        <p class="kp-dialog__title so-title">Close the hearth log?</p>
        <p class="kp-dialog__description">Tonight's readings are kept.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
        ),
    menu: () => `<div class="so-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${opens(
            `<div class="kp-popover so-pop so-panel">${FOOT}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the log</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'so-pop-wrap',
        )}
    </div>`,
    tile: (label = 'Boiler 02', body = '4.2 kW · 61 °C', cls = 'so-arrives') =>
        `<div class="kp-card so-plate so-tile ${cls}">${FOOT}
        <p class="kp-card__title so-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    plainTile: (label = 'Boiler 02', body = 'Flow 61 °C', cls = '') =>
        `<div class="kp-card so-plate so-tile ${cls}">${FOOT}<p class="kp-card__title so-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Solar yield today', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi so-plate so-kpi ${cls}" ${extra}>${FOOT}
        <span class="kp-kpi__label so-label">${label}</span>
        <span class="kp-kpi__value so-figure so-carrier" data-so-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    tracks: () => `<div class="so-tracks" aria-hidden="true">
        <span class="so-groove"><span class="so-track" style="--to: 72%"></span></span>
        <span class="so-groove"><span class="so-track" style="--to: 48%"></span></span>
        <span class="so-groove"><span class="so-track" style="--to: 88%"></span></span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="so-days so-week" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="so-day so-arrives" style="--i: ${i}"><span class="so-day__num">${from + i}</span></span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="so-rows" aria-hidden="true">${['Boiler 01, 58 °C', 'Boiler 02, 61 °C', 'Hearth room, 21 °C']
            .map((t, i) => `<span class="so-row-line so-arrives" style="--i: ${i}">${t}</span>`)
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="so-state" data-so-kind="${kind}"><span class="so-state__dot so-carrier so-carrier--dot" aria-hidden="true"></span><span class="so-state__word so-carrier" data-so-word>${word}</span></span>`,
    alert: (text = 'The boiler is back on.') =>
        `<div class="kp-alert so-alert" role="status">${FOOT}<span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="so-spark-wrap"><span class="kp-kpi__label so-label">Yield, 24 h</span><span class="so-spark so-carrier so-carrier--line" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span></div>`,
    column: (label = 'Open', value = '38') =>
        `<div class="so-column">${FOOT}<span class="kp-kpi__label so-label">${label}</span><span class="so-column__num so-figure so-carrier" data-so-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="so-skel so-waits" aria-hidden="true">${[0, 1, 2]
            .map((i) => `<span class="so-skel__line" style="--i: ${i}"></span>`)
            .join('')}${LOAD}</div>`,
    bar: (label = 'Sync busy') =>
        `<div class="kp-progressbar so-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    field: () =>
        `<label class="kp-field so-field"><span class="kp-field__label">Room</span><input class="kp-field__input" value="Hearth room" /></label>`,
    menuStatic: (items = ['Open the log', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover so-pop so-pop--static so-panel ${cls}">${FOOT}<ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' so-pointed' : ''}">${FOOT}<span class="so-entry">${t}</span></button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="so-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="so-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three readouts fill to their mark', PART.tracks(), 'so-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'so-part--wide') +
    cell('A list of readings is printed', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn on a plot', plot('so-walk'));

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card so-plate so-tile so-waits" aria-busy="true">${FOOT}<p class="kp-card__title so-title">Boiler 03</p><p class="kp-card__body so-faint">Reading…</p>${LOAD}</div>`;

const DURATION = () =>
    cell('Contact: a press', `<div class="so-row">${button('Export readings', 'so-tap')}</div><p class="so-readout" data-so-readout="contact"></p>`) +
    cell('Opening: a dialog is kindled', PART.dialog() + '<p class="so-readout" data-so-readout="open"></p>') +
    cell(
        'A live change: a figure rises',
        `<div class="kp-kpis">${PART.kpi('Heat today', '18 240')}</div><p class="so-readout" data-so-readout="live"></p>`,
    ) +
    cell('A loop: a tile waits', `${waitingTile()}<p class="so-readout" data-so-readout="loop"></p>`);

const warnKpi = () => PART.kpi('Flue', '81 °C', chip('12 °C', 'up', 'bad'), 'so-warn', 'data-so-kind="warn"');

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="so-row">${button('Export', 'so-pointed so-act')}${button('Light it', 'kp-button--primary')}${PART.state('Running')}</div>`,
    ) +
    cell('A plot and its heat', plot()) +
    cell(
        'Key figures, a warning among them',
        `<div class="kp-kpis so-kpi-row">${PART.kpi('Solar yield today', '412')}${warnKpi()}</div>`,
        'so-part--wide',
    ) +
    cell('A heading and its rule', `<p class="so-heading">Evening log</p><span class="so-rule" aria-hidden="true"></span>`) +
    cell(
        'A link and the picked day',
        `<p class="so-prose">See the <a href="#so-intro">evening log</a> for details.</p><div class="so-days so-days--pick">${[12, 13, 14, 15]
            .map((d) => `<span class="so-day${d === 13 ? ' so-picked' : ''}"><span class="so-day__num">${d}</span></span>`)
            .join('')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8));

const CORNERS = () =>
    cell('Card', PART.plainTile('Boiler 02', 'Flow 61 °C', 'so-c-card')) +
    cell('Menu panel', PART.menuStatic(['Open the log', 'Assign to…'], 'so-c-menu', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Solar yield today', '412', chip('6 %'), 'so-c-kpi')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="so-row">${button('Export', 'so-c-button')}<span class="kp-badge so-c-tag">12 new</span><span class="kp-tag so-c-tag2">Rooms</span>${chip('6 %')}</div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip so-tip" role="tooltip">18:00 · 412 kWh</div>`) +
    cell(
        'A dialog',
        `<div class="kp-dialog so-dialog so-panel so-c-dialog" role="group" aria-label="A dialog">${FOOT}<p class="kp-dialog__title so-title">Close the hearth log?</p><p class="kp-dialog__description">Tonight's readings are kept.</p></div>`,
    );

const SURFACE = () =>
    cell('Card', PART.plainTile()) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Heat today', '18 240')}</div>`) +
    cell('The plot of a chart', plot()) +
    cell('Meter', `<div class="so-meter-plate so-plate">${FOOT}${meter(0.62, 0.8)}</div>`) +
    cell(
        'Buttons and a tag',
        `<div class="so-row">${button('Export')}${button('Light it', 'kp-button--primary')}<span class="kp-badge">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

/** The tone scene does not replay; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-so-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis so-kpi-row">${PART.kpi('Solar yield today', '412', chip('6 %'))}${warnKpi()}</div>`,
            'so-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card so-plate so-tile so-bad" data-so-kind="bad">${FOOT}<p class="kp-card__title so-title"><span class="so-mark" aria-hidden="true"></span><span class="so-toned">Boiler 03</span></p><p class="kp-card__body">No reading since 16:40</p></div>`,
            ) +
            cell('A failed state', `<div class="so-state-plate so-plate so-bad" data-so-kind="bad">${FOOT}${PART.state('Failed', 'bad')}</div>`) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover so-pop so-pop--static so-panel">${FOOT}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive so-bad" data-so-kind="bad">${FOOT}<span class="so-mark" aria-hidden="true"></span><span class="so-toned">Delete</span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="so-meter-plate so-plate so-warn" data-so-kind="warn">${FOOT}<span class="so-cap so-toned"><span class="so-mark" aria-hidden="true"></span>Flue near its limit</span>${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its light', PART.state('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card so-plate so-tile so-live-tile">${FOOT}<p class="kp-card__title so-title">Boiler 02</p><p class="kp-card__body"><span class="so-carrier so-carrier--body" data-so-num>4.2 kW</span></p></div>`,
    );

const LOADERS = () =>
    cell('The progress bar itself, busy (the sun sweeps)', PART.bar('Sync busy'), 'so-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi so-plate so-kpi so-waits" aria-busy="true">${FOOT}<span class="kp-kpi__label so-label">Heat today</span><span class="kp-kpi__value so-figure so-faint">18 240</span><span class="kp-kpi__trend so-faint">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="so-table so-plate so-waits" aria-busy="true">${FOOT}<span>Room</span><span>Heat</span><span class="so-faint">Hearth room</span><span class="so-faint">21 °C</span>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover so-pop so-pop--static so-panel">${FOOT}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item so-waits" aria-busy="true">Loading rooms…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="so-days so-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="so-day so-waits so-day--wait" style="--i: ${d - 1}"><span class="so-day__num">${d}</span>${LOAD}</span>`)
            .join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="so-plot so-plot--wait so-waits" aria-busy="true">${FOOT}${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="so-meter-wait so-waits" aria-busy="true">${meter(0.62, 0.8, 'data-kp-loading')}${LOAD}</div>`);

/** One spinner in three drawings; options.css shows the option's. */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="so-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--so-spin: ${size}"` : ''
    }><span class="kp-spinner so-spin__arc"></span><span class="so-spin__ember"></span><span class="so-spin__ring"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="so-row so-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'so-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary so-busy-button" aria-busy="true">${spin('', '', true)}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card so-plate so-busy-panel">${FOOT}${spin('2rem', 'Reading the rooms')}<p class="kp-card__body">Reading the rooms…</p></div>`,
    );

/** A part that leaves and arrives: its body, and the moon that crosses it. */
const leaver = (html) => `<div class="so-leaver"><div class="so-leaver__body">${html}</div>${MOON}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.plainTile())) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi so-plate so-kpi">${FOOT}<span class="kp-kpi__label so-label">Solar yield today</span><span class="kp-kpi__value so-figure">412</span></div></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="so-row">${button('Export readings', 'so-alone')}${button('Light it', 'kp-button--primary so-alone')}</div>`,
        'so-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header so-header so-plate">${FOOT}<div class="kp-page-header__inner"><div><p class="kp-page-header__title so-title">Rooms</p><p class="kp-page-header__description">Six on the ground floor.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm so-in-header')}${button('Add', 'kp-button--sm kp-button--primary so-in-header')}</div></div></header>`,
        'so-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open the log', 'Assign to…'], 'so-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card so-plate so-tile so-in-tile">${FOOT}<p class="kp-card__title so-title">Boiler 02</p><a class="kp-button kp-button--ghost kp-button--sm so-tile-link" href="#so-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card so-plate so-drawer">${FOOT}<p class="kp-card__title so-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="so-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost so-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary so-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi so-plate so-kpi so-in-kpi" href="#so-intro">${FOOT}<span class="kp-kpi__label so-label">Solar yield today</span><span class="kp-kpi__value so-figure">412</span><span class="kp-kpi__trend">since sunrise</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="so-row">${button('Export readings', 'so-pointed')}${button('Light it', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open the log', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card so-plate so-tile">${FOOT}<p class="kp-card__title so-title">Boiler 02</p><a class="kp-button kp-button--ghost kp-button--sm so-tile-link so-pointed" href="#so-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis so-kpi-row"><a class="kp-kpi so-plate so-kpi so-pointed" href="#so-intro">${FOOT}<span class="kp-kpi__label so-label">Solar yield</span><span class="kp-kpi__value so-figure">412</span></a><a class="kp-kpi so-plate so-kpi" href="#so-intro">${FOOT}<span class="kp-kpi__label so-label">Flue</span><span class="kp-kpi__value so-figure">61</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="so-days">${[12, 13, 14, 15]
            .map((d) => `<span class="so-day${d === 13 ? ' so-pointed' : ''}">${FOOT}<span class="so-day__num">${d}</span></span>`)
            .join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="so-row">${button('Export readings', 'so-focused')}</div>`) +
    cell('Header action', `<div class="so-header-mini">${button('Export', 'kp-button--sm so-in-header so-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi so-plate so-kpi so-in-kpi so-focused" href="#so-intro">${FOOT}<span class="kp-kpi__label so-label">Solar yield today</span><span class="kp-kpi__value so-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover so-pop so-pop--static so-panel so-in-menu">${FOOT}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item so-focused">${FOOT}<span class="so-entry">Assign to…</span></button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${FOOT}<span class="so-entry">Rename</span></button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="so-days"><span class="so-day">${FOOT}<span class="so-day__num">13</span></span><span class="so-day so-focused">${FOOT}<span class="so-day__num">14</span></span><span class="so-day">${FOOT}<span class="so-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card so-plate so-tile so-in-tile">${FOOT}<p class="kp-card__title so-title">Boiler 02</p><a class="kp-button kp-button--ghost kp-button--sm so-tile-link so-focused" href="#so-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="so-row">${button('Export readings', 'so-press')}</div>`) +
    cell('Primary button', `<div class="so-row">${button('Light it', 'kp-button--primary so-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover so-pop so-pop--static so-panel">${FOOT}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item so-press">${FOOT}<span class="so-entry">Assign to…</span></button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="so-days"><span class="so-day so-press">${FOOT}<span class="so-day__num">14</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle so-plate so-kpi so-press" aria-pressed="false">${FOOT}<span class="kp-kpi__label so-label">Open faults</span><span class="kp-kpi__value so-figure">3</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="so-row"><button type="button" class="so-key so-press" aria-pressed="false">${FOOT}<span class="so-key__swatch" aria-hidden="true"></span>Boiler 01</button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card so-plate so-type">${FOOT}<p class="so-type__label">Ground floor</p><p class="so-type__head">Hearth room</p>
        <p class="so-type__prose">The flue ran warm after the evening fire was laid; the house checks it again at 21:30.</p>
        <p class="so-type__figure"><span class="so-figure">81</span> <small>°C</small> ${chip('12 °C', 'up', 'bad')}</p>
        <div class="so-type__strip">${[
            ['Heat', '412'],
            ['Yield', '18 240'],
            ['Rooms', '6'],
        ]
            .map(([l, v]) => `<div><span class="so-label">${l}</span><span class="so-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="so-type__table"><tbody><tr><th scope="row">Heat</th><td>412 kWh</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp so-stamp">2026-10-07 18:12</span></td></tr></tbody></table>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge so-tagged">12 new</span></p></div>`,
        'so-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events on a plot',
        plot(
            'so-events',
            '<span class="so-events__mark" style="--x: 37.5%; --y: 52%"></span><span class="so-events__mark" style="--x: 75%; --y: 42%"></span>',
        ),
    ) +
    cell('Card', PART.plainTile('Boiler 02', 'Flow 61 °C', 'so-motif-card')) +
    cell(
        'Changes, up and down',
        `<div class="so-row">${chip('6 %', 'up', 'good')}${chip('3 %', 'down', 'bad')}</div><div class="so-days so-days--motif">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="so-day${d === 13 ? ' so-today' : ''}${d === 14 ? ' so-picked' : ''}"><span class="so-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty so-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives at sunset.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="so-cap">Rooms</p><div class="so-divider" data-kp-divider></div><p class="so-cap">Boilers</p>`);

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
        question: 'How does solstice move: on the sun’s sine, on its register’s standard curve, or on a spring?',
        why: 'A theme exists to be distinct (your rule of 03:37). Solstice’s register curve, cubic-bezier(0.4, 0, 0.2, 1), is sepia’s and deco’s exactly; its signature’s (0.2, 0, 0, 1) is formal’s, light’s and nostromo’s; the busy panel and the chart spring past their place, which is pastel’s curve. No theme moves on a sine yet, and the sun’s height through a day is one.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'sine',
                name: 'The sun’s sine',
                see: 'What comes sets off at an even pace and settles softly, with no ramp and no burst: the readouts fill to their mark, the dialog and the menu are kindled, the tile arrives, the figure rises. What goes leaves on the same curve played back.',
                verdict: rec(
                    'it is unhurried without being sluggish, the pace of light at dusk, and no other theme moves on it; the other ease-outs either ramp up from rest or burst off and brake hard.',
                ),
            },
            {
                key: 'standard',
                name: 'The register’s standard curve (sepia’s and deco’s)',
                see: 'Everything on cubic-bezier(0.4, 0, 0.2, 1): a slow start from rest, a quick middle, a long landing.',
                verdict: not('it is calm and familiar, but it is sepia’s and deco’s curve to the decimal, and the curve most interfaces use.'),
            },
            {
                key: 'spring',
                name: 'On a spring (the busy panel’s and the chart’s picks; pastel’s curve)',
                see: 'Everything overshoots and comes back: the readouts shoot past their mark, the panels pop past their place, as the busy panel’s Kindled and the chart’s rise do today.',
                verdict: not('it is lively, but a bounce is pastel’s curve, and the low sun is the one thing in the sky that never hurries.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion go when something arrives or is drawn?',
        why: 'The low sun is below, so its light comes up from the foot of things. Seven of your picks already come up (the columns, the trend, the chart, the toast, the dialog, the tiles, the size change). Today the calendar’s days are wiped in from the side, the drawer slides in from the right and the busy panel springs.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'up',
                name: 'Up from the foot; the sun travels start to end',
                see: 'The days of the week catch the light one after another, from the start; the readings come up row by row; the tile is lit from its foot; the line is drawn from the start to the end, the way the sun crosses.',
                verdict: rec(
                    'it is how a low sun lights a room: from under, and across from where it rose; nothing falls, nothing slides in from a side.',
                ),
            },
            {
                key: 'across',
                name: 'Across from the start (the calendar’s Dawn across; titanium’s feed)',
                see: 'Everything is wiped in from the left, as the calendar’s days are today.',
                verdict: not(
                    'it reads well, but one direction for everything is titanium’s feed, and the light of a low sun climbs; it does not wipe.',
                ),
            },
            {
                key: 'jump',
                name: 'Jump and spring (the busy panel’s and the tiles’ picks)',
                see: 'Everything jumps up a little past its place and settles back, as the busy panel and the tiles arrive today.',
                verdict: not('it has life, but a jump is pastel’s, and solstice is the unhurried theme.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Your menu and your header’s menu are both Kindled: the panel is uncovered while it is overbright and warm, and cools to its colour. Drawn as they are, the menu’s comes up from its foot and the header’s comes down from its top, and a straight cut up from the foot is synthwave’s rise without its neon line. The dialog fades in and rises 18 px, which is light’s Sunrise.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'dome',
                name: 'Kindled: a dome of first light from the foot',
                see: 'A dome of light grows from the middle of the panel’s foot until the whole panel is lit; where it reaches, the panel is overbright and warm for a moment and cools to its colour: 2 units (480 ms). Closing plays it backwards: the dome sinks back into the foot, warming again as it goes. The panel never moves.',
                verdict: rec(
                    'it is your Kindled with the light of a low sun, which spreads up a wall as a dome, and no theme opens on a dome; synthwave rises behind a line, nostromo strikes from the middle.',
                ),
            },
            {
                key: 'cut',
                name: 'Kindled as picked: a straight cut up from the foot (near synthwave’s rise)',
                see: 'The panel is uncovered from its foot up in a straight line, overbright and cooling, as your menu pick draws it: 300 ms.',
                verdict: not('it is your pick, but a straight edge rising up a panel is synthwave’s rise over its horizon, without the line.'),
            },
            {
                key: 'fade',
                name: 'Fades in and rises (the dialog’s signature; light’s Sunrise)',
                see: 'The panel fades in while it rises 18 px into place, as the dialog’s and the toast’s signature do.',
                verdict: not('it is gentle and familiar, but rising and fading in is light’s arrival family and most interfaces’ default.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do contact, an opening, a live change and a loop take?',
        why: 'Solstice’s register has the slowest contact in the set, 240 ms, and your laurel is “Unhurried”. Your picks take 300 to 1400 ms for a one-shot and 1.3 to 4 s for a loop, with no unit under them; the spinner and the busy bar already loop at 2400 ms, ten times 240.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: '240 · 480 · 720 · 2400 (units of 240 ms)',
                see: 'Contact 1 unit (240 ms), opening 2 (480 ms), a live change, an arrival and a leave 3 (720 ms), a loop 10 (2400 ms): the readouts under each part say the numbers.',
                verdict: rec(
                    'every duration is the register’s own 240 ms counted, the set is the slowest of all themes without getting in the way, and the loop is the spinner’s own period.',
                ),
            },
            {
                key: 'picks',
                name: 'As the picks, the slowest of each kind',
                see: 'Contact 620 ms (the rake), opening 560 ms (the dialog), a live change 1000 ms (the trend’s flare), a loop 4000 ms (the meter and the chart).',
                verdict: not('it is your picks, but four seconds of waiting reads as stuck, and nothing ties one number to another.'),
            },
            {
                key: 'brisk',
                name: 'Brisk: 150 · 300 · 450 · 1200',
                see: 'Everything at most interfaces’ pace: contact 150 ms, opening 300, a change 450, a loop 1200.',
                verdict: not('it feels responsive, but solstice is the unhurried theme, and at this pace it is any dark theme.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What do amber and rust each mean?',
        why: 'The anatomy: “amber leads, rust supports”, two neighbouring warm hues 16° apart, the only theme with that pair. Your picks paint the heat at a plate’s foot, the embers and a chart’s horizon in rust, and the pick of the month in a rust ring; the meter’s sun is drawn in the warning plate’s dull ochre (2.1:1 on the card). Rust reads at 3.8:1 on the card: a glow, not an ink for small words.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'roles',
                name: 'Amber acts, rust glows, cream reads, red fails',
                see: 'The pointed button lights amber at its foot, the primary is amber, the picked day carries an amber halo, the link turns amber under the pointer; the heat under the line, the wash at each plate’s foot and the link’s resting underline are rust; the words are cream; only the warning is red-hot.',
                verdict: rec('each colour has one meaning, so a glance tells what you can act on (amber) from what is only warm (rust).'),
            },
            {
                key: 'amber',
                name: 'One amber for everything',
                see: 'The washes, the heat under the line, the underline and the pick all in amber; no rust.',
                verdict: not('it is simple, but the theme loses its pair of hues, and what is warm can no longer be told from what acts.'),
            },
            {
                key: 'rust',
                name: 'Rust acts (the calendar’s pick, turned into a rule)',
                see: 'The pick, the pointed button and the primary in rust; the washes in amber.',
                verdict: not(
                    'it is warmer still, but rust reads at 3.8:1 on the card, so actions and picks would be the faintest things on the page.',
                ),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How round are plates and controls?',
        why: 'The anatomy: the softest radius in the set, 0.625 rem, “the one place where roundness is doing work”. Your picks square the busy panel, the tour card and the meter, draw the chart at 2 px, the calendar at 0.375 rem, the header’s actions at 0.25 rem, the strip at 0.9 rem, and pills for the change, the tooltip and the skeleton.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'soft',
                name: 'One soft radius on everything, concentric',
                see: 'Every plate and every control at 0.625 rem; the parts inside a plate follow its curve (the menu’s entries, the dialog’s buttons). Round only for the sun, the moon, an ember and a dot.',
                verdict: rec(
                    'it is the anatomy’s promise kept everywhere, and putting it on the controls too tells solstice from forest, which shares the plates’ radius but cuts its controls to 3 px.',
                ),
            },
            {
                key: 'mixed',
                name: 'As picked: square, 2 px, 0.25, 0.9 rem and pills side by side',
                see: 'The card square (the busy panel’s), the dialog 2 px (the chart’s), the button 0.25 rem (the header’s), the key figure 0.9 rem (the strip’s), the chip and the tooltip pills.',
                verdict: not('each is your pick, but side by side the corners disagree, and a square plate fights the warmth.'),
            },
            {
                key: 'pill',
                name: 'Pills for every control (light’s and pastel’s)',
                see: 'Buttons, tags, chips and the tooltip fully round; plates at 0.625 rem.',
                verdict: not('it is soft and friendly, but pills are light’s and pastel’s, and solstice is firelight, not daylight.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'How is a plate lit?',
        why: 'The anatomy: no texture, no grid, no bevel, no scan line. Twelve of your picks light a plate from its foot (the busy lanterns, the key figure’s embers, the tiles’ horizon, the state, the header’s band, the graph’s low sun); seven light it from above (the strip’s lanterns, the drawer’s amber panel, the menu’s headings, the empty state). A horizon line low in a plate with a sky above it (the chart, the meter) is synthwave’s floor.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'below',
                name: 'Lit from below: rust from the foot, the foot edge lit',
                see: 'Every plate is charcoal with a rust wash rising from its foot to 40 % of its height, and its foot edge catching the light in amber; the words stand above the wash. Controls stay flat.',
                verdict: rec('it is the low sun, one light from one side, and no other theme lights its plates from under.'),
            },
            {
                key: 'above',
                name: 'Lit from above (the strip’s lanterns, the drawer’s panel)',
                see: 'Every plate glows amber from its top edge down, as a lantern hung over it.',
                verdict: not('it is warm, but the light of a low sun cannot come from above, and it is lamp light, not sunlight.'),
            },
            {
                key: 'horizon',
                name: 'A horizon in the plate (the chart’s dusk; near synthwave’s floor)',
                see: 'A rust line runs across each plate low down, the sky darkening above it.',
                verdict: not('it is a lovely picture on a chart, but on every plate it is synthwave’s horizon without the neon.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show?',
        why: 'Your picks say The red sky three times (the busy panel, the menu, the trend), drawn three ways: a red glow rising from the foot, a red line along the top, a band along the top. The tiles and the state carry a halo round the mark; the key figure puts the figure on the tone’s plate; the meter bumps. Your strip’s change carries the sun for up and the moon for down.',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'sky',
                name: 'The red sky: the foot light in the tone',
                see: 'A warning or failed part’s foot light turns to its tone: the wash rising from its foot and its foot edge in the tone’s ink, its title or figure in that ink. The change sits on a chip with the sun for up and the moon for down.',
                verdict: rec(
                    'it is your red sky drawn one way, the same light that marks every state in solstice, and no other theme reddens a part from its foot.',
                ),
            },
            {
                key: 'halo',
                name: 'A halo round the mark (the tiles’ and the state’s picks)',
                see: 'A ring of the tone’s glow round a dot before the title, the words as they are.',
                verdict: not('it is clear, but a small ring before the title is synthwave’s neon ring in warm colours.'),
            },
            {
                key: 'plate',
                name: 'On the tone’s plate (the key figure’s pick)',
                see: 'The figure or the word on a plate in the tone’s colour, as the key figure’s warning sits today.',
                verdict: not('it is the loudest, but a solid plate is a different picture on every part and near terminal’s plotted plate.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'How does a value that changes in place show it changed?',
        why: 'Your picks mark a change six ways: the key figure, the trend and the graph flare, the chart’s lines swell, the state glints, the tiles jump; the package declares nothing. A glow that flares and dies is dark’s live family (synthwave gave its own up for that reason); a swell is light’s. Your strip’s Risen lets the new figure rise into its line.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'risen',
                name: 'The new value rises into its line',
                see: 'The new number rises from under its own baseline into place, clipped there, like the sun clearing the horizon: 3 units (720 ms), once. The state word, the line’s last point and the tile’s reading rise the same way. No glow, no flare.',
                verdict: rec('it is your strip’s Risen on every value, readable after a fifth of the time, and no theme’s live update rises.'),
            },
            {
                key: 'flare',
                name: 'A flare of sun (four of your picks; dark’s trace flares)',
                see: 'The changed value glows amber, brightens and grows a little, then burns back down.',
                verdict: not('it is warm and lively, but a glow that flares and dies is dark’s live family, drawn in amber.'),
            },
            {
                key: 'swell',
                name: 'It swells once (the chart’s pick; light’s soft swell)',
                see: 'The changed value swells once and settles back to its size.',
                verdict: not('it is gentle, but a single swell is light’s live family.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does every waiting part show?',
        why: 'Your picks draw ten loading pictures: five glows that breathe (the calendar, the strip, the menu, the trend, the busy line), the key figure’s sun going along the foot and back, the tiles’ streak, the meter’s dot going back and forth, the chart’s rising sparks, the skeleton’s light. The spinner and the busy bar already let the sun cross. Solstice has no family pick for loading.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'sun',
                name: 'The sun crosses along the foot',
                see: 'A small amber sun rises out of each waiting part’s foot at the start, crosses along it at a low height and sets into it at the end: 2400 ms, one way only. On a day in the month it rises and sets in place, the days a moment apart, so the light travels across the week.',
                verdict: rec(
                    'it is your key figure’s and your tiles’ The sun crosses, one-way as the sun goes, and one picture with the spinner and the busy bar.',
                ),
            },
            {
                key: 'breathe',
                name: 'The embers breathe (five of your picks)',
                see: 'A warm glow at each part’s foot swells and settles, again and again.',
                verdict: not('it is calm, but a breathing glow says nothing about time, and it is a pulse every theme could draw.'),
            },
            {
                key: 'sparks',
                name: 'Embers rising (the chart’s pick)',
                see: 'Sparks rise from a glowing floor over every waiting part.',
                verdict: not('it is lovely on a chart, but sparks over words and figures are busy, and embers are heat, not waiting.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G11',
        question: 'What turns while something works?',
        why: 'Your signature’s spinner is the sun travelling its arc over a short horizon, once a day in 2400 ms. Synthwave’s is a striped sun sinking behind a cyan line; synthwave’s analysis asked that solstice’s sun stay unstriped and warm.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'arc',
                name: 'The sun’s arc (the signature)',
                see: 'An amber sun rises over its horizon, travels its arc and sets, 2400 ms a day.',
                verdict: rec('it is your signature, the same sun as the loading picture, and an unstriped arc is nobody else’s.'),
            },
            {
                key: 'ember',
                name: 'An ember that breathes',
                see: 'A single amber ember glows up and dims, again and again.',
                verdict: not('it is quiet, but a pulsing dot reads as a status light, not as work going on.'),
            },
            {
                key: 'ring',
                name: 'The package’s ring, in amber',
                see: 'A thin ring with an amber arc turning.',
                verdict: not('it is the plainest, and it is every interface’s spinner.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave, and how does it arrive (the leave played backwards)?',
        why: 'Your leave of 2026-10-04 is the morning mist: the part rises 14 px, brightens, blurs and fades. Light’s leave rises 8 px, blurs, brightens and fades: the same picture. Played backwards for an arrival, the mist comes down from above. The eclipse was solstice’s third exit on that page; the synthwave and nostromo analyses reserve the circle over a part for solstice.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'eclipse',
                name: 'An eclipse: the moon crosses and takes the light',
                see: 'A disc in the ground’s own charcoal, with an amber corona at its rim, crosses the part from the start to the end; as it covers the part, the part dims to the ground and is gone: 720 ms. Arriving plays it backwards: the moon slides back off the start and the part comes up out of the dark to its colour.',
                verdict: rec(
                    'it is the one leave only solstice can draw, a sun-world event, and its arrival ends in the first light your Kindled draws; this is the exit you saw and passed over on 2026-10-04, drawn again from the theme’s own tokens, slower and without the dimming step.',
                ),
            },
            {
                key: 'mist',
                name: 'The morning mist (your pick of 2026-10-04; light’s leave)',
                see: 'The part rises 14 px, brightens, blurs and fades, as the register draws it today; arriving, it comes down from above.',
                verdict: not(
                    'it is your pick and soft, but it is light’s leave nearly exactly, and arriving from above breaks the rule that things come up from the foot.',
                ),
            },
            {
                key: 'dusk',
                name: 'Dusk: the light sinks into the foot',
                see: 'The dome of light the part was kindled with sinks back into the middle of its foot and takes the part with it, dimming like dusk; arriving plays it backwards, the dome growing from the foot as the part brightens to its colour.',
                verdict: not(
                    'it pairs neatly with the opening, but sinking into its own line is close to forest’s withering and synthwave’s new sunset.',
                ),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'Does a button in a header, a menu, a tile, a drawer or a key figure behave like solstice’s own button?',
        why: 'Your rule: an element inside a composite is the theme’s own element. Today the header’s actions are 0.25 rem amber frames with amber words, glow in a ring under the pointer and focus with one outline; the menu’s entries take an amber wash; the tile’s Open link and the key figure focus with one outline. Use the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly solstice’s own',
                see: 'Every button, entry and link hovers, focuses and presses as the reference button at the top does: the sun raised at its foot, the two-channel ring, the ember press, the soft radius.',
                verdict: rec('it is your rule, and a button looks and behaves the same wherever it stands.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s actions as amber frames at 0.25 rem with a glow ring and one outline; the menu’s entries with an amber wash; the tile link and the key figure with one amber outline.',
                verdict: not('each composite speaks its own dialect, and three of them lose the two-channel focus ring.'),
            },
            {
                key: 'quiet',
                name: 'Solstice’s own, but quiet inside a composite',
                see: 'Every button is the theme’s own, but inside a header or a drawer the primary loses its amber face and stands as a ghost with amber words.',
                verdict: not('it calms a busy header, but the one action that matters loses its colour exactly where it has to be found.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'What happens to the part under the pointer?',
        why: 'Your picks point five ways: the rake across the button (your approval of 2026-09-11), an amber wash (the menu, the key figure), a glow ring (the header), the foot line thickening (the tiles’ The horizon lifts), a glow on a link’s words. The rake is cyberpunk’s charge and forest’s mirror sheen; the wash is light’s warm glow; the ring dark’s spotlight.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'sun',
                name: 'The sun rises under it',
                see: 'The part pointed at catches more of the low light: its foot edge lights in full amber and the warm wash climbs higher and warms to amber. Nothing lifts or moves; the parts beside it stay as they are.',
                verdict: rec(
                    'it is your tiles’ The horizon lifts on every part, the same light that marks every state, and no other theme points with light from under.',
                ),
            },
            {
                key: 'rake',
                name: 'The low sun rakes across (your 2026-09-11 approval; cyberpunk’s charge)',
                see: 'A warm band crosses the pointed part once, from its leading edge to the far one, every time it is pointed at (here it repeats so you can see it).',
                verdict: not('it is your approved rake and it has movement, but a band crossing a button is cyberpunk’s charge and forest’s sheen.'),
            },
            {
                key: 'warm',
                name: 'It warms all over (the menu’s and the key figure’s picks; light’s warm glow)',
                see: 'The whole part warms with a wash of amber.',
                verdict: not('it is soft, but warming the whole part is light’s hover family.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'How does the part that has the keyboard’s focus show it?',
        why: 'DI2 asks for two channels, a cream ring inside a charcoal one, so the ring reads on every ground. The header’s actions, the key figure as a link and the tile’s Open link focus with one amber outline today; the calendar’s pick is a double rust ring.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, the sun raised',
                see: 'A cream ring inside a charcoal one round every focused part, the part lit from its foot as under the pointer.',
                verdict: rec('it reads on every ground, it is the same on every part, and the keyboard sees what the pointer sees.'),
            },
            {
                key: 'one',
                name: 'One amber outline (the header’s, the key figure’s and the tile link’s picks)',
                see: 'A single 2 px amber outline, 2 px out.',
                verdict: not('it is lighter, but one channel is lost on an amber button and on the warm wash.'),
            },
            {
                key: 'halo',
                name: 'A halo (the calendar’s pick)',
                see: 'A double rust ring 3 px out round the focused part.',
                verdict: not('it is pretty, but rust is too faint for the keyboard’s only sign, and the halo means today and the pick.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What does a part do while it is pressed?',
        why: 'Your header’s pick presses with a warm glow inside the button; the register restates the package’s -active face; the button lifts 1 px under the pointer, which with a 1 px drop is titanium’s press.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'ember',
                name: 'It glows inside, like an ember blown on',
                see: 'While pressed, the part’s ground takes its -active shade and an amber glow rises inside its edges; nothing moves.',
                verdict: rec('it is your header’s pick on every control, and an inset warm glow is no other theme’s press.'),
            },
            {
                key: 'drop',
                name: 'It drops 1 px (titanium’s)',
                see: 'While pressed, the part moves 1 px down.',
                verdict: not('it is tactile, but it is titanium’s press exactly.'),
            },
            {
                key: 'sink',
                name: 'Its light sinks',
                see: 'While pressed, the light at its foot goes out and its ground darkens, as if the sun went under.',
                verdict: not('it is a fair picture, but a press that darkens reads as disabled.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'In which face and case do labels, heads and figures speak?',
        why: 'Your picks set labels, legends and ticks in Instrument Serif in sentence case (the strip, the menu, the chart, the busy panel). The register sets its labels, the footer’s heads, breadcrumb, pagination and the wizard’s steps in mono or sans capitals, tracked wide: the label voice of nostromo, cyberpunk, synthwave and titanium.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'serif',
                name: 'The serif speaks, in sentence case',
                see: 'Labels, the head, the figures and the table’s heads in Instrument Serif, sentence case, nothing in capitals; the prose and the button in Instrument Sans; only the timestamp in the mono.',
                verdict: rec('it is your picks’ voice, warm and unhurried, and the one dark theme whose labels do not shout in capitals.'),
            },
            {
                key: 'mono',
                name: 'Mono capitals for labels (the register’s; the dark themes’ voice)',
                see: 'Labels and the table’s heads in the mono, capitals, tracked wide.',
                verdict: not(
                    'it is crisp, but it is the label tape, the OSD and the HUD of four other themes, and the anatomy keeps solstice out of the glowing-monospace look.',
                ),
            },
            {
                key: 'sans',
                name: 'The sans for everything but titles',
                see: 'Labels, figures and heads in Instrument Sans; only the title in the serif.',
                verdict: not('it is neutral, but the serif is what makes solstice warm, and without it solstice is any dark theme.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G16',
        question: 'Where do the sun, the moon, the halo and the embers appear?',
        why: 'Solstice has its own pictures: the sun (the spinner, the empty state, the current step, the meter’s mark), the sun and the moon as signs (your strip’s change, the switch), the halo (the calendar’s pick, the drawer’s highlight), embers (the chart, the calendar). The chart’s events are rivets today, which are titanium’s.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'The sun on the meter’s mark and over the empty state’s horizon; the chart’s events as glowing embers; the card lit from its foot; the change with the sun for up and the moon for down; today and the pick with a halo; the divider the horizon seam.',
                verdict: rec('each picture says one thing everywhere, so the theme can be read, not only looked at.'),
            },
            {
                key: 'none',
                name: 'Only the sun',
                see: 'A plain mark on the meter, plain dots for the events, a plain card, the package’s arrows, a plain rule; the sun only on the empty state.',
                verdict: not('safe, but solstice becomes a dark theme in brown: the low sun was the theme.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'Suns and moons on every card, halos round every day, rivets on the events, embers over the card.',
                verdict: not('a postcard, not an interface: the pictures stop meaning anything, and rivets are titanium’s.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="solstice"]'));
// Each hint repeats the question, then what this option shows and the
// recommendation line: the dialog shows only the hint of the option on
// screen, so each hint has to stand on its own.
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
lookLine.setAttribute('data-for', 'solstice');
lookLine.textContent = `${ASPECTS.length} questions, one rule of solstice each; the first option of every question is the recommendation. Pick the one that is solstice to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-so-aspects]'));
const toc = document.querySelector('[data-so-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'so-aspect';
    box.id = `so-${a.id}`;
    box.setAttribute('data-so-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-so-${a.id}`);
    box.innerHTML = `<div class="so-aspect__head">
        <h3 id="h-so-${a.id}"><span class="so-aspect__no">${n + 1}</span> ${a.label} <span class="so-aspect__rule">${a.rule}</span></h3>
        <p class="so-aspect__q"></p><p class="so-aspect__why"></p></div><div class="so-trio" data-so-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.so-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.so-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.so-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'so-col';
        col.setAttribute('data-so-option', String(at + 1));
        col.innerHTML = `<p class="so-label-row"><span class="so-label-row__no">${at + 1}</span> <span class="so-label-row__name"></span>${
            at === 0 ? ' <span class="so-label-row__rec">Recommended</span>' : ''
        }</p><p class="so-see"></p><p class="so-verdict"></p>
        <div class="so-scene" data-so-kind="${a.kind}" data-so-${a.id}="${o.key}" data-so-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.so-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.so-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.so-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('so-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#so-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const BANDS = { units: [240, 480, 720, 2400], picks: [620, 560, 1000, 4000], brisk: [150, 300, 450, 1200] };
for (const scene of section.querySelectorAll('[data-so-durations]')) {
    const key = /** @type {keyof typeof BANDS} */ (scene.getAttribute('data-so-durations'));
    const [contact, open, live, loop] = BANDS[key];
    const units = (/** @type {number} */ ms) => (key === 'units' ? `, ${ms / 240} ${ms === 240 ? 'unit' : 'units'}` : '');
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-so-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms${units(contact)}`);
    say('open', `${open} ms${units(open)}`);
    say('live', `${live} ms${units(live)}`);
    say('loop', `${loop} ms a cycle${units(loop)}`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-so-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1600],
    ['hold', 2200],
    ['out', 1200],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.so-scene[data-so-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.so-scene[data-so-kind="cycle"] [data-so-num]')];
const words = [...section.querySelectorAll('.so-scene[data-so-kind="cycle"] [data-so-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-so-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/kW/.test(text)) num.textContent = tick % 2 ? '4.4 kW' : '4.2 kW';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of words) word.textContent = tick % 2 ? 'Warming' : 'Running';
}

/* ------------------------------------------ every close is its open reversed */

// Kenny's standing rule (2026-10-07 15:16): every close is its open played
// backwards. What a scene hides at `gap` is away; the animations that start
// at `in` in a cell where something away has come to stay by `hold` are its
// arrivals, noted with their keyframes and timing as the CSS gave them (a
// live update or a press, in a cell that was there all along, is not one);
// at `out`, every part whose option starts
// no leave of its own plays its arrival backwards over its cell's whole
// arrival: the same keyframes, curve and pace, what arrived last leaving
// first (the last day of a week, the panel before the line it rose from).
// A part whose option draws its own leave (an `out` rule) keeps it.
// Keyed to the phase attribute, not to the clock, so whatever sets the phase
// (the clock, research/_review/measure-motion.mjs) gets the same close.
/** @type {WeakMap<Element, { target: Element, pseudo: string | null, keyframes: Keyframe[], timing: EffectTiming }[]>} */
const arrivalsOf = new WeakMap();
/** @type {WeakMap<Element, Animation[]>} */
const closesOf = new WeakMap();
/** @type {WeakMap<Element, Set<Element>>} */
const awayOf = new WeakMap();
/** When each scene last reached `in`, on the document timeline. */
/** @type {WeakMap<Element, number>} */
const inAt = new WeakMap();
/** The longest close the last `out` started, in ms (the clock waits for it). */
let closing = 0;
const FLIP = /** @type {Record<string, PlaybackDirection>} */ ({
    normal: 'reverse',
    reverse: 'normal',
    alternate: 'alternate-reverse',
    'alternate-reverse': 'alternate',
});
// Played backwards, what an arrival showed before it started is what its
// close shows after it ends, and the other way round.
const FILL_FLIP = /** @type {Record<string, FillMode>} */ ({
    none: 'none',
    auto: 'none',
    forwards: 'backwards',
    backwards: 'forwards',
    both: 'both',
});
const isAway = (/** @type {Element} */ el) => {
    const style = getComputedStyle(el);
    return style.visibility === 'hidden' || style.opacity === '0';
};
const endOf = (/** @type {EffectTiming} */ t) => (Number(t.delay) || 0) + Number(t.duration) * (Number(t.iterations) || 1);

/** What the scene hides at `gap`: hidden, see-through, or fading to it. One style read per element, no layout. */
function noteAway(/** @type {Element} */ scene) {
    const away = new Set();
    for (const el of scene.querySelectorAll('*')) if (isAway(el)) away.add(el);
    for (const t of scene.getAnimations({ subtree: true }))
        if (t instanceof CSSTransition && t.transitionProperty === 'opacity') {
            const frames = /** @type {KeyframeEffect} */ (t.effect).getKeyframes();
            if (String(frames[frames.length - 1]?.opacity) === '0')
                away.add(/** @type {Element} */ (/** @type {KeyframeEffect} */ (t.effect).target));
        }
    awayOf.set(scene, away);
}

/** An animation as the CSS gave it: what it moves, its keyframes and its timing. */
function noted(/** @type {Animation} */ a) {
    const effect = /** @type {KeyframeEffect} */ (a.effect);
    const keyframes = effect.getKeyframes().map(({ computedOffset, ...k }) => k);
    return { target: /** @type {Element} */ (effect.target), pseudo: effect.pseudoElement, keyframes, timing: effect.getTiming() };
}

const isMotion = (/** @type {Animation} */ a) =>
    a instanceof CSSAnimation &&
    Boolean(a.effect && /** @type {KeyframeEffect} */ (a.effect).target) &&
    Number.isFinite(a.effect?.getComputedTiming().endTime);

/** At `in`: every animation that starts now may be part of an arrival. */
function noteArrivals(/** @type {Element} */ scene) {
    inAt.set(scene, Number(document.timeline.currentTime));
    // Only what starts now: a register's own entrance that ran at page load
    // and still fills is not part of this arrival.
    arrivalsOf.set(
        scene,
        scene
            .getAnimations({ subtree: true })
            .filter((a) => isMotion(a) && a.playState !== 'finished')
            .map(noted),
    );
}

/**
 * At `hold`: a cell (one dialog, one week of days) arrived when something
 * that was away at `gap` stands there now; every animation that started in
 * it at `in` is part of the arrival (the stripes over a rising panel too). A
 * cell where nothing came to stay (a press, a live change, a dimension shown
 * only while pressed) has nothing to close.
 */
function keepArrivals(/** @type {Element} */ scene) {
    const cellOf = (/** @type {Element} */ el) => el.closest('.so-part') || scene;
    const arrived = new Set([...(awayOf.get(scene) || [])].filter((el) => !isAway(el)).map(cellOf));
    arrivalsOf.set(
        scene,
        (arrivalsOf.get(scene) || []).filter((x) => arrived.has(cellOf(x.target))),
    );
}

/** At `out`: what to play backwards, read now; the function it returns plays it and says how long it takes. */
function closeByReverse(/** @type {Element} */ scene) {
    const now = scene.getAnimations({ subtree: true }).filter(isMotion);
    // A leave the option draws itself (an `out` rule) is running now.
    const ownLeaves = now.filter((a) => a.playState !== 'finished').map((a) => /** @type {KeyframeEffect} */ (a.effect));
    const same = (
        /** @type {{ target: Element, pseudo: string | null }} */ x,
        /** @type {{ target: Element | null, pseudoElement: string | null }} */ e,
    ) => e.target === x.target && e.pseudoElement === x.pseudo;
    // What arrived from away, and what moved and still holds its end pose (a
    // readout that travelled to its mark): both go back the way they came.
    const arrived = arrivalsOf.get(scene) || [];
    const since = inAt.get(scene) ?? Infinity;
    const holding = now
        .filter((a) => a.playState === 'finished' && (a.startTime === null || Number(a.startTime) >= since - 1))
        .map(noted)
        .filter((x) => !arrived.some((y) => y.target === x.target && y.pseudo === x.pseudo));
    const arrivals = [...arrived, ...holding].filter((x) => x.target.isConnected && !ownLeaves.some((e) => same(x, e)));
    // Each cell of the scene (one dialog, one week of days) is one arrival.
    const cellOf = (/** @type {Element} */ el) => el.closest('.so-part') || scene;
    /** @type {Map<Element, number>} */
    const spans = new Map();
    for (const x of arrivals) spans.set(cellOf(x.target), Math.max(spans.get(cellOf(x.target)) || 0, endOf(x.timing)));
    // Read now, play later: the observer reads every scene before it writes any.
    return () => {
        closesOf.set(
            scene,
            arrivals.map((x) =>
                x.target.animate(x.keyframes, {
                    ...x.timing,
                    delay: (spans.get(cellOf(x.target)) || 0) - endOf(x.timing),
                    endDelay: 0,
                    direction: FLIP[x.timing.direction || 'normal'],
                    fill: FILL_FLIP[x.timing.fill || 'none'],
                    pseudoElement: x.pseudo ?? undefined,
                }),
            ),
        );
        return Math.max(0, ...spans.values());
    };
}

new MutationObserver((records) => {
    const scenes = [...new Set(records.map((r) => /** @type {Element} */ (r.target)))];
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-so-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-so-phase'] });

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
    // The closes start in the observer above, a microtask after the phase is
    // set; `out` lasts at least as long as the longest of them.
    queueMicrotask(() => {
        const wait = phase === 'out' ? Math.max(ms * slow, closing + 120) : ms * slow;
        timer = window.setTimeout(() => run((at + 1) % PHASES.length), wait);
    });
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
radio('data-so-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--so-slow', String(slow));
    run(0);
});
radio('data-so-state', (value) => {
    section.setAttribute('data-so-show', value);
});
document.querySelector('[data-so-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.so-scene a, .so-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided solstice components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=solstice`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-so-gallery]'));
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
