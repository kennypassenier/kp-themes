// What makes synthwave synthwave, round 4 (update 2). Round 3 re-derived the eight
// questions from the anchor Kenny decided at 21:21 (the page horizon): one neon tube
// for the page on the header's foot, the floor being the page below it, every part
// carrying 1 px of its light, and, under a hand, a brighter piece of the tube exactly
// as wide as the part touched (research/synthwave-anchor/decided.json;
// themes/synthwave/CHARACTER.md section 0). Kenny judged it at 2026-10-07 23:00: five
// questions are picked and locked (GROUND below), three come back with new options:
// the corners (variations on "the light runs down the sides and fades", in the colours
// of the stripe they touch), loading (mixes of "the ramp flows" and "the floor
// drives", plus progress bars) and leaving (variations on "the sun sets through it" and
// "the sun's slab").
//
// A review-kit demo in aspect mode, synthwave only. Each ASPECT is one rule of the
// grammar asked as a question; each OPTION is a REAL piece of page (a
// `.kp-page-header` with the page tube on its foot, the floor below it, and the
// component in question at its real size), with one attribute on the scene
// (`data-sy-<aspect>="<key>"`) that options.css reads. The questions Kenny approved
// stay applied on every scene as the fixed ground (GROUND below). The first option of
// every question is the recommendation. The page's one clock (below) plays every
// scene that arrives, opens, presses, updates or leaves; it only writes attributes
// and text, it never reads layout. The one layout read in this file is `placePieces`:
// where each part stands against the page tube, written once per size change as
// `--sy-to`, so a piece of the tube can be drawn exactly as wide as the part and at
// the tube. The network graph is in no scene: it changes in no theme (Kenny, 02:54).

/* ----------------------------------------------------------- the ground */

/**
 * The fifteen questions Kenny approved (decided.json of round 1: ten; update.json of
 * update 2: five more), written on every scene: options.css keys the parts at rest
 * and the rise over the horizon on them. They are not asked again. The five of
 * update 2 are the curve (the tube leads, the bodies follow), the opening (the beam
 * climbs to the horizon), the tone of a warning (the VCR's symbols), the focus ring
 * (two tubes, top and foot) and the press (the piece charges); their drawings stay in
 * options.css, but no scene of the three questions below shows their parts.
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
    curve: 'lead',
    opening: 'climb',
    tone: 'osd',
    focus: 'rails',
    press: 'charge',
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

/** Every layer a loading picture may draw over a waiting part: top edge, foot edge, the whole face. */
const LOAD = `<span class="sy-load" aria-hidden="true"><i class="sy-g"></i><i class="sy-b"></i><i class="sy-f"></i></span>`;

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

/** A determinate progress bar, the package's own `.kp-progressbar` in synthwave. */
const pbar = (value, label, modifier = '') =>
    `<div class="kp-progressbar sy-bar sy-pbar ${modifier}" role="progressbar" aria-label="${label}, ${Math.round(
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
    plainTile: (label = 'Node 01', body = 'Uplink 71 %', cls = '') =>
        `<div class="kp-card sy-plate sy-tile ${cls}">${STRIP}${FLOOR}<p class="kp-card__title sy-title">${label}</p><p class="kp-card__body">${body}</p></div>`,
    kpi: (label = 'Traffic now', value = '412', foot = chip('6 %'), cls = '', extra = '') =>
        `<div class="kp-kpi sy-plate sy-kpi ${cls}" ${extra}>${STRIP}${FLOOR}
        <span class="kp-kpi__label sy-label">${label}</span>
        <span class="kp-kpi__value sy-figure sy-carrier" data-sy-num>${value}</span>
        <span class="kp-kpi__trend">${foot} on yesterday</span>
    </div>`,
    /**
     * Determinate progress bars as the curve scene of update 1 drew them: a mono caption in the accent over each package
     * `.kp-progressbar`. `rows` are [value, label, modifier class].
     */
    pbars: (
        rows = [
            [0.72, 'Sync'],
            [0.48, 'Backup'],
            [0.88, 'Upload'],
        ],
    ) =>
        `<div class="sy-pbars">${rows
            .map(
                ([v, l, mod]) =>
                    `<div class="sy-pbar-row"><span class="sy-cap">${l} ${Math.round(Number(v) * 100)} %</span>${pbar(Number(v), String(l), String(mod || ''))}</div>`,
            )
            .join('')}</div>`,
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

/** The mixes of "the ramp flows" and "the floor drives": the waiting parts at real size, and the progress bar's own busy road as the reference. */
const MIXES = ['flowdrive', 'oncoming', 'floorfirst', 'tinted'];
const WAITING = () =>
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

/** What the progress-bar options put in the wide cell: the bars of the curve scene of update 1, or a derivative of them. */
const BARSET = {
    bars: () => PART.pbars(),
    busy: () => `<div class="sy-part-bar"><span class="sy-cap">Sync busy</span>${PART.bar('Sync busy')}</div>`,
    weights: () =>
        PART.pbars([
            [0.72, 'Regular', ''],
            [0.72, 'Medium', 'kp-progressbar--md'],
            [0.72, 'Large', 'kp-progressbar--lg'],
        ]),
    beats: () => PART.pbars([[0.96, 'Sync']]),
    tube: () => PART.pbars(),
    road: () => PART.pbars(),
};
const BARS = (/** @type {string} */ key) => page(ACTIONS(), cell(BARSET[key](), 'sy-part--busy'), 'sy-pg--waits sy-pg--bars');
const LOADERS = (/** @type {string} */ key) => (MIXES.includes(key) ? WAITING() : BARS(key));

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

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, leave), 'loop' scenes loop in CSS, 'still' scenes do
 * not move. `options[0]` is the recommendation. The scene gets the option's key
 * (loading draws a different page for a mix and for a progress bar).
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: (key: string) => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G6',
        question: 'How do the corners of a panel look?',
        why: 'You prefer “the light runs down the sides and fades” (option 3 of the last round), with one rule: the colours of the sides start with the colours they touch in the stripe along the top. The stripe runs pink at its left end to cyan at its right end (the register’s own `--kp-stripe`, the primary to the accent), so every left side starts pink and every right side starts cyan. The five new options keep that rule and differ in how the light travels and ends: a tube that fades out, the ramp toward laser yellow, a short drop of fixed length, a hairline, and sides that sink into the floor. The old option stays last for reference (its sides start white). Radius 2 px, nothing notched, nothing flickers. Buttons, tags, chips and the tooltip keep their 2 px corner; the panels change.',
        kind: 'still',
        scene: CORNERS,
        options: [
            {
                key: 'fall',
                name: 'Pink down the left, cyan down the right, fading out',
                see: 'The stripe on the top edge runs pink to cyan. At each top corner its own colour turns and runs down the side as a 3 px tube with a soft bloom in that colour: pink on the left, cyan on the right. It falls at half strength by the middle and fades to nothing at the foot. The hairline round the plate is gone; the light is the frame.',
                verdict: rec(
                    'it is your sentence read literally: the side is the stripe turning the corner, so the two colours of the top become the two sides and the plate is one lit object; the fade says the light falls from the horizon above. Overlap: solstice lights a plate by one edge, its foot; nothing else draws two colours down two sides.',
                ),
            },
            {
                key: 'ramp',
                name: 'The sides run on through the ramp toward laser yellow',
                see: 'Same corners, but the light does not just fade: the left side goes from the stripe’s pink through the bar’s ramp to laser yellow and then out, the right side from the stripe’s cyan to pink and then out. Each side shows two colours and a fade, 3 px.',
                verdict: not(
                    'it is the sun’s ramp falling down the plate, the most colourful; but laser yellow is the warning’s colour (G13) and yellow beside a title can read as a warning, and the right side changes hue twice on a 4 rem plate.',
                ),
            },
            {
                key: 'short',
                name: 'A short drop of fixed length',
                see: 'Both sides are a 3 px tube that stays full for 0.8 rem and fades out over the next 2 rem, 2.75 rem in all, whatever the plate’s height; below that the plate has no sides, only its foot hairline and floor.',
                verdict: not(
                    'the corner stays the same size on a tall dialog and a low key figure, which answers “fading sides look unfinished on a tall plate”; but a plate without sides below the drop is lighter than the page’s other plates, and it is close to cyberpunk’s corner brackets in size.',
                ),
            },
            {
                key: 'hair',
                name: 'A hairline, not a tube',
                see: 'Each side is a 1 px line in the stripe’s colour (pink left, cyan right) from the top to the foot, full at the top and still at 40 % of its strength at the foot, so the plate keeps a full frame that is lit from above.',
                verdict: not(
                    'the quietest and the most finished: nothing disappears, the frame is complete; but a hairline is the register’s own border (the plate was already a hairline), so the only news is the two colours, and it does not read as neon.',
                ),
            },
            {
                key: 'floor',
                name: 'The sides sink into the floor',
                see: 'The two sides fall from the stripe in their colours and fade out a little past the middle; at the foot they come back for the last 1.35 rem, where the plate’s floor is, as two vertical lines of the grid in the same colours, so the light that fell from the horizon is picked up by the floor.',
                verdict: not(
                    'the light is continuous from the page horizon through the plate to the floor, the most literal use of the anchor; but the sides then have two lit places and a dark middle, and the foot lines read as a second frame on a plate that already has a floor.',
                ),
            },
            {
                key: 'fade',
                name: 'The light runs down the sides and fades (the last round’s option 3)',
                see: 'The top edge is lit with the stripe; at each top corner the light turns and runs down the side as a 3 px tube that starts near-white, turns pink and fades before the foot, the same on both sides.',
                verdict: not(
                    'it is what you chose, kept for reference; its sides start white and are pink on both sides, so the colours of the stripe do not turn the corner.',
                ),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'You want a mix of “the ramp flows through the tube” and “the floor drives toward you”, and more progress bars, one of them the progress bar you used to measure the timings in step 1. Options 1 to 4 are mixes: the page tube carries the sun’s ramp flowing through it while the page’s floor drives toward you, and every waiting part does the same at its scale (the ramp on its top edge, its floor band driving). They differ in who leads, how fast and which way. Option 5 is the progress bars of the curve question (Sync, Backup and Upload, with their caption, the lit length charging on the page tube one beat ahead of them) looping; option 6 is the package’s busy bar, unchanged. Options 7 to 10 are progress bars derived from them. Nothing flickers: lights glide or step on the beat, and a determinate bar fills, holds and empties backwards instead of jumping back.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'flowdrive',
                name: 'The ramp flows, the floor drives',
                see: 'The page tube is an unlit track with the sun’s ramp (pink, laser yellow, pink) flowing through it start to end, 8 beats (1800 ms) a period; under it the grid floor drives toward you, its lines born at the horizon and spreading at the bottom, 4 beats (900 ms). Each waiting part carries the ramp on its top edge and its floor band drives at the same pace.',
                verdict: rec(
                    'the straight mix of your two: colour moves along the line and the ground moves toward you, two directions at once, so the page reads as busy without a single hard cut; the periods are whole beats, the floor twice as fast as the ramp. The tube alone (the ramp) is titanium’s drift in colour; the floor under it is nobody else’s.',
                ),
            },
            {
                key: 'oncoming',
                name: 'The ramp flows against the drive',
                see: 'The floor drives toward you as in option 1 (900 ms), but the ramp flows the other way, from the end of the tube to its start, 8 beats (1800 ms): the light comes at the road from the far side, like the lights of oncoming cars.',
                verdict: not(
                    'two opposed motions are the most road-like of the four and read as depth; but the ramp walking backwards is against the grammar (G2: walking goes start to end), and a reader may take the leftward flow for “going back”.',
                ),
            },
            {
                key: 'floorfirst',
                name: 'The floor drives fast, the ramp trails',
                see: 'The floor is the busy one: its lines drive toward you every 2 beats (450 ms) and are brighter; the ramp in the tube is dimmer and slow, 16 beats (3600 ms) a period, start to end. On a waiting part the floor band runs fast and the ramp edge is a quiet trail.',
                verdict: not(
                    'the ground leads and the line follows, the opposite of the curve you picked (the tube leads); it is the strongest sense of speed and the least mannered ramp. But 450 ms of floor under the whole page is a lot of motion, and the tube, the anchor, is the quiet part.',
                ),
            },
            {
                key: 'tinted',
                name: 'The floor wears the ramp',
                see: 'As option 1 (ramp 1800 ms, floor 900 ms), but the floor’s lines are not pink: they take the ramp’s colours across the page, pink at the left through to laser yellow at the right, and drive toward you in them, so the colour of the tube is carried down into the road.',
                verdict: not(
                    'the tube and the floor become one picture, the ramp is on the whole page, and the horizon is a sunset on a grid; but the lines on the right are laser yellow and a yellow floor reads as a warning, and the plates’ own floor bands stay pink.',
                ),
            },
            {
                key: 'bars',
                name: 'The progress bars of the curve question, as measured',
                see: 'The three bars of step 1 as the curve question drew them: Sync 72 %, Backup 48 %, Upload 88 %, each with its mono caption in cyan, the package’s own `.kp-progressbar` (the ramp cut by stripes, the glowing head). The page tube charges first with the ramp and a head, one beat later the bars fill on the sunrise curve, 900 ms, hold, and empty backwards, tube last; 4500 ms a period.',
                verdict: not(
                    'it is the thing you timed, unchanged, so it is the reference for the others; the tube leading is the curve you picked. But it is a demonstration of progress, not of waiting: a bar that fills and empties says “here is a share”, not “wait”.',
                ),
            },
            {
                key: 'busy',
                name: 'The package’s progress bar, busy',
                see: 'The package’s own busy bar at full size: the road, a 3 px lane of near-white dashes with a pink bloom, running start to end on the bar’s dark track, 600 ms a period, nothing else moving; the page tube stands lit.',
                verdict: not(
                    'it is the reference, unchanged, and says “busy” without claiming a share; but it is exactly the bar that exists, so nothing is new, and a 600 ms road is the fastest thing on the page.',
                ),
            },
            {
                key: 'weights',
                name: 'The sun’s ramp at three weights',
                see: 'Three determinate bars at the package’s three sizes, 18, 27 and 36 px (regular, medium, large), all at 72 %, each the sun’s ramp cut by stripes with a glowing head; they fill together on the sunrise curve (900 ms), hold and empty backwards, with the page tube charging one beat ahead; 4500 ms a period.',
                verdict: not(
                    'it shows that the bar scales: the stripes cut the same way at 36 px as at 18 and the head grows with it, so a wide table can have a heavy bar; but the three are the same picture, and the large one is loud.',
                ),
            },
            {
                key: 'beats',
                name: 'The slats count the beats',
                see: 'One bar whose fill is cut into eight slats with a 2 px gap; it fills one slat per beat (225 ms) in hard steps to 96 %, holds, and empties one slat per beat; the head and the lit length on the page tube step with it; 5400 ms a period.',
                verdict: not(
                    'it is the marquee’s step in the bar: you can count the beats, and nothing glides; but it looks like a stack of lamps (nostromo’s lamp bank) and a stepped bar of cells is terminal’s `[####----]`; here the cells carry the sun’s ramp.',
                ),
            },
            {
                key: 'tube',
                name: 'The bar is the page tube, pulled down',
                see: 'The bar is the page tube at the part’s scale: a 3 px tube, a dim track and the ramp as its lit length with a glowing head (no stripes, no frame), under the page tube, which shows the same lit length at the same moment; they charge together, hold and empty backwards; 4500 ms a period.',
                verdict: not(
                    'the anchor made literal: the page tube and the bar are the same object and a part is lit the way the page is; the thinnest, most neon of the bars. But without the stripes it is not the bar you timed, and a 3 px bar is hard to see at the size of a table cell.',
                ),
            },
            {
                key: 'road',
                name: 'The head leaves the road behind it',
                see: 'A determinate bar whose fill is not a solid ramp but the road: lane dashes of near-white with a pink bloom lie where the head has been, and the head carries a short tail in the ramp’s colours (pink to laser yellow) in front of the dashes; it drives to the mark, holds, and drives back taking the road with it; 4500 ms a period.',
                verdict: not(
                    'the bar’s road and the bar’s ramp in one: the share is the road travelled and the head is the car; but the dashes behind the head are the busy bar’s picture and the ramp only lives in the tail, so it asks the reader to know both.',
                ),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G12',
        question: 'How does a part leave the page, and how does it arrive?',
        why: 'You like “the sun sets through it” and “the sun’s slab” and want three variations on each. Options 1 to 4 are the first family: the sun’s striped slab (laser yellow at the top, pink at the foot, its stripes widening toward the foot, every cut horizontal) passes down through the part and takes it with it: the original, then the same with a laser rim on its lower edge, with its stripes widening as it sets, and with the part sinking with it. Options 5 to 8 are the second family: the slab covers the part and takes it: the original, then with the horizon line leading, with a beat of standing still, and with the slab thinning into its stripes. Every leave is 4 beats (900 ms) and every arrival is the leave backwards, measured frame by frame. None draws a circle (solstice’s moon is an eclipse). The piece of the page tube over the part answers while the part goes.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'sets',
                name: 'The sun sets through it',
                see: 'The striped sun, laser yellow at the top and pink at the foot, its stripes widening toward the foot, comes down over the part from its top edge: the part is gone above the sun’s lower edge, so you see the cut travel down. The sun carries on below the part’s foot, behind its 1 px of horizon, and is gone. One move, 4 beats (900 ms), on the sunrise curve.',
                verdict: rec(
                    'it is the swallow you liked in the one picture the horizon allows: the sun goes down behind the line and takes the part with it, every cut horizontal, no disc. Overlap: solstice’s leave is an eclipse, a dark moon crossing start to end with a corona; this sun goes down, wears stripes and has no round edge.',
                ),
            },
            {
                key: 'setsrim',
                name: 'The sun sets through it, a laser rim on its lower edge',
                see: 'The same move, 900 ms, but the sun’s lower edge is a 2 px near-white laser line with a pink bloom: you see the line travel down the part and the part gone above it, and the line leave under the foot.',
                verdict: not(
                    'the cut becomes a drawn line, the way a sun sinks behind a bright horizon, and the edge is easier to follow on a small alert; but a laser line passing down a part is a scan (cyberpunk’s slice, terminal’s sweep), and the rim is the first thing the eye sees instead of the sun.',
                ),
            },
            {
                key: 'setswiden',
                name: 'The sun sets through it, its stripes widening',
                see: 'The same move, 900 ms, but the sun’s own cuts widen while it sets: at the top its stripes are thin, at the foot they are thick, as the sun is drawn when it touches the horizon, so the slab goes down and thins itself at once.',
                verdict: not(
                    'it is the detail of the real picture: a synthwave sun’s gaps grow as it sinks; it is the most faithful to the sun and costs nothing. But on a 2 rem alert the widening is a few pixels, and on a tile it is subtle.',
                ),
            },
            {
                key: 'setssink',
                name: 'The sun takes it down with it',
                see: 'The same move, 900 ms, but the part is not only cut from the top: it also sinks 35 % of its height as the sun passes, so the part goes down behind its own foot with the sun, not only under the sun’s edge.',
                verdict: not(
                    'the sun pulls the part down, the ground’s own sunset (the part sets behind its foot) and the sun in one move, the most physical; but a part that moves and is cut at once is busier, and the sinking text is cut off at a slant of the eye.',
                ),
            },
            {
                key: 'slab',
                name: 'The sun’s slab rises through it and sets with it',
                see: 'A slab in the sun’s own colours (laser yellow at the top, pink at the foot, stripes widening toward the horizon) rises from the part’s foot over it, covering it, then sinks behind the foot taking it. 4 beats (900 ms).',
                verdict: not(
                    'it keeps your idea in the sun’s real colours and stripes, rises and sets on one horizon and has no circle; but it is a slab, a sun without its shape, and the part is switched off under it in one step.',
                ),
            },
            {
                key: 'slabrim',
                name: 'The slab rises with the horizon line on its edge',
                see: 'The same slab, 900 ms, but a 2 px near-white line with a pink bloom rides its top edge: it leads the slab up over the part and then goes down with it behind the foot.',
                verdict: not(
                    'the horizon line is the anchor, so the slab rises with the page’s own line on it and the part is taken by the horizon; but it is close to “the floor takes it” of the last round, and the line makes the slab read as a wipe.',
                ),
            },
            {
                key: 'slabhold',
                name: 'The slab covers it, stands a beat, then sets',
                see: 'The slab rises over the part in one beat (225 ms), stands full for one beat while its stripes widen, and sets behind the foot in two beats (450 ms): 1 – 1 – 2, 900 ms.',
                verdict: not(
                    'the standing beat gives the sun its moment: for a beat the part is a sunset slab, and the rhythm is on the grid; but a pause in a leave makes the page slower to answer, and the quick cover is closer to a blink.',
                ),
            },
            {
                key: 'slabcut',
                name: 'The slab thins into its stripes',
                see: 'The slab rises over the part in 2 beats (360 ms); then its five stripes thin out one after another from the top, each toward its own foot, until only the part’s foot is left and that is gone, 540 ms more; 900 ms in all.',
                verdict: not(
                    'the sun is taken apart the way it is drawn, stripe by stripe, and nothing travels past the foot; but it is the venetian blind of the opening question, and the stagger of five stripes on a small alert is busy.',
                ),
            },
        ],
    },
];

/**
 * What research/_review/measure-motion.mjs reads in Firefox (1600 px, each part's t50 / t90 in ms from the start of its motion, the run in ms),
 * added to what each option says. Every close is its arrival played backwards (the tool's "mirror"). Loading loops are CSS loops, not measured
 * by the tool: their periods are the CSS's.
 * @type {Record<string, string>}
 */
const MEASURED = {
    'leave:sets':
        'sun t50 450 / t90 740 (80 to 900 ms); part t50 230 / t90 320 on the close (60 to 450 ms); piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:setsrim':
        'sun and rim t50 450 / t90 740 (80 to 900 ms); part t50 230 / t90 320 on the close; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:setswiden':
        'sun t50 450 / t90 740; its stripes (mask-size) t50 460 / t90 650 over 130 to 900 ms; part t50 230 / t90 320 on the close; every close is its arrival backwards (mirror)',
    'leave:setssink':
        'sun t50 450 / t90 740; part (cut and sinking) t50 240 / t90 650 over 60 to 900 ms on the close; every close is its arrival backwards (mirror)',
    'leave:slab':
        'slab t50 350 / t90 720 over 50 to 900 ms on the close; part switched off at 410 ms; piece lit for 880 ms; every close is its arrival backwards (mirror)',
    'leave:slabrim':
        'slab t50 350 / t90 720 over 50 to 900 ms; the line t50 210 / t90 290 over 50 to 410 ms, then rides the slab; part switched off at 410 ms; every close is its arrival backwards (mirror)',
    'leave:slabhold':
        'slab t50 200 / t90 740 over 30 to 900 ms (cover 225, stand 225, set 450); its stripes t50 340 / t90 430 over 220 to 450 ms; part switched off at 230 ms; every close is its arrival backwards (mirror)',
    'leave:slabcut':
        'slab t50 180 / t90 260 over 50 to 360 ms; five stripes each 360 ms, 45 ms apart (the first t50 540 / t90 620, the last t50 720 / t90 800); part switched off at 360 ms; every close is its arrival backwards (mirror)',
    'loading:flowdrive': 'loop: the ramp 1800 ms (8 beats), the floor 900 ms (4 beats), constant pace',
    'loading:oncoming': 'loop: the ramp 1800 ms (8 beats) against the drive, the floor 900 ms (4 beats), constant pace',
    'loading:floorfirst': 'loop: the floor 450 ms (2 beats), the ramp 3600 ms (16 beats), constant pace',
    'loading:tinted': 'loop: the ramp 1800 ms (8 beats), the floor 900 ms (4 beats), constant pace',
    'loading:bars': 'loop 4500 ms (20 beats): the tube 900 ms, the bars 900 ms one beat later, hold, then backwards, on the sunrise curve',
    'loading:busy': 'loop 600 ms, constant pace (the package’s own)',
    'loading:weights': 'loop 4500 ms (20 beats): fill 900 ms, hold, empty backwards, on the sunrise curve',
    'loading:beats': 'loop 5400 ms (24 beats): eight steps of 225 ms up, hold, eight steps down',
    'loading:tube': 'loop 4500 ms (20 beats): fill 900 ms, hold, empty backwards, on the sunrise curve',
    'loading:road': 'loop 4500 ms (20 beats): fill 900 ms, hold, empty backwards, on the sunrise curve',
    'corners:fall': 'still: sides 3 px, from the stripe’s end colour to half strength at the middle and nothing at the foot',
    'corners:ramp': 'still: sides 3 px, pink to laser yellow (left), cyan to pink (right), out at the foot',
    'corners:short': 'still: sides 3 px, 2.75 rem long, full for the first 30 %',
    'corners:hair': 'still: sides 1 px, the whole height, 40 % at the foot',
    'corners:floor': 'still: sides 3 px, out at 58 %, back for the last 1.35 rem',
    'corners:fade': 'still: sides 3 px, near-white to pink, out at 95 %',
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
lookLine.textContent = `${ASPECTS.length} questions are open, one rule of synthwave each, each option a real piece of page: the header’s foot with the page horizon on it, and the part in question at its real size. The first option of every question is the recommendation. The fifteen questions you approved (ten on 07/10 at 20:41, five on 07/10 at 23:00) and the anchor you decided at 21:21 (the page horizon) are the fixed ground of every scene. Pick the one that is synthwave to you, or “None of these” with a note.`;
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
        <div class="sy-scene" data-sy-kind="${a.kind}" ${GROUND_ATTRS} data-sy-${a.id}="${o.key}" data-sy-phase="in">${a.scene(o.key)}</div>`;
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
