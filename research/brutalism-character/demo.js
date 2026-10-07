// What makes brutalism brutalism (Kenny, 2026-10-07 04:23: the themes one by
// one, "cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint"), the
// same way as titanium, forest, nostromo, cyberpunk, synthwave and solstice
// (02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat niet past en dan
// zo voorstellen doet").
//
// A review-kit demo in aspect mode, brutalism only. Each ASPECT is one rule of
// the theme's grammar (themes/brutalism/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-bc-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/**
 * The well a waiting reading is cast in (G10), with every loading picture an
 * option may draw in it: the pour, the hammer, the tape. options.css shows one.
 */
const well = (cls = '') =>
    `<span class="bc-well ${cls}" aria-hidden="true"><span class="bc-pour"></span><span class="bc-hammer"></span><span class="bc-tape"></span></span>`;

/** The change, on a square plate; its drawing is the option's. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta bc-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/** The hazard band a warning is taped off with (G13); options.css shows it where the option asks. */
const TAPE = `<span class="bc-hazard" aria-hidden="true"></span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter bc-meter" role="meter" aria-label="Load, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A chart's plot on its poster: the line, square-cut, on the slab. */
const plot = (cls = '', extra = '') => `<div class="bc-plot bc-slab ${cls}" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="bc-plot__line" points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter" pathLength="1"/></svg>${extra}<span class="bc-plot__read">Load, 412 t</span></div>`;

const PART = {
    dialog: () =>
        `<div class="bc-drops bc-drops--dialog"><div class="kp-dialog bc-dialog bc-slab" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title bc-title">Pour the slab?</p>
        <p class="kp-dialog__description">The formwork on level 3 is ready.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Pour it', 'kp-button--sm kp-button--primary')}</div>
    </div></div>`,
    menu: () => `<div class="bc-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="bc-drops bc-pop-wrap"><div class="kp-popover bc-pop bc-slab"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the log</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div></div>
    </div>`,
    tile: (label = 'Crane 02', body = '4.2 t · 61 m', cls = 'bc-arrives') =>
        `<div class="kp-card bc-slab bc-tile ${cls}">
        <p class="kp-card__title bc-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    plainTile: (label = 'Crane 02', body = 'Hook 61 m', cls = '') =>
        `<div class="kp-card bc-slab bc-tile ${cls}"><p class="kp-card__title bc-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Poured today', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi bc-slab bc-kpi ${cls}" ${extra}>
        <span class="kp-kpi__label bc-label">${label}</span>
        <span class="kp-kpi__value bc-figure bc-carrier" data-bc-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    tracks: () => `<div class="bc-tracks" aria-hidden="true">
        <span class="bc-groove"><span class="bc-track" style="--to: 72%"></span></span>
        <span class="bc-groove"><span class="bc-track" style="--to: 48%"></span></span>
        <span class="bc-groove"><span class="bc-track" style="--to: 88%"></span></span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="bc-days bc-week" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="bc-day bc-small bc-arrives" style="--i: ${i}"><span class="bc-day__num">${from + i}</span></span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="bc-rows" aria-hidden="true">${['Crane 01, 3.8 t', 'Crane 02, 4.2 t', 'Hoist 03, 1.1 t']
            .map((t, i) => `<span class="bc-row-line bc-small bc-arrives" style="--i: ${i}">${t}</span>`)
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="bc-state" data-bc-kind="${kind}"><span class="bc-state__dot bc-carrier bc-carrier--dot" aria-hidden="true"></span><span class="bc-state__word bc-carrier" data-bc-word>${word}</span></span>`,
    alert: (text = 'The hoist is back on.') =>
        `<div class="kp-alert bc-slab bc-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="bc-spark-wrap"><span class="kp-kpi__label bc-label">Load, 24 h</span><span class="bc-spark bc-carrier bc-carrier--line" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter" pathLength="1"/></svg></span></div>`,
    column: (label = 'Open', value = '38') =>
        `<div class="bc-column bc-slab"><span class="kp-kpi__label bc-label">${label}</span><span class="bc-column__num bc-figure bc-carrier" data-bc-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="bc-skel" aria-hidden="true">${[0, 1, 2]
            .map((i) => `<span class="bc-skel__line bc-small bc-waits" style="--i: ${i}">${well('bc-well--fill')}</span>`)
            .join('')}</div>`,
    field: () =>
        `<label class="kp-field bc-field"><span class="kp-field__label">Level</span><input class="kp-field__input" value="Level 3, east" /></label>`,
    menuStatic: (items = ['Open the log', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover bc-pop bc-pop--static bc-slab ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' bc-pointed' : ''}">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="bc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="bc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three shares are thrown on', PART.tracks(), 'bc-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'bc-part--wide') +
    cell('A list of readings is set down', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A menu opens', PART.menu());

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card bc-slab bc-tile bc-waits" aria-busy="true"><p class="kp-card__title bc-title">Crane 03</p>${well('bc-well--body')}</div>`;

const DURATION = () =>
    cell('Contact: a press', `<div class="bc-row">${button('Export loads', 'bc-press')}</div><p class="bc-readout" data-bc-readout="contact"></p>`) +
    cell('A fall: a menu opens', PART.menu() + '<p class="bc-readout" data-bc-readout="open"></p>') +
    cell('The dialog, the big slab', PART.dialog() + '<p class="bc-readout" data-bc-readout="dialog"></p>') +
    cell('A loop: a tile waits', `${waitingTile()}<p class="bc-readout" data-bc-readout="loop"></p>`);

const warnKpi = () => PART.kpi('Wind at the crane, km/h', '61', chip('12', 'up', 'bad'), 'bc-warn', 'data-bc-kind="warn"');

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="bc-row">${button('Export', 'bc-pointed')}${button('Pour it', 'kp-button--primary')}${PART.state('Running')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8)) +
    cell(
        'Key figures',
        `<div class="kp-kpis bc-kpi-row">${PART.kpi('Poured today', '412')}${PART.kpi('Cranes', '6', chip('1', 'up'))}</div>`,
        'bc-part--wide',
    ) +
    cell(
        'A strip of columns',
        `<div class="bc-strip">${[
            ['Open', '38'],
            ['Late', '4'],
            ['Done', '112'],
        ]
            .map(([l, v]) => `<div class="bc-strip__col"><span class="bc-label">${l}</span><span class="bc-figure">${v}</span></div>`)
            .join('')}</div>`,
    ) +
    cell(
        'A link and the picked day',
        `<p class="bc-prose">See the <a href="#bc-intro">site log</a> for details.</p><div class="bc-days bc-days--pick">${[12, 13, 14, 15]
            .map((d) => `<span class="bc-day bc-small${d === 13 ? ' bc-picked' : ''}"><span class="bc-day__num">${d}</span></span>`)
            .join('')}</div>`,
    ) +
    cell('Tags', `<div class="bc-row"><span class="kp-badge">12 new</span><span class="kp-tag">Level 3</span></div>`);

const CORNERS = () =>
    cell('Card', PART.plainTile('Crane 02', 'Hook 61 m', 'bc-c-card')) +
    cell('Menu panel', PART.menuStatic(['Open the log', 'Assign to…'], 'bc-c-menu', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Poured today', '412', chip('6 %'), 'bc-c-kpi')}</div>`) +
    cell(
        'Button, tag and a tile mark',
        `<div class="bc-row">${button('Export', 'bc-c-button')}<span class="kp-badge bc-c-tag">12 new</span><span class="bc-mark bc-c-mark" aria-hidden="true"></span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip bc-tip" role="tooltip">18:00 · 412 t</div>`) +
    cell(
        'A tour card',
        `<div class="bc-tour bc-slab"><p class="bc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p></div>`,
    );

const SURFACE = () =>
    cell('Card', PART.plainTile('Crane 02', 'Hook 61 m', 'bc-sheet')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Poured today', '18 240', chip('6 %'), 'bc-sheet')}</div>`) +
    cell('The plot of a chart', plot('bc-sheet')) +
    cell('Meter', `<div class="bc-meter-plate bc-slab bc-sheet">${meter(0.62, 0.8)}</div>`) +
    cell(
        'Buttons and a tag',
        `<div class="bc-row">${button('Export')}${button('Pour it', 'kp-button--primary')}<span class="kp-badge">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

/** The tone scene does not replay; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-bc-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis bc-kpi-row">${PART.kpi('Poured today', '412', chip('6 %'))}${warnKpi().replace('</div>', `${TAPE}</div>`)}</div>`,
            'bc-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card bc-slab bc-tile bc-bad" data-bc-kind="bad"><p class="kp-card__title bc-title"><span class="bc-toned">Hoist 03</span></p><p class="kp-card__body">No reading since 16:40</p><span class="bc-sticker" aria-hidden="true">Failed</span>${TAPE}</div>`,
            ) +
            cell('A failed state', `<div class="bc-state-plate bc-slab bc-bad" data-bc-kind="bad">${PART.state('Failed', 'bad')}${TAPE}</div>`) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover bc-pop bc-pop--static bc-slab"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive bc-bad" data-bc-kind="bad"><span class="bc-toned">Delete</span>${TAPE}</button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="bc-meter-plate bc-slab bc-warn" data-bc-kind="warn"><span class="bc-cap"><span class="bc-toned">Load near its limit</span></span>${meter(
                    0.88,
                    0.8,
                    'data-kp-tone="warning"',
                )}${TAPE}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its block', PART.state('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card bc-slab bc-tile bc-live-tile"><p class="kp-card__title bc-title">Crane 02</p><p class="kp-card__body"><span class="bc-carrier bc-carrier--body" data-bc-num>4.2 t</span></p></div>`,
    );

const LOADERS = () =>
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi bc-slab bc-kpi bc-waits" aria-busy="true"><span class="kp-kpi__label bc-label">Poured today</span>${well(
            'bc-well--figure',
        )}<span class="kp-kpi__trend bc-faint">on yesterday</span></div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="bc-table bc-slab bc-waits" aria-busy="true"><span class="bc-table__head">Crane</span><span class="bc-table__head">Load</span>${well('bc-well--rows')}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover bc-pop bc-pop--static bc-slab"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bc-waits bc-entry-wait" aria-busy="true">Loading cranes${well(
            'bc-well--entry',
        )}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="bc-days bc-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="bc-day bc-small bc-waits" style="--i: ${d - 1}">${well('bc-well--day')}</span>`)
            .join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="bc-plot bc-plot--wait bc-slab bc-waits" aria-busy="true">${well('bc-well--plot')}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="bc-meter-wait bc-waits" aria-busy="true">${well('bc-well--meter')}</div>`);

/**
 * The package's progress bar at its large size. A share (0 to 1) is drawn from
 * `--kp-value`; no share is a busy bar (`data-bc-busy`, standing for the
 * register's `data-kp-indeterminate`, so every option draws its own busy
 * picture). A bar with a share arrives on the page's loop (options.css, bc-k).
 */
const pbar = (label, share = null, at = 0) =>
    `<div class="kp-progressbar kp-progressbar--lg bc-bar${share === null ? '' : ' bc-bar--det'}" role="progressbar" aria-label="${label}" ${
        share === null
            ? 'data-bc-busy'
            : `aria-valuenow="${Math.round(share * 100)}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${share}; --i: ${at}"`
    }><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;

const PROGRESS = () =>
    cell('Busy: no share is known', pbar('Waiting for the sync'), 'bc-part--wide') +
    cell('A quarter, 25 %', pbar('Sync, 25 %', 0.25, 0)) +
    cell('Past half, 60 %', pbar('Sync, 60 %', 0.6, 1)) +
    cell('Done, 100 %', pbar('Sync, 100 %', 1, 2)) +
    cell(
        'In a card: a share, and a wait',
        `<div class="kp-card bc-slab bc-tile"><p class="kp-card__title bc-title">Syncing the cranes</p><p class="kp-card__body">412 of 690 t read</p>${pbar(
            'Cranes read, 60 %',
            0.6,
            1,
        )}${pbar('Waiting for the next batch')}</div>`,
        'bc-part--wide',
    );

/** One spinner in three drawings; options.css shows the option's. */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="bc-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--bc-spin: ${size}"` : ''
    }><span class="kp-spinner bc-spin__block"></span><span class="bc-spin__cube"><span class="bc-pour"></span></span><span class="bc-spin__ring"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="bc-row bc-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'bc-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary bc-busy-button" aria-busy="true">${spin('', '', true)}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card bc-slab bc-busy-panel">${spin('2rem', 'Reading the cranes')}<p class="kp-card__body">Reading the cranes…</p></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="bc-leaver">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.plainTile())) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpi bc-slab bc-kpi"><span class="kp-kpi__label bc-label">Poured today</span><span class="kp-kpi__value bc-figure">412</span></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="bc-row">${button('Export loads', 'bc-alone')}${button('Pour it', 'kp-button--primary bc-alone')}</div>`,
        'bc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header bc-header bc-slab"><div class="kp-page-header__inner"><div><p class="kp-page-header__title bc-title">Cranes</p><p class="kp-page-header__description">Six on level 3.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm bc-in-header')}${button('Add', 'kp-button--sm kp-button--primary bc-in-header')}</div></div></header>`,
        'bc-part--wide',
    ) +
    cell(
        'Menu: its entries',
        `<div class="kp-popover bc-pop bc-pop--static bc-slab bc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bc-in-entry">Open the log</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card bc-slab bc-tile bc-in-tile"><p class="kp-card__title bc-title">Crane 02</p><a class="kp-button kp-button--ghost kp-button--sm bc-tile-link" href="#bc-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card bc-slab bc-drawer"><p class="kp-card__title bc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="bc-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost bc-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary bc-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi bc-slab bc-kpi bc-in-kpi" href="#bc-intro"><span class="kp-kpi__label bc-label">Poured today</span><span class="kp-kpi__value bc-figure">412</span><span class="kp-kpi__trend">since 07:00</span></a></div>`,
    );

/** The pointer is the question: every part marked `bc-hov` answers a real :hover (options.css), so the scene is played by hand. */
const HOVER = () =>
    `<p class="bc-point bc-part--wide" role="note"><span class="bc-point__mark" aria-hidden="true">↖</span> <b>Point at the parts.</b> Every part below answers your pointer; one in each row is held pointed for comparison. The ½ and ¼ speed buttons slow the lift.</p>` +
    cell(
        'Button: at rest, then held pointed',
        `<div class="bc-row">${button('Export loads', 'bc-hov')}${button('Export loads', 'bc-hov bc-pointed')}</div>`,
    ) +
    cell('Primary button, at rest', `<div class="bc-row">${button('Pour it', 'kp-button--primary bc-hov')}</div>`) +
    cell(
        'Menu entries, the first held pointed',
        `<div class="kp-popover bc-pop bc-pop--static bc-slab"><ul class="kp-menu" role="menu">${['Open the log', 'Assign to…', 'Rename']
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item bc-hov${i === 0 ? ' bc-pointed' : ''}">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
    ) +
    cell(
        'Tile with its Open link, held pointed',
        `<div class="kp-card bc-slab bc-tile"><p class="kp-card__title bc-title">Crane 02</p><a class="kp-button kp-button--ghost kp-button--sm bc-tile-link bc-hov bc-pointed" href="#bc-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first held pointed',
        `<div class="kp-kpis bc-kpi-row"><a class="kp-kpi bc-slab bc-kpi bc-hov bc-pointed" href="#bc-intro"><span class="kp-kpi__label bc-label">Poured</span><span class="kp-kpi__value bc-figure">412</span></a><a class="kp-kpi bc-slab bc-kpi bc-hov" href="#bc-intro"><span class="kp-kpi__label bc-label">Cranes</span><span class="kp-kpi__value bc-figure">6</span></a></div>`,
    ) +
    cell(
        'Days of a month, the second held pointed',
        `<div class="bc-days">${[12, 13, 14, 15]
            .map((d) => `<span class="bc-day bc-small bc-hov${d === 13 ? ' bc-pointed' : ''}"><span class="bc-day__num">${d}</span></span>`)
            .join('')}</div>`,
    );

const FOCUS = () =>
    cell(
        'Button and primary button',
        `<div class="bc-row">${button('Export', 'bc-focused')}${button('Pour it', 'kp-button--primary bc-focused')}</div>`,
    ) +
    cell('Header action', `<div class="bc-header-mini bc-slab">${button('Export', 'kp-button--sm bc-in-header bc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi bc-slab bc-kpi bc-focused" href="#bc-intro"><span class="kp-kpi__label bc-label">Poured today</span><span class="kp-kpi__value bc-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover bc-pop bc-pop--static bc-slab"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bc-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="bc-days"><span class="bc-day bc-small"><span class="bc-day__num">13</span></span><span class="bc-day bc-small bc-focused"><span class="bc-day__num">14</span></span><span class="bc-day bc-small"><span class="bc-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card bc-slab bc-tile"><p class="kp-card__title bc-title">Crane 02</p><a class="kp-button kp-button--ghost kp-button--sm bc-tile-link bc-focused" href="#bc-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="bc-row">${button('Export loads', 'bc-press')}</div>`) +
    cell('Primary button', `<div class="bc-row">${button('Pour it', 'kp-button--primary bc-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover bc-pop bc-pop--static bc-slab"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bc-press bc-press--flat">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="bc-days"><span class="bc-day bc-small bc-press"><span class="bc-day__num">14</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle bc-slab bc-kpi bc-press" aria-pressed="false"><span class="kp-kpi__label bc-label">Open faults</span><span class="kp-kpi__value bc-figure">3</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="bc-row"><button type="button" class="bc-key bc-small bc-press" aria-pressed="false"><span class="bc-key__swatch" aria-hidden="true"></span>Crane 01</button></div>`,
    );

/**
 * One tile with every kind of text a dashboard sets: a label, a title, prose,
 * a figure with its unit, a strip of figures, a table of readings (a value
 * with its unit, two dates in rule 52's dd/mm/yyyy HH:MM) and the actions.
 * Every voice option restyles these same parts (`bc-type__*`, `bc-val`,
 * `bc-unit`, `bc-stamp`), so the date and the "412 t" are always in view.
 */
const TYPE = () =>
    cell(
        'A tile with its words, figures and dates',
        `<div class="kp-card bc-slab bc-type"><p class="bc-type__label">Level 3, east</p><p class="bc-type__head">Crane 02</p>
        <p class="bc-type__prose">The wind rose past the crane's limit at noon; the site checks it again at 14:30.</p>
        <p class="bc-type__figure"><span class="bc-figure">61</span> <span class="bc-unit">km/h</span> ${chip('12 km/h', 'up', 'bad')}</p>
        <div class="bc-type__strip">${[
            ['Load', '412', 't'],
            ['Poured', '18 240', 'm³'],
            ['Cranes', '6', ''],
        ]
            .map(([l, v, u]) => `<div><span class="bc-label">${l}</span><span class="bc-figure">${v}${u ? ` <span class="bc-unit">${u}</span>` : ''}</span></div>`)
            .join('')}</div>
        <table class="bc-type__table"><tbody>
            <tr><th scope="row">Load</th><td><span class="bc-val">412</span> <span class="bc-unit">t</span></td></tr>
            <tr><th scope="row">Last reading</th><td><time class="kp-timestamp bc-stamp">07/10/2026 14:12</time></td></tr>
            <tr><th scope="row">Next check</th><td><time class="kp-timestamp bc-stamp">07/10/2026 14:30</time></td></tr>
        </tbody></table>
        <p class="bc-type__actions">${button('Open the log', 'kp-button--sm')} <span class="kp-badge bc-tagged">12 new</span></p></div>`,
        'bc-part--wide',
    );

/** The motifs, one specimen each, every one named for what it means (G16). */
const MOTIFS = () =>
    cell('Weight: the hard shadow', PART.plainTile('Crane 02', 'Hook 61 m', 'bc-motif-card') +
            `<div class="bc-row">${chip('6 %', 'up', 'good')}${chip('3 %', 'down', 'bad')}</div><p class="bc-motif-note">Every slab, always; a change on a plain plate.</p>`,
    ) +
    cell(
        'Danger: hazard tape',
        `<div class="kp-card bc-slab bc-tile bc-motif-warn bc-warn" data-bc-kind="warn"><p class="kp-card__title bc-title">Crane 04</p><p class="kp-card__body">Wind 61 km/h</p>${TAPE}</div><p class="bc-motif-note">Only on a warning.</p>`,
    ) +
    cell(
        'Fixed: bolts on a chart’s events',
        plot(
            'bc-events',
            '<span class="bc-events__mark" style="--x: 37.5%; --y: 55%"></span><span class="bc-events__mark" style="--x: 62.5%; --y: 40%"></span><span class="bc-events__mark" style="--x: 87.5%; --y: 20%"></span>',
        ),
    ) +
    cell(
        'Today: the six-pixel bar. The pick: yellow',
        `<div class="bc-days bc-days--motif">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="bc-day bc-small${d === 13 ? ' bc-today' : ''}${d === 14 ? ' bc-picked' : ''}"><span class="bc-day__num">${d}</span></span>`,
            )
            .join('')}</div><p class="bc-motif-note">13 is today, 14 is picked.</p>`,
    ) +
    cell(
        'Stamped: the empty state’s zero, askew',
        `<div class="kp-empty bc-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives at 07:00.</p></div>`,
    ) +
    cell('The divider: the marquee hatch', `<p class="bc-cap">Cranes</p><div class="bc-divider" data-kp-divider></div><p class="bc-cap">Hoists</p>`);

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
        question: 'How does brutalism move: under gravity, in hard steps, or on its register’s smooth curve?',
        why: 'A theme exists to be distinct (your rule of 03:37). Most of your picks slam in two hard steps, which is how terminal’s register, nostromo’s frame clock, cyberpunk’s ticks and retro move too; the register’s smooth curve, cubic-bezier(0.2, 0, 0, 1), is formal’s, light’s, grotesk’s and nostromo’s. Two of your picks fall under gravity, the meter’s Thrown on and the chart’s Dropped in: they speed up all the way and land at full speed. No theme moves like that yet.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'gravity',
                name: 'Gravity: it falls and stops dead',
                see: 'What comes leaves at rest, speeds up all the way down and stops in one frame on its shadow: the shares are thrown on, the dialog and the menu land, the tile lands, the figure is slammed on. What goes is lifted on the same curve played back. The meter’s own Thrown on curve, cubic-bezier(0.6, 0, 0.9, 0.5).',
                verdict: rec(
                    'it is weight you can see, the slab falling onto its shadow and stopping dead, and every other theme slows down into place instead.',
                ),
            },
            {
                key: 'steps',
                name: 'Hard steps (most of your picks; terminal’s, nostromo’s, cyberpunk’s)',
                see: 'Everything jumps to its place in two hard steps, no travel in between, as the menu’s and the columns’ Slammed do today.',
                verdict: not('it is blunt and fast, but hard steps are how four other themes move, and a jump has no weight.'),
            },
            {
                key: 'smooth',
                name: 'The register’s smooth curve (formal’s, light’s, grotesk’s)',
                see: 'Everything on cubic-bezier(0.2, 0, 0, 1): a quick start and a long, soft landing, as the signature’s drops and the hover do today.',
                verdict: not('it is pleasant, but a soft landing is the opposite of a slab, and it is four other themes’ curve.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does a slab move when it arrives, is pointed at or leaves?',
        why: 'Brutalism’s shadow falls down and to the right, so up off the page is up and to the left: your button lifts that way, your headline’s words and the signature’s dialog drop from there. Your component picks mostly drop straight down the page (the menu, the columns, the chart, the calendar, the meter) or shove in from the side (the tiles, the drawer, the leave).',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'diagonal',
                name: 'Along the shadow’s diagonal: up off the page is up-left',
                see: 'Each day, row, tile and the menu fall from up-left onto a shadow that is already lying where they will stand; the shadow never moves. The days are set down one after another from the start.',
                verdict: rec(
                    'it is the only direction in which a box with a hard shadow can fall onto the page, and no other theme has a shadow to fall onto.',
                ),
            },
            {
                key: 'down',
                name: 'Straight down from above (the columns’, chart’s, calendar’s, meter’s and menu’s picks)',
                see: 'Everything slides down the page into place, its shadow travelling with it.',
                verdict: not('it reads as falling, but the shadow comes along, so the slab slides down the page instead of landing on it.'),
            },
            {
                key: 'side',
                name: 'Shoved in from the side (the tiles’ and the drawer’s picks; titanium’s feed, grotesk’s shove)',
                see: 'Everything is shoved in from the start side and stops.',
                verdict: not('it is forceful, but sideways is titanium’s feed and grotesk’s shove, and it has nothing to do with weight.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Your menu and your header’s menu are both Slammed: straight down from above in two hard steps (the header’s after a top-down clip, which is titanium’s cut). The signature’s dialog, toast and tooltip drop from up-left with a slight tilt and a fade, and you asked for the dialog at a quarter of its speed so you can see it land.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'footprint',
                name: 'Dropped onto its footprint',
                see: 'The panel’s hard shadow is on the page from the first frame, where the panel will stand; the panel falls onto it from up-left, speeding up, and stops dead: the menu in 3 units (300 ms), the dialog, the big slab, in 15 (1500 ms, your quarter speed). No tilt, no fade. Closing plays it backwards: lifted back up off its shadow on the same curve, and gone.',
                verdict: rec(
                    'it shows the weight before the slab lands, it keeps your slowed dialog, and no theme opens onto a waiting shadow; solstice left brutalism the drop from above.',
                ),
            },
            {
                key: 'slam',
                name: 'Slammed in two hard steps, as picked',
                see: 'The panel jumps down from above to near its place and then to its place, two hard steps, as your menu pick draws it: 300 ms.',
                verdict: not('it is your pick, but two hard steps are the hard-step themes’ gesture, and the shadow travels with the panel.'),
            },
            {
                key: 'tilt',
                name: 'The tilted drop with a fade (the signature’s; near pastel’s Stuck on)',
                see: 'The panel fades in while it drops from up-left with a slight tilt and settles softly, as the signature’s dialog and toast do.',
                verdict: not(
                    'it is lively, but a tilted panel fading in is pastel’s note swung in from its corner, and printed matter does not fade.',
                ),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do contact, a fall, the dialog and a loop take?',
        why: 'Brutalism’s register gives contact 100 ms. Your picks take 150 to 700 ms for a one-shot and 0.48 to 2.2 s for a loop, with no unit under them; the dialog’s drop takes 1520 ms because you slowed it to a quarter.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: '100 · 300 · 1500 · 1200 (units of 100 ms)',
                see: 'Contact 1 unit (100 ms), a fall 3 (300 ms), the dialog 15 (1500 ms), a loop 12 (1200 ms): the readouts under each part say the numbers.',
                verdict: rec(
                    'every duration is the register’s own 100 ms counted, the falls are short and hard, and your slowed dialog keeps its time.',
                ),
            },
            {
                key: 'picks',
                name: 'As the picks, the slowest of each kind',
                see: 'Contact 100 ms, a fall 700 ms (the chart’s Dropped in), the dialog 1520 ms, a loop 2200 ms (the meter’s blocks).',
                verdict: not('it is your picks, but a fall of 700 ms floats, and nothing ties one number to another.'),
            },
            {
                key: 'instant',
                name: 'At once (retro’s 0 ms; the anatomy’s “no arrival”)',
                see: 'Nothing moves: every part is simply there, and a waiting part shows its half-poured well standing still.',
                verdict: not(
                    'it is the anatomy’s printed matter that is simply there, but it hides every pick of yours that moves, and 0 ms is retro’s register.',
                ),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What do the ink, yellow, lavender and the statuses each mean?',
        why: 'The anatomy: one ink for every line and the primary, yellow as the ordinary button, candy plates with black ink. Your picks add lavender sheets mixed into the plates (22 to 55 %: the key figure, the tiles, the menu), coloured shadows (the tiles’ tone marks, the busy failure’s cream) and the chart’s poster on yellow stock. You also said brutalism must be raw.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'roles',
                name: 'Ink builds, yellow is the hand, lavender the second sheet, statuses paint',
                see: 'Every line, shadow and word is the ink; yellow is where a hand is (the ordinary button, the pointed one, the picked day); lavender is the second plate (the meter’s share, every other column); the slabs are white; paint is flat and full.',
                verdict: rec('every colour has one job, the slabs stay white and raw, and the candy is paint, never a tint.'),
            },
            {
                key: 'sheets',
                name: 'The sticker sheets (your key figure’s, tiles’ and menu’s picks; pastel’s candy)',
                see: 'The plates are tinted lavender, the picked day and the change are lavender stickers too.',
                verdict: not('it is cheerful, but tinted sheets with stickers are pastel’s sticker chart, and a tint is not raw.'),
            },
            {
                key: 'concrete',
                name: 'Raw concrete: grey slabs, ink and one yellow',
                see: 'The slabs are the muted concrete grey, lavender goes, yellow only where a hand is.',
                verdict: not(
                    'it is the 1960s’ béton brut, as raw as it gets, but the anatomy chose Gumroad’s paper and candy, and grey slabs on cream paper lose the print.',
                ),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners do brutalism’s parts have?',
        why: 'Radius 0 is load-bearing in the anatomy. Your picks round two stickers to 0.2 rem (the key figure’s change, the tiles’ mark) and cut a stencil notch off the tour card’s corner, which is cyberpunk’s notch and titanium’s chamfer.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'square',
                name: 'Square, everything',
                see: 'Every card, panel, key figure, button, tag, tooltip, mark and the tour card square; round only for the radio and the empty state’s stamped zero.',
                verdict: rec('it is the anatomy’s, it has no exceptions to learn, and a slab is square.'),
            },
            {
                key: 'picked',
                name: 'As picked: rounded stickers and a notched tour card',
                see: 'The change and the tile’s mark are rounded and askew; the tour card has a notch cut off its corner.',
                verdict: not('it is your picks, but the notch is cyberpunk’s and the rounded sticker pastel’s.'),
            },
            {
                key: 'soft',
                name: 'A soft corner (pastel’s)',
                see: 'Every part rounded to 0.5 rem.',
                verdict: not('it is friendly, but it softens exactly what brutalism is for, and it is pastel’s.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is a brutalism plate made of?',
        why: 'The anatomy’s signature is the shadow: a box in one 3 px line standing on a hard shadow 6 px down-right. Your picks draw it with 1, 2, 3 and 4 px lines and 2 to 10 px shadows, leave the shadow off the key figure, the tour card and the chart’s tip, double it under the busy panel, and tint four plates lavender into a sticker sheet. The network graph keeps its sticker sheet whatever you pick (it changes in no theme).',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'slab',
                name: 'The slab: white, one ink line, its hard shadow',
                see: 'Every plate white in the 3 px ink line on a 6 px hard shadow straight down-right; small parts a 2 px line on a 3 px shadow. Nothing tinted, nothing blurred.',
                verdict: rec(
                    'it is brutalism’s own and nobody else’s (no other theme draws a hard shadow), and it is honest: the line is the structure, the shadow the weight.',
                ),
            },
            {
                key: 'sticker',
                name: 'The sticker sheet (your key figure’s, tiles’, menu’s and the graph’s; pastel’s sticker chart)',
                see: 'Each plate a lavender sheet in the ink line, no shadow, its mark an askew sticker.',
                verdict: not(
                    'it is your shape four times, but tinted sheets with askew stickers are pastel’s sticker chart, and decoration rather than structure.',
                ),
            },
            {
                key: 'poster',
                name: 'The poster stock (the chart’s pick)',
                see: 'Each plate printed on yellow stock in a 4 px frame on a 6 px shadow.',
                verdict: not('it is loud and printed, but when every plate is yellow, yellow no longer marks where a hand is.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show on a part?',
        why: 'Your tone picks draw eight ways: the warning poster three times (the menu, the trend, the key figure’s figure), an askew sticker (the key figure’s change, the state), a coloured shadow (the tiles), a cream frame on a red slab (the busy failure), a bump (the meter) and a red tip. Hazard tape runs through your other picks: the trend’s band, the graph’s site taped off, the alarm’s bars.',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'taped',
                name: 'Taped off: hazard tape at the foot, the figure on the tone’s plate',
                see: 'A warning or failed part carries a band of hazard tape along its foot, its tone’s paint and the ink in 45° stripes, and its figure or title is printed on the tone’s plate, framed in the ink line on its hard shadow.',
                verdict: rec(
                    'it is your warning poster with the tape that says danger on a building site, and no theme’s warning is a hazard band (cyberpunk refuses one).',
                ),
            },
            {
                key: 'poster',
                name: 'The warning poster alone (near high-contrast’s framed plate)',
                see: 'The figure or title on the tone’s plate, framed in ink on its shadow; no tape.',
                verdict: not('it is your pick, but a tone on a framed plate is high-contrast’s The framed plate and terminal’s square plate.'),
            },
            {
                key: 'sticker',
                name: 'The askew sticker (the key figure’s and the state’s picks; pastel’s sticker chart)',
                see: 'The warning on an askew sticker in a black outline, slapped onto the part.',
                verdict: not('it is playful, but a sticker is pastel’s, and askew stickers are decoration, not danger.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'How does a value that changes in place show it changed?',
        why: 'Your live picks: the columns’ figure inverted for a moment (high-contrast’s The bar flips), the state’s shadow jumping, the tiles kicked, and at once for the key figure, the trend and the chart (formal’s Redrawn). The package declares none for brutalism. Your headline’s words already slam onto their yellow offset (2026-09-08).',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'slam',
                name: 'Slammed onto its offset (the headline’s slam)',
                see: 'The new value appears just up-left of its place and falls onto a yellow copy of itself lying 3 px down-right, in 3 units; the yellow offset stands a moment and is struck off in one cut. A line or a block falls onto its yellow copy the same way.',
                verdict: rec('it is your headline’s own slam, read at once, and no theme’s live update drops the value onto anything.'),
            },
            {
                key: 'invert',
                name: 'Inverted (the columns’ pick; high-contrast’s The bar flips)',
                see: 'The changed value shows reversed out of the ink for a moment, then returns.',
                verdict: not('it is your pick, but a flip to ink is high-contrast’s live family, and it blacks the value out for a moment.'),
            },
            {
                key: 'once',
                name: 'At once (the key figure’s, the trend’s and the chart’s picks; formal’s Redrawn)',
                see: 'The new value is simply there; nothing marks the change.',
                verdict: not('it is quiet and honest, but nobody sees that something changed, and it is formal’s live family.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a waiting part show while it loads?',
        why: 'The pour is yours (the trend’s pick, and your favourite here, kept as the reference in second place), and eleven loading pictures are in the decided picks: hammers (the busy table, the key figure), stamps (the tiles, the columns, the menu’s shadow), the chart’s rivet gun, the calendar’s tape, the meter’s blocks, the skeleton’s presses and the pour. You asked for something much better, so ten more follow the pour, each a different piece of raw construction on the same well and the same 1200 ms clock: stacking, dropping, carrying, hoisting, tallying, joint-opening, bolting, staking out, scaffolding, quarrying. You then said you like hoisted best, but that its shape suits the skeleton’s thin lines and fails in the chart plot, so five variations follow it, each still a load hoisted in hard lifts and let go, each answering the shape differently: along the width on a gantry, in relay, as wide as the well (a lintel), as many as the well is wide (bays), or in a pair. The progress bar’s busy picture is no longer shown among the cells here: it is the next question. None strikes (a strike is formal’s seal), none runs or sweeps (running tape is high-contrast’s, a sun crossing solstice’s), none blinks or chases (a cursor is terminal’s, bulbs synthwave’s and nostromo’s). The first is the one I would pick, and why is under it. In each, the labels above stay readable; standing still it shows the finished picture.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'carry',
                name: 'Carried: one block is lifted off its footprint and set down on the next',
                see: 'Four ink footprints along the well’s floor; one block is lifted off the first, carried one place with a hard step and set down on the gravity curve, three times, start to end; then it is back on the first.',
                verdict: rec(
                    'it is the only picture made of the anchor itself: a block lifted off its footprint and set down (G8, G12), it travels start to end the way a reading is written, and it strikes, runs, fades and blinks nowhere; the pour stays the reference if you would rather keep your favourite.',
                ),
            },
            {
                key: 'pour',
                name: 'The pour: the reading is cast in its own place',
                see: 'Where the value will stand is a well in the ink line; ink is poured into it from its floor in four hard lifts, it holds full for one, and it is struck clean at once, 12 units (1200 ms). The labels stay readable above it.',
                verdict: not('it is your favourite and reads at every size, but it fills a level in place, which says progress more than waiting, and the trend tile already shows it.'),
            },
            {
                key: 'drop',
                name: 'Dropped: a slab falls onto the footprint that waits for it',
                see: 'An ink footprint stands in the well all the time; a paper slab in the 2 px line falls onto it from above on the gravity curve, stops dead, stands, and is lifted off.',
                verdict: not('it is the arrival physics (G3) as a loop, so a waiting part looks like a part arriving again and again.'),
            },
            {
                key: 'stack',
                name: 'Stacked: blocks fall in turn and build a stepped stack',
                see: 'Three ink blocks, each narrower than the one under it, fall from above the well on the gravity curve, one after the other, and stop dead on the one below; the whole stack is then lifted off up and out, and the well is empty again.',
                verdict: not('it builds a stack, which says progress, and at the meter’s 14 px it is three specks.'),
            },
            {
                key: 'hoist',
                name: 'Hoisted: a load climbs its cable in four hard lifts and is let go',
                see: 'A block hangs from a cable at the well’s floor and is hoisted in four hard lifts to the top, hangs there, and is let go: it falls free on the gravity curve and stops dead.',
                verdict: not(
                    'it is your favourite of the ten and falls well on the gravity curve, but it is one cable and one small load in the middle: it is a good shape in the skeleton’s thin lines and the meter, and in a wide well (the chart plot is 220 by 103 px, the busy table 190 by 40) 85 % of the picture is empty. The five that follow keep it and answer the shape.',
                ),
            },
            {
                key: 'hoist-gantry',
                name: 'Hoisted on a gantry: a trolley carries the load along a rail',
                see: 'A rail runs along the top of the well with a trolley on it. The load is hoisted in two hard lifts up to the trolley, carried across the well in four hard steps, start to end, and let go at the far end: it falls free on the gravity curve and stops dead; then the trolley is back at the start in one cut.',
                verdict: not(
                    'it fills a wide well from side to side and reads start to end, but the load travels the same way a carried block does, and in a thin line the rail is as thick as the load.',
                ),
            },
            {
                key: 'hoist-relay',
                name: 'Hoisted in relay: three loads, one after the other, start to end',
                see: 'Three loads hang along the well. The first is hoisted in two hard lifts, then the second, then the third, start to end; all three are let go together and fall free on the gravity curve.',
                verdict: not(
                    'it spreads the hoist over the width and keeps the start-to-end reading, but it is three cables where the favourite was one, and in the narrow day squares the three are one grey bar.',
                ),
            },
            {
                key: 'hoist-lintel',
                name: 'Hoisted as a lintel: one beam as wide as the well, on two cables',
                see: 'One beam, as wide as the well allows, hangs on two cables and is hoisted in four hard lifts; let go, it falls free and stops dead. The load follows the well’s width, so a wide well gets a wide load and a narrow one a narrow load.',
                verdict: not(
                    'it is the only one whose load fits any well, but a beam is a lift of one thing with no direction, and with two cables it reads as a lift gate more than as a load.',
                ),
            },
            {
                key: 'hoist-bays',
                name: 'Hoisted in bays: a hoist for every square of the well’s width',
                see: 'Loads on cables repeat along the well, one to every 3 rem of width: a wide well holds many, a narrow one one. The odd bays are hoisted in four hard lifts, then the even ones; all are let go together and fall free.',
                verdict: not(
                    'the number of hoists follows the well, so it never leaves a wide well empty, but a field of loads is a crowd, and in a thin skeleton line it is a comb.',
                ),
            },
            {
                key: 'hoist-twin',
                name: 'Hoisted as a pair: one load rises while the other is lowered',
                see: 'Two loads hang from one rope over a sheave at the top. One is hoisted in four hard lifts while the other is lowered in four; let go, the first falls free on the gravity curve and hauls the second back up.',
                verdict: not(
                    'it uses both halves of a wide well and the rope runs across it, but a pair is a see-saw, and the second load makes one thing happen twice.',
                ),
            },
            {
                key: 'scaffold',
                name: 'Scaffolded: three posts rise, two rails are clamped across',
                see: 'Three ink posts rise from the floor in two hard lifts each, start to end; two rails are clamped across them one after the other; the frame is struck.',
                verdict: not('it is the most literally construction, but five parts in a 14 px well turn into a grid of hairlines, and it builds, which says progress.'),
            },
            {
                key: 'quarry',
                name: 'Quarried: a cast slab is cut in four and lifted off block by block',
                see: 'The well is a solid cast slab cut in four; the blocks are lifted off up-left one after another, start to end, until the well stands empty; then it is cast again.',
                verdict: not('it shows weight leaving, which is G12’s lift, but the well is solid ink for a third of the loop, which shouts, and it is the pour and the strike in one.'),
            },
            {
                key: 'tally',
                name: 'Tallied: four strokes are marked, the fifth strikes through',
                see: 'Four ink strokes are marked one after another, start to end, in hard steps; the fifth is struck through them at once; the board is wiped clean.',
                verdict: not('it reads at every size and is the rawest, but a tally says how many, so it promises a total that is not coming.'),
            },
            {
                key: 'bolt',
                name: 'Bolted: a square bolt is turned in and sinks flush',
                see: 'A square-headed bolt stands proud of its footprint on its shadow and is turned four quarters, sinking each time, until it lies flush and its shadow is gone; then it is backed out at once.',
                verdict: not('it is the clearest use of the footprint and the quarter turn, but the quarter turn is the spinner’s signature, and a bolt is the chart’s rivet gun’s object.'),
            },
            {
                key: 'stake',
                name: 'Staked out: three stakes are driven in and the string is snapped taut',
                see: 'Three stakes fall into the ground along the well, start to end; a string line is snapped taut between their heads in one step; then all three are pulled.',
                verdict: not('the string snapping taut is a good beat, but three thin stakes vanish in the small wells, and a survey is more site than slab.'),
            },
            {
                key: 'form',
                name: 'Parted: a cast slab opens its joint and slams shut',
                see: 'The well is a solid cast slab with a seam through it; the two halves part, top and foot, in three hard steps and leave the well; then they fall together on the gravity curve and stop dead at the seam.',
                verdict: not('it is a clean hard-step picture, but the closed seam is nearly the full pour, so it is a pour opening and shutting.'),
            },
            {
                key: 'strike',
                name: 'The hammer (the key figure’s, the busy table’s and the tiles’ picks; near formal’s seal)',
                see: 'A small ink block hammers down along the well’s floor, three places in turn, hard steps.',
                verdict: not('it is your pick four times, but a stamp pressed again and again is formal’s seal.'),
            },
            {
                key: 'tape',
                name: 'The tape runs (the calendar’s pick; near high-contrast’s and cyberpunk’s)',
                see: 'A strip of yellow-and-ink hazard tape crawls along the foot of every waiting part.',
                verdict: not(
                    'it is unmistakable, but running tape is high-contrast’s, hazard stripes are cyberpunk’s armed sign, and tape should mean danger.',
                ),
            },
        ],
    },
    {
        id: 'progress',
        label: 'The progress bar',
        rule: 'G10',
        question: 'How does the progress bar show a share, and how does it show that it is busy without one?',
        why: 'Your signature bar (2026-10-03) was a striped ink fill with a yellow block head, with hazard stripes, a head that covered a fifth of a short track, three clocks, a 100 ms wipe and two textures. Ten options followed, and you chose to mix Ruled (7) and Labelled (10): keep the looks of Ruled, print the value in the yellow tip, and make three variations of that with slightly slower speeds. So the mix is first: the ruled track with its ink ticks on the empty part and paper ticks cut through the ink fill, the same fill and the same yellow head, now a plate wide enough to print the percentage; the share arrives tenth by tenth in hard steps and the number counts with it. Busy, the tip hops tick to tick in ten hard steps and prints three dots. The three after it change only the speed, so you can judge how long a step may last: 1.25, 1.5 and 2 times the mix. The number of steps is kept (ten), so each step is simply longer, and none is slow enough to read as a glide. Every option is drawn on the package’s own markup (track, fill, head) at its large size, with the busy bar, 25 %, 60 % and 100 %, and a bar in a card; a share arrives on the loop for a third of it, stands for a third, and leaves for a third, the arrival played backwards.',
        kind: 'loop',
        scene: PROGRESS,
        options: [
            {
                key: 'ruled-labelled',
                name: 'Ruled and labelled: the tenths are ruled and the yellow tip prints the share',
                see: 'The looks of Ruled: ink ticks on the empty track, paper ticks cut through the ink fill, tenth by tenth in hard steps. The yellow tip is a plate (wide enough for 100 %, ink on yellow, weight 800, digits of one width so it never changes size) whose right edge is the share’s edge, and it prints the percentage, counting up to the bar’s share in the same ten hard steps as the share arrives (a bar at 100 % counts 10, 20 … 100). It stays inside the track at 0 % and at 100 %. Busy, the tip prints three dots and hops tick to tick in ten hard steps, then is cut back. Measured in Firefox: the loop is 1200 ms, a share arrives in 400 ms (ten steps of 40 ms), stands 400 and leaves 400; the busy tip’s hops run 0 to 800 ms (t50 400 ms, t90 720 ms).',
                verdict: rec('it is exactly your mix: Ruled’s looks with Labelled’s number, so “how far” is answered twice, by the ruler and by the figure, and it counts in hard steps like the share. Its cost: the tip is as wide as four digits, so below about 12 % the plate sits at the start and the first step or two change the number but not the place'),
            },
            {
                key: 'ruled-slower',
                name: 'Ruled and labelled, a little slower: 1.25 times',
                see: 'The same bar, only slower: the loop is 1500 ms, a share arrives in 500 ms (ten steps of 50 ms instead of 40), stands 500 and leaves 500; the busy tip makes its ten hops in 1000 ms instead of 800 (t50 500 ms, t90 925 ms). The ten steps are kept; each is 10 ms longer and still lands as a step.',
                verdict: not('the nearest to the mix, and the number is easier to catch; but the difference from the mix is 10 ms a step, which is small'),
            },
            {
                key: 'ruled-slow',
                name: 'Ruled and labelled, slower: 1.5 times',
                see: 'The same bar, only slower: the loop is 1800 ms, a share arrives in 600 ms (ten steps of 60 ms), stands 600 and leaves 600; the busy tip makes its ten hops in 1200 ms (t50 600 ms, t90 1080 ms). The ten steps are kept; each is 20 ms longer than in the mix.',
                verdict: not('the number can be read while it counts, and the steps are still plainly steps; but the bar starts to feel patient, which is less of a slab dropped than of one lowered'),
            },
            {
                key: 'ruled-slowest',
                name: 'Ruled and labelled, a lot slower: 2 times',
                see: 'The same bar, only slower: the loop is 2400 ms, a share arrives in 800 ms (ten steps of 80 ms), stands 800 and leaves 800; the busy tip makes its ten hops in 1600 ms (t50 800 ms, t90 1480 ms). The ten steps are kept; each is twice as long as in the mix, which is the limit before steps read as ticking.',
                verdict: not('every figure is read as it passes, but at 80 ms a step the arrival is a count rather than a landing, and it is the slowest picture in the whole theme'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G11',
        question: 'What is brutalism’s spinner?',
        why: 'The signature (2026-10-03): a yellow block on its ink footprint is lifted, turned a quarter and set down, 1400 ms on the smooth curve.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'tip',
                name: 'The block tipped over (the signature, on gravity)',
                see: 'The yellow block is lifted off its footprint, turned a quarter and dropped back onto it, stopping dead: 12 units (1200 ms).',
                verdict: rec('it is your signature, a slab handled with weight, and no other theme’s spinner turns a block over.'),
            },
            {
                key: 'cube',
                name: 'A cube being poured',
                see: 'A small square well in the ink line fills with ink in four lifts and is struck, again and again.',
                verdict: not('it matches the loading pour, but it does not turn, so it reads as a progress mark rather than “busy”.'),
            },
            {
                key: 'ring',
                name: 'The package’s ring (the register before the signature)',
                see: 'A round ink ring with a yellow quarter turning.',
                verdict: not('it is familiar, but it is round, and every interface has it.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does something leave, and how does it arrive?',
        why: 'Your leave (2026-10-04): slammed out to the left in two hard steps, while its opacity steps out; what arrives plays it backwards, so it comes in from the side. A sideways shove in hard steps is grotesk’s leave too (shoved and cut in three steps).',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'lift',
                name: 'Lifted off and gone; set down',
                see: 'The part is lifted 1 rem up-left off its footprint, its shadow staying on the ground and growing, and at the top it is gone in one cut, shadow and all: 3 units. Arriving plays it backwards: it appears lifted over its footprint and falls onto it.',
                verdict: rec('it is the opening’s drop played backwards, so leaving, arriving and opening are one picture, and nothing fades.'),
            },
            {
                key: 'left',
                name: 'Slammed out to the left (your pick; near grotesk’s shove)',
                see: 'The part jumps out to the left in two hard steps while it steps out of sight; arriving, it jumps in from the left.',
                verdict: not('it is your pick, but sideways in hard steps is grotesk’s leave, and an arrival from the side breaks the drop.'),
            },
            {
                key: 'ground',
                name: 'Driven into the ground',
                see: 'The part is pressed onto its footprint, shadow gone, and cut out of the page; arriving, it stands up from its footprint into place.',
                verdict: not('it is blunt, but it reads as a press, not a leave, and standing up from the ground is no arrival.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'How do buttons, links and menu entries behave when they sit inside a header, a menu, a tile, a drawer or a key figure?',
        why: 'Use the State buttons above to see them hovered, focused and pressed. Today the header’s actions are thinner (a 2 px line on a 3 px shadow) and take one outline for focus; the menu entries are outlined and kicked sideways; the tile’s Open link turns into an ink plate; the key figure as a link has no shadow at rest.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly brutalism’s own elements',
                see: 'Every inner button is brutalism’s button: the 3 px line on the 6 px shadow, lifted off its footprint and named when pointed at, the two-channel ring, driven into its footprint when pressed; a menu entry takes the yellow plate in place; the key figure stands on its shadow.',
                verdict: rec('a button is a button wherever it sits, so the theme stays one grammar.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s actions in a 2 px line on a 3 px shadow with one outline, the menu entries outlined and kicked sideways, the tile’s link inverted, the key figure without a shadow.',
                verdict: not('each part was picked on its own, so the same button looks and answers four ways.'),
            },
            {
                key: 'quiet',
                name: 'Brutalism’s own, but quiet: ghosts inside a composite',
                see: 'Inside a composite every button is a ghost (no plate, no line, no shadow) until pointed at, when it stands up as the full slab.',
                verdict: not('it is calmer, but a composite’s actions stop looking like buttons until you touch them.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'What happens to a part when the pointer is on it?',
        why: 'Your register lifts a button 2 px up-left off its shadow, which stays on the ground, and the button names itself (BUTTON, your scope-12 of 2026-09-11). Your component picks grow the shadow without the lift (the tiles, the header), kick a menu entry sideways, invert the tile’s link and lift a day straight up.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'lift',
                name: 'Lifted off its footprint, and it names itself',
                see: 'The part pointed at moves 2 px up-left while its shadow stays on the ground, its plate turns yellow or steps darker, and its tag says what it is; siblings are untouched.',
                verdict: rec(
                    'it is your register’s Gumroad pair and your scope-12, and no other theme leaves a hard footprint behind when it lifts.',
                ),
            },
            {
                key: 'kick',
                name: 'Kicked sideways (the menu’s pick)',
                see: 'The part pointed at is shoved 4 px sideways, its plate yellow.',
                verdict: not('it is your menu’s pick, but sideways has nothing to do with the shadow, and it shifts the words you are reading.'),
            },
            {
                key: 'invert',
                name: 'Inverted (the tile link’s pick; high-contrast’s The bar flips)',
                see: 'The part pointed at turns to the ink plate with yellow words; nothing moves.',
                verdict: not('it is strong, but the flip to ink is high-contrast’s hover family, and the primary button is already ink.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'How does a part show it has keyboard focus?',
        why: 'The register draws DI2’s two channels in the concept demo’s order (the outline, an inner ring in the paper). Three of your picks replace them with one thick ink outline (the header, the key figure, the tile link), which vanishes against the ink primary button and the ink shadow.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, and the part lifted',
                see: 'Every focused part: the ink outline with the paper ring inside it, and the part lifted off its footprint as under the pointer.',
                verdict: rec(
                    'it is the design invariant, it reads on the yellow, the white and the ink plate alike, and the lift says where you are.',
                ),
            },
            {
                key: 'outline',
                name: 'One thick ink outline (the header’s, key figure’s and tile link’s picks)',
                see: 'One 3 px ink outline 2 px out, no paper ring, no lift.',
                verdict: not('it is heavy, but on the ink primary button and against the ink shadow it disappears.'),
            },
            {
                key: 'fill',
                name: 'The field’s yellow fill, with the ring',
                see: 'The two-channel ring, and the focused part filled yellow, as a field fills today; no lift.',
                verdict: not('it is clear, but yellow already means “pointed at”, so focus and hover look the same.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What happens to a part while it is pressed?',
        why: 'The base layer drops a pressed brutalism button onto its own shadow, but by 4 px while the shadow lies 6 px away, so the pressed box hangs 2 px above its footprint. Your header and key figure picks drop the full way; the menu’s pick shoves its entry 6 px sideways.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'ground',
                name: 'Driven into its footprint',
                see: 'The pressed part moves exactly onto its shadow, 6 px (3 px on a small part), the shadow gone, its plate one step darker, for as long as it is held.',
                verdict: rec('it is the anatomy’s own press, landed where the shadow says, and it is brutalism’s alone.'),
            },
            {
                key: 'shove',
                name: 'Shoved sideways (the menu’s pick)',
                see: 'The pressed part is shoved 6 px sideways; its shadow comes along.',
                verdict: not('it is your menu’s pick, but sideways is no press, and the part never meets its shadow.'),
            },
            {
                key: 'reverse',
                name: 'Reverse video while held (terminal’s)',
                see: 'The pressed part prints in reverse, the ink plate with paper words; nothing moves.',
                verdict: not('it is crisp, but reverse video is terminal’s press, and it loses the weight.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'Which typeface says what, and how heavy are the figures and dates?',
        why: 'Archivo Black in capitals shouts the headlines, Space Grotesk speaks the body; your picks set labels in Space Grotesk 800 capitals (the columns, the state, the trend). You found the date and “412 t” too thin in the first version: they were the register’s timestamp (mono, weight 400, 13.6 px, muted grey) and a table value (Space Grotesk 400, 13.6 px), beside a 3 px ink line. In every option below no text is thin any more: figures, dates, units and labels are 700 or heavier and never under 12 px, in ink, and prose is 500 at 16 px. What differs is the face and the treatment of figures and dates, shown on the same tile.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'shout',
                name: 'Archivo Black shouts, Space Grotesk speaks in bold capitals; dates in bold mono',
                see: 'Titles and figures (the 412 t too) in Archivo Black; labels, buttons, tags and table heads in Space Grotesk 700 capitals, tracked; prose in Space Grotesk 500; the date in the mono at 700, in ink.',
                verdict: rec(
                    'it is the concept demo’s voice and your picks’, every face has one job (the mono only for what a machine wrote), the date and the figure now carry the weight of the line beside them, and it is told apart from grotesk’s Archivo in sentence case.',
                ),
            },
            {
                key: 'mono',
                name: 'Mono capitals for labels (the dark themes’ label voice)',
                see: 'Labels, units, buttons and table heads in the mono, 700, capitals, tracked wide; figures stay Archivo Black.',
                verdict: not('it looks technical, but tracked mono capitals are nostromo’s, cyberpunk’s, synthwave’s and titanium’s labels.'),
            },
            {
                key: 'black',
                name: 'Archivo Black for everything, prose too',
                see: 'Labels, buttons, tags, table heads, dates, units and the running text in Archivo Black.',
                verdict: not('it is loud everywhere, so nothing is louder than anything else, and a paragraph in Archivo Black is hard to read.'),
            },
            {
                key: 'plated',
                name: 'Figures and dates on plates',
                see: 'The reading (412 t) sits on a small yellow slab in the 2 px line and 3 px shadow, each date on a small ink slab with paper digits; Space Grotesk 700, tabular.',
                verdict: not(
                    'the plates make the date and the figure impossible to miss and are pure brutalism, but a table of plates is heavy past three rows, and yellow already means “a hand”, not “a number”.',
                ),
            },
            {
                key: 'stamped',
                name: 'Dates and readings stamped on, askew',
                see: 'The reading and the dates in Archivo Black in a 2 px frame, each set 2° askew, as the dossier’s stamp is.',
                verdict: not(
                    'the stamp is yours (the dossier, the alarm, the empty zero) and it reads loud, but a stamp means “stamped once”, not a column of live dates, and a tilted number is harder to compare down a column.',
                ),
            },
            {
                key: 'family',
                name: 'One family: Space Grotesk 700 for headings and figures',
                see: 'No Archivo Black: the title, figures, units and dates in Space Grotesk 700, the figures set larger to make up the weight; prose 500.',
                verdict: not(
                    'one family is calm and the figures are bold enough, but it drops Archivo Black, the face of the concept demo and of every title you picked, and with it the shout.',
                ),
            },
            {
                key: 'caps',
                name: 'Capitals everywhere, prose too',
                see: 'Every line in Space Grotesk 700 capitals, tracked, the prose included; figures stay Archivo Black.',
                verdict: not('it is as raw as a site sign, but a sentence in capitals is slow to read and nothing is left to shout.'),
            },
            {
                key: 'ledger',
                name: 'A ruled ledger: figures right-aligned between 3 px rules',
                see: 'The table and the strip are ruled in 3 px ink, the row names on yellow, the readings and dates right-aligned in Space Grotesk 700, tabular.',
                verdict: not(
                    'it lines every number up and is the most honest about construction, but it is a table treatment, not a voice: it says nothing about the headings, and yellow row heads break “yellow is the hand”.',
                ),
            },
            {
                key: 'poster',
                name: 'Poster figures: the number is the headline',
                see: 'Figures set at 2.6 to 3.4 rem in Archivo Black, the reading and the dates large in Space Grotesk 700; labels stay small capitals.',
                verdict: not(
                    'a number you cannot miss is the poster idea, but only the one figure of a tile can be a headline: set on every row it shouts down the title.',
                ),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G16',
        question: 'Where do brutalism’s motifs (the shadow, the tape, the bolts, the bar, the stamp) appear?',
        why: 'Your picks put hazard tape on today in the month, on the chart’s tip and along the trend’s foot at rest, besides the graph’s site and the alarm where something is dangerous; stickers on four parts; the chart’s events as beaded rings (the same drawing as solstice’s Rivets).',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'The shadow is weight; hazard tape only on the warning; the chart’s events square bolts with their own small shadow; today ruled off by the six-pixel bar; the pick yellow; the empty state’s stamped zero askew.',
                verdict: rec('each motif says one thing, so a glance reads the page, and none of them is another theme’s.'),
            },
            {
                key: 'shadow',
                name: 'Only the shadow',
                see: 'No tape, no bolts, no bar, no stamp: slabs and their shadows, plain dots for events, today in bold.',
                verdict: not('it is pure, but it throws away the tape, the bar and the stamp you approved.'),
            },
            {
                key: 'all',
                name: 'On everything (as the picks spread them)',
                see: 'Tape on today, on the card’s foot and the tip; stickers on the changes; beaded rings for the events; a stamp on the card.',
                verdict: not('it is lively, but tape everywhere stops meaning danger, and stickers and beads are other themes’.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="brutalism"]'));
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
lookLine.setAttribute('data-for', 'brutalism');
lookLine.textContent = `${ASPECTS.length} questions, one rule of brutalism each; the first option of every question is the recommendation. Pick the one that is brutalism to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-bc-aspects]'));
const toc = document.querySelector('[data-bc-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'bc-aspect';
    box.id = `bc-${a.id}`;
    box.setAttribute('data-bc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-bc-${a.id}`);
    box.innerHTML = `<div class="bc-aspect__head">
        <h3 id="h-bc-${a.id}"><span class="bc-aspect__no">${n + 1}</span> ${a.label} <span class="bc-aspect__rule">${a.rule}</span></h3>
        <p class="bc-aspect__q"></p><p class="bc-aspect__why"></p></div><div class="bc-trio" data-bc-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.bc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.bc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.bc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'bc-col';
        col.setAttribute('data-bc-option', String(at + 1));
        col.innerHTML = `<p class="bc-label-row"><span class="bc-label-row__no">${at + 1}</span> <span class="bc-label-row__name"></span>${
            at === 0 ? ' <span class="bc-label-row__rec">Recommended</span>' : ''
        }</p><p class="bc-see"></p><p class="bc-verdict"></p>
        <div class="bc-scene" data-bc-kind="${a.kind}" data-bc-${a.id}="${o.key}" data-bc-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.bc-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.bc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.bc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('bc-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#bc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const BANDS = { units: [100, 300, 1500, 1200], picks: [100, 700, 1520, 2200], instant: [0, 0, 0, 0] };
for (const scene of section.querySelectorAll('[data-bc-durations]')) {
    const key = /** @type {keyof typeof BANDS} */ (scene.getAttribute('data-bc-durations'));
    const [contact, open, dialog, loop] = BANDS[key];
    const units = (/** @type {number} */ ms) => (key === 'units' ? `, ${ms / 100} ${ms === 100 ? 'unit' : 'units'}` : '');
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-bc-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms${units(contact)}`);
    say('open', `${open} ms${units(open)}`);
    say('dialog', `${dialog} ms${units(dialog)}`);
    say('loop', loop ? `${loop} ms a cycle${units(loop)}` : 'standing still, half poured');
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-bc-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 1700],
    ['hold', 1800],
    ['out', 900],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.bc-scene[data-bc-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.bc-scene[data-bc-kind="cycle"] [data-bc-num]')];
const words = [...section.querySelectorAll('.bc-scene[data-bc-kind="cycle"] [data-bc-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-bc-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/ t$/.test(text)) num.textContent = tick % 2 ? '4.4 t' : '4.2 t';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of words) word.textContent = tick % 2 ? 'Lifting' : 'Running';
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.bc-part') || scene;
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.bc-part') || scene;
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
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-bc-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-bc-phase'] });

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
radio('data-bc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--bc-slow', String(slow));
    run(0);
});
radio('data-bc-state', (value) => {
    section.setAttribute('data-bc-show', value);
});
document.querySelector('[data-bc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.bc-scene a, .bc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided brutalism components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=brutalism`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-bc-gallery]'));
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
