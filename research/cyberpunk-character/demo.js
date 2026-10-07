// What makes cyberpunk cyberpunk (Kenny, 2026-10-07 04:23: after nostromo,
// "the rest one by one", cyberpunk first), the same way as titanium, forest
// and nostromo (02:54: "waar jij eerst uitzoekt wat bij mekaar past, wat niet
// past en dan zo voorstellen doet").
//
// A review-kit demo in aspect mode, cyberpunk only. Each ASPECT is one rule
// of the theme's grammar (themes/cyberpunk/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-cy-<aspect>="<key>"`) that options.css reads. The recommended
// option is always first. The page's one clock (below) plays every scene
// that arrives, opens, presses, updates or leaves, so the rule is seen in
// action; the clock only writes attributes, it never reads layout. The
// network graph is in no scene: it changes in no theme (Kenny, 02:54), so it
// is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The target lock of a warning (G13): the reticle's corners and the mono tag; options.css shows them per option. */
const lock = (tag = 'TARGET') =>
    `<span class="cy-bracket" aria-hidden="true"></span><span class="cy-tag" aria-hidden="true">${tag}</span><span class="cy-band" aria-hidden="true"></span>`;

/** Every loading picture an option may draw over a waiting part; options.css shows one. */
const LOAD = `<span class="cy-load" aria-hidden="true"><span class="cy-ret"></span><span class="cy-stream"></span><span class="cy-today"></span><span class="cy-la"></span><span class="cy-lb"></span><span class="cy-lc"><i>1C</i><i>BD</i><i>55</i><i>E9</i></span></span>`;

/** The change on a square mono chip with the package's arrows. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta cy-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/** A holo plate's outward glow: a drop shadow on a wrapper follows the plate's notch, which a box shadow on the plate cannot. */
const glow = (html, cls = '') => `<div class="cy-glow ${cls}">${html}</div>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter cy-meter" role="meter" aria-label="Uplink, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** The chart's black ice: a void plot, the yellow tripwire grid, a yellow trace. */
const plot = (cls = '', extra = '') => `<div class="cy-plot ${cls}" aria-hidden="true"><svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="cy-plot__trace" points="0,36 20,30 40,33 60,22 80,26 100,16 120,20 140,12 160,14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" pathLength="1"/></svg>${extra}<span class="cy-plot__read">FLOW 412</span></div>`;

const PART = {
    dialog: () => `<div class="kp-dialog cy-dialog cy-arrives cy-opens" role="group" aria-label="A dialog opening">
        <p class="kp-dialog__title cy-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: () => `<div class="cy-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="cy-glow cy-pop-wrap"><div class="kp-popover cy-pop cy-plate cy-arrives cy-opens"><ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div></div>
    </div>`,
    tile: (label = 'Node 01', body = '4.2 Gb/s · 12 ms') =>
        glow(`<div class="kp-card cy-plate cy-tile cy-arrives">
        <p class="kp-card__title cy-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`),
    kpi: (label = 'Traffic now', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        glow(`<div class="kp-kpi cy-plate cy-kpi ${cls}" ${extra}>
        <span class="kp-kpi__label cy-label">${label}</span>
        <span class="kp-kpi__value cy-figure cy-carrier" data-cy-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`),
    tracks: () => `<div class="cy-tracks" aria-hidden="true">
        <span class="cy-groove"><span class="cy-track" data-cy-r="1"></span></span>
        <span class="cy-groove"><span class="cy-track" data-cy-r="2"></span></span>
        <span class="cy-groove"><span class="cy-track" data-cy-r="3"></span></span>
    </div>`,
    days: (n = 7, from = 12) =>
        `<div class="cy-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="cy-day cy-arrives" style="--i: ${i}">${from + i}</span>`)
            .join('')}</div>`,
    rows: () =>
        `<div class="cy-rows" aria-hidden="true">${['NODE 01 · 412', 'NODE 02 · 398', 'NODE 03 · 451']
            .map((t, i) => `<span class="cy-row-line cy-arrives" style="--i: ${i}">${t}</span>`)
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="cy-state" data-cy-kind="${kind}"><span class="cy-state__dot cy-carrier cy-carrier--dot" aria-hidden="true"></span><span class="cy-state__word cy-carrier" data-cy-word>${word}</span>${lock(
            kind === 'bad' ? 'TARGET' : 'CAUTION',
        )}</span>`,
    alert: (text = 'Node 04 is back online.') => `<div class="kp-alert cy-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<div class="cy-spark-wrap"><span class="kp-kpi__label cy-label">Traffic, 24 h</span><span class="cy-spark cy-carrier cy-carrier--line" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" pathLength="1"/></svg></span></div>`,
    column: (label = 'Open', value = '38') =>
        `<div class="cy-column"><span class="kp-kpi__label cy-label">${label}</span><span class="cy-column__num cy-figure cy-carrier" data-cy-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="cy-skel" aria-hidden="true">${[0, 1, 2]
            .map((i) => `<span class="cy-skel__line" style="--i: ${i}"><span class="kp-skeleton"></span>${LOAD}</span>`)
            .join('')}</div>`,
    bar: (label = 'Sync busy') =>
        `<div class="kp-progressbar cy-bar cy-waits" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span>${LOAD}</div>`,
    field: () =>
        `<label class="kp-field cy-field"><span class="kp-field__label">Node</span><input class="kp-field__input" value="North 01" /></label>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate ${cls}"><ul class="kp-menu" role="menu">${items
                .map(
                    (t, i) =>
                        `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' cy-pointed' : ''}">${t}</button></li>`,
                )
                .join('')}</ul></div>`,
            'cy-glow--static',
        ),
};
const caption = (text) => `<p class="cy-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="cy-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Three readouts move to their mark', PART.tracks(), 'cy-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'cy-part--wide') +
    cell('A list of readings is printed', PART.rows()) +
    cell('A tile arrives', PART.tile()) +
    cell('A line is drawn on a plot', plot('cy-walk'));

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell('Contact: a press', `<div class="cy-row">${button('Export readings', 'cy-tap')}</div><p class="cy-readout" data-cy-readout="contact"></p>`) +
    cell('A glitch: a dialog opens', PART.dialog() + '<p class="cy-readout" data-cy-readout="glitch"></p>') +
    cell(
        'A live change: a figure stutters',
        `<div class="kp-kpis">${PART.kpi('Packets', '18 240')}</div><p class="cy-readout" data-cy-readout="live"></p>`,
    ) +
    cell(
        'A loop: a tile waits',
        `${glow(`<div class="kp-card cy-plate cy-tile cy-waits" aria-busy="true"><p class="kp-card__title cy-title">Node 02</p><p class="kp-card__body cy-faint">Reading…</p>${LOAD}</div>`)}<p class="cy-readout" data-cy-readout="loop"></p>`,
    );

const warnKpi = () =>
    PART.kpi('Latency', '81 ms', chip('12 ms', 'down', 'bad'), 'cy-warn', 'data-kp-tone="warning"').replace(
        '<span class="kp-kpi__label',
        `${lock('CAUTION')}<span class="kp-kpi__label`,
    );

const COLOUR = () =>
    cell(
        'Buttons, one pointed at, and a state',
        `<div class="cy-row">${button('Export', 'cy-pointed')}${button('Jack in', 'kp-button--primary')}${PART.state('Running')}</div>`,
    ) +
    cell('A plot and its reading', plot()) +
    cell(
        'Key figures, a warning among them',
        `<div class="kp-kpis cy-kpi-row">${PART.kpi('Traffic now', '412')}${warnKpi()}</div>`,
        'cy-part--wide',
    ) +
    cell(
        'A waiting tile',
        glow(
            `<div class="kp-card cy-plate cy-tile cy-waits" aria-busy="true"><p class="kp-card__title cy-title">Node 02</p><p class="kp-card__body cy-faint">Reading…</p>${LOAD}</div>`,
        ),
    ) +
    cell(
        'A link and the picked day',
        `<p class="cy-prose">See the <a href="#cy-intro">night log</a> for details.</p><div class="cy-days cy-days--pick">${[12, 13, 14, 15]
            .map((d) => `<span class="cy-day${d === 13 ? ' cy-picked' : ''}">${d}</span>`)
            .join('')}</div>`,
    ) +
    cell('A meter', meter(0.62, 0.8));

const CORNERS = () =>
    cell('Card', PART.tile('Node 01', 'Uplink 71 %').replace(' cy-arrives', '')) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Traffic now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="cy-row">${button('Export')}<span class="kp-badge cy-tagged">12 new</span><span class="kp-tag cy-chip2">Nodes</span></div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip cy-tip" role="tooltip">14:00 · 412 Gb</div>`) +
    cell('A dialog', PART.dialog().replace(' cy-arrives cy-opens', ''));

const SURFACE = () =>
    cell('Card', PART.tile('Node 01', 'Uplink 71 %').replace(' cy-arrives', '')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Packets', '18 240')}</div>`) +
    cell('The plot of a chart', plot()) +
    cell('Meter', meter(0.62, 0.8)) +
    cell(
        'Buttons and a tag',
        `<div class="cy-row">${button('Export')}${button('Jack in', 'kp-button--primary')}<span class="kp-badge cy-tagged">12 new</span></div>`,
    ) +
    cell('Field', PART.field());

/** The tone scene replays only the lock; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-cy-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis cy-kpi-row">${PART.kpi('Traffic now', '412')}${warnKpi()}</div>`,
            'cy-part--wide',
        ) +
            cell(
                'A failed tile',
                glow(
                    `<div class="kp-card cy-plate cy-tile cy-bad" data-kp-tone="destructive">${lock(
                        'TARGET',
                    )}<p class="kp-card__title cy-title">Node 03</p><p class="kp-card__body">No signal since 06:40</p></div>`,
                ),
            ) +
            cell('A failed state', PART.state('Failed', 'bad')) +
            cell(
                'A menu with a destructive entry',
                glow(
                    `<div class="kp-popover cy-pop cy-pop--static cy-plate"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive cy-bad">${lock(
                        'TARGET',
                    )}Delete</button></li></ul></div>`,
                    'cy-glow--static',
                ),
            ) +
            cell(
                'A meter turning to warning',
                `<div class="cy-meter-wrap cy-warn">${lock('CAUTION')}${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word and its light', PART.state('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.column()) +
    cell(
        'Dashboard tile',
        glow(
            `<div class="kp-card cy-plate cy-tile cy-live-tile"><span class="cy-surge" aria-hidden="true"></span><p class="kp-card__title cy-title">Node 02</p><p class="kp-card__body"><span class="cy-carrier" data-cy-num>4.2 Gb/s</span></p></div>`,
        ),
    );

const LOADERS = () =>
    cell('The progress bar itself, busy', PART.bar('Sync busy'), 'cy-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis">${glow(
            `<div class="kp-kpi cy-plate cy-kpi cy-waits" aria-busy="true"><span class="kp-kpi__label cy-label">Packets today</span><span class="kp-kpi__value cy-figure cy-faint">18 240</span><span class="kp-kpi__trend cy-faint">on yesterday</span>${LOAD}</div>`,
        )}</div>`,
    ) +
    cell(
        'Busy table',
        glow(
            `<div class="cy-table cy-plate cy-waits" aria-busy="true"><span>Node</span><span>Traffic</span><span class="cy-faint">North 01</span><span class="cy-faint">412</span>${LOAD}<span class="cy-word" aria-hidden="true"></span></div>`,
        ),
    ) +
    cell(
        'Menu, loading entry',
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item cy-waits" aria-busy="true">Loading nodes…${LOAD}</button></li></ul></div>`,
            'cy-glow--static',
        ),
    ) +
    cell(
        'Month heatmap days',
        `<div class="cy-days cy-days--wait">${[1, 2, 3, 4, 5].map((d) => `<span class="cy-day cy-waits" style="--i: ${d - 1}">${d}${LOAD}</span>`).join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="cy-plot cy-plot--wait cy-waits" aria-busy="true">${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="cy-meter-wait cy-waits" aria-busy="true">${meter(0.62, 0.8, 'data-kp-loading')}${LOAD}</div>`);

/** One spinner in ten drawings; options.css shows the option's. */
const spin = (size = '', label = 'Working…', hidden = false) =>
    `<span class="cy-spin"${hidden ? ' aria-hidden="true"' : ` role="status" aria-label="${label}"`}${
        size ? ` style="--cy-spin: ${size}"` : ''
    }><span class="cy-spin__ret"></span><span class="cy-s1"></span><span class="cy-s2"></span><span class="cy-s3"></span><span class="cy-s4"></span></span>`;

const SPINNERS = () =>
    cell('Three sizes', `<div class="cy-row cy-spins">${['1rem', '1.5rem', '2.5rem'].map((s) => spin(s)).join('')}</div>`, 'cy-part--wide') +
    cell(
        'A busy button',
        `<button type="button" class="kp-button kp-button--primary cy-busy-button" aria-busy="true">${spin('', '', true)}Saving…</button>`,
    ) +
    cell(
        'The busy panel',
        glow(
            `<div class="kp-card cy-plate cy-busy-panel">${spin('1.75rem', 'Reading the nodes')}<p class="kp-card__body">Reading the nodes…</p></div>`,
        ),
    );

/** A part that leaves and arrives. */
const leaver = (html) => `<div class="cy-leaver">${html}</div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.tile('Node 01', 'Uplink 71 %').replace(' cy-arrives', ''))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis">${glow(
                `<div class="kp-kpi cy-plate cy-kpi"><span class="kp-kpi__label cy-label">Traffic now</span><span class="kp-kpi__value cy-figure">412</span></div>`,
            )}</div>`,
        ),
    );

/**
 * A part of a composite with the pieces some options draw around it: a key cap
 * or number (`.cy-hk`), the rim tab (`.cy-tab`), and its name for the read-out
 * (`data-cy-name`). options.css shows the pieces an option names and none
 * otherwise, so every option is the same markup. `cy-live` marks the one part
 * of its composite the read-out and the focus pull belong to.
 */
const slot = (html, name, cap = '', cls = '') =>
    `<span class="cy-slot ${cls}" data-cy-name="${name}">${cap ? `<i class="cy-hk" aria-hidden="true">${cap}</i>` : ''}${html}<i class="cy-tab" aria-hidden="true"></i></span>`;

/** A menu entry as a slot: the list item carries the pieces, the button stays the package's own. */
const menuSlot = (text, cap, cls = '') =>
    `<li role="none" class="cy-slot cy-slot--fill ${cls}" data-cy-name="${text.replace('…', '').toUpperCase()}"><i class="cy-hk" aria-hidden="true">${cap}</i><button type="button" role="menuitem" class="kp-menu__item">${text}</button><i class="cy-tab" aria-hidden="true"></i></li>`;

const COMPOSITES = () =>
    cell(
        "Alone: the theme's own button, for reference",
        `<div class="cy-row">${button('Export readings')}${button('Jack in', 'kp-button--primary')}</div>`,
        'cy-part--wide',
    ) +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header cy-header cy-host"><div class="kp-page-header__inner"><div><p class="kp-page-header__title cy-title">Nodes</p><p class="kp-page-header__description">Fifteen on the northern grid.</p></div>
        <div class="kp-page-header__actions">${slot(button('Export', 'kp-button--sm cy-in-header'), 'EXPORT', 'E', 'cy-live')}${slot(button('Add', 'kp-button--sm kp-button--primary cy-in-header'), 'ADD', 'A')}</div></div></header>`,
        'cy-part--wide',
    ) +
    cell(
        'Menu: its entries',
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate cy-in-menu cy-host"><ul class="kp-menu" role="menu">${menuSlot('Open incident', '1', 'cy-live')}${menuSlot('Assign to…', '2')}</ul></div>`,
            'cy-glow--static',
        ),
    ) +
    cell(
        'Tile: its Open link',
        glow(
            `<div class="kp-card cy-plate cy-tile cy-in-tile cy-host"><p class="kp-card__title cy-title">Node 01</p>${slot(
                '<a class="kp-button kp-button--ghost kp-button--sm cy-tile-link" href="#cy-intro">Open</a>',
                'OPEN',
                '↵',
                'cy-live',
            )}</div>`,
        ),
    ) +
    cell(
        'Drawer: its tour buttons',
        glow(
            `<div class="kp-card cy-plate cy-drawer cy-host"><p class="kp-card__title cy-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="cy-row">${slot(
                button('Skip', 'kp-button--sm kp-button--ghost'),
                'SKIP',
                'S',
                'cy-live',
            )}${slot(button('Next', 'kp-button--sm kp-button--primary'), 'NEXT', 'N')}</div></div>`,
        ),
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis">${glow(
            slot(
                `<a class="kp-kpi cy-plate cy-kpi cy-in-kpi" href="#cy-intro"><span class="kp-kpi__label cy-label">Traffic now</span><span class="kp-kpi__value cy-figure">412</span><span class="kp-kpi__trend">avg 15 min</span></a>`,
                'TRAFFIC NOW',
                'T',
                'cy-slot--fill cy-live',
            ),
        )}</div>`,
    );

/** One list entry of the hover scene; the pointed one carries `cy-aim`. */
const aimEntry = (text, aimed = false) =>
    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${aimed ? ' cy-aim' : ''}">${text}</button></li>`;

/**
 * Hover: every part is pointed at by the clock (`cy-aim`): in `gap` nothing is,
 * in `in` the pointer arrives, in `hold` it rests, in `out` it leaves.
 */
const HOVER = () =>
    cell(
        'Buttons: the pointer arrives on each one, rests, leaves',
        `<div class="cy-row">${button('Export readings', 'cy-aim')}${button('Jack in', 'kp-button--primary cy-aim')}</div>`,
    ) +
    cell(
        'Menu: the pointer arrives on the first entry',
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate"><ul class="kp-menu" role="menu">${aimEntry('Open incident', true)}${aimEntry('Assign to…')}${aimEntry('Rename')}</ul></div>`,
            'cy-glow--static',
        ),
    ) +
    cell(
        'Tile: the pointer arrives on the card',
        glow(
            `<div class="kp-card cy-plate cy-tile cy-aim"><p class="kp-card__title cy-title">Node 01</p><p class="kp-card__body">4.2 Gb/s · 12 ms</p></div>`,
        ),
    ) +
    cell(
        'Key figures: the pointer arrives on the first',
        `<div class="kp-kpis cy-kpi-row">${glow(
            `<a class="kp-kpi cy-plate cy-kpi cy-aim" href="#cy-intro"><span class="kp-kpi__label cy-label">Traffic now</span><span class="kp-kpi__value cy-figure">412</span></a>`,
        )}${glow(
            `<a class="kp-kpi cy-plate cy-kpi" href="#cy-intro"><span class="kp-kpi__label cy-label">Latency</span><span class="kp-kpi__value cy-figure">31</span></a>`,
        )}</div>`,
    ) +
    cell(
        'Calendar days: the pointer arrives on the second',
        `<div class="cy-days">${[12, 13, 14, 15].map((d) => `<span class="cy-day${d === 13 ? ' cy-aim' : ''}">${d}</span>`).join('')}</div>`,
    );

/** A button inside the focus scene sits in a wrapper, so an outline outside the notch can follow the cut. */
const fw = (html) => `<span class="cy-fw">${html}</span>`;

/**
 * Focus: the clock moves keyboard focus onto each part (`cy-focused`): in `gap`
 * focus is elsewhere, in `in` Tab lands on it, in `hold` it stays, in `out`
 * it moves away.
 */
const FOCUS = () =>
    cell('Button: Tab lands on it', `<div class="cy-row">${fw(button('Export readings', 'cy-focused'))}</div>`) +
    cell(
        'Page header: Tab lands on an action',
        `<div class="cy-header-mini">${fw(button('Export', 'kp-button--sm cy-in-header cy-focused'))}</div>`,
    ) +
    cell(
        'Key figure used as a link: Tab lands on it',
        `<div class="kp-kpis">${glow(
            `<a class="kp-kpi cy-plate cy-kpi cy-in-kpi cy-focused" href="#cy-intro"><span class="kp-kpi__label cy-label">Traffic now</span><span class="kp-kpi__value cy-figure">412</span></a>`,
        )}</div>`,
    ) +
    cell(
        'Menu: the arrow key lands on an entry',
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate cy-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item cy-focused">Assign to…</button></li></ul></div>`,
            'cy-glow--static',
        ),
    ) +
    cell(
        'Calendar: an arrow key lands on a day',
        `<div class="cy-days"><span class="cy-day">13</span><span class="cy-day cy-focused">14</span><span class="cy-day">15</span></div>`,
    ) +
    cell(
        'Tile: Tab lands on its Open link',
        glow(
            `<div class="kp-card cy-plate cy-tile cy-in-tile"><p class="kp-card__title cy-title">Node 01</p>${fw(
                '<a class="kp-button kp-button--ghost kp-button--sm cy-tile-link cy-focused" href="#cy-intro">Open</a>',
            )}</div>`,
        ),
    );

/**
 * Press: the clock presses every part down (`cy-press`) in `in`, holds it down
 * through `hold` and lets go in `out`, so each option shows the whole of
 * "mouse button down, held, released".
 */
const PRESS = () =>
    cell('Button: the mouse button goes down on it', `<div class="cy-row">${button('Export readings', 'cy-press')}</div>`) +
    cell('Primary button: the mouse button goes down on it', `<div class="cy-row">${button('Jack in', 'kp-button--primary cy-press')}</div>`) +
    cell(
        'Menu entry: pressed down',
        glow(
            `<div class="kp-popover cy-pop cy-pop--static cy-plate"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item cy-press">Assign to…</button></li></ul></div>`,
            'cy-glow--static',
        ),
    ) +
    cell('Calendar day: pressed down', `<div class="cy-days"><span class="cy-day cy-press">14</span></div>`) +
    cell(
        'Key figure used as a filter: pressed down',
        `<div class="kp-kpis">${glow(
            `<button type="button" class="kp-kpi kp-kpi--toggle cy-plate cy-kpi cy-press" aria-pressed="false"><span class="kp-kpi__label cy-label">Open incidents</span><span class="kp-kpi__value cy-figure">3</span></button>`,
        )}</div>`,
    ) +
    cell(
        'Chart legend key: pressed down',
        `<div class="cy-row"><button type="button" class="cy-key cy-press" aria-pressed="false"><span class="cy-key__swatch" aria-hidden="true"></span>Node 01</button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        glow(`<div class="kp-card cy-plate cy-type"><p class="cy-type__label">Northern grid</p><p class="cy-type__head">Node 04</p>
        <p class="cy-type__prose">Latency rose after the night relay switched; the crew checks it at 07:30.</p>
        <p class="cy-type__figure"><span class="cy-figure">81</span> <small>ms</small> ${chip('12 ms', 'down', 'bad')}</p>
        <div class="cy-type__strip">${[
            ['Traffic', '412'],
            ['Packets', '18 240'],
            ['Nodes', '15'],
        ]
            .map(([l, v]) => `<div><span class="cy-label">${l}</span><span class="cy-figure">${v}</span></div>`)
            .join('')}</div>
        <table class="cy-type__table"><tbody><tr><th scope="row">Traffic</th><td>412 Gb/s</td></tr><tr><th scope="row">Last reading</th><td><span class="kp-timestamp">2026-10-07 07:12</span></td></tr></tbody></table>
        <p>${button('Open the log', 'kp-button--sm')} <span class="kp-badge cy-tagged">12 new</span></p></div>`),
        'cy-part--wide',
    );

const MOTIFS = () =>
    cell('Meter with its mark', meter(0.62, 0.8)) +
    cell(
        'Chart events on a plot',
        plot(
            'cy-events',
            '<span class="cy-events__mark" style="--x: 37.5%; --y: 46%"></span><span class="cy-events__mark" style="--x: 75%; --y: 42%"></span>',
        ),
    ) +
    cell('Card', PART.tile('Node 01', 'Uplink 71 %').replace(' cy-arrives', '').replace('cy-tile', 'cy-tile cy-motif-card')) +
    cell(
        'Button and a list',
        `<div class="cy-row">${button('Log a reading', 'cy-motif-button')}</div><ul class="cy-motif-list"><li><span class="cy-label">North 01</span></li><li><span class="cy-label">South 02</span></li></ul>`,
    ) +
    cell(
        'Empty state',
        `<div class="kp-empty cy-motif-empty"><p class="kp-empty__title">No readings yet</p><p class="kp-empty__body">The first arrives within the hour.</p></div>`,
    ) +
    cell('A divider between two sections', `<p class="cy-cap">Nodes</p><div class="cy-divider" data-kp-divider></div><p class="cy-cap">Links</p>`);

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
        question: 'How does cyberpunk move: a signal acquired in hard ticks, smoothly on its register’s curve, or in even steps along a path?',
        why: 'A theme exists to be distinct (your rule of 03:37). Cyberpunk’s register curve, cubic-bezier(0.2, 0.9, 0.2, 1), is synthwave’s exactly and almost titanium’s. Every family you picked for cyberpunk moves in hard ticks (Glitch in, the lock-on, Target locked, the count-down stutter), and the stutter lands its copies 6, 4, 2, 1 px off and then home.',
        kind: 'cycle',
        scene: MOVING,
        options: [
            {
                key: 'jitter',
                name: 'Hard ticks: it jitters home',
                see: 'Every motion is a run of held poses, 60 ms each, and every close is the same ticks backwards. When a readout moves, it does not travel: it lands at its mark at once, overshot sideways, and jitters home (+18, −12, +8, −4, +1, 0 px). When a dialog opens, a menu drops from its button or a tile arrives, it tears in as bands that grow out from the middle line (8, 28, 48, 68, 84, 96 % of its height), jumping sideways with a cyan and a red copy, and lock. Closing shrinks the same bands back in the same ticks and the whole part is gone on the last tick, no strip left behind; when a figure updates, its copies stutter home in four ticks.',
                verdict: rec(
                    'it is how your stutter and your glitch-in already move, gathered into one clock, and no other theme moves like it: the hard-step themes (terminal, retro, grotesk, brutalism) step along a path, cyberpunk lands off to the side and locks.',
                ),
            },
            {
                key: 'swing',
                name: 'Whiplash: slapped sideways, it swings back and settles',
                see: 'When a readout moves to a new value, a dialog opens, a menu drops from its button or a tile arrives: the whole part is slapped 28 px sideways and sheared, with a cyan and a red copy, then swings back across its place, each tick less and on the other side (18, 11, 6, 3, 1 px). No bands, the part is whole from the first tick; the readouts swing across the room around their mark. Closing is the same swings backwards, growing, and the whole part is gone on the last tick.',
                verdict: not(
                    'it is the jitter with more weight: the whole part bounces instead of being torn, which reads as rubber and spring, and a tear is what a hacked signal does. The jitter keeps the bands.',
                ),
            },
            {
                key: 'ghost',
                name: 'Triple vision: two copies are drawn in to the part',
                see: 'When a readout moves, a dialog opens, a menu drops from its button or a tile arrives: the part stands in its place at once and does not move; a cyan and a red copy of it stand 36 px out, left and right, and are drawn in to it (36, 24, 15, 8, 3, 1 px), like a misregistered print locking. The readouts stand at their mark with a cyan copy at the place they came from and a red one at the far end. Closing pushes the copies out again, and the part and its copies are gone on the same tick.',
                verdict: not(
                    'it is the anchor (the cyan and red copy) shown as the whole motion, but nothing is torn or thrown sideways, and a part standing whole from the first tick is closer to a fade of the copies than to a jitter.',
                ),
            },
            {
                key: 'weave',
                name: 'Interlace: two fields weave into one picture',
                see: 'When a readout moves, a dialog opens, a menu drops from its button or a tile arrives: first only the even scan lines of the part show, 12 px out; then only the odd ones, 9 px back; then the even ones 6 px, the odd ones 3, 1, 1 px, and then the two fields lie in one picture. The readouts land at their mark in alternate fields. Closing weaves the fields apart again, in the same ticks backwards, and the part is gone on the last tick.',
                verdict:
                    'Second choice, the best of the new three: it jitters home like your pick, in hard ticks and on both sides of the mark, but through a picture that only a CRT or a VHS tape does (Blade Runner’s scan lines, Ghost in the Shell’s monitors). Not first, because the jitter with its bands is what you picked and it is the tear of the glitch itself.',
            },
            {
                key: 'smooth',
                name: 'Smooth, on the register’s curve (synthwave’s, nearly titanium’s)',
                see: 'The same parts on cubic-bezier(0.2, 0.9, 0.2, 1) with no ticks: the readouts glide to their mark and settle, the panels rise 10 px and fade in, the copies glide home.',
                verdict: not(
                    'it is calm and modern, but it is synthwave’s curve to the decimal and almost titanium’s: cyberpunk would move like its neighbours.',
                ),
            },
            {
                key: 'steps',
                name: 'Even steps along a path (nostromo’s frame clock, terminal’s steps)',
                see: 'The readouts walk to their mark in six equal steps; the panels are uncovered from the start edge in six steps; the copies shrink in six equal steps.',
                verdict: not(
                    'it is digital, but it travels along a path as nostromo’s frame clock and terminal’s steps do; nothing is torn or acquired.',
                ),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion go when something arrives or is drawn?',
        why: 'A glitch tears a picture sideways, in horizontal bands; text is decoded the way it is read (left to right here, mirrored in right-to-left languages). Today the header menu, three loading pictures (the data rain, the packet rain) and the tiles’ live surge come down from the top; titanium feeds everything start → end.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'sideways',
                name: 'Sideways tears; reading start → end',
                see: 'The days tear in one after another in reading order, each a band jumping left and right; the list is decoded row by row, each row left to right in hard ticks; the tile tears in; the line is decoded left to right.',
                verdict: rec('a tear in a signal is horizontal, decoding follows the eye, and the sideways jitter is cyberpunk’s alone.'),
            },
            {
                key: 'feed',
                name: 'Everything start → end (titanium’s)',
                see: 'One axis for everything: the days, every row and the tile are uncovered from their left edge at once, smoothly, the line drawn left to right.',
                verdict: not('tidy, but nothing glitches any more: it is titanium’s machine feed exactly.'),
            },
            {
                key: 'top',
                name: 'Down from the top (the rain)',
                see: 'Everything drops in from its top edge in four hard steps, like the header menu’s packet rain and the data rain picks: the days, the rows one under the other, the tile, the line.',
                verdict: not(
                    'it is the falling code of the films, but it fights the sideways glitch you picked for arrivals, and a cut from the top in steps is titanium’s opening.',
                ),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'Your arrival family is the menu’s Glitch in: the panel tears into place as bands with a cyan and red split and locks clean. The toast already does this. Today the dialog opens from a yellow line across its middle (your signature pick of 2026-10-03, at a quarter speed, 1.5 s), the header menu drops from the top in four steps, the drawer slides in, the navbar’s menu drops 6 px.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'glitch',
                name: 'Glitched in',
                see: 'When a menu drops from its button or a dialog opens after a click: it tears in as horizontal bands that grow from the middle line (8, 28, 48, 68, 84, 96 % of its height), jumping sideways with a cyan and a red copy, smaller each tick, and lock clean after 6 ticks (360 ms). Closing is exactly that backwards: the bands shrink steadily to the middle line and the whole part is gone on the sixth tick, with no last strip left standing.',
                verdict: rec('it is your arrival family on every panel, it never squashes a letter, and no other theme opens like a torn signal.'),
            },
            {
                key: 'rows',
                name: 'Row shuffle: the rows flash in out of order',
                see: 'When a menu drops from its button or a dialog opens after a click: the part is eight rows, and they flash in out of order, 1, 2, 4, 5, 7 and then all 8 of them at 60 ms a tick, thrown sideways with a cyan and a red copy, smaller each tick, and lock. Closing takes the rows away again in the same ticks backwards: the last row to arrive is the first to go, and every row is gone on the same tick.',
                verdict:
                    'Second choice, the closest to your glitched in: the same sideways tear and split, but the bands arrive scrambled, like a bad signal, instead of growing from the middle. Not first, because your pick already is that tear and this one is busier on a menu with only three entries.',
            },
            {
                key: 'blocks',
                name: 'Macroblocks: the panel pops in as scattered blocks',
                see: 'When a menu drops from its button or a dialog opens after a click: the part is twelve blocks (four by three), and they pop in scattered, 2, 4, 6, 8, 10 and then all 12 at 60 ms a tick, each tick keeping the blocks of the one before and thrown sideways, then it locks clean. Closing is the same ticks backwards, the blocks dropping out of the corrupted picture until none is left, all on the same tick.',
                verdict: not(
                    'it is the datamosh look of a broken video stream and the most visibly corrupted of the three, but it hides the menu entries behind blocks for 240 ms, which is slow for something you open to read.',
                ),
            },
            {
                key: 'flicker',
                name: 'Power flicker: the panel blinks into place',
                see: 'When a menu drops from its button or a dialog opens after a click: the whole panel blinks. It shows 18 px out and split in cyan and red; goes dark for a tick; shows 10 px back; goes dark; shows 4 px out, then 1 px, and holds. Closing is the same blinks backwards and the panel is gone on the last tick.',
                verdict: not(
                    'it is a signal dropping out, but the dark ticks make a menu look broken instead of torn, and nothing grows or covers: the panel is whole or absent.',
                ),
            },
            {
                key: 'crt',
                name: 'The dialog’s CRT line (your 2026-10-03 dialog; nostromo’s proposed tube strike)',
                see: 'A thin bright line across the middle of the panel holds, then opens to the full height; at your quarter speed the dialog takes 1.5 s, the menu too; closing plays it backwards, back to the line, in the same 1.5 s.',
                verdict: not(
                    'it is your own dialog pick and it is beautiful slowed down, but it is the opening nostromo’s grammar proposes for its tube, and 1.5 s is long for a menu.',
                ),
            },
            {
                key: 'cut',
                name: 'Cut from the top in steps (the header menu’s packet rain; titanium’s cut)',
                see: 'The menu and the dialog are uncovered from their top edge down in four hard steps (320 ms); closing covers them back up in the same four steps.',
                verdict: not('clear and quick, but uncovering from the top is titanium’s opening; the steps alone do not make it cyberpunk.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question: 'How long does a contact, a glitch, a live change and a loading loop take?',
        why: 'The recommended times count whole ticks of 60 ms: 180 ms is the register’s own contact (3 ticks), 360 ms a glitch (6, your toast’s and almost your menu’s 380), 480 ms the stutter you picked (8), 1800 ms the lock-on you picked (30). Today cyberpunk runs at twenty-four one-shot durations and eight loop periods.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'ticks',
                name: 'Ticks: 180 · 360 · 480 · 1800 ms',
                see: 'A press answers in 3 ticks; the dialog glitches in in 6; a figure stutters home in 8; the reticle hunts and locks once per 1.8 s.',
                verdict: rec('every number is a whole count of ticks, two of them are your own picks, and the pace is quick without being nervous.'),
            },
            {
                key: 'brisk',
                name: 'Brisk: 120 · 240 · 360 · 1200 ms',
                see: 'Everything about a third faster: a press in 2 ticks, the glitch in 4, the stutter in 6, the reticle hunts every 1.2 s.',
                verdict: not('it feels fast, but the glitch becomes a flicker and the hunting reticle reads nervous.'),
            },
            {
                key: 'slow',
                name: 'Slow: 300 · 600 · 720 · 2400 ms',
                see: 'Everything two-thirds slower: a press lags, the glitch tears in over 0.6 s, the reticle takes 2.4 s a cycle.',
                verdict: not('atmospheric once, but a press that lags 300 ms feels broken and a menu that takes 0.6 s is in the way.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5',
        question: 'What may be yellow, what cyan, what red?',
        why: 'The anatomy of 5.0.0: yellow acts and grounds, red alarms, cyan labels, violet is the glitch copy. Today the header’s buttons are cyan (cyan acts), the calendar picks a day in cyan, the key figure loads in green, and two tone frames are drawn in the dark warning plate, which reads 1.6:1 on the card (measured).',
        kind: 'still',
        scene: COLOUR,
        options: [
            {
                key: 'roles',
                name: 'Yellow acts, cyan reads, red alarms',
                see: 'Yellow on what you do and on the holo’s rim: the primary button, the pointed button’s circuit, the picked day’s frame. Cyan on what the system reads out: labels, the reticle, the link at rest. A warning in its amber ink with its target brackets. Green only in the state light.',
                verdict: rec('every colour has one job, as the anatomy says, and the warning reads 11:1 instead of 1.6:1.'),
            },
            {
                key: 'cyan',
                name: 'Cyan acts',
                see: 'Cyan on what you do, as the header’s beam buttons and the calendar’s pick do today: the primary button, the pointed button’s ring, the picked day, the link, the holo’s rim in cyan as the tiles’ words describe it.',
                verdict: not(
                    'cool and very neon, but yellow stops meaning “act”, and a cyan rim plus cyan labels leaves nothing to read the system by.',
                ),
            },
            {
                key: 'mix',
                name: 'As today',
                see: 'The header’s cyan beam button, the key figure’s green loading packet on the waiting tile, the warning framed in the dark warning plate (1.6:1), the picked day in cyan.',
                verdict: not('four colours act, and the warning frame is hard to see on the void.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'Which corners does cyberpunk have?',
        why: 'The anatomy says radius 0, every corner square or cut by the notch. Your holo card (the shape family) draws a 0.3 rem rounded corner, as do the key figure and the busy panel; elsewhere fourteen notch sizes live side by side. Titanium cuts a pair of corners on every plate.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'notch',
                name: 'Square or notched: 14 px plates, 8 px controls',
                see: 'A card, the menu panel and the key figure cut 14 px at their top-end corner (the dossier corner); the button, the tag and the tooltip 8 px at their bottom-end corner, the way they point (the button’s own 14 px stays); the dialog keeps its pair on the other diagonal.',
                verdict: rec('it is the corner every cyberpunk part already wears, in two sizes you can learn, and it is nobody else’s.'),
            },
            {
                key: 'soft',
                name: 'The holo’s 0.3 rem on everything (dark’s and synthwave’s soft corner)',
                see: 'Every part rounded 0.3 rem, as your holo card draws it: card, menu, key figure, button, tag, tooltip and dialog; no notch.',
                verdict: not('it is the holo card exactly as you saw it, but a soft corner is dark’s and synthwave’s, and the notch was the theme.'),
            },
            {
                key: 'pair',
                name: 'A pair of cut corners on every part (titanium’s chamfer)',
                see: 'Every part cut 10 px at its top-left and bottom-right corners.',
                verdict: not('crisp and machined, but it is titanium’s chamfer diagonal exactly.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G7',
        question: 'What is a plate in cyberpunk?',
        why: 'Your shape family is the tiles’ holo card: a neon rim glowing in and out, diagonal scan lines, a mark as a diamond. Today only the tiles, the key figure and the header carry it; the register’s card is a hairline dossier with no glow.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'holo',
                name: 'Every plate a holo card',
                see: 'The card and the key figure: the void plate with a 1 px yellow rim glowing 10 px inward and outward, scan lines at 135°, the notch. The chart keeps its black ice; the buttons and the field stay the register’s controls; nothing glows but rims and lines.',
                verdict: rec(
                    'it is your shape pick on every plate, so a card and a tile are one material, and the glow stays on the rim where it reads as neon.',
                ),
            },
            {
                key: 'dossier',
                name: 'The register’s dossier',
                see: 'Every plate a dark card in a faint yellow hairline (22 %), no glow, no scan lines, the 16 px dossier notch: the register as it is.',
                verdict: not('quiet and readable, but it drops your shape pick: the holo would live on the tiles only.'),
            },
            {
                key: 'neon',
                name: 'Neon on everything (synthwave’s way)',
                see: 'The holo on every plate and a glow on the buttons, the tag, the field and every figure and title too.',
                verdict: not('loud and fun once, but glowing text blurs, and neon glow on everything is synthwave’s look.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show?',
        why: 'Your tone family is the menu’s Target locked: red reticle corners frame the destructive entry with a TARGET tag, and they twitch for as long as it stands. Today the tiles and the trend frame the whole part (2 and 3 px, partly in the dark warning plate, 1.6:1), the state word wears dashed hazard brackets, the calendar hazard bands, the meter jolts up and down.',
        kind: 'cycle',
        scene: TONE,
        options: [
            {
                key: 'lock',
                name: 'Target locked, then holds',
                see: 'The reticle’s corner brackets, 2 px, in the tone’s ink (red for failed, amber for a warning), close on the part twice as it turns, then hold still; a mono tag at its end says TARGET or CAUTION. The change sits on its square chip.',
                verdict: rec(
                    'it is your tone family on every part, it reads at once, and a warning that holds still never competes with the loading reticle beside it.',
                ),
            },
            {
                key: 'twitch',
                name: 'Target locked, twitching (your menu pick as it is)',
                see: 'The same brackets and tag, twitching in and out every 1.6 s for as long as the warning stands.',
                verdict: not(
                    'it is your pick exactly and very alive, but on a dashboard with three failures three reticles twitch forever, and they look like loading.',
                ),
            },
            {
                key: 'band',
                name: 'A hazard band',
                see: 'A striped hazard band in the tone’s ink along the top of the part, as your calendar’s hazard roster draws a night that went wrong.',
                verdict: not(
                    'it is cyberpunk’s own, but hazard stripes already mean “armed” (the switch, the alarm), and a band on a key figure reads as decoration.',
                ),
            },
            {
                key: 'frame',
                name: 'The full frame (the tiles’ and the trend’s picks; nostromo’s klaxon)',
                see: 'The whole part framed 3 px all round in the tone, the warning in the dark warning plate as the picks draw it.',
                verdict: not(
                    'it reads from across the room in red, but the warning frame is 1.6:1 on the card, and a full frame is nostromo’s klaxon.',
                ),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update on every carrier',
        rule: 'G9',
        question: 'The count-down stutter is decided (02:49). How does it land on a part that is not text?',
        why: 'The package plays the stutter on text: two neon copies, yellow right and up, cyan right and down, come home 6, 4, 2, 1 px in four ticks. A line takes its new point at once, a state light has no copy to show. Today the components still play their own: the key figure and the trend flare (dark’s and synthwave’s live picture), the state light brightens, the tile’s scanline surges, the strip column shakes.',
        kind: 'cycle',
        scene: LIVE,
        options: [
            {
                key: 'shape',
                name: 'Every carrier stutters, a shape with copies of itself',
                see: 'The figures and the word stutter as decided; the state light and the trend line stutter copies of their own shape (yellow up, cyan down, 6, 4, 2, 1 px); the tile’s figure stutters. Nothing else moves.',
                verdict: rec('one picture for one event on every carrier, and the value itself never moves.'),
            },
            {
                key: 'text',
                name: 'Only text stutters (the package today)',
                see: 'The figures and the word stutter; the light and the line take the change at once, without a sign.',
                verdict: not('it is the package as built, but a change of the light or the line passes unseen.'),
            },
            {
                key: 'mix',
                name: 'As the components play it today',
                see: 'The key figure’s glow flares and burns down, the state light brightens, the line flares, the strip column shakes sideways, a yellow scanline streaks down the tile.',
                verdict: not('five pictures for one event, and three of them are dark’s and synthwave’s flare.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'Ten complete loading designs, each one drawn on the same eight waiting parts: the progress bar, a key figure, a busy table, a menu entry that loads, the days of a month, a chart plot, skeleton lines and a meter that is measuring. They replace the lock-on and the ten mixed pictures; the reticle lives on as the spinner. Each is a scene from cyberpunk media, in the theme’s own colours (yellow acts, cyan reads, violet is the glitch copy) and its own clock.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'net',
                name: 'The netrun: a data stream in three lanes',
                see: 'Wherever something waits for data (the progress bar, a key figure, a busy table, a loading menu entry, a day of the month, a chart, skeleton lines, a meter) three thin lanes run through it from start to end at three speeds. Each carries comets with a white head and a cyan and a violet ghost copy trailing right of it, one up and one down: the glitch’s own split. A cyan sync line steps across in 60 ms ticks, and on a part with room a mono address ticks in the corner (0x4F2A · 412 PKT). 1.8 s a loop.',
                verdict: rec(
                    'it is the progress bar’s data stream carried to every waiting part, but fuller: three speeds, comets that tear into the glitch’s split copies, a sync line and a readout; the lines are 1 to 2 px thick, so the words under them stay readable, and no other theme streams comets.',
                ),
            },
            {
                key: 'scrub',
                name: 'Braindance scrub (Cyberpunk 2077)',
                see: 'A braindance editor’s timeline along the foot of the waiting part: ticks, and a cyan analysed zone that grows from the start behind a yellow playhead with a flag, one 60 ms tick at a time, then rewinds to the start. Where there is room a timecode counts in the corner (00:00 to 00:05).',
                verdict: not(
                    'it reads as "working through something" and is straight from the game, but the zone is a growing tint over the words, so it reads like a determinate progress bar that never finishes.',
                ),
            },
            {
                key: 'typed',
                name: 'A terminal prompt is typed (the Matrix)',
                see: 'A mono prompt is typed letter by letter, start to end, in glowing cyan with a block cursor (> read), the cursor blinks, the line is cleared and typed again. Where there is room a second line answers (0x7F OK) once the first is done. 1.8 s.',
                verdict: not(
                    'quiet and legible, but it is text on the waiting part: on the 14 px bar and the day cells it is tiny, and it competes with the faint words under it.',
                ),
            },
            {
                key: 'esper',
                name: 'Esper enhance (Blade Runner)',
                see: 'Two thin cyan lines, a crosshair, jump across the waiting part in hard hops and a zoom frame closes round the crossing, smaller at every hop, until it locks: the frame turns yellow and blinks. Then the crosshair jumps away and starts over. Where there is room a mono line reads ENHANCE 224·176.',
                verdict: not('very Blade Runner, but a frame closing on a point is the reticle again, which is now the spinner’s picture.'),
            },
            {
                key: 'dive',
                name: 'Ghost dive: rings leave a core (Ghost in the Shell)',
                see: 'A small yellow core blinks in the middle of the waiting part and cyan outlines of the part’s own shape leave it one after another, growing in hard ticks until they reach the edge and go out. Three rings are in flight at once. 1.8 s a loop.',
                verdict: not(
                    'calm and clear at any size, but it spreads from the middle outward, which is not how this theme reads (start to end, G2), and it is a radar ping, a common sci-fi trope.',
                ),
            },
            {
                key: 'vitals',
                name: 'Vitals trace (Akira)',
                see: 'A heart-monitor line, a flat run with a sharp spike, lies dim across the waiting part; a yellow head sweeps it from start to end in 60 ms ticks and leaves it lit cyan behind it, then the line goes dim again. 1.8 s.',
                verdict: not(
                    'one line works on parts of any height, but a heartbeat says "alive" or "alarm" more than "waiting", and the hospital cue is far from this theme’s hardware.',
                ),
            },
            {
                key: 'lattice',
                name: 'Augmentation lattice (Deus Ex)',
                see: 'A fine yellow honeycomb of hexagons lies dim over the waiting part; a band of it lights up bright yellow, with a cyan copy shifted right and up, and sweeps from start to end in 60 ms ticks. 1.8 s.',
                verdict: not(
                    'the richest on big parts (the chart, the key figure), but on a skeleton line or the bar the honeycomb turns into a texture, and it is nostromo’s amber lamp bank in a different pattern.',
                ),
            },
            {
                key: 'osd',
                name: 'Signal loss: the word glitches (VHS on-screen text)',
                see: 'The waiting part dims and the word LOADING is deciphered over it from noise glyphs, start to end, then holds in neon with a cyan copy right and up and a red copy right and down, tears sideways in a few ticks and is sliced away before it is deciphered again. 1.8 s.',
                verdict: not(
                    'it says in words what is happening and is the glitch anchor itself, but it hides the words of the waiting part under a word, and on the 14 px bar and the day cells it is a shrunken word.',
                ),
            },
            {
                key: 'cycles',
                name: 'Light cycles (Tron)',
                see: 'Two light trails, one cyan and one yellow, chase each other clockwise round the rim of the waiting part, each with a glowing head and a fading tail: one lap in 1.8 s, in a straight smooth run.',
                verdict: not(
                    'it frames the part like the reticle did and looks great on the key figure and the table, but it runs smooth where this grammar steps, and on the bar and the skeleton lines the two trails sit on top of each other.',
                ),
            },
            {
                key: 'breach',
                name: 'Breach protocol (Cyberpunk 2077)',
                see: 'A row of four hex codes (1C BD 55 E9) in small cyan frames; they are picked one after another from start to end, each turning solid yellow with dark ink in one tick, then the whole buffer drains in the same order. 1.8 s.',
                verdict: not(
                    'an instantly recognisable game reference, and legible, but the codes are text that needs room: three show on a day, and on a skeleton line they sit in a small row that says nothing about its length.',
                ),
            },
        ],
    },
    {
        id: 'spinner',
        label: 'The spinner',
        rule: 'G11',
        question: 'What does cyberpunk’s spinner show?',
        why: 'The spinner is the one loading part too small to hunt across. You liked the reticle locking on its core, so it stays first; nine other spinners follow, each shown at the same three sizes, in a busy button (where the ink takes the button’s colour) and in the busy panel. Today’s register spinner, the scanning cut square, is gone from this page.',
        kind: 'loop',
        scene: SPINNERS,
        options: [
            {
                key: 'reticle',
                name: 'The reticle locks on its core',
                see: 'Four corner brackets close on the cyan core in hard ticks, blink the lock cyan and yellow, and open again, once per 1.8 s. Seen whenever a small thing waits: a busy button, a busy panel, a loading line.',
                verdict: rec(
                    'it is your pick, and the target lock is also this theme’s warning word, so the smallest wait speaks the same language as the largest; no other theme has it.',
                ),
            },
            {
                key: 'bars',
                name: 'Signal bars jump',
                see: 'Four cyan bars with a yellow cap stand side by side and jump between heights in hard 120 ms ticks, each on its own beat, like a signal meter that cannot settle. Seen in a busy button, a busy panel or a loading line.',
                verdict: not(
                    'very recognisable and busy-looking, but a level meter is a sound icon, and bars that rise and fall are what G2 forbids for the page.',
                ),
            },
            {
                key: 'count',
                name: 'A digit counts down (Akira)',
                see: 'A cut square holds one yellow digit that counts 9, 8 … 0 in 180 ms ticks; on 0 it flashes with a cyan copy right and up and a red copy right and down, and starts again at 9.',
                verdict: not('the most cinematic, but a countdown says "something ends in 9 ticks", which a wait of unknown length never keeps.'),
            },
            {
                key: 'tear',
                name: 'The square tears (the glitch itself)',
                see: 'A solid yellow square holds still, then tears: horizontal bands of it jump sideways with a cyan copy right and up and a red copy right and down, smaller each tick, and snap whole again. About 1.8 s, a third of it torn.',
                verdict: not(
                    'the theme’s anchor as a spinner and the strongest alternative to the reticle, but unlike the others it holds still for two thirds of a loop, so at 1 rem it can read as stuck.',
                ),
            },
            {
                key: 'barcode',
                name: 'A barcode is read (Blade Runner ID)',
                see: 'A cyan barcode changes its bars in three hard poses while a yellow scan line hops across it from start to end; then it starts over. 1.8 s.',
                verdict: not('it reads as an ID check, not as waiting, and at 1 rem the bars are single pixels.'),
            },
            {
                key: 'chevrons',
                name: 'Chevrons run',
                see: 'Three chevrons (> > >) light yellow one after another from start to end, each for a short beat, over a dim cyan row; then all go dim and the run starts again. 1.8 s.',
                verdict: not(
                    'clear and fast to read and it follows start to end, but it is a "forward" sign, closer to a play button than to a wait.',
                ),
            },
            {
                key: 'ratchet',
                name: 'The cross ratchets round',
                see: 'A cyan cross with one yellow tip turns in eight hard steps of 45°, 180 ms each, one turn per 1.4 s: the one spinner here that turns.',
                verdict: not(
                    'it is the only one that looks like a spinner at a glance, but turning is every theme’s default picture; forest’s compass, nostromo’s reel and blueprint’s compass all turn.',
                ),
            },
            {
                key: 'charge',
                name: 'A cell charges',
                see: 'A cut square outline fills with yellow from the start to the end in six ticks, flashes full cyan once and empties, once per 1.2 s.',
                verdict: not('easy to read, but it looks like a progress bar that never ends, the thing a spinner is meant not to be.'),
            },
            {
                key: 'neon',
                name: 'A neon tube stutters (Blade Runner signs)',
                see: 'A square sign of two tubes, a cyan upper-left half and a yellow lower-right half, glows and flickers on its own beats like a broken neon sign, with a spark in the middle. About 1.8 s a loop.',
                verdict: not('the most atmospheric, but a flicker has no direction, so it does not say "progress", only "alive".'),
            },
            {
                key: 'hazard',
                name: 'Hazard stripes crawl',
                see: 'A cut square window filled with yellow hazard stripes that crawl from start to end, inside a cyan frame, linear, 0.9 s a loop.',
                verdict: not(
                    'it says "work in progress", but hazard stripes are this theme’s warning picture (the armed state), and a spinner that looks like a warning is read as one.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'What leaves plays the register’s leave; what arrives plays that leave backwards (you approved the pairing on 2026-10-05). Today the leave is the classic glitch you picked on 2026-10-04: the text turns cyan, a cyan and a red copy drift out, the box is sliced away, 650 ms, every frame tweened smoothly.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'torn',
                name: 'Torn out, glitched in, in ticks',
                see: 'Leaving, the part is torn into bands that jump sideways with the cyan and red copies and is gone on the sixth tick (360 ms). Arriving plays it backwards, which is the glitch-in of your menu.',
                verdict: rec('it is your classic glitch kept, on the theme’s clock, and the arrival it gives is your arrival family exactly.'),
            },
            {
                key: 'today',
                name: 'The classic glitch as today',
                see: 'Leaving, the text turns cyan, the copies drift out smoothly, the box sways and is sliced to its middle line, 650 ms; arriving, the same backwards.',
                verdict: not('it is your 2026-10-04 pick, but its frames melt into each other: a smooth glitch beside hard-ticked ones.'),
            },
            {
                key: 'tube',
                name: 'Collapsed to a line (nostromo’s tube switched off)',
                see: 'Leaving, the part collapses to a bright line through its middle, the line to a dot, and the dot goes out; arriving, the reverse.',
                verdict: not('clean, and close to your dialog’s line, but it is the leave nostromo’s grammar proposes for its tube.'),
            },
            {
                key: 'seam',
                name: 'Squeezed to a seam, widened from a seam',
                see: 'When an alert, a card or a menu leaves the page, it narrows toward its vertical middle line in five hard ticks of 60 ms (78, 55, 36, 20, 7 % of its width), jumping sideways with a cyan and a red copy, and is gone on the sixth (360 ms). When it arrives, the seam widens to the full part in the same ticks backwards.',
                verdict: not(
                    'clear and quick and it reverses cleanly, but it is a narrower cousin of the tube, and the words squash flat before they can be read.',
                ),
            },
            {
                key: 'notch',
                name: 'Sucked into its corner, grown out of its corner',
                see: 'When a part leaves the page, it shrinks toward its top corner at the end of the line (84, 66, 48, 30, 14 % of its size) in hard ticks, split in cyan and red, and is gone on the sixth tick (360 ms). When it arrives, it grows out of that corner in the same ticks backwards.',
                verdict: not(
                    'grow and shrink are exact opposites and it reads as a window minimised, but it is the one option that scales the words, and a scaled word is never a glitch.',
                ),
            },
            {
                key: 'rows',
                name: 'Rows drop out, rows come back',
                see: 'When a part leaves the page, it is eight rows and they drop out of order (7, 5, 4, 2, 1 of them stay), thrown sideways and split in cyan and red, until none is left on the sixth tick (360 ms). When it arrives, the rows come back in the same ticks backwards. The opening question’s “rows” is the same thing.',
                verdict: not(
                    'it is a clean scan-line failure and pairs with the opening of the same name, but the gaps run through the words, so a half-gone part is hard to read.',
                ),
            },
            {
                key: 'blocks',
                name: 'Macroblocks drop out, blocks come back',
                see: 'When a part leaves the page, it is twelve blocks (four by three) and they vanish scattered (10, 8, 6, 4, 2 of them stay) at 60 ms a tick until none is left (360 ms). When it arrives, the blocks come back in the same ticks backwards, the datamosh of a broken video stream. It pairs with the opening question’s “macroblocks”.',
                verdict: rec(
                    'it is the most visibly corrupted without touching the words’ shape, and every piece goes on the same tick, so nothing lingers; second choice after the torn leave.',
                ),
            },
            {
                key: 'unwrite',
                name: 'Un-decoded: erased from the end, decoded from the start',
                see: 'When a part leaves the page, it is erased from its end back to its start (12, 28, 46, 68, 88 % gone), the cut edge jittering and split in cyan and red, and is gone on the sixth tick (360 ms). When it arrives, it is decoded from start to end, the way text is read.',
                verdict: not(
                    'it reads like a terminal wiping a line and the arrival is a pleasure to read, but a sweep from one side is the uncover of other themes, so only the jitter makes it ours.',
                ),
            },
            {
                key: 'flicker',
                name: 'Powered down: blinks out, blinks in',
                see: 'When a part leaves the page, it stands 2 px out, goes dark for a tick, shows 6 px back, goes dark, shows once more 16 px out and split in cyan and red, and is gone (360 ms). When it arrives, the same blinks play backwards. It pairs with the opening question’s “flicker”.',
                verdict: not(
                    'it is a signal dropping out, but a part that is whole or absent has no middle, and the dark ticks make it look broken instead of torn.',
                ),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside composites',
        rule: 'G17',
        question:
            'When a button sits inside a page header, a menu, a tile or a drawer, is it cyberpunk’s own button, and does the composite add anything around it?',
        why: 'Today the header’s actions are cyan beam buttons with a cyan glow ring and a press mixed with black, the menu’s entries surge a yellow edge, the tile’s Open link is cut to a parallelogram that clips its own focus outline away, and the key figure has a single warning-coloured focus line at 1.6:1. Options 4 to 8 keep the button exactly as option 1 has it (its own circuit, its own ring, its own closed circuit) and let the composite draw one extra piece around it. Press the State buttons above (Hover, Focus, Press) to show every part hovered, focused or pressed; at Rest only the key caps and the sockets show, the other pieces wait for a state.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'own',
                name: 'Exactly cyberpunk’s own button',
                see: 'Every inner button, link and entry (the header’s Export and Add, the menu’s entries, the tile’s Open, the drawer’s Skip and Next, the key figure link) hovers, focuses and presses exactly like the button standing alone at the top: the circuit lights, the inset two-channel ring, the closed circuit. The composite adds nothing.',
                verdict: rec(
                    'a control is a control wherever you meet it: one hover to learn, one focus ring to trust. This is the option you preferred.',
                ),
            },
            {
                key: 'today',
                name: 'As today',
                see: 'The header’s cyan beam buttons, the menu’s yellow surge edge, the tile link’s parallelogram, the key figure’s warning-coloured focus line.',
                verdict: not('four kinds of control on one page, two cyan where cyan should only read, and two focus rings that cannot be seen.'),
            },
            {
                key: 'beam',
                name: 'Cyberpunk’s button, the header in cyan',
                see: 'Every button is cyberpunk’s own; the header’s actions keep their cyan frame and ink as the holo strip’s mark.',
                verdict: not('a fair middle way, but cyan buttons act in the one colour that should only read.'),
            },
            {
                key: 'keycap',
                name: 'Key caps: every action names its key',
                see: 'In front of each action in the header, the drawer and the tile (and at the end of each menu entry, in the corner of the key figure) a small cut cap shows its key in cyan mono: E, A, 1, 2, ↵, S, N, T, the way a game’s prompt names a key. With State on Hover the cap’s frame turns yellow, on Focus it takes the two-channel ring, on Press it fills cyan, as if the key went down. The button itself is option 1’s.',
                verdict: not(
                    'it teaches the shortcut where it exists, but it promises a key that is not always wired, and the caps crowd the narrow header and the drawer.',
                ),
            },
            {
                key: 'socket',
                name: 'Sockets: every action sits in a numbered slot',
                see: 'Each action, entry and link sits in a recessed void slot with a 1 px rim and its number on the rim, like a quickhack bar. State Hover lights the slot’s rim yellow, Focus draws a two-channel ring on the slot, Press fills the slot with a yellow wash. The button inside is option 1’s.',
                verdict: not(
                    'it shows at rest what is pressable, and it is very game HUD, but every control gets a second frame: a frame inside a frame, and the focus ring then sits on the slot, not on the button.',
                ),
            },
            {
                key: 'tab',
                name: 'Rim tab: the composite marks where the live part stands',
                see: 'When a part inside a composite is hovered, focused or pressed, the composite’s own rim grows a 3 px tab (5 px on Press) on the edge nearest it, exactly as wide as the part: under the header’s Export, beside the menu entry, under the tile’s Open and the drawer’s Next, along the foot of the key figure. Hover yellow, Focus ring colour with a contrast line, Press thicker. The button is option 1’s.',
                verdict:
                    'Best of the new ones: this one, because it adds no text and no second frame: the composite only says, with its own rim, which of its parts is live, and at rest nothing is added.',
            },
            {
                key: 'callout',
                name: 'Callout: a leader and a read-out name the live part',
                see: 'When a part is hovered, focused or pressed, a 1 px cyan leader drops from it to a mono read-out that names it: > EXPORT on Hover, > EXPORT [ENTER] on Focus, > EXPORT // SENT on Press (inside the entry or the key figure for those). The composite makes room for the line under its actions. The button is option 1’s.',
                verdict: not(
                    'it is the HUD annotation of Cyberpunk 2077 and Ghost in the Shell and the most informative, but it is text on every hover, the composite grows to hold it, and the words have to be written per part.',
                ),
            },
            {
                key: 'host',
                name: 'The host takes part: the composite lights its own rim',
                see: 'While any part inside is hovered the composite lights its circuit grid and brightens its yellow rim (the header’s cyan rim); on Focus the rim doubles to 2 px; on Press the grid goes full and the rim glows. The part itself is option 1’s.',
                verdict: not(
                    'it shows that the whole card is engaged, but the card lights even when you point at its title’s neighbour, and it competes with the tile’s own hover.',
                ),
            },
        ],
    },
    {
        id: 'hover',
        label: 'Pointing at something',
        rule: 'G8',
        question:
            'What does a part do when the mouse pointer arrives on it, while the pointer rests there, and when the pointer leaves again? (A button, a menu entry, a card, a key figure that is a link, a calendar day.)',
        why: 'None of the three earlier options (the circuit lights, the charge runs, as today) was right, so these are six new ones, all built from the glitch, the theme’s anchor, and from the HUD of Cyberpunk 2077, Watch Dogs and the Matrix terminals. In every scene the page’s clock plays one pointer: it is away for half a second, arrives on the part, rests on it for about 2.7 seconds and leaves. The arrival is three ticks of 60 ms (180 ms) and the leave is those same three frames played backwards, so nothing lingers.',
        kind: 'cycle',
        scene: HOVER,
        options: [
            {
                key: 'flash',
                name: 'Glitch flash: the words flash and stay neon',
                see: 'The moment the pointer arrives on a button, a menu entry, a card, a key figure or a calendar day, its words flash: a cyan copy stands right and up, a red copy right and down (4.5 px, then 3, then 1.5) and both are gone after three ticks. While the pointer rests, the words stay neon cyan (the yellow Jack in button keeps its dark ink and its face lifts a little toward smoke). When the pointer leaves, the same three frames play backwards and the part is at rest.',
                verdict: rec(
                    'it is the anchor of the theme at the size of a pointer (neon words, a cyan and a red copy), it moves nothing under the pointer, and the resting state reads at 13:1 (cyan on the card).',
                ),
            },
            {
                key: 'static',
                name: 'Static: a checker of noise flickers over the part',
                see: 'When the pointer arrives, a fine checker of the part’s own ink flickers over its whole face for three ticks, 72 %, 52 %, 32 % strong and shifting each tick, and settles to a faint 12 % dither that stays while the pointer rests. On leaving, the three frames play backwards.',
                verdict: not(
                    'it is the screen of a hacked monitor and does not move anything, but the dither also lies over the words, which at 12 % is quiet and over a long list gets restless.',
                ),
            },
            {
                key: 'tear',
                name: 'Tear: the part is thrown sideways and jitters home',
                see: 'When the pointer arrives, the whole part is thrown 4.5 px to one side and jitters home in three ticks (−4.5, 3, −1.5, 0 px, the way the theme’s glitch-in lands); a 3 px bar stays on its end edge while the pointer rests. On leaving, the same jitter plays backwards.',
                verdict: not(
                    'it is the theme’s own landing used as a hover, but the part moves under the pointer (up to 4.5 px) and on a small target it can slip out from under it.',
                ),
            },
            {
                key: 'split',
                name: 'Split edge: the part’s edge is doubled in cyan and red',
                see: 'When the pointer arrives, the part’s edge is doubled: a cyan band along its top and end, a red band along its foot and end, 5 px thick, then 4, then 3, and 2 px for as long as the pointer rests. On leaving, the bands thicken again in the same three frames backwards and are gone.',
                verdict: not(
                    'it is the glitch’s split drawn as a frame and it is unmistakable, but the split is meant for a signal that changes and here it stands for as long as you point.',
                ),
            },
            {
                key: 'chevron',
                name: 'Chevron: a wedge grows out of the start edge',
                see: 'When the pointer arrives, a yellow wedge pointing inward grows out of the start edge of the part (2.5, 5, 7.5, then 10 px wide) beside a 3 px bar on the edge, as a selected entry looks in Cyberpunk 2077’s menus. It stays while the pointer rests and shrinks away in the same frames backwards.',
                verdict: not(
                    'it is clear and cheap, and a pointer on a list reads like a cursor, but it is a menu selection mark and says nothing glitchy, and on days and key figures it crowds the first word.',
                ),
            },
            {
                key: 'flood',
                name: 'Flood: the part is filled with its ink, start to end',
                see: 'When the pointer arrives, a block of the part’s own ink (yellow on a dark part, dark on the yellow Jack in button) floods it from the start edge to the end in four ticks, a 3 px cyan edge leading, and the words turn to the ground colour as it passes. It stays full while the pointer rests (dark words on yellow, 15.6:1) and drains from the end back to the start on leaving.',
                verdict: not(
                    'it is the strongest and clearest and the closest to the game’s own menus, but it is the loudest on a page of many cards, and for a few ticks the words are unreadable mid-flood.',
                ),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question:
            'What does keyboard focus look like: the moment you press Tab (or an arrow key in a menu or on the calendar) and focus lands on a button, a key figure link, a menu entry, a calendar day or a tile’s Open link, while it stays there, and when it moves on?',
        why: 'The two-channel focus ring is a system constant (DI2): a smoke line and a void line, so it reads on any ground. The register draws it inside the part, which leaves the ring open at the cut corner of a button or a card, and the tiles’ pick clipped it away entirely. These five new options all keep both channels, they differ in where the ring is drawn and how it arrives. In every scene the page’s clock plays one Tab key: focus is elsewhere for half a second, lands on the part, stays about 2.7 seconds and moves on. The arrival is three ticks of 60 ms and the leave plays the same frames backwards.',
        kind: 'cycle',
        scene: FOCUS,
        options: [
            {
                key: 'glitch',
                name: 'Glitch ring: the ring tears in and locks',
                see: 'When Tab lands on a part, a two-channel ring (smoke, then void inside it) is drawn along its whole edge, following the cut corner too; for three ticks a cyan copy of the ring stands right and up and a red copy right and down (6, 4, 2 px) and then they lock behind it. The ring stays while focus stays. When focus moves on, the same frames play backwards and the ring is gone.',
                verdict: rec(
                    'the ring you keep is the system’s own (13.5:1 smoke on void), now closed round the notch, and the arrival is the glitch, so a keyboard user sees where focus landed at once and nothing is ever missing from the final ring.',
                ),
            },
            {
                key: 'float',
                name: 'Floating frame: a two-channel frame just inside the edge',
                see: 'When Tab lands on a part, a second frame appears 3 px inside its own edge (a 2 px smoke line with a 2 px void line inside it), cut at the same corner as the part; the part’s own edge stays. No animation: it is on while focus is on and off when focus moves on.',
                verdict: not(
                    'it is the selected card of the game menus and nothing outside the part can hide it, but it is a double line and covers the first 7 px of the part, which a tight menu entry or a calendar day can hardly spare.',
                ),
            },
            {
                key: 'brackets',
                name: 'Target brackets: four corners close on the part',
                see: 'When Tab lands on a part, four L-shaped corner brackets (smoke outside, void inside, 2 px each) close on it from 9 px in over three ticks and stay on its four corners; no line joins them. When focus moves on they open again, the same frames backwards.',
                verdict: not(
                    'it is the HUD’s targeting reticle and very legible on a dark card, but it is only the corners, below a continuous ring’s area, and the reticle already means loading and a warning in this theme.',
                ),
            },
            {
                key: 'outside',
                name: 'Outline outside: the ring is drawn round the part, cut like it',
                see: 'When Tab lands on a part, a two-channel outline appears just outside it (a 2 px void gap, then a 2 px smoke line), following the cut corner of a button or a card; a menu entry and a day get the same as an outline. No animation. The yellow glow of a card stays.',
                verdict: not(
                    'it leaves the face untouched, so words and the yellow of a primary button stay whole, but it needs 4 px of room round every part and a neighbour or a clipped container can hide it.',
                ),
            },
            {
                key: 'bar',
                name: 'Foot bar: a line is read under the part',
                see: 'When Tab lands on a part, a bar (a 3 px smoke line under a 2 px void line) is drawn along its foot from the start edge to the end in four ticks and stays; on moving on it is withdrawn the same way backwards. There is no ring round the part.',
                verdict: not(
                    'quiet and easy on a dense table or menu, but it is one line, not a ring: a part whose foot is hidden by a neighbour loses it, and it is the weakest of the five for a user who needs a strong focus mark.',
                ),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question:
            'What does a part do while it is held down: from the moment the mouse button goes down on it (or Space or Enter is held on a focused one) until you let go? (A button, a menu entry, a calendar day, a key figure used as a filter, a chart legend key.)',
        why: 'This is the press of a click, not a hover and not a focus. Today a cyberpunk button drops 1 px into its seat while it is held, which is titanium’s press exactly, and the key figure kicks 2 px sideways. Options 4 to 7 are new. In every scene the page’s clock plays one finger: it is up for half a second, goes down on the part, holds it down for about 2.7 seconds and lets go. Every option also gives the held part the register’s pressed shade of its ground. The new options with a mark that stays (4, 5 and 7) draw it in four hard steps (180 ms) and take it back in the same frames reversed when you let go.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'closed',
                name: 'The circuit closes',
                see: 'While a button, a menu entry, a calendar day, a key figure filter or a legend key is held down, its circuit grid lights at full strength (60 %) and its ground takes the pressed shade; the part does not move. Let go and it is back at rest.',
                verdict: rec(
                    'it follows from the hover (the circuit lights, then closes), it never shifts the words, and no other theme presses this way. This is the option you preferred.',
                ),
            },
            {
                key: 'drop',
                name: 'Drops 1 px (titanium’s press; the register today)',
                see: 'While a part is held down it sinks 1 px and takes its pressed shade, and comes back when you let go.',
                verdict: not('small and exact, but it is titanium’s press to the pixel.'),
            },
            {
                key: 'kick',
                name: 'The kick (the key figure’s pick)',
                see: 'While a part is held down it sits 2 px to the side and takes its pressed shade, and returns when you let go.',
                verdict: not('it is a glitch and cyberpunk’s own, but the words jump under the finger on every press.'),
            },
            {
                key: 'armed',
                name: 'Armed: hazard stripes along the foot while held',
                see: 'While a part is held down, a 6 px band of hazard stripes is drawn along its foot from the start edge to the end in four ticks and stays as long as you hold; the part takes its pressed shade. Let go and the stripes are withdrawn the same way backwards. A click fires on release, so the stripes say: armed, let go to fire.',
                verdict: not(
                    'hazard stripes already mean “armed” in this theme (the switch, the alarm) and a held button is exactly that, but the stripes sit under the label and are busy on a small calendar day.',
                ),
            },
            {
                key: 'sliced',
                name: 'Sliced: a line cuts across the part while held',
                see: 'While a part is held down, a 2 px line (the part’s ink with a void edge) is drawn across its middle from the start edge to the end in four ticks and stays as long as you hold, the way the classic glitch slices a part away; the part takes its pressed shade. Let go and the line is withdrawn backwards.',
                verdict: not(
                    'it is the last step of the theme’s leave (sliced away) used as a press and it reads at once, but the line runs through the words.',
                ),
            },
            {
                key: 'recoil',
                name: 'Recoil: the words kick and jitter home',
                see: 'The moment a part goes down, its words kick sideways and jitter home in three ticks (−4.5, 3, −1.5, 0 px) while the part itself stays put; it keeps its pressed shade while held. Nothing happens on letting go.',
                verdict: not(
                    'it is the theme’s landing (hard ticks, off to the side) as the feel of a press, but it is a burst, not a state: after 180 ms a held part only shows the pressed shade.',
                ),
            },
            {
                key: 'ack',
                name: 'Acknowledged: an ACK tag is decoded in the corner',
                see: 'While a part is held down, a small mono ACK tag (cyan frame, cyan letters) is decoded in its top corner from the start to the end in four ticks and stays as long as you hold, as the system confirming the press; the part takes its pressed shade. Let go and the tag is undecoded backwards.',
                verdict: not(
                    'it is the HUD confirming a press, and it says so in words, but it puts text on every press, and on a calendar day or a legend key it covers part of the figure.',
                ),
            },
        ],
    },
    {
        id: 'type',
        label: 'The voice',
        rule: 'G15',
        question: 'Where do the prefixed mono, the condensed display and Rajdhani go?',
        why: 'Cyberpunk has three faces: Big Shoulders Display (condensed headlines), Rajdhani (the body) and KP Tech Mono (the machine’s labels, with prefixes such as ///, > and //). Your key figure and trend set their figures in the mono, which is titanium’s voice exactly (figures, labels and counts in mono) and terminal’s.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'prefixed',
                name: 'Prefixed mono names, the condensed display counts',
                see: 'The label in cyan mono capitals after ///, the table’s heads and the tag in mono; the title and the figure in the condensed Big Shoulders; the prose and the button in Rajdhani.',
                verdict: rec(
                    'each face has one job you can see, the tall condensed figures are the HUD’s own read-out, and no other theme counts in them.',
                ),
            },
            {
                key: 'mono',
                name: 'Mono for figures, labels and counts (titanium’s and terminal’s)',
                see: 'The figure, the label, the tag and the table’s values in the mono; Big Shoulders only for the title.',
                verdict: not('it is how your key figure and trend read today, and very legible, but it is titanium’s voice exactly and terminal’s.'),
            },
            {
                key: 'plain',
                name: 'No machine voice',
                see: 'Labels and tags in Rajdhani in sentence case, no prefixes, the figure in Rajdhani.',
                verdict: not('calm and readable, but the machine stops talking: the prefixes and the mono were half the theme.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Reticles, splits, stripes, streams',
        rule: 'G16',
        question: 'Where do the HUD’s motifs go?',
        why: 'Cyberpunk has a set of motifs: the reticle (loading, a warning, the chart’s lock-on markers, the graph’s lock), the red and cyan split (a signal changing), hazard stripes (the switch, the alarm), scan lines, tripwire dashes, the data stream (the bar, the divider) and the notch. Today the state word and the legend keys wear the split at rest, and hazard stripes mark tones as well as armed parts.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'meaning',
                name: 'Every motif means one thing',
                see: 'The meter’s segment gauge with its target notch; small reticles on the plot’s events; a holo card; the button and a plain list in mono; the empty state with its /// title; the data stream as the divider.',
                verdict: rec(
                    'each motif keeps one meaning: a reticle is always the system targeting, the split always a change, stripes always armed.',
                ),
            },
            {
                key: 'none',
                name: 'Only the notch',
                see: 'A plain bar for the meter, plain dots for the events, a plain card, a plain empty state and a plain rule; only the notch stays.',
                verdict: not('safe, but cyberpunk becomes a dark formal with cut corners: the HUD was the theme.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'The split standing on every label, hazard stripes on the card, reticles round every card and button, the list in /// and the divider in hazard stripes.',
                verdict: not('a film set: the motifs stop meaning anything, and the split at rest blurs the words.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="cyberpunk"]'));
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
lookLine.setAttribute('data-for', 'cyberpunk');
lookLine.textContent = `${ASPECTS.length} questions, one rule of cyberpunk each; the first option of every question is the recommendation. Pick the one that is cyberpunk to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-cy-aspects]'));
const toc = document.querySelector('[data-cy-toc]');
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'cy-aspect';
    box.id = `cy-${a.id}`;
    box.setAttribute('data-cy-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-cy-${a.id}`);
    box.innerHTML = `<div class="cy-aspect__head">
        <h3 id="h-cy-${a.id}"><span class="cy-aspect__no">${n + 1}</span> ${a.label} <span class="cy-aspect__rule">${a.rule}</span></h3>
        <p class="cy-aspect__q"></p><p class="cy-aspect__why"></p></div><div class="cy-trio" data-cy-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.cy-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.cy-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.cy-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'cy-col';
        col.setAttribute('data-cy-option', String(at + 1));
        col.innerHTML = `<p class="cy-label-row"><span class="cy-label-row__no">${at + 1}</span> <span class="cy-label-row__name"></span>${
            at === 0 ? ' <span class="cy-label-row__rec">Recommended</span>' : ''
        }</p><p class="cy-see"></p><p class="cy-verdict"></p>
        <div class="cy-scene" data-cy-kind="${a.kind}" data-cy-${a.id}="${o.key}" data-cy-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.cy-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.cy-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.cy-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('cy-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#cy-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part.
const BANDS = { ticks: [180, 360, 480, 1800], brisk: [120, 240, 360, 1200], slow: [300, 600, 720, 2400] };
for (const scene of section.querySelectorAll('[data-cy-durations]')) {
    const [contact, glitch, live, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-cy-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-cy-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms, ${contact / 60} ticks`);
    say('glitch', `${glitch} ms, ${glitch / 60} ticks`);
    say('live', `${live} ms, ${live / 60} ticks`);
    say('loop', `${loop} ms a cycle, ${loop / 60} ticks`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-cy-motion]');
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
const cycleScenes = [...section.querySelectorAll('.cy-scene[data-cy-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.cy-scene[data-cy-kind="cycle"] [data-cy-num]')];
const words = [...section.querySelectorAll('.cy-scene[data-cy-kind="cycle"] [data-cy-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-cy-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/Gb/.test(text)) num.textContent = tick % 2 ? '4.4 Gb/s' : '4.2 Gb/s';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of words) word.textContent = tick % 2 ? 'Syncing' : 'Running';
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.cy-part') || scene;
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.cy-part') || scene;
    /** @type {Map<Element, number>} */
    const spans = new Map();
    for (const x of arrivals) spans.set(cellOf(x.target), Math.max(spans.get(cellOf(x.target)) || 0, endOf(x.timing)));
    // What came from away goes back to away, in the same instant for every
    // piece of its cell. Played backwards, an arrival ends on its first pose
    // (a sliver of the glitch, a line of the tube) and `fill` would hold that
    // pose until the next gap: the last piece lingered, cut off only later.
    // The part's own `gap` state (hidden) takes over exactly where the close
    // ends, so the first pose of the open and the last pose of the close are
    // the same tick, and the part is gone with the close.
    const away = awayOf.get(scene) || new Set();
    /** @type {Map<Element, number>} */
    const goneAt = new Map();
    for (const x of arrivals) if (!x.pseudo && away.has(x.target)) goneAt.set(x.target, spans.get(cellOf(x.target)) || 0);
    // Read now, play later: the observer reads every scene before it writes any.
    return () => {
        closesOf.set(scene, [
            ...arrivals.map((x) =>
                x.target.animate(x.keyframes, {
                    ...x.timing,
                    delay: (spans.get(cellOf(x.target)) || 0) - endOf(x.timing),
                    endDelay: 0,
                    direction: FLIP[x.timing.direction || 'normal'],
                    fill: FILL_FLIP[x.timing.fill || 'none'],
                    pseudoElement: x.pseudo ?? undefined,
                }),
            ),
            ...[...goneAt].map(([target, at]) =>
                target.animate([{ visibility: 'hidden' }, { visibility: 'hidden' }], { delay: at, duration: 1, fill: 'forwards' }),
            ),
        ]);
        return Math.max(0, ...spans.values());
    };
}

new MutationObserver((records) => {
    const scenes = [...new Set(records.map((r) => /** @type {Element} */ (r.target)))];
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-cy-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-cy-phase'] });

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
radio('data-cy-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--cy-slow', String(slow));
    run(0);
});
radio('data-cy-state', (value) => {
    section.setAttribute('data-cy-show', value);
});
document.querySelector('[data-cy-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.cy-scene a, .cy-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided cyberpunk components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=cyberpunk`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-cy-gallery]'));
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
