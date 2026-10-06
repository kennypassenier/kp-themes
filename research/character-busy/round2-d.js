/* research/character-busy, round 2 (Kenny, 2026-10-06 22:30): new shapes of
   group d (grotesk, lapis, nostromo, titanium) — round 1's three shapes per
   theme differed by only 0-4 % of their pixels. Each option below is a
   clearly different silhouette (a cut corner, a bar, a ring, a medallion,
   a pill), not a palette or type variant of the same rectangle, and each
   says in its text which of the theme's approved picks (research/THEME_
   PROFILES.md) it echoes and what sets it apart from the other two. */
export default {
    grotesk: {
        shape: [
            {
                key: 'r2-gr-shape-1',
                name: 'The timetable board',
                text: "A squared plate ruled top and bottom with heavy primary bars and uppercase display type, echoing the meter's Timetable arrival and the transit board itself. Unlike the punch card and the platform sign, it stays a flat rectangle with its weight carried in two thick rules, nothing cut or rounded.",
            },
            {
                key: 'r2-gr-shape-2',
                name: 'The punch card',
                text: "A plate with its top-left corner cut away over faint ruled columns, set in the monospace the chart's punch card tooltip uses. Unlike the timetable board and the platform sign, its own silhouette is cut, not merely ruled or inverted.",
            },
            {
                key: 'r2-gr-shape-3',
                name: 'The platform sign',
                text: 'A full pill in the primary colour, inverted as the columns tile is on its Inverted live update, set in bold uppercase for the big numerals. Unlike the timetable board and the punch card, it is rounded and reads as a solid tinted badge, not an outlined rectangle.',
            },
        ],
    },
    lapis: {
        shape: [
            {
                key: 'r2-la-shape-1',
                name: 'The illuminated initial',
                text: "A plate rounded only at two opposite corners with a gold wash let into the top-left, as an illuminated initial is gilded at its corner, echoing the columns tile's Gilded in arrival. Unlike the rubricated ledger and the gold medallion, only the corners carry the gilt; the rest of the frame stays plain.",
            },
            {
                key: 'r2-la-shape-2',
                name: 'The rubricated ledger',
                text: "A square-cornered plate with a thick rubric column down its left edge, the mark a rubricator leaves at each entry, echoing the graph's rubricator loading and the trend tile's rubric tone. Unlike the illuminated initial and the gold medallion, the gilt sits as one bar, not a corner or a ring.",
            },
            {
                key: 'r2-la-shape-3',
                name: 'The gold medallion',
                text: "A rounded medallion ringed in alternating gold and ground over a faint gold-dust wash at its centre, echoing the chart's gold dust loading and its gold event rings. Unlike the illuminated initial and the rubricated ledger, the whole plate is round, not a rectangle with a gilt accent.",
            },
        ],
    },
    nostromo: {
        shape: [
            {
                key: 'r2-no-shape-1',
                name: 'The warning lamp bank',
                text: "A plate with two corners cut away like a hazard placard, framed in a heavy accent border over faint diagonal hazard striping, echoing the graph's warning lamp pick. Unlike the CRT bezel and the readout bank, its own silhouette is cut at the corners, not rounded or ruled.",
            },
            {
                key: 'r2-no-shape-2',
                name: 'The CRT bezel',
                text: "A deeply rounded plate with an inset bevel and heavier scanlines, the tube's own bezel, echoing the amber CRT and the CRT radar. Unlike the warning lamp bank and the readout bank, it alone reads as a rounded screen rather than a flat panel.",
            },
            {
                key: 'r2-no-shape-3',
                name: 'The readout bank',
                text: 'A flat square-cornered plate braced with heavy accent rules top and bottom, as an instrument readout bank is braced, echoing the vent grille. Unlike the warning lamp bank and the CRT bezel, nothing is cut or rounded: the bracing rules alone carry its weight.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                key: 'r2-ti-shape-1',
                name: 'The engraved dial face',
                text: 'A round dial face ringed in fine engraved ticks, standing for the engraved dial face and the instrument dial. Unlike the anodised plate and the milled bezel, it alone is round, its ticks engraved rather than brushed or knurled.',
            },
            {
                key: 'r2-ti-shape-2',
                name: 'The anodised plate',
                text: 'A flat square-cornered plate washed diagonally in a faint anodised tint with a single rivet point at its corner, echoing the anodised tiles and the anodised rivet. Unlike the dial face and the milled bezel, it stays flat and square, the anodising carried only in the wash and the one rivet.',
            },
            {
                key: 'r2-ti-shape-3',
                name: 'The milled bezel',
                text: 'A generously rounded plate ringed in a double machined bezel over a fine diagonal knurl, echoing the mill pass and the knurl that catches. Unlike the dial face and the anodised plate, its bezel is a double ring, not engraved ticks or a flat rivet.',
            },
        ],
    },
};
