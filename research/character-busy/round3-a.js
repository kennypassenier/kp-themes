/* research/character-busy, round 3 (Kenny, 2026-10-06 23:09): the new options of group a.
   forest: the failed state; grotesk: the shape; lapis: the shape and the phone. Kenny
   rejected rounds 1 and 2 of these as too weak ("deze voorstellen zijn echt slecht");
   each option here is a different object from the theme's own world, not a recolour or
   an edge accent, and each text names the approved pick it echoes
   (research/THEME_PROFILES.md, each character demo's decided.json). */
export default {
    forest: {
        failure: [
            {
                key: 'r3-fo-failure-1',
                name: 'Trail closed',
                text: "A strip of red flagging tape is strung across the top of the alert, tilted, dotted down its middle and notched at both ends, as a ranger closes a trail; the plate stays the logbook's kraft card. Echoes the calendar's flagging tape and the blaze colour of the menu's and the trend's trail blaze. Unlike the other two, the plate stays plain: the failure is a tape strung across it.",
            },
            {
                key: 'r3-fo-failure-2',
                name: 'The ranger’s notice',
                text: 'The alert becomes a red wooden notice board with a faint grain, hung on a cord from a nail above it, and it swings on that cord when it appears, settling in a few smaller swings. Echoes the state badge’s tag that swings and the drawer’s bark plaque. Unlike the other two, the whole plate turns red and hangs: the board itself is the warning.',
            },
            {
                key: 'r3-fo-failure-3',
                name: 'Fire danger: extreme',
                text: "The alert is a ranger station's wooden fire-danger board: a half dial of four bands (low to extreme) stands at its leading side, and its needle sweeps from low into the red when the alert appears. Echoes the meter's wooden gauge. Unlike the other two, the failure is read off a gauge, not off tape or a red board.",
            },
        ],
    },
    grotesk: {
        shape: [
            {
                key: 'r3-gk-shape-1',
                name: 'The interchange',
                text: 'A heavy red line runs across the whole veil and a heavy black line runs down it; the panel is the interchange where they cross, a white box with a thick black frame. Echoes the graph’s transit map and its train that passes. Unlike the other two, the drawing reaches past the panel: two transit lines cross the rows to meet it.',
            },
            {
                key: 'r3-gk-shape-2',
                name: 'The ruled grid',
                text: 'The veil is ruled into twelve hairline columns and the panel snaps to them: no frame, set flush left from the first column across six, under one heavy black rule, the words in bold Archivo, the count in red. Echoes the KPI’s ruled grid and the calendar’s and the chart’s Swiss grid. Unlike the other two, the panel is not centred and has no frame at all: the grid holds it.',
            },
            {
                key: 'r3-gk-shape-3',
                name: 'The flap board',
                text: 'The panel is a black departure board: every letter of the words sits on its own flap, a dark tile split by its hinge, in white capitals, the count in red underneath. Echoes the tiles’ flap board loading and the trend’s and the menu’s transit board. Unlike the other two, the words themselves carry the shape, letter by letter, on a black plate.',
            },
        ],
    },
};
