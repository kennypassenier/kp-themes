// research/character-columns: the sixth component of the character round
// (Kenny, form v18, 2026-10-05): the strip of key figures with one column per
// figure (`.kp-kpis[data-kp-kpis-columns]`), two characters per theme drawn
// in the theme's own world, beside the plain strip of today, all 22 themes in
// one demo judged through the review kit.
//
// The strips are the package's own: attachKpiStrips() (js/kpi.js) picks
// every strip's column count from its own width and keeps it as tiles come
// and go. Each character is CSS only, in columns.css, scoped by
// `[data-theme]` and the option's `[data-cl]`; this file only says what each
// one is, writes the tiles, sets the states, and runs the speed. js/kpi.js is
// not changed.

import { attachKpiStrips } from '../../js/kpi.js';
import { THEMES } from '../../js/theme-registry.js';

/** @param {string} an @param {string} at @param {string} bn @param {string} bt */
const two = (an, at, bn, bt) => ({ a: { name: an, text: at }, b: { name: bn, text: bt } });

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: two(
        'The ledger row',
        'A page of an account book: a double rule over the strip, a rule between the columns, each head in the serif’s small capitals over its own rule, the figures set right in the display serif, the words in italics. Still while loading.',
        'The booktabs table',
        'A table from a scholarly book: a heavy rule above, a light one under the heads, a heavy one at the foot, no rules between the columns, every column centred, the figures in the text serif. Still while loading.',
    ),
    light: two(
        'One card',
        'The whole strip is one white card lifted on a soft shadow, its columns parted by short hairlines, the heads in sentence case. Still while loading: the skeletons alone.',
        'The legend chips',
        'Each figure in a soft primary-tinted well with a wide radius, a dot in its column’s chart colour before the head, like a chart’s legend. Still while loading: the skeletons alone.',
    ),
    dark: two(
        'The departure board',
        'An airport board: every number in a split-flap window with a hinge line across its middle, the heads in mono capitals, the strip a dark panel. Loading: the flaps flick.',
        'The rack',
        'A server rack: each figure a rack unit with a screw head at each corner and a lit green status lamp before its head, all in the mono. Still while loading.',
    ),
    cyberpunk: two(
        'The ticker rail',
        'A neon ticker: a glowing magenta rail above and below the strip, the columns parted by a `//` before each head, the figures in tech mono with a cyan halo. Loading: a packet runs along the rail.',
        'The data shards',
        'Each figure a shard with two cut corners and a neon edge, its head on a magenta tab. Loading: a glitch line jumps across each shard.',
    ),
    synthwave: two(
        'The cassette counter',
        'A tape deck: every number in a sunken counter window, every head on a cassette label between a pink and a cyan stripe. Loading: the tape’s teeth turn.',
        'The arcade scoreboard',
        'A high-score table on the night sky: a rank (01, 02, …) before every head, a pink rule under the heads, the figures lit in cyan. Loading: the screen rolls.',
    ),
    pastel: two(
        'The paint swatches',
        'A row of paint chips: each figure on a card with a band of its column’s colour across the top, the heads in sentence case. Loading: a sheen crosses the bands.',
        'The sticky notes',
        'A row of sticky notes in each column’s tint, set a little askew with a flat shadow and the bottom corner folded. Loading: a sheen crosses the notes.',
    ),
    terminal: two(
        'The df -h table',
        'A framed text table as df(1) prints it: a frame and column rules in the phosphor’s dim ink, a dashed rule under the heads, everything in the mono. Loading: a block cursor blinks in each column.',
        'The tmux status bar',
        'The strip a run of tmux status segments in reverse video with arrow ends, every other one in the second colour. Loading: a band runs through the segments.',
    ),
    forest: two(
        'The trail markers',
        'Each figure a rounded wooden post with a painted blaze in its column’s colour, standing on a line of soil; heads in serif italic, centred. Loading: light walks the trail.',
        'The specimen mounts',
        'Each figure a herbarium sheet held by four photo corners, its head in a ruled specimen box in small capitals, the words in italics. Loading: a seed rolls across.',
    ),
    'high-contrast': two(
        'The ruled grid',
        'One table in 2px rules: a frame, a rule between the columns and a rule under the heads, the heads bold, the figures heavy. Still: nothing moves.',
        'The inverse heads',
        'Each figure framed in 2px with its head on an ink band across the top of the frame, the figure heavy on the paper under it. Still: nothing moves.',
    ),
    sepia: two(
        'The typewriter tab stops',
        'A typewriter’s scale along the top of the strip with a tab stop over every column, the heads typed and underlined, everything in the typewriter face. Loading: the carriage steps along.',
        'The card catalogue',
        'A library card catalogue: each figure a drawer front, its head in a brass label holder, a pull ring in the corner. Loading: the drawers breathe.',
    ),
    blueprint: two(
        'The dimension chain',
        'A chain of dimension lines with end ticks over the columns, each tile a drawn box, the heads in technical mono capitals. Loading: a centre line marches along the foot.',
        'The bill of materials',
        'A parts list: a ruled table, each head with its item number in a balloon, the columns parted by rules. Loading: a scan crosses the table.',
    ),
    solstice: two(
        'The horizon',
        'The figures stand on a warm horizon line that glows, the light rising from it behind each column. Loading: the light breathes.',
        'The lanterns',
        'A string across the top of the strip with each figure a rounded lantern hung from it, glowing warm from its top, centred. Loading: the lanterns breathe.',
    ),
    brutalism: two(
        'The poster grid',
        'The columns butted together under thick black rules with a hard offset shadow, every other column on the accent plate, the heads heavy. Loading: a black bar stamps at the foot.',
        'The ticket stubs',
        'Each figure a ticket with notches bitten from its sides, a perforated edge down its left and a heavy outline. Loading: the tickets stamp.',
    ),
    deco: two(
        'The floor indicator',
        'A lift’s floor dial: a gold arc with a fan of rays over every figure, the heads in the display face’s spaced capitals, centred. Loading: a glint runs across.',
        'The colonnade',
        'Fluted gold pilasters in the gaps between the columns, each figure under a stepped double capital. Loading: a glint runs across.',
    ),
    phantom: two(
        'The red-string board',
        'Each figure a card pinned to the board, a red string running from pin to pin across the strip, the cards set a little askew. Loading: the pins beat.',
        'The case files',
        'Each figure a folder with a tab standing up from its top corner, the file number on the tab (FILE 01, 02, …). Loading: the folders shuffle.',
    ),
    'shade-light': two(
        'The window blinds',
        'Slatted light from a window blind falling across every column, a soft round change. Loading: the slats drift.',
        'The paper cut-outs',
        'Each figure a sheet laid on two more, their edges showing below and to the right. Loading: the sheets breathe.',
    ),
    'shade-dark': two(
        'The gallery wall',
        'Each figure a framed piece with an inner mount under its own picture light, centred. Loading: the lights breathe.',
        'The velvet tray',
        'A jeweller’s tray: each figure set into a recessed well, the number in a deeper well, the columns parted by raised ridges. Loading: a sheen crosses the wells.',
    ),
    retro: two(
        'The status bar',
        'A 1995 status bar: a raised grey bar holding a sunken pane per figure, the heads in the system face without capitals. Still while loading.',
        'The list view',
        'A 1995 list view: each head a raised column-header button, the figure in the white list under it, the whole set in a sunken frame. Still while loading.',
    ),
    grotesk: two(
        'The numbered grid',
        'A Swiss grid: a heavy rule over the strip, a hairline over every column, the column number (01, 02, …) in its corner, the figures bold and flush left. Loading: a line runs across the top.',
        'The line colours',
        'Each figure topped by a thick flat block in its column’s colour, like the lines on a transit map, the heads bold in sentence case. Loading: the blocks fill in.',
    ),
    lapis: two(
        'The arcade',
        'An arcade of arches: each figure under a pointed arch framed in a double gold rule, centred, in the display face. Loading: a glint runs across.',
        'The illuminated band',
        'A manuscript’s border: a ribbon of gold lattice across the top of the strip, the figures on vellum panels, the heads in serif italic over a gold rule. Loading: a glint runs across.',
    ),
    nostromo: two(
        'The readout bank',
        'A bank of screen readouts: each figure a segment of glass with corner brackets, its head on an inverse tape, all in the mono. Loading: a sweep rolls down each screen.',
        'The bulkhead',
        'A bulkhead: hazard chevrons along the foot of the strip, each figure on a riveted plate, the heads stencilled in heavy spaced capitals. Loading: the chevrons march.',
    ),
    titanium: two(
        'The anodised bars',
        'A brushed plate per figure with an anodised edge in its column’s colour, the heads in small capitals, the figures in instrument mono. Loading: light rises along the edge.',
        'The machined bezels',
        'Each figure cut as a chamfered plate, the number behind a chamfered bezel with an inner shadow. Loading: the grain runs.',
    ),
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="columns"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, t]) => [theme, `${t[which].name}. ${t[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'columns',
            label: 'The key-figure strip for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain strip, as today',
                    hint: 'Keep the package strip in this theme: the same shape as everywhere, in the theme’s colours.',
                },
            ],
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lower = (/** @type {string} */ name) => name.replace(/^(The|A|One) /, (m) => m.toLowerCase());
for (const [theme, t] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Character 1 is ${lower(t.a.name)}, character 2 ${lower(t.b.name)}; the third is the plain strip of today. ` +
        'Look at the strip as a whole first (does it read as one row?), then at a column: the head, the number and its unit, the change on its plate, the rules. ' +
        'Press Loading, Nothing to show and Could not read: the strip keeps its height. Try a long label, a wide value, many columns and two, and the live update; ' +
        'then look at the phone pane under each strip: how the columns wrap there.';
    look.append(p);
}

/* ------------------------------------------------------------ the data */

// Pump house 1 at a fixed now (20/10/2026 14:40 in Brussels); a live update
// moves every figure one step, the same on every load.
/**
 * @typedef {{ label: string, value: number, unit?: string, digits: number, words: string,
 *   delta?: number, upIs?: 'good' | 'bad', step: number }} Figure
 */
/** @type {Record<string, Figure>} */
const F = {
    pressure: { label: 'Pressure', value: 3.12, unit: 'bar', digits: 2, words: 'this hour', delta: 0.04, upIs: 'good', step: -0.01 },
    flow: { label: 'Flow', value: 412, unit: 'm³/h', digits: 0, words: 'this hour', delta: -12, upIs: 'good', step: 6 },
    north: { label: 'Reservoir North', value: 71, unit: '%', digits: 0, words: 'target 80 %', step: 1 },
    south: { label: 'Reservoir South', value: 64, unit: '%', digits: 0, words: 'target 80 %', delta: -2, upIs: 'good', step: -1 },
    incidents: { label: 'Open incidents', value: 2, digits: 0, words: 'one needs a visit', step: 0 },
    late: { label: 'Readings late', value: 1, digits: 0, words: 'pump house 7', step: 0 },
    energy: { label: 'Energy today', value: 1834, unit: 'kWh', digits: 0, words: 'night tariff 22:00', step: 21 },
    visits: { label: 'Visits planned', value: 3, digits: 0, words: 'this week', step: 0 },
    far: {
        label: 'Pressure, far end of the ring',
        value: 2.41,
        unit: 'bar',
        digits: 2,
        words: 'Pleinstraat',
        delta: 0.03,
        upIs: 'good',
        step: -0.01,
    },
    delivered: { label: 'Delivered this year', value: 12_400_550, unit: 'm³', digits: 0, words: 'since 01/01/2026', step: 4120 },
};

/** @type {Record<string, (keyof typeof F)[]>} */
const SETS = {
    five: ['pressure', 'flow', 'north', 'south', 'incidents'],
    long: ['far', 'flow', 'north', 'south', 'incidents'],
    wide: ['pressure', 'delivered', 'north', 'south', 'incidents'],
    many: ['pressure', 'flow', 'north', 'south', 'incidents', 'late', 'energy', 'visits'],
    two: ['pressure', 'flow'],
};

const WORDS = {
    empty: 'no reading yet',
    error: 'could not read',
};

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    set: 'five',
    ticks: 0,
};

const number = (/** @type {Figure} */ f, /** @type {number} */ v) =>
    v.toLocaleString('en-GB', { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits });

/** @param {string} width @param {string} [height] */
const skeleton = (width, height) => {
    const s = document.createElement('span');
    s.className = 'kp-skeleton';
    s.style.inlineSize = width;
    if (height) s.style.setProperty('--kp-skeleton-height', height);
    return s;
};

/** One tile, in the package's markup. @param {Figure} f */
function tile(f) {
    const el = document.createElement('div');
    el.className = 'kp-kpi';
    const label = Object.assign(document.createElement('span'), { className: 'kp-kpi__label', textContent: f.label });
    label.title = f.label;
    const value = Object.assign(document.createElement('span'), { className: 'kp-kpi__value' });
    const words = Object.assign(document.createElement('span'), { className: 'kp-kpi__trend' });
    if (state.shown === 'loading') {
        value.append(skeleton('3ch', '1.75rem'));
        words.append(skeleton('80%'));
    } else if (state.shown !== 'ready') {
        value.textContent = '—';
        words.textContent = WORDS[state.shown];
    } else {
        const v = f.value + state.ticks * f.step;
        value.textContent = number(f, v);
        if (f.unit) value.append(Object.assign(document.createElement('small'), { textContent: f.unit }));
        if (f.delta != null) {
            const d = f.delta + (state.ticks % 2 ? f.step : 0);
            const up = d > 0;
            const delta = document.createElement('span');
            delta.className = 'kp-kpi__delta';
            delta.setAttribute('data-kp-direction', up ? 'up' : 'down');
            delta.setAttribute('data-kp-tone', up === (f.upIs === 'good') ? 'good' : 'bad');
            delta.textContent = `${number(f, Math.abs(d))}${f.unit === '%' ? '%' : f.unit ? ` ${f.unit}` : ''}`;
            words.append(delta, ` ${f.words}`);
        } else words.textContent = f.words;
    }
    el.append(label, value, words);
    return el;
}

const strips = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-cl-strip]')]);

function draw() {
    const figures = SETS[state.set].map((key) => F[key]);
    for (const strip of strips()) {
        if (state.shown === 'loading') strip.setAttribute('aria-busy', 'true');
        else strip.removeAttribute('aria-busy');
        // A live update keeps the tiles and rewrites their insides, as a page
        // updating in place would; a new set of figures writes them anew.
        const tiles = [...strip.children];
        if (tiles.length === figures.length) figures.forEach((f, at) => tiles[at].replaceChildren(...tile(f).childNodes));
        else strip.replaceChildren(...figures.map(tile));
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of section.querySelectorAll('[data-cl-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cl-state') ?? 'ready');
        pressed('data-cl-state', state.shown);
        draw();
    });

for (const b of section.querySelectorAll('[data-cl-data]'))
    b.addEventListener('click', () => {
        state.set = b.getAttribute('data-cl-data') ?? 'five';
        pressed('data-cl-data', state.set);
        draw();
    });

// A live update: ten minutes later, every figure one step on.
section.querySelector('[data-cl-live]')?.addEventListener('click', () => {
    state.ticks += 1;
    state.shown = 'ready';
    pressed('data-cl-state', 'ready');
    draw();
});

draw();
attachKpiStrips(section);

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-cl-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== theme;
    const t = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-cl-name="${which}"]`);
        const desc = document.querySelector(`[data-cl-desc="${which}"]`);
        if (name) name.textContent = t ? t[which].name : '';
        if (desc) desc.textContent = t ? t[which].text : '';
    }
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cl-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-trend; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('cl-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: full speed.
}
const slowNow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const speedButtons = [...document.querySelectorAll('[data-cl-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-cl-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-cl-speed'));
        try {
            localStorage.setItem('cl-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

/* ----------------------------------------------------- the pick shown */

// What is ticked in the review dialog is what the page marks.
section.addEventListener('review:choice', (event) => {
    const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    for (const col of section.querySelectorAll('[data-cl-pick]')) col.classList.toggle('cl-picked', col.getAttribute('data-cl-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.cl-picked')) col.classList.remove('cl-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
