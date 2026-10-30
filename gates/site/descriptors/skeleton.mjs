// Page descriptor for the "skeleton" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const skeletonDescriptor = {
        id: 'skeleton',
        title: 'Skeleton',
        group: 'Feedback',
        classes: ['kp-skeleton'],
        exports: ['Skeleton'],
        intro: 'Grey shapes standing in for content that is on its way, in the shape of what will arrive. It pulses where motion is welcome and stands still where it is not.',
        whenToUse:
            'For a first paint whose layout you already know — a list of cards, a table, a profile. Not for a short wait, where the skeleton is on screen more briefly than it takes to understand; and not where the shape is a guess, because a skeleton that does not match what arrives is a jump.',
        examples: [
            {
                title: 'A paragraph, a block and an avatar',
                why: 'Three shapes: lines, a block for an image or a card, and a circle. Stacked lines take their distance from the stylesheet rather than from an inline style nothing could beat.',
                markup: `
<div aria-hidden="true">
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
</div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--block"></span></div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--circle"></span></div>
`,
            },
            {
                title: 'A card of skeletons',
                why: 'A card whose content is on its way: a block for its picture, two lines for its words. In pastel everything that waits becomes caterpillar: each line a row of pom-poms with a head, the block a plate with a head on its top-end corner and legs along its foot that step in turn, and the circle a body with two legs.',
                markup: `
<div class="kp-card" aria-hidden="true">
<span class="kp-skeleton kp-skeleton--block"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton kp-skeleton--circle" style="inline-size: 3rem"></span>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-skeleton', what: 'One line, at the height of a line of text.' },
            { name: '.kp-skeleton--block', what: 'A taller rectangle for an image, a card or a chart.' },
            { name: '.kp-skeleton--circle', what: 'A round one for an avatar; it keeps its aspect whatever width it is given.' },
            { name: 'stacked', what: 'Adjacent skeletons take a distance from the stylesheet, so a paragraph of them needs no wrapper.' },
            { name: 'reduced motion', what: 'The pulse is inside the reduced-motion guard; the shapes are simply there for a reader who asked for stillness.' },
            { name: 'pastel: the caterpillar', what: 'In pastel a line is a row of pom-poms with a head, a block a plate with a head and stepping legs, and a circle a pom-pom body on two legs; js/loading-pieces.js adds the pieces and the part carries `data-kp-pieces` while they are there. Without the script a line shows a still row of pom-poms.' },
        ],
        accessibility: [
            'Built in — the pulse changes opacity slowly enough to stay well under the flash threshold, and the motion gate measures it.',
            'Built in — the animation stops entirely where less motion was asked for.',
            'Yours — hide the skeleton from a screen reader. It stands for content; it is not content.',
            'Yours — announce the arrival of the real thing, and keep the shape close enough that nothing jumps.',
        ],
    };
