/* research/character-chart, round 3 (Kenny, 2026-10-06): the new options of
   group a — cyberpunk (shape, loading, arrival) and pastel (shape, events).
   Every other aspect of these two themes is settled in round 2 and is not
   touched here. Loading, arrival and events each have their own CSS in
   round3-a.css, drawn fresh from each theme's own world (data rain, ICE,
   netrunner HUD for cyberpunk; sprinkles, balloons, riso stickers for
   pastel) — none of them is the shared hazard/radar/dither or bead/pin/
   target vocabulary aspects.css already draws, which is what Kenny sent
   the first pass of this file back for. */
export default {
    cyberpunk: {
        shape: [
            {
                key: 'b',
                name: 'The hazard terminal',
                text: 'A plot framed in signal yellow with hazard stripes along its top, the grid in cyan dots, the tick labels in the condensed display face. The lines are drawn hard, with sharp corners and no glow, over areas hatched at forty-five degrees. The tooltip is a yellow plate with black text and a cut corner; the legend black plates with a yellow bar under the pressed one. Loading crawls the hazard stripes across the plot.',
            },
            {
                key: 'r3-cy-circuit',
                name: 'The circuit board',
                text: 'A dark board behind the lines: a faint copper-trace grid with a solder pad lit at every crossing, cyan dotted gridlines, uppercase mono figures. The lines glow in their own colour over firm areas; the legend mono tabs with a lit pad, cyan-ringed when pressed; the crosshair a fine cyan dash.',
            },
            {
                key: 'r3-cy-ice',
                name: 'The holo plot',
                text: 'The plot is a holo plate: a void plate with a yellow rim glowing 10 px inward, scan lines at 135 degrees and the 14 px notch cut at its dossier corner, the grid in long yellow tripwire dashes. The lines are drawn square and sharp with no glow at rest. The title and the legend are prefixed cyan mono capitals, the legend keys notched at 8 px, lit cyan when pressed; the crosshair a fine yellow dash.',
            },
        ],
        loading: [
            {
                key: 'r3-cy-ld-rain',
                name: 'Signal loss',
                ink: '--primary',
                ink2: '--accent',
                text: "The word LOADING is deciphered from noise glyphs over the empty plot, holds in neon with a cyan and a red copy, tears sideways and is sliced away, again: 1800 ms in hard ticks, like a VCR's on-screen text.",
            },
            {
                key: 'r3-cy-ld-ice',
                name: 'The ICE wall',
                ink: '--accent',
                ink2: '--primary',
                text: 'A wireframe diamond panel sits over the plot; a second, filled diamond pulses behind it, a firewall taking a hit over and over.',
            },
            {
                key: 'r3-cy-ld-hud',
                name: 'The netrunner lock',
                ink: '--accent',
                ink2: '--destructive',
                text: "A reticle frames the plot's centre while a crosshair inside it snaps through a mechanical lock-on cycle, zooming and settling, zooming again.",
            },
        ],
        arrival: [
            {
                key: 'r3-cy-ar-uplink',
                name: 'The uplink sync',
                text: 'The lines sync upward from the floor like a hologram booting, a slight skew settling flat once they are fully up.',
            },
            {
                key: 'r3-cy-ar-chrome',
                name: 'The channel split',
                text: 'The plot and its lines are a yellow copy and a cyan copy until they meet: four ticks of 120 ms, 6, 4, 2, 1 px, the notch cut at every tick.',
            },
            {
                key: 'r3-cy-ar-lock',
                name: 'The signal lock',
                text: 'The lines reveal left to right while the whole series jitters sideways, a signal hunting for lock before it snaps still.',
            },
        ],
    },
    pastel: {
        shape: [
            {
                key: 'r3-pa-mallow',
                name: 'The marshmallow pillow',
                text: 'A puffed, deeply rounded plot on a soft pink-to-lilac glow, thick candy-smooth lines with a gentle shadow beneath them, and a faint dotted grid. The legend is squeezable pill buttons, filled solid when pressed.',
            },
            {
                key: 'r3-pa-bubblegum',
                name: 'The bubblegum pop',
                text: 'A comic-book plot: a bold black outline around the whole chart and around every line, a dotted paper behind it like a sheet of bubblegum, and a dashed black grid. The legend is black-ringed circle buttons that fill solid when pressed.',
            },
            {
                key: 'r3-pa-macaron',
                name: 'The macaron stack',
                text: 'The plot shaded like a macaron shell, its colour fading into the cream filling toward the bottom, over a faint crumbly dotted grid. The legend is shell-coloured pills ringed in their filling colour when pressed.',
            },
        ],
        events: [
            {
                key: 'r3-pa-ev-sprinkle',
                name: 'Sprinkle burst',
                text: 'Each event is a small candy dot with a scatter of tiny coloured sprinkles thrown round it, its line a trail of fine dots.',
            },
            {
                key: 'r3-pa-ev-balloon',
                name: 'Balloon pins',
                text: 'Each event is a tiny balloon shape on a thin, curling string, planted above the line.',
            },
            {
                key: 'r3-pa-ev-riso',
                name: 'Riso stickers',
                text: 'Each event is a soft riso-print sticker: the dot carries a slightly misregistered colour ghost just behind it, a dotted line beneath.',
            },
        ],
    },
};
