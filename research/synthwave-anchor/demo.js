// Synthwave's anchor element, round 2 (Kenny, 2026-10-07 20:41): "I like option 1
// best [the neon horizon], but not sure how that plays out in real life, like
// that button press, that's waaay bigger than the button itself? that's not
// right? come up with a couple of new attempts and show them in an actual page
// before attempting the next demo."
//
// The fault of round 1: the anchor was drawn on a stage of its own, at a scale
// that is not the real component's. Round 2 fixes the principle: the anchor is a
// proportionate part of the real components, drawn at each component's real size.
// Each attempt is ONE rule of scale; each is shown as a real page built from the
// package's own components (.kp-page, .kp-page-header, .kp-kpi, .kp-card,
// .kp-button, .kp-field, .kp-table, .kp-alert, .kp-toast, .kp-progressbar,
// .kp-badge), with the anchor applied across it.
//
// A review-kit demo in aspect mode, synthwave only, ONE aspect ("anchor") with one
// attempt per page in the dialog. options.css draws each attempt, scoped by
// `data-sa-anchor="<key>"` on the scene. The one clock below writes
// `data-sa-phase` (gap, in, hold, out) on every scene; the CSS keys every arrival
// to it and plays every leave as the same keyframes backwards, so a leave is its
// arrival reversed. During `hold` the clock also plays a short hand: it hovers and
// presses the primary button, hovers a tile and focuses a field (classes only, the
// same classes a real hand sets).

/* ------------------------------------------------------------- the texts */

const ASPECT = {
    id: 'anchor',
    label: 'The anchor element',
    question: 'Which attempt is synthwave’s anchor: the neon horizon, drawn into the real components?',
    why: 'Round 1 drew the horizon on a stage of its own and its press was far bigger than the button. Each attempt below is one rule of scale, shown on the package’s own components at their real size, so you can see how it plays out in real life: a loading state, a card arriving, a toast leaving, a button press, hover and focus.',
};

const OPTIONS = [
    {
        key: 'foot',
        name: 'The foot line',
        rule: 'Scale rule: the tube lies on the foot of every component, exactly as wide as the component and 2 px thick; the floor above it is 42 % of the component’s own height, four rows, and only on blocks. A button gets the hairline alone.',
        see: 'Every component stands on its own horizon. A tile, card, toast or table arrives by its tube being struck across the foot from the middle and the component rising out of it; a hand on a button or a field turns its tube up; a press lights the floor; a busy table’s floor runs into its tube.',
        shows: 'The existing part that already shows it: every card’s tape stripe and neon base, the toast’s stripe drawn from the centre, the busy road.',
        overlap:
            'Overlap: solstice’s horizon line (a divider) and nostromo’s tube strike. Here the line is on each component’s foot, with a floor of four rows above it; that is not theirs.',
    },
    {
        key: 'page',
        name: 'The page horizon',
        rule: 'Scale rule: one tube for the whole page, as wide as the page column and 3 px thick, on the foot of the page header; the floor is the page below it. A component carries no tube: its top edge is 1 px of the horizon’s colour, and under a hand the horizon lights up exactly as wide as that component.',
        see: 'The page has one line. It is struck first, the floor comes up under it, the components rise out of the floor. While the page works a slice of light runs along the tube. Hover, focus and press move a brighter piece of the tube under the component, as wide as it is; the header’s buttons stand right on it.',
        shows: 'The existing part that already shows it: the band’s neon rule and the hero’s horizon and floor (the page, not a component).',
        overlap:
            'Overlap: solstice’s horizon divider is the same idea of one line; solstice draws it as a divider between sections, here it is the page’s single line with a floor, and it follows the hand.',
    },
    {
        key: 'lit',
        name: 'The lit length',
        rule: 'Scale rule: every component with a state has a hairline on its foot, the full width; the lit part of it is the state times that width, 2 px thick. A bar’s progress, how much of a table has come in, how valid a field is, how full a tile is, how ready a button is. Nothing else is drawn.',
        see: 'The tube is data. A progress bar’s foot tube is lit as far as the bar is; a busy table has a slice of light running; a valid field is lit all along, an invalid one only a third in laser yellow; a tile is lit to its value; a button lights its whole length when a hand is on it.',
        shows: 'The existing part that already shows it: the progress bar’s glowing head and the meter inside a key figure; the tube strike of the check.',
        overlap:
            'Overlap: a progress bar is every theme’s lit length (forest’s tree, titanium’s loading); here it is the foot of every component, not only the bar. Closest cousin: nostromo’s LED bank, which is a row of lamps and not one line.',
    },
    {
        key: 'press',
        name: 'The press horizon',
        rule: 'Scale rule: the tube is a hairline as wide as the component and its height is the state. At rest nothing is drawn. A hand on it puts the tube on the foot; a press (or a wait) lifts it to 80 % of the component’s own height (below the label), with the other 20 % as floor under it. The same tube is the arrival: it rides the rising edge up and is gone at the top.',
        see: 'A calm page that lights only where you touch it. Hover or focus: the tube on the foot. Press: the tube rises to 80 % of the height and the floor appears under it (on the primary button that is a few pixels of a 36 px button, not a stage). A busy table holds the tube at 80 % with the floor running. A card or toast arrives behind a tube that is its rising edge.',
        shows: 'The existing part that already shows it: the button’s sun cut (two slits across it on hover) and the dialog’s horizon rise.',
        overlap:
            'Overlap: nostromo’s tube strike is also a bright line that crosses a part, and cyberpunk wipes a part in with an edge; the tube standing at a fixed share of the component and the floor under it are synthwave’s.',
    },
];

/* ------------------------------------------------------------ the real page */

/** A skeleton-free table of four rows: the package's own .kp-table, with badges. */
const TABLE = `<div class="kp-table-wrap" data-sa-host="table" data-sa-busy>
    <table class="kp-table">
        <caption class="kp-sr-only">Readings from the pump houses</caption>
        <thead><tr><th scope="col">Pump house</th><th scope="col">State</th><th scope="col" class="kp-text-end">Pressure</th><th scope="col">Last reading</th></tr></thead>
        <tbody>
            <tr><td>Pump house 1</td><td><span class="kp-badge kp-badge--success">Online</span></td><td class="kp-text-end">3.4 bar</td><td>06/10/2026 06:12</td></tr>
            <tr><td>Pump house 3</td><td><span class="kp-badge kp-badge--warning">Low</span></td><td class="kp-text-end">2.1 bar</td><td>06/10/2026 06:10</td></tr>
            <tr><td>Pump house 7</td><td><span class="kp-badge">No reading</span></td><td class="kp-text-end">&ndash;</td><td>06/10/2026 06:00</td></tr>
            <tr><td>Pump house 9</td><td><span class="kp-badge kp-badge--success">Online</span></td><td class="kp-text-end">3.2 bar</td><td>06/10/2026 06:11</td></tr>
        </tbody>
    </table>
</div>`;

/** One page of the package's own components. `p` makes every id unique per attempt. */
function realPage(p) {
    const tile = (
        i,
        label,
        value,
        small,
        trend,
        v,
        meter,
    ) => `<div class="kp-kpi sa-arr sa-k-rise" data-sa-host="kpi" data-sa-arrive style="--i: ${i}; --sa-v: ${v}">
            <span class="kp-kpi__label">${label}</span>
            <span class="kp-kpi__value">${value}<small>${small}</small></span>
            <span class="kp-kpi__trend">${trend}</span>
            ${meter ? `<span class="kp-kpi__meter" role="meter" aria-label="${label}: ${Math.round(v * 100)} %" aria-valuenow="${Math.round(v * 100)}" aria-valuemin="0" aria-valuemax="100" style="--kp-value: ${v}"></span>` : ''}
        </div>`;
    return `<div class="sa-real sa-part" data-sa-real>
    <i class="sa-mark" aria-hidden="true"></i>
    <i class="sa-horizon" aria-hidden="true"><b class="sa-horizon__floor sa-arr sa-k-fade"></b><b class="sa-horizon__ghost sa-arr sa-k-draw"></b><b class="sa-horizon__far sa-arr sa-k-draw"></b><b class="sa-horizon__tube sa-arr sa-k-draw"></b><b class="sa-horizon__run"></b><b class="sa-horizon__seg"></b></i>
    <div class="kp-page">
        <header class="kp-page-header" data-sa-host="header">
            <div class="kp-page-header__inner">
                <div>
                    <h1 class="kp-page-header__title">Pump houses</h1>
                    <p class="kp-page-header__description">Fifteen pump houses on the northern network: their state, the last reading of each, and what needs a visit.</p>
                </div>
                <div class="kp-page-header__actions">
                    <button type="button" class="kp-button kp-button--secondary" data-sa-host="button">Export readings</button>
                    <button type="button" class="kp-button" data-sa-host="button">Schedule a visit</button>
                    <button type="button" class="kp-button kp-button--primary" data-sa-host="button" data-sa-poke="press">Add a pump house</button>
                    <button type="button" class="kp-icon-button" data-sa-host="icon" aria-label="More actions" aria-haspopup="menu">⋯</button>
                </div>
            </div>
        </header>

        <div class="kp-alert kp-alert--warning sa-arr sa-k-rise" role="status" data-sa-host="alert" data-sa-arrive data-sa-warn style="--i: 0; --sa-v: 1">
            <span><strong>Pump house 7 has sent no reading since 06:00.</strong> The unit answers a ping; its modem may need a restart.</span>
        </div>

        <div class="kp-kpis" role="group" aria-label="Network at a glance">
            ${tile(1, 'Pump houses online', '14', 'of 15', 'Pump house 7 offline', 0.93, true)}
            ${tile(2, 'Flow now', '412', 'm³/h', '6 % on yesterday', 0.62)}
            ${tile(3, 'Mean pressure', '3.2', 'bar', 'Within range', 0.8)}
            ${tile(4, 'Open incidents', '3', '', '1 critical', 0.3, true)}
        </div>

        <div class="sa-grid">
            <section class="kp-card sa-arr sa-k-rise" data-sa-host="card" data-sa-arrive style="--i: 5; --sa-v: 0.66" aria-labelledby="${p}-h1">
                <div class="sa-stack">
                    <div class="sa-head"><h2 class="kp-card__title" id="${p}-h1">Syncing readings</h2><span class="kp-badge">Live</span></div>
                    <p>Four pump houses are answering. <span class="sa-pct"></span> of the night’s readings are in.</p>
                    <div class="sa-wrap" data-sa-host="bar">
                        <div class="kp-progressbar" role="progressbar" aria-label="Syncing readings" data-sa-prog><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>
                    </div>
                    ${TABLE}
                </div>
            </section>

            <section class="kp-card sa-arr sa-k-rise" data-sa-host="card" data-sa-arrive style="--i: 6; --sa-v: 0.66" aria-labelledby="${p}-h2">
                <div class="sa-stack">
                    <div class="sa-head"><h2 class="kp-card__title" id="${p}-h2">Alarm threshold</h2><span class="kp-badge kp-badge--warning">2 of 3 valid</span></div>
                    <p>The pressure at which a pump house raises an alarm.</p>
                    <div class="kp-field">
                        <label class="kp-field__label" for="${p}-site">Site</label>
                        <span class="sa-wrap" data-sa-host="field" data-sa-poke="focus" style="--sa-v: 1"><input class="kp-field__input" id="${p}-site" type="text" value="Pump house 4" /></span>
                    </div>
                    <div class="kp-field kp-field--invalid">
                        <label class="kp-field__label" for="${p}-bar">Alarm threshold (bar)</label>
                        <span class="sa-wrap" data-sa-host="field" data-sa-warn style="--sa-v: 0.3"><input class="kp-field__input" id="${p}-bar" type="text" value="13.2" aria-invalid="true" aria-describedby="${p}-err" /></span>
                        <span class="kp-field__error" id="${p}-err">Enter a pressure from 0 to 10 bar.</span>
                    </div>
                    <div class="sa-actions-row">
                        <button type="button" class="kp-button kp-button--primary" data-sa-host="button">Save</button>
                        <button type="button" class="kp-button" data-sa-host="button">Cancel</button>
                        <button type="button" class="kp-button kp-button--secondary" data-sa-host="button" aria-haspopup="dialog">Open the dialog</button>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <div class="kp-toasts" role="status">
        <div class="kp-toast kp-toast--success sa-arr sa-k-rise" data-sa-host="toast" data-sa-arrive style="--i: 8; --sa-v: 1">
            <span class="kp-toast__body"><b>Saved.</b> Pump house 4 keeps its threshold.</span>
            <button type="button" class="kp-icon-button kp-toast__close" aria-label="Close">×</button>
        </div>
    </div>
</div>`;
}

/* ------------------------------------------------ the overlay on each host */

/** Which hosts get the floor (blocks) and which only the line. */
const BLOCKS = new Set(['kpi', 'card', 'alert', 'toast', 'table']);

/** The classes an arriving part gets, per attempt. A host's own kind is `sa-k-rise`. */
const ARRIVE = {
    foot: { tube: 'sa-k-draw', floor: 'sa-k-fade' },
    page: { edge: 'sa-k-fade' },
    lit: { tube: 'sa-k-fade', lit: 'sa-k-lit' },
    press: { scan: 'sa-k-scan' },
};

function addOverlays(scene, key) {
    const arrive = ARRIVE[key];
    for (const host of scene.querySelectorAll('[data-sa-host]')) {
        const kind = host.getAttribute('data-sa-host');
        host.classList.add('sa-host');
        const fx = document.createElement('i');
        fx.className = 'sa-fx';
        fx.setAttribute('aria-hidden', 'true');
        fx.setAttribute('data-sa-fx', BLOCKS.has(kind) ? 'block' : 'line');
        const arrives = host.hasAttribute('data-sa-arrive');
        for (const part of ['floor', 'tube', 'lit', 'scan', 'edge']) {
            const b = document.createElement('b');
            b.className = `sa-fx__${part}`;
            if (arrives && arrive[part]) b.className += ` sa-arr ${arrive[part]}`;
            fx.append(b);
        }
        host.append(fx);
    }
}

/* ---------------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="synthwave-anchor"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: ASPECT.id,
            label: ASPECT.label,
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: o.name,
                hint: `${o.rule} ${o.overlap}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'synthwave');
lookLine.textContent = `One question, ${OPTIONS.length} attempts at the neon horizon, each on a real page at the real size of its components. Watch the loading bar and table, a card and a toast arriving and leaving, the primary button pressed, a tile hovered and a field focused; then hover and press anything yourself. Pick the attempt that is synthwave’s anchor, or “None of these” with a note.`;
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
    col.innerHTML = `<p class="sa-label-row"><span class="sa-label-row__no">${at + 1}</span> <span class="sa-label-row__name"></span></p>
        <p class="sa-rule"></p><p class="sa-see"></p><p class="sa-verdict"></p>
        <div class="sa-scene" data-sa-kind="cycle" data-sa-${ASPECT.id}="${o.key}" data-sa-phase="in">${realPage(`${o.key}`)}</div>
        <p class="sa-measured" data-sa-measured></p>`;
    /** @type {HTMLElement} */ (col.querySelector('.sa-label-row__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.sa-rule')).textContent = o.rule;
    /** @type {HTMLElement} */ (col.querySelector('.sa-see')).textContent = o.see;
    /** @type {HTMLElement} */ (col.querySelector('.sa-verdict')).textContent = `${o.shows} ${o.overlap}`;
    six.append(col);
    addOverlays(/** @type {HTMLElement} */ (col.querySelector('.sa-scene')), o.key);
    if (toc) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#sa-option-${at + 1}"></a>`;
        /** @type {HTMLElement} */ (li.firstElementChild).textContent = o.name;
        toc.append(li);
    }
});
rows.append(row);

/* ----------------------------------------------- hands: hover, focus, press */

// The same classes a real hand sets (`sa-hot`, `sa-focus`, `sa-down`), so the loop
// and a real pointer draw exactly the same. Only the nearest host is lit.
const scenes = [...section.querySelectorAll('.sa-scene[data-sa-kind="cycle"]')];

function nearest(/** @type {EventTarget | null} */ t) {
    return t instanceof Element ? t.closest('[data-sa-host]') : null;
}

/** Page attempt: the piece of the horizon under a component, as wide as it is. */
function light(/** @type {HTMLElement} */ scene, /** @type {Element | null} */ host) {
    const horizon = /** @type {HTMLElement | null} */ (scene.querySelector('.sa-horizon'));
    if (!horizon) return;
    if (!host) {
        horizon.removeAttribute('data-sa-lit');
        return;
    }
    const base = horizon.getBoundingClientRect();
    const r = host.getBoundingClientRect();
    horizon.style.setProperty('--sa-sx', `${Math.max(r.left - base.left, 0)}px`);
    horizon.style.setProperty('--sa-sw', `${Math.min(r.width, base.width)}px`);
    horizon.setAttribute('data-sa-lit', '');
}

function setClass(/** @type {HTMLElement} */ scene, /** @type {Element | null} */ host, /** @type {string} */ cls, /** @type {boolean} */ on) {
    if (!host) return;
    host.classList.toggle(cls, on);
    if (cls === 'sa-hot' || cls === 'sa-focus') {
        const any = scene.querySelector('.sa-hot, .sa-focus');
        light(scene, on ? host : any);
    }
}

for (const scene of /** @type {HTMLElement[]} */ (scenes)) {
    scene.addEventListener('pointerover', (e) => {
        const host = nearest(e.target);
        for (const old of scene.querySelectorAll('.sa-hot')) if (old !== host) setClass(scene, old, 'sa-hot', false);
        setClass(scene, host, 'sa-hot', true);
    });
    scene.addEventListener('pointerleave', () => {
        for (const old of scene.querySelectorAll('.sa-hot, .sa-down')) old.classList.remove('sa-hot', 'sa-down');
        light(scene, scene.querySelector('.sa-focus'));
    });
    scene.addEventListener('pointerdown', (e) => setClass(scene, nearest(e.target), 'sa-down', true));
    for (const up of ['pointerup', 'pointercancel']) {
        scene.addEventListener(up, () => {
            for (const old of scene.querySelectorAll('.sa-down')) old.classList.remove('sa-down');
        });
    }
    scene.addEventListener('focusin', (e) => setClass(scene, nearest(e.target), 'sa-focus', true));
    scene.addEventListener('focusout', (e) => setClass(scene, nearest(e.target), 'sa-focus', false));
}

/** The loop’s hand, during `hold`: hover the primary button, press it, release, hover a tile, focus a field, let go. */
const HAND = [
    [250, 'sa-hot', '[data-sa-poke="press"]', true],
    [1000, 'sa-down', '[data-sa-poke="press"]', true],
    [1550, 'sa-down', '[data-sa-poke="press"]', false],
    [2050, 'sa-hot', '[data-sa-poke="press"]', false],
    [2150, 'sa-hot', '.kp-kpi:nth-of-type(2)', true],
    [2800, 'sa-hot', '.kp-kpi:nth-of-type(2)', false],
    [2900, 'sa-focus', '[data-sa-poke="focus"]', true],
    [3700, 'sa-focus', '[data-sa-poke="focus"]', false],
];
let handTimers = [];
function clearHand() {
    for (const t of handTimers) clearTimeout(t);
    handTimers = [];
    for (const scene of /** @type {HTMLElement[]} */ (scenes)) {
        for (const el of scene.querySelectorAll('.sa-hot, .sa-down, .sa-focus')) {
            // A real pointer or focus stays; only the loop's own marks go.
            if (el.hasAttribute('data-sa-loop')) {
                el.removeAttribute('data-sa-loop');
                el.classList.remove('sa-hot', 'sa-down', 'sa-focus');
            }
        }
        light(scene, scene.querySelector('.sa-hot, .sa-focus'));
    }
}
function playHand() {
    clearHand();
    for (const [at, cls, selector, on] of HAND) {
        handTimers.push(
            window.setTimeout(() => {
                if (dialogPaused()) return;
                for (const scene of /** @type {HTMLElement[]} */ (scenes)) {
                    const host = scene.querySelector(selector);
                    if (host && on) host.setAttribute('data-sa-loop', '');
                    setClass(scene, host, cls, on);
                }
            }, at * slow),
        );
    }
}

/* ---------------------------------------------------------- the one clock */

// One cycle per scene: `gap` (what arrives is away), `in` (it arrives), `hold`
// (it stands, and the loop's hand plays), `out` (it leaves, every arrival
// backwards). The CSS keys every motion to the phase attribute; the clock only
// writes it. Every arrival and leave lasts the scene's --T (1600 ms), inside `in`
// and `out`.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-sa-motion]');
let slow = 1;
let mode = 'auto';
const PHASES = /** @type {const} */ ([
    ['gap', 700],
    ['in', 2000],
    ['hold', 4000],
    ['out', 2000],
]);
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
function dialogPaused() {
    return Boolean(document.getElementById('rv-flip-pause')?.textContent);
}

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) scene.setAttribute('data-sa-phase', phase);
}

function run(/** @type {number} */ at = 0) {
    clearTimeout(timer);
    clearHand();
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
    if (phase === 'hold' && mode === 'auto') playHand();
    // "At rest" stops once the page stands; "Arriving only" skips the leave.
    if (mode === 'rest' && phase === 'hold') return;
    const next = mode === 'arrive' && phase === 'hold' ? 0 : (at + 1) % PHASES.length;
    timer = window.setTimeout(() => run(next), ms * slow);
}

/* --------------------------------------------------------------- controls */

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

// The buttons in the pages are scenery: a click does nothing but press.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.sa-scene a, .sa-scene button') : null;
    if (target) event.preventDefault();
});

/* ------------------------------------------- the page horizon and the numbers */

/** Where the page’s horizon sits: the foot of the header, as wide as the header. Read on a resize only. */
function placeHorizons() {
    for (const scene of /** @type {HTMLElement[]} */ (scenes)) {
        const real = /** @type {HTMLElement | null} */ (scene.querySelector('.sa-real'));
        const header = scene.querySelector('.kp-page-header');
        const horizon = /** @type {HTMLElement | null} */ (scene.querySelector('.sa-horizon'));
        if (!real || !header || !horizon) continue;
        const base = real.getBoundingClientRect();
        const h = header.getBoundingClientRect();
        horizon.style.setProperty('--sa-hy', `${h.bottom - base.top}px`);
        horizon.style.setProperty('--sa-hx', `${h.left - base.left}px`);
        horizon.style.setProperty('--sa-hw', `${h.width}px`);
        measured(scene);
    }
}

const px = (/** @type {number} */ n) => `${Math.round(n * 10) / 10} px`;

/** The numbers under each page: the real component and the drawn part, measured, not assumed. */
function measured(/** @type {HTMLElement} */ scene) {
    const note = scene.parentElement?.querySelector('[data-sa-measured]');
    if (!note) return;
    const key = scene.getAttribute('data-sa-anchor');
    const box = (/** @type {string} */ sel) => scene.querySelector(sel)?.getBoundingClientRect();
    const size = (/** @type {Element | null | undefined} */ el, /** @type {string} */ prop) =>
        el ? parseFloat(getComputedStyle(el).getPropertyValue(prop)) : 0;
    const btn = box('[data-sa-poke="press"]');
    const card = box('.kp-card[data-sa-host]');
    const tile = box('.kp-kpi');
    if (!btn || !card || !tile) return;
    const fx = (/** @type {string} */ host, /** @type {string} */ part) => scene.querySelector(`${host} > .sa-fx > .sa-fx__${part}`);
    const btnTube = fx('[data-sa-poke="press"]', 'tube');
    const cardFloor = fx('.kp-card[data-sa-host]', 'floor');
    const t = size(btnTube, 'height');
    let text = '';
    if (key === 'foot') {
        const fl = size(cardFloor, 'height');
        text = `Measured here: the primary button is ${px(btn.width)} × ${px(btn.height)}; its tube is ${px(btn.width)} × ${px(t)} (the whole width, ${Math.round(btn.height / t)}:1 against its height). The card is ${px(card.width)} × ${px(card.height)}; its tube is ${px(card.width)} × ${px(t)} and its floor ${px(fl)} high (${Math.round((fl / card.height) * 100)} % of the card).`;
    } else if (key === 'page') {
        const hz = scene.querySelector('.sa-horizon__tube');
        text = `Measured here: the page column is ${px(parseFloat(getComputedStyle(scene.querySelector('.sa-horizon') ?? scene).getPropertyValue('--sa-hw')))} wide and the one tube is ${px(size(hz, 'height'))} thick, ${Math.round(btn.height / size(hz, 'height'))}:1 against the ${px(btn.height)} tall primary button that stands on it. Under a hand the bright piece is exactly as wide as the component: ${px(btn.width)} for the primary button, ${px(tile.width)} for a tile. Components carry 1 px.`;
    } else if (key === 'lit') {
        const lit = fx('.kp-kpi', 'lit');
        const w = tile.width * parseFloat(getComputedStyle(scene.querySelector('.kp-kpi') ?? scene).getPropertyValue('--sa-v') || '0');
        text = `Measured here: a tile is ${px(tile.width)} wide and its tube is lit ${px(w)} of it (its meter says ${Math.round((w / tile.width) * 100)} %), ${px(size(lit, 'height'))} thick. The primary button is ${px(btn.width)} × ${px(btn.height)}; hover lights ${px(btn.width)}, ${px(size(btnTube, 'height'))} hairline under it.`;
    } else if (key === 'press') {
        text = `Measured here: the primary button is ${px(btn.width)} × ${px(btn.height)}. The tube is ${px(btn.width)} × ${px(t)} and rests on its foot; pressed it stands ${px(0.8 * btn.height)} from the top, with ${px(0.2 * btn.height)} of floor under it (80 / 20 of the button, below the label). On the card (${px(card.width)} × ${px(card.height)}) the same rule is ${px(0.8 * card.height)} / ${px(0.2 * card.height)}.`;
    }
    note.textContent = text;
}

if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => placeHorizons());
    for (const scene of /** @type {HTMLElement[]} */ (scenes)) ro.observe(scene);
}
document.fonts?.ready.then(placeHorizons);
placeHorizons();

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
