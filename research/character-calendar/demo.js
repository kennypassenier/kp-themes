// research/character-calendar: the month heatmap of the character round
// (Kenny, form v18, 2026-10-05), all 22 themes in one demo judged through the
// review kit. Round two (Kenny, 2026-10-05 20:03: "I want separate options
// for the heatmap as well, just like you did for the meters … and it should
// be like this in the future"): nothing is bundled any more. Each theme's
// calendar has five aspects, each picked on its own from three options: the
// shape, the loading picture, how the month arrives, how the tones and today
// read, and the picked day with the hover and its count.
//
// The calendars are the package's own: attachCalendars() (js/calendar.js)
// builds the month buttons, the title, the six-week grid, the legend and the
// loading signs, and keeps every behaviour (the keys, picking, the live
// update). Every aspect is CSS only, in calendars.css, keyed by one attribute
// each on the calendar's wrapper (`data-cl-shape`, `data-cl-loading`,
// `data-cl-arrival`, `data-cl-tone`, `data-cl-select`), so any combination
// composes. On the page: one composed preview showing the current picks, per
// aspect a row of three calendars that differ in that aspect only, and the
// plain calendar of today as a reference (not an option). The controls sit
// in the section's `data-review-controls` container, which the review kit
// mirrors into its dialog. js/calendar.js is not changed.

import {
    attachCalendars,
    CALENDAR_PICK_EVENT,
    calendarSelect,
    dayKey,
    formatDayKey,
    setCalendarDays,
    setCalendarLegend,
    setCalendarState,
} from '../../js/calendar.js';
import { THEMES } from '../../js/theme-registry.js';
import R2A from './round2-a.js';
import R2B from './round2-b.js';

/** @typedef {{ name: string, text: string, key?: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'select'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The grid, the day cells, the weekday header and the month buttons. Compare them as they stand, then press a month.',
    },
    {
        id: 'loading',
        label: 'While loading',
        about: 'The picture every day shows while the month is read; it always moves (and stands still under reduced motion). Press Loading.',
    },
    {
        id: 'arrival',
        label: 'How the month arrives',
        about: 'How the days come in after loading and when the month changes. Press Read to replay it, or a month.',
    },
    {
        id: 'tone',
        label: 'Tones and today',
        about: 'How a good, a warning, a failed, an unknown and a busy night read, and the ring on today (20/10). Press the live update for a busy day.',
    },
    {
        id: 'select',
        label: 'The picked day',
        about: 'The frame round the picked day (16/10), how a day answers the pointer, and how the picked day shows its count. Hover a day; click another.',
    },
];

/**
 * Per theme, three options for each aspect. Options 1 and 2 are round one's
 * two characters split into their parts (the picked day's hover and count
 * are new in both, since their frames barely differed); option 3 and every
 * arrival are new.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The desk diary',
                text: "A page of a bound desk diary: every day a square of paper in a hairline frame, the number set top left in the serif's old-style figures, the count at the foot in small capitals. The weekdays and the legend are small capitals.",
            },
            {
                name: 'The ledger',
                text: "The month ruled as a ledger: the days touch, parted by hairlines, the figures in the ledger's monospaced numerals flush right, the count entered under them.",
            },
            {
                name: 'The engraved card',
                text: 'Days set as engraved calling cards: a thin rule inset a hair from the edge, the figure centred in the display serif, the count beneath in small capitals; the weekdays in spaced small capitals between two rules.',
            },
        ],
        loading: [
            {
                name: 'The desk diary: its loading',
                text: 'Loading leaves the paper blank with a dotted leader across it. Now it moves: the dotted leader is written dot by dot, again and again.',
            },
            {
                name: 'The ledger: its loading',
                text: 'Loading shows the ruled cells with one entry line drawn and nothing written. Now it moves: the entry line is drawn from the left, again and again.',
            },
            {
                name: 'The fountain pen',
                text: 'A nib writes a line across each day, lifts at its end and starts again.',
            },
        ],
        arrival: [
            {
                name: 'Set in type',
                text: 'The days are set line by line, each revealed left to right as type on a press.',
            },
            {
                name: 'The page turns',
                text: 'Each week turns down into place like the leaf of a diary.',
            },
            {
                name: 'Ruled in',
                text: 'A ruled line draws each week across the page, top to bottom.',
            },
        ],
        tone: [
            {
                name: 'The desk diary: its tones and today',
                text: 'A night is marked by its tinted paper and a rule in its ink along the top; a night with nothing done is the full navy-red plate. Today is boxed in the navy double rule; the picked day hangs in a navy frame.',
            },
            {
                name: 'The ledger: its tones and today',
                text: "A night with nothing done is closed with the bookkeeper's double rule along its foot. Today's figure is boxed in navy; the picked day is ruled in navy inside its cell.",
            },
            {
                name: 'The margin rule',
                text: "Every day on plain paper with the night's colour as a rule down its margin; a warning night adds a raised dagger, a night with nothing done a double dagger; today in a navy box rule.",
            },
        ],
        select: [
            {
                name: 'The desk diary: its pick',
                text: 'Today is boxed in the navy double rule; the picked day hangs in a navy frame. New: the figure underlined on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The ledger: its pick',
                text: "Today's figure is boxed in navy; the picked day is ruled in navy inside its cell. New: a dashed ring on hover, the picked count boxed.",
            },
            {
                name: 'The bookplate',
                text: 'The picked day framed in a navy double rule; on hover a day lifts a hair; its count set on a navy label.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'The seam',
                text: "Light's divider as a calendar: soft plates without a frame, each night's state also told by a seam along its foot in the state's ink, the dashed seam for a day to come.",
            },
            {
                name: 'Daylight',
                text: 'Every day a white card lifted off a pale sky by a soft shadow, the night washed in its colour from the top as light falls on it.',
            },
            {
                name: 'The pill row',
                text: 'Every day a soft pill, fully rounded, the figure and count side by side in the body face; the weekdays as quiet lowercase labels.',
            },
        ],
        loading: [
            {
                name: 'The seam: its loading',
                text: 'Loading is a dashed seam on a blank plate. Now it moves: the dashed seam walks along the foot.',
            },
            {
                name: 'Daylight: its loading',
                text: 'Loading lets a band of daylight cross each card, slowly. Now it moves: the band of daylight crosses each card.',
            },
            {
                name: 'The sunbeam',
                text: 'A thin beam of light sweeps across each pill from left to right.',
            },
        ],
        arrival: [
            {
                name: 'Morning',
                text: 'The days open from their centre, as light reaching a room, from the top left corner outwards.',
            },
            {
                name: 'Slide up',
                text: 'Each pill slides up a few pixels into its row, week by week.',
            },
            {
                name: 'The wave',
                text: 'A gentle scale wave crosses the month diagonally.',
            },
        ],
        tone: [
            {
                name: 'The seam: its tones and today',
                text: "Light's divider as a calendar: soft plates without a frame, each night's state also told by a seam along its foot in the state's ink, the dashed seam for a day to come. Today's number sits in the divider's open circle; the picked day carries a rounded indigo ring.",
            },
            {
                name: 'Daylight: its tones and today',
                text: 'Every day a white card lifted off a pale sky by a soft shadow, the night washed in its colour from the top as light falls on it. Today wears a ring of sunlight; the picked day an indigo ring.',
            },
            {
                name: 'The coloured dot',
                text: 'White pills with a coloured dot in the top corner for the night; today ringed in the primary colour.',
            },
        ],
        select: [
            {
                name: 'The seam: its pick',
                text: "Today's number sits in the divider's open circle; the picked day carries a rounded indigo ring. New: the day lifts on hover, the picked count in heavy type.",
            },
            {
                name: 'Daylight: its pick',
                text: 'Today wears a ring of sunlight; the picked day an indigo ring. New: a ring of light on hover, the picked count on an inverted label.',
            },
            {
                name: 'The focus halo',
                text: 'A soft halo in the ring colour round the picked pill; a dashed ring on hover; the count boxed.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The readout',
                text: "An instrument's readout: every day a black cell in a fine frame, the number in the ticker mono, the night's state a lit strip along the cell's top and the figure in that light.",
            },
            {
                name: 'The machined pocket',
                text: 'Every day a pocket milled into the instrument, its corners cut at forty-five degrees and its lower lip lit; the number is engraved, a dark cut over a lit edge.',
            },
            {
                name: 'The keycap',
                text: 'Low keycaps on a dark deck: a lighter top face, a darker lip below, the figure top left in the mono face like a legend printed on a key.',
            },
        ],
        loading: [
            {
                name: 'The readout: its loading',
                text: 'Loading shows the cells unlit with a dim dashed line. Now it moves: the dashed line is drawn in steps.',
            },
            {
                name: 'The machined pocket: its loading',
                text: 'Loading is the empty pocket. Now it moves: the three index marks step along.',
            },
            {
                name: 'The status LED',
                text: 'A small LED in each key steps from left to right, one position per beat.',
            },
        ],
        arrival: [
            {
                name: 'Boot sequence',
                text: 'The keys light in reading order, one every few milliseconds, as a panel powers up.',
            },
            {
                name: 'Shutter',
                text: 'Each column opens from the top like a shutter.',
            },
            {
                name: 'Pressed in',
                text: 'Each key drops in from slightly above, row by row.',
            },
        ],
        tone: [
            {
                name: 'The readout: its tones and today',
                text: "An instrument's readout: every day a black cell in a fine frame, the number in the ticker mono, the night's state a lit strip along the cell's top and the figure in that light. Today is held between corner brackets; the picked day in a fine light frame.",
            },
            {
                name: 'The machined pocket: its tones and today',
                text: "Today's pocket is ringed in light; the picked one framed.",
            },
            {
                name: 'The status bar',
                text: "Dark keys with a lit status bar along the foot in the night's colour; a warning blinks nothing, it carries a !; today ringed in white.",
            },
        ],
        select: [
            {
                name: 'The readout: its pick',
                text: 'Today is held between corner brackets; the picked day in a fine light frame. New: a ring of light on hover, the picked count boxed.',
            },
            {
                name: 'The machined pocket: its pick',
                text: "Today's pocket is ringed in light; the picked one framed. New: the day pressed in on hover, the picked count on an inverted label.",
            },
            {
                name: 'The marquee select',
                text: 'A dashed selection frame round the picked key; a dashed ring on hover; the count in brackets.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'Neon cells',
                text: "Every day a cell of the void outlined in a neon tube in its state's colour, with its glow, the number in the tech mono in the same light.",
            },
            {
                name: 'The hazard roster',
                text: 'A duty roster on a hazard terminal: plates with a cut corner, the number in the condensed display face, a band of hazard stripes along the top of every night that went wrong (amber for some missing, red for none).',
            },
            {
                name: 'The data shard',
                text: 'Each day a slanted shard: the plate skewed a few degrees, the figure in the display face, a magenta slit along the foot; the weekdays in tight caps.',
            },
        ],
        loading: [
            {
                name: 'Neon cells: its loading',
                text: "Loading sends a cyan packet running along each cell's foot.",
            },
            {
                name: 'The hazard roster: its loading',
                text: 'Loading crawls the hazard stripes along every band.',
            },
            {
                name: 'The glitch slice',
                text: 'A slice of the shard jumps sideways in hard steps, as a bad signal.',
            },
        ],
        arrival: [
            {
                name: 'Glitch in',
                text: 'Each shard jitters sideways in hard steps and locks in place.',
            },
            {
                name: 'Data rain',
                text: 'The columns fall in from above, each at its own moment.',
            },
            {
                name: 'Skew lock',
                text: 'Each shard swings from a steep skew into its slant.',
            },
        ],
        tone: [
            {
                name: 'Neon cells: its tones and today',
                text: 'Today sits between yellow HUD brackets; the picked day in a yellow tube.',
            },
            {
                name: 'The hazard roster: its tones and today',
                text: 'A duty roster on a hazard terminal: plates with a cut corner, the number in the condensed display face, a band of hazard stripes along the top of every night that went wrong (amber for some missing, red for none). Today wears a yellow frame and a NOW tag; the picked day a cyan frame.',
            },
            {
                name: 'The corner tag',
                text: 'A coloured corner tag cut into each plate, ! and ✕ on the bad nights; today in a yellow frame.',
            },
        ],
        select: [
            {
                name: 'Neon cells: its pick',
                text: 'Today sits between yellow HUD brackets; the picked day in a yellow tube. New: a ring of light on hover, the picked count in brackets.',
            },
            {
                name: 'The hazard roster: its pick',
                text: 'Today wears a yellow frame and a NOW tag; the picked day a cyan frame. New: the day nudged aside on hover, the picked count on an inverted label.',
            },
            {
                name: 'The target lock',
                text: 'A thick accent frame locks the picked shard; on hover it is pressed in; its count boxed.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The grid-floor month',
                text: "The month laid on the grid floor: the perspective grid runs to a pink horizon behind the plates, every day a dark glass plate with a neon edge along its top in its state's colour, the number in VT323.",
            },
            {
                name: 'The VCR timer',
                text: "The VCR's programme screen: black cells with on-screen-display numerals in VT323, a night's state as the colour of the OSD and a block in its corner, a night with nothing done in a red inverse block.",
            },
            {
                name: 'The arcade marquee',
                text: 'Rounded arcade buttons with a chrome rim and a pink glow under them, the figure big in the display face; the weekdays in the neon caps of a cabinet.',
            },
        ],
        loading: [
            {
                name: 'The grid-floor month: its loading',
                text: 'Loading drives a horizon line up through every plate.',
            },
            {
                name: 'The VCR timer: its loading',
                text: 'Loading rolls the tracking band down every cell.',
            },
            {
                name: 'The scanning beam',
                text: 'A pink beam rolls down each button and starts at the top again.',
            },
        ],
        arrival: [
            {
                name: 'Out of the horizon',
                text: 'The weeks rise out of the floor, the last row first.',
            },
            {
                name: 'Tracking',
                text: 'Each row rolls in from below as a VHS tape tracking in.',
            },
            {
                name: 'Neon flicker on',
                text: 'Each button jumps between half and full size in hard steps, like a tube striking.',
            },
        ],
        tone: [
            {
                name: 'The grid-floor month: its tones and today',
                text: 'Today is a ring of sunset pink; the picked day a cyan glow.',
            },
            {
                name: 'The VCR timer: its tones and today',
                text: "The VCR's programme screen: black cells with on-screen-display numerals in VT323, a night's state as the colour of the OSD and a block in its corner, a night with nothing done in a red inverse block. Today is boxed in cyan; the picked day in pink.",
            },
            {
                name: 'The neon underline',
                text: "A neon line under each plate in the night's colour; today framed in pink.",
            },
        ],
        select: [
            {
                name: 'The grid-floor month: its pick',
                text: 'Today is a ring of sunset pink; the picked day a cyan glow. New: a ring of light on hover, the picked count on an inverted label.',
            },
            {
                name: 'The VCR timer: its pick',
                text: 'Today is boxed in cyan; the picked day in pink. New: the day lifts on hover, the picked count in brackets.',
            },
            {
                name: 'The player select',
                text: 'The picked button framed in the accent tube; pressed on hover; the count in heavy type.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The sticker chart',
                text: 'A reward chart on the fridge: plump candy plates with a flat sticker shadow, a star sticker on every good night, an outline star on a partial one, a cross on a night with nothing done.',
            },
            {
                name: 'The washi planner',
                text: "A planner page: white paper squares with riso grain, a strip of washi tape across the top of each night in its state's colour (striped for some missing, crossed for none).",
            },
            {
                name: 'The macaron tray',
                text: 'Round macarons in a tray: every day a circle, the figure set in the middle, the count tucked under; the weekdays in rounded lowercase.',
            },
        ],
        loading: [
            {
                name: 'The sticker chart: its loading',
                text: 'Loading hops a candy dot across every plate.',
            },
            {
                name: 'The washi planner: its loading',
                text: "Loading drifts a pale tape's stripes across every square.",
            },
            {
                name: 'The bouncing jelly',
                text: 'A round candy in each day squashes and springs.',
            },
        ],
        arrival: [
            {
                name: 'Pop',
                text: 'Each day pops from nothing with a springy overshoot.',
            },
            {
                name: 'Sticker peel',
                text: 'Each day is pressed on with a little rotation, like a sticker.',
            },
            {
                name: 'Bubbles',
                text: 'The days bubble up from the bottom right.',
            },
        ],
        tone: [
            {
                name: 'The sticker chart: its tones and today',
                text: 'A reward chart on the fridge: plump candy plates with a flat sticker shadow, a star sticker on every good night, an outline star on a partial one, a cross on a night with nothing done. Today is ringed in a dashed candy line; the picked day in a solid one.',
            },
            {
                name: 'The washi planner: its tones and today',
                text: "A planner page: white paper squares with riso grain, a strip of washi tape across the top of each night in its state's colour (striped for some missing, crossed for none). Today's number is circled in a doodled ring; the picked day framed.",
            },
            {
                name: 'The sprinkles',
                text: 'A scatter of coloured sprinkles over each day; ☆ for a warning night and ✕ for none; today in a dashed candy ring.',
            },
        ],
        select: [
            {
                name: 'The sticker chart: its pick',
                text: 'Today is ringed in a dashed candy line; the picked day in a solid one. New: the day lifts on hover, the picked count on an inverted label.',
            },
            {
                name: 'The washi planner: its pick',
                text: "Today's number is circled in a doodled ring; the picked day framed. New: the day pressed in on hover, the picked count in heavy type.",
            },
            {
                name: 'The candy wrapper',
                text: 'A dashed candy ring round the picked day; it glows on hover; the count in brackets.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'cal(1)',
                text: 'The month as cal(1) prints it: no plates, just a grid of character cells in the mono, the figures flush right, each night told by the colour of its cell; a night with nothing done in reverse video.',
            },
            {
                name: 'The boot log',
                text: 'Every night a line of the boot log: a cell framed in the box line, its state in a tag in the corner, [ OK ], [WARN] or [FAIL], as systemd prints it.',
            },
            {
                name: 'The hex dump',
                text: 'The month as a hex dump: square cells, no gaps, every figure padded in the mono face, the count after it; the weekdays as column offsets.',
            },
        ],
        loading: [
            {
                name: 'cal(1): its loading',
                text: 'Loading shows dim dots and a caret blinking once a second (the loop the theme allows).',
            },
            {
                name: 'The boot log: its loading',
                text: 'Loading spins the text spinner | / - \\ in every cell.',
            },
            {
                name: 'The progress hashes',
                text: 'Hashes fill the cell one by one, as a ##### progress line.',
            },
        ],
        arrival: [
            {
                name: 'Typed',
                text: 'Every cell is typed in reading order, one character at a time.',
            },
            {
                name: 'Scroll',
                text: 'The weeks scroll in from below, line by line.',
            },
            {
                name: 'Redraw',
                text: 'curses redraws the screen column by column.',
            },
        ],
        tone: [
            {
                name: 'cal(1): its tones and today',
                text: "The month as cal(1) prints it: no plates, just a grid of character cells in the mono, the figures flush right, each night told by the colour of its cell; a night with nothing done in reverse video. Today's figure is in reverse video, as cal shows it; the picked day is boxed by the cursor.",
            },
            {
                name: 'The boot log: its tones and today',
                text: 'Every night a line of the boot log: a cell framed in the box line, its state in a tag in the corner, [ OK ], [WARN] or [FAIL], as systemd prints it. Today is framed in the double line ═; the picked day lit.',
            },
            {
                name: 'The flags',
                text: 'Every cell in the terminal ink with a flag letter: W for warning, E for error, - for unknown; today framed.',
            },
        ],
        select: [
            {
                name: 'cal(1): its pick',
                text: "Today's figure is in reverse video, as cal shows it; the picked day is boxed by the cursor. New: a dashed ring on hover, the picked count in brackets.",
            },
            {
                name: 'The boot log: its pick',
                text: 'Today is framed in the double line ═; the picked day lit. New: the figure underlined on hover, the picked count on an inverted label.',
            },
            {
                name: 'The visual mode',
                text: 'Dotted selection as vim draws it; the cell pressed on hover; the count in capitals.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: "The ranger's wall calendar",
                text: "A ranger's wall calendar on kraft paper with its fibres: the number in italic, a leaf pinned to every night (a green leaf when all was saved, an autumn leaf when some was missing), a night with nothing done on clay.",
            },
            {
                name: 'The trail map',
                text: "Every day a patch of survey map, contour lines ringing the paper, the night's state painted as a trail blaze along its edge (a double blaze for a night with nothing done).",
            },
            {
                name: 'The tree rings',
                text: 'Every day a cross-cut log: a round plate with a ring of bark at its rim, the figure in the serif at its heart.',
            },
        ],
        loading: [
            {
                name: "The ranger's wall calendar: its loading",
                text: 'Loading lets a leaf drift down through every square.',
            },
            {
                name: 'The trail map: its loading',
                text: 'Loading walks the trail dashes along every patch.',
            },
            {
                name: 'The firefly',
                text: 'A small light circles the heart of each log.',
            },
        ],
        arrival: [
            {
                name: 'Leaves unfold',
                text: 'Each day unfolds from its centre, as a leaf opening.',
            },
            {
                name: 'Growth',
                text: 'The days grow up from the ground, week by week.',
            },
            {
                name: 'Falling leaves',
                text: 'Each day drifts down and settles with a sway.',
            },
        ],
        tone: [
            {
                name: "The ranger's wall calendar: its tones and today",
                text: "A ranger's wall calendar on kraft paper with its fibres: the number in italic, a leaf pinned to every night (a green leaf when all was saved, an autumn leaf when some was missing), a night with nothing done on clay. Today is circled in pencil; the picked day framed in clay.",
            },
            {
                name: 'The trail map: its tones and today',
                text: "Every day a patch of survey map, contour lines ringing the paper, the night's state painted as a trail blaze along its edge (a double blaze for a night with nothing done). Today carries a map pin; the picked day a dashed trail around it.",
            },
            {
                name: 'The moss and the rust',
                text: 'A band of colour along the foot, green as moss for a good night, amber as rust for a warning, red for none; today ringed in bark.',
            },
        ],
        select: [
            {
                name: "The ranger's wall calendar: its pick",
                text: 'Today is circled in pencil; the picked day framed in clay. New: the day lifts on hover, the picked count in heavy type.',
            },
            {
                name: 'The trail map: its pick',
                text: 'Today carries a map pin; the picked day a dashed trail around it. New: a dashed ring on hover, the picked count on an inverted label.',
            },
            {
                name: 'The flagging tape',
                text: 'Dotted flagging tape round the picked day; the figure underlined on hover; the count in brackets.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'The ink grid',
                text: 'Every day framed in 2px ink, each state told three ways: its colour, its frame (solid when all was saved, dashed when some was missing, double when none was, dotted when there was nothing to do) and its sign in the corner (✓ ! ✕ –, ? when nothing is known).',
            },
            {
                name: 'The inverse plate',
                text: 'Every day an ink plate with white figures, its state told by pattern alone in a band at its foot (solid, hatched, cross-hatched on red, dotted), so it reads in greyscale and in forced colours alike.',
            },
            {
                name: 'The big print',
                text: 'Large-print days: square plates with a 3px frame, the figure at 1.35em and the heaviest weight, the count in bold under it; the weekdays in bold capitals.',
            },
        ],
        loading: [
            {
                name: 'The ink grid: its loading',
                text: 'Loading shows three ink squares. Now it moves: the three ink squares step along in hard steps.',
            },
            {
                name: 'The inverse plate: its loading',
                text: 'Loading shows a dashed white line. Now it moves: the dashed line is drawn in hard steps.',
            },
            {
                name: 'The march',
                text: 'A thick black-and-yellow band marches along each foot.',
            },
        ],
        arrival: [
            {
                name: 'Line by line',
                text: 'The weeks appear in order, each in one hard step: no motion past what tells the order.',
            },
            {
                name: 'Column by column',
                text: 'The columns appear one after another, each in one hard step.',
            },
            {
                name: 'Cell by cell',
                text: 'Every cell appears in reading order in one hard step.',
            },
        ],
        tone: [
            {
                name: 'The ink grid: its tones and today',
                text: 'Every day framed in 2px ink, each state told three ways: its colour, its frame (solid when all was saved, dashed when some was missing, double when none was, dotted when there was nothing to do) and its sign in the corner (✓ ! ✕ –, ? when nothing is known). Today is ringed in heavy ink; the picked day in a 4px blue frame.',
            },
            {
                name: 'The inverse plate: its tones and today',
                text: 'Today is ringed in the signal yellow; the picked day framed in blue.',
            },
            {
                name: 'The thick bar',
                text: 'White plates, a thick coloured bar down the start edge and a sign for each tone (✓ ! ✕ – ?); today in a 3px black frame.',
            },
        ],
        select: [
            {
                name: 'The ink grid: its pick',
                text: 'Today is ringed in heavy ink; the picked day in a 4px blue frame. New: a dashed ring on hover, the picked count on an inverted label.',
            },
            {
                name: 'The inverse plate: its pick',
                text: 'Today is ringed in the signal yellow; the picked day framed in blue. New: the figure underlined on hover, the picked count boxed.',
            },
            {
                name: 'The double frame',
                text: 'A 4px double frame round the picked day; pressed on hover; the count in heavy type.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The almanac page',
                text: 'A page of an old almanac: every day a square of paper in a hairline, the figure in the serif italic, each night marked as an almanac marks the moon (● all saved, ◐ some missing, ○ none, on red).',
            },
            {
                name: 'The letterpress specimen',
                text: 'Every day pressed into the paper (a blind impression), the figure inked in letter-spaced small capitals, each night printed in its colour with the speckle of ink that did not take.',
            },
            {
                name: 'The tipped-in plate',
                text: 'Each day a photograph tipped into an album: a cream mount, four paper corners, the figure in italic serif.',
            },
        ],
        loading: [
            {
                name: 'The almanac page: its loading',
                text: 'Loading writes a pen stroke across every square and lets it fade.',
            },
            {
                name: 'The letterpress specimen: its loading',
                text: 'Loading presses the platen: the impression deepens and lifts.',
            },
            {
                name: 'The ink drop',
                text: 'A ring of ink spreads from the centre of each plate and starts again.',
            },
        ],
        arrival: [
            {
                name: 'Developed',
                text: 'Each plate develops from its centre outwards, as a print in the tray.',
            },
            {
                name: 'Pressed',
                text: 'Each day is pressed down by the platen, row by row.',
            },
            {
                name: 'Written in',
                text: 'The days are written in with the pen, left to right.',
            },
        ],
        tone: [
            {
                name: 'The almanac page: its tones and today',
                text: "A page of an old almanac: every day a square of paper in a hairline, the figure in the serif italic, each night marked as an almanac marks the moon (● all saved, ◐ some missing, ○ none, on red). Today's figure is ringed in hand-drawn ink; the picked day in a double ink rule.",
            },
            {
                name: 'The letterpress specimen: its tones and today',
                text: 'Every day pressed into the paper (a blind impression), the figure inked in letter-spaced small capitals, each night printed in its colour with the speckle of ink that did not take. Today carries a fleuron ❧ and an inked frame; the picked day a heavier impression.',
            },
            {
                name: 'The wax seal',
                text: 'A coloured wax dot in the corner of each plate; today ringed in ink.',
            },
        ],
        select: [
            {
                name: 'The almanac page: its pick',
                text: "Today's figure is ringed in hand-drawn ink; the picked day in a double ink rule. New: the figure underlined on hover, the picked count in brackets.",
            },
            {
                name: 'The letterpress specimen: its pick',
                text: 'Today carries a fleuron ❧ and an inked frame; the picked day a heavier impression. New: the day lifts on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The pencilled box',
                text: 'A dashed pencil box round the picked day; a dashed ring on hover; the count on an ink label.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The drafting schedule',
                text: "A schedule drawn on the sheet: every day a box in white ink, the figure in the drafting mono, each night's state as section hatching (plain, hatched for some missing, solid for none).",
            },
            {
                name: 'The title block',
                text: 'Every day a small title block: the figure in its own boxed field at the top left, the count in a strip along the foot, a revision triangle △ on a night with some missing, ▲ on one with none.',
            },
            {
                name: 'The stencil grid',
                text: 'Stencilled days: square boxes with open corners, the figure in the mono stencil face, the weekdays lettered in capitals between two construction lines.',
            },
        ],
        loading: [
            {
                name: 'The drafting schedule: its loading',
                text: "Loading runs a plotter's dash across every box.",
            },
            {
                name: 'The title block: its loading',
                text: "Loading marches a dash around every block's frame.",
            },
            {
                name: 'The compass',
                text: 'A compass arm sweeps a full circle in every box.',
            },
        ],
        arrival: [
            {
                name: 'Plotted',
                text: 'The plotter draws each box in reading order, left to right.',
            },
            {
                name: 'Projected',
                text: 'The grid is projected from the top left, opening diagonally.',
            },
            {
                name: 'Unrolled',
                text: 'The sheet unrolls downward, week by week.',
            },
        ],
        tone: [
            {
                name: 'The drafting schedule: its tones and today',
                text: "A schedule drawn on the sheet: every day a box in white ink, the figure in the drafting mono, each night's state as section hatching (plain, hatched for some missing, solid for none). Today is marked by amber dimension ticks at its corners; the picked day by an amber chain line.",
            },
            {
                name: 'The title block: its tones and today',
                text: 'Every day a small title block: the figure in its own boxed field at the top left, the count in a strip along the foot, a revision triangle △ on a night with some missing, ▲ on one with none. Today is framed in the double border; the picked day in a heavy line.',
            },
            {
                name: 'The revision cloud',
                text: "Plain boxes with the night's colour as a corner triangle; △ for warn, ▲ for none; today in an accent frame.",
            },
        ],
        select: [
            {
                name: 'The drafting schedule: its pick',
                text: 'Today is marked by amber dimension ticks at its corners; the picked day by an amber chain line. New: a dashed ring on hover, the picked count boxed.',
            },
            {
                name: 'The title block: its pick',
                text: 'Today is framed in the double border; the picked day in a heavy line. New: the figure underlined on hover, the picked count in brackets.',
            },
            {
                name: 'The detail callout',
                text: 'A double callout frame round the picked box; it lifts on hover; the count on a label.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The low sun',
                text: 'Every day a warm charcoal plate, its night glowing up from its foot in its colour as a low sun lights the ground, the figure in the serif.',
            },
            {
                name: 'The embers',
                text: 'Firelight, not neon.',
            },
            {
                name: 'The standing stones',
                text: 'Tall rounded-top stones, the figure low in the serif, the count above it like a carved number; the weekdays carved in small capitals.',
            },
        ],
        loading: [
            {
                name: 'The low sun: its loading',
                text: 'Loading lets a dawn rise in every plate and fade, unhurried.',
            },
            {
                name: 'The embers: its loading',
                text: 'Loading lets the embers breathe in every coal.',
            },
            {
                name: 'The sun dial',
                text: 'A shadow swings across each stone, as on a sundial.',
            },
        ],
        arrival: [
            {
                name: 'Sunrise',
                text: 'The stones rise from below, the low sun catching them one row at a time.',
            },
            {
                name: 'Dawn across',
                text: 'Light reaches the stones from the east, column by column.',
            },
            {
                name: 'Kindled',
                text: 'Each stone kindles from its centre.',
            },
        ],
        tone: [
            {
                name: 'The low sun: its tones and today',
                text: 'Every day a warm charcoal plate, its night glowing up from its foot in its colour as a low sun lights the ground, the figure in the serif. Today is ringed like the sun at the horizon; the picked day in an ember line.',
            },
            {
                name: 'The embers: its tones and today',
                text: 'Every day a coal: a good night glows along its edges, a night with some missing smoulders with ember specks, a night with nothing done is the red coal. Today wears a hot iron rim; the picked day an iron ring.',
            },
            {
                name: 'The ember line',
                text: "A glowing line along the foot in the night's colour; today ringed in the sun's colour.",
            },
        ],
        select: [
            {
                name: 'The low sun: its pick',
                text: 'Today is ringed like the sun at the horizon; the picked day in an ember line. New: a ring of light on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The embers: its pick',
                text: 'Today wears a hot iron rim; the picked day an iron ring. New: the day lifts on hover, the picked count boxed.',
            },
            {
                name: 'The halo',
                text: 'A double sun ring round the picked stone; the figure underlined on hover; the count on a label.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The slab',
                text: 'Every day a slab in the 3px black line with the hard shadow, solid candy fills, the figure in the heavy display face.',
            },
            {
                name: 'The sticker sheet',
                text: 'Every day a sticker slapped on a lavender sheet, each a degree or two askew, black outline, its fill in its state.',
            },
            {
                name: 'The concrete block',
                text: 'Raw blocks without a radius or a shadow, a 4px border, the figure huge and top left in the display face, the count bottom right.',
            },
        ],
        loading: [
            {
                name: 'The slab: its loading',
                text: 'Loading runs the tape through every slab.',
            },
            {
                name: 'The sticker sheet: its loading',
                text: 'Loading drops a block into every sticker, one after another.',
            },
            {
                name: 'The jackhammer',
                text: 'A black block thumps up and down at each foot in hard steps.',
            },
        ],
        arrival: [
            {
                name: 'Slammed down',
                text: 'Each block is slammed down with an overshoot, row by row.',
            },
            {
                name: 'Shoved in',
                text: 'Each block is shoved in from the side in two hard steps.',
            },
            {
                name: 'Dropped',
                text: 'The blocks fall from above, column by column.',
            },
        ],
        tone: [
            {
                name: 'The slab: its tones and today',
                text: 'The picked day is pressed in, its shadow gone, and framed; today carries a strip of yellow-and-black tape across its top.',
            },
            {
                name: 'The sticker sheet: its tones and today',
                text: 'Today carries a starburst behind its figure; the picked day a fat black ring.',
            },
            {
                name: 'The colour block',
                text: "A thick block of the night's colour down the start edge of every white block, a ! for warn and ✕ for none; today in a 4px black frame.",
            },
        ],
        select: [
            {
                name: 'The slab: its pick',
                text: 'The picked day is pressed in, its shadow gone, and framed; today carries a strip of yellow-and-black tape across its top. New: the day pressed in on hover, the picked count on an inverted label.',
            },
            {
                name: 'The sticker sheet: its pick',
                text: 'Today carries a starburst behind its figure; the picked day a fat black ring. New: the day nudged aside on hover, the picked count boxed.',
            },
            {
                name: 'The fat frame',
                text: 'A 5px black frame round the picked block; it lifts on hover; the count in brackets.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The gilt calendar',
                text: 'Every day a lacquer panel between double gold hairlines with stepped corners, the figure in the thin deco capitals.',
            },
            {
                name: 'The marquee',
                text: 'Every day a theatre marquee panel with a row of bulbs along its top: all lit for a good night, half lit for some missing, dark over a red panel for none.',
            },
            {
                name: 'The arched window',
                text: 'Every day an arched window of a deco facade: a rounded top, a gold rule inside, the figure in the display face; the weekdays spaced wide.',
            },
        ],
        loading: [
            {
                name: 'The gilt calendar: its loading',
                text: "Loading runs a glint along every panel's gilt.",
            },
            {
                name: 'The marquee: its loading',
                text: 'Loading chases the bulbs.',
            },
            {
                name: 'The fan',
                text: 'A gold fan opens and closes behind each figure.',
            },
        ],
        arrival: [
            {
                name: 'The curtain rises',
                text: 'The panels are revealed bottom up, as a theatre curtain rising.',
            },
            {
                name: 'The fan opens',
                text: 'Each panel opens from its centre as a fan.',
            },
            {
                name: 'The marquee',
                text: 'The panels are lit in sequence, a bulb chase around the month.',
            },
        ],
        tone: [
            {
                name: 'The gilt calendar: its tones and today',
                text: 'Today shows a gold sunburst fanning behind its figure and a gold ring; the picked day a double gold frame.',
            },
            {
                name: 'The marquee: its tones and today',
                text: "Every day a theatre marquee panel with a row of bulbs along its top: all lit for a good night, half lit for some missing, dark over a red panel for none. Today's panel is framed in gold; the picked one in a double rule.",
            },
            {
                name: 'The gilt corner',
                text: 'A coloured corner in each panel; today framed in gold.',
            },
        ],
        select: [
            {
                name: 'The gilt calendar: its pick',
                text: 'Today shows a gold sunburst fanning behind its figure and a gold ring; the picked day a double gold frame. New: a ring of light on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The marquee: its pick',
                text: "Today's panel is framed in gold; the picked one in a double rule. New: the day lifts on hover, the picked count on an inverted label.",
            },
            {
                name: 'The spotlight',
                text: 'A gold frame held off the picked panel; a dashed ring on hover; the count in brackets.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The stamped VOID nights',
                text: 'Every day a white index card on the black ledger; a night with nothing done is stamped VOID in red, slanted, a night with some missing stamped PART, a good night carries a red tick.',
            },
            {
                name: 'The calling card month',
                text: 'Black cards under a halftone screen, every figure a white scrap of cut paper set at its own slant, a night with nothing done on a red card.',
            },
            {
                name: 'The torn ticket',
                text: 'Days as torn tickets: a notch bitten from each side, the figure in heavy display face slanted, the weekdays in a black band.',
            },
        ],
        loading: [
            {
                name: 'The stamped VOID nights: its loading',
                text: 'Loading slides the halftone screen across every card.',
            },
            {
                name: 'The calling card month: its loading',
                text: 'Loading shuffles the halftone in hard steps.',
            },
            {
                name: 'The red cut',
                text: 'A red slash cuts across each ticket and again.',
            },
        ],
        arrival: [
            {
                name: 'Cut in',
                text: 'Each ticket is cut in with a hard slanted wipe.',
            },
            {
                name: 'Card dealt',
                text: 'The cards are dealt from the top left, flipping into place.',
            },
            {
                name: 'Stamped',
                text: 'Each ticket is stamped down with a jolt.',
            },
        ],
        tone: [
            {
                name: 'The stamped VOID nights: its tones and today',
                text: 'Every day a white index card on the black ledger; a night with nothing done is stamped VOID in red, slanted, a night with some missing stamped PART, a good night carries a red tick. Today wears a red frame; the picked day a white one.',
            },
            {
                name: 'The calling card month: its tones and today',
                text: 'Black cards under a halftone screen, every figure a white scrap of cut paper set at its own slant, a night with nothing done on a red card. Today is struck with a red slash in its corner; the picked day framed in white.',
            },
            {
                name: 'The marker stripe',
                text: "A diagonal marker stripe of the night's colour over each ticket; today in a red frame.",
            },
        ],
        select: [
            {
                name: 'The stamped VOID nights: its pick',
                text: 'Today wears a red frame; the picked day a white one. New: the day nudged aside on hover, the picked count on an inverted label.',
            },
            {
                name: 'The calling card month: its pick',
                text: 'Today is struck with a red slash in its corner; the picked day framed in white. New: the day pressed in on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The cut line',
                text: 'A red cut line round the picked ticket; a dashed ring on hover; the count boxed.',
            },
        ],
    },
    'shade-light': {
        shape: [
            {
                name: 'Pencil in the shade',
                text: 'Every day a square of paper lifted off the page by its soft shade, the figure in the serif italic, each night shaded in pencil hatching in its colour along its foot.',
            },
            {
                name: 'The leaf shade',
                text: "The month laid out under a tree: soft dappled shade of leaves over the whole sheet, the days crisp in it, each night's colour clear.",
            },
            {
                name: 'The paper fold',
                text: 'Each day a folded paper square: a soft crease across a corner, a long gentle shadow, the figure light in the display face.',
            },
        ],
        loading: [
            {
                name: 'Pencil in the shade: its loading',
                text: 'Loading hatches every square in once and leaves it, as every reveal here runs once. Now it moves: the hatching is drawn in again and again.',
            },
            {
                name: 'The leaf shade: its loading',
                text: 'Loading lets the shade of a passing cloud cross the sheet.',
            },
            {
                name: 'The window shadow',
                text: 'The shadow of a window frame drifts across each square.',
            },
        ],
        arrival: [
            {
                name: 'The shade passes',
                text: 'The days appear as a shade withdraws from left to right.',
            },
            {
                name: 'Unfolded',
                text: 'Each square unfolds from its top edge.',
            },
            {
                name: 'Settled',
                text: 'Each square settles down from a slight lift.',
            },
        ],
        tone: [
            {
                name: 'Pencil in the shade: its tones and today',
                text: 'Every day a square of paper lifted off the page by its soft shade, the figure in the serif italic, each night shaded in pencil hatching in its colour along its foot. Today is circled in pencil; the picked day lifted further, framed.',
            },
            {
                name: 'The leaf shade: its tones and today',
                text: "The month laid out under a tree: soft dappled shade of leaves over the whole sheet, the days crisp in it, each night's colour clear. Today carries a ring of sun through the leaves; the picked day a framed shade.",
            },
            {
                name: 'The watercolour wash',
                text: "A pale wash of the night's colour at the foot of each square, the figure in ink; today ringed in the primary colour.",
            },
        ],
        select: [
            {
                name: 'Pencil in the shade: its pick',
                text: 'Today is circled in pencil; the picked day lifted further, framed. New: the day lifts on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The leaf shade: its pick',
                text: 'Today carries a ring of sun through the leaves; the picked day a framed shade. New: a ring of light on hover, the picked count boxed.',
            },
            {
                name: 'The pencil circle',
                text: 'A dotted pencil line round the picked square; the figure underlined on hover; the count on a label.',
            },
        ],
    },
    'shade-dark': {
        shape: [
            {
                name: 'Silverpoint',
                text: 'The dark half of the pencil: every day framed in a silver hairline, each night shaded in silver hatching along its foot over its colour.',
            },
            {
                name: 'The reading lamp',
                text: 'A pool of lamplight on the dark page, falling off into shade at its edges, the days lit where the lamp is.',
            },
            {
                name: 'The night window',
                text: 'Dark panes with a pale sill at the foot, the figure thin in the display face, as windows across a street at night.',
            },
        ],
        loading: [
            {
                name: 'Silverpoint: its loading',
                text: 'Loading hatches every square in once. Now it moves: the silver hatching is drawn in again and again.',
            },
            {
                name: 'The reading lamp: its loading',
                text: 'Loading slides the pool of light slowly across the sheet.',
            },
            {
                name: 'The headlights',
                text: 'Headlights pass across each pane, left to right.',
            },
        ],
        arrival: [
            {
                name: 'Lamps on',
                text: 'The windows come on one by one, from their centre.',
            },
            {
                name: 'Blinds up',
                text: 'The blinds roll up on each row.',
            },
            {
                name: 'Night falls',
                text: 'The panes appear column by column from the west.',
            },
        ],
        tone: [
            {
                name: 'Silverpoint: its tones and today',
                text: 'The dark half of the pencil: every day framed in a silver hairline, each night shaded in silver hatching along its foot over its colour. Today is ringed in silver; the picked day in the blue.',
            },
            {
                name: 'The reading lamp: its tones and today',
                text: 'Today glows under the lamp in a warm ring; the picked day in the blue.',
            },
            {
                name: 'The window light',
                text: "A warm or cold light at the foot of each pane, in the night's colour; today ringed in silver.",
            },
        ],
        select: [
            {
                name: 'Silverpoint: its pick',
                text: 'Today is ringed in silver; the picked day in the blue. New: a ring of light on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The reading lamp: its pick',
                text: 'Today glows under the lamp in a warm ring; the picked day in the blue. New: the day lifts on hover, the picked count boxed.',
            },
            {
                name: 'The lit pane',
                text: 'A dotted line round the picked pane; the figure underlined on hover; the count on a label.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The tear-off pad',
                text: 'Still: nothing blinks.',
            },
            {
                name: 'The 1995 date picker',
                text: "The date picker of 1995: the month sunk into a white well in a two-pixel bevel, every day a raised bevelled button that sinks when picked, a night's state as the button's colour.",
            },
            {
                name: 'The floppy label',
                text: 'Every day a 3½" disk label: a square with a cut top corner, a ruled writing line, the figure handwritten-bold in the pixel face.',
            },
        ],
        loading: [
            {
                name: 'The tear-off pad: its loading',
                text: "A dotted line along each label's foot. Now it moves: the dotted line fills in steps, as a 1995 progress bar.",
            },
            {
                name: 'The 1995 date picker: its loading',
                text: 'Loading fills the buttons with the 50 % dither. Now it moves: the dither crawls a pixel at a time.',
            },
            {
                name: 'The hourglass',
                text: 'The 1995 hourglass cursor turns over in each label.',
            },
        ],
        arrival: [
            {
                name: 'Repaint',
                text: 'Windows 95 repaints the window: each row appears in one hard step.',
            },
            {
                name: 'The wipe',
                text: 'A PowerPoint-style wipe across each row, in hard steps.',
            },
            {
                name: 'The dissolve',
                text: 'Each label appears in a chequer dissolve of hard steps.',
            },
        ],
        tone: [
            {
                name: 'The tear-off pad: its tones and today',
                text: 'Every day a leaf of a perforated tear-off pad: a row of perforation holes along its top, the figure in the pixel face, a good night on green paper, a partial one on yellow, a night with nothing done on red. Today is ringed in the marker; the picked day in the dotted focus line of 1995.',
            },
            {
                name: 'The 1995 date picker: its tones and today',
                text: 'Today is ringed in red, as the picker did; the picked day sinks, in the navy frame.',
            },
            {
                name: 'The status icons',
                text: 'Plain labels with a coloured icon dot in the corner (✓ ! ✕); today ringed in red.',
            },
        ],
        select: [
            {
                name: 'The tear-off pad: its pick',
                text: 'Today is ringed in the marker; the picked day in the dotted focus line of 1995. New: the day pressed in on hover, the picked count boxed.',
            },
            {
                name: 'The 1995 date picker: its pick',
                text: "The date picker of 1995: the month sunk into a white well in a two-pixel bevel, every day a raised bevelled button that sinks when picked, a night's state as the button's colour. Today is ringed in red, as the picker did; the picked day sinks, in the navy frame. New: a dashed ring on hover, the picked count on an inverted label.",
            },
            {
                name: 'The marching ants',
                text: 'The picked label inside dashed marching ants; the figure underlined on hover; the count in heavy type.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The Swiss grid',
                text: 'The month set on the Swiss grid: every day under a heavy black rule, the figure in bold grotesque flush left at the top, the count flush left at the foot, the nights in flat solid colour.',
            },
            {
                name: 'The transit bullets',
                text: "Every day a round bullet, as on a transit map, filled in its state's colour with the figure in it, the days still to come drawn as open rings.",
            },
            {
                name: 'The poster grid',
                text: 'No frames at all: the figure huge and flush left in the bold grotesk, the count small beneath it, the days aligned on a strict baseline.',
            },
        ],
        loading: [
            {
                name: 'The Swiss grid: its loading',
                text: 'Loading cuts in three black squares, one after another, in hard steps.',
            },
            {
                name: 'The transit bullets: its loading',
                text: 'Loading hops the zebra along every bullet.',
            },
            {
                name: 'The ticker',
                text: 'A red bar slides in from the left under each figure, hits the end and starts again.',
            },
        ],
        arrival: [
            {
                name: 'On the grid',
                text: 'Each day slides onto its baseline from the left, in reading order.',
            },
            {
                name: 'Column drop',
                text: 'The columns drop in one after another.',
            },
            {
                name: 'Hard cut',
                text: 'Each week cuts in at once.',
            },
        ],
        tone: [
            {
                name: 'The Swiss grid: its tones and today',
                text: 'The month set on the Swiss grid: every day under a heavy black rule, the figure in bold grotesque flush left at the top, the count flush left at the foot, the nights in flat solid colour. Today is boxed in black; the picked day in red.',
            },
            {
                name: 'The transit bullets: its tones and today',
                text: 'Today is ringed in black; the picked day in red.',
            },
            {
                name: 'The rule',
                text: "A heavy rule of the night's colour over each figure; today boxed in black.",
            },
        ],
        select: [
            {
                name: 'The Swiss grid: its pick',
                text: 'Today is boxed in black; the picked day in red. New: the figure underlined on hover, the picked count in heavy type.',
            },
            {
                name: 'The transit bullets: its pick',
                text: 'Today is ringed in black; the picked day in red. New: the day nudged aside on hover, the picked count on an inverted label.',
            },
            {
                name: 'The red bar',
                text: 'A heavy red frame flush on the picked day; a dashed ring on hover; the count in capitals.',
            },
        ],
    },
    lapis: {
        shape: [
            {
                name: 'Lapis on vellum',
                text: 'The month on a leaf of ivory vellum ruled in gold inside the lapis page, each day a panel inked in its state, the figure in the Markazi serif.',
            },
            {
                name: 'The girih tiles',
                text: 'Every day a lapis tile tooled with a faint gold girih lattice in a double gold frame.',
            },
            {
                name: 'The mosaic',
                text: 'Small tesserae: square-cut plates with a gold grout line, the figure in the display serif, the weekdays in gold capitals.',
            },
        ],
        loading: [
            {
                name: 'Lapis on vellum: its loading',
                text: "Loading lets a burnisher's glint run across every panel.",
            },
            {
                name: 'The girih tiles: its loading',
                text: 'Loading runs a glint along every frame.',
            },
            {
                name: 'The gold leaf',
                text: 'A sheet of gold leaf is laid across each tile, band by band.',
            },
        ],
        arrival: [
            {
                name: 'Laid in',
                text: 'The tesserae are laid one by one, in reading order.',
            },
            {
                name: 'Gilded',
                text: 'Each row is gilded from left to right.',
            },
            {
                name: 'The star',
                text: 'The month opens from the top left as a star unfolds.',
            },
        ],
        tone: [
            {
                name: 'Lapis on vellum: its tones and today',
                text: 'Today is ringed in a gold toranj, the pointed cartouche; the picked day in a gold frame.',
            },
            {
                name: 'The girih tiles: its tones and today',
                text: 'Today wears a gold eight-pointed star behind its figure; the picked day a gold ring.',
            },
            {
                name: 'The enamel',
                text: "A strip of enamel in the night's colour along the foot; today framed in gold.",
            },
        ],
        select: [
            {
                name: 'Lapis on vellum: its pick',
                text: 'Today is ringed in a gold toranj, the pointed cartouche; the picked day in a gold frame. New: a ring of light on hover, the picked count in spaced capitals.',
            },
            {
                name: 'The girih tiles: its pick',
                text: 'Today wears a gold eight-pointed star behind its figure; the picked day a gold ring. New: the day lifts on hover, the picked count on an inverted label.',
            },
            {
                name: 'The gold setting',
                text: 'The picked tile set in gold; a dashed ring on hover; the count in brackets.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The CRT duty roster',
                text: 'The month on a dark CRT set into the beige case: scanlines and a vignette over the glass, every day a phosphor cell, a good night in full cream, a partial one in amber, a night with nothing done as an inverse amber block.',
            },
            {
                name: 'The indicator panel',
                text: "Every day a beige key on the ship's panel with an indicator lamp in its corner (green, amber, red, or dark), the figure in the panel mono and the count on a strip of embossed label tape.",
            },
            {
                name: 'The keypad',
                text: 'Chunky square keys with a raised lip, the figure in the mono face like a printed keycap, the weekdays stencilled on the case.',
            },
        ],
        loading: [
            {
                name: 'The CRT duty roster: its loading',
                text: 'Loading warms the screen while the cursor blinks.',
            },
            {
                name: 'The indicator panel: its loading',
                text: 'Loading scans the lamps along the panel, one key after another.',
            },
            {
                name: 'The radar',
                text: 'A radar sweep turns in each key.',
            },
        ],
        arrival: [
            {
                name: 'Self test',
                text: 'Each key lights in reading order during the self test.',
            },
            {
                name: 'CRT warm up',
                text: 'Each row grows from a bright line, as a CRT warms.',
            },
            {
                name: 'Teletype',
                text: 'The columns are printed left to right.',
            },
        ],
        tone: [
            {
                name: 'The CRT duty roster: its tones and today',
                text: 'The month on a dark CRT set into the beige case: scanlines and a vignette over the glass, every day a phosphor cell, a good night in full cream, a partial one in amber, a night with nothing done as an inverse amber block. Today sits over a block cursor; the picked day in a cream frame.',
            },
            {
                name: 'The indicator panel: its tones and today',
                text: "Today's key has its lamp ringed; the picked key is pressed in.",
            },
            {
                name: 'The warning lamp',
                text: "A lamp in the corner of each key in the night's colour, WARN and FAIL on the bad nights; today framed in amber.",
            },
        ],
        select: [
            {
                name: 'The CRT duty roster: its pick',
                text: 'Today sits over a block cursor; the picked day in a cream frame. New: the day pressed in on hover, the picked count boxed.',
            },
            {
                name: 'The indicator panel: its pick',
                text: "Today's key has its lamp ringed; the picked key is pressed in. New: a ring of light on hover, the picked count on an inverted label.",
            },
            {
                name: 'The hazard select',
                text: 'A dashed amber frame round the picked key; the figure underlined on hover; the count in capitals.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The anodised tiles',
                text: 'Every day a tile of brushed titanium, its night anodised into it in its colour, the figure engraved in the instrument mono.',
            },
            {
                name: 'The date wheel',
                text: "Every day a watch's date window: the figure on its wheel behind a recessed aperture, the night's state the colour of the aperture's anodised ring, a knurled edge along the top.",
            },
            {
                name: 'The watch bezel',
                text: 'Every day a small round dial: a circular plate with a fine bezel ring, the figure in instrument mono at its centre, the count on a sub-dial below.',
            },
        ],
        loading: [
            {
                name: 'The anodised tiles: its loading',
                text: 'Loading runs the cutter across every tile at an even, linear pace: metal does not ease.',
            },
            {
                name: 'The date wheel: its loading',
                text: 'Loading rolls the knurl, linearly.',
            },
            {
                name: 'The second hand',
                text: 'A second hand ticks around each dial, one step per second.',
            },
        ],
        arrival: [
            {
                name: 'Machined',
                text: 'Each dial is cut from the left, as a cutter passing.',
            },
            {
                name: 'Wound',
                text: 'Each dial turns into place, as a crown wound.',
            },
            {
                name: 'Clicked in',
                text: 'Each dial clicks in with a small scale step.',
            },
        ],
        tone: [
            {
                name: 'The anodised tiles: its tones and today',
                text: 'Every day a tile of brushed titanium, its night anodised into it in its colour, the figure engraved in the instrument mono. Today is ringed in the blue heat tint; the picked tile has a polished edge.',
            },
            {
                name: 'The date wheel: its tones and today',
                text: "Every day a watch's date window: the figure on its wheel behind a recessed aperture, the night's state the colour of the aperture's anodised ring, a knurled edge along the top. Today's window is ringed in blue oxide; the picked one framed.",
            },
            {
                name: 'The index mark',
                text: "An index mark in the night's colour at the top of each dial; today ringed in blue.",
            },
        ],
        select: [
            {
                name: 'The anodised tiles: its pick',
                text: 'Today is ringed in the blue heat tint; the picked tile has a polished edge. New: the day pressed in on hover, the picked count boxed.',
            },
            {
                name: 'The date wheel: its pick',
                text: "Today's window is ringed in blue oxide; the picked one framed. New: the day lifts on hover, the picked count on an inverted label.",
            },
            {
                name: 'The heat-tint ring',
                text: 'A dashed blue ring held off the picked dial; it glows on hover; the count in brackets.',
            },
        ],
    },
};

/**
 * Round 1's verdicts (Kenny, 2026-10-06 10:30), in the order of ASPECTS:
 * shape, loading, arrival, tone, select. A number is settled and not shown
 * as a choice again (Kenny, 2026-10-06: what he does not name is settled);
 * '' is open in round 2: high-contrast's loading ("a spinner in each day is
 * barely visible"; six options, one picture over the whole month) and
 * phantom's picked day ("needs new prototypes").
 * @type {Record<string, string[]>}
 */
const PICKED = {
    formal: ['1', '1', '2', '1', '1'],
    light: ['2', '2', '1', '2', '2'],
    dark: ['3', '1', '3', '1', '2'],
    cyberpunk: ['3', '2', '1', '2', '2'],
    synthwave: ['3', '3', '1', '1', '1'],
    pastel: ['1', '1', '3', '2', '1'],
    terminal: ['3', '2', '3', '1', '2'],
    forest: ['3', '1', '3', '2', '3'],
    'high-contrast': ['3', '3', '3', '1', '2'],
    sepia: ['3', '1', '2', '1', '1'],
    blueprint: ['2', '2', '1', '2', '1'],
    solstice: ['2', '2', '2', '2', '3'],
    brutalism: ['1', '1', '1', '1', '3'],
    deco: ['1', '1', '2', '1', '1'],
    phantom: ['3', '3', '3', '2', '1'],
    'shade-light': ['1', '1', '1', '1', '2'],
    'shade-dark': ['1', '1', '1', '1', '2'],
    retro: ['3', '1', '3', '1', '1'],
    grotesk: ['3', '3', '1', '1', '1'],
    lapis: ['3', '2', '1', '2', '2'],
    nostromo: ['1', '2', '2', '1', '1'],
    titanium: ['1', '1', '2', '1', '1'],
};
/** The settled pick of one aspect, or '' when it is open in round 2. */
const keptOf = (/** @type {string} */ theme, /** @type {Aspect} */ aspect) => PICKED[theme]?.[ASPECTS.findIndex((a) => a.id === aspect)] ?? '';
// Round 2's new options replace an open aspect's (each carries its own key,
// the attribute value its CSS answers to; round 1's are keyed 1, 2, 3).
for (const [t, aspects] of Object.entries({ ...R2A, ...R2B }))
    for (const [id, options] of Object.entries(aspects)) if (!keptOf(t, /** @type {Aspect} */ (id)) && options.length >= 3) IDEAS[t][id] = options;
/** The attribute value of option n of an aspect in a theme. */
const keyOf = (/** @type {string} */ t, /** @type {Aspect} */ id, /** @type {string} */ n) => IDEAS[t]?.[id]?.[Number(n) - 1]?.key ?? n;
/** The most options any row shows. */
const MOST = 6;

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="calendar"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// Round 2 asks only what Kenny sent back; the rest is settled and hidden.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(
        Object.entries(IDEAS)
            .filter(([, idea]) => idea[aspect][at])
            .map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]),
    );
const countOf = (/** @type {Aspect} */ id) =>
    Math.max(
        3,
        ...Object.keys(IDEAS)
            .filter((t) => !keptOf(t, id))
            .map((t) => IDEAS[t][id].length),
    );
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [...Array(countOf(id)).keys()].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
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
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    const open = ASPECTS.filter(({ id }) => !keptOf(theme, id));
    p.textContent = open.length
        ? `Round 2: ${idea[open[0].id].length} new options for ${open.map(({ label }) => label.toLowerCase()).join(' and ')}; everything else is settled as you picked it and is no longer a choice. ` +
          'Only the open row is on the page; the combination at the top shows your picks. Press Loading, Read and the months, and hover and click a day, at full speed and at ¼.'
        : 'Approved: every aspect is settled as you picked it.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

let keySeq = 0;
/** A calendar for an aspect wrapper. @param {string} words */
const calendar = (words) => {
    const cal = document.createElement('section');
    cal.className = 'kp-calendar';
    cal.setAttribute('data-kp-calendar', '');
    cal.setAttribute('data-kp-calendar-month', '2026-10');
    cal.setAttribute('data-kp-calendar-selected', '2026-10-16');
    cal.setAttribute('data-kp-time-zone', 'Europe/Brussels');
    cal.setAttribute('data-kp-heading-level', '4');
    cal.setAttribute('data-kp-key', `backups-${(keySeq += 1)}`);
    cal.setAttribute('lang', 'en-GB');
    cal.setAttribute('aria-label', `Nightly backups, ${words}`);
    return cal;
};
const rows = /** @type {HTMLElement} */ (section.querySelector('[data-cl-aspects]'));
for (const { id, label, about } of ASPECTS) {
    const box = document.createElement('section');
    box.className = 'cl-aspect';
    box.setAttribute('data-cl-aspect', id);
    box.setAttribute('aria-labelledby', `h-cl-${id}`);
    const head = document.createElement('div');
    head.className = 'cl-aspect__head';
    head.innerHTML = `<h3 id="h-cl-${id}"></h3><p></p>`;
    /** @type {HTMLElement} */ (head.firstElementChild).textContent = label;
    /** @type {HTMLElement} */ (head.lastElementChild).textContent = about;
    const trio = document.createElement('div');
    trio.className = 'cl-trio';
    for (let at = 1; at <= MOST; at++) {
        const cell = document.createElement('div');
        cell.className = 'cl-col';
        cell.setAttribute('data-cl-vary', id);
        cell.setAttribute('data-cl-option', String(at));
        cell.innerHTML = `<p class="cl-label"><span class="cl-label__no">${label} · ${at}</span> <span data-cl-name></span></p><p class="cl-desc" data-cl-desc></p>`;
        const wrap = document.createElement('div');
        wrap.className = 'cl-cal';
        wrap.setAttribute('data-cl', '');
        wrap.append(calendar(`${label}, option ${at}`));
        cell.append(wrap);
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

/** Writes the five aspects on every wrapper: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-cl-preview]');
    const t = theme();
    for (const { id } of ASPECTS) preview?.setAttribute(`data-cl-${id}`, keyOf(t, id, now[id]));
    for (const cell of section.querySelectorAll('[data-cl-vary]')) {
        const vary = cell.getAttribute('data-cl-vary');
        const option = cell.getAttribute('data-cl-option') ?? '1';
        const wrap = cell.querySelector('[data-cl]');
        for (const { id } of ASPECTS) wrap?.setAttribute(`data-cl-${id}`, keyOf(t, id, id === vary ? option : now[id]));
        cell.classList.toggle('cl-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-cl-picks]');
    const idea = IDEAS[theme()];
    if (words && idea) words.textContent = ASPECTS.map(({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}`).join(' · ');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});
compose();

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
const SERVICES = [
    'Readings database',
    'Field gateway',
    'Reports',
    'Maps',
    'Alarm relay',
    'Work orders',
    'Invoices',
    'Telemetry archive',
    'Mail relay',
];
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

// Read always replays the arrival: one frame loading, then the month
// comes in the way the arrival brings it.
for (const b of section.querySelectorAll('[data-cl-state]'))
    b.addEventListener('click', () => {
        state.turn += 1;
        const shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cl-state') ?? 'ready');
        const replay = shown === 'ready' && state.shown === 'ready';
        state.shown = shown;
        pressed('data-cl-state', state.shown);
        if (!replay) return draw();
        state.shown = 'loading';
        draw();
        state.shown = 'ready';
        requestAnimationFrame(() => requestAnimationFrame(() => draw()));
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

/* ------------------------------------------------------- the arrival */

// After loading the arrival restarts by itself: its rule needs the grid not
// busy. On a month change the grid is repainted in place (no new buttons),
// so the demo sets `data-cl-arrive` again; in a register calendar.js would
// have to mark the month change, a hook it does not expose yet.
const arrive = (/** @type {HTMLElement} */ el) => {
    el.removeAttribute('data-cl-arrive');
    void el.offsetWidth;
    el.setAttribute('data-cl-arrive', '');
};
for (const el of calendars()) {
    arrive(el);
    const title = el.querySelector('.kp-calendar__title');
    let shown = title?.textContent ?? '';
    if (title)
        new MutationObserver(() => {
            if (title.textContent === shown) return;
            shown = title.textContent ?? '';
            arrive(el);
        }).observe(title, { childList: true, characterData: true, subtree: true });
}

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-cl-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    // A settled aspect has no row, and a row hides the cells its theme has no option for.
    for (const box of section.querySelectorAll('[data-cl-aspect]'))
        /** @type {HTMLElement} */ (box).hidden = Boolean(keptOf(now, /** @type {Aspect} */ (box.getAttribute('data-cl-aspect'))));
    for (const cell of section.querySelectorAll('[data-cl-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-cl-vary'))]?.[Number(cell.getAttribute('data-cl-option')) - 1];
        /** @type {HTMLElement} */ (cell).hidden = !option;
        const name = cell.querySelector('[data-cl-name]');
        const desc = cell.querySelector('[data-cl-desc]');
        if (name) name.textContent = option?.name ?? '';
        if (desc) desc.textContent = option?.text ?? '';
    }
    compose();
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
