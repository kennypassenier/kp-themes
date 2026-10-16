// The per-theme "Look at" sentences of research/kpadopt2, one map per judged section.
// Round 5 asks the fifteen non-formal themes; formal keeps its approved lines for the first three maps.

/** What to look at in action tiles, per theme. */
export const ACT = {
    formal: 'An engraved plate with a 3 px corner. Point at a tile: nothing moves, the title takes a 2 px navy underline (the quill). Press and hold: a double navy rule is laid inside the plate (the seal). The destructive tile has a red bar at its start edge and a red title; the disabled one is a quieter plate.',
    light: "Light’s card: the hairline, the small shadow, a 0.5 rem corner. Point at a tile: it settles 2 px toward the paper and its shadow tightens; a press lands it flat and flashes it bright for a moment. The destructive tile carries a 3 px red band along its top and a red title, no red frame and no side bar. Busy shows light’s bead spinner.",
    dark: "Dark’s machined tile: a near-black plate inside the turning film, cut on two opposite corners, never rounded. Point at a tile: the line rests on its start edge (a 2 px slice of film with its glow); a press turns the film a quarter. The destructive tile is the film gone coral along its whole edge, with a coral title. Busy shows dark’s spectrum bars.",
    cyberpunk: "A holo card: the void with a yellow rim glowing inward, scan lines at 135°, the corner cut at the top end; mono capital titles, the read-out line in cyan with its // prefix. Point at a tile: the 14 px circuit lights in one tick; a press lights it full; nothing moves. Focus is drawn inside, so the cut never takes it. The destructive tile is locked as a target: red corner brackets, a red title.",
    synthwave: "The tape: square, the pink to cyan stripe along its top, the sides falling in its colours, no glow on the rim. Point at a tile: in one step the stripe runs pink to white and the display-face title takes its neon. A press charges it: the top edge burns near-white with a bloom above; nothing moves. The destructive tile has a red stripe and the VCR’s stop (a small square) before its title.",
    pastel: "A sticker on its flat plum peel with a plate’s round corner. Point at a tile: it lifts 2 px on a longer peel and its top-end corner curls into a small fold (clear of a link tile’s chevron); a press sticks it down flat. Focus is the dashed plum line. The destructive tile’s title is a red sticker with its own peel.",
    terminal: "A line of htop: no fill, a square bracket at each end in the dim phosphor. Point at a tile: the brackets turn bright with a 1 px ring and the block cursor blinks after the title; a press is reverse video; focus is the dashed box. The destructive tile’s title is printed in reverse in red after “!!”.",
    forest: "A kraft card with the leaf corner (top-end and bottom-start round). Point at a tile: the blaze, a dashed green trail ring 2 px out; a press closes it in to a solid line 1 px out; nothing moves. The sentence is the italic field note. The destructive tile has a short painted red blaze on its start edge and a red title. Busy plants a tree in the corner.",
    blueprint: "A part on the sheet: no fill and no frame, standing on two rulers (its start edge and its foot). Point at a tile: two amber witness lines at its ends; a press draws the amber dimension across its foot with a slash at each end; the ground never changes. The destructive tile is flagged ▲ in red before its title. The read-out line is lettering, sloped mono capitals.",
    solstice: "The charcoal plate lit from below: a rust wash rising from its foot and an amber foot edge. Point at a tile: a small sun rises at its foot with a dome of warm light, below the words; a press blows on the ember, the light swelling inside it; nothing moves. The destructive tile’s sky is red: red wash, red foot, a red serif title. Titles in the serif.",
    brutalism: "The slab: white in a 3 px ink line on a 6 px hard shadow, Archivo Black capitals. Point at a tile: it inverts, ink ground and yellow words, and nothing moves; a press drives it onto its shadow; keyboard focus lifts it off with the ring. The destructive tile is taped off: red and black hazard stripes along its foot and a red title.",
    deco: "A plate of the lobby: blue lacquer with the chevron wallpaper, coved corners and the double gold inlay, Poiret One capitals. Point at a tile: gold leaf warms it and the inlay goes to full gold; a press is the wax seal, a gold ring rippling out; focus is the 3 px double gold ring. The destructive tile’s title is ruby over a gold rule, no side bar. Busy shows the sunburst.",
    phantom: "Cut paper: the card’s plate with its red edge and the corners cut, condensed italic capitals. Point at a tile: a red bar is thrown in behind the title in two cuts and the ink flips to black; the tile does not move. A press drops it 3 px and its face resolves from dots. Focus is the dashed ring inside the cut. The destructive title is stamped on the red plate in black ink, no red frame.",
    grotesk: "A column under its rule: no frame, a 3 px ink rule along the top, the bold Archivo title flush left. Point at a tile: the red baseline is drawn under the title from the start and the tile takes the grey wash; a press thickens the baseline to 4 px in the deeper red; nothing moves. The destructive tile is indexed by a 6 px red bar down its start edge. Titles stay on one line wherever they fit.",
    nostromo: "A switch on the console: raised beige moulding, a lamp before the Michroma title. Point at a tile: the lamp lights; a press pushes the key into a well, lamp full; nothing moves. Keyboard focus lights the lamp as the orange LED inside the ring. The destructive tile sounds the klaxon: framed all round in red.",
    titanium: "A machined plate: square, brushed grain, two corners chamfered, a lit tool edge along its top. Point at a tile: the edge turns bare bright metal at once, nothing eases; a press drops it 1 px. Tab to a tile: the ring runs inside the plate and follows both cut corners, whole. The destructive tile has the red along its top edge and a red title.",
};

/** What to look at in status rows, per theme. */
export const STA = {
    formal: 'Ledger rows ruled underneath, no box: a tick disc, the name in bold, the reason under it. A failed row keeps the red rule under it and a Retry button; an empty row is dashed and quiet.',
    light: "Light’s cards in a grid. A failed row is a white card with a 3 px red band along its top and Retry as light’s pill, no red frame; an empty row is the bare hairline on the paper, no shadow; loading shows light’s bead spinner.",
    dark: "Machined rows on the small cut, square marks, the detail in the ticker mono. A failed row is the coral edge; a loading row is crossed by dark’s comet (the line and its film tail), again and again.",
    cyberpunk: "Square read-outs cut at the end corner, the detail in mono. A failed row is locked as a target: red corner brackets that twitch twice and hold. Loading shows cyberpunk’s signal bars.",
    synthwave: "Square tape rows with a 2 px stripe on top; the detail in cyan OSD letters. A failed row has a red stripe and the stop square before its name; a loading row’s top edge is a marquee, a lit bulb chasing along it.",
    pastel: "White paper rows with the sky second pass beside them. A failed row’s reason is a red sticker with its peel; an empty row is a dashed outline without a pass; marks stand upright. Loading shows the caterpillar circling its day sticker.",
    terminal: "Log lines, all mono, a dashed rule at the start: + ok, x failed, - empty. A failed row says [fail] in red before its name; a loading row has the braille spinner and the block cursor waiting after its reading.",
    forest: "Kraft rows with the small leaf corner, italic notes under the names. A failed row’s reason is a field note, a square red tag; an empty row is dashed; a loading row plants a tree in its mark.",
    blueprint: "Parts on a ruler along their foot, the detail in sloped lettering. A failed row is flagged ▲ in red with a red reason; an empty row has a dashed ruler; loading shows the compass.",
    solstice: "Rows lit faintly from below. A failed row’s sky reddens; an empty row is dashed and unlit; a loading row has the sun’s arc in its mark and a small sun crossing along its foot.",
    brutalism: "Slabs on hard shadows, square marks with a heavy ring, names in bold capitals. A failed row is taped off along its foot; a loading row has the muted ground and the tipping block; an empty row is a dashed line without a shadow.",
    deco: "Each row is a lacquer plate with coves and the gold inlay, square marks. A failed row’s name is ruby over a gold rule; the sunburst spins in a loading row with room beside it.",
    phantom: "Cut-paper rows with a heavy edge, names in condensed italic capitals. A failed row’s name is stamped on the red plate and its edge is red; a loading row has the red edge and the snapping star.",
    grotesk: "Lines of a timetable under a 2 px rule, no box, bold names in sentence case. A failed row is indexed by the red bar down its start; an empty row’s rule is dashed. No row wraps where one line fits.",
    nostromo: "Raised rows with the key’s corner, details on label tape. A failed row is framed all round in red; a loading row has the tape reel and an LED window computing along its foot.",
    titanium: "Chamfered rows with the tool edge, the detail in Martian Mono. A failed row has the red top edge; a loading row sits in the anodising bath, the oxide colours drifting through it, beside the facing-cut spinner.",
};

/** What to look at in the facet list, per theme. */
export const FAC = {
    formal: 'Square-cornered rows. The name is truncated with an ellipsis, the count is right-aligned in tabular figures. Point at a row: a quiet wash and the only button appears; none of it moves the counts.',
    light: "Pill rows that take the menu’s muted wash. Press “Counts are loading”: each count is a soft pill out of focus, breathing between dim and dazzling (light’s loading), and comes back sharp with “Counts arrive”.",
    dark: "Square rows; pointing rests the film line on the row’s start, as on dark’s menu entries. Press “Counts are loading”: each count becomes a dark slot that the comet crosses.",
    cyberpunk: "Square rows; pointing lights the circuit in the row; the title is a cyan /// read-out. Press “Counts are loading”: each count becomes a notched slot whose lock blinks cyan, yellow, cyan in hard ticks.",
    synthwave: "2 px rows; pointing gives a pink wash and the name its neon; the title is ▶ OSD capitals. Press “Counts are loading”: the counts are marquee bulbs, one in four lit, the light chasing down the list.",
    pastel: "Rows with a menu entry’s corner that take the mint wash. Press “Counts are loading”: each count becomes a mint pom-pom, and the hump runs down the list.",
    terminal: "Plain mono rows; pointing brings the cursor ring; the title is a $ label. Press “Counts are loading”: the block cursor blinks where each count will be written.",
    forest: "Rows with the small leaf corner that blaze inside the list when pointed at. Press “Counts are loading”: each count plants a little tree, seedling, sapling, tree, down the list.",
    blueprint: "Pointing reads a row on a scale: amber witness lines at its ends and a ruler along its foot, no wash. Press “Counts are loading”: each count is a section hatched by the pen start to end, standing, then lifted.",
    solstice: "Softly rounded rows; pointing lights the row’s foot in amber. Press “Counts are loading”: each count is a muted pill with the low light crossing it.",
    brutalism: "Square rows that turn into the yellow plate in the ink when pointed at. Press “Counts are loading”: each count becomes a well in the ink line with the lintel hoisted in four hard lifts and dropped.",
    deco: "Square rows warmed by gold leaf when pointed at; the title in very widely spaced capitals. Press “Counts are loading”: each count is two gold hairlines with a glint and its afterglow running between them.",
    phantom: "Pointing throws the red bar in behind a row’s name, the ink black. Press “Counts are loading”: each count is a halftone block with the red slash sweeping across it.",
    grotesk: "Square rows; pointing takes the wash and a red baseline. Press “Counts are loading”: each count is a proof out of register, the red plate travelling clockwise round the black. Names cut with an ellipsis, never wrap.",
    nostromo: "Rows that take the panel’s lighter ground under the hand; counts in mono. Press “Counts are loading”: each count becomes a small LED window whose lamps switch in unordered patterns.",
    titanium: "Square rows; pointing gives the muted ground and a bright edge at once; counts in Martian Mono. Press “Counts are loading”: each count is a small plate in the bath.",
};

/** What to look at in the heat grid, per theme. */
export const HEAT = {
    light: "Cells are small light cards with a hair of shadow. Point at one: it settles 2 px toward the paper; a press flashes it. Loading: every cell out of focus, breathing, in place. The pinned night is the indigo ring.",
    dark: "Square instrument cells with a lighter top edge; pointing rests the cyan line on the cell’s start edge, nothing grows. Loading: every cell is a slot the comet crosses. The pinned night is the film’s cyan ring with its glow.",
    cyberpunk: "Neon tubes in the void, the pick a cyan tube; pointing lights the cell’s tube in yellow. Loading: the cells stand dim and one LOADING is deciphered over the grid and torn away again, never a word per cell.",
    synthwave: "Every cell a 2 px tube lit from inside in its tone; pointing turns the tube up; the pick is a cyan rail pair. Loading: the cells are marquee bulbs, one in four lit, the light chasing across the columns in four hard steps.",
    pastel: "Small stickers with a flat sky pass; pointing lifts a cell 2 px, a press sticks it down; the pinned night is the dashed plum line. Loading: each row of cells becomes one pom-pom caterpillar with its head at the row’s end, the hump running through it, the grid’s height unchanged.",
    terminal: "Square character cells; pointing brings the cursor ring; the pinned night is the dashed box and its day in reverse. Loading: each row of cells becomes one htop row between brackets, lit a cell a step with the cursor at its head, never a cursor in every cell.",
    forest: "Leaf-cornered cells; pointing blazes a cell, a press closes the blaze in; the pinned night is a solid green ring with ▾ over its day; the axis in the note voice. Loading: every cell becomes a small treeline, filling in.",
    blueprint: "Ruled squares in the finished line; pointing turns a cell’s line to the pen’s cyan; the pinned night is the dashed amber datum; names and the axis are sloped lettering. Loading: the pen traces each cell, its nib running round.",
    solstice: "Each cell a small hillside lit from its foot; pointing lights the foot in full amber, nothing moves; the pinned night wears the amber halo; stack names in the serif. Loading: the cells stand muted and the low light crosses each row.",
    brutalism: "Small slabs framed in ink on a hard shadow; pointing lifts a cell up-left off its shadow, a press drives it in; the pinned night is the fat frame. Loading: each row of cells is one well with one lintel hoisted in it, the grid exactly as tall as when ready.",
    deco: "Inlaid cells with a thin gold inlay; pointing turns a cell’s edge to bright gold, a press sinks it under an inner shadow; the pinned night is the double gold ring. Loading: the lift doors part and close on every cell.",
    phantom: "Cut-out cells a degree and a half askew on a deep-red shadow; pointing lifts one, a press drops it; the pinned night is the white frame. Loading: the cells are halftone blocks and one red slash crosses each row.",
    grotesk: "Flat squares with a 2 px gutter; pointing outlines one in the ink; the pinned night is a red rule under it and its day number turns red. Loading: each row of cells is one proof line, the red plate travelling round the black.",
    nostromo: "Vents lit from behind in their tone; pointing lights a vent’s rim; the pinned night has the orange LED tab under it. Loading: every row of cells is one LED window, its lamps switching in unordered patterns, no word in the cells.",
    titanium: "Machined tiles with a lit and a dark edge; pointing lights the tool edge in bright metal; the pinned night is bright metal. Loading: the anodising bath drifts through every tile and every name line.",
};

/** What to look at in the matrix, per theme. */
export const MATRIX = {
    light: "The same small cards as the heat grid, settling 2 px when pointed at; Loading blurs the cells in place, breathing; the names are pills.",
    dark: "The same square cells as the heat grid, the line resting on the start edge when pointed at; Loading is the comet over the slots; the names on the top are in the ticker mono.",
    cyberpunk: "The same neon cells, mono names. Loading: the cells dim and one LOADING is deciphered over the matrix.",
    synthwave: "The same lit tubes; Loading turns the cells into the chasing marquee.",
    pastel: "The same small stickers. Loading: each cell is a mint pom-pom and the last of a row the plum head, the hump running along the row.",
    terminal: "Square cells with the cursor ring. Loading: the cells stand dim and one htop row runs over the matrix on the screen’s ground.",
    forest: "Leaf-cornered cells that blaze when pointed at; Loading turns each cell into the treeline.",
    blueprint: "The same ruled squares and lettering. Loading: the pen traces each cell.",
    solstice: "The same lit cells and halo; Loading: muted cells, one glow crossing the whole matrix.",
    brutalism: "Framed cells on hard shadows that lift when pointed at; Loading: each cell a well with its lintel.",
    deco: "The same inlaid cells and double ring; Loading is the lift doors.",
    phantom: "The same cut-out cells; Loading: halftone cells, each with the red slash.",
    grotesk: "Flat squares, the pinned cell in a heavy ink frame; Loading: each cell a proof out of register.",
    nostromo: "The same lit vents; Loading: each cell a small screen redrawing.",
    titanium: "The same machined tiles; Loading: the bath in every cell.",
};

/** What to look at in the bar in a table cell, per theme. */
export const BARCELL = {
    light: "The bar is light’s flat meter line. Show loading: the bars and the figures go out of focus and breathe (the figure a soft pill), the table’s busy panel shows the bead spinner; nothing moves.",
    dark: "The bar is dark’s machined channel, the figures in the ticker mono. Show loading: the bars and figures are slots the comet crosses, the busy panel shows the spectrum bars.",
    cyberpunk: "Mono figures. Show loading: the table is one picture, the busy panel’s signal bars and its deciphered word over the dimmed rows.",
    synthwave: "Figures in the chrome display face; Show loading puts the table under its busy panel with the setting sun, the ghost lines sheen.",
    pastel: "The bar is pastel’s washi tape. Show loading: every figure becomes a little caterpillar and the busy panel shows the spinner; at 390 px the cards keep their height.",
    terminal: "Mono figures. Show loading: the figures are htop rows lit a cell a step; the busy panel has the braille spinner and its row.",
    forest: "The bar is forest’s routed wood. Show loading: the figures and bars are planting strips, a grove of whole trees walking start to end.",
    blueprint: "The bar is blueprint’s dimension line. Show loading: the figures are pen strokes and the busy panel shows the compass.",
    solstice: "Show loading: the skeleton lines with the low light crossing them and the sun’s arc in the busy panel.",
    brutalism: "Show loading: the figures’ wells with the lintel hoisted, the busy panel’s tipping block.",
    deco: "Show loading: the lift doors in every figure and the busy panel’s sunburst.",
    phantom: "Show loading: halftone blocks with the red slash in the figures; the busy panel’s snapping star.",
    grotesk: "Show loading: every figure a one-line proof, the table keeping its height at 390 px.",
    nostromo: "Mono figures. Show loading: small screens redrawing in the figures, the busy panel’s tape reel.",
    titanium: "Mono figures. Show loading: the figures in the bath, the busy panel’s facing cut.",
};

/** What to look at in the week agenda, per theme. */
export const WEEK = {
    light: "Pills with a hair of shadow, the next run ringed in indigo; day names written as said, no capitals. The line for now is a cyan hairline with a white-ringed bead at its head. Point at a pill: it settles 2 px.",
    dark: "Square slots with the series’ ink on the start edge and a lighter top edge; day names and times in the ticker mono. The line for now is the film’s cyan with its glow; the next run is ringed in cyan.",
    cyberpunk: "HUD read-outs: one notched corner, a hard 3 px bar in the series’ ink on the leading edge, the time in mono; the line for now is yellow. Tab to a pill: the target brackets of focus stay whole around the notch.",
    synthwave: "2 px tape pills with the series’ ink as their top stripe, times in cyan OSD, day names in OSD capitals; the next run has a cyan tube round it; the line for now is a pink laser with a white core.",
    pastel: "Pill stickers on a 2 px plum peel; point at one: it lifts on its peel; the next run has a plum ring; the line for now is plum.",
    terminal: "Program output: no plates, the time in [brackets], dashed rules; the next run in reverse video; the line for now is the bright phosphor with its bloom.",
    forest: "Leaf-cornered pills that blaze when pointed at; the next run has a solid green ring; the line for now is the clay trail mark with its pin.",
    blueprint: "Open frames in the series’ ink with its hatch; times and day names in lettering; the next run has amber witness ticks; the line for now is the pen’s cyan.",
    solstice: "Pills lit from their foot in the series’ light; the next run wears the halo; day names in the serif, sentence case; the line for now carries the sun at its head.",
    brutalism: "Black-framed pills on a hard shadow; pointing lifts a pill, a press drives it in; the next run is the yellow plate; heavy capitals for the days.",
    deco: "Pills drawn as a double rule in the series’ ink; the next run in the double gold ring; days in spaced capitals; the line for now gold with a lozenge at its head.",
    phantom: "Pills lean with the skew in the condensed face; pointing throws the red plate under a pill; the next run is the red plate; the line for now is red with a diamond head.",
    grotesk: "Heavy flat blocks with a 5 px leading rule, never wrapping; day names in Archivo, sentence case; pointing draws the red baseline; the line for now is red.",
    nostromo: "Label tape: mono capitals on a hairline frame; the next run carries a lit LED before its time; the line for now is the LED orange. At 390 px the range’s title stays on one line.",
    titanium: "Chamfered plates in Martian Mono; the next run in bright metal; the line for now blue oxide. Tab to a pill: the ring follows the chamfer and stays whole.",
};

/** What to look at in the crowded week and its +N menu, per theme. */
export const WEEK_CROWD = {
    light: "The +N pill opens light’s own menu, coming into focus out of the glare right under it, white with its shadow.",
    dark: "The +N slot opens dark’s own menu, swept in from under its button, inside the film.",
    cyberpunk: "The +N read-out opens cyberpunk’s own menu, glitched in under it as a holo plate.",
    synthwave: "The +N pill opens synthwave’s own menu, rising over its horizon under the pill.",
    pastel: "The +N pill opens pastel’s own menu, stuck on and swinging down from the corner nearest the pill.",
    terminal: "The +N line opens terminal’s own menu, a curses window printed a line at a time under it.",
    forest: "The +N pill opens forest’s own menu, growing down out of the pill like a root.",
    blueprint: "The +N frame opens blueprint’s own menu, an overlay sheet traced from its corner under the button.",
    solstice: "The +N pill opens solstice’s own menu, kindled from its foot like first light.",
    brutalism: "The +N box opens brutalism’s own menu, dropped onto its footprint under the button.",
    deco: "The +N pill opens deco’s own menu: the inlay draws itself, then the lacquer comes up.",
    phantom: "The +N pill opens phantom’s own menu, thrown in from its button and resolved, an opaque plate.",
    grotesk: "The +N block opens grotesk’s own menu, printed by the colour bands under it.",
    nostromo: "The +N tape opens nostromo’s own menu, struck on like a tube under it.",
    titanium: "The +N plate opens titanium’s own menu, cut from the top edge under it.",
};

/** What to look at in the week agenda’s states, per theme. */
export const WEEK_STATES = {
    light: "The loading week shows light’s table loading card in the middle of the empty days: the bead spinner and the words out of focus, breathing. Empty and failed sentences stand over the grid; the focused pill keeps DI2’s ring whole.",
    dark: "The loading week shows dark’s table loading card in the middle of the empty days: the spectrum bars and the comet crossing the card. The focused pill keeps the ring whole.",
    cyberpunk: "The loading week shows cyberpunk’s table loading card in the middle of the empty days: the signal bars and the words under them. The focused pill wears the target brackets.",
    synthwave: "The loading week shows synthwave’s table loading card in the middle of the empty days: the setting sun and the words. The focused pill keeps its ring whole.",
    pastel: "The loading week shows pastel’s table loading card in the middle of the empty days: the caterpillar round its day sticker, its legs under the card. The focused pill has the dashed plum line.",
    terminal: "The loading week shows terminal’s table loading card in the middle of the empty days: the braille spinner, the words and an htop row with its cursor. The focused pill has the dashed box.",
    forest: "The loading week shows forest’s table loading card in the middle of the empty days: the words with the planting strip at their foot. The focused pill keeps the ring whole.",
    blueprint: "The loading week shows blueprint’s table loading card in the middle of the empty days: the compass and the words. The focused pill keeps its focus ring whole round its open frame.",
    solstice: "The loading week shows solstice’s table loading card in the middle of the empty days: the sun’s arc and the words. Empty and failed sentences over the grid; the focused pill keeps its ring whole.",
    brutalism: "The loading week shows brutalism’s table loading card (the tipping block and the lintel in its well) in the middle of the empty days.",
    deco: "The loading week shows deco’s table loading card (the lift doors and the sunburst) in the middle of the empty days.",
    phantom: "The loading week shows phantom’s table loading card (halftone block, red slash, snapping star) in the middle of the empty days.",
    grotesk: "The loading week shows grotesk’s table loading card (the plate turning clockwise, the proof line) in the middle of the empty days.",
    nostromo: "The loading week shows nostromo’s table loading card (the small screen and the tape reel) in the middle of the empty days.",
    titanium: "The loading week shows titanium’s table loading card (the facing cut and the bath) in the middle of the empty days; the focused pill’s ring follows its chamfer.",
};

/** What to look at in the run timeline, per theme. */
export const GANTT = {
    light: "Capsule bars. A running bar has no stripes: a white-ringed cyan bead runs along it to its growing end and back, as on light’s busy bar. The line for now is cyan with the bead on top. Point at a bar: it settles 2 px.",
    dark: "Square bars. A running bar is a dark slot inside the film, crossed by the comet again and again (the line running its track), no stripes. The line for now is cyan with its glow.",
    cyberpunk: "Bars with a small cut corner. A running bar is a data stream: the void in a yellow rim with cyan dashes feeding through it; a short run stays a bar, not a wedge.",
    synthwave: "A running bar is the road: a dark lane in a pink tube with its white lane dashes racing along it. On a phone the range steps and Live stay on one row.",
    pastel: "Pill bars; a running bar is washi tape whose stripes drift start to end; a queued one a dashed pill.",
    terminal: "Phosphor blocks. A running bar has no stripes: the block cursor stands at its growing end, blinking slowly. On a phone the range steps and Live stay on one row.",
    forest: "Leaf-cornered bars, lane names in italic. A running bar is a planted row: whole trees along it and, at its growing end, a tree being planted in three stages; no stripes. The line for now is clay.",
    blueprint: "Square bars; the plot’s rules are the sheet’s hairlines. A running bar is a cyan chain line (long dash, dot) feeding along its own dimension line.",
    solstice: "Bars lit from below; a running bar is warm with a small sun rising and setting at its growing end; the line for now carries the sun on top. Lane names in the serif.",
    brutalism: "Black-framed bars on hard shadows; a running bar is the lavender plate with the yellow tip at its growing end; nothing glides. On a phone the range steps and Live stay on one row.",
    deco: "Bars with a double rule at both ends. A running bar lies between two gold hairlines with a glint and its afterglow running between them. On a phone the range steps and Live stay on one row.",
    phantom: "Bars lean with the skew. A running bar is the red slab with its halftone dots running along it, never resolving.",
    grotesk: "Heavy flat bars. A running bar is passed by the train: a red mark runs along its foot and dwells at the end, again and again. On a phone the range steps and Live stay on one row.",
    nostromo: "Label-tape bars; a running bar is an LED window computing along its length. On a phone the range steps and Live stay on one row.",
    titanium: "Chamfered bars; a running bar is blue oxide with the film drifting through it at a constant feed. On a phone the range steps and Live stay on one row.",
};

/** What to look at in the run timeline’s states, per theme. */
export const GANTT_STATES = {
    light: "Loading: the ghost bars are out of focus, breathing. The hover card is light’s white card with its shadow, joined under the failed bar.",
    dark: "Loading: the ghost bars are slots the comet crosses. The hover card is dark’s plate inside the film, joined under the failed bar.",
    cyberpunk: "Loading: the ghost bars stand dim and one LOADING is deciphered over the lanes. The hover card is a holo plate joined under the failed bar.",
    synthwave: "Loading: the ghost bars sheen like synthwave’s skeleton lines. The hover card is the tape with the stripe, joined under the failed bar.",
    pastel: "Loading: every ghost bar is a small caterpillar crawling in its lane. The hover card is pastel’s paper card, stuck on under the failed bar.",
    terminal: "Loading: the ghost bars stand dim, and “> Reading the history” is followed by one htop row with its cursor. The hover card is a curses window joined under the failed bar.",
    forest: "Loading: the ghost bars are planting strips. The hover card is forest’s kraft card, grown down from the failed bar.",
    blueprint: "Loading: each ghost bar is a pen stroke and “READING THE HISTORY” is lettered on a framed patch of the sheet, clear of every ghost. Empty and failed sentences stand on the sheet’s ground, no rule through them.",
    solstice: "Loading: the ghost bars as skeleton lines with the low light crossing them, the sentence on the charcoal ground. The hover card is kindled under the failed bar.",
    brutalism: "Loading: the ghost bars are wells with the lintel. The sentence stands on the white ground; the hover card is a slab dropped under the failed bar.",
    deco: "Loading: the lift doors on every ghost bar; the sentence on the lacquer. The hover card is a coved plate with its inlay, under the failed bar.",
    phantom: "Loading: halftone ghost bars with the red slash; the sentence stands on the plate’s own ground. The hover card is cut paper under the failed bar.",
    grotesk: "Loading: proof ghosts out of register; the sentence stands on the paper. The hover card is printed under the failed bar.",
    nostromo: "Loading: the ghost bars are small screens redrawing; the sentence stands on the plate. The hover card is struck on under the failed bar.",
    titanium: "Loading: the ghost bars in the bath; the sentence on the plate. The hover card is cut open under the failed bar.",
};
