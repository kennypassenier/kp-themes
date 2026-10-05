// research/character-calendar: the third component of the character round
// (Kenny, form v18, 2026-10-05): the month heatmap, two characters per theme
// drawn in the theme's own world, beside the plain calendar of today, all 22
// themes in one demo judged through the review kit.
//
// The calendars are the package's own: attachCalendars() (js/calendar.js)
// builds the month buttons, the title, the six-week grid, the legend and the
// loading signs, and keeps every behaviour (the keys, picking, the live
// update). Each character is CSS only, in calendars.css, scoped by
// `[data-theme]` and the column's `[data-cl]`; this file only says what each
// one is, gives the calendars their nights, sets the states, and runs the
// speed. js/calendar.js is not changed.

import { attachCalendars, CALENDAR_PICK_EVENT, calendarSelect, dayKey, formatDayKey, setCalendarDays, setCalendarLegend, setCalendarState } from '../../js/calendar.js';
import { THEMES } from '../../js/theme-registry.js';

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: {
        a: {
            name: 'The desk diary',
            text: "A page of a bound desk diary: every day a square of paper in a hairline frame, the number set top left in the serif's old-style figures, the count at the foot in small capitals. A night is marked by its tinted paper and a rule in its ink along the top; a night with nothing done is the full navy-red plate. Today is boxed in the navy double rule; the picked day hangs in a navy frame. The weekdays and the legend are small capitals. Loading leaves the paper blank with a dotted leader across it, still: nothing in formal moves.",
        },
        b: {
            name: 'The ledger',
            text: "The month ruled as a ledger: the days touch, parted by hairlines, the figures in the ledger's monospaced numerals flush right, the count entered under them. A night with nothing done is closed with the bookkeeper's double rule along its foot. Today's figure is boxed in navy; the picked day is ruled in navy inside its cell. Loading shows the ruled cells with one entry line drawn and nothing written, still.",
        },
    },
    light: {
        a: {
            name: 'The seam',
            text: "Light's divider as a calendar: soft plates without a frame, each night's state also told by a seam along its foot in the state's ink, the dashed seam for a day to come. Today's number sits in the divider's open circle; the picked day carries a rounded indigo ring. Loading is a dashed seam on a blank plate, still.",
        },
        b: {
            name: 'Daylight',
            text: 'Every day a white card lifted off a pale sky by a soft shadow, the night washed in its colour from the top as light falls on it. Today wears a ring of sunlight; the picked day an indigo ring. Loading lets a band of daylight cross each card, slowly.',
        },
    },
    dark: {
        a: {
            name: 'The readout',
            text: "An instrument's readout: every day a black cell in a fine frame, the number in the ticker mono, the night's state a lit strip along the cell's top and the figure in that light. Today is held between corner brackets; the picked day in a fine light frame. Loading shows the cells unlit with a dim dashed line, still.",
        },
        b: {
            name: 'The machined pocket',
            text: "Every day a pocket milled into the instrument, its corners cut at forty-five degrees and its lower lip lit; the number is engraved, a dark cut over a lit edge. Today's pocket is ringed in light; the picked one framed. Loading is the empty pocket, still: nothing in dark moves that the reader did not move.",
        },
    },
    cyberpunk: {
        a: {
            name: 'Neon cells',
            text: "Every day a cell of the void outlined in a neon tube in its state's colour, with its glow, the number in the tech mono in the same light. Today sits between yellow HUD brackets; the picked day in a yellow tube. Loading sends a cyan packet running along each cell's foot.",
        },
        b: {
            name: 'The hazard roster',
            text: "A duty roster on a hazard terminal: plates with a cut corner, the number in the condensed display face, a band of hazard stripes along the top of every night that went wrong (amber for some missing, red for none). Today wears a yellow frame and a NOW tag; the picked day a cyan frame. Loading crawls the hazard stripes along every band.",
        },
    },
    synthwave: {
        a: {
            name: 'The grid-floor month',
            text: "The month laid on the grid floor: the perspective grid runs to a pink horizon behind the plates, every day a dark glass plate with a neon edge along its top in its state's colour, the number in VT323. Today is a ring of sunset pink; the picked day a cyan glow. Loading drives a horizon line up through every plate.",
        },
        b: {
            name: 'The VCR timer',
            text: "The VCR's programme screen: black cells with on-screen-display numerals in VT323, a night's state as the colour of the OSD and a block in its corner, a night with nothing done in a red inverse block. Today is boxed in cyan; the picked day in pink. Loading rolls the tracking band down every cell.",
        },
    },
    pastel: {
        a: {
            name: 'The sticker chart',
            text: "A reward chart on the fridge: plump candy plates with a flat sticker shadow, a star sticker on every good night, an outline star on a partial one, a cross on a night with nothing done. Today is ringed in a dashed candy line; the picked day in a solid one. Loading hops a candy dot across every plate.",
        },
        b: {
            name: 'The washi planner',
            text: "A planner page: white paper squares with riso grain, a strip of washi tape across the top of each night in its state's colour (striped for some missing, crossed for none). Today's number is circled in a doodled ring; the picked day framed. Loading drifts a pale tape's stripes across every square.",
        },
    },
    terminal: {
        a: {
            name: 'cal(1)',
            text: "The month as cal(1) prints it: no plates, just a grid of character cells in the mono, the figures flush right, each night told by the colour of its cell; a night with nothing done in reverse video. Today's figure is in reverse video, as cal shows it; the picked day is boxed by the cursor. Loading shows dim dots and a caret blinking once a second (the loop the theme allows).",
        },
        b: {
            name: 'The boot log',
            text: 'Every night a line of the boot log: a cell framed in the box line, its state in a tag in the corner, [ OK ], [WARN] or [FAIL], as systemd prints it. Today is framed in the double line ═; the picked day lit. Loading spins the text spinner | / - \\ in every cell.',
        },
    },
    forest: {
        a: {
            name: "The ranger's wall calendar",
            text: "A ranger's wall calendar on kraft paper with its fibres: the number in italic, a leaf pinned to every night (a green leaf when all was saved, an autumn leaf when some was missing), a night with nothing done on clay. Today is circled in pencil; the picked day framed in clay. Loading lets a leaf drift down through every square.",
        },
        b: {
            name: 'The trail map',
            text: "Every day a patch of survey map, contour lines ringing the paper, the night's state painted as a trail blaze along its edge (a double blaze for a night with nothing done). Today carries a map pin; the picked day a dashed trail around it. Loading walks the trail dashes along every patch.",
        },
    },
    'high-contrast': {
        a: {
            name: 'The ink grid',
            text: 'Every day framed in 2px ink, each state told three ways: its colour, its frame (solid when all was saved, dashed when some was missing, double when none was, dotted when there was nothing to do) and its sign in the corner (✓ ! ✕ –, ? when nothing is known). Today is ringed in heavy ink; the picked day in a 4px blue frame. Loading shows three ink squares, still: nothing loops, ever.',
        },
        b: {
            name: 'The inverse plate',
            text: "Every day an ink plate with white figures, its state told by pattern alone in a band at its foot (solid, hatched, cross-hatched on red, dotted), so it reads in greyscale and in forced colours alike. Today is ringed in the signal yellow; the picked day framed in blue. Loading shows a dashed white line, still.",
        },
    },
    sepia: {
        a: {
            name: 'The almanac page',
            text: "A page of an old almanac: every day a square of paper in a hairline, the figure in the serif italic, each night marked as an almanac marks the moon (● all saved, ◐ some missing, ○ none, on red). Today's figure is ringed in hand-drawn ink; the picked day in a double ink rule. Loading writes a pen stroke across every square and lets it fade.",
        },
        b: {
            name: 'The letterpress specimen',
            text: 'Every day pressed into the paper (a blind impression), the figure inked in letter-spaced small capitals, each night printed in its colour with the speckle of ink that did not take. Today carries a fleuron ❧ and an inked frame; the picked day a heavier impression. Loading presses the platen: the impression deepens and lifts.',
        },
    },
    blueprint: {
        a: {
            name: 'The drafting schedule',
            text: "A schedule drawn on the sheet: every day a box in white ink, the figure in the drafting mono, each night's state as section hatching (plain, hatched for some missing, solid for none). Today is marked by amber dimension ticks at its corners; the picked day by an amber chain line. Loading runs a plotter's dash across every box.",
        },
        b: {
            name: 'The title block',
            text: "Every day a small title block: the figure in its own boxed field at the top left, the count in a strip along the foot, a revision triangle △ on a night with some missing, ▲ on one with none. Today is framed in the double border; the picked day in a heavy line. Loading marches a dash around every block's frame.",
        },
    },
    solstice: {
        a: {
            name: 'The low sun',
            text: 'Every day a warm charcoal plate, its night glowing up from its foot in its colour as a low sun lights the ground, the figure in the serif. Today is ringed like the sun at the horizon; the picked day in an ember line. Loading lets a dawn rise in every plate and fade, unhurried.',
        },
        b: {
            name: 'The embers',
            text: 'Every day a coal: a good night glows along its edges, a night with some missing smoulders with ember specks, a night with nothing done is the red coal. Today wears a hot iron rim; the picked day an iron ring. Loading lets the embers breathe in every coal. Firelight, not neon.',
        },
    },
    brutalism: {
        a: {
            name: 'The slab',
            text: 'Every day a slab in the 3px black line with the hard shadow, solid candy fills, the figure in the heavy display face. The picked day is pressed in, its shadow gone, and framed; today carries a strip of yellow-and-black tape across its top. Loading runs the tape through every slab.',
        },
        b: {
            name: 'The sticker sheet',
            text: 'Every day a sticker slapped on a lavender sheet, each a degree or two askew, black outline, its fill in its state. Today carries a starburst behind its figure; the picked day a fat black ring. Loading drops a block into every sticker, one after another.',
        },
    },
    deco: {
        a: {
            name: 'The gilt calendar',
            text: "Every day a lacquer panel between double gold hairlines with stepped corners, the figure in the thin deco capitals. Today shows a gold sunburst fanning behind its figure and a gold ring; the picked day a double gold frame. Loading runs a glint along every panel's gilt.",
        },
        b: {
            name: 'The marquee',
            text: "Every day a theatre marquee panel with a row of bulbs along its top: all lit for a good night, half lit for some missing, dark over a red panel for none. Today's panel is framed in gold; the picked one in a double rule. Loading chases the bulbs.",
        },
    },
    phantom: {
        a: {
            name: 'The stamped VOID nights',
            text: 'Every day a white index card on the black ledger; a night with nothing done is stamped VOID in red, slanted, a night with some missing stamped PART, a good night carries a red tick. Today wears a red frame; the picked day a white one. Loading slides the halftone screen across every card.',
        },
        b: {
            name: 'The calling card month',
            text: "Black cards under a halftone screen, every figure a white scrap of cut paper set at its own slant, a night with nothing done on a red card. Today is struck with a red slash in its corner; the picked day framed in white. Loading shuffles the halftone in hard steps.",
        },
    },
    'shade-light': {
        a: {
            name: 'Pencil in the shade',
            text: 'Every day a square of paper lifted off the page by its soft shade, the figure in the serif italic, each night shaded in pencil hatching in its colour along its foot. Today is circled in pencil; the picked day lifted further, framed. Loading hatches every square in once and leaves it, as every reveal here runs once.',
        },
        b: {
            name: 'The leaf shade',
            text: "The month laid out under a tree: soft dappled shade of leaves over the whole sheet, the days crisp in it, each night's colour clear. Today carries a ring of sun through the leaves; the picked day a framed shade. Loading lets the shade of a passing cloud cross the sheet.",
        },
    },
    'shade-dark': {
        a: {
            name: 'Silverpoint',
            text: 'The dark half of the pencil: every day framed in a silver hairline, each night shaded in silver hatching along its foot over its colour. Today is ringed in silver; the picked day in the blue. Loading hatches every square in once.',
        },
        b: {
            name: 'The reading lamp',
            text: 'A pool of lamplight on the dark page, falling off into shade at its edges, the days lit where the lamp is. Today glows under the lamp in a warm ring; the picked day in the blue. Loading slides the pool of light slowly across the sheet.',
        },
    },
    retro: {
        a: {
            name: 'The tear-off pad',
            text: "Every day a leaf of a perforated tear-off pad: a row of perforation holes along its top, the figure in the pixel face, a good night on green paper, a partial one on yellow, a night with nothing done on red. Today is ringed in the marker; the picked day in the dotted focus line of 1995. Still: nothing blinks.",
        },
        b: {
            name: 'The 1995 date picker',
            text: "The date picker of 1995: the month sunk into a white well in a two-pixel bevel, every day a raised bevelled button that sinks when picked, a night's state as the button's colour. Today is ringed in red, as the picker did; the picked day sinks, in the navy frame. Loading fills the buttons with the 50 % dither, still.",
        },
    },
    grotesk: {
        a: {
            name: 'The Swiss grid',
            text: 'The month set on the Swiss grid: every day under a heavy black rule, the figure in bold grotesque flush left at the top, the count flush left at the foot, the nights in flat solid colour. Today is boxed in black; the picked day in red. Loading cuts in three black squares, one after another, in hard steps.',
        },
        b: {
            name: 'The transit bullets',
            text: "Every day a round bullet, as on a transit map, filled in its state's colour with the figure in it, the days still to come drawn as open rings. Today is ringed in black; the picked day in red. Loading hops the zebra along every bullet.",
        },
    },
    lapis: {
        a: {
            name: 'Lapis on vellum',
            text: 'The month on a leaf of ivory vellum ruled in gold inside the lapis page, each day a panel inked in its state, the figure in the Markazi serif. Today is ringed in a gold toranj, the pointed cartouche; the picked day in a gold frame. Loading lets a burnisher\'s glint run across every panel.',
        },
        b: {
            name: 'The girih tiles',
            text: 'Every day a lapis tile tooled with a faint gold girih lattice in a double gold frame. Today wears a gold eight-pointed star behind its figure; the picked day a gold ring. Loading runs a glint along every frame.',
        },
    },
    nostromo: {
        a: {
            name: 'The CRT duty roster',
            text: 'The month on a dark CRT set into the beige case: scanlines and a vignette over the glass, every day a phosphor cell, a good night in full cream, a partial one in amber, a night with nothing done as an inverse amber block. Today sits over a block cursor; the picked day in a cream frame. Loading warms the screen while the cursor blinks.',
        },
        b: {
            name: 'The indicator panel',
            text: "Every day a beige key on the ship's panel with an indicator lamp in its corner (green, amber, red, or dark), the figure in the panel mono and the count on a strip of embossed label tape. Today's key has its lamp ringed; the picked key is pressed in. Loading scans the lamps along the panel, one key after another.",
        },
    },
    titanium: {
        a: {
            name: 'The anodised tiles',
            text: "Every day a tile of brushed titanium, its night anodised into it in its colour, the figure engraved in the instrument mono. Today is ringed in the blue heat tint; the picked tile has a polished edge. Loading runs the cutter across every tile at an even, linear pace: metal does not ease.",
        },
        b: {
            name: 'The date wheel',
            text: "Every day a watch's date window: the figure on its wheel behind a recessed aperture, the night's state the colour of the aperture's anodised ring, a knurled edge along the top. Today's window is ringed in blue oxide; the picked one framed. Loading rolls the knurl, linearly.",
        },
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="calendar"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, two]) => [theme, `${two[which].name}. ${two[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'calendar',
            label: 'The month heatmap for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain calendar, as today',
                    hint: 'Keep the package calendar in this theme: the same shape as everywhere, in the theme’s colours.',
                },
            ],
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lower = (/** @type {string} */ name) => name.replace(/^(The|A) /, (m) => m.toLowerCase());
for (const [theme, two] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Character 1 is ${lower(two.a.name)}, character 2 ${lower(two.b.name)}; the third column is the plain calendar of today. ` +
        'Look at the plates, the figures and counts, the tones, today (20/10) and the picked day (16/10) in each column, then press Loading in each of its three looks, Nothing to check and Could not read, and the three months: the grid keeps its height. ' +
        'Press the live update: today reads for a moment, then turns green, and nothing else moves.';
    look.append(p);
}

/* ---------------------------------------------------------- the nights */

// Nine services' nightly backups, made up and the same on every load, with
// "now" fixed at 20/10/2026 14:40 in Brussels, so the month reads the same on
// every day it is opened. October carries every tone a reader meets: green,
// amber, the red night of the power cut (08/10), a night with nothing to back
// up (11/10), a night whose report was lost (14/10), today still missing two
// late copies, and the nights to come; August starts before the first backup.
const NOW = Date.parse('2026-10-20T12:40:00Z');
const TODAY = dayKey(NOW);
const OLDEST = '2026-08-10';
const SERVICES = ['Readings database', 'Field gateway', 'Reports', 'Maps', 'Alarm relay', 'Work orders', 'Invoices', 'Telemetry archive', 'Mail relay'];
/** The picked night per month: shown by the month buttons. */
const PICK = /** @type {Record<string, string>} */ ({ '2026-08': '2026-08-12', '2026-09': '2026-09-22', '2026-10': '2026-10-16' });

/** Was `service` backed up the night of `iso`? @param {string} iso @param {number} service @param {boolean} late */
const backedUp = (iso, service, late) => {
    if (iso === '2026-10-08') return false; // the night of the power cut
    if (iso === TODAY && !late && service >= 7) return false; // two copies still running
    if (iso === '2026-10-13' && service === 8) return false;
    if (iso === '2026-10-16' && service === 3) return false;
    if (['2026-10-06', '2026-10-12', '2026-10-15'].includes(iso)) return true;
    const h = Math.sin(Number(iso.replaceAll('-', '')) * 0.731 + service * 12.17) * 9999;
    return h - Math.floor(h) > 0.04;
};

/** @param {boolean} late @returns {Record<string, import('../../js/calendar.js').CalendarDay>} */
const history = (late) => {
    /** @type {Record<string, import('../../js/calendar.js').CalendarDay>} */
    const days = {};
    for (let t = Date.parse('2026-07-20T12:00:00Z'); dayKey(t) <= TODAY; t += 86_400_000) {
        const iso = dayKey(t);
        if (iso < OLDEST) {
            days[iso] = { tone: 'before', label: 'before the first backup was kept' };
            continue;
        }
        if (iso === '2026-10-11') {
            days[iso] = { tone: 'muted', label: 'nothing to back up: the maintenance window' };
            continue;
        }
        if (iso === '2026-10-14') {
            days[iso] = { tone: 'none', label: "nothing known: the night's report was lost" };
            continue;
        }
        const missing = SERVICES.filter((_, i) => !backedUp(iso, i, late));
        const done = SERVICES.length - missing.length;
        days[iso] = {
            tone: done === SERVICES.length ? 'ok' : done === 0 ? 'bad' : 'warn',
            count: `${done}/${SERVICES.length}`,
            label: `${done} of ${SERVICES.length} services backed up${missing.length && done ? `; missing: ${missing.join(', ')}` : ''}`,
        };
    }
    return days;
};

/** @type {{ tone: import('../../js/calendar.js').CalendarTone, label: string }[]} */
const LEGEND = [
    { tone: 'ok', label: 'Every service backed up' },
    { tone: 'warn', label: 'Some missing' },
    { tone: 'bad', label: 'None backed up' },
    { tone: 'muted', label: 'Nothing to back up' },
    { tone: 'none', label: 'Nothing known' },
    { tone: 'future', label: 'Still to come' },
    { tone: 'before', label: 'Before the first backup' },
];

const calendars = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-kp-calendar]')]);

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    busy: /** @type {'pulse' | 'days' | 'whole'} */ ('pulse'),
    late: false,
    turn: 0,
};

function draw() {
    const n = SERVICES.length;
    for (const el of calendars()) {
        if (state.shown === 'loading') setCalendarState(el, 'loading', `Reading the backups of ${n} services: 4 of ${n} read.`);
        else if (state.shown === 'empty') setCalendarState(el, 'empty', 'No service keeps data, so there is nothing to check.');
        else if (state.shown === 'error') setCalendarState(el, 'error', `None of the ${n} services could be read: the backup store did not answer.`);
        else {
            setCalendarState(el, 'ready');
            setCalendarDays(el, history(state.late));
        }
    }
}

function showBusy() {
    for (const el of calendars()) {
        el.classList.toggle('kp-calendar--busy-days', state.busy === 'days');
        el.classList.toggle('kp-calendar--busy-whole', state.busy === 'whole');
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of section.querySelectorAll('[data-cl-state]'))
    b.addEventListener('click', () => {
        state.turn += 1;
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cl-state') ?? 'ready');
        pressed('data-cl-state', state.shown);
        draw();
    });

// A live update, in two calls of setCalendarDays() as an app would make
// them: today's plate first says its two late copies are being read
// (loading, in the picked look), then they arrive and today reads 9/9. The
// grid repaints in place; the focus and the pick stay.
section.querySelector('[data-cl-live]')?.addEventListener('click', () => {
    state.turn += 1;
    const turn = state.turn;
    state.shown = 'ready';
    pressed('data-cl-state', 'ready');
    const reading = { ...history(state.late), [TODAY]: { tone: /** @type {const} */ ('loading'), label: 'the two late copies are being read' } };
    for (const el of calendars()) {
        setCalendarState(el, 'ready');
        setCalendarDays(el, reading);
    }
    setTimeout(() => {
        if (state.turn !== turn) return;
        state.late = true;
        for (const el of calendars()) setCalendarDays(el, history(true));
    }, 1500);
});

for (const b of section.querySelectorAll('[data-cl-busy]'))
    b.addEventListener('click', () => {
        state.busy = /** @type {typeof state.busy} */ (b.getAttribute('data-cl-busy') ?? 'pulse');
        pressed('data-cl-busy', state.busy);
        showBusy();
    });

for (const b of section.querySelectorAll('[data-cl-month]'))
    b.addEventListener('click', () => {
        const month = b.getAttribute('data-cl-month') ?? '2026-10';
        pressed('data-cl-month', month);
        for (const el of calendars()) calendarSelect(el, PICK[month] ?? null);
    });

// The month buttons of each calendar move that calendar alone; the bar's
// month then names none.
section.addEventListener('kp-calendar-month', () => pressed('data-cl-month', ''));

const log = section.querySelector('[data-cl-log]');
section.addEventListener(CALENDAR_PICK_EVENT, (event) => {
    const { date, source } = /** @type {CustomEvent<{ date: string, source: string }>} */ (event).detail;
    if (log) log.textContent = `kp-calendar-pick: ${formatDayKey(date)}, by ${source}.`;
});

attachCalendars(section, { now: () => NOW });
for (const el of calendars()) setCalendarLegend(el, LEGEND);
draw();
showBusy();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-cl-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== theme;
    const two = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-cl-name="${which}"]`);
        const desc = document.querySelector(`[data-cl-desc="${which}"]`);
        if (name) name.textContent = two ? two[which].name : '';
        if (desc) desc.textContent = two ? two[which].text : '';
    }
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-cl-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
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
