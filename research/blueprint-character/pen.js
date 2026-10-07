// The tracing pen, as ONE shared piece (Kenny, 2026-10-07 21:19: blueprint's
// anchor is the tracing pen, research/blueprint-anchor). Every scene of this
// demo that arrives, opens, leaves, waits, is pressed or changes does it with
// this pen, so the family reads as one.
//
// The carriage is the anchor's, drawn identically (research/blueprint-anchor
// art.js): a 16 unit square in the steel line, a crosshair through it, a
// nib that is down (filled) or up (hollow), on a gantry rail of two thin
// lines that follows the pen's height. The tracer is the anchor's curve
// (an overshooting response that settles), ink following the pen on a
// graticule, amber witness lines dropping from the nib to both axes and a
// pointer on each, so the pen's place is read on both scales.
//
// The geometry is copied, not imported: the anchor folder is a decided record
// and never read at run time. options.css and pen.css hang every rule on
// `.bw-scene`, because the review dialog moves a section out of the page.

/** The carriage: ground, box, crosshair, nib (the anchor's `ba2-pl-car`). */
export const CARRIAGE = `<svg class="bw-pen__svg" viewBox="-13 -13 26 26" aria-hidden="true" focusable="false"><rect class="bw-pen__ground" x="-8" y="-8" width="16" height="16"/><rect class="bw-pen__box" x="-8" y="-8" width="16" height="16"/><path class="bw-pen__sight" d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13"/><circle class="bw-pen__nib" r="3.5"/></svg>`;

/**
 * The pen: a gantry rail and a carriage, in a box the size of the part it
 * works on. It is away (hidden) at rest and while a part is away; a program
 * in options.css sets it going. `bare` leaves the rail out and the carriage
 * small, for a day, a row, a button or a waiting place.
 */
export const pen = (bare = false, extra = '') =>
    `<span class="bw-pen${bare ? ' bw-pen--bare' : ''}${extra ? ` ${extra}` : ''}" aria-hidden="true"><span class="bw-pen__rail"></span><span class="bw-pen__car"><span class="bw-pen__sway">${CARRIAGE}</span></span></span>`;

/** The response curve the anchor traces: 1 - e^(-5x) cos(10x), scaled to 80 % of the box. */
const curve = (/** @type {number} */ x) => 1 - (1 - Math.exp(-5 * x) * Math.cos(10 * x)) / 1.25;

const POINTS = Array.from({ length: 61 }, (_, i) => `${((i / 60) * 100).toFixed(2)},${(curve(i / 60) * 100).toFixed(2)}`).join(' ');

/**
 * The anchor's tracing, small: the curve (revealed to the pen's place), the
 * two amber witness lines, a pointer on each axis and the pen. pen.css
 * computes the nib's height from the same formula as `curve` above, from the
 * one number `--bw-p` (0 to 1) that every part of it reads.
 */
export const tracer = (/** @type {string} */ label = '') =>
    `<span class="bw-tracer${label ? ' bw-tracer--label' : ''}" aria-hidden="true"><svg class="bw-tracer__line" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false"><polyline points="${POINTS}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><span class="bw-tracer__wv"></span><span class="bw-tracer__wh"></span><span class="bw-tracer__px"></span><span class="bw-tracer__py"></span>${
        label ? `<span class="bw-tracer__label">${label}</span>` : ''
    }${pen(true)}</span>`;
