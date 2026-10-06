// What makes titanium titanium (Kenny, 2026-10-07 00:05): "maak een demo die
// mij helpt om te kiezen wat Titanium nu echt Titanium maakt, met voorbeelden
// en aanbevelingen. Wees uitgebreid en zet er een woordje uitleg bij. Alles
// wat je denkt dat ik nodig zou hebben om dit thema uniform te maken wil ik
// aangereikt krijgen."
//
// A review-kit demo in aspect mode, titanium only. Each ASPECT is one rule of
// the theme's grammar (themes/titanium/CHARACTER.md, G1-G13) asked as a
// question; each OPTION is a live scene built from the package's own
// components, with one attribute on the scene's wrapper
// (`data-tc-<aspect>="<key>"`) that options.css reads. The recommended
// option is always first. The page's one clock (below) plays every scene
// that arrives, opens, presses or updates, so the rule is seen in action.

/* ----------------------------------------------------------- the parts */

const edge = '<span class="kp-button__edge" aria-hidden="true"></span>';
const button = (label, modifier = '', extra = '') =>
    `<button type="button" class="kp-button ${modifier}" ${extra}>${edge}<span class="kp-button__label">${label}</span></button>`;
const cutter = '<span class="tc-cutter" aria-hidden="true"></span>';

const PART = {
    dialog: () => `<div class="kp-dialog tc-dialog tc-arrives" role="group" aria-label="A dialog opening">${cutter}
        <p class="kp-dialog__title tc-title">Close INC-4471?</p>
        <p class="kp-dialog__description">The vendor is told at once.</p>
        <div class="kp-dialog__actions">${button('Cancel', 'kp-button--sm')}${button('Close it', 'kp-button--sm kp-button--primary')}</div>
    </div>`,
    menu: () => `<div class="tc-menu-wrap">
        ${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
        <div class="kp-popover tc-pop tc-arrives">${cutter}<ul class="kp-menu" role="menu">
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li>
            <li role="none"><button type="button" role="menuitem" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
        </ul></div>
    </div>`,
    tile: (label = 'Pump house 1') => `<div class="kp-card tc-tile tc-arrives">
        <p class="kp-card__title tc-title">${label}</p>
        <p class="kp-card__body">4.2 bar · 412 m³/h</p>
    </div>`,
    kpi: (label = 'Flow now', value = '412') => `<div class="kp-kpi tc-kpi">
        <span class="kp-kpi__label">${label}</span>
        <span class="kp-kpi__value tc-carrier" data-tc-num>${value}</span>
        <span class="kp-kpi__trend">avg 15 min</span>
    </div>`,
    rail: () => `<div class="tc-rail" aria-hidden="true">
        <span class="tc-rail__track"><span class="tc-rail__carriage" data-tc-r="1"></span></span>
        <span class="tc-rail__track"><span class="tc-rail__carriage" data-tc-r="2"></span></span>
        <span class="tc-rail__track"><span class="tc-rail__carriage" data-tc-r="3"></span></span>
    </div>`,
    days: (n = 7) =>
        `<div class="tc-days" aria-hidden="true">${[...Array(n).keys()]
            .map((i) => `<span class="tc-day tc-arrives" style="--i: ${i}; --c: ${Math.abs(i - (n - 1) / 2)}">${i + 1}</span>`)
            .join('')}</div>`,
    bar: (label = 'Busy') => `<div class="tc-bar tc-load" role="progressbar" aria-label="${label}"><span class="tc-bar__fill"></span></div>`,
    badge: (word = 'Running', tone = '') => `<span class="kp-badge tc-badge ${tone}">${word}</span>`,
    chip: (word = 'Running') => `<span class="kp-badge tc-chip tc-carrier" data-tc-word>${word}</span>`,
    alert: (text = 'Pump house 4 is back online.') =>
        `<div class="kp-alert tc-alert tc-arrives" role="status"><span class="kp-alert__body">${text}</span></div>`,
    spark: () => `<span class="tc-spark tc-carrier tc-carrier--svg" aria-hidden="true"><svg viewBox="0 0 120 32" preserveAspectRatio="none">
        <polyline points="0,24 15,20 30,22 45,14 60,16 75,10 90,12 105,6 120,8" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>`,
    node: () => `<span class="tc-node tc-carrier tc-carrier--svg" aria-hidden="true"><svg viewBox="0 0 64 40">
        <line x1="6" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
        <circle cx="46" cy="20" r="10" fill="var(--card)" stroke="currentColor" stroke-width="2.5"/></svg></span>`,
    bezel: (value = '38') =>
        `<div class="tc-bezel"><span class="kp-kpi__label">Open</span><span class="tc-bezel__num tc-carrier" data-tc-num>${value}</span></div>`,
    skeleton: () =>
        `<div class="tc-skel" aria-hidden="true"><span class="kp-skeleton tc-load"></span><span class="kp-skeleton tc-load"></span><span class="kp-skeleton tc-load"></span></div>`,
    field: () =>
        `<label class="kp-field tc-field"><span class="kp-field__label">Pump house</span><input class="kp-field__input" value="North 4" /></label>`,
};
const caption = (text) => `<p class="tc-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="tc-part ${cls}">${caption(cap)}${html}</div>`;

/* ------------------------------------------------------------ the scenes */

/** The four moving parts every motion question is shown on. */
const MOVING = () =>
    cell('Feed rail: three carriages, one per curve the option uses', PART.rail(), 'tc-part--wide') +
    cell('A dialog opens', PART.dialog()) +
    cell('A menu opens', PART.menu()) +
    cell('A tile arrives', PART.tile()) +
    cell('A live update', `<div class="kp-kpis">${PART.kpi()}</div>`);

const STATIC_SET = () =>
    cell('Button', button('Export readings') + ' ' + button('Add', 'kp-button--primary')) +
    cell('Badge and state chip', PART.badge('Draft') + ' ' + PART.chip('Running')) +
    cell('Card', PART.tile('Reservoir North')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell(
        'Menu panel',
        `<div class="kp-popover tc-pop tc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li></ul></div>`,
    ) +
    cell('Alert', PART.alert('The export runs at 02:00.'));

const LOADERS = () =>
    cell(
        'Key figure',
        `<div class="kp-kpis">${PART.kpi('Readings', '18 240').replace('class="kp-kpi tc-kpi"', 'class="kp-kpi tc-kpi tc-load" aria-busy="true"')}</div>`,
    ) +
    cell('Busy table: the 2 px bar', `<div class="tc-table"><span>Station</span><span>Flow</span>${PART.bar('Table busy')}</div>`) +
    cell(
        'Menu, loading entry',
        `<div class="kp-popover tc-pop tc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-load tc-load--edge" aria-busy="true">Loading stations…</button></li></ul></div>`,
    ) +
    cell('Month heatmap days', PART.days(5).replaceAll('tc-day tc-arrives', 'tc-day tc-load')) +
    cell('Chart groove', `<div class="tc-groove tc-load" aria-hidden="true"></div>`) +
    cell('Skeleton lines', PART.skeleton()) +
    cell('Progress bar, busy', PART.bar('Export busy'));

const LIVE = () =>
    cell('Key figure number', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('State word', PART.chip('Running')) +
    cell('Trend line', PART.spark()) +
    cell('Strip column number', PART.bezel()) +
    cell(
        'Dashboard tile',
        `<div class="kp-card tc-tile tc-carrier" data-tc-tile><p class="kp-card__title tc-title">Pump house 2</p><p class="kp-card__body" data-tc-num>4.2 bar</p></div>`,
    ) +
    cell('Network node', PART.node());

const COMPOSITES = () =>
    cell('Alone: the theme’s own button, for reference', button('Export readings') + ' ' + button('Add', 'kp-button--primary'), 'tc-part--wide') +
    cell(
        'Page header: its action buttons',
        `<header class="kp-page-header tc-header"><div class="kp-page-header__inner"><div><p class="kp-page-header__title tc-title">Pump houses</p></div>
        <div class="kp-page-header__actions">${button('Export', 'kp-button--sm tc-in-header')}${button('Add', 'kp-button--sm kp-button--primary tc-in-header')}</div></div></header>`,
        'tc-part--wide',
    ) +
    cell(
        'Menu: its entries',
        `<div class="kp-popover tc-pop tc-pop--static tc-in-menu"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Open incident</button></li><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li></ul></div>`,
    ) +
    cell(
        'Tile: its Open link',
        `<div class="kp-card tc-tile tc-in-tile"><p class="kp-card__title tc-title">Pump house 1</p><a class="kp-button kp-button--ghost kp-button--sm tc-tile-link" href="#tc-intro">${edge}<span class="kp-button__label">Open</span></a></div>`,
    ) +
    cell(
        'Drawer: its tour buttons',
        `<div class="kp-card tc-drawer"><p class="kp-card__title tc-title">Step 2 of 4</p><p class="kp-card__body">The filter keeps your choice.</p><div class="tc-row">${button('Skip', 'kp-button--sm kp-button--ghost')}${button('Next', 'kp-button--sm kp-button--primary')}</div></div>`,
    ) +
    cell(
        'Key figure as a link',
        `<div class="kp-kpis"><a class="kp-kpi tc-kpi tc-in-kpi" href="#tc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span><span class="kp-kpi__trend">avg 15 min</span></a></div>`,
    );

const FOCUS = () =>
    cell('Button', button('Export readings')) +
    cell('Header action', `<div class="tc-header-mini">${button('Export', 'kp-button--sm tc-in-header')}</div>`) +
    cell(
        'Key figure link',
        `<div class="kp-kpis"><a class="kp-kpi tc-kpi tc-in-kpi" href="#tc-intro"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></a></div>`,
    ) +
    cell(
        'Menu entry',
        `<div class="kp-popover tc-pop tc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="tc-days tc-days--one"><span class="tc-day tc-focusable">14</span></div>`) +
    cell(
        'Tile link',
        `<a class="kp-button kp-button--ghost kp-button--sm tc-tile-link" href="#tc-intro">${edge}<span class="kp-button__label">Open</span></a>`,
    );

const PRESS = () =>
    cell('Button', button('Export readings', 'tc-press')) +
    cell('Primary button', button('Add a pump house', 'kp-button--primary tc-press')) +
    cell(
        'Menu entry',
        `<div class="kp-popover tc-pop tc-pop--static"><ul class="kp-menu" role="menu"><li role="none"><button type="button" role="menuitem" class="kp-menu__item tc-press">Assign to…</button></li></ul></div>`,
    ) +
    cell('Calendar day', `<div class="tc-days tc-days--one"><span class="tc-day tc-press">14</span></div>`) +
    cell(
        'Key figure as a filter',
        `<div class="kp-kpis"><button type="button" class="kp-kpi kp-kpi--toggle tc-kpi tc-press" aria-pressed="false"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">3</span></button></div>`,
    );

const TYPE = () =>
    cell(
        'A tile with its words and figures',
        `<div class="kp-card tc-type"><p class="tc-type__label">Northern network</p><p class="tc-type__head">Pump house 4</p>
        <p class="tc-type__prose">Pressure dropped after the night valve closed; the crew checks it at 07:30.</p>
        <p class="tc-type__figure">4.2 <small>bar</small></p>
        <table class="tc-type__table"><tbody><tr><th scope="row">Flow</th><td>412 m³/h</td></tr><tr><th scope="row">Alarms today</th><td>3</td></tr></tbody></table>
        <p>${button('Open the log', 'kp-button--sm')} ${PART.badge('12 new')}</p></div>`,
        'tc-part--wide',
    );

const MOTIFS = () =>
    cell(
        'Pinned tooltip',
        `<div class="tc-tip tc-motif-plate" role="note"><b>14:00</b> · 412 m³/h<span class="tc-screws" aria-hidden="true"></span></div>`,
    ) +
    cell(
        'Trend tile (a dial)',
        `<div class="kp-card tc-dial tc-motif-dial"><span class="tc-knurl" aria-hidden="true"></span><span class="kp-kpi__label">Flow 24 h</span><span class="tc-dial__num">412</span>${PART.spark()}</div>`,
    ) +
    cell(
        'Plain card',
        `<div class="kp-card tc-tile tc-motif-card"><span class="tc-screws" aria-hidden="true"></span><span class="tc-knurl" aria-hidden="true"></span><p class="kp-card__title tc-title">Reservoir North</p><p class="kp-card__body">Level 71 %</p></div>`,
    ) +
    cell('Button', `<span class="tc-motif-button">${button('Export readings')}</span>`) +
    cell(
        'Key figure',
        `<div class="kp-kpis"><div class="kp-kpi tc-kpi tc-motif-card"><span class="tc-screws" aria-hidden="true"></span><span class="tc-knurl" aria-hidden="true"></span><span class="kp-kpi__label">Readings</span><span class="kp-kpi__value">18 240</span></div></div>`,
    );

const TONES = () =>
    cell('The heat ramp', `<div class="tc-ramp" aria-hidden="true"></div>`, 'tc-part--wide') +
    cell(
        'Chart with four series',
        `<div class="tc-series" aria-hidden="true"><span style="--h: 70%" data-s="1"></span><span style="--h: 45%" data-s="2"></span><span style="--h: 85%" data-s="3"></span><span style="--h: 55%" data-s="4"></span></div>`,
    ) +
    cell('A tier badge', PART.badge('Gold tier', 'tc-tier')) +
    cell('An error', `<div class="kp-alert kp-alert--destructive" role="alert"><span class="kp-alert__body">Pump 3 stopped.</span></div>`) +
    cell(
        'A warning figure',
        `<div class="kp-kpis"><div class="kp-kpi tc-kpi" data-kp-tone="warning"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">1.1 bar</span></div></div>`,
    );

const COLOUR = () =>
    cell('Card with a heading', PART.tile('Reservoir North')) +
    cell('Key figure, updating', `<div class="kp-kpis">${PART.kpi()}</div>`) +
    cell('Buttons and a badge', button('Export') + ' ' + button('Add', 'kp-button--primary') + ' ' + PART.badge('Running', 'tc-running')) +
    cell('Loading bar', PART.bar('Loading')) +
    cell(
        'Today in a month',
        `<div class="tc-days tc-days--today">${[12, 13, 14, 15].map((d) => `<span class="tc-day${d === 14 ? ' tc-today' : ''}">${d}</span>`).join('')}</div>`,
    );

const SURFACE = () =>
    cell('Card', PART.tile('Reservoir North')) +
    cell('Key figure', `<div class="kp-kpis">${PART.kpi('Readings', '18 240')}</div>`) +
    cell('Button', button('Export readings') + ' ' + button('Add', 'kp-button--primary')) +
    cell('Field', PART.field());

const DIRECTION = () =>
    cell('A week of days arrives', PART.days(7), 'tc-part--wide') +
    cell('A tile arrives', PART.tile()) +
    cell('Loading bar', PART.bar('Loading')) +
    cell(
        'A pass over a tile',
        `<div class="kp-card tc-tile tc-pass" aria-hidden="true"><p class="kp-card__title tc-title">Pump house 3</p><p class="kp-card__body">Reading…</p></div>`,
    );

const OPENING = () => cell('A menu drops from its button', PART.menu()) + cell('A dialog opens', PART.dialog());

const DURATION = () =>
    cell('Contact: a press', `<div class="tc-row">${button('Export readings', 'tc-tap')}</div><p class="tc-readout" data-tc-readout="contact"></p>`) +
    cell('Cut: a dialog opens', PART.dialog() + '<p class="tc-readout" data-tc-readout="cut"></p>') +
    cell('Loop: one loading pass', PART.bar('Loading') + '<p class="tc-readout" data-tc-readout="loop"></p>');

/** A part that leaves and arrives, with the heat band its leave may run over it. */
const leaver = (html) => `<div class="tc-leaver">${html}<span class="tc-heat" aria-hidden="true"></span></div>`;
const LEAVE = () =>
    cell('An alert', leaver(PART.alert().replace(' tc-arrives', ''))) +
    cell('A card', leaver(PART.tile('Reservoir North').replace(' tc-arrives', ''))) +
    cell(
        'A key figure',
        leaver(
            `<div class="kp-kpis"><div class="kp-kpi tc-kpi"><span class="kp-kpi__label">Flow now</span><span class="kp-kpi__value">412</span></div></div>`,
        ),
    );

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, update), 'loop' scenes loop in CSS, 'still' scenes do
 * not move. `options[0]` is the recommendation.
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', live?: boolean, scene: () => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'curve',
        label: 'The motion curve',
        rule: 'G1',
        question: 'Does titanium move at a constant speed (linear), or does it slow down as it lands (eased)?',
        why: 'A machine feeds at a constant rate: a cutter does not slow down before the end of the cut. Today 15 picks are linear and about 15 are eased or springy, so two things next to each other move in two different ways.',
        kind: 'cycle',
        live: true,
        scene: MOVING,
        options: [
            {
                key: 'linear',
                name: 'Linear everywhere',
                see: 'Every part moves at one constant speed from start to end and stops dead: the three carriages run side by side, the dialog and the menu are cut open, the tile is milled in, the number gets the heat tint.',
                verdict: rec('it is what metal under a machine does, and it makes every part feel like one machine.'),
            },
            {
                key: 'eased',
                name: 'Eased (slows down as it lands)',
                see: 'The same pictures, but each one starts fast and settles softly (decelerate, cubic-bezier(0.2, 0.8, 0.2, 1)). The carriages bunch up near the end.',
                verdict: not(
                    'it reads as soft and organic, the way light or fabric moves, which belongs to the calmer themes rather than to milled metal.',
                ),
            },
            {
                key: 'mix',
                name: 'The current mix',
                see: 'As the picks are today: the dialog cut linear, the menu seated with a 2 px overshoot (320 ms ease-out), the tile milled at 450 ms ease-in-out, the number swells 12 % (500 ms ease-out). The carriages: linear, ease-in-out, spring.',
                verdict: not('three curves on one screen; the bounce and the swell are the parts that make titanium feel like a different theme.'),
            },
        ],
    },
    {
        id: 'direction',
        label: 'The direction',
        rule: 'G2',
        question: 'Which way does motion travel when something arrives or loads?',
        why: 'A tool feeds in one direction: from where you start reading to where you stop (left to right here, mirrored in right-to-left languages). One axis lets the eye predict where the next thing will happen.',
        kind: 'cycle',
        scene: DIRECTION,
        options: [
            {
                key: 'feed',
                name: 'Start → end, like a feed',
                see: 'Each day is cut in from its left edge, one after the other in reading order; the tile is milled from the left; the loading pass runs left to right.',
                verdict: rec('it is the one direction 15 picks already share (the theme’s spine), and it mirrors itself in right-to-left text.'),
            },
            {
                key: 'centre',
                name: 'Centre-out',
                see: 'Each day opens from its middle, the middle day first; the tile opens from its centre; the loading band grows from the middle to both ends.',
                verdict: not('centre-out is a reveal or a bloom, a stage effect rather than a tool, and it has no natural reading order.'),
            },
            {
                key: 'mix',
                name: 'Mixed, as today',
                see: 'The days wind in like a watch crown (rotate −120°, scale 0.4, diagonal order), the tile seats from its centre with an overshoot, the pass over the tile runs right to left.',
                verdict: not('three directions on one screen; the eye has nowhere to look first.'),
            },
        ],
    },
    {
        id: 'opening',
        label: 'Opening what drops from a button',
        rule: 'G3',
        question: 'How do a menu and a dialog open?',
        why: 'Today the dialog, the header’s menu and the menu button’s menu open in three different ways. Whatever drops from a button should open one way, so a person learns it once.',
        kind: 'cycle',
        scene: OPENING,
        options: [
            {
                key: 'cut',
                name: 'Cut open from the top',
                see: 'The panel is cut open from its top edge down, 240 ms linear, with a thin violet cutter line riding the cut; it closes as the cut reversed.',
                verdict: rec('it is the dialog’s opening already, it reads as a machining step, and it needs no bounce or fade.'),
            },
            {
                key: 'seated',
                name: 'Seated drop',
                see: 'The panel drops 10 px, overshoots by 2 px and settles (the menu’s pick today, 320 ms ease-out).',
                verdict: not('the overshoot is a spring, and metal parts do not bounce into place.'),
            },
            {
                key: 'scale',
                name: 'Scale from the button',
                see: 'The panel grows from the corner at its button, from 85 % to full size, 200 ms linear.',
                verdict: not('growing is something soft does; it is common in app frameworks and so says little about titanium.'),
            },
        ],
    },
    {
        id: 'durations',
        label: 'How long things take',
        rule: 'G4',
        question:
            'Which three durations does titanium use: one for touching (press, hover, focus), one for a cut (open, arrive, leave), one for a loading loop?',
        why: 'Today there are nine loop periods (900 to 2400 ms) and one-shots from 160 to 1400 ms. Three fixed bands make two things on one screen move in step.',
        kind: 'cycle',
        scene: DURATION,
        options: [
            {
                key: 'bands',
                name: 'Contact 60 · cut 240 · loop 1800 ms',
                see: 'A press lands in 60 ms (instant to the eye), the dialog is cut open in 240 ms, the loading pass crosses in 1.8 s.',
                verdict: rec('these are the register’s own numbers already (button, dialog, skeleton), so most of the theme fits without a change.'),
            },
            {
                key: 'fast',
                name: 'Faster: 40 · 160 · 1200 ms',
                see: 'Everything a third quicker: the cut is a snap, the loading pass hurries.',
                verdict: not('a 1.2 s loop reads as urgent, as if something is wrong; 160 ms cuts are hard to follow.'),
            },
            {
                key: 'slow',
                name: 'Slower: 120 · 400 · 2600 ms',
                see: 'A press you can see happen, a slow cut, a calm loading pass.',
                verdict: not('a 120 ms press feels late under the finger, and 400 ms for every dialog adds up over a working day.'),
            },
        ],
    },
    {
        id: 'colour',
        label: 'Where the colour goes',
        rule: 'G5, G6',
        question: 'Where may the oxide colours (gold, violet, blue, cyan) appear?',
        why: 'Titanium’s colour is real: heat or anodising grows an oxide film whose thickness decides the colour. If it appears only where something happened (loading, an update, today), the colour means something; spread everywhere it becomes wallpaper.',
        kind: 'cycle',
        live: true,
        scene: COLOUR,
        options: [
            {
                key: 'cause',
                name: 'Oxide only as a cause',
                see: 'Bare grey metal everywhere; colour appears only in the loading track, the heat tint of a live update, the ring of today and the dot of a running state.',
                verdict: rec('colour stays a signal: when you see it, something is happening or it is today.'),
            },
            {
                key: 'decor',
                name: 'Oxide as decoration everywhere',
                see: 'Rainbow-anodised frames on cards and the figure, oxide-tinted buttons and badges, gradient headings.',
                verdict: not('it looks rich at first sight but the colour stops meaning anything, and gradient text is harder to read.'),
            },
            {
                key: 'mono',
                name: 'Monochrome metal, one accent',
                see: 'No oxide at all: the bright metal colour (primary) is the only accent, for loading, today, running and updates alike.',
                verdict: not('it is calm but it loses what sets titanium apart from the plain dark theme: the anodised film.'),
            },
        ],
    },
    {
        id: 'corners',
        label: 'The corners',
        rule: 'G7',
        question: 'Are titanium’s corners square with a cut-off corner (a chamfer), plain square, or slightly rounded?',
        why: 'The register cuts two corners of every button, field, badge, card and alert at 45 degrees. Six picks brought rounded corners back (a pill chip, 0.75rem on the menu), and the package’s own badge is a pill under the cut today (radius 999px and the chamfer at once: two corners cut, two round). Some parts look moulded, others milled.',
        kind: 'still',
        scene: STATIC_SET,
        options: [
            {
                key: 'chamfer',
                name: 'Square with the chamfer',
                see: 'Every plate, button, badge and chip has square corners with two of them cut off at 45 degrees.',
                verdict: rec('the chamfer is the most recognisable part of titanium; on everything it reads as one machined set.'),
            },
            {
                key: 'square',
                name: 'Square, no chamfer',
                see: 'Hard square corners, nothing cut off.',
                verdict: not('clean, but it is brutalism’s and blueprint’s corner; titanium loses its own mark.'),
            },
            {
                key: 'radius',
                name: 'Small radius, as some picks have now',
                see: 'Every corner slightly rounded (0.375rem), the state chip a pill.',
                verdict: not('rounded corners are moulded plastic or cast parts, not milled metal.'),
            },
        ],
    },
    {
        id: 'chamfer',
        label: 'Which corners are cut',
        rule: 'G7',
        question: 'If corners are chamfered, which ones?',
        why: 'The register cuts top-left and bottom-right, but the skeleton, switch thumb and wizard step cut the other diagonal, the tooltip only one corner, and the strip’s columns all four.',
        kind: 'still',
        scene: STATIC_SET,
        options: [
            {
                key: 'tlbr',
                name: 'Top-left and bottom-right',
                see: 'The register’s own diagonal on every part.',
                verdict: rec('buttons, fields, cards and alerts already use it, so only five small parts move.'),
            },
            {
                key: 'trbl',
                name: 'Top-right and bottom-left',
                see: 'The other diagonal on every part.',
                verdict: not('it would change the most-used parts to match the least-used ones.'),
            },
            {
                key: 'all',
                name: 'All four corners',
                see: 'An octagon on every part, as the strip’s columns have now.',
                verdict: not('four cuts read as a badge or a nut, and on a small button they eat into the label.'),
            },
        ],
    },
    {
        id: 'surface',
        label: 'The surface',
        rule: 'G8',
        question: 'How much of the machining shows on a surface?',
        why: 'Brushed grain, a bright line along the top edge where the tool left it, and figures engraved into the plate make titanium a material instead of a colour scheme. Too much of it and the text has to fight the texture.',
        kind: 'still',
        scene: SURFACE,
        options: [
            {
                key: 'machined',
                name: 'Brushed grain, tool edge, engraving',
                see: 'A fine vertical grain you notice only up close, a bright hairline along each plate’s top edge, figures and titles with a dark cut over a lit lip.',
                verdict: rec('it reads as metal at a glance and stays out of the way when you read.'),
            },
            {
                key: 'matte',
                name: 'Plain matte',
                see: 'Flat surfaces, no grain, no edge line, no engraving.',
                verdict: not('it turns titanium into a grey version of dark; nothing says metal.'),
            },
            {
                key: 'heavy',
                name: 'Heavy texture',
                see: 'Deep grain, a cross-hatched knurl on every plate, a strong bevel and deeper engraving.',
                verdict: not('it is impressive once, tiring after an hour, and it lowers the contrast behind small text.'),
            },
        ],
    },
    {
        id: 'live',
        label: 'A live update',
        rule: 'G9',
        question: 'What happens when a value changes in place?',
        why: 'The package already has titanium’s update: a heat tint runs over the new value and cools away. Six component picks each drew their own instead (a swell, a flare, a glow, a ring, a sweep the other way, a flash), so one event looks six different ways.',
        kind: 'cycle',
        live: true,
        scene: LIVE,
        options: [
            {
                key: 'heat',
                name: 'The heat tint on every carrier',
                see: 'On each of the six, the oxide colours run over the new value from left to right in 240 ms and cool away. Nothing grows, glows or flashes.',
                verdict: rec(
                    'it is the package’s own update, it keeps the value readable (only its colour changes), and it says “heat” — titanium’s cause of colour.',
                ),
            },
            {
                key: 'mix',
                name: 'The six current picks',
                see: 'Number swells 12 %, state word flares brighter, trend line glows, column number throws a ring, tile gets a white sheen right to left, node flashes a ring.',
                verdict: not('six motions for one event, all eased, and swelling and glowing are light, not metal.'),
            },
            {
                key: 'glint',
                name: 'A light glint',
                see: 'A white band of light sweeps over each value from left to right, 400 ms linear.',
                verdict: not('a glint is polish or glass; it is calm and uniform but it uses light where titanium uses heat.'),
            },
        ],
    },
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does titanium draw while something loads, on every loading element?',
        why: 'Today seven elements show seven pictures at nine speeds. You picked the anodising bath for the key figure. One picture at one period means two loaders side by side run in step.',
        kind: 'loop',
        scene: LOADERS,
        options: [
            {
                key: 'cutter',
                name: 'The cutter leaving heat',
                see: 'A bright tool line runs left to right and leaves the oxide colours behind it in its track, which fade before the next pass; 1.8 s, every element in step.',
                verdict: rec(
                    'it joins the two halves of today: the tool pass (motion) and your anodising bath (colour), and it is what cutting does to titanium.',
                ),
            },
            {
                key: 'bath',
                name: 'The anodising bath alone',
                see: 'Your key figure’s pick on everything: the surface washed in the drifting oxide colours, no tool line; at one 1.8 s period so all run in step.',
                verdict: not(
                    'it is your favourite and it is a strong second: only, without the tool the colour drifts but nothing works, which is weaker on a thin bar or a menu entry.',
                ),
            },
            {
                key: 'today',
                name: 'Grey tool passes, as today',
                see: 'Each element its own: the bath on the key figure (2.2 s), a pulsing bar (1.8 s ease-in-out), a stepped menu line (1 s), blue cutters in the days (1.6 s), a cutter head on the groove (2.4 s), the grey skeleton pass (1.8 s), the slug (1.1 s).',
                verdict: not('seven pictures at seven speeds; they drift out of step next to each other.'),
            },
        ],
    },
    {
        id: 'leave',
        label: 'Leaving and arriving',
        rule: 'G11',
        question: 'How does something leave (an alert closed, a card removed), and how does it arrive?',
        why: 'Arrival plays the leave backwards, so the two share one rule. Today’s leave is the theme’s only ease-in and its longest one-shot (650 ms), with its colour band running right to left.',
        kind: 'cycle',
        scene: LEAVE,
        options: [
            {
                key: 'cool',
                name: 'Cool-away, start → end, 400 ms',
                see: 'Leaving: the oxide colours run over the part from left to right and it cools away, 400 ms linear. Arriving: the same, backwards.',
                verdict: rec('it keeps the heat story, runs the theme’s one direction, and it is linear and a third shorter than today.'),
            },
            {
                key: 'today',
                name: 'Today’s 650 ms ease-in',
                see: 'The colour band runs right to left while the part fades, slowly at first then fast; arrival is that backwards.',
                verdict: not('the only ease-in in the theme, against the theme’s direction, and long enough to wait for.'),
            },
            {
                key: 'cut',
                name: 'A plain cut',
                see: 'No colour: the part is cut away from left to right in 240 ms, and cut back in the same way.',
                verdict: not('it is clean and fast but loses the heat, the one thing that makes a leave titanium’s rather than any theme’s.'),
            },
        ],
    },
    {
        id: 'composites',
        label: 'Buttons inside a header, menu, tile or drawer',
        rule: 'G13',
        question: 'Does a button inside something bigger behave exactly like titanium’s own button?',
        why: 'The page header’s buttons shrink when pressed and get a dotted focus ring the chamfer cuts off; the menu’s entries lose the focus ring; the tile’s Open link gets a grey rounded plate. Inside a composite they look like another theme’s buttons. Use the State buttons (Rest, Hover, Focus, Press) or point and tab.',
        kind: 'still',
        scene: COMPOSITES,
        options: [
            {
                key: 'base',
                name: 'Exactly like titanium’s own button',
                see: 'Every inner button, link and entry hovers with the accent ground and the oxide edge, focuses with the two-line ring inside the chamfer, and drops 1 px when pressed — as the button alone at the top.',
                verdict: rec('one button is learnt once, and a focus ring that the chamfer cannot cut off is an accessibility fix as well.'),
            },
            {
                key: 'today',
                name: 'As today: each composite its own',
                see: 'Header buttons: a primary frame, a 1 px line on hover, a dotted focus ring (cut off by the chamfer), a 2 % shrink on press. Menu entries: a 1 px grey focus line. Tile link: a grey rounded plate. Key figure: a 3 px cyan ring 4 px out.',
                verdict: not(
                    'four kinds of button on one screen, and two focus rings that are hard or impossible to see (fails WCAG 2.2 focus visibility).',
                ),
            },
            {
                key: 'accent',
                name: 'The base, plus an accent from the composite',
                see: 'The theme’s button everywhere, and on top of it the composite adds one mark: a 1 px bright line on header buttons on hover, a 2 px bar at the start of a menu entry, the tile’s top edge lights up with its link.',
                verdict: not('a good second if a composite needs its own voice; take it only where a composite has a reason to stand out.'),
            },
        ],
    },
    {
        id: 'focus',
        label: 'The focus ring',
        rule: 'G6, G13',
        question: 'What does keyboard focus look like? Every part on this row is shown focused.',
        why: 'The chamfer is a clip-path, and a clip cuts away anything drawn outside the part, an outline included. Today three rings are in use (two-line inset, dotted, 3 px cyan outside).',
        kind: 'still',
        scene: FOCUS,
        options: [
            {
                key: 'inset',
                name: 'The register’s ring, inside the chamfer',
                see: 'A light 2 px line along the inside of the edge with a dark 2 px line inside it, on every part.',
                verdict: rec('it survives the chamfer, reads on every ground (two colours) and is already the button’s ring.'),
            },
            {
                key: 'outline',
                name: 'A bright primary outline',
                see: 'A 2 px bright metal outline 2 px outside each part, drawn inside where the chamfer would cut it off.',
                verdict: not(
                    'it is clear on dark grounds, but one colour can vanish on a bright primary button, and it needs two drawings (inside and outside).',
                ),
            },
            {
                key: 'mix',
                name: 'The current mix',
                see: 'Button: the inset ring. Header: a dotted outline, cut off by the chamfer (nearly invisible). Key figure: 3 px cyan, 4 px out. Menu entry: a 1 px grey line. Day and tile link: a primary outline.',
                verdict: not('the dotted ring and the 1 px line fail WCAG 2.2 focus visibility, and five rings is four too many.'),
            },
        ],
    },
    {
        id: 'press',
        label: 'The press',
        rule: 'G4, G13',
        question: 'What does a part do when it is pressed? The page presses every part once in each cycle of a few seconds.',
        why: 'Metal does not compress. The register drops the button 1 px into its seat and puts out the bright top edge; the header shrinks its buttons instead, and the calendar presses its days diagonally on hover.',
        kind: 'cycle',
        scene: PRESS,
        options: [
            {
                key: 'drop1',
                name: 'Drops 1 px into its seat',
                see: 'The part drops 1 px at once, its bright top edge goes out and a hairline of shadow takes its place; it comes back in 60 ms.',
                verdict: rec('it is the register’s press, it is felt rather than seen, and nothing changes size.'),
            },
            {
                key: 'drop2',
                name: 'Drops 2 px, deeper shadow',
                see: 'A heavier press: 2 px down with a clear inner shadow.',
                verdict: not('more visible, but a 2 px jump on a small part reads as a layout shift.'),
            },
            {
                key: 'scale',
                name: 'Shrinks 2 %, as the header today',
                see: 'The part shrinks to 98 % around its centre.',
                verdict: not('shrinking is rubber or a soft key; the register says outright that metal does not compress.'),
            },
        ],
    },
    {
        id: 'type',
        label: 'Where the monospace goes',
        rule: 'G8',
        question: 'Which words are set in the engraved monospace (Martian Mono)?',
        why: 'An instrument engraves its figures and scale labels; its manual is printed in a normal face. Too much monospace makes reading slow, too little and the instrument look goes.',
        kind: 'still',
        scene: TYPE,
        options: [
            {
                key: 'figures',
                name: 'Figures, labels and counts',
                see: 'Numbers, units, small-capital labels, table figures and counts in mono; headings in Sora; sentences and button words in the body face.',
                verdict: rec('it is what the decided picks already do, and sentences stay quick to read.'),
            },
            {
                key: 'allmono',
                name: 'Monospace everywhere',
                see: 'Every word on the tile in Martian Mono, the heading and the sentence included.',
                verdict: not('it reads as the terminal theme, and long sentences in mono are slow.'),
            },
            {
                key: 'figuresonly',
                name: 'Figures only',
                see: 'Only numbers in mono; labels, counts and table headers in the body face.',
                verdict: not('the labels lose their engraved, stamped look, which is half of the instrument feel.'),
            },
        ],
    },
    {
        id: 'motifs',
        label: 'Screws and knurling',
        rule: 'G8',
        question: 'Where do the screws (rivets) and the knurled grip appear?',
        why: 'Three picks draw a machine detail: four screws on the chart’s pinned tooltip, a knurled band on the trend dial, a knurled hub on the graph. A detail that appears where a real part would have it reads as craft; everywhere it reads as a sticker.',
        kind: 'still',
        scene: MOTIFS,
        options: [
            {
                key: 'turned',
                name: 'Only where a real part would have them',
                see: 'Screws on the plate that is pinned (the tooltip); a knurled grip on the dial (the trend tile); plain cards, buttons and figures.',
                verdict: rec('the detail keeps its meaning (fastened, turnable) and the screen stays quiet.'),
            },
            {
                key: 'none',
                name: 'None',
                see: 'No screws, no knurling anywhere.',
                verdict: not('it removes two of the decided picks’ ideas, and the tooltip and dial lose what makes them instruments.'),
            },
            {
                key: 'all',
                name: 'On everything',
                see: 'Four screws and a knurled band on every card, figure and button.',
                verdict: not('decoration on everything reads as steampunk, and it crowds small parts.'),
            },
        ],
    },
    {
        id: 'tones',
        label: 'Bronze and the error colour',
        rule: 'G5',
        question: 'May bronze appear on its own?',
        why: 'Titanium’s bronze (hsl 12 88% 62%) is the same colour as its error colour. Inside the heat ramp it reads as bronze; alone, on a chart series or a badge, it reads as “something is wrong”.',
        kind: 'still',
        scene: TONES,
        options: [
            {
                key: 'ramp',
                name: 'Bronze only inside the ramp',
                see: 'Bronze appears only between gold and violet in the heat ramp; the chart’s fourth series is bright metal; the tier badge is gold; the error alone is red-bronze.',
                verdict: rec('the error colour keeps one meaning, and the ramp keeps all its stops.'),
            },
            {
                key: 'free',
                name: 'Bronze as a free accent',
                see: 'Bronze also on the chart’s fourth series and on the tier badge.',
                verdict: not('the series and the badge look like errors next to the real error alert.'),
            },
            {
                key: 'nobronze',
                name: 'No bronze at all',
                see: 'The ramp runs gold → violet → blue → cyan; bronze never appears outside an error.',
                verdict: not('safe, but the ramp loses a real oxide stop and the jump from gold to violet is harder.'),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="titanium"]'));
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
lookLine.setAttribute('data-for', 'titanium');
lookLine.textContent = `${ASPECTS.length} questions, one rule of titanium each; the first option of every question is the recommendation. Pick the one that is titanium to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-tc-aspects]'));
const toc = document.querySelector('[data-tc-toc]');
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'tc-aspect';
    box.id = `tc-${a.id}`;
    box.setAttribute('data-tc-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-tc-${a.id}`);
    box.innerHTML = `<div class="tc-aspect__head">
        <h3 id="h-tc-${a.id}"><span class="tc-aspect__no">${n + 1}</span> ${a.label} <span class="tc-aspect__rule">${a.rule}</span></h3>
        <p class="tc-aspect__q"></p><p class="tc-aspect__why"></p></div><div class="tc-trio"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.tc-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.tc-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.tc-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'tc-col';
        col.setAttribute('data-tc-option', String(at + 1));
        col.innerHTML = `<p class="tc-label"><span class="tc-label__no">${at + 1}</span> <span class="tc-label__name"></span>${
            at === 0 ? ' <span class="tc-label__rec">Recommended</span>' : ''
        }</p><p class="tc-see"></p><p class="tc-verdict"></p>
        <div class="tc-scene" data-tc-kind="${a.kind}" data-tc-${a.id}="${o.key}" data-tc-phase="in">${a.scene()}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.tc-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.tc-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.tc-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('tc-verdict--rec', at === 0);
        trio.append(col);
    });
    rows.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#tc-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});

// The durations row says its own numbers under each part.
const BANDS = { bands: [60, 240, 1800], fast: [40, 160, 1200], slow: [120, 400, 2600] };
for (const scene of section.querySelectorAll('[data-tc-durations]')) {
    const [contact, cut, loop] = BANDS[/** @type {keyof typeof BANDS} */ (scene.getAttribute('data-tc-durations'))];
    const say = (/** @type {string} */ id, /** @type {string} */ text) => {
        const p = scene.querySelector(`[data-tc-readout="${id}"]`);
        if (p) p.textContent = text;
    };
    say('contact', `${contact} ms`);
    say('cut', `${cut} ms`);
    say('loop', `${loop} ms a pass`);
}

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses or updates is replayed by one
// clock, so the options of a row always start together and can be compared.
// One cycle: `gap` (what arrives is away), `in` (it arrives, a press lands,
// a value updates), `hold` (it stands), `out` (it leaves). The CSS keys
// every motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-tc-motion]');
let slow = 1;
let paused = false;
const PHASES = /** @type {const} */ ([
    ['gap', 450],
    ['in', 650],
    ['hold', 1500],
    ['out', 750],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of section.querySelectorAll('.tc-scene[data-tc-kind="cycle"]')) scene.setAttribute('data-tc-phase', phase);
    if (phase === 'in') {
        tick += 1;
        for (const num of section.querySelectorAll('[data-tc-num]')) {
            const text = num.textContent || '';
            if (/bar/.test(text)) num.textContent = tick % 2 ? '4.4 bar' : '4.2 bar';
            else if (/^\d+$/.test(text.trim()) && text.trim().length <= 3 && Number(text) > 99) num.textContent = values[tick % values.length];
            else if (/^\d+$/.test(text.trim())) num.textContent = String(30 + ((tick * 7) % 20));
        }
        for (const word of section.querySelectorAll('[data-tc-word]')) word.textContent = tick % 2 ? 'Draining' : 'Running';
    }
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    if (paused || dialogPaused()) {
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
radio('data-tc-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--tc-slow', String(slow));
    run(0);
});
radio('data-tc-state', (value) => {
    section.setAttribute('data-tc-show', value);
});
document.querySelector('[data-tc-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.tc-scene a, .tc-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided titanium components as they are today: each character demo
// embedded by the review kit (`?embed=shape&theme=titanium`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-tc-gallery]'));
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
