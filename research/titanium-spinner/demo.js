// A spinner for titanium (Kenny, 2026-10-07 00:54): "ik wil ook een paar
// nieuwe ontwerpen voor de spinner (die ook in andere componenten
// terugkomt)".
//
// A review-kit demo in aspect mode, titanium only, one aspect ("The
// spinner") with seven options: six new spinners and the drill as it is
// today, last. Each option is one attribute on its scene's wrapper
// (`data-ts-spinner="<key>"`) that options.css reads; the markup is the
// package's own and the same in every option, so only the spinner differs.
// The recommended option is first.

const not = (/** @type {string} */ why) => `Not recommended, because ${why}`;

const QUESTION =
    'Which spinner is titanium? The spinner turns up on its own and inside other components (a busy button, the data table, the calendar), so it has to read as busy at 12 px and at 40 px, stand still but still say busy under reduced motion, and sit beside the anodising bath without fighting it.';

/**
 * The options, the recommendation first. `key` is the value options.css
 * reads; `see` says what is on screen, `verdict` why it is or is not the
 * recommendation; `echoes` names the machine-shop part it comes from.
 */
const OPTIONS = [
    {
        key: 'facing',
        name: 'The facing cut',
        see: 'The end of a bar turning on a lathe, face on: turning grain, a centre point. The tool tip runs round the face (a bright line) and leaves the oxide film in its track, thin gold far behind it to thick cyan right behind the tip, fading back to bare metal before it comes round. One turn per 1800 ms, constant feed, clockwise (start → end).',
        verdict:
            'Recommended: it is the decided loading picture itself, the cutter leaving heat behind, on the one shape the grammar lets turn (a turned part). It runs at the bath’s 1800 ms beat, so beside a loading tile it moves as one, and its still pose is the bright tip with its coloured tail, which reads as busy at every size.',
    },
    {
        key: 'bath',
        name: 'The tag in the bath',
        see: 'An anodising tag, square with titanium’s chamfer (top left, bottom right) and a punched hole, bare brushed metal. A bright waterline runs start → end across it; behind the line the film has grown, gold at the line to cyan where the tag went in first. Then the next tag goes in. 1800 ms a pass.',
        verdict: not(
            'it is the bath made into a part and runs in step with it, but a tag filling up reads as progress rather than as an open-ended wait, and every 1800 ms it jumps back to bare metal; its still pose (six tenths in) reads as a stuck bar.',
        ),
    },
    {
        key: 'turret',
        name: 'The indexing turret',
        see: 'A hexagonal turret with six tool stations. It indexes one station every 300 ms, a step, never a glide: the station in work is the bright tool, the one that just cut keeps its heat in gold, the one before it has grown to blue, the others are empty bores. One turn per 1800 ms.',
        verdict: not(
            'it is the most mechanical of the six and the steps are titanium’s own count, but at 12 px the six bores merge into a dot pattern, and a stepping light is the one spinner idea every system already has.',
        ),
    },
    {
        key: 'mill',
        name: 'The end mill',
        see: 'A four-flute cutter seen end on, turning in its spindle at a constant 960 ms a turn. The cut is on the inline-end side: every flute that passes it catches the heat and shows the oxide colour, gold into blue, and goes back to bare metal as it leaves.',
        verdict: not(
            'it shows the cause of the colour best of all (heat where the tool meets the part), but four bright flutes turning fast is busy to look at for a long wait, and in the 12 px day it is a blur.',
        ),
    },
    {
        key: 'dial',
        name: 'The dial indicator',
        see: 'The machinist’s test gauge: a bezel, an engraved face of twelve ticks with a bright zero, a bright needle on a dark hub that sweeps round at a constant 1800 ms a turn, the way the needle runs while a part turns under the probe. No colour: a gauge measures, it is not heated.',
        verdict: not(
            'it is the calmest and the most legible at 12 px, but a hand going round a dial reads as a clock (time passing) more than as a machine at work, and with no oxide it does not sit with the bath.',
        ),
    },
    {
        key: 'saw',
        name: 'The slitting saw',
        see: 'A slitting saw: twelve hooked teeth with their faces leading, a bright ground rim on the teeth, a radial grinding sheen on the blade and the arbor hole in the middle, turning at a constant 1200 ms a turn. No colour: the coolant takes the heat.',
        verdict: not(
            'its toothed outline is the most distinct silhouette here, but a saw blade is the one picture in the set with a hint of danger, and its teeth vanish at 12 px, where it becomes a grey disc.',
        ),
    },
    {
        key: 'drill',
        name: 'The drill, as today',
        see: 'The register’s drill bit, side on: a chamfered shank with two oxide bands and fluted body whose flutes travel start → end one pitch per 480 ms (kp-sig-titanium-ti-flutes). Wider than it is tall (1.6 × 0.6 of the size).',
        verdict: not(
            'it is today’s spinner and it is titanium, but it is a bar, not a spinner: it does not fit the square slots the busy panel and the calendar day give it, the flutes at 12 px are a grey stripe, and its colour bands are decoration rather than heat.',
        ),
    },
];

/* ------------------------------------------------------------- the parts */

const edge = '<span class="kp-button__edge" aria-hidden="true"></span>';
const spinner = (/** @type {string} */ extra = '') => `<span class="kp-spinner" ${extra || 'aria-hidden="true"'}></span>`;

/** One week of a month heatmap, two days being read (`.kp-calendar--busy-days`). */
function week() {
    const days = [
        ['05', '3'],
        ['06', '5'],
        ['07', ''],
        ['08', ''],
        ['09', '4'],
        ['10', '2'],
        ['11', '6'],
    ];
    const cells = days
        .map(([d, n]) => {
            const busy = !n;
            const label = `${d}/10/2026: ${busy ? 'being read' : `${n} backups`}`;
            return `<td><button class="kp-calendar__day" type="button" tabindex="-1" aria-label="${label}"${busy ? ' data-kp-tone="loading"' : ` data-kp-level="${Math.min(4, Number(n) - 1)}"`}><span class="kp-calendar__num">${d}</span><span class="kp-calendar__count">${busy ? '&nbsp;' : n}</span>${busy ? `<span class="kp-calendar__day-busy" aria-hidden="true">${spinner()}</span>` : ''}</button></td>`;
        })
        .join('');
    return `<section class="kp-calendar kp-calendar--busy-days ts-cal" lang="en-GB" aria-label="Nightly backups, one week">
        <p class="kp-calendar__state" role="status" data-kp-state="loading">Reading the backups: 5 of 7 days read.</p>
        <table class="kp-calendar__grid" role="grid" aria-label="Week of 5 October 2026" aria-busy="true">
            <thead><tr><th scope="col" abbr="Monday">Mon</th><th scope="col" abbr="Tuesday">Tue</th><th scope="col" abbr="Wednesday">Wed</th><th scope="col" abbr="Thursday">Thu</th><th scope="col" abbr="Friday">Fri</th><th scope="col" abbr="Saturday">Sat</th><th scope="col" abbr="Sunday">Sun</th></tr></thead>
            <tbody><tr>${cells}</tr></tbody>
        </table>
    </section>`;
}

/** The data table while it reads: the busy overlay's panel over the rows, a spinner in the status line. */
const table = () => `<div class="kp-datatable ts-table" data-kp-busy-overlay aria-busy="true">
    <div class="kp-table-wrap" role="region" aria-label="Pump houses on the northern network" tabindex="0">
        <table class="kp-table">
            <caption class="kp-sr-only">Pump houses on the northern network</caption>
            <thead><tr><th scope="col">Pump house</th><th scope="col">Pressure</th><th scope="col">Read</th></tr></thead>
            <tbody>
                <tr><td>Pump house 1</td><td>3.42 bar</td><td>2 min ago</td></tr>
                <tr><td>Pump house 2</td><td>3.08 bar</td><td>5 min ago</td></tr>
                <tr><td>Pump house 3</td><td>2.95 bar</td><td>1 min ago</td></tr>
                <tr><td>Pump house 4</td><td>3.11 bar</td><td>4 min ago</td></tr>
            </tbody>
        </table>
    </div>
    <div class="kp-datatable__bar">
        <p class="kp-datatable__status" role="status">${spinner()} Reading the pump houses… <span class="kp-datatable__busy-clock" aria-hidden="true">42 s so far</span></p>
    </div>
    <div class="kp-datatable__busy-overlay" aria-hidden="true">
        <div class="kp-datatable__busy-panel">${spinner('')}<span class="kp-datatable__busy-words">Reading the pump houses…</span><span class="kp-datatable__busy-clock">42 s so far</span></div>
    </div>
</div>`;

/** The scene of one option: the same parts in every option. */
const scene = () => `
    <div class="ts-part">
        <p class="ts-cap">Alone: 0.75 rem (a calendar day), 1.25 rem (the default), 2.5 rem (the busy panel)</p>
        <div class="ts-sizes">
            ${spinner('role="status" aria-label="Working…" style="--kp-spinner-size: 0.75rem"')}
            ${spinner('role="status" aria-label="Working…"')}
            ${spinner('role="status" aria-label="Working…" style="--kp-spinner-size: 2.5rem"')}
            <span class="ts-inline">${spinner()} Loading readings…</span>
        </div>
    </div>
    <div class="ts-part">
        <p class="ts-cap">Inside a busy button</p>
        <div class="ts-sizes">
            <button type="button" class="kp-button kp-button--primary" aria-busy="true" disabled>${edge}${spinner()}<span class="kp-button__label">Exporting</span></button>
            <button type="button" class="kp-button" aria-busy="true" disabled>${edge}${spinner()}<span class="kp-button__label">Saving</span></button>
        </div>
    </div>
    <div class="ts-part ts-part--wide">
        <p class="ts-cap">The data table's busy panel and its status line</p>
        ${table()}
    </div>
    <div class="ts-part ts-part--wide">
        <p class="ts-cap">A calendar day that is being read</p>
        ${week()}
    </div>
    <div class="ts-part ts-part--wide">
        <p class="ts-cap">Beside the anodising bath (the key figure's loading picture)</p>
        <div class="ts-with-bath">
            <div class="kp-kpi ts-bath" data-kp-loading aria-busy="true">
                <span class="kp-kpi__label">Readings today</span>
                <span class="kp-kpi__value">&nbsp;</span>
                <span class="kp-kpi__trend">&nbsp;</span>
            </div>
            <div class="kp-card ts-beside">
                ${spinner('role="status" aria-label="Working…" style="--kp-spinner-size: 2.5rem"')}
                <span class="ts-inline">${spinner()} Refreshing</span>
            </div>
        </div>
    </div>`;

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="titanium"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'spinner',
            label: 'The spinner',
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                // The dialog shows only this hint beside the option on screen.
                hint: `${QUESTION} ${o.see} ${o.verdict}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'titanium');
lookLine.textContent =
    'One question, seven options: six new spinners and the drill as it is today. Each is shown where the spinner really appears. The first is the recommendation. Pick the one that is titanium to you, or “None of these” with a note.';
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

/** @type {HTMLElement} */ (document.querySelector('[data-ts-question]')).textContent = QUESTION;
const grid = /** @type {HTMLElement} */ (document.querySelector('[data-ts-options]'));
OPTIONS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'ts-col';
    col.setAttribute('data-ts-option', String(at + 1));
    col.innerHTML = `<p class="ts-label"><span class="ts-label__no">${at + 1}</span> <span class="ts-label__name"></span>${
        at === 0 ? ' <span class="ts-label__rec">Recommended</span>' : ''
    }</p><p class="ts-see"></p><p class="ts-verdict"></p>
    <div class="ts-scene" data-ts-spinner="${o.key}">${scene()}</div>`;
    /** @type {HTMLElement} */ (col.querySelector('.ts-label__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.ts-see')).textContent = o.see;
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.ts-verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('ts-verdict--rec', at === 0);
    grid.append(col);
});

/* ------------------------------------------------------------- the line-up */

const lineup = /** @type {HTMLElement} */ (document.querySelector('[data-ts-lineup]'));
OPTIONS.forEach((o, at) => {
    const fig = document.createElement('figure');
    fig.className = 'ts-lineup__cell';
    fig.setAttribute('data-ts-spinner', o.key);
    fig.innerHTML = `<div class="ts-lineup__row">${spinner('style="--kp-spinner-size: 2.5rem"')}${spinner()}${spinner(
        'style="--kp-spinner-size: 0.75rem"',
    )}</div><div class="ts-lineup__row ts-lineup__row--card">${spinner('style="--kp-spinner-size: 2.5rem"')}${spinner()}${spinner(
        'style="--kp-spinner-size: 0.75rem"',
    )}</div><figcaption><span class="ts-label__no">${at + 1}</span> </figcaption>`;
    /** @type {HTMLElement} */ (fig.querySelector('figcaption')).append(o.name);
    lineup.append(fig);
});

/* ------------------------------------------------- the busy overlay's place */

// The package places the overlay under the header and above the status bar
// through four knobs the data table's script measures; this page has no
// script on the table, so it measures the same two heights itself.
const place = () => {
    for (const t of document.querySelectorAll('.ts-table')) {
        const head = t.querySelector('thead');
        const bar = t.querySelector('.kp-datatable__bar');
        const overlay = /** @type {HTMLElement | null} */ (t.querySelector('.kp-datatable__busy-overlay'));
        if (!overlay || !head || !bar) continue;
        overlay.style.setProperty('--kp-busy-overlay-top', `${/** @type {HTMLElement} */ (head).offsetHeight}px`);
        overlay.style.setProperty('--kp-busy-overlay-bottom', `${/** @type {HTMLElement} */ (bar).offsetHeight}px`);
    }
};
new ResizeObserver(place).observe(document.body);
place();

/* --------------------------------------------------------------- controls */

const buttons = [...document.querySelectorAll('[data-ts-speed]')];
for (const b of buttons)
    b.addEventListener('click', () => {
        for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
        document.documentElement.style.setProperty('--ts-slow', String(1 / Number(b.getAttribute('data-ts-speed'))));
    });

// The buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.ts-scene button') : null;
    if (target) event.preventDefault();
});

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = /** @type {HTMLElement | null} */ (document.querySelector('[data-ts-motion]'));
const syncMotion = () => {
    if (motionNote) motionNote.hidden = !reduced.matches;
};
reduced.addEventListener('change', syncMotion);
syncMotion();
