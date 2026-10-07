// What anchors blueprint (Kenny, 2026-10-07 15:55 and 16:13): "wat bij forest
// de bomenprogressbalk en de kleuren, en bij titanium de nieuwe loading
// animatie was dat ik als echt anker kon gebruiken om beslissingen over het
// hele thema te maken ... Maar ik wil dus weten wat per thema hun
// 'ankerelement' gaat zijn", then "blueprint ook een demo".
//
// A review-kit demo in aspect mode, blueprint only, one aspect ("The anchor")
// with six options that differ in KIND, each something a drawing office has:
// a dimension line, a plotter pen, a cyanotype exposure, a revision cloud, a
// compass and a scale ruler. Each plays by itself in the middle of its own
// stage, on one clock: the anchor as the loading picture, its arrival
// complete, then the same picture played backwards as the leave (options.css
// writes it with `animation-direction: reverse` on the arrival's own
// keyframes, so each leave frame is an arrival frame).
//
// The options are data: the row on the page, the line-up and the dialog's
// choices are all built from OPTIONS, so they cannot disagree. The
// recommended option is first.

const QUESTION =
    'Which one element is blueprint’s anchor: the one from which every other decision of the theme (how a part arrives and leaves, how it is pressed, how it waits, how it raises an alarm) can be derived? The colours are settled and count as the base: the cyan pen, the amber annotation, the Prussian ground.';

/* ------------------------------------------------------------ the drawings */

let uid = 0;

/** The drawings, one per option; `u` makes ids unique, since the page holds each drawing twice (the line-up and the row). */
const ART = {
    dimension: (/** @type {string} */ u) => `
        <defs><pattern id="ba-h-${u}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path class="ba-hatch" d="M0 0V6"/></pattern></defs>
        <path class="ba-p ba-ln ba-bold ba-note ba-draw ba-dim-wit" pathLength="1" d="M56 84V140"/>
        <path class="ba-p ba-ln ba-bold ba-note ba-draw ba-dim-wit" pathLength="1" d="M424 84V140"/>
        <g class="ba-p ba-dim-scale">
            <path class="ba-ln ba-steel" d="M56 112H424"/>
            <path class="ba-ln ba-steel" d="M92 105v14M128 105v14M164 105v14M200 105v14M236 105v14M272 105v14M308 105v14M344 105v14M380 105v14"/>
        </g>
        <g class="ba-p ba-dim-arrows"><path class="ba-fill-steel" d="M56 112l12-5v10zM424 112l-12-5v10z"/></g>
        <g class="ba-p ba-dim-fill">
            <rect class="ba-fill-ground" x="68" y="102" width="344" height="20"/>
            <rect x="68" y="102" width="344" height="20" fill="url(#ba-h-${u})"/>
            <path class="ba-ln ba-bold ba-pen" d="M68 103H412M68 121H412"/>
            <path class="ba-p ba-ln ba-pen ba-dim-chain" style="stroke-width: 3" d="M68 112H412"/>
        </g>
        <g class="ba-p ba-dim-head">
            <path class="ba-ln ba-bold ba-pen" d="M68 98V126"/>
            <path class="ba-fill-pen" d="M68 102L79 112L68 122L71.5 112Z"/>
        </g>
        <text class="ba-p ba-dim-value ba-note-text" x="240" y="94" text-anchor="middle">368.0 MM</text>
        <text class="ba-p ba-dim-label" x="240" y="168" text-anchor="middle">SHEET A-201</text>`,

    plotter: (/** @type {string} */ u) => `
        <defs><pattern id="ba-g-${u}" width="10" height="10" patternUnits="userSpaceOnUse"><path class="ba-mm" d="M10 0H0V10"/></pattern></defs>
        <rect x="70" y="40" width="350" height="140" fill="url(#ba-g-${u})"/>
        <path class="ba-p ba-ln ba-steel ba-plot-rail" d="M40 -2.5H440M40 2.5H440"/>
        <path class="ba-p ba-ln ba-bold ba-pen ba-draw ba-plot-line" pathLength="1" stroke-linejoin="round" d="M80 138L140 112L190 126L250 84L310 98L400 54"/>
        <path class="ba-p ba-ln ba-pen ba-draw ba-plot-mark" pathLength="1" d="M405 54A5 5 0 1 1 395 54A5 5 0 1 1 405 54"/>
        <path class="ba-p ba-ln ba-note ba-draw ba-plot-leader" pathLength="1" d="M400 54L432 30"/>
        <text class="ba-p ba-plot-label ba-note-text" x="438" y="34">412 KN</text>
        <g class="ba-p ba-plot-carriage">
            <rect class="ba-fill-ground" x="-8" y="-8" width="16" height="16"/>
            <rect class="ba-ln ba-steel" x="-8" y="-8" width="16" height="16"/>
            <path class="ba-ln ba-steel" d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13"/>
            <circle class="ba-p ba-plot-nib ba-nib" r="3.5"/>
        </g>`,

    cyanotype: () => `
        <rect class="ba-p ba-cy-veil" x="90" y="30" width="300" height="130"/>
        <path class="ba-ln ba-steel" d="M84 44V24H104M376 24H396V44M396 146V166H376M104 166H84V146"/>
        <path class="ba-ln ba-ink" d="M120 56H252V82H292V56H360V122H120ZM205 56V96M205 112V122M221 112A16 16 0 0 0 205 96M205 112H221"/>
        <path class="ba-ln ba-note" d="M120 140H360M120 134V146M360 134V146"/>
        <text class="ba-note-text" x="240" y="135" text-anchor="middle">6.00 M</text>
        <text x="120" y="46">PLAN A-201</text>`,

    cloud: () => `
        <text x="150" y="56">LOAD · KN</text>
        <path class="ba-p ba-ln ba-bold ba-note ba-draw ba-cloud-draw" pathLength="1" d="M150 66 A7.8 7.8 0 0 1 165 66 A7.8 7.8 0 0 1 180 66 A7.8 7.8 0 0 1 195 66 A7.8 7.8 0 0 1 210 66 A7.8 7.8 0 0 1 225 66 A7.8 7.8 0 0 1 240 66 A7.8 7.8 0 0 1 255 66 A7.8 7.8 0 0 1 270 66 A7.8 7.8 0 0 1 285 66 A7.8 7.8 0 0 1 300 66 A7.8 7.8 0 0 1 315 66 A7.8 7.8 0 0 1 330 66 A7.8 7.8 0 0 1 330 81.2 A7.8 7.8 0 0 1 330 96.4 A7.8 7.8 0 0 1 330 111.6 A7.8 7.8 0 0 1 330 126.8 A7.8 7.8 0 0 1 330 142 A7.8 7.8 0 0 1 315 142 A7.8 7.8 0 0 1 300 142 A7.8 7.8 0 0 1 285 142 A7.8 7.8 0 0 1 270 142 A7.8 7.8 0 0 1 255 142 A7.8 7.8 0 0 1 240 142 A7.8 7.8 0 0 1 225 142 A7.8 7.8 0 0 1 210 142 A7.8 7.8 0 0 1 195 142 A7.8 7.8 0 0 1 180 142 A7.8 7.8 0 0 1 165 142 A7.8 7.8 0 0 1 150 142 A7.8 7.8 0 0 1 150 126.8 A7.8 7.8 0 0 1 150 111.6 A7.8 7.8 0 0 1 150 96.4 A7.8 7.8 0 0 1 150 81.2 A7.8 7.8 0 0 1 150 66 Z"/>
        <text class="ba-p ba-cloud-pending ba-figure ba-faint" x="240" y="124" text-anchor="middle">– – –</text>
        <text class="ba-p ba-cloud-value ba-figure" x="240" y="124" text-anchor="middle">412</text>
        <path class="ba-p ba-ln ba-note ba-draw ba-cloud-tri" pathLength="1" d="M346 32L360 58H332Z"/>
        <text class="ba-p ba-cloud-letter ba-note-text" x="346" y="54" text-anchor="middle" style="font-size: 12px">B</text>`,

    compass: () => `
        <path class="ba-p ba-cp-in ba-ln ba-steel" d="M232 100H248M240 92V108"/>
        <circle class="ba-p ba-cp-in ba-ln" cx="240" cy="100" r="62" stroke-dasharray="3 4" style="stroke: hsl(from var(--ba-ink) h s l / 0.35)"/>
        <path class="ba-p ba-ln ba-bold ba-pen ba-draw ba-cp-arc" pathLength="1" d="M240 38A62 62 0 0 1 240 162A62 62 0 0 1 240 38"/>
        <g class="ba-p ba-cp-arm">
            <path class="ba-ln ba-steel" d="M240 100V38"/>
            <circle class="ba-fill-pen" cx="240" cy="38" r="3.5"/>
            <circle class="ba-fill-ground" cx="240" cy="100" r="5"/>
            <circle class="ba-ln ba-steel" cx="240" cy="100" r="5"/>
        </g>
        <path class="ba-p ba-ln ba-note ba-draw ba-cp-rad" pathLength="1" d="M240 100L283.8 56.2"/>
        <path class="ba-p ba-fill-note ba-cp-radhead" d="M283.8 56.2L279.2 65.8L274.2 60.8Z"/>
        <text class="ba-p ba-cp-radtext ba-note-text" x="292" y="52">R 62</text>`,

    ruler: () => `
        <path class="ba-p ba-ln ba-bold ba-steel ba-draw ba-sx-base" pathLength="1" d="M60 120H420"/>
        <g class="ba-p ba-sx-reveal">
            <path class="ba-ln ba-steel" d="M60 120v-20M69 120v-8M78 120v-8M87 120v-8M96 120v-8M105 120v-14M114 120v-8M123 120v-8M132 120v-8M141 120v-8M150 120v-20M159 120v-8M168 120v-8M177 120v-8M186 120v-8M195 120v-14M204 120v-8M213 120v-8M222 120v-8M231 120v-8M240 120v-20M249 120v-8M258 120v-8M267 120v-8M276 120v-8M285 120v-14M294 120v-8M303 120v-8M312 120v-8M321 120v-8M330 120v-20M339 120v-8M348 120v-8M357 120v-8M366 120v-8M375 120v-14M384 120v-8M393 120v-8M402 120v-8M411 120v-8M420 120v-20"/>
            <g style="font-size: 10px" text-anchor="end">
                <text x="61" y="138">0</text><text x="151" y="138">10</text><text x="241" y="138">20</text><text x="331" y="138">30</text><text x="421" y="138">40</text>
            </g>
        </g>
        <g class="ba-p ba-sx-cursor">
            <path class="ba-ln ba-bold ba-pen" d="M60 74V132"/>
            <path class="ba-fill-pen" d="M55 66H65L60 76Z"/>
        </g>
        <g class="ba-p ba-sx-units">
            <text class="ba-note-text" x="60" y="84">SCALE 1 : 50</text>
            <text x="428" y="124">MM</text>
        </g>`,
};

/* ------------------------------------------------------------- the options */

/**
 * The options, the recommendation first. `see` says what is on screen,
 * `carries` what this anchor would decide for the rest of the theme, and
 * `verdict` why it is or is not the recommendation.
 */
const OPTIONS = [
    {
        key: 'dimension',
        name: 'The dimension line',
        title: 'A dimension line being measured: witness lines, a scale, a hatched fill growing along it behind a head, then the length read',
        see: 'A measured length between two amber witness lines, an arrowhead at each end and a scale along it. A hatched fill grows along it behind a head while a chain line feeds inside the fill; when the length is full the head and the chain are lifted, and the length is lettered and read in amber. The leave is the same run backwards: the figure lifts, the fill unhatches back to the start, the line is untraced.',
        carries: {
            Arrival: 'a part is measured in: its witness lines first, then its dimension, then its words are lettered.',
            Leave: 'the hatch is drawn over it and it is lifted off the sheet, which is the leave you already picked.',
            Press: 'the amber dimension is drawn across the foot of the control, between its two witness lines.',
            Loading: 'a section is hatched between two ticks; with no end in sight the chain line feeds along it. Both are in the package.',
            Alarm: 'the dimension breaks at one end under a flag, the line takes the tone’s ink and the figure becomes a word.',
        },
        verdict:
            'Recommended: it is the theme’s own sentence, “a dark blue theme that measures”, and almost every decided pick is already a part of it (the progress bar, the meter, the witness lines, the press, the skeleton’s hatch, the hatched leave), so nothing needs inventing to derive the rest. Its weakness is that it is a shape more than a motion: how a whole panel arrives has to come from the plotter pen, option 2.',
    },
    {
        key: 'plotter',
        name: 'The plotter pen',
        title: 'A plotter pen on its gantry plotting a line, ringing the last point and lifting',
        see: 'A gantry rail and a pen carriage on millimetre paper. The pen goes down, plots a series stroke by stroke (it ramps up and down at every vertex, as a stepper plotter does), rings the last point, draws an amber leader, lifts and parks, and the figure is lettered. The leave retraces it: the pen comes down again and plots the line away, backwards, to where it started.',
        carries: {
            Arrival: 'every element is drawn by the pen before it is inked: outline first, then the words (the proposed G2 and G3).',
            Leave: 'the pen retraces and un-plots the element. That is not the hatched leave you picked, which would be dropped.',
            Press: 'the pen drops and marks the control; a press has no natural picture here.',
            Loading: 'the pen plots a line or a row at a time and never finishes; it needs a visible pen on every waiting part.',
            Alarm: 'the pen is changed to a red one and the line is plotted again.',
        },
        verdict:
            'Not recommended as the anchor, though it is the strongest second: it would decide how everything arrives and opens, and it gives the feed curve its meaning. But it needs a visible pen to mean anything, a pen in every tooltip and menu would be heavy, and it says nothing about measuring or hatching, which your picks use everywhere. It stays what it is: the arrival.',
    },
    {
        key: 'cyanotype',
        name: 'The cyanotype exposure',
        title: 'A pale sheet exposing to blue and developing, a white drawing standing out of it',
        see: 'A sheet that starts pale, as sensitised paper, with a latent white drawing on it. Loading is the exposure: the pale veil thins to a mid blue; arrival is the developing: the veil goes to the deep blue of the ground and the white plan stands. The leave is the exposure undone: the drawing sinks back into a pale sheet.',
        carries: {
            Arrival: 'a part develops out of a pale sheet into the deep blue.',
            Leave: 'the part bleaches back to pale, then is gone.',
            Press: 'a held control is exposed: it darkens for as long as it is held.',
            Loading: 'a pale veil thins over what is waiting.',
            Alarm: 'the sheet is fogged: a red cast over the part.',
        },
        verdict:
            'Not recommended: it tells how a blueprint is made better than any other candidate, but it is a tone change, and the grammar forbids a wash and a filled plate (a plate has no fill; no wash over 14 %). Every component would arrive as a lit pale panel on a dark ground, which is the opposite of a drawing that is simply on the table.',
    },
    {
        key: 'cloud',
        name: 'The revision cloud',
        title: 'A scalloped amber cloud drawn round a value, the value written, a revision triangle and letter added',
        see: 'A figure’s place reads “– – –” while the checker draws a scalloped amber cloud round it, clockwise, side by side at the pen’s feed. When the cloud closes the dashes lift, the value is written at once, and the revision triangle with its letter is drawn at the cloud’s top-end corner. The leave: the letter lifts, the value goes, the cloud is untraced.',
        carries: {
            Arrival: 'anything new is clouded and carries the next revision letter.',
            Leave: 'the cloud is untraced, as when a revision is withdrawn.',
            Press: 'the control is clouded for as long as it is held.',
            Loading: 'a cloud is drawn round every place that is waiting.',
            Alarm: 'a red cloud and a filled ▲ round what is wrong.',
        },
        verdict:
            'Not recommended: it is the best picture for “this is new or updated” (your graph’s Revised, already decided as the live update), but an annotation is not a base. It says nothing about how a menu opens or a row waits, and a cloud round every loading place would make the page look edited rather than drawn.',
    },
    {
        key: 'compass',
        name: 'The compass',
        title: 'A compass swinging round a centre mark, the circle drawn behind its pencil, the radius dimensioned',
        see: 'A centre mark and a dashed construction circle. The compass (seen from above: its pencil leg, the pencil on the circle, the hinge on the centre) swings once round the centre while the circle is drawn behind the pencil; the leg lifts and the radius is dimensioned in amber. The leave: the radius is untraced, the compass comes down on the circle and swings back, un-drawing it.',
        carries: {
            Arrival: 'round things are swung (the empty state’s circle, the radio, a chart point); a box cannot be swung.',
            Leave: 'the compass swings back and un-draws the circle.',
            Press: 'a small circle is swung round the centre of the control.',
            Loading: 'a circle drawn round a centre mark, everywhere a spinner would be; this is already the decided spinner.',
            Alarm: 'a red circle is drawn round the fault.',
        },
        verdict:
            'Not recommended: it is already blueprint’s decided spinner and it is the most graceful, but a compass only draws circles and the theme is nearly all square corners (round only where a compass draws). As the anchor every loading picture would become a ring, and a ring is what every other theme’s spinner is.',
    },
    {
        key: 'ruler',
        name: 'The scale ruler',
        title: 'An engineer’s scale with ticks counting up under a sliding cursor, the unit and the scale lettered',
        see: 'An engineer’s scale: its edge is drawn, then a hairline cursor slides along it one tick at a time and every tick and numeral is inked as the cursor reaches it (41 ticks, 0 to 40); at the end the cursor lifts and the scale and its unit are lettered (SCALE 1 : 50, MM). The leave: the labels lift, the cursor comes back along the scale unpicking every tick, the edge is untraced.',
        carries: {
            Arrival: 'a list or table is counted in, row by row, under a cursor.',
            Leave: 'it is counted out again, last row first.',
            Press: 'the cursor snaps to the control and reads it.',
            Loading: 'ticks count up under the cursor, with a unit.',
            Alarm: 'the cursor stops on a tick that turns red.',
        },
        verdict:
            'Not recommended: it is the only candidate with a visible unit and a count, but a stepping counter reads as terminal’s cursor or nostromo’s lamps, it draws nothing, and the grammar allows steps only for whole things that are counted. A ruler in every component would be a gimmick, not a root.',
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
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
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
    'One question, six options. Each stage plays by itself: the loading picture, its arrival, and its leave as the same picture played backwards. The first is the recommendation. Pick the one blueprint can be derived from, or “None of these” with a note.';
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

/** One stage: the drawing alone in the middle of the sheet. */
const stage = (/** @type {(typeof OPTIONS)[number]} */ o, /** @type {string} */ kind, /** @type {string} */ extra = '') => {
    uid += 1;
    return `<div class="ba-scene" data-ba-kind="${kind}"${extra} data-ba-phase="hold"><div class="ba-part"><svg class="ba-art" viewBox="0 0 480 200" role="img" aria-label="${o.title}">${ART[/** @type {keyof typeof ART} */ (o.key)](String(uid))}</svg></div></div>`;
};

/** @type {HTMLElement} */ (document.querySelector('[data-ba-question]')).textContent = QUESTION;
const grid = /** @type {HTMLElement} */ (document.querySelector('[data-ba-options]'));
OPTIONS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'ba-col';
    col.setAttribute('data-ba-option', String(at + 1));
    col.innerHTML = `<p class="ba-label"><span class="ba-label__no">${at + 1}</span> <span class="ba-label__name"></span>${
        at === 0 ? ' <span class="ba-label__rec">Recommended</span>' : ''
    }</p>${stage(o, 'cycle', ` data-ba-anchor="${o.key}"`)}<p class="ba-see"></p><dl class="ba-carries"></dl><p class="ba-verdict"></p>`;
    /** @type {HTMLElement} */ (col.querySelector('.ba-label__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.ba-see')).textContent = o.see;
    const dl = /** @type {HTMLElement} */ (col.querySelector('.ba-carries'));
    for (const [what, how] of Object.entries(o.carries)) {
        const dt = document.createElement('dt');
        dt.textContent = what;
        const dd = document.createElement('dd');
        dd.textContent = how;
        dl.append(dt, dd);
    }
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.ba-verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('ba-verdict--rec', at === 0);
    grid.append(col);
});

/* ------------------------------------------------------------- the line-up */

const lineup = /** @type {HTMLElement} */ (document.querySelector('[data-ba-lineup]'));
OPTIONS.forEach((o, at) => {
    const fig = document.createElement('figure');
    fig.className = 'ba-lineup__cell';
    fig.innerHTML = `${stage(o, 'line', ` data-ba-anchor="${o.key}"`)}<figcaption><span class="ba-lineup__no">${at + 1}</span> </figcaption>`;
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
const motionNote = document.querySelector('[data-ba-motion]');
const PHASES = /** @type {const} */ ([
    ['gap', 640],
    ['in', 3000],
    ['hold', 1700],
    ['out', 3000],
]);
const STEP = 50;
const scenes = [...document.querySelectorAll('.ba-scene')];
let slow = 1;
let at = 0;
let elapsed = 0;
let timer = 0;

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) scene.setAttribute('data-ba-phase', phase);
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

const speeds = [...document.querySelectorAll('[data-ba-speed]')];
for (const b of speeds)
    b.addEventListener('click', () => {
        for (const other of speeds) other.setAttribute('aria-pressed', String(other === b));
        slow = 1 / Number(b.getAttribute('data-ba-speed'));
        document.documentElement.style.setProperty('--ba-slow', String(slow));
        run(0);
    });
document.querySelector('[data-ba-replay]')?.addEventListener('click', () => run(0));

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run(0);
};
reduced.addEventListener('change', syncMotion);
syncMotion();
