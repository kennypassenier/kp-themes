// research/character-graph: the fourth component of the character round
// (Kenny, form v18, 2026-10-05): the network graph, two characters per theme
// drawn in the theme's own world, beside the plain graph of today, all 22
// themes in one demo judged through the review kit.
//
// The graphs are the package's own: attachGraphs() (js/graph.js) builds the
// kinds, Show all, the picture and the hint, and keeps every behaviour
// (hover, picking, the keys, the kinds, the live update). Each character is
// CSS only, in graphs.css, scoped by `[data-theme]` and the column's
// `[data-gr]`; this file only says what each one is, gives the graphs their
// network, sets the states, and runs the speed. js/graph.js is not changed.

import { attachGraphs, GRAPH_CHANGE_EVENT, graphHideKind, graphSelect, setGraphData, setGraphState } from '../../js/graph.js';
import { THEMES } from '../../js/theme-registry.js';

/** @param {string} an @param {string} at @param {string} bn @param {string} bt */
const two = (an, at, bn, bt) => ({ a: { name: an, text: at }, b: { name: bn, text: bt } });

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: two(
        'The organisation chart',
        "A printed organisation chart on paper: hairline links, each node a small open circle with a thin navy rule and a pale core, the hub in a double weight, labels in the serif's small capitals on a paper halo. The kinds are small-caps entries with a rule under the one that is on. Dimming greys the rest to a pencil tint. Loading is a still dotted circle; nothing moves.",
        'The engraved plate',
        'A steel-engraved map plate: a ruled border with a fine inner frame, links engraved as fine lines, nodes as solid dots inside an engraved ring, labels in serif italic. The kinds are boxed like a map key. Still while loading: an engraved dotted ring.',
    ),
    light: two(
        'The soft canvas',
        'A pale sky canvas with a soft lift: nodes are white discs on a soft shadow with their hue as a thin rim and a small core, links in soft rounded strokes, labels on a white halo. The kinds are soft pills. Dimming fades to a mist. Loading is a still dashed ring.',
        'Daylight',
        'White cards in daylight: every node a white disc with a wide pastel rim in its hue, links slightly thicker and round-capped, the hub with a sunny amber rim, labels in the body face on a white halo. Loading: a band of light runs around the ring.',
    ),
    dark: two(
        'The status board',
        'A black operations board: links as thin lit lines, each node a black disc with a lit rim in its hue, labels in ticker mono on black. The kinds are square lit chips. Dimming drops everything else to a dull outline. Still while loading: a dim dashed ring.',
        'The machined panel',
        'A machined black panel with a fine inner bevel: each node a chamfered pocket (a dark disc with a thick rim lit from below), links engraved and lit, labels in mono capitals. The kinds are flat machined tabs. Still while loading.',
    ),
    cyberpunk: two(
        'The neon circuit',
        'A neon circuit on a black board with a faint trace grid: links are neon tubes in their kind colour with a glow, nodes are glowing rings with a dark core window, the hub ringed in hazard yellow, labels in tech mono capitals. The kinds are cut-corner neon chips. Dimming kills the glow. Loading: a packet runs around the dashed ring.',
        'The netrunner map',
        'A netrunner HUD: square-capped data links, nodes with a thick broken ring (ICE segments), labels in condensed display capitals on black, the kinds as hazard-taped tabs. Dimming leaves a cold outline. Loading: the ICE ring spins.',
    ),
    synthwave: two(
        'The grid-floor constellation',
        'A constellation over a perspective grid floor and a pink horizon glow: links as thin glowing star lines, nodes as stars (bright core, soft glow ring), labels in VT323 on night. The kinds are glass chips. Dimming leaves only faint stars. Loading: the horizon ring pulses in pink.',
        'The arcade vector screen',
        'An 80s vector arcade screen: everything drawn in glowing outline only (hollow nodes, glowing links), scanlines over the picture, labels in VT323 capitals. The kinds are outlined in neon. Loading: the vector ring rotates.',
    ),
    pastel: two(
        'Candy beads and licorice',
        'Candy beads on licorice strings: each node a fat candy bead in its hue with a bead highlight, links as thick round-capped licorice strings, labels in the rounded face on a cream halo. The kinds are candy pills with a flat sticker shadow. Dimming fades to sugar. Loading: the bead ring hops round.',
        'The pinboard doodle',
        'A riso doodle on a dotted pad: nodes are hand-drawn dotted circles in their hue, links are dashed doodle lines, labels on a cream halo, the kinds as washi-tape chips. Loading: the doodle ring drifts.',
    ),
    terminal: two(
        'The box-drawing map',
        'A text-mode network map: the picture is a black terminal with a caret line, links are thin square-capped lines in the phosphor, every node a [bracketed] square-ish ring, labels in the mono with no halo glow, the kinds as [x] / [ ] toggles. Dimming leaves the rest at half bright. Loading: a dashed ring ticks like a text spinner.',
        'traceroute',
        'A traceroute print: links dotted like hop dots, nodes as small inverse-video blocks, labels in mono capitals, the hub in reverse video. The kinds read as plain text with an underline. Loading: the dots march.',
    ),
    forest: two(
        'The trail map',
        'A ranger’s trail map on kraft paper with contour rings: links as trails (a dashed walk), every node a cairn (a stacked stone ring in its hue), the hub as a ranger station with a heavy ring, labels in serif italic on a paper halo. The kinds are wooden trail markers. Loading: the trail walks around.',
        'The canopy',
        'Looking up into a canopy: links as twigs (thicker, round-capped, in bark), nodes as leaves (a green-tinted disc with a dark vein ring), labels in the body face on moss. The kinds are leaf tags. Loading: a leaf ring sways.',
    ),
    'high-contrast': two(
        'Patterned edges, shaped nodes',
        'Every link kind told apart by its pattern as well as its colour (heavier dashes), every node a circle with a different shaped core (square, diamond, triangle, round) so no hue is needed, thick black rings, bold labels on a full halo. Picked nodes get a yellow ring. Still: nothing moves.',
        'The ink plate',
        'Black ink on white: nodes inverse (black disc, white core), links thick in their kind pattern, labels bold on white, the hub in a double weight, the kinds as framed buttons. Still: nothing moves.',
    ),
    sepia: two(
        'The family tree',
        'A nib-drawn family tree on aged paper: links as fine ink lines, every node an ink ring with a sepia wash, the hub in a double rule, labels in serif italic on paper. The kinds are an engraved key. Dimming fades to faded ink. Loading: the nib draws the ring.',
        'The letterpress chart',
        'A letterpress chart: links printed as heavier ink rules with blind-impressed nodes (a dark ring, a pale pressed core), labels in serif small capitals, the kinds as printed borders. Loading: the platen presses.',
    ),
    blueprint: two(
        'The wiring schematic',
        'A wiring schematic on blueprint paper with a millimetre grid: links as white-ink wires, every node a junction dot in a thin ring, the hub as a terminal block in amber, labels in technical mono capitals. The kinds are boxed like a legend. Loading: the plotter dashes the ring.',
        'The drafting sheet',
        'A drafting sheet: links as chain lines, nodes as circles with centre crosses (thin dash ring), labels in mono on the blue, the kinds as title-block cells. Loading: the dash marches round.',
    ),
    solstice: two(
        'The low sun',
        'Charcoal paper lit from below by a low sun: links in warm light, nodes as glowing suns (bright core, soft rim), labels in the serif on charcoal. The kinds are glowing chips. Dimming lets the light fall. Loading: a dawn rises in the ring.',
        'The embers',
        'Embers on charcoal: links as glowing coals in a long dash, nodes as embers with a hot rim, the hub as the fire, labels in the serif. Loading: the ember ring breathes.',
    ),
    brutalism: two(
        'Slabs and heavy lines',
        'Concrete slabs and heavy lines: links 4px wide in square caps, every node a thick black ring with a hard shadow, labels in heavy capitals on a solid halo, the kinds as black-bordered blocks with the hard shadow. The pick gets the yellow fill. Loading: the slab ring stamps.',
        'The sticker sheet',
        'A lavender sticker sheet: links black and heavy, nodes as fat stickers in their hue with a black outline, labels heavy on white, the kinds as askew stickers. Loading: the sticker ring drops in.',
    ),
    deco: two(
        'Gilt rays',
        'A gilt sunburst on lacquer: links as fine gold rays, nodes as gold-framed medallions (a gold ring, a core in its hue), the hub in a double gold ring, labels in the display face capitals. The kinds are gold-framed plaques. Loading: a glint runs the gold ring.',
        'The marquee',
        'A theatre marquee: links as rows of bulbs (round dots), nodes ringed in bulbs, labels in display capitals, the kinds as marquee plaques. Loading: the bulbs chase round.',
    ),
    phantom: two(
        'Stamped tags and string',
        'An evidence board: links as red string, nodes as stamped tags (a paper disc with a red stamped ring), labels in slanted capitals on white, the kinds as cut-out ransom chips. Dimming leaves the board grey. Loading: the halftone slides.',
        'The calling card',
        'Black calling cards under a halftone: nodes as black discs with a red slash ring, links in white, labels on black in display capitals, the kinds as slanted cards. Loading: the halftone shuffles.',
    ),
    'shade-light': two(
        'Pencil in the shade',
        'A pencil sketch on paper in soft shade: links as soft pencil lines, nodes as lifted paper discs with a pencil rim, labels in the body face. The kinds are lifted paper chips. Loading: the sketch hatches in.',
        'The leaf shade',
        'Dappled leaf shade over the sheet: soft links, nodes in a sunny rim, labels on paper. Loading: a cloud’s shade passes.',
    ),
    'shade-dark': two(
        'Silverpoint',
        'Silverpoint on dark paper: links as silver hairlines, nodes as silver rings with a dark core window, labels in the body face. The kinds are silver hairline chips. Loading: the silver hatches in.',
        'The reading lamp',
        'A warm reading lamp over the sheet: a warm pool of light behind the hub, links in warm ink, nodes ringed warm, labels on the dark. Loading: the pool slides.',
    ),
    retro: two(
        'The 1995 network diagram',
        'A 1995 network diagram in a white well with a bevel: links as one-pixel lines, every node a bevelled disc (a raised ring in grey with its hue as core), labels in the pixel face, the kinds as raised grey buttons that sink when off. Still while loading: a dither ring.',
        'The paint program',
        'A 1995 paint program: links in solid primary colours, nodes as flat filled discs with a black outline, labels in the pixel face on a white halo, the kinds as tool buttons. Still.',
    ),
    grotesk: two(
        'The transit map',
        'A Swiss transit map: links as thick coloured lines, nodes as white interchange stations with a heavy black ring, labels in bold grotesque on white. The kinds are flat colour bars. Loading: a line runs around.',
        'The Swiss grid',
        'The Swiss grid: thin black links, nodes as solid black discs, the hub in red, labels in bold grotesque flush beside them, the kinds as boxed bold words. Loading: three squares cut in.',
    ),
    lapis: two(
        'The girih lattice',
        'A girih lattice on lapis: links as gold lattice lines, nodes as lapis medallions in a gold ring, the hub in a double gold frame, labels in the display face on lapis. The kinds are gold-framed tiles. Loading: a glint runs the frame.',
        'Lapis on vellum',
        'Lapis ink on ivory vellum: links in lapis ink, nodes as gold-rimmed lapis dots, labels in the serif on vellum, the kinds as gold-framed chips. Loading: a burnisher’s glint.',
    ),
    nostromo: two(
        'The CRT radar sweep',
        'A green-black CRT in the beige case with scanlines: links as phosphor traces, nodes as blips (a bright core, a fading ring), labels in mono capitals in phosphor, the kinds as phosphor tabs. A radar sweep turns over the picture while it loads; at rest nothing moves.',
        'The indicator panel',
        'The ship’s indicator panel: links as embossed lines, nodes as lit indicator lamps in a thick bezel, labels on embossed label tape, the kinds as keys. Loading: the lamps scan.',
    ),
    titanium: two(
        'The milled plate',
        'A milled titanium plate: links engraved, every node a riveted boss (a ring of rivets around an anodised core in its hue), the hub with a blue heat-tint ring, labels in instrument mono. The kinds are machined tabs. Loading: the cutter runs the ring.',
        'The instrument dial',
        'An instrument dial: links as fine engraved lines, nodes as recessed apertures ringed in their anodised hue, a knurled ring on the hub, labels in mono. Loading: the knurl rolls.',
    ),
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="graph"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, t]) => [theme, `${t[which].name}. ${t[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'graph',
            label: 'The network graph for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain graph, as today',
                    hint: 'Keep the package graph in this theme: the same shape as everywhere, in the theme’s colours.',
                },
            ],
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lower = (/** @type {string} */ name) => name.replace(/^(The|A) /, (m) => m.toLowerCase());
for (const [theme, t] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Character 1 is ${lower(t.a.name)}, character 2 ${lower(t.b.name)}; the third column is the plain graph of today. ` +
        'Look at the paper, the nodes, the hub, the links of each kind, the labels and the kinds above, then hover a node: the rest dims. ' +
        'Press Loading, Nothing to draw and Could not read: the picture keeps its height. Try fifteen long names, size by flow, the live update, pick a node and hide a kind.';
    look.append(p);
}

/* ---------------------------------------------------------- the network */

// The catalogue's northern network (catalogue/demos.js), the same on every
// load: a control centre, six pump houses, two reservoirs, a treatment plant
// and two addresses outside the network; or fifteen long names.

/** @type {import('../../js/graph.js').GraphKind[]} */
const KINDS = [
    { kind: 'telemetry', label: 'Telemetry', hint: 'Readings sent to the control centre every minute', style: 'solid', colour: 'var(--chart-1)' },
    { kind: 'control', label: 'Remote control', hint: 'Commands from the control centre to the site', style: 'dash', colour: 'var(--chart-2)' },
    { kind: 'radio', label: 'Radio link', hint: 'A spare path over radio for when the line is down', style: 'dot', colour: 'var(--chart-4)' },
    { kind: 'planned', label: 'Planned', hint: 'A link that is ordered but not live yet', style: 'long-dash', colour: 'var(--muted-foreground)' },
];

/** @param {{ weights: boolean, tick: number }} o @returns {import('../../js/graph.js').GraphData} */
function network({ weights, tick }) {
    const sites = [
        ['ph1', 'Pump house 1', 'two pumps, ring main west'],
        ['ph2', 'Pump house 2', 'one pump, the old town'],
        ['ph3', 'Pump house 3', 'two pumps, ring main north'],
        ['ph4', 'Pump house 4', 'two pumps, the harbour'],
        ['ph5', 'Pump house 5', 'one pump, the hills'],
        ['ph6', 'Pump house 6', 'being built, live in November'],
        ['north', 'Reservoir North', 'level sensor and an inlet valve'],
        ['south', 'Reservoir South', 'level sensor and an inlet valve'],
        ['plant', 'Treatment plant', 'where the water comes from'],
    ];
    return {
        nodes: [
            { id: 'centre', label: 'Control centre', description: 'where every reading arrives', weight: weights ? 1 : null },
            ...sites.map(([id, label, description], i) => ({
                id,
                label,
                description: id === 'ph5' ? `${description}; its settings on site differ from the plan` : description,
                flag: id === 'ph5' ? /** @type {const} */ ('mismatch') : null,
                weight: weights ? ((i * 37 + tick * 13) % 100) / 100 : null,
            })),
            { id: 'weather', label: 'Weather service', description: 'an address outside the network', external: true },
            { id: 'energy', label: 'Energy supplier', description: 'an address outside the network', external: true },
        ],
        edges: [
            ...sites.filter(([id]) => id !== 'ph6').map(([id]) => ({ from: id, to: 'centre', kind: 'telemetry', detail: 'readings every minute' })),
            { from: 'centre', to: 'ph1', kind: 'control', detail: 'pump start and stop' },
            { from: 'centre', to: 'ph3', kind: 'control', detail: 'pump start and stop, valve' },
            { from: 'centre', to: 'plant', kind: 'control', detail: 'intake rate' },
            { from: 'ph3', to: 'ph4', kind: 'radio', detail: 'spare path' },
            { from: 'ph4', to: 'centre', kind: 'radio', detail: 'spare path' },
            { from: 'centre', to: 'ph6', kind: 'planned', detail: 'fibre ordered' },
            { from: 'centre', to: 'energy', kind: 'planned', detail: 'tariff feed ordered' },
            { from: 'weather', to: 'centre', kind: 'telemetry', detail: tick % 2 ? 'rain radar every 5 min' : 'rain radar every 10 min' },
        ],
        kinds: KINDS,
        hub: 'centre',
    };
}

/** @param {{ weights: boolean }} o @returns {import('../../js/graph.js').GraphData} */
function longNetwork({ weights }) {
    const names = [
        'Booster site A',
        'Booster site B',
        'Booster site C',
        'Reservoir North-East high zone',
        'Booster site E',
        'Booster site F',
        'Treatment plant on the river',
        'Booster site H',
        'Booster site I',
        'Booster site J',
        'Booster site K',
        'Pumping station by the harbour',
        'Booster site M',
        'Booster site N',
    ];
    const edges = names.map((_, i) => ({ from: `n${i}`, to: 'hub', kind: i % 4 === 3 ? 'radio' : 'telemetry' }));
    edges.push({ from: 'hub', to: 'n2', kind: 'control' }, { from: 'hub', to: 'n2', kind: 'planned' });
    return {
        nodes: [
            { id: 'hub', label: 'Control centre', description: 'where every reading arrives' },
            ...names.map((label, i) => ({ id: `n${i}`, label, description: `site ${i + 1}`, weight: weights ? (i % 5) / 4 : null })),
        ],
        edges,
        kinds: KINDS,
        hub: 'hub',
    };
}

const WORDS = {
    loading: 'Reading the network: 4 of 12 sites answered.',
    empty: 'Nothing to draw yet: no site has reported to the control centre.',
    error: 'The network could not be read: the control centre did not answer.',
};

const graphs = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-kp-graph]')]);

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    long: false,
    weights: false,
    pick: false,
    hide: false,
    tick: 0,
};

function draw() {
    for (const el of graphs()) {
        if (state.shown !== 'ready') setGraphState(el, state.shown, WORDS[state.shown]);
        else {
            setGraphData(el, state.long ? longNetwork(state) : network(state));
            graphSelect(el, state.pick ? [state.long ? 'n2' : 'ph3'] : []);
            graphHideKind(el, 'telemetry', state.hide);
        }
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of section.querySelectorAll('[data-gr-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-gr-state') ?? 'ready');
        pressed('data-gr-state', state.shown);
        draw();
    });

// A live update: the same network with new numbers (the weather feed's
// rate, and the flows when sized by flow), handed over in one
// setGraphData(); ids that stay keep their pick and the focus.
section.querySelector('[data-gr-live]')?.addEventListener('click', () => {
    state.tick += 1;
    state.shown = 'ready';
    pressed('data-gr-state', 'ready');
    for (const el of graphs()) setGraphData(el, state.long ? longNetwork(state) : network(state));
});

for (const b of section.querySelectorAll('[data-gr-toggle]'))
    b.addEventListener('click', () => {
        const what = /** @type {'long' | 'weights' | 'pick' | 'hide'} */ (b.getAttribute('data-gr-toggle'));
        state[what] = !state[what];
        b.setAttribute('aria-pressed', String(state[what]));
        if (state.shown === 'ready') draw();
    });

const log = section.querySelector('[data-gr-log]');
section.addEventListener(GRAPH_CHANGE_EVENT, (event) => {
    if (event.target !== graphs()[0]) return;
    const { selected, hiddenKinds } = /** @type {CustomEvent<{ selected: string[], hiddenKinds: string[] }>} */ (event).detail;
    const data = state.long ? longNetwork(state) : network(state);
    const name = (/** @type {string} */ id) => data.nodes.find((n) => n.id === id)?.label ?? id;
    const kind = (/** @type {string} */ k) => KINDS.find((x) => x.kind === k)?.label ?? k;
    if (log)
        log.textContent =
            (selected.length ? `Picked: ${selected.map(name).join(', ')}.` : 'Nothing picked.') +
            (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
});

attachGraphs(section);
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-gr-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== theme;
    const t = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-gr-name="${which}"]`);
        const desc = document.querySelector(`[data-gr-desc="${which}"]`);
        if (name) name.textContent = t ? t[which].name : '';
        if (desc) desc.textContent = t ? t[which].text : '';
    }
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-gr-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('gr-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-gr-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-gr-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-gr-speed'));
        try {
            localStorage.setItem('gr-speed', String(rate));
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
    for (const col of section.querySelectorAll('[data-gr-pick]')) col.classList.toggle('gr-picked', col.getAttribute('data-gr-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.gr-picked')) col.classList.remove('gr-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
