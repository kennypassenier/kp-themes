// What makes synthwave synthwave, round 2 (Kenny, 2026-10-07 20:41: ten of the
// eighteen questions approved as recommended, eight asked again with new
// options in his words).
//
// A review-kit demo in aspect mode, synthwave only. Each ASPECT is one rule of
// the theme's grammar (themes/synthwave/CHARACTER.md, G1-G18) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-sy-<aspect>="<key>"`) that options.css reads. The ten approved
// questions are not asked again: they stay applied on every scene as the fixed
// ground (GROUND below; the scenes are drawn as the recommended grammar has
// them). The first option of every question is the recommendation. The page's
// one clock (below) plays every scene that arrives, opens, presses or leaves,
// so the rule is seen in action; the clock only writes attributes and text, it
// never reads layout. The network graph is in no scene: it changes in no theme
// (Kenny, 02:54), so it is a source of the grammar here, never a target.

/* ----------------------------------------------------------- the ground */

/**
 * The ten questions Kenny approved as recommended (decided.json, round 1),
 * written on every scene: options.css keys the parts at rest and the rise over
 * the horizon on them. They are not asked again.
 */
const GROUND = {
    direction: 'horizon',
    durations: 'beats',
    colour: 'roles',
    surface: 'floor',
    live: 'laser',
    spinner: 'sun',
    composites: 'own',
    hover: 'tube',
    type: 'osd',
    motifs: 'meaning',
};
const GROUND_ATTRS = Object.entries(GROUND)
    .map(([k, v]) => `data-sy-${k}="${v}"`)
    .join(' ');

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The stripe along a panel's top (G6, G7) and the four corners' own element (the corners question). */
const STRIP = `<span class="sy-strip" aria-hidden="true"></span><span class="sy-corners" aria-hidden="true"></span>`;

/** The grid floor under a reporting plate's horizon (G7). */
const FLOOR = `<span class="sy-floor" aria-hidden="true"></span>`;

/** The mark of a tone: three cells an option may draw a ring, a symbol, pips or a sun in. */
const RING = `<span class="sy-ring" aria-hidden="true"><i></i><i></i><i></i></span>`;

/** Every layer a loading picture may draw over a waiting part: top band, foot band, the whole face. */
const LOAD = `<span class="sy-load" aria-hidden="true"><i class="sy-g"></i><i class="sy-b"></i><i class="sy-f"></i></span>`;

/** The layer a press may draw in a pressed part. */
const FX = `<span class="sy-fx" aria-hidden="true"></span>`;

/** The ring of a focused part: an option draws it, inset in a framed control, outside a plate. */
const FRING = `<span class="sy-fring" aria-hidden="true"></span>`;

/** The sun that covers a leaving part: five bands (the sun's stripes, widest at the horizon). */
const SUN = `<span class="sy-sun-over" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>`;

/** The change on a 2 px chip with the package's arrows. */
const chip = (text, dir = 'up', tone = 'good') =>
    `<span class="kp-kpi__delta sy-chip" data-kp-tone="${tone}" data-kp-direction="${dir}">${text}</span>`;

/**
 * A part that rises over its horizon and sets behind it (G3, G12): the body,
 * the sun's stripes it passes through (bars in the ground's colour, fixed
 * above the horizon, closing as it rises), then its horizon line.
 */
const rise = (html, cls = '') =>
    `<div class="sy-rise ${cls}">${html}<span class="sy-cuts" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="sy-horizon" aria-hidden="true"></span></div>`;

const meter = (value = 0.62, mark = 0.8, extra = '') =>
    `<div class="kp-meter sy-meter" role="meter" aria-label="Signal, ${Math.round(value * 100)} %" aria-valuenow="${Math.round(
        value * 100,
    )}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${value}; --kp-mark: ${mark}" ${extra}><span class="kp-meter__mark"></span></div>`;

/** A determinate progress bar, the package's own `.kp-progressbar` in synthwave. */
const pbar = (value, label) =>
    `<div class="kp-progressbar sy-bar sy-pbar" role="progressbar" aria-label="${label}, ${Math.round(
        value * 100,
    )} %" aria-valuenow="${Math.round(value * 100)}" aria-valuemin="0" aria-valuemax="100" data-sy-v="${Math.round(
        value * 100,
    )}" style="--kp-value: ${value}"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;

/** The chart's grid floor horizon: a sky over the floor, a neon line, cyan ticks. */
const plot = (cls = '', extra = '') => `<div class="sy-plot ${cls}" aria-hidden="true">${FLOOR}<svg viewBox="0 0 160 48" preserveAspectRatio="none">
        <polyline class="sy-plot__trace" points="0,30 20,26 40,28 60,18 80,22 100,12 120,16 140,8 160,10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1"/></svg>${extra}<span class="sy-plot__read">▶ FLOW 412</span></div>`;

const PART = {
    dialog: () =>
        rise(
            `<div class="kp-dialog sy-dialog sy-panel" role="group" aria-label="A dialog opening">${STRIP}
        <p class="kp-dialog__title sy-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
            'sy-opens',
        ),
    menu: () => `<div class="sy-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        ${rise(
            `<div class="kp-popover sy-pop sy-panel">${STRIP}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'sy-opens sy-pop-wrap',
        )}
    </div>`,
    tile: (label = 'Node 01', body = '4.2 Gb/s · 12 ms', cls = 'sy-arrives') =>
        rise(
            `<div class="kp-card sy-plate sy-tile">${STRIP}${FLOOR}
        <p class="kp-card__title sy-title">${label}</p>
        <p class="kp-card__body">${body}</p>
    </div>`,
            cls,
        ),
    plainTile: (label = 'Node 01', body = 'Uplink 71 %', cls = '') =>
        `<div class="kp-card sy-plate sy-tile ${cls}">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Traffic now', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi sy-plate sy-kpi ${cls}" ${extra}>${STRIP}${FLOOR}
        <span class="kp-kpi__label sy-label">${label}</span>
        <span class="kp-kpi__value sy-figure sy-carrier" data-sy-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    pbars: () =>
        `<div class="sy-pbars">${[
            [0.72, 'Sync'],
            [0.48, 'Backup'],
            [0.88, 'Upload'],
        ]
            .map(
                ([v, l]) =>
                    `<div class="sy-pbar-row"><span class="sy-cap">${l} ${Math.round(Number(v) * 100)} %</span>${pbar(Number(v), String(l))}</div>`,
            )
            .join('')}</div>`,
    state: (word = 'Running', kind = 'good') =>
        `<span class="sy-state" data-sy-kind="${kind}">${RING}<span class="sy-state__dot sy-carrier sy-carrier--dot" aria-hidden="true"></span><span class="sy-state__word sy-carrier" data-sy-word>${word}</span></span>`,
    alert: (text = 'Node 04 is back online.') => `<div class="kp-alert sy-alert" role="status"><span class="kp-alert__body">${text}</span></div>`,
    skeleton: () =>
        `<div class="sy-skel" aria-hidden="true">${[0, 1, 2]
            .map((i) => `<span class="sy-skel__line" style="--i: ${i}"><span class="kp-skeleton"></span>${LOAD}</span>`)
            .join('')}</div>`,
    bar: (label = 'Sync busy') =>
        `<div class="kp-progressbar sy-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
    menuStatic: (items = ['Open incident', 'Assign to…'], cls = '', pointed = true) =>
        `<div class="kp-popover sy-pop sy-pop--static sy-panel ${cls}">${STRIP}<ul class="kp-menu" role="menu">${items
            .map(
                (t, i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item${i === 0 && pointed ? ' sy-pointed' : ''}"><span class="sy-entry">${t}</span></button></li>`,
            )
            .join('')}</ul></div>`,
};
const caption = (text) => `<p class="sy-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="sy-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The motion curve: progress bars filling, and the bodies that rise. */
const CURVE = () =>
    cell('Three progress bars fill to their mark', PART.pbars(), 'sy-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A tile arrives', PART.tile());

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const CORNERS = () =>
    cell('Card', PART.plainTile()) +
    cell('Menu panel', PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
    cell('Key figure with its change', `<div class="kp-kpis">${PART.kpi('Traffic now', '412')}</div>`) +
    cell(
        'Button, tag and chip',
        `<div class="sy-row">${button('Export')}<span class="kp-badge sy-tagged">12 new</span><span class="kp-tag sy-chip2">Nodes</span>${chip('6 %')}</div>`,
    ) +
    cell('Tooltip', `<div class="kp-tooltip sy-tip" role="tooltip">14:00 · 412 Gb</div>`) +
    cell(
        'A dialog',
        `<div class="kp-dialog sy-dialog sy-panel" role="group" aria-label="A dialog">${STRIP}<p class="kp-dialog__title sy-title">Close INC-4471?</p><p class="kp-dialog__description">The vendor is told at once.</p></div>`,
    );

const warnKpi = () =>
    PART.kpi('Latency', '81 ms', chip('12 ms', 'down', 'bad'), 'sy-warn', 'data-sy-kind="warn"').replace(
        '<span class="kp-kpi__label sy-label">',
        `<span class="kp-kpi__label sy-label">${RING}`,
    );

/** The tone scene replays only the tone; its figures and words stay as written. */
const steady = (html) => html.replace(/ data-sy-(num|word)/g, '');
const TONE = () =>
    steady(
        cell(
            'Key figures: normal and warning',
            `<div class="kp-kpis sy-kpi-row">${PART.kpi('Traffic now', '412')}${warnKpi()}</div>`,
            'sy-part--wide',
        ) +
            cell(
                'A failed tile',
                `<div class="kp-card sy-plate sy-tile sy-bad" data-sy-kind="bad">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${RING}<span class="sy-toned">Node 03</span></p><p class="kp-card__body">No signal since 06:40</p></div>`,
            ) +
            cell('A failed state', PART.state('Failed', 'bad')) +
            cell(
                'A menu with a destructive entry',
                `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive sy-bad" data-sy-kind="bad">${RING}<span class="sy-toned">Delete</span></button></li></ul></div>`,
            ) +
            cell(
                'A meter turning to warning',
                `<div class="sy-meter-wrap sy-warn" data-sy-kind="warn">${RING}${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
            ),
    );

const LOADERS = () =>
    cell('The progress bar itself, busy (the road): the reference', PART.bar('Sync busy'), 'sy-part--wide') +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi sy-waits" aria-busy="true">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Packets today</span><span class="kp-kpi__value sy-figure sy-faint">18 240</span><span class="kp-kpi__trend sy-faint">on yesterday</span>${LOAD}</div></div>`,
    ) +
    cell(
        'Busy table',
        `<div class="sy-table sy-plate sy-waits" aria-busy="true">${STRIP}<span>Node</span><span>Traffic</span><span class="sy-faint">North 01</span><span class="sy-faint">412</span>${LOAD}</div>`,
    ) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-waits" aria-busy="true">Loading nodes…${LOAD}</button></li></ul></div>`,
    ) +
    cell(
        'Month heatmap days',
        `<div class="sy-days sy-days--wait">${[1, 2, 3, 4, 5]
            .map((d) => `<span class="sy-day sy-waits" style="--i: ${d - 1}"><span class="sy-day__num">${d}</span>${LOAD}</span>`)
            .join('')}</div>`,
    ) +
    cell('Chart plot', `<div class="sy-plot sy-plot--wait sy-waits" aria-busy="true">${FLOOR}${LOAD}</div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Meter, measuring', `<div class="sy-meter-wait sy-waits" aria-busy="true">${meter(0.62, 0.8)}${LOAD}</div>`);

/** A part that leaves and arrives: the part, the sun that may cover it, then its stripes and horizon. */
const leaver = (html) => rise(`<div class="sy-leaver__body"><div class="sy-leaver__part">${html}</div>${SUN}</div>`, 'sy-leaver');
const LEAVE = () =>
    cell('An alert', leaver(PART.alert())) +
    cell('A card', leaver(PART.plainTile())) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></div></div>`,
        ),
    );

const FOCUS = () =>
    cell('Button', `<div class="sy-row">${button(`Export readings${FRING}`, 'sy-focused')}</div>`) +
    cell('Header action', `<div class="sy-header-mini">${button(`Export${FRING}`, 'kp-button--sm sy-in-header sy-focused')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi sy-plate sy-kpi sy-in-kpi sy-focused" href="#sy-intro">${STRIP}${FLOOR}${FRING}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel sy-in-menu">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-focused"><span class="sy-entry">Assign to…</span>${FRING}</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item"><span class="sy-entry">Rename</span></button></li></ul></div>`,
    ) +
    cell(
        'Calendar day',
        `<div class="sy-days"><span class="sy-day"><span class="sy-day__num">13</span></span><span class="sy-day sy-focused"><span class="sy-day__num">14</span>${FRING}</span><span class="sy-day"><span class="sy-day__num">15</span></span></div>`,
    ) +
    cell(
        'Tile link',
        `<div class="kp-card sy-plate sy-tile sy-in-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 01</p><a class="kp-button kp-button--ghost kp-button--sm sy-tile-link sy-focused" href="#sy-intro">Open${FRING}</a></div>`,
    );

const PRESS = () =>
    cell('Button', `<div class="sy-row">${button(`Export readings${FX}`, 'sy-press')}</div>`) +
    cell('Primary button', `<div class="sy-row">${button(`Drive${FX}`, 'kp-button--primary sy-press')}</div>`) +
    cell(
        'Menu entry',
        `<div class="kp-popover sy-pop sy-pop--static sy-panel">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item sy-press"><span class="sy-entry">Assign to…</span>${FX}</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="sy-days"><span class="sy-day sy-press"><span class="sy-day__num">14</span>${FX}</span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle sy-plate sy-kpi sy-press" aria-pressed="false">${STRIP}${FLOOR}${FX}<span class="kp-kpi__label sy-label">Open incidents</span><span class="kp-kpi__value sy-figure">3</span></button></div>`,
    ) +
    cell(
        'Chart legend key',
        `<div class="sy-row"><button type="button" class="sy-key sy-press" aria-pressed="false">${FX}<span class="sy-key__swatch" aria-hidden="true"></span>Node 01</button></div>`,
    );

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, leave), 'loop' scenes loop in CSS, 'still' scenes do
 * not move. `options[0]` is the recommendation.
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: () => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'How does synthwave move: what is the character of a body that travels, shown on its progress bar?',
        why: 'You were not sure about the three curves of round 1 and you like the progress bars, so the curves are drawn on the package’s own bar in synthwave (the sun’s ramp cut by stripes, the glowing head) and on the bodies that rise. Each option fixes how a body travels and what the light does beside it. None overshoots (a bounce is pastel’s) and none is the register’s quick curve (cyberpunk’s, nearly titanium’s). Each takes the same 900 ms for the bars, 450 ms for the dialog.',
        kind: 'cycle',
        scene: CURVE,
        options: [
            {
                key: 'lead',
                name: 'Light leads, the body follows',
                see: 'The glowing head of each bar runs ahead on the sunrise curve and the sun’s ramp follows one beat (225 ms) behind it, catching up at the mark, so the light is always in front of the body. On the dialog and the tile the horizon line strikes first and the panel rises behind it.',
                verdict: rec(
                    'it is how a neon sign behaves (the tube lights before anything else), it makes the bar’s head and ramp tell the story, and no other theme lets light and body run apart.',
                ),
            },
            {
                key: 'transport',
                name: 'Tape transport: spools up, cruises, brakes',
                see: 'Speed builds over the first fifth, holds a steady cruise, and brakes over the last fifth, like a VCR’s tape: the bars fill at an even pace and stop with a soft brake. Panels rise the same way.',
                verdict: not(
                    'it feels like a machine and keeps the pace of the busy bar’s road, but the long cruise is close to titanium’s and grotesk’s even pace, only with ramps.',
                ),
            },
            {
                key: 'beats',
                name: 'Marquee beats: four hard steps',
                see: 'The bars fill in four hard steps of one beat each (225 ms), the head jumping with the fill; panels rise in four steps. Nothing glides.',
                verdict: not(
                    'it is pure marquee (light switches), but a glide is lost: a dialog rises like a ladder, and cyberpunk already moves in held poses (its ticks are finer).',
                ),
            },
            {
                key: 'surges',
                name: 'Charge-up: three surges and two pauses',
                see: 'Each bar fills in three surges, each a short sunrise S, with a pause between them, like an arcade power meter charging. Panels rise in the same three surges.',
                verdict: not(
                    'it has character and nobody else stalls on purpose, but a dialog that stops twice on its way up looks hesitant, and a real progress would be told it is stuck.',
                ),
            },
            {
                key: 'strike',
                name: 'Strike, then burn in',
                see: 'The ink arrives in a flash and then crawls: 85 % of the distance in the first third, the rest slowly while the head burns, like a laser striking a screen and the phosphor filling in.',
                verdict: not(
                    'it is lively, but a fast start with a long tail is the quick-curve family (cyberpunk’s register, solstice’s and nostromo’s easing out), only more extreme.',
                ),
            },
            {
                key: 'sunrise',
                name: 'The sunrise S (round 1’s)',
                see: 'The symmetric S of round 1 on every part: a slow start, a long glide, a slow landing; the head and the ramp travel together.',
                verdict: not(
                    'calm, and no theme moves on a symmetric S, but it is the option you were not sure about: a plain ease-in-out that light’s and pastel’s picks resemble.',
                ),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'You like options 1 and 2 of round 1 (the rise over the horizon with its stripe striking on, and Neon strikes alone) but feel there is more potential for something synthwave-y. Both stay as options 5 and 6; four new, bolder ones are built from the horizon, the sun’s stripes, the grid floor and the marquee. Every close is its open played backwards.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'climb',
                name: 'The laser climbs: the panel is uncovered under a rising beam',
                see: 'A near-white laser line with a pink bloom starts at the panel’s foot and climbs to its top in 2 beats (450 ms); the panel exists only below the line, uncovered as the beam passes, and its top stripe strikes on when the beam arrives. Closing: the beam comes back down and puts the panel out from the top.',
                verdict: rec(
                    'a menu opens as a scan line draws a picture; the beam is the horizon, climbing, and it is your laser family; nobody else opens upward under a line of light (titanium cuts top-down, nostromo’s tube opens from the middle).',
                ),
            },
            {
                key: 'blinds',
                name: 'The sun’s blinds open from the horizon',
                see: 'The panel is there but covered by five bars in the sun’s stripe rhythm (thin at the top, thick at the horizon); the bars draw back one after another, the bottom one first, until the panel stands bare, 450 ms; the horizon line glows at its foot.',
                verdict: not(
                    'only the sun’s stripes do the opening, so nothing but synthwave shows it; in a dialog it is dramatic, in a small menu the slats are quick; grotesk’s flat colour bands also uncover a panel, but sweep sideways and print colour.',
                ),
            },
            {
                key: 'stand',
                name: 'It stands up from the floor',
                see: 'The panel lies flat on the grid floor behind its horizon and stands up around its foot to upright (perspective, 450 ms), like a billboard rising on the road to the horizon; the horizon line glows at its foot.',
                verdict: not(
                    'the boldest, and perspective is what a poster has and no register uses; but it tips a body (G2 lets nothing fall or tip, a hinge is the nearest thing) and the text is foreshortened for a moment.',
                ),
            },
            {
                key: 'marquee',
                name: 'The marquee carries it on',
                see: 'A row of bulbs along the top edge lights start to end in eight hard steps (450 ms) and the panel is uncovered start to end in step with the lit bulbs; then the bulbs go out. Closing: the lights come back and take the panel off end to start.',
                verdict: not(
                    'arcade and hard-beat, but it travels start to end like titanium’s feed and grotesk’s bands, and the marquee already means waiting in this theme (G16).',
                ),
            },
            {
                key: 'rise',
                name: 'Over the horizon, its stripe striking on (round 1’s 1)',
                see: 'A pink horizon line is drawn from the panel’s centre outward along its foot; the panel rises from behind it, cut by the sun’s stripes that close as it rises, and its top stripe strikes on with a neon tube’s dips: 2 beats (450 ms).',
                verdict: not('you like it, and it is the arrival family of every part, but a menu then adds nothing of its own to the page.'),
            },
            {
                key: 'strike',
                name: 'Neon strikes: there at once (round 1’s 2)',
                see: 'The panel is there in one frame; its rim and stripe strike on pink, cyan, pink, cyan in hard steps (340 ms).',
                verdict: not(
                    'you like it and it is very neon, but nothing arrives, and a strike alone is cyberpunk’s trend pick and nostromo’s tube.',
                ),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How do the corners of a panel look?',
        why: 'You like square the most but feel we can do better. Square stays as the baseline (option 6). The five new ideas stay strictly inside the grammar: radius 2 px, every cut horizontal, nothing notched or chamfered, no pills. Buttons, tags, chips and the tooltip keep their 2 px corner in every option; the panels change.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'tubes',
                name: 'Tube ends overshoot the corners',
                see: 'The top stripe and a pink bottom tube run past the plate’s sides by half a rem, like the tubes of a neon sign that cross at the corners of a frame; the sides stay a hairline.',
                verdict: rec(
                    'it is the one corner made of light: a sign’s tubes are straight and overshoot, so the corner needs no rounding and no notch; cyberpunk’s reticle and blueprint’s brackets mark corners with L-shapes, this has horizontal ends only.',
                ),
            },
            {
                key: 'rules',
                name: 'Only the top and bottom rules',
                see: 'Plates have no sides: a stripe along the top and a bright horizon rule along the foot, the dark ground between them; a corner is where a rule ends.',
                verdict: not(
                    'clean and cinematic, a slab between two horizons, and strictly horizontal; but a card beside a card loses its frame and the key figure looks unfinished.',
                ),
            },
            {
                key: 'slots',
                name: 'The sun-stripe slots',
                see: 'Each corner carries a small patch cut by the sun’s stripes: thin at the top corners, thick at the bottom ones, in the pink of the tube.',
                verdict: not(
                    'it puts the sun in the corner and keeps the silhouette square; but four patches on every panel are a lot of decoration, and it reads as a grille.',
                ),
            },
            {
                key: 'slit',
                name: 'A horizon slit through each side near the corners',
                see: 'The panel’s sides are a 2 px pink tube and a 3 px horizontal slit cuts each side near its top and its foot, so the corner reads as a cut, not a bend.',
                verdict: not(
                    'the sun’s cut applied to the frame, horizontal and quiet; but the slit is small enough to look like a rendering fault at a glance.',
                ),
            },
            {
                key: 'pixel',
                name: 'A corner pixel, like a VCR’s OSD',
                see: 'A lit square pixel (0.4 rem) sits in the top-start and bottom-end corner of each panel, pink and cyan, as the registration marks of an on-screen display.',
                verdict: not(
                    'witty and tiny, and the OSD is a theme voice; but two squares do not make a corner, and they are close to cyberpunk’s corner brackets in purpose.',
                ),
            },
            {
                key: 'square',
                name: 'Square panels, 2 px controls (round 1’s, the baseline)',
                see: 'The card, the menu panel, the key figure and the dialog are square and carry the stripe along their top; the button, the tag, the chip and the tooltip take the 2 px corner.',
                verdict: not('you like it most and it is the anatomy, but it is the corner of titanium, brutalism, grotesk and terminal too.'),
            },
        ],
    },
    {
        id: 'tone',
        label: 'A warning',
        rule: 'G13',
        question: 'How does a warning or a failure show?',
        why: 'You asked for more options. Round 1’s ring stays as option 2; the arcade plate (terminal’s reverse video) and the full frame (nostromo’s klaxon) are retired. Five new marks, each readable without colour alone (DI4), and nothing flashes: a mark strikes on once with a tube’s dips and holds. Laser yellow is a warning, red a failure.',
        kind: 'cycle',
        scene: TONE,
        options: [
            {
                key: 'osd',
                name: 'The VCR’s own symbols: pause for a warning, stop for a failure',
                see: 'Where the label has its ▶, a warning carries the VCR’s pause (two bars) and a failure its stop (a square), as lit tubes in the tone; the title or figure glows in the tone.',
                verdict: rec(
                    'it extends the OSD voice you approved instead of adding a new motif, the shape tells warning from failure without colour, and cyberpunk’s and nostromo’s warnings are text tags, not symbols.',
                ),
            },
            {
                key: 'ring',
                name: 'The neon ring, the words in the tone (round 1’s)',
                see: 'A hollow neon ring before the title or figure, a near-white core with the tone’s bloom; the title or figure glows in the tone. The ring strikes on once.',
                verdict: not(
                    'your family pick and quiet; but a ring is the same shape for a warning and a failure, so only the colour tells them apart.',
                ),
            },
            {
                key: 'level',
                name: 'A three-pip level: two lit for a warning, three for a failure',
                see: 'Three small square tubes before the title or figure, like the VCR’s tracking bars or an arcade’s danger gauge: two lit in laser yellow for a warning, all three lit in red for a failure.',
                verdict: not(
                    'the count tells the severity without colour and it reads as an instrument; but the pips ask to be read, where a symbol is seen.',
                ),
            },
            {
                key: 'rails',
                name: 'Two tube rails above and below',
                see: 'A lit tube in the tone runs along the top and along the foot of the part (the way a sign is framed by two tubes); the words glow in the tone. Only horizontal lines.',
                verdict: not(
                    'it is strictly horizontal and frames the whole part; but two rules on a plate that already has a stripe and a floor are crowded, and it is nostromo’s frame with the sides left out.',
                ),
            },
            {
                key: 'striped',
                name: 'The words cut by the sun’s stripes',
                see: 'The title, the figure and the state word take the tone’s colour and are cut by the sun’s stripes, widest at the foot, the way a sunset logo is drawn; no mark beside them.',
                verdict: not(
                    'the classic synthwave letter, a shape you can see without colour; but cut letters are harder to read at the size of a figure, and the warning is then louder than the page’s own titles.',
                ),
            },
            {
                key: 'dusk',
                name: 'The sun going down: half set for a warning, set for a failure',
                see: 'A small striped sun before the title: half sunk behind a horizon line for a warning, gone with only the lit horizon left for a failure, in the tone.',
                verdict: not('poetic: the day is ending; but the sun means the clock in this theme (G16), and a sun sets for time, not for a fault.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'You said none of these is fancy enough and that you used the progress bars to measure the timings. So ten attempts, built on the bar: the sun’s ramp (pink to laser yellow) cut by stripes, the glowing head, the road, plus new bolder ones. Each is drawn on every waiting part; the progress bar at the top of the scene is the reference. Nothing flickers: lights step by a beat or glide on a line, and every loop is a whole number of beats.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'charge',
                name: 'The ramp charges along the foot',
                see: 'A small progress bar sits in the foot of every waiting part: the sun’s ramp, cut by stripes, fills it start to end in five hard steps with the glowing head jumping in front, 5 beats (1125 ms), and starts again from empty.',
                verdict: rec(
                    'it is your progress bar on every surface, in hard beats; the ramp, the stripes and the head are the signature, and it uses the marquee’s step rather than a sweep; the restart from empty is a hard cut.',
                ),
            },
            {
                key: 'flow',
                name: 'The ramp flows through the stripes',
                see: 'The foot bar is filled all the time: the sun’s ramp scrolls through the fixed stripes, pink to laser yellow to pink, 8 beats (1800 ms) a period at a constant pace, like a barber pole in sunset colours.',
                verdict: not(
                    'smooth and colourful; it never restarts, so nothing jumps; but it says “busy” rather than “waiting for a share”, and a constant drift is titanium’s bath.',
                ),
            },
            {
                key: 'road',
                name: 'The road',
                see: 'The foot bar is the busy bar’s road: lane dashes of near-white core with a pink bloom race start to end over a dark bed lit by a faint ramp, 600 ms a period.',
                verdict: not('exactly the bar you know, so nothing new; at 600 ms the dashes are the fastest thing on the page.'),
            },
            {
                key: 'fill',
                name: 'The part is the bar',
                see: 'The ramp fills the whole waiting part behind its words (faint, with the stripes cut through it), a glowing head at the front edge, start to end; then it empties start to end behind the head, 8 beats (1800 ms) and never jumps.',
                verdict: not(
                    'the boldest use of your bar: the surface itself is the progress; but a wash behind a table or a menu entry competes with the words.',
                ),
            },
            {
                key: 'ladder',
                name: 'The sun’s stripes light up from the horizon',
                see: 'Five stripes at the foot, widest at the bottom, light one after another from the horizon up in the ramp’s colours, a beat each, stay lit for a beat and go out together, 6 beats (1350 ms).',
                verdict: not(
                    'it is the sun building itself, a ladder like an equaliser peak; but the all-out reset is the one hard cut, and five stripes need height a day or a menu entry does not have.',
                ),
            },
            {
                key: 'floor',
                name: 'The floor drives toward you',
                see: 'A band of grid floor at the foot: its lines run toward the viewer, closing up at the horizon and spreading at the bottom, and a new line appears at the horizon as one leaves, 900 ms, the way you drive on the grid.',
                verdict: not(
                    'the strongest picture of the theme and it moves the page forward; but moving lines at the foot of every part are a lot of motion, and dark’s ticker also runs a line.',
                ),
            },
            {
                key: 'scanner',
                name: 'The scanner: a glowing head with a ramp tail, there and back',
                see: 'In the foot bar a bright head with a tail in the sun’s ramp sweeps to the end and comes back, on the sunrise curve, 8 beats (1800 ms), like the scanner of a 1982 car.',
                verdict: not(
                    'witty and unmistakably 80s; but it goes back and forth, which G10 forbids, and it looks like cyberpunk’s hunting reticle in a straight line.',
                ),
            },
            {
                key: 'highway',
                name: 'Headlights and tail lights',
                see: 'Along the top edge pink lights run start to end, along the foot cyan ones run back, short bright dashes with a bloom, a two-lane highway at night, 1200 ms.',
                verdict: not(
                    'a whole road in one part, and it uses both neon colours; but cyan moves here where it should only read, and two lanes make a small part busy.',
                ),
            },
            {
                key: 'eq',
                name: 'The equaliser',
                see: 'Five narrow bars in the sun’s ramp stand in the corner of the part and change height on the beat in a fixed pattern, 8 beats (1800 ms), like the level meter of a cassette deck.',
                verdict: not(
                    'very 80s hi-fi and it never covers the words; but it is a widget in the corner and not the surface, and a deck’s meter is not synthwave’s own.',
                ),
            },
            {
                key: 'bulbs',
                name: 'The marquee in the ramp’s colours',
                see: 'Your marquee, the row of bulbs along the foot, but each bulb in its place on the ramp, pink at the start, laser yellow at the end; the lit one chases a bulb per beat, with a tail of two dimmer bulbs behind it, 900 ms.',
                verdict: not('the decided picture with the bar’s colours, the safe one; it is not new, which is what you said is missing.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'You like the sun swallows it but it does not feel right yet. In the CSS: its disc is cyan, pink and violet (not the sun’s laser yellow to pink); its stripes are all the same width (the sun’s widen toward the horizon); the part fades under it, so a half-covered grey shows; it ends as a full striped rectangle that vanishes in one frame; and a circle growing from the foot is solstice’s moon and dome. The new ones keep the sun taking the part but never draw a growing circle: they use the horizon, the stripes, the ramp and neon. Option 10 is the old one for comparison. Arrival is the leave backwards.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'slab',
                name: 'The sun’s slab rises through it and sets with it',
                see: 'A slab in the sun’s own colours (laser yellow at the top, pink at the foot, stripes widening toward the horizon) rises from the foot over the part, covering it, then sinks behind the horizon taking it; the horizon line glows. 4 beats (900 ms).',
                verdict: rec(
                    'it keeps your idea (the sun covers it) in the sun’s real colours and stripes, rises and sets on one horizon, ends clean, and has no circle; arriving it comes up covered and the sun sinks away to show it.',
                ),
            },
            {
                key: 'stripes',
                name: 'The sun’s stripes close over it, the horizon first',
                see: 'Five bands of the sun’s ramp grow over the part, bottom band first, each thicker than the one above, until they cover it; then the bands sink behind the horizon, 4 beats (900 ms).',
                verdict: not(
                    'the stripes are the sun, shown as bars rather than a disc; it is livelier than the slab, but five bars on a 2 rem alert are busy.',
                ),
            },
            {
                key: 'ramp',
                name: 'The progress bar’s ramp wipes it out',
                see: 'The bar’s fill, the sun’s ramp cut by stripes, runs over the part start to end with the glowing head in front, covering it; then the filled bar sinks behind the horizon, 4 beats (900 ms).',
                verdict: not(
                    'it is the progress bar you like as a leave; but it travels sideways, the horizon is only the last step, and a part “completes” as it goes.',
                ),
            },
            {
                key: 'dye',
                name: 'The sunset dyes it, then it sets',
                see: 'The part is washed with the sunset gradient (laser yellow top, pink foot, with the stripes), its own colours dyed, then it sinks behind its horizon cut by the sun’s stripes, 4 beats (900 ms).',
                verdict: not(
                    'the sun’s light swallows it without a shape over it; but a dye on text lowers contrast for a moment, and it is the round 1 sunset plus colour.',
                ),
            },
            {
                key: 'blinds',
                name: 'It closes into five neon lines',
                see: 'The part closes in five slats, each squeezing to a line through its middle; the five lines glow and go out one by one, top first, 4 beats (900 ms).',
                verdict: not('stripes and neon, nothing circular; but a part squeezing to a line is nostromo’s tube switched off, five times.'),
            },
            {
                key: 'laser',
                name: 'A laser erases it from the top',
                see: 'A laser line travels from the top of the part to its foot; everything above it is gone, everything below stays until it passes; at the foot the line glows and goes out, 4 beats (900 ms).',
                verdict: not(
                    'clean and fast, a beam on the horizon; but the part is cut from the top down, which is titanium’s cut, and the arrival climbs from the foot.',
                ),
            },
            {
                key: 'marquee',
                name: 'The marquee carries it off',
                see: 'A row of bulbs runs along the top; in four hard steps the part is taken off start to end under the lit bulb, each step a beat (225 ms), 900 ms.',
                verdict: not('hard beats and the arcade; but it is titanium’s feed direction and the marquee means waiting, here it means leaving.'),
            },
            {
                key: 'drive',
                name: 'It drives off to the horizon',
                see: 'The part shrinks toward the middle of its foot, as if it drove away down the road to the vanishing point, and is gone, 4 beats (900 ms).',
                verdict: not(
                    'the most outrun picture; but a part shrinking to a point is the CRT’s dot of nostromo, and it scales, which G3 forbids.',
                ),
            },
            {
                key: 'fold',
                name: 'It lies down on the floor',
                see: 'The part tips back around its foot and lies flat on the grid floor behind the horizon, foreshortened to a line and gone, 4 beats (900 ms): the opposite of “stands up”.',
                verdict: not('a poster’s perspective; but it tips a body and, like standing up, shows foreshortened text.'),
            },
            {
                key: 'swallow',
                name: 'The sun swallows it (round 1’s, as it is)',
                see: 'A disc in cyan, pink and violet with equal stripes grows over the part from below and it fades in the glow, 750 ms; arriving, the disc sinks away.',
                verdict: not(
                    'your pick, kept for comparison: it is solstice’s moon, the colours are not the sun’s, and it ends as a box that disappears.',
                ),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'What does keyboard focus look like?',
        why: 'You asked for new ones. All keep DI2: a ring of two channels, a light line beside a dark one, so it reads on any ground, never colour alone. Round 1’s three (the lit two-channel ring, the marquee trace, as today) are dropped. Inside a framed control or an entry the ring is drawn inset, outside a plate or a day.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'twin',
                name: 'Twin tubes with a dark gap',
                see: 'A near-white tube, a dark gap and a pink tube round the part, like the double tube of a neon sign; the words light as under the pointer.',
                verdict: rec(
                    'three channels (core, dark, pink) so it reads on the pink face of a primary button and on the void; it is neon, and no other theme draws a double ring.',
                ),
            },
            {
                key: 'ramp',
                name: 'The sun’s ramp as the ring',
                see: 'A 3 px ring in the progress bar’s ramp, pink to laser yellow, with a dark ring against it; the words light as under the pointer.',
                verdict: not(
                    'your bar as the focus; beautiful on dark, but a gradient ring reads weakly where the ground is pink (the primary button), and laser yellow beside a warning is a second meaning.',
                ),
            },
            {
                key: 'bulbs',
                name: 'A ring of marquee bulbs',
                see: 'A dotted ring of near-white bulbs with dark rings on both sides, the marquee drawn round the part.',
                verdict: not('arcade and it cannot be mistaken; but dots at 2 px size look rough and the marquee means waiting.'),
            },
            {
                key: 'cut',
                name: 'A tube cut by the sun’s slits',
                see: 'Top and bottom a full near-white tube, the sides cut by slits that widen toward the foot, a dark ring outside.',
                verdict: not(
                    'the sun’s cut on the ring, horizontal, and it is synthwave’s alone; but the slits make the ring read as broken at small sizes.',
                ),
            },
            {
                key: 'ends',
                name: 'Tube ends cross at the corners',
                see: 'Four near-white tubes cross at the corners and overshoot them, like a neon frame whose tubes are not bent, a dark gap beside them.',
                verdict: not(
                    'it echoes the corner idea of the corners question; but in a small button the overshoot is clipped and it looks like a hash sign.',
                ),
            },
            {
                key: 'horizon',
                name: 'The two-channel ring, standing on its horizon',
                see: 'DI2’s ring (lavender beside the void) and under the part a laser line with a bloom, as the horizon it stands on.',
                verdict: not('safest, with a synthwave line under it; but it is round 1’s ring with a rule, not new.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What does a press look like?',
        why: 'You asked for new ones, so round 1’s three (the tube dips, drops 1 px, the sun cut holds) are dropped. Each part is pressed every few seconds, held for a moment, and released as the press played backwards. Nothing moves the part’s words.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'ramp',
                name: 'The sun’s ramp fills it',
                see: 'The progress bar’s ramp, cut by stripes, fills the pressed part start to end in 1 beat (225 ms) and the label turns to the dark ground; releasing, it empties the same way backwards.',
                verdict: rec(
                    'your bar again as the answer to a press: the part “charges”; it is loud, which a press should be, and nobody else fills a button with a ramp.',
                ),
            },
            {
                key: 'charge',
                name: 'The tube overdrives',
                see: 'The glow doubles and spreads, the core turns white and the label burns near-white while held; the part does not move.',
                verdict: not(
                    'the opposite of round 1’s dip: a press lights it more; but a bloom on dark is hard to see on a part that is already lit, and light’s hover also brightens.',
                ),
            },
            {
                key: 'laser',
                name: 'The laser is drawn under it',
                see: 'A laser line is drawn from the centre of the part’s foot outward, as when a value changes, and holds while pressed.',
                verdict: not(
                    'it reuses the live family (a laser means a change, and a press is yours); but at the foot of a button the line looks like a border.',
                ),
            },
            {
                key: 'sink',
                name: 'The light sinks to the foot',
                see: 'The tube above dims and a pool of pink light gathers along the foot of the part, as neon on wet asphalt; held, then released backwards.',
                verdict: not(
                    'a picture of the street at night and it is a light change, no motion; but it is close to dipping the tube, which you did not like.',
                ),
            },
            {
                key: 'gleam',
                name: 'A chrome gleam crosses it',
                see: 'A thin near-white line with a bloom travels over the part from top to foot in 1 beat (225 ms) and leaves it a little brighter while held.',
                verdict: not(
                    'the chrome of the title face; but a line crossing the label is what the sun cut does on hover, and it covers the words for a frame.',
                ),
            },
            {
                key: 'osd',
                name: 'The VCR acknowledges: ▶ lights in the corner',
                see: 'A cyan ▶ in the VCR’s display font lights in the top-end corner of the pressed part for as long as it is held.',
                verdict: not(
                    'it uses the OSD voice for a confirmation; but a glyph in the corner is small, and a press should be felt at the part, not read.',
                ),
            },
        ],
    },
];

/**
 * What research/_review/measure-motion.mjs reads in Firefox (2026-10-07, 1600 px, each part's t50 / t90 in ms from the start of its
 * motion, the run in ms), added to what each option says. Every close is its arrival played backwards (the tool's "mirror").
 */
const MEASURED = {
    'curve:lead': 'bars: head t50 450 / t90 650, ramp t50 680 / t90 870 (one beat behind, ends 1125 ms); dialog t50 300 / t90 360 in 450 ms.',
    'curve:transport': 'bars: t50 450 / t90 740 in 900 ms; dialog t50 300 / t90 390.',
    'curve:beats': 'bars: t50 360 / t90 720, four jumps 180 ms apart; dialog t50 330 / t90 390.',
    'curve:surges': 'bars: t50 450 / t90 830 in 900 ms (two pauses of 150 ms); dialog t50 300 / t90 430.',
    'curve:strike': 'bars: t50 80 / t90 410, then the tail to 900 ms; dialog t50 170 / t90 280.',
    'curve:sunrise': 'bars: t50 450 / t90 640 in 900 ms; dialog t50 300 / t90 360.',
    'opening:climb': 'panel t50 220 / t90 320, beam and panel run 450 ms; the close runs the same frames backwards.',
    'opening:blinds': 'five slats, each 270 ms, 45 ms apart, bottom first: the first draws back at t50 140, the last at t50 320; 450 ms in all.',
    'opening:stand': 'panel t50 200 / t90 270 (the tilt is 88° to 0°) inside 450 ms.',
    'opening:marquee': 'panel t50 200 / t90 400 in eight hard steps, bulbs on until 675 ms.',
    'opening:rise': 'panel t50 300 / t90 360, horizon and stripes 450 ms, the stripe struck at 610 ms.',
    'opening:strike': 'rim 340 ms, stripe 340 ms.',
    'leave:slab':
        'the slab rises 0 to 495 ms (t50 500, t90 760 for the whole slab), the part is hidden at 495 ms behind it, the slab sets by 900 ms.',
    'leave:stripes': 'the sun rises by 450 ms, the bands draw away top band first (t50 590 to 770), 900 ms in all.',
    'leave:ramp': 'the fill and its head run t50 410 / t90 730 over 900 ms.',
    'leave:dye': 'the part rises t50 330 / t90 400, then the dye lifts (t50 700 / t90 790); 900 ms.',
    'leave:blinds': 'the covers open t50 680 / t90 780, the five lines come on 90 ms apart (the last at 0 ms), 900 ms.',
    'leave:laser': 'part t50 440 / t90 640 and the beam the same, 900 ms.',
    'leave:marquee': 'part t50 360 / t90 720 in four hard steps of 180 ms, 900 ms.',
    'leave:drive': 'part t50 360 / t90 600, 900 ms.',
    'leave:fold': 'part t50 400 / t90 530, 900 ms.',
    'leave:swallow': 'body t50 110 / t90 230, the disc t50 620 / t90 670, 750 ms (round 1).',
    'press:ramp': 'fill t50 120 / t90 160 in 225 ms; the release is the same frames backwards (the first 225 ms of the hold).',
    'press:charge': 'glow t50 130 / t90 220 in 225 ms, released backwards.',
    'press:laser': 'laser t50 120 / t90 170 in 225 ms, released backwards.',
    'press:sink': 'pool t50 120 / t90 170 in 225 ms, released backwards.',
    'press:gleam': 'line t50 120 / t90 170 in 225 ms, released backwards.',
    'press:osd': 'symbol in one hard step at the press, out one at the release.',
    'tone:osd': 'the mark strikes on once (450 ms) and holds.',
    'tone:ring': 'the ring strikes on once (450 ms) and holds.',
    'tone:level': 'the pips strike on once (450 ms) and hold.',
    'tone:rails': 'the rails strike on once (450 ms) and hold.',
    'tone:dusk': 'the sun strikes on once (450 ms) and holds.',
    'loading:charge': 'loop 1125 ms (5 beats), five hard steps of 225 ms.',
    'loading:flow': 'loop 1800 ms (8 beats), constant pace.',
    'loading:road': 'loop 600 ms, constant pace (the bar’s own).',
    'loading:fill': 'loop 1800 ms (8 beats): 900 ms to fill, 900 ms to empty, on the sunrise curve.',
    'loading:ladder': 'loop 1350 ms (6 beats), one step per 225 ms.',
    'loading:floor': 'loop 900 ms (4 beats), lines accelerating toward you.',
    'loading:scanner': 'loop 1800 ms (8 beats), 900 ms each way on the sunrise curve.',
    'loading:highway': 'loop 1200 ms, constant pace.',
    'loading:eq': 'loop 1800 ms (8 beats), one new pattern per 225 ms.',
    'loading:bulbs': 'loop 900 ms (4 beats), steps of 225 ms.',
};
for (const a of ASPECTS)
    for (const o of a.options) {
        const m = MEASURED[`${a.id}:${o.key}`];
        if (m) o.see = `${o.see} Measured: ${m}`;
    }

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave"]'));
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
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `${ASPECTS.length} questions, one rule of synthwave each; the first option of every question is the recommendation. The ten questions you approved on 07/10 are the fixed ground of every scene. Pick the one that is synthwave to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sy-aspects]'));
const toc = document.querySelector('[data-sy-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'sy-aspect';
    box.id = `sy-${a.id}`;
    box.setAttribute('data-sy-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-sy-${a.id}`);
    box.innerHTML = `<div class="sy-aspect__head">
        <h3 id="h-sy-${a.id}"><span class="sy-aspect__no">${n + 1}</span> ${a.label} <span class="sy-aspect__rule">${a.rule}</span></h3>
        <p class="sy-aspect__q"></p><p class="sy-aspect__why"></p></div><div class="sy-trio" data-sy-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.sy-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'sy-col';
        col.setAttribute('data-sy-option', String(at + 1));
        col.innerHTML = `<p class="sy-label-row"><span class="sy-label-row__no">${at + 1}</span> <span class="sy-label-row__name"></span>${
            at === 0 ? ' <span class="sy-label-row__rec">Recommended</span>' : ''
        }</p><p class="sy-see"></p><p class="sy-verdict"></p>
        <div class="sy-scene" data-sy-kind="${a.kind}" ${GROUND_ATTRS} data-sy-${a.id}="${o.key}" data-sy-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.sy-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.sy-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.sy-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('sy-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sy-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sy-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1400],
    ['hold', 2200],
    ['out', 1100],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-num]')];
const words = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-sy-phase', phase);
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.sy-part') || scene;
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
    const cellOf = (/** @type {Element} */ el) => el.closest('.sy-part') || scene;
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
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-sy-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-sy-phase'] });

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
radio('data-sy-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--sy-slow', String(slow));
    run(0);
});
document.querySelector('[data-sy-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sy-scene a, .sy-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided synthwave components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=synthwave`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-sy-gallery]'));
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
