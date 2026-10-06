/* research/character-tiles, round 2 (Kenny, 2026-10-06 18:04): the new options of group c.
   Phantom's tone stays round 1's three options (fixed in place in
   tiles-e.css, not replaced here) — only hover and live are new. Every
   option echoes an earlier phantom pick from research/THEME_PROFILES.md:
   the calling card, halftone, stamps, a pulled string, bullet holes,
   the folders shuffling, the menu's own "Snatched" hover. */
export default {
    phantom: {
        hover: [
            {
                key: 'r2-ph-hover-1',
                name: 'Snatched off the board',
                text: 'Echoes the menu’s own hover, “Snatched”: the card jumps up hard on a bigger offset shadow, as if pulled off the board. Open fills solid red; focus draws a dashed red ring, offset like a torn edge.',
            },
            {
                key: 'r2-ph-hover-2',
                name: 'Stamped again',
                text: 'Echoes the stamp ring of loading and the tone’s stamped mark: a double red ring stamps outward from the card and it tilts a degree further. Open underlines heavily in red; focus draws a solid stamped ring.',
            },
            {
                key: 'r2-ph-hover-3',
                name: 'The string snaps taut',
                text: 'Echoes “the string is pulled” (loading) and the graph’s “red string races out”: a flush red line draws tight along the top edge. Open underlines in red; focus is a flush solid red line, no offset, cut straight.',
            },
        ],
        live: [
            {
                key: 'r2-ph-live-1',
                name: 'Punched through',
                text: 'Echoes the chart’s event dots, “Bullet holes”: the mark punches outward in a hard scale burst with a red ring, then snaps back.',
            },
            {
                key: 'r2-ph-live-2',
                name: 'The dossier is refiled',
                text: 'Echoes the columns’ “The folders shuffle” and “a shiver”: the whole card shivers hard side to side with a jolt of rotation, harder and larger than a twang.',
            },
            {
                key: 'r2-ph-live-3',
                name: 'The red cut flashes',
                text: 'Echoes the calendar’s “The red cut” and the graph’s “red string races out”: a red bar cuts diagonally across the tile once, left to right, like a censor’s redaction.',
            },
        ],
    },
};
