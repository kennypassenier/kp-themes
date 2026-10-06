// research/character-menu, round 2 (Kenny, 2026-10-06 12:59): new loading
// pictures for brutalism, grotesk, nostromo and titanium. Round 1's three
// loading options in each of these themes were rejected ("While loading:
// new options"); round 1's shape, open, tone and interact picks stand and
// are not touched here. Six fresh options per theme, built from the
// loading row's own box (`[data-kp-loading]`, the one disabled entry a
// fill waits behind) — never a detached shape. Where an option echoes a
// pick already made elsewhere in the same theme (research/THEME_PROFILES.md),
// its text says so, per Kenny's coherence rule (2026-10-06): new proposals
// must speak the theme's established language.

/** @typedef {{ key: string, name: string, text: string }} Option */

export default {
    brutalism: {
        loading: [
            {
                key: 'r2-bru-load-1',
                name: 'The rivets gun',
                text: 'Rivets punch along the loading row in a hard marching line, filling its whole width, as the chart’s rivet gun.',
            },
            {
                key: 'r2-bru-load-2',
                name: 'Cast in one pour',
                text: 'A cast pour fills the loading row from its left edge in hard steps, then drops away in one cut, as the graph is cast in one pour and the trend’s own pour.',
            },
            {
                key: 'r2-bru-load-3',
                name: 'The blocks stack up',
                text: 'Blocks stack from the loading row’s floor to its ceiling in hard steps, then the stack is knocked flat, as the meter’s own stacked blocks.',
            },
            {
                key: 'r2-bru-load-4',
                name: 'The bar is stamped across',
                text: 'A heavy bar stamps down at a new place across the loading row’s width, step by step, as the columns’ bar stamps.',
            },
            {
                key: 'r2-bru-load-5',
                name: 'The poster shadow slams',
                text: 'The loading row’s own hard offset shadow slams flat and springs back out, as the poster block’s shadow and the open row’s Slammed.',
            },
            {
                key: 'r2-bru-load-6',
                name: 'The hazard band marches',
                text: 'Hazard stripes march the loading row’s full width in hard steps, as the trend’s own hazard band.',
            },
        ],
    },
    grotesk: {
        loading: [
            {
                key: 'r2-gro-load-1',
                name: 'The express passes',
                text: 'A heavy marker runs the loading row’s full width in hard steps and cuts back to the start, as the meter’s own Express.',
            },
            {
                key: 'r2-gro-load-2',
                name: 'The ruling pen scores',
                text: 'A fine rule scores across the loading row in hard steps, then is wiped and scored again, as the graph’s ruling pen scores every line.',
            },
            {
                key: 'r2-gro-load-3',
                name: 'The grid builds',
                text: 'Vertical grid rules build across the loading row’s width in hard steps, as the chart’s own grid build.',
            },
            {
                key: 'r2-gro-load-4',
                name: 'The timetable advances',
                text: 'Tick marks march along the loading row like a split-flap timetable advancing, as the meter’s own Timetable.',
            },
            {
                key: 'r2-gro-load-5',
                name: 'The punch card reads',
                text: 'A row of punched dots reads across the loading row’s full width, as the chart’s own punch card.',
            },
            {
                key: 'r2-gro-load-6',
                name: 'The red margin ticks',
                text: 'Ticks in the margin colour build down the loading row’s left edge, step by step, as the index card’s red margin and the destructive entry’s own red margin.',
            },
        ],
    },
    nostromo: {
        loading: [
            {
                key: 'r2-nos-load-1',
                name: 'The relay clacks on',
                text: 'Relay segments clack on across the loading row, left to right, then clack off together, as the meter’s own Relay clack.',
            },
            {
                key: 'r2-nos-load-2',
                name: 'The phosphor trace burns',
                text: 'A trace burns across the loading row leaving its own fading afterglow, as the chart’s own phosphor trace.',
            },
            {
                key: 'r2-nos-load-3',
                name: 'The warning lamp blinks',
                text: 'The loading row flashes like a warning lamp, on and off in hard steps, as the graph’s own warning lamp.',
            },
            {
                key: 'r2-nos-load-4',
                name: 'The duty roster prints',
                text: 'Rows print down the loading row’s height in hard steps, as the CRT duty roster’s own printing.',
            },
            {
                key: 'r2-nos-load-5',
                name: 'The scope blips',
                text: 'A blip surfaces and travels the loading row’s full width before it is cut and surfaces again, as the graph’s blips surfacing round the scope.',
            },
            {
                key: 'r2-nos-load-6',
                name: 'The bracketed readout steps',
                text: 'A bracketed frame steps along the loading row’s width, as the columns’ own bracketed readout.',
            },
        ],
    },
    titanium: {
        loading: [
            {
                key: 'r2-tin-load-1',
                name: 'The mill pass cuts',
                text: 'A milled cut grows across the loading row’s width in hard steps, then is run again, as the chart’s own mill pass.',
            },
            {
                key: 'r2-tin-load-2',
                name: 'The heat-tint spreads',
                text: 'The temper colours of a heat-tint spread across the loading row’s width in hard steps, as the meter’s own heat-tinted groove.',
            },
            {
                key: 'r2-tin-load-3',
                name: 'The machined ticks step',
                text: 'Machined tick marks build along the loading row’s width, one notch at a time, as the meter and chart’s own machined tick.',
            },
            {
                key: 'r2-tin-load-4',
                name: 'The rivets seat',
                text: 'Anodised rivets seat along the loading row’s full width in a marching line, as the chart’s own anodised rivet.',
            },
            {
                key: 'r2-tin-load-5',
                name: 'The dial graduates round',
                text: 'A graduation mark steps along the loading row’s width like a dial advancing a notch, as the instrument dial picked for shape and trend.',
            },
            {
                key: 'r2-tin-load-6',
                name: 'The etched line deepens',
                text: 'A line etched across the loading row deepens in hard steps, then is lifted back shallow, as the chart’s own etched in.',
            },
        ],
    },
};
