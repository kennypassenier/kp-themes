// Retro's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Retro is the 1995 desktop: a teal
// desktop, the page one application window on it (navy title-bar ramp,
// raised bevel, hard drop), grey chrome, sunken wells, the 50 % dither,
// navy progress blocks, the selection bar, the hourglass, marching ants;
// nothing eases (`--fx-duration: 0ms`), everything moves in hard `steps()`.
// Kenny on the drawer round: "make me feel the retro vibe of an old
// windows". Each candidate is one thing Windows 95 did: a window zoomed
// open in outline steps, the hourglass turned, the selection bar snapped
// on, a thing dissolved through the dither, the marching ants selected it,
// the progress blocks filled, a window became active.
//
// The other themes' anchors steered clear of: terminal's block cursor and
// typed lines (the DOS voice stays a label), nostromo's raster (no
// scanlines, no CRT: this is a desktop), brutalism's hard slab (retro's
// drop is 3–4 px grey, its box a bevel), high-contrast's hard steps as a
// rhythm (retro's steps draw 1995 things, not signs).
//
// Implementation notes for options.css: NOTHING eases: every keyframe pair
// runs on `steps(n, jump-end)` or `step-end`; the bevels are the register's
// own stacks (`--kp-raised`, `--kp-pressed`, `--kp-sunken`), the ramp is
// `--kp-ramp`, the dither `--kp-brush` and the densities `--kp-dd-100/75/50/25`
// (as ground) / `--kp-dm-*` (as mask). See the comment above each candidate.

export const THEME = 'retro';
export const LABEL = 'Retro';
/** One unit of the clock, ms: 1995 drew in frames of about 70 ms (its outline zoom had four); the clock keeps whole frames. */
export const UNIT = 90;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A 1995 window: raised bevel, a title bar (navy ramp, Pixelify title, three drawn controls), a body with two lines. */
const win = (cls = '', inner = '', title = 'Pump house 3') =>
    `<div class="rt-win ${cls}"><div class="rt-win__title"><span>${title}</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="rt-win__body"><p>Flow: 1284 l/min</p><p>Pressure: steady</p></div>${inner}</div>`;

/** Retro's own progress bar: a sunken well with navy blocks that fill whole, block by block. */
const bar = (cls, extra = '') =>
    `<div class="rt-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="rt-bar__well">${a('clip', 'rt-bar__blocks')}${extra}</span></div>`;

export const QUESTION = 'Which one element is retro’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how retro loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, terminal its block cursor. Each candidate below is only what the 1995 desktop already owned, moves in hard steps and never eases, and is told apart from the other themes’ anchors, terminal’s cursor and nostromo’s raster first of all.';
export const LOOK =
    'Seven candidates for retro’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Nothing eases in any of them. Pick the one that is retro to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the 1995 window zoom: four dotted outline rectangles (`.rt-z-box
    // i`, 1px dotted ink, no fill) are drawn one per frame from a small
    // rectangle at the stage's foot-start (the taskbar's place) up to the
    // window's full rectangle, each held one frame and the previous erased
    // (`steps(1)`, 1 u each, 1–5 u: box 1 at 25 % size, 2 at 50 %, 3 at
    // 75 %, 4 at 100 %); then the window is painted whole at 6 u (clip
    // inset 100% → 0 in one step). Out: the window erased in one step, the
    // outlines stepping down. Bar: the blocks fill whole, one block a step
    // (`steps(n)` on the clip, 7 u). Button: press at 7 u = the register's
    // press: the face repainted with `--kp-pressed`, the label 1px down and
    // right, in one step, held.
    {
        key: 'zoom',
        name: 'The window zooms open in outline',
        see: 'What Windows 95 drew when a window opened: four dotted outline rectangles, one per frame, each larger than the last, stepping up from where the window’s button sits to where the window will be, and then the window is painted whole. Held, then erased in one step and the outlines step back down. As a progress bar, the navy blocks fill one block a step, as retro’s bar already does. As a button press, the bevel is pressed in one step and the label moves a pixel, as retro’s buttons already do.',
        follows:
            'Every window, dialog, menu and toast zooms open in outline and zooms shut; a tile or a panel that arrives is zoomed from its button; loading is the hourglass; a live update is the changed figure repainted in one step; hover is nothing (1995 had none) and the press the bevel; the leave is the outline zooming down to where it came from.',
        why: 'it is the single most remembered motion of that desktop and nobody else can have it (every other theme opens by a clip, a fold, a rise or a fall; none zooms in outline), it is hard steps by nature so it keeps retro’s one law, and it decides at once how everything opens and closes, where the bevel press, the blocks and the hourglass already decide the rest.',
        caps: [
            'In its own scene: four outlines step up, the window is painted',
            'As a progress bar: a block per step',
            'As a button press: the bevel pressed, the label a pixel over',
        ],
        hero: `<div class="an-hero rt-z-hero" role="img" aria-label="Four dotted outline rectangles step up from the bottom corner, each larger than the last, then a 1995 window is painted whole"><div class="rt-z-stage"><span class="rt-z-box" aria-hidden="true"><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i><i class="an-a"></i></span>${win('rt-z-win an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('rt-z-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-z-btn">${button('Open', 'an-press rt-z-press')}</span></div>`,
    },
    // CSS: the hourglass (`.rt-h-glass`, the register's spinner drawing:
    // two ink caps, a glass polygon clipped, sand in the dither brush) stands
    // large beside the window; the sand drains through 6 stepped frames
    // (0–6 u, `steps(1)` between clip-path polygons, the register's
    // `kp-sig-retro-sand` stops), then the glass turns 180deg in one step at
    // 7 u; the window's body is painted at 7 u in one step (it was waiting).
    // Out: the glass turns back, the sand runs up, the body erased. Bar: the
    // blocks fill a block a step and a small hourglass (1rem) stands at the
    // well's end, its sand draining in step with the blocks. Button: press at
    // 7 u = the pointer over the button becomes the hourglass (a 1rem glass
    // drawn beside the label in one step), face pressed.
    {
        key: 'hourglass',
        name: 'The hourglass turns',
        see: 'The cursor of 1995: an hourglass stands beside the window while its body waits; the sand drains in whole frames, and when it is through the glass is turned over in one step and the window’s body is painted. Held, then the glass turns back, the sand runs up and the body is erased. As a progress bar, the blocks fill a block a step and a small hourglass at the end drains with them. As a button press, the pointer over the button becomes the hourglass.',
        follows:
            'Waiting is the hourglass (the spinner already is), so every loading part shows it and nothing else moves meanwhile; an arrival is the body painted when the sand is through; a live update is one turn of the glass beside the changed figure; a press shows the hourglass while the press works; the leave is the glass turned and the thing erased.',
        why: 'it is the theme’s one bespoke moving object today and the second thing anyone remembers of that desktop; but it is a cursor and a wait, not a way of opening or closing anything, so arrivals, leaves and presses need the window zoom beside it, and the zoom then decides more of the theme than the glass.',
        caps: [
            'In its own scene: the sand drains, the glass turns, the body is painted',
            'As a progress bar: a block per step, the glass drains',
            'As a button press: the pointer becomes the hourglass',
        ],
        hero: `<div class="an-hero rt-h-hero" role="img" aria-label="An hourglass cursor stands beside a 1995 window; its sand drains in frames, it turns over, and the window's body is painted"><div class="rt-h-stage">${win('rt-h-win')}<span class="rt-h-glass an-a" aria-hidden="true"><i class="rt-h-glass__sand an-a"></i></span></div></div>`,
        bar: `<div class="an-bar">${bar('rt-h-bar', '<span class="rt-h-bar__glass an-a" aria-hidden="true"><i class="an-a"></i></span>')}</div>`,
        button: `<div class="an-btn"><span class="rt-h-btn">${button('Open', 'an-press rt-h-press', '', '<span class="rt-h-press__glass an-a" aria-hidden="true"></span>')}</span></div>`,
    },
    // CSS: a list of four rows in the window's body (Start-menu style); the
    // navy selection bar (`.rt-s-bar`, `--primary` ground, white text via a
    // copy of the row text in white clipped to the bar) snaps on whole over
    // row 1 at 2 u, row 2 at 3.5 u, row 3 at 5 u (one step each, the previous
    // released), and stays on row 3; out: back up. Bar: the blocks are the
    // selection bar painted a block a step. Button: press at 7 u = the face
    // is selected: navy ground, white label, in one step (the Start menu's
    // pick), held.
    {
        key: 'selection',
        name: 'The selection bar snaps on',
        see: 'A list in the window, as in the Start menu. The navy selection bar snaps on whole over the first row, white text on it, then over the next, then the next, one step each and never a slide, and stays on the chosen row. Held, then it snaps back up and off. As a progress bar, the blocks are the selection bar painted a block a step. As a button press, the button is selected: navy face, white label, in one step.',
        follows:
            'Every hover and every pick is the selection bar (the register already does it on links, menus, marks, days); a press holds it; an arrival is a row painted and then selected; a live update is the changed row selected for a beat; loading is the bar stepping down a list of nothing; the leave is the row deselected and erased.',
        why: 'it is already everywhere in the register (“every hover is the selection bar, instantly”) and the Start menu’s pick, so the theme would speak with one voice; but it is a state of a row and says nothing of how a window, a dialog or a chart opens or waits, and a solid bar snapping on under the pointer is close to brutalism’s invert and terminal’s reverse video.',
        caps: [
            'In its own scene: the bar snaps down the list, stays',
            'As a progress bar: the bar painted a block a step',
            'As a button press: the button selected in one step',
        ],
        hero: `<div class="an-hero rt-s-hero" role="img" aria-label="A navy selection bar snaps on whole over one row of a list, then the next, in hard steps"><div class="rt-win rt-s-win"><div class="rt-win__title"><span>Pumps</span><span class="rt-win__controls" aria-hidden="true"><i></i><i></i><i></i></span></div><ul class="rt-s-list"><li><span>Pump house 1</span></li><li><span>Pump house 2</span></li><li><span>Pump house 3</span></li><li><span>Pump house 4</span></li>${a('', 'rt-s-bar')}</ul></div></div>`,
        bar: `<div class="an-bar">${bar('rt-s-bar-p')}</div>`,
        button: `<div class="an-btn"><span class="rt-s-btn">${button('Open', 'an-press rt-s-press')}</span></div>`,
    },
    // CSS: the window dissolves in through the four dither densities: a mask
    // over the window in `--kp-dm-100` → `-75` → `-50` → `-25` → none, one
    // step each (1.5 u each, 0–6 u, `steps(1)`), the boot's `kp-dither-out`
    // reversed; out: the densities back up. Bar: the blocks fill, but each
    // new block dissolves in through the four densities (4 quick steps per
    // block). Button: press at 7 u = the face dissolves to `--kp-pressed`
    // through two densities (50, 100) in two steps, label 1px over.
    {
        key: 'dither',
        name: 'Dissolved through the dither',
        see: 'The window is not faded in: it comes through the checkerboard, four densities of dither, 25, 50, 75, 100 per cent, one hard step each, the way the boot screen already goes out. Held, then it dissolves away through the same four. As a progress bar, every new block comes in through the four densities. As a button press, the face dissolves to pressed through two densities.',
        follows:
            'Every arrival and leave is a dither dissolve (the headline and the boot already are); loading is a surface stuck at 50 per cent (the skeleton and busy bar already are); a live update is the changed figure dissolved and redrawn; hover is nothing, the press two densities; redactions lift through it.',
        why: 'it is the theme’s own material (“the dither every gradient was”) and the boot, the headline, the skeleton, the busy bar and the redactions already use it, and no other theme dissolves; but it is a way of appearing, not an object, and four densities of checkerboard over a window are a dissolve any fade can be mistaken for at a glance.',
        caps: [
            'In its own scene: the window comes through four densities',
            'As a progress bar: each block through the dither',
            'As a button press: pressed through two densities',
        ],
        hero: `<div class="an-hero rt-d-hero" role="img" aria-label="A 1995 window comes in through four densities of checkerboard dither, one hard step each">${win('rt-d-win an-a')}</div>`,
        bar: `<div class="an-bar">${bar('rt-d-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-d-btn">${button('Open', 'an-press rt-d-press')}</span></div>`,
    },
    // CSS: marching ants (`.rt-m-ants`, a 1px dashed ink outline, dash 4px,
    // `background` of four repeating gradients or `outline: 1px dashed` with
    // an animated `outline-offset`? Better: a border-image or four edge
    // gradients whose `background-position` steps 1px a frame) are drawn
    // round the window's body in one step at 1 u and march (8 px per u in
    // 2 px steps) through the hold; the body's text is selected (navy bar on
    // the lines, white text) at 5 u in one step. Out: deselected, the ants
    // erased. Bar: the blocks' leading edge is marching ants ahead of the
    // fill (the fill `steps`), the ants marching through the hold. Button:
    // press at 7 u = the ants are drawn round the button (the 1995 focus
    // rectangle) in one step, face pressed.
    {
        key: 'ants',
        name: 'Marching ants select it',
        see: 'A dashed line is drawn round the window’s body in one step and marches, the way a selection did in 1995, the dashes stepping along the edge; then what is inside is selected, navy with white text. Held with the ants marching, then deselected and the ants erased. As a progress bar, the ants march ahead of the blocks at the fill’s edge. As a button press, the ants are drawn round the button, the focus rectangle of that desktop.',
        follows:
            'What is being worked on is lassoed (loading is the ants marching round an empty well; the graph already loads so), what is chosen is selected inside them, focus is the ants (the dotted focus line of 1995), a press draws them, an arrival is the lasso then the paint, a live update the changed figure lassoed for a beat, the leave the selection cut.',
        why: 'it is the one looping motion that desktop had besides the hourglass, it is already the graph’s loading and the tiles’ focus, and nobody else marches a dashed line; but it says “selected” and “busy” only, so a dialog or a toast cannot arrive by it without the zoom, and a dashed ring under the pointer is forest’s blaze and terminal’s dashed box in grey.',
        caps: [
            'In its own scene: the ants march, the body is selected',
            'As a progress bar: the ants ahead of the blocks',
            'As a button press: the ants round the button',
        ],
        hero: `<div class="an-hero rt-m-hero" role="img" aria-label="A dashed selection outline marches round a window's body, then the body is selected navy with white text">${win('rt-m-win', a('', 'rt-m-ants'))}</div>`,
        bar: `<div class="an-bar">${bar('rt-m-bar', a('', 'rt-m-bar__ants'))}</div>`,
        button: `<div class="an-btn"><span class="rt-m-btn">${button('Open', 'an-press rt-m-press', '', a('', 'rt-m-press__ants'))}</span></div>`,
    },
    // CSS: a sunken well in the window's body (the install wizard's bar) fills
    // with navy blocks one block a step (12 blocks over 6 u, `steps(12)` on
    // the clip), and when it is full the window's lines are painted in one
    // step at 7 u; out: the lines erased, the blocks emptied a block a step.
    // Bar: the register's bar. Button: press at 7 u = the face is filled in
    // blocks (navy blocks across the face under the label, in 4 steps over
    // the last unit), label white.
    {
        key: 'blocks',
        name: 'The progress blocks fill',
        see: 'The install wizard: a sunken well in the window fills with navy blocks, one whole block a step, never a pixel between, and when the last block is in the window’s lines are painted. Held, then the lines are erased and the blocks emptied one a step. As a progress bar, it is retro’s own bar. As a button press, the face is filled in blocks under the label.',
        follows:
            'Loading is the blocks filling (Kenny picked it for the chart, the trend, the strip, the menu, the tiles and the busy table); an arrival is the paint after the last block; a live update is the changed figure’s blocks refilled; a press fills the face; the leave is the blocks emptied. The boot already counts so.',
        why: 'it is the loading picture Kenny picked seven times for retro and it is already the bar, so the theme would have one waiting picture; but it is a bar, and a bar that fills in steps can only say “so far”: a dialog, a hover and a leave have nothing to fill, and brutalism’s ruled bar fills in ten hard steps too.',
        caps: [
            'In its own scene: the well fills a block a step, then the paint',
            'As a progress bar: retro’s own bar',
            'As a button press: the face filled in blocks',
        ],
        hero: `<div class="an-hero rt-b-hero" role="img" aria-label="A sunken well in a 1995 window fills with navy blocks one at a time, then the window's lines are painted">${win('rt-b-win', `<div class="rt-b-well" aria-hidden="true">${a('clip', 'rt-b-well__blocks')}</div>`, 'Setup')}</div>`,
        bar: `<div class="an-bar">${bar('rt-b-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-b-btn">${button('Open', 'an-press rt-b-press', a('clip', 'rt-b-press__blocks'))}</span></div>`,
    },
    // CSS: an inactive window (title bar `--kp-raised` grey, title in
    // `--muted-foreground`, controls flat) becomes active: at 3 u the title
    // bar takes the navy ramp and the title goes white in one step, at 4 u
    // the window's bevel takes `--kp-raised` (from a flat 1px line) and its
    // hard drop appears, at 5 u the body's text goes ink; out: deactivated
    // in reverse. Bar: the blocks fill a block a step, the well's frame goes
    // from inactive grey to the sunken bevel at 1 u. Button: press at 7 u =
    // the button becomes the default (the 1px ink ring of `--mirror` drawn
    // round it) and is pressed, one step.
    {
        key: 'active',
        name: 'The window becomes active',
        see: 'An inactive window, its title bar grey and flat. It is clicked: the title bar takes the navy ramp and the title goes white in one step, the frame raises on its bevel with its hard drop, and the body’s text comes up from grey to ink. Held, then it goes inactive again, step by step. As a progress bar, the well takes its sunken bevel first and the blocks fill. As a button press, the button becomes the default (the ink ring round it) and is pressed.',
        follows:
            'What is current is active (navy title bar, raised, dropped) and everything else is grey and flat: the open dialog, the hovered tile, the picked card; an arrival is a window painted inactive and made active; loading is a window still inactive; a live update is the changed window re-activated; the press makes the default; the leave is the window deactivated and erased.',
        why: 'it is the quiet moment every 1995 user knew (a window waking up when clicked), it is one step and costs nothing, and the navy ramp is retro’s one colour statement; but it is a state of the whole window and says nothing about how it opens or waits, and a title bar going from grey to navy is a colour step a theme switch could do.',
        caps: [
            'In its own scene: the title bar lights, the frame raises',
            'As a progress bar: the well wakes, the blocks fill',
            'As a button press: the default ring, pressed',
        ],
        hero: `<div class="an-hero rt-a-hero" role="img" aria-label="A grey, inactive 1995 window is clicked: its title bar turns navy, its frame raises and its text goes ink, in hard steps">${win('rt-a-win an-a')}</div>`,
        bar: `<div class="an-bar">${bar('rt-a-bar')}</div>`,
        button: `<div class="an-btn"><span class="rt-a-btn">${button('Open', 'an-press rt-a-press')}</span></div>`,
    },
];
