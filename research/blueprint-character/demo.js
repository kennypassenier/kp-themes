// What makes blueprint blueprint (Kenny, 2026-10-07 04:23: the themes one by
// one, "cyberpunk, synthwave, solstice, brutalism, grotesk, blueprint"), the
// same way as titanium, forest, nostromo, cyberpunk, synthwave, solstice,
// brutalism and grotesk (02:54: "waar jij eerst uitzoekt wat bij mekaar past,
// wat niet past en dan zo voorstellen doet"). Blueprint is the last of the
// list.
//
// A review-kit demo in aspect mode, blueprint only. Each ASPECT is one rule of
// the theme's grammar (themes/blueprint/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-bw-<aspect>="<key>"`) that options.css reads. The recommended option
// is always first. The page's one clock (below) plays every scene that
// arrives, opens, presses, updates or leaves, so the rule is seen in action;
// the clock only writes attributes and text, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.
//
// Round two (2026-10-07, after the anchor): Kenny picked the tracing pen as
// blueprint's anchor (research/blueprint-anchor, 21:19), the one element
// every other decision of the theme departs from. The questions are reworked
// around it: the pen (pen.js, one shared piece taken from the anchor's art)
// is what arrives, opens, leaves, waits, is pressed and marks a change; its
// witness lines and pointers are how a place or a value is read; the
// graticule is the surface; the plotter's feed is the curve. Where a
// question is about something the pen cannot draw (time, colour, type,
// consistency, the focus ring, where marks may stand) its options stay and
// the recommended one agrees with the anchor.

import { pen, tracer } from './pen.js';

/* ----------------------------------------------------------- the parts */

/** The four corner brackets a part stands in (G7, scope-18). */
const FRAME = `<span class="bw-frame" aria-hidden="true"></span>`;
/**
 * What the pen draws on a part before it is inked (G2, G3): the outline it
 * traces, the diagonal it sets out, the two witness lines it marks off, and
 * the pen itself. The option of the question picks which of them works.
 */
const TRACE = `<span class="bw-trace" aria-hidden="true"></span><span class="bw-diag" aria-hidden="true"></span><span class="bw-mk bw-mk--s" aria-hidden="true"></span><span class="bw-mk bw-mk--e" aria-hidden="true"></span>${pen()}`;
/** The amber leader a panel is led in by from its trigger, ending in a node (G3). */
const LEAD = `<span class="bw-lead" aria-hidden="true"></span>`;
/** The two amber witness lines at a part's ends, under the hand (G8, gap-4). */
const WIT = `<span class="bw-wit" aria-hidden="true"></span>`;
/** What the pen draws on a held control: the dimension across its foot (slash ticks, no arrowheads) or the datum cross at its centre (G14). */
const PRESS_INKS = `<span class="bw-dim" aria-hidden="true"></span><span class="bw-datum" aria-hidden="true"></span>${pen(true)}`;
/** What a leaving part is struck out with (G12): the demolition hatch, the second diagonal of a cross, and the pen that draws them. */
const HATCH = `<span class="bw-x" aria-hidden="true"></span><span class="bw-diag bw-diag--back" aria-hidden="true"></span>${pen(true, 'bw-pen--leave')}`;
/** The pen's mark on a changed value (G9): the reading's pointer and scale, the revision cloud and its letter, or a rule, by option. */
const CLOUD = `<span class="bw-cloud" aria-hidden="true"><span class="bw-cloud__rev" data-bw-rev>△B</span>${pen(true)}</span>`;

/** A package button with its label span; `press` adds what the pen draws when it is held, `wit` the witness lines under the hand. */
const button = (label, modifier = '', extra = '', press = false, wit = false) =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span>${wit ? WIT : ''}${press ? PRESS_INKS : ''}</button>`;

/** The flag note a tone is marked with (G13); options.css shows it where the option asks. */
const flag = (kind, word) => `<span class="bw-flag" data-bw-kind="${kind}"><span class="bw-flag__mark" aria-hidden="true"></span>${word}</span>`;

/**
 * The place a waiting reading will stand (G10), with every loading picture an
 * option may draw in it, each worked by the pen: the curve it traces across
 * the place (`.bw-tracer`), the section it hatches (`.bw-section`) and the
 * outline it keeps tracing (`.bw-outline`). options.css shows one.
 */
const wait = (kind, i = 0) =>
    `<span class="bw-wait bw-wait--${kind}" style="--i: ${i}" aria-hidden="true"><span class="bw-section">${pen(true)}</span>${tracer()}<span class="bw-outline"><span class="bw-trace"></span>${pen(true)}</span></span>`;

/** The change, set in the lettering with its sign (G13, the columns' tolerance). */
const change = (text, dir = 'up') => `<span class="bw-change" data-bw-dir="${dir}">${dir === 'up' ? '+' : '−'}${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter bw-meter" role="meter" aria-label="Load on the beam, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** The anchor's tracing on the millimetre paper: the pen's curve, read against both axes. */
const plot = (cls = '', label = '') => `<div class="bw-plot ${cls}" aria-hidden="true">${tracer(label)}</div>`;

const PART = {
    /** A plate: a measured part on the sheet. */
    tile: (title = 'Sheet A-201', body = 'Ground floor plan · rev C', cls = 'bw-arrives', extra = '') =>
        `<div class="kp-card bw-plate bw-tile ${cls}" ${extra}>${FRAME}${TRACE}<p class="kp-card__title bw-title">${title}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Sheets issued', value = '412', foot = change('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi bw-plate bw-kpi ${cls}" ${extra}>${FRAME}${TRACE}
        <span class="kp-kpi__label bw-label">${label}</span>
        <span class="bw-carrier"><span class="kp-kpi__value bw-figure" data-bw-num>${value}</span>${CLOUD}</span>
        <span class="kp-kpi__trend">${foot} <span class="bw-faint">on last week</span></span>
    </div>`,
    days: (n = 7, from = 12, cls = 'bw-arrives') =>
        `<div class="bw-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="bw-day ${cls}" style="--i: ${i}">${TRACE}<span class="bw-day__num">${from + i}</span></span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="bw-rows" aria-hidden="true">${['A-201 Ground floor', 'A-202 First floor', 'S-110 Foundations']
            .map((t, i) => `<span class="bw-row-line bw-arrives" style="--i: ${i}">${TRACE}${t}</span>`)
            .join('')}</div>`,
    strip: () =>
        `<div class="bw-strip" aria-hidden="true">${[
            ['Issued', '38'],
            ['Held', '4'],
            ['Void', '12'],
        ]
            .map(
                ([l, v], i) =>
                    `<div class="bw-strip__col bw-arrives" style="--i: ${i}">${TRACE}<span class="bw-label">${l}</span><span class="bw-figure">${v}</span></div>`,
            )
            .join('')}</div>`,
    /** A trigger and the menu it opens: the panel is traced, drawn along its axes or led in from the trigger by option. */
    menu: () => `<div class="bw-menu-wrap">
        ${button('Sheet ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="bw-pop-wrap"><div class="kp-popover bw-pop bw-float bw-opens">${TRACE}${LEAD}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the drawing</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Issue a revision…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Void the sheet</button></li>
        </ul></div></div>
    </div>`,
    dialog: () => `<div class="bw-menu-wrap">
        ${button('Issue revision…', 'kp-button--sm', 'aria-haspopup="dialog" aria-expanded="true"')}
        <div class="bw-pop-wrap"><div class="kp-dialog bw-dialog bw-float bw-opens" role="group" aria-label="A dialog opening">${TRACE}${LEAD}
        <p class="kp-dialog__title bw-title">Issue revision C?</p>
        <p class="kp-dialog__description">Sheet A-201 goes to the site as revision C.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Issue it', 'kp-button--sm kp-button--primary')}</div>
    </div></div></div>`,
    state: (word = 'Issued', kind = 'good') =>
        `<span class="bw-state" data-bw-kind="${kind}"><span class="bw-carrier bw-carrier--mark"><span class="bw-state__dot" aria-hidden="true"></span>${CLOUD}</span><span class="bw-state__word" data-bw-word>${word}</span></span>`,
    alert: (text = 'Sheet A-201 is issued for construction.') =>
        `<div class="kp-alert bw-alert bw-leaves" role="status">${TRACE}${HATCH}<span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="bw-spark-wrap"><span class="kp-kpi__label bw-label">Sheets, 24 h</span><span class="bw-carrier bw-carrier--line"><span class="bw-spark" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg></span>${CLOUD}</span></div>`,
    column: (label = 'Issued', value = '38') =>
        `<div class="bw-column bw-plate">${FRAME}<span class="bw-label">${label}</span><span class="bw-carrier"><span class="bw-figure" data-bw-num>${value}</span>${CLOUD}</span></div>`,
    field: () =>
        `<label class="kp-field bw-field"><span class="kp-field__label">Drawing number</span><input class="kp-field__input" value="A-201" /></label>`,
};
const caption = (text) => `<p class="bw-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="bw-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

const waitingKpi = () =>
    `<div class="kp-kpis"><div class="kp-kpi bw-plate bw-kpi bw-waits" aria-busy="true">${FRAME}<span class="kp-kpi__label bw-label">Sheets issued</span>${wait(
        'figure',
    )}<span class="kp-kpi__trend bw-faint">on last week</span></div></div>`;

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('A week is constructed, day by day', PART.days(7), 'bw-part--wide') +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A value changes', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('A part waits (a loop)', waitingKpi());

const ARRIVAL = () =>
    cell('A week of days arrives', PART.days(7), 'bw-part--wide') +
    cell('A list of sheets', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A strip of columns', PART.strip()) +
    cell('A line in time is traced', plot('bw-plot--paper bw-plot--draws', '412'));

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens from its button', PART.dialog());

const waitingTile = () =>
    `<div class="kp-card bw-plate bw-tile bw-waits" aria-busy="true">${FRAME}<p class="kp-card__title bw-title">Sheet A-202</p>${wait('body')}${wait('body', 1)}</div>`;

const DURATION = () =>
    cell(
        'Contact and the press: a button held',
        `<div class="bw-row">${button('Plot the sheet', 'bw-press', '', true)}</div><p class="bw-readout" data-bw-readout="contact"></p>`,
    ) +
    cell('A part is constructed: a tile arrives', PART.tile() + '<p class="bw-readout" data-bw-readout="part"></p>') +
    cell('A panel is constructed: a menu opens', PART.menu() + '<p class="bw-readout" data-bw-readout="panel"></p>') +
    cell('A loop: a tile waits', `${waitingTile()}<p class="bw-readout" data-bw-readout="loop"></p>`);

const COLOUR = () =>
    cell('Buttons, one pointed at', `<div class="bw-row">${button('Plot', 'bw-pointed')}${button('Issue sheet', 'kp-button--primary')}</div>`) +
    cell('A meter', meter(0.62, 0.8)) +
    cell('The pen’s trace and its readings', `<div class="bw-plate bw-plot-plate">${FRAME}${plot('bw-plot--paper', '412')}</div>`) +
    cell(
        'Key figures, one read again',
        `<div class="kp-kpis bw-kpi-row">${PART.kpi('Sheets issued', '412', change('6 %'), 'bw-revised')}${PART.kpi('Held', '4', change('1', 'down'))}</div>`,
        'bw-part--wide',
    ) +
    cell(
        'A link, today and the picked day',
        `<p class="bw-prose">See the <a href="#bw-intro">drawing register</a> for details.</p><div class="bw-days bw-days--pick">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="bw-day${d === 13 ? ' bw-today' : ''}${d === 14 ? ' bw-picked' : ''}">${FRAME}<span class="bw-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell(
        'A warning, tags',
        `<div class="bw-row">${flag('warn', 'Check')}<span class="kp-badge">Rev C</span><span class="kp-tag">Level 2</span></div>`,
    );

const SURFACE = () =>
    cell('Card', PART.tile('Sheet A-201', 'Ground floor plan · rev C', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Sheets issued', '18 240', change('6 %'))}</div>`) +
    cell('A plot of data', `<div class="bw-plate bw-plot-plate">${FRAME}${plot('bw-plot--paper', '412')}</div>`) +
    cell('A state', `<div class="bw-plate bw-state-plate">${FRAME}${PART.state('Issued')}</div>`) +
    cell(
        'A menu over the page',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Issue a revision…</button></li></ul></div>`,
    ) +
    cell(
        'Buttons, a tag, a field',
        `<div class="bw-row">${button('Plot')}${button('Issue sheet', 'kp-button--primary')}<span class="kp-badge">Rev C</span></div>${PART.field()}`,
    );

/** The tone scene does not replay; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-bw-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis bw-kpi-row">${PART.kpi('Sheets issued', '412', change('6 %'))}<div class="kp-kpi bw-plate bw-kpi bw-toned" data-bw-kind="warn" style="--bw-at: 0.8">${FRAME}<span class="kp-kpi__label bw-label">Days late</span><span class="bw-toned__line">${flag(
                'warn',
                'Check',
            )}<span class="kp-kpi__value bw-figure bw-toned__figure">14</span></span><span class="kp-kpi__trend">${change('9', 'up')} <span class="bw-faint">on last week</span></span></div></div>`,
            'bw-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card bw-plate bw-tile bw-toned" data-bw-kind="bad" style="--bw-at: 1">${FRAME}<p class="kp-card__title bw-title bw-toned__line">${flag(
                    'bad',
                    'Failed',
                )}<span class="bw-toned__figure">S-110</span></p><p class="kp-card__body">No plot since 16:40</p></div>`,
            ) +
            cell(
                'A failed state',
                `<div class="bw-plate bw-state-plate bw-toned" data-bw-kind="bad" style="--bw-at: 1">${FRAME}<span class="bw-toned__line">${flag('bad', 'Failed')}${PART.state(
                    'Not plotted',
                    'bad',
                )}</span></div>`,
            ) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive bw-toned" data-bw-kind="bad" style="--bw-at: 1"><span class="bw-toned__line">${flag('bad', '')}<span class="bw-toned__figure">Void the sheet</span></span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="bw-plate bw-meter-plate bw-toned" data-bw-kind="warn" style="--bw-at: 0.88">${FRAME}<span class="bw-cap bw-toned__line">${flag(
                    'warn',
                    'Check',
                )}<span class="bw-toned__figure">Beam near its load</span></span>${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its mark', PART.state('Issued')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><p class="kp-card__body"><span class="bw-carrier"><span data-bw-num>4 held</span>${CLOUD}</span></p></div>`,
    );

/** Every waiting part of the dashboard, the loading picture drawn in each. */
const LOADERS = () =>
    cell('Key figure', waitingKpi()) +
    cell(
        'Busy table',
        `<div class="bw-table bw-plate bw-waits" aria-busy="true">${FRAME}<span class="bw-table__head bw-label">Sheet</span><span class="bw-table__head bw-label">Rev</span>${[
            0, 1, 2,
        ]
            .map((i) => wait('row', i))
            .join('')}</div>`,
    ) +
    cell(
        'Menu, its loading entry',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-waits bw-entry-wait" aria-busy="true">Loading the sheets${wait(
            'entry',
        )}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="bw-days bw-days--wait">${[0, 1, 2, 3, 4].map((i) => `<span class="bw-day bw-waits">${wait('day', i)}</span>`).join('')}</div>`,
    ) +
    cell(
        'Meter, measuring',
        `<div class="bw-plate bw-meter-plate bw-waits" aria-busy="true">${FRAME}${caption('Load on the beam')}${wait('meter')}</div>`,
    ) +
    cell('A tile', waitingTile()) +
    cell(
        'The package, as approved: the compass and the chain line',
        `<div class="bw-row"><span class="kp-spinner" role="status" aria-label="Working…"></span><div class="kp-progressbar bw-story__bar" role="progressbar" aria-label="Plotting" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div></div>`,
    );

/** A part that leaves and arrives. */
const LEAVE = () =>
    cell('An alert', PART.alert()) +
    cell('A card', PART.tile('Sheet A-201', 'Ground floor plan · rev C', 'bw-leaves').replace(FRAME, FRAME + HATCH)) +
    cell(
        'A key figure',
        `<div class="kp-kpi bw-plate bw-kpi bw-leaves">${FRAME}${TRACE}${HATCH}<span class="kp-kpi__label bw-label">Sheets issued</span><span class="kp-kpi__value bw-figure">412</span></div>`,
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="bw-row">${button('Plot the sheet', 'bw-alone', '', true)}${button('Issue sheet', 'kp-button--primary bw-alone', '', true)}</div>`,
        'bw-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header bw-header bw-plate">${FRAME}<div class="kp-page-header__inner"><div><p class="kp-page-header__title bw-title">Drawing register</p><p class="kp-page-header__description">Forty sheets, project 2026-14.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm bw-in-header', '', true)}${button('Add a sheet', 'kp-button--sm kp-button--primary bw-in-header', '', true)}</div></div></header>`,
        'bw-part--wide',
    ) +
    cell(
        'Menu: its entries',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-in-entry">${WIT}<span class="bw-dim" aria-hidden="true"></span>Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Issue a revision…</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><a class="kp-button kp-button--ghost kp-button--sm bw-tile-link" href="#bw-intro"><span class="kp-button__label">Open</span>${PRESS_INKS}</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card bw-plate bw-drawer">${FRAME}<p class="kp-card__title bw-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your level.</p><div class="bw-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost bw-in-drawer',
            '',
            true,
        )}${button('Next', 'kp-button--sm kp-button--primary bw-in-drawer', '', true)}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi bw-plate bw-kpi bw-in-kpi" href="#bw-intro">${FRAME}${WIT}<span class="bw-dim" aria-hidden="true"></span><span class="kp-kpi__label bw-label">Sheets issued</span><span class="kp-kpi__value bw-figure">412</span><span class="kp-kpi__trend bw-faint">since Monday</span></a></div>`,
    );

const HOVER = () =>
    cell(
        'Button, pointed at',
        `<div class="bw-row">${button('Plot the sheet', 'bw-pointed', '', false, true)}${button('Issue sheet', 'kp-button--primary', '', false, true)}</div>`,
    ) +
    cell(
        'Menu entries, the first pointed at',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-pointed">${WIT}Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${WIT}Issue a revision…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${WIT}Rename</button></li></ul></div>`,
    ) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><p class="kp-card__body">Ground floor plan · rev C</p><a class="kp-button kp-button--ghost kp-button--sm bw-tile-link bw-pointed" href="#bw-intro"><span class="kp-button__label">Open</span>${WIT}</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis bw-kpi-row"><a class="kp-kpi bw-plate bw-kpi bw-pointed" href="#bw-intro">${FRAME}${WIT}<span class="kp-kpi__label bw-label">Sheets</span><span class="kp-kpi__value bw-figure">412</span></a><a class="kp-kpi bw-plate bw-kpi" href="#bw-intro">${FRAME}${WIT}<span class="kp-kpi__label bw-label">Held</span><span class="kp-kpi__value bw-figure">4</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="bw-days">${[12, 13, 14, 15]
            .map((d) => `<span class="bw-day${d === 13 ? ' bw-pointed' : ''}">${FRAME}${WIT}<span class="bw-day__num">${d}</span></span>`)
            .join('')}</div>`,
    );

const FOCUS = () =>
    cell(
        'Button and primary button',
        `<div class="bw-row">${button('Plot', 'bw-focused')}${button('Issue sheet', 'kp-button--primary bw-focused')}</div>`,
    ) +
    cell('Header action', `<div class="bw-header-mini bw-plate">${FRAME}${button('Export', 'kp-button--sm bw-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi bw-plate bw-kpi bw-focused" href="#bw-intro">${FRAME}${WIT}<span class="kp-kpi__label bw-label">Sheets issued</span><span class="kp-kpi__value bw-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-focused">${WIT}Issue a revision…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${WIT}Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="bw-days"><span class="bw-day">${FRAME}${WIT}<span class="bw-day__num">13</span></span><span class="bw-day bw-focused">${FRAME}${WIT}<span class="bw-day__num">14</span></span><span class="bw-day">${FRAME}${WIT}<span class="bw-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><a class="kp-button kp-button--ghost kp-button--sm bw-tile-link bw-focused" href="#bw-intro"><span class="kp-button__label">Open</span></a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="bw-row">${button('Plot the sheet', 'bw-press', '', true)}</div>`) +
    cell('Primary button', `<div class="bw-row">${button('Issue sheet', 'kp-button--primary bw-press', '', true)}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-press">${WIT}${PRESS_INKS}Issue a revision…</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="bw-days"><span class="bw-day bw-press">${FRAME}${WIT}${PRESS_INKS}<span class="bw-day__num">14</span></span></div>`,
    ) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle bw-plate bw-kpi bw-press" aria-pressed="false">${FRAME}${WIT}${PRESS_INKS}<span class="kp-kpi__label bw-label">Held sheets</span><span class="kp-kpi__value bw-figure">4</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card bw-plate bw-type">${FRAME}<p class="bw-type__label bw-label">Sheet A-201, level 2</p><p class="bw-type__head">Revisions this week</p>
        <p class="bw-type__prose">Two beams on grid line C moved 150 mm after the structural check; the sheet shows the new positions from revision C.</p>
        <p class="bw-type__figure"><span class="bw-figure">14</span> <small>days to issue</small> ${change('3 d', 'down')}</p>
        <div class="bw-type__strip">${[
            ['Issued', '38'],
            ['Held', '4'],
            ['Void', '12'],
        ]
            .map(([l, v]) => `<div><span class="bw-label">${l}</span><span class="bw-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="bw-type__table"><tbody><tr><th scope="row" class="bw-label">Drawing</th><td>A-201 Ground floor plan</td></tr><tr><th scope="row" class="bw-label">Last plot</th><td><span class="kp-timestamp bw-stamp">2026-10-07 08:12</span></td></tr></tbody></table>
        <p>${button('Open the drawing', 'kp-button--sm')} <span class="kp-badge bw-tagged">Rev C</span></p></div>`,
        'bw-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell('A plot of data, read by the pen', `<div class="bw-plate bw-plot-plate">${FRAME}${plot('bw-plot--paper', '412')}</div>`) +
    cell(
        'A card and a warning card',
        `<div class="bw-motif-pair">${PART.tile('Sheet A-201', 'Ground floor plan · rev C', 'bw-motif-card')}<div class="kp-card bw-plate bw-tile bw-motif-warn bw-toned" data-bw-kind="warn">${FRAME}<span class="bw-cloud bw-cloud--still" aria-hidden="true"></span><p class="kp-card__title bw-title bw-toned__line">${flag(
            'warn',
            'Check',
        )}<span class="bw-toned__figure">S-110</span></p><p class="kp-card__body">14 days late</p></div></div>`,
        'bw-part--wide',
    ) +
    cell(
        'Changes, today and the pick',
        `<div class="bw-row">${change('6 %')}${change('3 %', 'down')}</div><div class="bw-days bw-days--motif">${[12, 13, 14, 15]
            .map(
                (d) =>
                    `<span class="bw-day${d === 13 ? ' bw-today' : ''}${d === 14 ? ' bw-picked' : ''}">${FRAME}<span class="bw-day__num">${d}</span></span>`,
            )
            .join('')}</div>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty bw-plate bw-motif-empty">${FRAME}<p class="kp-empty__title">No sheets yet</p><p class="kp-empty__body">The first is plotted on Monday.</p></div>`,
    ) +
    cell(
        'The pen: shown while something is drawn',
        `<div class="bw-plate bw-pen-motif">${FRAME}${pen(false, 'bw-pen--still')}<p class="bw-cap">Parked on its rail between two jobs.</p></div>`,
    ) +
    cell(
        'A divider between two sections',
        `<p class="bw-cap">Architecture</p><div class="bw-divider" data-kp-divider></div><p class="bw-cap">Structure</p>`,
    );

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, update, leave), 'loop' scenes loop in CSS, 'still'
 * scenes do not move. `options[0]` is the recommendation: in round two
 * (2026-10-07 21:19, the tracing pen decided as the anchor) it is always the
 * option that most visibly comes from the pen; where a question is about
 * something the pen cannot draw, the recommended option agrees with it.
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: () => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'How does blueprint’s pen move: with the plotter’s ramp, at a plain even pace, or in hard steps?',
        why: 'The anchor you picked is a pen, and a pen has a feed. In the tracing the pen ramps softly up and down at the ends of its one stroke; a stepper plotter does that on every stroke. Blueprint’s register moves on linear and twenty-two of your picks do too, but linear is grotesk’s even pace (with its station-clock dwell) and high-contrast’s register. No other theme ramps around an even feed.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'feed',
                name: 'The plotter’s feed: a short ramp, a long even feed, a short ramp',
                see: 'The anchor’s own feed on every pen stroke: the pen constructs the week day by day (each side of each day its own stroke), draws the menu and the tile, and reads the changed figure on its scale; the waiting part’s pen traces its curve in one stroke with one ramp. Every stroke starts softly, runs at one speed for most of its length and stops softly.',
                verdict: rec(
                    'it is the anchor’s feed (the tracing pen ramps at the ends of its stroke), it keeps the even line of your linear picks without their hard start and stop, and no other theme ramps around an even feed.',
                ),
            },
            {
                key: 'linear',
                name: 'A plain even pace, a dead stop (your picks; grotesk’s and high-contrast’s)',
                see: 'The pen moves at one speed from the first frame to the last and stops dead.',
                verdict: not('it is your register’s curve, but grotesk now uses the even pace and high-contrast’s register is linear too.'),
            },
            {
                key: 'steps',
                name: 'Hard steps (your Plotted and Lettered; near terminal’s, nostromo’s, cyberpunk’s)',
                see: 'The pen jumps along every stroke in four hard steps.',
                verdict: not(
                    'it reads mechanical, but a drawn line is continuous (the anatomy), and stepping is terminal’s, nostromo’s and cyberpunk’s.',
                ),
            },
        ],
    },
    {
        id: 'arrival',
        label: 'How a part arrives',
        rule: 'G2',
        question: 'When a part arrives on the sheet, what does the pen do?',
        why: 'With the tracing pen as the anchor a part cannot simply appear: the pen brings it. Eleven of your arrival picks uncover the part from the start with a moving edge, which is titanium’s feed and formal’s ledger pen; they are left out here because the pen draws, it does not wipe. The pen can bring a part three ways of its own: it runs round the outline, it sets the part out on a diagonal, or it marks the two ends with witness lines.',
        kind: 'cycle',
        scene: ARRIVAL,
        options: [
            {
                key: 'trace',
                name: 'The pen traces its outline, then inks it',
                see: 'The pen enters at the part’s top-start corner and runs round it, along the top, down the end, back along the foot and up the start, a thin cyan construction line behind its nib; when the line closes the part is inked at once and the pen parks at the top-end corner. The days, the rows and the columns one after another (a small pen each). The line in time is the anchor itself: the pen traces the curve in one stroke and its amber witness lines and pointers read it against both axes.',
                verdict: rec(
                    'it is the anchor drawn on every part, the same pen and feed, the outline traced before the part is inked, and no other theme draws a part’s outline before the part.',
                ),
            },
            {
                key: 'diag',
                name: 'The pen sets it out on a diagonal',
                see: 'The pen draws one diagonal from the part’s top-start corner to its foot-end corner, the way a draughtsman sets out a rectangle; the part is inked on that line and the line is lifted. One stroke, one ramp.',
                verdict: not('it is quick and one stroke, but a single diagonal says little about where the part’s edges are; the outline does.'),
            },
            {
                key: 'marks',
                name: 'The pen marks it off with witness lines',
                see: 'The pen draws an amber witness line down the part’s start, lifts, crosses to its end and draws the second line upward; the part is inked between them and the lines are lifted. It borrows the hover’s witness lines (gap-4): a part arrives measured.',
                verdict: not(
                    'it is the most measured arrival, but it uses the hand’s mark for arriving too, so a hovered part and a new part would look alike.',
                ),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening a menu or a dialog',
        rule: 'G3',
        question: 'How does a menu, a popover or the dialog open?',
        why: 'The same pen opens what floats over the drawing. Your menus and the header’s menu are Drafted: cut open from the top edge down, which is titanium’s opening exactly; your drawer unrolls from the tube. Neither is a pen. Your tooltip already draws its leader first and your dialog its top edge first; the options below are three ways the pen can open a panel from its button.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'trace',
                name: 'The pen traces the panel from its corner, then inks it',
                see: 'The pen enters at the panel’s top-start corner (the corner at its button) and runs the outline, along the top, down, back along the foot, up, a thin cyan line behind its nib; then the panel is inked at once and the pen parks; 800 ms. Closing is the same played backwards: the pen comes back, the ink is lifted at once, the outline is run back to the corner.',
                verdict: rec(
                    'it is one picture with the arrival, the anchor’s pen again, it keeps your dialog’s first stroke along the top, and it is no other theme’s opening.',
                ),
            },
            {
                key: 'axes',
                name: 'Two axes first: the pen draws the start edge and the foot, then inks the panel',
                see: 'The pen draws the panel’s two axes, down its start edge and along its foot, the graticule’s own frame, then the panel is inked at once and the pen parks; the axes are lifted at the end. Closing plays it backwards.',
                verdict: not(
                    'it is the anchor’s graticule, but two edges say less than the whole outline about where the panel will stand and how big it is.',
                ),
            },
            {
                key: 'led',
                name: 'Led in: the pen draws a leader from the trigger, then traces the panel',
                see: 'The pen draws an amber leader from the button down to the panel’s top edge, ending in a node (your tooltip’s approved way), lifts, and traces the outline from the corner; the panel is inked. Closing plays it backwards.',
                verdict: not(
                    'it ties the panel to the button that opened it, but it costs a leader’s length of time and room, and a dialog that covers the page has no button left to point back to.',
                ),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does each kind of motion take?',
        why: 'Your picks run one-shots at sixteen durations (160 ms to 1.4 s) and loops at nine (0.7 to 3 s, the chart’s grid 6 s there and back). The anchor itself runs on one timeline of 18 units of the register’s own 160 ms (2880 ms); counting everything in that unit gives the theme one rhythm. This is about time, which the pen cannot draw, so the options stay; the recommended one agrees with the anchor.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: 'Counted in units of 160 ms',
                see: 'Contact 160 ms and the press’s dimension 320 ms; a part constructed in 480; a panel in 800; a revision 960; the leave 1120; a loop 2880, the anchor’s own timeline. The numbers under each part say which.',
                verdict: rec('one unit makes every pen stroke belong together, it is the anchor’s own timeline, and the set is no other theme’s.'),
            },
            {
                key: 'picks',
                name: 'As your picks have them',
                see: 'The tile 500 ms, the menu 300 ms, the press at once, a loop 1500 ms.',
                verdict: not('each was right on its own, but side by side the parts keep different time.'),
            },
            {
                key: 'instant',
                name: 'At once (retro’s 0 ms)',
                see: 'Everything appears and changes at once; only the loop still moves.',
                verdict: not('it is the quietest, but the pen you see drawing is the theme.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What do cyan and amber each mean?',
        why: 'The colours are the settled base of the anchor: the cyan pen draws, amber annotates, the Prussian blue is the sheet. Your picks also use amber for the picked day, the current step and the tooltip’s frame, and the warning colour has amber’s very hue, so a note, a pick and a warning can look the same. This is about colour meaning, which the pen cannot draw, so the options stay; the recommended one is the anchor’s own: its trace is cyan and its witness lines and pointers are amber.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'pen',
                name: 'Cyan draws, amber annotates',
                see: 'Cyan for what the pen draws and what you do (the trace, the primary action, the picked day, a link); white ink for words; steel blue for finished lines and the pen’s carriage; amber only for notes: the witness lines and pointers that read the pen’s place, the meter’s leader. The warning is told by its flag and its word.',
                verdict: rec(
                    'it is the anchor’s palette, each colour has one job, as on a real drawing, and amber stays a note instead of a highlight.',
                ),
            },
            {
                key: 'cyan',
                name: 'Cyan only',
                see: 'Amber is gone: the witness lines, the pointers and the meter’s leader are cyan too.',
                verdict: not('it is calm, but the checker’s notes and the drawing become one, and the pointers no longer stand out from the trace.'),
            },
            {
                key: 'amber',
                name: 'Amber as the main line (near solstice’s amber and deco’s gold)',
                see: 'The pen, the primary action, the picked day and the link in amber; cyan only for the plotted line.',
                verdict: not('it is warm, but amber that acts is solstice’s, gold on dark blue is deco’s, and the warning disappears in it.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What does a plate (card, key figure, tile, the plot, a state) look like?',
        why: 'The tracing anchor stands on a graticule: millimetre paper framed by two ticked axes, no box. Four of your shape picks hatch the whole plate (the section view: busy, header, key figure, tiles; cyberpunk’s holo card is the same scan-lined plate), four lay a grid on it, and the register frames every card in a closed box. The anatomy says this theme may not draw a closed frame around content; your measurement frame (scope-18) is four corner brackets. The graticule’s axes are the same idea drawn by the pen.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'axes',
                name: 'The graticule’s axes: two ticked scales',
                see: 'No fill and no closed frame: a plate stands where two ticked axes meet, a ruler along its start edge and another along its foot, the way the tracing pen’s graticule is framed; millimetre paper only under data, where the pen’s curve and its readings stand. The menu, which floats, keeps one thin frame and no shadow.',
                verdict: rec(
                    'it is the anchor’s own frame, the scales the pen reads its place against; there is still no box round content, and it leaves the hatch free to mean a section.',
                ),
            },
            {
                key: 'measured',
                name: 'A measured part: four corner brackets (your measurement frame)',
                see: 'No fill and no closed frame: the ruled sheet shows through, and four corner brackets say where the plate stands (your measurement frame and laurels, scope-18). The plot stands on millimetre paper.',
                verdict:
                    'Your decided instrument and the safe choice: it keeps the anatomy’s rule against boxes, but it is not the pen’s; the anchor reads its place on two scales, not at four corners.',
            },
            {
                key: 'section',
                name: 'The section view (your picks four times; near cyberpunk’s scan lines)',
                see: 'Every plate hatched at 45° inside a dashed frame.',
                verdict: not('it is your pick, but hatched plates on a dark blue ground read as cyberpunk’s scan-lined holo cards.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How is a warning or a failure shown?',
        why: 'Your tone picks draw six different things: a frame all round in the tone (key figure, trend: nostromo’s klaxon), the figure on the tone’s plate (high-contrast’s), a hatch in the tone (the menu: near brutalism’s hazard tape), a dashed border (the busy failure), a toned frame (the state), and the calendar’s △ and ▲, the flag notes of a drawing. The frames and the hatch are left out here; the tracing pen has a pointer, a small triangle it rests on a scale, and a pen has a second ink.',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'pointed',
                name: 'Pointed out: the tone’s pointer on the reading’s scale',
                see: 'The figure stands on a short ruler and the tone’s pointer ▲ rests on it where the reading is (the warning high on the scale, the failure at its end), the same pointer the tracing pen rests on its axes, with the word in the lettering beside the figure; the plate’s frame stays steel. Nothing is framed all round, filled or hatched.',
                verdict: rec(
                    'it is the anchor’s pointer in the tone’s ink: the reading is placed on a scale, so the warning says how far, and the word and the shape carry it where colour cannot (the warning has amber’s hue).',
                ),
            },
            {
                key: 'flag',
                name: 'Flagged: △ or ▲ and the word (your calendar’s title block)',
                see: 'A drafting flag before the title or figure, an outlined △ for a warning and a filled ▲ for a failure, in the tone’s light ink, the word in the lettering after it (CHECK, FAILED), and the plate’s frame (its two axes) in the tone. Nothing is framed all round, filled or hatched.',
                verdict: not(
                    'it is your calendar’s own mark and says the tone in shape and word as well as colour, but it says only that, not how far: the pointer is the same triangle on a scale.',
                ),
            },
            {
                key: 'rule',
                name: 'Underscored by the pen in the tone’s ink',
                see: 'The figure is ruled under by the pen in the tone’s own ink, one stroke for a warning and two for a failure, the word in the lettering beside it; the plate’s frame stays steel. Nothing is framed all round, filled or hatched.',
                verdict: not(
                    'it is how a checker marks a figure on a print, but a rule under text reads as a link or an emphasis before it reads as a warning.',
                ),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a value changes in place?',
        why: 'Your live picks draw five things: the figure flips (the columns: grotesk’s flap board), rises from below (the key figure: solstice’s rise), a ring that swells and shrinks round the tile (the tiles), a swell (the state: dark’s and light’s), and nothing at all (trend, chart: formal’s). The flips, rises and swells are left out here. Your graph’s pick is Revised, an amber mark on what changed. The tracing pen reads a value against a scale and drops witness lines to it; a change is the pen reading again.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'read',
                name: 'Read again: the pointer slides to the new reading',
                see: 'The new value is written at once and never moves. A short ruler is drawn under it, an amber pointer rests on the old reading with a witness line up to the value, slides along the ruler to the new reading on the feed and stands; then the ruler, the line and the pointer are lifted; 960 ms, once.',
                verdict: rec(
                    'it is the anchor’s reading drawn on every value (witness line and pointer on a scale), the value stays readable the whole time, and it also says whether the reading went up or down.',
                ),
            },
            {
                key: 'cloud',
                name: 'Revised: the pen draws the amber cloud and its letter (your graph’s pick)',
                see: 'The new value is written at once; a small pen runs round it clockwise and the checker’s amber scalloped cloud follows its nib, with △B (then △C …) beside it; it stands, then is lifted. 960 ms, once. Nothing moves.',
                verdict: not(
                    'it is how a drawing marks a change and your graph’s pick, but a cloud is a shape round the value and says only that something changed, not by how much.',
                ),
            },
            {
                key: 'rule',
                name: 'Gone over once more: the pen rules a line under the new value',
                see: 'The new value is written at once; a small pen rules an amber line under it, start to end, on the feed, the line stands and is lifted; 960 ms, once. Nothing moves.',
                verdict: not('it is plain and quick, but a rule under a figure is the emphasis of a link and says nothing about the change.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a part look like while its reading is on its way?',
        why: 'The anchor is itself a loading picture: a pen tracing a curve across a graticule, its witness lines reading both axes. Your picks draw nine loading pictures (a cell stepping, a marching outline, the grid breathing, a scan, a dimension line, a pen, a plotter, dashes, a recorder); the ones running along the foot are forest’s, solstice’s and nostromo’s loading and the marching outline is high-contrast’s, so none of them is kept. Your signature skeleton is blueprint’s own: a section hatched between two dimension ticks.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'trace',
                name: 'The pen traces its curve across the waiting place',
                see: 'Where the reading will stand is a strip of millimetre paper; the pen traces the anchor’s curve across it in one stroke, an amber witness line dropping from its nib to the foot and to the start edge, a pointer on each; the curve and its readings stand, then they are lifted and the pen goes back (2.9 s). Several places a moment apart. Labels stay readable above; the compass and the chain line stay as approved.',
                verdict: rec(
                    'it is the anchor as the loading picture, the pen and its readings in every waiting place, and a reading that is still being plotted is what a waiting part is.',
                ),
            },
            {
                key: 'hatch',
                name: 'The pen hatches the section (your skeleton, everywhere)',
                see: 'Where the reading will stand, a section between two ticks; a small pen hatches it from left to right in 45° strokes, the hatch stands, and it is lifted, then hatched again (2.9 s). Several sections a moment apart.',
                verdict: not(
                    'it is your approved skeleton with the pen in view and it says “material goes here”, but a hatch is a texture for an area and does not show the pen’s readings.',
                ),
            },
            {
                key: 'outline',
                name: 'The pen keeps tracing the outline of the place',
                see: 'A small pen runs round the waiting place again and again, drawing its outline and lifting it, the construction line of the arrival on a loop (2.9 s).',
                verdict: not(
                    'it makes waiting and arriving one picture, but an outline drawn and lifted again and again reads as a dashed outline marching, which is high-contrast’s loading.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the sheet, and come back?',
        why: 'Your leave (2026-10-04): hatched out like a wall marked for demolition, then lifted off the sheet; what arrives plays it backwards (your reverse-close). With the pen as the anchor the pen does the marking: it hatches the part out, or crosses it out, or runs its outline back. The erase that slides from the start (titanium’s cut) is left out.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'hatch',
                name: 'The pen hatches it out, then it is lifted off (your leave)',
                see: 'A small pen draws the cyan demolition hatch over the part from left to right in 60 % of the time, then the part is lifted toward the top right and gone; coming back, it is set down and the hatch is taken away by the pen, right to left. 1120 ms.',
                verdict: rec('it is your own leave with the anchor’s pen doing the marking, a drawing’s demolition mark, and no other theme’s.'),
            },
            {
                key: 'untrace',
                name: 'Untraced: the pen runs the outline back',
                see: 'The construction played backwards: the pen returns to the top-start corner, the ink is lifted at once and the pen runs the outline back until it is gone; coming back, it is constructed.',
                verdict: not('it makes arriving, opening and leaving one picture, but it replaces the leave you picked.'),
            },
            {
                key: 'cross',
                name: 'Crossed out: the pen draws two diagonals, then it is lifted off',
                see: 'The pen draws one diagonal across the part, lifts, crosses to the other corner and draws the second, the cross of a part to be removed, in 60 % of the time; then the part is lifted toward the top right and gone. Coming back, the cross is taken away backwards.',
                verdict: not(
                    'it is the clearest sign for removed, but it crosses the words out so the part cannot be read while it goes, and the hatch is your pick.',
                ),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'Does a button inside a header, menu, tile, drawer or key figure behave like blueprint’s own button?',
        why: 'Your header’s actions have a 2 px line on no plate and lift 1 px on hover; the menu’s entries take a 14 % cyan tint; the tile’s Open link only underlines; the key figure as a link hatches. The theme’s own button sets its witness lines on hover, shows the ring on focus and takes the dimension when pressed. This is about consistency, which the pen cannot draw, so the options stay. Use the State buttons to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly blueprint’s own',
                see: 'Every inner button, entry and link: the witness lines on hover, the two-channel ring on focus, the dimension while pressed, the 1 px line, as the button standing alone.',
                verdict: rec(
                    'a control looks and answers the same wherever it is, so you learn it once, and the pen’s readings (the witness lines) are the same everywhere.',
                ),
            },
            {
                key: 'today',
                name: 'As today (your picks)',
                see: 'The header’s actions in a 2 px line, lifting 1 px; the menu’s entries tinted; the tile’s link underlined; the key figure hatched.',
                verdict: not('each fits its composite, but the same button answers five ways.'),
            },
            {
                key: 'quiet',
                name: 'Blueprint’s own, but quiet inside a composite',
                see: 'Inside a composite the line turns cyan on hover without the witness lines; the ring and a grey press stay.',
                verdict: not(
                    'it is calmer, but the witness lines are your approved hover, and they would go missing exactly where most buttons are.',
                ),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question: 'What happens to a part under the pointer?',
        why: 'Your approved hover (gap-4, 2026-09-12): the dimension witness, two amber lines at a control’s ends, “the control becomes a measured length for as long as you are on it”. The tracing pen reads its place by dropping witness lines to a scale and resting a pointer on it. Your picks add a lit grid (the tiles: cyberpunk’s circuit), a dashed ring (a day: forest’s blaze), a tint (the menu), a hatch (the key figure) and a 1 px lift (the header); those are left out here.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'read',
                name: 'Read on a scale: witness lines and a pointer on a ruler under the part',
                see: 'Two amber witness lines at the start and the end of the part, overhanging its top and foot, and under it a short ruler between them with a pointer on each end, the pen’s reading of the part’s length; a button’s line turns cyan. Nothing moves and nothing beside it changes.',
                verdict: rec(
                    'it is your approved witness lines with the anchor’s other half, the pointers on a scale, so the part is not only marked but measured, and no other theme measures what is under the pointer.',
                ),
            },
            {
                key: 'leader',
                name: 'A leader: the pen calls the part out',
                see: 'A short amber leader leaves the part’s top-end corner at 45° and ends in a node, a call-out as on a drawing (your tooltip’s approved leader and node); a button’s line turns cyan. Nothing moves.',
                verdict: not('it points at the part clearly, but a leader is a call-out for a label and a hovered part has none to carry.'),
            },
            {
                key: 'witness',
                name: 'The witness lines alone (your gap-4)',
                see: 'Two amber witness lines at the start and the end of the part, overhanging its top and foot; a button’s line turns cyan. Nothing moves and nothing beside it changes.',
                verdict: not(
                    'it is your approved hover and the same on every part, but it leaves out the pointers, the half of the anchor that reads the length.',
                ),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'DI2',
        question: 'How is the part that has keyboard focus marked?',
        why: 'The package’s two-channel ring (DI2) shows on any ground, and the register sets the witness lines on focus as well. Your header’s, key figure’s and tile link’s picks replace it with one thin outline. This is an accessibility constant across every theme, which the pen cannot draw, so the options stay.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, with the witness lines',
                see: 'The cyan ring with its dark inner channel round the focused part, the witness lines at its ends.',
                verdict: rec(
                    'it is visible on the cyan primary and on the sheet alike, it is the same everywhere, and the witness lines are the anchor’s.',
                ),
            },
            {
                key: 'dashed',
                name: 'One dashed outline (your header’s and tile link’s picks)',
                see: 'A 1 px dashed outline 3 px out.',
                verdict: not('it is drafting-like, but one dashed pixel is easy to miss and it vanishes on the ruled sheet.'),
            },
            {
                key: 'thin',
                name: 'One thin cyan outline (your key figure’s pick)',
                see: 'A 1 px cyan outline 3 px out.',
                verdict: not('it is neat, but one cyan pixel disappears next to the cyan primary.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What happens to a part while it is pressed?',
        why: 'The register presses with the darker ground alone; your header’s pick presses an inset line, your key figure’s scales the plate down 1 %. Hover already sets the witness lines; a drawing completes a measurement by drawing the dimension between them. The dimension line of round one had arrowheads; the pen draws it with slash ticks, as an architect does, and no arrowheads, no hatched fill and no chain line.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'dimension',
                name: 'The pen takes the dimension',
                see: 'While held, a small pen draws an amber dimension line across the part’s foot between its witness lines, a slash tick at each end, from start to end in 2 units, and lifts away; the ground turns the darker step. Nothing moves.',
                verdict: rec(
                    'it finishes what the hover began (witness lines, then the pen takes the dimension), and no other theme draws a dimension.',
                ),
            },
            {
                key: 'datum',
                name: 'The pen pricks the datum',
                see: 'While held, a small pen draws a short amber cross at the part’s centre, across and then down, and lifts away; the ground turns the darker step. Nothing moves.',
                verdict: not('it marks the exact point of the press, but a cross at the centre of a button reads as a target, and nothing measures.'),
            },
            {
                key: 'grey',
                name: 'The darker ground alone (the register’s press)',
                see: 'The ground turns the darker step; nothing is drawn.',
                verdict: not('it is plain, but a press then says nothing a drawing would say.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'Which lettering names things, and which speaks?',
        why: 'The register names in upright mono capitals tracked wide (the microlabel, the toast, the tooltip, the dialog title, the wizard); that is nostromo’s, cyberpunk’s, synthwave’s and titanium’s label voice. The anchor letters its readings as a draughtsman does, capitals sloped 15° (ISO 3098 type B), which no theme does. This is about type, which the pen cannot draw, so the options stay.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'lettering',
                name: 'The draughtsman’s lettering: mono capitals sloped 15°',
                see: 'Labels, table heads, tags and the change in Geist Mono capitals at a 15° slope, barely tracked, as the anchor letters its readings; titles and figures in Instrument Sans 600 upright; prose in Instrument Sans; the timestamp in upright mono.',
                verdict: rec(
                    'it is the anchor’s lettering, as on a drawing, every face has one job, and it is told apart from the dark themes’ upright tape.',
                ),
            },
            {
                key: 'mono',
                name: 'Upright mono capitals tracked wide (the register; the dark themes’ label voice)',
                see: 'Labels, heads and tags in upright Geist Mono capitals, tracked 0.12 em.',
                verdict: not(
                    'it is the register today, but upright tracked mono capitals are nostromo’s, cyberpunk’s, synthwave’s and titanium’s labels.',
                ),
            },
            {
                key: 'sans',
                name: 'The sans in sentence case (near grotesk’s and solstice’s)',
                see: 'Labels and heads in Instrument Sans 600, sentence case.',
                verdict: not('it reads easily, but sentence-case labels are grotesk’s and solstice’s, and the drawing loses its lettering.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Motifs',
        rule: 'G16',
        question: 'Where do blueprint’s motifs (the pen, the witness lines and pointers, brackets, hatch, grid, cloud, flag, compass) appear?',
        why: 'Your picks put a hatch on four plates, a grid on menus, the drawer and the tile’s hover, call three frames a revision cloud, and use amber for picks. The anchor adds the pen: it is shown only while something is drawn, loaded, measured or changed, and parked away otherwise. A drawing gives each mark one meaning. This is about where marks may stand, so the options stay; the recommended one agrees with the anchor.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'The pen only while it draws, parked otherwise; its witness lines and pointers read a place on a scale; brackets where a part stands; millimetre paper under data only; the flag △ for a tone; + and − for a change; the compass circle for the empty state; today in cyan brackets, the pick in cyan; the dashed fold line as the divider.',
                verdict: rec(
                    'each mark says one thing, so a glance reads the drawing, the pen is never furniture, and none of them is another theme’s.',
                ),
            },
            {
                key: 'line',
                name: 'Only the line',
                see: 'No brackets, no paper, no flag, no compass, no pen: thin closed frames, the warning by its word, today in bold.',
                verdict: not(
                    'it is pure, but it throws away the pen’s readings, the brackets, the compass and the flag that make it a drawing, and boxes come back.',
                ),
            },
            {
                key: 'all',
                name: 'On everything (as the picks spread them)',
                see: 'A hatch on every plate, a grid behind it, amber frames on today and the pick, a revision cloud round the warning card, and the pen parked on every plate.',
                verdict: not('it is rich, but the hatch, the grid, the cloud and the pen stop meaning anything when they are everywhere.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="blueprint"]'));
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
lookLine.setAttribute('data-for', 'blueprint');
lookLine.textContent = `${ASPECTS.length} questions, one rule of blueprint each; the first option of every question is the recommendation. Pick the one that is blueprint to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-bw-aspects]'));
const toc = document.querySelector('[data-bw-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'bw-aspect';
    box.id = `bw-${a.id}`;
    box.setAttribute('data-bw-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-bw-${a.id}`);
    box.innerHTML = `<div class="bw-aspect__head">
        <h3 id="h-bw-${a.id}"><span class="bw-aspect__no">${n + 1}</span> ${a.label} <span class="bw-aspect__rule">${a.rule}</span></h3>
        <p class="bw-aspect__q"></p><p class="bw-aspect__why"></p></div><div class="bw-trio" data-bw-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.bw-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.bw-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.bw-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'bw-col';
        col.setAttribute('data-bw-option', String(at + 1));
        col.innerHTML = `<p class="bw-label-row"><span class="bw-label-row__no">${at + 1}</span> <span class="bw-label-row__name"></span>${
            at === 0 ? ' <span class="bw-label-row__rec">Recommended</span>' : ''
        }</p><p class="bw-see"></p><p class="bw-verdict"></p>
        <div class="bw-scene" data-bw-kind="${a.kind}" data-bw-${a.id}="${o.key}" data-bw-phase="${a.kind === 'cycle' ? 'in' : 'hold'}">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.bw-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.bw-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.bw-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('bw-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#bw-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

// The durations row says its own numbers under each part.
const TIMES = { units: [160, 480, 800, 2880], picks: [0, 500, 300, 1500], instant: [0, 0, 0, 0] };
for (const scene of section.querySelectorAll('[data-bw-durations]')) {
    const key = /** @type {keyof typeof TIMES} */ (scene.getAttribute('data-bw-durations'));
    const [contact, part, panel, loop] = TIMES[key];
    const units = (/** @type {number} */ ms) => (key === 'units' ? `, ${ms / 160} ${ms === 160 ? 'unit' : 'units'}` : '');
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-bw-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', key === 'units' ? `contact 160 ms, 1 unit; the dimension 320 ms, 2 units` : `${contact} ms`);
    say('part', `${part} ms${units(part)}`);
    say('panel', `${panel} ms${units(panel)}`);
    say('loop', loop ? `${loop} ms a cycle${units(loop)}` : 'standing still, hatched');
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-bw-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 2000],
    ['hold', 1700],
    ['out', 1300],
]);
const values = ['412', '436', '398', '451'];
const letters = 'BCDEFGH';
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.bw-scene[data-bw-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.bw-scene[data-bw-kind="cycle"] [data-bw-num]')];
const wordsToSwap = [...section.querySelectorAll('.bw-scene[data-bw-kind="cycle"] [data-bw-word]')];
const revs = [...section.querySelectorAll('.bw-scene[data-bw-kind="cycle"] [data-bw-rev]')];
const readers = [...section.querySelectorAll('.bw-scene[data-bw-kind="cycle"] .bw-cloud')];
/** Where on its ruler the reading stood and stands (0 to 1): the pointer slides from one to the next. */
const reads = [0.18, 0.72, 0.42, 0.9, 0.3, 0.6];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-bw-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/ held$/.test(text)) num.textContent = tick % 2 ? '5 held' : '4 held';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of wordsToSwap) word.textContent = tick % 2 ? 'Held' : 'Issued';
    for (const rev of revs) rev.textContent = `△${letters[tick % letters.length]}`;
    readers.forEach((reader, i) => {
        reader.style.setProperty('--bw-from', String(reads[(tick + i) % reads.length]));
        reader.style.setProperty('--bw-to', String(reads[(tick + i + 1) % reads.length]));
    });
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.bw-part') || scene;
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.bw-part') || scene;
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
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-bw-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-bw-phase'] });

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
radio('data-bw-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--bw-slow', String(slow));
    run(0);
});
radio('data-bw-state', (value) => {
    section.setAttribute('data-bw-show', value);
});
document.querySelector('[data-bw-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.bw-scene a, .bw-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided blueprint components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=blueprint`, only its
// combination of the decided picks), loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-bw-gallery]'));
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
