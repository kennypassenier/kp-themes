// What is grotesk's anchor element (Kenny, 2026-10-07 18:13: every theme gets
// ONE recognisable anchor element, the thing every later decision of the
// theme departs from; forest: the tree progress bar, titanium: the new loading
// animation, cyberpunk: the glitch, solstice: the sun on its arc; the colours
// are already right and are the shared base). Grotesk's candidate so far is
// the loading Out of register (themes/grotesk/CHARACTER.md G10, G11); Kenny
// asked for more options.
//
// A review-kit demo in aspect mode, grotesk only, with ONE aspect (one page in
// the dialog) and five candidates (round two: Kenny kept The baseline and Out
// of register, wanted the second refined without its crosshairs and the skeleton
// text as its hero, and asked for more in the same family), each drawn only from what grotesk's world
// already owns. Each OPTION is a live scene with three places, so the reviewer
// sees whether the anchor carries the theme: the anchor in its own scene
// (centred, large), the same anchor as a progress bar, and as a button press.
// The first option is the recommendation.
//
// The page's one clock writes `data-ga-phase` (gap, in, hold, out) on every
// scene; options.css keys every motion to it. The clock only writes
// attributes, it never reads layout; Replay restarts it, the speed buttons
// stretch every duration by 2 or 4, and the dialog's Pause stops it.

/* ----------------------------------------------------------- the parts */

/** A package button; `inner` goes before its label (a fill, a lane). */
const button = (label, cls = '', inner = '') =>
    `<button type="button" class="kp-button ${cls}">${inner}<span class="kp-button__label">${label}</span></button>`;

/** A drawn part: its class carries the building block (scale, clip or move), or none when it runs its own keyframes. */
const a = (block, cls = '') => `<span class="ga-a${block ? ` ga-a--${block}` : ''} ${cls}" aria-hidden="true"></span>`;

/** The anchor's place in its scene. */
const place = (cap, html, cls = '') => `<div class="ga-part ga-part--${cls}"><p class="ga-cap">${cap}</p>${html}</div>`;

/* 1 · the baseline */
const bWord = (text, mod) =>
    `<span class="ga-b-word ga-b-word--${mod}"><span class="ga-b-ghost">${text}</span><span class="ga-b-ink ga-a ga-a--clip" aria-hidden="true">${text}</span>${a('scale', 'ga-b-rule')}</span>`;

/** The skeleton text every plate-and-ink candidate is shown on: a heading bar and five lines, each on a row of its own. */
const skeleton = (cls = '', row = '') => `<div class="ga-sk ${cls}" aria-hidden="true">${`<i class="${row}"></i>`.repeat(6)}</div>`;

/* 2 · out of register */
const register = {
    hero: `<div class="ga-hero" role="img" aria-label="Skeleton text printed in two plates: the red plate has slipped, travels round the ink in a closing spiral and falls into register"><div class="ga-stack ga-r-stack">${skeleton('ga-r-plate')}${skeleton()}</div></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-r-track"></div></div>`,
    button: `<div class="ga-btn"><span class="ga-r-btn">${button('Depart', 'ga-press')}</span></div>`,
};

/* 3 · overprint */
const overprint = {
    hero: `<div class="ga-hero" role="img" aria-label="Skeleton text in grey; a plate of red passes over it and where it lies on the text the two inks multiply into a deeper red"><div class="ga-o-stage">${skeleton()}${a('move', 'ga-o-plate')}</div></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-o-track">${a('move', 'ga-o-plate')}</div></div>`,
    button: `<div class="ga-btn"><span class="ga-o-btn">${button('Depart', 'ga-press')}${a('move', 'ga-o-plate')}</span></div>`,
};

/* 4 · reversed out */
const reversed = {
    hero: `<div class="ga-hero" role="img" aria-label="Skeleton text in ink on paper; a field of red is set behind it row by row and the text is reversed out of it, paper on red"><div class="ga-v-stage">${skeleton()}${skeleton('ga-sk--rev ga-sk--rows', 'ga-a ga-a--clip')}</div></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-v-track"><span></span>${a('clip', 'ga-v-track__rev')}</div></div>`,
    button: `<div class="ga-btn"><span class="ga-v-btn">${button('Depart')}<span class="kp-button ga-v-inv ga-a ga-a--clip" aria-hidden="true"><span class="kp-button__label">Depart</span></span></span></div>`,
};

/* 5 · jogged into register */
const jogged = {
    hero: `<div class="ga-hero ga-j-hero" role="img" aria-label="Skeleton text drawn as ink keylines with the red fill printed off to one side; row by row the red fill is jogged home in four counted steps and stops in register"><div class="ga-stack">${skeleton('ga-j-red ga-sk--rows', 'ga-a ga-a--move')}${skeleton('ga-sk--line')}</div></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-j-track">${a('move', 'ga-j-slide')}<span></span></div></div>`,
    button: `<div class="ga-btn"><span class="ga-j-btn">${a('move', 'ga-j-slide')}${button('Depart')}</span></div>`,
};

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * The question and its candidates, recommended first. `follows` says what the
 * rest of the theme would be (hover, press, arrival, live, leave).
 * @type {{ key: string, name: string, see: string, follows: string, verdict: string, caps: [string, string, string], hero: string, bar: string, button: string }[]}
 */
const ANCHORS = [
    {
        key: 'baseline',
        name: 'The baseline: the red rule the type stands on',
        see: 'A word set in heavy type, ghosted; the red baseline is drawn under it from the start at an even pace and every letter it passes takes the ink (the p’s descender crosses the rule). It stops dead, dwells, and is drawn back. As a progress bar, the label’s own baseline fills and inks the words. As a button press, the rule is drawn at once, then thickens downward into the deeper red as the face goes grey.',
        follows: 'Hover draws the baseline (scope-12, as decided), the press thickens it (G14), a changed value is passed by the train along its baseline (G9), a warning is indexed down the edge of the same line of type (G13), arrivals are set along their line (G2), loading is the baseline drawn under the words that are coming.',
        verdict: rec(
            'it is the one thing grotesk’s controls already do on every hover and press, so hover, press, focus, live update and loading all depart from it without a new idea; it reads at a glance as Swiss type standing on its line; and no other theme owns it (blueprint’s dimension line runs between two points with arrowheads, forest’s and solstice’s marks run along a foot, here the line sets the type).',
        ),
        caps: ['In its own scene: a word on its baseline', 'As a progress bar: the label’s baseline fills', 'As a button press: the rule drawn, then thickened'],
        hero: `<div class="ga-hero" role="img" aria-label="A word in heavy type; a red baseline is drawn under it and the letters take the ink as it passes">${bWord('Departures', 'hero')}</div>`,
        bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable">${bWord('Reading the timetable', 'bar')}</div>`,
        button: `<div class="ga-btn"><span class="ga-b-press">${button('Depart', 'ga-press')}</span></div>`,
    },
    {
        key: 'register',
        name: 'Out of register: the red plate falls into register',
        see: 'Skeleton text, the loading placeholder, printed in two plates: the ink, and under it the same text in red. The red plate has slipped and travels round the ink in a spiral that closes at an even pace, falls into register in the last unit, dwells there for 4 units (the station clock’s stop-to-go) and is released the way it came, the spiral opening again. Nothing else is drawn: no mark, no ring, no cross. The progress bar is the ruled track printed over its slipped red fill, and the red outline behind the button falls into register as the press lands.',
        follows: 'Every waiting part is a proof (G10): the skeleton is the hero, the busy bar and the spinner are proofs too, arrival is the last registration. Hover, focus, the live update and the leave do not follow from two plates by themselves: they stay the baseline’s, the train’s and the bands’.',
        verdict: not(
            'it is your graph pick refined (the spiral closes instead of circling at a constant distance, and the register mark is gone) and the strongest runner-up, but it speaks for waiting only. Keep it as the loading picture whichever anchor you pick.',
        ),
        caps: ['In its own scene: the skeleton text, proofed', 'As a progress bar: the track over its slipped fill', 'As a button press: the plate falls into register'],
        ...register,
    },
    {
        key: 'overprint',
        name: 'Overprint: red printed over the text',
        see: 'The skeleton text is set in a mid grey. A plate of red, three of the twelve columns wide, enters from the start and passes over it at an even pace, stops dead at the end, dwells and returns. It lies over the ink, not under it: where it covers a bar the two inks multiply into a deeper red, where it covers the paper it is the plain red. As a progress bar, the plate crosses the grey track; on the button it crosses the face and the face turns grey under it.',
        follows: 'A thing that is being read or worked on is overprinted by the red plate; a changed value is overprinted for a beat; hover would lay the plate on the label. Arrival and leave still need the bands, and a wait needs a second plate that slips.',
        verdict: not(
            'it is the only candidate where the colours mix, which no other theme can say, but a block travelling across text is how every shimmer skeleton loads, so it needs the deeper red to be seen; and it has no hover, focus or press of its own.',
        ),
        caps: ['In its own scene: a red plate overprints the text', 'As a progress bar: the plate crosses the track', 'As a button press: the plate crosses the face'],
        ...overprint,
    },
    {
        key: 'reversed',
        name: 'Reversed out: the text knocked out of a red field',
        see: 'The skeleton text stands in ink on paper. A field of red is set behind it row by row from the start, the heading first and each line a beat behind it, so the front is a staircase, and the text is reversed out of it: ink on paper becomes paper on red. Everything stops dead and dwells, then the field is taken off in the same rows backwards. As a progress bar, the red grows from the start and the track’s columns reverse with it; on the button the face is reversed out when the press lands.',
        follows: 'Hover is a part reversed (the coloured buttons already mirror-invert on hover), a current item stands reversed in its row, a warning is a reversed row, the alarm poster is the whole window reversed. Loading and arrival need other ideas.',
        verdict: not(
            'it is the Swiss poster move and the only polarity change among the candidates, and grotesk’s buttons already do it, but it is a state of a part, not a movement, and a red field growing behind a heading reads close to the colour bands you did not choose.',
        ),
        caps: ['In its own scene: the text reversed out of a red field', 'As a progress bar: the red field grows, the track reverses', 'As a button press: the face is reversed out'],
        ...reversed,
    },
    {
        key: 'jogged',
        name: 'Jogged into register: the red fill is knocked home in four stops',
        see: 'The classic misprint, put right. The skeleton text is only its black keylines, and the red fill has been printed a hand’s width off, so each bar shows a red edge on one side and a white gap on the other. Row by row from the heading down, the red fill is jogged home into its keyline in four counted stops, each stop held, until every row is filled in register; it dwells, and is jogged out again in the same four stops. The black never moves. The progress bar’s red fill is jogged home under its ruled track; on the button the fill is jogged home as the press lands.',
        follows: 'Whole things are counted, as the resize’s three cuts and the meter’s ticks already are (G1); a new value is jogged home; arrival is a part knocked into register against its guide; a finished part is filled red. Hover and focus would need a plate of their own.',
        verdict: not(
            'it is the most mechanical, press-room reading of the effect you liked (counted, one row after another, a keyline that waits for its colour), but it says the same thing as option 2 in a different gait, and cyberpunk’s glitch also splits copies in ticks, though it jitters and this only closes.',
        ),
        caps: ['In its own scene: each row jogged home in four stops', 'As a progress bar: the fill jogged under the track', 'As a button press: the plate jogged home'],
        ...jogged,
    },
];

/* ---------------------------------------------------- the review kit's text */

const QUESTION = 'Which one element is grotesk’s anchor, the thing every later decision of the theme departs from?';
const WHY =
    'Colours are settled and shared. The anchor is the one recognisable element that decides how grotesk loads, arrives, points, presses, updates and leaves: forest has its tree bar, titanium its loading, cyberpunk its glitch, solstice its sun. Each candidate below is only what grotesk’s world already owns, and each is told apart from the other themes’ anchors.';

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="grotesk-anchor"]'));
section.setAttribute('data-ga-show', 'all');
// Each hint repeats the question and says what the option shows and why it is or is not recommended: the dialog shows only the hint of the option on screen.
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'anchor',
            label: 'The anchor element',
            options: ANCHORS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${QUESTION} ${o.see} ${o.follows} ${o.verdict}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'grotesk');
lookLine.textContent = `Round two, five candidates for grotesk’s anchor (the baseline and out of register stay, the other three are new), each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is grotesk to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-ga-aspects]'));
const box = document.createElement('section');
box.className = 'ga-aspect';
box.id = 'ga-anchor';
box.setAttribute('data-ga-aspect', 'anchor');
box.setAttribute('aria-labelledby', 'h-ga-anchor');
box.innerHTML = `<div class="ga-aspect__head"><h3 id="h-ga-anchor"><span class="ga-aspect__no">1</span> The anchor element</h3>
    <p class="ga-aspect__q"></p><p class="ga-aspect__why"></p></div><div class="ga-options"></div>`;
/** @type {HTMLElement} */ (box.querySelector('.ga-aspect__q')).textContent = QUESTION;
/** @type {HTMLElement} */ (box.querySelector('.ga-aspect__why')).textContent = WHY;
const options = /** @type {HTMLElement} */ (box.querySelector('.ga-options'));
ANCHORS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'ga-col';
    col.setAttribute('data-ga-option', String(at + 1));
    col.innerHTML = `<p class="ga-label-row"><span class="ga-label-row__no">${at + 1}</span> <span class="ga-label-row__name"></span>${
        at === 0 ? ' <span class="ga-label-row__rec">Recommended</span>' : ''
    }</p><p class="ga-see"></p><p class="ga-follows"></p><p class="ga-verdict"></p>
    <div class="ga-scene" data-ga-kind="cycle" data-ga-anchor="${o.key}" data-ga-phase="hold">${place(o.caps[0], o.hero, 'hero')}${place(o.caps[1], o.bar, 'bar')}${place(o.caps[2], o.button, 'button')}</div>`;
    /** @type {HTMLElement} */ (col.querySelector('.ga-label-row__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.ga-see')).textContent = o.see;
    /** @type {HTMLElement} */ (col.querySelector('.ga-follows')).textContent = `What follows from it: ${o.follows}`;
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.ga-verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('ga-verdict--rec', at === 0);
    options.append(col);
});
rows.append(box);

/* ---------------------------------------------------------- the one clock */

// One cycle in units of 120 ms (the register's --fx-duration, G4): `gap` (the
// parts are not drawn), `in` (8: they are drawn), `hold` (4: the dwell, the
// station clock's stop-to-go, the press held), `out` (8: the drawing played
// backwards). 22 units, the graph's Out of register period. The clock counts
// only the time the dialog's Pause (Space) leaves running, so a paused scene
// stands exactly where it was.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-ga-motion]');
const UNIT = 120;
const PHASES = /** @type {const} */ ([
    ['gap', 2],
    ['in', 8],
    ['hold', 4],
    ['out', 8],
]);
const scenes = [...section.querySelectorAll('.ga-scene')];
let slow = 1;
let at = 0;
let elapsed = 0;
let last = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) scene.setAttribute('data-ga-phase', phase);
}

function tick() {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (dialogPaused()) return;
    elapsed += dt;
    if (elapsed < PHASES[at][1] * UNIT * slow) return;
    at = (at + 1) % PHASES.length;
    elapsed = 0;
    setPhase(PHASES[at][0]);
}

/** Starts a cycle at its gap. */
function run() {
    clearInterval(timer);
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    at = 0;
    elapsed = 0;
    last = performance.now();
    setPhase(PHASES[0][0]);
    timer = window.setInterval(tick, 20);
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
radio('data-ga-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--ga-slow', String(slow));
    run();
});
radio('data-ga-show', (value) => {
    section.setAttribute('data-ga-show', value);
});
document.querySelector('[data-ga-replay]')?.addEventListener('click', () => run());

// The buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.ga-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run();
};
reduced.addEventListener('change', syncMotion);
syncMotion();
