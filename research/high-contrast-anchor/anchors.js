// High-contrast's candidates for its anchor element: the data demo.js
// builds the page from, and options.css draws. High-contrast is black on
// white, one signal yellow, nothing in between: the accessibility theme,
// where the vocabulary is line weight (2 px every control, 3 px structure,
// 4 px a dialog), where a state change is a switch and never a fade, where
// a leaving thing is announced on a yellow plate ("✕ REMOVED") the way a
// screen reader would say it, where a yellow square walks three framed cells
// while you wait. Each candidate is one thing a sign does: it says it, a
// marker walks to it, its frame thickens, a sign is put in its corner, it
// inverts, tape is run across it, it is placed cell by cell.
//
// RULES THAT BIND EVERY CANDIDATE (Kenny: contrast is the point of this
// theme and may never go down): no opacity between 0 and 1, no blur, no
// grey that is not --muted-foreground, no half-tone, no gradient; every
// change is a hard step (`steps()`, `step-end`) or a clip-path wipe; yellow
// is a plate with black ink and never text on the page ground; every part
// keeps a 2 px ink edge; every text keeps 21:1 at every frame.
//
// The other themes' anchors steered clear of: brutalism's hard slab and
// shadow (no shadow here, no slab), terminal's reverse video under the
// cursor (the inversion here is a whole plate flipped as a sign, and it is
// not the recommendation), cyberpunk's hazard stripes on a void.
//
// Implementation notes for options.css: see the comment above each
// candidate. Every keyframe pair is mirrored; a wipe is a clip-path inset
// on `steps(n)` or on `--kp-sig-hc-ease` (0.2, 0, 0, 1), never opacity.

export const THEME = 'high-contrast';
export const LABEL = 'High contrast';
/** One unit of the clock, ms: the register's beat is 120 ms; the walk dwells. */
export const UNIT = 120;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A sign board: a white plate in a 3 px ink frame with a bold title and a line. */
const board = (cls = '', inner = '') =>
    `<div class="hc-board ${cls}"><p class="hc-board__title">Pump house 3</p><p class="hc-board__line">Flow 1 284 l/min. Pressure steady.</p>${inner}</div>`;

/** A yellow plate with a 3 px ink frame and bold spaced capitals: the sign that says it. */
const plate = (text, cls = '') => `<span class="hc-plate ${cls}" aria-hidden="true">${text}</span>`;

/** High-contrast's own progress bar: a 1rem ink-framed track with ticks, a solid ink fill clipped to the value, a yellow-and-ink head. */
const bar = (cls, extra = '') =>
    `<div class="hc-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="hc-bar__track">${a('clip', 'hc-bar__fill')}<span class="hc-bar__head an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is high-contrast’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how high-contrast loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, terminal its block cursor. Each candidate below is only what this theme’s world already owns (ink, paper, one signal yellow, line weight, the sign), never lowers a contrast, and is told apart from the other themes’ anchors, brutalism’s slab first of all.';
export const LOOK =
    'Seven candidates for high-contrast’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Nothing fades and no contrast drops in any of them. Pick the one that is high-contrast to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the board is there at once (gap: clip-path inset(0 100% 0 0);
    // in: clip to full in ONE step at 1 u, `steps(1, jump-end)`); the plate
    // `.hc-s-plate` (yellow, 3px ink frame, 0.8rem bold caps tracked 0.14em,
    // text "✓ READY") wipes in across the board's top edge from the start,
    // clip-path inset(0 100% 0 0) → inset(0) over 3 u on `--kp-sig-hc-ease`
    // starting at 2 u (the register's REMOVED wipe), and stays. Out: the
    // plate wipes off (3 u), the board goes in one step at the end. Bar: the
    // ink fill in 10 hard steps over 7 u (`steps(10, jump-end)`, one tick each);
    // the head is a yellow plate tag reading "62 %" that moves with the fill
    // in the same steps (inset-inline-start keyframes stepped). Button: press
    // at 7 u = the face inverts in one step (ink ground, paper label: the
    // register's hover) and a 0.5rem yellow bar wipes along its foot in the
    // last unit (clip, `--kp-sig-hc-ease`).
    {
        key: 'announced',
        name: 'Announced: the sign says it',
        see: 'A sign board is placed in one hard step. Then a yellow plate in a 3 px ink frame wipes in across its top edge from the start, bold spaced capitals on it, and says what has happened: ✓ READY. It stays. Held, then the plate wipes off and the board is taken down in one step. As a progress bar, the ink fills tick by tick and the head is a yellow plate that says the figure. As a button press, the button inverts to ink in one step and a yellow bar wipes along its foot.',
        follows:
            'Everything that happens is announced on a yellow plate in words: ✓ READY on an arrival, ● LOADING on a waiting part, ↻ UPDATED beside a changed figure, ✕ REMOVED on a leave (the register already says that one), and the plate always wipes in from the start and off again; a press is the inversion plus the yellow bar; hover is the inversion; focus is the ring. Every state is told by a plate, a frame and a word, never by colour alone.',
        why: 'it is the one whole idea the register already has (the ✕ REMOVED leave: a yellow plate with a frame and a caption, wiped in, then gone in a step), it is what a sign does and what a screen reader does, it keeps every rule the theme has (hard steps, a wipe, a plate, 21:1 ink), it gives every state a word of its own, and no finished theme says anything on the way in or out: brutalism’s slab drops, terminal types, grotesk’s plate falls into register; here the sign speaks.',
        caps: [
            'In its own scene: the board placed, the plate says ✓ READY',
            'As a progress bar: the head is a plate that says the figure',
            'As a button press: inverted, the yellow bar wipes along the foot',
        ],
        hero: `<div class="an-hero hc-s-hero" role="img" aria-label="A sign board is placed in one step; a yellow plate reading READY wipes in across its top edge">${board('hc-s-board an-a', plate('✓ READY', 'hc-s-plate an-a'))}</div>`,
        bar: `<div class="an-bar">${bar('hc-s-bar', plate('62 %', 'hc-s-bar__tag an-a'))}</div>`,
        button: `<div class="an-btn"><span class="hc-s-btn">${button('Check the pumps', 'an-press hc-s-press', '', a('clip', 'hc-s-foot'))}</span></div>`,
    },
    // CSS: a row of five 2px-framed white cells (`.hc-w-row`) under the
    // board's title; the yellow ink-framed square (`.hc-w-square`) walks cell
    // to cell in hard steps, dwelling in each (the spinner's walk: one cell
    // per 1.4 u, `steps(1, jump-end)` on inset-inline-start), and the cells
    // it has left fill ink; it stops in the last cell at 7 u. Bar: the track
    // is 10 framed cells; the square walks and the cells behind it go ink
    // (the fill in `steps(10)`). Button: press at 7 u = the yellow square
    // lands in the button beside the label (scale 0 → 1 in one step) and the
    // face inverts.
    {
        key: 'walk',
        name: 'The marker walks to it',
        see: 'Under the board’s title stands a row of five framed cells, the way the spinner has three. A yellow square in an ink frame walks from the first cell to the last, dwelling in each, and every cell it leaves is filled ink: you are here, and here is where you have been. It stops in the last cell. Held, then it walks back and the cells are white again. As a progress bar, the track is a row of cells the square walks, ink behind it. As a button press, the square lands in the button beside the label.',
        follows:
            'Loading is the square walking cells with nowhere to stop yet (the spinner already walks); an arrival is the square arriving in the last cell; a live update is the square stepping once on the changed figure; hover is a square standing beside the control; the press lands it; the leave is the square walking off. Progress, steps and the wizard are rows of cells.',
        why: 'it is the spinner’s own walk, the theme’s one bespoke moving object, and a marker that walks a row of cells is signage (you are here) and nothing of brutalism’s or terminal’s; but it needs a row of cells to walk, so on a plate, a chart or a tile it must bring its row along, and a square beside every control is a second element where the sign plate says the same with a word.',
        caps: [
            'In its own scene: the square walks the cells, ink behind it',
            'As a progress bar: the square walks, cells go ink',
            'As a button press: the square lands beside the label',
        ],
        hero: `<div class="an-hero hc-w-hero" role="img" aria-label="A row of five framed cells; a yellow square walks from the first to the last in hard steps and the cells it leaves fill ink">${board('hc-w-board', `<span class="hc-w-row" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i>${a('', 'hc-w-square')}</span>`)}</div>`,
        bar: `<div class="an-bar">${bar('hc-w-bar', a('', 'hc-w-bar__square'))}</div>`,
        button: `<div class="an-btn"><span class="hc-w-btn">${button('Check the pumps', 'an-press hc-w-press', a('', 'hc-w-press__square'))}</span></div>`,
    },
    // CSS: the board's frame is drawn at 1px (hairline, --border) at gap and
    // thickens in three hard steps to 2px (2 u), 3px (4 u), 4px (6 u),
    // `steps(1, jump-end)` on `box-shadow: inset 0 0 0 Npx var(--foreground)`
    // (never border, so nothing moves); the title's weight goes 400 → 700 at
    // 4 u. Bar: the track's frame thickens 2 → 3 → 4px as the ink fills (steps
    // on the inset shadow), the fill in `steps(10)`. Button: press at 7 u =
    // the button's 2px frame goes 4px in one step (inset shadow), face
    // unchanged, label unchanged.
    {
        key: 'weight',
        name: 'The frame thickens',
        see: 'A board stands in a hairline. Its frame thickens in three hard steps, 2 px, 3 px, 4 px, the way a sign is made to matter, and its title goes bold with the third step; nothing moves and nothing fades. Held, then the frame thins back step by step. As a progress bar, the track’s frame thickens as the ink fills. As a button press, the 2 px frame goes to 4 px in one step.',
        follows:
            'Line weight is the whole language of the theme (1 px decorative, 2 px every control, 3 px structure, 4 px a dialog), so importance is weight: hover is 3 px, the press 4 px, focus the ring, an arrival a frame drawn at 1 px and thickened to its weight, a live update a changed figure framed heavier for a beat, loading a frame at 1 px waiting for its weight; the leave is the frame thinning away.',
        why: 'it is the theme’s stated rule (weight, not colour, says what matters) made into a motion, it keeps every contrast and never flashes, and no other theme thickens a line as its gesture (grotesk thickens one baseline on press, brutalism’s line is 3 px and fixed); but a frame that thickens says “important” and not “here” or “done”, so a wait and an arrival read the same, and a yellow sign says more at a glance than a thicker line.',
        caps: [
            'In its own scene: the frame thickens in three steps',
            'As a progress bar: the frame thickens as the ink fills',
            'As a button press: 2 px to 4 px in one step',
        ],
        hero: `<div class="an-hero hc-t-hero" role="img" aria-label="A board's hairline frame thickens in three hard steps to a 4 px ink frame">${board('hc-t-board an-a')}</div>`,
        bar: `<div class="an-bar">${bar('hc-t-bar')}</div>`,
        button: `<div class="an-btn"><span class="hc-t-btn">${button('Check the pumps', 'an-press hc-t-press')}</span></div>`,
    },
    // CSS: a corner sign (`.hc-c-sign`, a 1.6rem square, 2px ink frame,
    // yellow ground, bold ink "✓") is cut into the board's top-end corner in
    // one step at 6 u (clip-path inset 100% → 0 in `steps(1)`), after the
    // board's lines appear in two steps (title 1 u, line 3 u). Bar: at 100 %
    // (7 u) a ✓ corner sign is cut in at the track's end; the fill in
    // `steps(10)`. Button: press at 7 u = a ● corner sign (yellow, framed)
    // is cut into the button's top-end corner in one step; the face inverts.
    {
        key: 'corner',
        name: 'A sign in the corner',
        see: 'A board is placed, its title then its line, in hard steps. Then a small square sign is cut into its top corner, yellow in a 2 px frame with an ink ✓: the state, told by a sign as well as by a colour. Held, then the sign is taken out and the board down. As a progress bar, the ✓ sign is cut into the end of the track when it is full. As a button press, a ● sign is cut into the button’s corner and the face inverts.',
        follows:
            'Every state carries its corner sign (✓ done, ! warning, ✕ failed, – empty, ? unknown, ● pressed): the calendar’s tone pick already does; an arrival is the board placed and signed; a live update is the sign re-cut; loading is a corner with no sign yet (an empty frame); hover is the empty frame drawn, the press the ● cut in; the leave is the ✕ sign then the board gone.',
        why: 'it is redundant coding made visible (colour, frame and a sign, the rule this theme lives by), it is a signage habit no other theme has, and a sign cut into a corner in one step keeps every contrast; but it is small: a 1.6 rem corner square does not carry a loading picture or an arrival, and on a button it crowds the label where the announcing plate has room to say the word.',
        caps: [
            'In its own scene: the board placed, a ✓ sign cut in the corner',
            'As a progress bar: a ✓ sign at the end when full',
            'As a button press: a ● sign cut in the corner',
        ],
        hero: `<div class="an-hero hc-c-hero" role="img" aria-label="A sign board; a small yellow square with an ink tick is cut into its top corner in one step">${board('hc-c-board', a('', 'hc-c-sign'))}</div>`,
        bar: `<div class="an-bar">${bar('hc-c-bar', a('', 'hc-c-bar__sign'))}</div>`,
        button: `<div class="an-btn"><span class="hc-c-btn">${button('Check the pumps', 'an-press hc-c-press', '', a('', 'hc-c-press__sign'))}</span></div>`,
    },
    // CSS: the board inverts in one hard step at 4 u: ground ink, title and
    // line paper, frame paper-on-ink (`steps(1)` on background-color and
    // color), held; out: back in one step at 4 u. Before 4 u the board is
    // placed in one step at 1 u. Bar: the fill is each tick cell inverting
    // in turn (`steps(10)` over 7 u). Button: press at 7 u = the register's
    // inversion (ink ground, paper label) in one step, held.
    {
        key: 'invert',
        name: 'Inverted: the plate flips',
        see: 'A board is placed in one step. Then it flips in one step, ink for paper: black ground, white title, white frame; nothing in between the two states. Held, then it flips back and is taken down. As a progress bar, the ticks flip to ink one by one. As a button press, the button flips to ink in one step, the way this theme’s buttons already answer a hover.',
        follows:
            'What matters is the plate flipped (hover, the pressed control, the current page, the selected text, the tooltip, the marquee: the register already flips them all); an arrival is placed then flipped once; a live update is the changed figure flipped for a beat; loading is a plate flipping on and off; the leave is the plate flipped then gone.',
        why: 'it is the theme’s most frequent gesture (the bar flips is the pick for menus, tiles, columns, the key figure and the header), it is the strongest change a page can show without a hue, and it never costs a contrast; but a flip is a state and not a direction, so every arrival and every wait look alike, and flipping a plate under the pointer is terminal’s reverse video and brutalism’s hover, both finished before this round.',
        caps: [
            'In its own scene: the board flips to ink',
            'As a progress bar: the ticks flip one by one',
            'As a button press: the button flips to ink',
        ],
        hero: `<div class="an-hero hc-i-hero" role="img" aria-label="A sign board flips from black on white to white on black in one hard step">${board('hc-i-board an-a')}</div>`,
        bar: `<div class="an-bar">${bar('hc-i-bar')}</div>`,
        button: `<div class="an-btn"><span class="hc-i-btn">${button('Check the pumps', 'an-press hc-i-press')}</span></div>`,
    },
    // CSS: hazard tape (`.hc-h-tape`, a 0.9rem band of -45° ink/yellow
    // stripes, 6px each, 2px ink frame) is run across the board from the
    // start over 5 u in `steps(10)` (clip block), then the board's lines
    // appear beneath it in one step at 6 u; held with the tape across the
    // top; out: the tape is cut off (clip back, steps). Bar: the busy
    // stripes run in behind the ink fill (the fill `steps(10)`, the stripes
    // clipped 1 u ahead). Button: press at 7 u = a strip of tape runs across
    // the button's foot in one step; face inverts.
    {
        key: 'tape',
        name: 'Tape is run across it',
        see: 'A board stands empty. Hazard tape, ink and yellow stripes in a frame, is run across its top edge from the start in hard steps, and once the tape is across the board’s lines are placed beneath it. Held, then the tape is cut off and the board down. As a progress bar, the stripes run in just ahead of the ink fill. As a button press, a strip of tape runs across the button’s foot.',
        follows:
            'Tape is the mark of something in hand: loading is tape being run and run again (the busy bar’s stripes, the calendar’s and the graph’s hazard tape already say it); an arrival is taped, then released; a live update is a strip over the changed figure; hover is the tape’s edge, the press the strip; the leave is the board taped off.',
        why: 'it is the loading picture Kenny picked three times for this theme (the busy bar, the calendar, the graph) and stripes in ink and yellow are the theme’s one pattern; but hazard tape is the tone brutalism already owns and the armed stripes cyberpunk has, and tape only says “wait” or “danger”: on a press or an arrival it is the wrong word.',
        caps: [
            'In its own scene: tape run across the board',
            'As a progress bar: the stripes ahead of the ink',
            'As a button press: a strip across the foot',
        ],
        hero: `<div class="an-hero hc-h-hero" role="img" aria-label="Hazard tape in ink and yellow stripes is run across the top of a sign board in hard steps">${board('hc-h-board', a('clip', 'hc-h-tape'))}</div>`,
        bar: `<div class="an-bar">${bar('hc-h-bar', a('clip', 'hc-h-bar__stripes'))}</div>`,
        button: `<div class="an-btn"><span class="hc-h-btn">${button('Check the pumps', 'an-press hc-h-press', '', a('clip', 'hc-h-press__strip'))}</span></div>`,
    },
    // CSS: the board is built cell by cell in hard steps: its frame at 1 u,
    // its title at 2.5 u, its line at 4 u, its foot rule at 5.5 u, each in
    // one `steps(1)` clip (inset 100% → 0 on each part); out: taken apart
    // last first. Bar: the fill in `steps(10)` over 7 u (one tick a step).
    // Button: press at 7 u = the label is replaced by its inverted copy in
    // one step (ink ground, paper label), the frame unchanged.
    {
        key: 'cells',
        name: 'Placed cell by cell',
        see: 'Nothing slides and nothing fades: the board is built in hard steps, its frame, then its title, then its line, then its foot rule, each placed whole. Held, then taken apart last first. As a progress bar, the ink fills one tick per step. As a button press, the button is placed inverted in one step.',
        follows:
            'Everything is placed in whole steps (the calendar’s cell by cell, the graph’s placed sites, the columns dropped, the menu switched on in four steps: all already picked); a live update is the changed figure re-placed; loading is a frame placed and waiting; hover and press are one step each; the leave is the parts taken away.',
        why: 'it is the honest form of how this theme already moves (every change a switch, as scope-12 wrote), it is cheap in every sense and never lowers a contrast; but it is a rhythm, not an object: nothing in it can be pointed at and called high-contrast’s, and terminal prints its panels one whole line per step already.',
        caps: [
            'In its own scene: frame, title, line, rule, each placed whole',
            'As a progress bar: one tick per step',
            'As a button press: placed inverted in one step',
        ],
        hero: `<div class="an-hero hc-p-hero" role="img" aria-label="A sign board is built in hard steps: frame, title, line, foot rule"><div class="hc-board hc-p-board"><span class="hc-p-frame an-a" aria-hidden="true"></span><p class="hc-board__title an-a">Pump house 3</p><p class="hc-board__line an-a">Flow 1 284 l/min. Pressure steady.</p><span class="hc-p-rule an-a" aria-hidden="true"></span></div></div>`,
        bar: `<div class="an-bar">${bar('hc-p-bar')}</div>`,
        button: `<div class="an-btn"><span class="hc-p-btn">${button('Check the pumps', 'an-press hc-p-press')}</span></div>`,
    },
];
