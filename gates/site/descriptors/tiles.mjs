// Page descriptor for the "tiles" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const tilesDescriptor = {
        id: 'tiles',
        title: 'Tiles of one height',
        group: 'Structure',
        classes: ['kp-tiles'],
        exports: [],
        intro: '`.kp-tiles` lays the package’s own `.kp-card` out in a grid: every tile as tall as the tallest tile of the grid, on every row, and each card’s footer kept to its bottom edge, so the footers of a row form one line however long the text above them is.',
        whenToUse:
            'For a grid of records of the same kind: pump houses, projects, services. Not for cards of different kinds or weights on one page, which want a layout of their own, and not for a single card.',
        examples: [
            {
                title: 'Cards with footers',
                why: 'The second card has the longest text; every card takes its height, and every footer keeps to the bottom.',
                markup: `
<ul class="kp-tiles">
<li class="kp-card">
<h3 class="kp-card__title">Pump house 1</h3>
<p class="kp-card__body">Two pumps, both running.</p>
<div class="kp-card__footer kp-row kp-row--between"><span class="kp-timestamp">Read 2 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#">Open</a></div>
</li>
<li class="kp-card">
<h3 class="kp-card__title">Pump house 3</h3>
<p class="kp-card__body">Pressure below 2.1 bar for forty minutes; the field engineer is on the way.</p>
<div class="kp-card__footer kp-row kp-row--between"><span class="kp-timestamp">Read 1 min ago</span><a class="kp-button kp-button--sm kp-button--ghost" href="#">Open</a></div>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-tiles', what: 'A list or a div of `.kp-card`s: as many columns as fit, every row as tall as the tallest tile. A tile’s title is a step under a page card’s.' },
            { name: 'the footer', what: 'A `.kp-card__footer` keeps to the tile’s bottom edge; the body never touches its rule.' },
            { name: 'pastel', what: 'In pastel every tile is fixed to the page with a thumbtack at its top centre, which comes out first when the tile leaves.' },
            { name: 'data-kp-tiles-keys', what: 'One place in the tab order for a board of tiles (a roving tab stop); Left, Right, Up, Down, Home, End, PageUp and PageDown move between tiles. `data-kp-tiles-keys-exit` says how the board is left; the events are `kp-tiles-move` and `kp-tiles-exit`.' },
        ],
        accessibility: [
            'Built in — the grid is layout only; the cards keep their order in the markup, which is the reading order.',
            'Yours — use a list (`ul`) when the tiles are a list of like records, so a screen reader says how many there are.',
        ],
    };
