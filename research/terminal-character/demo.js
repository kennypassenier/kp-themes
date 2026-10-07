// What makes terminal terminal (Kenny, 2026-10-07 14:32: "doe nu terminal"),
// the same way as titanium, forest, nostromo, cyberpunk, synthwave, solstice,
// brutalism, grotesk and blueprint (02:54: "waar jij eerst uitzoekt wat bij
// mekaar past, wat niet past en dan zo voorstellen doet"). Terminal is the
// tenth theme of the series, and the first with all six family picks
// approved (research/families/VERDICTS.md, 01:32).
//
// A review-kit demo in aspect mode, terminal only. Each ASPECT is one rule of
// the theme's grammar (themes/terminal/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-tc-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here (its cursor blink is terminal's live
// family), never a target.

/* ----------------------------------------------------------- the parts */

/** The block cursor that writes: rides the head of a line typed, the start of a line printed, the cut of a line deleted (G2, G3, G12). */
const CUR = `<span class="tc-cur" aria-hidden="true"></span>`;

/** A package button with its label span. */
const button = (/** @type {string} */ label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span></button>`;

/** The level a tone says before its figure, as a log line writes it (G13); options.css shows it where the option asks. */
const level = (/** @type {string} */ kind, /** @type {string} */ word) => `<span class="tc-level" data-tc-kind="${kind}">[${word}]</span>`;

/**
 * The place a waiting reading will be written (G10), with every loading
 * picture an option may draw in it: the cursor (`.tc-wait__cur`), a run of
 * cells along the foot (`.tc-wait__run`, written, walked or filled by the
 * block cursor) and the prompt line (`.tc-wait__txt`). options.css shows
 * one. `first` marks the one place of a
 * surface where its single cursor stands.
 */
const wait = (/** @type {string} */ kind, i = 0, first = i === 0) =>
    `<span class="tc-wait tc-wait--${kind}${first ? ' tc-wait--first' : ''}" style="--i: ${i}" aria-hidden="true"><span class="tc-wait__cur"></span><span class="tc-wait__run"></span><span class="tc-wait__txt"></span></span>`;

/** The change, with its sign, underlined (G13, the tone family). */
const change = (/** @type {string} */ text, dir = 'up') => `<span class="tc-change" data-tc-dir="${dir}">${dir === 'up' ? '+' : '-'}${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter tc-meter" role="meter" aria-label="Load, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A line in time on braille cells (the chart's shape pick). */
const plot = (cls = '', extra = '') => `<div class="tc-plot ${cls}" aria-hidden="true"${extra}><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="tc-plot__line" points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="butt" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg></div>`;

/**
 * A part that is typed out (G2): `n` its cells, `lines` its lines, `at` the
 * cells typed before it in its row, `lat` the lines printed before it,
 * `total` and `ltotal` the row's cells and lines. Leaving plays the arrival
 * backwards (Kenny, 15:16), so the last part of a row goes first: `--tc-back`
 * and `--tc-lback` are the cells and lines after it.
 */
const typed = (n = 20, lines = 1, at = 0, lat = 0, total = n + at, ltotal = lines + lat) =>
    `--tc-n: ${n}; --tc-lines: ${lines}; --tc-at: ${at}; --tc-lat: ${lat}; --tc-back: ${total - at - n}; --tc-lback: ${ltotal - lat - lines}`;

const PART = {
    /** A plate: a line of htop between square brackets. */
    tile: (title = 'db-01', body = 'postgres 16 · up 41 d', cls = 'tc-arrives', extra = '') =>
        `<div class="kp-card tc-plate tc-tile ${cls}" style="${typed(24, 2)}" ${extra}>${CUR}<p class="kp-card__title tc-title">${title}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'jobs', value = '412', foot = change('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi tc-plate tc-kpi ${cls}" style="${typed(12, 3)}" ${extra}>${CUR}
        <span class="kp-kpi__label tc-label">${label}</span>
        <span class="tc-carrier"><span class="kp-kpi__value tc-figure" data-tc-num>${value}</span></span>
        <span class="kp-kpi__trend">${foot} <span class="tc-faint">on last week</span></span>
    </div>`,
    days: (n = 7, from = 12, cls = 'tc-arrives') =>
        `<div class="tc-days" aria-hidden="true">${[...Array(n).keys()]
            .map(
                (i) =>
                    `<span class="tc-day ${cls}" style="${typed(3, 1, i * 3, 0, n * 3, 1)}">${CUR}<span class="tc-day__num">${from + i}</span></span>`,
            )
            .join('')}</div>`,
    // Three lines of 19 cells are one row of 57: sent in the 1088 ms a part
    // may take (G4), each cell 19 ms.
    rows: () =>
        `<div class="tc-rows" aria-hidden="true" style="--tc-cell: 19ms">${['4112 nginx    0.4 %', '4120 postgres 2.1 %', '4188 backup  11.0 %']
            .map((t, i) => `<span class="tc-row-line tc-arrives" style="${typed(19, 1, i * 19, i, 57, 3)}">${CUR}${t}</span>`)
            .join('')}</div>`,
    strip: () =>
        `<div class="tc-strip" aria-hidden="true">${[
            ['cpu', '38 %'],
            ['mem', '4.1G'],
            ['swap', '12M'],
        ]
            .map(
                ([l, v], i) =>
                    `<div class="tc-strip__col tc-plate tc-arrives" style="${typed(7, 2, i * 7, 0, 21, 2)}">${CUR}<span class="tc-label">${l}</span><span class="tc-figure">${v}</span></div>`,
            )
            .join('')}</div>`,
    menu: () => `<div class="tc-menu-wrap">
        ${button('file ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="tc-pop-wrap"><div class="kp-popover tc-pop tc-window tc-opens" style="--tc-lines: 4">${CUR}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">open log</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">tail -f</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">kill 4188</button></li>
        </ul></div></div>
    </div>`,
    dialog: () => `<div class="tc-dialog-wrap"><div class="kp-dialog tc-dialog tc-window tc-opens" role="group" aria-label="A dialog opening" style="--tc-lines: 6">${CUR}
        <p class="kp-dialog__title tc-title">kill process 4188?</p>
        <p class="kp-dialog__description">backup stops; the last archive stays.</p>
        <div class="kp-dialog__actions">${button('cancel', 'kp-button--sm')}${button('kill', 'kp-button--sm kp-button--primary')}</div>
    </div></div>`,
    state: (word = 'running', kind = 'good') =>
        `<span class="tc-state" data-tc-kind="${kind}"><span class="tc-carrier tc-carrier--mark"><span class="tc-state__dot" aria-hidden="true"></span></span><span class="tc-carrier"><span class="tc-state__word" data-tc-word>${word}</span></span></span>`,
    alert: (text = '> backup finished, 2.1 GB') =>
        `<div class="kp-alert tc-alert tc-leaves" role="status" style="--tc-n: 26; --tc-lines: 1">${CUR}<span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="tc-spark-wrap"><span class="kp-kpi__label tc-label">load, 24 h</span><span class="tc-carrier tc-carrier--line"><span class="tc-spark" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg></span></span></div>`,
    column: (label = 'cpu', value = '38') =>
        `<div class="tc-column tc-plate"><span class="tc-label">${label}</span><span class="tc-carrier"><span class="tc-figure" data-tc-num>${value}</span></span></div>`,
    field: () =>
        `<label class="kp-field tc-field"><span class="kp-field__label">hostname</span><input class="kp-field__input" value="db-01" /></label>`,
};
const caption = (/** @type {string} */ text) => `<p class="tc-cap">${text}</p>`;
const cell = (/** @type {string} */ cap, /** @type {string} */ html, cls = '') => `<div class="tc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const waitingKpi = () =>
    `<div class="kp-kpis"><div class="kp-kpi tc-plate tc-kpi tc-waits" aria-busy="true"><span class="kp-kpi__label tc-label">jobs</span>${wait(
        'figure',
    )}<span class="kp-kpi__trend tc-faint">on last week</span></div></div>`;

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('A week is typed, day by day', PART.days(7), 'tc-part--wide') +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A value changes', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('A part waits (a loop)', waitingKpi());

const ARRIVAL = () =>
    cell('A week of days arrives', PART.days(7), 'tc-part--wide') +
    cell('A list of processes', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A strip of columns', PART.strip()) +
    cell('A line in time', plot('tc-plot--draws tc-arrives', ` style="${typed(32, 4)}"`).replace('<svg', `${CUR}<svg`));

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card tc-plate tc-tile tc-waits" aria-busy="true"><p class="kp-card__title tc-title">db-02</p>${wait('body')}${wait('body', 1)}</div>`;

const DURATION = () =>
    cell(
        'Contact: a button pressed',
        `<div class="tc-row">${button('restart', 'tc-press')}</div><p class="tc-readout" data-tc-readout="contact"></p>`,
    ) +
    cell('A part typed: a tile arrives', PART.tile() + '<p class="tc-readout" data-tc-readout="part"></p>') +
    cell('A panel printed: a menu opens', PART.menu() + '<p class="tc-readout" data-tc-readout="panel"></p>') +
    cell('A loop: a tile waits', `${waitingTile()}<p class="tc-readout" data-tc-readout="loop"></p>`);

const COLOUR = () =>
    cell('Buttons, one pointed at', `<div class="tc-row">${button('restart', 'tc-pointed')}${button('deploy', 'kp-button--primary')}</div>`) +
    cell('A meter', meter(0.62, 0.8)) +
    cell(
        'A pinned reading over a chart',
        `<div class="kp-popover tc-pop tc-window tc-tip"><p class="tc-tip__head"><b>07:30</b> load</p><p class="tc-tip__row"><span>db-01</span> <span class="tc-figure">0.62</span></p></div>`,
    ) +
    cell(
        'Key figures and a title',
        `<p class="tc-heading">uptime</p><div class="kp-kpis tc-kpi-row">${PART.kpi('jobs', '412', change('6 %'))}${PART.kpi('errors', '3', change('1', 'down'))}</div>`,
        'tc-part--wide',
    ) +
    cell('A warning, tags', `<div class="tc-row">${level('warn', 'warn')}<span class="kp-badge">v16</span><span class="kp-tag">eu-west</span></div>`);

const SURFACE = () =>
    cell('Card', PART.tile('db-01', 'postgres 16 · up 41 d', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('requests', '18 240', change('6 %'))}</div>`) +
    cell('A plot of data', `<div class="tc-plate tc-plot-plate">${plot('tc-plot--paper')}</div>`) +
    cell('A state', `<div class="tc-plate tc-state-plate">${PART.state('running')}</div>`) +
    cell(
        'A menu over the page',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">open log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">tail -f</button></li></ul></div>`,
    ) +
    cell(
        'Buttons, a tag, a field',
        `<div class="tc-row">${button('restart')}${button('deploy', 'kp-button--primary')}<span class="kp-badge">v16</span></div>${PART.field()}`,
    );

/** The tone scene does not replay; its figures and words stay as written. */
const steady = (/** @type {string} */ html) => html.replace(/ data-tc-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis tc-kpi-row">${PART.kpi('jobs', '412', change('6 %'))}<div class="kp-kpi tc-plate tc-kpi tc-toned" data-tc-kind="warn"><span class="kp-kpi__label tc-label">queue age</span><span class="tc-toned__line">${level(
                'warn',
                'warn',
            )}<span class="kp-kpi__value tc-figure tc-toned__figure">14 m</span></span><span class="kp-kpi__trend">${change('9 m', 'up')} <span class="tc-faint">on last hour</span></span></div></div>`,
            'tc-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card tc-plate tc-tile tc-toned" data-tc-kind="bad"><p class="kp-card__title tc-title tc-toned__line">${level(
                    'bad',
                    'fail',
                )}<span class="tc-toned__figure">db-03</span></p><p class="kp-card__body">no heartbeat since 16:40</p></div>`,
            ) +
            cell(
                'A failed state',
                `<div class="tc-plate tc-state-plate tc-toned" data-tc-kind="bad"><span class="tc-toned__line">${level('bad', 'fail')}<span class="tc-toned__figure">${PART.state(
                    'stopped',
                    'bad',
                )}</span></span></div>`,
            ) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">open log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive tc-toned" data-tc-kind="bad"><span class="tc-toned__line">${level(
                    'bad',
                    'kill',
                )}<span class="tc-toned__figure">kill 4188</span></span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="tc-plate tc-meter-plate tc-toned" data-tc-kind="warn"><span class="tc-cap tc-toned__line">${level(
                    'warn',
                    'warn',
                )}<span class="tc-toned__figure">disk near full</span></span>${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its mark', PART.state('running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card tc-plate tc-tile"><p class="kp-card__title tc-title">db-01</p><p class="kp-card__body"><span class="tc-carrier"><span data-tc-num>4 jobs</span></span></p></div>`,
    );

/** Every waiting part of the dashboard, the loading picture drawn in each. */
const LOADERS = () =>
    cell('Key figure', waitingKpi()) +
    cell(
        'Busy table',
        `<div class="tc-table tc-plate tc-waits" aria-busy="true"><span class="tc-table__head">pid</span><span class="tc-table__head">cpu</span>${[
            0, 1, 2,
        ]
            .map((i) => wait('row', i))
            .join('')}</div>`,
    ) +
    cell(
        'Menu, its loading entry',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-waits tc-entry-wait" aria-busy="true">hosts: ${wait(
            'entry',
        )}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="tc-days tc-days--wait">${[0, 1, 2, 3, 4].map((i) => `<span class="tc-day tc-waits">${wait('day', i)}</span>`).join('')}</div>`,
    ) +
    cell('Meter, measuring', `<div class="tc-plate tc-meter-plate tc-waits" aria-busy="true">${caption('disk')}${wait('meter')}</div>`) +
    cell('A tile', waitingTile()) +
    cell(
        'The package, as approved: the braille spinner and the busy bar',
        `<div class="tc-row"><span class="kp-spinner" role="status" aria-label="Working…"></span><div class="kp-progressbar tc-bar" role="progressbar" aria-label="Copying" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div></div>`,
    );

/** A part that leaves and arrives. */
const LEAVE = () =>
    cell('An alert', PART.alert()) +
    cell('A card', PART.tile('db-01', 'postgres 16 · up 41 d', 'tc-leaves')) +
    cell(
        'A key figure',
        `<div class="kp-kpi tc-plate tc-kpi tc-leaves" style="--tc-n: 12; --tc-lines: 2">${CUR}<span class="kp-kpi__label tc-label">jobs</span><span class="kp-kpi__value tc-figure">412</span></div>`,
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="tc-row">${button('restart', 'tc-alone')}${button('deploy', 'kp-button--primary tc-alone')}</div>`,
        'tc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header tc-header tc-plate"><div class="kp-page-header__inner"><div><p class="kp-page-header__title tc-title">hosts</p><p class="kp-page-header__description">twelve machines, eu-west.</p></div>
        <div class="kp-page-header__actions">${button('export', 'kp-button--sm tc-in-header')}${button('add host', 'kp-button--sm kp-button--primary tc-in-header')}</div></div></header>`,
        'tc-part--wide',
    ) +
    cell(
        'Menu: its entries',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-in-entry">open log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">tail -f</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its open link',
        `<div class="kp-card tc-plate tc-tile"><p class="kp-card__title tc-title">db-01</p><a class="kp-button kp-button--sm tc-tile-link" href="#tc-intro"><span class="kp-button__label">open</span></a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card tc-window tc-drawer"><p class="kp-card__title tc-title">step 2 of 4</p><p class="kp-card__body">the filter keeps your region.</p><div class="tc-row">${button(
            'skip',
            'kp-button--sm tc-in-drawer',
        )}${button('next', 'kp-button--sm kp-button--primary tc-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi tc-plate tc-kpi tc-in-kpi" href="#tc-intro"><span class="kp-kpi__label tc-label">jobs</span><span class="kp-kpi__value tc-figure">412</span><span class="kp-kpi__trend tc-faint">since monday</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="tc-row">${button('restart', 'tc-pointed')}${button('deploy', 'kp-button--primary')}</div>`) +
    cell(
        'Menu entries, the first pointed at',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-pointed">open log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">tail -f</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">rename</button></li></ul></div>`,
    ) +
    cell(
        'Tile with its open link pointed at',
        `<div class="kp-card tc-plate tc-tile"><p class="kp-card__title tc-title">db-01</p><p class="kp-card__body">postgres 16 · up 41 d</p><a class="kp-button kp-button--sm tc-tile-link tc-pointed" href="#tc-intro"><span class="kp-button__label">open</span></a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis tc-kpi-row"><a class="kp-kpi tc-plate tc-kpi tc-pointed" href="#tc-intro"><span class="kp-kpi__label tc-label">jobs</span><span class="kp-kpi__value tc-figure">412</span></a><a class="kp-kpi tc-plate tc-kpi" href="#tc-intro"><span class="kp-kpi__label tc-label">errors</span><span class="kp-kpi__value tc-figure">3</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="tc-days">${[12, 13, 14, 15].map((d) => `<span class="tc-day${d === 13 ? ' tc-pointed' : ''}"><span class="tc-day__num">${d}</span></span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell(
        'Button and primary button',
        `<div class="tc-row">${button('restart', 'tc-focused')}${button('deploy', 'kp-button--primary tc-focused')}</div>`,
    ) +
    cell('Header action', `<div class="tc-header-mini tc-plate">${button('export', 'kp-button--sm tc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi tc-plate tc-kpi tc-focused" href="#tc-intro"><span class="kp-kpi__label tc-label">jobs</span><span class="kp-kpi__value tc-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-focused">tail -f</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="tc-days"><span class="tc-day"><span class="tc-day__num">13</span></span><span class="tc-day tc-focused"><span class="tc-day__num">14</span></span><span class="tc-day"><span class="tc-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card tc-plate tc-tile"><p class="kp-card__title tc-title">db-01</p><a class="kp-button kp-button--sm tc-tile-link tc-focused" href="#tc-intro"><span class="kp-button__label">open</span></a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="tc-row">${button('restart', 'tc-press')}</div>`) +
    cell('Primary button', `<div class="tc-row">${button('deploy', 'kp-button--primary tc-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover tc-pop tc-pop--static tc-window"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-press">tail -f</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="tc-days"><span class="tc-day tc-press"><span class="tc-day__num">14</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle tc-plate tc-kpi tc-press" aria-pressed="false"><span class="kp-kpi__label tc-label">failed jobs</span><span class="kp-kpi__value tc-figure">4</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card tc-plate tc-type"><p class="tc-type__label">db-01, eu-west</p><p class="tc-type__head">backups this week</p>
        <p class="tc-type__prose">two archives on db-01 ran 40 minutes long after the index rebuild; the schedule moves to 02:00 from friday.</p>
        <p class="tc-type__figure"><span class="tc-figure">14</span> <small>runs</small> ${change('3', 'down')}</p>
        <div class="tc-type__strip">${[
            ['cpu', '38 %'],
            ['mem', '4.1G'],
            ['swap', '12M'],
        ]
            .map(([l, v]) => `<div><span class="tc-label">${l}</span><span class="tc-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="tc-type__table"><tbody><tr><th scope="row" class="tc-label">host</th><td>db-01.eu-west</td></tr><tr><th scope="row" class="tc-label">last run</th><td><span class="kp-timestamp tc-stamp">2026-10-07 08:12</span></td></tr></tbody></table>
        <p>${button('open log', 'kp-button--sm')} <span class="kp-badge tc-tagged">v16</span></p></div>`,
        'tc-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell('A plot of data', `<div class="tc-plate tc-plot-plate">${plot('tc-plot--paper')}</div>`) +
    cell(
        'A card and a warning card',
        `<div class="tc-motif-pair">${PART.tile('db-01', 'postgres 16 · up 41 d', 'tc-motif-card')}<div class="kp-card tc-plate tc-tile tc-motif-warn tc-toned" data-tc-kind="warn"><p class="kp-card__title tc-title tc-toned__line">${level(
            'warn',
            'warn',
        )}<span class="tc-toned__figure">db-03</span></p><p class="kp-card__body">replica 14 m behind</p></div></div>`,
        'tc-part--wide',
    ) +
    cell(
        'Changes, today and the pick',
        `<div class="tc-row">${change('6 %')}${change('3 %', 'down')}</div><div class="tc-days tc-days--motif">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="tc-day${d === 13 ? ' tc-today' : ''}${d === 14 ? ' tc-picked' : ''}"><span class="tc-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty tc-motif-empty"><p class="kp-empty__title">no hosts yet</p><p class="kp-empty__body">the first one joins on monday.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="tc-cap">web</p><div class="tc-divider" data-kp-divider></div><p class="tc-cap">data</p>`);

/* ------------------------------------------------------------ the aspects */

const rec = (/** @type {string} */ why) => `Recommended: this one, because ${why}`;
const not = (/** @type {string} */ why) => `Not recommended, because ${why}`;

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
        label: 'The step',
        rule: 'G1',
        question: 'How does terminal move: one hard step per character or line written, two jumps whatever the distance, or a smooth glide?',
        why: 'Your register moves in two jumps (steps(2, end)) whatever it moves; your picks count what they write: the meter types its share in 32 steps, the tiles in 16, the menus print in 4 and 8 lines, the dialog in 6 rows. Hard steps alone are close to nostromo’s frame clock, cyberpunk’s ticks and retro’s snaps; no theme lets the length of what is written set the count.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'cells',
                name: 'One hard step per cell or line written',
                see: 'A day and its space are typed in three steps, a tile of 24 cells in 24, the menu printed in its 4 lines; nothing moves between the steps. The waiting cursor blinks on its own clock.',
                verdict: rec(
                    'it is how a terminal writes, it keeps the counts of your picks and makes them a rule, and no other theme counts cells or lines.',
                ),
            },
            {
                key: 'two',
                name: 'Two jumps, whatever the distance (your register’s steps(2, end))',
                see: 'Everything appears in two hard jumps: half of it, then all of it.',
                verdict: not(
                    'it is the register today, but two jumps say nothing about what is written, and a long line jumps as far as a short one.',
                ),
            },
            {
                key: 'glide',
                name: 'A smooth glide (your drawer’s slide; near grotesk’s even pace)',
                see: 'Every line is uncovered at an even pace, without steps.',
                verdict: not('it is smooth, but a screen does not draw half a character, and an even glide is grotesk’s pace.'),
            },
        ],
    },
    {
        id: 'arrival',
        label: 'How a part arrives',
        rule: 'G2',
        question: 'When a part arrives, how is it written?',
        why: 'Your arrival family is the meter’s Typed out: left to right in hard steps. Your headline (2026-09-08) types itself the same way with a block cursor riding the last character; the families’ picture types without it. Your chart’s series is printed from the top instead, which is how a panel opens, and near nostromo’s raster and titanium’s cut.',
        kind: 'cycle',
        scene: ARRIVAL,
        options: [
            {
                key: 'cursor',
                name: 'Typed out, the cursor at the head of the line',
                see: 'Each part is typed from its first cell to its last, one cell a step (34 ms), with the block cursor on the cell being written; the cursor moves on to the next part when one is done. The line in time is typed along itself.',
                verdict: rec(
                    'it is your family with your headline’s cursor, so arriving reads as being typed, and no other theme writes with a cursor.',
                ),
            },
            {
                key: 'bare',
                name: 'Typed out without the cursor (your family as the meter draws it)',
                see: 'The same typing, cell by cell, with no cursor at its head.',
                verdict: not('it is your family exactly, but without its writer it reads as a stepped wipe, close to titanium’s feed.'),
            },
            {
                key: 'print',
                name: 'Printed from the top (your chart’s pick; near nostromo’s raster and titanium’s cut)',
                see: 'Each part appears line by line from its top.',
                verdict: not('it is how a panel opens (question 3), and a top-down reveal is titanium’s cut and nostromo’s raster order.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening a menu or a dialog',
        rule: 'G3',
        question: 'How does a menu, a popover, the dialog or the drawer open?',
        why: 'Your menus and the header’s menu are Printed (top down in 4 and 8 lines) and your dialog prints its 6 rows: three of your picks agree. A top-down reveal is also titanium’s opening (smooth, on its curve); what tells terminal’s apart is whole lines and the cursor. Your drawer is Piped in: it slides in from its edge.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'feed',
                name: 'Printed by line feeds, the cursor at the next line',
                see: 'The panel is printed one whole line per step (136 ms, four cells’ time), the block cursor standing at the start of the line being printed; it closes as the print played backwards, the lines cleared from the bottom.',
                verdict: rec(
                    'it keeps your three printed picks, the cursor makes it a terminal’s print rather than a cut, and it is no other theme’s opening.',
                ),
            },
            {
                key: 'print',
                name: 'Printed line by line, no cursor (your menus’ pick; near titanium’s cut)',
                see: 'The same lines from the top, without the cursor.',
                verdict: not('it is your pick, but without the cursor a top-down reveal reads as titanium’s cut.'),
            },
            {
                key: 'pipe',
                name: 'Slid in from its edge (your drawer’s Piped in; titanium’s edge slide)',
                see: 'The panel slides in from its right edge at an even pace, 220 ms.',
                verdict: not('it is quick, but a screen cannot move a panel, and a slide from the edge is titanium’s drawer.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does each kind of motion take?',
        why: 'Your picks run one-shots at fifteen durations (90 ms to 1.2 s) and loops at eight (0.8 to 2.4 s). Your headline types at 34 ms a character (29.4 a second, a 300-baud line) and your caret blinks once a second. Two clocks: the line for what is written, the blink for what blinks.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'clocks',
                name: 'Two clocks: the line and the blink',
                see: 'A cell 34 ms, a printed line 136 ms (four cells); the slow blink once a second for waiting, the rapid one (300 ms) for a change. The press in one cell, the tile typed in its 24 cells (816 ms), the menu printed in its 4 lines (544 ms), the wait blinking once a second.',
                verdict: rec('every duration follows from what is written, and no other theme counts in characters.'),
            },
            {
                key: 'picks',
                name: 'As your picks have them',
                see: 'The tile 500 ms, the menu 300 ms, the press at once, the wait a row of dots stepping every 1.2 s.',
                verdict: not('each was right on its own, but side by side the parts keep different time.'),
            },
            {
                key: 'instant',
                name: 'At once (retro’s 0 ms)',
                see: 'Everything appears and changes at once; only the waiting cursor still blinks.',
                verdict: not('it is the quietest, but the screen being written is the theme.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What does terminal colour, and how brightly?',
        why: 'The anatomy: one hue at 120°, varied only by lightness, red for danger, the yellow-green accent as the last hue. Your picks add a yellow frame with a glow (the chart’s oscilloscope tooltip), cyan and yellow bands (the handshake waterfall), a glow on every meter bar, and a green star.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'phosphor',
                name: 'One phosphor at three brightnesses',
                see: 'Bright phosphor for what is written now and what you do (the cursor, the primary, the pointed ring); the phosphor for words; the dim phosphor for frames, brackets and labels. The bloom only on bright text. Yellow-green only for the meter’s mark and a warning; red only for danger.',
                verdict: rec('brightness carries the meaning, as on a real screen, and the monochrome stays whole.'),
            },
            {
                key: 'hues',
                name: 'Second hues and glows (your picks; near cyberpunk’s and synthwave’s neon)',
                see: 'The pinned reading in a yellow frame with a glow, the meter’s bars glowing, a cyan accent on the figures.',
                verdict: not('they catch the eye, but a glowing frame is cyberpunk’s and synthwave’s neon, and the anatomy allows one hue.'),
            },
            {
                key: 'flat',
                name: 'One flat brightness, no bloom (near high-contrast’s flat ink)',
                see: 'Everything in the same phosphor: words, frames, labels and the cursor; no bloom.',
                verdict: not('it is calm, but without brightness a monochrome screen has no way left to say what matters.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What does a plate (card, key figure, tile, the plot, a state) look like, and a window over the page?',
        why: 'Your shape family is the meter’s htop meter: square brackets as the frame of every plate. Your key figure and tiles draw a grid of character cells on the plate (close to blueprint’s millimetre paper, synthwave’s grid console and dark’s oscilloscope); your trend, state and menu frame in a double line; the register frames every card all round.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'htop',
                name: 'A line of htop: square brackets at its two ends (your family)',
                see: 'No fill and no frame on a plate: a bracket at each end in the dim phosphor, like [||||   ] in htop. What floats over the page (the menu) is a curses window: one box line, no shadow.',
                verdict: rec(
                    'it is your shape family on every plate, and brackets at two ends are no other theme’s (cyberpunk’s and blueprint’s hold four corners).',
                ),
            },
            {
                key: 'cells',
                name: 'A grid of cells on every plate (your key figure and tiles; near blueprint’s paper and synthwave’s console)',
                see: 'Every plate ruled with a faint grid of character cells inside a thin frame.',
                verdict: not('it is technical, but a grid on a plate is blueprint’s millimetre paper and synthwave’s grid console.'),
            },
            {
                key: 'box',
                name: 'A double box line round every plate (your trend, state and menu; near high-contrast’s ink frame)',
                see: 'Every plate inside a double frame, like ═══ box drawing.',
                verdict: not('it is very much a TUI, but a double frame is the dialog’s, and a frame round every part is high-contrast’s.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How is a warning or a failure shown?',
        why: 'Your tone family is the key figure’s dumb-terminal plot: the change underlined, a warning or failed figure on the tone’s square plate. In this theme the warning’s ink is 1.01:1 against the green phosphor, so it is told by hue alone; the anatomy already said a warning needs a cue that is not colour. Your menu’s pick draws an edge bar instead (grotesk’s index).',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'level',
                name: 'In reverse, in its colour, with its level: [warn] or [fail]',
                see: 'The figure or title stands on the tone’s plate in reverse video, and the level is written before it, bracketed, in the tone’s ink, as a log line writes it. The change is underlined.',
                verdict: rec(
                    'it is your family, the word carries the tone where the colour cannot, and a log level in brackets is no other theme’s.',
                ),
            },
            {
                key: 'plate',
                name: 'In reverse, in its colour (your family as drawn)',
                see: 'The figure or title on the tone’s plate, no word.',
                verdict: not('it is your family, but a warning plate and a normal value are nearly the same green.'),
            },
            {
                key: 'edge',
                name: 'An edge bar (your menu’s The bell; grotesk’s index)',
                see: 'A 2 px bar in the tone down the part’s start edge, the figure in the tone’s ink.',
                verdict: not('it is quiet, but a bar down the start edge is grotesk’s index, and it is easy to miss.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a value changes in place?',
        why: 'Your live family is the graph’s The cursor blink: what changed blinks three times like a cursor (900 ms). The graph blinks off and on, so for a moment the value is gone; the package’s rule for every live update is that the value stays readable. Your trend’s Reverse flash is high-contrast’s live family word for word, and it is measured at 1.05:1: it does not show.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'blink',
                name: 'Three rapid blinks, bright and dim (your family, readable)',
                see: 'The new value is written at once, then blinks three times between the bright and the dim phosphor, hard, 900 ms; it never disappears. The line and the mark blink the same way.',
                verdict: rec(
                    'it is your family as a terminal renders blink, the value can be read the whole time, and no other theme blinks a change.',
                ),
            },
            {
                key: 'off',
                name: 'Three blinks off and on (the graph’s, as drawn)',
                see: 'The value disappears and comes back three times, 900 ms.',
                verdict: not('it is the graph’s own, but the new value is gone half the time it is being announced.'),
            },
            {
                key: 'flash',
                name: 'The reverse flash (your trend’s; high-contrast’s bar flips)',
                see: 'The value flashes in reverse for a moment; the trend line only turns to the ink, which you can hardly see.',
                verdict: not('it is your pick, but it is high-contrast’s live family, and on the line it does not show at all (1.05:1).'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a part look like while its reading is on its way?',
        why: 'Your loading family is the busy table’s The cursor blinks: one block cursor where the words will be written, on and off, once a second. You liked the run of cells along the foot best, but along a foot is dark’s, forest’s, solstice’s and nostromo’s way. So every run below is the block cursor’s own work: it writes the cells and backspaces them, walks and leaves a decaying trail, heads an htop row, or types a prompt. The turning bar is dropped (the braille spinner already turns).',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'write',
                name: 'The cursor writes the cells and backspaces them',
                see: 'Along the foot of every waiting part the block cursor writes a row of cells, one hard step per cell, the cursor riding the last cell written. The row stands for a beat, then the cursor backs up and deletes the cells one step at a time, until only the waiting cursor is left. Then it writes again. Writing and deleting are the same steps in opposite order. A part that is already a row of cells (the heatmap days, the meter) keeps the waiting cursor alone, so it is not mistaken for a meter, and in the menu entry the cells sit on the baseline of the word.',
                verdict: rec(
                    'it is the run of cells you liked, but written and deleted by the block cursor, so it is the only waiting picture that shows the cursor working; at rest it is exactly your family’s cursor. It does replace the rule that nothing runs along the foot (G10).',
                ),
            },
            {
                key: 'trail',
                name: 'The cursor walks, the phosphor decays behind it',
                see: 'The block cursor steps along the foot one cell per step. Behind it the cells burn at the three brightnesses: the cell it just left in the ink, the one before in the dim phosphor, then gone. At the end it walks off the part and starts again at the start.',
                verdict: not(
                    'it is the busiest and nearest to the braille spinner’s decaying trail, but it only shows that something moves, not how far the work is, and it jumps back to the start instead of reversing.',
                ),
            },
            {
                key: 'bracket',
                name: 'An htop row, the cursor its head',
                see: 'A row between two square brackets with all its cells dim. The cells light in the ink one per step from the start, the last lit cell is the block cursor and blinks, and when the row is full the cursor backspaces it, one cell a step, the same 1000 ms back.',
                verdict: not(
                    'it is your signature progress bar looped, so it reads as a progress that never arrives; it is clearer as a bar than as waiting, and it is the fill and its reverse, so it breathes in and out.',
                ),
            },
            {
                key: 'prompt',
                name: 'A prompt line types its dots',
                see: 'In the first waiting place one line, a prompt and dots: > then . .. ... one dot per beat of the rapid clock (300 ms), the block cursor after the last dot, then the dots are backspaced one per beat and it starts again. One prompt per waiting part, no run along the foot.',
                verdict: not(
                    'it is the most terminal in words and takes no foot space, but it is the smallest, it needs a line of its own, and its beat is the rapid clock, not the line’s cell rate.',
                ),
            },
            {
                key: 'cursor',
                name: 'The cursor waits (your family, as approved)',
                see: 'One block cursor per waiting part, where its reading will be written, blinking once a second, hard. Labels stay readable; the braille spinner and the busy bar stay as approved.',
                verdict: not(
                    'it is your approved family and stays the quietest, but it only says that something waits, not that work is going on; the first option is this cursor at rest, with the work added.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave, and come back?',
        why: 'Your leave (2026-10-04, round seven): the block cursor glides back over the line in one fluent sweep, deleting it as it goes, in under half a second; you asked for the sweep yourself when you reworked your round-six pick, which backed up character by character. What arrives plays it backwards (your reverse-close).',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'glide',
                name: 'Deleted by the cursor in one sweep (your leave)',
                see: 'The cursor glides back from the end of the part to its start and the part is gone behind it, 480 ms; coming back, the cursor runs forward and writes it.',
                verdict: rec('it is your own leave, the one motion that glides because you asked for it, and no other theme deletes with a cursor.'),
            },
            {
                key: 'backspace',
                name: 'Backspaced, one cell a step (your round-six exit 3)',
                see: 'The cursor backs up one cell at a time, deleting a character per step; coming back, it types it.',
                verdict: not('it keeps the step rule exactly, but you reworked it into the sweep yourself.'),
            },
            {
                key: 'clear',
                name: 'Cleared line by line from the bottom',
                see: 'The part’s lines are cleared from the bottom up, one line a step; coming back, they are printed.',
                verdict: not('it is a terminal’s clear, but it is the opening backwards, so leaving and closing could not be told apart.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'Does a button inside a header, menu, tile, drawer or key figure behave like terminal’s own button?',
        why: 'Your header’s actions turn reverse on hover, take a 1 px dashed ring and drop 1 px when pressed; the menu’s entries turn reverse in the phosphor; the tile’s open link turns green between brackets inside a 2 px outline; the key figure as a link takes your hover family. Use the State buttons to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly terminal’s own',
                see: 'Every inner button, entry and link: the cursor ring and the blinking cursor after its label on hover, the dashed box on focus, reverse video while pressed, as the button standing alone.',
                verdict: rec('a control looks and answers the same wherever it is, so you learn it once.'),
            },
            {
                key: 'today',
                name: 'As today (your picks)',
                see: 'The header’s actions reverse on hover and drop 1 px; the menu’s entries reverse in the phosphor; the tile’s link in brackets and a 2 px outline; the key figure with a tint when pressed.',
                verdict: not('each fits its composite, but the same button answers five ways.'),
            },
            {
                key: 'quiet',
                name: 'Terminal’s own, but quiet inside a composite',
                see: 'Inside a composite the line only brightens on hover, without the ring and the cursor; the dashed box and reverse video stay.',
                verdict: not('it is calmer, but the cursor under the hand is your approved gap-4, and it would go missing where most buttons are.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'What happens to a part under the pointer?',
        why: 'Your hover family (the key figure’s): the cursor ring on hover. Your button already brings the blinking cursor after its label (gap-4, 2026-09-12). The register and your menu’s and header’s picks turn the part reverse under the pointer, which is high-contrast’s hover family (The bar flips) and the same picture terminal uses for the current tab and today.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'ring',
                name: 'The cursor ring, and the cursor after the label (your family and gap-4)',
                see: 'The part’s line turns the bright phosphor with a 1 px ring round it; a button also shows the blinking block after its label. Nothing moves; the others stay as they are.',
                verdict: rec(
                    'it is your family with your gap-4 cursor, it leaves reverse video to mean the current one, and no other theme rings in phosphor.',
                ),
            },
            {
                key: 'reverse',
                name: 'Reverse video (your menu’s and header’s picks; high-contrast’s bar flips)',
                see: 'The part under the pointer turns reverse: phosphor plate, dark letters.',
                verdict: not('it is the classic TUI highlight, but it is high-contrast’s hover family, and it looks exactly like the current item.'),
            },
            {
                key: 'hot',
                name: 'Brighter phosphor only (your register’s button)',
                see: 'The line and the letters brighten; no ring, no cursor.',
                verdict: not('it is subtle, but on a green screen one step brighter is easy to miss.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'DI2',
        question: 'How is the part that has keyboard focus marked?',
        why: 'Your hover family puts a dashed box on focus, 2 px out; the package’s two-channel ring (DI2) is what the register draws today; your header’s pick uses one 1 px dashed ring. On the near-black ground the bright dashed box reads at 12.7:1.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'dashed',
                name: 'The dashed box, 2 px out (your family)',
                see: 'A 2 px dashed box in the bright phosphor round the focused part, 2 px away from it, on the ground.',
                verdict: rec(
                    'it is your family, it stands on the dark ground where it is always visible, and it looks like a selection on a text screen.',
                ),
            },
            {
                key: 'ring',
                name: 'The package’s two-channel ring (the register today)',
                see: 'A light ring with a dark ring outside it.',
                verdict: not('it is the system’s constant, but it is the same in every theme and does not say terminal.'),
            },
            {
                key: 'thin',
                name: 'One 1 px dashed ring (your header’s pick)',
                see: 'A thin dashed line 2 px out.',
                verdict: not('it is neat, but one dashed pixel gets lost on the scanlines.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What happens to a part while it is pressed?',
        why: 'Your hover family’s press is reverse video, "as a line just entered"; the key figure draws it as a 16 % tint; the register presses with a darker ground you can barely see; your header’s pick drops the button 1 px, which is titanium’s press.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'reverse',
                name: 'Entered in reverse video (your family’s words)',
                see: 'While held, the part turns reverse: the primary plate, dark letters. Nothing moves.',
                verdict: rec('it is your family as it is worded, it is clearly seen, and it is how a terminal marks a line that was entered.'),
            },
            {
                key: 'tint',
                name: 'A phosphor tint (your key figure as drawn)',
                see: 'While held, the plate takes a 16 % phosphor tint.',
                verdict: not('it is gentle, but a tint is no terminal’s and is hard to see on the green.'),
            },
            {
                key: 'sink',
                name: 'Sinks 1 px (your header’s pick; titanium’s press)',
                see: 'While held, the part moves 1 px down.',
                verdict: not('it feels physical, but a screen cannot move a character, and the 1 px drop is titanium’s press.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'How does terminal write its labels, heads and tags?',
        why: 'Everything is one mono (the anatomy). The register writes its badges, table heads, tabs and menu headings in capitals tracked wide, which is nostromo’s, cyberpunk’s, synthwave’s and titanium’s label voice. Your own picks write as a shell does: the hex dump’s heads in lower case, the prompt listing with its >, the microlabel’s $.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'shell',
                name: 'As a shell writes: lower case, the sigils',
                see: 'Labels, heads and tags in lower case, untracked, with a sigil for what a line is: $ a label, # a note, > output. Figures in the same mono; capitals only where a terminal shouts.',
                verdict: rec('it is the voice of your hex dump and prompt listing, and no other theme writes its labels as a shell prints them.'),
            },
            {
                key: 'caps',
                name: 'Capitals tracked wide (the register; the dark themes’ label voice)',
                see: 'Labels, heads and tags in upright capitals, tracked 0.12 em.',
                verdict: not('it reads as a console, but tracked capitals are nostromo’s, cyberpunk’s, synthwave’s and titanium’s labels.'),
            },
            {
                key: 'plain',
                name: 'Plain sentence case, no sigils',
                see: 'Labels and heads start with a capital, no tracking, no sigils.',
                verdict: not('it is easy to read, but it is any theme’s voice in a mono font.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G16',
        question: 'Where do terminal’s motifs (the cursor, brackets, the box line, reverse video, the sigils, braille) appear?',
        why: 'Your picks put a grid of cells on two plates, a star on the tiles, glows on frames, and keep the meter’s mark blinking at rest (the anatomy allows only two loops: the sweep and the caret). On a text screen each mark means one thing.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'Brackets hold a line (the meter, a plate, a level); the box line is a window; reverse video is emphasis (today); the cursor only where something is written or waits (the empty prompt); braille dots for data; the change underlined; the divider +----+.',
                verdict: rec('each mark says one thing, so a glance reads the screen, and nothing blinks unless it waits.'),
            },
            {
                key: 'bare',
                name: 'Only text',
                see: 'No brackets, no cursor, no braille: plain frames, the warning by its word, today in bold, the divider a plain line.',
                verdict: not('it is pure, but it throws away the cursor and the brackets that make it a terminal, and boxes come back.'),
            },
            {
                key: 'all',
                name: 'On everything (as the picks spread them)',
                see: 'A cursor blinking on every plate, grids of cells behind them, a glow on the frames, a star mark, the meter’s mark blinking.',
                verdict: not('it is busy, and a cursor that blinks everywhere no longer says where something is being written.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="terminal"]'));
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
lookLine.setAttribute('data-for', 'terminal');
lookLine.textContent = `${ASPECTS.length} questions, one rule of terminal each; the first option of every question is the recommendation. Pick the one that is terminal to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-tc-aspects]'));
const toc = document.querySelector('[data-tc-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'tc-aspect';
    box.id = `tc-${a.id}`;
    box.setAttribute('data-tc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-tc-${a.id}`);
    box.innerHTML = `<div class="tc-aspect__head">
        <h3 id="h-tc-${a.id}"><span class="tc-aspect__no">${n + 1}</span> ${a.label} <span class="tc-aspect__rule">${a.rule}</span></h3>
        <p class="tc-aspect__q"></p><p class="tc-aspect__why"></p></div><div class="tc-trio" data-tc-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.tc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.tc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.tc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'tc-col';
        col.setAttribute('data-tc-option', String(at + 1));
        col.innerHTML = `<p class="tc-label-row"><span class="tc-label-row__no">${at + 1}</span> <span class="tc-label-row__name"></span>${
            at === 0 ? ' <span class="tc-label-row__rec">Recommended</span>' : ''
        }</p><p class="tc-see"></p><p class="tc-verdict"></p>
        <div class="tc-scene" data-tc-kind="${a.kind}" data-tc-${a.id}="${o.key}" data-tc-phase="${a.kind === 'cycle' ? 'in' : 'hold'}">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.tc-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.tc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.tc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('tc-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#tc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const TIMES = /** @type {const} */ ({
    clocks: [
        'contact 34 ms, one cell',
        'typed in 816 ms: 24 cells of 34 ms',
        'printed in 544 ms: 4 lines of 136 ms',
        'the cursor blinks once a second',
    ],
    picks: ['contact at once', 'printed in 500 ms (16 steps)', 'printed in 300 ms (4 steps)', 'dots step along the foot every 1.2 s'],
    instant: ['at once', 'at once', 'at once', 'the cursor stands lit'],
});
for (const scene of section.querySelectorAll('[data-tc-durations]')) {
    const key = /** @type {keyof typeof TIMES} */ (scene.getAttribute('data-tc-durations'));
    ['contact', 'part', 'panel', 'loop'].forEach((id, at) => {
        const p = scene.querySelector(`[data-tc-readout="${id}"]`);
        if (p) p.textContent = TIMES[key][at];
    });
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-tc-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 2000],
    ['hold', 1700],
    ['out', 1300],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.tc-scene[data-tc-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.tc-scene[data-tc-kind="cycle"] [data-tc-num]')];
const wordsToSwap = [...section.querySelectorAll('.tc-scene[data-tc-kind="cycle"] [data-tc-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-tc-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/ jobs$/.test(text)) num.textContent = tick % 2 ? '5 jobs' : '4 jobs';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of wordsToSwap) word.textContent = tick % 2 ? 'restarting' : 'running';
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
radio('data-tc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--tc-slow', String(slow));
    run(0);
});
radio('data-tc-state', (value) => {
    section.setAttribute('data-tc-show', value);
});
document.querySelector('[data-tc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.tc-scene a, .tc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided terminal components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=terminal`, only its
// combination of the decided picks), loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-tc-gallery]'));
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
