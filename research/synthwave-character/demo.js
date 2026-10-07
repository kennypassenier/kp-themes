// What makes synthwave synthwave, round 5 (update 3). Round 3 re-derived the eight
// questions from the anchor Kenny decided at 21:21 (the page horizon): one neon tube
// for the page on the header's foot, the floor being the page below it, every part
// carrying 1 px of its light, and, under a hand, a brighter piece of the tube exactly
// as wide as the part touched (research/synthwave-anchor/decided.json;
// themes/synthwave/CHARACTER.md section 0). Kenny judged update 2 at 2026-10-07 23:32:
// the corners ('fall') and the leave ('setssink') are picked and locked (GROUND below),
// and loading comes back once more: "I want a option 2, but with the progress bars of
// option 5", that is the oncoming page (the floor drives toward you while the ramp flows
// the other way through the tube) over the three bars of step 1 of the curve question.
//
// A review-kit demo in aspect mode, synthwave only. Each ASPECT is one rule of the
// grammar asked as a question; each OPTION is a REAL piece of page (a
// `.kp-page-header` with the page tube on its foot, the floor below it, and the
// component in question at its real size), with one attribute on the scene
// (`data-sy-<aspect>="<key>"`) that options.css reads. The questions Kenny approved
// stay applied on every scene as the fixed ground (GROUND below). The first option of
// every question is the recommendation. The page's one clock (below) plays every
// scene that arrives, opens, presses, updates or leaves; it only writes attributes
// and text, it never reads layout. The one layout read in this file is `placePieces`:
// where each part stands against the page tube, written once per size change as
// `--sy-to`, so a piece of the tube can be drawn exactly as wide as the part and at
// the tube. The network graph is in no scene: it changes in no theme (Kenny, 02:54).

/* ----------------------------------------------------------- the ground */

/**
 * The seventeen questions Kenny approved (decided.json of round 1: ten; update.json of
 * update 2: five more; update 3: two more), written on every scene as data-sy-<id>:
 * options.css keys the parts at rest on them. They are not asked again. The five of
 * update 2 are the curve (the tube leads, the bodies follow), the opening (the beam
 * climbs to the horizon), the tone of a warning (the VCR's symbols), the focus ring
 * (two tubes, top and foot) and the press (the piece charges); the two of update 3 are
 * the corners (the light runs down the sides from the stripe's colours and fades) and
 * the leave (the sun sets through it, the part sinking with it). Their drawings stay in
 * options.css; the loading scenes show none of their parts, but the picks are written
 * on them like on every scene and are scoped to the parts they paint (a plate's sides,
 * a leaving part), so they move nothing on the loading page.
 */
const GROUND = {
    direction: 'horizon',
    durations: 'beats',
    colour: 'roles',
    surface: 'floor',
    live: 'laser',
    spinner: 'sun',
    composites: 'own',
    hover: 'tube',
    type: 'osd',
    motifs: 'meaning',
    curve: 'lead',
    opening: 'climb',
    tone: 'osd',
    focus: 'rails',
    press: 'charge',
    corners: 'fall',
    leave: 'setssink',
};
const GROUND_ATTRS = Object.entries(GROUND)
    .map(([k, v]) => `data-sy-${k}="${v}"`)
    .join(' ');

/* ----------------------------------------------------------- the parts */

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The grid floor under a reporting plate's horizon (G7). */
const FLOOR = `<span class="sy-floor" aria-hidden="true"></span>`;

/** A determinate progress bar, the package's own `.kp-progressbar` in synthwave. */
const pbar = (value, label, modifier = '') =>
    `<div class="kp-progressbar sy-bar sy-pbar ${modifier}" role="progressbar" aria-label="${label}, ${Math.round(
        value * 100,
    )} %" aria-valuenow="${Math.round(value * 100)}" aria-valuemin="0" aria-valuemax="100" data-sy-v="${Math.round(
        value * 100,
    )}" style="--kp-value: ${value}"><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;

/**
 * A part the page's horizon can light: the part and, as its last child, the
 * piece of the tube that appears under a hand exactly as wide as the part.
 * `placePieces` tells the piece how far the page tube is from the part.
 */
const host = (html, cls = '', extra = '') => `<span class="sy-host ${cls}" ${extra}>${html}<i class="sy-seg" aria-hidden="true"></i></span>`;
const hostBlock = (html, cls = '', extra = '') =>
    `<div class="sy-host sy-host--block ${cls}" ${extra}>${html}<i class="sy-seg" aria-hidden="true"></i></div>`;

/* ------------------------------------------------------- the page piece */

/**
 * The page horizon (the anchor, decided 2026-10-07 21:21): one tube on the
 * header's foot, as wide as the page, with a ghost of it edge to edge and a far
 * cyan line under it; the floor is the page below it. `head` is a lit length's
 * glowing front and `fx` a layer for what an option runs along the tube.
 */
const HZ = `<div class="sy-hz" aria-hidden="true"><b class="sy-hz__floor"></b><b class="sy-hz__ghost"></b><b class="sy-hz__far"></b><b class="sy-hz__tube"></b><b class="sy-hz__head"></b><b class="sy-hz__fx"></b></div>`;

/**
 * A real piece of page, cropped to what a question needs: the header's foot
 * (the title and its actions at their real size), the page tube, and the
 * parts in question on the floor below.
 */
const page = (actions, body, cls = '') =>
    `<div class="sy-pg ${cls}"><header class="kp-page-header sy-hd"><div class="kp-page-header__inner"><p class="kp-page-header__title sy-hd__title" role="heading" aria-level="4">Pump houses</p><div class="kp-page-header__actions">${actions}</div></div></header>${HZ}<div class="sy-body">${body}</div></div>`;

const cell = (html, cls = '') => `<div class="sy-part ${cls}">${html}</div>`;

/** The actions most scenes carry in the header: two buttons that stand on the tube. */
const ACTIONS = () => host(button('Export')) + host(button('Add a pump house', 'kp-button--primary'));

const PART = {
    bar: (label = 'Sync busy') =>
        `<div class="kp-progressbar sy-bar" role="progressbar" aria-label="${label}" data-kp-indeterminate><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`,
};

/* ------------------------------------------------------------ the scenes */

/**
 * The loading scene of update 3 (Kenny, 2026-10-07 23:32: "I want a option 2, but with the progress bars of option 5"):
 * the oncoming page (the tube's ramp against the floor's drive, set in options.css by `.sy-pg--lx`) over the three bars of
 * step 1. `key` decides only what is open: bars with a floor of their own (barfloor), busy bars (busy3), and the direction
 * of the ramp in each bar's head (mixed: bar 2 flows against the others; the others take the default).
 */
const LX = (/** @type {string} */ key) => {
    const rows = /** @type {[number, string][]} */ ([
        [0.72, 'Sync'],
        [0.48, 'Backup'],
        [0.88, 'Upload'],
    ]);
    const busy = key === 'busy3';
    const body = rows
        .map(([v, l], i) => {
            const caption = busy ? l : `${l} ${Math.round(v * 100)} %`;
            const dir = key === 'mixed' && i !== 1 ? 'old' : 'tube';
            return `<div class="sy-pbar-row${key === 'barfloor' ? ' sy-pbar-row--floor' : ''}" data-sy-dir="${dir}"><span class="sy-cap">${caption}</span>${
                busy ? PART.bar(`${l} busy`) : pbar(v, l)
            }${key === 'barfloor' ? FLOOR : ''}</div>`;
        })
        .join('');
    return page(ACTIONS(), cell(`<div class="sy-pbars">${body}</div>`, 'sy-part--busy'), 'sy-pg--waits sy-pg--bars sy-pg--lx');
};

/* ------------------------------------------------------------ the aspects */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

/**
 * One question each. `kind`: 'cycle' scenes are replayed by the page's clock
 * (arrive, open, press, leave), 'loop' scenes loop in CSS, 'still' scenes do
 * not move. `options[0]` is the recommendation. The scene gets the option's key
 * (loading draws a different page for a mix and for a progress bar).
 * @type {{ id: string, label: string, rule: string, question: string, why: string, kind: 'cycle' | 'loop' | 'still', scene: (key: string) => string,
 *   options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'loading',
        label: 'Loading',
        rule: 'G10',
        question: 'What does everything that waits show?',
        why: 'You want option 2 of the last round (the floor drives toward you while the ramp flows the other way through the page tube) with the progress bars of option 5 (Sync 72 %, Backup 48 %, Upload 88 %, each with its mono caption, the package’s own `.kp-progressbar`). All six options below are exactly that: the page tube at the top with the sun’s ramp flowing through it, 8 beats (1800 ms) a period, travelling from the tube’s left end to its right while the floor under the page drives toward you, 4 beats (900 ms) a period, and the three bars under them. They differ only in what was still open: whether the tube and the bars simply run side by side (1), whether the ramp flows through the bars’ own heads (2), whether each bar stands on a floor of its own (3), whether the bars are locked to the beat (4), what the bars do when the share is unknown (5), and whether the bars all flow the same way (6). Nothing flickers: every light glides or steps on the beat, and a determinate bar fills, holds and empties backwards instead of jumping back.',
        kind: 'loop',
        scene: LX,
        options: [
            {
                key: 'combo',
                name: 'The oncoming tube and floor, the bars as they were',
                see: 'The page tube is an unlit track with the sun’s ramp (pink, laser yellow, pink) flowing through it from its left end to its right, 1800 ms a period; the grid floor drives toward you under the page, 900 ms; the three bars under them fill on the sunrise curve (900 ms), hold, and empty backwards, 4500 ms a period, Sync to 72 %, Backup to 48 %, Upload to 88 %, with their mono captions.',
                verdict: rec(
                    'it is your sentence with nothing added: the page says “busy” (the tube and the floor never stop) and each bar says “how far” (it fills to its mark), so waiting and progress are two layers of one picture; the tube leads and the bars follow, as in the curve you picked. Overlap: the ramp alone is titanium’s drift in colour, and a determinate bar is every theme’s; a floor that drives under a bar is nobody else’s.',
                ),
            },
            {
                key: 'headramp',
                name: 'The ramp flows through each bar’s head',
                see: 'As option 1, but the lit length of each bar ends in a 7 rem tail in which the sun’s ramp flows, 1800 ms a period, in the tube’s direction, left to right, fading in from nothing behind the head: the bar’s own head is a small tube of oncoming light, and the fill behind it stays still. The tube above and the floor below run as in option 1.',
                verdict: not(
                    'the bar becomes a tiny page tube: the same ramp moves at the head, where the eye is, and the fill behind it is calm; but the tail covers the fill’s stripes at the head, and on the 48 % bar it is a short bright spot. Overlap: none beyond the ramp (titanium’s drift).',
                ),
            },
            {
                key: 'barfloor',
                name: 'Each bar stands on a floor that drives toward you',
                see: 'As option 1, and under each bar a band of its own grid floor, with the 1 px horizon line at the bar’s foot and the lines born there and spreading toward you, 900 ms, the same drive as the page floor. The bar is the road’s edge: three little horizons, one under every bar.',
                verdict: not(
                    'every bar is lit the way a plate is lit (the horizon rule: each part carries its 1 px of light) and the drive is repeated at the bar’s scale, so the page reads as one floor under three bars; but three more moving grids make the lower half of the page the busiest part of the screen, and the bars lose their quiet.',
                ),
            },
            {
                key: 'locked',
                name: 'Locked to the beat: each head lands on a beat',
                see: 'As option 1, but the bars’ clock is the tube’s and the floor’s: the loop is 16 beats (3600 ms), exactly two periods of the ramp and four of the floor. Each bar fills in four steps of one beat (225 ms), its head landing on a beat each time, holds, and empties in four steps back, so every step falls on a moment when the ramp and the floor are at the same point.',
                verdict: not(
                    'the grid of the beat is the only clock on the page, and a stepped head is the marquee’s step; you can count it, and the three motions never drift apart; but a stepped head is less smooth than a glide and a stepped bar of 4 notches suggests only four values (nostromo’s lamp bank, terminal’s `[####----]` are the neighbours).',
                ),
            },
            {
                key: 'busy3',
                name: 'Indeterminate: three busy bars',
                see: 'The tube and the floor run as in option 1, but the three bars are busy (`data-kp-indeterminate`): no share, the package’s own road, a 3 px lane of near-white dashes with a pink bloom running left to right on each bar’s dark track, 600 ms a period. The captions say only Sync, Backup, Upload.',
                verdict: not(
                    'it is what waiting with no known end looks like on this page: three roads, a flowing tube, a driving floor, and nothing claims a share; but it is the quickest, busiest option (the road is 600 ms against the tube’s 1800) and it does not show the bars you asked for filling.',
                ),
            },
            {
                key: 'mixed',
                name: 'The ramp flows both ways: bar 2 against the others',
                see: 'As option 2 (the ramp in each bar’s head), but the direction alternates: in bars 1 and 3 the ramp flows right to left (the way the old option 1 flowed), in bar 2 left to right, like the tube; 1800 ms a period each. Three lanes of traffic on a two-way road under the tube, which runs left to right.',
                verdict: not(
                    'it says “road” most literally, lanes passing each other, and it is the only option in which a bar can be told from the next by motion alone; but a ramp that goes the other way on Backup says something about Backup that is not true, and the eye is pulled sideways three times.',
                ),
            },
        ],
    },
];

/**
 * What each loop does, added to what each option says. Loops are CSS loops, not measured by research/_review/measure-motion.mjs: their
 * periods are the CSS's, in whole beats (one beat is 225 ms), the tube and the floor on one clock.
 * @type {Record<string, string>}
 */
const MEASURED = {
    'loading:combo':
        'loop: the ramp 1800 ms (8 beats), the floor 900 ms (4 beats), the bars 4500 ms (20 beats: fill 900 ms from beat 1, hold, empty backwards, on the sunrise curve); the three clocks meet every 9000 ms',
    'loading:headramp': 'loop: the ramp 1800 ms in the tube and in each head, the floor 900 ms, the bars 4500 ms; they meet every 9000 ms',
    'loading:barfloor': 'loop: the ramp 1800 ms, the page floor and the three bar floors 900 ms, the bars 4500 ms; they meet every 9000 ms',
    'loading:locked':
        'loop 3600 ms (16 beats): the ramp twice, the floor four times, each bar four steps of 225 ms up (beat 1 to 5), hold to beat 11, four steps down; every clock meets at 3600 ms',
    'loading:busy3': 'loop: the ramp 1800 ms, the floor 900 ms, the package’s road 600 ms on each bar; every clock meets at 1800 ms',
    'loading:mixed':
        'loop: the ramp 1800 ms in the tube and in each head (bar 2 the other way), the floor 900 ms, the bars 4500 ms; they meet every 9000 ms',
};
for (const a of ASPECTS)
    for (const o of a.options) {
        const m = MEASURED[`${a.id}:${o.key}`];
        if (m) o.see = `${o.see} Period: ${m}`;
    }

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave"]'));
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
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `${ASPECTS.length} question is open, each option a real piece of page: the header’s foot with the page horizon on it, and the part in question at its real size. The first option is the recommendation. The seventeen questions you approved (ten on 07/10 at 20:41, five at 23:00, two at 23:32) and the anchor you decided at 21:21 (the page horizon) are the fixed ground of every scene. Pick the one that is synthwave to you, or “None of these” with a note.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sy-aspects]'));
const toc = document.querySelector('[data-sy-toc]');
const built = document.createDocumentFragment();
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'sy-aspect';
    box.id = `sy-${a.id}`;
    box.setAttribute('data-sy-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-sy-${a.id}`);
    box.innerHTML = `<div class="sy-aspect__head">
        <h3 id="h-sy-${a.id}"><span class="sy-aspect__no">${n + 1}</span> ${a.label} <span class="sy-aspect__rule">${a.rule}</span></h3>
        <p class="sy-aspect__q"></p><p class="sy-aspect__why"></p></div><div class="sy-trio" data-sy-n="${a.options.length}"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.sy-aspect__why')).textContent = a.why;
    const trio = /** @type {HTMLElement} */ (box.querySelector('.sy-trio'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'sy-col';
        col.setAttribute('data-sy-option', String(at + 1));
        col.innerHTML = `<p class="sy-label-row"><span class="sy-label-row__no">${at + 1}</span> <span class="sy-label-row__name"></span>${
            at === 0 ? ' <span class="sy-label-row__rec">Recommended</span>' : ''
        }</p><p class="sy-see"></p><p class="sy-verdict"></p>
        <div class="sy-scene" data-sy-kind="${a.kind}" ${GROUND_ATTRS} data-sy-${a.id}="${o.key}" data-sy-phase="in">${a.scene(o.key)}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.sy-label-row__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.sy-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.sy-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('sy-verdict--rec', at === 0);
        trio.append(col);
    });
    built.append(box);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sy-${a.id}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = `${a.label} (${a.rule})`;
        toc.append(li);
    }
});
rows.append(built);

/* --------------------------------------------- where the page tube is, per part */

/**
 * The one layout read of the demo: how far each part stands from the page
 * tube, written as `--sy-to` on the part's host (positive: the part is below
 * the tube, as every part of the body is; negative: it stands in the header,
 * on the tube). The piece of the tube is drawn from it, exactly as wide as the
 * part. Read when a page's size changes or it first shows, never per frame.
 */
function placePieces(/** @type {Element} */ pg) {
    const hz = pg.querySelector('.sy-hz');
    if (!hz) return;
    const tube = hz.getBoundingClientRect().top;
    if (!pg.getBoundingClientRect().height) return;
    for (const hostEl of pg.querySelectorAll('.sy-host')) {
        /** @type {HTMLElement} */ (hostEl).style.setProperty('--sy-to', `${Math.round((hostEl.getBoundingClientRect().top - tube) * 10) / 10}px`);
    }
}
const pages = [...section.querySelectorAll('.sy-pg')];
if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
        for (const entry of entries) placePieces(entry.target);
    });
    for (const pg of pages) ro.observe(pg);
}
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) placePieces(entry.target);
    });
    for (const pg of pages) io.observe(pg);
}
document.fonts?.ready.then(() => pages.forEach(placePieces));
pages.forEach(placePieces);

/* ---------------------------------------------------------- the one clock */

// Every scene that arrives, opens, presses, updates or leaves is replayed by
// one clock, so the options of a row always start together and can be
// compared. One cycle: `gap` (what arrives is away), `in` (it arrives, a
// press lands, a value updates), `hold` (it stands), `out` (it leaves). The
// CSS keys every motion to these phases; the clock only writes attributes and
// text, all in one pass, and never reads layout.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sy-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 600],
    ['in', 1400],
    ['hold', 2200],
    ['out', 1100],
]);
const values = ['412', '436', '398', '451'];
let tick = 0;
let timer = 0;
const cycleScenes = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"]')];
const numbers = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-num]')];
const words = [...section.querySelectorAll('.sy-scene[data-sy-kind="cycle"] [data-sy-word]')];

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of cycleScenes) scene.setAttribute('data-sy-phase', phase);
    if (phase !== 'in') return;
    tick += 1;
    for (const num of numbers) {
        const text = (num.textContent || '').trim();
        if (/Gb/.test(text)) num.textContent = tick % 2 ? '4.4 Gb/s' : '4.2 Gb/s';
        else if (/^\d+$/.test(text) && Number(text) > 99) num.textContent = values[tick % values.length];
        else if (/^\d+$/.test(text)) num.textContent = String(30 + ((tick * 7) % 20));
        else if (/^\d+ \d+$/.test(text)) num.textContent = tick % 2 ? '18 312' : '18 240';
    }
    for (const word of words) word.textContent = tick % 2 ? 'Syncing' : 'Running';
}

/* ------------------------------------------ every close is its open reversed */

// Kenny's standing rule (2026-10-07 15:16): every close is its open played
// backwards. What a scene hides at `gap` is away; the animations that start
// at `in` in a cell where something away has come to stay by `hold` are its
// arrivals, noted with their keyframes and timing as the CSS gave them (a
// live update or a press, in a cell that was there all along, is not one);
// at `out`, every part whose option starts
// no leave of its own plays its arrival backwards over its cell's whole
// arrival: the same keyframes, curve and pace, what arrived last leaving
// first (the last day of a week, the panel before the line it rose from).
// A part whose option draws its own leave (an `out` rule) keeps it.
// Keyed to the phase attribute, not to the clock, so whatever sets the phase
// (the clock, research/_review/measure-motion.mjs) gets the same close.
/** @type {WeakMap<Element, { target: Element, pseudo: string | null, keyframes: Keyframe[], timing: EffectTiming }[]>} */
const arrivalsOf = new WeakMap();
/** @type {WeakMap<Element, Animation[]>} */
const closesOf = new WeakMap();
/** @type {WeakMap<Element, Set<Element>>} */
const awayOf = new WeakMap();
/** When each scene last reached `in`, on the document timeline. */
/** @type {WeakMap<Element, number>} */
const inAt = new WeakMap();
/** The longest close the last `out` started, in ms (the clock waits for it). */
let closing = 0;
const FLIP = /** @type {Record<string, PlaybackDirection>} */ ({
    normal: 'reverse',
    reverse: 'normal',
    alternate: 'alternate-reverse',
    'alternate-reverse': 'alternate',
});
// Played backwards, what an arrival showed before it started is what its
// close shows after it ends, and the other way round.
const FILL_FLIP = /** @type {Record<string, FillMode>} */ ({
    none: 'none',
    auto: 'none',
    forwards: 'backwards',
    backwards: 'forwards',
    both: 'both',
});
const isAway = (/** @type {Element} */ el) => {
    const style = getComputedStyle(el);
    return style.visibility === 'hidden' || style.opacity === '0';
};
const endOf = (/** @type {EffectTiming} */ t) => (Number(t.delay) || 0) + Number(t.duration) * (Number(t.iterations) || 1);

/** What the scene hides at `gap`: hidden, see-through, or fading to it. One style read per element, no layout. */
function noteAway(/** @type {Element} */ scene) {
    const away = new Set();
    for (const el of scene.querySelectorAll('*')) if (isAway(el)) away.add(el);
    for (const t of scene.getAnimations({ subtree: true }))
        if (t instanceof CSSTransition && t.transitionProperty === 'opacity') {
            const frames = /** @type {KeyframeEffect} */ (t.effect).getKeyframes();
            if (String(frames[frames.length - 1]?.opacity) === '0')
                away.add(/** @type {Element} */ (/** @type {KeyframeEffect} */ (t.effect).target));
        }
    awayOf.set(scene, away);
}

/** An animation as the CSS gave it: what it moves, its keyframes and its timing. */
function noted(/** @type {Animation} */ a) {
    const effect = /** @type {KeyframeEffect} */ (a.effect);
    const keyframes = effect.getKeyframes().map(({ computedOffset, ...k }) => k);
    return { target: /** @type {Element} */ (effect.target), pseudo: effect.pseudoElement, keyframes, timing: effect.getTiming() };
}

const isMotion = (/** @type {Animation} */ a) =>
    a instanceof CSSAnimation &&
    Boolean(a.effect && /** @type {KeyframeEffect} */ (a.effect).target) &&
    Number.isFinite(a.effect?.getComputedTiming().endTime);

/** At `in`: every animation that starts now may be part of an arrival. */
function noteArrivals(/** @type {Element} */ scene) {
    inAt.set(scene, Number(document.timeline.currentTime));
    // Only what starts now: a register's own entrance that ran at page load
    // and still fills is not part of this arrival.
    arrivalsOf.set(
        scene,
        scene
            .getAnimations({ subtree: true })
            .filter((a) => isMotion(a) && a.playState !== 'finished')
            .map(noted),
    );
}

/**
 * At `hold`: a cell (one dialog, one week of days) arrived when something
 * that was away at `gap` stands there now; every animation that started in
 * it at `in` is part of the arrival (the stripes over a rising panel too). A
 * cell where nothing came to stay (a press, a live change, a dimension shown
 * only while pressed) has nothing to close.
 */
function keepArrivals(/** @type {Element} */ scene) {
    const cellOf = (/** @type {Element} */ el) => el.closest('.sy-part') || scene;
    const arrived = new Set([...(awayOf.get(scene) || [])].filter((el) => !isAway(el)).map(cellOf));
    arrivalsOf.set(
        scene,
        (arrivalsOf.get(scene) || []).filter((x) => arrived.has(cellOf(x.target))),
    );
}

/** At `out`: what to play backwards, read now; the function it returns plays it and says how long it takes. */
function closeByReverse(/** @type {Element} */ scene) {
    const now = scene.getAnimations({ subtree: true }).filter(isMotion);
    // A leave the option draws itself (an `out` rule) is running now.
    const ownLeaves = now.filter((a) => a.playState !== 'finished').map((a) => /** @type {KeyframeEffect} */ (a.effect));
    const same = (
        /** @type {{ target: Element, pseudo: string | null }} */ x,
        /** @type {{ target: Element | null, pseudoElement: string | null }} */ e,
    ) => e.target === x.target && e.pseudoElement === x.pseudo;
    // What arrived from away, and what moved and still holds its end pose (a
    // readout that travelled to its mark): both go back the way they came.
    const arrived = arrivalsOf.get(scene) || [];
    const since = inAt.get(scene) ?? Infinity;
    const holding = now
        .filter((a) => a.playState === 'finished' && (a.startTime === null || Number(a.startTime) >= since - 1))
        .map(noted)
        .filter((x) => !arrived.some((y) => y.target === x.target && y.pseudo === x.pseudo));
    const arrivals = [...arrived, ...holding].filter((x) => x.target.isConnected && !ownLeaves.some((e) => same(x, e)));
    // Each cell of the scene (one dialog, one week of days) is one arrival.
    const cellOf = (/** @type {Element} */ el) => el.closest('.sy-part') || scene;
    /** @type {Map<Element, number>} */
    const spans = new Map();
    for (const x of arrivals) spans.set(cellOf(x.target), Math.max(spans.get(cellOf(x.target)) || 0, endOf(x.timing)));
    // Read now, play later: the observer reads every scene before it writes any.
    return () => {
        closesOf.set(
            scene,
            arrivals.map((x) =>
                x.target.animate(x.keyframes, {
                    ...x.timing,
                    delay: (spans.get(cellOf(x.target)) || 0) - endOf(x.timing),
                    // What waited at the start of the arrival waits at the end of its close: the close lasts as long as the arrival.
                    endDelay: Number(x.timing.delay) || 0,
                    direction: FLIP[x.timing.direction || 'normal'],
                    fill: FILL_FLIP[x.timing.fill || 'none'],
                    pseudoElement: x.pseudo ?? undefined,
                }),
            ),
        );
        return Math.max(0, ...spans.values());
    };
}

new MutationObserver((records) => {
    const scenes = [...new Set(records.map((r) => /** @type {Element} */ (r.target)))];
    const at = (/** @type {string} */ phase) => scenes.filter((scene) => scene.getAttribute('data-sy-phase') === phase);
    // Every read first, for every scene, then every write, so the styles are
    // worked out once per phase change and not once per scene.
    for (const scene of at('gap')) noteAway(scene);
    for (const scene of at('hold')) keepArrivals(scene);
    for (const scene of at('in')) noteArrivals(scene);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const scene of at('in')) for (const a of closesOf.get(scene) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-sy-phase'] });

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
    // The closes start in the observer above, a microtask after the phase is
    // set; `out` lasts at least as long as the longest of them.
    queueMicrotask(() => {
        const wait = phase === 'out' ? Math.max(ms * slow, closing + 120) : ms * slow;
        timer = window.setTimeout(() => run((at + 1) % PHASES.length), wait);
    });
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
radio('data-sy-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--sy-slow', String(slow));
    run(0);
});
document.querySelector('[data-sy-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sy-scene a, .sy-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();

/* ---------------------------------------------------------- the gallery */

// The decided synthwave components as they are today: each character demo
// embedded by the review kit (`?embed=<aspect>&theme=synthwave`, only its
// combination of the decided picks). Loaded when the gallery is opened, so
// the page itself stays light.
const gallery = /** @type {HTMLDetailsElement | null} */ (document.querySelector('[data-sy-gallery]'));
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
