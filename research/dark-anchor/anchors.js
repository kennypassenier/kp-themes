// Dark's candidates for its anchor element, UPDATE 1 (Kenny, 2026-10-08:
// "I love the colours of everything, especially the progress bar on option
// 1, but I also like the sleek animations of spectral line, can we combine
// these somehow?"). Round one's option 1 was the film turning (the panel's
// oxide edge turned once round, the bar's fill the film whose colour turned
// as it filled) and option 4 the spectral line (a thin vertical line of
// film light sweeping the panel at an even pace, lighting what it passed).
// This update is five ways of being both at once: the line is what turns
// the film. Every candidate keeps round one's progress bar drawing (the
// chamfered ticked track, the film fill whose colour turns as it fills,
// the `]` head) and adds the line to it.
//
// The world: a spectral instrument, a near-black ground with a faint ruled
// grid, near-white ink, and ONE mechanism, the anodised oxide film
// (`--kp-iris`, cyan → violet → magenta → lime) whose angle turns with the
// pointer and runs along every edge that matters; parts are chamfered at
// 45°; brackets close on labels. Not titanium's bath (heat order, drifting),
// not cyberpunk's glitch (no jitter, no tear), not nostromo's raster.
//
// Implementation notes for options.css: see the comment above each
// candidate. The film turns on a registered angle (`@property --an-angle
// { syntax: '<angle>'; inherits: true; initial-value: 0deg }`) written as
// `conic-gradient(from var(--an-angle), var(--chart-1), var(--chart-2),
// var(--chart-3), var(--chart-4), var(--chart-1))`; the spectral line is a
// 2px vertical slice of that film with a 10px soft glow of chart-1 at 40 %
// (the one glow the theme allows, as round one's line had). Sweeps are
// linear (an instrument scanning); turns settle on `--kp-settle` with the
// inverse written out on the close; a timing function inside @keyframes is
// written literally, never a var().

export const THEME = 'dark';
export const LABEL = 'Dark';
/** One unit of the clock, ms: dark's register beat is 220 ms on a quick-out curve; its settle is `--kp-settle` (0.22, 1, 0.36, 1). */
export const UNIT = 110;

/** A package button; `inner` goes before its label (a fill, a lane), `after` behind it. */
const button = (label, cls = '', inner = '', after = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span>${after}</button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="an-a${block ? ` an-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** A chamfered instrument panel (two opposite corners cut 1rem) with a mono readout and a figure. */
const panel = (cls = '', inner = '') =>
    `<div class="dk-panel ${cls}"><p class="dk-panel__readout">PUMP 03 · FLOW</p><p class="dk-panel__figure">1 284</p><p class="dk-panel__line">l/min · steady</p>${inner}</div>`;

/** Round one's progress bar, kept as Kenny asked: a chamfered ticked track, a film fill whose colour turns as it fills, a `]` bracket at its head; `extra` adds the line. */
const bar = (cls, extra = '') =>
    `<div class="dk-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="dk-bar__track">${a('clip', 'dk-bar__fill')}<span class="dk-bar__head an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is dark’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Update 1. You loved the colours and the progress bar of “the film turns” and the sleek motion of “the spectral line sweeps it”; each candidate below is one way of making them one thing: the line is what turns the film. Every candidate keeps round one’s progress bar (the film fill whose colour turns as it fills) and adds the line to it; they differ in how the line and the turn are joined.';
export const LOOK =
    'Update 1: five candidates that combine the film’s turn with the spectral line, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is dark to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the line (`.dk-a-line`, round one's spectral line) sweeps the
    // panel start → end over 6 u, linear; the panel's film edge is dark
    // (`--border-strong`) ahead of the line and FILM behind it, and the film
    // laid behind the line is turning: `--an-angle` runs 0 → 360deg over the
    // same 6 u on the panel (the edge's colour runs round once as the line
    // crosses), so the line reads as the thing that lays the film down and
    // sets it turning; at 6–7 u the figure takes the film through its
    // letters and the turn settles (`--kp-settle`). Out: the line sweeps
    // back and takes the film off, the angle turning back. Bar: round one's
    // bar with the line as its head: the fill's film angle turns as the line
    // runs (7 u). Button: press at 7 u = the line sweeps across the face in
    // the last unit and the 2px film edge under the label turns a quarter
    // (cyan → violet) as it passes; brackets close one step.
    {
        key: 'lays',
        name: 'The line lays the film down, turning',
        see: 'A spectral line of film light sweeps the panel from the start at an even pace, and the film it lays along the edge behind it is turning: the colour runs once round the edge as the line crosses, and when the line reaches the end the figure takes the film through its letters and the turn settles with cyan at the top. Held, then the line sweeps back and takes the film with it. As a progress bar, round one’s bar with the line as its head: the fill’s colour turns as the line runs. As a button press, the line sweeps the face and the film edge under the label turns a quarter as it passes.',
        follows:
            'Loading is the line sweeping an empty slot and the film turning behind it; an arrival is one pass that lays and turns the film; a live update is one pass over the changed figure; hover is the line resting at the control’s start; the press is a pass that turns the edge a quarter; the leave is the pass that takes the film off. One line, one turn, every state.',
        why: 'it is the two things you picked made into one cause and one effect (the line is what turns the film, so neither is decoration), it keeps the bar you loved as it is with the line on its head, it has the even pace of the sweep and the settle of the turn in one gesture, and no finished theme does either: titanium’s wash drifts and never turns, deco’s glint runs along a fixed gold.',
        caps: [
            'In its own scene: the line sweeps, the film turns behind it',
            'As a progress bar: the line at the head, the fill’s colour turns',
            'As a button press: the line sweeps, the edge turns a quarter',
        ],
        hero: `<div class="an-hero dk-a-hero" role="img" aria-label="A spectral line sweeps across an instrument panel and lays a turning oxide film along its edge behind it"><div class="dk-a-stage">${panel('dk-a-panel an-a')}${a('move', 'dk-a-line')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-a-bar', a('', 'dk-a-bar__line'))}</div>`,
        button: `<div class="an-btn"><span class="dk-a-btn">${button('Read the pumps', 'an-press dk-a-press', a('', 'dk-a-edge'), a('move', 'dk-a-press__line'))}</span></div>`,
    },
    // CSS: the line (`.dk-b-line`, the same slice, 2px) is bent round the
    // panel's edge: it travels the perimeter as a short bright segment
    // (a 1.5rem length of the film edge at full brightness, moving along the
    // border via a conic mask whose angle runs 0 → 360deg over 6 u, linear,
    // starting at the top-start corner), and the film is laid along the edge
    // behind it (a second conic mask opening behind the segment); the
    // chamfered corners are followed (the mask is on the panel's own
    // clip-path shape); at 6–7 u the figure takes the film. Out: the
    // segment runs back and the edge goes dark behind it. Bar: the segment
    // runs along the top edge of round one's fill as it fills, and round the
    // `]` head. Button: press at 7 u = the segment runs once round the
    // button's edge (the 2px film edge drawn all round, not only the foot)
    // in the last unit; brackets close.
    {
        key: 'scans',
        name: 'The line scans the edge round',
        see: 'The spectral line is bent to the instrument: a short bright segment of film runs round the panel’s edge from the top corner, clockwise, following the chamfers, and the film is laid along the edge behind it, so by the time it is back at the corner the whole edge is film, cyan at the top; the figure takes the film as it closes. Held, then the segment runs back and the edge goes dark behind it. As a progress bar, the segment runs along the top of round one’s fill as it fills and round the ] head. As a button press, the segment runs once round the button’s edge.',
        follows:
            'Every edge is scanned round once as the part arrives (panel, card, dialog, menu, tooltip), re-scanned on a live update, scanned on and on while loading, and scanned off on the leave; hover rests the segment at the control’s corner; the press runs it round. The film’s turn is the scan: the colour runs where the segment has been.',
        why: 'it makes the line and the turn literally one path (the line runs round the edge, so the film turns because the line turned), it fits the chamfered shape dark already has, and no theme runs a light round an edge; but a segment on a perimeter is small and slow to read on a wide panel, and it is only an edge: a figure or a bar has to be read by its edge too.',
        caps: [
            'In its own scene: the segment runs round the edge, film behind it',
            'As a progress bar: the segment along the fill and round the head',
            'As a button press: the segment runs round the button',
        ],
        hero: `<div class="an-hero dk-b-hero" role="img" aria-label="A short bright segment of spectral light runs clockwise round a chamfered panel's edge, laying the oxide film behind it"><div class="dk-b-stage">${panel('dk-b-panel an-a', a('', 'dk-b-seg'))}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-b-bar', a('', 'dk-b-bar__seg'))}</div>`,
        button: `<div class="an-btn"><span class="dk-b-btn">${button('Read the pumps', 'an-press dk-b-press', a('', 'dk-b-press__seg'))}</span></div>`,
    },
    // CSS: two lines sweep in from opposite sides, a cyan one (`.dk-c-cyan`,
    // chart-1) from the start and a magenta one (`.dk-c-magenta`, chart-3)
    // from the end, each over 5 u linear, and where they have passed the
    // panel's edge takes the film from that end (cyan from the start,
    // magenta from the end, the conic angle set so the two colours meet in
    // the middle at 5 u, violet between them); the two lines meet at the
    // centre and the film settles into its turn (angle → cyan at top, 5–7 u,
    // `--kp-settle`); the figure takes the film at 7 u. Out: the lines part
    // and take the film with them. Bar: round one's bar: the fill grows from
    // the start with the cyan line at its head while a magenta line waits at
    // the end and comes to meet it (the fill is the film between them).
    // Button: press at 7 u = the two lines sweep in from the button's two
    // ends and meet under the label in the last unit; the edge turns.
    {
        key: 'meet',
        name: 'Two wavelengths meet in the middle',
        see: 'Two spectral lines, a cyan one from the start and a magenta one from the end, sweep in at an even pace and the film is laid behind each: cyan from one side, magenta from the other, violet where they meet in the middle; as they meet the film settles into its turn and the figure takes it. Held, then the lines part and take the film with them. As a progress bar, the fill grows from the start with the cyan line at its head while the magenta line waits at the end and comes to meet it. As a button press, the two lines meet under the label.',
        follows:
            'Everything arrives by two wavelengths meeting (a panel, a figure, a line), updates by a meeting over the changed figure, loads by two lines that cannot meet yet (they sweep and part), and leaves by parting; hover is the two lines resting at the control’s ends; the press makes them meet. The spectrum is always read from both ends.',
        why: 'it is the sweep made symmetric and the film shown as what it is (a spectrum between two wavelengths), and the meeting is a satisfying stop; but two copies converging is the picture Kenny set aside for dark’s live update as too near cyberpunk’s glitch, and cyberpunk’s anchor is now two colours (yellow and cyan) that meet, so this would read as cyberpunk in dark’s colours.',
        caps: [
            'In its own scene: cyan and magenta sweep in and meet',
            'As a progress bar: the fill between the two lines',
            'As a button press: the lines meet under the label',
        ],
        hero: `<div class="an-hero dk-c-hero" role="img" aria-label="A cyan line from the left and a magenta line from the right sweep across a panel and meet in the middle, laying the film behind them"><div class="dk-c-stage">${panel('dk-c-panel an-a')}${a('move', 'dk-c-cyan')}${a('move', 'dk-c-magenta')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-c-bar', `${a('', 'dk-c-bar__cyan')}${a('move', 'dk-c-bar__magenta')}`)}</div>`,
        button: `<div class="an-btn"><span class="dk-c-btn">${button('Read the pumps', 'an-press dk-c-press', a('move', 'dk-c-press__cyan'), a('move', 'dk-c-press__magenta'))}</span></div>`,
    },
    // CSS: the line stands still as a slit (`.dk-d-slit`, the 2px film
    // slice with its glow, fixed at the panel's centre, 2 u), and the film
    // turns under it: the panel's whole ground is the film at 14 % (a conic
    // at the panel's centre), `--an-angle` 0 → 360deg over 5 u (2–7 u) on
    // `--kp-settle`, so the slit shows the colour of the moment (its own
    // colour is sampled from the angle: the slit's gradient uses the same
    // angle) and the edge takes the film as the turn completes; the figure
    // takes the film at 7 u. Out: the film turns back under the slit and the
    // slit goes. Bar: round one's bar with the slit standing at the fill's
    // head while the fill's colour turns. Button: press at 7 u = the slit
    // stands at the label's middle for the last unit and the face's film
    // ground turns a quarter under it.
    {
        key: 'slit',
        name: 'The slit stands, the film turns under it',
        see: 'A spectrometer’s slit: the spectral line stands still at the panel’s centre and the film turns under it, the panel’s whole ground a faint film turning once, so the slit shows cyan, violet, magenta, lime, cyan in turn and the edge takes the film as the turn completes; the figure takes it last. Held, then the film turns back under the slit and the slit goes. As a progress bar, the slit stands at the fill’s head while the fill’s colour turns. As a button press, the slit stands at the label’s middle and the face’s film turns a quarter under it.',
        follows:
            'The slit is the reading mark: it stands on what is being read (loading: the film turns under it until the reading is there; a live update: a quarter turn under the slit on the changed figure; hover: the slit at the control; the press: a quarter turn) and the film turning under it is the arrival; the leave is the turn back.',
        why: 'it is the instrument’s own reading (a slit over a turning film is what a spectrometer is) and the most restful of the five: the line does not travel, the colour does; but a line that stands still is not the sleek sweep you liked, and a film turning under a still mark is near titanium’s heat tint running under a fixed tool.',
        caps: [
            'In its own scene: the slit stands, the film turns under it',
            'As a progress bar: the slit at the head, the colour turns',
            'As a button press: the slit on the label, a quarter turn',
        ],
        hero: `<div class="an-hero dk-d-hero" role="img" aria-label="A spectral slit stands still at a panel's centre while a faint oxide film turns once under it"><div class="dk-d-stage">${panel('dk-d-panel an-a')}${a('', 'dk-d-slit')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-d-bar', a('', 'dk-d-bar__slit'))}</div>`,
        button: `<div class="an-btn"><span class="dk-d-btn">${button('Read the pumps', 'an-press dk-d-press', '', a('', 'dk-d-press__slit'))}</span></div>`,
    },
    // CSS: round one's sweep first, round one's turn second: the line
    // (`.dk-e-line`) sweeps the panel 0–4 u linear and lights it (edge film
    // and figure clipped in behind it, the film laid with its angle fixed
    // at cyan-top); then, with the line gone past the end, the film turns
    // once (`--an-angle` 0 → 360deg, 4–7 u, `--kp-settle`) as the second
    // beat, and settles. Out: the film turns back (0–3 u), then the line
    // sweeps back and takes the light off. Bar: round one's bar with the
    // line as the head (the fill clips in with it, 0–5 u) and then the fill's
    // colour turns once (5–7 u). Button: press at 7 u = the line sweeps the
    // face (7–7.5 u) then the edge turns a quarter (7.5–8 u).
    {
        key: 'then',
        name: 'The line sweeps, then the film turns',
        see: 'Two beats: first the spectral line sweeps the panel at an even pace and lights it, edge and figure drawn in behind it; then, the line gone past the end, the film it lit turns once round the edge and settles with cyan at the top. Held, then the turn back, then the line sweeps back and takes the light off. As a progress bar, the line is the head while the fill comes, and the fill’s colour turns once when it has landed. As a button press, the line sweeps the face and then the edge turns a quarter.',
        follows:
            'Every arrival is a sweep then a turn; a live update is a turn without a sweep (the changed figure’s film turns a quarter); loading is a sweep that never gets its turn (the line sweeps back and forth); hover is the line at the control’s start, the press a sweep and a quarter turn; the leave is the turn back and the sweep off.',
        why: 'it keeps both pictures exactly as you saw them, one after the other, so nothing of either is lost; but one after the other is two gestures, not one, so an arrival takes the time of both and a press that sweeps and then turns reads as a stutter where “lays the film down, turning” does the same in one pass.',
        caps: [
            'In its own scene: the line sweeps, then the film turns',
            'As a progress bar: the line at the head, then the colour turns',
            'As a button press: the sweep, then a quarter turn',
        ],
        hero: `<div class="an-hero dk-e-hero" role="img" aria-label="A spectral line sweeps across a panel and lights it; then the oxide film along its edge turns once"><div class="dk-e-stage">${panel('dk-e-panel an-a')}${a('move', 'dk-e-line')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-e-bar', a('', 'dk-e-bar__line'))}</div>`,
        button: `<div class="an-btn"><span class="dk-e-btn">${button('Read the pumps', 'an-press dk-e-press', a('', 'dk-e-edge'), a('move', 'dk-e-press__line'))}</span></div>`,
    },
];
