/* research/character-busy, round 3 (Kenny, 2026-10-06 23:09): the new options of group b —
   nostromo and titanium, shape and phone. Round 1 and round 2 drew the same
   beige or grey rectangle with a rule or a stripe on it; Kenny: "helemaal
   nostromo niet waardig, blijf bij de waarden van het thema". Each shape here
   is one real piece of the theme's world, built from what the theme already
   has: nostromo's three are the ship's screen, its moulded case and its vent
   bank; titanium's three are the metal's three finishes (heat-tinted,
   anodised, bare-milled). The phone options change how the flat panel sits
   in a 334px pane, not only a hairline on it. */
export default {
    nostromo: {
        shape: [
            {
                key: 'r3-b-no-shape-1',
                name: 'MU/TH/UR’s screen',
                text: 'The panel is the ship computer’s screen: a dark tube set in a thick beige moulded bezel, the words in glowing amber phosphor capitals with a block cursor after them, scanlines drawn over the glass. It echoes the chart’s amber CRT and the calendar’s CRT duty roster. Unlike the other two it is a dark, lit screen, not the beige case.',
            },
            {
                key: 'r3-b-no-shape-2',
                name: 'The label-tape module',
                text: 'A raised beige plastic module, moulded with a lit top edge and a shadow under, the words punched on a strip of black embossed label tape stuck on slightly crooked, a lit orange LED in its corner. It echoes the buttons’ label tape, the meter’s embossed tape mark and the lamp every control carries. Unlike the other two the words sit on tape, not on glass or between vents.',
            },
            {
                key: 'r3-b-no-shape-3',
                name: 'The backlit vent bank',
                text: 'A darker moulded plate held between two banks of vent slots lit orange from inside, the rows behind it seen through a grille of vent ribs, the count in the Michroma display face. It echoes the meter’s backlit vents and the trend tile’s vent grille. Unlike the other two the light comes out of the slots at both ends, not from a screen or a lamp.',
            },
        ],
        phone: [
            {
                key: 'r3-b-no-phone-1',
                name: 'The reel window',
                text: 'The tape reel turns behind its own round dark window, set in a beige moulded rim and lit amber from inside, as the reels of a cassette deck show through the case. It echoes the tape-pack spinner and the amber CRT. Unlike the other two the accent sits round the spinner.',
            },
            {
                key: 'r3-b-no-phone-2',
                name: 'The vent slats',
                text: 'A row of vent slots lit orange from inside runs along the whole bottom edge of the flat panel. It echoes the meter’s backlit vents. Unlike the other two the accent is a full-width row along the edge.',
            },
            {
                key: 'r3-b-no-phone-3',
                name: 'The count on tape',
                text: 'The count is punched on its own short piece of orange label tape under the words, stuck on slightly crooked, the LED orange as a plate as the theme always uses it. It echoes the buttons’ label tape. Unlike the other two the accent is on the count itself.',
            },
        ],
    },
    titanium: {
        shape: [
            {
                key: 'r3-b-ti-shape-1',
                name: 'The heat-tinted chamfer',
                text: 'A dark plate with two corners cut, as the theme’s own chamfer cuts them, its whole edge heat-tinted gold to bronze to violet to blue, a bright tool line along the top, over the carbon twill. It echoes the meter’s heat-tinted groove and the key figure’s heat-tint rim. Unlike the other two it is dark metal with only its edge coloured by heat.',
            },
            {
                key: 'r3-b-ti-shape-2',
                name: 'The anodised tag',
                text: 'The whole plate is anodised: blue running into violet and cyan, a punched hole at its start like a tag on a wire, the words engraved in dark. It echoes the trend tile’s anodised tag, the menu’s anodised badge and the calendar’s anodised tiles. Unlike the other two the colour fills the whole plate.',
            },
            {
                key: 'r3-b-ti-shape-3',
                name: 'The bare-milled billet',
                text: 'A bright plate of bare machined metal with all four corners chamfered, a fine brushed grain across it and a counterbored rivet at each end, the words engraved in dark. It echoes the chart’s mill pass and its anodised rivet. Unlike the other two it is raw bright metal, no tint and no film.',
            },
        ],
        phone: [
            {
                key: 'r3-b-ti-phone-1',
                name: 'The engraved scale',
                text: 'An engraved scale of fine ticks, a longer tick every fifth, runs along the whole bottom edge of the flat panel. It echoes the chart’s engraved dial face. Unlike the other two the accent is a full-width scale along the edge.',
            },
            {
                key: 'r3-b-ti-phone-2',
                name: 'The count on a tag',
                text: 'The count sits on a small anodised tag with one corner cut, blue into violet, under the words. It echoes the trend tile’s anodised tag. Unlike the other two the accent is on the count itself.',
            },
            {
                key: 'r3-b-ti-phone-3',
                name: 'The tool holder',
                text: 'The drill bit lies in a dark milled pocket that fills the panel’s start from top to bottom, as a cutter sits in its holder. It echoes the menu’s cutter and the drill-bit spinner. Unlike the other two the accent sits round the spinner.',
            },
        ],
    },
};
