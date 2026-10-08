// What makes deco deco (Kenny, 2026-10-08): the anchor is the fan that opens,
// and the progress bar is to be redone. Nineteen questions turn that anchor
// into rules for every other component.
//
// A review-kit demo in aspect mode, deco only. aspects.js holds the nineteen
// questions as data (the designer's text, used verbatim); this file gives each
// its scene (a small dashboard of the package's own parts in deco) and builds
// the rows. Each OPTION is one attribute on the scene's wrapper
// (`data-dc-<aspect>="<key>"`) that options.css reads; the recommended option
// is always first. The page's one clock (below) plays every scene that opens,
// arrives, updates or leaves, so the rule is seen in action. The network graph
// is in no scene: it changes in no theme (Kenny, 2026-10-07 02:54).
import { ASPECTS, STORY, TITLE, LABEL, THEME } from './aspects.js';

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The one wrapper a part that arrives stands in: the clock's animation runs on it (the fan, the pleats, the pass), the part inside stays still. */
const fx = (html, cls = '', extra = '') => `<div class="dc-fx ${cls}" ${extra}>${html}</div>`;

/** A crest: twelve gold rays folded to a point at its foot. */
const crest = (cls = '') => `<span class="dc-crest ${cls}" aria-hidden="true"></span>`;

/** The change on a lozenge-ended tag, in its tone's plate and ink. */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta dc-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter dc-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const barBody =
    '<span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>';
/** The package's progress bar: a share (0 to 1) or busy. */
const bar = (share = null, size = '', label = 'Export') =>
    share === null
        ? `<div class="kp-progressbar dc-bar ${size}" role="progressbar" aria-label="${label}, busy" data-kp-indeterminate>${barBody}</div>`
        : `<div class="kp-progressbar dc-bar ${size}" role="progressbar" aria-label="${label}, ${Math.round(share * 100)} %" aria-valuenow="${Math.round(
              share * 100,
          )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${share}">${barBody}</div>`;

const spin = (size = 1.5, label = 'Working…') =>
    `<span class="kp-spinner dc-spin" role="status" aria-label="${label}" style="--kp-spinner-size: ${size}rem"></span>`;

const dayRow = (nums, cls = '') =>
    `<div class="dc-days ${cls}" aria-hidden="true">${nums.map((n) => `<span class="dc-day">${n}</span>`).join('')}</div>`;

const PART = {
    /** A dialog: its crest stands over its top edge and opens first, the panel follows in pleats. */
    dialog: () =>
        fx(
            `${crest('dc-crest--dialog')}<div class="kp-dialog dc-dialog"><p class="kp-dialog__title dc-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div></div>`,
            'dc-fx--dialog',
            'role="group" aria-label="A dialog opening"',
        ),
    menu: () => `<div class="dc-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${fx(
            `<div class="kp-popover dc-pop"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'dc-fx--pop',
        )}
    </div>`,
    toast: () => fx(`<div class="kp-toast dc-toast" role="status"><span class="kp-toast__body">Export saved at 02:00.</span></div>`, 'dc-fx--toast'),
    tooltip: () => `<div class="dc-tip-wrap">${fx(`<div class="kp-tooltip dc-tip" role="tooltip">14:00 · 412 m³/h</div>`, 'dc-fx--tip')}</div>`,
    tilePlain: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') =>
        `<div class="kp-card dc-tile"><p class="kp-card__title dc-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => fx(PART.tilePlain(label, body), 'dc-fx--tile'),
    kpi: (label = 'Flow now', value = '412', foot = note('6 %')) => `<div class="kp-kpi dc-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value dc-carrier" data-dc-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    /** The probes of question 1: a fan of twelve rays on this option's curve, and one on an even sweep beside it. */
    fans: () => `<div class="dc-fans" aria-hidden="true">
        <span class="dc-fans__ground">${fx(crest('dc-crest--probe'), 'dc-fx--probe')}</span>
        <span class="dc-fans__ground">${fx(crest('dc-crest--probe'), 'dc-fx--probe dc-fx--ref')}</span>
        <span class="dc-fans__name">this curve</span><span class="dc-fans__name">an even sweep</span>
    </div>`,
    /** Days of a month: `--i` is a day's rank from the centre (the group opens from there). */
    days: (n = 7, from = 12) => {
        const mid = (n - 1) / 2;
        return `<div class="dc-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => fx(`<span class="dc-day">${from + i}</span>`, 'dc-fx--day', `style="--i: ${Math.round(Math.abs(i - mid))}"`))
            .join('')}</div>`;
    },
    chip: (word = 'Running') =>
        `<span class="dc-state"><span class="dc-state__dot dc-carrier" aria-hidden="true"></span><span class="dc-state__word dc-carrier" data-dc-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.', tone = '') =>
        `<div class="kp-alert ${tone}" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: (cls = '') => `<span class="dc-spark ${cls}" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="dc-column"><span class="kp-kpi__label">${label}</span><span class="dc-column__num dc-carrier" data-dc-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="dc-skel" aria-hidden="true"><span class="kp-skeleton"></span><span class="kp-skeleton"></span><span class="kp-skeleton"></span></div>`,
    field: () =>
        `<label class="kp-field dc-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover dc-pop dc-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' dc-pointed' : ''}">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
    switchOn: () =>
        `<label class="kp-switch dc-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked /><span>Alerts on</span></label>`,
};
const caption = (text) => `<p class="dc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="dc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** Question 1: every part fans open from its own base for the same time; only the curve differs. */
const MOVING = () =>
    cell('A fan of twelve rays on this curve, beside one on an even sweep', PART.fans(), 'dc-part--wide') +
    cell('A dialog fans open from its crest', PART.dialog()) +
    cell('A menu fans open from its button', PART.menu()) +
    cell('A tile fans open from its base', PART.tile());

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'dc-part--wide') +
    cell('A tile arrives', PART.tile()) +
    cell('The trend’s line is drawn', fx(PART.spark(), 'dc-fx--line'));

const OPENING = () =>
    cell('A menu opens from its button', PART.menu()) +
    cell('A dialog opens', PART.dialog()) +
    cell('A toast appears', PART.toast()) +
    cell('A tooltip appears', PART.tooltip());

const DURATION = () =>
    cell('Contact: a press', `<div class="dc-row">${button('Export readings', 'dc-tap')}</div><p class="dc-readout" data-dc-readout="contact"></p>`) +
    cell(
        'A fan of twelve rays',
        `<div class="dc-fans dc-fans--one" aria-hidden="true"><span class="dc-fans__ground">${fx(crest('dc-crest--probe'), 'dc-fx--probe')}</span></div><p class="dc-readout" data-dc-readout="fan"></p>`,
    ) +
    cell('A plate behind its fan', PART.dialog() + '<p class="dc-readout" data-dc-readout="plate"></p>') +
    cell('A group, from the centre out', PART.days(5, 12) + '<p class="dc-readout" data-dc-readout="group"></p>') +
    cell('A loop: the spinner’s fan', `<div class="dc-row">${spin(2.5)}</div><p class="dc-readout" data-dc-readout="loop"></p>`);

const COLOUR = () =>
    cell('A card under its double rule', PART.tilePlain('Reservoir North', 'Level 71 %')) +
    cell(
        'A switch, the head of a share, the picked day',
        `<div class="dc-colours">${PART.switchOn()}${bar(0.62, '', 'Export')}<div class="dc-days dc-days--today">${[12, 13, 14, 15]
            .map((d) => `<span class="dc-day${d === 14 ? ' dc-today' : ''}${d === 13 ? ' dc-picked' : ''}">${d}</span>`)
            .join('')}</div></div>`,
    ) +
    cell(
        'Buttons and the rule that divides',
        `<div class="dc-row">${button('Export')}${button('Add', 'kp-button--primary')}</div><hr data-kp-divider class="dc-divider" />`,
    ) +
    cell(
        'Key figures with a tone',
        `<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %'))}${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad')).replace('class="kp-kpi dc-kpi"', 'class="kp-kpi dc-kpi dc-kpi--fail" data-kp-tone="destructive"')}</div>`,
    ) +
    cell('A failed export', PART.alert('Export failed: the pump house did not answer.', 'kp-alert--destructive'));

const CORNERS = () =>
    cell('Card', PART.tilePlain('Reservoir North', 'Level 71 %')) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="dc-row">${button('Export')}<span class="kp-badge dc-tag">12 new</span><span class="kp-tag dc-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip dc-tip dc-tip--still" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell('A progress bar’s head', bar(0.62, '', 'Export'));

const SURFACE = () =>
    cell(
        'A dialog’s title and a header',
        `<div class="dc-surface-head">${crest('dc-crest--head')}<p class="dc-title dc-surface-head__title">Pump houses</p><p class="dc-cap">Fifteen on the northern network</p></div>`,
    ) +
    cell('A key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell('A trend tile', `<div class="kp-card dc-tile dc-trend"><p class="kp-card__title dc-title">Flow, 24 h</p>${PART.spark()}</div>`) +
    cell(
        'A menu with its headings',
        `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="presentation" class="dc-menu-head">Stations</li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">North 4</button></li><li role="presentation" class="dc-menu-head">Reservoirs</li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Reservoir North</button></li></ul></div>`,
    ) +
    cell('The state word', `<div class="dc-state-plate">${PART.chip('Running')}</div>`);

const WARNING = () =>
    cell(
        'A warning key figure',
        `<div class="kp-kpis">${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad')).replace('class="kp-kpi dc-kpi"', 'class="kp-kpi dc-kpi dc-kpi--warn" data-kp-tone="warning"')}</div>`,
    ) +
    cell(
        'A failed trend tile',
        `<div class="kp-card dc-tile dc-trend dc-trend--fail"><p class="kp-card__title dc-title">Flow, 24 h</p>${PART.spark()}<p class="kp-card__body">${note('Failed', 'down', 'bad')} last reading 07:12</p></div>`,
    ) +
    cell(
        'A destructive menu entry',
        `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li></ul></div>`,
    ) +
    cell('A warning alert', PART.alert('Pressure is below 1.2 bar.', 'kp-alert--warning'));

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', `<span class="dc-carrier dc-carrier--line">${PART.spark()}</span>`) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card dc-tile dc-live-tile"><p class="kp-card__title dc-title">Pump house 2</p><p class="kp-card__body"><span class="dc-carrier" data-dc-num>4.2 bar</span></p></div>`,
    );

/** A surface that waits: its picture is drawn by the option. */
const waits = (html, cls = '') => `<div class="dc-waits ${cls}" aria-busy="true">${html}<span class="dc-wait" aria-hidden="true"></span></div>`;
const LOADERS = () =>
    cell(
        'A tile',
        waits(`<div class="kp-card dc-tile"><p class="kp-card__title dc-title">Pump house 3</p><p class="kp-card__body">Reading…</p></div>`),
    ) +
    cell(
        'A panel',
        waits(
            `<div class="dc-panel"><span>Station</span><span>Flow</span><span class="dc-faint">North 4</span><span class="dc-faint">412</span></div>`,
        ),
    ) +
    cell(
        'A menu entry',
        `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-waits" aria-busy="true">Loading stations…<span class="dc-wait" aria-hidden="true"></span></button></li></ul></div>`,
    ) +
    cell(
        'Days of a month',
        `<div class="dc-days">${[1, 2, 3, 4, 5].map((d) => `<span class="dc-day dc-waits" style="--i: ${d - 1}">${d}<span class="dc-wait" aria-hidden="true"></span></span>`).join('')}</div>`,
    ) +
    cell('A chart’s plot', waits('<div class="dc-plot"></div>')) +
    cell('Skeleton lines', PART.skeleton());

const BARS = () =>
    cell(
        'A share of 62 %',
        `<div class="dc-bars">${bar(0.62, '', 'Export')}${bar(0.62, 'kp-progressbar--md', 'Export')}${bar(0.62, 'kp-progressbar--lg', 'Export')}</div>`,
        'dc-part--wide',
    ) +
    cell(
        'Busy',
        `<div class="dc-bars">${bar(null, '', 'Export')}${bar(null, 'kp-progressbar--md', 'Export')}${bar(null, 'kp-progressbar--lg', 'Export')}</div>`,
        'dc-part--wide',
    ) +
    cell(
        'Inside a busy button',
        `<button type="button" class="kp-button dc-busy-button" aria-busy="true">Saving…${bar(null, '', 'Saving')}</button>`,
    ) +
    cell('Beside a share, 62 %', `<div class="dc-bars dc-bars--pair">${bar(0.62, '', 'Share')}${bar(null, '', 'Busy')}</div>`);

const SPINNERS = () =>
    cell('Three sizes', `<div class="dc-row dc-spins">${[1, 1.5, 2.5].map((s) => spin(s)).join('')}</div>`, 'dc-part--wide') +
    cell('A busy button', `<button type="button" class="kp-button dc-busy-button" aria-busy="true">${spin(1)}Saving…</button>`) +
    cell(
        'The busy panel',
        `<div class="kp-card dc-busy-panel">${spin(1.75, 'Reading the pump houses')}<p class="kp-card__body">Reading the pump houses…</p></div>`,
    );

/** A part that leaves and arrives, in a pleated wrapper. */
const leaver = (html) => fx(html, 'dc-fx--pleat');
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell(
        'A card',
        leaver(`<div class="kp-card dc-tile"><p class="kp-card__title dc-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`),
    ) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi dc-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></div></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        'Alone: deco’s own button, for reference',
        `<div class="dc-row">${button('Export readings')}${button('Add', 'kp-button--primary')}</div>`,
        'dc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header dc-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title dc-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm dc-in-header')}${button('Add', 'kp-button--sm kp-button--primary dc-in-header')}</div></div></header>`,
        'dc-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'dc-in-menu', false)) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card dc-tile dc-in-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link" href="#dc-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card dc-drawer"><p class="kp-card__title dc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="dc-row">${button('Skip', 'kp-button--sm kp-button--ghost')}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi dc-kpi dc-in-kpi" href="#dc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="dc-row">${button('Export readings', 'dc-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card dc-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link dc-pointed" href="#dc-intro">Open</a></div>`,
    ) +
    cell(
        'A link in a line, pointed at',
        `<p class="dc-prose">Read the <a class="dc-pointed" href="#dc-intro">pressure report</a> before the night valve closes.</p>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis dc-kpi-row"><a class="kp-kpi dc-kpi dc-in-kpi dc-pointed" href="#dc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi dc-kpi dc-in-kpi" href="#dc-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="dc-days">${[12, 13, 14, 15].map((d) => `<span class="dc-day${d === 13 ? ' dc-pointed' : ''}">${d}</span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="dc-row">${button('Export readings', 'dc-focused')}</div>`) +
    cell('Primary button', `<div class="dc-row">${button('Add a pump house', 'kp-button--primary dc-focused')}</div>`) +
    cell('Header action', `<div class="dc-header-mini">${button('Export', 'kp-button--sm dc-in-header dc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi dc-kpi dc-in-kpi dc-focused" href="#dc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover dc-pop dc-pop--static dc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="dc-days"><span class="dc-day">13</span><span class="dc-day dc-focused">14</span><span class="dc-day">15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card dc-tile dc-in-tile"><p class="kp-card__title dc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm dc-tile-link dc-focused" href="#dc-intro">Open</a></div>`,
    );

/** One specimen at rest beside the same one pressed. */
const duo = (rest, pressed) => `<div class="dc-duo"><span class="dc-duo__one">${rest}</span><span class="dc-duo__one">${pressed}</span></div>`;
const PRESS = () =>
    cell('Button, at rest and pressed', duo(button('Export readings', 'dc-rest'), button('Export readings', 'dc-press'))) +
    cell('Primary button', duo(button('Add', 'kp-button--primary dc-rest'), button('Add', 'kp-button--primary dc-press'))) +
    cell(
        'Menu entry',
        duo(
            `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-rest">Assign to…</button></li></ul></div>`,
            `<div class="kp-popover dc-pop dc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item dc-press">Assign to…</button></li></ul></div>`,
        ),
    ) +
    cell('Calendar day', duo('<span class="dc-day dc-rest">14</span>', '<span class="dc-day dc-press">14</span>')) +
    cell(
        'Key figure as a filter',
        duo(
            `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle dc-kpi dc-rest" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
            `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle dc-kpi dc-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
        ),
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card dc-type"><p class="dc-type__label">Northern network</p><p class="dc-type__head">Pump house 4</p>
        <p class="dc-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="dc-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="dc-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p class="dc-type__ticks" aria-hidden="true"><span>06:00</span><span>09:00</span><span>12:00</span></p>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge dc-tag">12 new</span></p></div>`,
        'dc-part--wide',
    );

const MOTIFS = () =>
    cell(
        'A card and its title',
        `<div class="kp-card dc-tile dc-motif-card"><p class="kp-card__title dc-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`,
    ) +
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events',
        `<div class="dc-events" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none"><polyline points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="dc-events__mark" style="--x: 37.5%"></span><span class="dc-events__mark" style="--x: 75%"></span></div>`,
    ) +
    cell(
        'Button and a list',
        `<div class="dc-row">${button('Add a sensor', 'dc-motif-button')}</div><ul class="dc-motif-list"><li>North 4</li><li>South 2</li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty dc-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="dc-cap">Pumps</p><hr data-kp-divider class="dc-divider" /><p class="dc-cap">Reservoirs</p>`);

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
    bar: BARS,
    spinner: SPINNERS,
    leave: LEAVE,
    composites: COMPOSITES,
    hover: HOVER,
    focus: FOCUS,
    press: PRESS,
    type: TYPE,
    motifs: MOTIFS,
};

/** The questions of aspects.js, each given its scene function. */
const ROWS = ASPECTS.map((a) => ({ ...a, build: SCENES[/** @type {keyof typeof SCENES} */ (a.scene)] }));

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}"]`));
// Each hint repeats the question and the reason, then what this option shows
// and the recommendation line: the dialog shows only the hint of the option
// on screen, so each hint has to stand on its own.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ROWS.map((a) => ({
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
lookLine.textContent = `${ROWS.length} questions, one rule of ${THEME} each; the first option of every question is the recommendation. Pick the one that is ${THEME} to you, or “None of these” with a note.`;
look.append(lookLine);

for (const p of document.querySelectorAll('[data-dc-story]'))
    p.textContent = STORY[/** @type {keyof typeof STORY} */ (p.getAttribute('data-dc-story'))];
document.title = `kp-themes — ${TITLE.toLowerCase()}`;

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-dc-aspects]'));
const toc = document.querySelector('[data-dc-toc]');
ROWS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'dc-aspect';
    box.id = `dc-${a.id}`;
    box.setAttribute('data-dc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-dc-${a.id}`);
    box.innerHTML = `<div class="dc-aspect__head">
        <h3 id="h-dc-${a.id}"><span class="dc-aspect__no">${n + 1}</span> ${a.label} <span class="dc-aspect__rule">${a.rule}</span></h3>
        <p class="dc-aspect__q"></p><p class="dc-aspect__why"></p></div><div class="dc-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.dc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.dc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.dc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'dc-col';
        col.setAttribute('data-dc-option', String(at + 1));
        col.innerHTML = `<p class="dc-label"><span class="dc-label__no">${at + 1}</span> <span class="dc-label__name"></span>${
            at === 0 ? ' <span class="dc-label__rec">Recommended</span>' : ''
        }</p><p class="dc-see"></p><p class="dc-verdict"></p>
        <div class="dc-scene" data-dc-kind="${a.kind}" data-dc-${a.id}="${o.key}" data-dc-phase="in" data-dc-show="rest">${a.build()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.dc-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.dc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.dc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('dc-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#dc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part (the same numbers
// options.css plays): contact, a fan, a plate behind it, a group, a loop.
const BANDS = {
    fan: ['160 ms', '480 ms (40 ms a ray)', '480 + 160 ms', '80 ms apart', '2400 ms a loop'],
    brisk: ['120 ms', '320 ms (27 ms a ray)', '320 + 100 ms', '50 ms apart', '1600 ms a loop'],
    grand: ['200 ms', '720 ms (60 ms a ray)', '720 + 240 ms', '120 ms apart', '3600 ms a loop'],
};
for (const scene of section.querySelectorAll('[data-dc-durations]')) {
    const band = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-dc-durations'))];
    ['contact', 'fan', 'plate', 'group', 'loop'].forEach((id, i) => {
        const p = scene.querySelector(`[data-dc-readout="${id}"]`);
        if (p) p.textContent = band[i];
    });
}

/* ---------------------------------------------------------- the one clock */

// Every scene that opens, arrives, updates or leaves is replayed by one clock,
// so the options of a row always start together and can be compared. One
// cycle: `gap` (what arrives is away), `in` (it opens, a value updates),
// `hold` (it stands), `out` (it leaves, its opening played backwards: a fan
// folds ray by ray, a plate folds into its pleats). `in` outlasts the slowest
// opening (the grand fan: 720 + 240 ms, a group 3 x 120 ms behind), and `out`
// the slowest leave, so nothing is cut off mid-motion. The CSS keys every
// motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-dc-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1500],
    ['hold', 1400],
    ['out', 1500],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.dc-scene[data-dc-kind="cycle"]')) scene.setAttribute('data-dc-phase', phase);
    // A live update happens on the way in and again on the way out (the flash of the fan is the same both ways, so its close is its open reversed).
    if (phase === 'in' || phase === 'out') {
        tick += 1;
        for (const num of section.querySelectorAll('.dc-scene[data-dc-live] [data-dc-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('.dc-scene[data-dc-live] [data-dc-word]')) word.textContent = tick % 2 ? 'Draining' : 'Running';
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
radio('data-dc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--dc-slow', String(slow));
    run(0);
});
// A state is forced on every control of the scenes (it sits on the scene, so it moves with it into the review dialog's stage).
radio('data-dc-state', (value) => {
    section.setAttribute('data-dc-show', value);
    for (const scene of section.querySelectorAll('.dc-scene')) scene.setAttribute('data-dc-show', value);
});
document.querySelector('[data-dc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.dc-scene a, .dc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided deco components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=deco`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-dc-gallery]'));
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

void LABEL;
