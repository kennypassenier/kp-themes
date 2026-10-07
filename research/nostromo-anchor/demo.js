// Nostromo's anchor element (Kenny, 2026-10-07: "bij nostromo wil ik meer
// opties waaruit ik kan kiezen, maar er een demo voor").
//
// A review-kit demo in aspect mode, nostromo only, ONE aspect with ONE
// question: which element is the anchor, the one recognisable element every
// decision about the whole theme is made from (forest: the tree bar,
// titanium: its loading animation, cyberpunk: the glitch)? Six candidates,
// the recommendation first. Each is a live scene: the element alone in the
// centre (the stage), playing by itself, and under it four real package parts
// (a switch thrown, a menu arriving, a figure changing, something waiting)
// that take their rule from the anchor. Colours are the shared base, so they
// are not asked. The network graph is in no scene.
//
// The page's one clock (below) plays every scene: gap (idle, what arrives is
// away), in (the anchor and the parts arrive), hold (they stand, loops run),
// out (every arrival played backwards by script, as in nostromo-character).

/* ----------------------------------------------------------- the parts */

const SLOTS = 8;

/** A real LED: the unlit dot always there, the lit lens arriving. */
const led = (cls = '') => `<span class="na-led ${cls}" aria-hidden="true"><span class="na-led__lens na-arrives"></span></span>`;

/** A switch's or reading's lamp (scope-12): unlit at rest; the options light it. */
const lamp = '<span class="na-lamp" aria-hidden="true"></span>';

/** The progress bar's LED window, drawn again; `rows` rows of whole LEDs. */
const bank = (rows = 1, cls = '') =>
    `<span class="na-bank ${cls}" aria-hidden="true">${[...Array(rows).keys()]
        .map((r) => `<span class="na-bank__window" style="--r: ${r}"><span class="na-bank__lit na-arrives"></span></span>`)
        .join('')}</span>`;

const slats = (n, cls = '') =>
    `<span class="na-slats ${cls}" aria-hidden="true">${[...Array(n).keys()].map((i) => `<i class="na-slat" style="--k: ${i}; --d: ${(i * 5) % 7}"></i>`).join('')}</span>`;

/** Label tape text printed a letter at a time (options.css only draws it as tape under the embosser). */
const print = (text, n = text.length, extra = '') => `<span class="na-print na-arrives" style="--n: ${n}; ${extra}">${text}</span>`;

const button = (label, modifier = '', extra = '') => `<button type="button" class="kp-button ${modifier}" ${extra}>${label}</button>`;

/** The unordered order in which the menu's rows come on under the lamp bank. */
const ORDER = [2, 0, 3];
const MENU = [
    ['Open incident', 13],
    ['Assign to…', 10],
    ['Delete', 6],
];

const caption = (text) => `<p class="na-cap">${text}</p>`;
const cell = (cap, html, cls = '') => `<div class="na-part ${cls}">${caption(cap)}${html}</div>`;

/** The four parts every candidate drives; `fx` is what each candidate adds to them. */
const PARTS = {
    // A switch is thrown.
    switch: (fx) =>
        cell(
            'A switch is thrown',
            `<div class="na-slot"><button type="button" class="kp-button kp-button--primary na-btn${fx.btn || ''}">Start export</button>${fx.beside || ''}</div>`,
        ),
    // A menu arrives.
    menu: (fx) =>
        cell(
            'A menu arrives',
            `<div class="na-menu-wrap">${button('More ▾', 'kp-button--sm', 'aria-haspopup="menu" aria-expanded="true"')}
            <div class="kp-popover na-pop na-arrives">${fx.pop || ''}<ul class="kp-menu" role="menu">${MENU.map(
                ([text, n], i) =>
                    `<li role="none"><button type="button" role="menuitem" class="kp-menu__item na-item${i === 2 ? ' kp-menu__item--destructive' : ''}" style="--k: ${ORDER[i]}; --i: ${i}">${lamp}${fx.label ? fx.label(text, n) : `<span class="na-text">${text}</span>`}</button></li>`,
            ).join('')}</ul></div></div>`,
        ),
    // A figure changes.
    figure: (fx) =>
        cell(
            'A figure changes',
            `<div class="na-carrier">${fx.kpi || ''}<div class="kp-kpi na-kpi">
            <span class="kp-kpi__label">${lamp}Flow now</span>
            <span class="kp-kpi__value na-fig"><span class="na-fig__old">412</span><span class="na-fig__new na-arrives">436</span>${fx.fig || ''}</span>
            <span class="kp-kpi__trend"><span class="kp-kpi__delta na-tape${fx.delta || ''}" data-kp-tone="good" data-kp-direction="up">6 %</span> on yesterday</span></div></div>`,
        ),
    // Something is waiting.
    wait: (fx) =>
        cell(
            'Something is waiting',
            `<div class="kp-card na-wait na-arrives" role="status" aria-label="Waiting for the meters"><p class="kp-card__title na-title">Pump house 1</p><p class="kp-card__body">Reading the meters</p>${fx.load || ''}</div>`,
        ),
};

/** The six anchors: the stage (the element alone in the centre) and what each adds to the four parts. */
const ANCHORS = {
    lamps: {
        rule: 'A lamp switches on or off in one frame. Every part arrives, leaves and changes the way a lamp does: whole, in a frame, never grown or glided.',
        stage: () => `<div class="na-stage__body">${bank(3, 'na-bank--big')}<p class="na-plate">MU/TH/UR 6000 · LAMP BANK</p></div>`,
        fx: {
            switch: { beside: led() },
            menu: {},
            figure: { kpi: '' },
            wait: { load: bank(1, 'na-wait__load') },
        },
    },
    tape: {
        rule: 'Tape is printed a letter a frame and cut with a notch. Every label, every arrival, every leave is tape being printed.',
        stage: () =>
            `<div class="na-stage__body"><div class="na-emb" aria-hidden="true"><span class="na-emb__body"><span class="na-emb__slot"></span>${led('na-emb__lamp')}<span class="na-emb__name">EMBOSSER 3</span></span><span class="na-emb__tape"><span class="na-emb__text na-arrives" style="--n: 12">MUTHUR READY</span></span></div></div>`,
        fx: {
            switch: { beside: `<span class="na-tag" aria-hidden="true">${print('EXPORTED', 8)}</span>` },
            menu: { label: (text, n) => print(text, n) },
            figure: { delta: ' na-arrives' },
            wait: {
                load: `<span class="na-strip" aria-hidden="true">${print('COMPUTING', 9, 'display:inline-block')}<span class="na-strip__dots">▪ ▪ ▪ ▪ ▪ ▪</span></span>`,
            },
        },
    },
    vent: {
        rule: 'A louvre opens in steps with the glow behind it. Every panel, figure and switch opens and shuts the way the grille does.',
        stage: () =>
            `<div class="na-stage__body"><div class="na-vent" aria-hidden="true"><span class="na-vent__glow na-arrives"></span>${slats(SLOTS)}</div><p class="na-plate">VENT 4 · AFT</p></div>`,
        fx: {
            switch: { beside: `<span class="na-mini" aria-hidden="true"><span class="na-mini__glow na-arrives"></span>${slats(3)}</span>` },
            menu: {},
            figure: {},
            wait: {
                load: `<span class="na-vent na-vent--strip" aria-hidden="true"><span class="na-vent__glow na-arrives"></span>${slats(14, 'na-slats--flutter')}</span>`,
            },
        },
    },
    key: {
        rule: 'A key is pushed into its well and released. Every change of state is a switch thrown: the part goes in, its lamp comes on.',
        stage: () =>
            `<div class="na-stage__body"><div class="na-keywell" aria-hidden="true"><span class="na-keycap">${led('na-keycap__lamp')}<span class="na-keycap__legend">EXEC</span></span></div><p class="na-plate">KEY 7 · EXECUTE</p></div>`,
        fx: {
            switch: { beside: led() },
            menu: { pop: '<span class="na-pop__well" aria-hidden="true"></span>' },
            figure: {},
            wait: {
                load: `<span class="na-keys" aria-hidden="true">${[...Array(7).keys()].map((i) => `<i class="na-key" style="--d: ${(i * 3) % 7}"></i>`).join('')}</span>`,
            },
        },
    },
    klaxon: {
        rule: 'The frame flashes amber, then red, in whole frames, and the beacon turns. Every state speaks the console’s alarm vocabulary.',
        stage: () =>
            `<div class="na-stage__body"><span class="na-beacon" aria-hidden="true"><span class="na-beacon__beam na-arrives"></span><span class="na-beacon__lens"></span></span><p class="na-plate">ALARM · DECK 4</p></div><span class="na-frame na-frame--stage na-arrives" aria-hidden="true"></span>`,
        fx: {
            switch: { beside: '<span class="na-frame na-frame--ring na-arrives" aria-hidden="true"></span>' },
            menu: { pop: '<span class="na-frame na-arrives" aria-hidden="true"></span>' },
            figure: { kpi: '<span class="na-frame na-arrives" aria-hidden="true"></span>' },
            wait: { load: '<span class="na-frame na-frame--wait na-arrives" aria-hidden="true"></span>' },
        },
    },
    raster: {
        rule: 'The picture is drawn row by row from the top, with a bright beam and a fading tail. Every arrival is the screen redrawing.',
        stage: () =>
            `<div class="na-stage__body"><div class="na-crt" aria-hidden="true"><span class="na-crt__hum"></span><span class="na-crt__pic na-arrives"><svg viewBox="0 0 200 96" preserveAspectRatio="none">${[
                [10, 96],
                [22, 140],
                [34, 70],
                [46, 150],
                [58, 110],
                [70, 60],
            ]
                .map(([y, w]) => `<rect x="12" y="${y}" width="${w}" height="5" rx="1" fill="currentColor"/>`)
                .join(
                    '',
                )}<polyline points="12,92 40,82 68,86 96,74 124,78 152,64 188,68" fill="none" stroke="currentColor" stroke-width="2"/></svg></span><span class="na-crt__beam na-arrives"></span></div><p class="na-plate">SCREEN 2 · MU/TH/UR</p></div>`,
        fx: {
            switch: {},
            menu: {},
            figure: { fig: '<span class="na-fig__beam na-arrives" aria-hidden="true"></span>' },
            wait: {
                load: `<span class="na-roll" aria-hidden="true"><span class="na-roll__text">COMPUTING</span><span class="na-roll__bar"></span></span>`,
            },
        },
    },
};
// Where a part is the candidate's own element, the part carries its key.
ANCHORS.raster.fx.switch = { btn: ' na-arrives' };

const scene = (key) => {
    const a = ANCHORS[key];
    return `<div class="na-part na-part--stage">${a.stage()}</div><p class="na-rule"><b>The rule it gives every part:</b> ${a.rule}</p>${PARTS.switch(
        a.fx.switch,
    )}${PARTS.menu(a.fx.menu)}${PARTS.figure(a.fx.figure)}${PARTS.wait(a.fx.wait)}`;
};

/* ------------------------------------------------------------ the question */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended as the anchor, because ${why}`;

/**
 * One aspect, one question, six options; `options[0]` is the recommendation.
 * @type {{ id: string, label: string, question: string, why: string, options: { key: string, name: string, see: string, verdict: string }[] }[]}
 */
const ASPECTS = [
    {
        id: 'anchor',
        label: 'Nostromo’s anchor element',
        question: 'Which element is nostromo’s anchor: the one every decision about the whole theme is made from?',
        why: 'Forest’s anchor is the tree progress bar, titanium’s its loading animation, cyberpunk’s the glitch. The colours are already good everywhere and are the shared base, so they are not what is chosen. Each scene shows the element alone in the centre and, under it, four real package parts drawn by that one rule. Judge two things: is the element unmistakably nostromo, and can a button, a menu, a figure and a loading state all honestly come from it?',
        options: [
            {
                key: 'lamps',
                name: 'The LED lamp bank',
                see: 'The progress bar’s LED window in its moulded bezel, three rows of whole LEDs. On the 80 ms clock they switch on in unordered patterns (a test sequence of eight frames), settle, and compute: a new pattern every four frames. Under it: the switch’s indicator lights in one frame; the menu’s rows come on whole, one after the other in an unordered order, each with its lamp; the figure changes in one frame and its lamp lights; the waiting card computes on a small bank of its own. Leaving is every one of these backwards.',
                verdict: rec(
                    'it is the strongest part nostromo has today (the bar’s LED window, approved in three rounds) and the lamp of scope-12 on every switch, so the anchor and the quirk are one idea. One frame on and one frame off is the frame clock in its purest form. It reaches both halves of the theme, the case’s switches and the screen’s readouts, and no other theme owns it: synthwave’s marquee lights in order, terminal’s cells are green characters, forest’s trees grow. The risk: it is small, and could be read as “just the loading bar”; the parts under it are the proof that it can drive everything.',
                ),
            },
            {
                key: 'tape',
                name: 'The label-tape embosser',
                see: 'An embosser feeds a strip of black tape and prints MUTHUR READY in mono capitals, one letter a frame, then cuts it off with a notch. Under it: the switch prints EXPORTED beside itself; the menu’s entries are printed one letter at a time, row after row; the figure is printed digit by digit and its change on a tape; the waiting card prints COMPUTING and a row of squares, over and over. Leaving is the tape un-printed and the notch closed.',
                verdict: not(
                    'the tape is nostromo’s voice (G15) and a lovely motif for labels, but printing letter by letter is terminal’s typed-out line and cyberpunk’s decipher in another hand, and it has no state of its own: a button, a figure and a loading can only be “text being printed”. Keep it as the label’s motif.',
                ),
            },
            {
                key: 'vent',
                name: 'The vent grille',
                see: 'Eight moulded slats, shut, open from the top in four steps each while the amber backlight comes on behind them, flickering gently once open. Under it: the switch opens a three-slat louvre beside it; the menu is revealed in louvred bands that open in four steps; the old figure is shut away behind slats and the new one opens; the waiting card flutters its slats in an unordered pattern. Leaving is the louvres closing and the glow going out.',
                verdict: not(
                    'it is the most photogenic candidate and the louvre is nostromo’s alone, but it only carries “open and close”: a figure that changes and a loading are forced into shutters, and it belongs to the case, not to the console’s screens. Better as the vents’ own motif (the backlit vents already decided).',
                ),
            },
            {
                key: 'key',
                name: 'The key that pushes into its well',
                see: 'A raised plastic key with its lamp is pushed eight pixels into its moulded well in two frames, its lamp comes on, it is held, and it is released. Under it: the switch is pressed the same way, with its indicator lamp; the menu rises out of its well in three frames; the figure’s plate is pressed, the value changes while it is down, and it is released; the waiting card is a row of keys that go down in an unordered pattern. Leaving is the key released, each part back up.',
                verdict: not(
                    'the key going into its well is already G14, the press, and the register’s moulding. As the anchor it makes every state a press, but the motion is a few pixels of travel and a shadow, which is titanium’s 1 px press in a heavier coat, and a menu rising out of a well or a figure that is “pressed” has to be explained. Keep it as the press.',
                ),
            },
            {
                key: 'klaxon',
                name: 'The bridge klaxon',
                see: 'The whole edge of the screen flashes amber and red in whole frames while a beacon’s beam turns in twelve steps; once it has arrived the frame keeps alternating amber and red. Under it: the switch’s ring flashes; the menu arrives in an alarm frame; the figure is framed and its value changes; the waiting card’s frame blinks slowly. Leaving is the flashing backwards and the frame going dark.',
                verdict: not(
                    'it is the boldest and the frame is nostromo’s own tone (Kenny’s pick five times), but alarm vocabulary on ordinary states makes every button and menu cry wolf: a flashing frame is a promise of danger, G13 says a tone never flashes, and the other themes’ tones (synthwave’s neon ring, cyberpunk’s brackets) do the same job. Better as the warning’s rule only.',
                ),
            },
            {
                key: 'raster',
                name: 'The raster',
                see: 'A CRT picture (text lines and a trace) is drawn row by row from the top in twelve steps, a bright beam at the drawn edge with a tail of phosphor behind it, scanlines over the glass and a faint hum band rolling down once drawn. Under it: the switch’s face is drawn in four rows; the menu is drawn row by row with its own beam; the new figure is written over the old one from the top; the waiting card shows a small screen redrawing. Leaving is the beam erasing from the bottom.',
                verdict: not(
                    'the raster is already G2 and G3 (rows from the top, the tube striking on), and true to a CRT, but it is the screen half only: the case (keys, lamps, tape, vents) has nothing to draw in rows. Scanlines and phosphor are also the road to terminal (a screen on everything, rejected in G7) and cyberpunk’s scanline plates, and a beam sweeping down is near synthwave’s marquee in motion.',
                ),
            },
        ],
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="nostromo-anchor"]'));
// Each hint repeats the question, then what this option shows and the
// recommendation line: the dialog shows only the hint of the option on
// screen, so each hint has to stand on its own.
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
lookLine.setAttribute('data-for', 'nostromo');
lookLine.textContent = `One question, six candidates; the first is the recommendation. Pick the anchor that is nostromo to you, or “None of these” with a note. Judge the element in the centre, then whether the four parts under it honestly come from it.`;
look.append(lookLine);

/* ---------------------------------------------------------------- the rows */

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-na-aspects]'));
ASPECTS.forEach((a, n) => {
    const box = document.createElement('section');
    box.className = 'na-aspect';
    box.id = `na-${a.id}`;
    box.setAttribute('data-na-aspect', a.id);
    box.setAttribute('aria-labelledby', `h-na-${a.id}`);
    box.innerHTML = `<div class="na-aspect__head">
        <h3 id="h-na-${a.id}"><span class="na-aspect__no">${n + 1}</span> ${a.label}</h3>
        <p class="na-aspect__q"></p><p class="na-aspect__why"></p></div><div class="na-grid"></div>`;
    /** @type {HTMLElement} */ (box.querySelector('.na-aspect__q')).textContent = a.question;
    /** @type {HTMLElement} */ (box.querySelector('.na-aspect__why')).textContent = a.why;
    const grid = /** @type {HTMLElement} */ (box.querySelector('.na-grid'));
    a.options.forEach((o, at) => {
        const col = document.createElement('div');
        col.className = 'na-col';
        col.setAttribute('data-na-option', String(at + 1));
        col.innerHTML = `<p class="na-label"><span class="na-label__no">${at + 1}</span> <span class="na-label__name"></span>${
            at === 0 ? ' <span class="na-label__rec">Recommended</span>' : ''
        }</p><p class="na-see"></p><p class="na-verdict"></p>
        <div class="na-scene" data-na-kind="cycle" data-na-${a.id}="${o.key}" data-na-phase="in">${scene(o.key)}</div>`;
        /** @type {HTMLElement} */ (col.querySelector('.na-label__name')).textContent = o.name;
        /** @type {HTMLElement} */ (col.querySelector('.na-see')).textContent = o.see;
        const verdict = /** @type {HTMLElement} */ (col.querySelector('.na-verdict'));
        verdict.textContent = o.verdict;
        verdict.classList.toggle('na-verdict--rec', at === 0);
        grid.append(col);
    });
    rows.append(box);
});

/* ---------------------------------------------------------- the one clock */

// One clock plays every scene, so the options always start together. One
// cycle: `gap` (the anchor idles, what arrives is away), `in` (it arrives),
// `hold` (it stands, loops run), `out` (it leaves). The CSS keys every
// motion to these phases; the clock only sets the attribute.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-na-motion]');
let slow = 1;
const PHASES = /** @type {const} */ ([
    ['gap', 500],
    ['in', 1100],
    ['hold', 1600],
    ['out', 900],
]);
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const el of section.querySelectorAll('.na-scene[data-na-kind="cycle"]')) el.setAttribute('data-na-phase', phase);
}

/* ------------------------------------------ every close is its open reversed */

// Kenny's standing rule (2026-10-07): every close is its open played
// backwards. What a scene hides at `gap` is away; the animations that start
// at `in` in a cell where something away has come to stay by `hold` are its
// arrivals, noted with their keyframes and timing as the CSS gave them; at
// `out` every one is played backwards over its cell's whole arrival: the
// same keyframes, curve and pace, what arrived last leaving first. Keyed to
// the phase attribute, not to the clock, so whatever sets the phase (the
// clock, research/_review/measure-motion.mjs) gets the same close. Looping
// animations are infinite and never part of an arrival: the loops stop at
// `out` and the arrival's own frames close the picture.
/** @type {WeakMap<Element, { target: Element, pseudo: string | null, keyframes: Keyframe[], timing: EffectTiming }[]>} */
const arrivalsOf = new WeakMap();
/** @type {WeakMap<Element, Animation[]>} */
const closesOf = new WeakMap();
/** @type {WeakMap<Element, Set<Element>>} */
const awayOf = new WeakMap();
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

/** What the scene hides at `gap`. One style read per element, no layout. */
function noteAway(/** @type {Element} */ el) {
    const away = new Set();
    for (const child of el.querySelectorAll('*')) if (isAway(child)) away.add(child);
    awayOf.set(el, away);
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

/** At `in`: every finite animation that starts now may be part of an arrival. */
function noteArrivals(/** @type {Element} */ el) {
    inAt.set(el, Number(document.timeline.currentTime));
    arrivalsOf.set(
        el,
        el
            .getAnimations({ subtree: true })
            .filter((a) => isMotion(a) && a.playState !== 'finished')
            .map(noted),
    );
}

/** At `hold`: a cell arrived when something that was away at `gap` stands there now. */
function keepArrivals(/** @type {Element} */ el) {
    const cellOf = (/** @type {Element} */ x) => x.closest('.na-part') || el;
    const arrived = new Set([...(awayOf.get(el) || [])].filter((x) => !isAway(x)).map(cellOf));
    arrivalsOf.set(
        el,
        (arrivalsOf.get(el) || []).filter((x) => arrived.has(cellOf(x.target))),
    );
}

/** At `out`: what to play backwards, read now; the function it returns plays it and says how long it takes. */
function closeByReverse(/** @type {Element} */ el) {
    const now = el.getAnimations({ subtree: true }).filter(isMotion);
    const ownLeaves = now.filter((a) => a.playState !== 'finished').map((a) => /** @type {KeyframeEffect} */ (a.effect));
    const same = (
        /** @type {{ target: Element, pseudo: string | null }} */ x,
        /** @type {{ target: Element | null, pseudoElement: string | null }} */ e,
    ) => e.target === x.target && e.pseudoElement === x.pseudo;
    const arrived = arrivalsOf.get(el) || [];
    const since = inAt.get(el) ?? Infinity;
    const holding = now
        .filter((a) => a.playState === 'finished' && (a.startTime === null || Number(a.startTime) >= since - 1))
        .map(noted)
        .filter((x) => !arrived.some((y) => y.target === x.target && y.pseudo === x.pseudo));
    const arrivals = [...arrived, ...holding].filter((x) => x.target.isConnected && !ownLeaves.some((e) => same(x, e)));
    const cellOf = (/** @type {Element} */ x) => x.closest('.na-part') || el;
    /** @type {Map<Element, number>} */
    const spans = new Map();
    for (const x of arrivals) spans.set(cellOf(x.target), Math.max(spans.get(cellOf(x.target)) || 0, endOf(x.timing)));
    // Read now, play later: the observer reads every scene before it writes any.
    return () => {
        closesOf.set(
            el,
            arrivals.map((x) =>
                x.target.animate(x.keyframes, {
                    ...x.timing,
                    delay: (spans.get(cellOf(x.target)) || 0) - endOf(x.timing),
                    endDelay: 0,
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
    const at = (/** @type {string} */ phase) => scenes.filter((el) => el.getAttribute('data-na-phase') === phase);
    // Every read first, for every scene, then every write.
    for (const el of at('gap')) noteAway(el);
    for (const el of at('hold')) keepArrivals(el);
    for (const el of at('in')) noteArrivals(el);
    const closes = at('out').map(closeByReverse);
    // The closed pose holds through `gap`; the next arrival takes over.
    for (const el of at('in')) for (const a of closesOf.get(el) || []) a.cancel();
    if (closes.length) closing = Math.max(0, ...closes.map((play) => play()));
}).observe(section, { subtree: true, attributeFilter: ['data-na-phase'] });

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
radio('data-na-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--na-slow', String(slow));
    run(0);
});
radio('data-na-state', (value) => {
    section.setAttribute('data-na-show', value);
});
document.querySelector('[data-na-replay]')?.addEventListener('click', () => run(0));

// The links and buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.na-scene a, .na-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
