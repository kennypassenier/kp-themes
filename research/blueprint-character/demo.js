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

/* ----------------------------------------------------------- the parts */

/** The four corner brackets a part stands in (G7, scope-18). */
const FRAME = `<span class="bw-frame" aria-hidden="true"></span>`;
/** The construction line the pen traces round a part before it is inked (G2, G3). */
const TRACE = `<span class="bw-trace" aria-hidden="true"></span>`;
/** The two amber witness lines at a part's ends, under the hand (G8, gap-4). */
const WIT = `<span class="bw-wit" aria-hidden="true"></span>`;
/** The amber dimension a press draws between the witness lines (G14). */
const DIM = `<span class="bw-dim" aria-hidden="true"></span>`;
/** The demolition hatch a leaving part is hatched out with (G12). */
const HATCH = `<span class="bw-x" aria-hidden="true"></span>`;
/** The revision cloud and its letter, drawn round a changed value (G9). */
const CLOUD = `<span class="bw-cloud" aria-hidden="true"><span class="bw-cloud__rev" data-bw-rev>△B</span></span>`;

/** A package button with its label span; `press` adds the dimension it draws when held. */
const button = (label, modifier = '', extra = '', press = false) =>
    `<button type="button" class="kp-button ${modifier}" ${extra}><span class="kp-button__label">${label}</span>${press ? DIM : ''}</button>`;

/** The flag note a tone is marked with (G13); options.css shows it where the option asks. */
const flag = (kind, word) => `<span class="bw-flag" data-bw-kind="${kind}"><span class="bw-flag__mark" aria-hidden="true"></span>${word}</span>`;

/**
 * The place a waiting reading will stand (G10), with every loading picture an
 * option may draw in it: the section (`.bw-section`: two rules, two ticks, the
 * hatch), the pen running along the foot (`.bw-run`) and the marching outline
 * (`.bw-ants`). options.css shows one.
 */
const wait = (kind, i = 0) =>
    `<span class="bw-wait bw-wait--${kind}" style="--i: ${i}" aria-hidden="true"><span class="bw-section"></span><span class="bw-run"></span><span class="bw-ants"></span></span>`;

/** The change, set in the lettering with its sign (G13, the columns' tolerance). */
const change = (text, dir = 'up') => `<span class="bw-change" data-bw-dir="${dir}">${dir === 'up' ? '+' : '−'}${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter bw-meter" role="meter" aria-label="Load on the beam, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A plotted line on the millimetre paper. */
const plot = (cls = '', extra = '') => `<div class="bw-plot ${cls}" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="bw-plot__line" points="0,36 20,30 40,32 60,20 80,24 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/></svg>${extra}</div>`;

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
    menu: () => `<div class="bw-menu-wrap">
        ${button('Sheet ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="bw-pop-wrap"><div class="kp-popover bw-pop bw-float bw-opens">${TRACE}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the drawing</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Issue a revision…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Void the sheet</button></li>
        </ul></div></div>
    </div>`,
    dialog: () => `<div class="kp-dialog bw-dialog bw-float bw-opens" role="group" aria-label="A dialog opening">${TRACE}
        <p class="kp-dialog__title bw-title">Issue revision C?</p>
        <p class="kp-dialog__description">Sheet A-201 goes to the site as revision C.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Issue it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
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
    cell('A line in time is plotted', plot('bw-plot--paper bw-plot--draws'));

const OPENING = () => cell('A menu opens from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

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
    cell(
        'Key figures, one revised',
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
    cell('A plot of data', `<div class="bw-plate bw-plot-plate">${FRAME}${plot('bw-plot--paper')}</div>`) +
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
            `<div class="kp-kpis bw-kpi-row">${PART.kpi('Sheets issued', '412', change('6 %'))}<div class="kp-kpi bw-plate bw-kpi bw-toned" data-bw-kind="warn">${FRAME}<span class="kp-kpi__label bw-label">Days late</span><span class="bw-toned__line">${flag(
                'warn',
                'Check',
            )}<span class="kp-kpi__value bw-figure bw-toned__figure">14</span></span><span class="kp-kpi__trend">${change('9', 'up')} <span class="bw-faint">on last week</span></span></div></div>`,
            'bw-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card bw-plate bw-tile bw-toned" data-bw-kind="bad">${FRAME}<p class="kp-card__title bw-title bw-toned__line">${flag(
                    'bad',
                    'Failed',
                )}<span class="bw-toned__figure">S-110</span></p><p class="kp-card__body">No plot since 16:40</p></div>`,
            ) +
            cell(
                'A failed state',
                `<div class="bw-plate bw-state-plate bw-toned" data-bw-kind="bad">${FRAME}<span class="bw-toned__line">${flag('bad', 'Failed')}${PART.state(
                    'Not plotted',
                    'bad',
                )}</span></div>`,
            ) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive bw-toned" data-bw-kind="bad"><span class="bw-toned__line">${flag('bad', '')}<span class="bw-toned__figure">Void the sheet</span></span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="bw-plate bw-meter-plate bw-toned" data-bw-kind="warn">${FRAME}<span class="bw-cap bw-toned__line">${flag(
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
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-in-entry">${WIT}${DIM}Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Issue a revision…</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><a class="kp-button kp-button--ghost kp-button--sm bw-tile-link" href="#bw-intro"><span class="kp-button__label">Open</span>${DIM}</a></div>`,
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
        `<div class="kp-kpis"><a class="kp-kpi bw-plate bw-kpi bw-in-kpi" href="#bw-intro">${FRAME}${WIT}${DIM}<span class="kp-kpi__label bw-label">Sheets issued</span><span class="kp-kpi__value bw-figure">412</span><span class="kp-kpi__trend bw-faint">since Monday</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="bw-row">${button('Plot the sheet', 'bw-pointed')}${button('Issue sheet', 'kp-button--primary')}</div>`) +
    cell(
        'Menu entries, the first pointed at',
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-pointed">${WIT}Open the drawing</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${WIT}Issue a revision…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">${WIT}Rename</button></li></ul></div>`,
    ) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card bw-plate bw-tile">${FRAME}<p class="kp-card__title bw-title">Sheet A-201</p><p class="kp-card__body">Ground floor plan · rev C</p><a class="kp-button kp-button--ghost kp-button--sm bw-tile-link bw-pointed" href="#bw-intro"><span class="kp-button__label">Open</span></a></div>`,
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
        `<div class="kp-popover bw-pop bw-pop--static bw-float"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item bw-press">${WIT}${DIM}Issue a revision…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="bw-days"><span class="bw-day bw-press">${FRAME}${WIT}${DIM}<span class="bw-day__num">14</span></span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle bw-plate bw-kpi bw-press" aria-pressed="false">${FRAME}${WIT}${DIM}<span class="kp-kpi__label bw-label">Held sheets</span><span class="kp-kpi__value bw-figure">4</span></button></div>`,
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
    cell('A plot of data', `<div class="bw-plate bw-plot-plate">${FRAME}${plot('bw-plot--paper')}</div>`) +
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
        'A divider between two sections',
        `<p class="bw-cap">Architecture</p><div class="bw-divider" data-kp-divider></div><p class="bw-cap">Structure</p>`,
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
        question: 'How does blueprint’s pen move: with the plotter’s ramp, at a plain even pace, or in hard steps?',
        why: 'A theme exists to be distinct (your rule of 03:37). Blueprint’s register moves on linear, and twenty-two of your picks do too; but linear is now grotesk’s even pace (with its station-clock dwell) and high-contrast’s register. A pen plotter does not start at full speed: its stepper motor ramps up, feeds the pen at one speed, and ramps down at the end of every stroke. No theme moves like that yet.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'feed',
                name: 'The plotter’s feed: a short ramp, a long even feed, a short ramp',
                see: 'Every stroke starts softly, runs at one speed for most of its length and stops softly: the week is constructed day by day (each side of each day its own stroke), the menu is drawn, the tile is drawn, the cloud is drawn round the changed figure. The loop hatches, stands, and goes again.',
                verdict: rec(
                    'it is how a pen plotter actually moves, it keeps the even line of your linear picks without their hard start and stop, and no other theme ramps around an even feed.',
                ),
            },
            {
                key: 'linear',
                name: 'A plain even pace, a dead stop (your picks; grotesk’s and high-contrast’s)',
                see: 'Everything moves at one speed from the first frame to the last and stops dead.',
                verdict: not('it is your register’s curve, but grotesk now uses the even pace and high-contrast’s register is linear too.'),
            },
            {
                key: 'steps',
                name: 'Hard steps (your Plotted and Lettered; near terminal’s, nostromo’s, cyberpunk’s)',
                see: 'Every stroke moves in four hard jumps.',
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
        question: 'When a part arrives on the sheet, how is it drawn?',
        why: 'Eleven of your arrival picks uncover the part from the start with a moving edge (the calendar’s Plotted, the tiles’ and the trend’s Drafted, the meter, the toast): that is exactly titanium’s feed and formal’s ledger pen. Your signature already draws differently in two places: the tooltip draws its leader line first, the dialog its top edge first. A draughtsman constructs a part before he inks it.',
        kind: 'cycle',
        scene: ARRIVAL,
        options: [
            {
                key: 'construct',
                name: 'Constructed, then drawn',
                see: 'The pen traces each part’s outline as a thin cyan construction line, round from its top-left corner; when the line closes, the part is inked at once (its words, figures and corner brackets) and the construction line is lifted. The days, the rows and the columns one after another; the line in time is plotted along itself.',
                verdict: rec(
                    'it is the drawing office itself, it grows out of your tooltip and dialog, and no other theme draws a part’s outline before the part.',
                ),
            },
            {
                key: 'uncover',
                name: 'Uncovered from the start (your picks; titanium’s feed)',
                see: 'Each part is uncovered from left to right by a moving edge, at an even pace.',
                verdict: not('it is your pick eleven times, but a sliding edge is titanium’s arrival and formal’s ledger pen.'),
            },
            {
                key: 'rise',
                name: 'Risen in steps (your busy panel’s Plotted; near solstice’s and synthwave’s rise)',
                see: 'Each part rises 0.8 rem into place in four hard steps.',
                verdict: not('it is plotted, but rising is solstice’s and synthwave’s, and a drawing does not move on the sheet.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening a menu or a dialog',
        rule: 'G3',
        question: 'How does a menu, a popover or the dialog open?',
        why: 'Your menus and the header’s menu are Drafted: cut open from the top edge down, which is titanium’s opening exactly; your drawer unrolls from the tube; your dialog draws its top edge first and then the sheet. The recommendation draws every panel the way a part arrives, so opening and arriving are one picture.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'draw',
                name: 'Drawn: traced from its corner, then inked',
                see: 'The pen traces the panel’s outline from the corner at its button (along the top, down, back along the foot, up), then the panel is inked at once; 800 ms. Closing is the same played backwards: the ink lifted at once, then the outline run back to the corner at its button.',
                verdict: rec(
                    'it is one picture with the arrival, it keeps your dialog’s first stroke along the top, and it is no other theme’s opening.',
                ),
            },
            {
                key: 'top',
                name: 'Drafted from the top (your menus’ pick; titanium’s cut)',
                see: 'The panel is cut open from its top edge down, at an even pace, 300 ms.',
                verdict: not('it is your pick, but a top-down cut is titanium’s opening to the letter.'),
            },
            {
                key: 'unroll',
                name: 'Unrolled from the tube (your drawer’s pick, everywhere)',
                see: 'The panel unrolls from a thin roll at its left edge to its full width, slowing as it lands, 300 ms; closing rolls it back up the same way.',
                verdict: not('it is a lovely drawing-office image, but the panel is squashed while it unrolls, and nothing is drawn.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does each kind of motion take?',
        why: 'Your picks run one-shots at sixteen durations (160 ms to 1.4 s) and loops at nine (0.7 to 3 s, the chart’s grid 6 s there and back). The register’s own contact time is 160 ms; counting everything in that unit gives the theme one rhythm.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'units',
                name: 'Counted in units of 160 ms',
                see: 'Contact 160 ms and the press’s dimension 320 ms; a part constructed in 480; a panel in 800; a revision 960; the leave 1120; a loop 2880. The numbers under each part say which.',
                verdict: rec('one unit makes every motion belong together, and the set is no other theme’s.'),
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
                verdict: not('it is the quietest, but the drawing you see being made is the theme.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What do cyan and amber each mean?',
        why: 'The anatomy: cyan is the drawing line, amber is for annotation, "where a drawing would use a red pencil". Your picks also use amber for the picked day, the current step and the tooltip’s frame, and the warning colour has amber’s very hue, so a note, a pick and a warning can look the same.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'pen',
                name: 'Cyan draws, amber annotates',
                see: 'Cyan for what is drawn and what you do (the primary action, the picked day, a link); white ink for words; steel blue for finished lines and brackets; amber only for notes: the witness lines under the hand, the revision cloud on the changed figure, the meter’s leader. The warning is told by its △ and its word.',
                verdict: rec('each colour has one job, as on a real drawing, and amber stays a note instead of a highlight.'),
            },
            {
                key: 'cyan',
                name: 'Cyan only',
                see: 'Amber is gone: the witness lines, the cloud and the meter’s leader are cyan too.',
                verdict: not('it is calm, but the checker’s notes and the drawing become one, and you lose the anatomy’s red pencil.'),
            },
            {
                key: 'amber',
                name: 'Amber as the main line (near solstice’s amber and deco’s gold)',
                see: 'The primary action, the picked day, the brackets and the link in amber; cyan only for the plotted line.',
                verdict: not('it is warm, but amber that acts is solstice’s, gold on dark blue is deco’s, and the warning disappears in it.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What does a plate (card, key figure, tile, the plot, a state) look like?',
        why: 'Four of your shape picks hatch the whole plate (the section view: busy, header, key figure, tiles), four lay a grid on it (the chart recorder: menu, drawer, trend, chart), and the register frames every card in a closed box. The anatomy says this theme may not draw a closed frame around content, and names the corner bracket (your measurement frame, scope-18) as its instrument. A hatched plate is also what cyberpunk’s holo card is: scan lines at 135° on every plate.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'measured',
                name: 'A measured part on the sheet: four corner brackets',
                see: 'No fill and no closed frame: the ruled sheet shows through, and four corner brackets say where the plate stands (your measurement frame and laurels). The plot stands on millimetre paper; the menu, which floats, keeps one thin frame and no shadow.',
                verdict: rec('it is your own instrument, it keeps the anatomy’s rule against boxes, and it leaves the hatch free to mean a section.'),
            },
            {
                key: 'section',
                name: 'The section view (your picks four times; near cyberpunk’s scan lines)',
                see: 'Every plate hatched at 45° inside a dashed frame.',
                verdict: not('it is your pick, but hatched plates on a dark blue ground read as cyberpunk’s scan-lined holo cards.'),
            },
            {
                key: 'paper',
                name: 'Millimetre paper on every plate (near synthwave’s grid console)',
                see: 'Every plate ruled with a fine grid inside a thin frame.',
                verdict: not(
                    'it is technical, but a grid on every plate is synthwave’s approved shape, and the data’s own paper no longer stands out.',
                ),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How is a warning or a failure shown?',
        why: 'Your tone picks draw six different things: a frame all round in the tone (key figure, trend: nostromo’s klaxon), the figure on the tone’s plate (high-contrast’s), a hatch in the tone (the menu: near brutalism’s hazard tape), a dashed border (the busy failure), a toned frame (the state), and the calendar’s △ and ▲, the flag notes of a drawing.',
        kind: 'still',
        scene: TONE,
        options: [
            {
                key: 'flag',
                name: 'Flagged: △ or ▲ and the word',
                see: 'A drafting flag before the title or figure, an outlined △ for a warning and a filled ▲ for a failure, in the tone’s light ink, the word in the lettering after it (CHECK, FAILED), and the plate’s corner brackets in the tone. Nothing is framed, filled or hatched.',
                verdict: rec('it is your calendar’s own mark, it says the tone in shape and word as well as colour, and no other theme flags.'),
            },
            {
                key: 'frame',
                name: 'Framed all round (your key figure and trend; nostromo’s klaxon)',
                see: 'A 2 px frame all round in the tone, the figure on the tone’s plate.',
                verdict: not('it is loud, but a frame all round is nostromo’s klaxon and a closed box the anatomy forbids.'),
            },
            {
                key: 'hatch',
                name: 'Hatched in its colour (your menu; near brutalism’s hazard tape)',
                see: 'The part hatched at 45° in the tone inside a dashed tone border.',
                verdict: not(
                    'it is a section in red, but diagonal stripes in a warning colour are brutalism’s tape, and the hatch would mean two things.',
                ),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a value changes in place?',
        why: 'Your live picks draw five things: the figure flips (the columns: grotesk’s flap board), rises from below (the key figure: solstice’s rise), a ring that swells and shrinks round the tile (the tiles; it never played until 2026-10-07), a swell (the state: dark’s and light’s), and nothing at all (trend, chart: formal’s). Your graph’s pick is Revised, an amber mark on what changed; on a drawing a change is marked with a revision cloud and its letter.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'revise',
                name: 'Revised: the amber cloud and its letter',
                see: 'The new value is written at once; the checker’s amber cloud is drawn round it, clockwise, with △B (then △C …) at its corner; it stands, then is lifted. 960 ms, once. Nothing moves.',
                verdict: rec(
                    'it is how a drawing marks a change, it is your graph’s Revised carried to every value, and the value stays readable the whole time.',
                ),
            },
            {
                key: 'retrace',
                name: 'Retraced in ink (your key figure; near solstice’s rise)',
                see: 'The new value rises into place from a little below, at an even pace.',
                verdict: not('it is your pick, but a value rising into its line is solstice’s live update.'),
            },
            {
                key: 'turn',
                name: 'Turned over (your columns’ pick)',
                see: 'The value flips about its middle and shows the new one.',
                verdict: not('it is lively, but a flipping figure is grotesk’s departure board, and the value cannot be read mid-flip.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does a part look like while its reading is on its way?',
        why: 'Your picks draw nine loading pictures (a cell stepping, a marching outline, the grid breathing, a scan, a dimension line, a pen, a plotter, dashes, a recorder); six run along the foot, which is forest’s, solstice’s and nostromo’s loading, and the marching outline is high-contrast’s. Your signature skeleton is blueprint’s own: a section hatched between two dimension ticks.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'section',
                name: 'A section being hatched (your skeleton, everywhere)',
                see: 'Where the reading will stand, a section between two ticks; the pen hatches it from left to right, it stands, and it is lifted, then hatched again (2.9 s). Several sections a moment apart. Labels stay readable above it; the compass and the chain line stay as approved.',
                verdict: rec(
                    'it is your approved skeleton carried to every waiting part, it says “material goes here”, and no other theme waits like it.',
                ),
            },
            {
                key: 'run',
                name: 'The pen runs along the foot (your picks; forest’s, solstice’s and nostromo’s way)',
                see: 'A short cyan pen line runs along the foot of each waiting part, again and again.',
                verdict: not('it is your pick five times, but something running along the foot is how forest, solstice and nostromo wait.'),
            },
            {
                key: 'ants',
                name: 'A marching outline (your calendar’s pick; high-contrast’s tape)',
                see: 'A dashed cyan outline marches round each waiting part.',
                verdict: not('it is busy and clear, but a dashed outline running round the part is high-contrast’s approved loading.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the sheet, and come back?',
        why: 'Your leave (2026-10-04): hatched out like a wall marked for demolition, then lifted off the sheet; what arrives plays it backwards (your reverse-close). The recommendation keeps it and puts it on the plotter’s feed in 1120 ms.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'hatch',
                name: 'Hatched out and lifted off (your leave)',
                see: 'A cyan hatch is drawn over the part from left to right, then the part is lifted toward the top right and gone; coming back, it is set down and its hatch is taken away right to left. 1120 ms.',
                verdict: rec('it is your own leave, a drawing’s demolition mark, and no other theme’s.'),
            },
            {
                key: 'untrace',
                name: 'Untraced (the construction backwards)',
                see: 'The construction played backwards: the ink is lifted at once and the construction line runs back round the part until it is gone; coming back, it is constructed.',
                verdict: not('it makes arriving, opening and leaving one picture, but it replaces the leave you picked.'),
            },
            {
                key: 'erase',
                name: 'Erased from the start (your round-six option; near titanium’s cut)',
                see: 'The part is rubbed out from left to right at an even pace; coming back, it is drawn in the other way.',
                verdict: not('it is plain, but a sliding edge across the part is titanium’s cut.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question: 'Does a button inside a header, menu, tile, drawer or key figure behave like blueprint’s own button?',
        why: 'Your header’s actions have a 2 px line on no plate and lift 1 px on hover; the menu’s entries take a 14 % cyan tint; the tile’s Open link only underlines; the key figure as a link hatches. The theme’s own button sets its witness lines on hover, shows the ring on focus and takes the dimension when pressed. Use the State buttons to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly blueprint’s own',
                see: 'Every inner button, entry and link: the witness lines on hover, the two-channel ring on focus, the dimension while pressed, the 1 px line, as the button standing alone.',
                verdict: rec('a control looks and answers the same wherever it is, so you learn it once.'),
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
        why: 'Your approved hover (gap-4, 2026-09-12): the dimension witness, two amber lines at a control’s ends, “the control becomes a measured length for as long as you are on it”. Your picks add a lit grid (the tiles: cyberpunk’s circuit), a dashed ring (a day: forest’s blaze), a tint (the menu), a hatch (the key figure) and a 1 px lift (the header).',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'witness',
                name: 'The witness lines (your gap-4)',
                see: 'Two amber witness lines at the start and the end of the part, overhanging its top and foot; a button’s line turns cyan. Nothing moves and nothing beside it changes.',
                verdict: rec('it is your approved hover, the same on every part, and no other theme marks a part’s two ends.'),
            },
            {
                key: 'grid',
                name: 'The grid lights (your tiles’ pick; cyberpunk’s circuit)',
                see: 'A fine grid lights on the part under the pointer.',
                verdict: not('it is technical, but a grid lit under the pointer is cyberpunk’s circuit.'),
            },
            {
                key: 'ring',
                name: 'A dashed ring (your calendar’s pick; forest’s blaze)',
                see: 'A dashed ring inside the part’s edge.',
                verdict: not('it is drafting-like, but a dashed ring under the pointer is forest’s trail blaze.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'DI2',
        question: 'How is the part that has keyboard focus marked?',
        why: 'The package’s two-channel ring (DI2) shows on any ground, and the register sets the witness lines on focus as well. Your header’s, key figure’s and tile link’s picks replace it with one thin outline.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'ring',
                name: 'The two-channel ring, with the witness lines',
                see: 'The cyan ring with its dark inner channel round the focused part, the witness lines at its ends.',
                verdict: rec('it is visible on the cyan primary and on the sheet alike, and it is the same everywhere.'),
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
        why: 'The register presses with the darker ground alone; your header’s pick presses an inset line, your key figure’s scales the plate down 1 %. Hover already sets the witness lines; a drawing completes a measurement by drawing the dimension between them.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'dimension',
                name: 'The dimension is taken',
                see: 'While held, an amber dimension line with an arrowhead at each end is drawn across the part’s foot between its witness lines; the ground turns the darker step. Nothing moves.',
                verdict: rec('it finishes what the hover began (witness lines, then the dimension), and no other theme draws a dimension.'),
            },
            {
                key: 'grey',
                name: 'The darker ground alone (the register’s press)',
                see: 'The ground turns the darker step; nothing is drawn.',
                verdict: not('it is plain, but a press then says nothing a drawing would say.'),
            },
            {
                key: 'inset',
                name: 'The line pressed in (your header’s pick)',
                see: 'A 2 px line pressed inside the part’s edge while held.',
                verdict: not('it is your pick, but a thicker inner edge reads as a frame, which the anatomy keeps out.'),
            },
        ],
    },
    {
        id: 'voice',
        label: 'The voice',
        rule: 'G15',
        question: 'Which lettering names things, and which speaks?',
        why: 'The register names in upright mono capitals tracked wide (the microlabel, the toast, the tooltip, the dialog title, the wizard); that is nostromo’s, cyberpunk’s, synthwave’s and titanium’s label voice. A draughtsman letters in capitals sloped 15° (ISO 3098 type B), which no theme does.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'lettering',
                name: 'The draughtsman’s lettering: mono capitals sloped 15°',
                see: 'Labels, table heads, tags and the change in Geist Mono capitals at a 15° slope, barely tracked; titles and figures in Instrument Sans 600 upright; prose in Instrument Sans; the timestamp in upright mono.',
                verdict: rec(
                    'it is technical lettering as on a drawing, every face has one job, and it is told apart from the dark themes’ upright tape.',
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
        question: 'Where do blueprint’s motifs (brackets, hatch, grid, cloud, flag, compass) appear?',
        why: 'Your picks put a hatch on four plates, a grid on menus, the drawer and the tile’s hover, call three frames a revision cloud, and use amber for picks. A drawing gives each mark one meaning.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'one',
                name: 'Every motif means one thing',
                see: 'Brackets where a part stands; millimetre paper under data only; the flag △ for a tone; + and − for a change; the compass circle for the empty state; today in cyan brackets, the pick in cyan; the dashed fold line as the divider.',
                verdict: rec('each mark says one thing, so a glance reads the drawing, and none of them is another theme’s.'),
            },
            {
                key: 'line',
                name: 'Only the line',
                see: 'No brackets, no paper, no flag, no compass: thin closed frames, the warning by its word, today in bold.',
                verdict: not('it is pure, but it throws away the brackets, the compass and the flag that make it a drawing, and boxes come back.'),
            },
            {
                key: 'all',
                name: 'On everything (as the picks spread them)',
                see: 'A hatch on every plate, a grid behind it, amber frames on today and the pick, a revision cloud round the warning card.',
                verdict: not('it is rich, but the hatch, the grid and the cloud stop meaning anything when they are everywhere.'),
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
