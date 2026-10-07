// Synthwave's anchor element (Kenny, 2026-10-07: "ik wil voor synthwave meer
// opties voor het ankerelement"). The anchor is the one recognisable element
// from which every decision about the whole theme is made (forest's tree bar,
// titanium's loading animation, cyberpunk's glitch, solstice's sun, nostromo's
// LED bank, brutalism's slab, blueprint's dimension line, terminal's cursor).
// Colours are already right in every theme and are the base; the anchor is a
// SHAPE + MOTION.
//
// A review-kit demo in aspect mode, synthwave only, ONE aspect ("anchor") with
// six options, one per page in the dialog. Each option is a board: the element
// alone in the middle of its stage (away, arriving, standing, leaving), the
// same element as a loading indicator (busy, progress) and three tiny chips
// (a button press, a card arriving, a toast leaving). options.css draws every
// candidate, scoped by `data-sa-anchor="<key>"` on the board.
//
// The one clock below writes `data-sa-phase` (gap, in, hold, out) on every
// board; the CSS keys every arrival to it and plays every leave as the same
// keyframes backwards over the same span (animation-direction: reverse with
// the delays mirrored), so arriving and leaving are exact reverses. The
// clock only writes attributes; it never reads layout.

/* ------------------------------------------------------------- the texts */

/** The single question of the page, its six candidates and what each one says. */
const ASPECT = {
    id: 'anchor',
    label: 'The anchor element',
    question: 'Which element is synthwave’s anchor: the one every other decision about the theme is made from?',
    why: 'Colours are already right and are the base. The anchor is a shape and a motion that has to carry a loading state, an arrival, a leave and a press, in a world that is horizontal, square-cut, radius 2 px, and never flickers.',
};

const OPTIONS = [
    {
        key: 'horizon',
        name: 'The neon horizon',
        see: 'One neon tube is struck outward from the centre across the stage while the grid floor runs toward it; the object rises over the tube and sets behind it, and the tube’s lit length is the progress.',
        why: 'It carries the theme because every panel already rises over its horizon line and every leave already sets behind it, so a progress, an arrival and a leave are one picture. Already shown by: every panel’s horizon line and the floor under every plate.',
        overlap:
            'Overlap: solstice has a horizon line (divider, busy glow) and nostromo strikes a tube from a line; the floor running to it and the rise over it are synthwave’s alone.',
    },
    {
        key: 'ridge',
        name: 'The wireframe ridge',
        see: 'A neon wireframe mountain range is drawn on the horizon from left to right and its valleys fill with the floor grid; the object stands in front of it, and the progress is how much of the ridge is drawn.',
        why: 'It is the most pictorial candidate, the sleeve of an outrun record, and it carries the neon line and the floor; it needs room and shrinks badly into a button or a toast. Already shown by: nothing in the package draws mountains (the nearest cousin is the network graph’s grid-floor constellation, which is not touched).',
        overlap: 'Overlap: none, no other theme draws a ridge.',
    },
    {
        key: 'vcr',
        name: 'The VCR on-screen display',
        see: 'Chunky pixel type on the dark: PLAY ▶, a segmented tape counter and a blocky SP/LP bar are typed in step by step; the tracking bar is the progress. No noise, no flicker, only steady blocks.',
        why: 'It promotes a part that already exists, the OSD voice (VT323 labels, the tooltip typed in, G15 of the grammar), into the one element everything is made from. Already shown by: the tooltip and every label.',
        overlap:
            'Overlap: typed-in text is also cyberpunk’s typed number, nostromo’s typed figure and terminal’s typed cells; the VCR furniture (PLAY, counter, SP/LP, tracking bar) is synthwave’s.',
    },
    {
        key: 'chrome',
        name: 'The chrome plate',
        see: 'An 80s chrome wordmark split by a hard horizon line into a sky half and a mirrored half; a glint runs along the line. Loading is the glint sweeping the plate, and the progress is the reflection line rising through it.',
        why: 'It carries the theme through the “chrome over the grid” shape you approved (a lit bevel, a shaded foot), made the element itself. Already shown by: every reporting plate. Weakest on a phone and inside a button, because the mirrored half needs a big wordmark.',
        overlap:
            'Overlap: cyberpunk has a chrome gloss on its tiles and a chrome wipe on its chart; here the glint is a horizontal streak on the horizon line, never a diagonal sweep.',
    },
    {
        key: 'slat',
        name: 'The slat cut (venetian blind)',
        see: 'Everything is revealed and hidden by horizontal slats that open like blinds, the gaps widening toward the foot the way the sun’s stripes widen. Loading is a rolling wave through the slats; the progress is how many slats are open.',
        why: 'It makes the one existing cut, the sun’s stripes, the anchor. Already shown by: the sunset leave cut by stripes and the button’s sun cut. The slats stay as hairlines when open, so the object always carries some stripes.',
        overlap: 'Overlap: no other theme cuts in horizontal slats; nostromo’s vent slots are the nearest.',
    },
    {
        key: 'marquee',
        name: 'The marquee frame',
        see: 'Arcade marquee bulbs round the perimeter of a sign frame light one after the other as it arrives. Loading is the chase round the frame; the progress is the lit arc of the frame.',
        why: 'It is the loading family you approved (the marquee chases along the top edge) stretched to a frame, so it adds the least that is new. Already shown by: every waiting part. The bulbs switch in hard steps; only light does.',
        overlap: 'Overlap: nostromo’s LED bank is a row of lamps; this is a ring round an object, and it is the marquee that is already synthwave’s.',
    },
];

const CHIP = {
    press: ['Button press.', 'The button stays; the element answers it.'],
    card: ['Card arriving.', 'The card comes in with the element.'],
    toast: ['Toast leaving.', 'It arrives, and leaves the same way back.'],
};

/* ---------------------------------------------------------- the objects */

/** What stands in the middle of the element, per use. */
const TEXT = {
    stage: { title: 'Sync complete', body: '▶ 18 240 files' },
    card: { title: 'Node 01', body: '▶ 4.2 Gb/s' },
    toast: { title: '▶ Saved', body: '' },
    busy: { title: 'Syncing', body: '▶ Working' },
    progress: { title: 'Syncing', body: '▶ <span class="sa-pct"></span>' },
};

/** The object as a tape plate with its stripe. */
const plate = (kind, arr, textArr = '') => {
    const t = TEXT[kind];
    return `<span class="sa-obj sa-obj--${kind} ${arr}"><span class="sa-obj__title ${textArr}">${t.title}</span>${
        t.body ? `<span class="sa-obj__body ${textArr}">${t.body}</span>` : ''
    }</span>`;
};

/** The press chip's object: the package's own button, there all along; the element answers it. */
const pressButton = () =>
    `<button type="button" class="kp-button kp-button--primary kp-button--sm sa-btn sa-arr sa-k-dip" tabindex="-1">Drive</button>`;

const subject = (kind, arr) => (kind === 'press' ? pressButton() : plate(kind, arr));

/* ------------------------------------------------- the six drawn elements */

const RIDGE = '0,50 14,42 26,48 44,30 56,38 70,22 84,34 94,12 100,4 106,12 118,34 132,24 146,38 160,28 176,42 188,36 200,50';
const RIBS =
    'M100 4 L88 50 M100 4 L112 50 M94 12 L76 50 M106 12 L124 50 M70 22 L58 50 M70 22 L84 50 M132 24 L118 50 M132 24 L148 50 M44 30 L32 50 M44 30 L58 50 M160 28 L148 50 M160 28 L174 50';

/** The marquee's bulbs: 12 along the top and bottom, 4 down each side, numbered clockwise from the top start. */
function bulbs() {
    const cols = 12;
    const rows = 6;
    const cells = [];
    for (let c = 1; c <= cols; c += 1) cells.push([1, c]);
    for (let r = 2; r <= rows - 1; r += 1) cells.push([r, cols]);
    for (let c = cols; c >= 1; c -= 1) cells.push([rows, c]);
    for (let r = rows - 1; r >= 2; r -= 1) cells.push([r, 1]);
    return cells
        .map(
            ([r, c], k) =>
                `<i class="sa-m-bulb" style="grid-area: ${r} / ${c}; --k: ${k}; --ph: ${k % 4}"><b class="sa-arr sa-k-fade" style="--d: ${k * 20}ms"></b></i>`,
        )
        .join('');
}

const CHROME_WORD = { stage: 'SYNCED', card: 'NODE 01', toast: 'SAVED', press: 'DRIVE', busy: 'SYNC', progress: 'SYNC' };

/** The chrome plate is the object itself: sky half, mirrored half, the line and its glint. */
function chromePlate(kind) {
    const word = CHROME_WORD[kind];
    const t = TEXT[kind];
    const still = kind === 'press';
    const sky = still ? '' : 'sa-arr sa-k-clipx';
    return `<span class="sa-obj sa-obj--chrome">
        <span class="sa-c-word"><span class="sa-c-sky ${sky}">${word}</span><span class="sa-c-mir sa-arr sa-k-clipup" aria-hidden="true"><span>${word}</span></span><span class="sa-c-linebox sa-arr sa-k-lift" aria-hidden="true"><i class="sa-c-line sa-arr sa-k-draw"></i><i class="sa-c-glint sa-arr sa-k-glint"></i></span></span>
        ${t && t.body && !still ? `<span class="sa-obj__body sa-arr sa-k-fade">${t.body}</span>` : ''}
    </span>`;
}

/** Each candidate's parts for one use of it; options.css draws them. */
const PARTS = {
    horizon: (kind) =>
        `<i class="sa-h-haze sa-arr sa-k-fade"></i><i class="sa-floor sa-arr sa-k-clipc"><b></b></i><span class="sa-h-gate">${subject(kind, 'sa-arr sa-k-rise')}</span><i class="sa-h-far sa-arr sa-k-draw"></i><i class="sa-h-tube sa-arr sa-k-draw"></i>`,
    ridge: (kind) =>
        `<i class="sa-floor sa-arr sa-k-fade"><b></b></i><span class="sa-r-box"><i class="sa-r-valley sa-arr sa-k-clipx"><b></b></i><svg class="sa-r-ribs sa-arr sa-k-clipx" viewBox="0 0 200 50" aria-hidden="true"><path d="${RIBS}" fill="none"/></svg><svg class="sa-r-svg" viewBox="0 0 200 50" aria-hidden="true"><polyline class="sa-r-ghost" points="${RIDGE}" fill="none" pathLength="1"/><polyline class="sa-r-line sa-arr sa-k-dash" points="${RIDGE}" fill="none" pathLength="1"/><polyline class="sa-r-pulse" points="${RIDGE}" fill="none" pathLength="1"/></svg></span><span class="sa-r-slot">${subject(kind, 'sa-arr sa-k-clipx')}</span>`,
    vcr: (kind) => {
        const live = kind === 'busy' || kind === 'progress';
        return `<span class="sa-v-play sa-arr sa-k-clipx">PLAY <b>▶</b></span><span class="sa-v-count sa-arr sa-k-clipx"><s>88:88:88</s><i>${live ? '' : '00:12:48'}</i></span><span class="sa-v-slot">${subject(kind, 'sa-arr sa-k-clipx')}</span><span class="sa-v-bar sa-arr sa-k-clipx"><em>SP</em><span class="sa-v-blocks"><u></u></span><em>LP</em></span>`;
    },
    chrome: (kind) => `<span class="sa-c-slot">${chromePlate(kind)}</span>`,
    // The words stand above the slats once they are open, so the stripes never cut a letter:
    // they come in over the opening blind, a little after it starts.
    slat: (kind) => {
        const lit = 'sa-arr sa-k-fade';
        const object = kind === 'press' ? `<span class="sa-s-lift ${lit}">${pressButton()}</span>` : plate(kind, '', lit);
        const slats = [...Array(10).keys()].map((i) => `<i class="sa-s-slat sa-arr sa-k-slat" style="--i: ${i}"></i>`).join('');
        return `<span class="sa-s-wrap">${object}<span class="sa-s-slats" aria-hidden="true">${slats}</span><i class="sa-s-rail sa-s-rail--top sa-arr sa-k-draw"></i><i class="sa-s-rail sa-s-rail--bottom sa-arr sa-k-draw"></i></span>`;
    },
    marquee: (kind) =>
        `<span class="sa-m-sign"><span class="sa-m-frame" aria-hidden="true">${bulbs()}</span><span class="sa-m-slot">${subject(kind, 'sa-arr sa-k-clipv')}</span></span>`,
};

/** The element in one of its uses: stage, busy, progress or a chip (press, card, toast). */
function anchor(key, view, kind) {
    const chip = view === 'chip' ? ` data-sa-chip="${kind}"` : '';
    return `<div class="sa-anchor" data-sa-view="${view}"${chip}><i class="sa-mark" aria-hidden="true"></i>${PARTS[key](kind)}</div>`;
}

/** One board: stage, loading pair, three chips; the scene the clock and measure-motion.mjs drive. */
function board(key) {
    const chips = ['press', 'card', 'toast']
        .map(
            (kind) => `<div class="sa-part sa-part--chip">
            <p class="sa-cap"><b>${CHIP[kind][0]}</b> ${CHIP[kind][1]}</p>
            <div class="sa-stage sa-stage--chip">${anchor(key, 'chip', kind)}</div>
        </div>`,
        )
        .join('');
    return `<div class="sa-part sa-part--stage">
            <p class="sa-cap"><b>At rest and arriving.</b> The element alone in the middle of its stage: it arrives, stands and leaves by itself.</p>
            <div class="sa-stage">${anchor(key, 'stage', 'stage')}</div>
        </div>
        <div class="sa-part sa-part--loads">
            <div class="sa-load">
                <p class="sa-cap"><b>Busy.</b> Loading with no end known.</p>
                <div class="sa-stage sa-stage--mini">${anchor(key, 'busy', 'busy')}</div>
            </div>
            <div class="sa-load">
                <p class="sa-cap"><b>Progress.</b> From 0 to 100 %, then again.</p>
                <div class="sa-stage sa-stage--mini">${anchor(key, 'progress', 'progress')}</div>
            </div>
        </div>
        ${chips}`;
}

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave-anchor"]'));
// The dialog shows only the hint of the option on screen: what you see and
// the honest overlap, short, so the stage keeps its room on a phone too.
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: ASPECT.id,
            label: ASPECT.label,
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${o.see} ${o.overlap}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `One question, ${OPTIONS.length} candidates for synthwave’s anchor element; the first is the recommendation. Judge the element alone, as a loading indicator, and in the three chips. Pick the one that is synthwave to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sa-aspects]'));
const toc = document.querySelector('[data-sa-toc]');
const row = document.createElement('section');
row.className = 'sa-aspect';
row.id = `sa-${ASPECT.id}`;
row.setAttribute('data-sa-aspect', ASPECT.id);
row.setAttribute('aria-labelledby', `h-sa-${ASPECT.id}`);
row.innerHTML = `<div class="sa-aspect__head"><h3 id="h-sa-${ASPECT.id}">${ASPECT.label}</h3><p class="sa-aspect__q"></p><p class="sa-aspect__why"></p></div><div class="sa-six" data-sa-n="${OPTIONS.length}"></div>`;
/** @type {HTMLElement} */ (row.querySelector('.sa-aspect__q')).textContent = ASPECT.question;
/** @type {HTMLElement} */ (row.querySelector('.sa-aspect__why')).textContent = ASPECT.why;
const six = /** @type {HTMLElement} */ (row.querySelector('.sa-six'));
OPTIONS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'sa-col';
    col.id = `sa-option-${at + 1}`;
    col.setAttribute('data-sa-option', String(at + 1));
    col.innerHTML = `<p class="sa-label-row"><span class="sa-label-row__no">${at + 1}</span> <span class="sa-label-row__name"></span>${
        at === 0 ? ' <span class="sa-label-row__rec">Recommended</span>' : ''
    }</p><p class="sa-see"></p><p class="sa-verdict"></p>
        <div class="sa-scene" data-sa-kind="cycle" data-sa-${ASPECT.id}="${o.key}" data-sa-phase="in"><div class="sa-board">${board(o.key)}</div></div>`;
    /** @type {HTMLElement} */ (col.querySelector('.sa-label-row__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.sa-see')).textContent = o.see;
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.sa-verdict'));
    verdict.textContent = `${at === 0 ? 'Recommended: ' : ''}${o.why} ${o.overlap}`;
    verdict.classList.toggle('sa-verdict--rec', at === 0);
    six.append(col);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sa-option-${at + 1}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = o.name;
        toc.append(li);
    }
});
rows.append(row);

/* ---------------------------------------------------------- the one clock */

// One cycle per board: `gap` (what arrives is away), `in` (it arrives),
// `hold` (it stands), `out` (it leaves, every arrival backwards). The CSS
// keys every motion to the phase attribute; the clock only writes it. Every
// arrival and every leave lasts at most the board's own span (--T in
// options.css), well inside `in` and `out`.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sa-motion]');
let slow = 1;
let mode = 'auto';
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 1500],
    ['hold', 2300],
    ['out', 1500],
]);
let timer = 0;
const boards = [...section.querySelectorAll('.sa-scene[data-sa-kind="cycle"]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of boards) scene.setAttribute('data-sa-phase', phase);
}

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
    // "At rest" stops once the element stands; "Arriving only" skips the leave.
    if (mode === 'rest' && phase === 'hold') return;
    const next = mode === 'arrive' && phase === 'hold' ? 0 : (at + 1) % PHASES.length;
    timer = window.setTimeout(() => run(next), ms * slow);
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
radio('data-sa-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--sa-slow', String(slow));
    run(0);
});
radio('data-sa-mode', (value) => {
    mode = value;
    section.setAttribute('data-sa-state', value);
    run(0);
});
document.querySelector('[data-sa-replay]')?.addEventListener('click', () => run(0));

// The buttons in the boards are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sa-scene a, .sa-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
