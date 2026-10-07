// research/character-columns: the sixth component of the character round
// (Kenny, form v18, 2026-10-05), the strip of key figures with one column per
// figure (`.kp-kpis[data-kp-kpis-columns]`), all 22 themes in one demo judged
// through the review kit. Round 2 (Kenny, 2026-10-05 20:03: every demo gets
// separate options per aspect, like the meter, "and it should be like this in
// the future"): nothing is bundled. Each theme's strip has five aspects, each
// picked on its own from three options: the shape, the loading picture, how
// the figures arrive, the tone and the change, and the live update.
//
// The strips are the package's own: attachKpiStrips() (js/kpi.js) picks every
// strip's column count from its own width. Every aspect is CSS only, in
// columns.css, keyed by one attribute each on the strip's wrapper
// (`data-cs-shape`, `data-cs-loading`, `data-cs-arrival`, `data-cs-tone`,
// `data-cs-live`), so any combination composes. On the page: one composed
// preview showing the current picks, and per aspect a row of three strips
// that differ in that aspect only. This file writes the tiles, sets the
// states and the moment (`data-cs-moment`: "arrive" after loading, "live"
// after a live update, with `data-cs-changed` on the tiles that changed), and
// runs the speed. js/kpi.js is not changed.

import { attachKpiStrips } from '../../js/kpi.js';
import { THEMES } from '../../js/theme-registry.js';

/** @typedef {{ name: string, text: string }} Option */
/** @typedef {'shape' | 'loading' | 'arrival' | 'tone' | 'live'} Aspect */

/** The five aspects, in the order they are asked. @type {{ id: Aspect, label: string, about: string }[]} */
const ASPECTS = [
    {
        id: 'shape',
        label: 'Shape',
        about: 'The tiles, the dividers between them, the figure and the label. Compare them as they stand, then with every set of figures.',
    },
    { id: 'loading', label: 'While loading', about: 'The picture every column shows while the strip loads; it always moves. Press Loading.' },
    { id: 'arrival', label: 'How the figures arrive', about: 'How the figures come in after loading. Press Drawn to replay it.' },
    {
        id: 'tone',
        label: 'The tone and the change',
        about: 'The change under the figure: its plate, its sign and its type, good in green and bad in red.',
    },
    {
        id: 'live',
        label: 'Live update',
        about: 'How a figure that changed shows it. Press Live update (ten minutes later); the open incidents do not change.',
    },
];

/**
 * Per theme, three options for each aspect. Options 1 and 2 come from round
 * 1's two characters where they differ; option 3 is new.
 * @type {Record<string, Record<Aspect, Option[]>>}
 */
const IDEAS = {
    formal: {
        shape: [
            {
                name: 'The ledger row',
                text: 'A page of an account book: a double rule over the strip, a rule between the columns, each head in the serif’s small capitals over its own rule, the figures set right in the display serif, the words in italics.',
            },
            {
                name: 'The booktabs table',
                text: 'A table from a scholarly book: a heavy rule above, a light one under the heads, a heavy one at the foot, no rules between the columns, every column centred, the figures in the text serif.',
            },
            {
                name: 'The engraved certificate',
                text: 'Each figure framed in an engraved double rule like a share certificate, centred, the head in spaced small capitals, the figure and its words in the display serif.',
            },
        ],
        loading: [
            {
                name: 'The pages riffle',
                text: 'A shade runs slowly along every column, like the fore-edge of a book riffled under the thumb.',
            },
            {
                name: 'The ink rule',
                text: 'A navy rule is written along the foot of every column, again and again, as the pen draws the total line.',
            },
            {
                name: 'The dotted leader',
                text: 'A leader of dots runs along the foot of every column, "to be entered".',
            },
        ],
        arrival: [
            {
                name: 'Entered with the pen',
                text: 'Each figure is written in from the left, slowing as the pen lifts, one column after the other.',
            },
            {
                name: 'Set in type',
                text: 'Each figure rises into its line in four hard steps, as type set by hand, all at once.',
            },
            {
                name: 'The pages turned',
                text: 'Each column turns in like a page on its spine, one after the other.',
            },
        ],
        tone: [
            {
                name: 'The ruled entry',
                text: 'The change on a square plate in its status colour, framed by a hairline, with the package’s arrows.',
            },
            {
                name: 'The margin note',
                text: 'The change on a square plate, set in italics like a note in the margin, with the arrows.',
            },
            {
                name: 'Plus and minus',
                text: 'The change as the book keeps it: a plus or a true minus sign in the serif, on a square plate with a rule under it.',
            },
        ],
        live: [
            {
                name: 'Underlined in ink',
                text: 'A figure that changed is underlined in ink for a moment, the rule growing under it.',
            },
            {
                name: 'Struck and rewritten',
                text: 'The old figure is struck through, then the new one is written in from the left.',
            },
            {
                name: 'The clerk’s stamp',
                text: 'The new figure is stamped in: it lands from larger in two hard steps.',
            },
        ],
    },
    light: {
        shape: [
            {
                name: 'One card',
                text: 'The whole strip is one white card lifted on a soft shadow, its columns parted by short hairlines, the heads in sentence case.',
            },
            {
                name: 'The legend chips',
                text: 'Each figure in a soft primary-tinted well with a wide radius, a dot in its column’s chart colour before the head, like a chart’s legend.',
            },
            {
                name: 'Separate cards',
                text: 'Each figure its own small white card lifted on its own soft shadow, no border, the heads in sentence case, the figures bold.',
            },
        ],
        loading: [
            {
                name: 'Morning light',
                text: 'A soft band of daylight crosses every column, slowly.',
            },
            {
                name: 'Through the window',
                text: 'Window panes of light drift along every column.',
            },
            {
                name: 'The shadow swings',
                text: 'The thin shadow of a sundial’s gnomon swings across every column and back.',
            },
        ],
        arrival: [
            {
                name: 'Rising into the light',
                text: 'Each figure rises into its line, slowing as it lands, one column after the other.',
            },
            {
                name: 'Popped up',
                text: 'Each column pops up from a little smaller, overshooting softly, one after the other.',
            },
            {
                name: 'Drawn by daylight',
                text: 'All figures are drawn in from the left together, easing in and out.',
            },
        ],
        tone: [
            {
                name: 'The pill',
                text: 'The change on a round pill in its status colour, with the package’s arrows.',
            },
            {
                name: 'The soft tag',
                text: 'The change on a small tag with soft corners, with thin arrows ↑ and ↓.',
            },
            {
                name: 'The lifted pill',
                text: 'The change on a round pill lifted on a little shadow, with slanted arrows ↗ and ↘.',
            },
        ],
        live: [
            {
                name: 'A ring of light',
                text: 'A ring of light opens around a figure that changed and is gone.',
            },
            {
                name: 'Lifted in',
                text: 'The new figure rises into its line, slowing as it lands.',
            },
            {
                name: 'Underlined',
                text: 'The new figure is underlined in indigo for a moment, the line growing under it.',
            },
        ],
    },
    dark: {
        shape: [
            {
                name: 'The departure board',
                text: 'An airport board: every number in a split-flap window with a hinge line across its middle, the heads in mono capitals, the strip a dark panel.',
            },
            {
                name: 'The rack',
                text: 'A server rack: each figure a rack unit with a screw head at each corner and a lit green status lamp before its head, all in the mono.',
            },
            {
                name: 'The oscilloscope',
                text: 'Each figure on the dark glass of a scope with its fine grid, the number glowing a little in the primary, the heads in mono.',
            },
        ],
        loading: [
            {
                name: 'The flaps flick',
                text: 'A shadow flicks down every column in three hard steps, like the flaps of a departure board.',
            },
            {
                name: 'The status lamp blinks',
                text: 'A green status lamp in every column’s corner blinks on and off.',
            },
            {
                name: 'The activity LEDs',
                text: 'A row of activity lights chases along the foot of every column.',
            },
        ],
        arrival: [
            {
                name: 'Flipped in',
                text: 'Each figure flips down into place in four hard steps, one column after the other, like a split flap.',
            },
            {
                name: 'Slid into the rack',
                text: 'Each column slides in from the left in three hard steps, like a unit into its rack.',
            },
            {
                name: 'Read out',
                text: 'Every figure is printed from the left in six hard steps, all at once.',
            },
        ],
        tone: [
            {
                name: 'The flap tag',
                text: 'The change on a tag with small corners in its status colour, with the package’s arrows.',
            },
            {
                name: 'Signed in mono',
                text: 'The change in the mono with a plain + or − before it, on a square plate.',
            },
            {
                name: 'The LED',
                text: 'The change on a round lamp-shaped plate with a dark ring round it, the arrows small.',
            },
        ],
        live: [
            {
                name: 'The flap turns',
                text: 'A figure that changed flips over like a split flap, in four hard steps.',
            },
            {
                name: 'Reverse video',
                text: 'A figure that changed shows in reverse video for a moment, then turns back.',
            },
            {
                name: 'Rolled up',
                text: 'The new figure rolls up into its window, slowing as it lands.',
            },
        ],
    },
    cyberpunk: {
        shape: [
            {
                name: 'The ticker rail',
                text: 'A neon ticker: a glowing magenta rail above and below the strip, the columns parted by a `//` before each head, the figures in tech mono with a cyan halo.',
            },
            {
                name: 'The data shards',
                text: 'Each figure a shard with two cut corners and a neon edge, its head on a magenta tab.',
            },
            {
                name: 'The HUD brackets',
                text: 'Each figure held by four neon corner brackets of a head-up display, nothing else drawn, the figures with a cyan halo.',
            },
        ],
        loading: [
            {
                name: 'A packet on the rail',
                text: 'A packet of light runs along the foot of every column.',
            },
            {
                name: 'The glitch line',
                text: 'A glitch line jumps across every column in hard steps.',
            },
            {
                name: 'Data rain',
                text: 'A band of thin cyan streaks falls through every column.',
            },
        ],
        arrival: [
            {
                name: 'Glitched in',
                text: 'Each figure glitches into place, torn and shifted in four hard steps, one column after the other.',
            },
            {
                name: 'Decoded',
                text: 'Every figure is decoded from the left, character by character, all at once.',
            },
            {
                name: 'Jacked in',
                text: 'Each column snaps in from the left in two hard steps, one after the other.',
            },
        ],
        tone: [
            {
                name: 'The square chip',
                text: 'The change on a square chip in its status colour, with the package’s arrows.',
            },
            {
                name: 'The chevrons',
                text: 'The change on a square chip with double chevrons » and « in the mono.',
            },
            {
                name: 'The neon edge',
                text: 'The change on a square chip with a neon outline and a + or − in the mono.',
            },
        ],
        live: [
            {
                name: 'Glitched',
                text: 'A figure that changed glitches, torn and shifted for a moment.',
            },
            {
                name: 'Reverse video',
                text: 'A figure that changed shows inverted for a moment.',
            },
            {
                name: 'Shaken',
                text: 'A figure that changed jitters sideways in hard steps.',
            },
        ],
    },
    synthwave: {
        shape: [
            {
                name: 'The cassette counter',
                text: 'A tape deck: every number in a sunken counter window, every head on a cassette label between a pink and a cyan stripe.',
            },
            {
                name: 'The arcade scoreboard',
                text: 'A high-score table on the night sky: a rank (01, 02, …) before every head, a pink rule under the heads, the figures lit in cyan.',
            },
            {
                name: 'The sunset grid',
                text: 'Each figure on a panel with the neon floor grid running along its foot, a thin frame, the figure with a cyan glow.',
            },
        ],
        loading: [
            {
                name: 'The tape’s teeth',
                text: 'The teeth of the tape reel turn along every column.',
            },
            {
                name: 'The screen rolls',
                text: 'A band rolls down every column, as an old screen losing its hold.',
            },
            {
                name: 'The sun rises',
                text: 'A striped neon sun rises through every column.',
            },
        ],
        arrival: [
            {
                name: 'The score counts up',
                text: 'Each figure rolls up into its window in six hard steps, one column after the other.',
            },
            {
                name: 'Dropped in',
                text: 'Each column drops in from above in four hard steps, like pixels landing.',
            },
            {
                name: 'Flipped over',
                text: 'Every figure flips into place together, slowing as it lands.',
            },
        ],
        tone: [
            {
                name: 'The counter tag',
                text: 'The change on a tag with small corners, with the package’s arrows.',
            },
            {
                name: 'The score chip',
                text: 'The change on a square chip in the mono, ↑ and ↓ before it.',
            },
            {
                name: 'The neon pill',
                text: 'The change on a round pill with a cyan halo round it.',
            },
        ],
        live: [
            {
                name: 'The counter rolls',
                text: 'The new figure rolls up into its window in hard steps, as a tape counter turns.',
            },
            {
                name: 'Flipped',
                text: 'A figure that changed flips over once.',
            },
            {
                name: 'A neon ring',
                text: 'A ring of neon opens around a figure that changed and is gone.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                name: 'The paint swatches',
                text: 'A row of paint chips: each figure on a card with a band of its column’s colour across the top, the heads in sentence case.',
            },
            {
                name: 'The sticky notes',
                text: 'A row of sticky notes in each column’s tint, set a little askew with a flat shadow and the bottom corner folded.',
            },
            {
                name: 'The macarons',
                text: 'Each figure on a round-cornered plate in a light tint of its column’s colour, centred, the heads in sentence case.',
            },
        ],
        loading: [
            {
                name: 'A sheen on the band',
                text: 'A sheen crosses the top of every column.',
            },
            {
                name: 'A sheen on the note',
                text: 'A wide sheen crosses every column from top to foot.',
            },
            {
                name: 'Bubbles rise',
                text: 'A row of soft bubbles rises through every column.',
            },
        ],
        arrival: [
            {
                name: 'Bounced in',
                text: 'Each column pops up from smaller with a soft bounce, one after the other.',
            },
            {
                name: 'Stuck on',
                text: 'Each column swings in from its top corner as a note stuck on, one after the other.',
            },
            {
                name: 'Rising softly',
                text: 'Every figure rises into its line together, slowing as it lands.',
            },
        ],
        tone: [
            {
                name: 'The pill',
                text: 'The change on a round pill in its status colour, with the package’s arrows.',
            },
            {
                name: 'The soft square',
                text: 'The change on a soft square with round arrows ↑ and ↓.',
            },
            {
                name: 'The candy',
                text: 'The change on a round pill with a white ring round it, like a sweet.',
            },
        ],
        live: [
            {
                name: 'A little wiggle',
                text: 'A column whose figure changed wiggles once, like a note in a draught.',
            },
            {
                name: 'A ring',
                text: 'A soft ring opens around a figure that changed and is gone.',
            },
            {
                name: 'Popped',
                text: 'The new figure pops from larger, with a soft bounce.',
            },
        ],
    },
    terminal: {
        shape: [
            {
                name: 'The df -h table',
                text: 'A framed text table as df(1) prints it: a frame and column rules in the phosphor’s dim ink, a dashed rule under the heads, everything in the mono.',
            },
            {
                name: 'The tmux status bar',
                text: 'The strip a run of tmux status segments in reverse video with arrow ends, every other one in the second colour.',
            },
            {
                name: 'The prompt listing',
                text: 'No frames: every head after a > prompt, a dashed rule over the strip, everything in the mono, the figures in plain weight.',
            },
        ],
        loading: [
            {
                name: 'The block cursor',
                text: 'A block cursor blinks in every column where the figure will be.',
            },
            {
                name: 'The band',
                text: 'A band runs through every column in six hard steps.',
            },
            {
                name: 'The hash bar',
                text: 'A bar of # fills along the foot of every column, block by block.',
            },
        ],
        arrival: [
            {
                name: 'Printed',
                text: 'Every figure is printed from the left, character by character, column after column.',
            },
            {
                name: 'Line by line',
                text: 'Each figure appears at once, one column after the other, as lines on a slow link.',
            },
            {
                name: 'Scrolled up',
                text: 'Every figure scrolls up into its line in three hard steps.',
            },
        ],
        tone: [
            {
                name: 'The square block',
                text: 'The change on a square block in its status colour, with the package’s arrows.',
            },
            {
                name: 'Signed',
                text: 'The change on a square block with a plain + or −, as a diff prints it.',
            },
            {
                name: 'The bracket',
                text: 'The change in square brackets on its block, [+ …] or [- …].',
            },
        ],
        live: [
            {
                name: 'Reverse video',
                text: 'A figure that changed shows in reverse video for a moment.',
            },
            {
                name: 'Retyped',
                text: 'The new figure is typed in from the left, character by character.',
            },
            {
                name: 'The underscore',
                text: 'A figure that changed gets a blinking underscore under it, three times.',
            },
        ],
    },
    forest: {
        shape: [
            {
                name: 'The trail markers',
                text: 'Each figure a rounded wooden post with a painted blaze in its column’s colour, standing on a line of soil; heads in serif italic, centred.',
            },
            {
                name: 'The specimen mounts',
                text: 'Each figure a herbarium sheet held by four photo corners, its head in a ruled specimen box in small capitals, the words in italics.',
            },
            {
                name: 'The tree rings',
                text: 'Each figure on a slice of wood: fine growth rings from one corner, a soft frame, the heads in the display face.',
            },
        ],
        loading: [
            {
                name: 'The row is planted',
                text: 'The waiting column’s skeleton lines are the bar’s planted row: seedlings, then whole trees filling it start to end.',
            },
            {
                name: 'A seed rolls',
                text: 'A seed rolls along the foot of every column in eight steps.',
            },
            {
                name: 'A leaf falls',
                text: 'A leaf drifts down through every column.',
            },
        ],
        arrival: [
            {
                name: 'Growing',
                text: 'Every figure grows up into its line, slowly, slowing as it lands.',
            },
            {
                name: 'Hung on the post',
                text: 'Each column swings in from above as a sign hung on a post, one after the other.',
            },
            {
                name: 'Unfolding',
                text: 'Each column unfolds from its middle like a leaf, all together.',
            },
        ],
        tone: [
            {
                name: 'The painted blaze',
                text: 'The change on a tag with small round corners, with the package’s arrows.',
            },
            {
                name: 'The field note',
                text: 'The change on a square tag set in italics, with ↑ and ↓.',
            },
            {
                name: 'The pebble',
                text: 'The change on a round pebble with a soft shadow under it.',
            },
        ],
        live: [
            {
                name: 'A growth ring',
                text: 'A thin ring is drawn once round a column whose figure changed, clockwise from the top, then fades; the figure never moves.',
            },
            {
                name: 'Grown in',
                text: 'The new figure grows up into its line.',
            },
            {
                name: 'Underlined',
                text: 'A figure that changed is underlined in green for a moment, the line growing.',
            },
        ],
    },
    'high-contrast': {
        shape: [
            {
                name: 'The ruled grid',
                text: 'One table in 2px rules: a frame, a rule between the columns and a rule under the heads, the heads bold, the figures heavy.',
            },
            {
                name: 'The inverse heads',
                text: 'Each figure framed in 2px with its head on an ink band across the top of the frame, the figure heavy on the paper under it.',
            },
            {
                name: 'The heavy underline',
                text: 'No frames: each figure stands on a 4px ink rule, the heads bold in sentence case, the figures extra heavy.',
            },
        ],
        loading: [
            {
                name: 'The stepping bar',
                text: 'A 4px ink bar steps along the foot of every column in four hard steps.',
            },
            {
                name: 'The block cursor',
                text: 'An ink block blinks where the figure will be, hard on and off.',
            },
            {
                name: 'The tally',
                text: 'Ink tally marks are counted along the foot of every column, one by one.',
            },
        ],
        arrival: [
            {
                name: 'Wiped in',
                text: 'Every figure is wiped in from the left in four hard steps, column after column.',
            },
            {
                name: 'Dropped',
                text: 'Each column drops into place in two hard steps.',
            },
            {
                name: 'Typed',
                text: 'Every figure is typed from the left in six hard steps, all at once.',
            },
        ],
        tone: [
            {
                name: 'The framed plate',
                text: 'The change on a square plate in its status colour, framed in 2px ink, with the arrows.',
            },
            {
                name: 'The bold sign',
                text: 'The change on a square plate, bold, with a heavy + or −.',
            },
            {
                name: 'The underlined plate',
                text: 'The change on a square plate with a 3px ink rule under it and the arrows.',
            },
        ],
        live: [
            {
                name: 'Inverted',
                text: 'A figure that changed shows inverted, ink on paper turned round, for a moment.',
            },
            {
                name: 'Framed',
                text: 'A heavy ring opens around a figure that changed and is gone.',
            },
            {
                name: 'Underlined',
                text: 'A figure that changed is underlined in heavy ink for a moment.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                name: 'The typewriter tab stops',
                text: 'A typewriter’s scale along the top of the strip with a tab stop over every column, the heads typed and underlined, everything in the typewriter face.',
            },
            {
                name: 'The card catalogue',
                text: 'A library card catalogue: each figure a drawer front, its head in a brass label holder, a pull ring in the corner.',
            },
            {
                name: 'The index card',
                text: 'Each figure on a ruled index card: a red line under the head, faint blue lines under the words, a thin frame.',
            },
        ],
        loading: [
            {
                name: 'The carriage steps',
                text: 'The typewriter’s carriage steps along every column in ten stops.',
            },
            {
                name: 'A drawer slides out',
                text: 'A shade slides up every column from its foot, as a drawer pulled out and pushed back.',
            },
            {
                name: 'The ink spreads',
                text: 'A blot of ink spreads from the middle of every column.',
            },
        ],
        arrival: [
            {
                name: 'Typed',
                text: 'Every figure is typed in from the left, key by key, column after column.',
            },
            {
                name: 'The drawer pushed in',
                text: 'Each column slides in from the left, slowing as it lands.',
            },
            {
                name: 'Rubber-stamped',
                text: 'Every figure is stamped in from larger in two hard steps.',
            },
        ],
        tone: [
            {
                name: 'The typed tag',
                text: 'The change on a square tag in its status colour, with the arrows.',
            },
            {
                name: 'The brass tag',
                text: 'The change on a tag with small corners and a sunk edge, with the arrows.',
            },
            {
                name: 'Plus and minus typed',
                text: 'The change in the typewriter face with a typed + or −, on a square tag.',
            },
        ],
        live: [
            {
                name: 'Struck over',
                text: 'The old figure is struck through with x’s, then the new one is typed in.',
            },
            {
                name: 'Retyped',
                text: 'The new figure is typed in from the left, key by key.',
            },
            {
                name: 'Restamped',
                text: 'The new figure is stamped in from larger in two hard steps.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                name: 'The dimension chain',
                text: 'A chain of dimension lines with end ticks over the columns, each tile a drawn box, the heads in technical mono capitals.',
            },
            {
                name: 'The bill of materials',
                text: 'A parts list: a ruled table, each head with its item number in a balloon, the columns parted by rules.',
            },
            {
                name: 'The title block',
                text: 'The strip as the title block of a drawing: butted cells in thin rules, a letter (A, B, …) in each cell’s corner, the heads in mono capitals.',
            },
        ],
        loading: [
            {
                name: 'The centre line marches',
                text: 'A dashed centre line marches along the foot of every column.',
            },
            {
                name: 'The scan',
                text: 'A scan crosses every column.',
            },
            {
                name: 'The construction line',
                text: 'A thin construction line drops through every column.',
            },
        ],
        arrival: [
            {
                name: 'Drafted',
                text: 'Every figure is drawn in from the left at an even pace, column after column.',
            },
            {
                name: 'Rolled out',
                text: 'Each column unrolls from its middle, like a sheet taken from the tube.',
            },
            {
                name: 'Lettered',
                text: 'Every figure is lettered in from the left in six steps, all at once.',
            },
        ],
        tone: [
            {
                name: 'The square tag',
                text: 'The change on a square tag in its status colour, with the arrows.',
            },
            {
                name: 'The tolerance',
                text: 'The change written as a tolerance: + or − in the mono, on a square tag.',
            },
            {
                name: 'The revision triangle',
                text: 'The change on a square tag framed in a thin rule, with an open triangle △ or ▽.',
            },
        ],
        live: [
            {
                name: 'The revision ring',
                text: 'A ring is drawn around a figure that changed, like a revision mark, and is gone.',
            },
            {
                name: 'Underlined',
                text: 'A figure that changed is underlined for a moment, the line drawn under it.',
            },
            {
                name: 'Turned over',
                text: 'A figure that changed turns over once, like a sheet flipped on the table.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                name: 'The horizon',
                text: 'The figures stand on a warm horizon line that glows, the light rising from it behind each column.',
            },
            {
                name: 'The lanterns',
                text: 'A string across the top of the strip with each figure a rounded lantern hung from it, glowing warm from its top, centred.',
            },
            {
                name: 'The sundial',
                text: 'Each figure under the arc of a sundial drawn on its plate, the plate rounded at the top, centred.',
            },
        ],
        loading: [
            {
                name: 'The light breathes',
                text: 'The glow behind every column grows from the horizon and sinks back.',
            },
            {
                name: 'The lanterns breathe',
                text: 'The warm glow from the top of every column swells and settles.',
            },
            {
                name: 'The sun crosses',
                text: 'A small sun crosses every column on its way.',
            },
        ],
        arrival: [
            {
                name: 'Sunrise',
                text: 'Every figure rises slowly into its line, slowing as it lands, column after column.',
            },
            {
                name: 'The lanterns hung',
                text: 'Each column swings in from above, as a lantern hung on its string.',
            },
            {
                name: 'Warmly popped',
                text: 'Each column pops up from smaller, softly, all together.',
            },
        ],
        tone: [
            {
                name: 'The warm pill',
                text: 'The change on a round pill in its status colour, with the arrows.',
            },
            {
                name: 'The glowing pill',
                text: 'The change on a round pill with a warm glow round it.',
            },
            {
                name: 'The sun and moon',
                text: 'The change on a round pill with ☀ for up and ☾ for down.',
            },
        ],
        live: [
            {
                name: 'Risen',
                text: 'The new figure rises into its line, slowly.',
            },
            {
                name: 'A halo',
                text: 'A warm halo opens around a figure that changed and is gone.',
            },
            {
                name: 'The lantern sways',
                text: 'A column whose figure changed sways once on its string.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                name: 'The poster grid',
                text: 'The columns butted together under thick black rules with a hard offset shadow, every other column on the accent plate, the heads heavy.',
            },
            {
                name: 'The ticket stubs',
                text: 'Each figure a ticket with notches bitten from its sides, a perforated edge down its left and a heavy outline.',
            },
            {
                name: 'The label stack',
                text: 'Each figure in a 3px box with a hard shadow, its head reversed out of a black band across the top.',
            },
        ],
        loading: [
            {
                name: 'The bar stamps',
                text: 'A black bar stamps down at the foot of every column, hard.',
            },
            {
                name: 'The accent stamps',
                text: 'An accent block stamps over the head of every column, hard.',
            },
            {
                name: 'The marching block',
                text: 'A black square marches across every column in five hard steps.',
            },
        ],
        arrival: [
            {
                name: 'Stamped',
                text: 'Every figure is stamped in from larger in two hard steps, column after column.',
            },
            {
                name: 'Slammed down',
                text: 'Each column slams down from above in two hard steps.',
            },
            {
                name: 'Shoved in',
                text: 'Each column is shoved in from the left in two hard steps, all at once.',
            },
        ],
        tone: [
            {
                name: 'The boxed plate',
                text: 'The change on a square plate framed in 2px black, with the arrows.',
            },
            {
                name: 'The hard shadow',
                text: 'The change on a square plate with a hard black shadow, heavy, + or −.',
            },
            {
                name: 'The arrow block',
                text: 'The change on a square plate with heavy arrows ⬆ and ⬇, in capitals.',
            },
        ],
        live: [
            {
                name: 'Restamped',
                text: 'The new figure is stamped in from larger in two hard steps.',
            },
            {
                name: 'Inverted',
                text: 'A figure that changed shows reversed out of black for a moment.',
            },
            {
                name: 'Shaken',
                text: 'A column whose figure changed shakes sideways in hard steps.',
            },
        ],
    },
    deco: {
        shape: [
            {
                name: 'The floor indicator',
                text: 'A lift’s floor dial: a gold arc with a fan of rays over every figure, the heads in the display face’s spaced capitals, centred.',
            },
            {
                name: 'The colonnade',
                text: 'Fluted gold pilasters in the gaps between the columns, each figure under a stepped double capital.',
            },
            {
                name: 'The sunburst panel',
                text: 'Each figure on a panel with a faint gold sunburst rising from its foot, a thin gold frame, the heads in widely spaced capitals, centred.',
            },
        ],
        loading: [
            {
                name: 'A glint runs across',
                text: 'A gold glint runs across every column.',
            },
            {
                name: 'The rays fan out',
                text: 'A fan of gold rays opens from the foot of every column.',
            },
            {
                name: 'The dial’s needle',
                text: 'A gold needle swings across every column and back, like the lift’s floor dial.',
            },
        ],
        arrival: [
            {
                name: 'Drawn in gold',
                text: 'Every figure is drawn in from the left, easing in and out, column after column.',
            },
            {
                name: 'The doors open',
                text: 'Each column opens from its middle like lift doors, all together.',
            },
            {
                name: 'Rising',
                text: 'Every figure rises into its line, slowing as it lands, column after column.',
            },
        ],
        tone: [
            {
                name: 'The square plaque',
                text: 'The change on a square plaque in its status colour, with the arrows.',
            },
            {
                name: 'The gold-edged plaque',
                text: 'The change on a square plaque with a gold rule round it and spaced figures.',
            },
            {
                name: 'The chevron',
                text: 'The change on a square plaque with a deco chevron ⌃ or ⌄.',
            },
        ],
        live: [
            {
                name: 'A gold underline',
                text: 'A figure that changed is underlined in gold for a moment, the line growing.',
            },
            {
                name: 'The floor turns',
                text: 'A figure that changed turns over like the number in a lift’s window.',
            },
            {
                name: 'A gold ring',
                text: 'A gold ring opens around a figure that changed and is gone.',
            },
        ],
    },
    phantom: {
        shape: [
            {
                name: 'The red-string board',
                text: 'Each figure a card pinned to the board, a red string running from pin to pin across the strip, the cards set a little askew.',
            },
            {
                name: 'The case files',
                text: 'Each figure a folder with a tab standing up from its top corner, the file number on the tab (FILE 01, 02, …).',
            },
            {
                name: 'The redacted dossier',
                text: 'No frames: a heavy rule over the strip, every head after a black redaction bar, everything in the mono, the heads in spaced capitals.',
            },
        ],
        loading: [
            {
                name: 'The pins beat',
                text: 'The red pin at the top of every column swells and settles like a heartbeat.',
            },
            {
                name: 'The folders shuffle',
                text: 'Hatching runs through every column, as folders shuffled in a drawer.',
            },
            {
                name: 'The flashlight',
                text: 'A torch’s beam searches across every column.',
            },
        ],
        arrival: [
            {
                name: 'Pinned up',
                text: 'Each column swings in from its pin, one after the other.',
            },
            {
                name: 'Typed into the report',
                text: 'Every figure is typed in from the left, column after column.',
            },
            {
                name: 'A card turned over',
                text: 'Each column turns over like a card on the table, all together.',
            },
        ],
        tone: [
            {
                name: 'The evidence tag',
                text: 'The change on a square tag in its status colour, with the arrows.',
            },
            {
                name: 'The case number',
                text: 'The change in the mono with + or −, on a square tag in capitals.',
            },
            {
                name: 'The circled clue',
                text: 'The change circled like a clue: a round frame in red ink round its plate.',
            },
        ],
        live: [
            {
                name: 'Redacted and rewritten',
                text: 'The old figure is struck out, then the new one written in.',
            },
            {
                name: 'A shiver',
                text: 'A figure that changed shivers sideways for a moment.',
            },
            {
                name: 'Inverted',
                text: 'A figure that changed shows inverted, like a negative, for a moment.',
            },
        ],
    },
    retro: {
        shape: [
            {
                name: 'The status bar',
                text: 'A 1995 status bar: a raised grey bar holding a sunken pane per figure, the heads in the system face without capitals.',
            },
            {
                name: 'The list view',
                text: 'A 1995 list view: each head a raised column-header button, the figure in the white list under it, the whole set in a sunken frame.',
            },
            {
                name: 'The group box',
                text: 'A 1995 group box: each figure in an etched frame, the head in the system face in sentence case.',
            },
        ],
        loading: [
            {
                name: 'The progress blocks',
                text: 'A 1995 progress bar fills along the foot of every column, block by block.',
            },
            {
                name: 'The marquee',
                text: 'A block runs along the foot of every column in hard steps, the marquee bar.',
            },
            {
                name: 'The flying page',
                text: 'A small page hops across the top of every column, the copy dialog’s sheet.',
            },
        ],
        arrival: [
            {
                name: 'Painted',
                text: 'Every figure is painted in from the left in four hard steps, column after column.',
            },
            {
                name: 'Dropped',
                text: 'Each column drops in from above in three hard steps.',
            },
            {
                name: 'Progress',
                text: 'Every figure fills in from the left in eight hard steps, all at once.',
            },
        ],
        tone: [
            {
                name: 'The flat tag',
                text: 'The change on a square tag in its status colour, with the arrows.',
            },
            {
                name: 'The raised button',
                text: 'The change on a raised tag with a light top-left and dark bottom-right edge.',
            },
            {
                name: 'The sunken field',
                text: 'The change in a sunken field, + or −, as a 1995 dialog shows a value.',
            },
        ],
        live: [
            {
                name: 'Selected',
                text: 'A figure that changed is highlighted as a selection for a moment.',
            },
            {
                name: 'Repainted',
                text: 'The new figure is painted in from the left in hard steps.',
            },
            {
                name: 'Flipped',
                text: 'A figure that changed flips over in hard steps.',
            },
        ],
    },
    grotesk: {
        shape: [
            {
                name: 'The numbered grid',
                text: 'A Swiss grid: a heavy rule over the strip, a hairline over every column, the column number (01, 02, …) in its corner, the figures bold and flush left.',
            },
            {
                name: 'The line colours',
                text: 'Each figure topped by a thick flat block in its column’s colour, like the lines on a transit map, the heads bold in sentence case.',
            },
            {
                name: 'The big numerals',
                text: 'No frames: a hairline over the strip, the figures very large and very bold with tight spacing, the heads bold in sentence case.',
            },
        ],
        loading: [
            {
                name: 'A line runs across',
                text: 'A black line runs across the top of every column.',
            },
            {
                name: 'The blocks fill in',
                text: 'A block in the column’s colour fills every column in four steps.',
            },
            {
                name: 'A square steps the grid',
                text: 'A black square steps across every column on the grid.',
            },
        ],
        arrival: [
            {
                name: 'Slid in',
                text: 'Each column slides in from the left, hard and fast, one after the other.',
            },
            {
                name: 'Wiped in',
                text: 'Every figure is wiped in from the left, fast, all together.',
            },
            {
                name: 'Rising on the grid',
                text: 'Every figure rises into its line in three hard steps, column after column.',
            },
        ],
        tone: [
            {
                name: 'The flat block',
                text: 'The change on a square block in its status colour, with the arrows.',
            },
            {
                name: 'Signed, bold',
                text: 'The change on a square block, bold, with + or −.',
            },
            {
                name: 'The arrow',
                text: 'The change on a square block with a plain arrow → turned up or down: ↗ or ↘.',
            },
        ],
        live: [
            {
                name: 'Inverted',
                text: 'A figure that changed shows inverted for a moment.',
            },
            {
                name: 'Risen',
                text: 'The new figure rises into its line, fast.',
            },
            {
                name: 'Underlined',
                text: 'A figure that changed is underlined for a moment, the rule growing under it.',
            },
        ],
    },
    nostromo: {
        shape: [
            {
                name: 'The readout bank',
                text: 'A bank of screen readouts: each figure a segment of glass with corner brackets, its head on an inverse tape, all in the mono.',
            },
            {
                name: 'The bulkhead',
                text: 'A bulkhead: hazard chevrons along the foot of the strip, each figure on a riveted plate, the heads stencilled in heavy spaced capitals.',
            },
            {
                name: 'The CRT screen',
                text: 'Each figure on a small rounded screen with scan lines, the figure glowing, everything in the mono.',
            },
        ],
        loading: [
            {
                name: 'The sweep rolls',
                text: 'A sweep rolls down every screen.',
            },
            {
                name: 'The chevrons march',
                text: 'Hazard chevrons march through every column.',
            },
            {
                name: 'The sonar ring',
                text: 'A ring grows from the middle of every column, the motion tracker’s ping.',
            },
        ],
        arrival: [
            {
                name: 'Printed out',
                text: 'Every figure is printed from the left, character by character, column after column.',
            },
            {
                name: 'Glitched in',
                text: 'Every figure glitches into place, torn and shifted, all together.',
            },
            {
                name: 'Flipped in',
                text: 'Each figure flips down into place in hard steps, column after column.',
            },
        ],
        tone: [
            {
                name: 'The square tag',
                text: 'The change on a square tag in its status colour, with the arrows.',
            },
            {
                name: 'The stencil',
                text: 'The change in heavy spaced capitals with + or −, on a square tag.',
            },
            {
                name: 'The bracketed readout',
                text: 'The change in the mono with a bracket mark ‹ › round its arrow, on a square tag.',
            },
        ],
        live: [
            {
                name: 'Glitched',
                text: 'A figure that changed glitches, torn and shifted for a moment.',
            },
            {
                name: 'Inverted',
                text: 'A figure that changed shows on an inverse tape for a moment.',
            },
            {
                name: 'Reprinted',
                text: 'The new figure is printed in from the left, character by character.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                name: 'The anodised bars',
                text: 'A brushed plate per figure with an anodised edge in its column’s colour, the heads in small capitals, the figures in instrument mono.',
            },
            {
                name: 'The machined bezels',
                text: 'Each figure cut as a chamfered plate, the number behind a chamfered bezel with an inner shadow.',
            },
            {
                name: 'The milled bar',
                text: 'The strip one brushed bar in a thin frame, the columns parted by milled grooves, the heads in small capitals, the figures in instrument mono.',
            },
        ],
        loading: [
            {
                name: 'Light rises along the edge',
                text: 'A light rises along the coloured edge of every column.',
            },
            {
                name: 'The grain runs',
                text: 'The brushed grain runs along every column.',
            },
            {
                name: 'The cutting pass',
                text: 'A machined pass sweeps diagonally across every column.',
            },
        ],
        arrival: [
            {
                name: 'Machined up',
                text: 'Every figure rises into its line, slowing as it lands, column after column.',
            },
            {
                name: 'Slid into the rail',
                text: 'Each column slides in from the left on its rail, one after the other.',
            },
            {
                name: 'Etched',
                text: 'Every figure is etched in from the left, at an even pace, all together.',
            },
        ],
        tone: [
            {
                name: 'The small tag',
                text: 'The change on a tag with small corners in its status colour, with the arrows.',
            },
            {
                name: 'The square tag',
                text: 'The change on a square tag in the instrument mono, + or −.',
            },
            {
                name: 'The chamfered tag',
                text: 'The change on a tag with a bevelled edge: a light top and a dark foot.',
            },
        ],
        live: [
            {
                name: 'Risen',
                text: 'The new figure rises into its line.',
            },
            {
                name: 'Flipped',
                text: 'A figure that changed turns over once, like a dial’s wheel.',
            },
            {
                name: 'A ring',
                text: 'A thin ring opens around a figure that changed and is gone.',
            },
        ],
    },
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="columns"]'));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// five choices per theme, each option's name and what it does as its hint.
// Nothing is ticked for the reviewer.
const hints = (/** @type {Aspect} */ aspect, /** @type {number} */ at) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, idea]) => [theme, `${idea[aspect][at].name}. ${idea[aspect][at].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        ASPECTS.map(({ id, label }) => ({
            id,
            label,
            options: [0, 1, 2].map((at) => ({ value: String(at + 1), label: String(at + 1), hints: hints(id, at) })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const [theme, idea] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Five picks, each on its own. Shapes 1 and 2 are round 1's ${idea.shape[0].name.replace(/^(The|A|One) /, (m) => m.toLowerCase())} and ${idea.shape[1].name.replace(/^(The|A|One) /, (m) => m.toLowerCase())}; ` +
        `shape 3 is new. Each row changes one thing only; the preview at the top shows what you ticked so far. ` +
        'Press Drawn, Loading, Nothing to show, Could not read and Live update at full speed and at ¼, and try a long label, a wide value, many columns and two; the strip keeps its height, and look at the phone pane under each strip.';
    look.append(p);
}

/* ------------------------------------------------ the rows of options */

const stripHtml = (/** @type {string} */ where, /** @type {string} */ label) =>
    `<div class="kp-kpis" data-kp-kpis-columns="all 3 2 1" role="group" aria-label="${label}" data-cl-strip="${where}"></div>`;
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
    for (const at of [1, 2, 3]) {
        const cell = document.createElement('div');
        cell.className = 'cl-col';
        cell.setAttribute('data-cs', '');
        cell.setAttribute('data-cl-vary', id);
        cell.setAttribute('data-cl-option', String(at));
        cell.innerHTML =
            `<div class="cl-words"><p class="cl-label"><span class="cl-label__no">${label} · ${at}</span> <span data-cl-name></span></p>` +
            '<p class="cl-desc" data-cl-desc></p></div>' +
            stripHtml('desk', `Pump house 1 right now, ${label.toLowerCase()} ${at}`) +
            '<p class="cl-pane-name">At phone width (334 px):</p>' +
            `<div class="cl-phone">${stripHtml('phone', `Pump house 1 right now, ${label.toLowerCase()} ${at}, phone width`)}</div>`;
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
const picks = () => /** @type {Record<Aspect, string>} */ (Object.fromEntries(ASPECTS.map(({ id }) => [id, ticked[theme()]?.[id] ?? '1'])));

/** Writes the five aspects on every wrapper: the preview takes the picks, each row's cell its own option in its own aspect. */
function compose() {
    const now = picks();
    const preview = section.querySelector('[data-cs-preview]');
    for (const { id } of ASPECTS) preview?.setAttribute(`data-cs-${id}`, now[id]);
    for (const cell of section.querySelectorAll('[data-cl-vary]')) {
        const vary = cell.getAttribute('data-cl-vary');
        const option = cell.getAttribute('data-cl-option') ?? '1';
        for (const { id } of ASPECTS) cell.setAttribute(`data-cs-${id}`, id === vary ? option : now[id]);
        cell.classList.toggle('cl-picked', ticked[theme()]?.[/** @type {Aspect} */ (vary)] === option);
    }
    const words = section.querySelector('[data-cl-picks]');
    const idea = IDEAS[theme()];
    if (words && idea)
        words.textContent = ASPECTS.map(
            ({ id, label }) => `${label}: ${now[id]}, ${idea[id][Number(now[id]) - 1].name}${ticked[theme()]?.[id] ? '' : ' (not ticked yet)'}`,
        ).join(' · ');
    // A shape asks for its own tile width: let attachKpiStrips() fit again.
    for (const strip of strips()) strip.setAttribute('data-kp-kpis-columns', 'all 3 2 1');
}

// What is ticked in the review dialog is what the preview shows.
section.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: Aspect, value: string }>} */ (event).detail;
    (ticked[theme()] ??= {})[id] = value;
    compose();
});

/* ------------------------------------------------------------ the data */

// Pump house 1 at a fixed now (20/10/2026 14:40 in Brussels); a live update
// moves every figure one step, the same on every load.
/**
 * @typedef {{ label: string, value: number, unit?: string, digits: number, words: string,
 *   delta?: number, upIs?: 'good' | 'bad', step: number }} Figure
 */
/** @type {Record<string, Figure>} */
const F = {
    pressure: { label: 'Pressure', value: 3.12, unit: 'bar', digits: 2, words: 'this hour', delta: 0.04, upIs: 'good', step: -0.01 },
    flow: { label: 'Flow', value: 412, unit: 'm³/h', digits: 0, words: 'this hour', delta: -12, upIs: 'good', step: 6 },
    north: { label: 'Reservoir North', value: 71, unit: '%', digits: 0, words: 'target 80 %', step: 1 },
    south: { label: 'Reservoir South', value: 64, unit: '%', digits: 0, words: 'target 80 %', delta: -2, upIs: 'good', step: -1 },
    incidents: { label: 'Open incidents', value: 2, digits: 0, words: 'one needs a visit', step: 0 },
    late: { label: 'Readings late', value: 1, digits: 0, words: 'pump house 7', step: 0 },
    energy: { label: 'Energy today', value: 1834, unit: 'kWh', digits: 0, words: 'night tariff 22:00', step: 21 },
    visits: { label: 'Visits planned', value: 3, digits: 0, words: 'this week', step: 0 },
    far: {
        label: 'Pressure, far end of the ring',
        value: 2.41,
        unit: 'bar',
        digits: 2,
        words: 'Pleinstraat',
        delta: 0.03,
        upIs: 'good',
        step: -0.01,
    },
    delivered: { label: 'Delivered this year', value: 12_400_550, unit: 'm³', digits: 0, words: 'since 01/01/2026', step: 4120 },
};

/** @type {Record<string, (keyof typeof F)[]>} */
const SETS = {
    five: ['pressure', 'flow', 'north', 'south', 'incidents'],
    long: ['far', 'flow', 'north', 'south', 'incidents'],
    wide: ['pressure', 'delivered', 'north', 'south', 'incidents'],
    many: ['pressure', 'flow', 'north', 'south', 'incidents', 'late', 'energy', 'visits'],
    two: ['pressure', 'flow'],
};

const WORDS = {
    empty: 'no reading yet',
    error: 'could not read',
};

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    set: 'five',
    ticks: 0,
};

const number = (/** @type {Figure} */ f, /** @type {number} */ v) =>
    v.toLocaleString('en-GB', { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits });

/** @param {string} width @param {string} [height] */
const skeleton = (width, height) => {
    const s = document.createElement('span');
    s.className = 'kp-skeleton';
    s.style.inlineSize = width;
    if (height) s.style.setProperty('--kp-skeleton-height', height);
    return s;
};

/** One tile, in the package's markup. @param {Figure} f */
function tile(f) {
    const el = document.createElement('div');
    el.className = 'kp-kpi';
    const label = Object.assign(document.createElement('span'), { className: 'kp-kpi__label', textContent: f.label });
    label.title = f.label;
    const value = Object.assign(document.createElement('span'), { className: 'kp-kpi__value' });
    const words = Object.assign(document.createElement('span'), { className: 'kp-kpi__trend' });
    if (state.shown === 'loading') {
        value.append(skeleton('3ch', '1.75rem'));
        words.append(skeleton('80%'));
    } else if (state.shown !== 'ready') {
        value.textContent = '—';
        words.textContent = WORDS[state.shown];
    } else {
        const v = f.value + state.ticks * f.step;
        value.textContent = number(f, v);
        if (f.unit) value.append(Object.assign(document.createElement('small'), { textContent: f.unit }));
        if (f.delta != null) {
            const d = f.delta + (state.ticks % 2 ? f.step : 0);
            const up = d > 0;
            const delta = document.createElement('span');
            delta.className = 'kp-kpi__delta';
            delta.setAttribute('data-kp-direction', up ? 'up' : 'down');
            delta.setAttribute('data-kp-tone', up === (f.upIs === 'good') ? 'good' : 'bad');
            delta.textContent = `${number(f, Math.abs(d))}${f.unit === '%' ? '%' : f.unit ? ` ${f.unit}` : ''}`;
            words.append(delta, ` ${f.words}`);
        } else words.textContent = f.words;
    }
    el.append(label, value, words);
    return el;
}

const strips = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-cl-strip]')]);

/**
 * Draws every strip. `moment` says what the figures do: "arrive" writes the
 * tiles anew so each arrival plays from its start, "live" rewrites their
 * insides in place and marks the tiles whose figure changed.
 * @param {'arrive' | 'live' | ''} moment
 */
function draw(moment = '') {
    const figures = SETS[state.set].map((key) => F[key]);
    for (const strip of strips()) {
        strip.removeAttribute('data-cs-moment');
        if (state.shown === 'loading') strip.setAttribute('aria-busy', 'true');
        else strip.removeAttribute('aria-busy');
        const tiles = [...strip.children];
        if (moment === 'live' && tiles.length === figures.length)
            figures.forEach((f, at) => {
                const old = tiles[at].querySelector('.kp-kpi__value')?.textContent;
                const fresh = tile(f);
                tiles[at].toggleAttribute('data-cs-changed', fresh.querySelector('.kp-kpi__value')?.textContent !== old);
                tiles[at].replaceChildren(...fresh.childNodes);
            });
        else strip.replaceChildren(...figures.map(tile));
        if (moment) {
            void strip.offsetWidth;
            strip.setAttribute('data-cs-moment', moment);
        }
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

// Drawn always replays the arrival.
for (const b of section.querySelectorAll('[data-cl-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-cl-state') ?? 'ready');
        pressed('data-cl-state', state.shown);
        draw(state.shown === 'ready' ? 'arrive' : '');
    });

for (const b of section.querySelectorAll('[data-cl-data]'))
    b.addEventListener('click', () => {
        state.set = b.getAttribute('data-cl-data') ?? 'five';
        pressed('data-cl-data', state.set);
        draw(state.shown === 'ready' ? 'arrive' : '');
    });

// A live update: ten minutes later, every figure one step on.
section.querySelector('[data-cl-live]')?.addEventListener('click', () => {
    const was = state.shown;
    state.ticks += 1;
    state.shown = 'ready';
    pressed('data-cl-state', 'ready');
    draw(was === 'ready' ? 'live' : 'arrive');
});

compose();
draw('arrive');
attachKpiStrips(section);

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const now = theme();
    for (const el of document.querySelectorAll('[data-cl-theme-name]')) el.textContent = LABEL[now] ?? now;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
    const idea = IDEAS[now];
    for (const cell of section.querySelectorAll('[data-cl-vary]')) {
        const option = idea?.[/** @type {Aspect} */ (cell.getAttribute('data-cl-vary'))]?.[Number(cell.getAttribute('data-cl-option')) - 1];
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
