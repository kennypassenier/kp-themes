/* research/character-chart, round 4 (Kenny, 2026-10-06 09:31): six new loading
   pictures for forest — the only aspect still open in group c ("do loading
   again, make it fit for a forest theme"; the round 2 and round 3 options
   — the pencil sketch, the compass needle, the pine cone drop, the trig
   point, the growth rings, the trail blaze — were all seen and rejected).
   Each picture fills the whole plot, edge to edge, per Kenny's new rule
   ("loading animations that take advantage of all the space that the
   element takes"), and animates at full motion only; the still frame under
   reduced motion is set directly in round4-c.css. */
export default {
    forest: {
        loading: [
            {
                key: 'r4-fo-canopy',
                name: 'The canopy',
                text: 'A canopy of leaves fills the whole plot and rustles across it, two layers of foliage drifting past each other at different speeds, as wind moves a forest from above.',
                ink: '--primary',
                ink2: '--chart-2',
            },
            {
                key: 'r4-fo-rain',
                name: 'Rain on the paper',
                text: 'Rain streaks the whole page on a slant, over and over, while a ring of splash marks grows and resets where the drops land, as weather does on a logbook left open.',
                ink: '--muted-foreground',
                ink2: '--primary',
            },
            {
                key: 'r4-fo-fireflies',
                name: 'Fireflies over the field',
                text: 'Two fields of fireflies drift slowly over the whole plot on their own wandering paths, never still, as they do over a clearing at dusk.',
                ink: '--accent',
                ink2: '--primary',
            },
            {
                key: 'r4-fo-fern',
                name: 'The fern unfurls',
                text: 'A fern frond uncurls from a tight coil to its full length across the plot, rotating open as it grows, over a chevron texture of leaflets already laid on the page.',
                ink: '--primary',
                ink2: '--foreground',
            },
            {
                key: 'r4-fo-mist',
                name: 'Mist through the trunks',
                text: 'Tree trunks stand ruled across the whole plot while a band of mist rolls through them from edge to edge, over and over, the way morning mist moves through a stand of trees.',
                ink: '--foreground',
                ink2: '--muted-foreground',
            },
            {
                key: 'r4-fo-map',
                name: 'The row is planted',
                text: 'The waiting plot is the bar’s planted row at its foot: seedlings on cleared ground and a grove of whole trees filling it start to end, holding, then leaving end to start.',
                ink: '--foreground',
                ink2: '--accent',
            },
        ],
    },
};
