// The per-theme "Look at" sentences of research/kpadopt2, one map per judged section.
export const ACT = {
    formal: 'An engraved plate with a 3 px corner. Point at a tile: nothing moves, the title takes a 2 px navy underline (the quill). Press and hold: a double navy rule is laid inside the plate (the seal). The destructive tile has a red bar at its start edge and a red title; the disabled one is a quieter plate.',
    light: 'A white card with a hair of shadow and a round corner. Pointing settles it 1 px toward the paper, a press lands it flat 2 px down with the shadow gone. Check the destructive bar is inside the corner, not over it.',
    dark: 'A machined panel with a square-ish 2 px corner. Pointing lights a thin line of the four chart colours down the start edge, with a faint glow; keyboard focus is an inset double ring, not an outer one. A press is a plain colour step.',
    cyberpunk:
        'A holo plate: a hairline rim, spaced capitals for the title. Pointing lights a 14 px circuit grid over the tile and the rim goes yellow with a glow; the grid must not make the sentence hard to read. A press washes the tile yellow.',
    synthwave:
        'An arcade marquee: a pink frame with a glow, the title in spaced display capitals. Pointing widens the glow; a press dims the tube and drops the tile 1 px. Check the glow stays inside the grid gap and does not touch the next tile.',
    pastel: 'A sticker on a dashed washi outline with its own shadow. Pointing lifts it 2 px on a longer shadow, a press sticks it down. The outline stays dashed in every state.',
    terminal:
        'A cell of the screen, all mono, with a gutter at the start. Pointing writes a green > prompt in the gutter and boxes the tile in a 2 px green outline 3 px out; a press is reverse video (green ground, black type). Nothing eases.',
    forest: 'A herbarium sheet with the leaf corner (top-start and bottom-end square) and an italic title. Pointing lays a dashed trail ring round the tile (the blaze); a press washes it moss. Check the ring follows the leaf corner.',
    blueprint:
        'A drawn box: a dashed frame, mono capitals. Pointing closes the frame to a line and lights an 8 px drafting grid in cyan across the tile; a press is a cyan wash. Keyboard focus keeps a dashed outline.',
    solstice:
        'The horizon: an amber line along the foot of the tile with a warm glow rising from it. Pointing thickens the line to 3 px; a press thins it to 1 px and lowers the tile 1 px.',
    brutalism:
        'A slab: a 3 px black line on a 6 px hard shadow, a lavender tint, heavy capitals. Pointing grows the shadow to 8 px (the tile does not rise); a press drives the slab into its footprint, shadow gone. Focus is a 4 px ink outline.',
    deco: 'Lacquer with a fine gold inlay rule inside the plate, spaced capitals. Pointing brightens the inlay to full gold and the rim to gold; a press sinks the plate 1 px under an inner shadow (the wax seal).',
    phantom:
        'Cut paper: a square slab on a 3 px deep-red shadow, condensed capitals. Pointing throws a red bar in behind the title in two cuts and flips its ink to black; the tile itself does not move. A press drops the slab 3 px onto its shadow.',
    grotesk:
        'A transit board: no frame, a red bar hanging from the top edge. Pointing grows the bar from 6 to 10 px, a press to 14 px (it is an inset shadow, so the tile never changes size). The bold titles must stay on one line where they fit, in every column width.',
    nostromo:
        'An indicator panel: a muted plate with a dark well along its top and mono capital titles. Pointing wakes the console: heavy scanlines over the plate; a press darkens the plate and seats it 1 px. Check the scanlines do not cut through the sentence.',
    titanium:
        'An anodised plate with a 4 px edge along the top. Pointing turns that edge to the primary; every change is instant and linear (metal does not ease). A press keeps the primary edge and lights a hairline on top.',
};

export const STA = {
    formal: 'Ledger rows ruled underneath, no box: a tick disc, the name in bold, the reason under it. A failed row keeps the red rule under it and a Retry button; an empty row is dashed and quiet.',
    light: 'Soft cards with a hair of shadow and a round corner; round marks. A failed row has a red edge and a Retry in the light button.',
    dark: 'Machined rows with square-ish marks (3 px) and a mono detail line. Loading shows the theme spinner in the mark.',
    cyberpunk:
        'Square plates with a hairline rim; a loading or failed row gets a 3 px bar on its start edge. The detail line is mono. Marks are square.',
    synthwave: 'Marquee rows with a pink hairline; a loading row glows. The detail is in the tech mono.',
    pastel: 'Round 2 px sticker rows; the ok mark is tilted -8 degrees like a stamp. The failed row keeps its red edge.',
    terminal:
        'Plain text rows with a dashed rule at the start, all mono: + ok, x failed, - empty, and the theme spinner for loading. A loading row has a solid rule.',
    forest: 'Rows with a 4 px start edge: dark for the quiet states, green for loading, red for failed. Marks are round.',
    blueprint: 'Dashed drafting boxes, square marks, mono detail; a loading row is drawn in a solid line.',
    solstice: 'Plain warm rows; the ok mark carries a faint green halo. Nothing else changes size.',
    brutalism: 'Slabs on a hard shadow with a 3 px line; marks are square with a heavy ring. A loading row takes the muted ground.',
    deco: "Plates with an inner hairline inlay, square marks. The failed row's red edge must not hide the inlay.",
    phantom: 'Slabs with a 4 px start edge (dark, red while loading, red-edge for failed), square marks, condensed type.',
    grotesk:
        'Rows ruled underneath by a 2 px black line, no box, bold names. A failed row keeps its red rule. Check no row wraps into two lines where one fits.',
    nostromo: 'Panel rows with a dark frame and 2 px marks; a loading row has an amber inner line. Detail in mono.',
    titanium: 'Plates with a strong edge, mono detail. Loading uses the theme spinner; nothing eases.',
};

export const FAC = {
    formal: 'Square-cornered rows. The name is truncated with an ellipsis, the count is right-aligned in tabular figures. Point at a row: a quiet wash and the only button appears; none of it moves the counts.',
    light: 'Pill rows with a soft wash; the only button appears on hover or when focus is in the row. The counts keep one column.',
    dark: "Square rows, mono counts, a faint wash. The checkbox is the theme's own.",
    cyberpunk: "Square rows with mono counts; the section title is a spaced mono label. The only button is the theme's ghost button.",
    synthwave: 'Slightly rounded rows with mono counts; the only button shows on hover.',
    pastel: 'Round rows with a soft wash; checkboxes are the sticker kind.',
    terminal: "All mono; rows are plain text with a wash on hover. The checkbox is the terminal's.",
    forest: 'Rows with the leaf corner, so the wash shows it; counts right-aligned.',
    blueprint: 'Mono counts, square rows; the checkbox is drawn in line.',
    solstice: 'Softly rounded rows with a warm wash.',
    brutalism: 'Heavy: on hover a row turns into a solid block of the secondary colour (yellow) with black type. The title above is bold.',
    deco: 'Square rows; the section title is in very widely spaced capitals.',
    phantom: "Square rows with a grey wash; the title is condensed capitals. The only button is phantom's key cap.",
    grotesk: 'Bold counts in black, square rows; the names must stay on one line and cut with an ellipsis, never wrap.',
    nostromo: "Slightly rounded rows with mono counts; the wash is the panel's.",
    titanium: 'Square rows, mono counts. Contact is instant, there is no fade on the wash.',
};
