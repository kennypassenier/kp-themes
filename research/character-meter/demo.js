// research/character-meter: the first component of the character round
// (Kenny, form v18, 2026-10-05): the meter, two characters per theme drawn
// in the theme's own world, beside the plain meter of today, all 22 themes in
// one demo judged through the review kit.
//
// The meters are the package's own: setMeter() (js/kpi.js) writes their
// share, mark, tone, loading state and ARIA. Each character is CSS only, in
// meters.css, scoped by `[data-theme]` and the column's `[data-cm]`; this
// file only says what each one is, sets the states, and runs the speed.

import { setMeter } from '../../js/kpi.js';
import { THEMES } from '../../js/theme-registry.js';

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: {
        a: {
            name: 'The ledger column',
            text: 'A column ruled in a ledger: a hairline above and below and a faint column rule every tenth; the share is the navy entry written into it. The mark is a tick-and-tie: two ink hairlines with paper between, standing out of the column. Past the end the entry is closed with the double rule and carried forward, "c/f". Loading is a dotted leader, "to be entered", still.',
        },
        b: {
            name: 'The bound volume and its ribbon',
            text: "The track is a book's fore-edge, page after page; the share is the navy buckram binding laid over it. The mark is a gold ribbon bookmark with a swallowtail, hanging out below the book. Past the end one more volume leans past the shelf. Loading riffles the pages: a shade runs slowly along the edge.",
        },
    },
    light: {
        a: {
            name: 'The seam and its circle',
            text: "Light's divider as a meter: a 1px seam, the share an indigo pill laid over it, and the mark the divider's own open circle resting on the seam. Past the end the seam runs on to a small cyan circle. Loading is the seam dashed, still: nothing loops.",
        },
        b: {
            name: 'Daylight',
            text: 'A soft pill in the light: the indigo share brightens towards its end as if the sun is on it, and the mark is a thin gnomon throwing a short shadow. Past the end the light spills out in a cyan glint. Loading lets a band of daylight cross the track, slowly.',
        },
    },
    dark: {
        a: {
            name: 'The spectrometer',
            text: 'A black slit with a ruler tick every tenth above and below. The share is one emission line whose colour is read from the oxide film at that point, cyan at the start, violet, magenta, lime at the end; the mark is dark\'s closing bracket "]" in near-white. Past the end a second bracket in magenta. Loading shows the calibration spectrum, faint and still: nothing moves that the reader did not move.',
        },
        b: {
            name: 'The machined channel',
            text: "A channel with its corners cut at forty-five degrees; the share is bright machined metal with the oxide film along its top edge, laid along the whole scale. The mark is a V milled into the edge with a dark cut through the metal. Past the end the part runs out of the channel with a chamfered tip. Loading is the empty channel's engraved scale, still.",
        },
    },
    cyberpunk: {
        a: {
            name: 'The neon tube with a glitch tick',
            text: 'A yellow neon tube in a dark glass sleeve, glowing. The mark is a cyan tick that glitches every three seconds: it jumps, and a violet copy tears off for a frame. Past the end the tube reads OVR in red. Loading is the tube trying to strike: a flicker twice, then dark (under three changes a second).',
        },
        b: {
            name: 'The HUD segment gauge',
            text: "A notched readout: the share is yellow plates split by void slits, the leading plate cut at forty-five degrees, over a rail of dim yellow dashes. The mark is a cyan target notch with a void cut through the plates. Past the end a red notched plate. Loading is the data stream: cyan packets run along the rail, the theme's one loop.",
        },
    },
    synthwave: {
        a: {
            name: 'The neon sign',
            text: "The '84 rule: the tube's core is light and the colour lives in the glow, pink around a lavender core, over an unlit tube. The mark is a cyan tube. Past the end the sign bends into a glowing ›. Loading lights the tube from left to right, holds, and lets it go dark, smoothly; nothing flickers.",
        },
        b: {
            name: 'Chrome over the grid',
            text: 'The track is the floor grid on the void with the pink horizon on top; the share is chrome: sky above, a dark horizon line through the middle, the sunset below. The mark is the striped sun, half risen over a laser-yellow line. Past the end a cyan ». Loading drives along the grid.',
        },
    },
    pastel: {
        a: {
            name: 'Washi tape',
            text: 'The share is a strip of plum washi tape with white stripes, its far end torn, the sky second pass showing off register beside it, on a dotted riso pill. The mark is a round sticker on a pin. Past the end the tape runs over and its corner curls. Loading drifts the stripes of a pale tape along the track.',
        },
        b: {
            name: 'Gummy candy',
            text: 'A sticker of a pill with its hard flat shadow; the share is plum candy with a gloss stripe and a shine at its end. The mark is a candy stick in white and mint with a plum outline. Past the end a gummy drop. Loading: a mint candy hops along three plum ones.',
        },
    },
    terminal: {
        a: {
            name: 'The htop meter',
            text: 'One line of htop: [||||||||        ] between square brackets, the share a run of phosphor bars, one per character cell, and dots where nothing is. The mark is the block caret, blinking once a second (the loop the theme allows). Past the end a + after the bracket. Loading walks a lit cell along the line.',
        },
        b: {
            name: 'The oscilloscope',
            text: 'A graticule with a division every tenth; the share is the trace, a bright phosphor line over its afterglow. The mark is the yellow cursor. Past the end the reading says OL, as a multimeter does when it is overloaded. Loading sweeps the beam across the screen with its fading tail.',
        },
    },
    forest: {
        a: {
            name: 'The wooden gauge with a leaf',
            text: 'A groove routed into light wood, the grain running along it; the share is the same wood stained forest green, with a knot. The mark is a stem with a leaf on top. Past the end the gauge sprouts a leaf. Loading carries a leaf through the empty groove on the wind.',
        },
        b: {
            name: 'The trail on the map',
            text: 'Two contour lines and the planned trail in clay dashes; the share is the trail walked, in forest ink. The mark is a trig point: the black survey triangle with its dot, on a post. Past the end a clay trail blaze points on. Loading walks the dashes along the trail.',
        },
    },
    'high-contrast': {
        a: {
            name: 'The ink frame',
            text: 'A 2px ink frame filled with solid ink, no colour needed; the mark is a white slot between two ink edges, readable on the ink and on the paper alike. Past the end a yellow plate in an ink frame with a +. Loading shows three ink squares, still: no loops, ever.',
        },
        b: {
            name: 'The pattern-coded gauge',
            text: 'The share is ink hatching, so it reads by pattern as well as by tone, in greyscale and forced colours too, closed by a solid ink edge. The mark is a yellow column in ink edges. Past the end a solid ink arrowhead. Loading is a dashed ink line through the empty frame, still.',
        },
    },
    sepia: {
        a: {
            name: 'The pen stroke and the blot',
            text: "A pencilled guide line of dots; the share is a brown ink stroke from a nib, tapered where the pen came down and pooled where it stops. The mark is a hairline with the lozenge of the theme's divider on top. Past the end the ink blots. Loading writes the stroke slowly and lets it fade, as a pen does.",
        },
        b: {
            name: 'The letterpress impression',
            text: 'A blind impression pressed into the paper; the share is inked into it, a little squashed at its edges and speckled where the ink did not take. The mark is a brass rule with a pilcrow ¶ above it. Past the end the ink is squeezed out in a smear. Loading presses the platen: the impression deepens and lifts.',
        },
    },
    blueprint: {
        a: {
            name: "The engineer's scale with a break line",
            text: 'A printed scale: a short tick every 5 %, a long one every 25 %, on a baseline; the share is the drawn line weight along the baseline with a cyan tint above. The mark is an amber datum triangle on its leader. Past the end the drawing uses the break line, the zigzag that says "longer than drawn". Loading runs the plotter pen along the baseline at an even pace.',
        },
        b: {
            name: 'The tolerance band',
            text: 'An outlined band on the millimetre grid; the share is a tinted bar drawn in outline. The mark is the amber centre line, a chain line that runs on above and below. Past the end the out-of-tolerance region is hatched in amber. Loading traces the outline with a moving dash.',
        },
    },
    solstice: {
        a: {
            name: 'The standing stones',
            text: 'A band of earth split by the horizon; the share is ridged ground caught by the low sun, each ridge lit on one side. The mark is a standing stone, lit on its sunward edge, throwing its long shadow along the ground, the stone the solstice sun lines up with. Past the end the sun rises over the horizon. Loading lets a warm dawn rise and fade, unhurried.',
        },
        b: {
            name: 'The embers',
            text: 'A charcoal log; the share is embers, amber with hot specks and rust, breathing slowly. The mark is a dark iron poker with a pale edge. Past the end sparks fly up. Loading shows faint embers breathing along the whole log. Firelight, not neon.',
        },
    },
    brutalism: {
        a: {
            name: 'The slab with an overhang',
            text: 'A box in the 3px black line with the hard shadow; the share is the yellow plate with a black line at its edge. The mark is a black post with a lavender cap. Past the end a yellow block is slammed out over the edge of the box. Loading runs the yellow-and-black tape through the box.',
        },
        b: {
            name: 'The stacked blocks',
            text: 'Ten boxes in a row, each in the black line; the share fills them with lavender. The mark is a yellow peg with a tab sticking up. Past the end one more block is thrown on top, off the row. Loading drops the blocks in one at a time.',
        },
    },
    deco: {
        a: {
            name: 'The gilt frieze',
            text: "A black band between two double gold rules; the share is flat gold that ends in the Empire State's chevron. The mark is an emerald lozenge set on a dark spire. Past the end the chevrons go on: ›››. Loading lets a glint run along the gilt.",
        },
        b: {
            name: 'The lobby floor indicator',
            text: 'The lamps over a lobby lift: a row of windows, lit in gold up to the share, dark beyond. The mark is a gold arrow pointing down at the floor you want. Past the end an arrow up: higher than the top floor. Loading moves one lit lamp along the row, the lift travelling.',
        },
    },
    phantom: {
        a: {
            name: 'The calling card',
            text: 'A slab cut at the -8° slant, black under a halftone screen; the share is the red plate with its deep red second plate off register. The mark is a white shard of paper. Past the end a white burst with a black "!". Loading slides the halftone screen.',
        },
        b: {
            name: 'The ransom collage',
            text: 'The share is a strip of cut paper pieces, red, white and red, glued at a slant with black cuts between. The mark is a black shard edged in white. Past the end the strip tears off in a jagged white shard. Loading shuffles the pieces in hard steps.',
        },
    },
    'shade-light': {
        a: {
            name: 'The pencil gauge',
            text: 'An outline drawn in pencil on the paper; the share is the blue plate hatched over in pencil. The mark is a graphite stroke with a soft shade beside it. Past the end a patch of pencil scribble. Loading hatches the empty gauge in once and leaves it, as every reveal here runs once.',
        },
        b: {
            name: 'The pin and its shade',
            text: 'A groove in the paper; the share is a raised blue strip throwing a soft shade. The mark is a pin with a magenta head standing in the gauge, its shade falling to the side. Past the end the strip hangs over the edge, its shade falling beyond. Loading lets the shade of a passing cloud cross the paper.',
        },
    },
    'shade-dark': {
        a: {
            name: 'Silverpoint',
            text: 'The dark half of the pencil gauge: fine silver lines hatched across the dark ground, the share the blue plate laid over them with a lit top edge. The mark is a pale metal stroke. Past the end a patch of silver scribble. Loading hatches the empty gauge in once.',
        },
        b: {
            name: 'The reading lamp',
            text: 'A deep well; the share is the blue plate lifted out of the shade. The mark carries the light: a pale pin with a pool of lamplight around it, so the target is where the light is. Past the end the light spills out beyond the well. Loading slides the pool of light slowly along the well.',
        },
    },
    retro: {
        a: {
            name: 'The dithered installer bar',
            text: 'A sunken field with the bevel inside its boundary; the share is navy whose last few pixels are dithered, 1995-style. The mark is a raised grey slider thumb. Past the end a raised scroll-arrow button. Loading fills the field with the 50 % dither brush, still: nothing blinks.',
        },
        b: {
            name: 'The defragmenter',
            text: 'Two rows of tiny cells, as the 1995 disk defragmenter drew a drive: navy cells up to the share, a few teal ones among them, white cells beyond. The mark is a white cell column in a black frame. Past the end two more cells sit outside the field. Loading walks a teal cell along the drive, reading it.',
        },
    },
    grotesk: {
        a: {
            name: 'The red block on the baseline',
            text: 'A black baseline; the share is a flat red block standing on it. The mark is a black rule rising from the baseline, flush. Past the end an oversized black →. Loading cuts in three black squares, one after another, in hard steps.',
        },
        b: {
            name: 'The zebra scale',
            text: 'A frame with a black-and-white zebra scale of twelve columns along its foot; the share is solid black. The mark is a red rule with a small red square flag. Past the end a red square set lower, off the line. Loading hops the zebra one column and back.',
        },
    },
    lapis: {
        a: {
            name: 'The gilt band',
            text: "Deep lapis ruled in gold above and below; the share is gold leaf tooled with a fine lattice. The mark is a vermilion reed stroke with its diamond dot, the nuqta, above it. Past the end a vermilion toranj, the pointed cartouche. Loading lets a burnisher's glint run along the gold.",
        },
        b: {
            name: 'Lapis stone on vellum',
            text: 'The track is ivory vellum ruled in gold; the share is the stone itself, deep lapis flecked with gold pyrite and a streak of calcite. The mark is a gold leaf stroke. Past the end a chipped shard of the stone. Loading lets the pyrite flecks glint.',
        },
    },
    nostromo: {
        a: {
            name: 'The bargraph tube',
            text: 'A dark glass tube set into the beige case, a wire along it; the share glows orange in the tube, a hot core in a warm glow, like a 1979 bargraph tube. The mark is a cream tick printed on the glass. Past the end the overload lamp is lit. Loading warms the tube: a faint glow breathing along the wire.',
        },
        b: {
            name: 'The backlit vents',
            text: 'A row of vent slots in the beige plastic; up to the share the slots are lit orange from inside. The mark is a strip of embossed black label tape with ▼, on a dark line. Past the end a cut piece of label tape reads +. Loading runs a glow along the slots, one after another.',
        },
    },
    titanium: {
        a: {
            name: 'The heat-tinted groove',
            text: 'A groove engraved into the metal, dark at its top edge and lit along its lower lip; the share is the oxide that heat grows, gold, bronze, violet, blue, fixed by where it stands along the groove. The mark is a milled pointer with two facets. Past the end a burr of bare bright metal. Loading runs the cutter along the groove at an even, linear pace: metal does not ease.',
        },
        b: {
            name: 'The vernier caliper',
            text: "The main scale engraved along the top; the share is the caliper's sliding beam, bright metal with a knurled grip. The mark is the vernier's zero line filled with the blue oxide, its small scale beside it. Past the end the jaw's chamfered tip slides off the scale. Loading rolls the knurl, linearly.",
        },
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="meter"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, two]) => [theme, `${two[which].name}. ${two[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'meter',
            label: 'The meter for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain meter, as today',
                    hint: 'Keep the package meter in this theme: the same shape as everywhere, in the theme’s colours.',
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
        `Character 1 is ${two.a.name.replace(/^The /, 'the ')}, character 2 ${two.b.name.replace(/^The /, 'the ')}; the third column is the plain meter of today. ` +
        'Look at the three meters in each column, then press Loading, Mark past the end and the two tones: the words around the meters never move, ' +
        'and the mark reads on the fill and on the track alike.';
    look.append(p);
}

/* ------------------------------------------------------- the meters */

/** @type {Record<string, { value: number, mark: number | null, label: string, markLabel: string }>} */
const METERS = {
    disk: { value: 0.62, mark: 0.8, label: 'of the disk used', markLabel: 'the target' },
    seats: { value: 1.3, mark: 0.8, label: 'of the seats booked', markLabel: 'comfortable' },
    quota: { value: 0.91, mark: 0.8, label: 'of the quota used', markLabel: 'the warning level' },
    sign: { value: 1.3, mark: null, label: 'booked', markLabel: '' },
};
const state = { loading: false, markover: false, tone: /** @type {'' | 'warning' | 'destructive'} */ ('') };

function draw() {
    for (const el of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-cm-meter]'))) {
        const key = el.getAttribute('data-cm-meter') ?? 'disk';
        const m = METERS[key];
        const mark = key === 'disk' && state.markover ? 1.15 : m.mark;
        setMeter(el, { value: m.value, mark, tone: state.tone || null, label: m.label, markLabel: m.markLabel, loading: state.loading });
    }
    for (const label of document.querySelectorAll('[data-cm-label="disk"]'))
        label.textContent = state.markover ? 'Disk: 62 % used, target 115 %' : 'Disk: 62 % used, target 80 %';
}

for (const button of document.querySelectorAll('[data-cm-toggle]'))
    button.addEventListener('click', () => {
        const key = /** @type {'loading' | 'markover'} */ (button.getAttribute('data-cm-toggle'));
        state[key] = !state[key];
        button.setAttribute('aria-pressed', String(state[key]));
        draw();
    });
const toneButtons = [...document.querySelectorAll('[data-cm-tone]')];
for (const button of toneButtons)
    button.addEventListener('click', () => {
        state.tone = /** @type {'' | 'warning' | 'destructive'} */ (button.getAttribute('data-cm-tone') ?? '');
        for (const b of toneButtons) b.setAttribute('aria-pressed', String(b === button));
        draw();
    });
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-cm-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) p.hidden = p.getAttribute('data-for') !== theme;
    const two = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-cm-name="${which}"]`);
        const desc = document.querySelector(`[data-cm-desc="${which}"]`);
        if (name) name.textContent = two ? two[which].name : '';
        if (desc) desc.textContent = two ? two[which].text : '';
    }
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cm-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/open-reverse; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('cm-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-cm-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-cm-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-cm-speed'));
        try {
            localStorage.setItem('cm-speed', String(rate));
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
    for (const col of section.querySelectorAll('[data-cm-pick]')) col.classList.toggle('cm-picked', col.getAttribute('data-cm-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.cm-picked')) col.classList.remove('cm-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
