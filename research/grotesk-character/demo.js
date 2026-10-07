// What makes grotesk grotesk (Kenny, 2026-10-07 04:23: the themes one by one,
// "cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint"), the same
// way as titanium, forest, nostromo, cyberpunk, synthwave, solstice and
// brutalism (02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat niet past
// en dan zo voorstellen doet"). Four of its questions are the grotesk-only
// loading demo Kenny asked for on 2026-10-06 21:37: the graph's loading,
// Out of register, carried to every loading element.
//
// A review-kit demo in aspect mode, grotesk only. Each ASPECT is one rule of
// the theme's grammar (themes/grotesk/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-gk-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

/** A package button with its label span, so the register's baseline (scope-12) draws under its words. */
const button = (label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span></button>`;

/** Words that take the baseline when their part is pointed at, focused or pressed (G8, G14). */
const words = (text) => `<span class="gk-words">${text}</span>`;

/**
 * The place a waiting reading will stand (G10), with every loading picture an
 * option may draw in it: the proof in two plates (`.gk-proof`, its red plate
 * on ::before, its ink on ::after), the line that runs (`.gk-run`) and the
 * flap (`.gk-flap`). options.css shows one.
 */
const wait = (kind, cls = '') =>
    `<span class="gk-wait gk-wait--${kind} ${cls}" aria-hidden="true"><span class="gk-proof"></span><span class="gk-run"></span><span class="gk-flap"></span></span>`;

/** A chart's plot line, waiting: the proof drawn as the line itself, in two plates. */
const plotWait = () =>
    `<span class="gk-wait gk-wait--plot" aria-hidden="true"><svg class="gk-proof gk-proof--svg" viewBox="0 0 160 48" preserveAspectRatio="none">
        <g class="gk-plate-red"><polyline points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></g>
        <g class="gk-plate-ink"><polyline points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></g>
    </svg><span class="gk-run"></span><span class="gk-flap"></span></span>`;

/** The change, on a square plate; its arrow is the option's. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta gk-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/** The index a tone is marked with (G13): a bar down the start edge; options.css shows it where the option asks. */
const INDEX = `<span class="gk-index" aria-hidden="true"></span>`;

/** The tone's word, so colour is never the only carrier (DI4). */
const toneWord = (text) => `<span class="gk-toneword">${text}</span>`;

/** The colour bands a panel is printed and taken off by (G3, G12). */
const BAND = `<span class="gk-band" aria-hidden="true"><span class="gk-band__strip"></span></span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter gk-meter" role="meter" aria-label="Seats taken, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A chart's plot on its grid: the line, cut square. */
const plot = (cls = '', extra = '') => `<div class="gk-plot ${cls}" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="gk-plot__line" points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg>${extra}<span class="gk-plot__read">Departures, 412</span></div>`;

const PART = {
    dialog: () =>
        `<div class="gk-printed gk-printed--dialog"><div class="kp-dialog gk-dialog gk-float gk-opens" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title gk-title">Change the platform?</p>
        <p class="kp-dialog__description">The 07:32 to Basel moves to platform 9.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Move it', 'kp-button--sm kp-button--primary')}</div>
    </div>${BAND}</div>`,
    menu: () => `<div class="gk-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="gk-pop-wrap"><div class="gk-printed"><div class="kp-popover gk-pop gk-float gk-opens"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the timetable</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign a platform…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Cancel the train</button></li>
        </ul></div>${BAND}</div></div>
    </div>`,
    tile: (label = 'Basel SBB', body = '07:32 · platform 7', cls = 'gk-arrives') =>
        `<div class="kp-card gk-plate gk-tile ${cls}"><p class="kp-card__title gk-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Trains today', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi gk-plate gk-kpi ${cls}" ${extra}>
        <span class="kp-kpi__label gk-label">${label}</span>
        <span class="kp-kpi__value gk-figure gk-carrier" data-gk-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    days: (n = 7, from = 12, cls = 'gk-arrives') =>
        `<div class="gk-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="gk-day ${cls}" style="--i: ${i}"><span class="gk-day__num">${from + i}</span></span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="gk-rows" aria-hidden="true">${['07:32 Basel SBB', '07:41 Luzern', '07:46 Chur']
            .map((t, i) => `<span class="gk-row-line gk-arrives" style="--i: ${i}">${t}</span>`)
            .join('')}</div>`,
    strip: () =>
        `<div class="gk-strip" aria-hidden="true">${[
            ['On time', '38'],
            ['Late', '4'],
            ['Gone', '112'],
        ]
            .map(
                ([l, v], i) =>
                    `<div class="gk-strip__col gk-arrives" style="--i: ${i}"><span class="gk-label">${l}</span><span class="gk-figure">${v}</span></div>`,
            )
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="gk-state" data-gk-kind="${kind}"><span class="gk-state__dot gk-carrier gk-carrier--mark" aria-hidden="true"></span><span class="gk-state__word gk-carrier" data-gk-word>${word}</span></span>`,
    alert: (text = 'The 07:32 is back on time.') => `<div class="kp-alert gk-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="gk-spark-wrap"><span class="kp-kpi__label gk-label">Departures, 24 h</span><span class="gk-spark gk-carrier gk-carrier--line" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="butt" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg></span></div>`,
    column: (label = 'On time', value = '38') =>
        `<div class="gk-column gk-plate"><span class="kp-kpi__label gk-label">${label}</span><span class="gk-column__num gk-figure gk-carrier" data-gk-num>${value}</span></div>`,
    field: () =>
        `<label class="kp-field gk-field"><span class="kp-field__label">Platform</span><input class="kp-field__input" value="Platform 7, sector B" /></label>`,
    menuStatic: (items = ['Open the timetable', 'Assign a platform…'], cls = '', pointed = true) =>
        `<div class="kp-popover gk-pop gk-pop--static gk-float ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' gk-pointed' : ''}">${words(t)}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="gk-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="gk-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const waitingKpi = (cls = '') =>
    `<div class="kp-kpis"><div class="kp-kpi gk-plate gk-kpi gk-waits ${cls}" aria-busy="true"><span class="kp-kpi__label gk-label">Trains today</span>${wait(
        'figure',
    )}<span class="kp-kpi__trend gk-faint">on yesterday</span></div></div>`;

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('A week is set, day by day', PART.days(7), 'gk-part--wide') +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A value changes', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('A part waits (a loop)', waitingKpi());

const DIRECTION = () =>
    cell('A week of days is set', PART.days(7), 'gk-part--wide') +
    cell('A list of departures', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A strip of columns', PART.strip());

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card gk-plate gk-tile gk-waits" aria-busy="true"><p class="kp-card__title gk-title">Luzern</p>${wait('body')}</div>`;

const DURATION = () =>
    cell(
        'Contact: a press',
        `<div class="gk-row">${button('Export the timetable', 'gk-press')}</div><p class="gk-readout" data-gk-readout="contact"></p>`,
    ) +
    cell('A set: a tile arrives', PART.tile() + '<p class="gk-readout" data-gk-readout="set"></p>') +
    cell('The bands: a menu opens', PART.menu() + '<p class="gk-readout" data-gk-readout="bands"></p>') +
    cell('A loop: a tile waits', `${waitingTile()}<p class="gk-readout" data-gk-readout="loop"></p>`);

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="gk-row">${button('Export', 'gk-pointed')}${button('Depart', 'kp-button--primary')}${PART.state('Running')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8)) +
    cell(
        'Key figures',
        `<div class="kp-kpis gk-kpi-row">${PART.kpi('Trains today', '412', chip('6 %'), 'gk-line-a')}${PART.kpi('Late', '4', chip('1', 'down', 'bad'), 'gk-line-b')}${PART.kpi('Platforms', '12', chip('0', 'up'), 'gk-line-c')}</div>`,
        'gk-part--wide',
    ) +
    cell('A strip of columns', PART.strip()) +
    cell(
        'A link, today and the picked day',
        `<p class="gk-prose">See the <a href="#gk-intro">timetable</a> for details.</p><div class="gk-days gk-days--pick">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="gk-day${d === 13 ? ' gk-today' : ''}${d === 14 ? ' gk-picked' : ''}"><span class="gk-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell('Tags', `<div class="gk-row"><span class="kp-badge">12 new</span><span class="kp-tag">Platform 7</span></div>`);

const SURFACE = () =>
    cell('Card', PART.tile('Basel SBB', '07:32 · platform 7', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Trains today', '18 240', chip('6 %'))}</div>`) +
    cell('The plot of a chart', plot('gk-plate gk-plot--plate')) +
    cell('Meter', `<div class="gk-meter-plate gk-plate">${caption('Seats taken')}${meter(0.62, 0.8)}</div>`) +
    cell('A menu over the page', PART.menuStatic(['Open the timetable', 'Assign a platform…'], '', false)) +
    cell(
        'Buttons, a tag, a field',
        `<div class="gk-row">${button('Export')}${button('Depart', 'kp-button--primary')}<span class="kp-badge">12 new</span></div>${PART.field()}`,
    );

/** The tone scene does not replay; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-gk-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis gk-kpi-row">${PART.kpi('Trains today', '412', chip('6 %'))}<div class="kp-kpi gk-plate gk-kpi gk-warn" data-gk-kind="warn">${INDEX}<span class="kp-kpi__label gk-label">Delay, minutes</span><span class="kp-kpi__value gk-figure">${toneWord('Warning')}<span class="gk-toned">14</span></span><span class="kp-kpi__trend">${chip('9', 'up', 'bad')} on yesterday</span></div></div>`,
            'gk-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card gk-plate gk-tile gk-bad" data-gk-kind="bad">${INDEX}<p class="kp-card__title gk-title">${toneWord('Failed')}<span class="gk-toned">Chur</span></p><p class="kp-card__body">No reading since 16:40</p></div>`,
            ) +
            cell(
                'A failed state',
                `<div class="gk-state-plate gk-plate gk-bad" data-gk-kind="bad">${INDEX}${toneWord('Failed')}<span class="gk-toned">${PART.state('Stopped', 'bad')}</span></div>`,
            ) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover gk-pop gk-pop--static gk-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the timetable</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive gk-bad" data-gk-kind="bad">${INDEX}<span class="gk-toned">Cancel the train</span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="gk-meter-plate gk-plate gk-warn" data-gk-kind="warn">${INDEX}<span class="gk-cap">${toneWord('Warning')}<span class="gk-toned">Seats nearly full</span></span>${meter(
                    0.88,
                    0.8,
                    'data-kp-tone="warning"',
                )}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its mark', PART.state('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card gk-plate gk-tile gk-live-tile"><p class="kp-card__title gk-title">Basel SBB</p><p class="kp-card__body"><span class="gk-carrier gk-carrier--body" data-gk-num>4 late</span></p></div>`,
    );

/** Every waiting part of the dashboard, the loading picture drawn in each. */
const LOADERS = () =>
    cell('Key figure', waitingKpi()) +
    cell(
        'Busy table',
        `<div class="gk-table gk-plate gk-waits" aria-busy="true"><span class="gk-table__head">Train</span><span class="gk-table__head">Platform</span>${wait('rows')}</div>`,
    ) +
    cell(
        'Menu, its loading entry',
        `<div class="kp-popover gk-pop gk-pop--static gk-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item gk-waits gk-entry-wait" aria-busy="true">Loading platforms${wait(
            'entry',
        )}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="gk-days gk-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="gk-day gk-waits" style="--i: ${d - 1}">${wait('day')}</span>`)
            .join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="gk-plot gk-plot--wait gk-plate gk-waits" aria-busy="true">${plotWait()}</div>`) +
    cell('Meter, measuring', `<div class="gk-meter-plate gk-plate gk-waits" aria-busy="true">${caption('Seats taken')}${wait('meter')}</div>`) +
    cell('A tile', waitingTile());

/** The slip question: the same proofs, the red plate moving each option's way. */
const SLIP = () =>
    cell('Key figure', waitingKpi()) +
    cell(
        'Busy table',
        `<div class="gk-table gk-plate gk-waits" aria-busy="true"><span class="gk-table__head">Train</span><span class="gk-table__head">Platform</span>${wait('rows')}</div>`,
    ) +
    cell('Chart plot', `<div class="gk-plot gk-plot--wait gk-plate gk-waits" aria-busy="true">${plotWait()}</div>`) +
    cell(
        'Month heatmap days',
        `<div class="gk-days gk-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="gk-day gk-waits" style="--i: ${d - 1}">${wait('day')}</span>`)
            .join('')}</div>`,
    );

/** One spinner in three drawings; options.css shows the option's. */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="gk-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--gk-spin: ${size}"` : ''
    }><span class="gk-spin__mark"></span><span class="kp-spinner gk-spin__quarter"></span><span class="gk-spin__ring"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="gk-row gk-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'gk-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary gk-busy-button" aria-busy="true">${spin('', '', true)}<span class="kp-button__label">Saving…</span></button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card gk-plate gk-busy-panel">${spin('2rem', 'Reading the timetable')}<p class="kp-card__body">Reading the timetable…</p></div>`,
    );

/** The busy progress bar and the skeleton, in the three drawings. */
const BARS = () =>
    cell(
        'The busy progress bar',
        `<div class="gk-bar-set"><div class="kp-progressbar gk-bar-sig" role="progressbar" aria-label="Timetable busy" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>${wait(
            'bar',
            'gk-bar-proof',
        )}</div>`,
        'gk-part--wide',
    ) +
    cell(
        'Skeleton lines',
        `<div class="gk-skel-set"><div class="gk-skel-sig" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span></div><div class="gk-skel-proof" aria-hidden="true">${[
            0, 1, 2,
        ]
            .map((i) => `<span class="gk-skel__line" style="--i: ${i}">${wait('line')}</span>`)
            .join('')}</div></div>`,
    ) +
    cell(
        'A key figure, its skeleton',
        `<div class="kp-kpis"><div class="kp-kpi gk-plate gk-kpi gk-waits" aria-busy="true"><span class="kp-kpi__label gk-label">Trains today</span><div class="gk-skel-set gk-skel-set--figure"><div class="gk-skel-sig" aria-hidden="true"><span class="kp-skeleton"></span></div><div class="gk-skel-proof" aria-hidden="true"><span class="gk-skel__line">${wait(
            'figure',
        )}</span></div></div></div></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="gk-printed gk-leaver">${html}${BAND}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.tile('Basel SBB', '07:32 · platform 7', 'gk-leaves'))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpi gk-plate gk-kpi gk-leaves"><span class="kp-kpi__label gk-label">Trains today</span><span class="kp-kpi__value gk-figure">412</span></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="gk-row">${button('Export the timetable', 'gk-alone')}${button('Depart', 'kp-button--primary gk-alone')}</div>`,
        'gk-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header gk-header gk-plate"><div class="kp-page-header__inner"><div><p class="kp-page-header__title gk-title">Departures</p><p class="kp-page-header__description">Twelve platforms, Basel SBB.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm gk-in-header')}${button('Add a train', 'kp-button--sm kp-button--primary gk-in-header')}</div></div></header>`,
        'gk-part--wide',
    ) +
    cell(
        'Menu: its entries',
        `<div class="kp-popover gk-pop gk-pop--static gk-float gk-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item gk-in-entry">${words(
            'Open the timetable',
        )}</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${words('Assign a platform…')}</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card gk-plate gk-tile gk-in-tile"><p class="kp-card__title gk-title">Basel SBB</p><a class="kp-button kp-button--ghost kp-button--sm gk-tile-link" href="#gk-intro"><span class="kp-button__label">Open</span></a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card gk-plate gk-drawer"><p class="kp-card__title gk-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your platform.</p><div class="gk-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost gk-in-drawer',
        )}${button('Next', 'kp-button--sm kp-button--primary gk-in-drawer')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi gk-plate gk-kpi gk-in-kpi" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Trains today',
        )}</span><span class="kp-kpi__value gk-figure">412</span><span class="kp-kpi__trend">since 05:00</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="gk-row">${button('Export the timetable', 'gk-pointed')}${button('Depart', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open the timetable', 'Assign a platform…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card gk-plate gk-tile gk-tile--pointed"><p class="kp-card__title gk-title">Basel SBB</p><p class="kp-card__body">07:32 · platform 7</p><a class="kp-button kp-button--ghost kp-button--sm gk-tile-link gk-pointed" href="#gk-intro"><span class="kp-button__label">Open</span></a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis gk-kpi-row"><a class="kp-kpi gk-plate gk-kpi gk-pointed" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Trains',
        )}</span><span class="kp-kpi__value gk-figure">412</span></a><a class="kp-kpi gk-plate gk-kpi" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Late',
        )}</span><span class="kp-kpi__value gk-figure">4</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="gk-days">${[12, 13, 14, 15]
            .map((d) => `<span class="gk-day${d === 13 ? ' gk-pointed' : ''}"><span class="gk-day__num">${words(String(d))}</span></span>`)
            .join('')}</div>`,
    );

const FOCUS = () =>
    cell(
        'Button and primary button',
        `<div class="gk-row">${button('Export', 'gk-focused')}${button('Depart', 'kp-button--primary gk-focused')}</div>`,
    ) +
    cell('Header action', `<div class="gk-header-mini gk-plate">${button('Export', 'kp-button--sm gk-in-header gk-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi gk-plate gk-kpi gk-focused" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Trains today',
        )}</span><span class="kp-kpi__value gk-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover gk-pop gk-pop--static gk-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item gk-focused">${words(
            'Assign a platform…',
        )}</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${words('Rename')}</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="gk-days"><span class="gk-day"><span class="gk-day__num">13</span></span><span class="gk-day gk-focused"><span class="gk-day__num">${words(
            '14',
        )}</span></span><span class="gk-day"><span class="gk-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card gk-plate gk-tile"><p class="kp-card__title gk-title">Basel SBB</p><a class="kp-button kp-button--ghost kp-button--sm gk-tile-link gk-focused" href="#gk-intro"><span class="kp-button__label">Open</span></a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="gk-row">${button('Export the timetable', 'gk-press')}</div>`) +
    cell('Primary button', `<div class="gk-row">${button('Depart', 'kp-button--primary gk-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover gk-pop gk-pop--static gk-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item gk-press">${words(
            'Assign a platform…',
        )}</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="gk-days"><span class="gk-day gk-press"><span class="gk-day__num">${words('14')}</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle gk-plate gk-kpi gk-press" aria-pressed="false"><span class="kp-kpi__label gk-label">${words(
            'Late trains',
        )}</span><span class="kp-kpi__value gk-figure">4</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="gk-row"><button type="button" class="gk-key gk-press" aria-pressed="false"><span class="gk-key__swatch" aria-hidden="true"></span>${words(
            'Line 1',
        )}</button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card gk-plate gk-type"><p class="gk-type__label">Basel SBB, platform 7</p><p class="gk-type__head">Departures this morning</p>
        <p class="gk-type__prose">Two trains to Zürich ran late after a points failure at Liestal; the board shows the new times from 08:10.</p>
        <p class="gk-type__figure"><span class="gk-figure">14</span> <small>minutes late</small> ${chip('9 min', 'up', 'bad')}</p>
        <div class="gk-type__strip">${[
            ['On time', '38'],
            ['Late', '4'],
            ['Gone', '112'],
        ]
            .map(([l, v]) => `<div><span class="gk-label">${l}</span><span class="gk-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="gk-type__table"><tbody><tr><th scope="row">Train</th><td>IC 5 to Zürich HB</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp gk-stamp">2026-10-07 08:12</span></td></tr></tbody></table>
        <p>${button('Open the timetable', 'kp-button--sm')} <span class="kp-badge gk-tagged">12 new</span></p></div>`,
        'gk-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events on a plot',
        plot(
            'gk-plate gk-plot--plate gk-events',
            '<span class="gk-events__mark" style="--x: 37.5%; --y: 52%"></span><span class="gk-events__mark" style="--x: 75%; --y: 42%"></span>',
        ),
    ) +
    cell(
        'A card and a warning card',
        `<div class="gk-motif-pair">${PART.tile('Basel SBB', '07:32 · platform 7', 'gk-motif-card')}<div class="kp-card gk-plate gk-tile gk-motif-warn gk-warn" data-gk-kind="warn">${INDEX}<p class="kp-card__title gk-title">${toneWord(
            'Warning',
        )}<span class="gk-toned">Chur</span></p><p class="kp-card__body">14 minutes late</p><span class="gk-punch" aria-hidden="true"></span></div></div>`,
        'gk-part--wide',
    ) +
    cell(
        'Changes, today and the pick',
        `<div class="gk-row">${chip('6 %', 'up', 'good')}${chip('3 %', 'down', 'bad')}</div><div class="gk-days gk-days--motif">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="gk-day${d === 13 ? ' gk-today' : ''}${d === 14 ? ' gk-picked' : ''}"><span class="gk-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty gk-motif-empty"><p class="kp-empty__title">No departures yet</p><p class="kp-empty__body">The first leaves at 05:02.</p></div>`,
    ) +
    cell(
        'A divider between two sections',
        `<p class="gk-cap">Arrivals</p><div class="gk-divider" data-kp-divider></div><p class="gk-cap">Departures</p>`,
    );

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
        question: 'How does grotesk move: on time, in hard cuts, or eased in and out?',
        why: 'A theme exists to be distinct (your rule of 03:37). Grotesk’s register moves on cubic-bezier(0.2, 0, 0, 1), which is formal’s, light’s, nostromo’s and brutalism’s too. Your picks use nine curves; three of them, and the graph’s Out of register, run at an even pace (the chart’s At an even pace, the drawer’s hard beat, the meter’s Express), and the graph holds still in register for a beat before it slips again, the way the Swiss station clock’s hand stops at the top before it goes on. No theme moves like that yet.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'ontime',
                name: 'On time: an even pace, a dead stop',
                see: 'Everything travels at an even pace and stops dead on its mark: the week is set day by day, the menu is printed, the tile is set, the train runs under the changed figure. The loop travels, stops in register and dwells there, then goes again (stop-to-go).',
                verdict: rec(
                    'it is a timetable you can see, the trains run on time and stop at the station, and the dwell is no other theme’s: titanium’s feed never stops.',
                ),
            },
            {
                key: 'cut',
                name: 'Hard cuts (your resize; terminal’s, nostromo’s, cyberpunk’s way)',
                see: 'Everything jumps to its place in three hard cuts, no travel in between, as your resize’s cut does today.',
                verdict: not('it is crisp and very Swiss for a resize, but hard steps for everything are how three other themes move.'),
            },
            {
                key: 'eased',
                name: 'Eased in and out (your four Set in type picks; near synthwave’s sunrise)',
                see: 'Everything starts slowly, speeds up and slows down into place, cubic-bezier(0.7, 0, 0.3, 1), as your Set in type picks and the leave do today.',
                verdict: not('it is smooth, but a slow start and a soft landing is synthwave’s sunrise curve, and a timetable does not ease.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does a part move when it arrives?',
        why: 'Your arrivals all come from the start: the calendar’s On the grid, the columns’ Slid in and the tiles’ Set in type move the part itself along its line; the menu’s, the header’s and the trend’s Set in type cut it in place from the start, which is exactly how titanium’s arrivals work. Brutalism’s analysis left grotesk the sideways shove.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'line',
                name: 'Set along its line: it slides out from behind its own start edge',
                see: 'Each day, departure, tile and column slides in along its own line from the start and stops flush on its column; it appears from behind its own start edge, so nothing pokes out before its slot. One after another, in reading order.',
                verdict: rec(
                    'it is type being set in the composing stick, every part stops flush on the grid, and no other theme moves the part itself along its line.',
                ),
            },
            {
                key: 'clip',
                name: 'Cut in place from the start (your menu’s, header’s and trend’s picks; titanium’s feed)',
                see: 'Each part stands still and is uncovered from its start edge to its end.',
                verdict: not('it is clean, but a part uncovered in place from the start is titanium’s arrival exactly.'),
            },
            {
                key: 'rise',
                name: 'Rising into its line (solstice’s and synthwave’s way)',
                see: 'Each part rises into its line from below its own foot.',
                verdict: not('it is gentle, but rising is solstice’s and synthwave’s, and it does not move along the line a Swiss page is read on.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening a menu or a dialog',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Your menu and your header’s menu are Set in type: cut in place from the start (their text says “drawn in from the top”). The signature’s dialog, toast and tooltip are cut in from the start too. Your leave is three colour bands, red, ink and paper, sweeping across like a Swiss poster (2026-10-04), and since 2026-10-05 an opening is the leave played backwards.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'bands',
                name: 'Printed by the colour bands (your leave, backwards)',
                see: 'Three flat bands, paper, ink and red, sweep across the panel’s place from the start at an even pace and leave it printed behind them: 4 units (480 ms). Closing, they sweep back toward the start and take it off.',
                verdict: rec(
                    'it is your own leave played backwards, so opening, arriving and leaving are one picture, and no other theme opens with flat colour sweeping across.',
                ),
            },
            {
                key: 'cut',
                name: 'Cut in from the start, as picked (near titanium’s feed)',
                see: 'The panel is uncovered from its start edge to its end, 260 ms, as your menu’s Set in type and the signature’s dialog do.',
                verdict: not('it is your pick, but a cut from the start is titanium’s arrival, and it is not the picture your leave draws.'),
            },
            {
                key: 'slide',
                name: 'Slid in on a hard beat (your drawer’s pick)',
                see: 'The whole panel slides in from its end edge at an even pace and stops dead, 220 ms, as your drawer does.',
                verdict: not(
                    'it is on time, but a panel sliding in from an edge is titanium’s drawer and toast, and a menu does not live at an edge.',
                ),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long do contact, a set, the bands and a loop take?',
        why: 'Grotesk’s register gives contact 120 ms; your resize cuts in 240 ms and your leave takes 550. Your picks take 150 to 1200 ms for a one-shot and 0.6 to 2.6 s for a loop, with no unit under them; the graph’s Out of register takes 2600 ms.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: '120 · 240 · 480 · 2640 (units of 120 ms)',
                see: 'Contact 1 unit (120 ms), a set 2 (240 ms), the bands 4 (480 ms), a loop 22 (2640 ms, of which 4 dwell in register): the readouts under each part say the numbers.',
                verdict: rec(
                    'every duration is the register’s own 120 ms counted, a set is your resize’s cut, and the loop keeps the graph’s period within 2 %.',
                ),
            },
            {
                key: 'picks',
                name: 'As the picks, the slowest of each kind',
                see: 'Contact 150 ms (the nav link), a set 1200 ms (the chart’s even pace), the bands 550 ms (the leave), a loop 2600 ms (the graph).',
                verdict: not('it is your picks, but a set of 1.2 s is a slow train, and nothing ties one number to another.'),
            },
            {
                key: 'instant',
                name: 'At once (the anatomy’s “the page is simply there”; retro’s 0 ms)',
                see: 'Nothing moves: every part is simply there, and a waiting part shows its proof standing a little out of register.',
                verdict: not('it is the concept demo’s quiet page, but it hides every pick of yours that moves, and 0 ms is retro’s register.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What do black, the red and the statuses each mean?',
        why: 'The anatomy: one red, text-safe, “never a plate”; black is the structure. Your picks lay the red on every plate as the transit board’s bar (the tiles, the trend, the menu, the key figure’s foot), turn the tiles’ loading flap amber, and the graph’s transit map gives every line its own colour.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'signal',
                name: 'Black builds, the red signals once, the statuses state',
                see: 'Every word, rule and line is black; the red marks one thing: the hand (the pointed button’s baseline), today, the primary action, the pick’s line; the meter’s share; the statuses only as a tone (the change). The plates are white.',
                verdict: rec('the red keeps saying “this one”, as on a Swiss poster, and black and white carry everything else.'),
            },
            {
                key: 'lines',
                name: 'Line colours (the graph’s transit map carried to every plate)',
                see: 'Every plate and series takes its own line colour on its top rule: red, blue, amber, green.',
                verdict: not('it is a transit map, but the statuses become decoration and red stops meaning anything.'),
            },
            {
                key: 'plates',
                name: 'Black plates (your busy panel’s flap board everywhere; near high-contrast’s ink frame)',
                see: 'Every plate is the ink with white words, the red on black.',
                verdict: not(
                    'it is a departure board, but black plates everywhere are high-contrast’s and dark’s, and the red reads only 3.75:1 on black.',
                ),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is a grotesk plate made of?',
        why: 'Your shapes draw no box at all several times (the calendar’s poster grid, the columns’ big numerals, the chart’s Swiss grid, the key figure’s ruled grid), a rule along an edge (the header’s index card, the drawer’s foot rule), a red bar on top four times (the transit board) and a frame twice (the tour card, the state chip). The register frames the windows in 3 px.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'rule',
                name: 'A column under its rule: no box, a 3 px ink rule on top',
                see: 'Every plate is white paper with no frame and a heavy ink rule along its top, its words flush left; the grid’s hairlines only under data (the plot). A menu over the page keeps the register’s 3 px ink frame.',
                verdict: rec(
                    'it is your poster grid and big numerals carried to every plate, and no other theme draws a plate as a rule without a box.',
                ),
            },
            {
                key: 'board',
                name: 'The transit board: a red bar on top (your tiles’, trend’s and menu’s picks; near synthwave’s stripe)',
                see: 'Every plate has a 6 px red bar along its top and no frame.',
                verdict: not(
                    'it is your shape four times, but the red on every plate stops signalling, and a stripe on every panel’s top is synthwave’s.',
                ),
            },
            {
                key: 'box',
                name: 'The box: a 2 px ink frame all round (near high-contrast’s ink frame and brutalism’s line)',
                see: 'Every plate in a 2 px ink frame, as the tour card and the register’s windows.',
                verdict: not('it is solid, but a box in an ink line is high-contrast’s and brutalism’s, and Swiss pages divide by rules, not boxes.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show on a part?',
        why: 'Your tone picks draw five ways: the index colour (the menu’s red bar at the destructive entry’s start; the alert’s own start edge), the figure on the tone’s plate (the trend, the key figure), a rule in the tone along the foot (the tiles), a tick in the tone (the state), a shake (the meter). The columns put the change on a square block with ↗ and ↘.',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'index',
                name: 'Indexed: a bar in the tone down the start edge, and the tone’s word',
                see: 'A warning or failed part carries a 6 px bar of its tone down its start edge, like a thumb index, and the tone’s word in bold before its figure or title; the change sits on a square plate with ↗ or ↘.',
                verdict: rec(
                    'it is your menu’s index colour and the alert’s own edge, it reads without colour (the word), and no theme indexes a tone at the start edge.',
                ),
            },
            {
                key: 'plate',
                name: 'The figure on the tone’s plate (your trend’s and key figure’s picks; high-contrast’s framed plate)',
                see: 'The figure or title printed on the tone’s plate.',
                verdict: not(
                    'it is your pick twice, but a tone on a plate is high-contrast’s and terminal’s, and an amber plate reads 3.26:1 under white words.',
                ),
            },
            {
                key: 'under',
                name: 'The underlined figure (your tiles’ pick)',
                see: 'A heavy 4 px rule in the tone along the part’s foot.',
                verdict: not(
                    'it is your tiles’ pick, but a rule at the foot is easily read as the plate’s edge, and the amber rule is faint (3.26:1).',
                ),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'How does a value that changes in place show it changed?',
        why: 'Your live picks: the key figure’s Flipped (a jump up in two hard steps; its text promises a departure-board flap), the tiles’ Flipped (a jump up in hard steps; it never played until 2026-10-07, when the arrival’s rule outranked it), the columns’ Inverted (high-contrast’s The bar flips), the state’s A flat swap (a swell to 1.4×) and at once for the trend and the chart (formal’s Redrawn). Your graph’s live update is The train passes: a train runs along the changed line.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'train',
                name: 'The train passes (your graph’s, carried to every value)',
                see: 'The new value is written at once; a short red train runs along its baseline from the start to the end at an even pace and leaves, 4 units (480 ms). A line, a mark or a tile is passed along its foot.',
                verdict: rec(
                    'it is your graph’s own live update, the value never moves, and no theme runs a train under a value (synthwave’s laser is drawn out from the centre and glows).',
                ),
            },
            {
                key: 'jolt',
                name: 'Flipped, as picked (a jump up in two hard steps)',
                see: 'The changed value jumps up a little and drops back, in two hard steps, 250 ms.',
                verdict: not('it is your pick, but it is a jolt, not a flap, and a figure that jumps is harder to read just when it changed.'),
            },
            {
                key: 'invert',
                name: 'Inverted (your columns’ pick; high-contrast’s The bar flips)',
                see: 'The changed value shows white on black for a moment.',
                verdict: not(
                    'it is your columns’ pick, but the flip to ink is high-contrast’s live family, and it blacks the value out for a moment.',
                ),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading: the picture on every waiting part',
        rule: 'G10',
        question: 'What does a waiting part show while it loads?',
        why: 'Your graph’s loading, Out of register (2026-10-06 21:37): the map printed in black over a red plate that has slipped; the red copy travels round the black one, snaps into register for a beat and slips off again. You asked for every loading element to be shown from it. Your other loading picks: eight lines running along the part (the columns, the trend, the calendar’s ticker, the menu’s ruling pen, the chart’s grid build, the meter’s Express, the signature skeleton and busy bar), the tiles’ flap, and the busy table’s Poster shifts, which does not move at all.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'register',
                name: 'Out of register: the reading’s place printed as a proof in two plates',
                see: 'Where the value will stand is a proof in heavy ink; under it the same proof in red has slipped and travels round it, snaps into register (the red disappears behind the black), dwells there for 4 units and slips off again: 2640 ms. The labels stay readable above it.',
                verdict: rec(
                    'it is your graph’s picture carried to every part, it is print, which is where the Swiss style was made, and no theme loads in two plates.',
                ),
            },
            {
                key: 'line',
                name: 'A line runs (your columns’, trend’s, calendar’s and menu’s picks; forest’s, solstice’s and nostromo’s way)',
                see: 'A short ink line runs along the foot of every waiting part, start to end, again and again; the reading’s place stands faint.',
                verdict: not('it is your pick eight times, but something running along a part’s foot is how forest, solstice and nostromo load.'),
            },
            {
                key: 'flap',
                name: 'The flap board (your tiles’ pick)',
                see: 'A bar at every waiting part’s foot flips over in hard steps, red, ink, red, like a departure board’s flap.',
                verdict: not('it is the station, but a flap that flips forever says “changing”, not “waiting”, and it is small for a whole part.'),
            },
        ],
    },
    {
        id: 'slip',
        label: 'Loading: how the red plate moves',
        rule: 'G10',
        question: 'While it waits, how does the red plate move against the black?',
        why: 'On your graph the red copy circles the black one at an even pace through eight positions, 16 px off, snaps into register at 84 % of 2600 ms, holds to 92 % while the stations press, and slips off again. On a key figure or a day the slip is smaller: 3 to 8 px. The picture stays out of register in every option; only the slip changes.',
        kind: 'loop',
        scene: SLIP,
        options: [
            {
                key: 'orbit',
                name: 'Round the black, then into register (your graph’s)',
                see: 'The red plate travels round the black at an even pace, snaps under it and dwells for 4 units, then slips off and goes round again: 2640 ms.',
                verdict: rec(
                    'it is exactly your graph’s movement, so every waiting part loads the way the network does, with the station clock’s dwell.',
                ),
            },
            {
                key: 'line',
                name: 'Along the line, then back into register',
                see: 'The red plate slides off along the line toward the end at an even pace, snaps back under the black and dwells there, then slides off again.',
                verdict: not(
                    'it keeps to grotesk’s horizontal line, but a plate that only slides sideways reads as a shadow or a trail, not a misprint.',
                ),
            },
            {
                key: 'steps',
                name: 'In hard steps round the black',
                see: 'The red plate jumps between four offsets (end, below, start, above), holding each, then snaps into register.',
                verdict: not('it is crisp, but hard jumps are how cyberpunk’s copies move, and it loses the even pace of the press.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'Loading: the spinner',
        rule: 'G11',
        question: 'What is grotesk’s spinner?',
        why: 'The signature (2026-10-03): a red quarter disc stepping round an ink square, each quarter turn held, 1600 ms. Out of register can draw the printer’s own mark: the registration mark every proof carries in its margin.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'mark',
                name: 'The register mark (out of register, carried)',
                see: 'A printer’s registration mark, a ring crossed by two hairlines, in ink; its red copy travels round it, snaps into register and dwells, 2640 ms.',
                verdict: rec(
                    'it is the loading picture in its smallest form, so the spinner and every waiting part speak one picture, and no theme’s spinner is a print mark.',
                ),
            },
            {
                key: 'quarter',
                name: 'The signature’s quarter, as approved',
                see: 'A red quarter disc stepping round an ink square, each quarter turn held, 1600 ms.',
                verdict: not('it is your signature and it already dwells at each quarter, but it is a second loading picture beside the proof.'),
            },
            {
                key: 'ring',
                name: 'The package’s ring (the register before the signature)',
                see: 'A grey ring with a red quarter turning.',
                verdict: not('it is familiar, but it is every interface’s spinner.'),
            },
        ],
    },
    {
        id: 'bars',
        label: 'Loading: the busy bar and the skeleton',
        rule: 'G11',
        question: 'How do the busy progress bar and the skeleton lines wait?',
        why: 'The signature (2026-10-03): the busy bar steps one red column along its twelve columns (1440 ms), the skeleton’s grey lines have a red marker running under them (1800 ms, on synthwave’s curve). Both run along a line; Out of register prints them instead.',
        kind: 'loop',
        scene: BARS,
        options: [
            {
                key: 'register',
                name: 'Printed out of register',
                see: 'The bar’s ruled track and the skeleton’s lines are proofs in ink, their red plates travelling round them and registering on the same clock; the lines one column of time apart, so the misprint moves down the page.',
                verdict: rec('it is one loading picture for every waiting element, the bar keeps its twelve columns, and nothing runs along a line.'),
            },
            {
                key: 'signature',
                name: 'The signature, as approved',
                see: 'The busy bar steps one red column along its twelve columns; the skeleton’s red marker runs under its grey lines.',
                verdict: not(
                    'it is your signature, but it runs along a line like forest’s and solstice’s loading, and it is a second picture beside the proof.',
                ),
            },
            {
                key: 'line',
                name: 'A line runs (your columns’ pick)',
                see: 'A short ink line runs along the bar and under each skeleton line.',
                verdict: not('it is plain, but it is the runner many themes share, and the bar loses its grid.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does something leave, and how does it arrive?',
        why: 'Your leave (2026-10-04, round 7): three colour bands, red, ink and paper, sweep across and take it with them, 550 ms on an ease-in-out, the part fading out in its last 10 %; what arrives plays it backwards. The bands do not cover the part’s frame today.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'bands',
                name: 'The colour bands, at an even pace (your leave)',
                see: 'Red, ink and paper sweep across the part toward the start, frame and all, and the paper takes it off: 4 units (480 ms), no fade. Arriving, the bands sweep the other way and print it.',
                verdict: rec('it is your own leave on grotesk’s even pace, it is the opening’s picture too, and no other theme leaves this way.'),
            },
            {
                key: 'cut',
                name: 'Cut out toward the start in three hard cuts (your resize’s cut; near titanium’s cut)',
                see: 'The part is cut away from its end toward its start in three hard cuts; arriving, it is cut in again.',
                verdict: not('it is your resize’s cut, but a cut is titanium’s way of making and unmaking a part.'),
            },
            {
                key: 'shove',
                name: 'Shoved out toward the start (near brutalism’s picked slam)',
                see: 'The part slides back along its line behind its own start edge and is gone; arriving, it is set again.',
                verdict: not('it matches the arrival, but a part shoved out sideways is brutalism’s picked leave, and you chose the bands.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'How do buttons, links and menu entries behave when they sit inside a header, a menu, a tile, a drawer or a key figure?',
        why: 'Use the State buttons above to see them hovered, focused and pressed. Today the header’s actions have a 1 px line, a red bar at the foot on hover and one red outline for focus; the menu entries grow a red top border; the tile’s Open link takes one red outline; the key figure as a link turns red with a tint.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly grotesk’s own elements',
                see: 'Every inner button is grotesk’s button: the 2 px ink line, the wash and the red baseline when pointed at, the two-channel ring, the thickened rule when pressed; a menu entry takes the wash and the baseline; the key figure as a link the same.',
                verdict: rec('a button is a button wherever it sits, so the theme stays one grammar.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s actions in a 1 px line with a red foot bar and one red outline, the menu entries growing a red top border, the tile’s link with one red outline, the key figure turning red with a tint.',
                verdict: not('each part was picked on its own, so the same button looks and answers four ways.'),
            },
            {
                key: 'quiet',
                name: 'Grotesk’s own, but quiet: words only inside a composite',
                see: 'Inside a composite every button is its words alone (no line) until pointed at, when its line and baseline appear.',
                verdict: not('it is calmer, but a composite’s actions stop looking like buttons until you touch them.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'What happens to a part when the pointer is on it?',
        why: 'Your scope-12 (2026-09-12): touching a control draws the red baseline its words stand on, from the start; the register adds the wash. Your component picks draw a red bar at the foot (the header), a red top border that pushes the entry 2 px (the menu), a top bar growing 6 → 10 px that pushes the tile’s content (the tiles), a red line with a tint (the key figure) and an underline (a day).',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'baseline',
                name: 'The baseline appears (your scope-12)',
                see: 'The part pointed at gets the red rule its words stand on, drawn from the start, and its plate takes the light wash; a coloured button inverts. Nothing moves, siblings are untouched.',
                verdict: rec(
                    'it is your approved baseline on every part, the type’s own line rather than the box’s edge, and nothing beside it shifts.',
                ),
            },
            {
                key: 'bar',
                name: 'A bar on the edge thickens (your header’s, menu’s and tiles’ picks; near solstice’s lit foot)',
                see: 'A red bar appears or thickens on the part’s edge: the tile’s top bar grows and pushes its words down, a menu entry grows a top border.',
                verdict: not('it is your picks, but a growing border moves what is beside it, and a lit edge is solstice’s hover.'),
            },
            {
                key: 'invert',
                name: 'Inverted (the primary button’s mirror on everything; high-contrast’s The bar flips)',
                see: 'The part pointed at turns to the ink plate with white words; nothing moves.',
                verdict: not('it is strong, but the flip to ink is high-contrast’s hover family, and a whole tile turning black is loud.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'How does a part show it has keyboard focus?',
        why: 'The register gives a button one 2 px ink ring with the page’s white outside it, and a coloured button three layers. Three of your picks use one outline instead: red on the header’s action and the tile’s link, a thin ink line 3 px out on the key figure.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, and the baseline drawn',
                see: 'Every focused part: a white ring tight round it and the ink outline outside that, and the red baseline under its words as when pointed at.',
                verdict: rec(
                    'it is the design invariant, it reads on white, on the red primary and on the ink alike, and the baseline says where you are.',
                ),
            },
            {
                key: 'outline',
                name: 'One red outline (your header’s and tile link’s picks)',
                see: 'One 2 px red outline 2 px out, no white ring, no baseline.',
                verdict: not(
                    'it is your pick, but on the red primary button it reads as part of the button, and next to the red pick it looks like the pick.',
                ),
            },
            {
                key: 'frame',
                name: 'A thin ink frame (your key figure’s pick)',
                see: 'One 1 px ink outline 3 px out.',
                verdict: not('it is quiet, but one pixel is easy to miss, and it looks like the plate’s own edge.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What happens to a part while it is pressed?',
        why: 'Your scope-12: the press thickens the baseline downward into the deeper red, at once; the plate takes the darker grey, and a coloured button presses grey with a black label (2026-09-14). Your header’s and menu’s picks turn their bar to ink instead.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'rule',
                name: 'The rule thickens (your scope-12)',
                see: 'The baseline under the words thickens to 4 px in the deeper red, the plate turns the darker grey, at once, for as long as it is held; the primary presses grey with a black label. Nothing moves.',
                verdict: rec('it is your approved press, it says “held” on the very line the hover drew, and no other theme thickens a rule.'),
            },
            {
                key: 'grey',
                name: 'The grey alone (the package’s press)',
                see: 'The plate turns the darker grey; no rule.',
                verdict: not('it is plain, but it drops the baseline you approved, so hover and press no longer belong together.'),
            },
            {
                key: 'reverse',
                name: 'Reverse video while held (terminal’s)',
                see: 'The pressed part prints white on black; nothing moves.',
                verdict: not('it is crisp, but reverse video is terminal’s press.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'Which typeface says what, and in which case?',
        why: 'Archivo heavy and tight sets the headings and figures, Inter the body; your columns and calendar set their heads in Inter bold in sentence case. Several register parts speak in mono (the microlabel in red mono capitals, the badges and tags, the side note, a table’s status), and the busy panel’s flap board in mono capitals tracked wide. Brutalism’s analysis left grotesk sentence case.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'sentence',
                name: 'Archivo heavy and tight, Inter for the rest, in sentence case',
                see: 'Titles and figures in Archivo 800–900, tight, flush left; labels, buttons, tags and table heads in Inter 700, sentence case, no tracking; prose in Inter; the mono only for the timestamp.',
                verdict: rec(
                    'it is the Swiss page, every face has one job, and it is told apart from brutalism’s capitals and the dark themes’ mono labels.',
                ),
            },
            {
                key: 'mono',
                name: 'Mono capitals for labels (the register’s microlabel; the dark themes’ label voice)',
                see: 'Labels, tags and table heads in the mono, capitals, tracked wide.',
                verdict: not('it looks technical, but tracked mono capitals are nostromo’s, cyberpunk’s, synthwave’s and titanium’s labels.'),
            },
            {
                key: 'lower',
                name: 'All lowercase (the Bauhaus universal alphabet)',
                see: 'Every word in lowercase, titles and labels too; Archivo and Inter as in option 1.',
                verdict: not(
                    'it is radical and very modernist, but proper names lose their capitals, and it is the Bauhaus rather than the Swiss style.',
                ),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G16',
        question: 'Where do grotesk’s motifs (the grid, the rule, the red bar, the flap, the disc, the arrows) appear?',
        why: 'Your picks put a red bar on every plate (the transit board), a flap on the tiles’ loading and the busy panel, punched holes on the chart’s tip, and the twelve columns on the page, the progress track, the chart and the key figure.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'The grid under data only; a rule where a plate starts; the red disc only for the empty state; the arrows for a change; the index for a tone; today in red, the pick a red line; the double rule with its red hairline as the divider.',
                verdict: rec('each motif says one thing, so a glance reads the page, and none of them is another theme’s.'),
            },
            {
                key: 'pure',
                name: 'Only the grid and the rule',
                see: 'No index, no disc, no arrows, no red hairline: rules and the grid, the changes as + and −, today in bold.',
                verdict: not('it is pure, but it throws away the index, the disc and the divider you approved.'),
            },
            {
                key: 'all',
                name: 'On everything (as the picks spread them)',
                see: 'A red bar on every plate, punched holes on the warning card, the grid behind every plate, today and the pick both boxed.',
                verdict: not('it is lively, but the red bar on everything stops meaning anything, and the punch card is decoration.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="grotesk"]'));
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
lookLine.setAttribute('data-for', 'grotesk');
lookLine.textContent = `${ASPECTS.length} questions, one rule of grotesk each (9 to 12 the loading demo from the graph’s Out of register); the first option of every question is the recommendation. Pick the one that is grotesk to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-gk-aspects]'));
const toc = document.querySelector('[data-gk-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'gk-aspect';
    box.id = `gk-${a.id}`;
    box.setAttribute('data-gk-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-gk-${a.id}`);
    box.innerHTML = `<div class="gk-aspect__head">
        <h3 id="h-gk-${a.id}"><span class="gk-aspect__no">${n + 1}</span> ${a.label} <span class="gk-aspect__rule">${a.rule}</span></h3>
        <p class="gk-aspect__q"></p><p class="gk-aspect__why"></p></div><div class="gk-trio" data-gk-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.gk-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.gk-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.gk-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'gk-col';
        col.setAttribute('data-gk-option', String(at + 1));
        col.innerHTML = `<p class="gk-label-row"><span class="gk-label-row__no">${at + 1}</span> <span class="gk-label-row__name"></span>${
            at === 0 ? ' <span class="gk-label-row__rec">Recommended</span>' : ''
        }</p><p class="gk-see"></p><p class="gk-verdict"></p>
        <div class="gk-scene" data-gk-kind="${a.kind}" data-gk-${a.id}="${o.key}" data-gk-phase="${a.kind === 'cycle' ? 'in' : 'hold'}">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.gk-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.gk-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.gk-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('gk-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#gk-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const BANDS = { units: [120, 240, 480, 2640], picks: [150, 1200, 550, 2600], instant: [0, 0, 0, 0] };
for (const scene of section.querySelectorAll('[data-gk-durations]')) {
    const key = /** @type {keyof typeof BANDS} */ (scene.getAttribute('data-gk-durations'));
    const [contact, set, bands, loop] = BANDS[key];
    const units = (/** @type {number} */ ms) => (key === 'units' ? `, ${ms / 120} ${ms === 120 ? 'unit' : 'units'}` : '');
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-gk-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms${units(contact)}`);
    say('set', `${set} ms${units(set)}`);
    say('bands', `${bands} ms${units(bands)}`);
    say('loop', loop ? `${loop} ms a cycle${units(loop)}` : 'standing still, out of register');
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-gk-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 1900],
    ['hold', 1800],
    ['out', 900],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.gk-scene[data-gk-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.gk-scene[data-gk-kind="cycle"] [data-gk-num]')];
const wordsToSwap = [...section.querySelectorAll('.gk-scene[data-gk-kind="cycle"] [data-gk-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-gk-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/ late$/.test(text)) num.textContent = tick % 2 ? '5 late' : '4 late';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of wordsToSwap) word.textContent = tick % 2 ? 'Boarding' : 'Running';
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.gk-part') || scene;
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.gk-part') || scene;
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
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-gk-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-gk-phase'] });

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
radio('data-gk-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--gk-slow', String(slow));
    run(0);
});
radio('data-gk-state', (value) => {
    section.setAttribute('data-gk-show', value);
});
document.querySelector('[data-gk-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.gk-scene a, .gk-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided grotesk components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=grotesk`, only its
// combination of the decided picks), the graph's Out of register first, as
// the source of the loading questions. Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-gk-gallery]'));
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
