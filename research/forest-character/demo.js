// What makes forest forest (Kenny, 2026-10-07 02:54): "Kunnen we het op
// dezelfde manier aanpakken als we met titanium gedaan hebben? waar jij eerst
// uitzoekt wat bij mekaar past, wat niet past en dan zo voorstellen doet?
// begin met 1 thema en we zullen dat één voor één afwerken zo."
//
// A review-kit demo in aspect mode, forest only. Each ASPECT is one rule of
// the theme's grammar (themes/forest/CHARACTER.md, G1-G16) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-fc-<aspect>="<key>"`) that options.css reads. The recommended
// option is always first. The page's one clock (below) plays every scene
// that arrives, opens, presses, updates or leaves, so the rule is seen in
// action. The network graph is in no scene: it changes in no theme (Kenny,
// 02:54), so it is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The bar's own busy picture, small, as the planting strip a waiting surface wears at its foot. */
const strip = (cls = '') =>
    `<span class="kp-progressbar fc-strip ${cls}" data-kp-indeterminate aria-hidden="true"><span class="kp-progressbar__track"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></span>`;

/** The loading pictures every option draws over or under a waiting part. */
const LOAD = `<span class="fc-load" aria-hidden="true">${strip('fc-load__strip')}<span class="fc-load__stand"></span><span class="fc-load__today"></span><span class="fc-load__plant fc-plant"><span class="fc-plant__a"></span><span class="fc-plant__b"></span><span class="fc-plant__c"></span></span></span>`;

/** A field note: the change on a square italic tag (Kenny's tone family). */
const note = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta fc-note" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter fc-meter" role="meter" aria-label="Reservoir North, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

const PART = {
    dialog: () => `<div class="kp-dialog fc-dialog fc-arrives fc-fold" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title fc-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: () => `<div class="fc-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="kp-popover fc-pop fc-arrives fc-fold"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>
    </div>`,
    tile: (label = 'Pump house 1', body = '4.2 bar · 412 m³/h') => `<div class="kp-card fc-tile fc-arrives">
        <p class="kp-card__title fc-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412', foot = note('6 %')) => `<div class="kp-kpi fc-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value fc-carrier" data-fc-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    stems: () => `<div class="fc-stems" aria-hidden="true">
        <span class="fc-stems__ground"><span class="fc-stem" data-fc-r="1"></span></span>
        <span class="fc-stems__ground"><span class="fc-stem" data-fc-r="2"></span></span>
        <span class="fc-stems__ground"><span class="fc-stem" data-fc-r="3"></span></span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="fc-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="fc-day fc-arrives" style="--i: ${i}">${from + i}</span>`)
            .join('')}</div>`,
    chip: (word = 'Running') =>
        `<span class="fc-state"><span class="fc-state__dot fc-carrier" aria-hidden="true"></span><span class="fc-state__word fc-carrier" data-fc-word>${word}</span></span>`,
    alert: (text = 'Pump house 4 is back online.') =>
        `<div class="kp-alert fc-alert fc-arrives" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<span class="fc-spark fc-carrier fc-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="1"/></svg></span>`,
    column: (label = 'Open', value = '38') =>
        `<div class="fc-column"><span class="kp-kpi__label">${label}</span><span class="fc-column__num fc-carrier" data-fc-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="fc-skel" aria-hidden="true"><span class="kp-skeleton fc-skel__line"></span><span class="kp-skeleton fc-skel__line"></span><span class="kp-skeleton fc-skel__line"></span>${strip(
            'fc-skel__strip',
        )}${strip('fc-skel__strip')}${strip('fc-skel__strip')}</div>`,
    bar: (label = 'Export busy') =>
        `<div class="kp-progressbar fc-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    field: () =>
        `<label class="kp-field fc-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '') =>
        `<div class="kp-popover fc-pop fc-pop--static ${cls}"><ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 ? ' fc-pointed' : ''}">${t}</button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="fc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="fc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The four moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three stems grow, one per curve the option uses', PART.stems(), 'fc-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'fc-part--wide') +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn', PART.spark().replace('fc-carrier fc-carrier--svg', 'fc-walk')) +
    cell(
        'A pass over a waiting tile',
        `<div class="kp-card fc-tile fc-pass fc-waits" aria-hidden="true"><p class="kp-card__title fc-title">Pump house 3</p><p class="kp-card__body">Reading…</p>${LOAD}</div>`,
    );

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell('Contact: a press', `<div class="fc-row">${button('Export readings', 'fc-tap')}</div><p class="fc-readout" data-fc-readout="contact"></p>`) +
    cell('A fold: a dialog opens', PART.dialog() + '<p class="fc-readout" data-fc-readout="fold"></p>') +
    cell(
        'Growth: a figure arrives',
        `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div><p class="fc-readout" data-fc-readout="grow"></p>`,
    ) +
    cell('A loop: one planting pass', PART.bar('Loading') + '<p class="fc-readout" data-fc-readout="loop"></p>');

const COLOUR = () =>
    cell('Card with a heading', PART.tile('Reservoir North', 'Level 71 %').replace(' fc-arrives', '')) +
    cell(
        'Key figures with a tone',
        `<div class="kp-kpis">${PART.kpi('Flow now', '412', note('6 %'))}${PART.kpi('Pressure', '1.1 bar', note('0.4 bar', 'down', 'bad')).replace('class="kp-kpi fc-kpi"', 'class="kp-kpi fc-kpi fc-kpi--warn" data-kp-tone="warning"')}</div>`,
    ) +
    cell('Buttons and a state', `<div class="fc-row">${button('Export')}${button('Add', 'kp-button--primary')}${PART.chip('Running')}</div>`) +
    cell(
        'Loading',
        `<div class="kp-card fc-tile fc-waits"><p class="kp-card__title fc-title">Pump house 2</p><p class="kp-card__body">Reading…</p>${LOAD}</div>`,
    ) +
    cell(
        'Today and the picked day in a month',
        `<div class="fc-days fc-days--today">${[12, 13, 14, 15]
            .map((d) => `<span class="fc-day${d === 14 ? ' fc-today' : ''}${d === 13 ? ' fc-picked' : ''}">${d}</span>`)
            .join('')}</div>`,
    ) +
    cell('A meter past its end', meter(1, 0.8, 'data-kp-over'));

const CORNERS = () =>
    cell('Card', PART.tile('Reservoir North', 'Level 71 %').replace(' fc-arrives', '')) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…']).replace(' fc-pointed', '')) +
    cell('Key figure with its field note', `<div class="kp-kpis">${PART.kpi('Flow now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="fc-row">${button('Export')}<span class="kp-badge fc-tag">12 new</span><span class="kp-tag fc-chip">Pumps</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip fc-tip" role="tooltip">14:00 · 412 m³/h</div>`) +
    cell('Meter', meter(0.62, 0.8));

const SURFACE = () =>
    cell('Card', PART.tile('Reservoir North', 'Level 71 %').replace(' fc-arrives', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell(
        'Meter and progress',
        meter(0.62, 0.8) +
            `<div class="kp-progressbar fc-bar" role="progressbar" aria-label="Export, 62 %" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="--kp-value: 0.62"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    ) +
    cell(
        'Buttons and a tag',
        `<div class="fc-row">${button('Export')}${button('Add', 'kp-button--primary')}<span class="kp-badge fc-tag">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card fc-tile fc-live-tile"><p class="kp-card__title fc-title">Pump house 2</p><p class="kp-card__body"><span class="fc-carrier" data-fc-num>4.2 bar</span></p></div>`,
    );

const LOADERS = () =>
    cell('The progress bar itself (the decided picture)', PART.bar('Export busy'), 'fc-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi fc-kpi fc-waits" aria-busy="true"><span class="kp-kpi__label">Readings today</span><span class="kp-kpi__value fc-faint">18 240</span><span class="kp-kpi__trend fc-faint">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="fc-table fc-waits" aria-busy="true"><span>Station</span><span>Flow</span><span class="fc-faint">North 4</span><span class="fc-faint">412</span>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover fc-pop fc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fc-waits" aria-busy="true">Loading stations…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="fc-days">${[1, 2, 3, 4, 5].map((d) => `<span class="fc-day fc-waits" style="--i: ${d - 1}">${d}${LOAD}</span>`).join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="fc-plot fc-waits" aria-busy="true">${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="fc-meter-wait fc-waits" aria-busy="true">${meter(0.62, 0.8)}${LOAD}</div>`);

const SPINNERS = () =>
    cell(
        'Three sizes',
        `<div class="fc-row fc-spins">${[1, 1.5, 2.5].map((s) => `<span class="kp-spinner fc-spin" role="status" aria-label="Working…" style="--kp-spinner-size: ${s}rem"><span class="fc-spin__a"></span><span class="fc-spin__b"></span><span class="fc-spin__c"></span></span>`).join('')}</div>`,
        'fc-part--wide',
    ) +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary fc-busy-button" aria-busy="true"><span class="kp-spinner fc-spin" aria-hidden="true"><span class="fc-spin__a"></span><span class="fc-spin__b"></span><span class="fc-spin__c"></span></span>Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        `<div class="kp-card fc-busy-panel"><span class="kp-spinner fc-spin" role="status" aria-label="Reading the pump houses" style="--kp-spinner-size: 1.75rem"><span class="fc-spin__a"></span><span class="fc-spin__b"></span><span class="fc-spin__c"></span></span><p class="kp-card__body">Reading the pump houses…</p></div>`,
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="fc-leaver">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert().replace(' fc-arrives', ''))) +
    cell('A card', leaver(PART.tile('Reservoir North', 'Level 71 %').replace(' fc-arrives', ''))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi fc-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></div></div>`,
        ),
    );

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="fc-row">${button('Export readings')}${button('Add', 'kp-button--primary')}</div>`,
        'fc-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header fc-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title fc-title">Pump houses</p><p class="kp-page-header__description">Fifteen on the northern network.</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm fc-in-header')}${button('Add', 'kp-button--sm kp-button--primary fc-in-header')}</div></div></header>`,
        'fc-part--wide',
    ) +
    cell('Menu: its entries', PART.menuStatic(['Open incident', 'Assign to…'], 'fc-in-menu').replace(' fc-pointed', '')) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card fc-tile fc-in-tile"><p class="kp-card__title fc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fc-tile-link" href="#fc-intro">Open</a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card fc-drawer"><p class="kp-card__title fc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="fc-row">${button(
            'Skip',
            'kp-button--sm kp-button--ghost',
        )}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi fc-kpi fc-in-kpi" href="#fc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const HOVER = () =>
    cell('Button, pointed at', `<div class="fc-row">${button('Export readings', 'fc-pointed')}${button('Add', 'kp-button--primary')}</div>`) +
    cell('Menu entries, the first pointed at', PART.menuStatic(['Open incident', 'Assign to…', 'Rename'])) +
    cell(
        'Tile with its Open link pointed at',
        `<div class="kp-card fc-tile"><p class="kp-card__title fc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fc-tile-link fc-pointed" href="#fc-intro">Open</a></div>`,
    ) +
    cell(
        'Key figures, the first pointed at',
        `<div class="kp-kpis fc-kpi-row"><a class="kp-kpi fc-kpi fc-pointed" href="#fc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a><a class="kp-kpi fc-kpi" href="#fc-intro"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1</span></a></div>`,
    ) +
    cell(
        'Days of a month, one pointed at',
        `<div class="fc-days">${[12, 13, 14, 15].map((d) => `<span class="fc-day${d === 13 ? ' fc-pointed' : ''}">${d}</span>`).join('')}</div>`,
    );

const FOCUS = () =>
    cell('Button', `<div class="fc-row">${button('Export readings', 'fc-focused')}</div>`) +
    cell('Header action', `<div class="fc-header-mini">${button('Export', 'kp-button--sm fc-in-header fc-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi fc-kpi fc-in-kpi fc-focused" href="#fc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover fc-pop fc-pop--static fc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fc-focused">Assign to…</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Rename</button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="fc-days"><span class="fc-day">13</span><span class="fc-day fc-focused">14</span><span class="fc-day">15</span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card fc-tile fc-in-tile"><p class="kp-card__title fc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm fc-tile-link fc-focused" href="#fc-intro">Open</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="fc-row">${button('Export readings', 'fc-press')}</div>`) +
    cell('Primary button', `<div class="fc-row">${button('Add a pump house', 'kp-button--primary fc-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover fc-pop fc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item fc-press">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="fc-days"><span class="fc-day fc-press">14</span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle fc-kpi fc-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card fc-type"><p class="fc-type__label">Northern network</p><p class="fc-type__head">Pump house 4</p>
        <p class="fc-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="fc-type__figure">4.2 <small>bar</small> ${note('0.4 bar', 'down', 'bad')}</p>
        <table class="fc-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p class="fc-type__ticks" aria-hidden="true"><span>06:00</span><span>09:00</span><span>12:00</span></p>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge fc-tag">12 new</span></p></div>`,
        'fc-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events',
        `<div class="fc-events" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none"><polyline points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line class="fc-events__line" x1="60" y1="0" x2="60" y2="48"/><line class="fc-events__line" x1="120" y1="0" x2="120" y2="48"/></svg><span class="fc-events__mark" style="--x: 37.5%"></span><span class="fc-events__mark" style="--x: 75%"></span></div>`,
    ) +
    cell(
        'Card',
        `<div class="kp-card fc-tile fc-motif-card"><p class="kp-card__title fc-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`,
    ) +
    cell(
        'Button and a list',
        `<div class="fc-row">${button('Plant a sensor', 'fc-motif-button')}</div><ul class="fc-motif-list"><li>North 4</li><li>South 2</li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty fc-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="fc-cap">Pumps</p><hr class="fc-divider" /><p class="fc-cap">Reservoirs</p>`);

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
        question: 'How does forest move: on its own slow-start curve, on the quick curve titanium uses, or as each pick does today?',
        why: 'A theme exists to be distinct (your rule of 03:37): the quick, decelerating curve is titanium’s exactly, and cyberpunk, synthwave, dark and phantom move on near copies of it. Forest’s register already has a curve no other theme uses: slow to break the ground, then up, then a long settle. Today forest moves on six curves at once (that one, linear, ease-in-out, ease-out, ease-in and two springs).',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'register',
                name: 'Forest’s own curve: breaks the ground, then settles',
                see: 'Every one-shot motion uses the register’s curve, cubic-bezier(0.33, 0, 0.15, 1): the three stems take a moment to break the ground, then rise and settle long; the dialog and the menu unfold, the tile grows up from its line, all the same way. A there-and-back eases in and out; a loop walks at an even pace.',
                verdict: rec(
                    'it is how a seedling comes up (a moment underground, then growth, then a long settle), it is already forest’s, and no other theme moves like it, so forest is told apart in a glance.',
                ),
            },
            {
                key: 'growth',
                name: 'The quick curve (titanium’s)',
                see: 'The same pictures on cubic-bezier(0.2, 0.8, 0.2, 1), the curve your Growing pick was built on: the stems shoot up at once and slow as they land.',
                verdict: not(
                    'it is lively and it is the curve your Growing pick happened to use, but it is titanium’s curve exactly and nearly cyberpunk’s, synthwave’s and dark’s: forest would move like four other themes.',
                ),
            },
            {
                key: 'mix',
                name: 'The current mix',
                see: 'As the picks are today: the dialog squashes open on the register’s curve, the menu unfurls with a twist (ease-out), the tile slides in (ease-in-out), the figure swells 10 % in 500 ms. The stems: linear, ease-in-out and a spring that overshoots.',
                verdict: not('four curves on one screen; the springs and the twist are what make forest feel like several themes.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion travel when something arrives, is drawn or loads?',
        why: 'A plant grows up from the ground; a trail is walked from where you start reading to where you stop (left to right here, mirrored in right-to-left languages). Titanium feeds everything start → end, so forest walks only what is a path (a line in time, the planting) and grows the rest up from under its own line. Today the days fall and swing in, the tiles slide in, the busy table’s footprints walk back and forth.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'grow',
                name: 'Growth goes up, walking goes start → end',
                see: 'Each day grows up from under its own line, one after the other in reading order; the tile grows up from its line; the line is drawn left to right; the planting walks left to right.',
                verdict: rec(
                    'it is your arrival pick and your loading pick at once: what arrives grows, what moves along is walked, and both read in the order you read.',
                ),
            },
            {
                key: 'feed',
                name: 'Everything start → end',
                see: 'One axis for everything: each day and the tile are uncovered from their left edge, the line is drawn left to right, the planting walks left to right.',
                verdict: not('tidy, but nothing grows any more: it is titanium’s machine feed exactly, not a wood.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The days fall and swing into place (the month’s Falling leaves), the tile slides in from the left (the tiles’ Trail is walked), the line is drawn left to right, the footprints walk there and back.',
                verdict: not('falling, sliding and walking back on one screen; the eye cannot predict where the next thing comes from.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Three openings are picked today for one gesture: the menu unfurls with a 6° twist, the header’s menu drops and sways past its place, the dialog unfolds by squashing its own words. One opening makes the theme feel like one place.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'unfold',
                name: 'The map unfolds',
                see: 'The menu and the dialog open as a folded map does: the top panel opens across, then the rest drops down; nothing is squashed, the paper is uncovered. Closing folds it back. Menu 320 ms, dialog 520 ms, on forest’s curve.',
                verdict: rec(
                    'it keeps the register’s own idea for the dialog (a map unfolding) and makes it work for every panel without squashing a single letter, and no other theme opens this way.',
                ),
            },
            {
                key: 'grow',
                name: 'Grows down from the button',
                see: 'The menu and the dialog are uncovered from their top edge down in one movement, like a shoot growing out of the button, 320 ms on forest’s curve.',
                verdict: not(
                    'clear and calm, but it is titanium’s opening (cut open from the top) on a softer curve; the map’s fold is what makes it forest.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The menu unfurls from 5 % with a 6° twist (300 ms ease-out); the dialog squashes open from half width and a third height (520 ms on the register’s curve).',
                verdict: not('two openings, both of which bend or squash the words while they move.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does a contact, a fold, a growth and a loading pass take?',
        why: 'The recommended times are not new: 200 ms is the register’s contact, 520 ms its dialog, 800 ms your Growing, 3200 ms the progress bar’s grove. Today one picture runs at four speeds (the growth ring at 260, 380, 500 and 1000 ms).',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'picks',
                name: 'Calm: 200 · 320–520 · 800 · 3200 ms',
                see: 'A press answers in 200 ms; a menu folds open in 320 ms and the dialog in 520 ms; a figure grows in 800 ms; the grove walks the row in 3200 ms.',
                verdict: rec(
                    'every number comes from something you already picked, and the pace is a field guide’s: unhurried, never slow to answer a press.',
                ),
            },
            {
                key: 'brisk',
                name: 'Brisk: 120 · 200 · 480 · 2000 ms',
                see: 'Everything about 40 % faster: the dialog in 200 ms, a figure grows in 480 ms, the grove walks in 2 seconds.',
                verdict: not('it reads as an app, not a wood; the growth becomes a pop and the trees race.'),
            },
            {
                key: 'slow',
                name: 'Slow: 300 · 780 · 1200 · 4800 ms',
                see: 'Everything about half again as slow: a press takes 300 ms to answer, the dialog 780 ms to unfold, a figure 1.2 seconds to grow, the grove 4.8 seconds a pass.',
                verdict: not('beautiful once, tiring on the tenth dialog; a press that lags 300 ms feels broken.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be forest green, what may be clay, and where do the status colours go?',
        why: 'The anatomy of forest says green acts and clay never does. Today clay draws the month’s picked day, the tiles glow in the light success green, the trend’s fireflies are amber, and a warning tile is edged in the warning plate’s pale orange, which barely reads on the card.',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'trail',
                name: 'Green acts, clay marks the trail',
                see: 'Forest green on what you do: the primary button, the picked day’s ring, the share. Clay only on the trail’s marks: the blaze past the meter’s end, the pin on today. A tone on its field note, in its own plate and ink.',
                verdict: rec('every colour has one meaning you can learn in a glance, and the tones always read (plate and ink are a pair).'),
            },
            {
                key: 'leaves',
                name: 'The leaf palette as decoration (today)',
                see: 'Clay rings the picked day, the light success green glows on the card, amber fireflies on the loading tile, a pale warning edge on the warning figure.',
                verdict: not(
                    'clay and pale green start to act, and the pale plate colours used as an edge or a glow fall well below 3:1 on the card.',
                ),
            },
            {
                key: 'ink',
                name: 'Forest ink only',
                see: 'No clay at all: the pin, the blaze and the pick in forest green; tones only as words in their ink, no plates.',
                verdict: not('calm, but the trail loses its blazes and a warning no longer stands out from a normal figure.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners does forest have?',
        why: 'Today eight radii live in forest: 0.75 rem on the key figure, 1 rem on the strip, 0.875 rem on the busy panel, 0.3 rem on the drawer, 0.25 rem on the header’s tags, 2 px on the chart, a tag shape on the legend keys and a leaf corner on three tags, beside your field note, which is square.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'two',
                name: 'Paper rounded, wood cut',
                see: 'Every plate (card, menu, key figure, tooltip’s parent panels) keeps the register’s 0.625 rem; every wooden part and small piece (the meter, the progress bar, a tag, a chip, the tooltip) is cut at 3 px; the field note is square.',
                verdict: rec(
                    'two radii and a square, each with a reason you can see: card stock is worn round, a wooden gauge is cut, a note is torn square.',
                ),
            },
            {
                key: 'cut',
                name: 'The gauge’s 3 px on everything',
                see: 'Your wooden gauge’s corner taken literally: every card, menu, key figure, tag and the tooltip cut at 3 px; the field note square.',
                verdict: not(
                    'it is one rule, but cards become hard-edged boards, closer to blueprint than to a field guide, and the kraft paper loses its softness.',
                ),
            },
            {
                key: 'leaf',
                name: 'The leaf corner',
                see: 'Every plate and every small part gets the leaf corner: top-right and bottom-left rounded, the other two square (three picks use it today on a tag).',
                verdict: not('the boldest and very forest, but it breaks your field note (a square tag) and turns every card into a motif.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is paper and what is wood?',
        why: 'Your shape pick is the meter’s wooden gauge: light wood with its grain, the share the same wood stained forest green, with a knot. The question is how far the wood reaches.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'kit',
                name: 'Paper for plates, wood for instruments',
                see: 'Cards, key figures, buttons and fields stay kraft card over the faint contour field; the meter and the tags are light wood, what the meter is filled with stained green with its grain. The progress bar is the planted ground in every option.',
                verdict: rec(
                    'the wood reads as wood because it is rare: it is what you measure with and what you hang a note on, while the words stay on clean paper.',
                ),
            },
            {
                key: 'wood',
                name: 'Wood on everything',
                see: 'The gauge’s grain and routed edge on every card, key figure, button, tag and field; the primary button stained green.',
                verdict: not('every plate becomes a plank; the grain sits under the words and the page reads as a sauna.'),
            },
            {
                key: 'paper',
                name: 'Plain kraft, no wood',
                see: 'No grain anywhere: the meter and the progress bar are flat muted grooves with a flat green share.',
                verdict: not('quiet, but it throws away the shape you picked; forest becomes formal on brown paper.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G8',
        question: 'What happens to a value that changes in place?',
        why: 'Your live pick is the trend tile’s Growth ring, which today swells the line once. Light’s live update is the same swell (“A soft swell”), so as a picture it is not forest’s own. A real growth ring is a ring laid round the trunk. Today forest’s other live updates also sway a tile, dip a tile and swing a word on a spring, and the package itself plays nothing when a value changes.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'ring',
                name: 'A growth ring is laid round it',
                see: 'A thin forest-green ring is drawn once round what changed, clockwise from the top like a trail walked round a trunk, then fades into the grain, 1 second; the figure, the word and the line themselves do not move.',
                verdict: rec(
                    'it is the name of your pick made literal and forest’s own (no other theme draws a ring round a change), and the words never move, so the new value reads at once.',
                ),
            },
            {
                key: 'swell',
                name: 'The swell on every carrier',
                see: 'What changed swells once and settles, easing in and out, 1 second: the figure and the word to 108 % from their start edge, the state dot to 130 %, the line’s stroke to two and a half times.',
                verdict: not(
                    'it is today’s trend pick on every carrier and it reads well, but it is light’s soft swell almost exactly: two themes would answer a change the same way.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The key figure swells 10 % in half a second, the word swings on a spring, the line swells, the strip column sways 2°, the tile dips 0.3 rem.',
                verdict: not('five motions for one event; the swing and the sway move the words, which is harder to read than a ring or a swell.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G9',
        question: 'How does the planting carry from the progress bar to everything else that waits?',
        why: 'You picked the progress bar’s planted trees as forest’s loading picture (02:54): cleared ground with seedlings, whole trees only, a grove walking down the row. Today nine other loading pictures run beside it (footprints, a falling leaf, the map being inked, light, daylight, a swaying post, a hopping blaze, a canopy, fireflies).',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'strip',
                name: 'The planting strip on every waiting surface',
                see: 'Every waiting part gets the bar’s own busy picture as a 1 rem strip along its foot: seedlings on cleared ground, a grove of whole trees walking left to right in 3.2 seconds, its sapling swaying at the front. The skeleton’s lines become three such rows; the meter’s groove is planted too.',
                verdict: rec('it is exactly the picture you picked, at one size and one pace everywhere, and it never covers the words.'),
            },
            {
                key: 'stand',
                name: 'A stand grows behind the content',
                see: 'Behind each waiting part a faint stand of trees is planted from left to right, whole trees only, slot by slot; when the row is full it is cleared and planted again.',
                verdict: not('more of a scene, but trees behind words make the words harder to read, and at a tile’s size the trees are huge.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'Each component its own picture: the key figure’s daylight sways, the table’s footprints walk there and back, the menu row tilts, a leaf falls through each day, the chart is inked in contour rings, the skeleton is surveyed in lake blue, the meter’s blaze hops.',
                verdict: not('nine pictures for one state; none of them is the planting you picked.'),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G9',
        question: 'What does forest’s spinner show?',
        why: 'The spinner is the one loading element too small for a row of trees. Today it is a compass whose needle overshoots 25° and swings back twice a turn: a map instrument, where loading is planting.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'tree',
                name: 'A tree is planted',
                see: 'On a small mound a seedling grows into a sapling and then into a full pine, in three whole stages (never in between), stands for a moment, and the next one is planted. One tree per 1.6 seconds.',
                verdict: rec('it is the progress bar’s own idea, one tree at a time: whole trees only, planted and grown.'),
            },
            {
                key: 'rings',
                name: 'Growth rings',
                see: 'Round a pith, three growth rings are drawn one after the other, each a full turn clockwise, then the log starts again.',
                verdict: not('it turns like a spinner and echoes the tree rings of the month and the strip, but it says growing, not planting.'),
            },
            {
                key: 'compass',
                name: 'The compass (today)',
                see: 'The register’s compass: a needle in a bezel with four ticks, swinging past north and back twice a turn.',
                verdict: not('a map instrument and the only spring left in the theme; it does not say planting.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G10',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'What leaves plays the register’s leave; what arrives plays that leave backwards (you approved that pairing on 2026-10-05). Today the leave is an autumn fade with a slight shrink, and its comment promises a wind that never blows; arriving is that fade backwards, which is not the Growing you picked.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'wither',
                name: 'Withers into the ground, grows out of it',
                see: 'Leaving, the part turns autumn brown and sinks back under its own line, letting go faster at the end, 560 ms. Arriving, it plays that backwards: it grows up out of its line and greens on forest’s curve — your Growing. No other theme leaves downward into its own line',
                verdict: rec('one picture for both ways, and the arrival it gives is exactly the one you picked.'),
            },
            {
                key: 'today',
                name: 'The autumn fade (today)',
                see: 'Leaving, the part turns sepia, shrinks 6 % and fades, 560 ms ease-in; arriving, the same backwards.',
                verdict: not('a gentle leave, but the arrival it gives fades and swells in place, which is not Growing.'),
            },
            {
                key: 'wind',
                name: 'Blown away by the wind',
                see: 'Leaving, the part drifts off to the end of the line with a slight turn and fades, as the comment in the register promised; arriving, it drifts in from there.',
                verdict: not('lively, but an arrival that drifts in sideways is the tile slide you would retire under question 2.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G11',
        question: 'When a button sits inside a header, a menu, a tile or a drawer, is it forest’s own button?',
        why: 'Today the header’s actions are wooden tags with a green frame and a dotted focus outline, the menu’s entries tilt 1° on hover and focus, the tile’s Open link glows light green, and the key figure has its own single focus line. Press the State buttons above to see every button hovered, focused or pressed.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly forest’s own button',
                see: 'Every inner button, link and entry hovers, focuses and presses exactly like the button standing alone at the top.',
                verdict: rec('a button is a button wherever you meet it: one look to learn, one focus ring to trust.'),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s wooden tags (green frame, green foot, dotted focus), the menu entries tilt, the Open link glows, the key figure keeps its one-line ring.',
                verdict: not('four kinds of button on one page, and two of them replace the focus ring that must look the same everywhere.'),
            },
            {
                key: 'accent',
                name: 'Forest’s button plus the composite’s accent',
                see: 'Every button is forest’s own; the header adds its 3 px green foot under its actions as a mark of the header, nothing more.',
                verdict: not('a fair middle way, but the green foot reads as “pressed” on a light button.'),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G12',
        question: 'How does forest show what you point at?',
        why: 'Your hover pick is the network graph’s Blazed: the pointed node gets a bold dashed trail ring. Today a forest button lifts 2 px with a shadow, a menu entry tilts, a tile glows. In every scene below the first part is shown pointed at.',
        kind: 'still',
        scene: HOVER,
        options: [
            {
                key: 'blaze',
                name: 'The blaze ring',
                see: 'What you point at is blazed: a 2 px dashed forest-green ring, 2 px outside it, like a trail marked round a trunk. It does not move, and nothing around it changes.',
                verdict: rec('it is your pick, it is unmistakable on every part (button, entry, tile, day) and it never moves the words.'),
            },
            {
                key: 'mark',
                name: 'The blaze mark',
                see: 'What you point at gets a painted trail blaze along its start edge: a 3 px forest-green bar inside its left side.',
                verdict: not('quieter and elegant, but on a small button the bar is easy to miss and on a menu entry it reads as “selected”.'),
            },
            {
                key: 'lift',
                name: 'The lift (today’s button)',
                see: 'What you point at rises 2 px with a soft shadow, as forest’s button does today.',
                verdict: not('the generic web hover; it is not your pick and in a dense table or menu everything jumps.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G12, DI2',
        question: 'What does keyboard focus look like?',
        why: 'The two-channel focus ring (a dark inner ring and a light outer one) is a system constant (DI2): it must look the same in every theme so a keyboard user can always find it. Today the header uses a dotted outline, the tile a light-green halo, the key figure one 2 px line.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'di2',
                name: 'The two-channel ring',
                see: 'Every focused part carries the package’s ring: 2 px of forest ink right round it and 2 px of kraft outside that.',
                verdict: rec('it is the constant every theme shares and it reads on any ground; the blaze stays the hover’s.'),
            },
            {
                key: 'blazed',
                name: 'The ring with a blaze round it',
                see: 'The same two-channel ring, and the dashed forest-green blaze outside it as well.',
                verdict: not('it keeps the constant, but focus and hover then look alike, and the double ring is heavy on a small day or entry.'),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The button’s ring, the header’s dotted outline, the key figure’s single line 3 px out, the tile link’s light-green outline with a halo.',
                verdict: not(
                    'four focus looks; the light-green one reads about 1.3:1 against the card and the dotted one is half a ring, which is what DI2 exists to prevent.',
                ),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G12',
        question: 'What does a press look like?',
        why: 'Titanium’s press drops a part 1 px into its seat; a forest press should not be the same. Today a forest button stays lifted while it is pressed and only its colour changes, the header presses a 2 px line inward, the key figure changes its plate. The scenes press each part every few seconds.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'close',
                name: 'The blaze closes in',
                see: 'The trail blaze you point with pulls in to just outside the part’s edge and turns solid while it is pressed (200 ms, forest’s curve); the part itself does not move.',
                verdict: rec(
                    'it finishes the gesture the hover started (pointing blazes, pressing marks the blaze), it never shifts the words, and no other theme presses this way.',
                ),
            },
            {
                key: 'settle',
                name: 'Settles 1 px (titanium’s press)',
                see: 'The pressed part sinks 1 px onto the paper and its blaze closes solid round it, then it comes back.',
                verdict: not('a small, exact answer, but it is titanium’s press: on a forest page it would feel borrowed.'),
            },
            {
                key: 'shrink',
                name: 'Shrinks 2 %',
                see: 'The pressed part shrinks to 98 % and comes back.',
                verdict: not('the most common press on the web, and on a long button the words visibly shift.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice of a note',
        rule: 'G13',
        question: 'Where does the italic go, and where the monospace?',
        why: 'Your tone pick, the field note, is set in italics; the strip, the trend, the chart, the header and the state word already put their labels and notes in italics. The register sets badges and tags in the monospace, and one pick (the tiles’ herbarium sheet) uses Georgia, a face forest does not carry.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'notes',
                name: 'Italic for notes',
                see: 'What a ranger writes beside the figures is italic: the label, the description, the axis ticks, the tag, the change. Title and figure stand upright; the monospace only for the timestamp.',
                verdict: rec('one voice for notes and one for facts, and every part of it is your own pick already.'),
            },
            {
                key: 'mono',
                name: 'Monospace for tags and labels (the register today)',
                see: 'The label, the tag and the ticks in the monospace capitals; only the description italic.',
                verdict: not('it is how terminal and titanium speak; on kraft it reads as a machine label, not a note.'),
            },
            {
                key: 'serif',
                name: 'A serif italic',
                see: 'The title and every note in a serif italic, as the tiles’ herbarium sheet does with Georgia.',
                verdict: not('pretty on a Mac, but forest carries no serif: on another machine it falls back to whatever serif is there.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Trig points, blazes and rings',
        rule: 'G14',
        question: 'Where do the map’s and the wood’s motifs go?',
        why: 'Forest has a small set of motifs: the trig point (your meter’s mark, the chart’s events), the blaze, contour rings (the page’s texture, the dialog’s backdrop, the empty state), tree rings and trees. A motif keeps its charm only where it means something.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'place',
                name: 'Only where the map or the wood has them',
                see: 'A trig point marks a value on a scale (the meter, a chart event); contour rings on the empty state only; cards, buttons, lists and dividers plain.',
                verdict: rec(
                    'each motif keeps one meaning, so you can read it: a trig point is always “this value”, contour rings always “nothing here yet”.',
                ),
            },
            {
                key: 'none',
                name: 'None',
                see: 'A plain bar for the meter’s mark, round dots for the chart’s events, a plain empty state.',
                verdict: not('safe, but it removes what your meter pick was about.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'Contour rings on every card, a leaf on the button, trig points as list bullets, a row of trees as the divider.',
                verdict: not('a theme park: the motifs stop meaning anything and the trees no longer say “loading”.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="forest"]'));
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
lookLine.setAttribute('data-for', 'forest');
lookLine.textContent = `${ASPECTS.length} questions, one rule of forest each; the first option of every question is the recommendation. Pick the one that is forest to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-fc-aspects]'));
const toc = document.querySelector('[data-fc-toc]');
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'fc-aspect';
    box.id = `fc-${a.id}`;
    box.setAttribute('data-fc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-fc-${a.id}`);
    box.innerHTML = `<div class="fc-aspect__head">
        <h3 id="h-fc-${a.id}"><span class="fc-aspect__no">${n + 1}</span> ${a.label} <span class="fc-aspect__rule">${a.rule}</span></h3>
        <p class="fc-aspect__q"></p><p class="fc-aspect__why"></p></div><div class="fc-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.fc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.fc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.fc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'fc-col';
        col.setAttribute('data-fc-option', String(at + 1));
        col.innerHTML = `<p class="fc-label"><span class="fc-label__no">${at + 1}</span> <span class="fc-label__name"></span>${
            at === 0 ? ' <span class="fc-label__rec">Recommended</span>' : ''
        }</p><p class="fc-see"></p><p class="fc-verdict"></p>
        <div class="fc-scene" data-fc-kind="${a.kind}" data-fc-${a.id}="${o.key}" data-fc-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.fc-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.fc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.fc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('fc-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#fc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part.
const BANDS = { picks: [200, 520, 800, 3200], brisk: [120, 200, 480, 2000], slow: [300, 780, 1200, 4800] };
for (const scene of section.querySelectorAll('[data-fc-durations]')) {
    const [contact, fold, grow, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-fc-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-fc-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms`);
    say('fold', `${fold} ms`);
    say('grow', `${grow} ms`);
    say('loop', `${loop} ms a pass`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-fc-motion]');
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
    for (const scene of section.querySelectorAll('.fc-scene[data-fc-kind="cycle"]')) scene.setAttribute('data-fc-phase', phase);
    if (phase === 'in') {
        tick += 1;
        for (const num of section.querySelectorAll('.fc-scene[data-fc-kind="cycle"] [data-fc-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('.fc-scene[data-fc-kind="cycle"] [data-fc-word]'))
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
radio('data-fc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--fc-slow', String(slow));
    run(0);
});
radio('data-fc-state', (value) => {
    section.setAttribute('data-fc-show', value);
});
document.querySelector('[data-fc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.fc-scene a, .fc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided forest components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=forest`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-fc-gallery]'));
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
