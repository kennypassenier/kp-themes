// research/character-state: phase 1 of the character round for the state
// word (`.kp-state-word`, css/components.css "A state word that keeps its
// width" [scope-143]; setStateWord() in js/components.js), all 22 themes in
// one demo judged through the review kit. As the trend tile and the meter
// (Kenny, 2026-10-05 20:03: "and it should be like this in the future"),
// nothing is bundled: the chip has three aspects, each picked on its own
// from three options.
//
// The word itself is the package's own: this page only adds a dot in front
// of it and calls setStateWord() to change it, exactly as a consumer would
// (js/components.js is not changed). Every aspect is CSS only, in state.css
// and state-a..d.css, keyed by one attribute each on the chip
// (`data-sw-shape`, `data-sw-tone`, `data-sw-change`) plus the state's kind
// (`data-sw-kind="good|muted|pending|bad"`, set here from the word), so any
// combination composes. On the page: one composed preview showing the
// current picks, and per aspect a row of three chips that differ in that
// aspect only; the plain word of today stands below them for reference. The
// controls sit in the section's `data-review-controls` container, which the
// review kit mirrors into its dialog.

import { setStateWord } from '../../js/components.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'tone' | 'change'} Aspect */

/** The three aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    { id: 'shape', label: 'Shape', about: 'The dot and the word’s plate. Compare them as they stand, then press a state.' },
    {
        id: 'tone',
        label: 'Tone',
        about: 'How Running, Stopped, Restarting, Starting in 3 min and Failed read against each other. Press every state once.',
    },
    { id: 'change', label: 'Change', about: 'What plays when the word moves to a new state. Press a different state to replay it.' },
];

/**
 * Per theme, three options for each aspect, one sentence each: the spec the
 * CSS (state.css for formal/titanium, state-a..d.css for the rest) must
 * implement.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            { name: 'The seal', text: 'A small round wax seal sits before the word, the word itself in the serif, no plate under it.' },
            { name: 'The ledger tab', text: 'A thin ruled tab holds the word, the dot a square ink stamp at its left edge.' },
            { name: 'The signet', text: 'The dot is an engraved signet ring, the word in small capitals on a hairline-framed plate.' },
        ],
        tone: [
            { name: 'The ink rule', text: 'Only the seal takes the state’s colour; the word stays the page’s ink in every state.' },
            { name: 'The red entry', text: 'A warning or failed state also tints the word itself in the tone’s own ink.' },
            { name: 'The ledger stamp', text: 'Every state but Running gets a thin ruled frame of its own colour around the tab.' },
        ],
        change: [
            { name: 'Re-sealed', text: 'The seal presses down once and lifts, slowing as it lands.' },
            { name: 'Entered in the ledger', text: 'The tab’s rule redraws left to right under the new word.' },
            { name: 'Turned over', text: 'The word flips over like a card index, in two hard steps.' },
        ],
    },
    light: {
        shape: [
            { name: 'The soft dot', text: 'A soft round dot with a gentle glow sits before the word on no plate.' },
            { name: 'The daylight pill', text: 'The whole chip is a pale rounded pill lifted on a soft shadow, the dot at its left.' },
            { name: 'The sticky note', text: 'The word sits on a small square note with a folded corner, the dot a pin through it.' },
        ],
        tone: [
            { name: 'The soft wash', text: 'Only the dot takes the state’s colour; the word stays the page’s ink.' },
            { name: 'The tinted pill', text: 'The pill’s background washes softly into the state’s colour, the word kept dark enough to read.' },
            { name: 'The warm note', text: 'A warning or failed state warms the note’s paper and darkens the pin.' },
        ],
        change: [
            { name: 'A soft swell', text: 'The dot swells once and settles, slowing as it lands.' },
            { name: 'The pill breathes', text: 'The pill widens a touch and back as the word changes, easing in and out.' },
            { name: 'The note flutters', text: 'The note tips a few degrees and rights itself, overshooting once.' },
        ],
    },
    dark: {
        shape: [
            { name: 'The status lamp', text: 'A small lit lamp sits before the word, the word in ticker mono on no plate.' },
            { name: 'The panel tab', text: 'A flat machined tab holds the word, the dot recessed into its own lit well.' },
            { name: 'The console line', text: 'The dot is a square indicator, the word in mono capitals on a dark ruled line.' },
        ],
        tone: [
            { name: 'The lamp colour', text: 'Only the lamp takes the state’s colour and glow; the word stays lit white.' },
            { name: 'The lit well', text: 'The tab’s well lights in the state’s colour, the word kept in mono white over it.' },
            { name: 'The alarm line', text: 'A warning or failed state also lights the console line’s rule in its colour.' },
        ],
        change: [
            { name: 'The lamp flares', text: 'The lamp flares with light once, slowing as it lands.' },
            { name: 'Switched over', text: 'The tab strikes on and off like a tube, then holds, in hard jumps.' },
            { name: 'The line jumps', text: 'The console line’s rule jolts once, as a needle does, in two hard steps.' },
        ],
    },
    cyberpunk: {
        shape: [
            { name: 'The neon dot', text: 'A neon dot with its glow sits before the word, the word in tech mono on no plate.' },
            { name: 'The HUD bracket', text: 'Yellow brackets frame a small tag holding the word, the dot a cut-corner chip.' },
            { name: 'The data tag', text: 'The dot is a square data light, the word in mono with a faint RGB split on a dark plate.' },
        ],
        tone: [
            { name: 'The neon colour', text: 'Only the neon dot takes the state’s colour and glow; the word stays cyan.' },
            { name: 'The hazard tag', text: 'A warning or failed state wraps the tag in hazard-striped brackets of its colour.' },
            { name: 'The glitch split', text: 'Every non-running state also gives the word a one-frame RGB split in its colour.' },
        ],
        change: [
            { name: 'The trace burns', text: 'The dot flares with light once, slowing as it lands.' },
            { name: 'Jacked in', text: 'The word jumps sideways into place once, in a hard jump.' },
            { name: 'A packet in', text: 'The word glitches for a moment, in two hard steps, then settles.' },
        ],
    },
    synthwave: {
        shape: [
            { name: 'The sunset dot', text: 'A glowing sunset-coloured dot sits before the word, the word in VT323 on no plate.' },
            { name: 'The VCR tag', text: 'The word sits in a small OSD box with scanlines, the dot a square pixel at its left.' },
            { name: 'The grid chip', text: 'The dot sits on a tiny perspective-grid tile, the word in the display face beside it.' },
        ],
        tone: [
            { name: 'The laser colour', text: 'Only the dot takes the state’s colour and glow; the word stays pink.' },
            { name: 'The inverse block', text: 'A warning or failed state inverts the OSD box to the state’s colour.' },
            { name: 'The grid glow', text: 'The grid chip’s glow tints to the state’s colour under every non-running state.' },
        ],
        change: [
            { name: 'The laser flares', text: 'The dot flares with light once, slowing as it lands.' },
            { name: 'The tracking rolls', text: 'The OSD box rolls down once like a VCR tracking band, in a hard jump.' },
            { name: 'Over the horizon', text: 'The word rises from the baseline once, slowing as it lands.' },
        ],
    },
    pastel: {
        shape: [
            { name: 'The candy dot', text: 'A round candy-coloured dot with a flat sticker shadow sits before the word on no plate.' },
            { name: 'The washi tag', text: 'A strip of washi tape holds the word, the dot a sprinkle at its left.' },
            { name: 'The sticker chip', text: 'The dot and the word both sit on one round sticker with its own flat shadow.' },
        ],
        tone: [
            { name: 'The candy colour', text: 'Only the dot takes the state’s colour; the word stays the page’s ink.' },
            { name: 'The taped label', text: 'The washi tape’s colour follows the state, the word kept dark enough to read.' },
            { name: 'The heart sticker', text: 'A warning or failed state turns the sticker a little askew in its colour.' },
        ],
        change: [
            { name: 'A happy hop', text: 'The dot hops once, overshooting, then settles.' },
            { name: 'The tape flutters', text: 'The tape drifts a little and settles back, easing in and out.' },
            { name: 'Popped', text: 'The sticker pops up once, overshooting, then lands.' },
        ],
    },
    terminal: {
        shape: [
            { name: 'The top(1) row', text: 'The word sits in the mono with an asterisk for a dot, in reverse video on no plate.' },
            { name: 'The box-drawn tag', text: 'A tag drawn in box-drawing characters holds the word, the dot a filled character cell.' },
            { name: 'The status line', text: 'The dot is a blinking block cursor before the word, both in the phosphor.' },
        ],
        tone: [
            { name: 'The reverse colour', text: 'Only the reverse-video background takes the state’s colour; the glyphs stay the phosphor.' },
            { name: 'The bracket colour', text: 'The box-drawn tag’s rule takes the state’s colour, the word kept in the phosphor.' },
            { name: 'The alert blink', text: 'A warning or failed state also colours the blinking cursor.' },
        ],
        change: [
            { name: 'A blip', text: 'The dot flares with light once, slowing as it lands.' },
            { name: 'Redrawn', text: 'The tag’s box-drawing rule redraws left to right under the new word.' },
            { name: 'The cursor blinks faster', text: 'The cursor blinks twice quickly once, then returns to its steady rate.' },
        ],
    },
    forest: {
        shape: [
            { name: 'The trail marker', text: 'A small round trail-blaze marker sits before the word, the word in serif italic on no plate.' },
            { name: 'The wooden tag', text: 'A small wooden tag on a leather loop holds the word, the dot a carved mark on it.' },
            { name: 'The leaf chip', text: 'The dot is a small leaf, the word on a mossy plate with a contour-ring edge.' },
        ],
        tone: [
            { name: 'The blaze colour', text: 'Only the trail-blaze marker takes the state’s colour; the word stays bark ink.' },
            { name: 'The tag stain', text: 'The wooden tag’s stain deepens toward the state’s colour, the word kept dark enough to read.' },
            { name: 'The autumn leaf', text: 'A warning or failed state turns the leaf dot the colour of autumn in that tone.' },
        ],
        change: [
            { name: 'A rustle', text: 'The leaf dot turns over once, as in a breeze, easing in and out.' },
            { name: 'Blazed again', text: 'The trail-blaze marker is painted on once, slowing as it lands.' },
            {
                name: 'A growth ring',
                text: 'A thin ring is drawn once round the blaze dot, clockwise from the top, then fades; the word never moves.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            { name: 'The ink dot', text: 'A heavy black dot sits before the word, the word bold on no plate.' },
            { name: 'The framed tag', text: 'A hard black frame holds the word, the dot filled solid at its left edge.' },
            { name: 'The inverse chip', text: 'The dot and the word sit on one ink-filled plate, the word in the paper colour.' },
        ],
        tone: [
            { name: 'The dot only', text: 'Only the dot takes the state’s colour at full strength; the word stays black on white.' },
            { name: 'The framed colour', text: 'The framed tag’s border takes the state’s colour at full strength, the word kept black.' },
            { name: 'The inverse colour', text: 'The inverse chip’s fill takes the state’s colour, the word kept in the paper colour on it.' },
        ],
        change: [
            { name: 'A hard flash', text: 'The dot snaps to full strength once and back, in a single hard jump.' },
            { name: 'The frame redraws', text: 'The frame’s border redraws in one hard step under the new word.' },
            { name: 'Inverted', text: 'The chip inverts once and back, in two hard steps.' },
        ],
    },
    sepia: {
        shape: [
            { name: 'The ink blot', text: 'A small round ink blot sits before the word, the word in the nib’s hand on no plate.' },
            { name: 'The letterpress tag', text: 'A pressed rectangle holds the word, the dot a stamped circle at its left.' },
            { name: 'The barograph mark', text: 'The dot sits on ruled chart paper, the word beside it in a fine nib trace.' },
        ],
        tone: [
            { name: 'The ink colour only', text: 'Only the ink blot takes the state’s colour; the word stays sepia ink.' },
            { name: 'The pressed colour', text: 'The letterpress tag’s impression deepens toward the state’s colour, the word kept readable.' },
            { name: 'The red-ink entry', text: 'A warning or failed state is ruled off along the left edge in the accountant’s red ink.' },
        ],
        change: [
            { name: 'A blot spreads', text: 'The ink blot spreads once and settles, slowing as it lands.' },
            { name: 'Pressed again', text: 'The letterpress tag is pressed once more, in a single hard step.' },
            { name: 'Signed again', text: 'The nib trace is retraced once, easing in and out.' },
        ],
    },
    blueprint: {
        shape: [
            { name: 'The pin mark', text: 'A small drafting-pin dot sits before the word, the word in technical mono on no plate.' },
            { name: 'The title block', text: 'A cell parted by drawn rules holds the word, the dot a dimension tick at its left.' },
            { name: 'The grid chip', text: 'The dot sits on a millimetre-grid tile, the word in mono capitals beside it.' },
        ],
        tone: [
            { name: 'The pin colour', text: 'Only the pin dot takes the state’s colour; the word stays white ink.' },
            { name: 'The ruled colour', text: 'The title block’s rules take the state’s colour, the word kept in white ink.' },
            { name: 'The hatch warning', text: 'A warning or failed state fills the grid chip with a hatch of its colour.' },
        ],
        change: [
            { name: 'A tick redraws', text: 'The dimension tick redraws once, slowing as it lands.' },
            { name: 'Ruled again', text: 'The title block’s rules redraw left to right under the new word.' },
            { name: 'Plotted', text: 'The grid chip is replotted in hard steps, line by line.' },
        ],
    },
    solstice: {
        shape: [
            { name: 'The ember', text: 'A small glowing ember sits before the word, the word in warm light on no plate.' },
            { name: 'The low sun chip', text: 'A small rising-glow tile holds the dot, the word in the serif beside it.' },
            { name: 'The warm tag', text: 'The dot and the word sit on one glass chip warmed from below.' },
        ],
        tone: [
            { name: 'The ember colour only', text: 'Only the ember takes the state’s colour and halo; the word stays warm white.' },
            { name: 'The glowing chip', text: 'The glass chip warms toward the state’s colour, the word kept warm white on it.' },
            { name: 'The hot halo', text: 'A warning or failed state widens the ember’s halo in its colour.' },
        ],
        change: [
            { name: 'A glint', text: 'The ember flares with light once, slowing as it lands.' },
            { name: 'The sun rises', text: 'The glow rises once from the foot of the chip and settles, easing in and out.' },
            { name: 'Rekindled', text: 'The ember dims and relights once, in two hard steps.' },
        ],
    },
    brutalism: {
        shape: [
            { name: 'The block dot', text: 'A square heavy dot sits before the word, the word in heavy capitals on no plate.' },
            { name: 'The slab tag', text: 'A heavy-framed slab with a hard offset shadow holds the word, the dot filled solid.' },
            { name: 'The sticker chip', text: 'The dot and the word sit on one askew sticker with a black outline.' },
        ],
        tone: [
            { name: 'The block colour', text: 'Only the square dot takes the state’s colour at full strength; the word stays black.' },
            { name: 'The slab colour', text: 'The slab’s fill takes the state’s colour, the word kept black or white on it for contrast.' },
            { name: 'The hazard sticker', text: 'A warning or failed state turns the sticker’s outline thicker in its colour.' },
        ],
        change: [
            { name: 'A hard slam', text: 'The block dot snaps larger once and back, in a single hard jump.' },
            { name: 'The slab shifts', text: 'The slab’s shadow jumps to a new offset once, in a hard jump.' },
            { name: 'Restamped', text: 'The sticker tips to a new angle once, in a hard jump.' },
        ],
    },
    deco: {
        shape: [
            { name: 'The gilt dot', text: 'A small gold dot sits before the word, the word in the display face’s capitals on no plate.' },
            { name: 'The marquee tag', text: 'A row of bulbs frames a small plaque holding the word, the dot a lit bulb at its left.' },
            { name: 'The sunburst chip', text: 'The dot sits before a faint gold sunburst, the word on a gold-framed plaque.' },
        ],
        tone: [
            { name: 'The gold colour only', text: 'Only the gold dot takes the state’s colour; the word stays the display ink.' },
            { name: 'The lit marquee', text: 'The marquee’s bulb takes the state’s colour and glow, the word kept in the display ink.' },
            { name: 'The gold warning', text: 'A warning or failed state tints the sunburst itself toward that colour.' },
        ],
        change: [
            { name: 'A bulb lights', text: 'The lit bulb flares with light once, slowing as it lands.' },
            { name: 'The marquee chases', text: 'The row of bulbs chases once from left to right, in hard steps.' },
            { name: 'Regilded', text: 'The gold dot gleams once, easing in and out.' },
        ],
    },
    phantom: {
        shape: [
            { name: 'The red dot', text: 'A small red-string dot sits before the word, the word slanted on no plate.' },
            { name: 'The evidence tag', text: 'A stamped ring frames a small tag holding the word, the dot the stamp’s ink.' },
            { name: 'The calling card', text: 'The dot and the word sit on one card with a red slash across its corner.' },
        ],
        tone: [
            { name: 'The string colour only', text: 'Only the red-string dot takes the state’s colour; the word stays the card’s ink.' },
            { name: 'The stamped colour', text: 'The stamp ring’s ink takes the state’s colour, the word kept dark enough to read.' },
            { name: 'The slashed warning', text: 'A warning or failed state thickens the card’s corner slash in its colour.' },
        ],
        change: [
            { name: 'Pinned', text: 'The dot is pinned down once, overshooting, then settles.' },
            { name: 'Restamped', text: 'The stamp ring is pressed once more, in a single hard step.' },
            { name: 'Re-slashed', text: 'The corner slash is drawn once more, slowing as it lands.' },
        ],
    },
    retro: {
        shape: [
            { name: 'The LED dot', text: 'A small square LED sits before the word, the word in the system face on no plate.' },
            { name: 'The bevelled tag', text: 'A raised grey bevel frames a small tag holding the word, the dot a sunken well.' },
            { name: 'The scope chip', text: 'The dot sits in a black well with a green grid, the word in the mono beside it.' },
        ],
        tone: [
            { name: 'The LED colour only', text: 'Only the square LED takes the state’s colour; the word stays the system face colour.' },
            { name: 'The bevel colour', text: 'The sunken well’s background takes the state’s colour, the word kept readable on it.' },
            { name: 'The scope warning', text: 'A warning or failed state tints the scope grid itself toward that colour.' },
        ],
        change: [
            { name: 'The LED blinks', text: 'The LED blinks twice quickly once, then returns to steady.' },
            { name: 'Switched', text: 'The bevelled tag inverts once and back, in a single hard jump.' },
            { name: 'A trace jumps', text: 'The scope’s trace jolts once, as a needle does, in two hard steps.' },
        ],
    },
    grotesk: {
        shape: [
            { name: 'The colour bar dot', text: 'A small flat-colour square sits before the word, the word in bold grotesque on no plate.' },
            { name: 'The transit tag', text: 'A thick bar in the state’s colour crosses a small tag holding the word.' },
            { name: 'The index chip', text: 'The dot and the word sit on one plate with a red index tick at its corner.' },
        ],
        tone: [
            { name: 'The flat colour only', text: 'Only the flat-colour square takes the state’s colour; the word stays bold black.' },
            { name: 'The bar colour', text: 'The transit tag’s bar takes the state’s colour, the word kept bold black on it.' },
            { name: 'The index warning', text: 'A warning or failed state turns the index tick itself that colour.' },
        ],
        change: [
            {
                name: 'Re-registered',
                text: 'The word and its square are written at once; behind them a red copy falls back into register along the closing spiral, clockwise, in 8 units.',
            },
            { name: 'The bar redraws', text: 'The transit bar redraws left to right once under the new word.' },
            { name: 'Ticked', text: 'The index tick snaps to a new mark once, in a hard jump.' },
        ],
    },
    nostromo: {
        shape: [
            { name: 'The CRT dot', text: 'A small phosphor dot sits before the word, the word in mono capitals on no plate.' },
            { name: 'The indicator tag', text: 'A lit indicator lamp holds the word on embossed label tape.' },
            { name: 'The panel chip', text: 'The dot (its lamp) and the word sit on one embossed key of the case, the key’s corner, clean plastic.' },
        ],
        tone: [
            { name: 'The phosphor colour only', text: 'Only the phosphor dot takes the state’s colour and glow; the word stays mono white.' },
            { name: 'The lamp colour', text: 'The indicator lamp takes the state’s colour and glow, the word kept on the label tape.' },
            {
                name: 'The klaxon warning',
                text: 'A warning or failed state frames the panel chip all round, 3 px, in its colour, as the bridge alarm; the chip keeps its size.',
            },
        ],
        change: [
            { name: 'A blip', text: 'The phosphor dot flares with light once, slowing as it lands.' },
            { name: 'The lamp lights', text: 'The indicator lamp switches on and holds, in a hard jump.' },
            { name: 'Rescanned', text: 'The scanlines sweep once across the panel chip, slowing as they land.' },
        ],
    },
    titanium: {
        shape: [
            { name: 'The milled dot', text: 'A small brushed-metal dot sits before the word, the word in instrument mono on no plate.' },
            { name: 'The dial tag', text: 'A knurled band frames a small tag holding the word, the dot an anodised rim.' },
            { name: 'The badge chip', text: 'The dot and the word sit on one anodised badge with a diagonal sheen.' },
        ],
        tone: [
            { name: 'The anodised colour only', text: 'Only the dot’s anodised rim takes the state’s colour; the word stays instrument ink.' },
            { name: 'The machined colour', text: 'The dial tag’s band takes the state’s colour, the word kept instrument ink on it.' },
            { name: 'The badge warning', text: 'A warning or failed state tints the badge’s sheen toward that colour.' },
        ],
        change: [
            { name: 'A click of the dial', text: 'The dot jolts once, as a needle does, in a hard jump.' },
            { name: 'The knurl rolls', text: 'The knurled band rolls once along the tag, slowing as it lands.' },
            { name: 'A glint', text: 'The badge’s sheen sweeps once across it, slowing as it lands.' },
        ],
    },
};

/**
 * Round 1's verdicts (Kenny, 2026-10-06 19:38), in the order of ASPECTS:
 * shape, tone, change. A number is settled and not asked again; '' is open
 * in round 2: phantom's shape is new ("none, first one seems broken"), its
 * tone and change are judged again in the picked shape.
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '2', '1'],
    light: ['1', '1', '1'],
    dark: ['1', '3', '1'],
    cyberpunk: ['3', '2', '1'],
    synthwave: ['3', '3', '1'],
    pastel: ['3', '3', '2'],
    terminal: ['2', '3', '3'],
    forest: ['1', '1', '3'],
    'high-contrast': ['3', '2', '1'],
    sepia: ['2', '3', '3'],
    blueprint: ['2', '2', '1'],
    solstice: ['3', '3', '1'],
    brutalism: ['1', '3', '2'],
    deco: ['3', '3', '1'],
    phantom: ['3', '2', '1'],
    retro: ['1', '3', '2'],
    grotesk: ['3', '3', '1'],
    nostromo: ['3', '3', '1'],
    titanium: ['3', '2', '3'],
};
const keptOf = (/** @type {string} */ t, /** @type {Aspect} */ id) => PICKED[t]?.[ASPECTS.findIndex((a) => a.id === id)] ?? '';
// Round 2's new options replace an aspect's (each carries its own key, the
// attribute value its CSS answers to; round 1's are 1, 2, 3).
for (const [t, aspects] of Object.entries(R2A)) for (const [id, options] of Object.entries(aspects)) if (options.length >= 3) IDEAS[t][id] = options;
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="state"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// three choices per theme, each option's name and what it does as its hint.
// Round 2 asks only what Kenny sent back; the rest is settled and hidden.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
            default: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, keptOf(t, id)]),
            ),
            fixed: Object.fromEntries(
                Object.keys(PICKED)
                    .filter((t) => keptOf(t, id))
                    .map((t) => [t, true]),
            ),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const theme of Object.keys(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent = ASPECTS.some(({ id }) => !keptOf(theme, id))
        ? 'Round 2: three new shapes; the tone and the change are judged again in the shape you pick first. Press every state once, then Failed.'
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const CHIP = `<span class="sw-chip" data-sw>
    <span class="kp-state-word" data-kp-words="Running&#10;Stopped&#10;Restarting&#10;Starting in 3 min&#10;Failed" data-sw-word>Running</span>
</span>`;
const rows = /** @type {HTMLElement} */ (section.querySelector('[data-sw-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'sw-aspect';
    box.setAttribute('data-sw-aspect', id);
    box.setAttribute('aria-labelledby', `h-sw-${id}`);
    const head = document.createElement('div');
    head.className = 'sw-aspect__head';
    head.innerHTML = '<h3></h3><p></p>';
    head.firstElementChild.id = `h-sw-${id}`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'sw-trio';
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'sw-col';
        cell.setAttribute('data-sw-vary', id);
        cell.setAttribute('data-sw-option', String(at));
        cell.innerHTML =
            `<p class="sw-label"><span class="sw-label__no">${label} · ${at}</span> <span data-sw-name></span></p>` +
            `<p class="sw-desc" data-sw-desc></p><div class="sw-row">${CHIP}<button type="button" class="kp-button kp-button--sm" disabled>Stop</button></div>`;
        trio.append(cell);
    }
    box.append(head, trio);
    rows.append(box);
}

/* ------------------------------------------------------- the picks */

/** What is ticked in the dialog, per theme; an aspect not ticked yet shows its option 1. */
/** @type {Record<string, Partial<Record<Aspect, string>>>} */
const ticked = {};
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';
const picks = () =>
    /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? (keptOf(theme(), id) || '1')])));

/** The word's kind, by what it means: good, muted, pending or bad. @param {string} word */
const kindOf = (word) =>
    word === 'Running' ? 'good' : word === 'Stopped' ? 'muted' : word === 'Failed' ? 'bad' : /* Restarting, Starting in … */ 'pending';

/** Writes the three aspects on every chip: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const kind = kindOf(state.word);
    const preview = section.querySelector('[data-sw-preview] [data-sw]');
    if (preview) {
        for (const { id } of ASPECTS) {
            const key = keyOf(theme(), id, now[id]);
            if (preview.getAttribute(`data-sw-${id}`) !== key) preview.setAttribute(`data-sw-${id}`, key);
        }
        if (preview.getAttribute('data-sw-kind') !== kind) preview.setAttribute('data-sw-kind', kind);
    }
    for (const cell of section.querySelectorAll('[data-sw-vary]')) {
        const vary = cell.getAttribute('data-sw-vary');
        const option = cell.getAttribute('data-sw-option') ?? '1';
        const chip = cell.querySelector('[data-sw]');
        for (const { id } of ASPECTS) {
            const value = keyOf(theme(), id, id === vary ? option : now[id]);
            if (chip?.getAttribute(`data-sw-${id}`) !== value) chip?.setAttribute(`data-sw-${id}`, value);
        }
        if (chip?.getAttribute('data-sw-kind') !== kind) chip?.setAttribute('data-sw-kind', kind);
        cell.classList.toggle('sw-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-sw-picks]');
    const idea = IDEAS[theme()];
    if (words && idea)
        words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1]?.name ?? ''}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ---------------------------------------------------------- the state */

const state = { word: 'Running' };

/** Every chip and the plain reference words, so pressing a state moves all of them together. */
const chipWords = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-sw-word]')]);
const plainWords = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-sw-plain]')]);

/** Moves every chip to `word`, replays the picked Change, and updates the preview and rows' kind. */
function setWord(word) {
    state.word = word;
    for (const el of chipWords()) setStateWord(el, word);
    for (const el of plainWords()) setStateWord(el, word);
    compose();
    // Retrigger the Change animation: toggling the attribute off and on
    // (with a layout read between, so the browser does not coalesce the two
    // writes) restarts the animation named by the current option.
    for (const chip of section.querySelectorAll('[data-sw]')) {
        chip.removeAttribute('data-sw-playing');
        void (/** @type {HTMLElement} */ (chip).offsetWidth);
        chip.setAttribute('data-sw-playing', '1');
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of section.querySelectorAll('[data-sw-state]'))
    b.addEventListener('click', () => {
        const word = b.getAttribute('data-sw-state') ?? 'Running';
        pressed('data-sw-state', word);
        setWord(word);
        const log = section.querySelector('[data-sw-log]');
        if (log) log.textContent = `Moved to ${word}.`;
    });

compose();
setWord('Running');

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-sw-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row.
    for (const box of section.querySelectorAll('[data-sw-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-sw-aspect'))));
    for (const cell of section.querySelectorAll('[data-sw-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-sw-vary'))]?.[Number(cell.getAttribute('data-sw-option')) - 1];
        const name = cell.querySelector('[data-sw-name]');
        const desc = cell.querySelector('[data-sw-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-sw-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-trend; full speed by default, since the Change is
// judged at its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('sw-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-sw-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-sw-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-sw-speed'));
        try {
            localStorage.setItem('sw-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();
