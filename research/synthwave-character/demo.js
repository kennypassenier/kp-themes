// What makes synthwave synthwave, round 3 (Kenny, 2026-10-07 21:21: the anchor is
// the page horizon, and the anchor decides the whole theme).
//
// Round 2 was built in parallel with the anchor demo, so its eight options were
// drawn on stages of their own. Round 3 re-derives the same eight questions
// (curve, opening, corners, warning, loading, leave, focus, press) FROM the
// anchor: one neon tube for the page on the header's foot, the floor being the
// page below it, every component carrying 1 px of its light, and, under a hand,
// a brighter piece of the tube exactly as wide as the component touched
// (research/synthwave-anchor/decided.json; themes/synthwave/CHARACTER.md §0).
//
// A review-kit demo in aspect mode, synthwave only. Each ASPECT is one rule of
// the grammar asked as a question; each OPTION is a REAL piece of page (a
// `.kp-page-header` with the page tube on its foot, the floor below it, and the
// component in question at its real size), with one attribute on the scene
// (`data-sy-<aspect>="<key>"`) that options.css reads. The ten questions Kenny
// approved in round 1 stay applied on every scene as the fixed ground (GROUND
// below). The first option of every question is the recommendation. The page's
// one clock (below) plays every scene that arrives, opens, presses, updates or
// leaves; it only writes attributes and text, it never reads layout. The one
// layout read in this file is `placePieces`: where each part stands against the
// page tube, written once per size change as `--sy-to`, so a piece of the tube
// can be drawn exactly as wide as the part and at the tube. The network graph
// is in no scene: it changes in no theme (Kenny, 02:54).

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

/** The mark of a tone: three cells an option may draw a ring, a symbol or pips in. */
const RING = `<span class="sy-ring" aria-hidden="true"><i></i><i></i><i></i></span>`;

/** Every layer a loading picture may draw over a waiting part: top edge, foot edge, the whole face. */
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
 * above the horizon, closing as it rises), then its horizon line: the 1 px of
 * the page's light that every part carries.
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

/**
 * A part the page's horizon can light: the part and, as its last child, the
 * piece of the tube that appears under a hand exactly as wide as the part.
 * `placePieces` tells the piece how far the page tube is from the part.
 */
const host = (html, cls = '', extra = '') => `<span class="sy-host ${cls}" ${extra}>${html}<i class="sy-seg" aria-hidden="true"></i></span>`;
const hostBlock = (html, cls = '', extra = '') =>
    `<div class="sy-host sy-host--block ${cls}" ${extra}>${html}<i class="sy-seg" aria-hidden="true"></i></div>`;

/* ------------------------------------------------------- the page piece */

/**
 * The page horizon (the anchor, decided 2026-10-07 21:21): one tube on the
 * header's foot, as wide as the page, with a ghost of it edge to edge and a far
 * cyan line under it; the floor is the page below it. `head` is a lit length's
 * glowing front and `fx` a layer for what an option runs along the tube.
 */
const HZ = `<div class="sy-hz" aria-hidden="true"><b class="sy-hz__floor"></b><b class="sy-hz__ghost"></b><b class="sy-hz__far"></b><b class="sy-hz__tube"></b><b class="sy-hz__head"></b><b class="sy-hz__fx"></b></div>`;

/**
 * A real piece of page, cropped to what a question needs: the header's foot
 * (the title and its actions at their real size), the page tube, and the
 * parts in question on the floor below.
 */
const page = (actions, body, cls = '') =>
    `<div class="sy-pg ${cls}"><header class="kp-page-header sy-hd"><div class="kp-page-header__inner"><p class="kp-page-header__title sy-hd__title" role="heading" aria-level="4">Pump houses</p><div class="kp-page-header__actions">${actions}</div></div></header>${HZ}<div class="sy-body">${body}</div></div>`;

const cell = (html, cls = '') => `<div class="sy-part ${cls}">${html}</div>`;

/** The actions most scenes carry in the header: two buttons that stand on the tube. */
const ACTIONS = () => host(button('Export')) + host(button('Add a pump house', 'kp-button--primary'));

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
    /** The menu that hangs from the header's More button. */
    drop: () =>
        rise(
            `<div class="kp-popover sy-pop sy-panel">${STRIP}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>`,
            'sy-opens',
        ),
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

/* ------------------------------------------------------------ the scenes */

/** The motion curve: the tube charges, three bars fill, a tile rises. */
const CURVE = () => page(ACTIONS(), cell(PART.pbars(), 'sy-part--bars') + cell(PART.tile(), 'sy-part--tile'), 'sy-pg--curve');

/** Opening: the dialog stands in the body, the menu hangs from the header's More button, both open together. */
const OPENING = () =>
    page(
        host(button('Export')) +
            host(button('Add a pump house', 'kp-button--primary')) +
            host(`${button('More ▾', '', 'aria-haspopup="menu" aria-expanded="true"')}${cell(PART.drop(), 'sy-part--drop')}`, 'sy-trigger'),
        cell(PART.dialog(), 'sy-part--dialog'),
        'sy-pg--opening',
    );

const CORNERS = () =>
    page(
        ACTIONS(),
        cell(PART.plainTile()) +
            cell(PART.menuStatic(['Open incident', 'Assign to…'], '', false)) +
            cell(`<div class="kp-kpis">${PART.kpi('Traffic now', '412')}</div>`) +
            cell(
                `<div class="sy-row">${button('Export')}<span class="kp-badge sy-tagged">12 new</span><span class="kp-tag sy-chip2">Nodes</span>${chip('6 %')}</div>`,
            ) +
            cell(`<div class="kp-tooltip sy-tip" role="tooltip">14:00 · 412 Gb</div>`) +
            cell(
                `<div class="kp-dialog sy-dialog sy-panel" role="group" aria-label="A dialog">${STRIP}<p class="kp-dialog__title sy-title">Close INC-4471?</p><p class="kp-dialog__description">The vendor is told at once.</p></div>`,
            ),
        'sy-pg--corners',
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
        page(
            ACTIONS(),
            cell(
                `<div class="kp-kpis sy-kpi-row">${hostBlock(PART.kpi('Traffic now', '412'))}${hostBlock(warnKpi(), '', 'data-sy-kind="warn"')}</div>`,
            ) +
                cell(
                    hostBlock(
                        `<div class="kp-card sy-plate sy-tile sy-bad" data-sy-kind="bad">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${RING}<span class="sy-toned">Node 03</span></p><p class="kp-card__body">No signal since 06:40</p></div>`,
                        '',
                        'data-sy-kind="bad"',
                    ),
                ) +
                cell(host(PART.state('Failed', 'bad'), 'sy-host--word', 'data-sy-kind="bad"')) +
                cell(
                    hostBlock(
                        `<div class="sy-meter-wrap sy-warn" data-sy-kind="warn">${RING}${meter(0.88, 0.8, 'data-kp-tone="warning"')}</div>`,
                        '',
                        'data-sy-kind="warn"',
                    ),
                ),
            'sy-pg--tone',
        ),
    );

/** The waiting parts at real size: a key figure, a table, and the progress bar's own busy road as the reference. */
const LOADERS = () =>
    page(
        ACTIONS(),
        cell(
            `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi sy-waits" aria-busy="true">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Packets today</span><span class="kp-kpi__value sy-figure sy-faint">18 240</span><span class="kp-kpi__trend sy-faint">on yesterday</span>${LOAD}</div></div>`,
        ) +
            cell(
                `<div class="sy-table sy-plate sy-waits" aria-busy="true">${STRIP}${FLOOR}<span>Node</span><span>Traffic</span><span class="sy-faint">North 01</span><span class="sy-faint">412</span><span class="sy-faint">North 02</span><span class="sy-faint">388</span>${LOAD}</div>`,
            ) +
            cell(
                `<div class="sy-part-bar"><span class="sy-cap">The progress bar, busy: the reference</span>${PART.bar('Sync busy')}</div>`,
                'sy-part--busy',
            ),
        'sy-pg--waits',
    );

/** A part that leaves and arrives: the part, the sun that may cover it, then its stripes and its 1 px horizon. */
const leaver = (html) => rise(`<div class="sy-leaver__body"><div class="sy-leaver__part">${html}</div>${SUN}</div>`, 'sy-leaver');
const LEAVE = () =>
    page(
        ACTIONS(),
        cell(hostBlock(leaver(PART.alert('Node 04 is back online.')))) +
            cell(hostBlock(leaver(PART.plainTile()))) +
            cell(
                hostBlock(
                    leaver(
                        `<div class="kp-kpis"><div class="kp-kpi sy-plate sy-kpi">${STRIP}${FLOOR}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></div></div>`,
                    ),
                ),
            ),
        'sy-pg--leave',
    );

const FOCUS = () =>
    page(
        host(button(`Export readings${FRING}`, 'sy-focused'), 'sy-lit') + host(button('Add a pump house', 'kp-button--primary')),
        cell(
            hostBlock(
                `<div class="kp-kpis"><a class="kp-kpi sy-plate sy-kpi sy-in-kpi sy-focused" href="#sy-intro">${STRIP}${FLOOR}${FRING}<span class="kp-kpi__label sy-label">Traffic now</span><span class="kp-kpi__value sy-figure">412</span></a></div>`,
                'sy-lit',
            ),
        ) +
            cell(
                `<div class="kp-popover sy-pop sy-pop--static sy-panel sy-in-menu">${STRIP}<ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item"><span class="sy-entry">Open incident</span></button></li><li role="none">${hostBlock(`<button type="button" role="menuitem" class="kp-menu__item sy-focused"><span class="sy-entry">Assign to…</span>${FRING}</button>`, 'sy-lit')}</li></ul></div>`,
            ) +
            cell(
                `<div class="sy-days"><span class="sy-day"><span class="sy-day__num">13</span></span>${host(`<span class="sy-day sy-focused"><span class="sy-day__num">14</span>${FRING}</span>`, 'sy-lit')}<span class="sy-day"><span class="sy-day__num">15</span></span></div>`,
            ) +
            cell(
                `<div class="kp-card sy-plate sy-tile sy-in-tile">${STRIP}${FLOOR}<p class="kp-card__title sy-title">Node 01</p>${host(`<a class="kp-button kp-button--ghost kp-button--sm sy-tile-link sy-focused" href="#sy-intro">Open${FRING}</a>`, 'sy-lit')}</div>`,
            ),
        'sy-pg--focus',
    );

const PRESS = () =>
    page(
        host(button(`Export readings${FX}`, 'sy-press'), 'sy-lit') + host(button(`Add a pump house${FX}`, 'kp-button--primary sy-press'), 'sy-lit'),
        cell(
            hostBlock(
                `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle sy-plate sy-kpi sy-press" aria-pressed="false">${STRIP}${FLOOR}${FX}<span class="kp-kpi__label sy-label">Open incidents</span><span class="kp-kpi__value sy-figure">3</span></button></div>`,
                'sy-lit',
            ),
        ) +
            cell(`<div class="sy-days">${host(`<span class="sy-day sy-press"><span class="sy-day__num">14</span>${FX}</span>`, 'sy-lit')}</div>`) +
            cell(
                host(
                    `<button type="button" class="sy-key sy-press" aria-pressed="false">${FX}<span class="sy-key__swatch" aria-hidden="true"></span>Node 01</button>`,
                    'sy-lit',
                ),
            ),
        'sy-pg--press',
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
        question: 'How does synthwave move: who goes first, and how does a body travel, shown on the page tube and the progress bars?',
        why: 'The anchor first: the page horizon is one tube, and the progress bars you like are the same tube at component scale. So each curve is drawn on the tube itself: a lit length charges along the header’s foot while three bars fill and a tile rises from the floor. Each option fixes who moves first and how light and bodies travel. None overshoots (a bounce is pastel’s) and none is the register’s quick curve (cyberpunk’s, nearly titanium’s).',
        kind: 'cycle',
        scene: CURVE,
        options: [
            {
                key: 'lead',
                name: 'The tube leads, the bodies follow',
                see: 'The page tube charges from its start to its end on the sunrise curve (900 ms), a glowing head in front; the three bars fill and the tile rises on the same curve one beat (225 ms) behind it, so the light is always ahead of what it lights.',
                verdict: rec(
                    'it is how a neon sign behaves (the tube lights first), it makes the anchor the clock of the page, and no other theme lets light and body run apart: forest, nostromo and titanium move the body alone.',
                ),
            },
            {
                key: 'strike',
                name: 'The tube strikes, the bodies glide',
                see: 'The tube lights across its whole width in one hard step (a strike, 225 ms); the bars fill and the tile rises on the sunrise curve one beat later, 900 ms.',
                verdict: not(
                    'it is G1 to the letter (light switches, bodies glide) and the cleanest to read, but the horizon does not travel, so the tube says nothing about progress. Cyberpunk strikes too, but moves its bodies in ticks.',
                ),
            },
            {
                key: 'beats',
                name: 'Four beats',
                see: 'The tube, the bars and the tile move in four hard steps of one beat (225 ms) each, the head jumping with the fill; nothing glides.',
                verdict: not(
                    'pure marquee, and the steps are the page’s own beat; but a tile rises like a ladder, and held poses are cyberpunk’s, frames nostromo’s and line steps terminal’s.',
                ),
            },
            {
                key: 'passes',
                name: 'The light passes, each body takes it',
                see: 'The tube charges on the sunrise curve (900 ms); the bars fill with it from the start, and the tile waits until the light reaches its left edge, at half, then rises (450 ms): the page is lit start to end and every part takes the light as it passes.',
                verdict: not(
                    'the most horizon-like of the six (a place on the page decides when), a wave across the page; but the tile waits 450 ms, which is slow on a page with a dozen parts. Titanium and grotesk feed start to end too, without a light to follow.',
                ),
            },
            {
                key: 'release',
                name: 'Charge, then release',
                see: 'The tube charges slowly and speeds up (675 ms, ease in) while the bodies wait; then the bars and the tile are released together, 450 ms on the sunrise curve (1125 ms in all).',
                verdict: not(
                    'anticipation has character, a capacitor filling and then letting go, and nobody else stalls on purpose; but 675 ms with the body standing still is the longest wait of the six, and a bar that starts late looks stuck.',
                ),
            },
            {
                key: 'even',
                name: 'An even pace, like a tape counter',
                see: 'The tube, the bars and the tile travel at one even pace (900 ms, linear) and stop on their mark, like the counter of a tape.',
                verdict: not(
                    'calm and exact, the speed of the road; but an even pace is grotesk’s and titanium’s loop, blueprint’s plotter feed is nearly it, and a tile that stops dead is the opposite of a sunrise.',
                ),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How does a menu or a dialog open?',
        why: 'The anchor first: the page horizon is where things come and go, and under a hand a brighter piece of it lights exactly as wide as the part touched. So every option lights the piece under the button, and what opens comes from that line: a menu hanging from More and a dialog standing under the header. You liked options 1 and 2 of round 1 (the rise over the horizon with its stripe striking on, and Neon strikes): they stay as options 5 and 6, now on the page horizon; the four new ones begin at the tube. Every close is its open played backwards.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'climb',
                name: 'The beam climbs to the horizon',
                see: 'A near-white beam starts at the panel’s foot and climbs to its top in 2 beats (450 ms), the panel uncovered under it; where the beam arrives the stripe strikes on and the piece of tube under the button turns up, as the horizon answering. Closing: the same frames backwards.',
                verdict: rec(
                    'a menu opens as a scan line draws a picture, and the beam travels to the very line the button stands on; it is your laser family. Nobody else opens upward under a line of light: titanium cuts top-down, nostromo strikes from the middle, forest grows down from the anchor.',
                ),
            },
            {
                key: 'blinds',
                name: 'The blinds are drawn up into the horizon',
                see: 'The piece under the button is lit; the panel is covered by five bars in the sun’s stripe rhythm (thin at the top, thick at the foot) that draw up one after another, the bottom one first, until it stands bare, 450 ms.',
                verdict: not(
                    'only the sun’s stripes do the opening, so nothing but synthwave shows it; in a dialog it is dramatic, in a small menu the slats are quick. Grotesk’s flat colour bands also uncover a panel, but sweep sideways and print colour.',
                ),
            },
            {
                key: 'stand',
                name: 'It stands up on the floor',
                see: 'The piece under the button is lit; the panel lies flat on the floor behind its foot and stands up around it (perspective, 450 ms), like a billboard rising on the road, its horizon line glowing at the foot.',
                verdict: not(
                    'the floor is the page below the tube, so it is the most literal picture of the anchor; but it tips a body (G2 lets nothing fall or tip) and the text is foreshortened for a moment. No register uses perspective.',
                ),
            },
            {
                key: 'lower',
                name: 'The horizon lets it down',
                see: 'A beam leaves the piece under the button and runs down the panel to its foot in 2 beats (450 ms), the panel uncovered behind it from the top; the piece stays lit.',
                verdict: not(
                    'the most literal “drops from a button”, and it starts at the anchor; but it is a top-down cut, titanium’s, and what hangs grows downward like forest’s menu. Only the beam of light is synthwave’s.',
                ),
            },
            {
                key: 'rise',
                name: 'Over the horizon, its stripe striking on (round 1’s 1)',
                see: 'The piece under the button lights; the panel’s 1 px horizon is drawn from its centre outward along its foot, the panel rises 0.5 rem from behind it cut by the sun’s stripes that close as it rises, and its top stripe strikes on: 2 beats (450 ms).',
                verdict: not('you like it, and it is the arrival family of every part, but a menu then adds nothing of its own to the page.'),
            },
            {
                key: 'strike',
                name: 'Neon strikes: there at once (round 1’s 2)',
                see: 'The piece under the button strikes; the panel is there in one frame and its rim and stripe strike on pink, cyan, pink, cyan in hard steps (340 ms).',
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
        why: 'The anchor first: every part carries 1 px of the page horizon’s light on its top edge, so a corner is where that light ends or starts. You like square the most but feel we can do better; square stays as the baseline (option 6). The new ideas stay strictly inside the grammar: radius 2 px, every cut horizontal, nothing notched or chamfered, no pills. Buttons, tags, chips and the tooltip keep their 2 px corner in every option; the panels change.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'tubes',
                name: 'The light overshoots the corners',
                see: 'The top stripe and a pink tube along the foot run past the plate’s sides by half a rem, like the tubes of a neon frame that cross at the corners; the sides stay a hairline.',
                verdict: rec(
                    'the corner is the place where the horizon’s light ends and goes on past it, so the silhouette stays square and needs no notch; cyberpunk’s reticle and blueprint’s brackets mark corners with L-shapes, this has horizontal ends only (titanium’s tool-edge is a line on the top and stops at the corner).',
                ),
            },
            {
                key: 'rules',
                name: 'Only the top and foot rules',
                see: 'Plates have no sides: a stripe along the top and a bright horizon rule along the foot, the dark ground between them; a corner is where a rule ends.',
                verdict: not(
                    'clean and cinematic, a slab between two horizons, and strictly horizontal; but a card beside a card loses its frame and the key figure looks unfinished.',
                ),
            },
            {
                key: 'fade',
                name: 'The light runs down the sides and fades',
                see: 'The top edge is lit with the stripe; at each top corner the light turns and runs down the side, fading to nothing before the foot, as if the plate were lit from the horizon above it.',
                verdict: not(
                    'the horizon is above every part, so light falls on tops and dies down the sides: the corner is where the light enters; quiet and new. But sides that fade look unfinished on a tall plate, and solstice also lights a plate by one edge (its foot).',
                ),
            },
            {
                key: 'float',
                name: 'The stripe floats above the plate',
                see: 'The stripe is lifted off the plate by a 2 px dark cut, so each top corner is where a tube ends above a square slab; the foot stays a hairline.',
                verdict: not(
                    'a horizontal cut at the corners, a tube lying on a slab; but a floating stripe on every panel breaks the tape card you approved, and at a glance it reads as a border fault.',
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
        why: 'The anchor first: the page horizon is the one line every part carries a piece of, so a warning is that line changing tone exactly as wide as the part. Every option turns the piece of the tube over the warned part to laser yellow (a failure: red) and adds a second channel that is not colour (DI4): a symbol, a ring, a thickness, a count, a rail, the shape of the letters. Nothing flashes: the mark strikes on once and holds. Round 1’s plate and frame stay retired (terminal’s and nostromo’s).',
        kind: 'cycle',
        scene: TONE,
        options: [
            {
                key: 'osd',
                name: 'The VCR’s symbols, on a tube that turns',
                see: 'The piece of tube over the part is laser yellow (red for a failure) and the part’s label carries the VCR’s own symbol where its ▶ was: pause (two bars) for a warning, stop (a square) for a failure; the figure or title glows in the tone.',
                verdict: rec(
                    'it extends the OSD voice you approved instead of adding a new motif, the shape tells a warning from a failure without colour, and the piece shows where on the page it is; cyberpunk’s and nostromo’s warnings are text tags, not symbols.',
                ),
            },
            {
                key: 'ring',
                name: 'Your neon ring, on a tube that turns',
                see: 'The piece over the part turns to the tone, and the hollow neon ring (round 1’s) stands before the title or figure, a near-white core with the tone’s bloom; the title or figure glows in the tone.',
                verdict: not(
                    'your family pick, quiet and approved; but a ring is the same shape for a warning and a failure, so only the colour tells them apart. Cyberpunk’s target brackets and blueprint’s flag are the competing marks.',
                ),
            },
            {
                key: 'swell',
                name: 'The piece swells with the severity',
                see: 'The piece over the part is as wide as the part and thicker as it gets worse: 5 px in laser yellow for a warning, 8 px in red for a failure (3 px at rest); the words glow in the tone.',
                verdict: not(
                    'nothing is added to the part, the line itself says it, and thickness is a second channel; but 8 px of red tube over a wide tile is loud, and the eye must travel from the line to the part. Grotesk’s warning is a 6 px bar down the start edge.',
                ),
            },
            {
                key: 'pips',
                name: 'Three cells in the piece: two lit, three lit',
                see: 'The piece over the part is cut into three cells by two dark gaps; a warning lights two of them in laser yellow, a failure all three in red; the words glow in the tone.',
                verdict: not(
                    'the count tells the severity without colour and it reads as an instrument; but it asks to be read where a symbol is seen, and nostromo’s lamp bank is also a count of lit cells.',
                ),
            },
            {
                key: 'rails',
                name: 'The part between two tubes',
                see: 'The piece over the part and a tube of the same width along its foot, both in the tone, bracket it; the words glow in the tone. Only horizontal lines.',
                verdict: not(
                    'strictly horizontal and it frames the whole part; but a plate that already has a stripe and a floor is crowded by two rules, and it is nostromo’s frame with the sides left out.',
                ),
            },
            {
                key: 'striped',
                name: 'The words cut by the sun’s stripes',
                see: 'The piece turns to the tone and the title, the figure and the state word take the tone’s colour and are cut by the sun’s stripes, widest at the foot, the way a sunset logo is drawn.',
                verdict: not(
                    'the classic synthwave letter, a shape you can see without colour; but cut letters are harder to read at the size of a figure, and the warning becomes louder than the page’s own titles.',
                ),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'The anchor first: when the page waits, the page tube itself loads, and every waiting part carries the same picture at its own scale on its top edge (1 px of the page’s light, grown to 3 px while it waits). You said none of round 1’s was fancy enough and that you use the progress bars to measure the timings, so the ten attempts are the bar’s own parts on the tube: the sun’s ramp (pink to laser yellow) with its glowing head, the road, the stripes, plus the floor running toward the horizon. Nothing flickers: lights step by a beat or glide on a line, and every loop is a whole number of beats.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'charge',
                name: 'The tube charges in five steps',
                see: 'The page tube fills start to end with the sun’s ramp in five hard steps, a glowing head jumping in front, 5 beats (1125 ms), then starts again from empty; every waiting part does the same along its top edge.',
                verdict: rec(
                    'it is your progress bar made the page’s own: the ramp, the head and the beat are the signature, and the tube carries it across the whole page; the restart from empty is a hard cut, the one thing to judge.',
                ),
            },
            {
                key: 'flow',
                name: 'The ramp flows through the tube',
                see: 'The page tube is lit all the time; the sun’s ramp scrolls through it, pink to laser yellow to pink, 8 beats (1800 ms) a period at a constant pace, like a barber pole in sunset colours; the parts’ top edges flow with it.',
                verdict: not(
                    'smooth and colourful; it never restarts, so nothing jumps, but it says “busy” rather than “waiting for a share”, and a constant drift is titanium’s bath.',
                ),
            },
            {
                key: 'road',
                name: 'The road runs on the tube',
                see: 'Lane dashes of near-white core with a pink bloom race along the page tube and along every waiting part’s top edge, start to end, 600 ms a period: the busy bar’s road, drawn on the horizon.',
                verdict: not('exactly the bar you know, so nothing new; at 600 ms the dashes are the fastest thing on the page.'),
            },
            {
                key: 'drive',
                name: 'The floor drives toward you',
                see: 'The page tube stands lit; the grid floor under it runs: its lines are born at the horizon and rush toward you, closing up near the line and spreading at the bottom, 900 ms; every plate’s own floor band drives too.',
                verdict: not(
                    'the strongest picture of the theme and it moves the page forward; but a moving floor under a whole page is a lot of motion, and dark’s ticker also runs a line.',
                ),
            },
            {
                key: 'slice',
                name: 'A slice of light runs the tube',
                see: 'One slice of light, a glowing head with a short ramp tail, runs the page tube start to end at a constant pace, 8 beats (1800 ms), and every waiting part runs its own slice along its top edge; the slice is the only thing lit.',
                verdict: not(
                    'the anchor demo’s own loading, calm and exact; but one slice reads as “something is moving” more than “waiting for a share”, and a comet is every theme’s loading shape.',
                ),
            },
            {
                key: 'lanes',
                name: 'Headlights and tail lights',
                see: 'Pink lights run along the page tube start to end and cyan ones run back along its far line under it, short bright dashes with a bloom, a two-lane highway at night, 1200 ms; parts carry one lane on their top edge and one on their foot.',
                verdict: not(
                    'a whole road in one horizon, and it uses both neon colours; but cyan moves here where it should only read, and two lanes make a small part busy.',
                ),
            },
            {
                key: 'sun',
                name: 'The sun’s stripes light up from the horizon',
                see: 'Five stripes under the page tube, thickest at the line, light one after another from the horizon down in the ramp’s colours, a beat each, stay lit for a beat and go out together, 6 beats (1350 ms); parts carry five at their foot.',
                verdict: not(
                    'it is the sun’s reflection building itself in the floor, a ladder like an equaliser peak; but the all-out reset is the one hard cut, and five stripes need height a small part does not have.',
                ),
            },
            {
                key: 'surface',
                name: 'The surface is the bar',
                see: 'The ramp fills the floor under the tube behind the page (faint, with the stripes cut through it), a glowing head at its front edge, start to end, then empties start to end behind the head, 8 beats (1800 ms); every waiting part’s face does the same.',
                verdict: not(
                    'the boldest use of your bar: the surface itself is the progress; but a wash behind a table or a menu entry competes with the words.',
                ),
            },
            {
                key: 'bulbs',
                name: 'The marquee runs on the tube, in the ramp’s colours',
                see: 'Your marquee on the horizon: a row of bulbs along the page tube, each in its place on the ramp, pink at the start, laser yellow at the end; one in four lit, the light chasing a bulb per beat, 900 ms; parts carry the row on their top edge.',
                verdict: not(
                    'the decided picture with the bar’s colours and the page’s line, the safe one; it is not new, which is what you said is missing.',
                ),
            },
            {
                key: 'rows',
                name: 'The rows of the floor light up toward you',
                see: 'The tube stands lit; the grid floor’s four rows light one after another from the horizon toward you, a hard step each, then all go out, 4 beats (900 ms): the marquee, drawn in the floor; parts light the rows of their own floor band.',
                verdict: not(
                    'hard beats in the theme’s own ground, and it is the marquee’s step on the road; but the reset is a hard cut, and a lit row far from the part it belongs to can look like the page’s decoration.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'The anchor first: the horizon is where things come and go, and every part carries 1 px of it. You like “the sun swallows it” but it does not feel right yet, so it is back, five times, as the synthwave sun and not as an eclipse: the striped sun (laser yellow to pink, its stripes widening toward the foot, every cut horizontal) goes down behind the part’s foot, which is the page’s floor line, on the sunrise curve or on the beat. Round 1’s was a growing disc, cyan, pink and violet, with stripes all one width, that ended as a striped rectangle and read as solstice’s moon; none of these draws a circle. The other five are the best of round 3 that are not the sun’s shape. The piece of the page tube over the part answers while it goes. Arrival is the leave backwards.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'sets',
                name: 'The sun sets through it',
                see: 'The striped sun, laser yellow at the top and pink at the foot, its stripes widening toward the foot, comes down over the part from its top edge: the part is gone above the sun’s lower edge, so you see the cut travel down. The sun carries on below the part’s foot, behind its 1 px of horizon, and is gone. One move, 4 beats (900 ms), on the sunrise curve; the piece of the page tube over the part lights while the sun passes.',
                verdict: rec(
                    'it is the swallow you liked in the one picture the horizon allows: the sun goes down behind the line and takes the part with it, every cut horizontal, no disc. Arriving it is the sun rising out of the foot line with the part appearing behind its lower edge. Overlap: solstice’s leave is an eclipse, a dark moon crossing start to end with a corona; this sun goes down, wears stripes and has no round edge. It is also the nearest of the ten to the round-1 swallow, minus the disc.',
                ),
            },
            {
                key: 'scan',
                name: 'The sun rises behind it and cuts it into scanlines',
                see: 'The sun’s slab rises behind the part from its foot while four slits open in the part itself, the lowest the widest, so you see the part cut into scanlines with the sun burning through the cuts; the slits close the part away completely, and the sun sets behind the foot. 4 beats (900 ms), sunrise curve.',
                verdict: not(
                    'it is the sun’s own stripes turned on the part (the scanline-cut, the way the sun is drawn), with the sun behind it as the real sunset has it, not over it. But a slit mask on a 2 rem alert is only a few pixels, and for the first half the sun is half hidden by the part. Overlap: none of the other themes cut a part into scanlines; nostromo’s collapse and cyberpunk’s slice are vertical or diagonal.',
                ),
            },
            {
                key: 'beats',
                name: 'The sun steps down through it, one beat a step',
                see: 'Nothing for the first beat. Then a window of the sun (a third of the part’s height, its stripes widening toward the foot) lights on the part’s top third at 225 ms and steps down a third at 450 and 675 ms, the part gone behind it as it passes; at 900 ms the window is gone and so is the part.',
                verdict: not(
                    'it is the sun going down on the beat, the marquee’s step on the sunset: nothing glides, the stripes change on each step. But hard steps are the terminal’s, cyberpunk’s and nostromo’s rhythm, and a part cut in steps can look like a loading bar. Overlap: those three themes’ stepped motion.',
                ),
            },
            {
                key: 'cascade',
                name: 'The sun’s stripes take it, band by band',
                see: 'Five bands of the sun (thin at the top, thick toward the foot, a hairline between them) close over the part one after the other from its top edge down, each 45 ms after the one above; the part is cut away behind them as they pass, and the bands then drain toward the foot in the same order. 4 beats (900 ms), sunrise curve.',
                verdict: not(
                    'it is the sun drawn in its own stripes and it swallows from the top edge down, as you described it, with the hand of the tube above it. But five bars on a 2 rem alert are busy, and it is the round-3 bands turned upside down. Overlap: grotesk’s and cyberpunk’s bands wipe; here the bands are the sun’s ramp and widen toward the foot.',
                ),
            },
            {
                key: 'dye',
                name: 'The sunset pours over it, then it sets',
                see: 'The part is washed with the sunset gradient (laser yellow top, pink foot, with the stripes), its own colours dyed, then it sinks behind its foot cut by the sun’s stripes, 4 beats (900 ms).',
                verdict: not(
                    'the sun’s light swallows it without a shape over it; but a dye on text lowers contrast for a moment, and it is round 1’s sunset plus colour. Overlap: the ground’s own sunset leave, which Kenny decided on 2026-10-04.',
                ),
            },
            {
                key: 'slab',
                name: 'The sun’s slab rises through it and sets with it',
                see: 'A slab in the sun’s own colours (laser yellow at the top, pink at the foot, stripes widening toward the horizon) rises from the part’s foot over it, covering it, then sinks behind the foot taking it; the piece of tube above the part lights while the sun passes. 4 beats (900 ms).',
                verdict: not(
                    'it keeps your idea in the sun’s real colours and stripes, rises and sets on one horizon and has no circle; but it is a slab, a sun without its shape, and the part is switched off under it in one step.',
                ),
            },
            {
                key: 'ramp',
                name: 'The progress bar’s ramp wipes it out',
                see: 'The bar’s fill, the sun’s ramp cut by stripes, runs over the part start to end with the glowing head in front, covering it; then the filled bar sinks behind the foot, 4 beats (900 ms).',
                verdict: not(
                    'it is the progress bar you like as a leave; but it travels sideways, the horizon is only the last step, and a part “completes” as it goes.',
                ),
            },
            {
                key: 'floor',
                name: 'The floor takes it from its foot up',
                see: 'A near-white horizon line rises through the part from its foot to its top; below the line the part has turned into the grid floor, above it the part still stands; the floor sinks away, 4 beats (900 ms).',
                verdict: not(
                    'the horizon itself swallows it, and the part becomes the page it stood on; the most literal use of the anchor. But it is a bottom-up wipe with a bright line, which is close to a laser’s cut, and the grid on a 2 rem alert is a few pixels.',
                ),
            },
            {
                key: 'recede',
                name: 'It recedes into the page horizon',
                see: 'The part slides up toward the page tube, cut by the sun’s stripes whose gaps widen toward the tube, and is gone behind it; the piece of the tube over it blazes as it arrives there. Arriving, it comes out of the horizon and settles on the floor. 4 beats (900 ms).',
                verdict: not(
                    'the horizon is where things come and go, and a part receding into it is the outrun picture (a road sign vanishing); but arriving it moves down from the line, which G2 forbids (nothing falls from above), and it travels the farthest of the ten.',
                ),
            },
            {
                key: 'drain',
                name: 'The light drains out of it, then it sets',
                see: 'No shape over the part: its colours drain to a dark grey first, then it sinks behind its foot cut by the sun’s stripes, 4 beats (900 ms); the piece of tube above it answers. Arriving, it rises dark and its light comes back.',
                verdict: not(
                    'the horizon takes the light and the part is left a shadow, the quietest of the ten; but a grey part for a moment is a disabled look, text contrast drops while it goes, and it is the ground’s own sunset with a filter.',
                ),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G14, DI2',
        question: 'What does keyboard focus look like?',
        why: 'The anchor first: focus is a hand on the part, so the piece of the page horizon lights over it exactly as wide as the part (as under the pointer), and the ring round the part keeps DI2’s two channels, a light line beside a dark one, so it reads on any ground and is never colour alone. Round 1’s three are dropped. Inside a framed control or an entry the ring is drawn inset, outside a plate or a day.',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'twin',
                name: 'Twin tubes with a dark gap',
                see: 'A near-white tube, a dark gap and a pink tube round the part, like the double tube of a neon sign; the piece of the page tube over it is lit.',
                verdict: rec(
                    'three channels (core, dark, pink) so it reads on the pink face of a primary button and on the void; it is neon, and no other theme draws a double ring.',
                ),
            },
            {
                key: 'rails',
                name: 'Two tubes, top and foot',
                see: 'A near-white tube with a dark channel along the part’s top and along its foot, the sides a 2 px lavender hairline; the piece over the part is lit, so the part is framed between two lines of the horizon.',
                verdict: not(
                    'strictly horizontal, the world of the theme, and the part stands between two horizons; but the sides are the weak channel, and nostromo’s warning frame has the same two rails.',
                ),
            },
            {
                key: 'quiet',
                name: 'The horizon shouts, the ring whispers',
                see: 'The register’s own two-channel ring (lavender beside the void, inset 2 px) and a piece of tube over the part that is brighter and a little thicker than under the pointer.',
                verdict: not(
                    'the safest and the most anchor-led: the page tube says where the focus is; but a whisper ring is round 1’s ring with a brighter line, not new, and the piece is far from a part low on the page.',
                ),
            },
            {
                key: 'ramp',
                name: 'The sun’s ramp as the ring',
                see: 'A 3 px ring in the progress bar’s ramp, pink to laser yellow, with a dark ring against it, and the piece over the part in the ramp’s colours.',
                verdict: not(
                    'your bar as the focus; beautiful on dark, but a gradient ring reads weakly where the ground is pink (the primary button), and laser yellow beside a warning is a second meaning.',
                ),
            },
            {
                key: 'spill',
                name: 'The light spills down from the piece',
                see: 'The register’s two-channel hairline ring, and the part’s face lit by the horizon above it: a pink wash from its top edge fading to nothing by the middle; the piece over it is lit.',
                verdict: not(
                    'the most literal use of “each part carries its light”: the horizon lights the part; but a wash is a fill, and light’s and solstice’s hover are washes too; on a button it reads as a hover.',
                ),
            },
            {
                key: 'own',
                name: 'The part stands on its own tube',
                see: 'The two-channel ring and, under the part, a tube of the part’s width with a dark gap above it: the page tube repeated at the part’s foot; the piece over the part is lit.',
                verdict: not(
                    'two horizons, one above and one below, the part standing on the second; but the foot tube is the underline of a link and a hover’s line in other themes (grotesk, solstice), and it crowds the next row.',
                ),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G14',
        question: 'What does a press look like?',
        why: 'The anchor first: a press is a hand on the part, so the piece of the page horizon that is lit over a part under a hand is what the press acts on, as wide as the part. Round 1’s three (the tube dips, drops 1 px, the sun cut holds) are dropped. Each part is pressed every few seconds, held for a moment, and released as the press played backwards. Nothing moves the part’s words.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'charge',
                name: 'The piece charges',
                see: 'The piece over the part overdrives: the core turns white, the bloom doubles and spreads down over the part, and the part’s own top edge burns near-white while it is held; the part does not move.',
                verdict: rec(
                    'a press lights the line that the hand is on, as wide as the part, and it is the opposite of round 1’s dip; a bloom on dark is easy to see here because the piece is already lit; light’s hover also brightens, but not along a horizon.',
                ),
            },
            {
                key: 'ramp',
                name: 'The sun’s ramp fills the piece',
                see: 'The progress bar’s ramp, cut by stripes, fills the piece over the part start to end in 1 beat (225 ms) with the glowing head in front, the part’s ground takes the pressed token; releasing, it empties the same way backwards.',
                verdict: not(
                    'your bar again, as the answer to a press: the line “charges”; it is loud on a wide tile, where the piece is far from the part and the fill is a long way off the finger.',
                ),
            },
            {
                key: 'pool',
                name: 'The light gathers under the part',
                see: 'The piece dims and a pool of pink light gathers along the part’s foot, as neon on wet asphalt; held, then released backwards.',
                verdict: not(
                    'a picture of the street at night and it is a light change, no motion; but it is close to dipping the tube, which you did not like.',
                ),
            },
            {
                key: 'gleam',
                name: 'A gleam crosses the part',
                see: 'A thin near-white line with a bloom runs over the part from its top to its foot in 1 beat (225 ms) and leaves it a little brighter while held; the piece stays lit.',
                verdict: not(
                    'the chrome of the title face; but a line crossing the label is what the sun cut does on hover, and it covers the words for a frame.',
                ),
            },
            {
                key: 'focus',
                name: 'The piece draws in to its core',
                see: 'The piece over the part contracts from the part’s width to its middle half, brighter and thicker, as a beam focusing, in 1 beat (225 ms); released, it spreads back.',
                verdict: not(
                    'a press is a hand on the line and the line concentrates; but a piece narrower than its part breaks the anchor’s rule that it is exactly as wide as the part, and it is the least visible on a small button.',
                ),
            },
            {
                key: 'play',
                name: 'The VCR acknowledges: ▶ lights on the piece',
                see: 'A cyan ▶ in the VCR’s display font lights under the start of the piece over the part for as long as it is held.',
                verdict: not(
                    'it uses the OSD voice for a confirmation and the glyph sits on the line; but a glyph is small, and a press should be felt at the part, not read.',
                ),
            },
        ],
    },
];

/**
 * What research/_review/measure-motion.mjs reads in Firefox (2026-10-07, 1600 px, each part's t50 / t90 in ms from the start of its
 * motion, the run in ms), added to what each option says. Every close is its arrival played backwards (the tool's "mirror").
 * Written from the tool's output of 2026-10-07 (loading loops are CSS loops, not measured by the tool: their periods are the CSS's).
 * @type {Record<string, string>}
 */
const MEASURED = {
    'curve:lead':
        'tube t50 440 / t90 640 over 910 ms; bars t50 680 / t90 870 over 1125 ms; tile t50 820 / t90 940 over 1125 ms; every close is its arrival backwards (mirror)',
    'curve:strike':
        'tube t50 50 / t90 50 over 230 ms; bars t50 680 / t90 870 over 1125 ms; tile t50 820 / t90 940 over 1125 ms; every close is its arrival backwards (mirror)',
    'curve:beats':
        'tube t50 450 / t90 900 over 900 ms; bars t50 450 / t90 900 over 900 ms; tile t50 740 / t90 900 over 900 ms; every close is its arrival backwards (mirror)',
    'curve:passes':
        'tube t50 440 / t90 640 over 900 ms; bars t50 450 / t90 640 over 900 ms; tile t50 750 / t90 810 over 900 ms; every close is its arrival backwards (mirror)',
    'curve:release':
        'tube t50 550 / t90 660 over 680 ms; bars t50 900 / t90 1000 over 1125 ms; tile t50 970 / t90 1040 over 1125 ms; every close is its arrival backwards (mirror), the head’s fade and the tile’s horizon now on gentle ramps',
    'curve:even':
        'tube t50 430 / t90 800 over 900 ms; bars t50 450 / t90 810 over 900 ms; tile t50 600 / t90 830 over 900 ms; every close is its arrival backwards (mirror)',
    'opening:climb':
        'menu t50 220 / t90 320 over 450 ms; dialog t50 220 / t90 320 over 450 ms; piece t50 340 / t90 390 over 450 ms; every close is its arrival backwards (mirror)',
    'opening:blinds': 'piece t50 120 / t90 170 over 230 ms; every close is its arrival backwards (mirror)',
    'opening:stand':
        'menu t50 200 / t90 270 over 450 ms; dialog t50 200 / t90 270 over 450 ms; piece t50 120 / t90 170 over 230 ms; every close is its arrival backwards (mirror)',
    'opening:lower':
        'menu t50 220 / t90 320 over 450 ms; dialog t50 220 / t90 320 over 450 ms; piece t50 120 / t90 170 over 230 ms; every close is its arrival backwards (mirror)',
    'opening:rise':
        'menu t50 300 / t90 360 over 460 ms; dialog t50 300 / t90 360 over 460 ms; piece t50 120 / t90 170 over 230 ms; every close is its arrival backwards (mirror)',
    'opening:strike':
        'menu t50 340 / t90 340 over 340 ms; dialog t50 340 / t90 340 over 340 ms; piece t50 70 / t90 70 over 340 ms; every close is its arrival backwards (mirror)',
    'tone:osd': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'tone:ring': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'tone:swell': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'tone:pips': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'tone:rails': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'tone:striped': 'the piece is drawn from its centre and the mark strikes on once (450 ms) and holds',
    'leave:sets':
        'sun t50 450 / t90 740 over 900 ms; part t50 230 / t90 320 (cut from the top, 60 to 450 ms); piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:scan':
        'slits t50 320 / t90 450 over 630 ms; the sun rises and sets behind (a pulse, 900 ms); piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:beats':
        'four hard steps at 225 / 450 / 675 / 900 ms (the sun’s window t50 450 / t90 900, the part t50 450 / t90 680); piece lit for 880 ms; every close is its arrival backwards (mirror), no FRONT flagged',
    'leave:cascade':
        'part t50 270 / t90 390 over 540 ms; five bands, each 720 ms and 45 ms after the one above (the first t50 360 / t90 590, the last t50 540 / t90 770); piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:dye':
        'cover t50 210 / t90 290 over 400 ms, then the part t50 580 / t90 640; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:slab':
        'cover t50 350 / t90 720 over 900 ms; part switched off at 410 ms; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:ramp':
        'cover t50 430 / t90 760 over 900 ms; part switched off at 500 ms; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:floor':
        'cover t50 350 / t90 720 over 900 ms; part switched off at 410 ms; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:recede': 'part t50 450 / t90 650 over 900 ms; piece lit for 390 ms; every close is its arrival backwards (mirror)',
    'leave:drain':
        'part t50 210 / t90 290 over 400 ms after the cut (the sunset, t50 580 / t90 640); piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'press:charge':
        'piece t50 120 / t90 170 over 225 ms; button t50 220 / t90 220 over 225 ms; day t50 220 / t90 220 over 225 ms; every close is its arrival backwards (mirror)',
    'press:ramp':
        'piece t50 120 / t90 160 over 225 ms; button t50 10 / t90 10 over 225 ms; day t50 120 / t90 170 over 225 ms; every close is its arrival backwards (mirror)',
    'press:pool':
        'piece t50 120 / t90 170 over 225 ms; button t50 10 / t90 10 over 225 ms; day t50 120 / t90 170 over 225 ms; every close is its arrival backwards (mirror)',
    'press:gleam': 'button t50 10 / t90 10 over 225 ms; day t50 120 / t90 170 over 225 ms; every close is its arrival backwards (mirror)',
    'press:focus':
        'piece t50 120 / t90 150 over 225 ms; button t50 10 / t90 10 over 225 ms; day t50 120 / t90 170 over 225 ms; every close is its arrival backwards (mirror)',
    'press:play': 'button t50 10 / t90 10 over 225 ms; day t50 120 / t90 170 over 225 ms; every close is its arrival backwards (mirror)',
    'loading:charge': 'loop 1125 ms (5 beats), five hard steps of 225 ms; the page tube and every part carry it',
    'loading:flow': 'loop 1800 ms (8 beats), constant pace',
    'loading:road': 'loop 600 ms, constant pace (the bar’s own)',
    'loading:drive': 'loop 900 ms (4 beats), the floor and every plate’s floor band run at a constant pace',
    'loading:slice': 'loop 1800 ms (8 beats), constant pace',
    'loading:lanes': 'loop 1200 ms, constant pace, pink one way and cyan back',
    'loading:sun': 'loop 1350 ms (6 beats), one step per 225 ms',
    'loading:surface': 'loop 1800 ms (8 beats): 900 ms to fill, 900 ms to empty, on the sunrise curve',
    'loading:bulbs': 'loop 900 ms (4 beats), steps of 225 ms',
    'loading:rows': 'loop 900 ms (4 beats), one row per 225 ms',
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
lookLine.textContent = `${ASPECTS.length} questions, one rule of synthwave each, each option a real piece of page: the header’s foot with the page horizon on it, and the part in question at its real size. The first option of every question is the recommendation. The ten questions you approved on 07/10 and the anchor you decided at 21:21 (the page horizon) are the fixed ground of every scene. Pick the one that is synthwave to you, or “None of these” with a note.`;
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

/* --------------------------------------------- where the page tube is, per part */

/**
 * The one layout read of the demo: how far each part stands from the page
 * tube, written as `--sy-to` on the part's host (positive: the part is below
 * the tube, as every part of the body is; negative: it stands in the header,
 * on the tube). The piece of the tube is drawn from it, exactly as wide as the
 * part. Read when a page's size changes or it first shows, never per frame.
 */
function placePieces(/** @type {Element} */ pg) {
    const hz = pg.querySelector('.sy-hz');
    if (!hz) return;
    const tube = hz.getBoundingClientRect().top;
    if (!pg.getBoundingClientRect().height) return;
    for (const hostEl of pg.querySelectorAll('.sy-host')) {
        /** @type {HTMLElement} */ (hostEl).style.setProperty('--sy-to', `${Math.round((hostEl.getBoundingClientRect().top - tube) * 10) / 10}px`);
    }
}
const pages = [...section.querySelectorAll('.sy-pg')];
if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
        for (const entry of entries) placePieces(entry.target);
    });
    for (const pg of pages) ro.observe(pg);
}
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) placePieces(entry.target);
    });
    for (const pg of pages) io.observe(pg);
}
document.fonts?.ready.then(() => pages.forEach(placePieces));
pages.forEach(placePieces);

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
                    // What waited at the start of the arrival waits at the end of its close: the close lasts as long as the arrival.
                    endDelay: Number(x.timing.delay) || 0,
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
