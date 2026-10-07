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
//
// ROUND 2 (Kenny, 2026-10-07 21:23): the anchor is chosen, "Out of register"
// (research/grotesk-anchor): a second, red plate arrives offset, travels a
// closing spiral, falls into register with a dwell and leaves as the same fall
// played backwards; two plates of one print, the red under the black ink,
// skeleton text as the hero, no crosshairs, no marks, no rings. This page was
// built before the anchor was chosen; every motion question is re-derived from
// it: the red plate is the one thing that moves, and where it stands says what
// the part is (off: arriving, waiting, hovered, changing; in register: there,
// held). Options that already fit stay; the rest are replaced or demoted.
//
// ROUND 3 / UPDATE 2 (Kenny's verdict on round 2): thirteen questions are
// approved and locked (update.json "picks"); six are asked again. Kenny: "I
// like a closing spiral, but I feel like I only like it going clockwise", so
// the rule of opposites is broken for the waiting loop and the leave: the red
// plate turns clockwise ALWAYS, on its way in and on its way out. The slip
// (how the plate moves), the spinner, the busy bar and the leave are redrawn
// on that rule; hover is explained in plain words (it means hover); the press
// no longer borrows the loading spiral (it looked like a loading animation).

/* ----------------------------------------------------------- the parts */

/** A package button with its label span, so the register's baseline (scope-12) draws under its words. */
const button = (label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span></button>`;

/** Words that take the baseline when their part is hovered, focused or pressed (G8, G14). */
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

/**
 * The skeleton text, the anchor's hero (research/grotesk-anchor): a heading
 * bar and five lines, each on a row of its own, drawn in ink; the red plate is
 * the same block's `drop-shadow`. It is also a waiting part (`.gk-wait`), so
 * the loading questions can draw their own picture on it.
 */
const skText = () =>
    `<span class="gk-wait gk-wait--text" aria-hidden="true"><span class="gk-sktext">${'<i></i>'.repeat(6)}</span><span class="gk-run"></span><span class="gk-flap"></span></span>`;

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
        `<div class="gk-printed gk-printed--dialog"><div class="kp-dialog gk-dialog gk-float gk-opens gk-arrives" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title gk-title">Change the platform?</p>
        <p class="kp-dialog__description">The 07:32 to Basel moves to platform 9.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Move it', 'kp-button--sm kp-button--primary')}</div>
    </div>${BAND}</div>`,
    menu: () => `<div class="gk-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="gk-pop-wrap"><div class="gk-printed"><div class="kp-popover gk-pop gk-float gk-opens gk-arrives"><ul class="kp-menu" role="menu">
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
    alert: (text = 'The 07:32 is back on time.', cls = '') =>
        `<div class="kp-alert gk-alert ${cls}" role="status"><span class="kp-alert__body">${text}</span></div>`,
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
        'Contact: the face answers a press',
        `<div class="gk-row">${button('Export the timetable', 'gk-press')}</div><p class="gk-readout" data-gk-readout="contact"></p>`,
    ) +
    cell('A fall: a tile arrives', PART.tile() + '<p class="gk-readout" data-gk-readout="fall"></p>') +
    cell('A fall: a menu opens', PART.menu() + '<p class="gk-readout" data-gk-readout="open"></p>') +
    cell('A loop: a tile waits', `${waitingTile()}<p class="gk-readout" data-gk-readout="loop"></p>`);

const COLOUR = () =>
    cell('Buttons and a state', `<div class="gk-row">${button('Export')}${button('Depart', 'kp-button--primary')}${PART.state('Running')}</div>`) +
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
    cell('Skeleton text (the anchor)', skText(), 'gk-part--wide') +
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
    cell('Skeleton text (the anchor)', skText(), 'gk-part--wide') +
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

/**
 * One spinner; options.css draws the option's. The plate holds the two
 * plates (its ::before is the red one, its ::after the ink) and two spare
 * marks some options use; the quarter is the signature's own.
 */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="gk-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--gk-spin: ${size}"` : ''
    }><span class="gk-spin__plate"><i></i><i></i></span><span class="kp-spinner gk-spin__quarter"></span></span>`;

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

/**
 * The busy bar: two plates of one print. The red plate is `.gk-bar__red`, the
 * ink `.gk-bar__ink`; twelve spare blocks (`b`) and a frame (`.gk-bar__frame`)
 * serve the options that print in sections. Every shape is a bold solid: no
 * hairline, no stroke under 3 px (Kenny, update 2: "I especially don't like
 * the fine lines of it").
 */
const bar = () =>
    `<span class="gk-bar" role="progressbar" aria-label="Timetable busy" aria-busy="true"><i class="gk-bar__red"></i><i class="gk-bar__ink"></i><i class="gk-bar__frame"></i>${'<b></b>'.repeat(12)}</span>`;

/** The busy progress bar, the skeleton text (its hero) and a key figure's proof. */
const BARS = () =>
    cell('The busy progress bar', bar(), 'gk-part--wide') +
    cell('Skeleton text (the hero)', skText()) +
    cell(
        'A key figure, its skeleton',
        `<div class="kp-kpis"><div class="kp-kpi gk-plate gk-kpi gk-waits" aria-busy="true"><span class="kp-kpi__label gk-label">Trains today</span>${wait(
            'figure',
        )}</div></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="gk-printed gk-leaver">${html}${BAND}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert(undefined, 'gk-arrives'))) +
    cell('A card', leaver(PART.tile('Basel SBB', '07:32 · platform 7', 'gk-leaves gk-arrives'))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpi gk-plate gk-kpi gk-leaves gk-arrives"><span class="kp-kpi__label gk-label">Trains today</span><span class="kp-kpi__value gk-figure">412</span></div>`,
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
    cell('Button, hovered', `<div class="gk-row">${button('Export the timetable', 'gk-pointed')}${button('Depart', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first hovered', PART.menuStatic(['Open the timetable', 'Assign a platform…', 'Rename'])) +
    cell(
        'Tile with its Open link hovered',
        `<div class="kp-card gk-plate gk-tile gk-tile--pointed"><p class="kp-card__title gk-title">Basel SBB</p><p class="kp-card__body">07:32 · platform 7</p><a class="kp-button kp-button--ghost kp-button--sm gk-tile-link gk-pointed" href="#gk-intro"><span class="kp-button__label">Open</span></a></div>`,
    ) +
    cell(
        'Key figures, the first hovered',
        `<div class="kp-kpis gk-kpi-row"><a class="kp-kpi gk-plate gk-kpi gk-pointed" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Trains',
        )}</span><span class="kp-kpi__value gk-figure">412</span></a><a class="kp-kpi gk-plate gk-kpi" href="#gk-intro"><span class="kp-kpi__label gk-label">${words(
            'Late',
        )}</span><span class="kp-kpi__value gk-figure">4</span></a></div>`,
    ) +
    cell(
        'Days of a month, one hovered',
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
        question: 'How does grotesk move: on time, in hard hops, or eased in and out?',
        why: 'Your anchor, Out of register (approved 07/10/2026 21:23): a second, red plate falls into register on the black one. It travels a closing spiral at an even angular pace, falls into register in the seventh of eight units, dwells and is released the way it came. Every motion below is that plate. The register’s own curve is cubic-bezier(0.2, 0, 0, 1), which is formal’s, light’s, nostromo’s and brutalism’s; the plate has none: it keeps an even pace, stops dead in register and dwells, the way the Swiss station clock’s hand stops at the top before it goes on.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'ontime',
                name: 'On time: an even pace, a dead stop, the dwell (the plate’s own)',
                see: 'Every arrival is a part in black with its red plate falling into register on it: the week day by day, the menu, the tile; the value’s plate falls back in; the waiting part falls, dwells and is released. The plate travels at an even pace round the closing spiral and stops dead in register.',
                verdict: rec(
                    'it is the anchor moving exactly as you approved it, a timetable you can see: the trains run on time and stop at the station, and the dwell is no other theme’s (titanium’s feed never stops, cyberpunk’s copies jitter home).',
                ),
            },
            {
                key: 'cut',
                name: 'Hard hops (terminal’s, nostromo’s, cyberpunk’s way)',
                see: 'The red plate jumps from one of the eight points of the spiral to the next, each held, and lands in register at the last.',
                verdict: not('it is crisp, but jumping between held poses is how three other themes move, and the spiral turns into a ring of dots.'),
            },
            {
                key: 'eased',
                name: 'Eased in and out (near synthwave’s sunrise)',
                see: 'The plate takes the same eight points, slow at the start, quick in the middle and slow into register, cubic-bezier(0.7, 0, 0.3, 1), as your Set in type picks and the leave do today.',
                verdict: not(
                    'it is smooth, but a slow start and a soft landing is synthwave’s sunrise curve, and a plate that settles softly does not stop dead in register.',
                ),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Where does an arriving part come from?',
        why: 'Your arrivals all come from the start: the calendar’s On the grid, the columns’ Slid in and the tiles’ Set in type move the part itself along its line; the menu’s, the header’s and the trend’s Set in type cut it in place from the start, which is exactly how titanium’s arrivals work. Round 1 recommended setting a part along its line. The anchor changes the question: in a print nothing slides in; a part is printed in black and its second, red plate falls into register on it.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'plate',
                name: 'From where it slipped: its red plate falls into register on it',
                see: 'Each day, departure, tile and column is printed in black; behind it its red plate, slipped a few pixels, travels the closing spiral and falls into register in 8 units, then stands. One part after another in reading order, half a unit apart. Nothing slides in and nothing is clipped.',
                verdict: rec(
                    'it is the anchor itself on every part, so arriving, waiting and leaving are one picture, and no other theme brings a part in as a second plate.',
                ),
            },
            {
                key: 'line',
                name: 'Set along its line: it slides out from behind its own start edge (round 1’s recommendation)',
                see: 'Each day, departure, tile and column slides in along its own line from the start and stops flush on its column; it appears from behind its own start edge, so nothing pokes out before its slot. One after another, in reading order.',
                verdict: not(
                    'it is type being set in the composing stick and was the recommendation before the anchor, but it is a second idea beside the plate, and nothing else on the page moves along a line.',
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
        why: 'Your menu and your header’s menu are Set in type: cut in place from the start (their text says “drawn in from the top”). The signature’s dialog, toast and tooltip are cut in from the start too. Your leave is three colour bands, red, ink and paper (2026-10-04), and since 2026-10-05 an opening is the leave played backwards. The anchor opens a panel another way: it is printed in black and its red plate falls into register on it.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'plate',
                name: 'Printed, its red plate falling into register (the anchor)',
                see: 'The panel and its 3 px frame appear in black; its red plate, 8 px off, travels the closing spiral round the frame and falls into register in 8 units (960 ms), and the panel stands. Closing, the same fall played backwards and the panel is gone.',
                verdict: rec(
                    'it is the anchor opening a panel, the same picture as an arrival, a wait and a leave, and no other theme opens with a second plate.',
                ),
            },
            {
                key: 'bands',
                name: 'Printed by the colour bands (your leave, backwards)',
                see: 'Three flat bands, paper, ink and red, sweep across the panel’s place from the start at an even pace and leave it printed behind them: 4 units (480 ms). Closing, they sweep back toward the start and take it off.',
                verdict: not(
                    'it is your decided leave played backwards and was the recommendation before the anchor, but it is a second picture beside the plate, and flat colour sweeping across reads as a wipe, not as a print in two plates.',
                ),
            },
            {
                key: 'cut',
                name: 'Cut in from the start, as picked (near titanium’s feed)',
                see: 'The panel is uncovered from its start edge to its end, 260 ms, as your menu’s Set in type and the signature’s dialog do.',
                verdict: not('it is your pick, but a cut from the start is titanium’s arrival, and it is not the picture of the anchor.'),
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
        question: 'How long do contact, a fall and a loop take?',
        why: 'The anchor has its own clock, counted in units of the register’s 120 ms: a gap of 2, the red plate falls in 8 (960 ms), dwells 4 and is released in 8, 22 units (2640 ms) in all, the graph’s Out of register period within 2 %. Contact, the face answering a press, is 1 unit, the register’s --fx-duration. Your picks take 150 to 1200 ms for a one-shot and 0.6 to 2.6 s for a loop, with no unit under them.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: '120 · 960 · 2640 (units of 120 ms)',
                see: 'Contact 1 unit (120 ms), a fall 8 units (960 ms), for a tile or a menu, a loop 22 units (2640 ms): 2 of gap, the fall of 8, the dwell of 4, the release of 8. The readouts under each part say the numbers.',
                verdict: rec(
                    'every duration is the register’s own 120 ms counted, and the fall and the loop are the anchor’s clock exactly (the dwell is what a station clock’s hand does at the top).',
                ),
            },
            {
                key: 'picks',
                name: 'As the picks, the slowest of each kind',
                see: 'Contact 150 ms (the nav link), a fall 1200 ms (the chart’s even pace), a loop 2600 ms (the graph).',
                verdict: not('it is your picks, but 1.2 s for a fall is a slow train, and nothing ties one number to another.'),
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
                see: 'Every word, rule and line is black; the red marks one thing: the second plate (what waits, arrives, is hovered over or has just changed, shown in the motion questions), today, the primary action, the pick’s line; the meter’s share; the statuses only as a tone (the change). The plates are white.',
                verdict: rec(
                    'the red keeps saying “this one”, as on a Swiss poster, it is the anchor’s second plate (seen where something is off, behind the black when it is in register), and black and white carry everything else.',
                ),
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
        why: 'Your live picks: the key figure’s Flipped (a jump up in two hard steps; its text promises a departure-board flap), the tiles’ Flipped (a jump up in hard steps; it never played until 2026-10-07, when the arrival’s rule outranked it), the columns’ Inverted (high-contrast’s The bar flips), the state’s A flat swap (a swell to 1.4×) and at once for the trend and the chart (formal’s Redrawn). Your graph’s live update is The train passes: a train runs along the changed line. The anchor says it another way for a value: what has just changed is not yet in register.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'plate',
                name: 'Re-registered: the value’s red plate slips and falls back in (the anchor)',
                see: 'The new value is written in black at once and nothing moves; behind it a red copy of the value starts a few pixels off and falls into register along the closing spiral in 8 units. A line, a mark or a tile is re-registered the same way.',
                verdict: rec(
                    'it is the anchor on a value: what is true stands in register, what has just changed is not yet, and it is the same picture as arriving and waiting.',
                ),
            },
            {
                key: 'train',
                name: 'The train passes (your graph’s, carried to every value)',
                see: 'The new value is written at once; a short red train runs along its baseline from the start to the end at an even pace and leaves, 4 units (480 ms). A line, a mark or a tile is passed along its foot.',
                verdict: not(
                    'it is your graph’s own live update and decided there, but it runs along the baseline, which is the baseline’s idea and not the anchor’s (the graph stays as decided).',
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
        why: 'Out of register is the anchor (approved 07/10/2026 21:23), and the skeleton text is its hero: a heading bar and five lines in black, and under them the same text in red, slipped. The red plate no longer circles at a constant distance: it travels a closing spiral, falls into register in the seventh of eight units, dwells and is released the way it came. No crosshairs, no marks, no rings. You asked for every loading element to be shown from it. Your other loading picks: eight lines running along the part (the columns, the trend, the calendar’s ticker, the menu’s ruling pen, the chart’s grid build, the meter’s Express, the signature skeleton and busy bar), the tiles’ flap, and the busy table’s Poster shifts, which does not move at all.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'register',
                name: 'Out of register: the reading’s place printed as a proof in two plates',
                see: 'Skeleton text, and where every value will stand, is a proof in heavy ink; under it the same proof in red slips off, travels the closing spiral, falls into register (the red disappears behind the black), dwells for 4 units and is released: 2640 ms. The labels stay readable above it.',
                verdict: rec(
                    'it is your anchor on every waiting part, it is print, which is where the Swiss style was made, and no theme loads in two plates.',
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
        question: 'While a part waits, how does the red plate turn against the black?',
        why: 'You said: “I like a closing spiral, but I feel like I only like it going clockwise. So I know there’s a rule of opposites, but maybe we can break that for this theme. Make the clockwise spiral loop, give a couple of variations on this so I can decide.” So the rule that a close is its open played backwards is broken here, on purpose: in the first five options the red plate turns clockwise all the time, on its way in and on its way out, and never turns back. The last option is the spiral you approved, whose way out is the way in played backwards (counter-clockwise), kept to compare. Every option runs the anchor’s 22 units (2640 ms), so they compare directly; only the path changes.',
        kind: 'loop',
        scene: SLIP,
        options: [
            {
                key: 'cw',
                name: 'Clockwise in, clockwise out: one turn each way (the loop you asked for)',
                see: 'The red plate starts 6 px off and turns one full turn clockwise while it closes in at an even pace, falls into register (the red disappears behind the black) and dwells for 5 units; then it turns one more full turn clockwise while it opens out again, and the loop starts over: 2640 ms. It never turns back.',
                verdict: rec(
                    'it is exactly what you asked for: the anchor’s closing spiral looping clockwise, the way out clockwise too, so the plate keeps turning one way for ever, and the dwell in register is the station clock’s stop.',
                ),
            },
            {
                key: 'twice',
                name: 'Two tighter turns each way',
                see: 'The same path with two turns clockwise on the way in (9 units) and two on the way out (9 units), and a shorter dwell of 3 units. The plate turns twice as fast and winds up tighter.',
                verdict: not('it winds up more and reads as busier work, but at 6 px the second turn is hard to follow, and the dwell is shorter.'),
            },
            {
                key: 'sling',
                name: 'Wound in slowly, slung out in one quick turn',
                see: 'Two slow turns clockwise on the way in (12 units), a dwell of 5 units, then one quick turn clockwise on the way out (3 units): wound up like a spring and let go.',
                verdict: not('it is the liveliest of the set, but the quick exit is the one part of the loop that is not at an even pace.'),
            },
            {
                key: 'sweep',
                name: 'One sweep: half a turn in, half a turn out',
                see: 'The plate swings clockwise through half a turn while it closes in (8 units), dwells for 4 units, and swings clockwise through the other half on the way out: a slow S, the calmest of the set.',
                verdict: not('it is calm and easy to follow, but half a turn is not a spiral any more, and it reads as a swing.'),
            },
            {
                key: 'drop',
                name: 'Unwinds clockwise, then drops straight back in',
                see: 'The plate waits in register (6 units), unwinds one and a half turns clockwise to its far point (10 units), then drops straight back in along a line (2 units) and dwells again.',
                verdict: not(
                    'the way out is clockwise and the way back is a straight drop, so it turns only half the time, and a line back is a second idea.',
                ),
            },
            {
                key: 'reversed',
                name: 'The closing spiral with its way out played backwards (as approved)',
                see: 'Clockwise on the way in, counter-clockwise on the way out: the release is the fall played backwards, the rule of opposites kept, as the anchor draws it.',
                verdict: not('it keeps the rule, but the plate turns clockwise and then back again, and you said you only like it going clockwise.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'Loading: the spinner',
        rule: 'G11',
        question: 'What is grotesk’s spinner?',
        why: 'You said: “I like the plate, but I feel like we can do even better.” The plate stays as the reference (sixth). The five new candidates before it are each a print of two plates, an ink shape and a red one, and each turns clockwise only, like the loading plate in the question before. None borrows another theme’s spinner (titanium’s facing cut, nostromo’s reel, forest’s tree, cyberpunk’s reticle, synthwave’s setting sun, solstice’s arc, brutalism’s tipped block, blueprint’s compass). The signature’s quarter, as approved, is last. Shown at three sizes, in a busy button and in the busy panel.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'turn',
                name: 'The twin turns: a red square turns clockwise behind the ink square',
                see: 'An ink square outline, and behind it its red twin turning clockwise at an even pace. The twin is in register every quarter turn (a square looks the same every 90 degrees) and rests there for 3 units, so the spinner never stops and never turns back: a quarter turn in 8 units, 2640 ms for half a turn.',
                verdict: rec(
                    'it really spins, so it reads as a spinner at a glance even at 16 px; the corners of the red twin stick out past the ink and are swallowed again, which is the plate falling in and out of register; it turns clockwise only, and it is a bold shape with no hairline.',
                ),
            },
            {
                key: 'pie',
                name: 'Two plates take turns: red fills the square clockwise, then the ink covers it',
                see: 'A solid ink square. A red plate is printed over it as a wedge that grows clockwise from twelve o’clock until the whole square is red; then the ink is printed back over the red the same way, clockwise, until the square is black again: 2640 ms.',
                verdict: not(
                    'it is the boldest of the set and shows progress at a glance like a timer; but it is the only one where the plates never register, because one plate always covers the other.',
                ),
            },
            {
                key: 'clock',
                name: 'The station clock: a red hand turns clockwise in the ink square and stops at twelve',
                see: 'An ink square outline, and a red hand that sweeps clockwise at an even pace and stops dead at twelve o’clock for 2 units before it goes on, the way the Swiss station clock’s second hand does: 2640 ms a turn.',
                verdict: not(
                    'it is the most grotesk of the set, the timetable itself, but the hand is a second shape rather than a second plate of the same print, and it turns slowly.',
                ),
            },
            {
                key: 'orbit',
                name: 'A red square orbits the ink core, then registers',
                see: 'A solid ink square, and a red square of the same size going round it clockwise 7 px away at an even pace; it snaps in under the ink, dwells for 3 units and slips out again, clockwise: 2640 ms.',
                verdict: not(
                    'it is easy to read and it is your graph’s own movement, but the orbit alone is the circling every spinner has; the registering is what makes it grotesk.',
                ),
            },
            {
                key: 'corners',
                name: 'The red twin slips to each corner in turn, clockwise',
                see: 'An ink square outline and its red twin, which sits 3 px off at the top left, jumps to the top right, then the bottom right, then the bottom left, a stop of 4 units at each, then falls into register and rests for 6 units: clockwise, in counted stops.',
                verdict: not(
                    'it is counted like a timetable and has its own rhythm, but jumping between held poses is how three other themes move, and it is the quietest of the set.',
                ),
            },
            {
                key: 'plate',
                name: 'The plate, as before: an ink square and its red twin falling into register',
                see: 'A 2 px ink square outline; its red twin travels the clockwise loop (one turn in, a dwell, one turn out), 2640 ms, on the same clock as every waiting part. The reference you liked.',
                verdict: not(
                    'it is the reference: it fits the anchor exactly, but it is the quietest to look at, and the second plate is mostly hidden.',
                ),
            },
            {
                key: 'quarter',
                name: 'The signature’s quarter, as approved',
                see: 'A red quarter disc stepping round an ink square, each quarter turn held, 1600 ms.',
                verdict: not('it is your signature and it already dwells at each quarter, but it is a second loading picture beside the plate.'),
            },
        ],
    },
    {
        id: 'bars',
        label: 'Loading: the busy bar and the skeleton',
        rule: 'G11',
        question: 'How does the busy progress bar wait, with the skeleton text as its hero?',
        why: 'You said: “I like printed out of register, but the progress bar itself should be better. I especially don’t like the fine lines of it. But I want ten variations.” Ten bars, each printed out of register in a different way. Every shape is a bold solid: nothing is thinner than 3 px, there are no hairlines and no twelve-column ticks. All run the anchor’s 22 units (2640 ms). Under each bar the skeleton text (the hero, its red plate turning clockwise like the loading plate) and a key figure’s proof stand unchanged, so the bar is the only thing that differs.',
        kind: 'loop',
        scene: BARS,
        options: [
            {
                key: 'slab',
                name: 'The slab: one heavy ink bar, its red plate turning clockwise behind it',
                see: 'A solid ink bar, 16 px high, the full width. Behind it a red bar of the same size turns clockwise 6 px away, closes in, falls into register and dwells, then opens out again clockwise: 2640 ms. Only the red fringe shows until the plates register.',
                verdict: rec(
                    'it is the anchor, scaled to a bar: the same plate on the same clock as the skeleton text above it, nothing thin in it, and it reads as a progress bar at a glance.',
                ),
            },
            {
                key: 'blocks',
                name: 'Twelve blocks register one after another',
                see: 'Twelve solid ink blocks with 4 px gaps, each with its own red twin 4 px away turning clockwise; the twins run a twelfth of a loop apart, so a wave of registration passes along the bar like sheets through the press.',
                verdict: not(
                    'it shows the registering best, one block at a time, but twelve small plates are busier than one, and it is the closest to the signature’s columns.',
                ),
            },
            {
                key: 'frame',
                name: 'The frame slips round the red',
                see: 'A 4 px ink frame round a solid red bar. Here the frame is the plate that slips: it turns clockwise round the red, so the red bleeds out of one side and the paper shows on the other, until the frame registers and holds it.',
                verdict: not(
                    'it is the only one where the bar is red when it is true, which is bold, but red as the main colour of a bar breaks “black builds, red signals once”.',
                ),
            },
            {
                key: 'stamps',
                name: 'Three sections are stamped in, one after another',
                see: 'The bar is three solid ink sections. Each has its red twin 8 px above it; one after another, left to right, the twins drop straight in and register; they dwell, and lift out again in the same order.',
                verdict: not(
                    'it is a stamp press at work and very readable, but the plates move straight up and down, and that is a stomping, not the clockwise turning of the rest.',
                ),
            },
            {
                key: 'sheets',
                name: 'Three sheets through the press',
                see: 'Three solid 8 px bars stacked with 4 px between them, each with its red twin turning clockwise; the sheets run 2 units apart, so the misregistration moves down the stack.',
                verdict: not(
                    'it is the print shop in one picture, but a stack of three bars is a taller part than a progress bar is, and the bars are thin next to the slab.',
                ),
            },
            {
                key: 'halves',
                name: 'The plate prints in two halves that close in from opposite corners',
                see: 'The ink bar and its red plate in two halves: the left half slips up and to the left, the right half down and to the right; the halves come in together and register, dwell, then split again.',
                verdict: not(
                    'it is clear and symmetrical, but the halves slide in straight lines, and a plate that is split is not the plate of the other loading pictures.',
                ),
            },
            {
                key: 'bleed',
                name: 'The bleed is trimmed',
                see: 'The red plate is taller than the ink: it bleeds 6 px above and below. It is trimmed down to the ink’s height at an even pace, registers, dwells and bleeds again.',
                verdict: not(
                    'it is the mechanism of a print trimmed to size, easy to read, but it only moves up and down, and the red stays visible as a stripe above and below for half the loop.',
                ),
            },
            {
                key: 'stretch',
                name: 'The red sheet is stretched',
                see: 'The red plate is 14 % too long: a red tab sticks out past the end of the ink. The stretch comes out at an even pace until the plates register; they dwell, then the red sheet stretches again.',
                verdict: not(
                    'it is a real printing fault and the simplest to read, but it is one red tab at the end, and it moves along the line, which is the runner the other themes use.',
                ),
            },
            {
                key: 'jog',
                name: 'Jogged up a line at a time',
                see: 'The red plate is one line (9 px) low. It jogs up in three counted stops of 3 px to register, dwells, and jogs back down in three stops.',
                verdict: not(
                    'it is counted like a timetable, but a jump between held poses is how three other themes move, and it is the stillest of the ten.',
                ),
            },
            {
                key: 'catch',
                name: 'The ink catches up with the red',
                see: 'A 4 px ink frame with a red fill that grows in six counted steps. The ink fill follows half a step behind, so the red leads by a block until the ink catches up and the plates register for 2 units. Then it starts again.',
                verdict: not(
                    'it looks most like a progress bar and has the clearest start and end, but it is a fill that grows along the line, and it is a determinate bar in disguise.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does something leave, with the red plate turning clockwise?',
        why: 'You said: “Definitely a variation on option 1. But as I said in the other step, I feel like I mostly like it going clockwise. So come up with ten variations, base them on the other step so they can be in line.” A part still arrives the way the anchor has it: black, with its red plate closing in clockwise. But it no longer leaves as that played backwards: it leaves with the plate turning clockwise too (opening out), so the plate keeps one direction through a part’s whole life, as in the loading step. The rule of opposites is broken here, on purpose. Ten ways to leave; the first is the plain one.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'cw',
                name: 'Opens out clockwise, then it is gone',
                see: 'The part stands in black. Its red plate leaves register and turns one full turn clockwise while it opens out to 8 px (8 units, 960 ms), and the part is gone at the end of the turn. Arriving was the fall closing in clockwise, so the plate has turned the same way the whole time.',
                verdict: rec(
                    'it is the arrival’s own spiral carried on in the same direction: in, stay, out, one picture and one way of turning, and it is the same path as the loading step’s recommended loop.',
                ),
            },
            {
                key: 'hand',
                name: 'The station clock’s hand sweeps round and takes it off',
                see: 'A red hand, 4 px wide, sweeps clockwise from twelve o’clock round the part at an even pace and erases the part behind it until it is gone: 960 ms.',
                verdict: not(
                    'it is the most readable clockwise leave and the station clock’s own picture, but the hand is not the red plate of the arrival, so it is a second idea.',
                ),
            },
            {
                key: 'quarters',
                name: 'Taken off a quarter at a time, clockwise',
                see: 'The plate opens out clockwise as in option 1, and the part is taken off in four counted quarters, clockwise from twelve o’clock, one every 2 units, like the quarter hours of the station clock.',
                verdict: not(
                    'it is counted, which the timetable likes, but the quarters of a wide card are slabs, and hard steps are the way three other themes move.',
                ),
            },
            {
                key: 'twice',
                name: 'Two quick turns out',
                see: 'The plate turns clockwise twice while it opens out, 8 units: twice as fast as the plain leave, and the part is gone at the end.',
                verdict: not('it is brisk and shows the direction twice, but the second turn is too fast to follow at this size.'),
            },
            {
                key: 'sling',
                name: 'Held, then slung out in a quick half turn',
                see: 'The plate stays in register for 5 units, then is slung out clockwise through half a turn in 3 units, and the part goes with it.',
                verdict: not('it is the sharpest exit, a spring let go, but the long hold makes the part look as if nothing happens first.'),
            },
            {
                key: 'sweep',
                name: 'One sweep: half a turn out',
                see: 'The plate swings clockwise through half a turn while it opens out, 8 units, to the far side of the part, and the part is gone there.',
                verdict: not('it is calm, one clear arc, but half a turn is a swing and not the spiral of the arrival.'),
            },
            {
                key: 'slur',
                name: 'Slurred out: the red plate leaves a smear behind it',
                see: 'The plate opens out clockwise as in option 1, and two more red copies follow it round, 20 and 40 degrees behind, like a slurred print: 8 units.',
                verdict: not(
                    'it makes the clockwise direction obvious, the smear points back along the way, but two extra copies is a busier picture, and a smear is a fault.',
                ),
            },
            {
                key: 'rows',
                name: 'Line by line, each line’s plate turning once',
                see: 'The part’s lines leave one after another, top first, a unit apart: each line’s red plate opens out clockwise by itself, and the plate at the top of the part goes last.',
                verdict: not('it clears the part like a timetable board, but it is several plates at once, and the lines are small.'),
            },
            {
                key: 'wide',
                name: 'A wide turn out',
                see: 'The plate opens out clockwise in one and a half turns to 12 px, twice as far as the plain leave, and the part is gone at the end.',
                verdict: not(
                    'it is the biggest gesture, easy to see, but it reaches the part next to it, and a leave should stay inside its own part.',
                ),
            },
            {
                key: 'stops',
                name: 'Calls at three stations on the way out',
                see: 'The plate opens out clockwise in three legs of a third of a turn, with a dead stop of one unit between the legs, like a train at three stations; the part is gone at the end.',
                verdict: not(
                    'it is the stop-to-go of the station clock, but it takes longer to say goodbye, and it is several movements for one leave.',
                ),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'How do buttons, links and menu entries behave when they sit inside a header, a menu, a tile, a drawer or a key figure?',
        why: 'Use the State buttons above to see them on hover, focused and pressed (a held state plays the plate’s fall on a loop). Today the header’s actions have a 1 px line, a red bar at the foot on hover and one red outline for focus; the menu entries grow a red top border; the tile’s Open link takes one red outline; the key figure as a link turns red with a tint.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly grotesk’s own elements',
                see: 'Every inner button is grotesk’s button: the 2 px ink line, its red plate falling into register on hover, the two-channel ring on focus, the grey face with the black label when pressed; a menu entry and the key figure as a link the same.',
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
                see: 'Inside a composite every button is its words alone (no line) until you hover over it, when its line and its red plate appear.',
                verdict: not('it is calmer, but a composite’s actions stop looking like buttons until you hover over them.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Hover: what happens when the mouse is over something',
        rule: 'G8',
        question: 'What does a button, a row or a tile do while you hover over it (the mouse pointer rests on it, before any click)?',
        why: 'Yes, this question is about hover: what a part does while the mouse pointer is on it, before you click. (Keyboard focus is a different question, the next one.) The review dialog plays it for you: it moves the pointer onto the part and away again, over and over, so each option shows its hover and what happens when the hover ends. Your scope-12 (2026-09-12): hovering over a control draws the red baseline its words stand on, from the start; the register adds a light wash. Your component picks draw a red bar at the foot (the header), a red top border that pushes the entry 2 px (the menu), a top bar growing from 6 to 10 px that pushes the tile’s content (the tiles), a red line with a tint (the key figure) and an underline (a day). The anchor answers another way: hovering over a part takes it into register.',
        kind: 'cycle',
        scene: HOVER,
        options: [
            {
                key: 'plate',
                name: 'Hover: the red plate falls into register on the part (the anchor)',
                see: 'When you hover over a part, its red plate, slipped a few pixels, travels the closing spiral and falls into register on it in 8 units; it stays there for as long as you hover, and when you move the pointer away it is released the way it came. The first frame already shows red, so the answer is immediate, and nothing beside the part moves. With reduced motion the part takes the light wash instead.',
                verdict: rec(
                    'it is the anchor on a hover, the same plate as loading and arriving; and a plate that falls in is neither brutalism’s still hard shadow nor cyberpunk’s jitter.',
                ),
            },
            {
                key: 'baseline',
                name: 'Hover: the red baseline is drawn under the words (your scope-12)',
                see: 'When you hover over a part, a red rule is drawn from the start of the line the words stand on, and the part takes the light wash; a coloured button inverts. Nothing moves, and the parts beside it are untouched.',
                verdict: not(
                    'it is your approved baseline, drawn on every button and link today, and it was the recommendation before the anchor, but it is the type’s idea and not the anchor’s; keep it and the plate belongs to loading, arriving and leaving only.',
                ),
            },
            {
                key: 'bar',
                name: 'Hover: a red bar on the edge thickens (your header’s, menu’s and tiles’ picks)',
                see: 'When you hover over a part, a red bar appears or thickens on its edge: the tile’s top bar grows and pushes its words down, a menu entry grows a top border.',
                verdict: not('it is your picks, but a growing border moves what is beside it, and a lit edge is solstice’s hover.'),
            },
            {
                key: 'invert',
                name: 'Hover: the part turns black with white words (high-contrast’s The bar flips)',
                see: 'When you hover over a part, it turns to the ink plate with white words; nothing moves.',
                verdict: not('it is strong, but the flip to ink is high-contrast’s hover family, and a whole tile turning black is loud.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'How does a part show it has keyboard focus?',
        why: 'The register gives a button one 2 px ink ring with the page’s white outside it, and a coloured button three layers (DI2: two channels). Three of your picks use one outline instead: red on the header’s action and the tile’s link, a thin ink line 3 px out on the key figure. The anchor adds the plate: focus is the ring, plus the same fall as on hover.',
        kind: 'cycle',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, and the plate falling in (the anchor)',
                see: 'Every focused part: a white ring tight round it and the ink outline outside that, and its red plate falls into register on it as on hover, 8 units, dwelling for as long as the focus stays.',
                verdict: rec(
                    'the ring is the design invariant and reads on white, on the red primary and on the ink alike, and the plate says where you are in the same picture as hover, so hover and focus belong together.',
                ),
            },
            {
                key: 'baseline',
                name: 'The two-channel ring, and the baseline drawn (round 1’s recommendation)',
                see: 'Every focused part: a white ring tight round it and the ink outline outside that, and the red baseline under its words as on hover.',
                verdict: not(
                    'it was the recommendation before the anchor and the ring is right, but the baseline is the type’s idea, and focus would answer in a picture the rest of the theme does not use.',
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
        question: 'What happens to a button, a row or a day while you press it (the mouse button is down)?',
        why: 'You said: “I need better options, and why is the loading animation running?” The loading animation was the plate’s closing spiral: the old first option used the very same fall as loading, so a press looked like something waiting. It is gone: no option here turns or spirals, and nothing in the scene loads; only the press plays. Each scene rests, the press lands, the part is held down, and the release follows. Five new presses, each a different thing the print does when it lands; your scope-12 rule is last, to compare. In all of them the part never moves, and a coloured button presses grey with a black label (2026-09-14).',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'slam',
                name: 'Slammed home: the red plate is driven into register in one stroke',
                see: 'On the press, a red copy of the part starts 8 px off, to the lower right, and is driven straight into register in 2 units (240 ms) at an even pace, a dead stop. As it lands, the face turns grey and the label black. On the release the plate is pulled straight back out and gone. No turning, no spiral.',
                verdict: rec(
                    'the anchor’s second plate lands as the press lands, you see it arrive and you see it stop, “held” means in register, and it is a straight stroke, so it cannot be mistaken for the loading plate.',
                ),
            },
            {
                key: 'beats',
                name: 'Two beats: the second plate lands, the ink a beat later',
                see: 'On the press the red second plate is driven in from 8 px off and registers over 2 units; one beat (120 ms) later the ink lands: the face turns grey and the label black. On the release they go in the reverse order: the face lets go first, then the red plate leaves.',
                verdict: not(
                    'it shows both plates landing one after the other, which is the print press exactly, but it takes a beat longer to feel held than the slam, and the face answers late.',
                ),
            },
            {
                key: 'jog',
                name: 'Jogged home in three counted stops',
                see: 'On the press the red copy starts 9 px off and jogs home in three hard stops of a unit each (6, 3, 0 px), a dead stop at each; as it lands the face turns grey and the label black. Nothing travels between the stops.',
                verdict: not(
                    'it is counted like a timetable and the three stops are easy to see, but jumping between held poses is how three other themes move.',
                ),
            },
            {
                key: 'squash',
                name: 'Ink squash: the label gets heavier and a keyline closes in',
                see: 'As in letterpress, the press squeezes the ink out: the label gets heavier and a 3 px ink keyline closes in inside the frame while the face turns grey. No red, nothing moves.',
                verdict: not(
                    'it is the honest look of a pressed print and needs no second plate, but without the red it leaves the anchor, and the heavier label is a small change.',
                ),
            },
            {
                key: 'overprint',
                name: 'Overprinted: the second plate prints over the black and deepens it',
                see: 'On the press the frame and the label turn the deep red of the second plate printed over the black, and the face goes grey. At once, nothing moves; on the release the black is back.',
                verdict: not(
                    'it is the quietest of the five and uses only the two plates, but its deep red label on the grey face reads 4.28:1, below WCAG 2.2 AA’s 4.5:1 (the black label of the others reads 11.31:1), and red marking a pressed part says “current”, not “held”.',
                ),
            },
            {
                key: 'rule',
                name: 'The rule thickens (your scope-12)',
                see: 'The baseline under the words thickens to 4 px in the deeper red, the face turns the darker grey, at once, for as long as it is held; the primary presses grey with a black label. Nothing moves.',
                verdict: not(
                    'it is your approved press and it says “held” on the very line a hover draws, but if hovering is the plate, a press that draws the baseline is a second idea.',
                ),
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
                // The option's key, so an approved pick in update.json names it.
                value: o.key,
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${a.question} ${o.see} ${o.verdict}`,
            })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'grotesk');
lookLine.textContent = `${ASPECTS.length} questions, one rule of grotesk each (9 to 12 the loading demo from the graph’s Out of register; every motion question is re-derived from the anchor, Out of register, approved 07/10/2026 21:23); the first option of every question is the recommendation. Pick the one that is grotesk to you, or “None of these” with a note.`;
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

// The durations row says its own numbers under each part (units of 120 ms).
const BANDS = { units: [120, 960, 960, 2640], picks: [150, 1200, 1200, 2600], instant: [0, 0, 0, 0] };
for (const scene of section.querySelectorAll('[data-gk-durations]')) {
    const key = /** @type {keyof typeof BANDS} */ (scene.getAttribute('data-gk-durations'));
    const [contact, fall, open, loop] = BANDS[key];
    const units = (/** @type {number} */ ms, /** @type {string} */ more = '') =>
        key === 'units' ? `, ${ms / 120} ${ms === 120 ? 'unit' : 'units'}${more}` : '';
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-gk-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms${units(contact)}`);
    say('fall', `${fall} ms${units(fall)}`);
    say('open', `${open} ms${units(open)}`);
    say('loop', loop ? `${loop} ms a cycle${units(loop, ', 4 of them the dwell')}` : 'standing still, out of register');
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
    ['out', 1100],
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
