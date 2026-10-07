/* research/character-busy, round 2 (Kenny, 2026-10-06 22:30): new shapes of
   group b (high-contrast, sepia, blueprint, solstice, brutalism). Round 1's
   three shapes per theme differed by 0-4 % of their pixels — Kenny: "ik zie
   enkel dezelfde vorm en dezelfde loading screen". These three replace them,
   each a different silhouette (veil treatment, plate, frame, word setting),
   so they read apart at the review dialog's ~770px width. Each option's
   text names the approved pick (research/THEME_PROFILES.md) it echoes and
   what sets it apart from the other two. Keys follow round2-a's pattern:
   r2-<theme abbreviation>-shape-<n>. */
export default {
    'high-contrast': {
        shape: [
            {
                key: 'r2-hc-shape-1',
                name: 'The hazard board',
                text: 'Echoes the ink frame / the big print: a heavy diagonal hazard-stripe veil behind a thick solid square frame and a heavy ring on the spinner. Differs from the inverse plate and the signal corners by putting the pattern on the veil itself, not the plate.',
            },
            {
                key: 'r2-hc-shape-2',
                name: 'The inverse plate',
                text: 'Echoes the inverse plate pick: the plate itself is knocked out — ink and background swap — square, with no border, held by a hard 3px cutout ring instead of a frame. Differs from the hazard board and the signal corners by inverting the plate’s own colours rather than framing or outlining it.',
            },
            {
                key: 'r2-hc-shape-3',
                name: 'The signal corners',
                text: 'Echoes the signage pick: an open board carries only a thick rule top and bottom, no side frame, over a light veil. Differs from the hazard board and the inverse plate by leaving the sides open instead of closing a full frame or a full knockout.',
            },
        ],
    },
    sepia: {
        shape: [
            {
                key: 'r2-se-shape-1',
                name: 'The tipped-in plate',
                text: 'Echoes the tipped-in plate pick: a thin-framed plate sits inset in a soft paper-grain veil, held by a faint corner shadow as if mounted on an album page. Differs from the wax seal and the galley proof by its mounted, inset look rather than a stamped or press-strip one.',
            },
            {
                key: 'r2-se-shape-2',
                name: 'The wax seal plate',
                text: 'Echoes the rubber stamp / wax-seal beads pick: a deep-rounded plate in the primary ink with an inset glow, like a wax impression pressed into the paper. Differs from the tipped-in plate and the galley proof by its heavy rounding and glowing inset shadow instead of a flat inset or a top rule.',
            },
            {
                key: 'r2-se-shape-3',
                name: 'The galley proof',
                text: 'Echoes the galley sets / letterpress specimen pick: a square plate with no side border, only a thick rule across the top and a letterpress-dark inset shadow, like a proof strip pulled from the press. Differs from the tipped-in plate and the wax seal by carrying its frame on one edge only.',
            },
        ],
    },
    blueprint: {
        shape: [
            {
                key: 'r2-bp-shape-1',
                name: 'The title block',
                text: 'Echoes the title block pick: a dense millimetre grid fills the veil behind a square plate with a heavy rule closing off a title strip underneath. Differs from the dimension chain and the section view by carrying the grid on the veil and a closing rule, not on the plate.',
            },
            {
                key: 'r2-bp-shape-2',
                name: 'The dimension chain',
                text: 'Echoes the dimension line / dimension chain pick: a flat, ungridded veil behind a plate held only by dashed extension lines on its left and right edges, open top and bottom. Differs from the title block and the section view by using side lines instead of a filled grid or a hatch fill.',
            },
            {
                key: 'r2-bp-shape-3',
                name: 'The section view',
                text: 'The panel is an overlay sheet over the table: the popover’s ground in one thin steel frame, no shadow and no hatch, the veil clear, its words in the draughtsman’s lettering; the spinner is the compass.',
            },
        ],
    },
    solstice: {
        shape: [
            {
                key: 'r2-so-shape-1',
                name: 'The halo',
                text: 'Echoes the halo pick: a soft amber radial glow fills the veil behind a heavily rounded, borderless plate held by its own soft outer glow. Differs from the lanterns and the red sky by its rounded, glowing silhouette rather than a flat dusk or a sharp-edged sky band.',
            },
            {
                key: 'r2-so-shape-2',
                name: 'The lanterns',
                text: 'Echoes the lanterns pick: a dark, flat dusk veil behind a square plate that glows along its lower edge, as if lit from below. Differs from the halo and the red sky by keeping the veil flat and placing the only glow on the plate’s edge.',
            },
            {
                key: 'r2-so-shape-3',
                name: 'The red sky',
                text: 'Echoes the red sky pick: a warm linear sky wash runs the full height of the veil behind a sharp-edged, square-cornered plate split by a thick horizon rule. Differs from the halo and the lanterns by sweeping the veil top to bottom and keeping every edge sharp.',
            },
        ],
    },
    brutalism: {
        shape: [
            {
                key: 'r2-br-shape-1',
                name: 'The warning poster',
                text: 'Echoes the warning poster pick: a heavy diagonal hazard-stripe veil sits behind a thick-bordered, uppercase plate thrown forward on a hard offset shadow. Differs from the stacked blocks and the sticker sheet by carrying the hazard pattern on the veil, not the plate.',
            },
            {
                key: 'r2-br-shape-2',
                name: 'The stacked blocks',
                text: 'A flat, heavy veil behind a square, borderless ink plate with paper words, standing on one 6px hard shadow. Differs from the warning poster and the sticker sheet by being a single plain slab instead of a framed or tilted plate.',
            },
            {
                key: 'r2-br-shape-3',
                name: 'The sticker sheet',
                text: 'Echoes the sticker sheet pick: a light, flat veil behind a heavily rounded plate with a dashed perforation border, tipped a couple of degrees as if peeled off the sheet. Differs from the warning poster and the stacked blocks by rounding and tilting the plate instead of squaring and stacking it.',
            },
        ],
    },
};
