// Deco's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Deco is Paris 1925 and the skyscraper
// lobby, "The Gilded Ascent": flat gold on blue-black (never a gradient:
// "gold as a gradient reads as a casino"), emerald and ruby as jewels,
// Poiret One capitals tracked wide, double rules, chevrons, lozenges,
// setbacks, radius 0 and corners cut. Its register already has the fan of
// rays on every hovered button and the sun rising on the dialog, the fluted
// pennant progress bar with its emerald lozenge, the lobby's lift lamps on
// the meter, the cartouche on the headline; its picks are gilt frames,
// marquee bulbs, sunbursts, setbacks, curtains and glints. Each candidate
// is one thing the lobby does: the fan opens, the lift ascends, the
// setbacks rise, the curtain rises, the jewel is set, the glint runs, the
// bulbs chase.
//
// The other themes' anchors steered clear of: solstice's sun on its arc
// (deco's fan is a crest of rays from a point, it never travels and never
// sets), synthwave's striped conic sun (no stripes, no horizon, no bloom),
// retro's marquee (deco's bulbs are the runner-up, not the recommendation),
// sepia's and formal's double rules (a double rule is deco's frame, never
// its motion), nostromo's lamps on switches (the lift's lamps are a column
// that counts).
//
// Implementation notes for options.css: see the comment above each
// candidate. Gold is `--primary` flat; rays are `repeating-conic-gradient`
// from a point (the register's `--kp-sig-deco-rays`); nothing glows except
// the lamps' `drop-shadow`; the curve is the register's `--fx-ease` except
// where a hard step is named.

export const THEME = 'deco';
export const LABEL = 'Art Deco';
/** One unit of the clock, ms: deco's register beat is 160 ms; its sunrise takes 1120. */
export const UNIT = 120;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A gilt plaque: lacquer ground, a double gold rule, a Poiret title in capitals, a line. */
const plaque = (cls = '', inner = '') =>
    `<div class="dc-plaque ${cls}"><p class="dc-plaque__title">Pump House Three</p><p class="dc-plaque__line">Flow 1 284 l/min · pressure steady</p>${inner}</div>`;

/** Deco's own progress bar: a 3 px double track, a fluted gold pennant fill ending in a chevron, an emerald lozenge at its head. */
const bar = (cls, extra = '') =>
    `<div class="dc-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="dc-bar__track">${a('clip', 'dc-bar__fill')}<span class="dc-bar__head an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is Art Deco’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how deco loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, synthwave its horizon. Each candidate below is only what deco’s world already owns (the lobby, its gilt, its lift, its marquee), and each is told apart from the other themes’ anchors, solstice’s sun and synthwave’s first of all.';
export const LOOK =
    'Seven candidates for deco’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is deco to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: a crest of gold rays (`.dc-f-fan`, `repeating-conic-gradient(from
    // -90deg at 50% 100%, gold 0 4deg, transparent 4deg 15deg)` masked to a
    // half-ellipse, 7rem × 3.5rem, the dialog's crest) stands above the
    // plaque's title; it opens from its base point: `scale(0.15, 0.4)` →
    // 1 with opacity 0 → 1 over 5 u on `--fx-ease` (the register's
    // `kp-sig-deco-deco-fan`), ray by ray if possible (a conic mask whose
    // angle sweeps -90 → 90deg, so the rays appear from the start side to
    // the end side, 5 u linear), then the plaque's double rule is drawn under
    // the title 5–7 u. Out: the fan folds back. Bar: the head is a small fan
    // (1.2rem) that opens at the pennant's tip when the fill lands (6–7 u),
    // the fill clipping in 0–6 u. Button: press at 7 u = the register's fan
    // (rays from the lower-left corner, `.kp-button::before`) opens behind the
    // label in the last unit (opacity 0 → 1 with a conic mask sweep), face
    // `--secondary-active`.
    {
        key: 'fan',
        name: 'The fan opens',
        see: 'A crest of gold rays stands above the plaque’s title, folded to a point. It opens ray by ray from one side to the other, the sunburst of the Chrysler Building, and when it is open the double rule is drawn under the title. Held, then it folds back. As a progress bar, a small fan opens at the pennant’s tip when the fill lands. As a button press, the fan deco’s buttons already carry opens behind the label from its corner.',
        follows:
            'Every plate opens as a fan from its base point and folds to close (the dialog already rises so, the drawer unfolds so, the calendar’s panels open so); loading is a fan opening and folding (the chart’s, the key figure’s pick); a live update is one flash of the fan behind the changed figure; hover opens the fan a little, the press all the way; the leave folds it.',
        why: 'it is the one idea that is in the register twice already (the fan on every hovered button, the sun rising on the dialog) and in nine of Kenny’s picks, so it unites what the theme already does, it is the motif of the style itself, and it is told from the suns next door by what it is: a crest of rays from a point that opens and folds, never a disc that travels or sets (solstice) and never stripes on a horizon (synthwave).',
        caps: [
            'In its own scene: the crest opens ray by ray, the rule is drawn',
            'As a progress bar: a fan opens at the tip',
            'As a button press: the fan opens behind the label',
        ],
        hero: `<div class="an-hero dc-f-hero" role="img" aria-label="A crest of gold rays above a plaque opens ray by ray from a point, then a double rule is drawn under the title">${plaque('dc-f-plaque', `${a('', 'dc-f-fan')}${a('scale', 'dc-f-rule')}`)}</div>`,
        bar: `<div class="an-bar">${bar('dc-f-bar', a('', 'dc-f-bar__fan'))}</div>`,
        button: `<div class="an-btn"><span class="dc-f-btn">${button('Call the lift', 'an-press dc-f-press')}</span></div>`,
    },
    // CSS: a column of eight lift lamps (`.dc-l-lamps i`, 3px gold at 22 %
    // dots with a 1px gold outline, the meter's lamps turned vertical, 0.9rem
    // apart) stands at the plaque's start edge with a gold arrow (▲) above it;
    // the lamps light one a step from the foot up (`steps(1)`, 0.75 u each,
    // 0–6 u, lit = gold with a 4px gold drop-shadow glow, the register's), the
    // arrow lights at 6 u, and the plaque's title takes the gold at 7 u (the
    // floor reached); out: the lamps go out from the top down. Bar: the
    // register's meter row of lamps lighting one a step along the track (the
    // fill in `steps(16)`), the lozenge at the head. Button: press at 7 u = a
    // lamp beside the label lights (one step) and the face takes gold at 8 %.
    {
        key: 'lift',
        name: 'The lift ascends',
        see: 'The lobby’s floor indicator stands beside the plaque: a column of lamps and an arrow. The lamps light one by one from the foot up, each in one step, the arrow lights at the top, and the plaque’s title takes the gold: the floor is reached. Held, then the lamps go out from the top down. As a progress bar, the lamps along the track light one a step, as deco’s meter already does. As a button press, a lamp beside the label lights.',
        follows:
            'Everything counts in lamps lit one a step: loading is the indicator climbing and falling (the meter and the busy table already light so), an arrival is the floor reached (the plaque lit when the last lamp is), a live update is the changed figure’s lamp relit, hover is one lamp, the press holds it lit, the leave is the lamps going out from the top.',
        why: 'it is the lobby in one object (the ascent the theme is named for), it is already the meter in the register and it counts in hard steps no gold gradient could fake; but a lift indicator is a vertical column, so a plate, a chart or a menu must carry it beside them instead of being it, and lamps lit one a step are the marquee bulbs of retro and synthwave a storey higher.',
        caps: [
            'In its own scene: the lamps light from the foot, the floor is reached',
            'As a progress bar: the lamps light one a step',
            'As a button press: a lamp lights beside the label',
        ],
        hero: `<div class="an-hero dc-l-hero" role="img" aria-label="A column of lift lamps beside a plaque lights one by one from the foot up; the arrow lights and the title takes the gold"><div class="dc-l-stage"><span class="dc-l-lamps" aria-hidden="true"><b class="dc-l-arrow an-a">▲</b><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i></span>${plaque('dc-l-plaque an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('dc-l-bar')}</div>`,
        button: `<div class="an-btn"><span class="dc-l-btn">${button('Call the lift', 'an-press dc-l-press', a('', 'dc-l-press__lamp'))}</span></div>`,
    },
    // CSS: a skyline of setbacks (`.dc-s-tiers i`, five tiers of 1px gold
    // lines, each narrower than the one below, a ziggurat) rises behind the
    // plaque's title tier by tier from the foot (each tier's clip-path inset
    // 100% → 0 from the bottom in one step, `steps(1)`, 1 u apart, 1–6 u),
    // the top tier last; the title then rises 0.4em into its line (clip at the
    // line, `--fx-ease`, 6–7 u). Out: the tiers taken down from the top.
    // Bar: the fill rises in tiers: its top edge is stepped (a stepped
    // clip-path) and the pennant fills in 5 steps. Button: press at 7 u = the
    // button's frame steps (the stepped ziggurat notch of the tooltip is cut
    // into its two top corners, clip-path in one step), face gold at 8 %.
    {
        key: 'setbacks',
        name: 'The setbacks rise',
        see: 'A skyscraper rises behind the plaque’s title: tier by tier from the foot, each tier narrower than the one below, five gold lines of setback in hard steps, and the title rises into its line when the tower is up. Held, then the tiers are taken down from the top. As a progress bar, the fill rises in tiers with a stepped top edge. As a button press, the button’s top corners are cut in steps.',
        follows:
            'Everything is built upward in tiers (the trend, the tiles, the chart’s skyline, the graph’s ziggurat: all picked): an arrival rises tier by tier, loading is a tower climbing and falling, a live update is the top tier relit, hover a tier, the press the stepped cut, the leave the tiers taken down.',
        why: 'it is the geometry that is only deco’s (the setback skyscraper, the stepped notch the tooltip already carries) and it counts in hard steps; but a tower is tall and thin, so it stands behind a figure well and behind a wide plate or a bar poorly, and tiers that rise from a foot are forest’s growth and solstice’s rising light in gold.',
        caps: [
            'In its own scene: the tiers rise, the title rises into its line',
            'As a progress bar: a stepped top edge rises',
            'As a button press: the corners cut in steps',
        ],
        hero: `<div class="an-hero dc-s-hero" role="img" aria-label="Five gold setback tiers rise behind a plaque's title one after another, a skyscraper">${plaque('dc-s-plaque', '<span class="dc-s-tiers" aria-hidden="true"><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i></span>')}</div>`,
        bar: `<div class="an-bar">${bar('dc-s-bar')}</div>`,
        button: `<div class="an-btn"><span class="dc-s-btn">${button('Call the lift', 'an-press dc-s-press')}</span></div>`,
    },
    // CSS: a lacquer curtain (`.dc-c-curtain`, blue-black `--popover` with
    // vertical gold pleats: repeating-linear-gradient(90deg, gold 0 1px,
    // transparent 1px 1rem) at 35 %, a gold double rule at its hem) hangs over
    // the plaque and rises: translate 0 → -102% over 6 u on
    // cubic-bezier(0.6, 0, 0.2, 1) (the meter's gilt sweep), clipped at the
    // plaque's top; the plaque's title rises 0.3em into its line as the hem
    // passes it. Out: the curtain falls. Bar: the fill is revealed as a
    // curtain lifts along the track (the fill's clip from the top, segment
    // by segment? No: a curtain-shaped clip rising along the pennant, 7 u).
    // Button: press at 7 u = the curtain drops over the face a third of the
    // way (a pleated band from the top, translate -100% → 0 of its 35 %
    // height) and the face darkens.
    {
        key: 'curtain',
        name: 'The curtain rises',
        see: 'A lacquer curtain with gold pleats and a double-rule hem hangs over the plaque. It rises from its hem, slowing as it clears the top, and the plaque’s title rises into its line as the hem passes it: the show begins. Held, then the curtain falls. As a progress bar, the fill is revealed as a curtain lifts along the track. As a button press, a pleated band drops over the top of the face.',
        follows:
            'Every plate arrives by a curtain rising and leaves by its fall (the trend, the busy table, the graph and the header already rise so); loading is a curtain that will not quite rise; a live update is the changed figure’s curtain lifted and dropped; hover lifts the hem, the press drops the band.',
        why: 'it is the theatre of the style (the picture house, the ball) and Kenny picked “curtain rises” four times, and a pleated lacquer curtain is nobody else’s; but it is a reveal that needs a top edge to rise to, so a figure, a dot or a bar can only borrow it, and a plate rising from its foot into place is solstice’s and forest’s arrival with gold pleats on it.',
        caps: [
            'In its own scene: the curtain rises, the title rises into its line',
            'As a progress bar: revealed as the curtain lifts',
            'As a button press: a pleated band drops over the face',
        ],
        hero: `<div class="an-hero dc-c-hero" role="img" aria-label="A pleated lacquer curtain with a gold hem rises off a plaque"><div class="dc-c-stage">${plaque('dc-c-plaque')}${a('move', 'dc-c-curtain')}</div></div>`,
        bar: `<div class="an-bar">${bar('dc-c-bar', a('', 'dc-c-bar__curtain'))}</div>`,
        button: `<div class="an-btn"><span class="dc-c-btn">${button('Call the lift', 'an-press dc-c-press', a('move', 'dc-c-press__band'))}</span></div>`,
    },
    // CSS: an emerald lozenge (`.dc-j-jewel`, a rotated square 1.4rem,
    // `--accent` with a 1px gold ring and a 2px gold outer ring, the bar's
    // head) is set into the plaque's crest: it comes down from above
    // (translate 0 -2rem → 0) while turning a quarter (rotate -90 → 0deg,
    // the radio's grow) over 5 u on `--fx-ease`, and its gold setting (a
    // double ring, `.dc-j-setting`) closes round it 5–7 u (scale 1.3 → 1,
    // opacity 0 → 1). Out: the setting opens, the jewel lifts turning back.
    // Bar: the register's head lozenge drops into place at the fill's end
    // when the fill lands (6–7 u). Button: press at 7 u = a lozenge is set
    // beside the label in the last unit (scale 1.6 rotate -90 → 1, 0),
    // face `--secondary-active`.
    {
        key: 'jewel',
        name: 'The jewel is set',
        see: 'An emerald lozenge comes down to the plaque’s crest, turning a quarter as it comes, and its gold setting closes round it: a jewel set in gilt. Held, then the setting opens and the jewel lifts, turning back. As a progress bar, the emerald lozenge at the head drops into place as the fill lands, as deco’s bar already has it. As a button press, a lozenge is set beside the label.',
        follows:
            'What is done, current or chosen carries its jewel (the bar’s head, the radio’s diamond, the switch’s thumb, the wizard’s steps, the divider’s lozenge are all already lozenges); an arrival ends with its jewel set, a live update re-sets it, loading is a setting with no jewel in it yet, hover shows the setting, the press sets the jewel, the leave lifts it.',
        why: 'it is deco’s one jewel (the emerald lozenge is on the bar, the radio, the switch, the divider, the wizard, the cabochon events) and a stone set turning into gilt is nobody else’s; but a jewel is a mark set after a thing is done, so a plate, a chart or a loading surface needs a second idea, and sepia’s dinkus is three diamonds set in a row next door.',
        caps: [
            'In its own scene: the lozenge comes down turning, the setting closes',
            'As a progress bar: the head jewel drops into place',
            'As a button press: a lozenge set beside the label',
        ],
        hero: `<div class="an-hero dc-j-hero" role="img" aria-label="An emerald lozenge comes down turning into the gold setting on a plaque's crest">${plaque('dc-j-plaque', `<span class="dc-j-crest" aria-hidden="true">${a('', 'dc-j-setting')}${a('', 'dc-j-jewel')}</span>`)}</div>`,
        bar: `<div class="an-bar">${bar('dc-j-bar')}</div>`,
        button: `<div class="an-btn"><span class="dc-j-btn">${button('Call the lift', 'an-press dc-j-press', '', a('', 'dc-j-mark'))}</span></div>`,
    },
    // CSS: a glint (`.dc-g-glint`, a 2px band of ivory at 70 % with a 6px
    // gold halo, 20deg off vertical) runs along the plaque's double gold rule
    // from the start to the end over 6 u on `--fx-ease`, and the rule it has
    // passed goes from quiet gold (`--border-strong`) to full gold (clip
    // block in step with it); the title's gold brightens at 7 u. Out: the
    // glint runs back. Bar: the glint runs the pennant as the fill lands
    // (the fill 0–6 u, the glint 5–7 u). Button: press at 7 u = the glint
    // runs across the button's gold edge in the last unit.
    {
        key: 'glint',
        name: 'The glint runs the gilt',
        see: 'The plaque’s double rule is quiet gold. A glint of light runs along it from the start, the way gilt catches a lamp as you pass, and the rule it has passed stands full gold; the title brightens as the glint reaches the end. Held, then the glint runs back and the gold goes quiet. As a progress bar, the glint runs the pennant as the fill lands. As a button press, the glint runs across the button’s gold edge.',
        follows:
            'Gold is gilded by a glint: loading is a glint running and running along the waiting part (the calendar, the strip, the menu already load so), an arrival is the part gilded by its first glint, a live update is one glint over the changed figure (the trend and the key figure’s “Gilded”), hover is a glint at the control’s start, the press one across, the leave the gold going quiet.',
        why: 'it is the loading picture Kenny picked for four components and the live update for two, so the theme would wait and update with one light; but a bright band running along a surface is the shimmer of every skeleton since 2015 and the loading of half the finished set (titanium’s cutter, synthwave’s chase, dark’s scan), so it tells deco apart by its gold only.',
        caps: [
            'In its own scene: the glint runs the rule, the gold brightens',
            'As a progress bar: the glint runs the pennant',
            'As a button press: the glint across the edge',
        ],
        hero: `<div class="an-hero dc-g-hero" role="img" aria-label="A glint of light runs along a plaque's double gold rule and the gold brightens behind it">${plaque('dc-g-plaque', `${a('clip', 'dc-g-rule')}${a('move', 'dc-g-glint')}`)}</div>`,
        bar: `<div class="an-bar">${bar('dc-g-bar', a('move', 'dc-g-bar__glint'))}</div>`,
        button: `<div class="an-btn"><span class="dc-g-btn">${button('Call the lift', 'an-press dc-g-press', '', a('move', 'dc-g-press__glint'))}</span></div>`,
    },
    // CSS: a row of marquee bulbs (`.dc-m-bulbs i`, 12 bulbs, 0.4rem gold
    // discs at 22 %) runs along the plaque's top edge; the bulbs chase: lit
    // in turn in hard steps (`steps(1)`, 0.5 u each, 0–6 u, each lit = gold
    // with a 4px glow, the previous staying lit), until all are lit at 6 u
    // and the plaque's title goes gold at 7 u; out: the bulbs go out in
    // reverse. Bar: the pennant fills in 12 hard steps (`steps(12)`) and a
    // bulb lights at the head each step. Button: press at 7 u = the button's
    // frame lights as a row of bulbs (a dotted gold outline) in one step,
    // held lit.
    {
        key: 'bulbs',
        name: 'The marquee bulbs chase',
        see: 'A row of bulbs runs along the plaque’s top edge, dark. They light in turn from the start in hard steps, each one staying lit, a marquee being switched on, until the whole row is lit and the title takes the gold. Held, then they go out in reverse. As a progress bar, the pennant fills in twelve steps and a bulb lights at each. As a button press, the button’s frame lights as a row of bulbs.',
        follows:
            'Everything is lit in bulbs: loading is the bulbs chasing round and round (the tiles’ and the busy table’s pick), an arrival is the row switched on, a live update is the bulbs chasing once over the changed figure, hover lights the bulbs steady, the press holds them, the leave switches the row off.',
        why: 'it is the picture Kenny picked most often for deco after the gilt frame (the graph, the tiles, the busy table, the menu, the state word) and bulbs in hard steps keep the flat gold; but a marquee of chasing bulbs is retro’s and synthwave’s device already, and it is the loudest of the seven on a theme whose gold is meant to be flat and still.',
        caps: [
            'In its own scene: the bulbs light in turn, the title takes the gold',
            'As a progress bar: a bulb per step',
            'As a button press: the frame lit as bulbs',
        ],
        hero: `<div class="an-hero dc-m-hero" role="img" aria-label="A row of marquee bulbs along a plaque's top edge lights in turn in hard steps">${plaque('dc-m-plaque', `<span class="dc-m-bulbs" aria-hidden="true">${'<i class="an-a"></i>'.repeat(12)}</span>`)}</div>`,
        bar: `<div class="an-bar">${bar('dc-m-bar', a('', 'dc-m-bar__bulb'))}</div>`,
        button: `<div class="an-btn"><span class="dc-m-btn">${button('Call the lift', 'an-press dc-m-press')}</span></div>`,
    },
];
