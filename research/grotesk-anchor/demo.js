// What is grotesk's anchor element (Kenny, 2026-10-07 18:13: every theme gets
// ONE recognisable anchor element, the thing every later decision of the
// theme departs from; forest: the tree progress bar, titanium: the new loading
// animation, cyberpunk: the glitch, solstice: the sun on its arc; the colours
// are already right and are the shared base). Grotesk's candidate so far is
// the loading Out of register (themes/grotesk/CHARACTER.md G10, G11); Kenny
// asked for more options.
//
// A review-kit demo in aspect mode, grotesk only, with ONE aspect (one page in
// the dialog) and five candidates, each drawn only from what grotesk's world
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

/* 2 · out of register */
const register = {
    hero: `<div class="ga-hero ga-r-hero" role="img" aria-label="A registration mark and a heading proof, each printed in two plates; the red plate travels round the ink and registers"><span class="ga-r-mark"></span><span class="ga-r-proof"></span></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-r-track"></div></div>`,
    button: `<div class="ga-btn"><span class="ga-r-btn">${button('Depart', 'ga-press')}</span></div>`,
};

/* 3 · the twelve columns */
const columns = {
    hero: `<div class="ga-hero" role="img" aria-label="Twelve columns laid one after another, then a page set into them piece by piece"><div class="ga-c-stage">${a('clip', 'ga-c-grid')}${a('clip', 'ga-c-piece ga-c-piece--head')}${a('clip', 'ga-c-piece ga-c-piece--a')}${a('clip', 'ga-c-piece ga-c-piece--b')}${a('clip', 'ga-c-piece ga-c-piece--c')}${a('clip', 'ga-c-piece ga-c-piece--red')}</div></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><div class="ga-c-bar">${a('clip', 'ga-c-bar__fill')}</div></div>`,
    button: `<div class="ga-btn">${button('Depart', 'ga-c-press', a('clip', 'ga-c-fill'))}</div>`,
};

/* 4 · the train on time */
const STATIONS = ['07:32', '07:41', '07:46', '07:58', '08:07'];
const track = (mod, labels) =>
    `<div class="ga-t-track ga-t-track--${mod}"><span class="ga-t-rail"></span>${a('', 'ga-t-trail')}${STATIONS.map(
        (t, i) => `<span class="ga-t-st" style="--at: ${i * 25}%">${labels ? `<i>${t}</i>` : ''}</span>`,
    ).join('')}${a('', 'ga-t-car')}</div>`;
const train = {
    // The carriage and the trail run their own keyframes (stops at the stations), not a building block.
    hero: `<div class="ga-hero" role="img" aria-label="A red train runs along a rule at an even pace and stops dead at every station">${track('hero', true)}</div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable">${track('bar', false)}</div>`,
    button: `<div class="ga-btn"><span class="ga-t-btn">${button('Depart', 'ga-press')}<span class="ga-t-lane"><span class="ga-t-lane__car" aria-hidden="true"></span></span></span></div>`,
};

/* 5 · the colour bands */
const strip = () => a('move', 'ga-n-strip');
const bands = {
    hero: `<div class="ga-hero" role="img" aria-label="Three flat bands, red, ink and paper, sweep across a still poster and print it behind them"><span class="ga-n-print"><span class="ga-n-poster"><i>07:32 · platform 7</i><b>Basel SBB</b></span>${strip()}</span></div>`,
    bar: `<div class="ga-bar" role="progressbar" aria-label="Reading the timetable"><span class="ga-n-print ga-n-print--bar"><span class="ga-n-bar"></span>${strip()}</span></div>`,
    button: `<div class="ga-btn"><span class="ga-n-print ga-n-print--pass">${button('Depart', 'ga-press')}${strip()}</span></div>`,
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
        name: 'Out of register: the proof’s red plate (your graph loading, as built)',
        see: 'The black proof stands where the reading will be; a red plate travels round it at an even pace (the registration mark, a heading and its lines, the bar’s ruled track), snaps into register under the ink, dwells for 4 units and slips off again: 22 units, exactly your graph’s loading. On the button the red plate orbits while the finger comes and registers when the press lands.',
        follows: 'Every waiting part is a proof (G10), the spinner is the register mark (G11), the skeleton and the busy bar are proofs, arrival is the last registration. Hover, focus, the live update and the leave do not follow from two plates by themselves: they stay the baseline’s, the train’s and the bands’.',
        verdict: not(
            'it is your own pick and a lovely loading picture, the strongest runner-up, but it speaks for waiting only; nothing in a hover or a press is a second plate that is not forced. Keep it as the loading picture whichever anchor you pick.',
        ),
        caps: ['In its own scene: a mark and a heading, proofed', 'As a progress bar: the track over its slipped fill', 'As a button press: the plate orbits, then registers'],
        ...register,
    },
    {
        key: 'columns',
        name: 'The twelve columns: the grid sets the layout',
        see: 'Twelve hairline columns are laid from the start, one at a time, then the page is set into them piece by piece, each piece stopping flush on its columns (counted steps, nothing eases). The progress bar is twelve cells, ten of them filled one by one; the button’s face fills with its grey four columns at a time.',
        follows: 'Every motion is counted in columns (steps), arrivals are set column by column, data stands on the grid, a change is a column marked, the leave takes the columns back in reverse. Hover and press have no natural form here: the baseline would have to be borrowed.',
        verdict: not(
            'the grid is already grotesk’s texture under every page and stays the ground whatever anchor you pick; as the anchor it is quiet and counted (stepping blocks are also how nostromo’s lamp bank and terminal’s cells move), and a grid says where things go, not what is happening.',
        ),
        caps: ['In its own scene: the page set on the grid', 'As a progress bar: twelve cells filled', 'As a button press: the face filled by columns'],
        ...columns,
    },
    {
        key: 'train',
        name: 'The train on time: it stops dead at every station',
        see: 'A red three-car train runs along a rule at an even pace, stops dead for one unit at each station and goes on, a heavy rule laid behind it; it dwells at the terminus and runs back. The progress bar is the same train between five stations; on the button the train runs once under the face and the press lands as it arrives.',
        follows: 'A changed value is passed by the train (G9, your graph’s pick), loops dwell at their stations (G1), progress is stations passed, the leave is the train gone. Hover and focus would need a station of their own.',
        verdict: not(
            'it is the timetable itself and the dwell is no other theme’s, but a mark running along a line is how forest, solstice and nostromo already load, and it has no hover or press of its own; it stays the live update, not the whole theme.',
        ),
        caps: ['In its own scene: the train between five stations', 'As a progress bar: the train between stations', 'As a button press: the train arrives, the press lands'],
        ...train,
    },
    {
        key: 'bands',
        name: 'The colour bands: red, ink and paper pass over it',
        see: 'Three flat bands, red, ink and paper, sweep across a still part and print it behind them; taken off, they sweep back toward the start. The poster is printed, the progress bar is printed, and on the button the bands pass over the face and leave it pressed. Your leave (2026-10-04) played forwards and backwards.',
        follows: 'Every opening is the bands backwards (G3), every leave is the bands (G12), a part that waits is printed when it arrives. Hover, focus, the press and the live update have no form in it.',
        verdict: not(
            'it is the boldest picture and your own leave, but it is an entrance and an exit, not a state: nothing about waiting, pointing or pressing follows from it, and cyberpunk’s glitch also slices a part sideways; keep it as the leave and the opening.',
        ),
        caps: ['In its own scene: a poster printed by the bands', 'As a progress bar: a bar printed by the bands', 'As a button press: the bands pass, the face is pressed'],
        ...bands,
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
lookLine.textContent = `Five candidates for grotesk’s anchor, each shown in its own scene, as a progress bar and as a button press; the first is the recommendation. Pick the one that is grotesk to you, or “None of these” with a note.`;
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
