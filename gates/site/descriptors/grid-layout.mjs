// Page descriptor for the "grid-layout" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const gridLayoutDescriptor = {
        id: 'grid-layout',
        title: 'Movable grid layout',
        group: 'Data',
        classes: ['kp-grid', 'kp-grid-wrap'],
        exports: ['GridLayout'],
        aliases: ['tile', 'columns', 'rows', 'commit', 'label', 'step', 'pointer', 'dragging'],
        intro: 'A dashboard the reader arranges: tiles on a coarse grid that move with the arrow keys and resize with Shift and the arrows, and a layout that can be handed back to be stored. Dragging exists too, and it is the half that was easy.',
        whenToUse:
            'For a dashboard whose readers do not agree about what matters. Not for a page whose layout you decide — the automatic grid of the layout layer is a class, needs no script and cannot be knocked out of shape. Not on a phone: below the narrow threshold the arrangement stops being an arrangement and becomes one column in source order.',
        examples: [
            {
                title: 'Three tiles on a six-column grid',
                why: 'The position lives in attributes rather than in inline styles, because the consumer stores the numbers and the stylesheet turns them into a grid area. Reading a layout back out of a style string is how a dashboard loses somebody’s arrangement. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, so the element that changes column count cannot be the one that is the container. GridLayout renders it for you.',
                markup: `
<div class="kp-grid-wrap">
<div class="kp-grid" data-kp-grid data-kp-columns="6">
<div class="kp-grid__tile" data-kp-tile="cpu" data-kp-label="CPU" data-x="0" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">CPU</div>
<div class="kp-grid__tile" data-kp-tile="ram" data-kp-label="RAM" data-x="2" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">RAM</div>
<div class="kp-grid__tile" data-kp-tile="disk" data-kp-label="Disk" data-x="4" data-y="0" data-w="2" data-h="2" tabindex="0" role="group">Disk</div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-grid__tile', what: 'One tile. It is a tab stop, because moving it is a keyboard gesture first and a drag second.' },
            { name: 'moving / resizing', what: 'Arrows move, Shift and the arrows resize, and the tile says where it is and how big it is in words.' },
            { name: 'dragging', what: 'While a pointer is moving a tile it is marked, so the stylesheet can show it leaving its place.' },
            { name: '.kp-grid-wrap', what: 'The box the grid measures itself against. Below the narrow threshold it is the wrapper’s width that decides, not the window’s, so a grid in a 300px panel of a wide page collapses too.' },
            { name: 'narrow', what: 'Below the narrow threshold the grid becomes one column in source order: a six-column dashboard on a phone is six columns of nothing.' },
            { name: 'commit', what: 'A drag reports its final layout once the movement settles rather than on every pixel.' },
        ],
        accessibility: [
            'Built in — every gesture has a keyboard equivalent, and the keyboard one is the one the browser suite drives.',
            'Built in — a tile keeps its own name and gets its geometry as a description, so the announcement is “CPU, two by one at column one” rather than a number salad instead of the name.',
            'Built in — the layout is reported as data and can be applied again, so a reader’s arrangement survives a reload.',
            'Yours — name every tile. A group with no name is announced as a group.',
            'Yours — store the layout you are handed; the grid does not.',
            'Yours — keep a sensible source order, because that is the order on a narrow screen and for a screen reader.',
        ],
    };
