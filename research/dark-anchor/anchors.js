// Dark's candidates for its anchor element: the data demo.js builds the
// page from, and options.css draws. Dark is a spectral instrument: a
// near-black ground with a faint ruled grid, near-white ink, and ONE
// mechanism, an anodised oxide film (`--kp-iris`, cyan → violet → magenta →
// lime) whose angle turns with the pointer and runs along every edge that
// matters; parts are machined (corners cut at 45°, brackets close on
// labels); things arrive brought into register (two wavelengths converge)
// or developed in the darkroom. Each candidate is one thing the instrument
// does: the film turns, the brackets close, the slit is cut open, a spectral
// line sweeps, a line is brought into register, a print develops, the pool
// of light arrives.
//
// The other themes' anchors steered clear of: titanium's anodising bath
// (an oxide wash drifting start → end in heat order; dark's film TURNS, its
// colour changes with the angle, never with heat), cyberpunk's glitch and
// channel split (dark's register is two wavelengths converging once, no
// jitter, no tear), nostromo's raster, blueprint's brackets as corner marks
// (dark's are typographic `[` `]` that close on a label).
//
// Implementation notes for options.css: see the comment above each
// candidate. The film is `--kp-iris` from the register (a conic gradient);
// a turning film needs a registered angle: `@property --an-angle { syntax:
// '<angle>'; inherits: false; initial-value: 0deg }` and the film written as
// `conic-gradient(from var(--an-angle), var(--chart-1), var(--chart-2),
// var(--chart-3), var(--chart-4), var(--chart-1))`.

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

/** Dark's own progress bar: a chamfered ticked track, a film fill clipped to the value, a `]` bracket at its head. */
const bar = (cls, extra = '') =>
    `<div class="dk-bar ${cls}" role="progressbar" aria-label="Reading the pumps"><span class="dk-bar__track">${a('clip', 'dk-bar__fill')}<span class="dk-bar__head an-a" aria-hidden="true"></span>${extra}</span></div>`;

export const QUESTION = 'Which one element is dark’s anchor, the thing every later decision of the theme departs from?';
export const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how dark loads, arrives, points, presses, updates and leaves: forest has its tree bar, grotesk its plate falling into register, nostromo its raster. Each candidate below is only what dark’s world already owns (the instrument, its film, its brackets, its darkroom), and each is told apart from the other themes’ anchors, titanium’s bath and cyberpunk’s glitch first of all.';
export const LOOK =
    'Seven candidates for dark’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is dark to you, or “None of these” with a note.';

/**
 * @type {{ key: string, name: string, see: string, follows: string, why: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
export const ANCHORS = [
    // CSS: the panel's 1px film border (`.dk-panel::after`, padding-box card
    // over a border-box conic film) turns: `--an-angle` 0deg → 360deg over
    // 7 u on `--kp-settle`, so the colour runs once round the edge and
    // settles with cyan at the top; the figure takes the film through its
    // letters (`background-clip: text`) in the last unit. Out: the film turns
    // back. Bar: the fill is the film and its angle turns as it fills (the
    // gradient angle runs with the clip, 7 u). Button: press at 7 u = the
    // button's 2px film edge (`.dk-f-edge`, along the bottom) turns a quarter
    // turn (cyan → violet) and the `[` `]` brackets close one step on the
    // label, held; the face takes `--accent`.
    {
        key: 'film',
        name: 'The film turns',
        see: 'An instrument panel edged in the oxide film. As it arrives the film is turned once round its edge, cyan, violet, magenta, lime, and settles with cyan at the top; the figure in the panel takes the film through its letters as the turn ends. Held, then turned back. As a progress bar, the fill is the film, and its colour turns as the bar fills. As a button press, the film edge under the label turns a quarter, cyan to violet, and the brackets close a step.',
        follows:
            'Everything that happens is the film turning: an arrival is one turn, a live update a quarter turn on the changed figure’s edge, loading the film turning on and on along the waiting part, hover the edge turning toward the pointer, the press a further quarter, the leave the film turning dark. The pointer already turns the film on every edge; the anchor makes that turn the theme’s motion.',
        why: 'the film is the one thing dark already has everywhere (every border, edge, rule and fill) and it has no behaviour of its own yet: it turns with the pointer and otherwise stands still, so the anchor is found, not invented; the turn says what anodised oxide does (its colour is its angle), it is nothing of titanium’s (whose film runs in heat order and drifts, never turns), nothing of cyberpunk’s, and it gives every state one gesture.',
        caps: [
            'In its own scene: the film turns once round the panel',
            'As a progress bar: the fill’s colour turns as it fills',
            'As a button press: the edge turns a quarter, brackets close',
        ],
        hero: `<div class="an-hero dk-f-hero" role="img" aria-label="An instrument panel edged in an oxide film; the film's colour turns once round the edge and settles">${panel('dk-f-panel an-a')}</div>`,
        bar: `<div class="an-bar">${bar('dk-f-bar')}</div>`,
        button: `<div class="an-btn"><span class="dk-f-btn">${button('Read the pumps', 'an-press dk-f-press', a('', 'dk-f-edge'))}</span></div>`,
    },
    // CSS: two mono brackets `[` `]` (`.dk-k-open`, `.dk-k-close`, KP Ticker
    // Mono, 0.85em of the panel's figure size) slide in from 1.5rem outside
    // the panel's sides and close on it over 5 u on `--kp-settle` (move
    // block, x from ∓1.5rem), the panel itself appears in the first 2 u
    // (opacity 0 → 1, no blur); in the last unit the brackets take the film
    // colour. Bar: the `]` head (register) runs with the fill; a `[` stands
    // at the start. Button: press at 7 u = the register's brackets close a
    // further 0.15rem and the label scales 0.9 (the register's press), face
    // `--accent`; the brackets are drawn as `::before`/`::after` on the button
    // in the register, so the demo animates `--dk-k-gap` or translate.
    {
        key: 'brackets',
        name: 'The brackets close on it',
        see: 'A panel, and a pair of brackets, [ and ], that slide in from outside its sides and close on it, so it is held like a value in a readout; as they lock they take the film’s colour. Held, then they slide away and the panel is released. As a progress bar, a [ stands at the start and the ] runs at the head, as dark’s bar already has it. As a button press, the brackets dark’s buttons already carry close one step further on the label.',
        follows:
            'Every control is bracketed (the buttons already are); what arrives is bracketed as it lands; hover is the brackets closing, the press a step further; a live update is the brackets re-closing on the changed figure; loading is the brackets open, waiting for a value; the leave is the brackets sliding off. The switch, the wizard step, the empty state and the progress head already carry them.',
        why: 'it is dark’s most complete signature today (the button’s [ ] closing on the label, with hover, focus and press all designed), it is typographic and machined at once, and brackets that close like a readout are not blueprint’s corner marks nor cyberpunk’s reticle that hunts; but a bracket says “held”, not “light”, so the film is left as colour only, and the brackets have nothing to say on a plate, a chart or a loading surface without a label to close on.',
        caps: [
            'In its own scene: the brackets close on the panel',
            'As a progress bar: [ at the start, ] at the head',
            'As a button press: the brackets close a step further',
        ],
        hero: `<div class="an-hero dk-k-hero" role="img" aria-label="A panel; two mono brackets slide in from its sides and close on it"><div class="dk-k-stage"><span class="dk-k-open an-a an-a--move" aria-hidden="true">[</span>${panel('dk-k-panel an-a')}<span class="dk-k-close an-a an-a--move" aria-hidden="true">]</span></div></div>`,
        bar: `<div class="an-bar">${bar('dk-k-bar', '<span class="dk-k-bar__open" aria-hidden="true"></span>')}</div>`,
        button: `<div class="an-btn"><span class="dk-k-btn">${button('Read the pumps', 'an-press dk-k-press')}</span></div>`,
    },
    // CSS: the panel opens from a thin vertical slit (the tooltip's
    // `kp-sig-dark-dark-brackets-open`): clip-path from `polygon` of a 2px
    // slit at 50 % to the full chamfered polygon (two opposite corners cut
    // 1rem), 6 u on `--kp-settle`; the slit is lit in the film while narrow
    // (a 2px film line `.dk-c-slit` fades as the slit widens). Bar: the fill
    // is revealed as a slit at the start widening to the value? No: the
    // fill's chamfered end is cut as it fills (clip 7 u, the head's `]`
    // follows). Button: press at 7 u = the chamfers deepen (`--fx-notch`
    // 0.55rem → 0.8rem on the button's clip-path, last unit), face `--accent`.
    {
        key: 'slit',
        name: 'Cut open from a slit',
        see: 'A thin vertical slit of film light stands where the panel will be; the slit is cut open to both sides until the whole chamfered panel is there, its two cut corners last. Held, then it closes to the slit and goes out. As a progress bar, the fill’s chamfered end is cut as the bar fills. As a button press, the button’s two cut corners are cut deeper as the press lands.',
        follows:
            'Every plate opens as a cut (dialog, menu, tooltip already does, toast, drawer); it closes to its slit; loading is the slit standing lit; a live update is the changed figure cut again; hover is the chamfer a touch deeper, the press deeper still; the leave is the cut closing.',
        why: 'it is already how dark’s tooltip opens and it is the chamfer, dark’s one shape, in motion; but titanium cuts its panels open too (from the top, by clip), and a slit that widens is a clip of a shape, not a behaviour of the film, so loading and live updates have to borrow from elsewhere.',
        caps: [
            'In its own scene: the panel cut open from a slit',
            'As a progress bar: the chamfered end cut as it fills',
            'As a button press: the corners cut deeper',
        ],
        hero: `<div class="an-hero dk-c-hero" role="img" aria-label="A thin vertical slit of light is cut open to both sides into a chamfered panel"><div class="dk-c-stage">${panel('dk-c-panel an-a')}${a('', 'dk-c-slit')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-c-bar')}</div>`,
        button: `<div class="an-btn"><span class="dk-c-btn">${button('Read the pumps', 'an-press dk-c-press')}</span></div>`,
    },
    // CSS: a 2px vertical spectral line (`.dk-l-line`, the film as a vertical
    // gradient, with a 10px soft glow of chart-1 at 40 %) sweeps across the
    // panel from its start to its end over 7 u, linear (an instrument
    // scanning), and what it has passed is lit: the panel's film border and
    // its figure are clipped in behind the line (clip block, same 7 u). Bar:
    // the line is the head and the fill is what it leaves. Button: press at
    // 7 u = the line sweeps across the pill's face in the last unit.
    {
        key: 'line',
        name: 'The spectral line sweeps it',
        see: 'A spectrometer reads the panel: a thin vertical line of film light sweeps across it from the start at an even pace, and what the line has passed is lit, its edge and its figure drawn in behind it. Held, then the line sweeps back and takes the light with it. As a progress bar, the line is the head and the film fill is what it leaves. As a button press, the line sweeps across the face as the press lands.',
        follows:
            'Loading is the line sweeping back and forth over an empty slot (the trend’s pick, the slot is scanned); every arrival is read in by one pass; a live update is one pass over the changed figure; hover is the line resting at the control’s start, the press a pass; the leave is the pass that takes the light away. The chart’s spectrometer and the busy table’s board already read so.',
        why: 'it is the instrument’s own act (a spectral line on a slit is what a spectrometer shows), it gives one direction and one pace to the whole theme, and it reads the film as light rather than as a border; but a bright line sweeping a surface start to end is the loading picture of half the set (deco’s glint, titanium’s cutter, synthwave’s chase, the skeleton shimmer), so it tells dark apart by its colour only.',
        caps: [
            'In its own scene: the line sweeps, the panel is lit behind it',
            'As a progress bar: the line at the head',
            'As a button press: the line sweeps the face',
        ],
        hero: `<div class="an-hero dk-l-hero" role="img" aria-label="A thin vertical line of spectral light sweeps across a panel and the panel is lit behind it"><div class="dk-l-stage">${panel('dk-l-panel an-a an-a--clip')}${a('move', 'dk-l-line')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-l-bar', a('', 'dk-l-bar__line'))}</div>`,
        button: `<div class="an-btn"><span class="dk-l-btn">${button('Read the pumps', 'an-press dk-l-press', a('move', 'dk-l-press__line'))}</span></div>`,
    },
    // CSS: the figure (and the readout) start as two copies 0.22em apart
    // (text-shadow -0.22em 0 chart-3, 0.22em 0 chart-1, the glyph itself
    // transparent), blurred 3px, 0.22em low; the halves converge and the blur
    // clears over 6 u on `--kp-settle` (the register's `kp-resolve`); the
    // panel's edge resolves the same way (two offset film borders converging).
    // Bar: the fill's two copies (cyan left, magenta right, 6px apart)
    // converge as it fills. Button: press at 7 u = the label splits 0.12em
    // into its two wavelengths and resolves within the hold (a half-unit).
    {
        key: 'register',
        name: 'Brought into register',
        see: 'The panel’s figure is there as two wavelengths first, a cyan copy to one side and a magenta copy to the other, blurred and a little low; the halves converge, the blur clears, and the figure stands in white ink: the line is brought into register, the way dark’s headline already arrives. Held, then it splits again and goes. As a progress bar, the fill arrives as two copies that converge. As a button press, the label splits a hair into its two wavelengths and resolves.',
        follows:
            'Everything arrives by converging and leaves by splitting; a live update is a half-split that resolves on the changed figure; loading is a part that cannot be brought into register yet (its ghosts drift, as the skeleton’s do); hover is a hair of split, the press a little more; the checkbox and the radio already resolve so.',
        why: 'it is already dark’s headline, skeleton, checkbox and radio (ghosts of two wavelengths converging), so it is the theme’s most frequent motion; but it is the one Kenny set aside for the live update as too near cyberpunk’s glitch, and cyberpunk’s anchor is now exactly two copies (yellow and cyan) that meet, so two copies converging would make dark read as cyberpunk in other colours.',
        caps: [
            'In its own scene: the figure brought into register',
            'As a progress bar: two copies converge as it fills',
            'As a button press: the label splits a hair, resolves',
        ],
        hero: `<div class="an-hero dk-r-hero" role="img" aria-label="A panel's figure arrives as a cyan and a magenta copy that converge into one white figure">${panel('dk-r-panel an-a')}</div>`,
        bar: `<div class="an-bar">${bar('dk-r-bar', `${a('clip', 'dk-r-bar__cyan')}${a('clip', 'dk-r-bar__magenta')}`)}</div>`,
        button: `<div class="an-btn"><span class="dk-r-btn">${button('Read the pumps', 'an-press dk-r-press')}</span></div>`,
    },
    // CSS: the panel develops as a print in the darkroom: from opacity 0.2,
    // contrast(0.2) brightness(1.8) sepia(0.6) to normal over 6 u ease-out
    // (the register's `kp-sig-dark-size-develop`), while a chamfered film
    // layer over it (`.dk-d-flash`, the film at 55 %) flashes and fades to 0
    // by 5 u (the dialog's `develop`). Bar: the fill develops from a pale
    // print to the film. Button: press at 7 u = the face flashes film at
    // 35 % and develops to `--accent` in the hold.
    {
        key: 'develop',
        name: 'Developed in the darkroom',
        see: 'The panel comes up as a print in the developer: pale and washed first, under a flash of the film’s colour, then its contrast comes and the figure stands black on white; the flash is gone before the print is done. Held, then it fades back into the bath. As a progress bar, the fill develops from a pale print to the full film. As a button press, the face flashes film and develops to its pressed grey.',
        follows:
            'Every arrival develops and every leave fades into the bath (the dialog, the toast and anything that changes size already do); loading is a print that will not develop; a live update is the changed figure re-developed; hover is a touch of the flash; the press the flash. One picture from the register’s own darkroom.',
        why: 'it is already dark’s dialog, toast and resize (the develop and the flash), so it is proven, and no other theme develops; but it is a filter and a fade with a flash on top: it cannot be seen in a still, a flash on every press is the brightness change the motion gate counts, and the film is in it as a tint, not as the mechanism.',
        caps: [
            'In its own scene: the print develops under a flash',
            'As a progress bar: the fill develops',
            'As a button press: the face flashes and develops',
        ],
        hero: `<div class="an-hero dk-d-hero" role="img" aria-label="A panel comes up like a print in a developer bath, under a flash of the film's colour">${panel('dk-d-panel an-a', a('', 'dk-d-flash'))}</div>`,
        bar: `<div class="an-bar">${bar('dk-d-bar')}</div>`,
        button: `<div class="an-btn"><span class="dk-d-btn">${button('Read the pumps', 'an-press dk-d-press')}</span></div>`,
    },
    // CSS: the pointer's pool of light (`.dk-p-pool`, a 22rem × 16rem radial
    // of chart-1 at 13 % fading to transparent, the body's own pool) slides
    // from off the stage's start to centre on the panel over 6 u on
    // `--kp-settle`; the panel's edge brightens under it (border-strong →
    // the film at the top edge). Bar: the pool follows the fill's head. Button:
    // press at 7 u = the pool concentrates on the pill (its radius halves,
    // its light doubles) in the last unit.
    {
        key: 'pool',
        name: 'The pool of light arrives',
        see: 'The instrument is dark until the pool of light that follows the pointer slides over to the panel and settles centred on it; the panel’s edge brightens under the light. Held, then the pool slides away and the panel is dark again. As a progress bar, the pool follows the head of the fill. As a button press, the pool concentrates on the pill as the press lands.',
        follows:
            'Nothing moves that the reader did not move (the anatomy’s rule): the pool is the pointer’s, so hover is the pool arriving, the press its concentration, an arrival the pool finding the new part, a live update the pool glancing at the changed figure, loading a pool with nothing under it; the leave is the light sliding off.',
        why: 'it keeps the anatomy’s strictest rule (only the pointer moves things) and the pool already lives on every dark page; but it is a lamp, and a lamp lighting the part under a hand is synthwave’s brighter piece of tube and nostromo’s lamp on every switch, and a pool that slides is slow: on a press it arrives after the press has landed.',
        caps: [
            'In its own scene: the pool of light slides onto the panel',
            'As a progress bar: the pool follows the head',
            'As a button press: the pool concentrates on the pill',
        ],
        hero: `<div class="an-hero dk-p-hero" role="img" aria-label="A pool of cyan light slides over a dark instrument panel and settles on it"><div class="dk-p-stage">${a('move', 'dk-p-pool')}${panel('dk-p-panel an-a')}</div></div>`,
        bar: `<div class="an-bar">${bar('dk-p-bar', a('', 'dk-p-bar__pool'))}</div>`,
        button: `<div class="an-btn"><span class="dk-p-btn">${button('Read the pumps', 'an-press dk-p-press', a('', 'dk-p-press__pool'))}</span></div>`,
    },
];
