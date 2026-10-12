// Light's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Light is "Plain Sight": pure white,
// near-black ink, one indigo that acts, and a cyan that is light itself
// (`--fx-signal`, a fill and never a word). Restraint is its decision; its
// one drawn ornament is the seam with its circle (the divider, the empty
// state), its head is a white-ringed cyan bead, and it leaves in a glare.
// Each candidate is one thing light does to a surface: a bead of light runs
// it, a window opens in it, a highlighter reads it, daylight crosses it, it
// overexposes, a ring of light settles on it, its shadow lifts.
//
// The other themes' anchors steered clear of: solstice's sun on its arc and
// its light rising from the foot (light's bead runs the seam, it is not a
// sun and never rises), synthwave's horizon tube (no tube, no bloom), deco's
// glint along gilt, forest's growth, grotesk's line drawn under type (the
// seam is a hairline the bead lights, never a rule under words).
//
// Implementation notes for options.css (per candidate, "u" = one unit of
// the clock, 8 u is the drawing): see the comment above each candidate.

export const THEME = 'light';
export const LABEL = 'Light';
/** One unit of the clock, ms: light's register beat is 150 ms; its settle curve is `--kp-ease-arrive` (0.16, 1, 0.3, 1). */
export const UNIT = 100;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A soft white card with a title line and two text lines, light's plate. */
const card = (cls = '', inner = '') =>
    `<div class="lt-card ${cls}"><p class="lt-card__title">Pump house 3</p><p class="lt-card__line">Flow 1 284 l/min · pressure steady</p><p class="lt-card__line lt-card__line--short">Checked at 09:40</p>${inner}</div>`;

/** Light's own progress bar: a 2 px hairline, a 4 px indigo line clipped to the value, a white-ringed cyan bead at its head. */
const bar = (cls, extra = '') =>
    `<div class="lt-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="lt-bar__track">${a('clip', 'lt-bar__fill')}${extra}</span></div>`;

export const QUESTION = 'Which one element is light’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how light loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, synthwave its horizon. Each candidate below is only what light’s world already owns (white, ink, indigo, and light itself), and each is told apart from the other themes’ anchors.';
export const LOOK =
    'Seven candidates for light’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is light to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the bead `.lt-b-bead` (0.75rem cyan disc, inset 0 0 0 2px white
    // ring, a 1px indigo outer ring) runs the seam from start to end over
    // 7 u on `--kp-ease-arrive`; the seam `.lt-b-seam` (1px --border hairline)
    // is lit indigo behind it (a second 2px indigo line `.lt-b-lit`, scale
    // block, same 7 u and curve, so it ends exactly under the bead); in the
    // last unit the bead settles as the divider's open circle (its fill goes
    // white, the indigo ring stays: `lt-b-settle` keyframes 87.5 → 100 %).
    // Bar: the register's bar (fill clip 7 u, the bead at the head via
    // inset-inline-start keyframes like formal's nib). Button: press at 7 u =
    // the pill settles 2px down and its shadow tightens (the register's
    // hover) while a cyan bead lands on the pill's end edge (`.lt-b-dot`,
    // scale 0 → 1 in the last unit).
    {
        key: 'bead',
        name: 'The bead of light runs the seam',
        see: 'A card with a hairline seam under its title. A bead of cyan light, ringed in white, sets off along the seam from the start, surges and settles the way light’s own curve does, and the seam it has passed is lit indigo behind it; at the end it comes to rest as the open circle every light divider carries. Held, then it runs back and the seam goes grey again. As a progress bar, it is the bar light already has: the indigo line with the bead at its head. As a button press, the pill settles toward the paper and a bead of light lands on its end.',
        follows:
            'Loading is the bead running the seam until the reading is there (the busy bar’s three beads begin to move); an arrival is lit by a bead passing over it; a live update is the bead passing the changed figure once; hover is the bead resting at the control’s end; a press lands it; focus is the ring it leaves; the leave is the bead gone and the seam grey. Every component that has a seam (divider, empty state, calendar’s today, wizard steps) is already waiting for it.',
        why: 'it is the one drawn thing light already owns three times over (the bead head of the progress bar, the beads of the spinner, the circle on the seam of every divider), it makes the theme’s only ornament move without adding one, it gives loading, arrival, hover, press, focus, live and leave from one object, and no finished theme has it: solstice’s sun rises on an arc and sets, synthwave’s light is a tube, deco’s glint runs along gilt; light’s bead is a dot of light on a hairline, and it never rises.',
        caps: [
            'In its own scene: the bead runs the seam, lights it, rests',
            'As a progress bar: the line with the bead at its head',
            'As a button press: the pill settles, a bead lands on its end',
        ],
        hero: `<div class="an-hero lt-b-hero" role="img" aria-label="A card with a hairline seam; a cyan bead runs the seam and the seam is lit indigo behind it">${card('lt-b-card', `<span class="lt-b-seam" aria-hidden="true">${a('scale', 'lt-b-lit')}<span class="lt-b-bead an-a"></span></span>`)}</div>`,
        bar: `<div class="an-bar">${bar('lt-b-bar', '<span class="lt-b-bar__bead an-a" aria-hidden="true"></span>')}</div>`,
        button: `<div class="an-btn"><span class="lt-b-btn">${button('Check the pumps', 'an-press lt-b-press', '', a('', 'lt-b-dot'))}</span></div>`,
    },
    // CSS: the card's clip-path opens from a rounded slit at its centre,
    // `inset(42% 34% round 999px)` → `inset(0 round 0.5rem)`, 7 u on
    // `--kp-ease-arrive`, with opacity 0 → 1 in the first 2 u (the register's
    // `kp-sig-light-light-window`). Bar: the fill's clip opens from its centre
    // outward (`inset(0 50% round 999px)` → `inset(0 round 999px)`, 7 u).
    // Button: press at 7 u = a white slit (`.lt-w-slit`, 2px tall, white at 85 %)
    // opens across the pill's middle from a point to full width in the last
    // unit, over the settled face.
    {
        key: 'window',
        name: 'A window opens',
        see: 'A card is not faded in: a small rounded slit of it opens at the centre and widens to the whole card, the way light’s dialog and toast already arrive. Held, then the window closes to the slit and is gone. As a progress bar, the indigo line opens from its middle outward to the value. As a button press, a thin slit of white light opens across the pill’s middle as the press lands.',
        follows:
            'Every plate opens as a window from its centre (dialog, toast, menu, drawer, tile); it closes the same way; loading is a window not yet open (the slit); a live update is the figure’s window opening again; hover is the slit; the press widens it. The headline already opens so.',
        why: 'it is already light’s way of opening a dialog, a toast and the headline, so it is proven, and it is a clip and not a fade; but it is an opening, not an object: it gives arrival and leave and little else (a hover or a live update as a slit is thin), and a rounded slit widening is close to how deco’s toast opens from its centre line.',
        caps: [
            'In its own scene: the card opens from a slit',
            'As a progress bar: the line opens from its middle',
            'As a button press: a slit of light across the pill',
        ],
        hero: `<div class="an-hero lt-w-hero" role="img" aria-label="A card opens from a small rounded slit at its centre to its full size">${card('lt-w-card an-a')}</div>`,
        bar: `<div class="an-bar">${bar('lt-w-bar')}</div>`,
        button: `<div class="an-btn"><span class="lt-w-btn">${button('Check the pumps', 'an-press lt-w-press', '', a('scale', 'lt-w-slit'))}</span></div>`,
    },
    // CSS: a pale-cyan highlighter (`--accent`, 0.25em radius, box-decoration
    // clone) sweeps behind each text line from the start, `background-size`
    // 0 → 100 % (the register's mark sweep), title 0–3 u, lines 2–5 and 4–7 u,
    // on `--kp-ease-arrive`; the read line's ink goes full ink from muted.
    // Bar: the track is highlighted cyan behind the indigo line as the line
    // comes (two clips, the highlight 1 u ahead). Button: press at 7 u = the
    // highlighter sweeps across the pill's face (a cyan wash, scale block,
    // last unit) under the label.
    {
        key: 'highlighter',
        name: 'The highlighter reads it',
        see: 'Three lines of a card in muted ink. A pale-cyan highlighter is drawn behind them from the start, one line a beat after the other, and the words it has passed turn full ink: the page is being read. Held, then the highlighter is lifted off, last line first. As a progress bar, the track is highlighted cyan just ahead of the indigo line. As a button press, the highlighter sweeps across the pill under the label.',
        follows:
            'What arrives is read (highlighted from the start, then full ink); a live update is the changed figure highlighted again; loading is a highlighter sweeping a line not yet written; hover is the wash light’s links already take; the press sweeps it; the leave lifts it. Marks, links and the graph’s pick already carry it.',
        why: 'it is light’s own gesture on text (the mark sweeps in cyan, a hovered link takes the wash, the graph’s pick is the highlighter), and reading is what a white page is for; but a wash sweeping behind words is close to pastel’s mark and to the daylight band, it is strongest on text and weak on a plate or a chart, and its colour is a tint where the bead is a point of light.',
        caps: [
            'In its own scene: the lines highlighted as they are read',
            'As a progress bar: the track highlighted ahead of the line',
            'As a button press: the highlighter sweeps the pill',
        ],
        hero: `<div class="an-hero lt-h-hero" role="img" aria-label="Three lines of text; a pale cyan highlighter sweeps behind them one after the other and they turn full ink"><div class="lt-card lt-h-card"><p class="lt-card__title"><span class="lt-h-mark an-a">Pump house 3</span></p><p class="lt-card__line"><span class="lt-h-mark an-a">Flow 1 284 l/min · pressure steady</span></p><p class="lt-card__line"><span class="lt-h-mark an-a">Checked at 09:40</span></p></div></div>`,
        bar: `<div class="an-bar">${bar('lt-h-bar', a('clip', 'lt-h-bar__wash'))}</div>`,
        button: `<div class="an-btn"><span class="lt-h-btn">${button('Check the pumps', 'an-press lt-h-press', a('scale', 'lt-h-wash'))}</span></div>`,
    },
    // CSS: a band of daylight (`.lt-d-band`, a 35 %-wide soft cyan wash,
    // `linear-gradient(90deg, transparent, accent 60 %, transparent)`) crosses
    // the card from before its start to past its end over 7 u, ease-in-out
    // (the meter's `kp-sig-light-meter-day`), and the card's border brightens
    // behind it (border --border → --fx-signal at 30 %, last unit). Bar: the
    // band crosses the track and the indigo line is left behind it (clip
    // 7 u, same curve). Button: press at 7 u = the band crosses the pill in
    // the last unit (move block, --an-d 7, --an-l 1).
    {
        key: 'daylight',
        name: 'Daylight crosses it',
        see: 'A card lies in grey. A soft band of daylight comes over it from the start, crosses it at an unhurried pace and goes, and the card is left brighter than it was, its edge lit. Held, then the daylight crosses back. As a progress bar, the band crosses the track and the indigo line is what it leaves behind. As a button press, the band crosses the pill as the press lands.',
        follows:
            'Loading is daylight crossing a surface again and again (the meter, the columns, the key figure and the calendar already do this); an arrival is lit by its first crossing; a live update is one more crossing of the changed figure; hover is the surface a touch brighter; the press is the band; the leave is the light going.',
        why: 'it is the loading picture Kenny already picked for the meter, the strip, the key figure and the calendar, so the theme would speak with one voice; but a band of light drifting across a surface is titanium’s bath, deco’s glint and the shimmer every skeleton has had since 2015, and it only says waiting: on a press or a hover it is a flash.',
        caps: [
            'In its own scene: daylight crosses the card',
            'As a progress bar: the line left behind the band',
            'As a button press: the band crosses the pill',
        ],
        hero: `<div class="an-hero lt-d-hero" role="img" aria-label="A card; a soft band of daylight crosses it from start to end and leaves it brighter">${card('lt-d-card', a('move', 'lt-d-band'))}</div>`,
        bar: `<div class="an-bar">${bar('lt-d-bar', a('move', 'lt-d-bar__band'))}</div>`,
        button: `<div class="an-btn"><span class="lt-d-btn">${button('Check the pumps', 'an-press lt-d-press', a('move', 'lt-d-press__band'))}</span></div>`,
    },
    // CSS: the card blooms out of a glare: filter blur(4px) brightness(1.4),
    // opacity 0, translate 0 -8px → none over 6 u on `--kp-ease-arrive` (the
    // register's `kp-sig-light-size-bloom` and the leave reversed); the hold
    // is crisp. Bar: the fill blooms from the glare (brightness 1.6, blur 3px
    // → none) while it clips in. Button: press at 7 u = the face overexposes
    // (brightness 1.25, a white inner glow) and settles to the pressed face in
    // the hold.
    {
        key: 'glare',
        name: 'Overexposed: out of the glare',
        see: 'The card is there as a glare first, blurred and too bright, and comes down into focus and into its own white; it never fades up from grey. Held, then it goes back into the glare and is gone, the way everything in light already leaves. As a progress bar, the indigo line comes out of the glare as it fills. As a button press, the face overexposes for a beat and settles.',
        follows:
            'Every arrival blooms out of the glare and every leave goes into it (the register already says so); loading is a surface still in the glare; a live update is the changed figure overexposed for a beat; hover is a touch brighter; the press is the flash. One picture, both directions.',
        why: 'it is what light already does on every leave and every arriving line, it is light in the literal sense and no other theme overexposes; but it is a filter, not an object: it cannot be seen in a still, it blurs text (the one thing the anatomy forbids), and on a hover or a press a brightness flash is the same as a fade.',
        caps: [
            'In its own scene: the card comes out of the glare',
            'As a progress bar: the line out of the glare',
            'As a button press: the face overexposes, settles',
        ],
        hero: `<div class="an-hero lt-g-hero" role="img" aria-label="A card comes out of a bright blur into focus">${card('lt-g-card an-a')}</div>`,
        bar: `<div class="an-bar">${bar('lt-g-bar')}</div>`,
        button: `<div class="an-btn"><span class="lt-g-btn">${button('Check the pumps', 'an-press lt-g-press')}</span></div>`,
    },
    // CSS: a cyan ring (`.lt-r-ring`, 2px --fx-signal, 999px/0.5rem radius)
    // blooms from the card's centre (scale 0.6, opacity 0) to 6px outside its
    // edge (scale 1.04, opacity 1) over 5 u on `--kp-ease-arrive`, then
    // tightens onto the edge (scale 1, 5–7 u) and stays: the card is ringed
    // in light. Bar: the head is a ring of light round the bead's place.
    // Button: press at 7 u = the ring blooms from the pill and tightens onto
    // it (box-shadow 0 0 0 6px signal/0 → 0 0 0 2px signal) in the last unit.
    {
        key: 'ring',
        name: 'A ring of light settles on it',
        see: 'A ring of cyan light blooms up out of the card’s centre, a little wider than the card, and tightens onto its edge, where it stays: the card is ringed in light. Held, then the ring loosens and goes back into the centre. As a progress bar, the head is a ring of light that opens and settles where the line ends. As a button press, the ring blooms out of the pill and tightens onto it.',
        follows:
            'Today in the calendar, the picked day, the focused control, the changed figure, the hovered tile: each is ringed in light (several picks already say “ring of light on hover”, “today wears a ring of sunlight”); an arrival is ringed once; loading is a ring not yet settled; the leave is the ring loosening.',
        why: 'light’s picks keep asking for it (a ring of sunlight for today, a ring of light on hover, the halo on focus) and a ring that settles onto its edge is not formal’s rim, which spreads out and fades; but a ring is a state, not a motion with a direction, so arrivals and loading have to borrow from elsewhere, and solstice’s halo is a double ring on a risen sun.',
        caps: [
            'In its own scene: a ring blooms and settles on the card',
            'As a progress bar: a ring of light at the head',
            'As a button press: the ring tightens onto the pill',
        ],
        hero: `<div class="an-hero lt-r-hero" role="img" aria-label="A ring of cyan light blooms from the centre of a card and settles on its edge">${card('lt-r-card', a('', 'lt-r-ring'))}</div>`,
        bar: `<div class="an-bar">${bar('lt-r-bar', a('', 'lt-r-bar__ring'))}</div>`,
        button: `<div class="an-btn"><span class="lt-r-btn">${button('Check the pumps', 'an-press lt-r-press')}</span></div>`,
    },
    // CSS: the card is lifted off the paper: translate 0 → -6px and shadow
    // `--kp-shadow-sm` → `--kp-shadow-lg` over 5 u on `--kp-ease-arrive`, then
    // held lifted; out = set back down. Bar: the line is lifted (a soft
    // shadow grows under the indigo line) as it fills. Button: press at 7 u =
    // the pill settles 2px down and its shadow tightens from `0 6px 14px` to
    // `0 2px 5px` (the register's hover, gap-4), held.
    {
        key: 'shadow',
        name: 'The shadow lifts',
        see: 'A flat card is lifted off the white paper: it rises a few pixels and its shadow grows soft and wide under it, so you see the paper under the card. Held, then it is set back down. As a progress bar, the indigo line gains a soft shadow as it fills. As a button press, the pill settles toward the paper and its shadow tightens, the way light’s buttons already do on hover.',
        follows:
            'Elevation is the only depth light has, so everything that matters is lifted (hovered tile, open menu, dragged row) and everything pressed settles; an arrival is set down on the paper; loading is a surface not yet lifted; a live update lifts the changed figure once; the leave is the card picked up.',
        why: 'it is already how light’s buttons answer a hover (they settle toward the paper, the reverse of lifting) and how seven of twelve picks say “soft card on a soft shadow”, so nothing new is asked; but a card lifting on a shadow is what every UI kit since Material has done, so it would make light the theme that looks like no theme, and it is exactly what Kenny said is rejected: a safe fade with a shadow.',
        caps: [
            'In its own scene: the card lifted off the paper',
            'As a progress bar: the line gains its shadow',
            'As a button press: the pill settles, its shadow tightens',
        ],
        hero: `<div class="an-hero lt-s-hero" role="img" aria-label="A card rises a few pixels off the white paper on a growing soft shadow">${card('lt-s-card an-a')}</div>`,
        bar: `<div class="an-bar">${bar('lt-s-bar')}</div>`,
        button: `<div class="an-btn"><span class="lt-s-btn">${button('Check the pumps', 'an-press lt-s-press')}</span></div>`,
    },
];
