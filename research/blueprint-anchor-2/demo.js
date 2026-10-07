// What anchors blueprint, round two (Kenny, 2026-10-07 20:44, on round one):
// "I kind of like the measuring part of option 1 [the dimension line], but not
// the implementation itself, like I don't like the form. And I LOVE the plotter
// pen, so that should be a thing for sure. Come up with some more examples
// based on this feedback."
//
// A review-kit demo in aspect mode, blueprint only, one aspect ("The anchor")
// with six options, each led by the same visible plotter pen and differing in
// what the pen does and how it measures: it dimensions, it plots (round one's
// option, unchanged), it rules along a straightedge, it inks what dividers
// step off, it hatches a section, it traces a curve against its axes. Each plays
// by itself in the middle of its own stage, on one clock: the anchor as the
// loading picture, its arrival complete, then the same picture played backwards
// as the leave (options.css writes it with `animation-direction: reverse` on the
// arrival's own keyframes, so each leave frame is an arrival frame).
//
// The options are data: the row on the page, the line-up and the dialog's
// choices are all built from OPTIONS, so they cannot disagree. The drawings
// and their keyframes are generated (build.mjs). The recommended option is first.

import { ART } from './art.js';

const QUESTION =
    'Which one element is blueprint’s anchor: the one from which every other decision of the theme (how a part arrives and leaves, how it is pressed, how it waits, how it raises an alarm) can be derived? The colours are settled and count as the base: the cyan pen, the amber annotation, the Prussian ground. The plotter pen leads every option.';

let uid = 0;

/* ------------------------------------------------------------- the options */

/**
 * The options, the recommendation first. `see` says what is on screen,
 * `carries` what this anchor would decide for the rest of the theme, and
 * `verdict` why it is or is not the recommendation. `tag` is a note beside the
 * name that is not a recommendation.
 */
const OPTIONS = [
    {
        key: 'dimension',
        name: 'The pen that dimensions',
        title: 'A pen drawing the extension lines and a dimension line under a part, ticking each end, then lettering the measured value stroke by stroke',
        see: 'A part stands on the sheet in thin steel. The pen comes down at the left extension line and draws it, ticks the end with one slash, draws the dimension line across, ticks the other end, draws the right extension line, then moves up over the line and writes the value, 240, in single-stroke lettering in amber. It lifts and parks. The leave retraces it: the pen comes back, un-writes the value and plots the lines away, last first. There is no bar, no arrowheads, no hatched fill and no chain line: the measuring is the pen’s own stroke.',
        carries: {
            Arrival:
                'a part is constructed by the pen (its extension lines, then its dimension), then lettered: the proposed G2 and G3, with the measuring in the stroke.',
            Leave: 'the pen retraces and un-writes: the lettering first, then the lines, last in, first out.',
            Press: 'the pen draws a short dimension across the foot of the control and letters its value: the press you picked, with its pen.',
            Loading: 'the pen draws the dimension line of a section that has no value yet; the value is lettered when it arrives.',
            Alarm: 'the pen draws the dimension again in the tone’s ink, flags it, and the value is lettered as a word.',
        },
        verdict:
            'Recommended: it keeps the pen you love and gives it the job that is the theme’s own sentence, “a dark blue theme that measures”, without the bar form you did not like. One gesture (draw the lines, tick the ends, letter the value) decides how a part arrives, how it is pressed and how it waits. Its limit: it reads best on something with a length; a round thing is measured by the compass, which is already the spinner.',
    },
    {
        key: 'plotter',
        name: 'The plotter pen',
        tag: 'The one you loved, unchanged',
        title: 'A plotter pen on its gantry plotting a line, ringing the last point and lifting',
        see: 'A gantry rail and a pen carriage on millimetre paper. The pen goes down, plots a series stroke by stroke (it ramps up and down at every vertex, as a stepper plotter does), rings the last point, draws an amber leader, lifts and parks, and the figure is lettered. The leave retraces it: the pen comes down again and plots the line away, backwards, to where it started. This is round one’s option 2, frame for frame.',
        carries: {
            Arrival: 'every element is drawn by the pen before it is inked: outline first, then the words (the proposed G2 and G3).',
            Leave: 'the pen retraces and un-plots the element.',
            Press: 'the pen drops and marks the control; a press has no natural picture here.',
            Loading: 'the pen plots a line or a row at a time and never finishes; it needs a visible pen on every waiting part.',
            Alarm: 'the pen is changed to a red one and the line is plotted again.',
        },
        verdict:
            'Kept exactly as you saw it, as the reference the other five are measured against. It decides arrival and opening best and gives the feed curve its meaning, but on its own it plots a line and says nothing about measuring. Option 1 gives the same pen that job.',
    },
    {
        key: 'straightedge',
        name: 'The pen on the straightedge',
        title: 'A parallel-motion straightedge sliding down a sheet in steps while the pen rules a line along its edge at each stop, a margin readout counting the distance',
        see: 'A parallel-motion straightedge (a head against the margin scale, a long blade) stands at the top of a sheet marked by four corner brackets. The pen runs along its working edge and rules a line; the straightedge slides down one step, the pen runs back the other way and rules the next: five rulings. In the margin a readout counts the distance ruled, 20 to 100 mm. The pen parks at the blade’s end. The leave slides the straightedge back up, un-ruling line by line.',
        carries: {
            Arrival: 'a list or a table is ruled in row by row, the straightedge sliding to the next row each time.',
            Leave: 'the rows are un-ruled from the bottom, the straightedge sliding back up.',
            Press: 'the straightedge comes down on the control and the pen rules its foot.',
            Loading: 'a section is ruled line by line; how much is ruled is the progress, and the margin reads the distance.',
            Alarm: 'the pen rules the failed row once more in the tone’s ink.',
        },
        verdict:
            'Not recommended: the clearest picture of progress (how much of the sheet is ruled, read in the margin) and the most instrument-like, but its gesture is a sweep along a straight edge, which is titanium’s feed and formal’s ledger pen (G2 forbids an arrival uncovered by a sliding edge), and a straightedge in every menu and tooltip would be heavy.',
    },
    {
        key: 'dividers',
        name: 'The dividers',
        title: 'A pair of dividers walking along a line while the pen inks a tick at every point they have pricked, a count rising',
        see: 'A line to be divided and a pair of dividers set to 60 mm, standing on its first two points. The dividers walk: each step the rear leg swings over the front one and lands a span ahead (the feed ramps at every step), while the pen follows one step behind and inks a tick at each point the dividers have pricked. An amber count rises with every tick. At the end the dividers are lifted away, the pen inks the last two ticks and parks. The leave: the pen un-inks the last ticks, the dividers come back and walk backwards along the line.',
        carries: {
            Arrival: 'a row of equal things (tabs, steps, the ticks of a meter) is stepped off at an equal pitch, one pen tick each.',
            Leave: 'it is stepped back: the ticks are lifted, last first.',
            Press: 'one step: the dividers take one span at the control and the pen inks one tick.',
            Loading: 'ticks are stepped off along the track at an equal pitch; the count is the progress.',
            Alarm: 'a step that does not land: the dividers stop short and the tick is inked in the tone’s ink.',
        },
        verdict:
            'Not recommended: the only candidate that measures by counting equal spans, and the plainest progress (a count, an even pitch), but it is two instruments for one gesture (the pen only follows), a stepping count reads as terminal’s cursor and nostromo’s lamps, and G1 allows steps for whole counted things only, not for how a part arrives.',
    },
    {
        key: 'hatching',
        name: 'The hatching pen',
        title: 'A pen hatching a circle in 45 degree strokes, one stroke at a time, until the section is full and lettered',
        see: 'A round bar’s section: a circle with its centre marks. The pen hatches it in 45° strokes, one at a time, alternating direction with a short lift between strokes, from the top-left to the bottom-right: nine strokes, no wash, no fill, only the pen’s lines. When the circle is full the pen lifts and parks and the drawing is lettered SECTION A–A. The leave: the pen comes back and un-hatches it stroke by stroke.',
        carries: {
            Arrival: 'the section of a part is hatched when its content is known.',
            Leave: 'the hatch is un-drawn stroke by stroke (the leave you picked hatches out; this one un-hatches).',
            Press: 'one stroke of the hatch across the held control.',
            Loading: 'a section being hatched stroke by stroke: the signature skeleton with its pen in view (G10).',
            Alarm: 'one stroke in the tone’s ink through the section: struck out.',
        },
        verdict:
            'Not recommended as the anchor: it is the theme’s own section hatch (already the skeleton, the progress fill and the leave) with the pen in view, and it shows waiting better than any other option. But a hatch is a texture for an area: on its own it cannot say how a line or an outline arrives. It works as the loading half of option 1.',
    },
    {
        key: 'tracing',
        name: 'The tracing pen',
        title: 'A pen tracing a curve across a graticule, amber witness lines and pointers reading its place on both axes as it goes',
        see: 'A graticule on millimetre paper with two axes, ticked and numbered. The pen traces a curve (a response that overshoots and settles) in one stroke, the feed ramping only at its start and end. While it runs, an amber witness line drops from the pen to each axis and a pointer slides along each axis, so the pen’s place is read on both scales at every moment. At the end the final reading is lettered by the curve. The leave: the pen backs along the curve, un-tracing it, the pointers and witness lines following.',
        carries: {
            Arrival: 'a chart or any data is traced in one stroke and read against its axes as it goes.',
            Leave: 'the trace is backed out along the curve.',
            Press: 'the pointers snap to the pressed point and read its two values.',
            Loading: 'an empty graticule with its pen tracing the first curve; the data is the arrival.',
            Alarm: 'the witness line to the failing axis in the tone’s ink.',
        },
        verdict:
            'Not recommended as the anchor: the best loading picture for a chart and for waiting data, and the pointers and witness lines make the measuring literal. But it needs a graticule and a curve, which only data has; a menu or a button would have nothing to trace. It is the chart’s picture, not the theme’s.',
    },
];

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="blueprint"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'anchor',
            label: 'The anchor',
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : o.tag ? ` (${o.tag.toLowerCase()})` : ''}`,
                // The dialog shows only this hint beside the option on screen.
                hint: `${o.see} ${o.verdict}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'blueprint');
lookLine.textContent =
    'One question, six options, every one led by the plotter pen. Each stage plays by itself: the loading picture, its arrival, and its leave as the same picture played backwards. The first is the recommendation, the second is the pen you loved, unchanged. Pick the one blueprint can be derived from, or “None of these” with a note.';
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

/** One stage: the drawing alone in the middle of the sheet. */
const stage = (/** @type {(typeof OPTIONS)[number]} */ o, /** @type {string} */ kind, /** @type {string} */ extra = '') => {
    uid += 1;
    const art = ART[/** @type {keyof typeof ART} */ (o.key)].replaceAll('__U__', String(uid));
    return `<div class="ba2-scene" data-ba2-kind="${kind}"${extra} data-ba2-phase="hold"><div class="ba2-part"><svg class="ba2-art" viewBox="0 0 480 200" role="img" aria-label="${o.title}">${art}</svg></div></div>`;
};

/** @type {HTMLElement} */ (document.querySelector('[data-ba2-question]')).textContent = QUESTION;
const grid = /** @type {HTMLElement} */ (document.querySelector('[data-ba2-options]'));
OPTIONS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'ba2-col';
    col.setAttribute('data-ba2-option', String(at + 1));
    col.innerHTML = `<p class="ba2-label"><span class="ba2-label__no">${at + 1}</span> <span class="ba2-label__name"></span>${
        at === 0 ? ' <span class="ba2-label__rec">Recommended</span>' : o.tag ? ' <span class="ba2-label__tag"></span>' : ''
    }</p>${stage(o, 'cycle', ` data-ba2-anchor="${o.key}"`)}<p class="ba2-see"></p><dl class="ba2-carries"></dl><p class="ba2-verdict"></p>`;
    /** @type {HTMLElement} */ (col.querySelector('.ba2-label__name')).textContent = o.name;
    const tag = col.querySelector('.ba2-label__tag');
    if (tag && o.tag) tag.textContent = o.tag;
    /** @type {HTMLElement} */ (col.querySelector('.ba2-see')).textContent = o.see;
    const dl = /** @type {HTMLElement} */ (col.querySelector('.ba2-carries'));
    for (const [what, how] of Object.entries(o.carries)) {
        const dt = document.createElement('dt');
        dt.textContent = what;
        const dd = document.createElement('dd');
        dd.textContent = how;
        dl.append(dt, dd);
    }
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.ba2-verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('ba2-verdict--rec', at === 0);
    grid.append(col);
});

/* ------------------------------------------------------------- the line-up */

const lineup = /** @type {HTMLElement} */ (document.querySelector('[data-ba2-lineup]'));
OPTIONS.forEach((o, at) => {
    const fig = document.createElement('figure');
    fig.className = 'ba2-lineup__cell';
    fig.innerHTML = `${stage(o, 'line', ` data-ba2-anchor="${o.key}"`)}<figcaption><span class="ba2-lineup__no">${at + 1}</span> </figcaption>`;
    /** @type {HTMLElement} */ (fig.querySelector('figcaption')).append(o.name);
    lineup.append(fig);
});

/* ---------------------------------------------------------- the one clock */

// Every stage is driven by one clock, so the six always start together and
// can be compared. One cycle: `gap` (everything away), `in` (the loading
// picture runs and completes), `hold` (it stands), `out` (the same picture
// played backwards). The CSS keys every motion to the phase; the clock only
// writes the attribute on every stage in one pass. It counts only while the
// review dialog is not paused, and its phases follow the speed buttons.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-ba2-motion]');
const PHASES = /** @type {const} */ ([
    ['gap', 640],
    ['in', 3000],
    ['hold', 1700],
    ['out', 3000],
]);
const STEP = 50;
const scenes = [...document.querySelectorAll('.ba2-scene')];
let slow = 1;
let at = 0;
let elapsed = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) scene.setAttribute('data-ba2-phase', phase);
}

function run(/** @type {number} */ next) {
    window.clearInterval(timer);
    at = next;
    elapsed = 0;
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    setPhase(PHASES[at][0]);
    timer = window.setInterval(() => {
        if (dialogPaused()) return;
        elapsed += STEP;
        if (elapsed >= PHASES[at][1] * slow) run((at + 1) % PHASES.length);
    }, STEP);
}

/* --------------------------------------------------------------- controls */

const speeds = [...document.querySelectorAll('[data-ba2-speed]')];
for (const b of speeds)
    b.addEventListener('click', () => {
        for (const other of speeds) other.setAttribute('aria-pressed', String(other === b));
        slow = 1 / Number(b.getAttribute('data-ba2-speed'));
        document.documentElement.style.setProperty('--ba2-slow', String(slow));
        run(0);
    });
document.querySelector('[data-ba2-replay]')?.addEventListener('click', () => run(0));

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
