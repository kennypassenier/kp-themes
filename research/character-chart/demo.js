// research/character-chart: the second component of the character round
// (Kenny, form v18, 2026-10-05): the time chart, two characters per theme
// drawn in the theme's own world, beside the plain chart of today, all 22
// themes in one demo judged through the review kit.
//
// The charts are the package's own: attachCharts() (js/chart.js) draws the
// plot, the axes, the lines and areas, the tooltip, the legend, the zoom chip,
// the states and the spark lines, and keeps every behaviour. Each character is
// CSS only, in charts.css, scoped by `[data-theme]` and the column's
// `[data-cc]`; this file only says what each one is, gives the charts their
// readings, sets the states, and runs the speed.

import { attachCharts, chartSelect, chartZoom, setChartData } from '../../js/chart.js';
import { THEMES } from '../../js/theme-registry.js';
import { NOW, sampleData } from '../../catalogue/chart-sample.js';

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: {
        a: {
            name: 'The annual report',
            text: 'A chart from a printed annual report: a navy rule over the plot and a hairline under it, the grid in dotted hairlines, the tick labels in the serif with old-style figures. The lines are drawn fine, the area is a faint wash. The tooltip is a footnote with a navy rule on top and the time in serif italic; the legend is words with a short rule beneath, the pressed one underlined in navy. Loading is a dotted leader across the empty plot, still; the error carries a dagger.',
        },
        b: {
            name: 'The ledger graph',
            text: "A graph ruled into a ledger: column rules every tenth across the paper, the baseline closed with the bookkeeper's double rule, the tick labels in ledger figures (monospaced). The pen draws with sharp corners and the area is hatched by hand. The tooltip is a ledger slip with its ruled lines and a red-ink margin in navy; the legend is index tabs, the pressed one inked. Loading shows the empty ruled page, still; nothing moves in formal.",
        },
    },
    light: {
        a: {
            name: 'The seam',
            text: "Light's divider as a chart: no frame, the grid in seams, the tick labels in the sans at medium weight. The line is a confident indigo pen whose area fades to nothing as it falls to the baseline. The tooltip is a white card with the divider's open circle as its pin; the legend is pills, the pressed one tinted indigo. Loading is a dashed seam across the plot, still.",
        },
        b: {
            name: 'Daylight',
            text: 'The plot in the light: a pale sky at its top, the sun just out of frame in the top corner, and every line throwing a soft shadow on the paper below it. The tooltip is frosted glass; the legend is pills with a soft shadow. Loading lets a band of daylight cross the plot, slowly.',
        },
    },
    dark: {
        a: {
            name: 'The spectrometer',
            text: 'The plot is a black slit with a ruler along its top and foot, the grid dashed fine, the tick labels in the ticker mono. Each line glows faintly in its own colour over an area that fades to black. The tooltip is a black slab with the oxide film (cyan, violet, magenta) along its top edge; the legend is bracketed [ ] in the mono, the brackets lit when pressed. Loading shows the calibration spectrum, faint and still.',
        },
        b: {
            name: 'The machined pocket',
            text: 'The plot is a pocket milled into the instrument, its corners cut at forty-five degrees, lit along its lower lip; the grid lines are engraved (a dark cut over a lit edge) and so are the tick labels. The tooltip and the legend buttons are chamfered plates. Loading is the empty pocket, still: nothing in dark moves that the reader did not move.',
        },
    },
    cyberpunk: {
        a: {
            name: 'The neon HUD',
            text: 'A heads-up display: the void with a fine scan grid, HUD brackets in the four corners, the tick labels in the tech mono in cyan, upper case. The lines are neon tubes with their glow, the areas scanned in lines. Every three seconds a glitch tears through the plot for a frame, cyan and red. The tooltip is a notched plate with a yellow bar; the legend notched outlines, the pressed one filled yellow. Loading is the data stream: cyan packets running along a rail.',
        },
        b: {
            name: 'The hazard terminal',
            text: 'A plot framed in signal yellow with hazard stripes along its top, the grid in cyan dots, the tick labels in the condensed display face. The lines are drawn hard, with sharp corners and no glow, over areas hatched at forty-five degrees. The tooltip is a yellow plate with black text and a cut corner; the legend black plates with a yellow bar under the pressed one. Loading crawls the hazard stripes across the plot.',
        },
    },
    synthwave: {
        a: {
            name: 'The grid floor horizon',
            text: 'The plot is the night sky over the floor grid: a pink horizon glows above the baseline and the perspective grid runs towards it. The lines are neon tubes, a light core in a coloured glow; the tick labels are in VT323, in cyan. The tooltip is a dark plate whose border runs from pink to cyan; the legend glowing outlines. Loading drives along the grid floor.',
        },
        b: {
            name: 'The VHS playback',
            text: "A tape played back on the TV: the striped sun setting behind the plot, a faint tracking band under the plot's top, the tick labels in VT323. The lines glow; the areas carry the tape's scan lines. The tooltip is the VCR's on-screen display, cyan letters on black; the legend the same OSD, the pressed one in pink. Loading rolls the tracking band down the screen.",
        },
    },
    pastel: {
        a: {
            name: 'Candy',
            text: 'A plump plot with a pastel wash and a dotted riso grid; the lines are thick candy strokes with a hard flat sticker shadow, the areas in candy-cane stripes. The tooltip is a sticker bubble with its flat shadow; the legend candy pills tinted in their colour, the pressed one solid. Loading hops a candy dot along three others.',
        },
        b: {
            name: 'Washi tape and riso',
            text: 'The plot is a riso print taped into a notebook: two strips of washi tape hold its top corners, the paper carries riso grain, the lines print with a second pass off register, the areas in halftone dots. The tooltip is a note held by its own tape; the legend small tape labels. Loading drifts the stripes of a pale tape across the plot.',
        },
    },
    terminal: {
        a: {
            name: 'The braille plot',
            text: 'A plot drawn in a terminal with braille cells: the lines and the areas are made of dots on a character grid, the grid lines box-drawing dashes ┄, the tick labels in the mono. The tooltip is framed in the double box line ═; the legend is a checklist [x]. Loading walks a lit cell along a line, the caret blinking once a second (the loop the theme allows).',
        },
        b: {
            name: 'The oscilloscope',
            text: "The plot is a scope screen: a graticule with ten divisions and the minor ticks on its centre lines, the lines a phosphor trace with its glow, the area its afterglow. The crosshair is the yellow cursor. The tooltip is the scope's measurement box; the legend the channel keys, the pressed one lit. Loading sweeps the beam across the screen.",
        },
    },
    forest: {
        a: {
            name: "The ranger's logbook",
            text: "A chart drawn into a ranger's logbook: wood-pulp paper with its fibres, ruled lines and a clay margin, the tick labels in italic. The lines are drawn in ink and the areas hatched in pencil. The tooltip is a luggage tag with its punched hole; the legend tags too. Loading shows the ruled page while a leaf drifts across it.",
        },
        b: {
            name: 'The contour map',
            text: 'The plot is a survey map: contour lines ring the paper, the grid lines are the clay trail in dashes, the tick labels are spaced capitals like place names. The lines are forest ink over a lake-blue wash. The tooltip is the map key in a double neatline; the legend trail blazes. Loading walks the trail dashes along.',
        },
    },
    'high-contrast': {
        a: {
            name: 'The ink frame',
            text: 'A 2px ink frame, a dashed ink grid, the tick labels in bold. Every source is told by its pattern as well as its colour: the first line solid, the second dashed, the third dotted, their areas hatched, cross-hatched and dotted. The tooltip is a white plate in a 2px ink frame; the legend framed buttons, the pressed one inked solid. Loading shows three ink squares, still: nothing loops, ever.',
        },
        b: {
            name: 'The inverse plate',
            text: 'The plot printed in reverse: an ink plate with every line in white, told apart by pattern alone (solid, dashed, dotted), so it reads in greyscale and in forced colours alike. The crosshair and the tooltip are the signal yellow with ink text; the legend white frames on ink. Loading shows a dashed white line across the plate, still.',
        },
    },
    sepia: {
        a: {
            name: 'A nib on laid paper',
            text: 'Laid paper with its fine lines and chain lines, the tick labels in the serif italic. The lines are drawn with a nib, the ink bleeding a hair into the paper, over a watercolour wash that fades to the baseline. The tooltip is a slip with a double ink rule; the legend underlined words. Loading writes a stroke across the page slowly and lets it fade, as a pen does.',
        },
        b: {
            name: 'The letterpress specimen',
            text: 'The plot is pressed into the paper (a blind impression), the tick labels in letter-spaced small capitals. The lines are inked type, speckled where the ink did not take, the areas stippled. The tooltip is a printed slip with a fleuron ❧ in its corner; the legend pilcrows ¶. Loading presses the platen: the impression deepens and lifts.',
        },
    },
    blueprint: {
        a: {
            name: 'The millimetre paper',
            text: "Drafting film over millimetre paper: a fine line every millimetre and a heavier one every centimetre, the tick labels in the drafting mono. The pen draws the lines crisp, the areas are section-hatched, the crosshair is an amber chain line. The tooltip is the drawing's title block; the legend ruled cells. Loading runs a plotter dash across the sheet.",
        },
        b: {
            name: 'The drawing frame',
            text: "The plot is a drawing in its frame: a double border with the zone ticks along its edges and registration marks in the corners, construction lines for the grid. The lines are drawn in white ink with round ends. The tooltip is a callout with its leader; the legend dimension labels. Loading traces the frame's outline with a moving dash.",
        },
    },
    solstice: {
        a: {
            name: 'The low sun',
            text: 'The plot at dusk: a low sun warms its bottom corner, the grid lines lie like long shadows, the tick labels are in the serif. The lines glow warm and their areas carry the firelight down to the ground. The tooltip is a charcoal slab with an ember edge; the legend stone pills. Loading lets a dawn rise and fade, unhurried.',
        },
        b: {
            name: 'The embers',
            text: 'The plot is a charcoal log with embers in it; the lines are glowing filaments, the areas ember speckle. The tooltip is an iron plate with four rivets; the legend iron buttons with a hot edge when pressed. Loading lets embers breathe along the log. Firelight, not neon.',
        },
    },
    brutalism: {
        a: {
            name: 'The slab',
            text: 'A box in the 3px black line with the hard shadow, a heavy dashed grid, the tick labels in bold grotesque. The lines are thick with square ends and sharp corners over solid candy areas. The tooltip is a box with its hard shadow; the legend chunky buttons that press in. Loading runs the yellow-and-black tape through the box.',
        },
        b: {
            name: 'The sticker sheet',
            text: 'The plot is a lavender sheet in a black frame; every line is a sticker cut out with a black outline, over areas with a black edge. The tooltip is a black plate with lavender shadow; the legend sticker labels. Loading drops blocks into the box one at a time.',
        },
    },
    deco: {
        a: {
            name: 'The gilt rules',
            text: 'Black lacquer between double gold rules above and below, the grid in long-short gold hairlines, the tick labels in the thin deco capitals. The areas are fluted like a deco column. The tooltip is a panel with a double gold border and stepped corners; the legend gold outlines, the pressed one gilded. Loading lets a glint run along the gilt rule.',
        },
        b: {
            name: 'The sunburst',
            text: 'A gold sunburst fans out from the foot of the plot behind the lines, under an arched gold frame. The tooltip is a deep emerald plaque between gold rules; the legend jewelled lamps that light when pressed. Loading opens the fan.',
        },
    },
    phantom: {
        a: {
            name: 'The stamped ledger',
            text: "The plot is a ledger page ruled in white, a red rubber stamp's frame pressed at a slant in its corner; the tick labels in the condensed capitals. The lines are stamp ink, grainy where the stamp did not take. The tooltip is a white index card with a red stamp line; the legend stamped labels, the pressed one in red. Loading slides the halftone screen.",
        },
        b: {
            name: 'The calling card',
            text: 'Black under a halftone screen, the lines in the violent red with a white second plate off register, the tick labels in condensed capitals. The tooltip is a cut-paper ransom note, white, set at a slant with a red shadow; the legend cut-paper scraps. Loading shuffles the halftone in hard steps.',
        },
    },
    'shade-light': {
        a: {
            name: 'Pencil in the shade',
            text: 'Paper read in the shade: the grid in pencil, the tick labels in the serif italic, each line throwing a soft shade below it over an area hatched in pencil. The tooltip is a card lifted off the page by its shade; the legend pencil-underlined words. Loading hatches the plot in once and leaves it, as every reveal here runs once.',
        },
        b: {
            name: 'The leaf shade',
            text: 'The plot under a tree: soft dappled shade of leaves on the paper, the lines and their shades crisp in it. The tooltip is a card with a soft shade; the legend pills with a shade. Loading lets the shade of a passing cloud cross the paper.',
        },
    },
    'shade-dark': {
        a: {
            name: 'Silverpoint',
            text: 'The dark half of the pencil: fine silver hatching across the dark ground, the lines lit along their upper edge, the areas hatched in silver. The tooltip is a dark card with a silver hairline; the legend silver-underlined words. Loading hatches the plot in once.',
        },
        b: {
            name: 'The reading lamp',
            text: 'A pool of lamplight on the dark page, falling off into shade at its edges; the lines are lit where the lamp is. The tooltip is a card under the lamp; the legend lamp-lit pills. Loading slides the pool of light slowly across the page.',
        },
    },
    retro: {
        a: {
            name: 'The plotter on fanfold paper',
            text: 'Continuous fanfold paper with its green-bar bands (in the teal) and a perforation, the tick labels in the pixel face. The lines are a plotter pen, crisp and thin. The tooltip is a 1995 tooltip: a plain box with a 1px black line; the legend raised bevelled buttons that sink when pressed. Loading shows the bands still: nothing blinks.',
        },
        b: {
            name: 'The spreadsheet chart of 1995',
            text: 'A spreadsheet chart of 1995: a grey plot area sunk into a bevel, solid black grid lines, crisp lines over areas filled with the 50 % dither. The tooltip is a little window with a navy title bar; the legend sits in a raised frame. Loading fills the plot with the dither, still.',
        },
    },
    grotesk: {
        a: {
            name: 'The Swiss grid',
            text: 'White paper, one heavy black baseline, hairline grid, the tick labels in bold grotesque set flush. The lines are flat with sharp corners, the first in red. The tooltip is a black plate with white figures; the legend plain words, a red square before the pressed one. Loading cuts in three black squares, one after another, in hard steps.',
        },
        b: {
            name: 'The zebra scale',
            text: 'A zebra time scale of twelve columns along the foot of the plot and a column grid above it; the lines black and red. The tooltip is a red plate with white text; the legend numbered 01, 02, 03 in the grotesque. Loading hops the zebra one column and back.',
        },
    },
    lapis: {
        a: {
            name: 'Lapis on vellum',
            text: "An ivory vellum plot ruled in gold inside the lapis page; the lines are drawn in lapis and vermilion ink, the tick labels in the Markazi serif. The tooltip is a lapis plate in a gold rule; the legend gilt-edged pills. Loading lets a burnisher's glint run across the vellum.",
        },
        b: {
            name: 'The gilt lattice',
            text: 'The lapis page under a faint girih lattice in a double gold frame; the lines are gold leaf with a soft glint, the areas tooled with a gold lattice. The tooltip is a toranj, the pointed cartouche; the legend gilt pills. Loading lets a glint run along the frame.',
        },
    },
    nostromo: {
        a: {
            name: 'The amber CRT',
            text: 'The plot is a dark CRT set into the beige case: rounded glass, a vignette and scanlines, the lines amber and cream phosphor with their glow, the tick labels in the mono. The crosshair is a block cursor. The tooltip is a phosphor readout boxed on the screen; the legend beige keys with an LED that lights when pressed. Loading warms the screen while the cursor blinks.',
        },
        b: {
            name: 'The strip-chart recorder',
            text: 'The plot is the paper roll of a 1979 strip-chart recorder: orange millimetre grid on pale paper, the pens in dark ink and orange. The tooltip is a strip of embossed black label tape; the legend label tape too. Loading feeds the roll through at an even pace.',
        },
    },
    titanium: {
        a: {
            name: 'The engraved dial face',
            text: 'The plot is a face of brushed titanium; the grid lines and the tick labels are engraved, a dark cut over a lit lip; the lines are anodised colour laid into the metal. The tooltip is a machined plate held by four screws; the legend machined keys. Loading runs the cutter across the face at an even, linear pace: metal does not ease.',
        },
        b: {
            name: 'The vernier',
            text: "Carbon weave under the plot and a vernier scale engraved along its top; the crosshair is the vernier's zero line in the blue oxide. The tooltip is the vernier's sliding plate with a knurled edge; the legend knurled keys. Loading rolls the knurl, linearly.",
        },
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="chart"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, two]) => [theme, `${two[which].name}. ${two[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'chart',
            label: 'The time chart for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain chart, as today',
                    hint: 'Keep the package chart in this theme: the same shape as everywhere, in the theme’s colours.',
                },
            ],
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, two] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Character 1 is ${two.a.name.replace(/^(The|A) /, (m) => m.toLowerCase())}, character 2 ${two.b.name.replace(/^(The|A) /, (m) => m.toLowerCase())}; the third column is the plain chart of today. ` +
        'Look at the paper, the lines, the tick labels and the pinned tooltip in each column, then press Loading, No readings and Error: the plot keeps its height, ' +
        'and the words around it never move. Point at a plot and drag across it: the crosshair, the tooltip and the zoom chip are each character’s own.';
    look.append(p);
}

/* -------------------------------------------------------- the readings */

// The catalogue's pump houses (catalogue/chart-sample.js), the last 24
// hours, with the events of that day only.
const FULL = sampleData('pressure', '24h');
const EVENTS = (FULL.events ?? []).filter((ev) => ev.at > NOW - 24 * 3_600_000);
/** @param {number} n the sources shown @returns {import('../../js/chart.js').ChartData} */
const pressure = (n) => ({ ...FULL, events: EVENTS, series: FULL.series.slice(0, n) });
/** A spark line without the catalogue's own colour, so a character's colours reach it. @param {number} k */
const spark = (k) => {
    const d = sampleData(`spark-${k === 1 ? 1 : 0}`);
    return { ...d, series: d.series.map(({ colour: _, ...rest }) => rest) };
};

const state = {
    shown: /** @type {'filled' | 'loading' | 'empty' | 'error'} */ ('filled'),
    sources: 2,
    pin: true,
    zoom: false,
    press: false,
    hot: false,
};

const charts = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-cc-chart="pressure"]')]);
const sparks = () => /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-cc-chart^="spark-"]')]);

/** Pin the tooltip at 07:30, the alarm and the restart within its reach, the way End, ← and Enter do. @param {HTMLElement} el */
function pinAt(el) {
    const tip = el.querySelector('.kp-chart__tip');
    if (tip?.hasAttribute('data-kp-pinned')) return;
    const plot = el.querySelector('.kp-chart__plot');
    if (!plot) return;
    const key = (/** @type {string} */ k) => plot.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    key('End');
    for (let i = 0; i < 18; i++) key('ArrowLeft');
    key('Enter');
}

/** Release a pinned tooltip with its own ✕. @param {HTMLElement} el */
function release(el) {
    const tip = el.querySelector('.kp-chart__tip[data-kp-pinned]');
    /** @type {HTMLElement | null} */ (tip?.querySelector('.kp-chart__release'))?.click();
}

function draw() {
    for (const el of charts()) {
        if (state.shown === 'loading') {
            el.setAttribute('data-kp-chart-sources', String(state.sources));
            el.setAttribute('data-kp-chart-loading', '');
            continue;
        }
        const data = pressure(state.sources);
        if (state.shown === 'empty') setChartData(el, { ...data, series: data.series.map((s) => ({ label: s.label, points: [] })) });
        else if (state.shown === 'error') setChartData(el, { ...data, error: 'The gauge server did not answer at 09:00.' });
        else setChartData(el, data);
    }
    sparks().forEach((el) => {
        const k = Number(el.getAttribute('data-cc-chart')?.replace('spark-', '') ?? 0);
        const d = spark(k);
        setChartData(el, state.shown === 'filled' ? d : { ...d, series: d.series.map((s) => ({ label: s.label, points: [] })) });
    });
    showToggles();
}

function showToggles() {
    const filled = state.shown === 'filled';
    for (const el of charts()) {
        if (filled && state.pin) pinAt(el);
        else if (!state.pin) release(el);
        chartSelect(el, null);
        if (state.press && state.sources > 1) chartSelect(el, 0, true);
        const first = el.querySelector('.kp-chart__source');
        first?.dispatchEvent(new PointerEvent(state.hot && state.sources > 1 ? 'pointerenter' : 'pointerleave'));
    }
    for (const group of document.querySelectorAll('.cc-group'))
        chartZoom(group, state.zoom ? { from: NOW - 5 * 3_600_000, to: NOW - 30 * 60_000 } : null);
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of document.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};
for (const b of document.querySelectorAll('[data-cc-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cc-state') ?? 'filled');
        pressed('data-cc-state', state.shown);
        draw();
    });
for (const b of document.querySelectorAll('[data-cc-sources]'))
    b.addEventListener('click', () => {
        state.sources = Number(b.getAttribute('data-cc-sources'));
        pressed('data-cc-sources', String(state.sources));
        draw();
    });
for (const b of document.querySelectorAll('[data-cc-toggle]'))
    b.addEventListener('click', () => {
        const key = /** @type {'pin' | 'zoom' | 'press' | 'hot'} */ (b.getAttribute('data-cc-toggle'));
        state[key] = !state[key];
        b.setAttribute('aria-pressed', String(state[key]));
        showToggles();
    });

attachCharts(document);
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-cc-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) p.hidden = p.getAttribute('data-for') !== theme;
    const two = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-cc-name="${which}"]`);
        const desc = document.querySelector(`[data-cc-desc="${which}"]`);
        if (name) name.textContent = two ? two[which].name : '';
        if (desc) desc.textContent = two ? two[which].text : '';
    }
    // A theme's register may change the chart's size or type: draw again.
    requestAnimationFrame(() => draw());
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cc-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('cc-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-cc-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-cc-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-cc-speed'));
        try {
            localStorage.setItem('cc-speed', String(rate));
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
    for (const col of section.querySelectorAll('[data-cc-pick]')) col.classList.toggle('cc-picked', col.getAttribute('data-cc-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.cc-picked')) col.classList.remove('cc-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
