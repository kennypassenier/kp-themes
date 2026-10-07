// What makes nostromo nostromo (Kenny, 2026-10-07 03:50): "doe terwijl
// nostromo al", the same way as titanium and forest (02:54: "waar jij eerst
// uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet").
//
// A review-kit demo in aspect mode, nostromo only. Each ASPECT is one rule of
// the theme's grammar (themes/nostromo/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-nc-<aspect>="<key>"`) that options.css reads. The recommended
// option is always first. The page's one clock (below) plays every scene
// that arrives, opens, presses, updates or leaves, so the rule is seen in
// action. The network graph is in no scene: it changes in no theme (Kenny,
// 02:54), so it is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** A switch's or a reading's lamp (scope-12): unlit at rest; the options light it. */
const LAMP = '<span class="nc-lamp" aria-hidden="true"></span>';

/** The lamp bank: the progress bar's LED window, computing (the recommendation), or the lamps scanning (option 2). */
const bank = (cls = '') =>
    `<span class="nc-bank ${cls}" aria-hidden="true"><span class="nc-bank__window"><span class="nc-bank__lit"></span></span></span>`;

/** Every loading picture an option may draw at the foot of (or over) a waiting part; options.css shows one. */
const LOAD = `<span class="nc-load" aria-hidden="true">${bank('nc-load__bank')}<span class="nc-load__today"></span></span>`;

/** The change on label tape, ‹▲ 6 %›, in its tone. */
const tape = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta nc-tape" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter nc-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A small amber screen set into the case: the chart's plot, with its trace. */
const screen = (cls = '') => `<div class="nc-screen ${cls}" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="nc-screen__trace" points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1"/></svg><span class="nc-screen__read">FLOW 412</span></div>`;

const PART = {
    dialog: () => `<div class="kp-dialog nc-dialog nc-arrives nc-strikes" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title nc-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: () => `<div class="nc-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="kp-popover nc-pop nc-arrives nc-strikes"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">${LAMP}Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">${LAMP}Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">${LAMP}Delete</button></li>
        </ul></div>
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => `<div class="kp-card nc-tile nc-arrives">
        <p class="kp-card__title nc-title">${LAMP}${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412', foot = tape('6 %')) => `<div class="kp-kpi nc-kpi">
        <span class="kp-kpi__label">${LAMP}${label}</span>
        <span class="kp-kpi__value nc-figure nc-carrier" data-nc-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    tracks: () => `<div class="nc-tracks" aria-hidden="true">
        <span class="nc-tracks__groove"><span class="nc-track" data-nc-r="1"></span></span>
        <span class="nc-tracks__groove"><span class="nc-track" data-nc-r="2"></span></span>
        <span class="nc-tracks__groove"><span class="nc-track" data-nc-r="3"></span></span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="nc-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="nc-day nc-arrives" style="--i: ${i}">${LAMP}${from + i}</span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="nc-rows" aria-hidden="true">${['NORTH 4 · 412', 'SOUTH 2 · 398', 'EAST 1 · 451']
            .map((t, i) => `<span class="nc-row-line nc-arrives" style="--i: ${i}">${t}</span>`)
            .join('')}</div>`,
    chip: (word = 'Running', kind = 'good') =>
        `<span class="nc-state" data-nc-kind="${kind}"><span class="nc-state__dot nc-lamp nc-lamp--state" aria-hidden="true"></span><span class="nc-state__word nc-carrier" data-nc-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.') =>
        `<div class="kp-alert nc-alert nc-arrives" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="nc-spark-wrap"><span class="kp-kpi__label">${LAMP}Flow, 24 h</span><span class="nc-spark nc-carrier nc-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span></div>`,
    column: (label = 'Open', value = '38') =>
        `<div class="nc-column"><span class="kp-kpi__label">${LAMP}${label}</span><span class="nc-column__num nc-figure nc-carrier" data-nc-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="nc-skel" aria-hidden="true"><span class="kp-skeleton nc-skel__line"></span><span class="kp-skeleton nc-skel__line"></span><span class="kp-skeleton nc-skel__line"></span>${bank(
            'nc-skel__bank',
        )}${bank('nc-skel__bank')}${bank('nc-skel__bank')}</div>`,
    bar: (label = 'Export busy') =>
        `<div class="nc-bar-wrap"><div class="kp-progressbar nc-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>${bank(
            'nc-bar-bank',
        )}</div>`,
    field: () =>
        `<label class="kp-field nc-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '') =>
        `<div class="kp-popover nc-pop nc-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 ? ' nc-pointed' : ''}">${LAMP}${t}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="nc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="nc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three readouts move to their mark, one per curve the option uses', PART.tracks(), 'nc-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'nc-part--wide') +
    cell('A list of readings is printed', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn on a screen', screen('nc-walk'));

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell('Contact: a press', `<div class="nc-row">${button('Export readings', 'nc-tap')}</div><p class="nc-readout" data-nc-readout="contact"></p>`) +
    cell('A strike: a dialog opens', PART.dialog() + '<p class="nc-readout" data-nc-readout="strike"></p>') +
    cell(
        'Printing: a figure is printed',
        `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div><p class="nc-readout" data-nc-readout="print"></p>`,
    ) +
    cell('A loop: the lamp bank computes', PART.bar('Loading') + '<p class="nc-readout" data-nc-readout="loop"></p>');

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="nc-row">${button('Export', 'nc-pointed')}${button('Add', 'kp-button--primary')}${PART.chip('Running')}</div>`,
    ) +
    cell('A screen: the plot and its reading', screen()) +
    cell(
        'Key figures, a warning among them',
        `<div class="kp-kpis">${PART.kpi('Flow now', '412', tape('6 %'))}${PART.kpi('Pressure', '1.1 bar', tape('0.4 bar', 'down', 'bad')).replace(
            'class="kp-kpi nc-kpi"',
            'class="kp-kpi nc-kpi nc-kpi--warn" data-kp-tone="warning"',
        )}</div>`,
    ) +
    cell(
        'A waiting tile',
        `<div class="kp-card nc-tile nc-waits"><p class="kp-card__title nc-title">Pump house 2</p><p class="kp-card__body nc-faint">Reading…</p>${LOAD}</div>`,
    ) +
    cell(
        'A link and the picked day',
        `<p class="nc-prose">See the <a href="#nc-intro">night log</a> for details.</p><div class="nc-days nc-days--pick">${[12, 13, 14, 15]
            .map((d) => `<span class="nc-day${d === 13 ? ' nc-picked' : ''}">${LAMP}${d}</span>`)
            .join('')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8));

const CORNERS = () =>
    cell('Card', PART.tile('Reservoir North', 'Level 71 %').replace(' nc-arrives', '')) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…']).replace(' nc-pointed', '')) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="nc-row">${button('Export')}<span class="kp-badge nc-tag">12 new</span><span class="kp-tag nc-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip nc-tip" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell('A screen', screen());

const SURFACE = () =>
    cell('Card', PART.tile('Reservoir North', 'Level 71 %').replace(' nc-arrives', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell('The plot of a chart', screen()) +
    cell('Meter', meter(0.62, 0.8)) +
    cell(
        'Buttons and a tag',
        `<div class="nc-row">${button('Export')}${button('Add', 'kp-button--primary')}<span class="kp-badge nc-tag">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

/** The tone scene is replayed only for the meter's jolt (as today): its figures and words stay as written. */
const steady = (html) => html.replace(/ data-nc-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis nc-kpi-row">${PART.kpi('Flow now', '412', tape('6 %'))}${PART.kpi(
                'Pressure',
                '1.1 bar',
                tape('0.4 bar', 'down', 'bad'),
            ).replace('class="kp-kpi nc-kpi"', 'class="kp-kpi nc-kpi nc-kpi--warn" data-kp-tone="warning"')}</div>`,
            'nc-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card nc-tile nc-tile--bad" data-kp-tone="destructive"><p class="kp-card__title nc-title">${LAMP}Pump house 3</p><p class="kp-card__body">No reading since 06:40</p></div>`,
            ) +
            cell('A failed state', PART.chip('Failed', 'bad')) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover nc-pop nc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${LAMP}Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive" data-nc-bad>${LAMP}Delete</button></li></ul></div>`,
            ) +
            cell('A meter turning to warning', meter(0.88, 0.8, 'data-kp-tone="warning"')),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card nc-tile nc-live-tile"><p class="kp-card__title nc-title">${LAMP}Pump house 2</p><p class="kp-card__body"><span class="nc-carrier" data-nc-num>4.2 bar</span></p></div>`,
    );

const LOADERS = () =>
    cell('The progress bar itself, busy', PART.bar('Export busy'), 'nc-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi nc-kpi nc-waits" aria-busy="true"><span class="kp-kpi__label">Readings today</span><span class="kp-kpi__value nc-faint">18 240</span><span class="kp-kpi__trend nc-faint">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="nc-table nc-waits" aria-busy="true"><span>Station</span><span>Flow</span><span class="nc-faint">North 4</span><span class="nc-faint">412</span>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover nc-pop nc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item nc-waits" aria-busy="true">Loading stations…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="nc-days nc-days--wait">${[1, 2, 3, 4, 5].map((d) => `<span class="nc-day nc-waits" style="--i: ${d - 1}">${LAMP}${d}${LOAD}</span>`).join('')}</div>`,
    ) +
    cell('Chart plot (a screen)', `<div class="nc-screen nc-screen--wait nc-waits" aria-busy="true">${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="nc-meter-wait nc-waits" aria-busy="true">${meter(0.62, 0.8)}${LOAD}</div>`);

const spin = (size = '') =>
    `<span class="kp-spinner nc-spin" role="status" aria-label="Working…"${size ? ` style="--kp-spinner-size: ${size}"` : ''}><span class="nc-spin__ring"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="nc-row nc-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'nc-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary nc-busy-button" aria-busy="true">${spin().replace('role="status" aria-label="Working…"', 'aria-hidden="true"')}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card nc-busy-panel">${spin('1.75rem').replace('Working…', 'Reading the pump houses')}<p class="kp-card__body">Reading the pump houses…</p></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="nc-leaver">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert().replace(' nc-arrives', ''))) +
    cell('A card', leaver(PART.tile('Reservoir North', 'Level 71 %').replace(' nc-arrives', ''))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi nc-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value nc-figure">412</span></div></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="nc-row">${button('Export readings')}${button('Add', 'kp-button--primary')}</div>`,
        'nc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header nc-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title nc-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm nc-in-header')}${button('Add', 'kp-button--sm kp-button--primary nc-in-header')}</div></div></header>`,
        'nc-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'nc-in-menu').replace(' nc-pointed', '')) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card nc-tile nc-in-tile"><p class="kp-card__title nc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm nc-tile-link" href="#nc-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card nc-drawer"><p class="kp-card__title nc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="nc-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost',
        )}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi nc-kpi nc-in-kpi" href="#nc-intro"><span class="kp-kpi__label">${LAMP}Flow now</span><span class="kp-kpi__value nc-figure">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="nc-row">${button('Export readings', 'nc-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card nc-tile"><p class="kp-card__title nc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm nc-tile-link nc-pointed" href="#nc-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis nc-kpi-row"><a class="kp-kpi nc-kpi nc-pointed" href="#nc-intro"><span class="kp-kpi__label">${LAMP}Flow now</span><span class="kp-kpi__value nc-figure">412</span></a><a class="kp-kpi nc-kpi" href="#nc-intro"><span class="kp-kpi__label">${LAMP}Pressure</span><span class="kp-kpi__value nc-figure">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="nc-days">${[12, 13, 14, 15].map((d) => `<span class="nc-day${d === 13 ? ' nc-pointed' : ''}">${LAMP}${d}</span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="nc-row">${button('Export readings', 'nc-focused')}</div>`) +
    cell('Header action', `<div class="nc-header-mini">${button('Export', 'kp-button--sm nc-in-header nc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi nc-kpi nc-in-kpi nc-focused" href="#nc-intro"><span class="kp-kpi__label">${LAMP}Flow now</span><span class="kp-kpi__value nc-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover nc-pop nc-pop--static nc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item nc-focused">${LAMP}Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${LAMP}Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="nc-days"><span class="nc-day">${LAMP}13</span><span class="nc-day nc-focused">${LAMP}14</span><span class="nc-day">${LAMP}15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card nc-tile nc-in-tile"><p class="kp-card__title nc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm nc-tile-link nc-focused" href="#nc-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="nc-row">${button('Export readings', 'nc-press')}</div>`) +
    cell('Primary button', `<div class="nc-row">${button('Add a pump house', 'kp-button--primary nc-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover nc-pop nc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item nc-press">${LAMP}Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="nc-days"><span class="nc-day nc-press">${LAMP}14</span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle nc-kpi nc-press" aria-pressed="false"><span class="kp-kpi__label">${LAMP}Open incidents</span><span class="kp-kpi__value nc-figure">3</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="nc-row"><button type="button" class="nc-key nc-press" aria-pressed="false"><span class="nc-key__led" aria-hidden="true"></span>North 4</button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card nc-type"><p class="nc-type__label">Northern network</p><p class="nc-type__head">Pump house 4</p>
        <p class="nc-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="nc-type__figure"><span class="nc-figure">4.2</span> <small>bar</small> ${tape('0.4 bar', 'down', 'bad')}</p>
        <table class="nc-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge nc-tag">12 new</span></p></div>`,
    ) + cell('A screen beside it', screen('nc-screen--type'));

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events on a screen',
        `<div class="nc-screen nc-events" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none"><polyline class="nc-screen__trace" points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line class="nc-events__line" x1="60" y1="0" x2="60" y2="48"/><line class="nc-events__line" x1="120" y1="0" x2="120" y2="48"/></svg><span class="nc-events__mark" style="--x: 37.5%"></span><span class="nc-events__mark" style="--x: 75%"></span></div>`,
    ) +
    cell(
        'Card',
        `<div class="kp-card nc-tile nc-motif-card"><p class="kp-card__title nc-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`,
    ) +
    cell(
        'Button and a list',
        `<div class="nc-row">${button('Log a reading', 'nc-motif-button')}</div><ul class="nc-motif-list"><li>North 4</li><li>South 2</li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty nc-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="nc-cap">Pumps</p><hr class="nc-divider" /><p class="nc-cap">Reservoirs</p>`);

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
        question: 'How does nostromo move: frame by frame like a 1979 screen, smoothly on its register’s curve, or as each pick does today?',
        why: 'A theme exists to be distinct (your rule of 03:37). Nostromo’s register curve, cubic-bezier(0.2, 0, 0, 1), is also formal’s, light’s, brutalism’s and grotesk’s. Your nostromo picks already move in hard steps more than anything else (printed out, warmed up, inverted, the lamps, the relay clack), and today the theme runs on eleven curves at once.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'frames',
                name: 'The ship’s frame clock',
                see: 'Every motion follows the register’s curve but is shown in whole frames of 80 ms, 12.5 a second, the way the ship’s computer redraws its screen: the three readouts jump to their mark in eight visible frames and stop hard; the dialog, the menu and the tile strike on in 4 frames; the key figure’s lamp switches on and off in one frame each.',
                verdict: rec(
                    'it is the console’s own rhythm (a screen that redraws, relays that switch), it gathers the steps your picks already use into one clock, and no other theme moves like it: terminal only jumps twice, on and off.',
                ),
            },
            {
                key: 'smooth',
                name: 'Smooth, on the register’s curve (formal’s, light’s, brutalism’s, grotesk’s)',
                see: 'The same pictures on cubic-bezier(0.2, 0, 0, 1), with no frames: the readouts glide to their mark and settle, the panels open in one smooth movement.',
                verdict: not('it is calm and modern, but it is the curve of four other themes: nostromo would move like formal and grotesk.'),
            },
            {
                key: 'mix',
                name: 'The current mix',
                see: 'As the picks are today: the dialog drops 10 px and fades, the menu grows from 90 % (ease-out), the tile flickers open with a 4 % overshoot, the figure flares. The readouts: linear, ease-in-out and a spring that overshoots.',
                verdict: not('four curves on one screen, two of them bouncing: the console stops feeling like one machine.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion travel when something arrives or is printed?',
        why: 'A screen is written in rows from the top, each row from where you start reading to where you stop (left to right here, mirrored in right-to-left languages); a tube is switched on from its middle line. Titanium feeds everything start → end, forest grows things up from their line. Today the days shrink in from a line on titanium’s curve, the tile flickers, the line flickers on and off from its end.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'raster',
                name: 'The raster: rows from the top, each row start → end',
                see: 'The days print one after another in reading order, each struck on from its middle line; the list prints row by row from the top, each row left to right; the tile strikes on from its middle; the line is drawn left to right.',
                verdict: rec(
                    'it is the order a 1979 screen draws in, so every part arrives where the eye expects the next one, and the strike from the middle is nostromo’s alone.',
                ),
            },
            {
                key: 'feed',
                name: 'Everything start → end (titanium’s)',
                see: 'One axis for everything: the days, every row of the list and the tile are uncovered from their left edge at once, the line drawn left to right.',
                verdict: not('tidy, but nothing is printed or switched on any more: it is titanium’s machine feed exactly.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The days grow from a thin line all at once on titanium’s curve, the rows roll down, the tile flickers open with an overshoot, the line flickers on and off from its end.',
                verdict: not('four directions on one screen; the eye cannot tell where the next thing comes from.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Seven openings live in nostromo today for one gesture; two on the dialog alone (it rises 6 px in the register and drops 10 px in the signature). Your arrival picks chose the warm-up every time it was offered: busy, tiles, trend, the month and the header’s menu.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'strike',
                name: 'The tube strikes on',
                see: 'A bright line appears across the middle of the menu and the dialog and opens to their full height in 4 frames (320 ms), the panel overbright for the first frames and settling; closing is the tube switched off: it collapses to its line and is gone.',
                verdict: rec(
                    'it is your warm-up pick made into one rule, it never squashes a letter (the panel is uncovered, not scaled), and no other theme opens like a tube.',
                ),
            },
            {
                key: 'ping',
                name: 'The tracker pings it open',
                see: 'A circle opens from the button that was pressed and uncovers the menu and the dialog, like the motion tracker’s ping, 4 frames; it closes back into the button.',
                verdict: not(
                    'it is the name of your menu pick made literal, but a circle opening is close to solstice’s eclipse played backwards, and a dialog opened from a corner reads as a menu.',
                ),
            },
            {
                key: 'cut',
                name: 'Cut open from the top (the register’s popdown, titanium’s)',
                see: 'The menu and the dialog are uncovered from their top edge down in one movement, as the register’s headline popdown does today.',
                verdict: not('clear and calm, but it is titanium’s opening exactly; the strike is what makes it nostromo.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does a contact, a strike, a print and a loading loop take?',
        why: 'The recommended times count whole 80 ms frames: 160 ms is the register’s own contact (2 frames), 320 ms a strike (4), 640 ms a print (8), 1600 ms the loop (20), which is also the busy table’s trace you picked. Today nostromo runs at twenty different one-shot durations and eight loop periods.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'frames',
                name: 'Frame counts: 160 · 320 · 640 · 1600 ms',
                see: 'A press answers in 2 frames; the dialog strikes on in 4; a figure is printed in 8; the lamp bank shows a new pattern every 4 frames, 1.6 seconds a cycle.',
                verdict: rec(
                    'every number is a whole count of frames, and the pace is a ship’s console: quick to answer, never hurried, never sluggish.',
                ),
            },
            {
                key: 'brisk',
                name: 'Brisk: 80 · 160 · 320 · 960 ms',
                see: 'Everything twice as fast: a press in 1 frame, the dialog strikes in 2, a figure prints in 4, the bank changes about every 2 frames.',
                verdict: not('it answers fast, but the strike becomes a blink and the bank flickers; the console reads nervous.'),
            },
            {
                key: 'slow',
                name: 'Slow: 240 · 480 · 960 · 2400 ms',
                see: 'Everything half again as slow: a press takes 240 ms to answer, the dialog 480 ms to strike, a figure almost a second to print, the bank 2.4 seconds a cycle.',
                verdict: not('atmospheric once, tiring on the tenth dialog; a press that lags 240 ms feels broken.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be ink, what may be the LED orange, and what colour is the screen?',
        why: 'The anatomy of nostromo says ink acts and orange indicates. Today the header and the menu use orange for hover and focus, the menu loads in alarm red, the tiles and the trend load in green and the tile’s link turns light green, and the drawer uses the warning yellow as decoration. Your chart, month and busy panel made the screen amber.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'indicate',
                name: 'Ink acts, the lamp indicates, the screen is amber',
                see: 'Ink on what you do: the primary button, the pointed button’s lamp, the picked day’s frame. The LED orange only as light: a lit lamp, the lit LEDs of the loading bank, the meter’s lit vents. The screen amber and cream on dark glass. A warning in its own dark ink, framed.',
                verdict: rec('every colour has one meaning you learn in a glance, and the screen is nostromo’s, not terminal’s.'),
            },
            {
                key: 'green',
                name: 'Green phosphor (terminal’s)',
                see: 'The screen’s trace and reading in green phosphor, the loading LEDs green, the link green, as the tiles’ and the trend’s loading and the tile’s link are today.',
                verdict: not(
                    'it reads as a computer at once, but green phosphor is terminal’s screen, and the light green reads 1.3:1 on the beige card.',
                ),
            },
            {
                key: 'orange',
                name: 'Orange acts',
                see: 'The LED orange on what you do: the primary button, the pointed button’s ring, the picked day’s frame, the link; ink only for text. As the header’s and the menu’s hover do today.',
                verdict: not(
                    'lively, but the indicator stops indicating: a lit lamp and a pressed button look the same, and the LED orange as text reads 2.1:1 on the card.',
                ),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners does nostromo have?',
        why: 'Today eleven radii live in nostromo: a button is as round as a card (12 px), the badge and the skeleton are pills, the tiles 3 px, the strip and the drawer square, a menu entry 6 px, the tooltip 2 px, the chart’s glass 0.875 rem. And the focus ring turns a 12 px button into a 6 px one while it has focus.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'moulded',
                name: 'Moulded plates, keys, tape and glass',
                see: 'Plates (card, menu, key figure) 0.75 rem; keys and controls (the button, a chip) 0.3 rem; label tape (the tag, the change, the tooltip) cut square at 2 px; the screen’s glass 0.875 rem inside its bezel.',
                verdict: rec('four corners, each with a reason you can see: a moulded panel is round, a key less so, tape is cut, a tube is a tube.'),
            },
            {
                key: 'one',
                name: 'One radius, 0.75 rem on everything',
                see: 'Every part the register’s 0.75 rem: card, menu, button, tag, chip, tooltip and the screen.',
                verdict: not(
                    'it is one rule, but a button looks like a card and the label tape becomes a pill: the materials stop telling themselves apart.',
                ),
            },
            {
                key: 'tape',
                name: 'Cut like tape: 2 px on everything',
                see: 'Every part cut square at 2 px, as the label tape is: card, menu, button, tag and even the screen.',
                verdict: not('crisp, but the moulded plastic loses its softness and the theme drifts towards brutalism and blueprint.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is the beige case and what is the screen?',
        why: 'Your meter and tiles chose the case (backlit vents, an indicator panel); your chart, month and busy panel chose the screen (an amber CRT set into the case). Today the header, the menu, the state chip and the tile’s hover draw scanlines on the beige plastic, and two figures glow on it.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'both',
                name: 'The case and the screen, each its own',
                see: 'Cards, key figures, buttons, the meter and the field are moulded beige: a lit top edge, a shadow under, the vent ribs of the page. The chart’s plot is a dark amber screen in a thick bezel, with its scanlines. No scanlines and no glow on the plastic.',
                verdict: rec('the screen reads as a screen because it is set into the case, and the words you act on stay on clean plastic.'),
            },
            {
                key: 'screen',
                name: 'A screen on everything',
                see: 'Every card, key figure and field is a dark amber screen with scanlines; the buttons are lit keys around them.',
                verdict: not('dramatic, but it is terminal in amber: the beige case, the vents and the tape disappear.'),
            },
            {
                key: 'case',
                name: 'Only the case',
                see: 'No screens: the chart’s plot is a beige recess with a dark trace, the figures printed on plastic.',
                verdict: not('quiet, but it throws away four of your picks (the amber CRT, the duty roster, the busy screen, the vent grille).'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show?',
        why: 'Your tone picks chose the klaxon five times (the trend, the tiles, the menu, the state word, the busy failure): the bridge alarm frames the screen. Today the key figure puts its change on a neutral plate, the meter jolts sideways, and the frame is 1 px in one place and 3 px in another.',
        kind: 'cycle',
        scene: TONE,
        options: [
            {
                key: 'klaxon',
                name: 'The klaxon frame',
                see: 'A warning or failed part is framed all round, 3 px, in its tone’s dark ink: the key figure, the tile, the state chip, the menu entry, the meter. The change sits on label tape, ‹▼ 0.4 bar›. Nothing moves.',
                verdict: rec('it is your pick five times over, it reads from across the room, and no other theme frames the whole part.'),
            },
            {
                key: 'lamp',
                name: 'The tone lamp',
                see: 'A warning or failed part keeps its frame and lights its lamp in its tone’s colour; the change sits on label tape.',
                verdict: not(
                    'it fits the lamps, but a lamp is small: a failed tile among twelve is easy to miss, and the lamp already says who acts.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The key figure’s change on a neutral plate and its figure on the warning plate, the tile framed 3 px, the chip and the menu entry 1 px, the meter jolting sideways when it turns to warning.',
                verdict: not('four answers to one question, and the one that moves (the jolt) is the hardest to read.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens to a value that changes in place?',
        why: 'Three of your live picks are A blip: the figure flares and dims. Dark’s and synthwave’s live family is the same picture (The trace flares, The laser flares). Your network graph, which stays as it is, answers a change with a lamp that blinks; scope-12 gave every switch its lamp. Today nostromo also inverts a figure, flashes a ring round a tile, and the package plays nothing at all.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'lamp',
                name: 'The reading’s lamp lights',
                see: 'The lamp beside the label of what changed switches on in LED orange in one frame, holds, and goes out: 640 ms, once. The figure, the word and the line themselves do not move, glow or invert.',
                verdict: rec(
                    'it is your graph’s answer carried to every reading, it is nostromo’s own (no theme lights a lamp beside a value), and the new value is never covered by the effect.',
                ),
            },
            {
                key: 'blip',
                name: 'A blip on every carrier (dark’s and synthwave’s flare)',
                see: 'What changed flares once and dims back: the figure and the word glow, the state dot brightens, the line thickens and glows, 640 ms.',
                verdict: not(
                    'it is today’s pick on every carrier and it reads well, but it is dark’s and synthwave’s live picture almost exactly: three themes would answer a change the same way.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The key figure flares in 450 ms, the state dot brightens, the line flares in 700 ms, the strip column inverts on a tape, the tile flashes a ring.',
                verdict: not('five pictures for one event, at four speeds.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'Today ten loading pictures run in nostromo, in three directions, three colours (green, red, orange) and nine speeds, and the busy progress bar never moves at all (every other LED lit, standing still). The theme’s own signature progress bar is an LED bargraph; your meter, month and key figure loading picks all light lamps in turn.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'bank',
                name: 'The lamp bank computes',
                see: 'Every waiting part gets the progress bar’s LED window along its foot, and its LEDs switch in a fixed, unordered pattern on the frame clock (a new pattern every 320 ms, 1.6 s a cycle): the ship’s computer thinking. No sweep, no direction. The busy bar itself computes; a day lights its own corner lamp with the others.',
                verdict: rec(
                    'it is the theme’s own signature bar, it gathers your lamp picks into one picture, it never covers the words, and no other theme loads like a computer’s lamp panel.',
                ),
            },
            {
                key: 'scan',
                name: 'The lamps scan start → end (synthwave’s marquee)',
                see: 'The same LED window on every waiting part, but a group of three lit LEDs steps from left to right, lamp by lamp, and starts again.',
                verdict: not(
                    'it is close to your meter’s power-up, but it is synthwave’s loading picture (the marquee chases: lit cells in sequence, left to right) almost exactly.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each component its own picture: the key figure’s ink lamp blinks, the table’s trace rolls down, the menu’s red trace burns across, the days become beige keys whose lamps scan, the chart’s screen pulses amber, the skeleton’s glow runs, the meter’s slots power up; the busy bar stands still.',
                verdict: not('ten pictures for one state, and the busy bar that never moves reads as a stuck share.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G11',
        question: 'What does nostromo’s spinner show?',
        why: 'The spinner is the one loading part too small for a lamp bank. Today it is the register’s tape reel: a dark tape pack, a three-spoke hub turning, the LED lens at its centre; your busy table’s phone pick (the reel window) put it in a lit window.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'reel',
                name: 'The tape reel',
                see: 'The register’s cassette reel, kept: the hub turns once per 1.6 seconds, in frames, the LED lit at its centre.',
                verdict: rec('it is the cassette in cassette futurism, it already stands in your busy panel’s window, and no other theme has it.'),
            },
            {
                key: 'lamps',
                name: 'A ring of lamps computes',
                see: 'Eight small lamps in a ring, switching in the bank’s unordered pattern every 320 ms.',
                verdict: not('it matches the lamp bank, but at 1 rem the eight lamps blur into a dotted ring and it no longer reads as busy.'),
            },
            {
                key: 'ping',
                name: 'The tracker pings',
                see: 'A ring pings out from the centre and fades, as the motion tracker does, once per 1.6 seconds, in frames.',
                verdict: not('very Alien, but a ring that grows and vanishes reads as “found something”, not “still working”.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'What leaves plays the register’s leave; what arrives plays that leave backwards (you approved that pairing on 2026-10-05). Today the leave is an overbright blur that fades in place, and its comment promises it “scrolls off the top of the monitor”; arriving is that blur backwards, which is not the warm-up you picked five times.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'off',
                name: 'Switched off, struck on',
                see: 'Leaving, the part collapses to a bright line through its middle, the line shrinks to a dot, and the dot goes out: 480 ms, in frames. Arriving plays it backwards: a dot, a line, the tube struck on, which is the warm-up you picked.',
                verdict: rec('one picture for both ways, the arrival it gives is your warm-up, and no other theme leaves into a line and a dot.'),
            },
            {
                key: 'flare',
                name: 'The flare (today)',
                see: 'Leaving, the part flares overbright, blurs and fades in place, 480 ms, easing in; arriving, the same backwards.',
                verdict: not(
                    'a soft leave, but it is close to dark’s and phantom’s fades, and the arrival it gives is a blur clearing, not a tube warming.',
                ),
            },
            {
                key: 'scroll',
                name: 'Scrolls off the top',
                see: 'Leaving, the part scrolls up off the top line by line and is gone, as the register’s comment promises; arriving, it scrolls in from below.',
                verdict: not('it is the comment kept literally, but rising away is light’s, pastel’s and phantom’s leave.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'When a button sits inside a header, a menu, a tile or a drawer, is it nostromo’s own button?',
        why: 'Today the header’s actions carry an orange stripe and an orange focus outline, the menu’s entries sweep an orange band, the tile’s Open link turns light green, and the key figure has its own single focus line. Press the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly nostromo’s own button',
                see: 'Every inner button, link and entry hovers, focuses and presses exactly like the button standing alone at the top, its lamp included.',
                verdict: rec('a switch is a switch wherever you meet it: one lamp to learn, one focus ring to trust.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s actions with their orange stripe, ring and outline, the menu’s orange sweep, the tile link’s green, the key figure’s single focus line.',
                verdict: not('four kinds of switch on one page, and two of them replace the focus ring that must look the same everywhere.'),
            },
            {
                key: 'accent',
                name: 'Nostromo’s button plus the header’s stripe',
                see: 'Every button is nostromo’s own; the header adds its 3 px orange stripe at the start of its actions as a mark of the header, nothing more.',
                verdict: not('a fair middle way, but the orange stripe reads as a lit lamp that is always on.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'How does nostromo show what you point at?',
        why: 'Scope-12 (your quirk of 2026-09-11): every switch carries its own lamp, dark at rest, lit under the pointer, full when pressed; today only the button has one. The menu sweeps an orange band, the tile greys under heavy scanlines, the header rings in orange. In every scene below the first part is shown pointed at.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'lamp',
                name: 'The switch’s lamp lights',
                see: 'Every switch has its lamp at its start: the button, the menu entry, the Open link, the key figure, the day. The one you point at lights its lamp in ink and its ground steps one shade lighter; nothing moves.',
                verdict: rec('it is your own quirk carried to every switch, it is unmistakable and small, and no other theme points with a lamp.'),
            },
            {
                key: 'sweep',
                name: 'A scanline sweeps (the menu’s pick, on everything)',
                see: 'What you point at gets a band of orange light across it, as the menu’s entries do today.',
                verdict: not('lively, but it is the screen’s mark drawn on the plastic, and the orange band makes the indicator act.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button’s lamp brightens, the menu entry sweeps orange, the tile greys under scanlines and its link turns green, the key figure takes a tint, the day sinks in.',
                verdict: not('five hovers on one page, and the day that sinks looks pressed before you press it.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'What does keyboard focus look like?',
        why: 'The two-channel focus ring is a system constant (DI2): it must look the same in every theme. Today the header uses an orange outline, the tile’s link a light green one, the key figure a single 2 px line, and the ring itself changes the button’s corner from 12 px to 6 px.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'di2lamp',
                name: 'The two-channel ring, the lamp lit',
                see: 'Every focused part carries the package’s ring (beige inside, ink outside) at its own corner, and its lamp is lit as under the pointer.',
                verdict: rec(
                    'the ring is the constant every theme shares; the lit lamp tells a keyboard user which switch is live, the way the pointer does.',
                ),
            },
            {
                key: 'led',
                name: 'The two-channel ring, the lamp lit orange',
                see: 'The same ring, and the focused switch’s lamp lit as the LED, in orange with its glow, as if the ship had armed it.',
                verdict: not(
                    'it is the most visible, but the orange lamp is the ship speaking (a change, loading): a focused key figure would look like one that just changed.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button’s ring at a 6 px corner, the header’s orange outline, the key figure’s single line, the tile link’s light green outline.',
                verdict: not(
                    'four focus looks; the light green one reads 1.3:1 on a card and 1.0:1 on the tiles’ own plate, which is what DI2 exists to prevent.',
                ),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What does a press look like?',
        why: 'Titanium’s press drops a part 1 px into its seat; nostromo’s should not be the same. Today a nostromo button only fills its lamp and changes colour, the chart’s legend key drops 2 px, the day sinks in already on hover. The scenes press each part every few seconds.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'well',
                name: 'The key goes in',
                see: 'A key at rest is raised moulding; pressed, it turns into a well (the shadow inside its top edge, the light under it, its ground one step into shadow) and its lamp is full; the part does not move, 2 frames.',
                verdict: rec('it is how a moulded key looks pushed in, it never shifts the words, and no other theme presses this way.'),
            },
            {
                key: 'drop',
                name: 'Drops 1 px (titanium’s press)',
                see: 'The pressed part sinks 1 px with its lamp full, then comes back.',
                verdict: not('a small, exact answer, but it is titanium’s press: on a nostromo page it would feel borrowed.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button fills its lamp and darkens, the legend key drops 2 px, the day sinks 1 px across and 2 px down, the key figure changes its plate.',
                verdict: not('three presses, and two of them move the words.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G15',
        question: 'Where does the label tape go, where Michroma, and where the mono?',
        why: 'Nostromo has three faces: Michroma (the case’s printed type), Titillium Web (prose) and a system mono (the label tape). Your key figure, strip and trend set their figures in the mono, which is titanium’s voice exactly (figures, labels and counts in mono) and terminal’s.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'michroma',
                name: 'Label tape names, Michroma counts, the screen reads out',
                see: 'Labels, the button and the tag on label tape (mono capitals, tracked wide); the title and the figure in Michroma; the prose in Titillium; on the screen everything in the phosphor mono.',
                verdict: rec(
                    'each face has one job you can see, the wide Michroma figures are the console’s own printed numerals, and no other theme counts in them.',
                ),
            },
            {
                key: 'mono',
                name: 'Mono for figures, labels and counts (titanium’s and terminal’s)',
                see: 'The figure, the label, the tag and the table’s values in the mono; Michroma only for the title.',
                verdict: not('it is how your picks read today and it is very legible, but it is titanium’s voice exactly and terminal’s.'),
            },
            {
                key: 'display',
                name: 'Michroma everywhere',
                see: 'The title, the label, the figure, the button and the tag in Michroma; the label tape retired.',
                verdict: not('striking, but Michroma is wide: labels and buttons grow by a third, and the label tape (the theme’s own idea) goes.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Lamps, tape, vents, screws',
        rule: 'G16',
        question: 'Where do the ship’s motifs go?',
        why: 'Nostromo has a small set of motifs: the lamp (a switch, a reading), the label tape (a label), the vent slots (the case, the meter, the divider), screws (what is screwed shut), and on a screen the scanlines, the block cursor and the tracker’s ring. A motif keeps its meaning only where the ship has it.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'place',
                name: 'Only where the ship has them',
                see: 'The meter’s vents and its tape mark; blips and the tracker ring on the screen’s events; a plain moulded card; the button’s lamp; a plain list; the empty state’s vents and tape; a row of vent slots as the divider.',
                verdict: rec('each motif keeps one meaning: a lamp is always a switch or a reading, tape always a name, vents always the case.'),
            },
            {
                key: 'none',
                name: 'None',
                see: 'A plain bar for the meter, plain dots for the events, no lamp on the button, a plain empty state and a plain rule.',
                verdict: not('safe, but nostromo becomes a beige formal: the lamp, the tape and the vents were the theme.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'Screws on every card, scanlines on the card, a lamp before every list item, hazard chevrons as the divider.',
                verdict: not('a film set: the motifs stop meaning anything and the lamps no longer say who acts.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="nostromo"]'));
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
lookLine.setAttribute('data-for', 'nostromo');
lookLine.textContent = `${ASPECTS.length} questions, one rule of nostromo each; the first option of every question is the recommendation. Pick the one that is nostromo to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-nc-aspects]'));
const toc = document.querySelector('[data-nc-toc]');
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'nc-aspect';
    box.id = `nc-${a.id}`;
    box.setAttribute('data-nc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-nc-${a.id}`);
    box.innerHTML = `<div class="nc-aspect__head">
        <h3 id="h-nc-${a.id}"><span class="nc-aspect__no">${n + 1}</span> ${a.label} <span class="nc-aspect__rule">${a.rule}</span></h3>
        <p class="nc-aspect__q"></p><p class="nc-aspect__why"></p></div><div class="nc-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.nc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.nc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.nc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'nc-col';
        col.setAttribute('data-nc-option', String(at + 1));
        col.innerHTML = `<p class="nc-label"><span class="nc-label__no">${at + 1}</span> <span class="nc-label__name"></span>${
            at === 0 ? ' <span class="nc-label__rec">Recommended</span>' : ''
        }</p><p class="nc-see"></p><p class="nc-verdict"></p>
        <div class="nc-scene" data-nc-kind="${a.kind}" data-nc-${a.id}="${o.key}" data-nc-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.nc-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.nc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.nc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('nc-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#nc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part.
const BANDS = { frames: [160, 320, 640, 1600], brisk: [80, 160, 320, 960], slow: [240, 480, 960, 2400] };
for (const scene of section.querySelectorAll('[data-nc-durations]')) {
    const [contact, strike, print, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-nc-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-nc-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms, ${contact / 80} ${contact === 80 ? 'frame' : 'frames'}`);
    say('strike', `${strike} ms, ${strike / 80} frames`);
    say('print', `${print} ms, ${print / 80} frames`);
    say('loop', `${loop} ms a cycle`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-nc-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1100],
    ['hold', 1600],
    ['out', 900],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.nc-scene[data-nc-kind="cycle"]')) scene.setAttribute('data-nc-phase', phase);
    if (phase === 'in') {
        tick += 1;
        for (const num of section.querySelectorAll('.nc-scene[data-nc-kind="cycle"] [data-nc-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('.nc-scene[data-nc-kind="cycle"] [data-nc-word]'))
            word.textContent = tick % 2 ? 'Draining' : 'Running';
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
radio('data-nc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--nc-slow', String(slow));
    run(0);
});
radio('data-nc-state', (value) => {
    section.setAttribute('data-nc-show', value);
});
document.querySelector('[data-nc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.nc-scene a, .nc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided nostromo components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=nostromo`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-nc-gallery]'));
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
