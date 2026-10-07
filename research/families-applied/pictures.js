// research/families-applied: the words of the page. Per theme and family,
// the picture Kenny picked (research/families/VERDICTS.md, 2026-10-07 01:32):
// which component it comes from, its name and its idea in one line (taken
// from that demo's own option words, or written from its CSS where a later
// round named it only by key), and what the translation keeps of it. Per
// family and component, where the picture lands; per theme, the components
// that cannot take it, and why.

/** The ten themes on this page, in the order the families page walks them. */
export const THEMES_HERE = ['formal', 'light', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'terminal', 'forest', 'high-contrast', 'sepia'];

/** The family Kenny did not approve in a theme: not applied, not asked. */
export const REJECTED = /** @type {Record<string, string>} */ ({ cyberpunk: 'live', forest: 'loading' });

/**
 * @typedef {{ from: string, name: string, idea: string, keeps: string, cannot?: Record<string, string>, notes?: Record<string, string> }} Picture
 * @type {Record<string, Record<string, Picture>>}
 */
export const PICTURES = {
    formal: {
        loading: {
            from: 'busy',
            name: 'The seal is pressed',
            idea: 'A navy seal ring under the words is pressed and lifted on its own centre, again and again (1.4 s, ease in and out).',
            keeps: 'the ring, its size, its press and its pace; every sweep, leader and ink pass of today stands still, so the seal is the only thing that moves.',
        },
        arrival: {
            from: 'meter',
            name: 'Written into the ledger',
            idea: 'The share is drawn in from the left, slowing as it lands (900 ms, a ledger pen).',
            keeps: 'one direction (left to right), one curve and one duration for everything that arrives; nothing fades, slides or flips any more.',
        },
        live: {
            from: 'trend',
            name: 'Redrawn',
            idea: 'A new reading is simply written in place, at once: no flash, no swell.',
            keeps: 'the stillness: every component takes its new reading without motion.',
        },
        hover: {
            from: 'graph',
            name: 'Red-ink tick',
            idea: 'The pick is ringed in red ink; the rest stays half visible in grey pencil.',
            keeps: 'the red-ink ring on what is pointed at, focused or pressed, and the grey pencil over its siblings while one is pointed at.',
        },
        tone: {
            from: 'tiles',
            name: 'The engraved plate',
            idea: 'The tone sits boxed like an engraved figure: the tone colour inside a card-coloured gap and a hairline of the tone, the mark a diamond.',
            keeps: 'the engraved double rule (a 2 px gap in the card, a 1 px rule in the tone) around every tone, square corners, diamonds for marks.',
        },
        shape: {
            from: 'meter',
            name: 'The bound volume and its ribbon',
            idea: "The track is a book's fore-edge, page after page; the share is navy buckram; the mark is a gold ribbon bookmark.",
            keeps: 'the fore-edge ruling on the plates, the buckram cross-hatch on what is filled with the primary, gold ribbons as marks, 1 px corners.',
        },
    },
    light: {
        loading: {
            from: 'columns',
            name: 'Morning light',
            idea: 'A soft band of daylight crosses every column, slowly (1.8 s, eased).',
            keeps: 'the band, its 12 % of the primary, its angle and its slow crossing, on every surface that waits.',
        },
        arrival: {
            from: 'trend',
            name: 'Sunrise',
            idea: 'The line rises from the baseline, slowing as it lands; the number drops into its line (1 s, ease-out).',
            keeps: 'rising from the bottom edge for pictures and boxes, dropping into the line for words and figures, one second, ease-out.',
        },
        live: {
            from: 'trend',
            name: 'A soft swell',
            idea: 'The line swells once and settles, slowing as it lands (900 ms).',
            keeps: 'one soft swell of the part that changed, then rest.',
        },
        hover: {
            from: 'header',
            name: 'The warm glow',
            idea: "Hover warms a button's pill, focus adds a soft halo ring, press flattens the pill for a moment.",
            keeps: 'warming with the primary on hover, the 3 px halo 3 px out on focus, the flat inset on press.',
        },
        tone: {
            from: 'tiles',
            name: 'The soft pill',
            idea: 'A warning or destructive figure shows its note on a soft pill.',
            keeps: 'a fully rounded pill in the tone for every tone note and mark.',
        },
        shape: {
            from: 'columns',
            name: 'Separate cards',
            idea: 'Each figure its own small white card on its own soft shadow, no border, sentence-case heads, bold figures.',
            keeps: "no borders, a soft lifted shadow, a radius 1.5 times the theme's, heads in sentence case, figures bold.",
        },
    },
    dark: {
        loading: {
            from: 'busy',
            name: 'The ticker baseline',
            idea: 'A dashed baseline under the words ticks along like a ticker tape, looping without a seam.',
            keeps: 'the 2 px dashed baseline in the primary (3 px on, 5 px off) ticking left to right at 1.5 s a step of 11 px, at the foot of every waiting surface.',
        },
        arrival: {
            from: 'menu',
            name: 'Powered up',
            idea: 'The rim lights from dim to full across three steps (300 ms).',
            keeps: 'three hard brightness steps (40 %, 65 %, 85 %, full); nothing moves in place.',
        },
        live: {
            from: 'kpi',
            name: 'The trace flares',
            idea: "A new reading flares the number's glow for a third of a second, then dims back, as an oscilloscope trace catching a spike.",
            keeps: 'a glow in the primary that flares and dies in 550 ms on the part that changed (text glows, lines glow as a drop-shadow).',
        },
        hover: {
            from: 'graph',
            name: 'Spotlit',
            idea: 'The pick glows in the primary; the rest dims to 25 %.',
            keeps: 'the primary glow on what is pointed at, focused or pressed, and the dimming of its siblings while one is pointed at.',
        },
        tone: {
            from: 'meter',
            name: 'Pressed in the die',
            idea: 'A new tone swells the part once, at an even pace (200 ms, taller than wide).',
            keeps: 'the swell (4 % wider, 30 % taller, linear, 200 ms) whenever a tone is struck.',
        },
        shape: {
            from: 'columns',
            name: 'The oscilloscope',
            idea: 'Each figure on the dark glass of a scope with its fine 12 px grid, the number glowing a little, the heads in mono.',
            keeps: 'the glass, the grid, the 1 px rule and 6 px radius, the glow on figures, mono heads.',
        },
    },
    cyberpunk: {
        loading: {
            from: 'menu',
            name: 'Target lock',
            idea: 'A reticle of corner brackets sweeps in from the right, narrows onto the entry and locks on, flickering; SCANNING turns into TARGET ACQUIRED (1.8 s, hard steps).',
            keeps: 'the corner brackets in the accent, the sweep from the right, the lock and its flicker, the word, on every waiting surface.',
        },
        arrival: {
            from: 'menu',
            name: 'Glitch in',
            idea: 'The menu tears in as slices that jump sideways with the red and cyan split, then settles (380 ms, hard steps).',
            keeps: 'the slices, the sideways jumps and the colour split, in the same eight hard steps.',
        },
        hover: {
            from: 'tiles',
            name: 'The circuit lights',
            idea: 'The grid lines brighten; a link gains a neon underline; focus draws a glitch-cut ring.',
            keeps: 'the 14 px circuit grid on what is pointed at, the neon underline, the slanted cut of the focus ring.',
        },
        tone: {
            from: 'menu',
            name: 'Marked as a target',
            idea: 'A destructive entry is held in corner brackets of its tone that twitch, tagged TARGET.',
            keeps: 'the twitching corner brackets in the tone and the mono tag (TARGET, or CAUTION for a warning).',
        },
        shape: {
            from: 'tiles',
            name: 'The holo card',
            idea: 'A neon rim in the primary, glowing inward and outward, diagonal scan lines, the mark a diamond in the primary.',
            keeps: 'the rim, the glow both ways, the 135° scan lines, the 0.3 rem corner, diamonds for marks.',
        },
    },
    synthwave: {
        loading: {
            from: 'busy',
            name: 'The marquee chases',
            idea: 'The lit cells along the top light in sequence, left to right, looping without a seam (0.9 s, four hard steps).',
            keeps: 'a row of lit cells along the top edge of every waiting surface, chasing in four hard steps.',
        },
        arrival: {
            from: 'trend',
            name: 'Over the horizon',
            idea: 'The line rises from the baseline, slowing hard as it lands; the number rises into its line (1 s).',
            keeps: 'rising from the bottom edge, the number rising through its own line, the long ease-out (0.2, 0.8, 0.2, 1).',
        },
        live: {
            from: 'kpi',
            name: 'The laser flares',
            idea: "A new reading: the digits' pink glow flares to full and burns back down over half a second.",
            keeps: 'the pink flare that burns down in 550 ms on the part that changed.',
        },
        hover: {
            from: 'tiles',
            name: 'The marquee glows',
            idea: "The frame's glow widens; a link gains a pink drop; focus traces the marquee in light.",
            keeps: 'the wide pink glow and 2 px outline 3 px out on hover, the outline 4 px out on focus.',
        },
        tone: {
            from: 'tiles',
            name: 'The neon tube',
            idea: "The mark is an empty tube ring glowing in the tone; the title glows in the tone's colour.",
            keeps: 'an empty ring with a white core and the tone as its glow; words of a toned part glow in the tone.',
        },
        shape: {
            from: 'busy',
            name: 'The grid console',
            idea: "A plate ruled with the primary's 10 px grid, a bevel lit above and shaded below, the words in mono.",
            keeps: 'the 10 px grid at 20 % on every plate, the bevel, the 0.2 rem corner, mono heads.',
        },
    },
    pastel: {
        loading: {
            from: 'busy',
            name: 'The washi flutters',
            idea: 'A strip of washi tape sways gently side to side and back, looping (2 s).',
            keeps: 'the striped tape along the top of every waiting surface, swaying a degree each way.',
        },
        arrival: {
            from: 'columns',
            name: 'Stuck on',
            idea: 'Each part swings in from its top corner as a note stuck on, one after the other (600 ms, a little overshoot, 90 ms apart).',
            keeps: 'the swing from the top corner, the overshoot, the 90 ms between parts.',
        },
        live: {
            from: 'graph',
            name: 'The wobble',
            idea: 'The changed part wobbles like jelly, and its string is drawn again (800 ms).',
            keeps: 'the jelly wobble on the part that changed; a changed line is drawn again.',
        },
        hover: {
            from: 'header',
            name: 'The tape peel',
            idea: "Hover peels a button's tape corner up a little, focus dashes a line round it, press presses it back down.",
            keeps: 'the small tilt and lift on hover, the dashed ring on focus, flat again on press.',
        },
        tone: {
            from: 'kpi',
            name: 'The sticker chart',
            idea: "The change is a sticker with its own flat shadow; a warning figure sits on the tone's pill.",
            keeps: "stickers (a rounded tag with a flat offset shadow) for notes and marks, the tone's pill for plates.",
        },
        shape: {
            from: 'busy',
            name: 'The taped card',
            idea: 'A softly rounded card in a hairline ring, a strip of washi tape across its corner.',
            keeps: "the radius 1.2 times the theme's, the hairline ring, the tape on the corner of every plate.",
        },
    },
    terminal: {
        loading: {
            from: 'busy',
            name: 'The cursor blinks',
            idea: 'A block cursor at the end of the words appears and disappears on a hard beat, no fade (1 s).',
            keeps: 'one block cursor per waiting surface, at the end of its first line, on and off with no fade.',
        },
        arrival: {
            from: 'meter',
            name: 'Typed out',
            idea: 'The share is drawn in from the left in 32 hard steps (1.2 s).',
            keeps: 'left to right in 32 hard steps, as a line being typed.',
        },
        live: {
            from: 'graph',
            name: 'The cursor blink',
            idea: 'The changed part blinks three times like a cursor; a changed link runs a dotted packet.',
            keeps: 'three hard blinks (900 ms) of the part that changed.',
        },
        hover: {
            from: 'kpi',
            name: 'The cursor ring',
            idea: 'Hover picks up the cursor ring, a dashed box steps in on focus, pressing prints the part reverse-video.',
            keeps: 'the ring colour on hover, the dashed box on focus, reverse video on press, and no blink at rest.',
        },
        tone: {
            from: 'kpi',
            name: 'The dumb-terminal plot',
            idea: "The change underlined; a warning or destructive figure sits on the tone's square plate.",
            keeps: 'underlines for notes and marks, square solid plates in the tone for plates.',
        },
        shape: {
            from: 'meter',
            name: 'The htop meter',
            idea: 'One line of htop: [||||||   ] between square brackets, a phosphor bar per character cell, a block caret.',
            keeps: 'square brackets as the frame of every plate, character cells, the block caret as a mark, mono everywhere.',
        },
    },
    forest: {
        arrival: {
            from: 'columns',
            name: 'Growing',
            idea: 'Every figure grows up into its line, slowly, slowing as it lands (800 ms, 80 ms apart).',
            keeps: 'growing up from under its own line, clipped there, one part after the other.',
        },
        live: {
            from: 'trend',
            name: 'Growth ring',
            idea: 'The line swells once and settles, easing in and out (1 s).',
            keeps: 'one slow swell of the part that changed, eased both ways.',
        },
        hover: {
            from: 'graph',
            name: 'Blazed',
            idea: 'The pick is blazed with a bold trail ring; the rest is mossed over in green.',
            keeps: 'the bold dashed trail ring on what is pointed at, the moss (sepia, faded) over its siblings.',
        },
        tone: {
            from: 'columns',
            name: 'The field note',
            idea: 'The change on a square tag set in italics, with ↑ and ↓.',
            keeps: 'square tags in italics for notes and marks, square plates for toned parts.',
        },
        shape: {
            from: 'meter',
            name: 'The wooden gauge',
            idea: "A groove routed into light wood, the share the same wood stained forest green with a knot; the trail's trig point as the mark.",
            keeps: 'light wood grain on the plates, the green stain with grain on what is filled, 3 px corners, the trig point as a mark.',
        },
    },
    'high-contrast': {
        loading: {
            from: 'graph',
            name: 'The tape runs',
            idea: 'The ghost of the graph in ink, its links dashed and running like tape (900 ms, linear).',
            keeps: "a dashed ink outline (14 px on, 10 px off) running round every waiting surface at the tape's pace.",
        },
        arrival: {
            from: 'meter',
            name: 'At once',
            idea: 'The share is there at once (a single hard step, 120 ms).',
            keeps: 'no motion: what arrives is there in one step.',
        },
        live: {
            from: 'trend',
            name: 'The bar flips',
            idea: 'The line flashes in the ink for a moment, in hard jumps (400 ms).',
            keeps: 'a hard flash to ink and back on the part that changed.',
        },
        hover: {
            from: 'menu',
            name: 'The bar flips',
            idea: 'A hovered or focused entry flips from ink on paper to paper on ink; a press flips it to the primary.',
            keeps: 'the full inversion on hover and focus, the primary on press.',
        },
        tone: {
            from: 'columns',
            name: 'The framed plate',
            idea: 'The change on a square plate in its status colour, framed in 2 px ink.',
            keeps: 'square plates in the tone, a 2 px ink frame on every one.',
        },
        shape: {
            from: 'meter',
            name: 'The ink frame',
            idea: 'A 2 px ink frame filled with solid ink; the mark a white slot between two ink edges.',
            keeps: '2 px ink frames, square corners, solid ink fills, slots as marks.',
        },
    },
    sepia: {
        loading: {
            from: 'busy',
            name: 'The drum turns',
            idea: "A ruled band turns around the panel's edge like a drum, looping (1.6 s, linear).",
            keeps: 'the ruled band (2 px ticks every 10 px) turning along the foot of every waiting surface.',
        },
        arrival: {
            from: 'chart',
            name: 'Stamped',
            idea: 'The series comes down from a little larger onto the paper, faster as it lands, like a rubber stamp (260 ms).',
            keeps: 'coming down from 112 % onto the page, accelerating, 260 ms.',
        },
        live: {
            from: 'trend',
            name: 'Redrawn',
            idea: 'A new reading is simply written in place, at once.',
            keeps: 'the stillness: every component takes its new reading without motion.',
        },
        hover: {
            from: 'menu',
            name: 'The paper warms',
            idea: "A hovered or focused entry's plate warms a shade; a press cools it back for a moment.",
            keeps: 'the warm shade (10 % of the primary) on hover and focus, 4 % on press.',
        },
        tone: {
            from: 'meter',
            name: 'Quill stroke',
            idea: 'A new tone knocks the part up and back once, slowing as it lands (280 ms).',
            keeps: 'the knock (3 px up, 1 px down, home) whenever a tone is struck.',
        },
        shape: {
            from: 'busy',
            name: 'The archive box',
            idea: 'A square plate, no veil, a vignette of age on its edges, a heavy rule on top, small capitals.',
            keeps: 'square plates with the vignette and the 5 px rule on top, small capitals for heads.',
        },
    },
};

/**
 * Where the picture lands, per family and component (the same in every theme).
 * @type {Record<string, Record<string, string>>}
 */
export const WHERE = {
    loading: {
        meter: 'On each meter while it measures; its own sweep stands still.',
        chart: 'On the plot and on each spark; the skeleton stands still.',
        calendar: 'Once over the month; the days stand still.',
        graph: 'On the box of the ghost graph; the ghost stands still.',
        trend: 'On the tile; the plot and the skeleton lines stand still.',
        columns: 'On each figure of the strip.',
        tiles: 'On each tile; its skeleton lines stand still.',
        kpi: 'On each key figure; its skeleton stands still.',
        menu: 'On the entry that is still loading.',
        busy: 'On the busy panel, in place of its own picture.',
    },
    arrival: {
        meter: "On each meter's share.",
        chart: 'On the plot of the chart and of each spark.',
        calendar: 'On the month grid as a whole.',
        graph: 'On the whole drawing of the graph.',
        trend: 'On the spark line; the number on its own.',
        columns: 'On each figure, one after the other.',
        tiles: 'On each tile, one after the other.',
        kpi: 'On each key figure, one after the other (the key figure has no arrival of its own today: shown as the page draws).',
        menu: 'On the menu as it opens.',
        header: "On the header's menu as it opens.",
        busy: 'On the busy panel as it comes.',
        drawer: 'On the drawer and the tour card as they open.',
        state: 'On the word (it has no arrival of its own today: shown as the page draws).',
    },
    live: {
        chart: 'On the reading and the line that changed.',
        graph: 'On the site and the link that changed.',
        trend: 'On the number, the delta and the line.',
        columns: 'On each figure and delta that changed.',
        tiles: "On the tile's reading and its time.",
        kpi: 'On each figure that changed.',
        state: 'On the word as it changes.',
        meter: 'On the meter whose share moved (simulated in both frames: a new reading every 2.4 s).',
        calendar: "On the days whose copies arrived (the calendar's live update).",
        busy: 'On the cell that took a new reading (simulated in both frames: every 2.4 s).',
    },
    hover: {
        calendar: 'On the days and the month buttons (the pointer is played over them).',
        graph: 'On the picked site (Pump house 3) and the kind buttons.',
        tiles: 'On the pointed-at tile and its Open.',
        kpi: 'On the link and the filter figure.',
        menu: 'On the entries and the menu button.',
        header: "On the header's buttons.",
        chart: 'On the legend sources and Show all.',
        trend: 'On the link to the charts.',
        state: 'On the button beside the word.',
        drawer: "On the tour's and the drawer's buttons.",
    },
    tone: {
        meter: 'On each meter in its warning tone.',
        calendar: 'On the days with missing copies.',
        trend: 'On the warning tile and its delta.',
        columns: 'On each delta.',
        tiles: 'On the warning tile and its mark.',
        kpi: 'On each warning figure and its delta.',
        menu: 'On the destructive entry.',
        state: 'On the word when it fails.',
        chart: 'On the event dots and the deltas of the pinned tip.',
        busy: "On the failed table's alert.",
    },
    shape: {
        meter: 'On the track, the share and the mark.',
        chart: 'On the chart plates, titles, figures and sources.',
        calendar: 'On the plate, the title, the days and the buttons.',
        graph: 'On the box, the kind chips and Show all.',
        trend: 'On the tile, its label and figure.',
        columns: 'On each figure, its label and number.',
        tiles: 'On each tile, its title, mark and Open.',
        kpi: 'On each figure, its label and number.',
        menu: 'On the menu, its headings and button.',
        state: 'On the word and the button.',
        header: 'On the header, its title and buttons.',
        busy: 'On the busy panel and the table heads.',
        drawer: 'On the drawer, the tour, their titles and buttons.',
    },
};

/**
 * Per family, the components that cannot take any picture of it, and why.
 * @type {Record<string, Record<string, string>>}
 */
export const CANNOT = {
    loading: {
        state: 'A state word names a state that is known; it never waits for data, so it has no loading picture to translate.',
        header: 'The page header is fixed text and buttons; it never waits for data.',
        drawer: 'The drawer and the tour hold fixed help text; they never wait for data.',
    },
    arrival: {},
    live: {
        menu: 'A menu holds actions, not readings; nothing in it changes while it is open.',
        header: 'The page header holds a title and actions, not readings.',
        drawer: 'The drawer and the tour hold fixed help text, not readings.',
    },
    hover: {
        meter: 'A meter is a reading, not a control: there is nothing to point at, focus or press.',
        columns: "The strip's figures are readings, not links: there is nothing to point at, focus or press.",
        busy: 'While the table is busy its overlay holds no control, and the rows are not links.',
    },
    tone: {
        graph: 'The network graph has no status tone of its own: a site in trouble is shown by its kind and the attention band, not by a tone.',
        header: 'The page header carries no status tone.',
        drawer: 'The drawer and the tour carry no status tone.',
    },
    shape: {},
};
