/* research/character-menu, round 2 (Kenny, 2026-10-06 12:59): the new
   options of group a. Kenny rejected round 1's three loading options in
   dark, terminal and forest and asked for six new ones per theme, in line
   with what he already picked for that theme's other components
   (research/THEME_PROFILES.md). Every picture is built from the loading
   entry's own box, label and hint (`[data-kp-loading]`, the one disabled
   row a fill waits behind) and uses the whole space that row takes. */
export default {
    dark: {
        loading: [
            {
                key: 'r2-dk-load-1',
                name: 'The mill pass',
                text: 'A lit groove is milled across the row’s full width, left to right, then the cutter returns to pass again — as the meter’s milling pass and the chart’s mill pass.',
            },
            {
                key: 'r2-dk-load-2',
                name: 'The bus relay',
                text: 'A packet of light runs the row’s full length end to end, as a packet running the status bus on the graph, then loops back to start.',
            },
            {
                key: 'r2-dk-load-3',
                name: 'The die stamps',
                text: 'The whole row presses inward like metal under a die and springs back, as the meter’s and calendar’s die press, again and again.',
            },
            {
                key: 'r2-dk-load-4',
                name: 'The panel warms',
                text: 'The row brightens from dim to fully lit across its whole plate as a panel powering up, as the menu’s own open pick (Powered up) and the trend’s Switched on, then dims and warms again.',
            },
            {
                key: 'r2-dk-load-5',
                name: 'The scope trace',
                text: 'A phosphor trace sweeps the row’s full width leaving a fading tail behind it, as the oscilloscope shape option and the chart’s spectrometer.',
            },
            {
                key: 'r2-dk-load-6',
                name: 'The gauge needle sweeps',
                text: 'A needle pivots across the row’s full width from one edge and back, as the wooden-gauge logic of the meter’s machined channel, carried here in metal.',
            },
        ],
    },
    terminal: {
        loading: [
            {
                key: 'r2-tm-load-1',
                name: 'The log scrolls',
                text: 'Rows of phosphor text scroll upward through the row’s full height, as the chart’s and calendar’s boot log.',
            },
            {
                key: 'r2-tm-load-2',
                name: 'The cursor walks',
                text: 'A block cursor jumps in hard mono steps across the row’s full width and starts again, as the graph’s cursor blink carried into motion.',
            },
            {
                key: 'r2-tm-load-3',
                name: 'The brackets close',
                text: 'A [ and a ] slide in from the row’s two ends to meet at the middle and back out again, as the columns’ bracket tone.',
            },
            {
                key: 'r2-tm-load-4',
                name: 'The redraw flickers',
                text: 'The whole row flashes once brighter in two hard steps like a terminal redrawing its screen, as the meter’s and trend’s redraw tone.',
            },
            {
                key: 'r2-tm-load-5',
                name: 'The ping sweeps',
                text: 'A bright block bounces the row’s full width end to end and back, as a ping travelling the wire.',
            },
            {
                key: 'r2-tm-load-6',
                name: 'The trace writes',
                text: 'A line prints in across the row’s full width in hard steps, as the menu’s own open pick (Printed) and the columns’ line by line.',
            },
        ],
    },
    forest: {
        loading: [
            {
                key: 'r2-ft-load-1',
                name: 'Growth rings',
                text: 'Concentric rings widen outward to fill the row’s full width and contract back in, as the calendar’s tree rings and the trend’s growth ring.',
            },
            {
                key: 'r2-ft-load-2',
                name: 'Footsteps',
                text: 'A line of footprints walks the row’s full width, left to right, then the trail clears for the next pass, as the meter’s footsteps.',
            },
            {
                key: 'r2-ft-load-3',
                name: 'The mushroom ring',
                text: 'A ring of light pulses outward from the row’s middle to its full edges and fades back in, as the graph’s mushroom ring and its fireflies tracing the clearing.',
            },
            {
                key: 'r2-ft-load-4',
                name: 'Undergrowth creeps',
                text: 'A green wash grows in from the row’s left edge to fill its full width, then draws back to start, as the chart’s grows from the ground.',
            },
            {
                key: 'r2-ft-load-5',
                name: 'The post sways',
                text: 'The whole row rocks a few degrees like a trail marker post in the wind and settles back, as the columns’ post sways.',
            },
            {
                key: 'r2-ft-load-6',
                name: 'Falling leaves',
                text: 'Two leaves drift down the row’s full height in turn and are swept back up to fall again, as the calendar’s falling leaves.',
            },
        ],
    },
};
